// Mini-o'yinlar. Har biri (ctx) -> render -> tugagach ctx.finish(correct, total, extra).
// Bank schemalari castles_data.dart o'yin sahnalari bilan bir xil.
import { el, shuffle } from '../util.js';
import { ICON } from '../icons.js';

import { shell, checkBtn, flash } from './shell.js?v=4';
import { hud, buddy, sfx, floatText } from './hud.js?v=6';
import { gameSet } from './venn.js?v=9';
import { gameNumberOrder } from './tartib.js?v=14';
import { gameEquationGrid } from './jadval.js?v=5';
import { gameConveyor } from './saralash.js?v=10';

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
  const H = hud(3, 'shirinlik');
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
  const H = hud(3, 'bozor');
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

// ================= symmetry (Simmetriya — koshinpaz ustaxonasi) =================
// G'ishtin devor, tepada koshinli peshtoq; yog'och dastgohda naqsh paneli (n × n koshin). Ko'zgu-o'q (oltin chiziq),
// markaziy simmetriya (oltin nuqta), 90° burish (aylana strelka). Bank — tools/gen_simmetriya.py: toldir, qaysi, nechta.
const KOSHIN_RANG = ['', 'lojuvard', 'feruza', 'oltin'];
const KOSHIN_NOM = { 1: 'ko\'k', 2: 'feruza', 3: 'oltin' };
const OQ_NOM = { V: 'Tik o\'q', H: 'Yotiq o\'q', D: 'Diagonal ↘', D2: 'Diagonal ↙' };
const OQ_NOMI = { V: 'tik o\'q', H: 'yotiq o\'q', D: '↘ diagonal', D2: '↙ diagonal' };
function koshinAks([x, y], a, n) {
  return { V: [n - 1 - x, y], H: [x, n - 1 - y], D: [y, x], D2: [n - 1 - y, n - 1 - x], C: [n - 1 - x, n - 1 - y], R90: [n - 1 - y, x] }[a];
}
const koshinManba = ([x, y], a, n) => (a === 'R90' ? [y, n - 1 - x] : koshinAks([x, y], a, n));
// panel ustidagi chiziqlar (o'q, markaz, burish) — 0..n koordinatada
function oqSVG(n, oqlar, opts = {}) {
  const s = sv('svg', { viewBox: `-0.5 -0.5 ${n + 1} ${n + 1}`, class: 'koshin-oq', 'aria-hidden': 'true' });
  const chiz = (o, i) => {
    const [x1, y1, x2, y2] = { V: [n / 2, -0.35, n / 2, n + 0.35], H: [-0.35, n / 2, n + 0.35, n / 2], D: [-0.3, -0.3, n + 0.3, n + 0.3], D2: [n + 0.3, -0.3, -0.3, n + 0.3] }[o];
    const g = sv('g', { class: 'koshin-oq__g' + (opts.rang ? ' koshin-oq__g--' + (i + 1) : '') + (opts.xira ? ' xira' : '') });
    g.append(sv('line', { x1, y1, x2, y2, class: 'koshin-oq__chiziq' }));
    if (opts.raqam) { g.append(sv('circle', { cx: x1, cy: y1, r: 0.32, class: 'koshin-oq__nishon' }), sv('text', { x: x1, y: y1 + 0.13, 'text-anchor': 'middle', class: 'koshin-oq__raqam' }, opts.raqam[i])); }
    s.append(g);
  };
  oqlar.forEach((o, i) => {
    if (o === 'C') s.append(sv('circle', { cx: n / 2, cy: n / 2, r: 0.22, class: 'koshin-oq__markaz' }));
    else if (o === 'R90') s.append(sv('path', { d: `M${n / 2 - 0.9} ${n / 2 - 0.35} A0.95 0.95 0 1 1 ${n / 2 - 0.35} ${n / 2 + 0.88}`, class: 'koshin-oq__burish', 'marker-end': 'url(#koshin-strelka)' }),
      sv('defs', {}, '<marker id="koshin-strelka" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#ffd54a"/></marker>'),
      sv('circle', { cx: n / 2, cy: n / 2, r: 0.18, class: 'koshin-oq__markaz' }));
    else chiz(o, i);
  });
  return s;
}
function koshinSabab(t, xato) {
  if (t.tur === 'qaysi') return xato ? `${OQ_NOM[xato]} bo'ylab buklasak, kataklar ustma-ust tushmaydi. To'g'risi — ${OQ_NOMI[t.javob]}.` : `${OQ_NOM[t.javob]} bo'ylab buklasangiz, ikki yarmi ustma-ust tushadi.`;
  if (t.tur === 'nechta') {
    const bor = t.oqlar;
    const s = bor.length ? `Simmetriya o'qlari: ${bor.map(o => OQ_NOMI[o]).join(', ')} — ${bor.length} ta.` : "Hech bir chiziq bo'ylab buklaganda ustma-ust tushmaydi — 0 ta.";
    return (xato != null ? `${xato} emas. ` : '') + s;
  }
  const a = t.almash, n = t.n;
  if (!xato) return { V: "Tik o'q bo'ylab buklasangiz, ikki yarmi ustma-ust tushadi!", H: "Yotiq o'q bo'ylab buklasangiz, ikki yarmi ustma-ust tushadi!", D: 'Diagonal bo\'ylab buklasangiz, ikki qismi ustma-ust tushadi!', D2: 'Diagonal bo\'ylab buklasangiz, ikki qismi ustma-ust tushadi!', C: 'Markaz atrofida 180° bursangiz, naqsh o\'ziga ustma-ust tushadi!', R90: 'Naqsh markaz atrofida 90° burildi!' }[a];
  if (xato.tur === 'rang') return `Joyi to'g'ri, lekin rangi juftiniki bilan bir xil bo'lishi kerak: bu yerga ${KOSHIN_NOM[xato.c]}.`;
  if (xato.tur === 'ortiqcha') return "Ortiqcha koshin qo'yildi — berilgan naqshda uning jufti yo'q.";
  const [x, y] = koshinManba(xato.p, a, n);
  if (a === 'V') { const k = n / 2 - x; return `Chapdagi ${y + 1}-qatordagi koshin o'qdan ${k}-katak — jufti ham o'qdan o'ngda ${k}-katak, xuddi shu qatorda.`; }
  if (a === 'H') { const k = n / 2 - y; return `Yuqoridagi ${x + 1}-ustundagi koshin o'qdan ${k}-katak — jufti ham o'qdan pastda ${k}-katak, xuddi shu ustunda.`; }
  if (a === 'D') return `Diagonalga nisbatan: ${y + 1}-qator ${x + 1}-ustundagi koshinning jufti — ${x + 1}-qator ${y + 1}-ustunda (qator va ustun almashadi).`;
  if (a === 'D2') return "Diagonal bo'ylab buklang: har koshin diagonalning narigi tomonida, xuddi shu masofada tushadi.";
  if (a === 'C') return "Markaziy simmetriyada jufti markazning narigi tomonida, xuddi shu masofada: chap-yuqori → o'ng-past.";
  return "90° burganda: chap ustun tepaga o'tadi, tepa qatori o'ngga o'tadi (soat strelkasi bo'yicha).";
}

function gameSymmetry(ctx) {
  const all = ctx.bank.filter((t) => t.tur);
  const s = shell(ctx, '', 'mirror');
  const H = hud(3, 'koshin');
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0, ii = 0, items = [], xatolar = 0;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); }, { once: true });

  const savol = el('div', { class: 'koshin-savol' });
  const peshtoq = el('div', { class: 'koshin-peshtoq' }, savol);
  const panel = el('div', { class: 'koshin-panel' });
  const ramka = el('div', { class: 'koshin-ramka' }, panel);
  const bo = el('div', { class: 'koshin-boyoq' });
  const tayyor = el('button', { type: 'button', class: 'btn btn--accent koshin-tayyor', onclick: () => tekshir() }, 'Tayyor ✓');
  const tozala = el('button', { type: 'button', class: 'btn koshin-tozala', onclick: () => { if (!busy) { holat.clear(); chiz(); sfx.tap(); } } }, 'Tozalash');
  const amallar = el('div', { class: 'koshin-amallar' }, bo, el('div', { class: 'koshin-amallar__t' }, tozala, tayyor));
  const javoblar = el('div', { class: 'koshin-javoblar' });
  let t = null, busy = true, startedAt = 0, berilgan = new Map(), holat = new Map(), mo = 1, kataklar = [];
  const key = (x, y) => `${x},${y}`;

  function chiz() {
    kataklar.forEach((c) => {
      const k = c.dataset.k, b = berilgan.get(k), h = holat.get(k);
      c.className = 'koshin-k' + (b ? ` koshin-k--${KOSHIN_RANG[b]} berilgan` : h ? ` koshin-k--${KOSHIN_RANG[h]}` : '');
    });
  }
  function boyoqChiz() {
    bo.replaceChildren(...(t.ranglar > 1 ? Array.from({ length: t.ranglar }, (_, i) => el('button', { type: 'button', class: `koshin-moy koshin-k--${KOSHIN_RANG[i + 1]}` + (mo === i + 1 ? ' tanlangan' : ''),
      'aria-label': KOSHIN_NOM[i + 1], onclick: () => { mo = i + 1; boyoqChiz(); sfx.tap(); } }, el('small', {}, i + 1))) : []));
  }
  function joyla(tt) {
    t = tt; mo = 1;
    const n = t.n;
    const w = Math.min(46, Math.floor(((ramka.parentNode?.clientWidth || 340) - 44) / n));
    panel.style.setProperty('--n', n); panel.style.setProperty('--k', `${Math.max(28, w)}px`);
    berilgan = new Map(); holat = new Map();
    (t.berilgan || t.naqsh).forEach(([x, y, c]) => berilgan.set(key(x, y), c));
    kataklar = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const c = el('button', { type: 'button', class: 'koshin-k', 'data-k': key(x, y), 'aria-label': `${y + 1}-qator ${x + 1}-ustun` });
      kataklar.push(c);
    }
    panel.replaceChildren(...kataklar, t.tur === 'toldir' ? oqSVG(n, [t.almash]) : t.tur === 'qaysi' ? oqSVG(n, ['V', 'H', 'D', 'D2'], { rang: 1, raqam: ['1', '2', '3', '4'] }) : el('i'));
    chiz(); boyoqChiz();
    const toldir = t.tur === 'toldir';
    amallar.hidden = !toldir; javoblar.hidden = toldir;
    savol.textContent = toldir ? { V: "Naqshni tik o'qqa nisbatan simmetrik qilib to'ldiring", H: "Naqshni yotiq o'qqa nisbatan simmetrik qilib to'ldiring", D: "Naqshni diagonalga nisbatan simmetrik qilib to'ldiring", D2: "Naqshni diagonalga nisbatan simmetrik qilib to'ldiring", C: "Naqshni markazga nisbatan simmetrik qilib to'ldiring", R90: "Naqshni markaz atrofida 90° burib, yangi joyiga tering" }[t.almash]
      : t.tur === 'qaysi' ? "Qaysi chiziq bu naqshning simmetriya o'qi?" : "Bu naqshning nechta simmetriya o'qi bor?";
    if (t.tur === 'qaysi') javoblar.replaceChildren(...['V', 'H', 'D', 'D2'].map((o, i) => el('button', { type: 'button', class: 'koshin-jt koshin-jt--' + (i + 1), onclick: (e) => tanla(o, e.currentTarget) }, el('b', {}, i + 1), ' ', OQ_NOM[o])));
    if (t.tur === 'nechta') { t.oqlar = ['V', 'H', 'D', 'D2'].filter((o) => (t.naqsh).every(([x, y, c]) => { const [a, b] = koshinAks([x, y], o, n); return berilgan.get(key(a, b)) === c; })); javoblar.replaceChildren(...t.options.map((o, i) => el('button', { type: 'button', class: 'koshin-jt', onclick: (e) => tanla(o, e.currentTarget) }, el('b', {}, o), ' ta', el('small', { class: 'koshin-jt__key' }, i + 1)))); }
    peshtoq.classList.remove('yangi'); void peshtoq.offsetWidth; peshtoq.classList.add('yangi');
  }
  // bosish yoki barmoqni surib terish
  let rejim = null;
  const qoy = (c, r) => {
    const k = c.dataset.k;
    if (busy || !t || t.tur !== 'toldir' || berilgan.has(k)) return;
    const h = holat.get(k);
    if (r === null) r = h === mo ? 'ol' : 'qoy';
    if (r === 'ol') { if (!h) return r; holat.delete(k); } else { if (h === mo) return r; holat.set(k, mo); }
    chiz(); sfx.tap(); return r;
  };
  panel.addEventListener('pointerdown', (e) => { const c = e.target.closest('.koshin-k'); if (!c) return; e.preventDefault(); rejim = qoy(c, null); try { panel.setPointerCapture(e.pointerId); } catch { /* */ } });
  panel.addEventListener('pointermove', (e) => { if (!rejim) return; const c = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.koshin-k'); if (c && panel.contains(c)) qoy(c, rejim); });
  const tugat = () => { rejim = null; };
  panel.addEventListener('pointerup', tugat); panel.addEventListener('pointercancel', tugat);

  function yechimKo(belgila = true) {
    if (t.tur === 'toldir') {
      const kerak = new Map(t.kerak.map(([x, y, c]) => [key(x, y), c]));
      kataklar.forEach((c) => {
        const k = c.dataset.k;
        if (berilgan.has(k)) return;
        const h = holat.get(k), kk = kerak.get(k);
        if (belgila && h && h !== kk) c.classList.add('xato-k');
        if (belgila && kk && h !== kk) c.classList.add('yoq-k');
      });
      later(() => { holat = new Map(kerak); chiz(); kataklar.forEach((c) => { if (kerak.has(c.dataset.k)) c.classList.add('yondi-k'); }); }, belgila ? 900 : 0);
    } else {
      const oqlar = t.tur === 'qaysi' ? [t.javob] : t.oqlar;
      panel.querySelector('.koshin-oq')?.remove();
      if (oqlar.length) panel.append(oqSVG(t.n, oqlar));
    }
  }
  function natija(ok, at, sabab) {
    busy = true; onKey = null;
    total++; done++;
    times.push(performance.now() - startedAt);
    if (ok) {
      right++;
      const mlt = H.hit(); longest = Math.max(longest, H.st.combo);
      const fast = performance.now() - startedAt < 15000;
      sfx.ok(); ramka.classList.add('yondi');
      H.add(10 * mlt + (fast ? 5 : 0), at);
      if (fast && mlt < 2) floatText('⚡ Tez!', at, 'hud-float--tez');
      if (t.tur !== 'toldir') yechimKo(false);
      B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', sabab], 'ok');
      later(() => { ramka.classList.remove('yondi'); ii++; next(); }, 2400);
    } else {
      xatolar++; H.miss(); sfx.bad();
      const left = H.loseHeart();
      ramka.classList.remove('xato'); void ramka.offsetWidth; ramka.classList.add('xato');
      yechimKo();
      B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', sabab], 'bad');
      const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
      later(() => {
        s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
        onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
      }, 1000);
    }
  }
  function tekshir() {
    if (busy || t.tur !== 'toldir') return;
    if (!holat.size) return;
    const kerak = new Map(t.kerak.map(([x, y, c]) => [key(x, y), c]));
    let xato = null;
    for (const [k, c] of kerak) { const h = holat.get(k); if (h !== c) { xato = h ? { tur: 'rang', c } : { tur: 'yoq', p: k.split(',').map(Number) }; if (!h) break; } }
    if (!xato) for (const k of holat.keys()) if (!kerak.has(k)) { xato = { tur: 'ortiqcha' }; break; }
    natija(!xato, tayyor, koshinSabab(t, xato));
  }
  function tanla(o, btn) {
    if (busy) return;
    busy = true;
    const ok = o === t.javob;
    const opts = t.tur === 'qaysi' ? ['V', 'H', 'D', 'D2'] : t.options;
    [...javoblar.children].forEach((b, i) => { b.disabled = true; if (opts[i] === t.javob) b.classList.add('is-ok'); });
    btn.classList.add(ok ? 'is-ok' : 'is-bad');
    natija(ok, btn, koshinSabab(t, ok ? null : o));
  }
  const maslahat = () => (t.tur === 'toldir'
    ? (t.almash === 'R90' ? 'Har koshinni markaz atrofida chorak aylana bursangiz, qayerga tushadi?' : t.almash === 'C' ? 'Har koshin markazdan o\'tib, narigi tomonda xuddi shu masofaga tushadi.' : 'Har koshinning jufti o\'qdan xuddi shuncha uzoqda, narigi tomonda. Rangini ham tanlang.')
    : t.tur === 'qaysi' ? 'Naqshni xayolan buklang: qaysi chiziq bo\'ylab ikki yarmi ustma-ust tushadi?' : 'Tik, yotiq va ikki diagonalni tekshiring.');
  function next() {
    if (ii >= items.length) return endRound();
    busy = false;
    s.setProg(done, all.length);
    joyla(items[ii]);
    B.say([maslahat()], 'idle');
    startedAt = performance.now();
    onKey = (ev) => {
      if (t.tur === 'toldir') {
        if (ev.key === 'Enter') { ev.preventDefault(); tekshir(); }
        const n = +ev.key; if (n >= 1 && n <= t.ranglar) { mo = n; boyoqChiz(); }
        return;
      }
      const n = +ev.key; if (n >= 1 && n <= javoblar.children.length) { ev.preventDefault(); javoblar.children[n - 1].click(); }
    };
  }
  function autoRest() {
    onKey = null;
    B.say(['Yuraklar tugadi. Qolganlarini kuzating.'], 'think');
    const go = () => {
      if (ii >= items.length) return endRound();
      joyla(items[ii]); busy = true; amallar.hidden = true; total++; done++; s.setProg(done, all.length);
      later(() => {
        yechimKo(false);
        const opts = t.tur === 'qaysi' ? ['V', 'H', 'D', 'D2'] : t.options || [];
        [...javoblar.children].forEach((b, i) => { b.disabled = true; if (opts[i] === t.javob) b.classList.add('is-ok'); });
        B.say([koshinSabab(t)], 'think');
      }, 800);
      later(() => { ii++; go(); }, 3600);
    };
    later(go, 1000);
  }
  function endRound() {
    onKey = null; busy = true; amallar.hidden = true;
    const clean = xatolar === 0;
    if (clean) { H.add(30, ramka); sfx.win(); }
    s.setProg(done, all.length);
    const lastR = ri + 1 >= rounds.length;
    s.foot.replaceChildren(
      el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
        el('b', {}, clean ? 'Xatosiz! +30 bonus' : xatolar === 1 ? 'Bitta xato bilan — yaxshi!' : `${xatolar} ta xato — keyingisida diqqat bilan!`),
        el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
          ri++;
          if (ri >= rounds.length) {
            const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
          } else { s.foot.replaceChildren(); round(); }
        } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
  }
  function round() { items = rounds[ri]; ii = 0; xatolar = 0; H.resetHearts(); next(); }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const sahna = el('div', { class: 'sahna sahna--koshin' },
    H.node, B.node, peshtoq, el('div', { class: 'koshin-dastgoh' }, ramka), amallar, javoblar);
  s.area.replaceChildren(sahna);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
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
  const H = hud(3, 'origami');
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
  const H = hud(3, 'bog');
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

// ================= coordinatePath (Koordinata — xazina oroli xaritasi) =================
// Eski pergament xarita: orol, to'r, o'qlar. Topshiriq (`tur`, bank — tools/gen_koord.py):
// qaz (nuqtani bosib xazina qazish), top (buyum koordinatasini tanlash), yol (kapitan yo'li — nuqtalarni ketma-ket),
// yur (Robi qadamlari — qayerga keladi), masofa (bir qatordagi ikki buyum orasi), nur (koordinata nuri, qayiq), chorak (7-sinf).
const sn = (n) => String(n).replace('-', '−');
const kf = (p) => `(${sn(p[0])}; ${sn(p[1])})`;
const YON_UZ = { o: ["o'ngga", 1, 0, '→'], ch: ['chapga', -1, 0, '←'], yu: ['yuqoriga', 0, 1, '↑'], p: ['pastga', 0, -1, '↓'] };
const BUYUM_UZ = { sandiq: 'Sandiq', palma: 'Palma', bayroq: 'Bayroq', langar: 'Langar', mayoq: 'Mayoq', toshbaqa: 'Toshbaqa' };
const sv = (tag, attrs = {}, html) => {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (html != null) n.innerHTML = html;
  return n;
};
// buyumlar: markazi (0; 0), o'lchami ~40 birlik
const BUYUM_SVG = {
  sandiq: `<path d="M-16 -5 Q0 -21 16 -5Z" fill="#a8703a" stroke="#4a2c10" stroke-width="1.6"/><rect x="-16" y="-6" width="32" height="18" rx="2" fill="#8b5a2b" stroke="#4a2c10" stroke-width="1.6"/>
    <rect x="-16" y="-7" width="32" height="3" fill="#e0ad45"/><rect x="-10" y="-14" width="3.4" height="26" fill="#e0ad45"/><rect x="6.6" y="-14" width="3.4" height="26" fill="#e0ad45"/><rect x="-3" y="-4" width="6" height="7" rx="1" fill="#ffd54a" stroke="#7a5a10"/>`,
  ochiq: `<circle r="22" fill="#ffe680" opacity=".5"/><path d="M-15 -6 L-12 -24 L12 -24 L15 -6Z" fill="#5e3a1a" stroke="#4a2c10" stroke-width="1.6"/>
    <g fill="#ffd54a" stroke="#b8860b" stroke-width="1"><circle cx="-8" cy="-8" r="4.5"/><circle cx="1" cy="-11" r="4.5"/><circle cx="9" cy="-8" r="4.5"/><circle cx="-3" cy="-5" r="4.5"/><circle cx="5" cy="-4" r="4.5"/></g>
    <rect x="-16" y="-4" width="32" height="16" rx="2" fill="#8b5a2b" stroke="#4a2c10" stroke-width="1.6"/><rect x="-10" y="-4" width="3.4" height="16" fill="#e0ad45"/><rect x="6.6" y="-4" width="3.4" height="16" fill="#e0ad45"/>`,
  palma: `<ellipse cx="2" cy="15" rx="11" ry="3" fill="#c9a463" opacity=".7"/><path d="M2 15 Q-3 2 4 -11" stroke="#7a4b22" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g fill="#2e9e4f" stroke="#1b6b33" stroke-width="1"><path d="M4 -11 Q-8 -21 -19 -10 Q-8 -15 4 -11Z"/><path d="M4 -11 Q16 -21 26 -9 Q15 -15 4 -11Z"/><path d="M4 -11 Q-2 -26 -12 -24 Q-3 -20 4 -11Z"/><path d="M4 -11 Q12 -27 21 -21 Q11 -20 4 -11Z"/></g>
    <circle cx="1" cy="-9" r="2.6" fill="#6b3e16"/><circle cx="6" cy="-8" r="2.6" fill="#6b3e16"/>`,
  bayroq: `<ellipse cx="-5" cy="15" rx="9" ry="3" fill="#c9a463" opacity=".7"/><line x1="-5" y1="15" x2="-5" y2="-17" stroke="#5a3a17" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-5 -17 Q5 -19 15 -13 Q5 -9 -5 -5Z" fill="#d62f2f" stroke="#7a1414" stroke-width="1"/><circle cx="3" cy="-11" r="2.4" fill="#fff"/>`,
  langar: `<g fill="none" stroke="#2f4256" stroke-width="3.2" stroke-linecap="round"><circle cx="0" cy="-13" r="3.6"/><line x1="0" y1="-9" x2="0" y2="13"/><line x1="-8" y1="-4" x2="8" y2="-4"/>
    <path d="M-13 3 Q-11 14 0 13 Q11 14 13 3"/></g><path d="M-13 3 l-3 4 l5 0Z M13 3 l3 4 l-5 0Z" fill="#2f4256"/>`,
  mayoq: `<path d="M-8 15 L8 15 L5 -9 L-5 -9Z" fill="#fff" stroke="#5b5b5b" stroke-width="1.4"/><path d="M-7.3 9 L7.3 9 L6.5 3 L-6.5 3Z M-6 -3 L6 -3 L5.4 -8 L-5.4 -8Z" fill="#d62f2f"/>
    <rect x="-5" y="-15" width="10" height="6" fill="#ffe36b" stroke="#5b5b5b" stroke-width="1.2"/><path d="M-7 -15 L0 -21 L7 -15Z" fill="#d62f2f" stroke="#7a1414" stroke-width="1"/>`,
  toshbaqa: `<circle cx="15" cy="1" r="4.5" fill="#8bc34a" stroke="#4e7d1e" stroke-width="1.2"/><circle cx="16.5" cy="0" r="1" fill="#1f2a1a"/>
    <g fill="#8bc34a" stroke="#4e7d1e" stroke-width="1.2"><ellipse cx="-9" cy="8" rx="4" ry="2.6"/><ellipse cx="9" cy="8" rx="4" ry="2.6"/><ellipse cx="-9" cy="-7" rx="4" ry="2.6"/><ellipse cx="9" cy="-7" rx="4" ry="2.6"/></g>
    <ellipse rx="13" ry="10" fill="#4caf50" stroke="#2e7d32" stroke-width="1.6"/><path d="M-5 -4 L5 -4 L7 2 L0 6 L-7 2Z" fill="none" stroke="#2e7d32" stroke-width="1.3"/>`,
  kema: `<path d="M0 -20 L0 4" stroke="#5a3a17" stroke-width="2"/><path d="M1 -19 Q13 -8 1 1Z" fill="#fff8e6" stroke="#8a6a3a" stroke-width="1"/><path d="M-1 -16 Q-10 -8 -1 -1Z" fill="#fff8e6" stroke="#8a6a3a" stroke-width="1"/>
    <path d="M0 -20 L8 -18 L0 -16Z" fill="#d62f2f"/><path d="M-17 3 L17 3 L11 12 L-11 12Z" fill="#8b5a2b" stroke="#4a2c10" stroke-width="1.5"/>`,
  robi: `<line x1="0" y1="-12" x2="0" y2="-18" stroke="#2c3e66" stroke-width="2"/><circle cx="0" cy="-19" r="3" fill="#ff5a5a"/>
    <rect x="-12" y="-12" width="24" height="20" rx="7" fill="#4aa3ff" stroke="#1d4fb8" stroke-width="1.8"/><rect x="-8" y="-7" width="16" height="9" rx="4" fill="#e9f5ff"/>
    <circle cx="-3.5" cy="-2.5" r="2" fill="#1d2a4a"/><circle cx="3.5" cy="-2.5" r="2" fill="#1d2a4a"/><rect x="-7" y="8" width="5" height="5" rx="2" fill="#1d4fb8"/><rect x="2" y="8" width="5" height="5" rx="2" fill="#1d4fb8"/>`,
};
// deterministik «tasodif» — har topshiriqda orol shakli o'zgarmas
const urug = (str) => { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; };

function koordSabab(t, b) {
  const yo = (p) => {
    const [x, y] = p;
    const xs = x > 0 ? `o'ngga ${x}` : x < 0 ? `chapga ${-x}` : 'o\'ngga 0', ys = y > 0 ? `yuqoriga ${y}` : y < 0 ? `pastga ${-y}` : 'yuqoriga 0';
    return `${xs}, ${ys}`;
  };
  const tur = t.tur;
  if (tur === 'qaz' || tur === 'top') {
    const p = t.nuqta;
    if (b && b[0] === p[1] && b[1] === p[0]) return `${kf(b)} emas — sonlar o'rni almashdi. Birinchi son — x (${t.oraliq[0] < 0 ? "o'ngga yoki chapga" : "o'ngga"}), ikkinchisi — y (${t.oraliq[0] < 0 ? 'yuqoriga yoki pastga' : 'yuqoriga'}).`;
    return `${b ? `${kf(b)} emas. ` : ''}${t.oraliq[0] < 0 ? 'O nuqtadan' : '0 dan'} ${yo(p)} → ${kf(p)}.`;
  }
  if (tur === 'yur') {
    let [x, y] = t.nuqta; const h = [];
    for (const [d, n] of t.qadam) {
      const [nom, dx, dy] = YON_UZ[d];
      if (dx) { const x2 = x + dx * n; h.push(`${nom} ${n}: x = ${sn(x)} ${dx > 0 ? '+' : '−'} ${n} = ${sn(x2)}`); x = x2; }
      else { const y2 = y + dy * n; h.push(`${nom} ${n}: y = ${sn(y)} ${dy > 0 ? '+' : '−'} ${n} = ${sn(y2)}`); y = y2; }
    }
    const q = h.join('; ');
    return `${b ? `${kf(b)} emas. ` : ''}${q[0].toUpperCase()}${q.slice(1)} → ${kf(t.javob)}.`;
  }
  if (tur === 'masofa') {
    const [a, c] = [t.a, t.b], qator = a[1] === c[1], i = qator ? 0 : 1;
    const katta = Math.max(a[i], c[i]), kichik = Math.min(a[i], c[i]);
    return `Ikkalasi bir ${qator ? `qatorda (y = ${sn(a[1])})` : `ustunda (x = ${sn(a[0])})`}: ${sn(katta)} − ${sn(kichik)} = ${t.javob} birlik.`;
  }
  if (tur === 'nur') {
    if (t.qadam === 1) return `${b != null ? `${b} emas. ` : ''}Har bo'lak — 1 birlik: qayiq ${t.javob} da.`;
    return `${b === t.k ? `${b} emas — bu bo'laklar soni. ` : b != null ? `${b} emas. ` : ''}Bir bo'lak — ${t.qadam} birlik. Qayiq ${t.k}-bo'lakda: ${t.k} · ${t.qadam} = ${t.javob}.`;
  }
  if (tur === 'chorak') {
    const [x, y] = t.nuqta, ish = (v) => (v > 0 ? 'musbat' : 'manfiy');
    if (x === 0) return `x = 0 — nuqta Oy o'qida yotadi.`;
    if (y === 0) return `y = 0 — nuqta Ox o'qida yotadi.`;
    return `x = ${sn(x)} ${ish(x)}, y = ${sn(y)} ${ish(y)} → ${t.javob}.`;
  }
  return '';
}

// xarita (koordinata to'ri) — t.oraliq bo'yicha
function xarita(t) {
  const [lo, hi] = t.oraliq, n = hi - lo, C = 44, P = 38, W = P * 2 + n * C, H = W;
  const X = (x) => P + (x - lo) * C, Y = (y) => P + (hi - y) * C;
  const rnd = urug(t.id || 'orol');
  const root = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'orol-svg' + (n >= 10 ? ' orol-svg--katta' : ''), role: 'img', 'aria-label': 'Xazina xaritasi' });
  // pergament: yirtiq chetlar
  const chet = [];
  const yon = (x1, y1, x2, y2, k) => { for (let i = 0; i < k; i++) { const u = i / k; chet.push([x1 + (x2 - x1) * u + (rnd() - 0.5) * 4, y1 + (y2 - y1) * u + (rnd() - 0.5) * 4]); } };
  yon(3, 3, W - 3, 3, 22); yon(W - 3, 3, W - 3, H - 3, 22); yon(W - 3, H - 3, 3, H - 3, 22); yon(3, H - 3, 3, 3, 22);
  root.append(sv('defs', {}, `<radialGradient id="orol-perg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#fbf0d2"/><stop offset=".7" stop-color="#efd9a4"/><stop offset="1" stop-color="#c99f5c"/></radialGradient>
    <radialGradient id="orol-qum" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#f6e2a8"/><stop offset="1" stop-color="#e8c983"/></radialGradient>
    <marker id="orol-strelka" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="#5a3a17"/></marker>`));
  const chetP = chet.map(p => p.join(',')).join(' ');
  root.append(sv('clipPath', { id: 'orol-kesim' }, `<polygon points="${chetP}"/>`));
  root.append(sv('polygon', { points: chetP, fill: 'url(#orol-perg)', stroke: '#8a6326', 'stroke-width': 2 }));
  // orol: to'r markazida notekis qirg'oq
  const cx = (X(lo) + X(hi)) / 2, cy = (Y(lo) + Y(hi)) / 2, R = (n * C) / 2;
  const f1 = rnd() * 6, f2 = rnd() * 6;
  const blob = (k) => Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2, r = R * k * (1 + 0.07 * Math.sin(a * 3 + f1) + 0.05 * Math.sin(a * 5 + f2));
    return `${(cx + Math.cos(a) * r * 1.08).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
  const orol = sv('g', { 'clip-path': 'url(#orol-kesim)' });
  orol.append(sv('polygon', { points: blob(1.06), fill: 'none', stroke: '#8cc7d4', 'stroke-width': 12, opacity: 0.55, 'stroke-linejoin': 'round' }),
    sv('polygon', { points: blob(1.06), fill: 'url(#orol-qum)', stroke: '#b98a3e', 'stroke-width': 2, 'stroke-linejoin': 'round' }),
    sv('polygon', { points: blob(0.72), fill: '#a9c97a', opacity: 0.45, stroke: 'none' }));
  root.append(orol);
  // to'lqinlar (dengiz) — chetlarda
  const tol = sv('g', { class: 'orol-tolqin' });
  for (let i = 0; i < 14; i++) {
    const a = rnd() * Math.PI * 2, r = R * (1.3 + rnd() * 0.25), x = cx + Math.cos(a) * r * 1.05, y = cy + Math.sin(a) * r;
    if (x < 14 || x > W - 24 || y < 14 || y > H - 14) continue;
    tol.append(sv('path', { d: `M${x} ${y} q4 -4 8 0 q4 4 8 0` }));
  }
  root.append(tol);
  // to'r va o'qlar
  const tor = sv('g', { class: 'orol-tor' });
  for (let i = lo; i <= hi; i++) {
    tor.append(sv('line', { x1: X(i), y1: Y(lo), x2: X(i), y2: Y(hi) }), sv('line', { x1: X(lo), y1: Y(i), x2: X(hi), y2: Y(i) }));
  }
  root.append(tor);
  const oq = sv('g', { class: 'orol-oq' });
  oq.append(sv('line', { x1: X(lo) - (lo < 0 ? 10 : 0), y1: Y(0), x2: X(hi) + 22, y2: Y(0), 'marker-end': 'url(#orol-strelka)' }),
    sv('line', { x1: X(0), y1: Y(lo) + (lo < 0 ? 10 : 0), x2: X(0), y2: Y(hi) - 22, 'marker-end': 'url(#orol-strelka)' }));
  const yoz = sv('g', { class: 'orol-son' });
  for (let i = lo; i <= hi; i++) {
    if (i === 0 && lo < 0) continue;
    yoz.append(sv('text', { x: X(i), y: Y(0) + 16, 'text-anchor': 'middle' }, sn(i)));
    if (i !== 0) yoz.append(sv('text', { x: X(0) - 8, y: Y(i) + 4, 'text-anchor': 'end' }, sn(i)));
  }
  if (lo < 0) yoz.append(sv('text', { x: X(0) - 7, y: Y(0) + 15, 'text-anchor': 'end' }, 'O'));
  yoz.append(sv('text', { x: X(hi) + 20, y: Y(0) - 8, class: 'orol-harf', 'text-anchor': 'middle' }, 'x'),
    sv('text', { x: X(0) + 11, y: Y(hi) - 14, class: 'orol-harf' }, 'y'));
  root.append(oq, yoz);
  // kompas
  root.append(sv('g', { class: 'orol-kompas', transform: `translate(${W - 26} 24)` },
    '<circle r="13" fill="none" stroke="#8a6326" stroke-width="1.2"/><path d="M0 -15 L3.5 0 L0 15 L-3.5 0Z" fill="#8a6326"/><path d="M-15 0 L0 3.5 L15 0 L0 -3.5Z" fill="#b08b4f"/><path d="M0 -15 L3.5 0 L-3.5 0Z" fill="#c0392b"/>'));
  const qavat = {};
  for (const k of ['chorak', 'yordam', 'yol', 'buyum', 'belgi', 'hit']) { qavat[k] = sv('g', { class: 'orol-q-' + k }); root.append(qavat[k]); }
  return { root, X, Y, C, W, H, lo, hi, qavat };
}
const buyumQoy = (m, nom, p, kat = 1) => {
  const g = sv('g', { class: 'orol-buyum orol-buyum--' + nom, transform: `translate(${m.X(p[0])} ${m.Y(p[1])}) scale(${(m.C / 44) * kat})` }, BUYUM_SVG[nom]);
  m.qavat.buyum.append(g);
  return g;
};
const nuqtaQoy = (m, p, cls = 'orol-nuqta') => m.qavat.belgi.append(sv('circle', { cx: m.X(p[0]), cy: m.Y(p[1]), r: 4.5, class: cls }));
// 0 dan x bo'ylab, keyin y bo'ylab — yo'l-yo'riq strelkalari
function yordamChiz(m, p, bosh = [0, 0]) {
  const g = m.qavat.yordam;
  g.replaceChildren();
  const [x0, y0] = bosh, [x, y] = p;
  if (x !== x0) g.append(sv('line', { x1: m.X(x0), y1: m.Y(y0), x2: m.X(x), y2: m.Y(y0), class: 'orol-yordam-x', 'marker-end': 'url(#orol-strelka)' }));
  if (y !== y0) g.append(sv('line', { x1: m.X(x), y1: m.Y(y0), x2: m.X(x), y2: m.Y(y), class: 'orol-yordam-y', 'marker-end': 'url(#orol-strelka)' }));
}
function xatoQazish(m, b) {
  const g = sv('g', { class: 'orol-chuqur', transform: `translate(${m.X(b[0])} ${m.Y(b[1])})` },
    `<ellipse rx="10" ry="4.5" fill="#5e3f22" opacity=".85"/><circle cx="-12" cy="-3" r="1.6" fill="#7a5530"/><circle cx="12" cy="-2" r="1.4" fill="#7a5530"/>`);
  g.append(sv('text', { y: -9, 'text-anchor': 'middle', class: 'orol-chuqur__y' }, kf(b)));
  m.qavat.belgi.append(g);
}
// koordinata nuri (bir o'q) — qayiq k-belgida, bir bo'lak = qadam birlik
function nurSVG(t) {
  const W = 440, H = 170, P = 30, C = (W - 2 * P - 20) / t.belgi, Yo = 112;
  const root = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'orol-svg orol-svg--nur', role: 'img', 'aria-label': 'Koordinata nuri' });
  root.append(sv('defs', {}, `<radialGradient id="orol-perg2" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#fbf0d2"/><stop offset=".75" stop-color="#efd9a4"/><stop offset="1" stop-color="#c99f5c"/></radialGradient>
    <marker id="orol-strelka2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#5a3a17"/></marker>`));
  root.append(sv('rect', { x: 3, y: 3, width: W - 6, height: H - 6, rx: 10, fill: 'url(#orol-perg2)', stroke: '#8a6326', 'stroke-width': 2 }));
  root.append(sv('path', { d: `M14 ${Yo - 6} Q${W / 2} ${Yo - 20} ${W - 14} ${Yo - 6} L${W - 14} ${Yo + 22} Q${W / 2} ${Yo + 30} 14 ${Yo + 22}Z`, fill: '#bfe2ea', opacity: 0.55 }));
  root.append(sv('line', { x1: P, y1: Yo, x2: W - P + 8, y2: Yo, class: 'orol-nur', 'marker-end': 'url(#orol-strelka2)' }));
  const yozuvlar = sv('g', { class: 'orol-son' });
  for (let i = 0; i <= t.belgi; i++) {
    const x = P + i * C;
    root.append(sv('line', { x1: x, y1: Yo - 7, x2: x, y2: Yo + 7, class: 'orol-nur-belgi' }));
    yozuvlar.append(sv('text', { x, y: Yo + 24, 'text-anchor': 'middle', class: i <= 1 ? '' : 'orol-son--yashirin', 'data-i': i }, i * t.qadam));
  }
  root.append(sv('text', { x: P - 4, y: Yo - 12, class: 'orol-harf', 'text-anchor': 'middle' }, 'O'), yozuvlar);
  const qavs = sv('g', { class: 'orol-qavs' });
  root.append(qavs);
  const kema = sv('g', { class: 'orol-buyum', transform: `translate(${P + t.k * C} ${Yo - 22}) scale(1.15)` }, BUYUM_SVG.kema);
  root.append(kema, sv('circle', { cx: P + t.k * C, cy: Yo, r: 4.5, class: 'orol-nuqta' }));
  return {
    root,
    ochish() {
      yozuvlar.querySelectorAll('.orol-son--yashirin').forEach((n) => n.classList.remove('orol-son--yashirin'));
      for (let i = 0; i < t.k; i++) qavs.append(sv('path', { d: `M${P + i * C + 3} ${Yo - 9} q${C / 2 - 3} -12 ${C - 6} 0`, class: 'orol-qavs-yoy' }));
    },
  };
}

function gameCoordinate(ctx) {
  const all = [...ctx.bank].map((t) => (t.tur ? t : { ...t, tur: 'yol', oraliq: [0, t.gridSize], points: t.points.map((q) => [q.x, q.y]) }));
  const s = shell(ctx, '', 'axes');
  const H = hud(3, 'orol');
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

  const savol = el('div', { class: 'orol-savol' });
  const chiplar = el('div', { class: 'orol-chiplar' });
  const taxta = el('div', { class: 'orol-taxta' }, savol, chiplar);
  const xaritaJoy = el('div', { class: 'orol-xarita' });
  const javoblar = el('div', { class: 'orol-javoblar' });
  let t = null, m = null, busy = true, startedAt = 0, xatoBor = false, k = 0, yolSabab = '';

  const chip = (matn, cls = '') => el('span', { class: 'orol-chip ' + cls }, matn);
  function chiz(tt) {
    t = tt; k = 0; xatoBor = false;
    javoblar.replaceChildren(); javoblar.hidden = true; chiplar.replaceChildren();
    if (t.tur === 'nur') { m = nurSVG(t); xaritaJoy.replaceChildren(m.root); }
    else {
      m = xarita(t); xaritaJoy.replaceChildren(m.root);
      for (let x = m.lo; x <= m.hi; x++) for (let y = m.lo; y <= m.hi; y++) {
        const h = sv('circle', { cx: m.X(x), cy: m.Y(y), r: m.C * 0.46, class: 'orol-hit' });
        h.addEventListener('click', () => bos([x, y], h));
        m.qavat.hit.append(h);
      }
    }
    const tur = t.tur;
    if (tur === 'qaz') { savol.textContent = 'Xazinani qazing:'; chiplar.append(chip(kf(t.nuqta), 'orol-chip--katta')); }
    else if (tur === 'top') { savol.textContent = `${BUYUM_UZ[t.buyum]} qaysi nuqtada?`; buyumQoy(m, t.buyum, t.nuqta); nuqtaQoy(m, t.nuqta); }
    else if (tur === 'yol') {
      savol.textContent = "Kapitan yo'li — nuqtalarni ketma-ket bosing:";
      chiplar.append(...t.points.map((p, i) => chip(kf(p), i === 0 ? 'now' : '')));
    } else if (tur === 'yur') {
      savol.textContent = `Robi ${kf(t.nuqta)} da. Qayerga boradi?`;
      chiplar.append(...t.qadam.map(([d, n]) => chip(`${YON_UZ[d][3]} ${YON_UZ[d][0]} ${n}`)));
      m.robi = buyumQoy(m, 'robi', t.nuqta, 0.95); nuqtaQoy(m, t.nuqta);
    } else if (tur === 'masofa') {
      savol.textContent = `${BUYUM_UZ[t.buyumlar[0]]} va ${BUYUM_UZ[t.buyumlar[1]].toLowerCase()} orasi necha birlik?`;
      buyumQoy(m, t.buyumlar[0], t.a); buyumQoy(m, t.buyumlar[1], t.b); nuqtaQoy(m, t.a); nuqtaQoy(m, t.b);
    } else if (tur === 'nur') savol.textContent = 'Qayiq qaysi songa to\'xtadi?';
    else if (tur === 'chorak') { savol.textContent = 'Bayroq qayerda turibdi?'; buyumQoy(m, 'bayroq', t.nuqta); nuqtaQoy(m, t.nuqta); }
    if (t.options) {
      javoblar.hidden = false;
      javoblar.replaceChildren(...t.options.map((o, i) => el('button', { type: 'button', class: 'orol-jt', onclick: (e) => tanla(o, e.currentTarget) }, String(o), el('small', { class: 'orol-jt__key' }, i + 1))));
    }
    xaritaJoy.classList.toggle('orol-xarita--bosiladi', !t.options);
    taxta.classList.remove('yangi'); void taxta.offsetWidth; taxta.classList.add('yangi');
  }
  const manfiy = () => t.oraliq[0] < 0;
  const maslahat = () => ({
    qaz: manfiy() ? 'Birinchi son — x: manfiy bo\'lsa chapga. Ikkinchisi — y: manfiy bo\'lsa pastga.' : 'Birinchi son — o\'ngga (x), ikkinchisi — yuqoriga (y). 0 dan boshlang.',
    top: 'Buyumdan pastga tushib x ni, chapga qarab y ni o\'qing.',
    yol: 'Har nuqta: avval x bo\'ylab, keyin y bo\'ylab.',
    yur: 'O\'ngga yursa x oshadi, chapga — kamayadi; yuqoriga yursa y oshadi, pastga — kamayadi.',
    masofa: 'Bir qatorda turishibdi — kataklarni sanang yoki kattasidan kichigini ayiring.',
    nur: 'Avval bitta bo\'lak necha birlik ekanini toping.',
    chorak: 'x va y ning ishorasiga qarang: musbatmi, manfiymi, yoki 0 mi?',
  })[t.tur];

  function natija(ok, at, sabab, yurakOlingan) {
    busy = true; onKey = null;
    total++; done++;
    times.push(performance.now() - startedAt);
    if (ok) {
      right++;
      const mlt = H.hit(); longest = Math.max(longest, H.st.combo);
      const fast = performance.now() - startedAt < 9000;
      sfx.ok(); xaritaJoy.classList.add('yondi');
      H.add(10 * mlt + (fast ? 5 : 0), at);
      if (fast && mlt < 2) floatText('⚡ Tez!', at, 'hud-float--tez');
      B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', sabab], 'ok');
      later(() => { xaritaJoy.classList.remove('yondi'); ii++; next(); }, 2600);
    } else {
      H.miss();
      const left = yurakOlingan ? H.st.hearts : (sfx.bad(), H.loseHeart());
      xaritaJoy.classList.remove('xato'); void xaritaJoy.offsetWidth; xaritaJoy.classList.add('xato');
      B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', sabab], 'bad');
      const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
      later(() => {
        s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
        onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
      }, 900);
    }
  }
  // to'g'ri javobni xaritada ko'rsatish (javobdan keyin va yuraklar tugaganda)
  function yechimKo() {
    const tur = t.tur;
    if (tur === 'qaz') { yordamChiz(m, t.nuqta); m.qavat.belgi.append(sv('path', { d: `M${m.X(t.nuqta[0]) - 7} ${m.Y(t.nuqta[1]) - 7} l14 14 m0 -14 l-14 14`, class: 'orol-x' })); later(() => buyumQoy(m, 'ochiq', t.nuqta).classList.add('chiqdi'), 350); }
    else if (tur === 'top' || tur === 'chorak') yordamChiz(m, t.nuqta);
    else if (tur === 'yur') {
      const yol = [t.nuqta]; let [x, y] = t.nuqta;
      for (const [d, n] of t.qadam) { x += YON_UZ[d][1] * n; y += YON_UZ[d][2] * n; yol.push([x, y]); }
      m.qavat.yol.append(sv('polyline', { points: yol.map((p) => `${m.X(p[0])},${m.Y(p[1])}`).join(' '), class: 'orol-yol' }));
      nuqtaQoy(m, t.javob);
      if (m.robi) {
        const sc = m.C / 44 * 0.95;
        m.robi.style.transform = `translate(${m.X(t.nuqta[0])}px, ${m.Y(t.nuqta[1])}px) scale(${sc})`;
        m.robi.style.transition = 'transform .5s ease-in-out';
        yol.slice(1).forEach((p, i) => later(() => { m.robi.style.transform = `translate(${m.X(p[0])}px, ${m.Y(p[1])}px) scale(${sc})`; }, 150 + i * 550));
      }
    } else if (tur === 'masofa') {
      const [a, b] = [t.a, t.b], qator = a[1] === b[1];
      const [i0, i1] = qator ? [Math.min(a[0], b[0]), Math.max(a[0], b[0])] : [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
      for (let i = i0; i < i1; i++) {
        const p1 = qator ? [i, a[1]] : [a[0], i], p2 = qator ? [i + 1, a[1]] : [a[0], i + 1];
        const g = sv('g', { class: 'orol-olchov' });
        g.append(sv('line', { x1: m.X(p1[0]), y1: m.Y(p1[1]), x2: m.X(p2[0]), y2: m.Y(p2[1]) }));
        const mx = (m.X(p1[0]) + m.X(p2[0])) / 2 + (qator ? 0 : 12), my = (m.Y(p1[1]) + m.Y(p2[1])) / 2 + (qator ? 16 : 4);
        g.append(sv('text', { x: mx, y: my, 'text-anchor': 'middle' }, i - i0 + 1));
        later(() => m.qavat.yordam.append(g), (i - i0) * 160);
      }
    } else if (tur === 'nur') m.ochish();
    if (tur === 'chorak') {
      const [lo, hi] = t.oraliq, g = m.qavat.chorak;
      [['I', 1, 1], ['II', -1, 1], ['III', -1, -1], ['IV', 1, -1]].forEach(([r, sx, sy]) => {
        const x1 = m.X(0), x2 = m.X(sx > 0 ? hi : lo), y1 = m.Y(0), y2 = m.Y(sy > 0 ? hi : lo);
        const on = t.javob === `${r} chorak`;
        g.append(sv('rect', { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1), class: 'orol-chorak' + (on ? ' on' : '') }),
          sv('text', { x: (x1 + x2) / 2, y: (y1 + y2) / 2 + 8, 'text-anchor': 'middle', class: 'orol-chorak__y' + (on ? ' on' : '') }, r));
      });
    }
  }
  function yolChiz(n) {
    const pts = t.points.slice(0, n);
    m.qavat.yol.replaceChildren(sv('polyline', { points: pts.map((p) => `${m.X(p[0])},${m.Y(p[1])}`).join(' '), class: 'orol-yol' }));
    m.qavat.belgi.replaceChildren(); pts.forEach((p) => nuqtaQoy(m, p));
    [...chiplar.children].forEach((c, i) => { c.classList.toggle('done', i < n); c.classList.toggle('now', i === n); });
  }
  function yolTugadi(at) {
    const end = t.points[t.points.length - 1];
    if (t.shakl) m.qavat.yol.prepend(sv('polygon', { points: t.points.map((p) => `${m.X(p[0])},${m.Y(p[1])}`).join(' '), class: 'orol-shakl' }));
    later(() => buyumQoy(m, 'ochiq', end, 0.85).classList.add('chiqdi'), 200);
    const gap = xatoBor ? yolSabab : t.shakl ? `Yo'l tayyor — ${t.shakl} chiqdi!` : "Yo'l tayyor — xazinaga yetib keldingiz!";
    natija(!xatoBor, at, gap, true);
  }
  function bos(p, h) {
    if (busy || !t || t.options) return;
    const tur = t.tur, teng = (a, b) => a[0] === b[0] && a[1] === b[1];
    if (tur === 'yol') {
      const want = t.points[k];
      if (teng(p, want)) { sfx.tap(); k++; yolChiz(k); if (k === t.points.length) { busy = true; yolTugadi(h); } return; }
      if (k > 0 && teng(p, t.points[k - 1])) return;
      busy = true; sfx.bad(); H.miss();
      if (!xatoBor) { xatoBor = true; if (H.loseHeart() === 0) { /* yurak tugadi — yo'l baribir oxirigacha ko'rsatiladi */ } }
      xatoQazish(m, p);
      yolSabab = koordSabab({ tur: 'qaz', nuqta: want, oraliq: t.oraliq }, p);
      B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', yolSabab], 'bad');
      later(() => { m.qavat.belgi.querySelectorAll('.orol-chuqur').forEach((n) => n.remove()); k++; yolChiz(k); if (k === t.points.length) yolTugadi(h); else busy = false; }, 1600);
      return;
    }
    const javob = tur === 'yur' ? t.javob : t.nuqta, ok = teng(p, javob);
    busy = true;
    if (!ok) xatoQazish(m, p);
    yechimKo();
    natija(ok, h, koordSabab(t, ok ? null : p));
  }
  function tanla(o, btn) {
    if (busy) return;
    busy = true;
    const ok = o === t.javob;
    [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
    btn.classList.add(ok ? 'is-ok' : 'is-bad');
    yechimKo();
    const bo = t.tur === 'top' && !ok ? o.replace(/−/g, '-').slice(1, -1).split('; ').map(Number) : t.tur === 'nur' && !ok ? o : null;
    natija(ok, btn, ok ? koordSabab(t) : t.tur === 'top' ? koordSabab(t, bo) : t.tur === 'nur' ? koordSabab(t, bo) : `${o} emas. ${koordSabab(t)}`);
  }

  let ii = 0, items = [];
  function next() {
    if (ii >= items.length) return endRound();
    busy = false;
    s.setProg(done, all.length);
    chiz(items[ii]);
    B.say([maslahat()], 'idle');
    startedAt = performance.now();
    onKey = (ev) => {
      const n = +ev.key; if (!javoblar.hidden && n >= 1 && n <= javoblar.children.length) { ev.preventDefault(); javoblar.children[n - 1].click(); }
    };
  }
  function autoRest() {
    onKey = null;
    B.say(['Yuraklar tugadi. Qolganlarini qanday yechilishini kuzating.'], 'think');
    const go = () => {
      if (ii >= items.length) return endRound();
      chiz(items[ii]); busy = true; total++; done++; s.setProg(done, all.length);
      later(() => {
        if (t.tur === 'yol') { yolChiz(t.points.length); if (t.shakl) m.qavat.yol.prepend(sv('polygon', { points: t.points.map((p) => `${m.X(p[0])},${m.Y(p[1])}`).join(' '), class: 'orol-shakl' })); B.say([t.shakl ? `Bu yo'ldan ${t.shakl} chiqadi.` : 'Nuqtalar shu tartibda ulanadi.'], 'think'); }
        else {
          yechimKo();
          [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
          B.say([koordSabab(t)], 'think');
        }
      }, 800);
      later(() => { ii++; go(); }, 3600);
    };
    later(go, 1000);
  }
  function endRound() {
    onKey = null; busy = true;
    const clean = rounds[ri].mistakes === 0;
    if (clean) { H.add(30, xaritaJoy); sfx.win(); }
    s.setProg(done, all.length);
    const lastR = ri + 1 >= rounds.length;
    s.foot.replaceChildren(
      el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
        el('b', {}, clean ? 'Xatosiz! +30 bonus' : rounds[ri].mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${rounds[ri].mistakes} ta xato — keyingisida diqqat bilan!`),
        el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
          ri++;
          if (ri >= rounds.length) {
            const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
          } else { s.foot.replaceChildren(); round(); }
        } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
  }
  function round() {
    items = rounds[ri]; ii = 0;
    const oldRight = right, oldTotal = total;
    Object.defineProperty(rounds[ri], 'mistakes', { get: () => (total - oldTotal) - (right - oldRight), configurable: true });
    H.resetHearts();
    next();
  }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const sahna = el('div', { class: 'sahna sahna--orol' },
    el('i', { class: 'orol__chayka orol__chayka--1' }), el('i', { class: 'orol__chayka orol__chayka--2' }),
    H.node, B.node, taxta, xaritaJoy, javoblar);
  s.area.replaceChildren(sahna);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
}

// ================= motionLine (Harakat — dasht yo'li) =================
// Tog'lar ostidagi dasht yo'li: chetlarida qishloqlar, km ustunlari, ikki qator — ikki yurgan (mashina, avtobus, velosipedchi…).
// O'quvchi javobni tanlaydi, keyin soat-soat yurish ko'rsatiladi: har soat belgisi, oradagi masofa, uchrashish/quvib yetish.
// Bank — tools/gen_harakat.py: tur (bitta, uchrash, ketish, quv, kech), sor (t, S, v, qoldi, joy, oldin).
const MASHINA_RANG = [[/ko'k/i, ['#2f6fe0', '#1d4aa8']], [/qizil/i, ['#e5483d', '#a82a22']], [/oq/i, ['#f4f6fa', '#aab2bf']], [/sariq|taksi/i, ['#ffcb2e', '#c99400']]];
// g'ildirak: shina, disk, kegaylar (aylanadi); r — radius
const gildirakSVG = (x, y, r = 9) => `<g transform="translate(${x} ${y})"><g class="gildirak">
  <circle r="${r}" fill="#1b1d22"/><circle r="${r * 0.74}" fill="#3a3e47"/><circle r="${r * 0.6}" fill="#d9dee6" stroke="#8a919c" stroke-width=".8"/>
  ${[0, 72, 144, 216, 288].map(a => `<path d="M0 0 L0 ${-r * 0.56}" stroke="#9aa1ad" stroke-width="${r * 0.16}" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}
  <circle r="${r * 0.18}" fill="#5b616c"/></g></g>`;
// velosiped g'ildiragi: ingichka shina, ko'p simli
const velGildirak = (x, y, r = 13) => `<g transform="translate(${x} ${y})"><g class="gildirak">
  <circle r="${r}" fill="none" stroke="#1b1d22" stroke-width="2.6"/><circle r="${r - 2}" fill="none" stroke="#b9c0ca" stroke-width=".9"/>
  ${Array.from({ length: 8 }, (_, i) => `<path d="M0 0 L0 ${-(r - 2)}" stroke="#aeb5bf" stroke-width=".6" transform="rotate(${i * 45})"/>`).join('')}
  <circle r="1.6" fill="#5b616c"/></g></g>`;
const soya = (x1, x2) => `<ellipse cx="${(x1 + x2) / 2}" cy="67" rx="${(x2 - x1) / 2}" ry="3" fill="#000" opacity=".22"/>`;
const OYNA = '#a9d8f5';
// odam (velosiped/mototsikl/piyoda uchun): kiyim rangi, ayolmi
const kiyim = (nom) => (/Nilufar|Malika/.test(nom) ? ['#e2508a', true] : /Jasur|Bobur/.test(nom) ? ['#2f7be0', false] : /Sayyoh/.test(nom) ? ['#e8912c', false] : ['#2fae6a', false]);

function transportSVG(y) {
  const [rang, qora] = (MASHINA_RANG.find(([re]) => re.test(y.nom)) || [0, ['#2fae6a', '#1d7a47']])[1];
  const [ust, ayol] = kiyim(y.nom);
  const k = {
    mashina: `${soya(6, 116)}
      <path d="M8 57 L7 47 Q7 41 13 40 L22 37 L36 23 Q40 20 48 20 L70 20 Q78 20 83 25 L93 36 L112 38.5 Q118 40 118 46 L118 53 Q118 57 114 57 Z" fill="${rang}" stroke="${qora}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M13 41 L22 38.5 L93 38.5 L113 40.5" fill="none" stroke="#fff" stroke-width="1.6" opacity=".35"/>
      <path d="M39 25 Q42 22.5 48 22.5 L57 22.5 L57 35 L27 35 Z" fill="${OYNA}" stroke="${qora}" stroke-width="1.1"/>
      <path d="M61 22.5 L71 22.5 Q77 22.5 81 26.5 L90 35 L61 35 Z" fill="${OYNA}" stroke="${qora}" stroke-width="1.1"/>
      <path d="M43 34 L51 24 M65 34 L73 24" stroke="#fff" stroke-width="2.4" opacity=".55"/>
      <circle cx="71" cy="28.5" r="3.6" fill="#3b2a1a"/><path d="M66 35 Q71 30 76 35" fill="#3b4a66"/>
      <path d="M59 37 V54 M29 38 V54" stroke="${qora}" stroke-width="1" opacity=".7"/><rect x="47" y="41" width="6" height="1.8" rx=".9" fill="${qora}"/><rect x="77" y="41" width="6" height="1.8" rx=".9" fill="${qora}"/>
      <path d="M110 41.5 Q116 41.5 117 45.5 L111 45.5 Z" fill="#fff6c0" stroke="${qora}" stroke-width=".8"/><rect x="7.5" y="43" width="4" height="5" rx="1" fill="#e0453a"/>
      <rect x="4" y="51" width="12" height="4" rx="2" fill="#2b2f37"/><rect x="106" y="51" width="13" height="4" rx="2" fill="#2b2f37"/>
      ${/taksi/i.test(y.nom) ? `<rect x="45" y="13" width="20" height="7" rx="2" fill="#2b2f37"/><text x="55" y="18.6" text-anchor="middle" font-size="5.5" font-weight="900" fill="#ffcb2e" font-family="sans-serif">TAXI</text>
        <path d="M16 48 H110" stroke="#2b2f37" stroke-width="3" stroke-dasharray="4 4"/>` : ''}
      <path d="M14 57 A12 12 0 0 1 38 57 Z M86 57 A12 12 0 0 1 110 57 Z" fill="#1e2026"/>
      ${gildirakSVG(26, 57, 9.5)}${gildirakSVG(98, 57, 9.5)}`,
    avtobus: `${soya(4, 118)}
      <rect x="4" y="9" width="112" height="49" rx="7" fill="#f4f1e8" stroke="#6b5a3a" stroke-width="1.4"/>
      <path d="M4 40 H116 V51 Q116 58 109 58 H11 Q4 58 4 51 Z" fill="#ff8a1c" stroke="#6b5a3a" stroke-width="1.4"/>
      <rect x="4" y="38" width="112" height="3" fill="#2f6fe0"/>
      <rect x="20" y="5" width="34" height="5" rx="2" fill="#d6d1c2" stroke="#6b5a3a" stroke-width="1"/>
      ${[10, 26, 42, 58, 74].map(x => `<rect x="${x}" y="15" width="13" height="18" rx="2" fill="${OYNA}" stroke="#3d4656" stroke-width="1.1"/><path d="M${x + 3} 31 L${x + 9} 17" stroke="#fff" stroke-width="1.8" opacity=".5"/>`).join('')}
      <circle cx="31" cy="25" r="3" fill="#3b2a1a"/><circle cx="64" cy="25" r="3" fill="#8a5a2b"/><circle cx="48" cy="25.5" r="3" fill="#3b2a1a"/>
      <path d="M90 15 H108 Q114 15 115 21 L116 36 H90 Z" fill="${OYNA}" stroke="#3d4656" stroke-width="1.1"/><path d="M96 34 L104 16" stroke="#fff" stroke-width="2.4" opacity=".5"/>
      <circle cx="104" cy="25" r="3.4" fill="#3b2a1a"/><rect x="99" y="28" width="10" height="8" rx="2" fill="#3b4a66"/>
      <rect x="91" y="10" width="22" height="4" rx="1" fill="#1f2430"/><text x="102" y="13.3" text-anchor="middle" font-size="3.6" font-weight="900" fill="#ffd23f" font-family="sans-serif">12</text>
      <rect x="77" y="38" width="11" height="19" fill="#3d4656"/><path d="M78 39 h4 v17 h-4z M83 39 h4 v17 h-4z" fill="${OYNA}" opacity=".85"/>
      <path d="M116 18 L120 18 L120 26" fill="none" stroke="#2b2f37" stroke-width="1.6"/><rect x="113" y="44" width="4" height="4" rx="1" fill="#fff6c0"/><rect x="3.5" y="44" width="3" height="5" rx="1" fill="#e0453a"/>
      <path d="M15 58 A12 12 0 0 1 39 58 Z M86 58 A12 12 0 0 1 110 58 Z" fill="#1e2026"/>
      ${gildirakSVG(27, 57.5, 9.5)}${gildirakSVG(98, 57.5, 9.5)}`,
    yuk: `${soya(4, 118)}
      <rect x="4" y="12" width="72" height="38" rx="2" fill="#e9edf2" stroke="#5b6472" stroke-width="1.4"/>
      ${[16, 28, 40, 52, 64].map(x => `<path d="M${x} 13 V49" stroke="#c3cad4" stroke-width="1.4"/>`).join('')}
      <rect x="10" y="22" width="40" height="12" rx="2" fill="#2fae6a" opacity=".85"/><text x="30" y="30.6" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="sans-serif">MEVA</text>
      <rect x="4" y="50" width="104" height="4" fill="#2b2f37"/>
      <path d="M80 54 V24 Q80 18 86 18 L100 18 Q105 18 108 23 L115 35 Q118 37 118 42 L118 54 Z" fill="#e5483d" stroke="#a82a22" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M86 22 H99 Q102 22 104 25 L109 34 H86 Z" fill="${OYNA}" stroke="#7a1f19" stroke-width="1.1"/><path d="M90 33 L96 23" stroke="#fff" stroke-width="2" opacity=".55"/>
      <circle cx="96" cy="28" r="3.4" fill="#3b2a1a"/><path d="M91 34 Q96 29 101 34" fill="#3b4a66"/>
      <rect x="112" y="38" width="5" height="4" rx="1" fill="#fff6c0"/><path d="M86 38 H104" stroke="#a82a22" stroke-width="1"/>
      <path d="M6 54 A11 11 0 0 1 28 54 Z M30 54 A11 11 0 0 1 52 54 Z M88 54 A11 11 0 0 1 110 54 Z" fill="#1e2026"/>
      ${gildirakSVG(17, 57, 9)}${gildirakSVG(41, 57, 9)}${gildirakSVG(99, 57, 9)}`,
    velosiped: `${soya(14, 100)}
      ${velGildirak(30, 53)}${velGildirak(86, 53)}
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M30 53 L56 55 L49 31 Z" stroke="${rang === '#2fae6a' ? '#2f6fe0' : '#2f6fe0'}" stroke-width="3"/>
        <path d="M49 31 L80 30 L56 55" stroke="#2f6fe0" stroke-width="3.2"/>
        <path d="M80 30 L86 53" stroke="#2b2f37" stroke-width="2.6"/><path d="M80 30 L78 23 Q82 21 86 23" stroke="#2b2f37" stroke-width="2.2"/>
        <path d="M44 29 H53" stroke="#2b2f37" stroke-width="3.4"/>
      </g>
      <circle cx="56" cy="55" r="4.5" fill="none" stroke="#5b616c" stroke-width="1.6"/>
      <g class="pedal" style="transform-origin:56px 55px"><path d="M56 55 L61 62 M56 55 L51 48" stroke="#2b2f37" stroke-width="2" stroke-linecap="round"/></g>
      <path d="M49 28 Q55 40 59 41 L57 60" fill="none" stroke="#2c3e66" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M49 28 Q60 34 63 38 L60 52" fill="none" stroke="#384f80" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M48 29 Q55 14 66 9" fill="none" stroke="${ust}" stroke-width="9" stroke-linecap="round"/>
      <path d="M63 12 Q72 17 80 23" fill="none" stroke="#f2c9a0" stroke-width="3.4" stroke-linecap="round"/><path d="M63 11 Q68 14 71 16" fill="none" stroke="${ust}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="71" cy="2" r="6" fill="#f2c9a0"/>${ayol ? '<path d="M64 1 Q63 10 58 12 L62 4 Z" fill="#3b2a1a"/>' : ''}
      <path d="M64 1 Q66 -7 74 -6 Q79 -5 79 1 Z" fill="${ayol ? '#e2508a' : '#ffcb2e'}" stroke="#2b2f37" stroke-width=".8"/><circle cx="74.5" cy="2.5" r=".9" fill="#2b2f37"/>`,
    moto: `${soya(10, 108)}
      ${gildirakSVG(26, 56, 10.5)}${gildirakSVG(92, 56, 10.5)}
      <path d="M26 56 L46 46 M92 56 L82 30" stroke="#2b2f37" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M40 46 Q42 38 54 37 L76 36 Q84 36 86 42 L84 48 L46 50 Z" fill="#7b4dd6" stroke="#4b2a96" stroke-width="1.3"/>
      <path d="M48 45 Q55 40 70 40" stroke="#fff" stroke-width="1.8" opacity=".4" fill="none"/>
      <rect x="54" y="47" width="22" height="8" rx="3" fill="#5b616c"/><path d="M30 50 L52 52" stroke="#9aa1ad" stroke-width="3" stroke-linecap="round"/>
      <path d="M38 36 Q44 33 56 34" stroke="#2b2f37" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 34 Q58 40 66 42 L66 54" fill="none" stroke="#2c3e66" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50 33 Q56 18 66 13" fill="none" stroke="#3b4a66" stroke-width="10" stroke-linecap="round"/><path d="M52 28 Q57 19 64 15" fill="none" stroke="#ffcb2e" stroke-width="1.6"/>
      <path d="M64 16 Q74 22 80 29" fill="none" stroke="#3b4a66" stroke-width="4" stroke-linecap="round"/><circle cx="80.5" cy="29.5" r="2.2" fill="#2b2f37"/>
      <circle cx="70" cy="6" r="7.5" fill="#e5483d" stroke="#a82a22" stroke-width="1"/><path d="M71 3 H78 Q78 9 72 9 Z" fill="#2b3a55"/><path d="M64 4 Q68 -1 74 0" stroke="#fff" stroke-width="1.4" opacity=".6" fill="none"/>
      <path d="M84 33 L90 30" stroke="#2b2f37" stroke-width="2.4" stroke-linecap="round"/><circle cx="88" cy="38" r="2.4" fill="#fff6c0" stroke="#2b2f37" stroke-width=".8"/>`,
    piyoda: `${soya(40, 80)}
      <g class="oyoq"><path d="M60 40 L56 52 L52 64" fill="none" stroke="#2c3e66" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M49 64 h6" stroke="#2b2f37" stroke-width="4" stroke-linecap="round"/></g>
      <g class="oyoq oyoq--2"><path d="M60 40 L64 52 L68 64" fill="none" stroke="#384f80" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M66 64 h6" stroke="#2b2f37" stroke-width="4" stroke-linecap="round"/></g>
      <rect x="48" y="16" width="9" height="16" rx="3" fill="#a8703a" stroke="#6b4220" stroke-width="1"/>
      <path d="M60 18 L60 40" stroke="${ust}" stroke-width="12" stroke-linecap="round"/>${ayol ? `<path d="M53 34 L67 34 L69 44 L51 44 Z" fill="${ust}"/>` : ''}
      <g class="qol"><path d="M60 20 L66 30 L68 37" fill="none" stroke="#f2c9a0" stroke-width="3.4" stroke-linecap="round"/></g>
      <circle cx="61" cy="8" r="6.5" fill="#f2c9a0"/><path d="M54 7 Q55 0 62 0 Q68 1 68 6 Q63 3 56 8 Z" fill="#3b2a1a"/>${ayol ? '<path d="M55 6 Q52 14 55 19 L58 9Z" fill="#3b2a1a"/>' : ''}
      <circle cx="64.5" cy="8.5" r=".9" fill="#2b2f37"/>`,
  }[y.rasm] || '';
  return `<svg viewBox="0 -10 122 80" aria-hidden="true">${k}</svg>`;
}
const UY = (rang) => `<svg viewBox="0 0 60 44" aria-hidden="true"><rect x="6" y="18" width="22" height="20" fill="#f6e7c8" stroke="#7a4b22" stroke-width="1.4"/><path d="M3 19 L17 6 L31 19Z" fill="${rang}" stroke="#7a4b22" stroke-width="1.4"/><rect x="13" y="26" width="7" height="12" fill="#8b5a2b"/>
  <rect x="32" y="22" width="20" height="16" fill="#fff3d6" stroke="#7a4b22" stroke-width="1.4"/><path d="M30 23 L42 12 L54 23Z" fill="#c0392b" stroke="#7a4b22" stroke-width="1.4"/><rect x="38" y="27" width="7" height="6" fill="#bfe3ff" stroke="#7a4b22"/>
  <circle cx="54" cy="12" r="6" fill="#4caf50"/><rect x="53" y="16" width="2" height="22" fill="#7a4b22"/></svg>`;

const pozitsiya = (y, h) => y.x0 + y.yon * y.v * Math.max(0, h - (y.t0 || 0));
function harakatSabab(t, tanlov) {
  const [A, B] = t.yurganlar, v1 = A.v, v2 = B?.v, T = t.T;
  let pre = '';
  if (tanlov != null && tanlov !== t.javob) {
    pre = `${tanlov} emas. `;
    if (t.tur === 'uchrash' && t.sor === 't' && v1 !== v2 && tanlov * Math.abs(v1 - v2) === t.yol) pre = `${tanlov} emas — bir-biriga qarab yurganda tezliklar qo'shiladi. `;
    if (t.tur === 'quv' && t.sor === 't' && tanlov * (v1 + v2) === A.x0) pre = `${tanlov} emas — bir tomonga yurganda tezliklar ayiriladi. `;
    if (t.tur === 'kech' && t.sor === 't' && tanlov === T) pre = `${tanlov} emas — bu birinchisi chiqqandan beri. `;
    if (t.sor === 'qoldi' && t.tur === 'uchrash' && tanlov === (v1 + v2) * T) pre = `${tanlov} emas — bu yaqinlashgan masofa. `;
    if (t.sor === 'qoldi' && t.tur === 'uchrash' && (tanlov === t.yol - v1 * T || tanlov === t.yol - v2 * T)) pre = `${tanlov} emas — ikkalasi ham yurdi, faqat bittasini hisobladingiz. `;
  }
  const yaq = v1 + (v2 || 0), farq = Math.abs((v2 || 0) - v1);
  const s = {
    bitta: { t: `Har soatda ${v1} km: ${t.yol} : ${v1} = ${T} soat.`, S: `Har soatda ${v1} km, ${T} soatda: ${v1} · ${T} = ${t.yol} km.`, v: `1 soatdagi yo'l: ${t.yol} : ${T} = ${v1} km/soat.` },
    uchrash: { t: `Har soatda ${v1} + ${v2} = ${yaq} km yaqinlashadi: ${t.yol} : ${yaq} = ${T} soat.`,
      qoldi: `Har soatda ${yaq} km yaqinlashadi, ${T} soatda ${yaq * T} km: ${t.yol} − ${yaq * T} = ${t.javob} km qoladi.`,
      S: `Har soatda ${v1} + ${v2} = ${yaq} km yaqinlashadi, ${T} soatda: ${yaq} · ${T} = ${t.yol} km.` },
    ketish: { S: `Har soatda ${v1} + ${v2} = ${yaq} km uzoqlashadi, ${T} soatda: ${yaq} · ${T} = ${t.yol} km.`,
      t: `Har soatda ${v1} + ${v2} = ${yaq} km uzoqlashadi: ${t.yol} : ${yaq} = ${T} soat.`,
      v: `Har soatda ${t.yol} : ${T} = ${yaq} km uzoqlashdi: ${yaq} − ${v1} = ${v2} km/soat.` },
    quv: { t: `Har soatda ${v2} − ${v1} = ${farq} km yaqinlashadi: ${A.x0} : ${farq} = ${T} soat.`,
      qoldi: `Har soatda ${farq} km yaqinlashadi, ${T} soatda ${farq * T} km: ${A.x0} − ${farq * T} = ${t.javob} km qoladi.`,
      joy: `${A.x0} : ${farq} = ${T} soatda quvib yetadi; ${v2} · ${T} = ${t.javob} km.` },
    kech: t.tur !== 'kech' ? {} : (() => {
      const t0 = B.t0, bosh = v1 * t0, tt = T - t0;
      return { oldin: `${t0} soatda ${/^(Bobur|Malika|Jasur|Nilufar)/.test(A.nom) ? A.nom : A.nom[0].toLowerCase() + A.nom.slice(1)} ${v1} · ${t0} = ${bosh} km yurib qo'ygan.`,
        t: `Chiqqanda farq ${v1} · ${t0} = ${bosh} km; har soatda ${v2} − ${v1} = ${farq} km yaqinlashadi: ${bosh} : ${farq} = ${tt} soat.`,
        joy: `Farq ${bosh} km, har soatda ${farq} km yaqinlashadi — ${tt} soat; ${v2} · ${tt} = ${t.javob} km.` };
    })(),
  }[t.tur][t.sor];
  return pre + s;
}

function gameMotionLine(ctx) {
  const all = ctx.bank.filter((t) => t.tur);
  const s = shell(ctx, '', 'motion');
  const H = hud(3, 'dasht');
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0, ii = 0, items = [], xatolar = 0;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); }, { once: true });

  const savol = el('div', { class: 'dasht-savol' });
  const belgi = el('div', { class: 'dasht-belgi' }, savol);
  const kartalar = el('div', { class: 'dasht-kartalar' });
  const soat = el('b', {}, '0');
  const oraliq = el('span', { class: 'dasht-oraliq' });
  const soatPanel = el('div', { class: 'dasht-soat' }, el('span', { class: 'dasht-soat__ikon' }, '⏱'), soat, ' soat', oraliq);
  const yol = el('div', { class: 'dasht-yol' });
  const javoblar = el('div', { class: 'dasht-javoblar' });
  let t = null, busy = true, startedAt = 0, mk = [], izlar = null, qavs = null;

  const ekran = (x) => 7 + (x / t.yol) * 86;      // yo'l uzunligi → foiz
  function chiz(tt) {
    t = tt;
    savol.textContent = t.savol;
    belgi.classList.remove('yangi'); void belgi.offsetWidth; belgi.classList.add('yangi');
    const nomalum = (i) => (t.sor === 'v' && (t.tur === 'bitta' ? i === 0 : i === 1));
    kartalar.replaceChildren(...t.yurganlar.map((y, i) => el('div', { class: 'dasht-karta dasht-karta--' + (i ? 'b' : 'a') },
      el('span', { class: 'dasht-karta__rasm', html: transportSVG(y) }),
      el('span', {}, el('b', {}, y.nom), el('small', {}, `${nomalum(i) ? '?' : y.v} km/soat ${y.yon > 0 ? '→' : '←'}${y.t0 ? ` · ${y.t0} soat kech` : ''}`)))));
    // yo'l: qishloqlar, km ustunlari, qatorlar
    const qadamlar = [1, 2, 5, 10, 20, 25, 50, 100, 200];
    const qadam = qadamlar.find((q) => t.yol / q <= 8) || 200;
    const ustun = [];
    for (let x = 0; x <= t.yol + 1e-9; x += qadam) {
      const yoz = t.tur === 'ketish' ? Math.abs(x - t.yurganlar[0].x0) : x;
      ustun.push(el('span', { class: 'dasht-km', style: `left:${ekran(x)}%` }, el('i'), el('small', {}, yoz)));
    }
    const qishloqlar = [];
    if (t.qishloq) t.qishloq.forEach((n, i) => { if (n) qishloqlar.push(el('div', { class: 'dasht-qishloq dasht-qishloq--' + (i ? 'ong' : 'chap'), html: UY(i ? '#2f6fe0' : '#2fae6a') }, el('small', {}, n))); });
    if (t.tur === 'ketish') qishloqlar.push(el('div', { class: 'dasht-bekat', style: `left:${ekran(t.yurganlar[0].x0)}%` }, el('i'), el('small', {}, 'start')));
    mk = t.yurganlar.map((y, i) => el('div', { class: 'dasht-yurgan dasht-yurgan--' + (i ? 'b' : 'a') + (y.yon < 0 ? ' chapga' : ''), style: `left:${ekran(pozitsiya(y, 0))}%`, html: transportSVG(y) }));
    izlar = el('div', { class: 'dasht-izlar' });
    qavs = el('div', { class: 'dasht-qavs', hidden: true }, el('small'));
    yol.replaceChildren(el('div', { class: 'dasht-asfalt' }, el('i', { class: 'dasht-chiziq' })), ...ustun, ...qishloqlar, izlar, qavs, ...mk);
    yol.classList.toggle('dasht-yol--bitta', t.yurganlar.length === 1);
    soatYoz(0);
    javoblar.replaceChildren(...t.options.map((o, i) => el('button', { type: 'button', class: 'dasht-jt', onclick: (e) => tanla(o, e.currentTarget) },
      el('b', {}, o), el('small', {}, ` ${t.birlik}`), el('small', { class: 'dasht-jt__key' }, i + 1))));
  }
  function soatYoz(h) {
    soat.textContent = h;
    const [A, Bq] = t.yurganlar;
    if (!Bq) { oraliq.textContent = ` · yurgan yo'l: ${Math.round(Math.abs(pozitsiya(A, h) - A.x0))} km`; return; }
    const d = Math.abs(pozitsiya(Bq, h) - pozitsiya(A, h));
    oraliq.textContent = ` · oradagi masofa: ${d} km`;
    const a = ekran(pozitsiya(A, h)), b = ekran(pozitsiya(Bq, h));
    qavs.hidden = d === 0;
    qavs.style.left = `${Math.min(a, b)}%`; qavs.style.width = `${Math.abs(a - b)}%`;
    qavs.firstChild.textContent = `${d} km`;
  }
  // soat-soat yurish
  function yurgiz(oxiri) {
    const T = t.T;
    mk.forEach((m) => m.classList.add('yur'));
    let h = 0;
    const qadam = () => {
      h++;
      t.yurganlar.forEach((y, i) => {
        mk[i].style.left = `${ekran(pozitsiya(y, h))}%`;
        mk[i].classList.toggle('kutyapti', !!y.t0 && h <= y.t0);
        if (!y.t0 || h > y.t0) izlar.append(el('span', { class: 'dasht-iz dasht-iz--' + (i ? 'b' : 'a'), style: `left:${ekran(pozitsiya(y, h))}%` }, `${h} s`));
      });
      later(() => soatYoz(h), 600);
      if (h < T) later(qadam, 760);
      else later(() => { mk.forEach((m) => m.classList.remove('yur')); oxiri(); }, 700);
    };
    later(qadam, 200);
  }
  function natija(ok, btn) {
    busy = true; onKey = null;
    total++; done++;
    times.push(performance.now() - startedAt);
    const sabab = harakatSabab(t, ok ? null : btn.__qiymat);
    const yakun = () => {
      const [A, Bq] = t.yurganlar;
      if (Bq && (t.sor === 't' || t.sor === 'joy' || t.sor === 'S') && t.tur !== 'ketish' && pozitsiya(A, t.T) === pozitsiya(Bq, t.T)) {
        yol.append(el('div', { class: 'dasht-portla', style: `left:${Math.min(84, Math.max(16, ekran(pozitsiya(A, t.T))))}%` }, t.tur === 'uchrash' ? 'Uchrashdi!' : 'Quvib yetdi!'));
      }
      if (t.sor === 'qoldi' || t.sor === 'oldin' || t.tur === 'ketish') qavs.classList.add('yondi');
    };
    if (ok) {
      right++;
      const mlt = H.hit(); longest = Math.max(longest, H.st.combo);
      const fast = performance.now() - startedAt < 12000;
      sfx.ok();
      H.add(10 * mlt + (fast ? 5 : 0), btn);
      if (fast && mlt < 2) floatText('⚡ Tez!', btn, 'hud-float--tez');
      B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', sabab], 'ok');
      yurgiz(() => { yakun(); later(() => { ii++; next(); }, 1600); });
    } else {
      xatolar++; H.miss(); sfx.bad();
      const left = H.loseHeart();
      B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', sabab], 'bad');
      yurgiz(() => {
        yakun();
        const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
        s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
        onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
      });
    }
  }
  function tanla(o, btn) {
    if (busy) return;
    busy = true;
    btn.__qiymat = o;
    const ok = o === t.javob;
    [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
    btn.classList.add(ok ? 'is-ok' : 'is-bad');
    natija(ok, btn);
  }
  const maslahat = () => ({
    bitta: 'Har soatda tezlikcha yo\'l bosiladi: yo\'l = tezlik · vaqt.',
    uchrash: 'Bir-biriga qarab yurishsa — har soatda qancha yaqinlashadi?',
    ketish: 'Qarama-qarshi tomonga yurishsa — har soatda qancha uzoqlashadi?',
    quv: 'Bir tomonga yurishsa — orqadagi har soatda qancha yaqinlashadi?',
    kech: 'Ikkinchisi chiqquncha birinchisi qancha yurib qo\'ydi?',
  })[t.tur];
  function next() {
    if (ii >= items.length) return endRound();
    busy = false;
    s.setProg(done, all.length);
    chiz(items[ii]);
    B.say([maslahat()], 'idle');
    startedAt = performance.now();
    onKey = (ev) => { const n = +ev.key; if (n >= 1 && n <= javoblar.children.length) { ev.preventDefault(); javoblar.children[n - 1].click(); } };
  }
  function autoRest() {
    onKey = null;
    B.say(['Yuraklar tugadi. Qolganlarini kuzating.'], 'think');
    const go = () => {
      if (ii >= items.length) return endRound();
      chiz(items[ii]); busy = true; total++; done++; s.setProg(done, all.length);
      [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
      B.say([harakatSabab(t)], 'think');
      yurgiz(() => later(() => { ii++; go(); }, 1500));
    };
    later(go, 1000);
  }
  function endRound() {
    onKey = null; busy = true;
    const clean = xatolar === 0;
    if (clean) { H.add(30, yol); sfx.win(); }
    s.setProg(done, all.length);
    const lastR = ri + 1 >= rounds.length;
    s.foot.replaceChildren(
      el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
        el('b', {}, clean ? 'Xatosiz! +30 bonus' : xatolar === 1 ? 'Bitta xato bilan — yaxshi!' : `${xatolar} ta xato — keyingisida diqqat bilan!`),
        el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
          ri++;
          if (ri >= rounds.length) {
            const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
          } else { s.foot.replaceChildren(); round(); }
        } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
  }
  function round() { items = rounds[ri]; ii = 0; xatolar = 0; H.resetHearts(); next(); }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const sahna = el('div', { class: 'sahna sahna--dasht' },
    el('i', { class: 'dasht__quyosh' }), el('i', { class: 'dasht__tog' }),
    H.node, B.node, belgi, kartalar, soatPanel, yol, javoblar);
  s.area.replaceChildren(sahna);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
  });
  round();
}

// ================= protractor (Transportir — Ulug'bek rasadxonasi) =================
// Tungi osmon, yulduzlar, rasadxona; markazda mis transportir — ikki shkala: ichki (0° o'ngda) va tashqi (0° chapda).
// Teleskop — burchakning ikkinchi nuri. Bank — tools/gen_transportir.py: olch, yasa, turi, chama, qoshni.
const RV = { W: 420, H: 262, cx: 210, cy: 228, R: 182 };
const rnuqta = (deg, r) => [RV.cx + r * Math.cos(deg * Math.PI / 180), RV.cy - r * Math.sin(deg * Math.PI / 180)];
const yulduzYol = (x, y, r) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; return `${(x + q * Math.cos(a)).toFixed(1)},${(y + q * Math.sin(a)).toFixed(1)}`; }).join(' ');
const yonalish = (t, a = t.a) => (t.asos === 'ch' ? 180 - a : a);     // ikkinchi nurning ekrandagi yo'nalishi (o'ngdan, soat strelkasiga qarshi)

function transportirSVG(t, korinsin = true) {
  const { W, H, cx, cy, R } = RV;
  const root = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'rasad-svg', role: 'img', 'aria-label': 'Transportir' });
  root.append(sv('defs', {}, `<linearGradient id="rasad-mis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8dc8c"/><stop offset=".55" stop-color="#d9a441"/><stop offset="1" stop-color="#a8701e"/></linearGradient>
    <radialGradient id="rasad-nur" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffe680" stop-opacity=".8"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient>`));
  const tr = sv('g', { class: 'rasad-tr' + (korinsin ? '' : ' yashirin') });
  tr.append(sv('path', { d: `M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy} Z`, fill: 'url(#rasad-mis)', stroke: '#7a4b12', 'stroke-width': 2.5, opacity: 0.93 }),
    sv('path', { d: `M${cx - R + 58} ${cy} A${R - 58} ${R - 58} 0 0 1 ${cx + R - 58} ${cy}`, fill: 'none', stroke: '#8a5a14', 'stroke-width': 1.2, opacity: 0.7 }),
    sv('path', { d: `M${cx - 34} ${cy} A34 34 0 0 1 ${cx + 34} ${cy} Z`, fill: '#f6e2a8', stroke: '#8a5a14', 'stroke-width': 1.2 }));
  // naqsh — o'yma gul
  for (let d = 15; d < 180; d += 30) { const [x, y] = rnuqta(d, R - 74); tr.append(sv('circle', { cx: x, cy: y, r: 3, fill: '#b9802a', opacity: 0.6 })); }
  const chiziq = sv('g', { class: 'rasad-chiziq' });
  for (let d = 0; d <= 180; d++) {
    const L = d % 10 === 0 ? 15 : d % 5 === 0 ? 10 : 5;
    const [x1, y1] = rnuqta(d, R - 1), [x2, y2] = rnuqta(d, R - 1 - L);
    chiziq.append(sv('line', { x1, y1, x2, y2, 'stroke-width': d % 10 === 0 ? 1.4 : 0.8 }));
    if (d % 10 === 0) { const [a1, b1] = rnuqta(d, R - 56), [a2, b2] = rnuqta(d, R - 62); chiziq.append(sv('line', { x1: a1, y1: b1, x2: a2, y2: b2, 'stroke-width': 1.2 })); }
  }
  tr.append(chiziq);
  const tash = sv('g', { class: 'rasad-shkala rasad-shkala--tash' }), ich = sv('g', { class: 'rasad-shkala rasad-shkala--ich' });
  for (let d = 0; d <= 180; d += 10) {
    const [x, y] = rnuqta(d, R - 27), [x2, y2] = rnuqta(d, R - 46);
    tash.append(sv('text', { x, y: y + 4, 'text-anchor': 'middle', transform: `rotate(${90 - d} ${x} ${y})` }, 180 - d));
    ich.append(sv('text', { x: x2, y: y2 + 4, 'text-anchor': 'middle', transform: `rotate(${90 - d} ${x2} ${y2})` }, d));
  }
  tr.append(tash, ich, sv('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: '#7a4b12', 'stroke-width': 2 }),
    sv('line', { x1: cx, y1: cy, x2: cx, y2: cy - 12, stroke: '#7a4b12', 'stroke-width': 1.6 }));
  root.append(tr);
  const qavat = {};
  for (const k of ['yoy', 'nur', 'belgi']) { qavat[k] = sv('g', { class: 'rasad-q-' + k }); root.append(qavat[k]); }
  root.append(sv('circle', { cx, cy, r: 5, fill: '#fff6d0', stroke: '#7a4b12', 'stroke-width': 1.6 }));
  return { root, tr, tash, ich, qavat };
}
function nurChiz(g, deg, cls = 'rasad-nur', yulduz = false) {
  const [x, y] = rnuqta(deg, RV.R + 26);
  g.append(sv('line', { x1: RV.cx, y1: RV.cy, x2: x, y2: y, class: cls }));
  if (yulduz) g.append(sv('circle', { cx: x, cy: y, r: 16, fill: 'url(#rasad-nur)' }), sv('polygon', { points: yulduzYol(x, y, 8), class: 'rasad-yulduz' }));
}
function yoyChiz(g, d1, d2, yozuv, cls = 'rasad-yoy', r = 46) {
  const [a, b] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const [x1, y1] = rnuqta(a, r), [x2, y2] = rnuqta(b, r);
  g.append(sv('path', { d: `M${x1} ${y1} A${r} ${r} 0 0 0 ${x2} ${y2}`, class: cls }));
  if (yozuv != null) { const [tx, ty] = rnuqta((a + b) / 2, r + 17); g.append(sv('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', class: 'rasad-yoy__y ' + cls + '__y' }, yozuv)); }
}
// teleskop — burilib turadigan mis naycha
function teleskop(g) {
  const tel = sv('g', { class: 'rasad-tel' }, `<rect x="14" y="-5" width="${RV.R - 4}" height="10" rx="3" fill="#c98f2e" stroke="#6b420d" stroke-width="1.4"/>
    <rect x="${RV.R - 40}" y="-8" width="40" height="16" rx="3" fill="#d9a441" stroke="#6b420d" stroke-width="1.4"/><rect x="${RV.R - 4}" y="-9" width="8" height="18" rx="2" fill="#7a4b12"/>
    <rect x="70" y="-6.5" width="5" height="13" fill="#7a4b12"/><rect x="${RV.R - 70}" y="-6.5" width="5" height="13" fill="#7a4b12"/><path d="M18 -3 H${RV.R - 44}" stroke="#ffe9a8" stroke-width="2" opacity=".6"/>
    <line x1="0" y1="0" x2="${RV.R + 26}" y2="0" class="rasad-nur rasad-nur--tel"/>`);
  g.append(tel);
  return (deg) => tel.setAttribute('transform', `translate(${RV.cx} ${RV.cy}) rotate(${-deg})`);
}
function rasadSabab(t, tanlov) {
  const a = t.a, tomon = t.asos === 'ch' ? 'chap' : "o'ng";
  if (t.tur === 'olch' || t.tur === 'yasa') {
    const fe = t.tur === 'olch' ? `${tanlov}° emas` : `Siz ${tanlov}° yasadingiz`;
    if (tanlov != null && Math.abs(tanlov - (180 - a)) <= 1 && Math.abs(180 - 2 * a) > 2) return `${fe} — bu ikkinchi shkala. Asos nur ${tomon}da, demak 0° ham ${tomon}da bo'lgan shkaladan o'qing: ${a}°.`;
    if (tanlov != null) return `${fe}, kerak ${a}°. 0° ${tomon}da — shu shkaladan sanang.`;
    return `Asos nur ${tomon}da — 0° ${tomon}dagi shkala: nur ${a}° ni ko'rsatyapti.`;
  }
  if (t.tur === 'turi') return a < 90 ? `${a}° < 90° — o'tkir burchak.` : a === 90 ? `90° — to'g'ri burchak.` : a < 180 ? `90° < ${a}° < 180° — o'tmas burchak.` : `180° — yoyiq burchak (to'g'ri chiziq).`;
  if (t.tur === 'chama') return `Transportirda: ${a}°. ${a < 90 ? "To'g'ri burchakdan (90°) kichik" : a === 90 ? "To'g'ri burchak" : "To'g'ri burchakdan (90°) katta"}${tanlov != null ? `, ${tanlov}° esa ${Math.abs(tanlov - a)}° farq qiladi` : ''}.`;
  if (t.tur === 'qoshni') return `${tanlov === a ? `${a}° emas — bu burchaklar teng emas. ` : tanlov != null ? `${tanlov}° emas. ` : ''}To'g'ri chiziqdagi burchaklar yig'indisi 180°: 180° − ${a}° = ${180 - a}°.`;
  return '';
}

function gameProtractor(ctx) {
  const all = ctx.bank.filter((t) => t.tur);
  const s = shell(ctx, '', 'angle');
  const H = hud(3, 'rasad');
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0, ii = 0, items = [], xatolar = 0;
  const times = [];
  let onKey = null;
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); timers.forEach(clearTimeout); }, { once: true });

  const savol = el('div', { class: 'rasad-savol' });
  const lavha = el('div', { class: 'rasad-lavha' }, savol);
  const joy = el('div', { class: 'rasad-joy' });
  const javoblar = el('div', { class: 'rasad-javoblar' });
  const tugma = (d) => el('button', { type: 'button', class: 'rasad-qadam', onclick: () => { if (!busy) burish(qiymat + d); } }, (d > 0 ? '+' : '−') + Math.abs(d) + '°');
  const tayyor = el('button', { type: 'button', class: 'btn btn--accent rasad-tayyor', onclick: () => tekshir() }, 'Tekshirish ✓');
  const boshqaruv = el('div', { class: 'rasad-boshqaruv' }, tugma(-10), tugma(-1), tugma(1), tugma(10), tayyor);
  let t = null, m = null, busy = true, startedAt = 0, qiymat = 0, burT = null;

  // teleskopni burish: qiymat — burchak (asos nurdan), ekranda yo'nalish
  function burish(v) { qiymat = Math.max(0, Math.min(180, Math.round(v))); burT(yonalish(t, qiymat)); sfx.tap(); }
  function chiz(tt) {
    t = tt;
    m = transportirSVG(t, t.tur !== 'chama');
    joy.replaceChildren(m.root);
    const asosDeg = t.asos === 'ch' ? 180 : 0;
    javoblar.hidden = !t.options; boshqaruv.hidden = t.tur !== 'yasa';
    if (t.tur === 'qoshni') {
      nurChiz(m.qavat.nur, 0); nurChiz(m.qavat.nur, 180); nurChiz(m.qavat.nur, t.a, 'rasad-nur', true);
      yoyChiz(m.qavat.yoy, 0, t.a, `${t.a}°`, 'rasad-yoy', 40); yoyChiz(m.qavat.yoy, t.a, 180, '?', 'rasad-yoy rasad-yoy--2', 54);
      m.tr.classList.add('xira');
      savol.textContent = "To'g'ri chiziqdagi ikkinchi burchak necha gradus?";
    } else if (t.tur === 'yasa') {
      nurChiz(m.qavat.nur, asosDeg);
      burT = teleskop(m.qavat.nur);
      qiymat = t.asos === 'ch' ? 0 : 0; burT(yonalish(t, 0));
      savol.textContent = `Teleskopni burang: ${t.a}° li burchak yasang`;
    } else {
      nurChiz(m.qavat.nur, asosDeg); nurChiz(m.qavat.nur, yonalish(t), 'rasad-nur', true);
      yoyChiz(m.qavat.yoy, asosDeg, yonalish(t), null);
      savol.textContent = t.tur === 'olch' ? 'Burchak necha gradus?' : t.tur === 'turi' ? 'Bu qanday burchak?' : 'Transportirsiz chamalang: burchak taxminan necha gradus?';
    }
    if (t.options) javoblar.replaceChildren(...t.options.map((o, i) => el('button', { type: 'button', class: 'rasad-jt', onclick: (e) => tanla(o, e.currentTarget) },
      typeof o === 'number' ? `${o}°` : o, el('small', { class: 'rasad-jt__key' }, i + 1))));
    lavha.classList.remove('yangi'); void lavha.offsetWidth; lavha.classList.add('yangi');
  }
  // sichqoncha/barmoq bilan teleskopni burish
  let surilmoqda = false;
  const surish = (e) => {
    const r = m.root.getBoundingClientRect();
    const x = (e.clientX - r.left) * (RV.W / r.width) - RV.cx, y = RV.cy - (e.clientY - r.top) * (RV.H / r.height);
    let d = Math.atan2(y, x) * 180 / Math.PI;
    if (d < 0) d = x < 0 ? 180 : 0;
    qiymat = Math.max(0, Math.min(180, Math.round(t.asos === 'ch' ? 180 - d : d)));
    burT(yonalish(t, qiymat));
  };
  joy.addEventListener('pointerdown', (e) => { if (busy || t?.tur !== 'yasa') return; surilmoqda = true; try { joy.setPointerCapture(e.pointerId); } catch { /* */ } surish(e); e.preventDefault(); });
  joy.addEventListener('pointermove', (e) => { if (surilmoqda && !busy) surish(e); });
  const tugat = () => { surilmoqda = false; };
  joy.addEventListener('pointerup', tugat); joy.addEventListener('pointercancel', tugat);

  // javobdan keyin — to'g'ri shkala yonadi, yoy va gradus
  function yechimKo() {
    const asosDeg = t.asos === 'ch' ? 180 : 0;
    if (t.tur === 'qoshni') { m.tr.classList.remove('xira'); m.qavat.yoy.replaceChildren(); yoyChiz(m.qavat.yoy, 0, t.a, `${t.a}°`, 'rasad-yoy', 40); yoyChiz(m.qavat.yoy, t.a, 180, `${180 - t.a}°`, 'rasad-yoy rasad-yoy--2', 54); m.ich.classList.add('yondi'); return; }
    m.tr.classList.remove('yashirin');
    (t.asos === 'ch' ? m.tash : m.ich).classList.add('yondi');
    if (t.tur === 'yasa') nurChiz(m.qavat.belgi, yonalish(t), 'rasad-nur rasad-nur--kerak', true);
    m.qavat.yoy.replaceChildren(); yoyChiz(m.qavat.yoy, asosDeg, yonalish(t), `${t.a}°`, 'rasad-yoy rasad-yoy--javob');
  }
  function natija(ok, at, sabab) {
    busy = true; onKey = null;
    total++; done++;
    times.push(performance.now() - startedAt);
    yechimKo();
    if (ok) {
      right++;
      const mlt = H.hit(); longest = Math.max(longest, H.st.combo);
      const fast = performance.now() - startedAt < 10000;
      sfx.ok(); joy.classList.add('yondi');
      H.add(10 * mlt + (fast ? 5 : 0), at);
      if (fast && mlt < 2) floatText('⚡ Tez!', at, 'hud-float--tez');
      B.say([el('span', { class: 'rchip rchip--ha' }, 'To\'g\'ri ✓'), ' ', sabab], 'ok');
      later(() => { joy.classList.remove('yondi'); ii++; next(); }, 2600);
    } else {
      xatolar++; H.miss(); sfx.bad();
      const left = H.loseHeart();
      joy.classList.remove('xato'); void joy.offsetWidth; joy.classList.add('xato');
      B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), ' ', sabab], 'bad');
      const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
      later(() => {
        s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
        onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
      }, 900);
    }
  }
  function tekshir() {
    if (busy || t.tur !== 'yasa') return;
    const ok = Math.abs(qiymat - t.a) <= 1;
    boshqaruv.hidden = true;
    natija(ok, tayyor, ok ? rasadSabab(t) : rasadSabab(t, qiymat));
  }
  function tanla(o, btn) {
    if (busy) return;
    busy = true;
    const ok = o === t.javob;
    [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
    btn.classList.add(ok ? 'is-ok' : 'is-bad');
    natija(ok, btn, ok ? rasadSabab(t) : rasadSabab(t, t.tur === 'turi' ? null : o));
  }
  const maslahat = () => ({
    olch: `Asos nur ${t.asos === 'ch' ? 'chap' : "o'ng"}da. 0° qaysi shkalada ${t.asos === 'ch' ? 'chap' : "o'ng"}da?`,
    yasa: 'Teleskopni barmoq bilan suring yoki tugmalarni bosing. Shkalani 0° dan o\'qing.',
    turi: "To'g'ri burchak (90°) bilan solishtiring.",
    chama: "To'g'ri burchakni (90°) ko'z oldingizga keltiring — undan kichikmi, kattami?",
    qoshni: "To'g'ri chiziq — yoyiq burchak, 180°.",
  })[t.tur];
  function next() {
    if (ii >= items.length) return endRound();
    busy = false;
    s.setProg(done, all.length);
    chiz(items[ii]);
    B.say([maslahat()], 'idle');
    startedAt = performance.now();
    onKey = (ev) => {
      if (t.tur === 'yasa') {
        if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') { ev.preventDefault(); burish(qiymat - (ev.shiftKey ? 10 : 1)); }
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') { ev.preventDefault(); burish(qiymat + (ev.shiftKey ? 10 : 1)); }
        if (ev.key === 'Enter') { ev.preventDefault(); tekshir(); }
        return;
      }
      const n = +ev.key; if (!javoblar.hidden && n >= 1 && n <= javoblar.children.length) { ev.preventDefault(); javoblar.children[n - 1].click(); }
    };
  }
  function autoRest() {
    onKey = null;
    B.say(['Yuraklar tugadi. Qolganlarini kuzating.'], 'think');
    const go = () => {
      if (ii >= items.length) return endRound();
      chiz(items[ii]); busy = true; boshqaruv.hidden = true; total++; done++; s.setProg(done, all.length);
      later(() => {
        if (t.tur === 'yasa') burT(yonalish(t));
        yechimKo();
        [...javoblar.children].forEach((b, i) => { b.disabled = true; if (t.options[i] === t.javob) b.classList.add('is-ok'); });
        B.say([rasadSabab(t)], 'think');
      }, 800);
      later(() => { ii++; go(); }, 3600);
    };
    later(go, 1000);
  }
  function endRound() {
    onKey = null; busy = true; boshqaruv.hidden = true;
    const clean = xatolar === 0;
    if (clean) { H.add(30, joy); sfx.win(); }
    s.setProg(done, all.length);
    const lastR = ri + 1 >= rounds.length;
    s.foot.replaceChildren(
      el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
        el('b', {}, clean ? 'Xatosiz! +30 bonus' : xatolar === 1 ? 'Bitta xato bilan — yaxshi!' : `${xatolar} ta xato — keyingisida diqqat bilan!`),
        el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
          ri++;
          if (ri >= rounds.length) {
            const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
          } else { s.foot.replaceChildren(); round(); }
        } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
  }
  function round() { items = rounds[ri]; ii = 0; xatolar = 0; H.resetHearts(); next(); }

  const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;
  const rasadxona = `<svg class="rasad__bino" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <path d="M0 120 V96 Q100 86 200 92 Q300 86 400 96 V120Z" fill="#1d2a4a"/>
    <rect x="120" y="44" width="160" height="56" fill="#24365e"/><path d="M110 46 Q200 18 290 46Z" fill="#2c4a7c"/>
    <g fill="#3b6fb0">${[134, 158, 182, 206, 230, 254].map(x => `<path d="M${x} 96 V64 Q${x + 7} 54 ${x + 14} 64 V96Z"/>`).join('')}</g>
    <rect x="120" y="44" width="160" height="6" fill="#4f8fd6"/><rect x="120" y="94" width="160" height="6" fill="#4f8fd6"/>
    <path d="M40 120 V100 Q60 92 80 100 V120Z M320 120 V100 Q340 92 360 100 V120Z" fill="#1a2440"/></svg>`;
  const sahna = el('div', { class: 'sahna sahna--rasad' },
    el('i', { class: 'rasad__oy' }), el('div', { class: 'rasad__bino-joy', html: rasadxona }),
    H.node, B.node, lavha, joy, boshqaruv, javoblar);
  s.area.replaceChildren(sahna);
  s.foot.replaceChildren();
  if (innerWidth < 700) requestAnimationFrame(() => {
    const head = document.querySelector('.site-header')?.offsetHeight || 0;
    scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: 'auto' });
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
  fractionStrip: gameFractionStrip,
  coordinatePath: gameCoordinate,
  motionLine: gameMotionLine,
  protractor: gameProtractor,
};
