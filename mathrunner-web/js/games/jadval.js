// «Jadval» — xazina g'ori o'yini.
// Qulflangan sandiq; har tenglama — bitta qulf. O'quvchi raqamli tugmalar (yoki klaviatura) bilan sonni teradi.
// To'g'ri — qulf ochiladi, tangalar sachraydi; xato — yurak kamayadi va Robi javobni emas, darslikdagi qoidani shu
// sonlar bilan aytadi («Noma'lum qo'shiluvchi = yig'indi − ma'lum qo'shiluvchi: 900 − 340 = ?»), o'quvchi qayta uriniadi.
// Raundda 3 ta yurak; tugasa — javob ko'rsatiladi. Hamma qulf ochilsa — sandiq ochiladi.
import { el } from '../util.js';
import { shell } from './shell.js?v=4';
import { hud, buddy, sfx, floatText } from './hud.js?v=9';

const BELGI = { '+': '+', '-': '−', '*': '×', '×': '×', '÷': ':', '/': ':' };
const fmt = (n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));
const kerak = (e) => (e.blankSlot === 'a' ? e.a : e.blankSlot === 'b' ? e.b : e.result);

// xatodan keyin — javob emas, yo'l: amal hadlari qoidasi shu sonlar bilan, oxiri «?»
function qoida(e) {
  const op = BELGI[e.operator] || e.operator, { a, b, result: r } = e;
  if (e.blankSlot === 'result') {
    if (op === '+') return a < 10 && b < 10 ? `${a} dan ${b} qadam oldinga sanang: ${a} + ${b} = ?`
      : `Avval birliklarni, keyin o'nliklarni qo'shing: ${a} + ${b} = ?`;
    if (op === '−') return `${a} dan ${b} qadam orqaga sanang: ${a} − ${b} = ?`;
    if (op === '×') return `${a} × ${b} — ${a} ni ${b} marta qo'shish: ${Array(Math.min(b, 6)).fill(a).join(' + ')}${b > 6 ? ' + …' : ''} = ?`;
    return `Bo'lishni ko'paytirish bilan tekshiring: ? × ${b} = ${a}`;
  }
  const nom = e.blankSlot === 'a';      // noma'lum — birinchi had
  if (op === '+') return `Noma'lum qo'shiluvchi = yig'indi − ma'lum qo'shiluvchi: ${r} − ${nom ? b : a} = ?`;
  if (op === '−') return nom ? `Noma'lum kamayuvchi = ayirma + ayriluvchi: ${r} + ${b} = ?`
    : `Noma'lum ayriluvchi = kamayuvchi − ayirma: ${a} − ${r} = ?`;
  if (op === '×') return `Noma'lum ko'paytuvchi = ko'paytma : ma'lum ko'paytuvchi: ${r} : ${nom ? b : a} = ?`;
  return nom ? `Noma'lum bo'linuvchi = bo'linma × bo'luvchi: ${r} × ${b} = ?`
    : `Noma'lum bo'luvchi = bo'linuvchi : bo'linma: ${a} : ${r} = ?`;
}

// sandiq: qopqoq alohida (ochilganda ko'tariladi), old tomonida qulflar
const SANDIQ = `<svg viewBox="0 0 160 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><radialGradient id="sq-n" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#fff6c2"/><stop offset=".5" stop-color="#ffd24a"/><stop offset="1" stop-color="#e09a12" stop-opacity="0"/></radialGradient></defs>
  <ellipse class="sandiq__nur" cx="80" cy="46" rx="70" ry="40" fill="url(#sq-n)"/>
  <g class="sandiq__ich"><circle cx="58" cy="50" r="7" fill="#ffd24a" stroke="#c98a0c" stroke-width="2"/><circle cx="76" cy="46" r="7" fill="#ffd24a" stroke="#c98a0c" stroke-width="2"/>
    <circle cx="94" cy="50" r="7" fill="#ffd24a" stroke="#c98a0c" stroke-width="2"/><path d="M104 44 l8 -8 l8 8 l-8 10 Z" fill="#5ad1ff" stroke="#1c8fb8" stroke-width="2"/>
    <path d="M40 46 l7 -7 l7 7 l-7 9 Z" fill="#ff6b8a" stroke="#c23a5a" stroke-width="2"/></g>
  <rect x="12" y="52" width="136" height="54" rx="6" fill="#8b5a2b" stroke="#4e2f17" stroke-width="3"/>
  <path d="M14 70 H146 M14 88 H146" stroke="rgba(0,0,0,.22)" stroke-width="2"/>
  <rect x="28" y="52" width="10" height="54" fill="#d9a441" stroke="#9a6a14" stroke-width="1.5"/><rect x="122" y="52" width="10" height="54" fill="#d9a441" stroke="#9a6a14" stroke-width="1.5"/>
  <g class="sandiq__qopqoq"><path d="M12 54 V38 Q12 14 80 14 Q148 14 148 38 V54 Z" fill="#9c6633" stroke="#4e2f17" stroke-width="3"/>
    <path d="M28 52 V30 Q30 20 38 18 V52 Z M122 52 V18 Q130 20 132 30 V52 Z" fill="#d9a441" stroke="#9a6a14" stroke-width="1.5"/>
    <path d="M20 36 Q80 22 140 36" stroke="rgba(0,0,0,.2)" stroke-width="2" fill="none"/></g>
</svg>`;
const QULF = (ochiq) => `<svg viewBox="0 0 30 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="${ochiq ? 'M8 16 V9 a7 7 0 0 1 14 0 V6' : 'M8 16 V10 a7 7 0 0 1 14 0 V16'}" stroke="#8a8f99" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="3" y="15" width="24" height="19" rx="4" fill="${ochiq ? '#4ad07a' : '#d9a441'}" stroke="${ochiq ? '#1f7a43' : '#9a6a14'}" stroke-width="2"/>
  <circle cx="15" cy="23" r="3" fill="#3a2a10"/><rect x="14" y="24" width="2" height="6" fill="#3a2a10"/></svg>`;

export function gameEquationGrid(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'grid', true);
  const H = hud(3, 'gor');
  const B = buddy();
  let idx = 0, right = 0, total = 0, longest = 0;
  const times = [];
  let onKey = null;
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => removeEventListener('keydown', keyH), { once: true });

  function round() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    H.resetHearts();
    const eqs = t.equations;
    let cur = 0, typed = '', busy = false, mistakes = 0, shownAt = performance.now(), triedWrong = false;
    const maxLen = Math.max(...eqs.map(e => String(kerak(e)).length));

    // ---- tosh lavha: tenglamalar, faol tenglamada yonib turgan katak ----
    const rows = eqs.map((e) => {
      const cell = (slot, v) => slot === e.blankSlot ? el('b', { class: 'tq-katak' }) : el('span', {}, fmt(v));
      return el('div', { class: 'tq' }, el('i', { class: 'tq-qulf', html: QULF(false) }),
        cell('a', e.a), el('span', { class: 'tq-op' }, BELGI[e.operator] || e.operator), cell('b', e.b), el('span', { class: 'tq-op' }, '='), cell('result', e.result));
    });
    const lavha = el('div', { class: 'lavha' }, ...rows);
    const sandiq = el('div', { class: 'sandiq', html: SANDIQ });
    const katak = () => rows[cur].querySelector('.tq-katak');
    function draw() {
      rows.forEach((r, i) => r.classList.toggle('faol', i === cur));
      if (rows[cur]) katak().textContent = typed || ' ';
    }

    // ---- raqamli tugmalar ----
    const press = (k) => {
      if (busy) return;
      if (k === '⌫') typed = typed.slice(0, -1);
      else if (k === '✓') return check();
      else if (typed.length < Math.max(maxLen + 1, 3)) typed = (typed === '0' ? '' : typed) + k;
      sfx.tap(); draw();
    };
    const keypad = el('div', { class: 'tugmalar' }, ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].map(k =>
      el('button', { type: 'button', class: 'tugma' + (k === '✓' ? ' tugma--ok' : k === '⌫' ? ' tugma--del' : ''), 'aria-label': k === '⌫' ? "O'chirish" : k === '✓' ? 'Tekshirish' : k, onclick: () => press(k) }, k)));
    onKey = (ev) => {
      if (/^\d$/.test(ev.key)) press(ev.key);
      else if (ev.key === 'Backspace') { ev.preventDefault(); press('⌫'); }
      else if (ev.key === 'Enter') press('✓');
    };

    function check() {
      if (!typed) { katak().classList.remove('bosh'); void katak().offsetWidth; katak().classList.add('bosh'); return; }
      busy = true;
      const e = eqs[cur], want = kerak(e), val = Number(typed);
      if (!triedWrong) times.push(performance.now() - shownAt);
      if (val === want) {
        if (!triedWrong) { right++; const m = H.hit(); longest = Math.max(longest, H.st.combo); H.add(10 * m + (performance.now() - shownAt < 6000 ? 5 : 0), katak()); }
        else H.add(5, katak());
        total++;
        sfx.ok();
        rows[cur].classList.add('ochildi'); rows[cur].querySelector('.tq-qulf').innerHTML = QULF(true);
        katak().classList.add('togri');
        tangalar(rows[cur]);
        B.say([el('b', { class: 'rnum' }, fmt(want)), triedWrong ? ' — mana endi to\'g\'ri! Qulf ochildi.' : ' — to\'g\'ri! Qulf ochildi.'], 'ok');
        setTimeout(nextLock, 650);
      } else {
        mistakes++; H.miss(); sfx.bad();
        triedWrong = true;
        katak().classList.remove('xato'); void katak().offsetWidth; katak().classList.add('xato');
        const left = H.loseHeart();
        if (left > 0) {
          B.say([el('span', { class: 'rchip rchip--yoq' }, `${fmt(val)} emas`), ' ', qoida(e)], 'bad');
          setTimeout(() => { typed = ''; busy = false; draw(); katak().classList.remove('xato'); }, 700);
        } else {
          total++;
          B.say([el('span', { class: 'rchip rchip--yoq' }, `${fmt(val)} emas`), ' ', qoida(e).replace(/\?$/, fmt(want)), el('br'), 'Yuraklar tugadi — javob shu.'], 'think');
          setTimeout(() => {
            typed = String(want); draw(); katak().classList.remove('xato'); katak().classList.add('korsatildi');
            rows[cur].classList.add('ochildi'); rows[cur].querySelector('.tq-qulf').innerHTML = QULF(true);
            setTimeout(nextLock, 1500);
          }, 800);
        }
      }
    }
    function nextLock() {
      cur++; typed = ''; triedWrong = false; busy = false; shownAt = performance.now();
      if (cur >= eqs.length) return openChest();
      if (!H.st.hearts) H.resetHearts();   // keyingi qulfga yangi yuraklar
      draw();
    }
    function tangalar(at) {
      const r = at.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const c = el('i', { class: 'tanga', style: `left:${r.left + r.width * (0.3 + Math.random() * 0.4)}px;top:${r.top + r.height / 2}px;--dx:${(Math.random() - 0.5) * 120}px;--dy:${-40 - Math.random() * 60}px` });
        document.body.append(c); setTimeout(() => c.remove(), 900);
      }
    }
    function openChest() {
      busy = true; onKey = null;
      const clean = mistakes === 0;
      sandiq.classList.add('ochiq'); sfx.win();
      if (clean) H.add(30, sandiq);
      B.say([clean ? 'Sandiq ochildi — xatosiz! 💎' : 'Sandiq ochildi!'], 'ok');
      const last = idx + 1 >= tasks.length;
      setTimeout(() => s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            idx++;
            if (idx >= tasks.length) {
              onKey = null;
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              ctx.finish(right, total, { longestStreak: longest, avgMs, score: H.st.score });
            } else round();
          } }, last ? 'Natijani ko\'rish' : 'Keyingi sandiq ➜'))), 700);
    }

    const bar = ctx.root.querySelector('.prompt');
    if (bar) bar.hidden = /^Bo'sh katakni/.test(t.prompt || '');
    const sahna = el('div', { class: 'sahna sahna--gor' }, el('i', { class: 'gor__mashal gor__mashal--l' }), el('i', { class: 'gor__mashal gor__mashal--r' }),
      H.node, B.node, lavha, sandiq, keypad);
    s.area.replaceChildren(sahna);
    s.foot.replaceChildren();
    draw();
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: idx ? 'smooth' : 'auto' });
    });
    B.say(idx === 0
      ? [eqs.length > 1 ? `Sandiqda ${eqs.length} ta qulf bor. ` : '', 'Yonib turgan katakka sonni tering va ✓ ni bosing — qulf ochiladi.']
      : [eqs.length > 1 ? `Yangi sandiq: ${eqs.length} ta qulf.` : 'Yangi sandiq!'], 'idle');
  }
  round();
}
