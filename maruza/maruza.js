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
    yukla("script", { src: KATEX + "katex.min.js" })
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
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boshla);
  else boshla();
})();
