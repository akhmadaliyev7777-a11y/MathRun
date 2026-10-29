// Admin panel: «Bugungi ish», sinf bo'yicha kontent jadvali (filtr, qidiruv), mavzu yon oynasi,
// izohlar (Claude uchun eslatmalar) va o'quvchilarning nomsiz test natijalari (Firebase Firestore).

const FILTERS = [
  { id: "all", label: "Hammasi" },
  { id: "no-lecture", label: "Ma'ruzasi yo'q" },
  { id: "no-interactive", label: "Ko'rgazmasi yo'q" },
  { id: "no-test", label: "Testi yo'q" },
  { id: "no-pdf", label: "PDF yo'q" },
  { id: "review", label: "Tekshiruv kutilmoqda" },
  { id: "notes", label: "Izohli" }
];

// 5-sinf boblari: bob boshlanadigan mavzu raqami va nomi (mavzular ro'yxati shu boblarga guruhlanadi)
const CHAPTERS = {
  "5|matematika": [
    [1, "Natural sonlar"], [2, "Sonlar ustida to'rt amal"], [5, "Oddiy kasrlar"], [12, "Uchburchakning yuzi"],
    [15, "Hajm"], [21, "Nisbatlar"], [26, "O'nli kasrlar"], [29, "Me'yor"], [32, "Foizlar"],
    [36, "O'rtacha qiymat"], [38, "Burchaklar"], [42, "Uchburchakning xossalari"], [45, "Parallelogramm, romb va trapetsiya"]
  ],
  "8|algebra": [
    [1, "Algebraik kasrlar va ular ustida amallar"], [11, "Tengsizliklar"], [22, "Kvadrat tenglamalar"], [28, "Ma'lumotlar tahlili"]
  ],
  "8|geometriya": [
    [1, "To'rtburchaklar"], [9, "To'g'ri burchakli uchburchakning tomonlari va burchaklari"], [19, "Koordinatalar usuli. Vektorlar"], [27, "Yuz"], [32, "Aylana"]
  ],
  "9|algebra": [
    [1, "Kvadrat funksiya. Kvadrat tengsizliklar"], [13, "Tenglamalar va tengsizliklar sistemalari"], [17, "Trigonometriya elementlari"], [28, "Sonli ketma-ketliklar. Progressiyalar"], [34, "Ehtimollar va statistika elementlari"]
  ]
};
let FOCUS_GRADE = "5";         // hozir ustida ishlanayotgan sinf («Bugungi ish» shu sinf bo'yicha) — computeFocusGrade() aniqlaydi

let activeGradeId = null;      // 5–11: "5".."11", 1–4: "p1".."p4"
let activeFilter = "all";
let searchText = "";
let topicSort = "num";         // jadval tartibi: num | missing | notes
let activeChorak = 1;          // 1–4 sinflar uchun
let activeUploadTarget = null;
let panelTopic = null;         // yon oynada ochiq mavzu

// Firebase ma'lumotlar bazasi: izohlar va o'quvchilar natijalari
let DB = null;
let dbState = "loading";       // "loading" | "ok" | "off" (baza yoqilmagan yoki ruxsat yo'q)
let NOTES = [];                // { id, src: "izoh" | "xabar", k, title, text, bolim, ism, done, t } — izohlar (admin) va saytdagi xabarlar
let xabarOff = false;          // "xabarlar" to'plamiga ruxsat yo'q (qoidalar yangilanmagan)
const BOLIM_NAMES = { maruza: "Ma'ruza (Nazariya)", interaktiv: "Interaktiv panel", test: "Test" };
/* xabar qaysi bo'limdan yozilgani — rangli belgi */
function bolimChip(n) { return n.src === "xabar" && BOLIM_NAMES[n.bolim] ? '<span class="adm-bolim" data-b="' + n.bolim + '">' + BOLIM_NAMES[n.bolim] + "</span>" : ""; }
let RESULTS = [];              // { k, h, s, n, t }

// 1–4 sinflar ma'lumoti (mathrunner-web bo'limidan yuklanadi)
let PRIMARY = null;            // curriculum.json
let PRIMARY_TITLES = {};       // topicTitles.js — ro'yxatdagi standart nomlar
const GAME_NAMES = {
  set: "To'plamlar", numberOrder: "Tartiblash", placeValue: "Xona tarkibi", balanceScale: "Tarozi",
  symmetry: "Simmetriya", netFold: "Yoyilma", equationGrid: "Jadval", algorithmConveyor: "Saralash",
  fractionStrip: "Ulush", coordinatePath: "Koordinata", motionLine: "Harakat", protractor: "Transportir"
};

const isPrimary = function (id) { return String(id).charAt(0) === "p"; };
const primaryGrade = function (id) { return PRIMARY.grades.find(function (g) { return "p" + g.grade === id; }); };
function primaryTitle(g, c, b) {
  const list = PRIMARY_TITLES["g" + g.grade + "_c" + c.chorak];
  return (list && list[c.blocks.indexOf(b)]) || b.name;
}
function primarySummary(g) {
  let topics = 0, lessons = 0, questions = 0, soon = 0;
  g.choraks.forEach(function (c) {
    c.blocks.forEach(function (b) {
      topics++;
      b.levels.forEach(function (l) {
        lessons++;
        if (l.gameKind === "test") questions += l.count || 0;
        if (!l.webSupported) soon++;
      });
    });
  });
  return { topics: topics, lessons: lessons, questions: questions, soon: soon };
}

// ---------- mavzu holati ----------

function topicStatus(grade, subject, topic) {
  let lecture = { state: "none", text: "—" };
  if (topic.sections && topic.sections.length > 0) {
    const filled = topic.sections.filter(function (s) { return !!s.text; }).length;
    lecture = { state: filled === topic.sections.length ? "ok" : filled > 0 ? "part" : "none", text: filled + "/" + topic.sections.length };
  } else if (topic.lecture && (topic.lecture.text || topic.lecture.embedUrl)) {
    lecture = { state: "ok", text: "bor" };
  }
  const sets = quizSets(grade.id + "|" + subject.id + "|" + topic.id);
  const quizCount = sets.reduce(function (n, x) { return n + x.q.length; }, 0);
  return {
    lecture: lecture,
    interactive: topic.interactive ? { state: "ok", text: "bor" } : { state: "none", text: "yo'q" },
    test: quizCount > 0 ? { state: sets.length === 2 && sets.every(function (x) { return x.q.length >= 20; }) ? "ok" : "part",
        text: sets.length === 2 ? sets[0].q.length + "+" + sets[1].q.length : quizCount + " savol" }
      : topic.test ? { state: "ok", text: "bor" } : { state: "none", text: "yo'q" }
  };
}

function hasOwnQuiz(grade, subject, topic) {
  return quizSets(grade.id + "|" + subject.id + "|" + topic.id).length > 0;
}

function reviewState(topic) {
  if (topic.review === "sariq") return "sariq";
  return topic.review ? "qizil" : null;
}

function matchesFilter(grade, subject, topic, filter) {
  const st = topicStatus(grade, subject, topic);
  if (filter === "no-lecture") return st.lecture.state !== "ok";
  if (filter === "no-interactive") return st.interactive.state !== "ok";
  if (filter === "no-test") return st.test.state === "none";
  if (filter === "review") return !!reviewState(topic);
  if (filter === "no-pdf") return pdfStatus(topic).state === "none";
  if (filter === "notes") return notesCountFor(grade, subject, topic) > 0;
  return true;
}

function escapeHtml(t) {
  return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}

// barcha 5–11 mavzular bir ro'yxatda: { grade, subject, topic, index }
function allTopics() {
  const out = [];
  SITE_DATA.grades.forEach(function (grade) {
    grade.subjects.forEach(function (subject) {
      subject.topics.forEach(function (topic, i) { out.push({ grade: grade, subject: subject, topic: topic, index: i }); });
    });
  });
  return out;
}

function gradeSummary(grade) {
  let topics = 0, interactive = 0, test = 0;
  grade.subjects.forEach(function (subject) {
    subject.topics.forEach(function (topic) {
      const st = topicStatus(grade, subject, topic);
      topics++;
      if (st.interactive.state === "ok") interactive++;
      if (st.test.state !== "none") test++;
    });
  });
  return { topics: topics, interactive: interactive, test: test };
}

// ---------- bosh panel: umumiy yordamchilar ----------

const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const UZ_DAYS = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];                 // getDay(): 0 — yakshanba
const UZ_DAYS_LONG = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
const ICONS = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  dot: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
  left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>'
};

let PDF_LIST = null;           // pdf/royxat.json: null — yuklanmoqda, false — yuklab bo'lmadi
let readyMetric = "lecture";   // tayyorlik grafigi: lecture | test | pdf | interactive
let activityRange = 7;         // natijalar grafigi: 7 kun yoki 28 kun (4 hafta)
let weekOffset = 0;            // «Bugungi ish» kartasidagi hafta: 0 — shu hafta
const showAllNotes = { on: false };

function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function dayStart(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function z2(n) { return (n < 10 ? "0" : "") + n; }

// hozir ustida ishlanayotgan sinf: ma'ruzalari boshlangan, lekin hammasi tayyor bo'lmagan birinchi sinf
function computeFocusGrade() {
  let pick = null, last = null;
  SITE_DATA.grades.forEach(function (g) {
    let t = 0, l = 0;
    g.subjects.forEach(function (s) {
      s.topics.forEach(function (x) { t++; if (hasLectureFile(x)) l++; });
    });
    if (l > 0) last = g.id;
    if (!pick && l > 0 && l < t) pick = g.id;
  });
  return pick || last || (SITE_DATA.grades[0] && SITE_DATA.grades[0].id) || "5";
}

// ma'ruza PDF kaliti — maruza/<kalit>.html (pdf/royxat.json dagi kalit bilan bir xil)
function pdfKeyOf(topic) {
  const u = topic.lecture && topic.lecture.embedUrl;
  const m = u && /^maruza\/([^\/?#]+)\.html/.exec(u);
  return m ? m[1] : null;
}
function topicPdf(topic) {
  const k = pdfKeyOf(topic);
  if (!PDF_LIST || !k) return { lec: false, test: 0 };
  return { lec: !!PDF_LIST[k], test: (PDF_LIST[k + "-1-test"] ? 1 : 0) + (PDF_LIST[k + "-2-test"] ? 1 : 0) };
}
// ma'ruza sahifasi (maruza/*.html) ulangan mavzu
function hasLectureFile(topic) { return !!(topic.lecture && topic.lecture.embedUrl); }
function ownQuizFull(grade, subject, topic) {
  const sets = quizSets(grade.id + "|" + subject.id + "|" + topic.id);
  return sets.length === 2 && sets.every(function (x) { return x.q.length >= 20; });
}

const METRICS = {
  lecture: { label: "Ma'ruza", ok: function (g, s, t) { return hasLectureFile(t); } },
  test: { label: "Test 20+20", ok: function (g, s, t) { return ownQuizFull(g, s, t); } },
  pdf: { label: "PDF", ok: function (g, s, t) { const p = topicPdf(t); return p.lec || p.test > 0; } },
  interactive: { label: "Ko'rgazma", ok: function (g, s, t) { return !!t.interactive; } }
};

// ---------- 4 ta karta (yuqori qator) ----------

function kpiCard(tone, chipIcon, chip, value, label, href, more) {
  return '<div class="adm-kpi adm-kpi--' + tone + '">' +
    '<div class="adm-kpi-top"><span class="adm-chip">' + chipIcon + '<span>' + chip + '</span></span>' +
    (href ? '<a class="adm-kpi-more" href="' + href + '" title="' + more + '" aria-label="' + more + '">' + ICONS.arrow + '</a>' : "") + '</div>' +
    '<div class="adm-kpi-val">' + value + '</div>' +
    '<div class="adm-kpi-label">' + label + '</div></div>';
}

function renderKpis() {
  const all = allTopics();
  let lec = 0, quiz = 0, questions = 0;
  const lecGrades = {};
  all.forEach(function (t) {
    if (hasLectureFile(t.topic)) { lec++; lecGrades[t.grade.id] = 1; }
    if (ownQuizFull(t.grade, t.subject, t.topic)) quiz++;
    quizSets(topicKey(t.grade, t.subject, t.topic)).forEach(function (x) { questions += x.q.length; });
  });
  const lg = Object.keys(lecGrades).map(Number).sort(function (a, b) { return a - b; });
  const gradeSpan = lg.length ? (lg.length > 1 ? lg[0] + "–" + lg[lg.length - 1] : lg[0]) + "-sinf" : "hali yo'q";

  let pdfVal = "…", pdfChip = "yuklanmoqda";
  if (PDF_LIST === false) { pdfVal = "—"; pdfChip = "ro'yxat topilmadi"; }
  else if (PDF_LIST) {
    const keys = Object.keys(PDF_LIST);
    const tests = keys.filter(function (k) { return /-[12]-test$/.test(k); }).length;
    pdfVal = fmtNum(keys.length);
    pdfChip = (keys.length - tests) + " ma'ruza · " + tests + " test";
  }

  let noteVal = "…", noteChip = "yuklanmoqda", noteIcon = ICONS.dot;
  if (dbState === "off") { noteVal = "—"; noteChip = "baza yo\'q"; }
  else if (dbState === "ok") {
    const today = new Date();
    const fresh = NOTES.filter(function (n) { return sameDay(n.t, today); }).length;
    noteVal = openNotes().length;
    if (fresh) { noteChip = "+" + fresh + " bugun"; noteIcon = ICONS.up; } else noteChip = "jami " + NOTES.length;
  }

  document.getElementById("adm-kpis").innerHTML =
    kpiCard("mint", ICONS.check, lec + " / " + all.length, lec, "Tayyor ma'ruza", "#mavzular", "Mavzular jadvali") +
    kpiCard("sage", ICONS.list, fmtNum(questions) + " savol", quiz, "O'z testi 20+20", "#mavzular", "Mavzular jadvali") +
    kpiCard("beige", ICONS.file, pdfChip, pdfVal, "PDF fayl", null, "") +
    kpiCard("pink", noteIcon, noteChip, noteVal, "Ochiq izoh va xabar", "#izohlar", "Izohlar va xabarlar");
  const sub = document.querySelector("#adm-kpis .adm-kpi--mint .adm-kpi-label");
  if (sub) sub.title = "Ma'ruzasi bor sinflar: " + gradeSpan;
}

// ---------- sinflar bo'yicha tayyorlik (oq karta, ustunli grafik) ----------

function selectBox(id, value, options) {
  return '<label class="adm-select"><select id="' + id + '" aria-label="Ko\'rsatkich">' + options.map(function (o) {
    return '<option value="' + o[0] + '"' + (String(o[0]) === String(value) ? " selected" : "") + '>' + o[1] + '</option>';
  }).join("") + '</select>' + ICONS.down + '</label>';
}

function renderReady() {
  const el = document.getElementById("adm-ready");
  const m = METRICS[readyMetric];
  const rows = SITE_DATA.grades.map(function (g) {
    let t = 0, d = 0;
    g.subjects.forEach(function (s) { s.topics.forEach(function (x) { t++; if (m.ok(g, s, x)) d++; }); });
    return { g: g, t: t, d: d, p: t ? Math.round(d / t * 100) : 0 };
  });
  const totT = rows.reduce(function (a, r) { return a + r.t; }, 0);
  const totD = rows.reduce(function (a, r) { return a + r.d; }, 0);
  const waiting = readyMetric === "pdf" && PDF_LIST == null;
  const failed = readyMetric === "pdf" && PDF_LIST === false;

  el.innerHTML =
    '<div class="adm-card-head"><h3>Sinflar bo\'yicha tayyorlik</h3>' +
      selectBox("adm-ready-sel", readyMetric, Object.keys(METRICS).map(function (k) { return [k, METRICS[k].label]; })) + '</div>' +
    '<div class="adm-legend2"><span><i class="adm-ldot adm-ldot--fill"></i>Tayyor</span><span><i class="adm-ldot adm-ldot--track"></i>Qolgan</span>' +
      '<span class="adm-legend2-sum">' + m.label + ': <b>' + totD + '</b> / ' + totT + '</span></div>' +
    (failed ? '<p class="adm-dboff">pdf/royxat.json ni yuklab bo\'lmadi.</p>' :
    '<div class="adm-bars' + (waiting ? " is-wait" : "") + '" style="--n:' + rows.length + '">' + rows.map(function (r) {
      return '<button type="button" class="adm-bcol' + (r.g.id === FOCUS_GRADE ? " is-focus" : "") + '" data-grade="' + r.g.id + '" ' +
        'aria-label="' + r.g.name + ': ' + m.label + ' ' + r.d + ' / ' + r.t + '">' +
        '<span class="adm-bval">' + (waiting ? "…" : r.d) + '</span>' +
        '<span class="adm-btrack" style="--h:' + (waiting ? 0 : r.p) + '%"><span class="adm-bfill"></span>' +
          '<span class="adm-btip"><b>' + r.p + '%</b><small>' + r.d + ' / ' + r.t + '</small></span></span>' +
        '<span class="adm-bx">' + r.g.id + '-sinf</span><span class="adm-bsub">' + r.t + ' ta</span>' +
      '</button>';
    }).join("") + '</div>');

  const sel = document.getElementById("adm-ready-sel");
  sel.addEventListener("change", function () { readyMetric = sel.value; renderReady(); });
  el.querySelectorAll(".adm-bcol").forEach(function (b) {
    b.addEventListener("click", function () { selectGrade(b.dataset.grade); goView("mavzular"); });
  });
}

// ---------- test natijalari faolligi (to'q yashil karta) ----------

function renderActivity() {
  const el = document.getElementById("adm-activity");
  const head = '<div class="adm-card-head"><h3>Test natijalari</h3>' +
    selectBox("adm-act-sel", activityRange, [[7, "7 kun"], [28, "4 hafta"], [180, "6 oy"]]) + '</div>' +
    '<div class="adm-legend2"><span><i class="adm-ldot adm-ldot--a"></i>5–11-sinf</span><span><i class="adm-ldot adm-ldot--b"></i>1–4-sinf</span></div>';

  // guruhlar: 7 kun — har kun, 4 hafta — har 7 kun
  const today = dayStart(new Date());
  const step = activityRange === 7 ? 1 : 7;
  const n = activityRange === 7 ? 7 : 4;
  const buckets = [];
  if (activityRange === 180) {
    // 6 oy — har oy alohida
    for (let i = 5; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      const m = UZ_MONTHS[from.getMonth()];
      buckets.push({ from: from, to: to, a: 0, b: 0, label: m.charAt(0).toUpperCase() + m.slice(1, 3), sub: String(from.getFullYear()) });
    }
  } else for (let i = n - 1; i >= 0; i--) {
    const from = new Date(today); from.setDate(today.getDate() - i * step - (step - 1));
    const to = new Date(from); to.setDate(from.getDate() + step);
    const last = new Date(to); last.setDate(to.getDate() - 1);
    buckets.push({
      from: from, to: to, a: 0, b: 0,
      label: step === 1 ? UZ_DAYS[from.getDay()] : from.getDate() + "–" + last.getDate() + "." + z2(last.getMonth() + 1),
      sub: step === 1 ? from.getDate() + "." + z2(from.getMonth() + 1) : ""
    });
  }

  let body;
  if (dbState !== "ok") {
    body = '<div class="adm-act-empty">' + (dbState === "loading" ? "Natijalar yuklanmoqda…" : "Ma'lumotlar bazasi ulanmagan — natijalar Firebase'dan olinadi.") + '</div>';
  } else {
    let inRange = 0;
    RESULTS.forEach(function (r) {
      if (!r.t) return;
      const bk = buckets.find(function (x) { return r.t >= x.from && r.t < x.to; });
      if (!bk) return;
      inRange++;
      if (String(r.k).split("|")[1] === "boshlangich") bk.b++; else bk.a++;
    });
    const max = Math.max(1, Math.max.apply(null, buckets.map(function (x) { return Math.max(x.a, x.b); })));
    let sumN = 0, sumQ = 0;
    RESULTS.forEach(function (r) { if (r.s && r.s.length) { sumN += r.n; sumQ += r.s.length; } });
    body =
      '<div class="adm-dbars" style="--n:' + buckets.length + '">' + buckets.map(function (x) {
        const tot = x.a + x.b;
        return '<div class="adm-dcol" title="' + x.label + (x.sub ? " " + x.sub : "") + ': 5–11-sinf ' + x.a + ', 1–4-sinf ' + x.b + '">' +
          '<div class="adm-dpair">' +
            '<span class="adm-dbar adm-dbar--a" style="--h:' + Math.round(x.a / max * 100) + '%">' + (x.a ? '<em>' + x.a + '</em>' : "") + '</span>' +
            '<span class="adm-dbar adm-dbar--b" style="--h:' + Math.round(x.b / max * 100) + '%">' + (x.b ? '<em>' + x.b + '</em>' : "") + '</span>' +
          '</div>' +
          '<span class="adm-dx">' + x.label + '</span>' + (x.sub ? '<span class="adm-dsub">' + x.sub + '</span>' : "") +
          (tot ? "" : "") + '</div>';
      }).join("") + '</div>' +
      (inRange ? "" : '<div class="adm-act-note">Bu davrda test yechilmagan.</div>') +
      '<div class="adm-act-foot"><span>Jami <b>' + fmtNum(RESULTS.length) + '</b> marta</span>' +
        '<span>Bu davrda <b>' + inRange + '</b></span>' +
        (sumQ ? '<span>O\'rtacha <b>' + Math.round(sumN / sumQ * 100) + '%</b></span>' : "") + '</div>';
  }
  el.innerHTML = head + body;
  const sel = document.getElementById("adm-act-sel");
  sel.addEventListener("change", function () { activityRange = Number(sel.value); renderActivity(); });
}

// ---------- bugungi ish (o'ng ustun: hafta va rangli qatorlar) ----------

function evRow(tone, left, small, kicker, title, t, extraCls) {
  const attrs = t ? ' data-g="' + t.grade.id + '" data-s="' + t.subject.id + '" data-t="' + t.topic.id + '"' : "";
  const tag = t ? "button" : "div";
  return '<' + tag + (t ? ' type="button"' : "") + ' class="adm-ev adm-ev--' + tone + (extraCls ? " " + extraCls : "") + '"' + attrs + '>' +
    '<span class="adm-ev-left"><b>' + left + '</b>' + (small ? '<small>' + small + '</small>' : "") + '</span>' +
    '<span class="adm-ev-body"><small>' + kicker + '</small><span class="adm-ev-title">' + title + '</span></span></' + tag + '>';
}

function topicRow(tone, kicker, t) {
  const parts = splitTopicTitle(t.topic.title, t.index);
  return evRow(tone, parts.num, t.grade.id + "-sinf", kicker, escapeHtml(parts.title), t);
}

const EV_LIMIT = 2;           // bosh panelda «Bugungi ish»ning har turidan nechta qator ko'rinadi (alohida bo'limda — hammasi)
function moreRow(list, filter, label) {
  if (list.length <= EV_LIMIT) return "";
  return '<button type="button" class="adm-ev-more" data-more-g="' + list[EV_LIMIT].grade.id + '" data-more-f="' + filter + '">' +
    'yana ' + (list.length - EV_LIMIT) + ' ta ' + label + ' → jadvalda</button>';
}

function activityByDay() {
  const map = {};
  const add = function (d, kind) {
    if (!d) return;
    const k = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    map[k] = map[k] || { r: 0, n: 0 };
    map[k][kind]++;
  };
  if (dbState === "ok") {
    RESULTS.forEach(function (r) { add(r.t, "r"); });
    NOTES.forEach(function (x) { add(x.t, "n"); });
  }
  return map;
}

// alohida «Bugungi ish» bo'limida: guruh sarlavhasi + barcha qatorlar
function evGroup(title, count, rows) {
  return '<div class="adm-ev-group"><h4>' + title + (count != null ? ' <span class="adm-count">' + count + '</span>' : "") + '</h4>' +
    '<div class="adm-evs adm-evs--grid">' + rows + '</div></div>';
}

// bugun kelgan izoh/xabarlar va test natijalari (faqat bazadagi haqiqiy yozuvlar)
function todayArrivals() {
  if (dbState === "loading") return '<p class="adm-empty-line">Yuklanmoqda…</p>';
  if (dbState !== "ok") return dbOffText();
  const now = new Date();
  const notes = NOTES.filter(function (n) { return sameDay(n.t, now); });
  const res = RESULTS.filter(function (r) { return sameDay(r.t, now); });
  if (!notes.length && !res.length) return '<p class="adm-empty-line">Bugun hali yangi izoh, xabar yoki test natijasi kelmagan.</p>';
  let rows = "";
  notes.forEach(function (n) {
    const t = topicByKey(n.k);
    const where = t ? t.grade.id + "-sinf · " + escapeHtml(t.topic.title) : escapeHtml(n.title || "");
    const kicker = (n.src === "xabar" ? noteSource(n) : '<span class="adm-src adm-src--izoh">Izoh</span> ') + '<span class="adm-ev-where">' + where + (n.done ? " · bajarilgan" : "") + '</span>';
    rows += evRow(n.src === "xabar" ? "green" : "yellow", z2(n.t.getHours()) + ":" + z2(n.t.getMinutes()), "bugun", kicker, escapeHtml(n.text), t, "adm-ev--note");
  });
  // natijalar — test bo'yicha guruhlab: nechta urinish va o'rtacha foiz
  const byKey = {};
  res.forEach(function (r) { (byKey[r.k] = byKey[r.k] || []).push(r); });
  Object.keys(byKey).sort(function (a, b) { return byKey[b].length - byKey[a].length; }).forEach(function (k) {
    const list = byKey[k];
    let n = 0, q = 0;
    list.forEach(function (r) { if (r.s && r.s.length) { n += r.n; q += r.s.length; } });
    const base = String(k).replace(/\|qiyin$/, "");
    const t = topicByKey(base);
    rows += evRow("dark", list.length + " ta", "urinish", "Test natijasi" + (q ? " · o'rtacha " + Math.round(n / q * 100) + "%" : ""), escapeHtml(resultLabel(k)), t);
  });
  return '<div class="adm-evs adm-evs--grid">' + rows + '</div>';
}

function renderToday() {
  const el = document.getElementById("adm-today");
  const full = currentView === "bugungi";
  const lim = full ? Infinity : EV_LIMIT;
  const all = allTopics();
  const focus = all.filter(function (t) { return t.grade.id === FOCUS_GRADE; });
  const notReady = focus.filter(function (t) { return !hasLectureFile(t.topic); });
  const next = notReady[0];
  const qizil = all.filter(function (t) { return reviewState(t.topic) === "qizil"; });
  const sariq = all.filter(function (t) { return reviewState(t.topic) === "sariq"; });
  const noQuiz = all.filter(function (t) {
    return topicStatus(t.grade, t.subject, t.topic).lecture.state === "ok" && t.topic.lecture && t.topic.lecture.embedUrl &&
      !hasOwnQuiz(t.grade, t.subject, t.topic);
  });

  // hafta qatori (dushanbadan boshlab), faol kunlarda nuqta
  const now = new Date();
  const mon = dayStart(now);
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7) + weekOffset * 7);
  const mid = new Date(mon); mid.setDate(mon.getDate() + 3);
  const act = activityByDay();
  let days = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const a = act[d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()];
    const k = kunlikDay(isoDate(d));
    const tip = [k ? k.ishlar.length + " ta ish" : "", a && a.r ? a.r + " ta natija" : "", a && a.n ? a.n + " ta izoh/xabar" : ""].filter(Boolean).join(", ");
    days += '<button type="button" class="adm-day' + (sameDay(d, now) ? " is-today" : "") + (k ? " has-ish" : "") + '" data-day="' + isoDate(d) + '"' + (tip ? ' title="' + tip + '"' : "") + '>' +
      '<small>' + UZ_DAYS[d.getDay()] + '</small><b>' + d.getDate() + '</b><span class="adm-day-dots"><i' + (k ? ' class="ish"' : "") + '></i><i' + (a ? ' class="on"' : "") + '></i></span></button>';
  }
  const monthName = UZ_MONTHS[mid.getMonth()];

  const nextRow = next
    ? (full ? detailRow : topicRow)("green", "Navbatdagi mavzu · yana " + notReady.length + " ta ma'ruza", next)
    : evRow("green", "✓", "", FOCUS_GRADE + "-sinf", "Barcha ma'ruzalar tayyor", null);
  const row = full ? detailRow : topicRow;
  const qRows = qizil.slice(0, lim).map(function (t) { return row("red", "Tekshirilmagan · ko'rgazmani ko'rib chiqing", t); }).join("");
  const sRows = sariq.slice(0, lim).map(function (t) { return row("yellow", "Tuzatildi · tasdig'ingiz kutilmoqda", t); }).join("");
  const tRows = noQuiz.length
    ? noQuiz.slice(0, lim).map(function (t) { return row("dark", "Ma'ruza bor, o'z testi yo'q", t); }).join("")
    : evRow("dark", "20+20", "", "O'z testi", "Ma'ruzasi bor hamma mavzuda o'z testi bor", null);
  const okRev = evRow("yellow", "✓", "", "Tekshiruv", "Hamma ko'rgazmalar tasdiqlangan", null);

  let body;
  if (full) {
    body =
      evGroup("Navbatdagi mavzu", null, nextRow) +
      (qizil.length ? evGroup("Tekshirilmagan", qizil.length, qRows) : "") +
      (sariq.length ? evGroup("Tasdiq kutilmoqda", sariq.length, sRows) : "") +
      (!qizil.length && !sariq.length ? evGroup("Tekshiruv", null, okRev) : "") +
      evGroup("O'z testi yo'q", noQuiz.length, tRows) +
      '<div class="adm-ev-group"><h4>Bugun kelganlar</h4>' + todayArrivals() + '</div>';
  } else {
    body = '<div class="adm-evs">' + nextRow +
      qRows + moreRow(qizil, "review", "tekshirilmagan") +
      sRows + moreRow(sariq, "review", "tasdiq kutayotgan") +
      tRows + moreRow(noQuiz, "no-test", "testsiz") +
      (!qizil.length && !sariq.length ? okRev : "") + '</div>';
  }

  el.innerHTML =
    '<div class="adm-cal-head">' +
      '<button type="button" class="adm-cal-btn" id="adm-wk-prev" aria-label="Oldingi hafta">' + ICONS.left + '</button>' +
      '<h3>' + monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + mid.getFullYear() + '</h3>' +
      '<button type="button" class="adm-cal-btn" id="adm-wk-next" aria-label="Keyingi hafta">' + ICONS.right + '</button>' +
    '</div>' +
    '<div class="adm-week">' + days + '</div>' +
    '<div class="adm-today-label"><b>Bugungi ish</b><span>' + now.getDate() + '-' + UZ_MONTHS[now.getMonth()] + ', ' + UZ_DAYS_LONG[now.getDay()] + '</span></div>' +
    body;

  el.querySelectorAll(".adm-day[data-day]").forEach(function (b) {
    b.addEventListener("click", function () { openDayPanel(b.dataset.day); });
  });
  document.getElementById("adm-wk-prev").addEventListener("click", function () { weekOffset--; renderToday(); });
  document.getElementById("adm-wk-next").addEventListener("click", function () { weekOffset++; renderToday(); });
  wireEventRows(el);
  wireOpenButtons(el);
  el.querySelectorAll(".adm-ev-more").forEach(function (b) {
    b.addEventListener("click", function () {
      selectGrade(b.dataset.moreG, b.dataset.moreF);
      goView("mavzular");
    });
  });
  setNavCount("today", qizil.length + sariq.length + noQuiz.length + (next ? 1 : 0));
}

function wireEventRows(root) {
  root.querySelectorAll("button.adm-ev[data-t]").forEach(function (b) {
    b.addEventListener("click", function () { openTopicPanel(b.dataset.g, b.dataset.s, b.dataset.t); });
  });
}

function setNavCount(key, n) {
  const el = document.getElementById("adm-nav-n-" + key);
  if (el) el.textContent = n ? n : "";
}

// ---------- hammasi birga (eski nomi saqlangan: renderStats) ----------

function renderStats() {
  renderKpis();
  renderReady();
  renderActivity();
  renderToday();
  renderNotesCard();
  renderTotals();
  renderDetails();
}

function renderTotals() {
  let topics = 0, interactive = 0, test = 0;
  SITE_DATA.grades.forEach(function (g) {
    const s = gradeSummary(g);
    topics += s.topics; interactive += s.interactive; test += s.test;
  });
  let line = '5–11 sinf: <b>' + topics + '</b> mavzu · <b>' + interactive + '</b> ko\'rgazma · <b>' + test + '</b> test';
  if (PRIMARY) {
    let t = 0, l = 0, q = 0;
    PRIMARY.grades.forEach(function (g) { const s = primarySummary(g); t += s.topics; l += s.lessons; q += s.questions; });
    line += ' <span class="adm-sep">|</span> 1–4 sinf: <b>' + t + '</b> mavzu · <b>' + l + '</b> dars · <b>' + q + '</b> test savoli';
  }
  if (dbState === "ok" && !usersOff) {
    const c = userCounts();
    line += ' <span class="adm-sep">|</span> <b>' + c.all + '</b> foydalanuvchi: <b>' + c.oquvchi + '</b> o\'quvchi · <b>' + c.ustoz + '</b> ustoz';
  }
  document.getElementById("adm-totals").innerHTML = line;
  setNavCount("results", dbState === "ok" ? RESULTS.length : 0);
  setNavCount("users", dbState === "ok" && !usersOff ? USERS.length : 0);
}

// ---------- sinflar ro'yxati (jadval tepasida) ----------

function selectGrade(id, filter) {
  activeGradeId = id;
  activeFilter = filter || "all";
  searchText = "";
  document.getElementById("adm-search").value = "";
  renderGradeList();
  renderFilter();
  renderTopics();
}

function primaryGradeButtons() {
  if (!PRIMARY) return '<div class="adm-side-loading muted">1–4 sinf yuklanmoqda…</div>';
  return PRIMARY.grades.map(function (g) {
    const s = primarySummary(g);
    const pct = s.lessons ? Math.round((s.lessons - s.soon) / s.lessons * 100) : 0;
    const id = "p" + g.grade;
    return (
      '<button type="button" class="adm-grade adm-grade--primary' + (id === activeGradeId ? " active" : "") + '" data-grade="' + id + '" role="tab" aria-selected="' + (id === activeGradeId) + '">' +
        '<span class="adm-grade-num">' + g.grade + '</span>' +
        '<span class="adm-grade-body">' +
          '<span class="adm-grade-name">' + g.grade + '-sinf</span>' +
          '<span class="adm-grade-meta">' + s.topics + ' mavzu · ' + pct + '%</span>' +
          '<span class="adm-bar"><i style="width:' + pct + '%"></i></span>' +
        '</span>' +
      '</button>'
    );
  }).join("");
}

function renderGradeList() {
  const el = document.getElementById("adm-grade-list");
  el.innerHTML =
    '<div class="adm-group-label">1–4</div>' + primaryGradeButtons() +
    '<div class="adm-group-label">5–11</div>' +
    SITE_DATA.grades.map(function (grade) {
    const s = gradeSummary(grade);
    const pct = s.topics ? Math.round((s.interactive + s.test) / (s.topics * 2) * 100) : 0;
    return (
      '<button type="button" class="adm-grade' + (grade.id === activeGradeId ? " active" : "") + '" data-grade="' + grade.id + '" role="tab" aria-selected="' + (grade.id === activeGradeId) + '">' +
        '<span class="adm-grade-num">' + grade.id + '</span>' +
        '<span class="adm-grade-body">' +
          '<span class="adm-grade-name">' + grade.name + '</span>' +
          '<span class="adm-grade-meta">' + s.topics + ' mavzu · ' + pct + '%</span>' +
          '<span class="adm-bar"><i style="width:' + pct + '%"></i></span>' +
        '</span>' +
      '</button>'
    );
  }).join("");

  el.querySelectorAll(".adm-grade").forEach(function (btn) {
    btn.addEventListener("click", function () { selectGrade(btn.dataset.grade); });
  });
  const act = el.querySelector(".adm-grade.active");
  if (act && el.scrollWidth > el.clientWidth) el.scrollLeft = Math.max(0, act.offsetLeft - el.offsetLeft - 40);
}

// ---------- yuqoridagi qidiruv, menyu, chiqish ----------

function wireGlobalSearch() {
  const input = document.getElementById("adm-gsearch");
  const list = document.getElementById("adm-gsearch-list");
  let found = [];
  const norm = function (s) { return String(s).toLowerCase().replace(/[‘’ʻʼ`]/g, "'"); };
  function hide() { list.hidden = true; }
  function show() {
    const q = norm(input.value.trim());
    if (!q) { hide(); return; }
    found = allTopics().filter(function (t) { return norm(t.topic.title).indexOf(q) !== -1; }).slice(0, 8);
    list.innerHTML = found.length ? found.map(function (t, i) {
      const parts = splitTopicTitle(t.topic.title, t.index);
      return '<li><button type="button" data-i="' + i + '"><small>' + t.grade.id + '-sinf · ' + parts.num + '</small><span>' + escapeHtml(parts.title) + '</span></button></li>';
    }).join("") : '<li class="adm-gsearch-none">Mos mavzu topilmadi</li>';
    list.hidden = false;
    list.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("mousedown", function (e) { e.preventDefault(); });
      b.addEventListener("click", function () { pick(found[Number(b.dataset.i)]); });
    });
  }
  function pick(t) {
    if (!t) return;
    hide(); input.blur();
    openTopicPanel(t.grade.id, t.subject.id, t.topic.id);
  }
  input.addEventListener("input", show);
  input.addEventListener("focus", show);
  input.addEventListener("blur", function () { setTimeout(hide, 120); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); pick(found[0]); }
    if (e.key === "Escape") { hide(); input.blur(); }
  });
}

// ---------- bo'limlar: chap menyu har birini alohida ko'rsatadi (manzil: #bugungi, #mavzular, …) ----------

const VIEWS = {
  bosh: "Bosh panel", bugungi: "Bugungi ish", kunlik: "Kunlik ish", mavzular: "Mavzular",
  izohlar: "Izohlar va xabarlar", natijalar: "Natijalar", foydalanuvchilar: "Foydalanuvchilar"
};
let currentView = "bosh";

function viewFromHash() {
  const h = decodeURIComponent((location.hash || "").replace(/^#/, ""));
  return VIEWS[h] ? h : "bosh";
}

function goView(v) {
  if (!VIEWS[v]) v = "bosh";
  if (viewFromHash() === v && location.hash) { applyView(); return; }
  location.hash = v;            // hashchange → applyView (orqaga tugmasi ham ishlaydi)
}

function applyView() {
  const v = viewFromHash();
  const changed = v !== currentView;
  currentView = v;
  document.body.setAttribute("data-view", v);
  document.querySelectorAll("[data-views]").forEach(function (el) {
    el.hidden = el.getAttribute("data-views").split(" ").indexOf(v) === -1;
  });
  // bo'sh qolgan ustun va bo'limlar yashiriladi
  document.querySelectorAll(".adm-dash-col").forEach(function (col) {
    col.hidden = !Array.prototype.some.call(col.children, function (c) { return !c.hidden; });
  });
  const dash = document.getElementById("adm-dash");
  dash.hidden = !Array.prototype.some.call(dash.querySelectorAll("[data-views]"), function (c) { return !c.hidden; });
  const title = document.getElementById("adm-view-title");
  title.hidden = v === "bosh";
  title.textContent = VIEWS[v];
  document.title = (v === "bosh" ? "Admin panel" : VIEWS[v] + " · Admin") + " — Mathlearn";
  document.querySelectorAll(".adm-nav-item[data-view]").forEach(function (a) {
    const on = a.dataset.view === v;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  const act = document.querySelector(".adm-nav-item.active");
  const nav = document.getElementById("adm-nav");
  if (act && nav.scrollWidth > nav.clientWidth + 4) nav.scrollTo({ left: Math.max(0, act.offsetLeft - 16), behavior: "smooth" });
  // to'liq ko'rinishi farq qiladigan qismlar qayta chiziladi
  renderStats();
  if (changed) window.scrollTo(0, 0);
}

function wireNav() {
  window.addEventListener("hashchange", applyView);
  applyView();
}

function wireTopBar() {
  if (typeof initThemeToggle === "function") initThemeToggle();
  try {
    const u = firebase.auth().currentUser;
    if (u) {
      const name = u.displayName || (u.email || "Admin").split("@")[0];
      document.getElementById("adm-me-name").textContent = name;
      document.getElementById("adm-me-ava").textContent = name.trim().charAt(0).toUpperCase() || "A";
    }
  } catch (e) {}
  document.getElementById("adm-logout").addEventListener("click", function () {
    const go = function () { window.location.href = "index.html"; };
    try { firebase.auth().signOut().then(go, go); } catch (e) { go(); }
  });
  wireGlobalSearch();
  wireNav();
}

function loadPdfList() {
  if (!window.fetch) { PDF_LIST = false; return; }
  fetch("pdf/royxat.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw r; return r.json(); })
    .then(function (j) { PDF_LIST = j || {}; })
    .catch(function () { PDF_LIST = false; })
    .then(function () { renderKpis(); renderReady(); renderDetails(); renderFilter(); renderTopics(); });
}

// ---------- mavzular (o'ng tomonda) ----------

function pill(kind, st) {
  return '<span class="adm-pill adm-pill--' + st.state + '"><i class="adm-dot adm-dot--' + st.state + '"></i>' + kind + ': ' + st.text + '</span>';
}

function renderFilter() {
  const el = document.getElementById("adm-filter");
  if (isPrimary(activeGradeId)) {
    el.innerHTML = ["I", "II", "III", "IV"].map(function (r, i) {
      return '<button type="button" class="adm-filter-btn' + (i + 1 === activeChorak ? " active" : "") + '" data-chorak="' + (i + 1) + '">' + r + ' chorak</button>';
    }).join("");
    el.querySelectorAll(".adm-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeChorak = Number(btn.dataset.chorak);
        renderFilter();
        renderTopics();
      });
    });
    return;
  }
  const grade = findGrade(activeGradeId);
  el.innerHTML = FILTERS.map(function (f) {
    let n = 0;
    grade.subjects.forEach(function (subject) {
      subject.topics.forEach(function (topic) { if (matchesFilter(grade, subject, topic, f.id)) n++; });
    });
    if ((f.id === "review" || f.id === "notes") && !n) return "";
    return '<button type="button" class="adm-filter-btn' + (f.id === activeFilter ? " active" : "") + '" data-filter="' + f.id + '">' +
      f.label + ' <span class="adm-filter-n">' + n + '</span></button>';
  }).join("");
  el.querySelectorAll(".adm-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeFilter = btn.dataset.filter;
      renderFilter();
      renderTopics();
    });
  });
}

function renderPrimaryTopics() {
  const g = primaryGrade(activeGradeId);
  const c = g.choraks.find(function (x) { return x.chorak === activeChorak; }) || g.choraks[0];
  const s = primarySummary(g);
  document.getElementById("adm-search").hidden = true;
  document.getElementById("adm-main-title").textContent = g.grade + "-sinf · " + c.roman + " chorak";
  document.getElementById("adm-progress").innerHTML =
    "Butun sinf: " + s.topics + " mavzu · " + s.lessons + " dars · " + s.questions + " ta test savoli" + (s.soon ? " · " + s.soon + " dars tez orada" : "");
  document.getElementById("adm-legend-hint").innerHTML = "· Savollar faylini almashtirish uchun <b>Yuklash</b> tugmasini bosing";

  const rows = c.blocks.map(function (b) {
    const tests = b.levels.filter(function (l) { return l.gameKind === "test"; });
    const games = b.levels.filter(function (l) { return l.gameKind !== "test"; });
    const soon = b.levels.filter(function (l) { return !l.webSupported; }).length;
    const q = tests.reduce(function (sum, l) { return sum + (l.count || 0); }, 0);
    const first = b.levels.find(function (l) { return l.webSupported; });
    const pills =
      pill("Darslar", { state: "ok", text: b.levels.length }) +
      pill("Test", tests.length ? { state: "ok", text: q + " savol" } : { state: "none", text: "yo'q" }) +
      (games.length ? pill("O'yin", { state: "ok", text: games.map(function (l) { return GAME_NAMES[l.gameKind] || l.gameKind; }).join(", ") }) : "") +
      (soon ? pill("Tez orada", { state: "part", text: soon + " dars" }) : "");
    return (
      '<li class="adm-row">' +
        '<span class="adm-row-num">' + b.blok + '.</span>' +
        '<span class="adm-row-body">' +
          (first
            ? '<a class="adm-row-title" href="mathrunner-web/index.html#/' + (first.gameKind === "test" ? "test/" : "play/") + first.id + '" target="_blank" rel="noopener">' + primaryTitle(g, c, b) + '</a>'
            : '<span class="adm-row-title">' + primaryTitle(g, c, b) + '</span>') +
          '<span class="adm-row-pills">' + pills + '</span>' +
        '</span>' +
        '<button type="button" class="adm-upload-btn" data-blok="' + b.blok + '">⬆ Yuklash</button>' +
      '</li>'
    );
  }).join("");

  const el = document.getElementById("adm-topics");
  el.innerHTML = '<div class="adm-subject"><ol class="adm-list">' + rows + '</ol></div>';
  el.querySelectorAll(".adm-upload-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const b = c.blocks.find(function (x) { return x.blok === Number(btn.dataset.blok); });
      openPrimaryUpload(g, c, b, 0);
    });
  });
}

function cell(st, label) {
  const short = /savol/.test(st.text) ? parseInt(st.text, 10) : /^\d+\+\d+$/.test(st.text) ? st.text : st.state === "ok" ? "✓" : st.text;
  if (st.state === "ok") return '<span class="adm-cell adm-cell--ok" title="' + label + ': ' + st.text + '">' + short + '</span>';
  if (st.state === "part") return '<span class="adm-cell adm-cell--part" title="' + label + ': ' + st.text + '">' + short + '</span>';
  return '<span class="adm-cell adm-cell--none" title="' + label + ': yo\'q">—</span>';
}

function topicNumber(title) {
  const m = /^(\d+)/.exec(title);
  return m ? Number(m[1]) : null;
}

// mavzularni guruhlash: 5-sinfda boblar bo'yicha, boshqalarda fan bo'yicha
function topicGroups(grade) {
  const groups = [];
  grade.subjects.forEach(function (subject) {
    const chapters = CHAPTERS[grade.id + "|" + subject.id];
    const prefix = grade.subjects.length > 1 ? subject.name : "";
    if (!chapters) {
      groups.push({ name: prefix || "Mavzular", subject: subject, items: subject.topics.map(function (t, i) { return { topic: t, index: i }; }) });
      return;
    }
    chapters.forEach(function (c, ci) {
      groups.push({ name: (ci + 1) + "-bob. " + c[1], from: c[0], to: chapters[ci + 1] ? chapters[ci + 1][0] - 1 : Infinity, subject: subject, items: [] });
    });
    subject.topics.forEach(function (t, i) {
      const n = topicNumber(t.title);
      const g = groups.find(function (x) { return x.subject === subject && x.from != null && n >= x.from && n <= x.to; });
      if (g) g.items.push({ topic: t, index: i });
      else groups.push({ name: subject.name, subject: subject, items: [{ topic: t, index: i }] });
    });
  });
  return groups;
}

function renderTopics() {
  if (isPrimary(activeGradeId)) { document.getElementById("adm-sort").parentNode.hidden = true; return renderPrimaryTopics(); }
  document.getElementById("adm-sort").parentNode.hidden = false;
  document.getElementById("adm-legend-hint").innerHTML = "· Batafsil ko'rish uchun mavzuni bosing";
  document.getElementById("adm-search").hidden = false;
  const grade = findGrade(activeGradeId);
  const s = gradeSummary(grade);
  document.getElementById("adm-main-title").textContent = grade.name;
  document.getElementById("adm-progress").innerHTML =
    s.topics + " mavzu · " + s.interactive + " ta ko'rgazma · " + s.test + " ta test";

  const q = searchText.trim().toLowerCase();
  const el = document.getElementById("adm-topics");
  let shown = 0;
  const head = '<thead><tr><th>№</th><th>Mavzu</th><th>Ma\'ruza</th><th>Ko\'rgazma</th><th>Test</th><th>PDF</th><th>Izoh</th></tr></thead>';
  const rowHtml = function (subject, it) {
    const topic = it.topic;
    const st = topicStatus(grade, subject, topic);
    const parts = splitTopicTitle(topic.title, it.index);
    const r = reviewState(topic);
    const nc = notesCountFor(grade, subject, topic);
    return (
      '<tr class="adm-tr" tabindex="0" data-s="' + subject.id + '" data-t="' + topic.id + '">' +
        '<td class="adm-td-num">' + parts.num + '</td>' +
        '<td class="adm-td-title">' + escapeHtml(parts.title) +
          (r ? ' <span class="adm-rev adm-rev--' + r + '" title="' + (r === "qizil" ? "Tekshirilmagan" : "Tasdiq kutilmoqda") + '"></span>' : "") + '</td>' +
        '<td>' + cell(st.lecture, "Ma'ruza") + '</td>' +
        '<td>' + cell(st.interactive, "Ko'rgazma") + '</td>' +
        '<td>' + cell(st.test, "Test") + '</td>' +
        '<td>' + pdfCell(topic) + '</td>' +
        '<td>' + (nc ? '<span class="adm-cell adm-cell--note" title="Ochiq izoh va xabarlar">' + nc + '</span>' : '<span class="adm-cell adm-cell--none">—</span>') + '</td>' +
      '</tr>'
    );
  };
  const visible = function (subject, topic) {
    if (!matchesFilter(grade, subject, topic, activeFilter)) return false;
    if (q && topic.title.toLowerCase().indexOf(q) === -1) return false;
    return true;
  };

  if (topicSort === "num") {
    el.innerHTML = topicGroups(grade).map(function (g) {
      let done = 0;
      const rows = g.items.map(function (it) {
        if (topicStatus(grade, g.subject, it.topic).lecture.state === "ok") done++;
        if (!visible(g.subject, it.topic)) return "";
        shown++;
        return rowHtml(g.subject, it);
      }).join("");
      if (!rows) return "";
      return (
        '<details class="adm-group" open>' +
          '<summary><span>' + escapeHtml(g.name) + '</span><span class="adm-group-meta">ma\'ruza ' + done + '/' + g.items.length + '</span></summary>' +
          '<table class="adm-table">' + head + '<tbody>' + rows + '</tbody></table>' +
        '</details>'
      );
    }).join("");
  } else {
    // saralangan ro'yxat — boblarsiz, bitta jadvalda
    const items = [];
    grade.subjects.forEach(function (subject) {
      subject.topics.forEach(function (topic, i) { if (visible(subject, topic)) items.push({ subject: subject, topic: topic, index: i }); });
    });
    const key = topicSort === "missing"
      ? function (x) { return missingScore(grade, x.subject, x.topic); }
      : function (x) { return notesCountFor(grade, x.subject, x.topic); };
    items.sort(function (a, b) { return key(b) - key(a); });
    shown = items.length;
    el.innerHTML = items.length
      ? '<details class="adm-group" open><summary><span>' + (topicSort === "missing" ? "Kami ko'p mavzular avval" : "Izohi ko'p mavzular avval") +
          '</span><span class="adm-group-meta">' + items.length + ' ta</span></summary>' +
        '<table class="adm-table">' + head + '<tbody>' + items.map(function (x) { return rowHtml(x.subject, x); }).join("") + '</tbody></table></details>'
      : "";
  }

  if (!shown) el.innerHTML = '<div class="adm-empty">' + (q ? "Qidiruvga mos mavzu topilmadi." : "🎉 Bu sinfda filtrga mos mavzu yo'q — hammasi tayyor.") + '</div>';

  el.querySelectorAll(".adm-tr").forEach(function (tr) {
    function open() { openTopicPanel(grade.id, tr.dataset.s, tr.dataset.t); }
    tr.addEventListener("click", open);
    tr.addEventListener("keydown", function (e) { if (e.key === "Enter") open(); });
  });
}

// ---------- mavzu yon oynasi ----------

function panelLink(href, label, icon) {
  if (!href) return '<span class="adm-plink adm-plink--off">' + icon + ' ' + label + ' <small>yo\'q</small></span>';
  return '<a class="adm-plink" href="' + href + '" target="_blank" rel="noopener">' + icon + ' ' + label + ' ↗</a>';
}

function openTopicPanel(gradeId, subjectId, topicId) {
  const grade = findGrade(gradeId);
  const subject = findSubject(grade, subjectId);
  const topic = findTopic(subject, topicId);
  if (!topic) return;
  const st = topicStatus(grade, subject, topic);
  const qsets = quizSets(grade.id + "|" + subject.id + "|" + topic.id);
  const quiz = qsets.length ? qsets[0].q : [];
  const r = reviewState(topic);
  const lectureUrl = topic.lecture && topic.lecture.embedUrl;

  const statusRow = function (label, s) {
    return '<div class="adm-pstat"><span>' + label + '</span>' + cell(s, label) + '<span class="muted">' + (s.state === "ok" ? s.text : s.state === "part" ? s.text : "yo'q") + '</span></div>';
  };

  const oneQuiz = function (list) { return '<ol class="adm-quiz">' + list.map(function (qq) {
        return '<li><div class="adm-q">' + escapeHtml(qq.question) + '</div>' +
          '<div class="adm-opts">' + (qq.options || []).map(function (o) {
            return '<span class="adm-opt' + (String(o) === String(qq.answer) ? " adm-opt--ok" : "") + '">' + escapeHtml(o) + '</span>';
          }).join("") + '</div>' +
          (qq.explain ? '<div class="adm-explain">' + escapeHtml(qq.explain).replace(/&lt;(\/?)(b|br)&gt;/g, "<$1$2>") + '</div>' : "") + '</li>';
      }).join("") + '</ol>'; };
  const quizHtml = qsets.length
    ? qsets.map(function (x) {
        return '<div class="adm-quiz-set">' + (x.tur === "qiyin" ? "2-test · qiyinroq" : "1-test · oson") + ' — ' + x.q.length + ' savol' +
          (x.q.length < 20 ? ' <span class="adm-warn">(yangi formatda 20 ta bo\'lishi kerak)</span>' : "") + '</div>' + oneQuiz(x.q);
      }).join("") + (qsets.length < 2 ? '<p class="muted adm-small">2-test (qiyinroq, 20 savol) hali yo\'q.</p>' : "")
    : '<p class="muted">Bu mavzuning o\'z testi hali yo\'q' + (topic.test ? " (umumiy test ulangan)." : ".") + '</p>';

  document.getElementById("adm-panel-kicker").textContent = grade.name + " · " + subject.name;
  document.getElementById("adm-panel-title").textContent = topic.title;
  document.getElementById("adm-panel-body").innerHTML =
    (r ? '<div class="adm-pnote adm-pnote--' + r + '">' + (r === "qizil"
        ? "🔴 Ko'rgazma hali tekshirilmagan yoki kamchiligi bor. Ko'rib chiqing va Claude'ga «tayyor» yoki kamchilikni ayting."
        : "🟡 Sinab ko'rildi va tuzatildi — sizning tasdig'ingiz kutilmoqda. Ko'rib chiqib, Claude'ga «tayyor» deng.") + '</div>' : "") +
    '<div class="adm-plinks">' +
      panelLink(topicHref(grade.id, subject.id, topic.id), "Mavzu sahifasi", "📄") +
      panelLink(lectureUrl, "Ma'ruza", "📘") +
      panelLink(topic.interactive, "Ko'rgazma", "🧩") +
      panelLink(topic.test, "Test", "✅") +
    '</div>' +
    '<div class="adm-psec" id="adm-pnotes"></div>' +
    '<div class="adm-psec" id="adm-presults"' + (quiz.length ? "" : " hidden") + '></div>' +
    '<div class="adm-psec"><h4>Holati</h4>' + statusRow("Ma'ruza", st.lecture) + statusRow("Ko'rgazma", st.interactive) + statusRow("Test", st.test) + '</div>' +
    (topic.simPlan ? '<details class="adm-psec"><summary><h4>Ko\'rgazma rejasi</h4></summary><p class="adm-ptext">' + escapeHtml(topic.simPlan) + '</p></details>' : "") +
    '<details class="adm-psec"' + (quiz.length ? "" : " open") + '><summary><h4>Test savollari' + (qsets.length ? " (" + qsets.map(function (x) { return x.q.length; }).join(" + ") + ")" : "") + '</h4></summary>' + quizHtml + '</details>';
  panelTopic = { grade: grade, subject: subject, topic: topic };
  renderPanelNotes();
  renderPanelResults();
  const panel = document.getElementById("adm-panel");
  panel.hidden = false;
  panel.querySelector(".adm-panel-box").scrollTop = 0;
  document.body.classList.add("adm-noscroll");
}

function closeTopicPanel() {
  document.getElementById("adm-panel").hidden = true;
  document.body.classList.remove("adm-noscroll");
}

// ---------- yuklash oynasi ----------

// 1–4 sinf: dars tanlanadi, savollar (yoki o'yin topshiriqlari) fayli almashtiriladi
function openPrimaryUpload(g, c, b, idx) {
  const lv = b.levels[idx];
  const file = lv.bank.split("/").pop();
  activeUploadTarget = { primary: true, g: g, c: c, b: b, lv: lv, file: file };

  document.getElementById("adm-modal-kicker").textContent = g.grade + "-sinf · " + c.roman + " chorak · " + b.blok + "-mavzu";
  document.getElementById("adm-modal-title").textContent = primaryTitle(g, c, b);

  const tabs = document.getElementById("adm-type-tabs");
  tabs.innerHTML = b.levels.map(function (l, i) {
    const kind = l.gameKind === "test" ? "Test" : (GAME_NAMES[l.gameKind] || "O'yin");
    return '<button type="button" class="adm-type-tab' + (i === idx ? " active" : "") + '" data-i="' + i + '">' + (i + 1) + '-dars <span class="adm-tab-sub">' + kind + '</span></button>';
  }).join("");
  tabs.querySelectorAll(".adm-type-tab").forEach(function (t) {
    t.addEventListener("click", function () { openPrimaryUpload(g, c, b, Number(t.dataset.i)); });
  });

  document.getElementById("adm-drop-hint").textContent =
    (lv.gameKind === "test" ? "Test savollari" : "O'yin topshiriqlari") + " (.json) → mathrunner-web/data/banks/ papkasiga";
  document.getElementById("adm-file").value = "";
  const res = document.getElementById("adm-result");
  res.hidden = false;
  res.innerHTML =
    '<div class="adm-current">Hozirgi fayl: <code>' + file + '</code>' +
    (lv.gameKind === "test" ? ' · ' + (lv.count || 0) + ' ta savol' : '') +
    ' · <a href="mathrunner-web/data/' + lv.bank + '" target="_blank" rel="noopener">ochib ko\'rish</a></div>';
  document.getElementById("adm-modal").hidden = false;
}

function closeUpload() {
  activeUploadTarget = null;
  document.getElementById("adm-modal").hidden = true;
}

function showPrimaryUploadResult(file) {
  const t = activeUploadTarget;
  const res = document.getElementById("adm-result");
  const isTest = t.lv.gameKind === "test";
  const example = '[ { "id": "...", "question": "3 + 1 = ?", "correctAnswer": 4, "wrongAnswers": [3, 5] } ]';
  res.hidden = false;
  res.innerHTML =
    '<div class="adm-file">📎 ' + file.name + ' <span class="muted">· ' + Math.max(1, Math.round(file.size / 1024)) + ' KB</span></div>' +
    '<ol class="adm-steps">' +
      '<li>Faylni <code>' + t.file + '</code> deb nomlang.</li>' +
      '<li>Uni <code>mathrunner-web/data/banks/</code> papkasiga qo\'yib, eski faylni almashtiring.</li>' +
      (isTest ? '<li>Fayl tuzilishi:</li>' : '<li>Fayl tuzilishi hozirgi fayl bilan bir xil bo\'lsin — yuqoridagi <b>ochib ko\'rish</b> havolasidan namunaga qarang.</li>') +
    '</ol>' +
    (isTest ? '<div class="adm-code"><code>' + example + '</code></div>' : '') +
    '<p class="adm-note">Savollar soni o\'zgarsa ham sayt o\'zi moslashadi. Misollar (3 + 1 = ?, 1/2, □) saytda avtomatik formula bo\'lib chiqadi.</p>';
}

function showUploadResult(file) {
  if (!file || !activeUploadTarget) return;
  showPrimaryUploadResult(file);
}

function wireUpload() {
  document.getElementById("adm-modal-close").addEventListener("click", closeUpload);
  document.getElementById("adm-modal").addEventListener("click", function (e) { if (e.target.id === "adm-modal") closeUpload(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!document.getElementById("adm-modal").hidden) closeUpload(); else closeTopicPanel();
  });
  document.getElementById("adm-panel-close").addEventListener("click", closeTopicPanel);
  document.getElementById("adm-panel").addEventListener("click", function (e) { if (e.target.id === "adm-panel") closeTopicPanel(); });
  document.getElementById("adm-search").addEventListener("input", function (e) { searchText = e.target.value; renderTopics(); });
  document.getElementById("adm-sort").addEventListener("change", function (e) { topicSort = e.target.value; renderTopics(); });
  document.getElementById("adm-file").addEventListener("change", function (e) { showUploadResult(e.target.files[0]); });

  const drop = document.getElementById("adm-drop");
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); });
  });
  drop.addEventListener("drop", function (e) { showUploadResult(e.dataTransfer.files[0]); });
}

function renderAdminDashboard() {
  FOCUS_GRADE = computeFocusGrade();
  activeGradeId = FOCUS_GRADE;
  wireTopBar();
  renderStats();
  renderGradeList();
  renderFilter();
  renderTopics();
  renderResultsSection();
  renderUsersSection();
  renderKunlik();
  wireUpload();
  loadPdfList();
  initDatabase();

  // 1–4 sinflar ma'lumotini yuklab, ro'yxat va statistikani yangilash
  Promise.all([
    fetch("mathrunner-web/data/curriculum.json").then(function (r) { return r.json(); }),
    import("../mathrunner-web/js/topicTitles.js").then(function (m) { return m.TOPIC_TITLES; }).catch(function () { return {}; })
  ]).then(function (res) {
    PRIMARY = res[0];
    PRIMARY_TITLES = res[1];
    renderStats();
    renderGradeList();
    renderUsersSection();
    ensurePrimaryBanks();
  }).catch(function () {
    document.querySelector(".adm-side-loading") && (document.querySelector(".adm-side-loading").textContent = "1–4 sinf ma'lumotini yuklab bo'lmadi");
  });
}

// ---------- ma'lumotlar bazasi (izohlar, natijalar) ----------

function topicKey(grade, subject, topic) { return grade.id + "|" + subject.id + "|" + topic.id; }

function topicByKey(k) {
  const p = String(k).split("|");
  const grade = findGrade(p[0]);
  const subject = grade && findSubject(grade, p[1]);
  const topic = subject && findTopic(subject, p[2]);
  return topic ? { grade: grade, subject: subject, topic: topic, index: subject.topics.indexOf(topic) } : null;
}

function fmtDate(d) {
  if (!d) return "";
  const z = function (n) { return (n < 10 ? "0" : "") + n; };
  return z(d.getDate()) + "." + z(d.getMonth() + 1) + "." + d.getFullYear() + " " + z(d.getHours()) + ":" + z(d.getMinutes());
}

function dbOffText() {
  return '<p class="adm-dboff">Ma\'lumotlar bazasi hali ulanmagan. Firebase\'da <b>Firestore Database</b> yoqilib, qoidalar qo\'yilgach shu yerda ishlaydi.</p>';
}

function initDatabase() {
  if (typeof firebase === "undefined" || !firebase.firestore || !isFirebaseConfigured()) { dbState = "off"; refreshDbViews(); return; }
  DB = firebase.firestore();
  Promise.all([
    DB.collection("izohlar").orderBy("t", "desc").limit(500).get(),
    DB.collection("natijalar").orderBy("t", "desc").limit(2000).get(),
    DB.collection("xabarlar").orderBy("t", "desc").limit(500).get().catch(function () { xabarOff = true; return { docs: [] }; }),
    DB.collection("users").orderBy("t", "desc").limit(300).get().catch(function () { usersOff = true; return { docs: [] }; })
  ]).then(function (res) {
    const toDate = function (x) { return x && x.toDate ? x.toDate() : null; };
    NOTES = res[0].docs.map(function (d) {
      const x = d.data();
      return { id: d.id, src: "izoh", k: x.k, title: x.title || "", text: x.text || "", done: !!x.done, t: toDate(x.t) };
    }).concat(res[2].docs.map(function (d) {
      const x = d.data();
      return { id: d.id, src: "xabar", k: x.k, title: "", text: x.matn || "", bolim: x.bolim, ism: x.ism || "", done: !!x.bajarildi, t: toDate(x.t) };
    })).sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
    RESULTS = res[1].docs.map(function (d) {
      const x = d.data();
      return { k: x.k, h: x.h, s: x.s || [], n: x.n || 0, t: x.t && x.t.toDate ? x.t.toDate() : null };
    });
    USERS = res[3].docs.map(function (d) {
      const x = d.data();
      let r = {};
      try { r = JSON.parse(x.r || "{}") || {}; } catch (e) {}
      return { id: d.id, name: (x.name || "").trim(), role: x.role || "", arole: x.arole || "", r: r, t: x.t && x.t.toDate ? x.t.toDate() : null };
    });
    dbState = "ok";
    refreshDbViews();
    ensurePrimaryBanks();
  }).catch(function (e) {
    console.warn("Firestore:", e);
    dbState = "off";
    refreshDbViews();
  });
}

function refreshDbViews() {
  renderStats();
  renderFilter();
  renderTopics();
  renderResultsSection();
  renderUsersSection();
  if (panelTopic && !document.getElementById("adm-panel").hidden) { renderPanelNotes(); renderPanelResults(); }
}

// ---------- kirgan o'quvchilar (ism va natijalari) ----------

let USERS = [], usersOff = false;

// natija kalitini o'quvchiga tushunarli nomga aylantiradi: «5-sinf · 6. Oddiy kasrni… · 2-test»
function resultLabel(k) {
  const t = topicByKey(k);
  if (t) {
    const parts = splitTopicTitle(t.topic.title, t.index);
    return t.grade.id + "-sinf · " + parts.num + " " + parts.title + (/\|qiyin$/.test(k) ? " · 2-test" : "");
  }
  const pl = primaryLevelInfo(k);
  if (pl) return pl.g.grade + "-sinf · " + pl.title + " · " + pl.label;
  return String(k);
}

const ROLE_NAME = { oquvchi: "O'quvchi", ustoz: "Ustoz" };
let usersFilter = "all";   // all | oquvchi | ustoz | none

// foydalanuvchining roli: admin belgisi (arole) birinchi, bo'lmasa o'zi tanlagani (role)
function userRole(u) { return u.arole || u.role || ""; }

function userCounts() {
  const c = { all: USERS.length, oquvchi: 0, ustoz: 0, none: 0 };
  USERS.forEach(function (u) { const r = userRole(u); if (r === "oquvchi") c.oquvchi++; else if (r === "ustoz") c.ustoz++; else c.none++; });
  return c;
}

function renderUsersSection() {
  const el = document.getElementById("adm-users");
  if (!el) return;
  const head = '<div class="adm-res-head"><h2>Kirgan foydalanuvchilar</h2>';
  if (dbState !== "ok") { el.innerHTML = head + '</div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  if (usersOff) {
    el.innerHTML = head + '</div><p class="adm-dboff">Ismli natijalarni ko\'rish uchun Firebase Console → Firestore → Rules ga <code>firestore.rules</code> dagi yangi matnni qo\'ying (<b>users</b> bo\'limida admin o\'qishi yoqilgan).</p>';
    return;
  }
  const open = {};
  el.querySelectorAll(".adm-user[open]").forEach(function (d) { open[d.dataset.uid] = true; });

  const cnt = userCounts();
  const tab = function (key, label) {
    return '<button type="button" class="adm-utab' + (usersFilter === key ? " active" : "") + '" data-f="' + key + '">' + label + ' <b>' + cnt[key] + '</b></button>';
  };
  const rows = USERS.map(function (u) {
    const ks = Object.keys(u.r).filter(function (k) { return u.r[k] && typeof u.r[k].best === "number"; });
    const avg = ks.length ? Math.round(ks.reduce(function (s, k) { return s + u.r[k].best; }, 0) / ks.length) : null;
    return { u: u, ks: ks, avg: avg, role: userRole(u) };
  }).filter(function (r) {
    return usersFilter === "all" || (usersFilter === "none" ? !r.role : r.role === usersFilter);
  });
  const withTests = rows.filter(function (r) { return r.ks.length; }).length;

  el.innerHTML = head + '<span class="muted">Jami <b>' + cnt.all + '</b> ta foydalanuvchi: <b>' + cnt.oquvchi + '</b> o\'quvchi · <b>' + cnt.ustoz + '</b> ustoz · <b>' + cnt.none + '</b> belgilanmagan</span></div>' +
    '<div class="adm-utabs">' + tab("all", "Hammasi") + tab("oquvchi", "🎒 O'quvchilar") + tab("ustoz", "👩‍🏫 Ustozlar") + tab("none", "Belgilanmagan") + '</div>' +
    (rows.length
      ? '<div class="adm-users">' + rows.map(function (r) {
          const list = r.ks.sort(function (a, b) { return (r.u.r[b].t || 0) - (r.u.r[a].t || 0); }).map(function (k) {
            const x = r.u.r[k];
            return '<li><span>' + escapeHtml(resultLabel(k)) + '</span><b class="adm-rate--' + rateClass(x.best) + '">' + x.best + '%</b>' +
              '<small>oxirgisi ' + (x.last || 0) + '% · ' + (x.count || 1) + ' marta' + (x.t ? ' · ' + fmtDate(new Date(x.t)).split(" ")[0] : "") + '</small></li>';
          }).join("");
          const self = !r.u.arole && r.u.role ? ' <small>(o\'zi tanlagan)</small>' : "";
          return '<details class="adm-user" data-uid="' + r.u.id + '"' + (open[r.u.id] ? " open" : "") + '><summary>' +
            '<b>' + escapeHtml(r.u.name || "Ismsiz foydalanuvchi") + '</b>' +
            '<em class="adm-role adm-role--' + (r.role || "none") + '">' + (r.role ? ROLE_NAME[r.role] : "belgisiz") + self + '</em>' +
            '<span>' + (r.ks.length ? r.ks.length + ' ta test · o\'rtacha <b class="adm-rate--' + rateClass(r.avg) + '">' + r.avg + '%</b>' : "test yechmagan") + '</span>' +
            '<small>' + (r.u.t ? fmtDate(r.u.t) : "") + '</small></summary>' +
            '<div class="adm-user-role">Admin belgisi: <select class="adm-role-sel" data-uid="' + r.u.id + '">' +
              '<option value="">— qo\'yilmagan —</option>' +
              '<option value="oquvchi"' + (r.u.arole === "oquvchi" ? " selected" : "") + '>O\'quvchi</option>' +
              '<option value="ustoz"' + (r.u.arole === "ustoz" ? " selected" : "") + '>Ustoz</option></select></div>' +
            (list ? '<ul class="adm-user-list">' + list + '</ul>' : '<p class="muted adm-small">Hali test yechmagan.</p>') + '</details>';
        }).join("") + '</div>'
      : '<p class="muted">' + (usersFilter === "all" ? "Hali hech kim Google bilan kirmagan." : "Bu toifada hech kim yo'q.") + '</p>');

  el.querySelectorAll(".adm-utab").forEach(function (b) {
    b.addEventListener("click", function () { usersFilter = b.dataset.f; renderUsersSection(); });
  });
  el.querySelectorAll(".adm-role-sel").forEach(function (sel) {
    sel.addEventListener("change", function () {
      const u = USERS.find(function (x) { return x.id === sel.dataset.uid; });
      if (!u) return;
      const v = sel.value;
      sel.disabled = true;
      DB.collection("users").doc(u.id).update({ arole: v || firebase.firestore.FieldValue.delete() }).then(function () {
        u.arole = v;
        renderUsersSection(); renderStats();
      }).catch(function (e) {
        console.warn("Belgi qo'yilmadi:", e);
        alert("Belgi qo'yib bo'lmadi. Firestore qoidalari yangilanganini tekshiring (firestore.rules).");
        sel.disabled = false; sel.value = u.arole || "";
      });
    });
  });
}

// ---------- izohlar ----------

function openNotes() { return NOTES.filter(function (n) { return !n.done; }); }

function renderNotesCard() {
  const el = document.getElementById("adm-notes");
  const open = dbState === "ok" ? openNotes() : [];
  let body;
  if (dbState === "loading") body = '<p class="adm-empty-line">Yuklanmoqda…</p>';
  else if (dbState === "off") body = dbOffText();
  else if (!open.length) body = '<p class="adm-empty-line">Ochiq izoh yoki xabar yo\'q.</p>';
  else {
    const full = currentView === "izohlar";
    const limit = showAllNotes.on || full ? open.length : 5;
    body = '<div class="adm-evs">' + open.slice(0, limit).map(function (n) {
      const t = topicByKey(n.k);
      const where = t ? t.grade.id + "-sinf · " + splitTopicTitle(t.topic.title, t.index).num + " " + escapeHtml(splitTopicTitle(t.topic.title, t.index).title) : escapeHtml(n.title || "Mavzu topilmadi");
      const kicker = (n.src === "xabar" ? noteSource(n) : '<span class="adm-src adm-src--izoh">Izoh</span> ') + '<span class="adm-ev-where">' + where + '</span>';
      const left = n.t ? z2(n.t.getDate()) + "." + z2(n.t.getMonth() + 1) : "—";
      const small = n.t ? z2(n.t.getHours()) + ":" + z2(n.t.getMinutes()) : "";
      return evRow(n.src === "xabar" ? "green" : "yellow", left, small, kicker, escapeHtml(n.text), t, "adm-ev--note");
    }).join("") + '</div>' +
    (open.length > 5 && !full ? '<button type="button" class="adm-ev-more" id="adm-notes-all">' + (showAllNotes.on ? "Kamroq ko'rsatish" : "Hammasini ko'rsatish (" + open.length + ")") + '</button>' : "");
  }
  if (dbState === "ok" && xabarOff) body += '<p class="adm-empty-line adm-warn">Saytdagi xabarlarni ko\'rish uchun Firebase qoidalarini yangilang.</p>';

  el.innerHTML =
    '<div class="adm-card-head"><h3>Izohlar va xabarlar' + (open.length ? ' <span class="adm-count">' + open.length + '</span>' : "") + '</h3>' +
      (open.length ? '<button type="button" class="adm-mini-btn adm-mini-btn--primary" id="adm-notes-copy">' + ICONS.copy + '<span>Claude uchun nusxalash</span></button>' : "") + '</div>' + body;
  wireEventRows(el);
  const copyBtn = document.getElementById("adm-notes-copy");
  if (copyBtn) copyBtn.addEventListener("click", function () { copyNotesForClaude(copyBtn); });
  const allBtn = document.getElementById("adm-notes-all");
  if (allBtn) allBtn.addEventListener("click", function () { showAllNotes.on = !showAllNotes.on; renderNotesCard(); });
  setNavCount("notes", open.length);
}

// izoh yoki xabar kimdan va qaysi bo'limdan kelgani (qisqa belgi)
function noteSource(n) {
  if (n.src !== "xabar") return "";
  return bolimChip(n) + '<span class="adm-src">👤 ' + escapeHtml(n.ism || "Saytdan") + '</span> ';
}

function copyNotesForClaude(btn) {
  const lines = openNotes().map(function (n) {
    const t = topicByKey(n.k);
    const where = (t ? t.grade.id + "-sinf, " + t.topic.title : n.title) + (n.src === "xabar" && BOLIM_NAMES[n.bolim] ? " (" + BOLIM_NAMES[n.bolim] + ")" : "");
    return "- " + where + ": " + n.text + (n.src === "xabar" ? " [saytdan" + (n.ism ? ", " + n.ism : "") + "]" : "");
  });
  const text = "Admin paneldagi izohlar va saytdan kelgan xabarlar (tekshirib, tuzatib bering):\n" + lines.join("\n");
  navigator.clipboard.writeText(text).then(function () {
    const label = btn.querySelector("span") || btn;
    label.textContent = "Nusxalandi ✓ — Claude'ga joylang";
    setTimeout(function () { label.textContent = "Claude uchun nusxalash"; }, 2500);
  });
}

function renderPanelNotes() {
  const el = document.getElementById("adm-pnotes");
  if (!el || !panelTopic) return;
  if (dbState !== "ok") { el.innerHTML = '<h4>Izohlar</h4>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  const k = topicKey(panelTopic.grade, panelTopic.subject, panelTopic.topic);
  const list = NOTES.filter(function (n) { return n.k === k; });
  el.innerHTML = '<h4>Izohlar va xabarlar</h4>' +
    (list.length ? '<ul class="adm-notes">' + list.map(function (n) {
      return '<li class="' + (n.done ? "done " : "") + (n.src === "xabar" ? "xabar" : "") + '">' + (n.src === "xabar" ? '<div class="adm-note-from">' + noteSource(n) + '</div>' : "") +
        '<div class="adm-note-text">' + escapeHtml(n.text) + '</div>' +
        '<div class="adm-note-meta"><span>' + fmtDate(n.t) + '</span>' +
        '<button type="button" data-done="' + n.id + '">' + (n.done ? "↺ Qayta ochish" : "✓ Bajarildi") + '</button>' +
        '<button type="button" data-del="' + n.id + '">O\'chirish</button></div></li>';
    }).join("") + '</ul>' : "") +
    '<textarea id="adm-note-input" class="adm-note-input" rows="3" placeholder="Masalan: 3-misolning javobi noto\'g\'ri; chizma telefonda kichik…"></textarea>' +
    '<button type="button" class="adm-mini-btn adm-mini-btn--primary" id="adm-note-save">Izohni saqlash</button>';

  document.getElementById("adm-note-save").addEventListener("click", function () {
    const input = document.getElementById("adm-note-input");
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const btn = this; btn.disabled = true; btn.textContent = "Saqlanmoqda…";
    const doc = { k: k, title: panelTopic.topic.title, text: text, done: false, t: firebase.firestore.FieldValue.serverTimestamp() };
    DB.collection("izohlar").add(doc).then(function (ref) {
      NOTES.unshift({ id: ref.id, src: "izoh", k: k, title: doc.title, text: text, done: false, t: new Date() });
      renderPanelNotes(); renderStats();
    }).catch(function () { btn.disabled = false; btn.textContent = "Saqlanmadi — qayta urining"; });
  });
  el.querySelectorAll("[data-done]").forEach(function (b) {
    b.addEventListener("click", function () {
      const n = NOTES.find(function (x) { return x.id === b.dataset.done; });
      const upd = n.src === "xabar" ? { bajarildi: !n.done } : { done: !n.done };
      DB.collection(n.src === "xabar" ? "xabarlar" : "izohlar").doc(n.id).update(upd).then(function () { n.done = !n.done; renderPanelNotes(); renderStats(); });
    });
  });
  el.querySelectorAll("[data-del]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!confirm("O'chirilsinmi?")) return;
      const n = NOTES.find(function (x) { return x.id === b.dataset.del; });
      DB.collection(n.src === "xabar" ? "xabarlar" : "izohlar").doc(n.id).delete().then(function () {
        NOTES = NOTES.filter(function (x) { return x.id !== b.dataset.del; });
        renderPanelNotes(); renderStats();
      });
    });
  });
}

// ---------- o'quvchilar natijalari ----------

// 1–4-sinf testi natijalari: kalit "<sinf>|boshlangich|<daraja id>"; savollari mathrunner-web banklaridan olinadi
function primaryLevelInfo(k) {
  const p = String(k).split("|");
  if (p[1] !== "boshlangich" || !PRIMARY) return null;
  for (const g of PRIMARY.grades) for (const c of g.choraks) for (const b of c.blocks) {
    const tests = b.levels.filter(function (l) { return l.gameKind === "test"; });
    const l = tests.find(function (x) { return x.id === p[2]; });
    if (l) return { g: g, c: c, b: b, l: l, title: b.blok + ". " + primaryTitle(g, c, b), label: tests.indexOf(l) + 1 + "-test" };
  }
  return null;
}

// natijalarda uchragan 1–4-sinf testlarining savollarini yuklaydi (bir marta), so'ng ro'yxatni yangilaydi
function ensurePrimaryBanks() {
  if (!PRIMARY || dbState !== "ok") return;
  const need = {};
  RESULTS.forEach(function (r) { if (String(r.k).split("|")[1] === "boshlangich" && !MW_QUIZ[r.k]) need[r.k] = true; });
  const keys = Object.keys(need);
  if (!keys.length) return;
  Promise.all(keys.map(function (k) {
    const info = primaryLevelInfo(k);
    if (!info) return null;
    return fetch("mathrunner-web/data/" + info.l.bank + "?v=5").then(function (r) { return r.json(); })
      .then(function (bank) { MW_QUIZ[k] = bank.map(mwToQuestion); }).catch(function () {});
  })).then(function () { renderResultsSection(); });
}

// mavzu testi bo'yicha yig'indi: faqat savollari hozirgisi bilan bir xil bo'lgan urinishlar hisoblanadi
function quizStats(k) {
  const questions = quizByStatKey(k);
  const h = questions.length ? quizHash(questions) : null;
  const rows = RESULTS.filter(function (r) { return r.k === k; });
  const cur = rows.filter(function (r) { return r.h === h && r.s.length === questions.length; });
  const per = questions.map(function (q) {
    const picks = q.options.map(function () { return 0; });
    cur.forEach(function (r) { const i = Number(r.s[questions.indexOf(q)]); if (i >= 0 && picks[i] != null) picks[i]++; });
    const ok = picks[q.options.indexOf(q.answer)] || 0;
    return { q: q, picks: picks, ok: ok, rate: cur.length ? ok / cur.length : null };
  });
  const sum = cur.reduce(function (a, r) { return a + r.n; }, 0);
  return {
    count: cur.length, old: rows.length - cur.length,
    avg: cur.length ? Math.round(sum / (cur.length * questions.length) * 100) : null,
    per: per, last: cur.length ? cur[0].t : null
  };
}

function rateClass(p) { return p == null ? "" : p < 50 ? "low" : p < 75 ? "mid" : "high"; }

function renderPanelResults() {
  const el = document.getElementById("adm-presults");
  if (!el || !panelTopic || el.hidden) return;
  if (dbState !== "ok") { el.innerHTML = '<h4>O\'quvchilar natijalari</h4>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  const baseKey = topicKey(panelTopic.grade, panelTopic.subject, panelTopic.topic);
  const sets = quizSets(baseKey);
  el.innerHTML = '<h4>O\'quvchilar natijalari</h4>' + sets.map(function (x) {
    return (sets.length > 1 ? '<div class="adm-quiz-set">' + (x.tur === "qiyin" ? "2-test · qiyinroq" : "1-test · oson") + '</div>' : "") + resultsBlock(quizStatKey(baseKey, x.tur));
  }).join("");
}

function resultsBlock(statKey) {
  const st = quizStats(statKey);
  if (!st.count) return '<p class="muted">Bu test hali yechilmagan' + (st.old ? " (eski savollar bilan " + st.old + " marta yechilgan)" : "") + '.</p>';
  return '' +
    '<div class="adm-rsum"><div><b>' + st.count + '</b><span>marta yechildi</span></div>' +
    '<div><b class="adm-rate--' + rateClass(st.avg) + '">' + st.avg + '%</b><span>o\'rtacha natija</span></div>' +
    '<div><b>' + fmtDate(st.last).split(" ")[0] + '</b><span>oxirgi marta</span></div></div>' +
    '<ol class="adm-qrates">' + st.per.map(function (p, i) {
      const pct = Math.round(p.rate * 100);
      let worst = -1;
      p.picks.forEach(function (c, j) { if (p.q.options[j] !== p.q.answer && c > 0 && (worst < 0 || c > p.picks[worst])) worst = j; });
      return '<li><div class="adm-qrate-head"><span>' + escapeHtml(p.q.question) + '</span><b class="adm-rate--' + rateClass(pct) + '">' + pct + '%</b></div>' +
        '<span class="adm-bar"><i class="adm-bar--' + rateClass(pct) + '" style="width:' + pct + '%"></i></span>' +
        (worst >= 0 ? '<div class="adm-qwrong">Ko\'p tanlangan xato javob: <b>' + escapeHtml(p.q.options[worst]) + '</b> (' + p.picks[worst] + ' marta)</div>' : "") + '</li>';
    }).join("") + '</ol>' +
    (st.old ? '<p class="muted adm-small">Savollar o\'zgarishidan oldingi ' + st.old + ' ta urinish hisobga olinmadi.</p>' : "");
}

function renderResultsSection() {
  const el = document.getElementById("adm-results");
  if (!el) return;
  if (dbState !== "ok") {
    el.innerHTML = '<div class="adm-res-head"><h2>O\'quvchilar natijalari</h2></div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText());
    return;
  }
  const keys = {};
  RESULTS.forEach(function (r) { keys[r.k] = true; });
  const weekAgo = Date.now() - 7 * 864e5;
  const week = RESULTS.filter(function (r) { return r.t && r.t.getTime() > weekAgo; }).length;
  const rows = Object.keys(keys).map(function (k) {
    const t = topicByKey(k) || primaryLevelInfo(k);
    if (!t || !quizByStatKey(k).length) return null;
    const st = quizStats(k);
    if (!st.count) return null;
    let hard = null;
    st.per.forEach(function (p, i) { if (hard == null || p.rate < st.per[hard].rate) hard = i; });
    return { k: k, t: t, st: st, hard: hard };
  }).filter(Boolean).sort(function (a, b) { return b.st.count - a.st.count; });

  el.innerHTML =
    '<div class="adm-res-head"><h2>O\'quvchilar natijalari</h2>' +
    '<span class="muted">Jami <b>' + RESULTS.length + '</b> marta test yechilgan · oxirgi 7 kunda <b>' + week + '</b></span></div>' +
    (rows.length
      ? '<table class="adm-table adm-res-table"><thead><tr><th>Mavzu</th><th>Yechildi</th><th>O\'rtacha</th><th>Eng qiyin savol</th></tr></thead><tbody>' +
        rows.map(function (r) {
          const hp = Math.round(r.st.per[r.hard].rate * 100);
          if (r.t.l) {
            return '<tr class="adm-tr-static"><td class="adm-td-title">' + r.t.g.grade + '-sinf · ' + escapeHtml(r.t.title) + ' <span class="adm-tag">' + r.t.label + '</span></td>' +
              '<td>' + r.st.count + '</td><td><b class="adm-rate--' + rateClass(r.st.avg) + '">' + r.st.avg + '%</b></td>' +
              '<td>' + (r.hard + 1) + '-savol · <b class="adm-rate--' + rateClass(hp) + '">' + hp + '%</b></td></tr>';
          }
          const parts = splitTopicTitle(r.t.topic.title, r.t.index);
          return '<tr class="adm-tr" data-g="' + r.t.grade.id + '" data-s="' + r.t.subject.id + '" data-t="' + r.t.topic.id + '">' +
            '<td class="adm-td-title">' + (r.t.grade.id !== FOCUS_GRADE ? r.t.grade.id + "-sinf · " : "") + parts.num + ' ' + escapeHtml(parts.title) +
              (/\|qiyin$/.test(r.k) ? ' <span class="adm-tag">2-test</span>' : "") + '</td>' +
            '<td>' + r.st.count + '</td>' +
            '<td><b class="adm-rate--' + rateClass(r.st.avg) + '">' + r.st.avg + '%</b></td>' +
            '<td>' + (r.hard + 1) + '-savol · <b class="adm-rate--' + rateClass(hp) + '">' + hp + '%</b></td></tr>';
        }).join("") + '</tbody></table>'
      : '<p class="muted">Hali hech kim test yechmagan. O\'quvchilar test yechgach, natijalar shu yerda chiqadi (ism-familiyasiz).</p>');
  el.querySelectorAll(".adm-tr").forEach(function (tr) {
    tr.addEventListener("click", function () { openTopicPanel(tr.dataset.g, tr.dataset.s, tr.dataset.t); });
  });
}

// ---------- alohida bo'limlarning batafsil qismlari ----------

// mavzuning ochiq izoh va xabarlari soni (baza ulangan bo'lsa)
function notesCountFor(grade, subject, topic) {
  if (dbState !== "ok") return 0;
  const k = topicKey(grade, subject, topic);
  return NOTES.filter(function (n) { return !n.done && n.k === k; }).length;
}

// PDF holati: ma'ruza PDF + 1-test va 2-test PDF lari (pdf/royxat.json)
function pdfStatus(topic) {
  if (!PDF_LIST) return { state: "none", text: PDF_LIST === null ? "…" : "yo'q" };
  const p = topicPdf(topic);
  const n = (p.lec ? 1 : 0) + p.test;
  return n ? { state: "ok", text: String(n), title: "Ma'ruza PDF: " + (p.lec ? "bor" : "yo'q") + ", test PDF: " + p.test } : { state: "none", text: "yo'q" };
}

function pdfCell(topic) {
  const st = pdfStatus(topic);
  return st.state === "ok" ? '<span class="adm-cell adm-cell--ok" title="' + st.title + '">' + st.text + '</span>'
    : '<span class="adm-cell adm-cell--none" title="PDF: ' + st.text + '">—</span>';
}

// nechta narsa yetishmaydi (saralash uchun): ma'ruza, test 20+20, PDF, ko'rgazma, tekshiruv
function missingScore(grade, subject, topic) {
  return (hasLectureFile(topic) ? 0 : 1) + (ownQuizFull(grade, subject, topic) ? 0 : 1) +
    (pdfStatus(topic).state === "ok" ? 0 : 1) + (topic.interactive ? 0 : 1) + (reviewState(topic) ? 1 : 0);
}

function miniStats(items) {
  return items.map(function (x) {
    return '<div class="adm-mstat adm-mstat--' + (x[3] || "card") + '"><span class="adm-mstat-label">' + x[0] + '</span>' +
      '<b class="adm-mstat-val">' + x[1] + '</b>' + (x[2] ? '<small class="adm-mstat-sub">' + x[2] + '</small>' : "") + '</div>';
  }).join("");
}

function fmtDateTime(d) { return d ? fmtDate(d) : "—"; }
function pct(n, d) { return d ? Math.round(n / d * 100) : 0; }

function renderDetails() {
  if (currentView === "bugungi") renderTodaySum();
  if (currentView === "mavzular") renderGradeSum();
  if (currentView === "izohlar") renderNotesFull();
  if (currentView === "natijalar") { renderResSum(); renderResRecent(); }
  if (currentView === "foydalanuvchilar") { renderUsersSum(); renderUsersFull(); }
}

// ---- Bugungi ish: yuqoridagi sonlar va har mavzuning holat belgilari ----

function topicTags(t) {
  const tag = function (ok, label, warn) { return '<span class="adm-tagx adm-tagx--' + (ok ? "ok" : warn ? "warn" : "no") + '">' + label + '</span>'; };
  const sets = quizSets(topicKey(t.grade, t.subject, t.topic));
  const full = ownQuizFull(t.grade, t.subject, t.topic);
  const r = reviewState(t.topic);
  const nc = notesCountFor(t.grade, t.subject, t.topic);
  const pdf = pdfStatus(t.topic);
  return tag(hasLectureFile(t.topic), hasLectureFile(t.topic) ? "Ma'ruza ✓" : "Ma'ruza yo'q") +
    tag(full, full ? "Test 20+20 ✓" : sets.length ? "Test eski formatda" : "Test yo'q", sets.length && !full) +
    tag(pdf.state === "ok", pdf.state === "ok" ? "PDF " + pdf.text + " ta" : "PDF yo'q") +
    tag(!!t.topic.interactive, t.topic.interactive ? "Ko'rgazma ✓" : "Ko'rgazma yo'q") +
    (r ? '<span class="adm-tagx adm-tagx--' + (r === "qizil" ? "bad" : "warn") + '">' + (r === "qizil" ? "Tekshirilmagan" : "Tasdiq kutilmoqda") + '</span>' : "") +
    (nc ? '<span class="adm-tagx adm-tagx--note">' + nc + ' ta izoh</span>' : "");
}

function detailRow(tone, kicker, t) {
  const parts = splitTopicTitle(t.topic.title, t.index);
  return '<div class="adm-ev adm-ev--' + tone + ' adm-ev--detail">' +
    '<span class="adm-ev-left"><b>' + parts.num + '</b><small>' + t.grade.id + '-sinf</small></span>' +
    '<span class="adm-ev-body"><small>' + kicker + '</small><span class="adm-ev-title">' + escapeHtml(parts.title) + '</span>' +
      '<span class="adm-ev-tags">' + topicTags(t) + '</span>' +
      '<span class="adm-ev-acts">' +
        '<button type="button" class="adm-ev-act" data-open-g="' + t.grade.id + '" data-open-s="' + t.subject.id + '" data-open-t="' + t.topic.id + '">Batafsil</button>' +
        '<a class="adm-ev-act" href="' + topicHref(t.grade.id, t.subject.id, t.topic.id) + '" target="_blank" rel="noopener">Sahifa ↗</a>' +
      '</span></span></div>';
}

function renderTodaySum() {
  const all = allTopics();
  const notReady = all.filter(function (t) { return t.grade.id === FOCUS_GRADE && !hasLectureFile(t.topic); });
  const next = notReady[0];
  const qizil = all.filter(function (t) { return reviewState(t.topic) === "qizil"; }).length;
  const sariq = all.filter(function (t) { return reviewState(t.topic) === "sariq"; }).length;
  const noQuiz = all.filter(function (t) { return hasLectureFile(t.topic) && !hasOwnQuiz(t.grade, t.subject, t.topic); }).length;
  let today = ["Bugun kelgan", "…", "yuklanmoqda", "card"];
  if (dbState === "off") today = ["Bugun kelgan", "—", "baza ulanmagan", "card"];
  if (dbState === "ok") {
    const now = new Date();
    const n = NOTES.filter(function (x) { return sameDay(x.t, now); }).length;
    const r = RESULTS.filter(function (x) { return sameDay(x.t, now); }).length;
    today = ["Bugun kelgan", n + r, n + " izoh/xabar · " + r + " natija", "mint"];
  }
  document.getElementById("adm-today-sum").innerHTML = miniStats([
    ["Navbatdagi mavzu", next ? splitTopicTitle(next.topic.title, next.index).num : "✓", next ? FOCUS_GRADE + "-sinf · yana " + notReady.length + " ta" : "hammasi tayyor", "mint"],
    ["Tekshirilmagan", qizil, "qizil nuqta", "pink"],
    ["Tasdiq kutilmoqda", sariq, "sariq nuqta", "beige"],
    ["O'z testi yo'q", noQuiz, "ma'ruzasi bor mavzular", "sage"],
    today
  ]);
}

// ---- Mavzular: har sinf bo'yicha qisqa jadval ----

function renderGradeSum() {
  const el = document.getElementById("adm-grade-sum");
  const cellP = function (n, t) {
    const p = pct(n, t);
    return '<td><div class="adm-gs-cell"><span><b>' + n + '</b> <small>' + p + '%</small></span><span class="adm-bar"><i style="width:' + p + '%"></i></span></div></td>';
  };
  const rows = SITE_DATA.grades.map(function (g) {
    let t = 0, lec = 0, quiz = 0, pdf = 0, inter = 0, rev = 0, notes = 0;
    g.subjects.forEach(function (s) {
      s.topics.forEach(function (x) {
        t++;
        if (hasLectureFile(x)) lec++;
        if (ownQuizFull(g, s, x)) quiz++;
        if (pdfStatus(x).state === "ok") pdf++;
        if (x.interactive) inter++;
        if (reviewState(x)) rev++;
        notes += notesCountFor(g, s, x);
      });
    });
    return '<tr class="adm-tr' + (g.id === activeGradeId ? " is-active" : "") + '" tabindex="0" data-grade="' + g.id + '">' +
      '<td class="adm-td-title"><b>' + g.name + '</b><small class="adm-gs-sub">' + g.subjects.map(function (s) { return s.name; }).join(", ") + '</small></td>' +
      '<td>' + t + '</td>' + cellP(lec, t) + cellP(quiz, t) + (PDF_LIST ? cellP(pdf, t) : '<td>…</td>') + cellP(inter, t) +
      '<td>' + (rev ? '<span class="adm-cell adm-cell--part">' + rev + '</span>' : '<span class="adm-cell adm-cell--none">—</span>') + '</td>' +
      '<td>' + (dbState !== "ok" ? '<span class="muted">—</span>' : notes ? '<span class="adm-cell adm-cell--note">' + notes + '</span>' : '<span class="adm-cell adm-cell--none">0</span>') + '</td></tr>';
  }).join("");
  el.innerHTML = '<div class="adm-card-head"><h3>Sinflar bo\'yicha holat</h3><span class="muted adm-small">Qatorni bossangiz — pastdagi jadval o\'sha sinfga o\'tadi</span></div>' +
    '<div class="adm-scroll"><table class="adm-table adm-gs-table"><thead><tr><th>Sinf</th><th>Mavzu</th><th>Ma\'ruza</th><th>Test 20+20</th><th>PDF</th><th>Ko\'rgazma</th><th>Tekshiruv</th><th>Ochiq izoh</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
  el.querySelectorAll(".adm-tr").forEach(function (tr) {
    const go = function () { selectGrade(tr.dataset.grade); renderGradeSum(); document.getElementById("adm-work").scrollIntoView({ behavior: "smooth", block: "start" }); };
    tr.addEventListener("click", go);
    tr.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  });
}

// ---- Izohlar: to'liq ro'yxat, filtrlar va amallar ----

const noteFilter = { status: "open", src: "all", grade: "all" };

function afterNotesChange() {
  renderStats();
  renderTopics();
  renderFilter();
  if (panelTopic && !document.getElementById("adm-panel").hidden) renderPanelNotes();
}

function noteToggle(n) {
  const upd = n.src === "xabar" ? { bajarildi: !n.done } : { done: !n.done };
  return DB.collection(n.src === "xabar" ? "xabarlar" : "izohlar").doc(n.id).update(upd)
    .then(function () { n.done = !n.done; afterNotesChange(); })
    .catch(function (e) { console.warn(e); alert("Saqlab bo'lmadi. Internet va Firebase qoidalarini tekshiring."); });
}

function noteDelete(n) {
  if (!confirm("O'chirilsinmi?")) return;
  DB.collection(n.src === "xabar" ? "xabarlar" : "izohlar").doc(n.id).delete()
    .then(function () { NOTES = NOTES.filter(function (x) { return x.id !== n.id; }); afterNotesChange(); })
    .catch(function (e) { console.warn(e); alert("O'chirib bo'lmadi."); });
}

// ---------- kunlik ish: js/kunlik.js dagi ro'yxat (har kuni ish oxirida to'ldiriladi) ----------

const KUN_NOMI = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
const OY_NOMI = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
let kunlikBolim = "all";

function kunlikSana(iso) {
  const p = iso.split("-").map(Number), d = new Date(p[0], p[1] - 1, p[2]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 864e5);
  return { kun: p[2], oy: OY_NOMI[p[1] - 1], hafta: KUN_NOMI[d.getDay()], belgi: diff === 0 ? "Bugun" : diff === 1 ? "Kecha" : "" };
}

function isoDate(d) { return d.getFullYear() + "-" + z2(d.getMonth() + 1) + "-" + z2(d.getDate()); }
function kunlikDay(iso) {
  return (Array.isArray(window.KUNLIK) ? window.KUNLIK : []).filter(function (d) { return d.sana === iso; })[0] || null;
}
function kunlikList(ish) {
  return '<ul class="adm-kitems">' + ish.map(function (i) {
    const t = i[1].toLowerCase(), tur = [];
    if (/ma'ruza|maruza|5e uslub/.test(t)) tur.push(["maruza", "Ma'ruza"]);
    if (/test/.test(t)) tur.push(["test", "Test"]);
    if (/interaktiv/.test(t) || i[0] === "Interaktiv") tur.push(["interaktiv", "Interaktiv"]);
    if (/pdf/.test(t)) tur.push(["pdf", "PDF"]);
    const belgi = tur.map(function (x) { return '<span class="adm-ktur" data-t="' + x[0] + '">' + x[1] + '</span>'; }).join("");
    return '<li><span class="adm-ktag" data-b="' + escapeHtml(i[0]) + '">' + escapeHtml(i[0]) + '</span><span>' + (belgi ? '<span class="adm-kturlar">' + belgi + '</span> ' : "") + escapeHtml(i[1]) + '</span></li>';
  }).join("") + '</ul>';
}

// kalendardagi kun bosilganda: o'sha kuni qilingan ishlar + kelgan izoh/natijalar soni
function openDayPanel(iso) {
  const k = kunlikDay(iso), s = kunlikSana(iso);
  const p = iso.split("-").map(Number);
  const a = activityByDay()[p[0] + "-" + (p[1] - 1) + "-" + p[2]];
  const keldi = a ? [a.n ? a.n + " ta izoh/xabar" : "", a.r ? a.r + " ta test natijasi" : ""].filter(Boolean).join(", ") : "";
  document.getElementById("adm-panel-kicker").textContent = "Kunlik ish" + (s.belgi ? " · " + s.belgi : "");
  document.getElementById("adm-panel-title").textContent = s.kun + "-" + s.oy + ", " + s.hafta;
  document.getElementById("adm-panel-body").innerHTML =
    (k ? (k.qisqa ? '<p class="adm-kday-sum">' + escapeHtml(k.qisqa) + '</p>' : "") +
        '<div class="adm-psec"><h4>Qilingan ishlar <span class="adm-count">' + k.ishlar.length + '</span></h4>' + kunlikList(k.ishlar) + '</div>'
      : '<p class="adm-empty-line">Bu kun uchun ish yozilmagan.</p>') +
    (keldi ? '<div class="adm-psec"><h4>Saytga kelganlar</h4><p class="adm-ptext">' + keldi + '</p></div>' : "") +
    '<div class="adm-psec"><a class="adm-mini-btn" href="#kunlik" id="adm-day-all">Barcha kunlar →</a></div>';
  document.getElementById("adm-day-all").addEventListener("click", closeTopicPanel);
  panelTopic = null;
  const panel = document.getElementById("adm-panel");
  panel.hidden = false;
  panel.querySelector(".adm-panel-box").scrollTop = 0;
  document.body.classList.add("adm-noscroll");
}

function renderKunlik() {
  const el = document.getElementById("adm-kunlik");
  if (!el) return;
  const days = Array.isArray(window.KUNLIK) ? window.KUNLIK : [];
  const all = [];
  days.forEach(function (d) { d.ishlar.forEach(function (i) { all.push(i[0]); }); });
  const TARTIB = ["5-sinf", "6-sinf", "7-sinf", "8-sinf", "1–4-sinf", "Interaktiv", "Sayt", "Admin", "Ish tartibi"];
  const rank = function (b) { const i = TARTIB.indexOf(b); return i < 0 ? 99 : i; };
  const bolimlar = all.filter(function (b, i) { return all.indexOf(b) === i; }).sort(function (x, y) { return rank(x) - rank(y); });
  const tab = function (key, label, n) {
    return '<button type="button" class="adm-utab' + (kunlikBolim === key ? " active" : "") + '" data-kb="' + escapeHtml(key) + '">' + escapeHtml(label) + ' <b>' + n + '</b></button>';
  };
  const list = days.map(function (d) {
    const ish = d.ishlar.filter(function (i) { return kunlikBolim === "all" || i[0] === kunlikBolim; });
    if (!ish.length) return "";
    const s = kunlikSana(d.sana);
    return '<article class="adm-kday" id="kun-' + d.sana + '">' +
      '<div class="adm-kday-date"><b>' + s.kun + '</b><span>' + s.oy + '</span><small>' + s.hafta + '</small>' + (s.belgi ? '<i>' + s.belgi + '</i>' : "") + '</div>' +
      '<div class="adm-kday-body">' +
        (d.qisqa ? '<p class="adm-kday-sum">' + escapeHtml(d.qisqa) + '</p>' : "") +
        kunlikList(ish) +
      '</div></article>';
  }).join("");
  el.innerHTML = '<div class="adm-card-head"><h3>Kunlik ish <span class="adm-count">' + days.length + ' kun</span></h3>' +
      '<span class="muted">' + (days.length ? kunlikSana(days[days.length - 1].sana).kun + "-" + kunlikSana(days[days.length - 1].sana).oy + " dan beri · " : "") + all.length + ' ta ish</span></div>' +
    '<div class="adm-ktabs">' + tab("all", "Hammasi", all.length) + bolimlar.map(function (b) {
      return tab(b, b, all.filter(function (x) { return x === b; }).length);
    }).join("") + '</div>' +
    (list || '<p class="adm-empty-line">Hozircha yozuv yo\'q.</p>');
  el.querySelectorAll("[data-kb]").forEach(function (b) {
    b.addEventListener("click", function () { kunlikBolim = b.dataset.kb; renderKunlik(); });
  });
}

function renderNotesFull() {
  const el = document.getElementById("adm-notes-full");
  if (dbState !== "ok") {
    el.innerHTML = '<div class="adm-card-head"><h3>Izohlar va xabarlar</h3></div>' + (dbState === "loading" ? '<p class="adm-empty-line">Yuklanmoqda…</p>' : dbOffText());
    return;
  }
  const open = NOTES.filter(function (n) { return !n.done; });
  const cnt = {
    open: open.length, done: NOTES.length - open.length, all: NOTES.length,
    izoh: NOTES.filter(function (n) { return n.src === "izoh"; }).length, xabar: NOTES.filter(function (n) { return n.src === "xabar"; }).length
  };
  const grades = {};
  NOTES.forEach(function (n) { const g = String(n.k).split("|")[0]; if (g) grades[g] = (grades[g] || 0) + 1; });
  const list = NOTES.filter(function (n) {
    if (noteFilter.status === "open" && n.done) return false;
    if (noteFilter.status === "done" && !n.done) return false;
    if (noteFilter.src !== "all" && n.src !== noteFilter.src) return false;
    if (noteFilter.grade !== "all" && String(n.k).split("|")[0] !== noteFilter.grade) return false;
    return true;
  });
  const tab = function (group, key, label, n) {
    return '<button type="button" class="adm-utab' + (noteFilter[group] === key ? " active" : "") + '" data-nf="' + group + '" data-nv="' + key + '">' + label + ' <b>' + n + '</b></button>';
  };
  const items = list.map(function (n) {
    const t = topicByKey(n.k);
    const parts = t ? splitTopicTitle(t.topic.title, t.index) : null;
    return '<article class="adm-nitem' + (n.done ? " is-done" : "") + (n.src === "xabar" ? " is-xabar" : "") + '">' +
      '<div class="adm-nitem-head">' +
        '<span class="adm-status adm-status--' + (n.done ? "done" : "open") + '">' + (n.done ? "Bajarildi" : "Ochiq") + '</span>' +
        '<span class="adm-nitem-src">' + (n.src === "xabar" ? "Saytdan xabar" : "Admin izohi") + '</span>' + bolimChip(n) +
        (n.src === "xabar" ? '<span class="adm-nitem-who">👤 ' + escapeHtml(n.ism || "ismsiz") + '</span>' : "") +
        '<time>' + fmtDateTime(n.t) + '</time>' +
      '</div>' +
      '<div class="adm-nitem-topic">' + (t ? t.grade.id + "-sinf · " + t.subject.name + " · " + parts.num + " " + escapeHtml(parts.title) : escapeHtml(n.title || "Mavzu topilmadi") + ' <small class="muted">(' + escapeHtml(n.k) + ')</small>') + '</div>' +
      '<p class="adm-nitem-text">' + escapeHtml(n.text) + '</p>' +
      '<div class="adm-nitem-acts">' +
        '<button type="button" class="adm-mini-btn' + (n.done ? "" : " adm-mini-btn--primary") + '" data-ndone="' + n.id + '">' + (n.done ? "↺ Qayta ochish" : "✓ Bajarildi") + '</button>' +
        (t ? '<button type="button" class="adm-mini-btn" data-open-g="' + t.grade.id + '" data-open-s="' + t.subject.id + '" data-open-t="' + t.topic.id + '">Mavzuni ochish</button>' +
             '<a class="adm-mini-btn" href="' + topicHref(t.grade.id, t.subject.id, t.topic.id) + '" target="_blank" rel="noopener">Sahifa ↗</a>' : "") +
        '<button type="button" class="adm-mini-btn adm-mini-btn--danger" data-ndel="' + n.id + '">O\'chirish</button>' +
      '</div></article>';
  }).join("");

  el.innerHTML =
    '<div class="adm-card-head"><h3>Izohlar va xabarlar</h3>' +
      (open.length ? '<button type="button" class="adm-mini-btn adm-mini-btn--primary" id="adm-notes-copy2">' + ICONS.copy + '<span>Claude uchun nusxalash</span></button>' : "") + '</div>' +
    '<div class="adm-msum adm-msum--inline">' + miniStats([
      ["Ochiq", cnt.open, "bajarilmagan", "pink"], ["Bajarildi", cnt.done, "", "mint"],
      ["Admin izohlari", cnt.izoh, "", "beige"], ["Saytdan xabarlar", cnt.xabar, xabarOff ? "ruxsat yo'q" : "", "sage"]
    ]) + '</div>' +
    '<div class="adm-nfilters">' +
      '<div class="adm-utabs">' + tab("status", "open", "Ochiq", cnt.open) + tab("status", "done", "Bajarildi", cnt.done) + tab("status", "all", "Hammasi", cnt.all) + '</div>' +
      '<div class="adm-utabs">' + tab("src", "all", "Hammasi", cnt.all) + tab("src", "izoh", "Izohlar", cnt.izoh) + tab("src", "xabar", "Xabarlar", cnt.xabar) + '</div>' +
      '<label class="adm-select adm-select--box"><select id="adm-nf-grade" aria-label="Sinf">' +
        '<option value="all">Barcha sinflar</option>' + Object.keys(grades).sort(function (a, b) { return a - b; }).map(function (g) {
          return '<option value="' + g + '"' + (noteFilter.grade === g ? " selected" : "") + '>' + g + '-sinf (' + grades[g] + ')</option>';
        }).join("") + '</select>' + ICONS.down + '</label>' +
    '</div>' +
    (xabarOff ? '<p class="adm-empty-line adm-warn">Saytdagi xabarlarni ko\'rish uchun Firebase qoidalarini yangilang.</p>' : "") +
    (items ? '<div class="adm-nlist">' + items + '</div>' : '<p class="adm-empty-line">Bu filtrga mos izoh yoki xabar yo\'q.</p>');

  el.querySelectorAll("[data-nf]").forEach(function (b) {
    b.addEventListener("click", function () { noteFilter[b.dataset.nf] = b.dataset.nv; renderNotesFull(); });
  });
  document.getElementById("adm-nf-grade").addEventListener("change", function (e) { noteFilter.grade = e.target.value; renderNotesFull(); });
  el.querySelectorAll("[data-ndone]").forEach(function (b) {
    b.addEventListener("click", function () { const n = NOTES.find(function (x) { return x.id === b.dataset.ndone; }); if (n) { b.disabled = true; noteToggle(n); } });
  });
  el.querySelectorAll("[data-ndel]").forEach(function (b) {
    b.addEventListener("click", function () { const n = NOTES.find(function (x) { return x.id === b.dataset.ndel; }); if (n) noteDelete(n); });
  });
  wireOpenButtons(el);
  const copyBtn = document.getElementById("adm-notes-copy2");
  if (copyBtn) copyBtn.addEventListener("click", function () { copyNotesForClaude(copyBtn); });
}

function wireOpenButtons(root) {
  root.querySelectorAll("[data-open-t]").forEach(function (b) {
    b.addEventListener("click", function () { openTopicPanel(b.dataset.openG, b.dataset.openS, b.dataset.openT); });
  });
}

// ---- Natijalar: umumiy sonlar va oxirgi urinishlar ----

function resultGroups() {
  const by = {};
  RESULTS.forEach(function (r) {
    const g = by[r.k] || (by[r.k] = { k: r.k, count: 0, n: 0, q: 0 });
    g.count++;
    if (r.s && r.s.length) { g.n += r.n; g.q += r.s.length; }
  });
  return Object.keys(by).map(function (k) { const g = by[k]; g.avg = g.q ? Math.round(g.n / g.q * 100) : null; return g; });
}

function renderResSum() {
  const el = document.getElementById("adm-res-sum");
  if (dbState !== "ok") {
    el.innerHTML = miniStats([["Natijalar", dbState === "loading" ? "…" : "—", dbState === "loading" ? "yuklanmoqda" : "baza ulanmagan", "card"]]);
    return;
  }
  let n = 0, q = 0;
  RESULTS.forEach(function (r) { if (r.s && r.s.length) { n += r.n; q += r.s.length; } });
  const weekAgo = Date.now() - 7 * 864e5;
  const week = RESULTS.filter(function (r) { return r.t && r.t.getTime() > weekAgo; }).length;
  const groups = resultGroups();
  const most = groups.slice().sort(function (a, b) { return b.count - a.count; })[0];
  const enough = groups.filter(function (g) { return g.avg != null && g.count >= 3; });
  const pool = enough.length ? enough : groups.filter(function (g) { return g.avg != null; });
  const low = pool.slice().sort(function (a, b) { return a.avg - b.avg; })[0];
  el.innerHTML = miniStats([
    ["Jami urinish", fmtNum(RESULTS.length), "oxirgi 7 kunda " + week, "mint"],
    ["O'rtacha natija", q ? pct(n, q) + "%" : "—", "barcha urinishlar bo'yicha", "sage"],
    ["Eng ko'p yechilgan", most ? most.count + " marta" : "—", most ? escapeHtml(resultLabel(most.k)) : "hali yo'q", "beige"],
    ["Eng past natija", low ? low.avg + "%" : "—", low ? escapeHtml(resultLabel(low.k)) + (enough.length ? "" : " · urinishlar kam") : "hali yo'q", "pink"]
  ]);
}

function renderResRecent() {
  const el = document.getElementById("adm-res-recent");
  const head = '<div class="adm-res-head"><h2>Oxirgi urinishlar</h2>';
  if (dbState !== "ok") { el.innerHTML = head + '</div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  const list = RESULTS.filter(function (r) { return r.t; }).sort(function (a, b) { return b.t - a.t; }).slice(0, 30);
  el.innerHTML = head + '<span class="muted">eng yangi ' + list.length + ' ta · ism-familiyasiz</span></div>' +
    (list.length
      ? '<div class="adm-scroll"><table class="adm-table adm-res-table adm-recent-table"><thead><tr><th>Vaqt</th><th>Test</th><th>To\'g\'ri</th><th>Foiz</th></tr></thead><tbody>' +
        list.map(function (r) {
          const base = String(r.k).replace(/\|qiyin$/, "");
          const t = topicByKey(base);
          const p = r.s && r.s.length ? pct(r.n, r.s.length) : null;
          return '<tr class="' + (t ? "adm-tr" : "adm-tr-static") + '"' + (t ? ' data-g="' + t.grade.id + '" data-s="' + t.subject.id + '" data-t="' + t.topic.id + '"' : "") + '>' +
            '<td class="adm-td-time">' + fmtDate(r.t) + '</td>' +
            '<td class="adm-td-title">' + escapeHtml(resultLabel(r.k)) + '</td>' +
            '<td>' + (r.s && r.s.length ? r.n + ' / ' + r.s.length : r.n) + '</td>' +
            '<td>' + (p == null ? "—" : '<b class="adm-rate--' + rateClass(p) + '">' + p + '%</b>') + '</td></tr>';
        }).join("") + '</tbody></table></div>'
      : '<p class="muted">Hali hech kim test yechmagan.</p>');
  el.querySelectorAll(".adm-tr").forEach(function (tr) {
    tr.addEventListener("click", function () { openTopicPanel(tr.dataset.g, tr.dataset.s, tr.dataset.t); });
  });
}

// ---- Foydalanuvchilar: sonlar va jadval ----

const usersView = { q: "", sort: "recent", open: {} };

function userStats(u) {
  const ks = Object.keys(u.r).filter(function (k) { return u.r[k] && typeof u.r[k].best === "number"; });
  const avg = ks.length ? Math.round(ks.reduce(function (s, k) { return s + u.r[k].best; }, 0) / ks.length) : null;
  const tries = ks.reduce(function (s, k) { return s + (u.r[k].count || 1); }, 0);
  return { ks: ks, avg: avg, tries: tries };
}

function renderUsersSum() {
  const el = document.getElementById("adm-users-sum");
  if (dbState !== "ok" || usersOff) {
    el.innerHTML = miniStats([["Foydalanuvchilar", dbState === "loading" ? "…" : "—", dbState === "loading" ? "yuklanmoqda" : usersOff ? "Firebase qoidalari yangilanmagan" : "baza ulanmagan", "card"]]);
    return;
  }
  const c = userCounts();
  const withTests = USERS.filter(function (u) { return userStats(u).ks.length; }).length;
  const weekAgo = Date.now() - 7 * 864e5;
  const active = USERS.filter(function (u) { return u.t && u.t.getTime() > weekAgo; }).length;
  el.innerHTML = miniStats([
    ["Jami", c.all, "Google bilan kirganlar", "mint"],
    ["O'quvchi", c.oquvchi, "", "sage"],
    ["Ustoz", c.ustoz, "", "beige"],
    ["Belgilanmagan", c.none, "", "sage"],
    ["Test yechgan", withTests, "kamida bitta test", "mint"],
    ["7 kunda faol", active, "oxirgi faollik bo'yicha", "pink"]
  ]);
}

function roleSelect(u) {
  return '<select class="adm-role-sel" data-uid="' + u.id + '" aria-label="Admin belgisi">' +
    '<option value="">— qo\'yilmagan —</option>' +
    '<option value="oquvchi"' + (u.arole === "oquvchi" ? " selected" : "") + '>O\'quvchi</option>' +
    '<option value="ustoz"' + (u.arole === "ustoz" ? " selected" : "") + '>Ustoz</option></select>';
}

function wireRoleSelects(root) {
  root.querySelectorAll(".adm-role-sel").forEach(function (sel) {
    sel.addEventListener("click", function (e) { e.stopPropagation(); });
    sel.addEventListener("change", function () {
      const u = USERS.find(function (x) { return x.id === sel.dataset.uid; });
      if (!u) return;
      const v = sel.value;
      sel.disabled = true;
      DB.collection("users").doc(u.id).update({ arole: v || firebase.firestore.FieldValue.delete() }).then(function () {
        u.arole = v;
        renderUsersSection(); renderStats();
      }).catch(function (e) {
        console.warn("Belgi qo'yilmadi:", e);
        alert("Belgi qo'yib bo'lmadi. Firestore qoidalari yangilanganini tekshiring (firestore.rules).");
        sel.disabled = false; sel.value = u.arole || "";
      });
    });
  });
}

function renderUsersFull() {
  const el = document.getElementById("adm-users-full");
  const head = '<div class="adm-res-head"><h2>Foydalanuvchilar ro\'yxati</h2>';
  if (dbState !== "ok") { el.innerHTML = head + '</div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  if (usersOff) {
    el.innerHTML = head + '</div><p class="adm-dboff">Ismli natijalarni ko\'rish uchun Firebase Console → Firestore → Rules ga <code>firestore.rules</code> dagi yangi matnni qo\'ying (<b>users</b> bo\'limida admin o\'qishi yoqilgan).</p>';
    return;
  }
  const cnt = userCounts();
  const tab = function (key, label) {
    return '<button type="button" class="adm-utab' + (usersFilter === key ? " active" : "") + '" data-f="' + key + '">' + label + ' <b>' + cnt[key] + '</b></button>';
  };
  const q = usersView.q.trim().toLowerCase();
  const rows = USERS.map(function (u) { const st = userStats(u); return { u: u, st: st, role: userRole(u) }; })
    .filter(function (r) { return usersFilter === "all" || (usersFilter === "none" ? !r.role : r.role === usersFilter); })
    .filter(function (r) { return !q || (r.u.name || "").toLowerCase().indexOf(q) !== -1; });
  rows.sort(function (a, b) {
    if (usersView.sort === "name") return (a.u.name || "").localeCompare(b.u.name || "");
    if (usersView.sort === "avg") return (b.st.avg == null ? -1 : b.st.avg) - (a.st.avg == null ? -1 : a.st.avg);
    if (usersView.sort === "tests") return b.st.ks.length - a.st.ks.length;
    return (b.u.t || 0) - (a.u.t || 0);
  });
  const body = rows.map(function (r) {
    const u = r.u;
    const open = !!usersView.open[u.id];
    const tests = r.st.ks.slice().sort(function (a, b) { return (u.r[b].t || 0) - (u.r[a].t || 0); }).map(function (k) {
      const x = u.r[k];
      return '<li><span>' + escapeHtml(resultLabel(k)) + '</span><b class="adm-rate--' + rateClass(x.best) + '">' + x.best + '%</b>' +
        '<small>oxirgisi ' + (x.last || 0) + '% · ' + (x.count || 1) + ' marta' + (x.t ? ' · ' + fmtDate(new Date(x.t)) : "") + '</small></li>';
    }).join("");
    return '<tr class="adm-tr adm-urow' + (open ? " is-open" : "") + '" data-uid="' + u.id + '" tabindex="0">' +
        '<td class="adm-td-title"><span class="adm-uava">' + escapeHtml((u.name || "?").charAt(0).toUpperCase()) + '</span><b>' + escapeHtml(u.name || "Ismsiz foydalanuvchi") + '</b></td>' +
        '<td><em class="adm-role adm-role--' + (r.role || "none") + '">' + (r.role ? ROLE_NAME[r.role] : "belgisiz") + (!u.arole && u.role ? ' <small>(o\'zi)</small>' : "") + '</em></td>' +
        '<td>' + roleSelect(u) + '</td>' +
        '<td>' + r.st.ks.length + (r.st.tries > r.st.ks.length ? ' <small class="muted">(' + r.st.tries + ' urinish)</small>' : "") + '</td>' +
        '<td>' + (r.st.avg == null ? '<span class="muted">—</span>' : '<b class="adm-rate--' + rateClass(r.st.avg) + '">' + r.st.avg + '%</b>') + '</td>' +
        '<td class="adm-td-time">' + fmtDateTime(u.t) + '</td>' +
      '</tr>' +
      '<tr class="adm-udetail"' + (open ? "" : " hidden") + '><td colspan="6">' +
        (tests ? '<ul class="adm-user-list">' + tests + '</ul>' : '<p class="muted adm-small">Hali test yechmagan.</p>') + '</td></tr>';
  }).join("");

  el.innerHTML = head + '<span class="muted">Email manzillar bazada saqlanmaydi — faqat Google\'dagi ism, rol va natijalar.</span></div>' +
    '<div class="adm-nfilters">' +
      '<div class="adm-utabs">' + tab("all", "Hammasi") + tab("oquvchi", "O'quvchilar") + tab("ustoz", "Ustozlar") + tab("none", "Belgilanmagan") + '</div>' +
      '<input type="search" class="adm-search" id="adm-u-q" placeholder="Ism bo\'yicha qidirish…" value="' + escapeHtml(usersView.q) + '" autocomplete="off">' +
      '<label class="adm-select adm-select--box"><select id="adm-u-sort" aria-label="Tartib">' +
        [["recent", "Oxirgi faollik"], ["name", "Ism bo'yicha"], ["avg", "O'rtacha natija"], ["tests", "Testlar soni"]].map(function (o) {
          return '<option value="' + o[0] + '"' + (usersView.sort === o[0] ? " selected" : "") + '>' + o[1] + '</option>';
        }).join("") + '</select>' + ICONS.down + '</label>' +
    '</div>' +
    (rows.length
      ? '<div class="adm-scroll"><table class="adm-table adm-res-table adm-users-table"><thead><tr><th>Ism</th><th>Rol</th><th>Admin belgisi</th><th>Testlar</th><th>O\'rtacha</th><th>Oxirgi faollik</th></tr></thead><tbody>' + body + '</tbody></table></div>'
      : '<p class="muted">' + (q ? "Bu ismga mos foydalanuvchi yo'q." : usersFilter === "all" ? "Hali hech kim Google bilan kirmagan." : "Bu toifada hech kim yo'q.") + '</p>');

  el.querySelectorAll(".adm-utab").forEach(function (b) {
    b.addEventListener("click", function () { usersFilter = b.dataset.f; renderUsersFull(); });
  });
  const qi = document.getElementById("adm-u-q");
  qi.addEventListener("input", function () {
    usersView.q = qi.value; const pos = qi.selectionStart; renderUsersFull();
    const n = document.getElementById("adm-u-q"); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {}
  });
  document.getElementById("adm-u-sort").addEventListener("change", function (e) { usersView.sort = e.target.value; renderUsersFull(); });
  el.querySelectorAll(".adm-urow").forEach(function (tr) {
    const toggle = function () { usersView.open[tr.dataset.uid] = !usersView.open[tr.dataset.uid]; renderUsersFull(); };
    tr.addEventListener("click", toggle);
    tr.addEventListener("keydown", function (e) { if (e.key === "Enter") toggle(); });
  });
  wireRoleSelects(el);
}
