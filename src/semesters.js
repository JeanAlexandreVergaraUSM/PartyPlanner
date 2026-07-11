// js/semesters.js
import { db } from './firebase.js';
import { escapeHtml, escapeAttr } from './security/html.js';
import { $, state, updateDebug } from './state.js';
import {
  collection, addDoc, onSnapshot, doc, deleteDoc,
  query, orderBy, getDoc, where, getDocs, updateDoc, setDoc
} from 'firebase/firestore';
import { setCoursesSubscription, resetCourseForm, updateFormForUniversity } from './courses.js';

let unsubscribeSemesters = null;
let __semUIBound = false; 

export function initSemesters() {
  if (__semUIBound) return;   // 👈 evita listeners duplicados
  __semUIBound = true;
  bindUI();
}

export function stopSemestersSub() {
  if (unsubscribeSemesters) { unsubscribeSemesters(); unsubscribeSemesters = null; }
  // limpia la UI (por si quedó lista antigua)
  const list = $('semestersList'); if (list) list.innerHTML = '';
  // y resetea el activo
  clearActiveSemester();
}

function bindUI() {
  // Crear semestre
  const btn = $('createSemesterBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      if (!state.currentUser) { alert('Debes iniciar sesión.'); return; }
      const uniReadable = universityFromProfileReadable();
      if (!uniReadable) { alert('Completa tu universidad en Perfil.'); return; }

      const label = ($('semesterLabel')?.value || '').trim();
      if (!isValidLabel(label)) {
  alert('Formato de semestre inválido. Usa AAAA-1 o AAAA-2 (ej. 2025-2).');
  return;
}


      const ref = collection(db, 'users', state.currentUser.uid, 'semesters');

// 🔹 Evita crear otro semestre con el mismo label
const existing = await getDocs(query(ref, where('label', '==', label)));
if (!existing.empty) {
  alert('Ya existe un semestre con ese nombre.');
  return;
}

      // Verifica si ya existe una escala conocida para la universidad
let uniScale = localStorage.getItem(`scale_${uniReadable}`);
if (!uniScale) {
  const result = await new Promise((resolve) => {
    const modal = document.getElementById('scaleModal');
    const select = document.getElementById('scaleSelect');
    const save = document.getElementById('scaleSave');
    const cancel = document.getElementById('scaleCancel');

    modal.classList.add('active');
    select.value = ""; // resetea selección previa

    const cleanup = (value) => {
      modal.classList.remove('active');
      save.removeEventListener('click', onSave);
      cancel.removeEventListener('click', onCancel);
      resolve(value);
    };

    const onSave = () => {
      const value = select.value;
      if (!value) return alert('Selecciona una escala antes de continuar.');
      localStorage.setItem(`scale_${uniReadable}`, value);
      cleanup(value);
    };

    const onCancel = () => {
      cleanup(null); // 👈 null = cancelado
    };

    save.addEventListener('click', onSave);
    cancel.addEventListener('click', onCancel);
  });

  // Si el usuario canceló, no continuar
  if (!result) {
    console.log("❌ Creación de semestre cancelada por el usuario.");
    return; // 👈 DETIENE completamente el flujo
  }

  uniScale = result;
}


// Crear el semestre con la escala elegida
const newDocRef = await addDoc(ref, {
  label,
  universityAtThatTime: uniReadable,
  gradeScale: uniScale || '0-100',
  createdAt: Date.now()
});

if ($('semesterLabel')) $('semesterLabel').value = '';

// Busca el semestre activo anterior para copiar eventos persistentes
const prev = state.activeSemesterId || null;
if (prev) {
  await copyPersistentEvents(prev, newDocRef.id);
}

// 🔹 Nuevo: activar automáticamente el semestre recién creado
// 🔹 Activar automáticamente el semestre recién creado
await setActiveSemester(newDocRef.id);

// 🔹 Espera breve para asegurar que Firestore y el estado se sincronicen
await new Promise(resolve => setTimeout(resolve, 400));

// 🔹 Forzar refresco de cursos y UI
if (state.activeSemesterId) {
  console.log(`✅ Semestre ${label} activado (${state.activeSemesterId}), preparando interfaz de ramos...`);
  const uniCode = toInternalUniCode(uniReadable);
  updateFormForUniversity(uniCode);
  resetCourseForm();
  setCoursesSubscription();

  const coursesSection = $('coursesSection');
  if (coursesSection) coursesSection.classList.remove('hidden');
} else {
  console.warn("⚠️ No se estableció correctamente el semestre activo tras la creación.");
}
// ✅ Enlazar el botón de "Agregar ramo" por si aún no estaba activo
ensureCourseSaveBinding();
ensureCourseActionsBinding();


    });
  }

  // Delegación: activar / eliminar
  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    // Activar
    if (t.matches('.sem-activate')) {
      if (!state.currentUser) { alert('Debes iniciar sesión.'); return; }
      const id = t.dataset.id;
      await setActiveSemester(id);
    }

    // Eliminar
    if (t.matches('.sem-delete')) {
      if (!state.currentUser) { alert('Debes iniciar sesión.'); return; }
      const id = t.dataset.id;
      if (!confirm('¿Eliminar este semestre?')) return;
      await deleteDoc(doc(db, 'users', state.currentUser.uid, 'semesters', id));
      if (state.activeSemesterId === id) clearActiveSemester();
    }
  });
}

export async function refreshSemestersSub() {
  if (unsubscribeSemesters) {
    unsubscribeSemesters();
    unsubscribeSemesters = null;
  }
  if (!state.currentUser) return;

    // 🟡 Bloqueo contextual: si el perfil no tiene universidad o carrera
  const d = state.profileData || {};
  const uni = (d.university?.trim() || '');
  const car = (d.career?.trim() || '');
  const customUni = (d.customUniversity?.trim() || '');
  const customCar = (d.customCareer?.trim() || '');

  // ✅ Detecta si tiene universidad válida (predefinida o personalizada)
  const hasUni =
    (uni && uni !== 'OTRA') ||
    (customUni && customUni !== '');

  // ✅ Detecta si tiene carrera válida (predefinida o personalizada)
  const hasCareer =
    (car && car !== 'OTRA') ||
    (customCar && customCar !== '');

  const list = $('semestersList');
  if (!hasUni || !hasCareer) {
    if (list) {
      list.innerHTML = `
        <div class="card" style="padding:20px; text-align:center;">
          <h3>⚠️ Antes de agregar semestres necesitas configurar tu perfil</h3>
          <p>Completa tu <b>universidad</b> y <b>carrera</b> para poder crear y visualizar semestres.</p>
          <button id="goToProfileBtn" class="btn-primary" style="margin-top:10px;">
            Ir a Perfil ahora →
          </button>
        </div>
      `;

      // 🔗 Redirigir al tab Perfil al hacer clic
      $('goToProfileBtn')?.addEventListener('click', () => {
        const tabPerfil = $('subtabPerfil') || document.querySelector('[data-tab="perfil"]');
        const pagePerfil = $('perfilContainer') || document.getElementById('perfilContainer');

        if (tabPerfil && pagePerfil) {
          document.querySelectorAll('.subtab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

          tabPerfil.classList.add('active');
          pagePerfil.classList.remove('hidden');
        }
      });
    }

    // 🚪 Detener la función (no seguir con Firestore)
    return;
  }



  const uid = state.currentUser.uid;

  // 🔹 1. Cargar el semestre activo guardado en Firestore
  const userSnap = await getDoc(doc(db, "users", uid));
  const storedActive = userSnap.exists() ? userSnap.data()?.activeSemester || null : null;
  if (storedActive) {
    state.activeSemesterId = storedActive;
    // Cargar sus datos por si queremos mostrarlo de inmediato
    const semSnap = await getDoc(doc(db, "users", uid, "semesters", storedActive));
    state.activeSemesterData = semSnap.exists() ? semSnap.data() : null;
  }

    // 🔹 Si hay un semestre activo guardado, activar sus listeners y UI
  if (state.activeSemesterId && state.activeSemesterData) {
    console.log("[Semesters] Restaurando semestre activo tras recarga:", state.activeSemesterData.label);

    // Habilita sección de ramos
    const coursesSection = $('coursesSection');
    if (coursesSection) coursesSection.classList.remove('hidden');

    // Ajusta formulario según la universidad
    const uniCode = toInternalUniCode(state.activeSemesterData.universityAtThatTime);
    updateFormForUniversity(uniCode);

    // Vuelve a escuchar los ramos de este semestre
    resetCourseForm();
    setCoursesSubscription();
    ensureCourseSaveBinding();
    ensureCourseActionsBinding();


    // Actualiza las etiquetas visibles
    const lblEl = $('activeSemesterLabel');
    if (lblEl) lblEl.textContent = state.activeSemesterData.label || '—';
    const uniEl = $('activeSemesterUni');
    if (uniEl) uniEl.textContent = state.activeSemesterData.universityAtThatTime || '—';
    const grLabel = $('gr-activeSemLabel');
    if (grLabel) grLabel.textContent = state.activeSemesterData.label || '—';

    // Ajusta escala/umbral según universidad
    const scaleSel = $('gr-scaleSel');
    const thr = $('gr-passThreshold');
    if (scaleSel) {
      scaleSel.value = (uniCode === 'UMAYOR') ? 'MAYOR' : 'USM';
      scaleSel.disabled = true;
    }
    if (thr) {
      thr.value = (uniCode === 'UMAYOR') ? 4.0 : 55;
    }

    // Notifica al resto de módulos
    updateDebug();
    document.dispatchEvent(new Event('semester:changed'));

  }


  // 🔹 2. Escuchar cambios de semestres
  const ref = collection(db, "users", uid, "semesters");
  unsubscribeSemesters = onSnapshot(query(ref, orderBy("createdAt", "desc")), (snap) => {
    const list = $("semestersList");
    if (!list) return;
    list.innerHTML = "";

    if (snap.empty) {
      clearActiveSemester();
      return;
    }

    // 🔹 Renderiza cada semestre
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const item = document.createElement("div");
      item.className = "course-item";
      const isActive = state.activeSemesterId === docSnap.id;
      item.innerHTML = `
        <div>
          <div><b>${escapeHtml(d.label)}</b> <span class="course-meta">· ${escapeHtml(d.universityAtThatTime)}</span></div>
        </div>
        <div class="inline">
          ${isActive
            ? '<span class="course-meta">Activo</span>'
            : `<button class="ghost sem-activate" data-id="${escapeAttr(docSnap.id)}">Activar</button>`}
          <button class="danger sem-delete" data-id="${escapeAttr(docSnap.id)}">Eliminar</button>
        </div>
      `;
      list.appendChild(item);
    });

    // 🔹 Si el activo guardado ya no existe, límpialo
    const existsActive = snap.docs.some((d) => d.id === state.activeSemesterId);
    if (!existsActive) clearActiveSemester();

    // 🔹 Si no hay activo definido, usar el más reciente solo UNA vez
    if (!state.activeSemesterId && !snap.empty) {
      const newest = snap.docs[0].id;
      console.log("[Semesters] No había activo guardado, usando el más reciente:", newest);
      setActiveSemester(newest);
    }
  });
}

// 🔹 Copia automática de eventos persistentes (calendario)
async function copyPersistentEvents(oldSemId, newSemId) {
  const uid = state.currentUser?.uid;
  if (!uid || !oldSemId || !newSemId) return;

  try {
    const refOld = collection(db, 'users', uid, 'semesters', oldSemId, 'calendar');
    const refNew = collection(db, 'users', uid, 'semesters', newSemId, 'calendar');
    const snap = await getDocs(refOld);

    let copied = 0;
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      if (data.persistent) {
        await addDoc(refNew, { ...data, createdAt: Date.now() });
        copied++;
      }
    }
    console.log(`🔁 [Semesters] ${copied} eventos persistentes copiados de ${oldSemId} a ${newSemId}`);
  } catch (err) {
    console.error('❌ Error copiando eventos persistentes:', err);
  }
}



export async function setActiveSemester(semId) {
 if (!state.currentUser || !semId) return;
  state.activeSemesterId = semId;

  const snap = await getDoc(doc(db, "users", state.currentUser.uid, "semesters", semId));
  state.activeSemesterData = snap.exists() ? snap.data() : null;

  // 🔹 Guarda en Firestore para que el backend lo vea
  await setDoc(doc(db, "users", state.currentUser.uid), {
    activeSemester: semId
  }, { merge: true });

  // Si había otro semestre activo antes, copia eventos persistentes
if (state.lastActiveSemesterId && state.lastActiveSemesterId !== semId) {
  await copyPersistentEvents(state.lastActiveSemesterId, semId);
}
state.lastActiveSemesterId = semId;


  // Refleja en UI (tarjeta de Semestres)
  const lblEl = $('activeSemesterLabel');
if (lblEl) lblEl.textContent = state.activeSemesterData?.label || '—';

const uniEl = $('activeSemesterUni');
if (uniEl) uniEl.textContent = state.activeSemesterData?.universityAtThatTime || '—';

  // 🔹 Refleja en UI (pestaña Notas)
  const grLabel = $('gr-activeSemLabel');
  if (grLabel) grLabel.textContent = state.activeSemesterData?.label || '—';

  // 🔹 Ajusta escala/umbral automáticamente según la U del semestre
  const uniCode = toInternalUniCode(state.activeSemesterData?.universityAtThatTime);
  const scaleSel = $('gr-scaleSel');
  const thr = $('gr-passThreshold');
  if (scaleSel) {
    scaleSel.value = (uniCode === 'UMAYOR') ? 'MAYOR' : 'USM'; // UMayor: 1–7, USM: 0–100
    scaleSel.disabled = true; // bloqueada porque viene de la U del semestre
  }
  if (thr) {
    thr.value = (uniCode === 'UMAYOR') ? 4.0 : 55;
  }

  // Habilita sección de ramos y ajusta formulario de cursos
  const coursesSection = $('coursesSection');
  if (coursesSection) coursesSection.classList.remove('hidden');
  updateFormForUniversity(uniCode);

  // Vuelve a escuchar ramos del semestre activo
  resetCourseForm();
  setCoursesSubscription();

  // Avisar al resto de módulos mediante un evento desacoplado.
  updateDebug();

  // Refresca la lista para que se vea "Activo"
  refreshSemestersSub();

   // 🔹 Notifica a otros módulos (como asistencia o progreso)
  document.dispatchEvent(new Event('semester:changed'));
}

export function clearActiveSemester() {
  state.activeSemesterId = null;
  state.activeSemesterData = null;

  // Tarjeta Semestres
  const lblEl = $('activeSemesterLabel');
if (lblEl) lblEl.textContent = '—';
  const uniEl = $('activeSemesterUni');
if (uniEl) uniEl.textContent = '—';
  const coursesSection = $('coursesSection');
  if (coursesSection) coursesSection.classList.add('hidden');

  // 🔹 Pestaña Notas
  const grLabel = $('gr-activeSemLabel');
if (grLabel) grLabel.textContent = '—';
  const scaleSel = $('gr-scaleSel');
  if (scaleSel) { scaleSel.value = 'USM'; scaleSel.disabled = true; }
  const thr = $('gr-passThreshold');
  if (thr) thr.value = '';

  updateDebug();
  document.dispatchEvent(new Event('semester:changed'));
}

/* ---------- helpers ---------- */

// Reemplaza la función actual
function isValidLabel(str) {
  // Solo formato AAAA-1 o AAAA-2, sin restricciones de año
  return /^\d{4}-(1|2)$/.test(str || '');
}


function universityFromProfileReadable() {
  const d = state.profileData;
  if (!d || !d.university) return null;
  if (d.university === 'OTRA') return (d.customUniversity || '').trim() || null;
  if (d.university === 'UMAYOR') return 'Universidad Mayor';
  if (d.university === 'USM') return 'UTFSM';
  return d.university;
}

function toInternalUniCode(readable) {
  // Convierte "Universidad Mayor" -> UMAYOR, "UTFSM" -> USM
  if (!readable) return '';
  const r = readable.toLowerCase();
  if (r.includes('mayor')) return 'UMAYOR';
  if (r.includes('utfsm') || r.includes('santa maría') || r.includes('santa maria')) return 'USM';
  return 'OTRA';
}

/* ---------- API para el asistente IA ---------- */

export async function createSemester(label) {
  if (!state.currentUser) throw new Error('No hay usuario activo');
  if (!isValidLabel(label)) throw new Error('Formato inválido (usa AAAA-1 o AAAA-2)');
  const uniReadable = universityFromProfileReadable();
  if (!uniReadable) throw new Error('Perfil sin universidad');

  const ref = collection(db, 'users', state.currentUser.uid, 'semesters');
  const existing = await getDocs(query(ref, where('label', '==', label)));
  if (!existing.empty) throw new Error('Ya existe un semestre con ese nombre');

  await addDoc(ref, {
    label,
    universityAtThatTime: uniReadable,
    createdAt: Date.now()
  });
  
}

export async function deleteSemester(label) {
  if (!state.currentUser) throw new Error('No hay usuario activo');
  if (!label) throw new Error('Falta label');
  const ref = collection(db, 'users', state.currentUser.uid, 'semesters');
  const snap = await getDocs(query(ref, where('label', '==', label)));
  if (snap.empty) throw new Error('No encontré ese semestre');
  const id = snap.docs[0].id;
  await deleteDoc(doc(db, 'users', state.currentUser.uid, 'semesters', id));
  if (state.activeSemesterId === id) clearActiveSemester();
}

export async function activateSemester(label) {
  if (!state.currentUser) throw new Error('No hay usuario activo');
  if (!label) throw new Error('Falta label');
  const ref = collection(db, 'users', state.currentUser.uid, 'semesters');
  const snap = await getDocs(query(ref, where('label', '==', label)));
  if (snap.empty) throw new Error('No encontré ese semestre');
  const id = snap.docs[0].id;
  await setActiveSemester(id);
}



/* ---------- API para IA (sem_rename, sem_summary) ---------- */

// Renombrar semestre (cambia el campo label)
export async function renameSemester(oldLabel, newLabel) {
  if (!state.currentUser) throw new Error('No logueado');
  if (!oldLabel || !newLabel) throw new Error('Faltan labels');

  // buscar semestre por label
  const ref = collection(db, 'users', state.currentUser.uid, 'semesters');
  const snap = await getDocs(ref);
  const match = snap.docs.find(d => (d.data().label || '').toLowerCase() === oldLabel.toLowerCase());
  if (!match) throw new Error(`No encontré semestre "${oldLabel}"`);

  const semRef = doc(db, 'users', state.currentUser.uid, 'semesters', match.id);
  await updateDoc(semRef, { label: newLabel });

  return { ok:true, oldLabel, newLabel };
}


export async function getSemesterSummary(label) {
  if (!state.currentUser) throw new Error('No logueado');
  if (!label) throw new Error('Falta label');

  // buscar semestre por label
  const ref = collection(db, 'users', state.currentUser.uid, 'semesters');
  const snap = await getDocs(ref);
  const match = snap.docs.find(d => (d.data().label || '').toLowerCase() === label.toLowerCase());
  if (!match) throw new Error(`No encontré semestre "${label}"`);

  // traer cursos
  const coursesRef = collection(db, 'users', state.currentUser.uid, 'semesters', match.id, 'courses');
  const coursesSnap = await getDocs(coursesRef);

  const courses = coursesSnap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  return {
    label: match.data().label,
    count: courses.length,
    courses: courses.map(c => ({
      name: c.name,
      code: c.code,
      professor: c.professor,
      section: c.section,
      color: c.color
    }))
  };
}

export async function preloadCourses() {
  if (!state.currentUser) return;

  const uid = state.currentUser.uid;
  const semRef = collection(db, 'users', uid, 'semesters');
  const semSnap = await getDocs(semRef);

  state.semesters = semSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (state.activeSemesterId) {
    const coursesRef = collection(db, 'users', uid, 'semesters', state.activeSemesterId, 'courses');
    const coursesSnap = await getDocs(coursesRef);
    state.courses = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  console.log('📚 preloadCourses:', state.semesters, state.courses);
}

// -----------------------------------------------------------------------------
// 🔧 Hotfix: asegurar que el botón "Agregar ramo" funcione correctamente
// -----------------------------------------------------------------------------
function ensureCourseSaveBinding() {
  const btn = $('saveCourseBtn');
  if (!btn) return;
  if (btn.dataset.bound === '1') return;   // evita doble binding
  btn.dataset.bound = '1';

  btn.addEventListener('click', async () => {
    try {
      if (!state.currentUser) return alert('Debes iniciar sesión.');
      const semId = state.activeSemesterId;
      if (!semId) return alert('No hay semestre activo.');

      const name = $('courseName')?.value.trim();
      if (!name) return alert('Ingresa el nombre del ramo.');

      const data = {
        name,
        code: $('courseCode')?.value.trim() || '',
        professor: $('courseProfessor')?.value.trim() || '',
        section: $('courseSectPar')?.value.trim() || '',
        color: $('courseColor')?.value || '#3B82F6',
        asistencia: !!document.getElementById('courseAsistencia')?.checked,
        createdAt: Date.now()
      };

      await addDoc(
        collection(db, 'users', state.currentUser.uid, 'semesters', semId, 'courses'),
        data
      );

      resetCourseForm?.();
      console.log('[Courses] ✅ Ramo agregado en', semId, data);
    } catch (err) {
      console.error('❌ Error agregando ramo:', err);
      alert('No se pudo agregar el ramo. Revisa la consola.');
    }
  });
}

// -----------------------------------------------------------------------------
// 🔧 Hotfix: asegurar que los botones "Editar" y "Eliminar" funcionen correctamente
// -----------------------------------------------------------------------------
function ensureCourseActionsBinding() {
  const container = document.getElementById('coursesList');
  if (!container) return;
  container.dataset.bound = Date.now();

  container.addEventListener('click', async (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const semId = state.activeSemesterId;
    if (!state.currentUser || !semId) return;

    // 🔹 Eliminar ramo
    if (t.matches('.course-del')) {
      const id = t.dataset.id;
      if (!id) return;
      if (!confirm('¿Seguro que quieres eliminar este ramo?')) return;
      try {
        await deleteDoc(doc(db, 'users', state.currentUser.uid, 'semesters', semId, 'courses', id));
        console.log(`[Courses] Ramo eliminado: ${id}`);
      } catch (err) {
        console.error('❌ Error eliminando ramo:', err);
        alert('No se pudo eliminar el ramo.');
      }
    }

// 🔹 Editar ramo
if (t.matches('.course-edit')) {
  const id = t.dataset.id;
  if (!id) return;
  try {
    const ref = doc(db, 'users', state.currentUser.uid, 'semesters', semId, 'courses', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = snap.data();
      $('courseName').value = d.name || '';
      $('courseCode').value = d.code || '';
      $('courseProfessor').value = d.professor || '';
      $('courseSectPar').value = d.section || '';
      $('courseColor').value = d.color || '#3B82F6';
      $('courseColorCode').textContent = (d.color || '#3B82F6').toUpperCase();
      $('courseAsistencia').checked = !!d.asistencia;

      const saveBtn = $('saveCourseBtn');
      const cancelBtn = $('cancelEditBtn');
      cancelBtn.classList.remove('hidden');
      saveBtn.textContent = 'Guardar cambios';

// 🔹 Limpia listeners previos del botón sin reemplazarlo ni perder estilos
const fixedSaveBtn = $('saveCourseBtn').cloneNode(false);
fixedSaveBtn.textContent = 'Guardar cambios';
saveBtn.replaceWith(fixedSaveBtn);

const handler = async () => {
  try {
    const updated = {
      name: $('courseName').value.trim(),
      code: $('courseCode').value.trim(),
      professor: $('courseProfessor').value.trim(),
      section: $('courseSectPar').value.trim(),
      color: $('courseColor').value,
      asistencia: !!$('courseAsistencia').checked
    };
    await updateDoc(ref, updated);
    console.log(`[Courses] ✅ Ramo actualizado: ${id}`);
    resetCourseForm();
    cancelBtn.classList.add('hidden');
    fixedSaveBtn.textContent = 'Agregar ramo';
    ensureCourseSaveBinding(); // vuelve a activar modo "agregar"
  } catch (err) {
    console.error('❌ Error actualizando ramo:', err);
    alert('No se pudo guardar el ramo editado.');
  }
};

// 🔹 Conectar el nuevo listener
fixedSaveBtn.addEventListener('click', handler);

// 🔹 Botón cancelar vuelve al estado normal
cancelBtn.onclick = () => {
  resetCourseForm();
  cancelBtn.classList.add('hidden');
  fixedSaveBtn.textContent = 'Agregar ramo';
  ensureCourseSaveBinding();
};

    }
  } catch (err) {
    console.error('❌ Error al editar ramo:', err);
    alert('No se pudo cargar el ramo para editar.');
  }
}


  });
}
