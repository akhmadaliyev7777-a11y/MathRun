/*
  Firebase Authentication bilan ishlash: login holatini kuzatish,
  menyudagi Kirish/Chiqish/Admin panel havolalarini shunga qarab ko'rsatish.
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
      updateMenuUI(user);
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
