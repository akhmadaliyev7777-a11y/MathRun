/* Ma'ruza chizmalari — sahifadagi data-* atributlardan SVG/HTML yasaydi.
   Hammasi KaTeX'dan OLDIN ishlaydi (formulalar \( \) ichida qoldiriladi).

   data-ld="a/b" [data-x="3"]     — burchak usulida bo'lish a : b, verguldan keyin ko'pi bilan x xona
   data-xk="a/b/c/d/k"             — a/b = c/d, surat va maxraj k ga ko'paytiriladi (strelkali sxema)
   data-kataklar="n" [data-jami]   — 10×10 (yoki 10×jami/10) katak, n tasi bo'yalgan; [data-ustun="6"] — bir qatordagi kataklar soni (bo'lmasa 10)
       [data-ranglar="ko'k:24,sariq:31"] — bir nechta rang: har rangdan shuncha katak ketma-ket (kataklar="n" e'tiborga olinmaydi);
                                          ranglar: ko'k, sariq, yashil, qizil, binafsha, to'q sariq, pushti
       [data-joylash="ustun"] — ustunma-ustun bo'yaladi; [data-joylash="aralash"] — kataklar tarqoq (har safar bir xil joylashuv)
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
       "matn":{"P":[x,y],...} — shu nuqtada (katak birligida) soha nomi yoziladi (masalan shakl ichidagi P, Q sohalar)
       "ustkatak":1 — katak chiziqlari bo'yalgan shakllar ichida ham to'qroq chiziladi (kataklarni sanash uchun)
       "ranglar":["#e3f5ec",...] — shakllar ranglari (tartib bilan; berilmasa — odatdagi 4 rang)
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
   data-meyor="5 min|600 sahifa" [data-yoz="?"] — me'yor sxemasi: yuqorida k birlik — jami miqdor, pastda 1 birlik — me'yor (jami : k);
                                          yoz="?" bo'lsa — me'yor o'rniga savol belgisi (mashq uchun)
   data-meyor="1 soat|16 000 so'm" data-kop="8" [data-yoz="?"] — teskari sxema: 1 birlik — me'yor, k birlik — me'yor × k (k = data-kop)
   data-vaqt="10:00|12:30" [data-bosh="60"] [data-qadam="30"] — vaqt chizig'i: boshlanish va tugash vaqti; dastlabki bosh daqiqa ko'k,
                                          keyingi har qadam daqiqa to'q sariq (raqamlangan); yarim soatlar soni pastda yoziladi
   data-uchburchak="Jami miqdor|Me'yor|Birliklar soni" — uch miqdor sxemasi: tepada jami, pastda me'yor va birliklar soni;
                                          yopib topiladigan qoida (jami = me'yor · soni; me'yor = jami : soni; soni = jami : me'yor) pastda yoziladi
   data-grafik="1:12,2:24,3:36" data-x="Vaqt (soat)" data-y="Masofa (km)" [data-xmax="4"] [data-ymax="48"] [data-yqadam="12"] [data-xqadam="1"] [data-bosh="30"] [data-nom="Velosipedchi"] —
                                          chiziqli grafik: nuqtalar (x:y) va ularni to'g'ri chiziq (0 dan; bosh berilsa — tik o'qdagi shu nuqtadan); tik o'qda yqadam, gorizontal o'qda xqadam oralig'ida belgilar
   data-foiz="60" [data-pastki="hammasi"] [data-sor="20,40"] [data-mayda="1"] [data-belgi="1"] — foiz tasmasi (o'lchov tasmasi):
                                          tepada 0%…100% (har 10%), tasma 10 bo'lakka bo'lingan, 60% gacha yashil bo'yalgan (0 — bo'yalmaydi);
                                          pastda o'nli kasrlar: odatda 0; 0,5; 1 — pastki="hammasi" bo'lsa 0; 0,1; …; 1,0;
                                          sor — shu foizlar ostida o'nli kasr o'rniga «?» katakcha; mayda="1" — har 1% da kichik chiziq;
                                          belgi="1" — bo'yalgan qism oxirida uchburchak va «60%» yozuvi
   data-foizbar="Qizlar:55|O'g'il bolalar:45" [data-jami="600 o'quvchi"] [data-qiymat="?|"] — foizli tasma modeli: butun tasma = 100%,
                                          har bo'lak "nomi:foizi" (o'z rangida, nomi ichida, foizi ostida); jami — tepada butun tasma ustida qavs bilan;
                                          qiymat — har bo'lak ustidagi yozuv ("|" bilan, bo'sh — yozilmaydi; "?" — so'roq)
       (foizbar: bo'laklar yig'indisi 100 dan oshsa — masalan "Narx:100|QQS:12" — tasma 112% ga cho'ziladi, 100% joyida punktir)
   data-foizyol="30:60" [data-orqali="10"] [data-birlik="ta"] [data-yoz="?"] [data-tasma="1"] — foiz zinasi (bitta qism ma'lum — butunni topish):
                                          qatorlar «30% → 60», «10% → 20», «100% → 200»; qatorlar orasida ikki tomonda bir xil amal (: 3, × 10).
                                          orqali — oraliq foiz (100 ning bo'luvchisi); berilmasa: 100 foizga bo'linsa — to'g'ridan-to'g'ri (25% → × 4),
                                          aks holda 10% yoki 5% yoki 1%; "1" — 1% orqali. Foiz 100 dan katta bo'lishi mumkin (112:1 344 000).
                                          Kasr qism: data-foizyol="3/8:57" — «3/8 → 57», «1/8 → 19», «butun → 152».
                                          yoz="?" — oxirgi qiymat «?»; yoz="??" — oraliq va oxirgi qiymat «?» (mashq uchun);
                                          tasma="1" — ustida tasma: tepada 0%, ma'lum foiz, 100%; oraliq foizli kataklar (ma'lumlari to'q sariq,
                                          qolgani punktir, ≤ 10 katak bo'lsa ichida qiymati), ostida ma'lum qism va butun (100%) qavslari.
                                          Test rasmlari uchun aynan shu chizmani _reja/tools/foizyol_svg.py yasaydi.
   data-chek="Kurtka:420000|Shim:180000" [data-qqs="12"] [data-chegirma="10"] [data-nom="Kiyim do'koni"] — xarid cheki:
                                          mahsulotlar va narxlari, jami; chegirma va/yoki QQS foizi berilsa — miqdori va yakuniy summa o'zi hisoblanadi
       data-ustunli ga: [data-qiymat="1"] — har ustun ustida qiymati; [data-ortacha="240"] — o'rtacha qiymat qizil punktir chiziq bilan
   data-likop="2,7,6" [data-nom="shirinlik"] — likopchalardagi buyumlar (o'rtacha qiymat): tepada berilgan holat, ortiqchalari ajratilgan;
                                          jami likopchalar soniga bo'linsa — pastda teng taqsimlangan holat (ko'chirilganlari to'q sariq)
   data-nurlar='{"nur":{"A":180,"B":0,"C":90},"yoy":[["A","C","90°"],["C","B","?"]],"markaz":"O"}' — bir nuqtadan chiqqan nurlar:
       "nur": nom → yo'nalish (gradus, 0 — o'ngga, 90 — tepaga, soat strelkasiga teskari); nomi bo'sh ("") bo'lsa yozilmaydi;
       "yoy": [nur1, nur2, yozuv, (rang)] — nur1 dan nur2 gacha (soat strelkasiga teskari) yoy va yozuv; yozuv "90°" va "tik":1 bo'lsa — kvadratcha;
       "markaz": markaz nomi; "transportir": 1 — markazga transportir qo'yiladi (asosi 0°–180° chizig'ida, ichki va tashqi shkala);
       "olcham": nur uzunligi (px, odatda 120)
   data-shakl='{"nuqta":{"A":[0,0],"B":[6,0],"C":[3,5]},"tomon":{"AB":"6 cm"},"belgi":{"AB":1,"AC":1},"burchak":{"A":"60°"},"tik":["B"]}' —
       ko'pburchak (uchburchak, to'rtburchak): nuqta — uchlar tartibda (y tepaga); tomon — tashqarida yozuv; belgi — teng tomon shtrixlari (1/2/3);
       burchak — ichkarida yoy va yozuv; tik — to'g'ri burchak belgisi; "diag":[["A","C"]] — qo'shimcha kesma; "olcham": 260 (eng uzun o'lcham, px).
       Test rasmlari uchun aynan shu chizmani _reja/tools/shakl_svg.py yasaydi.
       Bir nechta uchburchak: "shakllar":["ABC","ACD"]; "diag":[["B","D","togri"]] — qalin to'g'ri chiziq; "yoy":[["B","A","C","40°",(rang),(radius)]] — A uchida
       AB va AC orasidagi burchak (yozuv "90°" — kvadratcha); "tik":["BAC"] — istalgan to'g'ri burchak; "joy":{"A":[dx,dy]} — nom joyini qo'lda berish (px);
       "par":{"AB":1,"DC":1} — parallel tomonlar strelkasi (a → b yo'nalishda; 2 — ikkinchi juft, qo'sh strelka).
   data-aylana='{"nuqta":{"A":90,"B":270,"D":0},"markaz":"O","kesma":[["A","B","#12805c","diametr"],["O","D","#d6454f","4 cm"]],"izoh":[["Aylana",40]]}' — doira va aylana elementlari:
       "nuqta": nom → aylanadagi joyi (gradus, 0 — o'ngda, 90 — tepada); "markaz": markaz nomi ("" — nomsiz nuqta); "olcham": radius (px, odatda 90);
       "tur": "doira" (bo'yalgan, odatda) | "aylana" (bo'yalmagan) | "yarim" | "chorak" ("bosh": boshlanish burchagi, yarim — 180, chorak — 0;
       "toliq":1 — butun aylana punktir); "kesma": [nuqta1, nuqta2, rang, yozuv, ("punktir"), (yozuv joyi 0..1), (-1 — yozuv narigi tomonda)];
       "ichki":"ABCD" — aylanadagi nuqtalardan ko'pburchak; "izoh": [[matn ("|" — yangi qator), burchak, (masofa)]] — tashqarida chiziqcha bilan yozuv;
       burchak o'rniga "O" — markazdan, 4-element — yo'nalish; "markazJoy": [dx, dy] — markaz nomi joyi.
       "doiralar": [[x, y, r], ...] — qo'shimcha doiralar; "ramka": [x1, y1, x2, y2] — to'g'ri to'rtburchak (kvadrat);
       "olchov": [[x1, y1, x2, y2, "54 mm"], ...] — o'lcham chizig'i (hammasi radius birligida, markaz (0,0), y tepaga).
   data-yoyish='{"d":"d","bolak":1,"yozuv":"aylana uzunligi"}' — doira to'g'ri chiziq bo'ylab dumalab, 1 (yoki "marta":n) marta to'liq aylanadi:
       g'ildirak (shina, kegaylar, shinada aylanish strelkasi, qizil nuqta) — saytda aylanib yuradi, chop etish/PDF'da boshida turadi; oxirida punktir doira,
       bosib o'tilgan yo'l (= aylana uzunligi) qizil; "d" — diametr yozuvi (yoki "r" — radius);
       "bolak":1 — yo'l ostida 3 ta diametr (d, d, d) va yashil «ozgina» qoldiq; "chizgich":22 — ostida 0..22 cm chizg'ich;
       "marta":3 — n ta aylanish bo'lagi (1, 2, 3), "davomi":1 — oxirida «…»; "ustki" — tepadagi yozuv; "yozuv" — pastki o'lcham yozuvi; "olcham" — radius (px).
   data-yoy='{"yol":[["y",0,0,5,0,180,"yoy"],["k",-5,0,5,0,"10 cm","d"]]}' — yoylar va kesmalardan tuzilgan yopiq shakl (yarim/chorak doira va ulardan tuzilgan shakllar):
       "yol": chegara bo'laklari ketma-ket (shakl bo'yaladi): ["y", cx, cy, r, a0, a1, yozuv, (-1)] — markazi (cx, cy), radiusi r bo'lgan yoy, a0 dan a1 gacha
       (gradus, 0 — o'ngda, 90 — tepada; a1 > a0 — soat strelkasiga teskari), ko'k; ["k", x1, y1, x2, y2, yozuv, rol, (-1)] — kesma: rol "d" — yashil (diametr),
       "r" — qizil (radius), boshqasi qora; yozuv shakldan tashqariga qo'yiladi (-1 — narigi tomonga); "rang":0 — butun chegara qora.
       "ichki": [[x1, y1, x2, y2, yozuv, rol, (-1)]] — shakl ichidagi punktir chiziq (perimetrga kirmaydi); "nuqta": {"O": [x, y, (dx, dy)]} — nuqta va nomi;
       "olchov": [[x1, y1, x2, y2, yozuv, sx, sy]] — o'lcham chizig'i (sx, sy ga surilgan); "ramka": [[x1, y1, x2, y2]] — punktir to'g'ri to'rtburchak;
       "toliq": [[cx, cy, r]] — punktir to'liq aylana; "olcham": 1 birlik (px, odatda 14). Koordinatalar birlikda, y tepaga.
   data-ulush="2/3:4" — kasrni natural songa bo'lish doirada: b ta qalin bo'lak, a tasi n kishiga rangli bo'linadi; punktir — b·n mayda bo'lak.
   data-sigim="2:3/4" yoki "3/4:1/8" — bo'luvchi bo'linuvchida necha marta bor (tasma): har butun — alohida tasma, umumiy maxrajgacha
       mayda kataklar (asl bo'laklar chegarasi qalin); bo'linuvchi qismi bo'luvchi kattaligidagi guruhlarga bo'yaladi (1, 2, 3 ...),
       chala qolgan guruh yashil va uning kasri (masalan 2/3) yoziladi.
   data-tarozi="2x + 4|20" — pallali tarozi (tenglama): chapda va o'ngda harfli qutilar va birlik toshlar (24 dan katta son yoki data-dona dan katta — bitta katta tosh).
   data-plitka="3y + 2y − 4" [data-kesish="1"] — algebraik plitkalar: harfli had — uzun plitka, son — kichik kvadratlar, orasida belgilar;
       kesish="1" — o'xshash hadlar bitta qatorda, ayrilganlari ustidan qizil chiziq (6y − 4y: 6 ta, 4 tasi chizilgan).
   data-model='{"q":[["Ali",[["x",3],["10",2]]],["Vali",[["?",5]]]],"jami":{"0":"?"}}' — chizmali model (algebra): har qator [nom, bo'laklar];
       bo'lak [yozuv, uzunlik(, rang)]; yozuv "?" — punktir bo'sh bo'lak; jami {qator: yozuv} — qator ustida qavs va yozuv.
       Qo'shimcha (ixtiyoriy): "qavs":[[qator, boshi, oxiri, yozuv, "past"|"ust"]] — qatorning bir qismi (boshi..oxiri, bo'lak uzunligi birligida)
       ostida yoki ustida qavs va yozuv; "ong":"700" — o'ng tomonda barcha qatorlarni qamrab oluvchi tik qavs (ikkalasining jami);
       "chiziq":[2, 4] — qatorlar orqali o'tuvchi punktir tik chiziqlar (shu birlik joyida; teng qismlar chegarasi).
   data-yasash='{"tur":"bb","nom":["B","C","A"],"asos":5,"burchak":[50,45],"qadam":2}' — uchburchakni qadamma-qadam chizish:
       tur "bb" — asos va unga yopishgan ikki burchak (4 qadam: kesma, chap uchda transportir, o'ng uchda transportir, kesishish nuqtasi);
       tur "tbt" — ikki tomon va ular orasidagi burchak ("burchak":60, "tomon":5; 3 qadam: kesma, transportir, tomonni o'lchab tutashtirish);
       tur "tik" — to'g'ri burchak chap uchda ("tomon":5; 2-qadamda uchburchakli chizg'ich); nom — [chap uch, o'ng uch, uchinchi uch];
       asos/tomon — cm; "qadam" — nechanchi qadam (bo'lmasa — tayyor); "xomaki":1 — qo'lda chamalab chizilgan (to'lqinli) chizma;
       "yozuv":["5 cm","?"] — asos va tomon yozuvini almashtirish; "olcham": 1 cm necha px (odatda 40). Yangi qadam chizig'i to'q sariq.
       To'rtburchak: tur "pg" — parallelogramm/romb (nom: [chap past, o'ng past, o'ng yuqori, chap yuqori], "asos", "tomon", "burchak":50 — chap pastki uchda;
       4 qadam: asos, burchak+tomon, parallel tomon, tutashtirish); tur "tr" — trapetsiya ("burchak":[chap, o'ng], "tomon" — chap yon tomon;
       4 qadam: asos, chap burchak+tomon, o'ng burchak nuri, asosga parallel kesma). "qadam" yo'q — tayyor chizma.
   data-birlash="Olma:3,Nok:2|Nok:5,Behi:4" [data-natija="Olma,Nok,Behi"] [data-bosqich="1|2|3"] — ikki nisbatni uch hadli
       nisbatga birlashtirish (tasmalar): ikkala juftda qatnashgan nom — umumiy miqdor (istalgan o'rinda: A:B|B:C, A:B|A:C, A:C|B:C),
       EKUK o'zi hisoblanadi. 1-bosqich — berilgan juftlar (umumiy miqdor tasmasi ikkala juftda bir xil uzunlikda); 2 — bo'laklar
       punktir bilan mayda bo'lakchalarga bo'linadi, o'ngda «×k»; 3 — uch tasma va natija a : b : c (natija — shu tartibda nomlar,
       bo'lmasa: 1-juft, keyin 2-juftdagi yangi nom). Bir nom — har doim bir rang. bosqich — qaysi bosqichlar chiziladi (odatda hammasi).
   data-ozgar="Oltin:3|Kumush:4 > Oltin:1|Kumush:2" data-tur="bir|jami|farq|teng" [data-ozgarmas="Oltin"] [data-yoz="o:?|k:..|d1:10 ta|o0:..|k0:.."]
       [data-bosqich="1|2|3"] [data-mayda="0"] [data-sarlavha="Oldin|Keyin"] [data-son="-12,-30"] — o'zgaruvchan nisbat: «Oldin» va «Keyin» tasmalari
       bitta masshtabda (birlik — bo'lakcha). O'zgarmas narsa bo'yicha EKUK o'zi hisoblanadi: tur "bir" — data-ozgarmas nomli miqdor
       (bo'lmasa 2-qator), "jami" — yig'indi (a+b va c+d), "farq" — ayirma (|a−b| va |c−d|; katta miqdor almashsa chizilmaydi);
       "teng" — oldin 1 : 1, data-son — har miqdorning o'zgarishi (manfiy — olindi), 1 bo'lak o'zi topiladi.
       Keyin: ortgan qism to'qroq (tur "jami" da — beruvchi rangida), kamaygan qism oq punktir «arvoh» bo'lak.
       yoz: o / k — Oldin / Keyin qatorlarini o'rab oluvchi o'ng qavs; oN / kN — N-qator ustida qavs; dN — N-qatorning o'zgargan qismi ostida qavs.
       bosqich: 1 — faqat Oldin; 2 — Oldin va Keyin (bo'lakcha chiziqlarisiz); 3 — to'liq (bo'laklar ichida punktir bo'lakchalar). mayda="0" — punktirsiz.
       Test savollari uchun aynan shu chizmani _reja/tools/ozgar_svg.py yasaydi.
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
  const KATAK_RANG = { "ko'k": "#1f5fd6", sariq: "#f2b705", yashil: "#12805c", qizil: "#d6454f", binafsha: "#8b5cf6", "to'q sariq": "#e07b39", pushti: "#e879a6" };
  function chizKataklar(el) {
    const jami = Number(el.dataset.jami || 100);
    const u = Number(el.dataset.ustun || 10), qatorlar = Math.ceil(jami / u), s = 22, g = 2;
    const W = u * s + 2 * g, H = qatorlar * s + 2 * g;
    /* har katakning rangi: ketma-ket ranglar ro'yxati, keyin tartib bo'yicha joylashtiriladi */
    const ranglar = el.dataset.ranglar
      ? el.dataset.ranglar.split(",").map(function (q) { const i = q.lastIndexOf(":"); return [KATAK_RANG[q.slice(0, i).trim()] || "#12805c", Number(q.slice(i + 1))]; })
      : [["#12805c", Number(el.dataset.kataklar)]];
    const ketma = [];
    ranglar.forEach(function (r) { for (let k = 0; k < r[1]; k++) ketma.push(r[0]); });
    const n = ketma.length;
    let joy = [];
    for (let i = 0; i < jami; i++) joy.push(i);
    if (el.dataset.joylash === "ustun") joy = joy.map(function (i) { return (i % qatorlar) * u + Math.floor(i / qatorlar); }).filter(function (i) { return i < jami; });
    if (el.dataset.joylash === "aralash") {
      let t = 12345 + n * 7;
      for (let i = joy.length - 1; i > 0; i--) { t = (t * 1103515245 + 12345) % 2147483648; const j = t % (i + 1); const v = joy[i]; joy[i] = joy[j]; joy[j] = v; }
    }
    const rang = new Array(jami).fill(null);
    for (let k = 0; k < n && k < joy.length; k++) rang[joy[k]] = ketma[k];
    let h = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="' + jami + " ta katakdan " + n + ' tasi bo\'yalgan">';
    for (let i = 0; i < jami; i++) {
      const x = g + (i % u) * s, y = g + Math.floor(i / u) * s;
      h += '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" fill="' + (rang[i] || "#fff") + '" fill-opacity="' + (rang[i] ? 0.78 : 1) + '" stroke="#9aa3b5" stroke-width="1"/>';
    }
    h += '<rect x="' + g + '" y="' + g + '" width="' + u * s + '" height="' + qatorlar * s + '" fill="none" stroke="#1f2433" stroke-width="2"/></svg>';
    el.classList.add("chz");
    el.innerHTML = h;
  }

  // ---------- foiz tasmasi ----------
  function chizFoiz(el) {
    const p = Number(el.dataset.foiz) || 0;
    const sor = (el.dataset.sor || "").split(",").filter(Boolean).map(Number);
    const hammasi = el.dataset.pastki === "hammasi", mayda = el.dataset.mayda === "1", belgi = el.dataset.belgi === "1";
    const W = 560, x0 = 30, x1 = 530, k = (x1 - x0) / 100, yT = 50, yB = 92, top = belgi ? 26 : 0;
    const X = function (v) { return x0 + v * k; };
    let h = '<svg viewBox="0 0 ' + W + " " + (136 + top) + '" width="' + W + '" role="img" aria-label="Foiz tasmasi: 0% dan 100% gacha, ' + p + '% bo\'yalgan">';
    h += '<g transform="translate(0,' + top + ')">';
    if (p > 0) h += '<rect x="' + x0 + '" y="' + yT + '" width="' + p * k + '" height="' + (yB - yT) + '" fill="#12805c" fill-opacity=".55"/>';
    h += '<line x1="' + x0 + '" y1="' + (yT - 8) + '" x2="' + x1 + '" y2="' + (yT - 8) + '" stroke="#1f2433" stroke-width="1.6"/>';
    if (mayda) for (let v = 0; v <= 100; v++) if (v % 10) h += '<line x1="' + X(v) + '" y1="' + (yT - 12) + '" x2="' + X(v) + '" y2="' + (yT - 8) + '" stroke="#5b6577" stroke-width="1"/>';
    for (let v = 0; v <= 100; v += 10) {
      h += '<line x1="' + X(v) + '" y1="' + (yT - 16) + '" x2="' + X(v) + '" y2="' + (yT - 8) + '" stroke="#1f2433" stroke-width="1.6"/>';
      h += '<text x="' + X(v) + '" y="' + (yT - 20) + '" text-anchor="middle" font-size="19" font-weight="800" fill="#1f5fd6">' + v + "%</text>";
      if (v > 0 && v < 100) h += '<line x1="' + X(v) + '" y1="' + yT + '" x2="' + X(v) + '" y2="' + yB + '" stroke="#1f2433" stroke-width="1.2"/>';
    }
    h += '<rect x="' + x0 + '" y="' + yT + '" width="' + (x1 - x0) + '" height="' + (yB - yT) + '" fill="none" stroke="#1f2433" stroke-width="2"/>';
    const past = hammasi ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : [0, 50, 100];
    past.forEach(function (v) {
      if (sor.indexOf(v) >= 0) {
        h += '<rect x="' + (X(v) - 22) + '" y="' + (yB + 6) + '" width="44" height="30" rx="6" fill="#fff4e5" stroke="#e07b39" stroke-width="1.5"/>';
        h += '<text x="' + X(v) + '" y="' + (yB + 28) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#e07b39">?</text>';
      } else {
        const t = v === 0 ? "0" : v === 100 ? (hammasi ? "1,0" : "1") : (v % 10 === 0 && hammasi ? "0," + v / 10 : "0," + v / 10);
        h += '<text x="' + X(v) + '" y="' + (yB + 28) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#e07b39">' + t + "</text>";
      }
    });
    if (belgi && p > 0) {
      h += '<path d="M' + X(p) + " " + (yT - 26) + " l-7 -12 h14 z" + '" fill="#12805c" transform="translate(0,-8)"/>';
      h += '<text x="' + X(p) + '" y="' + (yT - 46) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#12805c">' + p + "%</text>";
    }
    h += "</g></svg>";
    el.classList.add("chz");
    el.innerHTML = h;
  }

  // ---------- foizli tasma modeli ----------
  function chizFoizbar(el) {
    const bol = el.dataset.foizbar.split("|").map(function (q) { const i = q.lastIndexOf(":"); return [q.slice(0, i), Number(q.slice(i + 1))]; });
    const qiy = (el.dataset.qiymat || "").split("|");
    const jami = el.dataset.jami || "";
    const RANG = ["#1f5fd6", "#e07b39", "#12805c", "#8b5cf6", "#d6454f"];
    const jamiF = bol.reduce(function (t, b) { return t + b[1]; }, 0);
    const W = 560, x0 = 20, x1 = 540, k = (x1 - x0) / Math.max(100, jamiF), top = jami ? 46 : 0, y0 = top + 46, y1 = y0 + 58;
    let h = '<svg viewBox="0 0 ' + W + " " + (y1 + 44) + '" width="' + W + '" role="img" aria-label="Foizli tasma modeli">';
    if (jami) {
      h += '<path d="M' + x0 + ' 46 v-9 H' + (x0 + jamiF * k) + ' v9" fill="none" stroke="#1f2433" stroke-width="2"/>';
      h += '<text x="' + (x0 + jamiF * k / 2) + '" y="28" text-anchor="middle" font-size="25" font-weight="800" fill="#1f2433">' + jami + " = " + jamiF + "%</text>";
    }
    let x = x0;
    bol.forEach(function (b, i) {
      const w = b[1] * k, c = RANG[i % RANG.length];
      h += '<rect x="' + x + '" y="' + y0 + '" width="' + w + '" height="' + (y1 - y0) + '" fill="' + c + '" fill-opacity=".8" stroke="#fff" stroke-width="2"/>';
      const fs = w > b[0].length * 13 + 10 ? 22 : (w > b[0].length * 9.5 + 6 ? 16 : 0);
      if (fs) h += '<text x="' + (x + w / 2) + '" y="' + (y0 + (fs === 22 ? 37 : 35)) + '" text-anchor="middle" font-size="' + fs + '" font-weight="800" fill="#fff">' + b[0] + "</text>";
      h += '<text x="' + (x + w / 2) + '" y="' + (y1 + 30) + '" text-anchor="middle" font-size="24" font-weight="800" fill="' + c + '">' + b[1] + "%</text>";
      const q = (qiy[i] || "").trim();
      if (q) {
        h += '<path d="M' + (x + 4) + " " + (y0 - 4) + " v-8 H" + (x + w - 4) + " v8" + '" fill="none" stroke="' + c + '" stroke-width="2"/>';
        h += '<text x="' + (x + w / 2) + '" y="' + (y0 - 18) + '" text-anchor="middle" font-size="25" font-weight="800" fill="' + c + '">' + q + "</text>";
      }
      x += w;
    });
    h += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (jamiF * k) + '" height="' + (y1 - y0) + '" fill="none" stroke="#1f2433" stroke-width="2"/>';
    if (jamiF > 100) h += '<line x1="' + (x0 + 100 * k) + '" y1="' + (y0 - 6) + '" x2="' + (x0 + 100 * k) + '" y2="' + (y1 + 6) + '" stroke="#1f2433" stroke-width="3" stroke-dasharray="5 4"/>';
    h += "</svg>";
    el.classList.add("chz");
    el.innerHTML = h;
  }

  // ---------- foiz zinasi: bitta qism ma'lum — butunni topish (30% → 10% → 100%) ----------
  // Python nusxasi: _reja/tools/foizyol_svg.py (test rasmlari uchun) — biri o'zgarsa, ikkinchisi ham.
  function chizFoizyol(el) {
    const s = el.dataset.foizyol, ix = s.lastIndexOf(":");
    const pS = s.slice(0, ix).replace("%", "").trim();
    const m = Number(s.slice(ix + 1).replace(/\s/g, "").replace(",", "."));
    const bir = el.dataset.birlik ? " " + el.dataset.birlik : "", yoz = el.dataset.yoz || "", tasma = el.dataset.tasma === "1";
    const f = function (v) { return String(Math.round(v * 10) / 10); };
    const kasr = pS.indexOf("/") > 0;
    const rows = [], ops = [];
    let a = 0, b = 0, p = 0, d = 0;
    if (kasr) {
      a = Number(pS.split("/")[0]); b = Number(pS.split("/")[1]);
      rows.push({ a: a, b: b, v: m });
      if (a !== 1) { rows.push({ a: 1, b: b, v: m / a }); ops.push(": " + a); }
      rows.push({ t: "butun", v: rows[rows.length - 1].v * b }); ops.push("× " + b);
    } else {
      p = Number(pS.replace(",", "."));
      d = Number(el.dataset.orqali) || (100 % p === 0 ? p : p % 10 === 0 ? 10 : p % 5 === 0 ? 5 : 1);
      rows.push({ t: onliSon(p) + "%", v: m });
      if (d !== p) { rows.push({ t: onliSon(d) + "%", v: m / (p / d) }); ops.push(": " + onliSon(p / d)); }
      rows.push({ t: "100%", v: rows[rows.length - 1].v * (100 / d) }); ops.push("× " + onliSon(100 / d));
    }
    const n = rows.length;
    const yashir = function (i) { return (i === n - 1 && yoz.indexOf("?") >= 0) || (i > 0 && i < n - 1 && yoz === "??"); };
    const qiy = function (i) { return (yashir(i) ? "?" : onliSon(rows[i].v)) + bir; };
    const W = 380;
    let svg = '<defs><marker id="fyq" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#5b6275"/></marker></defs>';
    let top = 0;
    if (tasma) {
      const L = 20, TW = 340;
      const jamiU = kasr ? b : Math.max(p, 100), butunU = kasr ? b : 100, malumU = kasr ? a : p, hujU = kasr ? 1 : d;
      const hujV = kasr ? m / a : m / (p / d);
      const k = TW / jamiU, X = function (u) { return L + u * k; };
      const nh = Math.round(jamiU / hujU), katak = nh <= 20 && Math.abs(jamiU / hujU - nh) < 1e-9;
      if (!kasr) {
        // foiz o'qi: 0%, ma'lum foiz, 100%
        svg += '<line x1="' + L + '" y1="24" x2="' + f(X(jamiU)) + '" y2="24" stroke="#1f2433" stroke-width="1.4"/>';
        if (katak) for (let i = 0; i <= nh; i++) svg += '<line x1="' + f(X(i * hujU)) + '" y1="19" x2="' + f(X(i * hujU)) + '" y2="24" stroke="#5b6275" stroke-width="1.2"/>';
        const yz = [[0, "0%"], [p, onliSon(p) + "%"], [100, "100%"]].sort(function (u, v) { return u[0] - v[0]; });
        const cx = yz.map(function (z) { return X(z[0]); }), wz = yz.map(function (z) { return z[1].length * 8.4; });
        for (let i = 0; i < yz.length; i++) cx[i] = Math.min(Math.max(cx[i], wz[i] / 2 + 1), W - wz[i] / 2 - 1);
        for (let i = yz.length - 2; i >= 0; i--) if (cx[i] + wz[i] / 2 + 4 > cx[i + 1] - wz[i + 1] / 2) cx[i] = cx[i + 1] - wz[i + 1] / 2 - 4 - wz[i] / 2;
        yz.forEach(function (z, i) {
          svg += '<line x1="' + f(X(z[0])) + '" y1="17" x2="' + f(X(z[0])) + '" y2="27" stroke="#1f2433" stroke-width="1.8"/>' +
            '<text x="' + f(cx[i]) + '" y="13" text-anchor="middle" font-size="14" font-weight="800" fill="#1f5fd6">' + z[1] + "</text>";
        });
      }
      if (katak) {
        for (let i = 0; i < nh; i++) {
          const x = X(i * hujU), w = hujU * k, on = (i + 1) * hujU <= malumU + 1e-9;
          svg += '<rect x="' + f(x) + '" y="30" width="' + f(w) + '" height="36" fill="' + (on ? "#ffe6d6" : "#fff") + '" stroke="' + (on ? "#d4501b" : "#9aa3b5") + '" stroke-width="' + (on ? 2 : 1.5) + '"' + (on ? "" : ' stroke-dasharray="5 4"') + "/>";
          const t = onliSon(hujV);
          if (nh <= 10 && yoz !== "??" && t.length * 8.5 + 6 <= w) svg += '<text x="' + f(x + w / 2) + '" y="54" text-anchor="middle" font-size="15" font-weight="800" fill="' + (on ? "#d4501b" : "#8a93a6") + '">' + t + "</text>";
        }
      } else {
        svg += '<rect x="' + L + '" y="30" width="' + f(malumU * k) + '" height="36" fill="#ffe6d6" stroke="#d4501b" stroke-width="2"/>';
        if (malumU < jamiU) svg += '<rect x="' + f(X(malumU)) + '" y="30" width="' + f((jamiU - malumU) * k) + '" height="36" fill="#fff" stroke="#9aa3b5" stroke-width="1.5" stroke-dasharray="5 4"/>';
      }
      svg += '<rect x="' + L + '" y="30" width="' + f(butunU * k) + '" height="36" fill="none" stroke="#1f2433" stroke-width="2"/>';
      if (jamiU > butunU) svg += '<line x1="' + f(X(butunU)) + '" y1="26" x2="' + f(X(butunU)) + '" y2="70" stroke="#1f2433" stroke-width="2.5" stroke-dasharray="5 4"/>';
      svg += '<path d="M' + (L + 2) + ' 70 V78 H' + f(X(malumU) - 2) + ' V70" fill="none" stroke="#d4501b" stroke-width="2"/>' +
        '<text x="' + f((L + X(malumU)) / 2) + '" y="96" text-anchor="middle" font-size="16" font-weight="800" fill="#d4501b">' + onliSon(m) + bir + "</text>";
      svg += '<path d="M' + (L + 2) + ' 104 V112 H' + f(X(butunU) - 2) + ' V104" fill="none" stroke="#12805c" stroke-width="2"/>' +
        '<text x="' + f((L + X(butunU)) / 2) + '" y="130" text-anchor="middle" font-size="16" font-weight="800" fill="#12805c">' + qiy(n - 1) + "</text>";
      top = 142;
    }
    const RH = 84, y0 = top + 30;
    rows.forEach(function (r, i) {
      const y = y0 + i * RH, c = i === 0 ? "#d4501b" : i === n - 1 ? "#12805c" : "#1f5fd6";
      if (r.t) svg += '<text x="24" y="' + y + '" font-size="19" font-weight="800" fill="#1f2433">' + r.t + "</text>";
      else {
        const w = Math.max(String(r.a).length, String(r.b).length) * 11 + 8;
        svg += '<text x="' + f(24 + w / 2) + '" y="' + (y - 12) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + r.a + "</text>" +
          '<line x1="24" y1="' + (y - 6) + '" x2="' + (24 + w) + '" y2="' + (y - 6) + '" stroke="#1f2433" stroke-width="1.8"/>' +
          '<text x="' + f(24 + w / 2) + '" y="' + (y + 10) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + r.b + "</text>";
      }
      svg += '<line x1="96" y1="' + (y - 6) + '" x2="146" y2="' + (y - 6) + '" stroke="#5b6275" stroke-width="2.4" marker-end="url(#fyq)"/>' +
        '<text x="160" y="' + y + '" font-size="19" font-weight="800" fill="' + c + '">' + qiy(i) + "</text>";
      if (i < n - 1) {
        const ya = y + (r.t ? 12 : 18), yb = y + RH - 26, ym = (ya + yb) / 2, op = ops[i], pw = 18 + op.length * 8;
        [44, 180].forEach(function (x) {
          svg += '<line x1="' + x + '" y1="' + ya + '" x2="' + x + '" y2="' + yb + '" stroke="#d4501b" stroke-width="2.4" marker-end="url(#fyq)"/>' +
            '<rect x="' + (x + 10) + '" y="' + f(ym - 13) + '" width="' + pw + '" height="26" rx="13" fill="#ffe6d6" stroke="#d4501b" stroke-width="1.6"/>' +
            '<text x="' + f(x + 10 + pw / 2) + '" y="' + f(ym + 5) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#d4501b">' + op + "</text>";
        });
      }
    });
    const H = y0 + (n - 1) * RH + 18;
    const izoh = el.dataset.izoh || ("Foiz zinasi: " + rows.map(function (r, i) { return (r.t || r.a + "/" + r.b) + " — " + qiy(i); }).join("; "));
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + izoh.replace(/"/g, "") + '">' + svg + "</svg>";
  }

  // ---------- xarid cheki ----------
  function chizChek(el) {
    const satr = el.dataset.chek.split("|").map(function (q) { const i = q.lastIndexOf(":"); return [q.slice(0, i), Number(q.slice(i + 1))]; });
    const qqs = Number(el.dataset.qqs || 0), cheg = Number(el.dataset.chegirma || 0), nom = el.dataset.nom || "Xarid cheki";
    const pul = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"; };
    const W = 360, L = 22, R = W - 22;
    let y = 0, h = "";
    const qator = function (chap, ong, opt) {
      y += opt && opt.oraliq ? opt.oraliq : 30;
      const fw = opt && opt.qalin ? 800 : 600, c = (opt && opt.rang) || "#1f2433", fs = (opt && opt.fs) || 17;
      h += '<text x="' + L + '" y="' + y + '" font-size="' + fs + '" font-weight="' + fw + '" fill="' + c + '">' + chap + "</text>";
      if (ong) h += '<text x="' + R + '" y="' + y + '" text-anchor="end" font-size="' + fs + '" font-weight="' + fw + '" fill="' + c + '">' + ong + "</text>";
    };
    const chiziq = function () { y += 14; h += '<line x1="' + L + '" y1="' + y + '" x2="' + R + '" y2="' + y + '" stroke="#9aa3b5" stroke-width="1.5" stroke-dasharray="4 4"/>'; };
    y = 6; qator(nom, "", { qalin: true, fs: 19, oraliq: 32 });
    chiziq();
    let jami = 0;
    satr.forEach(function (q) { jami += q[1]; qator(q[0], pul(q[1])); });
    chiziq();
    qator(cheg || qqs ? "Jami" : "Jami:", pul(jami), { qalin: true });
    let ox = jami;
    if (cheg) { const c = jami * cheg / 100; qator("Chegirma " + cheg + "%", "− " + pul(c), { rang: "#d6454f" }); ox = jami - c; if (qqs) qator("Chegirmadan keyin", pul(ox)); }
    if (qqs) { const q = ox * qqs / 100; qator("QQS " + qqs + "%", "+ " + pul(q), { rang: "#1f5fd6" }); ox += q; }
    if (cheg || qqs) { chiziq(); qator("To'lanadi", pul(ox), { qalin: true, rang: "#12805c", fs: 19 }); }
    y += 22;
    /* chekning pastki tishli cheti: o'ngdan chapga 12 px li tishlar */
    const tish = function (xo, xc, yy) { let d = "", x = xo, past = true; while (x - 12 > xc) { x -= 12; d += " L" + x + " " + (past ? yy + 8 : yy); past = !past; } return d + " L" + xc + " " + yy; };
    const svg = '<svg viewBox="0 0 ' + W + " " + y + '" width="' + W + '" role="img" aria-label="Xarid cheki">' +
      '<path d="M4 4 H' + (W - 4) + " V" + (y - 10) + tish(W - 4, 4, y - 10) + " Z" + '" fill="#fffdf6" stroke="#c9ced8" stroke-width="1.5"/>' + h + "</svg>";
    el.classList.add("chz");
    el.innerHTML = svg;
  }

  // ---------- likopchalar: teng taqsimlash (o'rtacha qiymat) ----------
  function chizLikop(el) {
    const v = el.dataset.likop.split(",").map(Number), n = v.length;
    const jami = v.reduce(function (t, x) { return t + x; }, 0), urt = jami / n, butun = jami % n === 0;
    const nom = el.dataset.nom || "";
    const maxv = Math.max.apply(null, v.concat([urt])), qat = Math.ceil(maxv / 3);
    const d = 18, pw = 3 * d + 22, gap = 18, Wq = n * pw + (n - 1) * gap, W = Math.max(Wq + 20, 340), x00 = (W - Wq) / 2, hQ = qat * d + 34;
    const H = butun ? hQ * 2 + 66 : hQ + 20;
    const plita = function (x0, y0, son, rang, ajrat) {
      let h = '<ellipse cx="' + (x0 + pw / 2) + '" cy="' + (y0 + hQ - 14) + '" rx="' + (pw / 2) + '" ry="10" fill="#eef1f8" stroke="#9aa3b5" stroke-width="1.5"/>';
      for (let k = 0; k < son; k++) {
        const r = Math.floor(k / 3), c = k % 3;
        const cx = x0 + 11 + c * d + d / 2, cy = y0 + hQ - 24 - r * d;
        const f = rang(k);
        h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (d / 2 - 1.5) + '" fill="' + f + '" stroke="#fff" stroke-width="1.5"' + (ajrat(k) ? ' stroke-dasharray="3 2"' : "") + "/>";
      }
      h += '<text x="' + (x0 + pw / 2) + '" y="' + (y0 + hQ + 12) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + son + "</text>";
      return h;
    };
    let h = "";
    v.forEach(function (son, i) {
      const x0 = x00 + i * (pw + gap);
      h += plita(x0, 0, son, function (k) { return butun && k >= urt ? "#e07b39" : "#1f5fd6"; }, function (k) { return butun && k >= urt; });
    });
    if (butun) {
      h += '<text x="' + W / 2 + '" y="' + (hQ + 34) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#e07b39">↓ teng taqsimlaymiz: ' + jami + " : " + n + " = " + urt + "</text>";
      v.forEach(function (son, i) {
        const x0 = x00 + i * (pw + gap);
        h += plita(x0, hQ + 46, urt, function (k) { return k >= son ? "#e07b39" : "#1f5fd6"; }, function () { return false; });
      });
    }
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="' + n + " ta likopchada " + v.join(", ") + (nom ? " ta " + nom : "") + (butun ? "; teng taqsimlansa har birida " + urt : "") + '">' + h + "</svg>";
  }

  // ---------- nurlar va burchaklar (transportir bilan) ----------
  function chizNurlar(el) {
    const g = JSON.parse(el.dataset.nurlar);
    const R = Number(g.olcham || 135), YOY = ["#1f5fd6", "#e07b39", "#12805c", "#8b5cf6", "#d6454f", "#0e9aa7"];
    const nur = g.nur || {}, yoy = g.yoy || [], tr = !!g.transportir;
    const rad = function (d) { return d * Math.PI / 180; };
    /* chegaralar: nurlar uchlari, transportir bo'lsa yuqori yarim aylana */
    let xs = [0, -30, 30], ys = [-30, 30];
    Object.keys(nur).forEach(function (k) { xs.push(Math.cos(rad(nur[k])) * (R + 22)); ys.push(-Math.sin(rad(nur[k])) * (R + 22)); });
    if (tr) { xs.push(-(R + 4), R + 4); ys.push(-(R + 4)); }
    /* yoy yozuvlari ham chizma ichida qolsin */
    yoy.forEach(function (y) {
      if (!y[2]) return;
      let d = nur[y[1]] - nur[y[0]]; while (d <= 0) d += 360; while (d > 360) d -= 360;
      const ry = d < 35 ? 44 : 32, r = ry + (d < 40 ? 26 : d > 180 ? 36 : 18), m = rad(nur[y[0]] + d / 2);
      const lx = Math.cos(m) * r, ly = -Math.sin(m) * r;
      xs.push(lx - 24, lx + 24); ys.push(ly - 14, ly + 10);
    });
    const pad = 16, minX = Math.min.apply(null, xs) - pad, maxX = Math.max.apply(null, xs) + pad;
    const minY = Math.min.apply(null, ys) - pad, maxY = Math.max.apply(null, ys) + pad + 8;
    const W = maxX - minX, H = maxY - minY, cx = -minX, cy = -minY;
    const P = function (d, r) { return [cx + Math.cos(rad(d)) * r, cy - Math.sin(rad(d)) * r]; };
    let h = "";
    if (tr) {
      const r0 = R * 0.8;
      h += '<path d="M' + (cx - r0) + " " + cy + " A " + r0 + " " + r0 + " 0 0 1 " + (cx + r0) + " " + cy + ' Z" fill="#eef4ff" fill-opacity=".85" stroke="#7a93c9" stroke-width="1.5"/>';
      for (let d = 0; d <= 180; d += 5) {
        const big = d % 10 === 0, a = P(d, r0), b = P(d, r0 - (big ? 10 : 6));
        h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#7a93c9" stroke-width="' + (big ? 1.4 : 1) + '"/>';
        if (big && d % 20 === 0) {
          const t1 = P(d, r0 + 12), t2 = P(d, r0 - 22);
          h += '<text x="' + t1[0] + '" y="' + (t1[1] + 4) + '" text-anchor="middle" font-size="11.5" fill="#5b6577">' + (180 - d) + "</text>";
          h += '<text x="' + t2[0] + '" y="' + (t2[1] + 4) + '" text-anchor="middle" font-size="11.5" fill="#1f5fd6">' + d + "</text>";
        }
      }
    }
    /* yoylar */
    yoy.forEach(function (y, i) {
      const a1 = nur[y[0]], a2 = nur[y[1]];
      let d = a2 - a1; while (d <= 0) d += 360; while (d > 360) d -= 360;
      const c = y[3] || YOY[i % YOY.length], ry = d < 35 ? 44 : 32, mid = a1 + d / 2;
      if (y[2] === "90°" && g.tik !== 0) {
        const q = 16, u = P(a1, q), v = P(a2, q), w = [u[0] + v[0] - cx, u[1] + v[1] - cy];
        h += '<path d="M' + u[0] + " " + u[1] + " L" + w[0] + " " + w[1] + " L" + v[0] + " " + v[1] + '" fill="none" stroke="' + c + '" stroke-width="2"/>';
      } else {
        const s1 = P(a1, ry), s2 = P(a2, ry);
        h += '<path d="M' + cx + " " + cy + " L" + s1[0] + " " + s1[1] + " A " + ry + " " + ry + " 0 " + (d > 180 ? 1 : 0) + " 0 " + s2[0] + " " + s2[1] + ' Z" fill="' + c + '" fill-opacity=".14" stroke="' + c + '" stroke-width="2"/>';
      }
      const t = P(mid, ry + (d < 40 ? 26 : d > 180 ? 36 : 18));
      if (y[2]) h += '<text x="' + t[0] + '" y="' + (t[1] + 5) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + y[2] + "</text>";
    });
    /* nurlar va nomlari */
    Object.keys(nur).forEach(function (k) {
      const e = P(nur[k], R), t = P(nur[k], R + 14);
      h += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="#1f2433" stroke-width="2.4" stroke-linecap="round"/>';
      h += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="3" fill="#1f2433"/>';
      if (k && k.charAt(0) !== "_") h += '<text x="' + t[0] + '" y="' + (t[1] + 6) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#1f2433">' + k + "</text>";
    });
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#1f2433"/>';
    if (g.markaz) {
      /* markaz nomi — nurlar orasidagi eng katta bo'shliq o'rtasida */
      const ay = Object.keys(nur).map(function (k) { return ((nur[k] % 360) + 360) % 360; }).sort(function (p, q) { return p - q; });
      let best = 270, gap = -1;
      ay.forEach(function (a, i) { const nx = i + 1 < ay.length ? ay[i + 1] : ay[0] + 360, gp = nx - a; if (gp > gap) { gap = gp; best = a + gp / 2; } });
      if (ay.length && Math.abs(gap - 180) < 1e-6 && ay.some(function (a) { return Math.abs(a - 180) < 1e-6; })) best = 270;
      /* bo'shliqda yoy bo'lsa — markazga yaqinroq va oq hoshiya bilan */
      const yoyda = yoy.some(function (y) { let a1 = nur[y[0]], d = nur[y[1]] - a1, x = best - a1; while (d <= 0) d += 360; while (x < 0) x += 360; x %= 360; return x < d; });
      const m = P(best, yoyda ? 15 : 20);
      h += '<text x="' + m[0] + '" y="' + (m[1] + 5) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#1f2433" stroke="#fff" stroke-width="4" paint-order="stroke">' + g.markaz + "</text>";
    }
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + W.toFixed(1) + " " + H.toFixed(1) + '" width="' + Math.round(W) + '" role="img" aria-label="Burchaklar chizmasi">' + h + "</svg>";
  }

  // ---------- ko'pburchak: uchlar, teng tomon belgilari, burchaklar ----------
  function chizShakl(el) {
    const g = JSON.parse(el.dataset.shakl);
    const nq = g.nuqta, tomon = g.tomon || {}, belgi = g.belgi || {}, burchak = g.burchak || {}, tik = g.tik || [], diag = g.diag || [];
    const nom = Object.keys(nq), olcham = Number(g.olcham || 260), RANG = "#1f5fd6";
    /* shakllar — bir nechta ko'pburchak (bo'lmasa — barcha nuqtalar bitta ko'pburchak) */
    const shakllar = (g.shakllar || [nom.join("")]).map(function (t) { return t.split(""); });
    const xs = nom.map(function (k) { return nq[k][0]; }), ys = nom.map(function (k) { return nq[k][1]; });
    const mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs), mny = Math.min.apply(null, ys), mxy = Math.max.apply(null, ys);
    const w = (mxx - mnx) || 1, hh = (mxy - mny) || 1, k = olcham / Math.max(w, hh), pad = 44;
    const W = w * k + 2 * pad, H = hh * k + 2 * pad;
    const P = {}; nom.forEach(function (v) { P[v] = [pad + (nq[v][0] - mnx) * k, pad + (mxy - nq[v][1]) * k]; });
    const markaz = function (vs) { return [vs.reduce(function (t, v) { return t + P[v][0]; }, 0) / vs.length, vs.reduce(function (t, v) { return t + P[v][1]; }, 0) / vs.length]; };
    const gx = markaz(nom)[0], gy = markaz(nom)[1];
    const f = function (v) { return v.toFixed(1); };
    let h = "";
    shakllar.forEach(function (sh) { h += '<polygon points="' + sh.map(function (v) { return f(P[v][0]) + "," + f(P[v][1]); }).join(" ") + '" fill="' + RANG + '" fill-opacity=".1" stroke="#1f2433" stroke-width="2.4" stroke-linejoin="round"/>'; });
    diag.forEach(function (d) { h += '<line x1="' + f(P[d[0]][0]) + '" y1="' + f(P[d[0]][1]) + '" x2="' + f(P[d[1]][0]) + '" y2="' + f(P[d[1]][1]) + '" stroke="#1f2433" stroke-width="' + (d[2] === "togri" ? 2.4 : 1.8) + '" stroke-linecap="round"/>'; });
    /* burchak yoyi: V uchida VA va VB nurlar orasida (kichik burchak) */
    const yoyChiz = function (A, V, B, yoz, rang, togri, rad0) {
      const vx = P[V][0], vy = P[V][1];
      let a1 = Math.atan2(P[A][1] - vy, P[A][0] - vx), a2 = Math.atan2(P[B][1] - vy, P[B][0] - vx);
      let d = ((a2 - a1) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      if (d > Math.PI) { const t = a1; a1 = a2; a2 = t; d = 2 * Math.PI - d; }
      const c = rang || "#e07b39";
      if (togri) {
        const q = 13, u = [vx + Math.cos(a1) * q, vy + Math.sin(a1) * q], t = [vx + Math.cos(a2) * q, vy + Math.sin(a2) * q], cc = [u[0] + t[0] - vx, u[1] + t[1] - vy];
        h += '<path d="M' + f(u[0]) + " " + f(u[1]) + " L" + f(cc[0]) + " " + f(cc[1]) + " L" + f(t[0]) + " " + f(t[1]) + '" fill="none" stroke="#d6454f" stroke-width="2"/>';
      } else {
        const r = rad0 || (d < 0.6 ? 30 : 22), s1 = [vx + Math.cos(a1) * r, vy + Math.sin(a1) * r], s2 = [vx + Math.cos(a2) * r, vy + Math.sin(a2) * r];
        h += '<path d="M' + f(vx) + " " + f(vy) + " L" + f(s1[0]) + " " + f(s1[1]) + " A " + r + " " + r + " 0 0 1 " + f(s2[0]) + " " + f(s2[1]) + ' Z" fill="' + c + '" fill-opacity=".18" stroke="' + c + '" stroke-width="1.8"/>';
      }
      if (yoz) {
        const m = a1 + d / 2, rr = (rad0 ? rad0 - 22 : 0) + (d > 0.9 ? 42 : d > 0.6 ? 52 : 60);
        h += '<text x="' + f(vx + Math.cos(m) * rr) + '" y="' + f(vy + Math.sin(m) * rr + 6) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + (c === "#e07b39" ? "#c2410c" : c) + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + yoz + "</text>";
      }
    };
    /* bitta ko'pburchakdagi burchaklar (eski yozuv) */
    const sh0 = shakllar[0], n0 = sh0.length;
    sh0.forEach(function (v, i) {
      if (!(v in burchak) && tik.indexOf(v) < 0) return;
      yoyChiz(sh0[(i - 1 + n0) % n0], v, sh0[(i + 1) % n0], burchak[v], null, tik.indexOf(v) >= 0);
    });
    /* istalgan burchak: "yoy":[["B","A","C","40°"(,rang)]]; to'g'ri burchak: "tik":["BAC"] */
    (g.yoy || []).forEach(function (y) { yoyChiz(y[0], y[1], y[2], y[3], y[4], y[3] === "90°" && g.kvadrat !== 0, y[5]); });
    tik.forEach(function (t) { if (t.length === 3) yoyChiz(t[0], t[1], t[2], "", null, true); });
    /* tomonlar: shtrix va yozuv (har ko'pburchak o'z markaziga nisbatan tashqarida) */
    const bor = {};
    const tomonChiz = function (a, b, m) {
      const key = (a + b) in tomon || (a + b) in belgi ? a + b : b + a;
      if (bor[key]) return; bor[key] = 1;
      const ax = P[a][0], ay = P[a][1], bx = P[b][0], by = P[b][1], mx = (ax + bx) / 2, my = (ay + by) / 2;
      const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L;
      let nx = -uy, ny = ux;
      if ((mx - m[0]) * nx + (my - m[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const cnt = belgi[key] || 0;
      for (let j = 0; j < cnt; j++) {
        const o = (j - (cnt - 1) / 2) * 6, cx = mx + ux * o, cy = my + uy * o;
        h += '<line x1="' + f(cx - nx * 7) + '" y1="' + f(cy - ny * 7) + '" x2="' + f(cx + nx * 7) + '" y2="' + f(cy + ny * 7) + '" stroke="#12805c" stroke-width="2.4"/>';
      }
      const ot = cnt ? 30 : 20;
      if (tomon[key]) h += '<text x="' + f(mx + nx * ot) + '" y="' + f(my + ny * ot + 6) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + RANG + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + tomon[key] + "</text>";
    };
    shakllar.forEach(function (sh) { const m = markaz(sh); sh.forEach(function (a, i) { tomonChiz(a, sh[(i + 1) % sh.length], m); }); });
    /* parallel tomonlar: "par":{"AB":1,"DC":1} — tomon o'rtasida a dan b tomonga qaragan strelka (1 yoki 2 ta) */
    Object.keys(g.par || {}).forEach(function (key) {
      const a = key[0], b = key[1], cnt = g.par[key];
      const ax = P[a][0], ay = P[a][1], bx = P[b][0], by = P[b][1], mx = (ax + bx) / 2, my = (ay + by) / 2;
      const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux;
      for (let j = 0; j < cnt; j++) {
        const o = (j - (cnt - 1) / 2) * 8 + Math.min(22, L * 0.22), cx = mx + ux * o, cy = my + uy * o;
        h += '<path d="M' + f(cx - ux * 8 + nx * 6) + " " + f(cy - uy * 8 + ny * 6) + " L" + f(cx) + " " + f(cy) + " L" + f(cx - ux * 8 - nx * 6) + " " + f(cy - uy * 8 - ny * 6) + '" fill="none" stroke="#8b5cf6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    });
    diag.forEach(function (d) { tomonChiz(d[0], d[1], [gx, gy]); });
    const joy = g.joy || {};
    nom.forEach(function (v) {
      const vx = P[v][0], vy = P[v][1], dx = vx - gx, dy = vy - gy, L = Math.hypot(dx, dy) || 1;
      const t = joy[v] ? [vx + joy[v][0], vy + joy[v][1]] : [vx + dx / L * 18, vy + dy / L * 18 + 6];
      h += '<circle cx="' + f(vx) + '" cy="' + f(vy) + '" r="3" fill="#1f2433"/>';
      if (v.charAt(0) !== "_") h += '<text x="' + f(t[0]) + '" y="' + f(t[1]) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433">' + v + "</text>";
    });
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + f(W) + " " + f(H) + '" width="' + Math.round(W) + '" role="img" aria-label="Shakl chizmasi">' + h + "</svg>";
  }

  // ---------- doira va aylana elementlari: markaz, radius, diametr, yarim/chorak doira ----------
  function chizAylana(el) {
    const g = JSON.parse(el.dataset.aylana);
    const R = Number(g.olcham || 90), tur = g.tur || "doira", nq = g.nuqta || {}, mk = g.markaz;
    const KOK = "#1f5fd6", QORA = "#1f2433", f = function (v) { return v.toFixed(1); };
    const rad = function (d) { return d * Math.PI / 180; };
    const xs = [], ys = [], nuq = function (x, y) { xs.push(x); ys.push(y); };
    const P = {};
    Object.keys(nq).forEach(function (k) { P[k] = [Math.cos(rad(nq[k])) * R, -Math.sin(rad(nq[k])) * R]; });
    if (mk !== undefined) P[mk || "_O"] = [0, 0];
    let h = "", ust = "";
    /* shakl: doira (to'liq), aylana (bo'yalmagan), yarim / chorak (bosh — boshlanish burchagi, soat strelkasiga teskari) */
    if (tur === "yarim" || tur === "chorak") {
      const b0 = Number(g.bosh !== undefined ? g.bosh : (tur === "yarim" ? 180 : 0)), b1 = b0 + (tur === "yarim" ? 180 : 90);
      const a = [Math.cos(rad(b0)) * R, -Math.sin(rad(b0)) * R], c = [Math.cos(rad(b1)) * R, -Math.sin(rad(b1)) * R];
      h += '<path d="M0 0 L' + f(a[0]) + " " + f(a[1]) + " A " + R + " " + R + " 0 0 0 " + f(c[0]) + " " + f(c[1]) + ' Z" fill="' + KOK + '" fill-opacity=".14" stroke="' + QORA + '" stroke-width="2.4" stroke-linejoin="round"/>';
      if (g.toliq) h += '<circle cx="0" cy="0" r="' + R + '" fill="none" stroke="#9aa3b5" stroke-width="1.4" stroke-dasharray="5 5"/>';
      for (let t = b0; t <= b1; t += 5) nuq(Math.cos(rad(t)) * R, -Math.sin(rad(t)) * R);
      nuq(0, 0);
    } else {
      h += '<circle cx="0" cy="0" r="' + R + '" fill="' + (tur === "aylana" ? "none" : KOK) + '" fill-opacity=".12" stroke="' + KOK + '" stroke-width="2.6"/>';
      nuq(-R, -R); nuq(R, R);
    }
    /* qo'shimcha doiralar, ramka va o'lcham chiziqlari (koordinatalar radius birligida, y tepaga) */
    const S = function (x, y) { return [x * R, -y * R]; };
    (g.doiralar || []).forEach(function (d) {
      const c = S(d[0], d[1]);
      h += '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(d[2] * R) + '" fill="' + (tur === "aylana" ? "none" : KOK) + '" fill-opacity=".12" stroke="' + KOK + '" stroke-width="2.6"/>';
      nuq(c[0] - d[2] * R, c[1] - d[2] * R); nuq(c[0] + d[2] * R, c[1] + d[2] * R);
    });
    if (g.ramka) {
      const a = S(g.ramka[0], g.ramka[3]), b = S(g.ramka[2], g.ramka[1]);
      h = '<rect x="' + f(a[0]) + '" y="' + f(a[1]) + '" width="' + f(b[0] - a[0]) + '" height="' + f(b[1] - a[1]) + '" fill="#e07b39" fill-opacity=".08" stroke="' + QORA + '" stroke-width="2.4"/>' + h;
      nuq(a[0], a[1]); nuq(b[0], b[1]);
    }
    (g.olchov || []).forEach(function (o) {
      const a = S(o[0], o[1]), b = S(o[2], o[3]), L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = -uy * 7, ny = ux * 7;
      ust += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="#c2410c" stroke-width="1.8"/>';
      [a, b].forEach(function (p) { ust += '<line x1="' + f(p[0] - nx) + '" y1="' + f(p[1] - ny) + '" x2="' + f(p[0] + nx) + '" y2="' + f(p[1] + ny) + '" stroke="#c2410c" stroke-width="1.8"/>'; });
      const tik = Math.abs(ux) < 0.3, mx = (a[0] + b[0]) / 2 + (tik ? 10 : 0), my = (a[1] + b[1]) / 2 + (tik ? 6 : 20);
      ust += '<text x="' + f(mx) + '" y="' + f(my) + '" text-anchor="' + (tik ? "start" : "middle") + '" font-size="16" font-weight="800" fill="#c2410c" stroke="#fff" stroke-width="4" paint-order="stroke">' + o[4] + "</text>";
      nuq(a[0], a[1]); nuq(b[0], b[1]); nuq(mx - (tik ? 0 : 34), my - 14); nuq(mx + (tik ? 70 : 34), my + 4);
    });
    /* ichki ko'pburchak: "ichki":"ABCD" — aylanadagi nuqtalarni tutashtiradi */
    if (g.ichki) h += '<polygon points="' + g.ichki.split("").map(function (v) { return f(P[v][0]) + "," + f(P[v][1]); }).join(" ") + '" fill="#e07b39" fill-opacity=".12" stroke="' + QORA + '" stroke-width="2"/>';
    /* kesmalar: [p1, p2, rang, yozuv] */
    (g.kesma || []).forEach(function (k) {
      const a = P[k[0]], b = P[k[1]], c = k[2] || QORA;
      h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round"' + (k[4] === "punktir" ? ' stroke-dasharray="7 6"' : "") + "/>";
      if (k[3]) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
        let nx = -uy, ny = ux; if (ny > 0.2 || (Math.abs(ny) <= 0.2 && nx < 0)) { nx = -nx; ny = -ny; } if (k[6] === -1) { nx = -nx; ny = -ny; }
        const t = k[5] !== undefined ? Number(k[5]) : 0.5, mx = a[0] + (b[0] - a[0]) * t + nx * 15, my = a[1] + (b[1] - a[1]) * t + ny * 15 + 6;
        ust += '<text x="' + f(mx) + '" y="' + f(my) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + k[3] + "</text>";
        nuq(mx - 30, my - 14); nuq(mx + 30, my + 4);
      }
    });
    /* nuqtalar va nomlari (nomi "_" bilan boshlansa — yozilmaydi) */
    Object.keys(P).forEach(function (v) {
      const p = P[v], L = Math.hypot(p[0], p[1]);
      h += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="3.6" fill="' + QORA + '"/>';
      if (v.charAt(0) === "_") return;
      const t = L ? [p[0] + p[0] / L * 17, p[1] + p[1] / L * 17 + 6] : [g.markazJoy ? g.markazJoy[0] : 13, g.markazJoy ? g.markazJoy[1] : 20];
      ust += '<text x="' + f(t[0]) + '" y="' + f(t[1]) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + QORA + '">' + v + "</text>";
      nuq(t[0] - 10, t[1] - 16); nuq(t[0] + 10, t[1] + 4);
    });
    /* izohlar: [matn, burchak, (masofa)] — aylanadagi nuqtadan tashqariga chiziqcha va yozuv; burchak "O" bo'lsa — markazga */
    (g.izoh || []).forEach(function (z) {
      const ich = z[1] === "O", d = Number(z[2] || 46);
      const a = ich ? [0, 0] : [Math.cos(rad(z[1])) * R, -Math.sin(rad(z[1])) * R];
      const yon = ich ? (z[3] || 0) : z[1];
      const e = ich ? [Math.cos(rad(yon)) * (R + d), -Math.sin(rad(yon)) * (R + d)] : [Math.cos(rad(z[1])) * (R + d), -Math.sin(rad(z[1])) * (R + d)];
      const chap = e[0] < -4, anc = Math.abs(e[0]) <= 4 ? "middle" : chap ? "end" : "start";
      h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(e[0]) + '" y2="' + f(e[1]) + '" stroke="#7a8194" stroke-width="1.3"/>';
      const tx = e[0] + (anc === "middle" ? 0 : chap ? -5 : 5), ty = e[1] + (e[1] < -R * 0.5 ? -6 : e[1] > R * 0.5 ? 16 : 5);
      const qator = String(z[0]).split("|");
      qator.forEach(function (q, i) {
        ust += '<text x="' + f(tx) + '" y="' + f(ty + i * 18) + '" text-anchor="' + anc + '" font-size="15" font-weight="700" fill="#c2410c">' + q + "</text>";
      });
      const w = Math.max.apply(null, qator.map(function (q) { return q.length; })) * 8.2;
      nuq(anc === "end" ? tx - w : anc === "middle" ? tx - w / 2 : tx, ty - 15); nuq(anc === "end" ? tx : anc === "middle" ? tx + w / 2 : tx + w, ty + (qator.length - 1) * 18 + 5);
    });
    const pad = 10, x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad, W = Math.max.apply(null, xs) + pad - x0, H = Math.max.apply(null, ys) + pad - y0;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="' + f(x0) + " " + f(y0) + " " + f(W) + " " + f(H) + '" width="' + Math.round(W) + '" role="img" aria-label="Doira chizmasi">' + h + ust + "</svg>";
  }

  // ---------- doiraning dumalashi: aylana uzunligi to'g'ri chiziqqa yoyiladi ----------
  function chizYoyish(el) {
    const g = JSON.parse(el.dataset.yoyish || "{}");
    const n = Math.max(1, Number(g.marta || 1)), davom = !!g.davomi;
    let R = Number(g.olcham || 34);
    if (n > 1) R = Math.min(R, (300 - (davom ? 40 : 0)) / (2 * Math.PI * n + 2));
    const L = 2 * Math.PI * R, T = L * n, f = function (v) { return v.toFixed(1); };
    const KOK = "#1f5fd6", QIZIL = "#d6454f", YASHIL = "#12805c", SARIQ = "#e07b39", QORA = "#1f2433", KUL = "#7a8194";
    const xs = [], ys = [], nuq = function (x, y) { xs.push(x); ys.push(y); };
    const yoz = function (x, y, t, c, anc, fs) {
      const w = String(t).length * (fs || 15) * 0.55;
      nuq(anc === "end" ? x - w : anc === "start" ? x : x - w / 2, y - 14); nuq(anc === "end" ? x : anc === "start" ? x + w : x + w / 2, y + 4);
      return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + (anc || "middle") + '" font-size="' + (fs || 15) + '" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + t + "</text>";
    };
    const chiz = function (x1, y1, x2, y2, c, w, dash) {
      nuq(x1, y1); nuq(x2, y2);
      return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>";
    };
    const olchov = function (x1, x2, y, t, c) {
      let s = chiz(x1, y, x2, y, c, 1.8) + chiz(x1, y - 6, x1, y + 6, c, 1.8) + chiz(x2, y - 6, x2, y + 6, c, 1.8);
      return s + yoz((x1 + x2) / 2, y + 20, t, c);
    };
    let h = "", ust = "";
    /* yer chizig'i */
    const oxir = T + R + 8 + (davom ? 40 : 0);
    h += chiz(-R - 8, 0, oxir, 0, "#b8bfcc", 3);
    if (davom) { h += chiz(T, 0, T + 40, 0, QIZIL, 4.5, "3 7"); ust += yoz(T + R + 18, -6, "…", QIZIL, "middle", 18); }
    nuq(-R, -2 * R); nuq(R, 0); nuq(T + R, -2 * R);
    /* g'ildirak (markazi (0, -R)): shina, gardish, kegaylar, shinada aylanish strelkasi, shinadagi qizil nuqta */
    const w = Math.max(5, R * 0.26), rs = R - w / 2, rg = R - w;
    const P = function (r, a) { const t = a * Math.PI / 180; return [r * Math.cos(t), -R - r * Math.sin(t)]; };
    let teker = '<circle cx="0" cy="' + f(-R) + '" r="' + f(rg) + '" fill="#eef3fb" stroke="#9aa3b2" stroke-width="1.4"/>';
    for (let k = 0; k < 6; k++) { const q = P(rg, k * 60 + 90); teker += '<line x1="0" y1="' + f(-R) + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="#9aa3b2" stroke-width="1.6"/>'; }
    teker += '<circle cx="0" cy="' + f(-R) + '" r="' + f(rs) + '" fill="none" stroke="#2f3542" stroke-width="' + f(w) + '"/>';
    teker += '<circle cx="0" cy="' + f(-R) + '" r="' + f(Math.max(2.8, R * 0.13)) + '" fill="#5b6577"/>';
    { const a0 = 155, a1 = 35, A = P(rs, a0), B = P(rs, a1), t = a1 * Math.PI / 180;
      const dx = Math.sin(t), dy = Math.cos(t), k = Math.max(4, w * 0.9);
      teker += '<path d="M' + f(A[0]) + " " + f(A[1]) + " A" + f(rs) + " " + f(rs) + " 0 0 1 " + f(B[0]) + " " + f(B[1]) + '" fill="none" stroke="#fbbf24" stroke-width="' + f(Math.max(1.8, w * 0.32)) + '" stroke-linecap="round"/>';
      teker += '<path d="M' + f(B[0] + dx * k) + " " + f(B[1] + dy * k) + " L" + f(B[0] - dy * k * 0.75) + " " + f(B[1] + dx * k * 0.75) + " L" + f(B[0] + dy * k * 0.75) + " " + f(B[1] - dx * k * 0.75) + ' Z" fill="#fbbf24"/>'; }
    teker += '<circle cx="0" cy="' + f(-w / 2) + '" r="' + f(Math.max(2.6, w * 0.38)) + '" fill="' + QIZIL + '" stroke="#fff" stroke-width="1"/>';
    let dChiz = "", dYoz = "";
    if (g.d) { dChiz = chiz(-rg, -R, rg, -R, YASHIL, 2.6); dYoz = yoz(-R / 2, -2 * R - 5, g.d, YASHIL); }
    else if (g.r) { dChiz = chiz(0, -R, rg, -R, YASHIL, 2.6); dYoz = yoz(R / 2, -2 * R - 5, g.r, YASHIL); }
    /* oxiridagi punktir doira va yerdagi nuqtalar */
    h += '<circle cx="' + f(T) + '" cy="' + f(-R) + '" r="' + f(R) + '" fill="none" stroke="' + KUL + '" stroke-width="1.8" stroke-dasharray="6 5"/>';
    /* qimirlamaydigan holat (chop etish/PDF): to'liq qizil yo'l va boshidagi g'ildirak */
    const stat = '<g class="yy-stat">' + chiz(0, 0, T, 0, QIZIL, 4.5) + teker + dChiz + dYoz + "</g>";
    /* saytda: g'ildirak aylanib yuradi, yo'l chizilib boradi */
    const dur = (2.6 + 1.4 * n) + "s", kt = ' keyTimes="0;0.75;1" dur="' + dur + '" repeatCount="indefinite"';
    const anim = '<g class="yy-anim">' +
      '<line x1="0" y1="0" x2="0" y2="0" stroke="' + QIZIL + '" stroke-width="4.5" stroke-linecap="round"><animate attributeName="x2" values="0;' + f(T) + ";" + f(T) + '"' + kt + "/></line>" +
      '<g><animateTransform attributeName="transform" type="translate" values="0 0;' + f(T) + " 0;" + f(T) + ' 0"' + kt + "/>" +
      '<g><animateTransform attributeName="transform" type="rotate" values="0 0 ' + f(-R) + ";" + (360 * n) + " 0 " + f(-R) + ";" + (360 * n) + " 0 " + f(-R) + '"' + kt + "/>" + teker + "</g>" + dChiz + dYoz + "</g></g>";
    h += '<style>.yy-stat{display:none}@media print{.yy-anim{display:none}.yy-stat{display:inline}}@media (prefers-reduced-motion:reduce){.yy-anim{display:none}.yy-stat{display:inline}}</style>' + stat + anim;
    h += '<circle cx="0" cy="0" r="4.6" fill="' + QIZIL + '"/><circle cx="' + f(T) + '" cy="0" r="4.6" fill="' + QIZIL + '"/>';
    /* tepada yo'nalish strelkasi */
    const ya = -2 * R - 14, xa = Math.min(R + 10, T * 0.25);
    h += chiz(xa, ya, T - 6, ya, KUL, 1.8) + '<path d="M' + f(T - 4) + " " + f(ya) + " l-9 -5 v10 z" + '" fill="' + KUL + '"/>';
    ust += yoz((xa + T) / 2, ya - 8, g.ustki || (n + " marta to'liq aylandi"), "#5b6577", "middle", 14);
    /* pastki qism */
    const yozuv = g.yozuv === undefined ? "aylana uzunligi" : g.yozuv;
    if (g.chizgich) {
      const N = Number(g.chizgich);
      h += '<rect x="-8" y="5" width="' + f(T + 16) + '" height="30" rx="3" fill="#fde68a" stroke="#d4a72c" stroke-width="1.2"/>';
      nuq(-8, 5); nuq(T + 8, 35);
      for (let k = 0; k <= N; k++) {
        const x = T * k / N, uzun = k % 5 === 0 || k === N;
        h += chiz(x, 5, x, 5 + (uzun ? 12 : 7), "#6b5a1e", 1.1);
        if (uzun) ust += '<text x="' + f(x) + '" y="31" text-anchor="middle" font-size="11.5" font-weight="' + (k === N ? 800 : 600) + '" fill="' + (k === N ? QIZIL : "#4a3f14") + '">' + k + "</text>";
      }
      ust += '<text x="' + f(T + 12) + '" y="31" text-anchor="start" font-size="11" fill="#4a3f14">cm</text>';
      nuq(T + 30, 31);
      if (yozuv) ust += yoz(T / 2, 58, yozuv, QIZIL);
    } else if (g.bolak) {
      const d = 2 * R, rang = [KOK, SARIQ, KOK];
      for (let i = 0; i < 3; i++) {
        h += '<rect x="' + f(i * d + 1) + '" y="12" width="' + f(d - 2) + '" height="10" rx="2" fill="' + rang[i] + '" fill-opacity=".85"/>';
        ust += yoz(i * d + d / 2, 40, g.d || "d", rang[i]);
      }
      h += '<rect x="' + f(3 * d + 1) + '" y="12" width="' + f(L - 3 * d - 1) + '" height="10" rx="2" fill="' + YASHIL + '"/>';
      nuq(0, 12); nuq(L, 22);
      h += chiz(3 * d + (L - 3 * d) / 2, 24, 3 * d + (L - 3 * d) / 2 + 14, 46, YASHIL, 1.3);
      ust += yoz(3 * d + (L - 3 * d) / 2 + 16, 58, "ozgina", YASHIL, "middle", 14);
      if (yozuv) ust += olchov(0, L, 74, yozuv, QIZIL);
    } else if (n > 1) {
      for (let i = 0; i < n; i++) {
        h += '<rect x="' + f(i * L + 1) + '" y="10" width="' + f(L - 2) + '" height="9" rx="2" fill="' + (i % 2 ? SARIQ : KOK) + '" fill-opacity=".85"/>';
        ust += yoz(i * L + L / 2, 36, (i + 1) + "-marta", i % 2 ? SARIQ : KOK, "middle", 13);
      }
      nuq(0, 10); nuq(T, 19);
      if (yozuv) ust += yoz((T + (davom ? 40 : 0)) / 2, 62, yozuv, QIZIL);
    } else if (yozuv) {
      ust += olchov(0, T, 18, yozuv, QIZIL);
    }
    const pad = 8, x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad, W = Math.max.apply(null, xs) + pad - x0, H = Math.max.apply(null, ys) + pad - y0;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="' + f(x0) + " " + f(y0) + " " + f(W) + " " + f(H) + '" width="' + Math.round(W) + '" role="img" aria-label="Doiraning dumalashi">' + h + ust + "</svg>";
  }

  // ---------- yoylar va kesmalardan tuzilgan shakl (yarim/chorak doira va ulardan tuzilgan shakllar perimetri) ----------
  function chizYoy(el) {
    const g = JSON.parse(el.dataset.yoy);
    const U = Number(g.olcham || 14), rangli = g.rang !== 0;
    const KOK = "#1f5fd6", YASHIL = "#12805c", QIZIL = "#d6454f", QORA = "#1f2433", KUL = "#7a8194", SARIQ = "#c2410c";
    const f = function (v) { return v.toFixed(1); }, rad = function (a) { return a * Math.PI / 180; };
    const S = function (x, y) { return [x * U, -y * U]; };
    const xs = [], ys = [], nuq = function (x, y) { xs.push(x); ys.push(y); };
    const rangi = function (rol) { return rol === "d" ? YASHIL : rol === "r" ? QIZIL : rol === "y" ? KOK : QORA; };
    /* yozuv: (x, y) nuqtadan (nx, ny) yo'nalishda (px) */
    const yoz = function (x, y, nx, ny, t, c, uz) {
      const L = Math.hypot(nx, ny) || 1, ux = nx / L, uy = ny / L, k = uz || 14;
      const tx = x + ux * k, ty = y + uy * k + (uy > 0.5 ? 12 : uy < -0.5 ? -2 : 6);
      const anc = ux > 0.55 ? "start" : ux < -0.55 ? "end" : "middle", w = String(t).length * 8.6;
      nuq(anc === "end" ? tx - w : anc === "middle" ? tx - w / 2 : tx, ty - 15); nuq(anc === "end" ? tx : anc === "middle" ? tx + w / 2 : tx + w, ty + 4);
      return '<text x="' + f(tx) + '" y="' + f(ty) + '" text-anchor="' + anc + '" font-size="16" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + t + "</text>";
    };
    /* bo'laklar: ["y", cx, cy, r, a0, a1, yozuv, (-1)] — yoy (a0 dan a1 gacha, gradus); ["k", x1, y1, x2, y2, yozuv, rol, (-1)] — kesma */
    const bol = (g.yol || []).map(function (p) {
      if (p[0] === "y") {
        const n = Math.max(2, Math.ceil(Math.abs(p[5] - p[4]) / 5)), pts = [];
        for (let i = 0; i <= n; i++) { const a = rad(p[4] + (p[5] - p[4]) * i / n); pts.push(S(p[1] + p[3] * Math.cos(a), p[2] + p[3] * Math.sin(a))); }
        return { y: true, p: p, pts: pts, a: pts[0], b: pts[n] };
      }
      const a = S(p[1], p[2]), b = S(p[3], p[4]);
      return { y: false, p: p, pts: [a, b], a: a, b: b };
    });
    let cx = 0, cy = 0, n = 0;
    bol.forEach(function (b) { b.pts.forEach(function (q) { cx += q[0]; cy += q[1]; n++; nuq(q[0], q[1]); }); });
    if (n) { cx /= n; cy /= n; }
    const yoyD = function (b) {
      const R = b.p[3] * U, katta = Math.abs(b.p[5] - b.p[4]) > 180 ? 1 : 0, sw = b.p[5] > b.p[4] ? 0 : 1;
      return " A" + f(R) + " " + f(R) + " 0 " + katta + " " + sw + " " + f(b.b[0]) + " " + f(b.b[1]);
    };
    let fon = "", h = "", ust = "";
    /* punktir ramka va to'liq aylanalar (fon) */
    (g.ramka || []).forEach(function (r) {
      const a = S(r[0], r[3]), b = S(r[2], r[1]);
      fon += '<rect x="' + f(a[0]) + '" y="' + f(a[1]) + '" width="' + f(b[0] - a[0]) + '" height="' + f(b[1] - a[1]) + '" fill="none" stroke="' + KUL + '" stroke-width="1.5" stroke-dasharray="6 5"/>';
      nuq(a[0], a[1]); nuq(b[0], b[1]);
    });
    (g.toliq || []).forEach(function (c) {
      const o = S(c[0], c[1]), R = c[2] * U;
      fon += '<circle cx="' + f(o[0]) + '" cy="' + f(o[1]) + '" r="' + f(R) + '" fill="none" stroke="#9aa3b5" stroke-width="1.4" stroke-dasharray="5 5"/>';
      nuq(o[0] - R, o[1] - R); nuq(o[0] + R, o[1] + R);
    });
    /* bo'yalgan shakl */
    if (bol.length) {
      let d = "";
      bol.forEach(function (b, i) { d += (i ? " L" : "M") + f(b.a[0]) + " " + f(b.a[1]) + (b.y ? yoyD(b) : " L" + f(b.b[0]) + " " + f(b.b[1])); });
      fon += '<path d="' + d + ' Z" fill="' + KOK + '" fill-opacity=".14" stroke="none"/>';
    }
    /* shakl ichidagi chiziqlar (perimetrga kirmaydi): [x1, y1, x2, y2, yozuv, rol, (-1)] */
    (g.ichki || []).forEach(function (k) {
      const a = S(k[0], k[1]), b = S(k[2], k[3]), c = k[5] ? rangi(k[5]) : KUL;
      h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + c + '" stroke-width="2" stroke-dasharray="6 5"/>';
      if (k[4]) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L;
        if (ny > 0.2 || (Math.abs(ny) <= 0.2 && nx < 0)) { nx = -nx; ny = -ny; }
        if (k[6] === -1) { nx = -nx; ny = -ny; }
        ust += yoz((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, nx, ny, k[4], c === KUL ? QORA : c, 10);
      }
    });
    /* chegara: yoylar ko'k, kesmalar — diametr yashil, radius qizil, boshqasi qora (rang: 0 — hammasi qora) */
    bol.forEach(function (b) {
      const p = b.p, c = rangli ? (b.y ? KOK : rangi(p[6])) : QORA;
      if (b.y) h += '<path d="M' + f(b.a[0]) + " " + f(b.a[1]) + yoyD(b) + '" fill="none" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round"/>';
      else h += '<line x1="' + f(b.a[0]) + '" y1="' + f(b.a[1]) + '" x2="' + f(b.b[0]) + '" y2="' + f(b.b[1]) + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>';
      if (!p[b.y ? 6 : 5]) return;
      const t = p[b.y ? 6 : 5], ters = p[7] === -1;
      let mx, my, nx, ny;
      if (b.y) {
        const am = rad((p[4] + p[5]) / 2), m = S(p[1] + p[3] * Math.cos(am), p[2] + p[3] * Math.sin(am));
        mx = m[0]; my = m[1]; nx = Math.cos(am); ny = -Math.sin(am);
        if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      } else {
        const L = Math.hypot(b.b[0] - b.a[0], b.b[1] - b.a[1]) || 1;
        mx = (b.a[0] + b.b[0]) / 2; my = (b.a[1] + b.b[1]) / 2; nx = (b.b[1] - b.a[1]) / L; ny = -(b.b[0] - b.a[0]) / L;
        if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      }
      if (ters) { nx = -nx; ny = -ny; }
      ust += yoz(mx, my, nx, ny, t, c, b.y ? 12 : 10);
    });
    /* o'lcham chiziqlari: [x1, y1, x2, y2, yozuv, sx, sy] — (sx, sy) ga surilgan, uchlarida chiziqcha */
    (g.olchov || []).forEach(function (o) {
      const sx = o[5] || 0, sy = o[6] || 0, a = S(o[0] + sx, o[1] + sy), b = S(o[2] + sx, o[3] + sy);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, px = -uy * 6, py = ux * 6;
      if (sx || sy) {
        const a0 = S(o[0], o[1]), b0 = S(o[2], o[3]);
        h += '<line x1="' + f(a0[0]) + '" y1="' + f(a0[1]) + '" x2="' + f(a[0]) + '" y2="' + f(a[1]) + '" stroke="#b8bfcc" stroke-width="1.2"/>';
        h += '<line x1="' + f(b0[0]) + '" y1="' + f(b0[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="#b8bfcc" stroke-width="1.2"/>';
      }
      h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="' + SARIQ + '" stroke-width="1.6"/>';
      [a, b].forEach(function (q) { h += '<line x1="' + f(q[0] - px) + '" y1="' + f(q[1] - py) + '" x2="' + f(q[0] + px) + '" y2="' + f(q[1] + py) + '" stroke="' + SARIQ + '" stroke-width="1.6"/>'; });
      nuq(a[0], a[1]); nuq(b[0], b[1]);
      let nx = sx, ny = -sy;
      if (!nx && !ny) { nx = -uy; ny = ux; if (ny < -0.2 || (Math.abs(ny) <= 0.2 && nx < 0)) { nx = -nx; ny = -ny; } }
      ust += yoz((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, nx, ny, o[4], SARIQ, 6);
    });
    /* nuqtalar: {"O": [x, y, (dx, dy)]} — nuqta va nomi (nomi "_" bilan boshlansa — yozilmaydi) */
    Object.keys(g.nuqta || {}).forEach(function (v) {
      const q = g.nuqta[v], p = S(q[0], q[1]);
      h += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="3.6" fill="' + QORA + '"/>';
      if (v.charAt(0) === "_") return;
      const tx = p[0] + (q[2] !== undefined ? q[2] : 12), ty = p[1] + (q[3] !== undefined ? q[3] : 20);
      ust += '<text x="' + f(tx) + '" y="' + f(ty) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + QORA + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + v + "</text>";
      nuq(tx - 10, ty - 16); nuq(tx + 10, ty + 4);
    });
    const pad = 8, x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad, W = Math.max.apply(null, xs) + pad - x0, H = Math.max.apply(null, ys) + pad - y0;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="' + f(x0) + " " + f(y0) + " " + f(W) + " " + f(H) + '" width="' + Math.round(W) + '" role="img" aria-label="Yoy va kesmalardan tuzilgan shakl">' + fon + h + ust + "</svg>";
  }

  // ---------- to'rtburchakni qadamma-qadam chizish: parallelogramm/romb ("pg") va trapetsiya ("tr") ----------
  function chizYasash4(el, g) {
    const tur = g.tur, nom = g.nom || ["A", "B", "C", "D"], L = Number(g.asos), b = Number(g.tomon), k = Number(g.olcham || 40);
    const maxQ = 4, q = Math.min(Number(g.qadam || 5), 5), xom = !!g.xomaki, tayyor = xom || q > maxQ;
    const rad = function (d) { return d * Math.PI / 180; }, f = function (v) { return v.toFixed(1); };
    const KOK = "#1f5fd6", SARIQ = "#e07b39", QORA = "#1f2433", YASHIL = "#12805c";
    const al = Number(tur === "pg" ? g.burchak : g.burchak[0]);
    /* V0 — chap pastki, V1 — o'ng pastki, V2 — o'ng yuqori, V3 — chap yuqori (model, cm) */
    const v3 = [b * Math.cos(rad(al)), b * Math.sin(rad(al))];
    let v2, be;
    if (tur === "pg") { v2 = [L + v3[0], v3[1]]; be = 180 - al; }
    else { be = Number(g.burchak[1]); const t = v3[1] / Math.sin(rad(be)); v2 = [L + t * Math.cos(rad(180 - be)), v3[1]]; }
    const S = function (p) { return [p[0] * k, -p[1] * k]; };
    const V0 = S([0, 0]), V1 = S([L, 0]), V2 = S(v2), V3 = S(v3);
    const xs = [], ys = [], nuq = function (p) { xs.push(p[0]); ys.push(p[1]); };
    [V0, V1].forEach(nuq);
    let past = "", ust = "";
    const chiziq = function (p, r, c, w, dash) { nuq(p); nuq(r); return '<line x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(r[0]) + '" y2="' + f(r[1]) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="6 5"' : "") + "/>"; };
    const yoz = function (p, t, c, anc) { nuq([p[0] - 24, p[1] - 14]); nuq([p[0] + 24, p[1] + 8]); return '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" text-anchor="' + (anc || "middle") + '" font-size="16" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + t + "</text>"; };
    const nurUch = function (v, deg, uz) { return [v[0] + Math.cos(rad(deg)) * uz, v[1] - Math.sin(rad(deg)) * uz]; };
    const transportir = function (v, d, oqish) {
      const r0 = Math.min(78, L * k * 0.4);
      let h = '<path d="M' + f(v[0] - r0) + " " + f(v[1]) + " A " + f(r0) + " " + f(r0) + " 0 0 1 " + f(v[0] + r0) + " " + f(v[1]) + ' Z" fill="#eef4ff" fill-opacity=".8" stroke="#7a93c9" stroke-width="1.4"/>';
      nuq([v[0] - r0 - 14, v[1]]); nuq([v[0] + r0 + 14, v[1] - r0 - 16]);
      for (let t = 0; t <= 180; t += 10) {
        const a = nurUch(v, t, r0), c = nurUch(v, t, r0 - (t % 30 === 0 ? 10 : 6));
        h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="#7a93c9" stroke-width="1.2"/>';
        if (t % 30 === 0) { const e = nurUch(v, t, r0 + 10); h += '<text x="' + f(e[0]) + '" y="' + f(e[1] + 4) + '" text-anchor="middle" font-size="10.5" fill="#5b6577">' + (oqish === "chap" ? t : 180 - t) + "</text>"; }
      }
      const m = nurUch(v, d, r0);
      return h + '<circle cx="' + f(m[0]) + '" cy="' + f(m[1]) + '" r="4.5" fill="' + SARIQ + '"/>';
    };
    const yoyB = function (v, a1, a2, t, c) {
      const r = 24, s1 = nurUch(v, a1, r), s2 = nurUch(v, a2, r), m = nurUch(v, (a1 + a2) / 2, 46);
      return '<path d="M' + f(v[0]) + " " + f(v[1]) + " L" + f(s1[0]) + " " + f(s1[1]) + " A " + r + " " + r + " 0 0 0 " + f(s2[0]) + " " + f(s2[1]) + ' Z" fill="' + c + '" fill-opacity=".16" stroke="' + c + '" stroke-width="1.8"/>' + yoz([m[0], m[1] + 6], t, c);
    };
    const nuqta = function (p, c) { return '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="4" fill="' + (c || QORA) + '"/>'; };
    const nomYoz = function (p, t, dx, dy) { nuq([p[0] + dx - 12, p[1] + dy - 16]); nuq([p[0] + dx + 12, p[1] + dy + 4]); return '<text x="' + f(p[0] + dx) + '" y="' + f(p[1] + dy) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + QORA + '">' + t + "</text>"; };
    const yozuv = g.yozuv || [];
    const cm = function (x) { return String(x).replace(".", ",") + " cm"; };
    const asosYoz = yoz([L * k / 2, 26], yozuv[0] || cm(L), KOK);
    const tomonYoz = function () { const t = 0.86, m = [V0[0] + (V3[0] - V0[0]) * t - 16, V0[1] + (V3[1] - V0[1]) * t + 6]; return yoz(m, yozuv[1] || cm(b), KOK, "end"); };
    if (xom) {
      const tol = function (p, r) {
        let d = "M" + f(p[0]) + " " + f(p[1]); const n = 6, L2 = Math.hypot(r[0] - p[0], r[1] - p[1]) || 1;
        for (let i = 1; i <= n; i++) { const t = i / n, x = p[0] + (r[0] - p[0]) * t, y = p[1] + (r[1] - p[1]) * t, o = i < n ? (i % 2 ? 2.2 : -2.2) : 0; d += " L" + f(x - (r[1] - p[1]) / L2 * o) + " " + f(y + (r[0] - p[0]) / L2 * o); }
        nuq(p); nuq(r);
        return '<path d="' + d + '" fill="none" stroke="' + QORA + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
      };
      past += tol(V0, V1) + tol(V1, V2) + tol(V2, V3) + tol(V3, V0);
      ust += yoyB(V0, 0, al, al + "°", SARIQ) + asosYoz + tomonYoz();
      if (tur === "tr") ust += yoyB(V1, 180 - be, 180, be + "°", YASHIL);
    } else {
      const yangi = function (n) { return q === n ? SARIQ : QORA; };
      past += chiziq(V0, V1, yangi(1), 3);
      ust += asosYoz;
      if (q === 2) past += transportir(V0, al, "chap");
      if (q >= 2) { past += chiziq(V0, V3, yangi(2), 3); ust += yoyB(V0, 0, al, al + "°", SARIQ) + tomonYoz() + nuqta(V3, q === 2 ? SARIQ : QORA); }
      if (tur === "pg") {
        if (q === 3) past += chiziq([V3[0] - 30, V3[1]], [V2[0] + 40, V2[1]], "#9aa3b5", 1.5, true);
        if (q >= 3) { past += chiziq(V3, V2, yangi(3), 3); ust += nuqta(V2, q === 3 ? SARIQ : QORA) + yoz([(V3[0] + V2[0]) / 2, V3[1] - 12], yozuv[0] || cm(L), q === 3 ? SARIQ : "#5b6577"); }
        if (q >= 4) past += chiziq(V1, V2, yangi(4), 3);
      } else {
        const uz = Math.hypot(V2[0] - V1[0], V2[1] - V1[1]);
        if (q === 3) past += transportir(V1, 180 - be, "ong");
        if (q === 3) past += chiziq(V1, nurUch(V1, 180 - be, uz + 46), SARIQ, 2);
        if (q >= 3) ust += yoyB(V1, 180 - be, 180, be + "°", YASHIL);
        if (q === 4) { past += chiziq(V1, nurUch(V1, 180 - be, uz + 46), QORA, 2); past += chiziq([V3[0] - 30, V3[1]], [V2[0] + 40, V2[1]], "#9aa3b5", 1.5, true); }
        if (q >= 4) { past += chiziq(V3, V2, yangi(4), 3); ust += nuqta(V2, q === 4 ? SARIQ : QORA); }
        if (q > 4) past += chiziq(V1, V2, QORA, 3);
      }
      if (q > maxQ) { past = past.split(SARIQ).join(QORA); ust = ust.split('fill="' + SARIQ + '"/>').join('fill="' + QORA + '"/>'); }
    }
    ust += nuqta(V0) + nuqta(V1) + nomYoz(V0, nom[0], -14, 8) + nomYoz(V1, nom[1], 14, 8);
    if (tayyor || q >= 3) ust += nomYoz(V2, nom[2], 12, -10);
    if (tayyor || q >= 2) ust += nomYoz(V3, nom[3], -12, -10);
    const pad = 14, mnx = Math.min.apply(null, xs) - pad, mxx = Math.max.apply(null, xs) + pad, mny = Math.min.apply(null, ys) - pad, mxy = Math.max.apply(null, ys) + pad;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="' + f(mnx) + " " + f(mny) + " " + f(mxx - mnx) + " " + f(mxy - mny) + '" width="' + Math.round(mxx - mnx) + '" role="img" aria-label="To\'rtburchak chizish">' + past + ust + "</svg>";
  }

  // ---------- uchburchakni qadamma-qadam chizish (chizg'ich, transportir, uchburchakli chizg'ich) ----------
  function chizYasash(el) {
    const g = JSON.parse(el.dataset.yasash);
    if (g.tur === "pg" || g.tur === "tr") return chizYasash4(el, g);
    const tur = g.tur || "bb", nom = g.nom || ["A", "B", "C"], L = Number(g.asos), k = Number(g.olcham || 40);
    const maxQ = tur === "bb" ? 4 : 3, q = Math.min(Number(g.qadam || maxQ), maxQ), xom = !!g.xomaki;
    const rad = function (d) { return d * Math.PI / 180; }, f = function (v) { return v.toFixed(1); };
    const KOK = "#1f5fd6", SARIQ = "#e07b39", QORA = "#1f2433", YASHIL = "#12805c";
    /* uchinchi uch (model, cm): chap uch (0,0), o'ng uch (L,0) */
    let al, be, ax, ay;
    if (tur === "bb") {
      al = Number(g.burchak[0]); be = Number(g.burchak[1]);
      const s = L * Math.sin(rad(be)) / Math.sin(rad(al + be)); ax = s * Math.cos(rad(al)); ay = s * Math.sin(rad(al));
    } else {
      al = tur === "tik" ? 90 : Number(g.burchak); const b = Number(g.tomon); ax = b * Math.cos(rad(al)); ay = b * Math.sin(rad(al));
      be = Math.atan2(ay, L - ax) * 180 / Math.PI;
    }
    const V0 = [0, 0], V1 = [L * k, 0], A = [ax * k, -ay * k];
    const xs = [], ys = [], nuq = function (p) { xs.push(p[0]); ys.push(p[1]); };
    [V0, V1].forEach(nuq);
    let past = "", ust = "";
    const chiziq = function (p, r, c, w, dash) { nuq(p); nuq(r); return '<line x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(r[0]) + '" y2="' + f(r[1]) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="6 5"' : "") + "/>"; };
    const yoz = function (p, t, c, s, anc) { nuq([p[0] - 22, p[1] - 14]); nuq([p[0] + 22, p[1] + 8]); return '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" text-anchor="' + (anc || "middle") + '" font-size="' + (s || 16) + '" font-weight="800" fill="' + c + '" stroke="#fff" stroke-width="4" paint-order="stroke">' + t + "</text>"; };
    const nurUch = function (v, deg, uz) { return [v[0] + Math.cos(rad(deg)) * uz, v[1] - Math.sin(rad(deg)) * uz]; };
    const uzA = Math.hypot(A[0], A[1]), uzB = Math.hypot(A[0] - V1[0], A[1]);
    /* transportir: markazi v da, asosi kesma bo'ylab; o'qish — d yo'nalishda */
    const transportir = function (v, d, oqish) {
      const r0 = Math.min(84, L * k * 0.42);
      let h = '<path d="M' + f(v[0] - r0) + " " + f(v[1]) + " A " + f(r0) + " " + f(r0) + " 0 0 1 " + f(v[0] + r0) + " " + f(v[1]) + ' Z" fill="#eef4ff" fill-opacity=".8" stroke="#7a93c9" stroke-width="1.4"/>';
      nuq([v[0] - r0 - 14, v[1]]); nuq([v[0] + r0 + 14, v[1] - r0 - 16]);
      for (let t = 0; t <= 180; t += 10) {
        const a = nurUch(v, t, r0), b = nurUch(v, t, r0 - (t % 30 === 0 ? 10 : 6));
        h += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="#7a93c9" stroke-width="1.2"/>';
        if (t % 30 === 0) { const c = nurUch(v, t, r0 + 10); h += '<text x="' + f(c[0]) + '" y="' + f(c[1] + 4) + '" text-anchor="middle" font-size="10.5" fill="#5b6577">' + (oqish === "chap" ? t : 180 - t) + "</text>"; }
      }
      const m = nurUch(v, d, r0);
      h += '<circle cx="' + f(m[0]) + '" cy="' + f(m[1]) + '" r="4.5" fill="' + SARIQ + '"/>';
      return h;
    };
    const yoyB = function (v, a1, a2, t, c) {
      const r = 26, s1 = nurUch(v, a1, r), s2 = nurUch(v, a2, r), m = nurUch(v, (a1 + a2) / 2, 48);
      return '<path d="M' + f(v[0]) + " " + f(v[1]) + " L" + f(s1[0]) + " " + f(s1[1]) + " A " + r + " " + r + " 0 0 0 " + f(s2[0]) + " " + f(s2[1]) + ' Z" fill="' + c + '" fill-opacity=".16" stroke="' + c + '" stroke-width="1.8"/>' + (t ? yoz([m[0], m[1] + 6], t, c, 15) : "");
    };
    const tikBelgi = function (v) { return '<path d="M' + f(v[0] + 13) + " " + f(v[1]) + " L" + f(v[0] + 13) + " " + f(v[1] - 13) + " L" + f(v[0]) + " " + f(v[1] - 13) + '" fill="none" stroke="#d6454f" stroke-width="2"/>'; };
    const asosYoz = yoz([L * k / 2, 26], (g.yozuv && g.yozuv[0]) || String(L).replace(".", ",") + " cm", KOK);
    const nomYoz = function (p, t, dx, dy) { nuq([p[0] + dx - 12, p[1] + dy - 16]); nuq([p[0] + dx + 12, p[1] + dy + 4]); return '<text x="' + f(p[0] + dx) + '" y="' + f(p[1] + dy) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + QORA + '">' + t + "</text>"; };
    const nuqta = function (p, c) { return '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="4" fill="' + (c || QORA) + '"/>'; };
    const burB = function (d) { return d + "°"; };
    if (xom) {
      /* xomaki chizma: qo'lda chizilgandek to'lqinli chiziqlar */
      const tol = function (p, r) {
        let d = "M" + f(p[0]) + " " + f(p[1]); const n = 6;
        for (let i = 1; i <= n; i++) { const t = i / n, x = p[0] + (r[0] - p[0]) * t, y = p[1] + (r[1] - p[1]) * t, o = (i < n ? (i % 2 ? 2.2 : -2.2) : 0), L2 = Math.hypot(r[0] - p[0], r[1] - p[1]) || 1; d += " L" + f(x - (r[1] - p[1]) / L2 * o) + " " + f(y + (r[0] - p[0]) / L2 * o); }
        return '<path d="' + d + '" fill="none" stroke="' + QORA + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
      };
      past += tol(V0, V1) + tol(V1, A) + tol(A, V0);
      if (tur === "tik") ust += tikBelgi(V0); else ust += yoyB(V0, 0, al, burB(al), SARIQ);
      if (tur === "bb") ust += yoyB(V1, 180 - be, 180, burB(be), YASHIL);
      ust += asosYoz;
      if (tur !== "bb") { const m = [A[0] / 2 - 26, A[1] / 2]; ust += yoz(m, (g.yozuv && g.yozuv[1]) || String(g.tomon).replace(".", ",") + " cm", KOK, 16, "end"); }
    } else {
      past += chiziq(V0, V1, q === 1 ? SARIQ : QORA, 3);
      ust += asosYoz;
      if (tur === "bb") {
        if (q === 2) past += transportir(V0, al, "chap");
        if (q === 3) past += transportir(V1, 180 - be, "ong");
        if (q >= 2) past += chiziq(V0, nurUch(V0, al, q === 4 ? uzA : uzA + 46), q === 2 ? SARIQ : QORA, q === 4 ? 3 : 2);
        if (q >= 3) past += chiziq(V1, nurUch(V1, 180 - be, q === 4 ? uzB : uzB + 46), q === 3 ? SARIQ : QORA, q === 4 ? 3 : 2);
        if (q >= 2) ust += yoyB(V0, 0, al, burB(al), SARIQ);
        if (q >= 3) ust += yoyB(V1, 180 - be, 180, burB(be), YASHIL);
        if (q === 4) ust += nuqta(A, SARIQ);
      } else {
        if (q === 2 && tur === "tbt") past += transportir(V0, al, "chap");
        if (q === 2 && tur === "tik") {
          const s = Math.min(uzA + 30, 150), w = s * 0.62;
          past += '<path d="M' + f(V0[0]) + " " + f(V0[1]) + " L" + f(V0[0]) + " " + f(V0[1] - s) + " L" + f(V0[0] - w) + " " + f(V0[1]) + ' Z" fill="#fde68a" fill-opacity=".55" stroke="#c99a1e" stroke-width="1.5"/>';
          nuq([V0[0] - w, V0[1] - s]);
        }
        if (q >= 2) past += chiziq(V0, nurUch(V0, al, q === 3 ? uzA : uzA + 46), q === 2 ? SARIQ : QORA, q === 3 ? 3 : 2);
        if (q >= 2) ust += tur === "tik" ? tikBelgi(V0) : yoyB(V0, 0, al, burB(al), SARIQ);
        if (q === 3) {
          past += chiziq(A, V1, SARIQ, 3);
          const m = [A[0] / 2 - (tur === "tik" ? 10 : 22), A[1] / 2 + 5];
          ust += yoz(m, (g.yozuv && g.yozuv[1]) || String(g.tomon).replace(".", ",") + " cm", KOK, 16, "end") + nuqta(A, SARIQ);
        }
      }
    }
    /* uch nomlari */
    ust += nuqta(V0) + nuqta(V1) + nomYoz(V0, nom[0], -14, 8) + nomYoz(V1, nom[1], 14, 8);
    if (xom || q === maxQ) ust += nomYoz(A, nom[2], 0, -12);
    const pad = 14, mnx = Math.min.apply(null, xs) - pad, mxx = Math.max.apply(null, xs) + pad, mny = Math.min.apply(null, ys) - pad, mxy = Math.max.apply(null, ys) + pad;
    const W = mxx - mnx, H = mxy - mny;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="' + f(mnx) + " " + f(mny) + " " + f(W) + " " + f(H) + '" width="' + Math.round(W) + '" role="img" aria-label="Uchburchak chizish">' + past + ust + "</svg>";
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

  // ---------- chizmali model (algebra): bo'laklar uzunligi va yozuvi bilan, ustida jami qavsi ----------
  function chizModel(el) {
    const g = JSON.parse(el.dataset.model);
    const q = g.q, jami = g.jami || {}, birlik = Number(g.birlik || 1);
    const tot = Math.max.apply(null, q.map(function (r) { return r[1].reduce(function (t, b) { return t + b[1]; }, 0); }));
    const qavs = g.qavs || [], ong = g.ong;
    const W = 380, L = q.some(function (r) { return r[0]; }) ? 82 : 8, R = ong != null ? 10 + 18 + 10 * String(ong).length : 10, H = 34, gap = 46, w = (W - L - R) / tot;
    const RANG = [["#dbe7ff", "#1f5fd6"], ["#ffe6d2", "#c2410c"], ["#d9f2e6", "#12805c"], ["#ece4ff", "#6d43d6"]];
    const rowY = [];
    const ustBor = Object.keys(jami).length > 0 || qavs.some(function (c) { return c[4] === "ust"; });
    let svg = "", y = ustBor ? 36 : 10;
    q.forEach(function (r, i) {
      rowY.push(y);
      if (r[0]) svg += '<text x="' + (L - 10) + '" y="' + (y + H / 2 + 6) + '" text-anchor="end" font-size="16" font-weight="700" fill="#1f2433">' + r[0] + "</text>";
      let x = L;
      r[1].forEach(function (b, k) {
        const bw = b[1] * w, sor = b[0] === "?", c = RANG[(b[2] != null ? b[2] : i) % RANG.length];
        svg += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + H + '" rx="3" fill="' + (sor ? "#fff" : c[0]) + '" stroke="' + c[1] + '" stroke-width="2"' + (sor ? ' stroke-dasharray="5 4"' : "") + "/>";
        svg += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y + H / 2 + 6) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + c[1] + '">' + b[0] + "</text>";
        x += bw;
      });
      if (jami[i] != null) {
        const x2 = x, yy = y - 8;
        svg += '<path d="M' + L + " " + (yy + 5) + " V" + (yy - 3) + " H" + x2.toFixed(1) + " V" + (yy + 5) + '" fill="none" stroke="#1f2433" stroke-width="1.8"/>';
        svg += '<text x="' + ((L + x2) / 2).toFixed(1) + '" y="' + (yy - 9) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + jami[i] + "</text>";
      }
      y += H + gap;
    });
    // punktir tik chiziqlar (teng qismlar chegarasi)
    (g.chiziq || []).forEach(function (u) {
      const x = (L + u * w).toFixed(1);
      svg += '<line x1="' + x + '" y1="' + (rowY[0] - 4) + '" x2="' + x + '" y2="' + (rowY[rowY.length - 1] + H + 4) + '" stroke="#1f2433" stroke-width="1.6" stroke-dasharray="5 4"/>';
    });
    // qator qismi ostida/ustida qavs
    let pastQo = 0;
    qavs.forEach(function (c) {
      const ry = rowY[c[0]], x1 = L + c[1] * w, x2 = L + c[2] * w, past = c[4] !== "ust";
      if (ry == null) return;
      if (past) {
        const yy = ry + H + 8;
        svg += '<path d="M' + x1.toFixed(1) + " " + (yy - 4) + " V" + (yy + 4) + " H" + x2.toFixed(1) + " V" + (yy - 4) + '" fill="none" stroke="#b45309" stroke-width="1.8"/>';
        svg += '<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (yy + 22) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#b45309">' + c[3] + "</text>";
        if (c[0] === rowY.length - 1) pastQo = 30;
      } else {
        const yy = ry - 8;
        svg += '<path d="M' + x1.toFixed(1) + " " + (yy + 5) + " V" + (yy - 3) + " H" + x2.toFixed(1) + " V" + (yy + 5) + '" fill="none" stroke="#1f2433" stroke-width="1.8"/>';
        svg += '<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (yy - 9) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f2433">' + c[3] + "</text>";
      }
    });
    // o'ng tomonda barcha qatorlarni qamrab oluvchi qavs
    if (ong != null) {
      const x = L + tot * w + 6, y1 = rowY[0], y2 = rowY[rowY.length - 1] + H, ym = (y1 + y2) / 2;
      svg += '<path d="M' + x.toFixed(1) + " " + y1 + " Q" + (x + 7).toFixed(1) + " " + y1 + " " + (x + 7).toFixed(1) + " " + (y1 + 8) + " V" + (ym - 6) +
        " Q" + (x + 7).toFixed(1) + " " + ym + " " + (x + 13).toFixed(1) + " " + ym + " Q" + (x + 7).toFixed(1) + " " + ym + " " + (x + 7).toFixed(1) + " " + (ym + 6) +
        " V" + (y2 - 8) + " Q" + (x + 7).toFixed(1) + " " + y2 + " " + x.toFixed(1) + " " + y2 + '" fill="none" stroke="#1f2433" stroke-width="1.8"/>';
      svg += '<text x="' + (x + 17).toFixed(1) + '" y="' + (ym + 6) + '" font-size="16" font-weight="800" fill="#1f2433">' + ong + "</text>";
    }
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + (y - gap + 8 + pastQo) + '" width="' + W + '" role="img" aria-label="Chizmali model">' + svg + "</svg>";
  }

  // ---------- algebraik plitkalar: "3y + 2y − 4" (y — uzun plitka, 1 — kichik kvadrat) ----------
  function chizPlitka(el) {
    const ifoda = el.dataset.plitka.replace(/−/g, "-");
    const kesish = el.dataset.kesish === "1";
    const terms = [];
    ifoda.replace(/\s+/g, "").replace(/([+-]?)(\d*)([a-z]?)/g, function (m, sg, n, h) {
      if (!m) return m;
      terms.push({ sg: sg === "-" ? -1 : 1, n: n === "" ? 1 : Number(n), h: h || "1" });
      return m;
    });
    const RANG = { "1": ["#ffe6d2", "#c2410c"] }, HR = [["#dbe7ff", "#1f5fd6"], ["#d9f2e6", "#12805c"], ["#ece4ff", "#6d43d6"]];
    let hi = 0; terms.forEach(function (t) { if (!RANG[t.h]) RANG[t.h] = HR[hi++ % HR.length]; });
    const TW = 22, TH = 58, SQ = 22, G = 6, f = function (v) { return v.toFixed(1); };
    let x = 8, svg = "";
    const plitka = function (h, cross) {
      const c = RANG[h], w = h === "1" ? SQ : TW, hh = h === "1" ? SQ : TH, y = 10 + (TH - hh);
      let t = '<rect x="' + f(x) + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="3" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2"' + (cross ? ' opacity=".55"' : "") + "/>";
      t += '<text x="' + f(x + w / 2) + '" y="' + (y + hh / 2 + 5) + '" text-anchor="middle" font-size="' + (h === "1" ? 12 : 15) + '" font-weight="800" fill="' + c[1] + '">' + h + "</text>";
      if (cross) t += '<path d="M' + f(x - 2) + " " + (y - 2) + " L" + f(x + w + 2) + " " + (y + hh + 2) + " M" + f(x + w + 2) + " " + (y - 2) + " L" + f(x - 2) + " " + (y + hh + 2) + '" stroke="#d6454f" stroke-width="2.5"/>';
      x += w + G; return t;
    };
    const belgi = function (b) { svg += '<text x="' + f(x + 6) + '" y="' + (10 + TH - 14) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#1f2433">' + b + "</text>"; x += 18; };
    if (kesish) {
      /* o'xshash hadlar bitta guruhda: musbatlari chiziladi, ayrilganlari ustidan chiziladi */
      const tart = [], jam = {};
      terms.forEach(function (t) { if (!(t.h in jam)) { jam[t.h] = { p: 0, m: 0 }; tart.push(t.h); } if (t.sg > 0) jam[t.h].p += t.n; else jam[t.h].m += t.n; });
      tart.forEach(function (h, i) {
        if (i) x += 14;
        for (let k = 0; k < jam[h].p; k++) svg += plitka(h, k >= jam[h].p - jam[h].m);
      });
    } else {
      terms.forEach(function (t, i) {
        if (i || t.sg < 0) belgi(t.sg < 0 ? "−" : "+");
        for (let k = 0; k < t.n; k++) svg += plitka(t.h, false);
        x += 4;
      });
    }
    const W = x + 6, H = TH + 22;
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + f(W) + " " + H + '" width="' + Math.round(W) + '" role="img" aria-label="Algebraik plitkalar: ' + el.dataset.plitka + '">' + svg + "</svg>";
  }

  // ---------- pallali tarozi (tenglama): "2x + 4|20" ----------
  function chizTarozi(el) {
    const tomon = el.dataset.tarozi.split("|");
    const f = function (v) { return v.toFixed(1); };
    const parse = function (t) {
      const r = [];
      t.replace(/\s+/g, "").replace(/([+]?)(\d*)([a-z]?)/g, function (m, sg, n, h) {
        if (!m) return m;
        if (h) for (let k = 0; k < (n === "" ? 1 : Number(n)); k++) r.push({ h: h });
        else if (Number(n) <= (el.dataset.dona ? Number(el.dataset.dona) : 24)) for (let k = 0; k < Number(n); k++) r.push({ h: "1" });
        else r.push({ h: n, katta: true });
        return m;
      });
      return r;
    };
    const W = 420, cx = W / 2, pW = 156, bY = 30, pY = 168, half = 125;
    let svg = '<path d="M' + (cx - 34) + ' 222 L' + (cx + 34) + ' 222 L' + cx + " " + bY + ' Z" fill="#e8ecf5" stroke="#5b6577" stroke-width="2"/>';
    svg += '<line x1="' + (cx - half) + '" y1="' + bY + '" x2="' + (cx + half) + '" y2="' + bY + '" stroke="#1f2433" stroke-width="5" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + bY + '" r="7" fill="#1f2433"/>';
    tomon.forEach(function (t, i) {
      const ax = i ? cx + half : cx - half, px = ax - pW / 2, py = pY;
      svg += '<line x1="' + ax + '" y1="' + bY + '" x2="' + (px + 4) + '" y2="' + py + '" stroke="#9aa3b5" stroke-width="1.4"/><line x1="' + ax + '" y1="' + bY + '" x2="' + (px + pW - 4) + '" y2="' + py + '" stroke="#9aa3b5" stroke-width="1.4"/>';
      svg += '<path d="M' + px + " " + py + " Q" + (px + pW / 2) + " " + (py + 26) + " " + (px + pW) + " " + py + ' Z" fill="#c9d3e6" stroke="#5b6577" stroke-width="2"/>';
      const it = parse(t);
      /* buyumlarni pallaning ustiga qatorlab teramiz (pastdan yuqoriga) */
      let x = px + 8, y = py, qatorH = 0, satr = [];
      const qator = []; let cur = [], w = 0;
      it.forEach(function (o) {
        const ow = o.h === "1" ? 20 : o.katta ? 46 : 30;
        if (w + ow > pW - 12 && cur.length) { qator.push(cur); cur = []; w = 0; }
        cur.push(o); w += ow + 4;
      });
      if (cur.length) qator.push(cur);
      qator.forEach(function (q, qi) {
        let ww = q.reduce(function (a, o) { return a + (o.h === "1" ? 20 : o.katta ? 46 : 30) + 4; }, -4);
        let xx = px + pW / 2 - ww / 2;
        const hq = Math.max.apply(null, q.map(function (o) { return o.h === "1" ? 20 : 30; }));
        y -= hq + (qi ? 4 : 2);
        q.forEach(function (o) {
          if (o.h === "1") svg += '<circle cx="' + f(xx + 10) + '" cy="' + f(y + hq - 10) + '" r="10" fill="#ffe6d2" stroke="#c2410c" stroke-width="2"/><text x="' + f(xx + 10) + '" y="' + f(y + hq - 5.5) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#c2410c">1</text>', xx += 24;
          else if (o.katta) svg += '<path d="M' + f(xx + 6) + " " + f(y + hq) + " L" + f(xx + 40) + " " + f(y + hq) + " L" + f(xx + 34) + " " + f(y + 2) + " L" + f(xx + 12) + " " + f(y + 2) + ' Z" fill="#ffe6d2" stroke="#c2410c" stroke-width="2"/><text x="' + f(xx + 23) + '" y="' + f(y + hq - 9) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#c2410c">' + o.h + "</text>", xx += 50;
          else svg += '<rect x="' + f(xx) + '" y="' + f(y) + '" width="30" height="30" rx="4" fill="#dbe7ff" stroke="#1f5fd6" stroke-width="2"/><text x="' + f(xx + 15) + '" y="' + f(y + 21) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#1f5fd6">' + o.h + "</text>", xx += 34;
        });
      });
      svg += '<text x="' + (px + pW / 2) + '" y="' + (py + 46) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#1f2433">' + t.trim() + "</text>";
    });
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 10 ' + W + ' 222" width="' + W + '" role="img" aria-label="Pallali tarozi: ' + tomon.join(" = ") + '">' + svg + "</svg>";
  }

  // ---------- kasrni natural songa bo'lish (doira): "2/3:4" — 2/3 qism 4 kishiga ----------
  function chizUlush(el) {
    const m = el.dataset.ulush.match(/(\d+)\/(\d+):(\d+)/), a = +m[1], b = +m[2], n = +m[3];
    const R = 92, cx = 110, cy = 104, f = function (v) { return v.toFixed(1); };
    const RANG = ["#1f5fd6", "#e07b39", "#12805c", "#8b5cf6", "#d6454f", "#0e9aa7", "#b45309", "#db2777"];
    const P = function (t) { const ang = -Math.PI / 2 + t * 2 * Math.PI; return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)]; };
    const sektor = function (t1, t2, fill, op) {
      const p1 = P(t1), p2 = P(t2), big = t2 - t1 > 0.5 ? 1 : 0;
      return '<path d="M' + cx + " " + cy + " L" + f(p1[0]) + " " + f(p1[1]) + " A " + R + " " + R + " 0 " + big + " 1 " + f(p2[0]) + " " + f(p2[1]) + ' Z" fill="' + fill + '" fill-opacity="' + op + '"/>';
    };
    let svg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#fff"/>';
    const ul = a / b / n;
    for (let k = 0; k < n; k++) svg += sektor(k * ul, (k + 1) * ul, RANG[k % RANG.length], 0.75);
    /* mayda chiziqlar: butun b·n bo'lakka */
    for (let k = 0; k < b * n; k++) { const q = P(k / (b * n)); svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="#9aa3b5" stroke-width="1" stroke-dasharray="3 3"/>'; }
    for (let k = 0; k < b; k++) { const q = P(k / b); svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="#1f2433" stroke-width="2.4"/>'; }
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#1f2433" stroke-width="2.6"/>';
    let leg = "", y = 22;
    for (let k = 0; k < Math.min(n, 8); k++) { leg += '<rect x="226" y="' + (y - 11) + '" width="14" height="14" rx="3" fill="' + RANG[k] + '" fill-opacity=".75"/><text x="246" y="' + y + '" font-size="14" font-weight="700" fill="#1f2433">' + (k + 1) + "-kishi</text>"; y += 22; }
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 320 210" width="320" role="img" aria-label="' + a + "/" + b + " qism " + n + ' kishiga">' + svg + leg + "</svg>";
  }

  // ---------- bo'luvchi necha marta sig'adi (tasma): "2:3/4", "3/4:1/8" ----------
  function chizSigim(el) {
    const ekub = function (x, y) { return y ? ekub(y, x % y) : x; };
    const kasr = function (t) { const p = t.trim().split("/"); return [+p[0], p.length > 1 ? +p[1] : 1]; };
    const qism = el.dataset.sigim.split(":"), A = kasr(qism[0]), C = kasr(qism[1]);
    const D = A[1] * C[1] / ekub(A[1], C[1]);
    const uA = A[0] * D / A[1], uC = C[0] * D / C[1];
    const W = Math.max(1, Math.ceil(A[0] / A[1])), jami = W * D, gap = W > 1 ? 14 : 0;
    const cw = Math.max(9, Math.min(42, (520 - gap * (W - 1)) / jami)), h = 40, X0 = 10, Y0 = 26;
    const f = function (v) { return v.toFixed(1); };
    const x = function (i) { return X0 + Math.floor(i / D) * (D * cw + gap) + (i % D) * cw; };
    const RANG = [["#cfe0ff", "#1f5fd6"], ["#ffe1c9", "#c2410c"]], QOL = ["#d9f2e6", "#12805c"];
    const toliq = Math.floor(uA / uC), qoldiq = uA - toliq * uC;
    const kasrYoz = function (cx, y, s, m, rang) {
      return '<text x="' + f(cx) + '" y="' + y + '" text-anchor="middle" font-size="13" font-weight="800" fill="' + rang + '">' + s + "</text>" +
        '<line x1="' + f(cx - 8) + '" y1="' + (y + 4) + '" x2="' + f(cx + 8) + '" y2="' + (y + 4) + '" stroke="' + rang + '" stroke-width="1.6"/>' +
        '<text x="' + f(cx) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="13" font-weight="800" fill="' + rang + '">' + m + "</text>";
    };
    let svg = "";
    for (let i = 0; i < jami; i++) {
      let fill = "#fff";
      if (i < uA) { const g = Math.floor(i / uC); fill = g < toliq ? RANG[g % 2][0] : QOL[0]; }
      svg += '<rect x="' + f(x(i)) + '" y="' + Y0 + '" width="' + f(cw) + '" height="' + h + '" fill="' + fill + '"/>';
      if (i % D) {
        const asosiy = (i % (D / A[1]) === 0) && A[1] > 1;
        svg += '<line x1="' + f(x(i)) + '" y1="' + Y0 + '" x2="' + f(x(i)) + '" y2="' + (Y0 + h) + '" stroke="' + (asosiy ? "#1f2433" : "#8a93a8") + '" stroke-width="' + (asosiy ? 1.8 : 1) + '"' + (asosiy ? "" : ' stroke-dasharray="3 3"') + "/>";
      }
    }
    for (let k = 0; k < W; k++) {
      const x1 = X0 + k * (D * cw + gap);
      svg += '<rect x="' + f(x1) + '" y="' + Y0 + '" width="' + f(D * cw) + '" height="' + h + '" fill="none" stroke="#1f2433" stroke-width="2.4" rx="2"/>';
      if (W > 1) svg += '<text x="' + f(x1 + D * cw / 2) + '" y="' + (Y0 - 8) + '" text-anchor="middle" font-size="12" fill="#5b6275">' + (k + 1) + "-butun</text>";
    }
    const guruhlar = toliq + (qoldiq ? 1 : 0);
    for (let g = 0; g < guruhlar; g++) {
      const i1 = g * uC, i2 = Math.min(uA, (g + 1) * uC) - 1, xa = x(i1) + 2, xb = x(i2) + cw - 2, yb = Y0 + h + 6;
      const rang = g < toliq ? RANG[g % 2][1] : QOL[1];
      svg += '<path d="M' + f(xa) + " " + yb + " v6 H" + f(xb) + " v-6" + '" fill="none" stroke="' + rang + '" stroke-width="2"/>';
      const cx = (xa + xb) / 2;
      if (g < toliq) svg += '<text x="' + f(cx) + '" y="' + (yb + 24) + '" text-anchor="middle" font-size="15" font-weight="800" fill="' + rang + '">' + (g + 1) + "</text>";
      else { const e = ekub(qoldiq, uC); svg += kasrYoz(cx, yb + 22, qoldiq / e, uC / e, rang); }
    }
    const Wd = X0 * 2 + jami * cw + gap * (W - 1), Hd = Y0 + h + (qoldiq ? 56 : 42);
    el.classList.add("chz");
    el.innerHTML = '<svg viewBox="0 0 ' + f(Wd) + " " + Hd + '" width="' + Math.round(Wd) + '" role="img" aria-label="' + qism[0] + " ichida " + qism[1] + ' necha marta bor">' + svg + "</svg>";
  }

  // ---------- ustunli diagramma ----------
  function chizUstunli(el) {
    const q = el.dataset.ustunli.split("|").map(function (t) { const p = t.split(":"); return { nom: p[0], v: p[1] === "?" ? null : Number(p[1]) }; });
    const qadam = Number(el.dataset.qadam) || 10;
    const maxV = Math.max.apply(null, q.map(function (x) { return x.v || 0; }));
    const top = Math.ceil((maxV + 1) / qadam) * qadam;
    const W = 380, L = 54, R = 12, T = el.dataset.ortacha ? 34 : 16, B = 34, H = el.dataset.ortacha ? 238 : 220;
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
    if (el.dataset.qiymat === "1") q.forEach(function (x, i) {
      if (x.v !== null) svg += '<text x="' + (L + g * i + g / 2) + '" y="' + (Y(x.v) - 6) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1f2433">' + String(x.v).replace(".", ",") + "</text>";
    });
    if (el.dataset.ortacha) {
      const o = Number(el.dataset.ortacha);
      svg += '<line x1="' + L + '" y1="' + Y(o) + '" x2="' + (W - R) + '" y2="' + Y(o) + '" stroke="#d6454f" stroke-width="2.5" stroke-dasharray="7 5"/>' +
        '<line x1="' + (W - R - 128) + '" y1="12" x2="' + (W - R - 104) + '" y2="12" stroke="#d6454f" stroke-width="2.5" stroke-dasharray="7 5"/>' +
        '<text x="' + (W - R) + '" y="17" text-anchor="end" font-size="13" font-weight="800" fill="#d6454f">o\'rtacha: ' + String(o).replace(".", ",") + "</text>";
    }
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Ustunli diagramma: ' +
      q.map(function (x) { return x.nom + " — " + (x.v === null ? "noma'lum" : x.v); }).join(", ") + '">' + svg + "</svg>";
  }

  // ---------- me'yor sxemasi ----------
  function chizMeyor(el) {
    const p = el.dataset.meyor.split("|");
    const kb = p[0].trim().match(/^([\d,]+)\s+(.*)$/), jb = p[1].trim().match(/^([\d ,]+?)\s+(\D.*)$/);
    const k = Number(kb[1].replace(",", ".")), kBirl = kb[2];
    const jami = Number(jb[1].replace(/ /g, "").replace(",", ".")), jBirl = jb[2];
    if (el.dataset.kop) return chizMeyorKop(el, p);
    const me = jami / k, savol = el.dataset.yoz === "?";
    const W = 380, H = 150;
    let svg = '<defs><marker id="mq" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#5b6275"/></marker></defs>';
    const qator = function (y, a, b, rang) {
      return '<text x="20" y="' + y + '" font-size="18" font-weight="800" fill="#1f2433">' + a + "</text>" +
        '<line x1="118" y1="' + (y - 6) + '" x2="170" y2="' + (y - 6) + '" stroke="#5b6275" stroke-width="2.4" marker-end="url(#mq)"/>' +
        '<text x="184" y="' + y + '" font-size="18" font-weight="800" fill="' + rang + '">' + b + "</text>";
    };
    svg += qator(34, onliSon(k) + " " + kBirl, onliSon(jami) + " " + jBirl, "#1f5fd6");
    svg += qator(128, "1 " + kBirl, (savol ? "?" : onliSon(me)) + " " + jBirl, "#12805c");
    [[56, 24], [286, 24]].forEach(function (c, i) {
      svg += '<line x1="' + (i ? 300 : 60) + '" y1="48" x2="' + (i ? 300 : 60) + '" y2="102" stroke="#d4501b" stroke-width="2.4" marker-end="url(#mq)"/>' +
        '<rect x="' + (i ? 310 : 70) + '" y="64" width="54" height="26" rx="13" fill="#ffe6d6" stroke="#d4501b" stroke-width="1.6"/>' +
        '<text x="' + (i ? 337 : 97) + '" y="83" text-anchor="middle" font-size="15" font-weight="800" fill="#d4501b">: ' + onliSon(k) + "</text>";
    });
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + onliSon(k) + " " + kBirl + " — " + onliSon(jami) + " " + jBirl +
      "; 1 " + kBirl + " — " + (savol ? "noma'lum" : onliSon(me)) + " " + jBirl + '">' + svg + "</svg>";
  }

  function chizMeyorKop(el, p) {
    const kb = p[0].trim().match(/^([\d,]+)\s+(.*)$/), jb = p[1].trim().match(/^([\d ,]+?)\s+(\D.*)$/);
    const birl = kb[2], me = Number(jb[1].replace(/ /g, "").replace(",", ".")), jBirl = jb[2], k = Number(el.dataset.kop);
    const savol = el.dataset.yoz === "?";
    const W = 380, H = 150;
    let svg = '<defs><marker id="mk" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#5b6275"/></marker></defs>';
    const qator = function (y, a, b, rang) {
      return '<text x="20" y="' + y + '" font-size="18" font-weight="800" fill="#1f2433">' + a + "</text>" +
        '<line x1="118" y1="' + (y - 6) + '" x2="170" y2="' + (y - 6) + '" stroke="#5b6275" stroke-width="2.4" marker-end="url(#mk)"/>' +
        '<text x="184" y="' + y + '" font-size="18" font-weight="800" fill="' + rang + '">' + b + "</text>";
    };
    svg += qator(34, "1 " + birl, onliSon(me) + " " + jBirl, "#1f5fd6");
    svg += qator(128, onliSon(k) + " " + birl, (savol ? "?" : onliSon(me * k)) + " " + jBirl, "#12805c");
    [60, 300].forEach(function (x, i) {
      svg += '<line x1="' + x + '" y1="48" x2="' + x + '" y2="102" stroke="#d4501b" stroke-width="2.4" marker-end="url(#mk)"/>' +
        '<rect x="' + (i ? 310 : 70) + '" y="64" width="54" height="26" rx="13" fill="#ffe6d6" stroke="#d4501b" stroke-width="1.6"/>' +
        '<text x="' + (i ? 337 : 97) + '" y="83" text-anchor="middle" font-size="15" font-weight="800" fill="#d4501b">× ' + onliSon(k) + "</text>";
    });
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="1 ' + birl + " — " + onliSon(me) + " " + jBirl + "; " + onliSon(k) + " " + birl + " — " + (savol ? "noma'lum" : onliSon(me * k)) + " " + jBirl + '">' + svg + "</svg>";
  }

  // ---------- vaqt chizig'i ----------
  function chizVaqt(el) {
    const q = el.dataset.vaqt.split("|").map(function (t) { const a = t.split(":"); return Number(a[0]) * 60 + Number(a[1]); });
    let b = q[0], e = q[1]; if (e <= b) e += 1440;
    const bosh = Number(el.dataset.bosh) || 60, qadam = Number(el.dataset.qadam) || 30;
    const W = 380, L = 22, R = 22, Y = 58, iW = W - L - R, jami = e - b;
    const X = function (m) { return L + (m - b) / jami * iW; };
    const hhmm = function (m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
    let svg = "", n = 0;
    const b1 = Math.min(e, b + bosh);
    svg += '<rect x="' + X(b) + '" y="' + (Y - 14) + '" width="' + (X(b1) - X(b)) + '" height="28" fill="#dbe7ff" stroke="#1f5fd6" stroke-width="2"/>' +
      '<text x="' + ((X(b) + X(b1)) / 2) + '" y="' + (Y + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1f5fd6">dastlabki ' + (bosh === 60 ? "soat" : bosh + " min") + "</text>";
    for (let m = b1; m < e; m += qadam) {
      n++;
      const m2 = Math.min(e, m + qadam);
      svg += '<rect x="' + X(m) + '" y="' + (Y - 14) + '" width="' + (X(m2) - X(m)) + '" height="28" fill="#ffe6d6" stroke="#d4501b" stroke-width="2"/>' +
        '<text x="' + ((X(m) + X(m2)) / 2) + '" y="' + (Y + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#d4501b">' + n + "</text>";
    }
    const tiklar = [b];
    for (let m = b + qadam; m < e; m += qadam) tiklar.push(m);
    tiklar.push(e);
    tiklar.forEach(function (m) {
      svg += '<line x1="' + X(m) + '" y1="' + (Y + 14) + '" x2="' + X(m) + '" y2="' + (Y + 22) + '" stroke="#1f2433" stroke-width="2"/>' +
        '<text x="' + X(m) + '" y="' + (Y + 38) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2433">' + hhmm(m) + "</text>";
    });
    svg += '<text x="' + (W / 2) + '" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#1f2433">' + hhmm(b) + " dan " + hhmm(e) + " gacha: " + Math.floor(jami / 60) + " soat" + (jami % 60 ? " " + (jami % 60) + " min" : "") + "</text>";
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' 100" role="img" aria-label="Vaqt chizig\'i ' + hhmm(b) + " – " + hhmm(e) + '">' + svg + "</svg>";
  }

  // ---------- uch miqdor sxemasi ----------
  function chizUchburchak(el) {
    const q = el.dataset.uchburchak.split("|");
    const W = 380, H = 190;
    let svg = '<rect x="10" y="8" width="360" height="96" rx="14" fill="#f4f6fb" stroke="#d5d9e4" stroke-width="2"/>' +
      '<line x1="190" y1="62" x2="190" y2="104" stroke="#1f2433" stroke-width="2.4"/><line x1="10" y1="62" x2="370" y2="62" stroke="#1f2433" stroke-width="2.4"/>';
    svg += '<text x="190" y="42" text-anchor="middle" font-size="19" font-weight="800" fill="#1f5fd6">' + q[0] + "</text>" +
      '<text x="100" y="90" text-anchor="middle" font-size="18" font-weight="800" fill="#d4501b">' + q[1] + "</text>" +
      '<text x="280" y="90" text-anchor="middle" font-size="18" font-weight="800" fill="#12805c">' + q[2] + "</text>";
    const sat = [["#1f5fd6", q[0] + " = " + q[1] + " · " + q[2]], ["#d4501b", q[1] + " = " + q[0] + " : " + q[2]], ["#12805c", q[2] + " = " + q[0] + " : " + q[1]]];
    sat.forEach(function (t, i) { svg += '<text x="190" y="' + (130 + i * 22) + '" text-anchor="middle" font-size="14" font-weight="700" fill="' + t[0] + '">' + t[1] + "</text>"; });
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Uch miqdor: ' + q.join(", ") + '">' + svg + "</svg>";
  }

  // ---------- chiziqli grafik ----------
  function chizGrafik(el) {
    const n = el.dataset.grafik.split(",").map(function (t) { const q = t.split(":"); return [Number(q[0]), Number(q[1])]; });
    const xm = Number(el.dataset.xmax) || Math.ceil(n[n.length - 1][0] + 1);
    const yq = Number(el.dataset.yqadam) || 10;
    const ym = Number(el.dataset.ymax) || Math.ceil((n[n.length - 1][1] + 1) / yq) * yq;
    const W = 380, L = 50, R = 18, T = 34, B = 42, H = 250;
    const iW = W - L - R, iH = H - T - B;
    const X = function (v) { return L + v / xm * iW; }, Y = function (v) { return T + iH - v / ym * iH; };
    let svg = "";
    for (let v = 0; v <= ym + 1e-9; v += yq)
      svg += '<line x1="' + L + '" y1="' + Y(v) + '" x2="' + (W - R) + '" y2="' + Y(v) + '" stroke="#d5d9e4" stroke-width="1"/>' +
        '<text x="' + (L - 6) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="13" fill="#5b6275">' + onliSon(v) + "</text>";
    const xq = Number(el.dataset.xqadam) || 1, y0 = Number(el.dataset.bosh) || 0;
    for (let v = 0; v <= xm + 1e-9; v += xq)
      svg += '<line x1="' + X(v) + '" y1="' + T + '" x2="' + X(v) + '" y2="' + Y(0) + '" stroke="#eceff5" stroke-width="1"/>' +
        '<text x="' + X(v) + '" y="' + (Y(0) + 18) + '" text-anchor="middle" font-size="13" fill="#5b6275">' + v + "</text>";
    svg += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + Y(0) + '" stroke="#1f2433" stroke-width="2"/>' +
      '<line x1="' + L + '" y1="' + Y(0) + '" x2="' + (W - R) + '" y2="' + Y(0) + '" stroke="#1f2433" stroke-width="2"/>';
    const last = n[n.length - 1], k = (last[1] - y0) / last[0];
    const xe = Math.min(xm, (ym - y0) / k, last[0] + xm * 0.12);
    svg += '<line x1="' + X(0) + '" y1="' + Y(y0) + '" x2="' + X(xe) + '" y2="' + Y(y0 + k * xe) + '" stroke="#1f5fd6" stroke-width="3" stroke-linecap="round"/>';
    n.forEach(function (q) { svg += '<circle cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="5" fill="#d4501b" stroke="#fff" stroke-width="1.5"/>'; });
    if (el.dataset.nom) svg += '<text x="' + (W / 2) + '" y="18" text-anchor="middle" font-size="15" font-weight="800" fill="#1f2433">' + el.dataset.nom + "</text>";
    if (el.dataset.x) svg += '<text x="' + (L + iW / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="13" fill="#5b6275">' + el.dataset.x + "</text>";
    if (el.dataset.y) svg += '<text x="13" y="' + (T + iH / 2) + '" text-anchor="middle" font-size="13" fill="#5b6275" transform="rotate(-90 13 ' + (T + iH / 2) + ')">' + el.dataset.y + "</text>";
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Chiziqli grafik">' + svg + "</svg>";
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
  let geoSon = 0;
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
    const RANG = Array.isArray(g.ranglar) && g.ranglar.length ? g.ranglar : ["#e3f5ec", "#eef0fc", "#fff4e5", "#f3eefc"];
    (g.shakl || []).forEach(function (sh, i) {
      svg += '<path d="M' + sh.split("").map(function (k) { return xy(pts[k]); }).join(" L") + ' Z" fill="' + RANG[i % RANG.length] + '" fill-opacity=".9" stroke="#12805c" stroke-width="2.4" stroke-linejoin="round"/>';
    });
    if (g.katak && g.ustkatak && (g.shakl || []).length) {
      // shakllar ichida katak chiziqlari (kesib olingan, to'qroq rangda)
      const cid = "ustk" + (++geoSon);
      svg += '<clipPath id="' + cid + '">' + g.shakl.map(function (sh) { return '<path d="M' + sh.split("").map(function (k) { return xy(pts[k]); }).join(" L") + ' Z"/>'; }).join("") + "</clipPath>";
      svg += '<g clip-path="url(#' + cid + ')" stroke="#7d879c" stroke-width="1.2">';
      for (let i = 0; i <= kw; i++) svg += '<line x1="' + (pad + i * s) + '" y1="' + pad + '" x2="' + (pad + i * s) + '" y2="' + (pad + kh * s) + '"/>';
      for (let j = 0; j <= kh; j++) svg += '<line x1="' + pad + '" y1="' + (pad + j * s) + '" x2="' + (pad + kw * s) + '" y2="' + (pad + j * s) + '"/>';
      svg += "</g>";
    }
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
    // soha nomlari (shakl ichida)
    Object.keys(g.matn || {}).forEach(function (k) {
      const p = g.matn[k];
      svg += '<text x="' + X(p).toFixed(1) + '" y="' + (Y(p) + 6).toFixed(1) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#6d3fc0">' + k + "</text>";
    });
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

  // ---------- ikki nisbatni birlashtirish: A:B va B:C → A:B:C (tasmalar, mayda bo'lakchalar) ----------
  function chizBirlash(el) {
    const juft = el.dataset.birlash.split("|").map(function (p) {
      return p.split(",").map(function (q) { const i = q.lastIndexOf(":"); return { nom: q.slice(0, i).trim(), b: Number(q.slice(i + 1)) }; });
    });
    if (juft.length !== 2 || juft[0].length !== 2 || juft[1].length !== 2) return;
    const n1 = juft[0].map(function (x) { return x.nom; }), n2 = juft[1].map(function (x) { return x.nom; });
    const um = n1.find(function (n) { return n2.indexOf(n) >= 0; });
    if (!um) return;
    const ekub = function (a, b) { return b ? ekub(b, a % b) : a; };
    const h1 = juft[0][n1.indexOf(um)].b, h2 = juft[1][n2.indexOf(um)].b, ekuk = h1 * h2 / ekub(h1, h2);
    const kk = [ekuk / h1, ekuk / h2];
    const qiy = {};
    juft.forEach(function (p, j) { p.forEach(function (x) { qiy[x.nom] = x.b * kk[j]; }); });
    const tart = el.dataset.natija ? el.dataset.natija.split(",").map(function (s) { return s.trim(); }) : n1.concat(n2.filter(function (n) { return n1.indexOf(n) < 0; }));
    const rang = {}; tart.forEach(function (n, i) { rang[n] = TASMA_RANG[i % TASMA_RANG.length]; });
    const bosq = (el.dataset.bosqich || "1|2|3").split("|").map(Number);
    const maxF = Math.max.apply(null, tart.map(function (n) { return qiy[n]; }));
    const W = 380, Lm = 80, Rm = 62, H = 26, ora = 6, u = (W - Lm - Rm) / maxF;
    const f = function (v) { return v.toFixed(1); };
    let svg = "", y = 4, raqam = 0;
    const sarlavha = function (t) { t = (++raqam) + ") " + t; svg += '<text x="4" y="' + (y + 15) + '" font-size="14" font-weight="800" fill="#5f6676">' + t + "</text>"; y += 24; };
    const nomYoz = function (n, yy) { svg += '<text x="' + (Lm - 8) + '" y="' + (yy + H / 2 + 5) + '" text-anchor="end" font-size="15" font-weight="700" fill="#1f2433">' + n + "</text>"; };
    const sonYoz = function (t, yy, c) { svg += '<text x="' + (W - Rm + 8) + '" y="' + (yy + H / 2 + 5) + '" font-size="15" font-weight="800" fill="' + c + '">' + t + "</text>"; };
    const juftChiz = function (mayda) {
      juft.forEach(function (p, j) {
        const y0 = y;
        p.forEach(function (x) {
          const c = rang[x.nom] || TASMA_RANG[0], bw = kk[j] * u;
          nomYoz(x.nom, y);
          for (let k = 0; k < x.b; k++) {
            const x0 = Lm + k * bw;
            svg += '<rect x="' + f(x0) + '" y="' + y + '" width="' + f(bw) + '" height="' + H + '" rx="2" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2.2"/>';
            if (mayda) for (let m = 1; m < kk[j]; m++) svg += '<line x1="' + f(x0 + m * u) + '" y1="' + (y + 3) + '" x2="' + f(x0 + m * u) + '" y2="' + (y + H - 3) + '" stroke="' + c[1] + '" stroke-width="1.1" stroke-dasharray="3 3"/>';
          }
          sonYoz(mayda ? String(x.b * kk[j]) : String(x.b), y, c[1]);
          y += H + ora;
        });
        if (mayda) svg += '<text x="' + (W - 4) + '" y="' + f((y0 + y - ora) / 2 + 5) + '" text-anchor="end" font-size="15" font-weight="800" fill="#b45309">×' + kk[j] + "</text>";
        if (j === 0) { svg += '<line x1="4" y1="' + (y + 4) + '" x2="' + (W - 4) + '" y2="' + (y + 4) + '" stroke="#9aa3b5" stroke-width="1.4" stroke-dasharray="6 5"/>'; y += 14; }
      });
      y += 10;
    };
    if (bosq.indexOf(1) >= 0) { sarlavha("Berilgan nisbatlar"); juftChiz(false); }
    if (bosq.indexOf(2) >= 0) { sarlavha(um + ": " + h1 + " va " + h2 + " → " + ekuk + " ta bo'lakcha (EKUK)"); juftChiz(true); }
    if (bosq.indexOf(3) >= 0) {
      sarlavha("Uch miqdor nisbati");
      tart.forEach(function (n) {
        const c = rang[n];
        nomYoz(n, y);
        for (let k = 0; k < qiy[n]; k++) svg += '<rect x="' + f(Lm + k * u) + '" y="' + y + '" width="' + f(u) + '" height="' + H + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.3"/>';
        sonYoz(String(qiy[n]), y, c[1]);
        y += H + ora;
      });
      const t = tart.join(" : ") + " = " + tart.map(function (n) { return qiy[n]; }).join(" : ");
      svg += '<text x="' + (W / 2) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="' + (t.length > 40 ? 13 : 15) + '" font-weight="800" fill="#12805c">' + t + "</text>";
      y += 28;
    }
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + (y + 4) + '" role="img" aria-label="' +
      (el.dataset.izoh || "Ikki nisbatni birlashtirish: " + tart.join(" : ") + " = " + tart.map(function (n) { return qiy[n]; }).join(" : ")).replace(/"/g, "") + '">' + svg + "</svg>";
  }

  // ---------- o'zgaruvchan nisbat: «Oldin» va «Keyin» chizmali modeli (o'zgarmas narsa bo'yicha bo'lakchalar) ----------
  // Python egizagi: _reja/tools/ozgar_svg.py (test savollari uchun) — o'zgartirilsa, ikkalasi birga o'zgartiriladi.
  function chizOzgar(el) {
    const ikki = el.dataset.ozgar.split(">");
    if (ikki.length !== 2) return;
    const oqi = function (s) {
      return s.split("|").map(function (q) { const i = q.lastIndexOf(":"); return { nom: q.slice(0, i).trim(), b: Number(q.slice(i + 1)) }; });
    };
    const O = oqi(ikki[0]), K = oqi(ikki[1]);
    if (O.length !== 2 || K.length !== 2) return;
    const tur = el.dataset.tur || "bir";
    const ekub = function (a, b) { return b ? ekub(b, a % b) : a; };
    let oldU, newU, bO, bK;
    if (tur === "teng") {
      const ch = (el.dataset.son || "0,0").replace(/−/g, "-").split(",").map(Number);
      const p = (ch[0] - ch[1]) / (K[0].b - K[1].b);
      if (!(p > 0)) return;
      newU = [K[0].b * p, K[1].b * p];
      oldU = [newU[0] - ch[0], newU[1] - ch[1]];
      bO = oldU[0]; bK = p;
    } else {
      let x, y0;
      if (tur === "jami") { x = O[0].b + O[1].b; y0 = K[0].b + K[1].b; }
      else if (tur === "farq") {
        x = Math.abs(O[0].b - O[1].b); y0 = Math.abs(K[0].b - K[1].b);
        if ((O[0].b - O[1].b) * (K[0].b - K[1].b) <= 0) return;
      } else {
        let i = O.map(function (r) { return r.nom; }).indexOf(el.dataset.ozgarmas);
        if (i < 0) i = 1;
        x = O[i].b; y0 = K[i].b;
      }
      const E = x / ekub(x, y0) * y0;
      bO = E / x; bK = E / y0;
      oldU = [O[0].b * bO, O[1].b * bO]; newU = [K[0].b * bK, K[1].b * bK];
    }
    if (!(oldU[0] > 0 && oldU[1] > 0 && newU[0] >= 0 && newU[1] >= 0)) return;
    const yoz = {};
    (el.dataset.yoz || "").split("|").forEach(function (s) { const i = s.indexOf(":"); if (i > 0) yoz[s.slice(0, i).trim()] = s.slice(i + 1).trim(); });
    const bosq = Number(el.dataset.bosqich || 3);
    const mayda = el.dataset.mayda !== "0" && bosq >= 3 && tur !== "teng";
    const sar = (el.dataset.sarlavha || "Oldin|Keyin").split("|");
    const f = function (v) { return String(Math.floor(v * 10 + 0.5) / 10); };
    const W = 380, Lm = 84, H = 30;
    const ongM = [yoz.o, bosq >= 2 ? yoz.k : ""].filter(function (s) { return s; });
    const Rm = ongM.length ? 26 + 8.6 * Math.max.apply(null, ongM.map(function (s) { return s.length; })) : 8;
    const maxU = Math.max(oldU[0], oldU[1], bosq >= 2 ? Math.max(newU[0], newU[1]) : 0);
    const u = (W - Lm - Rm) / maxU;
    const X = function (v) { return Lm + v * u; };
    let svg = "", y = 4;
    const qavsPast = function (x1, x2, yy, t) {
      svg += '<path d="M' + f(x1) + " " + f(yy) + " V" + f(yy + 6) + " H" + f(x2) + " V" + f(yy) + '" fill="none" stroke="#b45309" stroke-width="1.8"/>';
      const tw = t.length * 7.6, cx = Math.min(Math.max((x1 + x2) / 2, tw / 2 + 2), W - tw / 2 - 2);
      svg += '<text x="' + f(cx) + '" y="' + f(yy + 22) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#b45309">' + t + "</text>";
    };
    const qavsUst = function (x1, x2, yy, t) {
      svg += '<path d="M' + f(x1) + " " + f(yy) + " V" + f(yy - 6) + " H" + f(x2) + " V" + f(yy) + '" fill="none" stroke="#1f2433" stroke-width="1.8"/>';
      const tw = t.length * 8.2, cx = Math.min(Math.max((x1 + x2) / 2, tw / 2 + 2), W - tw / 2 - 2);
      svg += '<text x="' + f(cx) + '" y="' + f(yy - 11) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#1f2433">' + t + "</text>";
    };
    const qavsOng = function (y1, y2, t) {
      const x = X(maxU) + 6, ym = (y1 + y2) / 2;
      svg += '<path d="M' + f(x) + " " + f(y1) + " Q" + f(x + 7) + " " + f(y1) + " " + f(x + 7) + " " + f(y1 + 8) + " V" + f(ym - 6) +
        " Q" + f(x + 7) + " " + f(ym) + " " + f(x + 13) + " " + f(ym) + " Q" + f(x + 7) + " " + f(ym) + " " + f(x + 7) + " " + f(ym + 6) +
        " V" + f(y2 - 8) + " Q" + f(x + 7) + " " + f(y2) + " " + f(x) + " " + f(y2) + '" fill="none" stroke="#1f2433" stroke-width="1.8"/>';
      svg += '<text x="' + f(x + 17) + '" y="' + f(ym + 6) + '" font-size="16" font-weight="800" fill="#1f2433">' + t + "</text>";
    };
    const guruh = function (nomi, qatorlar, ongKalit, ustKalit) {
      svg += '<text x="4" y="' + f(y + 14) + '" font-size="14" font-style="italic" font-weight="700" fill="#5f6676">' + nomi + "</text>";
      y += 22;
      const ys = [];
      qatorlar.forEach(function (r, i) {
        const c = TASMA_RANG[i % TASMA_RANG.length], ust = yoz[ustKalit + i];
        if (ust) y += 22;
        ys.push(y);
        svg += '<text x="' + (Lm - 8) + '" y="' + f(y + H / 2 + 5) + '" text-anchor="end" font-size="15" font-weight="700" fill="#1f2433">' + r.nom + "</text>";
        if (r.len > 0) svg += '<rect x="' + f(Lm) + '" y="' + f(y) + '" width="' + f(r.len * u) + '" height="' + H + '" fill="' + c[0] + '"/>';
        if (r.qosh) svg += '<rect x="' + f(X(r.qosh[0])) + '" y="' + f(y) + '" width="' + f((r.qosh[1] - r.qosh[0]) * u) + '" height="' + H + '" fill="' + r.qosh[2] + '"' + (r.qosh[3] ? ' fill-opacity="' + r.qosh[3] + '"' : "") + "/>";
        if (r.ayir) svg += '<rect x="' + f(X(r.ayir[0])) + '" y="' + f(y + 1) + '" width="' + f((r.ayir[1] - r.ayir[0]) * u) + '" height="' + (H - 2) + '" rx="2" fill="#fff" stroke="' + c[1] + '" stroke-width="1.8" stroke-dasharray="6 4"/>';
        if (mayda) {
          const oxir = r.ayir ? r.ayir[1] : r.len;
          for (let k = 1; k < oxir; k++) {
            if (k < r.len && k % r.blok === 0) continue;
            if (k === r.len) continue;
            const ich = k < r.len;
            svg += '<line x1="' + f(X(k)) + '" y1="' + f(y + 3) + '" x2="' + f(X(k)) + '" y2="' + f(y + H - 3) + '" stroke="' + c[1] + '" stroke-width="1.2" stroke-dasharray="3 3" opacity="' + (ich ? ".75" : ".45") + '"/>';
          }
        }
        for (let s = 0; s < r.len - 1e-9; s += r.blok) {
          svg += '<rect x="' + f(X(s)) + '" y="' + f(y) + '" width="' + f(Math.min(r.blok, r.len - s) * u) + '" height="' + H + '" rx="2" fill="none" stroke="' + c[1] + '" stroke-width="2"/>';
        }
        if (ust && r.len > 0) qavsUst(Lm, X(r.len), y - 6, ust);
        y += H;
        const z = r.qosh || r.ayir;
        if (r.d && z) { qavsPast(X(z[0]), X(z[1]), y + 5, r.d); y += 26; }
        y += 8;
      });
      if (yoz[ongKalit]) qavsOng(ys[0], ys[ys.length - 1] + H, yoz[ongKalit]);
      y += 4;
    };
    guruh(sar[0], O.map(function (r, i) { return { nom: r.nom, len: oldU[i], blok: bO }; }), "o", "o");
    if (bosq >= 2) {
      guruh(sar[1] || "Keyin", K.map(function (r, i) {
        const q = { nom: r.nom, len: newU[i], blok: bK, d: yoz["d" + i] };
        if (newU[i] > oldU[i] + 1e-9) {
          q.qosh = tur === "jami" ? [oldU[i], newU[i], TASMA_RANG[(1 - i) % TASMA_RANG.length][0], ""] : [oldU[i], newU[i], TASMA_RANG[i % TASMA_RANG.length][1], ".32"];
        } else if (newU[i] < oldU[i] - 1e-9) q.ayir = [newU[i], oldU[i]];
        return q;
      }), "k", "k");
    }
    const izoh = el.dataset.izoh || ("Chizmali model: oldin " + O[0].nom + " : " + O[1].nom + " = " + O[0].b + " : " + O[1].b +
      (bosq >= 2 ? ", keyin " + K[0].b + " : " + K[1].b : ""));
    el.classList.add("tasma");
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + f(y) + '" role="img" aria-label="' + izoh.replace(/"/g, "") + '">' + svg + "</svg>";
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
      root.querySelectorAll("[data-meyor]").forEach(chizMeyor);
      root.querySelectorAll("[data-grafik]").forEach(chizGrafik);
      root.querySelectorAll("[data-vaqt]").forEach(chizVaqt);
      root.querySelectorAll("[data-uchburchak]").forEach(chizUchburchak);
      root.querySelectorAll("[data-foiz]").forEach(chizFoiz);
      root.querySelectorAll("[data-foizbar]").forEach(chizFoizbar);
      root.querySelectorAll("[data-foizyol]").forEach(chizFoizyol);
      root.querySelectorAll("[data-chek]").forEach(chizChek);
      root.querySelectorAll("[data-likop]").forEach(chizLikop);
      root.querySelectorAll("[data-nurlar]").forEach(chizNurlar);
      root.querySelectorAll("[data-shakl]").forEach(chizShakl);
      root.querySelectorAll("[data-yasash]").forEach(chizYasash);
      root.querySelectorAll("[data-model]").forEach(chizModel);
      root.querySelectorAll("[data-plitka]").forEach(chizPlitka);
      root.querySelectorAll("[data-tarozi]").forEach(chizTarozi);
      root.querySelectorAll("[data-ulush]").forEach(chizUlush);
      root.querySelectorAll("[data-sigim]").forEach(chizSigim);
      root.querySelectorAll("[data-birlash]").forEach(chizBirlash);
      root.querySelectorAll("[data-ozgar]").forEach(chizOzgar);
      root.querySelectorAll("[data-aylana]").forEach(chizAylana);
      root.querySelectorAll("[data-yoyish]").forEach(chizYoyish);
      root.querySelectorAll("[data-yoy]").forEach(chizYoy);
    }
  };
})();
