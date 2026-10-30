// «Tarozi» — sehrli bozor o'yini (1–4-sinf va yuqori sinflarning tenglama mavzulari).
// Peshtaxtadagi mis tarozi muvozanatda: chap pallada bir xil sehrli kristallar (figuralar) va temir tosh, o'ng pallada
// jami og'irlik (7-sinfda o'ng pallada ham figuralar bo'ladi: a·◆ + b = c·◆ + d).
// O'quvchi pastdagi sinov toshlaridan birini tanlaydi — har figura o'rniga shu tosh qo'yiladi: to'g'ri bo'lsa tarozi
// muvozanatda qoladi, xato bo'lsa og'ir tomonga og'adi. Tarozi haqiqiy mayatnikdek tebranib to'xtaydi (fizika — fizika()).
// Robi bir qatorda sababini aytadi: «2 · 6 + 3 = 15 — 11 dan og'ir», to'g'risi «(11 − 3) : 2 = 4»;
// 1-sinfda bo'lish o'rniga qo'shish: «8 = 4 + 4»; ikkala pallada figura bo'lsa — «Ikkala palladan 1 ta ◆ olamiz: …».
// Mashq 2 partiya × 5 misol; partiyada 3 yurak; tugasa — qolganlarini tarozi o'zi ko'rsatadi.
import { el } from '../util.js';
import { shell } from './shell.js?v=3';
import { hud, buddy, sfx, floatText } from './hud.js?v=4';

// ---- sabab matnlari (bir qator); «◆» — o'yinda figura rasmi bilan almashadi ----
const F = '◆';
const kop = (n, x, birinchi) => (n === 1 ? `${x}` : birinchi ? Array(n).fill(x).join(' + ') : `${n} · ${x}`);
const ong = (t) => t.rightShapeCount || 0;
// pallalar: n ta figura o'rniga x kg dan tosh (+ k kg li tosh)
export const chapIfoda = (t, x, birinchi) => `${kop(t.shapeCount, x, birinchi && t.shapeCount <= 3)}${t.knownWeight ? ` + ${t.knownWeight}` : ''}`;
export const ongIfoda = (t, x) => (ong(t) ? `${kop(ong(t), x)} + ${t.total}` : `${t.total}`);
export const javob = (t) => (t.total - t.knownWeight) / (t.shapeCount - ong(t));
export function yechim(t, birinchi) {
  const m = ong(t), n = t.shapeCount - m, k = t.knownWeight, T = t.total, x = javob(t);
  const hisob = n === 1 ? (k ? `${T} − ${k} = ${x}` : `${x}`) : k ? `(${T} − ${k}) : ${n} = ${x}` : `${T} : ${n} = ${x}`;
  if (m) return `Ikkala palladan ${m} ta ${F} olamiz: ${kop(n, F)}${k ? ` + ${k}` : ''} = ${T}, ${F} = ${hisob}`;
  if (n === 1) return `${T} − ${k} = ${x}`;
  if (birinchi) return k ? `${T} − ${k} = ${T - k}, ${T - k} = ${kop(n, x, true)}` : `${T} = ${kop(n, x, true)}`;
  return hisob;
}
export function sabab(t, v, birinchi) {
  const m = ong(t), L = t.shapeCount * v + t.knownWeight, R = m * v + t.total, x = javob(t);
  if (m) {
    if (v === x) return `${yechim(t)} ✓`;
    return `Chap: ${chapIfoda(t, v)} = ${L}, o'ng: ${ongIfoda(t, v)} = ${R} — ${L > R ? 'chap' : "o'ng"} og'ir.\n${yechim(t)}`;
  }
  if (v === x) return `${yechim(t, birinchi)}. Tekshiramiz: ${chapIfoda(t, x, birinchi)} = ${R} ✓`;
  return `${chapIfoda(t, v, birinchi)} = ${L} — ${L > R ? `${R} dan og'ir` : `${R} dan yengil`}. To'g'risi: ${yechim(t, birinchi)}`;
}

// ---- sehrli kristallar (bankdagi shakl va rang) ----
const RANG = { yellow: ['#fff3a8', '#ffd23f', '#c98a00'], green: ['#c9ffd8', '#3fd27a', '#11804a'], blue: ['#cfe8ff', '#4aa3ff', '#1d4fb8'],
  orange: ['#ffe0c2', '#ff8a3d', '#c2410c'], violet: ['#ecd9ff', '#a86bff', '#5b21b6'] };
let gid = 0;
export function kristall(shape, color) {
  const [och, asl, toq] = RANG[color] || RANG.blue, id = 'kr' + (gid++);
  const def = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${och}"/><stop offset=".45" stop-color="${asl}"/><stop offset="1" stop-color="${toq}"/></linearGradient></defs>`;
  const ch = `stroke="${toq}" stroke-width="2" stroke-linejoin="round"`;
  const yuz = 'fill="#fff" fill-opacity=".28"';
  const body = {
    triangle: `<path d="M20 3 L37 35 H3 Z" fill="url(#${id})" ${ch}/><path d="M20 3 L20 25 L37 35 Z" fill="#000" fill-opacity=".14"/><path d="M20 3 L11 22 L20 25 Z" ${yuz}/>`,
    circle: `<circle cx="20" cy="20" r="16.5" fill="url(#${id})" ${ch}/><ellipse cx="14" cy="13" rx="6" ry="4" fill="#fff" fill-opacity=".55" transform="rotate(-30 14 13)"/><circle cx="26" cy="27" r="7" fill="#000" fill-opacity=".1"/>`,
    square: `<rect x="4" y="4" width="32" height="32" rx="4" fill="url(#${id})" ${ch}/><rect x="11" y="11" width="18" height="18" rx="2" fill="#fff" fill-opacity=".22"/><path d="M4 4 L11 11 M36 4 L29 11 M4 36 L11 29 M36 36 L29 29" stroke="${toq}" stroke-opacity=".5" stroke-width="1.5"/>`,
    star: `<path d="M20 2 L25 14 L38 15 L28 24 L31 37 L20 30 L9 37 L12 24 L2 15 L15 14 Z" fill="url(#${id})" ${ch}/><path d="M20 2 L20 21 L15 14 Z M20 21 L2 15 L15 14 Z" ${yuz}/>`,
    hexagon: `<path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="url(#${id})" ${ch}/><path d="M20 2 L20 20 L4 11 Z" ${yuz}/><path d="M20 20 L36 29 L20 38 Z" fill="#000" fill-opacity=".14"/>`,
  }[shape] || '';
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${def}${body}</svg>`;
}

// ---- bozor manzarasi: shom osmoni, gumbazlar va minora, fonuslar ----
const FON = `<svg class="bozor__fon" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="bz-osmon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a55"/><stop offset=".45" stop-color="#7a3b84"/><stop offset=".75" stop-color="#e2736b"/><stop offset="1" stop-color="#ffb867"/></linearGradient>
    <linearGradient id="bz-gumbaz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f6fd0"/><stop offset=".5" stop-color="#4fa0f0"/><stop offset="1" stop-color="#2557a8"/></linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bz-osmon)"/>
  <g fill="#fff"><circle cx="40" cy="30" r="1.2"/><circle cx="120" cy="18" r="1"/><circle cx="210" cy="40" r="1.3"/><circle cx="300" cy="22" r="1"/><circle cx="360" cy="52" r="1.2"/><circle cx="80" cy="64" r=".9"/><circle cx="260" cy="70" r=".9"/></g>
  <path d="M338 26 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22z" fill="#ffe9a8"/>
  <g fill="#3a2350" opacity=".85">
    <rect x="0" y="200" width="400" height="100"/>
    <path d="M20 200 V160 h50 v40z M150 200 V150 h90 v50z M300 200 V170 h70 v30z"/>
    <rect x="96" y="96" width="14" height="104"/><path d="M92 96 h22 l-11 -18z"/><rect x="90" y="120" width="26" height="5"/>
  </g>
  <path d="M150 152 q45 -62 90 0z" fill="url(#bz-gumbaz)"/><path d="M195 90 v-12" stroke="#ffd56b" stroke-width="3"/><circle cx="195" cy="76" r="3.5" fill="#ffd56b"/>
  <path d="M300 172 q35 -44 70 0z" fill="url(#bz-gumbaz)" opacity=".9"/><path d="M335 128 v-9" stroke="#ffd56b" stroke-width="2.5"/>
  <path d="M20 162 q25 -34 50 0z" fill="url(#bz-gumbaz)" opacity=".8"/>
  <g fill="#ffcf73" opacity=".9"><rect x="165" y="170" width="10" height="16" rx="5"/><rect x="190" y="170" width="10" height="16" rx="5"/><rect x="215" y="170" width="10" height="16" rx="5"/><rect x="318" y="182" width="8" height="12" rx="4"/><rect x="38" y="175" width="8" height="13" rx="4"/></g>
</svg>`;
// soyabon ostidagi ipga osilgan fonuslar
const FONUSLAR = `<svg class="bozor__fonus" viewBox="0 0 400 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0 6 Q100 34 200 10 T400 8" stroke="#3a2a1a" stroke-width="1.5" fill="none"/>
  ${[[40, 15], [120, 20], [200, 10], [285, 14], [365, 9]].map(([x, y], i) => `<g class="fonus" style="animation-delay:${-i * 0.7}s">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}" stroke="#3a2a1a" stroke-width="1.2"/>
    <circle cx="${x}" cy="${y + 20}" r="16" fill="#ffb84d" opacity=".22"/>
    <path d="M${x - 7} ${y + 10} h14 l3 10 l-3 10 h-14 l-3 -10z" fill="${['#ff6b4a', '#ffc24d', '#4fd1c5', '#ff6b4a', '#ffc24d'][i]}" stroke="#7a4a12" stroke-width="1.2"/>
    <path d="M${x - 4} ${y + 12} v16 M${x + 4} ${y + 12} v16" stroke="#7a4a12" stroke-width=".8" opacity=".6"/>
  </g>`).join('')}
</svg>`;

// ---- tarozi qismlari (SVG) ----
const MIS = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b420d"/><stop offset=".3" stop-color="#f7dc8a"/><stop offset=".55" stop-color="#d9a33e"/><stop offset="1" stop-color="#6b420d"/></linearGradient>`;
// ustun: oyoq (pog'onali), o'yilgan ustun, tepada shkala (strelka shu yerda yuradi)
const USTUN = `<svg class="tarozi__ustun" viewBox="0 0 96 236" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${MIS('tz-m')}<radialGradient id="tz-sh" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#efdcb0"/></radialGradient></defs>
  <ellipse cx="48" cy="231" rx="46" ry="5" fill="#000" opacity=".3"/>
  <rect x="45" y="33" width="6" height="34" fill="url(#tz-m)"/>
  <path d="M15 33 A33 33 0 0 0 81 33 Z" fill="url(#tz-sh)" stroke="#a8741f" stroke-width="2.5"/>
  ${[-20, -15, -10, -5, 0, 5, 10, 15, 20].map(d => { const r = (d + 90) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), r1 = d % 10 ? 25 : 21;
    return `<line x1="${(48 + c * r1).toFixed(1)}" y1="${(33 + s * r1).toFixed(1)}" x2="${(48 + c * 29).toFixed(1)}" y2="${(33 + s * 29).toFixed(1)}" stroke="${d ? '#8a5a14' : '#d6454f'}" stroke-width="${d ? 1.4 : 2.4}"/>`; }).join('')}
  <path d="M41 66 h14 l-2 6 h-10z" fill="url(#tz-m)"/>
  <path d="M44 72 h8 v40 q4 4 0 8 v40 q6 6 0 12 v14 h-8 v-14 q-6 -6 0 -12 v-40 q-4 -4 0 -8z" fill="url(#tz-m)"/>
  <ellipse cx="48" cy="72" rx="8" ry="2.5" fill="#f7dc8a"/><ellipse cx="48" cy="116" rx="7" ry="2" fill="#b07a20"/><ellipse cx="48" cy="166" rx="9" ry="2.5" fill="#b07a20"/>
  <path d="M30 200 Q48 188 66 200 L70 206 H26 Z" fill="url(#tz-m)"/>
  <rect x="16" y="206" width="64" height="14" rx="3" fill="url(#tz-m)"/><ellipse cx="48" cy="206" rx="32" ry="3.5" fill="#f7dc8a" opacity=".9"/>
  <rect x="8" y="219" width="80" height="9" rx="4" fill="#7a4c10"/><rect x="8" y="219" width="80" height="3" rx="1.5" fill="#d9a33e"/>
</svg>`;
const SHAYIN = `<svg class="shayin__tana" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="tz-sy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".45" stop-color="#e0a536"/><stop offset="1" stop-color="#7a4c10"/></linearGradient></defs>
  <path d="M0 5 Q100 -2 200 5 L200 9 Q100 16 0 9 Z" fill="url(#tz-sy)"/><path d="M8 6 Q100 1 192 6" stroke="#fff6cf" stroke-width=".8" fill="none" opacity=".8"/></svg>`;
// palla: orqa qismi (ichi) — yuklar — old qismi (labi va kosasi); uchta zanjir
const P_ORQA = `<svg class="palla__orqa" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="8" rx="49" ry="7" fill="#f2c860"/><ellipse cx="50" cy="8.6" rx="45" ry="5.2" fill="#8a5a14"/><ellipse cx="50" cy="9.5" rx="38" ry="3.6" fill="#a87420"/></svg>`;
const P_OLD = `<svg class="palla__old" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="tz-ko" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d77a"/><stop offset=".5" stop-color="#c88a26"/><stop offset="1" stop-color="#6b420d"/></linearGradient></defs>
  <path d="M1 8 A49 7 0 0 0 99 8 C96 24 78 33 50 33 C22 33 4 24 1 8 Z" fill="url(#tz-ko)"/>
  <path d="M1 8 A49 7 0 0 0 99 8" stroke="#fff3c4" stroke-width="1.6" fill="none"/><path d="M18 22 Q50 30 82 22" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/></svg>`;
const ZANJIR = `<svg class="palla__zanjir" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path class="z-orqa" d="M50 0 L50 100"/><path d="M50 0 L2 100"/><path d="M50 0 L98 100"/></svg>`;

// ---- fizika: shayin og'ish burchagi prujinali mayatnikdek (so'nuvchi tebranish); pallalar o'z og'irligi bilan biroz chayqaladi ----
function fizika(node) {
  const kam = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let a = 0, v = 0, target = 0, s = 0, sv = 0, raf = 0, last = 0;
  const K = 30, C = 3.6, KS = 70, CS = 7;   // qattiqlik va so'nish (≈ 3 marta tebranib to'xtaydi)
  const yoz = () => { node.style.setProperty('--a', a.toFixed(3) + 'deg'); node.style.setProperty('--s', s.toFixed(3) + 'deg'); };
  function step(now) {
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016); last = now;
    const acc = -K * (a - target) - C * v;
    v += acc * dt; a += v * dt;
    const sacc = -KS * s - CS * sv - 0.55 * acc;
    sv += sacc * dt; s += sv * dt;
    yoz();
    if (Math.abs(a - target) < 0.02 && Math.abs(v) < 0.05 && Math.abs(s) < 0.02 && Math.abs(sv) < 0.05) { a = target; s = 0; v = sv = 0; yoz(); raf = 0; return; }
    raf = requestAnimationFrame(step);
  }
  const go = () => { if (kam) { a = target; s = 0; yoz(); return; } if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
  return {
    to(t) { target = t; go(); },              // yangi muvozanat burchagiga silliq o'tadi
    tur(a0) { a = a0; v = 0; go(); },          // shu burchakdan qo'yib yuboriladi
    turtki(dv) { v += dv; go(); },             // yuk tushganda kichik turtki
    stop() { cancelAnimationFrame(raf); raf = 0; },
  };
}

// matndagi «◆» o'rniga kichik figura; «\n» — yangi qator
function matn(str, t) {
  const out = [];
  str.split('\n').forEach((q, i) => {
    if (i) out.push(el('br'));
    q.split(F).forEach((p, j) => { if (j) out.push(el('i', { class: 'rkr', html: kristall(t.shape, t.shapeColor) })); if (p) out.push(p); });
  });
  return out;
}

export function gameBalance(ctx) {
  const all = [...ctx.bank];
  const s = shell(ctx, 'Tarozi muvozanatda. Noma\'lumni toping.', 'scale');
  const H = hud(3);
  const B = buddy();
  const birinchi = ctx.grade?.grade === 1;   // 1-sinf hali bo'lishni bilmaydi — qo'shish bilan tushuntiramiz
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };

  // ---- tarozi: ustun, shayin (aylanadi), ikki palla (shayin uchida osilgan, doim tik turadi) ----
  const chapYuk = el('div', { class: 'palla__yuk' });
  const ongYuk = el('div', { class: 'palla__yuk' });
  const palla = (yuk, tomon) => el('div', { class: 'palla palla--' + tomon },
    el('div', { class: 'palla__osma', html: ZANJIR }), el('i', { class: 'palla__ilgak' }),
    el('div', { class: 'palla__kosa', html: P_ORQA }), yuk, el('div', { class: 'palla__kosa palla__kosa--old', html: P_OLD }));
  const shayin = el('div', { class: 'tarozi__shayin' },
    el('i', { class: 'shayin__strelka' }),
    el('div', { class: 'shayin__tanasi', html: SHAYIN }),
    el('i', { class: 'shayin__uch shayin__uch--l' }), el('i', { class: 'shayin__uch shayin__uch--r' }), el('i', { class: 'shayin__gupchak' }),
    palla(chapYuk, 'l'), palla(ongYuk, 'r'));
  const tarozi = el('div', { class: 'tarozi', html: USTUN });
  tarozi.append(shayin);
  const fiz = fizika(tarozi);
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); fiz.stop(); timers.forEach(clearTimeout); }, { once: true });
  const taxta = el('div', { class: 'bozor__taxta' });
  const toshlar = el('div', { class: 'toshlar' });
  const tosh = (v, cls = '') => el('span', { class: 'tosh ' + cls }, el('b', {}, v), el('small', {}, 'kg'));
  // tenglama taxtachasi: 3 · ◆ + 4 = ◆ + 20 (n, m — chap va o'ngdagi figuralar soni)
  function taxtaYoz(t, n, m) {
    const yoz = (c, k) => [c > 1 ? `${c} · ` : '', el('i', { class: 'taxta__kr', html: kristall(t.shape, t.shapeColor) }), k ? ` + ${k}` : ''];
    taxta.replaceChildren(...yoz(n, t.knownWeight), ' = ', ...(m ? yoz(m, t.total) : [`${t.total}`]));
  }
  const fig = (t) => el('i', { class: 'kristall', html: kristall(t.shape, t.shapeColor) });
  // og'ish burchagi: farq qancha katta bo'lsa — shuncha ko'p (ko'pi bilan 13°)
  const burchak = (L, R) => (L === R ? 0 : -Math.sign(L - R) * Math.min(13, 4 + (Math.abs(L - R) / Math.max(L, R)) * 40));

  function round() {
    const items = rounds[ri];
    H.resetHearts();
    let ii = 0, mistakes = 0, busy = false, startedAt = 0;

    function show(t) {
      s.setProg(done, all.length);
      const m = ong(t);
      taxtaYoz(t, t.shapeCount, m);
      chapYuk.replaceChildren(...Array.from({ length: t.shapeCount }, () => fig(t)), ...(t.knownWeight ? [tosh(t.knownWeight, 'tosh--temir')] : []));
      ongYuk.replaceChildren(...Array.from({ length: m }, () => fig(t)), tosh(t.total, 'tosh--katta'));
      [...chapYuk.children, ...ongYuk.children].forEach((n, i) => { n.classList.add('tush'); n.style.animationDelay = (i % 8) * 40 + 'ms'; });
      // yuk qo'yilayotgandek: avval chap palla tushadi, keyin o'ng — tarozi tebranib muvozanatga keladi
      fiz.tur(-7); fiz.to(0);
      return javob(t);
    }

    function next() {
      if (ii >= items.length) return endRound();
      const t = items[ii];
      busy = false;
      show(t);
      const opts = [...t.options];
      toshlar.replaceChildren(...opts.map((v, i) => el('button', { type: 'button', class: 'tosh-btn', 'aria-label': `${v} kg`, dataset: { v }, onclick: (e) => pick(e.currentTarget, v) },
        tosh(v, 'tosh--sinov'), el('small', { class: 'tosh-btn__key' }, i + 1))));
      B.say([el('b', {}, t.prompt), ong(t) ? ' Sinov toshini tanlang — ikkala palladagi har figura o\'rniga shu tosh qo\'yiladi.' : ' Sinov toshini tanlang — har figura o\'rniga shu tosh qo\'yiladi.'], 'idle');
      startedAt = performance.now();
      onKey = (ev) => { const n = +ev.key; if (n >= 1 && n <= opts.length) { ev.preventDefault(); toshlar.children[n - 1].click(); } };
    }

    // figuralar o'rniga v kg li sinov toshlari qo'yiladi; tarozi og'ir tomonga og'adi
    function sinab(t, v) {
      const figs = [...chapYuk.querySelectorAll('.kristall'), ...ongYuk.querySelectorAll('.kristall')];
      figs.forEach((k, i) => later(() => k.replaceWith(tosh(v, 'tosh--sinov tush')), i * 70));
      later(() => fiz.to(burchak(t.shapeCount * v + t.knownWeight, ong(t) * v + t.total)), figs.length * 70 + 80);
      return figs.length * 70 + 80;
    }
    // ikkala pallada figura bo'lsa — bir xil toshlar ikkala palladan olinadi (al-muqobala), tarozi muvozanatda qoladi
    function qisqartir(t) {
      const m = ong(t); if (!m) return;
      later(() => { taxtaYoz(t, t.shapeCount - m, 0); taxta.classList.remove('yangi'); void taxta.offsetWidth; taxta.classList.add('yangi'); }, 500);
      for (const yuk of [chapYuk, ongYuk]) [...yuk.querySelectorAll('.tosh--sinov')].slice(0, m).forEach(n => { n.classList.add('olindi'); later(() => n.remove(), 600); });
      later(() => fiz.turtki(-6), 560);
    }

    function pick(btn, v) {
      if (busy) return;
      busy = true; onKey = null;
      const t = items[ii], x = javob(t), ok = v === x;
      total++; done++;
      times.push(performance.now() - startedAt);
      [...toshlar.children].forEach(b => { b.disabled = true; });
      btn.classList.add(ok ? 'is-ok' : 'is-bad');
      const kut = sinab(t, v) + 900;
      if (ok) {
        right++;
        const m = H.hit(); longest = Math.max(longest, H.st.combo);
        const fast = performance.now() - startedAt < 7000;
        later(() => {
          sfx.ok(); tarozi.classList.add('yondi');
          H.add(10 * m + (fast ? 5 : 0), btn);
          if (fast && m < 2) floatText('⚡ Tez!', tarozi, 'hud-float--tez');
          B.say([el('span', { class: 'rchip rchip--ha' }, `${x} kg ✓`), ' ', ...matn(sabab(t, v, birinchi), t)], 'ok');
          qisqartir(t);
        }, kut);
        later(() => { tarozi.classList.remove('yondi'); ii++; next(); }, kut + (ong(t) ? 2600 : 1900));
      } else {
        mistakes++; H.miss();
        later(() => {
          sfx.bad();
          const left = H.loseHeart();
          [...toshlar.children].forEach(b => { if (+b.dataset.v === x) b.classList.add('is-ok'); });
          B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), el('span', { class: 'rchip rchip--ha' }, `To'g'ri: ${x} kg`), el('br'), ...matn(sabab(t, v, birinchi), t)], 'bad');
          // to'g'ri toshlar qo'yiladi — tarozi muvozanatga qaytadi
          later(() => {
            [...chapYuk.querySelectorAll('.tosh--sinov'), ...ongYuk.querySelectorAll('.tosh--sinov')].forEach(k => { k.firstChild.textContent = x; k.classList.add('tosh--togri'); });
            fiz.to(0);
            later(() => qisqartir(t), 1400);
          }, 1300);
          const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
          s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
          onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
        }, kut - 300);
      }
    }

    // yuraklar tugadi — qolgan misollarni tarozi o'zi ko'rsatadi
    function autoRest() {
      onKey = null; toshlar.replaceChildren();
      B.say(['Yuraklar tugadi. Qolgan misollarni tarozida kuzating.'], 'think');
      const go = () => {
        if (ii >= items.length) return endRound();
        const t = items[ii], x = show(t);
        total++; done++;
        later(() => { const w = sinab(t, x); later(() => { qisqartir(t); B.say([el('span', { class: 'rchip rchip--ha' }, `${x} kg`), ' ', ...matn(sabab(t, x, birinchi), t)], 'think'); }, w + 500); }, 1000);
        later(() => { ii++; go(); }, ong(t) ? 4600 : 3600);
      };
      later(go, 900);
    }

    function endRound() {
      onKey = null; toshlar.replaceChildren();
      const clean = mistakes === 0;
      if (clean) { H.add(30, tarozi); sfx.win(); }
      s.setProg(done, all.length);
      const lastR = ri + 1 >= rounds.length;
      s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            ri++;
            if (ri >= rounds.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              fiz.stop();
              ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
            } else { s.foot.replaceChildren(); round(); }
          } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
    }

    if (ri === 0) {
      const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;   // ko'rsatmani Robi aytadi
      const sahna = el('div', { class: 'sahna sahna--bozor' },
        el('div', { class: 'bozor', html: FON }), el('div', { class: 'bozor__soyabon' }), el('div', { class: 'bozor__fonuslar', html: FONUSLAR }),
        H.node, B.node, taxta, tarozi, el('div', { class: 'bozor__peshtaxta' }, toshlar));
      s.area.replaceChildren(sahna);
      if (innerWidth < 700) requestAnimationFrame(() => {
        const head = document.querySelector('.site-header')?.offsetHeight || 0;
        scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
      });
    }
    s.foot.replaceChildren();
    next();
  }
  round();
}
