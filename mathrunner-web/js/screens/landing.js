import { el } from '../util.js';
import { ICON } from '../icons.js';
import { nav, footer, curriculum, applyKingdom } from '../app.js';

export function render(root, _params) {
  applyKingdom(null);
  const cur = curriculum();
  const t = cur.totals;

  // o'ng tomondagi ko'rgazma: test kartochkasi + "Dars tugadi" yorlig'i + kasrli misol kartochkasi
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
      el('div', { class: 'sc-tug__head' }, el('b', {}, 'Kasrlar'), el('small', {}, '4-sinf')),
      el('div', { class: 'sc-frac sc-math' },
        el('span', { class: 'sc-f' }, el('i', {}, '3'), el('i', {}, '4')), el('span', {}, '+'),
        el('span', { class: 'sc-f' }, el('i', {}, '1'), el('i', {}, '4')), el('span', {}, '='), el('b', {}, '1'))));

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
          el('h1', { html: 'Butun matematika darsligi —<br>interaktiv darslar bilan' }),
          el('p', { class: 'hero__sub' },
            '1–4 sinfning har bir darsi — alohida bosqich. Sinf va chorakni tanlang, mavzuni oching va darslarni bajaring. Hammasi ochiq.'),
          el('div', { class: 'hero__cta' },
            el('a', { href: '#/g/1/c/1', class: 'btn' }, 'Mavzularni ochish',
              el('span', { style: 'width:20px;height:20px', html: ICON.arrowRight })),
            el('a', { href: '#/about' }, 'Loyiha qanday ishlaydi?')),
          el('div', { class: 'stats' },
            el('div', { class: 'stat' }, el('b', {}, String(t.levels)), el('span', {}, 'dars-bosqich')),
            el('div', { class: 'stat' }, el('b', {}, `${(t.questions + t.gameTasks).toLocaleString('ru-RU')}+`), el('span', {}, 'savol va topshiriq')),
            el('div', { class: 'stat' }, el('b', {}, '4'), el('span', {}, 'sinf · 16 chorak')),
            el('div', { class: 'stat' }, el('b', {}, String(cur.grades.reduce((n, g) => n + g.choraks.reduce((m, c) => m + c.blocks.length, 0), 0))), el('span', {}, 'mavzu')))),
        heroCard),
      // kingdoms
      el('section', { class: 'section' },
        el('h2', {}, 'Sinfingizni tanlang'),
        el('p', { class: 'section__lead' }, 'Har sinf — o\'z olami. Barcha chorak va bloklar boshidanoq ochiq.'),
        el('div', { class: 'kingdoms' }, ...cur.grades.map(kcard))),
      // how
      el('section', { class: 'section' },
        el('h2', {}, 'Qanday ishlaydi'),
        el('div', { class: 'how' },
          howcard(1, 'var(--tint)', 'var(--violet)', 'Sinf va chorakni tanlang', 'Maktabda o\'tilgan mavzuni toping — sinf → chorak → blok.'),
          howcard(2, '#e6f7f4', '#16a394', 'Darsni bajaring', 'Har bir darsda 10 ta savol yoki topshiriq. Vaqt bosimi yo\'q, xatoni tuzatib bo\'ladi.'),
          howcard(3, 'var(--tint)', 'var(--violet)', 'Yulduz va natijani ko\'ring', 'Aniqlikka qarab 1–3 yulduz, eng yaxshi natija saqlanadi (shu brauzerda).')))),
    footer());
}
