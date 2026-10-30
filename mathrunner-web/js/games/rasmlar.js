// O'yin rasmlari (foydalanuvchi GPT'da yasaydi — promptlar: design/oyin-rasmlar.md).
// Fayl assets/oyin/ ga qo'yilgach, shu yerda yo'li yoziladi (null o'rniga). null bo'lsa — kod o'zi chizadi (SVG/CSS).
export const RASM = {
  // o'yin personaji (Robi) — holatlari
  personaj: {
    idle: null,    // 'assets/oyin/robi-oddiy.png'
    ok: null,      // 'assets/oyin/robi-xursand.png'
    bad: null,     // 'assets/oyin/robi-tushuntiradi.png'
    think: null,   // 'assets/oyin/robi-oylaydi.png'
  },
  // Venn — koinot
  vennFon: null,     // 'assets/oyin/venn-koinot.png'
  sayyoraA: null,    // 'assets/oyin/sayyora-binafsha.png'
  sayyoraB: null,    // 'assets/oyin/sayyora-olovrang.png'
  meteorit: null,    // 'assets/oyin/meteorit.png'
};

// Rasm kelguncha — Robi (kichik kosmik robot) kodda chiziladi; holatiga qarab ko'zlari o'zgaradi
export function robiSVG(mood = 'idle') {
  const eyes = {
    idle: '<circle cx="38" cy="44" r="5.5" fill="#7df9ff"/><circle cx="62" cy="44" r="5.5" fill="#7df9ff"/>',
    ok: '<path d="M32 46 q6 -9 12 0" stroke="#7dffb0" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M56 46 q6 -9 12 0" stroke="#7dffb0" stroke-width="4.5" fill="none" stroke-linecap="round"/>',
    bad: '<circle cx="38" cy="45" r="5" fill="#ffd27d"/><circle cx="62" cy="45" r="5" fill="#ffd27d"/><path d="M31 36 l12 3 M69 36 l-12 3" stroke="#ffd27d" stroke-width="3.5" stroke-linecap="round"/>',
    think: '<circle cx="40" cy="41" r="5" fill="#7df9ff"/><circle cx="64" cy="41" r="5" fill="#7df9ff"/>',
  }[mood] || '';
  const mouth = mood === 'ok' ? '<path d="M42 56 q8 7 16 0" stroke="#7dffb0" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : mood === 'bad' ? '<path d="M43 58 h14" stroke="#ffd27d" stroke-width="3.5" stroke-linecap="round"/>'
    : '<path d="M44 57 q6 3 12 0" stroke="#7df9ff" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="rb-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8ff"/></linearGradient>
      <linearGradient id="rb-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f9bff"/><stop offset="1" stop-color="#5a5fd8"/></linearGradient>
    </defs>
    <line x1="50" y1="14" x2="50" y2="4" stroke="#b9c2ff" stroke-width="3"/>
    <circle cx="50" cy="5" r="4.5" fill="${mood === 'bad' ? '#ffb347' : mood === 'ok' ? '#5dff9a' : '#ff5c8a'}"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>
    <rect x="66" y="78" width="10" height="20" rx="5" fill="#6f78f0" transform="rotate(-${mood === 'ok' ? 40 : 10} 71 80)"/>
    <rect x="24" y="78" width="10" height="20" rx="5" fill="#6f78f0" transform="rotate(10 29 80)"/>
    <rect x="30" y="72" width="40" height="30" rx="12" fill="url(#rb-b)"/>
    <circle cx="50" cy="86" r="5" fill="#7df9ff" opacity=".9"/>
    <rect x="14" y="14" width="72" height="62" rx="26" fill="url(#rb-h)" stroke="#aab4ff" stroke-width="2"/>
    <rect x="22" y="26" width="56" height="40" rx="18" fill="#1b1f4b"/>
    ${eyes}${mouth}
    <circle cx="14" cy="45" r="5" fill="#aab4ff"/><circle cx="86" cy="45" r="5" fill="#aab4ff"/>
  </svg>`;
}
