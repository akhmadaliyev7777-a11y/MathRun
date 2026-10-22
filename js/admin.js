// Admin panel: «Bugungi ish», sinf bo'yicha kontent jadvali (filtr, qidiruv), mavzu yon oynasi,
// izohlar (Claude uchun eslatmalar) va o'quvchilarning nomsiz test natijalari (Firebase Firestore).

const FILTERS = [
  { id: "all", label: "Hammasi" },
  { id: "no-lecture", label: "Ma'ruzasi yo'q" },
  { id: "no-interactive", label: "Ko'rgazmasi yo'q" },
  { id: "no-test", label: "Testi yo'q" },
  { id: "review", label: "Tekshiruv kutilmoqda" }
];

// 5-sinf boblari: bob boshlanadigan mavzu raqami va nomi (mavzular ro'yxati shu boblarga guruhlanadi)
const CHAPTERS = {
  "5|matematika": [
    [1, "Natural sonlar"], [2, "Sonlar ustida to'rt amal"], [5, "Oddiy kasrlar"], [12, "Uchburchakning yuzi"],
    [15, "Hajm"], [21, "Nisbatlar"], [26, "O'nli kasrlar"], [29, "Me'yor"], [32, "Foizlar"],
    [36, "O'rtacha qiymat"], [38, "Burchaklar"], [42, "Uchburchakning xossalari"], [45, "Parallelogramm, romb va trapetsiya"]
  ]
};
const FOCUS_GRADE = "5";       // hozir ustida ishlanayotgan sinf («Bugungi ish» shu sinf bo'yicha)

let activeGradeId = null;      // 5–11: "5".."11", 1–4: "p1".."p4"
let activeFilter = "all";
let searchText = "";
let activeChorak = 1;          // 1–4 sinflar uchun
let activeUploadTarget = null;
let panelTopic = null;         // yon oynada ochiq mavzu

// Firebase ma'lumotlar bazasi: izohlar va o'quvchilar natijalari
let DB = null;
let dbState = "loading";       // "loading" | "ok" | "off" (baza yoqilmagan yoki ruxsat yo'q)
let NOTES = [];                // { id, src: "izoh" | "xabar", k, title, text, bolim, ism, done, t } — izohlar (admin) va saytdagi xabarlar
let xabarOff = false;          // "xabarlar" to'plamiga ruxsat yo'q (qoidalar yangilanmagan)
const BOLIM_NAMES = { maruza: "Nazariya", interaktiv: "Interaktiv panel", test: "Test" };
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

// ---------- statistika ----------

function statCard(value, label, sub, accent) {
  return (
    '<div class="adm-stat' + (accent ? " adm-stat--" + accent : "") + '">' +
      '<div class="adm-stat-value">' + value + '</div>' +
      '<div class="adm-stat-label">' + label + '</div>' +
      (sub ? '<div class="adm-stat-sub">' + sub + '</div>' : "") +
    '</div>'
  );
}

function todayItem(t, extra) {
  const parts = splitTopicTitle(t.topic.title, t.index);
  return '<button type="button" class="adm-today-item" data-g="' + t.grade.id + '" data-s="' + t.subject.id + '" data-t="' + t.topic.id + '">' +
    '<span class="adm-today-num">' + (t.grade.id !== FOCUS_GRADE ? t.grade.id + "-sinf · " : "") + parts.num + '</span>' +
    '<span class="adm-today-name">' + escapeHtml(parts.title) + '</span>' + (extra || "") + '</button>';
}

function todayCard(icon, title, count, body, accent) {
  return '<div class="adm-today-card' + (accent ? " adm-today-card--" + accent : "") + '">' +
    '<div class="adm-today-head"><span class="adm-today-icon">' + icon + '</span><b>' + title + '</b>' +
    (count != null ? '<span class="adm-today-count">' + count + '</span>' : "") + '</div>' +
    '<div class="adm-today-list">' + body + '</div></div>';
}

function renderStats() {
  const all = allTopics();
  const focus = all.filter(function (t) { return t.grade.id === FOCUS_GRADE; });

  // 1) navbatdagi mavzu — 5-sinfda ma'ruzasi hali yo'q birinchi mavzu
  const next = focus.find(function (t) { return topicStatus(t.grade, t.subject, t.topic).lecture.state !== "ok"; });
  const left = focus.filter(function (t) { return topicStatus(t.grade, t.subject, t.topic).lecture.state !== "ok"; }).length;
  const nextBody = next
    ? todayItem(next) + '<div class="adm-today-sub">' + FOCUS_GRADE + '-sinfda yana ' + left + ' ta mavzuning ma\'ruzasi yozilmagan</div>'
    : '<div class="adm-today-sub">🎉 ' + FOCUS_GRADE + '-sinfning barcha ma\'ruzalari tayyor</div>';

  // 2) tekshiruvingiz kutilmoqda — qizil (tekshirilmagan) avval, keyin sariq (tasdiq kutilmoqda)
  const rev = all.filter(function (t) { return reviewState(t.topic); })
    .sort(function (a, b) { return (reviewState(a.topic) === "qizil" ? 0 : 1) - (reviewState(b.topic) === "qizil" ? 0 : 1); });
  const revBody = rev.length
    ? rev.map(function (t) {
        const r = reviewState(t.topic);
        return todayItem(t, '<span class="adm-rev adm-rev--' + r + '" title="' + (r === "qizil" ? "Tekshirilmagan" : "Tuzatildi, tasdiq kutilmoqda") + '"></span>');
      }).join("")
    : '<div class="adm-today-sub">Hammasi tasdiqlangan ✓</div>';

  // 3) ma'ruzasi bor, lekin o'z testi yo'q mavzular
  const noQuiz = all.filter(function (t) {
    return topicStatus(t.grade, t.subject, t.topic).lecture.state === "ok" && t.topic.lecture && t.topic.lecture.embedUrl &&
      !hasOwnQuiz(t.grade, t.subject, t.topic);
  });
  const quizBody = noQuiz.length ? noQuiz.map(function (t) { return todayItem(t); }).join("") : '<div class="adm-today-sub">Hammasida test bor ✓</div>';

  // umumiy sonlar — bitta ixcham qatorda
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

  const el = document.getElementById("adm-stats");
  el.innerHTML =
    '<div class="adm-today">' +
      todayCard("➡️", "Navbatdagi mavzu", null, nextBody, "next") +
      todayCard("👀", "Tekshiruvingiz kutilmoqda", rev.length, revBody, "review") +
      todayCard("📝", "O'z testi yo'q", noQuiz.length, quizBody) +
      notesCard() +
    '</div>' +
    '<div class="adm-totals">' + line + '</div>';
  el.querySelectorAll(".adm-today-item").forEach(function (b) {
    b.addEventListener("click", function () { openTopicPanel(b.dataset.g, b.dataset.s, b.dataset.t); });
  });
  const copyBtn = document.getElementById("adm-notes-copy");
  if (copyBtn) copyBtn.addEventListener("click", function () { copyNotesForClaude(copyBtn); });
}

// ---------- sinflar ro'yxati (chap tomonda) ----------

function primaryGradeButtons() {
  if (!PRIMARY) return '<div class="adm-side-loading muted">Yuklanmoqda…</div>';
  return PRIMARY.grades.map(function (g) {
    const s = primarySummary(g);
    const pct = s.lessons ? Math.round((s.lessons - s.soon) / s.lessons * 100) : 0;
    const id = "p" + g.grade;
    return (
      '<button type="button" class="adm-grade adm-grade--primary' + (id === activeGradeId ? " active" : "") + '" data-grade="' + id + '">' +
        '<span class="adm-grade-num">' + g.grade + '</span>' +
        '<span class="adm-grade-body">' +
          '<span class="adm-grade-name">' + g.grade + '-sinf</span>' +
          '<span class="adm-grade-meta">' + s.topics + ' mavzu · ' + s.lessons + ' dars</span>' +
          '<span class="adm-bar"><i style="width:' + pct + '%"></i></span>' +
        '</span>' +
      '</button>'
    );
  }).join("");
}

function renderGradeList() {
  const el = document.getElementById("adm-grade-list");
  el.innerHTML =
    '<div class="adm-group-label">Boshlang\'ich (1–4)</div>' + primaryGradeButtons() +
    '<div class="adm-group-label">5–11 sinflar</div>' +
    SITE_DATA.grades.map(function (grade) {
    const s = gradeSummary(grade);
    const pct = s.topics ? Math.round((s.interactive + s.test) / (s.topics * 2) * 100) : 0;
    return (
      '<button type="button" class="adm-grade' + (grade.id === activeGradeId ? " active" : "") + '" data-grade="' + grade.id + '">' +
        '<span class="adm-grade-num">' + grade.id + '</span>' +
        '<span class="adm-grade-body">' +
          '<span class="adm-grade-name">' + grade.name + '</span>' +
          '<span class="adm-grade-meta">' + s.topics + ' mavzu · ' + pct + '% tayyor</span>' +
          '<span class="adm-bar"><i style="width:' + pct + '%"></i></span>' +
        '</span>' +
      '</button>'
    );
  }).join("");

  el.querySelectorAll(".adm-grade").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeGradeId = btn.dataset.grade;
      activeFilter = "all";
      searchText = "";
      document.getElementById("adm-search").value = "";
      renderGradeList();
      renderFilter();
      renderTopics();
    });
  });
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
    if (f.id === "review" && !n) return "";
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
  if (isPrimary(activeGradeId)) return renderPrimaryTopics();
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
  el.innerHTML = topicGroups(grade).map(function (g) {
    let done = 0;
    const rows = g.items.map(function (it) {
      const topic = it.topic;
      const st = topicStatus(grade, g.subject, topic);
      if (st.lecture.state === "ok") done++;
      if (!matchesFilter(grade, g.subject, topic, activeFilter)) return "";
      if (q && topic.title.toLowerCase().indexOf(q) === -1) return "";
      shown++;
      const parts = splitTopicTitle(topic.title, it.index);
      const r = reviewState(topic);
      return (
        '<tr class="adm-tr" tabindex="0" data-s="' + g.subject.id + '" data-t="' + topic.id + '">' +
          '<td class="adm-td-num">' + parts.num + '</td>' +
          '<td class="adm-td-title">' + escapeHtml(parts.title) +
            (r ? ' <span class="adm-rev adm-rev--' + r + '" title="' + (r === "qizil" ? "Tekshirilmagan" : "Tasdiq kutilmoqda") + '"></span>' : "") + '</td>' +
          '<td>' + cell(st.lecture, "Ma'ruza") + '</td>' +
          '<td>' + cell(st.interactive, "Ko'rgazma") + '</td>' +
          '<td>' + cell(st.test, "Test") + '</td>' +
        '</tr>'
      );
    }).join("");
    if (!rows) return "";
    return (
      '<details class="adm-group" open>' +
        '<summary><span>' + escapeHtml(g.name) + '</span><span class="adm-group-meta">ma\'ruza ' + done + '/' + g.items.length + '</span></summary>' +
        '<table class="adm-table"><thead><tr><th>№</th><th>Mavzu</th><th>Ma\'ruza</th><th>Ko\'rgazma</th><th>Test</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>' +
      '</details>'
    );
  }).join("");

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
  activeGradeId = FOCUS_GRADE;
  renderStats();
  renderGradeList();
  renderFilter();
  renderTopics();
  wireUpload();
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
      return { id: d.id, name: (x.name || "").trim(), r: r, t: x.t && x.t.toDate ? x.t.toDate() : null };
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

function renderUsersSection() {
  const el = document.getElementById("adm-users");
  if (!el) return;
  const head = '<div class="adm-res-head"><h2>👤 Kirgan o\'quvchilar</h2>';
  if (dbState !== "ok") { el.innerHTML = head + '</div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText()); return; }
  if (usersOff) {
    el.innerHTML = head + '</div><p class="adm-dboff">Ismli natijalarni ko\'rish uchun Firebase Console → Firestore → Rules ga <code>firestore.rules</code> dagi yangi matnni qo\'ying (<b>users</b> bo\'limida admin o\'qishi yoqilgan).</p>';
    return;
  }
  const rows = USERS.map(function (u) {
    const ks = Object.keys(u.r).filter(function (k) { return u.r[k] && typeof u.r[k].best === "number"; });
    const avg = ks.length ? Math.round(ks.reduce(function (s, k) { return s + u.r[k].best; }, 0) / ks.length) : null;
    return { u: u, ks: ks, avg: avg };
  });
  const withTests = rows.filter(function (r) { return r.ks.length; }).length;
  el.innerHTML = head + '<span class="muted">Jami <b>' + rows.length + '</b> ta o\'quvchi kirgan · test yechgan: <b>' + withTests + '</b></span></div>' +
    (rows.length
      ? '<div class="adm-users">' + rows.map(function (r) {
          const list = r.ks.sort(function (a, b) { return (r.u.r[b].t || 0) - (r.u.r[a].t || 0); }).map(function (k) {
            const x = r.u.r[k];
            return '<li><span>' + escapeHtml(resultLabel(k)) + '</span><b class="adm-rate--' + rateClass(x.best) + '">' + x.best + '%</b>' +
              '<small>oxirgisi ' + (x.last || 0) + '% · ' + (x.count || 1) + ' marta' + (x.t ? ' · ' + fmtDate(new Date(x.t)).split(" ")[0] : "") + '</small></li>';
          }).join("");
          return '<details class="adm-user"><summary><b>' + escapeHtml(r.u.name || "Ismsiz foydalanuvchi") + '</b>' +
            '<span>' + (r.ks.length ? r.ks.length + ' ta test · o\'rtacha <b class="adm-rate--' + rateClass(r.avg) + '">' + r.avg + '%</b>' : "test yechmagan") + '</span>' +
            '<small>' + (r.u.t ? fmtDate(r.u.t) : "") + '</small></summary>' +
            (list ? '<ul class="adm-user-list">' + list + '</ul>' : '<p class="muted adm-small">Hali test yechmagan.</p>') + '</details>';
        }).join("") + '</div>'
      : '<p class="muted">Hali hech kim Google bilan kirmagan.</p>');
}

// ---------- izohlar ----------

function openNotes() { return NOTES.filter(function (n) { return !n.done; }); }

function notesCard() {
  let body;
  if (dbState === "loading") body = '<div class="adm-today-sub">Yuklanmoqda…</div>';
  else if (dbState === "off") body = '<div class="adm-today-sub">Baza ulanmagan</div>';
  else {
    const open = openNotes();
    body = open.length
      ? open.map(function (n) {
          const t = topicByKey(n.k);
          return t ? todayItem(t, "").replace('</span></button>', '</span><span class="adm-today-note">' + noteSource(n) + escapeHtml(n.text) + '</span></button>') : "";
        }).join("") +
        '<button type="button" class="adm-mini-btn" id="adm-notes-copy">📋 Claude uchun nusxalash</button>'
      : '<div class="adm-today-sub">Ochiq izoh yoki xabar yo\'q.</div>';
    if (xabarOff) body += '<div class="adm-today-sub adm-warn">Saytdagi xabarlarni ko\'rish uchun Firebase qoidalarini yangilang.</div>';
  }
  return todayCard("💬", "Izohlar va xabarlar", dbState === "ok" ? openNotes().length : null, body, "notes");
}

// izoh yoki xabar kimdan va qaysi bo'limdan kelgani (qisqa belgi)
function noteSource(n) {
  if (n.src !== "xabar") return "";
  return '<span class="adm-src">👤 ' + escapeHtml(n.ism || "Saytdan") + (BOLIM_NAMES[n.bolim] ? " · " + BOLIM_NAMES[n.bolim] : "") + '</span> ';
}

function copyNotesForClaude(btn) {
  const lines = openNotes().map(function (n) {
    const t = topicByKey(n.k);
    const where = (t ? t.grade.id + "-sinf, " + t.topic.title : n.title) + (n.src === "xabar" && BOLIM_NAMES[n.bolim] ? " (" + BOLIM_NAMES[n.bolim] + ")" : "");
    return "- " + where + ": " + n.text + (n.src === "xabar" ? " [saytdan" + (n.ism ? ", " + n.ism : "") + "]" : "");
  });
  const text = "Admin paneldagi izohlar va saytdan kelgan xabarlar (tekshirib, tuzatib bering):\n" + lines.join("\n");
  navigator.clipboard.writeText(text).then(function () {
    btn.textContent = "Nusxalandi ✓ — Claude'ga joylang";
    setTimeout(function () { btn.textContent = "📋 Claude uchun nusxalash"; }, 2500);
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
    return fetch("mathrunner-web/data/" + info.l.bank + "?v=3").then(function (r) { return r.json(); })
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
    el.innerHTML = '<div class="adm-res-head"><h2>📊 O\'quvchilar natijalari</h2></div>' + (dbState === "loading" ? '<p class="muted">Yuklanmoqda…</p>' : dbOffText());
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
    '<div class="adm-res-head"><h2>📊 O\'quvchilar natijalari</h2>' +
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
