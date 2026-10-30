// «Tarozi» — sehrli bozor o'yini.
// Peshtaxtadagi mis tarozi muvozanatda: chap pallada bir xil sehrli kristallar (va temir tosh), o'ng pallada jami og'irlik.
// O'quvchi pastdagi sinov toshlaridan birini tanlaydi — har kristall o'rniga shu tosh qo'yiladi: to'g'ri bo'lsa tarozi
// muvozanatda qoladi, xato bo'lsa og'ir tomonga og'adi. Robi bir qatorda sababini aytadi:
// «2 · 6 + 3 = 15 — 11 dan og'ir», to'g'risi «(11 − 3) : 2 = 4». 1-sinfda bo'lish o'rniga qo'shish: «8 = 4 + 4».
// Mashq 2 partiya × 5 misol; partiyada 3 yurak; tugasa — qolganlarini tarozi o'zi ko'rsatadi.
import { el } from '../util.js';
import { shell } from './shell.js?v=2';
import { hud, buddy, sfx, floatText } from './hud.js?v=4';

// ---- sabab matnlari (bir qator) ----
const kop = (n, x, birinchi) => (n === 1 ? `${x}` : birinchi ? Array(n).fill(x).join(' + ') : `${n} · ${x}`);
// tarozining chap pallasi: n ta kristall o'rniga x kg dan tosh (+ k kg li tosh)
export const chapIfoda = (t, x, birinchi) => `${kop(t.shapeCount, x, birinchi && t.shapeCount <= 3)}${t.knownWeight ? ` + ${t.knownWeight}` : ''}`;
export function yechim(t, birinchi) {
  const n = t.shapeCount, k = t.knownWeight, T = t.total, x = (T - k) / n;
  if (n === 1) return `${T} − ${k} = ${x}`;
  if (birinchi) return k ? `${T} − ${k} = ${T - k}, ${T - k} = ${kop(n, x, true)}` : `${T} = ${kop(n, x, true)}`;
  return k ? `(${T} − ${k}) : ${n} = ${x}` : `${T} : ${n} = ${x}`;
}
export function sabab(t, v, birinchi) {
  const L = t.shapeCount * v + t.knownWeight, T = t.total, x = (T - t.knownWeight) / t.shapeCount;
  if (v === x) return `${yechim(t, birinchi)}. Tekshiramiz: ${chapIfoda(t, x, birinchi)} = ${T} ✓`;
  return `${chapIfoda(t, v, birinchi)} = ${L} — ${L > T ? `${T} dan og'ir` : `${T} dan yengil`}. To'g'risi: ${yechim(t, birinchi)}`;
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
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => removeEventListener('keydown', keyH), { once: true });

  // ---- tarozi: ustun, shayin (aylanadi), ikki palla (shayin uchida osilgan, doim tik turadi) ----
  const chapYuk = el('div', { class: 'palla__yuk' });
  const ongYuk = el('div', { class: 'palla__yuk' });
  const ZANJIR = '<svg class="palla__zanjir" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 0 L5 100" vector-effect="non-scaling-stroke"/><path d="M50 0 L95 100" vector-effect="non-scaling-stroke"/></svg>';
  const palla = (yuk, tomon) => el('div', { class: 'palla palla--' + tomon },
    el('i', { class: 'palla__ilgak' }), el('div', { class: 'palla__osma', html: ZANJIR }), yuk, el('div', { class: 'palla__tovoq' }));
  const shayin = el('div', { class: 'tarozi__shayin' }, palla(chapYuk, 'l'), palla(ongYuk, 'r'));
  const tarozi = el('div', { class: 'tarozi' },
    el('div', { class: 'tarozi__ustun' }, el('i', { class: 'tarozi__toj' }), el('i', { class: 'tarozi__mil' }), el('i', { class: 'tarozi__asos' })),
    el('i', { class: 'tarozi__strelka' }), shayin);
  const ogdir = (deg) => tarozi.style.setProperty('--a', deg + 'deg');
  const taxta = el('div', { class: 'bozor__taxta' });
  const toshlar = el('div', { class: 'toshlar' });
  const tosh = (v, cls = '') => el('span', { class: 'tosh ' + cls }, el('b', {}, v), el('small', {}, 'kg'));

  function round() {
    const items = rounds[ri];
    H.resetHearts();
    let ii = 0, mistakes = 0, busy = false, startedAt = 0;

    function show(t) {
      s.setProg(done, all.length);
      const x = (t.total - t.knownWeight) / t.shapeCount;
      // tenglama taxtachasi: 2 · ◆ + 3 = 11
      const kr = () => el('i', { class: 'taxta__kr', html: kristall(t.shape, t.shapeColor) });
      taxta.replaceChildren(t.shapeCount > 1 ? `${t.shapeCount} · ` : '', kr(), t.knownWeight ? ` + ${t.knownWeight}` : '', ` = ${t.total}`);
      chapYuk.replaceChildren(
        ...Array.from({ length: t.shapeCount }, () => el('i', { class: 'kristall', html: kristall(t.shape, t.shapeColor) })),
        ...(t.knownWeight ? [tosh(t.knownWeight, 'tosh--temir')] : []));
      ongYuk.replaceChildren(tosh(t.total, 'tosh--katta'));
      // yuk qo'yilayotgandek: avval chapga og'ib turadi, keyin tebranib muvozanatga keladi
      tarozi.classList.add('tez'); ogdir(-9); void tarozi.offsetWidth; tarozi.classList.remove('tez');
      requestAnimationFrame(() => ogdir(0));
      return x;
    }

    function next() {
      if (ii >= items.length) return endRound();
      const t = items[ii];
      busy = false;
      show(t);
      const opts = [...t.options];
      toshlar.replaceChildren(...opts.map((v, i) => el('button', { type: 'button', class: 'tosh-btn', 'aria-label': `${v} kg`, onclick: (e) => pick(e.currentTarget, v) },
        tosh(v, 'tosh--sinov'), el('small', { class: 'tosh-btn__key' }, i + 1))));
      B.say([el('b', {}, t.prompt), ' Sinov toshini tanlang — har kristall o\'rniga shu tosh qo\'yiladi.'], 'idle');
      startedAt = performance.now();
      onKey = (ev) => { const n = +ev.key; if (n >= 1 && n <= opts.length) { ev.preventDefault(); toshlar.children[n - 1].click(); } };
    }

    // kristallar o'rniga v kg li sinov toshlari qo'yiladi; tarozi og'ir tomonga og'adi
    function sinab(t, v) {
      const L = t.shapeCount * v + t.knownWeight, d = L - t.total;
      chapYuk.querySelectorAll('.kristall').forEach((k, i) => setTimeout(() => k.replaceWith(tosh(v, 'tosh--sinov tosh--tush')), i * 90));
      setTimeout(() => ogdir(d === 0 ? 0 : -Math.sign(d) * Math.min(14, 5 + (Math.abs(d) / t.total) * 30)), t.shapeCount * 90 + 120);
    }

    function pick(btn, v) {
      if (busy) return;
      busy = true; onKey = null;
      const t = items[ii], x = (t.total - t.knownWeight) / t.shapeCount, ok = v === x;
      total++; done++;
      times.push(performance.now() - startedAt);
      [...toshlar.children].forEach(b => { b.disabled = true; });
      btn.classList.add(ok ? 'is-ok' : 'is-bad');
      sinab(t, v);
      if (ok) {
        right++;
        const m = H.hit(); longest = Math.max(longest, H.st.combo);
        const fast = performance.now() - startedAt < 7000;
        setTimeout(() => {
          sfx.ok(); tarozi.classList.add('yondi');
          H.add(10 * m + (fast ? 5 : 0), btn);
          if (fast && m < 2) floatText('⚡ Tez!', tarozi, 'hud-float--tez');
          B.say([el('span', { class: 'rchip rchip--ha' }, `${x} kg ✓`), ' ', sabab(t, v, birinchi)], 'ok');
        }, t.shapeCount * 90 + 500);
        setTimeout(() => { tarozi.classList.remove('yondi'); ii++; next(); }, t.shapeCount * 90 + 2300);
      } else {
        mistakes++; H.miss();
        setTimeout(() => {
          sfx.bad();
          const left = H.loseHeart();
          [...toshlar.children].forEach(b => { if (+b.getAttribute('aria-label').split(' ')[0] === x) b.classList.add('is-ok'); });
          B.say([el('span', { class: 'rchip rchip--yoq' }, 'Xato'), el('span', { class: 'rchip rchip--ha' }, `To'g'ri: ${x} kg`), el('br'), sabab(t, v, birinchi)], 'bad');
          // to'g'ri toshlar qo'yiladi — tarozi muvozanatga qaytadi
          setTimeout(() => {
            chapYuk.querySelectorAll('.tosh--sinov').forEach(k => { k.firstChild.textContent = x; k.classList.add('tosh--togri'); });
            ogdir(0);
          }, 1100);
          const davom = () => { onKey = null; s.foot.replaceChildren(); ii++; left === 0 ? autoRest() : next(); };
          s.foot.replaceChildren(el('button', { class: 'btn btn--accent', type: 'button', onclick: davom }, 'Davom etish ➜'));
          onKey = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); davom(); } };
        }, t.shapeCount * 90 + 500);
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
        setTimeout(() => { sinab(t, x); B.say([el('span', { class: 'rchip rchip--ha' }, `${x} kg`), ' ', sabab(t, x, birinchi)], 'think'); }, 900);
        setTimeout(() => { ii++; go(); }, 3200);
      };
      setTimeout(go, 900);
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
