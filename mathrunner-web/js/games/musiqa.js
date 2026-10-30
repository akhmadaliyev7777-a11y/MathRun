// Fon musiqasi (foydalanuvchi, 2026-10-31): har o'yin dunyosiga mos kuy — fayl kerak emas, brauzer o'zi chaladi (Web Audio).
// Har kuy: temp, tonika va lad, akkordlar ketma-ketligi, bas, pad (cho'ziq akkord), arpedjio, kuy (har mavzuda o'z naqshi bilan
// avtomatik tuziladi — A B A C shaklida takrorlanadi) va zarb (baraban yoki doira). Musiqa alohida tugma bilan o'chiriladi.
const KEY = 'mw-musiqa';
let yoqiq = (() => { try { return localStorage.getItem(KEY) !== '0'; } catch { return true; } })();
let ac = null, bosh = null, aks = null, aksQayt = null, aksAralash = null, shovqin = null;
let joriy = null, timer = null, qadam = 0, keyingi = 0, egasi = null, kuy = null;

const LAD = {
  major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], mixo: [0, 2, 4, 5, 7, 9, 10],
  hijoz: [0, 1, 4, 5, 7, 8, 10], frigiy: [0, 1, 3, 5, 7, 8, 10], penta: [0, 2, 4, 7, 9], pentaM: [0, 3, 5, 7, 10], in: [0, 1, 5, 7, 8],
};
// cholg'ular: to'lqin turi, atak/so'nish, filtr, ovoz balandligi
const CHOLGU = {
  pad: { tur: 'sawtooth', a: 0.9, r: 1.2, g: 0.05, f: 700, ikki: 7 },
  padYumshoq: { tur: 'triangle', a: 1.2, r: 1.5, g: 0.07, f: 1200, ikki: 5 },
  bas: { tur: 'triangle', a: 0.01, d: 0.35, g: 0.16, f: 600 },
  basKvadrat: { tur: 'square', a: 0.005, d: 0.18, g: 0.06, f: 500 },
  nay: { tur: 'sine', a: 0.06, d: 0.5, g: 0.09, vib: 5 },
  nayUzun: { tur: 'sine', a: 0.25, d: 1.1, g: 0.08, vib: 4.5 },
  qongiroq: { tur: 'sine', a: 0.003, d: 0.9, g: 0.07, okt: 1 },
  marimba: { tur: 'sine', a: 0.003, d: 0.28, g: 0.11, okt: 0.5 },
  chimmoq: { tur: 'triangle', a: 0.003, d: 0.35, g: 0.08, f: 2600 },
  koto: { tur: 'triangle', a: 0.002, d: 0.6, g: 0.1, f: 2200 },
  ud: { tur: 'sawtooth', a: 0.004, d: 0.32, g: 0.06, f: 1500 },
  dutor: { tur: 'sawtooth', a: 0.003, d: 0.45, g: 0.055, f: 1300 },
  akkordeon: { tur: 'sawtooth', a: 0.03, d: 0.28, g: 0.045, f: 1700, trem: 6 },
  gitara: { tur: 'square', a: 0.003, d: 0.22, g: 0.035, f: 1400 },
  mexanik: { tur: 'square', a: 0.002, d: 0.08, g: 0.04, f: 1800 },
};
// vol — balandlik ko'paytuvchisi; zarb naqshlari (16 lik bar; orolda 12): K — katta baraban, S — qarsak, H — shitirlash, D — doira «bum», T — doira «tak», t — yengil tak
const KUYLAR = {
  kosmos: { vol: 0.58, bpm: 68, tonika: 57, lad: 'minor', akk: [0, 5, 3, 4], pad: 'pad', arp: { ch: 'qongiroq', naqsh: 'x..x..x.x..x..x.', yuqori: 1 }, kuy: { ch: 'nayUzun', zich: 0.18, okt: 1 }, aks: [0.45, 0.5, 0.4] },
  orman: { vol: 0.39, bpm: 104, tonika: 60, lad: 'major', akk: [0, 5, 3, 4], bas: 'x...o...x...o...', pad: 'padYumshoq', kuy: { ch: 'nay', zich: 0.45, okt: 1 }, zarb: { K: 'x.......x.......', H: '..x...x...x...x.' }, aks: [0.28, 0.25, 0.2] },
  gor: { vol: 0.62, bpm: 74, tonika: 50, lad: 'minor', akk: [0, 5, 6, 4], pad: 'pad', arp: { ch: 'koto', naqsh: 'x...x...x...x...', yuqori: 1 }, kuy: { ch: 'qongiroq', zich: 0.16, okt: 2 }, zarb: { D: 'x...............' }, aks: [0.5, 0.55, 0.45] },
  zavod: { vol: 1.2, bpm: 112, tonika: 52, lad: 'dorian', akk: [0, 6, 3, 4], bas: 'x.x.xx.xx.x.xx.x', basCh: 'basKvadrat', arp: { ch: 'mexanik', naqsh: '..x...x...x...xx', yuqori: 1 }, kuy: { ch: 'chimmoq', zich: 0.28, okt: 1 }, zarb: { K: 'x...x...x...x...', H: '..x...x...x...x.', S: '....x.......x...' }, aks: [0.18, 0.2, 0.18] },
  bozor: { vol: 0.43, bpm: 96, tonika: 57, lad: 'hijoz', akk: [0, 1, 0, 6], bas: 'x.......x...o...', pad: 'padYumshoq', kuy: { ch: 'ud', zich: 0.55, okt: 1 }, zarb: { D: 'x.......x.......', T: '...x..x....x.x..', t: '.x....x.x.....x.' }, aks: [0.25, 0.25, 0.22] },
  shirinlik: { vol: 0.9, bpm: 120, tonika: 65, lad: 'major', akk: [0, 3, 4, 0], bas: 'x..o..x.x..o..x.', kuy: { ch: 'qongiroq', zich: 0.5, okt: 1 }, arp: { ch: 'marimba', naqsh: 'x.x.x.x.x.x.x.x.', yuqori: 0 }, zarb: { S: '....x.......x...', H: 'x.x.x.x.x.x.x.x.' }, aks: [0.2, 0.2, 0.18] },
  origami: { vol: 0.35, bpm: 76, tonika: 62, lad: 'in', akk: [0, 0, 3, 0], pad: 'padYumshoq', arp: { ch: 'koto', naqsh: 'x.....x...x.....', yuqori: 1 }, kuy: { ch: 'koto', zich: 0.22, okt: 1 }, aks: [0.38, 0.4, 0.35] },
  bog: { vol: 1.37, bpm: 100, tonika: 67, lad: 'penta', akk: [0, 3, 4, 0], bas: 'x.....x.x.......', kuy: { ch: 'marimba', zich: 0.5, okt: 0 }, arp: { ch: 'chimmoq', naqsh: '..x...x...x...x.', yuqori: 1 }, zarb: { H: '..x...x...x...x.' }, aks: [0.25, 0.22, 0.2] },
  orol: { vol: 1.55, bpm: 92, tonika: 50, lad: 'minor', akk: [0, 6, 5, 4], uzun: 12, bas: 'x.....o.....', kuy: { ch: 'akkordeon', zich: 0.5, okt: 1 }, arp: { ch: 'gitara', naqsh: '..x.x...x.x.', yuqori: 0 }, zarb: { K: 'x.....x.....', T: '...x.....x..' }, aks: [0.3, 0.3, 0.25] },
  dasht: { vol: 0.86, bpm: 116, tonika: 62, lad: 'mixo', akk: [0, 6, 3, 0], bas: 'x.x.x.x.x.x.x.x.', arp: { ch: 'gitara', naqsh: 'x.xx.x.xx.x.x.xx', yuqori: 0 }, kuy: { ch: 'nay', zich: 0.35, okt: 1 }, zarb: { K: 'x...x...x...x...', S: '....x.......x...', H: '..x...x...x...x.' }, aks: [0.22, 0.2, 0.18] },
  rasad: { vol: 0.46, bpm: 64, tonika: 57, lad: 'dorian', akk: [0, 0, 6, 0], pad: 'pad', dron: true, kuy: { ch: 'nayUzun', zich: 0.2, okt: 1 }, arp: { ch: 'qongiroq', naqsh: 'x...............', yuqori: 2 }, aks: [0.5, 0.5, 0.45] },
  koshin: { vol: 0.83, bpm: 100, tonika: 55, lad: 'frigiy', akk: [0, 0, 6, 0], dron: true, kuy: { ch: 'dutor', zich: 0.6, okt: 1 }, arp: { ch: 'dutor', naqsh: 'x..x..x.x..x..x.', yuqori: 0 }, zarb: { D: 'x.......x.....x.', T: '...x..x....x..x.', t: '.....x.....x....' }, aks: [0.22, 0.22, 0.2] },
  bellashuv: { vol: 0.6, bpm: 128, tonika: 60, lad: 'major', akk: [0, 4, 5, 3], bas: 'x.x.x.x.x.x.x.x.', arp: { ch: 'gitara', naqsh: 'x.x.x.x.x.x.x.x.', yuqori: 0 }, kuy: { ch: 'qongiroq', zich: 0.45, okt: 1 }, zarb: { K: 'x...x...x...x...', S: '....x.......x...', H: 'xxxxxxxxxxxxxxxx' }, aks: [0.18, 0.2, 0.15] },
};

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
function urug(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
// ladning i-pog'onasi (manfiy va oktavadan oshgani ham) → MIDI
function pog(k, i) { const L = LAD[k.lad], n = L.length, o = Math.floor(i / n); return k.tonika + L[((i % n) + n) % n] + 12 * o; }

// kuy: har akkord uchun bir taktlik ritm va notalar; A B A C shakli (8 takt)
function kuyTuz(nom, k) {
  const r = urug('kuy-' + nom), U = k.uzun || 16, n = LAD[k.lad].length;
  const motiv = () => {
    const out = []; let p = 0;
    for (let s = 0; s < U * 2; s++) {
      const kuchli = s % (U / 4) === 0;
      if (r() < (kuchli ? k.kuy.zich * 1.5 : k.kuy.zich * 0.7)) {
        const takt = Math.floor(s / U), ak = k.akk[takt % k.akk.length];
        p = kuchli ? ak + [0, 2, 4][Math.floor(r() * 3)] : p + [-2, -1, -1, 1, 1, 2][Math.floor(r() * 6)];
        p = Math.max(-2, Math.min(n + 4, p));
        out.push([s, p, r() < 0.3 ? 3 : r() < 0.6 ? 2 : 1]);
      }
    }
    return out;
  };
  const A = motiv(), B = motiv(), C = motiv();
  return [A, B, A, C];
}

function ovoz(t, f, dur, ch, g = 1) {
  const c = CHOLGU[ch]; if (!c) return;
  const v = ac.createGain(), o = ac.createOscillator();
  o.type = c.tur; o.frequency.setValueAtTime(f * (c.okt ? Math.pow(2, 0) : 1), t);
  let zanjir = o;
  if (c.vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = c.vib; lg.gain.value = f * 0.006; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + (c.r || c.d) + 0.1); }
  if (c.f) { const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = c.f; zanjir.connect(fl); zanjir = fl; }
  const G = c.g * g;
  if (c.d && !c.r) {         // urma/cherta cholg'u: tez ko'tariladi, so'nadi
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(G, t + c.a); v.gain.exponentialRampToValueAtTime(0.0001, t + c.a + c.d * Math.max(1, dur * 1.2));
  } else {                    // cho'ziq (pad)
    v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(G, t + c.a); v.gain.setValueAtTime(G, t + Math.max(c.a, dur)); v.gain.linearRampToValueAtTime(0.0001, t + Math.max(c.a, dur) + c.r);
  }
  if (c.trem) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = c.trem; lg.gain.value = G * 0.35; l.connect(lg).connect(v.gain); l.start(t); l.stop(t + dur + 0.6); }
  zanjir.connect(v); v.connect(bosh); v.connect(aks);
  const oxir = t + Math.max(c.a, dur) + (c.r || c.d * Math.max(1, dur * 1.2)) + 0.05;
  o.start(t); o.stop(oxir);
  if (c.ikki) { const o2 = ac.createOscillator(); o2.type = c.tur; o2.frequency.value = f; o2.detune.value = c.ikki; o2.connect(c.f ? zanjir : v); o2.start(t); o2.stop(oxir); }
  if (c.okt) { const o3 = ac.createOscillator(), g3 = ac.createGain(); o3.type = 'sine'; o3.frequency.value = f * 4; g3.gain.setValueAtTime(G * c.okt * 0.4, t); g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.12); o3.connect(g3).connect(bosh); o3.start(t); o3.stop(t + 0.15); }
}
function zarb(t, tur) {
  if (tur === 'K' || tur === 'D') {          // katta baraban / doira «bum»
    const o = ac.createOscillator(), v = ac.createGain();
    o.frequency.setValueAtTime(tur === 'K' ? 130 : 160, t); o.frequency.exponentialRampToValueAtTime(tur === 'K' ? 42 : 70, t + 0.18);
    v.gain.setValueAtTime(tur === 'K' ? 0.22 : 0.16, t); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(v).connect(bosh); o.start(t); o.stop(t + 0.32);
    if (tur === 'K') return;
  }
  const n = ac.createBufferSource(); n.buffer = shovqin;
  const f = ac.createBiquadFilter(), v = ac.createGain();
  const [tip, fq, g, d] = { S: ['bandpass', 1700, 0.09, 0.14], H: ['highpass', 7000, 0.035, 0.04], T: ['bandpass', 3200, 0.1, 0.06], t: ['bandpass', 4200, 0.05, 0.04], D: ['lowpass', 900, 0.05, 0.12] }[tur];
  f.type = tip; f.frequency.value = fq;
  v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(0.0001, t + d);
  n.connect(f).connect(v).connect(bosh); n.start(t); n.stop(t + d + 0.02);
}

function rejala() {
  if (!joriy || !ac) return;
  if (egasi && !egasi.isConnected) { musiqaToxtat(); return; }   // o'yin sahifasi yopildi
  const k = KUYLAR[joriy], U = k.uzun || 16, s16 = 60 / k.bpm / 4 * (U === 12 ? 4 / 3 : 1);
  while (keyingi < ac.currentTime + 0.25) {
    const t = keyingi, takt = Math.floor(qadam / U), s = qadam % U, ak = k.akk[takt % k.akk.length];
    const akkord = [ak, ak + 2, ak + 4];
    if (s === 0) {
      if (k.pad) akkord.forEach((i, j) => ovoz(t, hz(pog(k, i) + (j ? 0 : 0)), s16 * U * 0.95, k.pad));
      if (k.dron) { ovoz(t, hz(k.tonika - 12), s16 * U, 'padYumshoq', 0.8); ovoz(t, hz(k.tonika - 5), s16 * U, 'padYumshoq', 0.5); }
    }
    if (k.bas) { const b = k.bas[s]; if (b === 'x' || b === 'o') ovoz(t, hz(pog(k, ak + (b === 'o' ? 4 : 0)) - 24), s16 * 2, k.basCh || 'bas'); }
    if (k.arp && k.arp.naqsh[s] === 'x') { const j = Math.floor(s / 2) % 3; ovoz(t, hz(pog(k, akkord[j]) + 12 * k.arp.yuqori), s16, k.arp.ch); }
    if (k.kuy) {
      const bolak = kuy[Math.floor(takt / 2) % 4], ichki = (takt % 2) * U + s;
      for (const [q, p, uz] of bolak) if (q === ichki) ovoz(t, hz(pog(k, p) + 12 * k.kuy.okt), s16 * uz * 1.6, k.kuy.ch);
    }
    if (k.zarb) for (const [tur, naqsh] of Object.entries(k.zarb)) if (naqsh[s] === 'x') zarb(t, tur);
    keyingi += s16; qadam++;
  }
}

function tayyorla() {
  if (ac) return true;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    bosh = ac.createGain(); bosh.gain.value = 0.55; bosh.connect(ac.destination);
    aks = ac.createDelay(1.5); aksQayt = ac.createGain(); aksAralash = ac.createGain();
    aks.connect(aksQayt).connect(aks); aks.connect(aksAralash).connect(bosh);
    shovqin = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
    const d = shovqin.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // brauzer ovozni faqat bosishdan keyin ruxsat beradi — birinchi bosishda uyg'otamiz
    const uygot = () => { if (ac.state === 'suspended') ac.resume(); };
    addEventListener('pointerdown', uygot); addEventListener('keydown', uygot);
    return true;
  } catch { return false; }
}

// o'yin boshida: nom — KUYLAR dagi kalit; tugun — o'yin sahifasidagi element (u yo'qolsa musiqa o'zi to'xtaydi)
export function musiqaBoshla(nom, tugun) {
  musiqaToxtat();
  if (!KUYLAR[nom]) return;
  joriy = nom; egasi = tugun || null;
  if (!yoqiq || !tayyorla()) return;
  const k = KUYLAR[nom];
  kuy = kuyTuz(nom, k);
  aks.delayTime.value = k.aks[0]; aksQayt.gain.value = k.aks[1]; aksAralash.gain.value = k.aks[2];
  bosh.gain.cancelScheduledValues(ac.currentTime); bosh.gain.setValueAtTime(0.0001, ac.currentTime); bosh.gain.linearRampToValueAtTime(0.55 * (k.vol || 1), ac.currentTime + 1.5);   // vol — kuylar bir xil balandlikda bo'lsin (o'lchab tenglangan)
  if (ac.state === 'suspended') ac.resume();
  qadam = 0; keyingi = ac.currentTime + 0.1;
  timer = setInterval(rejala, 60);
  rejala();
}
export function musiqaToxtat() {
  if (timer) { clearInterval(timer); timer = null; }
  if (ac && bosh) { const t = ac.currentTime; bosh.gain.cancelScheduledValues(t); bosh.gain.setValueAtTime(bosh.gain.value, t); bosh.gain.linearRampToValueAtTime(0.0001, t + 0.4); }
}
export const musiqaYoqiqmi = () => yoqiq;
export function musiqaAlmashtir() {
  yoqiq = !yoqiq;
  try { localStorage.setItem(KEY, yoqiq ? '1' : '0'); } catch { /* */ }
  const nom = joriy, t = egasi;
  if (yoqiq && nom) musiqaBoshla(nom, t); else { musiqaToxtat(); joriy = nom; egasi = t; }
  return yoqiq;
}
addEventListener('hashchange', () => { musiqaToxtat(); joriy = null; });
export const KUY_NOMLARI = Object.keys(KUYLAR);
export const _musiqaHolat = () => ({ ac, bosh, joriy });
