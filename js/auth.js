/*
  Firebase Authentication bilan ishlash: login holatini kuzatish,
  menyudagi Kirish/Chiqish/Admin panel havolalarini shunga qarab ko'rsatish.
  O'quvchilar Google bilan kiradi (tepadagi «Kirish» tugmasi); kirganda yutuqlar va test natijalari
  shu brauzer bilan uning hisobi (Firestore "users/<uid>") o'rtasida birlashtirib saqlanadi.
*/

let firebaseReady = false;

try {
  if (
    typeof firebase !== "undefined" &&
    FIREBASE_CONFIG &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY"
  ) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebaseReady = true;
  }
} catch (e) {
  console.warn("Firebase ishga tushmadi:", e);
}

function isFirebaseConfigured() {
  return firebaseReady;
}

function currentIsAdmin(user) {
  return !!user && user.email === ADMIN_EMAIL;
}

function updateMenuUI(user) {
  // Admin panel havolasi faqat admin kirganda ko'rinadi.
  const adminLink = document.getElementById("drawer-admin-link");
  if (adminLink) adminLink.hidden = !currentIsAdmin(user);
  const loginLink = document.getElementById("drawer-login-link");
  const logoutBtn = document.getElementById("drawer-logout-btn");
  if (!loginLink || !logoutBtn) return;

  if (user) {
    loginLink.hidden = true;
    logoutBtn.hidden = false;
  } else {
    loginLink.hidden = false;
    logoutBtn.hidden = true;
  }
}

// ---------- tepadagi «Kirish» tugmasi: kirmagan — kirish oynasi, kirgan — ism va menyu ----------

let currentUser = null;

function userFirstName(user) {
  const n = (user.displayName || "").trim();
  return n ? n.split(/\s+/)[0] : (user.email || "Hisob").split("@")[0];
}

function escapeText(t) {
  return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}

function updateHeaderUser(user) {
  const btn = document.getElementById("site-login-btn");
  if (!btn) return;
  closeUserMenu();
  if (user) {
    const name = userFirstName(user);
    btn.classList.add("is-user");
    btn.innerHTML = '<span class="site-user-ava" aria-hidden="true">' + escapeText(name.charAt(0).toUpperCase()) + '</span><span class="site-user-name">' + escapeText(name) + '</span>';
    btn.setAttribute("aria-label", "Hisob: " + name);
  } else {
    btn.classList.remove("is-user");
    btn.textContent = "Kirish";
    btn.removeAttribute("aria-label");
  }
}

function closeUserMenu() {
  const m = document.getElementById("site-user-menu");
  if (m) m.remove();
}

function toggleUserMenu(btn) {
  if (document.getElementById("site-user-menu")) { closeUserMenu(); return; }
  const base = window.SITE_BASE || "";
  const u = currentUser;
  const menu = document.createElement("div");
  menu.id = "site-user-menu";
  menu.className = "site-user-menu";
  menu.innerHTML =
    '<div class="site-user-menu-head"><b>' + escapeText(u.displayName || userFirstName(u)) + '</b><span>' + escapeText(u.email || "") + '</span></div>' +
    '<a href="' + base + 'mening.html">📊 Mening natijalarim</a>' +
    (currentIsAdmin(u) ? '<a href="' + base + 'admin.html" target="_blank" rel="noopener">🛠 Admin panel</a>' : "") +
    '<button type="button" id="site-user-role">' + (getRole(u.uid) ? (getRole(u.uid) === "ustoz" ? "👩‍🏫" : "🎒") + ' ' + ROL_NAME[getRole(u.uid)] + ' · o\'zgartirish' : '🙋 Kimligingizni tanlang') + '</button>' +
    '<button type="button" id="site-user-logout">Chiqish</button>';
  document.body.appendChild(menu);
  const r = btn.getBoundingClientRect();
  menu.style.top = (r.bottom + window.pageYOffset + 8) + "px";
  menu.style.right = Math.max(12, document.documentElement.clientWidth - r.right) + "px";
  document.getElementById("site-user-role").addEventListener("click", function () { closeUserMenu(); openRoleModal(); });
  document.getElementById("site-user-logout").addEventListener("click", function () {
    closeUserMenu();
    firebase.auth().signOut();
  });
  setTimeout(function () {
    document.addEventListener("click", function off(e) {
      if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) { closeUserMenu(); document.removeEventListener("click", off); }
    });
  }, 0);
}

// layout.js dagi «Kirish» tugmasi shu funksiyani chaqiradi
window.onSiteLoginClick = function (btn) {
  if (!firebaseReady) return false;
  if (currentUser) toggleUserMenu(btn); else openLoginModal();
  return true;
};

// ---------- kirish oynasi (Google) ----------

const GOOGLE_ICON =
  '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

function loginErrorText(e) {
  const code = (e && e.code) || "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "";
  if (code === "auth/popup-blocked") return "Brauzer kirish oynasini to'sib qo'ydi. Qayta bosing yoki saytni Chrome / Safari'da oching.";
  if (code === "auth/operation-not-allowed") return "Google bilan kirish hali yoqilmagan. Birozdan keyin urinib ko'ring.";
  if (code === "auth/network-request-failed") return "Internet bilan bog'lanib bo'lmadi. Qayta urinib ko'ring.";
  if (code === "auth/unauthorized-domain") return "Bu manzildan kirish hali ruxsat etilmagan.";
  return "Kirib bo'lmadi. Saytni Chrome yoki Safari'da ochib, qayta urinib ko'ring.";
}

function openLoginModal() {
  let modal = document.getElementById("site-login-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "site-login-modal";
    modal.className = "site-login-modal";
    modal.innerHTML =
      '<div class="site-login-box" role="dialog" aria-modal="true" aria-labelledby="site-login-title">' +
        '<button type="button" class="site-login-close" aria-label="Yopish">&times;</button>' +
        '<div class="site-login-emoji">🎓</div>' +
        '<h2 id="site-login-title">Mathlearn\'ga kirish</h2>' +
        '<ul class="site-login-why">' +
          '<li>Yutuqlaringiz va test natijalaringiz saqlanadi</li>' +
          '<li>Telefonda ham, kompyuterda ham davom ettirasiz</li>' +
          '<li>Parol kerak emas — Google hisobingiz bilan</li>' +
        '</ul>' +
        '<button type="button" class="site-google-btn" id="site-google-btn">' + GOOGLE_ICON + '<span>Google bilan kirish</span></button>' +
        '<div class="site-login-err" id="site-login-err" hidden></div>' +
        '<p class="site-login-hint">Telegram ichida ochgan bo\'lsangiz, avval ⋮ → «Brauzerda ochish» ni bosing.</p>' +
      '</div>';
    document.body.appendChild(modal);
    const close = function () { modal.hidden = true; };
    modal.querySelector(".site-login-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.getElementById("site-google-btn").addEventListener("click", function () {
      const btn = this, err = document.getElementById("site-login-err");
      err.hidden = true; btn.disabled = true;
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      firebase.auth().signInWithPopup(provider)
        .then(function () { close(); })
        .catch(function (e) {
          const t = loginErrorText(e);
          if (t) { err.textContent = t; err.hidden = false; }
        })
        .then(function () { btn.disabled = false; });
    });
  }
  document.getElementById("site-login-err").hidden = true;
  modal.hidden = false;
}

// ---------- yutuqlar va natijalarni hisob bilan birlashtirish ----------

const SYNC_KEYS = { p: "mathrun-progress-v1", r: "mathlearn-natijalar-v1" };

function readLocalJson(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
function writeLocalJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function parseJsonField(f) { try { return f && f.stringValue ? JSON.parse(f.stringValue) : {}; } catch (e) { return {}; } }

// yutuqlar: ochilgan daraja — kattasi, tugatilgan — qaysi birida tugatilgan bo'lsa
function mergeProgress(a, b) {
  const out = Object.assign({}, a);
  Object.keys(b).forEach(function (k) {
    const x = out[k] || {}, y = b[k] || {};
    out[k] = Object.assign({}, x, y, { level: Math.max(x.level || 1, y.level || 1), done: !!(x.done || y.done) });
  });
  return out;
}

// test natijalari: eng yaxshisi — kattasi, oxirgisi — keyinroq yechilgani
function mergeResults(a, b) {
  const out = Object.assign({}, a);
  Object.keys(b).forEach(function (k) {
    const x = out[k], y = b[k];
    if (!x) { out[k] = y; return; }
    const newer = (y.t || 0) > (x.t || 0) ? y : x;
    out[k] = { best: Math.max(x.best || 0, y.best || 0), last: newer.last, count: Math.max(x.count || 0, y.count || 0), t: newer.t };
  });
  return out;
}

// ---------- «o'quvchimisiz yoki ustozmi?» ----------
// Tanlov hisob (uid) bo'yicha saqlanadi va Firestore users/<uid>.role ga yoziladi; admin panelda admin ham belgi qo'ya oladi (arole).
const ROL_KEY = "mathlearn-rol-v1";
const ROL_NAME = { oquvchi: "O'quvchi", ustoz: "Ustoz" };
function getRole(uid) { return readLocalJson(ROL_KEY)[uid] || ""; }
function setRole(uid, r) { const a = readLocalJson(ROL_KEY); a[uid] = r; writeLocalJson(ROL_KEY, a); }

function openRoleModal() {
  if (!currentUser) return;
  let modal = document.getElementById("site-role-modal");
  if (modal) modal.remove();
  modal = document.createElement("div");
  modal.id = "site-role-modal";
  modal.className = "site-login-modal";
  const btn = 'display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;margin:8px 0;font:inherit;font-weight:700;font-size:1.05rem;color:#1e2a78;background:#f3f4fd;border:2px solid #c9cef5;border-radius:14px;cursor:pointer;text-align:left';
  const cur = getRole(currentUser.uid);
  modal.innerHTML =
    '<div class="site-login-box" role="dialog" aria-modal="true" aria-labelledby="site-role-title">' +
      '<button type="button" class="site-login-close" aria-label="Keyinroq">&times;</button>' +
      '<div class="site-login-emoji">👋</div>' +
      '<h2 id="site-role-title">Siz kimsiz?</h2>' +
      '<p class="site-login-hint" style="margin:0 0 6px">Saytdan kimlar foydalanayotganini bilish uchun.</p>' +
      '<button type="button" data-role="oquvchi" style="' + btn + (cur === "oquvchi" ? ';border-color:#4f5bd5' : '') + '"><span style="font-size:1.6rem">🎒</span> O\'quvchiman</button>' +
      '<button type="button" data-role="ustoz" style="' + btn + (cur === "ustoz" ? ';border-color:#4f5bd5' : '') + '"><span style="font-size:1.6rem">👩‍🏫</span> Ustozman</button>' +
    '</div>';
  document.body.appendChild(modal);
  const close = function () { modal.remove(); try { sessionStorage.setItem("mathlearn-rol-asked", "1"); } catch (e) {} };
  modal.querySelector(".site-login-close").addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  modal.querySelectorAll("[data-role]").forEach(function (b) {
    b.addEventListener("click", function () {
      setRole(currentUser.uid, b.dataset.role);
      close();
      syncUserData(currentUser);
      document.dispatchEvent(new Event("mathlearn:role"));
    });
  });
}

let roleKnown = true;
function askRoleOnce() {
  try { if (sessionStorage.getItem("mathlearn-rol-asked")) return; } catch (e) {}
  if (currentUser && !roleKnown) openRoleModal();
}

let syncBusy = false, syncAgain = false, syncTimer = null;

function syncUserData(user) {
  if (!user || !firebaseReady || !window.fetch) return;
  if (syncBusy) { syncAgain = true; return; }
  syncBusy = true;
  const url = "https://firestore.googleapis.com/v1/projects/" + FIREBASE_CONFIG.projectId + "/databases/(default)/documents/users/" + user.uid;
  user.getIdToken().then(function (token) {
    const auth = { Authorization: "Bearer " + token };
    return fetch(url, { headers: auth }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (doc) {
      const f = (doc && doc.fields) || {};
      const serverRole = f.role && f.role.stringValue;
      if (!getRole(user.uid) && serverRole) setRole(user.uid, serverRole);
      roleKnown = !!(getRole(user.uid) || (f.arole && f.arole.stringValue));
      const role = getRole(user.uid);
      const p = mergeProgress(readLocalJson(SYNC_KEYS.p), parseJsonField(f.p));
      const res = mergeResults(readLocalJson(SYNC_KEYS.r), parseJsonField(f.r));
      writeLocalJson(SYNC_KEYS.p, p);
      writeLocalJson(SYNC_KEYS.r, res);
      const ps = JSON.stringify(p), rs = JSON.stringify(res);
      if (doc && f.p && f.p.stringValue === ps && f.r && f.r.stringValue === rs && (!role || serverRole === role)) return;
      const mask = ["name", "p", "r", "t"].concat(role ? ["role"] : []).map(function (x) { return "updateMask.fieldPaths=" + x; }).join("&");
      return fetch(url + "?" + mask, {
        method: "PATCH",
        headers: Object.assign({ "Content-Type": "application/json" }, auth),
        body: JSON.stringify({ fields: Object.assign({
          name: { stringValue: (user.displayName || "").slice(0, 80) },
          p: { stringValue: ps },
          r: { stringValue: rs },
          t: { timestampValue: new Date().toISOString() }
        }, role ? { role: { stringValue: role } } : {}) })
      });
    });
  }).catch(function (e) {
    console.warn("Hisobni yangilab bo'lmadi:", e);
  }).then(function () {
    syncBusy = false;
    document.dispatchEvent(new Event("mathlearn:synced"));
    askRoleOnce();
    if (syncAgain) { syncAgain = false; syncUserData(user); }
  });
}

// boshqa oynada yoki ko'rgazma/test ichida yutuq yozilsa — biroz kutib hisobga ham yoziladi
window.addEventListener("storage", function (e) {
  if (!currentUser || (e.key !== SYNC_KEYS.p && e.key !== SYNC_KEYS.r)) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(function () { syncUserData(currentUser); }, 1500);
});

function wireAuthUI() {
  const logoutBtn = document.getElementById("drawer-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (firebaseReady) {
        firebase.auth().signOut();
      }
      updateMenuUI(null);
      if (window.location.pathname.endsWith("admin.html")) {
        window.location.href = "index.html";
      }
    });
  }

  if (firebaseReady) {
    firebase.auth().onAuthStateChanged(function (user) {
      currentUser = user;
      updateMenuUI(user);
      updateHeaderUser(user);
      if (user) syncUserData(user);
      document.dispatchEvent(new Event("mathlearn:auth"));
    });
  } else {
    updateMenuUI(null);
  }
}

window.onAuthReadyForMenu = wireAuthUI;

// Admin sahifasi: faqat admin kirgan bo'lsa ochiladi, aks holda Kirish sahifasiga.
function guardAdminPage(onAllowed) {
  if (!firebaseReady) {
    window.location.replace("login.html");
    return;
  }
  firebase.auth().onAuthStateChanged(function (user) {
    if (currentIsAdmin(user)) {
      document.body.hidden = false;
      onAllowed();
    } else {
      window.location.replace("login.html");
    }
  });
}
