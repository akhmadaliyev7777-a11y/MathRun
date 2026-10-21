/*
  Firebase sozlamalari.

  Bu qiymatlarni Firebase Console'dan olasiz:
  1. https://console.firebase.google.com ga kiring, yangi loyiha yarating.
  2. Loyiha sozlamalari (⚙️) -> "Your apps" -> "</> Web" ni bosib veb-ilova qo'shing.
  3. Sizga ko'rsatiladigan "firebaseConfig" obyektidagi qiymatlarni pastga ko'chiring.
  4. Authentication bo'limida "Email/Password" usulini yoqing.
  5. O'sha bo'limda o'zingiz uchun (admin) bitta foydalanuvchi (email + parol) yarating.
  6. Pastdagi ADMIN_EMAIL ni aynan shu email bilan almashtiring.

  Batafsil qadamlar uchun README.md dagi "Firebase sozlash" bo'limiga qarang.
*/

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCw8hgMsKdIiIiKFf8LT389ONYcLFtaVAM",
  authDomain: "mathlearn-bd240.firebaseapp.com",
  projectId: "mathlearn-bd240",
  storageBucket: "mathlearn-bd240.firebasestorage.app",
  messagingSenderId: "336090010860",
  appId: "1:336090010860:web:39cabc816980ccb74b01c9"
};

const ADMIN_EMAIL = "akhmadaliyev7777@gmail.com";
