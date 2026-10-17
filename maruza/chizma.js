/* Ma'ruza chizmalari — sahifadagi data-* atributlardan SVG/HTML yasaydi.
   Hammasi KaTeX'dan OLDIN ishlaydi (formulalar \( \) ichida qoldiriladi).

   data-ld="a/b" [data-x="3"]     — burchak usulida bo'lish a : b, verguldan keyin ko'pi bilan x xona
   data-xk="a/b/c/d/k"             — a/b = c/d, surat va maxraj k ga ko'paytiriladi (strelkali sxema)
   data-kataklar="n" [data-jami]   — 10×10 (yoki 10×jami/10) katak, n tasi bo'yalgan
   data-sonoqi="bo'lak/nuqta" [data-yozuv="0,6"] — 0 dan 1 gacha son o'qi, bo'lak ga bo'lingan, nuqta-chi bo'lakda belgi
   data-xona="3594627" [data-bosh="1"]  — xona jadvali (sinflar bilan); bosh="1" — raqamlarsiz bo'sh jadval
   data-tugma="3594627"            — sonli tugmalar: har xonada raqamcha tugma (1 000 000, 100 000, ...)
   data-siljish="324/x100" yoki "41300/:100" — xona jadvalida raqamlarning surilishi (bir xil raqam — bir xil rang)
   data-oq="0/1000000/100000" [data-nuqta="A:300000,B:750000"] [data-har="2"] — katta sonlar uchun son o'qi
   data-zanjir="43/x2/x10" yoki "540/:10/:6" — amallar zanjiri: son →(×2)→ 86 →(×10)→ 860
   data-nollar="63000/700"          — bo'linuvchi va bo'luvchi oxiridagi teng sondagi nollar chizib tashlanadi
   data-tartib="60 - 15 + 12 : 3 * 2" [data-qadam="0"] — amallar ustida bajarilish tartibi (1, 2, 3 ...) va qadamma-qadam yechim
   data-tasma="Otasi:4|O'g'li:1" [data-farq="36 yil"] [data-bolak="12"] — chizmali model: teng bo'laklardan tasmalar
   data-pitsa="2/3" [data-usul="butun"] — a ta pitsa b ta bolaga: har pitsa b bo'lakka, har bola o'z rangida;
                                          usul="butun" — avval butun pitsalar beriladi, qolgani bo'linadi (aralash son)
   data-doira="2 3/4" [data-rang="0"]   — aralash son doiralarda: butunlar to'liq, kasr qism bo'yalgan bo'laklar
   data-qism="10/3/5" [data-yozuv="qizil"] [data-izoh="0"] — sonning qismi: n ta narsa b ta teng guruhga, a tasi bo'yalgan;
                                          n katta bo'lsa — tasma (har bo'lakda qiymati yozilgan); izoh="0" — hisob yozilmaydi (mashq uchun)
   data-yuza="1/3/2/3"             — a/b ning c/d qismi (to'g'ri to'rtburchak modeli): b ta ustundan a tasi bo'yalgan,
                                          d ta qatordan c tasi shtrixlangan — shtrixlangan kataklar a·c / b·d
   data-qolgan="1/6/2/5" [data-yozuv="1/6|Bo'yalmagan qism|?"] — tasmaning a/b qismi bo'yalgan, qolgan qismning
                                          c/d qismi belgilangan (kerak bo'lsa bo'laklar maydaroq bo'linadi)
*/
(function () {
  "use strict";

  // ---------- burchak usulida bo'lish ----------
  // Natija: dividend raqamlari (vergul bilan), qatorlar (ayiriladigan ko'paytmalar va qoldiqlar), bo'linma.
  function bolish(a, b, maxX) {
    const intStr = String(a);
    const intLen = intStr.length;
    const digits = intStr.split("").map(Number);
    for (let i = 0; i < maxX; i++) digits.push(0);
    const rows = [];       // {text, end, ul, minus}
    let q = "";            // bo'linma
    let r = 0, started = false, used = intLen, tugadi = false;
    for (let i = 0; i < digits.length; i++) {
      r = r * 10 + digits[i];
      const qd = Math.floor(r / b);
      if (!started && qd === 0) {
        if (i >= intLen - 1) q += "0";          // butun qismi 0 yoki verguldan keyingi 0
      } else {
        if (started && qd > 0) rows.push({ text: String(r), end: i });
        if (qd > 0) {
          rows.push({ text: String(qd * b), end: i, ul: true, minus: true });
          started = true;
        }
        q += String(qd);
        r = r - qd * b;
      }
      if (i === intLen - 1) q += ",";
      used = i + 1;
      if (i >= intLen - 1 && r === 0 && started) { tugadi = true; break; }
    }
    rows.push({ text: String(r), end: used - 1 });
    if (q.endsWith(",")) q = q.slice(0, -1);
    if (!tugadi) q += "...";
    return { digits: digits.slice(0, used), intLen: intLen, rows: rows, q: q, tugadi: tugadi };
  }

  function chizLd(el) {
    const [a, b] = el.dataset.ld.split("/").map(Number);
    const maxX = Number(el.dataset.x || 3);
    const res = bolish(a, b, maxX);
    const cols = res.digits.length + 1;          // 0-ustun — minus belgisi uchun
    const l = document.createElement("div");
    l.className = "ld-l";
    l.style.gridTemplateColumns = "repeat(" + cols + ", 0.78em)";
    const cell = (txt, col, row, cls) => {
      const c = document.createElement("span");
      c.className = "ld-c" + (cls ? " " + cls : "");
      c.textContent = txt;
      c.style.gridColumn = String(col + 1);
      c.style.gridRow = String(row + 1);
      l.appendChild(c);
    };
    res.digits.forEach((d, i) => cell(String(d), i + 1, 0, i === res.intLen - 1 && res.digits.length > res.intLen ? "cm" : ""));
    res.rows.forEach((rw, k) => {
      const start = rw.end - rw.text.length + 1;
      rw.text.split("").forEach((ch, j) => cell(ch, start + j + 1, k + 1, rw.ul ? "ul" : ""));
      if (rw.minus) cell("−", start, k + 1, "mn");
    });
    const r = document.createElement("div");
    r.className = "ld-r";
    r.innerHTML = '<span class="ld-d">' + b + '</span><span class="ld-q">' + res.q + "</span>";
    el.classList.add("ld");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", a + " ni " + b + " ga burchak usulida bo'lish: " + res.q);
    el.innerHTML = "";
    el.appendChild(l);
    el.appendChild(r);
  }

  // ---------- ×k strelkali sxema ----------
  function yoy(tepa) {
    return '<svg viewBox="0 0 120 16" aria-hidden="true">' +
      (tepa
        ? '<path d="M10 15 Q60 -5 108 13" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M101 8 L109 14 L99 16 Z" fill="currentColor"/>'
        : '<path d="M10 1 Q60 21 108 3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M99 0 L109 2 L102 9 Z" fill="currentColor"/>') +
      "</svg>";
  }
  function chizXk(el) {
    const [a, b, c, d, k] = el.dataset.xk.split("/");
    el.classList.add("xk");
    el.innerHTML =
      '<span class="pill">× ' + k + "</span>" + yoy(true) +
      '<span class="mid">\\(\\frac{\\sur{' + a + '}}{\\mx{' + b + '}}\\)<span>=</span>\\(\\frac{\\sur{' + c + '}}{\\mx{' + d + '}}\\)</span>' +
      yoy(false) + '<span class="pill">× ' + k + "</span>";
    el.setAttribute("aria-label", a + "/" + b + " kasrning surati va maxrajini " + k + " ga ko'paytiramiz: " + c + "/" + d);
  }

  // ---------- 10×10 katak ----------
  function chizKataklar(el) {
    const n = Number(el.dataset.kataklar);
    const jami = Number(el.dataset.jami || 100);
    const qatorlar = jami / 10, s = 22, g = 2;
    const W = 10 * s + 2 * g, H = qatorlar * s + 2 * g;
    let h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="' + jami + " ta katakdan " + n + ' tasi bo\'yalgan">';
    for (let i = 0; i < jami; i++) {
      const x = g + (i % 10) * s, y = g + Math.floor(i / 10) * s;
      h += '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" fill="' + (i < n ? "#12805c" : "#fff") + '" fill-opacity="' + (i < n ? 0.75 : 1) + '" stroke="#9aa3b5" stroke-width="1"/>';
    }
    h += '<rect x="' + g + '" y="' + g + '" width="' + 10 * s + '" height="' + qatorlar * s + '" fill="none" stroke="#1f2433" stroke-width="2"/></svg>';
    el.classList.add("chz");
    el.innerHTML = h;
  }

  // ---------- son o'qi 0..1 ----------
  function chizSonoqi(el) {
    const [bolak, nuqta] = el.dataset.sonoqi.split("/").map(Number);
    const yozuv = el.dataset.yozuv || "";
    const W = 520, x0 = 30, x1 = 490, y = 50;
    const step = (x1 - x0) / bolak;
    let h = '<svg viewBox="0 0 ' + W + ' 96" width="' + W + '" role="img" aria-label="0 dan 1 gacha son o\'qi, ' + bolak + " ta teng bo'lak, belgilangan nuqta " + nuqta + "-bo'lakda" + '">';
    h += '<line x1="' + (x0 - 12) + '" y1="' + y + '" x2="' + (x1 + 18) + '" y2="' + y + '" stroke="#1f2433" stroke-width="2"/>';
    h += '<path d="M' + (x1 + 18) + " " + (y - 5) + " L" + (x1 + 27) + " " + y + " L" + (x1 + 18) + " " + (y + 5) + ' Z" fill="#1f2433"/>';
    h += '<rect x="' + x0 + '" y="' + (y - 5) + '" width="' + nuqta * step + '" height="10" fill="#12805c" fill-opacity=".35"/>';
    for (let i = 0; i <= bolak; i++) {
      const x = x0 + i * step, big = i === 0 || i === bolak;
      h += '<line x1="' + x + '" y1="' + (y - (big ? 11 : 7)) + '" x2="' + x + '" y2="' + (y + (big ? 11 : 7)) + '" stroke="#1f2433" stroke-width="' + (big ? 2 : 1.4) + '"/>';
    }
    h += '<text x="' + x0 + '" y="' + (y + 32) + '" text-anchor="middle" font-size="20" fill="#1f2433">0</text>';
    h += '<text x="' + x1 + '" y="' + (y + 32) + '" text-anchor="middle" font-size="20" fill="#1f2433">1</text>';
    const xn = x0 + nuqta * step;
    h += '<circle cx="' + xn + '" cy="' + y + '" r="7" fill="#12805c"/>';
    if (yozuv) h += '<text x="' + xn + '" y="' + (y - 18) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#12805c">' + yozuv + "</text>";
    h += "</svg>";
    el.classList.add("chz");
    el.innerHTML = h;
  }


  // ---------- xona jadvali ----------
  const XONALAR = ["Birlar", "O'nlar", "Yuzlar", "Minglar", "O'n minglar", "Yuz minglar", "Millionlar", "O'n millionlar"];
  const SINFLAR = ["Birlar sinfi", "Minglar sinfi", "Millionlar sinfi"];
  const SINF_RANG = ["#e3f5ec", "#eef0fc", "#fff4e5"];
  function chizXona(el) {
    const son = el.dataset.xona.replace(/\D/g, "");
    const n = Math.max(son.length, Number(el.dataset.ustun || 0), 7);
    const bosh = el.dataset.bosh === "1";
    let sinfQator = "", xonaQator = "", raqamQator = "";
    for (let k = Math.ceil(n / 3) - 1; k >= 0; k--) {
      const cols = Math.min(3, n - 3 * k);
      sinfQator += '<th colspan="' + cols + '" style="background:' + SINF_RANG[k] + '">' + SINFLAR[k] + "</th>";
    }
    for (let i = n - 1; i >= 0; i--) {
      const k = Math.floor(i / 3);
      const d = son.length > i ? son[son.length - 1 - i] : "";
      xonaQator += '<th style="background:' + SINF_RANG[k] + '">' + XONALAR[i] + "</th>";
      raqamQator += '<td style="background:' + SINF_RANG[k] + '">' + (bosh ? "&nbsp;" : d) + "</td>";
    }
    el.classList.add("xona-jad");
    el.innerHTML = '<table class="jad"><tr>' + sinfQator + "</tr><tr>" + xonaQator + "</tr><tr class=\"raqam\">" + raqamQator + "</tr></table>";
    el.setAttribute("aria-label", "Xona jadvali: " + son);
  }

  // ---------- sonli tugmalar ----------
  const TUGMA_RANG = ["#12805c", "#1f5fd6", "#d4501b", "#7c3aed", "#0e7490", "#b45309", "#be185d", "#334155"];
  function chizTugma(el) {
    const son = el.dataset.tugma.replace(/\D/g, "");
    const n = son.length;
    let h = "";
    for (let j = 0; j < n; j++) {
      const i = n - 1 - j, d = Number(son[j]);
      const qiymat = String(Math.pow(10, i)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      let t = "";
      for (let k = 0; k < d; k++) t += '<i style="background:' + TUGMA_RANG[i] + '"></i>';
      h += '<div class="tg-u"><b style="color:' + TUGMA_RANG[i] + '">' + qiymat + "</b><span>" + d + ' ta</span><div class="tg-d">' + t + "</div></div>";
    }
    el.className += " tugmalar";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "Sonli tugmalar: " + son);
    el.innerHTML = h;
  }

  // ---------- katta sonlar uchun son o'qi ----------
  // 5 va undan ko'p xonali sonlar sinflarga ajratib yoziladi (4 xonali — ajratilmaydi, darslikdagidek)
  function guruh(x) { const t = String(x); return t.length < 5 ? t : t.replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function chizOq(el) {
    const [a, b, step] = el.dataset.oq.split("/").map(Number);
    const har = Number(el.dataset.har || 1);   // har nechta belgida son yoziladi
    const nuqtalar = (el.dataset.nuqta || "").split(",").filter(Boolean).map(function (p) { const q = p.split(":"); return { h: q[0], v: Number(q[1]) }; });
    const W = 470, x0 = 38, x1 = 422, y = 64;
    const kx = function (v) { return x0 + (v - a) / (b - a) * (x1 - x0); };
    let h = '<svg viewBox="0 0 ' + W + ' 112" width="' + W + '" role="img" aria-label="Son o\'qi ' + guruh(a) + " dan " + guruh(b) + ' gacha">';
    h += '<line x1="' + (x0 - 14) + '" y1="' + y + '" x2="' + (x1 + 22) + '" y2="' + y + '" stroke="#1f2433" stroke-width="2"/>';
    h += '<path d="M' + (x1 + 22) + " " + (y - 5) + " L" + (x1 + 31) + " " + y + " L" + (x1 + 22) + " " + (y + 5) + ' Z" fill="#1f2433"/>';
    let k = 0;
    for (let v = a; v <= b + 1e-9; v += step, k++) {
      const x = kx(v), yoz = k % har === 0;
      h += '<line x1="' + x + '" y1="' + (y - (yoz ? 9 : 6)) + '" x2="' + x + '" y2="' + (y + (yoz ? 9 : 6)) + '" stroke="#1f2433" stroke-width="' + (yoz ? 1.8 : 1.2) + '"/>';
      if (yoz) h += '<text x="' + x + '" y="' + (y + 30) + '" text-anchor="middle" font-size="15" fill="#1f2433">' + guruh(v) + "</text>";
    }
    nuqtalar.forEach(function (p) {
      const x = kx(p.v);
      h += '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="#d4501b"/>';
      h += '<text x="' + x + '" y="' + (y - 16) + '" text-anchor="middle" font-size="21" font-weight="800" fill="#d4501b">' + p.h + "</text>";
    });
    h += "</svg>";
    el.classList.add("chz");
    el.innerHTML = h;
  }


  // ---------- 10, 100, 1000 ga ko'paytirish/bo'lishda raqamlar surilishi ----------
  const QISQA = ["B", "O'", "Y", "M", "O'M", "YM", "Mln", "O'Mln"];
  const SIL_RANG = ["#1f5fd6", "#d4501b", "#7c3aed", "#0e7490", "#be185d", "#b45309", "#334155"];
  function chizSiljish(el) {
    const [sonS, amal] = el.dataset.siljish.split("/");
    const son = Number(sonS), k = Number(amal.slice(1)), kop = amal[0] === "x";
    const nol = String(k).length - 1;
    const natija = kop ? son * k : son / k;
    const a = String(son), b = String(natija);
    const n = Math.max(a.length, b.length);
    // asl sonning noldan farqli "tana" raqamlari rangda, qo'shilgan/olib tashlangan nollar kulrang
    const tana = kop ? a : b;                     // ikkala sonda ham turgan raqamlar ketma-ketligi
    const qator = function (str, isAsl) {
      let h = "";
      for (let c = n - 1; c >= 0; c--) {
        const idx = str.length - 1 - c;
        if (idx < 0) { h += "<td></td>"; continue; }
        const d = str[idx];
        let rang = "#9aa3b5";
        if (idx < tana.length) rang = SIL_RANG[idx % SIL_RANG.length];
        h += '<td style="color:' + rang + '">' + d + "</td>";
      }
      return "<tr><th>" + (isAsl ? "son" : "natija") + "</th>" + h + "</tr>";
    };
    let bosh = "<tr><th></th>";
    for (let c = n - 1; c >= 0; c--) bosh += "<th>" + QISQA[c] + "</th>";
    bosh += "</tr>";
    const belgi = kop ? "× " + k : ": " + k;
    const izoh = kop
      ? "Har bir raqam " + nol + " xona chapga suriladi, o'ngga " + nol + " ta nol yoziladi."
      : "Har bir raqam " + nol + " xona o'ngga suriladi, oxiridagi " + nol + " ta nol tushib qoladi.";
    el.classList.add("siljish");
    el.innerHTML = '<table class="jad">' + bosh + qator(a, true) +
      '<tr class="sil-amal"><td colspan="' + (n + 1) + '">' + belgi + (kop ? " — raqamlar chapga ⟵" : " — raqamlar o'ngga ⟶") + "</td></tr>" +
      qator(b, false) + "</table>" +
      '<p class="chz-cap">' + guruh(son) + " " + (kop ? "×" : ":") + " " + guruh(k) + " = " + guruh(natija) + ". " + izoh + "</p>";
  }

  // ---------- amallar zanjiri: 43 →(×2)→ 86 →(×10)→ 860 ----------
  function strelka() {
    return '<svg viewBox="0 0 56 14" aria-hidden="true"><path d="M2 7 H50" stroke="currentColor" stroke-width="2"/><path d="M44 2 L53 7 L44 12 Z" fill="currentColor"/></svg>';
  }
  function chizZanjir(el) {
    const q = el.dataset.zanjir.split("/");
    let v = Number(q[0]);
    let h = '<span class="z-son z-bosh">' + guruh(v) + "</span>";
    const izoh = [];
    for (let i = 1; i < q.length; i++) {
      const kop = q[i][0] === "x", k = Number(q[i].slice(1));
      const oldin = v;
      v = kop ? v * k : v / k;
      izoh.push(guruh(oldin) + (kop ? " × " : " : ") + guruh(k) + " = " + guruh(v));
      h += '<span class="z-qadam"><span class="pill">' + (kop ? "× " : ": ") + guruh(k) + "</span>" + strelka() + "</span>" +
        '<span class="z-son' + (i === q.length - 1 ? " z-oxir" : "") + '">' + guruh(v) + "</span>";
    }
    el.classList.add("zanjir");
    el.innerHTML = h;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", izoh.join(", "));
  }

  // ---------- bo'lishda oxiridagi teng nollarni tashlash: 630|00 : 7|00 ----------
  function nollarSoni(t) { const m = t.match(/0*$/); return m ? m[0].length : 0; }
  function chizNollar(el) {
    const [a, b] = el.dataset.nollar.split("/");
    const k = Math.min(nollarSoni(a), nollarSoni(b));
    const yoz = function (t) {
      return '<span class="n-tana">' + guruh(t.slice(0, t.length - k)) + "</span>" +
        (k ? '<span class="n-nol">' + t.slice(t.length - k) + "</span>" : "");
    };
    const a2 = Number(a.slice(0, a.length - k)), b2 = Number(b.slice(0, b.length - k));
    const nat = a2 / b2;
    const nomi = ["", "bittadan", "ikkitadan", "uchtadan", "to'rttadan"][k] || k + " tadan";
    el.classList.add("nollar");
    el.innerHTML = '<div class="n-qator">' + yoz(a) + '<span class="n-belgi">:</span>' + yoz(b) +
      '<span class="n-belgi">=</span><span class="n-tana">' + guruh(a2) + '</span><span class="n-belgi">:</span><span class="n-tana">' + guruh(b2) + "</span>" +
      '<span class="n-belgi">=</span><span class="n-natija">' + guruh(nat) + "</span></div>" +
      '<p class="chz-cap">Ikkala sonning oxirida ' + nomi + " nol bor — ularni tashlaymiz (ikkalasini " + guruh(Math.pow(10, k)) + " ga bo'lamiz), bo'linma o'zgarmaydi.</p>";
  }

  // ---------- amallarni bajarish tartibi ----------
  // Qoidalar: avval qavs ichi (ichkisidan, chapdan o'ngga), keyin × va : (chapdan o'ngga), so'ng + va − (chapdan o'ngga).
  const AMAL = { "+": "+", "-": "−", "−": "−", "*": "·", "×": "·", "·": "·", ":": ":", "/": ":", "÷": ":" };
  function tokenlar(ifoda) {
    const t = [];
    const re = /\s*(\d+|[()+\-−*×·:\/÷])/g;
    let m, id = 0;
    while ((m = re.exec(ifoda))) {
      const x = m[1];
      if (/\d/.test(x)) t.push({ k: "son", v: Number(x) });
      else if (x === "(" || x === ")") t.push({ k: x });
      else t.push({ k: "amal", v: AMAL[x], id: id++ });
    }
    return t;
  }
  function hisobla(a, op, b) { return op === "+" ? a + b : op === "−" ? a - b : op === "·" ? a * b : a / b; }
  // bitta qadam: keyingi bajariladigan amalni topib bajaradi; {t, id, natija} qaytaradi
  function qadam(t) {
    // eng ichki qavs: ")" dan oldingi eng yaqin "("
    let bosh = 0, oxir = t.length;
    const yop = t.findIndex(function (x) { return x.k === ")"; });
    if (yop >= 0) {
      let och = yop; while (t[och].k !== "(") och--;
      bosh = och + 1; oxir = yop;
    }
    let i = -1;
    for (let j = bosh; j < oxir; j++) if (t[j].k === "amal" && (t[j].v === "·" || t[j].v === ":")) { i = j; break; }
    if (i < 0) for (let j = bosh; j < oxir; j++) if (t[j].k === "amal") { i = j; break; }
    const op = t[i];
    const n = hisobla(t[i - 1].v, op.v, t[i + 1].v);
    const yangi = t.slice(0, i - 1).concat([{ k: "son", v: n }], t.slice(i + 2));
    // qavs ichida bitta son qolsa — qavslar olib tashlanadi
    for (let j = 1; j < yangi.length - 1; j++) {
      if (yangi[j - 1].k === "(" && yangi[j].k === "son" && yangi[j + 1].k === ")") { yangi.splice(j + 1, 1); yangi.splice(j - 1, 1); break; }
    }
    return { t: yangi, id: op.id, natija: n };
  }
  function yozTok(t, tartib) {
    return t.map(function (x) {
      if (x.k === "son") return '<span class="t-son">' + guruh(x.v) + "</span>";
      if (x.k === "amal") {
        const n = tartib ? tartib[x.id] : 0;
        return '<span class="t-amal' + (n ? " t-r" + ((n - 1) % 6) : "") + '">' + (n ? '<b class="t-n">' + n + "</b>" : "") + x.v + "</span>";
      }
      return '<span class="t-qavs">' + x.k + "</span>";
    }).join("");
  }
  function chizTartib(el) {
    let t = tokenlar(el.dataset.tartib);
    const bosh = t;
    const tartib = {}, qatorlar = [];
    let n = 0;
    while (t.length > 1 && n < 30) {
      const q = qadam(t);
      tartib[q.id] = ++n;
      t = q.t;
      qatorlar.push(t);
    }
    el.classList.add("tartib");
    let h = '<div class="t-ifoda">' + yozTok(bosh, tartib) + "</div>";
    if (el.dataset.qadam !== "0") h += qatorlar.map(function (q, k) {
      return '<div class="t-qator' + (k === qatorlar.length - 1 ? " t-oxir" : "") + '"><span class="t-teng">=</span>' + yozTok(q, null) + "</div>";
    }).join("");
    el.innerHTML = h;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", el.dataset.tartib + " = " + guruh(t[0].v) + ", amallar tartibi raqamlar bilan ko'rsatilgan");
  }

  // ---------- chizmali model (tasmalar) ----------
  const TASMA_RANG = [["#dbe7ff", "#1f5fd6"], ["#ffe6d6", "#d4501b"], ["#dcf3e8", "#12805c"], ["#ece4fb", "#6d3fc0"]];
  function chizTasma(el) {
    const qator = el.dataset.tasma.split("|").map(function (q) { const p = q.split(":"); return { nom: p[0], b: Number(p[1]) }; });
    const maxB = Math.max.apply(null, qator.map(function (q) { return q.b; }));
    const W = 380, L = 86, R = 8, H = 34, gap = 14, top = el.dataset.farq ? 36 : 8;
    const w = (W - L - R) / maxB;
    const bolak = el.dataset.bolak || "";
    let svg = "";
    qator.forEach(function (q, i) {
      const y = top + i * (H + gap), c = TASMA_RANG[i % TASMA_RANG.length];
      svg += '<text x="' + (L - 10) + '" y="' + (y + H / 2 + 5) + '" text-anchor="end" font-size="16" font-weight="700" fill="#1f2433">' + q.nom + "</text>";
      for (let k = 0; k < q.b; k++) {
        svg += '<rect x="' + (L + k * w) + '" y="' + y + '" width="' + w + '" height="' + H + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2" rx="3"/>';
        if (bolak) svg += '<text x="' + (L + k * w + w / 2) + '" y="' + (y + H / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + c[1] + '">' + bolak + "</text>";
      }
    });
    if (el.dataset.farq && qator.length > 1) {
      // farq: birinchi tasmaning ikkinchisidan ortiq qismi ustida qavs
      const x1 = L + qator[1].b * w, x2 = L + qator[0].b * w, y = top - 6;
      svg += '<path d="M' + x1 + " " + (y + 4) + " V" + (y - 2) + " H" + x2 + " V" + (y + 4) + '" fill="none" stroke="#b45309" stroke-width="2"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 8) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#b45309">' + el.dataset.farq + "</text>";
    }
    const Ht = top + qator.length * (H + gap) - gap + 6;
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + Ht + '" role="img" aria-label="Chizmali model: ' +
      qator.map(function (q) { return q.nom + " — " + q.b + " bo'lak"; }).join(", ") + '">' + svg + "</svg>";
  }

  // ---------- pitsalarni bolalarga teng bo'lish ----------
  const BOLA_RANG = ["#1f5fd6", "#d4501b", "#12805c", "#6d3fc0", "#be185d", "#0e7490", "#b45309", "#334155", "#65a30d", "#c026d3", "#0891b2", "#dc2626"];
  function sektor(cx, cy, r, a0, a1, rang) {
    if (a1 - a0 >= Math.PI * 2 - 1e-9) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + rang + '" fill-opacity=".8" stroke="#fff" stroke-width="2"/>';
    const x0 = cx + r * Math.sin(a0), y0 = cy - r * Math.cos(a0), x1 = cx + r * Math.sin(a1), y1 = cy - r * Math.cos(a1);
    return '<path d="M' + cx + " " + cy + " L" + x0.toFixed(2) + " " + y0.toFixed(2) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2) + ' Z" fill="' + rang + '" fill-opacity=".8" stroke="#fff" stroke-width="2"/>';
  }
  function chizPitsa(el) {
    const [a, b] = el.dataset.pitsa.split("/").map(Number);
    const butunUsul = el.dataset.usul === "butun";
    const butunlar = butunUsul ? Math.floor(a / b) * b : 0;   // butunligicha beriladigan pitsalar
    const r = 34, d = 2 * r + 14;
    const qator = Math.min(a, 6), qatorlar = Math.ceil(a / 6);
    const W = qator * d, H = qatorlar * d;
    let svg = "";
    for (let i = 0; i < a; i++) {
      const cx = (i % 6) * d + d / 2, cy = Math.floor(i / 6) * d + d / 2;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 3) + '" fill="#f6d9a8" stroke="#c98b3a" stroke-width="2"/>';
      if (i < butunlar) svg += sektor(cx, cy, r, 0, Math.PI * 2, BOLA_RANG[i % b]);
      else for (let k = 0; k < b; k++) svg += sektor(cx, cy, r, k * 2 * Math.PI / b, (k + 1) * 2 * Math.PI / b, BOLA_RANG[k % BOLA_RANG.length]);
    }
    const leg = [];
    for (let k = 0; k < b; k++) leg.push('<span><i style="background:' + BOLA_RANG[k % BOLA_RANG.length] + '"></i>' + (k + 1) + "-bola</span>");
    el.classList.add("pitsa");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" style="max-width:' + W + 'px" role="img" aria-label="' + a + " ta pitsa " + b +
      " ta bolaga teng bo'lindi" + (butunUsul ? ": avval butun pitsalar, keyin qolgani bo'laklarga" : ": har pitsa " + b + " ta teng bo'lakka") + '">' + svg + "</svg>" +
      '<div class="pitsa-leg">' + leg.join("") + "</div>";
  }

  // ---------- aralash son doiralarda: 2 3/4 ----------
  const DOIRA_RANG = ["#1f5fd6", "#d4501b", "#12805c", "#6d3fc0"];
  function chizDoira(el) {
    const m = el.dataset.doira.trim().match(/^(?:(\d+)\s*)?(?:(\d+)\/(\d+))?$/);
    const butun = Number(m[1] || 0), sur = Number(m[2] || 0), mx = Number(m[3] || 1);
    const rang = DOIRA_RANG[Number(el.dataset.rang || 0) % DOIRA_RANG.length];
    // kasr qism noto'g'ri bo'lsa (masalan 2 5/4), bo'laklari bilan bir nechta doira chiziladi
    const r = 26, d = 2 * r + 10, n = butun + Math.ceil(sur / mx);
    let svg = "";
    for (let i = 0; i < n; i++) {
      const cx = i * d + d / 2, cy = d / 2;
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" stroke="#9aa3b5" stroke-width="1.5"/>';
      const k = i < butun ? mx : Math.min(mx, sur - (i - butun) * mx);
      for (let j = 0; j < mx; j++) {
        if (j < k) svg += sektor(cx, cy, r, j * 2 * Math.PI / mx, (j + 1) * 2 * Math.PI / mx, rang);
        else if (mx > 1) svg += sektor(cx, cy, r, j * 2 * Math.PI / mx, (j + 1) * 2 * Math.PI / mx, "#eef0f5");
      }
    }
    el.classList.add("doira");
    el.innerHTML = '<svg viewBox="0 0 ' + Math.max(n, 1) * d + " " + d + '" style="max-width:' + Math.max(n, 1) * d + 'px" role="img" aria-label="' +
      (butun ? butun + " butun " : "") + (sur ? sur + "/" + mx : "") + '">' + svg + "</svg>";
  }

  // ---------- sonning qismi: 10 ning 3/5 qismi ----------
  function chizQism(el) {
    const [n, a, b] = el.dataset.qism.split("/").map(Number);
    const k = n / b, nat = k * a, yozuv = el.dataset.yozuv || "";
    const RANG = "#d4501b", BOSH = "#1f5fd6";
    let svg = "", W, H;
    if (n <= 40) {
      // har guruh — quti, ichida k ta shar (1–3 ustun)
      const c = k <= 3 ? 1 : k <= 8 ? 2 : 3, q = Math.ceil(k / c), s = 22, p = 6, gap = 10;
      const bw = c * s + 2 * p, bh = q * s + 2 * p;
      W = b * bw + (b - 1) * gap + 4; H = bh + (yozuv ? 40 : 6);
      for (let g = 0; g < b; g++) {
        const x = 2 + g * (bw + gap), on = g < a;
        svg += '<rect x="' + x + '" y="2" width="' + bw + '" height="' + bh + '" rx="7" fill="' + (on ? "#fff1ea" : "#fff") + '" stroke="' + (on ? RANG : "#9aa3b5") + '" stroke-width="2"/>';
        for (let i = 0; i < k; i++) {
          svg += '<circle cx="' + (x + p + (i % c) * s + s / 2) + '" cy="' + (2 + p + Math.floor(i / c) * s + s / 2) + '" r="7.5" fill="' + (on ? RANG : BOSH) + '"/>';
        }
      }
      if (yozuv) {
        const x2 = 2 + a * (bw + gap) - gap, y = bh + 8;
        // yozuv qavsdan uzun bo'lsa, rasm chetidan chiqib ketmasin
        const tw = yozuv.length * 8.6, tx = Math.max((2 + x2) / 2, tw / 2 + 2);
        W = Math.max(W, tx + tw / 2 + 2);
        svg += '<path d="M2 ' + y + " Q2 " + (y + 8) + " 10 " + (y + 8) + " H" + (x2 - 8) + " Q" + x2 + " " + (y + 8) + " " + x2 + " " + y + '" fill="none" stroke="' + RANG + '" stroke-width="2"/>' +
          '<text x="' + tx + '" y="' + (y + 28) + '" text-anchor="middle" font-size="16" font-weight="700" fill="' + RANG + '">' + yozuv + "</text>";
      }
    } else {
      // tasma: b ta teng bo'lak, a tasi bo'yalgan, ustida jami, har bo'lakda qiymati
      const L = 4, w = 380 / b, y = 30, h = 36;
      W = L * 2 + 380; H = y + h + (yozuv ? 34 : 6);
      svg += '<path d="M' + L + " " + (y - 6) + " V" + (y - 12) + " H" + (L + 380) + " V" + (y - 6) + '" fill="none" stroke="#1f2433" stroke-width="1.6"/>' +
        '<text x="' + (L + 190) + '" y="' + (y - 17) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + guruh(n) + "</text>";
      for (let g = 0; g < b; g++) {
        const on = g < a;
        svg += '<rect x="' + (L + g * w) + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (on ? "#ffe6d6" : "#fff") + '" stroke="' + (on ? RANG : "#9aa3b5") + '" stroke-width="2"/>' +
          '<text x="' + (L + g * w + w / 2) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle" font-size="16" font-weight="700" fill="' + (on ? RANG : "#5f6676") + '">' + guruh(k) + "</text>";
      }
      if (yozuv) svg += '<text x="' + (L + a * w / 2) + '" y="' + (y + h + 24) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + RANG + '">' + yozuv + "</text>";
    }
    el.classList.add("qism");
    const izoh = el.dataset.izoh === "0" ? "" :
      '<p class="chz-cap">' + guruh(n) + " : " + b + " = " + guruh(k) + " — bitta bo'lak; &nbsp;" + guruh(k) + " · " + a + " = " + guruh(nat) + " — " + a + " ta bo'lak.</p>";
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" style="max-width:' + W + 'px" role="img" aria-label="' + n + " ta narsa " + b + " ta teng guruhga bo'lingan, " + a + ' tasi bo\'yalgan">' + svg + "</svg>" + izoh;
  }

  // ---------- kasrning kasr qismi: to'g'ri to'rtburchak modeli ----------
  let yuzaId = 0;
  // a > b bo'lsa (noto'g'ri kasr) — bir nechta butun to'rtburchak yonma-yon chiziladi
  function chizYuza(el) {
    const [a, b, c, d] = el.dataset.yuza.split("/").map(Number);
    const butun = Math.ceil(a / b), gap = 18;
    const W = butun === 1 ? 300 : 210, H = butun === 1 ? 180 : 140, w = W / b, h = H / d, id = "shtrix" + (++yuzaId);
    let svg = '<defs><pattern id="' + id + '" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="9" height="9" fill="#f3e4a8"/><line x1="0" y1="0" x2="0" y2="9" stroke="#d4501b" stroke-width="3.5"/></pattern></defs>';
    for (let t = 0; t < butun; t++) {
      const x0 = 3 + t * (W + gap), y0 = 3, ust = Math.min(b, a - t * b);   // shu butundagi bo'yalgan ustunlar
      svg += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="#fff"/>';
      svg += '<rect x="' + x0 + '" y="' + y0 + '" width="' + ust * w + '" height="' + H + '" fill="#ece4fb"/>';
      svg += '<rect x="' + x0 + '" y="' + y0 + '" width="' + ust * w + '" height="' + c * h + '" fill="url(#' + id + ')"/>';
      for (let i = 1; i < b; i++) svg += '<line x1="' + (x0 + i * w) + '" y1="' + y0 + '" x2="' + (x0 + i * w) + '" y2="' + (y0 + H) + '" stroke="#9aa3b5" stroke-width="1.5"/>';
      for (let j = 1; j < d; j++) svg += '<line x1="' + x0 + '" y1="' + (y0 + j * h) + '" x2="' + (x0 + W) + '" y2="' + (y0 + j * h) + '" stroke="#9aa3b5" stroke-width="1.5" stroke-dasharray="6 4"/>';
      svg += '<rect x="' + x0 + '" y="' + y0 + '" width="' + ust * w + '" height="' + H + '" fill="none" stroke="#6d3fc0" stroke-width="2.5"/>';
      svg += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="none" stroke="#1f2433" stroke-width="2.5"/>';
    }
    const n = a * c, m = b * d, VW = butun * W + (butun - 1) * gap + 6;
    el.classList.add("yuza");
    el.innerHTML = '<svg viewBox="0 0 ' + VW + " " + (H + 6) + '" style="max-width:' + VW + 'px" role="img" aria-label="' + a + "/" + b + " ning " + c + "/" + d + " qismi: bitta butun " + m + " ta katak, " + n + ' ta katak shtrixlangan">' + svg + "</svg>" +
      '<p class="chz-cap"><span class="yz-b"></span>bo\'yalgan: \\(\\frac{' + a + "}{" + b + '}\\) &nbsp; <span class="yz-s"></span>shtrixlangan: ' + n + " ta katak, bitta butun — " + m + " ta katak. \\(\\frac{" + a + "}{" + b + "} \\cdot \\frac{" + c + "}{" + d + "} = \\frac{" + n + "}{" + m + "}\\)</p>";
  }

  // ---------- qolgan qismning qismi: tasma modeli ----------
  function ekub(x, y) { return y ? ekub(y, x % y) : x; }
  function chizQolgan(el) {
    const [a, b, c, d] = el.dataset.qolgan.split("/").map(Number);
    const yoz = (el.dataset.yozuv || a + "/" + b + "|Qolgan qism|" + c + "/" + d + " qismi").split("|");
    const k = d / ekub(b - a, d);                  // har bo'lak k ta mayda bo'lakka bo'linadi
    const n = b * k, sariq = a * k, belgi = (b - a) * k * c / d;
    const L = 4, W = 400, w = W / n, y = 42, h = 36;
    let svg = "";
    for (let i = 0; i < n; i++) {
      const fill = i < sariq ? "#fde68a" : i < sariq + belgi ? "#ffd8c2" : "#fff";
      svg += '<rect x="' + (L + i * w) + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"/>';
    }
    for (let i = 1; i < n; i++) {
      const katta = i % k === 0;
      svg += '<line x1="' + (L + i * w) + '" y1="' + y + '" x2="' + (L + i * w) + '" y2="' + (y + h) + '" stroke="' + (katta ? "#1f2433" : "#9aa3b5") + '" stroke-width="' + (katta ? 1.8 : 1.4) + '"' + (katta ? "" : ' stroke-dasharray="5 4"') + "/>";
    }
    svg += '<rect x="' + L + '" y="' + y + '" width="' + W + '" height="' + h + '" fill="none" stroke="#1f2433" stroke-width="2.2"/>';
    const qavs = function (x1, x2, yy, past, matn, rang) {
      const s = past ? 1 : -1;
      return '<path d="M' + (x1 + 2) + " " + yy + " v" + 6 * s + " H" + (x2 - 2) + " v" + -6 * s + '" fill="none" stroke="' + rang + '" stroke-width="2"/>' +
        '<text x="' + (x1 + x2) / 2 + '" y="' + (yy + (past ? 26 : -12)) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + rang + '">' + matn + "</text>";
    };
    const xs = L + sariq * w, xb = xs + belgi * w;
    svg += '<text x="' + (L + xs) / 2 + '" y="' + (y - 10) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#b45309">' + yoz[0] + "</text>";
    svg += qavs(xs, L + W, y - 4, false, yoz[1], "#1f2433");
    svg += qavs(xs, xb, y + h + 4, true, yoz[2], "#d4501b");
    el.classList.add("qolgan");
    el.innerHTML = '<svg viewBox="0 0 ' + (W + 8) + " " + (y + h + 38) + '" style="max-width:' + (W + 8) + 'px" role="img" aria-label="Tasmaning ' + a + "/" + b +
      " qismi bo'yalgan, qolgan qismning " + c + "/" + d + ' qismi belgilangan">' + svg + "</svg>";
  }

  window.MaruzaChizma = {
    bolish: bolish,
    chiz: function (root) {
      root = root || document;
      root.querySelectorAll("[data-ld]").forEach(chizLd);
      root.querySelectorAll("[data-xk]").forEach(chizXk);
      root.querySelectorAll("[data-kataklar]").forEach(chizKataklar);
      root.querySelectorAll("[data-sonoqi]").forEach(chizSonoqi);
      root.querySelectorAll("[data-xona]").forEach(chizXona);
      root.querySelectorAll("[data-tugma]").forEach(chizTugma);
      root.querySelectorAll("[data-oq]").forEach(chizOq);
      root.querySelectorAll("[data-siljish]").forEach(chizSiljish);
      root.querySelectorAll("[data-zanjir]").forEach(chizZanjir);
      root.querySelectorAll("[data-nollar]").forEach(chizNollar);
      root.querySelectorAll("[data-tartib]").forEach(chizTartib);
      root.querySelectorAll("[data-tasma]").forEach(chizTasma);
      root.querySelectorAll("[data-pitsa]").forEach(chizPitsa);
      root.querySelectorAll("[data-doira]").forEach(chizDoira);
      root.querySelectorAll("[data-qism]").forEach(chizQism);
      root.querySelectorAll("[data-yuza]").forEach(chizYuza);
      root.querySelectorAll("[data-qolgan]").forEach(chizQolgan);
    }
  };
})();
