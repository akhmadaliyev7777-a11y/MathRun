import { el, shuffle } from '../util.js';
import { ICON } from '../icons.js';
import { nav, footer, applyKingdom, curriculum } from '../app.js';
import { GAME_META, levelsByKind } from '../gameMeta.js';

export function render(root, [which]) {
  applyKingdom(null);
  if (which === 'games') return renderGames(root);
  return renderAbout(root);
}

function renderGames(root) {
  // katta "Arqon tortish" kartochkasi + har bir o'yin kartochkasi (bosilganda tasodifiy bosqich ochiladi)
  const byKind = levelsByKind();
  const gcard = (m) => {
    const pool = byKind[m.kind] || [];
    return el('button', {
      class: 'gcard', style: `--gc:${m.dark}`, disabled: pool.length === 0,
      onclick: () => { const lv = shuffle(pool)[0]; if (lv) location.hash = `#/play/${lv.id}`; },
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
          'Mavzuni o\'yin orqali mustahkamlang. Kartochkani bosing — o\'sha o\'yinning tasodifiy bosqichi ochiladi. ' +
          'Aniq mavzu bo\'yicha o\'ynash uchun "Mavzular" bo\'limidan tanlang.'),
        el('div', { class: 'gbento' }, tugCard, ...GAME_META.map(gcard)))),
    footer());
}

function renderAbout(root) {
  const t = curriculum().totals;
  root.replaceChildren(nav('about'),
    el('main', { class: 'wrap' },
      el('section', { class: 'section' },
        el('h2', {}, 'Loyiha haqida'),
        el('p', { class: 'section__lead' },
          'MathRunner Web — O\'zbekiston 1–4 sinf matematika darsligining ochiq, bepul ' +
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
