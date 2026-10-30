/*
  «Kamchilik topdingizmi?» — mavzu sahifasida har kim (o'quvchi, o'qituvchi, admin) kamchilikni yozib qoldiradi.
  Xabar Firebase ma'lumotlar bazasiga ("xabarlar" to'plami) yoziladi, uni faqat admin panelda ko'rish mumkin.
  Kutubxona yuklanmaydi: bitta oddiy so'rov yuboriladi.
*/

let XABAR_BOLIM = { maruza: "Nazariya", interaktiv: "Interaktiv panel", test: "Test" };
let xabarBolimTop = function () { const h = location.hash.slice(1); return XABAR_BOLIM[h] ? h : "maruza"; };

function xabarCurrentSection() { return xabarBolimTop(); }

function sendXabar(key, bolim, matn, ism) {
  const url = "https://firestore.googleapis.com/v1/projects/" + FIREBASE_CONFIG.projectId +
    "/databases/(default)/documents/xabarlar?key=" + FIREBASE_CONFIG.apiKey;
  const body = {
    fields: {
      k: { stringValue: key },
      bolim: { stringValue: bolim },
      matn: { stringValue: matn },
      ism: { stringValue: ism },
      t: { timestampValue: new Date().toISOString() },
      bajarildi: { booleanValue: false }
    }
  };
  return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); });
}

/* opts (boshqa sahifalar uchun, 2026-10-30): bolimlar — tanlov nomlari (kalitlari maruza/interaktiv/test — baza qoidasi shuni qabul qiladi),
   bolim() — ochilganda qaysi biri belgilanadi, joy — tugma qo'yiladigan element oldi, sarlavha() — oynadagi «Mavzu: …» matni;
   key funksiya bo'lishi mumkin (bitta sahifali ilovada yuborish paytida hisoblanadi) */
function initXabar(key, opts) {
  opts = opts || {};
  if (opts.bolimlar) XABAR_BOLIM = opts.bolimlar;
  if (opts.bolim) xabarBolimTop = opts.bolim;
  if (typeof FIREBASE_CONFIG === "undefined" || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" || !window.fetch) return;
  const container = opts.joy || document.querySelector(".page-container");
  if (!container) return;

  /* tugma sahifa tepasida (2026-10-28) */
  const ikon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M12 8v4.2"/><circle cx="12" cy="15.6" r=".6" fill="currentColor"/></svg>';
  const tugma = '<button type="button" class="xabar-open" id="xabar-open" title="Xato, kamchilik yoki taklifni yozib qoldiring" aria-label="Izoh yoki kamchilik yozish">' + ikon + '<span>Izoh yoki kamchilik</span></button>';
  /* yopishgan bosqichlar qatorida (Nazariya · Interaktiv · Test · PDF) — doim ko'rinib turadi */
  const nav = document.getElementById("topic-steps");
  if (nav) nav.insertAdjacentHTML("beforeend", tugma);
  else if (opts.joy) container.insertAdjacentHTML("beforebegin", '<div class="xabar-bar xabar-bar--alohida">' + tugma + '</div>');
  else container.insertAdjacentHTML("afterbegin", '<div class="xabar-bar">' + tugma + '</div>');
  document.body.insertAdjacentHTML("beforeend",
    '<div class="xabar-modal" id="xabar-modal" hidden>' +
      '<form class="xabar-box" id="xabar-form" role="dialog" aria-modal="true" aria-labelledby="xabar-title">' +
        '<div class="xabar-head"><div><b id="xabar-title">Izoh yoki kamchilik</b><small class="xabar-mavzu" id="xabar-mavzu"></small></div>' +
          '<button type="button" class="xabar-close" id="xabar-close" aria-label="Yopish">&times;</button></div>' +
        '<div class="xabar-label">Qayerda?</div>' +
        '<div class="xabar-chips" id="xabar-chips">' +
          Object.keys(XABAR_BOLIM).map(function (b) {
            return '<label class="xabar-chip"><input type="radio" name="xabar-bolim" value="' + b + '"><span>' + XABAR_BOLIM[b] + '</span></label>';
          }).join("") +
        '</div>' +
        '<label class="xabar-label" for="xabar-matn">Nima noto\'g\'ri?</label>' +
        '<textarea id="xabar-matn" class="xabar-input" rows="4" maxlength="1000" required ' +
          'placeholder="Masalan: 3-misolning javobi noto\'g\'ri; telefonda chizma sig\'mayapti; tugma ishlamayapti…"></textarea>' +
        '<label class="xabar-label" for="xabar-ism">Ismingiz <span>(shart emas)</span></label>' +
        '<input id="xabar-ism" class="xabar-input" maxlength="60" autocomplete="name">' +
        '<div class="xabar-error" id="xabar-error" hidden></div>' +
        '<button type="submit" class="xabar-send" id="xabar-send">Yuborish</button>' +
        '<p class="xabar-note">Xabaringizni faqat sayt muallifi ko\'radi.</p>' +
      '</form>' +
      '<div class="xabar-box xabar-done" id="xabar-done" hidden>' +
        '<div class="xabar-done-icon">✅</div><b>Rahmat!</b><p>Xabaringiz yuborildi. Kamchilikni albatta ko\'rib chiqamiz.</p>' +
        '<button type="button" class="xabar-send" id="xabar-ok">Yopish</button>' +
      '</div>' +
    '</div>');

  const modal = document.getElementById("xabar-modal");
  const form = document.getElementById("xabar-form");
  const done = document.getElementById("xabar-done");
  const err = document.getElementById("xabar-error");
  const send = document.getElementById("xabar-send");

  function open() {
    form.hidden = false; done.hidden = true; err.hidden = true;
    const cur = xabarCurrentSection();
    const tt = document.getElementById("topic-title");
    const sar = opts.sarlavha ? opts.sarlavha() : (tt ? tt.textContent.trim() : "");
    document.getElementById("xabar-mavzu").textContent = sar ? "Mavzu: " + sar : "";
    form.querySelectorAll('input[name="xabar-bolim"]').forEach(function (r) { r.checked = r.value === cur; });
    modal.hidden = false;
    setTimeout(function () { document.getElementById("xabar-matn").focus(); }, 50);
  }
  function close() { modal.hidden = true; }

  document.getElementById("xabar-open").addEventListener("click", open);
  document.getElementById("xabar-close").addEventListener("click", close);
  document.getElementById("xabar-ok").addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const matn = document.getElementById("xabar-matn").value.trim();
    if (!matn) { document.getElementById("xabar-matn").focus(); return; }
    const checked = form.querySelector('input[name="xabar-bolim"]:checked');
    const ism = document.getElementById("xabar-ism").value.trim();
    send.disabled = true; send.textContent = "Yuborilmoqda…"; err.hidden = true;
    sendXabar(typeof key === "function" ? key() : key, checked ? checked.value : xabarCurrentSection(), matn.slice(0, 1000), ism.slice(0, 60))
      .then(function () {
        document.getElementById("xabar-matn").value = "";
        form.hidden = true; done.hidden = false;
      })
      .catch(function () {
        err.textContent = "Yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.";
        err.hidden = false;
      })
      .then(function () { send.disabled = false; send.textContent = "Yuborish"; });
  });
}
