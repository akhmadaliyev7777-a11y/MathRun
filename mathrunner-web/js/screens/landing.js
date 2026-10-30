import { el } from '../util.js';
import { ICON } from '../icons.js';
import { nav, footer, curriculum, applyKingdom } from '../app.js';

export function render(root, _params) {
  applyKingdom(null);
  const cur = curriculum();
  const t = cur.totals;

  // o'ng tomonda — faqat boshlang'ich sinflarga xos slayd-shou (../js/slayd.js)
  const olamlar = cur.grades.map((g) =>
    `<a class="hs-row" href="#/g/${g.grade}/c/1"><span class="hs-ico"><img src="../img/sinf/${g.grade}.webp?v=3" alt="" width="48" height="48" loading="lazy"></span>` +
    `<span>${g.grade}-sinf · ${g.kingdomTitle}<small>${g.levelCount} dars</small></span><b aria-hidden="true">→</b></a>`).join('');
  const slides = [
    '<div class="hs-slide hs-rasm"><img class="gp-kun" src="../img/hero/boshlangich.webp?v=1" alt=""><img class="gp-tun" src="../img/hero/boshlangich-tun.webp?v=1" alt="" loading="lazy"></div>',
    '<div class="hs-slide hs-oyin">' +
      '<img src="assets/tug/jamoa.webp" alt="Arqon tortayotgan bolalar" loading="lazy">' +
      '<span class="hs-label">Sinf bilan o\'yin</span>' +
      '<h3>Arqon tortish</h3>' +
      '<p>To\'g\'ri javob — arqon sizning tomonga! Sinf ikki jamoaga bo\'linib bellashadi.</p>' +
      '<a class="hs-btn" href="#/tug">O\'ynash →</a>' +
    '</div>',
    '<div class="hs-slide hs-feature">' +
      '<span class="hs-big hs-yulduz" aria-hidden="true"><b>7 + 5 = 12</b><i>✓</i></span>' +
      '<span class="hs-text">' +
        '<span class="hs-label">Har dars — 10 savol</span>' +
        '<h3>Qisqa dars — katta qadam</h3>' +
        '<p>Shoshilish shart emas: xato bo\'lsa, tuzatib qayta urinasiz.</p>' +
        '<a class="hs-btn" href="#/g/1/c/1">Boshlash →</a>' +
      '</span>' +
    '</div>',
    '<div class="hs-slide hs-list">' +
      '<span class="hs-label">To\'rt sinf — to\'rt olam</span>' +
      '<h3>Qaysi olamga borasiz?</h3>' + olamlar +
    '</div>',
  ];
  const slider = el('div', { class: 'hero-slider mw-slider', role: 'region', 'aria-roledescription': 'slayd-shou', 'aria-label': 'Boshlang\'ich sinflar' });
  if (window.mountHeroSlider) window.mountHeroSlider(slider, slides);

  // sinf kartochkasi — asosiy saytdagi kabi afisha (../img/sinf/<sinf>.webp, tungi rejimda <sinf>-tun.webp)
  const kcard = (g) => {
    const mavzu = g.choraks.reduce((n, c) => n + c.blocks.length, 0);
    return el('a', { class: 'grade-poster grade-poster--primary grade-poster--tun', href: `#/g/${g.grade}/c/1` },
      el('span', { class: 'gp-art' },
        el('img', { class: 'gp-kun', src: `../img/sinf/${g.grade}.webp?v=3`, alt: '', loading: 'lazy', decoding: 'async' }),
        el('img', { class: 'gp-tun', src: `../img/sinf/${g.grade}-tun.webp?v=1`, alt: '', loading: 'lazy', decoding: 'async' })),
      el('span', { class: 'gp-body' },
        el('span', { class: 'gp-name' }, `${g.grade}-sinf`),
        el('span', { class: 'gp-subj' }, 'Mavzular · Testlar'),
        el('span', { class: 'gp-meta', html: `${mavzu} mavzu · <b>${g.levelCount} dars</b>` })));
  };

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
          el('h1', { html: 'Matematika —<br><em>o\'yin kabi qiziq</em>' }),
          el('p', { class: 'hero__sub' },
            '1–4-sinf darsligidagi har bir mavzu — qisqa bosqich: 10 ta savol yoki qiziqarli o\'yin. Xato bo\'lsa — qo\'rqmang, yana urinib ko\'rasiz. Hammasi ochiq va bepul.'),
          el('div', { class: 'hero__cta' },
            el('a', { href: '#/g/1/c/1', class: 'btn' }, 'Darsni boshlash',
              el('span', { style: 'width:20px;height:20px', html: ICON.arrowRight })),
            el('a', { href: '#/about' }, 'Loyiha qanday ishlaydi?')),
          el('div', { class: 'stats' },
            el('div', { class: 'stat' }, el('b', {}, String(t.levels)), el('span', {}, 'dars-bosqich')),
            el('div', { class: 'stat' }, el('b', {}, `${(t.questions + t.gameTasks).toLocaleString('ru-RU')}+`), el('span', {}, 'savol va topshiriq')),
            el('div', { class: 'stat' }, el('b', {}, '4'), el('span', {}, 'sinf · 16 chorak')),
            el('div', { class: 'stat' }, el('b', {}, String(cur.grades.reduce((n, g) => n + g.choraks.reduce((m, c) => m + c.blocks.length, 0), 0))), el('span', {}, 'mavzu')))),
        slider),
      // kingdoms
      el('section', { class: 'section' },
        el('h2', {}, 'Sinfingizni tanlang'),
        el('p', { class: 'section__lead' }, 'Har sinf — o\'z olami. Barcha chorak va bloklar boshidanoq ochiq.'),
        el('div', { class: 'kingdoms kingdoms--afisha' }, ...cur.grades.map(kcard))),
      // how
      el('section', { class: 'section' },
        el('h2', {}, 'Qanday ishlaydi'),
        el('div', { class: 'how' },
          howcard(1, 'var(--tint)', 'var(--violet)', 'Sinf va chorakni tanlang', 'Maktabda o\'tilgan mavzuni toping — sinf → chorak → blok.'),
          howcard(2, '#e6f7f4', '#16a394', 'Darsni bajaring', 'Har bir darsda 10 ta savol yoki topshiriq. Vaqt bosimi yo\'q, xatoni tuzatib bo\'ladi.'),
          howcard(3, 'var(--tint)', 'var(--violet)', 'Yulduz va natijani ko\'ring', 'Aniqlikka qarab 1–3 yulduz, eng yaxshi natija saqlanadi (shu brauzerda).')))),
    footer());
}
