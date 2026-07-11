import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
  clearIndexedDbPersistence,
  terminate,
  waitForPendingWrites,
} from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { isTrustedDevice, setTrustedDevicePreference } from './security/deviceTrust.js';

const firebaseConfig = {
  apiKey: 'AIzaSyB45g_2KRGlXH0iAPyBGuCnrFkhxCHadKs',
  authDomain: 'nacholo.firebaseapp.com',
  projectId: 'nacholo',
  storageBucket: 'nacholo.appspot.com',
  messagingSenderId: '924503328068',
  appId: '1:924503328068:web:1f753ced7f47ec36750311',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* ================= Firebase App Check ================= */
const appCheckSiteKey = String(import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY || '').trim();
const appCheckRequired = String(import.meta.env.VITE_FIREBASE_APP_CHECK_REQUIRED || '').toLowerCase() === 'true';
const appCheckDebug = String(import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG || '').toLowerCase() === 'true';

export let appCheck = null;
export const appCheckEnabled = !!appCheckSiteKey;

if (appCheckDebug && typeof self !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)) {
  // Firebase muestra el token en la consola del navegador. Regístralo en
  // Firebase Console > App Check > Apps > Manage debug tokens.
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

if (appCheckSiteKey) {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else if (appCheckRequired) {
  throw new Error('App Check es obligatorio, pero falta VITE_FIREBASE_APP_CHECK_SITE_KEY.');
} else {
  console.warn('[Security] App Check preparado pero no activo: falta VITE_FIREBASE_APP_CHECK_SITE_KEY.');
}

/* ================= Firestore cache policy ================= */
export const persistentCacheEnabled = isTrustedDevice();

export const db = initializeFirestore(app, {
  localCache: persistentCacheEnabled
    ? persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    : memoryLocalCache(),
});

/* ================= Auth ================= */
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Auth] No se pudo activar persistencia local de sesión:', err?.code || err);
});

/**
 * Cambia la preferencia de dispositivo confiable. El cambio se aplica al
 * reiniciar la app porque Firestore decide el tipo de caché al inicializarse.
 */
export function updateTrustedDevicePreference(enabled){
  return setTrustedDevicePreference(!!enabled);
}

/**
 * Borra la caché persistente de Firestore de este navegador y recarga.
 * Se usa solo por acción explícita del usuario.
 */
export async function clearLocalFirestoreCache(){
  try {
    await Promise.race([
      waitForPendingWrites(db),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]).catch(() => {});

    await terminate(db);
    await clearIndexedDbPersistence(db);
  } finally {
    location.reload();
  }
}

export { app };
