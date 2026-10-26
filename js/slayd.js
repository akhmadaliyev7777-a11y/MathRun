// Slayd-shou (coverflow): bosh sahifa, «Yuqori sinflar» va boshlang'ich sinflar bo'limi uchun umumiy.
// box — bo'sh element (class="hero-slider"), slides — har biri '<div class="hs-slide ...">…</div>' matni.
function mountHeroSlider(box, slides) {
  box.innerHTML = '<div class="hs-track">' + slides.join("") + '</div>' +
    '<button type="button" class="hs-arrow hs-prev" aria-label="Oldingi">‹</button>' +
    '<button type="button" class="hs-arrow hs-next" aria-label="Keyingi">›</button>' +
    '<div class="hs-dots">' + slides.map(function (_, i) { return '<button type="button" aria-label="' + (i + 1) + '-slayd"></button>'; }).join("") + '</div>';

  const els = box.querySelectorAll(".hs-slide"), dots = box.querySelectorAll(".hs-dots button");
  let cur = 0, timer = null;
  // coverflow: o'rtadagi slayd oldinda, ikki yonidagisi qiya, xira va yarmi orqada yashiringan
  const show = function (i) {
    const len = els.length;
    cur = (i + len) % len;
    els.forEach(function (e, k) {
      const rel = (k - cur + len) % len;
      e.classList.remove("on", "prev", "next");
      if (rel === 0) e.classList.add("on");
      else if (rel === 1) e.classList.add("next");
      else if (rel === len - 1) e.classList.add("prev");
      e.setAttribute("aria-hidden", rel === 0 ? "false" : "true");
      e.querySelectorAll("a, button").forEach(function (x) { x.tabIndex = rel === 0 ? 0 : -1; });
    });
    dots.forEach(function (d, k) { d.classList.toggle("on", k === cur); });
  };
  // yondagi slaydni bosganda — o'sha slayd o'rtaga chiqadi
  els.forEach(function (e, k) {
    e.addEventListener("click", function (ev) {
      if (!e.classList.contains("on")) { ev.preventDefault(); show(k); play(); }
    });
  });
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const play = function () { stop(); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 5000); };
  const stop = function () { if (timer) clearInterval(timer); timer = null; };
  box.querySelector(".hs-prev").addEventListener("click", function () { show(cur - 1); play(); });
  box.querySelector(".hs-next").addEventListener("click", function () { show(cur + 1); play(); });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); play(); }); });
  box.addEventListener("mouseenter", stop); box.addEventListener("mouseleave", play);
  box.addEventListener("focusin", stop); box.addEventListener("focusout", play);
  let x0 = null;
  box.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
  box.addEventListener("pointerup", function (e) {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); play(); }
  });
  show(0); play();
}
window.mountHeroSlider = mountHeroSlider;
