// «Biz haqimizda» sahifasidagi raqamlar: tayyor ma'ruzalar, test savollari, interaktiv darslar.
// js/data.js va js/quizzes.js dan sanaydi; raqamlar o'zgarsagina js/raqamlar.json qayta yoziladi.
// GitHub Actions har 3 kunda ishga tushiradi (.github/workflows/raqamlar.yml).
const fs = require("fs");
const vm = require("vm");

function ol(fayl, nom) {
  const ctx = { window: {}, document: undefined, console };
  vm.runInNewContext(fs.readFileSync(fayl, "utf8") + "\n;__natija = " + nom + ";", ctx);
  return ctx.__natija;
}

const sayt = ol("js/data.js", "SITE_DATA");
const testlar = ol("js/quizzes.js", "QUIZ_DATA");

let maruza = 0, interaktiv = 0;
sayt.grades.forEach(function (g) {
  g.subjects.forEach(function (s) {
    s.topics.forEach(function (t) {
      if (t.lecture && t.lecture.embedUrl) maruza++;
      if (t.interactive) interaktiv++;
    });
  });
});
let savol = 0;
Object.keys(testlar).forEach(function (k) {
  const v = testlar[k];
  savol += Array.isArray(v) ? v.length : (v.oson || []).length + (v.qiyin || []).length;
});

const yangi = { maruza: maruza, savol: savol, interaktiv: interaktiv };
const fayl = "js/raqamlar.json";
let eski = null;
try { eski = JSON.parse(fs.readFileSync(fayl, "utf8")); } catch (e) {}
if (eski && eski.maruza === maruza && eski.savol === savol && eski.interaktiv === interaktiv) {
  console.log("O'zgarish yo'q:", yangi);
  process.exit(0);
}
yangi.sana = new Date().toISOString().slice(0, 10);
fs.writeFileSync(fayl, JSON.stringify(yangi, null, 2) + "\n");
console.log("Yangilandi:", yangi);
