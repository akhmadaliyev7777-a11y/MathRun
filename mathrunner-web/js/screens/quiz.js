// Mavzu testi (1–4 sinf). Testning o'zi — umumiy dvigatelda (../js/quiz-core.js, 5–11-sinf bilan bir xil);
// bu yerda faqat 1–4-sinfga xos qism: ma'lumot (data/banks), formulalar (mathfmt.js), natijani yozish.
// Dizayn: ../css/test.css (qz-* sinflari). Manzil: #/test/<levelId>
import { el, loadJSON, saveBest, starsFor } from '../util.js';
import { levelById, footer, nav, applyKingdom } from '../app.js';
import { questionHTML, answerHTML, mathLoaded } from '../mathfmt.js';
import { topicTitle, testLabel, testsOf } from '../topicTitles.js';

// bankdagi yozuv -> dvigatel savoli
const toQuestion = (b) => ({
  question: b.question,
  options: [String(b.correctAnswer), ...b.wrongAnswers.map(String)],
  answer: String(b.correctAnswer),
  explain: b.explain || '',
  rasm: b.rasm || '',
});

// umumiy dvigatel oddiy skript sifatida yuklanadi (window.QuizCore)
let corePromise = null;
function loadCore() {
  if (window.QuizCore) return Promise.resolve(window.QuizCore);
  corePromise ||= new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = '../js/quiz-core.js?v=1';
    s.onload = () => ok(window.QuizCore);
    s.onerror = fail;
    document.head.append(s);
  });
  return corePromise;
}

export async function render(root, [levelId]) {
  const found = levelById(levelId);
  if (!found) { location.hash = '#/'; return; }
  const { grade, chorak, block, level } = found;
  applyKingdom(grade);

  root.innerHTML = '<div class="boot">Yuklanmoqda…</div>';
  const tests = testsOf(block);
  const cache = {};
  const bankOf = async (lv) => (cache[lv.id] ||= (await loadJSON(`data/${lv.bank}`)).map(toQuestion));
  // savollar darrov chiqadi; formulalar kutubxonasi (KaTeX) kelgach sahifa o'zi qayta chiziladi
  let Core;
  try { [Core] = await Promise.all([loadCore(), bankOf(level)]); }
  catch (e) { root.innerHTML = '<div class="boot">Testni yuklab bo\'lmadi.</div>'; console.error(e); return; }

  const backHash = `#/g/${grade.grade}/c/${chorak.chorak}`;
  const page = el('div', { class: 'quiz-page' });
  const tabsEl = el('div', { class: 'quiz-progress' });
  const card = el('div', { id: 'quiz-card' });
  page.append(
    el('div', { class: 'quiz-topbar' },
      el('a', { class: 'quiz-back', href: backHash }, '← Mavzularga qaytish'),
      tabsEl),
    card);
  root.replaceChildren(nav(null), page, footer());

  // umumiy natijalar tizimidagi kalit: <sinf>|boshlangich|<daraja id> (js/natija.js, Mening natijalarim, admin)
  const statKey = (id) => `${grade.grade}|boshlangich|${id}`;

  const ctrl = Core.mount({
    card, tabsEl, title: topicTitle(grade, chorak, block), current: level.id,
    tests: tests.map((t) => ({
      id: t.id, nom: testLabel(block, t), desc: `${t.count} savol`,
      headTitle: testLabel(block, t), nextLabel: testLabel(block, t),
      questions: () => bankOf(t),
    })),
    html: { q: (t) => questionHTML(t, { compact: true }), a: (t) => answerHTML(t, { compact: true }) },
    savedKey: (id, i) => `${statKey(id)}#${i}`,
    savedData: (id, i, q) => ({ k: statKey(id), i, q: q.question, a: q.answer, t: Date.now() }),
    onFinish: (r) => {
      saveBest(r.test.id, starsFor(r.score, r.questions.length), r.score * 10);
      // umumiy tizimga: shu qurilmadagi natija (kirgan bo'lsa hisobga ham ko'chadi) va nomsiz javoblar statistikasi
      if (typeof sendQuizResult === 'function') sendQuizResult(statKey(r.test.id), r.questions, r.picked, r.score);
      if (typeof saveLocalResult === 'function') saveLocalResult(statKey(r.test.id), r.score, r.questions.length);
    },
    onTestChange: (id) => history.replaceState(null, '', `#/test/${id}`),
    backHref: backHash, backLabel: 'Mavzularga qaytish',
  });
  if (!window.katex) mathLoaded().then((ok) => { if (ok && card.isConnected) ctrl.repaint(); });
}
