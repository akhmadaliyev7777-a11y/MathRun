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

function topicHref(gradeId, subjectId, topicId) {
  return "mavzu.html?sinf=" + gradeId + "&fan=" + subjectId + "&mavzu=" + topicId;
}

function topicStatusBadge(topic) {
  if (topic.interactive) return '<span class="badge badge-interactive">Interaktiv</span>';
  return '<span class="badge badge-lecture">Ma\'ruza</span>';
}

// ---------- Bosh sahifa: sinflar to'ri ----------
function renderGradesGrid() {
  const el = document.getElementById("grades-grid");
  if (!el) return;
  el.innerHTML = SITE_DATA.grades.map(function (grade) {
    const topicCount = grade.subjects.reduce(function (sum, s) { return sum + s.topics.length; }, 0);
    const interactiveCount = grade.subjects.reduce(function (sum, s) {
      return sum + s.topics.filter(function (t) { return !!t.interactive; }).length;
    }, 0);
    return (
      '<a class="card grade-card" href="sinf.html?sinf=' + grade.id + '">' +
        '<div class="grade-card-number">' + grade.id + '</div>' +
        '<div class="grade-card-name">' + grade.name + '</div>' +
        '<div class="grade-card-meta">' + topicCount + " ta mavzu</div>" +
        (interactiveCount > 0 ? '<div class="grade-card-tag">' + interactiveCount + ' interaktiv</div>' : "") +
      '</a>'
    );
  }).join("");
}

// ---------- Sinf sahifasi: fanlar va mavzular ----------
function renderGradePage() {
  const gradeId = getQueryParam("sinf");
  const grade = findGrade(gradeId);
  const titleEl = document.getElementById("grade-title");
  const container = document.getElementById("subjects-container");
  if (!grade) {
    if (titleEl) titleEl.textContent = "Sinf topilmadi";
    return;
  }
  if (titleEl) titleEl.textContent = grade.name;

  container.innerHTML = grade.subjects.map(function (subject) {
    const topicsHtml = subject.topics.map(function (topic) {
      return (
        '<a class="card topic-card" href="' + topicHref(grade.id, subject.id, topic.id) + '">' +
          '<div class="topic-card-title">' + topic.title + '</div>' +
          topicStatusBadge(topic) +
        '</a>'
      );
    }).join("");

    return (
      '<section class="subject-section">' +
        '<h2 class="subject-heading">' + subject.name + '</h2>' +
        '<div class="topics-grid">' + topicsHtml + '</div>' +
      '</section>'
    );
  }).join("");
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

  breadcrumbEl.innerHTML =
    '<a href="index.html">Bosh sahifa</a> / ' +
    '<a href="sinf.html?sinf=' + grade.id + '">' + grade.name + '</a> / ' +
    '<span>' + subject.name + '</span>';

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
