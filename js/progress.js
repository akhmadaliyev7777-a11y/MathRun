// O'quvchi yutuqlari (nishonlar) — faqat shu brauzerda saqlanadi, ro'yxatdan o'tish shart emas.
// Sayt sahifalari ham, lessons/ dagi ko'rgazmalar ham shu faylni ishlatadi.
// Kalit: "sinf|fan|mavzuId", qiymat: { level: ochilgan daraja (1–3), done: true/false }

const MR = (function () {
  const KEY = "mathrun-progress-v1";

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }

  function writeAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {}
  }

  function get(topicKey) {
    return readAll()[topicKey] || { level: 1, done: false };
  }

  function set(topicKey, patch) {
    const all = readAll();
    all[topicKey] = Object.assign({ level: 1, done: false }, all[topicKey], patch);
    writeAll(all);
    return all[topicKey];
  }

  // nishon: mavzu tartib raqamiga qarab shakl va rang (5 shakl × 5 rang)
  const COLORS = ["#4f5bd5", "#16a394", "#e8913a", "#d9506a", "#8b5cf6"];
  function shapePath(kind) {
    switch (kind) {
      case 0: return '<circle cx="20" cy="20" r="15"/>';
      case 1: return '<rect x="6" y="6" width="28" height="28" rx="7"/>';
      case 2: return '<path d="M20 4 L36 33 L4 33 Z" stroke-linejoin="round"/>';
      case 3: return '<path d="M20 3 L37 20 L20 37 L3 20 Z" stroke-linejoin="round"/>';
      default: return '<path d="M20 3 L35 11.5 L35 28.5 L20 37 L5 28.5 L5 11.5 Z" stroke-linejoin="round"/>';
    }
  }

  function badgeSvg(index, done, size) {
    const s = size || 40;
    const color = COLORS[Math.floor(index / 5) % COLORS.length];
    const paint = done
      ? 'fill="' + color + '" stroke="' + color + '" stroke-width="2"'
      : 'fill="none" stroke="#cfd3e3" stroke-width="2" stroke-dasharray="3 3"';
    return '<svg class="mr-badge' + (done ? ' mr-badge--done' : '') + '" width="' + s + '" height="' + s +
      '" viewBox="0 0 40 40" aria-hidden="true"><g ' + paint + '>' + shapePath(index % 5) + '</g></svg>';
  }

  return { get: get, set: set, readAll: readAll, badgeSvg: badgeSvg };
})();
