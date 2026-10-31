// O'yin paneli (hamma o'yinlar uchun umumiy): yuraklar, ochko, kombo, ovoz, uchuvchi «+10», personaj pufagi.
import { el } from '../util.js';
import { RASM, robiSVG } from './rasmlar.js?v=2';
import { musiqaBoshla, musiqaAlmashtir, musiqaYoqiqmi } from './musiqa.js?v=2';

// ---- ovoz: fayl kerak emas, brauzerning o'zi qisqa ohang chaladi; tanlov eslab qolinadi ----
const OVOZ_KEY = 'mw-ovoz';
let muted = (() => { try { return localStorage.getItem(OVOZ_KEY) === '0'; } catch { return false; } })();
let ac = null;
function tone(freqs, dur = 0.09, type = 'sine', vol = 0.07) {
  if (muted) return;
  try {
    ac ||= new (window.AudioContext || window.webkitAudioContext)();
    let t = ac.currentTime;
    for (const f of freqs) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur);
      t += dur * 0.8;
    }
  } catch { /* ovoz yo'q — o'yin baribir ishlaydi */ }
}
export const sfx = {
  ok: () => tone([660, 880]),
  bad: () => tone([220, 160], 0.14, 'square', 0.04),
  win: () => tone([523, 659, 784, 1047], 0.1),
  tap: () => tone([520], 0.04, 'sine', 0.04),
};

// ---- tepadagi panel ----
// musiqa — o'yin dunyosining fon kuyi (musiqa.js dagi KUYLAR kaliti)
export function hud(maxHearts = 3, musiqa = null) {
  const st = { hearts: maxHearts, max: maxHearts, score: 0, combo: 0 };
  const hearts = el('span', { class: 'hud__hearts', 'aria-label': 'Jonlar' });
  const score = el('b', {}, '0');
  const combo = el('span', { class: 'hud__combo' });
  // zamonaviy chiziqli ikonka: dinamik + to'lqinlar (yoqiq) yoki dinamik + ✕ (o'chiq)
  const ikon = () => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" fill-opacity=".15"/>${muted
      ? '<path d="m22 9-6 6M16 9l6 6"/>'
      : '<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'}</svg>`;
  const mute = el('button', {
    class: 'hud__mute', type: 'button', 'aria-label': 'Ovozni yoqish yoki o\'chirish', 'aria-pressed': String(!muted),
    onclick: () => { muted = !muted; try { localStorage.setItem(OVOZ_KEY, muted ? '0' : '1'); } catch { /* */ } mute.innerHTML = ikon(); mute.setAttribute('aria-pressed', String(!muted)); mute.classList.toggle('is-off', muted); },
  });
  mute.innerHTML = ikon(); mute.classList.toggle('is-off', muted);
  // musiqa tugmasi: nota (yoqiq) yoki ustidan chizilgan nota (o'chiq)
  const notaIkon = () => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3" fill="currentColor" fill-opacity=".15"/><circle cx="17" cy="16" r="3" fill="currentColor" fill-opacity=".15"/>${musiqaYoqiqmi() ? '' : '<path d="M3 3l18 18"/>'}</svg>`;
  const nota = musiqa ? el('button', {
    class: 'hud__mute hud__musiqa', type: 'button', 'aria-label': 'Musiqani yoqish yoki o\'chirish', title: 'Musiqa',
    onclick: () => { const on = musiqaAlmashtir(); nota.innerHTML = notaIkon(); nota.classList.toggle('is-off', !on); nota.setAttribute('aria-pressed', String(on)); },
  }) : null;
  if (nota) { nota.innerHTML = notaIkon(); nota.classList.toggle('is-off', !musiqaYoqiqmi()); }
  // to'liq ekran (foydalanuvchi, 2026-10-31): butun o'yin qismi (.gwrap) ekranni egallaydi, «Davom etish»/«Tekshirish» kabi tugmalar
  // o'yin ramkasi ichida (CSS .gwrap.toliq); haqiqiy to'liq ekran bo'lmasa (iPhone) — sahifa ustida qotirilgan oyna sifatida
  const FS_KIR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/></svg>';
  const FS_CHIQ = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v3.5A1.5 1.5 0 0 1 7.5 9H4M20 9h-3.5A1.5 1.5 0 0 1 15 7.5V4M15 20v-3.5a1.5 1.5 0 0 1 1.5-1.5H20M4 15h3.5A1.5 1.5 0 0 1 9 16.5V20"/></svg>';
  const tolaEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  let gw = null, kuzat = null;
  const toliqmi = () => !!(gw && gw.classList.contains('toliq'));
  const fsYoz = () => { fs.innerHTML = toliqmi() ? FS_CHIQ : FS_KIR; fs.setAttribute('aria-label', toliqmi() ? "To'liq ekrandan chiqish" : "To'liq ekran"); };
  function chiq() {
    if (gw) gw.classList.remove('toliq');
    document.documentElement.classList.remove('mw-toliq');
    if (kuzat) { clearInterval(kuzat); kuzat = null; }
    if (qadamKuz) { qadamKuz.disconnect(); qadamKuz = null; }
    const f = document.exitFullscreen || document.webkitExitFullscreen;
    if (tolaEl() && f) { try { const r = f.call(document); if (r && r.catch) r.catch(() => {}); } catch { /* */ } }
    fsYoz();
  }
  function kir() {
    gw = node.closest('.gwrap'); if (!gw) return;
    gw.classList.add('toliq'); document.documentElement.classList.add('mw-toliq');
    const f = gw.requestFullscreen || gw.webkitRequestFullscreen;
    if (f) { try { const r = f.call(gw); if (r && r.catch) r.catch(() => {}); } catch { /* */ } }
    // o'yin tugab sahifa almashsa — to'liq ekran o'zi yopiladi
    kuzat = setInterval(() => { if (!gw.isConnected) chiq(); }, 700);
    qadamUlash();
    fsYoz();
  }
  const fs = el('button', { class: 'hud__mute hud__fs', type: 'button', title: "To'liq ekran", onclick: () => (toliqmi() ? chiq() : kir()) });
  const fsOzgardi = () => { if (!node.isConnected) { document.removeEventListener('fullscreenchange', fsOzgardi); document.removeEventListener('webkitfullscreenchange', fsOzgardi); return; } if (!tolaEl() && toliqmi() && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) chiq(); };
  document.addEventListener('fullscreenchange', fsOzgardi); document.addEventListener('webkitfullscreenchange', fsOzgardi);
  fs.innerHTML = FS_KIR;
  // telefondagi to'liq ekranda tepadagi «Topshiriq i / n» yashiriladi — o'rniga panelda ixcham «i/n»
  const qadamEl = el('span', { class: 'hud__qadam' });
  let qadamKuz = null;
  const qadamUlash = () => {
    const src = gw && gw.querySelector('#gprog'); if (!src) return;
    const yoz = () => { const m = src.textContent.match(/(\d+)\s*\/\s*(\d+)/); qadamEl.textContent = m ? `${m[1]}/${m[2]}` : ''; };
    yoz(); if (qadamKuz) qadamKuz.disconnect(); qadamKuz = new MutationObserver(yoz); qadamKuz.observe(src, { childList: true, characterData: true, subtree: true });
  };
  const node = el('div', { class: 'hud' }, hearts, el('span', { class: 'hud__pts' }, '⭐ ', score), combo, qadamEl, nota, mute, fs);
  if (musiqa) setTimeout(() => musiqaBoshla(musiqa, node), 0);
  const drawHearts = () => hearts.replaceChildren(...Array.from({ length: st.max }, (_, i) =>
    el('i', { class: 'hud__heart' + (i < st.hearts ? '' : ' off') }, '❤')));
  const drawCombo = () => {
    combo.textContent = st.combo >= 2 ? `🔥 ×${Math.min(st.combo, 5)}` : '';
    combo.classList.remove('pop'); void combo.offsetWidth; if (st.combo >= 2) combo.classList.add('pop');
  };
  drawHearts();
  return {
    node, st,
    resetHearts() { st.hearts = st.max; drawHearts(); },
    loseHeart() { st.hearts = Math.max(0, st.hearts - 1); drawHearts(); hearts.classList.remove('shake'); void hearts.offsetWidth; hearts.classList.add('shake'); return st.hearts; },
    hit() { st.combo++; drawCombo(); return Math.min(st.combo, 5); },   // kombo ko'paytuvchisi (ko'pi bilan ×5)
    miss() { st.combo = 0; drawCombo(); },
    add(points, at) {
      st.score += points; score.textContent = st.score;
      if (at) floatText(`+${points}`, at);
    },
  };
}

// «+20», «⚡ Tez!» kabi uchib ketadigan yozuv — berilgan element ustida
export function floatText(text, at, cls = '') {
  const r = at.getBoundingClientRect();
  const f = el('div', { class: 'hud-float ' + cls, style: `left:${r.left + r.width / 2}px;top:${r.top}px` }, text);
  document.body.append(f);
  setTimeout(() => f.remove(), 900);
}

// ---- o'yin personaji (Robi) va gap pufagi; GPT rasmi bo'lsa — rasm, bo'lmasa — kodda chizilgan SVG ----
export function buddy() {
  const face = el('div', { class: 'buddy__img', role: 'img', 'aria-label': 'Robi' });
  const draw = (mood) => {
    const src = RASM.personaj[mood] || RASM.personaj.idle;
    if (src) face.replaceChildren(el('img', { src, alt: '', width: 64, height: 64 }));
    else face.innerHTML = robiSVG(mood);
  };
  draw('idle');
  const bubble = el('div', { class: 'buddy__bubble' });
  const node = el('div', { class: 'buddy' }, face, bubble);
  return {
    node,
    say(content, mood = 'idle') {
      draw(mood);
      face.classList.remove('hop'); void face.offsetWidth; if (mood === 'ok') face.classList.add('hop');
      bubble.className = 'buddy__bubble' + (mood === 'ok' ? ' is-ok' : mood === 'bad' ? ' is-bad' : '');
      bubble.replaceChildren(...[].concat(content));
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    },
  };
}
