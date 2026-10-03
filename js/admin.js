// Admin panel: umumiy statistika, sinf bo'yicha kontent holati va fayl yuklash ko'rsatmalari.

const UPLOAD_TYPE_INFO = {
  lecture: { label: "Ma'ruza", folder: "presentations/", field: "lecture.embedUrl", hint: "Prezentatsiya yoki PDF fayl" },
  interactive: { label: "Ko'rgazma", folder: "lessons/", field: "interactive", hint: "Interaktiv HTML fayl" },
  test: { label: "Test", folder: "lessons/", field: "test", hint: "Test HTML fayli" }
};

const FILTERS = [
  { id: "all", label: "Hammasi" },
  { id: "no-interactive", label: "Ko'rgazmasi yo'q" },
  { id: "no-test", label: "Testi yo'q" }
];

let activeGradeId = null;
let activeFilter = "all";
let activeUploadTarget = null;

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

function renderStats() {
  let topics = 0, interactive = 0, test = 0;
  SITE_DATA.grades.forEach(function (g) {
    const s = gradeSummary(g);
    topics += s.topics; interactive += s.interactive; test += s.test;
  });
  const el = document.getElementById("adm-stats");
  const base =
    statCard(SITE_DATA.grades.length, "Sinflar", "5–11 sinf") +
    statCard(topics, "Mavzular", "5–11 sinf") +
    statCard(interactive, "Ko'rgazmalar", Math.round(interactive / topics * 100) + "% mavzuda", "teal") +
    statCard(test, "Testlar", Math.round(test / topics * 100) + "% mavzuda", "teal");
  el.innerHTML = base + statCard("…", "Boshlang'ich sinflar", "1–4 sinf", "green");

  // 1–4 sinf ma'lumoti bo'lim faylidan olinadi
  fetch("mathrunner-web/data/curriculum.json")
    .then(function (r) { return r.json(); })
    .then(function (cur) {
      let t = 0, l = 0;
      cur.grades.forEach(function (g) { l += g.levelCount; g.choraks.forEach(function (c) { t += c.blocks.length; }); });
      el.innerHTML = base + statCard(t + " / " + l, "Boshlang'ich sinflar", "mavzu / dars (1–4 sinf)", "green");
    })
    .catch(function () {});
}

// ---------- sinflar ro'yxati (chap tomonda) ----------

function renderGradeList() {
  const el = document.getElementById("adm-grade-list");
  el.innerHTML = SITE_DATA.grades.map(function (grade) {
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
      renderGradeList();
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
  el.innerHTML = FILTERS.map(function (f) {
    return '<button type="button" class="adm-filter-btn' + (f.id === activeFilter ? " active" : "") + '" data-filter="' + f.id + '">' + f.label + '</button>';
  }).join("");
  el.querySelectorAll(".adm-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeFilter = btn.dataset.filter;
      renderFilter();
      renderTopics();
    });
  });
}

function renderTopics() {
  const grade = findGrade(activeGradeId);
  const s = gradeSummary(grade);
  document.getElementById("adm-main-title").textContent = grade.name;
  document.getElementById("adm-progress").innerHTML =
    s.topics + " mavzu · " + s.interactive + " ta ko'rgazma · " + s.test + " ta test";

  const el = document.getElementById("adm-topics");
  let shown = 0;
  el.innerHTML = grade.subjects.map(function (subject) {
    const rows = subject.topics.map(function (topic, i) {
      const st = topicStatus(grade, subject, topic);
      if (activeFilter === "no-interactive" && st.interactive.state === "ok") return "";
      if (activeFilter === "no-test" && st.test.state === "ok") return "";
      shown++;
      const parts = splitTopicTitle(topic.title, i);
      return (
        '<li class="adm-row">' +
          '<span class="adm-row-num">' + parts.num + '</span>' +
          '<span class="adm-row-body">' +
            '<a class="adm-row-title" href="' + topicHref(grade.id, subject.id, topic.id) + '" target="_blank" rel="noopener">' + parts.title + '</a>' +
            '<span class="adm-row-pills">' + pill("Ma'ruza", st.lecture) + pill("Ko'rgazma", st.interactive) + pill("Test", st.test) + '</span>' +
          '</span>' +
          '<button type="button" class="adm-upload-btn" data-subject="' + subject.id + '" data-topic="' + topic.id + '">⬆ Yuklash</button>' +
        '</li>'
      );
    }).join("");
    if (!rows) return "";
    return (
      '<div class="adm-subject">' +
        (grade.subjects.length > 1 ? '<div class="adm-subject-name">' + subject.name + '</div>' : "") +
        '<ol class="adm-list">' + rows + '</ol>' +
      '</div>'
    );
  }).join("");

  if (!shown) el.innerHTML = '<div class="adm-empty">🎉 Bu sinfda filtrga mos mavzu yo\'q — hammasi tayyor.</div>';

  el.querySelectorAll(".adm-upload-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const topic = findTopic(findSubject(grade, btn.dataset.subject), btn.dataset.topic);
      // birinchi yetishmayotgan turni oldindan tanlab ochish
      const st = topicStatus(grade, findSubject(grade, btn.dataset.subject), topic);
      const type = st.interactive.state !== "ok" ? "interactive" : st.test.state !== "ok" ? "test" : "lecture";
      openUpload(grade.id, btn.dataset.subject, btn.dataset.topic, type);
    });
  });
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

function showUploadResult(file) {
  if (!file || !activeUploadTarget) return;
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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeUpload(); });
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
  activeGradeId = SITE_DATA.grades[0].id;
  renderStats();
  renderGradeList();
  renderFilter();
  renderTopics();
  wireUpload();
}
