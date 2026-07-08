/* iOS Trainer — quiz engine. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var TOPICS = window.QUIZ_TOPICS;
  // hand-curated bank + auto-generated bank. Auto-generated questions (from the
  // Ollama scan pipeline) are quarantined until a human sets reviewed:true, so
  // unverified AI output never appears in a quiz.
  var DATA = (window.QUIZ_DATA || []).concat(
    (window.QUIZ_DATA_AUTO || []).filter(function (q) { return q && q.reviewed === true; })
  );
  var BIB = window.BIBLIOGRAPHY;
  var app = document.getElementById("app");

  // --- session state -------------------------------------------------------
  var state = {
    selectedTopics: Object.keys(TOPICS), // default: all
    mode: "quiz",                        // "quiz" | "review"
    count: 10,
    questions: [],   // active run
    index: 0,
    answers: {},     // id -> array of chosen option indexes
    locked: {},      // id -> true once submitted
  };

  // tracks last topic click across re-renders so we can detect a double-click
  // (single-click rebuilds the setup view, which would break a native dblclick)
  var lastTopicClick = { key: null, time: 0 };

  // --- helpers -------------------------------------------------------------
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function correctIndexes(q) {
    var out = [];
    q.options.forEach(function (o, i) { if (o.correct) out.push(i); });
    return out;
  }

  function isMulti(q) { return correctIndexes(q).length > 1; }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  // --- persistence ---------------------------------------------------------
  var BEST_KEY = "iostrainer.best";
  function loadBest() {
    try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveBest(pct) {
    var best = loadBest();
    var key = state.selectedTopics.slice().sort().join("+") || "all";
    if (best[key] == null || pct > best[key]) { best[key] = pct; }
    try { localStorage.setItem(BEST_KEY, JSON.stringify(best)); } catch (e) {}
    return best[key];
  }

  // Words too generic to help rank reading relevance.
  var STOPWORDS = {};
  ("which statements about are true correct the following can create when should you prefer over what does mean and why used which of these will match behavior into that with from this for not but also they them their your only always never each every some most many both either into onto than then them they've its it's swift ios apple use uses using need needs make makes work works help helps still same different between within without across whether have has had will would could should does done being been then here there where while during after before because such like just more less very much any all one two three four five type types value values thing things way ways case cases").split(/\s+/).forEach(function (w) { STOPWORDS[w] = true; });

  // Rank a topic's reading links by textual overlap with a specific question,
  // so the most relevant links float up and off-topic ones can be trimmed.
  function rankReading(links, question) {
    if (!question) return links.slice();
    var text = (question.prompt + " " + (question.explanation || "") + " " +
      (question.options || []).filter(function (o) { return o.correct; }).map(function (o) { return o.text; }).join(" ")
    ).toLowerCase();
    var words = {};
    text.split(/[^a-z0-9@]+/).forEach(function (w) {
      if (w.length >= 3 && !STOPWORDS[w]) words[w] = true;
      var base = w.replace(/s$/, "");           // crude singular
      if (base.length >= 3 && !STOPWORDS[base]) words[base] = true;
    });
    var keys = Object.keys(words);
    return links.map(function (l, i) {
      var t = l.title.toLowerCase();
      var score = 0;
      keys.forEach(function (w) { if (t.indexOf(w) !== -1) score++; });
      return { l: l, score: score, i: i };
    }).sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); })
      .map(function (x) { return x.l; });
  }

  // Build a "documentation to review" block (used in review mode & results).
  // Pass `question` to show reading relevant to that specific question.
  function topicDocsBlock(topicKey, question) {
    // question-specific links win; otherwise rank the topic's links by relevance
    var links = (question && question.reading && question.reading.length)
      ? question.reading
      : rankReading(BIB[topicKey] || [], question).slice(0, 3);

    var heading = question
      ? '📚 Suggested reading for this question'
      : '📚 Review ' + esc(TOPICS[topicKey].name) + ' — suggested reading';

    var block = el(
      '<div class="topicdocs">' +
        '<p class="topicdocs__head">' + heading + '</p>' +
        '<ul class="review__links"></ul>' +
      '</div>'
    );
    var ul = block.querySelector(".review__links");
    links.forEach(function (r) {
      ul.appendChild(el(
        '<li><a href="' + r.url + '" target="_blank" rel="noopener">' +
          esc(r.title) + '<span class="review__src">' + esc(r.source) + '</span></a></li>'
      ));
    });
    return block;
  }

  // ========================================================== SETUP VIEW ===
  function renderSetup() {
    state.answers = {};
    state.locked = {};
    state.index = 0;

    var view = el('<section class="view view--setup"></section>');
    view.appendChild(el(
      '<div class="hero">' +
        '<h1 class="hero__title">Sharpen your iOS knowledge</h1>' +
        '<p class="hero__sub">Multiple-answer quizzes across the topics that come up in iOS interviews and real work. Miss a topic and we’ll point you at the docs to review.</p>' +
      '</div>'
    ));

    // topic picker
    var chipEls = {}; // key -> chip element, for in-place selection updates
    var picker = el('<div class="card"><h2 class="card__title">Choose topics</h2><p class="card__hint-line">Tap to toggle · <strong>double-tap</strong> to quiz that topic only</p><div class="topic-grid"></div></div>');
    var grid = picker.querySelector(".topic-grid");
    Object.keys(TOPICS).forEach(function (key) {
      var t = TOPICS[key];
      var n = DATA.filter(function (q) { return q.topic === key; }).length;
      var on = state.selectedTopics.indexOf(key) !== -1;
      var chip = el(
        '<button type="button" class="topic' + (on ? " topic--on" : "") + '" data-topic="' + key + '" aria-pressed="' + on + '">' +
          '<span class="topic__icon">' + t.icon + '</span>' +
          '<span class="topic__body"><span class="topic__name">' + esc(t.name) + '</span>' +
          '<span class="topic__blurb">' + esc(t.blurb) + '</span></span>' +
          '<span class="topic__count">' + n + ' Q</span>' +
        '</button>'
      );
      chip.addEventListener("click", function () {
        var now = Date.now();
        var isDouble = lastTopicClick.key === key && (now - lastTopicClick.time) < 350;
        lastTopicClick = { key: key, time: now };
        if (isDouble) {
          // double-click: quiz only this topic
          state.selectedTopics = [key];
        } else {
          // single-click: toggle (keep at least one selected)
          var i = state.selectedTopics.indexOf(key);
          if (i === -1) state.selectedTopics.push(key);
          else if (state.selectedTopics.length > 1) state.selectedTopics.splice(i, 1);
        }
        syncSetup();
      });
      chipEls[key] = chip;
      grid.appendChild(chip);
    });
    view.appendChild(picker);

    // length picker (contents are rebuilt in place by syncSetup)
    var controls = el('<div class="card"><h2 class="card__title">How many questions?</h2><div class="seg" role="group"></div></div>');
    var seg = controls.querySelector(".seg");
    view.appendChild(controls);

    // mode picker: quiz vs review
    var modes = [
      { key: "quiz", title: "Quiz mode", desc: "Test yourself. Instant right/wrong feedback per question; review resources appear at the end for weak topics." },
      { key: "review", title: "Review mode", desc: "Study as you go. After each answer, see the explanation plus documentation links for that topic to review." },
    ];
    var modeCard = el('<div class="card"><h2 class="card__title">Mode</h2><div class="modes"></div></div>');
    var modeWrap = modeCard.querySelector(".modes");
    var modeEls = {};
    modes.forEach(function (m) {
      var b = el(
        '<button type="button" class="mode" aria-pressed="false">' +
          '<span class="mode__title">' + (m.key === "review" ? "📚 " : "📝 ") + m.title + '</span>' +
          '<span class="mode__desc">' + esc(m.desc) + '</span>' +
        '</button>'
      );
      b.addEventListener("click", function () { state.mode = m.key; syncSetup(); });
      modeEls[m.key] = b;
      modeWrap.appendChild(b);
    });
    view.appendChild(modeCard);

    var start = el(
      '<div class="start">' +
        '<button id="startBtn" class="btn btn--primary btn--lg">Start quiz →</button>' +
        '<p class="start__best" hidden></p>' +
        '<p class="start__meta"></p>' +
        '<button id="techBtn" class="btn btn--ghost start__tech">🛠️ Advanced / Hacker Techniques (reference)</button>' +
      '</div>'
    );
    var bestEl = start.querySelector(".start__best");
    var metaEl = start.querySelector(".start__meta");
    start.querySelector("#startBtn").addEventListener("click", startQuiz);
    start.querySelector("#techBtn").addEventListener("click", renderTechniques);
    view.appendChild(start);

    // Patch only the selection-dependent UI in place (no full re-render).
    function syncSetup() {
      // topic chips
      Object.keys(chipEls).forEach(function (key) {
        var on = state.selectedTopics.indexOf(key) !== -1;
        chipEls[key].classList.toggle("topic--on", on);
        chipEls[key].setAttribute("aria-pressed", on);
      });
      // mode chips
      Object.keys(modeEls).forEach(function (key) {
        var on = state.mode === key;
        modeEls[key].classList.toggle("mode--on", on);
        modeEls[key].setAttribute("aria-pressed", on);
      });
      // available count + question-count segmented control
      var available = DATA.filter(function (q) {
        return state.selectedTopics.indexOf(q.topic) !== -1;
      }).length;
      var choices = [5, 10, 15, 20].filter(function (c) { return c <= available; });
      if (choices.indexOf(available) === -1) choices.push(available); // "all"
      if (state.count > available) state.count = available;
      seg.innerHTML = "";
      choices.forEach(function (c) {
        var label = c === available ? "All (" + c + ")" : String(c);
        var b = el('<button type="button" class="seg__btn' + (state.count === c ? " seg__btn--on" : "") + '">' + label + '</button>');
        b.addEventListener("click", function () { state.count = c; syncSetup(); });
        seg.appendChild(b);
      });
      // best score + meta line
      var best = loadBest();
      var bestKey = state.selectedTopics.slice().sort().join("+");
      if (best[bestKey] != null) {
        bestEl.innerHTML = 'Your best on this selection: <strong>' + best[bestKey] + '%</strong>';
        bestEl.hidden = false;
      } else {
        bestEl.hidden = true;
      }
      metaEl.textContent = available + ' questions available across ' + state.selectedTopics.length + ' topic(s)';
    }

    syncSetup();
    swap(view);
  }

  // ===================================================== TECHNIQUES (REF) ===
  function renderTechniques() {
    var T = window.HACKER_TECHNIQUES;
    var view = el('<section class="view view--tech"></section>');

    view.appendChild(el(
      '<div class="hero hero--tech">' +
        '<h1 class="hero__title">🛠️ Advanced / Hacker Techniques</h1>' +
        '<p class="hero__sub">Reference material — not a quiz. Advanced Objective-C runtime, debugging, and reverse-engineering techniques for iOS.</p>' +
      '</div>'
    ));

    view.appendChild(el(
      '<div class="disclaimer">⚠️ ' + esc(T.disclaimer) + '</div>'
    ));

    T.groups.forEach(function (g) {
      var card = el('<div class="card"><h2 class="card__title">' + esc(g.title) + '</h2></div>');
      g.items.forEach(function (it) {
        var tech = el(
          '<div class="tech">' +
            '<div class="tech__head"><h3 class="tech__name">' + esc(it.name) + '</h3>' +
              '<span class="tech__level tech__level--' + it.level.toLowerCase() + '">' + esc(it.level) + '</span></div>' +
            '<p class="tech__what"><strong>What:</strong> ' + esc(it.what) + '</p>' +
            '<p class="tech__why"><strong>Why / when:</strong> ' + esc(it.why) + '</p>' +
            '<ul class="review__links tech__links"></ul>' +
          '</div>'
        );
        var ul = tech.querySelector(".tech__links");
        (it.links || []).forEach(function (r) {
          ul.appendChild(el(
            '<li><a href="' + r.url + '" target="_blank" rel="noopener">' +
              esc(r.title) + '<span class="review__src">' + esc(r.source) + '</span></a></li>'
          ));
        });
        card.appendChild(tech);
      });
      view.appendChild(card);
    });

    var actions = el('<div class="actions"></div>');
    var back = el('<button class="btn btn--primary">← Back to quiz setup</button>');
    back.addEventListener("click", renderSetup);
    actions.appendChild(back);
    view.appendChild(actions);

    swap(view);
  }

  // ============================================================ QUIZ RUN ===
  function startQuiz() {
    var pool = shuffle(DATA.filter(function (q) {
      return state.selectedTopics.indexOf(q.topic) !== -1;
    }));
    state.questions = pool.slice(0, state.count).map(function (q) {
      // shuffle option order per question, remapping correctness
      var opts = shuffle(q.options.map(function (o, i) { return { o: o, i: i }; }));
      return {
        base: q,
        options: opts.map(function (x) { return x.o; }),
      };
    });
    state.index = 0;
    state.answers = {};
    state.locked = {};
    renderQuestion();
  }

  function renderQuestion() {
    var item = state.questions[state.index];
    var q = item.base;
    var total = state.questions.length;
    var multi = isMulti(q);
    var chosen = state.answers[q.id] || [];
    var locked = !!state.locked[q.id];

    var view = el('<section class="view view--quiz"></section>');

    // progress
    var pct = Math.round((state.index) / total * 100);
    view.appendChild(el(
      '<div class="progress">' +
        '<div class="progress__bar"><span style="width:' + pct + '%"></span></div>' +
        '<div class="progress__meta"><span>Question ' + (state.index + 1) + ' of ' + total +
          '<span class="tag tag--mode">' + (state.mode === "review" ? "📚 Review" : "📝 Quiz") + '</span></span>' +
        '<span class="tag">' + TOPICS[q.topic].icon + ' ' + esc(TOPICS[q.topic].name) + '</span></div>' +
      '</div>'
    ));

    var card = el('<div class="card qcard"></div>');
    card.appendChild(el('<p class="qcard__hint">' + (multi ? "Select all that apply" : "Select one") + '</p>'));
    card.appendChild(el('<h2 class="qcard__prompt">' + esc(q.prompt) + '</h2>'));

    var mark = multi ? "checkbox" : "radio";
    var rowEls = [], markEls = [], textEls = [];
    var list = el('<div class="options"></div>');
    item.options.forEach(function (opt, i) {
      var row = el(
        '<button type="button" class="option">' +
          '<span class="option__mark option__mark--' + mark + '"></span>' +
          '<span class="option__text">' + esc(opt.text) + '</span>' +
        '</button>'
      );
      row.addEventListener("click", function () {
        if (state.locked[q.id]) return;                 // ignore after reveal
        var cur = state.answers[q.id] || [];
        if (multi) {
          var p = cur.indexOf(i);
          if (p === -1) cur.push(i); else cur.splice(p, 1);
        } else {
          cur = [i];
        }
        state.answers[q.id] = cur;
        syncOptionSelection();                          // patch in place, no re-render
      });
      rowEls[i] = row;
      markEls[i] = row.querySelector(".option__mark");
      textEls[i] = row.querySelector(".option__text");
      list.appendChild(row);
    });
    card.appendChild(list);
    view.appendChild(card);

    // actions container (contents swap on reveal)
    var actions = el('<div class="actions"></div>');
    view.appendChild(actions);

    // --- in-place updates -------------------------------------------------
    var submitBtn = null;

    function syncOptionSelection() {
      var cur = state.answers[q.id] || [];
      item.options.forEach(function (opt, i) {
        var picked = cur.indexOf(i) !== -1;
        rowEls[i].classList.toggle("option--picked", picked);
        markEls[i].textContent = picked ? "✓" : "";
      });
      if (submitBtn) submitBtn.disabled = cur.length === 0;
    }

    function revealAnswer() {
      var cur = state.answers[q.id] || [];
      item.options.forEach(function (opt, i) {
        var picked = cur.indexOf(i) !== -1;
        var row = rowEls[i];
        row.disabled = true;
        row.classList.remove("option--picked");
        var glyph = "";
        if (opt.correct && picked) { row.classList.add("option--correct"); glyph = "✓"; }
        else if (opt.correct && !picked) {
          row.classList.add("option--missed");
          textEls[i].insertAdjacentHTML("beforeend", '<span class="option__note">Correct answer — you missed this</span>');
        }
        else if (!opt.correct && picked) {
          row.classList.add("option--wrong"); glyph = "✗";
          textEls[i].insertAdjacentHTML("beforeend", '<span class="option__note option__note--bad">Your answer — incorrect</span>');
        }
        markEls[i].textContent = glyph;
      });

      // Verdict must be computed against the *shuffled* options actually shown
      // (item.options), not the original order — cur holds shuffled indexes.
      var right = cur.length > 0 && item.options.every(function (opt, i) {
        return opt.correct === (cur.indexOf(i) !== -1);
      });
      card.appendChild(el(
        '<div class="explain ' + (right ? "explain--ok" : "explain--no") + '">' +
          '<p class="explain__verdict">' + (right ? "✅ Correct" : "❌ Not quite") + '</p>' +
          '<p class="explain__body">' + esc(q.explanation) + '</p>' +
        '</div>'
      ));
      if (state.mode === "review") card.appendChild(topicDocsBlock(q.topic, q));

      buildActions();
    }

    function buildActions() {
      actions.innerHTML = "";
      submitBtn = null;
      if (!state.locked[q.id]) {
        submitBtn = el('<button class="btn btn--primary">Check answer</button>');
        submitBtn.disabled = (state.answers[q.id] || []).length === 0;
        submitBtn.addEventListener("click", function () { state.locked[q.id] = true; revealAnswer(); });
        actions.appendChild(submitBtn);
      } else {
        var nextLabel = state.index + 1 < total ? "Next question →" : "See results →";
        var next = el('<button class="btn btn--primary">' + nextLabel + '</button>');
        next.addEventListener("click", function () {
          if (state.index + 1 < total) { state.index++; renderQuestion(); }
          else renderResults();
        });
        actions.appendChild(next);
      }
      var quit = el('<button class="btn btn--ghost">Quit</button>');
      quit.addEventListener("click", function () { if (confirm("End this quiz and return to the start?")) renderSetup(); });
      actions.appendChild(quit);
    }

    swap(view);
    // initial paint (handles a fresh question, or one already answered/locked)
    if (locked) { revealAnswer(); }
    else { buildActions(); syncOptionSelection(); }
  }

  // ============================================================ RESULTS ====
  function renderResults() {
    var total = state.questions.length;
    var correct = 0;
    var perTopic = {}; // topic -> {correct,total}

    state.questions.forEach(function (item) {
      var q = item.base;
      var ans = state.answers[q.id] || [];
      // remap chosen display-indexes back to correctness via item.options
      var got = ans.map(function (i) { return item.options[i]; });
      var chosenCorrect = got.filter(function (o) { return o.correct; }).length;
      var totalCorrect = item.options.filter(function (o) { return o.correct; }).length;
      var chosenWrong = got.filter(function (o) { return !o.correct; }).length;
      var right = chosenCorrect === totalCorrect && chosenWrong === 0 && got.length > 0;

      if (!perTopic[q.topic]) perTopic[q.topic] = { correct: 0, total: 0 };
      perTopic[q.topic].total++;
      if (right) { correct++; perTopic[q.topic].correct++; }
    });

    var pct = Math.round(correct / total * 100);
    var best = saveBest(pct);

    var grade =
      pct >= 90 ? { label: "Senior-level 🏆", cls: "grade--a" } :
      pct >= 70 ? { label: "Solid 👍", cls: "grade--b" } :
      pct >= 50 ? { label: "Getting there 📚", cls: "grade--c" } :
                  { label: "Needs review 🔧", cls: "grade--d" };

    var view = el('<section class="view view--results"></section>');
    view.appendChild(el(
      '<div class="score ' + grade.cls + '">' +
        '<div class="score__ring" style="--pct:' + pct + '">' +
          '<span class="score__pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="score__meta">' +
          '<h1 class="score__grade">' + grade.label + '</h1>' +
          '<p>' + correct + ' / ' + total + ' correct' +
            (best != null ? ' · best on this selection: <strong>' + best + '%</strong>' : '') + '</p>' +
        '</div>' +
      '</div>'
    ));

    // per-topic breakdown
    var breakdown = el('<div class="card"><h2 class="card__title">By topic</h2><div class="bars"></div></div>');
    var bars = breakdown.querySelector(".bars");
    var weak = [];
    Object.keys(perTopic).forEach(function (key) {
      var d = perTopic[key];
      var tp = Math.round(d.correct / d.total * 100);
      if (tp < 70) weak.push(key);
      var cls = tp >= 70 ? "bar--good" : tp >= 40 ? "bar--mid" : "bar--low";
      bars.appendChild(el(
        '<div class="bar">' +
          '<div class="bar__label">' + TOPICS[key].icon + ' ' + esc(TOPICS[key].name) +
            '<span class="bar__val">' + d.correct + '/' + d.total + '</span></div>' +
          '<div class="bar__track"><span class="' + cls + '" style="width:' + tp + '%"></span></div>' +
        '</div>'
      ));
    });
    view.appendChild(breakdown);

    // review suggestions for weak topics
    if (weak.length) {
      var rev = el('<div class="card card--review"><h2 class="card__title">📚 Topics to review</h2>' +
        '<p class="review__intro">You scored below 70% on these. Curated resources to close the gap:</p></div>');
      weak.forEach(function (key) {
        var block = el('<div class="review"><h3 class="review__topic">' + TOPICS[key].icon + ' ' + esc(TOPICS[key].name) + '</h3><ul class="review__links"></ul></div>');
        var ul = block.querySelector(".review__links");
        (BIB[key] || []).forEach(function (r) {
          ul.appendChild(el(
            '<li><a href="' + r.url + '" target="_blank" rel="noopener">' +
              esc(r.title) + '<span class="review__src">' + esc(r.source) + '</span></a></li>'
          ));
        });
        rev.appendChild(block);
      });
      view.appendChild(rev);
    } else {
      view.appendChild(el('<div class="card card--celebrate">🎉 70%+ on every topic you attempted. Nice work — try adding more topics or questions for a tougher run.</div>'));
    }

    var actions = el('<div class="actions"></div>');
    var again = el('<button class="btn btn--primary">Try again</button>');
    again.addEventListener("click", startQuiz);
    var home = el('<button class="btn btn--ghost">Change topics</button>');
    home.addEventListener("click", renderSetup);
    actions.appendChild(again); actions.appendChild(home);
    view.appendChild(actions);

    swap(view);
    window.scrollTo(0, 0);
  }

  // --- view transition -----------------------------------------------------
  function swap(view) {
    app.innerHTML = "";
    app.appendChild(view);
    window.scrollTo(0, 0);
  }

  // --- theme toggle --------------------------------------------------------
  var THEME_KEY = "iostrainer.theme";
  (function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    var btn = document.getElementById("themeToggle");
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      try { localStorage.setItem(THEME_KEY, cur); } catch (e) {}
    });
  })();

  // --- boot ----------------------------------------------------------------
  renderSetup();
})();
