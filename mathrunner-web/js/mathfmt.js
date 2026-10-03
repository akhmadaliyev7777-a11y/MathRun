// Savol va javob matnidagi misollarni (3 + 1 = ?, a + 6 __ a + 3, 1/2, 4 × 3 ...)
// topib, KaTeX (formula yozish kutubxonasi) orqali darslikdagidek formula ko'rinishida chiqaradi.
// Qolgan oddiy matn o'zgarmaydi. KaTeX yuklanmagan bo'lsa — matn o'z holicha qoladi.

const OP_TEX = {
  '+': '+', '-': '-', '−': '-', '*': '\\cdot', '×': '\\cdot', '·': '\\cdot',
  ':': ':', '÷': ':', '=': '=', '<': '<', '>': '>', '≤': '\\le', '≥': '\\ge', '≠': '\\ne',
};
const BLANK_TEX = '\\boxed{\\phantom{0}}';
const LETTER = /[A-Za-zА-Яа-яЎўҚқҒғҲҳʻʼ'‘’]/;

const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// matnni bo'laklarga ajratish: son, harf-o'zgaruvchi, amal belgisi, katakcha, qavs, bo'shliq, boshqa matn
function tokenize(s) {
  const out = [];
  let i = 0;
  const push = (type, raw, tex) => out.push({ type, raw, tex });
  while (i < s.length) {
    const rest = s.slice(i);
    let m;
    // kasr: 3/4 (bo'shliqsiz)
    if ((m = rest.match(/^(\d+)\/(\d+)(?![\d/])/)) && !LETTER.test(s[i - 1] || '')) {
      push('num', m[0], `\\frac{${m[1]}}{${m[2]}}`); i += m[0].length; continue;
    }
    // son: 1 950 (minglik bo'shliq), 0,5 / 2.75 (o'nli), 60° (gradus)
    if ((m = rest.match(/^\d{1,3}(?: \d{3})+(?!\d)|^\d+(?:[.,]\d+)?/)) && !LETTER.test(s[i - 1] || '')) {
      let raw = m[0];
      let tex = raw.replace(/,/g, '{,}').replace(/ /g, '\\,');
      if (s[i + raw.length] === '°') { raw += '°'; tex += '^{\\circ}'; }
      push('num', raw, tex); i += raw.length; continue;
    }
    // bitta lotin harfi (a, b, x ...) — atrofida boshqa harf bo'lmasa
    if (/^[a-zA-Z]/.test(rest) && !LETTER.test(s[i - 1] || '') && !LETTER.test(s[i + 1] || '') && !/\d/.test(s[i + 1] || '')) {
      // sondan keyin kelgan harf — o'lchov birligi (30 m, 4 h), o'zgaruvchi emas
      const prev = out.filter(t => t.type !== 'space').pop();
      if (prev && prev.type === 'num') { push('text', rest[0]); i += 1; continue; }
      push('var', rest[0], rest[0]); i += 1; continue;
    }
    // __ — taqqoslash belgisi qo'yiladigan joy (atrofida bo'shliq bilan)
    if (rest.startsWith('__')) { const n = rest.match(/^_+/)[0].length; push('blank', rest.slice(0, n), `\\mathrel{${BLANK_TEX}}`); i += n; continue; }
    if (rest[0] === '□' || rest[0] === '☐') { push('blank', rest[0], BLANK_TEX); i += 1; continue; }
    if (rest[0] === '(' || rest[0] === ')') { push(rest[0] === '(' ? 'lp' : 'rp', rest[0], rest[0]); i += 1; continue; }
    if (rest[0] === '-') {
      // chiziqcha faqat atrofida bo'shliq bo'lsa ayirish belgisi (1-sinf, 10-20 emas)
      if (s[i - 1] === ' ' && s[i + 1] === ' ') { push('op', '-', '-'); i += 1; continue; }
      push('text', '-'); i += 1; continue;
    }
    if (rest[0] === ':') {
      // ikki nuqta faqat ikki son/harf orasida bo'lsa bo'lish belgisi ("Taqqoslang:" emas)
      const prev = out.filter(t => t.type !== 'space').pop();
      if (s[i - 1] === ' ' && s[i + 1] === ' ' && prev && ['num', 'var', 'rp', 'blank'].includes(prev.type)) { push('op', ':', ':'); i += 1; continue; }
      push('text', ':'); i += 1; continue;
    }
    if (OP_TEX[rest[0]] != null) { push('op', rest[0], OP_TEX[rest[0]]); i += 1; continue; }
    if (rest[0] === '?') {
      const prev = out.filter(t => t.type !== 'space').pop();
      // noma'lum son: amal belgisidan keyin (3 + 1 = ?, 2 × ? = 16) yoki boshida, amaldan oldin (? + 3 = 8)
      const nextCh = s.slice(i + 1).trimStart()[0] || '';
      if ((prev && prev.type === 'op') || (!prev && OP_TEX[nextCh] != null)) { push('q', '?', '{?}'); i += 1; continue; }
      push('text', '?'); i += 1; continue;
    }
    if (rest[0] === ' ' || rest[0] === '\u00a0') { push('space', rest[0]); i += 1; continue; }
    push('text', rest[0]); i += 1;
  }
  return out;
}

const OPERAND = new Set(['num', 'var', 'blank', 'q']);

// misol bo'lagi haqiqatan formula ekanini tekshirish: kamida bitta amal belgisi ikki tomonida son/harf bilan
function isFormula(toks) {
  const t = toks.filter(x => x.type !== 'space');
  if (t.some(x => x.type === 'text')) return false;
  for (let k = 0; k < t.length; k++) {
    if (t[k].type !== 'op') continue;
    const L = t[k - 1], R = t[k + 1];
    if (L && R && (OPERAND.has(L.type) || L.type === 'rp') && (OPERAND.has(R.type) || R.type === 'lp')) return true;
  }
  return false;
}

// bo'lak chetidagi juftsiz qavslar va bo'shliqlarni olib tashlash
function trimRun(run) {
  let a = 0, b = run.length;
  for (let changed = true; changed;) {
    changed = false;
    while (a < b && run[a].type === 'space') { a++; changed = true; }
    while (b > a && run[b - 1].type === 'space') { b--; changed = true; }
    // juftsiz qavs: yopilmagan "(" dan keyingisi va ochilmagan ")" gacha bo'lgani formula emas
    const open = [];
    let lastBadRp = -1;
    for (let k = a; k < b; k++) {
      if (run[k].type === 'lp') open.push(k);
      if (run[k].type === 'rp') { if (open.length) open.pop(); else lastBadRp = k; }
    }
    if (lastBadRp >= 0) { a = lastBadRp + 1; changed = true; }
    else if (open.length) { b = open[0]; changed = true; }
    while (a < b && run[a].type === 'op') { a++; changed = true; }
    while (b > a && run[b - 1].type === 'op' && run[b - 1].raw !== '=') { b--; changed = true; }
  }
  return [a, b];
}

function tex(toks) {
  return toks.filter(t => t.type !== 'space').map(t => t.tex).join(' ');
}

// display — alohida qatordagi misol yoki javob: kasrlar to'liq o'lchamda (ustma-ust, katta)
function renderTex(t, display = false) {
  try {
    const html = window.katex.renderToString((display ? '\\displaystyle ' : '') + t, { throwOnError: true, output: 'html' });
    return `<span class="m">${html}</span>`;
  } catch (e) {
    return null;
  }
}

// matnni HTML'ga aylantiradi: formulalar KaTeX, qolgani oddiy matn
export function mathHTML(input) {
  const s = String(input);
  if (!window.katex) return esc(s);
  const toks = tokenize(s);
  const MATHY = new Set(['num', 'var', 'op', 'blank', 'lp', 'rp', 'q', 'space']);
  let html = '';
  let k = 0;
  while (k < toks.length) {
    if (!MATHY.has(toks[k].type)) { html += esc(toks[k].raw); k++; continue; }
    let j = k;
    while (j < toks.length && MATHY.has(toks[j].type)) j++;
    const run = toks.slice(k, j);
    const [a, b] = trimRun(run);
    const core = run.slice(a, b);
    // matndagi yolg'iz katakcha yoki kasr (7/3, 2 1/3)
    const nn = core.filter(t => t.type !== 'space');
    const lone = (nn.length === 1 && nn[0].type === 'blank')
      || (nn.length >= 1 && nn.length <= 2 && nn.every(t => t.type === 'num') && nn[nn.length - 1].tex.startsWith('\\frac'));
    const rendered = core.length && (isFormula(core) || lone) ? renderTex(tex(core)) : null;
    if (rendered) {
      html += esc(run.slice(0, a).map(t => t.raw).join('')) + rendered + esc(run.slice(b).map(t => t.raw).join(''));
    } else {
      html += esc(run.map(t => t.raw).join(''));
    }
    k = j;
  }
  return html;
}

// javob varianti: butunlay son, belgi (>, <, =) yoki formula bo'lsa — to'liq formula sifatida
export function answerHTML(input) {
  const s = String(input).trim();
  if (!window.katex) return esc(s);
  const toks = tokenize(s);
  const solid = toks.length && toks.every(t => t.type !== 'text');
  if (solid) {
    const t = toks.filter(x => x.type !== 'space');
    const onlyOp = t.length === 1 && t[0].type === 'op';
    // bitta son yoki aralash kasr (4 2/5)
    const onlyNum = t.length >= 1 && t.length <= 2 && t.every(x => x.type === 'num');
    if (onlyOp || onlyNum || isFormula(toks)) {
      const r = renderTex(tex(toks), true);
      if (r) return r;
    }
  }
  return mathHTML(s);
}

// ---------------- savol matni: misol va savolni alohida qatorlarga ajratish ----------------

// katakcha (□) so'z o'rnida ishlatilgan iboralarni tushunarli so'z bilan almashtirish
const BOX = '[□☐]';
const REWRITES = [
  [new RegExp(`To'g'ri ${BOX} qancha\\?`, 'g'), "Katakcha o'rnidagi to'g'ri sonni toping."],
  [new RegExp(`${BOX} qancha\\?`, 'g'), "Katakcha o'rnidagi sonni toping."],
  [new RegExp(`tenglamada ${BOX} = (\\d+)\\.`, 'g'), "tenglamada katakcha o'rnidagi son $1 ga teng."],
  [new RegExp(`uchun ${BOX} = (\\d+) deyildi`, 'g'), "uchun katakcha o'rnidagi son $1 deyildi"],
  [new RegExp(`${BOX} ning`, 'g'), "Katakcha o'rnidagi raqamning"],
  [new RegExp(`(^|[.?!] )${BOX} o'rniga`, 'g'), "$1Katakcha o'rniga"],
  [new RegExp(`${BOX} o'rniga`, 'g'), "katakcha o'rniga"],
];

const MATHY = new Set(['num', 'var', 'op', 'blank', 'lp', 'rp', 'q', 'space']);

// gap butunlay misoldan iboratmi (oxiridagi nuqtasiz)
function pureFormula(s) {
  const toks = tokenize(s.trim());
  return toks.length > 0 && toks.every(t => MATHY.has(t.type)) && isFormula(toks);
}

export function questionHTML(input) {
  let s = String(input).trim();
  for (const [re, to] of REWRITES) s = s.replace(re, to);
  if (!window.katex) return esc(s);

  // gaplarga ajratish ("□ + 3 = 8. Katakcha ..." → ikki gap)
  // yangi gap faqat bosh harf, raqam yoki qo'shtirnoq bilan boshlansa ("56 = ? o'nlik ..." bo'linmaydi)
  const parts = s.split(/(?<=[.?!])\s+(?=[A-ZА-ЯЎҚҒҲ0-9"«])/);
  const lines = [];
  for (const p of parts) {
    const body = p.replace(/\.$/, '');
    // "Taqqoslang: 3 + 1 __ 5 - 2" → "Taqqoslang:" va misol
    const colon = body.match(/^([^:]+:)\s+(.+)$/);
    const hint = /^\(.*\)$/.test(body.trim()); // qavs ichidagi izoh — matn ichida qoladi
    if (pureFormula(body) && !hint) lines.push({ kind: 'f', html: renderTex(tex(tokenize(body.trim())), true) });
    else if (colon && !/\d/.test(colon[1]) && pureFormula(colon[2])) {
      lines.push({ kind: 't', html: esc(colon[1]) });
      lines.push({ kind: 'f', html: renderTex(tex(tokenize(colon[2].trim())), true) });
    } else lines.push({ kind: 't', html: mathHTML(p) });
  }
  // misol qatori bo'lmasa — avvalgidek bitta matn
  if (!lines.some(l => l.kind === 'f') || lines.length === 1) {
    return lines.length === 1 && lines[0].kind === 'f'
      ? `<div class="q-formula">${lines[0].html}</div>`
      : `<div class="q-text">${mathHTML(s)}</div>`;
  }
  // ketma-ket matn gaplarini bitta qatorga yig'ish
  const merged = [];
  for (const l of lines) {
    const last = merged[merged.length - 1];
    if (l.kind === 't' && last && last.kind === 't') last.html += ' ' + l.html;
    else merged.push({ ...l });
  }
  return merged.map(l => l.kind === 'f'
    ? `<div class="q-formula">${l.html}</div>`
    : `<div class="q-text">${l.html}</div>`).join('');
}
