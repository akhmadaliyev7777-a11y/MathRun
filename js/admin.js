// Admin panel: «Bugungi ish», sinf bo'yicha kontent jadvali (filtr, qidiruv), mavzu yon oynasi va fayl joylash ko'rsatmalari.

const UPLOAD_TYPE_INFO = {
  lecture: { label: "Ma'ruza", folder: "presentations/", field: "lecture.embedUrl", hint: "Prezentatsiya yoki PDF fayl" },
  interactive: { label: "Ko'rgazma", folder: "lessons/", field: "interactive", hint: "Interaktiv HTML fayl" },
  test: { label: "Test", folder: "lessons/", field: "test", hint: "Test HTML fayli" }
};

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
  const quizCount = (QUIZ_DATA[grade.id + "|" + subject.id + "|" + topic.id] || []).length;
  return {
    lecture: lecture,
    interactive: topic.interactive ? { state: "ok", text: "bor" } : { state: "none", text: "yo'q" },
    test: quizCount > 0 ? { state: "ok", text: quizCount + " savol" }
      : topic.test ? { state: "ok", text: "bor" } : { state: "none", text: "yo'q" }
  };
}

function hasOwnQuiz(grade, subject, topic) {
  return (QUIZ_DATA[grade.id + "|" + subject.id + "|" + topic.id] || []).length > 0;
}

function reviewState(topic) {
  if (topic.review === "sariq") return "sariq";
  return topic.review ? "qizil" : null;
}

function matchesFilter(grade, subject, topic, filter) {
  const st = topicStatus(grade, subject, topic);
  if (filter === "no-lecture") return st.lecture.state !== "ok";
  if (filter === "no-interactive") return st.interactive.state !== "ok";
  if (filter === "no-test") return st.test.state !== "ok";
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
      if (st.test.state === "ok") test++;
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
    '</div>' +
    '<div class="adm-totals">' + line + '</div>';
  el.querySelectorAll(".adm-today-item").forEach(function (b) {
    b.addEventListener("click", function () { openTopicPanel(b.dataset.g, b.dataset.s, b.dataset.t); });
  });
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
            ? '<a class="adm-row-title" href="mathrunner-web/index.html#/play/' + first.id + '" target="_blank" rel="noopener">' + primaryTitle(g, c, b) + '</a>'
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
  if (st.state === "ok") return '<span class="adm-cell adm-cell--ok" title="' + label + ': ' + st.text + '">' + (/savol/.test(st.text) ? parseInt(st.text, 10) : "✓") + '</span>';
  if (st.state === "part") return '<span class="adm-cell adm-cell--part" title="' + label + ': ' + st.text + '">' + st.text + '</span>';
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
  const quiz = QUIZ_DATA[grade.id + "|" + subject.id + "|" + topic.id] || [];
  const r = reviewState(topic);
  const lectureUrl = topic.lecture && topic.lecture.embedUrl;

  const statusRow = function (label, s) {
    return '<div class="adm-pstat"><span>' + label + '</span>' + cell(s, label) + '<span class="muted">' + (s.state === "ok" ? s.text : s.state === "part" ? s.text : "yo'q") + '</span></div>';
  };

  const quizHtml = quiz.length
    ? '<ol class="adm-quiz">' + quiz.map(function (qq) {
        return '<li><div class="adm-q">' + escapeHtml(qq.question) + '</div>' +
          '<div class="adm-opts">' + (qq.options || []).map(function (o) {
            return '<span class="adm-opt' + (String(o) === String(qq.answer) ? " adm-opt--ok" : "") + '">' + escapeHtml(o) + '</span>';
          }).join("") + '</div>' +
          (qq.explain ? '<div class="adm-explain">' + escapeHtml(qq.explain) + '</div>' : "") + '</li>';
      }).join("") + '</ol>'
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
    '<div class="adm-psec"><h4>Holati</h4>' + statusRow("Ma'ruza", st.lecture) + statusRow("Ko'rgazma", st.interactive) + statusRow("Test", st.test) + '</div>' +
    (topic.simPlan ? '<details class="adm-psec"><summary><h4>Ko\'rgazma rejasi</h4></summary><p class="adm-ptext">' + escapeHtml(topic.simPlan) + '</p></details>' : "") +
    '<details class="adm-psec"' + (quiz.length ? "" : " open") + '><summary><h4>Test savollari' + (quiz.length ? " (" + quiz.length + ")" : "") + '</h4></summary>' + quizHtml + '</details>' +
    '<div class="adm-psec adm-pfoot"><button type="button" class="adm-upload-btn" id="adm-panel-upload">⬆ Fayl joylash ko\'rsatmasi</button></div>';

  document.getElementById("adm-panel-upload").addEventListener("click", function () {
    const type = st.interactive.state !== "ok" ? "interactive" : st.test.state !== "ok" ? "test" : "lecture";
    openUpload(grade.id, subject.id, topic.id, type);
  });
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

function openUpload(gradeId, subjectId, topicId, type) {
  const grade = findGrade(gradeId);
  const subject = findSubject(grade, subjectId);
  const topic = findTopic(subject, topicId);
  activeUploadTarget = { gradeId: gradeId, subjectId: subjectId, topicId: topicId, type: type };

  document.getElementById("adm-modal-kicker").textContent = grade.name + " · " + subject.name;
  document.getElementById("adm-modal-title").textContent = topic.title;

  const tabs = document.getElementById("adm-type-tabs");
  tabs.innerHTML = Object.keys(UPLOAD_TYPE_INFO).map(function (t) {
    return '<button type="button" class="adm-type-tab' + (t === type ? " active" : "") + '" data-type="' + t + '">' + UPLOAD_TYPE_INFO[t].label + '</button>';
  }).join("");
  tabs.querySelectorAll(".adm-type-tab").forEach(function (b) {
    b.addEventListener("click", function () { openUpload(gradeId, subjectId, topicId, b.dataset.type); });
  });

  document.getElementById("adm-drop-hint").textContent = UPLOAD_TYPE_INFO[type].hint + " → " + UPLOAD_TYPE_INFO[type].folder + " papkasiga";
  document.getElementById("adm-file").value = "";
  const res = document.getElementById("adm-result");
  res.hidden = true;
  res.innerHTML = "";
  document.getElementById("adm-modal").hidden = false;
}

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

// fayl tanlangach — uni saytga ulash uchun qadamma-qadam ko'rsatma
function uploadSteps(target, filename) {
  const info = UPLOAD_TYPE_INFO[target.type];
  const grade = findGrade(target.gradeId);
  const subject = findSubject(grade, target.subjectId);
  const topic = findTopic(subject, target.topicId);
  const path = info.folder + filename;

  if (target.type === "lecture" && topic.sections && topic.sections.length > 0) {
    return {
      steps: [
        "Bu mavzu " + topic.sections.length + " ta mavzuchaga bo'lingan — yagona fayl o'rniga har bir mavzuchaga matn yoziladi.",
        "<code>js/data.js</code> faylida <b>" + topic.title + "</b> mavzusini toping.",
        "<code>sections</code> ro'yxatidagi har bir mavzuchaning <code>text</code> maydoniga ma'ruza matnini yozing."
      ],
      copy: null
    };
  }
  const code = info.field === "lecture.embedUrl"
    ? 'lecture: { embedUrl: "' + path + '" }'
    : info.field + ': "' + path + '"';
  const steps = [
    "Faylni loyihadagi <code>" + info.folder + "</code> papkasiga <code>" + filename + "</code> nomi bilan joylang.",
    "<code>js/data.js</code> faylida <b>" + grade.name + " → " + subject.name + " → " + topic.title + "</b> mavzusini toping.",
    "Mavzuga quyidagi qatorni yozing (nusxalash tugmasi bilan):"
  ];
  const note = target.type === "test" ? "Yoki savollarni <code>js/quizzes.js</code> ga qo'shsangiz, test avtomatik paydo bo'ladi." : null;
  return { steps: steps, copy: code, note: note };
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
  if (activeUploadTarget.primary) return showPrimaryUploadResult(file);
  const r = uploadSteps(activeUploadTarget, file.name);
  const res = document.getElementById("adm-result");
  res.hidden = false;
  res.innerHTML =
    '<div class="adm-file">📎 ' + file.name + ' <span class="muted">· ' + Math.max(1, Math.round(file.size / 1024)) + ' KB</span></div>' +
    '<ol class="adm-steps">' + r.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + '</ol>' +
    (r.copy ? '<div class="adm-code"><code>' + r.copy + '</code><button type="button" class="adm-copy">Nusxalash</button></div>' : "") +
    (r.note ? '<p class="adm-note">' + r.note + '</p>' : "");
  const copyBtn = res.querySelector(".adm-copy");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(r.copy).then(function () {
      copyBtn.textContent = "Nusxalandi ✓";
      setTimeout(function () { copyBtn.textContent = "Nusxalash"; }, 1500);
    });
  });
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

  // 1–4 sinflar ma'lumotini yuklab, ro'yxat va statistikani yangilash
  Promise.all([
    fetch("mathrunner-web/data/curriculum.json").then(function (r) { return r.json(); }),
    import("../mathrunner-web/js/topicTitles.js").then(function (m) { return m.TOPIC_TITLES; }).catch(function () { return {}; })
  ]).then(function (res) {
    PRIMARY = res[0];
    PRIMARY_TITLES = res[1];
    renderStats();
    renderGradeList();
  }).catch(function () {
    document.querySelector(".adm-side-loading") && (document.querySelector(".adm-side-loading").textContent = "1–4 sinf ma'lumotini yuklab bo'lmadi");
  });
}
