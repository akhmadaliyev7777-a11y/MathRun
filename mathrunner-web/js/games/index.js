// Mini-o'yinlar. Har biri (ctx) -> render -> tugagach ctx.finish(correct, total, extra).
// Bank schemalari castles_data.dart o'yin sahnalari bilan bir xil.
import { el, shuffle } from '../util.js';
import { ICON } from '../icons.js';

import { shell, checkBtn, flash } from './shell.js';
import { MORE } from './more.js';
import { netSVG } from './nets.js';
import { gameSet } from './venn.js?v=7';
import { gameNumberOrder } from './tartib.js?v=9';
import { gameEquationGrid } from './jadval.js?v=2';
import { gameConveyor } from './saralash.js?v=7';
import { gameBalance } from './tarozi.js?v=1';

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
