// Umumiy yordamchi funksiyalar — barcha sahifalarda ishlatiladi

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function findGrade(gradeId) {
  return SITE_DATA.grades.find(function (g) { return g.id === gradeId; });
}

function findSubject(grade, subjectId) {
  return grade.subjects.find(function (s) { return s.id === subjectId; });
}

function findTopic(subject, topicId) {
  return subject.topics.find(function (t) { return t.id === topicId; });
}

// yo'l ko'rsatkich: har bir qadam — bosiladigan kichik tugma, oxirgisi (joriy sahifa) — oddiy matn
function breadcrumbHtml(items) {
  return items.map(function (it) {
    return it.href
      ? '<a class="crumb" href="' + it.href + '">' + it.label + '</a>'
      : '<span class="crumb crumb--current">' + it.label + '</span>';
  }).join('<span class="crumb-sep">›</span>');
}

// "1. Natural sonlar" yoki "1.1 Tub sonlar" → { num: "1." / "1.1", title: "Natural sonlar" }
function splitTopicTitle(title, index) {
  const m = title.match(/^(\d+(?:\.\d+)*)\.?\s+(.*)$/);
  if (!m) return { num: (index + 1) + ".", title: title };
  return { num: m[1] + (m[1].indexOf(".") === -1 ? "." : ""), title: m[2] };
}

function topicHref(gradeId, subjectId, topicId) {
  return "mavzu.html?sinf=" + gradeId + "&fan=" + subjectId + "&mavzu=" + topicId;
}

function topicHasLecture(topic) {
  if (topic.sections && topic.sections.length > 0) {
    return topic.sections.some(function (s) { return !!s.text; });
  }
  return !!(topic.lecture && (topic.lecture.text || topic.lecture.embedUrl));
}

function topicStatusBadge(topic) {
  const badges = [];
  if (topicHasLecture(topic)) badges.push('<span class="badge badge-lecture">Ma\'ruza</span>');
  if (topic.interactive) badges.push('<span class="badge badge-interactive">Interaktiv</span>');
  return badges.join(" ");
}

// ---------- Bosh sahifa: sinflar to'ri ----------
// Bosh sahifadagi sinflar: ikki guruh — boshlang'ich (1–4) va 5–11 sinflar
function gradeTile(href, number, name, chips, meta, primary) {
  return (
    '<a class="grade-tile' + (primary ? ' grade-tile--primary' : '') + '" href="' + href + '">' +
      '<span class="grade-tile-num">' + number + '</span>' +
      '<span class="grade-tile-body">' +
        '<span class="grade-tile-name">' + name + '</span>' +
        (chips.length ? '<span class="grade-tile-subj">' + chips.join(" · ") + '</span>' : "") +
        '<span class="grade-tile-meta">' + meta + '</span>' +
      '</span>' +
    '</a>'
  );
}

function renderGradesGrid() {
  const el = document.getElementById("grades-grid");
  if (!el) return;

  // 5–11 sinflar (SITE_DATA dan)
  const upper = SITE_DATA.grades.map(function (grade) {
    const topicCount = grade.subjects.reduce(function (sum, s) { return sum + s.topics.length; }, 0);
    const interactiveCount = grade.subjects.reduce(function (sum, s) {
      return sum + s.topics.filter(function (t) { return !!t.interactive; }).length;
    }, 0);
    // fan nomlari qavssiz va takrorlanmasdan: "Matematika (2026-yil)" → "Matematika"
    const chips = grade.subjects.map(function (s) { return s.name.replace(/\s*\(.*\)\s*$/, ""); })
      .filter(function (n, i, a) { return a.indexOf(n) === i; });
    const meta = topicCount + " mavzu" + (interactiveCount > 0 ? ' · <b>' + interactiveCount + " interaktiv</b>" : "");
    return gradeTile("sinf.html?sinf=" + grade.id, grade.id, grade.name, chips, meta, false);
  }).join("");

  // 1–4 sinflar (Boshlang'ich sinflar bo'limiga)
  const primaryTile = function (n, meta) {
    return gradeTile("mathrunner-web/index.html#/g/" + n + "/c/1", n, n + "-sinf", ["Mavzular", "Testlar"], meta, true);
  };
  const primary = [1, 2, 3, 4].map(function (n) { return primaryTile(n, "4 chorak"); }).join("");

  el.innerHTML =
    '<div class="grade-group">' +
      '<div class="grade-group-head">' +
        '<div><div class="grade-group-title">Boshlang\'ich sinflar</div>' +
        '<div class="grade-group-sub">1–4 sinf · mavzular, darslar va testlar</div></div>' +
        '<a class="grade-group-link" href="mathrunner-web/index.html">Bo\'limni ochish →</a>' +
      '</div>' +
      '<div class="grade-tiles" id="primary-tiles">' + primary + '</div>' +
    '</div>' +
    '<div class="grade-group">' +
      '<div class="grade-group-head">' +
        '<div><div class="grade-group-title">5–11 sinflar</div>' +
        '<div class="grade-group-sub">Algebra, geometriya va interaktiv ko\'rgazmalar</div></div>' +
      '</div>' +
      '<div class="grade-tiles">' + upper + '</div>' +
    '</div>';

  // boshlang'ich sinflar uchun aniq mavzu va darslar soni (bo'lim ma'lumotidan)
  fetch("mathrunner-web/data/curriculum.json")
    .then(function (r) { return r.json(); })
    .then(function (cur) {
      const box = document.getElementById("primary-tiles");
      if (!box) return;
      box.innerHTML = cur.grades.map(function (g) {
        const topics = g.choraks.reduce(function (sum, c) { return sum + c.blocks.length; }, 0);
        return primaryTile(g.grade, topics + " mavzu · <b>" + g.levelCount + " dars</b>");
      }).join("");
    })
    .catch(function () {});
}

// ---------- Sinf sahifasi: fanlar va mavzular ----------
let activeGradeSubjectId = null;

function renderGradePage() {
  const gradeId = getQueryParam("sinf");
  const grade = findGrade(gradeId);
  const titleEl = document.getElementById("grade-title");
  if (!grade) {
    if (titleEl) titleEl.textContent = "Sinf topilmadi";
    return;
  }
  if (titleEl) titleEl.textContent = grade.name;
  const crumbEl = document.getElementById("breadcrumb");
  if (crumbEl) crumbEl.innerHTML = breadcrumbHtml([{ label: "← Bosh sahifa", href: "index.html#grades-section" }, { label: grade.name }]);

  // ?fan=... bo'lsa — o'sha fan tabi ochiladi (mavzu sahifasidan qaytganda)
  if (!activeGradeSubjectId) activeGradeSubjectId = getQueryParam("fan");
  if (!activeGradeSubjectId || !grade.subjects.some(function (s) { return s.id === activeGradeSubjectId; })) {
    activeGradeSubjectId = grade.subjects[0].id;
  }

  renderSubjectTabs(grade);
  renderActiveSubjectTopics(grade);
}

function renderSubjectTabs(grade) {
  const tabsEl = document.getElementById("subject-tabs");
  if (!tabsEl) return;

  if (grade.subjects.length <= 1) {
    tabsEl.innerHTML = "";
    return;
  }

  tabsEl.innerHTML = grade.subjects.map(function (subject) {
    const activeCls = subject.id === activeGradeSubjectId ? " active" : "";
    return '<button type="button" class="subject-tab' + activeCls + '" data-subject="' + subject.id + '">' + subject.name + '</button>';
  }).join("");

  tabsEl.querySelectorAll(".subject-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeGradeSubjectId = btn.dataset.subject;
      // tanlangan fan manzilda saqlanadi — orqaga qaytganda shu tab ochiladi
      try { history.replaceState(null, "", "sinf.html?sinf=" + grade.id + "&fan=" + activeGradeSubjectId); } catch (e) {}
      renderSubjectTabs(grade);
      renderActiveSubjectTopics(grade);
    });
  });
}

function renderActiveSubjectTopics(grade) {
  const container = document.getElementById("subjects-container");
  const subject = findSubject(grade, activeGradeSubjectId);
  if (!container || !subject) return;

  // ro'yxat ko'rinishi: raqam · mavzu nomi · darslik beti · Ma'ruza / Interaktiv / Test tugmalari
  const rowsHtml = subject.topics.map(function (topic, i) {
    const href = topicHref(grade.id, subject.id, topic.id);
    const parts = splitTopicTitle(topic.title, i);
    const num = parts.num;
    const title = parts.title;
    const btn = function (label, anchor, primary) {
      return '<a class="topic-btn' + (primary ? ' topic-btn--primary' : '') + '" href="' + href + anchor + '">' + label + '</a>';
    };
    return (
      '<li class="topic-row">' +
        '<span class="topic-row-num">' + num + '</span>' +
        '<a class="topic-row-title" href="' + href + '">' + title +
          (topic.page ? '<span class="topic-row-page">' + topic.page + '</span>' : '') +
        '</a>' +
        '<span class="topic-row-actions">' +
          btn("Ma'ruza", "#maruza", true) +
          (topic.interactive ? btn("Interaktiv", "#interaktiv", false) : "") +
          (topic.test ? btn("Test", "#test", false) : "") +
        '</span>' +
      '</li>'
    );
  }).join("");

  container.innerHTML = '<ol class="topic-list">' + rowsHtml + '</ol>' +
    '<p class="topic-list-foot">' + subject.topics.length + ' ta mavzu</p>';
}

// ---------- Mavzu sahifasi ----------
function renderTopicPage() {
  const gradeId = getQueryParam("sinf");
  const subjectId = getQueryParam("fan");
  const topicId = getQueryParam("mavzu");

  const grade = findGrade(gradeId);
  const subject = grade ? findSubject(grade, subjectId) : null;
  const topic = subject ? findTopic(subject, topicId) : null;

  const breadcrumbEl = document.getElementById("breadcrumb");
  const titleEl = document.getElementById("topic-title");
  const lectureEl = document.getElementById("lecture-content");
  const interactiveEl = document.getElementById("interactive-content");
  const testEl = document.getElementById("test-content");

  if (!topic) {
    titleEl.textContent = "Mavzu topilmadi";
    return;
  }

  breadcrumbEl.innerHTML = breadcrumbHtml([
    { label: "← Bosh sahifa", href: "index.html#grades-section" },
    { label: grade.name, href: "sinf.html?sinf=" + grade.id },
    { label: subject.name, href: "sinf.html?sinf=" + grade.id + "&fan=" + subject.id },
  ]);

  titleEl.textContent = topic.title;
  const pageEl = document.getElementById("topic-page");
  if (pageEl) pageEl.textContent = topic.page || "";

  if (topic.lecture && topic.lecture.embedUrl) {
    lectureEl.innerHTML = '<iframe class="embed-frame" src="' + topic.lecture.embedUrl + '" allowfullscreen></iframe>';
  } else if (topic.sections && topic.sections.length > 0) {
    lectureEl.innerHTML = topic.sections.map(function (s, i) {
      return (
        '<div class="lecture-section">' +
          '<h4 class="lecture-section-title">' + (i + 1) + ". " + s.title + '</h4>' +
          (s.text ? "<p>" + s.text + "</p>" : '<p class="muted">Ma\'ruza matni hali qo\'shilmagan.</p>') +
        '</div>'
      );
    }).join("");
  } else if (topic.lecture && topic.lecture.text) {
    lectureEl.innerHTML = "<p>" + topic.lecture.text + "</p>";
  } else {
    lectureEl.innerHTML = '<p class="muted">Ma\'ruza matni hali qo\'shilmagan.</p>';
  }

  if (topic.interactive) {
    interactiveEl.innerHTML = '<iframe class="embed-frame embed-frame-tall" src="' + topic.interactive + '" allowfullscreen></iframe>';
  } else {
    interactiveEl.innerHTML = '<div class="placeholder">🚧 Interaktiv ko\'rgazma tez orada qo\'shiladi</div>';
  }

  if (topic.test) {
    testEl.innerHTML = '<iframe class="embed-frame embed-frame-tall" src="' + topic.test + '" allowfullscreen></iframe>';
  } else {
    testEl.innerHTML = '<div class="placeholder">🚧 Interaktiv test tez orada qo\'shiladi</div>';
  }
}

// ---------- Ko'rgazmalar galereyasi ----------
function renderGallery() {
  const el = document.getElementById("gallery-grid");
  if (!el) return;
  const anyInteractive = SITE_DATA.grades.some(function (grade) {
    return grade.subjects.some(function (subject) {
      return subject.topics.some(function (topic) { return !!topic.interactive; });
    });
  });

  if (!anyInteractive) {
    el.innerHTML = '<p class="muted">Hozircha interaktiv ko\'rgazmalar qo\'shilmagan. Ular tayyor bo\'lgach shu yerda paydo bo\'ladi.</p>';
    return;
  }

  el.innerHTML = SITE_DATA.grades.map(function (grade) {
    const subjectSections = grade.subjects.map(function (subject) {
      const topics = subject.topics.filter(function (topic) { return !!topic.interactive; });
      if (topics.length === 0) return "";

      const cards = topics.map(function (topic) {
        return (
          '<a class="card gallery-card" href="' + topicHref(grade.id, subject.id, topic.id) + '">' +
            '<div class="gallery-card-tag">' + subject.name + '</div>' +
            '<div class="gallery-card-title">' + topic.title + '</div>' +
          '</a>'
        );
      }).join("");

      return '<h3 class="upload-subject-heading">' + subject.name + '</h3><div class="gallery-cards-row">' + cards + '</div>';
    }).join("");

    if (!subjectSections.trim()) return "";

    return '<section class="gallery-grade-section"><h2 class="subject-heading">' + grade.name + '</h2>' + subjectSections + '</section>';
  }).join("");
}
