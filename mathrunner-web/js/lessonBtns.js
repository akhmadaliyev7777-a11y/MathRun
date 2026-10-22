// Mavzu qatoridagi tugmalar: test darajasi — "1-test", "2-test"; o'yin — "1-mashq", "2-mashq" (har biri 10 topshiriq)
import { el } from './util.js';
import { testLabel, MASHQ_SIZE } from './topicTitles.js';

export const GAME_LABEL = {
  set: 'To\'plamlar o\'yini', numberOrder: 'Tartiblash o\'yini', placeValue: 'Xona tarkibi o\'yini',
  balanceScale: 'Tarozi o\'yini', symmetry: 'Simmetriya o\'yini', netFold: 'Yoyilma o\'yini',
  equationGrid: 'Jadval o\'yini', algorithmConveyor: 'Saralash o\'yini',
  fractionStrip: 'Ulush o\'yini', coordinatePath: 'Koordinata o\'yini',
  motionLine: 'Harakat o\'yini', protractor: 'Transportir o\'yini',
};

function starBtn(best, key, label, href, title, primary) {
  const done = best[key]?.stars || 0;
  return el('button', { class: 'tbtn' + (primary ? ' tbtn--primary' : ''), onclick: () => { location.hash = href; }, title: title + (done ? ` · ${done} yulduz` : '') },
    label, done ? el('span', { class: 'tbtn__star' }, '★'.repeat(done)) : null);
}

export function lessonButtons(b, best) {
  let first = true;
  const out = [];
  for (const lv of b.levels) {
    if (!lv.webSupported) { out.push(el('button', { class: 'tbtn tbtn--soon', disabled: true, title: 'Web versiyada tez orada' }, lv.gameKind === 'test' ? testLabel(b, lv) : 'Tez orada')); continue; }
    if (lv.gameKind === 'test') {
      out.push(starBtn(best, lv.id, testLabel(b, lv), `#/test/${lv.id}`, 'Test', first));
    } else {
      const n = Math.max(1, Math.ceil(lv.count / MASHQ_SIZE));
      for (let m = 1; m <= n; m++)
        out.push(starBtn(best, `${lv.id}:m${m}`, `${m}-mashq`, `#/play/${lv.id}/${m}`, GAME_LABEL[lv.gameKind] || "O'yin", first));
    }
    first = false;
  }
  return out;
}
