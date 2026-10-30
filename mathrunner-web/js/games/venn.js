// «To'plamlar (Venn)» — o'yin ko'rinishida.
// Sonlar navbat bilan bittadan keladi; o'quvchi zonani bosadi, son uchib boradi va darhol tekshiriladi.
// To'g'ri — ochko va kombo; xato — yurak kamayadi, son to'g'ri joyiga ko'chadi, Madina sababini bir qatorda aytadi
// (har bir to'plamga alohida: ✓ yoki ✗). Raundda 3 ta yurak; tugasa — qolgan sonlar o'zi joyiga tushadi.
import { el, shuffle } from '../util.js';
import { shell } from './shell.js';
import { hud, buddy, sfx, floatText } from './hud.js';

const ZONE_SOZ = { both: "o'rtaga — ikkalasiga ham", onlyA: 'faqat chap doiraga', onlyB: "faqat o'ng doiraga", neither: 'tashqariga — hech qaysisiga' };
const inA = (z) => z === 'onlyA' || z === 'both';
const inB = (z) => z === 'onlyB' || z === 'both';

export function gameSet(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'venn', true);
  const H = hud(3);
  const B = buddy();
  let idx = 0, right = 0, placedAll = 0, longest = 0;
  const times = [];

  function round() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    H.resetHearts();
    const queue = shuffle(t.elements);
    const sonli = t.elements.every(e => /^\d+$/.test(String(e.value)));   // ismlar bo'lsa — «son» demaymiz
    let busy = false, mistakes = 0, shownAt = 0;

    // ---- taxta: ikki doira, yorliqlar, bosiladigan zonalar ----
    const board = el('div', { class: 'venn venn--game' });
    const cA = el('div', { class: 'venn__circle', style: 'border-color:var(--k-accent);background:color-mix(in srgb,var(--k-accent) 8%,transparent)' });
    const cB = el('div', { class: 'venn__circle', style: 'border-color:var(--orange);background:color-mix(in srgb,var(--orange) 8%,transparent)' });
    const lA = el('div', { class: 'venn__label', style: 'color:var(--k-accent-dark)' }, t.setAName);
    const lB = el('div', { class: 'venn__label venn__label--b', style: 'text-align:right' }, t.setBName);
    const zones = {};
    const region = (z) => {
      const tiles = el('div', { class: 'venn__tiles' });
      const r = el('button', { class: 'venn__zone', type: 'button', 'aria-label': ZONE_SOZ[z], onclick: () => place(z) }, tiles);
      zones[z] = { btn: r, tiles };
      return r;
    };
    const nLabel = el('div', { class: 'venn__none' }, 'Hech qaysisiga');
    board.append(cA, cB, lA, lB, region('onlyA'), region('both'), region('onlyB'), region('neither'), nLabel);

    const box = (e, l, t2, w, h) => Object.assign(e.style, { left: l + 'px', top: t2 + 'px', width: w + 'px', height: h + 'px' });
    function layout() {
      const W = board.clientWidth || 700;
      const D = Math.min(300, Math.round(W * 0.6));
      const top = 56, Hh = top + D + 12 + 56;
      const c1 = W / 2 - D * 0.25, c2 = W / 2 + D * 0.25;
      board.style.height = Hh + 'px';
      box(cA, c1 - D / 2, top, D, D); box(cB, c2 - D / 2, top, D, D);
      const lw = Math.max(110, Math.round(W * 0.42));
      box(lA, 10, 8, lw, 44); box(lB, W - lw - 10, 8, lw, 44);
      const zt = top + D * 0.14, zh = D * 0.72, half = D * 0.5;
      box(zones.onlyA.btn, c1 - D / 2 + 6, zt, half - 8, zh); box(zones.both.btn, c2 - D / 2 + 4, zt, half - 8, zh); box(zones.onlyB.btn, c1 + D / 2 + 2, zt, half - 8, zh);
      box(zones.neither.btn, 8, top + D + 8, W - 16, 52);
      nLabel.style.top = (top + D + 12) + 'px';
      board.classList.toggle('venn--small', W < 520);
    }
    const ro = new ResizeObserver(layout); ro.observe(board);
    addEventListener('hashchange', () => ro.disconnect(), { once: true });

    // ---- pastda: navbatdagi son (katta) va undan keyingilari (xira) ----
    const launch = el('div', { class: 'launch' });
    function drawLaunch() {
      if (!queue.length) { launch.replaceChildren(); return; }
      const [cur, ...rest] = queue;
      launch.replaceChildren(
        el('span', { class: 'launch__lab' }, sonli ? 'Navbatdagi son' : 'Navbatdagi'),
        el('div', { class: 'launch__row' },
          el('div', { class: 'tile launch__cur' + (String(cur.value).length > 3 ? ' tile--wide' : '') }, cur.value),
          ...rest.slice(0, 3).map(e => el('div', { class: 'tile tile--sm launch__next' + (String(e.value).length > 3 || !sonli ? ' tile--wide' : '') }, e.value))));
      shownAt = performance.now();
    }

    const chip = (name, yes) => el('span', { class: 'rchip ' + (yes ? 'rchip--ha' : 'rchip--yoq') }, `${name} ${yes ? '✓' : '✗'}`);
    const reason = (e) => [
      el('b', { class: 'rnum' }, e.value), ' ',
      chip(t.setAName, inA(e.zone)), chip(t.setBName, inB(e.zone)),
      el('span', { class: 'rto' }, '→ ' + ZONE_SOZ[e.zone])];

    // son ko'rinadigan tile — zonaga qo'yiladi
    const tileFor = (e, cls = '') => el('span', { class: 'tile tile--sm' + (String(e.value).length > 3 ? ' tile--wide' : '') + cls }, e.value);

    // navbatdagi son uchib, berilgan zonaga boradi
    function fly(e, z, cls, done) {
      const from = launch.querySelector('.launch__cur') || launch;
      const a = from.getBoundingClientRect(), b = zones[z].tiles.getBoundingClientRect();
      const f = el('div', { class: 'tile fly' + cls, style: `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px` }, e.value);
      document.body.append(f);
      requestAnimationFrame(() => {
        f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.75)`;
      });
      setTimeout(() => { f.remove(); done(); }, 380);
    }
    const flash = (z, ok) => { const b = zones[z].btn; b.classList.remove('ok', 'bad'); void b.offsetWidth; b.classList.add(ok ? 'ok' : 'bad'); };

    function place(z) {
      if (busy || !queue.length) return;
      busy = true;
      const e = queue[0];
      times.push(performance.now() - shownAt);
      const ok = e.zone === z;
      placedAll++;
      fly(e, z, '', () => {
        if (ok) {
          right++;
          const k = H.hit(); longest = Math.max(longest, H.st.combo);
          const fast = performance.now() - shownAt < 3500;
          const tile = tileFor(e, ' is-in'); zones[z].tiles.append(tile);
          flash(z, true); sfx.ok();
          H.add(10 * k + (fast ? 5 : 0), tile);
          if (fast && k < 2) setTimeout(() => floatText('⚡ Tez!', tile, 'hud-float--tez'), 150);
          B.say(reason(e), 'ok');
          queue.shift(); next();
        } else {
          mistakes++; H.miss(); sfx.bad();
          const wrongTile = tileFor(e, ' is-wrong'); zones[z].tiles.append(wrongTile);
          flash(z, false);
          const left = H.loseHeart();
          B.say(reason(e), 'bad');
          // bir lahza xato joyda turadi, so'ng to'g'ri zonaga ko'chadi
          setTimeout(() => {
            wrongTile.remove();
            zones[e.zone].tiles.append(tileFor(e, ' is-fixed'));
            flash(e.zone, true);
            queue.shift();
            if (left === 0) autoRest(); else next();
          }, 900);
        }
      });
    }
    function next() { busy = false; drawLaunch(); if (!queue.length) endRound(); }

    // yuraklar tugadi — qolgan sonlar o'zi joyiga tushadi (to'g'ri javob sifatida hisoblanmaydi)
    function autoRest() {
      B.say(['Yuraklar tugadi. Qolgan sonlar qayerga tushishini kuzating.'], 'think');
      const step = () => {
        if (!queue.length) { busy = false; drawLaunch(); return endRound(); }
        const e = queue[0]; placedAll++;
        drawLaunch();
        fly(e, e.zone, ' is-auto', () => { zones[e.zone].tiles.append(tileFor(e, ' is-fixed')); queue.shift(); setTimeout(step, 250); });
      };
      setTimeout(step, 600);
    }

    function endRound() {
      const clean = mistakes === 0;
      if (clean) { const bonus = 30; H.add(bonus, board); sfx.win(); }
      const last = idx + 1 >= tasks.length;
      s.foot.replaceChildren(
        el('div', { class: 'rend ' + (clean ? 'rend--ok' : '') },
          el('b', {}, clean ? 'Xatosiz! +30 bonus' : mistakes === 1 ? 'Bitta xato bilan — yaxshi!' : `${mistakes} ta xato — keyingisida diqqat bilan!`),
          el('button', { class: 'btn btn--accent', type: 'button', onclick: () => {
            idx++;
            if (idx >= tasks.length) {
              const avgMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
              ctx.finish(right, placedAll, { longestStreak: longest, avgMs, score: H.st.score });
            } else round();
          } }, last ? 'Natijani ko\'rish' : 'Keyingi raund ➜')));
    }

    drawLaunch();
    // umumiy ko'rsatmani Madina aytadi — ko'k panel faqat topshiriqning o'z ma'lumoti bo'lsa (masalan bolalar ro'yxati) qoladi
    const bar = ctx.root.querySelector('.prompt');
    if (bar) bar.hidden = /^Har bir sonni/.test(t.prompt || '');
    s.area.replaceChildren(H.node, B.node, launch, board);
    s.foot.replaceChildren();
    layout();
    // telefonda o'yin maydoni (panel, son, doiralar) bitta ekranga sig'sin — sahifa o'zi pastga suriladi
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: H.node.getBoundingClientRect().top + scrollY - head - 8, behavior: idx ? 'smooth' : 'auto' });
    });
    B.say(idx === 0
      ? [`Har ${sonli ? 'bir sonni' : 'birini'} ikki savol bilan tekshiring: «${t.setAName}»mi? «${t.setBName}»mi? Keyin kerakli joyni bosing.`]
      : [`Yangi raund: «${t.setAName}» va «${t.setBName}».`], 'idle');
  }
  round();
}
