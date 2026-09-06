function renderSiteHeader() {
  const root = document.getElementById("site-header-root");
  if (!root) return;

  root.innerHTML =
    '<header class="site-header">' +
      '<div class="site-header-left">' +
        '<button id="menu-toggle-btn" class="menu-toggle" aria-label="Menyu">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        '<a class="site-logo" href="index.html">MathRun</a>' +
      "</div>" +
      '<nav class="site-nav">' +
        '<a href="index.html">Bosh sahifa</a>' +
        '<a href="korgazmalar.html">Interaktiv darslar</a>' +
      "</nav>" +
    "</header>" +
    '<div id="side-drawer" class="side-drawer">' +
      '<div class="side-drawer-inner">' +
        '<button id="drawer-close-btn" class="drawer-close" aria-label="Yopish">&times;</button>' +
        '<a href="index.html" class="drawer-link">\u{1F3E0} Bosh sahifa</a>' +
        '<a href="settings.html" class="drawer-link">⚙️ Sozlamalar</a>' +
        '<a href="info.html" class="drawer-link">ℹ️ Ma\'lumot</a>' +
        '<div class="drawer-divider"></div>' +
        '<a href="admin.html" id="drawer-admin-link" class="drawer-link" target="_blank" rel="noopener">\u{1F6E0} Admin panel</a>' +
        '<a href="login.html" id="drawer-login-link" class="drawer-link">\u{1F511} Kirish</a>' +
        '<button id="drawer-logout-btn" class="drawer-link drawer-logout" hidden>\u{1F6AA} Chiqish</button>' +
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
