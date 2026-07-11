// js/auth.js

import { auth, db } from './firebase.js';
import { setOnlineStatus } from './pair.js';
import { preloadCourses } from './semesters.js'; // ✅ nuevo
import {
  GoogleAuthProvider,
  signInWithPopup,
  // getRedirectResult,  // ya no lo necesitamos aquí
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import { $, state, updateDebug } from './state.js';
import { loadMyPair } from './pair.js';
import { clearActiveSemester, refreshSemestersSub } from './semesters.js'; // ⬅️ importante
import { stopSemestersSub} from './semesters.js';

let profileModulePromise = null;

function getProfileModule(){
  if (!profileModulePromise) {
    profileModulePromise = import('./profile.js');
  }
  return profileModulePromise;
}


const PRESENCE_HEARTBEAT_MS = 90_000;
let presenceTimer = null;
let presenceVisibilityBound = false;

function stopPresenceHeartbeat(){
  if (presenceTimer) {
    clearInterval(presenceTimer);
    presenceTimer = null;
  }
}

function startPresenceHeartbeat(){
  stopPresenceHeartbeat();

  setOnlineStatus(true).catch(() => {});
  presenceTimer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      setOnlineStatus(true).catch(() => {});
    }
  }, PRESENCE_HEARTBEAT_MS);

  if (!presenceVisibilityBound) {
    presenceVisibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && state.currentUser) {
        setOnlineStatus(true).catch(() => {});
      }
    });
  }
}

function setNonProfileTabsDisabled(disabled) {
  document.querySelectorAll('.nav-tab[data-route]').forEach(btn => {
    if (btn.dataset.route !== '#/perfil') {
      btn.toggleAttribute('disabled', disabled);     // true → pone disabled, false → lo quita
      btn.setAttribute('aria-disabled', String(disabled));
    }
  });
}

export function initAuth() {


  if (window.__PartyPlannerAuthInit) return;
  window.__PartyPlannerAuthInit = true;

  const signInBtn  = $('signInBtn');
  const signOutBtn = $('signOutBtn');
  const switchBtn  = $('switchAccountBtn'); 
  const userBadge  = $('userBadge');
  const userNameEl = $('userName');

  // Helpers UI
const setAuthLoading = (loading) => {
  if (signInBtn)  signInBtn.disabled  = loading;
  if (signOutBtn) signOutBtn.disabled = loading;
  if (switchBtn)  switchBtn.disabled  = loading;
};

  const showSignedIn = (nameOrEmail) => {
  if (userBadge)  { userBadge.classList.remove('hidden'); userBadge.style.display = 'inline-flex'; }
  if (signInBtn)  { signInBtn.classList.add('hidden');  signInBtn.style.display = 'none'; }
  if (userNameEl) userNameEl.textContent  = nameOrEmail || '—';
  const createPairBtn = $('createPairBtn');
  const copyInviteBtn = $('copyInviteBtn');
  if (createPairBtn) createPairBtn.disabled = false;
  if (copyInviteBtn) copyInviteBtn.disabled = false;

  setNonProfileTabsDisabled(false); 
};
  const showSignedOut = () => {
  if (userBadge)  { userBadge.classList.add('hidden'); userBadge.style.display = 'none'; }
  if (signInBtn)  { signInBtn.classList.remove('hidden'); signInBtn.style.display = 'inline-block'; }

  const pairId = $('pairId');
  const copyInviteBtn = $('copyInviteBtn');
  const createPairBtn = $('createPairBtn');
  if (pairId) pairId.textContent = '—';
  if (copyInviteBtn) copyInviteBtn.disabled = true;
  if (createPairBtn) createPairBtn.disabled = true;

  state.profileData = null;

  // Fase 4: esta función vive en profile.js y ahora se carga de forma lazy.
  // No puede llamarse como símbolo global, porque provoca pageerror en usuarios sin sesión.
  getProfileModule()
    .then(profileModule => profileModule.reflectProfileInSemestersUI?.())
    .catch(() => {});

  clearActiveSemester();
  const semList = $('semestersList');
  if (semList) semList.innerHTML = '';

  setNonProfileTabsDisabled(true);    // ✅ deshabilita todo menos Perfil
  location.hash = '#/perfil';   
};

  // Listeners de botones (defensivo si no existen aún)
if (signInBtn) {
  // Iniciar sesión
signInBtn.addEventListener('click', async () => {
  setAuthLoading(true);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    const code = e?.code || '';
    if (code === 'auth/popup-blocked') {
      // 👉 solo si el navegador bloqueó el pop-up, ofrece redirect
      // (opcional) pide confirmación para evitar sorpresas
      // if (confirm('Tu navegador bloqueó el pop-up. ¿Usar redirección?')) {
      //   await signInWithRedirect(auth, provider);
      // }
      // Si NO quieres redirección jamás, deja vacío este bloque.
    } else if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/user-cancelled' // por si aparece en algún navegador
    ) {
      // Usuario cerró/canceló: NO reintentes, NO redirect
      // opcional: muestra un mensaje suave en consola y listo.
      console.log('Login cancelado por el usuario.');
    } else {
      alert(`No se pudo iniciar sesión: ${code || e.message || e}`);
    }
  } finally {
    setAuthLoading(false);
  }
});

}

if (switchBtn) {
  switchBtn.addEventListener('click', async () => {
  setAuthLoading(true);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    await setOnlineStatus(false);
    stopPresenceHeartbeat();
    await signOut(auth);
    // limpia UI al tiro (tu código de limpieza aquí)…

    await signInWithPopup(auth, provider);
  } catch (e) {
    const code = e?.code || '';
    if (code === 'auth/popup-blocked') {
      // (opcional) permitir redirect SOLO si fue bloqueo real
      // if (confirm('El pop-up fue bloqueado. ¿Usar redirección?')) {
      //   await signInWithRedirect(auth, provider);
      // }
    } else if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/user-cancelled'
    ) {
      console.log('Cambio de cuenta cancelado por el usuario.');
    } else {
      alert(`No se pudo cambiar de cuenta: ${code || e.message || e}`);
    }
  } finally {
    setAuthLoading(false);
  }
});

}




if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    setAuthLoading(true);
    try {
      await setOnlineStatus(false);
      stopPresenceHeartbeat();
      await signOut(auth);

      // 🔻 corta TODO y limpia UI al instante
      state.currentUser = null;
      state.profileData = null;
      state.unsubscribeProfile?.(); state.unsubscribeProfile = null; // perfil
      stopSemestersSub?.();                                         // semestres
      clearActiveSemester();
      const profileModule = await getProfileModule();
      profileModule.clearProfileUI?.();
      showSignedOut();
      updateDebug();

    } catch (e) {
      console.error(e);
      alert(`No se pudo cerrar sesión: ${e.code || e.message || e}`);
    } finally {
      setAuthLoading(false);
    }
  });
}


onAuthStateChanged(auth, async (user) => {
  setAuthLoading(false);

  if (user) {
    state.currentUser = user;
    showSignedIn(user.displayName || user.email || user.uid);

    try {
      await ensureUserDoc(user);
    } catch (e) {
      console.error('ensureUserDoc failed:', e);
    }

    // Presencia moderada: actualización inmediata + heartbeat cada 90 s.
    // Se inicia después de asegurar que el documento del usuario existe.
    startPresenceHeartbeat();

    try {
      await preloadCourses();
      console.log('✅ Semestres y cursos precargados');
    } catch (e) {
      console.warn('⚠️ Error precargando cursos:', e);
    }

    try {
      const profileModule = await getProfileModule();
      profileModule.listenProfile?.();
      profileModule.reflectProfileInSemestersUI?.();
    } catch (e) {
      console.error('profile listen failed:', e);
    }

    setTimeout(() => {
      loadMyPair().catch(e => console.error('loadMyPair failed:', e));
    }, 800);

    setTimeout(() => {
      refreshSemestersSub().catch(e => console.error('refreshSemestersSub failed:', e));
    }, 1500);

    setTimeout(() => {
      getProfileModule()
        .then(m => m.mountPartnerProfileCard?.())
        .catch(() => {});
    }, 2500);

    updateDebug();
  } else {
    stopPresenceHeartbeat();
    state.currentUser = null;
    showSignedOut();
    updateDebug();
  }
});


}

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Primera vez
    await setDoc(ref, {
      createdAt: Date.now(),
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      providerId: user.providerData?.[0]?.providerId || 'google',
      preferences: { showNamesInShared: true, theme: 'dark' },
      lastLoginAt: Date.now(),
    }, { merge: true });
  } else {
    // Actualizaciones posteriores (no tocamos createdAt)
    await setDoc(ref, {
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      providerId: user.providerData?.[0]?.providerId || 'google',
      lastLoginAt: Date.now(),
    }, { merge: true });
  }
}

export async function aiLogout() {
  try {
    await setOnlineStatus(false);
    stopPresenceHeartbeat();
    await signOut(auth);
  } catch (e) { console.error(e); }
}

export async function aiSwitchAccount() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await setOnlineStatus(false);
    stopPresenceHeartbeat();
    await signOut(auth);
    await signInWithPopup(auth, provider);
  } catch (e) { console.error(e); }
}
