import { $, el, loadJSON } from './util.js';
import { mathReady } from './mathfmt.js';
import { yuqoriTopish } from './yuqori.js';

const APP = $('#app');
let CUR = null; // curriculum.json

// ---------- shared chrome ----------
// Yuqoridagi asosiy MathRun menyusi index.html'da ../js/layout.js orqali chiziladi.
// Bu yerda faqat bo'limning ichki menyusi (Mavzular / O'yinlar / Loyiha haqida).
// yuqoriSinf — yuqori sinf (5–11) o'yini ochiq bo'lsa: tepada «Fikrlash o'yinlari · N-sinf» (boshlang'ich sinflar yozuvi emas)
export function nav(active, yuqoriSinf = null) {
  const link = (href, label, key) =>
    el('a', { href, class: 'subnav__link' + (active === key ? ' is-active' : '') }, label);
  if (yuqoriSinf) return el('div', { class: 'subnav' },
    el('div', { class: 'subnav__inner' },
      el('a', { href: '#/games', class: 'subnav__title' }, 'Fikrlash o\'yinlari', el('span', { class: 'subnav__pill' }, `${yuqoriSinf}-sinf`)),
      el('nav', { class: 'subnav__links' },
        link('#/games', 'O\'yinlar', 'games'),
        link('#/about', 'Loyiha haqida', 'about'))));
  return el('div', { class: 'subnav' },
    el('div', { class: 'subnav__inner' },
      el('a', { href: '#/', class: 'subnav__title' }, 'Boshlang\'ich sinflar', el('span', { class: 'subnav__pill' }, '1–4 sinf')),
      el('nav', { class: 'subnav__links' },
        link('#/', 'Mavzular', 'mavzular'),
        link('#/about', 'Loyiha haqida', 'about'))));
}

// MathRun'ning umumiy footeri (asosiy sahifalardagi bilan bir xil)
export function footer() {
  // pastki qism bosh sahifadagi bilan bir xil (../js/footer.js)
  const f = el('footer', { class: 'site-footer', 'data-base': '../' });
  if (window.mlFooter) window.mlFooter(f);
  return f;
}

export const curriculum = () => CUR;
export const gradeData = (g) => CUR.grades.find(x => x.grade === Number(g));
export function levelById(id) {
  for (const g of CUR.grades)
    for (const c of g.choraks)
      for (const b of c.blocks)
        for (const lv of b.levels)
          if (lv.id === id) return { grade: g, chorak: c, block: b, level: lv };
  return yuqoriTopish(id);   // yuqori sinflar o'yin bosqichlari
}

// kingdom rangini hujjatga qo'llash (grade konteksti)
export function applyKingdom(g) {
  const r = document.documentElement.style;
  if (!g) { r.removeProperty('--k-head'); return; }
  // tugma va progress ranglari hamma sinfda MathRun'ning asosiy rangida qoladi (styles.css),
  // sinfga xos faqat sarlavha foni (banner gradienti)
  r.setProperty('--k-head', g.color.head);
}

// ---------- router ----------
const routes = [
  { re: /^#\/?$/, load: () => import('./screens/landing.js'), name: 'landing' },
  { re: /^#\/g\/(\d)(?:\/c\/(\d))?$/, load: () => import('./screens/mavzular.js'), name: 'mavzular' },
  { re: /^#\/test\/([\w-]+)$/, load: () => import('./screens/quiz.js'), name: 'quiz' },
  { re: /^#\/play\/([\w-]+)(?:\/(\d))?$/, load: () => import('./screens/play.js?v=45'), name: 'play' },
  { re: /^#\/sim\/(\d)\/(\d)\/(\d+)$/, load: () => import('./screens/sim.js'), name: 'sim' },
  { re: /^#\/tug$/, load: () => import('./screens/tug.js?v=19'), name: 'tug' },
  { re: /^#\/(games|about)(?:\/(\w+))?$/, load: () => import('./screens/info.js?v=8'), name: 'info' },   // #/games/<o'yin turi> — mavzu tanlash
];

// yuqori menyuda joriy bo'limni ajratish: o'yinlar sahifasida "Fikrlash o'yinlari", qolganida "Boshlang'ich sinflar"
function markSiteNav(hash) {
  const games = /^#\/(games|tug|play\/y\d)/.test(hash);   // yuqori sinf o'yinlari ham
  document.querySelectorAll('.site-nav [data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === (games ? 'games' : 'primary'));
  });
}

async function route() {
  const hash = location.hash || '#/';
  markSiteNav(hash);
  for (const r of routes) {
    const m = hash.match(r.re);
    if (m) {
      APP.innerHTML = '<div class="boot">Yuklanmoqda…</div>';
      const mod = await r.load();
      window.scrollTo(0, 0);
      mod.render(APP, m.slice(1));
      // sahifa ko'ringach, formula kutubxonasini orqa fonda tayyorlab qo'yamiz (testga kirganda kutilmasin)
      (window.requestIdleCallback || setTimeout)(() => mathReady());
      return;
    }
  }
  location.hash = '#/';
}

async function main() {
  try {
    CUR = await loadJSON('data/curriculum.json');
  } catch (e) {
    APP.innerHTML = '<div class="boot">Ma\'lumotni yuklab bo\'lmadi. Sahifani yangilang.</div>';
    console.error(e);
    return;
  }
  addEventListener('hashchange', route);
  route();
  mathReady(); // formulalar kutubxonasini darrov yuklashni boshlaymiz (testga kirganda kutilmasin)
}
main();
