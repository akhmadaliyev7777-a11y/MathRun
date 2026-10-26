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
const QZ_KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";

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
  if (!els.length) return Promise.resolve();
  return qzLoadKatex().then(function (katex) {
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

// «Mening natijalarim» dagi havola (test.html...#qz-q5) savolni yuqoridagi yopishqoq panel ostida qoldirmasin:
// savollarga panel balandligicha chekinish (scroll-margin-top, css/test.css) beriladi; formulalar chizilgach
// (savollar balandligi o'zgaradi) shu savolga yana bir marta o'tiladi.
function qzHeadOffset(card, embedded) {
  const head = card.querySelector("#qz-head");
  card.style.setProperty("--qz-off", (head && !embedded ? head.offsetHeight + 24 : 16) + "px");
}

// ---------- test sahifasi ----------
// Testning o'zi (savollar kartasi, natija, saqlash...) umumiy dvigatelda — js/quiz-core.js (1–4-sinf ham shundan foydalanadi).
// Bu yerda faqat 5–11-sinfga xos qismi: ma'lumot (QUIZ_DATA), manzil parametrlari, formulalar, natijani yozish.

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

  // 1-test (oson) va 2-test (qiyin): bittasi bo'lmasa, yorliq «tez orada» bo'lib turadi
  const tests = ["oson", "qiyin"].map(function (t) {
    const set = sets.find(function (s) { return s.tur === t; });
    const info = QZ_TUR[t];
    if (!set) return { id: t, nom: info.nom, off: true };
    return {
      id: t, nom: info.nom, desc: info.tavsif + " · " + set.q.length + " savol",
      headTitle: info.nom + " " + info.qavs, headSub: info.uchun,
      nextLabel: info.nom + " · " + info.tavsif.split(" · ")[0] + " " + info.qavs,
      questions: set.q
    };
  });

  // PDF (chop etish) rejimi: test.html?...&pdf=oson — test o'rniga chop etiladigan varaq chiqadi (natija yozilmaydi)
  const pdfTur = getQueryParam("pdf");
  const pdfInfo = {
    head: "Mathlearn · " + (grade ? grade.name : "") + (subject ? " · " + subject.name : ""),
    topic: topicName,
    file: "Mathlearn " + (grade ? grade.name + " " : "") + topicName,
    seed: key,
    fayl: gradeId + "-" + topicId   // tayyor PDF: pdf/<sinf>-<mavzu>-1-test.pdf (_reja/tools/pdf_yasash.py)
  };
  if (pdfTur === "oson" || pdfTur === "qiyin") {
    const t = tests.find(function (x) { return x.id === pdfTur && !x.off; });
    if (t) { qzPdfPage(t, pdfInfo, backLink, embedded); return; }
  }
  qzPdfButtons(tests, pdfInfo, tabsEl, embedded);

  let jumped = false;
  QuizCore.mount({
    card: card, tabsEl: tabsEl, title: topicName, tests: tests, current: tur, embedded: embedded,
    html: { q: qzMathText, a: qzMathText, sol: qzMathText },
    afterPaint: function (root) {
      qzHeadOffset(root, embedded);
      const math = qzRenderMath(root);
      const m = !jumped && !embedded && /^#qz-q\d+$/.test(location.hash) && document.getElementById(location.hash.slice(1));
      jumped = true;
      if (m) math.then(function () { m.scrollIntoView(); });
    },
    savedKey: function (id, i) { return quizStatKey(key, id) + "#" + i; },
    savedData: function (id, i, q) { return { k: quizStatKey(key, id), i: i, q: q.question, a: q.answer, rasm: q.rasm || undefined, t: Date.now() }; },
    onFinish: function (r) {
      const statKey = quizStatKey(key, r.test.id);
      if (typeof sendQuizResult === "function") sendQuizResult(statKey, r.questions, r.picked, r.score);
      if (typeof saveLocalResult === "function") saveLocalResult(statKey, r.score, r.questions.length);
    },
    onTestChange: function (id) {
      if (!history.replaceState) return;
      const u = new URL(location.href);
      if (id === "qiyin") u.searchParams.set("tur", "qiyin"); else u.searchParams.delete("tur");
      history.replaceState(null, "", u.toString());
    },
    backHref: topic ? topicHref(gradeId, subjectId, topicId) : "", backLabel: "Mavzuga qaytish"
  });
}

// ---------- testni PDF qilib saqlash (brauzerning «Chop etish → PDF sifatida saqlash» oynasi) ----------
// Har test uchun alohida tugma. Bosilganda sahifa oxiriga chop etiladigan varaq (#qz-print) yasaladi:
// sarlavha, ism-familiya qatori, 20 savol (rasmi bilan, javoblar A–D asl tartibda), keyin yangi betda «Javoblar»
// (kalit jadvali va qisqa yechimlar). Ekranda bu varaq ko'rinmaydi, chop etishda esa faqat u chiqadi (css/test.css).
// Formulalar test sahifasidagi qzMathText + qzRenderMath bilan chiziladi.
// Mavzu sahifasi ichida (iframe) chop etish ishonchsiz — tugma testni yangi oynada &pdf=... bilan ochadi.
const QZ_HARF = ["A", "B", "C", "D", "E", "F"];
const QZ_PDF_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg>';

function qzPlain(t) { return String(t).replace(/<[^>]*>/g, "").replace(/\\\(|\\\)/g, "").replace(/\\[a-z]+/g, "").replace(/\s+/g, " ").trim(); }

// bir savol rasmini qayta ishlatganda SVG ichidagi id'lar takrorlanmasin (strelka, gradiyent havolalari)
function qzUniqIds(svg, pre) {
  return String(svg).replace(/\bid="([^"]+)"/g, 'id="' + pre + '$1"')
    .replace(/url\(#([^)]+)\)/g, "url(#" + pre + "$1)")
    .replace(/href="#([^"]+)"/g, 'href="#' + pre + '$1"');
}

// Bazada to'g'ri javob ko'pincha birinchi turadi; onlayn testda javoblar har safar aralashadi.
// Varaqda esa tartib aralashtiriladi, lekin har safar BIR XIL (mavzu + test + savol raqamidan hosil bo'ladi) —
// shuning uchun qayta yuklab olingan PDF va uning javoblar kaliti o'zgarmaydi.
function qzPdfOrder(seedText, n) {
  let h = 2166136261;
  for (let k = 0; k < seedText.length; k++) { h ^= seedText.charCodeAt(k); h = Math.imul(h, 16777619); }
  const rnd = function () {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [];
  for (let k = 0; k < n; k++) a.push(k);
  for (let k = n - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); const x = a[k]; a[k] = a[j]; a[j] = x; }
  return a;
}

function qzPdfHtml(test, info) {
  const qs = test.questions;
  const info2 = QZ_TUR[test.id];
  const orders = qs.map(function (q, i) { return qzPdfOrder((info.seed || "") + "|" + test.id + "|" + i + "|" + q.question, q.options.length); });
  const list = qs.map(function (q, i) {
    const longest = Math.max.apply(null, q.options.map(function (x) { return qzPlain(x).length; }));
    const cols = longest <= 9 && !q.rasm ? 4 : longest <= (q.rasm ? 18 : 30) ? 2 : 1;
    const opts = orders[i].map(function (oi, j) {
      return '<li><b>' + QZ_HARF[j] + ')</b> <span>' + qzMathText(q.options[oi]) + '</span></li>';
    }).join("");
    return '<li class="qp-q' + (q.rasm ? " qp-q--fig" : "") + '">' +
      '<span class="qp-num">' + (i + 1) + '.</span>' +
      '<div class="qp-main"><div class="qp-text">' + qzMathText(q.question) + '</div>' +
        '<ol class="qp-opts qp-c' + cols + '">' + opts + '</ol></div>' +
      (q.rasm ? '<div class="qp-fig">' + qzUniqIds(q.rasm, "qp" + test.id + (i + 1) + "-") + '</div>' : "") +
    '</li>';
  }).join("");
  const keyRow = function (q, i) {
    const k = orders[i].indexOf(q.options.indexOf(q.answer));
    return '<tr><td>' + (i + 1) + '</td><td class="qp-k">' + (QZ_HARF[k] || "?") + '</td><td>' + qzMathText(q.answer) + '</td></tr>';
  };
  const half = Math.ceil(qs.length / 2);
  const table = function (a, b) {
    return '<table class="qp-key"><thead><tr><th>№</th><th>Javob</th><th>Qiymati</th></tr></thead><tbody>' +
      qs.slice(a, b).map(function (q, j) { return keyRow(q, a + j); }).join("") + '</tbody></table>';
  };
  const sols = qs.map(function (q, i) {
    const s = q.yechim || q.explain;
    return s ? '<li><b>' + (i + 1) + '.</b> ' + qzMathText(s) + '</li>' : "";
  }).join("");
  return '<header class="qp-head">' +
      '<div class="qp-brand">' + info.head + '</div>' +
      '<h1>' + info.topic + '</h1>' +
      '<div class="qp-sub">' + info2.nom + ' ' + info2.qavs + ' · ' + qs.length + ' ta savol</div>' +
      '<div class="qp-lines"><span>Ism-familiya: <i class="qp-l qp-l--w"></i></span><span>Sinf: <i class="qp-l"></i></span><span>Sana: <i class="qp-l"></i></span></div>' +
      '<div class="qp-hint">Har savolda bitta to\'g\'ri javobni belgilang.</div>' +
    '</header>' +
    '<ol class="qp-list">' + list + '</ol>' +
    '<section class="qp-ans">' +
      '<h2>Javoblar</h2><div class="qp-sub">' + info.topic + ' · ' + info2.nom + ' ' + info2.qavs + '</div>' +
      '<div class="qp-keys">' + table(0, half) + table(half, qs.length) + '</div>' +
      (sols ? '<h3>Qisqa yechimlar</h3><ol class="qp-sols">' + sols + '</ol>' : "") +
    '</section>';
}

// varaqni yasab, formulalarni chizadi; tayyor bo'lganda va'da bajariladi
function qzPdfBuild(test, info) {
  let box = document.getElementById("qz-print");
  if (!box) { box = document.createElement("div"); box.id = "qz-print"; document.body.appendChild(box); }
  box.innerHTML = qzPdfHtml(test, info);
  document.documentElement.classList.add("qz-printing");
  const fonts = document.fonts && document.fonts.ready ? function () { return document.fonts.ready; } : function () {};
  return qzRenderMath(box).then(fonts).then(function () { return box; });
}

function qzPdfPrint(test, info) {
  const old = document.title;
  return qzPdfBuild(test, info).then(function () {
    document.title = info.file + " — " + QZ_TUR[test.id].nom;
    const back = function () { document.title = old; window.removeEventListener("afterprint", back); };
    window.addEventListener("afterprint", back);
    try { window.print(); } catch (e) { back(); }
  });
}

function qzPdfUrl(id) {
  const u = new URL(location.href);
  u.searchParams.delete("tur"); u.searchParams.set("pdf", id); u.hash = "";
  return u.toString();
}

// «1-test — PDF», «2-test — PDF» tugmalari (yorliqlar ustida)
function qzPdfButtons(tests, info, tabsEl, embedded) {
  const real = tests.filter(function (t) { return !t.off; });
  if (!real.length) return;
  const bar = document.createElement("div");
  bar.className = "qz-pdf";
  bar.innerHTML = real.map(function (t) {
    const label = QZ_PDF_ICON + '<span>' + t.nom + ' — PDF</span>';
    const tip = t.nom + "ni PDF qilib saqlash yoki chop etish";
    return embedded
      ? '<a class="qz-pdf-btn" href="' + qzPdfUrl(t.id) + '" target="_blank" rel="noopener" title="' + tip + '">' + label + '</a>'
      : '<button type="button" class="qz-pdf-btn" data-pdf="' + t.id + '" title="' + tip + '">' + label + '</button>';
  }).join("");
  tabsEl.parentNode.insertBefore(bar, tabsEl);
  qzPdfFayllar(bar, real, info);
  bar.querySelectorAll("[data-pdf]").forEach(function (b) {
    b.addEventListener("click", function () {
      const t = real.find(function (x) { return x.id === b.dataset.pdf; });
      b.disabled = true;
      Promise.resolve(typeof t.questions === "function" ? t.questions() : t.questions).then(function (qs) {
        return qzPdfPrint({ id: t.id, questions: qs }, info);
      }).then(function () { b.disabled = false; }, function () { b.disabled = false; });
    });
  });
}

// Tayyor PDF fayl bor bo'lsa (pdf/royxat.json, yasash: _reja/tools/pdf_yasash.py), tugma PDF faylning o'zini yangi oynada
// ochadi (brauzerning PDF oynasi: varaqlar soni ko'rinadi, yuklab olinganda nomi — «6-sinf <mavzu> 1-test.pdf»).
// Fayl yo'q bo'lsa — yuqoridagi chop etish usuli qoladi.
function qzPdfFayllar(bar, real, info) {
  if (!window.fetch || !info.fayl) return;
  fetch("pdf/royxat.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw r; return r.json(); }).then(function (royxat) {
    real.forEach(function (t, i) {
      const m = royxat && royxat[info.fayl + (t.id === "qiyin" ? "-2-test" : "-1-test")];
      const old = bar.querySelector('[data-pdf="' + t.id + '"]') || bar.children[i];
      if (!m || !m.fayl || !old) return;
      const a = document.createElement("a");
      a.className = "qz-pdf-btn";
      a.href = "pdf/" + encodeURIComponent(m.fayl) + (m.v ? "?v=" + m.v : "");
      a.target = "_blank"; a.rel = "noopener";
      a.title = t.nom + "ni PDF fayl qilib ochish va yuklab olish";
      a.innerHTML = old.innerHTML;
      old.parentNode.replaceChild(a, old);
    });
  }).catch(function () { /* ro'yxat yo'q — chop etish usuli qoladi */ });
}

// test.html?...&pdf=oson — varaq ekranda ko'rinadi, ustida «Chop etish / PDF» tugmasi; chop etish oynasi o'zi ochiladi
function qzPdfPage(t, info, backLink, embedded) {
  document.documentElement.classList.add("qz-pdf-mode");
  const test = { id: t.id, questions: t.questions };
  // &tayyor=1 — tayyor PDF fayl yasash uchun (_reja/tools/pdf_yasash.py): varaq yasaladi, chop etish oynasi ochilmaydi
  if (getQueryParam("tayyor") === "1") {
    Promise.resolve(typeof test.questions === "function" ? test.questions() : test.questions).then(function (qs) {
      test.questions = qs;
      return qzPdfBuild(test, info);
    }).then(function () {
      document.title = info.file + " — " + QZ_TUR[test.id].nom;
      document.documentElement.classList.add("qz-pdf-tayyor");
    });
    return;
  }
  const tools = document.createElement("div");
  tools.className = "qz-pdf-tools";
  const u = new URL(location.href); u.searchParams.delete("pdf");
  if (t.id === "qiyin") u.searchParams.set("tur", "qiyin");
  tools.innerHTML = '<a class="qz-btn qz-btn--ghost" href="' + u.toString() + '">← Testga qaytish</a>' +
    '<button type="button" class="qz-btn" id="qz-pdf-go">' + QZ_PDF_ICON + ' Chop etish / PDF sifatida saqlash</button>' +
    '<p>Ochilgan oynada «Printer» o\'rniga <b>«PDF sifatida saqlash»</b> (Save as PDF) ni tanlang.</p>';
  document.body.insertBefore(tools, document.body.firstChild);
  Promise.resolve(typeof test.questions === "function" ? test.questions() : test.questions).then(function (qs) {
    test.questions = qs;
    document.getElementById("qz-pdf-go").addEventListener("click", function () { qzPdfPrint(test, info); });
    return qzPdfPrint(test, info);
  });
}
