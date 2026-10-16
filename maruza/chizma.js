/* Ma'ruza chizmalari — sahifadagi data-* atributlardan SVG/HTML yasaydi.
   Hammasi KaTeX'dan OLDIN ishlaydi (formulalar \( \) ichida qoldiriladi).

   data-ld="a/b" [data-x="3"]     — burchak usulida bo'lish a : b, verguldan keyin ko'pi bilan x xona
   data-xk="a/b/c/d/k"             — a/b = c/d, surat va maxraj k ga ko'paytiriladi (strelkali sxema)
   data-kataklar="n" [data-jami]   — 10×10 (yoki 10×jami/10) katak, n tasi bo'yalgan
   data-sonoqi="bo'lak/nuqta" [data-yozuv="0,6"] — 0 dan 1 gacha son o'qi, bo'lak ga bo'lingan, nuqta-chi bo'lakda belgi
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

  window.MaruzaChizma = {
    bolish: bolish,
    chiz: function (root) {
      root = root || document;
      root.querySelectorAll("[data-ld]").forEach(chizLd);
      root.querySelectorAll("[data-xk]").forEach(chizXk);
      root.querySelectorAll("[data-kataklar]").forEach(chizKataklar);
      root.querySelectorAll("[data-sonoqi]").forEach(chizSonoqi);
    }
  };
})();
