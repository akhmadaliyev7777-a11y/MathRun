// O'yin paneli (hamma o'yinlar uchun umumiy): yuraklar, ochko, kombo, ovoz, uchuvchi «+10», personaj pufagi.
import { el } from '../util.js';
import { RASM, robiSVG } from './rasmlar.js?v=2';

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
export function hud(maxHearts = 3) {
  const st = { hearts: maxHearts, max: maxHearts, score: 0, combo: 0 };
  const hearts = el('span', { class: 'hud__hearts', 'aria-label': 'Jonlar' });
  const score = el('b', {}, '0');
  const combo = el('span', { class: 'hud__combo' });
  const mute = el('button', {
    class: 'hud__mute', type: 'button', 'aria-label': 'Ovozni yoqish yoki o\'chirish',
    onclick: () => { muted = !muted; try { localStorage.setItem(OVOZ_KEY, muted ? '0' : '1'); } catch { /* */ } mute.textContent = muted ? '🔇' : '🔊'; },
  }, muted ? '🔇' : '🔊');
  const node = el('div', { class: 'hud' }, hearts, el('span', { class: 'hud__pts' }, '⭐ ', score), combo, mute);
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
