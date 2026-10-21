// «Mening natijalarim»: o'quvchining test natijalari va tugatgan ko'rgazmalari.
// Ma'lumot shu brauzerdan olinadi; Google bilan kirgan bo'lsa — hisobidagi bilan birlashtirilgan (auth.js).

function myTopic(key) {
  const p = String(key).split("|");
  const grade = findGrade(p[0]);
  const subject = grade && findSubject(grade, p[1]);
  const topic = subject && findTopic(subject, p[2]);
  return topic ? { grade: grade, subject: subject, topic: topic, index: subject.topics.indexOf(topic) } : null;
}

function myDate(ms) {
  if (!ms) return "";
  const d = new Date(ms), z = function (n) { return (n < 10 ? "0" : "") + n; };
  return z(d.getDate()) + "." + z(d.getMonth() + 1) + "." + d.getFullYear();
}

function myRateClass(p) { return p < 50 ? "low" : p < 75 ? "mid" : "high"; }

function renderMyAccount() {
  const el = document.getElementById("my-account");
  const user = typeof currentUser !== "undefined" ? currentUser : null;
  if (user) {
    const name = user.displayName || userFirstName(user);
    el.innerHTML =
      '<div class="my-card my-user">' +
        '<span class="my-ava">' + escapeText(name.charAt(0).toUpperCase()) + '</span>' +
        '<div class="my-user-body"><b>' + escapeText(name) + '</b><span>' + escapeText(user.email || "") + '</span>' +
        '<span class="my-sync">✓ Natijalaringiz hisobingizda saqlanadi</span></div>' +
        '<button type="button" class="my-logout" id="my-logout">Chiqish</button>' +
      '</div>';
    document.getElementById("my-logout").addEventListener("click", function () { firebase.auth().signOut(); });
  } else if (typeof isFirebaseConfigured === "function" && isFirebaseConfigured()) {
    el.innerHTML =
      '<div class="my-card my-login">' +
        '<div><b>Natijalaringiz faqat shu qurilmada saqlanmoqda.</b>' +
        '<span>Google bilan kirsangiz, ular hisobingizga yoziladi va boshqa qurilmada ham ko\'rinadi.</span></div>' +
        '<button type="button" class="site-google-btn" id="my-login">' + GOOGLE_ICON + '<span>Google bilan kirish</span></button>' +
      '</div>';
    document.getElementById("my-login").addEventListener("click", openLoginModal);
  } else {
    el.innerHTML = "";
  }
}

function renderMyResults() {
  let results = {}, progress = {};
  try { results = JSON.parse(localStorage.getItem("mathlearn-natijalar-v1")) || {}; } catch (e) {}
  try { progress = JSON.parse(localStorage.getItem("mathrun-progress-v1")) || {}; } catch (e) {}

  const tests = Object.keys(results).map(function (k) { return { k: k, r: results[k], t: myTopic(k) }; })
    .filter(function (x) { return x.t; })
    .sort(function (a, b) { return (b.r.t || 0) - (a.r.t || 0); });
  const done = Object.keys(progress).filter(function (k) { return progress[k] && progress[k].done; })
    .map(function (k) { return { k: k, t: myTopic(k) }; }).filter(function (x) { return x.t; });

  const avg = tests.length ? Math.round(tests.reduce(function (s, x) { return s + (x.r.best || 0); }, 0) / tests.length) : null;
  document.getElementById("my-stats").innerHTML =
    '<div class="my-stats">' +
      '<div><b>' + tests.length + '</b><span>ta mavzu testi yechilgan</span></div>' +
      '<div><b' + (avg != null ? ' class="my-rate--' + myRateClass(avg) + '"' : "") + '>' + (avg != null ? avg + "%" : "—") + '</b><span>o\'rtacha eng yaxshi natija</span></div>' +
      '<div><b>' + done.length + '</b><span>ta ko\'rgazma tugatilgan</span></div>' +
    '</div>';

  const el = document.getElementById("my-results");
  if (!tests.length && !done.length) {
    el.innerHTML = '<div class="placeholder">Hali natija yo\'q. Biror mavzuni oching, ko\'rgazmani bajaring va testni yeching — natijalaringiz shu yerda chiqadi. ' +
      '<a href="index.html#grades-section">Sinfni tanlash →</a></div>';
    return;
  }
  el.innerHTML =
    (tests.length
      ? '<h2 class="my-h">Testlar</h2><ul class="my-list">' + tests.map(function (x) {
          const parts = splitTopicTitle(x.t.topic.title, x.t.index);
          return '<li><a href="' + topicHref(x.t.grade.id, x.t.subject.id, x.t.topic.id) + '#test">' +
            '<span class="my-topic"><small>' + x.t.grade.name + '</small>' + escapeText(parts.num + " " + parts.title) + '</span>' +
            '<span class="my-score"><b class="my-rate--' + myRateClass(x.r.best || 0) + '">' + (x.r.best || 0) + '%</b>' +
            '<small>oxirgisi ' + (x.r.last || 0) + '% · ' + (x.r.count || 1) + ' marta · ' + myDate(x.r.t) + '</small></span></a></li>';
        }).join("") + '</ul>'
      : "") +
    (done.length
      ? '<h2 class="my-h">Tugatilgan ko\'rgazmalar</h2><ul class="my-list">' + done.map(function (x) {
          const parts = splitTopicTitle(x.t.topic.title, x.t.index);
          return '<li><a href="' + topicHref(x.t.grade.id, x.t.subject.id, x.t.topic.id) + '#interaktiv">' +
            '<span class="my-topic"><small>' + x.t.grade.name + '</small>' + escapeText(parts.num + " " + parts.title) + '</span>' +
            '<span class="my-score"><b class="my-rate--high">✓</b></span></a></li>';
        }).join("") + '</ul>'
      : "");
}

function renderMyPage() {
  renderMyAccount();
  renderMyResults();
  document.addEventListener("mathlearn:auth", renderMyAccount);
  document.addEventListener("mathlearn:synced", renderMyResults);
}
