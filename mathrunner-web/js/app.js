import { $, el, loadJSON } from './util.js';
import { mathReady } from './mathfmt.js';

const APP = $('#app');
let CUR = null; // curriculum.json

// ---------- shared chrome ----------
// Yuqoridagi asosiy MathRun menyusi index.html'da ../js/layout.js orqali chiziladi.
// Bu yerda faqat bo'limning ichki menyusi (Mavzular / O'yinlar / Loyiha haqida).
export function nav(active) {
  const link = (href, label, key) =>
    el('a', { href, class: 'subnav__link' + (active === key ? ' is-active' : '') }, label);
  return el('div', { class: 'subnav' },
    el('div', { class: 'subnav__inner' },
      el('a', { href: '#/', class: 'subnav__title' }, 'Boshlang\'ich sinflar', el('span', { class: 'subnav__pill' }, '1–4 sinf')),
      el('nav', { class: 'subnav__links' },
        link('#/', 'Mavzular', 'mavzular'),
        link('#/about', 'Loyiha haqida', 'about'))));
}

// MathRun'ning umumiy footeri (asosiy sahifalardagi bilan bir xil)
export function footer() {
  return el('footer', { class: 'site-footer' },
    el('div', { class: 'footer-inner' },
      el('span', { class: 'footer-logo' }, 'MathRun Simulyator'),
      el('nav', { class: 'footer-links' },
        el('a', { href: '../index.html' }, 'Bosh sahifa'),
        el('a', { href: '../korgazmalar.html' }, 'Interaktiv darslar'),
        el('a', { href: '#/' }, 'Boshlang\'ich sinflar'),
        el('a', { href: '../info.html' }, 'Ma\'lumot')),
      el('span', { class: 'footer-copy' }, '© MathRun Simulyator')));
}

export const curriculum = () => CUR;
export const gradeData = (g) => CUR.grades.find(x => x.grade === Number(g));
export function levelById(id) {
  for (const g of CUR.grades)
    for (const c of g.choraks)
      for (const b of c.blocks)
        for (const lv of b.levels)
          if (lv.id === id) return { grade: g, chorak: c, block: b, level: lv };
  return null;
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
  { re: /^#\/play\/([\w-]+)$/, load: () => import('./screens/play.js'), name: 'play' },
  { re: /^#\/sim\/(\d)\/(\d)\/(\d+)$/, load: () => import('./screens/sim.js'), name: 'sim' },
  { re: /^#\/tug$/, load: () => import('./screens/tug.js'), name: 'tug' },
  { re: /^#\/(games|about)$/, load: () => import('./screens/info.js'), name: 'info' },
];

// yuqori menyuda joriy bo'limni ajratish: o'yinlar sahifasida "Fikrlash o'yinlari", qolganida "Boshlang'ich sinflar"
function markSiteNav(hash) {
  const games = /^#\/(games|tug)/.test(hash);
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
}
main();
