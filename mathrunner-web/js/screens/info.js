import { el, readBest } from '../util.js';
import { ICON } from '../icons.js';
import { nav, footer, applyKingdom, curriculum } from '../app.js';
import { GAME_META, levelsByKind } from '../gameMeta.js';
import { topicTitle, MASHQ_SIZE } from '../topicTitles.js';

export function render(root, [which, kind]) {
  applyKingdom(null);
  if (which === 'games' && kind) return renderPick(root, kind);
  if (which === 'games') return renderGames(root);
  return renderAbout(root);
}

function renderGames(root) {
  // katta "Arqon tortish" kartochkasi + har bir o'yin kartochkasi (bosilganda — shu o'yinning mavzularini tanlash)
  const byKind = levelsByKind();
  const gcard = (m) => {
    const pool = byKind[m.kind] || [];
    return el('button', {
      class: 'gcard', style: `--gc:${m.dark}`, disabled: pool.length === 0,
      onclick: () => { if (pool.length) location.hash = `#/games/${m.kind}`; },
    },
      el('span', { class: 'gcard__icon', html: ICON[m.icon] }),
      el('span', { class: 'gcard__name' }, m.name),
      el('span', { class: 'gcard__desc' }, m.desc),
      el('span', { class: 'gcard__meta' }, `${pool.length} bosqich`,
        el('span', { class: 'gcard__go', html: ICON.arrowRight })));
  };
  const tugCard = el('a', { class: 'gfeature', href: '#/tug' },
    el('div', { class: 'gfeature__text' },
      el('span', { class: 'gfeature__tag' }, 'Sinf uchun · 2 jamoa'),
      el('h3', {}, 'Arqon tortish'),
      el('p', {}, 'Sinf ikki jamoaga bo\'linadi. To\'g\'ri javob arqonni o\'z tomoningizga tortadi — vaqt tugaguncha kim kuchli?'),
      el('span', { class: 'gfeature__btn' }, 'O\'ynash', el('span', { class: 'gcard__go', html: ICON.arrowRight }))),
    el('img', { class: 'gfeature__img', src: 'assets/tug-characters.png', alt: '', decoding: 'async' }));

  // o'yinlar — alohida bo'lim (yuqori menyudan), boshlang'ich sinflar ichki menyusisiz
  root.replaceChildren(
    el('main', { class: 'wrap' },
      el('section', { class: 'section' },
        el('h2', {}, 'Fikrlash o\'yinlari'),
        el('p', { class: 'section__lead' },
          'Mavzuni o\'yin orqali mustahkamlang. O\'yinni tanlang, so\'ng sinf va mavzuni tanlang.'),
        el('div', { class: 'gbento' }, tugCard, ...GAME_META.map(gcard)))),
    footer());
}

// o'yinga kirishdan oldin — mavzu tanlash: sinflar bo'yicha, har mavzuda mashq tugmalari (yulduzlar bilan)
function renderPick(root, kind) {
  const meta = GAME_META.find(m => m.kind === kind);
  const pool = levelsByKind()[kind] || [];
  if (!meta || !pool.length) { location.hash = '#/games'; return; }
  const best = readBest();
  const cur = curriculum();
  const grades = [...new Set(pool.map(l => l.grade))].sort((a, b) => a - b);
  const card = (lv) => {
    const g = cur.grades.find(x => x.grade === lv.grade), c = g.choraks.find(x => x.chorak === lv.chorak), b = c.blocks.find(x => x.blok === lv.block);
    const n = Math.max(1, Math.ceil(lv.count / MASHQ_SIZE));
    const nomli = lv.mashqNomlari && n > 1 && lv.mashqNomlari[0] !== lv.mashqNomlari[1];
    return el('div', { class: 'opick' },
      el('div', { class: 'opick__top' },
        el('span', { class: 'opick__num' }, String(lv.block)),
        el('div', {}, el('b', { class: 'opick__nom' }, topicTitle(g, c, b)), el('small', {}, `${c.roman} chorak · ${lv.block}-mavzu`))),
      el('div', { class: 'opick__btns' }, ...Array.from({ length: n }, (_, i) => {
        const stars = best[`${lv.id}:m${i + 1}`]?.stars || 0;
        return el('a', { class: 'tbtn' + (i === 0 ? ' tbtn--primary' : ''), href: `#/play/${lv.id}/${i + 1}`,
          onclick: () => { try { sessionStorage.setItem('mw-oyin-qayt', JSON.stringify({ id: lv.id, hash: `#/games/${kind}` })); } catch { /* */ } } },
          nomli ? lv.mashqNomlari[i] : `${i + 1}-mashq`, stars ? el('span', { class: 'tbtn__star' }, '★'.repeat(stars)) : null);
      })));
  };
  root.replaceChildren(
    el('main', { class: 'wrap' },
      el('section', { class: 'section' },
        el('a', { class: 'linkback', href: '#/games' }, '← Fikrlash o\'yinlari'),
        el('div', { class: 'opick-head', style: `--gc:${meta.dark}` },
          el('span', { class: 'gcard__icon', html: ICON[meta.icon] }),
          el('div', {}, el('h2', {}, meta.name), el('p', { class: 'section__lead' }, meta.desc + '. Sinf va mavzuni tanlang.'))),
        ...grades.map(gr => el('div', { class: 'opick-sinf' },
          el('h3', {}, `${gr}-sinf`),
          el('div', { class: 'opick-list' }, ...pool.filter(l => l.grade === gr).map(card)))))),
    footer());
}

function renderAbout(root) {
  const t = curriculum().totals;
  root.replaceChildren(nav('about'),
    el('main', { class: 'wrap' },
      el('section', { class: 'section' },
        el('h2', {}, 'Loyiha haqida'),
        el('p', { class: 'section__lead' },
          'Mathlearn — O\'zbekiston 1–4 sinf matematika darsligining ochiq, bepul ' +
          'interaktiv ko\'rinishi. Ro\'yxatdan o\'tish shart emas, hamma narsa qulfsiz.'),
        el('div', { class: 'stats', style: 'margin-top:8px' },
          el('div', { class: 'stat' }, el('b', {}, String(t.levels)), el('span', {}, 'dars-bosqich')),
          el('div', { class: 'stat' }, el('b', {}, String(t.questions)), el('span', {}, 'test savoli')),
          el('div', { class: 'stat' }, el('b', {}, String(curriculum().grades.reduce((n, g) => n + g.choraks.reduce((m, c) => m + c.blocks.length, 0), 0))), el('span', {}, 'mavzu'))),
        el('p', { style: 'font-weight:600;color:var(--muted);line-height:1.6;margin-top:20px' },
          'To\'liq versiya (do\'kon, XP va boshqalar) Android ilovasida. ' +
          'Bu sayt darslikni tez takrorlash uchun — maktabda o\'tilgan mavzuni uyda bir necha marta yechib mustahkamlaysiz.')),
      el('div', { style: 'padding:8px 0 8px' },
        el('a', { href: '#/', class: 'btn' }, 'Mavzularga o\'tish',
          el('span', { style: 'width:20px;height:20px', html: ICON.arrowRight })))),
    footer());
}
