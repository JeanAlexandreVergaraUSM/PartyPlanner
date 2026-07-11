// js/privacy.js
import { db } from './firebase.js';
import { state } from './state.js';
import { escapeHtml } from './security/html.js';
import { doc, getDoc } from 'firebase/firestore';

const VALID_ZONES = new Set(['notas', 'horario', 'malla', 'calendario']);

function viewerPrivacyRef(ownerUid, viewerUid){
  return doc(
    db,
    'users', ownerUid,
    'privacy', 'partyAccess',
    'viewers', viewerUid
  );
}

/**
 * Comprueba permiso en tiempo real. Cada viewer tiene su propio documento,
 * así un miembro de la party no puede leer la matriz completa de privacidad.
 * Ante error de red/permisos, falla cerrado.
 */
export async function canViewPartyZone(ownerUid, zone){
  const viewerUid = state.currentUser?.uid;

  if (!ownerUid || !viewerUid) return false;
  if (!VALID_ZONES.has(zone)) return false;
  if (ownerUid === viewerUid) return true;

  try {
    const snap = await getDoc(viewerPrivacyRef(ownerUid, viewerUid));
    const rules = snap.exists() ? (snap.data() || {}) : {};
    return !Boolean(rules?.[zone]);
  } catch (err) {
    console.warn('[privacy] No se pudo revisar permiso; acceso denegado:', err);
    return false;
  }
}

export function privacyBlockedMessage(label = 'esta sección'){
  const safeLabel = escapeHtml(label);
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
        Este usuario decidió ocultar ${safeLabel} para ti.
      </div>
    </div>
  `;
}

// Compatibilidad con llamadas antiguas. Ya no hay caché persistente.
export function clearPrivacyCache(){}
