// js/attendance.js
import { db } from './firebase.js';
import { $, state } from './state.js';
import { escapeHtml, escapeAttr } from './security/html.js';
import { collection, doc, onSnapshot, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

let unsubAttendance = null;
let unsubSelectedAttendance = null;
let unsubPreload = null;
const preloadAttendanceUnsubs = new Map();

function stopSelectedAttendanceSub(){
  try { unsubSelectedAttendance?.(); } catch {}
  unsubSelectedAttendance = null;
}

function stopPreloadAttendanceSubs(){
  try { unsubPreload?.(); } catch {}
  unsubPreload = null;

  for (const [, unsub] of preloadAttendanceUnsubs) {
    try { unsub?.(); } catch {}
  }
  preloadAttendanceUnsubs.clear();
}

export function stopAttendanceSubs(){
  try { unsubAttendance?.(); } catch {}
  unsubAttendance = null;
  stopSelectedAttendanceSub();
  stopPreloadAttendanceSubs();
}

export function initAttendance(){
  bindAttendanceModalUI();
  if (unsubAttendance) {
    try { unsubAttendance(); } catch {}
    unsubAttendance = null;
  }
  stopSelectedAttendanceSub();

  if (!state.currentUser || !state.activeSemesterId) {
    const sel = $('attCourseSel');
    if (sel) sel.innerHTML = '<option value="" disabled selected>Elige un ramo…</option>';
    renderAttendance([]);
    return;
  }

  const uid = state.currentUser.uid;
  const semId = state.activeSemesterId;
  const ref = collection(db,'users',uid,'semesters',semId,'courses');

  unsubAttendance = onSnapshot(ref, snap => {
    const asistCourses = snap.docs.filter(d => d.data().asistencia);
    const sel = $('attCourseSel');

    if (sel){
      const previous = sel.value || '';
      sel.innerHTML = '<option value="" disabled>Elige un ramo…</option>';

      asistCourses.forEach(d=>{
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.data().name || 'Ramo';
        sel.appendChild(opt);
      });

      const stillExists = previous && asistCourses.some(d => d.id === previous);
      sel.value = stillExists ? previous : '';

      // onChange sustituye el handler anterior: evita acumulación de listeners.
      sel.onchange = () => {
        const courseId = sel.value;
        const match = asistCourses.find(d => d.id === courseId);
        renderAttendance(match ? [match] : []);
      };

      if (stillExists) {
        const match = asistCourses.find(d => d.id === previous);
        renderAttendance(match ? [match] : []);
      } else {
        renderAttendance([]);
      }
    }
  });
}


function renderAttendance(list){
  const host = $('asistenciaList');
  if (!host) return;
  host.innerHTML = '';

  list.forEach(docSnap=>{
    const c = docSnap.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h4>${escapeHtml(c.name || 'Ramo')}</h4>
      <div class="att-days" data-id="${escapeAttr(docSnap.id)}"></div>
      <div class="muted">Asistencia actual: <span class="att-percent" data-id="${escapeAttr(docSnap.id)}">0%</span></div>
      <button class="btn btn-secondary add-att-btn" data-id="${escapeAttr(docSnap.id)}" style="margin-top:8px;">+ Agregar asistencia</button>
    `;
    host.appendChild(div);
    loadAttendance(docSnap.id);
  });

  host.querySelectorAll('.add-att-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> openAttendanceModal(btn.dataset.id));
  });
}


async function loadAttendance(courseId){
  stopSelectedAttendanceSub();
  if (!state.currentUser || !state.activeSemesterId || !courseId) return;

  const uid = state.currentUser.uid;
  const semId = state.activeSemesterId;
  const ref = collection(db,'users',uid,'semesters',semId,'courses',courseId,'attendance');

  unsubSelectedAttendance = onSnapshot(ref, snap=>{
    // Ignora callbacks tardíos si el usuario cambió de semestre.
    if (state.currentUser?.uid !== uid || state.activeSemesterId !== semId) return;
    const days = snap.docs.map(d=>({id:d.id, ...d.data()}));
    drawAttendance(courseId, days);
  });
}

async function drawAttendance(courseId, days){
  const container = document.querySelector(`.att-days[data-id="${courseId}"]`);
  if (!container) return;

  container.innerHTML = days.map(d=>`
    <div class="att-record">
      <span>${
  new Date(d.date + 'T00:00:00').toLocaleDateString('es-CL', { timeZone: 'America/Santiago' })
} :

        ${d.present ? '✔ Presente' :
  d.absent ? '✘ Ausente' :
  d.justified ? '🟡 Justificado' :
  '— Sin clase'}

      </span>
      <button class="btn btn-secondary btn-del-att" data-cid="${courseId}" data-id="${d.id}">❌</button>
    </div>
  `).join('');


  container.querySelectorAll('.btn-del-att').forEach(btn=>{
    btn.addEventListener('click', ()=> deleteAttendance(btn.dataset.cid, btn.dataset.id));
  });

const validDays = days.filter(d=>!d.noClass);
const ok = validDays.filter(d=>d.present || d.justified).length;
const percent = validDays.length ? Math.round((ok/validDays.length)*100) : 0;

  const el = document.querySelector(`.att-percent[data-id="${courseId}"]`);
  if (el) el.textContent = percent + '%';

if (!window.courseAttendance) window.courseAttendance = {};
window.courseAttendance[courseId] = percent;

}



let currentCourseForAttendance = null;

function openAttendanceModal(courseId){
  currentCourseForAttendance = courseId;

  // 🔹 Ajustar fecha local sin desfase UTC
  const now = new Date();
  const localISODate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  $('attDate').value = localISODate;
  $('attModal').classList.add('active');
}


function closeAttendanceModal(){
  $('attModal').classList.remove('active');
  currentCourseForAttendance = null;
}

let attendanceModalUiBound = false;

function bindAttendanceModalUI(){
  if (attendanceModalUiBound) return;
  attendanceModalUiBound = true;

  $('attCancel')?.addEventListener('click', closeAttendanceModal);
  $('attPresente')?.addEventListener('click', ()=> saveAttendance('present'));
  $('attAusente')?.addEventListener('click', ()=> saveAttendance('absent'));
  $('attJustificado')?.addEventListener('click', ()=> saveAttendance('justified'));
  $('attNoClass')?.addEventListener('click', ()=> saveAttendance('noClass'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindAttendanceModalUI, { once:true });
} else {
  bindAttendanceModalUI();
}

async function saveAttendance(status) {
  if (!currentCourseForAttendance) return;

  const dateInput = $('attDate').value;
  if (!dateInput) { alert('Selecciona una fecha'); return; }

  // ✅ Interpretar la fecha en hora local (no UTC)
  const [year, month, day] = dateInput.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // crea la fecha local correctamente

  // ✅ Guardamos el ISO local corregido, pero solo la parte de la fecha
  const date = localDate.toISOString().split('T')[0];

  const ref = doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', currentCourseForAttendance,
    'attendance', date
  );

  await setDoc(ref, {
    date,
    present: status === 'present',
    absent: status === 'absent',
    justified: status === 'justified',
    noClass: status === 'noClass'
  });

  closeAttendanceModal();
}




async function deleteAttendance(courseId, date){
  const ref = doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', courseId,
    'attendance', date
  );
  await deleteDoc(ref);
}


export async function preloadAttendanceData() {
  stopPreloadAttendanceSubs();

  if (!state.currentUser || !state.activeSemesterId) return false;

  const uid = state.currentUser.uid;
  const semId = state.activeSemesterId;

  if (!window.courseAttendance) window.courseAttendance = {};

  const coursesRef = collection(
    db,
    'users', uid,
    'semesters', semId,
    'courses'
  );

  const computePercent = (attSnap) => {
    const days = attSnap.docs.map(d => d.data());
    const valid = days.filter(d => !d.noClass);
    const ok = valid.filter(d => d.present || d.justified).length;
    return valid.length ? Math.round((ok / valid.length) * 100) : 0;
  };

  const subscribeCourseAttendance = (courseId) => {
    if (preloadAttendanceUnsubs.has(courseId)) return;

    const attRef = collection(
      db,
      'users', uid,
      'semesters', semId,
      'courses', courseId,
      'attendance'
    );

    const unsub = onSnapshot(attRef, (attSnap) => {
      if (state.currentUser?.uid !== uid || state.activeSemesterId !== semId) return;

      const percent = computePercent(attSnap);
      window.courseAttendance[courseId] = percent;

      document.dispatchEvent(new CustomEvent('attendance:ready', {
        detail: { courseId, percent }
      }));
    });

    preloadAttendanceUnsubs.set(courseId, unsub);
  };

  const reconcileAttendanceSubscriptions = (snap) => {
    const activeIds = new Set(
      snap.docs
        .filter(d => d.data()?.asistencia)
        .map(d => d.id)
    );

    for (const [courseId, unsub] of preloadAttendanceUnsubs) {
      if (!activeIds.has(courseId)) {
        try { unsub?.(); } catch {}
        preloadAttendanceUnsubs.delete(courseId);
        delete window.courseAttendance[courseId];
      }
    }

    for (const courseId of activeIds) {
      subscribeCourseAttendance(courseId);
    }
  };

  // Precarga inicial en paralelo: evita el patrón N consultas secuenciales.
  try {
    const snap = await getDocs(coursesRef);
    const asistCourses = snap.docs.filter(d => d.data()?.asistencia);

    const results = await Promise.all(asistCourses.map(async (c) => {
      const attRef = collection(
        db,
        'users', uid,
        'semesters', semId,
        'courses', c.id,
        'attendance'
      );
      const attSnap = await getDocs(attRef);
      return [c.id, computePercent(attSnap)];
    }));

    if (state.currentUser?.uid === uid && state.activeSemesterId === semId) {
      for (const [courseId, percent] of results) {
        window.courseAttendance[courseId] = percent;
      }

      document.dispatchEvent(new CustomEvent('attendance:ready', {
        detail: { preload: true }
      }));
    }
  } catch (err) {
    console.error('Error en precarga rápida de asistencia:', err);
  }

  // Un único listener de cursos administra exactamente un listener por ramo.
  unsubPreload = onSnapshot(coursesRef, reconcileAttendanceSubscriptions);
  return true;
}

// 🔁 Reintenta inicializar en los momentos correctos
document.addEventListener('auth:ready', () => {
  // espera breve para dar tiempo a semesters.js de restaurar el activo
  setTimeout(() => initAttendance(), 1000);
});

// cuando se cambia o restaura el semestre activo
document.addEventListener('semester:changed', () => {
  initAttendance();
});
