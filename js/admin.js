const UPLOAD_TYPE_INFO = {
  lecture: { label: "Ma'ruza", folder: "presentations/", field: "lecture.embedUrl" },
  interactive: { label: "Taqdimot / ko'rgazma", folder: "lessons/", field: "interactive" },
  test: { label: "Test", folder: "lessons/", field: "test" }
};

let activeGradeId = null;
let activeUploadTarget = null;

function computeAdminStats() {
  let gradeCount = 0, topicCount = 0, quizCount = 0, interactiveCount = 0;
  SITE_DATA.grades.forEach(function (grade) {
    gradeCount++;
    grade.subjects.forEach(function (subject) {
      subject.topics.forEach(function (topic) {
        topicCount++;
        if (topic.interactive) interactiveCount++;
        const key = grade.id + "|" + subject.id + "|" + topic.id;
        if (QUIZ_DATA[key] && QUIZ_DATA[key].length > 0) quizCount++;
      });
    });
  });
  return { gradeCount, topicCount, quizCount, interactiveCount };
}

function renderStatGrid() {
  const stats = computeAdminStats();
  const el = document.getElementById("stat-grid");
  el.innerHTML =
    statCard(stats.gradeCount, "Sinflar") +
    statCard(stats.topicCount, "Jami mavzular") +
    statCard(stats.interactiveCount, "Interaktiv ko'rgazmalar") +
    statCard(stats.quizCount, "Tayyor testlar") +
    statCard("—", "O'quvchilar", true) +
    statCard("—", "O'rtacha o'zlashtirish", true);
}

function statCard(value, label, soon) {
  return (
    '<div class="stat-card' + (soon ? " stat-card-soon" : "") + '">' +
      '<div class="stat-value">' + value + '</div>' +
      '<div class="stat-label">' + label + (soon ? ' <span class="stat-soon-badge">tez orada</span>' : "") + '</div>' +
    '</div>'
  );
}

function renderAdminContentTable() {
  const el = document.getElementById("admin-table");
  let rows = "";
  SITE_DATA.grades.forEach(function (grade) {
    grade.subjects.forEach(function (subject) {
      subject.topics.forEach(function (topic) {
        const quizKey = grade.id + "|" + subject.id + "|" + topic.id;
        const quizCount = (QUIZ_DATA[quizKey] || []).length;

        let lectureCell = "—";
        if (topic.sections && topic.sections.length > 0) {
          const filled = topic.sections.filter(function (s) { return !!s.text; }).length;
          lectureCell = (filled === topic.sections.length ? "✅ " : "🟡 ") + filled + "/" + topic.sections.length;
        } else if (topic.lecture && topic.lecture.text) {
          lectureCell = "✅";
        }

        rows +=
          "<tr>" +
            "<td>" + grade.name + "</td>" +
            "<td>" + subject.name + "</td>" +
            "<td>" + topic.title + "</td>" +
            "<td>" + lectureCell + "</td>" +
            "<td>" + (topic.interactive ? "✅" : "—") + "</td>" +
            "<td>" + (quizCount > 0 ? "✅ (" + quizCount + " ta)" : "—") + "</td>" +
          "</tr>";
      });
    });
  });
  el.innerHTML =
    '<table class="admin-table">' +
      "<thead><tr><th>Sinf</th><th>Fan</th><th>Mavzu</th><th>Ma'ruza</th><th>Ko'rgazma</th><th>Test</th></tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
    "</table>";
}

// ---------- Yuklash: sinf -> mavzu -> tur ----------

function renderGradePicker() {
  const el = document.getElementById("grade-picker");
  el.innerHTML = SITE_DATA.grades.map(function (grade) {
    const activeCls = grade.id === activeGradeId ? " active" : "";
    return '<button type="button" class="grade-chip' + activeCls + '" data-grade="' + grade.id + '">' + grade.name + "</button>";
  }).join("");

  el.querySelectorAll(".grade-chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeGradeId = btn.dataset.grade;
      closeUploadTarget();
      renderGradePicker();
      renderUploadTopicsList();
    });
  });
}

function renderUploadTopicsList() {
  const el = document.getElementById("upload-topics-list");
  const grade = findGrade(activeGradeId);
  if (!grade) {
    el.innerHTML = '<p class="muted">Yuklash uchun avval yuqoridan sinfni tanlang.</p>';
    return;
  }

  el.innerHTML = grade.subjects.map(function (subject) {
    const rows = subject.topics.map(function (topic) {
      const buttons = ["lecture", "interactive", "test"].map(function (type) {
        const info = UPLOAD_TYPE_INFO[type];
        return (
          '<button type="button" class="topic-upload-btn" data-grade="' + grade.id + '" data-subject="' + subject.id +
          '" data-topic="' + topic.id + '" data-type="' + type + '">' + info.label + "</button>"
        );
      }).join("");

      return (
        '<div class="upload-topic-row">' +
          '<div class="upload-topic-title">' + topic.title + "</div>" +
          '<div class="upload-topic-actions">' + buttons + "</div>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="upload-subject-group">' +
        '<h3 class="upload-subject-heading">' + subject.name + "</h3>" +
        rows +
      "</div>"
    );
  }).join("");

  el.querySelectorAll(".topic-upload-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openUploadTarget(btn.dataset.grade, btn.dataset.subject, btn.dataset.topic, btn.dataset.type);
    });
  });
}

function openUploadTarget(gradeId, subjectId, topicId, type) {
  const grade = findGrade(gradeId);
  const subject = findSubject(grade, subjectId);
  const topic = findTopic(subject, topicId);
  const info = UPLOAD_TYPE_INFO[type];

  activeUploadTarget = { gradeId, subjectId, topicId, type };

  document.getElementById("upload-target-title").textContent = info.label + " — " + topic.title;
  document.getElementById("upload-target-sub").textContent = grade.name + " / " + subject.name;

  const input = document.getElementById("upload-target-input");
  input.value = "";
  const resultEl = document.getElementById("upload-target-result");
  resultEl.hidden = true;
  resultEl.innerHTML = "";

  const panel = document.getElementById("upload-target-panel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeUploadTarget() {
  activeUploadTarget = null;
  document.getElementById("upload-target-panel").hidden = true;
}

function buildTopicUploadInstruction(target, filename) {
  const info = UPLOAD_TYPE_INFO[target.type];
  const grade = findGrade(target.gradeId);
  const subject = findSubject(grade, target.subjectId);
  const topic = findTopic(subject, target.topicId);
  const path = info.folder + filename;
  const location = grade.name + " → " + subject.name + " → " + topic.title;

  if (target.type === "test") {
    return (
      "1) Faylni " + path + " sifatida joylashtiring.\n" +
      "2) js/data.js dagi \"" + location + "\" mavzusida:\n" +
      '   test: "' + path + '"\n' +
      "(Yoki savollarni js/quizzes.js ga qo'shib, avtomatik testdan foydalanishingiz ham mumkin.)"
    );
  }

  if (target.type === "lecture" && topic.sections && topic.sections.length > 0) {
    return (
      "Bu mavzu mavzuchalarga bo'lingan (" + topic.sections.length + " ta). Yagona fayl o'rniga,\n" +
      "js/data.js dagi \"" + location + "\" mavzusining sections ro'yxatida\n" +
      "har bir mavzuchaning \"text\" maydoniga alohida ma'ruza matnini yozing."
    );
  }

  return (
    "1) Faylni " + path + " sifatida joylashtiring.\n" +
    "2) js/data.js dagi \"" + location + "\" mavzusida:\n" +
    "   " + info.field + ': "' + path + '"'
  );
}

function wireUploadTarget() {
  document.getElementById("upload-target-close").addEventListener("click", closeUploadTarget);

  document.getElementById("upload-target-input").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file || !activeUploadTarget) return;

    const instruction = buildTopicUploadInstruction(activeUploadTarget, file.name);
    const resultEl = document.getElementById("upload-target-result");
    resultEl.hidden = false;
    resultEl.innerHTML =
      '<div class="upload-filename">📎 ' + file.name + "</div>" +
      '<pre class="upload-instruction">' + instruction + "</pre>" +
      '<button type="button" class="upload-copy-btn">Nusxalash</button>';

    resultEl.querySelector(".upload-copy-btn").addEventListener("click", function () {
      navigator.clipboard.writeText(instruction).then(function () {
        const btn = resultEl.querySelector(".upload-copy-btn");
        btn.textContent = "Nusxalandi ✓";
        setTimeout(function () { btn.textContent = "Nusxalash"; }, 1500);
      });
    });
  });
}

function renderAdminDashboard() {
  renderStatGrid();
  renderAdminContentTable();

  activeGradeId = SITE_DATA.grades[0].id;
  renderGradePicker();
  renderUploadTopicsList();
  wireUploadTarget();
}
