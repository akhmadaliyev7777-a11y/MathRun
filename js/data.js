/*
  SITE_DATA — saytning butun mazmuni shu yerda saqlanadi.
  Yangi mavzu qo'shish uchun yangi sahifa yaratish SHART EMAS —
  faqat kerakli "topics" ro'yxatiga yangi obyekt qo'shing.

  Har bir mavzu (topic) tuzilishi — ikki xil ko'rinishda bo'lishi mumkin:

  1) ODDIY (bitta ma'ruza matni) — ko'pchilik mavzular hozircha shunday:
  {
    id: "unikal-id",          // URL uchun, lotin harflar, - bilan
    title: "Mavzu nomi",
    lecture: {
      text: "Ma'ruza/tushuntirish matni. Bir nechta paragraf bo'lishi mumkin.",
      embedUrl: null          // agar prezentatsiya (masalan Google Slides) bo'lsa, shu yerga link qo'ying
    },
    interactive: null,        // interaktiv HTML fayl tayyor bo'lsa: "lessons/fayl-nomi.html"
    test: null                // interaktiv test tayyor bo'lsa: "lessons/fayl-nomi.html"
  }

  2) MAVZUCHALARGA BO'LINGAN (darslikdagi bo'limlar bo'yicha) — bitta mavzu
  bir nechta kichik mavzuchadan (bo'limdan) iborat bo'lsa, "sections"
  ishlatiladi, "lecture.text" o'rniga:
  {
    id: "unikal-id",
    title: "Mavzu nomi",
    page: "45-bet",           // ixtiyoriy, darslikdagi sahifa/joyi
    sections: [
      { title: "Mavzucha nomi", text: null },   // text hali yozilmagan bo'lsa null
      { title: "Boshqa mavzucha", text: "Yozilgan ma'ruza matni..." }
    ],
    lecture: { embedUrl: null },  // ixtiyoriy — butun mavzuga oid prezentatsiya
    interactive: null,
    test: null
  }
  Har bir mavzuchaning "text" maydonini keyinroq to'ldirib borasiz —
  mavzu.html avtomatik har bir mavzuchani alohida ko'rsatadi, text hali
  yozilmagan bo'lsa "hali qo'shilmagan" deb ko'rsatiladi.

  interactive yoki test hali tayyor bo'lmasa — shunchaki null qoldiring,
  sahifada avtomatik "tez orada" deb ko'rsatiladi.
*/

function sec(title) {
  return { title: title, text: null };
}

function secText(title, html) {
  return { title: title, text: html };
}

const SITE_DATA = {
  grades: [
    {
      id: "5",
      name: "5-sinf",
      subjects: [
        {
          id: "matematika",
          name: "Matematika",
          topics: [
            {
              id: "natural-sonlar", title: "1. Natural sonlar", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Har qanday natural sonning har bir raqami turgan o'rniga (xonasiga) qarab qiymat oladi: birlar, o'nlar, yuzlar, minglar va hokazo.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> son o'ng tomondan chapga qarab birlar, o'nlar, yuzlar, minglar xonalariga bo'linadi. Har uchta xona bitta «sinf»ni tashkil qiladi: birlar sinfi, minglar sinfi, millionlar sinfi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4528 sonida — 8 birlar xonasida, 2 o'nlar xonasida, 5 yuzlar xonasida, 4 minglar xonasida turadi.</div>"
                ),
                secText("1 milliongacha bo'lgan sonlar",
                  "<div class='lecture-figure'><table style='border-collapse:collapse;text-align:center;font-weight:700;'>" +
                    "<tr>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>YUZ MINGL.</td>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>O'N MINGL.</td>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>MINGL.</td>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>YUZL.</td>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>O'NL.</td>" +
                      "<td style='padding:6px 10px;color:#6b7280;font-size:.75rem;'>BIRL.</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td style='padding:8px 10px;background:#eef0fb;border-radius:8px;color:#4f5bd5;'>2</td>" +
                      "<td style='padding:8px 10px;background:#eef0fb;border-radius:8px;color:#4f5bd5;'>4</td>" +
                      "<td style='padding:8px 10px;background:#eef0fb;border-radius:8px;color:#4f5bd5;'>5</td>" +
                      "<td style='padding:8px 10px;background:#e6f7f4;border-radius:8px;color:#16a394;'>3</td>" +
                      "<td style='padding:8px 10px;background:#e6f7f4;border-radius:8px;color:#16a394;'>1</td>" +
                      "<td style='padding:8px 10px;background:#e6f7f4;border-radius:8px;color:#16a394;'>8</td>" +
                    "</tr>" +
                  "</table></div>" +
                  "<p>1 milliongacha bo'lgan sonlar 6 xonagacha bo'ladi: birlar sinfi (birlik, o'nlik, yuzlik) va minglar sinfi (minglik, o'n minglik, yuz minglik).</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> son o'qilganda avval minglar sinfidagi raqamlar o'qilib «ming» so'zi qo'shiladi, keyin birlar sinfidagi raqamlar o'qiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 245 318 — «ikki yuz qirq besh ming uch yuz o'n sakkiz» deb o'qiladi.</div>"
                ),
                secText("10 milliongacha bo'lgan sonlar",
                  "<p>Minglar sinfidan keyin millionlar sinfi keladi: million, o'n million, yuz million xonalari.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> 7 yoki 8 xonali sonlarda millionlar sinfi ham qo'shiladi — son o'qilganda avval millionlar sinfi, keyin minglar sinfi, so'ng birlar sinfi ketma-ket o'qiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 7 456 210 — «yetti million to'rt yuz ellik olti ming ikki yuz o'n» deb o'qiladi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bu bo'limda o'rgangan bilimlaringizni chuqurroq fikrlash talab qiladigan masalada qo'llaysiz.</p>" +
                  "<div class='lecture-example'><strong>Misol masala:</strong> Bitta sonning yuzlar xonasida 7, minglar xonasida 3, qolgan xonalarida 0 turibdi va son 4 xonali. Bu qaysi son? (Javob: 3700)</div>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-natural-sonlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=natural-sonlar"
            },
            {
              id: "turt-amal", title: "2. Sonlar ustida to'rt amal", page: "13-bet",
              sections: [
                secText("Sonni 10, 100 va 1000 ga ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonni 10 ga ko'paytirish uchun uning oxiriga 1 ta nol, 100 ga ko'paytirish uchun 2 ta nol, 1000 ga ko'paytirish uchun 3 ta nol qo'shiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 45 × 10 = 450, &nbsp; 45 × 100 = 4500, &nbsp; 45 × 1000 = 45000.</div>"
                ),
                secText("Sonni o'nlik, yuzlik va mingliklarga ko'paytirish",
                  "<p>Sonni 30, 300 yoki 3000 kabi songa ko'paytirish uchun avval bir xonali songa (3 ga) ko'paytiriladi, so'ng mos noldar qo'shiladi.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> 45 × 30 = 45 × 3 × 10.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 45 × 30 = 45 × 3 × 10 = 135 × 10 = 1350.</div>"
                ),
                secText("Sonni 10, 100 va 1000 ga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar son oxirida shuncha nol bo'lsa, 10 ga bo'lishda 1 ta, 100 ga bo'lishda 2 ta, 1000 ga bo'lishda 3 ta nol olib tashlanadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4500 : 100 = 45.</div>"
                ),
                secText("Sonni o'nlik, yuzlik va mingliklarga bo'lish",
                  "<p>Sonni 30, 300, 3000 kabi songa bo'lish uchun avval nollarga, so'ng bir xonali songa bo'linadi.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1350 : 30 = 1350 : 10 : 3 = 135 : 3 = 45.</div>"
                ),
                secText("Qavssiz ifodalarda amallarni bajarish tartibi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs bo'lmasa, avval ko'paytirish va bo'lish (chapdan o'ngga), keyin qo'shish va ayirish (chapdan o'ngga) bajariladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 12 + 6 × 3 = 12 + 18 = 30 (avval 6×3, keyin qo'shish).</div>"
                ),
                secText("Qavsli ifodalarda amallarni bajarish tartibi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs bo'lsa, hamma amallardan oldin qavs ichidagi amal bajariladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (12 + 6) × 3 = 18 × 3 = 54.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Do'konda 24 ta karobkada har birida 12 tadan olma bor edi, 90 tasi sotildi. Nechta olma qoldi? Yechish: 24 × 12 − 90 = 288 − 90 = 198 ta.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>O'rgangan to'rt amal va amallar tartibi qoidalarini ko'p bosqichli masalada birga qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-turt-amal.html", test: "test.html?sinf=5&fan=matematika&mavzu=turt-amal"
            },
            {
              id: "oddiy-kasrlar", title: "3. Oddiy kasrlar", page: "45-bet",
              sections: [
                secText("Sonlarni bo'lishni kasr ko'rinishida ifodalash",
                  "<div class='lecture-figure'>" +
                    "<svg width='220' height='90' viewBox='0 0 220 90'>" +
                      "<rect x='5' y='25' width='210' height='40' rx='6' fill='none' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='57.5' y1='25' x2='57.5' y2='65' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='110' y1='25' x2='110' y2='65' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='162.5' y1='25' x2='162.5' y2='65' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<rect x='5' y='25' width='52.5' height='40' rx='6' fill='#eef0fb'/>" +
                      "<text x='110' y='83' font-size='13' fill='#6b7280' text-anchor='middle'>3 ta narsa, 4 kishiga baravar bo'lindi</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Bir sonni ikkinchi songa bo'lish natijasi kasr ko'rinishida yozilishi mumkin.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> a ni b ga bo'lish — a/b kasriga teng (b ≠ 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 ta tortni 4 kishiga baravar bo'lsak, har biriga 3/4 qism tegadi, ya'ni 3 : 4 = 3/4.</div>"
                ),
                secText("Oddiy kasrni o'nli kasrga aylantirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> oddiy kasrni o'nli kasrga aylantirish uchun suratni maxrajga bo'lamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3/4 = 3 : 4 = 0,75.</div>"
                ),
                secText("Eslang",
                  "<p>Kasrlarni qo'shish va ayirish uchun maxrajlar teng bo'lishi kerak. Maxrajlar har xil bo'lsa, avval umumiy maxrajga keltiriladi.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.</div>"
                ),
                secText("Aralash sonlarni qo'shish va ayirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval butun qismlar, so'ng kasr qismlar alohida qo'shiladi (yoki ayiriladi); kasr qism 1 dan oshsa, 1 butunga aylantirib butun qismga qo'shiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2 va 3/4 + 1 va 2/4 = 3 va 5/4 = 4 va 1/4.</div>"
                ),
                secText("Eslang",
                  "<p>To'g'ri kasrda surat maxrajdan kichik (masalan 3/4), noto'g'ri kasrda surat maxrajga teng yoki undan katta (masalan 7/4).</p>"
                ),
                secText("To'g'ri kasrni natural songa ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kasrni natural songa ko'paytirishda faqat surat shu songa ko'paytiriladi, maxraj o'zgarmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2/5 × 3 = 6/5 = 1 va 1/5.</div>"
                ),
                secText("Noto'g'ri kasrni natural songa ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 7/4 × 2 = 14/4 = 3 va 2/4 = 3 va 1/2.</div>"
                ),
                secText("Ikkita to'g'ri kasrni ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> surat suratga, maxraj maxrajga ko'paytiriladi: a/b × c/d = (a×c)/(b×d).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2/3 × 3/5 = 6/15 = 2/5.</div>"
                ),
                secText("To'g'ri va noto'g'ri kasrlarni ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 2/3 × 5/4 = 10/12 = 5/6.</div>"
                ),
                secText("Ikkita noto'g'ri kasrni ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 5/2 × 7/3 = 35/6 = 5 va 5/6.</div>"
                ),
                secText("Aralash sonlarni natural songa ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval aralash son noto'g'ri kasrga aylantiriladi, so'ng natural songa ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1 va 1/2 × 4 = 3/2 × 4 = 12/2 = 6.</div>"
                ),
                secText("Qolgan qismning qismi",
                  "<p>Bir butunning bir qismi olingandan keyin qolgan qismning yana bir qismini topish masalalari uchraydi.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> Tortning 1/4 qismi yeyildi. Qolgan qismning 1/3 qismini yana yesa, jami tortning qancha qismi yeyilgan? Qolgan qism 3/4; 3/4 ning 1/3 qismi = 3/4 × 1/3 = 1/4. Jami: 1/4 + 1/4 = 1/2.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Sinfdagi o'quvchilarning 2/5 qismi qizlar. Sinfda 30 ta o'quvchi bo'lsa, nechta qiz bor? Yechish: 30 × 2/5 = 12 ta.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Kasrlar ustida amallarni ko'p bosqichli masalalarda birga qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-oddiy-kasrlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=oddiy-kasrlar"
            },
            {
              id: "uchburchak-yuzi", title: "4. Uchburchakning yuzi", page: "89-bet",
              sections: [
                secText("Eslang",
                  "<p>To'g'ri to'rtburchakning yuzi uzunlik va enning ko'paytmasiga teng: S = uzunlik × en.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> Tomonlari 6 sm va 4 sm bo'lgan to'g'ri to'rtburchakning yuzi: 6 × 4 = 24 sm².</div>"
                ),
                secText("Uchburchakning asosi va balandligi",
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='120' viewBox='0 0 180 120'>" +
                      "<polygon points='20,100 160,100 90,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='90' y1='100' x2='90' y2='20' stroke='#16a394' stroke-width='2' stroke-dasharray='4,3'/>" +
                      "<text x='95' y='60' font-size='12' fill='#16a394'>balandlik</text>" +
                      "<text x='90' y='114' font-size='12' fill='#4f5bd5' text-anchor='middle'>asos</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Uchburchakning istalgan tomoni asos deb olinishi mumkin; balandlik — shu asosga qarama-qarshi uchdan asosga tushirilgan perpendikulyar kesma.</p>"
                ),
                secText("Uchburchakning yuzini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> S = (asos × balandlik) : 2.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> Asosi 8 sm, balandligi 5 sm bo'lgan uchburchakning yuzi: (8 × 5) : 2 = 20 sm².</div>"
                ),
                secText("To'g'ri to'rtburchak va uchburchaklardan tuzilgan murakkab shakllarning yuzi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> murakkab shaklni oddiy shakllarga (to'g'ri to'rtburchak va uchburchaklarga) bo'lib, har birining yuzini alohida topib, so'ng qo'shiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> To'g'ri to'rtburchak (6×4=24 sm²) ustiga uchburchak (asos 6, balandlik 3 → 9 sm²) qo'shilgan shaklning yuzi: 24 + 9 = 33 sm².</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak yuzi formulasini turli shakllardagi masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "hajm", title: "5. Hajm", page: "109-bet",
              sections: [
                secText("Eslang",
                  "<p>Tekis shakllarning kattaligi yuz bilan o'lchanadi (sm², m²). Fazoviy (3 o'lchamli) jismlarning kattaligi esa hajm bilan o'lchanadi.</p>"
                ),
                secText("Fazoviy jismlarning hajmi",
                  "<div class='lecture-figure'>" +
                    "<svg width='140' height='120' viewBox='0 0 140 120'>" +
                      "<polygon points='20,40 90,40 110,20 40,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='20,40 90,40 90,100 20,100' fill='#e6f7f4' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='90,40 110,20 110,80 90,100' fill='#fff' stroke='#4f5bd5' stroke-width='2'/>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Hajm — jismning fazoda egallagan o'rnini ko'rsatadi. Uni bir xil kublardan (birlik kublardan) tuzib o'lchash mumkin.</p>"
                ),
                secText("Uch o'lchamli panjarada fazoviy jismlarni chizish",
                  "<p>Fazoviy jismlarni tasvirlash uchun uzunlik, kenglik va balandlik yo'nalishlari bo'yicha chiziqlar chiziladigan maxsus panjara (izometrik panjara)dan foydalaniladi.</p>"
                ),
                secText("Kvadratli panjarada fazoviy jismlarning turli ko'rinishlarini chizish",
                  "<p>Bir jismni oldindan, yon tomondan va tepadan qaraganda uning har xil ko'rinishi (proyeksiyasi) hosil bo'ladi — bularni kvadratli panjarada alohida chizish mumkin.</p>"
                ),
                secText("Hajmni santimetr kub va metr kubda o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> tomoni 1 sm bo'lgan kubning hajmi 1 sm³, tomoni 1 m bo'lgan kubning hajmi 1 m³ deyiladi. 1 m³ = 1 000 000 sm³.</div>"
                ),
                secText("Kuboid va kubning hajmini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kuboid (to'g'ri burchakli parallelepiped) hajmi: V = uzunlik × en × balandlik. Kub uchun barcha qirralar teng: V = qirra³.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> Qirralari 4 sm, 3 sm, 5 sm bo'lgan kuboidning hajmi: 4 × 3 × 5 = 60 sm³. Qirrasi 3 sm bo'lgan kubning hajmi: 3 × 3 × 3 = 27 sm³.</div>"
                ),
                secText("Suyuqlik hajmini santimetr kub va metr kubda o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> suyuqlik hajmi ham sm³ yoki litrda o'lchanadi: 1 litr = 1000 sm³.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2,5 litr suv necha sm³ ga teng? 2,5 × 1000 = 2500 sm³.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Uzunligi 5 m, eni 3 m, balandligi 2 m bo'lgan hovuzning hajmini toping: 5 × 3 × 2 = 30 m³.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Hajm formulalarini amaliy masalalarda qo'llab, fikrlashni chuqurlashtirasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-hajm.html", test: "test.html?sinf=5&fan=matematika&mavzu=hajm"
            },
            {
              id: "nisbatlar", title: "6. Nisbatlar", page: "139-bet",
              sections: [
                secText("Nisbat tushunchasi",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='40' viewBox='0 0 200 40'>" +
                      "<rect x='0' y='5' width='80' height='30' fill='#4f5bd5'/>" +
                      "<rect x='84' y='5' width='40' height='30' fill='#16a394'/>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Nisbat — ikkita miqdorni taqqoslash usuli, necha marta katta yoki kichikligini ko'rsatadi.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> a va b miqdorlarining nisbati a : b (yoki a/b) shaklida yoziladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> rasmdagi ko'k va yashil qismlar nisbati 2 : 1.</div>"
                ),
                secText("Teng kuchli nisbatlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> nisbatning har ikkala qismini bir xil songa ko'paytirsak yoki bo'lsak, teng kuchli (ekvivalent) nisbat hosil bo'ladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2 : 3 = 4 : 6 = 6 : 9 (har biri 2 marta, 3 marta ko'paytirilgan).</div>"
                ),
                secText("Berilgan miqdor va nisbatga ko'ra boshqa miqdorni topish",
                  "<div class='lecture-example'><strong>Misol:</strong> Olma va nokning nisbati 3 : 2. Agar 12 ta olma bo'lsa, nechta nok bor? 12 : 3 = 4 (bir ulush), nok: 4 × 2 = 8 ta.</div>"
                ),
                secText("Berilgan jami miqdor va nisbatga ko'ra uning qismlarini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> jami miqdorni nisbat ulushlari yig'indisiga bo'lib, bitta ulush qiymatini topamiz, so'ng har bir qismga ko'paytiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 35 ta shokoladni 3 : 4 nisbatda ikki bolaga bo'lish: 35 : (3+4) = 5, birinchisiga 3×5=15, ikkinchisiga 4×5=20 ta.</div>"
                ),
                secText("Ikkita miqdorning nisbatiga doir matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Sinfda o'g'il va qizlar soni nisbati 4 : 5. Agar 27 ta o'quvchi bo'lsa, nechta qiz bor? 27 : 9 = 3, qizlar: 5 × 3 = 15 ta.</div>"
                ),
                secText("Uchta miqdorning nisbati",
                  "<div class='lecture-rule'><strong>Qoida:</strong> uchta miqdor ham a : b : c ko'rinishida taqqoslanishi mumkin.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> Uchta do'stning puli 2 : 3 : 5 nisbatda. Agar jami 100 000 so'm bo'lsa, bitta ulush 100 000 : 10 = 10 000 so'm, ulushlar: 20 000, 30 000, 50 000 so'm.</div>"
                ),
                secText("Uchta miqdorning nisbatiga doir matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Uchta idishdagi suv 1 : 2 : 3 nisbatda, jami 24 litr. Har birida qancha suv bor? Ulush: 24 : 6 = 4 litr. Idishlar: 4, 8, 12 litr.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Nisbat qoidalarini ko'p bosqichli, real hayotga oid masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "onli-kasrlar", title: "7. O'nli kasrlar", page: "2-qism, 1-bet",
              sections: [
                secText("Eslang",
                  "<div class='lecture-figure'>" +
                    "<svg width='240' height='50' viewBox='0 0 240 50'>" +
                      "<line x1='10' y1='25' x2='230' y2='25' stroke='#e5e7f0' stroke-width='2'/>" +
                      "<line x1='10' y1='18' x2='10' y2='32' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='120' y1='18' x2='120' y2='32' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='230' y1='18' x2='230' y2='32' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<circle cx='78' cy='25' r='5' fill='#16a394'/>" +
                      "<text x='10' y='45' font-size='11' fill='#6b7280' text-anchor='middle'>0</text>" +
                      "<text x='78' y='45' font-size='11' fill='#16a394' text-anchor='middle'>0,6</text>" +
                      "<text x='120' y='45' font-size='11' fill='#6b7280' text-anchor='middle'>1</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>O'nli kasr — maxraji 10, 100, 1000 bo'lgan kasrning vergul bilan yozilishi. Vergulgacha butun qism, keyin o'ndan, yuzdan, mingdan ulushlar yoziladi.</p>"
                ),
                secText("O'nli kasrni 10, 100 va 1000 ga ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'nli kasrni 10 ga ko'paytirishda vergul 1 xona o'ngga, 100 ga ko'paytirishda 2 xona, 1000 ga ko'paytirishda 3 xona o'ngga suriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2,5 × 10 = 25; &nbsp; 2,5 × 100 = 250.</div>"
                ),
                secText("O'nli kasrni o'nlik, yuzlik va mingliklarga ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 2,5 × 30 = 2,5 × 3 × 10 = 7,5 × 10 = 75.</div>"
                ),
                secText("O'nli kasrni 10, 100 va 1000 ga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'nli kasrni 10, 100, 1000 ga bo'lishda vergul mos ravishda 1, 2, 3 xona chapga suriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 45 : 100 = 0,45.</div>"
                ),
                secText("O'nli kasrni o'nliklar, yuzliklar va mingliklarga bo'lish",
                  "<div class='lecture-example'><strong>Misol:</strong> 7,2 : 0,8 = 72 : 8 = 9 (ikkala son 10 ga ko'paytirilib, natural songa bo'lishga keltirildi).</div>"
                ),
                secText("Eslang",
                  "<p>O'nli kasrlarni taqqoslashda avval butun qismlar, keyin o'ndan ulushlar, keyin yuzdan ulushlar solishtiriladi.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 0,25 va 0,250 — teng, chunki 0,250 = 0,25 (oxiridagi nol qiymatni o'zgartirmaydi).</div>"
                ),
                secText("O'lchov birliklarini almashtirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> masalan 1 m = 100 sm, 1 kg = 1000 g. Kattaroq birlikdan kichikroqqa o'tishda son ko'paytiriladi, aksincha — bo'linadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2,5 m = 2,5 × 100 = 250 sm.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> 1 metr matodan 0,35 metrini kesib oldilar. Necha metri qoldi? 1 − 0,35 = 0,65 metr.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>O'nli kasrlar ustidagi amallarni real hayotiy masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-onli-kasrlar.html", test: "test.html?sinf=5&fan=matematika&mavzu=onli-kasrlar"
            },
            {
              id: "meyor", title: "8. Me'yor", page: "33-bet",
              sections: [
                secText("Me'yorni topish",
                  "<p>Me'yor — bitta birlikka to'g'ri keladigan miqdor (masalan, 1 soatda bosib o'tilgan masofa, 1 kishiga to'g'ri keladigan narx).</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> me'yor = umumiy miqdor : birliklar soni.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 kg shakar 40 000 so'm bo'lsa, 1 kg narxi (me'yori): 40 000 : 5 = 8 000 so'm.</div>"
                ),
                secText("Me'yorga ko'ra umumiy miqdorni topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> umumiy miqdor = me'yor × birliklar soni.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1 kg shakar 8 000 so'm bo'lsa, 7 kg qancha turadi? 8 000 × 7 = 56 000 so'm.</div>"
                ),
                secText("Birliklar sonini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> birliklar soni = umumiy miqdor : me'yor.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 56 000 so'mga, 1 kg narxi 8 000 so'm bo'lsa, necha kg shakar olish mumkin? 56 000 : 8 000 = 7 kg.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Mashina 3 soatda 180 km yo'l bosdi. 1 soatdagi tezligi (me'yori) qancha? 180 : 3 = 60 km/soat. Shu tezlikda 5 soatda qancha yo'l bosadi? 60 × 5 = 300 km.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Me'yor tushunchasini narx, tezlik va boshqa real hayotiy masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "foizlar", title: "9. Foizlar", page: "51-bet",
              sections: [
                secText("Eslang",
                  "<p>Kasrlar butunning bir qismini ko'rsatadi: oddiy kasr (3/4), o'nli kasr (0,75) va foiz (75%) — bir xil miqdorni turli usulda ifodalash usullari.</p>"
                ),
                secText("Foiz tushunchasi",
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='40' viewBox='0 0 160 40'>" +
                      "<rect x='0' y='5' width='160' height='30' rx='6' fill='#f6f7fb' stroke='#e5e7f0'/>" +
                      "<rect x='0' y='5' width='60' height='30' rx='6' fill='#4f5bd5'/>" +
                      "<text x='30' y='25' font-size='12' fill='#fff' text-anchor='middle'>37,5%</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> foiz — butunning yuzdan bir ulushi. 1% = 1/100.</div>"
                ),
                secText("Oddiy kasr, o'nli kasr va foizlar orasidagi munosabatlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> foizni oddiy kasrga aylantirish uchun 100 ga bo'linadi; oddiy yoki o'nli kasrni foizga aylantirish uchun 100 ga ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 50% = 50/100 = 1/2 = 0,5.</div>"
                ),
                secText("Miqdorning foizi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> miqdorning n foizini topish uchun miqdorni n/100 ga ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 200 ning 25% i: 200 × 25/100 = 50.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Sinfda 40 o'quvchidan 25% i sport to'garagiga qatnaydi. Nechta o'quvchi? 40 × 25/100 = 10 ta.</div>"
                ),
                secText("QQS (qo'shilgan qiymat solig'i), chegirma va omonat foizi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> chegirmada narx kamayadi (narx − foiz qiymati), QQS va omonat foizida qiymat ustiga qo'shiladi (narx + foiz qiymati).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 80 000 so'mlik tovar 10% chegirma bilan: 80 000 − 80 000×10/100 = 80 000 − 8 000 = 72 000 so'm.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Bankka 500 000 so'm qo'yilsa, yiliga 12% omonat foizi bilan bir yildan keyin qancha bo'ladi? 500 000 + 500 000×12/100 = 500 000 + 60 000 = 560 000 so'm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Foizlarni chegirma, soliq va omonat kabi real hayotiy holatlarda hisoblaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: "test.html?sinf=5&fan=matematika&mavzu=foizlar"
            },
            {
              id: "ortacha-qiymat", title: "10. O'rtacha qiymat", page: "78-bet",
              sections: [
                secText("O'rtacha qiymat tushunchasi",
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='60' viewBox='0 0 180 60'>" +
                      "<rect x='10' y='40' width='20' height='15' fill='#4f5bd5'/>" +
                      "<rect x='40' y='20' width='20' height='35' fill='#4f5bd5'/>" +
                      "<rect x='70' y='5' width='20' height='50' fill='#4f5bd5'/>" +
                      "<rect x='100' y='30' width='20' height='25' fill='#4f5bd5'/>" +
                      "<line x1='0' y1='27' x2='180' y2='27' stroke='#16a394' stroke-width='2' stroke-dasharray='4,3'/>" +
                      "<text x='140' y='23' font-size='11' fill='#16a394'>o'rtacha</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir nechta miqdorning o'rtacha qiymati — ularning yig'indisini sonlar soniga bo'lish natijasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4, 8, 12 sonlarining o'rtachasi: (4+8+12) : 3 = 24 : 3 = 8.</div>"
                ),
                secText("Miqdorlarning o'rtacha va jami qiymati hamda soni",
                  "<div class='lecture-rule'><strong>Qoida:</strong> jami qiymat = o'rtacha qiymat × sonlar soni; sonlar soni = jami qiymat : o'rtacha qiymat.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 ta o'quvchining o'rtacha bahosi 4 bo'lsa, jami ballari: 4 × 5 = 20 ball.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>O'rtacha qiymatni topish va undan foydalanib jami yoki sonlar sonini topish masalalarini yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchaklar", title: "11. Burchaklar", page: "90-bet",
              sections: [
                secText("Eslang",
                  "<div class='lecture-figure'>" +
                    "<svg width='120' height='90' viewBox='0 0 120 90'>" +
                      "<line x1='10' y1='80' x2='110' y2='80' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='10' y1='80' x2='70' y2='15' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<path d='M 35 80 A 25 25 0 0 1 26 62' fill='none' stroke='#16a394' stroke-width='2'/>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Burchak — bir nuqtadan chiquvchi ikkita nurdan hosil bo'ladi. O'tkir burchak 90° dan kichik, to'g'ri burchak 90°, o'tmas burchak 90° dan katta lekin 180° dan kichik, yoyiq burchak 180°.</p>"
                ),
                secText("To'g'ri chiziqdagi burchaklar",
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='60' viewBox='0 0 160 60'>" +
                      "<line x1='10' y1='50' x2='150' y2='50' stroke='#e5e7f0' stroke-width='2'/>" +
                      "<line x1='70' y1='50' x2='40' y2='10' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='45' y='45' font-size='11' fill='#4f5bd5'>a</text>" +
                      "<text x='75' y='45' font-size='11' fill='#16a394'>b</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> to'g'ri chiziqda joylashgan ikki burchakning yig'indisi 180° ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> agar a = 65° bo'lsa, b = 180° − 65° = 115°.</div>"
                ),
                secText("Vertikal burchaklar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ikki to'g'ri chiziq kesishganda hosil bo'lgan qarama-qarshi (vertikal) burchaklar bir-biriga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> bitta burchak 70° bo'lsa, unga vertikal burchak ham 70° bo'ladi.</div>"
                ),
                secText("Nuqta atrofidagi burchaklar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir nuqta atrofida hosil bo'lgan barcha burchaklar yig'indisi 360° ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> uchta burchak 120°, 90°, 100° bo'lsa, to'rtinchisi: 360° − (120+90+100) = 50°.</div>"
                ),
                secText("Noma'lum burchaklarni topish",
                  "<div class='lecture-example'><strong>Misol:</strong> to'g'ri chiziqda joylashgan uchta burchakdan ikkitasi 50° va 60° bo'lsa, uchinchisi: 180° − 50° − 60° = 70°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'g'ri chiziq, vertikal va nuqta atrofidagi burchak qoidalarini birga qo'llab, noma'lum burchaklarni topasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-burchaklar.html", test: "test.html?sinf=5&fan=matematika&mavzu=burchaklar"
            },
            {
              id: "uchburchak-xossalari", title: "12. Uchburchakning xossalari", page: "110-bet",
              sections: [
                secText("Uchburchakning turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='280' height='80' viewBox='0 0 280 80'>" +
                      "<polygon points='20,70 90,70 55,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='110,70 190,70 150,15' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='210,70 270,70 220,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='55' y='80' font-size='11' fill='#6b7280' text-anchor='middle'>teng tomonli</text>" +
                      "<text x='150' y='80' font-size='11' fill='#6b7280' text-anchor='middle'>teng yonli</text>" +
                      "<text x='240' y='80' font-size='11' fill='#6b7280' text-anchor='middle'>turli tomonli</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> tomonlariga ko'ra: teng tomonli (barcha tomonlari teng), teng yonli (ikkita tomoni teng), turli tomonli (barcha tomonlari har xil) uchburchaklar bo'ladi. Burchaklariga ko'ra: o'tkir burchakli, to'g'ri burchakli, o'tmas burchakli bo'ladi.</div>"
                ),
                secText("Uchburchaklarni chizish",
                  "<p>Uchburchakni chizish uchun uning ba'zi elementlari (masalan uchta tomoni, yoki ikkita tomoni va ular orasidagi burchak) berilgan bo'lishi kerak.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> uchburchak chizilishi uchun istalgan ikki tomonining yig'indisi uchinchi tomonidan katta bo'lishi shart.</div>"
                ),
                secText("Uchburchakning burchaklari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har qanday uchburchakning ichki burchaklari yig'indisi 180° ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ikkita burchak 50° va 70° bo'lsa, uchinchisi: 180° − 50° − 70° = 60°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak turlari va burchaklar yig'indisi qoidasidan foydalanib, masalalar yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallelogramm-romb-trapetsiya", title: "13. Parallelogramm, romb va trapetsiya", page: "132-bet",
              sections: [
                secText("Eslang",
                  "<p>To'rtburchak — to'rtta tomon va to'rtta burchakka ega shakl. Uning ichki burchaklari yig'indisi 360° ga teng.</p>"
                ),
                secText("Parallelogramm, romb va trapetsiyaning xossalari",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='70' viewBox='0 0 260 70'>" +
                      "<polygon points='10,60 70,60 90,10 30,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='120,60 150,10 180,60 150,60' fill='none' stroke='none'/>" +
                      "<polygon points='135,35 150,10 165,35 150,60' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<polygon points='195,60 245,60 230,10 210,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> parallelogrammda qarama-qarshi tomonlar parallel va teng; rombda barcha tomonlar teng (parallelogrammning xususiy holati); trapetsiyada faqat bitta juft tomon (asoslar) parallel bo'ladi.</div>"
                ),
                secText("To'rtburchaklarni chizish",
                  "<p>To'rtburchakni chizish uchun uning tomonlari va burchaklari haqidagi ma'lumotlardan foydalaniladi — masalan parallelogrammda qarama-qarshi tomonlar teng va parallel bo'lishi hisobga olinadi.</p>"
                ),
                secText("To'rtburchakning noma'lum burchaklarini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> to'rtburchakning ichki burchaklari yig'indisi 360° ga teng; parallelogrammda qo'shni burchaklar yig'indisi 180° ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> parallelogrammning bitta burchagi 65° bo'lsa, unga qo'shni burchak: 180° − 65° = 115°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Parallelogramm, romb va trapetsiya xossalarini qo'llab, noma'lum tomon va burchaklarni topasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            }
          ]
        }
      ]
    },
    {
      id: "6",
      name: "6-sinf",
      subjects: [
        {
          id: "matematika",
          name: "Matematika",
          topics: [
            {
              id: "algebra", title: "1. Algebra", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>5-sinfda o'rgangan to'rt amal (qo'shish, ayirish, ko'paytirish, bo'lish) va amallar tartibi qoidalari algebraik ifodalarda ham xuddi shunday qo'llanadi — faqat sonlar o'rnida harflar ham qatnashadi.</p>"
                ),
                secText("Algebraik ifodalar",
                  "<p>Noma'lum yoki o'zgaruvchi sonni ifodalash uchun harflardan (masalan x, a, n) foydalaniladi. Harf va sonlardan tuzilgan ifoda algebraik ifoda deyiladi.</p>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> harf oldida turgan son koeffitsient deyiladi. Masalan 3x ifodasida 3 — koeffitsient, x — o'zgaruvchi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2a + 7 ifodasi «a ning ikki bahosiga 7 qo'shilgan» degan ma'noni bildiradi.</div>"
                ),
                secText("Algebraik ifodalarni soddalashtirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir xil harfga ega hadlar (o'xshash hadlar) qo'shiladi yoki ayiriladi — bunda faqat koeffitsientlar ustida amal bajariladi, harf o'zgarmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x + 5x = 8x; &nbsp; 4a + 3 − a = 3a + 3.</div>"
                ),
                secText("Algebraik ifodalarning qiymatini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ifodaning qiymatini topish uchun harf o'rniga berilgan sonni qo'yib, amallarni bajaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2x + 3 ifodasida x = 4 bo'lsa: 2 × 4 + 3 = 11.</div>"
                ),
                secText("Tenglamalarni yechish",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<line x1='100' y1='15' x2='100' y2='40' stroke='#1f2433' stroke-width='3'/>" +
                      "<line x1='30' y1='40' x2='170' y2='40' stroke='#1f2433' stroke-width='3'/>" +
                      "<ellipse cx='50' cy='70' rx='42' ry='16' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<ellipse cx='150' cy='70' rx='42' ry='16' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='50' y='75' font-size='13' text-anchor='middle' fill='#4f5bd5'>x + 7</text>" +
                      "<text x='150' y='75' font-size='13' text-anchor='middle' fill='#16a394'>15</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamaning ikkala tomoniga bir xil amalni (qo'shish, ayirish, ko'paytirish yoki bo'lish) qo'llasak, tenglik saqlanadi. Shu yordamida noma'lumni yolg'iz qoldiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x + 7 = 15. Ikkala tomondan 7 ni ayiramiz: x = 15 − 7 = 8.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Algebraik ifoda va tenglama qoidalarini ko'p bosqichli masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "oddiy-kasrlar", title: "2. Oddiy kasrlar", page: "25-bet",
              sections: [
                secText("Eslang",
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='45' viewBox='0 0 180 45'>" +
                      "<rect x='5' y='5' width='170' height='35' rx='6' fill='none' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='48' y1='5' x2='48' y2='40' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='91' y1='5' x2='91' y2='40' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='134' y1='5' x2='134' y2='40' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<rect x='5' y='5' width='43' height='35' rx='6' fill='#eef0fb'/>" +
                      "<rect x='48' y='5' width='43' height='35' fill='#eef0fb'/>" +
                    "</svg>" +
                  "</div>" +
                  "<p>5-sinfda kasrlarni qo'shish, ayirish va ko'paytirishni o'rgangan edingiz. Endi kasrlarni bo'lishni o'rganasiz.</p>"
                ),
                secText("To'g'ri kasrni natural songa bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kasrni natural songa bo'lish uchun kasrning maxraji shu songa ko'paytiriladi, surat o'zgarmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2/3 : 4 = 2/(3×4) = 2/12 = 1/6.</div>"
                ),
                secText("Natural sonni to'g'ri kasrga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> natural sonni kasrga bo'lish — shu songa kasrning «teskarisini» (surat va maxrajini almashtirilgan holini) ko'paytirish bilan bir xil: a : (b/c) = a × (c/b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 : 2/5 = 3 × 5/2 = 15/2 = 7 va 1/2.</div>"
                ),
                secText("To'g'ri kasrni to'g'ri kasrga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> a/b : c/d = a/b × d/c — ikkinchi kasrning teskarisiga ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2/3 : 3/4 = 2/3 × 4/3 = 8/9.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> 3/4 kg shakar 6 ta paketga baravar bo'lindi. Har bir paketda qancha shakar bor? 3/4 : 6 = 3/24 = 1/8 kg.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Kasrlarni bo'lish qoidalarini ko'p bosqichli masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "takrorlash-1", title: "Takrorlash", page: "49-bet",
              lecture: { text: "Ushbu bo'lim «Algebra» va «Oddiy kasrlar» mavzularini mustahkamlash uchun aralash mashqlar to'plamidir.", embedUrl: null }, interactive: null, test: null
            },
            {
              id: "nisbatlar", title: "3. Nisbatlar", page: "51-bet",
              sections: [
                secText("Eslang",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='40' viewBox='0 0 200 40'>" +
                      "<rect x='0' y='5' width='80' height='30' fill='#4f5bd5'/>" +
                      "<rect x='84' y='5' width='40' height='30' fill='#16a394'/>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Nisbat — ikkita miqdorni taqqoslash usuli: a : b ko'rinishida yoziladi va a ning b ga necha marta katta yoki kichikligini ko'rsatadi.</p>"
                ),
                secText("Nisbat va kasr",
                  "<div class='lecture-rule'><strong>Qoida:</strong> a : b nisbatni a/b kasri ko'rinishida ham yozish mumkin.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 : 4 = 3/4.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Sinfda o'g'il va qizlar soni nisbati 4 : 5. Agar 27 o'quvchi bo'lsa, nechta qiz bor? 27 : (4+5) = 3 (bitta ulush), qizlar: 5 × 3 = 15 ta.</div>"
                ),
                secText("Uch miqdor nisbati",
                  "<div class='lecture-rule'><strong>Qoida:</strong> uchta miqdor ham a : b : c ko'rinishida taqqoslanadi; jami miqdorni ulushlar yig'indisiga bo'lib, bitta ulushni topib, har biriga ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> uchta do'stning puli 2 : 3 : 5 nisbatda, jami 100 000 so'm. Ulush: 100 000 : 10 = 10 000. Ulushlar: 20 000, 30 000, 50 000 so'm.</div>"
                ),
                secText("O'zgaruvchan nisbatlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ikki miqdor to'g'ri proporsional bo'lsa, biri necha marta oshsa, ikkinchisi ham shuncha marta oshadi — nisbat o'zi o'zgarmay qoladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2 kg olma 16 000 so'm bo'lsa, nisbat 2:16000=1:8000. 5 kg uchun: 5 × 8000 = 40 000 so'm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Nisbat va proporsionallik qoidalarini turli real hayotiy masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "foizlar", title: "4. Foizlar", page: "83-bet",
              sections: [
                secText("Eslang",
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='40' viewBox='0 0 160 40'>" +
                      "<rect x='0' y='5' width='160' height='30' rx='6' fill='#f6f7fb' stroke='#e5e7f0'/>" +
                      "<rect x='0' y='5' width='48' height='30' rx='6' fill='#4f5bd5'/>" +
                      "<text x='24' y='25' font-size='12' fill='#fff' text-anchor='middle'>30%</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>5-sinfda miqdorning foizini topishni o'rgangan edingiz: miqdor × foiz/100. Endi teskari masalalarni — foiz orqali sonning o'zini topishni o'rganasiz.</p>"
                ),
                secText("Foizi va qismiga ko'ra sonning o'zini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar sonning n% i m ga teng bo'lsa, sonning o'zi: m ÷ n × 100.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> bir sonning 20% i 30 ga teng. Son: 30 ÷ 20 × 100 = 150.</div>"
                ),
                secText("O'sish foizi va kamayish foizini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> foiz o'zgarishi = (o'zgarish miqdori ÷ dastlabki miqdor) × 100%.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> narx 200 000 so'mdan 250 000 so'mga oshdi. O'sish: (50 000 ÷ 200 000) × 100% = 25%.</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Tovar narxi 15% qimmatlab, 46 000 so'm bo'ldi. Dastlabki narx qancha edi? 46 000 dastlabki narxning 115% i, ya'ni dastlabki narx = 46 000 ÷ 115 × 100 = 40 000 so'm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Teskari foiz masalalarini narx, o'sish va kamayish holatlarida yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "takrorlash-2", title: "Takrorlash", page: "113-bet",
              lecture: { text: "Ushbu bo'lim «Nisbatlar» va «Foizlar» mavzularini mustahkamlash uchun aralash mashqlar to'plamidir.", embedUrl: null }, interactive: null, test: null
            },
            {
              id: "geometrik-burchaklar", title: "5. Geometrik shakllardagi burchaklar", page: "115-bet",
              sections: [
                secText("Eslang",
                  "<p>5-sinfda o'rgangan asosiy qoidalar: to'g'ri chiziqdagi ikki burchak yig'indisi 180°, nuqta atrofidagi burchaklar yig'indisi 360°, uchburchak ichki burchaklari yig'indisi 180°.</p>"
                ),
                secText("Geometrik shakllardagi noma'lum burchaklarni topish",
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='110' viewBox='0 0 160 110'>" +
                      "<polygon points='10,100 150,100 150,10 10,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='25' y='30' font-size='12' fill='#4f5bd5'>80°</text>" +
                      "<text x='115' y='30' font-size='12' fill='#4f5bd5'>95°</text>" +
                      "<text x='25' y='95' font-size='12' fill='#4f5bd5'>60°</text>" +
                      "<text x='110' y='95' font-size='12' fill='#16a394'>?</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> to'rtburchakning ichki burchaklari yig'indisi 360° ga teng. Uchta burchak ma'lum bo'lsa, to'rtinchisi 360° dan ularning yig'indisini ayirib topiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> to'rtburchakning uchta burchagi 80°, 95°, 60° bo'lsa, to'rtinchisi: 360° − (80+95+60) = 125°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Turli geometrik shakllardagi (uchburchak, to'rtburchak) noma'lum burchaklarni topish masalalarini yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "doira-aylana", title: "6. Doira va aylana", page: "127-bet",
              sections: [
                secText("Eslang",
                  "<p>Yopiq egri chiziq bilan chegaralangan tekis shakllar orasida doira alohida o'rin tutadi — u markazdan bir xil masofadagi nuqtalardan iborat.</p>"
                ),
                secText("Doira va aylana elementlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='140' height='140' viewBox='0 0 140 140'>" +
                      "<circle cx='70' cy='70' r='60' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='70' y1='70' x2='130' y2='70' stroke='#16a394' stroke-width='2'/>" +
                      "<circle cx='70' cy='70' r='3' fill='#1f2433'/>" +
                      "<text x='95' y='63' font-size='11' fill='#16a394'>r</text>" +
                      "<line x1='10' y1='70' x2='130' y2='70' stroke='#4f5bd5' stroke-width='1' stroke-dasharray='3,3'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> aylana — chegara chizig'i, doira — aylana bilan chegaralangan ichki yuza. Markazdan aylanagacha bo'lgan masofa — radius (r); markazdan o'tib aylananing ikki nuqtasini tutashtiruvchi kesma — diametr (d = 2r).</div>"
                ),
                secText("Aylananing uzunligi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> C = 2πr yoki C = πd (π ≈ 3,14).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> r = 7 sm bo'lsa, C = 2 × 3,14 × 7 = 43,96 sm.</div>"
                ),
                secText("Yarim va chorak doira perimetri",
                  "<div class='lecture-rule'><strong>Qoida:</strong> yarim doira perimetri = aylananing yarmi + diametr; chorak doira perimetri = aylananing choragi + 2 × radius.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> r = 7 sm bo'lgan yarim doira perimetri: 43,96 : 2 + 14 = 21,98 + 14 = 35,98 sm.</div>"
                ),
                secText("Doiraning yuzi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> S = πr².</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> r = 5 sm bo'lsa, S = 3,14 × 5 × 5 = 78,5 sm².</div>"
                ),
                secText("Yarim va chorak doira yuzi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> yarim doira yuzi — doira yuzining yarmi; chorak doira yuzi — doira yuzining chorak qismi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> r = 5 sm bo'lgan chorak doira yuzi: 78,5 : 4 = 19,625 sm².</div>"
                ),
                secText("Murakkab shakllarning yuzi va perimetri",
                  "<div class='lecture-rule'><strong>Qoida:</strong> murakkab shakl (masalan to'g'ri to'rtburchak + yarim doira) oddiy shakllarga bo'linib, har birining yuzi alohida topilib, so'ng qo'shiladi (yoki ayiriladi).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> tomoni 10 sm bo'lgan kvadrat ustiga radiusi 5 sm bo'lgan yarim doira qo'yilgan shaklning yuzi: 10×10 + 78,5:2 = 100 + 39,25 = 139,25 sm².</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Aylana va doira formulalarini turli murakkab shakllarga oid masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "takrorlash-3", title: "Takrorlash", page: "163-bet",
              lecture: { text: "Ushbu bo'lim «Geometrik shakllardagi burchaklar» va «Doira va aylana» mavzularini mustahkamlash uchun aralash mashqlar to'plamidir.", embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tezlik", title: "7. Tezlik", page: "2-qism, 1-bet",
              sections: [
                secText("Eslang",
                  "<p>5-sinfda me'yor tushunchasini o'rgangan edingiz: me'yor = umumiy miqdor ÷ birliklar soni. Tezlik ham bir turdagi me'yor — bir birlik vaqtda bosib o'tilgan masofa.</p>"
                ),
                secText("Tezlik",
                  "<div class='lecture-figure'>" +
                    "<svg width='140' height='120' viewBox='0 0 140 120'>" +
                      "<polygon points='70,10 10,100 130,100' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='10' y1='70' x2='130' y2='70' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='50' y1='70' x2='50' y2='100' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='70' y='45' font-size='13' text-anchor='middle' fill='#1f2433'>s</text>" +
                      "<text x='30' y='88' font-size='13' text-anchor='middle' fill='#16a394'>v</text>" +
                      "<text x='90' y='88' font-size='13' text-anchor='middle' fill='#16a394'>t</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> tezlik = masofa ÷ vaqt (v = s : t). Birliklari: km/soat, m/soniya.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 150 km yo'lni 3 soatda bosib o'tgan mashinaning tezligi: 150 : 3 = 50 km/soat.</div>"
                ),
                secText("Tezlik, bosib o'tilgan masofa va vaqtni topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> uchburchakdagi kabi: s = v × t; &nbsp; v = s : t; &nbsp; t = s : v.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> tezligi 60 km/soat bo'lgan mashina 2,5 soatda qancha yo'l bosadi? s = 60 × 2,5 = 150 km.</div>"
                ),
                secText("Ikki xil tezlikdagi harakatga doir matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Piyoda 2 soat 4 km/soat tezlikda, keyin 1 soat 5 km/soat tezlikda yurdi. Jami masofa: 2×4 + 1×5 = 8+5 = 13 km.</div>"
                ),
                secText("O'rtacha tezlik",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'rtacha tezlik = jami masofa ÷ jami vaqt. Diqqat: bu ikkita tezlikning oddiy o'rtachasiga teng bo'lmasligi mumkin!</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> yuqoridagi misolda jami masofa 13 km, jami vaqt 3 soat. O'rtacha tezlik: 13 : 3 ≈ 4,33 km/soat.</div>"
                ),
                secText("Ikkita jism harakatiga doir matnli masalalar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir-biriga qarab harakatlanuvchi ikki jism tezliklari qo'shiladi (yaqinlashish tezligi); bir yo'nalishda ketayotgan jismlarning tezliklari orasidagi farq ular orasidagi masofaning o'zgarish tezligini beradi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ikki shahar orasidagi masofa 200 km. Bir-biriga qarab 40 km/soat va 60 km/soat tezlikda chiqqan ikki mashina necha soatda uchrashadi? 200 : (40+60) = 2 soat.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tezlik, masofa va vaqt formulalarini ikki jism ishtirok etadigan real hayotiy masalalarda qo'llaysiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/6-matematika-tezlik.html", test: null
            },
            {
              id: "hajm", title: "8. Hajm", page: "2-qism, 27-bet",
              sections: [
                secText("Eslang",
                  "<p>5-sinfda o'rgangan formula: kuboid hajmi V = uzunlik × en × balandlik; kub hajmi V = qirra³. Endi shu formuladan foydalanib, teskari masalalarni — hajm bo'yicha qirrani topishni o'rganasiz.</p>"
                ),
                secText("Kuboidning qirrasini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> noma'lum qirra = hajm ÷ (ma'lum ikki qirraning ko'paytmasi).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> hajmi 120 sm³, ikki qirrasi 6 sm va 4 sm bo'lgan kuboidning uchinchi qirrasi: 120 ÷ (6×4) = 120 ÷ 24 = 5 sm.</div>"
                ),
                secText("Kubning qirrasini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kub hajmi ma'lum bo'lsa, qirrani topish uchun «qaysi son o'z-o'ziga uch marta ko'paytirilganda shu hajmni beradi» deb so'raladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> hajmi 64 sm³ bo'lgan kubning qirrasi 4 sm, chunki 4 × 4 × 4 = 64.</div>"
                ),
                secText("Kuboid va kubning bir yog'i yuzini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kuboidning bir yog'i yuzi — shu yoqqa tegishli ikki qirraning ko'paytmasi; kubning har bir yog'i — qirra².</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> qirralari 6, 4, 5 sm bo'lgan kuboidning 6×4 li yog'i yuzi: 6 × 4 = 24 sm².</div>"
                ),
                secText("Matnli masalalar",
                  "<div class='lecture-example'><strong>Misol:</strong> Hajmi 90 sm³, asosining yuzi 15 sm² bo'lgan kuboidning balandligi qancha? Balandlik = 90 : 15 = 6 sm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Hajm formulasidan foydalanib, teskari yo'nalishda qirra va yuza topish masalalarini yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "takrorlash-4", title: "Takrorlash", page: "2-qism, 49-bet",
              lecture: { text: "Ushbu bo'lim «Tezlik» va «Hajm» mavzularini mustahkamlash uchun aralash mashqlar to'plamidir.", embedUrl: null }, interactive: null, test: null
            },
            {
              id: "doiraviy-diagrammalar", title: "9. Doiraviy diagrammalar", page: "2-qism, 51-bet",
              sections: [
                secText("Eslang",
                  "<p>Foizlar va butun doira (360°) tushunchalarini eslang — doiraviy diagramma aynan shu ikkalasiga asoslanadi.</p>"
                ),
                secText("Doiraviy diagrammada ma'lumotlarni taqdim etish",
                  "<div class='lecture-figure'>" +
                    "<svg width='120' height='120' viewBox='0 0 120 120'>" +
                      "<circle cx='60' cy='60' r='55' fill='#eef0fb'/>" +
                      "<path d='M 60 60 L 60 5 A 55 55 0 0 1 108 85 Z' fill='#4f5bd5'/>" +
                      "<path d='M 60 60 L 108 85 A 55 55 0 0 1 30 108 Z' fill='#16a394'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> doira 360° ni tashkil qiladi. Har bir toifaning ulushini gradusga o'tkazish uchun: gradus = foiz × 3,6 (chunki 360 ÷ 100 = 3,6).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 25% lik ulush diagrammada: 25 × 3,6 = 90° li sektor bilan tasvirlanadi.</div>"
                ),
                secText("Doiraviy diagrammalardagi ma'lumotlarni o'qish va talqin qilish",
                  "<div class='lecture-example'><strong>Misol:</strong> Diagrammada «futbol» sektori 40% ni tashkil qiladi. Agar so'ralgan 150 kishidan shu ulush futbolni yoqtirsa: 150 × 40/100 = 60 kishi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Doiraviy diagrammadagi foiz va gradus ma'lumotlaridan real sonlarni hisoblab topasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "fazoviy-jismlar", title: "10. Fazoviy jismlar va ularning yoyilmalari", page: "2-qism, 73-bet",
              sections: [
                secText("Eslang",
                  "<p>5-sinfda kub va kuboid (to'g'ri burchakli parallelepiped) bilan tanishgan edingiz. Endi boshqa fazoviy shakllar bilan tanishasiz.</p>"
                ),
                secText("Konus, silindr, prizma va piramida",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='70' viewBox='0 0 260 70'>" +
                      "<polygon points='30,60 50,10 70,60' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<ellipse cx='120' cy='55' rx='20' ry='8' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<rect x='100' y='10' width='40' height='45' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='170,60 210,60 225,10 185,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='240,60 235,20 255,20' fill='none' stroke='none'/>" +
                      "<polygon points='230,60 260,60 245,10' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> konus — bitta doira asos va uchga tomon torayuvchi yon sirtdan iborat; silindr — ikkita teng doira asos va egri yon sirtdan iborat; prizma — ikkita teng ko'pburchak asos va to'rtburchak yon yoqlardan iborat; piramida — bitta ko'pburchak asos va uchga tomon yig'iluvchi uchburchak yon yoqlardan iborat.</div>"
                ),
                secText("Uch o'lchamli panjarada fazoviy jismlarni chizish",
                  "<p>Fazoviy jismlarni qog'ozda tasvirlash uchun uzunlik, kenglik va balandlik yo'nalishlari ko'rsatilgan maxsus (izometrik) panjaradan foydalaniladi — bu jismning barcha qirralarini to'g'ri nisbatda chizishga yordam beradi.</p>"
                ),
                secText("Fazoviy jismlarning yoyilmasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> fazoviy jismning barcha yoqlarini tekislikka yoyib chizish uning yoyilmasi (net) deyiladi. Har bir jism yig'ilganda aynan o'sha jismni hosil qiladigan o'ziga xos yoyilmaga ega.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Turli fazoviy jismlarning yoyilmasini aniqlash va ularni bir-biridan farqlash masalalarini yechasiz.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/5-matematika-hajm.html", test: null
            },
            {
              id: "takrorlash-5", title: "Takrorlash", page: "2-qism, 91-bet",
              lecture: { text: "Ushbu bo'lim «Doiraviy diagrammalar» va «Fazoviy jismlar va ularning yoyilmalari» mavzularini mustahkamlash uchun aralash mashqlar to'plamidir.", embedUrl: null }, interactive: null, test: null
            },
            {
              id: "umumiy-takrorlash", title: "Umumiy takrorlash", page: "2-qism, 95-bet",
              lecture: { text: "6-sinf davomida o'tilgan barcha mavzular bo'yicha yakuniy aralash mashqlar to'plami.", embedUrl: null }, interactive: null, test: null
            }
          ]
        }
      ]
    },
    {
      id: "7",
      name: "7-sinf",
      subjects: [
        {
          id: "matematika-2026",
          name: "Matematika (2026-yil)",
          topics: [
            {
              id: "tub-sonlar-daraja", title: "1.1 Tub sonlar, tub ko'paytuvchilarga ajratish va daraja", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Har bir natural son o'zining bo'luvchilariga ega. <strong>Bo'luvchi</strong> — berilgan sonni qoldiqsiz bo'ladigan son. Masalan, 12 sonining bo'luvchilari: 1, 2, 3, 4, 6, 12.</p>"
                ),
                secText("Tub va murakkab sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> faqat 1 ga va o'ziga bo'linadigan (ya'ni aynan ikkita bo'luvchisi bor) 1 dan katta natural son <strong>tub son</strong> deyiladi. Ikkitadan ortiq bo'luvchisi bor son <strong>murakkab son</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2, 3, 5, 7, 11, 13, 17, 19 — tub sonlar. 4, 6, 8, 9, 10, 12 — murakkab sonlar. 1 soni na tub, na murakkab.</div>"
                ),
                secText("Tub ko'paytuvchilarga ajratish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har qanday murakkab sonni tub sonlarning ko'paytmasi ko'rinishida yozish mumkin. Buning uchun sonni eng kichik tub bo'luvchisiga ketma-ket bo'lib boramiz.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='150' viewBox='0 0 200 150'>" +
                      "<text x='100' y='18' font-size='14' text-anchor='middle' fill='#1f2433'>60</text>" +
                      "<line x1='95' y1='24' x2='60' y2='44' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='105' y1='24' x2='140' y2='44' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='55' y='58' font-size='13' text-anchor='middle' fill='#16a394'>2</text>" +
                      "<text x='145' y='58' font-size='14' text-anchor='middle' fill='#1f2433'>30</text>" +
                      "<line x1='140' y1='64' x2='110' y2='84' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='150' y1='64' x2='180' y2='84' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='105' y='98' font-size='13' text-anchor='middle' fill='#16a394'>2</text>" +
                      "<text x='185' y='98' font-size='14' text-anchor='middle' fill='#1f2433'>15</text>" +
                      "<line x1='180' y1='104' x2='150' y2='124' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='190' y1='104' x2='195' y2='124' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='145' y='138' font-size='13' text-anchor='middle' fill='#16a394'>3</text>" +
                      "<text x='195' y='138' font-size='13' text-anchor='middle' fill='#16a394'>5</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 60 = 2 · 2 · 3 · 5 = 2<sup>2</sup> · 3 · 5.</div>"
                ),
                secText("Daraja",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir xil ko'paytuvchilarning ko'paytmasi <strong>daraja</strong> ko'rinishida yoziladi: a<sup>n</sup> = a · a · … · a (n ta ko'paytuvchi). Bunda a — <strong>asos</strong>, n — <strong>ko'rsatkich</strong>.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2<sup>5</sup> = 2·2·2·2·2 = 32; &nbsp; 10<sup>3</sup> = 1000.</div>"
                ),
                secText("Darajaning xossalari",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>; &nbsp; a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup>; &nbsp; (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>; &nbsp; (ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup>; &nbsp; a<sup>0</sup> = 1 (a ≠ 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3<sup>2</sup> · 3<sup>4</sup> = 3<sup>6</sup> = 729; &nbsp; (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup> = 64.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki xonali eng katta sonni tub ko'paytuvchilarga ajrating. Uning nechta bo'luvchisi bor? (Maslahat: agar son p<sup>a</sup>·q<sup>b</sup> ko'rinishida bo'lsa, bo'luvchilari soni (a+1)(b+1) ga teng.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ekub", title: "1.2 Eng katta umumiy bo'luvchi (EKUB)", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Ikki sonning har ikkisini ham qoldiqsiz bo'ladigan son ularning <strong>umumiy bo'luvchisi</strong> deyiladi. Masalan, 12 va 18 ning umumiy bo'luvchilari: 1, 2, 3, 6.</p>"
                ),
                secText("EKUB ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> berilgan sonlarning barcha umumiy bo'luvchilari ichida eng kattasi <strong>eng katta umumiy bo'luvchi</strong> (EKUB) deyiladi va EKUB(a; b) kabi belgilanadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> EKUB(12; 18) = 6.</div>"
                ),
                secText("EKUB ni tub ko'paytuvchilar orqali topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlarni tub ko'paytuvchilarga ajratamiz. EKUB — <em>umumiy</em> tub ko'paytuvchilarni <em>eng kichik</em> darajalarda olib ko'paytirish natijasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 24 = 2<sup>3</sup>·3, &nbsp; 36 = 2<sup>2</sup>·3<sup>2</sup>. Umumiylari: 2<sup>2</sup> va 3. EKUB(24; 36) = 2<sup>2</sup>·3 = 12.</div>"
                ),
                secText("O'zaro tub sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> EKUB(a; b) = 1 bo'lsa, a va b <strong>o'zaro tub sonlar</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 8 va 15 — o'zaro tub, chunki umumiy tub ko'paytuvchisi yo'q.</div>"
                ),
                secText("Tatbiqi — kasrni qisqartirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 24/36 kasrni qisqartirish uchun surat va maxrajni EKUB(24; 36) = 12 ga bo'lamiz: 24/36 = 2/3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bog'da 48 ta olma va 36 ta nok bor. Ularni bir xil sonli, imkon qadar ko'p savatga baravar joylashtirmoqchimiz. Nechta savat kerak va har birida nechtadan meva bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ekuk", title: "1.3 Eng kichik umumiy karrali (EKUK)", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Sonning <strong>karralilari</strong> — uni butun songa ko'paytirishdan hosil bo'ladigan sonlar. Masalan, 4 ning karralilari: 4, 8, 12, 16, 20, 24, …</p>"
                ),
                secText("EKUK ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> berilgan sonlarning umumiy karralilari ichida eng kichigi (noldan farqli) <strong>eng kichik umumiy karrali</strong> (EKUK) deyiladi: EKUK(a; b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4 ning karralilari: 4, 8, <strong>12</strong>, … &nbsp; 6 ning karralilari: 6, <strong>12</strong>, … &nbsp; EKUK(4; 6) = 12.</div>"
                ),
                secText("EKUK ni tub ko'paytuvchilar orqali topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlarni tub ko'paytuvchilarga ajratamiz. EKUK — uchraydigan <em>barcha</em> tub ko'paytuvchilarni <em>eng katta</em> darajalarda olib ko'paytirish natijasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 8 = 2<sup>3</sup>, &nbsp; 12 = 2<sup>2</sup>·3. EKUK(8; 12) = 2<sup>3</sup>·3 = 24.</div>"
                ),
                secText("EKUB va EKUK orasidagi bog'lanish",
                  "<div class='lecture-rule'><strong>Formula:</strong> EKUB(a; b) · EKUK(a; b) = a · b.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a = 8, b = 12: EKUB = 4, EKUK = 24; &nbsp; 4·24 = 96 = 8·12.</div>"
                ),
                secText("Tatbiqi — kasrlarni umumiy maxrajga keltirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 1/8 + 1/12 ni hisoblash uchun umumiy maxraj EKUK(8; 12) = 24: &nbsp; 3/24 + 2/24 = 5/24.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir bekatdan avtobus har 12 daqiqada, trolleybus har 18 daqiqada jo'naydi. Ular soat 8:00 da birga jo'nadi. Keyingi safar qachon birga jo'naydi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kvadrat-kub-ildiz", title: "1.4 Sonning kvadrat ildizi va kub ildizi", page: "1-bet",
              sections: [
                secText("Eslang",
                  "<p>Sonning <strong>kvadrati</strong> — uni o'ziga ko'paytirish: a<sup>2</sup> = a·a. Sonning <strong>kubi</strong> — a<sup>3</sup> = a·a·a. Masalan, 7<sup>2</sup> = 49, &nbsp; 4<sup>3</sup> = 64.</p>"
                ),
                secText("Kvadrat ildiz",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> manfiy bo'lmagan a soni uchun kvadrati a ga teng bo'lgan manfiy bo'lmagan son a ning <strong>kvadrat ildizi</strong> deyiladi: √a. Ya'ni (√a)<sup>2</sup> = a.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √49 = 7, chunki 7<sup>2</sup> = 49; &nbsp; √0 = 0; &nbsp; √1 = 1. Manfiy sondan kvadrat ildiz chiqmaydi.</div>"
                ),
                secText("To'liq kvadratlar",
                  "<div class='lecture-figure'><table style='border-collapse:collapse;text-align:center;font-size:.8rem;'>" +
                    "<tr style='color:#6b7280;'><td style='padding:4px 8px;'>n</td><td style='padding:4px 8px;'>1</td><td style='padding:4px 8px;'>2</td><td style='padding:4px 8px;'>3</td><td style='padding:4px 8px;'>4</td><td style='padding:4px 8px;'>5</td><td style='padding:4px 8px;'>6</td><td style='padding:4px 8px;'>7</td><td style='padding:4px 8px;'>8</td><td style='padding:4px 8px;'>9</td><td style='padding:4px 8px;'>10</td></tr>" +
                    "<tr style='font-weight:700;color:#4f5bd5;'><td style='padding:4px 8px;'>n<sup>2</sup></td><td style='padding:4px 8px;'>1</td><td style='padding:4px 8px;'>4</td><td style='padding:4px 8px;'>9</td><td style='padding:4px 8px;'>16</td><td style='padding:4px 8px;'>25</td><td style='padding:4px 8px;'>36</td><td style='padding:4px 8px;'>49</td><td style='padding:4px 8px;'>64</td><td style='padding:4px 8px;'>81</td><td style='padding:4px 8px;'>100</td></tr>" +
                  "</table></div>"
                ),
                secText("Kub ildiz",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kubi a ga teng bo'lgan son a ning <strong>kub ildizi</strong> deyiladi: <sup>3</sup>√a. Ya'ni (<sup>3</sup>√a)<sup>3</sup> = a. Kub ildiz manfiy sondan ham chiqadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> <sup>3</sup>√27 = 3; &nbsp; <sup>3</sup>√(−8) = −2, chunki (−2)<sup>3</sup> = −8.</div>"
                ),
                secText("Aniq bo'lmagan ildizlar",
                  "<p>Agar son to'liq kvadrat (yoki kub) bo'lmasa, ildiz butun yoki oddiy kasr bilan ifodalanmaydi — u <strong>irratsional</strong> sondir.</p>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 ≈ 1,414… &nbsp; 1 va 2 orasida: 1<sup>2</sup> = 1 &lt; 2 &lt; 4 = 2<sup>2</sup>, demak 1 &lt; √2 &lt; 2.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tomoni butun son bo'lgan kvadratning yuzi 144 cm<sup>2</sup>. Tomoni qancha? Endi yuzi 200 cm<sup>2</sup> bo'lsa, tomonini butun songacha yaxlitlab ayting.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "manfiy-son-sonlar-oqi", title: "2.1 Manfiy son tushunchasi va sonlar o'qi", page: "27/31-bet",
              sections: [
                secText("Eslang",
                  "<p>Hozirgacha 0 va undan katta sonlar bilan ishladingiz. Ammo harorat 0° dan pastga tushishi, hisobda qarz bo'lishi mumkin. Bularni ifodalash uchun <strong>manfiy sonlar</strong> kiritiladi.</p>"
                ),
                secText("Sonlar o'qi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> boshi (0), yo'nalishi va birlik kesmasi ko'rsatilgan to'g'ri chiziq <strong>sonlar o'qi</strong> deyiladi. 0 dan o'ngda musbat, chapda manfiy sonlar joylashadi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='320' height='60' viewBox='0 0 320 60'>" +
                      "<line x1='10' y1='30' x2='310' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='310,30 300,25 300,35' fill='#1f2433'/>" +
                      "<polygon points='10,30 20,25 20,35' fill='#1f2433'/>" +
                      "<g font-size='11' text-anchor='middle' fill='#1f2433'>" +
                        "<line x1='40' y1='25' x2='40' y2='35' stroke='#1f2433' stroke-width='2'/><text x='40' y='50'>−4</text>" +
                        "<line x1='80' y1='25' x2='80' y2='35' stroke='#1f2433' stroke-width='2'/><text x='80' y='50'>−3</text>" +
                        "<line x1='120' y1='25' x2='120' y2='35' stroke='#1f2433' stroke-width='2'/><text x='120' y='50'>−2</text>" +
                        "<line x1='160' y1='25' x2='160' y2='35' stroke='#1f2433' stroke-width='2'/><text x='160' y='50'>−1</text>" +
                        "<circle cx='200' cy='30' r='4' fill='#4f5bd5'/><text x='200' y='50' fill='#4f5bd5'>0</text>" +
                        "<line x1='240' y1='25' x2='240' y2='35' stroke='#1f2433' stroke-width='2'/><text x='240' y='50'>1</text>" +
                        "<line x1='280' y1='25' x2='280' y2='35' stroke='#1f2433' stroke-width='2'/><text x='280' y='50'>2</text>" +
                      "</g>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Qarama-qarshi sonlar va modul",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> 0 dan bir xil uzoqlikda, turli tomonda yotgan sonlar <strong>qarama-qarshi</strong> sonlar (a va −a). Sonning 0 gacha bo'lgan masofasi uning <strong>moduli</strong> deyiladi: |a|.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> |−5| = 5, &nbsp; |5| = 5, &nbsp; |0| = 0. 7 ning qarama-qarshisi −7.</div>"
                ),
                secText("Butun sonlarni taqqoslash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonlar o'qida chaproqda turgan son kichik, o'ngroqda turgani katta. Har qanday manfiy son har qanday musbat sondan kichik; 0 dan ham kichik.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −5 &lt; −2, &nbsp; −1 &lt; 0 &lt; 3, &nbsp; −100 &lt; 1.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Kunduzi harorat +3°, kechasi −8° bo'ldi. Harorat necha gradusga o'zgardi? Sonlar o'qida bu o'zgarishni ko'rsating.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "butun-sonlar-qoshish-ayirish", title: "2.2 Butun sonlarni qo'shish va ayirish", page: "27/31-bet",
              sections: [
                secText("Bir xil ishorali sonlarni qo'shish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ishoralari bir xil bo'lgan sonlarni qo'shish uchun modullarini qo'shamiz, natijaga umumiy ishorani qo'yamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −3 + (−5) = −(3 + 5) = −8; &nbsp; 4 + 6 = 10.</div>"
                ),
                secText("Har xil ishorali sonlarni qo'shish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> katta modulidan kichik modulini ayiramiz, natijaga moduli katta bo'lgan sonning ishorasini qo'yamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −7 + 4 = −(7 − 4) = −3; &nbsp; 9 + (−2) = 7; &nbsp; −6 + 6 = 0.</div>"
                ),
                secText("Ayirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sonni ayirish — uning qarama-qarshisini qo'shish bilan bir xil: a − b = a + (−b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 − (−3) = 5 + 3 = 8; &nbsp; −4 − 7 = −4 + (−7) = −11; &nbsp; −2 − (−9) = −2 + 9 = 7.</div>"
                ),
                secText("Sonlar o'qida qo'shish",
                  "<div class='lecture-figure'>" +
                    "<svg width='320' height='70' viewBox='0 0 320 70'>" +
                      "<line x1='10' y1='45' x2='310' y2='45' stroke='#1f2433' stroke-width='2'/>" +
                      "<g font-size='11' text-anchor='middle' fill='#1f2433'>" +
                        "<line x1='60' y1='40' x2='60' y2='50' stroke='#1f2433' stroke-width='2'/><text x='60' y='64'>−2</text>" +
                        "<line x1='120' y1='40' x2='120' y2='50' stroke='#1f2433' stroke-width='2'/><text x='120' y='64'>0</text>" +
                        "<line x1='180' y1='40' x2='180' y2='50' stroke='#1f2433' stroke-width='2'/><text x='180' y='64'>2</text>" +
                        "<line x1='240' y1='40' x2='240' y2='50' stroke='#1f2433' stroke-width='2'/><text x='240' y='64'>4</text>" +
                      "</g>" +
                      "<path d='M120 30 Q150 8 180 30' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<polygon points='180,30 172,26 174,34' fill='#16a394'/>" +
                      "<path d='M180 30 Q210 8 240 30' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<polygon points='240,30 232,26 234,34' fill='#16a394'/>" +
                      "<text x='180' y='18' font-size='11' text-anchor='middle' fill='#16a394'>0 + 2 + 2 = 4</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Musbat sonni qo'shish — o'ngga siljish, manfiy sonni qo'shish — chapga siljish.</p>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Liftda odam 7-qavatdan 3 qavat pastga, keyin 8 qavat yuqoriga, so'ng 2 qavat pastga chiqdi. U nechanchi qavatda? Amalni butun sonlar qo'shindisi ko'rinishida yozing.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "butun-sonlar-kopaytirish-bolish", title: "2.3 Butun sonlarni ko'paytirish, bo'lish va ular ustida amallar", page: "27/31-bet",
              sections: [
                secText("Ishoralar qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ishoralari <em>bir xil</em> ikki sonning ko'paytmasi (va bo'linmasi) — <strong>musbat</strong>; ishoralari <em>har xil</em> bo'lsa — <strong>manfiy</strong>.</div>" +
                  "<div class='lecture-figure'><table style='border-collapse:collapse;text-align:center;font-weight:700;font-size:.85rem;'>" +
                    "<tr><td style='padding:6px 12px;'>(+)·(+) = +</td><td style='padding:6px 12px;'>(−)·(−) = +</td></tr>" +
                    "<tr><td style='padding:6px 12px;'>(+)·(−) = −</td><td style='padding:6px 12px;'>(−)·(+) = −</td></tr>" +
                  "</table></div>"
                ),
                secText("Ko'paytirish",
                  "<div class='lecture-example'><strong>Misol:</strong> −4 · 6 = −24; &nbsp; −5 · (−3) = 15; &nbsp; 7 · (−2) = −14; &nbsp; a · 0 = 0.</div>"
                ),
                secText("Bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bo'lishda ham xuddi shu ishoralar qoidasi ishlaydi. 0 ga bo'lish mumkin emas.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −20 : 4 = −5; &nbsp; −18 : (−3) = 6; &nbsp; 15 : (−5) = −3.</div>"
                ),
                secText("Bir nechta ko'paytuvchi va daraja",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'paytmadagi manfiy ko'paytuvchilar soni <em>juft</em> bo'lsa natija musbat, <em>toq</em> bo'lsa manfiy.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (−1)·(−2)·(−3) = −6 (toq); &nbsp; (−2)<sup>4</sup> = 16; &nbsp; (−2)<sup>3</sup> = −8.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(−1)<sup>2026</sup> + (−1)<sup>2027</sup> ifodaning qiymatini hisoblang. Umuman, (−1)<sup>n</sup> qiymati n ning qanday bo'lishiga bog'liq?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ratsional-irratsional-haqiqiy-sonlar", title: "2.4 Ratsional, irratsional va haqiqiy sonlar", page: "27/31-bet",
              sections: [
                secText("Ratsional sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> p/q ko'rinishida (p — butun son, q — natural son) yozish mumkin bo'lgan son <strong>ratsional son</strong> deyiladi. Barcha butun sonlar va oddiy kasrlar ratsionaldir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 = 5/1, &nbsp; −0,75 = −3/4, &nbsp; 2⅓ = 7/3 — hammasi ratsional.</div>"
                ),
                secText("Ratsional sonning o'nli ko'rinishi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har qanday ratsional son <em>chekli</em> yoki <em>cheksiz davriy</em> o'nli kasr ko'rinishida yoziladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1/4 = 0,25 (chekli); &nbsp; 1/3 = 0,333… = 0,(3) (davriy).</div>"
                ),
                secText("Irratsional sonlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> cheksiz <em>davriy bo'lmagan</em> o'nli kasr <strong>irratsional son</strong> deyiladi. Uni p/q ko'rinishida yozib bo'lmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 = 1,41421356…, &nbsp; π = 3,14159265…, &nbsp; <sup>3</sup>√5.</div>"
                ),
                secText("Haqiqiy sonlar",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='120' viewBox='0 0 260 120'>" +
                      "<rect x='10' y='10' width='240' height='100' rx='10' fill='#f6f7fb' stroke='#1f2433'/>" +
                      "<text x='130' y='28' font-size='12' text-anchor='middle' fill='#1f2433'>Haqiqiy sonlar (R)</text>" +
                      "<rect x='25' y='38' width='140' height='60' rx='8' fill='#eef0fb' stroke='#4f5bd5'/>" +
                      "<text x='95' y='54' font-size='11' text-anchor='middle' fill='#4f5bd5'>Ratsional (Q)</text>" +
                      "<rect x='35' y='62' width='90' height='28' rx='6' fill='#e6f7f4' stroke='#16a394'/>" +
                      "<text x='80' y='80' font-size='10' text-anchor='middle' fill='#16a394'>Butun (Z)</text>" +
                      "<text x='205' y='70' font-size='11' text-anchor='middle' fill='#1f2433'>Irratsional</text>" +
                      "<text x='205' y='84' font-size='10' text-anchor='middle' fill='#1f2433'>√2, π</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ratsional va irratsional sonlar birgalikda <strong>haqiqiy sonlar</strong>ni tashkil qiladi. Sonlar o'qidagi har bir nuqtaga bitta haqiqiy son mos keladi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>0,1010010001… (har safar birlar orasida nollar soni bittaga ortadi) — bu son ratsionalmi yoki irratsionalmi? Nega?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "haqiqiy-sonlar-amallar", title: "2.5 Haqiqiy sonlar ustida amallar", page: "27/31-bet",
              sections: [
                secText("Amallarning asosiy xossalari",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a + b = b + a; &nbsp; ab = ba (o'rin almashtirish); &nbsp; (a + b) + c = a + (b + c); &nbsp; (ab)c = a(bc) (guruhlash); &nbsp; a(b + c) = ab + ac (taqsimot).</div>"
                ),
                secText("Nol va birning xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> a + 0 = a; &nbsp; a + (−a) = 0; &nbsp; a · 1 = a; &nbsp; a · (1/a) = 1 (a ≠ 0); &nbsp; a · 0 = 0.</div>"
                ),
                secText("Solishtirish va tartib",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ixtiyoriy ikki haqiqiy sondan biri ikkinchisiga teng yoki undan katta/kichik. Tengsizlikning ikkala tomoniga bir xil son qo'shsak, tengsizlik saqlanadi; musbat songa ko'paytirsak saqlanadi, manfiyga ko'paytirsak ishorasi teskari bo'ladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −3 &lt; 5 &nbsp;⇒&nbsp; −3·(−2) &gt; 5·(−2), ya'ni 6 &gt; −10.</div>"
                ),
                secText("Ildizli ifodalar bilan amallar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> √a · √b = √(ab); &nbsp; √a : √b = √(a/b); &nbsp; (√a)<sup>2</sup> = a (a ≥ 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> √2 · √8 = √16 = 4; &nbsp; √50 = √(25·2) = 5√2.</div>"
                ),
                secText("Taqribiy hisoblash",
                  "<div class='lecture-example'><strong>Misol:</strong> √2 + √3 ≈ 1,41 + 1,73 = 3,14 (yuzdan bir aniqlikda).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>√3 · √3 ratsionalmi? √2 + (−√2) ning qiymati qanday? Irratsional sonlar yig'indisi doim irratsional bo'ladimi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "xonagacha-yaxlitlash", title: "3.1 Sonlarni belgilangan xonasigacha yaxlitlash", page: "53/65-bet",
              sections: [
                secText("Yaxlitlash nima?",
                  "<p><strong>Yaxlitlash</strong> — sonni unga yaqin, ko'proq «yumaloq» son bilan almashtirish. Natija <strong>≈</strong> (taqriban teng) belgisi bilan yoziladi.</p>"
                ),
                secText("Yaxlitlash qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> yaxlitlanayotgan xonadan keyingi raqamga qaraymiz. Agar u <strong>5 dan kichik</strong> bo'lsa — xona raqami o'zgarmaydi (kam tomonga). Agar <strong>5 yoki undan katta</strong> bo'lsa — xona raqamiga 1 qo'shiladi (ortiq tomonga). Yaxlitlangan xonadan keyingi raqamlar nol bilan almashtiriladi yoki tashlab yuboriladi.</div>"
                ),
                secText("O'nli kasrlarni yaxlitlash",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='55' viewBox='0 0 300 55'>" +
                      "<line x1='20' y1='30' x2='280' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='40' y1='25' x2='40' y2='35' stroke='#1f2433' stroke-width='2'/><text x='40' y='48' font-size='11' text-anchor='middle'>3,7</text>" +
                      "<line x1='260' y1='25' x2='260' y2='35' stroke='#1f2433' stroke-width='2'/><text x='260' y='48' font-size='11' text-anchor='middle'>3,8</text>" +
                      "<circle cx='216' cy='30' r='4' fill='#4f5bd5'/><text x='216' y='18' font-size='11' text-anchor='middle' fill='#4f5bd5'>3,74</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3,74 ≈ 3,7 (o'ndan birgacha, chunki keyingi raqam 4 &lt; 5); &nbsp; 12,865 ≈ 12,87 (yuzdan birgacha).</div>"
                ),
                secText("Katta sonlarni yaxlitlash",
                  "<div class='lecture-example'><strong>Misol:</strong> 2857 ≈ 2900 (yuzlargacha); &nbsp; 2857 ≈ 3000 (mingdargacha); &nbsp; 34 519 ≈ 34 520 (o'nlargacha).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir sonni o'nlargacha yaxlitlaganda 750, yuzlargacha yaxlitlaganda 700 chiqdi. Bu son qanday oraliqda yotadi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "ahamiyatli-raqamgacha-yaxlitlash", title: "3.2 Sonlarni belgilangan ahamiyatli raqamgacha yaxlitlash", page: "53/65-bet",
              sections: [
                secText("Ahamiyatli raqam nima?",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> sonning birinchi noldan farqli raqamidan boshlab sanaladigan barcha raqamlari <strong>ahamiyatli raqamlar</strong> deyiladi. Boshidagi nollar ahamiyatli emas.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 0,004072 — ahamiyatli raqamlari: 4, 0, 7, 2 (jami 4 ta). 35 800 — ahamiyatli raqamlari: 3, 5, 8.</div>"
                ),
                secText("Ahamiyatli raqamgacha yaxlitlash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kerakli sondagi ahamiyatli raqamni qoldirib, keyingisiga qarab (5 dan kichik/katta) yaxlitlaymiz. Butun qismdagi tashlab yuborilgan raqamlar nol bilan almashtiriladi.</div>"
                ),
                secText("Misollar",
                  "<div class='lecture-example'><strong>Misol:</strong> 0,004072 ≈ 0,0041 (2 ta ahamiyatli raqam); &nbsp; 34 570 ≈ 35 000 (2 ta ahamiyatli raqam); &nbsp; 7,318 ≈ 7,32 (3 ta ahamiyatli raqam).</div>"
                ),
                secText("Xona va ahamiyatli raqam farqi",
                  "<p>«O'ngacha yaxlitlash» — aniq xona ko'rsatiladi. «Ikki ahamiyatli raqamgacha yaxlitlash» — sonning kattaligidan qat'i nazar, faqat ikkita ma'noli raqam qoldiriladi.</p>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Yorug'lik tezligi 299 792 458 m/s. Uni: a) 1 ta; b) 2 ta; d) 3 ta ahamiyatli raqamgacha yaxlitlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "chamalash", title: "3.3 Chamalash", page: "53/65-bet",
              sections: [
                secText("Chamalash nima?",
                  "<p><strong>Chamalash</strong> — sonlarni qulay yaxlitlab, hisobni tez va taxminan bajarish. U aniq javob emas, balki javobning taxminiy kattaligini bilish uchun kerak.</p>"
                ),
                secText("Chamalash qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> amaldagi har bir sonni hisoblash oson bo'ladigan «yumaloq» songa yaxlitlaymiz, so'ng amalni bajaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 412 · 19 ≈ 400 · 20 = 8000 (aniq javob 7828 ga yaqin); &nbsp; 6187 : 29 ≈ 6000 : 30 = 200.</div>"
                ),
                secText("Javobni tekshirish uchun chamalash",
                  "<div class='lecture-example'><strong>Misol:</strong> hisoblab 38 · 52 = 1976 deb topdik. Chama: 40 · 50 = 2000. Javob 2000 ga yaqin — demak ishonchli.</div>"
                ),
                secText("Turmushda chamalash",
                  "<div class='lecture-example'><strong>Misol:</strong> do'konda 3 ta 2870 so'mlik, 2 ta 5100 so'mlik mahsulot. Chama: 3·3000 + 2·5000 = 19 000 so'm atrofida.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Bir maktabda 28 sinf, har birida o'rtacha 26 o'quvchi. Maktabda taxminan nechta o'quvchi bor? Aniq son 728 dan qanchalik farq qiladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "algebraga-kirish", title: "4.1 Algebraga kirish", page: "71/89-bet",
              sections: [
                secText("O'zgaruvchi va harfiy ifoda",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> turli qiymatlar qabul qila oladigan harf <strong>o'zgaruvchi</strong> deyiladi. Sonlar, o'zgaruvchilar va amal belgilaridan tuzilgan yozuv <strong>harfiy (algebraik) ifoda</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x + 5, &nbsp; a − b, &nbsp; 2(m + n) — algebraik ifodalar.</div>"
                ),
                secText("Had, koeffitsient, ozod had",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ifodadagi «+» yoki «−» bilan ajralgan qismlar <strong>hadlar</strong> deyiladi. O'zgaruvchi oldidagi son <strong>koeffitsient</strong>, o'zgaruvchisiz turgan son <strong>ozod had</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x − 3y + 7 ifodasida: hadlar 5x, −3y, 7; koeffitsientlar 5 va −3; ozod had 7.</div>"
                ),
                secText("Ifodaning qiymatini topish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'zgaruvchi o'rniga berilgan sonni qo'yib, amallar tartibi bo'yicha hisoblaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2x + 3 ifodasida x = 4: &nbsp; 2·4 + 3 = 11. &nbsp; x = −1: &nbsp; 2·(−1) + 3 = 1.</div>"
                ),
                secText("Formulalar",
                  "<div class='lecture-rule'><strong>Formula</strong> — kattaliklar orasidagi bog'lanishni harflar bilan ifodalash.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> to'rtburchak perimetri P = 2(a + b); yuzi S = a·b; yo'l s = v·t.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«Bir sonning uch baravaridan 4 ni ayirsak, 20 chiqadi» jumlasini algebraik ifoda (tenglama) shaklida yozing. O'zgaruvchini o'zingiz tanlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "chiziqli-ifodalarni-soddalashtirish", title: "4.2 Chiziqli ifodalarni soddalashtirish", page: "71/89-bet",
              sections: [
                secText("O'xshash hadlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> o'zgaruvchi qismi bir xil bo'lgan hadlar <strong>o'xshash hadlar</strong> deyiladi. Ozod hadlar ham o'zaro o'xshash.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x va −2x — o'xshash; &nbsp; 7 va 3 — o'xshash; &nbsp; 5x va 5y — o'xshash emas.</div>"
                ),
                secText("O'xshash hadlarni ixchamlash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'xshash hadlarni qo'shish (ayirish) uchun ularning koeffitsientlarini qo'shamiz (ayiramiz), o'zgaruvchi qismini o'zgartirmaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5x + 3 − 2x + 7 = (5x − 2x) + (3 + 7) = 3x + 10.</div>"
                ),
                secText("Songa ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ifodani songa ko'paytirish uchun har bir hadni shu songa ko'paytiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3·(2x) = 6x; &nbsp; 4·(x + 2) = 4x + 8; &nbsp; −2·(3a − 1) = −6a + 2.</div>"
                ),
                secText("Bosqichli soddalashtirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 2(x + 3) + 3(2x − 1) = 2x + 6 + 6x − 3 = 8x + 3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a(x + 1) + b(x − 1) ifodani soddalashtiring. Natija faqat ozod haddan iborat bo'lishi uchun a va b qanday bog'liq bo'lishi kerak?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "qavslarni-ochish", title: "4.3 Chiziqli ifodalarda qavslarni ochish", page: "71/89-bet",
              sections: [
                secText("Qavs oldida «+» bo'lsa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs oldida «+» ishorasi (yoki hech narsa) tursa, qavs shundoqqina olib tashlanadi, hadlar ishorasi o'zgarmaydi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a + (b − c) = a + b − c.</div>"
                ),
                secText("Qavs oldida «−» bo'lsa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs oldida «−» ishorasi tursa, qavs olib tashlanganda ichidagi barcha hadlarning ishorasi qarama-qarshisiga o'zgaradi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a − (b − c) = a − b + c; &nbsp; 5 − (2x − 3) = 5 − 2x + 3 = 8 − 2x.</div>"
                ),
                secText("Ko'paytuvchi bilan qavsni ochish",
                  "<div class='lecture-rule'><strong>Formula (taqsimot qonuni):</strong> a(b + c) = ab + ac; &nbsp; a(b − c) = ab − ac.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3(2x − 5) = 6x − 15; &nbsp; −2(4 − 3y) = −8 + 6y.</div>"
                ),
                secText("Aralash misol",
                  "<div class='lecture-example'><strong>Misol:</strong> 4(x − 2) − 3(2x − 5) = 4x − 8 − 6x + 15 = −2x + 7.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>−(−(−(x − 1))) ifodani soddalashtiring. Nechta minus bo'lganda ifoda x − 1 ga, nechtasida 1 − x ga teng bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kopaytuvchilarga-ajratish", title: "4.4 Algebraik ifodalarni ko'paytuvchilarga ajratish", page: "71/89-bet",
              sections: [
                secText("Ko'paytuvchilarga ajratish nima?",
                  "<p><strong>Ko'paytuvchilarga ajratish</strong> — ko'phadni bir nechta ifodaning ko'paytmasi ko'rinishida yozish. Bu qavs ochishga teskari amal.</p>"
                ),
                secText("Umumiy ko'paytuvchini qavs tashqarisiga chiqarish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> barcha hadlarda uchraydigan umumiy ko'paytuvchini topib, qavs tashqarisiga chiqaramiz: ab + ac = a(b + c).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 6x + 9 = 3(2x + 3); &nbsp; 4a<sup>2</sup> − 8a = 4a(a − 2).</div>"
                ),
                secText("Guruhlash usuli",
                  "<div class='lecture-rule'><strong>Qoida:</strong> hadlarni umumiy ko'paytuvchisi bor guruhlarga ajratamiz, so'ng umumiy qavsni chiqaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ax + ay + bx + by = a(x + y) + b(x + y) = (x + y)(a + b).</div>"
                ),
                secText("Qisqa ko'paytirish formulalari bilan",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b); &nbsp; a<sup>2</sup> ± 2ab + b<sup>2</sup> = (a ± b)<sup>2</sup>.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>2</sup> − 25 = (x − 5)(x + 5); &nbsp; x<sup>2</sup> + 6x + 9 = (x + 3)<sup>2</sup>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Interaktiv ko'rgazmadan foydalanib, 2x<sup>2</sup> + 4x + 2 ifodani to'liq ko'paytuvchilarga ajrating (avval umumiy ko'paytuvchi, keyin formulani qo'llang).</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-algebra-kopaytuvchilarga-ajratish.html", test: null
            },
            {
              id: "sodda-chiziqli-tenglamalar", title: "5.1 Sodda chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Tenglama va uning ildizi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> o'zgaruvchi qatnashgan tenglik <strong>tenglama</strong> deyiladi. Tenglamani to'g'ri tenglikka aylantiradigan o'zgaruvchi qiymati uning <strong>ildizi</strong> (yechimi) deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x + 7 = 15 tenglamaning ildizi x = 8, chunki 8 + 7 = 15.</div>"
                ),
                secText("Teng kuchli almashtirishlar",
                  "<div class='lecture-figure'>" +
                    "<svg width='220' height='110' viewBox='0 0 220 110'>" +
                      "<line x1='110' y1='12' x2='110' y2='34' stroke='#1f2433' stroke-width='3'/>" +
                      "<line x1='35' y1='34' x2='185' y2='34' stroke='#1f2433' stroke-width='3'/>" +
                      "<line x1='55' y1='34' x2='40' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='55' y1='34' x2='70' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='165' y1='34' x2='150' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='165' y1='34' x2='180' y2='58' stroke='#1f2433' stroke-width='2'/>" +
                      "<ellipse cx='55' cy='72' rx='40' ry='15' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<ellipse cx='165' cy='72' rx='40' ry='15' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='55' y='77' font-size='12' text-anchor='middle' fill='#4f5bd5'>3x − 7</text>" +
                      "<text x='165' y='77' font-size='12' text-anchor='middle' fill='#16a394'>8</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamaning ikkala tomoniga bir xil sonni qo'shsak/ayirsak yoki noldan farqli bir xil songa ko'paytirsak/bo'lsak, ildizi o'zgarmaydi. Hadni bir tomondan ikkinchisiga <em>ishorasini o'zgartirib</em> o'tkazish mumkin.</div>"
                ),
                secText("Chiziqli tenglamani yechish",
                  "<div class='lecture-rule'><strong>Umumiy ko'rinishi:</strong> ax + b = 0 &nbsp;⇒&nbsp; x = −b/a (a ≠ 0 bo'lganda).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x − 7 = 8 &nbsp;⇒&nbsp; 3x = 15 &nbsp;⇒&nbsp; x = 5.</div>"
                ),
                secText("Tekshirish",
                  "<div class='lecture-example'><strong>Misol:</strong> x = 5 ni qo'yamiz: 3·5 − 7 = 8. To'g'ri, demak ildiz to'g'ri topilgan.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Interaktiv ko'rgazmadan foydalanib 5x + 3 = 2x + 18 tenglamani bosqichma-bosqich yeching. Har bir bosqichda qaysi almashtirishni qo'llaganingizni ayting.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: "lessons/7-algebra-sodda-chiziqli-tenglamalar.html", test: null
            },
            {
              id: "qavs-kasr-chiziqli-tenglamalar", title: "5.2 Qavs va kasrlar qatnashgan chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Qavsli tenglamalar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval barcha qavslarni ochamiz, o'xshash hadlarni ixchamlaymiz, so'ng o'zgaruvchili hadlarni bir tomonga, sonlarni ikkinchi tomonga o'tkazamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2(x − 3) = x + 4 &nbsp;⇒&nbsp; 2x − 6 = x + 4 &nbsp;⇒&nbsp; x = 10.</div>"
                ),
                secText("Kasr koeffitsientli tenglamalar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamaning ikkala tomonini barcha maxrajlarning umumiy karralisiga (EKUK) ko'paytiramiz — kasrlar yo'qoladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x/2 + x/3 = 5. Ikkala tomonni 6 ga ko'paytiramiz: 3x + 2x = 30 &nbsp;⇒&nbsp; 5x = 30 &nbsp;⇒&nbsp; x = 6.</div>"
                ),
                secText("Aralash misol",
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 1)/2 − (x − 2)/3 = 1. 6 ga ko'paytiramiz: 3(x + 1) − 2(x − 2) = 6 &nbsp;⇒&nbsp; 3x + 3 − 2x + 4 = 6 &nbsp;⇒&nbsp; x = −1.</div>"
                ),
                secText("Maxsus hollar",
                  "<div class='lecture-rule'><strong>Eslatma:</strong> soddalashtirishdan keyin 0·x = 0 chiqsa — cheksiz ko'p yechim; 0·x = 5 kabi (noto'g'ri tenglik) chiqsa — yechim yo'q.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>3(x − 2) − 2(x − 3) tenglamaning chap tomoni. O'ng tomonga qanday ifoda qo'ysak, tenglama <em>har qanday</em> x uchun to'g'ri bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sodda-kasr-chiziqli-tenglamalar", title: "5.3 Sodda kasr-chiziqli tenglamalar", page: "101/123-bet",
              sections: [
                secText("Kasr-chiziqli tenglama nima?",
                  "<p>Maxrajida o'zgaruvchi qatnashgan tenglama <strong>kasr-chiziqli tenglama</strong> deyiladi. Masalan, 6/x = 3 &nbsp; yoki &nbsp; 1/(x − 2) = 5.</p>"
                ),
                secText("Yechish tartibi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) maxraj noldan farqli degan shartni yozamiz (JCHS — joiz qiymatlar sohasi); 2) ikkala tomonni maxrajga ko'paytiramiz; 3) hosil bo'lgan chiziqli tenglamani yechamiz; 4) topilgan ildiz shartni qanoatlantirishini tekshiramiz.</div>"
                ),
                secText("Misol",
                  "<div class='lecture-example'><strong>Misol:</strong> 6/x = 3, &nbsp; x ≠ 0. Ikkala tomonni x ga ko'paytiramiz: 6 = 3x &nbsp;⇒&nbsp; x = 2. &nbsp; 2 ≠ 0 — javob: x = 2.</div>"
                ),
                secText("Chetki (begona) ildiz",
                  "<div class='lecture-example'><strong>Misol:</strong> 1/(x − 3) = 1/(x − 3) turidagi almashtirishdan keyin x = 3 chiqsa, u JCHS ga kirmaydi — begona ildiz, tashlab yuboriladi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>10/(x + 1) = 2 tenglamani yeching. Endi o'ng tomondagi 2 o'rniga 0 qo'ysangiz, tenglamaning yechimi bo'ladimi? Nega?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tenglama-matnli-masalalar", title: "5.4 Chiziqli tenglama tuzib yechiladigan matnli masalalar", page: "101/123-bet",
              sections: [
                secText("Masala yechish bosqichlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) noma'lum kattalikni x deb belgilaymiz; 2) masaladagi shartga ko'ra tenglama tuzamiz; 3) tenglamani yechamiz; 4) topilgan qiymatni masala savoliga moslab javob yozamiz va shartga tekshiramiz.</div>"
                ),
                secText("Sonlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Ikki sonning yig'indisi 40, biri ikkinchisidan 6 ga katta. Kichigi x bo'lsa: x + (x + 6) = 40 &nbsp;⇒&nbsp; 2x = 34 &nbsp;⇒&nbsp; x = 17. Sonlar: 17 va 23.</div>"
                ),
                secText("Harakatga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Piyoda 5 km/soat, velosipedchi 15 km/soat. Ular bir vaqtda bir tomonga jo'nadi, velosipedchi 2 soat kech chiqdi. Velosipedchi piyodani necha soatdan keyin quvib yetadi? &nbsp; 5(t + 2) = 15t &nbsp;⇒&nbsp; 5t + 10 = 15t &nbsp;⇒&nbsp; t = 1 soat.</div>"
                ),
                secText("Yoshlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Otasi o'g'lidan 3 marta katta, 12 yildan keyin 2 marta katta bo'ladi. O'g'li x yosh: 3x + 12 = 2(x + 12) &nbsp;⇒&nbsp; x = 12.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Hovuzni birinchi quvur 6 soatda, ikkinchisi 3 soatda to'ldiradi. Ikkalasi birga ochilsa, hovuz necha soatda to'ladi? (Butun ishni 1 deb oling.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "nuqta-togri-chiziq-tekislik", title: "6.1 Nuqta, to'g'ri chiziq va tekislik", page: "127/145-bet",
              sections: [
                secText("Asosiy geometrik tushunchalar",
                  "<p><strong>Nuqta</strong>, <strong>to'g'ri chiziq</strong> va <strong>tekislik</strong> — geometriyaning eng sodda, ta'riflanmaydigan tushunchalari. Nuqta bosh harflar (A, B, C), to'g'ri chiziq kichik harf (a, b) yoki ikki nuqtasi bilan (AB) belgilanadi.</p>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='70' viewBox='0 0 260 70'>" +
                      "<line x1='15' y1='25' x2='120' y2='25' stroke='#1f2433' stroke-width='2'/>" +
                      "<circle cx='40' cy='25' r='3' fill='#4f5bd5'/><text x='40' y='16' font-size='11' text-anchor='middle'>A</text>" +
                      "<circle cx='95' cy='25' r='3' fill='#4f5bd5'/><text x='95' y='16' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='67' y='44' font-size='10' text-anchor='middle' fill='#6b7280'>kesma AB</text>" +
                      "<line x1='150' y1='25' x2='250' y2='25' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='250,25 242,21 242,29' fill='#1f2433'/>" +
                      "<circle cx='165' cy='25' r='3' fill='#16a394'/><text x='165' y='16' font-size='11' text-anchor='middle'>O</text>" +
                      "<text x='205' y='44' font-size='10' text-anchor='middle' fill='#6b7280'>OX nur</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Kesma, nur, to'g'ri chiziq",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki nuqta va ular orasidagi qism — <strong>kesma</strong>; bir nuqtadan boshlanib bir tomonga cheksiz davom etadigan qism — <strong>nur</strong>; ikkala tomonga cheksiz — <strong>to'g'ri chiziq</strong>.</div>"
                ),
                secText("Asosiy xossalar (aksiomalar)",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ixtiyoriy ikki nuqta orqali faqat bitta to'g'ri chiziq o'tkazish mumkin. Ikki to'g'ri chiziq yo bitta umumiy nuqtaga ega (kesishadi), yo umuman kesishmaydi (parallel), yoki ustma-ust tushadi.</div>"
                ),
                secText("Nuqtalarning joylashuvi",
                  "<div class='lecture-example'><strong>Misol:</strong> A, B, C nuqtalar bitta to'g'ri chiziqda yotsa, ular <strong>kollinear</strong> deyiladi. B nuqta A va C orasida bo'lsa: AB + BC = AC.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tekislikda 4 ta nuqta berilgan, ularning hech uchtasi bitta to'g'ri chiziqda yotmaydi. Ular orqali nechta har xil to'g'ri chiziq o'tkazish mumkin?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchaklar-tushunchasi", title: "6.2 Burchaklar", page: "127/145-bet",
              sections: [
                secText("Burchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> umumiy boshlang'ich nuqtaga (uchiga) ega ikki nurdan tuzilgan shakl <strong>burchak</strong> deyiladi. Nurlar — burchakning <strong>tomonlari</strong>. Belgilanishi: ∠AOB yoki ∠O.</div>"
                ),
                secText("Burchakni o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> burchak <strong>gradus</strong>da (°) transportir bilan o'lchanadi. To'liq burilish 360°, yoyiq burchak 180°.</div>"
                ),
                secText("Burchak turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='90' viewBox='0 0 300 90'>" +
                      "<g stroke='#4f5bd5' stroke-width='2' fill='none'>" +
                        "<path d='M30 75 L30 25'/><path d='M30 75 L70 55'/>" +
                        "<path d='M110 75 L110 25'/><path d='M110 75 L150 75'/>" +
                        "<path d='M190 75 L165 25'/><path d='M190 75 L240 75'/>" +
                      "</g>" +
                      "<text x='45' y='88' font-size='10' text-anchor='middle'>o'tkir &lt;90°</text>" +
                      "<text x='130' y='88' font-size='10' text-anchor='middle'>to'g'ri =90°</text>" +
                      "<text x='215' y='88' font-size='10' text-anchor='middle'>o'tmas &gt;90°</text>" +
                      "<rect x='110' y='63' width='12' height='12' fill='none' stroke='#16a394'/>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir</em> — 0° dan 90° gacha; <em>to'g'ri</em> — 90°; <em>o'tmas</em> — 90° dan 180° gacha; <em>yoyiq</em> — 180°.</div>"
                ),
                secText("Qo'shni va vertikal burchaklar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir tomoni umumiy, qolgan tomonlari qo'shni nurlar bo'lgan burchaklar <strong>qo'shni</strong> deyiladi — ularning yig'indisi 180°. Tomonlari o'zaro qo'shni nurlardan iborat burchaklar <strong>vertikal</strong> deyiladi — ular teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> qo'shni burchaklardan biri 115° bo'lsa, ikkinchisi 180° − 115° = 65°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki to'g'ri chiziq kesishganda hosil bo'lgan to'rt burchakdan biri 40°. Qolgan uchtasini toping. Vertikal burchaklarning tengligini tushuntiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallel-chiziqlar-kesuvchi", title: "6.3 Parallel to'g'ri chiziqlar va kesuvchi", page: "127/145-bet",
              sections: [
                secText("Parallel to'g'ri chiziqlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir tekislikda yotgan va kesishmaydigan ikki to'g'ri chiziq <strong>parallel</strong> deyiladi. Belgilanishi: a ∥ b.</div>"
                ),
                secText("Kesuvchi va hosil bo'lgan burchaklar",
                  "<div class='lecture-figure'>" +
                    "<svg width='240' height='120' viewBox='0 0 240 120'>" +
                      "<line x1='20' y1='40' x2='220' y2='40' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='20' y1='85' x2='220' y2='85' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='170' y2='110' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='96' y='34' font-size='10' fill='#16a394'>1</text>" +
                      "<text x='118' y='34' font-size='10' fill='#16a394'>2</text>" +
                      "<text x='128' y='58' font-size='10' fill='#16a394'>4</text>" +
                      "<text x='140' y='80' font-size='10' fill='#16a394'>5</text>" +
                      "<text x='162' y='80' font-size='10' fill='#16a394'>6</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki to'g'ri chiziqni kesib o'tuvchi uchinchi to'g'ri chiziq <strong>kesuvchi</strong>. U 8 ta burchak hosil qiladi: <em>mos</em>, <em>ichki almashinuvchi</em>, <em>ichki bir tomonli</em> burchaklar.</div>"
                ),
                secText("Parallellik alomatlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar kesuvchi bilan hosil bo'lgan <em>ichki almashinuvchi</em> burchaklar teng bo'lsa, YOKI <em>mos</em> burchaklar teng bo'lsa, YOKI <em>ichki bir tomonli</em> burchaklar yig'indisi 180° bo'lsa — to'g'ri chiziqlar parallel.</div>"
                ),
                secText("Parallel chiziqlarning xossasi",
                  "<div class='lecture-rule'><strong>Qoida (teskarisi):</strong> to'g'ri chiziqlar parallel bo'lsa, kesuvchi bilan hosil qilgan mos burchaklari teng, ichki almashinuvchilari teng, ichki bir tomonlilari yig'indisi 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a ∥ b, kesuvchi bilan hosil bo'lgan mos burchaklardan biri 70° bo'lsa, ikkinchisi ham 70°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ∥ b. Kesuvchi bilan hosil bo'lgan ichki bir tomonli burchaklardan biri ikkinchisidan 40° katta. Har ikkala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchaklar-7sinf", title: "7.1 Uchburchaklar", page: "153/167-bet",
              sections: [
                secText("Uchburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir to'g'ri chiziqda yotmaydigan uch nuqta va ularni tutashtiruvchi uch kesmadan tuzilgan shakl <strong>uchburchak</strong> deyiladi. Elementlari: 3 ta uch, 3 ta tomon, 3 ta burchak.</div>"
                ),
                secText("Tomonlariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>turli tomonli</em> — barcha tomonlari har xil; <em>teng yonli</em> — ikki tomoni teng; <em>teng tomonli</em> — uchala tomoni teng.</div>"
                ),
                secText("Burchaklariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir burchakli</em> — hamma burchagi o'tkir; <em>to'g'ri burchakli</em> — bitta burchagi 90°; <em>o'tmas burchakli</em> — bitta burchagi o'tmas.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<polygon points='30,90 170,90 110,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='34' y='85' font-size='11' fill='#16a394'>∠A</text>" +
                      "<text x='150' y='85' font-size='11' fill='#16a394'>∠B</text>" +
                      "<text x='104' y='38' font-size='11' fill='#16a394'>∠C</text>" +
                      "<text x='100' y='106' font-size='10' text-anchor='middle' fill='#4f5bd5'>∠A + ∠B + ∠C = 180°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning ichki burchaklari yig'indisi <strong>180°</strong> ga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ikki burchagi 50° va 70° bo'lsa, uchinchisi 180° − 50° − 70° = 60°.</div>"
                ),
                secText("Tashqi burchak",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning tashqi burchagi u bilan qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ichki burchaklar 40° va 65° bo'lsa, ularga qo'shni bo'lmagan uchdan chiqqan tashqi burchak 40° + 65° = 105°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak burchaklari 2 : 3 : 4 nisbatda. Har bir burchakni toping. Bu uchburchak qanday turga kiradi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tortburchaklar-7sinf", title: "7.2 To'rtburchaklar", page: "153/167-bet",
              sections: [
                secText("To'rtburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> hech uchtasi bir to'g'ri chiziqda yotmaydigan to'rt nuqta va ularni ketma-ket tutashtiruvchi to'rt kesmadan tuzilgan shakl <strong>to'rtburchak</strong>. Qarama-qarshi uchlarni tutashtiruvchi kesma — <strong>diagonal</strong>.</div>"
                ),
                secText("To'rtburchak turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='80' viewBox='0 0 300 80'>" +
                      "<polygon points='10,60 60,60 75,20 25,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='42' y='75' font-size='9' text-anchor='middle'>parallelogramm</text>" +
                      "<rect x='100' y='20' width='55' height='40' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='127' y='75' font-size='9' text-anchor='middle'>to'g'ri to'rtb.</text>" +
                      "<rect x='195' y='22' width='38' height='38' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='214' y='75' font-size='9' text-anchor='middle'>kvadrat</text>" +
                      "<polygon points='255,60 295,60 285,20 245,20' fill='none' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='272' y='75' font-size='9' text-anchor='middle'>trapetsiya</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>parallelogramm</em> — qarama-qarshi tomonlari parallel; <em>romb</em> — barcha tomonlari teng parallelogramm; <em>to'g'ri to'rtburchak</em> — barcha burchagi 90°; <em>kvadrat</em> — barcha tomoni teng va burchagi 90°; <em>trapetsiya</em> — faqat bir juft tomoni parallel.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ixtiyoriy to'rtburchakning ichki burchaklari yig'indisi <strong>360°</strong>. (Diagonal uni ikki uchburchakka bo'ladi: 2·180°.)</div>"
                ),
                secText("Parallelogramm xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> parallelogrammda qarama-qarshi tomonlar teng, qarama-qarshi burchaklar teng, diagonallar kesishish nuqtasida teng ikkiga bo'linadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> parallelogrammning bir burchagi 110° bo'lsa, unga qo'shni burchagi 70°, qarama-qarshisi yana 110°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'rtburchak burchaklari 3 : 4 : 5 : 6 nisbatda. Har bir burchakni toping. Bu to'rtburchak trapetsiya bo'la oladimi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kopburchaklar", title: "7.3 Ko'pburchaklar", page: "153/167-bet",
              sections: [
                secText("Ko'pburchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ketma-ket tutashtirilgan kesmalardan tuzilgan yopiq siniq chiziq bilan chegaralangan shakl <strong>ko'pburchak</strong> deyiladi. n ta tomoni bo'lsa — <strong>n-burchak</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='90' viewBox='0 0 200 90'>" +
                      "<polygon points='45,15 80,40 66,80 24,80 10,40' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='45' y='88' font-size='9' text-anchor='middle'>5-burchak</text>" +
                      "<polygon points='140,15 170,32 170,65 140,82 110,65 110,32' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='140' y='88' font-size='9' text-anchor='middle'>6-burchak</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Qavariq ko'pburchak",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> har qanday tomoni davomida o'tkazilgan to'g'ri chiziq shaklni kesib o'tmasa, ko'pburchak <strong>qavariq</strong> deyiladi.</div>"
                ),
                secText("Ichki burchaklar yig'indisi",
                  "<div class='lecture-rule'><strong>Formula:</strong> qavariq n-burchakning ichki burchaklari yig'indisi S = (n − 2) · 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> beshburchak: (5 − 2)·180° = 540°; &nbsp; oltiburchak: (6 − 2)·180° = 720°.</div>"
                ),
                secText("Muntazam ko'pburchak va diagonallar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> barcha tomoni va burchagi teng ko'pburchak <strong>muntazam</strong> deyiladi. Muntazam n-burchakning har bir burchagi (n − 2)·180° / n. Diagonallar soni n(n − 3) / 2.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> muntazam oltiburchakning har bir burchagi 720° / 6 = 120°; diagonallari 6·3/2 = 9 ta.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Qavariq ko'pburchakning ichki burchaklari yig'indisi 1440°. Bu necha burchakli? Uning har bir burchagi teng bo'lsa, bittasi necha gradus?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tortburchak-yasash", title: "7.4 Uchburchak va to'rtburchaklarni yasash", page: "153/167-bet",
              sections: [
                secText("Yasash asboblari",
                  "<p>Geometrik yasashlar faqat <strong>sirkul</strong> va <strong>chizg'ich</strong> (bo'linmalarsiz) yordamida bajariladi. Sirkul bilan aylana va teng kesmalar, chizg'ich bilan to'g'ri chiziq o'tkaziladi.</p>"
                ),
                secText("Uchburchakni uch tomoni bo'yicha yasash",
                  "<div class='lecture-rule'><strong>Tartib:</strong> 1) bir tomonni (masalan AB) chizg'ich bilan o'tkazamiz; 2) A dan radiusi ikkinchi tomonga teng aylana yoyi; 3) B dan radiusi uchinchi tomonga teng aylana yoyi; 4) yoylar kesishgan nuqta C — uchburchak tayyor.</div>" +
                  "<div class='lecture-rule'><strong>Shart:</strong> yasash mumkin bo'lishi uchun har bir tomon qolgan ikki tomon yig'indisidan kichik bo'lishi kerak (uchburchak tengsizligi).</div>"
                ),
                secText("Ikki tomon va orasidagi burchak bo'yicha",
                  "<div class='lecture-rule'><strong>Tartib:</strong> berilgan burchakni yasaymiz; uning tomonlariga sirkul bilan berilgan uzunliklarni qo'yamiz; hosil bo'lgan ikki nuqtani tutashtiramiz.</div>"
                ),
                secText("Kvadrat yasash",
                  "<div class='lecture-rule'><strong>Tartib:</strong> AB tomonni o'tkazamiz; A va B nuqtalarda AB ga perpendikulyarlar tiklaymiz; ularga sirkul bilan AB ga teng kesmalar qo'yib, D va C nuqtalarni topamiz; ABCD — kvadrat.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tomonlari 3 sm, 4 sm, 8 sm bo'lgan uchburchak yasash mumkinmi? Javobingizni uchburchak tengsizligi bilan asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
          ]
        },
        {
          id: "algebra",
          name: "Algebra (2022-yil)",
          topics: [
            {
              id: "sonli-ifodalar", title: "Sonli ifodalar", page: "12-bet",
              sections: [
                secText("Sonli ifoda tushunchasi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> sonlar va amal belgilaridan (+, −, ·, :, daraja, qavs) tuzilgan yozuv <strong>sonli ifoda</strong> deyiladi. Amallar bajarilganda hosil bo'lgan son ifodaning <strong>qiymati</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 · (4 + 2) − 5 sonli ifoda; uning qiymati 3 · 6 − 5 = 13.</div>"
                ),
                secText("Amallar tartibi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval qavs ichidagi amallar, keyin darajaga ko'tarish, so'ng ko'paytirish va bo'lish (chapdan o'ngga), oxirida qo'shish va ayirish bajariladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 20 − 2 · 3<sup>2</sup> = 20 − 2 · 9 = 20 − 18 = 2.</div>"
                ),
                secText("Ma'noga ega bo'lmagan ifodalar",
                  "<div class='lecture-rule'><strong>Eslatma:</strong> 0 ga bo'lish aniqlanmagan, shuning uchun maxrajida 0 hosil bo'ladigan ifoda <strong>ma'noga ega emas</strong>.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 7 : (5 − 5) ifodasi ma'noga ega emas.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Faqat to'rtta 4 raqami va amal belgilaridan foydalanib qiymati 1, 2, 3, 4, 5 ga teng bo'lgan sonli ifodalar tuzing. Masalan, (4 + 4) : (4 + 4) = 1.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "algebraik-ifodalar-tushunchasi", title: "Algebraik ifodalar", page: "12-bet",
              sections: [
                secText("Algebraik ifoda",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> sonlar, o'zgaruvchilarni bildiruvchi harflar va amal belgilaridan tuzilgan yozuv <strong>algebraik (harfiy) ifoda</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2a + 3b, &nbsp; x<sup>2</sup> − 5x, &nbsp; (m + n) : 2 — algebraik ifodalar.</div>"
                ),
                secText("Ifodaning sonli qiymati",
                  "<div class='lecture-rule'><strong>Qoida:</strong> harflar o'rniga berilgan sonlarni qo'yib, amallarni bajarsak, ifodaning <strong>sonli qiymati</strong> hosil bo'ladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2a + 3b ifodasida a = 4, b = 1: &nbsp; 2 · 4 + 3 · 1 = 11.</div>"
                ),
                secText("O'zgaruvchining joiz qiymatlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ifoda ma'noga ega bo'ladigan o'zgaruvchi qiymatlari to'plami <strong>joiz qiymatlar sohasi</strong> (JQS) deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1 : (x − 3) ifoda uchun JQS: x ≠ 3 bo'lgan barcha sonlar.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«Uzunligi a sm, eni b sm bo'lgan to'rtburchak perimetri» ni ifoda bilan yozing. a = 7, b = 5 bo'lganda qiymatini toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "algebraik-tengliklar-formulalar", title: "Algebraik tengliklar, formulalar", page: "12-bet",
              sections: [
                secText("Ayniyat va tenglama",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> o'zgaruvchining barcha joiz qiymatlarida to'g'ri bo'ladigan tenglik <strong>ayniyat</strong> deyiladi. Faqat ayrim qiymatlarda to'g'ri bo'ladigani <strong>tenglama</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 2(x + 3) = 2x + 6 — ayniyat; &nbsp; 2x + 6 = 10 — tenglama (faqat x = 2 da to'g'ri).</div>"
                ),
                secText("Formula",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kattaliklar orasidagi bog'lanishni umumiy ko'rinishda ifodalovchi tenglik <strong>formula</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> yo'l s = v · t; &nbsp; kvadrat yuzi S = a<sup>2</sup>; &nbsp; doira uzunligi C = 2πr.</div>"
                ),
                secText("Formuladan noma'lumni ifodalash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> formuladagi istalgan harfni teng kuchli almashtirishlar bilan ajratib olish mumkin.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> s = v · t dan &nbsp; v = s / t &nbsp; va &nbsp; t = s / v.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Trapetsiya yuzi formulasi S = (a + b) · h / 2. Bu formuladan h (balandlik) ni ifodalang. S = 40, a = 6, b = 10 bo'lsa, h ni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "qavs-qoidasi-koeffitsiyent", title: "Qavslarni ochish qoidasi va koeffitsiyent", page: "12-bet",
              sections: [
                secText("Koeffitsient",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> harfiy ko'paytmadagi sonli ko'paytuvchi <strong>koeffitsient</strong> deyiladi. Koeffitsient yozilmagan bo'lsa, u 1 ga (yoki −1 ga) teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −3ab da koeffitsient −3; &nbsp; xy da koeffitsient 1; &nbsp; −m da koeffitsient −1.</div>"
                ),
                secText("Qavs oldida «+» yoki «−»",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qavs oldida «+» bo'lsa, qavs shundoq olib tashlanadi. Qavs oldida «−» bo'lsa, ichidagi barcha hadlar ishorasi qarama-qarshisiga o'zgaradi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a + (b − c) = a + b − c; &nbsp; a − (b − c) = a − b + c.</div>"
                ),
                secText("Ko'paytuvchi bilan qavsni ochish",
                  "<div class='lecture-rule'><strong>Formula:</strong> k(a + b) = ka + kb; &nbsp; k(a − b) = ka − kb.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> −4(2x − 3) = −8x + 12.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>2 − 3(x − (1 − 2x)) ifodada qavslarni bosqichma-bosqich oching va soddalashtiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "arifmetik-amallar-xossalari", title: "Arifmetik amallarning xossalari", page: "12-bet",
              sections: [
                secText("O'rin almashtirish va guruhlash",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a + b = b + a; &nbsp; ab = ba (o'rin almashtirish qonuni). &nbsp; (a + b) + c = a + (b + c); &nbsp; (ab)c = a(bc) (guruhlash qonuni).</div>"
                ),
                secText("Taqsimot qonuni",
                  "<div class='lecture-rule'><strong>Formula:</strong> a(b + c) = ab + ac. Bu qonun qavs ochish va umumiy ko'paytuvchini chiqarishning asosidir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 25 · 17 + 25 · 3 = 25 · (17 + 3) = 25 · 20 = 500.</div>"
                ),
                secText("Xossalarni hisoblashda qo'llash",
                  "<div class='lecture-example'><strong>Misol:</strong> 4 · 37 · 25 = (4 · 25) · 37 = 100 · 37 = 3700.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Amallarni qulay tartibda bajarib hisoblang: 8 · 125 · 9 · 7. Qaysi xossalardan foydalandingiz?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "natural-korsatkichli-daraja", title: "Natural ko'rsatkichli daraja", page: "12-bet",
              sections: [
                secText("Daraja ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> a<sup>n</sup> = a · a · … · a (n ta bir xil ko'paytuvchi), bunda n &gt; 1. Bu yerda a — <strong>asos</strong>, n — <strong>ko'rsatkich</strong>. Kelishuvga ko'ra a<sup>1</sup> = a.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3<sup>4</sup> = 3 · 3 · 3 · 3 = 81; &nbsp; (−2)<sup>3</sup> = −8; &nbsp; 10<sup>5</sup> = 100 000.</div>"
                ),
                secText("Ishora qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> musbat sonning har qanday darajasi musbat. Manfiy sonning <em>juft</em> darajasi musbat, <em>toq</em> darajasi manfiy.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (−5)<sup>2</sup> = 25; &nbsp; (−5)<sup>3</sup> = −125; &nbsp; −5<sup>2</sup> = −25 (bu yerda daraja faqat 5 ga tegishli).</div>"
                ),
                secText("Darajaning qiymatini hisoblash tartibi",
                  "<div class='lecture-example'><strong>Misol:</strong> 2 + 3 · 4<sup>2</sup> = 2 + 3 · 16 = 50; &nbsp; (2 + 3)<sup>2</sup> = 5<sup>2</sup> = 25.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>2<sup>10</sup> ni hisoblang. 2<sup>n</sup> qaysi n dan boshlab 1000 dan katta bo'ladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "daraja-xossalari", title: "Natural ko'rsatkichli darajaning xossalari", page: "12-bet",
              sections: [
                secText("Asosiy xossalar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>; &nbsp; a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup> (m &gt; n, a ≠ 0); &nbsp; (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>; &nbsp; (ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup>; &nbsp; (a/b)<sup>n</sup> = a<sup>n</sup>/b<sup>n</sup>.</div>"
                ),
                secText("Bir xil asoslarni ko'paytirish va bo'lish",
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>3</sup> · x<sup>5</sup> = x<sup>8</sup>; &nbsp; a<sup>7</sup> : a<sup>2</sup> = a<sup>5</sup>; &nbsp; 2<sup>3</sup> · 2<sup>4</sup> = 2<sup>7</sup> = 128.</div>"
                ),
                secText("Darajani darajaga ko'tarish",
                  "<div class='lecture-example'><strong>Misol:</strong> (x<sup>2</sup>)<sup>4</sup> = x<sup>8</sup>; &nbsp; (2a<sup>3</sup>)<sup>2</sup> = 4a<sup>6</sup>; &nbsp; (−3x)<sup>3</sup> = −27x<sup>3</sup>.</div>"
                ),
                secText("Nol ko'rsatkich",
                  "<div class='lecture-rule'><strong>Kelishuv:</strong> a ≠ 0 bo'lganda a<sup>0</sup> = 1.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a<sup>5</sup> : a<sup>5</sup> = a<sup>0</sup> = 1.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ifodani soddalashtiring: (a<sup>2</sup>b<sup>3</sup>)<sup>2</sup> · (ab)<sup>3</sup> : (a<sup>3</sup>b<sup>4</sup>). Javob bitta birhad ko'rinishida bo'lsin.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "birhad-standart-shakli", title: "Birhad va uning standart shakli", page: "12-bet",
              sections: [
                secText("Birhad",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> sonlar va o'zgaruvchilarning ko'paytmasidan iborat ifoda (yoki alohida son yoki o'zgaruvchi) <strong>birhad</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5a<sup>2</sup>b, &nbsp; −3xy, &nbsp; 7, &nbsp; m — birhadlar. &nbsp; a + b — birhad emas.</div>"
                ),
                secText("Standart shakl",
                  "<div class='lecture-rule'><strong>Qoida:</strong> birhad <strong>standart shakl</strong>da bo'lishi uchun: bitta sonli koeffitsient oldinda, so'ng har bir harf bir marta daraja bilan yozilishi kerak.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 · a · 2 · a · b = 6a<sup>2</sup>b.</div>"
                ),
                secText("Birhadning darajasi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> birhaddagi barcha harflar ko'rsatkichlarining yig'indisi uning <strong>darajasi</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 6a<sup>2</sup>b<sup>3</sup> birhadning darajasi 2 + 3 = 5.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>−2x<sup>3</sup>y va 5xy<sup>2</sup> birhadlar ko'paytmasini standart shaklga keltiring. Natijaning darajasi nechaga teng?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "birhadlarni-kopaytirish-bolish", title: "Birhadlarni ko'paytirish va bo'lish", page: "12-bet",
              sections: [
                secText("Birhadlarni ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> koeffitsientlarni alohida ko'paytiramiz, bir xil harflarni daraja xossasi bo'yicha (ko'rsatkichlarni qo'shib) birlashtiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (−3a<sup>2</sup>b) · (4ab<sup>3</sup>) = −12a<sup>3</sup>b<sup>4</sup>.</div>"
                ),
                secText("Birhadni birhadga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> koeffitsientlarni bo'lamiz, bir xil harflar ko'rsatkichlarini ayiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 15x<sup>5</sup>y<sup>3</sup> : (3x<sup>2</sup>y) = 5x<sup>3</sup>y<sup>2</sup>.</div>"
                ),
                secText("Birhadni darajaga ko'tarish",
                  "<div class='lecture-example'><strong>Misol:</strong> (−2a<sup>3</sup>b)<sup>2</sup> = 4a<sup>6</sup>b<sup>2</sup>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Birhad 8a<sup>4</sup>b<sup>6</sup> ga teng. U qaysi ikki birhadning ko'paytmasi bo'lishi mumkin? Kamida uch xil variant yozing.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kophadlar-tushunchasi", title: "Ko'phadlar", page: "12-bet",
              sections: [
                secText("Ko'phad ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir nechta birhadning algebraik yig'indisi <strong>ko'phad</strong> deyiladi. Uni tashkil qiluvchi birhadlar ko'phadning <strong>hadlari</strong>dir.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x<sup>2</sup> − 5x + 7 — uch hadli ko'phad (trinom); &nbsp; a + b — ikki hadli (binom).</div>"
                ),
                secText("Standart shakl va daraja",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'phad <strong>standart shakl</strong>da bo'lishi uchun har bir hadi standart birhad bo'lishi va o'xshash hadlar ixchamlangan bo'lishi kerak. Ko'phad <strong>darajasi</strong> — uning hadlari darajalarining eng kattasi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4x + 2x<sup>3</sup> − x<sup>3</sup> + 1 = x<sup>3</sup> + 4x + 1 — darajasi 3.</div>"
                ),
                secText("Ko'phadning qiymati",
                  "<div class='lecture-example'><strong>Misol:</strong> P(x) = x<sup>2</sup> − 3x + 2 da x = 4: &nbsp; 16 − 12 + 2 = 6.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>P(x) = x<sup>2</sup> − 5x + 6 ko'phad qaysi x larda 0 ga teng bo'ladi? Bir nechta butun son sinab ko'ring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "oxshash-hadlar-ixchamlash", title: "O'xshash hadlar va ularni ixchamlash", page: "12-bet",
              sections: [
                secText("O'xshash hadlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> harfiy qismi (harflari va ularning darajalari) bir xil bo'lgan hadlar <strong>o'xshash hadlar</strong> deyiladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5a<sup>2</sup>b va −7a<sup>2</sup>b — o'xshash; &nbsp; 3xy va 3x<sup>2</sup>y — o'xshash emas.</div>"
                ),
                secText("Ixchamlash qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'xshash hadlarni ixchamlash uchun ularning koeffitsientlarini qo'shamiz, harfiy qismini o'zgartirmaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5a<sup>2</sup>b − 7a<sup>2</sup>b + 2a<sup>2</sup>b = 0 · a<sup>2</sup>b = 0.</div>"
                ),
                secText("Aralash misol",
                  "<div class='lecture-example'><strong>Misol:</strong> 3x<sup>2</sup> + 2x − 5 + x<sup>2</sup> − 2x + 8 = 4x<sup>2</sup> + 3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>2x<sup>2</sup> − 3x + a + bx<sup>2</sup> + 5x − 4 ifoda ixchamlanganidan keyin 3x + 1 ga teng bo'lsin. a va b ni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kophadlarni-qoshish-ayirish", title: "Ko'phadlarni qo'shish va ayirish", page: "12-bet",
              sections: [
                secText("Qo'shish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'phadlarni qo'shish uchun qavslarni ochamiz («+» oldidagi qavs o'zgarishsiz) va o'xshash hadlarni ixchamlaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (3x<sup>2</sup> − 2x + 1) + (x<sup>2</sup> + 5x − 4) = 4x<sup>2</sup> + 3x − 3.</div>"
                ),
                secText("Ayirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ayirilayotgan ko'phadning qavsi oldida «−» turadi — qavs ochilganda uning barcha hadlari ishorasi o'zgaradi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (5a − 3) − (2a − 7) = 5a − 3 − 2a + 7 = 3a + 4.</div>"
                ),
                secText("Natijaning darajasi",
                  "<div class='lecture-example'><strong>Misol:</strong> (x<sup>3</sup> + 2x) + (−x<sup>3</sup> + 5) = 2x + 5 — bosh hadlar qisqarib, daraja pasaydi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>A = 2x<sup>2</sup> − x + 3, B = x<sup>2</sup> + 4x − 1. A − B va B − A ni toping. Ular orasida qanday bog'lanish bor?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kophadlarni-kopaytirish", title: "Ko'phadlarni ko'paytirish", page: "12-bet",
              sections: [
                secText("Birhadni ko'phadga ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> birhadni ko'phadning har bir hadiga ko'paytirib, natijalarni qo'shamiz: a(b + c) = ab + ac.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x(2x − 5) = 6x<sup>2</sup> − 15x.</div>"
                ),
                secText("Ko'phadni ko'phadga ko'paytirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> birinchi ko'phadning har bir hadini ikkinchisining har bir hadiga ko'paytiramiz, so'ng o'xshash hadlarni ixchamlaymiz: (a + b)(c + d) = ac + ad + bc + bd.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 3)(x − 2) = x<sup>2</sup> − 2x + 3x − 6 = x<sup>2</sup> + x − 6.</div>"
                ),
                secText("Uch hadli misol",
                  "<div class='lecture-example'><strong>Misol:</strong> (x − 1)(x<sup>2</sup> + x + 1) = x<sup>3</sup> + x<sup>2</sup> + x − x<sup>2</sup> − x − 1 = x<sup>3</sup> − 1.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(x + a)(x + b) ko'paytmani hisoblang. Natijadagi x koeffitsienti va ozod had a, b bilan qanday bog'langan?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kophadlarni-bolish", title: "Ko'phadlarni bo'lish", page: "12-bet",
              sections: [
                secText("Ko'phadni birhadga bo'lish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'phadning har bir hadini birhadga bo'lib, natijalarni qo'shamiz: (a + b) : c = a/c + b/c.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (6x<sup>3</sup> − 9x<sup>2</sup> + 3x) : (3x) = 2x<sup>2</sup> − 3x + 1.</div>"
                ),
                secText("Qoldiqli bo'linish tushunchasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ko'phadlarni «ustun» usulida bo'lish mumkin: P(x) = D(x) · Q(x) + R(x), bunda R ning darajasi D nikidan kichik.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x<sup>2</sup> + 5x + 6) : (x + 2) = x + 3 (qoldiqsiz).</div>"
                ),
                secText("Bo'linuvchanlik",
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>2</sup> − 9 ifoda (x − 3) ga bo'linadi, chunki x<sup>2</sup> − 9 = (x − 3)(x + 3).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(x<sup>3</sup> − 8) ifodani (x − 2) ga bo'ling. Natijani ko'paytirib, javobni tekshiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kophadni-kopaytuvchilarga-ajratish", title: "Ko'phadni ko'paytuvchilarga ajratish", page: "12-bet",
              sections: [
                secText("Umumiy ko'paytuvchini qavs tashqarisiga chiqarish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> barcha hadlarda uchraydigan umumiy ko'paytuvchini aniqlab, uni qavs oldiga chiqaramiz: ab + ac = a(b + c).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 10x<sup>3</sup> − 15x<sup>2</sup> = 5x<sup>2</sup>(2x − 3).</div>"
                ),
                secText("Guruhlash usuli",
                  "<div class='lecture-rule'><strong>Qoida:</strong> hadlarni umumiy ko'paytuvchisi bor juftlarga ajratamiz, keyin umumiy qavsni chiqaramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>3</sup> + x<sup>2</sup> + x + 1 = x<sup>2</sup>(x + 1) + (x + 1) = (x + 1)(x<sup>2</sup> + 1).</div>"
                ),
                secText("Ajratishning ma'nosi",
                  "<p>Ko'paytuvchilarga ajratish tenglamalarni yechish, kasrlarni qisqartirish va ifodalarni soddalashtirishda asosiy vositadir.</p>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>ax − ay + bx − by − cx + cy ifodani ko'paytuvchilarga ajrating.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "yigindi-ayirma-kvadrati", title: "Yig'indining kvadrati va ayirmaning kvadrati", page: "57-bet",
              sections: [
                secText("Formulalar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>; &nbsp; (a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>.</div>"
                ),
                secText("Geometrik ma'no",
                  "<div class='lecture-figure'>" +
                    "<svg width='150' height='150' viewBox='0 0 150 150'>" +
                      "<rect x='15' y='15' width='120' height='120' fill='none' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='95' y1='15' x2='95' y2='135' stroke='#4f5bd5' stroke-width='1.5'/>" +
                      "<line x1='15' y1='95' x2='135' y2='95' stroke='#4f5bd5' stroke-width='1.5'/>" +
                      "<rect x='15' y='15' width='80' height='80' fill='#eef0fb'/>" +
                      "<rect x='95' y='95' width='40' height='40' fill='#e6f7f4'/>" +
                      "<text x='55' y='58' font-size='12' text-anchor='middle' fill='#4f5bd5'>a²</text>" +
                      "<text x='115' y='118' font-size='12' text-anchor='middle' fill='#16a394'>b²</text>" +
                      "<text x='115' y='58' font-size='11' text-anchor='middle' fill='#6b7280'>ab</text>" +
                      "<text x='55' y='118' font-size='11' text-anchor='middle' fill='#6b7280'>ab</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Tomoni (a + b) bo'lgan kvadrat yuzi a<sup>2</sup>, b<sup>2</sup> va ikkita ab yuzli qismlarga bo'linadi.</p>"
                ),
                secText("Qo'llash",
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 5)<sup>2</sup> = x<sup>2</sup> + 10x + 25; &nbsp; (3a − 2)<sup>2</sup> = 9a<sup>2</sup> − 12a + 4; &nbsp; 101<sup>2</sup> = (100 + 1)<sup>2</sup> = 10201.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a + b = 7 va ab = 10 bo'lsa, a<sup>2</sup> + b<sup>2</sup> ni toping. (Maslahat: (a + b)<sup>2</sup> formulasidan foydalaning.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kvadratlar-ayirmasi", title: "Kvadratlar ayirmasi", page: "57-bet",
              sections: [
                secText("Formula",
                  "<div class='lecture-rule'><strong>Formula:</strong> a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>2</sup> − 25 = (x − 5)(x + 5); &nbsp; 9a<sup>2</sup> − 16 = (3a − 4)(3a + 4).</div>"
                ),
                secText("Tez hisoblashda qo'llash",
                  "<div class='lecture-example'><strong>Misol:</strong> 53 · 47 = (50 + 3)(50 − 3) = 50<sup>2</sup> − 3<sup>2</sup> = 2500 − 9 = 2491.</div>"
                ),
                secText("Ko'paytuvchilarga ajratishda",
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>4</sup> − 1 = (x<sup>2</sup> − 1)(x<sup>2</sup> + 1) = (x − 1)(x + 1)(x<sup>2</sup> + 1).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ketma-ket ikki natural sonning kvadratlari ayirmasi doim toq son bo'lishini kvadratlar ayirmasi formulasi bilan isbotlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "yigindi-ayirma-kubi", title: "Yig'indining kubi. Ayirmaning kubi", page: "57-bet",
              sections: [
                secText("Formulalar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> (a + b)<sup>3</sup> = a<sup>3</sup> + 3a<sup>2</sup>b + 3ab<sup>2</sup> + b<sup>3</sup>; &nbsp; (a − b)<sup>3</sup> = a<sup>3</sup> − 3a<sup>2</sup>b + 3ab<sup>2</sup> − b<sup>3</sup>.</div>"
                ),
                secText("Qo'llash",
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 2)<sup>3</sup> = x<sup>3</sup> + 6x<sup>2</sup> + 12x + 8; &nbsp; (a − 1)<sup>3</sup> = a<sup>3</sup> − 3a<sup>2</sup> + 3a − 1.</div>"
                ),
                secText("Tez hisoblash",
                  "<div class='lecture-example'><strong>Misol:</strong> 21<sup>3</sup> = (20 + 1)<sup>3</sup> = 8000 + 1200 + 60 + 1 = 9261.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(a + b)<sup>3</sup> va (a − b)<sup>3</sup> ni qo'shsangiz qanday ifoda hosil bo'ladi? Ayirsangiz-chi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kublar-yigindisi-ayirmasi", title: "Kublar yig'indisi va ayirmasi", page: "57-bet",
              sections: [
                secText("Formulalar",
                  "<div class='lecture-rule'><strong>Formulalar:</strong> a<sup>3</sup> + b<sup>3</sup> = (a + b)(a<sup>2</sup> − ab + b<sup>2</sup>); &nbsp; a<sup>3</sup> − b<sup>3</sup> = (a − b)(a<sup>2</sup> + ab + b<sup>2</sup>).</div>" +
                  "<p>Ikkinchi ko'paytuvchi — «to'liqmas kvadrat».</p>"
                ),
                secText("Qo'llash",
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>3</sup> + 8 = (x + 2)(x<sup>2</sup> − 2x + 4); &nbsp; 27a<sup>3</sup> − 1 = (3a − 1)(9a<sup>2</sup> + 3a + 1).</div>"
                ),
                secText("Ifodalarni soddalashtirish",
                  "<div class='lecture-example'><strong>Misol:</strong> (a<sup>3</sup> − b<sup>3</sup>) : (a − b) = a<sup>2</sup> + ab + b<sup>2</sup>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>x<sup>6</sup> − 1 ifodani ko'paytuvchilarga ajrating. (Uni ham kvadratlar ayirmasi, ham kublar ayirmasi/yig'indisi sifatida ko'rish mumkin — natijalarni solishtiring.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kopaytuvchilarga-ajratish-usullari", title: "Ko'paytuvchilarga ajratish usullari", page: "57-bet",
              sections: [
                secText("Usullar ketma-ketligi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) avval <em>umumiy ko'paytuvchi</em>ni chiqarish; 2) <em>qisqa ko'paytirish formulalari</em>ni qo'llash; 3) <em>guruhlash</em>; 4) bu usullarni birga qo'llash.</div>"
                ),
                secText("Aralash misollar",
                  "<div class='lecture-example'><strong>Misol:</strong> 2x<sup>2</sup> − 8 = 2(x<sup>2</sup> − 4) = 2(x − 2)(x + 2).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>3</sup> − x = x(x<sup>2</sup> − 1) = x(x − 1)(x + 1).</div>"
                ),
                secText("Guruhlash bilan formula",
                  "<div class='lecture-example'><strong>Misol:</strong> x<sup>2</sup> + 2xy + y<sup>2</sup> − 9 = (x + y)<sup>2</sup> − 3<sup>2</sup> = (x + y − 3)(x + y + 3).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a<sup>4</sup> + 4 ifodani ko'paytuvchilarga ajrating. (Maslahat: a<sup>4</sup> + 4 = a<sup>4</sup> + 4a<sup>2</sup> + 4 − 4a<sup>2</sup>.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "qisqa-kopaytirish-tatbiqi", title: "Qisqa ko'paytirish formulalarining tatbiqi", page: "57-bet",
              sections: [
                secText("Formulalar to'plami",
                  "<div class='lecture-rule'><strong>Asosiy formulalar:</strong> (a ± b)<sup>2</sup> = a<sup>2</sup> ± 2ab + b<sup>2</sup>; &nbsp; a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b); &nbsp; (a ± b)<sup>3</sup> = a<sup>3</sup> ± 3a<sup>2</sup>b + 3ab<sup>2</sup> ± b<sup>3</sup>; &nbsp; a<sup>3</sup> ± b<sup>3</sup> = (a ± b)(a<sup>2</sup> ∓ ab + b<sup>2</sup>).</div>"
                ),
                secText("Hisoblashni yengillashtirish",
                  "<div class='lecture-example'><strong>Misol:</strong> 98<sup>2</sup> = (100 − 2)<sup>2</sup> = 10000 − 400 + 4 = 9604; &nbsp; 204 · 196 = 200<sup>2</sup> − 4<sup>2</sup> = 39984.</div>"
                ),
                secText("Ifodalarni soddalashtirish",
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 3)<sup>2</sup> − (x − 3)<sup>2</sup> = [(x + 3) − (x − 3)][(x + 3) + (x − 3)] = 6 · 2x = 12x.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Isbotlang: quyidagini isbotlang: n<sup>2</sup> + (n + 1)<sup>2</sup> + (n(n + 1))<sup>2</sup> to'liq kvadrat bo'ladi.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "algebraik-kasr-qisqartirish", title: "Algebraik kasr. Kasrlarni qisqartirish", page: "75-bet",
              sections: [
                secText("Algebraik kasr",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> surati va maxraji ko'phadlardan iborat kasr <strong>algebraik (ratsional) kasr</strong> deyiladi. Maxraj noldan farqli bo'lishi shart.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x + 1)/(x − 2), &nbsp; (a<sup>2</sup> − b<sup>2</sup>)/(a + b).</div>"
                ),
                secText("Kasrning asosiy xossasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kasrning surati va maxrajini bir xil noldan farqli ifodaga ko'paytirish yoki bo'lish mumkin — kasr qiymati o'zgarmaydi.</div>"
                ),
                secText("Qisqartirish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> qisqartirish uchun surat va maxrajni ko'paytuvchilarga ajratamiz va umumiy ko'paytuvchini yo'qotamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x<sup>2</sup> − 9)/(x + 3) = (x − 3)(x + 3)/(x + 3) = x − 3 &nbsp; (x ≠ −3).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>(2x<sup>2</sup> − 2)/(x<sup>2</sup> + 2x + 1) kasrni qisqartiring va JQS ni ko'rsating.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kasrlarni-umumiy-maxrajga-keltirish", title: "Algebraik kasrlarni umumiy maxrajga keltirish", page: "75-bet",
              sections: [
                secText("Umumiy maxraj",
                  "<div class='lecture-rule'><strong>Qoida:</strong> umumiy maxraj — barcha maxrajlarning eng kichik umumiy karralisi. Har bir kasrning surati va maxraji mos <strong>qo'shimcha ko'paytuvchi</strong>ga ko'paytiriladi.</div>"
                ),
                secText("Sonli maxrajlar",
                  "<div class='lecture-example'><strong>Misol:</strong> x/6 va y/4 &nbsp;⇒&nbsp; umumiy maxraj 12: &nbsp; 2x/12 va 3y/12.</div>"
                ),
                secText("Harfiy maxrajlar",
                  "<div class='lecture-example'><strong>Misol:</strong> 1/(x − 1) va 1/(x + 1) &nbsp;⇒&nbsp; umumiy maxraj (x − 1)(x + 1): &nbsp; (x + 1)/[(x−1)(x+1)] va (x − 1)/[(x−1)(x+1)].</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>1/x, 1/(x<sup>2</sup>) va 1/(x<sup>2</sup> − x) kasrlar uchun eng sodda umumiy maxrajni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kasrlarni-qoshish-ayirish", title: "Algebraik kasrlarni qo'shish va ayirish", page: "75-bet",
              sections: [
                secText("Bir xil maxrajli kasrlar",
                  "<div class='lecture-rule'><strong>Formula:</strong> a/c ± b/c = (a ± b)/c.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x/(x+1) − x/(x+1) = 2x/(x+1).</div>"
                ),
                secText("Turli maxrajli kasrlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> avval umumiy maxrajga keltiramiz, so'ng suratlarni qo'shamiz (ayiramiz), natijani qisqartiramiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 1/(x − 1) − 1/(x + 1) = [(x + 1) − (x − 1)] / [(x − 1)(x + 1)] = 2/(x<sup>2</sup> − 1).</div>"
                ),
                secText("Butun ifoda bilan amal",
                  "<div class='lecture-example'><strong>Misol:</strong> 1 + 1/x = x/x + 1/x = (x + 1)/x.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>1/(n(n + 1)) ni 1/n − 1/(n + 1) ko'rinishida yozing. Shu yordamida 1/(1·2) + 1/(2·3) + 1/(3·4) yig'indisini hisoblang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kasrlarni-kopaytirish-bolish", title: "Algebraik kasrlarni ko'paytirish va bo'lish", page: "75-bet",
              sections: [
                secText("Ko'paytirish",
                  "<div class='lecture-rule'><strong>Formula:</strong> (a/b) · (c/d) = (ac)/(bd). Ko'paytirishdan oldin qisqartirish qulay.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x/(x + 2)) · ((x + 2)/(x − 1)) = x/(x − 1).</div>"
                ),
                secText("Bo'lish",
                  "<div class='lecture-rule'><strong>Formula:</strong> (a/b) : (c/d) = (a/b) · (d/c) — ikkinchi kasrning teskarisiga ko'paytiriladi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> (x<sup>2</sup>/y) : (x/y<sup>2</sup>) = (x<sup>2</sup>/y) · (y<sup>2</sup>/x) = xy.</div>"
                ),
                secText("Darajaga ko'tarish",
                  "<div class='lecture-example'><strong>Misol:</strong> (2/x)<sup>3</sup> = 8/x<sup>3</sup>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>((a<sup>2</sup> − b<sup>2</sup>)/(a<sup>2</sup> + ab)) : ((a − b)/a) ifodani soddalashtiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tenglama-va-ildizi", title: "Tenglama va uning ildizi", page: "95-bet",
              sections: [
                secText("Asosiy tushunchalar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> noma'lum qatnashgan tenglik <strong>tenglama</strong>; uni to'g'ri son tengligiga aylantiruvchi noma'lum qiymati tenglamaning <strong>ildizi</strong> (yechimi) deyiladi. Tenglamani yechish — uning barcha ildizlarini topish yoki ildizi yo'qligini ko'rsatish.</div>"
                ),
                secText("Teng kuchli tenglamalar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ildizlari to'plami bir xil bo'lgan tenglamalar <strong>teng kuchli</strong> deyiladi. Ikkala tomonga bir xil son qo'shish/ayirish yoki noldan farqli songa ko'paytirish/bo'lish tenglamani teng kuchlisiga aylantiradi.</div>"
                ),
                secText("Ildizlar soni",
                  "<div class='lecture-example'><strong>Misol:</strong> x + 3 = 5 — bitta ildiz (x = 2); &nbsp; 0 · x = 0 — cheksiz ko'p ildiz; &nbsp; 0 · x = 4 — ildizi yo'q.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>x = 2 tenglamaning ildizi bo'lgan, biroq ko'rinishi bir-biridan farq qiladigan uchta har xil tenglama tuzing.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "bir-nomalumli-chiziqli-tenglamalar", title: "Bir noma'lumli chiziqli tenglamalar", page: "95-bet",
              sections: [
                secText("Ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ax + b = 0 ko'rinishiga keltiriladigan tenglama (a, b — berilgan sonlar, x — noma'lum) <strong>bir noma'lumli chiziqli tenglama</strong> deyiladi.</div>"
                ),
                secText("Yechish",
                  "<div class='lecture-rule'><strong>Qoida:</strong> a ≠ 0 bo'lsa, bitta ildiz: x = −b/a. &nbsp; a = 0, b = 0 bo'lsa — cheksiz ko'p ildiz. &nbsp; a = 0, b ≠ 0 bo'lsa — ildizi yo'q.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 4x − 12 = 0 &nbsp;⇒&nbsp; x = 3.</div>"
                ),
                secText("Keltirib yechish",
                  "<div class='lecture-example'><strong>Misol:</strong> 5x − 3 = 2x + 9 &nbsp;⇒&nbsp; 3x = 12 &nbsp;⇒&nbsp; x = 4. &nbsp; Qavsli: 2(x − 1) = 3x + 4 &nbsp;⇒&nbsp; 2x − 2 = 3x + 4 &nbsp;⇒&nbsp; x = −6.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>ax + 5 = 3x − 1 tenglamaning ildizi bo'lmasligi uchun a ning qiymati qanday bo'lishi kerak?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "al-xorazmiy-usuli", title: "Tenglamalar yechishning al-Xorazmiy usuli", page: "95-bet",
              sections: [
                secText("Tarixiy ma'lumot",
                  "<p>Buyuk vatandoshimiz <strong>Muhammad al-Xorazmiy</strong> (IX asr) «Aljabr va al-muqobala» asarida tenglamalarni yechishning tizimli usulini bayon qilgan. «Algebra» so'zi «al-jabr» (to'ldirish) so'zidan kelib chiqqan.</p>"
                ),
                secText("Al-jabr — to'ldirish",
                  "<div class='lecture-rule'><strong>Qoida (al-jabr):</strong> tenglamaning bir tomonidagi ayirmani yo'qotish uchun ikkala tomonga o'sha hadni qo'shamiz (hadni ikkinchi tomonga ishorasini o'zgartirib o'tkazamiz).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3x − 5 = 10 &nbsp;⇒&nbsp; 3x = 15.</div>"
                ),
                secText("Al-muqobala — qarama-qarshi qo'yish",
                  "<div class='lecture-rule'><strong>Qoida (al-muqobala):</strong> tenglamaning ikkala tomonidagi o'xshash hadlarni qisqartiramiz (bir tomonga to'playmiz).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 7x + 2 = 3x + 14 &nbsp;⇒&nbsp; (al-jabr va al-muqobala) &nbsp; 4x = 12 &nbsp;⇒&nbsp; x = 3.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«Bir sonning yarmiga 10 qo'shsak, o'sha sonning o'zi hosil bo'ladi» — al-Xorazmiy uslubida tenglama tuzib yeching.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "masalalarni-tenglama-yordamida-yechish", title: "Masalalarni tenglama yordamida yechish", page: "95-bet",
              sections: [
                secText("Yechish bosqichlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> 1) noma'lumni x deb belgilash; 2) qolgan kattaliklarni x orqali ifodalash; 3) shartga ko'ra tenglama tuzish; 4) tenglamani yechish; 5) javobni masala shartiga tekshirish.</div>"
                ),
                secText("Sonlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Uch ketma-ket natural sonning yig'indisi 72. Ularni toping. O'rtasi x: (x − 1) + x + (x + 1) = 72 &nbsp;⇒&nbsp; 3x = 72 &nbsp;⇒&nbsp; x = 24. Sonlar: 23, 24, 25.</div>"
                ),
                secText("Ulushlarga oid masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Kitobning 1-kuni 1/3 qismi, 2-kuni qolganining yarmi o'qildi, 60 bet qoldi. Kitobda necha bet? x − x/3 − (2/3·x)/2 = 60 &nbsp;⇒&nbsp; x/3 = 60 &nbsp;⇒&nbsp; x = 180.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Otar va poda: qo'ylar soni echkilardan 4 marta ko'p. Agar 6 ta qo'y sotilsa, qo'ylar echkilardan 3 marta ko'p bo'ladi. Har birida nechtadan bor?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "dekart-koordinatalar-sistemasi", title: "Dekart koordinatalar sistemasi", page: "112-bet",
              sections: [
                secText("Koordinatalar tekisligi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> O nuqtada kesishuvchi va o'zaro perpendikulyar ikki sonlar o'qi <strong>koordinatalar sistemasi</strong>ni hosil qiladi. Gorizontal o'q — <strong>abssissa</strong> (Ox), vertikal o'q — <strong>ordinata</strong> (Oy).</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='170' height='170' viewBox='0 0 170 170'>" +
                      "<line x1='10' y1='85' x2='160' y2='85' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<line x1='85' y1='160' x2='85' y2='10' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<polygon points='160,85 152,81 152,89' fill='#1f2433'/>" +
                      "<polygon points='85,10 81,18 89,18' fill='#1f2433'/>" +
                      "<text x='152' y='100' font-size='11'>x</text>" +
                      "<text x='92' y='20' font-size='11'>y</text>" +
                      "<text x='74' y='100' font-size='10' fill='#6b7280'>O</text>" +
                      "<circle cx='125' cy='45' r='4' fill='#4f5bd5'/>" +
                      "<line x1='125' y1='85' x2='125' y2='45' stroke='#4f5bd5' stroke-dasharray='3 2'/>" +
                      "<line x1='85' y1='45' x2='125' y2='45' stroke='#4f5bd5' stroke-dasharray='3 2'/>" +
                      "<text x='130' y='40' font-size='10' fill='#4f5bd5'>A(3; 4)</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Nuqtaning koordinatalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har bir nuqtaga tartiblangan sonlar jufti A(x; y) mos keladi: x — abssissa, y — ordinata. O nuqta — koordinatalar boshi (0; 0).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> A(3; 4) nuqta Ox bo'ylab 3 birlik o'ngga, Oy bo'ylab 4 birlik yuqoriga.</div>"
                ),
                secText("Choraklar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> o'qlar tekislikni 4 ta chorakka bo'ladi. I: (+; +), II: (−; +), III: (−; −), IV: (+; −).</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>A(1; 1), B(5; 1), C(5; 4) nuqtalarni belgilang. To'rtinchi D nuqtani shunday tanlangki, ABCD to'g'ri to'rtburchak bo'lsin. D ning koordinatalari qanday?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "funksiya-tushunchasi-7sinf", title: "Funksiya tushunchasi", page: "112-bet",
              sections: [
                secText("Funksiya ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> agar x o'zgaruvchining har bir qiymatiga y o'zgaruvchining <em>yagona</em> qiymati mos qo'yilsa, y ni x ning <strong>funksiyasi</strong> deyiladi: y = f(x). x — <strong>argument</strong> (erkli o'zgaruvchi), y — <strong>funksiya qiymati</strong>.</div>"
                ),
                secText("Berilish usullari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> funksiya <em>formula</em> bilan (y = 2x + 1), <em>jadval</em> bilan, <em>grafik</em> bilan yoki <em>so'z</em> bilan berilishi mumkin.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> y = 2x + 1 da x = 3 &nbsp;⇒&nbsp; y = 7, ya'ni f(3) = 7.</div>"
                ),
                secText("Aniqlanish sohasi va grafik",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> argumentning barcha joiz qiymatlari to'plami — funksiyaning <strong>aniqlanish sohasi</strong>. Tekislikda (x; f(x)) nuqtalar to'plami — funksiya <strong>grafigi</strong>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«Har bir o'quvchiga uning bo'yi (sm) mos qo'yiladi» — bu funksiyami? «Har bir bo'yga o'sha bo'yli o'quvchi mos qo'yiladi» — bu-chi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "chiziqli-funksiya", title: "Chiziqli funksiya", page: "112-bet",
              sections: [
                secText("Ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> y = kx + b ko'rinishidagi funksiya <strong>chiziqli funksiya</strong> deyiladi. k — <strong>burchak koeffitsienti</strong> (to'g'ri chiziqning qiyaligi), b — Oy o'qini kesib o'tish nuqtasining ordinatasi.</div>"
                ),
                secText("Grafigi — to'g'ri chiziq",
                  "<div class='lecture-figure'>" +
                    "<svg width='170' height='150' viewBox='0 0 170 150'>" +
                      "<line x1='10' y1='120' x2='160' y2='120' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<line x1='30' y1='140' x2='30' y2='10' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<line x1='15' y1='135' x2='150' y2='30' stroke='#4f5bd5' stroke-width='2.5'/>" +
                      "<circle cx='30' cy='108' r='3.5' fill='#16a394'/>" +
                      "<text x='36' y='104' font-size='10' fill='#16a394'>(0; b)</text>" +
                      "<text x='150' y='134' font-size='11'>x</text>" +
                      "<text x='36' y='20' font-size='11'>y</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> grafik chizish uchun ikkita nuqta yetarli. Odatda x = 0 (y = b) va yana bir qulay x olinadi.</div>"
                ),
                secText("Koeffitsientlarning ma'nosi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> k &gt; 0 — funksiya o'suvchi (chiziq ko'tariladi); k &lt; 0 — kamayuvchi; k = 0 — y = b, Ox ga parallel to'g'ri chiziq. k bir xil bo'lsa, chiziqlar parallel.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> y = 2x − 3: x = 0 da y = −3; x = 2 da y = 1.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>y = kx + b to'g'ri chiziq A(0; 2) va B(2; 0) nuqtalardan o'tadi. k va b ni toping. Bu chiziq III chorakdan o'tadimi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tenglamalar-sistemasi", title: "Chiziqli tenglamalar sistemasi", page: "131-bet",
              sections: [
                secText("Ikki noma'lumli chiziqli tenglama",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ax + by = c ko'rinishidagi tenglama <strong>ikki noma'lumli chiziqli tenglama</strong>. Uning yechimi — tenglikni to'g'ri qiladigan (x; y) juftlik; barcha yechimlari tekislikda to'g'ri chiziqni beradi.</div>"
                ),
                secText("Sistema va uning yechimi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir nechta tenglamani birgalikda qanoatlantiruvchi (x; y) ni topish talab qilinsa, ular <strong>tenglamalar sistemasi</strong>ni tashkil qiladi. Yechim — barcha tenglamalarni bir vaqtda to'g'ri qiladigan juftlik.</div>"
                ),
                secText("Grafik ma'no",
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='140' viewBox='0 0 160 140'>" +
                      "<line x1='10' y1='115' x2='150' y2='115' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<line x1='30' y1='130' x2='30' y2='10' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<line x1='15' y1='40' x2='145' y2='110' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='20' y1='120' x2='140' y2='25' stroke='#16a394' stroke-width='2'/>" +
                      "<circle cx='92' cy='73' r='4' fill='#1f2433'/>" +
                      "<text x='96' y='68' font-size='10'>yechim</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> chiziqlar <em>kesishsa</em> — bitta yechim; <em>parallel</em> bo'lsa — yechim yo'q; <em>ustma-ust</em> tushsa — cheksiz ko'p yechim.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>{ x + y = 5; &nbsp; 2x + 2y = 7 } sistemaning yechimi bormi? Javobingizni grafik yordamida tushuntiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sistema-yechish-usullari", title: "Chiziqli tenglamalar sistemasini yechish usullari", page: "131-bet",
              sections: [
                secText("O'rniga qo'yish usuli",
                  "<div class='lecture-rule'><strong>Qoida:</strong> bir tenglamadan bir noma'lumni ikkinchisi orqali ifodalab, uni boshqa tenglamaga qo'yamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> { y = x + 1; &nbsp; 2x + y = 7 } &nbsp;⇒&nbsp; 2x + (x + 1) = 7 &nbsp;⇒&nbsp; x = 2, y = 3.</div>"
                ),
                secText("Qo'shish (yo'qotish) usuli",
                  "<div class='lecture-rule'><strong>Qoida:</strong> tenglamalarni shunday songa ko'paytiramizki, bir noma'lumning koeffitsientlari qarama-qarshi bo'lsin; so'ng tenglamalarni hadlab qo'shamiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> { 3x + 2y = 16; &nbsp; x − 2y = 0 } &nbsp;⇒&nbsp; qo'shamiz: 4x = 16 &nbsp;⇒&nbsp; x = 4, y = 2.</div>"
                ),
                secText("Grafik usul",
                  "<div class='lecture-rule'><strong>Qoida:</strong> har bir tenglama grafigini chizamiz; kesishish nuqtasining koordinatalari — taxminiy yechim.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>{ 5x − 3y = 1; &nbsp; 2x + y = 8 } sistemani ikki xil usul bilan yeching va natijalarni solishtiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sistema-masalalar", title: "Chiziqli tenglamalar sistemasi yordamida masalalar yechish", page: "131-bet",
              sections: [
                secText("Yechish bosqichlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ikkita noma'lumni x va y deb belgilaymiz; masala shartidan ikkita tenglama tuzamiz; sistemani yechamiz; javobni tekshiramiz.</div>"
                ),
                secText("Ikki sonli masala",
                  "<div class='lecture-example'><strong>Misol:</strong> Ikki sonning yig'indisi 30, ayirmasi 8. { x + y = 30; x − y = 8 } &nbsp;⇒&nbsp; 2x = 38 &nbsp;⇒&nbsp; x = 19, y = 11.</div>"
                ),
                secText("Xarid masalasi",
                  "<div class='lecture-example'><strong>Misol:</strong> 3 daftar va 2 ruchka 26 000 so'm, 2 daftar va 5 ruchka 32 000 so'm. { 3d + 2r = 26000; 2d + 5r = 32000 } &nbsp;⇒&nbsp; d = 6000, r = 4000.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Hovlida tovuq va quyonlar bor: jami 19 ta bosh, 62 ta oyoq. Nechta tovuq, nechta quyon? Sistema tuzib yeching.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kombinatorika-qoidalari", title: "Kombinatorikaning asosiy qoidalari", page: "146-bet",
              sections: [
                secText("Kombinatorika nima?",
                  "<p><strong>Kombinatorika</strong> — berilgan shartlarga ko'ra tuzilishi mumkin bo'lgan turli birlashmalar (variantlar) sonini hisoblaydigan bo'lim.</p>"
                ),
                secText("Yig'indi qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar A obyektni m usulda, B obyektni n usulda tanlash mumkin bo'lsa va bu tanlovlar birga sodir bo'lmasa, «A yoki B» ni tanlash m + n usulda amalga oshadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 xil choy va 4 xil sharbat bor. Bitta ichimlik tanlash: 3 + 4 = 7 usul.</div>"
                ),
                secText("Ko'paytma qoidasi",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar birinchi elementni m usulda, har biriga mos ravishda ikkinchi elementni n usulda tanlash mumkin bo'lsa, juftlikni m · n usulda tuzish mumkin.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<circle cx='25' cy='55' r='4' fill='#4f5bd5'/><text x='10' y='40' font-size='9'>boshlanish</text>" +
                      "<line x1='29' y1='55' x2='80' y2='25' stroke='#4f5bd5'/><line x1='29' y1='55' x2='80' y2='55' stroke='#4f5bd5'/><line x1='29' y1='55' x2='80' y2='85' stroke='#4f5bd5'/>" +
                      "<g fill='#16a394'><circle cx='84' cy='25' r='3.5'/><circle cx='84' cy='55' r='3.5'/><circle cx='84' cy='85' r='3.5'/></g>" +
                      "<g stroke='#16a394'>" +
                        "<line x1='88' y1='25' x2='150' y2='15'/><line x1='88' y1='25' x2='150' y2='35'/>" +
                        "<line x1='88' y1='55' x2='150' y2='45'/><line x1='88' y1='55' x2='150' y2='65'/>" +
                        "<line x1='88' y1='85' x2='150' y2='75'/><line x1='88' y1='85' x2='150' y2='95'/>" +
                      "</g>" +
                      "<text x='158' y='58' font-size='9' fill='#6b7280'>3 · 2 = 6</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 xil ko'ylak va 2 xil shim bilan 3 · 2 = 6 xil kiyim to'plami tuzish mumkin.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>1, 2, 3, 4 raqamlaridan (raqamlar takrorlanmasin) nechta uch xonali son tuzish mumkin? Ko'paytma qoidasidan foydalaning.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kombinatorik-masalalar-turlari", title: "Kombinatorik masalalar turlari", page: "146-bet",
              sections: [
                secText("O'rin almashtirishlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> n ta elementni tartib bilan joylashtirishning barcha usullari <strong>o'rin almashtirishlar</strong> deyiladi. Ularning soni P<sub>n</sub> = n! = 1 · 2 · 3 · … · n.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3 kishi bir qatorga P<sub>3</sub> = 3! = 6 usulda o'tiradi.</div>"
                ),
                secText("O'rinlashtirishlar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> n ta elementdan k tasini <em>tartib bilan</em> tanlash — <strong>o'rinlashtirishlar</strong>: A<sub>n</sub><sup>k</sup> = n · (n − 1) · … · (n − k + 1).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 kishidan 2 tasini (sardor va o'rinbosar) tanlash: A<sub>5</sub><sup>2</sup> = 5 · 4 = 20.</div>"
                ),
                secText("Gruppalashlar (kombinatsiyalar)",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> n ta elementdan k tasini <em>tartibga bog'liq bo'lmagan holda</em> tanlash — <strong>gruppalashlar</strong>: C<sub>n</sub><sup>k</sup> = n! / (k! · (n − k)!).</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 5 kishidan 2 kishilik komissiya: C<sub>5</sub><sup>2</sup> = 10.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>A<sub>n</sub><sup>k</sup> va C<sub>n</sub><sup>k</sup> orasidagi bog'lanishni yozing. Nega A<sub>n</sub><sup>k</sup> = C<sub>n</sub><sup>k</sup> · k! ?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kombinatorik-masalalar-usullari", title: "Kombinatorik masalalarni yechish usullari", page: "146-bet",
              sections: [
                secText("Daraxt (variantlar sxemasi)",
                  "<div class='lecture-rule'><strong>Usul:</strong> barcha variantlarni tarmoqlanuvchi sxema (daraxt) ko'rinishida yozib chiqamiz — kam sonli hollarda qulay.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> tanga 3 marta tashlansa, bosh (B) va yozuv (Y) ketma-ketliklari: BBB, BBY, BYB, BYY, YBB, YBY, YYB, YYY — jami 2<sup>3</sup> = 8.</div>"
                ),
                secText("Qoidalarni birga qo'llash",
                  "<div class='lecture-rule'><strong>Usul:</strong> murakkab masalani bosqichlarga bo'lib, har bir bosqichda yig'indi yoki ko'paytma qoidasini qo'llaymiz.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 0, 1, 2, 3 raqamlaridan takrorlanmaydigan uch xonali toq sonlar: birlar xonasi {1; 3} — 2 usul, yuzlar xonasi 0 emas — 2 usul, o'nlar xonasi — 2 usul; jami 2 · 2 · 2 = 8.</div>"
                ),
                secText("Formulalardan foydalanish",
                  "<div class='lecture-example'><strong>Misol:</strong> 10 kishidan 3 kishilik jamoa necha xil tuziladi? C<sub>10</sub><sup>3</sup> = 120.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>«MATEMATIKA» so'zidagi harflarni qayta joylashtirib nechta har xil «so'z» tuzish mumkin? (Takrorlanuvchi harflarga e'tibor bering.)</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya (2022-yil)",
          topics: [
            {
              id: "eng-sodda-geometrik-shakllar", title: "Eng sodda geometrik shakllar", page: "8-bet",
              sections: [
                secText("Asosiy tushunchalar",
                  "<p><strong>Nuqta</strong> va <strong>to'g'ri chiziq</strong> — planimetriyaning ta'riflanmaydigan asosiy tushunchalari. Nuqta bosh harf bilan (A, B), to'g'ri chiziq kichik harf (a) yoki uning ikki nuqtasi bilan (AB) belgilanadi.</p>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='60' viewBox='0 0 260 60'>" +
                      "<line x1='10' y1='30' x2='250' y2='30' stroke='#1f2433' stroke-width='2'/>" +
                      "<polygon points='250,30 242,26 242,34' fill='#1f2433'/><polygon points='10,30 18,26 18,34' fill='#1f2433'/>" +
                      "<circle cx='70' cy='30' r='3' fill='#4f5bd5'/><text x='70' y='20' font-size='11' text-anchor='middle'>A</text>" +
                      "<circle cx='170' cy='30' r='3' fill='#4f5bd5'/><text x='170' y='20' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='230' y='24' font-size='11' fill='#6b7280'>a</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("To'g'ri chiziqning asosiy xossasi",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ixtiyoriy ikkita nuqta orqali bitta va faqat bitta to'g'ri chiziq o'tkazish mumkin.</div>" +
                  "<div class='lecture-rule'><strong>Aksioma:</strong> ikki to'g'ri chiziq yo bitta umumiy nuqtaga ega (kesishadi), yoki umuman umumiy nuqtaga ega emas.</div>"
                ),
                secText("Nur va kesma",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> to'g'ri chiziqning biror nuqtasi uni ikki <strong>nur</strong>ga ajratadi. To'g'ri chiziqning ikki nuqtasi va ular orasidagi qismi <strong>kesma</strong> deyiladi; bu nuqtalar kesmaning uchlaridir.</div>"
                ),
                secText("Nuqtalarning o'zaro joylashuvi",
                  "<div class='lecture-example'><strong>Misol:</strong> A, B, C nuqtalar bitta to'g'ri chiziqda yotsa va B ular orasida bo'lsa: AB + BC = AC.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Tekislikda 5 ta nuqta berilgan, hech uchtasi bir to'g'ri chiziqda yotmaydi. Ular orqali jami nechta to'g'ri chiziq o'tkaziladi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kesma-taqqoslash-olchash", title: "Kesma. Kesmalarni taqqoslash va o'lchash", page: "17-bet",
              sections: [
                secText("Kesmani o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> kesma uzunligi tanlangan birlik kesma (mm, sm, m) necha marta joylashishini bildiradi. Har bir kesmaning aniq bir uzunligi (musbat son) bo'ladi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='240' height='50' viewBox='0 0 240 50'>" +
                      "<line x1='20' y1='30' x2='200' y2='30' stroke='#4f5bd5' stroke-width='3'/>" +
                      "<line x1='20' y1='22' x2='20' y2='38' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='200' y1='22' x2='200' y2='38' stroke='#1f2433' stroke-width='2'/>" +
                      "<text x='20' y='16' font-size='11' text-anchor='middle'>A</text>" +
                      "<text x='200' y='16' font-size='11' text-anchor='middle'>B</text>" +
                      "<text x='110' y='47' font-size='10' text-anchor='middle' fill='#6b7280'>AB = 6 sm</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Kesmalarni taqqoslash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> ikki kesmani taqqoslash uchun ularni ustma-ust qo'yamiz: bir uchlari va yo'nalishlari mos tushsa, ikkinchi uchlari ham mos tushsa — kesmalar teng. Aks holda ikkinchi uchi ichkarida qolgani kichik.</div>"
                ),
                secText("Kesmaning o'rtasi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesmani ikkita teng kesmaga bo'luvchi nuqta uning <strong>o'rtasi</strong> deyiladi. M — AB ning o'rtasi bo'lsa: AM = MB = AB / 2.</div>"
                ),
                secText("O'lchov birliklari",
                  "<div class='lecture-example'><strong>Misol:</strong> 1 m = 100 sm = 1000 mm. &nbsp; AB = 3 sm 5 mm = 35 mm.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>AC = 12 sm. B nuqta AC kesmada shunday yotadiki, AB dan BC 4 sm katta. AB va BC ni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchak-taqqoslash-olchash", title: "Burchak. Burchaklarni taqqoslash va o'lchash", page: "29-bet",
              sections: [
                secText("Burchak ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> umumiy boshlang'ich nuqtadan (uchdan) chiquvchi ikki nurdan iborat shakl <strong>burchak</strong> deyiladi. Nurlar — tomonlari. Belgilanishi: ∠AOB, ∠O yoki ∠1.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='170' height='110' viewBox='0 0 170 110'>" +
                      "<line x1='25' y1='90' x2='150' y2='90' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='25' y1='90' x2='130' y2='20' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<path d='M65 90 A40 40 0 0 0 52 62' fill='none' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='18' y='95' font-size='11'>O</text>" +
                      "<text x='150' y='103' font-size='11'>A</text>" +
                      "<text x='132' y='16' font-size='11'>B</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Burchakni o'lchash",
                  "<div class='lecture-rule'><strong>Qoida:</strong> burchak <strong>transportir</strong> bilan gradusda (°) o'lchanadi. 1° — yoyiq burchakning 1/180 qismi. Har bir burchakning aniq gradus o'lchovi bor.</div>"
                ),
                secText("Burchaklarni taqqoslash va bissektrisa",
                  "<div class='lecture-rule'><strong>Qoida:</strong> gradus o'lchovi katta bo'lgan burchak katta. <strong>Bissektrisa</strong> — burchak uchidan chiqib, uni ikkita teng burchakka bo'luvchi nur.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ∠AOB = 80°, OC — bissektrisa bo'lsa: ∠AOC = ∠COB = 40°.</div>"
                ),
                secText("Burchaklarni qo'shish",
                  "<div class='lecture-example'><strong>Misol:</strong> OC nur ∠AOB ichida bo'lsa: ∠AOB = ∠AOC + ∠COB.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>∠AOB = 120°. Uning ichidan OC nur o'tkazilganda ∠AOC ∠COB dan 30° katta bo'ldi. Ikkala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "burchak-turlari", title: "Burchakning turlari", page: "45-bet",
              sections: [
                secText("Kattaligiga ko'ra turlari",
                  "<div class='lecture-figure'>" +
                    "<svg width='300' height='90' viewBox='0 0 300 90'>" +
                      "<g stroke='#4f5bd5' stroke-width='2' fill='none'>" +
                        "<path d='M25 75 L25 25'/><path d='M25 75 L65 58'/>" +
                        "<path d='M105 75 L105 25'/><path d='M105 75 L145 75'/>" +
                        "<path d='M185 75 L160 28'/><path d='M185 75 L235 75'/>" +
                        "<path d='M255 55 L295 55'/>" +
                      "</g>" +
                      "<rect x='105' y='63' width='11' height='11' fill='none' stroke='#16a394'/>" +
                      "<text x='40' y='88' font-size='9' text-anchor='middle'>o'tkir</text>" +
                      "<text x='120' y='88' font-size='9' text-anchor='middle'>to'g'ri</text>" +
                      "<text x='205' y='88' font-size='9' text-anchor='middle'>o'tmas</text>" +
                      "<text x='275' y='48' font-size='9' text-anchor='middle'>yoyiq</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir</em> burchak — 0° dan 90° gacha; <em>to'g'ri</em> — aniq 90°; <em>o'tmas</em> — 90° dan 180° gacha; <em>yoyiq</em> — aniq 180°.</div>"
                ),
                secText("Qo'shni burchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bitta tomoni umumiy, qolgan ikki tomoni bir-birining davomi (qo'shni nurlar) bo'lgan burchaklar <strong>qo'shni</strong> deyiladi.</div>" +
                  "<div class='lecture-rule'><strong>Xossa:</strong> qo'shni burchaklar yig'indisi 180°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> biri 65° bo'lsa, qo'shnisi 180° − 65° = 115°.</div>"
                ),
                secText("Vertikal burchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir burchakning tomonlari ikkinchisining tomonlari davomi bo'lgan burchaklar <strong>vertikal</strong> deyiladi.</div>" +
                  "<div class='lecture-rule'><strong>Xossa:</strong> vertikal burchaklar o'zaro teng.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ikki to'g'ri chiziq kesishganda hosil bo'lgan to'rt burchakdan ikkitasining yig'indisi 220°. Bu burchaklar qo'shnimi yoki vertikalmi? Barcha to'rt burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "perpendikulyar-togri-chiziqlar", title: "Perpendikulyar to'g'ri chiziqlar", page: "53-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesishganda to'g'ri (90°) burchak hosil qiladigan ikki to'g'ri chiziq <strong>perpendikulyar</strong> deyiladi. Belgilanishi: a ⊥ b.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='140' height='110' viewBox='0 0 140 110'>" +
                      "<line x1='15' y1='70' x2='125' y2='70' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='70' y2='100' stroke='#1f2433' stroke-width='2'/>" +
                      "<rect x='70' y='55' width='14' height='14' fill='none' stroke='#16a394' stroke-width='1.5'/>" +
                      "<text x='120' y='84' font-size='11'>a</text><text x='58' y='22' font-size='11'>b</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Perpendikulyarning yagonaligi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> berilgan to'g'ri chiziqqa uning tashqarisidagi (yoki ustidagi) berilgan nuqtadan faqat bitta perpendikulyar to'g'ri chiziq o'tkazish mumkin.</div>"
                ),
                secText("Perpendikulyar va og'ma. Masofa",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> nuqtadan to'g'ri chiziqqa tushirilgan perpendikulyar kesmaning uzunligi shu nuqtadan to'g'ri chiziqgacha bo'lgan <strong>masofa</strong> deyiladi. Perpendikulyar har qanday og'madan qisqa.</div>"
                ),
                secText("O'rta perpendikulyar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesmaning o'rtasidan unga perpendikulyar o'tkazilgan to'g'ri chiziq <strong>o'rta perpendikulyar</strong> deyiladi. Uning har bir nuqtasi kesma uchlaridan teng uzoqlikda.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ⊥ c va b ⊥ c bo'lsa, a va b to'g'ri chiziqlar o'zaro qanday joylashgan? Chizma bilan tushuntiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchaklar-turlari-elementlari", title: "Uchburchaklar, ularning turlari va elementlari", page: "72-bet",
              sections: [
                secText("Uchburchak va uning elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir to'g'ri chiziqda yotmaydigan uch nuqta (uchlar) va ularni juft-juft tutashtiruvchi uch kesmadan (tomonlar) tuzilgan shakl <strong>uchburchak</strong> deyiladi.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='120' viewBox='0 0 180 120'>" +
                      "<polygon points='20,100 160,100 60,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='12' y='110' font-size='11'>A</text>" +
                      "<text x='163' y='110' font-size='11'>B</text>" +
                      "<text x='52' y='16' font-size='11'>C</text>" +
                      "<text x='90' y='114' font-size='9' fill='#6b7280'>c</text>" +
                      "<text x='118' y='55' font-size='9' fill='#6b7280'>a</text>" +
                      "<text x='30' y='55' font-size='9' fill='#6b7280'>b</text>" +
                    "</svg>" +
                  "</div>" +
                  "<p>Elementlari: 3 ta uch, 3 ta tomon, 3 ta ichki burchak. Perimetri P = a + b + c.</p>"
                ),
                secText("Tomonlariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>turli tomonli</em> — barcha tomonlari har xil; <em>teng yonli</em> — ikki tomoni (yon tomonlari) teng; <em>teng tomonli</em> — uchala tomoni teng.</div>"
                ),
                secText("Burchaklariga ko'ra turlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> <em>o'tkir burchakli</em> — hamma burchagi o'tkir; <em>to'g'ri burchakli</em> — bitta burchagi 90°; <em>o'tmas burchakli</em> — bitta burchagi o'tmas.</div>"
                ),
                secText("Uchburchakning muhim chiziqlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> uchdan qarama-qarshi tomonga tushirilgan perpendikulyar — <strong>balandlik</strong>; uchni qarama-qarshi tomon o'rtasi bilan tutashtiruvchi kesma — <strong>mediana</strong>; burchak bissektrisasining tomongacha bo'lgan qismi — <strong>bissektrisa</strong>.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Teng tomonli uchburchak bir vaqtning o'zida teng yonli bo'ladimi? Teng yonli uchburchak har doim teng tomonli bo'ladimi? Javobingizni asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-1", title: "Uchburchaklar tengligining birinchi alomati", page: "79-bet",
              sections: [
                secText("Teng uchburchaklar",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ustma-ust qo'yganda to'la mos tushadigan uchburchaklar <strong>teng</strong> deyiladi. Teng uchburchaklarning mos tomonlari va mos burchaklari o'zaro teng.</div>"
                ),
                secText("Birinchi alomat (tomon — burchak — tomon)",
                  "<div class='lecture-figure'>" +
                    "<svg width='260' height='100' viewBox='0 0 260 100'>" +
                      "<polygon points='15,85 105,85 35,25' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<polygon points='150,85 240,85 170,25' fill='#e6f7f4' stroke='#16a394' stroke-width='2'/>" +
                      "<text x='25' y='80' font-size='9' fill='#16a394'>∠</text>" +
                      "<text x='160' y='80' font-size='9' fill='#16a394'>∠</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning ikki tomoni va ular orasidagi burchagi ikkinchi uchburchakning mos ikki tomoni va ular orasidagi burchagiga teng bo'lsa, bunday uchburchaklar teng bo'ladi.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AB = A₁B₁, AC = A₁C₁ va ∠A = ∠A₁ bo'lsa, △ABC = △A₁B₁C₁; demak BC = B₁C₁, ∠B = ∠B₁, ∠C = ∠C₁.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>AB va CD kesmalar O nuqtada kesishib, O ularning o'rtasi bo'lsin. △AOC = △BOD ekanini birinchi alomat yordamida isbotlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "teng-yonli-uchburchak-xossalari", title: "Teng yonli uchburchakning xossalari", page: "82-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> ikki tomoni teng bo'lgan uchburchak <strong>teng yonli</strong> deyiladi. Teng tomonlar — <strong>yon tomonlar</strong>, uchinchisi — <strong>asos</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='150' height='110' viewBox='0 0 150 110'>" +
                      "<polygon points='75,15 25,95 125,95' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='75' y1='15' x2='75' y2='95' stroke='#16a394' stroke-width='1.5' stroke-dasharray='4 3'/>" +
                      "<rect x='75' y='83' width='11' height='12' fill='none' stroke='#16a394'/>" +
                      "<text x='16' y='104' font-size='10'>B</text><text x='128' y='104' font-size='10'>C</text><text x='72' y='12' font-size='10'>A</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Asosidagi burchaklar xossasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> teng yonli uchburchakning asosidagi burchaklari o'zaro teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> uchdagi burchak 40° bo'lsa, asosdagi har bir burchak (180° − 40°) : 2 = 70°.</div>"
                ),
                secText("Bissektrisa — mediana — balandlik",
                  "<div class='lecture-rule'><strong>Teorema:</strong> teng yonli uchburchakda uchidan asosga o'tkazilgan bissektrisa bir vaqtda mediana ham, balandlik ham, o'rta perpendikulyar ham bo'ladi.</div>"
                ),
                secText("Teng tomonli uchburchak",
                  "<div class='lecture-rule'><strong>Natija:</strong> teng tomonli uchburchakning barcha burchaklari teng va har biri 60° ga teng.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Teng yonli uchburchakning asosidagi burchagi yon tomondagi (uchidagi) burchakdan 30° katta. Uchala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-2", title: "Uchburchaklar tengligining ikkinchi alomati", page: "85-bet",
              sections: [
                secText("Ikkinchi alomat (burchak — tomon — burchak)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning bir tomoni va unga yopishgan ikki burchagi ikkinchi uchburchakning mos tomoni va unga yopishgan ikki burchagiga teng bo'lsa, bunday uchburchaklar teng.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AC = A₁C₁, ∠A = ∠A₁ va ∠C = ∠C₁ bo'lsa, △ABC = △A₁B₁C₁.</div>"
                ),
                secText("Amaliy tatbiqi",
                  "<div class='lecture-example'><strong>Misol:</strong> daryoning narigi qirg'og'idagi nuqtagacha masofani, qirg'oqda teng burchaklar va bir tomonni o'lchab, teng uchburchak yasash orqali topish mumkin.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>△ABC da AD — bissektrisa (D ∈ BC) va ∠ADB = ∠ADC bo'lsa, △ABD = △ACD ekanini isbotlang. Bundan qanday xulosa chiqadi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-tenglik-3", title: "Uchburchaklar tengligining uchinchi alomati", page: "87-bet",
              sections: [
                secText("Uchinchi alomat (uch tomon)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> agar bir uchburchakning uch tomoni ikkinchi uchburchakning mos uch tomoniga teng bo'lsa, bunday uchburchaklar teng.</div>"
                ),
                secText("Uchburchakning qat'iyligi",
                  "<div class='lecture-rule'><strong>Natija:</strong> uch tomoni bilan uchburchak yagona aniqlanadi — shakli o'zgarmaydi. Shu sababli uchburchak qurilishlarda mustahkam («qat'iy») shakl hisoblanadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> panjara, kran strelasi va ko'priklar uchburchakli to'rlardan yasaladi.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> AB = CD, BC = AD bo'lsa, △ABC = △CDA (AC — umumiy tomon); demak ∠B = ∠D.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'rtburchak ABCD da AB = CD va BC = AD. Bu to'rtburchak parallelogramm ekanini uchinchi alomat yordamida asoslang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallel-togri-chiziqlar-tushunchasi", title: "Parallel to'g'ri chiziqlar", page: "100-bet",
              sections: [
                secText("Ta'rif",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bir tekislikda yotgan va kesishmaydigan ikki to'g'ri chiziq <strong>parallel</strong> deyiladi. Belgilanishi: a ∥ b.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='70' viewBox='0 0 200 70'>" +
                      "<line x1='15' y1='25' x2='185' y2='25' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='15' y1='50' x2='185' y2='50' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='188' y='22' font-size='10'>a</text><text x='188' y='47' font-size='10'>b</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Parallellik aksiomasi",
                  "<div class='lecture-rule'><strong>Aksioma:</strong> to'g'ri chiziq tashqarisidagi nuqtadan shu to'g'ri chiziqqa parallel bo'lgan faqat bitta to'g'ri chiziq o'tkazish mumkin.</div>"
                ),
                secText("Parallellikning xossalari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> agar ikki to'g'ri chiziq uchinchisiga parallel bo'lsa, ular o'zaro ham parallel. Agar to'g'ri chiziq ikki parallel chiziqdan birini kessa, ikkinchisini ham albatta kesadi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Nima uchun bir tekislikda yotmagan (fazoviy) ikki kesishmaydigan to'g'ri chiziqni parallel deb bo'lmaydi? Misol keltiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "parallellik-alomatlari", title: "Ikki to'g'ri chiziqning parallellik alomatlari", page: "105-bet",
              sections: [
                secText("Kesuvchi va burchaklar",
                  "<div class='lecture-figure'>" +
                    "<svg width='230' height='130' viewBox='0 0 230 130'>" +
                      "<line x1='15' y1='45' x2='215' y2='45' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='15' y1='90' x2='215' y2='90' stroke='#1f2433' stroke-width='2'/>" +
                      "<line x1='70' y1='15' x2='170' y2='120' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<text x='96' y='38' font-size='9' fill='#16a394'>1</text><text x='120' y='38' font-size='9' fill='#16a394'>2</text>" +
                      "<text x='100' y='60' font-size='9' fill='#16a394'>3</text><text x='124' y='60' font-size='9' fill='#16a394'>4</text>" +
                      "<text x='118' y='84' font-size='9' fill='#16a394'>5</text><text x='142' y='84' font-size='9' fill='#16a394'>6</text>" +
                      "<text x='122' y='106' font-size='9' fill='#16a394'>7</text><text x='146' y='106' font-size='9' fill='#16a394'>8</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> kesuvchi 8 burchak hosil qiladi. <em>Ichki almashinuvchi</em>: 3 va 6, 4 va 5. <em>Ichki bir tomonli</em>: 3 va 5, 4 va 6. <em>Mos burchaklar</em>: 1 va 5, 2 va 6, 3 va 7, 4 va 8.</div>"
                ),
                secText("Parallellik alomatlari",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ikki to'g'ri chiziqni kesuvchi kessa va: &nbsp; a) ichki almashinuvchi burchaklar teng bo'lsa, YOKI &nbsp; b) mos burchaklar teng bo'lsa, YOKI &nbsp; d) ichki bir tomonli burchaklar yig'indisi 180° bo'lsa — to'g'ri chiziqlar parallel.</div>"
                ),
                secText("Qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> kesuvchi bilan hosil bo'lgan mos burchaklar 65° va 65° bo'lsa, chiziqlar parallel. Perpendikulyarlik orqali: a ⊥ c va b ⊥ c bo'lsa, a ∥ b.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Ichki bir tomonli burchaklardan biri 110°, ikkinchisi 70°. To'g'ri chiziqlar parallelmi? Endi ikkalasi ham 90° bo'lsa-chi?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "kesuvchi-hosil-qilgan-burchaklar", title: "Ikki parallel to'g'ri chiziq va kesuvchi hosil qilgan burchaklar", page: "109-bet",
              sections: [
                secText("Parallel chiziqlar xossasi (teskari teorema)",
                  "<div class='lecture-rule'><strong>Teorema:</strong> ikki parallel to'g'ri chiziq kesuvchi bilan kesilganda: ichki almashinuvchi burchaklar teng; mos burchaklar teng; ichki bir tomonli burchaklar yig'indisi 180°.</div>"
                ),
                secText("Bitta burchakdan qolganlarini topish",
                  "<div class='lecture-figure'>" +
                    "<svg width='220' height='120' viewBox='0 0 220 120'>" +
                      "<line x1='15' y1='40' x2='205' y2='40' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='15' y1='85' x2='205' y2='85' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='60' y1='15' x2='160' y2='115' stroke='#1f2433' stroke-width='2'/>" +
                      "<text x='92' y='34' font-size='10' fill='#16a394'>70°</text>" +
                      "<text x='120' y='102' font-size='10' fill='#16a394'>70°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> a ∥ b, bir burchak 70° bo'lsa: unga mos va almashinuvchi burchaklar ham 70°, qo'shnilari esa 110°.</div>"
                ),
                secText("Amaliy qo'llanilishi",
                  "<div class='lecture-example'><strong>Misol:</strong> qurilishda parallel devorlarni bir chiziq (nur) bilan tekshirib, mos burchaklarning tengligiga qarab parallellikni nazorat qilinadi.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>a ∥ b. Kesuvchi bilan hosil bo'lgan ikkita mos burchak (2x + 10)° va (3x − 20)° ga teng. x ni va burchaklarni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "uchburchak-ichki-burchaklar-yigindisi", title: "Uchburchakning ichki burchaklari yig'indisi", page: "124-bet",
              sections: [
                secText("Teorema",
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='110' viewBox='0 0 200 110'>" +
                      "<polygon points='30,90 170,90 110,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='70' y1='20' x2='150' y2='20' stroke='#16a394' stroke-width='1.5' stroke-dasharray='4 3'/>" +
                      "<text x='38' y='85' font-size='10' fill='#16a394'>1</text>" +
                      "<text x='155' y='85' font-size='10' fill='#16a394'>2</text>" +
                      "<text x='104' y='34' font-size='10' fill='#16a394'>3</text>" +
                      "<text x='100' y='106' font-size='9' text-anchor='middle' fill='#4f5bd5'>∠1 + ∠2 + ∠3 = 180°</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> har qanday uchburchakning ichki burchaklari yig'indisi <strong>180°</strong> ga teng. (Isbot: uchdan qarama-qarshi tomonga parallel to'g'ri chiziq o'tkazilib, almashinuvchi burchaklardan foydalaniladi.)</div>"
                ),
                secText("Natijalar",
                  "<div class='lecture-rule'><strong>Natijalar:</strong> uchburchakda ko'pi bilan bitta to'g'ri yoki o'tmas burchak bo'ladi; to'g'ri burchakli uchburchakning o'tkir burchaklari yig'indisi 90°; teng tomonli uchburchakning har bir burchagi 60°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> burchaklardan ikkitasi 55° va 65° bo'lsa, uchinchisi 180° − 120° = 60°.</div>"
                ),
                secText("Tashqi burchak teoremasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning tashqi burchagi u bilan qo'shni bo'lmagan ikkita ichki burchak yig'indisiga teng.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> ichki burchaklar 50° va 60° bo'lsa, uchinchi uchdagi tashqi burchak 110°.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchak burchaklari (x)°, (2x)°, (3x)° ko'rinishida. Har birini toping. To'rtburchak uchun burchaklar yig'indisi nechaga teng bo'lishini shu usulda tekshiring.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "togri-burchakli-uchburchaklar", title: "To'g'ri burchakli uchburchaklar", page: "131-bet",
              sections: [
                secText("Elementlari",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> bitta burchagi 90° bo'lgan uchburchak <strong>to'g'ri burchakli</strong> deyiladi. To'g'ri burchak qarshisidagi tomon — <strong>gipotenuza</strong>, qolgan ikki tomon — <strong>katetlar</strong>.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='160' height='110' viewBox='0 0 160 110'>" +
                      "<polygon points='25,90 135,90 25,20' fill='#eef0fb' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<rect x='25' y='76' width='14' height='14' fill='none' stroke='#16a394'/>" +
                      "<text x='70' y='104' font-size='9' fill='#6b7280'>katet</text>" +
                      "<text x='2' y='58' font-size='9' fill='#6b7280'>katet</text>" +
                      "<text x='90' y='48' font-size='9' fill='#6b7280'>gipotenuza</text>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("O'tkir burchaklari",
                  "<div class='lecture-rule'><strong>Xossa:</strong> to'g'ri burchakli uchburchakning ikki o'tkir burchagi o'zaro to'ldiruvchi: ularning yig'indisi 90°.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> bir o'tkir burchak 35° bo'lsa, ikkinchisi 55°.</div>"
                ),
                secText("30° li katet xossasi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> to'g'ri burchakli uchburchakda 30° li burchak qarshisidagi katet gipotenuzaning yarmiga teng. Teskarisi ham o'rinli.</div>"
                ),
                secText("Teng burchakli uchburchaklar tengligi alomatlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> to'g'ri burchakli uchburchaklar teng bo'ladi, agar: ikki kateti mos teng bo'lsa; kateti va gipotenuzasi mos teng bo'lsa; kateti va o'tkir burchagi mos teng bo'lsa; gipotenuzasi va o'tkir burchagi mos teng bo'lsa.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>To'g'ri burchakli uchburchakda bir o'tkir burchak ikkinchisidan 20° katta. Uchala burchakni toping.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "bissektrisa-xossasi", title: "Burchak bissektrisasining xossasi", page: "135-bet",
              sections: [
                secText("Bissektrisa ta'rifi",
                  "<div class='lecture-rule'><strong>Ta'rif:</strong> burchakni ikkita teng burchakka bo'luvchi nur uning <strong>bissektrisasi</strong> deyiladi.</div>"
                ),
                secText("Asosiy xossa",
                  "<div class='lecture-figure'>" +
                    "<svg width='180' height='110' viewBox='0 0 180 110'>" +
                      "<line x1='20' y1='95' x2='165' y2='55' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='20' y1='95' x2='150' y2='95' stroke='#4f5bd5' stroke-width='2'/>" +
                      "<line x1='20' y1='95' x2='170' y2='75' stroke='#16a394' stroke-width='2' stroke-dasharray='5 3'/>" +
                      "<circle cx='120' cy='83' r='3' fill='#1f2433'/>" +
                      "<line x1='120' y1='83' x2='112' y2='69' stroke='#6b7280' stroke-dasharray='2 2'/>" +
                      "<line x1='120' y1='83' x2='120' y2='95' stroke='#6b7280' stroke-dasharray='2 2'/>" +
                      "<text x='18' y='108' font-size='9'>O</text>" +
                    "</svg>" +
                  "</div>" +
                  "<div class='lecture-rule'><strong>Teorema:</strong> burchak bissektrisasining har bir nuqtasi burchak tomonlaridan teng uzoqlikda joylashadi. Teskarisi: burchak tomonlaridan teng uzoqlikdagi ichki nuqta bissektrisada yotadi.</div>"
                ),
                secText("Uchburchak bissektrisalari",
                  "<div class='lecture-rule'><strong>Natija:</strong> uchburchakning uchta ichki bissektrisasi bitta nuqtada kesishadi. Bu nuqta uchburchakka <strong>ichki chizilgan aylana</strong> markazi bo'lib, uchala tomondan teng uzoqlikda.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>OM — ∠AOB ning bissektrisasi. M nuqtadan OA va OB tomonlarga MK va ML perpendikulyarlar tushirilgan. △OKM = △OLM ekanini isbotlang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "tomon-burchak-munosabatlar", title: "Uchburchakning tomonlari va burchaklari orasidagi munosabatlar", page: "138-bet",
              sections: [
                secText("Katta tomon — katta burchak",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning katta tomoni qarshisida katta burchak yotadi; katta burchak qarshisida katta tomon yotadi.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> AB &gt; BC &gt; AC bo'lsa, ∠C &gt; ∠A &gt; ∠B.</div>"
                ),
                secText("Uchburchak tengsizligi",
                  "<div class='lecture-rule'><strong>Teorema:</strong> uchburchakning har bir tomoni qolgan ikki tomoni yig'indisidan kichik: a &lt; b + c, &nbsp; b &lt; a + c, &nbsp; c &lt; a + b.</div>" +
                  "<div class='lecture-example'><strong>Misol:</strong> 3, 4, 8 uzunliklardan uchburchak yasab bo'lmaydi, chunki 3 + 4 = 7 &lt; 8.</div>"
                ),
                secText("Natijalar",
                  "<div class='lecture-rule'><strong>Natija:</strong> teng yonli uchburchakning asosi yon tomonlar yig'indisidan kichik. Ikki nuqtani tutashtiruvchi kesma har qanday siniq chiziqdan qisqa.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Uchburchakning ikki tomoni 5 sm va 9 sm. Uchinchi tomon butun son bo'lsa, u qanday qiymatlar qabul qilishi mumkin?</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
            {
              id: "sirkul-chizgich-yasash", title: "Sirkul va chizg'ich yordamida geometrik yasashga doir masalalar", page: "152-bet",
              sections: [
                secText("Yasash asboblari va shartlari",
                  "<div class='lecture-rule'><strong>Qoida:</strong> geometrik yasashda faqat ikki asbob ishlatiladi: <strong>chizg'ich</strong> (ikki nuqta orqali to'g'ri chiziq o'tkazish) va <strong>sirkul</strong> (markaz va radius bo'yicha aylana chizish). Chizg'ichda bo'linmalardan foydalanilmaydi.</div>"
                ),
                secText("Asosiy yasashlar",
                  "<div class='lecture-rule'><strong>Qoida:</strong> sirkul va chizg'ich bilan quyidagilar yasaladi: berilgan kesmaga teng kesma; berilgan burchakka teng burchak; burchak bissektrisasi; kesmaning o'rta perpendikulyari (va o'rtasi); berilgan to'g'ri chiziqqa perpendikulyar.</div>" +
                  "<div class='lecture-figure'>" +
                    "<svg width='200' height='90' viewBox='0 0 200 90'>" +
                      "<line x1='20' y1='60' x2='180' y2='60' stroke='#1f2433' stroke-width='2'/>" +
                      "<circle cx='70' cy='60' r='38' fill='none' stroke='#4f5bd5' stroke-dasharray='4 3'/>" +
                      "<circle cx='130' cy='60' r='38' fill='none' stroke='#16a394' stroke-dasharray='4 3'/>" +
                      "<line x1='100' y1='18' x2='100' y2='88' stroke='#1f2433' stroke-width='1.5'/>" +
                      "<circle cx='70' cy='60' r='2.5' fill='#4f5bd5'/><circle cx='130' cy='60' r='2.5' fill='#16a394'/>" +
                    "</svg>" +
                  "</div>"
                ),
                secText("Uchburchak yasash",
                  "<div class='lecture-rule'><strong>Uch tomoni bo'yicha:</strong> BC tomonni chizamiz; B dan radiusi AB ga teng, C dan radiusi AC ga teng aylana yoylari o'tkazamiz; ularning kesishgan nuqtasi A. &nbsp; (Yasash mumkinligi shart: har tomon qolgan ikkitasi yig'indisidan kichik.)</div>" +
                  "<div class='lecture-rule'><strong>Ikki tomoni va orasidagi burchagi bo'yicha:</strong> berilgan burchakni yasaymiz, tomonlariga berilgan uzunliklarni sirkul bilan qo'yamiz, hosil bo'lgan nuqtalarni tutashtiramiz.</div>"
                ),
                secText("O'ylab ko'ring. Muammoli topshiriq",
                  "<p>Faqat sirkul va chizg'ich bilan 90°, 45° va 60° li burchaklarni qanday yasash mumkin? Qadamlarni tavsiflang.</p>"
                )
              ],
              lecture: { embedUrl: null }, interactive: null, test: null
            },
          ]
        }
      ]
    },
    {
      id: "8",
      name: "8-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "ratsional-kasrlar", title: "Ratsional kasrlar", lecture: { text: "Algebraik kasrlar ustida amallar.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadrat-ildiz", title: "Kvadrat ildiz", lecture: { text: "Kvadrat ildiz tushunchasi va uning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadrat-tenglama", title: "Kvadrat tenglamalar", lecture: { text: "Kvadrat tenglamalarni yechish formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "kvadratga-keltirish", title: "Kvadrat tenglamalarga keltiriladigan tenglamalar", lecture: { text: "Murakkabroq tenglamalarni kvadrat tenglamaga keltirish.", embedUrl: null }, interactive: null, test: null },
            { id: "tengsizliklar", title: "Tengsizliklar", lecture: { text: "Chiziqli va kvadrat tengsizliklarni yechish.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "tortburchaklar", title: "To'rtburchaklar (parallelogramm, trapetsiya)", lecture: { text: "To'rtburchaklarning turlari va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "yuzalar", title: "Yuzalar", lecture: { text: "Ko'pburchaklarning yuzini hisoblash formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "oxshash-uchburchaklar", title: "O'xshash uchburchaklar", lecture: { text: "Uchburchaklar o'xshashligi alomatlari.", embedUrl: null }, interactive: null, test: null },
            { id: "pifagor-teoremasi", title: "Pifagor teoremasi", lecture: { text: "To'g'ri burchakli uchburchak tomonlari orasidagi bog'lanish.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "9",
      name: "9-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "kvadrat-funksiya", title: "Kvadrat funksiya", lecture: { text: "Kvadrat funksiya grafigi va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "tenglamalar-tengsizliklar-sistemasi", title: "Tenglamalar va tengsizliklar sistemasi", lecture: { text: "Ikkinchi darajali sistemalarni yechish usullari.", embedUrl: null }, interactive: null, test: null },
            { id: "progressiya", title: "Arifmetik va geometrik progressiya", lecture: { text: "Progressiyalarning formulalari va qo'llanilishi.", embedUrl: null }, interactive: null, test: null },
            { id: "darajali-funksiya", title: "Darajali funksiya", lecture: { text: "Darajali funksiyaning xossalari va grafigi.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "vektorlar", title: "Vektorlar", lecture: { text: "Vektor tushunchasi va vektorlar ustida amallar.", embedUrl: null }, interactive: null, test: null },
            { id: "sinus-kosinus-teoremalari", title: "Sinuslar va kosinuslar teoremasi", lecture: { text: "Ixtiyoriy uchburchakda tomon va burchaklar orasidagi bog'lanish.", embedUrl: null }, interactive: null, test: null },
            { id: "muntazam-kopburchaklar", title: "Muntazam ko'pburchaklar", lecture: { text: "Muntazam ko'pburchaklarning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "aylana-uzunligi-doira-yuzi", title: "Aylana uzunligi va doira yuzi", lecture: { text: "Pi soni orqali aylana va doira formulalarini hisoblash.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "10",
      name: "10-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "trigonometrik-funksiyalar", title: "Trigonometrik funksiyalar (sinus, kosinus, tangens)", lecture: { text: "Burchak (gradus) va uzunlik (birlik aylana koordinatasi) orasidagi bog'lanish sifatida sinus va kosinus.", embedUrl: null }, interactive: "lessons/10-algebra-trigonometrik-funksiyalar.html", test: null },
            { id: "trigonometrik-tenglamalar", title: "Trigonometrik tenglamalar", lecture: { text: "Oddiy trigonometrik tenglamalarni yechish.", embedUrl: null }, interactive: null, test: null },
            { id: "korsatkichli-logarifmik", title: "Ko'rsatkichli va logarifmik funksiyalar", lecture: { text: "Ko'rsatkichli va logarifmik funksiyalarning xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "limit-tushunchasi", title: "Limit tushunchasi", lecture: { text: "Ketma-ketlik va funksiya limitiga kirish.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "fazoda-togri-chiziq-tekislik", title: "Fazoda to'g'ri chiziq va tekisliklar", lecture: { text: "Stereometriyaga kirish: fazoviy joylashuv holatlari.", embedUrl: null }, interactive: null, test: null },
            { id: "kopyoqlar", title: "Ko'pyoqlar (prizma, piramida)", lecture: { text: "Prizma va piramidaning tuzilishi va xossalari.", embedUrl: null }, interactive: null, test: null },
            { id: "parallellik-perpendikulyarlik", title: "Parallellik va perpendikulyarlik", lecture: { text: "Fazoda to'g'ri chiziq va tekisliklarning o'zaro joylashuvi.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    },
    {
      id: "11",
      name: "11-sinf",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          topics: [
            { id: "hosila", title: "Hosila va uning tatbiqlari", lecture: { text: "Hosila tushunchasi, funksiyani tekshirishda qo'llanilishi.", embedUrl: null }, interactive: null, test: null },
            { id: "integral", title: "Integral", lecture: { text: "Boshlang'ich funksiya va aniq integral.", embedUrl: null }, interactive: null, test: null },
            { id: "ehtimollar-nazariyasi", title: "Ehtimollar nazariyasi asoslari", lecture: { text: "Ehtimollikni hisoblashning asosiy usullari.", embedUrl: null }, interactive: null, test: null }
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya",
          topics: [
            { id: "aylanish-jismlari", title: "Aylanish jismlari (silindr, konus, shar)", lecture: { text: "Aylanish jismlarining tuzilishi va yoyilmasi.", embedUrl: null }, interactive: null, test: null },
            { id: "yuza-hajm", title: "Ko'pyoqlar va aylanish jismlarining yuzasi, hajmi", lecture: { text: "Fazoviy shakllarning yuza va hajmini hisoblash formulalari.", embedUrl: null }, interactive: null, test: null },
            { id: "fazoda-koordinatalar-vektor", title: "Koordinatalar va vektorlar metodi fazoda", lecture: { text: "Fazoviy masalalarni koordinata va vektor usulida yechish.", embedUrl: null }, interactive: null, test: null }
          ]
        }
      ]
    }
  ]
};
