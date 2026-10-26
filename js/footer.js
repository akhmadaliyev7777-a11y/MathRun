// Pastki qism — barcha bo'limlarda bir xil (bosh sahifa, «Biz haqimizda», «Yuqori sinflar», boshlang'ich sinflar).
// Sahifada <footer class="site-footer" data-base=""></footer> bo'lsa — ichi shu yerdan to'ldiriladi
// (data-base — sahifadan sayt ildizigacha yo'l, masalan "../"). Raqamlar js/raqamlar.json dan
// (GitHub har 3 kunda yangilaydi).
(function () {
  function html(b) {
    return (
      '<div class="footer-inner">' +
      '<div class="footer-brand">' +
      '<a class="footer-logo" href="' + b + 'index.html"><img class="site-logo-img" src="' + b + 'logo.png?v=1" alt="Mathlearn" width="185" height="36" loading="lazy"></a>' +
      '<p class="footer-maqsad">Maqsadimiz: matematikani har bir o\'quvchi uchun tushunarli va qiziqarli qilish.</p>' +
      '<p class="footer-maqsad">1–11-sinflar uchun — darslik asosida, bepul.</p>' +
      '<div class="footer-raqamlar" id="footer-raqamlar" hidden></div>' +
      '<div class="footer-social">' +
      '<a href="https://t.me/mathlearn_uz" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.5ZM9.5 14l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.3L9.5 14Z"/></svg></a>' +
      '<a href="#" aria-label="Instagram" onclick="return false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>' +
      '</div>' +
      '</div>' +
      '<nav class="footer-col" aria-label="Yordam">' +
      '<div class="footer-title">Yordam</div>' +
      '<a href="' + b + 'info.html">Biz haqimizda</a>' +
      '<a href="https://t.me/mathlearn_uz" target="_blank" rel="noopener">Aloqa</a>' +
      '</nav>' +
      '<div class="footer-col footer-news">' +
      '<div class="footer-title">Kanalimiz</div>' +
      '<p>Yangi mavzu, test va interaktiv darslar chiqqanini kanalimizdan birinchi bo\'lib bilib oling.</p>' +
      '<a class="footer-tg" href="https://t.me/mathlearn_uz" target="_blank" rel="noopener">' +
      '<img class="footer-tg-ikon" src="' + b + 'img/telegram-kanal.webp?v=1" alt="" width="44" height="44" loading="lazy">' +
      '<span class="footer-tg-text"><b>@mathlearn_uz</b><span>Telegram kanal</span></span>' +
      '<span class="footer-tg-strelka" aria-hidden="true">→</span>' +
      '</a>' +
      '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
      '<span class="footer-copy">© 2026 Mathlearn</span>' +
      '</div>'
    );
  }
  function raqamlar(el, b) {
    var box = el.querySelector(".footer-raqamlar");
    if (!box) return;
    var son = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
    fetch(b + "js/raqamlar.json?d=" + new Date().toISOString().slice(0, 10))
      .then(function (j) { if (!j.ok) throw 0; return j.json(); })
      .then(function (r) {
        box.innerHTML =
          "<span><b>" + r.maruza + "</b> ma'ruza</span>" +
          "<span><b>" + son(Math.floor(r.savol / 100) * 100) + "+</b> test savoli</span>" +
          "<span><b>" + r.interaktiv + "</b> interaktiv dars</span>";
        box.hidden = false;
      })
      .catch(function () {});
  }
  function fill(el) {
    var b = el.getAttribute("data-base") || "";
    el.innerHTML = html(b);
    raqamlar(el, b);
  }
  window.mlFooter = fill;
  document.querySelectorAll("footer.site-footer[data-base]").forEach(fill);
})();
