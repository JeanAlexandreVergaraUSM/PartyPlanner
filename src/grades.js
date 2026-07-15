import { db } from './firebase.js';
import { canViewPartyZone, privacyBlockedMessage } from './privacy.js';
import { $, state, setHidden } from './state.js';
import { evaluateSafeExpression } from './security/safeExpression.js';
import {
  collection, query, orderBy, getDocs, onSnapshot, doc, getDoc,
  addDoc, updateDoc, deleteDoc, setDoc , serverTimestamp 
} from 'firebase/firestore';

const _courseComponentsCache = new Map(); // courseId -> [{...component}]
const _courseHeaderCache = new Map();     // courseId -> { scale, finalExpr, rulesText }
let _courseSwitchToken = 0;
let currentCourseId = null;
let unsubComp = null;
let components = []; // [{id,key,name,score}]
let header = { scale: 'USM', finalExpr: '', rulesText: '' };
// --- Referencias cruzadas de notas finales (otros ramos del MISMO semestre) ---
let crossFinals = { byName:{}, byCode:{}, byId:{} };  // caches
let _crossFinalsSemesterKey = '';
const _crossFinalCourseCache = new Map(); // courseId -> { final, scale }
let _crossFinalsBuildPromise = null;
let unsubGrades = null;

function currentCrossFinalsSemesterKey(){
  return `${state.currentUser?.uid || ''}:${state.activeSemesterId || ''}`;
}

function resetCrossFinalsCache(){
  _crossFinalsSemesterKey = currentCrossFinalsSemesterKey();
  _crossFinalCourseCache.clear();
  _crossFinalsBuildPromise = null;
  crossFinals = { byName:{}, byCode:{}, byId:{} };
}

function invalidateCrossFinalCourse(courseId){
  const key = currentCrossFinalsSemesterKey();
  if (_crossFinalsSemesterKey !== key) {
    resetCrossFinalsCache();
    return;
  }

  if (courseId) {
    _crossFinalCourseCache.delete(courseId);
  } else {
    _crossFinalCourseCache.clear();
  }
}

/* ====== Nombres de grupos (ruta corregida) ====== */
let _groupNamesCache = null; // { certamenes:'...', controles:'...', ... }

function groupsDocRef(){
  return doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', currentCourseId,
    'groups', 'meta'     // 👈 subcolección correcta
  );
}

async function loadGroupNames(){
  _groupNamesCache = null;
  if (!readyPath()) return;
  try {
    const snap = await getDoc(groupsDocRef());
    _groupNamesCache = snap.exists() ? (snap.data() || {}) : {};
  } catch (err) {
    console.error('Error cargando nombres de grupos:', err);
    _groupNamesCache = {};
  }
}

async function saveGroupName(key, value){
  if (!readyPath()) return;
  try{
    await setDoc(groupsDocRef(), { [key]: value }, { merge:true });
    _groupNamesCache = { ...(_groupNamesCache || {}), [key]: value };
  }catch(err){
    console.error('Error guardando nombre de grupo:', err);
    throw err;
  }
}
function getCustomGroups(){
  const raw = _groupNamesCache || {};
  return Array.isArray(raw.__custom) ? raw.__custom : [];
}

// crea una clave interna a partir del nombre ("Trabajos especiales" -> "trabajos_especiales")
function makeGroupKeyFromLabel(label){
  const base = (label || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'_')
    .replace(/^_+|_+$/g,'') || 'g';
  return base;
}

// ➕ UI: crear carpeta nueva
async function addCustomGroup(){
  if (!readyPath()) return;

  const labelRaw = prompt('Nombre de la carpeta (ej.: "Quices", "Trabajos", "Controles cortos"):');
  if (!labelRaw) return;
  const label = labelRaw.trim();
  if (!label) return;

  const keywordRaw = prompt(
    'Palabra clave que deben contener las evaluaciones para ir a esta carpeta.\n' +
    'Ej.: "quiz" agrupa todo lo que tenga "quiz" en el nombre.'
  );
  if (!keywordRaw) return;
  const keyword = keywordRaw.trim();
  if (!keyword) return;

  const raw = _groupNamesCache || {};
  const custom = Array.isArray(raw.__custom) ? [...raw.__custom] : [];

  const baseKey = makeGroupKeyFromLabel(label);
  const taken = new Set([
    'certamenes','controles','tareas','proyecto',
    'evaluaciones','experiencias','preinformes',
    'informes','laboratorios','otros',
    ...custom.map(g => g.key)
  ]);

  let key = baseKey;
  let i = 2;
  while (taken.has(key)) {
    key = `${baseKey}${i++}`;
  }

  custom.push({ key, label, keyword });

  const payload = {
    ...raw,
    [key]: label,      // nombre visible
    __custom: custom   // lista de carpetas personalizadas
  };

  await setDoc(groupsDocRef(), payload, { merge:true });
  _groupNamesCache = payload;
}

// 🗑 eliminar carpeta personalizada
async function deleteCustomGroup(key){
  if (!readyPath()) return;
  const raw = _groupNamesCache || {};
  const custom = Array.isArray(raw.__custom) ? raw.__custom.filter(g => g.key !== key) : [];

  const payload = { ...raw };
  delete payload[key];      // borra el nombre visible
  payload.__custom = custom;

  await setDoc(groupsDocRef(), payload, { merge:true });
  _groupNamesCache = payload;
}




export function registerGradesUnsub(unsub){
  unsubGrades = unsub;
  state.unsubscribeGrades = () => { try{ unsubGrades?.(); }finally{ unsubGrades=null; state.unsubscribeGrades=null; } };
}

// Corta todo lo que esté escuchando Notas
export function stopGradesSub(){
  try { unsubGrades?.(); } finally { unsubGrades = null; }
  state.unsubscribeGrades = null;
}
function escapeHtml(s){ return esc(s); }
// Limpia la UI de Notas
export function clearGradesUI(){
  const sel = $('gr-courseSel');
  if (sel) sel.innerHTML = '<option value="" disabled selected>Selecciona un ramo…</option>';

  const list = $('gr-evalsList');      if (list) list.innerHTML = '';
  const expr = $('gr-finalExpr');      if (expr) expr.value = '';
  const err  = $('gr-rulesError');     if (err)  err.textContent = '';

  const avg  = $('gr-currentAvg');     if (avg)  avg.textContent = '—';
  const need = $('gr-neededToPass');   if (need) need.textContent = '—';
  const st   = $('gr-status');         if (st)   st.textContent   = '—';

  // vista de duo (si la tienes)
  const pv   = $('gr-partnerView');    if (pv)   pv.classList.add('hidden');
  const pSel = $('gr-sh-semSel');      if (pSel) pSel.innerHTML = '';
  const pLst = $('gr-sh-list');        if (pLst) pLst.innerHTML = '';
}

// =================== REEMPLAZA clearCourseViewImmediately ===================
// (mejora: siempre aplica el header cacheado a la UI)

function clearCourseViewImmediately(nextCourseId = currentCourseId){
  const cachedHeader = nextCourseId ? _courseHeaderCache.get(nextCourseId) : null;
  const cachedComponents = nextCourseId ? _courseComponentsCache.get(nextCourseId) : null;

  if (cachedHeader) {
    header = { ...header, ...cachedHeader };
  } else {
    // Mantener la escala actual hasta que llegue la real, no resetear todo
    header = { scale: header.scale || 'USM', finalExpr: '', rulesText: '' };
  }

  // Actualizar UI del header inmediatamente
  const exprEl = $('gr-finalExpr');
  if (exprEl) exprEl.value = header.finalExpr || '';
  const rt = $('gr-rulesText');
  if (rt) rt.value = header.rulesText || '';

  if (cachedComponents && cachedComponents.length) {
    components = cachedComponents.map(x => ({ ...x }));
    renderComponents(components);
    computeAndRender();
  } else {
    components = [];
    const host = $('gr-evalsList');
    // Mensaje sutil, no "Cargando..." agresivo
    if (host) host.innerHTML = '<div class="muted" style="opacity:.5">Cargando evaluaciones…</div>';
    renderResult(null);
  }
}

export function initGrades(){
  bindUi();
}

// 🔹 Recalcula las notas cuando se actualiza la asistencia
document.addEventListener('attendance:ready', (e) => {
  console.log('🔁 Asistencia actualizada para:', e.detail);
  computeAndRender();
});


// 🔹 Espera un poco tras volver a la pestaña de Notas, para limpiar bien la UI
document.addEventListener('route:notas', () => {
  setTimeout(() => {
    const sel = $('gr-courseSel');
    const evalsCard = $('gr-evalsCard');
    const calcCard = $('gr-calcCard');
    const summaryCard = $('gr-summaryCard');
    const rulesCard = $('gr-rulesCard');

    // Si no hay curso elegido, limpia y oculta todo
    if (!sel || !sel.value) {
      if (evalsCard) evalsCard.classList.add('hidden');
      if (calcCard) calcCard.classList.add('hidden');
      if (summaryCard) summaryCard.classList.add('hidden');
      if (rulesCard) rulesCard.classList.add('hidden');
    }
  }, 50); // ⏱️ 50ms bastan
});



document.addEventListener('semester:changed', () => {
  resetCrossFinalsCache();
  onActiveSemesterChanged();
});

document.addEventListener('courses:changed', () => {
  invalidateCrossFinalCourse(null);
  onCoursesChanged().catch(err => console.warn('Error actualizando notas por cambio de ramos:', err));
});

export async function onCoursesChanged(){
  await loadCoursesIntoSelect();
}

export function onActiveSemesterChanged(){
  const lbl = $('gr-activeSemLabel');
  if (lbl) lbl.textContent = state.activeSemesterData?.label || '—';
  loadCoursesIntoSelect();

  // 🔒 Sincroniza el combo "Semestres" con el semestre activo actual
const shSel = document.getElementById('gr-sh-semSel');
if (shSel && state.activeSemesterData?.label) {
  // muestra el semestre activo actual
  shSel.innerHTML = `<option selected>${esc(state.activeSemesterData.label)}</option>`;
  
  // bloquea interacción
  shSel.disabled = true;
  shSel.style.pointerEvents = 'none';
  shSel.style.opacity = '0.7';
}

// ✅ Esperar la precarga de asistencia antes de renderizar las notas
(async () => {
  try {
    const { preloadAttendanceData } = await import('./attendance.js');
    await preloadAttendanceData(); // espera la parte getDocs()
    console.log('✅ Asistencia precargada, ahora sí recalculamos notas');
    computeAndRender();
  } catch (err) {
    console.warn('⚠️ Error precargando asistencia:', err);
    computeAndRender(); // fallback
  }
})();

}

/* =================== UI bindings =================== */

// Obtiene {code, name, grade} desde "components" (ya lo mantienes con onSnapshot)
function gr_collectEvaluationsForSim(){
  return (components || []).map(c => ({
    code:  c.key,
    name:  c.name || c.key,
    grade: (typeof c.score === 'number' ? c.score : null)
  }));
}


function bindUi(){
  hideThresholdUi();

  $('gr-saveExpr')?.addEventListener('click', () => {
    saveExpr().catch(err => console.error('saveExpr', err));
  });
  $('gr-finalExpr')?.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') { e.preventDefault(); saveExpr(); }
  });
  $('gr-courseSel')?.addEventListener('change', onCourseChange);

$('gr-addEvalBtn')?.addEventListener('click', addEvalFromForm);


  // Crear la sección Reglas dentro de #page-notas (aunque esté oculta)
  ensureRulesUI();
  bindRulesEditor();

function ensureSimButton(){
  const pageNotas = $('page-notas');
  if (!pageNotas) return;

  const calcCard = Array.from(pageNotas.querySelectorAll('.card h3'))
    .find(h => /c[aá]lculo de notas/i.test(h.textContent))?.closest('.card');
  if (!calcCard) return;

  if (!calcCard.id) calcCard.id = 'gr-calcCard';

  const titleEl = calcCard.querySelector('h3');

  let headerRow = titleEl?.closest('.row');
  if (!headerRow) {
    headerRow = document.createElement('div');
    headerRow.className = 'row gr-calcHeader';
    if (titleEl) headerRow.appendChild(titleEl);
    calcCard.insertBefore(headerRow, calcCard.firstChild);
  } else {
    headerRow.classList.add('gr-calcHeader');
  }

  if (!calcCard.querySelector('#gr-openSim')) {
    const simBtn  = document.createElement('button');
    simBtn.id = 'gr-openSim';
    simBtn.className = 'ghost';
    simBtn.textContent = 'Simulador de notas';
    simBtn.style.marginLeft = 'auto';
    headerRow.appendChild(simBtn);

    simBtn.addEventListener('click', () => {
      const formula = gr_getFormulaStr();
      if (!formula) { alert('Primero define la Fórmula final.'); return; }
      const evals = gr_collectEvaluationsForSim();
      if (!evals.length) { alert('Agrega al menos una evaluación.'); return; }
      gr_openSimDrawer({ formula, evals });
    });
  }
}

function ensureTopExportNotesButton(){
  const partyBtn = $('gr-togglePartner');
  if (!partyBtn || !partyBtn.parentElement) return;

  let exportBtn = $('gr-exportMyNotes');

  if (!exportBtn) {
    exportBtn = document.createElement('button');
    exportBtn.id = 'gr-exportMyNotes';
    exportBtn.type = 'button';

    // copiar visual del botón "Notas de mi party"
    exportBtn.className = partyBtn.className;
    exportBtn.style.cssText = partyBtn.style.cssText || '';

    exportBtn.textContent = 'Exportar mis notas';

    // insertarlo justo al lado
    partyBtn.insertAdjacentElement('afterend', exportBtn);
  } else {
    // por si ya existía, mantenerlo visualmente igual al botón party
    exportBtn.className = partyBtn.className;
    exportBtn.style.cssText = partyBtn.style.cssText || '';
    exportBtn.textContent = 'Exportar mis notas';
  }

  if (exportBtn.dataset.boundExportNotes === '1') return;
  exportBtn.dataset.boundExportNotes = '1';

  exportBtn.addEventListener('click', async () => {
    try {
      const { openGradesPdfExportModal } = await import('./export.js');
      await openGradesPdfExportModal();
    } catch (err) {
      console.error(err);
      alert('No se pudo abrir el exportador de notas.');
    }
  });
}

  ensureSimButton();
  ensureTopExportNotesButton();


const f = $('gr-finalExpr');
if (f){
  const debouncedSave = debounce(async (courseIdAtTyping) => {
    if (courseIdAtTyping !== currentCourseId) return;
    await saveExpr(courseIdAtTyping);
  }, 600);

  const syncFormulaLive = () => {
    if (!currentCourseId) return;

    const live = normalizeExpr(f.value || '');
    header.finalExpr = live;

    const prev = _courseHeaderCache.get(currentCourseId) || {};
    _courseHeaderCache.set(currentCourseId, {
      ...prev,
      ...header,
      finalExpr: live
    });

    computeAndRender();
  };

  f.addEventListener('input', () => {
    const courseIdAtTyping = currentCourseId;
    syncFormulaLive();
    debouncedSave(courseIdAtTyping);
  });

  f.addEventListener('keyup', syncFormulaLive);
  f.addEventListener('change', syncFormulaLive);

  f.addEventListener('blur', async () => {
    syncFormulaLive();
    await saveExpr(currentCourseId);
  });

  f.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      syncFormulaLive();
      saveExpr(currentCourseId);
    }
  });
}


    // ===== Autocomplete para final(...) y finalCode(...) en la fórmula =====
  setupFinalAutocomplete();

}

function setRulesSaveStatus(message, stateName = ''){
  const el = $('gr-rulesSaveState');
  if (!el) return;

  el.textContent = message || '';
  el.dataset.saveState = stateName;
}

function bindRulesEditor(){
  const rulesEl = $('gr-rulesText');
  if (!rulesEl || rulesEl.dataset.boundRulesEditor === '1') return;

  rulesEl.dataset.boundRulesEditor = '1';

  const debouncedSave = debounce(async (courseIdAtTyping, textAtTyping) => {
    if (!courseIdAtTyping || courseIdAtTyping !== currentCourseId) return;
    await saveRules(courseIdAtTyping, textAtTyping);
  }, 700);

  const syncRulesLive = () => {
    if (!currentCourseId) return;

    const live = rulesEl.value || '';
    header.rulesText = live;

    const prev = _courseHeaderCache.get(currentCourseId) || {};
    _courseHeaderCache.set(currentCourseId, {
      ...prev,
      ...header,
      rulesText: live,
    });

    setRulesSaveStatus('Cambios sin guardar…', 'dirty');
    computeAndRender();
  };

  rulesEl.addEventListener('input', () => {
    const courseIdAtTyping = currentCourseId;
    const textAtTyping = rulesEl.value || '';
    syncRulesLive();
    debouncedSave(courseIdAtTyping, textAtTyping);
  });

  rulesEl.addEventListener('blur', async () => {
    if (!currentCourseId) return;
    syncRulesLive();
    await saveRules(currentCourseId, rulesEl.value || '');
  });
}

function setupFinalAutocomplete(){ /* TODO: implementar */ }



/* ======= Helpers UI ======= */
function hideThresholdUi(){
  // input de umbral
  const thr = $('gr-passThreshold');
  if (thr) thr.closest('div')?.classList.add('hidden');
  // botón guardar cabecera
  const btn = $('gr-saveHeader');
  if (btn) btn.classList.add('hidden');
}

function ensureRulesUI(){
  if ($('gr-rulesCard')) return;

  const pageNotas = $('page-notas');
  if (!pageNotas) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'gr-rulesCard';
  card.style.marginTop = '12px';
  card.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center">
      <h3 style="margin:0">Reglas</h3>
      <div class="muted" id="gr-rulesHint">Una por línea. Ej.: <code>C1>=50</code>, <code>avg(Q1,Q2,Q3)>=60</code>,</code> finalCode("Codigo del ramo") >= 50</code>,</code>Asistencia >= 55%</code></div>
    </div>
    <div class="row" style="align-items:flex-start;margin-top:8px">
      <textarea id="gr-rulesText" rows="4" style="flex:1 1 520px;min-height:86px;background:#0e1120;border:1px solid var(--line);color:var(--ink);padding:8px 10px;border-radius:10px"></textarea>
      <div id="gr-formulaError" class="muted" style="margin-top:6px;color:#fca5a5"></div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
        <button id="gr-saveRules" class="primary" type="button">Guardar reglas</button>
        <span id="gr-rulesSaveState" class="muted" aria-live="polite"></span>
      </div>
    </div>
    <div id="gr-rulesStatus" class="muted" style="margin-top:6px"></div>
  `;

  // 👉 localizar el card "🧮 Cálculo de notas"
  const calcCard = Array.from(pageNotas.querySelectorAll('.card h3'))
    .find(h => /c[aá]lculo de notas/i.test(h.textContent))?.closest('.card');

  if (calcCard) {
    // Inserta Reglas justo ANTES de "Cálculo de notas" (queda debajo de Evaluaciones)
    pageNotas.insertBefore(card, calcCard);
  } else {
    // Fallback: al final
    pageNotas.appendChild(card);
  }

  $('gr-saveRules')?.addEventListener('click', () => {
    saveRules().catch(err => console.error('saveRules', err));
  });
}



/* =================== Select de ramos =================== */

async function loadCoursesIntoSelect(){
  const sel = $('gr-courseSel');
  if (!sel) return;

  const prevId = state.editingCourseId || currentCourseId || '';
  sel.innerHTML = '<option value="">Selecciona un ramo…</option>';

  if (!state.courses || state.courses.length === 0){
    currentCourseId = null;
    state.editingCourseId = null;
    $('gr-evalsCard')?.classList.add('hidden');
    $('gr-calcCard')?.classList.add('hidden');
    $('gr-summaryCard')?.classList.add('hidden');
    $('gr-rulesCard')?.classList.add('hidden');
    renderComponents([]);
    renderResult(null);
    return;
  }

  state.courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });

  const stillExists = prevId && state.courses.some(c => c.id === prevId);

  if (stillExists) {
    currentCourseId = prevId;
    state.editingCourseId = prevId;
    sel.value = prevId;

    $('gr-evalsCard')?.classList.remove('hidden');
    $('gr-calcCard')?.classList.remove('hidden');
    $('gr-summaryCard')?.classList.remove('hidden');
    $('gr-rulesCard')?.classList.remove('hidden');

    await loadGradingDoc();
    await loadGroupNames();
    await watchComponents();
    await rebuildCrossFinals();
    computeAndRender();
    await forceAttendanceSync(currentCourseId);
  } else {
    currentCourseId = null;
    state.editingCourseId = null;
    sel.value = '';

    $('gr-evalsCard')?.classList.add('hidden');
    $('gr-calcCard')?.classList.add('hidden');
    $('gr-summaryCard')?.classList.add('hidden');
    $('gr-rulesCard')?.classList.add('hidden');
  }
}

// =================== REEMPLAZA onCourseChange completo ===================

async function onCourseChange(e){
  const nextCourseId = e.target.value || null;
  const prevCourseId = currentCourseId;
  const myToken = ++_courseSwitchToken;

  // Guardar el ramo anterior en background (sin bloquear)
  if (prevCourseId && prevCourseId !== nextCourseId) {
    const previousExpr = $('gr-finalExpr')?.value ?? header.finalExpr ?? '';
    const previousRules = $('gr-rulesText')?.value ?? header.rulesText ?? '';

    Promise.all([
      saveExpr(prevCourseId, previousExpr),
      saveRules(prevCourseId, previousRules),
    ]).catch(err => console.warn('No se pudo guardar antes de cambiar de ramo:', err));
  }

  currentCourseId = nextCourseId;
  state.editingCourseId = currentCourseId;

  // Cancelar listener anterior
  if (unsubComp) {
    try { unsubComp(); } catch {}
    unsubComp = null;
  }

  if (!currentCourseId){
    $('gr-evalsCard')?.classList.add('hidden');
    $('gr-calcCard')?.classList.add('hidden');
    $('gr-summaryCard')?.classList.add('hidden');
    $('gr-rulesCard')?.classList.add('hidden');
    components = [];
    renderComponents([]);
    renderResult(null);
    return;
  }

  $('gr-evalsCard')?.classList.remove('hidden');
  $('gr-calcCard')?.classList.remove('hidden');
  $('gr-summaryCard')?.classList.remove('hidden');
  $('gr-rulesCard')?.classList.remove('hidden');

  // ✅ PASO 1: Pintar caché instantáneamente (0ms)
  clearCourseViewImmediately(nextCourseId);

  // ✅ PASO 2: Enganchar listener SIN await — el onSnapshot pinta solo cuando llegan datos
  watchComponents(nextCourseId);

  // ✅ PASO 3: Todo lo demás en background, sin bloquear la UI
  Promise.all([
    loadGradingDoc(),
    loadGroupNames(),
  ]).then(async () => {
    if (myToken !== _courseSwitchToken) return; // ya cambió de ramo otra vez
    // Re-render con los nombres de grupos y la fórmula correcta
    renderComponents(components);
    computeAndRender();

    // Asistencia y cross-finals son los más lentos — van al final
    forceAttendanceSync(nextCourseId).then(() => {
      if (myToken !== _courseSwitchToken) return;
      computeAndRender();
    }).catch(() => {});

    rebuildCrossFinals().then(() => {
      if (myToken !== _courseSwitchToken) return;
      computeAndRender();
    }).catch(() => {});

  }).catch(err => console.warn('Error cargando datos del ramo:', err));
}

async function forceAttendanceSync(courseId) {
  try {
    const attRef = collection(
      db,
      'users', state.currentUser.uid,
      'semesters', state.activeSemesterId,
      'courses', courseId,
      'attendance'
    );
    const attSnap = await getDocs(attRef);
    const days = attSnap.docs.map(d => d.data());
    const validDays = days.filter(d => !d.noClass);
    const ok = validDays.filter(d => d.present || d.justified).length;
    const percent = validDays.length ? Math.round((ok / validDays.length) * 100) : 0;

    if (!window.courseAttendance) window.courseAttendance = {};
    window.courseAttendance[courseId] = percent;

    console.log(`✅ Sincronizada asistencia directa de ${courseId}: ${percent}%`);
    computeAndRender();
  } catch (err) {
    console.warn('⚠️ No se pudo sincronizar asistencia directa:', err);
  }
}

/* =================== Refs Firestore =================== */

function gradingDocRef(){
  return doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', currentCourseId,
    'grading', 'meta'
  );
}

function componentsColRef(){
  return collection(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', currentCourseId,
    'grading', 'meta',
    'components'
  );
}

/* =================== Header (escala/expr/reglas) =================== */

// =================== REEMPLAZA loadGradingDoc ===================
// Fix crítico: nunca pisar header.finalExpr ni header.rulesText si el usuario
// ya escribió algo en el input DESPUÉS de que arrancó esta carga.

async function loadGradingDoc(){
  if (!readyPath()) return;
  const courseIdAtLoad = currentCourseId;

  // 📸 Snapshot del valor del input AL INICIO de la carga
  //    Si cuando terminemos el input cambió, NO pisamos.
  const exprAtStart = $('gr-finalExpr')?.value ?? null;
  const rulesAtStart = $('gr-rulesText')?.value ?? null;

  const gRef = gradingDocRef();
  const courseRef = doc(
    db, 'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', currentCourseId
  );

  const courseSnap = await getDoc(courseRef);
  const courseScale = courseSnap.exists() ? (courseSnap.data().scale || null) : null;

  const semScale = state.activeSemesterData?.gradeScale || null;
  const uniReadable = state.activeSemesterData?.universityAtThatTime || '';
  const storedScale = localStorage.getItem(`scale_${uniReadable}`);
  const uniScale = semScale
    ? ((semScale === '1-7' || semScale === '2-7' || semScale === '0-7') ? 'MAYOR' : 'USM')
    : storedScale
      ? (storedScale.includes('7') ? 'MAYOR' : 'USM')
      : (/mayor/i.test(uniReadable) ? 'MAYOR' : 'USM');

  const snap = await getDoc(gRef);

  // ❌ Si el usuario cambió de ramo mientras cargábamos, abortamos
  if (courseIdAtLoad !== currentCourseId) return;

  const fromFirestore = snap.exists()
    ? { finalExpr: '', rulesText: '', ...snap.data() }
    : { scale: courseScale || uniScale, finalExpr: '', rulesText: '' };

  if (!snap.exists()) {
    await setDoc(gRef, fromFirestore);
    if (courseIdAtLoad !== currentCourseId) return;
  }

  // ✅ Aplicar escala siempre (no es editable por el usuario en tiempo real)
  header.scale = fromFirestore.scale || courseScale || uniScale;

  // ✅ Solo aplicar finalExpr desde Firestore si el input NO cambió desde que arrancamos
  const exprNow = $('gr-finalExpr')?.value ?? null;
  const rulesNow = $('gr-rulesText')?.value ?? null;

  const userEditedExpr  = (exprNow !== exprAtStart);
  const userEditedRules = (rulesNow !== rulesAtStart);

  if (!userEditedExpr) {
    header.finalExpr = fromFirestore.finalExpr || '';
    const exprEl = $('gr-finalExpr');
    if (exprEl) exprEl.value = header.finalExpr;
  }
  // Si el usuario editó, header.finalExpr ya fue actualizado por el listener — no tocar

  if (!userEditedRules) {
    header.rulesText = fromFirestore.rulesText || '';
    const rt = $('gr-rulesText');
    if (rt) rt.value = header.rulesText;
  }

  // Coherencia de escala
  let expected = courseScale || uniScale;
  if (header.scale !== expected) {
    header.scale = expected;
    await updateDoc(gRef, { scale: header.scale });
    if (courseIdAtLoad !== currentCourseId) return;
  }


  $('gr-activeSemLabel') && ($('gr-activeSemLabel').textContent = state.activeSemesterData?.label || '—');
  const scaleSel = $('gr-scaleSel');
  if (scaleSel) scaleSel.value = header.scale || 'USM';

  _courseHeaderCache.set(courseIdAtLoad, { ...header });

// solo recalcular si seguimos en el mismo ramo
if (courseIdAtLoad === currentCourseId) {
  computeAndRender();
}
}

// =================== REEMPLAZA saveExpr ===================
// Fix: sincroniza header.finalExpr desde el INPUT (no desde la variable),
// y siempre recalcula si es el ramo activo.

async function saveExpr(courseIdOverride = null, exprOverride = undefined){
  const courseId = typeof courseIdOverride === 'string' ? courseIdOverride : currentCourseId;
  if (!(state.currentUser && state.activeSemesterId && courseId)) return;

  const el  = $('gr-finalExpr');
  const raw = String(exprOverride !== undefined ? exprOverride : (el?.value || '')).trim();
  const expr = normalizeExpr(raw) || null;

  // ✅ Siempre actualizar header en memoria si es el ramo visible
  if (courseId === currentCourseId) {
    header.finalExpr = expr || '';
    // Actualizar caché también
    _courseHeaderCache.set(courseId, { ...header });
  }

  const ref = doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', courseId,
    'grading', 'meta'
  );

  await setDoc(ref, { finalExpr: expr }, { merge: true });

  // ✅ Recalcular siempre que sea el ramo activo
  if (courseId === currentCourseId) {
    invalidateCrossFinalCourse(courseId);
    computeAndRender();
    rebuildCrossFinals().then(() => {
      if (courseId === currentCourseId) computeAndRender();
    }).catch(() => {});
  }
}


// =================== REEMPLAZA saveRules ===================
// Fix: mismo patrón que saveExpr — sincroniza y recalcula en vivo.

async function saveRules(courseIdOverride = null, rulesTextOverride = undefined){
  const courseId = typeof courseIdOverride === 'string' ? courseIdOverride : currentCourseId;
  if (!(state.currentUser && state.activeSemesterId && courseId)) return;

  const rawRules = rulesTextOverride !== undefined
    ? String(rulesTextOverride)
    : String($('gr-rulesText')?.value || '');
  const txt = rawRules.trim() || null;

  // ✅ Siempre actualizar header en memoria si es el ramo visible
  if (courseId === currentCourseId) {
    header.rulesText = txt || '';
    _courseHeaderCache.set(courseId, { ...header });
  }

  const ref = doc(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', courseId,
    'grading', 'meta'
  );

  if (courseId === currentCourseId) setRulesSaveStatus('Guardando…', 'saving');

  try {
    await setDoc(ref, { rulesText: txt }, { merge: true });

    // Las reglas no cambian las notas finales cruzadas, así que no releemos otros ramos.
    if (courseId === currentCourseId) {
      computeAndRender();
      setRulesSaveStatus('Reglas guardadas ✓', 'saved');
    }
  } catch (err) {
    if (courseId === currentCourseId) {
      setRulesSaveStatus('No se pudieron guardar las reglas.', 'error');
    }
    throw err;
  }
}

/* =================== Componentes =================== */


async function watchComponents(courseIdOverride = currentCourseId) {
  if (unsubComp) { unsubComp(); unsubComp = null; }

  if (!(state.currentUser && state.activeSemesterId && courseIdOverride)) {
    components = [];
    renderComponents([]);
    return;
  }

  // ✅ Si hay caché, pintarla YA (sin esperar Firestore)
  const cached = _courseComponentsCache.get(courseIdOverride);
  if (cached && cached.length) {
    components = cached.map(x => ({ ...x }));
    renderComponents(components);
    computeAndRender();
  }

  const ref = collection(
    db,
    'users', state.currentUser.uid,
    'semesters', state.activeSemesterId,
    'courses', courseIdOverride,
    'grading', 'meta',
    'components'
  );

  unsubComp = onSnapshot(
    query(ref, orderBy('createdAt', 'asc')),
    async (snap) => {
      if (courseIdOverride !== currentCourseId) return;

      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Migración de order en background (no bloquea render)
      const needsOrder = list.filter(x => typeof x.order !== 'number');
      if (needsOrder.length) {
        import('firebase/firestore')
          .then(async ({ writeBatch }) => {
            const batch = writeBatch(db);
            const base = Date.now();
            needsOrder.forEach((item, i) => {
              batch.update(
                doc(db, 'users', state.currentUser.uid,
                  'semesters', state.activeSemesterId,
                  'courses', courseIdOverride,
                  'grading', 'meta', 'components', item.id),
                { order: base + i }
              );
            });
            try { await batch.commit(); } catch (_) {}
          });
      }

      list.sort((a, b) => {
        const ao = (typeof a.order === 'number') ? a.order : 9e15;
        const bo = (typeof b.order === 'number') ? b.order : 9e15;
        if (ao !== bo) return ao - bo;
        const at = a.createdAt?.toMillis?.() ?? 0;
        const bt = b.createdAt?.toMillis?.() ?? 0;
        return at - bt;
      });

      components = list;
      _courseComponentsCache.set(courseIdOverride, list.map(x => ({ ...x })));

      await renderComponents(list);
      computeAndRender();

      // Solo invalida el ramo que cambió; el resto permanece en caché.
      invalidateCrossFinalCourse(courseIdOverride);

      // cross-finals en background, no bloquea el render inicial
      rebuildCrossFinals().then(() => {
        if (courseIdOverride === currentCourseId) computeAndRender();
      });
    },
    (err) => {
      console.error('watchComponents error:', err);
      if (courseIdOverride === currentCourseId) renderComponents([]);
    }
  );
}


async function addEvalFromForm(){
  if (!readyPath()) {
    alert('Selecciona un semestre y un ramo.');
    return;
  }

  const nameEl = $('gr-evalName');
  const codeEl = $('gr-evalCode');
  const scoreEl = $('gr-evalScore');

  const name = (nameEl?.value || '').trim();
  let   key  = (codeEl?.value || '').trim();
  const scoreRaw = scoreEl?.value ?? '';

  if (!name) { alert('Escribe un nombre.'); return; }
  if (!key)  { alert('Escribe un código (ej: C1, T1...).'); return; }

  // normaliza código (A–Z, 0–9, _), máx 16
  key = key.replace(/\s+/g,'').replace(/[^A-Za-z0-9_]/g,'').slice(0,16);
  if (!key) { alert('Código inválido.'); return; }

  // evitar choque con existentes
  key = ensureUniqueKey(key, components);

  // escala para límites
  const isMayor = (header.scale === 'MAYOR');
  const min = isMayor ? 1   : 0;
  const max = isMayor ? 7   : 100;
  const v   = parseFloat(String(scoreRaw).replace(',','.'));
  const score = isNaN(v) ? null : clamp(v, min, max);

  await addDoc(componentsColRef(), {
    key,
    name,
    score,
    createdAt: serverTimestamp(),
    order: Date.now()
  });

  // limpiar formulario
  if (nameEl)  nameEl.value  = '';
  if (codeEl)  codeEl.value  = '';
  if (scoreEl) scoreEl.value = '';

  // onSnapshot refresca lista y cálculo
}


async function _addComponentPrompt(){
  if (!readyPath()) return;

  const name = prompt('Nombre del componente (ej: "Presentación Individual 1"):\nSe generará una abreviación para la fórmula.');
  if (!name) return;

  let key = makeAbbrev(name);
  key = ensureUniqueKey(key, components);

  const custom = prompt(`Abreviación sugerida: ${key}\nSi quieres otra, escríbela (A–Z, 0–9 y _). Deja vacío para aceptar.`, '');
  const finalKey = sanitizeKey(custom?.trim() || key);
  if (!finalKey) return;

  await addDoc(componentsColRef(), {
    key: finalKey,
    name: name.trim(),
    score: null,
    createdAt: serverTimestamp()

  });
  // onSnapshot actualiza la UI
}

/* Abreviación: “Presentación Individual 1” → “PI1”; “Tarea 2” → “T2” */
function makeAbbrev(name){
  const words = name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/).filter(Boolean);

  let letters = words.map(w => w[0]).join('').toUpperCase();
  if (!letters) letters = (name.slice(0,2) || 'X').toUpperCase();

  const nums = (name.match(/\d+/g) || []).join('');
  return letters + nums;
}
function sanitizeKey(k){
  return (k || '')
    .replace(/\s+/g, '')
    .replace(/[^A-Za-z0-9_]/g, '')
    .slice(0, 16);
}
function ensureUniqueKey(base, comps){
  const taken = new Set((comps||[]).map(c => (c.key||'').toLowerCase()));
  let k = sanitizeKey(base) || 'X';
  if (!taken.has(k.toLowerCase())) return k;
  let i = 2;
  while (taken.has((k+i).toLowerCase())) i++;
  return k + i;
}

async function _normalizeCreatedAtOnce(refColSnap){
  const ops = [];
  for (const d of refColSnap.docs){
    const data = d.data() || {};
    const ca = data.createdAt;
    const isTS = ca && typeof ca.toDate === 'function'; // Firestore Timestamp
    if (!isTS){
      ops.push(updateDoc(doc(componentsColRef(), d.id), { createdAt: serverTimestamp() }));
    }
  }
  if (ops.length) {
    try { await Promise.all(ops); } catch(_) {}
  }
}


async function renderComponents(list = []) {
  const host = $('gr-evalsList');
  if (!host) return;

  // 🔹 Guardar valores locales escritos pero aún no guardados
  const localValues = {};
  host.querySelectorAll('.grade-item').forEach(item => {
    const code = item.querySelector('code')?.textContent?.trim();
    const inp = item.querySelector('[data-f="score"]');
    if (code && inp && inp.value) {
      localValues[code] = inp.value;
    }
  });

  // 🔹 Guardar qué grupos estaban abiertos antes del re-render
  const prevOpen = new Set(
    Array.from(host.querySelectorAll('details.grade-group[open]')).map(d => d.dataset.key)
  );

  host.innerHTML = '';

  if (!currentCourseId) {
    host.innerHTML = `<div class="muted">Selecciona un ramo.</div>`;
    return;
  }
  if (!list.length) {
    host.innerHTML = `<div class="muted">Aún no hay evaluaciones. Usa “Agregar evaluación”.</div>`;
    return;
  }

  const isMayor = (header.scale === 'MAYOR');
  const min  = isMayor ? 1 : 0;
  const max  = isMayor ? 7 : 100;
  const step = isMayor ? 0.1 : 1;

  // ───────────────── Toolbar para carpetas ─────────────────
  const toolbar = document.createElement('div');
  toolbar.className = 'row';
  toolbar.style.justifyContent = 'space-between';
  toolbar.style.alignItems = 'center';
  toolbar.style.marginBottom = '6px';

  const label = document.createElement('div');
  label.className = 'muted';
  label.textContent = 'Carpetas de evaluaciones';

  const addBtn = document.createElement('button');
  addBtn.id = 'gr-addGroup';
  addBtn.className = 'ghost';
  addBtn.textContent = 'Agregar carpeta';
  addBtn.addEventListener('click', () => { addCustomGroup().then(() => renderComponents(components)); });

  toolbar.appendChild(label);
  toolbar.appendChild(addBtn);
  host.appendChild(toolbar);

  // ───────────────── Meta de grupos ─────────────────
  const rawMeta      = _groupNamesCache || {};
  const customGroups = getCustomGroups();           // [{key,label,keyword}, ...]
  const customKeys   = new Set(customGroups.map(g => g.key));

  const defaultNames = {
    certamenes:   'Certámenes',
    controles:    'Controles',
    tareas:       'Tareas',
    proyecto:     'Proyecto',
    evaluaciones: 'Evaluaciones',
    experiencias: 'Experiencias',
    preinformes:  'Pre-informes',
    informes:     'Informes',
    laboratorios: 'Laboratorios',
    otros:        'Otros'
  };

  // Los nombres por defecto se extienden con las carpetas personalizadas
  customGroups.forEach(g => {
    defaultNames[g.key] = g.label || g.key;
  });

  const names = { ...defaultNames, ...rawMeta };

  const grupos = {};
  const asignados = new Set();  // ids de componentes ya asignados a alguna carpeta
  const normName = (c) => (c.name || '').toString();

  // ───── 2.1 Carpetas personalizadas primero ─────
  customGroups.forEach(g => {
    const kw = (g.keyword || g.pattern || g.label || '').trim();
    if (!kw) return;
    const safe = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(safe, 'i');

    const items = list.filter(c => !asignados.has(c.id) && re.test(normName(c)));
    if (items.length) {
      grupos[g.key] = items;
      items.forEach(it => asignados.add(it.id));
    }
  });

  // ───── 2.2 Carpetas base (certámenes, controles, etc.) ─────
  const baseDefs = {
    certamenes:   c => /certamen/i.test(normName(c)),
    controles:    c => /control/i.test(normName(c)),
    tareas:       c => /tarea/i.test(normName(c)),
    proyecto:     c => /proy|proyecto/i.test(normName(c)),
    evaluaciones: c => /evaluaci[oó]n/i.test(normName(c)),
    experiencias: c => /experien/i.test(normName(c)),
    preinformes:  c => /pre[\s-]?informe/i.test(normName(c)),
    informes:     c => /\binforme/i.test(normName(c)) && !/pre[\s-]?informe/i.test(normName(c)),
    laboratorios: c => /laboratorio|\blab/i.test(normName(c))
  };

  for (const [key, fn] of Object.entries(baseDefs)) {
    const items = list.filter(c => !asignados.has(c.id) && fn(c));
    if (items.length) {
      grupos[key] = items;
      items.forEach(it => asignados.add(it.id));
    }
  }

  // ───── 2.3 Carpeta "Otros" para lo que quede ─────
  const otros = list.filter(c => !asignados.has(c.id));
  if (otros.length) grupos.otros = otros;

  // ───────────────── Render de grupos ─────────────────
  for (const [key, items] of Object.entries(grupos)) {
    if (!items.length) continue;

    const details = document.createElement('details');
    details.className = 'grade-group';
    details.dataset.key = key;
    if (prevOpen.has(key)) details.open = true;  // restaurar estado

    const summary = document.createElement('summary');
    summary.style.display = 'flex';
    summary.style.alignItems = 'center';
    summary.style.justifyContent = 'space-between';
    summary.style.width = '100%';
    summary.style.cursor = 'pointer';

    const title = names[key] || defaultNames[key] || key;
    const titleSpan = document.createElement('span');
    titleSpan.style.fontWeight = '700';
    titleSpan.textContent = `${title} (${items.length})`;

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.alignItems = 'center';
    actions.style.gap = '4px';

    // ✎ botón renombrar (sirve para base y personalizadas)
    const editBtn = document.createElement('button');
    editBtn.dataset.rename = key;
    editBtn.className = 'ghost';
    editBtn.textContent = '✎';
    Object.assign(editBtn.style, {
      fontSize: '0.9em',
      opacity: '0.8',
      flexShrink: '0'
    });

    actions.appendChild(editBtn);

if (customKeys.has(key)) {
  const delBtn = document.createElement('button');
  delBtn.dataset.deleteGroup = key;
  delBtn.className = 'ghost';
  delBtn.textContent = '🗑';
  Object.assign(delBtn.style, {
    fontSize: '0.9em',
    opacity: '0.8',
    flexShrink: '0'
  });

  delBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const curName = names[key] || key;

    // 🛑 Nuevo mensaje: se borra TODO lo que está dentro
    if (!confirm(`¿Eliminar la carpeta “${curName}” y TODAS las evaluaciones que contiene? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      // 🔥 Borrar todas las evaluaciones de ESA carpeta para siempre
      const { writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(db);

      // "items" es el arreglo de componentes que están dentro de este grupo
      items.forEach(c => {
        batch.delete(doc(componentsColRef(), c.id));
      });

      await batch.commit();

      // 🗂 Luego borramos la carpeta personalizada del meta
      await deleteCustomGroup(key);
      await loadGroupNames();   // recargar meta

      // El onSnapshot de watchComponents se encargará de refrescar "components",
      // pero por seguridad re-renderizamos con el array actual
      renderComponents(components);
    } catch (err) {
      console.error('Error borrando carpeta y evaluaciones:', err);
      alert('No se pudo borrar la carpeta. Inténtalo de nuevo.');
    }
  });

  actions.appendChild(delBtn);
}


    summary.appendChild(titleSpan);
    summary.appendChild(actions);
    details.appendChild(summary);

    const groupContainer = document.createElement('div');

    // ───── Items de la carpeta ─────
    items.forEach(c => {
      const card = document.createElement('div');
      card.className = 'grade-item';
      card.dataset.id = c.id;
      card.draggable = true;

      card.innerHTML = `
        <div style="flex:1">
          <div class="gr-name" style="font-weight:700">${esc(c.name || c.key)}</div>
          <div class="muted">Código: <code class="gr-code">${esc(c.key)}</code></div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <input data-f="score" type="number" step="${step}" min="${min}" max="${max}"
                 value="${localValues[c.key] ?? c.score ?? ''}" style="width:110px"/>
          <button data-act="save" class="btn btn-secondary">Guardar</button>
          <button data-act="edit" class="btn btn-secondary">Editar</button>
          <button data-act="cancelEdit" class="btn btn-secondary" style="display:none">Cancelar</button>
          <button data-act="del"  class="btn btn-secondary">Eliminar</button>
        </div>
      `;

      // Evitar que inputs/botones corten el drag
      card.querySelectorAll('input,button,select,textarea').forEach(x => {
        x.setAttribute('draggable','false');
      });

      // 🔹 Lógica de botones (reuso lo que ya tenías)
      card.addEventListener('click', async (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;

        // EDITAR nombre/código
        if (t.dataset.act === 'edit') {
          const nameEl = card.querySelector('.gr-name');
          const codeEl = card.querySelector('.gr-code');

          const nameVal = nameEl?.textContent?.trim() || c.name || '';
          const codeVal = codeEl?.textContent?.trim() || c.key || '';

          nameEl.innerHTML = `<input data-f="edit-name" type="text" value="${esc(nameVal)}"
                               style="width:100%;max-width:320px">`;
          codeEl.parentElement.innerHTML =
            `Código: <input data-f="edit-code" type="text" value="${esc(codeVal)}"
                            style="width:120px">`;

          card.querySelector('[data-act="edit"]').style.display = 'none';
          card.querySelector('[data-act="cancelEdit"]').style.display = '';
          return;
        }

        // CANCELAR edición
        if (t.dataset.act === 'cancelEdit') {
          renderComponents(components);
          return;
        }

        // GUARDAR (nota o nombre/código)
        if (t.dataset.act === 'save') {
          const nameInp = card.querySelector('[data-f="edit-name"]');
          const codeInp = card.querySelector('[data-f="edit-code"]');

          // Si hay edición de nombre/código
          if (nameInp || codeInp) {
            const newNameRaw = nameInp ? nameInp.value : (c.name || c.key);
            const newCodeRaw = codeInp ? codeInp.value : c.key;

            const newName = (newNameRaw || '').trim();
            let newKey = (newCodeRaw || '').trim();

            if (!newName) { alert('Escribe un nombre.'); return; }
            newKey = sanitizeKey(newKey);
            if (!newKey) { alert('Código inválido. Usa A–Z, 0–9 o _.'); return; }

            const taken = new Set(components.filter(x => x.id !== c.id)
                                  .map(x => (x.key || '').toLowerCase()));
            if (taken.has(newKey.toLowerCase())) {
              alert(`El código ${newKey} ya existe en este ramo.`);
              return;
            }

            const ref = doc(componentsColRef(), c.id);

            // Si cambió la key → actualizar fórmula y reglas
            if (newKey !== c.key) {
              const newExpr  = replaceTokenWord(header.finalExpr || '',  c.key, newKey);
              const newRules = replaceTokenWord(header.rulesText || '', c.key, newKey);
              await updateDoc(gradingDocRef(), {
                finalExpr: newExpr || null,
                rulesText: newRules || null
              });
              header.finalExpr = newExpr || '';
              header.rulesText = newRules || '';
            }

            await updateDoc(ref, { name: newName, key: newKey });
            invalidateCrossFinalCourse(currentCourseId);
            await rebuildCrossFinals();
            computeAndRender();
            renderComponents(components);
            return;
          }

          // Solo guardar la nota
          const inp = card.querySelector('[data-f="score"]');
          let v = parseFloat(inp.value);
const score = isNaN(v) ? null : clamp(v, min, max);

await updateDoc(doc(componentsColRef(), c.id), { score });

// ✅ actualizar también el estado local antes de recalcular
const idx = components.findIndex(x => x.id === c.id);
if (idx >= 0) {
  components[idx].score = score;
}

t.textContent = 'Guardado ✓';
computeAndRender();
setTimeout(() => t.textContent = 'Guardar', 1200);
return;
        }

        // ELIMINAR evaluación
        if (t.dataset.act === 'del') {
          if (!confirm(`Eliminar “${c.name || c.key}”?`)) return;
          await deleteDoc(doc(componentsColRef(), c.id));
          return;
        }
      });

      groupContainer.appendChild(card);
    });

    details.appendChild(groupContainer);
    host.appendChild(details);

    enableDnDForGrades(groupContainer);

    // 🔹 Renombrar grupo
    editBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const curName = names[key] || defaultNames[key] || key;
      const newName = prompt(`Nuevo nombre para “${curName}”:`, curName);
      if (!newName || newName.trim() === curName) return;

      try {
        await saveGroupName(key, newName.trim());

        // si es personalizada, actualiza también la estructura __custom
        if (customKeys.has(key)) {
          const raw = _groupNamesCache || {};
          const custom = getCustomGroups().map(g =>
            g.key === key ? { ...g, label: newName.trim() } : g
          );
          const payload = { ...raw, [key]: newName.trim(), __custom: custom };
          await setDoc(groupsDocRef(), payload, { merge:true });
          _groupNamesCache = payload;
        }

        renderComponents(components);
      } catch {
        alert('No se pudo guardar el nuevo nombre.');
      }
    });
  }
}

// helper dentro del archivo (lo usas en renderComponents)
function replaceTokenWord(text, from, to) {
  if (!text) return text;
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${escRe(from)}\\b`, 'g');
  return text.replace(re, to);
}


// =================== REEMPLAZA computeAndRender ===================

function computeAndRender(){
  // ✅ Leer desde DOM solo si el elemento existe Y tiene contenido relevante
  // Si el elemento no existe, usar header como fallback (no pisarlo con '')
  const exprEl  = $('gr-finalExpr');
  const rulesEl = $('gr-rulesText');

 if (exprEl) {
  header.finalExpr = normalizeExpr(exprEl.value || '');
}
if (rulesEl) {
  header.rulesText = rulesEl.value || '';
}

if (currentCourseId) {
  const prev = _courseHeaderCache.get(currentCourseId) || {};
  _courseHeaderCache.set(currentCourseId, {
    ...prev,
    ...header
  });
}

  const liveExpr  = header.finalExpr  || '';
  const liveRules = header.rulesText  || '';

  const values = {};
  const min = header.scale === 'MAYOR' ? 1 : 0;
  const max = header.scale === 'MAYOR' ? 7 : 100;

  components.forEach(c => {
    if (typeof c.score === 'number'){
      values[c.key] = clamp(c.score, min, max);
    }
  });

  if (window.courseAttendance && currentCourseId in window.courseAttendance) {
    values.Asistencia = window.courseAttendance[currentCourseId];
  } else {
    values.Asistencia = 0;
  }

  let final;
  let lastErr = '';

 if (liveExpr.trim() !== '') {
  try {
    final = safeEvalExpr(liveExpr, values, {
      avg, min: Math.min, max: Math.max,
      final:     (name) => lookupFinalByName(name),
      finalCode: (code) => lookupFinalByCode(code),
      finalId:   (id)   => lookupFinalById(id)
    });

    if (typeof final === 'number' && isFinite(final)){
      final = truncate(final, header.scale);
    } else {
      final = null;
    }

  } catch(e) {
    lastErr = e?.message || String(e || '');
    final = null;
  }

} else {
  // 🔥 ESTO FALTABA
  final = null;
}

  const rulesStatusEl = $('gr-rulesStatus');
  if (rulesStatusEl) rulesStatusEl.dataset.formulaError = lastErr;

  const thr = (header.scale === 'MAYOR') ? 3.95 : 54.5;

  const rules = parseRules(liveRules);
  const rulesEval = evaluateRules(rules, values);

  const status = final == null
    ? (rulesEval.allOk ? '—' : 'Reprueba')
    : ((final >= thr && rulesEval.allOk) ? 'Aprueba' : 'Reprueba');

  let needed;
  if (final == null){
    needed = 'Ingresa notas o completa la fórmula.';
  } else if (status === 'Aprueba'){
    needed = 'Nada más. Ya alcanzas la nota y cumples las reglas.';
  } else {
    const parts = [];
    if (final < thr){
      const diff = thr - final;
      parts.push(
        (header.scale === 'MAYOR')
          ? `Subir la nota final en ${diff.toFixed(2)} pts.`
          : `Subir la nota final en ${diff.toFixed(1)} pts.`
      );
    }
    if (!rulesEval.allOk){
      const msgs = rulesEval.unmet.map(u => `Cumplir: ${u.text}.`);
      parts.push(...msgs);
    }
    needed = parts.join(' ');
  }

  renderRulesStatus(rulesEval);
  renderResult({ final, thr, status, needed });
}



async function rebuildCrossFinals(){
  const semesterKey = currentCrossFinalsSemesterKey();

  if (!state.currentUser || !state.activeSemesterId) {
    resetCrossFinalsCache();
    return;
  }

  if (_crossFinalsSemesterKey !== semesterKey) {
    resetCrossFinalsCache();
  }

  // Si ya hay una reconstrucción en curso, reutilizamos la misma promesa.
  if (_crossFinalsBuildPromise) {
    return _crossFinalsBuildPromise;
  }

  const uid = state.currentUser.uid;
  const semId = state.activeSemesterId;
  const courses = Array.isArray(state.courses) ? [...state.courses] : [];

  _crossFinalsBuildPromise = (async () => {
    const loadCourseFinal = async (c) => {
      const cached = _crossFinalCourseCache.get(c.id);
      if (cached) return { course: c, ...cached };

      try {
        let meta = _courseHeaderCache.get(c.id) || null;
        let comps = _courseComponentsCache.get(c.id) || null;

        const tasks = [];

        if (!meta) {
          tasks.push(
            getDoc(doc(
              db,'users',uid,'semesters',semId,
              'courses',c.id,'grading','meta'
            )).then(snap => {
              meta = snap.exists()
                ? snap.data()
                : { scale:'USM', finalExpr:'', rulesText:'' };
              _courseHeaderCache.set(c.id, { ...meta });
            })
          );
        }

        if (!comps) {
          tasks.push(
            getDocs(collection(
              db,'users',uid,'semesters',semId,
              'courses',c.id,'grading','meta','components'
            )).then(snap => {
              comps = snap.docs.map(d => ({ id:d.id, ...d.data() }));
              _courseComponentsCache.set(c.id, comps.map(x => ({ ...x })));
            })
          );
        }

        if (tasks.length) await Promise.all(tasks);

        meta = meta || { scale:'USM', finalExpr:'' };
        comps = Array.isArray(comps) ? comps : [];

        const values = {};
        const min = meta.scale === 'MAYOR' ? 1 : 0;
        const max = meta.scale === 'MAYOR' ? 7 : 100;

        for (const k of comps) {
          if (typeof k.score === 'number' && isFinite(k.score)) {
            values[k.key] = Math.max(min, Math.min(max, k.score));
          }
        }

        let final = null;
        if ((meta.finalExpr || '').trim()) {
          try {
            final = safeEvalExpr(meta.finalExpr, values, {
              avg,
              min: Math.min,
              max: Math.max,
              final: () => NaN,
              finalCode: () => NaN,
              finalId: () => NaN
            });

            if (typeof final === 'number' && isFinite(final)) {
              final = truncate(final, meta.scale);
            } else {
              final = null;
            }
          } catch {
            final = null;
          }
        }

        const entry = { final, scale: meta.scale || 'USM' };
        _crossFinalCourseCache.set(c.id, entry);
        return { course: c, ...entry };
      } catch {
        const entry = { final: null, scale: 'USM' };
        _crossFinalCourseCache.set(c.id, entry);
        return { course: c, ...entry };
      }
    };

    // Las lecturas faltantes se hacen en paralelo, y solo para ramos sin caché.
    const results = await Promise.all(courses.map(loadCourseFinal));

    // Descarta una respuesta vieja si el usuario cambió de semestre mientras cargaba.
    if (currentCrossFinalsSemesterKey() !== semesterKey) return;

    const next = { byName:{}, byCode:{}, byId:{} };

    for (const item of results) {
      const c = item.course;
      const payload = { final:item.final, scale:item.scale, id:c.id };
      const nameKey = normStr(c.name);
      const codeKey = normStr(c.code);

      if (nameKey) next.byName[nameKey] = payload;
      if (codeKey) next.byCode[codeKey] = payload;
      next.byId[c.id] = payload;
    }

    crossFinals = next;
  })();

  try {
    await _crossFinalsBuildPromise;
  } finally {
    _crossFinalsBuildPromise = null;
  }
}


/* ======= Reglas: parsing + evaluación ======= */

function parseRules(text){
  const lines = (text || '').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  return lines;
}

function evaluateRules(lines, vars, fns){
  const res = { allOk: true, items: [], unmet: [] };
  for (const line of lines){
    const parsed = parseComparison(line);
    if (!parsed){
      res.items.push({ text: line, ok: false, reason: 'inválida' });
      res.unmet.push({ text: line, kind: 'invalid' });
      res.allOk = false;
      continue;
    }
    const { left, op, right } = parsed;
    let lv;
    let rv;
    let ok;
    try{
      
      const baseFns = { avg, min: Math.min, max: Math.max,
        final: lookupFinalByName, finalCode: lookupFinalByCode, finalId: lookupFinalById };
      const useFns = { ...baseFns, ...(fns || {}) };

// 🔹 Asegurar que Asistencia esté disponible también dentro de las reglas
if (window.courseAttendance && currentCourseId in window.courseAttendance) {
  vars.Asistencia = window.courseAttendance[currentCourseId];
} else if (!('Asistencia' in vars)) {
  vars.Asistencia = 0;
}

// Permitir expresiones con "%", ej. "Asistencia >= 55%"
const cleanLeft  = left.replace(/%/g, '');
const cleanRight = right.replace(/%/g, '');


     lv = safeEvalExpr(cleanLeft,  vars, useFns);
rv = safeEvalExpr(cleanRight, vars, useFns);


      ok = compare(lv, op, rv);
    }catch{
      ok = false;
    }
    res.items.push({ text: line, ok, left: lv, op, right: rv });
    if (!ok){
      res.unmet.push({ text: line, kind: 'cmp', left: lv, op, right: rv });
      res.allOk = false;
    }
  }
  return res;
}

// Soporta operadores: >=, <=, >, <, ==, !=
function parseComparison(s){
  const m = s.match(/^(.*?)(>=|<=|==|!=|>|<)(.*)$/);
  if (!m) return null;
  return { left: normalizeExpr(m[1].trim()), op: m[2], right: normalizeExpr(m[3].trim()) };
}

function compare(a, op, b) {
  if (!(isFinite(a) && isFinite(b))) return false;

  // 🔹 Redondear a 1 decimal para seguridad y luego al entero más cercano
  const A = Math.round((Math.round(a * 10) / 10));
  const B = Math.round((Math.round(b * 10) / 10));

  switch (op) {
    case '>=': return A >= B;
    case '<=': return A <= B;
    case '>':  return A >  B;
    case '<':  return A <  B;
    case '==': return A === B;
    case '!=': return A !== B;
    default: return false;
  }
}



// Reemplaza la versión antigua
// ✅ Corrige el cálculo promedio con múltiples argumentos
function avg(...args) {
  const nums = args
    .map(x => (typeof x === 'number' && isFinite(x)) ? x : Number(x))
    .filter(x => !isNaN(x));

  if (!nums.length) return NaN;
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}



/* ======= Resultado ======= */

function renderRulesStatus(r){
  const el = $('gr-rulesStatus');
  if (!el) return;
  if (!r || !r.items.length){
    el.textContent = 'No hay reglas definidas.';
    return;
  }
  const okCount = r.items.filter(x=>x.ok).length;
  const parts = r.items.map(x => x.ok ? `✅ ${esc(x.text)}` : `❌ ${esc(x.text)}`);
  el.innerHTML = `<div><b>Reglas:</b> ${okCount}/${r.items.length} cumplidas</div><div style="margin-top:4px">${parts.join('<br/>')}</div>`;
}

function renderResult(res){
  const finals = [$('gr-currentFinal'), $('gr-currentAvg')].filter(Boolean);
  const statuses = [$('gr-status')].filter(Boolean);
  const needs = [$('gr-needed'), $('gr-neededToPass')].filter(Boolean);

  if (!finals.length && !statuses.length && !needs.length) return;

  if (!res){
    finals.forEach(el => el.textContent = '');
    statuses.forEach(el => el.textContent = '');
    needs.forEach(el => el.textContent = '');
    return;
  }

  const scale = header?.scale || 'USM';
  const shown = (res.final == null) ? '' : truncate(res.final, scale).toString();
  const statusText = res.status ?? '';
  const neededText = res.needed ?? '';

  finals.forEach(el => el.textContent = shown);
  statuses.forEach(el => el.textContent = statusText);
  needs.forEach(el => el.textContent = neededText);
}



/* =================== Helpers =================== */
/* =======================================================
   DRAG & DROP – Reordenar evaluaciones (sin pérdida)
   ======================================================= */
let _dragState = { id: null, fromIndex: -1 };

export function enableDnDForGrades(host) {
  if (!host) return;

  host.querySelectorAll('.grade-item').forEach(el => {
    el.draggable = true;
    // Evitar que inputs o botones interrumpan el drag
    el.querySelectorAll('input,button,select,textarea').forEach(x => {
      x.setAttribute('draggable', 'false');
    });
  });

  host.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.grade-item');
    if (!item) return;

    // 🔹 Estas dos líneas son esenciales para que NO aparezca el símbolo prohibido
    e.dataTransfer.setData('text/plain', item.dataset.id || ''); 
    e.dataTransfer.effectAllowed = 'move';

    item.classList.add('dragging');
    _dragState.id = item.dataset.id;
    _dragState.fromIndex = [...host.children].indexOf(item);
  });

  host.addEventListener('dragend', () => {
    const dragging = host.querySelector('.grade-item.dragging');
    dragging?.classList.remove('dragging');
    _dragState = { id: null, fromIndex: -1 };
  });

  // 🔹 dragover debe prevenir y establecer dropEffect
  host.addEventListener('dragover', (e) => {
    e.preventDefault();                    // 👈 permite el drop
    e.dataTransfer.dropEffect = 'move';    // 👈 muestra el cursor correcto
    const dragging = host.querySelector('.grade-item.dragging');
    if (!dragging) return;
    const after = getDragAfterElement(host, e.clientY);
    if (after == null) host.appendChild(dragging);
    else host.insertBefore(dragging, after);
  }, { capture: true });

  host.addEventListener('drop', async (e) => {
    e.preventDefault(); // 👈 imprescindible
    const ids = [...host.querySelectorAll('.grade-item')].map(el => el.dataset.id);
    await persistNewOrder(ids);
  });
}

function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll('.grade-item:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - (box.top + box.height / 2);
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

// 🔹 Guarda el nuevo orden en Firestore (sin eliminar nada)
async function persistNewOrder(ids) {
  if (!readyPath() || !Array.isArray(ids) || !ids.length) return;
  const { writeBatch } = await import('firebase/firestore');
  const batch = writeBatch(db);
  let base = Date.now();
  const step = 1000;
  ids.forEach((id, i) => {
    const ref = doc(componentsColRef(), id);
    batch.update(ref, { order: base + i * step });
  });
  try { await batch.commit(); }
  catch (err) { console.warn('Error al guardar orden:', err); }
}


// ====== SIMULADOR: helpers ======
// Reemplaza la versión anterior
function gr_getFormulaStr() {
  return (document.getElementById('gr-finalExpr')?.value || '').trim();
}

function gr_readRulesText() {
  return (document.getElementById('gr-rulesText')?.value || '').trim();
}
function _gr_parseRulesArr() {
  const t = gr_readRulesText();
  if (!t) return [];
  return t.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

// Intenta leer evaluaciones + notas actuales desde la UI de Notas.
// Ajusta los selectores si tus inputs usan otros ids/clases.
function _gr_collectEvaluationsFromUI() {
  // Esperamos filas con inputs de Código y Nota (ej. "C1" y "62" o "5.5")
  // Fallback genérico:
  const rows = Array.from(document.querySelectorAll('[data-gr-eval-row], .gr-eval-row'));
  const list = [];
  if (rows.length) {
    rows.forEach(r => {
      const code = r.querySelector('[data-code], .gr-code, input[placeholder*="C1"], input[placeholder*="T1"]')?.value?.trim() || '';
      const name = r.querySelector('[data-name], .gr-name, input[placeholder*="Certamen"], input[placeholder*="Proyecto"]')?.value?.trim() || '';
      const gradeRaw = r.querySelector('[data-grade], .gr-grade, input[placeholder*="62"], input[placeholder*="5.5"]')?.value?.trim() || '';
      const g = gradeRaw ? Number(gradeRaw.replace(',', '.')) : null;
      if (code) list.push({ code, name: name || code, grade: (Number.isFinite(g) ? g : null) });
    });
  }
  // Si tu módulo ya tiene un modelo JS de evaluaciones, reemplaza este lector por ese arreglo.
  return list;
}



function debounce(fn, ms){
  let t = null;
  return (...args)=>{
    if (t) clearTimeout(t);
    t = setTimeout(()=> fn(...args), ms);
  };
}


function readyPath(){
  return !!(state.currentUser && state.activeSemesterId && currentCourseId);
}
function _parseMaybe(x){
  const v = parseFloat(x); return isNaN(v)? null : v;
}
function esc(s){ return (s??'').toString().replace(/[<>&"]/g, m=>({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' }[m])); }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

/* ---------- Fórmulas ---------- */

function normalizeExpr(expr){
  if (!expr) return '';
  let s = String(expr).trim();
  s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"); // tipográficas → rectas
  // ❌ NO convertir comas a puntos aquí (rompe avg(E1,E2))
  // s = s.replace(/,/g, '.');
  s = s.replace(/\s+/g, ' ');    // compacta espacios
  return s;
}


// Envuelve en comillas los argumentos de final()/finalCode()/finalId() si no vienen con comillas.
// Ej.: final(Laboratorio de Física) -> final("Laboratorio de Física")
function autoQuoteFunctionArgs(s){
  return s.replace(/\b(final|finalCode|finalId)\(\s*([^)]+?)\s*\)/g, (m, fn, rawArg) => {
    const a = String(rawArg).trim();
    // Si ya viene con comillas al inicio, respeta: final("X") / final('X')
    if (/^["'].*["']$/.test(a)) return `${fn}(${a})`;
    // Si el usuario metió una expresión (rara) con paréntesis/comas, no la tocamos
    if (/[(),]/.test(a)) return `${fn}(${a})`;
    // En cualquier otro caso, lo envolvemos en comillas dobles
    const quoted = a.replace(/"/g, '\\"');
    return `${fn}("${quoted}")`;
  });
}



// Convierte % solo para evaluar (20% -> (20/100))
function _prepareForEval(expr){
  if (!expr) return '';
  return expr.replace(/(\d+(?:\.\d+)?)\s*%/g, (_, n) => `(${n}/100)`);
}

// ✅ Evalúa expr tratando cualquier código no definido como 0
function safeEvalExpr(expr, vars, fns = {}){
  const normalized = normalizeExpr(expr);
  const withQuoted = autoQuoteFunctionArgs(normalized);

  return evaluateSafeExpression(withQuoted, {
    variables: vars,
    functions: fns,
    unknownIdentifierValue: 0
  });
}


// Extrae identificadores tipo "C1", "T2", "P1" desde la fórmula (excluye funciones)
function parseCodesFromFormula(formula){
  const normalized = normalizeExpr(formula || '');
  const withQuoted = autoQuoteFunctionArgs(normalized);
  // enmascara strings para no confundir identificadores dentro de comillas
  const masked = withQuoted.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '0');
  // tokens tipo identificador
  const toks = masked.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [];
  const reserved = new Set(['avg','min','max','final','finalCode','finalId','NaN','Infinity','Math','true','false']);
  // filtra los que claramente son funciones (token seguido de "(" en el texto original)
  const fnCall = new Set((withQuoted.match(/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/g) || [])
                   .map(s => s.replace('(','').trim()));
  const ids = toks.filter(t => !reserved.has(t) && !fnCall.has(t));
  return [...new Set(ids)];
}






/* ---- Render del panel ---- */


/* ---- Sufijos “(duo: …)” en el resultado propio ---- */

function truncate(val, scale){
  if (val == null || isNaN(val)) return null;
  if (scale === 'MAYOR'){
    return Math.trunc(val * 100) / 100;   // 2 decimales truncados
  } else {
    return Math.trunc(val * 10) / 10;     // 1 decimal truncado
  }
}

function normStr(s){
  return (s||'')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // sin tildes
    .replace(/\s+/g,' ').trim().toLowerCase();
}





function lookupFinalByName(name){
  const k = normStr(name);
  if (!k) return NaN;

  const cur = (state.courses||[]).find(x=>x.id===currentCourseId);
  if (k === normStr(cur?.name)) return NaN; // evita autoreferencia

  const exact = crossFinals.byName[k];
  if (exact && typeof exact.final === 'number') return exact.final;

  const all = Array.isArray(state.courses) ? state.courses : [];
  const starts = all.filter(c => normStr(c.name).startsWith(k) && c.id !== currentCourseId);
  if (starts.length === 1){
    const hit = crossFinals.byId[starts[0].id];
    if (hit && typeof hit.final === 'number') return hit.final;
  }
  const contains = all.filter(c => normStr(c.name).includes(k) && c.id !== currentCourseId);
  if (contains.length === 1){
    const hit = crossFinals.byId[contains[0].id];
    if (hit && typeof hit.final === 'number') return hit.final;
  }
  return NaN;
}




function lookupFinalByCode(code){
  const k = normStr(code);
  const cur = (state.courses||[]).find(x=>x.id===currentCourseId);
  if (k && k === normStr(cur?.code)) return NaN;
  const hit = crossFinals.byCode[k];
  return (hit && typeof hit.final === 'number') ? hit.final : NaN;
}
function lookupFinalById(id){
  if (!id || id===currentCourseId) return NaN;
  const hit = crossFinals.byId[id];
  return (hit && typeof hit.final === 'number') ? hit.final : NaN;
}

// ====== MODO "NOTAS DE MI PARTY" ======

// state para party-notas
let _grParty = {
  uid: null,
  semId: null,
  courses: [],
  unsubCourses: null,
};

const _grPartyProfileCache = {}; // uid -> {name,color}

function gr_safeName(s, fb='Usuario'){
  const t = String(s||'').trim();
  return t ? t : fb;
}
function gr_safeHex(c, fb='#64748b'){
  const s = String(c||'').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : fb;
}

async function gr_loadPartyMemberProfile(uid){
  if (!uid) return { name:'', color:'#64748b' };
  if (_grPartyProfileCache[uid]) return _grPartyProfileCache[uid];

  try{
    // intentamos profile/profile (como usas en schedule.js)
    const profSnap = await getDoc(doc(db,'users',uid,'profile','profile'));
    const rootSnap = await getDoc(doc(db,'users',uid));

    const prof = profSnap.exists() ? (profSnap.data()||{}) : {};
    const root = rootSnap.exists() ? (rootSnap.data()||{}) : {};

    const name = gr_safeName(
      prof.name || root.name || root.displayName || root.username,
      (uid === state.currentUser?.uid ? 'Yo' : 'Usuario')
    );
    const color = gr_safeHex(prof.favoriteColor || root.favoriteColor || '#64748b');

    _grPartyProfileCache[uid] = { name, color };
    return _grPartyProfileCache[uid];
  }catch{
    _grPartyProfileCache[uid] = { name:'Usuario', color:'#64748b' };
    return _grPartyProfileCache[uid];
  }
}

function gr_cleanupPartyNotesSubs(){
  try{ _grParty.unsubCourses?.(); }catch{}
  _grParty.unsubCourses = null;
  _grParty.courses = [];
}

// ✅ soporta array | set | map | {uid:true} | {uid:{...}} | [{uid:"..."}] | {members:[...]} etc.
function gr_extractUids(x){
  if (!x) return [];

  // array directo
  if (Array.isArray(x)) {
    return x.map(v => (typeof v === 'string' ? v : v?.uid)).filter(Boolean);
  }

  // Set
  if (x instanceof Set) return [...x].map(v => (typeof v === 'string' ? v : v?.uid)).filter(Boolean);

  // Map
  if (x instanceof Map) return [...x.keys()].filter(Boolean);

  // objeto
  if (typeof x === 'object') {
    // si trae listas típicas
    const candidates =
      x.partyMembers || x.memberUids || x.members || x.uids || x.participants || x.people || null;

    if (candidates) return gr_extractUids(candidates);

    // si es { uid:true } o { uid:{...} }
    const keys = Object.keys(x);
    // filtro suave: UIDs de firebase suelen ser strings largas
    const uidLike = keys.filter(k => typeof k === 'string' && k.length >= 16);
    if (uidLike.length) return uidLike;

    // si es { a:{uid:".."}, b:{uid:".."} }
    const vals = Object.values(x).map(v => v?.uid).filter(Boolean);
    if (vals.length) return vals;
  }

  return [];
}

function gr_getPartyMembersNoMe(){
  const me = state.currentUser?.uid;

  // 🧠 probamos varias “fuentes” posibles dentro del state
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
    uids = gr_extractUids(s);
    if (uids.length) break;
  }

  // normaliza + sin yo + únicos
  const uniq = [...new Set(uids.filter(Boolean))].filter(uid => uid !== me);

  return uniq;
}

// UI: aseguramos barra + lista dentro de gr-partnerView
function gr_ensurePartyNotesUI(){
  const pv = $('gr-partnerView');
  if (!pv) return;

  // Si ya existe, listo
  if (pv.querySelector('#gr-partyBar')) return;

  // OJO: mantenemos tus IDs existentes: gr-sh-semSel y gr-sh-list
  // Solo insertamos una barra tipo “party”
  const bar = document.createElement('div');
  bar.id = 'gr-partyBar';
  bar.style.cssText = 'display:flex; flex-wrap:wrap; gap:10px; margin:10px 0 12px 0;';

  // Título
  const h = pv.querySelector('h3, h2');
  if (h) {
    // cambia el título si decía “duo”
    if (/duo/i.test(h.textContent||'')) h.textContent = 'Notas de mi party';
  }

  // Insertar barra antes del select semestre (si existe)
  const semSel = pv.querySelector('#gr-sh-semSel');
  if (semSel?.parentElement){
    semSel.parentElement.insertBefore(bar, semSel);
  } else {
    pv.insertBefore(bar, pv.firstChild);
  }
}

// Render chips miembros
async function gr_renderPartyMembersBar(){
  gr_ensurePartyNotesUI();
  const bar = document.getElementById('gr-partyBar');
  if (!bar) return;

  const members = gr_getPartyMembersNoMe();
  if (!members.length){
    bar.innerHTML = `<div class="muted">No hay miembros en tu party.</div>`;
    return;
  }

  // default uid
  if (!_grParty.uid || !members.includes(_grParty.uid)){
    _grParty.uid = members[0];
  }

  await Promise.all(members.map(uid => gr_loadPartyMemberProfile(uid)));

  bar.innerHTML = members.map(uid => {
    const p = _grPartyProfileCache[uid] || {};
    const active = (uid === _grParty.uid);
    return `
      <button class="btn ${active ? 'violet' : 'violet-outline'}"
        data-gr-uid="${uid}"
        style="display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;">
        <span style="width:14px;height:14px;border-radius:4px;background:${p.color||'#64748b'};display:inline-block;"></span>
        <span style="font-weight:800">${escapeHtml(p.name||'Usuario')}</span>
      </button>
    `;
  }).join('');

  bar.querySelectorAll('button[data-gr-uid]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      _grParty.uid = btn.dataset.grUid;
      await gr_renderPartyMembersBar();
      await gr_partyPopulateSemesterLocked();
      await gr_subscribePartyCourses();
    });
  });
}

// Semestre: bloqueado al semestre activo actual (igual que antes)
async function gr_partyPopulateSemesterLocked(){
  const sel = $('gr-sh-semSel');
  if (!sel) return;

  const activeLabel = state.activeSemesterData?.label || null;
  if (!activeLabel){
    sel.innerHTML = '<option selected>No disponible</option>';
    sel.disabled = true;
    sel.style.pointerEvents = 'none';
    sel.style.opacity = '0.7';
    _grParty.semId = null;
    return;
  }

  sel.innerHTML = `<option selected>${escapeHtml(activeLabel)}</option>`;
  sel.disabled = true;
  sel.style.pointerEvents = 'none';
  sel.style.opacity = '0.7';

  // buscamos semId real del miembro que tenga ese label
  if (!_grParty.uid) { _grParty.semId = null; return; }

  const ref = collection(db, 'users', _grParty.uid, 'semesters');
  const snap = await getDocs(ref);

  let matchId = null;
  snap.forEach(d=>{
    const lbl = String(d.data()?.label || '').trim();
    if (lbl === activeLabel) matchId = d.id;
  });

  _grParty.semId = matchId;

  const host = $('gr-sh-list');
  if (host && !matchId){
    host.innerHTML = `<div class="muted">Este miembro no tiene creado el semestre ${escapeHtml(activeLabel)}.</div>`;
  }
}

// Subscribe cursos del miembro seleccionado
async function gr_subscribePartyCourses(){
  const host = $('gr-sh-list'); 
  if (host) host.innerHTML = '';

  gr_cleanupPartyNotesSubs();

  if (!_grParty.uid || !_grParty.semId){
    return;
  }

  const canSee = await canViewPartyZone(_grParty.uid, 'notas');

  if (!canSee) {
    if (host) host.innerHTML = privacyBlockedMessage('sus notas');
    return;
  }

  const coursesRef = collection(db,'users',_grParty.uid,'semesters',_grParty.semId,'courses');

  _grParty.unsubCourses = onSnapshot(query(coursesRef, orderBy('name')), (snap)=>{
    _grParty.courses = snap.docs.map(d => ({ id:d.id, ...(d.data()||{}) }));
    gr_renderPartyCoursesList();
  });
}

function gr_renderPartyCoursesList(){
  const host = $('gr-sh-list'); if (!host) return;
  host.innerHTML = '';

  const list = _grParty.courses || [];
  if (!list.length){
    host.innerHTML = `<div class="muted">No hay ramos en ese semestre.</div>`;
    return;
  }

  // Cards clickeables
  list.forEach(c=>{
    const row = document.createElement('div');
    row.className = 'grade-item';
    row.style.cursor = 'pointer';
    row.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:800">${esc(c.name || 'Ramo')}</div>
        <div class="muted">Código: <b>${esc(c.code || '—')}</b></div>
      </div>
      <div class="muted" style="font-weight:800">Ver</div>
    `;
    row.addEventListener('click', ()=> gr_openPartyCourseDetails(c.id));
    host.appendChild(row);
  });
}

// Modal simple para ver evaluaciones + final
function gr_ensurePartyCourseModal(){
  if (document.getElementById('grPartyCourseModal')) return;

  const wrap = document.createElement('div');
  wrap.id = 'grPartyCourseModal';
  wrap.style.cssText = `
    position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.60); z-index:12000; padding:16px;
  `;

  wrap.innerHTML = `
    <div style="
      width:min(820px, 96vw);
      max-height:92vh;
      overflow:auto;
      background:#121527;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:14px;
      box-shadow:0 18px 60px rgba(0,0,0,.45);
      color:#fff;
      font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
    ">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="min-width:0;">
          <div id="grPcTitle" style="font-size:16px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Ramo</div>
          <div id="grPcSub" class="muted" style="font-size:12.5px;opacity:.75;margin-top:4px;"></div>
        </div>
        <button id="grPcX" class="btn violet-outline" type="button">✕</button>
      </div>

      <div class="card" style="padding:12px; margin-top:12px;">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
          <div>
            <div class="muted" style="font-size:12px;opacity:.75;">Fórmula final</div>
            <div id="grPcFormula" style="font-weight:900; font-size:13px; margin-top:2px;">—</div>
          </div>
          <div style="text-align:right;">
            <div class="muted" style="font-size:12px;opacity:.75;">Nota final</div>
            <div id="grPcFinal" style="font-weight:900; font-size:18px;">—</div>
          </div>
        </div>
      </div>

      <div class="card" style="padding:12px; margin-top:12px;">
        <div style="font-weight:900; margin-bottom:8px;">Evaluaciones</div>
        <div id="grPcEvals" class="muted">Cargando…</div>
      </div>
    </div>
  `;

  document.body.appendChild(wrap);

  const close = ()=> wrap.style.display = 'none';
  document.getElementById('grPcX')?.addEventListener('click', close);
  wrap.addEventListener('click', (e)=>{ if (e.target === wrap) close(); });
  document.addEventListener('keydown', (e)=>{ if (wrap.style.display==='flex' && e.key==='Escape') close(); });
}

async function gr_openPartyCourseDetails(courseId){
  if (!_grParty.uid || !_grParty.semId || !courseId) return;

  gr_ensurePartyCourseModal();

  const modal = document.getElementById('grPartyCourseModal');
  const t = document.getElementById('grPcTitle');
  const sub = document.getElementById('grPcSub');
  const formulaEl = document.getElementById('grPcFormula');
  const finalEl = document.getElementById('grPcFinal');
  const evalsEl = document.getElementById('grPcEvals');

  modal.style.display = 'flex';
  evalsEl.innerHTML = 'Cargando…';
  finalEl.textContent = '—';
  formulaEl.textContent = '—';

  const course = (_grParty.courses || []).find(c => c.id === courseId) || {};
  const prof = await gr_loadPartyMemberProfile(_grParty.uid);

  t.textContent = course.name || 'Ramo';
  sub.textContent = `${prof.name || 'Usuario'} · ${state.activeSemesterData?.label || ''}`;

  // meta + components
  const metaRef = doc(db,'users',_grParty.uid,'semesters',_grParty.semId,'courses',courseId,'grading','meta');
  const compsRef = collection(db,'users',_grParty.uid,'semesters',_grParty.semId,'courses',courseId,'grading','meta','components');

  const [metaSnap, compsSnap] = await Promise.all([ getDoc(metaRef), getDocs(query(compsRef, orderBy('order'))) ]);

  const meta = metaSnap.exists() ? (metaSnap.data()||{}) : { scale:'USM', finalExpr:'', rulesText:'' };
  const comps = compsSnap.docs.map(d => ({ id:d.id, ...(d.data()||{}) }));

  const scale = meta.scale || 'USM';
  const min = scale === 'MAYOR' ? 1 : 0;
  const max = scale === 'MAYOR' ? 7 : 100;

  // mapa key->score
  const vals = {};
  comps.forEach(k=>{
    if (typeof k.score === 'number' && isFinite(k.score) && k.key){
      vals[k.key] = clamp(k.score, min, max);
    }
  });

  const formula = (meta.finalExpr || '').trim();
  formulaEl.textContent = formula ? formula : '—';

  // calcular final
  let final = null;
  try{
    if (formula){
      final = safeEvalExpr(formula, vals, { avg, min: Math.min, max: Math.max, final: ()=>NaN, finalCode: ()=>NaN, finalId: ()=>NaN });
      if (typeof final === 'number' && isFinite(final)) final = truncate(final, scale);
      else final = null;
    }
  }catch{
    final = null;
  }
  finalEl.textContent = (final==null) ? '—' : String(final);

  // render evaluaciones (lista simple)
  if (!comps.length){
    evalsEl.innerHTML = `<div class="muted">Este ramo no tiene evaluaciones.</div>`;
    return;
  }

  // agrupación liviana por nombre (reusa tu lógica básica)
  const getGrupo = (nameRaw='')=>{
    const name = String(nameRaw||'');
    if (/certamen/i.test(name)) return 'Certámenes';
    if (/control/i.test(name))  return 'Controles';
    if (/tarea/i.test(name))    return 'Tareas';
    if (/proy|proyecto/i.test(name)) return 'Proyecto';
    if (/laboratorio|\blab/i.test(name)) return 'Laboratorios';
    if (/pre[\s-]?informe/i.test(name)) return 'Pre-informes';
    if (/\binforme/i.test(name) && !/pre[\s-]?informe/i.test(name)) return 'Informes';
    return 'Otros';
  };

  const groups = {};
  comps.forEach(c=>{
    const g = getGrupo(c.name || c.key);
    (groups[g] = groups[g] || []).push(c);
  });

  evalsEl.innerHTML = Object.entries(groups).map(([g, arr])=>{
    const items = arr.map(c=>{
      const val = (typeof c.score === 'number' && isFinite(c.score)) ? c.score : null;
      return `
        <div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:12px;
          border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); margin-top:8px;">
          <div style="min-width:0;">
            <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${esc(c.name || c.key)}
            </div>
            <div class="muted" style="font-size:12px;opacity:.75;margin-top:2px;">Código: <b>${esc(c.key||'—')}</b></div>
          </div>
          <div style="font-weight:900; font-size:14px;">
            ${val==null ? '—' : esc(val)}
          </div>
        </div>
      `;
    }).join('');

    return `
      <details open style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:900;opacity:.9">${esc(g)} (${arr.length})</summary>
        ${items}
      </details>
    `;
  }).join('');
}

// --- Toggle (reusa tu botón gr-togglePartner)
// =================== REEMPLAZA setupPartyToggle completo ===================

(function setupPartyToggle(){
  const btn = $('gr-togglePartner');
  if (!btn) return;

  // ✅ Título de la página
  const pageTitle = document.querySelector('#page-notas h2, #page-notas h1, .page-title');

  function getOwnBlocks() {
    // Recalcular en cada llamada por si los cards se crean después (ej: gr-rulesCard)
    return [
      $('gr-courseSel')?.closest('.card'),
      $('gr-evalsCard') || $('gr-evalsList')?.closest('.card'),
      $('gr-calcCard')  || $('gr-finalExpr')?.closest('.card'),
      $('gr-summaryCard') || $('gr-currentFinal')?.closest('.card') || $('gr-currentAvg')?.closest('.card'),
      $('gr-rulesCard'),   // ← este era el que faltaba
    ].filter(Boolean);
  }

  const partyCard = $('gr-partnerView');

  function setMode(on){
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'Volver a mis notas' : 'Notas de mi party';

    // ✅ Cambiar título de la página
    if (pageTitle) {
      pageTitle.textContent = on ? '🎉 Notas de mi party' : '📊 Mis Notas';
    }

    // ✅ Ocultar/mostrar bloques propios (recalculados en cada toggle)
    getOwnBlocks().forEach(el => setHidden(el, on));
    setHidden(partyCard, !on);

    if (on){
      gr_ensurePartyNotesUI();
      gr_renderPartyMembersBar()
        .then(() => gr_partyPopulateSemesterLocked())
        .then(() => gr_subscribePartyCourses())
        .catch(err => console.warn('Error cargando party:', err));
    }
  }

  btn.addEventListener('click', () => {
    const now = btn.getAttribute('aria-pressed') === 'true';
    setMode(!now);
  });

  document.addEventListener('party:ready', () => {
    const on = btn.getAttribute('aria-pressed') === 'true';
    if (on){
      gr_renderPartyMembersBar()
        .then(() => gr_partyPopulateSemesterLocked())
        .then(() => gr_subscribePartyCourses())
        .catch(() => {});
    }
  });

  // ✅ Al volver a "Mis notas" desde otra pestaña, asegurar que party esté oculto
  document.addEventListener('route:notas', () => {
    // Solo si el botón existe y no está en modo party, asegurar estado limpio
    const on = btn.getAttribute('aria-pressed') === 'true';
    if (!on) {
      setHidden(partyCard, true);
      getOwnBlocks().forEach(el => setHidden(el, false));
    }
  });
})();

function _valsFromComps(comps, meta){
  const vals = {};
  const isMayor = (meta.scale==='MAYOR');
  const min = isMayor ? 1 : 0;
  const max = isMayor ? 7 : 100;
  comps.forEach(k=>{
    const v = typeof k.score==='number' ? Math.max(min, Math.min(max, k.score)) : null;
    if (v!=null && k.key) vals[k.key] = v;
  });
  return vals;
}


// ====== SIMULADOR: Drawer, evaluación, persistencia ======


function gr_askSaveSimulationModal(){
  return new Promise(resolve => {
    document.getElementById('grSimConfirmModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'grSimConfirmModal';
    modal.style.cssText = `
      position:fixed;
      inset:0;
      z-index:10050;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.65);
      backdrop-filter:blur(4px);
      padding:16px;
    `;

    modal.innerHTML = `
      <div style="
        width:min(460px, 92vw);
        background:linear-gradient(180deg, rgba(18,21,39,.98), rgba(12,14,30,.98));
        color:#fff;
        border:1px solid rgba(255,255,255,.12);
        border-radius:22px;
        padding:20px;
        box-shadow:0 24px 80px rgba(0,0,0,.55);
        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="
            width:46px;
            height:46px;
            border-radius:16px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(99,102,241,.18);
            border:1px solid rgba(129,140,248,.38);
            font-size:22px;
            flex:0 0 auto;
          ">💾</div>

          <div style="min-width:0;">
            <div style="font-size:18px;font-weight:900;line-height:1.2;">
              Guardar simulación
            </div>
            <div style="font-size:13px;opacity:.72;margin-top:4px;">
              Tienes cambios sin guardar en esta simulación.
            </div>
          </div>
        </div>

        <div style="
          margin-top:12px;
          padding:14px;
          border-radius:16px;
          background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.09);
          font-size:14px;
          line-height:1.45;
          color:rgba(255,255,255,.88);
        ">
          ¿Quieres guardar esta simulación antes de salir?
        </div>

        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:18px;
          flex-wrap:wrap;
        ">
          <button id="grSimConfirmCancel" class="ghost" type="button">
            Cancelar
          </button>

          <button id="grSimConfirmNo" class="ghost" type="button">
            Salir sin guardar
          </button>

          <button id="grSimConfirmYes" class="primary" type="button">
            Guardar y salir
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const done = (value) => {
      modal.remove();
      resolve(value); // 'save' | 'discard' | 'cancel'
    };

    modal.querySelector('#grSimConfirmYes')?.addEventListener('click', () => done('save'));
    modal.querySelector('#grSimConfirmNo')?.addEventListener('click', () => done('discard'));
    modal.querySelector('#grSimConfirmCancel')?.addEventListener('click', () => done('cancel'));

    modal.addEventListener('click', e => {
      if (e.target === modal) done('cancel');
    });

    document.addEventListener('keydown', function onEsc(e){
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onEsc);
        done('cancel');
      }
    });
  });
}

function gr_openSimDrawer({ formula, evals }) {
  // Cierra si ya existe
  document.getElementById('gr-simDrawer')?.remove();
  document.getElementById('gr-simBackdrop')?.remove();

  // ===== Backdrop que bloquea toda la app =====
  const backdrop = document.createElement('div');
  backdrop.id = 'gr-simBackdrop';
  Object.assign(backdrop.style, {
    position: 'fixed', inset: '0', zIndex: 9998,
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(1px)'
  });

  // Bloquea scroll del body mientras esté abierto
  document.documentElement.classList.add('sim-lock');
  document.body.classList.add('sim-lock');

  // ===== Drawer (ventana de simulación) =====
  const drawer = document.createElement('div');
  drawer.id = 'gr-simDrawer';
  Object.assign(drawer.style, {
    position: 'fixed', top: '0', right: '0', height: '100vh',
    width: '420px', background: 'rgba(18,18,30,.98)', backdropFilter: 'blur(6px)',
    borderLeft: '1px solid rgba(255,255,255,.08)', boxShadow: '0 0 24px rgba(0,0,0,.45)',
    zIndex: 9999, padding: '16px 16px 90px 16px', overflowY: 'auto', overscrollBehavior: 'contain'
  });

  // Evita que los clics pasen al backdrop
  drawer.addEventListener('click', (e) => e.stopPropagation());

  drawer.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <h3 style="margin:0">Simulador de notas</h3>
      <span class="muted" style="font-size:12px;opacity:.8">(${esc(formula)})</span>
    </div>

    <div class="card" style="margin-top:4px">
      <h4 style="margin:0 0 6px">Evaluaciones</h4>
      <div id="gr-simForm"></div>
    </div>

    <div class="card" style="margin-top:12px">
      <h4 style="margin:0 0 6px">Resumen de la simulación</h4>
      <div id="gr-simSummary" class="muted">—</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h4 style="margin:0 0 6px">Reglas del ramo (simulación)</h4>
      <div id="gr-simRules" class="muted">—</div>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,.1)">
  <button id="gr-simSave" class="primary">Guardar simulación</button>
  <button id="gr-simClose" class="ghost">Salir</button>
</div>

  `;

  // Inserta backdrop y drawer (orden importa)
  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  // Cerrar (compartido por botón, ESC y click en backdrop)
const doClose = async () => {
  const snap = recompute();
  let last;

  try {
    last = await gr_loadLastSimulation();
  } catch {
    last = null;
  }

  // 🔹 Normalizador robusto: redondea números y convierte null/undefined → null
  const normalizeObj = (obj = {}) => {
    const res = {};
    for (const [k, v] of Object.entries(obj || {})) {
      if (v == null || v === '') res[k.toUpperCase()] = null;
      else if (typeof v === 'string' && v.trim() === '') res[k.toUpperCase()] = null;
      else if (!isNaN(v)) res[k.toUpperCase()] = Math.round(Number(v) * 100) / 100;
      else res[k.toUpperCase()] = v;
    }
    return res;
  };

  const sameMap = (a, b) => {
    const A = normalizeObj(a);
    const B = normalizeObj(b);
    const allKeys = new Set([...Object.keys(A), ...Object.keys(B)]);
    for (const k of allKeys) {
      if ((A[k] ?? null) !== (B[k] ?? null)) return false;
    }
    return true;
  };

  const unchanged = sameMap(snap.gradesMap, last);

  // 🔸 Solo preguntar si cambió algo
  if (!unchanged) {
  const action = await gr_askSaveSimulationModal();

  if (action === 'cancel') return;

  if (action === 'save') {
    try { await gr_saveSimulation(snap.gradesMap, formula); } catch(_) {}
  }
}

  backdrop.remove();
  drawer.remove();
  document.documentElement.classList.remove('sim-lock');
  document.body.classList.remove('sim-lock');
};



  backdrop.addEventListener('click', doClose);
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') doClose();
  });
  drawer.querySelector('#gr-simClose')?.addEventListener('click', doClose);

  // Trap de foco dentro del drawer
  trapFocus(drawer);

  const formHost = drawer.querySelector('#gr-simForm');

  // ----- Evaluaciones: reales + faltantes según la fórmula -----
  const existing = new Map((evals || []).map(e => [e.code, e.grade]));
  const codesInFormula = parseCodesFromFormula(formula);
  const existingCodes  = new Set((evals || []).map(e => e.code));
  const allCodes       = [...new Set([...existingCodes, ...codesInFormula])];

 // --- NUEVO BLOQUE ---
// --- NUEVO BLOQUE AGRUPADO ---
const grupos = {
  certamenes:  [],
  controles:   [],
  tareas:      [],
  proyecto:    [],
  evaluaciones: [],
  experiencias: [],
  preinformes:  [],
  informes:     [],
  laboratorios: [],
  otros:        []
};

const defaultNames = {
  certamenes:   'Certámenes',
  controles:    'Controles',
  tareas:       'Tareas',
  proyecto:     'Proyecto',
  evaluaciones: 'Evaluaciones',
  experiencias: 'Experiencias',
  preinformes:  'Pre-informes',
  informes:     'Informes',
  laboratorios: 'Laboratorios',
  otros:        'Otros'
};

// 🧠 Determinar grupo según nombre/código
function getGrupo(_code, nameRaw) {
  const name = (nameRaw || '').toString();

  if (/certamen/i.test(name)) return 'certamenes';
  if (/control/i.test(name))  return 'controles';
  if (/tarea/i.test(name))    return 'tareas';
  if (/proy|proyecto/i.test(name)) return 'proyecto';
  if (/evaluaci[oó]n/i.test(name)) return 'evaluaciones';
  if (/experien/i.test(name))      return 'experiencias';
  if (/pre[\s-]?informe/i.test(name)) return 'preinformes';
  if (/\binforme/i.test(name) && !/pre[\s-]?informe/i.test(name)) return 'informes';
  if (/laboratorio|\blab/i.test(name)) return 'laboratorios';
  return 'otros';
}



// 🔹 Clasificar cada evaluación en su grupo
for (const code of allCodes) {
  const ev = (evals || []).find(e => e.code === code) || { name: code };
  const val = existing.get(code);
  const groupKey = getGrupo(code, ev.name || code);
  grupos[groupKey].push({
    code, name: ev.name || code, value: val
  });
}

// 🔹 Renderizado agrupado
const rows = [];
const isMayor = (header.scale === 'MAYOR');
const min  = isMayor ? 1 : 0;
const max  = isMayor ? 7 : 100;
const step = isMayor ? 0.1 : 1;

for (const [key, list] of Object.entries(grupos)) {
  if (!list.length) continue;
  const title = defaultNames[key] || key;
  rows.push(`
    <details open class="sim-group" data-key="${key}"
      style="margin-top:10px;border:1px solid rgba(255,255,255,.08);
             border-radius:8px;padding:6px 8px;background:rgba(0,0,0,0.15)">
      <summary style="cursor:pointer;font-weight:700;font-size:14px;
                      margin-bottom:6px">${title} (${list.length})</summary>
      <div class="sim-group-body">
        ${list.map(ev => `
          <div class="row" style="align-items:center;gap:8px;margin:4px 0"
               data-sim-code="${esc(ev.code)}">
            <div style="min-width:76px"><b>${esc(ev.code)}</b></div>
            <div style="flex:1">${esc(ev.name)}</div>
            <input type="number" step="${step}" min="${min}" max="${max}"
                   style="width:110px" placeholder="—"
                   value="${ev.value ?? ''}">
          </div>
        `).join('')}
      </div>
    </details>
  `);
}

formHost.innerHTML = rows.join('');

// 🔹 Detección de referencias a otros ramos (finalCode / final)
const matches = [...formula.matchAll(/finalCode\(["'](.+?)["']\)/g)];
for (const m of matches) {
  const refCode = m[1];
  const finalVal = lookupFinalByCode(refCode);
  if (isFinite(finalVal)) {
    rows.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${esc(refCode)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${esc(refCode)}</div>
        <input type="number" readonly value="${finalVal}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `);
  } else {
    rows.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.75" data-sim-ref="${esc(refCode)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1;color:#aaa">Nota final de ${esc(refCode)}</div>
        <div style="width:110px;text-align:center;color:#f87171">—</div>
      </div>
    `);
  }
}

formHost.innerHTML = rows.join('');

const nameRefs = [...formula.matchAll(/final\(["'](.+?)["']\)/g)];
for (const m of nameRefs) {
  const refName = m[1];
  const finalVal = lookupFinalByName(refName);
  if (isFinite(finalVal)) {
    formHost.insertAdjacentHTML('beforeend', `
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${esc(refName)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${esc(refName)}</div>
        <input type="number" readonly value="${finalVal}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `);
  }
}


  // ----- Recalcular -----
  const recompute = () => {
    const map = {};
    formHost.querySelectorAll('[data-sim-code]').forEach(row => {
      const c = row.getAttribute('data-sim-code');
      const v = row.querySelector('input')?.value?.trim();
      const n = v ? Number(String(v).replace(',','.')) : null;
      map[c] = (Number.isFinite(n) ? n : 0);
    });

    let result;
    let err = null;
    try {
      result = safeEvalExpr(formula, { ...map }, {
  avg,
  min: Math.min,
  max: Math.max,
  final: (name) => lookupFinalByName(name),
  finalCode: (code) => lookupFinalByCode(code),
  finalId: (id) => lookupFinalById(id)
});

      if (typeof result === 'number' && isFinite(result)) result = truncate(result, header.scale);
      else result = null;
    } catch(e) {
      err = e?.message || String(e || '');
      result = null;
    }

    const rules = parseRules(header.rulesText || '');
const rulesEval = evaluateRules(rules, map);

// Umbral según escala
const thr = (header.scale === 'MAYOR') ? 3.95 : 54.5;

// Mensaje de “necesitas”
let needMsg;
if (err) {
  needMsg = '';
} else if (result == null) {
  needMsg = 'Ingresa valores para simular.';
} else {
  const parts = [];
  if (result < thr) {
    const diff = thr - result;
    parts.push(
      header.scale === 'MAYOR'
        ? `Subir la nota final en ${diff.toFixed(2)} pts.`
        : `Subir la nota final en ${diff.toFixed(1)} pts.`
    );
  }
  if (!rulesEval.allOk) {
    const faltan = rulesEval.unmet.map(u => u.text);
    if (faltan.length) {
      parts.push(`Cumplir reglas pendientes: ${faltan.map(esc).join('; ')}.`);
    }
  }
  needMsg = parts.length ? parts.join(' ') : 'Nada más. Ya apruebas.';
}

// Render del resumen
const sumEl = drawer.querySelector('#gr-simSummary');
sumEl.innerHTML = err
  ? `<div style="color:#f87171">Error en fórmula: ${esc(err)}</div>`
  : `
    <div>Promedio simulado: <b>${result==null ? '—' : result}</b></div>
    <div class="muted" style="margin-top:6px">(Usa tu fórmula final actual)</div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:10px 0">
    <div><b>Necesitas para aprobar</b></div>
    <div style="margin-top:4px">${needMsg}</div>
  `;


    const rulesEl = drawer.querySelector('#gr-simRules');
    if (!rules.length) {
      rulesEl.textContent = 'No hay reglas definidas.';
    } else {
      const ok = rulesEval.items.filter(x => x.ok).length;
      rulesEl.innerHTML = `
        <div style="margin-bottom:6px">Cumplidas: <b>${ok}/${rules.length}</b></div>
        <ul style="margin:0 0 0 18px;padding:0;list-style:disc;">
          ${rulesEval.items.map(x => `<li style="color:${x.ok ? '#22c55e' : '#ef4444'}">${esc(x.text)}</li>`).join('')}
        </ul>
      `;
    }
    return { gradesMap: map, result };
  };

  formHost.addEventListener('input', recompute);
  recompute();

  // ----- Guardar -----
  drawer.querySelector('#gr-simSave')?.addEventListener('click', async () => {
    const snap = recompute();
    try {
      const r = await gr_saveSimulation(snap.gradesMap, formula);
      alert(r?.where === 'cloud' ? 'Simulación guardada en la nube.' : 'Simulación guardada');
    } catch(e) {
      console.error(e);
      alert('No se pudo guardar la simulación.');
    }
  });

  // ----- Autocargar última simulación (fallback cloud → local) -----
  gr_loadLastSimulation().then(last => {
    if (!last) return;
    formHost.querySelectorAll('[data-sim-code]').forEach(row => {
      const c = row.getAttribute('data-sim-code') || '';
      const inp = row.querySelector('input');
      if (!inp) return;
      // tolerante a mayúsculas/minúsculas y claves normalizadas
      const v = last[c] ?? last[c.toUpperCase()] ?? last[c.toLowerCase()];
      if (v != null) inp.value = String(v);
    });
    recompute();
  }).catch(()=>{});


}

// Atrapa el foco dentro del drawer (Tab / Shift+Tab)
function trapFocus(container){
  const focusable = () => Array.from(container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

  const first = () => focusable()[0];
  const last  = () => focusable().slice(-1)[0];

  setTimeout(() => first()?.focus(), 0);

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = focusable();
    if (!f.length) return;
    const current = document.activeElement;
    if (e.shiftKey) {
      if (current === f[0]) { e.preventDefault(); last()?.focus(); }
    } else {
      if (current === f[f.length - 1]) { e.preventDefault(); first()?.focus(); }
    }
  });
}



// Guarda una simulación (varias por ramo) y también "__last__" para autocompletar
async function gr_saveSimulation(gradesMap, formulaStr) {
  // Normaliza claves a MAYÚSCULAS para evitar descalces C2/c2
  const normGrades = {};
  Object.keys(gradesMap || {}).forEach(k => { normGrades[String(k).toUpperCase()] = gradesMap[k]; });

  const payload = {
    formula: formulaStr,
    grades: normGrades,
    rules: parseRules(header.rulesText || ''),
    semId: state.activeSemesterId || null,
    courseId: state.editingCourseId || null,
    createdAt: serverTimestamp()

  };

  if (state.currentUser && state.activeSemesterId && state.editingCourseId) {
    try {
      const base = [
        'users', state.currentUser.uid,
        'semesters', state.activeSemesterId,
        'courses', state.editingCourseId,
        'simulations'
      ];
      await addDoc(collection(db, ...base), payload);              // histórico
      await setDoc(doc(db, ...base, '__last__'), payload);         // última
      return { ok: true, where: 'cloud' };
    } catch (e) {
      console.warn('Fallo Firestore, usando localStorage:', e);
      // sigue a local
    }
  }

  const key = `sim:last:${state.activeSemesterId || 'SEM'}:${state.editingCourseId || 'COURSE'}`;
  localStorage.setItem(key, JSON.stringify(payload));
  return { ok: true, where: 'local' };
}




async function gr_loadLastSimulation() {
  const key = `sim:last:${state.activeSemesterId || 'SEM'}:${state.editingCourseId || 'COURSE'}`;

  // 1) Intentar en Firestore si hay sesión y ruta válida
  if (state.currentUser && state.activeSemesterId && state.editingCourseId) {
    try {
      const lastRef = doc(
        db, 'users', state.currentUser.uid,
        'semesters', state.activeSemesterId,
        'courses', state.editingCourseId,
        'simulations', '__last__'
      );
      const snap = await getDoc(lastRef);
      if (snap.exists()) {
        const g = snap.data()?.grades || null;
        return g && typeof g === 'object' ? g : null;
      }
      // si no existe en la nube → pasar a local
    } catch {
      // continuar a local
    }
  }

  // 2) Fallback: localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const g = data?.grades || null;
    return g && typeof g === 'object' ? g : null;
  } catch {
    return null;
  }
}

// Devuelve el objeto de un curso por nombre aproximado
export function findCourse(name){
  if (!name || !state.courses) return null;
  const norm = (s)=> String(s||'').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,'');
  const n = norm(name);
  return state.courses.find(c =>
    norm(c.name).includes(n) || norm(c.code||'').includes(n)
  ) || null;
}








// ===================== Helpers =====================
async function calcCourseAverage(courseDoc) {
  // Para cada curso, recorrer sus rules → grades → promedio ponderado
  const rulesRef = collection(courseDoc.ref, 'rules');
  const rulesSnap = await getDocs(rulesRef);

  let totalWeighted = 0;
  let totalWeight = 0;

  for (const rule of rulesSnap.docs) {
    const r = rule.data();
    const peso = Number(r.peso) || 0;

    const gradesRef = collection(rule.ref, 'grades');
    const gradesSnap = await getDocs(gradesRef);
    const notas = gradesSnap.docs.map(g => Number(g.data().valor)).filter(x => !isNaN(x));

    if (notas.length > 0) {
      const avg = notas.reduce((a,b)=>a+b,0) / notas.length;
      totalWeighted += avg * (peso/100);
      totalWeight += peso;
    }
  }

  return totalWeight > 0 ? +(totalWeighted).toFixed(2) : null;
}

// ===================== Funciones públicas =====================

// Calcular promedio ponderado del semestre
export async function calcPromedioSemestre(semId) {
  if (!state.currentUser) return null;
  const semRef = collection(db, 'users', state.currentUser.uid, 'semesters', semId, 'courses');
  const coursesSnap = await getDocs(semRef);

  let sum = 0, count = 0;
  for (const courseDoc of coursesSnap.docs) {
    const avg = await calcCourseAverage(courseDoc);
    if (avg != null) { sum += avg; count++; }
  }

  return count > 0 ? +(sum/count).toFixed(2) : null;
}

// Nota mínima necesaria en examen final
export function calcNotaMinima(ramo) {
  // Supongamos que `ramo` ya trae { rules:[{tipo,peso,notas:[...]}, ...], scale }
  const scale = ramo.scale || 'USM';
  const notaAprob = (scale === 'MAYOR') ? 4.0 : 55;

  let acumulado = 0;
  let pesoExamen = 0;

  for (const r of (ramo.rules || [])) {
    const peso = Number(r.peso) || 0;
    if (r.tipo.toLowerCase().includes('examen')) {
      pesoExamen = peso;
      continue;
    }
    if (r.notas?.length) {
      const avg = r.notas.reduce((a,b)=>a+b,0)/r.notas.length;
      acumulado += avg * (peso/100);
    }
  }

  if (pesoExamen === 0) return null; // no hay examen en las reglas
  const needed = (notaAprob - acumulado) / (pesoExamen/100);
  return +(needed.toFixed(2));
}

// ¿Está aprobando?
export function isPassing(ramo) {
  const scale = ramo.scale || 'USM';
  const notaAprob = (scale === 'MAYOR') ? 4.0 : 55;
  return ramo.promedio >= notaAprob;
}

// Diferencia con nota mínima
export function calcBrecha(ramo) {
  const scale = ramo.scale || 'USM';
  const notaAprob = (scale === 'MAYOR') ? 4.0 : 55;
  return +(Math.max(0, notaAprob - (ramo.promedio || 0)).toFixed(2));
}

// Mejor / peor ramo
export async function bestWorst(semId) {
  if (!state.currentUser) return { best:null, worst:null };

  const semRef = collection(db, 'users', state.currentUser.uid, 'semesters', semId, 'courses');
  const coursesSnap = await getDocs(semRef);

  const results = [];
  for (const courseDoc of coursesSnap.docs) {
    const avg = await calcCourseAverage(courseDoc);
    results.push({ id: courseDoc.id, name: courseDoc.data().name, promedio: avg });
  }

  if (!results.length) return { best:null, worst:null };
  results.sort((a,b)=> (b.promedio||0) - (a.promedio||0));
  return { best: results[0], worst: results[results.length-1] };
}

