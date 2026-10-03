import { el, shuffle } from '../util.js';
import { GAME_META, levelsByKind } from '../gameMeta.js';
import { ICON } from '../icons.js';
import { nav, footer, curriculum, applyKingdom } from '../app.js';

export function render(root, _params) {
  applyKingdom(null);
  const cur = curriculum();
  const t = cur.totals;

  // o'ng tomondagi ko'rgazma: test kartochkasi + "Dars tugadi" yorlig'i + arqon tortish mini kartochkasi
  const ans = (v, ok) => el('div', { class: 'sc-ans' + (ok ? ' sc-ans--ok' : '') },
    el('span', { class: 'sc-math' }, v), ok && el('span', { class: 'sc-ans__check', html: ICON.check }));
  const heroCard = el('div', { class: 'showcase', 'aria-hidden': 'true' },
    el('div', { class: 'showcase__blob' }),
    el('div', { class: 'sc-card' },
      el('div', { class: 'sc-card__top' },
        el('span', {}, '1-sinf · 7-mavzu · 1-dars'), el('b', {}, '4 / 10')),
      el('div', { class: 'sc-bar' }, el('i', {})),
      el('div', { class: 'sc-q' },
        el('div', { class: 'sc-q__kicker' }, 'SAVOL'),
        el('div', { class: 'sc-math sc-q__f' }, '7 + 5 = ?')),
      el('div', { class: 'sc-answers' }, ans('12', true), ans('11'), ans('13'), ans('10'))),
    el('div', { class: 'sc-chip sc-chip--stars' },
      el('span', { class: 'sc-stars' }, ...[0, 1, 2].map(() => el('span', { html: ICON.star }))),
      el('span', {}, el('b', {}, 'Dars tugadi!'), el('small', {}, '10 dan 10'))),
    el('div', { class: 'sc-chip sc-chip--tug' },
      el('div', { class: 'sc-tug__head' }, el('b', {}, 'Arqon tortish'), el('small', {}, '2 jamoa')),
      el('div', { class: 'sc-rope' }, el('span', { class: 'sc-rope__knot' })),
      el('div', { class: 'sc-tug__score' }, el('span', { class: 'sc-blue' }, '3'), el('span', { class: 'sc-red' }, '1'))));

  const GRADE_BANNER = {
    1: 'assets/grade-1-banner.jpg', 2: 'assets/grade-2-banner.jpg',
    3: 'assets/grade-3-banner.jpg', 4: 'assets/grade-4-banner.jpg',
  };
  const kcard = (g) => el('button', {
    class: 'kcard', onclick: () => { location.hash = `#/g/${g.grade}/c/1`; },
  },
    el('div', {
      class: 'kcard__head',
      style: `background-image:url(${GRADE_BANNER[g.grade]}),${g.color.head}`,
    }),
    el('div', { class: 'kcard__body' },
      el('div', { class: 'kcard__title' }, `${g.grade}-sinf`),
      el('div', { class: 'kcard__meta' }, `${g.kingdomTitle} · ${g.levelCount} dars · ${g.choraks.length} chorak`),
      el('div', { class: 'kcard__go', style: `color:${g.color.accentDark}` }, 'Kirish',
        el('span', { style: 'width:16px;height:16px', html: ICON.arrowRight }))));

  // fikrlash o'yinlari: katta "Arqon tortish" kartochkasi + har bir o'yin kartochkasi
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
    el('img', { class: 'gfeature__img', src: 'assets/tug-characters.png', alt: '', loading: 'lazy', decoding: 'async' }));

  const howcard = (n, color, dark, title, body) => el('div', { class: 'howcard' },
    el('div', { class: 'hownum', style: `background:${color};color:${dark}` }, String(n)),
    el('h3', {}, title), el('p', {}, body));

  root.replaceChildren(
    nav('mavzular'),
    el('main', { class: 'wrap' },
      // hero
      el('div', { class: 'hero' },
        el('div', { class: 'hero__body' },
          el('div', { class: 'tag' },
            el('span', { style: 'width:15px;height:15px', html: ICON.check }),
            'Bepul · qulfsiz · ro\'yxatdan o\'tishsiz'),
          el('h1', { html: 'Butun matematika darsligi —<br>o\'yin bo\'lib brauzerda' }),
          el('p', { class: 'hero__sub' },
            '1–4 sinfning har bir darsi — alohida bosqich. Sinf va chorakni tanlang, mavzu testini yeching, fikrlash jumboqlarini o\'ynang. Hammasi ochiq.'),
          el('div', { class: 'hero__cta' },
            el('a', { href: '#/g/1/c/1', class: 'btn' }, 'Mavzularni ochish',
              el('span', { style: 'width:20px;height:20px', html: ICON.arrowRight })),
            el('a', { href: '#/about' }, 'Loyiha qanday ishlaydi?')),
          el('div', { class: 'stats' },
            el('div', { class: 'stat' }, el('b', {}, String(t.levels)), el('span', {}, 'dars-bosqich')),
            el('div', { class: 'stat' }, el('b', {}, `${(t.questions + t.gameTasks).toLocaleString('ru-RU')}+`), el('span', {}, 'savol va topshiriq')),
            el('div', { class: 'stat' }, el('b', {}, '4'), el('span', {}, 'sinf · 16 chorak')),
            el('div', { class: 'stat' }, el('b', {}, '7'), el('span', {}, 'fikrlash o\'yini')))),
        heroCard),
      // kingdoms
      el('section', { class: 'section' },
        el('h2', {}, 'Sinfingizni tanlang'),
        el('p', { class: 'section__lead' }, 'Har sinf — o\'z olami. Barcha chorak va bloklar boshidanoq ochiq.'),
        el('div', { class: 'kingdoms' }, ...cur.grades.map(kcard))),
      // games
      el('section', { class: 'section' },
        el('div', { class: 'section__head' },
          el('h2', {}, 'Fikrlash o\'yinlari'),
          el('a', { class: 'section__more', href: '#/games' }, 'Barchasini ochish',
            el('span', { style: 'width:16px;height:16px', html: ICON.arrowRight }))),
        el('p', { class: 'section__lead' }, 'Mavzuni o\'yin orqali mustahkamlang. Kartochkani bosing — tasodifiy bosqich ochiladi.'),
        el('div', { class: 'gbento' }, tugCard, ...GAME_META.map(gcard))),
      // how
      el('section', { class: 'section' },
        el('h2', {}, 'Qanday ishlaydi'),
        el('div', { class: 'how' },
          howcard(1, 'var(--tint)', 'var(--violet)', 'Sinf va chorakni tanlang', 'Maktabda o\'tilgan mavzuni toping — sinf → chorak → blok.'),
          howcard(2, '#e6f7f4', '#16a394', 'Testni yeching yoki o\'ynang', '10 ta savol yoki fikrlash jumboqi. Vaqt bosimi yo\'q, xatoni tuzatib bo\'ladi.'),
          howcard(3, 'var(--tint)', 'var(--violet)', 'Yulduz va natijani ko\'ring', 'Aniqlikka qarab 1–3 yulduz, eng yaxshi natija saqlanadi (shu brauzerda).')))),
    footer());
}
