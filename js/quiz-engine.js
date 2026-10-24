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
