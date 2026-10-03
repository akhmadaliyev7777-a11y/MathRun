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

// ---------- Bosh sahifa: jonli mini-ko'rgazmalar ----------
function initShowcaseDemos() {
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = function (tag, attrs) {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  };
  // birinchi teginishda "Sinab ko'ring" yorlig'i yo'qoladi
  const touched = function (stage) { stage.classList.add("is-touched"); };

  // 1) Tarozi: chapda noma'lum yuk (x = 5), o'ngga 1 kg lik yuklar qo'shiladi
  (function () {
    const stage = document.getElementById("demo-balance");
    if (!stage) return;
    const X = 5;
    let right = 2;
    const beam = document.getElementById("bal-beam");
    const leftG = document.getElementById("bal-left");
    const rightG = document.getElementById("bal-right");
    const readout = document.getElementById("bal-readout");
    function pan(g, cx, cy, items) {
      g.replaceChildren();
      g.appendChild(svgEl("line", { x1: cx, y1: cy, x2: cx, y2: cy + 34, stroke: "#8e96d8", "stroke-width": 1.5 }));
      g.appendChild(svgEl("path", { d: "M" + (cx - 30) + " " + (cy + 34) + " Q " + cx + " " + (cy + 50) + " " + (cx + 30) + " " + (cy + 34) + " Z", fill: "#3a44b0" }));
      items(g, cx, cy + 34);
    }
    function draw() {
      const diff = X - right;                       // chap og'irroq bo'lsa musbat
      const ang = Math.max(-14, Math.min(14, diff * 4));
      beam.setAttribute("transform", "rotate(" + (-ang) + " 140 40)");
      const r = ang * Math.PI / 180;
      const lx = 140 - 90 * Math.cos(r), ly = 40 + 90 * Math.sin(r);
      const rx = 140 + 90 * Math.cos(r), ry = 40 - 90 * Math.sin(r);
      pan(leftG, lx, ly, function (g, x, y) {
        g.appendChild(svgEl("rect", { x: x - 15, y: y - 28, width: 30, height: 28, rx: 5, fill: "#4f5bd5" }));
        const t = svgEl("text", { x: x, y: y - 9, "text-anchor": "middle", "font-size": 16, "font-weight": 800, fill: "#fff" });
        t.textContent = diff === 0 ? X : "x"; g.appendChild(t);
      });
      pan(rightG, rx, ry, function (g, x, y) {
        for (let i = 0; i < right; i++) {
          const col = i % 4, row = Math.floor(i / 4);
          g.appendChild(svgEl("rect", { x: x - 22 + col * 11, y: y - 11 - row * 11, width: 10, height: 10, rx: 2, fill: "#16a394" }));
        }
      });
      stage.classList.toggle("is-solved", diff === 0);
      readout.textContent = diff === 0 ? "Teng! x = " + X + " kg" : "O'ng: " + right + " kg";
    }
    stage.querySelectorAll("[data-bal]").forEach(function (b) {
      b.addEventListener("click", function () {
        right = Math.max(0, Math.min(9, right + Number(b.dataset.bal)));
        touched(stage); draw();
      });
    });
    draw();
  })();

  // 2) Transportir: nurni sudrab burchakni o'lchash
  (function () {
    const stage = document.getElementById("demo-protractor");
    if (!stage) return;
    const svg = document.getElementById("prot-svg");
    const ray = document.getElementById("prot-ray");
    const knob = document.getElementById("prot-knob");
    const arc = document.getElementById("prot-arc");
    const readout = document.getElementById("prot-readout");
    const type = document.getElementById("prot-type");
    const ticks = document.getElementById("prot-ticks");
    const CX = 140, CY = 132, R = 110;
    for (let d = 0; d <= 180; d += 10) {
      const a = d * Math.PI / 180, long = d % 30 === 0;
      ticks.appendChild(svgEl("line", {
        x1: CX + R * Math.cos(a), y1: CY - R * Math.sin(a),
        x2: CX + (R - (long ? 12 : 7)) * Math.cos(a), y2: CY - (R - (long ? 12 : 7)) * Math.sin(a),
        stroke: "#0f6f63", "stroke-width": long ? 2 : 1
      }));
      if (long && d > 0 && d < 180) {
        const t = svgEl("text", { x: CX + (R - 24) * Math.cos(a), y: CY - (R - 24) * Math.sin(a) + 4, "text-anchor": "middle", "font-size": 10, fill: "#0f6f63", "font-weight": 700 });
        t.textContent = d; ticks.appendChild(t);
      }
    }
    let angle = 90, auto = true;
    function set(deg) {
      angle = Math.max(0, Math.min(180, Math.round(deg)));
      const a = angle * Math.PI / 180;
      const x = CX + (R - 4) * Math.cos(a), y = CY - (R - 4) * Math.sin(a);
      ray.setAttribute("x2", x); ray.setAttribute("y2", y);
      knob.setAttribute("cx", x); knob.setAttribute("cy", y);
      const ar = 34;
      arc.setAttribute("d", "M " + CX + " " + CY + " L " + (CX + ar) + " " + CY +
        " A " + ar + " " + ar + " 0 0 0 " + (CX + ar * Math.cos(a)) + " " + (CY - ar * Math.sin(a)) + " Z");
      readout.textContent = angle + "°";
      type.textContent = angle === 0 ? "nol burchak" : angle < 90 ? "o'tkir burchak" : angle === 90 ? "to'g'ri burchak" : angle < 180 ? "o'tmas burchak" : "yoyiq burchak";
    }
    function fromEvent(e) {
      const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(svg.getScreenCTM().inverse());
      set(Math.atan2(CY - q.y, q.x - CX) * 180 / Math.PI);
    }
    let dragging = false;
    svg.addEventListener("pointerdown", function (e) { dragging = true; auto = false; touched(stage); svg.setPointerCapture(e.pointerId); fromEvent(e); });
    svg.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    svg.addEventListener("pointerup", function () { dragging = false; });
    svg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { auto = false; touched(stage); set(angle + 5); e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { auto = false; touched(stage); set(angle - 5); e.preventDefault(); }
    });
    // foydalanuvchi tegmaguncha nur sekin aylanib turadi (harakatni kamaytirish sozlamasi bo'lsa — yo'q)
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t0 = performance.now();
    function tick(now) {
      if (!auto) return;
      set(90 + 55 * Math.sin((now - t0) / 1400));
      requestAnimationFrame(tick);
    }
    set(90);
    if (!still) requestAnimationFrame(tick);
  })();

  // 3) Kasrlarni bo'yash: bo'laklarni bosib kasr hosil qilish
  (function () {
    const stage = document.getElementById("demo-fraction");
    if (!stage) return;
    const bar = document.getElementById("frac-bar");
    const num = document.getElementById("frac-num");
    const den = document.getElementById("frac-den");
    const readout = document.getElementById("frac-readout");
    let n = 4, on = [true, false, false, false];
    function draw() {
      bar.replaceChildren();
      for (let i = 0; i < n; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "frac-seg" + (on[i] ? " on" : "");
        b.setAttribute("aria-label", (i + 1) + "-bo'lak");
        b.addEventListener("click", function () { on[i] = !on[i]; touched(stage); draw(); });
        bar.appendChild(b);
      }
      const k = on.slice(0, n).filter(Boolean).length;
      num.textContent = k; den.textContent = n;
      readout.textContent = k === n ? "butun = 1" : n + " bo'lak";
    }
    stage.querySelectorAll("[data-den]").forEach(function (b) {
      b.addEventListener("click", function () {
        n = Math.max(2, Math.min(8, n + Number(b.dataset.den)));
        while (on.length < n) on.push(false);
        touched(stage); draw();
      });
    });
    draw();
  })();
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

  // ro'yxat ko'rinishi: sinf → fan → mavzular (raqam · nomi · beti · Interaktiv / Ma'ruza / Test)
  let total = 0;
  const sections = SITE_DATA.grades.map(function (grade) {
    const subjectBlocks = grade.subjects.map(function (subject) {
      const rows = subject.topics.map(function (topic, i) {
        if (!topic.interactive) return "";
        total++;
        const href = topicHref(grade.id, subject.id, topic.id);
        const parts = splitTopicTitle(topic.title, i);
        const btn = function (label, anchor, primary) {
          return '<a class="topic-btn' + (primary ? ' topic-btn--primary' : '') + '" href="' + href + anchor + '">' + label + '</a>';
        };
        return (
          '<li class="topic-row">' +
            '<span class="topic-row-num">' + parts.num + '</span>' +
            '<a class="topic-row-title" href="' + href + '#interaktiv">' + parts.title +
              (topic.page ? '<span class="topic-row-page">' + topic.page + '</span>' : '') +
            '</a>' +
            '<span class="topic-row-actions">' +
              btn("Interaktiv", "#interaktiv", true) +
              btn("Ma'ruza", "#maruza", false) +
              (topic.test ? btn("Test", "#test", false) : "") +
            '</span>' +
          '</li>'
        );
      }).join("");
      if (!rows) return "";
      return (
        (grade.subjects.length > 1 ? '<div class="gallery-subject">' + subject.name + '</div>' : "") +
        '<ol class="topic-list gallery-list">' + rows + '</ol>'
      );
    }).join("");
    if (!subjectBlocks) return "";
    return (
      '<section class="gallery-grade">' +
        '<h2 class="gallery-grade-title"><a href="sinf.html?sinf=' + grade.id + '">' + grade.name + '</a></h2>' +
        subjectBlocks +
      '</section>'
    );
  }).join("");

  el.innerHTML = sections + '<p class="topic-list-foot">Jami ' + total + ' ta interaktiv dars</p>';
}
