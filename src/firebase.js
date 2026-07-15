import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  clearIndexedDbPersistence,
} from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';

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

/* ================= Firestore: siempre en línea ================= */
// PartyPlanner no ofrece modo offline. Firestore conserva únicamente una caché
// temporal en memoria mientras la pestaña está abierta. Los archivos estáticos
// de la web pueden seguir usando la caché normal del navegador.
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

const LEGACY_TRUSTED_DEVICE_KEY = 'partyplanner:trusted-device:v1';
const MEMORY_ONLY_MIGRATION_KEY = 'partyplanner:memory-only-cache:v1';

function safeLocalStorage(){
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/**
 * Limpieza única para navegadores que usaron la antigua caché persistente.
 * Debe resolverse antes de iniciar listeners o lecturas de Firestore.
 */
export const firestoreReady = (async () => {
  const storage = safeLocalStorage();
  const alreadyMigrated = storage?.getItem(MEMORY_ONLY_MIGRATION_KEY) === 'done';

  if (alreadyMigrated) return;

  try {
    await clearIndexedDbPersistence(db);
  } catch (err) {
    // Puede fallar si otra pestaña antigua mantiene Firestore abierto. La app
    // igualmente usa memoryLocalCache desde esta versión y reintentará en el
    // próximo inicio hasta completar la migración.
    const code = String(err?.code || '');
    if (!code.includes('failed-precondition') && !code.includes('unimplemented')) {
      console.warn('[Firestore] No se pudo limpiar la caché persistente anterior:', err);
    }
    return;
  }

  try {
    storage?.removeItem(LEGACY_TRUSTED_DEVICE_KEY);
    storage?.setItem(MEMORY_ONLY_MIGRATION_KEY, 'done');
  } catch {
    // La política de memoria sigue activa aunque localStorage no esté disponible.
  }
})();

/* ================= Auth ================= */
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Auth] No se pudo activar persistencia local de sesión:', err?.code || err);
});

export { app };
