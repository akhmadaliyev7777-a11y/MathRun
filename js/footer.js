// Pastki qism: raqamlar (js/raqamlar.json — GitHub har 3 kunda yangilaydi)
(function () {
  var box = document.getElementById("footer-raqamlar");
  if (!box) return;
  var son = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  fetch("js/raqamlar.json?d=" + new Date().toISOString().slice(0, 10))
    .then(function (j) { if (!j.ok) throw 0; return j.json(); })
    .then(function (r) {
      box.innerHTML =
        "<span><b>" + r.maruza + "</b> ma'ruza</span>" +
        "<span><b>" + son(Math.floor(r.savol / 100) * 100) + "+</b> test savoli</span>" +
        "<span><b>" + r.interaktiv + "</b> interaktiv dars</span>";
      box.hidden = false;
    })
    .catch(function () {});
})();
