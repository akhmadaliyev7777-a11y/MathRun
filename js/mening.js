// «Mening natijalarim»: o'quvchining test natijalari va tugatgan ko'rgazmalari.
// Ma'lumot shu brauzerdan olinadi; Google bilan kirgan bo'lsa — hisobidagi bilan birlashtirilgan (auth.js).

function myTopic(key) {
  const p = String(key).split("|");
  const grade = findGrade(p[0]);
  const subject = grade && findSubject(grade, p[1]);
  const topic = subject && findTopic(subject, p[2]);
  return topic ? { grade: grade, subject: subject, topic: topic, index: subject.topics.indexOf(topic) } : null;
}

// 1–4-sinf testlari: kalit "<sinf>|boshlangich|<daraja id>". Nomlar mathrunner-web ma'lumotidan olinadi (faqat shunday natija bo'lsa yuklanadi).
let MWINFO = null, mwLoading = false;
function myPrimary(k) {
  const p = String(k).split("|");
  return p[1] === "boshlangich" && MWINFO ? MWINFO[p[2]] || null : null;
}
function mwLoad(keys) {
  if (MWINFO || mwLoading || !keys.some(function (k) { return String(k).split("|")[1] === "boshlangich"; })) return;
  mwLoading = true;
  Promise.all([
    fetch("mathrunner-web/data/curriculum.json?v=3").then(function (r) { return r.json(); }),
    import("../mathrunner-web/js/topicTitles.js")
  ]).then(function (res) {
    const cur = res[0], tt = res[1];
    MWINFO = {};
    cur.grades.forEach(function (g) {
      g.choraks.forEach(function (c) {
        c.blocks.forEach(function (b) {
          b.levels.forEach(function (l) {
            if (l.gameKind !== "test") return;
            MWINFO[l.id] = {
              id: l.id, grade: g.grade, title: b.blok + ". " + tt.topicTitle(g, c, b),
              sub: g.grade + "-sinf · " + tt.testLabel(b, l), href: "mathrunner-web/index.html#/test/" + l.id
            };
          });
        });
      });
    });
    renderMyResults();
  }).catch(function () { mwLoading = false; });
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

// Formulalar test sahifasidagidek chiqadi: 5–11-sinf — qzMathText/qzRenderMath (js/quiz-engine.js),
// 1–4-sinf — mathrunner-web/js/mathfmt.js (o'sha testlarning o'zi ishlatadigan). Ular yuklanmasa — oddiy matn.
const myMathText = function (t) { return typeof qzMathText === "function" ? qzMathText(t) : escapeText(t); };
let MW_TEXTS = [];
function myRenderMath(root) {
  if (typeof qzRenderMath === "function") qzRenderMath(root);
  const mwEls = root.querySelectorAll("[data-mw]");
  if (!mwEls.length || typeof qzLoadKatex !== "function") return;
  const texts = MW_TEXTS;
  Promise.all([import("../mathrunner-web/js/mathfmt.js"), qzLoadKatex()]).then(function (res) {
    const fmt = res[0];
    mwEls.forEach(function (el) {
      const t = texts[Number(el.dataset.mw)];
      if (!el.isConnected || t == null) return;
      el.innerHTML = el.dataset.kind === "a" ? fmt.answerHTML(t, { compact: true }) : fmt.questionHTML(t, { compact: true });
    });
  }).catch(function () { /* formulalar oddiy matn bo'lib qoladi */ });
}

function myScoreHtml(r) {
  return '<span class="my-score"><b class="my-rate--' + myRateClass(r.best || 0) + '">' + (r.best || 0) + '%</b><small>eng yaxshi</small></span>';
}
function myMetaHtml(r) {
  return '<small class="my-meta">Oxirgisi ' + (r.last || 0) + '% · ' + (r.count || 1) + ' marta yechilgan · ' + myDate(r.t) + '</small>';
}

function renderMyResults() {
  let results = {}, progress = {}, saved = {};
  try { results = JSON.parse(localStorage.getItem("mathlearn-natijalar-v1")) || {}; } catch (e) {}
  try { progress = JSON.parse(localStorage.getItem("mathrun-progress-v1")) || {}; } catch (e) {}
  try { saved = JSON.parse(localStorage.getItem("mathlearn-saqlangan-v1")) || {}; } catch (e) {}

  mwLoad(Object.keys(results).concat(Object.keys(saved).map(function (id) { return id.split("#")[0]; })));
  const tests = Object.keys(results).map(function (k) { return { k: k, r: results[k], t: myTopic(k), mw: myPrimary(k) }; })
    .filter(function (x) { return x.t || x.mw; })
    .sort(function (a, b) { return (b.r.t || 0) - (a.r.t || 0); });
  const done = Object.keys(progress).filter(function (k) { return progress[k] && progress[k].done; })
    .map(function (k) { return { k: k, t: myTopic(k) }; }).filter(function (x) { return x.t; });

  // har bir test (1-test va 2-test alohida) bo'yicha eng yaxshi natijalarning o'rtachasi
  const avg = tests.length ? Math.round(tests.reduce(function (s, x) { return s + (x.r.best || 0); }, 0) / tests.length) : null;
  document.getElementById("my-stats").innerHTML =
    '<div class="my-stats">' +
      '<div><b>' + tests.length + '</b><span>ta test yechilgan</span></div>' +
      '<div><b' + (avg != null ? ' class="my-rate--' + myRateClass(avg) + '"' : "") + '>' + (avg != null ? avg + "%" : "—") + '</b><span>eng yaxshi natijalar o\'rtachasi</span></div>' +
      '<div><b>' + done.length + '</b><span>ta ko\'rgazma tugatilgan</span></div>' +
    '</div>';

  const marks = Object.keys(saved).map(function (id) { return saved[id]; })
    .filter(function (x) { return x && (myTopic(x.k) || myPrimary(x.k)); })
    .sort(function (a, b) { return (b.t || 0) - (a.t || 0); });

  const el = document.getElementById("my-results");
  if (!tests.length && !done.length && !marks.length) {
    el.innerHTML = '<div class="placeholder">Hali natija yo\'q. Biror mavzuni oching, ko\'rgazmani bajaring va testni yeching — natijalaringiz shu yerda chiqadi. ' +
      '<a href="index.html#grades-section">Sinfni tanlash →</a></div>';
    return;
  }
  MW_TEXTS = [];
  const mwSlot = function (text, kind) {
    MW_TEXTS.push(String(text));
    return '<span data-mw="' + (MW_TEXTS.length - 1) + '" data-kind="' + kind + '">' + escapeText(text) + '</span>';
  };
  el.innerHTML =
    (tests.length
      ? '<h2 class="my-h">Testlar</h2><ul class="my-list">' + tests.map(function (x) {
          if (x.mw) {
            return '<li><a class="my-row" href="' + x.mw.href + '">' +
              '<span class="my-topic"><small>' + escapeText(x.mw.sub) + '</small><span class="my-title">' + escapeText(x.mw.title) + '</span>' + myMetaHtml(x.r) + '</span>' +
              myScoreHtml(x.r) + '</a></li>';
          }
          const parts = splitTopicTitle(x.t.topic.title, x.t.index);
          return '<li><a class="my-row" href="' + topicHref(x.t.grade.id, x.t.subject.id, x.t.topic.id) + '#test">' +
            '<span class="my-topic"><small>' + x.t.grade.name + ' · ' + (/\|qiyin$/.test(x.k) ? "2-test" : "1-test") + '</small>' +
              '<span class="my-title">' + escapeText(parts.num + " " + parts.title) + '</span>' + myMetaHtml(x.r) + '</span>' +
            myScoreHtml(x.r) + '</a></li>';
        }).join("") + '</ul>'
      : "") +
    (done.length
      ? '<h2 class="my-h">Tugatilgan ko\'rgazmalar</h2><ul class="my-list">' + done.map(function (x) {
          const parts = splitTopicTitle(x.t.topic.title, x.t.index);
          return '<li><a class="my-row" href="' + topicHref(x.t.grade.id, x.t.subject.id, x.t.topic.id) + '#interaktiv">' +
            '<span class="my-topic"><small>' + x.t.grade.name + '</small><span class="my-title">' + escapeText(parts.num + " " + parts.title) + '</span></span>' +
            '<span class="my-score"><b class="my-rate--high">✓</b></span></a></li>';
        }).join("") + '</ul>'
      : "") +
    (marks.length
      ? '<h2 class="my-h">Saqlangan savollar</h2><ul class="my-list">' + marks.map(function (x) {
          const mw = myPrimary(x.k);
          let href, meta, q, a;
          if (mw) {
            href = mw.href;
            meta = escapeText(mw.title) + ' · ' + escapeText(mw.sub) + ', ' + (x.i + 1) + '-savol';
            q = mwSlot(x.q, "q"); a = mwSlot(x.a, "a");
          } else {
            const t = myTopic(x.k), p = String(x.k).split("|");
            const parts = splitTopicTitle(t.topic.title, t.index);
            href = "test.html?sinf=" + p[0] + "&fan=" + p[1] + "&mavzu=" + p[2] + (p[3] === "qiyin" ? "&tur=qiyin" : "") + "#qz-q" + (x.i + 1);
            meta = escapeText(parts.num + " " + parts.title) + ' · ' + t.grade.name + ' · ' + (p[3] === "qiyin" ? "2-test" : "1-test") + ', ' + (x.i + 1) + '-savol';
            q = myMathText(x.q); a = myMathText(x.a);
          }
          return '<li><a class="my-saved" href="' + href + '">' +
            '<small class="my-saved-meta">' + meta + '</small>' +
            '<div class="my-saved-q">' + q + '</div>' +
            (x.rasm ? '<div class="my-fig">' + x.rasm + '</div>' : "") +
            '<div class="my-saved-a"><small>To\'g\'ri javob:</small> <b>' + a + '</b></div></a></li>';
        }).join("") + '</ul>'
      : "");
  myRenderMath(el);
}

function renderMyPage() {
  renderMyAccount();
  renderMyResults();
  document.addEventListener("mathlearn:auth", renderMyAccount);
  document.addEventListener("mathlearn:synced", renderMyResults);
}
