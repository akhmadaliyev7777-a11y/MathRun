// Mini-o'yinlar. Har biri (ctx) -> render -> tugagach ctx.finish(correct, total, extra).
// Bank schemalari castles_data.dart o'yin sahnalari bilan bir xil.
import { el, shuffle } from '../util.js';
import { ICON } from '../icons.js';

import { shell, checkBtn, flash } from './shell.js';
import { MORE } from './more.js';
import { netSVG } from './nets.js';
import { gameSet } from './venn.js?v=6';
import { gameNumberOrder } from './tartib.js?v=7';
import { gameEquationGrid } from './jadval.js?v=1';

// ================= placeValue =================
function gamePlaceValue(ctx) {
  const tasks = ctx.bank;
  let idx = 0, correct = 0, streak = 0, longest = 0;
  const s = shell(ctx, tasks[0].prompt, 'columns', true);

  function render() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    const useH = t.targetNumber >= 100;
    const st = { h: 0, t: 0, o: 0 };
    const out = el('div', { style: 'font-family:var(--f-head);font-weight:800;font-size:34px;text-align:center;margin-top:10px' });

    function col(key, label) {
      return el('div', { class: 'pv__col' },
        el('b', {}, label),
        el('div', { class: 'pv__count', id: 'c-' + key }, '0'),
        el('div', { class: 'pv__pm' },
          el('button', { onclick: () => { if (st[key] > 0) { st[key]--; upd(); } } }, '−'),
          el('button', { onclick: () => { if (st[key] < 12) { st[key]++; upd(); } } }, '+')));
    }
    function upd() {
      for (const k of ['h', 't', 'o']) { const n = document.getElementById('c-' + k); if (n) n.textContent = st[k]; }
      out.textContent = `Qurilgan son: ${100 * st.h + 10 * st.t + st.o}`;
    }

    s.area.replaceChildren(
      el('div', { style: 'text-align:center;font-family:var(--f-head);font-weight:800;font-size:20px' }, `Maqsad: ${t.targetNumber}`),
      el('div', { class: 'pv' }, useH && col('h', 'Yuzlik'), col('t', "O'nlik"), col('o', 'Birlik')),
      out);
    upd();
    s.foot.replaceChildren(checkBtn('Tekshirish', () => {
      const ok = 100 * st.h + 10 * st.t + st.o === t.targetNumber;
      if (ok) { correct++; streak++; longest = Math.max(longest, streak); } else streak = 0;
      idx++;
      if (idx >= tasks.length) ctx.finish(correct, tasks.length, { longestStreak: longest });
      else render();
    }));
  }
  render();
}

// ================= balanceScale =================
/* yangi tarozi misoli — bosqich bankidagi chegaralarda (shakllar soni, jami og'irlik, tosh og'irligi) */
const BAL_SHAPES = [['triangle', 'uchburchak'], ['circle', 'doira'], ['square', 'kvadrat']];
const rndI = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function genBalance(bank, hard) {
  // qiyin rejim: 2–5 ta shakl, bitta shakl 3–15, tosh 5–40
  const maxN = hard ? 5 : Math.max(...bank.map(t => t.shapeCount)), maxT = hard ? 115 : Math.max(...bank.map(t => t.total)),
    maxK = hard ? 40 : Math.max(...bank.map(t => t.knownWeight)), unit = bank[0].unit || 'kg';
  for (let i = 0; i < 300; i++) {
    const n = rndI(hard ? 2 : 1, maxN), x = hard ? rndI(3, 15) : rndI(1, Math.max(2, Math.floor(maxT / n))), k = rndI(hard ? 5 : 0, maxK), total = n * x + k;
    if (total > maxT || total < 2 || (n === 1 && k === 0)) continue;   // «□ = 6» kabi yechimsiz-oson misol bo'lmasin
    const opts = new Set([x]);
    for (const v of shuffle([x - 1, x + 1, x + 2, x - 2, total - k, k, x + 3])) if (v > 0 && opts.size < 4) opts.add(v);
    if (opts.size < 4) continue;
    const [shape, nm] = BAL_SHAPES[rndI(0, BAL_SHAPES.length - 1)];
    return { id: 'gen_' + Math.random().toString(36).slice(2), prompt: `Bitta ${nm} necha ${unit}?`, shape, shapeCount: n, knownWeight: k, total, unit,
      options: [...opts].sort((a, b) => a - b) };
  }
  return { ...bank[0] };
}
let balHard = false;   // tanlangan rejim (Oson / Qiyin) — sahifa ochiq turganda eslab qolinadi
function gameBalance(ctx) {
  // oson: bankdagi misollar; qiyin: hammasi yangi, katta sonlar bilan (mashqdagi topshiriqlar soni o'zgarmaydi)
  const N = ctx.bank.length;
  const make = () => balHard ? Array.from({ length: N }, () => genBalance(ctx.bank, true)) : [...ctx.bank];
  let tasks = make();
  let idx = 0, correct = 0, streak = 0, longest = 0, locked = false;
  const s = shell(ctx, 'Tarozi muvozanatda. Noma\'lumni toping.', 'scale');

  function render() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    locked = false;
    const answer = (t.total - t.knownWeight) / t.shapeCount;

    const shapes = Array.from({ length: t.shapeCount }, () => el('div', { class: 'shape' }));
    const leftPan = el('div', { class: 'pan' },
      el('div', { class: 'pan__row' }, ...shapes, t.knownWeight ? el('span', { class: 'weight' }, `${t.knownWeight} ${t.unit}`) : null),
      el('b', { style: 'font-family:var(--f-head)' }, '?'));
    const rightPan = el('div', { class: 'pan' },
      el('div', { class: 'pan__row' }, el('span', { class: 'weight', style: 'font-size:20px;padding:8px 14px' }, `${t.total} ${t.unit}`)),
      el('b', { style: 'font-family:var(--f-head)' }, 'jami'));

    const opts = el('div', { class: 'opts' }, ...t.options.map(o =>
      el('button', { class: 'opt', onclick: (e) => pick(e.currentTarget, o) }, o)));

    function pick(btn, val) {
      if (locked) return;
      locked = true;
      const ok = val === answer;
      btn.classList.add(ok ? 'is-correct' : 'is-wrong');
      if (!ok) [...opts.children].forEach((b, i) => { if (t.options[i] === answer) b.classList.add('is-correct'); });
      if (ok) { correct++; streak++; longest = Math.max(longest, streak); } else streak = 0;
      setTimeout(() => {
        idx++;
        if (idx >= tasks.length) ctx.finish(correct, tasks.length, { longestStreak: longest });
        else render();
      }, ok ? 520 : 900);
    }

    // tenglama ko'rinishi: 2 · □ + 3 = 11
    const eq = `${t.shapeCount > 1 ? t.shapeCount + ' · ' : ''}□${t.knownWeight ? ' + ' + t.knownWeight : ''} = ${t.total}`;
    const modeBtn = (hard, label) => el('button', { class: 'btn' + (balHard === hard ? ' btn--accent' : ''), style: 'padding:6px 16px;min-height:36px',
      onclick: () => { if (balHard === hard) return; balHard = hard; tasks = make(); idx = 0; correct = 0; streak = 0; longest = 0; render(); } }, label);
    s.area.replaceChildren(
      el('div', { style: 'display:flex;gap:8px;justify-content:center;margin-bottom:10px' }, modeBtn(false, 'Oson'), modeBtn(true, 'Qiyin')),
      el('div', { style: 'text-align:center;font-family:var(--f-head);font-weight:800;font-size:18px;margin-bottom:4px' }, t.prompt),
      el('div', { class: 'scale' }, leftPan, el('span', { style: 'font-family:var(--f-head);font-size:28px;align-self:center' }, '='), rightPan),
      el('div', { style: 'text-align:center;font-family:var(--f-head);font-weight:800;font-size:24px;margin:6px 0 2px;color:var(--peri, #3f56c4)' }, 'Tenglama: ' + eq),
      opts);
    // «Yangi tenglama» — joriy misolni yangisiga almashtiradi
    s.foot.replaceChildren(el('button', { class: 'btn', onclick: () => { if (locked) return; tasks[idx] = genBalance(ctx.bank, balHard); render(); } }, 'Yangi tenglama ↻'));
  }
  render();
}

// ================= symmetry =================
function gameSymmetry(ctx) {
  const tasks = ctx.bank;
  let idx = 0, correct = 0, streak = 0, longest = 0;
  const s = shell(ctx, tasks[0].prompt, 'mirror', true);

  function reflect(c, axis, n) {
    if (axis === 'vertical') return { x: n - 1 - c.x, y: c.y };
    if (axis === 'diagonalMain') return { x: c.y, y: c.x };
    if (axis === 'center') return { x: n - 1 - c.x, y: n - 1 - c.y };
    return { x: c.x, y: n - 1 - c.y };
  }
  function render() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    const n = t.gridSize;
    const given = new Set(t.givenCells.map(c => `${c.x},${c.y}`));
    const want = new Set(t.givenCells.map(c => { const r = reflect(c, t.axis, n); return `${r.x},${r.y}`; }));
    // o'qda yotgan berilgan kataklar aks etib o'ziga tushadi — hisobga olmaymiz
    for (const k of [...want]) if (given.has(k)) want.delete(k);
    const on = new Set();
    // toq o'lchamda o'q — o'rtadagi katak qatori, juft o'lchamda — katak qatorlari orasidagi chiziq
    const odd = n % 2 === 1, axisIdx = odd ? Math.floor(n / 2) : -1, half = n / 2;

    const grid = el('div', { class: 'symgrid', style: `grid-template-columns:repeat(${n}, 46px)` });
    function draw() {
      grid.replaceChildren();
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const key = `${x},${y}`;
        const isAxis = t.axis === 'vertical' ? x === axisIdx
          : t.axis === 'diagonalMain' ? x === y
          : t.axis === 'center' ? (odd && x === axisIdx && y === axisIdx)
          : y === axisIdx;
        const line = !odd && ((t.axis === 'vertical' && x === half) ? ' line-l' : (t.axis === 'horizontal' && y === half) ? ' line-t' : '');
        const cls = 'symcell' + (given.has(key) ? ' given' : isAxis ? ' axis' : on.has(key) ? ' on' : '') + (line || '');
        grid.append(el('div', {
          class: cls,
          onclick: () => { if (given.has(key) || isAxis) return; on.has(key) ? on.delete(key) : on.add(key); draw(); },
        }));
      }
    }
    draw();
    s.area.replaceChildren(el('div', { style: 'text-align:center;font-weight:700;color:var(--muted);margin-bottom:6px' }, t.hint), grid);
    s.foot.replaceChildren(checkBtn('Tekshirish', () => {
      const ok = on.size === want.size && [...want].every(k => on.has(k));
      if (ok) { correct++; streak++; longest = Math.max(longest, streak); } else streak = 0;
      idx++;
      if (idx >= tasks.length) ctx.finish(correct, tasks.length, { longestStreak: longest });
      else render();
    }));
  }
  render();
}

// ================= netFold =================
const SOLID_UZ = {
  cube: 'Kub', cuboid: 'Parallelepiped', squarePyramid: 'Piramida',
  triangularPrism: 'Uchburchakli prizma', cylinder: 'Silindr', cone: 'Konus',
};
function gameNetFold(ctx) {
  const tasks = ctx.bank;
  let idx = 0, correct = 0, streak = 0, longest = 0, locked = false;
  const s = shell(ctx, tasks[0].prompt, 'net', true);

  function render() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    locked = false;
    const opts = el('div', { class: 'nf-opts' }, ...shuffle(t.options).map(o =>
      el('button', { class: 'nf-opt', onclick: (e) => pick(e.currentTarget, o) }, SOLID_UZ[o] || o)));
    function pick(btn, val) {
      if (locked) return; locked = true;
      const ok = val === t.target;
      btn.classList.add(ok ? 'is-correct' : 'is-wrong');
      if (!ok) [...opts.children].forEach(b => { if (b.textContent === (SOLID_UZ[t.target] || t.target)) b.classList.add('is-correct'); });
      if (ok) { correct++; streak++; longest = Math.max(longest, streak); } else streak = 0;
      setTimeout(() => {
        idx++;
        if (idx >= tasks.length) ctx.finish(correct, tasks.length, { longestStreak: longest });
        else render();
      }, ok ? 520 : 900);
    }
    // yoyilma rasmi; maslahat — tugma orqali (javobni oldindan ko'rsatib qo'ymaydi)
    const hint = el('div', { class: 'nf-hint', hidden: true }, t.hint);
    s.area.replaceChildren(
      el('div', { style: 'text-align:center' },
        el('div', { class: 'nf-fig', html: netSVG(t.target) }),
        el('button', { class: 'btn nf-hintbtn', onclick: (e) => { hint.hidden = !hint.hidden; e.currentTarget.textContent = hint.hidden ? 'Maslahat' : 'Maslahatni yashirish'; } }, 'Maslahat'),
        hint),
      opts);
    s.foot.replaceChildren();
  }
  render();
}

// ================= algorithmConveyor =================
function gameConveyor(ctx) {
  const items = ctx.bank; // [{text, isTrue}]
  const s = shell(ctx, 'Har bir mulohaza uchun "Ha" yoki "Yo\'q" ni tanlang', 'spark');
  s.setDone(0, items.length);
  const picks = new Array(items.length).fill(null);

  const list = el('div', { class: 'conv' });
  function draw() {
    s.setDone(picks.filter(p => p !== null).length, items.length);
    list.replaceChildren(...items.map((it, i) => el('div', { class: 'conv__item' },
      el('span', {}, it.text),
      el('div', { class: 'conv__btns' },
        el('button', { class: 'pick-yes' + (picks[i] === true ? ' on' : ''), onclick: () => { picks[i] = true; draw(); } }, 'Ha'),
        el('button', { class: 'pick-no' + (picks[i] === false ? ' on' : ''), onclick: () => { picks[i] = false; draw(); } }, "Yo'q")))));
  }
  draw();
  s.area.replaceChildren(list);
  s.foot.replaceChildren(checkBtn('Tekshirish', () => {
    if (picks.includes(null)) return;
    let correct = 0;
    picks.forEach((p, i) => { if (p === items[i].isTrue) correct++; });
    ctx.finish(correct, items.length, { longestStreak: 0 });
  }));
}

export const GAMES = {
  set: gameSet,
  numberOrder: gameNumberOrder,
  placeValue: gamePlaceValue,
  balanceScale: gameBalance,
  symmetry: gameSymmetry,
  netFold: gameNetFold,
  equationGrid: gameEquationGrid,
  algorithmConveyor: gameConveyor,
  ...MORE,
};
