// js/state.js

export const state = {
  currentUser: null,

  /* 🔥 PARTY MULTIMIEMBRO */
  currentPartyId: null,  // ID de la party actual
  partyMembers: [],   
  partyProfiles: {},   
  partyPrivacy: {},

  /* Perfil del usuario actual */
  profileData: null,
  

  /* Semestres */
  activeSemesterId: null,
  activeSemesterData: null,
  unsubscribeCourses: null,
  editingCourseId: null,

  /* Modo compartido (no cambia con party) */
  shared: {
    horario:  { semId: null },
    notas:    { semId: null },
    malla:    { enabled: false },
    calendar: { semId: null }
  },

  DEBUG:
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1') &&
    (new URLSearchParams(location.search).has('debug') || (window?.PartyPlannerDebug ?? false)),
};

/* ============= Helpers DOM ============= */
export const $   = (id) => (typeof id === 'string' ? document.getElementById(id) : null);
export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
export const setText = (id, text = '') => { const el = $(id); if (el) el.textContent = text; return el; };


/* ============= DEBUG PANEL ============= */
export function updateDebug() {
  if (!state.DEBUG) return;
  const el = $('state');
  if (!el) return;

  el.textContent = JSON.stringify({
    uid: state.currentUser?.uid || null,

    // 🔥 Nuevo estado PARTY
    partyId: state.currentPartyId,
    members: state.partyMembers,

    profileData: state.profileData,
    activeSemesterId: state.activeSemesterId,
    editingCourseId: state.editingCourseId
  }, null, 2);
}

/* ============= Helpers UI ============= */
export function setHidden(el, hidden) {
  if (!el) return;
  hidden ? el.classList.add('hidden') : el.classList.remove('hidden');
}

export function confirmYes(msg) { 
  return window.confirm(msg); 
}

window.__state = state;
