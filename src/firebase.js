import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore, persistentLocalCache } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB45g_2KRGlXH0iAPyBGuCnrFkhxCHadKs",
  authDomain: "nacholo.firebaseapp.com",
  projectId: "nacholo",
  storageBucket: "nacholo.appspot.com",
  messagingSenderId: "924503328068",
  appId: "1:924503328068:web:1f753ced7f47ec36750311"
};

// ✅ usa la instancia existente si ya está
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ inicializa Firestore con caché moderna (sin warnings ni crashes)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// ✅ auth
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});
