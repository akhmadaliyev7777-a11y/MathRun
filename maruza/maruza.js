/* Ma'ruza sahifalari uchun umumiy skript.
   1) chizma.js chizmalarini yasaydi; 2) KaTeX bilan formulalarni yozadi (\( \) va \[ \]);
   3) sayt ichida (iframe) sahifa balandligini yuboradi.
   Formulalarda o'nli kasr vergul bilan yoziladi: \(0,75\) — vergul avtomatik {,} ga aylantiriladi.
   Rangli makroslar: \sur{3} — surat (ko'k), \mx{4} — maxraj (to'q sariq), \nat{0,75} — natija (yashil). */
(function () {
  "use strict";
  const KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";

  function yukla(tag, attrs) {
    return new Promise(function (ok, xato) {
      const el = document.createElement(tag);
      Object.keys(attrs).forEach(function (k) { el[k] = attrs[k]; });
      el.onload = ok;
      el.onerror = xato;
      document.head.appendChild(el);
    });
  }

  function balandlik() {
    // documentElement.scrollHeight iframe balandligidan kichik bo'lmaydi (kichrayganda bo'sh joy qoladi) — shuning uchun body o'lchami olinadi
    const h = Math.ceil(document.body.getBoundingClientRect().height);
    try { parent.postMessage({ type: "mathrun:height", h: h }, "*"); } catch (e) { /* sayt tashqarisida ochilgan */ }
  }

  // raqamlar yozuvini tayyorlash: o'nli vergul, katta sonlar guruhlari (formula ichida va tashqarisida)
  function vergul(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) return;
      // formuladan tashqarida: "3 594 627" — guruhlar orasida uzilmaydigan bo'sh joy
      let v = n.nodeValue.replace(/(\d) (?=\d{3}(?!\d))/g, "$1\u00A0");
      // formula ichida: o'nli vergul {,} va guruhlar orasida \, (KaTeX oddiy bo'sh joyni tashlab yuboradi)
      v = v.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g, function (m) {
        return m.replace(/(\d),(?=\d)/g, "$1{,}").replace(/(\d)[ \u00A0](?=\d{3}(?!\d))/g, "$1\\,");
      });
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }

  function boshla() {
    // sayt ichida (iframe) ochilganda sahifa o'zi aylanmaydi — balandlik tashqi oynaga moslanadi, aylantirish faqat tashqi sahifada
    if (window.parent !== window) document.documentElement.style.overflow = "hidden";
    if (window.MaruzaChizma) window.MaruzaChizma.chiz(document);
    document.querySelectorAll("details").forEach(function (d) { d.addEventListener("toggle", balandlik); });
    if (window.ResizeObserver) new ResizeObserver(balandlik).observe(document.body);
    window.addEventListener("load", balandlik);
    balandlik();

    yukla("link", { rel: "stylesheet", href: KATEX + "katex.min.css" });
    const katexTayyor = yukla("script", { src: KATEX + "katex.min.js" })
      .then(function () { return yukla("script", { src: KATEX + "contrib/auto-render.min.js" }); })
      .then(function () {
        vergul(document.body);
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ],
          macros: {
            "\\frac": "\\dfrac",
            "\\sur": "\\htmlClass{c-surat}{#1}",
            "\\mx": "\\htmlClass{c-maxraj}{#1}",
            "\\nat": "\\htmlClass{c-natija}{#1}"
          },
          trust: function (ctx) { return ctx.command === "\\htmlClass"; },
          strict: false,
          throwOnError: false
        });
        document.documentElement.classList.add("katex-tayyor");
        balandlik();
      })
      .catch(function () { /* internet yo'q — formulalar matn ko'rinishida qoladi */ });

    if (document.body.hasAttribute("data-a4")) a4(katexTayyor);
  }

  /* ===== A4 varaqlar va «PDF yuklab olish» (faqat <body data-a4> bo'lgan ma'ruzalarda) =====
     Kompyuterda (kenglik >= A4 varaq + 2·16 px) ma'ruza bloklari 210×297 mm varaqlarga taqsimlanadi, pastida raqam.
     Telefonda — oddiy uzluksiz ko'rinish. Chop etishda (PDF) har doim varaqlar: 1 varaq = 1 bet.
     Bloklar bo'linmaydi; faqat ro'yxat (ol/ul) li orasidan bo'linadi, varaqdan baland quti — ichki bloklari orasidan.
     Bitta bo'linmas blok varaqdan baland bo'lsa — varaq cho'ziladi (a4-ortiq). */
  function a4(katexTayyor) {
    const html = document.documentElement;
    const main = document.querySelector("main") || document.body;
    const params = new URLSearchParams(location.search);
    const CHOP = params.get("chop") === "1";
    // ?pdf=1 — tayyor PDF fayl yasash uchun (_reja/tools/pdf_yasash.py): chop etishdagidek varaqlanadi, lekin chop etish oynasi ochilmaydi
    const PDF = params.get("pdf") === "1";
    const ICHIDA = window.parent !== window;
    const MM = 96 / 25.4;
    const CHEGARA = Math.ceil(210 * MM) + 32;
    let asl = null;          // asl tuzilish: [{el, kids}]
    let klonlar = [];        // bo'lingan bloklarning davomlari [{asl, klon}]
    let kichik = [];         // varaqqa sig'ishi uchun biroz kichraytirilgan bloklar
    let faol = false;        // varaqlar ko'rsatilganmi
    let chopda = false;      // chop etishga tayyorlanganmi
    let tayyor = false;
    let ochiqAsl = new Map();

    // telefonda ?chop=1 sahifasi kompyuter kengligida chiziladi (bosma bilan bir xil o'lcham)
    if (CHOP) {
      let m = document.querySelector('meta[name="viewport"]');
      if (!m) { m = document.createElement("meta"); m.name = "viewport"; document.head.appendChild(m); }
      m.content = "width=840";
    }
    const st = document.createElement("style");
    st.textContent = "@page { size: A4; margin: 0; }";
    document.head.appendChild(st);

    // tugma
    const bar = document.createElement("div");
    bar.className = "a4-bar";
    bar.innerHTML = '<button type="button" class="a4-btn"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
      '<path d="M12 3v12m0 0l-5-5m5 5l5-5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>PDF yuklab olish</span></button>';
    // mavzu sahifasi ichida tugma tashqarida — bosqichlar qatorida (js/main.js); bu yerda faqat alohida ochilganda
    if (!ICHIDA) document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector("button").addEventListener("click", yuklabOl);

    function joyidaChopEtsaBoladi() {
      const ua = navigator.userAgent;
      const mobil = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
      const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
      if (mobil) return false;
      if (ICHIDA && safari) return false;          // Safari iframe ichidan butun tashqi sahifani chop etishi mumkin
      return html.clientWidth >= CHEGARA || CHOP;   // tor oynada — yangi oynada (kompyuter kengligida)
    }
    // Tayyor PDF fayllar ro'yxati (pdf/royxat.json, yasash: _reja/tools/pdf_yasash.py). Fayl bor bo'lsa — tugma PDF faylning
    // o'zini yangi oynada ochadi (brauzerning PDF oynasi: varaqlar soni ko'rinadi, yuklab olinganda nomi — mavzu nomi).
    // Fayl yo'q bo'lsa — eski usul (chop etish oynasi).
    const FAYL = (location.pathname.match(/\/([^\/]+)\.html?$/) || [])[1] || "";
    let pdfRoyxat = null;   // null — hali yuklanmagan, false — yuklanmadi
    if (!PDF && !CHOP && window.fetch) {
      fetch(new URL("../pdf/royxat.json", location.href).href, { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw r; return r.json(); })
        .then(function (j) { pdfRoyxat = j || {}; }, function () { pdfRoyxat = false; });
    }
    function faylOch() {
      const m = pdfRoyxat && FAYL && pdfRoyxat[FAYL];
      if (!m || !m.fayl) return false;
      const u = new URL("../pdf/" + encodeURIComponent(m.fayl) + (m.v ? "?v=" + m.v : ""), location.href).href;
      const w = window.open(u, "_blank");
      if (!w) { try { window.top.location.href = u; } catch (e) { location.href = u; } }
      return true;
    }
    function yuklabOl() {
      if (!CHOP && faylOch()) return;
      if (!joyidaChopEtsaBoladi() && !CHOP) {
        const u = new URL(location.href);
        u.searchParams.set("chop", "1");
        u.hash = "";
        const w = window.open(u.href, "_blank");
        if (!w) { try { window.top.location.href = u.href; } catch (e) { location.href = u.href; } }
        return;
      }
      chopgaTayyorla();
      setTimeout(function () { window.print(); }, 60);
    }

    function belgila(d, v) { if (d.open !== v) { d._a4k = v; d.open = v; } }
    function javoblarniOch() { document.querySelectorAll("details.a4-javobda").forEach(function (d) { belgila(d, true); }); }

    function aslniYoz() {
      asl = Array.prototype.map.call(main.children, function (el) {
        return { el: el, kids: el.matches("section, .m-sec") ? Array.prototype.slice.call(el.children) : null };
      });
      // «Javoblar» qismidan keyingi details — chop etishda ochiq; undan oldingilari (mashq ichidagi javoblar) — yashiriladi
      let javobda = false;
      asl.forEach(function (a) {
        if (a.el.matches(".q-javob")) javobda = true;
        if (!javobda) return;
        if (a.el.matches("details.javob")) a.el.classList.add("a4-javobda");
        a.el.querySelectorAll("details.javob").forEach(function (d) { d.classList.add("a4-javobda"); });
      });
      document.querySelectorAll("details").forEach(function (d) { ochiqAsl.set(d, d.open); });
    }

    function tikla() {
      kichik.forEach(function (el) { el.style.zoom = ""; });
      kichik = [];
      klonlar.forEach(function (k) {
        while (k.klon.firstChild) k.asl.appendChild(k.klon.firstChild);
        if (k.klon.parentNode) k.klon.parentNode.removeChild(k.klon);
      });
      klonlar = [];
      asl.forEach(function (a) { if (a.kids) a.kids.forEach(function (k) { a.el.appendChild(k); }); });
      main.textContent = "";
      asl.forEach(function (a) { main.appendChild(a.el); });
      html.classList.remove("a4-rejim");
    }

    function royxat(el) { return /^(OL|UL)$/.test(el.nodeName) && el.children.length > 0; }
    // sarlavha keyingi blok bilan birga turadi (personaj pufagi — yo'q: varaq pastida qolsa ham bo'ladi, joy bo'sh qolmasin)
    function birgaKeyingi(el) { return el.matches(".m-qism, h2, h3, h4, .daraja, .m-title"); }
    function bolinadi(el) {
      if (royxat(el)) return true;
      if (!el.matches(".box, .m-sec, section, .misol-juft")) return false;
      for (let n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return false;
      return el.children.length > 1;
    }

    function sahifala() {
      if (!asl) aslniYoz();
      tikla();
      html.classList.add("a4-rejim");
      const birlik = [];
      asl.forEach(function (a) {
        if (a.kids) a.kids.forEach(function (k) { birlik.push({ el: k, sec: a.el }); });
        else birlik.push({ el: a.el, sec: null });
      });
      main.textContent = "";
      let varaq, ichi, chegara, soni = 0, oram = null, oramSec = null;
      function yangiVaraq() {
        varaq = document.createElement("div");
        varaq.className = "a4-varaq";
        varaq.innerHTML = '<div class="a4-ichi"></div><div class="a4-raqam"></div>';
        main.appendChild(varaq);
        ichi = varaq.firstChild;
        chegara = ichi.clientHeight;
        soni = 0; oram = null; oramSec = null;
      }
      function idish(sec) {
        if (!sec) { oram = null; oramSec = null; return ichi; }
        if (oramSec !== sec || !oram || oram.parentNode !== ichi || oram !== ichi.lastElementChild) {
          oram = sec.cloneNode(false); oram.removeAttribute("id");
          ichi.appendChild(oram); oramSec = sec;
        }
        return oram;
      }
      function pastki(el) { return el.getBoundingClientRect().bottom - ichi.getBoundingClientRect().top; }
      function sigadi(el) { return pastki(el) <= chegara + 1; }
      function olib(el) {
        const p = el.parentNode;
        if (p) p.removeChild(el);
        if (p && p !== ichi && !p.children.length && p.parentNode === ichi) { ichi.removeChild(p); if (oram === p) { oram = null; oramSec = null; } }
      }
      // sarlavhadan keyingi blokning boshi: ro'yxat yoki bo'linadigan quti — birinchi bolasi; bo'linmaydigani (masalan javob) — o'zi butunligicha
      function kichrayt(el) {
        const h = el.getBoundingClientRect().height;
        if (!h || h < chegara * 0.12) return false;   // kichkina blok kichraytirilmaydi — keyingi varaqqa o'tadi
        const joy = chegara - (pastki(el) - h);
        let z = Math.min(0.98, Math.floor(joy / h * 100) / 100);
        if (z < 0.8) return false;
        for (; z >= 0.8; z -= 0.02) {
          el.style.zoom = z.toFixed(2);
          if (sigadi(el)) { kichik.push(el); return true; }
        }
        el.style.zoom = "";
        return false;
      }
      function bosh(el) { return (royxat(el) || (bolinadi(el) && pastki(el) > chegara)) && el.firstElementChild ? el.firstElementChild : el; }
      // el dan oxirgi bolalarini davomiga ko'chirib, sig'diradi; min — qoladigan eng kam bola
      function bol(el, min) {
        const klon = el.cloneNode(false);
        klon.removeAttribute("id");
        if (el.nodeName === "OL") klon.setAttribute("start", (el.start || 1) + el.children.length);
        while (!sigadi(el) && el.children.length > min) klon.insertBefore(el.lastElementChild, klon.firstChild);
        if (el.nodeName === "OL") klon.setAttribute("start", (el.start || 1) + el.children.length);
        if (!klon.children.length) return null;
        if (!sigadi(el)) { while (klon.firstChild) el.appendChild(klon.firstChild); return null; }
        if (!royxat(el)) klon.classList.add("a4-davomi");
        klonlar.push({ asl: el._a4asl || el, klon: klon });
        klon._a4asl = el._a4asl || el;
        return klon;
      }
      yangiVaraq();
      let i = 0;
      const navbat = birlik.slice();
      while (navbat.length) {
        const u = navbat.shift();
        const el = u.el;
        if (el.matches(".q-javob") && soni > 0) yangiVaraq();
        idish(u.sec).appendChild(el);
        // sahifa oxiridagi «Mathlearn · …» yozuvi sig'masa — yangi varaq ochilmaydi, yozuv tushirib qoldiriladi
        if (el.matches(".m-foot") && !sigadi(el) && soni > 0) { olib(el); continue; }
        if (sigadi(el)) {
          // sarlavha (va personaj) keyingi blok bilan birga turadi
          if (birgaKeyingi(el) && soni > 0) {
            const vaqt = [];
            let j = 0, ok = true;
            while (j < navbat.length && j < 3) {
              const n = navbat[j];
              if (n.el.matches(".q-javob")) break;
              idish(n.sec).appendChild(n.el); vaqt.push(n.el);
              if (!sigadi(bosh(n.el)) && !(bosh(n.el) === n.el && kichrayt(n.el))) { ok = false; break; }
              if (!birgaKeyingi(n.el)) break;
              j++;
            }
            vaqt.reverse().forEach(olib);
            if (!ok) { olib(el); yangiVaraq(); idish(u.sec).appendChild(el); }
          }
          soni++;
          continue;
        }
        if (royxat(el)) {
          const k = bol(el, 1);
          if (k) { soni++; navbat.unshift({ el: k, sec: u.sec }); yangiVaraq(); continue; }
        }
        if (soni > 0) {
          // varaqning bo'sh qolgan joyidan foydalanamiz (foydalanuvchi talabi, 2026-10-26):
          // 1) blokni biroz (80% gacha) kichraytirib shu varaqqa sig'diramiz;
          if (kichrayt(el)) { soni++; continue; }
          // 2) bo'linadigan quti yoki ro'yxat bo'lsa va varaqda joy ko'p qolgan bo'lsa — boshini shu varaqqa, davomini keyingisiga;
          const bosh0 = pastki(el) - el.getBoundingClientRect().height;
          if (bolinadi(el) && !el.matches(".misol-juft") && chegara - bosh0 > chegara * 0.3) {
            const k = bol(el, el.matches(".box") && el.firstElementChild && el.firstElementChild.matches(".tag") ? 2 : 1);
            if (k) { soni++; navbat.unshift({ el: k, sec: u.sec }); yangiVaraq(); continue; }
          }
          // 3) bo'lmasa — keyingi varaqqa
          olib(el); yangiVaraq(); navbat.unshift(u); continue;
        }
        // varaqda yolg'iz va baribir sig'maydi
        if (bolinadi(el)) {
          const k = bol(el, el.matches(".box") && el.firstElementChild && el.firstElementChild.matches(".tag") ? 2 : 1);
          if (k) { soni++; navbat.unshift({ el: k, sec: u.sec }); yangiVaraq(); continue; }
        }
        varaq.classList.add("a4-ortiq");
        soni++;
        if (navbat.length) yangiVaraq();
      }
      if (!ichi.children.length && main.children.length > 1) main.removeChild(varaq);
      Array.prototype.forEach.call(main.querySelectorAll(".a4-raqam"), function (r, n) { r.textContent = n + 1; });
      faol = true;
      balandlik();
    }

    function oddiy() {
      if (!asl) return;
      tikla();
      document.querySelectorAll("details").forEach(function (d) { if (ochiqAsl.has(d)) belgila(d, ochiqAsl.get(d)); });
      faol = false;
      balandlik();
    }

    // A4 varaqlar faqat PDF/chop etish uchun; saytda ma'ruza oddiy ko'rinishda (foydalanuvchi qarori, 2026-10-26)
    function kerak() { return CHOP || PDF || chopda; }
    function yangila(majburan) {
      if (!tayyor) return;
      if (!asl) aslniYoz();
      const k = kerak();
      if (k && (!faol || majburan)) { javoblarniOch(); sahifala(); }
      else if (!k && faol) oddiy();
    }

    // PDF fayl nomi — mavzu nomi bilan («Mathlearn 6-sinf — Aylananing uzunligi»)
    let eskiNom = null;
    function pdfNomi() {
      const m = location.pathname.match(/\/(\d+)-[^\/]*$/);
      const nom = (document.title || "").trim();
      return "Mathlearn " + (m ? m[1] + "-sinf — " : "") + nom;
    }
    function nomQoy() {
      const yangi = pdfNomi();
      eskiNom = { o: document.title, t: null };
      document.title = yangi;
      try { if (window.top !== window) { eskiNom.t = window.top.document.title; window.top.document.title = yangi; } } catch (e) {}
    }
    function nomQaytar() {
      if (!eskiNom) return;
      document.title = eskiNom.o;
      try { if (eskiNom.t !== null) window.top.document.title = eskiNom.t; } catch (e) {}
      eskiNom = null;
    }

    function chopgaTayyorla() {
      if (chopda) return;
      chopda = true;
      nomQoy();
      if (!asl) aslniYoz();
      html.classList.add("a4-chop");
      javoblarniOch();
      sahifala();
    }
    function chopdanQayt() {
      if (!chopda) return;
      chopda = false;
      html.classList.remove("a4-chop");
      nomQaytar();
      if (kerak()) { javoblarniOch(); sahifala(); } else oddiy();
    }
    window.addEventListener("beforeprint", function () { if (tayyor) chopgaTayyorla(); });
    window.addEventListener("afterprint", function () { if (!PDF) setTimeout(chopdanQayt, 0); });

    let t = 0;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { yangila(false); }, 150); });
    document.addEventListener("toggle", function (e) {
      const d = e.target;
      if (d._a4k === d.open) { delete d._a4k; return; }
      delete d._a4k;
      if (faol) { clearTimeout(t); t = setTimeout(function () { yangila(true); }, 30); }
    }, true);

    const yuklandi = document.readyState === "complete" ? Promise.resolve() : new Promise(function (ok) { window.addEventListener("load", ok); });
    const shrift = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([katexTayyor.catch(function () {}), yuklandi, shrift]).then(function () {
      tayyor = true;
      html.classList.add("a4-tayyor");
      yangila(false);
      if (PDF) {
        chopgaTayyorla();
        html.classList.add("a4-pdf-tayyor");
      } else if (CHOP) {
        chopgaTayyorla();
        setTimeout(function () { window.print(); }, 400);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boshla);
  else boshla();
})();
