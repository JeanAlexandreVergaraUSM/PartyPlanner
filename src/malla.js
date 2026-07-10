// js/malla.js
import { $, state } from './state.js';
window.state = state;
import { db } from './firebase.js';
import { canViewPartyZone, privacyBlockedMessage } from './privacy.js';
import { doc, setDoc,addDoc,deleteDoc, onSnapshot, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Cache en memoria para mallas personalizadas del dúo
const duoCustomCache = new Map(); // nombre -> objeto malla


function lsGet(key, def='{}'){ try { return JSON.parse(localStorage.getItem(key) || def); } catch { return JSON.parse(def); } }
function lsSet(key, obj){ localStorage.setItem(key, JSON.stringify(obj)); }



// Utils locales seguros (defínelos una sola vez en el archivo)
const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

// 🔇 arriba en el archivo
let __muteSemesterChanged = 0;
function muteSemesterChangedForOneTick() {
  __muteSemesterChanged++;
  // se desmutea al final del microturno del event loop
  queueMicrotask(() => { __muteSemesterChanged = Math.max(0, __muteSemesterChanged - 1); });
}


function safeInt(v, def=1){
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : def;
}

function areaSlug(name){
  return String(name || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
}


// Lee el store de mallas personalizadas con fallback y migración anon → uid
function readCustomStore() {
  const uid = state.currentUser?.uid || 'anon';
  const kUser = `custom_mallas_${uid}`;
  const kAnon = `custom_mallas_anon`;

  const userData = lsGet(kUser, '{}');
  const anonData = lsGet(kAnon, '{}');

  // Si el usuario NO tiene nada y en anon SÍ hay cosas, migra
  const userEmpty = Object.keys(userData).length === 0;
  const anonHas   = Object.keys(anonData).length > 0;

  if (uid !== 'anon' && userEmpty && anonHas) {
    lsSet(kUser, anonData);       // migra todo
    localStorage.removeItem(kAnon);
    return { data: anonData, key: kUser, migrated: true };
  }
  return { data: userData, key: kUser, migrated: false };
}

// Escribe en el store del usuario y además espeja en anon (para no perder sesiones sin login)
function writeCustomStore(mutatorFn) {
  const uid = state.currentUser?.uid || 'anon';
  const kUser = `custom_mallas_${uid}`;
  const kAnon = `custom_mallas_anon`;

  const cur = lsGet(kUser, '{}');
  const next = mutatorFn(cur) || cur;
  lsSet(kUser, next);

  // espejo en anon para que el constructor funcione aunque te desloguees
  lsSet(kAnon, next);
  return next;
}

// Sincroniza en Firestore qué malla tiene activa el usuario
async function syncActiveMallaToProfile(label, isCustom) {
  const uid = state.currentUser?.uid;
  if (!uid) return;
  try {
    await setDoc(doc(db, 'users', uid), {
      ultima_malla_seleccionada: label || null,
      ultima_malla_es_custom: !!isCustom
    }, { merge: true });
  } catch (err) {
    console.warn('[malla] No se pudo sincronizar ultima_malla_seleccionada', err);
  }
}



// ====================== DEBUGGING LOGGER ======================
console.groupCollapsed('%c[MALLA INIT]', 'color:#6cf;font-weight:bold;');
console.log('→ Archivo malla.js cargado');
console.log('state:', state);
console.log('location.hash:', location.hash);
console.groupEnd();

window.__DEBUG_MALLA = true;
function logMalla(...args) {
  if (window.__DEBUG_MALLA) console.log('[malla]', ...args);
}
window.logMalla = logMalla;
// ==============================================================


/* ================= Config ================= */
const CAREER_NAMES = {
  MEDVET: 'Medicina Veterinaria',
  ICTEL:  'Ing. Civil Telemática',
};
const UNI_CAREERS = {
  UMAYOR: ['MEDVET'],
  USM:    ['ICTEL'],
};

// Solo estas carreras tienen CSV oficial cargado
const VALID_CAREERS = Object.keys(CAREER_NAMES); // ['MEDVET','ICTEL']


// Llevar registro de la última universidad/carrera del perfil
let lastProfileUni = null;
let lastProfileCareer = null;

// Cuando el perfil está listo por primera vez, guardamos la uni/carrera actual
document.addEventListener('profile:ready', () => {
  lastProfileUni    = state.profileData?.university || '';
  lastProfileCareer = state.profileData?.career || '';
});

// Cada vez que cambie el perfil, si cambió universidad o carrera → borrar mallas antiguas
document.addEventListener('profile:changed', async () => {
  const newUni    = state.profileData?.university || '';
  const newCareer = state.profileData?.career || '';

  const hadOld = lastProfileUni && lastProfileCareer;
  const changed =
    hadOld &&
    (newUni !== lastProfileUni || newCareer !== lastProfileCareer);

  if (changed) {
    console.log('[malla] profile:changed → carrera/universidad cambiada', {
      from: { uni: lastProfileUni, career: lastProfileCareer },
      to:   { uni: newUni,       career: newCareer },
    });

    await wipeCareerData(lastProfileUni, lastProfileCareer);

    // también limpiamos selección local para que no intente reutilizar la malla anterior
    localStorage.removeItem('ultima_malla_seleccionada');

    // forzar re-render limpio
    lastRenderedKey = '';
  }

  // actualizar “último perfil conocido”
  lastProfileUni    = newUni;
  lastProfileCareer = newCareer;
});


let carrerasData = {};       // { MEDVET: [...], ICTEL: [...] }
let lastRenderedKey = '';    // evita renders redundantes
let isEditingCustomMalla = false; // ya existe
const isEditing = () => isEditingCustomMalla === true;



// Romanos soportados (hasta 12 semestres)
const ALL_ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const romanIndex = (r)=> ALL_ROMANS.indexOf(r); // 0‑based

/* ================= Boot ================= */
initMallaOnRoute();
window.addEventListener('hashchange', initMallaOnRoute);

document.addEventListener('profile:ready', () => {
  if (isEditing()) return;
  if (isPartnerView()) return;   // ✅ no pisar vista party

  const page = document.getElementById('page-malla');
  if (page?.dataset.custom === 'true') {
    restaurarUltimaMalla();
    return;
  }

  const sel = document.getElementById('malla-selector');
  const ultima = localStorage.getItem('ultima_malla_seleccionada');
  const opt = sel && Array.from(sel.options).find(o => o.value === ultima);

  if (opt && opt.dataset.oficial !== '1') {
    renderCustomMalla(ultima);
    return;
  }

  renderFromProfile();
});

document.addEventListener('profile:changed', () => {
  if (isEditing()) return;
  if (isPartnerView()) return;   // ✅ no pisar vista party

  const page = document.getElementById('page-malla');
  if (location.hash !== '#/malla') return;

  if (page?.dataset.custom === 'true') {
    restaurarUltimaMalla();
    return;
  }

  renderFromProfile();
});


export async function initMallaOnRoute() {
  if (location.hash !== '#/malla') return;

  // Esperar a que profileData esté realmente listo
  if (!state.profileData) {
    console.log('[malla] Esperando profileData…');
    await new Promise(r => {
      const fn = () => { document.removeEventListener('profile:ready', fn); r(); };
      document.addEventListener('profile:ready', fn);
    });
  }

  const host = $('malla-host');
  if (!host) return;

  // Asegurar que el shell esté construido una vez
  if (!host.dataset.ready) {
    await ensureDatasetsLoaded();
    buildShell(host);
    host.dataset.ready = '1';
  }

  // Crear selector SOLO una vez
  await showMallaSelector();

const uni = state.profileData?.university || '';
const carrera = state.profileData?.career || '';

if (!uni || !carrera) {
  if (!isPartnerView()) renderFromProfile();
} else {
  if (!isPartnerView()) restaurarUltimaMalla();
}

  // Si está activada la vista de dúo, activar
  setupPartnerToggle?.();
  const cb = $('malla-view-partner');
  if (cb) state.shared.malla.enabled = cb.checked;

  const otherUid = __partyLockUid || __partyViewingUid || state.pairOtherUid;

if (state.shared?.malla?.enabled && otherUid) {
  // ✅ asegura que watchPartnerMalla tenga uid aunque otro módulo lo borre
  state.pairOtherUid = otherUid;
  setPartnerReadonly(true);
  await watchPartnerMalla();
} else {
  renderFromProfile();
}
}




async function ensureMallaLiveAfterPair(){
  if (location.hash !== '#/malla') return;
  const host = $('malla-host');
  if (!host) return;

  // Asegura UI y datasets listos
  if (!host.dataset.ready){
    buildShell(host);
    await ensureDatasetsLoaded();
    host.dataset.ready = '1';
  }

  // Asegura que exista el toggle "Ver malla de mi duo"
  setupPartnerToggle?.();

  const otherUid = __partyLockUid || __partyViewingUid || state.pairOtherUid;

if (state.shared?.malla?.enabled && otherUid){
  state.pairOtherUid = otherUid;
  setPartnerReadonly(true);
  watchPartnerMalla();
} else {
  setPartnerReadonly(false);
  lastRenderedKey = '';
  if (state.profileData) renderFromProfile();
}
}

function renderLegendForAreas(areas){
  const legend = document.querySelector('#page-malla .legend');
  if (!legend) return;

  const list = (Array.isArray(areas) ? areas : [])
    .filter(a => a && (a.nombre || '').trim());

  legend.innerHTML = list.map(a => `
    <span>
      <span class="legend-color" style="background:${a.color || '#888'}"></span>
      ${a.nombre}
    </span>
  `).join('');
}


/* ================= Helpers: modo duo/solo‑lectura ================= */
function isPartnerView(){
  const uid = __partyLockUid || __partyViewingUid || state.pairOtherUid;
  return !!(state.shared?.malla?.enabled && uid);
}

function setPartnerReadonly(on){
  const wrapper = $('malla-wrapper');
  if (!wrapper) return;
  // flag para lógica de clicks y feedback visual sutil
  wrapper.dataset.readonly = on ? '1' : '0';
  wrapper.style.cursor = on ? 'not-allowed' : '';
}

/* ================= UI shell (sin selects) ================= */

// Busca: function buildShell(host)... y reemplázala por esta:

const __builtHosts = new WeakSet();
function buildShell(host) {
   if (__builtHosts.has(host)) {
    return; // ya construido (no agregues listeners otra vez)
  }
  __builtHosts.add(host);

  console.log('[DEBUG] buildShell construido en el host');

  host.innerHTML = `
    <div id="malla-wrapper" class="malla-wrapper">
      <div class="grid-header" style="display:none"></div>
      <div class="malla-grid"></div>
    </div>

    <div id="malla-info" style="display:none">
      <div id="malla-caption" class="muted" style="text-align:center;margin:6px 0 2px"></div>
      <div id="malla-percentage" class="percentage-display"></div>
      <div class="legend"></div>
    </div>
  `;

  // Evento Click con LOGS
  host.addEventListener('click', (e) => {
      // ❗ Ignorar clics EN EL TOGGLE o cualquier input
  if (e.target.closest('#malla-partner-toggle')) return;

  // solo bloquear clics de items de la malla
  const it = e.target.closest('.grid-item');
  if (!it) return; // si no clickeaste un ramo, dejar que el click pase normal
    muteSemesterChangedForOneTick();
     e.preventDefault();
  e.stopPropagation();
  if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    console.log('--- CLICK DETECTADO ---');
    console.log('Elemento clickeado:', e.target);

    if (!it) {
      console.warn('❌ El click no fue sobre un .grid-item (o pointer-events:none lo bloqueó)');
      return;
    }
    console.log('✅ Item encontrado:', it.dataset.codigo || it.querySelector('.course-name').textContent);

    const wrapper = document.getElementById('malla-wrapper');
    
    // Chequeo de solo lectura
    if (wrapper?.dataset.readonly === '1') {
      console.log('⛔ Bloqueado: El wrapper está en modo readonly');
      return;
    }

    const page = document.getElementById('page-malla');
    const isCustom = page?.dataset.custom === 'true';
    console.log('Es malla custom?', isCustom);

    // Chequeo de modo edición
    if (isCustom && typeof isEditingCustomMalla !== 'undefined' && isEditingCustomMalla) {
        console.log('⚠️ Estamos en modo edición, abriendo modal (no tachando)');
        // Aquí iría la lógica de abrir modal...
        return; 
    }

    // Acción
    console.log('🔄 Ejecutando toggle de clase "aprobado"...');
    it.classList.toggle('aprobado');
    console.log('Clases actuales:', it.className);

    // Recalcular
    console.log('🔄 Actualizando dependencias y porcentaje...');
    actualizarDependencias(wrapper);
    updatePercentage(wrapper);

    // Guardar
    if (isCustom) {
  const nombreMalla = localStorage.getItem('ultima_malla_seleccionada') || 'CUSTOM';
  saveStateCustom(wrapper, nombreMalla);

  // 🛡️ Parche defensivo: si otro módulo re-renderiza, reinyecta el estado en el próximo tick
  setTimeout(() => {
    loadStateCustom(wrapper, nombreMalla);
    actualizarDependencias(wrapper);
    updatePercentage(wrapper);
  }, 0);
} else {
  saveState(wrapper);
}
  });
}

/* ================= Datos ================= */
async function ensureDatasetsLoaded(){
  if (carrerasData.MEDVET && carrerasData.ICTEL) return;

// UMayor - Medicina Veterinaria
const medvet = await fetch(`${import.meta.env.BASE_URL}data/medvet_malla.csv`).then(r=>r.text());
carrerasData.MEDVET = parseMedvetCSV(medvet);

// USM - Telemática
try {
  const ictel = await fetch(`${import.meta.env.BASE_URL}data/ictel_malla.csv`).then(r=>r.text());
  carrerasData.ICTEL = parseIctelCSV(ictel);
} catch {
  carrerasData.ICTEL = [];
}
}

function parseMedvetCSV(text){
  const rows = parseCSV(text);

  const integrativa     = [1,16,36,43,45,51,54,55,56,58,60];
  const formBas         = [2,3,4,5,6,9,10,11,17,18,24,30,49];
  const electiva        = [12,19,25,31,37];
  const salAnimal       = [7,13,15,20,21,22,28,32,33,34,39,40,41,42,44,46,47,48,52,53];
  const prodAnimal      = [8,14,26,38];
  const medioAmb        = [23,29];
  const salPublica      = [27,35,50,57];
  const transversal     = rows
    .map(r => parseInt(r['Código Asignatura'], 10))
    .filter(n => ![...integrativa, ...formBas, ...electiva,
                   ...salAnimal, ...prodAnimal, ...medioAmb, ...salPublica].includes(n));

  return rows.map(r=>{
    let codigo = r['Código Asignatura'];
    if (codigo.includes('.')) codigo = codigo.split('.')[0];

    const prereqs = ['Prerrequisito 01 (Código)',
                     'Prerrequisito 02 (Código)',
                     'Prerrequisito 03 (Código)']
      .map(c => r[c])
      .filter(v => v && v.toLowerCase() !== 'ingreso')
      .map(v => v.includes('.') ? v.split('.')[0] : v);

    const num = parseInt(codigo, 10);
    let area = '';
    if (integrativa.includes(num))      area = 'integrativa';
    else if (formBas.includes(num))     area = 'formacion-basica';
    else if (electiva.includes(num))    area = 'electiva';
    else if (salAnimal.includes(num))   area = 'salud-animal';
    else if (prodAnimal.includes(num))  area = 'produccion-animal';
    else if (medioAmb.includes(num))    area = 'medio-ambiente';
    else if (salPublica.includes(num))  area = 'salud-publica';
    else if (transversal.includes(num)) area = 'transversal';

    return {
      codigo,             // ej. "1", "2" (números del dataset de MedVet)
      sigla:  '',         // MedVet no usa sigla visible
      numero: null,       // idem
      creditos: null,     // idem
      nombre: r['Asignatura'],
      nivel:  r['Nivel'].trim(),  // 'I'..'X'
      prerrequisitos: prereqs,    // códigos (num/str)
      area
    };
  });
}

function parseIctelCSV(text){
  const rows = parseCSV(text);

  const toRoman = (val)=>{
    const n = parseInt((val||'').trim(),10);
    return Number.isFinite(n) && n>=1 && n<=ALL_ROMANS.length
      ? ALL_ROMANS[n-1]
      : String(val||'').toUpperCase();
  };

  const guessArea = (sigla, nombre)=>{
    const p  = (sigla||'').split('-')[0].toUpperCase();
    const nm = (nombre||'').toLowerCase();
    if (p==='MAT' || p==='QUI') return 'Ciencias Básicas';
    if (p==='FIS') return 'Física';
    if (p==='ELO') return 'Electrónica';
    if (p==='HCW') return 'Inglés';
    if (p==='DEW') return 'Deportes';
    if (p==='INF') return 'Software';
    if (p==='TEL'){
      if (nm.includes('red')) return 'Redes';
      if (nm.includes('telecom')) return 'Telecomunicaciones';
      return 'Telecomunicaciones';
    }
    if (p==='IWN') return 'Formación General';
    if (p==='IWG') return 'Industrias';
    return '';
  };

  return rows.map(r=>{
    // normaliza llaves para buscar por alias
    const norm = {};
    for (const [k,v] of Object.entries(r)){
      const nk = k.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^a-z0-9]+/g,' ').trim();
      norm[nk] = (v||'').trim();
    }
    const pick = (...aliases) => {
  for (const a of aliases) {
    const na = a.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,' ').trim();
    if (na in norm && norm[na]) return norm[na];
  }
  return '';
};

    const numeroStr = pick('Número','Numero','Nº','N°','num','n');
    const numero    = parseInt(numeroStr,10) || null;

    let sigla  = pick('Sigla','Código','Codigo','Código Asignatura','Codigo Asignatura');
    let codigo = pick('Código Asignatura','Codigo Asignatura','Código','Codigo','Sigla');
    if (!sigla)  sigla  = codigo;
    if (!codigo) codigo = sigla;

    const nombre = pick('Asignatura','Nombre','Nombre Asignatura','Ramo');
    const nivel  = toRoman(pick('Nivel','Semestre','Periodo','Período','Romano'));

    let areaRaw  = pick('Área','Area','Línea','Linea','Linea/Área','Linea Area');
    if (!areaRaw) areaRaw = guessArea(sigla, nombre);

    const creditos = parseInt(pick('Créditos','Creditos','SCT','Créditos SCT','Sct','Cred'),10) || 0;

    // Prerrequisitos: permite "19/10", "19, 10", "19 y 10", "TEL-101"… y limpia ruido
    const prereqs = Object.keys(norm)
      .filter(k=> k.startsWith('prerrequisito'))
      .flatMap(k=>{
        return String(norm[k]||'')
          .replace(/\b(ingreso|sin|na|n\/a|none)\b/ig,'')
          .split(/[^\w-]+/g)  // conserva TEL-101
          .map(s=>s.trim())
          .filter(Boolean)
          .filter(s=> s!=='0' && s!=='-');
      });

    return {
      codigo, sigla, numero, creditos, nombre, nivel,
      prerrequisitos: prereqs,
      area: areaRaw
    };
  });
}

function parseCSV(text){
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  // Detecta separador: usa el que más columnas produzca en la cabecera
  const trySplit = (line, sep)=> line.split(sep).length;
  const head = lines[0];
  const sep = (trySplit(head,';') >= trySplit(head,',')) ? ';' : ',';

  const headers = head.split(sep).map(h => h.trim().replace(/^["']|["']$/g,''));
  return lines.slice(1).map(line=>{
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g,''));
    const o = {};
    headers.forEach((h,i)=> { o[h] = cols[i] ?? ''; });
    return o;
  });
}

/* ================= Render desde Perfil ================= */
function renderFromProfile() {
  logMalla('renderFromProfile()', state.profileData);

  // 🚫 No pisar si estás en una malla personalizada visible
  const section = document.getElementById('page-malla');
  if (!section) {
    logMalla('renderFromProfile() abortado: #page-malla aún no existe');
    return;
  }

  if (section.dataset.custom === 'true') {
    logMalla('renderFromProfile() cancelado: vista personalizada activa');
    return;
  }

  const uni = state.profileData?.university || '';
  const car = state.profileData?.career || '';

  // Elementos del shell (solo existen después de buildShell)
  const gridHeader = section.querySelector('.grid-header');
  const grid       = section.querySelector('.malla-grid');
  const info       = $('malla-info');
  const caption    = $('malla-caption');

  // Si el shell aún no está construido, sal silenciosamente
  if (!gridHeader || !grid || !info || !caption) {
    logMalla('renderFromProfile() abortado: shell de malla aún no construido');
    return;
  }

  // 🔓 siempre que vas a tu malla propia, quita solo-lectura
  setPartnerReadonly(false);

  // ---------------------------------------------------------
  // CASO 1: Perfil incompleto (Falta Universidad o Carrera)
  // ---------------------------------------------------------
  if (!uni || !car) {
  lastRenderedKey = '';
  gridHeader.style.display = 'none';
  info.style.display = 'none';

  grid.innerHTML = `
    <div style="
      grid-column:1/-1;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:40px 20px;
      min-height:280px;
      color:var(--muted);
    ">
      <div style="font-size:3rem;margin-bottom:12px;">🧩</div>
      <h3 style="color:#fff;margin:0 0 8px;">Aún no tienes malla configurada</h3>
      <p style="margin:0 0 18px;max-width:520px;line-height:1.5;">
        Puedes completar <b>Universidad</b> y <b>Carrera</b> en <b>Perfil</b> para usar una malla oficial,
        o crear una <b>malla personalizada</b> ahora.
      </p>
      <button id="btnCrearMallaInline" class="btn violet">+ Crear Malla Personalizada</button>
      <div class="muted" style="margin-top:10px;opacity:.75;font-size:.9rem;">
        (Esto funciona aunque no tengas Mayor/USM seleccionadas)
      </div>
    </div>
  `;

  // ✅ Botón: abre el builder igual
  setTimeout(() => {
    document.getElementById('btnCrearMallaInline')?.addEventListener('click', () => {
      openCustomMallaBuilder();
    });
  }, 0);

  return;
}

  // ---------------------------------------------------------
  // CASO 2: Perfil completo, pero NO es carrera oficial
  // ---------------------------------------------------------
  const esOficial = (UNI_CAREERS[uni] || []).includes(car);

  if (!esOficial) {
    lastRenderedKey = '';
    gridHeader.style.display = 'none';
    info.style.display = 'none';

    const nombreCarrera = CAREER_NAMES[car] || car;
    const nombreUni = readableUni(uni);
    grid.innerHTML = `
      <div style="
          grid-column: 1 / -1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          text-align: center; 
          padding: 40px 20px; 
          color: var(--muted);
          min-height: 300px;
          justify-content: center;
      ">
        <div style="font-size: 3rem; margin-bottom: 16px;">📂</div>
        
        <h3 style="color: #fff; margin-bottom: 10px; font-size: 1.4rem;">
          No hay malla oficial para esta carrera
        </h3>
        
        <p style="font-size: 1rem; margin-bottom: 24px; max-width: 500px; line-height: 1.5;">
          La carrera <strong style="color:var(--ink)">${nombreCarrera}</strong> en 
          <strong style="color:var(--ink)">${nombreUni}</strong> no tiene una estructura precargada.
        </p>
        
        <div style="
            background: rgba(99, 102, 241, 0.1); 
            border: 1px solid rgba(99, 102, 241, 0.3); 
            border-radius: 12px; 
            padding: 12px 20px;
        ">
          <p style="margin: 0; font-size: 0.9rem; color: #e0e7ff;">
            Usa el botón <b style="color: #a78bfa;">+ Crear Malla</b> (arriba a la derecha) <br>
            para crear tu propia malla personalizada.
          </p>
        </div>
      </div>
    `;
    
    caption.textContent = `${nombreUni} · ${nombreCarrera}`;
    return;
  }

  // ---------------------------------------------------------
  // CASO 3: Carrera Oficial (Render normal)
  // ---------------------------------------------------------
  const key = `${uni}:${car}`;
  if (key === lastRenderedKey) { 
    updatePercentage(document.getElementById('malla-wrapper')); 
    return; 
  }
  lastRenderedKey = key;

  caption.textContent = `${readableUni(uni)} · ${CAREER_NAMES[car] || car}`;
  logMalla('renderFromProfile() renderizando oficial...', state.profileData);
  renderMalla(car);
}


async function showMallaSelector() {
  const host = document.querySelector('#page-malla');
  if (!host) return;

  const containerId = 'malla-selector-container';
  let bar = document.getElementById(containerId);
  if (bar) bar.remove();

  const uni = state.profileData?.university || '';
  const carrera = state.profileData?.career || '';
  if (!uni || !carrera) return;

// 🔹 Reúne mallas personalizadas del usuario (con fallback/migración)
const { data: localData } = readCustomStore();
const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;

let personalizadas = localData[careerKey] || [];
personalizadas = personalizadas.filter(m => m?.nombre && m.nombre.trim() !== '');



  // 🔹 Si existe una malla oficial, añádela
  const tieneOficial = (UNI_CAREERS[uni] || []).includes(carrera);
  const opciones = [];
  if (tieneOficial) opciones.push({ nombre: `${CAREER_NAMES[carrera]} (Oficial)`, oficial: true });
  opciones.push(...personalizadas);

  // 🔹 Render UI
  bar = document.createElement('div');
  bar.id = containerId;
  bar.className = 'card';
  bar.style = 'padding:10px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;';
  bar.innerHTML = `
    <div>
      <label><b>Malla:</b></label>
      <select id="malla-selector" style="margin-left:8px;padding:4px;">
    ${opciones.length
    ? opciones.map(o => `
        <option value="${o.nombre}" ${o.oficial ? 'data-oficial="1"' : ''}>
          ${o.nombre}
        </option>`).join('')
    : '<option value="" disabled selected>— No hay mallas disponibles —</option>'}
</select>

    </div>
    <div>
      <button id="btnCrearMalla" class="btn violet">+ Crear Malla</button>
      ${personalizadas.length ? `
        <button id="btnEditarMalla" class="btn violet-outline">Editar</button>
        <button id="btnEliminarMalla" class="btn red">Borrar</button>
      ` : ''}
    </div>
  `;

  host.prepend(bar);

const sel = $('malla-selector');
const crearBtn = $('btnCrearMalla');
const editarBtn = $('btnEditarMalla');
const borrarBtn = $('btnEliminarMalla');

// 🛑 Si estás viendo malla de la party, bloquea el selector para que la RUEDA no cambie opciones
if (sel) {
  sel.addEventListener('wheel', (e) => {
    if (isPartnerView()) {
      e.preventDefault();      // evita que el wheel cambie option
      e.stopPropagation();
    }
  }, { passive: false });
}



// ✅ SIEMPRE habilitar el botón "Crear"
crearBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCustomMallaBuilder();
});

// ✅ Si NO hay opciones reales, deshabilita el select PERO deja "Crear" funcionando
if (!opciones.length) {
  if (sel) {
    sel.disabled = true;
    sel.style.opacity = '0.85';
    sel.style.pointerEvents = 'none';
  }
  return;
}

  // 🔁 Restaura la última malla seleccionada al recargar (solo si hay opciones reales)
  let inicialOpt = null;
  const ultima = localStorage.getItem('ultima_malla_seleccionada');

  if (sel) {
    if (ultima) {
      const opt = Array.from(sel.options).find(o => o.value === ultima);
      if (opt && !opt.disabled) inicialOpt = opt;
    }
    if (!inicialOpt && sel.options.length > 0) {
      // primera opción real (no disabled)
      inicialOpt = Array.from(sel.options).find(o => !o.disabled) || sel.options[0];
    }
  }
// ✅ Si estoy en modo edición, NO auto-renderices nada acá
if (isEditing()) {
  document.dispatchEvent(new Event('malla:selector-ready'));
  return;
}
  
 if (inicialOpt && sel && !inicialOpt.disabled) {
  if (isPartnerView()) {
    // ✅ en vista party no auto-renderizar mi malla
    document.dispatchEvent(new Event('malla:selector-ready'));
    return;
  }

  sel.value = inicialOpt.value;
  const isOficial = inicialOpt.dataset.oficial === '1';

  if (isOficial) renderMalla(carrera);
  else renderCustomMalla(inicialOpt.value);

  localStorage.setItem('ultima_malla_seleccionada', inicialOpt.value);
  syncActiveMallaToProfile(inicialOpt.value, !isOficial);
}

  // --- Eventos ---
sel?.addEventListener('change', e => {
  // ✅ Si estoy viendo la party, ignoro cambios del selector (rueda / accidental)
  if (isPartnerView()) {
    // opcional: vuelve a dejar el selector en lo que estaba antes
    const ultima = localStorage.getItem('ultima_malla_seleccionada');
    if (ultima) sel.value = ultima;
    return;
  }

  const val = e.target.value;
  const opt = sel.selectedOptions[0];
  const isOficial = opt?.dataset.oficial === '1';

  // Persistencia local + nube (tu malla activa real)
  localStorage.setItem('ultima_malla_seleccionada', val);
  syncActiveMallaToProfile(val, !isOficial);

  // Render de la malla correspondiente (YA en modo "mi malla")
  if (isOficial) renderMalla(carrera);
  else renderCustomMalla(val);
});

  editarBtn?.addEventListener('click', () => {
    const val = sel?.value;
    if (val) openCustomMallaBuilder(val);
  });
  // ... dentro de showMallaSelector ...

  borrarBtn?.addEventListener('click', async () => {
    const val = sel?.value || sel?.selectedOptions?.[0]?.textContent?.trim();
    if (!val || val.includes('(Oficial)')) return alert('Selecciona una malla personalizada para borrar.');
    if (!confirm(`¿Seguro que deseas borrar "${val}"?`)) return;

    // 1. Eliminar de la lista en memoria
    const idx = personalizadas.findIndex(m => m.nombre === val);
    if (idx >= 0) personalizadas.splice(idx, 1);

    // 2. Guardar cambio en LocalStorage
    writeCustomStore(cur => {
      const next = cur || {};
      next[careerKey] = personalizadas;
      return next;
    });

    // 3. Eliminar de Firebase (si hay usuario)
    try {
      const ref = doc(db, 'users', state.currentUser.uid, 'customMallas', val);
      await deleteDoc(ref);
    } catch (_) {}

    alert(`Malla "${val}" eliminada correctamente.`);

    // =========================================================
    // === FIX: LIMPIEZA DE ESTADO PARA SALIR AUTOMÁTICAMENTE ===
    // =========================================================
    
    // A) Quitar la marca de "malla personalizada" del HTML
    const page = document.getElementById('page-malla');
    if (page) {
      page.removeAttribute('data-custom'); // 👈 Clave: permite que renderFromProfile funcione
      page.removeAttribute('data-career'); // Limpia scope CSS por si acaso
    }

    // B) Eliminar barra superior de edición si existe
    const topBar = document.getElementById('malla-topbar');
    if (topBar) topBar.remove();

    // C) Resetear variables globales
    isEditingCustomMalla = false;
    lastRenderedKey = ''; // Forzar re-render

    // D) Olvidar la selección en localStorage para que no intente cargarla al refrescar
    localStorage.removeItem('ultima_malla_seleccionada');

    // E) Actualizar UI: Selector nuevo + Malla Oficial
    showMallaSelector();
    renderFromProfile(); 
  });

// Al final de showMallaSelector()
document.dispatchEvent(new Event('malla:selector-ready'));

}

/* =================== 🔧 NUEVO CONSTRUCTOR VISUAL DE MALLAS PERSONALIZADAS =================== */

async function openCustomMallaBuilder(editName = null) {
  const uid = state.currentUser?.uid || 'anon';
  const uni = state.profileData?.university || '';
  const carrera = state.profileData?.career || '';
  const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;
const { data: localData } = readCustomStore();
const existentes = localData[careerKey] || [];

  const existing = existentes.find(m => m.nombre === editName);

// --- Modal base ---
let modal = document.getElementById('mallaModal');
if (modal) modal.remove();
modal = document.createElement('div');
modal.id = 'mallaModal';
modal.className = 'modal-overlay';
modal.innerHTML = `
  <div class="crear-malla-modal">
    <h2 class="modal-title">${editName ? 'Editar Malla' : 'Crear Nueva Malla'}</h2>
    <div class="modal-body">
      <label>Nombre de la Malla:</label>
      <input id="malla-nombre" type="text" class="input" 
             placeholder="Ej: Mi Malla USM 2025" 
             value="${existing?.nombre || ''}"/>

      <label>Cantidad de Semestres:</label>
      <input id="malla-semestres" type="number" class="input" min="1" max="12" value="${existing?.semestres || 1}"/>

      <label>Cantidad de Áreas de Formación:</label>
      <input id="malla-num-areas" type="number" class="input" min="1" max="10" value="${existing?.areas?.length || 1}"/>
      
      <div id="malla-areas-container" class="inner-card"></div>

      <h3 class="inner-subtitle">Cantidad de Ramos por Semestre</h3>
      <div id="malla-semestres-container" class="inner-card"></div>
    </div>

    <div class="modal-actions">
      <button id="malla-generate" class="btn violet">Generar</button>
      <button id="malla-cancel" class="btn violet-outline">Cancelar</button>
    </div>
  </div>
`;
document.body.appendChild(modal);



  const elNombre = modal.querySelector('#malla-nombre');
  const elSemestres = modal.querySelector('#malla-semestres');
  const elNumAreas = modal.querySelector('#malla-num-areas');
  const elAreasCont = modal.querySelector('#malla-areas-container');
  const elSemCont = modal.querySelector('#malla-semestres-container');

  // Genera campos dinámicos
  function renderAreasInputs() {
    elAreasCont.innerHTML = '';
    const n = parseInt(elNumAreas.value, 10) || 1;
    for (let i = 1; i <= n; i++) {
      const area = existing?.areas?.[i-1] || {};
      elAreasCont.innerHTML += `
        <div class="row" style="align-items:center;gap:6px;margin-top:4px;">
          <label>Área ${i}:</label>
          <input type="text" class="input area-name" placeholder="Nombre del área" value="${area.nombre || ''}" style="flex:1;"/>
          <input type="color" class="area-color" value="${area.color || '#22c55e'}"/>
        </div>`;
    }
  }
  function renderSemInputs() {
    elSemCont.innerHTML = '';
    const n = parseInt(elSemestres.value, 10) || 1;
    for (let i = 1; i <= n; i++) {
      const prev = existing?.estructura?.find(e => e.semestre === i)?.ramos?.length || 3;
      elSemCont.innerHTML += `
        <div class="row" style="align-items:center;gap:6px;margin-top:4px;">
          <label>Semestre ${i}:</label>
          <input type="number" class="input sem-count" min="1" max="15" value="${prev}" data-sem="${i}" style="width:80px;"/>
        </div>`;
    }
  }

  renderAreasInputs();
  renderSemInputs();
  elNumAreas.addEventListener('input', renderAreasInputs);
  elSemestres.addEventListener('input', renderSemInputs);

  // --- Acciones ---
  modal.querySelector('#malla-cancel').onclick = () => modal.remove();
  modal.querySelector('#malla-generate').onclick = async () => {
    const nombre = elNombre.value.trim();
    const semestres = parseInt(elSemestres.value, 10);
    if (!nombre || !semestres) return alert('Completa los campos básicos.');

    // Áreas
    const areas = Array.from(elAreasCont.querySelectorAll('.row')).map(row => ({
      nombre: row.querySelector('.area-name').value.trim(),
      color: row.querySelector('.area-color').value
    }));

    // Estructura (ramos vacíos)
    const estructura = Array.from(elSemCont.querySelectorAll('.sem-count')).map(inp => ({
      semestre: parseInt(inp.dataset.sem, 10),
      ramos: Array.from({ length: parseInt(inp.value, 10) }, (_ , i) => ({
  _id: `${nombre}::S${parseInt(inp.dataset.sem,10)}-I${i}`,
  nombre: '',
  codigo: '',
  area: areas[0]?.nombre || '',
  prerrequisitos: []
}))

 // ramos vacíos
    }));

    const malla = { nombre, carrera, universidad: uni, semestres, areas, estructura, updatedAt: Date.now() };
    // 🔐 IDs estables por posición (no dependen del contador visual)
ensureStableIds(malla);


    // Guardar local + Firestore
    writeCustomStore(cur => {
  const base = cur || {};
  const arr = Array.isArray(base[careerKey]) ? base[careerKey] : [];
  const i = arr.findIndex(x => x?.nombre === nombre);
  if (i >= 0) arr[i] = malla; else arr.push(malla);
  base[careerKey] = arr;
  return base;
});


    if (state.currentUser) await setDoc(doc(db, 'users', uid, 'customMallas', nombre), malla);

    modal.remove();

// ✅ marca esta malla como la última seleccionada (para que el selector la tome)
localStorage.setItem('ultima_malla_seleccionada', nombre);
syncActiveMallaToProfile(nombre, true);
isEditingCustomMalla = true;
// ✅ primero refresca selector
await showMallaSelector();

// ✅ y DESPUÉS forza modo edición (para que no te lo pise el selector)
renderEditableMalla(malla);
  };
  // al cerrar modal o salir:
isEditingCustomMalla = false;

}

// Devuelve un Map: codigo -> { n (contador visual 1..), colorHex }
function buildCodigoToInfoMap(malla){
  const map = new Map();
  let n = 1;
  (malla.estructura || []).forEach(semObj => {
    (semObj.ramos || []).forEach(r => {
      const nom = (r?.nombre||'').trim();
      const cod = (r?.codigo||'').trim();
      if (!nom && !cod) return; // ignora placeholders vacíos
      const color = (malla.areas.find(a => a.nombre === r.area)?.color) || '#999';
      if (cod) map.set(cod, { n, color });
      // también deja una clave "solo dígitos" como fallback: PSI1103 -> 1103
      const onlyDigits = cod.replace(/^[A-Za-z-]+/, '');
      if (onlyDigits && !map.has(onlyDigits)) map.set(onlyDigits, { n, color });
      n++;
    });
  });
  return map;
}

function prerreqBadgesHTML(prereqs, codigoMap){
  return (prereqs||[]).map(pr => {
    const key = String(pr).trim();
    const info = codigoMap.get(key) || codigoMap.get(key.replace(/^[A-Za-z-]+/,''));
    if (info){
      return `<span class="prereq-label" style="background:${info.color}">${info.n}</span>`;
    }
    // si no encontramos el ramo, mostramos el sufijo numérico como antes
    return `<span class="prereq-label">${key.replace(/^[A-Za-z-]+/, '')}</span>`;
  }).join('');
}



/**
 * Renderiza una malla editable con bloques vacíos
 */
function renderEditableMalla(malla) {
  // 🔐 Garantiza que cada ramo tenga un _id estable
ensureStableIds(malla);


  const page = document.getElementById('page-malla');
  if (page) page.dataset.custom = 'true';
  isEditingCustomMalla = true;

  const host = document.querySelector('#page-malla .malla-grid');
  const gridHeader = document.querySelector('#page-malla .grid-header');
  const info = $('malla-info');
  host.innerHTML = '';
  gridHeader.innerHTML = '';

  // Cabecera
  gridHeader.style.display = 'grid';
  gridHeader.style.gridTemplateColumns = `repeat(${malla.semestres}, 1fr)`;

  const years = Math.ceil(malla.semestres / 2);
  for (let y = 1; y <= years; y++) {
    const year = document.createElement('div');
    year.className = 'year';
    year.textContent = `Año ${y}`;
    year.style.gridColumn = `${(y - 1) * 2 + 1} / span 2`;
    gridHeader.appendChild(year);
  }

  // Fila 2: SEMESTRES (Números Romanos)
  for (let i = 1; i <= malla.semestres; i++) {
    const s = document.createElement('div');
    s.className = 'sem';
    s.textContent = ALL_ROMANS[i - 1] || i; // Usa el array ROMANS definido arriba
    gridHeader.appendChild(s);
  }

  // Celdas
  let counter = 1;
  host.style.gridTemplateColumns = `repeat(${malla.semestres}, 1fr)`;

  const codigoMap = buildCodigoToInfoMap(malla);
  malla.estructura.forEach((semObj) => {
    semObj.ramos.forEach((r, i) => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.style.gridColumn = semObj.semestre;
      div.dataset.sem = String(ALL_ROMANS[(Number(semObj.semestre) - 1) % ALL_ROMANS.length] || semObj.semestre);

div.dataset.idx = String(i);    
      const color = malla.areas.find(a => a.nombre === r.area)?.color || '#666';
      div.style.background = color;
     // 🔹 SIEMPRE usa el _id estable
div.dataset.codigo = (r && r._id) || `${malla.nombre}::S${semObj.semestre}-I${i}`;



div.innerHTML = `
  <div class="top-bar">
    <span class="sigla-label">${(r.codigo || '').trim()}</span>
    <span class="num-label">${counter}</span>
  </div>
  <div class="course-name">${r.nombre || ''}</div>
  <div class="bottom-bar"></div>
`;

const bot = div.querySelector('.bottom-bar');
bot.innerHTML = prerreqBadgesHTML(r.prerrequisitos, codigoMap);

      // evento: editar
      div.onclick = (ev) => {
  ev.stopPropagation();                 // ⛔ evita que llegue al listener global
  openEditRamoModal(div, malla, semObj.semestre, i);
};
      host.appendChild(div);
      counter++;
    });
  });

// Botones arriba
// Limpia cualquier barra anterior
const oldBar = document.querySelector('#malla-topbar');
if (oldBar) oldBar.remove();

// Botones arriba
const topBar = document.createElement('div');
topBar.id = 'malla-topbar';
topBar.className = 'card';
topBar.style = `
  margin: 12px 0;
  padding: 10px 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  backdrop-filter: blur(8px);
`;
topBar.innerHTML = `
  <button class="btn violet-outline" id="editAreasBtn">Editar Áreas</button>
  <button class="btn violet" id="saveCustomMallaBtn">Guardar Malla</button>
  <button class="btn gray" id="exitEditBtn">Salir del Modo Edición</button>
`;
host.parentElement.prepend(topBar);

$('editAreasBtn').onclick = () => openEditAreasModal(malla);
$('saveCustomMallaBtn').onclick = () => saveCustomMalla(malla);
$('exitEditBtn').onclick = () => {
  isEditingCustomMalla = false; 
  setPartnerReadonly(false);
  renderCustomMalla(malla.nombre);
};


isEditingCustomMalla = true; // 🔹 Activamos modo edición

  // 🔢 Asegura numeración secuencial al generar la malla
renumerarMalla(document);
renderLegendForAreas(malla.areas);

// al cerrar modal o salir:

}




/**
 * Modal para editar un ramo vacío
 */
function openEditRamoModal(div, malla, sem, index) {
  let modal = document.getElementById('ramoModal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'ramoModal';
  modal.className = 'modal-overlay';

  // ✅ Toma el ramo actual (si existe) para prellenar
  const prev = (malla.estructura.find(e => e.semestre === sem)?.ramos?.[index]) || {};

  const areasOptions = malla.areas
    .map(a => `<option value="${a.nombre}">${a.nombre}</option>`)
    .join('');

  modal.innerHTML = `
    <div class="card modal-card" style="max-width:460px;">
      <h3>Editar Ramo</h3>
      <div class="modal-body">
        <label>Nombre:</label>
        <input id="ramo-nombre" class="input" placeholder="Ej: Matemáticas I"/>

        <label>Código:</label>
        <input id="ramo-codigo" class="input" placeholder="Ej: MAT101"/>

        <label>Área:</label>
        <select id="ramo-area" class="input">${areasOptions}</select>

        <label>Prerrequisitos:</label>
        <input id="ramo-prereq" class="input" placeholder="Ej: MAT100, FIS100"/>
      </div>
      <div class="modal-actions">
        <button id="ramo-save" class="btn violet">Guardar</button>
        <button id="ramo-cancel" class="btn gray">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ✅ Prellenado con lo que ya tenía
  $('ramo-nombre').value = (prev.nombre || '').trim();
  $('ramo-codigo').value = (prev.codigo || '').trim();
  $('ramo-area').value   = (prev.area || malla.areas?.[0]?.nombre || '');
  $('ramo-prereq').value = Array.isArray(prev.prerrequisitos) ? prev.prerrequisitos.join(', ') : '';

  $('ramo-cancel').onclick = () => modal.remove();
  $('ramo-save').onclick = () => {
  try {
    const nombre  = $('ramo-nombre').value.trim();
    if (!nombre) return alert('Falta el nombre del ramo.');
    const codigo  = $('ramo-codigo').value.trim();
    const area    = $('ramo-area').value;
    const prereqs = $('ramo-prereq').value.split(',').map(p => p.trim()).filter(Boolean);

    // Modelo
    const semObj  = malla.estructura.find(e => e.semestre === sem);
    const before  = semObj?.ramos?.[index] || {};
    const stableId = before._id || `${malla.nombre}::S${sem}-I${index}`;

    semObj.ramos[index] = {
      ...before,
      _id: stableId,
      nombre, codigo, area,
      prerrequisitos: prereqs
    };

    // DOM
    const color = malla.areas.find(a => a.nombre === area)?.color || '#ccc';
    div.style.background = color;
    div.dataset.codigo = stableId;

    // Top bar (izq: código, der: número)
    let top = div.querySelector('.top-bar');
    if (!top) { top = document.createElement('div'); top.className = 'top-bar'; div.prepend(top); }

    let sigla = top.querySelector('.sigla-label');
    if (!sigla) { sigla = document.createElement('span'); sigla.className = 'sigla-label'; top.prepend(sigla); }
    sigla.textContent = codigo || '';

    // Nombre
    let nameEl = div.querySelector('.course-name');
    if (!nameEl) { nameEl = document.createElement('div'); nameEl.className = 'course-name'; top.insertAdjacentElement('afterend', nameEl); }
    nameEl.textContent = nombre;

    // Prerrequisitos (⚠️ primero crea el nodo, luego calcula el mapa)
    let bot = div.querySelector('.bottom-bar');
    if (!bot) { bot = document.createElement('div'); bot.className = 'bottom-bar'; nameEl.insertAdjacentElement('afterend', bot); }

    const codigoMap = buildCodigoToInfoMap(malla);
    bot.innerHTML = prerreqBadgesHTML(prereqs, codigoMap);

    // Numeración y persistencia local del borrador
    renumerarMalla(document);
    writeCustomStore(cur => {
      const uni = malla.universidad || state.profileData?.university || '';
      const carrera = malla.carrera || state.profileData?.career || '';
      const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;
      const base = cur || {};
      const arr  = Array.isArray(base[careerKey]) ? base[careerKey] : [];
      const i = arr.findIndex(x => x?.nombre === malla.nombre);
      const snap = JSON.parse(JSON.stringify(malla));
      if (i >= 0) arr[i] = snap; else arr.push(snap);
      base[careerKey] = arr;
      return base;
    });

    // ✅ cerrar el modal automáticamente
    modal.remove();
  } catch (e) {
    console.error(e);
    alert('Ocurrió un error al guardar. Revisa la consola.');
  }
};

}



function openEditAreasModal(malla) {
  let modal = document.getElementById('areasModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'areasModal';
  modal.className = 'modal-overlay';
  
  // --- Estructura del Modal ---
  modal.innerHTML = `
    <div class="card modal-card" style="max-width:500px; display:flex; flex-direction:column; max-height:90vh;">
      <h3>Editar Áreas Formativas</h3>
      
      <div id="areasList" class="modal-body" style="overflow-y:auto; padding-right:5px; margin-bottom:10px;">
        </div>

      <div style="text-align:right; margin-bottom:12px;">
        <button id="btn-add-area" class="btn violet-outline" style="font-size:0.85rem; padding:6px 12px;">
          + Agregar nueva área
        </button>
      </div>

      <div class="modal-actions" style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px; margin-top:auto;">
        <button id="areas-save" class="btn violet">Guardar Cambios</button>
        <button id="areas-cancel" class="btn gray">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const list = modal.querySelector('#areasList');

  // --- Helper para crear fila ---
  const createAreaRow = (nombre = '', color = '#6366f1') => {
    const row = document.createElement('div');
    row.className = 'row area-row'; 
    row.style = 'align-items:center; gap:8px; margin-top:8px; display:flex;';
    
    row.innerHTML = `
      <input type="text" class="input area-name" value="${nombre}" placeholder="Nombre" style="flex:1;"/>
      <input type="color" class="area-color" value="${color}" style="width:40px; height:36px; padding:0; border:none; background:transparent; cursor:pointer;"/>
      <button class="btn-del-area" title="Eliminar" style="
          background:rgba(239,68,68,0.15); color:#fca5a5; border:none; 
          border-radius:8px; width:36px; height:36px; cursor:pointer; 
          display:flex; align-items:center; justify-content:center;">
        ✕
      </button>
    `;

    row.querySelector('.btn-del-area').onclick = () => {
       // Pequeña confirmación para evitar borrados accidentales
       if(confirm('¿Borrar esta área?')) row.remove();
    };
    list.appendChild(row);
  };

  // 1. Cargar datos actuales
  (malla.areas || []).forEach(a => createAreaRow(a.nombre, a.color));

  // 2. Botón Agregar
  modal.querySelector('#btn-add-area').onclick = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    createAreaRow('', randomColor);
    list.scrollTop = list.scrollHeight;
  };

  // 3. Botón Cerrar (Cancelar)
  modal.querySelector('#areas-cancel').onclick = () => modal.remove();

  // 4. Botón GUARDAR (Lógica corregida)
  modal.querySelector('#areas-save').onclick = () => {
    // A) Recolectar datos
    const rows = Array.from(list.querySelectorAll('.area-row'));
    const updatedAreas = rows.map(r => ({
      nombre: r.querySelector('.area-name').value.trim(),
      color: r.querySelector('.area-color').value
    })).filter(a => a.nombre !== '');

    // B) Actualizar objeto en memoria
    malla.areas = updatedAreas;

    // C) Actualizar visuales (Leyenda y Grilla) inmediatamente
    renderLegendForAreas(malla.areas);

    // Refrescar colores de los ramos ya visibles en la pantalla
    document.querySelectorAll('#page-malla .malla-grid .grid-item').forEach(div => {
      let areaNameOfRamo = '';
      // Buscamos a qué área pertenece este ramo en la estructura de datos
      for(const sem of malla.estructura) {
        const rFound = sem.ramos.find(r => 
           (r._id && r._id === div.dataset.codigo) || 
           (r.nombre && r.nombre === div.querySelector('.course-name')?.textContent)
        );
        if(rFound) { areaNameOfRamo = rFound.area; break; }
      }
      // Aplicar nuevo color si existe
      const newAreaDef = malla.areas.find(a => a.nombre === areaNameOfRamo);
      div.style.background = newAreaDef ? newAreaDef.color : '#333';
    });

    // D) Guardado SILENCIOSO en LocalStorage (sin alerta, sin llamar a saveCustomMalla)
    // Esto es solo para no perder cambios si el usuario refresca antes de darle a "Guardar Malla" arriba.
    writeCustomStore(cur => {
      const uni = malla.universidad || state.profileData?.university || '';
      const carrera = malla.carrera || state.profileData?.career || '';
      const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;
      const base = cur || {};
      const arr = Array.isArray(base[careerKey]) ? base[careerKey] : [];
      
      // Buscar y reemplazar la malla en el array local
      const idx = arr.findIndex(x => x?.nombre === malla.nombre);
      if (idx >= 0) arr[idx] = malla; 
      else arr.push(malla);
      
      base[careerKey] = arr;
      return base;
    });

    // E) Cerrar modal y nada más.
    modal.remove();
  };
}

async function saveCustomMalla(malla) {
  console.group("saveCustomMalla DEBUG");
  console.log("Entrada malla:", malla);
  console.log("state.currentUser:", state.currentUser);
  console.log("state.profileData:", state.profileData);
  console.groupEnd();
  ensureStableIds(malla);

  // 🔹 Asegura campos críticos
  const uid = state.currentUser?.uid || 'anon';
  const uni = malla.universidad || state.profileData?.university || '';
  const carrera = malla.carrera || state.profileData?.career || '';
  if (!uni || !carrera) {
    alert('Error: faltan datos de universidad o carrera.');
    console.error('saveCustomMalla → universidad/carrera indefinidas:', { uni, carrera });
    return;
  }

  const localKey = `custom_mallas_${uid}`;
  const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;

  const localData = JSON.parse(localStorage.getItem(localKey) || '{}');

// 🔹 Ensambla ramos "planos" desde estructura (y si viniera vacío, cae a DOM)
const ramos = [];

// 1) desde estructura
(malla.estructura || []).forEach((semObj, semIndex) => {
  (semObj.ramos || []).forEach((r, i) => {
    const nom = (r?.nombre || '').trim();
    const cod = (r?.codigo || '').trim();
    if (nom || cod) {
      ramos.push({
        ...r,
        _id: r._id || `${malla.nombre}::S${semObj.semestre}-I${i}`,
        nombre: nom,
        codigo: cod,
        semestre: semObj.semestre,
        index: i + 1 + semIndex * 100,
      });
    }
  });
});

// 2) fallback: si no encontró nada en estructura, reconstruye desde el DOM visible
if (ramos.length === 0) {
  const grid = document.querySelector('#page-malla .malla-grid');
  if (grid) {
    const items = grid.querySelectorAll('.grid-item');
    items.forEach(div => {
      const sem = parseInt(div.dataset.sem, 10);
      const idx = parseInt(div.dataset.idx, 10);
      const nombre = (div.querySelector('.course-name')?.textContent || '').trim();
      const codigo = (div.querySelector('.sigla-label')?.textContent || '').trim();
      if ((nombre || codigo) && Number.isFinite(sem) && Number.isFinite(idx)) {
        ramos.push({
          _id: div.dataset.codigo || `${malla.nombre}::S${sem}-I${idx}`,
          nombre,
          codigo,
          area: malla.areas?.[0]?.nombre || '',
          prerrequisitos: [],
          semestre: sem,
          index: idx + 1 + (sem - 1) * 100,
        });
        // además refleja de vuelta en la estructura en memoria
        const semObj = (malla.estructura || []).find(s => s.semestre === sem);
        if (semObj && semObj.ramos && semObj.ramos[idx]) {
          semObj.ramos[idx] = {
            ...(semObj.ramos[idx] || {}),
            _id: div.dataset.codigo || `${malla.nombre}::S${sem}-I${idx}`,
            nombre,
            codigo,
            area: semObj.ramos[idx].area || (malla.areas?.[0]?.nombre || ''),
            prerrequisitos: Array.isArray(semObj.ramos[idx].prerrequisitos) ? semObj.ramos[idx].prerrequisitos : [],
          };
        }
      }
    });
  }
}


// ❌ Evita sobreescribir con una versión vacía
if (ramos.length === 0) {
  alert('No hay ramos con nombre o código. No se guardó.');
  return;
}

// 🔹 Normaliza antes de guardar (evita refs vivas)
const snapshot = {
  ...malla,
  universidad: uni,
  carrera,
  ramos,
  updatedAt: Date.now(),
};
const toStore = JSON.parse(JSON.stringify(snapshot));

writeCustomStore(cur => {
  const base = cur || {};
  const arr = Array.isArray(base[careerKey]) ? base[careerKey] : [];
  const i = arr.findIndex(m => m?.nombre === malla.nombre);
  if (i >= 0) arr[i] = toStore; else arr.push(toStore);
  base[careerKey] = arr;
  return base;
});

// 🔹 Firestore (opcional si hay sesión)
if (state.currentUser) {
  try {
    await setDoc(doc(db, 'users', uid, 'customMallas', malla.nombre), toStore, { merge: true });
  } catch (err) {
    console.error('Error guardando en Firestore:', err);
  }
}

alert('Malla guardada.');
isEditingCustomMalla = false;
document.getElementById('page-malla').dataset.custom = 'true';
localStorage.setItem('ultima_malla_seleccionada', malla.nombre);
syncActiveMallaToProfile(malla.nombre, true);

// ✅ Render inmediato desde lo recién guardado
renderCustomMalla(malla.nombre);
showMallaSelector();




}



function normalizeKey(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .toUpperCase();
}

// 🧹 Borra completamente mallas (oficial + personalizadas) de una carrera antigua
async function wipeCareerData(oldUni, oldCareer) {
  if (!oldUni || !oldCareer) return;

  const uid = state.currentUser?.uid || 'anon';
  const careerKey = `${normalizeKey(oldUni)}:${normalizeKey(oldCareer)}`;

  console.log('[malla] wipeCareerData()', { oldUni, oldCareer, careerKey });

  // 1) borrar aprobados de malla oficial de esa carrera
  localStorage.removeItem(`mallaAprobados:${oldUni}:${oldCareer}`);

  // 2) leer mallas personalizadas de ESA carrera
  const { data } = readCustomStore();
  const customList = Array.isArray(data[careerKey]) ? data[careerKey] : [];

  // 3) borrar estado de "aprobado" de cada malla personalizada de esa carrera
  customList.forEach(m => {
    if (!m?.nombre) return;
    const k = `mallaCustomAprobados:${uid}:${m.nombre}`;
    localStorage.removeItem(k);
  });

  // 4) eliminar todas las mallas personalizadas de esa carrera del store local
  writeCustomStore(cur => {
    const base = cur || {};
    const cloned = { ...base };
    delete cloned[careerKey];
    return cloned;
  });

  // 5) si la última malla seleccionada era alguna de las que acabo de borrar → limpiar
  const ultima = localStorage.getItem('ultima_malla_seleccionada');
  if (ultima && customList.some(m => m?.nombre === ultima)) {
    localStorage.removeItem('ultima_malla_seleccionada');
  }

  // 6) limpiar en Firestore (si el usuario está logueado)
  if (state.currentUser) {
    try {
      // resetear última malla en el perfil
      await setDoc(doc(db, 'users', uid), {
        ultima_malla_seleccionada: null,
        ultima_malla_es_custom: false,
      }, { merge: true });

      // borrar solo las customMallas de esa carrera/universidad
      const snap = await getDocs(collection(db, 'users', uid, 'customMallas'));
      const toDelete = [];
      snap.forEach(d => {
        const m = d.data();
        if (m?.carrera === oldCareer && m?.universidad === oldUni) {
          toDelete.push(d.ref);
        }
      });

      for (const ref of toDelete) {
        await deleteDoc(ref);
      }

      console.log('[malla] wipeCareerData() → Firestore limpiado para', oldUni, oldCareer);
    } catch (err) {
      console.warn('[malla] No se pudo limpiar Firestore al cambiar de carrera', err);
    }
  }
}



function ensureStableIds(malla){
  (malla.estructura || []).forEach(semObj=>{
    (semObj.ramos || []).forEach((r, i)=>{
      if (!r) return;
      if (!r._id || typeof r._id !== 'string' || !r._id.trim()){
        // ID estable por malla + posición (no depende del contador visual)
        r._id = `${malla.nombre}::S${semObj.semestre}-I${i}`;
      }
    });
  });
}


/**
 * Renderiza una malla personalizada.
 * Si opts.isDuo === true, se muestra en modo solo-lectura como "vista de la otra persona"
 * y se usan datos desde duoCustomCache si están disponibles.
 */
function renderCustomMalla(nombre, opts = {}) {
  const isDuoView = !!opts.isDuo;

  const hostRoot = $('malla-host');
  if (hostRoot && !hostRoot.dataset.ready) {
    buildShell(hostRoot);
    hostRoot.dataset.ready = '1';
  }

  // 1. Obtener datos
  const uni = state.profileData?.university || '';
  const carrera = state.profileData?.career || '';
  const careerKey = `${normalizeKey(uni)}:${normalizeKey(carrera)}`;
  const { data: localData } = readCustomStore();

  // 1A) Primero probar cache del dúo
  let malla = duoCustomCache.get(nombre);

  // 1B) Si no está en cache, buscar en tus propias mallas
  if (!malla) {
    malla = (localData[careerKey] || []).find(m => m?.nombre === nombre);
    if (!malla) {
      const all = Object.values(localData).flat();
      malla = all.find(m => m && m.nombre === nombre);
    }
  }

  if (!malla) {
  const grid = document.querySelector('#page-malla .malla-grid');
  if (grid) {
    grid.innerHTML = `<div class="muted">No se encontró esa malla personalizada. Crea una nueva con <b>+ Crear Malla</b>.</div>`;
  }
  return;
}

  const page = document.getElementById('page-malla');
  if (page) page.dataset.custom = 'true';

  // En vista propia: editable; en vista dúo: solo lectura
  isEditingCustomMalla = false;
  setPartnerReadonly(isDuoView);

  ensureStableIds(malla);

  // Normalizar array de ramos si viene de estructura antigua
  let ramosRender = malla.ramos || [];
  if (!ramosRender.length && Array.isArray(malla.estructura)) {
    malla.estructura.forEach((semObj, sIdx) => {
      (semObj.ramos || []).forEach((r, rIdx) => {
        if ((r.nombre||'').trim() || (r.codigo||'').trim()) {
          ramosRender.push({
            ...r,
            semestre: semObj.semestre,
            _id: r._id || `${malla.nombre}::S${semObj.semestre}-I${rIdx}`
          });
        }
      });
    });
  }

  const host = document.querySelector('#page-malla .malla-grid');
  const gridHeader = document.querySelector('#page-malla .grid-header');
  const info = $('malla-info');
  
  if (!host) return;

  host.innerHTML = '';
  gridHeader.innerHTML = '';
  
  // Configurar Grilla CSS
  const cssCols = `repeat(${malla.semestres}, 1fr)`;
  gridHeader.style.display = 'grid';
  gridHeader.style.gridTemplateColumns = cssCols;
  host.style.gridTemplateColumns = cssCols;

  // --- CABECERA (Años y Semestres) ---
  const years = Math.ceil(malla.semestres / 2);
  for (let y = 1; y <= years; y++) {
    const yearDiv = document.createElement('div');
    yearDiv.className = 'year';
    yearDiv.textContent = `Año ${y}`;
    yearDiv.style.gridColumn = `${(y - 1) * 2 + 1} / span 2`;
    yearDiv.dataset.year = String(y);
    yearDiv.style.cursor = 'pointer';
    yearDiv.onclick = () => toggleYear(y);
    gridHeader.appendChild(yearDiv);
  }

  for (let i = 1; i <= malla.semestres; i++) {
    const sDiv = document.createElement('div');
    sDiv.className = 'sem';
    const roman = ALL_ROMANS[i - 1] || i;
    sDiv.textContent = roman;
    sDiv.dataset.sem = roman;
    sDiv.style.cursor = 'pointer';
    sDiv.onclick = () => toggleSemester(roman);
    gridHeader.appendChild(sDiv);
  }

  // --- RAMOS ---
  let counter = 1;
  ramosRender.forEach(r => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    
    const semNum = safeInt(r.semestre, 1);
    div.style.gridColumn = semNum >= 1 && semNum <= 12 ? String(semNum) : 'auto';

    // Color
    const areaDef = malla.areas?.find(a => a.nombre === r.area);
    div.style.background = areaDef?.color || '#444';

    // DATASETS
    const stableId = (r._id || r.codigo || '').trim();
    div.dataset.codigo  = stableId; 
    div.dataset.key     = (r.codigo || '').trim();
    div.dataset.prereqs = JSON.stringify(Array.isArray(r.prerrequisitos) ? r.prerrequisitos : []);
    
    const roman = ALL_ROMANS[(semNum - 1) % ALL_ROMANS.length] || String(semNum);
    div.dataset.sem  = roman; 
    div.dataset.year = String(Math.ceil(semNum / 2));

    div.innerHTML = `
      <div class="top-bar">
        <span class="sigla-label">${r.codigo || ''}</span>
        <span class="num-label">${counter}</span>
      </div>
      <div class="course-name">${r.nombre || ''}</div>
      <div class="bottom-bar"></div>
    `;

    const bot = div.querySelector('.bottom-bar');
    (r.prerrequisitos || []).forEach(pr => {
      const p = document.createElement('span');
      p.className = 'prereq-label';
      const padre = ramosRender.find(x => x.codigo === pr || x._id === pr);
      if (padre) {
        const padreIndex = ramosRender.indexOf(padre) + 1;
        p.textContent = padreIndex;
        const pArea = malla.areas?.find(a => a.nombre === padre.area);
        if (pArea) p.style.background = pArea.color;
      } else {
        p.textContent = String(pr).replace(/^[A-Za-z-]+/, '');
      }
      bot.appendChild(p);
    });

    host.appendChild(div);
    counter++;
  });

  renumerarMalla(document);
  info.style.display = 'block';
  renderLegendForAreas(malla.areas);

  const caption = $('malla-caption');
  if (caption) {
    caption.textContent = isDuoView
      ? `${malla.nombre} · (vista de la otra persona)`
      : `${malla.nombre} · Personalizada`;
  }

  // Barra superior
  const oldBar = document.querySelector('#malla-topbar');
  if (oldBar) oldBar.remove();
  const topBar = document.createElement('div');
  topBar.id = 'malla-topbar';
  topBar.className = 'card';
  topBar.style = `
    margin: 12px 0;
    padding: 10px 16px;
    display: flex;
    justify-content: flex-end;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    backdrop-filter: blur(8px);
  `;

  if (!isDuoView) {
    topBar.innerHTML = `<button class="btn violet-outline" id="configurarMallaBtn">Configurar Malla</button>`;
    host.parentElement.prepend(topBar);
    $('configurarMallaBtn').onclick = () => renderEditableMalla(malla);
  } else {
    host.parentElement.prepend(topBar);
  }

  const wrapper = document.querySelector('#malla-wrapper');

  // Solo cargar tu propio estado si NO es vista de dúo
  if (!isDuoView && wrapper) {
    loadStateCustom(wrapper, malla.nombre);
    actualizarDependencias(wrapper);
    updatePercentage(wrapper);
  }

  console.log('Malla personalizada cargada, lógica activa. isDuoView=', isDuoView);
}




/* === Integración: muestra selector al renderizar === */
document.addEventListener('profile:ready', showMallaSelector);
document.addEventListener('profile:changed', showMallaSelector);


function readableUni(code){
  if (code==='UMAYOR') return 'Universidad Mayor';
  if (code==='USM') return 'UTFSM';
  return code || '—';
}

/* ================= Render malla ================= */
function renderMalla(careerCode){
  logMalla('renderMalla()', careerCode);

  const section = $('page-malla');
  if (!section) {
    logMalla('renderMalla() abortado: #page-malla aún no existe');
    return;
  }

  const gridHeader = section.querySelector('.grid-header');
  const grid       = section.querySelector('.malla-grid');
  const info       = $('malla-info');

  // Si el shell todavía no está construido, salir silenciosamente
  if (!gridHeader || !grid || !info) {
    logMalla('renderMalla() abortado: shell de malla aún no construido');
    return;
  }

  // 🔧 Siempre que vuelvas a malla oficial, sal de edición y desbloquea
  isEditingCustomMalla = false;
  // respeta el modo: si estás viendo al dúo => readonly, si no => editable
  setPartnerReadonly(isPartnerView());

  section.removeAttribute('data-custom');
  section.dataset.career = careerCode; // scope CSS por carrera


  grid.innerHTML = '';
  if (!careerCode){
    gridHeader.style.display = 'none';
    info.style.display = 'none';
    return;
  }

  const asigs = carrerasData[careerCode] || [];
  if (!asigs.length){
    grid.innerHTML = `<div class="muted">Malla en preparación.</div>`;
    gridHeader.style.display = 'none';
    info.style.display = 'none';
    return;
  }

  // ---------- Cabecera dinámica (años + semestres presentes) ----------
  const levels = Array.from(new Set(asigs.map(a => a.nivel))).sort((a,b)=>romanIndex(a)-romanIndex(b));
  const years  = Math.ceil(levels.length/2);

  // Ajusta número de columnas tanto en header como en grilla
  gridHeader.style.gridTemplateColumns = `repeat(${levels.length}, 1fr)`;
  grid.style.gridTemplateColumns       = `repeat(${levels.length}, 1fr)`;

  gridHeader.innerHTML = '';
  // fila AÑOS
  for (let y=1; y<=years; y++){
    const yearDiv = document.createElement('div');
    yearDiv.className = 'year';
    yearDiv.dataset.year = String(y);
    yearDiv.title = `Marcar Año ${y}`;
    yearDiv.style.cursor = 'pointer';
    yearDiv.textContent = `Año ${y}`;
    // coloca el año sobre dos columnas (2 semestres)
    yearDiv.style.gridColumn = `${(y-1)*2+1} / span 2`;
    gridHeader.appendChild(yearDiv);
  }
  // fila SEMESTRES
  levels.forEach((sem)=>{
    const semDiv = document.createElement('div');
    semDiv.className = 'sem';
    semDiv.dataset.sem = sem;
    semDiv.title = `Marcar semestre ${sem}`;
    semDiv.style.cursor = 'pointer';
    semDiv.textContent = sem;
    gridHeader.appendChild(semDiv);
  });
  gridHeader.style.display = 'grid';

  // listeners de la cabecera
  gridHeader.querySelectorAll('.year').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (isPartnerView() || $('malla-wrapper')?.dataset.readonly === '1') return; // ⛔ bloquea en duo
      toggleYear(parseInt(btn.dataset.year,10));
    });
  });
  gridHeader.querySelectorAll('.sem').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (isPartnerView() || $('malla-wrapper')?.dataset.readonly === '1') return; // ⛔ bloquea en duo
      toggleSemester(btn.dataset.sem);
    });
  });

  // ---------- Leyenda por carrera ----------
  const legend = section.querySelector('.legend');
  if (careerCode === 'ICTEL'){
    legend.innerHTML = `
      <span><span class="legend-color cb"></span>Ciencias Básicas</span>
      <span><span class="legend-color software"></span>Software</span>
      <span><span class="legend-color fisica"></span>Física</span>
      <span><span class="legend-color transversal"></span>Transversal e Integración</span>
      <span><span class="legend-color fg"></span>Formación General</span>
      <span><span class="legend-color deportes"></span>Deportes</span>
      <span><span class="legend-color redes"></span>Redes</span>
      <span><span class="legend-color ingles"></span>Inglés</span>
      <span><span class="legend-color electronica"></span>Electrónica</span>
      <span><span class="legend-color telecom"></span>Telecomunicaciones</span>
      <span><span class="legend-color industrias"></span>Industrias</span>
      <span><span class="legend-color complementarios"></span>Complementarios</span>
    `;
  }else{
    legend.innerHTML = `
      <span><span class="legend-color integrativa"></span>Formación Integrativa</span>
      <span><span class="legend-color salud-animal"></span>Formación Salud Animal</span>
      <span><span class="legend-color produccion-animal"></span>Formación Producción Animal</span>
      <span><span class="legend-color salud-publica"></span>Formación Salud Pública</span>
      <span><span class="legend-color medio-ambiente"></span>Formación Medio Ambiente</span>
      <span><span class="legend-color formacion-basica"></span>Formación Básica</span>
      <span><span class="legend-color electiva"></span>Formación Electiva</span>
    `;
  }
  info.style.display = 'block';

  // ---------- Render de celdas ----------
  // Índices para colorear prereqs por NÚMERO, CÓDIGO y SIGLA
  const areaByKey = new Map();
  asigs.forEach(a=>{
    if (a.numero!=null) areaByKey.set(String(a.numero), a.area);
    if (a.codigo)       areaByKey.set(String(a.codigo), a.area);
    if (a.sigla)        areaByKey.set(String(a.sigla),  a.area);
  });

  grid.innerHTML = ''; // limpio
  asigs.forEach(a=>{
    let idx = romanIndex(a.nivel);
    if (idx < 0) idx = 0; // fallback
    const col = idx + 1;  // grid columns son 1‑based

    const div = document.createElement('div');
    div.className = 'grid-item' + (a.area ? ' area-' + areaClass(a.area) : '');
    div.style.gridColumn = String(col);
    div.dataset.codigo = a.codigo;
    div.dataset.key    = String(a.numero ?? a.codigo); // clave para prereqs
    div.dataset.prereqs = JSON.stringify(a.prerrequisitos);
    div.dataset.sem    = a.nivel;
    div.dataset.year   = String(Math.ceil(col/2));

    // bandas
    const top = document.createElement('div');
    top.className = 'top-bar'; div.appendChild(top);

    // SIGLA arriba izquierda (si existe)
    if (a.sigla){
      const sl = document.createElement('span');
      sl.className = 'sigla-label';
      sl.textContent = a.sigla;
      top.appendChild(sl);
    }

    // NÚMERO/CÓDIGO arriba derecha
    const code = document.createElement('span');
    code.className = 'code-label';
    code.textContent = a.numero ?? a.codigo;
    top.appendChild(code);

    // NOMBRE al centro
    const nm = document.createElement('div');
    nm.className = 'course-name';
    nm.textContent = a.nombre;
    div.appendChild(nm);

    // BANDA INFERIOR
    const bot = document.createElement('div');
    bot.className = 'bottom-bar';
    div.appendChild(bot);

    // prereqs a la izquierda (bolitas)
    (a.prerrequisitos||[]).forEach((pr, i)=>{
      const key = String(pr);
      const p = document.createElement('span');
      p.className = 'prereq-label';
      p.textContent = key;
      p.style.left = `${4+i*22}px`;
      const ar = areaByKey.get(key);
      if (ar) p.classList.add('area-'+areaClass(ar));
      bot.appendChild(p);
    });

    // créditos a la derecha (si existen)
    if (a.creditos){
      const cr = document.createElement('span');
      cr.className = 'credits-badge';
      cr.textContent = a.creditos;
      bot.appendChild(cr);
    }

    grid.appendChild(div);
  });

  // al final de renderMalla
loadState(section, careerCode);
actualizarDependencias(section, careerCode);
updatePercentage(section);

// ❗No guardes estado cuando estás viendo la malla de tu duo
// Nunca sobrescribir el estado del usuario si estás viendo la malla del dúo
if (!isPartnerView() && section.dataset.custom !== 'true') {
   saveState(section);
}

logMalla('renderMalla()', careerCode);
}

function areaClass(area){
  const s = (area || '').toLowerCase();
  const t = s
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // quita acentos
    .replace(/[-_]+/g,' ')                           // guiones/underscores -> espacio
    .replace(/\s+/g,' ').trim();

  // UMayor (MedVet)
  if (t.includes('integrativ')) return 'integrativa';
  if (t.includes('formacion basica')) return 'formacion-basica';
  if (t.includes('electiva')) return 'electiva';
  if (t.includes('salud animal')) return 'salud-animal';
  if (t.includes('produccion animal')) return 'produccion-animal';
  if (t.includes('medio ambiente')) return 'medio-ambiente';
  if (t.includes('salud publica')) return 'salud-publica';

  // USM (ICTEL)
  if (t.includes('ciencias basicas')) return 'cb';
  if (t.includes('software')) return 'software';
  if (t.includes('fisica')) return 'fisica';
  if (t.includes('transversal')) return 'transversal';    // Transversal e Integración
  if (t.includes('formacion general')) return 'fg';
  if (t.includes('deporte')) return 'deportes';
  if (t.includes('redes')) return 'redes';
  if (t.includes('ingles')) return 'ingles';
  if (t.includes('electronica')) return 'electronica';
  if (t.includes('telecom')) return 'telecom';
  if (t.includes('industri')) return 'industrias';
  if (t.includes('complement')) return 'complementarios';

  return 'transversal';
}

/* ================= Selección masiva ================= */
function toggleYear(year) {
  const host = document.querySelector('#malla-wrapper');
  if (!host) return;
  if (host.dataset.readonly === '1') return;

  // Seleccionar items por año (asegura que tu renderCustomMalla ponga data-year="1", "2" etc.)
  const items = host.querySelectorAll(`.grid-item[data-year="${year}"]`);
  const arr = Array.from(items);
  
  // Si todos están aprobados, los desmarcamos. Si falta alguno, los marcamos todos.
  const allOn = arr.every(el => el.classList.contains('aprobado'));
  
  arr.forEach(el => el.classList.toggle('aprobado', !allOn));

  // Actualizar lógica
  actualizarDependencias(host);
  updatePercentage(host);

  // Guardado inteligente
  const page = document.getElementById('page-malla');
  if (page?.dataset.custom === 'true') {
     const nombre = localStorage.getItem('ultima_malla_seleccionada');
     saveStateCustom(host, nombre);
  } else {
     saveState(host);
  }
}

function toggleSemester(romanOrNum) {
  const host = document.querySelector('#malla-wrapper');
  if (!host) return;
  if (host.dataset.readonly === '1') return;

  // Busca por data-sem (ej: "I", "II" o "1", "2")
  const items = host.querySelectorAll(`.grid-item[data-sem="${romanOrNum}"]`);
  const arr = Array.from(items);
  
  const allOn = arr.every(el => el.classList.contains('aprobado'));
  arr.forEach(el => el.classList.toggle('aprobado', !allOn));

  actualizarDependencias(host);
  updatePercentage(host);

  const page = document.getElementById('page-malla');
  if (page?.dataset.custom === 'true') {
     const nombre = localStorage.getItem('ultima_malla_seleccionada');
     saveStateCustom(host, nombre);
  } else {
     saveState(host);
  }
}

// Busca: function actualizarDependencias(host)... y reemplázala por esta:
function actualizarDependencias(host) {
  const all = Array.from(host.querySelectorAll('.grid-item'));
  const page = document.getElementById('page-malla');
  const career = page?.dataset.career || '';
  const isCustom = page?.dataset.custom === 'true';

  // 1. Mapa de aprobados
  const aprobadosSet = new Set();
  all.forEach(el => {
    if (el.classList.contains('aprobado')) {
      // Guardamos el ID único, el código visible y el nombre
      if (el.dataset.codigo) aprobadosSet.add(el.dataset.codigo);
      if (el.dataset.key) aprobadosSet.add(el.dataset.key);
      
      const nombre = el.querySelector('.course-name')?.textContent?.trim();
      const sigla = el.querySelector('.sigla-label')?.textContent?.trim();
      if (nombre) aprobadosSet.add(nombre);
      if (sigla) aprobadosSet.add(sigla);
    }
  });

  // 2. Regla especial MedVet (Solo si es oficial)
  let allApprovedFirst4 = true;
  if (!isCustom && career === 'MEDVET') {
    const first4 = all.filter(el => {
      const y = parseInt(el.dataset.year || '0', 10);
      return Number.isFinite(y) && y >= 1 && y <= 4;
    });
    allApprovedFirst4 = first4.length > 0 && first4.every(el => el.classList.contains('aprobado'));
  }

  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 3. Verificar cada ramo
  all.forEach(el => {
    // Si ya está aprobado, se ve normal (opcional: podrías dejarlo bloqueado si pierde requisito, pero visualmente es confuso)
    if (el.classList.contains('aprobado')) {
      el.classList.remove('bloqueado');
      return;
    }

    // Prerrequisitos
    let prereqs = [];
    try { prereqs = JSON.parse(el.dataset.prereqs || '[]'); } catch (e) {}

    const okPrereqs = prereqs.every(req => {
      const reqClean = String(req).trim();
      // Chequea si el requisito está en el set de aprobados
      return aprobadosSet.has(reqClean);
    });

    // Lógica Extra (Solo MedVet oficial)
    let extraOk = true;
    if (!isCustom && career === 'MEDVET') {
      const name = norm(el.querySelector('.course-name')?.textContent || '');
      if (name.includes('practica') && name.includes('profesional')) {
        extraOk = allApprovedFirst4;
      }
    }

    if (okPrereqs && extraOk) {
      el.classList.remove('bloqueado');
    } else {
      el.classList.add('bloqueado');
    }
  });
}


/* ================= Estado persistente ================= */
async function saveState(host){
  // Si estás en malla personalizada y NO quieres espejar “aprobados” a la nube, puedes salir aquí:
  // if (document.getElementById('page-malla')?.dataset.custom === 'true') return;

  const uni = state.profileData?.university || 'GEN';
  const career = state.profileData?.career || 'GEN';

  // Tomamos un identificador válido para cada ramo aprobado
  const aprob = Array.from(host.querySelectorAll('.grid-item.aprobado'))
    .map(el =>
      el.dataset.codigo
      || el.querySelector('.sigla-label')?.textContent?.trim()
      || el.querySelector('.code-label')?.textContent?.trim()
      || el.querySelector('.course-name')?.textContent?.trim()
      || null
    )
    .filter(v => typeof v === 'string' && v.length > 0);  // ❗ sin undefined/null

  // Guarda local
  localStorage.setItem(`mallaAprobados:${uni}:${career}`, JSON.stringify(aprob));

  // Notifica
  try { document.dispatchEvent(new Event('malla:updated')); } catch(_) {}

  // Espejo en Firestore
  if (state.currentUser){
    try {
      const ref = doc(db,'users',state.currentUser.uid,'malla','state');
      await setDoc(ref, { career, approved: aprob, updatedAt: Date.now() }, { merge:true });
      try { document.dispatchEvent(new Event('malla:updated')); } catch(_) {}
    } catch (err){
      console.error('saveState → Firestore setDoc falló:', err, { approved: aprob });
    }
  }
}



function loadState(host, career){
  const uni = state.profileData?.university || 'GEN';
  const arr = JSON.parse(localStorage.getItem(`mallaAprobados:${uni}:${career}`) || '[]');
  arr.forEach(c=>{
    const el = host.querySelector(`.grid-item[data-codigo="${CSS.escape(String(c))}"]`);
    if (el) el.classList.add('aprobado');
  });
}

function updatePercentage(host){
  const total = host.querySelectorAll('.grid-item').length;
  const aprob = host.querySelectorAll('.grid-item.aprobado').length;
  // Si total es 0, evita división por cero
  const pct = total ? ((aprob/total)*100).toFixed(1) : '0.0';
  
  // CAMBIO: Formato exacto como en la imagen
  $('malla-percentage').textContent = `Total de ramos: ${pct}%`;
}

function saveStateCustom(host, mallaNombre){
  const uid = state.currentUser?.uid || 'anon';
  const keyLocal = `mallaCustomAprobados:${uid}:${mallaNombre}`;

  // 1) Guardado local (como ya tenías)
  const aprob = Array.from(host.querySelectorAll('.grid-item.aprobado'))
    .map(el =>
      el.dataset.codigo
      || el.querySelector('.sigla-label')?.textContent?.trim()
      || el.querySelector('.course-name')?.textContent?.trim()
      || null
    )
    .filter(v => typeof v === 'string' && v.length > 0);

  localStorage.setItem(keyLocal, JSON.stringify(aprob));

  // 2) ESPEJO EN FIRESTORE para que el dúo vea esta malla
  if (state.currentUser) {
    try {
      const uni    = state.profileData?.university || 'GEN';
      const career = state.profileData?.career || 'GEN';

      const ref = doc(db, 'users', state.currentUser.uid, 'malla', 'state');
      // Ojo: reutilizamos el mismo doc que la malla oficial,
      // pero marcamos que es custom y guardamos el nombre.
      setDoc(ref, {
        career,
        isCustom: true,
        customName: mallaNombre,
        approved: aprob,
        updatedAt: Date.now(),
      }, { merge: true }).catch(err => {
        console.error('[malla] saveStateCustom → Firestore setDoc falló:', err);
      });
    } catch (e) {
      console.error('[malla] saveStateCustom → error general', e);
    }
  }
}


function loadStateCustom(host, mallaNombre){
  const uid = state.currentUser?.uid || 'anon';
  const key = `mallaCustomAprobados:${uid}:${mallaNombre}`;
  const arr = JSON.parse(localStorage.getItem(key) || '[]');

  arr.forEach(c=>{
    const el = host.querySelector(`.grid-item[data-codigo="${CSS.escape(String(c))}"]`);
    if (el) el.classList.add('aprobado');
  });
}

// ================= Party Malla Picker =================
let __partyViewingUid = null;
let __partyLockUid = null;

// ✅ soporta array | set | map | {uid:true} | {uid:{...}} | [{uid:"..."}] | {members:[...]} etc.
function pm_extractUids(x){
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
    // listas típicas
    const candidates =
      x.partyMembers || x.memberUids || x.members || x.uids || x.participants || x.people || null;

    if (candidates) return pm_extractUids(candidates);

    // { uid:true } o { uid:{...} }
    const keys = Object.keys(x);
    const uidLike = keys.filter(k => typeof k === 'string' && k.length >= 16);
    if (uidLike.length) return uidLike;

    // { a:{uid:".."}, b:{uid:".."} }
    const vals = Object.values(x).map(v => v?.uid).filter(Boolean);
    if (vals.length) return vals;
  }

  return [];
}

function pm_getPartyMembersNoMe(){
  const me = state.currentUser?.uid;

  // probamos varias fuentes posibles dentro del state
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
    uids = pm_extractUids(s);
    if (uids.length) break;
  }

  // sin yo + únicos
  return [...new Set(uids.filter(Boolean))].filter(uid => uid !== me);
}

// cache simple de perfiles (uid -> {name,email})
const __partyProfileCache = Object.create(null);

function pm_safeName(s, fb='Usuario'){
  const t = String(s||'').trim();
  return t ? t : fb;
}

async function pm_loadMemberProfile(uid){
  if (!uid) return { name:'Usuario', email:'' };
  if (__partyProfileCache[uid]) return __partyProfileCache[uid];

  try{
    // igual que en Notas: intenta profile/profile y root users/{uid}
    const profSnap = await getDoc(doc(db,'users',uid,'profile','profile'));
    const rootSnap = await getDoc(doc(db,'users',uid));

    const prof = profSnap.exists() ? (profSnap.data()||{}) : {};
    const root = rootSnap.exists() ? (rootSnap.data()||{}) : {};

    const name = pm_safeName(
      prof.name || root.name || root.displayName || root.username,
      (uid === state.currentUser?.uid ? 'Yo' : 'Usuario')
    );

    __partyProfileCache[uid] = { name };
    return __partyProfileCache[uid];
  }catch{
    __partyProfileCache[uid] = { name:'Usuario'};
    return __partyProfileCache[uid];
  }
}

// ✅ Reemplazo final: lista de miembros de party (SIN depender de partyId)
async function getPartyMembersList(){
  const uids = pm_getPartyMembersNoMe();
  if (!uids.length) return [];

  // hidrata nombres/email (si no quieres esto, puedes devolver solo {uid})
  const profiles = await Promise.all(uids.map(uid => pm_loadMemberProfile(uid)));

  return uids.map((uid, i) => ({
    uid,
    name: profiles[i]?.name || 'Usuario',
    email: profiles[i]?.email || ''
  }));
}

function closePartyPickerModal() {
  const m = document.getElementById('partyMallaModal');
  if (m) m.remove();
}

async function openPartyPickerModal() {
  closePartyPickerModal();

  const members = await getPartyMembersList();

  const modal = document.createElement('div');
  modal.id = 'partyMallaModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="card modal-card" style="max-width:520px;">
      <h3>Ver malla de la party</h3>
      <div class="modal-body" style="max-height:60vh; overflow:auto;">
        ${
          members.length
            ? members.map(m => `
              <label class="pill" style="display:flex;align-items:center;gap:10px;justify-content:space-between;margin:8px 0;">
                <span style="display:flex;flex-direction:column;">
                  <b style="color:#fff">${escapeHtml(m.name)}</b>
                </span>
                <input type="radio" name="partyMemberPick" value="${m.uid}" ${m.uid===__partyViewingUid ? 'checked' : ''}/>
              </label>
            `).join('')
            : `<div class="muted">No hay miembros de party disponibles </div>`
        }
      </div>
      <div class="modal-actions">
        <button id="partyMallaVerBtn" class="btn violet" ${members.length ? '' : 'disabled'}>Ver</button>
        <button id="partyMallaCerrarBtn" class="btn gray">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  $('partyMallaCerrarBtn').onclick = closePartyPickerModal;
  $('partyMallaVerBtn').onclick = async () => {
    const uid = modal.querySelector('input[name="partyMemberPick"]:checked')?.value;
    if (!uid) return alert('Selecciona a alguien de la party.');

    __partyViewingUid = uid;
__partyLockUid = uid;                 // ✅ CLAVE
state.shared.malla.enabled = true;
state.pairOtherUid = uid;             // puede borrarse, pero ya no importa
setPartnerReadonly(true);

closePartyPickerModal();
await watchPartnerMalla();
document.dispatchEvent(new Event('malla:updated'));
  };
}

function escapeHtml(s){
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function setupPartnerToggle(){
  const host = $('malla-host');
  if (!host) return;
  const old = document.getElementById('malla-partner-toggle');
  if (old) old.remove();
  const bar = document.createElement('div');
  bar.id = 'malla-partner-toggle';
  bar.className = 'row';
  bar.style.margin = '10px 0';
  bar.style.display = 'flex';
  bar.style.gap = '10px';
  bar.style.alignItems = 'center';

  bar.innerHTML = `
    <button id="btnPartyMalla" class="btn violet-outline">Ver malla de la party</button>
    <button id="btnVolverMiMalla" class="btn gray" style="display:none;">Volver a mi malla</button>
    <span id="partyMallaHint" class="muted" style="font-size:.9rem; opacity:.8;"></span>
  `;
  host.prepend(bar);

  const btnParty = $('btnPartyMalla');
  const btnBack  = $('btnVolverMiMalla');
  const hint     = $('partyMallaHint');

  const refreshUI = () => {
  const otherUid = __partyLockUid || __partyViewingUid || state.pairOtherUid;

  const viewing = !!(state.shared?.malla?.enabled && otherUid);

  btnBack.style.display = viewing ? 'inline-flex' : 'none';


};
  refreshUI();

  btnParty.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing()) return; 
    openPartyPickerModal();
  };

 btnBack.onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  state.shared.malla.enabled = false;
  __partyViewingUid = null;
  __partyLockUid = null;
  state.pairOtherUid = null;

  if (unsubMallaPartner) {
    unsubMallaPartner();
    unsubMallaPartner = null;
  }

  setPartnerReadonly(false);
  lastRenderedKey = '';

  const uni = state.profileData?.university || '';
  const carrera = state.profileData?.career || '';
  const ultima = localStorage.getItem('ultima_malla_seleccionada');

  const sel = document.getElementById('malla-selector');
  const opt = sel && ultima
    ? Array.from(sel.options).find(o => o.value === ultima)
    : null;

  if (opt) {
    sel.value = ultima;
    const isOficial = opt.dataset.oficial === '1';

    if (isOficial) renderMalla(carrera);
    else renderCustomMalla(ultima);
  } else {
    renderFromProfile();
  }

  document.dispatchEvent(new Event('malla:updated'));
  refreshUI();
};
  document.addEventListener('malla:updated', refreshUI);
}

let unsubMallaPartner = null;
async function watchPartnerMalla() {
  // Corta suscripción previa si existía
  if (unsubMallaPartner) {
    unsubMallaPartner();
    unsubMallaPartner = null;
  }

  const host = document.getElementById('malla-wrapper');
  if (!host) return;

  const otherUid = __partyLockUid || __partyViewingUid || state.pairOtherUid;

  const canSee = await canViewPartyZone(otherUid, 'malla');

if (!canSee) {
  const grid = document.querySelector('#page-malla .malla-grid');
  const info = $('malla-info');

  if (grid) grid.innerHTML = privacyBlockedMessage('su malla');
  if (info) info.style.display = 'none';

  setPartnerReadonly(true);
  return;
}

// Si el toggle está apagado o no hay uid → vuelves a TU malla real
if (!state.shared?.malla?.enabled || !otherUid) {
  setPartnerReadonly(false);
  lastRenderedKey = '';
  restaurarUltimaMalla();

  const sel = document.getElementById('malla-selector');
  if (!sel || !sel.value) {
    if (state.profileData) renderFromProfile();
  }
  return;
}

setPartnerReadonly(true);

  // ================== 1) LEER PERFIL DEL DÚO ==================
  let partnerProfile = null;
  try {
    const profSnap = await getDoc(doc(db, 'users', otherUid));
    if (profSnap.exists()) partnerProfile = profSnap.data();
  } catch (e) {
    console.warn('[DUO] error leyendo perfil del par', e);
  }

  const partnerUni   = partnerProfile?.university || null;
  let   partnerCareer = normalizeCareerCode(partnerProfile?.career);
  const partnerLast   = partnerProfile?.ultima_malla_seleccionada || null;
  let   partnerLastIsCustom = !!partnerProfile?.ultima_malla_es_custom;

  // 🔧 Si la última malla seleccionada es OFICIAL, usamos esa etiqueta para
// inferir la carrera real, incluso si el perfil en Firestore está viejo.
if (partnerLast && !partnerLastIsCustom) {
  const t = partnerLast.toLowerCase();

  if (t.includes('veterinaria')) {
    partnerCareer = 'MEDVET';
  } else if (t.includes('telematica') || t.includes('telemática') || t.includes('ictel')) {
    partnerCareer = 'ICTEL';
  }
}


  // ================== 2) LEER CUSTOM MALLAS DEL DÚO ==================
  let partnerCustom = [];
  try {
    const csnap = await getDocs(collection(db, 'users', otherUid, 'customMallas'));
    csnap.forEach(d => {
      const m = d.data();
      if (m && m.nombre) partnerCustom.push(m);
    });
  } catch (e) {
    console.warn('[DUO] error leyendo customMallas', e);
  }

  // Fallback perfiles viejos: si ultima_malla coincide con una custom
  if (partnerLast && !partnerLastIsCustom) {
    if (partnerCustom.some(m => m.nombre === partnerLast)) {
      partnerLastIsCustom = true;
    }
  }

  // Cache para renderCustomMalla() en modo dúo
  duoCustomCache.clear();
  partnerCustom.forEach(m => duoCustomCache.set(m.nombre, m));

  console.log('[DUO] perfil par', {
    partnerUni,
    partnerCareer,
    partnerLast,
    partnerLastIsCustom,
    customCount: partnerCustom.length
  });

  // ================== 3) DECIDIR QUÉ ESTRUCTURA MOSTRAR ==================
  // 3.1 – Si tiene una malla personalizada activa válida → esa
  if (partnerLast && partnerLastIsCustom) {
    let chosen = partnerCustom.find(m => m.nombre === partnerLast) || partnerCustom[0];
    if (chosen) {
      console.log('[DUO] Vista de dúo → malla personalizada activa:', chosen.nombre);
      renderCustomMalla(chosen.nombre, { isDuo: true });
    }
  } else if (partnerCareer) {
    // 3.2 – Si tiene carrera soportada → malla oficial, da igual si existe o no malla/state
    console.log('[DUO] Vista de dúo → usando malla OFICIAL:', partnerCareer);
    await forceRenderCareer(partnerCareer);
  } else if (partnerCustom.length > 0) {
    // 3.3 – Carrera rara pero sí tiene alguna custom → primera
    console.log('[DUO] Carrera no soportada pero tiene custom, usando:', partnerCustom[0].nombre);
    renderCustomMalla(partnerCustom[0].nombre, { isDuo: true });
  } else {
    // 3.4 – De verdad no hay nada
    console.log('[DUO] La otra persona no tiene malla configurada todavía.');
    const grid = document.querySelector('#page-malla .malla-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="muted">
          La otra persona todavía no ha configurado su malla.<br/>
          Pídele que entre a <b>Malla</b> y la guarde al menos una vez.
        </div>`;
    }
    return; // no tiene sentido suscribirse a aprobados
  }

  // ================== 4) SUSCRIPCIÓN SOLO PARA LOS RAMOS APROBADOS ==================
  const ref = doc(db, 'users', otherUid, 'malla', 'state');
  unsubMallaPartner = onSnapshot(ref, (snap) => {
    const data = snap.data() || {};
    const approved = Array.isArray(data.approved) ? data.approved : [];

    const wrapper = document.getElementById('malla-wrapper');
    if (!wrapper) return;

    const setAprob = new Set(approved.map(String));

    wrapper.querySelectorAll('.grid-item').forEach(div => {
      const code =
        div.dataset.codigo ||
        div.querySelector('.sigla-label')?.textContent?.trim() ||
        div.querySelector('.code-label')?.textContent?.trim() ||
        div.querySelector('.course-name')?.textContent?.trim() ||
        '';

      if (setAprob.has(String(code))) {
        div.classList.add('aprobado');
      } else {
        div.classList.remove('aprobado');
      }
    });

    actualizarDependencias(wrapper);
    updatePercentage(wrapper);
  }, (err) => {
    console.warn('[DUO] onSnapshot error', err);
    setPartnerReadonly(false);
    lastRenderedKey = '';
    if (state.profileData) renderFromProfile();
  });
}




// Fuerza render a una carrera específica (ignora Perfil). Útil para "ver malla duo".
// Fuerza render a una carrera específica (ignora Perfil). Útil para "ver malla duo".
async function forceRenderCareer(careerCode){
  const section = $('page-malla');
  if (!section) return;

  await ensureDatasetsLoaded();

  // 🔹 Guarda si la malla que estaba antes era personalizada
  const wasCustom = section.dataset.custom === 'true';

  // 🔹 Quita el data-custom TEMPORALMENTE
  // (así renderMalla no pisa tu malla personalizada)
  section.dataset._wasCustom = wasCustom ? '1' : '0';
  section.removeAttribute('data-custom');

  // 🔹 Marca explícitamente la carrera que se está mostrando
  section.dataset.career = careerCode;

  // 🔹 Invalida cache
  lastRenderedKey = `FORCED:${careerCode}`;

  // 🔹 Caption modo duo
  const caption = $('malla-caption');
  caption.textContent = `${CAREER_NAMES[careerCode] || careerCode} · (vista de la otra persona)`;

  setPartnerReadonly(true);

  // 🔹 Render oficial de la carrera del dúo
  renderMalla(careerCode);

   // ------------------------------------------------------------------
  // En vista de dúo NO queremos volver a activar el modo "custom"
  // porque eso aplica los estilos de malla personalizada sobre la
  // malla oficial del partner.
  // Dejamos la malla en modo "oficial" mientras el toggle de dúo esté activo.
  // ------------------------------------------------------------------
  delete section.dataset._wasCustom;
  section.removeAttribute('data-custom'); // 🔑 forzamos diseño oficial
}


function normalizeCareerCode(raw) {
  const r = String(raw || '').toLowerCase().trim();
  if (!r) return null;

  if (r.includes('medvet') || r.includes('medicina veterinaria')) return 'MEDVET';
  if (r.includes('ictel') || r.includes('telematica') || r.includes('telemática')) return 'ICTEL';

  return null; // desconocida / sin soporte
}


export function parseMalla(csvRows) {
  const prereqMap = {};
  csvRows.forEach(r => {
    const codigo = r.codigo.trim();
    const prereqs = (r.prerequisitos || '')
      .split(/[,;]/)
      .map(p => p.trim())
      .filter(Boolean);
    prereqMap[codigo] = prereqs;
  });

  // guardamos en state
  state.malla = { prereqMap, rows: csvRows };
}

export function getPrereqs(course) {
  const key = String(course||'').toUpperCase().trim();
  return (window.MALLA_PREREQS && window.MALLA_PREREQS[key]) || [];
}

// ==================== 🔁 Reactivación al recargar ====================

// Espera a que Firebase confirme sesión y Semestre se restaure
document.addEventListener('auth:ready', () => {
  setTimeout(() => {
    console.log('[malla] auth:ready → initMallaOnRoute()');
    initMallaOnRoute();
  }, 1000); // espera breve a que semesters.js y profile.js carguen
});

document.addEventListener('semester:changed', () => {
  if (__muteSemesterChanged > 0) return;         // ⛔ silenciado por acción de usuario
  if (isEditing()) return;

  // Endurece el guard: si no estoy en #/malla o la vista es custom, no toques nada
  if (location.hash !== '#/malla') return;

  const page = document.getElementById('page-malla');
  if (!page) return;                              // si aún no existe, no hagas nada
  if (page.dataset.custom === 'true') return;     // 👈 respeta personalizada

  console.log('[malla] semester:changed → initMallaOnRoute()');
  initMallaOnRoute();
});



// helper para renumerar tras cualquier cambio
function renumerarMalla(host) {
  let n = 1;
  // Selecciona items solo si estamos en modo custom
  const items = host.querySelectorAll('#page-malla[data-custom="true"] .malla-grid .grid-item');

  items.forEach(div => {
    // 1. Asegurar contenedor Top Bar
    let top = div.querySelector('.top-bar');
    if (!top) {
      top = document.createElement('div');
      top.className = 'top-bar';
      div.prepend(top);
    }

    // 2. GESTIÓN DEL CÓDIGO (Izquierda - .sigla-label)
    let siglaLabel = top.querySelector('.sigla-label');
    
    // Si no existe el label, créalo
    if (!siglaLabel) {
      siglaLabel = document.createElement('span');
      siglaLabel.className = 'sigla-label';
      top.prepend(siglaLabel);
    }

    // INTENTO DE RECUPERACIÓN DE CÓDIGO:
    // Si el label está vacío, intenta sacarlo del dataset.codigo (limpiando el ID interno)
    if (!siglaLabel.textContent.trim()) {
        // El dataset.codigo suele ser "NombreMalla::S1-I0" o "MAT-021"
        // Si tiene "::", es un ID generado, no un código real -> déjalo vacío
        // Si NO tiene "::", asume que es un código real (ej: MAT-021)
        const raw = (div.dataset.codigo || '').trim();
        if (raw && !raw.includes('::')) {
            siglaLabel.textContent = raw;
        }
    }

    // 3. GESTIÓN DEL NÚMERO (Derecha - .num-label)
    let numLabel = top.querySelector('.num-label');
    
    // Si no existe, créalo
    if (!numLabel) {
      numLabel = document.createElement('span');
      numLabel.className = 'num-label';
      top.appendChild(numLabel);
    }
    numLabel.textContent = n++; // Asigna el número secuencial

    // 4. LIMPIEZA DE CONFLICTOS
    // Elimina cualquier .code-label antiguo que pueda haber quedado de la malla oficial
    const oldCode = div.querySelector('.code-label');
    if (oldCode) oldCode.remove();
  });
}

function restaurarUltimaMalla() {
  if (isEditing()) return;
  if (isPartnerView()) return;
  if (location.hash !== '#/malla') return;

  const uni = state.profileData?.university || '';
  const carrera = state.profileData?.career || '';

  // ✅ Si perfil incompleto, NO restaurar ni renderizar nada
  if (!uni || !carrera) {
    // opcional: limpiar selección antigua para evitar loops
    // localStorage.removeItem('ultima_malla_seleccionada');
    return;
  }

  const ultima = localStorage.getItem('ultima_malla_seleccionada');
  if (!ultima) return;

  const sel = document.getElementById('malla-selector');
  if (!sel) return;

  const opt = Array.from(sel.options).find(o => o.value === ultima);
  if (opt) {
    sel.value = ultima;
    const isOficial = opt.dataset.oficial === '1';
    if (isOficial) renderMalla(carrera);
    else renderCustomMalla(ultima);
  }
}

document.addEventListener('visibilitychange', () => {
  if (isEditing()) return;  
  if (document.visibilityState === 'visible') {
    restaurarUltimaMalla();
  }
});

// 🔁 También al cargar la página (por si recargas directamente en #/malla)
document.addEventListener('DOMContentLoaded', () => {
  if (isEditing()) return;  
  restaurarUltimaMalla();
});

document.addEventListener('malla:selector-ready', () => {
  if (isPartnerView()) return;
  restaurarUltimaMalla();
});

// 🔁 Garantiza restauración tras crear el selector
async function ensureRestaurarDespuesDeSelector() {
  if (isEditing()) return; 
  if (location.hash !== '#/malla') return;

  // Espera a que el selector exista en el DOM
  let tries = 0;
  while (!document.getElementById('malla-selector') && tries < 10) {
    await new Promise(r => setTimeout(r, 200)); // espera 200 ms
    tries++;
  }

  if (document.getElementById('malla-selector')) {
  if (isPartnerView()) return;
  restaurarUltimaMalla();
}
}

// Cuando se entra o recarga la pestaña de malla
document.addEventListener('profile:ready', ensureRestaurarDespuesDeSelector);
document.addEventListener('profile:changed', ensureRestaurarDespuesDeSelector);
document.addEventListener('malla:selector-ready', () => {
  if (isPartnerView()) return;
  restaurarUltimaMalla();
});

// 👉 Dispara refresco de la vista de malla cuando cambie el dúo
document.addEventListener('pair:changed', () => {
  ensureMallaLiveAfterPair();
});

