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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const ADMIN_EMAIL = "sizning-emailingiz@gmail.com";
