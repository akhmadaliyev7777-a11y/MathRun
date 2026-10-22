// Mavzu testi (1–4 sinf): yuqori sinflar bilan bir xil ko'rinish — barcha savollar bitta sahifada,
// yuqorida «Belgilandi n/10» paneli va «Testni yakunlash»; natijada xatolar va yechimlar.
// Dizayn: ../css/test.css (qz-* sinflari). Manzil: #/test/<levelId>
import { el, shuffle, loadJSON, saveBest, starsFor } from '../util.js';
import { levelById, footer, nav, applyKingdom } from '../app.js';
import { questionHTML, answerHTML, mathLoaded } from '../mathfmt.js';
import { topicTitle, testNo, testLabel, testsOf } from '../topicTitles.js';

const HARF = ['A', 'B', 'C', 'D', 'E', 'F'];
const SAVED = 'mathlearn-saqlangan-v1';

const ICON = {
  book: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M8 7h8M8 11h6"/></svg>',
  flag: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>',
  mark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
};

const savedAll = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch { return {}; } };
function savedToggle(id, data) {
  const all = savedAll();
  if (all[id]) delete all[id]; else all[id] = data;
  try { localStorage.setItem(SAVED, JSON.stringify(all)); } catch { /* private mode */ }
  return !!all[id];
}

// bankdagi yozuv -> yuqori sinflardagi savol ko'rinishi
const toQuestion = (b) => ({
  question: b.question,
  options: [String(b.correctAnswer), ...b.wrongAnswers.map(String)],
  answer: String(b.correctAnswer),
  explain: b.explain || '',
  rasm: b.rasm || '',
});

const mathOf = (html) => html; // formulalar mathfmt.js orqali tayyor HTML bo'lib keladi

export async function render(root, [levelId]) {
  const found = levelById(levelId);
  if (!found) { location.hash = '#/'; return; }
  const { grade, chorak, block, level } = found;
  applyKingdom(grade);

  root.innerHTML = '<div class="boot">Yuklanmoqda…</div>';
  const tests = testsOf(block);
  const cache = {};
  async function bankOf(lv) {
    if (!cache[lv.id]) cache[lv.id] = (await loadJSON(`data/${lv.bank}`)).map(toQuestion);
    return cache[lv.id];
  }
  // savollar darrov chiqadi; formulalar kutubxonasi (KaTeX) kelgach sahifa o'zi qayta chiziladi
  try { await bankOf(level); }
  catch (e) { root.innerHTML = '<div class="boot">Testni yuklab bo\'lmadi.</div>'; console.error(e); return; }

  const backHash = `#/g/${grade.grade}/c/${chorak.chorak}`;
  const topicName = topicTitle(grade, chorak, block);
  const page = el('div', { class: 'quiz-page' });
  root.replaceChildren(nav(null), page, footer());

  let cur = level;                    // hozirgi test
  let questions = [], order = [], picked = [], finished = false, startedAt = 0, spent = 0;
  const tabs = el('div', { class: 'quiz-progress' });
  const card = el('div', { id: 'quiz-card' });
  page.append(
    el('div', { class: 'quiz-topbar' },
      el('a', { class: 'quiz-back', href: backHash }, '← Mavzularga qaytish'),
      tabs),
    card);

  const correctOf = (q) => q.options.indexOf(q.answer);
  const answered = () => picked.filter(p => p >= 0).length;
  const savedId = (i) => `${cur.id}#${i}`;
  const scrollTop = (y = 0) => window.scrollTo({ top: Math.max(0, y - 70), behavior: 'smooth' });

  function renderTabs() {
    if (tests.length < 2) { tabs.replaceChildren(); return; }
    tabs.replaceChildren(el('div', { class: 'qz-tabs', role: 'tablist', style: `grid-template-columns:repeat(${tests.length},1fr)` },
      ...tests.map(t => el('button', {
        type: 'button', role: 'tab', class: 'qz-tab' + (t === cur ? ' active' : ''),
        onclick: () => { if (t !== cur) location.hash = `#/test/${t.id}`; },
      }, el('b', {}, testLabel(block, t)), el('small', {}, `${t.count} savol`)))));
  }

  async function start() {
    questions = await bankOf(cur);
    order = questions.map(q => shuffle(q.options.map((_, j) => j)));
    picked = questions.map(() => -1);
    finished = false;
    startedAt = Date.now();
    renderTabs();
    paint();
  }

  const markBtn = (i) => {
    const on = !!savedAll()[savedId(i)];
    return `<button type="button" class="qz-mark${on ? ' on' : ''}" data-mark="${i}" aria-pressed="${on}" title="Savolni saqlash">${ICON.mark}<span>${on ? 'Saqlandi' : 'Saqlash'}</span></button>`;
  };

  function questionCard(q, i) {
    const opts = order[i].map((oi, pos) =>
      `<button type="button" class="qz-opt${picked[i] === oi ? ' picked' : ''}" data-q="${i}" data-o="${oi}">` +
      `<span class="qz-letter">${HARF[pos]}</span><span class="qz-opt-text">${answerHTML(q.options[oi], { compact: true })}</span>` +
      `<span class="qz-tick">${ICON.check}</span></button>`).join('');
    return `<li class="qz-q${q.rasm ? ' qz-q--fig' : ''}" id="qz-q${i + 1}">` +
      `<div class="qz-q-top"><span class="qz-num">${i + 1}</span><div class="qz-text">${questionHTML(q.question, { compact: true })}</div>` +
      `<div class="qz-q-side"><span class="qz-belgi"${picked[i] >= 0 ? '' : ' hidden'}><i></i>Belgilandi</span>${markBtn(i)}</div></div>` +
      `<div class="qz-q-body">${q.rasm ? `<div class="qz-fig">${q.rasm}</div>` : ''}<div class="qz-opts">${opts}</div></div></li>`;
  }

  function resultCard(q, i) {
    const ci = correctOf(q);
    const pos = (oi) => HARF[order[i].indexOf(oi)];
    const st = picked[i] < 0 ? 'skip' : picked[i] === ci ? 'ok' : 'bad';
    const badge = st === 'ok' ? `<span class="qz-badge ok">${ICON.check}To'g'ri javob</span>`
      : st === 'bad' ? `<span class="qz-badge bad">${ICON.cross}Noto'g'ri javob</span>`
      : '<span class="qz-badge skip">Javob berilmagan</span>';
    return `<li class="qz-q qz-q--${st}" id="qz-q${i + 1}">` +
      `<div class="qz-q-top"><span class="qz-num">${i + 1}</span>${badge}<div class="qz-q-side">${markBtn(i)}</div></div>` +
      `<div class="qz-res-body">${q.rasm ? `<div class="qz-fig">${q.rasm}</div>` : ''}<div class="qz-res-main"><div class="qz-text">${questionHTML(q.question, { compact: true })}</div>` +
      `<div class="qz-answers"><div class="qz-ans"><small>Sizning javobingiz</small>` +
      (picked[i] < 0 ? '<b class="skip">—</b>'
        : `<b class="${st}">${pos(picked[i])}) ${answerHTML(q.options[picked[i]], { compact: true })} ${st === 'ok' ? ICON.check : ICON.cross}</b>`) + '</div>' +
      `<div class="qz-ans"><small>To'g'ri javob</small><b class="ok">${pos(ci)}) ${answerHTML(q.answer, { compact: true })} ${ICON.check}</b></div></div></div></div>` +
      (q.explain ? `<details class="qz-sol"${st === 'ok' ? '' : ' open'}><summary>Yechimni ko'rish ${ICON.chev}</summary>` +
        `<div class="qz-sol-body"><b class="qz-sol-title">Yechim:</b>${q.explain}</div></details>` : '') +
      '</li>';
  }

  const headBar = () => {
    const n = answered();
    return `<div class="qz-head" id="qz-head"><span class="qz-head-icon">${ICON.book}</span>` +
      `<div class="qz-head-title"><b>${topicName} — ${testLabel(block, cur)}</b><small>${questions.length} ta savol</small></div>` +
      `<div class="qz-head-progress"><small>Belgilandi: <b id="qz-count">${n} / ${questions.length}</b></small>` +
      `<span class="qz-bar"><i id="qz-bar" style="width:${Math.round(n / questions.length * 100)}%"></i></span></div>` +
      `<button type="button" class="qz-finish" id="qz-finish">${ICON.flag}<span>Testni yakunlash</span></button></div>`;
  };

  const ring = (pct) => {
    const r = 52, c = 2 * Math.PI * r;
    return '<svg class="qz-ring" viewBox="0 0 128 128" aria-hidden="true">' +
      `<circle cx="64" cy="64" r="${r}" fill="none" stroke="#e7eaf6" stroke-width="10"/>` +
      `<circle class="qz-ring-val" cx="64" cy="64" r="${r}" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}" transform="rotate(-90 64 64)"/></svg>`;
  };

  const confetti = () => {
    const colors = ['#4f5bd5', '#16a394', '#f0b429', '#e5484d', '#8b5cf6', '#2bbfa9'];
    let h = '<div class="qz-confetti" aria-hidden="true">';
    for (let k = 0; k < 26; k++)
      h += `<i style="left:${(k * 37) % 100}%;top:${(k * 53) % 70}%;background:${colors[k % colors.length]};transform:rotate(${(k * 47) % 180}deg);animation-delay:${(k % 7) * 0.08}s"></i>`;
    return h + '</div>';
  };

  function paint() {
    let html;
    if (!finished) {
      html = headBar() + `<ol class="qz-list">${questions.map(questionCard).join('')}</ol>` +
        `<div class="qz-foot"><div class="qz-warn" id="qz-warn" hidden></div>` +
        `<button type="button" class="qz-btn qz-btn--big" id="qz-finish2">${ICON.flag} Testni yakunlash</button></div>`;
    } else {
      const ok = questions.filter((q, i) => picked[i] === correctOf(q)).length;
      const skip = picked.filter(p => p < 0).length;
      const bad = questions.length - ok - skip;
      const pct = Math.round(ok / questions.length * 100);
      const lvl = pct >= 80 ? 'high' : pct >= 60 ? 'mid' : 'low';
      const word = pct === 100 ? "A'lo!" : pct >= 80 ? 'Yaxshi natija!' : pct >= 60 ? 'Yomon emas!' : 'Mashq qiling';
      const msg = pct === 100 ? "Barcha savollarga to'g'ri javob berdingiz! 🎉"
        : pct >= 80 ? "Zo'r! Xatolaringizning yechimini ko'rib chiqing."
        : pct >= 60 ? "Xatolar ustida ishlasangiz, natija yanada yaxshi bo'ladi."
        : "Yechimlarni diqqat bilan o'qing va qaytadan ishlab ko'ring.";
      const mm = Math.floor(spent / 60), ss = spent % 60;
      const nextTest = tests[tests.indexOf(cur) + 1];
      html =
        `<div class="qz-result qz-result--${lvl}">${pct >= 80 ? confetti() : ''}` +
        `<div class="qz-result-top"><div class="qz-ring-wrap">${ring(pct)}<div class="qz-ring-text"><b>${ok} / ${questions.length}</b><span>${word}</span></div></div>` +
        `<p class="qz-msg">${topicName} — ${testLabel(block, cur)}<br><span>${msg}</span></p></div>` +
        '<div class="qz-stats">' +
        `<div class="qz-stat ok"><span>${ICON.check}</span><div><small>To'g'ri</small><b>${ok}</b></div></div>` +
        `<div class="qz-stat bad"><span>${ICON.cross}</span><div><small>Xato${skip ? ' / javobsiz' : ''}</small><b>${bad}${skip ? ' / ' + skip : ''}</b></div></div>` +
        `<div class="qz-stat time"><span>${ICON.clock}</span><div><small>Vaqt</small><b>${mm}:${ss < 10 ? '0' : ''}${ss}</b></div></div></div>` +
        '<div class="qz-actions">' +
        (bad + skip ? '<button type="button" class="qz-btn qz-btn--ghost" id="qz-only-wrong">Faqat xatolarni ko\'rsatish</button>' : '') +
        '<button type="button" class="qz-btn" id="qz-again">Qaytadan ishlash</button></div>' +
        (nextTest ? `<button type="button" class="qz-next-test" data-go="${nextTest.id}">Keyingisi: ${testLabel(block, nextTest)} →</button>` : '') +
        '</div>' +
        `<ol class="qz-list">${questions.map(resultCard).join('')}</ol>` +
        `<div class="qz-foot qz-foot--center"><a class="qz-btn qz-btn--ghost" href="${backHash}">Mavzularga qaytish</a></div>`;
    }
    card.innerHTML = html;
    card.classList.toggle('qz-done', finished);
    card.classList.remove('qz-only-wrong');
    wireMarks();

    if (!finished) {
      card.querySelectorAll('.qz-opt').forEach(b => b.addEventListener('click', () => {
        const qi = Number(b.dataset.q);
        picked[qi] = Number(b.dataset.o);
        b.parentNode.querySelectorAll('.qz-opt').forEach(x => x.classList.toggle('picked', x === b));
        const li = b.closest('.qz-q');
        li.classList.remove('qz-q--miss');
        li.querySelector('.qz-belgi').hidden = false;
        document.getElementById('qz-warn').hidden = true;
        const n = answered();
        document.getElementById('qz-count').textContent = `${n} / ${questions.length}`;
        document.getElementById('qz-bar').style.width = Math.round(n / questions.length * 100) + '%';
      }));
      document.getElementById('qz-finish').addEventListener('click', () => tryFinish(false));
      document.getElementById('qz-finish2').addEventListener('click', () => tryFinish(false));
    } else {
      document.getElementById('qz-again').addEventListener('click', () => { start(); scrollTop(); });
      const only = document.getElementById('qz-only-wrong');
      if (only) only.addEventListener('click', () => {
        const on = card.classList.toggle('qz-only-wrong');
        only.textContent = on ? 'Hamma savollarni ko\'rsatish' : 'Faqat xatolarni ko\'rsatish';
      });
      card.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { location.hash = `#/test/${b.dataset.go}`; }));
    }
  }

  function wireMarks() {
    card.querySelectorAll('[data-mark]').forEach(b => b.addEventListener('click', () => {
      const i = Number(b.dataset.mark), q = questions[i];
      const on = savedToggle(savedId(i), { k: cur.id, i, q: q.question, a: q.answer, t: Date.now() });
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      b.querySelector('span').textContent = on ? 'Saqlandi' : 'Saqlash';
    }));
  }

  function tryFinish(force) {
    const missing = [];
    picked.forEach((p, i) => { if (p < 0) missing.push(i + 1); });
    if (missing.length && !force) {
      const warn = document.getElementById('qz-warn');
      warn.innerHTML = `<b>${missing.length} ta savolga javob berilmagan:</b> ` +
        missing.map(n => `<a href="#qz-q${n}" data-jump="${n}">${n}</a>`).join(', ') +
        '<div class="qz-warn-actions"><button type="button" class="qz-btn qz-btn--ghost" id="qz-force">Baribir yakunlash</button></div>';
      warn.hidden = false;
      missing.forEach(n => document.getElementById('qz-q' + n).classList.add('qz-q--miss'));
      document.getElementById('qz-force').addEventListener('click', () => tryFinish(true));
      warn.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('qz-q' + a.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }));
      warn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    finished = true;
    spent = Math.round((Date.now() - startedAt) / 1000);
    const ok = questions.filter((q, i) => picked[i] === correctOf(q)).length;
    saveBest(cur.id, starsFor(ok, questions.length), ok * 10);
    paint();
    scrollTop();
  }

  start();
  if (!window.katex) mathLoaded().then((ok) => { if (ok && card.isConnected) paint(); });
}
