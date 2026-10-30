import { el, loadJSON, saveBest, starsFor } from '../util.js';
import { levelById, applyKingdom, nav, footer } from '../app.js';
import { renderResult } from './result.js';
import { GAMES } from '../games/index.js?v=42';
import { MASHQ_SIZE } from '../topicTitles.js';

export async function render(root, [levelId, mashqStr]) {
  const found = levelById(levelId);
  if (!found) { location.hash = '#/'; return; }
  const { grade, chorak, block, level } = found;
  applyKingdom(grade);

  if (!level.webSupported) {
    root.replaceChildren(nav(null), el('main', { class: 'wrap', style: 'padding:80px 0;text-align:center' },
      el('h1', {}, 'Bu o\'yin web versiyada tez orada'),
      el('p', { class: 'section__lead' }, 'Hozircha faqat mobil ilovada mavjud.'),
      el('a', { href: `#/g/${grade.grade}/c/${chorak.chorak}`, class: 'btn btn--ink' }, 'Mavzularga qaytish')), footer());
    return;
  }

  // testlar yuqori sinflardagidek alohida sahifada ochiladi
  if (level.gameKind === 'test') { location.replace(`#/test/${level.id}`); return; }

  root.innerHTML = '<div class="boot">Yuklanmoqda…</div>';
  let bank;
  try { bank = await loadJSON(`data/${level.bank}`); }
  catch (e) { root.innerHTML = '<div class="boot">Bankni yuklab bo\'lmadi.</div>'; console.error(e); return; }

  // o'yin 2 ta mashqqa bo'linadi: har biri 10 ta topshiriq (jami 20)
  const mashqCount = Math.max(1, Math.ceil(bank.length / MASHQ_SIZE));
  const mashq = Math.min(mashqCount, Math.max(1, Number(mashqStr || 1)));
  const part = bank.slice((mashq - 1) * MASHQ_SIZE, mashq * MASHQ_SIZE);

  const ctx = {
    root, grade, chorak, block, level, bank: part, mashq, mashqCount, totalTasks: bank.length,
    bestKey: `${level.id}:m${mashq}`,
    // o'yinlar bo'limidan mavzu tanlab kirgan bo'lsa — qaytishda o'sha ro'yxatga
    backHash: (() => { try { const q = JSON.parse(sessionStorage.getItem('mw-oyin-qayt') || 'null'); if (q && q.id === level.id) return q.hash; } catch { /* */ } return `#/g/${grade.grade}/c/${chorak.chorak}`; })(),
    finish: (correct, total, extra = {}) => {
      const stars = starsFor(correct, total);
      const score = extra.score ?? (correct * 10 + (extra.longestStreak || 0) * 5);   // o'yin o'z ochkosini hisoblasa — shu
      const { improved, prevScore } = saveBest(ctx.bestKey, stars, score);
      renderResult(ctx, { correct, total, stars, score, improved, prevScore, ...extra });
    },
  };

  const game = GAMES[level.gameKind];
  if (game) return game(ctx);
  // fallback (kelib chiqmasligi kerak)
  ctx.finish(0, 0);
}
