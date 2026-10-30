// Qo'shimcha o'yinlar: koordinata yo'li, harakat chizig'i, transportir.
// Har biri (ctx) -> render -> tugagach ctx.finish(correct, total, extra). Qobiq — shell.js.
import { el, shuffle } from '../util.js';
import { shell, checkBtn } from './shell.js';

const NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}, ...kids) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of kids.flat()) if (c != null) n.append(c.nodeType ? c : document.createTextNode(String(c)));
  return n;
};

// bitta topshiriq tugadi: natija xabari ko'rsatiladi, so'ng keyingisiga o'tiladi
function runner(ctx, s, tasks, renderTask) {
  let idx = 0, correct = 0, streak = 0, longest = 0, locked = false;
  const next = () => {
    idx++;
    if (idx >= tasks.length) ctx.finish(correct, tasks.length, { longestStreak: longest });
    else show();
  };
  const done = (ok, msg) => {
    if (locked) return;
    locked = true;
    if (ok) { correct++; streak++; longest = Math.max(longest, streak); } else streak = 0;
    s.foot.replaceChildren(el('div', { class: 'gmsg ' + (ok ? 'gmsg--ok' : 'gmsg--bad') }, (ok ? "To'g'ri! " : "Noto'g'ri. ") + (msg || '')));
    setTimeout(() => { locked = false; next(); }, ok ? 800 : 1700);
  };
  function show() {
    s.setProg(idx, tasks.length);
    s.foot.replaceChildren();
    renderTask(tasks[idx], done, () => locked);
  }
  show();
}

// ================= coordinatePath: nuqtalarni tartib bilan bosish =================
function gameCoordinatePath(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'grid', true);
  runner(ctx, s, tasks, (t, done, isLocked) => {
    const N = t.gridSize, C = 46, P = 34, W = P * 2 + N * C;
    const X = (x) => P + x * C, Y = (y) => P + (N - y) * C;       // y yuqoriga o'sadi
    const root = svg('svg', { viewBox: `0 0 ${W} ${W}`, class: 'cp-svg', role: 'img' });
    for (let i = 0; i <= N; i++) {
      root.append(
        svg('line', { x1: X(i), y1: Y(0), x2: X(i), y2: Y(N), class: i === 0 ? 'cp-axis' : 'cp-grid' }),
        svg('line', { x1: X(0), y1: Y(i), x2: X(N), y2: Y(i), class: i === 0 ? 'cp-axis' : 'cp-grid' }),
        svg('text', { x: X(i), y: Y(0) + 20, class: 'cp-num', 'text-anchor': 'middle' }, i),
        svg('text', { x: X(0) - 12, y: Y(i) + 4, class: 'cp-num', 'text-anchor': 'middle' }, i));
    }
    root.append(svg('text', { x: W - 8, y: Y(0) + 4, class: 'cp-lab', 'text-anchor': 'end' }, 'x'),
      svg('text', { x: X(0) + 8, y: 12, class: 'cp-lab' }, 'y'));
    const lines = svg('g'), dots = svg('g'), hits = svg('g');
    root.append(lines, dots, hits);
    let k = 0, mistakes = 0;
    const chips = el('div', { class: 'cp-chips' }, ...t.points.map((p, i) =>
      el('span', { class: 'cp-chip' }, `(${p.x}; ${p.y})`, i < t.points.length - 1 ? el('i', {}, '→') : null)));
    const mark = () => [...chips.querySelectorAll('.cp-chip')].forEach((c, i) => {
      c.classList.toggle('done', i < k); c.classList.toggle('now', i === k);
    });
    mark();
    for (let x = 0; x <= N; x++) for (let y = 0; y <= N; y++) {
      const hit = svg('circle', { cx: X(x), cy: Y(y), r: 17, class: 'cp-hit' });
      hit.addEventListener('click', () => {
        if (isLocked() || k >= t.points.length) return;
        const want = t.points[k];
        if (x === want.x && y === want.y) {
          if (k > 0) { const q = t.points[k - 1]; lines.append(svg('line', { x1: X(q.x), y1: Y(q.y), x2: X(x), y2: Y(y), class: 'cp-seg' })); }
          dots.append(svg('circle', { cx: X(x), cy: Y(y), r: 6, class: 'cp-dot' }));
          k++; mark();
          if (k === t.points.length) done(mistakes === 0, mistakes ? `Xatolar soni: ${mistakes}.` : '');
        } else {
          mistakes++;
          const bad = svg('circle', { cx: X(x), cy: Y(y), r: 8, class: 'cp-bad' });
          dots.append(bad); setTimeout(() => bad.remove(), 450);
        }
      });
      hits.append(hit);
    }
    s.area.replaceChildren(
      el('div', { class: 'cp-wrap' }, el('div', { class: 'cp-hint' }, "Nuqtalarni ketma-ket bosing: "), chips, root));
  });
}

// ================= motionLine: slayder bilan vaqtni topish =================
const EMO = [[/poyezd/i, '🚆'], [/velosiped/i, '🚲'], [/piyoda|Anvar|Bek/i, '🚶'], [/mashina|avtomobil/i, '🚗']];
const emoOf = (label) => (EMO.find(([re]) => re.test(label)) || [0, '●'])[1];

function gameMotionLine(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'spark', true);
  runner(ctx, s, tasks, (t, done, isLocked) => {
    const runners = [t.runnerA, t.runnerB];
    const posAt = (r, h) => r.startPosition + r.direction * r.speed * Math.max(0, h - (r.startHour || 0));
    const L = t.roadLength;
    let hour = 0;
    const marks = runners.map((r, i) => el('div', { class: 'ml-mark ml-mark--' + (i ? 'b' : 'a') }, el('span', {}, emoOf(r.label))));
    const road = el('div', { class: 'ml-road' },
      el('div', { class: 'ml-line' }), ...marks,
      el('span', { class: 'ml-end ml-end--l' }, '0 km'), el('span', { class: 'ml-end ml-end--r' }, `${L} km`));
    const read = el('div', { class: 'ml-read' });
    const legend = el('div', { class: 'ml-legend' }, ...runners.map((r, i) => el('div', { class: 'ml-card ml-card--' + (i ? 'b' : 'a') },
      el('b', {}, `${emoOf(r.label)} ${r.label}`),
      el('span', {}, `${r.startPosition} km dan, ${r.direction > 0 ? "o'ngga" : 'chapga'}, ${r.speed} km/soat`
        + (r.startHour ? ` · ${r.startHour} soatdan keyin yo'lga chiqadi` : '')))));
    const label = el('div', { class: 'ml-time' });
    const slider = el('input', { type: 'range', min: 0, max: t.maxHours, step: 1, value: 0, class: 'ml-slider', 'aria-label': 'Vaqt (soat)' });
    function paint() {
      hour = Number(slider.value);
      runners.forEach((r, i) => {
        const p = Math.max(0, Math.min(L, posAt(r, hour)));
        marks[i].style.left = `${(p / L) * 100}%`;
      });
      const pa = posAt(runners[0], hour), pb = posAt(runners[1], hour);
      label.textContent = `Vaqt: ${hour} soat`;
      read.textContent = `${runners[0].label}: ${Math.round(pa)} km · ${runners[1].label}: ${Math.round(pb)} km · orasidagi masofa: ${Math.round(Math.abs(pa - pb))} km`;
    }
    slider.addEventListener('input', () => { if (!isLocked()) paint(); });
    paint();
    s.area.replaceChildren(el('div', { class: 'ml-wrap' },
      legend, road, label, slider, read,
      el('div', { class: 'ml-hint' }, t.hint + (runners.some(r => r.startHour) ? ' (vaqt birinchi chiqqan paytdan boshlab sanaladi)' : ''))));
    s.foot.replaceChildren(checkBtn('Tekshirish', () => {
      const ok = hour === t.answerHour;
      done(ok, ok ? '' : `Javob: ${t.answerHour} soat.`);
    }));
  });
}

// ================= protractor: burchakni o'lchash va yasash =================
function gameProtractor(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'spark', true);
  runner(ctx, s, tasks, (t, done, isLocked) => {
    const cx = 170, cy = 176, R = 150;
    const pt = (deg, r) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
    const root = svg('svg', { viewBox: '0 0 340 196', class: 'pr-svg', role: 'img' });
    root.append(svg('path', { d: `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`, class: 'pr-body' }));
    for (let d = 0; d <= 180; d += 5) {
      const big = d % 10 === 0;
      const [x1, y1] = pt(d, R), [x2, y2] = pt(d, R - (big ? 14 : 8));
      root.append(svg('line', { x1, y1, x2, y2, class: big ? 'pr-tick pr-tick--big' : 'pr-tick' }));
      if (d % 10 === 0) { const [tx, ty] = pt(d, R - 25); root.append(svg('text', { x: tx, y: ty + 3 - (d === 0 || d === 180 ? 10 : 0), class: 'pr-num', 'text-anchor': 'middle' }, d)); }
    }
    const [bx, by] = pt(0, R + 12);
    root.append(svg('line', { x1: cx, y1: cy, x2: bx, y2: by, class: 'pr-base' }), svg('circle', { cx, cy, r: 4, class: 'pr-o' }));
    const ray = svg('line', { x1: cx, y1: cy, x2: cx, y2: cy, class: 'pr-ray' });
    const arc = svg('path', { d: '', class: 'pr-arc' });
    root.append(arc, ray);
    const setRay = (deg) => {
      const [x, y] = pt(deg, R + 12), [ax, ay] = pt(deg, 34);
      ray.setAttribute('x2', x); ray.setAttribute('y2', y);
      arc.setAttribute('d', deg > 0 ? `M ${cx + 34} ${cy} A 34 34 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}` : '');
    };

    if (t.mode === 'measure') {
      setRay(t.targetDegrees);
      const near = new Set([t.targetDegrees]);
      const cand = shuffle([-30, -20, -10, 10, 20, 30, -15, 15, -5, 5]);
      for (const d of cand) {
        const v = t.targetDegrees + d;
        if (near.size < 4 && v >= 5 && v <= 175 && [...near].every(x => Math.abs(x - v) >= 5)) near.add(v);
      }
      const opts = shuffle([...near]);
      const box = el('div', { class: 'opts' }, ...opts.map(o => el('button', {
        class: 'opt', onclick: (e) => {
          if (isLocked()) return;
          const ok = o === t.targetDegrees;
          e.currentTarget.classList.add(ok ? 'is-correct' : 'is-wrong');
          if (!ok) [...box.children].forEach((b, i) => { if (opts[i] === t.targetDegrees) b.classList.add('is-correct'); });
          done(ok, ok ? '' : `Burchak ${t.targetDegrees}° edi.`);
        },
      }, `${o}°`)));
      s.area.replaceChildren(el('div', { class: 'pr-wrap' }, root,
        el('div', { class: 'ml-hint' }, "Transportirning markazi burchak uchida, boshlang'ich nur 0° da. Ikkinchi nur shkalada qaysi sonni ko'rsatyapti?"), box));
      s.foot.replaceChildren();
    } else {
      let deg = 0;
      const slider = el('input', { type: 'range', min: 0, max: 180, step: 1, value: 0, class: 'ml-slider', 'aria-label': 'Nur burchagi' });
      const apply = (v) => { deg = Math.max(0, Math.min(180, Math.round(v))); slider.value = deg; setRay(deg); };
      slider.addEventListener('input', () => { if (!isLocked()) apply(Number(slider.value)); });
      const step = (d) => el('button', { class: 'btn pr-step', onclick: () => { if (!isLocked()) apply(deg + d); } }, (d > 0 ? '+' : '−') + Math.abs(d) + '°');
      // nurni sichqoncha/barmoq bilan ham surish mumkin
      const dragTo = (e) => {
        const r = root.getBoundingClientRect();
        const x = (e.clientX - r.left) * (340 / r.width) - cx, y = cy - (e.clientY - r.top) * (196 / r.height);
        apply(Math.atan2(y, x) * 180 / Math.PI < 0 ? (x < 0 ? 180 : 0) : Math.atan2(y, x) * 180 / Math.PI);
      };
      let down = false;
      root.addEventListener('pointerdown', (e) => { if (isLocked()) return; down = true; root.setPointerCapture(e.pointerId); dragTo(e); });
      root.addEventListener('pointermove', (e) => { if (down && !isLocked()) dragTo(e); });
      root.addEventListener('pointerup', () => { down = false; });
      apply(0);
      s.area.replaceChildren(el('div', { class: 'pr-wrap' }, root,
        el('div', { class: 'pr-steps' }, step(-10), step(-1), step(1), step(10)), slider,
        el('div', { class: 'ml-hint' }, t.hint + ". Nurni suring yoki slayderdan foydalaning, shkaladan o'qing.")));
      s.foot.replaceChildren(checkBtn('Tekshirish', () => {
        const ok = Math.abs(deg - t.targetDegrees) <= 2;
        done(ok, ok ? '' : `Siz ${deg}° qo'ydingiz, kerak: ${t.targetDegrees}°.`);
      }));
    }
  });
}

export const MORE = {
  coordinatePath: gameCoordinatePath,
  motionLine: gameMotionLine,
  protractor: gameProtractor,
};
