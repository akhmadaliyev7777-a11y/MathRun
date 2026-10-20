/* Ma'ruza chizmalari — sahifadagi data-* atributlardan SVG/HTML yasaydi.
   Hammasi KaTeX'dan OLDIN ishlaydi (formulalar \( \) ichida qoldiriladi).

   data-ld="a/b" [data-x="3"]     — burchak usulida bo'lish a : b, verguldan keyin ko'pi bilan x xona
   data-xk="a/b/c/d/k"             — a/b = c/d, surat va maxraj k ga ko'paytiriladi (strelkali sxema)
   data-kataklar="n" [data-jami]   — 10×10 (yoki 10×jami/10) katak, n tasi bo'yalgan; [data-ustun="6"] — bir qatordagi kataklar soni (bo'lmasa 10)
   data-sonoqi="bo'lak/nuqta" [data-yozuv="0,6"] — 0 dan 1 gacha son o'qi, bo'lak ga bo'lingan, nuqta-chi bo'lakda belgi
   data-xona="3594627" [data-bosh="1"]  — xona jadvali (sinflar bilan); bosh="1" — raqamlarsiz bo'sh jadval
   data-tugma="3594627"            — sonli tugmalar: har xonada raqamcha tugma (1 000 000, 100 000, ...)
   data-siljish="324/x100" yoki "41300/:100" — xona jadvalida raqamlarning surilishi (bir xil raqam — bir xil rang)
   data-oq="0/1000000/100000" [data-nuqta="A:300000,B:750000"] [data-har="2"] — katta sonlar uchun son o'qi
   data-zanjir="43/x2/x10" yoki "540/:10/:6" yoki "2,3/x2/x10" — amallar zanjiri (o'nli kasr ham mumkin, vergul bilan): son →(×2)→ 86 →(×10)→ 860
   data-ikki="km/m/1000/0/4/0.5" [data-nuqta="A:1500,B:3000"] — ikki shkalali son o'qi: yuqorida katta birlik (km), pastda kichik (m); 1 katta = 1000 kichik;
                                          0 dan 4 gacha, har 0,5 da belgi; nuqtalar kichik birlikda beriladi (faqat harf, qiymati yozilmaydi — o'quvchi topadi)
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
   data-geo='{...}'                — geometrik chizma (JSON, koordinatalar katak birligida, y yuqoriga):
       "katak":[eni,bo'yi]  — katakli fon (o'lchami); "nuqta":{"A":[x,y],...} — uchlar (nomi yoziladi);
       "shakl":["ABC",...]  — ko'pburchaklar (bo'yalgan); "asos":"BC" — qizil qalin tomon;
       "bal":["A","BC","D"] — A dan BC ga (yoki davomiga) perpendikulyar, D — asosi (avtomatik topiladi,
                              davomi bo'lsa punktir bilan uzaytiriladi, to'g'ri burchak belgisi qo'yiladi);
       "kesma":[["P","Q"],...] — qo'shimcha punktir kesmalar; "tik":["C",...] — shakldagi to'g'ri burchak belgisi;
       "uzun":{"AB":"6 cm",...} — tomon yonidagi yozuv ("MH-" — yozuv kesmaning narigi tomonida); "yozuv":{"BC":"asos",...} — tomon yonidagi rangli yozuv
       "ramka":["ABCD",...] — punktir ramka (bo'yalmagan), masalan uchburchakka mos to'g'ri to'rtburchak
       "oq":["DEC",...] — oq (bo'yalmagan) ko'pburchak — bo'yalgan shakldan kesib olingan qism
   data-kub="3x2x2" yoki "2,1,1|3,2,0" — birlik kubchalardan jism (izometrik): "bo'yi x eni x balandligi" — kuboid;
                                          yoki ustdan qaraganda har ustundagi kubchalar soni (qatorlar "|" bilan, orqadan oldinga)
       [data-yozuv="bo'yi|eni|balandligi"] — kuboid qirralari yonida yozuv (bo'sh qoldirilsa — yozilmaydi)
       [data-rang="ko'k"] (yashil, ko'k, sariq, binafsha, qizil) [data-qatlam="1"] — har qatlam o'z rangida
       [data-ajrat="1"] — qatlamlar bir-biridan ajratib ko'rsatiladi; [data-son="1"] — yonida ustdan ko'rinish va ustundagi sonlar
       [data-olcham="26"] — kubcha qirrasi (px)
   data-korinish="2,1|1,1" [data-qaysi="yuqori,old,yon"] [data-olcham="24"] [data-yorliq="1"] — jismning ko'rinishlari kvadratli panjarada
                                          (jism data-kub dagidek yoziladi: qatorlar orqadan oldinga, ustundagi kubchalar soni);
                                          yuqoridan — old tomon pastda; olddan — chapdan o'ngga bo'yi bo'yicha;
                                          yondan — chapda old qism, o'ngda orqa qism; yorliq="1" — yuqoridan ko'rinishda old/yon tomon belgilanadi
       data-kub ga qo'shimcha: [data-strelka="1"] — yuqoridan / olddan / yondan qarash strelkalari
   data-ustunli="Qizil:50|Yashil:30|Ko'k:?" [data-qadam="10"] [data-yozuv="Tugmalar soni"] — ustunli diagramma: har ustun o'z rangida;
                                          qiymat "?" bo'lsa — ustun chizilmaydi (punktir ramka va savol belgisi)
   data-qismlar="X:0,0,3,6|Y:3,5,6,6|Z:3,0,6,5" [data-olcham="26"] [data-uzun="6 cm"] — to'g'ri to'rtburchak (kvadrat) qismlarga bo'lingan:
                                          har qism "nomi:x1,y1,x2,y2" (katak birligida, y yuqoriga), har biri o'z rangida; uzun — pastki tomon yozuvi
   data-onli="5,8/x1000" yoki "3,7/:10" yoki "0,134" — o'nli xona jadvali: vergul ustuni bilan; amal berilsa, son va natija ikki qatorda
                                          (bir xil raqam — bir xil rang, qo'shilgan nollar kulrang), vergul siljishi yozib qo'yiladi; amalsiz — bitta qator
   data-panjara="4x3x2"            — uch o'lchamli (izometrik) nuqtali panjarada chizilgan kuboid: "bo'yi x eni x balandligi";
                                          faqat ko'rinadigan 9 qirra chiziladi: bo'yi — to'q sariq, eni — ko'k, balandligi — binafsha
       [data-bosqich="1..4"] — chizish bosqichlari: 1 old tik qirra, 2 uning pastidan ikki qiya qirra, 3 ikki chetki tik qirra, 4 tepa yoq;
                               oxirgi bosqich qalin chiziladi
       [data-yozuv="bo'yi|eni|balandligi"] — qirralar yonida yozuv; [data-yashirin="1"] — ko'rinmaydigan 3 qirra punktir;
       [data-bolak="1"] — yoqlar birlik kvadratlarga bo'linadi; [data-olcham="22"] — 1 birlik (px)
   data-idish="40x25x30" [data-suv="18"] — kuboid shaklidagi shisha idish (bo'yi x eni x balandligi), ichida suv sathi
                                          (o'sha birlikda; bo'lmasa — bo'sh idish); o'lchamlar taxminan nisbatda chiziladi
       [data-yozuv="40 cm|25 cm|30 cm|18 cm|12 cm"] — bo'yi | eni | balandligi | suv sathi | bo'sh qism (bo'sh — yozilmaydi)
   data-menzurka="600/1000"        — o'lchov idishi (menzurka): shkala 0 dan 1000 ml gacha, ichida 600 ml suyuqlik
   data-buyum="Doiralar:doira:ko'k:6|Kvadratlar:kvadrat:sariq:4" [data-guruh="2"] [data-olcham="24"] — buyumlar qatori (nisbat uchun):
                                          har qator "nomi:shakli:rangi:soni" (shakl: doira, kvadrat, uchburchak, romb, yulduz;
                                          rang: ko'k, qizil, yashil, sariq, binafsha, to'q sariq; nomi bo'sh bo'lsa — yozilmaydi);
                                          guruh="2" — har qatordagi buyumlar 2 tadan punktir ramkali guruhlarga ajratiladi
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
    const u = Number(el.dataset.ustun || 10), qatorlar = Math.ceil(jami / u), s = 22, g = 2;
    const W = u * s + 2 * g, H = qatorlar * s + 2 * g;
    let h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="' + jami + " ta katakdan " + n + ' tasi bo\'yalgan">';
    for (let i = 0; i < jami; i++) {
      const x = g + (i % u) * s, y = g + Math.floor(i / u) * s;
      h += '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" fill="' + (i < n ? "#12805c" : "#fff") + '" fill-opacity="' + (i < n ? 0.75 : 1) + '" stroke="#9aa3b5" stroke-width="1"/>';
    }
    h += '<rect x="' + g + '" y="' + g + '" width="' + u * s + '" height="' + qatorlar * s + '" fill="none" stroke="#1f2433" stroke-width="2"/></svg>';
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

  // ---------- ikki shkalali son o'qi: yuqorida katta birlik, pastda kichik birlik ----------
  function chizIkki(el) {
    const [yu, pa, kS, aS, bS, stS] = el.dataset.ikki.split("/");
    const k = Number(kS), a = Number(aS), b = Number(bS), st = Number(stS);
    const nuqtalar = (el.dataset.nuqta || "").split(",").filter(Boolean).map(function (t) { const q = t.split(":"); return { h: q[0], v: Number(q[1]) }; });
    const W = 470, x0 = 46, x1 = 424, y = 62;
    const kx = function (v) { return x0 + (v - a) / (b - a) * (x1 - x0); };
    let h = '<svg viewBox="0 0 ' + W + ' 118" width="' + W + '" role="img" aria-label="Ikki shkalali son o\'qi: ' + yu + " va " + pa + '">';
    h += '<line x1="' + (x0 - 14) + '" y1="' + y + '" x2="' + (x1 + 22) + '" y2="' + y + '" stroke="#1f2433" stroke-width="2"/>';
    h += '<path d="M' + (x1 + 22) + " " + (y - 5) + " L" + (x1 + 31) + " " + y + " L" + (x1 + 22) + " " + (y + 5) + ' Z" fill="#1f2433"/>';
    h += '<text x="6" y="' + (y - 20) + '" font-size="14" font-weight="800" fill="#1f5fd6">' + yu + "</text>";
    h += '<text x="6" y="' + (y + 32) + '" font-size="14" font-weight="800" fill="#d4501b">' + pa + "</text>";
    for (let v = a; v <= b + 1e-9; v += st) {
      const x = kx(v);
      h += '<line x1="' + x + '" y1="' + (y - 8) + '" x2="' + x + '" y2="' + (y + 8) + '" stroke="#1f2433" stroke-width="1.6"/>';
      h += '<text x="' + x + '" y="' + (y - 16) + '" text-anchor="middle" font-size="14" fill="#1f5fd6">' + onliSon(v) + "</text>";
      h += '<text x="' + x + '" y="' + (y + 30) + '" text-anchor="middle" font-size="14" fill="#d4501b">' + onliSon(v * k) + "</text>";
    }
    nuqtalar.forEach(function (p) {
      const x = kx(p.v / k);
      h += '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="#16a394"/>';
      h += '<text x="' + x + '" y="' + (y + 52) + '" text-anchor="middle" font-size="21" font-weight="800" fill="#0e7a6f">' + p.h + "</text>";
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
  function onliSon(x) {   // o'nli kasr: vergul bilan, butun qismi guruhlangan (1 234,5)
    const t = String(Math.round(x * 1e9) / 1e9).split(".");
    return t[1] ? guruh(t[0]) + "," + t[1] : guruh(t[0]);
  }
  function chizZanjir(el) {
    const q = el.dataset.zanjir.split("/");
    const son = function (t) { return Number(String(t).replace(",", ".")); };
    let v = son(q[0]);
    let h = '<span class="z-son z-bosh">' + onliSon(v) + "</span>";
    const izoh = [];
    for (let i = 1; i < q.length; i++) {
      const kop = q[i][0] === "x", k = son(q[i].slice(1));
      const oldin = v;
      v = kop ? v * k : v / k;
      izoh.push(onliSon(oldin) + (kop ? " × " : " : ") + onliSon(k) + " = " + onliSon(v));
      h += '<span class="z-qadam"><span class="pill">' + (kop ? "× " : ": ") + onliSon(k) + "</span>" + strelka() + "</span>" +
        '<span class="z-son' + (i === q.length - 1 ? " z-oxir" : "") + '">' + onliSon(v) + "</span>";
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

  // ---------- ustunli diagramma ----------
  function chizUstunli(el) {
    const q = el.dataset.ustunli.split("|").map(function (t) { const p = t.split(":"); return { nom: p[0], v: p[1] === "?" ? null : Number(p[1]) }; });
    const qadam = Number(el.dataset.qadam) || 10;
    const maxV = Math.max.apply(null, q.map(function (x) { return x.v || 0; }));
    const top = Math.ceil((maxV + 1) / qadam) * qadam;
    const W = 380, L = 54, R = 12, T = 16, B = 34, H = 220;
    const iH = H - T - B, iW = W - L - R, bw = iW / q.length * 0.5, g = iW / q.length;
    const Y = function (v) { return T + iH - v / top * iH; };
    let svg = "";
    for (let v = 0; v <= top; v += qadam) {
      svg += '<line x1="' + L + '" y1="' + Y(v) + '" x2="' + (W - R) + '" y2="' + Y(v) + '" stroke="#d5d9e4" stroke-width="1"/>' +
        '<text x="' + (L - 6) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="13" fill="#5b6275">' + v + "</text>";
    }
    svg += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + Y(0) + '" stroke="#1f2433" stroke-width="2"/>' +
      '<line x1="' + L + '" y1="' + Y(0) + '" x2="' + (W - R) + '" y2="' + Y(0) + '" stroke="#1f2433" stroke-width="2"/>';
    q.forEach(function (x, i) {
      const c = TASMA_RANG[i % TASMA_RANG.length], cx = L + g * i + g / 2;
      if (x.v === null) {
        svg += '<rect x="' + (cx - bw / 2) + '" y="' + Y(top * 0.55) + '" width="' + bw + '" height="' + (Y(0) - Y(top * 0.55)) + '" fill="none" stroke="' + c[1] + '" stroke-width="2" stroke-dasharray="5 4" rx="3"/>' +
          '<text x="' + cx + '" y="' + (Y(top * 0.275) + 8) + '" text-anchor="middle" font-size="24" font-weight="800" fill="' + c[1] + '">?</text>';
      } else {
        svg += '<rect x="' + (cx - bw / 2) + '" y="' + Y(x.v) + '" width="' + bw + '" height="' + (Y(0) - Y(x.v)) + '" fill="' + c[1] + '" fill-opacity=".85" rx="3"/>';
      }
      svg += '<text x="' + cx + '" y="' + (Y(0) + 20) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#1f2433">' + x.nom + "</text>";
    });
    if (el.dataset.yozuv) svg += '<text x="14" y="' + (T + iH / 2) + '" text-anchor="middle" font-size="12" fill="#5b6275" transform="rotate(-90 14 ' + (T + iH / 2) + ')">' + el.dataset.yozuv + "</text>";
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Ustunli diagramma: ' +
      q.map(function (x) { return x.nom + " — " + (x.v === null ? "noma'lum" : x.v); }).join(", ") + '">' + svg + "</svg>";
  }

  // ---------- qismlarga bo'lingan to'g'ri to'rtburchak ----------
  function chizQismlar(el) {
    const q = el.dataset.qismlar.split("|").map(function (t) { const i = t.indexOf(":"); const c = t.slice(i + 1).split(",").map(Number); return { nom: t.slice(0, i), x1: c[0], y1: c[1], x2: c[2], y2: c[3] }; });
    const u = Number(el.dataset.olcham) || 26;
    const w = Math.max.apply(null, q.map(function (r) { return r.x2; })), h = Math.max.apply(null, q.map(function (r) { return r.y2; }));
    const M = 14, W = w * u + 2 * M, H = h * u + 2 * M + (el.dataset.uzun ? 22 : 0);
    let svg = "";
    q.forEach(function (r, i) {
      const c = TASMA_RANG[i % TASMA_RANG.length];
      svg += '<rect x="' + (M + r.x1 * u) + '" y="' + (M + (h - r.y2) * u) + '" width="' + ((r.x2 - r.x1) * u) + '" height="' + ((r.y2 - r.y1) * u) + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2.5"/>' +
        '<text x="' + (M + (r.x1 + r.x2) / 2 * u) + '" y="' + (M + (h - (r.y1 + r.y2) / 2) * u + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + c[1] + '">' + r.nom + "</text>";
    });
    svg += '<rect x="' + M + '" y="' + M + '" width="' + (w * u) + '" height="' + (h * u) + '" fill="none" stroke="#1f2433" stroke-width="3"/>';
    if (el.dataset.uzun) svg += '<text x="' + (M + w * u / 2) + '" y="' + (M + h * u + 18) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#1f2433">' + el.dataset.uzun + "</text>";
    el.classList.add("tasma");
    el.style.maxWidth = W + "px";
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Qismlarga bo\'lingan shakl: ' + q.map(function (r) { return r.nom; }).join(", ") + '">' + svg + "</svg>";
  }

  // ---------- o'nli kasr: xona jadvali va vergul siljishi ----------
  const ONLI_INT = ["B", "O'", "Y", "M", "O'M", "YM"];
  const ONLI_KASR = ["0,1", "0,01", "0,001", "0,0001", "0,00001"];
  function onliTahlil(str) {
    const p = str.split(",");
    const butun = p[0], kasr = p[1] || "";
    const d = (butun + kasr).split("").map(function (c, i) { return { d: c, t: i }; });
    return { d: d, nuqta: butun.length };
  }
  // natijani raqamlar ro'yxati ko'rinishida topadi: qo'shilgan nollar t = -1
  function onliSur(a, k, kop) {
    const d = a.d.slice();
    let n = a.nuqta + (kop ? k : -k);
    if (n > d.length) { while (d.length < n) d.push({ d: "0", t: -1 }); }
    if (n <= 0) { while (n < 0) { d.unshift({ d: "0", t: -1 }); n++; } d.unshift({ d: "0", t: -1 }); n = 1; }
    while (n > 1 && d[0].d === "0") { d.shift(); n--; }
    while (d.length > n && d[d.length - 1].d === "0") d.pop();
    return { d: d, nuqta: n };
  }
  function chizOnli(el) {
    const bol = el.dataset.onli.split("/");
    const a = onliTahlil(bol[0]);
    const amal = bol[1];
    const kop = amal ? amal[0] === "x" : true, k = amal ? String(amal.slice(1)).length - 1 : 0;
    const b = amal ? onliSur(a, k, kop) : null;
    const satr = function (x) { return x.d.map(function (e) { return e.d; }).slice(0, x.nuqta).join("") + (x.d.length > x.nuqta ? "," + x.d.slice(x.nuqta).map(function (e) { return e.d; }).join("") : ""); };
    const top = Math.max(a.nuqta, b ? b.nuqta : 0) - 1;
    const past = -Math.max(a.d.length - a.nuqta, b ? b.d.length - b.nuqta : 0, 1);
    const hujayra = function (x, q) {
      const idx = x.nuqta - 1 - q;                 // q — xona raqami: 0 — birlar, -1 — o'ndan birlar
      if (idx < 0 || idx >= x.d.length) return '<td class="bosh"></td>';
      const e = x.d[idx];
      const rang = e.t < 0 ? "#9aa3b5" : SIL_RANG[e.t % SIL_RANG.length];
      return '<td style="color:' + rang + '">' + e.d + "</td>";
    };
    const qator = function (x, nom) {
      let h = "<tr><th>" + nom + "</th>";
      for (let q = top; q >= past; q--) {
        h += hujayra(x, q);
        if (q === 0) h += '<td class="vg">' + (x.d.length > x.nuqta ? "," : "") + "</td>";
      }
      return h + "</tr>";
    };
    let bosh = "<tr><th></th>";
    for (let q = top; q >= past; q--) {
      bosh += "<th>" + (q >= 0 ? ONLI_INT[q] || "" : ONLI_KASR[-q - 1]) + "</th>";
      if (q === 0) bosh += '<th class="vg"></th>';
    }
    bosh += "</tr>";
    const cols = top - past + 3;
    let html = '<table class="jad">' + bosh + qator(a, b ? "son" : "");
    if (b) {
      const belgi = (kop ? "× " : ": ") + guruh(Math.pow(10, k));
      html += '<tr class="sil-amal"><td colspan="' + cols + '">' + belgi + (kop ? " — vergul " + k + " xona o'ngga ⟶" : " — vergul " + k + " xona chapga ⟵") + "</td></tr>" + qator(b, "natija");
    }
    el.classList.add("siljish", "onli");
    el.innerHTML = html + "</table>" + (b ? '<p class="chz-cap">' + satr(a) + " " + (kop ? "×" : ":") + " " + guruh(Math.pow(10, k)) + " = " + satr(b) + "</p>" : "");
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

  // ---------- geometrik chizma: uchburchak, asos, balandlik, katakli fon ----------
  function chizGeo(el) {
    let g;
    try { g = JSON.parse(el.dataset.geo); } catch (e) { return; }
    const s = Number(g.olcham || 30), pad = g.uzun ? 44 : 26;   // tomon yozuvlari uchun chetda joy
    const pts = g.nuqta || {};
    const nom = Object.keys(pts);
    // bo'lish uchun chegaralar
    let xs = nom.map(function (k) { return pts[k][0]; }), ys = nom.map(function (k) { return pts[k][1]; });
    const balAsos = [];
    (g.bal ? (Array.isArray(g.bal[0]) ? g.bal : [g.bal]) : []).forEach(function (b) {
      const A = pts[b[0]], P = pts[b[1][0]], Q = pts[b[1][1]];
      const dx = Q[0] - P[0], dy = Q[1] - P[1], t = ((A[0] - P[0]) * dx + (A[1] - P[1]) * dy) / (dx * dx + dy * dy);
      const D = [P[0] + t * dx, P[1] + t * dy];
      balAsos.push({ A: A, P: P, Q: Q, D: D, t: t, nom: b[2] || "" });
      if (b[2]) pts[b[2]] = D;
      xs.push(D[0]); ys.push(D[1]);
    });
    const kw = g.katak ? g.katak[0] : Math.max.apply(null, xs), kh = g.katak ? g.katak[1] : Math.max.apply(null, ys);
    const minx = g.katak ? 0 : Math.min.apply(null, xs), miny = g.katak ? 0 : Math.min.apply(null, ys);
    const W = (kw - minx) * s + 2 * pad, H = (kh - miny) * s + 2 * pad;
    const X = function (p) { return pad + (p[0] - minx) * s; }, Y = function (p) { return pad + (kh - p[1]) * s; };
    const xy = function (p) { return X(p).toFixed(1) + " " + Y(p).toFixed(1); };
    let svg = "";
    if (g.katak) {
      for (let i = 0; i <= kw; i++) svg += '<line x1="' + (pad + i * s) + '" y1="' + pad + '" x2="' + (pad + i * s) + '" y2="' + (pad + kh * s) + '" stroke="#d9dde8" stroke-width="1"/>';
      for (let j = 0; j <= kh; j++) svg += '<line x1="' + pad + '" y1="' + (pad + j * s) + '" x2="' + (pad + kw * s) + '" y2="' + (pad + j * s) + '" stroke="#d9dde8" stroke-width="1"/>';
    }
    const RANG = ["#e3f5ec", "#eef0fc", "#fff4e5", "#f3eefc"];
    (g.shakl || []).forEach(function (sh, i) {
      svg += '<path d="M' + sh.split("").map(function (k) { return xy(pts[k]); }).join(" L") + ' Z" fill="' + RANG[i % RANG.length] + '" fill-opacity=".9" stroke="#12805c" stroke-width="2.4" stroke-linejoin="round"/>';
    });
    (g.oq || []).forEach(function (sh) {
      svg += '<path d="M' + sh.split("").map(function (k) { return xy(pts[k]); }).join(" L") + ' Z" fill="#fff" stroke="#12805c" stroke-width="2" stroke-linejoin="round"/>';
    });
    (g.ramka || []).forEach(function (sh) {
      svg += '<path d="M' + sh.split("").map(function (k) { return xy(pts[k]); }).join(" L") + ' Z" fill="none" stroke="#6d3fc0" stroke-width="2" stroke-dasharray="7 5"/>';
    });
    // to'g'ri burchak belgisi: P nuqtada, u va v yo'nalishlar bo'yicha (piksel fazosida)
    const birlik = function (a, b) { const dx = X(b) - X(a), dy = Y(b) - Y(a), l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    const burchak = function (P, U, V, rang) {
      const u = birlik(P, U), v = birlik(P, V), r = 10, x = X(P), y = Y(P);
      return '<path d="M' + (x + u[0] * r) + " " + (y + u[1] * r) + " L" + (x + u[0] * r + v[0] * r) + " " + (y + u[1] * r + v[1] * r) + " L" + (x + v[0] * r) + " " + (y + v[1] * r) + '" fill="none" stroke="' + rang + '" stroke-width="1.8"/>';
    };
    (g.tik || []).forEach(function (k) {
      // shakldagi qo'shni uchlar
      const sh = (g.shakl || []).find(function (q) { return q.indexOf(k) >= 0; });
      if (!sh) return;
      const i = sh.indexOf(k), a = sh[(i + sh.length - 1) % sh.length], b = sh[(i + 1) % sh.length];
      svg += burchak(pts[k], pts[a], pts[b], "#1f2433");
    });
    (g.kesma || []).forEach(function (k) {
      svg += '<line x1="' + X(pts[k[0]]) + '" y1="' + Y(pts[k[0]]) + '" x2="' + X(pts[k[1]]) + '" y2="' + Y(pts[k[1]]) + '" stroke="#5f6676" stroke-width="2" stroke-dasharray="6 5"/>';
      if (k[2] === "tik") svg += burchak(pts[k[1]], pts[k[0]], pts[k[3]], "#5f6676");
    });
    if (g.asos) {
      const a = pts[g.asos[0]], b = pts[g.asos[1]];
      svg += '<line x1="' + X(a) + '" y1="' + Y(a) + '" x2="' + X(b) + '" y2="' + Y(b) + '" stroke="#d4501b" stroke-width="4.5" stroke-linecap="round"/>';
    }
    balAsos.forEach(function (b) {
      if (b.t < -1e-9 || b.t > 1 + 1e-9) {
        const yaqin = b.t < 0 ? b.P : b.Q;
        svg += '<line x1="' + X(yaqin) + '" y1="' + Y(yaqin) + '" x2="' + X(b.D) + '" y2="' + Y(b.D) + '" stroke="#9aa3b5" stroke-width="2" stroke-dasharray="4 4"/>';
      }
      const tomon = Math.abs(b.t) < 1e-9 ? b.Q : b.P;   // asosni bo'ylab yo'nalish
      svg += '<line x1="' + X(b.A) + '" y1="' + Y(b.A) + '" x2="' + X(b.D) + '" y2="' + Y(b.D) + '" stroke="#1f5fd6" stroke-width="2.6" stroke-dasharray="7 5"/>';
      svg += burchak(b.D, tomon === b.D ? b.Q : tomon, b.A, "#1f5fd6");
    });
    // tomon yonidagi yozuvlar (shakl markazidan tashqariga)
    const markaz = (function () { const k = nom.length ? nom : []; let sx = 0, sy = 0; k.forEach(function (q) { sx += X(pts[q]); sy += Y(pts[q]); }); return [sx / (k.length || 1), sy / (k.length || 1)]; })();
    const tomonYoz = function (ab, matn, rang, ichkari, ulush) {
      const a = pts[ab[0]], b = pts[ab[1]], u = ulush || 0.5;   // ulush — yozuv tomonning qayerida turishi
      const mx = X(a) + (X(b) - X(a)) * u, my = Y(a) + (Y(b) - Y(a)) * u;
      let nx = -(Y(b) - Y(a)), ny = X(b) - X(a); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      // tomon shaklning qo'shni uchlari bo'lsa — tashqi tomonni shakl aylanish yo'nalishidan topamiz (botiq shaklda ham to'g'ri)
      const sh = (g.shakl || []).find(function (q) { const i = q.indexOf(ab[0]), j = q.indexOf(ab[1]); return i >= 0 && j >= 0 && (Math.abs(i - j) === 1 || Math.abs(i - j) === q.length - 1); });
      if (sh) {
        let yuz = 0;
        for (let i = 0; i < sh.length; i++) { const p = pts[sh[i]], q = pts[sh[(i + 1) % sh.length]]; yuz += X(p) * Y(q) - X(q) * Y(p); }
        const oldinga = sh[(sh.indexOf(ab[0]) + 1) % sh.length] === ab[1];   // ab shakl aylanishi bo'yicha yo'nalganmi
        const tash = (yuz > 0 ? -1 : 1) * (oldinga ? 1 : -1);
        nx *= tash; ny *= tash;
      } else if ((mx - markaz[0]) * nx + (my - markaz[1]) * ny < 0) { nx = -nx; ny = -ny; }
      if (ichkari) { nx = -nx; ny = -ny; }
      const off = 12 + Math.abs(nx) * matn.length * 3.8;   // tik tomonda yozuv kengligi hisobga olinadi
      return '<text x="' + (mx + nx * off).toFixed(1) + '" y="' + (my + ny * 13 + 5).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="' + rang + '">' + matn + "</text>";
    };
    Object.keys(g.uzun || {}).forEach(function (k) { svg += tomonYoz(k.replace("-", ""), g.uzun[k], "#1f2433", k.slice(-1) === "-"); });
    // «asos» yozuvi tomonning chetrog'ida — o'rtasiga tushgan balandlik belgisi bilan ustma-ust tushmasin
    Object.keys(g.yozuv || {}).forEach(function (k) { svg += tomonYoz(k, g.yozuv[k], k === g.asos ? "#d4501b" : "#1f5fd6", true, 0.78); });
    // uch nomlari
    Object.keys(pts).forEach(function (k) {
      if (g.yashir && g.yashir.indexOf(k) >= 0) return;
      const x = X(pts[k]), y = Y(pts[k]);
      let dx = x - markaz[0], dy = y - markaz[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      svg += '<text x="' + (x + dx * 14).toFixed(1) + '" y="' + (y + dy * 14 + 6).toFixed(1) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433">' + k + "</text>";
    });
    el.classList.add("geo");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" style="max-width:' + W + 'px" role="img" aria-label="' + (el.dataset.izoh || "Geometrik chizma") + '">' + svg + "</svg>";
  }

  // ---------- birlik kubchalardan jism (izometrik chizma) ----------
  const KUB_RANG = {
    "yashil": ["#c9f1e1", "#86d6b9", "#55b996", "#1d6b52"],
    "ko'k": ["#d3e3ff", "#93b6f2", "#6390e0", "#1f4fa8"],
    "sariq": ["#ffe9c2", "#ffc874", "#f0a33c", "#9a5a0c"],
    "binafsha": ["#e7dcfb", "#bfa5ef", "#9a78dc", "#4f2f94"],
    "qizil": ["#ffd9d2", "#f6a495", "#e6735f", "#9b2c1a"]
  };
  function chizKub(el) {
    const v = el.dataset.kub.trim();
    let xarita;                                   // xarita[qator][ustun] — ustundagi kubchalar soni, 0-qator eng orqada
    if (/^\d+x\d+x\d+$/.test(v)) {
      const o = v.split("x").map(Number);
      xarita = [];
      for (let j = 0; j < o[1]; j++) { const q = []; for (let i = 0; i < o[0]; i++) q.push(o[2]); xarita.push(q); }
    } else xarita = v.split("|").map(function (q) { return q.split(",").map(Number); });
    const s = Number(el.dataset.olcham || 26), c = 0.866;
    const ajrat = el.dataset.ajrat === "1" ? 0.7 : 0;
    const qatlam = el.dataset.qatlam === "1" || ajrat > 0;
    const rangNom = Object.keys(KUB_RANG), asosRang = KUB_RANG[el.dataset.rang] ? el.dataset.rang : "yashil";
    const kublar = [];
    let X = 0, Y = xarita.length, Z = 0;
    xarita.forEach(function (q, j) {
      q.forEach(function (h, i) { for (let k = 0; k < h; k++) kublar.push([i, j, k]); if (h > 0) X = Math.max(X, i + 1); Z = Math.max(Z, h); });
    });
    // ekran koordinatasi: x — o'ngga-pastga, y (orqadan oldinga) — chapga-pastga, z — tepaga
    // ajratilgan qatlamda kubcha (k) ning hamma uchlari bir xil siljiydi
    const Pk = function (x, y, z, k) { return [(x - y) * c * s, (x + y) * 0.5 * s - z * s - k * ajrat * s]; };
    kublar.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]; });
    const bor = {};
    kublar.forEach(function (k) { bor[k.join(",")] = 1; });
    const tola = [];
    let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
    const yuz = function (nuqtalar, k, rang) {
      const pp = nuqtalar.map(function (n) { return Pk(n[0], n[1], n[2], k); });
      pp.forEach(function (p) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
      tola.push('<path d="M' + pp.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + ' Z" fill="' + rang + '"/>');
    };
    kublar.forEach(function (kb) {
      const i = kb[0], j = kb[1], k = kb[2];
      const r = KUB_RANG[qatlam ? rangNom[k % rangNom.length] : asosRang];
      const usti = !ajrat && bor[[i, j, k + 1].join(",")];
      const start = tola.length;
      if (!usti) yuz([[i, j, k + 1], [i + 1, j, k + 1], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], k, r[0]);
      yuz([[i, j + 1, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], k, r[1]);   // chap (old) yoq
      yuz([[i + 1, j, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i + 1, j, k + 1]], k, r[2]);   // o'ng yoq
      for (let t = start; t < tola.length; t++) tola[t] = tola[t].replace("/>", ' stroke="' + r[3] + '" stroke-width="1.3" stroke-linejoin="round"/>');
    });
    let svg = tola.join("");
    // kuboid qirralari yonidagi yozuvlar
    const yoz = (el.dataset.yozuv || "").split("|");
    const matn = function (x, y, t, anchor, rang) {
      minx = Math.min(minx, anchor === "end" ? x - t.length * 8 : anchor === "start" ? x : x - t.length * 4);
      maxx = Math.max(maxx, anchor === "start" ? x + t.length * 8 : anchor === "end" ? x : x + t.length * 4);
      miny = Math.min(miny, y - 14); maxy = Math.max(maxy, y + 4);
      return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="15" font-weight="800" fill="' + rang + '">' + t + "</text>";
    };
    if (yoz[0]) { const a = Pk(0, Y, 0, 0), b = Pk(X, Y, 0, 0); svg += matn((a[0] + b[0]) / 2 - 10, (a[1] + b[1]) / 2 + 22, yoz[0], "end", "#d4501b"); }
    if (yoz[1]) { const a = Pk(X, 0, 0, 0), b = Pk(X, Y, 0, 0); svg += matn((a[0] + b[0]) / 2 + 10, (a[1] + b[1]) / 2 + 22, yoz[1], "start", "#1f5fd6"); }
    if (yoz[2]) { const a = Pk(0, Y, 0, 0), b = Pk(0, Y, Z, Z - 1); svg += matn(a[0] - 8, (a[1] + b[1]) / 2 + 5, yoz[2], "end", "#6d3fc0"); }
    if (el.dataset.strelka === "1") {
      const ok = function (t, q, nom, anchor, dx, dy) {
        const dxx = q[0] - t[0], dyy = q[1] - t[1], L = Math.sqrt(dxx * dxx + dyy * dyy), ux = dxx / L, uy = dyy / L;
        const bx = q[0] - ux * 9, by = q[1] - uy * 9;
        [t, q].forEach(function (z) { minx = Math.min(minx, z[0]); maxx = Math.max(maxx, z[0]); miny = Math.min(miny, z[1]); maxy = Math.max(maxy, z[1]); });
        return '<line x1="' + t[0].toFixed(1) + '" y1="' + t[1].toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="#2f6f9f" stroke-width="2.2" stroke-linecap="round"/>' +
          '<polygon points="' + q[0].toFixed(1) + "," + q[1].toFixed(1) + " " + (bx - uy * 5).toFixed(1) + "," + (by + ux * 5).toFixed(1) + " " + (bx + uy * 5).toFixed(1) + "," + (by - ux * 5).toFixed(1) + '" fill="#2f6f9f"/>' +
          matn(t[0] + dx, t[1] + dy, nom, anchor, "#2f6f9f");
      };
      const ust = Pk(X / 2, Y / 2, Z, 0), t1 = [ust[0], ust[1] - 1.7 * s], q1 = [ust[0], ust[1] - 0.45 * s];
      const o1 = Pk(X / 2, Y + 1.7, Z / 2, 0), o2 = Pk(X / 2, Y + 0.45, Z / 2, 0);
      const y1 = Pk(X + 1.7, Y / 2, Z / 2, 0), y2 = Pk(X + 0.45, Y / 2, Z / 2, 0);
      svg += ok(t1, q1, "yuqoridan", "middle", 0, -7) + ok(o1, o2, "olddan", "end", -4, 15) + ok(y1, y2, "yondan", "start", 4, 15);
      minx -= 8; maxx += 10;
    }
    const m = 6;
    let W = maxx - minx + 2 * m, H = maxy - miny + 2 * m;
    let jism = '<g transform="translate(' + (m - minx).toFixed(1) + " " + (m - miny).toFixed(1) + ')">' + svg + "</g>";
    // ustdan ko'rinish: har katakda ustundagi kubchalar soni
    if (el.dataset.son === "1") {
      const k = 24, x0 = W + 18, y0 = Math.max(m, (H - Y * k) / 2);
      let t = "";
      xarita.forEach(function (q, j) {
        q.forEach(function (h, i) {
          if (i >= X) return;
          t += '<rect x="' + (x0 + i * k) + '" y="' + (y0 + j * k) + '" width="' + k + '" height="' + k + '" fill="' + (h ? "#eef7f2" : "#fff") + '" stroke="#5f6676" stroke-width="1.2"/>';
          if (h) t += '<text x="' + (x0 + i * k + k / 2) + '" y="' + (y0 + j * k + k / 2 + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#1f2433">' + h + "</text>";
        });
      });
      t += '<text x="' + (x0 + X * k / 2) + '" y="' + (y0 + Y * k + 17) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#5f6676">ustdan</text>';
      jism += t;
      W = x0 + X * k + m; H = Math.max(H, y0 + Y * k + 24);
    }
    el.classList.add("kub");
    el.innerHTML = '<svg viewBox="0 0 ' + W.toFixed(1) + " " + H.toFixed(1) + '" style="max-width:' + Math.round(W) + 'px" role="img" aria-label="' +
      (el.dataset.izoh || kublar.length + " ta birlik kubdan yasalgan jism") + '">' + jism + "</svg>";
  }

  // ---------- uch o'lchamli (izometrik) nuqtali panjarada kuboid ----------
  function chizPanjara(el) {
    const o = el.dataset.panjara.trim().split("x").map(Number);
    const X = o[0], Y = o[1], Z = o[2];
    const s = Number(el.dataset.olcham || 22), c = 0.866;
    const bosq = Number(el.dataset.bosqich || 4);
    const P = function (x, y, z) { return [(x - y) * c * s, (x + y) * 0.5 * s - z * s]; };
    const rang = { x: "#d4501b", y: "#1f5fd6", z: "#6d3fc0" };
    const pad = Math.max(28, 1.6 * s);
    const yoz = (el.dataset.yozuv || "").split("|");
    const padL = yoz[2] ? Math.max(pad, yoz[2].length * 8.5 + 18) : pad, padR = yoz[1] ? Math.max(pad, yoz[1].length * 8.5 + 18) : pad;
    const gx0 = -Y * c * s - padL, gx1 = X * c * s + padR, gy0 = -Z * s - pad, gy1 = (X + Y) * 0.5 * s + pad;
    let svg = "";
    // nuqtali panjara: ustunlar c*s oraliqda, qo'shni ustunlar yarim qadamga siljigan
    for (let a = Math.ceil(gx0 / (c * s)); a <= Math.floor(gx1 / (c * s)); a++) {
      const x = a * c * s;
      for (let m = Math.ceil((gy0 - a * 0.5 * s) / s); m <= Math.floor((gy1 - a * 0.5 * s) / s); m++) {
        svg += '<circle cx="' + (x - gx0).toFixed(1) + '" cy="' + ((a * 0.5 + m) * s - gy0).toFixed(1) + '" r="1.7" fill="#9aa3b5"/>';
      }
    }
    const T = function (p) { const q = P(p[0], p[1], p[2]); return (q[0] - gx0).toFixed(1) + " " + (q[1] - gy0).toFixed(1); };
    const yuz = function (pts, fill) { return '<path d="M' + pts.map(T).join(" L") + ' Z" fill="' + fill + '"/>'; };
    const chiziq = function (a, b, rn, w, extra) {
      const qa = P(a[0], a[1], a[2]), qb = P(b[0], b[1], b[2]);
      return '<line x1="' + (qa[0] - gx0).toFixed(1) + '" y1="' + (qa[1] - gy0).toFixed(1) + '" x2="' + (qb[0] - gx0).toFixed(1) + '" y2="' + (qb[1] - gy0).toFixed(1) +
        '" stroke="' + rang[rn] + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || "") + "/>";
    };
    if (bosq >= 4) {
      svg += yuz([[0, 0, Z], [X, 0, Z], [X, Y, Z], [0, Y, Z]], "#f2f6fd");
      svg += yuz([[0, Y, 0], [X, Y, 0], [X, Y, Z], [0, Y, Z]], "#e0e9f9");
      svg += yuz([[X, 0, 0], [X, Y, 0], [X, Y, Z], [X, 0, Z]], "#d0ddf5");
    }
    if (el.dataset.bolak === "1" && bosq >= 4) {
      let t = "";
      const nozik = function (a, b) { const qa = P(a[0], a[1], a[2]), qb = P(b[0], b[1], b[2]); t += '<line x1="' + (qa[0] - gx0).toFixed(1) + '" y1="' + (qa[1] - gy0).toFixed(1) + '" x2="' + (qb[0] - gx0).toFixed(1) + '" y2="' + (qb[1] - gy0).toFixed(1) + '"/>'; };
      for (let i = 1; i < X; i++) { nozik([i, 0, Z], [i, Y, Z]); nozik([i, Y, 0], [i, Y, Z]); }
      for (let j = 1; j < Y; j++) { nozik([0, j, Z], [X, j, Z]); nozik([X, j, 0], [X, j, Z]); }
      for (let k = 1; k < Z; k++) { nozik([0, Y, k], [X, Y, k]); nozik([X, 0, k], [X, Y, k]); }
      svg += '<g stroke="#8aa0cf" stroke-width="1" opacity=".8">' + t + "</g>";
    }
    // qirralar: [boshi, oxiri, yo'nalish, bosqich]
    const qirralar = [
      [[X, Y, 0], [X, Y, Z], "z", 1],
      [[X, Y, 0], [0, Y, 0], "x", 2], [[X, Y, 0], [X, 0, 0], "y", 2],
      [[0, Y, 0], [0, Y, Z], "z", 3], [[X, 0, 0], [X, 0, Z], "z", 3],
      [[X, Y, Z], [0, Y, Z], "x", 4], [[X, Y, Z], [X, 0, Z], "y", 4], [[0, Y, Z], [0, 0, Z], "y", 4], [[X, 0, Z], [0, 0, Z], "x", 4]
    ];
    if (el.dataset.yashirin === "1" && bosq >= 4) {
      svg += chiziq([0, 0, 0], [0, 0, Z], "z", 2, ' stroke-dasharray="5 4" opacity=".55"');
      svg += chiziq([0, 0, 0], [X, 0, 0], "x", 2, ' stroke-dasharray="5 4" opacity=".55"');
      svg += chiziq([0, 0, 0], [0, Y, 0], "y", 2, ' stroke-dasharray="5 4" opacity=".55"');
    }
    qirralar.forEach(function (q) {
      if (q[3] > bosq) return;
      const hozir = bosq < 4 && q[3] === bosq;
      svg += chiziq(q[0], q[1], q[2], hozir ? 3.6 : 2.4, bosq < 4 && !hozir ? ' opacity=".6"' : "");
      const n = Math.abs(q[1][0] - q[0][0]) + Math.abs(q[1][1] - q[0][1]) + Math.abs(q[1][2] - q[0][2]);
      for (let t = 0; t <= n; t++) {
        const d = n ? t / n : 0;
        const pt = P(q[0][0] + (q[1][0] - q[0][0]) * d, q[0][1] + (q[1][1] - q[0][1]) * d, q[0][2] + (q[1][2] - q[0][2]) * d);
        svg += '<circle cx="' + (pt[0] - gx0).toFixed(1) + '" cy="' + (pt[1] - gy0).toFixed(1) + '" r="' + (hozir ? 3.6 : 2.8) + '" fill="' + rang[q[2]] + '"/>';
      }
    });
    const matn = function (x, y, t, anchor, rn) {
      return '<text x="' + (x - gx0).toFixed(1) + '" y="' + (y - gy0).toFixed(1) + '" text-anchor="' + anchor + '" font-size="15" font-weight="800" fill="' + rang[rn] + '">' + t + "</text>";
    };
    if (yoz[0]) { const a = P(0, Y, 0), b = P(X, Y, 0); svg += matn((a[0] + b[0]) / 2 - 10, (a[1] + b[1]) / 2 + 24, yoz[0], "end", "x"); }
    if (yoz[1]) { const a = P(X, 0, 0), b = P(X, Y, 0); svg += matn((a[0] + b[0]) / 2 + 10, (a[1] + b[1]) / 2 + 24, yoz[1], "start", "y"); }
    if (yoz[2]) { const a = P(0, Y, 0), b = P(0, Y, Z); svg += matn(a[0] - 10, (a[1] + b[1]) / 2 + 5, yoz[2], "end", "z"); }
    const W = gx1 - gx0, H = gy1 - gy0;
    el.classList.add("kub");
    el.innerHTML = '<svg viewBox="0 0 ' + W.toFixed(1) + " " + H.toFixed(1) + '" style="max-width:' + Math.round(W) + 'px" role="img" aria-label="' +
      (el.dataset.izoh || "Nuqtali panjarada chizilgan " + X + " × " + Y + " × " + Z + " kuboid") + '">' + svg + "</svg>";
  }

  // ---------- jismning yuqoridan, olddan, yondan ko'rinishlari (kvadratli panjarada) ----------
  function chizKorinish(el) {
    const xarita = el.dataset.korinish.trim().split("|").map(function (q) { return q.split(",").map(Number); });
    const Y = xarita.length;
    let X = 0, Z = 0;
    xarita.forEach(function (q) { q.forEach(function (h, i) { if (h > 0) X = Math.max(X, i + 1); Z = Math.max(Z, h); }); });
    const h = function (j, i) { return xarita[j][i] || 0; };
    const yuqori = [], old = [], yon = [];
    for (let j = 0; j < Y; j++) { const q = []; for (let i = 0; i < X; i++) q.push(h(j, i) > 0); yuqori.push(q); }
    for (let k = Z - 1; k >= 0; k--) {
      const q = [];
      for (let i = 0; i < X; i++) { let b = false; for (let j = 0; j < Y; j++) if (h(j, i) > k) b = true; q.push(b); }
      old.push(q);
      const r = [];
      for (let j = Y - 1; j >= 0; j--) { let b = false; for (let i = 0; i < X; i++) if (h(j, i) > k) b = true; r.push(b); }
      yon.push(r);
    }
    const hammasi = { yuqori: ["yuqoridan", yuqori], old: ["olddan", old], yon: ["yondan", yon] };
    const tanlov = (el.dataset.qaysi || "yuqori,old,yon").split(",").map(function (z) { return z.trim(); });
    const s = Number(el.dataset.olcham || 24), bosh = 26, oraliq = 22, m = 6;
    let x0 = m, svg = "", H = 0;
    const paneller = tanlov.map(function (n) { return hammasi[n]; }).filter(Boolean);
    paneller.forEach(function (pn, pi) {
      const g = pn[1], R = g.length, C = g[0].length, w = C * s, hh = R * s, sl = Math.max(w, 78);
      const xs = x0;
      x0 += (sl - w) / 2;
      svg += '<text x="' + (x0 + w / 2) + '" y="' + (m + 14) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#2f6f9f">' + pn[0] + "</text>";
      svg += '<rect x="' + x0 + '" y="' + (bosh + m) + '" width="' + w + '" height="' + hh + '" fill="#eef5fb" stroke="#9ec2e0" stroke-width="1.2"/>';
      for (let a = 1; a < C; a++) svg += '<line x1="' + (x0 + a * s) + '" y1="' + (bosh + m) + '" x2="' + (x0 + a * s) + '" y2="' + (bosh + m + hh) + '" stroke="#b9d3e8" stroke-width="1"/>';
      for (let b = 1; b < R; b++) svg += '<line x1="' + x0 + '" y1="' + (bosh + m + b * s) + '" x2="' + (x0 + w) + '" y2="' + (bosh + m + b * s) + '" stroke="#b9d3e8" stroke-width="1"/>';
      g.forEach(function (q, b) {
        q.forEach(function (on, a) {
          if (on) svg += '<rect x="' + (x0 + a * s) + '" y="' + (bosh + m + b * s) + '" width="' + s + '" height="' + s + '" fill="#ffd9e3" stroke="#d6336c" stroke-width="2"/>';
        });
      });
      if (el.dataset.yorliq === "1" && pn[0] === "yuqoridan") {
        svg += '<text x="' + (x0 + w / 2) + '" y="' + (bosh + m + hh + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#5f6676">old tomon</text>';
        svg += '<text x="' + (x0 + w + 5) + '" y="' + (bosh + m + hh / 2 + 4) + '" font-size="11" font-weight="700" fill="#5f6676">yon</text>';
        H = Math.max(H, bosh + m + hh + 20);
        x0 += 22;
      }
      H = Math.max(H, bosh + m + hh + m);
      x0 = xs + sl + (el.dataset.yorliq === "1" && pn[0] === "yuqoridan" ? 22 : 0) + oraliq;
    });
    const W = x0 - oraliq + m;
    el.classList.add("kub");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" style="max-width:' + Math.round(W) + 'px" role="img" aria-label="' +
      (el.dataset.izoh || "Jismning ko'rinishlari kvadratli panjarada") + '">' + svg + "</svg>";
  }

  // ---------- suvli idish (kuboid, qiya proyeksiya) ----------
  function chizIdish(el) {
    const o = el.dataset.idish.split("x").map(Number);         // bo'yi, eni, balandligi
    const suv = el.dataset.suv ? Math.min(Number(el.dataset.suv), o[2]) : 0;
    const yoz = (el.dataset.yozuv || "").split("|");
    const k = Math.min(210 / (o[0] + 0.45 * o[1]), 150 / (o[2] + 0.3 * o[1]));
    const A = Math.max(o[0] * k, 110), H = Math.max(o[2] * k, 46), E = Math.max(o[1] * k * 0.5, 26);
    const dx = E * 0.82, dy = -E * 0.57;                         // chuqurlik yo'nalishi (o'ngga-tepaga)
    const h = H * suv / o[2];
    const x0 = yoz[2] ? 78 : 16, y0 = 14 - dy + H;                             // old pastki chap uch
    const p = function (x, y, z) { return [x0 + x + z * dx, y0 - y + z * dy]; };    // x — bo'yi, y — balandlik, z — chuqurlik (0..1)
    const yo = function (nuq) { return nuq.map(function (n) { return n[0].toFixed(1) + " " + n[1].toFixed(1); }).join(" L"); };
    const kop = function (nuq, fill, extra) { return '<path d="M' + yo(nuq) + ' Z" fill="' + fill + '"' + (extra || "") + "/>"; };
    const chiz = function (a, b, extra) { return '<path d="M' + yo([a, b]) + '" fill="none" stroke="#4a5368" stroke-width="1.6"' + (extra || "") + "/>"; };
    let s = "";
    // orqa (ko'rinmaydigan) qirralar — punktir
    const dash = ' stroke-dasharray="5 4" stroke="#9aa3b5"';
    s += chiz(p(0, 0, 1), p(0, H, 1), dash) + chiz(p(0, 0, 1), p(A, 0, 1), dash) + chiz(p(0, 0, 0), p(0, 0, 1), dash);
    // suv
    if (h > 0) {
      s += kop([p(0, 0, 0), p(A, 0, 0), p(A, h, 0), p(0, h, 0)], "#8cc8f2", ' fill-opacity="0.75"');
      s += kop([p(A, 0, 0), p(A, 0, 1), p(A, h, 1), p(A, h, 0)], "#6fb2e6", ' fill-opacity="0.75"');
      s += kop([p(0, h, 0), p(A, h, 0), p(A, h, 1), p(0, h, 1)], "#bfe1fa", ' fill-opacity="0.85" stroke="#3d8fd1" stroke-width="1.2"');
    }
    // shisha (ko'rinadigan qirralar)
    s += kop([p(0, 0, 0), p(A, 0, 0), p(A, H, 0), p(0, H, 0)], "none", ' stroke="#4a5368" stroke-width="1.8"');
    s += kop([p(A, 0, 0), p(A, 0, 1), p(A, H, 1), p(A, H, 0)], "none", ' stroke="#4a5368" stroke-width="1.8"');
    s += chiz(p(0, H, 0), p(0, H, 1)) + chiz(p(0, H, 1), p(A, H, 1));
    // yozuvlar
    const matn = function (x, y, t, anchor, rang) {
      return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="15" font-weight="800" fill="' + rang + '">' + t + "</text>";
    };
    const olchov = function (x, ya, yb, rang) {                   // tik o'lcham chizig'i (strelkalar bilan)
      return '<path d="M' + x + " " + (ya - 1) + " L" + x + " " + (yb + 1) + " M" + (x - 4) + " " + (ya - 6) + " L" + x + " " + (ya - 1) + " L" + (x + 4) + " " + (ya - 6) +
        " M" + (x - 4) + " " + (yb + 6) + " L" + x + " " + (yb + 1) + " L" + (x + 4) + " " + (yb + 6) + '" fill="none" stroke="' + rang + '" stroke-width="1.6"/>';
    };
    let W = x0 + A + dx + 12;
    if (yoz[0]) s += matn(x0 + A / 2, y0 + 22, yoz[0], "middle", "#d4501b");
    if (yoz[1]) { const t = p(A, 0, 0.5); s += matn(t[0] + 10, t[1] + 14, yoz[1], "start", "#1f5fd6"); W = Math.max(W, t[0] + 18 + yoz[1].length * 9.5); }
    if (yoz[2]) s += olchov(x0 - 10, y0 - H, y0, "#6d3fc0") + matn(x0 - 16, y0 - H / 2 + 5, yoz[2], "end", "#6d3fc0");
    const xi = x0 + Math.max(dx + 12, A * 0.5 - 22);                // orqa punktir qirradan o'ngda
    if (yoz[3] && h > 0) s += olchov(xi, y0 - h, y0, "#1565b8") + matn(xi + 7, y0 - h / 2 + 5, yoz[3], "start", "#1565b8");
    if (yoz[4] && h < H) s += olchov(xi, y0 - H, y0 - h, "#5f6676") + matn(xi + 7, y0 - (H + h) / 2 + 5, yoz[4], "start", "#5f6676");
    const Ht = y0 + 30;
    el.classList.add("idish");
    el.innerHTML = '<svg viewBox="0 0 ' + W.toFixed(0) + " " + Ht.toFixed(0) + '" style="max-width:' + Math.round(W) + 'px" role="img" aria-label="' +
      (el.dataset.izoh || "Kuboid shaklidagi idish" + (suv ? ", ichida suv" : "")) + '">' + s + "</svg>";
  }

  // ---------- buyumlar qatori (nisbat): shakllar, kerak bo'lsa guruhlarga ajratilgan ----------
  const BUYUM_RANG = { "ko'k": ["#8fb3f5", "#1f5fd6"], qizil: ["#f59a9a", "#c81e1e"], yashil: ["#8fd6b4", "#12805c"], sariq: ["#fbd56b", "#b58105"],
    binafsha: ["#c4adf0", "#6d3fc0"], "to'q sariq": ["#fbb48a", "#d4501b"] };
  function shakl(tur, cx, cy, r, c) {
    const st = '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2" stroke-linejoin="round"/>';
    const nuqtalar = function (p) { return '<path d="M' + p.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" L") + ' Z' + st; };
    if (tur === "kvadrat") return '<rect x="' + (cx - r * 0.86) + '" y="' + (cy - r * 0.86) + '" width="' + r * 1.72 + '" height="' + r * 1.72 + '" rx="2' + st;
    if (tur === "uchburchak") return nuqtalar([[cx, cy - r], [cx + r * 0.95, cy + r * 0.72], [cx - r * 0.95, cy + r * 0.72]]);
    if (tur === "romb") return nuqtalar([[cx, cy - r], [cx + r * 0.78, cy], [cx, cy + r], [cx - r * 0.78, cy]]);
    if (tur === "yulduz") {
      const p = [];
      for (let k = 0; k < 10; k++) { const a = Math.PI * k / 5, q = k % 2 ? r * 0.45 : r * 1.05; p.push([cx + q * Math.sin(a), cy - q * Math.cos(a) + r * 0.08]); }
      return nuqtalar(p);
    }
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r * 0.92 + st;
  }
  function chizBuyum(el) {
    const qator = el.dataset.buyum.split("|").map(function (q) { const p = q.split(":"); return { nom: p[0], tur: p[1], rang: p[2], n: Number(p[3]) }; });
    const g = Number(el.dataset.guruh || 0), s = Number(el.dataset.olcham || 24), qadam = s + 6, W = 380, ich = g ? 5 : 0, ora = g ? 12 : 0;
    let svg = "", y = 0, maxX = 0;
    qator.forEach(function (q) {
      if (q.nom) { svg += '<text x="2" y="' + (y + 15) + '" font-size="15" font-weight="700" fill="#1f2433">' + q.nom + "</text>"; y += 22; }
      const blok = g || 1, bolaklar = Math.ceil(q.n / blok), bw = blok * qadam - 6 + 2 * ich;
      let x = 2, yy = y + ich;
      for (let b = 0; b < bolaklar; b++) {
        if (x + bw > W - 2 && x > 2) { x = 2; yy += s + 2 * ich + 8; }
        const soni = Math.min(blok, q.n - b * blok);
        if (g) svg += '<rect x="' + x + '" y="' + (yy - ich) + '" width="' + (soni * qadam - 6 + 2 * ich) + '" height="' + (s + 2 * ich) + '" rx="8" fill="none" stroke="#6d3fc0" stroke-width="1.8" stroke-dasharray="5 4"/>';
        for (let k = 0; k < soni; k++) svg += shakl(q.tur, x + ich + k * qadam + s / 2, yy + s / 2, s / 2, BUYUM_RANG[q.rang] || BUYUM_RANG["ko'k"]);
        maxX = Math.max(maxX, x + soni * qadam - 6 + 2 * ich);
        x += bw + ora;
      }
      y = yy + s + ich + 12;
    });
    const Wt = Math.max(maxX + 2, 120);
    el.classList.add("buyum");
    el.innerHTML = '<svg viewBox="0 0 ' + Wt + " " + (y - 6) + '" style="max-width:' + Wt + 'px" role="img" aria-label="' + (el.dataset.izoh ||
      qator.map(function (q) { return (q.nom ? q.nom + ": " : "") + q.n + " ta"; }).join(", ") + (g ? ", " + g + " tadan guruhlarga ajratilgan" : "")) + '">' + svg + "</svg>";
  }

  // ---------- o'lchov idishi (menzurka) ----------
  function chizMenzurka(el) {
    const [v, max] = el.dataset.menzurka.split("/").map(Number);
    const x = 40, w = 54, top = 22, H = 200, bot = top + H;
    const y = function (q) { return bot - H * q / max; };
    let s = '<path d="M' + x + " " + (top - 8) + " L" + x + " " + bot + " Q" + x + " " + (bot + 8) + " " + (x + 8) + " " + (bot + 8) +
      " L" + (x + w - 8) + " " + (bot + 8) + " Q" + (x + w) + " " + (bot + 8) + " " + (x + w) + " " + bot + " L" + (x + w) + " " + (top - 8) + '" fill="#f7fbff" stroke="#4a5368" stroke-width="2"/>';
    s += '<path d="M' + (x + 1) + " " + y(v) + " L" + (x + w - 1) + " " + y(v) + " L" + (x + w - 1) + " " + bot + " Q" + (x + w - 1) + " " + (bot + 7) + " " + (x + w - 8) + " " + (bot + 7) +
      " L" + (x + 8) + " " + (bot + 7) + " Q" + (x + 1) + " " + (bot + 7) + " " + (x + 1) + " " + bot + ' Z" fill="#8cc8f2" fill-opacity="0.8"/>';
    s += '<path d="M' + (x + 1) + " " + y(v) + " L" + (x + w - 1) + " " + y(v) + '" stroke="#1565b8" stroke-width="2"/>';
    for (let i = 1; i <= 10; i++) {
      const q = max * i / 10, uz = i % 2 === 0;
      s += '<path d="M' + x + " " + y(q) + " L" + (x + (uz ? 16 : 9)) + " " + y(q) + '" stroke="#4a5368" stroke-width="1.4"/>';
      if (uz) s += '<text x="' + (x - 5) + '" y="' + (y(q) + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="#5f6676">' + q + "</text>";
    }
    s += '<text x="' + (x + w / 2) + '" y="' + (top - 12) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#5f6676">ml</text>';
    s += '<text x="' + (x + w + 8) + '" y="' + (y(v) + 5) + '" font-size="15" font-weight="800" fill="#1565b8">' + v + " ml</text>";
    const W = x + w + 8 + String(v).length * 9 + 30;
    el.classList.add("idish");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + (bot + 14) + '" style="max-width:' + W + 'px" role="img" aria-label="' +
      (el.dataset.izoh || "O'lchov idishida " + v + " ml suyuqlik") + '">' + s + "</svg>";
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
      root.querySelectorAll("[data-ikki]").forEach(chizIkki);
      root.querySelectorAll("[data-siljish]").forEach(chizSiljish);
      root.querySelectorAll("[data-zanjir]").forEach(chizZanjir);
      root.querySelectorAll("[data-nollar]").forEach(chizNollar);
      root.querySelectorAll("[data-tartib]").forEach(chizTartib);
      root.querySelectorAll("[data-tasma]").forEach(chizTasma);
      root.querySelectorAll("[data-ustunli]").forEach(chizUstunli);
      root.querySelectorAll("[data-qismlar]").forEach(chizQismlar);
      root.querySelectorAll("[data-onli]").forEach(chizOnli);
      root.querySelectorAll("[data-pitsa]").forEach(chizPitsa);
      root.querySelectorAll("[data-doira]").forEach(chizDoira);
      root.querySelectorAll("[data-qism]").forEach(chizQism);
      root.querySelectorAll("[data-yuza]").forEach(chizYuza);
      root.querySelectorAll("[data-qolgan]").forEach(chizQolgan);
      root.querySelectorAll("[data-geo]").forEach(chizGeo);
      root.querySelectorAll("[data-kub]").forEach(chizKub);
      root.querySelectorAll("[data-idish]").forEach(chizIdish);
      root.querySelectorAll("[data-menzurka]").forEach(chizMenzurka);
      root.querySelectorAll("[data-buyum]").forEach(chizBuyum);
      root.querySelectorAll("[data-panjara]").forEach(chizPanjara);
      root.querySelectorAll("[data-korinish]").forEach(chizKorinish);
    }
  };
})();
