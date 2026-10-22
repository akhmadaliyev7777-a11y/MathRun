// Mavzu testining UMUMIY dvigateli — 5–11-sinf (js/quiz-engine.js) ham, 1–4-sinf (mathrunner-web/js/screens/quiz.js) ham shundan foydalanadi.
// Barcha savollar bitta sahifada; yuqorida «Belgilandi n/N» paneli va «Testni yakunlash»; natijada doira, To'g'ri/Xato/Vaqt,
// «Sizning javobingiz / To'g'ri javob» va «Yechimni ko'rish». Dizayn — css/test.css (qz-* sinflari).
//
// Ishlatish:  const ctrl = QuizCore.mount({ card, tabsEl, title, tests, current, html, ... })
//   card, tabsEl  — sahifadagi bo'sh konteynerlar (testlar yorlig'i va savollar kartasi)
//   title         — mavzu nomi
//   tests         — [{ id, nom, desc, headTitle, headSub, nextLabel, questions, off }]:
//                   nom — yorliq («1-test»), desc — yorliq ostidagi yozuv, headTitle/headSub — panel sarlavhasi,
//                   nextLabel — «Keyingisi: …» tugmasidagi nom, questions — [{question, options, answer, explain|yechim, rasm}]
//                   yoki shuni qaytaradigan (va'dali) funksiya, off — «tez orada» yorlig'i
//   current       — boshlanadigan test id'si
//   html          — { q, a, sol }: savol, javob va yechim matnini HTML'ga aylantiradigan funksiyalar (formulalar uchun)
//   afterPaint    — har chizishdan keyin chaqiriladi (formulalarni chizish uchun)
//   savedKey(id, i), savedData(id, i, q) — «Saqlash» tugmasi uchun kalit va ma'lumot
//   onFinish({ test, questions, picked, score, spent }) — test yakunlanganda (natijani yozish)
//   onTestChange(id) — test almashganda (manzilni yangilash)
//   backHref, backLabel — natijadan keyingi «qaytish» havolasi (backHref bo'sh bo'lsa chiqmaydi)
//   embedded      — mavzu sahifasi ichidagi oyna: yuqoridagi panel tashqi sahifa aylanishiga ergashadi
//   scrollToY(y)  — sahifani aylantirish (ixtiyoriy)
(function () {
  const HARF = ["A", "B", "C", "D", "E", "F"];
  const SAVED = "mathlearn-saqlangan-v1";

  const ICON = {
    book: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M8 7h8M8 11h6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>',
    mark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
  };

  const esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

  // ---------- saqlangan savollar (o'quvchi keyin qaytib ko'rishi uchun) ----------
  function savedAll() { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch (e) { return {}; } }
  function savedToggle(id, data) {
    const all = savedAll();
    if (all[id]) delete all[id]; else all[id] = data;
    try { localStorage.setItem(SAVED, JSON.stringify(all)); } catch (e) {}
    return !!all[id];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function ring(pct) {
    const r = 52, c = 2 * Math.PI * r;
    return '<svg class="qz-ring" viewBox="0 0 128 128" aria-hidden="true">' +
      '<circle cx="64" cy="64" r="' + r + '" fill="none" stroke="#e7eaf6" stroke-width="10"/>' +
      '<circle class="qz-ring-val" cx="64" cy="64" r="' + r + '" fill="none" stroke-width="10" stroke-linecap="round" ' +
        'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(1) + '" transform="rotate(-90 64 64)"/></svg>';
  }

  function confetti() {
    const colors = ["#4f5bd5", "#16a394", "#f0b429", "#e5484d", "#8b5cf6", "#2bbfa9"];
    let html = '<div class="qz-confetti" aria-hidden="true">';
    for (let k = 0; k < 26; k++) {
      const left = (k * 37) % 100, top = (k * 53) % 70, rot = (k * 47) % 180;
      html += '<i style="left:' + left + '%;top:' + top + '%;background:' + colors[k % colors.length] + ';transform:rotate(' + rot + 'deg);animation-delay:' + (k % 7) * 0.08 + 's"></i>';
    }
    return html + '</div>';
  }

  function mount(o) {
    const card = o.card, tabsEl = o.tabsEl, tests = o.tests, embedded = !!o.embedded;
    const H = o.html || {};
    const hq = H.q || esc, ha = H.a || esc, hs = H.sol || function (x) { return x; };

    let cur = tests.find(function (t) { return t.id === o.current && !t.off; }) || tests.find(function (t) { return !t.off; });
    let questions = [], order = [], picked = [], finished = false, startedAt = 0, spent = 0, token = 0;

    // sahifa (yoki oyna) boshiga yoki oyna ichidagi y joyga — natija chiqqanda o'quvchi uni darhol ko'rsin
    function scrollToY(y) {
      if (o.scrollToY) return o.scrollToY(y);
      if (embedded) { try { parent.postMessage({ type: "mathrun:top", y: y || 0 }, "*"); } catch (e) {} }
      else window.scrollTo({ top: Math.max(0, (y || 0) - 70), behavior: "smooth" });
    }

    const correctOf = function (q) { return q.options.indexOf(q.answer); };
    const answeredCount = function () { return picked.filter(function (p) { return p >= 0; }).length; };
    const savedId = function (i) { return o.savedKey(cur.id, i) ; };

    // ---------- 1-test / 2-test / 3-test yorliqlari ----------
    function renderTabs() {
      if (tests.length < 2) { tabsEl.innerHTML = ""; return; }
      tabsEl.innerHTML = '<div class="qz-tabs" role="tablist"' +
        (tests.length !== 2 ? ' style="grid-template-columns:repeat(' + tests.length + ',1fr)"' : "") + '>' + tests.map(function (t) {
          if (t.off) return '<span class="qz-tab qz-tab--off"><b>' + t.nom + '</b><small>tez orada</small></span>';
          return '<button type="button" role="tab" class="qz-tab' + (t === cur ? " active" : "") + '" data-tur="' + t.id + '">' +
            '<b>' + t.nom + '</b><small>' + t.desc + '</small></button>';
        }).join("") + '</div>';
      tabsEl.querySelectorAll("[data-tur]").forEach(function (b) {
        b.addEventListener("click", function () { select(b.dataset.tur); });
      });
    }

    function select(id) {
      const t = tests.find(function (x) { return x.id === id && !x.off; });
      if (!t || t === cur && questions.length) return;
      cur = t;
      if (o.onTestChange) o.onTestChange(id);
      start();
    }

    function start() {
      const my = ++token;
      return Promise.resolve(typeof cur.questions === "function" ? cur.questions() : cur.questions).then(function (qs) {
        if (my !== token) return;
        questions = qs;
        // har urinishda javoblar tartibi aralashtiriladi; order[i] — ko'rsatilgan javoblarning asl o'rni
        order = questions.map(function (q) { return shuffle(q.options.map(function (_, j) { return j; })); });
        picked = questions.map(function () { return -1; });
        finished = false;
        startedAt = Date.now();
        renderTabs();
        render();
      });
    }

    function markBtn(i) {
      const on = !!savedAll()[savedId(i)];
      return '<button type="button" class="qz-mark' + (on ? " on" : "") + '" data-mark="' + i + '" aria-pressed="' + on + '" title="Savolni saqlash">' +
        ICON.mark + '<span>' + (on ? "Saqlandi" : "Saqlash") + '</span></button>';
    }

    // ---------- savol kartasi: test davomida ----------
    function questionHtml(q, i) {
      const opts = order[i].map(function (oi, pos) {
        return '<button type="button" class="qz-opt' + (picked[i] === oi ? " picked" : "") + '" data-q="' + i + '" data-o="' + oi + '">' +
          '<span class="qz-letter">' + HARF[pos] + '</span><span class="qz-opt-text">' + ha(q.options[oi]) + '</span>' +
          '<span class="qz-tick">' + ICON.check + '</span></button>';
      }).join("");
      return '<li class="qz-q' + (q.rasm ? " qz-q--fig" : "") + '" id="qz-q' + (i + 1) + '">' +
        '<div class="qz-q-top"><span class="qz-num">' + (i + 1) + '</span>' +
          '<div class="qz-text">' + hq(q.question) + '</div>' +
          '<div class="qz-q-side"><span class="qz-belgi"' + (picked[i] >= 0 ? "" : " hidden") + '><i></i>Belgilandi</span>' + markBtn(i) + '</div></div>' +
        '<div class="qz-q-body">' + (q.rasm ? '<div class="qz-fig">' + q.rasm + '</div>' : "") + '<div class="qz-opts">' + opts + '</div></div></li>';
    }

    // ---------- savol kartasi: natijada ----------
    function resultHtml(q, i) {
      const ci = correctOf(q);
      const pos = function (oi) { return HARF[order[i].indexOf(oi)]; };
      const st = picked[i] < 0 ? "skip" : picked[i] === ci ? "ok" : "bad";
      const badge = st === "ok" ? '<span class="qz-badge ok">' + ICON.check + 'To\'g\'ri javob</span>'
        : st === "bad" ? '<span class="qz-badge bad">' + ICON.cross + 'Noto\'g\'ri javob</span>'
        : '<span class="qz-badge skip">Javob berilmagan</span>';
      const sol = q.yechim || q.explain;
      return '<li class="qz-q qz-q--' + st + '" id="qz-q' + (i + 1) + '">' +
        '<div class="qz-q-top"><span class="qz-num">' + (i + 1) + '</span>' + badge + '<div class="qz-q-side">' + markBtn(i) + '</div></div>' +
        '<div class="qz-res-body">' +
          (q.rasm ? '<div class="qz-fig">' + q.rasm + '</div>' : "") +
          '<div class="qz-res-main"><div class="qz-text">' + hq(q.question) + '</div>' +
            '<div class="qz-answers">' +
              '<div class="qz-ans"><small>Sizning javobingiz</small>' + (picked[i] < 0 ? '<b class="skip">—</b>'
                : '<b class="' + st + '">' + pos(picked[i]) + ') ' + ha(q.options[picked[i]]) + ' ' + (st === "ok" ? ICON.check : ICON.cross) + '</b>') + '</div>' +
              '<div class="qz-ans"><small>To\'g\'ri javob</small><b class="ok">' + pos(ci) + ') ' + ha(q.answer) + ' ' + ICON.check + '</b></div>' +
            '</div></div>' +
        '</div>' +
        (sol ? '<details class="qz-sol"' + (st === "ok" ? "" : " open") + '><summary>Yechimni ko\'rish ' + ICON.chev + '</summary>' +
          '<div class="qz-sol-body"><b class="qz-sol-title">Yechim:</b>' + hs(sol) + '</div></details>' : "") +
        '</li>';
    }

    function headBar() {
      const n = answeredCount();
      return '<div class="qz-head" id="qz-head">' +
        '<span class="qz-head-icon">' + ICON.book + '</span>' +
        '<div class="qz-head-title"><b>' + o.title + ' — ' + cur.headTitle + '</b><small>' + questions.length + ' ta savol' + (cur.headSub ? ' · ' + cur.headSub : "") + '</small></div>' +
        '<div class="qz-head-progress"><small>Belgilandi: <b id="qz-count">' + n + ' / ' + questions.length + '</b></small>' +
          '<span class="qz-bar"><i id="qz-bar" style="width:' + Math.round(n / questions.length * 100) + '%"></i></span></div>' +
        '<button type="button" class="qz-finish" id="qz-finish">' + ICON.flag + '<span>Testni yakunlash</span></button>' +
      '</div>';
    }

    function render() {
      let html;
      if (!finished) {
        html = headBar() +
          '<ol class="qz-list">' + questions.map(questionHtml).join("") + '</ol>' +
          '<div class="qz-foot">' +
            '<div class="qz-warn" id="qz-warn" hidden></div>' +
            '<button type="button" class="qz-btn qz-btn--big" id="qz-finish2">' + ICON.flag + ' Testni yakunlash</button>' +
          '</div>';
      } else {
        const ok = questions.filter(function (q, i) { return picked[i] === correctOf(q); }).length;
        const skip = picked.filter(function (p) { return p < 0; }).length;
        const bad = questions.length - ok - skip;
        const pct = Math.round(ok / questions.length * 100);
        const level = pct >= 80 ? "high" : pct >= 60 ? "mid" : "low";
        const word = pct === 100 ? "A'lo!" : pct >= 80 ? "Yaxshi natija!" : pct >= 60 ? "Yomon emas!" : "Mashq qiling";
        const msg = pct === 100 ? "Barcha savollarga to'g'ri javob berdingiz! 🎉"
          : pct >= 80 ? "Zo'r! Xatolaringizning yechimini ko'rib chiqing."
          : pct >= 60 ? "Xatolar ustida ishlasangiz, natija yanada yaxshi bo'ladi."
          : "Yechimlarni diqqat bilan o'qing va qaytadan ishlab ko'ring.";
        const mm = Math.floor(spent / 60), ss = spent % 60;
        const real = tests.filter(function (t) { return !t.off; });
        const next = real[real.indexOf(cur) + 1] || (real.length > 1 ? real[0] : null);
        const forward = next && real.indexOf(next) > real.indexOf(cur);
        html =
          '<div class="qz-result qz-result--' + level + '">' + (pct >= 80 ? confetti() : "") +
            '<div class="qz-result-top"><div class="qz-ring-wrap">' + ring(pct) +
              '<div class="qz-ring-text"><b>' + ok + ' / ' + questions.length + '</b><span>' + word + '</span></div></div>' +
              '<p class="qz-msg">' + o.title + ' — ' + cur.headTitle + '<br><span>' + msg + '</span></p></div>' +
            '<div class="qz-stats">' +
              '<div class="qz-stat ok"><span>' + ICON.check + '</span><div><small>To\'g\'ri</small><b>' + ok + '</b></div></div>' +
              '<div class="qz-stat bad"><span>' + ICON.cross + '</span><div><small>Xato' + (skip ? " / javobsiz" : "") + '</small><b>' + bad + (skip ? " / " + skip : "") + '</b></div></div>' +
              '<div class="qz-stat time"><span>' + ICON.clock + '</span><div><small>Vaqt</small><b>' + mm + ':' + (ss < 10 ? "0" : "") + ss + '</b></div></div>' +
            '</div>' +
            '<div class="qz-actions">' +
              (bad + skip ? '<button type="button" class="qz-btn qz-btn--ghost" id="qz-only-wrong">Faqat xatolarni ko\'rsatish</button>' : "") +
              '<button type="button" class="qz-btn" id="qz-again">Qaytadan ishlash</button>' +
            '</div>' +
            (next ? '<button type="button" class="qz-next-test" data-go="' + next.id + '">' +
              (forward ? "Keyingisi: " + next.nextLabel + " →" : "← " + next.nextLabel) + '</button>' : "") +
          '</div>' +
          '<ol class="qz-list">' + questions.map(resultHtml).join("") + '</ol>' +
          (o.backHref && !embedded ? '<div class="qz-foot qz-foot--center"><a class="qz-btn qz-btn--ghost" href="' + o.backHref + '">' + (o.backLabel || "Mavzuga qaytish") + '</a></div>' : "");
      }

      card.innerHTML = html;
      card.classList.toggle("qz-done", finished);
      card.classList.remove("qz-only-wrong");
      if (o.afterPaint) o.afterPaint(card);
      wireMarks();

      if (!finished) {
        card.querySelectorAll(".qz-opt").forEach(function (b) {
          b.addEventListener("click", function () {
            const qi = Number(b.dataset.q);
            picked[qi] = Number(b.dataset.o);
            b.parentNode.querySelectorAll(".qz-opt").forEach(function (x) { x.classList.toggle("picked", x === b); });
            const li = b.closest(".qz-q");
            li.classList.remove("qz-q--miss");
            li.querySelector(".qz-belgi").hidden = false;
            document.getElementById("qz-warn").hidden = true;
            updateCount();
          });
        });
        document.getElementById("qz-finish").addEventListener("click", function () { tryFinish(false); });
        document.getElementById("qz-finish2").addEventListener("click", function () { tryFinish(false); });
        placeHead();
      } else {
        document.getElementById("qz-again").addEventListener("click", function () { start(); scrollToY(0); });
        const only = document.getElementById("qz-only-wrong");
        if (only) only.addEventListener("click", function () {
          const on = card.classList.toggle("qz-only-wrong");
          only.textContent = on ? "Hamma savollarni ko'rsatish" : "Faqat xatolarni ko'rsatish";
        });
        card.querySelectorAll("[data-go]").forEach(function (b) {
          b.addEventListener("click", function () { select(b.dataset.go); scrollToY(0); });
        });
      }
    }

    function wireMarks() {
      card.querySelectorAll("[data-mark]").forEach(function (b) {
        b.addEventListener("click", function () {
          const i = Number(b.dataset.mark), q = questions[i];
          const on = savedToggle(savedId(i), o.savedData(cur.id, i, q));
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on);
          b.querySelector("span").textContent = on ? "Saqlandi" : "Saqlash";
        });
      });
    }

    function updateCount() {
      const n = answeredCount();
      document.getElementById("qz-count").textContent = n + " / " + questions.length;
      document.getElementById("qz-bar").style.width = Math.round(n / questions.length * 100) + "%";
    }

    // ---------- yuqoridagi panel sahifa bilan birga yopishib turadi ----------
    // Mustaqil sahifada — CSS (position: sticky). Mavzu sahifasi ichida oyna o'zi aylanmaydi, shuning uchun
    // tashqi sahifa qancha surilganini yuboradi (mathrun:scroll) va panel shuncha pastga siljitiladi.
    let viewTop = 0;
    function placeHead() {
      const head = document.getElementById("qz-head");
      if (!head || !embedded) return;
      head.style.transform = "";
      const list = card.querySelector(".qz-list");
      const natural = head.getBoundingClientRect().top + window.pageYOffset;
      const max = list.getBoundingClientRect().bottom + window.pageYOffset - head.offsetHeight - natural;
      const shift = Math.max(0, Math.min(viewTop + 8 - natural, max));
      head.style.transform = shift ? "translateY(" + shift + "px)" : "";
      head.classList.toggle("qz-head--float", shift > 0);
    }
    if (embedded) {
      window.addEventListener("message", function (e) {
        if (!e.data || e.data.type !== "mathrun:scroll") return;
        viewTop = e.data.top || 0;
        if (!finished) placeHead();
      });
    }

    function tryFinish(force) {
      const missing = [];
      picked.forEach(function (p, i) { if (p < 0) missing.push(i + 1); });
      if (missing.length && !force) {
        const warn = document.getElementById("qz-warn");
        warn.innerHTML = '<b>' + missing.length + ' ta savolga javob berilmagan:</b> ' +
          missing.map(function (n) { return '<a href="#qz-q' + n + '" data-jump="' + n + '">' + n + '</a>'; }).join(", ") +
          '<div class="qz-warn-actions"><button type="button" class="qz-btn qz-btn--ghost" id="qz-force">Baribir yakunlash</button></div>';
        warn.hidden = false;
        missing.forEach(function (n) { document.getElementById("qz-q" + n).classList.add("qz-q--miss"); });
        document.getElementById("qz-force").addEventListener("click", function () { tryFinish(true); });
        warn.querySelectorAll("[data-jump]").forEach(function (a) {
          a.addEventListener("click", function (e) {
            e.preventDefault();
            scrollToY(document.getElementById("qz-q" + a.dataset.jump).offsetTop - 90);
          });
        });
        // yuqoridagi panel tugmasi bosilgan bo'lsa — ogohlantirish ko'rinadigan joyga
        scrollToY(warn.offsetTop - 200);
        return;
      }
      finished = true;
      spent = Math.round((Date.now() - startedAt) / 1000);
      const score = questions.filter(function (q, i) { return picked[i] === correctOf(q); }).length;
      if (o.onFinish) o.onFinish({ test: cur, questions: questions, picked: picked, score: score, spent: spent });
      render();
      scrollToY(0);
    }

    start();
    return { select: select, repaint: function () { if (questions.length) render(); } };
  }

  window.QuizCore = { mount: mount };
})();
