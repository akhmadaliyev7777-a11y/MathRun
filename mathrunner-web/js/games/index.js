// Mini-o'yinlar. Har biri (ctx) -> render -> tugagach ctx.finish(correct, total, extra).
// Bank schemalari castles_data.dart o'yin sahnalari bilan bir xil.
import { el, shuffle } from '../util.js';
import { ICON } from '../icons.js';

import { shell, checkBtn, flash } from './shell.js?v=3';
import { hud, buddy, sfx, floatText } from './hud.js?v=4';
import { MORE } from './more.js';
import { gameSet } from './venn.js?v=7';
import { gameNumberOrder } from './tartib.js?v=9';
import { gameEquationGrid } from './jadval.js?v=2';
import { gameConveyor } from './saralash.js?v=7';

// ================= placeValue (Xona tarkibi — shirinliklar fabrikasi) =================
// Buyurtmaga ko'ra qutiga konfet yig'iladi: birlik — bitta konfet, o'nlik — 10 konfetli rulon, yuzlik — 100 konfetli
// lagan, ming — 1000 konfetli sovg'a qutisi. Qutida xonalar bo'limlari, har birining tagida raqami (xona jadvali).
// 10 ta bir xil narsa to'lsa, mashina ularni o'zi bitta kattasiga o'raydi (xonadan o'tish). Buyurtma turlari:
// son, so'z bilan, xona birliklari («3 o'nlik 14 birlik»), xona qo'shiluvchilari («200 + 30 + 4»).
// «Jo'natish»: to'g'ri — quti jo'naydi; xato — yurak kamayadi, Robi qaysi xona noto'g'ri ekanini aytadi, tuzatib qayta jo'natiladi.
// Mashq 2 partiya × 5; partiyada 3 yurak; tugasa — qolganlarini mashina o'zi yig'adi.
const XONA = [
  { nom: 'Minglar', bir: 'ming', v: 1000 }, { nom: 'Yuzlar', bir: 'yuzlik', v: 100 },
  { nom: "O'nlar", bir: "o'nlik", v: 10 }, { nom: 'Birlar', bir: 'birlik', v: 1 },
];
const xonalarOf = (n) => [Math.floor(n / 1000), Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];
const sonFmt = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));
// buyurtma matni
function buyurtmaMatn(t) {
  const b = t.buyurtma || { tur: 'son' };
  if (b.tur === 'soz') return `«${b.matn}»`;
  if (b.tur === 'yigindi') return b.matn;
  if (b.tur === 'xona') return b.x.map((c, i) => (c ? `${c} ${XONA[i].bir}` : '')).filter(Boolean).join(', ');
  return sonFmt(t.targetNumber);
}
// to'g'ri javobdan keyin — bir qator sabab
function xonaSabab(t) {
  const n = t.targetNumber, b = t.buyurtma || { tur: 'son' }, x = xonalarOf(n);
  const tarkib = x.map((c, i) => (c ? `${c} ${XONA[i].bir}` : '')).filter(Boolean).join(' + ');
  if (b.tur === 'soz') return `«${b.matn}» = ${sonFmt(n)} = ${tarkib}`;
  if (b.tur === 'yigindi') return `${b.matn} = ${sonFmt(n)}`;
  if (b.tur === 'xona') {
    const i = b.x.findIndex(c => c > 9);
    if (i > 0) return `${b.x[i]} ${XONA[i].bir} = 1 ${XONA[i - 1].bir} + ${b.x[i] - 10} ${XONA[i].bir}, demak ${tarkib} = ${sonFmt(n)}`;
    return `${tarkib} = ${sonFmt(n)}`;
  }
  return `${sonFmt(n)} = ${tarkib}`;
}
// xato jo'natilganda — qaysi xonalar noto'g'ri
function xonaXato(t, c, cols) {
  const kerak = xonalarOf(t.targetNumber), qiymat = c.reduce((a, v, i) => a + v * XONA[i].v, 0);
  const farq = cols.filter(i => c[i] !== kerak[i]).map(i => `${XONA[i].nom.toLowerCase()} ${c[i]} ta emas, ${kerak[i]} ta`);
  return `Qutida ${sonFmt(qiymat)}, kerak ${sonFmt(t.targetNumber)}: ${farq.join('; ')}.`;
}

// buyumlar: konfet (yalpiz konfeti), rulon (10), lagan (100), sovg'a qutisi (1000)
const buyum = (i) => el('i', { class: ['bu bu--ming', 'bu bu--lagan', 'bu bu--rulon', 'bu bu--konfet'][i] });

function gamePlaceValue(ctx) {
  const all = [...ctx.bank];
  const s = shell(ctx, all[0].prompt, 'columns');
  const H = hud(3);
  const B = buddy();
  const raqamlar = Math.max(...all.map(t => String(t.targetNumber).length), ...all.map(t => (t.buyurtma?.x ? 4 - t.buyurtma.x.findIndex(v => v > 0) : 0)));
  const cols = [0, 1, 2, 3].slice(4 - Math.min(4, Math.max(2, raqamlar)));   // qutidagi bo'limlar (masalan o'nlar va birlar)
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0, orashAytildi = false;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); }, { once: true });

  // ---- sahna qismlari ----
  const chek = el('div', { class: 'fab-chek' });
  const c = [0, 0, 0, 0];
  let taps = 0, busy = false, t = null, startedAt = 0, xatoBor = false;
  const bolim = {}, raqam = {};
  const quti = el('div', { class: 'fab-quti' }, ...cols.map(i => {
    bolim[i] = el('div', { class: 'fab-bolim__ichi fab-bolim__ichi--' + ['ming', 'lagan', 'rulon', 'konfet'][i] });
    raqam[i] = el('b', { class: 'fab-bolim__raqam' }, '0');
    return el('div', { class: 'fab-bolim' }, el('small', { class: 'fab-bolim__nom' }, XONA[i].nom), bolim[i], raqam[i]);
  }));
  const jami = el('div', { class: 'fab-jami' });
  const qutiJoy = el('div', { class: 'fab-qutijoy' }, quti);
  const tugmalar = el('div', { class: 'fab-tugmalar' }, ...cols.map((i, k) => el('button', {
    type: 'button', class: 'fab-tugma', 'aria-label': `1 ${XONA[i].bir} qo'shish`, onclick: (e) => qosh(i, e.currentTarget),
  }, el('span', { class: 'fab-tugma__rasm' }, buyum(i)), el('b', {}, `+1 ${XONA[i].bir}`), el('small', {}, `${sonFmt(XONA[i].v)} ta · ${k + 1}`))));
  const mashina = el('div', { class: 'fab-mashina' }, el('div', { class: 'fab-mashina__gumbaz' }), tugmalar);
  const yubor = el('button', { type: 'button', class: 'btn btn--accent fab-yubor', onclick: () => jonat() }, 'Jo\'natish ✓');
  const tozala = el('button', { type: 'button', class: 'btn fab-tozala', onclick: () => { if (busy) return; c.fill(0); chiz(); sfx.tap(); } }, 'Bo\'shatish');

  function chiz() {
    for (const i of cols) {
      const box = bolim[i];
      while (box.children.length > c[i]) box.lastChild.remove();
      while (box.children.length < c[i]) {
        const n = buyum(i), k = box.children.length;
        n.addEventListener('click', () => ol(i));
        if (i <= 1) n.style.setProperty('--k', k);       // laganlar va qutilar ustma-ust taxlanadi
        box.append(n);
      }
      raqam[i].textContent = c[i];
      raqam[i].classList.toggle('kop', c[i] > 9);
    }
    const q = c.reduce((a, v, i) => a + v * XONA[i].v, 0);
    jami.replaceChildren('Qutida: ', el('b', {}, sonFmt(q)), ' ta konfet');
  }
  // bitta narsa qo'shiladi; 10 ta to'lsa — mashina o'raydi
  function qosh(i, btn) {
    if (busy || !t) return;
    if (c[i] >= 9 && i === cols[0]) { btn.classList.remove('silk'); void btn.offsetWidth; btn.classList.add('silk'); return; }   // eng katta xonada 9 tadan ortiq sig'maydi
    taps++; sfx.tap();
    const a = btn.querySelector('.bu').getBoundingClientRect(), dest = bolim[i].getBoundingClientRect();
    const f = buyum(i); f.classList.add('bu--uch');
    Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px' });
    document.body.append(f);
    requestAnimationFrame(() => { f.style.transform = `translate(${dest.left + dest.width / 2 - a.left - a.width / 2}px, ${dest.bottom - 30 - a.top}px)`; });
    later(() => f.remove(), 330);
    c[i]++; chiz();
    if (c[i] === 10) later(() => orash(i), 380);
  }
  function orash(i) {
    if (c[i] < 10 || i === cols[0]) return;   // eng katta xonadan yuqorisi qutida yo'q
    const box = bolim[i];
    box.classList.add('orash');
    sfx.ok();
    later(() => {
      box.classList.remove('orash');
      c[i] -= 10; c[i - 1]++; chiz();
      const yangi = bolim[i - 1].lastChild; if (yangi) { yangi.classList.add('yangi'); }
      if (!orashAytildi) { orashAytildi = true; B.say([el('b', {}, `10 ta ${XONA[i].bir} = 1 ${XONA[i - 1].bir}!`), ' Mashina ularni o\'rab qo\'ydi.'], 'ok'); }
      if (c[i - 1] === 10) later(() => orash(i - 1), 380);
    }, 520);
  }
  function ol(i) {
    if (busy || c[i] <= 0) return;
    taps++; c[i]--; chiz(); sfx.tap();
  }

  function yangiQuti() {
    c.fill(0); taps = 0; xatoBor = false; busy = false;
    quti.classList.remove('ket'); quti.classList.add('kel'); later(() => quti.classList.remove('kel'), 500);
    chiz();
  }

  const chekYoz = () => chek.replaceChildren(el('small', {}, `Buyurtma № ${done + 1}`), el('b', {}, buyurtmaMatn(t)),
    el('span', {}, t.buyurtma?.tur === 'xona' ? ' konfet' : ' ta konfet'));
  function round() {
    const items = rounds[ri];
    H.resetHearts();
    let ii = 0, mistakes = 0;

    function next() {
      if (ii >= items.length) return endRound();
      t = items[ii];
      s.setProg(done, all.length);
      chekYoz();
      chek.classList.remove('yangi'); void chek.offsetWidth; chek.classList.add('yangi');
      yangiQuti();
      const b = t.buyurtma?.tur;
      B.say(b === 'xona' && t.buyurtma.x.some(v => v > 9) ? ['Buyurtmada bir xona 9 tadan ko\'p — qo\'shavering, mashina 10 tasini o\'zi o\'raydi.']
        : b === 'soz' ? ['Buyurtma so\'z bilan yozilgan. Sonni xonalarga ajratib, qutiga yig\'ing.']
        : b === 'yigindi' ? ['Har qo\'shiluvchi — bitta xona. Shuncha konfetni qutiga yig\'ing.']
        : ['Buyurtmani qutiga yig\'ing: yuqoridagi tugmalar — xona birliklari. Ortiqchasini olish uchun qutidagisini bosing.'], 'idle');
      startedAt = performance.now();
      onKey = (ev) => {
        const n = +ev.key;
        if (n >= 1 && n <= cols.length) { ev.preventDefault(); tugmalar.children[n - 1].click(); }
        else if (ev.key === 'Enter') { ev.preventDefault(); jonat(); }
        else if (ev.key === 'Backspace') { ev.preventDefault(); for (let k = cols.length - 1; k >= 0; k--) if (c[cols[k]]) { ol(cols[k]); break; } }
      };
    }

    jonat = function () {
      if (busy || !t) return;
      const q = c.reduce((a, v, i) => a + v * XONA[i].v, 0);
      if (q === 0) return;
      if (q === t.targetNumber) {
        busy = true; onKey = null;
        total++; done++;
        if (!xatoBor) { right++; const m = H.hit(); longest = Math.max(longest, H.st.combo);
          const kam = taps <= xonalarOf(t.targetNumber).reduce((a, v) => a + v, 0);   // eng kam bosish bilan
          const sek = (performance.now() - startedAt) / 1000;
          H.add(10 * m + (kam ? 5 : 0), yubor);
          if (kam && m < 2) later(() => floatText('Tejamkor!', yubor, 'hud-float--tez'), 250);
          else if (sek < 4 + taps * 0.7 && m < 2) later(() => floatText('⚡ Tez!', yubor, 'hud-float--tez'), 250);
          times.push(sek * 1000);
        }
        sfx.ok();
        B.say([el('span', { class: 'rchip rchip--ha' }, `${sonFmt(t.targetNumber)} ✓`), ' ', xonaSabab(t)], 'ok');
        later(() => quti.classList.add('ket'), 700);
        later(() => { ii++; next(); }, 2300);
      } else {
        sfx.bad(); H.miss();
        if (!xatoBor) { xatoBor = true; mistakes++; }
        const left = H.loseHeart();
        quti.classList.remove('xato'); void quti.offsetWidth; quti.classList.add('xato');
        B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', xonaXato(t, c, cols)], 'bad');
        if (left === 0) { busy = true; onKey = null; total++; done++; later(() => tuzat(() => { ii++; autoRest(); }), 1600); }
      }
    };
    // mashina to'g'ri yig'ib ko'rsatadi
    function tuzat(then) {
      const kerak = xonalarOf(t.targetNumber);
      cols.forEach(i => { c[i] = kerak[i]; });
      chiz();
      B.say([el('span', { class: 'rchip rchip--ha' }, `${sonFmt(t.targetNumber)}`), ' ', xonaSabab(t)], 'think');
      later(() => quti.classList.add('ket'), 1500);
      later(then, 2600);
    }
    function autoRest() {
      B.say(['Yuraklar tugadi. Qolgan buyurtmalarni mashina o\'zi yig\'adi — kuzating.'], 'think');
      const go = () => {
        if (ii >= items.length) return endRound();
        t = items[ii];
        chekYoz();
        yangiQuti(); busy = true; total++; done++; s.setProg(done, all.length);
        later(() => tuzat(() => { ii++; go(); }), 900);
      };
      later(go, 1200);
    }
    function endRound() {
      onKey = null; t = null; busy = true;
      const clean = mistakes === 0;
      if (clean) { H.add(30, quti); sfx.win(); }
      s.setProg(done, all.length);
      const lastR = ri + 1 >= rounds.length;
      amallar.hidden = true;
      s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            ri++;
            if (ri >= rounds.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
            } else { s.foot.replaceChildren(); amallar.hidden = false; round(); }
          } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
    }
    next();
  }
  let jonat = () => {};
  const amallar = el('div', { class: 'fab-amallar' }, tozala, yubor);

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;   // ko'rsatmani Robi aytadi
  const sahna = el('div', { class: 'sahna sahna--fabrika' },
    el('i', { class: 'fab-quvur fab-quvur--1' }), el('i', { class: 'fab-quvur fab-quvur--2' }),
    H.node, B.node, chek, mashina, qutiJoy, jami, amallar);
  s.area.replaceChildren(sahna);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
}

// ================= balanceScale (Tarozi — sehrli bozor) =================
// Peshtaxtadagi mis tarozi muvozanatda: chap pallada bir xil sehrli kristallar (figuralar) va temir tosh, o'ng pallada
// jami og'irlik (7-sinfda o'ng pallada ham figuralar bo'ladi: a·◆ + b = c·◆ + d).
// O'quvchi pastdagi sinov toshlaridan birini tanlaydi — har figura o'rniga shu tosh qo'yiladi: to'g'ri bo'lsa tarozi
// muvozanatda qoladi, xato bo'lsa og'ir tomonga og'adi. Tarozi haqiqiy mayatnikdek tebranib to'xtaydi (fizika — fizika()).
// Robi bir qatorda sababini aytadi: «2 · 6 + 3 = 15 — 11 dan og'ir», to'g'risi «(11 − 3) : 2 = 4»;
// 1-sinfda bo'lish o'rniga qo'shish: «8 = 4 + 4»; ikkala pallada figura bo'lsa — «Ikkala palladan 1 ta ◆ olamiz: …».
// Mashq 2 partiya × 5 misol; partiyada 3 yurak; tugasa — qolganlarini tarozi o'zi ko'rsatadi.
// ---- sabab matnlari (bir qator); «◆» — o'yinda figura rasmi bilan almashadi ----
const F = '◆';
const kop = (n, x, birinchi) => (n === 1 ? `${x}` : birinchi ? Array(n).fill(x).join(' + ') : `${n} · ${x}`);
const ong = (t) => t.rightShapeCount || 0;
// pallalar: n ta figura o'rniga x kg dan tosh (+ k kg li tosh)
const chapIfoda = (t, x, birinchi) => `${kop(t.shapeCount, x, birinchi && t.shapeCount <= 3)}${t.knownWeight ? ` + ${t.knownWeight}` : ''}`;
const ongIfoda = (t, x) => (ong(t) ? `${kop(ong(t), x)} + ${t.total}` : `${t.total}`);
const javob = (t) => (t.total - t.knownWeight) / (t.shapeCount - ong(t));
function yechim(t, birinchi) {
  const m = ong(t), n = t.shapeCount - m, k = t.knownWeight, T = t.total, x = javob(t);
  const hisob = n === 1 ? (k ? `${T} − ${k} = ${x}` : `${x}`) : k ? `(${T} − ${k}) : ${n} = ${x}` : `${T} : ${n} = ${x}`;
  if (m) return `Ikkala palladan ${m} ta ${F} olamiz: ${kop(n, F)}${k ? ` + ${k}` : ''} = ${T}, ${F} = ${hisob}`;
  if (n === 1) return `${T} − ${k} = ${x}`;
  if (birinchi) return k ? `${T} − ${k} = ${T - k}, ${T - k} = ${kop(n, x, true)}` : `${T} = ${kop(n, x, true)}`;
  return hisob;
}
function sabab(t, v, birinchi) {
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
function kristall(shape, color) {
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

function gameBalance(ctx) {
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

// ================= netFold (Yoyilma — origami ustaxonasi) =================
// Kesish taxtasi ustida rangli qog'ozdan yoyilma; javobdan keyin u 3D da buklanib jismga aylanadi va aylanadi.
// Topshiriq turlari: jism (qaysi jism chiqadi), kubmi (yig'iladimi — noto'g'risida yoqlar ustma-ust tushadi),
// qarama (★ yoqqa qarama-qarshi yoqni bosish), yoyilmasi (jismning yoyilmasini tanlash), sirt (yoyilma yuzi).
// Yoyilma — yoqlar daraxti: har yoq ota yog'ining bir qirrasiga osilgan (attach t/b/l/r) va o'sha qirra atrofida
// burchak bo'yicha buklanadi (kub — 90°, prizma yon yoqlari — 120°, piramida — 125,3°, silindr 12 ta tasma × 30°).
// Kub yoyilmasi «kubni dumalatib» tekshiriladi (bank yasovchi tools/gen_yoyilma.py bilan bir xil).
const JISM_UZ = { cube: 'Kub', cuboid: 'Parallelepiped', triangularPrism: 'Uchburchakli prizma', squarePyramid: 'Piramida', cylinder: 'Silindr', cone: 'Konus' };
const JISM_TARKIB = {
  cube: '6 ta teng kvadrat — kub', cuboid: "6 ta to'g'ri to'rtburchak, qarama-qarshilari teng — parallelepiped",
  triangularPrism: "2 ta uchburchak asos va 3 ta to'rtburchak yon yoq — uchburchakli prizma",
  squarePyramid: 'Kvadrat asos va 4 ta uchburchak yon yoq — piramida',
  cylinder: "To'g'ri to'rtburchak (yon sirt) va 2 ta teng doira — silindr", cone: "Doira bo'lagi (yon sirt) va doira asos — konus",
};
const QOGOZ = ['#ff8fa3', '#ffd166', '#6ee7b7', '#7dd3fc', '#c4b5fd', '#fdba74'];
const vneg = (v) => v.map(a => -a);
const vkey = (v) => v.join(',');
const oq = (v) => v.findIndex(a => a !== 0);

// yoyilma → yoqlar daraxti {w, h, shape, at, off, ang, kids, idx, rang, ust (ustma-ust tushgan)}
function yoqlar(y) {
  if (y.tur === 'grid') {
    const dims = y.dims || [1, 1, 1], cells = y.cells.map(c => c.join(','));
    const H = new Map([[cells[0], { n: [0, 0, -1], R: [1, 0, 0], D: [0, 1, 0] }]]), q = [cells[0]], ota = new Map();
    while (q.length) {
      const c = q.shift(), [x, yy] = c.split(',').map(Number), { n, R, D } = H.get(c);
      for (const [dx, dy, at, f] of [[1, 0, 'r', () => ({ n: R, R: vneg(n), D })], [-1, 0, 'l', () => ({ n: vneg(R), R: n, D })],
        [0, 1, 'b', () => ({ n: D, R, D: vneg(n) })], [0, -1, 't', () => ({ n: vneg(D), R, D: n })]]) {
        const d = `${x + dx},${yy + dy}`;
        if (cells.includes(d) && !H.has(d)) { H.set(d, f()); ota.set(d, [c, at]); q.push(d); }
      }
    }
    const F = new Map(), korildi = new Set();
    cells.forEach((c, i) => {
      const h = H.get(c), k = vkey(h.n);
      F.set(c, { w: dims[oq(h.R)], h: dims[oq(h.D)], shape: 'rect', at: ota.get(c)?.[1], off: 0, ang: 90, kids: [], idx: i, rang: QOGOZ[i % 6], n: h.n, ust: korildi.has(k) });
      korildi.add(k);
    });
    cells.forEach(c => { const o = ota.get(c); if (o) F.get(o[0]).kids.push(F.get(c)); });
    return F.get(cells[0]);
  }
  const T = Math.sqrt(3) / 2;
  if (y.tur === 'prizma') {
    const L = 1.7, r = [0, 1, 2].map(i => ({ w: 1, h: L, shape: 'rect', off: 0, ang: 120, kids: [], rang: QOGOZ[3 + (i % 2)] }));
    r[1].ang = 0; r[0].at = 'l'; r[2].at = 'r'; r[1].kids.push(r[0], r[2]);
    const tomon = new Set();
    y.uchlar.forEach(([i, s], k) => { r[i].kids.push({ w: 1, h: T, shape: 'tri', at: s, off: 0, ang: 90, kids: [], rang: QOGOZ[1], ust: tomon.has(s) }); tomon.add(s); });
    return r[1];
  }
  if (y.tur === 'piramida') {
    const ang = 180 - Math.acos(1 / Math.sqrt(3)) * 180 / Math.PI;
    const ildiz = { w: 1, h: 1, shape: 'rect', off: 0, ang: 0, kids: [], rang: QOGOZ[2] };
    ['t', 'r', 'b', 'l'].forEach((at, i) => ildiz.kids.push({ w: at === 'l' || at === 'r' ? T : 1, h: at === 'l' || at === 'r' ? 1 : T, shape: 'tri', at, off: 0, ang, kids: [], rang: QOGOZ[[0, 1, 5, 4][i]] }));
    return ildiz;
  }
  if (y.tur === 'silindr') {
    const N = 12, d = 1, sw = Math.PI * d / N, h = 1.35, s = [];
    for (let i = 0; i < N; i++) s.push({ w: sw, h, shape: 'tasma', at: i ? 'r' : undefined, off: 0, ang: i ? 360 / N : 0, kids: [], rang: QOGOZ[3], chet: i === 0 ? 'l' : i === N - 1 ? 'r' : '' });
    for (let i = 1; i < N; i++) s[i - 1].kids.push(s[i]);
    const tomon = new Set();
    y.doiralar.forEach(([i, sd]) => { s[i].kids.push({ w: d, h: d, shape: 'disc', at: sd, off: (sw - d) / 2, ang: 90, kids: [], rang: QOGOZ[1], ust: tomon.has(sd) }); tomon.add(sd); });
    return s[0];
  }
  // konus — buklanmaydi (faqat tekis ko'rinish)
  return { w: 2.2, h: 1.9, shape: 'konus', off: 0, ang: 0, kids: [], rang: QOGOZ[0] };
}
// tekis joylashuv: har yoqning (x, y) — birliklarda; chegaralar
function joyla(root) {
  const all = [];
  (function go(f, x, y) {
    f.x = x; f.y = y; all.push(f);
    for (const k of f.kids) {
      const kx = k.at === 'r' ? x + f.w : k.at === 'l' ? x - k.w : x + k.off;
      const ky = k.at === 'b' ? y + f.h : k.at === 't' ? y - k.h : y + k.off;
      go(k, kx, ky);
    }
  })(root, 0, 0);
  const minx = Math.min(...all.map(f => f.x)), miny = Math.min(...all.map(f => f.y));
  const maxx = Math.max(...all.map(f => f.x + f.w)), maxy = Math.max(...all.map(f => f.y + f.h));
  return { all, minx, miny, bw: maxx - minx, bh: maxy - miny };
}
const TRI = { t: 'polygon(0 100%,100% 100%,50% 0)', b: 'polygon(0 0,100% 0,50% 100%)', r: 'polygon(0 0,0 100%,100% 50%)', l: 'polygon(100% 0,100% 100%,0 50%)' };
const KONUS_SVG = (rang) => `<svg viewBox="0 0 220 190" aria-hidden="true"><path d="M70 72 L134 28 A78 78 0 1 1 4 108 Z" fill="${rang}" stroke="#7a3b2e" stroke-width="2.5" stroke-linejoin="round"/><circle cx="168" cy="140" r="34" fill="${QOGOZ[1]}" stroke="#7a3b2e" stroke-width="2.5"/></svg>`;

// kichik SVG (variant tugmalari uchun)
function yoySVG(y) {
  const root = yoqlar(y), L = joyla(root), k = 100 / Math.max(L.bw, L.bh), out = [];
  if (root.shape === 'konus') return KONUS_SVG(QOGOZ[0]).replace('<svg ', '<svg class="yoy-mini" ');
  const P = (f) => [(f.x - L.minx) * k + 6, (f.y - L.miny) * k + 6, f.w * k, f.h * k];
  const ch = 'stroke="#5b3a2e" stroke-width="1.6" stroke-linejoin="round"';
  const tasma = L.all.filter(f => f.shape === 'tasma');
  if (tasma.length) { const [x, yy] = P(tasma[0]); out.push(`<rect x="${x}" y="${yy}" width="${tasma.length * tasma[0].w * k}" height="${tasma[0].h * k}" fill="${tasma[0].rang}" ${ch}/>`); }
  for (const f of L.all) {
    const [x, yy, w, h] = P(f);
    if (f.shape === 'rect') out.push(`<rect x="${x}" y="${yy}" width="${w}" height="${h}" fill="${f.rang}" ${ch}/>`);
    else if (f.shape === 'disc') out.push(`<circle cx="${x + w / 2}" cy="${yy + h / 2}" r="${w / 2}" fill="${f.rang}" ${ch}/>`);
    else if (f.shape === 'tri') {
      const p = { t: [[x, yy + h], [x + w, yy + h], [x + w / 2, yy]], b: [[x, yy], [x + w, yy], [x + w / 2, yy + h]], r: [[x, yy], [x, yy + h], [x + w, yy + h / 2]], l: [[x + w, yy], [x + w, yy + h], [x, yy + h / 2]] }[f.at];
      out.push(`<polygon points="${p.map(q => q.join(',')).join(' ')}" fill="${f.rang}" ${ch}/>`);
    }
  }
  return `<svg class="yoy-mini" viewBox="0 0 ${L.bw * k + 12} ${L.bh * k + 12}" aria-hidden="true">${out.join('')}</svg>`;
}

// jism rasmi (izometrik)
function jismSVG(j) {
  const ch = 'stroke="#5b3a2e" stroke-width="2.2" stroke-linejoin="round"';
  const s = {
    cube: `<path d="M50 14 L82 30 L50 46 L18 30Z" fill="${QOGOZ[1]}" ${ch}/><path d="M18 30 L50 46 L50 84 L18 68Z" fill="${QOGOZ[0]}" ${ch}/><path d="M82 30 L50 46 L50 84 L82 68Z" fill="${QOGOZ[3]}" ${ch}/>`,
    cuboid: `<path d="M38 22 L90 36 L64 50 L12 36Z" fill="${QOGOZ[1]}" ${ch}/><path d="M12 36 L64 50 L64 80 L12 66Z" fill="${QOGOZ[0]}" ${ch}/><path d="M90 36 L64 50 L64 80 L90 66Z" fill="${QOGOZ[3]}" ${ch}/>`,
    triangularPrism: `<path d="M30 18 L76 30 L92 74 L46 62Z" fill="${QOGOZ[4]}" ${ch}/><path d="M30 18 L46 62 L10 66Z" fill="${QOGOZ[1]}" ${ch}/><path d="M10 66 L46 62 L92 74 L56 80Z" fill="${QOGOZ[3]}" ${ch}/>`,
    squarePyramid: `<path d="M50 10 L16 66 L50 82Z" fill="${QOGOZ[0]}" ${ch}/><path d="M50 10 L50 82 L86 64Z" fill="${QOGOZ[1]}" ${ch}/><path d="M16 66 L50 82 L86 64" fill="none" ${ch}/>`,
    cylinder: `<path d="M20 24 L20 76 A30 10 0 0 0 80 76 L80 24" fill="${QOGOZ[3]}" ${ch}/><ellipse cx="50" cy="24" rx="30" ry="10" fill="${QOGOZ[1]}" ${ch}/>`,
    cone: `<path d="M50 10 L20 74 A30 10 0 0 0 80 74 Z" fill="${QOGOZ[0]}" ${ch}/><path d="M20 74 A30 10 0 0 0 80 74" fill="none" ${ch}/>`,
  }[j] || '';
  return `<svg viewBox="0 0 100 92" class="jism-svg" aria-hidden="true">${s}</svg>`;
}

// 3D sahna: yoqlar DOM daraxti, buklash (f = 0…1), kamera og'ishi, aylanish
function yoySahna(y, opts = {}) {
  const root = yoqlar(y), L = joyla(root);
  const node = el('div', { class: 'yoy-sahna' });
  const kamera = el('div', { class: 'yoy-kamera' }), aylana = el('div', { class: 'yoy-aylana' });
  kamera.append(aylana); node.append(kamera);
  const yuzlar = [];
  let k = 40;
  function qur() {
    const W = node.clientWidth || 320, Hh = node.clientHeight || 230;
    k = Math.min(70, (W - 24) / L.bw, (Hh - 24) / L.bh) * (root.shape === 'konus' ? 1 : 0.92);
    aylana.replaceChildren(); yuzlar.length = 0;
    if (root.shape === 'konus') {
      aylana.append(el('div', { class: 'yoy-konus', html: KONUS_SVG(root.rang), style: `width:${L.bw * k}px;height:${L.bh * k}px` }));
    } else {
      (function go(f, parent) {
        const d = el('div', { class: `yq yq--${f.shape}` + (f.chet ? ' yq--chet-' + f.chet : ''), style: `width:${f.w * k}px;height:${f.h * k}px;--rang:${f.rang}` });
        if (f.shape === 'tri') d.style.clipPath = TRI[f.at];
        if (parent) {
          const p = parent.f;
          const left = f.at === 'r' ? p.w * k : f.at === 'l' ? -f.w * k : f.off * k, top = f.at === 'b' ? p.h * k : f.at === 't' ? -f.h * k : f.off * k;
          Object.assign(d.style, { left: left + 'px', top: top + 'px', transformOrigin: { r: '0 50%', l: '100% 50%', t: '50% 100%', b: '50% 0' }[f.at] });
        } else Object.assign(d.style, { left: (f.x - L.minx) * k + 'px', top: (f.y - L.miny) * k + 'px' });
        if (opts.yoz && f.shape === 'rect') d.append(el('span', { class: 'yq__yoz' }, `${f.w}×${f.h}`));
        if (opts.belgi != null && f.idx === opts.belgi) d.append(el('span', { class: 'yq__belgi' }, '★'));
        if (opts.bos && f.idx != null) d.addEventListener('click', (e) => { e.stopPropagation(); opts.bos(f.idx, d); });
        d.f = f; f.d = d;
        (parent || aylana).append(d); yuzlar.push(d);
        f.kids.forEach(c => go(c, d));
      })(root, null);
    }
    Object.assign(kamera.style, { width: L.bw * k + 'px', height: L.bh * k + 'px' });
    qoy(0);
  }
  function qoy(f) {
    const W = node.clientWidth || 320, Hh = node.clientHeight || 230;
    const rx = (root.x - L.minx + root.w / 2) * k, ry = (root.y - L.miny + root.h / 2) * k;
    const x0 = (W - L.bw * k) / 2, y0 = (Hh - L.bh * k) / 2, x1 = W / 2 - rx, y1 = Hh * 0.62 - ry;
    kamera.style.transformOrigin = `${rx}px ${ry}px`;
    aylana.style.transformOrigin = `${rx}px ${ry}px`;
    const e = root.shape === 'konus' ? 0 : f;
    kamera.style.transform = `translate(${x0 + (x1 - x0) * e}px, ${y0 + (y1 - y0) * e}px) rotateX(${58 * e}deg) rotateZ(${-32 * e}deg)`;
    for (const d of yuzlar) {
      const ff = d.f; if (!ff.at) continue;
      const a = ff.ang * f;
      d.style.transform = { r: `rotateY(${-a}deg)`, l: `rotateY(${a}deg)`, t: `rotateX(${-a}deg)`, b: `rotateX(${a}deg)` }[ff.at];
    }
  }
  let raf = 0;
  return {
    node, root,
    tayyor() { qur(); },
    // buklash: 1,4 s; tugagach jism aylanib turadi; konus — rasmga almashadi
    bukla(then) {
      cancelAnimationFrame(raf);
      if (root.shape === 'konus') {
        node.classList.add('konus-ket');
        node.append(el('div', { class: 'yoy-jism', html: jismSVG('cone') }));
        setTimeout(() => then && then(), 900); return;
      }
      const t0 = performance.now(), T = 1500;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / T), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        qoy(e);
        if (p < 1) raf = requestAnimationFrame(step);
        else { node.classList.add('buklandi'); then && then(); }
      };
      raf = requestAnimationFrame(step);
    },
    ochiq() { cancelAnimationFrame(raf); node.classList.remove('buklandi'); qoy(0); },
    stop() { cancelAnimationFrame(raf); },
    belgila(idx, cls) { yuzlar.forEach(d => { if (d.f.idx === idx) d.classList.add(cls); }); },
    ustlar() { yuzlar.forEach(d => { if (d.f.ust) d.classList.add('yq--ust'); }); },
  };
}

// qarama-qarshi yoq: bitta qatorda orasida bitta yoq bo'lsa — qoida bilan, aks holda buklab ko'rsatamiz
function qaramaSabab(t) {
  const a = t.yoy.cells[t.belgi], b = t.yoy.cells[t.javob];
  if ((a[0] === b[0] && Math.abs(a[1] - b[1]) === 2) || (a[1] === b[1] && Math.abs(a[0] - b[0]) === 2))
    return "Bir qatorda ketma-ket uchta yoq bo'lsa, chetdagi ikkitasi qarama-qarshi tushadi.";
  return 'Buklanganda ★ yoqning qarshisiga aynan shu yoq tushadi — yoyilmada ular hech qachon yonma-yon (qirradosh) bo\'lmaydi.';
}

function gameNetFold(ctx) {
  const all = [...ctx.bank];
  const s = shell(ctx, all[0].prompt, 'net');
  const H = hud(3);
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0;
  const times = [];
  let onKey = null, sahna = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); sahna && sahna.stop(); }, { once: true });

  const savol = el('div', { class: 'yoy-savol' });
  const taxta = el('div', { class: 'yoy-taxta' });
  const javoblar = el('div', { class: 'yoy-javoblar' });

  function round() {
    const items = rounds[ri];
    H.resetHearts();
    let ii = 0, mistakes = 0, busy = false, startedAt = 0;

    function sahnaQur(y, opts) {
      sahna && sahna.stop();
      sahna = yoySahna(y, opts);
      taxta.replaceChildren(sahna.node);
      requestAnimationFrame(() => sahna.tayyor());
    }

    function next() {
      if (ii >= items.length) return endRound();
      const t = items[ii];
      busy = false;
      s.setProg(done, all.length);
      savol.textContent = t.prompt;
      javoblar.className = 'yoy-javoblar';
      if (t.tur === 'yoyilmasi') {
        sahna && sahna.stop(); sahna = null;
        taxta.replaceChildren(el('div', { class: 'yoy-jism yoy-jism--katta', html: jismSVG(t.jism) }), el('b', { class: 'yoy-jismnom' }, JISM_UZ[t.jism]));
      } else sahnaQur(t.yoy, { yoz: t.tur === 'sirt', belgi: t.tur === 'qarama' ? t.belgi : null, bos: t.tur === 'qarama' ? (idx, d) => tanla(idx, d) : null });

      let tugmalar = [];
      if (t.tur === 'jism') tugmalar = t.options.map(o => [o, [el('span', { class: 'yoy-jt__rasm', html: jismSVG(o) }), el('b', {}, JISM_UZ[o])]]);
      else if (t.tur === 'kubmi') { tugmalar = [[true, [el('b', {}, '✓ Ha')]], [false, [el('b', {}, "✗ Yo'q")]]]; javoblar.classList.add('yoy-javoblar--hayoq'); }
      else if (t.tur === 'sirt') tugmalar = t.options.map(o => [o, [el('b', {}, `${o} cm²`)]]);
      else if (t.tur === 'yoyilmasi') { tugmalar = t.variantlar.map((v, i) => [i, [el('span', { class: 'yoy-jt__yoy', html: yoySVG(v) })]]); javoblar.classList.add('yoy-javoblar--yoy'); }
      javoblar.replaceChildren(...tugmalar.map(([v, ich], i) => el('button', { type: 'button', class: 'yoy-jt', onclick: (e) => tanla(v, e.currentTarget) },
        ...ich, el('small', { class: 'yoy-jt__key' }, i + 1))));
      javoblar.hidden = t.tur === 'qarama';
      B.say(t.tur === 'qarama' ? ['Kub buklanganda ★ yoqning qarshisida qaysi yoq bo\'ladi? Yoyilmadagi o\'sha yoqni bosing.']
        : t.tur === 'kubmi' ? ['Ko\'z oldingizda buklab ko\'ring: yoqlar ustma-ust tushmaydimi, hamma tomon yopiladimi?']
        : t.tur === 'sirt' ? ['Har yoqda uning o\'lchamlari yozilgan (cm). Hamma yoqlar yuzini qo\'shing.']
        : t.tur === 'yoyilmasi' ? ['Qaysi yoyilma buklansa shu jism chiqadi?']
        : ['Yoqlarini sanang va shakliga qarang: qaysi jism chiqadi?'], 'idle');
      startedAt = performance.now();
      onKey = (ev) => { const n = +ev.key; if (n >= 1 && n <= javoblar.children.length && !javoblar.hidden) { ev.preventDefault(); javoblar.children[n - 1].click(); } };
    }

    function sabab(t, v, ok) {
      if (t.tur === 'jism') return ok ? JISM_TARKIB[t.target] : `${JISM_TARKIB[t.target]}, ${JISM_UZ[v].toLowerCase()} emas.`;
      if (t.tur === 'kubmi') {
        if (t.javob) return 'Buklanganda hamma tomon yopildi, yoqlar ustma-ust tushmadi — yig\'iladi.';
        if (t.yoy.tur === 'grid') return 'Ikki yoq bir joyga tushdi, bitta tomon ochiq qoldi — kub yig\'ilmaydi.';
        return t.yoy.tur === 'prizma' ? 'Ikkala uchburchak bir tomonda — biri ustma-ust tushadi, ikkinchi asos ochiq qoladi.'
          : 'Ikkala doira bir tomonda — biri ustma-ust tushadi, ikkinchi asos ochiq qoladi.';
      }
      if (t.tur === 'qarama') return qaramaSabab(t);
      if (t.tur === 'sirt') {
        const [a, b, c] = t.yoy.dims;
        return `Yoqlar: 2 ta ${a}×${b}, 2 ta ${a}×${c}, 2 ta ${b}×${c}. 2 · ${a * b} + 2 · ${a * c} + 2 · ${b * c} = ${t.javob} cm²`;
      }
      return ok ? JISM_TARKIB[t.jism] : `${JISM_TARKIB[t.jism]}. Tanlangan yoyilmadan ${JISM_UZ[t.jism].toLowerCase()} chiqmaydi.`;
    }

    function tanla(v, btn) {
      if (busy) return;
      const t = items[ii];
      busy = true; onKey = null;
      const togri = t.tur === 'jism' ? t.target : t.javob;
      const ok = v === togri;
      total++; done++;
      times.push(performance.now() - startedAt);
      [...javoblar.children].forEach((b, i) => { b.disabled = true; });
      if (t.tur === 'qarama') { btn.classList.add(ok ? 'yq--ok' : 'yq--bad'); sahna.belgila(togri, 'yq--ok'); sahna.belgila(t.belgi, 'yq--belgi'); }
      else {
        btn.classList.add(ok ? 'is-ok' : 'is-bad');
        const tv = t.tur === 'jism' ? t.options.indexOf(togri) : t.tur === 'kubmi' ? (togri ? 0 : 1) : t.tur === 'sirt' ? t.options.indexOf(togri) : togri;
        javoblar.children[tv]?.classList.add('is-ok');
      }
      // yoyilmasi — to'g'ri yoyilma taxtaga chiqib buklanadi
      if (t.tur === 'yoyilmasi') sahnaQur(t.variantlar[t.javob], {});
      const bukla = () => sahna.bukla(() => { if (t.tur === 'kubmi' && !t.javob) sahna.ustlar(); });
      later(bukla, t.tur === 'yoyilmasi' ? 450 : 250);
      if (ok) {
        right++;
        const m = H.hit(); longest = Math.max(longest, H.st.combo);
        const fast = performance.now() - startedAt < 8000;
        sfx.ok();
        H.add(10 * m + (fast ? 5 : 0), btn);
        if (fast && m < 2) floatText('⚡ Tez!', btn, 'hud-float--tez');
        B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', sabab(t, v, true)], 'ok');
        later(() => { ii++; next(); }, 3900);
      } else {
        mistakes++; H.miss(); sfx.bad();
        const left = H.loseHeart();
        B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', sabab(t, v, false)], 'bad');
        const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
        later(() => {
          s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
          onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
        }, 1200);
      }
    }

    function autoRest() {
      onKey = null; javoblar.replaceChildren();
      B.say(['Yuraklar tugadi. Qolgan yoyilmalar qanday buklanishini kuzating.'], 'think');
      const go = () => {
        if (ii >= items.length) return endRound();
        const t = items[ii]; total++; done++; s.setProg(done, all.length);
        savol.textContent = t.prompt;
        sahnaQur(t.tur === 'yoyilmasi' ? t.variantlar[t.javob] : t.yoy, { yoz: t.tur === 'sirt', belgi: t.tur === 'qarama' ? t.belgi : null });
        later(() => { if (t.tur === 'qarama') { sahna.belgila(t.javob, 'yq--ok'); sahna.belgila(t.belgi, 'yq--belgi'); }
          sahna.bukla(() => { if (t.tur === 'kubmi' && !t.javob) sahna.ustlar(); });
          B.say([sabab(t, t.tur === 'jism' ? t.target : t.javob, true)], 'think'); }, 900);
        later(() => { ii++; go(); }, 4200);
      };
      later(go, 1000);
    }

    function endRound() {
      onKey = null; javoblar.replaceChildren();
      const clean = mistakes === 0;
      if (clean) { H.add(30, taxta); sfx.win(); }
      s.setProg(done, all.length);
      const lastR = ri + 1 >= rounds.length;
      s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            ri++;
            if (ri >= rounds.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              sahna && sahna.stop();
              ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
            } else { s.foot.replaceChildren(); round(); }
          } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
    }
    next();
  }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const ustaxona = el('div', { class: 'sahna sahna--origami' },
    el('i', { class: 'origami__turna' }), el('i', { class: 'origami__qalam' }),
    H.node, B.node, savol, el('div', { class: 'yoy-mat' }, taxta), javoblar);
  s.area.replaceChildren(ustaxona);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: ustaxona.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
}

// ================= fractionStrip (Ulush tasmasi — bog'dagi devor) =================
// Quyoshli hovlida yog'och devor: taxtalar — teng bo'laklar. Bo'yoq chelagi yorlig'ida topshiriq (kasr ustunli).
// Taxtalarni bosib yoki barmoqni surib bo'yash. Turlari: boya (a/b ni bo'yash; taxtalar b·k ta bo'lsa — teng kasr),
// son (N ta taxtaning a/b qismi), qosh (a/b ko'k bo'yalgan + c/b sariq), ayir (a/b dan c/b ni yuvish),
// foiz (p% yoki o'nli kasr), qaysi (bo'yalgan qism — kasr/foiz/o'nli kasr variantlaridan), shakl (kvadrat/oltiburchak/
// uchburchak/romb/trapetsiya/to'g'ri to'rtburchak har xil kattalikdagi bo'laklarga bo'lingan — sanab emas, kattaligiga
// qarab bo'yash), shaklqaysi (bo'yalgan qism qancha — bo'laklar teng emas), tengmi («bo'yalgan qism 1/n mi?» — shakli
// har xil, yuzi teng bo'laklar ham bor). Brilliant «Combining Parts» g'oyasi. Doira-bo'lak yo'q.
const kasrEl = (a, b) => el('span', { class: 'kasr' }, el('b', {}, a), el('i'), el('b', {}, b));
// matndagi «a/b» — ustunli kasr
const matnK = (str) => str.split(/(\d+\/\d+)/).map(q => (/^\d+\/\d+$/.test(q) ? kasrEl(...q.split('/')) : q)).filter(q => q !== '');

const ekub = (a, b) => (b ? ekub(b, a % b) : a);
const kQosh = (p, q) => { const a = p[0] * q[1] + q[0] * p[1], b = p[1] * q[1], g = ekub(a, b) || 1; return [a / g, b / g]; };
const kYigindi = (ks) => ks.reduce((s, k) => kQosh(s, k), [0, 1]);
const kMatn = (k) => (k[1] === 1 ? `${k[0]}` : `${k[0]}/${k[1]}`);
// shakl (kvadrat, oltiburchak, uchburchak) — har xil kattalikdagi bo'laklar; panjara koordinatalaridan ekranga
function shaklSVG(t, kenglik) {
  const map = t.shakl === 'kv' || t.shakl === 'tort' ? ([x, y]) => [x, y] : ([x, y]) => [x + y / 2, -y * Math.sqrt(3) / 2];
  const P = t.bolaklar.map(b => b.map(map)), all = P.flat();
  const minx = Math.min(...all.map(p => p[0])), maxx = Math.max(...all.map(p => p[0])), miny = Math.min(...all.map(p => p[1])), maxy = Math.max(...all.map(p => p[1]));
  const k = Math.min((kenglik - 20) / (maxx - minx), 210 / (maxy - miny)), W = (maxx - minx) * k + 12, H = (maxy - miny) * k + 12;
  const pts = P.map(b => b.map(([x, y]) => [(x - minx) * k + 6, (y - miny) * k + 6]));
  const node = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'shakl-svg' });
  const bolak = pts.map((b, i) => { const pg = svgEl('polygon', { points: b.map(p => p.map(v => v.toFixed(1)).join(',')).join(' '), class: 'bk' }); pg.dataset.i = i; node.append(pg); return pg; });
  // har bo'lak markazida uning kasri (ustunli) — javobdan keyin ko'rinadi
  const yozuv = svgEl('g', { class: 'bk-yozuv' });
  pts.forEach((b, i) => {
    const cx = b.reduce((a, p) => a + p[0], 0) / b.length, cy = b.reduce((a, p) => a + p[1], 0) / b.length, [u, m] = t.ulush[i];
    const fs = Math.max(8, Math.min(15, Math.sqrt(u / m) * 46));
    yozuv.append(svgEl('text', { x: cx, y: cy - fs * 0.2, 'font-size': fs, 'text-anchor': 'middle' }, u),
      svgEl('line', { x1: cx - fs * 0.45, x2: cx + fs * 0.45, y1: cy + fs * 0.05, y2: cy + fs * 0.05, 'stroke-width': Math.max(1, fs / 10) }),
      svgEl('text', { x: cx, y: cy + fs * 0.95, 'font-size': fs, 'text-anchor': 'middle' }, m));
  });
  node.append(yozuv);
  return { node, bolak };
}
const svgEl = (tag, attrs = {}, ...kids) => {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of kids) n.append(String(c));
  return n;
};

function ulushSabab(t, tanlov) {
  if (t.tur === 'tengmi') {
    const [u, m] = t.ulush[t.boyalgan[0]], n = t.d;
    return t.javob ? `Bo'laklar shakli har xil bo'lsa ham, yuzlari teng — har biri 1/${n}. Ha, bu 1/${n}.`
      : `Bo'laklar teng emas: bo'yalgan bo'lak ${u}/${m}, 1/${n} emas. Kasr — teng bo'laklar.`;
  }
  if (t.tur === 'shaklqaysi') tanlov = t.boyalgan;
  if (t.tur === 'shakl' || t.tur === 'shaklqaysi') {
    const ks = (tanlov || t.yechim).map(i => t.ulush[i]).sort((a, b) => b[0] / b[1] - a[0] / a[1]);
    const qs = t.kasrlar && t.kasrlar.every(k => k[1] === t.kasrlar[0][1]) ? [t.kasrlar.reduce((a, k) => a + k[0], 0), t.kasrlar[0][1]] : null;
    const old = t.kasrlar ? `${t.kasrlar.map(kMatn).join(' + ')} = ${qs && kMatn(qs) !== kMatn(kYigindi(t.kasrlar)) ? `${kMatn(qs)} = ` : ''}${kMatn(kYigindi(t.kasrlar))}. ` : '';
    if (ks.length === 1) return `${old}Bo'yalgan bo'lak butunning ${kMatn(ks[0])} qismi — bo'laklar teng emas, kattaligiga qarab o'lchaymiz.`;
    return `${old}${ks.map(kMatn).join(' + ')} = ${kMatn(kYigindi(ks))} — bo'laklar teng emas, sanab emas, kattaligiga qarab qo'shamiz.`;
  }
  const d = t.d, n = t.n;
  if (t.tur === 'boya') {
    const [a, b] = t.kasr, k = d / b;
    return k === 1 ? `${a}/${b} — devor ${b} ta teng bo'lakka bo'lingan, ${a} tasi bo'yaladi.`
      : `${d} : ${b} = ${k} — har bo'lakda ${k} ta taxta, ${a} bo'lak = ${n} ta. Demak ${a}/${b} = ${n}/${d}.`;
  }
  if (t.tur === 'son') {
    const [a, b] = t.kasr, q = d / b;
    return a === 1 ? `${d} : ${b} = ${q} — ${d} ning 1/${b} qismi ${q} ta.` : `${d} : ${b} = ${q}, ${q} · ${a} = ${n} — ${d} ning ${a}/${b} qismi ${n} ta.`;
  }
  if (t.tur === 'qosh' || t.tur === 'ayir') {
    const [[a, b], [c]] = t.kasrlar, z = t.tur === 'qosh' ? '+' : '−';
    return `${a}/${b} ${z} ${c}/${b} = ${n}/${b} — maxraj o'zgarmaydi, suratlar ${t.tur === 'qosh' ? 'qo\'shiladi' : 'ayiriladi'}.`;
  }
  if (t.tur === 'foiz') {
    const s = 100 / d;
    return `${t.onli ? `${t.onli} = ${t.foiz}%. ` : ''}Butun devor — 100%, bitta taxta ${s}%; ${t.foiz} : ${s} = ${n} ta taxta.`;
  }
  return `${d} ta teng taxtadan ${n} tasi bo'yalgan — ${n}/${d}${t.shakl === 'kasr' ? '' : ` = ${t.javob}`}.`;
}

function gameFractionStrip(ctx) {
  const all = [...ctx.bank];
  const s = shell(ctx, all[0].prompt || '', 'columns');
  const H = hud(3);
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); }, { once: true });

  const yorliq = el('div', { class: 'chelak__yorliq' });
  const chelak = el('div', { class: 'chelak' }, el('i', { class: 'chelak__dasta' }), el('div', { class: 'chelak__tana' }, yorliq), el('i', { class: 'chelak__tomchi' }));
  const savol = el('div', { class: 'bog-savol' });
  const devor = el('div', { class: 'devor' });
  const shaklJoy = el('div', { class: 'shakl-joy', hidden: true });
  let shk = null, tanlov = new Set();
  const guruhlar = el('div', { class: 'devor-guruh' });
  const hisob = el('div', { class: 'bog-hisob' });
  const javoblar = el('div', { class: 'bog-javoblar' });
  const tayyor = el('button', { type: 'button', class: 'btn btn--accent bog-tayyor', onclick: () => tekshir() }, 'Tayyor ✓');
  const tozala = el('button', { type: 'button', class: 'btn bog-tozala', onclick: () => { if (!busy) { tanlov = new Set(); holat.fill(0); if (t.bosh) for (let i = 0; i < t.bosh; i++) holat[i] = 1; chiz(); sfx.tap(); } } }, 'Qayta');
  const amallar = el('div', { class: 'bog-amallar' }, tozala, tayyor);

  // holat: 0 — bo'yalmagan, 1 — ko'k (oldindan), 2 — sariq (qo'shilgan), 3 — yuvilgan
  let t = null, holat = [], busy = true, startedAt = 0, tekshir = () => {};
  const taxtalar = () => [...devor.children];
  function chiz() {
    if (t && shk && shaklJoy.contains(shk.node) && !shaklJoy.hidden) { shk.bolak.forEach((pg, i) => pg.classList.toggle('bk--kok', tanlov.has(i))); hisob.replaceChildren(); return; }   // shaklda bo'laklar sonini ko'rsatmaymiz — sanash emas, kattalik muhim
    taxtalar().forEach((d, i) => { d.className = 'taxta' + (holat[i] === 1 ? ' taxta--kok' : holat[i] === 2 ? ' taxta--sariq' : holat[i] === 3 ? ' taxta--yuvildi' : ''); });
    const k = holat.filter(h => h === 1 || h === 2).length;
    hisob.replaceChildren('Bo\'yalgan: ', el('b', {}, `${k} ta`), ` · jami ${t.d} ta taxta`);
  }
  // bitta taxtaga bo'yoq: tur bo'yicha nima bo'lishi
  function surt(i, rejim) {
    if (busy || !t || t.tur === 'qaysi' || t.tur === 'shaklqaysi' || t.tur === 'tengmi') return;
    if (t.tur === 'shakl') {
      const bor = tanlov.has(i);
      if (bor && rejim !== 'boya') tanlov.delete(i); else if (!bor && rejim !== 'qayt') tanlov.add(i); else return null;
      chiz(); sfx.tap(); return bor ? 0 : 1;
    }
    const h = holat[i];
    let yangi = h;
    if (t.tur === 'ayir') { if (h === 1 && rejim !== 'qayt') yangi = 3; else if (h === 3 && rejim !== 'boya') yangi = 1; }
    else if (t.tur === 'qosh') { if (h === 0 && rejim !== 'qayt') yangi = 2; else if (h === 2 && rejim !== 'boya') yangi = 0; }
    else { if (h === 0 && rejim !== 'qayt') yangi = 1; else if (h === 1 && rejim !== 'boya') yangi = 0; }
    if (yangi !== h) { holat[i] = yangi; chiz(); sfx.tap(); }
    return yangi !== h ? yangi : null;
  }
  // barmoq bilan surish: birinchi taxtadagi o'zgarish yo'nalishi (bo'yash/qaytarish) davom etadi
  let rejim = null;
  devor.addEventListener('pointerdown', (e) => {
    const d = e.target.closest('.taxta'); if (!d) return;
    e.preventDefault();
    const i = taxtalar().indexOf(d), h = holat[i];
    const r = surt(i, null);
    rejim = r === null ? null : (r === 3 || (r === 1 && h === 0) || r === 2) ? 'boya' : 'qayt';
    try { devor.setPointerCapture(e.pointerId); } catch { /* */ }
  });
  devor.addEventListener('pointermove', (e) => {
    if (!rejim) return;
    const d = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.taxta');
    if (d && d.parentNode === devor) surt(taxtalar().indexOf(d), rejim);
  });
  shaklJoy.addEventListener('pointerdown', (e) => {
    const pg = e.target.closest('.bk'); if (!pg) return;
    e.preventDefault();
    const r = surt(+pg.dataset.i, null);
    rejim = r === null ? null : r === 1 ? 'boya' : 'qayt';
    try { shaklJoy.setPointerCapture(e.pointerId); } catch { /* */ }
  });
  shaklJoy.addEventListener('pointermove', (e) => {
    if (!rejim) return;
    const pg = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.bk');
    if (pg && shaklJoy.contains(pg)) surt(+pg.dataset.i, rejim);
  });
  const tugat = () => { rejim = null; };
  shaklJoy.addEventListener('pointerup', tugat); shaklJoy.addEventListener('pointercancel', tugat);
  devor.addEventListener('pointerup', tugat); devor.addEventListener('pointercancel', tugat);

  function yorliqYoz() {
    const K = (a, b) => kasrEl(a, b);
    let ich;
    if (t.tur === 'shakl' && t.kasrlar) ich = [K(...t.kasrlar[0]), el('span', { class: 'chelak__amal' }, '+'), K(...t.kasrlar[1])];
    else if (t.tur === 'boya' || t.tur === 'shakl' || t.tur === 'tengmi') ich = [K(...t.kasr), ...(t.tur === 'tengmi' ? [el('b', { class: 'chelak__foiz' }, '?')] : [])];
    else if (t.tur === 'son') ich = [el('small', {}, `${t.d} ning`), K(...t.kasr)];
    else if (t.tur === 'qosh' || t.tur === 'ayir') ich = [K(...t.kasrlar[0]), el('span', { class: 'chelak__amal' }, t.tur === 'qosh' ? '+' : '−'), K(...t.kasrlar[1])];
    else if (t.tur === 'foiz') ich = [el('b', { class: 'chelak__foiz' }, t.onli || `${t.foiz}%`)];
    else ich = [el('b', { class: 'chelak__foiz' }, '?')];
    yorliq.replaceChildren(...ich);
  }
  // to'g'ri javobdan keyin — bo'laklar qavslari (har 1/b qism) yoki foiz belgilari
  function guruhChiz() {
    if (t.tur === 'shakl' || t.tur === 'shaklqaysi' || t.tur === 'tengmi') { shaklJoy.classList.add('yozuvli'); return; }
    const b = t.tur === 'boya' || t.tur === 'son' ? t.kasr[1] : t.tur === 'foiz' ? 0 : t.d;
    if (t.tur === 'foiz') { guruhlar.replaceChildren(...Array.from({ length: t.d }, () => el('span', { class: 'gq gq--foiz' }, `${100 / t.d}%`))); guruhlar.style.setProperty('--n', t.d); return; }
    const k = t.d / b;
    guruhlar.style.setProperty('--n', b);
    guruhlar.replaceChildren(...Array.from({ length: b }, (_, i) => el('span', { class: 'gq' + (i % 2 ? ' gq--2' : '') }, k > 1 || t.tur === 'son' ? kasrEl(1, b) : '')));
  }

  // shakl topshirig'ida devor o'rniga shakl chiqadi
  function shaklKo(tt) {
    const bor = tt.tur === 'shakl' || tt.tur === 'shaklqaysi' || tt.tur === 'tengmi';
    devorJoy.hidden = bor; guruhlar.hidden = bor; shaklJoy.hidden = !bor;
    shaklJoy.classList.remove('yozuvli');
    tanlov = new Set();
    if (bor) { shk = shaklSVG(tt, Math.min(360, (bog.clientWidth || 340) - 30)); shaklJoy.replaceChildren(shk.node); if (tt.boyalgan) tanlov = new Set(tt.boyalgan); }
  }
  function round() {
    const items = rounds[ri];
    H.resetHearts();
    let ii = 0, mistakes = 0;

    function next() {
      if (ii >= items.length) return endRound();
      t = items[ii];
      busy = false;
      s.setProg(done, all.length);
      holat = Array(t.d).fill(0);
      if (t.bosh) for (let i = 0; i < t.bosh; i++) holat[i] = 1;
      if (t.tur === 'qaysi') { const tartib = shuffle([...Array(t.d).keys()]).slice(0, t.n); tartib.forEach(i => { holat[i] = 1; }); }
      devor.style.setProperty('--n', t.d);
      devor.replaceChildren(...Array.from({ length: t.d }, () => el('i', { class: 'taxta' })));
      guruhlar.replaceChildren();
      shaklKo(t);
      chiz(); yorliqYoz();
      chelak.classList.remove('yangi'); void chelak.offsetWidth; chelak.classList.add('yangi');
      const savolMatn = {
        boya: 'Devorning shuncha qismini bo\'yang', son: 'Shuncha taxtani bo\'yang',
        qosh: 'Ko\'k qism bor — sariq bilan qo\'shing', ayir: 'Bo\'yalgan qismdan ayiring — taxtalarni yuving',
        foiz: 'Devorning shuncha qismini bo\'yang', shakl: t.kasrlar ? 'Ikkala kasrni birga bo\'yang' : 'Shaklning shuncha qismini bo\'yang', shaklqaysi: 'Shaklning qancha qismi bo\'yalgan?', tengmi: `Bo'yalgan qism 1/${t.d} mi?`, qaysi: t.shakl === 'foiz' ? 'Devorning necha foizi bo\'yalgan?' : t.shakl === 'onli' ? 'Bo\'yalgan qism o\'nli kasrda qancha?' : 'Devorning qancha qismi bo\'yalgan?',
      }[t.tur];
      savol.textContent = savolMatn;
      if (t.tur === 'tengmi') t.options = [true, false];
      if (t.tur === 'qaysi' || t.tur === 'shaklqaysi' || t.tur === 'tengmi') {
        amallar.hidden = true; javoblar.hidden = false;
        javoblar.replaceChildren(...t.options.map((o, i) => el('button', { type: 'button', class: 'bog-jt', onclick: (e) => tanla(o, e.currentTarget) }, ...(o === true ? ['✓ Ha'] : o === false ? ["✗ Yo'q"] : matnK(o)), el('small', { class: 'bog-jt__key' }, i + 1))));
      } else { amallar.hidden = false; javoblar.hidden = true; }
      B.say(t.tur === 'son' ? ['Taxtalarni teng guruhlarga ajrating: maxraj — nechta guruh, surat — nechta guruh bo\'yaladi.']
        : t.tur === 'qosh' ? ['Ko\'k qism oldindan bor. Ikkinchi kasrni sariq bilan qo\'shing — taxtani bosing yoki barmoqni suring.']
        : t.tur === 'ayir' ? ['Ayiriladigan qismni yuving — bo\'yalgan taxtani bosing.']
        : t.tur === 'foiz' ? [`Butun devor — 100%. Bitta taxta necha foiz?`]
        : t.tur === 'qaysi' ? ['Taxtalarni sanang: jami nechta, nechtasi bo\'yalgan?']
        : t.tur === 'shakl' ? ['Diqqat: bo\'laklar teng emas! Sanab emas, kattaligiga qarab bo\'yang.']
        : t.tur === 'shaklqaysi' ? ['Bo\'laklar teng emasligiga e\'tibor bering — har bo\'lak butunning qanchasi?']
        : t.tur === 'tengmi' ? ['Kasr — teng bo\'laklar. Bo\'laklar haqiqatan tengmi? Shakli emas, kattaligi muhim.']
        : ['Taxtani bosing yoki barmoqni surib bo\'yang. Keyin «Tayyor».'], 'idle');
      startedAt = performance.now();
      onKey = (ev) => {
        if (ev.key === 'Enter' && javoblar.hidden) { ev.preventDefault(); tekshir(); }
        const n = +ev.key; if (!javoblar.hidden && n >= 1 && n <= javoblar.children.length) { ev.preventDefault(); javoblar.children[n - 1].click(); }
      };
    }

    // to'g'ri holatni ko'rsatish
    function togriQil() {
      if (t.tur === 'shakl') { tanlov = new Set(t.yechim); chiz(); return; }
      holat = Array(t.d).fill(0);
      if (t.tur === 'qosh') { for (let i = 0; i < t.bosh; i++) holat[i] = 1; for (let i = t.bosh; i < t.n; i++) holat[i] = 2; }
      else if (t.tur === 'ayir') { for (let i = 0; i < t.bosh; i++) holat[i] = i < t.n ? 1 : 3; }
      else for (let i = 0; i < t.n; i++) holat[i] = 1;
      chiz();
    }
    function natija(ok, btn, xatoMatn) {
      busy = true; onKey = null;
      total++; done++;
      times.push(performance.now() - startedAt);
      if (ok) {
        right++;
        const m = H.hit(); longest = Math.max(longest, H.st.combo);
        const fast = performance.now() - startedAt < 9000;
        sfx.ok(); devor.classList.add('yondi');
        H.add(10 * m + (fast ? 5 : 0), btn);
        if (fast && m < 2) floatText('⚡ Tez!', btn, 'hud-float--tez');
        if (t.tur === 'boya' || t.tur === 'son' || t.tur === 'qosh' || t.tur === 'ayir' || t.tur === 'foiz') togriQil();
        guruhChiz();
        B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', ...matnK(ulushSabab(t, t.tur === 'shakl' ? [...tanlov] : null))], 'ok');
        later(() => { devor.classList.remove('yondi'); ii++; next(); }, 2800);
      } else {
        mistakes++; H.miss(); sfx.bad();
        const left = H.loseHeart();
        devor.classList.remove('xato'); void devor.offsetWidth; devor.classList.add('xato');
        B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', ...matnK(xatoMatn), el('br'), ...matnK(ulushSabab(t))], 'bad');
        later(() => { if (t.tur !== 'qaysi' && t.tur !== 'shaklqaysi' && t.tur !== 'tengmi') togriQil(); guruhChiz(); }, 900);
        const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
        later(() => {
          s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
          onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
        }, 1000);
      }
    }
    tekshir = function () {
      if (busy || !t || !javoblar.hidden) return;
      if (t.tur === 'shakl') {
        if (!tanlov.size) return;
        const ks = [...tanlov].map(i => t.ulush[i]), sum = kYigindi(ks), ok = sum[0] * t.kasr[1] === sum[1] * t.kasr[0];
        return natija(ok, tayyor, ok ? '' : `Siz bo'yagan: ${ks.length > 1 ? `${ks.map(kMatn).join(' + ')} = ` : ''}${kMatn(sum)}, kerak ${kMatn(t.kasr)}.`);
      }
      const k = holat.filter(h => h === 1 || h === 2).length;
      if (t.tur !== 'ayir' && t.tur !== 'qosh' && k === 0) return;
      if (t.tur === 'qosh' && k === t.bosh) return;
      if (t.tur === 'ayir' && k === t.bosh) return;
      const ok = k === t.n;
      natija(ok, tayyor, ok ? '' : `Siz ${k} ta bo'yadingiz — ${k}/${t.d}, kerak ${t.n} ta.`);
    };
    function tanla(o, btn) {
      if (busy) return;
      const ok = o === t.javob;
      [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
      btn.classList.add(ok ? 'is-ok' : 'is-bad');
      natija(ok, btn, ok ? '' : typeof o === 'boolean' ? '' : t.tur === 'shaklqaysi' && o === `${t.n}/${t.d}` ? `${o} emas — bo'laklarni sanash yetmaydi.` : `${o} emas.`);
    }

    function autoRest() {
      onKey = null; amallar.hidden = true; javoblar.hidden = true;
      B.say(['Yuraklar tugadi. Qolganlarini qanday bo\'yalishini kuzating.'], 'think');
      const go = () => {
        if (ii >= items.length) { amallar.hidden = false; return endRound(); }
        t = items[ii]; total++; done++; s.setProg(done, all.length);
        holat = Array(t.d).fill(0); devor.style.setProperty('--n', t.d);
        devor.replaceChildren(...Array.from({ length: t.d }, () => el('i', { class: 'taxta' })));
        guruhlar.replaceChildren(); shaklKo(t); yorliqYoz(); chiz();
        later(() => { if (t.tur !== 'qaysi' && t.tur !== 'shaklqaysi' && t.tur !== 'tengmi') togriQil(); guruhChiz(); B.say([...matnK(ulushSabab(t))], 'think'); }, 800);
        later(() => { ii++; go(); }, 3400);
      };
      later(go, 1000);
    }
    function endRound() {
      onKey = null; busy = true; amallar.hidden = true; javoblar.hidden = true;
      const clean = mistakes === 0;
      if (clean) { H.add(30, devor); sfx.win(); }
      s.setProg(done, all.length);
      const lastR = ri + 1 >= rounds.length;
      s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            ri++;
            if (ri >= rounds.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
            } else { s.foot.replaceChildren(); round(); }
          } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
    }
    next();
  }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const devorJoy = el('div', { class: 'devor-joy' }, el('i', { class: 'devor__reyka devor__reyka--1' }), el('i', { class: 'devor__reyka devor__reyka--2' }), devor);
  const bog = el('div', { class: 'sahna sahna--bog' },
    el('i', { class: 'bog__quyosh' }), el('i', { class: 'bog__bulut bog__bulut--1' }), el('i', { class: 'bog__bulut bog__bulut--2' }), el('i', { class: 'bog__maysa' }),
    H.node, B.node,
    el('div', { class: 'bog-tepa' }, chelak, savol),
    devorJoy, shaklJoy,
    guruhlar, hisob, amallar, javoblar);
  s.area.replaceChildren(bog);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: bog.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
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
  fractionStrip: gameFractionStrip,
};
