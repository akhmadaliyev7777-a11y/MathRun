// «Saralash» — robot zavodi o'yini.
// Konveyer lentasida ustiga mulohaza yozilgan karton quti keladi va suzib boradi; o'quvchi u lenta oxiriga yetguncha
// «✓ Ha» yoki «✗ Yo'q» bunkerini bosadi (klaviaturada ← / →). To'g'ri — ochko, kombo, konveyer tezlashadi;
// xato yoki ulgurmasa — yurak kamayadi, kartochka to'g'ri bunkerga tushadi, Robi sababini bir qatorda aytadi
// (juft/toq — teng ikkiga bo'lish, bo'luvchi/karrali — bo'lish va qoldiq, bo'linish alomati, chamalash).
// Mashq 2 raund × 5 kartochka; raundda 3 ta yurak; tugasa — qolganlari o'zi saralanadi.
import { el, shuffle } from '../util.js';
import { shell } from './shell.js?v=4';
import { hud, buddy, sfx, floatText, pauza } from './hud.js?v=9';

const fmt = (n) => (n >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));
const yaxlit = (n) => Math.round(n / 10) * 10;

// mulohaza nega rost yoki yolg'on — bir qatorda
export function izoh(text) {
  const t = text.replace(/ /g, ' ').replace(/\?$/, '').trim();
  const num = (s) => Number(s.replace(/ /g, ''));
  let m;
  if ((m = t.match(/^(\d+) (juft|toq) son$/))) {
    const n = +m[1], k = Math.floor(n / 2);
    if (n === 1) return '1 ni teng ikkiga bo\'lib bo\'lmaydi — demak toq';
    return n % 2 === 0 ? `${n} = ${k} + ${k} — teng ikkiga bo'linadi, demak juft` : `${n} = ${k} + ${k} + 1 — bittasi ortib qoladi, demak toq`;
  }
  if ((m = t.match(/^(\d+) soni (\d+) ning bo'luvchisi(mi)?$/))) {
    const a = +m[1], b = +m[2], q = Math.floor(b / a), r = b % a;
    return r === 0 ? `${b} : ${a} = ${q} — qoldiqsiz bo'linadi` : `${b} : ${a} = ${q} (${r} qoldiq) — qoldiqsiz bo'linmaydi`;
  }
  if ((m = t.match(/^(\d+) soni (\d+) ga karrali(mi)?$/))) {
    const a = +m[1], b = +m[2], q = Math.floor(a / b), r = a % b;
    return r === 0 ? `${a} = ${b} × ${q} — ${b} ga karrali` : `${a} : ${b} = ${q} (${r} qoldiq) — ${b} ga karrali emas`;
  }
  if ((m = t.match(/^([\d ]+) soni (\d+) ga bo'linadimi$/))) {
    const n = num(m[1]), k = +m[2], d = n % 10, ha = n % k === 0;
    if (k === 2) return `Oxirgi raqami ${d} — ${d % 2 === 0 ? 'juft, demak 2 ga bo\'linadi' : 'toq, demak 2 ga bo\'linmaydi'}`;
    if (k === 5) return `Oxirgi raqami ${d} — ${ha ? '0 yoki 5, demak 5 ga bo\'linadi' : '0 ham, 5 ham emas — 5 ga bo\'linmaydi'}`;
    if (k === 10) return `Oxirgi raqami ${d} — ${ha ? '0, demak 10 ga bo\'linadi' : '0 emas — 10 ga bo\'linmaydi'}`;
    const r = String(n).split('').map(Number), s = r.reduce((x, y) => x + y, 0);
    return `Raqamlar yig'indisi ${r.join(' + ')} = ${s} — ${s % k === 0 ? `${k} ga bo'linadi` : `${k} ga bo'linmaydi`}`;
  }
  if ((m = t.match(/^(\d+) ([×÷+−]) (\d+) ([<>]) (\d+)$/))) {
    const a = +m[1], op = m[2], b = +m[3], z = m[4], v = +m[5];
    const r = { '×': a * b, '÷': a / b, '+': a + b, '−': a - b }[op];
    const zn = r > v ? '>' : '<';
    let cham = '';
    if (op === '+' || op === '−') cham = `chamalab: ${yaxlit(a)} ${op} ${yaxlit(b)} = ${op === '+' ? yaxlit(a) + yaxlit(b) : yaxlit(a) - yaxlit(b)}; `;
    else if (op === '×') { const ra = a >= 20 ? yaxlit(a) : a, rb = b >= 20 ? yaxlit(b) : b; cham = `chamalab: ${ra} × ${rb} = ${ra * rb}; `; }
    return `${cham}aniq: ${a} ${op} ${b} = ${fmt(r)} ${zn} ${fmt(v)}`;
  }
  return '';
}

// orqa fondagi aylanuvchi tishli g'ildirak
const TISHLI = (r, n) => `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="currentColor">
  ${Array.from({ length: n }, (_, i) => `<rect x="-6" y="${-r - 9}" width="12" height="14" rx="2" transform="rotate(${(360 / n) * i})"/>`).join('')}
  <circle r="${r}"/><circle r="${r * 0.38}" fill="#1d2633"/></g></svg>`;

export function gameConveyor(ctx) {
  const all = shuffle(ctx.bank);                    // bankda Ha/Yo'q navbatma-navbat — aralashtiramiz
  const s = shell(ctx, 'Har bir mulohaza uchun "Ha" yoki "Yo\'q" ni tanlang', 'spark');
  const H = hud(3, 'zavod');
  const B = buddy();
  const RAUND = 5;
  const rounds = [];
  for (let i = 0; i < all.length; i += RAUND) rounds.push(all.slice(i, i + RAUND));
  let ri = 0, right = 0, total = 0, longest = 0, done = 0;
  const times = [];
  let onKey = null, raf = 0;
  const keyH = (ev) => onKey && onKey(ev);
  addEventListener('keydown', keyH);
  addEventListener('hashchange', () => { removeEventListener('keydown', keyH); cancelAnimationFrame(raf); }, { once: true });

  function round() {
    const cards = rounds[ri];
    s.setProg(done, all.length);
    H.resetHearts();
    let ci = 0, mistakes = 0, busy = false, x = 0, last = 0, startedAt = 0;

    // ---- konveyer va bunkerlar ----
    // konveyer biroz yuqoridan ko'rinadi: lenta yuzasi (qiyshiq to'rtburchak, yuradi), lenta qalinligi, temir rama
    // roliklar bilan, oyoqlar; buyumlar alohida qatlamda (o'zi qiyshaymaydi — ustki yuzi qiyshiq, old yuzi to'g'ri)
    const lenta = el('div', { class: 'lenta' });
    const belt = el('div', { class: 'konveyer' },
      el('i', { class: 'konveyer__oyoq konveyer__oyoq--l' }), el('i', { class: 'konveyer__oyoq konveyer__oyoq--r' }),
      el('div', { class: 'konveyer__sirt' }), el('div', { class: 'konveyer__chet' }),
      el('div', { class: 'konveyer__rama' }, ...Array.from({ length: 7 }, () => el('i', { class: 'konveyer__rolik' }))),
      lenta,
      el('i', { class: 'tunnel tunnel--l' }), el('i', { class: 'tunnel tunnel--r' }));   // ikki chetida temir quvur-eshik: quti chapdan chiqadi, o'ngga kirib ketadi
    const TUNNEL = 40;   // eshikning lenta ustidagi qismi (px)
    // past bo'yli karton quti — to'g'ri burchakli parallelepiped: ustki yuzi (yorliq — misol shu yerda), old va o'ng yon yuzlari
    const kuti = (text) => el('div', { class: 'kuti' },
      el('div', { class: 'kuti__ust' }, el('span', { class: 'kuti__yorliq' }, el('b', {}, text))), el('div', { class: 'kuti__old' }), el('div', { class: 'kuti__yon' }));
    const bunker = (ha) => el('button', { type: 'button', class: 'bunker bunker--' + (ha ? 'ha' : 'yoq'), 'aria-label': ha ? 'Ha' : "Yo'q", onclick: () => answer(ha) },
      el('i', { class: 'bunker__chiroq' }), el('b', {}, ha ? '✓ Ha' : "✗ Yo'q"), el('small', {}, ha ? '←' : '→'));
    const bHa = bunker(true), bYoq = bunker(false);
    const bunkerlar = el('div', { class: 'bunkerlar' }, bHa, bYoq);
    let card = null;
    // konveyer tezligi: boshida sekin, kombo oshgan sari tezlashadi (lentani bosib o'tish vaqti)
    const kesish = () => Math.max(4500, 9500 - H.st.combo * 700);

    function nextCard() {
      if (ci >= cards.length) return endRound();
      const c = cards[ci];
      card = kuti(c.text);
      lenta.replaceChildren(card);
      x = TUNNEL - card.offsetWidth * 0.55; last = performance.now(); startedAt = last; busy = false;   // quti chap eshikdan chiqib keladi
      card.style.transform = `translateX(${x}px)`;
      s.setProg(done, all.length);
      cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
    }
    function step(now) {
      if (busy || !card) return;
      if (pauza.on) { last = now; raf = requestAnimationFrame(step); return; }   // muruvvat bilan to'xtatilgan
      const w = lenta.clientWidth, dt = now - last; last = now;
      x += (Math.max(40, w - TUNNEL * 2 + card.offsetWidth * 0.2) / kesish()) * dt;
      card.style.transform = `translateX(${x}px)`;
      if (x > w - TUNNEL - card.offsetWidth * 0.35) return answer(null);   // o'ng eshikka kirib ketdi — ulgurmadi
      raf = requestAnimationFrame(step);
    }
    // kartochka bunkerga tushadi
    function drop(toHa, cls, then) {
      const b = (toHa ? bHa : bYoq).getBoundingClientRect(), a = card.getBoundingClientRect();
      const f = card.cloneNode(true); f.classList.add('kuti--uch'); if (cls) f.classList.add(cls.trim());
      Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', transform: '' });
      document.body.append(f); card.style.visibility = 'hidden';
      requestAnimationFrame(() => { f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height * 0.35 - a.top - a.height / 2}px) scale(.35)`; f.style.opacity = '.2'; });
      setTimeout(() => { f.remove(); then && then(); }, 420);
    }
    const yonsin = (btn, ok) => { btn.classList.remove('ok', 'bad'); void btn.offsetWidth; btn.classList.add(ok ? 'ok' : 'bad'); };

    function answer(ha) {
      if (busy || !card) return;
      busy = true; cancelAnimationFrame(raf);
      const c = cards[ci], ok = ha === c.isTrue, sabab = izoh(c.text);
      total++; done++;
      if (ha !== null) times.push(performance.now() - startedAt);
      if (ok) {
        right++;
        const m = H.hit(); longest = Math.max(longest, H.st.combo);
        const fast = performance.now() - startedAt < kesish() * 0.45;
        sfx.ok(); yonsin(ha ? bHa : bYoq, true);
        H.add(10 * m + (fast ? 5 : 0), ha ? bHa : bYoq);
        if (fast && m < 2) floatText('⚡ Tez!', ha ? bHa : bYoq, 'hud-float--tez');
        B.say([el('span', { class: 'rchip rchip--ha' }, c.isTrue ? 'Ha ✓' : "Yo'q ✓"), ' ', sabab], 'ok');
        drop(ha, '', () => { ci++; nextCard(); });
      } else {
        mistakes++; H.miss(); sfx.bad();
        if (ha !== null) yonsin(ha ? bHa : bYoq, false);
        const left = H.loseHeart();
        B.say([el('span', { class: 'rchip rchip--yoq' }, ha === null ? 'Ulgurmadingiz' : 'Xato'), ' ',
          el('span', { class: 'rchip rchip--ha' }, `To'g'ri: ${c.isTrue ? 'Ha' : "Yo'q"}`), el('br'), sabab], 'bad');
        card.classList.add('is-wrong');
        setTimeout(() => drop(c.isTrue, ' is-fixed', () => {
          yonsin(c.isTrue ? bHa : bYoq, true); ci++;
          setTimeout(() => (left === 0 ? autoRest() : nextCard()), 900);
        }), 700);
      }
    }
    // yuraklar tugadi — qolgan kartochkalar o'zi saralanadi
    function autoRest() {
      onKey = null;
      B.say(['Yuraklar tugadi. Qolgan qutilar qayerga tushishini kuzating.'], 'think');
      const go = () => {
        if (ci >= cards.length) return endRound();
        const c = cards[ci];
        card = kuti(c.text); lenta.replaceChildren(card);
        card.style.transform = `translateX(${(lenta.clientWidth - card.offsetWidth) / 2}px)`;
        total++; done++;
        setTimeout(() => drop(c.isTrue, ' is-fixed', () => { yonsin(c.isTrue ? bHa : bYoq, true); ci++; setTimeout(go, 300); }), 500);
      };
      setTimeout(go, 700);
    }
    function endRound() {
      onKey = null; card = null; lenta.replaceChildren();
      const clean = mistakes === 0;
      if (clean) { H.add(30, belt); sfx.win(); }
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
            } else round();
          } }, lastR ? 'Natijani ko\'rish' : 'Keyingi partiya ➜')));
    }

    onKey = (ev) => {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); answer(true); }
      else if (ev.key === 'ArrowRight') { ev.preventDefault(); answer(false); }
    };
    const bar = ctx.root.querySelector('.prompt'); if (bar) bar.hidden = true;   // ko'rsatmani Robi aytadi
    const sahna = el('div', { class: 'sahna sahna--zavod' },
      el('i', { class: 'zavod__tishli zavod__tishli--1', html: TISHLI(32, 10) }), el('i', { class: 'zavod__tishli zavod__tishli--2', html: TISHLI(22, 8) }),
      el('i', { class: 'zavod__quvur' }),
      H.node, B.node, belt, bunkerlar);
    s.area.replaceChildren(sahna);
    s.foot.replaceChildren();
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: ri ? 'smooth' : 'auto' });
    });
    B.say(ri === 0
      ? ['Quti lenta oxiriga yetguncha bunkerni tanlang: ustidagi gap rost bo\'lsa — «Ha», yolg\'on bo\'lsa — «Yo\'q».']
      : ['Yangi partiya! Konveyer ishga tushdi.'], 'idle');
    setTimeout(nextCard, 900);
  }
  round();
}
