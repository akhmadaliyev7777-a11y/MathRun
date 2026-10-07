// base — sahifa ichki papkada bo'lsa (masalan mathrunner-web/) asosiy saytga yo'l, masalan "../"
// active — menyuda ajratib ko'rsatiladigan bo'lim: "home" | "lessons" | "games" | "primary"
function renderSiteHeader(base, active) {
  base = base || "";
  const cls = (key) => (active === key ? ' class="active"' : "");
  const root = document.getElementById("site-header-root");
  if (!root) return;

  root.innerHTML =
    '<header class="site-header">' +
      '<div class="site-header-left">' +
        '<button id="menu-toggle-btn" class="menu-toggle" aria-label="Menyu">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        '<a class="site-logo" href="' + base + 'index.html">MathRun</a>' +
      "</div>" +
      '<nav class="site-nav">' +
        '<a href="' + base + 'index.html"' + cls("home") + '>Bosh sahifa</a>' +
        '<a href="' + base + 'korgazmalar.html"' + cls("lessons") + '>Interaktiv darslar</a>' +
        '<a href="' + base + 'mathrunner-web/index.html#/games" data-nav="games"' + cls("games") + '>Fikrlash o\'yinlari</a>' +
        '<a href="' + base + 'mathrunner-web/index.html" data-nav="primary"' + cls("primary") + '>Boshlang\'ich sinflar</a>' +
      "</nav>" +
      '<button type="button" id="search-open-btn" class="search-open" aria-label="Mavzu qidirish" title="Mavzu qidirish (/)">' + SEARCH_ICON + "</button>" +
    "</header>" +
    '<div id="site-search" class="site-search" hidden>' +
      '<div class="site-search-box" role="dialog" aria-label="Mavzu qidirish">' +
        '<div class="site-search-field">' + SEARCH_ICON +
          '<input id="site-search-input" type="search" autocomplete="off" placeholder="Mavzuni yozing: kasr, foiz, tenglama..." aria-controls="site-search-list">' +
          '<button type="button" id="site-search-close" class="site-search-close" aria-label="Yopish">Esc</button>' +
        "</div>" +
        '<div id="site-search-chips" class="site-search-chips" hidden></div>' +
        '<ul id="site-search-list" class="site-search-list" role="listbox"></ul>' +
      "</div>" +
    "</div>" +
    '<div id="side-drawer" class="side-drawer">' +
      '<div class="side-drawer-inner">' +
        '<button id="drawer-close-btn" class="drawer-close" aria-label="Yopish">&times;</button>' +
        '<a href="' + base + 'index.html" class="drawer-link">Bosh sahifa</a>' +
        '<a href="' + base + 'korgazmalar.html" class="drawer-link">Interaktiv darslar</a>' +
        '<a href="' + base + 'mathrunner-web/index.html#/games" class="drawer-link">Fikrlash o\'yinlari</a>' +
        '<a href="' + base + 'mathrunner-web/index.html" class="drawer-link">Boshlang\'ich sinflar (1–4)</a>' +
        '<a href="' + base + 'settings.html" class="drawer-link">Sozlamalar</a>' +
        '<a href="' + base + 'info.html" class="drawer-link">Ma\'lumot</a>' +
        '<div class="drawer-divider"></div>' +
        '<a href="' + base + 'admin.html" id="drawer-admin-link" class="drawer-link" target="_blank" rel="noopener">Admin panel</a>' +
        '<a href="' + base + 'login.html" id="drawer-login-link" class="drawer-link">Kirish</a>' +
        '<button id="drawer-logout-btn" class="drawer-link drawer-logout" hidden>Chiqish</button>' +
      "</div>" +
    "</div>" +
    '<div id="drawer-overlay" class="drawer-overlay" hidden></div>';

  const toggleBtn = document.getElementById("menu-toggle-btn");
  const closeBtn = document.getElementById("drawer-close-btn");
  const drawer = document.getElementById("side-drawer");
  const overlay = document.getElementById("drawer-overlay");

  function openDrawer() {
    drawer.classList.add("open");
    overlay.hidden = false;
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.hidden = true;
  }

  toggleBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  initSiteSearch(base);

  if (window.onAuthReadyForMenu) window.onAuthReadyForMenu();
}

// ---------- Mavzu qidirish (yuqoridagi lupa) ----------
// 5–11 sinflar — js/data.js (SITE_DATA), 1–4 sinflar — mathrunner-web (curriculum.json + topicTitles.js).
// Ma'lumot birinchi ochilganda yuklanadi; yozilgan so'zlarga mos mavzular darhol chiqadi.

const SEARCH_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">' +
  '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L20 20"/></svg>';

// apostroflar (o', g', ʻ, ’) va katta-kichik harf farqini olib tashlaydi
function searchNorm(str) {
  return String(str).toLowerCase().replace(/[\u2018\u2019\u02bb\u02bc'`]/g, "").replace(/\s+/g, " ").trim();
}

// o'zbekcha qo'shimchalarni kesib, so'z o'zagini qaytaradi: kasrlarni → kasr, tenglamalar → tenglama
const SEARCH_SUFFIXES = ["larining", "laridan", "larida", "lariga", "larini", "larning", "lardan", "larda", "larga",
  "larni", "lari", "ning", "dagi", "ning", "lar", "dan", "ini", "ga", "da", "ni", "si", "ka", "qa"];
function searchStem(word) {
  let w = word;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < SEARCH_SUFFIXES.length; i++) {
      const suf = SEARCH_SUFFIXES[i];
      if (w.length - suf.length >= 3 && w.slice(-suf.length) === suf) { w = w.slice(0, -suf.length); break; }
    }
  }
  return w;
}

function initSiteSearch(base) {
  const wrap = document.getElementById("site-search");
  const input = document.getElementById("site-search-input");
  const list = document.getElementById("site-search-list");
  const box = wrap.querySelector(".site-search-box");
  const chips = document.getElementById("site-search-chips");
  // wide — "Barcha natijalar" bosilganda ochiladigan katta oyna; gradeFilter — katta oynada tanlangan sinf
  let index = null, loading = null, active = 0, wide = false, gradeFilter = null;
  const COMPACT_LIMIT = 6;

  function loadScript(src) {
    return new Promise(function (ok, fail) {
      const sc = document.createElement("script");
      sc.src = src; sc.onload = ok; sc.onerror = fail;
      document.head.appendChild(sc);
    });
  }

  function buildIndex() {
    if (loading) return loading;
    const items = [];
    const upper = (typeof SITE_DATA !== "undefined" ? Promise.resolve() : loadScript(base + "js/data.js")).then(function () {
      if (typeof SITE_DATA === "undefined") return;
      SITE_DATA.grades.forEach(function (g) {
        g.subjects.forEach(function (sub) {
          sub.topics.forEach(function (t) {
            const title = t.title.replace(/^\d+(\.\d+)*\.?\s+/, "");
            items.push({
              grade: Number(g.id), title: title, meta: g.name + " · " + sub.name.replace(/\s*\(.*\)\s*$/, ""), interactive: !!t.interactive, newSim: !!t.newSim,
              href: base + "mavzu.html?sinf=" + g.id + "&fan=" + sub.id + "&mavzu=" + t.id + (t.interactive ? "#interaktiv" : "")
            });
          });
        });
      });
    }).catch(function () {});
    // 1–4 sinflar: chorak sahifasiga olib boradi; takrorlash va yakuniy testlar ro'yxatga kirmaydi
    const primary = import(new URL(base + "mathrunner-web/js/topicTitles.js", location.href).href).then(function (mod) {
      Object.keys(mod.TOPIC_TITLES).forEach(function (key) {
        const m = key.match(/^g(\d)_c(\d)$/);
        if (!m) return;
        mod.TOPIC_TITLES[key].forEach(function (title) {
          if (/takrorlash|yakuniy test/i.test(title)) return;
          items.push({ grade: Number(m[1]), title: title, meta: m[1] + "-sinf · " + m[2] + "-chorak", interactive: false,
            href: base + "mathrunner-web/index.html#/g/" + m[1] + "/c/" + m[2] });
        });
      });
    }).catch(function () {});
    loading = Promise.all([upper, primary]).then(function () {
      items.forEach(function (it, k) {
        it.order = k;
        it.norm = searchNorm(it.title);
        it.normAll = it.norm + " " + searchNorm(it.meta);
        it.stems = it.norm.split(/[^a-z0-9]+/).filter(Boolean).map(searchStem);
      });
      index = items;
    });
    return loading;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; });
  }

  // so'z boshlanishini qalin qilib ko'rsatadi (apostrofsiz solishtirib)
  function highlight(title, words) {
    let html = escapeHtml(title);
    words.forEach(function (w) {
      if (w.length < 2) return;
      const pattern = w.split("").map(function (ch) { return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("['\u2018\u2019\u02bb\u02bc`]?");
      html = html.replace(new RegExp("(" + pattern + ")", "i"), "<mark>$1</mark>");
    });
    return html;
  }

  // so'rov bo'yicha natijalar: full — barcha so'zlar mos, similar — bir qismi mos (o'xshash mavzular)
  function search(q) {
    const words = q.split(" ").filter(Boolean);
    const stems = words.map(searchStem);

    // har bir so'z: aynan bor bo'lsa — kuchli moslik, faqat o'zagi mos bo'lsa (kasrlarni → kasr) — kuchsizroq
    function wordScore(it, w, st) {
      if (it.norm.indexOf(w) === 0) return 3;
      if (it.norm.indexOf(" " + w) >= 0) return 2.5;
      if (it.normAll.indexOf(w) >= 0) return 1.5;
      if (st.length >= 3 && it.stems.some(function (t) { return t.indexOf(st) === 0 || (t.length >= 4 && st.indexOf(t) === 0); })) return 1;
      return 0;
    }

    const cur = currentGrade();
    const full = [], similar = [];
    index.forEach(function (it) {
      let score = 0, hit = 0;
      words.forEach(function (w, i) { const sc = wordScore(it, w, stems[i]); if (sc) { hit++; score += sc; } });
      if (!hit) return;
      const r = { it: it, score: score + (it.interactive ? 0.3 : 0) + (it.grade === cur ? 0.6 : 0) };
      if (hit === words.length) full.push(r);
      else if (words.length > 1 && hit >= Math.ceil(words.length / 2)) similar.push(r);
    });

    // joriy sinf (sahifa manzilidan) birinchi, qolganlari 1 → 11 tartibida
    function gradeRank(g) { return g === cur ? -1 : g; }
    function byGrade(a, b) { return gradeRank(a.it.grade) - gradeRank(b.it.grade) || b.score - a.score || a.it.order - b.it.order; }
    function byScore(a, b) { return b.score - a.score || a.it.order - b.it.order; }
    return { stems: stems, cur: cur, full: full, similar: similar, byGrade: byGrade, byScore: byScore };
  }

  function itemHtml(it, i, stems) {
    return '<li role="option"><a class="site-search-item' + (i === active ? " active" : "") + '" href="' + it.href + '" data-i="' + i + '">' +
      '<span class="site-search-title">' + highlight(it.title, stems) + "</span>" +
      '<span class="site-search-meta">' + escapeHtml(it.meta) + (it.interactive ? ' · <b class="' + (it.newSim ? "is-new" : "is-old") + '">Interaktiv</b>' : "") + "</span></a></li>";
  }

  function render() {
    const q = searchNorm(input.value);
    box.classList.toggle("site-search-box--wide", wide);
    chips.hidden = true;
    if (!q) {
      list.innerHTML = '<li class="site-search-empty">Masalan: <b>kasr</b>, <b>foiz</b>, <b>7-sinf tenglama</b>, <b>doira yuzi</b></li>';
      return;
    }
    if (!index) {
      list.innerHTML = '<li class="site-search-empty">Yuklanmoqda…</li>';
      buildIndex().then(render);
      return;
    }
    const res = search(q);
    const total = res.full.length + res.similar.length;
    if (!total) {
      list.innerHTML = '<li class="site-search-empty">«' + escapeHtml(input.value.trim()) + '» bo\'yicha mavzu topilmadi</li>';
      return;
    }
    if (wide) renderWide(res); else renderCompact(res, total);
    list.scrollTop = 0;
  }

  // ixcham ko'rinish: eng mos 6 ta mavzu va "Barcha natijalar" tugmasi
  function renderCompact(res, total) {
    const top = res.full.slice().sort(res.byScore).concat(res.similar.slice().sort(res.byScore)).slice(0, COMPACT_LIMIT);
    let html = top.map(function (r, i) { return itemHtml(r.it, i, res.stems); }).join("");
    if (total > top.length) {
      const grades = {};
      res.full.concat(res.similar).forEach(function (r) { grades[r.it.grade] = 1; });
      html += '<li><a href="#" class="site-search-item site-search-more' + (active === top.length ? " active" : "") + '" data-more="1" data-i="' + top.length + '">' +
        "<em>Barcha natijalarni ko'rish (" + total + ")</em><span>" + Object.keys(grades).length + " ta sinfda · katta oynada →</span></a></li>";
    }
    list.innerHTML = html;
  }

  // katta oyna: sinflar bo'yicha guruhlar, sinf tanlash tugmalari, o'xshash mavzular — cheklovsiz
  function renderWide(res) {
    const all = res.full.concat(res.similar);
    const counts = {};
    all.forEach(function (r) { counts[r.it.grade] = (counts[r.it.grade] || 0) + 1; });
    const grades = Object.keys(counts).map(Number).sort(function (a, b) { return a - b; });
    if (gradeFilter !== null && !counts[gradeFilter]) gradeFilter = null;
    chips.hidden = false;
    chips.innerHTML =
      '<button type="button" class="site-search-chip' + (gradeFilter === null ? " active" : "") + '" data-g="">Hammasi <span>' + all.length + "</span></button>" +
      grades.map(function (g) {
        return '<button type="button" class="site-search-chip' + (gradeFilter === g ? " active" : "") + '" data-g="' + g + '">' + g + "-sinf <span>" + counts[g] + "</span></button>";
      }).join("");

    const keep = function (r) { return gradeFilter === null || r.it.grade === gradeFilter; };
    const full = res.full.filter(keep).sort(res.byGrade);
    const similar = res.similar.filter(keep).sort(res.byGrade);
    let html = "", n = 0, lastGrade = null;
    const fullCount = {};
    full.forEach(function (r) { fullCount[r.it.grade] = (fullCount[r.it.grade] || 0) + 1; });
    full.forEach(function (r) {
      if (r.it.grade !== lastGrade) {
        lastGrade = r.it.grade;
        html += '<li class="site-search-group">' + r.it.grade + "-sinf" + (r.it.grade === res.cur ? " · siz shu sinfdasiz" : "") +
          "<span>" + fullCount[r.it.grade] + " ta</span></li>";
      }
      html += itemHtml(r.it, n++, res.stems);
    });
    if (similar.length) {
      html += '<li class="site-search-group site-search-group--similar">O\'xshash mavzular<span>' + similar.length + " ta</span></li>";
      similar.forEach(function (r) { html += itemHtml(r.it, n++, res.stems); });
    }
    list.innerHTML = html;
  }

  function expand() {
    wide = true; active = 0; gradeFilter = null;
    render();
    input.focus();
  }

  chips.addEventListener("click", function (e) {
    const btn = e.target.closest(".site-search-chip");
    if (!btn) return;
    gradeFilter = btn.dataset.g === "" ? null : Number(btn.dataset.g);
    active = 0;
    render();
    input.focus();
  });

  // sahifa qaysi sinfga tegishli: ?sinf=7 yoki 1–4 bo'limida #/g/3/...
  function currentGrade() {
    const m = location.search.match(/[?&]sinf=(\d+)/) || location.hash.match(/^#\/g\/(\d)/);
    return m ? Number(m[1]) : null;
  }

  function setActive(i) {
    const items = list.querySelectorAll(".site-search-item");
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach(function (el, k) { el.classList.toggle("active", k === active); });
    items[active].scrollIntoView({ block: "nearest" });
  }

  function open() {
    wide = false; active = 0; gradeFilter = null;
    wrap.hidden = false;
    document.body.classList.add("search-open-body");
    input.focus();
    input.select();
    render();
    buildIndex();
  }
  function close() {
    wrap.hidden = true;
    document.body.classList.remove("search-open-body");
  }

  document.getElementById("search-open-btn").addEventListener("click", open);
  document.getElementById("site-search-close").addEventListener("click", close);
  wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
  input.addEventListener("input", function () { active = 0; render(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") {
      const el = list.querySelectorAll(".site-search-item")[active];
      if (!el) return;
      e.preventDefault();
      if (el.dataset.more) expand(); else { close(); location.href = el.href; }
    } else if (e.key === "Escape") {
      // brauzer qidiruv maydonini Esc bilan tozalab yubormasin — yozilgan so'z saqlanadi
      e.preventDefault();
      // katta oynada Esc — ixcham ko'rinishga qaytadi, ikkinchi marta — yopadi
      if (wide) { wide = false; active = 0; render(); } else close();
    }
  });
  // 1–4 sinf bo'limida manzil faqat # qismida o'zgaradi — sahifa qayta yuklanmaydi, shuning uchun qidiruv yopiladi
  list.addEventListener("click", function (e) {
    const el = e.target.closest(".site-search-item");
    if (!el) return;
    if (el.dataset.more) { e.preventDefault(); expand(); } else close();
  });
  // "/" tugmasi — qidiruvni ochadi (matn yozilayotgan joyda emas)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || !wrap.hidden) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement && document.activeElement.isContentEditable)) return;
    e.preventDefault();
    open();
  });
}
