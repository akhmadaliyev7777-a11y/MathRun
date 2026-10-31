// «To'plamlar (Venn)» — koinot o'yini.
// Ikki to'plam — ikki sayyoraning tortishish maydoni, sonlar — meteoritlar. Meteorit navbat bilan bittadan keladi;
// o'quvchi maydonni bosadi, meteorit uchib boradi va darhol tekshiriladi. To'g'ri — ochko va kombo, meteorit
// orbitada aylanib qoladi; xato — yurak kamayadi, meteorit to'g'ri maydonga ko'chadi, Robi sababini bir qatorda
// aytadi (har to'plamga alohida ✓ / ✗). Raundda 3 ta yurak; tugasa — qolgan meteoritlar o'zi joyiga tushadi.
import { el, shuffle } from '../util.js';
import { shell } from './shell.js';
import { hud, buddy, sfx, floatText } from './hud.js?v=8';
import { RASM } from './rasmlar.js?v=2';

const inA = (z) => z === 'onlyA' || z === 'both';
const inB = (z) => z === 'onlyB' || z === 'both';

export function gameSet(ctx) {
  const tasks = ctx.bank;
  const s = shell(ctx, tasks[0].prompt, 'venn', true);
  const H = hud(3, 'kosmos');
  const B = buddy();
  let idx = 0, right = 0, placedAll = 0, longest = 0;
  const times = [];

  function round() {
    const t = tasks[idx];
    s.setProg(idx, tasks.length);
    H.resetHearts();
    const queue = shuffle(t.elements);
    const sonli = t.elements.every(e => /^\d+$/.test(String(e.value)));   // ismlar bo'lsa — «son» demaymiz
    const ZONE_SOZ = {
      both: "ikkala sayyoraga — o'rtadagi maydonga", onlyA: `faqat «${t.setAName}» sayyorasiga`,
      onlyB: `faqat «${t.setBName}» sayyorasiga`, neither: 'ochiq koinotga — hech qaysisiga',
    };
    let busy = false, mistakes = 0, shownAt = 0;

    // ---- taxta: ikki sayyora maydoni, yorliqlar, bosiladigan zonalar ----
    const board = el('div', { class: 'venn venn--kosmos' });
    const planet = (k) => {
      const src = k === 'a' ? RASM.sayyoraA : RASM.sayyoraB;
      return src ? el('img', { class: 'sayyora sayyora--' + k, src, alt: '' }) : el('span', { class: 'sayyora sayyora--' + k });
    };
    // tortishish maydoni: markazdagi sayyoradan to'lqinlar tarqalib turadi, orbitalar sekin aylanadi
    const field = (k) => el('div', { class: 'maydon maydon--' + k },
      el('i', { class: 'maydon__orbit' }), el('i', { class: 'maydon__orbit maydon__orbit--2' }),
      el('i', { class: 'maydon__tolqin' }), el('i', { class: 'maydon__tolqin' }), el('i', { class: 'maydon__tolqin' }));
    const fA = field('a'), fB = field('b');
    const pA = planet('a'), pB = planet('b');
    const lA = el('div', { class: 'venn__label vlabel vlabel--a' }, t.setAName);
    const lB = el('div', { class: 'venn__label vlabel vlabel--b' }, t.setBName);
    const zones = {};
    const region = (z) => {
      const tiles = el('div', { class: 'venn__tiles' });
      const r = el('button', { class: 'venn__zone', type: 'button', 'aria-label': ZONE_SOZ[z], onclick: () => place(z) }, tiles);
      zones[z] = { btn: r, tiles };
      return r;
    };
    const nLabel = el('div', { class: 'venn__none' }, 'Ochiq koinot · hech qaysisiga');
    board.append(fA, fB, pA, pB, lA, lB, region('onlyA'), region('both'), region('onlyB'), region('neither'), nLabel);

    const box = (e, l, t2, w, h) => Object.assign(e.style, { left: l + 'px', top: t2 + 'px', width: w + 'px', height: h + 'px' });
    function layout() {
      const W = board.clientWidth || 700;
      // markazlar orasi 0,64·D — har sayyora o'z maydoni ichida, o'rtadagi umumiy qism aniq ko'rinadi
      const D = Math.min(320, Math.round((W - 16) / 1.64));
      const top = 58, Hh = top + D + 14 + 58, mid = W / 2;
      const c1 = mid - D * 0.32, c2 = mid + D * 0.32, cy = top + D / 2;
      board.style.height = Hh + 'px';
      box(fA, c1 - D / 2, top, D, D); box(fB, c2 - D / 2, top, D, D);
      const ps = Math.round(D * 0.2);                                   // sayyora — doira markazida
      box(pA, c1 - ps / 2, cy - ps / 2, ps, ps); box(pB, c2 - ps / 2, cy - ps / 2, ps, ps);
      const lw = Math.max(110, Math.round(W * 0.42));
      box(lA, 10, 8, lw, 44); box(lB, W - lw - 10, 8, lw, 44);
      const zt = top + D * 0.14, zh = D * 0.72;
      const aL = c1 - D / 2 + 4, bothL = mid - D * 0.18 + 2, bothR = mid + D * 0.18 - 2, bR = c2 + D / 2 - 4;
      box(zones.onlyA.btn, aL, zt, bothL - 4 - aL, zh); box(zones.both.btn, bothL, zt, bothR - bothL, zh); box(zones.onlyB.btn, bothR + 4, zt, bR - bothR - 4, zh);
      // meteoritlar sayyora ustiga tushmasin — chap maydonda sayyoradan chaproqda, o'ngda o'ngroqda turadi
      zones.onlyA.tiles.style.paddingRight = Math.max(4, bothL - 4 - (c1 - ps / 2 - 2)) + 'px';
      zones.onlyB.tiles.style.paddingLeft = Math.max(4, (c2 + ps / 2 + 2) - (bothR + 4)) + 'px';
      box(zones.neither.btn, 8, top + D + 8, W - 16, 54);
      nLabel.style.top = (top + D + 12) + 'px';
      board.classList.toggle('venn--small', W < 520);
    }
    const ro = new ResizeObserver(layout); ro.observe(board);
    addEventListener('hashchange', () => ro.disconnect(), { once: true });

    // ---- navbatdagi meteorit (katta) va undan keyingilari (xira) ----
    const wide = (v) => String(v).length > 3 || !sonli;
    const meteor = (v, cls = '') => {
      const m = el('span', { class: 'meteor' + (wide(v) ? ' meteor--keng' : '') + cls }, el('b', {}, v));
      if (RASM.meteorit) m.style.backgroundImage = `url(${RASM.meteorit})`;
      return m;
    };
    const launch = el('div', { class: 'launch' });
    function drawLaunch() {
      if (!queue.length) { launch.replaceChildren(); return; }
      const [cur, ...rest] = queue;
      launch.replaceChildren(
        el('span', { class: 'launch__lab' }, sonli ? 'Navbatdagi meteorit' : 'Navbatdagi'),
        el('div', { class: 'launch__row' }, meteor(cur.value, ' meteor--katta launch__cur'), ...rest.slice(0, 3).map(e => meteor(e.value, ' launch__next'))));
      shownAt = performance.now();
    }

    const chip = (name, yes) => el('span', { class: 'rchip ' + (yes ? 'rchip--ha' : 'rchip--yoq') }, `${name} ${yes ? '✓' : '✗'}`);
    const reason = (e) => [
      el('b', { class: 'rnum' }, e.value), ' ',
      chip(t.setAName, inA(e.zone)), chip(t.setBName, inB(e.zone)),
      el('span', { class: 'rto' }, '→ ' + ZONE_SOZ[e.zone])];

    // meteorit uchib, berilgan maydonga boradi (orqasida olovli iz)
    function fly(e, z, cls, done) {
      const from = launch.querySelector('.launch__cur') || launch;
      const a = from.getBoundingClientRect(), b = zones[z].tiles.getBoundingClientRect();
      const f = meteor(e.value, ' meteor--katta fly' + cls);
      Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
      document.body.append(f);
      requestAnimationFrame(() => {
        f.style.transform = `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.62) rotate(200deg)`;
      });
      setTimeout(() => { f.remove(); done(); }, 420);
    }
    const flash = (z, ok) => {
      const b = zones[z].btn; b.classList.remove('ok', 'bad'); void b.offsetWidth; b.classList.add(ok ? 'ok' : 'bad');
      if (ok) for (const f of [inA(z) && fA, inB(z) && fB]) if (f) { f.classList.remove('tort'); void f.offsetWidth; f.classList.add('tort'); }
    };
    // orbitadagi meteoritlar har xil tezlikda chayqalib turadi
    const landed = (e, cls) => { const m = meteor(e.value, ' meteor--kichik' + cls); m.style.animationDelay = `${-Math.random() * 3}s`; return m; };

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
          const m = landed(e, ' is-in'); zones[z].tiles.append(m);
          flash(z, true); sfx.ok();
          H.add(10 * k + (fast ? 5 : 0), m);
          if (fast && k < 2) setTimeout(() => floatText('⚡ Tez!', m, 'hud-float--tez'), 150);
          B.say(reason(e), 'ok');
          queue.shift(); next();
        } else {
          mistakes++; H.miss(); sfx.bad();
          const wrong = landed(e, ' is-wrong'); zones[z].tiles.append(wrong);
          flash(z, false);
          const left = H.loseHeart();
          B.say(reason(e), 'bad');
          // bir lahza noto'g'ri maydonda turadi, so'ng tortishish kuchi uni to'g'ri maydonga olib ketadi
          setTimeout(() => {
            wrong.remove();
            zones[e.zone].tiles.append(landed(e, ' is-fixed'));
            flash(e.zone, true);
            queue.shift();
            if (left === 0) autoRest(); else next();
          }, 950);
        }
      });
    }
    function next() { busy = false; drawLaunch(); if (!queue.length) endRound(); }

    // yuraklar tugadi — qolgan meteoritlar o'zi joyiga tushadi (to'g'ri javob sifatida hisoblanmaydi)
    function autoRest() {
      B.say([`Yuraklar tugadi. Qolgan ${sonli ? 'meteoritlar' : 'javoblar'} qayerga tushishini kuzating.`], 'think');
      const step = () => {
        if (!queue.length) { busy = false; drawLaunch(); return endRound(); }
        const e = queue[0]; placedAll++;
        drawLaunch();
        fly(e, e.zone, ' is-auto', () => { zones[e.zone].tiles.append(landed(e, ' is-fixed')); queue.shift(); setTimeout(step, 250); });
      };
      setTimeout(step, 600);
    }

    function endRound() {
      const clean = mistakes === 0;
      if (clean) { H.add(30, board); sfx.win(); }
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
    // umumiy ko'rsatmani Robi aytadi — ko'k panel faqat topshiriqning o'z ma'lumoti bo'lsa (masalan bolalar ro'yxati) qoladi
    const bar = ctx.root.querySelector('.prompt');
    if (bar) bar.hidden = /^Har bir sonni/.test(t.prompt || '');
    const sahna = el('div', { class: 'sahna sahna--kosmos' }, H.node, B.node, launch, board);
    if (RASM.vennFon) Object.assign(sahna.style, { backgroundImage: `url(${RASM.vennFon})`, backgroundSize: 'cover', backgroundPosition: 'center' });
    s.area.replaceChildren(sahna);
    s.foot.replaceChildren();
    layout();
    // telefonda o'yin maydoni bitta ekranga sig'sin — sahifa o'zi pastga suriladi
    if (innerWidth < 700) requestAnimationFrame(() => {
      const head = document.querySelector('.site-header')?.offsetHeight || 0;
      scrollTo({ top: sahna.getBoundingClientRect().top + scrollY - head - 6, behavior: idx ? 'smooth' : 'auto' });
    });
    B.say(idx === 0
      ? [`Har ${sonli ? 'bir meteoritni' : 'birini'} ikki savol bilan tekshiring: «${t.setAName}»mi? «${t.setBName}»mi? Keyin kerakli maydonni bosing.`]
      : [`Yangi raund: «${t.setAName}» va «${t.setBName}» sayyoralari.`], 'idle');
  }
  round();
}
