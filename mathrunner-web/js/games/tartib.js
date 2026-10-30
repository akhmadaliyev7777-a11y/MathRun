// «Tartiblash» — o'rmondagi poyezd o'yini.
// Bekatda sonli yuk qutilari turadi, poyezdda bo'sh vagonlar. O'quvchi qutini bosadi — u navbatdagi vagonga uchib
// tushadi va darhol tekshiriladi. To'g'ri — ochko, kombo; xato — yurak kamayadi, quti bekatga qaytadi, Robi qaysi
// son avval kelishini va nega ekanini (katta sonlarda — qaysi xonasi kichik) bir qatorda aytadi.
// Hamma vagon to'lsa — poyezd hushtak chalib jo'nab ketadi. Raundda 3 ta yurak; tugasa — qolgan qutilar o'zi ortiladi.
import { el, shuffle } from '../util.js';
import { shell } from './shell.js';
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

// lokomotiv (chapga qaragan) — mo'risidan tutun chiqadi
const LOKO = `<svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="tutun"><circle cx="34" cy="10" r="6"/><circle cx="26" cy="4" r="5"/><circle cx="40" cy="2" r="4"/></g>
  <rect x="26" y="16" width="14" height="20" rx="3" fill="#3b3f58"/><rect x="22" y="14" width="22" height="6" rx="3" fill="#2b2e42"/>
  <path d="M8 66 V44 q0 -10 10 -10 H70 V66 Z" fill="#e2453b"/><rect x="8" y="40" width="62" height="6" fill="#ffcf4a"/>
  <rect x="66" y="18" width="44" height="48" rx="6" fill="#c9302c"/><rect x="74" y="26" width="28" height="20" rx="4" fill="#bfe9ff" stroke="#8a1f1c" stroke-width="3"/>
  <rect x="62" y="12" width="52" height="8" rx="4" fill="#8a1f1c"/>
  <path d="M2 66 L14 58 V74 Z" fill="#5a5f7a"/><circle cx="10" cy="50" r="5" fill="#fff6c2" stroke="#e8b400" stroke-width="2"/>
  <rect x="4" y="64" width="112" height="10" rx="4" fill="#2b2e42"/>
  <g class="g-gildirak"><circle cx="30" cy="78" r="12" fill="#3b3f58" stroke="#ffcf4a" stroke-width="3"/><path d="M30 67 V89 M19 78 H41" stroke="#ffcf4a" stroke-width="2.5"/></g>
  <g class="g-gildirak"><circle cx="62" cy="80" r="10" fill="#3b3f58" stroke="#ffcf4a" stroke-width="3"/><path d="M62 71 V89 M53 80 H71" stroke="#ffcf4a" stroke-width="2.5"/></g>
  <g class="g-gildirak"><circle cx="94" cy="80" r="10" fill="#3b3f58" stroke="#ffcf4a" stroke-width="3"/><path d="M94 71 V89 M85 80 H103" stroke="#ffcf4a" stroke-width="2.5"/></g>
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
    const target = [...t.numbers].sort((a, b) => (asc ? a - b : b - a));
    const n = target.length;
    let pool = shuffle(t.numbers);
    const loaded = [];
    let busy = false, mistakes = 0, shownAt = performance.now();
    const maxLen = Math.max(...t.numbers.map(v => fmt(v).length));

    // ---- poyezd: lokomotiv + n ta vagon ----
    const wagons = target.map(() => el('div', { class: 'vagon' }, el('span', { class: 'vagon__yuk' }), el('i', { class: 'vagon__g' }), el('i', { class: 'vagon__g vagon__g--2' })));
    const poyezd = el('div', { class: 'poyezd' }, el('div', { class: 'loko', html: LOKO }), ...wagons);
    const yol = el('div', { class: 'temiryol' }, poyezd);

    // ---- bekat: sonli qutilar ----
    const bekat = el('div', { class: 'bekat' });
    const sizeVar = () => {
      const w = poyezd.clientWidth || 340;
      const vw = Math.max(46, Math.min(86, (w - 76) / n - 6));
      poyezd.style.setProperty('--vw', vw + 'px');
      poyezd.style.setProperty('--vfs', Math.max(11, Math.min(22, (vw * 1.55) / maxLen)) + 'px');
      bekat.style.setProperty('--qfs', Math.max(12, Math.min(22, 120 / maxLen + 6)) + 'px');
    };
    function drawBekat() {
      bekat.replaceChildren(...pool.map(v => el('button', { class: 'quti' + (maxLen > 3 ? ' quti--keng' : ''), type: 'button', onclick: (ev) => pick(v, ev.currentTarget) }, fmt(v))));
      shownAt = performance.now();
    }

    // quti uchib vagonga tushadi
    function fly(from, to, v, done) {
      const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const f = el('div', { class: 'quti fly' + (maxLen > 3 ? ' quti--keng' : ''), style: `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;font-size:${getComputedStyle(from).fontSize}` }, fmt(v));
      document.body.append(f);
      requestAnimationFrame(() => {
        f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.8)`;
      });
      setTimeout(() => { f.remove(); done(); }, 380);
    }
    const setWagon = (k, v, cls) => {
      const w = wagons[k];
      w.className = 'vagon is-full' + (cls || '');
      w.querySelector('.vagon__yuk').textContent = fmt(v);
    };
    const qoida = asc ? 'eng kichigini' : 'eng kattasini';

    function pick(v, btn) {
      if (busy || loaded.length >= n) return;
      busy = true;
      const k = loaded.length, want = target[k];
      times.push(performance.now() - shownAt);
      placedAll++;
      const ok = v === want;
      fly(btn, wagons[k], v, () => {
        if (ok) {
          right++;
          loaded.push(v); pool = pool.filter(x => x !== v);
          setWagon(k, v, ' is-in');
          const m = H.hit(); longest = Math.max(longest, H.st.combo);
          const fast = performance.now() - shownAt < 4000;
          H.add(10 * m + (fast ? 5 : 0), wagons[k]);
          if (fast && m < 2) setTimeout(() => floatText('⚡ Tez!', wagons[k], 'hud-float--tez'), 150);
          sfx.ok();
          B.say(k === 0
            ? [el('b', { class: 'rnum' }, fmt(v)), ` — ${asc ? 'eng kichigi' : 'eng kattasi'}, birinchi vagonga!`]
            : [el('b', { class: 'rnum' }, fmt(v)), ` — qolganlarning ${asc ? 'eng kichigi' : 'eng kattasi'}.`], 'ok');
          busy = false; drawBekat();
          if (loaded.length === n) depart();
        } else {
          mistakes++; H.miss(); sfx.bad();
          setWagon(k, v, ' is-wrong');
          const left = H.loseHeart();
          B.say([el('span', { class: 'rchip rchip--yoq' }, `${fmt(v)} emas`), ' ',
            el('span', { class: 'rchip rchip--ha' }, `avval ${fmt(want)}`), el('br'),
            sabab(want, v, asc), '. ', `Har safar qolganlar ichidan ${qoida} oling.`], 'bad');
          setTimeout(() => {
            wagons[k].className = 'vagon'; wagons[k].querySelector('.vagon__yuk').textContent = '';
            drawBekat();
            const b = [...bekat.children].find(x => x.textContent === fmt(want));
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
        const btn = [...bekat.children].find(x => x.textContent === fmt(v));
        placedAll++;
        fly(btn || bekat, wagons[k], v, () => {
          loaded.push(v); pool = pool.filter(x => x !== v);
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
    const umumiy = /^Sonlarni (o'sish|kamayish) tartibida/.test(t.prompt || '');
    if (bar) bar.hidden = umumiy;
    const yonalish = el('div', { class: 'yonalish' }, asc ? 'Kichigidan → kattasiga' : 'Kattasidan → kichigiga');
    const sahna = el('div', { class: 'sahna sahna--orman' }, el('div', { class: 'orman', html: ORMON }),
      H.node, B.node, el('div', { class: 'bekat-sarlavha' }, 'Bekat'), bekat, yonalish, yol);
    s.area.replaceChildren(sahna);
    s.foot.replaceChildren();
    sizeVar();
    const ro = new ResizeObserver(sizeVar); ro.observe(poyezd);
    addEventListener('hashchange', () => ro.disconnect(), { once: true });
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: idx ? 'smooth' : 'auto' });
    });
    B.say(idx === 0
      ? [`Qutilarni vagonlarga ${asc ? "o'sish" : 'kamayish'} tartibida ortamiz: har safar qolganlar ichidan ${qoida} toping.`]
      : [`Yangi poyezd: ${asc ? "o'sish" : 'kamayish'} tartibida.`], 'idle');
  }
  round();
}
