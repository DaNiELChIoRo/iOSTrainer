# Interview-question scan pipeline (local Ollama)

Scans permitted iOS interview-question sources, authors new multiple-answer
questions with a **local Ollama model**, deduplicates against the existing
bank, and appends candidates to a **review queue**.

## How it works

`scan.mjs` (no npm deps — Node 18+ global `fetch`):

1. **Fetch seeds** from `SOURCES`. Each domain is gated by `robots.txt`:
   - respects `Disallow` for `User-agent: *`, and
   - **skips any site whose `Content-Signal` opts out of AI use** (`ai-train=no`
     / `ai-input=no`). This is why `hackingwithswift.com` is auto-skipped.
2. **Dedup** — embeds every existing prompt and each seed with
   `nomic-embed-text`; a seed with cosine similarity ≥ `SIM_THRESHOLD` (0.72)
   to something we already have is skipped.
3. **Author** — for genuinely new topics, a chat model (`gemma3:27b`, falling
   back to `llama3`) writes an original question as strict JSON in the app's
   schema. Output is validated (topic in range, 4 options, 1–n−1 correct,
   explanation present).
4. **Queue** — accepted questions are appended to
   `../assets/js/questions.auto.js` with `reviewed: false`.

## ⚠️ Review before it ships

Auto-generated questions are **quarantined**: `app.js` only serves
`questions.auto.js` entries where `reviewed === true`. Local models make
mistakes (wrong "correct" flags, mislabeled topics, near-duplicate options),
so a human must read each candidate and either:

- fix it and set `"reviewed": true`, or
- delete it.

Nothing from the scan appears in a quiz until you do this.

## Run manually

```bash
# default run (adds up to MAX_NEW candidates to the queue)
node scripts/scan.mjs

# preview only, print JSON, write nothing
DRY_RUN=1 node scripts/scan.mjs

# higher-quality (slower) authoring model
GEN_MODEL=gemma3:27b MAX_NEW=5 node scripts/scan.mjs
```

Env: `OLLAMA_URL`, `GEN_MODEL`, `EMBED_MODEL`, `MAX_NEW`, `SIM_THRESHOLD`, `DRY_RUN`.

## Cron

`run-scan.sh` is the cron wrapper (sets PATH, skips if Ollama is down, logs to
`scan.log`). Installed to run weekly:

```
0 9 * * 1 /Users/dmeneses/Documents/Vue/iOSTrainer/scripts/run-scan.sh
```

It only updates the local review queue — it never commits or pushes.
