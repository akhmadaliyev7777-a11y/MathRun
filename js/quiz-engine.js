// Mavzu testi: barcha savollar bitta sahifada. O'quvchi har savolda 4 javobdan birini belgilaydi,
// «Testni yakunlash» ni bosadi — natija, xatolar va yechimlar shu joyda chiqadi.
// Har mavzuda 2 ta test bo'lishi mumkin: oson (tushunish) va qiyin (ko'nikma) — quizSets() (natija.js).
// Manzil: test.html?sinf=5&fan=matematika&mavzu=<id>[&tur=qiyin]

const QZ_TUR = {
  oson: { nom: "1-test", tavsif: "Tushunish · oson" },
  qiyin: { nom: "2-test", tavsif: "Ko'nikma · qiyinroq" }
};
const QZ_HARF = ["A", "B", "C", "D", "E", "F"];

function initQuiz() {
  const gradeId = getQueryParam("sinf");
  const subjectId = getQueryParam("fan");
  const topicId = getQueryParam("mavzu");
  const key = gradeId + "|" + subjectId + "|" + topicId;

  const grade = findGrade(gradeId);
  const subject = grade ? findSubject(grade, subjectId) : null;
  const topic = subject ? findTopic(subject, topicId) : null;

  const backLink = document.getElementById("quiz-back-link");
  // mavzu sahifasi ichida (iframe) ochilgan — "Mavzuga qaytish" kerak emas, aks holda sahifa iframe ichida ochilib qoladi
  const embedded = window.self !== window.top;
  if (embedded) {
    backLink.style.display = "none";
    document.documentElement.classList.add("quiz-embedded");
  }
  // mavzu sahifasidagi oyna balandligi testga moslashadi — ichida aylantirish (scroll) bo'lmaydi
  if (embedded && window.ResizeObserver) {
    new ResizeObserver(function () {
      try { parent.postMessage({ type: "mathrun:height", h: Math.ceil(document.body.getBoundingClientRect().height) }, "*"); } catch (e) { /* sayt tashqarisida */ }
    }).observe(document.body);
  }
  // bob testi (masalan 5-sinf) bir nechta mavzuga ulangan — mavzu topilmasa sinf sahifasiga qaytadi
  if (topic) backLink.href = topicHref(gradeId, subjectId, topicId);
  else if (subject) backLink.href = "sinf.html?sinf=" + gradeId + "&fan=" + subjectId;

  const card = document.getElementById("quiz-card");
  const tabsEl = document.getElementById("quiz-progress");
  const sets = quizSets(key);

  if (!sets.length) {
    tabsEl.innerHTML = "";
    card.innerHTML = '<div class="placeholder">🚧 Bu mavzu uchun test hali tayyor emas</div>';
    return;
  }

  let tur = getQueryParam("tur") === "qiyin" ? "qiyin" : "oson";
  if (!sets.some(function (s) { return s.tur === tur; })) tur = sets[0].tur;

  // sahifa (yoki oyna) boshiga — natija chiqqanda o'quvchi uni darhol ko'rsin
  function toTop() {
    if (embedded) { try { parent.postMessage({ type: "mathrun:top" }, "*"); } catch (e) {} }
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTabs() {
    tabsEl.innerHTML = '<div class="qz-tabs" role="tablist">' + ["oson", "qiyin"].map(function (t) {
      const set = sets.find(function (s) { return s.tur === t; });
      if (!set) return '<span class="qz-tab qz-tab--off"><b>' + QZ_TUR[t].nom + '</b><small>tez orada</small></span>';
      return '<button type="button" role="tab" class="qz-tab' + (t === tur ? " active" : "") + '" data-tur="' + t + '">' +
        '<b>' + QZ_TUR[t].nom + '</b><small>' + QZ_TUR[t].tavsif + ' · ' + set.q.length + ' savol</small></button>';
    }).join("") + '</div>';
    tabsEl.querySelectorAll("[data-tur]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.tur === tur) return;
        tur = b.dataset.tur;
        if (history.replaceState) {
          const u = new URL(location.href);
          if (tur === "qiyin") u.searchParams.set("tur", "qiyin"); else u.searchParams.delete("tur");
          history.replaceState(null, "", u.toString());
        }
        start();
      });
    });
  }

  let questions = [], order = [], picked = [], finished = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function start() {
    questions = sets.find(function (s) { return s.tur === tur; }).q;
    // har urinishda javoblar tartibi aralashtiriladi; order[i] — ko'rsatilgan javoblarning asl o'rni
    order = questions.map(function (q) { return shuffle(q.options.map(function (_, j) { return j; })); });
    picked = questions.map(function () { return -1; });
    finished = false;
    renderTabs();
    render();
  }

  function answeredCount() { return picked.filter(function (p) { return p >= 0; }).length; }

  function questionHtml(q, i) {
    const correctIdx = q.options.indexOf(q.answer);
    let state = "";
    if (finished) state = picked[i] < 0 ? " qz-q--skip" : picked[i] === correctIdx ? " qz-q--ok" : " qz-q--bad";
    const opts = order[i].map(function (oi, pos) {
      let cls = "qz-opt";
      if (picked[i] === oi) cls += " picked";
      if (finished && oi === correctIdx) cls += " right";
      if (finished && picked[i] === oi && oi !== correctIdx) cls += " wrong";
      return '<button type="button" class="' + cls + '" data-q="' + i + '" data-o="' + oi + '"' + (finished ? " disabled" : "") + '>' +
        '<span class="qz-letter">' + QZ_HARF[pos] + '</span><span class="qz-opt-text">' + q.options[oi] + '</span></button>';
    }).join("");
    let after = "";
    if (finished) {
      const verdict = picked[i] < 0 ? '<span class="qz-verdict skip">Javob berilmagan</span>'
        : picked[i] === correctIdx ? '<span class="qz-verdict ok">✓ To\'g\'ri</span>'
        : '<span class="qz-verdict bad">✗ Noto\'g\'ri</span>';
      const sol = q.yechim || q.explain;
      after = '<div class="qz-after">' + verdict +
        (picked[i] !== correctIdx ? '<span class="qz-right-ans">To\'g\'ri javob: <b>' + q.answer + '</b></span>' : "") + '</div>' +
        (sol ? (picked[i] === correctIdx
          ? '<details class="qz-sol"><summary>Yechimni ko\'rish</summary><div>' + sol + '</div></details>'
          : '<div class="qz-sol qz-sol--open"><b>Yechim:</b> ' + sol + '</div>') : "");
    }
    return '<li class="qz-q' + state + '" id="qz-q' + (i + 1) + '">' +
      '<div class="qz-q-head"><span class="qz-num">' + (i + 1) + '</span><div class="qz-text">' + q.question + '</div></div>' +
      '<div class="qz-opts">' + opts + '</div>' + after + '</li>';
  }

  function render() {
    const set = QZ_TUR[tur];
    let head;
    if (!finished) {
      head = '<div class="qz-intro"><h2>' + set.nom + ' <span>· ' + set.tavsif + '</span></h2>' +
        '<p>' + questions.length + ' ta savol. Har bir savolda 4 ta javobdan to\'g\'risini belgilang, oxirida <b>«Testni yakunlash»</b> ni bosing — natija va yechimlar shu yerda chiqadi.</p></div>';
    } else {
      const ok = questions.filter(function (q, i) { return picked[i] === q.options.indexOf(q.answer); }).length;
      const skip = picked.filter(function (p) { return p < 0; }).length;
      const bad = questions.length - ok - skip;
      const pct = Math.round(ok / questions.length * 100);
      let msg = "Yaxshi urinish! Yechimlarni o'qib chiqing va qayta urinib ko'ring.";
      if (pct === 100) msg = "Ajoyib! Barcha savollarga to'g'ri javob berdingiz! 🎉";
      else if (pct >= 80) msg = "Zo'r natija! 👏 Xatolaringizning yechimini ko'rib chiqing.";
      else if (pct >= 60) msg = "Yomon emas! Xatolar ustida ishlasangiz, yanada yaxshi bo'ladi.";
      const other = sets.find(function (s) { return s.tur !== tur; });
      head = '<div class="qz-result qz-result--' + (pct >= 80 ? "high" : pct >= 60 ? "mid" : "low") + '">' +
        '<div class="qz-score"><b>' + ok + ' / ' + questions.length + '</b><span>' + pct + '%</span></div>' +
        '<p class="qz-msg">' + msg + '</p>' +
        '<div class="qz-counts"><span class="ok">✓ ' + ok + ' to\'g\'ri</span><span class="bad">✗ ' + bad + ' xato</span>' + (skip ? '<span class="skip">○ ' + skip + ' javobsiz</span>' : "") + '</div>' +
        '<div class="qz-actions">' +
          (bad + skip ? '<button type="button" class="qz-btn qz-btn--ghost" id="qz-only-wrong">Faqat xatolarni ko\'rsatish</button>' : "") +
          '<button type="button" class="qz-btn" id="qz-again">↻ Qayta yechish</button>' +
          (other && tur === "oson" ? '<button type="button" class="qz-btn qz-btn--ghost" data-go="qiyin">2-testga o\'tish →</button>' : "") +
          (other && tur === "qiyin" ? '<button type="button" class="qz-btn qz-btn--ghost" data-go="oson">← 1-testga qaytish</button>' : "") +
          (topic && !embedded ? '<a class="qz-btn qz-btn--ghost" href="' + topicHref(gradeId, subjectId, topicId) + '">Mavzuga qaytish</a>' : "") +
        '</div></div>';
    }

    const foot = finished ? "" :
      '<div class="qz-foot">' +
        '<div class="qz-count" id="qz-count"></div>' +
        '<div class="qz-warn" id="qz-warn" hidden></div>' +
        '<button type="button" class="qz-btn qz-btn--big" id="qz-finish">Testni yakunlash</button>' +
      '</div>';

    card.innerHTML = head + '<ol class="qz-list">' + questions.map(questionHtml).join("") + '</ol>' + foot;
    card.classList.toggle("qz-done", finished);

    if (!finished) {
      updateCount();
      card.querySelectorAll(".qz-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          const qi = Number(b.dataset.q);
          picked[qi] = Number(b.dataset.o);
          b.parentNode.querySelectorAll(".qz-opt").forEach(function (x) { x.classList.toggle("picked", x === b); });
          b.closest(".qz-q").classList.remove("qz-q--miss");
          document.getElementById("qz-warn").hidden = true;
          updateCount();
        });
      });
      document.getElementById("qz-finish").addEventListener("click", function () { tryFinish(false); });
    } else {
      const again = document.getElementById("qz-again");
      if (again) again.addEventListener("click", function () { start(); toTop(); });
      const only = document.getElementById("qz-only-wrong");
      if (only) only.addEventListener("click", function () {
        const on = card.classList.toggle("qz-only-wrong");
        only.textContent = on ? "Hamma savollarni ko'rsatish" : "Faqat xatolarni ko'rsatish";
      });
      card.querySelectorAll("[data-go]").forEach(function (b) {
        b.addEventListener("click", function () { tabsEl.querySelector('[data-tur="' + b.dataset.go + '"]').click(); toTop(); });
      });
    }
  }

  function updateCount() {
    const n = answeredCount();
    const el = document.getElementById("qz-count");
    if (el) el.innerHTML = 'Javob berildi: <b>' + n + ' / ' + questions.length + '</b>' +
      '<span class="qz-bar"><i style="width:' + Math.round(n / questions.length * 100) + '%"></i></span>';
  }

  function tryFinish(force) {
    const missing = [];
    picked.forEach(function (p, i) { if (p < 0) missing.push(i + 1); });
    if (missing.length && !force) {
      const warn = document.getElementById("qz-warn");
      warn.innerHTML = '<b>' + missing.length + ' ta savolga javob berilmagan:</b> ' +
        missing.map(function (n) { return '<a href="#qz-q' + n + '" data-jump="' + n + '">' + n + '</a>'; }).join(", ") +
        '<div class="qz-warn-actions"><button type="button" class="qz-btn qz-btn--ghost" id="qz-force">Baribir yakunlash</button></div>';
      warn.hidden = false;
      missing.forEach(function (n) { document.getElementById("qz-q" + n).classList.add("qz-q--miss"); });
      document.getElementById("qz-force").addEventListener("click", function () { tryFinish(true); });
      warn.querySelectorAll("[data-jump]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          const el = document.getElementById("qz-q" + a.dataset.jump);
          if (embedded) { try { parent.postMessage({ type: "mathrun:top", y: el.offsetTop - 12 }, "*"); } catch (er) {} }
          else el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
      return;
    }
    finished = true;
    const score = questions.filter(function (q, i) { return picked[i] === q.options.indexOf(q.answer); }).length;
    const statKey = quizStatKey(key, tur);
    if (typeof sendQuizResult === "function") sendQuizResult(statKey, questions, picked, score);
    if (typeof saveLocalResult === "function") saveLocalResult(statKey, score, questions.length);
    render();
    toTop();
  }

  start();
}
