/*
  Test natijalari (nomsiz): o'quvchi testni tugatganda qaysi savolda qaysi javobni tanlagani
  Firebase ma'lumotlar bazasiga (Firestore, "natijalar" to'plami) yoziladi. Ism, email va boshqa
  shaxsiy ma'lumot yozilmaydi. Natijalarni faqat admin o'qiy oladi (qoidalar — firestore.rules).
  Kutubxona yuklanmaydi: bitta oddiy so'rov yuboriladi, test sekinlashmaydi.
*/

// Mavzu testlari: QUIZ_DATA[key] — eski ko'rinishda savollar ro'yxati (bitta test) yoki { oson: [...], qiyin: [...] }.
// Natija kaliti: 1-test (oson) uchun mavzu kaliti o'zi, 2-test uchun oxiriga "|qiyin" qo'shiladi.
function quizSets(key) {
  const d = typeof QUIZ_DATA !== "undefined" ? QUIZ_DATA[key] : null;
  if (!d) return [];
  if (Array.isArray(d)) return d.length ? [{ tur: "oson", q: d }] : [];
  return ["oson", "qiyin"].filter(function (t) { return d[t] && d[t].length; }).map(function (t) { return { tur: t, q: d[t] }; });
}
function quizStatKey(key, tur) { return tur === "qiyin" ? key + "|qiyin" : key; }
function quizByStatKey(statKey) {
  const p = String(statKey).split("|");
  const tur = p[3] === "qiyin" ? "qiyin" : "oson";
  const set = quizSets(p.slice(0, 3).join("|")).find(function (s) { return s.tur === tur; });
  return set ? set.q : [];
}

// test savollari o'zgarsa, eski natijalar yangisi bilan aralashmasligi uchun qisqa "imzo"
function quizHash(questions) {
  const text = JSON.stringify(questions.map(function (q) { return [q.question, q.options, q.answer]; }));
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// key — "5|matematika|<mavzu>", chosen — har savolda tanlangan javobning options dagi o'rni, correct — to'g'ri javoblar soni
function sendQuizResult(key, questions, chosen, correct) {
  try {
    if (typeof FIREBASE_CONFIG === "undefined" || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") return;
    if (!window.fetch || chosen.length !== questions.length) return;
    const url = "https://firestore.googleapis.com/v1/projects/" + FIREBASE_CONFIG.projectId +
      "/databases/(default)/documents/natijalar?key=" + FIREBASE_CONFIG.apiKey;
    const body = {
      fields: {
        k: { stringValue: key },
        h: { stringValue: quizHash(questions) },
        s: { arrayValue: { values: chosen.map(function (i) { return { integerValue: String(i) }; }) } },
        n: { integerValue: String(correct) },
        t: { timestampValue: new Date().toISOString() }
      }
    };
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true })
      .catch(function () { /* internet yo'q yoki baza yoqilmagan — test baribir ishlaydi */ });
  } catch (e) { /* natija yozilmasa ham test ishlayveradi */ }
}

// o'quvchining o'z natijasi — shu brauzerda saqlanadi (kirgan bo'lsa, hisobiga ham ko'chiriladi — auth.js)
function saveLocalResult(key, correct, total) {
  try {
    const K = "mathlearn-natijalar-v1";
    const all = JSON.parse(localStorage.getItem(K)) || {};
    const old = all[key] || {};
    const pct = Math.round(correct / total * 100);
    all[key] = { best: Math.max(old.best || 0, pct), last: pct, count: (old.count || 0) + 1, t: Date.now() };
    localStorage.setItem(K, JSON.stringify(all));
  } catch (e) { /* saqlab bo'lmasa ham test ishlayveradi */ }
}
