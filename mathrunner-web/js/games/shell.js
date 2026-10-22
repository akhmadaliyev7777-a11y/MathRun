// O'yinlar uchun umumiy qobiq: tepada «N-mashq · Topshiriq i / n», ko'rsatma paneli, jarayon chizig'i.
import { el } from '../util.js';
import { ICON } from '../icons.js';
import { nav } from '../app.js';

export function shell(ctx, promptText, iconKey, autoPrompt = false) {
  const bar = el('i', { style: 'width:0%' });
  const area = el('div');
  const foot = el('div', { class: 'gcheck' });
  const root = ctx.root;
  const promptEl = el('span', {}, promptText);
  root.replaceChildren(
    nav(null),
    el('div', { class: 'runbar' },
      el('button', { class: 'linkback', onclick: () => location.hash = ctx.backHash },
        el('span', { style: 'width:18px;height:18px', html: ICON.arrowLeft }), 'Mavzularga qaytish'),
      el('div', { class: 'runbar__mid' },
        `${ctx.grade.grade}-sinf · ${ctx.chorak.roman} chorak · ${ctx.block.blok}-mavzu`),
      el('div', { class: 'runbar__mid' }, '')),
    el('main', { class: 'gwrap' },
      // qaysi mashq, nechanchi topshiriq va jami nechta ekani doim ko'rinib turadi
      el('div', { class: 'gtop' },
        el('span', { class: 'gtop__mashq' }, `${ctx.mashq}-mashq`, el('small', {}, ` · jami ${ctx.totalTasks} ta topshiriq, ${ctx.mashqCount} ta mashq`)),
        el('b', { class: 'gtop__prog', id: 'gprog' }, '')),
      el('div', { class: 'prompt' },
        el('span', { style: 'width:22px;height:22px;flex-shrink:0', html: ICON[iconKey] || ICON.spark }),
        promptEl),
      el('div', { class: 'gbar' }, bar),
      area, foot));
  return { area, foot, setProg: (i, n) => {
      // topshiriqning o'z ko'rsatmasi bo'lsa (masalan har xil o'q, har xil to'plam shartlari) — shu ko'rsatiladi
      const own = autoPrompt && ctx.bank[i] && ctx.bank[i].prompt;
      if (own && promptEl.textContent !== own) promptEl.textContent = own;
      bar.style.width = `${(i / n) * 100}%`; document.getElementById('gprog').textContent = `Topshiriq ${Math.min(i + 1, n)} / ${n}`; },
    setDone: (k, n) => { bar.style.width = `${(k / n) * 100}%`; document.getElementById('gprog').textContent = `Belgilandi ${k} / ${n}`; } };
}

export function checkBtn(label, onClick) {
  return el('button', { class: 'btn btn--accent', onclick: onClick }, label);
}
export const flash = (node, ok) => {
  node.style.transition = 'background .2s';
  node.style.background = ok ? 'var(--green)' : 'var(--red)';
};

