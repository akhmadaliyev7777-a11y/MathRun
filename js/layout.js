// base — sahifa ichki papkada bo'lsa (masalan mathrunner-web/) asosiy saytga yo'l, masalan "../"
// active — menyuda ajratib ko'rsatiladigan bo'lim: "home" | "lessons" | "primary"
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
        '<a href="' + base + 'mathrunner-web/index.html"' + cls("primary") + '>Boshlang\'ich sinflar</a>' +
      "</nav>" +
    "</header>" +
    '<div id="side-drawer" class="side-drawer">' +
      '<div class="side-drawer-inner">' +
        '<button id="drawer-close-btn" class="drawer-close" aria-label="Yopish">&times;</button>' +
        '<a href="' + base + 'index.html" class="drawer-link">Bosh sahifa</a>' +
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

  if (window.onAuthReadyForMenu) window.onAuthReadyForMenu();
}
