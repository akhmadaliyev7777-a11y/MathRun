#!/usr/bin/env node
/*
  Testlarni tekshirish: node _reja/tools/testlar.js [kalit ...]
  (kalit berilmasa — yangi formatdagi (oson/qiyin) barcha testlar; --hammasi — eski testlar ham)
  1) tuzilish: har savolda aniq 4 ta har xil javob, answer — options dan biri, explain bor, 20 + 20 savol;
  2) formulalar: matndagi kasr va darajalar quiz-engine.js dagi qzMathText bilan KaTeX formulaga to'liq
     aylanganmi — chala qolgan "?/10", "x^2" kabi yozuvlar XATO deb ko'rsatiladi (km/soat kabi birliklar emas);
  3) KaTeX o'rnatilgan bo'lsa (npm i katex — masalan scratchpad'da, NODE_PATH bilan) — har formula xatosiz chiziladimi.
*/
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");

const qe = fs.readFileSync(path.join(root, "js/quiz-engine.js"), "utf8");
eval(qe.slice(qe.indexOf("const QZ_TOKEN"), qe.indexOf("let qzKatexPromise")));
const QUIZ_DATA = new Function(fs.readFileSync(path.join(root, "js/quizzes.js"), "utf8") + "\nreturn QUIZ_DATA;")();

let katex = null;
try { katex = require("katex"); } catch (e) { /* KaTeX yo'q — 3-tekshiruv o'tkazib yuboriladi */ }

const args = process.argv.slice(2);
const all = args.includes("--hammasi");
const keys = args.filter((a) => !a.startsWith("--"));
const list = keys.length ? keys : Object.keys(QUIZ_DATA).filter((k) => all || !Array.isArray(QUIZ_DATA[k]));

let errors = 0, warns = 0, formulas = 0;
function err(where, msg) { errors++; console.log("XATO  " + where + ": " + msg); }
function warn(where, msg) { warns++; console.log("ogoh  " + where + ": " + msg); }

function checkText(where, text) {
  const html = qzMathText(text);
  // formulalar va teglar olib tashlanadi — qolgan matnda chala kasr/daraja bo'lmasligi kerak
  const rest = html.replace(/<span class="qz-m"[^>]*>[^<]*<\/span>/g, " ").replace(/<[^>]*>/g, " ");
  rest.replace(/\S*\/\S*/g, function (w) {
    // o'lchov birligi (kasr emas): km/soat, ℓ/min, so'm/kg, m/s
    if (/^[«(]*([A-Za-zℓʻ'’]{2,}\/[A-Za-zℓʻ'’]+|[A-Za-zℓʻ'’]+\/[A-Za-zℓʻ'’]{2,}|m\/s)[.,;:)»]*$/.test(w)) return w;
    err(where, "kasr formulaga aylanmadi: «" + w + "» — «" + text.slice(0, 60) + "…»");
    return w;
  });
  if (/\^/.test(rest)) err(where, "daraja formulaga aylanmadi — «" + text.slice(0, 60) + "…»");
  if ((text.match(/\\\(/g) || []).length !== (text.match(/\\\)/g) || []).length) err(where, "\\( va \\) soni teng emas");
  html.replace(/data-tex="([^"]*)"/g, function (m, tex) {
    formulas++;
    tex = tex.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&amp;/g, "&");
    if (katex) {
      try { katex.renderToString(tex.replace(/(\d),(?=\d)/g, "$1{,}"), { throwOnError: true, strict: "ignore", macros: { "\\frac": "\\dfrac" } }); }
      catch (e) { err(where, "formula chizilmaydi: " + tex + " — " + e.message.split("\n")[0]); }
    }
    return m;
  });
}

list.forEach(function (k) {
  const d = QUIZ_DATA[k];
  if (!d) { err(k, "bunday test yo'q"); return; }
  const sets = Array.isArray(d) ? { "eski": d } : d;
  if (!Array.isArray(d)) ["oson", "qiyin"].forEach((t) => { if (!d[t] || d[t].length !== 20) err(k, t + " — 20 ta savol bo'lishi kerak (" + (d[t] ? d[t].length : 0) + ")"); });
  Object.keys(sets).forEach(function (t) {
    sets[t].forEach(function (q, i) {
      const w = k + " " + t + " " + (i + 1);
      if (!q.question) err(w, "savol matni yo'q");
      if (!Array.isArray(q.options) || q.options.length !== 4) err(w, "javoblar soni 4 emas");
      else if (new Set(q.options.map(String)).size !== 4) err(w, "bir xil javoblar bor");
      if (!q.options || !q.options.map(String).includes(String(q.answer))) err(w, "answer javoblar ichida yo'q");
      if (!q.explain && !q.yechim) (Array.isArray(d) ? warn : err)(w, "yechim (explain) yo'q");
      checkText(w + " savol", q.question || "");
      (q.options || []).forEach((o, j) => checkText(w + " javob " + "ABCD"[j], String(o)));
      if (q.explain || q.yechim) checkText(w + " yechim", q.explain || q.yechim);
    });
  });
});

console.log("\n" + list.length + " ta test, " + formulas + " ta formula" + (katex ? " (KaTeX bilan tekshirildi)" : " (KaTeX o'rnatilmagan — chizilishi tekshirilmadi)") +
  ": " + errors + " xato, " + warns + " ogohlantirish");
process.exit(errors ? 1 : 0);
