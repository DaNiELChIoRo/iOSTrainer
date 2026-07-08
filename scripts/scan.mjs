#!/usr/bin/env node
/**
 * iOS Trainer — interview-question scan pipeline (local Ollama).
 *
 * 1. Fetches question "seeds" from permitted iOS interview-question sources.
 *    - Honors robots.txt for `User-agent: *` and skips any domain whose
 *      Content-Signal opts out of AI use (ai-train=no / ai-input=no).
 * 2. Deduplicates seeds against the existing bank using Ollama embeddings
 *    (nomic-embed-text) + cosine similarity — skips anything we already cover.
 * 3. For genuinely new topics, asks a local Ollama chat model to author an
 *    original multiple-answer question in the app's schema.
 * 4. Appends accepted questions to assets/js/questions.auto.js, tagged with
 *    source/origin/date so they stay separate from the hand-curated bank.
 *
 * No external npm deps — uses Node's global fetch (Node 18+).
 *
 * Env overrides:
 *   OLLAMA_URL   (default http://localhost:11434)
 *   GEN_MODEL    (default gemma3:27b, falls back to llama3:latest)
 *   EMBED_MODEL  (default nomic-embed-text)
 *   MAX_NEW      (default 8)   — cap new questions added per run
 *   SIM_THRESHOLD(default 0.72) — >= means "we already have a related question"
 *   DRY_RUN      (default 0)   — 1 = don't write, just report
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const JS = (f) => path.join(ROOT, "assets", "js", f);
const AUTO_FILE = JS("questions.auto.js");

const OLLAMA = process.env.OLLAMA_URL || "http://localhost:11434";
const GEN_MODELS = [process.env.GEN_MODEL || "gemma3:27b", "llama3:latest", "gemma4:latest"];
const EMBED_MODEL = process.env.EMBED_MODEL || "nomic-embed-text";
const MAX_NEW = parseInt(process.env.MAX_NEW || "8", 10);
const SIM_THRESHOLD = parseFloat(process.env.SIM_THRESHOLD || "0.72");
const DRY_RUN = process.env.DRY_RUN === "1";

// Sources are gated by robots.txt + AI content-signals at runtime; disallowed
// ones (e.g. sites that set ai-train=no) are skipped automatically.
const SOURCES = [
  "https://raw.githubusercontent.com/onthecodepath/iOS-Interview-Questions/master/README.md",
  "https://raw.githubusercontent.com/dashvlas/awesome-ios-interview/master/README.md",
  // objc.io — advanced iOS/macOS articles (no robots/AI restrictions).
  "https://www.objc.io/blog/",
  // Included deliberately to demonstrate the robots/AI-signal guard skipping it:
  "https://www.hackingwithswift.com/interview-questions",
];

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

/* ----------------------------------------------------------- load existing */
function loadWindowGlobals(files) {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  for (const f of files) {
    if (!fs.existsSync(JS(f))) continue;
    vm.runInContext(fs.readFileSync(JS(f), "utf8"), sandbox, { filename: f });
  }
  return sandbox.window;
}

/* ------------------------------------------------------------------ robots */
const robotsCache = new Map();
async function robotsAllowed(url) {
  const u = new URL(url);
  const origin = u.origin;
  if (!robotsCache.has(origin)) {
    let txt = "";
    try {
      const r = await fetch(origin + "/robots.txt", { headers: { "User-Agent": "iOSTrainer-scan" } });
      if (r.ok) txt = await r.text();
    } catch { /* no robots => allow */ }
    robotsCache.set(origin, txt);
  }
  const txt = robotsCache.get(origin);
  if (!txt) return { allowed: true, reason: "no robots.txt" };

  // AI opt-out signal (Cloudflare content signals)
  const sig = (txt.match(/^\s*Content-Signal:\s*(.+)$/im) || [])[1] || "";
  if (/ai-train\s*=\s*no/i.test(sig) || /ai-input\s*=\s*no/i.test(sig)) {
    return { allowed: false, reason: `Content-Signal opts out of AI use (${sig.trim()})` };
  }

  // Disallow rules for the generic user-agent block
  const lines = txt.split(/\r?\n/);
  let inStar = false, disallows = [];
  for (const line of lines) {
    const m = line.match(/^\s*(User-agent|Disallow|Allow):\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === "user-agent") inStar = val === "*";
    else if (inStar && key === "disallow" && val) disallows.push(val);
  }
  const p = u.pathname;
  for (const d of disallows) {
    const rx = "^" + d.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    if (new RegExp(rx).test(p)) return { allowed: false, reason: `Disallow ${d}` };
  }
  return { allowed: true, reason: "permitted" };
}

/* -------------------------------------------------------------- extraction */
async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": "iOSTrainer-scan (personal quiz builder)" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return await r.text();
}

function extractSeeds(raw) {
  // strip tags if it's HTML, keep text
  const text = raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  const seeds = new Set();
  for (let line of text.split(/\r?\n/)) {
    line = line.replace(/^[\s>*\-#0-9.)]+/, "").replace(/&amp;/g, "&").trim();
    // a reasonable "interview question": ends in ?, sane length, has a verb-ish word
    if (/\?$/.test(line) && line.length >= 15 && line.length <= 140 && /\s/.test(line)) {
      // drop meta/section questions
      if (/what is this for|why should|do you have any favorite|walk me through/i.test(line)) continue;
      seeds.add(line.replace(/\s+/g, " "));
    }
  }
  return [...seeds];
}

/* ---------------------------------------------------------------- ollama */
async function embed(text) {
  const r = await fetch(OLLAMA + "/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
  });
  if (!r.ok) throw new Error("embed HTTP " + r.status);
  const j = await r.json();
  return j.embedding;
}
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function chatJSON(seed, topicsBlock) {
  const sys =
    "You are an expert iOS engineer writing interview-prep quiz questions. " +
    "Return ONLY a JSON object, no prose. The question must be technically accurate for modern Swift/iOS.";
  const user =
    `Allowed topic keys (use exactly one):\n${topicsBlock}\n\n` +
    `Seed interview question: "${seed}"\n\n` +
    `Write ONE multiple-answer quiz question as JSON with this exact shape:\n` +
    `{"topic":"<one allowed key>","prompt":"<clear question>","options":[` +
    `{"text":"...","correct":true},{"text":"...","correct":false},` +
    `{"text":"...","correct":true},{"text":"...","correct":false}],` +
    `"explanation":"<1-3 sentences why the correct answers are correct>"}\n\n` +
    `Rules: exactly 4 options; between 1 and 3 correct; at least one incorrect; ` +
    `accurate, concise, no markdown. If the seed isn't about Swift/iOS, still map to the closest allowed topic.`;

  for (const model of GEN_MODELS) {
    try {
      const r = await fetch(OLLAMA + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model, stream: false, format: "json", options: { temperature: 0.4 },
          messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        }),
      });
      if (!r.ok) continue;
      const j = await r.json();
      const content = j.message && j.message.content;
      if (!content) continue;
      const obj = JSON.parse(content);
      return { obj, model };
    } catch (e) {
      log("  gen model", model, "failed:", e.message);
    }
  }
  return null;
}

/* ------------------------------------------------------------- validation */
function validate(obj, allowedKeys) {
  if (!obj || typeof obj !== "object") return "not an object";
  if (!allowedKeys.includes(obj.topic)) return "bad topic: " + obj.topic;
  if (!obj.prompt || typeof obj.prompt !== "string" || obj.prompt.length < 12) return "bad prompt";
  if (!Array.isArray(obj.options) || obj.options.length < 3 || obj.options.length > 5) return "bad options length";
  let correct = 0;
  for (const o of obj.options) {
    if (!o || typeof o.text !== "string" || !o.text.trim() || typeof o.correct !== "boolean") return "bad option";
    if (o.correct) correct++;
  }
  if (correct < 1 || correct > obj.options.length - 1) return "need 1..n-1 correct";
  if (!obj.explanation || obj.explanation.length < 15) return "bad explanation";
  return null;
}

/* -------------------------------------------------------------------- main */
async function main() {
  const w = loadWindowGlobals(["bibliography.js", "questions.js", "questions.auto.js"]);
  const TOPICS = w.QUIZ_TOPICS || {};
  const allowedKeys = Object.keys(TOPICS);
  const topicsBlock = allowedKeys.map((k) => `- ${k}: ${TOPICS[k].name} — ${TOPICS[k].blurb}`).join("\n");
  const existing = (w.QUIZ_DATA || []).concat(w.QUIZ_DATA_AUTO || []);
  const autoBank = (w.QUIZ_DATA_AUTO || []).slice();
  log(`Loaded ${existing.length} existing questions across ${allowedKeys.length} topics.`);

  // Embed existing prompts (for dedup)
  log("Embedding existing prompts for dedup…");
  const existingVecs = [];
  for (const q of existing) {
    try { existingVecs.push(await embed(q.prompt)); } catch (e) { log("  embed existing failed:", e.message); }
  }

  // Collect permitted seeds
  const seeds = [];
  for (const src of SOURCES) {
    const gate = await robotsAllowed(src);
    if (!gate.allowed) { log(`SKIP (robots) ${src} — ${gate.reason}`); continue; }
    try {
      const txt = await fetchText(src);
      const found = extractSeeds(txt);
      log(`Source OK ${src} — ${found.length} seed questions`);
      for (const s of found) seeds.push({ seed: s, origin: src });
    } catch (e) { log(`  fetch failed ${src}: ${e.message}`); }
    await new Promise((r) => setTimeout(r, 800)); // be polite
  }

  // Dedup + generate
  const newQs = [];
  const existingVecsMut = existingVecs.slice();
  let idN = autoBank.length;
  const today = new Date().toISOString().slice(0, 10);

  for (const { seed, origin } of seeds) {
    if (newQs.length >= MAX_NEW) break;
    let vec;
    try { vec = await embed(seed); } catch { continue; }
    let maxSim = 0;
    for (const ev of existingVecsMut) maxSim = Math.max(maxSim, cosine(vec, ev));
    if (maxSim >= SIM_THRESHOLD) continue; // already covered

    const gen = await chatJSON(seed, topicsBlock);
    if (!gen) { log(`  ✗ no generation for: ${seed.slice(0, 60)}`); continue; }
    const err = validate(gen.obj, allowedKeys);
    if (err) { log(`  ✗ invalid (${err}) for: ${seed.slice(0, 60)}`); continue; }

    // final dedup on the generated prompt itself
    let genVec;
    try { genVec = await embed(gen.obj.prompt); } catch { genVec = vec; }
    let genMax = 0;
    for (const ev of existingVecsMut) genMax = Math.max(genMax, cosine(genVec, ev));
    if (genMax >= SIM_THRESHOLD) { log(`  ↺ generated dup for: ${seed.slice(0, 50)}`); continue; }

    const q = {
      id: "auto-" + (++idN),
      topic: gen.obj.topic,
      prompt: gen.obj.prompt,
      options: gen.obj.options.map((o) => ({ text: o.text, correct: !!o.correct })),
      explanation: gen.obj.explanation,
      source: "auto-scan",
      origin,
      addedAt: today,
      reviewed: false,   // quarantined: NOT served in quizzes until a human verifies it
    };
    newQs.push(q);
    existingVecsMut.push(genVec);
    log(`  ✓ [${q.topic}] ${q.prompt.slice(0, 70)}  (seedSim ${maxSim.toFixed(2)}, via ${gen.model})`);
  }

  log(`\nAccepted ${newQs.length} new question(s).`);
  if (!newQs.length) return;

  if (DRY_RUN) { log("DRY_RUN=1 — not writing."); console.log(JSON.stringify(newQs, null, 2)); return; }

  const merged = autoBank.concat(newQs);
  const header =
    "/**\n" +
    " * Auto-generated question bank. Populated by scripts/scan.mjs (local Ollama).\n" +
    " * Each entry carries source/origin/addedAt. Review before trusting as gospel.\n" +
    " */\n";
  fs.writeFileSync(AUTO_FILE, header + "window.QUIZ_DATA_AUTO = " + JSON.stringify(merged, null, 2) + ";\n");
  log(`Wrote ${merged.length} total auto question(s) to ${path.relative(ROOT, AUTO_FILE)}`);
}

main().catch((e) => { console.error("scan failed:", e); process.exit(1); });
