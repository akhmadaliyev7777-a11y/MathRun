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
            { id: "tub-sonlar-daraja", title: "1.1 Tub sonlar, tub ko'paytuvchilarga ajratish va daraja", page: "1-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "ekub", title: "1.2 Eng katta umumiy bo'luvchi (EKUB)", page: "1-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "ekuk", title: "1.3 Eng kichik umumiy karrali (EKUK)", page: "1-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kvadrat-kub-ildiz", title: "1.4 Sonning kvadrat ildizi va kub ildizi", page: "1-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "manfiy-son-sonlar-oqi", title: "2.1 Manfiy son tushunchasi va sonlar o'qi", page: "27/31-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "butun-sonlar-qoshish-ayirish", title: "2.2 Butun sonlarni qo'shish va ayirish", page: "27/31-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "butun-sonlar-kopaytirish-bolish", title: "2.3 Butun sonlarni ko'paytirish, bo'lish va ular ustida amallar", page: "27/31-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "ratsional-irratsional-haqiqiy-sonlar", title: "2.4 Ratsional, irratsional va haqiqiy sonlar", page: "27/31-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "haqiqiy-sonlar-amallar", title: "2.5 Haqiqiy sonlar ustida amallar", page: "27/31-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "xonagacha-yaxlitlash", title: "3.1 Sonlarni belgilangan xonasigacha yaxlitlash", page: "53/65-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "ahamiyatli-raqamgacha-yaxlitlash", title: "3.2 Sonlarni belgilangan ahamiyatli raqamgacha yaxlitlash", page: "53/65-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "chamalash", title: "3.3 Chamalash", page: "53/65-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "algebraga-kirish", title: "4.1 Algebraga kirish", page: "71/89-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "chiziqli-ifodalarni-soddalashtirish", title: "4.2 Chiziqli ifodalarni soddalashtirish", page: "71/89-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "qavslarni-ochish", title: "4.3 Chiziqli ifodalarda qavslarni ochish", page: "71/89-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kopaytuvchilarga-ajratish", title: "4.4 Algebraik ifodalarni ko'paytuvchilarga ajratish", page: "71/89-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/7-algebra-kopaytuvchilarga-ajratish.html", test: null },
            { id: "sodda-chiziqli-tenglamalar", title: "5.1 Sodda chiziqli tenglamalar", page: "101/123-bet", lecture: { text: null, embedUrl: null }, interactive: "lessons/7-algebra-sodda-chiziqli-tenglamalar.html", test: null },
            { id: "qavs-kasr-chiziqli-tenglamalar", title: "5.2 Qavs va kasrlar qatnashgan chiziqli tenglamalar", page: "101/123-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "sodda-kasr-chiziqli-tenglamalar", title: "5.3 Sodda kasr-chiziqli tenglamalar", page: "101/123-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "tenglama-matnli-masalalar", title: "5.4 Chiziqli tenglama tuzib yechiladigan matnli masalalar", page: "101/123-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "nuqta-togri-chiziq-tekislik", title: "6.1 Nuqta, to'g'ri chiziq va tekislik", page: "127/145-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "burchaklar-tushunchasi", title: "6.2 Burchaklar", page: "127/145-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "parallel-chiziqlar-kesuvchi", title: "6.3 Parallel to'g'ri chiziqlar va kesuvchi", page: "127/145-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchaklar-7sinf", title: "7.1 Uchburchaklar", page: "153/167-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "tortburchaklar-7sinf", title: "7.2 To'rtburchaklar", page: "153/167-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kopburchaklar", title: "7.3 Ko'pburchaklar", page: "153/167-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchak-tortburchak-yasash", title: "7.4 Uchburchak va to'rtburchaklarni yasash", page: "153/167-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
          ]
        },
        {
          id: "algebra",
          name: "Algebra (2022-yil)",
          topics: [
            { id: "sonli-ifodalar", title: "Sonli ifodalar", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "algebraik-ifodalar-tushunchasi", title: "Algebraik ifodalar", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "algebraik-tengliklar-formulalar", title: "Algebraik tengliklar, formulalar", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "qavs-qoidasi-koeffitsiyent", title: "Qavslarni ochish qoidasi va koeffitsiyent", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "arifmetik-amallar-xossalari", title: "Arifmetik amallarning xossalari", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "natural-korsatkichli-daraja", title: "Natural ko'rsatkichli daraja", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "daraja-xossalari", title: "Natural ko'rsatkichli darajaning xossalari", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "birhad-standart-shakli", title: "Birhad va uning standart shakli", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "birhadlarni-kopaytirish-bolish", title: "Birhadlarni ko'paytirish va bo'lish", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kophadlar-tushunchasi", title: "Ko'phadlar", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "oxshash-hadlar-ixchamlash", title: "O'xshash hadlar va ularni ixchamlash", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kophadlarni-qoshish-ayirish", title: "Ko'phadlarni qo'shish va ayirish", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kophadlarni-kopaytirish", title: "Ko'phadlarni ko'paytirish", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kophadlarni-bolish", title: "Ko'phadlarni bo'lish", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kophadni-kopaytuvchilarga-ajratish", title: "Ko'phadni ko'paytuvchilarga ajratish", page: "12-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "yigindi-ayirma-kvadrati", title: "Yig'indining kvadrati va ayirmaning kvadrati", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kvadratlar-ayirmasi", title: "Kvadratlar ayirmasi", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "yigindi-ayirma-kubi", title: "Yig'indining kubi. Ayirmaning kubi", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kublar-yigindisi-ayirmasi", title: "Kublar yig'indisi va ayirmasi", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kopaytuvchilarga-ajratish-usullari", title: "Ko'paytuvchilarga ajratish usullari", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "qisqa-kopaytirish-tatbiqi", title: "Qisqa ko'paytirish formulalarining tatbiqi", page: "57-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "algebraik-kasr-qisqartirish", title: "Algebraik kasr. Kasrlarni qisqartirish", page: "75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kasrlarni-umumiy-maxrajga-keltirish", title: "Algebraik kasrlarni umumiy maxrajga keltirish", page: "75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kasrlarni-qoshish-ayirish", title: "Algebraik kasrlarni qo'shish va ayirish", page: "75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kasrlarni-kopaytirish-bolish", title: "Algebraik kasrlarni ko'paytirish va bo'lish", page: "75-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "tenglama-va-ildizi", title: "Tenglama va uning ildizi", page: "95-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "bir-nomalumli-chiziqli-tenglamalar", title: "Bir noma'lumli chiziqli tenglamalar", page: "95-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "al-xorazmiy-usuli", title: "Tenglamalar yechishning al-Xorazmiy usuli", page: "95-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "masalalarni-tenglama-yordamida-yechish", title: "Masalalarni tenglama yordamida yechish", page: "95-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "dekart-koordinatalar-sistemasi", title: "Dekart koordinatalar sistemasi", page: "112-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "funksiya-tushunchasi-7sinf", title: "Funksiya tushunchasi", page: "112-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "chiziqli-funksiya", title: "Chiziqli funksiya", page: "112-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "tenglamalar-sistemasi", title: "Chiziqli tenglamalar sistemasi", page: "131-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "sistema-yechish-usullari", title: "Chiziqli tenglamalar sistemasini yechish usullari", page: "131-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "sistema-masalalar", title: "Chiziqli tenglamalar sistemasi yordamida masalalar yechish", page: "131-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kombinatorika-qoidalari", title: "Kombinatorikaning asosiy qoidalari", page: "146-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kombinatorik-masalalar-turlari", title: "Kombinatorik masalalar turlari", page: "146-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kombinatorik-masalalar-usullari", title: "Kombinatorik masalalarni yechish usullari", page: "146-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
          ]
        },
        {
          id: "geometriya",
          name: "Geometriya (2022-yil)",
          topics: [
            { id: "kesma-taqqoslash-olchash", title: "Kesma. Kesmalarni taqqoslash va o'lchash", page: "17-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "burchak-taqqoslash-olchash", title: "Burchak. Burchaklarni taqqoslash va o'lchash", page: "29-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "burchak-turlari", title: "Burchakning turlari", page: "45-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "perpendikulyar-togri-chiziqlar", title: "Perpendikulyar to'g'ri chiziqlar", page: "53-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchak-tenglik-1", title: "Uchburchaklar tengligining birinchi alomati", page: "79-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "teng-yonli-uchburchak-xossalari", title: "Teng yonli uchburchakning xossalari", page: "82-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchak-tenglik-2", title: "Uchburchaklar tengligining ikkinchi alomati", page: "85-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchak-tenglik-3", title: "Uchburchaklar tengligining uchinchi alomati", page: "87-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "parallel-togri-chiziqlar-tushunchasi", title: "Parallel to'g'ri chiziqlar", page: "100-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "parallellik-alomatlari", title: "Ikki to'g'ri chiziqning parallellik alomatlari", page: "105-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "kesuvchi-hosil-qilgan-burchaklar", title: "Ikki parallel to'g'ri chiziq va kesuvchi hosil qilgan burchaklar", page: "109-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "uchburchak-ichki-burchaklar-yigindisi", title: "Uchburchakning ichki burchaklari yig'indisi", page: "124-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "togri-burchakli-uchburchaklar", title: "To'g'ri burchakli uchburchaklar", page: "131-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "bissektrisa-xossasi", title: "Burchak bissektrisasining xossasi", page: "135-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "tomon-burchak-munosabatlar", title: "Uchburchakning tomonlari va burchaklari orasidagi munosabatlar", page: "138-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
            { id: "sirkul-chizgich-yasash", title: "Sirkul va chizg'ich yordamida geometrik yasashga doir masalalar", page: "152-bet", lecture: { text: null, embedUrl: null }, interactive: null, test: null },
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
