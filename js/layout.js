// Yuqori menyu va chap panel uchun chiziqli belgilar (20 px, admin panel uslubida)
function navIcon(d) {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
}
const NAV_ICONS = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  grades: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.8c0 1.5 2.5 3.2 5.5 3.2s5.5-1.7 5.5-3.2V11"/><path d="M21.5 9v5"/>',
  lessons: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M10.2 8.2v5l4.3-2.5z"/><path d="M8 21h8"/>',
  games: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7 12.5h3.5M8.75 10.75v3.5"/><path d="M15.5 11.5h.01M17.5 13.5h.01" stroke-width="2.6"/>',
  results: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
  about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01" stroke-width="2.6"/>',
  admin: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  login: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="m10 16 4-4-4-4"/><path d="M14 12H4"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};

// sahifaga qarab menyuda qaysi band ajratiladi: home | grades | lessons | games | results | about
function siteActiveKey(active) {
  const path = location.pathname;
  if (/\/mathrunner-web\//.test(path)) return /^#\/(games|tug)/.test(location.hash) ? "games" : "grades";
  const page = path.split("/").pop() || "index.html";
  if (page === "index.html") return location.hash === "#grades-section" ? "grades" : "home";
  const byPage = { "korgazmalar.html": "lessons", "sinf.html": "grades", "mavzu.html": "grades", "test.html": "grades", "mening.html": "results", "info.html": "about" };
  if (byPage[page]) return byPage[page];
  return { home: "home", lessons: "lessons", games: "games", primary: "grades" }[active] || "";
}

// base — sahifa ichki papkada bo'lsa (masalan mathrunner-web/) asosiy saytga yo'l, masalan "../"
// active — menyuda ajratib ko'rsatiladigan bo'lim: "home" | "lessons" | "games" | "primary"
function renderSiteHeader(base, active) {
  base = base || "";
  window.SITE_BASE = base;
  const root = document.getElementById("site-header-root");
  if (!root) return;
  // tungi rejim tugmasi — <head> dagi mavzu skripti bor sahifalarda (html[data-theme]):
  // asosiy sayt, 1–4-sinf bo'limi (mathrunner-web) va admin panel
  const themeOn = document.documentElement.hasAttribute("data-theme");
  // yuqori menyu asosiy saytda yopishib turadi; 1–4-sinf bo'limida (o'z yopishgan panellari bor) — oddiy
  const sticky = base === "";
  const I = function (k) { return navIcon(NAV_ICONS[k]); };
  const logo = '<img class="site-logo-img" src="' + base + 'logo.png?v=1" alt="Mathlearn" width="185" height="36">';
  const dlink = function (key, href, text, extra) {
    return '<a href="' + base + href + '" class="drawer-link' + (extra || "") + '" data-key="' + key + '">' + I(key) + "<span>" + text + "</span></a>";
  };

  root.innerHTML =
    '<header class="site-header' + (sticky ? " site-header--sticky" : "") + '">' +
      '<div class="site-header-left">' +
        '<button type="button" id="menu-toggle-btn" class="menu-toggle" aria-label="Menyu" aria-controls="side-drawer" aria-expanded="false">' + I("menu") + "</button>" +
        '<a class="site-logo" href="' + base + 'index.html">' + logo + "</a>" +
      "</div>" +
      '<nav class="site-nav" aria-label="Asosiy menyu">' +
        '<a href="' + base + 'index.html" data-key="home">Bosh sahifa</a>' +
        '<a href="' + base + 'index.html#grades-section" data-key="grades" data-nav="primary">Sinflar</a>' +
        '<a href="' + base + 'korgazmalar.html" data-key="lessons">Interaktiv</a>' +
        '<a href="' + base + 'mathrunner-web/index.html#/games" data-key="games" data-nav="games">O\'yinlar</a>' +
      "</nav>" +
      '<div class="site-header-right">' +
        '<button type="button" id="site-search-trigger" class="site-search-trigger" data-search-open aria-label="Mavzu qidirish" title="Mavzu qidirish (/)">' +
          SEARCH_ICON + "<span>Mavzu qidirish…</span><kbd>/</kbd></button>" +
        '<button type="button" id="site-login-btn" class="site-login-btn">Kirish</button>' +
        (themeOn ? '<button type="button" id="theme-toggle-btn" class="theme-toggle" aria-label="Tungi rejim" title="Tungi rejim">' + MOON_ICON + "</button>" : "") +
        '<button type="button" id="search-open-btn" class="search-open" data-search-open aria-label="Mavzu qidirish" title="Mavzu qidirish (/)">' + SEARCH_ICON + "</button>" +
      "</div>" +
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
    '<aside id="side-drawer" class="side-drawer" aria-label="Menyu">' +
      '<div class="side-drawer-inner">' +
        '<div class="drawer-head">' +
          '<a class="site-logo" href="' + base + 'index.html">' + logo + "</a>" +
          '<button type="button" id="drawer-close-btn" class="drawer-close" aria-label="Yopish">' + I("close") + "</button>" +
        "</div>" +
        '<div class="drawer-label">O\'rganish</div>' +
        dlink("home", "index.html", "Bosh sahifa") +
        dlink("grades", "index.html#grades-section", "Sinflar") +
        dlink("lessons", "korgazmalar.html", "Interaktiv darslar") +
        dlink("games", "mathrunner-web/index.html#/games", "Fikrlash o'yinlari") +
        dlink("results", "mening.html", "Mening natijalarim") +
        '<div class="drawer-divider"></div>' +
        dlink("about", "info.html", "Mathlearn haqida") +
        // pastki qism: tungi rejim, hisob (kirgan — ism, natijalar, chiqish; kirmagan — «Kirish»), kichik «Muallif uchun kirish»
        '<div class="drawer-bottom">' +
          (themeOn ? '<button type="button" id="drawer-theme-btn" class="drawer-link drawer-theme" role="switch" aria-checked="false">' + MOON_ICON + '<span>Tungi rejim</span><i class="drawer-switch" aria-hidden="true"></i></button>' : "") +
          '<div id="drawer-user-in" class="drawer-user" hidden>' +
            '<div class="drawer-user-card"><span class="site-user-ava" id="drawer-user-ava" aria-hidden="true"></span>' +
              '<span class="drawer-user-txt"><b id="drawer-user-name"></b><small id="drawer-user-mail"></small></span></div>' +
            '<a href="' + base + 'mening.html" class="drawer-link drawer-link--sm" data-key="results">' + I("results") + "<span>Mening natijalarim</span></a>" +
            '<a href="' + base + 'admin.html" id="drawer-admin-link" class="drawer-link drawer-link--sm drawer-admin" target="_blank" rel="noopener" hidden>' + I("admin") + "<span>Admin panel ↗</span></a>" +
            '<button type="button" id="drawer-logout-btn" class="drawer-link drawer-link--sm drawer-logout" hidden>' + I("logout") + "<span>Chiqish</span></button>" +
          "</div>" +
          '<button type="button" id="drawer-signin-btn" class="drawer-signin">' + I("login") + "<span>Kirish</span></button>" +
          '<a href="' + base + 'login.html" id="drawer-login-link" class="drawer-login-small">Muallif uchun kirish</a>' +
        "</div>" +
      "</div>" +
    "</aside>" +
    '<div id="drawer-overlay" class="drawer-overlay" hidden></div>';

  // menyuda hozirgi sahifa ajratib ko'rsatiladi (yuqori menyu va chap panel bir xil)
  function markActive() {
    const key = siteActiveKey(active);
    root.querySelectorAll(".site-nav a[data-key], .side-drawer .drawer-link[data-key]").forEach(function (a) {
      const on = a.dataset.key === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  markActive();
  window.addEventListener("hashchange", markActive);

  const header = root.querySelector(".site-header");
  const toggleBtn = document.getElementById("menu-toggle-btn");
  const closeBtn = document.getElementById("drawer-close-btn");
  const drawer = document.getElementById("side-drawer");
  const overlay = document.getElementById("drawer-overlay");

  function openDrawer() {
    drawer.classList.add("open");
    overlay.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open-body");
    setTimeout(function () { closeBtn.focus({ preventScroll: true }); }, 60);
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    overlay.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open-body");
  }

  toggleBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", function () { closeDrawer(); toggleBtn.focus({ preventScroll: true }); });
  overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  // bir sahifa ichidagi havola (#grades-section, 1–4-sinf bo'limi) bosilganda panel yopiladi
  drawer.addEventListener("click", function (e) { if (e.target.closest("a[href]")) closeDrawer(); });

  // surilganda yuqori menyu ostida yengil soya
  if (sticky) {
    const onScroll = function () { header.classList.toggle("is-scrolled", window.pageYOffset > 4); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  initSiteSearch(base);
  if (themeOn) initThemeToggle();

  if (window.onAuthReadyForMenu) window.onAuthReadyForMenu();
  // Kirish — Google bilan (auth.js). Firebase yuklanmagan bo'lsa — faqat xabar ko'rsatadi
  const loginBtn = document.getElementById("site-login-btn");
  function loginClick() {
    if (window.onSiteLoginClick && window.onSiteLoginClick(loginBtn)) return;
    let tip = document.getElementById("site-login-tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "site-login-tip"; tip.className = "site-login-tip"; tip.setAttribute("role", "status");
      tip.textContent = "Kirish hozir ishlamayapti — sahifani yangilab ko'ring";
      document.body.appendChild(tip);
    }
    tip.classList.add("on");
    clearTimeout(tip._t); tip._t = setTimeout(function () { tip.classList.remove("on"); }, 2200);
  }
  loginBtn.addEventListener("click", loginClick);
  // chap paneldagi «Kirish» — yuqoridagi tugma bilan bir xil (Google bilan kirish oynasi)
  document.getElementById("drawer-signin-btn").addEventListener("click", function () { closeDrawer(); loginClick(); });
}

// ---------- Tungi rejim (yuqoridagi oy / quyosh tugmasi va chap paneldagi almashtirgich) ----------
// Tanlov localStorage "mathlearn-theme" ("dark" | "light") da saqlanadi; tanlanmagan bo'lsa — qurilma sozlamasi.
// Sahifa ochilishidagi oq chaqnashning oldini <head> dagi bir qatorli skript oladi (window.mlApplyTheme).
const THEME_KEY = "mathlearn-theme";
const MOON_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';
const SUN_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';

function toggleSiteTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  window.mlThemeMem = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  html.setAttribute("data-theme", next);
  // sahifa ichidagi test oynasi (test.html) ham darhol almashadi
  document.querySelectorAll("iframe").forEach(function (f) {
    try {
      const w = f.contentWindow;
      if (w && w.mlApplyTheme) { w.mlThemeMem = next; w.mlApplyTheme(); }
    } catch (e) {}
  });
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle-btn");
  const sw = document.getElementById("drawer-theme-btn");
  if (!btn && !sw) return;
  const html = document.documentElement;
  function sync() {
    const dark = html.getAttribute("data-theme") === "dark";
    if (btn) {
      const label = dark ? "Kunduzgi rejim" : "Tungi rejim";
      btn.innerHTML = dark ? SUN_ICON : MOON_ICON;
      btn.setAttribute("aria-label", label);
      btn.title = label;
    }
    if (sw) sw.setAttribute("aria-checked", dark ? "true" : "false");
  }
  if (btn) btn.addEventListener("click", toggleSiteTheme);
  if (sw) sw.addEventListener("click", toggleSiteTheme);
  // boshqa oynada yoki qurilma sozlamasida almashsa — tugma belgisi ham yangilanadi
  if (window.MutationObserver) new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  sync();
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

  // lupa tugmasi (tor ekran) va yuqoridagi qidiruv maydoni (keng ekran) — ikkalasi ham shu oynani ochadi
  document.querySelectorAll("[data-search-open]").forEach(function (b) { b.addEventListener("click", open); });
  const trigger = document.getElementById("site-search-trigger");
  if (trigger) trigger.addEventListener("keydown", function (e) {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey || e.key === " ") return;
    e.preventDefault();
    open();
    input.value = e.key;
    render();
  });
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
