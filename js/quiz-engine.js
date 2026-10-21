// Mavzu testi: barcha savollar bitta sahifada. O'quvchi har savolda 4 javobdan birini belgilaydi,
// «Testni yakunlash» ni bosadi — natija, xatolar va yechimlar shu joyda chiqadi.
// Har mavzuda 2 ta test bo'lishi mumkin: oson (tushunish) va qiyin (ko'nikma) — quizSets() (natija.js).
// Manzil: test.html?sinf=5&fan=matematika&mavzu=<id>[&tur=qiyin]
// Formulalar KaTeX bilan chiqadi: matndagi 3/8, 2 3/5, a/40, 2^3 o'zi kasr/daraja ko'rinishiga keladi;
// murakkab ifodalarni savolda \( ... \) ichida yozish mumkin. Savolda ixtiyoriy `rasm` (SVG/HTML) bo'lishi mumkin.

const QZ_TUR = {
  oson: { nom: "1-test", tavsif: "Tushunish · oson", uchun: "Tushunish uchun", qavs: "(oson)" },
  qiyin: { nom: "2-test", tavsif: "Ko'nikma · qiyinroq", uchun: "Ko'nikma uchun", qavs: "(qiyinroq)" }
};
const QZ_HARF = ["A", "B", "C", "D", "E", "F"];
const QZ_KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";
const QZ_SAVED = "mathlearn-saqlangan-v1";

const QZ_ICON = {
  book: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M8 7h8M8 11h6"/></svg>',
  flag: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>',
  mark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
};

// ---------- formulalar ----------

// matndagi oddiy yozuvlarni KaTeX formulaga aylantirish (HTML teglari ichiga tegilmaydi):
// "2 3/5" → aralash son; "3/8", "a/40", "?/10", "□/7", "0,5/2", "(7 · 5)/(20 · 5)" → kasr; "2^3", "x^2" → daraja.
// \( ... \) ichidagi formulalar o'zgarmaydi. Tekshiruv: node _reja/tools/testlar.js (chala qolgan kasrni topadi).
const QZ_TOKEN = "(\\d+(?:,\\d+)?|[a-zA-Z]|\\?|□|\\([^()]{1,40}\\))";
const QZ_RE_MIXED = new RegExp("(^|[^\\d,\\/])(\\d+) (\\d+)\\/(\\d+)(?![\\d\\/,])", "g");
const QZ_RE_FRAC = new RegExp("(^|[^\\w,\\/)?□])" + QZ_TOKEN + "\\/" + QZ_TOKEN + "(?![\\w\\/(?□])", "g");
const QZ_RE_POW = new RegExp("(^|[^\\w])(\\d+|[a-zA-Z]|\\([^()]{1,40}\\))\\^(\\d+|[a-zA-Z])(?!\\w)", "g");

// kasr surati/maxraji yoki daraja asosi uchun TeX: tashqi qavs olinadi, belgilar KaTeX ko'rinishiga
function qzTexPart(t) {
  if (t.charAt(0) === "(" && t.charAt(t.length - 1) === ")" && t.indexOf("^") < 0) t = t.slice(1, -1);
  return t.replace(/·/g, "\\cdot ").replace(/×/g, "\\times ").replace(/−/g, "-").replace(/□/g, "\\square ").replace(/\?/g, "\\,?\\,");
}

function qzMathText(text) {
  return String(text).split(/(<[^>]*>|\\\([\s\S]*?\\\))/).map(function (part) {
    if (!part || part.charAt(0) === "<") return part;
    if (part.indexOf("\\(") === 0) return '<span class="qz-m" data-tex="' + qzAttr(part.slice(2, -2)) + '">' + part.slice(2, -2) + '</span>';
    return part
      .replace(QZ_RE_MIXED, function (m, pre, w, a, b) {
        return pre + qzTex(w + "\\frac{" + a + "}{" + b + "}", w + " " + a + "⁄" + b);
      })
      .replace(QZ_RE_FRAC, function (m, pre, a, b) {
        return pre + qzTex("\\frac{" + qzTexPart(a) + "}{" + qzTexPart(b) + "}", a + "⁄" + b);
      })
      .replace(QZ_RE_POW, function (m, pre, a, b) {
        return pre + qzTex((a.charAt(0) === "(" ? "\\left" + qzTexPart(a).replace(/^/, "(") + "\\right)" : a) + "^{" + b + "}", a + "^" + b);
      });
  }).join("");
}
function qzAttr(t) { return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function qzTex(tex, plain) { return '<span class="qz-m" data-tex="' + qzAttr(tex) + '">' + plain + '</span>'; }

let qzKatexPromise = null;
function qzLoadKatex() {
  if (qzKatexPromise) return qzKatexPromise;
  qzKatexPromise = new Promise(function (ok, fail) {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = QZ_KATEX + "katex.min.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = QZ_KATEX + "katex.min.js";
    js.onload = function () { ok(window.katex); };
    js.onerror = fail;
    document.head.appendChild(js);
  });
  return qzKatexPromise;
}
// sahifadagi barcha formulalarni chizish (KaTeX yuklanmasa — oddiy matn bo'lib qoladi)
function qzRenderMath(root) {
  const els = root.querySelectorAll(".qz-m:not(.qz-m--ok)");
  if (!els.length) return;
  qzLoadKatex().then(function (katex) {
    els.forEach(function (el) {
      try {
        katex.render(el.dataset.tex.replace(/(\d),(?=\d)/g, "$1{,}"), el, {
          throwOnError: false, strict: false, macros: { "\\frac": "\\dfrac" }
        });
        el.classList.add("qz-m--ok");
      } catch (e) { /* formula chizilmasa — matn qoladi */ }
    });
  }).catch(function () { /* internet yo'q — formulalar matn ko'rinishida */ });
}

// ---------- saqlangan savollar (o'quvchi keyin qaytib ko'rishi uchun) ----------

function qzSavedAll() { try { return JSON.parse(localStorage.getItem(QZ_SAVED)) || {}; } catch (e) { return {}; } }
function qzSavedToggle(id, data) {
  const all = qzSavedAll();
  if (all[id]) delete all[id]; else all[id] = data;
  try { localStorage.setItem(QZ_SAVED, JSON.stringify(all)); } catch (e) {}
  return !!all[id];
}

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
  const topicName = topic ? topic.title.replace(/^[\d.]+\s*/, "") : "Test";

  if (!sets.length) {
    tabsEl.innerHTML = "";
    card.innerHTML = '<div class="placeholder">🚧 Bu mavzu uchun test hali tayyor emas</div>';
    return;
  }

  let tur = getQueryParam("tur") === "qiyin" ? "qiyin" : "oson";
  if (!sets.some(function (s) { return s.tur === tur; })) tur = sets[0].tur;

  // sahifa (yoki oyna) boshiga yoki oyna ichidagi y joyga — natija chiqqanda o'quvchi uni darhol ko'rsin
  function scrollToY(y) {
    if (embedded) { try { parent.postMessage({ type: "mathrun:top", y: y || 0 }, "*"); } catch (e) {} }
    else window.scrollTo({ top: Math.max(0, (y || 0) - 70), behavior: "smooth" });
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

  let questions = [], order = [], picked = [], finished = false, startedAt = 0, spent = 0;

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
    startedAt = Date.now();
    renderTabs();
    render();
  }

  const correctOf = function (q) { return q.options.indexOf(q.answer); };
  const answeredCount = function () { return picked.filter(function (p) { return p >= 0; }).length; };
  const savedId = function (i) { return quizStatKey(key, tur) + "#" + i; };

  function markBtn(i) {
    const on = !!qzSavedAll()[savedId(i)];
    return '<button type="button" class="qz-mark' + (on ? " on" : "") + '" data-mark="' + i + '" aria-pressed="' + on + '" title="Savolni saqlash">' +
      QZ_ICON.mark + '<span>' + (on ? "Saqlandi" : "Saqlash") + '</span></button>';
  }

  // ---------- savol kartasi: test davomida ----------
  function questionHtml(q, i) {
    const opts = order[i].map(function (oi, pos) {
      return '<button type="button" class="qz-opt' + (picked[i] === oi ? " picked" : "") + '" data-q="' + i + '" data-o="' + oi + '">' +
        '<span class="qz-letter">' + QZ_HARF[pos] + '</span><span class="qz-opt-text">' + qzMathText(q.options[oi]) + '</span>' +
        '<span class="qz-tick">' + QZ_ICON.check + '</span></button>';
    }).join("");
    return '<li class="qz-q' + (q.rasm ? " qz-q--fig" : "") + '" id="qz-q' + (i + 1) + '">' +
      '<div class="qz-q-top"><span class="qz-num">' + (i + 1) + '</span>' +
        '<div class="qz-text">' + qzMathText(q.question) + '</div>' +
        '<div class="qz-q-side"><span class="qz-belgi"' + (picked[i] >= 0 ? "" : " hidden") + '><i></i>Belgilandi</span>' + markBtn(i) + '</div></div>' +
      '<div class="qz-q-body">' + (q.rasm ? '<div class="qz-fig">' + q.rasm + '</div>' : "") + '<div class="qz-opts">' + opts + '</div></div></li>';
  }

  // ---------- savol kartasi: natijada ----------
  function resultHtml(q, i) {
    const ci = correctOf(q);
    const pos = function (oi) { return QZ_HARF[order[i].indexOf(oi)]; };
    const st = picked[i] < 0 ? "skip" : picked[i] === ci ? "ok" : "bad";
    const badge = st === "ok" ? '<span class="qz-badge ok">' + QZ_ICON.check + 'To\'g\'ri javob</span>'
      : st === "bad" ? '<span class="qz-badge bad">' + QZ_ICON.cross + 'Noto\'g\'ri javob</span>'
      : '<span class="qz-badge skip">Javob berilmagan</span>';
    const sol = q.yechim || q.explain;
    return '<li class="qz-q qz-q--' + st + '" id="qz-q' + (i + 1) + '">' +
      '<div class="qz-q-top"><span class="qz-num">' + (i + 1) + '</span>' + badge + '<div class="qz-q-side">' + markBtn(i) + '</div></div>' +
      '<div class="qz-res-body">' +
        (q.rasm ? '<div class="qz-fig">' + q.rasm + '</div>' : "") +
        '<div class="qz-res-main"><div class="qz-text">' + qzMathText(q.question) + '</div>' +
          '<div class="qz-answers">' +
            '<div class="qz-ans"><small>Sizning javobingiz</small>' + (picked[i] < 0 ? '<b class="skip">—</b>'
              : '<b class="' + st + '">' + pos(picked[i]) + ') ' + qzMathText(q.options[picked[i]]) + ' ' + (st === "ok" ? QZ_ICON.check : QZ_ICON.cross) + '</b>') + '</div>' +
            '<div class="qz-ans"><small>To\'g\'ri javob</small><b class="ok">' + pos(ci) + ') ' + qzMathText(q.answer) + ' ' + QZ_ICON.check + '</b></div>' +
          '</div></div>' +
      '</div>' +
      (sol ? '<details class="qz-sol"' + (st === "ok" ? "" : " open") + '><summary>Yechimni ko\'rish ' + QZ_ICON.chev + '</summary>' +
        '<div class="qz-sol-body"><b class="qz-sol-title">Yechim:</b>' + qzMathText(sol) + '</div></details>' : "") +
      '</li>';
  }

  function headBar() {
    const n = answeredCount(), set = QZ_TUR[tur];
    return '<div class="qz-head" id="qz-head">' +
      '<span class="qz-head-icon">' + QZ_ICON.book + '</span>' +
      '<div class="qz-head-title"><b>' + topicName + ' — ' + set.nom + ' ' + set.qavs + '</b><small>' + questions.length + ' ta savol · ' + set.uchun + '</small></div>' +
      '<div class="qz-head-progress"><small>Belgilandi: <b id="qz-count">' + n + ' / ' + questions.length + '</b></small>' +
        '<span class="qz-bar"><i id="qz-bar" style="width:' + Math.round(n / questions.length * 100) + '%"></i></span></div>' +
      '<button type="button" class="qz-finish" id="qz-finish">' + QZ_ICON.flag + '<span>Testni yakunlash</span></button>' +
    '</div>';
  }

  function ring(pct) {
    const r = 52, c = 2 * Math.PI * r;
    return '<svg class="qz-ring" viewBox="0 0 128 128" aria-hidden="true">' +
      '<circle cx="64" cy="64" r="' + r + '" fill="none" stroke="#e7eaf6" stroke-width="10"/>' +
      '<circle class="qz-ring-val" cx="64" cy="64" r="' + r + '" fill="none" stroke-width="10" stroke-linecap="round" ' +
        'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(1) + '" transform="rotate(-90 64 64)"/></svg>';
  }

  function confetti() {
    const colors = ["#4f5bd5", "#16a394", "#f0b429", "#e5484d", "#8b5cf6", "#2bbfa9"];
    let html = '<div class="qz-confetti" aria-hidden="true">';
    for (let k = 0; k < 26; k++) {
      const left = (k * 37) % 100, top = (k * 53) % 70, rot = (k * 47) % 180;
      html += '<i style="left:' + left + '%;top:' + top + '%;background:' + colors[k % colors.length] + ';transform:rotate(' + rot + 'deg);animation-delay:' + (k % 7) * 0.08 + 's"></i>';
    }
    return html + '</div>';
  }

  function render() {
    const set = QZ_TUR[tur];
    let html;
    if (!finished) {
      html = headBar() +
        '<ol class="qz-list">' + questions.map(questionHtml).join("") + '</ol>' +
        '<div class="qz-foot">' +
          '<div class="qz-warn" id="qz-warn" hidden></div>' +
          '<button type="button" class="qz-btn qz-btn--big" id="qz-finish2">' + QZ_ICON.flag + ' Testni yakunlash</button>' +
        '</div>';
    } else {
      const ok = questions.filter(function (q, i) { return picked[i] === correctOf(q); }).length;
      const skip = picked.filter(function (p) { return p < 0; }).length;
      const bad = questions.length - ok - skip;
      const pct = Math.round(ok / questions.length * 100);
      const level = pct >= 80 ? "high" : pct >= 60 ? "mid" : "low";
      const word = pct === 100 ? "A'lo!" : pct >= 80 ? "Yaxshi natija!" : pct >= 60 ? "Yomon emas!" : "Mashq qiling";
      const msg = pct === 100 ? "Barcha savollarga to'g'ri javob berdingiz! 🎉"
        : pct >= 80 ? "Zo'r! Xatolaringizning yechimini ko'rib chiqing."
        : pct >= 60 ? "Xatolar ustida ishlasangiz, natija yanada yaxshi bo'ladi."
        : "Yechimlarni diqqat bilan o'qing va qaytadan ishlab ko'ring.";
      const mm = Math.floor(spent / 60), ss = spent % 60;
      const other = sets.find(function (s) { return s.tur !== tur; });
      html =
        '<div class="qz-result qz-result--' + level + '">' + (pct >= 80 ? confetti() : "") +
          '<div class="qz-result-top"><div class="qz-ring-wrap">' + ring(pct) +
            '<div class="qz-ring-text"><b>' + ok + ' / ' + questions.length + '</b><span>' + word + '</span></div></div>' +
            '<p class="qz-msg">' + topicName + ' — ' + set.nom + ' ' + set.qavs + '<br><span>' + msg + '</span></p></div>' +
          '<div class="qz-stats">' +
            '<div class="qz-stat ok"><span>' + QZ_ICON.check + '</span><div><small>To\'g\'ri</small><b>' + ok + '</b></div></div>' +
            '<div class="qz-stat bad"><span>' + QZ_ICON.cross + '</span><div><small>Xato' + (skip ? " / javobsiz" : "") + '</small><b>' + bad + (skip ? " / " + skip : "") + '</b></div></div>' +
            '<div class="qz-stat time"><span>' + QZ_ICON.clock + '</span><div><small>Vaqt</small><b>' + mm + ':' + (ss < 10 ? "0" : "") + ss + '</b></div></div>' +
          '</div>' +
          '<div class="qz-actions">' +
            (bad + skip ? '<button type="button" class="qz-btn qz-btn--ghost" id="qz-only-wrong">Faqat xatolarni ko\'rsatish</button>' : "") +
            '<button type="button" class="qz-btn" id="qz-again">Qaytadan ishlash</button>' +
          '</div>' +
          (other ? '<button type="button" class="qz-next-test" data-go="' + other.tur + '">' +
            (other.tur === "qiyin" ? "Keyingisi: 2-test · Ko'nikma (qiyinroq) →" : "← 1-test · Tushunish (oson)") + '</button>' : "") +
        '</div>' +
        '<ol class="qz-list">' + questions.map(resultHtml).join("") + '</ol>' +
        (topic && !embedded ? '<div class="qz-foot qz-foot--center"><a class="qz-btn qz-btn--ghost" href="' + topicHref(gradeId, subjectId, topicId) + '">Mavzuga qaytish</a></div>' : "");
    }

    card.innerHTML = html;
    card.classList.toggle("qz-done", finished);
    card.classList.remove("qz-only-wrong");
    qzRenderMath(card);
    wireMarks();

    if (!finished) {
      card.querySelectorAll(".qz-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          const qi = Number(b.dataset.q);
          picked[qi] = Number(b.dataset.o);
          b.parentNode.querySelectorAll(".qz-opt").forEach(function (x) { x.classList.toggle("picked", x === b); });
          const li = b.closest(".qz-q");
          li.classList.remove("qz-q--miss");
          li.querySelector(".qz-belgi").hidden = false;
          document.getElementById("qz-warn").hidden = true;
          updateCount();
        });
      });
      document.getElementById("qz-finish").addEventListener("click", function () { tryFinish(false); });
      document.getElementById("qz-finish2").addEventListener("click", function () { tryFinish(false); });
      placeHead();
    } else {
      document.getElementById("qz-again").addEventListener("click", function () { start(); scrollToY(0); });
      const only = document.getElementById("qz-only-wrong");
      if (only) only.addEventListener("click", function () {
        const on = card.classList.toggle("qz-only-wrong");
        only.textContent = on ? "Hamma savollarni ko'rsatish" : "Faqat xatolarni ko'rsatish";
      });
      card.querySelectorAll("[data-go]").forEach(function (b) {
        b.addEventListener("click", function () { tabsEl.querySelector('[data-tur="' + b.dataset.go + '"]').click(); scrollToY(0); });
      });
    }
  }

  function wireMarks() {
    card.querySelectorAll("[data-mark]").forEach(function (b) {
      b.addEventListener("click", function () {
        const i = Number(b.dataset.mark), q = questions[i];
        const on = qzSavedToggle(savedId(i), { k: quizStatKey(key, tur), i: i, q: q.question, a: q.answer, t: Date.now() });
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on);
        b.querySelector("span").textContent = on ? "Saqlandi" : "Saqlash";
      });
    });
  }

  function updateCount() {
    const n = answeredCount();
    document.getElementById("qz-count").textContent = n + " / " + questions.length;
    document.getElementById("qz-bar").style.width = Math.round(n / questions.length * 100) + "%";
  }

  // ---------- yuqoridagi panel sahifa bilan birga yopishib turadi ----------
  // Mustaqil sahifada — CSS (position: sticky). Mavzu sahifasi ichida oyna o'zi aylanmaydi, shuning uchun
  // tashqi sahifa qancha surilganini yuboradi (mathrun:scroll) va panel shuncha pastga siljitiladi.
  let viewTop = 0;
  function placeHead() {
    const head = document.getElementById("qz-head");
    if (!head || !embedded) return;
    head.style.transform = "";
    const list = card.querySelector(".qz-list");
    const natural = head.getBoundingClientRect().top + window.pageYOffset;
    const max = list.getBoundingClientRect().bottom + window.pageYOffset - head.offsetHeight - natural;
    const shift = Math.max(0, Math.min(viewTop + 8 - natural, max));
    head.style.transform = shift ? "translateY(" + shift + "px)" : "";
    head.classList.toggle("qz-head--float", shift > 0);
  }
  if (embedded) {
    window.addEventListener("message", function (e) {
      if (!e.data || e.data.type !== "mathrun:scroll") return;
      viewTop = e.data.top || 0;
      if (!finished) placeHead();
    });
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
          scrollToY(document.getElementById("qz-q" + a.dataset.jump).offsetTop - 90);
        });
      });
      // yuqoridagi panel tugmasi bosilgan bo'lsa — ogohlantirish ko'rinadigan joyga
      scrollToY(warn.offsetTop - 200);
      return;
    }
    finished = true;
    spent = Math.round((Date.now() - startedAt) / 1000);
    const score = questions.filter(function (q, i) { return picked[i] === correctOf(q); }).length;
    const statKey = quizStatKey(key, tur);
    if (typeof sendQuizResult === "function") sendQuizResult(statKey, questions, picked, score);
    if (typeof saveLocalResult === "function") saveLocalResult(statKey, score, questions.length);
    render();
    scrollToY(0);
  }

  start();
}
