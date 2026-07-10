// js/pair.js
import { db } from './firebase.js';
import {
  collection, doc, setDoc, getDoc, getDocs,
  updateDoc, arrayUnion, arrayRemove, query,
  deleteDoc, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { $, state, updateDebug } from './state.js';

let unsubPartyDoc = null;
let memberUnsubs = {};

// ---------------------------------------------
// Emits party events
// ---------------------------------------------
function emitPartyEvents() {
  const detail = { members: state.partyMembers };
  document.dispatchEvent(new CustomEvent('party:ready', { detail }));
  document.dispatchEvent(new CustomEvent('party:changed', { detail }));
  renderPartyMembers(); 
}

function prettyUni(d) {
  if (!d.university) return "—";
  if (d.university === "UMAYOR") return "Universidad Mayor";
  if (d.university === "USM") return "UTFSM";
  if (d.university === "OTRA") return d.customUniversity || "Otra";
  return d.university;
}

function prettyCareer(d) {
  if (!d.career) return "—";
  if (d.career === "ICTEL") return "Ing. Civil Telemática";
  if (d.career === "MEDVET") return "Medicina Veterinaria";
  if (d.career === "OTRA") return d.customCareer || "Otra";
  return d.career;
}

function prettyDate(iso) {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}


function renderPartyMemberCard(d, uid) {
  const name = d.name || d.fullName || "Usuario";
  const uni  = prettyUni(d);
  const car  = prettyCareer(d);
  const bday = prettyDate(d.birthday);
  const emailUni = d.uniEmail || "—";
  const phone = d.phone || "—";
  const favColor = d.favoriteColor || "#6366f1";

  const avatar = d.avatarData
    ? `<div class="party-member-icon" 
         style="background-image:url('${d.avatarData}');
                background-size:cover;background-position:center">
       </div>`
    : `<div class="party-member-icon" style="background:${favColor}">
         ${name.charAt(0).toUpperCase()}
       </div>`;

  

  // Identificar host
  const hostId = state.partyMembers[0];
  const amIHost = (state.currentUser.uid === hostId);
  const isHostItself = (uid === hostId);

  // Botón solo visible si:
  // ✔ yo soy host
  // ✔ el miembro NO es el host
  const deleteBtn = (amIHost && !isHostItself)
    ? `<button class="kick-btn" data-kick="${uid}">Quitar</button>`
    : "";

  const transferBtn = (amIHost && !isHostItself)
  ? `<button class="transfer-btn" data-transfer="${uid}">👑 Transferir host</button>`
  : "";

  const isMe = uid === state.currentUser.uid;

const privacyBtn = !isMe
  ? `<button class="privacy-btn" data-privacy="${uid}">🔒 Privacidad</button>`
  : "";

const last = d.lastOnline || 0;
const diff = Date.now() - last;

// 10 segundos sin heartbeat = desconectado
const isOnline = diff < 3000;


const statusHTML = `
  <div class="muted">
      <b>Estado:</b>
      <span class="conn-dot ${isOnline ? "on" : "off"}"></span>
      <span>${isOnline ? "Conectado" : "Desconectado"}</span>
  </div>
`;


  return `
    <div class="party-member-card">
      ${avatar}
      <div class="party-member-info">
        <div class="name-row">
  <b>${name}</b>
  ${isHostItself ? `<span class="host-badge">👑 HOST</span>` : ""}
  ${deleteBtn}
  ${transferBtn}
  ${privacyBtn}
</div>

        <div class="muted">${uni} — ${car}</div>
        <div class="muted"><b>Nac:</b> ${bday}</div>
        <div class="muted"><b>Email:</b> ${emailUni}</div>
        <div class="muted"><b>Tel:</b> ${phone}</div>

        <div class="muted">
          <b>Color:</b>
          <span style="display:inline-block;width:14px;height:14px;background:${favColor};
                       border-radius:4px;margin-left:6px;vertical-align:middle;"></span>
        </div>

        <code style="opacity:.4;font-size:.7rem">${uid}</code>
        ${statusHTML}

      </div>
    </div>
  `;
}




async function renderPartyMembers() {
  const host = $('partyMembersList');
  if (!host) return;

  // Si NO estoy en ninguna party
  if (!state.currentPartyId) {
    host.innerHTML = `<p class="muted">No estás en ninguna party.</p>`;
    return;
  }

  // Si estoy en party pero sin miembros (poco probable)
  if (!state.partyMembers.length) {
    host.innerHTML = `<p class="muted">Aún no hay miembros en esta party.</p>`;
    return;
  }

  let html = "";

 for (const uid of state.partyMembers) {
  const d = state.partyProfiles[uid] || {};
  html += renderPartyMemberCard(d, uid);
}


  host.innerHTML = html;

  const isHost = state.currentUser.uid === state.partyMembers[0];



  // Activar botones "Quitar"
document.querySelectorAll(".kick-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const uidToKick = btn.dataset.kick;

    if (!confirm(`¿Quieres quitar a este miembro de la party?`)) return;

    const ref = doc(db, "pairs", state.currentPartyId);

    await updateDoc(ref, {
      members: arrayRemove(uidToKick)
    });

    showToast("Miembro eliminado", "success");
  });
});

// Botones "Transferir host"
document.querySelectorAll(".transfer-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const newHostUid = btn.dataset.transfer;

    if (!confirm(`¿Quieres transferir el host a este miembro?`)) return;

    const ref = doc(db, "pairs", state.currentPartyId);
    const members = [...state.partyMembers];

    // Sacar al nuevo host de la lista
    const filtered = members.filter(u => u !== newHostUid);

    // El nuevo host va primero
    const updated = [newHostUid, ...filtered];

    await updateDoc(ref, { members: updated });

    showToast("Host transferido", "success");
  });
});

document.querySelectorAll(".privacy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const targetUid = btn.dataset.privacy;
    if (!targetUid) return;
    openPartyPrivacyModal(targetUid);
  });
});


}





// ---------------------------------------------
// Inicializar botones del HTML
// ---------------------------------------------
export function initPair() {

  $('createPairBtn')?.addEventListener('click', createParty);
  $('copyInviteBtn')?.addEventListener('click', copyInvite);

  const doJoin = async () => {
    const raw = ($('joinCode')?.value || '').trim();
    const pid = parsePairId(raw);
    if (pid) await joinParty(pid);
    else alert('Pega un ID válido de party.');
    $('joinCode').value = '';
  };

  $('joinByCodeBtn')?.addEventListener('click', doJoin);
  $('joinCode')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doJoin();
  });

  // 🔽 TODO ESTO ES NUEVO
  const leaveModal   = $('leavePartyModal');
  const leaveConfirm = $('leavePartyConfirm');
  const leaveCancel  = $('leavePartyCancel');

  // Abrir modal al hacer click en "Salir de party"
  $('deletePairBtn')?.addEventListener('click', () => {
    if (!state.currentPartyId) {
      alert('No estás en ninguna party.');
      return;
    }
    leaveModal?.classList.add('active');
  });

  // Cerrar modal con "Cancelar"
  leaveCancel?.addEventListener('click', () => {
    leaveModal?.classList.remove('active');
  });

  // Confirmar salida
  leaveConfirm?.addEventListener('click', async () => {
    leaveModal?.classList.remove('active');
    await leavePartyCompletely();
  });

    const closeModal   = $('closePartyModal');
  const closeConfirm = $('closePartyConfirm');
  const closeCancel  = $('closePartyCancel');

  $('closePartyBtn')?.addEventListener('click', () => {
    const hostId = state.partyMembers[0];
    if (state.currentUser.uid !== hostId) {
      showToast("Solo el host puede cerrar la party", "error");
      return;
    }
    closeModal.classList.add('active');
  });

  closeCancel?.addEventListener('click', () => {
    closeModal.classList.remove('active');
  });

  closeConfirm?.addEventListener('click', async () => {
    closeModal.classList.remove('active');
    await closePartyCompletely();
  });
}


// ---------------------------------------------
// Buscar si el usuario ya está en una party
// ---------------------------------------------
export async function loadMyPair() {
  if (!state.currentUser) return;
  await loadMyPartyPrivacy();

  const qy = query(collection(db, 'pairs'));
  const snap = await getDocs(qy);

  const mine = [];
  snap.forEach(d => {
    const data = d.data() || {};
    if (Array.isArray(data.members) && data.members.includes(state.currentUser.uid))
      mine.push({ id: d.id, ...data });
  });

  mine.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const current = mine[0] || null;

  state.currentPartyId = current?.id || null;
  state.partyMembers   = current?.members || [];
  updateClosePartyButton();
  updatePartyCount();



  $('pairId').textContent = state.currentPartyId || '—';
  $('copyInviteBtn').disabled = !state.currentPartyId;


  updateDebug();
  emitPartyEvents();

  watchPartyDoc(state.currentPartyId);
}


// ---------------------------------------------
// Crear Party nueva (1 miembro)
// ---------------------------------------------
async function createParty() {
  if (!state.currentUser) return;

  const ref = doc(collection(db, 'pairs'));

  await setDoc(ref, {
    members: [state.currentUser.uid],
    createdAt: Date.now()
  });

  await leaveOtherParties(ref.id);

  state.currentPartyId = ref.id;
  state.partyMembers = [state.currentUser.uid];
  updateClosePartyButton();
  updatePartyCount();



  $('pairId').textContent = ref.id;
  $('copyInviteBtn').disabled = false;

  updateDebug();
  emitPartyEvents();

  watchPartyDoc(ref.id);
}

// ---------------------------------------------
// Unirse a una party con ID
// ---------------------------------------------
export async function joinParty(partyId) {
  if (!state.currentUser) return;

  const ref = doc(db, 'pairs', partyId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return alert('La party no existe.');

  const data = snap.data() || {};
  const members = Array.isArray(data.members) ? data.members : [];

  if (!members.includes(state.currentUser.uid) && members.length >= 5) {
    alert('Esta party ya tiene 5 miembros.');
    return;
  }

  if (!members.includes(state.currentUser.uid)) {
    await updateDoc(ref, {
      members: arrayUnion(state.currentUser.uid)
    });
  }

  await leaveOtherParties(partyId);

  const finalSnap = await getDoc(ref);
  const final = finalSnap.data() || {};

  state.currentPartyId = partyId;
  state.partyMembers = final.members || [];
  updateClosePartyButton();
  updatePartyCount();



  $('pairId').textContent = partyId;
  $('copyInviteBtn').disabled = false;

  updateDebug();
  emitPartyEvents();

  watchPartyDoc(partyId);
}

// ---------------------------------------------
// Escuchar cambios en tiempo real
// ---------------------------------------------

function watchPartyDoc(pid) {
  if (unsubPartyDoc) {
    unsubPartyDoc();
    unsubPartyDoc = null;
  }

  if (!pid) return;

  const ref = doc(db, 'pairs', pid);

  unsubPartyDoc = onSnapshot(ref, snap => {
    if (!snap.exists()) {
      clearPartyState();
      return;
    }

    const data = snap.data() || {};
    const members = Array.isArray(data.members) ? data.members : [];

    // 🟪 NUEVO: salir automáticamente si me expulsaron
    if (!members.includes(state.currentUser.uid)) {
      clearPartyState();
      showToast("Has sido eliminado de la party", "error");
      return;
    }

    // limpiar listeners antiguos
    clearOldMemberListeners(members);

    // listeners nuevos
    members.forEach(uid => watchMemberProfile(uid));

    // actualizar estado global
    state.currentPartyId = pid;
state.partyMembers = members;
updateClosePartyButton();
updatePartyCount();


    

    $('pairId').textContent = pid;
    $('copyInviteBtn').disabled = false;

    updateDebug();
    renderPartyMembers();
  });
}



// ---------------------------------------------
// Salir totalmente (solo tú)
// ---------------------------------------------
async function leavePartyCompletely() {
  if (!state.currentUser || !state.currentPartyId) return;

  const pid = state.currentPartyId;

  const ref = doc(db, 'pairs', pid);

  await updateDoc(ref, {
    members: arrayRemove(state.currentUser.uid)
  });

  const snap = await getDoc(ref);
  const members = snap.exists() ? (snap.data().members || []) : [];

  if (members.length === 0) {
    try { await deleteDoc(ref); } catch {}
  }

  clearPartyState();

}

function clearPartyState() {
  if (unsubPartyDoc) {
    unsubPartyDoc();
    unsubPartyDoc = null;
  }

  // limpiar listeners de miembros
  for (const uid in memberUnsubs) {
    try { memberUnsubs[uid](); } catch {}
    delete memberUnsubs[uid];
  }

  state.currentPartyId = null;
  state.partyMembers = [];
  state.partyProfiles = {};

  $('pairId').textContent = '—';
  $('copyInviteBtn').disabled = true;

  $('closePartyBtn').style.display = 'none';

  const host = $('partyMembersList');
  if (host) {
    host.innerHTML = `<p class="muted">Aún no estás en ninguna party.</p>`;
  }

  updatePartyCount();   // ✅ esto faltaba
  updateDebug();
  emitPartyEvents();
}



// ---------------------------------------------
// Abandonar otras parties del usuario
// ---------------------------------------------
async function leaveOtherParties(exceptId) {
  const qy = query(collection(db, 'pairs'));
  const snap = await getDocs(qy);

  const uid = state.currentUser.uid;

  const tasks = [];

  snap.forEach(d => {
    const data = d.data() || {};
    if (
      d.id !== exceptId &&
      Array.isArray(data.members) &&
      data.members.includes(uid)
    ) {
      tasks.push(updateDoc(doc(db, 'pairs', d.id), {
        members: arrayRemove(uid)
      }));
    }
  });

  await Promise.all(tasks);
}

// ---------------------------------------------
// Copiar ID al portapapeles
// ---------------------------------------------
async function copyInvite() {
  if (!state.currentPartyId) return;

  try {
    await navigator.clipboard.writeText(state.currentPartyId);
    const btn = $('copyInviteBtn');
    btn.textContent = '¡Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar ID', 1200);
  } catch {
    alert('No se pudo copiar el ID.');
  }
}

// ---------------------------------------------
// Parsear ID o link
// ---------------------------------------------
function parsePairId(input) {
  if (!input) return '';
  const s = String(input).trim();

  try {
    const u = new URL(s);
    const q = u.searchParams.get('pair');
    if (q) return q.trim();
  } catch {}

  const m = s.match(/[?&]pair=([A-Za-z0-9_-]+)/);
  if (m) return m[1];

  return s.replace(/[^A-Za-z0-9_-]/g, '');
}

function watchMemberProfile(uid) {
  if (memberUnsubs[uid]) return;

  const rootRef = doc(db, "users", uid);
  const profRef = doc(db, "users", uid, "profile", "profile");

  let latestRoot = {};
  let latestProf = {};

  const applyMerge = () => {
    // ✅ profile (prof) tiene prioridad para nombre/uni/carrera/etc.
    // ✅ root mantiene online/lastOnline/avatar/etc si quieres
    const merged = { ...latestRoot, ...latestProf };

    // fuerza a que el online venga del root si existe
    if ("isOnline" in latestRoot) merged.isOnline = latestRoot.isOnline;
    if ("lastOnline" in latestRoot) merged.lastOnline = latestRoot.lastOnline;

    state.partyProfiles[uid] = merged;
    renderPartyMembers();
  };

  const unsubs = [];

  unsubs.push(onSnapshot(rootRef, snap => {
    latestRoot = snap.exists() ? (snap.data() || {}) : {};
    applyMerge();
  }));

  unsubs.push(onSnapshot(profRef, snap => {
    latestProf = snap.exists() ? (snap.data() || {}) : {};
    applyMerge();
  }));

  memberUnsubs[uid] = () => unsubs.forEach(u => u());
}



function clearOldMemberListeners(newMembers) {
  for (const uid in memberUnsubs) {
    if (!newMembers.includes(uid)) {
      memberUnsubs[uid]();      // desuscribir
      delete memberUnsubs[uid]; // limpiar
    }
  }
}
async function closePartyCompletely() {
  if (!state.currentUser || !state.currentPartyId) return;

  const pid = state.currentPartyId;
  const hostId = state.partyMembers[0];

  if (state.currentUser.uid !== hostId) {
    showToast("Solo el host puede cerrar la party", "error");
    return;
  }

  try {
    await deleteDoc(doc(db, "pairs", pid));
    showToast("Party cerrada", "success");
  } catch {
    showToast("Error al cerrar la party", "error");
  }

  $('closePartyBtn').style.display = 'none'; // ⬅ AGREGADO

  clearPartyState();
}

function updateClosePartyButton() {
  const btn = $('closePartyBtn');

  if (!btn) return;

  if (!state.currentPartyId || state.partyMembers.length === 0) {
    btn.style.display = "none";
    return;
  }

  const isHost = state.currentUser.uid === state.partyMembers[0];
  btn.style.display = isHost ? "inline-flex" : "none";
}

function updatePartyCount() {
  const el = $('partyCount');
  if (!el) return;

  if (!state.currentPartyId) {
    el.textContent = "0/5";
    return;
  }

  el.textContent = `${state.partyMembers.length}/5`;
}


export async function setOnlineStatus(stateOnline) {
  if (!state.currentUser) return;

  try {
    await updateDoc(doc(db, "users", state.currentUser.uid), {
      isOnline: stateOnline,
      lastOnline: Date.now()
    });
  } catch (e) {
    console.warn("No se pudo actualizar estado online:", e);
  }
}

function privacyDocRef(){
  return doc(db, "users", state.currentUser.uid, "privacy", "partyAccess");
}

async function loadMyPartyPrivacy(){
  if (!state.currentUser) return;

  try {
    const snap = await getDoc(privacyDocRef());
    state.partyPrivacy = snap.exists() ? (snap.data()?.blocked || {}) : {};
  } catch (err) {
    console.warn("No se pudo cargar privacidad:", err);
    state.partyPrivacy = {};
  }
}

async function savePrivacyForMember(targetUid, rules){
  if (!state.currentUser || !targetUid) return;

  const next = {
    ...(state.partyPrivacy || {}),
    [targetUid]: rules
  };

  state.partyPrivacy = next;

  await setDoc(privacyDocRef(), {
    blocked: next,
    updatedAt: Date.now()
  }, { merge:true });

  if (typeof showToast === 'function') {
    showToast("Privacidad actualizada", "success");
  } else {
    console.log("Privacidad actualizada");
  }
} 

function openPartyPrivacyModal(targetUid){
  if (!targetUid) return;

  document.getElementById("partyPrivacyModal")?.remove();

  const profile = state.partyProfiles[targetUid] || {};
  const name = profile.name || profile.fullName || "Usuario";

  const current = state.partyPrivacy?.[targetUid] || {};

  const modal = document.createElement("div");
  modal.id = "partyPrivacyModal";
  modal.style.cssText = `
    position:fixed;
    inset:0;
    z-index:10080;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.65);
    padding:16px;
  `;

  modal.innerHTML = `
    <div style="
      width:min(460px, 92vw);
      background:#121527;
      color:#fff;
      border-radius:20px;
      padding:18px;
      border:1px solid rgba(255,255,255,.12);
      box-shadow:0 20px 70px rgba(0,0,0,.55);
    ">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="
          width:42px;height:42px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(99,102,241,.18);
          border:1px solid rgba(99,102,241,.35);
          font-size:20px;
        ">🔒</div>

        <div>
          <div style="font-size:17px;font-weight:900;">Privacidad con ${name}</div>
          <div style="font-size:13px;opacity:.75;margin-top:2px;">
            Marca qué quieres ocultarle a esta persona.
          </div>
        </div>
      </div>

      <div style="
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:14px;
        padding:12px;
        border-radius:14px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.08);
      ">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privNotas" ${current.notas ? "checked" : ""}>
          <span>Ocultar mis notas</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privHorario" ${current.horario ? "checked" : ""}>
          <span>Ocultar mi horario</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privCalendario" ${current.calendario ? "checked" : ""}>
          <span>Ocultar mi calendario</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privMalla" ${current.malla ? "checked" : ""}>
          <span>Ocultar mi malla</span>
        </label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
        <button id="privacyCancel" class="ghost">Cancelar</button>
        <button id="privacySave" class="primary">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();

  modal.querySelector("#privacyCancel")?.addEventListener("click", close);

  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  modal.querySelector("#privacySave")?.addEventListener("click", async () => {
  const btn = modal.querySelector("#privacySave");
  btn.disabled = true;
  btn.textContent = "Guardando...";

  const rules = {
    notas: !!modal.querySelector("#privNotas")?.checked,
    horario: !!modal.querySelector("#privHorario")?.checked,
    calendario: !!modal.querySelector("#privCalendario")?.checked,
    malla: !!modal.querySelector("#privMalla")?.checked
  };

  try {
    await savePrivacyForMember(targetUid, rules);
    close();
  } catch (err) {
    console.error("Error guardando privacidad:", err);
    alert("No se pudo guardar la privacidad. Revisa la consola.");
    btn.disabled = false;
    btn.textContent = "Guardar";
  }
});
}