import { el, shuffle, loadJSON, readCustomTug, saveCustomTug, clearCustomTug } from '../util.js';
import { questionHTML, answerHTML, mathReady } from '../mathfmt.js';
import { ICON } from '../icons.js';
import { nav, footer, applyKingdom } from '../app.js';
import { loadXLSXLib, parseQuestionsWorkbook } from '../xlsxImport.js';

// arqon tortish maydoni fonlari: har joyning kunduzgi (fon-<joy>.webp) va tungi (fon-<joy>-tun.webp) rasmi
// (promptlar — design/oyin-kartochka-promptlar.md). TUN_BOR — tungi rasmi tayyor joylar; qolganlarida tunda tayyorlaridan biri chiqadi.
const FON_JOY = ['maydon', 'sohil', 'qish', 'stadion', 'yaylov'];
const TUN_BOR = ['stadion', 'yaylov'];
// to'liq ekran belgisi: burchaklar tashqariga (kirish) va ichkariga (chiqish)
const FS_KIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/></svg>';
const FS_CHIQ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v3.5A1.5 1.5 0 0 1 7.5 9H4M20 9h-3.5A1.5 1.5 0 0 1 15 7.5V4M15 20v-3.5a1.5 1.5 0 0 1 1.5-1.5H20M4 15h3.5A1.5 1.5 0 0 1 9 16.5V20"/></svg>';
const WIN = 12;        // shu farqda o'yin tugaydi (bir tomon arqonni tortib oladi)
const STEP_PX = 13;    // farqning har bir birligi uchun arqon siljishi
const WRONG_PENALTY = 1; // har xato javob — jamoa ochkosidan ayiriladi (kerak bo'lsa minusga ham tushadi)

function puller(color, facing) {
  // sodda tortayotgan odam figurasi; facing: 1 = o'ngga qarab tortadi, -1 = chapga
  const f = facing;
  return `<svg width="52" height="76" viewBox="0 0 66 96" fill="none">
    <g transform="translate(33,0) scale(${f},1) translate(-33,0)">
      <circle cx="30" cy="16" r="11" fill="${color}"/>
      <path d="M30 27 C30 27 26 46 24 60 L20 92" stroke="${color}" stroke-width="11" stroke-linecap="round"/>
      <path d="M24 40 L52 52" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
      <path d="M24 44 L44 60" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
      <path d="M22 62 L40 90" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
      <path d="M22 60 L8 92" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
    </g>
  </svg>`;
}

export async function render(root, _params) {
  applyKingdom(null);
  let cats;
  try {
    const [j] = await Promise.all([loadJSON('data/tug_questions.json'), mathReady()]);
    cats = j.categories || [{ id: 'all', name: 'Barcha savollar', questions: j.questions || j }];
  } catch (e) { root.innerHTML = '<div class="boot">Savol bankini yuklab bo\'lmadi.</div>'; return; }
  cats = cats.filter(c => c.questions && c.questions.length);
  const allQ = cats.flatMap(c => c.questions);

  let names = { blue: 'Ko\'k jamoa', red: 'Qizil jamoa' };
  let durationSec = 180;
  let catId = 'all';   // 'all' = aralash
  let goal = 15;       // birinchi shu ochkoga yetgan jamoa g'olib
  let grade = 'all';   // 'all' yoki sinf raqami — mavzular ro'yxatini filtrlaydi
  let gradeOpen = false;
  let topicOpen = false;
  let topicSearch = '';
  const grades = [...new Set(cats.map(c => c.grade))].filter(g => g != null).sort((a, b) => a - b);

  let customSet = readCustomTug();   // null yoki {name, type, optionCount, questions, savedAt}
  let uploadForm = { topicName: '', type: 'regular', optCount: 4, expectedCount: '', file: null };
  let uploadStatus = null;           // {kind:'success'|'warning'|'error', message, rowErrors}
  let uploadBusy = false;

  // to'liq ekran (foydalanuvchi, 2026-10-30): o'yin boshlanganda yoqiladi, «Chiqish»da o'chadi
  // faqat o'yin qismi (sayt menyusisiz) to'liq ekranga chiqadi
  const toliqEkran = () => {
    const d = root, f = d.requestFullscreen || d.webkitRequestFullscreen;
    if (f && !(document.fullscreenElement || document.webkitFullscreenElement)) { try { const r = f.call(d); if (r && r.catch) r.catch(() => {}); } catch { /* */ } }
  };
  const toliqdanChiq = () => {
    const f = document.exitFullscreen || document.webkitExitFullscreen;
    if (f && (document.fullscreenElement || document.webkitFullscreenElement)) { try { const r = f.call(document); if (r && r.catch) r.catch(() => {}); } catch { /* */ } }
  };

  function config() {
    toliqdanChiq();
    const catsInGrade = grade === 'all' ? cats : cats.filter(c => c.grade === grade);
    const mixedCount = (grade === 'all' ? allQ : catsInGrade.flatMap(c => c.questions)).length;
    const topicLabel = catId === 'custom' && customSet ? customSet.name
      : catId === 'all' ? `Aralash (${mixedCount})`
      : (cats.find(c => c.id === catId)?.name || 'Aralash');
    const gradeLabel = grade === 'all' ? 'Barcha sinflar' : `${grade}-sinf`;

    const durBtn = (s, label) => el('button', {
      class: 'chorak-tab chorak-tab--sm' + (durationSec === s ? ' is-active' : ''),
      onclick: () => { durationSec = s; config(); },
    }, label);
    const goalBtn = (g, label) => el('button', {
      class: 'chorak-tab chorak-tab--sm' + (goal === g ? ' is-active' : ''),
      onclick: () => { goal = g; config(); },
    }, label);

    // ----- SINF selektori -----
    const gradePop = !gradeOpen ? null : el('div', { class: 'tug-pop' },
      el('button', {
        class: 'tug-pop__item' + (grade === 'all' ? ' is-active' : ''),
        onclick: () => { grade = 'all'; gradeOpen = false; config(); },
      }, el('span', {}, 'Barcha sinflar')),
      ...grades.map(g => el('button', {
        class: 'tug-pop__item' + (grade === g ? ' is-active' : ''),
        onclick: () => {
          grade = g; gradeOpen = false;
          const cur = cats.find(c => c.id === catId);
          if (catId !== 'all' && catId !== 'custom' && cur && cur.grade !== g) catId = 'all';
          config();
        },
      }, el('span', {}, `${g}-sinf`))));
    const gradeSelect = el('div', { class: 'tug-select' + (gradeOpen ? ' is-open' : '') },
      el('div', { class: 'tug-select__label' }, 'SINF'),
      el('button', {
        class: 'tug-select__btn', type: 'button',
        onclick: () => { gradeOpen = !gradeOpen; topicOpen = false; config(); },
      }, el('span', {}, gradeLabel), el('span', { class: 'tug-select__ico', html: ICON.chevronDown })),
      gradePop);

    // ----- MAVZU selektori (qidiruv bilan) -----
    let searchVal = topicSearch;
    const listBox = el('div', { class: 'tug-pop__list' });
    function renderTopicList() {
      const q = searchVal.trim().toLowerCase();
      const items = [
        { id: 'all', name: 'Aralash', count: (grade === 'all' ? allQ : catsInGrade.flatMap(c => c.questions)).length },
        ...(customSet ? [{ id: 'custom', name: customSet.name, count: customSet.questions.length, custom: true }] : []),
        ...catsInGrade.map(c => ({ id: c.id, name: c.name, count: c.questions.length })),
      ].filter(it => !q || it.name.toLowerCase().includes(q));
      listBox.replaceChildren(...(items.length ? items.map(it => el('button', {
        class: 'tug-pop__item' + (catId === it.id ? ' is-active' : ''),
        onclick: () => { catId = it.id; topicOpen = false; config(); },
      }, el('span', {}, it.name, it.custom ? el('span', { class: 'tug-pop__badge' }, 'Yuklangan') : null),
         el('i', {}, String(it.count)))) : [el('div', { class: 'tug-pop__empty' }, 'Mavzu topilmadi')]));
    }
    renderTopicList();
    const topicPop = !topicOpen ? null : el('div', { class: 'tug-pop' },
      el('div', { class: 'tug-pop__search' },
        el('span', { class: 'tug-pop__search-ico', html: ICON.search }),
        el('input', {
          class: 'tug-pop__input', placeholder: 'Mavzu qidirish...', value: searchVal,
          oninput: (e) => { searchVal = e.target.value; topicSearch = searchVal; renderTopicList(); },
        })),
      listBox);
    const topicSelect = el('div', { class: 'tug-select tug-select--wide' + (topicOpen ? ' is-open' : '') },
      el('div', { class: 'tug-select__label' }, 'MAVZU'),
      el('button', {
        class: 'tug-select__btn', type: 'button',
        onclick: () => { topicOpen = !topicOpen; gradeOpen = false; config(); },
      }, el('span', {}, topicLabel), el('span', { class: 'tug-select__ico', html: ICON.search })),
      topicPop);

    // ----- O'YIN YUKLASH (Excel) -----
    function statusBox() {
      if (!uploadStatus) return null;
      const cls = 'tug-upload__status tug-upload__status--' +
        (uploadStatus.kind === 'error' ? 'err' : uploadStatus.kind === 'warning' ? 'warn' : 'ok');
      const shown = (uploadStatus.rowErrors || []).slice(0, 20);
      const extra = (uploadStatus.rowErrors || []).length - shown.length;
      return el('div', { class: cls },
        el('p', {}, uploadStatus.message),
        shown.length ? el('ul', { class: 'tug-upload__errlist' },
          ...shown.map(re => el('li', {}, `${re.row}-qator: ${re.message}`)),
          extra > 0 ? el('li', {}, `... va yana ${extra} ta xato`) : null) : null);
    }

    async function onUploadClick() {
      if (uploadBusy) return;
      const name = uploadForm.topicName.trim();
      if (!name) { uploadStatus = { kind: 'error', message: 'Mavzu nomini kiriting.' }; config(); return; }
      const file = uploadForm.file;
      if (!file) { uploadStatus = { kind: 'error', message: "Fayl tanlanmagan. Iltimos, .xlsx faylni tanlang." }; config(); return; }
      if (!/\.xlsx$/i.test(file.name)) {
        uploadStatus = { kind: 'error', message: 'Faqat .xlsx formatidagi fayllar qabul qilinadi.' };
        config(); return;
      }
      const optionCount = uploadForm.type === 'tf' ? 2 : uploadForm.optCount;
      uploadBusy = true; uploadStatus = null; config();
      try {
        await loadXLSXLib();
      } catch (e) {
        uploadBusy = false;
        uploadStatus = { kind: 'error', message: 'Excel kutubxonasini yuklab bo\'lmadi. Internet aloqasini tekshiring.' };
        config(); return;
      }
      let result;
      try {
        result = await parseQuestionsWorkbook(file, optionCount);
      } catch (e) {
        uploadBusy = false;
        uploadStatus = { kind: 'error', message: "Faylni o'qib bo'lmadi. Fayl buzilgan yoki noto'g'ri formatda bo'lishi mumkin." };
        config(); return;
      }
      uploadBusy = false;
      if (result.totalDataRows === 0) {
        uploadStatus = { kind: 'error', message: "Faylda savollar topilmadi. Birinchi qator sarlavha, 2-qatordan savollar boshlanishi kerak." };
        config(); return;
      }
      if (result.questions.length === 0) {
        uploadStatus = { kind: 'error', message: "Birorta ham savol to'g'ri o'qilmadi. Quyidagi xatolarni tuzating:", rowErrors: result.rowErrors };
        config(); return;
      }
      customSet = { name, type: uploadForm.type, optionCount, questions: result.questions, savedAt: Date.now() };
      saveCustomTug(customSet);
      catId = 'custom';
      let message = `${result.questions.length} ta savol muvaffaqiyatli yuklandi.`;
      const expected = Number(uploadForm.expectedCount);
      if (expected > 0 && expected !== result.questions.length) {
        message += ` Diqqat: siz ${expected} ta savol kiritgan edingiz, lekin faylda ${result.questions.length} ta savol topildi.`;
      }
      uploadStatus = {
        kind: result.rowErrors.length ? 'warning' : 'success',
        message, rowErrors: result.rowErrors,
      };
      config();
    }

    function onRemoveCustom() {
      clearCustomTug();
      customSet = null;
      if (catId === 'custom') catId = 'all';
      uploadStatus = null;
      config();
    }

    function uploadPanel() {
      const typeBtn = (t, label) => el('button', {
        class: 'chorak-tab chorak-tab--sm' + (uploadForm.type === t ? ' is-active' : ''),
        onclick: () => { uploadForm.type = t; config(); },
      }, label);
      const optBtn = (n, label) => el('button', {
        class: 'chorak-tab chorak-tab--sm' + (uploadForm.optCount === n ? ' is-active' : ''),
        onclick: () => { uploadForm.optCount = n; config(); },
      }, label);

      return el('div', { class: 'tug-setup__col tug-setup__col--upload' },
        el('h3', { class: 'tug-upload__title' }, "O'yin yuklash"),
        el('p', { class: 'tug-upload__hint' }, "Tayyor Excel (.xlsx) fayldan o'z savollaringizni yuklang."),
        el('label', { class: 'tug-field' }, 'Mavzu nomi',
          el('input', {
            class: 'tug-input', value: uploadForm.topicName, placeholder: 'Masalan: Geometriya asoslari',
            oninput: e => uploadForm.topicName = e.target.value,
          })),
        el('div', { class: 'tug-field' }, 'SAVOL TURI',
          el('div', { class: 'chorak-tabs' }, typeBtn('regular', 'Oddiy savollar'), typeBtn('tf', "Rost yoki Yolg'on"))),
        uploadForm.type === 'regular' ? el('div', { class: 'tug-field' }, 'JAVOBLAR SONI',
          el('div', { class: 'chorak-tabs' }, optBtn(3, '3'), optBtn(4, '4'))) : null,
        el('label', { class: 'tug-field' }, 'Savollar soni (taxminiy)',
          el('input', {
            class: 'tug-input', type: 'number', min: '1', value: uploadForm.expectedCount,
            oninput: e => uploadForm.expectedCount = e.target.value,
          })),
        el('label', { class: 'tug-field' }, 'Excel fayl (.xlsx)',
          el('input', {
            class: 'tug-input', type: 'file',
            accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            onchange: e => { uploadForm.file = e.target.files[0] || null; uploadStatus = null; config(); },
          })),
        el('div', { class: 'tug-field', style: 'margin-top:4px' },
          el('button', { class: 'btn btn--ink btn--sm', onclick: onUploadClick },
            uploadBusy ? 'Yuklanmoqda…' : 'Yuklash')),
        statusBox(),
        customSet ? el('div', { class: 'tug-upload__current' },
          el('span', {}, `Joriy yuklangan: ${customSet.name} (${customSet.questions.length} ta savol)`),
          el('button', { class: 'btn btn--sm', onclick: onRemoveCustom }, "O'chirish")) : null);
    }

    root.replaceChildren(
      el('main', { class: 'wrap tug-setup' },
        el('div', { class: 'crumb', style: 'padding-top:18px' },
          el('button', { onclick: () => { location.hash = '#/games'; } },
            el('span', { style: 'width:15px;height:15px;vertical-align:-2px;display:inline-block', html: ICON.arrowLeft }),
            ' Fikrlash o\'yinlari')),
        el('section', { class: 'section', style: 'padding-top:16px' },
          el('h2', {}, 'Arqon tortish'),
          el('p', { class: 'section__lead' },
            'Ikki jamoa yonma-yon o\'ynaydi. Har jamoaga o\'z savoli va A–D variantlari. ' +
            'To\'g\'ri javob — +1 ochko, arqon o\'z tomoningga tortiladi; xato javob — ochkodan 1 ayiriladi. ' +
            'Birinchi bo\'lib maqsad ochkoga yetgan jamoa g\'olib; vaqt tugasa ochkosi ko\'p jamoa yutadi. ' +
            'Ikkala jamoaga har raundda bir xil qiyinlikdagi misollar beriladi.'),
          el('div', { class: 'tug-setup__grid' },
            el('div', { class: 'tug-setup__col' },
              el('div', { class: 'tug-cfg' },
                el('label', {}, 'Ko\'k jamoa nomi',
                  el('input', { class: 'tug-input', value: names.blue, oninput: e => names.blue = e.target.value || 'Ko\'k jamoa' })),
                el('label', {}, 'Qizil jamoa nomi',
                  el('input', { class: 'tug-input', value: names.red, oninput: e => names.red = e.target.value || 'Qizil jamoa' }))),
              el('div', { class: 'tug-selrow' }, gradeSelect, topicSelect),
              el('div', { class: 'tug-optrow' },
                el('div', { class: 'tug-optcol' },
                  el('div', { class: 'tug-optcol__label' }, 'G\'OLIB — MAQSAD OCHKO'),
                  el('div', { class: 'chorak-tabs' }, goalBtn(10, '10'), goalBtn(15, '15'), goalBtn(20, '20'), goalBtn(25, '25'))),
                el('div', { class: 'tug-optcol' },
                  el('div', { class: 'tug-optcol__label' }, 'VAQT CHEGARASI'),
                  el('div', { class: 'chorak-tabs' }, durBtn(120, '2 daq'), durBtn(180, '3 daq'), durBtn(300, '5 daq')))),
              el('div', { class: 'tug-startrow' },
                el('button', { class: 'btn btn--tug-start', onclick: play }, 'Boshlash',
                  el('span', { style: 'width:22px;height:22px', html: ICON.arrowRight }))),
              el('p', { style: 'font-weight:600;font-size:13px;color:var(--muted-soft);margin-top:22px' },
                'Klaviatura: ko\'k jamoa — 1 2 3 4 · qizil jamoa — 7 8 9 0. Sensorli ekranda variantni bosing. ',
                el('span', { class: 'admin-only' }, 'Savollarni tahrirlash: data/tug_questions.json.'))),
            uploadPanel()))),
      footer());

    if (topicOpen) {
      const inp = root.querySelector('.tug-pop__input');
      if (inp) { inp.focus(); const v = inp.value; inp.setSelectionRange(v.length, v.length); }
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.tug-select')) return;
    if (gradeOpen || topicOpen) { gradeOpen = false; topicOpen = false; config(); }
  });

  function play() {
    toliqEkran();
    const gradedCats = grade === 'all' ? cats : cats.filter(c => c.grade === grade);
    const gradedPool = grade === 'all' ? allQ : gradedCats.flatMap(c => c.questions);
    const pool = catId === 'custom' && customSet ? customSet.questions
      : catId === 'all' ? gradedPool
      : (cats.find(c => c.id === catId)?.questions || gradedPool);
    // ~30 raund: har raund ikkala jamoaga BIR XIL qiyinlikdagi, lekin HAR XIL savol.
    // usedAll — butun o'yin davomida (ikkala jamoa + qayta qurish) berilgan savollar;
    // bank tugamaguncha hech bir savol takrorlanmaydi va bir raundda ikki jamoaga
    // aynan bir xil misol hech qachon tushmaydi. Qiyinlik o'rtachaga og'ishgan (ko'pi d2).
    const usedAll = new Set();
    function buildRounds(n) {
      const byD = { 1: [], 2: [], 3: [] };
      pool.forEach(q => (byD[q.d || 2] || byD[2]).push(q));
      const bag = [1, 2, 2, 2, 2, 3];
      const rounds = [];
      const pick = (arr, banned) => {
        // 1) shu qiyinlikdagi ishlatilmagan savol
        let cand = arr.filter(q => !usedAll.has(q.q) && q.q !== banned);
        // 2) tugagan bo'lsa — istalgan qiyinlikdagi ishlatilmagan savol (takrorni kechiktiramiz)
        if (!cand.length) cand = pool.filter(q => !usedAll.has(q.q) && q.q !== banned);
        // 3) butun bank tugadi — hisobni tozalab qaytadan, lekin shu raund juftini chetlaymiz
        if (!cand.length) {
          usedAll.clear();
          cand = pool.filter(q => q.q !== banned);
          if (!cand.length) cand = pool.slice();
        }
        const q = cand[Math.floor(Math.random() * cand.length)];
        usedAll.add(q.q);
        return { ...q, order: shuffle(q.options.map((_, i) => i)) };
      };
      for (let k = 0; k < n; k++) {
        let t = bag[Math.floor(Math.random() * bag.length)];
        let arr = byD[t].length >= 2 ? byD[t] : (byD[2].length >= 2 ? byD[2] : pool);
        const b = pick(arr, null);
        const r = pick(arr, b.q);
        rounds.push({ blue: b, red: r });
      }
      return rounds;
    }
    let rounds = buildRounds(30);
    const state = {
      blue: { score: 0, correct: 0, wrong: 0, q: null, i: 0 },
      red: { score: 0, correct: 0, wrong: 0, q: null, i: 0 },
      left: durationSec, over: false, starting: true, locked: { blue: false, red: false },
    };
    const nextQ = (team) => {
      if (state[team].i >= rounds.length) rounds = rounds.concat(buildRounds(15));
      state[team].q = rounds[state[team].i++][team];
    };
    nextQ('blue'); nextQ('red');

    let endPos = null;
    const pos = () => {
      // arqon ochkolar farqiga qarab siljiydi (xato ochkoni kamaytiradi — arqon ham raqib tomonga ketadi)
      if (endPos !== null) return endPos;   // o'yin tugadi — g'olib arqonni oxirigacha tortgan holat
      const p = state.red.score - state.blue.score;
      return Math.max(-WIN, Math.min(WIN, p));
    };

    // ----- DOM -----
    // Sahna ikki qism (2026-10-30, muqova uslubida): ko'k jamoa chap chetda, qizil jamoa o'ng chetda — ekrandan chiqmaydi;
    // ochkolar farqiga qarab o'rtadagi bayroqcha arqon bo'ylab yutayotgan tomonga siljiydi, jamoalar biroz chayqaladi.
    // Rasmlar: assets/tug/kok.webp, qizil.webp, bayroq.webp, arqon.webp (arqon — takrorlanuvchi bo'lak). Rasm topilmasa — SVG figuralar.
    const svgFallback = () => [
      el('div', { class: 'tug-team tug-team--blue' }, el('span', { html: puller('#5C7FF5', 1) }), el('span', { html: puller('#8055EE', 1) })),
      el('div', { class: 'tug-rope' }, el('div', { class: 'tug-knot' })),
      el('div', { class: 'tug-team tug-team--red' }, el('span', { html: puller('#FF5C5C', -1) }), el('span', { html: puller('#F8912F', -1) })),
    ];
    let rig = null;   // faqat zaxira (SVG) holatida
    const useFallback = () => {
      if (rig) return;
      rig = el('div', { class: 'tug-rig' }, ...svgFallback());
      arena.replaceChildren(el('div', { class: 'tug-centerline' }), rig);
      paintRig();
    };
    const img = (cls, src) => el('img', { class: cls, src, alt: '', draggable: 'false', onerror: useFallback, onload: () => paintRig() });
    const sideBlue = img('tug-side tug-side--blue', 'assets/tug/kok.webp');
    const sideRed = img('tug-side tug-side--red', 'assets/tug/qizil.webp');
    const flag = img('tug-flag', 'assets/tug/bayroq.webp');
    const rope = el('div', { class: 'tug-arqon' });
    // fon (2026-10-30) — butun o'yin sahifasining orqasida: har o'yinda tasodifiy joy, kunduzgi rejimda uning kunduzgi,
    // tungi rejimda tungi rasmi (CSS qaysi biri ko'rinishini tanlaydi); ufq chizig'i bolalar turgan joyga moslanadi (fonJoyla)
    const tasodif = (a) => a[Math.floor(Math.random() * a.length)];
    const joy = tasodif(FON_JOY), tunJoy = TUN_BOR.includes(joy) ? joy : tasodif(TUN_BOR);
    const fonKun = el('img', { class: 'tug-fon tug-fon--kun', src: `assets/tug/fon-${joy}.webp`, alt: '', loading: 'lazy', decoding: 'async' });
    const fonTun = el('img', { class: 'tug-fon tug-fon--tun', src: `assets/tug/fon-${tunJoy}-tun.webp`, alt: '', loading: 'lazy', decoding: 'async' });
    const arena = el('div', { class: 'tug-arena' }, el('div', { class: 'tug-centerline' }), rope, sideBlue, sideRed, flag);
    // fonni shunday kattalashtirib joylaymizki, rasmdagi ufq (balandligining ~56 %) arqon balandligiga to'g'ri kelsin va fon sahifani to'liq qoplasin
    const UFQ = 0.56;
    function fonJoyla(ufqY) {
      const sahna = arena.closest('.tug-sahna');
      if (!sahna) return;
      const W = sahna.clientWidth, H = sahna.clientHeight;
      const h = Math.max(H, W / 1.5, ufqY / UFQ, (H - ufqY) / (1 - UFQ)), w = h * 1.5;
      for (const f of [fonKun, fonTun]) Object.assign(f.style, { width: w + 'px', height: h + 'px', left: (W - w) / 2 + 'px', top: (ufqY - UFQ * h) + 'px' });
    }
    const onResize = () => { if (!arena.isConnected) window.removeEventListener('resize', onResize); else paintRig(); };
    window.addEventListener('resize', onResize);
    const timerEl = el('div', { class: 'tug-timer' }, el('span', { style: 'width:20px;height:20px', html: ICON.clock }), el('b', {}, fmt(state.left)));
    const scoreBlue = el('b', { class: 'tug-score' }, '0');
    const scoreRed = el('b', { class: 'tug-score' }, '0');

    // matn qotirilgan maydonga sig'maguncha shriftni kichraytirish (panel o'lchami o'zgarmasin)
    function fitText(node) {
      node.style.fontSize = '';
      let size = parseFloat(getComputedStyle(node).fontSize);
      while ((node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) && size > 12) {
        size -= 1;
        node.style.fontSize = size + 'px';
      }
    }
    function panel(team, side) {
      const box = el('div', { class: `tug-panel tug-panel--${side}` });
      redrawPanel(box, team, side);
      return box;
    }
    function redrawPanel(box, team, side) {
      const q = state[team].q;
      box.replaceChildren(
        el('div', { class: 'tug-q', html: questionHTML(q.q, { compact: true }) }),
        el('div', { class: 'tug-opts' }, ...q.order.map((oi, k) =>
          el('button', {
            class: 'tug-opt', dataset: { team },
            onclick: (e) => answer(team, oi, e.currentTarget, box, side),
          }, el('i', {}, 'ABCD'[k]), el('span', { html: answerHTML(q.options[oi]) })))));
      requestAnimationFrame(() => box.querySelectorAll('.tug-q, .tug-opt').forEach(fitText));
    }

    const bluePanel = panel('blue', 'blue');
    const redPanel = panel('red', 'red');

    // jamoa rasmlari (3 tadan bola, asl kesim 475 px balandlikda): arqon markazi 240,5 px da, arqon bo'lagi 28 px; bayroqcha rasmida arqon 30,5/180
    const ROPE_Y = 240.5 / 475, ROPE_H = 28 / 475, FLAG_ROPE = 30.5 / 180, TEAM_AR = 832 / 475;
    function paintRig() {
      if (rig) rig.style.transform = `translate(-50%, -50%) translateX(${pos() * STEP_PX}px)`;
      else if (arena.isConnected) {
        const W = arena.clientWidth, H = arena.clientHeight, pad = W * 0.02;
        const th = Math.min(H * 0.6, W * 0.4 / TEAM_AR);          // jamoa balandligi: ikkalasi ham bir xil o'lchamda
        const top = (H - th) / 2 + H * 0.02;
        for (const s of [sideBlue, sideRed]) { s.style.height = th + 'px'; s.style.top = top + 'px'; }
        sideBlue.style.left = pad + 'px'; sideRed.style.right = pad + 'px';
        const bw = sideBlue.offsetWidth || th * TEAM_AR, rw = sideRed.offsetWidth || th * TEAM_AR;
        // arqon faqat ikki jamoa orasida (rasmlardagi arqon oxirgi boladan keyin o'zi tugaydi)
        const ropeY = top + th * ROPE_Y, rh = th * ROPE_H;
        rope.style.top = (ropeY - rh / 2) + 'px'; rope.style.height = rh + 'px';
        rope.style.left = (pad + bw - 6) + 'px'; rope.style.right = (pad + rw - 6) + 'px';
        const fh = th * 180 / 475;
        flag.style.height = fh + 'px'; flag.style.top = (ropeY - fh * FLAG_ROPE) + 'px';
        arena.style.setProperty('--yer', (top + th * 0.96) + 'px');
        const sahna = arena.closest('.tug-sahna');
        if (sahna) fonJoyla(arena.getBoundingClientRect().top - sahna.getBoundingClientRect().top + ropeY + th * 0.06);
        // tortish yaqqol ko'rinsin (foydalanuvchi, 2026-10-30): yutayotgan jamoa tortgan sari ekran chetidan chiqib ketaveradi
        // (out — jamoa kengligining 3/4 qismigacha), yutqazayotgan jamoa arqon bilan uning ortidan sudraladi (drag + out);
        // bayroqcha yutayotganlar qo'liga yaqinlashadi. Birinchi ochkolar ham sezilsin — siljish «tez boshlanib, sekin tugaydi».
        const f0 = pos() / WIN, f = Math.sign(f0) * (1 - (1 - Math.abs(f0)) ** 1.5);
        const gap0 = W - 2 * pad - bw - rw, drag = Math.max(0, gap0 - fh * 1.2);
        const outB = pad + bw * 0.75, outR = pad + rw * 0.75;
        const sB = f > 0 ? f * (drag + outR) : f * outB;   // ko'k: o'ngga sudraladi yoki chapga tortib chiqib ketadi
        const sR = f < 0 ? f * (drag + outB) : f * outR;
        sideBlue.style.transform = `translateX(${sB}px)`;
        sideRed.style.transform = `translateX(${sR}px)`;
        rope.style.left = (pad + bw - 6 + sB) + 'px'; rope.style.right = (pad + rw - 6 - sR) + 'px'; rope.style.transform = '';
        const bR = pad + bw + sB, rL = W - pad - rw + sR;  // jamoalar ichki chetlari
        const fx = (bR + rL) / 2 + f * Math.max(0, (rL - bR) / 2 - fh * 0.35) - W / 2;
        flag.style.transform = `translateX(-50%) translateX(${fx}px)`;
      }
      scoreBlue.textContent = fmtScore(state.blue.score);
      scoreRed.textContent = fmtScore(state.red.score);
    }

    // to'g'ri javobda jamoa arqonni bir silkitib keskin tortadi (jamoa, arqon va bayroqcha birga)
    function jerk(team) {
      const cls = team === 'blue' ? 'is-tortdi-chap' : 'is-tortdi-ong';
      for (const n of [sideBlue, sideRed, rope, flag]) { n.classList.remove('is-tortdi-chap', 'is-tortdi-ong'); void n.offsetWidth; n.classList.add(cls); }
    }

    function answer(team, optIdx, btn, box, side) {
      if (state.over || state.starting || state.locked[team]) return;
      state.locked[team] = true;
      const ok = optIdx === state[team].q.correct;
      btn.classList.add(ok ? 'is-correct' : 'is-wrong');
      if (ok) { state[team].correct++; state[team].score++; jerk(team); }
      else {
        state[team].wrong++;
        state[team].score -= WRONG_PENALTY;
        minusFlash(team);
      }
      paintRig();
      if (state[team].score >= goal) return finish(team);
      if (Math.abs(pos()) >= WIN) return finish();
      setTimeout(() => {
        state.locked[team] = false;
        nextQ(team);
        redrawPanel(box, team, side);
      }, ok ? 320 : 600);
    }

    // xato javobda jamoa ochkosi yonida qizil «−1» chiqadi
    function minusFlash(team) {
      const scoreEl = team === 'blue' ? scoreBlue : scoreRed;
      const fx = el('span', { class: 'tug-minus' }, '−' + WRONG_PENALTY);
      scoreEl.parentNode.appendChild(fx);
      scoreEl.classList.remove('is-minus'); void scoreEl.offsetWidth; scoreEl.classList.add('is-minus');
      setTimeout(() => { fx.remove(); scoreEl.classList.remove('is-minus'); }, 900);
    }

    const fmtScore = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));

    let tick = null;
    function startTimer() {
      tick = setInterval(() => {
        if (state.over) return;
        state.left--;
        timerEl.querySelector('b').textContent = fmt(state.left);
        if (state.left <= 0) finish();
      }, 1000);
    }

    // Esc (yoki to'liq ekrandan chiqish) — o'yin to'xtaydi, «Davom etish» yoki «Yakunlash» so'raladi
    let pauza = null, kutStart = false;
    function toxtat() {
      if (state.over || pauza || !arena.isConnected) return;
      if (tick) { clearInterval(tick); tick = null; }
      mainEl.classList.add('is-starting');
      pauza = el('div', { class: 'tug-end tug-pauza' },
        el('div', { class: 'tug-end__card' },
          el('h1', {}, "O'yin to'xtatildi"),
          el('p', { style: 'font-weight:700;color:var(--muted-soft);margin:4px 0 22px' }, "Davom etasizmi yoki o'yinni yakunlaysizmi?"),
          el('div', { class: 'result__btns' },
            el('button', { class: 'btn', onclick: () => { davom(false); finish(); } }, 'Yakunlash'),
            el('button', { class: 'btn btn--ink', onclick: () => davom(true) }, 'Davom etish'))));
      root.appendChild(pauza);
    }
    function davom(oyin) {
      if (pauza) { pauza.remove(); pauza = null; }
      if (!oyin) return;
      toliqEkran();
      if (state.starting) return;                 // sanoq tugaganda o'zi boshlanadi
      mainEl.classList.remove('is-starting');
      if (kutStart || !tick) { kutStart = false; startTimer(); }
    }
    let ozimiz = false;   // tepadagi tugma bilan chiqildi — o'yin to'xtamaydi
    const fsIkon = () => fsBtn.replaceChildren(el('span', { html: (document.fullscreenElement || document.webkitFullscreenElement) ? FS_CHIQ : FS_KIR }));
    const fsBtn = el('button', { class: 'tug-fsbtn', type: 'button', title: "To'liq ekran", 'aria-label': "To'liq ekran",
      onclick: () => { if (document.fullscreenElement || document.webkitFullscreenElement) { ozimiz = true; toliqdanChiq(); } else toliqEkran(); } });
    fsIkon();
    const onFs = () => {
      if (!arena.isConnected) { document.removeEventListener('fullscreenchange', onFs); document.removeEventListener('webkitfullscreenchange', onFs); return; }
      fsIkon();
      const ichida = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (ichida || state.over) { ozimiz = false; return; }
      if (ozimiz) { ozimiz = false; return; }
      toxtat();
    };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);

    function finish(reachedGoal) {
      if (state.over) return;
      state.over = true;
      if (tick) clearInterval(tick);
      if (pauza) { pauza.remove(); pauza = null; }
      document.removeEventListener('keydown', onKey);
      const p = pos();
      // g'olib: 1) maqsad ochkoga birinchi yetgan; 2) ochkosi ko'p; 3) arqon holati
      let winner = reachedGoal || null;
      if (!winner) {
        if (state.blue.score !== state.red.score) {
          winner = state.blue.score > state.red.score ? 'blue' : 'red';
        } else {
          winner = p < -0.001 ? 'blue' : p > 0.001 ? 'red' : null;
        }
      }
      const headline = winner
        ? `${names[winner]} — g'olib! 🎉`
        : 'Durrang!';
      // g'olib arqonni oxirigacha tortib, o'z tomoniga uch marta silkitadi — natija oynasi shundan keyin
      let kut = 0;
      if (winner && !rig) {
        endPos = winner === 'red' ? WIN : -WIN;
        paintRig();
        [450, 900, 1350].forEach(ms => setTimeout(() => jerk(winner), ms));
        kut = 1900;
      }
      setTimeout(() => arena.isConnected && root.append(el('div', { class: 'tug-end' },
        el('div', { class: 'tug-end__card' },
          el('h1', {}, headline),
          el('p', { style: 'font-weight:700;color:var(--muted-soft);margin:-4px 0 4px' },
            reachedGoal ? `${goal} ochkoga birinchi yetdi` : `Maqsad: ${goal} ochko · vaqt tugadi`),
          el('div', { class: 'tug-end__scores' },
            el('div', { class: 'tug-end__s tug-end__s--blue' }, names.blue, el('b', {}, fmtScore(state.blue.score)),
              el('small', { class: 'tug-end__detail' }, `✓ ${state.blue.correct} · ✗ ${state.blue.wrong}`)),
            el('div', { class: 'tug-end__s tug-end__s--red' }, names.red, el('b', {}, fmtScore(state.red.score)),
              el('small', { class: 'tug-end__detail' }, `✓ ${state.red.correct} · ✗ ${state.red.wrong}`))),
          el('div', { class: 'result__btns' },
            el('button', { class: 'btn', onclick: play }, el('span', { style: 'width:20px;height:20px', html: ICON.replay }), 'Qayta'),
            el('button', { class: 'btn btn--ink', onclick: config }, 'Chiqish'))))), kut);
    }

    function onKey(e) {
      // to'liq ekranda Esc ni brauzer o'zi oladi (ekrandan chiqadi → onFs); to'liq ekran bo'lmasa — shu yerda to'xtatamiz
      if (e.key === 'Escape') { if (!pauza && !(document.fullscreenElement || document.webkitFullscreenElement)) toxtat(); return; }
      if (pauza) return;
      const map = { '1': ['blue', 0], '2': ['blue', 1], '3': ['blue', 2], '4': ['blue', 3],
                    '7': ['red', 0], '8': ['red', 1], '9': ['red', 2], '0': ['red', 3] };
      const m = map[e.key]; if (!m) return;
      const [team, k] = m;
      const box = team === 'blue' ? bluePanel : redPanel;
      const btn = box.querySelectorAll('.tug-opt')[k];
      if (btn) btn.click();
    }
    document.addEventListener('keydown', onKey);

    const mainEl = el('main', { class: 'tug-main is-starting' },
      bluePanel,
      el('div', { class: 'tug-center' }, timerEl, arena),
      redPanel);
    root.replaceChildren(
      el('div', { class: 'tug-topbar' },
        el('div', { class: 'tug-teamlabel tug-teamlabel--blue' }, el('span', {}, names.blue), scoreBlue),
        el('div', { class: 'tug-topbar__mid' }, el('div', { class: 'brand__name', style: 'color:var(--violet)' }, 'Mathlearn'), fsBtn),
        el('div', { class: 'tug-teamlabel tug-teamlabel--red' }, scoreRed, el('span', {}, names.red))),
      el('div', { class: 'tug-sahna' }, fonKun, fonTun, mainEl));
    paintRig();

    // O'yin boshlanishidan avval 3 soniyalik sanoq — shu vaqtda javob berib bo'lmaydi.
    let n = 3;
    const numEl = el('div', { class: 'tug-countdown__num' }, String(n));
    const cd = el('div', { class: 'tug-countdown' }, numEl);
    root.appendChild(cd);
    const cdTick = setInterval(() => {
      n--;
      if (n > 0) {
        numEl.textContent = String(n);
      } else {
        clearInterval(cdTick);
        cd.remove();
        state.starting = false;
        if (pauza) { kutStart = true; return; }   // sanoq paytida to'xtatilgan — «Davom etish»da boshlanadi
        mainEl.classList.remove('is-starting');
        startTimer();
      }
    }, 1000);
  }

  const fmt = (s) => `${Math.max(0, Math.floor(s / 60))}:${String(Math.max(0, s % 60)).padStart(2, '0')}`;
  config();
}
