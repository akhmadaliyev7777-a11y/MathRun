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
// sinf afishalari (img/sinf/<sinf>.webp); rasmi yo'q sinfda — och fonda katta raqam
// "tun" — tungi rejim uchun to'q fonli nusxasi ham bor (img/sinf/<sinf>-tun.webp)
const GRADE_POSTERS = { 1: "tun", 2: "tun", 3: "tun", 4: "tun", 5: "tun", 6: "tun", 7: "tun", 8: "tun", 9: "tun", 10: "tun", 11: "tun" };

function gradeTile(href, number, name, chips, meta, primary) {
  const tun = GRADE_POSTERS[number] === "tun";
  const poster = GRADE_POSTERS[number]
    ? '<img class="gp-kun" src="img/sinf/' + number + '.webp?v=3" alt="" loading="lazy" decoding="async">' +
      (tun ? '<img class="gp-tun" src="img/sinf/' + number + '-tun.webp?v=1" alt="" loading="lazy" decoding="async">' : "")
    : '<span class="gp-num">' + number + '</span>';
  return (
    '<a class="grade-poster' + (primary ? ' grade-poster--primary' : '') + (tun ? ' grade-poster--tun' : '') + '" href="' + href + '">' +
      '<span class="gp-art">' + poster + '<span class="gp-badge">' + number + '</span></span>' +
      '<span class="gp-body">' +
        '<span class="gp-name">' + name + '</span>' +
        (chips.length ? '<span class="gp-subj">' + chips.join(" · ") + '</span>' : "") +
        '<span class="gp-meta">' + meta + '</span>' +
      '</span>' +
    '</a>'
  );
}

// ---------- Bosh sahifa: o'ng tomondagi slayd-shou ----------
// Slaydlar ma'lumotlardan (js/data.js) yasaladi: yangi ma'ruzalar, yangi interaktiv dars, 5-sinf statistikasi.
// opts.rasm — birinchi slayd o'rniga rasm: { kun: "img/...", tun: "img/..." } («Yuqori sinflar» bo'limi)
function renderHeroSlider(opts) {
  opts = opts || {};
  const box = document.getElementById("hero-slider");
  if (!box || typeof SITE_DATA === "undefined") return;
  const grade = findGrade("5");
  const subject = grade && grade.subjects[0];
  const topics = subject ? subject.topics : [];
  const strip = function (t) { return t.replace(/^[\d.]+\.\s*/, ""); };
  const href = function (t, anchor) { return topicHref(grade.id, subject.id, t.id) + (anchor || ""); };
  const ico = function (t, size) {
    return t.icon ? '<img src="' + t.icon + '" alt="" width="' + size + '" height="' + size + '" loading="lazy">' : "";
  };
  const slides = [];

  if (opts.rasm) slides.push('<div class="hs-slide hs-rasm"><img class="gp-kun" src="' + opts.rasm.kun + '" alt=""><img class="gp-tun" src="' + opts.rasm.tun + '" alt="" loading="lazy"></div>');
  else slides.push('<div class="hs-slide hs-art"><img class="gp-kun" src="img/hero/kirish.webp?v=2" alt="Matematika: kublar, transportir, kasrlar, π va √"><img class="gp-tun" src="img/hero/kirish-tun.webp?v=1" alt="Matematika: kublar, transportir, kasrlar, π va √" loading="lazy">' +
    '<div class="hs-shior"><span class="hs-label">Mathlearn</span><b><span>Matematika</span> <span>endi qiyin</span> <span>fan emas</span></b></div></div>');

  if (opts.rasm) slides.push.apply(slides, upperSlides());
  else {
    const lectures = topics.filter(topicHasLecture);
    if (lectures.length) {
      const last = lectures.slice(-3).reverse();
      slides.push(
        '<div class="hs-slide hs-list">' +
          '<span class="hs-label">Yangi ma\'ruzalar · 5-sinf</span>' +
          '<h3>Endi o\'qisa bo\'ladi</h3>' +
          last.map(function (t) {
            return '<a class="hs-row" href="' + href(t, "#maruza") + '"><span class="hs-ico">' + ico(t, 48) + '</span><span>' + strip(t.title) + '</span><b aria-hidden="true">→</b></a>';
          }).join("") +
          '<a class="hs-more" href="sinf.html?sinf=5&amp;fan=' + subject.id + '">Barcha mavzular →</a>' +
        '</div>');
    }

    // slayddagi interaktiv dars — tanlangan tayyor mavzu (bo'lmasa oxirgi yangi simulyator)
    const HERO_SIM = "bolishni-kasr-korinishida", HERO_SIM_NOM = "Kasrlarni bo'yash";
    const sims = topics.filter(function (t) { return t.newSim && t.interactive && !t.review; });
    const sim = sims.filter(function (t) { return t.id === HERO_SIM; })[0] || sims[sims.length - 1];
    if (sim) {
      slides.push(
        '<div class="hs-slide hs-feature">' +
          '<span class="hs-big">' + ico(sim, 150) + '</span>' +
          '<span class="hs-text">' +
            '<span class="hs-label">Interaktiv dars</span>' +
            '<h3>' + (sim.id === HERO_SIM ? HERO_SIM_NOM : strip(sim.title)) + '</h3>' +
            '<p>Sudrab, bosib, o\'zgartirib — mavzuni qo\'l bilan sinab ko\'ring.</p>' +
            '<a class="hs-btn" href="' + href(sim, "#interaktiv") + '">Sinab ko\'rish →</a>' +
          '</span>' +
        '</div>');
    }

    const n = function (f) { return topics.filter(f).length; };
    slides.push(
      '<div class="hs-slide hs-feature hs-grade">' +
        '<span class="hs-poster"><img class="gp-kun" src="img/sinf/5.webp?v=3" alt="" loading="lazy"><img class="gp-tun" src="img/sinf/5-tun.webp?v=1" alt="" loading="lazy"></span>' +
        '<span class="hs-text">' +
          '<span class="hs-label">5-sinf · Matematika</span>' +
          '<h3>Hammasi bir joyda</h3>' +
          '<span class="hs-stats">' +
            '<span><b>' + topics.length + '</b>mavzu</span>' +
            '<span><b>' + lectures.length + '</b>ma\'ruza</span>' +
            '<span><b>' + n(function (t) { return !!t.test; }) + '</b>test</span>' +
          '</span>' +
          '<a class="hs-btn" href="sinf.html?sinf=5&amp;fan=' + subject.id + '">5-sinfni ochish →</a>' +
        '</span>' +
      '</div>');
  }

  mountHeroSlider(box, slides);
}

// 5–11 sinflar afishalari (SITE_DATA dan) — bosh sahifa va «Yuqori sinflar» bo'limi
function upperGradeTiles() {
  return SITE_DATA.grades.map(function (grade) {
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
}

function renderGradesGrid() {
  const el = document.getElementById("grades-grid");
  if (!el) return;

  const upper = upperGradeTiles();

  // 1–4 sinflar (Boshlang'ich sinflar bo'limiga)
  const primaryTile = function (n, meta) {
    return gradeTile("mathrunner-web/index.html#/g/" + n + "/c/1", n, n + "-sinf", ["Mavzular", "Testlar"], meta, true);
  };
  const primary = [1, 2, 3, 4].map(function (n) { return primaryTile(n, "4 chorak"); }).join("");

  // bitta qator, sig'masa yonga suriladi (tugmalar — initGradeRail)
  const rail = function (id, tiles, cls) {
    return '<div class="grade-rail">' +
      '<button class="gr-btn gr-prev" type="button" aria-label="Oldingi sinflar" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<div class="grade-tiles grade-tiles--rail ' + cls + '" id="' + id + '">' + tiles + '</div>' +
      '<button class="gr-btn gr-next" type="button" aria-label="Keyingi sinflar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
    '</div>';
  };

  // har guruh — interaktiv darslar oynasi kabi ramka (sarlavha, izoh, tugma) va ichida kartochkalar qatori
  const panel = function (label, title, sub, link, tiles) {
    return '<div class="lessons-panel grade-panel">' +
      '<div class="lessons-head">' +
        '<div><div class="section-label">' + label + '</div>' +
        '<h2 class="lessons-title">' + title + '</h2>' +
        '<p class="lessons-sub">' + sub + '</p></div>' +
        (link || "") +
      '</div>' + tiles +
    '</div>';
  };

  el.innerHTML =
    panel("Boshlang'ich sinflar", "Matematikani o'yin orqali o'rganamiz", "1–4-sinf: mavzular, darslar va testlar bir joyda.",
      '<a class="lessons-all" href="mathrunner-web/index.html">Bo\'limni ochish <span aria-hidden="true">→</span></a>',
      rail("primary-tiles", primary, "gr-boshlang")) +
    panel("5–11-sinflar", "Algebra va geometriya — sinfingizni tanlang", "Ma'ruzalar, testlar va interaktiv ko'rgazmalar bir joyda.",
      '<a class="lessons-all" href="yuqori.html">Bo\'limni ochish <span aria-hidden="true">→</span></a>',
      rail("upper-tiles", upper, "gr-yuqori"));
  el.querySelectorAll(".grade-rail").forEach(initGradeRail);

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
      box.dispatchEvent(new Event("scroll"));
    })
    .catch(function () {});
}

// 5–11 sinflar qatori: tugmalar, sichqoncha bilan sudrash; sensor paneli va barmoq bilan o'zi suriladi
function initGradeRail(rail) {
  if (!rail) return;
  const box = rail.querySelector(".grade-tiles--rail");
  const prev = rail.querySelector(".gr-prev");
  const next = rail.querySelector(".gr-next");
  const step = function () {
    const card = box.firstElementChild;
    const gap = parseFloat(getComputedStyle(box).columnGap) || 0;
    const w = card ? card.getBoundingClientRect().width + gap : box.clientWidth;
    return Math.max(w, Math.floor(box.clientWidth / w - 1) * w);
  };
  const update = function () {
    const max = box.scrollWidth - box.clientWidth;
    prev.hidden = box.scrollLeft <= 4;
    next.hidden = box.scrollLeft >= max - 4;
  };
  // silliq surish: yopishish (snap) vaqtincha o'chadi, eng yaqin kartochka boshiga yumshoq sekinlashib boradi
  let anim = 0;
  const glide = function (target) {
    const max = box.scrollWidth - box.clientWidth;
    const points = Array.prototype.map.call(box.children, function (c) { return Math.min(c.offsetLeft - box.offsetLeft - box.clientLeft, max); });
    points.push(max);
    let to = points[0];
    points.forEach(function (p) { if (Math.abs(p - target) < Math.abs(to - target)) to = p; });
    const from = box.scrollLeft, dist = to - from;
    const dur = Math.min(650, 260 + Math.abs(dist) * 0.6);
    const t0 = performance.now();
    cancelAnimationFrame(anim);
    box.classList.add("gr-surish");
    const tick = function (now) {
      const k = Math.min(1, (now - t0) / dur);
      box.scrollLeft = from + dist * (1 - Math.pow(1 - k, 3));
      if (k < 1) anim = requestAnimationFrame(tick);
      else box.classList.remove("gr-surish");
    };
    anim = requestAnimationFrame(tick);
  };
  prev.addEventListener("click", function () { glide(box.scrollLeft - step()); });
  next.addEventListener("click", function () { glide(box.scrollLeft + step()); });
  box.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  // sichqoncha bilan yonga sudrash; qo'yib yuborilganda tezligiga qarab eng yaqin kartochkaga silliq to'xtaydi.
  // sudralgan bo'lsa, kartochka bosilmaydi
  let startX = 0, startLeft = 0, down = false, moved = false, lastX = 0, lastT = 0, speed = 0;
  box.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    cancelAnimationFrame(anim);
    down = true; moved = false; startX = lastX = e.clientX; startLeft = box.scrollLeft; lastT = performance.now(); speed = 0;
  });
  window.addEventListener("pointermove", function (e) {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; box.classList.add("gr-surish"); }
    if (!moved) return;
    box.scrollLeft = startLeft - dx;
    const now = performance.now(), dt = now - lastT;
    if (dt > 0) speed = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * speed;
    lastX = e.clientX; lastT = now;
  });
  window.addEventListener("pointerup", function () {
    if (!down) return;
    down = false;
    if (!moved) return;
    if (performance.now() - lastT > 80) speed = 0;
    glide(box.scrollLeft - speed * 260);
    const stop = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
    box.addEventListener("click", stop, true);
    setTimeout(function () { box.removeEventListener("click", stop, true); moved = false; }, 60);
  });
  box.addEventListener("dragstart", function (e) { e.preventDefault(); });
  update();
}

// ---------- «Yuqori sinflar» bo'limi (yuqori.html) ----------
// slayd-shou bosh sahifadagidan farqli: 6–11-sinflardagi yangi ma'ruzalar, 8-sinf interaktiv darsi, 6-sinf
function upperSlides() {
  const slides = [];
  const strip = function (t) { return t.replace(/^[\d.]+\.\s*/, ""); };
  const yuqori = SITE_DATA.grades.filter(function (g) { return Number(g.id) >= 6; });
  // faqat yangi tuzilishdagi tayyor ma'ruzalar (maruza/*.html)
  const tayyor = function (t) { return !!(t.lecture && t.lecture.embedUrl); };

  // eng oxirgi tayyor ma'ruzalar (katta sinfdan boshlab)
  const yangi = [];
  yuqori.slice().reverse().forEach(function (g) {
    g.subjects.forEach(function (s) {
      s.topics.filter(tayyor).slice().reverse().forEach(function (t) { yangi.push({ g: g, s: s, t: t }); });
    });
  });
  if (yangi.length) {
    slides.push(
      '<div class="hs-slide hs-list">' +
        '<span class="hs-label">Yangi ma\'ruzalar</span>' +
        '<h3>Endi o\'qisa bo\'ladi</h3>' +
        yangi.slice(0, 3).map(function (x) {
          const ikon = x.t.icon ? '<img src="' + x.t.icon + '" alt="" width="48" height="48" loading="lazy">' : '<b class="hs-ico-son">' + x.g.id + '</b>';
          return '<a class="hs-row" href="' + topicHref(x.g.id, x.s.id, x.t.id) + '#maruza"><span class="hs-ico">' + ikon + '</span><span>' +
            x.g.id + '-sinf · ' + strip(x.t.title).split(". ")[0] + '</span><b aria-hidden="true">→</b></a>';
        }).join("") +
      '</div>');
  }

  // 8-sinf «Modul kasblarda» interaktiv darsi
  const g8 = findGrade("8");
  const s8 = g8 && g8.subjects.filter(function (s) { return s.id === "algebra"; })[0];
  const modul = s8 && s8.topics.filter(function (t) { return t.id === "modul-tengsizliklar" && t.interactive; })[0];
  if (modul) {
    slides.push(
      '<div class="hs-slide hs-feature">' +
        '<span class="hs-big hs-modul" aria-hidden="true"><b>|x − a|</b><small>≤ d</small></span>' +
        '<span class="hs-text">' +
          '<span class="hs-label">Interaktiv dars</span>' +
          '<h3>Modul kasblarda</h3>' +
          '<p>8-sinf: modul hayotda qayerda kerakligini 5 kasb misolida o\'ynab ko\'ring.</p>' +
          '<a class="hs-btn" href="' + topicHref("8", "algebra", modul.id) + '#interaktiv">Sinab ko\'rish →</a>' +
        '</span>' +
      '</div>');
  }

  // 6-sinf: hammasi bir joyda
  const g6 = findGrade("6");
  if (g6) {
    const t6 = g6.subjects.reduce(function (a, s) { return a.concat(s.topics); }, []);
    const n = function (f) { return t6.filter(f).length; };
    slides.push(
      '<div class="hs-slide hs-feature hs-grade">' +
        '<span class="hs-poster"><img class="gp-kun" src="img/sinf/6.webp?v=3" alt="" loading="lazy"><img class="gp-tun" src="img/sinf/6-tun.webp?v=1" alt="" loading="lazy"></span>' +
        '<span class="hs-text">' +
          '<span class="hs-label">6-sinf · Matematika</span>' +
          '<h3>Ma\'ruza, test va PDF</h3>' +
          '<span class="hs-stats">' +
            '<span><b>' + t6.length + '</b>mavzu</span>' +
            '<span><b>' + n(tayyor) + '</b>ma\'ruza</span>' +
            '<span><b>' + n(function (t) { return !!t.interactive; }) + '</b>interaktiv</span>' +
          '</span>' +
          '<a class="hs-btn" href="sinf.html?sinf=6">6-sinfni ochish →</a>' +
        '</span>' +
      '</div>');
  }
  return slides;
}

function renderUpperSection() {
  const box = document.getElementById("yq-sinflar");
  if (box) box.innerHTML = upperGradeTiles();
  const mavzu = SITE_DATA.grades.reduce(function (n, g) {
    return n + g.subjects.reduce(function (m, s) { return m + s.topics.length; }, 0);
  }, 0);
  const son = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  const yoz = function (id, v) { const e = document.getElementById(id); if (e) e.textContent = v; };
  yoz("yq-mavzu", mavzu);
  // ma'ruza, savol, interaktiv — «Biz haqimizda» dagi kabi js/raqamlar.json dan (3 kunda yangilanadi)
  fetch("js/raqamlar.json?d=" + new Date().toISOString().slice(0, 10))
    .then(function (j) { if (!j.ok) throw 0; return j.json(); })
    .then(function (r) {
      yoz("yq-maruza", r.maruza);
      yoz("yq-savol", son(Math.floor(r.savol / 100) * 100) + "+");
      yoz("yq-interaktiv", r.interaktiv);
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

// ---------- Nishonlar to'plami (js/progress.js) ----------
// hozircha ko'rsatilmaydi (foydalanuvchi talabi, 2026-10-09) — kerak bo'lsa renderActiveSubjectTopics ga badgeCollectionHtml qaytariladi
function topicDone(grade, subject, topic) {
  return typeof MR !== "undefined" && MR.get(grade.id + "|" + subject.id + "|" + topic.id).done;
}

function badgeCollectionHtml(grade, subject) {
  if (typeof MR === "undefined" || !subject.topics.some(function (t) { return !!t.simPlan; })) return "";
  let done = 0;
  const cells = subject.topics.map(function (topic, i) {
    const ok = topicDone(grade, subject, topic);
    if (ok) done++;
    return '<a class="badge-cell" href="' + topicHref(grade.id, subject.id, topic.id) + '#interaktiv" title="' +
      topic.title.replace(/"/g, "&quot;") + '">' + MR.badgeSvg(i, ok, 28) + '</a>';
  }).join("");
  return (
    '<div class="badge-board">' +
      '<div class="badge-board-head"><b>Nishonlar to\'plami</b><span>' + done + ' / ' + subject.topics.length + '</span></div>' +
      '<div class="badge-board-bar"><span style="width:' + Math.round(done / subject.topics.length * 100) + '%"></span></div>' +
      '<div class="badge-grid">' + cells + '</div>' +
      '<p class="badge-board-foot">Har bir mavzuning mashqida Qiyin darajadan o\'tsangiz, shu yerga nishon qo\'shiladi. Natijalar faqat shu brauzerda saqlanadi.</p>' +
    '</div>'
  );
}

// ko'rgazma (iframe) o'z balandligini yuborsa — ichki aylantirishsiz to'liq ko'rsatiladi
window.addEventListener("message", function (e) {
  if (!e.data || e.data.type !== "mathrun:height") return;
  document.querySelectorAll("iframe").forEach(function (f) {
    if (f.contentWindow === e.source) f.style.height = Math.max(200, Math.ceil(e.data.h)) + "px";
  });
});
// test oynasiga sahifa qancha surilganini yuboradi — testning yuqori paneli (belgilanganlar, «Testni yakunlash») ko'rinib turadi
(function () {
  let raf = 0;
  function send() {
    raf = 0;
    const frames = document.querySelectorAll("iframe.embed-frame-test");
    if (!frames.length) return;
    const nav = document.getElementById("topic-steps");
    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    frames.forEach(function (f) {
      if (!f.contentWindow || f.offsetParent === null) return;
      try { f.contentWindow.postMessage({ type: "mathrun:scroll", top: navBottom - f.getBoundingClientRect().top }, "*"); } catch (e) {}
    });
  }
  function later() { if (!raf) raf = requestAnimationFrame(send); }
  window.addEventListener("scroll", later, { passive: true });
  window.addEventListener("resize", later);
  window.addEventListener("message", function (e) { if (e.data && e.data.type === "mathrun:height") later(); });
})();
// yuqori menyu yopishib turadi (layout.js) — sahifani surishda uning balandligi hisobga olinadi
function stickyHeaderHeight() {
  const h = document.querySelector(".site-header--sticky");
  return h ? h.offsetHeight : 0;
}
// test oynasi so'raganda — sahifa oyna boshiga (yoki oyna ichidagi y joyga) suriladi
window.addEventListener("message", function (e) {
  if (!e.data || e.data.type !== "mathrun:top") return;
  document.querySelectorAll("iframe").forEach(function (f) {
    if (f.contentWindow !== e.source) return;
    const y = f.getBoundingClientRect().top + window.pageYOffset + (e.data.y || 0) - 80 - stickyHeaderHeight();
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  });
});

// rang mavzusi (0..4): ma'ruza sahifasidagi bilan bir xil — ma'ruza fayli nomidan (maruza.js da ham shunday), yo'q bo'lsa mavzu id dan
function topicTema(topic) {
  const u = topic.lecture && topic.lecture.embedUrl;
  const nom = u ? u.split("/").pop().replace(/\.html$/, "") : String(topic.id || "");
  let h = 2166136261;
  for (let i = 0; i < nom.length; i++) h = Math.imul(h ^ nom.charCodeAt(i), 16777619) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h = (h ^ (h >>> 13)) >>> 0;
  return h % 5;
}
// mavzu kartochkasi (sinf sahifasi va Interaktiv darslar bo'limi uchun umumiy)
function topicCardHtml(topic, i, href, parts, btn, interactiveFirst) {
  const icon = topic.icon
    ? '<img src="' + topic.icon + '" alt="" width="72" height="72" loading="lazy" decoding="async">'
    : '<span class="tc-num">' + parts.num.replace(/\.$/, "") + '</span>';
  const dots = reviewDot(topic);
  // ma'ruza bo'lmasa — Interaktiv asosiy tugma; yangi simulyatorli darslar (newSim) — yashil
  const bInt = topic.interactive ? btn("Interaktiv", "#interaktiv", interactiveFirst || !topicHasLecture(topic), topic.newSim ? " topic-btn--new" : "") : "";
  const bLec = topicHasLecture(topic) ? btn("Ma'ruza", "#maruza", !interactiveFirst) : "";
  return (
    '<li class="topic-card" data-tema="' + topicTema(topic) + '">' +
      '<a class="tc-main" href="' + href + (interactiveFirst ? '#interaktiv' : '') + '">' +
        '<span class="tc-icon">' + icon + '</span>' +
        '<span class="tc-title"><b>' + parts.num + '</b> ' + parts.title + '</span>' +
      '</a>' +
      ((dots || topic.page) ? '<span class="tc-meta">' + dots + (topic.page ? '<span class="tc-page admin-only">' + topic.page + '</span>' : '') + '</span>' : '') +
      '<span class="tc-actions">' +
        (interactiveFirst ? bInt + bLec : bLec + bInt) +
        (topic.test ? btn("Test", "#test", false) : "") +
      '</span>' +
    '</li>'
  );
}

function renderActiveSubjectTopics(grade) {
  const container = document.getElementById("subjects-container");
  const subject = findSubject(grade, activeGradeSubjectId);
  if (!container || !subject) return;

  // kartochkalar: ikonka (yoki raqam) · raqam va nom · holat nuqtalari va darslik beti · Ma'ruza / Interaktiv / Test tugmalari
  const rowsHtml = subject.topics.map(function (topic, i) {
    const href = topicHref(grade.id, subject.id, topic.id);
    const parts = splitTopicTitle(topic.title, i);
    const btn = function (label, anchor, primary, extra) {
      return '<a class="topic-btn' + (primary ? ' topic-btn--primary' : '') + (extra || '') + '" href="' + href + anchor + '">' + label + '</a>';
    };
    return topicCardHtml(topic, i, href, parts, btn, false);
  }).join("");

  // nuqtalar izohi — ro'yxat tepasida
  container.innerHTML = '<p class="dot-legend"><span><i class="review-dot blue"></i>Ma\'ruza yuklangan</span><span><i class="review-dot green"></i>Simulyator tayyor</span><span><i class="review-dot yellow"></i>Tuzatildi, tasdiq kutilmoqda</span><span><i class="review-dot"></i>Tekshirish kerak</span></p>' +
    '<ol class="topic-cards">' + rowsHtml + '</ol>' +
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
  // nuqtalar: tekshirish belgisi (qizil/sariq) yoki ma'ruza yuklangan (ko'k) bo'lsa — sarlavha yonida
  if (topic.review || topicHasLecture(topic)) titleEl.insertAdjacentHTML("beforeend", reviewDot(topic));
  const pageEl = document.getElementById("topic-page");
  /* darslik beti — faqat adminga (saytda kitob betlari ko'rsatilmaydi) */
  if (pageEl) pageEl.innerHTML = topic.page ? '<span class="admin-only">' + topic.page + '</span>' : "";

  if (topic.lecture && topic.lecture.embedUrl) {
    // maruza/ dagi kitob sahifalari ham LESSON_VER bilan yangilanadi
    const mv = typeof LESSON_VER !== "undefined" && topic.lecture.embedUrl.indexOf("maruza/") === 0 ? "?v=" + LESSON_VER : "";
    lectureEl.innerHTML = '<iframe class="embed-frame" scrolling="no" data-src="' + topic.lecture.embedUrl + mv + '" allowfullscreen></iframe>';
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
    // simulyatsiya rejasi bor mavzularda ma'ruza yozilmaydi — bo'sh blok yashiriladi
    if (topic.simPlan) document.getElementById("maruza").style.display = "none";
  }

  // simPlan — yasaladigan simulyatsiyaning qisqa rejasi (ko'rgazma ostida ko'rsatiladi)
  // reja faqat adminga ko'rinadi (.admin-only); o'quvchiga — «tez orada» yozuvi
  const planHtml = topic.simPlan
    ? '<div class="sim-plan admin-only"><div class="sim-plan-title">Simulyatsiya rejasi</div><p>' + topic.simPlan + '</p></div>'
    : "";
  if (topic.interactive) {
    const lv = typeof LESSON_VER !== "undefined" ? (topic.interactive.indexOf("?") < 0 ? "?v=" : "&v=") + LESSON_VER : "";
    interactiveEl.innerHTML = '<iframe class="embed-frame embed-frame-tall" data-src="' + topic.interactive + lv + '" allowfullscreen></iframe>' + planHtml;
  } else {
    interactiveEl.innerHTML = '<div class="placeholder">🚧 Interaktiv ko\'rgazma tez orada qo\'shiladi</div>' + planHtml;
  }

  if (topic.test) {
    // test oynasi ichida aylantirish yo'q — balandligi testga moslashadi (mathrun:height)
    testEl.innerHTML = '<iframe class="embed-frame embed-frame-tall embed-frame-test" scrolling="no" data-src="' + topic.test + '" allowfullscreen></iframe>';
  } else {
    testEl.innerHTML = '<div class="placeholder">🚧 Interaktiv test tez orada qo\'shiladi</div>';
  }

  initTopicSteps();
}

// Mavzu bosqichlari: Nazariya → Interaktiv panel → Test. Bir vaqtda bitta bo'lim ko'rinadi;
// iframe faqat bo'lim birinchi ochilganda yuklanadi (data-src → src). Manzildagi #maruza / #interaktiv / #test saqlanadi.
function initTopicSteps() {
  const nav = document.getElementById("topic-steps");
  if (!nav) return;
  const steps = [
    { id: "maruza", label: "Nazariya" },
    { id: "interaktiv", label: "Interaktiv panel" },
    { id: "test", label: "Test" },
  ].filter(function (st) {
    const el = document.getElementById(st.id);
    return el && el.style.display !== "none";
  });
  if (!steps.length) return;

  nav.innerHTML = steps.map(function (st, i) {
    return '<button type="button" class="topic-step" data-step="' + st.id + '"><b>' + (i + 1) + '</b>' + st.label + '</button>';
  }).join("");

  // har bo'lim ostida — keyingi bosqichga o'tish tugmasi
  steps.forEach(function (st, i) {
    const next = steps[i + 1];
    if (!next) return;
    document.getElementById(st.id).insertAdjacentHTML("beforeend",
      '<div class="step-next"><button type="button" class="step-next-btn" data-step="' + next.id + '">Keyingi bosqich: ' + next.label + ' →</button></div>');
  });

  // «PDF yuklab olish» — bosqichlar qatorida, o'ngda (faqat Nazariya ochiq va ma'ruzaning tayyor PDF fayli bo'lsa: pdf/royxat.json)
  let joriy = null, pdfBtn = null;
  const frame = document.querySelector("#maruza iframe");
  const kalit = frame ? ((frame.dataset.src || frame.getAttribute("src") || "").match(/^maruza\/([^\/?#]+)\.html/) || [])[1] : null;
  if (kalit && window.fetch) {
    fetch("pdf/royxat.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw r; return r.json(); })
      .then(function (j) {
        const m = j && j[kalit];
        if (!m || !m.fayl) return;
        pdfBtn = document.createElement("a");
        pdfBtn.className = "topic-pdf";
        pdfBtn.href = "pdf/" + encodeURIComponent(m.fayl) + (m.v ? "?v=" + m.v : "");
        pdfBtn.target = "_blank";
        pdfBtn.rel = "noopener";
        pdfBtn.title = "PDF yuklab olish";
        pdfBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>PDF yuklab olish</span>';
        pdfBtn.hidden = joriy !== "maruza";
        nav.appendChild(pdfBtn);
      }, function () {});
  }

  function show(id, scroll) {
    joriy = id;
    if (pdfBtn) pdfBtn.hidden = id !== "maruza";
    steps.forEach(function (st) {
      const el = document.getElementById(st.id);
      const on = st.id === id;
      el.hidden = !on;
      if (on) el.querySelectorAll("iframe[data-src]").forEach(function (f) {
        f.src = f.dataset.src;
        f.removeAttribute("data-src");
      });
    });
    nav.querySelectorAll(".topic-step").forEach(function (b) { b.classList.toggle("active", b.dataset.step === id); });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    // bosqich almashganda — bo'lim boshiga. Panel yopishib turgani uchun uning asl joyi oldingi element ostidan olinadi
    if (scroll && nav.previousElementSibling) {
      const y = nav.previousElementSibling.getBoundingClientRect().bottom + window.pageYOffset - stickyHeaderHeight();
      if (window.pageYOffset > y) window.scrollTo(0, Math.max(0, y));
    }
  }

  document.addEventListener("click", function (e) {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    show(b.dataset.step, true);
  });

  const fromHash = location.hash.slice(1);
  show(steps.some(function (st) { return st.id === fromHash; }) ? fromHash : steps[0].id, false);
  window.scrollTo(0, 0);
}

// ---------- Ko'rgazmalar galereyasi ----------
// qizil nuqta — simulyatorni tekshirish kerak: hali tekshirilmagan yoki kamchiligi bor (data.js da review: true; foydalanuvchi «tayyor» desa o'chiriladi)
function reviewDot(topic) {
  // review: true — qizil (hali tekshirilmagan / kamchiligi bor); review: "sariq" — o'quvchi sifatida sinab, tuzatildi, foydalanuvchi tasdig'i kutilmoqda
  // yashil — yangi simulyator tayyor (tekshirilgan, review yo'q); ko'k — ma'ruza (darslikdan) yuklangan
  let dot = "";
  if (topic.review === "sariq") dot = '<span class="review-dot yellow" title="Sinab ko\'rildi va tuzatildi — tasdiqlash kutilmoqda" aria-label="tasdiqlash kutilmoqda"></span>';
  else if (topic.review) dot = '<span class="review-dot" title="Tekshirish kerak — kamchiligi bor yoki hali tekshirilmagan" aria-label="tekshirish kerak"></span>';
  else if (topic.newSim && topic.interactive) dot = '<span class="review-dot green" title="Simulyator tayyor" aria-label="simulyator tayyor"></span>';
  if (topicHasLecture(topic)) dot += '<span class="review-dot blue" title="Ma\'ruza yuklangan" aria-label="ma\'ruza yuklangan"></span>';
  return dot;
}

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
        const btn = function (label, anchor, primary, extra) {
          return '<a class="topic-btn' + (primary ? ' topic-btn--primary' : '') + (extra || '') + '" href="' + href + anchor + '">' + label + '</a>';
        };
        return topicCardHtml(topic, i, href, parts, btn, true);
      }).join("");
      if (!rows) return "";
      return (
        (grade.subjects.length > 1 ? '<div class="gallery-subject">' + subject.name + '</div>' : "") +
        '<ol class="topic-cards">' + rows + '</ol>'
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

  // 1–4 sinflar: simulyatorlar ro'yxati mathrunner-web/js/sims.js dan olinadi va eng yuqoriga qo'yiladi
  const ver = typeof LESSON_VER !== "undefined" ? LESSON_VER : 1;
  import(new URL("mathrunner-web/js/sims.js?v=" + ver, location.href).href).then(function (mod) {
    const byGrade = {};
    Object.keys(mod.SIMS).forEach(function (key) {
      const m = key.match(/^(\d)-(\d)-(\d+)$/);
      if (m) (byGrade[m[1]] = byGrade[m[1]] || []).push({ g: m[1], c: m[2], b: Number(m[3]), sim: mod.SIMS[key] });
    });
    const grades = Object.keys(byGrade).sort();
    if (!grades.length) return;
    let n = 0;
    const html = grades.map(function (g) {
      const rows = byGrade[g].sort(function (x, y) { return x.c - y.c || x.b - y.b; }).map(function (t) {
        n++;
        const href = "mathrunner-web/index.html#/sim/" + t.g + "/" + t.c + "/" + t.b;
        return (
          '<li class="topic-card">' +
            '<a class="tc-main" href="' + href + '">' +
              '<span class="tc-icon"><span class="tc-num">' + t.b + '</span></span>' +
              '<span class="tc-title">' + (t.sim.name || t.sim.title) + '</span>' +
            '</a>' +
            '<span class="tc-meta">' + (t.sim.review ? '<span class="review-dot" title="Tekshirish kerak — kamchiligi bor yoki hali tekshirilmagan"></span>' : '') + '<span class="tc-page">' + t.c + '-chorak</span></span>' +
            '<span class="tc-actions"><a class="topic-btn topic-btn--primary topic-btn--new" href="' + href + '">Interaktiv</a></span>' +
          '</li>'
        );
      }).join("");
      return (
        '<section class="gallery-grade">' +
          '<h2 class="gallery-grade-title"><a href="mathrunner-web/index.html#/g/' + g + '">' + g + '-sinf</a></h2>' +
          '<ol class=\"topic-cards\">' + rows + '</ol>' +
        '</section>'
      );
    }).join("");
    el.insertAdjacentHTML("afterbegin", html);
    const foot = el.querySelector(".topic-list-foot");
    if (foot) foot.textContent = "Jami " + (total + n) + " ta interaktiv dars";
  }).catch(function () {});
}
