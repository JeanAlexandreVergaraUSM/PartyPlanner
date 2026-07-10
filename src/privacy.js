// js/privacy.js
import { db } from './firebase.js';
import { state } from './state.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const privacyCache = new Map();

export async function canViewPartyZone(ownerUid, zone){
  const viewerUid = state.currentUser?.uid;

  if (!ownerUid || !viewerUid) return false;
  if (ownerUid === viewerUid) return true;

  const key = `${ownerUid}:${viewerUid}:${zone}`;

  if (privacyCache.has(key)) {
    return privacyCache.get(key);
  }

  try {
    const snap = await getDoc(doc(db, 'users', ownerUid, 'privacy', 'partyAccess'));
    const data = snap.exists() ? (snap.data() || {}) : {};
    const blocked = data.blocked || {};

    const isBlocked = !!blocked?.[viewerUid]?.[zone];
    const allowed = !isBlocked;

    privacyCache.set(key, allowed);
    return allowed;
  } catch (err) {
    console.warn('[privacy] No se pudo revisar permiso:', err);
    return true;
  }
}

export function privacyBlockedMessage(label = 'esta sección'){
  return `
    <div class="card" style="
      padding:22px;
      text-align:center;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(15,23,42,.72);
    ">
      <div style="font-size:34px;margin-bottom:8px;">🔒</div>
      <h3 style="margin:0 0 8px;">Contenido privado</h3>
      <div class="muted">
        Este usuario decidió ocultar ${label} para ti.
      </div>
    </div>
  `;
}

export function clearPrivacyCache(){
  privacyCache.clear();
}