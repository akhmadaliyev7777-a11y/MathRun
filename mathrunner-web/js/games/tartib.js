// «Tartiblash» — o'rmondagi poyezd o'yini.
// Bekatda sonli yuk qutilari turadi, poyezdda bo'sh vagonlar. O'quvchi qutini bosadi — u navbatdagi vagonga uchib
// tushadi va darhol tekshiriladi. To'g'ri — ochko, kombo; xato — yurak kamayadi, quti bekatga qaytadi, Robi qaysi
// son avval kelishini va nega ekanini (katta sonlarda — qaysi xonasi kichik) bir qatorda aytadi.
// Hamma vagon to'lsa — poyezd hushtak chalib jo'nab ketadi. Raundda 3 ta yurak; tugasa — qolgan qutilar o'zi ortiladi.
import { el, shuffle } from '../util.js';
import { shell } from './shell.js?v=2';
import { hud, buddy, sfx, floatText } from './hud.js?v=3';

const XONA = ['birlik', "o'nlik", 'yuzlik', 'minglik', "o'n minglik", "yuz minglik", 'million', "o'n million"];
// 10 000 dan boshlab xonalar bo'sh joy bilan: 45 210
const fmt = (n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));

// nega `first` avval keladi: xona soni yoki chapdan birinchi farq qilgan xona
function sabab(first, other, asc) {
  const zn = asc ? '<' : '>';
  const a = String(first), b = String(other);
  if (first < 10 && other < 10) return `${fmt(first)} ${zn} ${fmt(other)}`;
  if (a.length !== b.length) {
    const kam = a.length < b.length ? a : b, kop = a.length < b.length ? b : a;
    return `${fmt(first)} ${zn} ${fmt(other)}: ${kam.length} xonali son ${kop.length} xonalidan kichik`;
  }
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) {
    return `${fmt(first)} ${zn} ${fmt(other)}: ${XONA[a.length - 1 - i]}lari ${a[i]} ${zn} ${b[i]}`;
  }
  return `${fmt(first)} = ${fmt(other)}`;
}

// kasrlar: maxrajlari bir xil — suratini, suratlari bir xil — maxrajini solishtiramiz
function kasrSabab(first, other, asc) {
  const zn = asc ? '<' : '>';
  if (first.d === other.d) return `Maxrajlar bir xil (${first.d}) → suratlarni solishtiramiz: ${first.n} ${zn} ${other.n}, demak ${first.key} ${zn} ${other.key}`;
  if (first.n === other.n) return `Suratlar bir xil (${first.n}) → maxraji katta kasrning bo'laklari mayda: ${first.key} ${zn} ${other.key}`;
  return `${first.key} ${zn} ${other.key}`;
}

// bug' lokomotivi (chapga qaragan): qozon, mo'ri, gumbaz, kabina, oldidagi to'siq; mo'ridan tutun chiqadi
const G = (cx, cy, r) => `<g class="g-gildirak"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#b8322a" stroke="#1d1f29" stroke-width="3"/>` +
  `<path d="M${cx} ${cy - r + 2} V${cy + r - 2} M${cx - r + 2} ${cy} H${cx + r - 2} M${cx - r * .6} ${cy - r * .6} L${cx + r * .6} ${cy + r * .6} M${cx - r * .6} ${cy + r * .6} L${cx + r * .6} ${cy - r * .6}" stroke="#1d1f29" stroke-width="1.6"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${r * .28}" fill="#d9a441"/></g>`;
const LOKO = `<svg viewBox="0 0 170 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="tutun"><circle cx="38" cy="8" r="7"/><circle cx="30" cy="2" r="6"/><circle cx="44" cy="0" r="5"/></g>
  <path d="M30 36 L27 15 H49 L46 36 Z" fill="#2b2e3a"/><rect x="25" y="10" width="26" height="6" rx="2" fill="#1d1f29"/>
  <rect x="18" y="34" width="88" height="35" rx="16" fill="#2f6b4f"/><rect x="24" y="36" width="78" height="9" rx="4.5" fill="#4d9c74" opacity=".6"/>
  <rect x="46" y="34" width="4" height="35" fill="#d9a441"/><rect x="80" y="34" width="4" height="35" fill="#d9a441"/>
  <path d="M60 35 q0 -13 10 -13 q10 0 10 13 Z" fill="#d9a441"/><path d="M64 30 q3 -5 7 -5" stroke="#f5d68a" stroke-width="2" fill="none"/>
  <ellipse cx="20" cy="51.5" rx="7" ry="17.5" fill="#1d1f29"/><circle cx="18" cy="51" r="3" fill="#d9a441"/>
  <rect x="8" y="24" width="13" height="11" rx="2" fill="#2b2e3a"/><circle cx="10.5" cy="29.5" r="4.2" fill="#fff3b0"/><path d="M6 29.5 l-6 -3 v6 Z" fill="#fff3b0" opacity=".5"/>
  <rect x="104" y="24" width="50" height="46" rx="3" fill="#8b2a2a"/><rect x="104" y="58" width="50" height="5" fill="#d9a441"/>
  <rect x="112" y="31" width="16" height="17" rx="2" fill="#cfefff" stroke="#5c1a1a" stroke-width="2"/>
  <rect x="133" y="31" width="14" height="17" rx="2" fill="#cfefff" stroke="#5c1a1a" stroke-width="2"/>
  <path d="M98 25 H160 V19 Q129 9 98 19 Z" fill="#3a1414"/>
  <rect x="10" y="69" width="152" height="7" rx="2" fill="#1d1f29"/>
  <path d="M1 92 L14 69 H22 V92 Z" fill="#6b6f80"/><path d="M6 90 L16 71 M11 91 L19 74 M16 91 L21 80" stroke="#3d404c" stroke-width="1.6"/>
  <rect x="160" y="70" width="9" height="5" rx="1" fill="#6b6f80"/>
  ${G(31, 86, 8)}${G(64, 82, 13)}${G(95, 82, 13)}${G(136, 86, 9)}
  <rect class="shatun" x="62" y="83" width="35" height="4" rx="2" fill="#c9cdd8" stroke="#6b6f80" stroke-width=".8"/>
</svg>`;

// ochiq yuk vagoni: taxta devorlar, temir burchaklar, bufer va g'ildiraklar (quti ichiga tushadi)
const VRANG = ['#8b5a2b', '#9c3b2e', '#3d6b4a'];
const VAGON = (c) => `<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="4" y="18" width="92" height="30" rx="2" fill="${c}"/>
  <path d="M4 28 H96 M4 38 H96" stroke="rgba(0,0,0,.22)" stroke-width="1.6"/><path d="M4 21 H96" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
  <rect x="4" y="18" width="5" height="30" fill="#3a3a44"/><rect x="91" y="18" width="5" height="30" fill="#3a3a44"/><rect x="47.5" y="18" width="5" height="30" fill="#3a3a44"/>
  <circle cx="6.5" cy="24" r="1" fill="#9aa"/><circle cx="6.5" cy="42" r="1" fill="#9aa"/><circle cx="93.5" cy="24" r="1" fill="#9aa"/><circle cx="93.5" cy="42" r="1" fill="#9aa"/>
  <rect x="2" y="15" width="96" height="4" rx="1" fill="#3a3a44"/>
  <rect x="2" y="48" width="96" height="5" fill="#1d1f29"/>
  <rect x="-4" y="48" width="7" height="4" rx="1" fill="#6b6f80"/><rect x="97" y="48" width="7" height="4" rx="1" fill="#6b6f80"/>
  ${G(24, 56, 7.5)}${G(76, 56, 7.5)}
</svg>`;

// o'rmon manzarasi: osmon, quyosh, bulutlar, tepaliklar, archalar, temir yo'l
const ORMON = `<svg class="orman__fon" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="or-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset=".7" stop-color="#dff4ff"/></linearGradient></defs>
  <rect width="400" height="300" fill="url(#or-o)"/>
  <circle cx="330" cy="58" r="26" fill="#ffe27a"/><circle cx="330" cy="58" r="38" fill="#ffe27a" opacity=".25"/>
  <g class="orman__bulut" fill="#fff"><ellipse cx="80" cy="50" rx="34" ry="12"/><ellipse cx="96" cy="42" rx="20" ry="12"/></g>
  <g class="orman__bulut orman__bulut--2" fill="#fff"><ellipse cx="230" cy="80" rx="28" ry="10"/><ellipse cx="244" cy="73" rx="16" ry="10"/></g>
  <path d="M0 200 Q60 150 130 185 T260 175 T400 180 V300 H0 Z" fill="#9edc8f"/>
  <path d="M0 225 Q80 190 170 215 T330 205 T400 210 V300 H0 Z" fill="#6cc46a"/>
  <g fill="#2f8a4b">${[18, 52, 92, 140, 300, 338, 376].map((x, i) => `<path d="M${x} ${232 - (i % 3) * 8} l14 34 h-28 Z M${x} ${244 - (i % 3) * 8} l17 38 h-34 Z"/><rect x="${x - 3}" y="${280 - (i % 3) * 8}" width="6" height="8" fill="#7a4b2a"/>`).join('')}</g>
  <rect y="262" width="400" height="38" fill="#5fb55c"/>
</svg>`;

export function gameNumberOrder(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'sort', true);
  const H = hud(3);
  const B = buddy();
  let idx = 0, right = 0, placedAll = 0, longest = 0;
  const times = [];

  function round() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    H.resetHearts();
    const asc = t.ascending;
    // topshiriq sonlar yoki kasrlardan iborat; har biri {key, val} — solishtirish val bo'yicha
    const kasr = !!t.kasrlar;
    const items = kasr ? t.kasrlar.map(([a, b]) => ({ key: `${a}/${b}`, n: a, d: b, val: a / b }))
      : t.numbers.map(v => ({ key: String(v), v, val: v }));
    const target = [...items].sort((a, b) => (asc ? a.val - b.val : b.val - a.val));
    const n = target.length;
    let pool = shuffle(items);
    const loaded = [];
    let busy = false, mistakes = 0, shownAt = performance.now();
    const maxLen = kasr ? Math.max(...items.map(it => String(Math.max(it.n, it.d)).length)) : Math.max(...items.map(it => fmt(it.v).length));
    const txt = (it) => (kasr ? it.key : fmt(it.v));
    // quti ustidagi yozuv: son yoki ustma-ust kasr (to'g'ri kasrda yonida kichik doira-bo'lak)
    const lbl = (it) => kasr
      ? [el('span', { class: 'kasr' }, el('i', {}, it.n), el('i', {}, it.d)),
        it.n <= it.d ? el('i', { class: 'pirog', style: `--p:${(it.n / it.d) * 360}deg` }) : null]
      : [fmt(it.v)];

    // ---- poyezd: lokomotiv + n ta vagon ----
    const wagons = target.map((_, i) => el('div', { class: 'vagon' }, el('span', { class: 'vagon__yuk' }), el('div', { class: 'vagon__rasm', html: VAGON(VRANG[i % 3]) })));
    const navbat = () => wagons.forEach((w, i) => w.classList.toggle('navbat', i === loaded.length));
    const poyezd = el('div', { class: 'poyezd' }, el('div', { class: 'loko', html: LOKO }), ...wagons);
    const yol = el('div', { class: 'temiryol' }, poyezd);

    // ---- bekat: sonli qutilar ----
    const bekat = el('div', { class: 'bekat' });
    const sizeVar = () => {
      const w = poyezd.clientWidth || 340;
      const vw = Math.max(46, Math.min(92, (w - 92) / n - 4));
      poyezd.style.setProperty('--vw', vw + 'px');
      poyezd.style.setProperty('--vfs', Math.max(9, Math.min(vw * 0.34, (vw * 1.3) / maxLen)) + 'px');   // vagondagi quti kichik — son unga sig'sin
      bekat.style.setProperty('--qfs', Math.max(12, Math.min(22, 120 / maxLen + 6)) + 'px');
    };
    function drawBekat() {
      bekat.replaceChildren(...pool.map(it => el('button', { class: 'quti' + (maxLen > 3 ? ' quti--keng' : '') + (kasr ? ' quti--kasr' : ''), type: 'button', dataset: { key: it.key }, 'aria-label': txt(it), onclick: (ev) => pick(it, ev.currentTarget) }, ...lbl(it))));
      shownAt = performance.now();
    }

    // quti uchib vagonga tushadi
    function fly(from, to, it, done) {
      const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const f = el('div', { class: 'quti fly' + (maxLen > 3 ? ' quti--keng' : '') + (kasr ? ' quti--kasr' : ''), style: `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;font-size:${getComputedStyle(from).fontSize}` }, ...lbl(it));
      document.body.append(f);
      requestAnimationFrame(() => {
        f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.8)`;
      });
      setTimeout(() => { f.remove(); done(); }, 380);
    }
    const setWagon = (k, it, cls) => {
      const w = wagons[k];
      w.className = 'vagon is-full' + (cls || '');
      w.querySelector('.vagon__yuk').replaceChildren(kasr ? `${it.n}/${it.d}` : fmt(it.v));   // vagondagi kichik qutida kasr bir qatorda
      navbat();
    };
    const qoida = asc ? 'eng kichigini' : 'eng kattasini';

    function pick(v, btn) {   // v — topshiriq elementi {key, val}
      if (busy || loaded.length >= n) return;
      busy = true;
      const k = loaded.length, want = target[k];
      times.push(performance.now() - shownAt);
      placedAll++;
      const ok = v.key === want.key;
      fly(btn, wagons[k], v, () => {
        if (ok) {
          right++;
          loaded.push(v); pool = pool.filter(x => x.key !== v.key);
          setWagon(k, v, ' is-in');
          const m = H.hit(); longest = Math.max(longest, H.st.combo);
          const fast = performance.now() - shownAt < 4000;
          H.add(10 * m + (fast ? 5 : 0), wagons[k]);
          if (fast && m < 2) setTimeout(() => floatText('⚡ Tez!', wagons[k], 'hud-float--tez'), 150);
          sfx.ok();
          B.say(k === 0
            ? [el('b', { class: 'rnum' }, txt(v)), ` — ${asc ? 'eng kichigi' : 'eng kattasi'}, birinchi vagonga!`]
            : [el('b', { class: 'rnum' }, txt(v)), ` — qolganlarning ${asc ? 'eng kichigi' : 'eng kattasi'}.`], 'ok');
          busy = false; drawBekat();
          if (loaded.length === n) depart();
        } else {
          mistakes++; H.miss(); sfx.bad();
          setWagon(k, v, ' is-wrong');
          const left = H.loseHeart();
          B.say([el('span', { class: 'rchip rchip--yoq' }, `${txt(v)} emas`), ' ',
            el('span', { class: 'rchip rchip--ha' }, `avval ${txt(want)}`), el('br'),
            kasr ? kasrSabab(want, v, asc) : sabab(want.v, v.v, asc), '. ', `Har safar qolganlar ichidan ${qoida} oling.`], 'bad');
          setTimeout(() => {
            wagons[k].className = 'vagon'; wagons[k].querySelector('.vagon__yuk').textContent = ''; navbat();
            drawBekat();
            const b = [...bekat.children].find(x => x.dataset.key === want.key);
            if (b) b.classList.add('is-hint');           // to'g'ri qutini bir lahza ko'rsatadi
            busy = false;
            if (left === 0) autoRest();
          }, 1000);
        }
      });
    }

    // yuraklar tugadi — qolgan qutilar o'zi to'g'ri tartibda ortiladi
    function autoRest() {
      busy = true;
      B.say(['Yuraklar tugadi. Qutilar qanday tartibda ortilishini kuzating.'], 'think');
      const step = () => {
        if (loaded.length >= n) { busy = false; return depart(); }
        const k = loaded.length, v = target[k];
        const btn = [...bekat.children].find(x => x.dataset.key === v.key);
        placedAll++;
        fly(btn || bekat, wagons[k], v, () => {
          loaded.push(v); pool = pool.filter(x => x.key !== v.key);
          setWagon(k, v, ' is-auto'); drawBekat(); setTimeout(step, 280);
        });
      };
      setTimeout(step, 600);
    }

    function depart() {
      busy = true;
      const clean = mistakes === 0;
      sfx.win();
      if (clean) H.add(30, poyezd);
      poyezd.classList.add('ketdi');
      if (clean) B.say(['Hammasi to\'g\'ri! Poyezd jo\'nadi 🚂'], 'ok');
      const last = idx + 1 >= tasks.length;
      setTimeout(() => s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            idx++;
            if (idx >= tasks.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              ctx.finish(right, placedAll, { longestStreak: longest, avgMs, score: H.st.score });
            } else round();
          } }, last ? 'Natijani ko\'rish' : 'Keyingi poyezd ➜'))), 900);
    }

    drawBekat();
    const bar = ctx.root.querySelector('.prompt');
    const umumiy = /^(Sonlarni|Maxrajlari bir xil kasrlarni|Suratlari bir xil kasrlarni) (o'sish|kamayish) tartibida/.test(t.prompt || '');
    if (bar) bar.hidden = umumiy;
    // bekat binosi: cherepitsali tom, ustunlar, osilgan taxtacha va fonarlar, taxtali supa, tosh poydevor
    const bino = el('div', { class: 'bino' },
      el('div', { class: 'bino__tom' }),
      el('i', { class: 'bino__ustun bino__ustun--l' }), el('i', { class: 'bino__ustun bino__ustun--r' }),
      el('i', { class: 'bino__chiroq bino__chiroq--l' }), el('i', { class: 'bino__chiroq bino__chiroq--r' }),
      el('div', { class: 'bino__taxta' }, el('b', {}, 'BEKAT'), el('small', {}, asc ? 'kichigidan → kattasiga' : 'kattasidan → kichigiga')),
      bekat,
      el('div', { class: 'bino__supa' }),
      el('div', { class: 'bino__poydevor' }));
    navbat();
    const sahna = el('div', { class: 'sahna sahna--orman' }, el('div', { class: 'orman', html: ORMON }),
      H.node, B.node, bino, yol);
    s.area.replaceChildren(sahna);
    s.foot.replaceChildren();
    sizeVar();
    const ro = new ResizeObserver(sizeVar); ro.observe(poyezd);
    addEventListener('hashchange', () => ro.disconnect(), { once: true });
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: idx ? 'smooth' : 'auto' });
    });
    const kasrQoida = !kasr ? '' : t.kasrlar.every(([, d]) => d === t.kasrlar[0][1])
      ? 'Maxrajlari bir xil: surati katta kasr — katta. '
      : "Suratlari bir xil: maxraji kichik kasr — katta (bo'laklari yirik). ";
    B.say(idx === 0
      ? [kasrQoida + `Qutilarni vagonlarga ${asc ? "o'sish" : 'kamayish'} tartibida ortamiz: har safar qolganlar ichidan ${qoida} toping.`]
      : [kasrQoida + `Yangi poyezd: ${asc ? "o'sish" : 'kamayish'} tartibida.`], 'idle');
  }
  round();
}
