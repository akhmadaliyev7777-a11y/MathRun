import { el } from '../util.js';
import { nav, footer, gradeData, applyKingdom } from '../app.js';
import { readBest } from '../util.js';
import { TOPIC_TITLES } from '../topicTitles.js';
import { simFor, SIM_VER } from '../sims.js';

// Mavzu simulyatori: tepada interaktiv simulyator, ostida shu mavzuning testlari (darslar)
export function render(root, [gradeStr, chorakStr, blokStr]) {
  const grade = Number(gradeStr), chorakNo = Number(chorakStr), blok = Number(blokStr);
  const g = gradeData(grade);
  const chorak = g && g.choraks.find(c => c.chorak === chorakNo);
  const block = chorak && chorak.blocks.find(b => b.blok === blok);
  const sim = simFor(grade, chorakNo, blok);
  if (!block || !sim) { location.hash = g ? `#/g/${grade}/c/${chorakNo || 1}` : '#/'; return; }
  applyKingdom(g);
  const idx = chorak.blocks.indexOf(block);
  const title = (TOPIC_TITLES[`g${grade}_c${chorakNo}`] || [])[idx] || block.name;
  const best = readBest();

  const frame = el('iframe', { class: 'simframe', src: `${sim.src}?v=${SIM_VER}`, title: sim.title, allowfullscreen: true });
  // simulyator o'z balandligini yuboradi — sahifada ichki aylantirishsiz to'liq ko'rinadi
  const onMsg = (e) => { if (e.data && e.data.type === 'mathrun:height' && e.source === frame.contentWindow) frame.style.height = Math.max(300, Math.ceil(e.data.h)) + 'px'; };
  addEventListener('message', onMsg);
  addEventListener('hashchange', () => removeEventListener('message', onMsg), { once: true });

  const testBtn = (lv, i) => {
    const done = best[lv.id]?.stars || 0;
    return lv.webSupported
      ? el('a', { class: 'tbtn' + (i === 0 ? ' tbtn--primary' : ''), href: `#/play/${lv.id}` }, `${i + 1}-dars`, done ? el('span', { class: 'tbtn__star' }, '★'.repeat(done)) : null)
      : el('span', { class: 'tbtn tbtn--soon' }, `${i + 1}-dars`);
  };

  root.replaceChildren(
    nav('mavzular'),
    el('main', { class: 'wrap' },
      el('div', { class: 'crumb' },
        el('button', { onclick: () => location.hash = '#/' }, 'Boshlang\'ich sinflar'),
        el('span', {}, '/'),
        el('button', { onclick: () => location.hash = `#/g/${grade}/c/${chorakNo}` }, `${grade}-sinf · ${chorak.roman} chorak`),
        el('span', {}, '/'),
        el('span', { class: 'now' }, `${blok}-mavzu`)),
      el('div', { class: 'simhead' },
        el('span', { class: 'simbadge' }, 'Simulyator'),
        el('h1', {}, `${blok}. ${title}`)),
      frame,
      el('div', { class: 'simtests' },
        el('div', {},
          el('b', {}, 'Endi o\'zingizni sinang'),
          el('span', {}, ' — mavzu bo\'yicha testlar:')),
        el('div', { class: 'trow__levels' }, ...block.levels.map(testBtn)))),
    footer());
}
