// js/calendar.js
import { db } from './firebase.js';
import { canViewPartyZone, privacyBlockedMessage } from './privacy.js';
import { $, state } from './state.js';
import { escapeHtml } from './security/html.js';
import {
  buildTaskCompletionFields,
  isCalendarTaskCompleted,
} from './calendarTasks.js';
import {
  collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, getDocs, getDoc, updateDoc, where
} from 'firebase/firestore';

/* ================= Estado ================= */
let currentMonth = new Date();        // foco del calendario
let unsubscribeCal = null;
let unsubscribeOwnCourses = null;
let events = []; // propios [{id,title,courseId,date,start,end,allDay,color,createdAt}]
let ownCourses = []; // cursos propios del semestre activo para la leyenda
let ownCalendarFilter = {
  course: true,
  personal: true
};
let booted = false;
let unsubCalendar = null;

let unsubSharedEvents = null;
let unsubSharedCourses = null;
let unsubPartnerProfile = null;
let sharedEvents = [];
let sharedCourses = [];
let partnerColor = '#ff69b4';
let __calendarPartyViewingUid = null;
const __calendarPartyCombinedUnsubs = new Map();   // uid -> fn unsubscribe
const __calendarPartyCombinedEvents = new Map();   // uid -> [events]

export function registerCalendarUnsub(unsub){
  unsubCalendar = unsub;
}

export function stopCalendarSub(){
  try { unsubCalendar?.(); } finally { unsubCalendar = null; }
  try { unsubscribeCal?.(); } catch {}
  unsubscribeCal = null;
  try { unsubscribeOwnCourses?.(); } catch {}
  unsubscribeOwnCourses = null;
}

export function clearCalendarUI(){
  cleanupCombinedParty();

  const page = $('page-calendario');
  if (page) {
    page.classList.add('hidden');
    const grid = page.querySelector('[data-cal-grid]') || page.querySelector('.cal-grid');
    if (grid) grid.innerHTML = '';
  }
}

// (opcional) al volver a iniciar sesión, muestra de nuevo la página
export function showCalendarUI(){
  $('page-calendario')?.classList.remove('hidden');
}

/* ================= Helpers color/ramo ================= */
function getPartyViewerColor(){
  return isValidHex(partnerColor) ? partnerColor : '#ff69b4';
}

function getMyFavoriteColor(){
  const prof = state.profileData || {};
  const root = state.currentUser || {};

  return (
    (typeof prof.favoriteColor === 'string' && isValidHex(prof.favoriteColor)) ? prof.favoriteColor
    : (typeof root.favoriteColor === 'string' && isValidHex(root.favoriteColor)) ? root.favoriteColor
    : '#3B82F6'
  );
}

function isValidHex(s){ return typeof s==='string' && /^#[0-9A-Fa-f]{6}$/.test(s); }
function getCourseColorById(courseId, fallback='#3B82F6'){
  if (!courseId) return fallback;
  const c = (state.courses || []).find(x => x.id === courseId);
  return isValidHex(c?.color) ? c.color : fallback;
}
function _getSharedCourseColorById(courseId, fallback=partnerColor){
  const c = (sharedCourses || []).find(x => x.id === courseId);
  return isValidHex(c?.color) ? c.color : fallback;
}

function getOwnEventColor(ev, fallback = getMyFavoriteColor()){
  // ✅ Si tiene ramo, el color del ramo manda
  if (ev?.courseId){
    const c = (state.courses || []).find(x => x.id === ev.courseId);
    if (isValidHex(c?.color)) return c.color;
  }

  // ✅ Si no tiene ramo, usa el color propio guardado
  if (isValidHex(ev?.color)) return ev.color;

  // ✅ Si no hay nada, usa color favorito actual
  return fallback;
}

function bestText(color){
  try{
    const r = parseInt(color.slice(1,3),16),
          g = parseInt(color.slice(3,5),16),
          b = parseInt(color.slice(5,7),16);
    const yiq = (r*299 + g*587 + b*114)/1000;
    return (yiq >= 160) ? '#111' : '#fff';
  }catch{ return '#0e0e0e'; }
}

function cal_extractUids(x){
  if (!x) return [];

  if (Array.isArray(x)) {
    return x.map(v => typeof v === 'string' ? v : v?.uid).filter(Boolean);
  }

  if (x instanceof Set) {
    return [...x].map(v => typeof v === 'string' ? v : v?.uid).filter(Boolean);
  }

  if (x instanceof Map) {
    return [...x.keys()].filter(Boolean);
  }

  if (typeof x === 'object') {
    const candidates =
      x.partyMembers || x.memberUids || x.members || x.uids || x.participants || x.people || null;

    if (candidates) return cal_extractUids(candidates);

    const keys = Object.keys(x);
    const uidLike = keys.filter(k => typeof k === 'string' && k.length >= 16);
    if (uidLike.length) return uidLike;

    const vals = Object.values(x).map(v => v?.uid).filter(Boolean);
    if (vals.length) return vals;
  }

  return [];
}

function cal_getPartyMembersNoMe(){
  const me = state.currentUser?.uid;

  const sources = [
    state.partyMembers,
    state.party,
    state.partyData,
    state.activeParty,
    state.shared?.party,
    state.shared?.partyData,
    state.shared?.partyMembers,
  ];

  let uids = [];
  for (const s of sources) {
    uids = cal_extractUids(s);
    if (uids.length) break;
  }

  return [...new Set(uids.filter(Boolean))].filter(uid => uid !== me);
}

const __calendarPartyProfileCache = Object.create(null);

function cal_pickMemberName(root = {}, prof = {}) {
  return (
    (typeof prof.displayName === 'string' && prof.displayName.trim()) ? prof.displayName.trim()
    : (typeof prof.name === 'string' && prof.name.trim()) ? prof.name.trim()
    : (typeof root.displayName === 'string' && root.displayName.trim()) ? root.displayName.trim()
    : (typeof root.name === 'string' && root.name.trim()) ? root.name.trim()
    : 'Usuario'
  );
}

function cal_pickMemberColor(root = {}, prof = {}) {
  return (
    (typeof prof.favoriteColor === 'string' && isValidHex(prof.favoriteColor)) ? prof.favoriteColor
    : (typeof root.favoriteColor === 'string' && isValidHex(root.favoriteColor)) ? root.favoriteColor
    : '#64748b'
  );
}

async function cal_loadMemberProfile(uid){
  if (!uid) return { name:'Usuario', favoriteColor:'#64748b' };
  if (__calendarPartyProfileCache[uid]) return __calendarPartyProfileCache[uid];

  try{
    const rootRef = doc(db, 'users', uid);
    const profRef = doc(db, 'users', uid, 'profile', 'profile');

    const [rootSnap, profSnap] = await Promise.all([
      getDoc(rootRef),
      getDoc(profRef)
    ]);

    const root = rootSnap.exists() ? (rootSnap.data() || {}) : {};
    const prof = profSnap.exists() ? (profSnap.data() || {}) : {};

    const out = {
      name: cal_pickMemberName(root, prof),
      favoriteColor: cal_pickMemberColor(root, prof)
    };

    __calendarPartyProfileCache[uid] = out;
    return out;
  }catch(err){
    console.warn('cal_loadMemberProfile error', err);
    __calendarPartyProfileCache[uid] = { name:'Usuario', favoriteColor:'#64748b' };
    return __calendarPartyProfileCache[uid];
  }
}

async function getCalendarPartyMembersList(){
  const uids = cal_getPartyMembersNoMe();
  if (!uids.length) return [];

  const profiles = await Promise.all(uids.map(uid => cal_loadMemberProfile(uid)));

  return uids.map((uid, i) => ({
    uid,
    name: profiles[i]?.name || 'Usuario',
    favoriteColor: profiles[i]?.favoriteColor || '#64748b'
  }));
}

async function renderCalendarPartyPicker(){
  const host = $('calendarPartyPicker');
  if (!host) return;

  const members = await getCalendarPartyMembersList();

  if (!members.length) {
    host.innerHTML = `<div class="muted">No hay integrantes disponibles en tu party.</div>`;
    return;
  }

  host.innerHTML = members.map(m => {
    const active = m.uid === __calendarPartyViewingUid;

    return `
      <button
        class="calendar-party-chip ${active ? 'active' : ''}"
        data-uid="${escapeHtml(m.uid)}"
        style="
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:16px;
          border:${active ? '2px solid rgba(139,156,251,0.95)' : '1px solid rgba(255,255,255,0.12)'};
          background:${active ? 'rgba(99,102,241,0.22)' : 'rgba(10,14,35,0.9)'};
          color:#fff;
          cursor:pointer;
          min-width:120px;
          box-shadow:${active ? '0 0 0 2px rgba(255,255,255,0.08) inset' : 'none'};
        "
      >
        <span style="
  width:14px;
  height:14px;
  border-radius:999px;
  background:${m.favoriteColor || '#64748b'};
  flex:0 0 auto;
"></span>
        <span style="font-weight:600;">${escapeHtml(m.name)}</span>
      </button>
    `;
  }).join('');

  host.querySelectorAll('.calendar-party-chip').forEach(btn => {
    btn.addEventListener('click', async () => {
      const uid = btn.dataset.uid;
      if (!uid) return;

      __calendarPartyViewingUid = uid;
      await renderCalendarPartyPicker();
      await handlePairReady();
    });
  });
}

function bindOwnCalendarFilters(){
  const trigger = $('calFilterBtn');
  const menu = $('calFilterMenu');
  const chkCourse = $('calFilterChkCourse');
  const chkPersonal = $('calFilterChkPersonal');

  if (!trigger || !menu || !chkCourse || !chkPersonal) return;

  const syncUI = () => {
    chkCourse.checked = !!ownCalendarFilter.course;
    chkPersonal.checked = !!ownCalendarFilter.personal;
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
    syncUI();
  });

  chkCourse.addEventListener('change', () => {
    ownCalendarFilter.course = !!chkCourse.checked;
    paintEvents();
  });

  chkPersonal.addEventListener('change', () => {
    ownCalendarFilter.personal = !!chkPersonal.checked;
    paintEvents();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== trigger) {
      menu.classList.add('hidden');
    }
  });

  syncUI();
}

/* ================= Init / hooks ================= */
export function initCalendar(){
  if (booted) return; 
  booted = true;

  renderShell();
  bindHeader();
  bindOwnCalendarFilters();
  mountModal();
  buildMonthGrid();
  renderOwnCalendarLegend();
  buildSharedMonthGrid();
  reflectActiveSemester();
  subscribeIfPossible();

  document.addEventListener('pair:ready', async () => {
    await renderCalendarPartyPicker();
    await handlePairReady();
  });

  document.addEventListener('pair:ready', async () => {
    await subscribeCombinedPartyMembers();
    buildCombinedMonthGrid();
  });

  document.addEventListener('profile:changed', () => {
    paintEvents();
    paintCombinedEvents();
  });

  document.addEventListener('profile:ready', () => {
    paintEvents();
    paintCombinedEvents();
  });

  renderCalendarPartyPicker();
  handlePairReady();
  subscribeCombinedPartyMembers();
  wireSubtabs();
}

// Fallback defensivo
function ensureBoot(){ if (!booted) initCalendar(); }

export function onActiveSemesterChanged(){
  ensureBoot();
  if (unsubscribeCal){ unsubscribeCal(); unsubscribeCal=null; }
  reflectActiveSemester();
  subscribeIfPossible();
  buildMonthGrid();
  buildSharedMonthGrid();
  buildCombinedMonthGrid();

  if (__calendarPartyViewingUid) {
    handlePairReady();
  }

  subscribeCombinedPartyMembers();
}

export function onCoursesChanged(){
  ensureBoot();
  paintEvents();
  renderOwnCalendarLegend();
  paintSharedEvents();
  paintCombinedEvents();
}

// Auto-init y reacción a ruta
if (document.readyState === 'loading'){ window.addEventListener('DOMContentLoaded', ensureBoot); } else { ensureBoot(); }
document.addEventListener('route:calendario', ensureBoot);

document.addEventListener('semester:changed', () => {
  if (booted) onActiveSemesterChanged();
});

document.addEventListener('courses:changed', () => {
  if (booted) onCoursesChanged();
});

/* ================= Shell / Header ================= */
function renderShell(){
  const host = $('page-calendario');
  if (!host) return;
  host.innerHTML = `
    <div class="card">
      <div class="cal-head" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div class="cal-left" style="display:flex;align-items:center;gap:8px;">
          <button id="calPrev" class="ghost" title="Mes anterior">◀</button>
          <button id="calToday" class="ghost" title="Ir a hoy">Hoy</button>
          <button id="calNext" class="ghost" title="Mes siguiente">▶</button>
          <h3 id="calTitle" style="margin:0 0 0 10px">Calendario</h3>
        </div>
        <div class="cal-right" style="display:flex;align-items:center;gap:10px;">
          <span class="muted">Semestre activo: <b id="calActiveSem">—</b></span>
          <button id="calImportGoogle" class="ghost" data-tooltip="Importar eventos desde tu Google Calendar">
            📥 Importar Google Calendar
          </button>
        </div>
      </div>

<div class="subtabs" style="margin-bottom:10px; display:flex; gap:8px;">
  <button id="cal-subtab-propio" class="tab small active">Propio</button>
  <button id="cal-subtab-compartido" class="tab small">Party</button>
  <button id="cal-subtab-combinado" class="tab small">Combinado</button>
</div>

<div class="muted" style="margin-bottom:10px">
  Haz clic en un día para agregar un evento.  
  Usa el botón "Importar Google Calendar" para traer eventos de tu mes actual.
</div>

<div id="calOwnFilters" style="position:relative; display:flex; justify-content:flex-end; margin-bottom:12px;">
  <button id="calFilterBtn" class="ghost" title="Filtrar calendario">⚲ Filtrar</button>

  <div id="calFilterMenu"
       class="hidden"
       style="
         position:absolute;
         top:42px;
         right:0;
         min-width:190px;
         background:#0f172a;
         border:1px solid rgba(255,255,255,0.12);
         border-radius:14px;
         padding:10px 12px;
         box-shadow:0 10px 30px rgba(0,0,0,0.35);
         z-index:30;
       ">
    <label style="display:flex; align-items:center; gap:10px; margin-bottom:8px; cursor:pointer;">
      <input type="checkbox" id="calFilterChkCourse" checked />
      <span>Ramos</span>
    </label>

    <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
      <input type="checkbox" id="calFilterChkPersonal" checked />
      <span>Eventos</span>
    </label>
  </div>
</div>

<div id="cal-propio">
  <div class="cal-grid" id="calGrid" aria-live="polite"></div>

  <div id="calLegend"
       style="margin-top:14px; display:flex; flex-wrap:wrap; gap:10px 14px; align-items:center;">
  </div>
</div>

            <div id="cal-compartido" class="hidden">
        <div class="card" style="margin-bottom:12px">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <h4 style="margin:0;color:#8b9cfb;">Calendarios de mi Party</h4>
              <div class="muted" style="margin-top:4px;">
                Selecciona a una persona para ver su calendario.
              </div>
            </div>

            <div id="calendarPartyPicker"
                 style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            </div>
          </div>
        </div>

        <div class="cal-grid" id="calSharedGrid"></div>
        <div class="muted" id="calSharedHint" style="margin-top:8px"></div>
      </div>

      <div id="cal-combinado" class="hidden">
        <div id="calCombinedGrid" class="cal-grid"></div>
      </div>
    </div>
  `;
}



function bindHeader(){
  $('calPrev')?.addEventListener('click', ()=>{
    currentMonth = addMonths(currentMonth,-1);
    updateHeader();
    buildMonthGrid();
    buildSharedMonthGrid();
    buildCombinedMonthGrid();
  });
  $('calNext')?.addEventListener('click', ()=>{
    currentMonth = addMonths(currentMonth, 1);
    updateHeader();
    buildMonthGrid();
    buildSharedMonthGrid();
    buildCombinedMonthGrid();
  });
  $('calToday')?.addEventListener('click', ()=>{
    currentMonth = new Date();
    updateHeader();
    buildMonthGrid();
    buildSharedMonthGrid();
    buildCombinedMonthGrid();
  });

  // ⬇️ NUEVO: importar Google Calendar para el mes actual
$('calImportGoogle')?.addEventListener('click', openGcalImportModal);


  updateHeader();
}

function updateHeader(){
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth();
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const t = $('calTitle'); if (t) t.textContent = `Calendario · ${monthNames[m][0].toUpperCase()}${monthNames[m].slice(1)} ${y}`;
}
function reflectActiveSemester(){
  const el = $('calActiveSem'); if (!el) return;
  el.textContent = state.activeSemesterData?.label || '—';
}

/* ================= Subtabs Propio / Duo ================= */
function wireSubtabs(){
  const tabP = $('cal-subtab-propio');
  const tabC = $('cal-subtab-compartido');
  const tabB = $('cal-subtab-combinado');

  const panP = $('cal-propio');
  const panC = $('cal-compartido');
  const panB = $('cal-combinado');

  function showPropio(){
    tabP.classList.add('active'); tabC.classList.remove('active'); tabB.classList.remove('active');
    panP.classList.remove('hidden'); panC.classList.add('hidden'); panB.classList.add('hidden');
  }

  async function showCompartido(){
  tabC.classList.add('active');
  tabP.classList.remove('active');
  tabB.classList.remove('active');

  panC.classList.remove('hidden');
  panP.classList.add('hidden');
  panB.classList.add('hidden');

  await renderCalendarPartyPicker();
  buildSharedMonthGrid();

  if (!__calendarPartyViewingUid){
    $('calSharedHint').textContent = 'Selecciona un integrante de tu party para ver su calendario.';
    return;
  }

  $('calSharedHint').textContent = '';
  await handlePairReady();
}

   async function showCombinado(){
    await subscribeCombinedPartyMembers();
    tabB.classList.add('active'); tabP.classList.remove('active'); tabC.classList.remove('active');
    panB.classList.remove('hidden'); panP.classList.add('hidden'); panC.classList.add('hidden');
    buildCombinedMonthGrid();
    await loadCombinedReminders();
  }

  tabP?.addEventListener('click', showPropio);
  tabC?.addEventListener('click', showCompartido);
  tabB?.addEventListener('click', showCombinado);

  showPropio();
}


/* ================= Datos (suscripción Firestore) – PROPIO ================= */
function subscribeIfPossible(){
  if (unsubscribeCal){ try { unsubscribeCal(); } catch {} unsubscribeCal = null; }
  if (unsubscribeOwnCourses){ try { unsubscribeOwnCourses(); } catch {} unsubscribeOwnCourses = null; }

  events = [];
  ownCourses = [];
  paintEvents();
  renderOwnCalendarLegend();

  if (!state.currentUser || !state.activeSemesterId) return;

  const uid = state.currentUser.uid;
  const semId = state.activeSemesterId;

  // 🔹 Suscripción a eventos
  const calRef = collection(db,'users',uid,'semesters',semId,'calendar');
  unsubscribeCal = onSnapshot(query(calRef, orderBy('date','asc')), (snap)=>{
    if (state.currentUser?.uid !== uid || state.activeSemesterId !== semId) return;
    events = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    paintEvents();
    renderOwnCalendarLegend();
  });

  // 🔹 Suscripción a ramos del semestre activo
  const coursesRef = collection(db,'users',uid,'semesters',semId,'courses');
  unsubscribeOwnCourses = onSnapshot(query(coursesRef, orderBy('name','asc')), (snap)=>{
    if (state.currentUser?.uid !== uid || state.activeSemesterId !== semId) return;
    ownCourses = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderOwnCalendarLegend();
  });
}

/* ================= Pair handling – COMPARTIDO ================= */
async function handlePairReady(){
  cleanupShared();
  sharedEvents = [];
  sharedCourses = [];
  partnerColor = '#ff69b4';

  buildSharedMonthGrid();

  const selectedUid = __calendarPartyViewingUid;

  if (!selectedUid){
    $('calSharedHint').textContent = 'Selecciona un integrante de tu party para ver su calendario.';
    return;
  }

  const canSee = await canViewPartyZone(selectedUid, 'calendario');

if (!canSee) {
  cleanupShared();
  sharedEvents = [];
  sharedCourses = [];
  buildSharedMonthGrid();

  const grid = $('calSharedGrid');
  if (grid) grid.innerHTML = privacyBlockedMessage('su calendario');

  $('calSharedHint').textContent = '';
  return;
}

  $('calSharedHint').textContent = '';

  const semId = await populateSharedSemesters();
  if (!semId) return;

  if (unsubPartnerProfile) {
    unsubPartnerProfile();
    unsubPartnerProfile = null;
  }

const rootUnsub = onSnapshot(doc(db, 'users', selectedUid), async (snap)=>{
  const root = snap.exists() ? (snap.data() || {}) : {};
  const prev = __calendarPartyProfileCache[selectedUid] || {};

  const mergedRoot = {
    displayName: root.displayName,
    name: root.name,
    favoriteColor: root.favoriteColor
  };

  const mergedProf = {
    displayName: prev._profDisplayName,
    name: prev._profName,
    favoriteColor: prev._profFavoriteColor
  };

  const next = {
    name: cal_pickMemberName(mergedRoot, mergedProf),
    favoriteColor: cal_pickMemberColor(mergedRoot, mergedProf),
    _rootDisplayName: root.displayName || null,
    _rootName: root.name || null,
    _rootFavoriteColor: root.favoriteColor || null,
    _profDisplayName: prev._profDisplayName || null,
    _profName: prev._profName || null,
    _profFavoriteColor: prev._profFavoriteColor || null
  };

  __calendarPartyProfileCache[selectedUid] = next;

  if (isValidHex(next.favoriteColor)) partnerColor = next.favoriteColor;

  paintSharedEvents();
  paintCombinedEvents();
  await renderCalendarPartyPicker();
});

const profUnsub = onSnapshot(doc(db, 'users', selectedUid, 'profile', 'profile'), async (snap)=>{
  const prof = snap.exists() ? (snap.data() || {}) : {};
  const prev = __calendarPartyProfileCache[selectedUid] || {};

  const mergedRoot = {
    displayName: prev._rootDisplayName,
    name: prev._rootName,
    favoriteColor: prev._rootFavoriteColor
  };

  const mergedProf = {
    displayName: prof.displayName,
    name: prof.name,
    favoriteColor: prof.favoriteColor
  };

  const next = {
    name: cal_pickMemberName(mergedRoot, mergedProf),
    favoriteColor: cal_pickMemberColor(mergedRoot, mergedProf),
    _rootDisplayName: prev._rootDisplayName || null,
    _rootName: prev._rootName || null,
    _rootFavoriteColor: prev._rootFavoriteColor || null,
    _profDisplayName: prof.displayName || null,
    _profName: prof.name || null,
    _profFavoriteColor: prof.favoriteColor || null
  };

  __calendarPartyProfileCache[selectedUid] = next;

  if (isValidHex(next.favoriteColor)) partnerColor = next.favoriteColor;

  paintSharedEvents();
  paintCombinedEvents();
  await renderCalendarPartyPicker();
});

unsubPartnerProfile = () => {
  try { rootUnsub?.(); } catch {}
  try { profUnsub?.(); } catch {}
};
}

async function _autoSelectPartnerSemesterForCalendar(){
  if (!__calendarPartyViewingUid) return null;

  const activeLabel = state.activeSemesterData?.label || null;
  if (!activeLabel) return null;

  try {
    const ref = collection(db, 'users', __calendarPartyViewingUid, 'semesters');
    const snap = await getDocs(ref);

    let match = null;
    snap.forEach(d => {
      const lbl = (d.data()?.label || '').trim();
      if (lbl === activeLabel) match = { id: d.id, label: lbl };
    });

    state.shared = state.shared || {};
    state.shared.calendar = state.shared.calendar || {};

    if (match) {
      state.shared.calendar.semId = match.id;
      return match.id;
    }

    state.shared.calendar.semId = null;
    return null;
  } catch (err) {
    console.warn('autoSelectPartnerSemesterForCalendar', err);
    return null;
  }
}


function cleanupShared(){
  if (unsubSharedEvents){ unsubSharedEvents(); unsubSharedEvents = null; }
  if (unsubSharedCourses){ unsubSharedCourses(); unsubSharedCourses = null; }
  if (unsubPartnerProfile){ unsubPartnerProfile(); unsubPartnerProfile = null; }
}

function cleanupCombinedParty(){
  for (const [, unsub] of __calendarPartyCombinedUnsubs.entries()){
    try { unsub?.(); } catch {}
  }
  __calendarPartyCombinedUnsubs.clear();
  __calendarPartyCombinedEvents.clear();
}

async function subscribeCombinedPartyMembers(){
  cleanupCombinedParty();

  const memberUids = cal_getPartyMembersNoMe();
  if (!memberUids.length){
    paintCombinedEvents();
    return;
  }

  const activeLabel = state.activeSemesterData?.label || null;
  if (!activeLabel){
    paintCombinedEvents();
    return;
  }

  for (const uid of memberUids){
    try{
      const canSee = await canViewPartyZone(uid, 'calendario');
if (!canSee) {
  __calendarPartyCombinedEvents.set(uid, []);
  continue;
}
      // asegurar perfil en cache
      await cal_loadMemberProfile(uid);

      const rootUnsub = onSnapshot(doc(db, 'users', uid), async (snap) => {
  const root = snap.exists() ? (snap.data() || {}) : {};
  const prev = __calendarPartyProfileCache[uid] || {};

  const mergedRoot = {
    displayName: root.displayName,
    name: root.name,
    favoriteColor: root.favoriteColor
  };

  const mergedProf = {
    displayName: prev._profDisplayName,
    name: prev._profName,
    favoriteColor: prev._profFavoriteColor
  };

  __calendarPartyProfileCache[uid] = {
    name: cal_pickMemberName(mergedRoot, mergedProf),
    favoriteColor: cal_pickMemberColor(mergedRoot, mergedProf),
    _rootDisplayName: root.displayName || null,
    _rootName: root.name || null,
    _rootFavoriteColor: root.favoriteColor || null,
    _profDisplayName: prev._profDisplayName || null,
    _profName: prev._profName || null,
    _profFavoriteColor: prev._profFavoriteColor || null
  };

  paintCombinedEvents();
  await renderCalendarPartyPicker();
});

const profUnsub = onSnapshot(doc(db, 'users', uid, 'profile', 'profile'), async (snap) => {
  const prof = snap.exists() ? (snap.data() || {}) : {};
  const prev = __calendarPartyProfileCache[uid] || {};

  const mergedRoot = {
    displayName: prev._rootDisplayName,
    name: prev._rootName,
    favoriteColor: prev._rootFavoriteColor
  };

  const mergedProf = {
    displayName: prof.displayName,
    name: prof.name,
    favoriteColor: prof.favoriteColor
  };

  __calendarPartyProfileCache[uid] = {
    name: cal_pickMemberName(mergedRoot, mergedProf),
    favoriteColor: cal_pickMemberColor(mergedRoot, mergedProf),
    _rootDisplayName: prev._rootDisplayName || null,
    _rootName: prev._rootName || null,
    _rootFavoriteColor: prev._rootFavoriteColor || null,
    _profDisplayName: prof.displayName || null,
    _profName: prof.name || null,
    _profFavoriteColor: prof.favoriteColor || null
  };

  paintCombinedEvents();
  await renderCalendarPartyPicker();
});

      // buscar semestre equivalente por label
      const semsRef = collection(db, 'users', uid, 'semesters');
      const semsSnap = await getDocs(semsRef);

      let semId = null;
      semsSnap.forEach(d => {
        const lbl = (d.data()?.label || '').trim();
        if (lbl === activeLabel) semId = d.id;
      });

      let eventsUnsub = null;

      if (semId){
        const calRef = collection(db, 'users', uid, 'semesters', semId, 'calendar');
        eventsUnsub = onSnapshot(query(calRef, orderBy('date', 'asc')), (snap) => {
          __calendarPartyCombinedEvents.set(uid, snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            ownerUid: uid
          })));
          paintCombinedEvents();
        });
      } else {
        __calendarPartyCombinedEvents.set(uid, []);
        paintCombinedEvents();
      }

      __calendarPartyCombinedUnsubs.set(uid, () => {
        try { rootUnsub?.(); } catch {}
        try { profUnsub?.(); } catch {}
        try { eventsUnsub?.(); } catch {}
      });

    } catch (err){
      console.warn('subscribeCombinedPartyMembers error', uid, err);
      __calendarPartyCombinedEvents.set(uid, []);
    }
  }

  paintCombinedEvents();
}

/* === poblar semestres de tu duo (bloqueado al semestre activo actual) === */
async function populateSharedSemesters() {
  const otherUid = __calendarPartyViewingUid;
  if (!otherUid) return null;

  const activeLabel = state.activeSemesterData?.label || null;
  if (!activeLabel) {
    $('calSharedHint').textContent = 'No tienes semestre activo seleccionado.';
    return null;
  }

  try {
    const ref = collection(db, 'users', otherUid, 'semesters');
    const snap = await getDocs(ref);

    let match = null;
    snap.forEach(d => {
      const lbl = (d.data()?.label || '').trim();
      if (lbl === activeLabel) match = { id: d.id, label: lbl };
    });

    state.shared = state.shared || {};
    state.shared.calendar = state.shared.calendar || {};

    if (match) {
      state.shared.calendar.semId = match.id;
      $('calSharedHint').textContent = '';
      await subscribeShared(match.id);
      return match.id;
    }

    state.shared.calendar.semId = null;
    const grid = $('calSharedGrid');
    if (grid) {
      grid.innerHTML = `<div class="muted">Esta persona no tiene el semestre <b>${escapeHtml(activeLabel)}</b> creado.</div>`;
    }
    $('calSharedHint').textContent = 'Se intenta mostrar el mismo semestre activo que tienes tú.';
    return null;
  } catch (err) {
    console.error('populateSharedSemesters error', err);
    $('calSharedHint').textContent = 'Error al cargar el calendario compartido.';
    return null;
  }
}


/* === suscripción a calendario de duo === */
async function subscribeShared(semId){
  cleanupShared();
  sharedEvents = []; sharedCourses = [];
  // Dibuja base para evitar vacío
  buildSharedMonthGrid();

    const otherUid = __calendarPartyViewingUid;
  if (!otherUid || !semId) return;

  const coursesRef = collection(db,'users',otherUid,'semesters',semId,'courses');
  unsubSharedCourses = onSnapshot(query(coursesRef, orderBy('name')), (snap)=>{
    sharedCourses = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
    paintSharedEvents();
  });

  const calRef = collection(db,'users',otherUid,'semesters',semId,'calendar');
  unsubSharedEvents = onSnapshot(query(calRef, orderBy('date','asc')), (snap)=>{
    sharedEvents = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
    paintSharedEvents();
  });
}



/* ================= Modal (Propio) ================= */
function mountModal() {
  if ($('calModal')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'calModal';
  wrapper.className = 'modal';
  wrapper.innerHTML = `
    <div class="modal-backdrop" id="calModalBackdrop"></div>
    <div class="modal-content">
      <h3 id="calModalTitle" style="margin-top:0">Nuevo evento</h3>

      <div class="row" style="gap:10px">
        <div style="flex:1">
          <label>Título</label>
          <input type="text" id="calEvtTitle" placeholder="Ej. Prueba 1 ELO212"/>
        </div>
      </div>

      <div class="row" style="gap:10px; margin-top:8px">
        <div style="flex:1">
          <label>Fecha</label>
          <input type="date" id="calEvtDate"/>
        </div>
        <div style="flex:1">
          <label>Ramo</label>
          <select id="calEvtCourse">
            <option value="">(Sin asignar)</option>
          </select>
        </div>
      </div>

      <div class="row" style="gap:16px; margin-top:8px">
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
          <input type="checkbox" id="calEvtIsPersonal" />
          <span>Es evento personal</span>
        </label>

        <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
          <input type="checkbox" id="calEvtIsTask" />
          <span>Es una tarea</span>
        </label>

        <label id="calEvtCompletedWrap" class="calendar-task-option hidden">
          <input type="checkbox" id="calEvtCompleted" />
          <span>Completada</span>
        </label>
      </div>

      <div class="row" style="gap:10px; margin-top:8px">
        <div style="flex:1">
          <label>Inicio</label>
          <input type="time" id="calEvtStart"/>
        </div>
        <div style="flex:1">
          <label>Término</label>
          <input type="time" id="calEvtEnd"/>
        </div>
      </div>

      <div class="row" style="gap:10px; margin-top:8px">
        <div style="flex:1">
          <label>Repetir cada</label>
          <select id="calEvtRepeat">
            <option value="">(Sin repetición)</option>
            <option value="day">Día</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
          </select>
        </div>
        <div style="flex:1">
          <label>Persistencia</label>
          <select id="calEvtPersistent">
            <option value="">Solo este semestre</option>
            <option value="true">Mantener en semestres futuros</option>
          </select>
        </div>
      </div>

      <div class="row" style="justify-content:flex-end; gap:10px; margin-top:16px">
        <button class="ghost" id="calEvtCancel">Cancelar</button>
        <button class="primary" id="calEvtSave">Guardar</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const close = () => wrapper.classList.remove('active');
  $('calModalBackdrop').addEventListener('click', close);
  $('calEvtCancel').addEventListener('click', close);

  const courseSel = $('calEvtCourse');
  const personalChk = $('calEvtIsPersonal');
  const taskChk = $('calEvtIsTask');
  const completedChk = $('calEvtCompleted');
  const completedWrap = $('calEvtCompletedWrap');

  function syncPersonalMode(){
    if (!courseSel || !personalChk) return;

    if (personalChk.checked) {
      courseSel.value = '';
      courseSel.disabled = true;
      courseSel.style.opacity = '0.6';
    } else {
      courseSel.disabled = false;
      courseSel.style.opacity = '1';
    }
  }

  function syncTaskMode(){
    const enabled = !!taskChk?.checked;
    completedWrap?.classList.toggle('hidden', !enabled);
    if (!enabled && completedChk) completedChk.checked = false;
  }

  personalChk?.addEventListener('change', syncPersonalMode);
  taskChk?.addEventListener('change', syncTaskMode);
  courseSel?.addEventListener('change', () => {
    if (courseSel.value && personalChk) {
      personalChk.checked = false;
      syncPersonalMode();
    }
  });

  // 🔹 Guardar evento (nuevo o editado)
  $('calEvtSave').addEventListener('click', async () => {
    if (!state.currentUser || !state.activeSemesterId) {
      alert('Primero activa un semestre en la pestaña "Semestres".');
      return;
    }

    const title = ($('calEvtTitle').value || '').trim();
    const date  = $('calEvtDate').value || '';
    const start = $('calEvtStart').value || null;
    const end   = $('calEvtEnd').value || null;
    const isPersonal = !!$('calEvtIsPersonal')?.checked;
    const isTask = !!$('calEvtIsTask')?.checked;
    const completed = isTask && !!$('calEvtCompleted')?.checked;
    const courseId = isPersonal ? null : ($('calEvtCourse').value || null);
    const repeat = $('calEvtRepeat').value || '';
    const persistent = $('calEvtPersistent').value === 'true';
    const kind = isPersonal ? 'personal' : 'course';
    const color = courseId ? getCourseColorById(courseId) : getMyFavoriteColor();

    if (!title) return alert('Ingresa un título.');
    if (!date) return alert('Selecciona una fecha.');

    const editingId = wrapper.dataset.editingId || null;
    const existingEvent = wrapper.__editingEvent || null;
    const occurrenceDate = wrapper.dataset.editingOccurrenceDate || date;
    const taskFields = buildTaskCompletionFields({
      existingEvent,
      occurrenceDate,
      isTask,
      completed,
      repeatEvery: repeat,
    });
    const ref = collection(db, 'users', state.currentUser.uid, 'semesters', state.activeSemesterId, 'calendar');

    const payload = {
      title,
      date,
      start,
      end,
      courseId,
      kind,
      color,
      repeat: repeat ? { every: repeat, interval: 1 } : null,
      persistent,
      ...taskFields,
    };

    try {
      if (editingId) {
        // ✏️ Modo edición
        await updateDoc(doc(ref, editingId), {
          ...payload,
          updatedAt: Date.now(),
        });
        console.log('[Calendar] Evento actualizado:', title);
      } else {
        // ➕ Nuevo evento
        await addDoc(ref, {
          ...payload,
          createdAt: Date.now(),
        });
        console.log('[Calendar] Evento creado:', title);
      }

      wrapper.dataset.editingId = '';
      wrapper.dataset.editingOccurrenceDate = '';
      wrapper.__editingEvent = null;
      close();
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar el evento. Revisa tu conexión e inténtalo nuevamente.');
    }
  });
}

/* =============== Modal Importar Google Calendar (rango explícito) =============== */

function mountGcalImportModal() {
  if ($('gcalImportModal')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'gcalImportModal';
  wrapper.className = 'modal';
  wrapper.innerHTML = `
    <div class="modal-backdrop" id="gcalImportBackdrop"></div>
    <div class="modal-content">
      <h3 style="margin-top:0">Importar desde Google Calendar</h3>
      <p class="muted">
        Elige desde qué fecha hasta qué fecha quieres importar tus eventos.
      </p>

      <div class="row" style="gap:10px; margin-top:8px">
        <div style="flex:1">
          <label>Fecha de inicio</label>
          <input type="date" id="gcalRangeStart"/>
        </div>
        <div style="flex:1">
          <label>Fecha de término</label>
          <input type="date" id="gcalRangeEnd"/>
        </div>
      </div>

      <div class="row" style="justify-content:flex-end; gap:10px; margin-top:16px">
        <button class="ghost" id="gcalRangeCancel">Cancelar</button>
        <button class="primary" id="gcalRangeConfirm">Importar</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const close = () => wrapper.classList.remove('active');

  $('gcalImportBackdrop').addEventListener('click', close);
  $('gcalRangeCancel').addEventListener('click', close);

  $('gcalRangeConfirm').addEventListener('click', async () => {
    if (!state.currentUser || !state.activeSemesterId) {
      alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');
      return;
    }

    const startStr = $('gcalRangeStart').value;
    const endStr   = $('gcalRangeEnd').value;

    if (!startStr || !endStr) {
      alert('Selecciona ambas fechas (inicio y término).');
      return;
    }

    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);

    const timeMin = new Date(sy, sm - 1, sd, 0, 0, 0);
    // timeMax es exclusivo → sumamos 1 día
    const timeMax = new Date(ey, em - 1, ed + 1, 0, 0, 0);

    if (timeMax <= timeMin) {
      alert('La fecha de término debe ser posterior a la de inicio.');
      return;
    }

    try {
      await importGoogleCalendarRange(timeMin, timeMax);
      close();
    } catch (err) {
      console.error('Error al importar rango desde Google Calendar:', err);
      alert('Ocurrió un error al importar eventos de Google Calendar.');
    }
  });
}

function openGcalImportModal() {
  if (!state.currentUser || !state.activeSemesterId) {
    alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');
    return;
  }

  mountGcalImportModal();

  // valores por defecto: mes que estás viendo en el calendario
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth(); // 0–11
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const startInput = $('gcalRangeStart');
  const endInput   = $('gcalRangeEnd');

  if (startInput && !startInput.value) {
    startInput.value = isoDate(y, m + 1, 1);          // 1er día del mes
  }
  if (endInput && !endInput.value) {
    endInput.value = isoDate(y, m + 1, daysInMonth);  // último día del mes
  }

  $('gcalImportModal').classList.add('active');
}



function openModalFor(dateStr){
  if (!state.currentUser || !state.activeSemesterId){
    alert('Primero activa un semestre en la pestaña "Semestres".'); return;
  }

  mountModal();

  const modal = $('calModal');
  const titleEl = $('calModalTitle');
  const saveBtn = $('calEvtSave');

  if (modal) {
    modal.dataset.editingId = '';
    modal.dataset.editingOccurrenceDate = '';
    modal.__editingEvent = null;
  }
  if (titleEl) titleEl.textContent = 'Nuevo evento';
  if (saveBtn) saveBtn.textContent = 'Guardar';

  const dt = $('calEvtDate'); if (dt) dt.value = dateStr;
  const t = $('calEvtTitle'); if (t) t.value = '';
  const s = $('calEvtStart'); if (s) s.value = '';
  const e = $('calEvtEnd');   if (e) e.value = '';
  const sel = $('calEvtCourse');
  if (sel){
    sel.innerHTML = `<option value="">(Sin asignar)</option>`;
    (state.courses || []).forEach(c=>{
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = c.name;
      sel.appendChild(opt);
    });
  }
  const personalChk = $('calEvtIsPersonal');
  if (personalChk) personalChk.checked = false;

  const taskChk = $('calEvtIsTask');
  const completedChk = $('calEvtCompleted');
  const completedWrap = $('calEvtCompletedWrap');
  if (taskChk) taskChk.checked = false;
  if (completedChk) completedChk.checked = false;
  completedWrap?.classList.add('hidden');

  if (sel) {
    sel.disabled = false;
    sel.style.opacity = '1';
  }

  $('calModal').classList.add('active');
}

function getTodayLocalDateStr(){
  const now = new Date();

  // Usa la zona horaria local del navegador/equipo.
  // No usar toISOString(), porque trabaja en UTC y puede cambiar el día.
  return isoDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
}


/* ================= Construcción del mes – PROPIO ================= */
function buildMonthGrid(){
  const host = $('calGrid'); 
  if (!host) return;

  const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const firstWeekday = (first.getDay() + 6) % 7; // 0=Lun, 6=Dom
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const todayStr = getTodayLocalDateStr();

  const heads = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  host.innerHTML = `
    ${heads.map(h => `<div class="cal-cell head">${h}</div>`).join('')}

    ${Array.from({ length:firstWeekday }).map(() => `
      <div class="cal-cell empty"></div>
    `).join('')}

    ${Array.from({ length:daysInMonth }).map((_, i) => {
      const d = i + 1;
      const dateStr = isoDate(currentMonth.getFullYear(), currentMonth.getMonth() + 1, d);
      const isToday = dateStr === todayStr;

      return `
        <div class="cal-cell day ${isToday ? 'cal-today' : ''}" data-date="${dateStr}">
          <div class="cal-daytop">
            <div class="cal-daynum">${d}</div>
            ${isToday ? `<span class="cal-today-badge">Hoy</span>` : ''}
          </div>
          <div class="cal-events" id="ce-${dateStr}"></div>
        </div>
      `;
    }).join('')}
  `;

  host.querySelectorAll('.cal-cell.day').forEach(cell => {
    cell.addEventListener('click', () => openModalFor(cell.dataset.date));
  });

  paintEvents();
  renderOwnCalendarLegend();
}

function openModalForEdit(ev) {
  if (!state.currentUser || !state.activeSemesterId) {
    alert('Primero activa un semestre en la pestaña "Semestres".'); return;
  }
  mountModal();

  const modal = $('calModal');
  const titleEl = $('calModalTitle');
  const saveBtn = $('calEvtSave');
  modal.dataset.editingId = ev.id; // <- guardamos el ID a editar
  modal.dataset.editingOccurrenceDate = ev.date || '';
  modal.__editingEvent = ev;

  // Cambiar textos
  titleEl.textContent = 'Editar evento';
  saveBtn.textContent = 'Guardar cambios';

  // Precargar valores
  $('calEvtTitle').value = ev.title || '';
  $('calEvtDate').value = ev.date || '';
  $('calEvtStart').value = ev.start || '';
  $('calEvtEnd').value = ev.end || '';
  $('calEvtRepeat').value = ev.repeat?.every || '';
  $('calEvtPersistent').value = ev.persistent ? 'true' : '';

  const sel = $('calEvtCourse');
  sel.innerHTML = `<option value="">(Sin asignar)</option>`;
  (state.courses || []).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    if (c.id === ev.courseId) opt.selected = true;
    sel.appendChild(opt);
  });

  const personalChk = $('calEvtIsPersonal');
const inferredKind = ev.kind || (ev.courseId ? 'course' : 'personal');

if (personalChk) {
  personalChk.checked = inferredKind === 'personal';
}

const taskChk = $('calEvtIsTask');
const completedChk = $('calEvtCompleted');
const completedWrap = $('calEvtCompletedWrap');
const isTask = ev.isTask === true;
if (taskChk) taskChk.checked = isTask;
if (completedChk) completedChk.checked = isCalendarTaskCompleted(ev, ev.date);
completedWrap?.classList.toggle('hidden', !isTask);

if (sel) {
  if (inferredKind === 'personal') {
    sel.value = '';
    sel.disabled = true;
    sel.style.opacity = '0.6';
  } else {
    sel.disabled = false;
    sel.style.opacity = '1';
  }
}

  modal.classList.add('active');
}


/* ================= Construcción del mes – COMPARTIDO ================= */
function buildSharedMonthGrid(){
  const host = $('calSharedGrid'); 
  if (!host) return;

  const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const todayStr = getTodayLocalDateStr();

  const heads = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  host.innerHTML = `
    ${heads.map(h => `<div class="cal-cell head">${h}</div>`).join('')}

    ${Array.from({ length:firstWeekday }).map(() => `
      <div class="cal-cell empty"></div>
    `).join('')}

    ${Array.from({ length:daysInMonth }).map((_, i) => {
      const d = i + 1;
      const dateStr = isoDate(currentMonth.getFullYear(), currentMonth.getMonth() + 1, d);
      const isToday = dateStr === todayStr;

      return `
        <div class="cal-cell day ${isToday ? 'cal-today' : ''}" data-date="${dateStr}">
          <div class="cal-daytop">
            <div class="cal-daynum">${d}</div>
            ${isToday ? `<span class="cal-today-badge">Hoy</span>` : ''}
          </div>
          <div class="cal-events" id="sce-${dateStr}"></div>
        </div>
      `;
    }).join('')}
  `;

  paintSharedEvents();
}

function buildCombinedMonthGrid(){
  const host = $('calCombinedGrid'); 
  if (!host) return;

  const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const todayStr = getTodayLocalDateStr();

  const heads = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  host.innerHTML = `
    ${heads.map(h => `<div class="cal-cell head">${h}</div>`).join('')}

    ${Array.from({ length:firstWeekday }).map(() => `
      <div class="cal-cell empty"></div>
    `).join('')}

    ${Array.from({ length:daysInMonth }).map((_, i) => {
      const d = i + 1;
      const dateStr = isoDate(currentMonth.getFullYear(), currentMonth.getMonth() + 1, d);
      const isToday = dateStr === todayStr;

      return `
        <div class="cal-cell day ${isToday ? 'cal-today' : ''}" data-date="${dateStr}">
          <div class="cal-daytop">
            <div class="cal-daynum">${d}</div>
            ${isToday ? `<span class="cal-today-badge">Hoy</span>` : ''}
          </div>
          <div class="cal-events" id="bce-${dateStr}"></div>
        </div>
      `;
    }).join('')}
  `;

  paintCombinedEvents();
}

function createTaskMarker(ev, { interactive = false } = {}){
  if (!ev?.isTask) return null;

  const completed = isCalendarTaskCompleted(ev, ev.date);
  const marker = document.createElement(interactive ? 'button' : 'span');
  marker.className = `cal-task-check ${completed ? 'is-complete' : ''}`;
  marker.textContent = completed ? '✓' : '';
  marker.title = completed ? 'Marcar tarea como pendiente' : 'Marcar tarea como completada';
  marker.setAttribute('aria-label', marker.title);

  if (interactive) {
    marker.type = 'button';
    marker.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!state.currentUser || !state.activeSemesterId || !ev.id) return;

      marker.disabled = true;
      const nextCompleted = !isCalendarTaskCompleted(ev, ev.date);
      const taskFields = buildTaskCompletionFields({
        existingEvent: ev,
        occurrenceDate: ev.date,
        isTask: true,
        completed: nextCompleted,
        repeatEvery: ev.repeat?.every || '',
      });

      try {
        await updateDoc(
          doc(db, 'users', state.currentUser.uid, 'semesters', state.activeSemesterId, 'calendar', ev.id),
          { ...taskFields, updatedAt: Date.now() },
        );
      } catch (err) {
        console.error('[Calendar] No se pudo actualizar la tarea:', err);
        alert('No se pudo actualizar el estado de la tarea.');
        marker.disabled = false;
      }
    });
  }

  return marker;
}

function applyTaskCompletedStyle(chip, titleNode, ev){
  const completed = isCalendarTaskCompleted(ev, ev.date);
  chip.classList.toggle('cal-task-completed', completed);
  titleNode?.classList.toggle('cal-task-title-completed', completed);
}

function paintCombinedEvents(){
  document.querySelectorAll('.cal-events').forEach(c => {
    if (c.id?.startsWith('bce-')) c.innerHTML = '';
  });

  const ym = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2,'0')}`;

  const ownMonthEvents = expandRecurringEvents(events)
    .filter(ev => String(ev.date || '').startsWith(ym))
    .map(ev => ({
      ...ev,
      isMine: true,
      ownerUid: state.currentUser?.uid || null
    }));

  const partyMonthEvents = [];
  for (const [uid, arr] of __calendarPartyCombinedEvents.entries()){
    for (const ev of (arr || [])){
      if (String(ev.date || '').startsWith(ym)){
        partyMonthEvents.push({
          ...ev,
          isMine: false,
          ownerUid: uid
        });
      }
    }
  }

  const monthEvents = [...ownMonthEvents, ...partyMonthEvents];

  monthEvents.forEach(ev => {
    const cont = $('bce-' + ev.date);
    if (!cont) return;

    const prof = __calendarPartyProfileCache[ev.ownerUid] || {};
    const color = ev.isMine
      ? getMyFavoriteColor()
      : (isValidHex(prof.favoriteColor) ? prof.favoriteColor : '#64748b');

    const text = bestText(color);
    const time = (ev.start && ev.end) ? `${ev.start}–${ev.end} · `
               : (ev.start ? `${ev.start} · ` : '');

    const chip = document.createElement('div');
    chip.className = 'cal-evt';
    chip.style.background = color;
    chip.style.color = text;
    chip.style.opacity = ev.isMine ? 1 : 0.75;
    chip.style.border = '1px solid rgba(0,0,0,0.25)';

    const taskMarker = createTaskMarker(ev, { interactive: ev.isMine });
    if (taskMarker) chip.appendChild(taskMarker);

    const titleSpan = document.createElement('span');
    titleSpan.className = 'cal-evt-title';
    titleSpan.textContent = `${time}${ev.title || '(sin título)'}`;
    chip.appendChild(titleSpan);
    applyTaskCompletedStyle(chip, titleSpan, ev);

    cont.appendChild(chip);
  });
}
async function loadCombinedReminders(){
  const list = $('calCombinedRemindersList');
  if (!list) return;
  list.innerHTML = '<div class="loading"></div>';

  try {
    const mine = await listReminders({ range: 'today' });
    const duo  = state.pairOtherUid ? await listPairReminders({ range: 'today' }) : [];
    const all = [
      ...mine.map(r => ({...r, owner:'Tú'})),
      ...duo.map(r => ({...r, owner:'Dúo'}))
    ].sort((a,b)=> (a.datetime||0)-(b.datetime||0));

    list.innerHTML = all.length
      ? all.map(r => `
          <div class="grade-item">
            <div>
              <strong>${escapeHtml(r.title || '(sin título)')}</strong>
              <div class="muted">${escapeHtml(r.owner)} · ${escapeHtml(r.datetime?.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) || '')}</div>
            </div>
          </div>
        `).join('')
      : '<div class="muted">Sin recordatorios para hoy.</div>';
  } catch (err) {
    console.error('loadCombinedReminders', err);
    list.innerHTML = '<div class="muted">Error al cargar recordatorios.</div>';
  }
}


/* ================= Pintado – PROPIO ================= */
function parseYMDLocal(str){
  const [y, m, d] = String(str || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

function daysInMonth(y, m){
  return new Date(y, m, 0).getDate();
}

function addRepeatDateYMD(dateStr, unit, count){
  const base = parseYMDLocal(dateStr);
  if (!base) return null;

  let y = base.y;
  let m = base.m;
  let d = base.d;

  if (unit === 'day') {
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + count);
    return isoDate(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
  }

  if (unit === 'month') {
    const total = (y * 12 + (m - 1)) + count;
    y = Math.floor(total / 12);
    m = (total % 12) + 1;
    d = Math.min(base.d, daysInMonth(y, m));
    return isoDate(y, m, d);
  }

  if (unit === 'year') {
    y = base.y + count;
    d = Math.min(base.d, daysInMonth(y, m));
    return isoDate(y, m, d);
  }

  return null;
}

function expandRecurringEvents(list) {
  const expanded = [];

  for (const ev of list) {
    expanded.push(ev);

    if (!ev.repeat?.every) continue;

    const unit = ev.repeat.every;
    const interval = Number(ev.repeat.interval || 1);

    for (let i = 1; i <= 24; i++) {
      const nextStr = addRepeatDateYMD(ev.date, unit, i * interval);
      if (!nextStr) continue;

      expanded.push({ ...ev, date: nextStr });
    }
  }

  return expanded;
}

function renderOwnCalendarLegend(){
  const host = $('calLegend');
  if (!host) return;

  const items = (ownCourses || [])
    .filter(c => c?.name && isValidHex(c?.color))
    .map(c => ({
      id: c.id,
      name: c.name,
      color: c.color
    }));

  if (!items.length){
    host.innerHTML = '';
    return;
  }

  host.innerHTML = `
    <div style="
      width:100%;
      margin-top:2px;
      margin-bottom:4px;
      color:#cbd5e1;
      font-size:13px;
      font-weight:600;
    ">
    </div>

    ${items.map(item => `
      <div style="
        display:inline-flex;
        align-items:center;
        gap:8px;
        padding:6px 10px;
        border-radius:999px;
        background:rgba(255,255,255,0.05);
        border:1px solid rgba(255,255,255,0.10);
        font-size:13px;
      ">
        <span style="
          width:12px;
          height:12px;
          border-radius:999px;
          background:${item.color};
          display:inline-block;
          flex:0 0 auto;
          border:1px solid rgba(255,255,255,0.18);
        "></span>
        <span>${escapeHtml(item.name)}</span>
      </div>
    `).join('')}
  `;
}


function cal_askDeleteEventModal(title){
  return new Promise(resolve => {
    document.getElementById('calDeleteModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'calDeleteModal';
    modal.style.cssText = `
      position:fixed;
      inset:0;
      z-index:10060;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.65);
      padding:16px;
    `;

    modal.innerHTML = `
      <div style="
        width:min(420px, 92vw);
        background:#121527;
        color:#fff;
        border-radius:20px;
        padding:18px;
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 20px 70px rgba(0,0,0,.55);
        font-family:system-ui;
      ">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
          <div style="
            width:42px;height:42px;border-radius:14px;
            display:flex;align-items:center;justify-content:center;
            background:rgba(239,68,68,.2);
            border:1px solid rgba(239,68,68,.4);
            font-size:20px;
          ">🗑️</div>

          <div>
            <div style="font-weight:900;font-size:16px;">
              Eliminar evento
            </div>
            <div style="font-size:13px;opacity:.7;">
              Esta acción no se puede deshacer
            </div>
          </div>
        </div>

        <div style="
          margin-top:12px;
          padding:12px;
          border-radius:14px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08);
          font-size:14px;
        ">
          ¿Eliminar "<b>${escapeHtml(title || 'evento')}</b>"?
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button id="calDeleteCancel" class="ghost">Cancelar</button>
          <button id="calDeleteConfirm" class="primary" style="background:#ef4444;border:none;">
            Eliminar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const done = (val) => {
      modal.remove();
      resolve(val);
    };

    modal.querySelector('#calDeleteCancel')?.addEventListener('click', () => done(false));
    modal.querySelector('#calDeleteConfirm')?.addEventListener('click', () => done(true));

    modal.addEventListener('click', e => {
      if (e.target === modal) done(false);
    });
  });
}

function paintEvents() {
  document.querySelectorAll('.cal-events').forEach(c => {
    if (!c.id?.startsWith('sce-')) c.innerHTML = '';
  });

  const ym = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

let monthEvents = expandRecurringEvents(events).filter(ev =>
  String(ev.date || '').startsWith(ym)
);

monthEvents = monthEvents.filter(ev => {
  const inferredKind = ev.kind || (ev.courseId ? 'course' : 'personal');

  if (inferredKind === 'course' && !ownCalendarFilter.course) return false;
  if (inferredKind === 'personal' && !ownCalendarFilter.personal) return false;

  return true;
});

  monthEvents.forEach(ev => {
    const cont = $('ce-' + ev.date);
    if (!cont) return;

    const color = getOwnEventColor(ev, getMyFavoriteColor());
    const text = bestText(color);
    const time = (ev.start && ev.end) ? `${ev.start}–${ev.end} · ` :
      (ev.start ? `${ev.start} · ` : '');

    // 🔹 contenedor del evento
    const chip = document.createElement('div');
    chip.className = 'cal-evt';
    chip.style.background = color;
    chip.style.color = text;
    chip.style.border = '1px solid rgba(0,0,0,0.25)';
    chip.style.position = 'relative';
    chip.style.cursor = 'pointer';

    const taskMarker = createTaskMarker(ev, { interactive: true });
    if (taskMarker) chip.appendChild(taskMarker);

    // 🔹 texto principal
    const titleSpan = document.createElement('span');
    titleSpan.className = 'cal-evt-title';
    titleSpan.textContent = `${time}${ev.title || '(sin título)'}`;
    chip.appendChild(titleSpan);
    applyTaskCompletedStyle(chip, titleSpan, ev);

    // 🔹 botón eliminar (X)
    const delBtn = document.createElement('span');
    delBtn.textContent = '✕';
    delBtn.className = 'cal-del';
    delBtn.title = 'Eliminar evento';
    delBtn.style.position = 'absolute';
    delBtn.style.top = '2px';
    delBtn.style.right = '4px';
    delBtn.style.fontWeight = 'bold';
    delBtn.style.color = '#fff8';
    delBtn.style.cursor = 'pointer';
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!state.currentUser || !state.activeSemesterId || !ev.id) return;
      const ok = await cal_askDeleteEventModal(ev.title);
if (!ok) return;
      try {
        await deleteDoc(doc(db, 'users', state.currentUser.uid, 'semesters', state.activeSemesterId, 'calendar', ev.id));
      } catch (err) { console.error(err); }
    });
    chip.appendChild(delBtn);

    // 🔹 click sobre el chip → editar título
    chip.addEventListener('click', (e) => {
  e.stopPropagation();
  openModalForEdit(ev);
});

    cont.appendChild(chip);
  });
}



/* ================= Pintado – COMPARTIDO ================= */
function paintSharedEvents(){
  document.querySelectorAll('.cal-events').forEach(c => {
    if (c.id?.startsWith('sce-')) c.innerHTML = '';
  });

  const ym = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2,'0')}`;
  const monthEvents = sharedEvents.filter(ev => String(ev.date||'').startsWith(ym));

  monthEvents.forEach(ev => {
    const cont = $('sce-' + ev.date);
    if (!cont) return;

    // ✅ SIEMPRE usar el color favorito de la persona seleccionada
    const color = getPartyViewerColor();
    const text  = bestText(color);
    const time = (ev.start && ev.end) ? `${ev.start}–${ev.end} · ` :
                 (ev.start ? `${ev.start} · ` : '');

    const chip = document.createElement('div');
    chip.className = 'cal-evt';
    chip.style.background = color;
    chip.style.color = text;
    chip.style.border = '1px solid rgba(0,0,0,0.25)';

    const taskMarker = createTaskMarker(ev, { interactive: false });
    if (taskMarker) chip.appendChild(taskMarker);

    const titleSpan = document.createElement('span');
    titleSpan.className = 'cal-evt-title';
    titleSpan.textContent = `${time}${ev.title || '(sin título)'}`;
    chip.appendChild(titleSpan);
    applyTaskCompletedStyle(chip, titleSpan, ev);

    cont.appendChild(chip);
  });
}

/* ================= Utils ================= */
function addMonths(d, n){
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isoDate(y, m, d){ return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function _addUnits(baseDate, unit, count) {
  const d = new Date(baseDate.getTime());
  switch (unit) {
    case 'day':
      d.setDate(d.getDate() + count);
      break;
    case 'week':
      d.setDate(d.getDate() + 7 * count);
      break;
    case 'month':
      d.setMonth(d.getMonth() + count);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + count);
      break;
  }
  return d;
}



export async function listReminders(opts = {}) {
  if (!state.currentUser) throw new Error('No logueado');

  const {
    range = 'today',     // 'today' | 'week' | 'month' (lo de siempre)
    dates,               // array de días sueltos: ['2025-11-30', '2025-12-10', ...]
    months,              // array de meses: ['2023-03', '2025-11'] o [{year:2023, month:3}, ...]
    years,               // array de años: [2023, 2025]
    ranges               // array de rangos arbitrarios: [{ start, end }, ...]
  } = opts;

  const ref = collection(db, 'users', state.currentUser.uid, 'reminders');
  const snap = await getDocs(ref);

  let items = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      datetime: normalizeDateLoose(data.datetime)
    };
  });

  // 🔹 ignorar suspendidos
  items = items.filter(r => !r.suspended);

  // ==========================
  //  A) RANGOS ARBITRARIOS
  // ==========================
  if (Array.isArray(ranges) && ranges.length > 0) {
    const parsedRanges = ranges
      .map(r => {
        const start = normalizeDateLoose(r.start);
        const end   = normalizeDateLoose(r.end);
        if (!start || !end) return null;
        return { start, end };
      })
      .filter(Boolean);

    items = items.filter(it =>
      it.datetime &&
      parsedRanges.some(r => it.datetime >= r.start && it.datetime < r.end)
    );

    return items;
  }

  // ==========================
  //  B) VARIOS DÍAS SUELTOS
  // ==========================
  if (Array.isArray(dates) && dates.length > 0) {
    const set = new Set(
      dates
        .map(d => normalizeToYMD(d))
        .filter(Boolean)
    );

    items = items.filter(it => {
      if (!it.datetime) return false;
      const dStr = normalizeToYMD(it.datetime);
      return set.has(dStr);
    });

    return items;
  }

  // ==========================
  //  C) VARIOS MESES SUELTOS
  // ==========================
  if (Array.isArray(months) && months.length > 0) {
    const monthSpecs = months
      .map(m => {
        if (typeof m === 'string') {
          // 'YYYY-MM'
          const [yy, mm] = m.split('-').map(Number);
          if (!yy || !mm) return null;
          return { year: yy, month: mm };
        } else if (m && typeof m === 'object') {
          const year = Number(m.year ?? m.y);
          const month = Number(m.month ?? m.m);
          if (!year || !month) return null;
          return { year, month };
        }
        return null;
      })
      .filter(Boolean);

    items = items.filter(it => {
      if (!it.datetime) return false;
      const y = it.datetime.getFullYear();
      const m = it.datetime.getMonth() + 1;
      return monthSpecs.some(spec => spec.year === y && spec.month === m);
    });

    return items;
  }

  // ==========================
  //  D) VARIOS AÑOS SUELTOS
  // ==========================
  if (Array.isArray(years) && years.length > 0) {
    const yearSet = new Set(years.map(y => Number(y)));

    items = items.filter(it =>
      it.datetime && yearSet.has(it.datetime.getFullYear())
    );

    return items;
  }

  // ==========================
  //  E) COMPORTAMIENTO ANTIGUO
  // ==========================
  const now = new Date();

  if (range === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return items.filter(it =>
      it.datetime && it.datetime >= start && it.datetime < end
    );
  }

  if (range === 'week') {
    // inicio de semana según getDay (0=Domingo)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const end   = new Date(start);
    end.setDate(start.getDate() + 7);

    return items.filter(it =>
      it.datetime && it.datetime >= start && it.datetime < end
    );
  }

  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return items.filter(it =>
      it.datetime && it.datetime >= start && it.datetime < end
    );
  }

  // Si ponen algo raro en range → devolvemos todo no suspendido
  return items;
}




// js/calendar.js

export async function resumeReminder(reminderId) {
  if (!state.currentUser) throw new Error('No logueado');
  const ref = doc(db, 'users', state.currentUser.uid, 'reminders', reminderId);
  await updateDoc(ref, { suspended: false, updatedAt: Date.now() });
  return { ok:true };
}

// js/calendar.js

export async function listSuspendedReminders() {
  if (!state.currentUser) throw new Error('No logueado');

  const ref = collection(db, 'users', state.currentUser.uid, 'reminders');
  const q = query(ref, where('suspended', '==', true));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function suspendReminder({ reminderId }) {
  if (!state.currentUser) throw new Error('No logueado');
  if (!reminderId) throw new Error('Falta ID');

  const ref = doc(db, 'users', state.currentUser.uid, 'reminders', reminderId);
  await updateDoc(ref, { suspended: true, updatedAt: Date.now() });

  return { ok: true };
}

// ✅ ListPairReminders con normalización de datetime
export async function listPairReminders({ range='today' }={}) {
  if (!state.pairOtherUid) throw new Error('No tienes dúo');

  const ref = collection(db, 'users', state.pairOtherUid, 'reminders');
  const snap = await getDocs(ref);

  // 🔹 Normaliza datetime: soporta Timestamp o number
  const normalizeDate = (d) => {
    if (!d) return null;
    if (typeof d === 'number') return new Date(d);
    if (d.toDate) return d.toDate();   // Firestore Timestamp
    return new Date(d);
  };

  const items = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      datetime: normalizeDate(data.datetime)
    };
  });

  const now = new Date();
  if (range === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    return items.filter(it => it.datetime && it.datetime >= start && it.datetime < end);
  }
  if (range === 'week') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const end   = new Date(start); end.setDate(start.getDate() + 7);
    return items.filter(it => it.datetime && it.datetime >= start && it.datetime < end);
  }

  return items;
}

/* ============================================================
   Integración con Google Calendar
   - Carga dinámica de gapi
   - Auth con scopes de Calendar
   - Importa eventos del MES ACTUAL a Firestore (subcolección calendar)
   ============================================================ */

const GAPI_CLIENT_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID || '';
const GAPI_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '';

function ensureGoogleCalendarConfig(){
  if (!GAPI_CLIENT_ID || !GAPI_API_KEY) {
    throw new Error('Google Calendar no está configurado. Define VITE_GOOGLE_CALENDAR_CLIENT_ID y VITE_GOOGLE_CALENDAR_API_KEY.');
  }
}

const GAPI_DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
const GAPI_SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let gapiInited = false;
let gisInited  = false;
let tokenClient = null;

/** Carga gapi (cliente JS de Google APIs) */
function loadGapi() {
  return new Promise((resolve, reject) => {
    if (window.gapi && window.gapi.load) {
      return resolve();
    }
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('No se pudo cargar gapi'));
    document.head.appendChild(s);
  });
}

/** Carga Google Identity Services (nuevo OAuth) */
function loadGIS() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      return resolve();
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'));
    document.head.appendChild(s);
  });
}

/** Inicializa gapi.client solo con apiKey + discoveryDocs */
async function initGapiClient() {
  ensureGoogleCalendarConfig();
  if (gapiInited) return;
  await loadGapi();
  await new Promise((resolve) => {
    window.gapi.load('client', resolve);
  });
  await window.gapi.client.init({
    apiKey: GAPI_API_KEY,
    discoveryDocs: GAPI_DISCOVERY_DOCS
    // OJO: aquí ya NO va clientId ni scope
  });
  gapiInited = true;
}

/** Inicializa el tokenClient de GIS */
async function initTokenClient() {
  ensureGoogleCalendarConfig();
  if (gisInited && tokenClient) return;
  await loadGIS();
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GAPI_CLIENT_ID,
    scope: GAPI_SCOPES,
    callback: () => {} // se reemplaza al pedir token
  });
  gisInited = true;
}

/** Pide un access token válido */
async function getAccessToken() {
  await initTokenClient();

  return new Promise((resolve, reject) => {
    tokenClient.callback = (resp) => {
      if (resp.error) {
        console.error('[OAuth error]', resp);
        reject(resp);
        return;
      }
      resolve(resp.access_token);
    };

    tokenClient.requestAccessToken({
      prompt: '' // '' evita preguntar cuenta cada vez si ya diste permiso
    });
  });
}

/**
 * Llama realmente a la Calendar API usando el access token
 */
async function fetchGoogleCalendarEvents(timeMin, timeMax) {
  await initGapiClient();
  const accessToken = await getAccessToken();

  // Le pasamos el token a gapi
  window.gapi.client.setToken({ access_token: accessToken });

  const res = await window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  });

  console.log('[Calendar] Respuesta completa de Google:', res);
  return res.result.items || [];
}


/**
 * Pide eventos del calendario "primary" entre timeMin y timeMax.
 * @param {Date} timeMin
 * @param {Date} timeMax
 * @returns {Promise<Array>} items de Google Calendar
 */

/**
 * Convierte un event de Google Calendar a:
 *   { date: 'YYYY-MM-DD', startTime: 'HH:MM', endTime: 'HH:MM', allDay: bool }
 */
function adaptGCalEventDate(gEv){
  // Evento de día completo: viene con start.date (YYYY-MM-DD) sin hora
  if (gEv.start && gEv.start.date && !gEv.start.dateTime){
    return {
      date: gEv.start.date,
      startTime: null,
      endTime: null,
      allDay: true
    };
  }

  // Evento con hora
  const start = new Date(gEv.start?.dateTime || gEv.start?.date);
  const end   = new Date(gEv.end?.dateTime   || gEv.end?.date   || start);

  const date = isoDate(start.getFullYear(), start.getMonth()+1, start.getDate());
  const pad  = n => String(n).padStart(2,'0');

  const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const endTime   = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

  return {
    date,
    startTime,
    endTime,
    allDay: false
  };
}


function normalizeDateLoose(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === 'number') return new Date(d);
  if (typeof d === 'string') {
    const parsed = new Date(d);
    if (!isNaN(parsed)) return parsed;
    return null;
  }
  if (d.toDate) return d.toDate(); // Firestore Timestamp
  return null;
}

function normalizeToYMD(d) {
  const dd = normalizeDateLoose(d);
  if (!dd) return null;
  return isoDate(dd.getFullYear(), dd.getMonth() + 1, dd.getDate());
}

/**
 * Importa eventos de Google Calendar entre timeMin y timeMax
 * y los guarda en la subcolección "calendar" del semestre activo.
 */
async function importGoogleCalendarRange(timeMin, timeMax){
  if (!state.currentUser || !state.activeSemesterId){
    throw new Error('Sin usuario o semestre activo');
  }

  try{
    const gEvents = await fetchGoogleCalendarEvents(timeMin, timeMax);

    if (!gEvents.length){
      alert('No se encontraron eventos en tu Google Calendar para el rango seleccionado.');
      return;
    }

    const existingGcalIds = new Set(
      (events || [])
        .filter(ev => ev.gcalId)
        .map(ev => ev.gcalId)
    );

    const ref = collection(
      db,
      'users',
      state.currentUser.uid,
      'semesters',
      state.activeSemesterId,
      'calendar'
    );

    let importedCount = 0;
    const writes = [];

    for (const gEv of gEvents){
      if (existingGcalIds.has(gEv.id)) continue;

      const { date, startTime, endTime, allDay } = adaptGCalEventDate(gEv);
      if (!date) continue;

      const docData = {
        title: gEv.summary || '(sin título)',
        date,
        start: allDay ? null : startTime,
        end: allDay ? null : endTime,
        allDay: !!allDay,
        courseId: null,
        color: null,
        source: 'google',
        gcalId: gEv.id,
        createdAt: Date.now()
      };

      writes.push(addDoc(ref, docData));
      importedCount++;
    }

    if (!writes.length){
      alert('Los eventos de ese rango ya estaban importados.');
      return;
    }

    await Promise.all(writes);
    alert(`Se importaron ${importedCount} evento(s) desde tu Google Calendar para el rango seleccionado.`);
  }catch(err){
    console.error('Error al importar Google Calendar:', err);
    alert('Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.');
  }
}

// wrapper opcional si algún día quieres seguir usando "mes actual"
async function _importGoogleCalendarForCurrentMonth(){
  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth();
  const timeMin = new Date(y, m, 1, 0, 0, 0);
  const timeMax = new Date(y, m+1, 1, 0, 0, 0);
  return importGoogleCalendarRange(timeMin, timeMax);
}
