  // js/schedule.js
  import { db } from './firebase.js';
  import { $, state } from './state.js';
  import { canViewPartyZone, privacyBlockedMessage } from './privacy.js';
  import { bindExportButtons } from './export.js';
  import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, getDocs, getDoc, updateDoc, where , setDoc} from 'firebase/firestore';
  let IN_SIM_MODAL = false;  let SIM_ALLOW_PERSIST = false;let SIM_SAVED_FULL = '';let SIM_SAVED_SNAPSHOT = '';let SIM_DIRTY = false;let SIM_TERM = '';let unsubMyCourses = null;let SIM_OPEN_SNAPSHOT = null;const partyScheduleCache = new Map(); const SIM_PARALLEL_DEFS = new Map();let SIM_COURSES = [];let SIM_ITEMS = [];const SELECTED_PARALLEL = new Map();let EDIT_BLOCKS_MODE = false; let SIM_SLOTS = null;let ALLOW_ADD_COURSE_UI = false; let myColor = '#22c55e';let partnerColor = '#ff69b4';let unsubPartnerProfile = null;let schedBooted = false;let unsubPartySched = null;let unsubPartyCourses = null;let unsubPartyProfile = null;let partyItems = [];let partyCourses = [];let partySlots = null;let partyUni = 'USM';let partyMemberProfileCache = {};const busyMembers = new Map(); const busyUnsubs  = new Map(); let busyRenderRAF = null;
  function takeSimSnapshot(){
    const defsObj = {};
    for (const [cid, defs] of (SIM_PARALLEL_DEFS || new Map()).entries()){
      defsObj[cid] = defs || [];
    }
    const selObj = {};
    for (const [cid, pid] of (SELECTED_PARALLEL || new Map()).entries()){
      selObj[cid] = pid;
    }
    return JSON.stringify({
      slots: SIM_SLOTS || null,
      items: SIM_ITEMS || [],
      courses: SIM_COURSES || [],
      defs: defsObj,
      selected: selObj
    });
  }
  function isSimDirty(){
    if (!SIM_OPEN_SNAPSHOT) return false;
    try{
      const now = takeSimSnapshot();
      return now !== SIM_OPEN_SNAPSHOT;
    }catch{
      return true;
    }
  }
  function scheduleBusyRender(){
    if (busyRenderRAF) return;
    busyRenderRAF = requestAnimationFrame(() => {
      busyRenderRAF = null;
      const gridIds = ['schedPartyBusyCombined', 'schedPartyBusy'];
      gridIds.filter(id => document.getElementById(id))
        .forEach(id => renderPartyBusyTimeline(id));
      const legendIds = ['busyLegendCombined', 'busyLegend'];
      legendIds.filter(id => document.getElementById(id))
        .forEach(id => renderBusyLegend(id));
    });
  }
  let isDraggingChip = false;let autoScrollRAF = null;const AUTO_EDGE = 80;const AUTO_SPEED = 28;let CURRENT_SLOTS = [];let SHARED_CURRENT_SLOTS = [];  const DAYS = ['Lun','Mar','Mié','Jue','Vie'];
  function getActiveDragScrollContainer(){
    const parModal = document.getElementById('parEditModal');
    if (parModal?.style.display === 'flex') {
      return document.getElementById('parEditPanel');
    }

    const simModal = document.getElementById('simModal');
    if (simModal?.style.display === 'flex') {
      return document.getElementById('simModalPanel');
    }

    const gradeDrawer = document.getElementById('gr-simDrawer');
    if (gradeDrawer) return gradeDrawer;

    return null;
  }

  function handleGlobalDragOver(e){
    if (!isDraggingChip) return;

    const y = e.clientY;
    const h = window.innerHeight;
    let dy = 0;

    if (y < AUTO_EDGE) {
      const t = (AUTO_EDGE - y) / AUTO_EDGE;
      dy = -Math.ceil(AUTO_SPEED * t);
    } else if (y > h - AUTO_EDGE) {
      const t = (y - (h - AUTO_EDGE)) / AUTO_EDGE;
      dy = Math.ceil(AUTO_SPEED * t);
    }

    if (dy === 0 || autoScrollRAF !== null) return;

    autoScrollRAF = requestAnimationFrame(() => {
      const scroller = getActiveDragScrollContainer();

      if (scroller) {
        scroller.scrollBy({ top: dy, left: 0, behavior: 'auto' });
      } else {
        window.scrollBy(0, dy);
      }

      autoScrollRAF = null;
    });
  }

  function stopGlobalAutoScroll(){
    isDraggingChip = false;
    if (autoScrollRAF) { cancelAnimationFrame(autoScrollRAF); autoScrollRAF = null; }
  }
  let CUSTOM_SLOTS_MAP = {}; 

  export const USM_SLOTS = [
    { label:'1/2',   start:'08:15', end:'09:25',
      lines:[{n:'1',start:'08:15',end:'08:50'},{n:'2',start:'08:50',end:'09:25'}] },
    { label:'3/4',   start:'09:40', end:'10:50',
      lines:[{n:'3',start:'09:40',end:'10:15'},{n:'4',start:'10:15',end:'10:50'}] },
    { label:'5/6',   start:'11:05', end:'12:15',
      lines:[{n:'5',start:'11:05',end:'11:40'},{n:'6',start:'11:40',end:'12:15'}] },
    { label:'7/8',   start:'12:30', end:'13:40',
      lines:[{n:'7',start:'12:30',end:'13:05'},{n:'8',start:'13:05',end:'13:40'}] },

    { label:'ALMUERZO', start:'13:40', end:'14:40', lunch:true },

    { label:'9/10',  start:'14:40', end:'15:50',
      lines:[{n:'9',start:'14:40',end:'15:15'},{n:'10',start:'15:15',end:'15:50'}] },
    { label:'11/12', start:'16:05', end:'17:15',
      lines:[{n:'11',start:'16:05',end:'16:40'},{n:'12',start:'16:40',end:'17:15'}] },
    { label:'13/14', start:'17:30', end:'18:40',
      lines:[{n:'13',start:'17:30',end:'18:05'},{n:'14',start:'18:05',end:'18:40'}] },
    { label:'15/16', start:'18:50', end:'20:00',
      lines:[{n:'15',start:'18:50',end:'19:25'},{n:'16',start:'19:25',end:'20:00'}] },
    { label:'17/18', start:'20:15', end:'21:25',
      lines:[{n:'17',start:'20:15',end:'20:50'},{n:'18',start:'20:50',end:'21:25'}] },
    { label:'19/20', start:'21:40', end:'22:50',
      lines:[{n:'19',start:'21:40',end:'22:15'},{n:'20',start:'22:15',end:'22:50'}] },
  ];
  export const MAYOR_SLOTS = [
    block('1/2',   '08:30','09:40', ['08:30-09:05','09:05-09:40']),
    block('3/4',   '10:00','11:10', ['10:00-10:35','10:35-11:10']),
    block('5/6',   '11:30','12:40', ['11:30-12:05','12:05-12:40']),
    { label:'ALMUERZO', start:'12:40', end:'14:00', lunch:true },
    block('7/8',   '14:00','15:10', ['14:00-14:35','14:35-15:10']),
    block('9/10',  '15:30','16:40', ['15:30-16:05','16:05-16:40']),
    block('11/12', '17:00','18:10', ['17:00-17:35','17:35-18:10']),
    block('13/14', '18:30','19:40', ['18:30-19:05','19:05-19:40']),
    block('15/16', '20:00','21:10', ['20:00-20:35','20:35-21:10']),
    block('17/18', '21:30','22:40', ['21:30-22:05','22:05-22:40']),
  ];
  function block(label, start, end, linesArr){
    return { label, start, end, lines: linesArr.map(s => {
      const [a,b] = s.split('-'); return { start:a, end:b };
    })};
  }
  function normalizeUni(s){
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'') 
      .toLowerCase()
      .trim()
      .replace(/\s+/g,' ');
  }
  function uniSlug(s){
    return normalizeUni(s)
      .replace(/[^a-z0-9]+/g,'_')
      .replace(/^_+|_+$/g,'');
  }
  function uniCodeFromReadable(readable){
    const r = normalizeUni(readable);
    if (!r) return '';

    if (r === 'umayor' || r.includes('mayor')) return 'UMAYOR';
    if (
    r === 'usm' ||
    r.includes('utfsm') ||        
    r.includes('u t f s m') ||     
    r.includes('u.t.f.s.m') ||     
    r.includes('federico santa maria') ||
    r.includes('santa maria')
  ) {
    return 'USM';
  }

    return `UNI_${uniSlug(r) || 'desconocida'}`;
  }
  function getActiveUniCode(){
    const u = state.activeSemesterData?.universityAtThatTime
          || state.profileData?.university
          || '';
    return uniCodeFromReadable(u);
  }
  async function getMySlots() {
    const uni = getActiveUniCode();

    if (CUSTOM_SLOTS_MAP[uni] && Array.isArray(CUSTOM_SLOTS_MAP[uni]) && CUSTOM_SLOTS_MAP[uni].length) {
      return CUSTOM_SLOTS_MAP[uni];
    }

    if (state.currentUser) {
      const ref = doc(db, 'users', state.currentUser.uid, 'custom_schedules', uni);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data()?.slots || [];
        if (Array.isArray(data) && data.length) {
          CUSTOM_SLOTS_MAP[uni] = data;
          return data;
        }
      }
    }

    const localKey = `custom_slots_${uni}_${state.currentUser?.uid}`;
    const local = localStorage.getItem(localKey);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length) {
          CUSTOM_SLOTS_MAP[uni] = parsed;
          return parsed;
        }
      } catch (_) {}
    }

    if (uni === 'UMAYOR') return MAYOR_SLOTS;
    if (uni === 'USM') return USM_SLOTS;

    return null;
  }

  function isValidHex(s){ return typeof s==='string' && /^#[0-9A-Fa-f]{6}$/.test(s); }

  function getCourseColorById(arr, id, fallback){
    const c = (arr || []).find(x => x.id === id);
    return isValidHex(c?.color) ? c.color : (fallback || '#3B82F6');
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

  let unsubscribeSchedule = null;
  let items = []; 

  function renderSimPalette(){
    const host = document.getElementById('simPaletteHost');
    if (!host) return;

    ensureSimPaletteReorderStyles();

    host.innerHTML = '';
    const rawList = IN_SIM_MODAL
    ? (Array.isArray(SIM_COURSES) ? SIM_COURSES : [])
    : (Array.isArray(state.courses) ? state.courses : []);

    if (!rawList.length){
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'palette-rect';
      add.textContent = '+ Agregar ramo';
      add.style.cursor = 'pointer';
      add.style.borderStyle = 'dashed';
      add.addEventListener('click', async () => {
        if (!state.currentUser || !state.activeSemesterId){
          alert('No hay semestre activo para agregar ramos.');
          return;
        }
        await openCourseQuickModal(state.activeSemesterId, { forceFirestore: false });

      });
      host.appendChild(add);
      return;
    }
    const list = sortCoursesBySimOrder(rawList);

    list.forEach(c => {
      const group = document.createElement('div');
      group.className = 'sim-course-group';
      group.dataset.courseId = c.id;
      
      const col = isValidHex(c.color) ? c.color : '#3B82F6';
      const defs = SIM_PARALLEL_DEFS.get(c.id) || [];
      const selectedPid = SELECTED_PARALLEL.get(c.id) || defs[0]?.pid || null;
      const selectedDef = selectedPid ? defs.find(d => d.pid === selectedPid) : null;
      const labelText = c.name;
      const rect = document.createElement('div');
      rect.className = 'palette-rect';
      rect.setAttribute('draggable','true');
      rect.dataset.payload = JSON.stringify({
        type: 'course-parallel',
        courseId: c.id,
        pid: selectedPid
      });
      rect.style.borderColor = col;
      rect.style.boxShadow = 'inset 0 0 0 2px rgba(0,0,0,.15)';
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = labelText;
      rect.appendChild(label);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'add-par';
      btn.textContent = '▾';
      btn.setAttribute('aria-label','Paralelos');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSimParMenu(c, btn);
      });
      rect.appendChild(btn);
      group.appendChild(rect);
      host.appendChild(group);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'palette-rect';
    add.textContent = '+ Agregar ramo';
    add.style.cursor = 'pointer';
    add.style.borderStyle = 'dashed';
    add.style.opacity = '0.95';
    add.addEventListener('click', async () => {
      if (!state.currentUser || !state.activeSemesterId){
        alert('No hay semestre activo para agregar ramos.');
        return;
      }
      await openCourseQuickModal(state.activeSemesterId, { forceFirestore: false });

    });
    host.appendChild(add);

    bindSimPaletteReorderDnD();
  }

  let _simParMenuEl = null;
  function ensureSimParMenuStyles(){
    if (document.getElementById('simParMenuStyles')) return;
    const st = document.createElement('style');
    st.id = 'simParMenuStyles';
    st.textContent = `
      .sim-par-menu{
        position: fixed;
        z-index: 10080;
        min-width: 260px;
        max-width: 320px;
        padding: 10px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(18,21,39,.96);
        backdrop-filter: blur(10px);
        box-shadow: 0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
      }
      .sim-par-menu .title{
        font-size:12px;
        font-weight:900;
        opacity:.85;
        margin: 0 0 8px 0;
        letter-spacing:.2px;
      }
      .sim-par-menu .item{
        width:100%;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:10px 10px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.03);
        color:#fff;
        cursor:pointer;
        font-weight:800;
        font-size:13px;
      }
      .sim-par-menu .item:hover{
        filter: brightness(1.06);
        transform: translateY(-1px);
      }
      .sim-par-menu .item:active{
        transform: translateY(0px);
      }
      .sim-par-menu .item.add{
        border-style: dashed;
        background: rgba(255,255,255,.02);
        margin-top: 8px;
      }
      .sim-par-menu .hint{
        font-size:12px;
        opacity:.7;
        margin-top:8px;
      }
        .sim-par-menu .row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    width:100%;
  }
  .sim-par-menu .actions{
    display:flex;
    gap:8px;
    align-items:center;
  }
  .sim-par-menu .iconbtn{
    width:30px;
    height:30px;
    border-radius:10px;
    border:1px solid rgba(255,255,255,.14);
    background: rgba(255,255,255,.06);
    color:#fff;
    font-weight:900;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .sim-par-menu .iconbtn:hover{ filter:brightness(1.08); }
  .sim-par-menu .iconbtn.danger{
    border-color: rgba(239,68,68,.35);
    background: rgba(239,68,68,.10);
  }

  .sim-par-menu .head{
    position: relative;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin-bottom:8px;
  }

  .sim-par-menu .head .broombtn{
    margin-left:auto;   
    flex: 0 0 auto;
  }


  .sim-par-menu .head .title{
    margin:0;
  }

  .sim-par-menu .head .broombtn:hover{ filter:brightness(1.10); }
  .sim-par-menu .head .broombtn:active{ transform:translateY(1px); }

  .sim-par-menu .head .broombtn.danger{
    border-color: rgba(239,68,68,.35);
    background: rgba(239,68,68,.10);
  }
    .sim-par-menu .pickbox{
    width:18px;
    height:18px;
    border-radius:6px;
    border:1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.10);  /* gris */
    cursor:pointer;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    flex: 0 0 auto;
  }

  .sim-par-menu .pickbox.on{
    background: rgba(34,197,94,.90);   /* verde */
    border-color: rgba(34,197,94,.95);
    box-shadow: 0 0 0 3px rgba(34,197,94,.18);
  }

  .sim-par-menu .pickbox::after{
    content:'';
    width:8px;
    height:8px;
    border-radius:3px;
    background: rgba(0,0,0,.22);
    opacity:.0;
  }
  .sim-par-menu .pickbox.on::after{
    opacity:1;
    background: rgba(0,0,0,.18);
  }
    `;
    document.head.appendChild(st);
  }

  function ensureParallelEditorDnDStyles(){
    if (document.getElementById('parEditDnDStyles')) return;
    const st = document.createElement('style');
    st.id = 'parEditDnDStyles';
    st.textContent = `
      #parEditModal .usm-grid2 .cell.slot{
        position: relative;
        overflow: hidden;
      }
      #parEditModal .usm-grid2 .cell.slot.over{
        outline: 2px solid rgba(124,58,237,.55);
        outline-offset: -2px;
      }
      #parEditModal .usm-grid2 .cell.slot.hint-top::before,
      #parEditModal .usm-grid2 .cell.slot.hint-full::before,
      #parEditModal .usm-grid2 .cell.slot.hint-bottom::before{
        content:'';
        position:absolute;
        left:6px; right:6px;
        border-radius:10px;
        background: rgba(124,58,237,.18);
        border: 1px dashed rgba(124,58,237,.55);
        pointer-events:none;
      }
      #parEditModal .usm-grid2 .cell.slot.hint-top::before{
        top:6px;
        height: calc(33% - 6px);
      }
      #parEditModal .usm-grid2 .cell.slot.hint-full::before{
        top:6px;
        height: calc(100% - 12px);
      }
      #parEditModal .usm-grid2 .cell.slot.hint-bottom::before{
        bottom:6px;
        height: calc(33% - 6px);
      }
      #parEditModal .par-placed{
        position:absolute;
        left:6px;
        right:6px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.14);
        background: rgba(124,58,237,.22);
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:900;
        user-select:none;
        cursor:grab;
        box-sizing:border-box;
      }
      #parEditModal .par-placed:active{ cursor:grabbing; }
      #parEditModal .par-placed.pos-top{
        top:6px;
        height: calc(33% - 6px);
      }
      #parEditModal .par-placed.pos-full{
        top:6px;
        height: calc(100% - 12px);
      }
      #parEditModal .par-placed.pos-bottom{
        bottom:6px;
        height: calc(33% - 6px);
      }

      #parEditModal .par-placed .par-x{
        position:absolute;
        top:6px;
        right:6px;
        width:22px;
        height:22px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.16);
        background: rgba(0,0,0,.25);
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:900;
        line-height:1;
        cursor:pointer;
      }
      #parEditModal .par-placed .par-x:hover{ filter: brightness(1.12); }
    `;
    document.head.appendChild(st);
  }
  function closeSimParMenu(){
    if (_simParMenuEl){
      _simParMenuEl.remove();
      _simParMenuEl = null;
    }
  }
  function ensureParallelEditorModal(){
    if (document.getElementById('parEditModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'parEditModal';
    wrap.style.cssText = `position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10090; padding:16px;`;

    wrap.innerHTML = `
      <div id="parEditPanel" style="width:min(980px, 98vw); max-height:92vh; overflow:auto; overscroll-behavior:contain; background:#121527;
        border:1px solid rgba(255,255,255,.10); border-radius:18px; padding:14px; color:#fff;">
        
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div id="parEditTitle" style="font-size:16px;font-weight:900;">Paralelo</div>
            <div class="muted" style="font-size:12.5px;opacity:.75;margin-top:4px;">
              Arrastra el ramo en los bloques donde ocurre este paralelo.
            </div>
          </div>
          <button id="parEditX" class="btn violet-outline" type="button">✕</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:12px;">
          <div>
            <label style="font-size:13px;opacity:.9;">Profesor</label>
            <input id="parEditProf" type="text" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
              border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
          </div>
          <div>
            <label style="font-size:13px;opacity:.9;">Paralelo / Sección</label>
            <input id="parEditSec" type="text" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
              border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
          </div>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; align-items:center;">
          <div id="parEditChip" class="palette-rect" draggable="true" style="cursor:grab;"></div>
          <div class="muted" style="font-size:12.5px;opacity:.75;">Arrastra este chip al horario de abajo.</div>
        </div>

        <div id="parEditGrid" class="card" style="padding:12px; margin-top:12px;"></div>

        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px;">
          <button id="parEditCancel" class="btn violet-outline" type="button">Cancelar</button>
          <button id="parEditSave" class="btn violet" type="button">Guardar paralelo</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const close = () => {
      wrap.style.display = 'none';
      document.documentElement.classList.remove('sim-lock');
      document.body.classList.remove('sim-lock');
      stopGlobalAutoScroll();
    };

    document.getElementById('parEditX').addEventListener('click', close);
    document.getElementById('parEditCancel').addEventListener('click', close);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) close();
    });
  }
  async function openParallelEditor(course, pidOrNull){
    ensureParallelEditorModal();

    const modal = document.getElementById('parEditModal');
    const panel = document.getElementById('parEditPanel');
    const title = document.getElementById('parEditTitle');
    const inProf = document.getElementById('parEditProf');
    const inSec  = document.getElementById('parEditSec');
    const chip   = document.getElementById('parEditChip');
    const grid   = document.getElementById('parEditGrid');
    const btnSave   = document.getElementById('parEditSave');
    const btnCancel = document.getElementById('parEditCancel');
    const btnX      = document.getElementById('parEditX');

    const courseId = course.id;
    const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
    const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));
    const findByPid = (pid) => defs.find(d => d.pid === pid) || null;
    const original = pidOrNull ? findByPid(pidOrNull) : null;

    let draft;
    let isNew = false;

    if (!original){
      isNew = true;
      const nextNum = defs.length + 1;
      draft = { courseId, pid: `P${nextNum}`, professor:'', section:'', blocks:[] };
    } else {
      draft = deepClone(original);
    }

    inProf.value = draft.professor || '';
    inSec.value  = draft.section || draft.pid || '';

    const renderHeader = () => {
      const sec = (inSec.value || '').trim() || draft.pid;
      title.textContent = `${course.name} · ${sec}`;
      const txt = chip.querySelector('.drag-txt');
      if (txt) txt.textContent = `${course.name} · ${sec}`;
      else chip.textContent = `${course.name} · ${sec}`;
    };

    chip.dataset.payload = JSON.stringify({
      type:'parallel-template',
      courseId,
      pid: draft.pid
    });

    const courseColor = isValidHex(course.color) ? course.color : '#3B82F6';
    chip.style.borderColor = courseColor;
    chip.style.background = hexToRgba(courseColor, .18);
    chip.style.color = bestText(courseColor);
    chip.style.borderRadius = '999px';
    chip.style.padding = '10px 14px';
    chip.style.display = 'inline-flex';
    chip.style.alignItems = 'center';
    chip.style.gap = '10px';
    chip.style.fontWeight = '900';
    chip.style.borderWidth = '2px';
    chip.style.boxShadow = '0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)';
    chip.style.userSelect = 'none';

    if (!chip.querySelector('.drag-ico')) {
      chip.innerHTML = `<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`;
    }

    inSec.oninput = renderHeader;
    renderHeader();

    await renderParallelEditorGrid(grid, draft);
    ensureParallelEditorDnDStyles();

    document.documentElement.classList.add('sim-lock');
    document.body.classList.add('sim-lock');
    modal.style.display = 'flex';

    requestAnimationFrame(() => {
      if (panel) panel.scrollTop = 0;
      inProf?.focus();
    });

    const cleanup = () => {
      btnSave.onclick = null;
      btnCancel.onclick = null;
      btnX.onclick = null;
      modal.onclick = null;
      document.removeEventListener('keydown', onKey);
      stopGlobalAutoScroll();
    };

    const closeOnly = () => {
      cleanup();
      modal.style.display = 'none';
      document.documentElement.classList.remove('sim-lock');
      document.body.classList.remove('sim-lock');
    };

    const onCancel = () => closeOnly();
    const onBackdrop = (e) => {
      if (e.target === modal) onCancel();
    };
    const onKey = (e) => {
      if (modal.style.display === 'flex' && e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    btnX.onclick = onCancel;
    btnCancel.onclick = onCancel;
    modal.onclick = onBackdrop;
    document.addEventListener('keydown', onKey);

    btnSave.onclick = async () => {
      draft.professor = (inProf.value || '').trim();
      draft.section   = (inSec.value  || '').trim();

      if (isNew){
        const next = [...defs, deepClone(draft)];
        SIM_PARALLEL_DEFS.set(courseId, next);
      } else {
        original.professor = draft.professor;
        original.section   = draft.section;
        original.blocks    = deepClone(draft.blocks);
        SIM_PARALLEL_DEFS.set(courseId, defs);
      }

      saveSimParallelDefs();
      markSimDirty();
      renderSimPalette();
      closeOnly();

      if (IN_SIM_MODAL && SELECTED_PARALLEL.get(courseId) === draft.pid){
        await applyCourseParallelToSim(courseId, draft.pid);
      }
    };
  }
  async function renderParallelEditorGrid(hostEl, def){
    const uni = getActiveUniCode();
    const SLOTS = SIM_SLOTS || await getMySlots();

    if (!SLOTS){
      hostEl.innerHTML = `<div class="muted">No hay slots definidos.</div>`;
      return;
    }

    const headerTitle = (uni === 'USM') ? 'Bloque' : 'Módulo';

    hostEl.innerHTML = `
      <div class="usm-grid2">
        <div class="cell header">${headerTitle}</div>
        ${DAYS.map(d=>`<div class="cell header">${d}</div>`).join('')}

        ${SLOTS.map((s,slotIndex)=>`
          <div class="cell mod ${s.lunch?'lunch':''}" data-slot="${slotIndex}">
            ${renderModuleCell(s, slotIndex, uni)}
          </div>
          ${DAYS.map((_,dayIndex)=>`
            <div class="cell slot ${s.lunch?'is-lunch':''}"
                data-day="${dayIndex}" data-slot="${slotIndex}"
                ${s.lunch?'aria-disabled="true"':''}
                style="${s.lunch ? 'pointer-events:none; opacity:.65;' : ''}">
              ${renderParallelTemplateMarks(def, dayIndex, slotIndex)}
            </div>
          `).join('')}
        `).join('')}
      </div>
    `;

    hostEl.querySelectorAll('.par-placed').forEach(el => {
      el.addEventListener('dragstart', (ev) => {
        const day  = parseInt(el.dataset.day, 10);
        const slot = parseInt(el.dataset.slot, 10);
        const pos  = el.dataset.pos || 'full';

        ev.dataTransfer.setData('text/plain', JSON.stringify({
          type: 'move-par-block',
          courseId: def.courseId,
          pid: def.pid,
          from: { day, slot, pos }
        }));
        ev.dataTransfer.effectAllowed = 'move';
        isDraggingChip = true;
      });

      el.addEventListener('dragend', stopGlobalAutoScroll);

      const x = el.querySelector('.par-x');
      if (x){
        x.addEventListener('click', (e) => {
          e.stopPropagation();
          const day  = parseInt(el.dataset.day, 10);
          const slot = parseInt(el.dataset.slot, 10);
          const pos  = el.dataset.pos || 'full';

          const idx = def.blocks.findIndex(b =>
            b.day === day &&
            b.slot === slot &&
            (b.pos || 'full') === pos
          );

          if (idx >= 0) def.blocks.splice(idx, 1);
          renderParallelEditorGrid(hostEl, def);
        });
      }
    });

    hostEl.querySelectorAll('.cell.slot').forEach(cell => {
      if (cell.classList.contains('is-lunch')) return;

      cell.addEventListener('dragover', (ev) => {
        ev.preventDefault();

        const rect = cell.getBoundingClientRect();
        const y = ev.clientY - rect.top;
        const mid = rect.height / 2;

        let vpos = 'full';
        if (y < mid - 10) vpos = 'top';
        else if (y > mid + 10) vpos = 'bottom';

        cell.dataset.droppos = vpos;
        cell.classList.add('over');
        cell.classList.remove('hint-top', 'hint-full', 'hint-bottom');
        cell.classList.add(
          vpos === 'top' ? 'hint-top' :
          vpos === 'bottom' ? 'hint-bottom' :
          'hint-full'
        );
      });

      cell.addEventListener('dragleave', () => {
        cell.classList.remove('over', 'hint-top', 'hint-full', 'hint-bottom');
        delete cell.dataset.droppos;
      });

      cell.addEventListener('drop', (ev) => {
        ev.preventDefault();
        stopGlobalAutoScroll();

        const pos = cell.dataset.droppos || 'full';
        cell.classList.remove('over', 'hint-top', 'hint-full', 'hint-bottom');
        delete cell.dataset.droppos;

        const raw = ev.dataTransfer.getData('text/plain');
        let data = null;
        try { data = JSON.parse(raw); } catch {}

        const day  = parseInt(cell.dataset.day, 10);
        const slot = parseInt(cell.dataset.slot, 10);
        const slotDef = SLOTS?.[slot];

        if (!slotDef || slotDef.lunch || !data) return;

        if (data.type === 'move-par-block') {
          const from = data.from || {};
          const fromIdx = def.blocks.findIndex(b =>
            b.day === Number(from.day) &&
            b.slot === Number(from.slot) &&
            (b.pos || 'full') === (from.pos || 'full')
          );

          if (fromIdx < 0) return;

          const occupied = def.blocks.some((b, idx) =>
            idx !== fromIdx &&
            b.day === day &&
            b.slot === slot &&
            (b.pos || 'full') === pos
          );

          if (occupied) {
            alert('Ese espacio ya está ocupado por otro bloque del paralelo.');
            return;
          }

          const moving = def.blocks[fromIdx];
          moving.day = day;
          moving.slot = slot;
          moving.pos = pos;
          moving.start = slotDef.start;
          moving.end = slotDef.end;
          moving.hpos = moving.hpos || 'single';

          renderParallelEditorGrid(hostEl, def);
          return;
        }

        if (data.type !== 'parallel-template') return;

        const idx = def.blocks.findIndex(b =>
          b.day === day &&
          b.slot === slot &&
          (b.pos || 'full') === pos
        );

        if (idx >= 0) {
          return;
        }

        def.blocks.push({
          day,
          slot,
          pos,
          hpos:'single',
          start: slotDef.start,
          end: slotDef.end
        });

        renderParallelEditorGrid(hostEl, def);
      });
    });
  }
  function renderParallelTemplateMarks(def, day, slot){
    const list = (def.blocks || []).filter(b => b.day===day && b.slot===slot);
    if (!list.length) return '';
    const mapPosClass = (p) => (p === 'top' ? 'pos-top' : p === 'bottom' ? 'pos-bottom' : 'pos-full');
    return list.map(b => `
      <div class="par-placed ${mapPosClass(b.pos || 'full')}"
          draggable="true"
          data-course="${def.courseId}"
          data-pid="${def.pid}"
          data-day="${day}"
          data-slot="${slot}"
          data-pos="${b.pos || 'full'}">
        ✓
        <button class="par-x" type="button" title="Quitar">×</button>
      </div>
    `).join('');
  }
  async function applyCourseParallelToSchedule(courseId, pid){
    if (!state.currentUser || !state.activeSemesterId) return;
    const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
    const def = defs.find(d=> d.pid === pid);
    if (!def) return;
    const ref = collection(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'schedule');
    const snap = await getDocs(ref);
    const toDel = snap.docs.filter(d => d.data()?.courseId === courseId);
    for (const d of toDel){
      await deleteDoc(d.ref);
    }
    const SLOTS = await getMySlots();
    for (const b of def.blocks){
      const slotDef = SLOTS?.[b.slot];
      if (!slotDef || slotDef.lunch) continue;
      await addDoc(ref, {
        courseId,
        day: b.day,
        slot: b.slot,
        start: slotDef.start,
        end: slotDef.end,
        pos: b.pos || 'full',
        hpos: b.hpos || 'single',
        parallelPid: pid,
        displayName: `${(state.courses.find(c=>c.id===courseId)?.name || 'Ramo')} · ${def.section || pid}`,
        createdAt: Date.now()
      });
    }

    SELECTED_PARALLEL.set(courseId, pid);
  }

  async function clearCourseFromMySchedule(courseId){
    if (!state.currentUser || !state.activeSemesterId) return;

    const ref = collection(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'schedule');
    const snap = await getDocs(ref);

    const toDel = snap.docs.filter(d => d.data()?.courseId === courseId);
    for (const d of toDel){
      await deleteDoc(d.ref);
    }
  }
  function openSimParMenu(course, anchorBtn){
    ensureSimParMenuStyles();
    closeSimParMenu();
    const menu = document.createElement('div');
    menu.className = 'sim-par-menu';

    const courseId = course.id;
    const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
    const courseInMySchedule = (items || []).some(x => x.courseId === courseId);
  const hasSelectedParallel = SELECTED_PARALLEL.has(courseId);
  const canClear = courseInMySchedule || hasSelectedParallel;

    menu.innerHTML = `
    <div class="head">
      <div class="title">Paralelos de ${escapeHtml(course.name || 'Ramo')}</div>
      <div style="display:flex; gap:8px;">
        <button id="simClearFromScheduleBtn"
          class="broombtn danger"
          type="button"
          title="Sacar del horario (mantener en pool)"
          aria-label="Sacar del horario"
          ${canClear ? '' : 'disabled'}
          style="${canClear ? '' : 'opacity:.35; cursor:not-allowed;'}"
        >🧹</button>
        <button id="simRemoveCourseBtn"
          class="broombtn danger"
          type="button"
          title="Eliminar ramo del simulador"
          aria-label="Eliminar ramo del simulador"
        >✕</button>
      </div>
    </div>
    <div class="list"></div>
    <button class="item add" type="button">
      <span>➕ Agregar paralelo</span>
      <span style="opacity:.7;"></span>
    </button>
  `;
    document.body.appendChild(menu);
    _simParMenuEl = menu;
    const cleanup = () => {
      document.removeEventListener('pointerdown', onDocDown, { capture:true });
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
    const closeThisMenu = () => {
      if (_simParMenuEl){
        _simParMenuEl.remove();
        _simParMenuEl = null;
      }
      cleanup();
    };
    const onDocDown = (e) => {
    if (!menu.contains(e.target) && !anchorBtn.contains(e.target)) closeThisMenu();
  };
    const onKey = (e) => { if (e.key === 'Escape') closeThisMenu(); };
    const onScroll = () => closeThisMenu();
    const onResize = () => closeThisMenu();
    const list = menu.querySelector('.list');
    if (!defs.length){
      const empty = document.createElement('div');
      empty.className = 'hint';
      empty.textContent = 'Aún no hay paralelos.';
      list.appendChild(empty);
    } else {
      defs.forEach(def => {
        const row = document.createElement('div');
        row.className = 'item';
        row.style.cursor = 'default';
        const isSelected = (SELECTED_PARALLEL.get(courseId) === def.pid);
  row.innerHTML = `
    <div class="row">
      <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
        <div class="pickbox ${isSelected ? 'on' : ''}" title="Seleccionar paralelo" aria-label="Seleccionar paralelo"></div>

        <div style="min-width:0;">
          <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(def.section || def.pid)}
          </div>
          <div style="opacity:.75; font-weight:800; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(def.professor || '—')}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="iconbtn" type="button" title="Editar">✏️</button>
        <button class="iconbtn danger" type="button" title="Borrar">✕</button>
      </div>
    </div>
  `;
        const btnEdit = row.querySelector('.iconbtn:not(.danger)');
        const btnDel  = row.querySelector('.iconbtn.danger');
        const pick = row.querySelector('.pickbox');
  pick.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    SELECTED_PARALLEL.set(courseId, def.pid);
    saveSimSelectedParallels();   // ✅ importante
  markSimDirty();
    if (IN_SIM_MODAL){
      await applyCourseParallelToSim(courseId, def.pid);
    } else {
      await applyCourseParallelToSchedule(courseId, def.pid);
      renderGrid();
    }
    closeThisMenu();
  });
        row.querySelector('.row > div')?.addEventListener('click', async (e)=>{
    if (e.target.closest('.pickbox')) return;
    if (e.target.closest('.actions')) return;
    if (e.target.closest('button')) return;

    closeThisMenu();
    if (IN_SIM_MODAL){
      await applyCourseParallelToSim(course.id, def.pid);
      return;
    }
    openParallelEditor(course, def.pid);
  });
        btnEdit.addEventListener('click', async (e)=>{
          e.stopPropagation();
          closeThisMenu();
          openParallelEditor(course, def.pid);
        });

        btnDel.addEventListener('click', async (e)=>{
          e.stopPropagation();
          const ok = await askYesNo({
    title: 'Borrar paralelo',
    text: `¿Quieres borrar el paralelo ${def.section || def.pid}?`,
    yesText: 'Borrar',
    noText: 'Cancelar'
  });
  if (!ok) return;
          const all = SIM_PARALLEL_DEFS.get(course.id) || [];
          const next = all.filter(x => x.pid !== def.pid);
          SIM_PARALLEL_DEFS.set(course.id, next);
          SIM_ITEMS = SIM_ITEMS.filter(x => !(x.courseId === course.id && x.pid === def.pid));
          markSimDirty();
          if (SELECTED_PARALLEL.get(course.id) === def.pid){
            SELECTED_PARALLEL.delete(course.id);
          }
          renderSimPalette();
          if (IN_SIM_MODAL) await renderSimGrid();
          closeThisMenu();
        });
        list.appendChild(row);
      });
    }
    menu.querySelector('.item.add').addEventListener('click', async () => {
      closeThisMenu();
      await openParallelEditor(course, null);
    });
    menu.querySelector('#simClearFromScheduleBtn')?.addEventListener('click', async ()=>{
    if (!canClear) return; 
    closeThisMenu();
    await clearCourseFromMySchedule(course.id);
    SIM_ITEMS = SIM_ITEMS.filter(x => x.courseId !== course.id);
    markSimDirty();
    SELECTED_PARALLEL.delete(course.id); 
    renderGrid();
    if (IN_SIM_MODAL) await renderSimGrid();
  });
  menu.querySelector('#simRemoveCourseBtn')?.addEventListener('click', async ()=> {
    const ok = await askYesNo({
      title: 'Eliminar ramo',
      text: `¿Eliminar "${course.name}" del simulador? Esto lo quitará de tu lista de ramos.`,
      yesText: 'Eliminar',
      noText: 'Cancelar'
    });
    if (!ok) return;
    closeThisMenu();
    if (IN_SIM_MODAL) {
    const cid = course.id;
    SIM_COURSES = (SIM_COURSES || []).filter(c => c.id !== cid);
    SIM_ITEMS   = (SIM_ITEMS || []).filter(x => x.courseId !== cid);
    SIM_PARALLEL_DEFS.delete(cid);
    SELECTED_PARALLEL.delete(cid);
    saveSimCourses(SIM_COURSES); // ✅ persistir pool del simulador
    renderSimPalette();
    await renderSimGrid();
    return;
  }
    if (!state.currentUser || !state.activeSemesterId) return;
    try {
      await clearCourseFromMySchedule(course.id);
      await deleteDoc(doc(
        db,
        'users', state.currentUser.uid,
        'semesters', state.activeSemesterId,
        'courses', course.id
      ));
      SIM_ITEMS = SIM_ITEMS.filter(x => x.courseId !== course.id);
      markSimDirty();
      SIM_PARALLEL_DEFS.delete(course.id);
      SELECTED_PARALLEL.delete(course.id);
      state.courses = (state.courses || []).filter(c => c.id !== course.id);
      document.dispatchEvent(new Event('courses:changed'));
      if (IN_SIM_MODAL) await renderSimGrid();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el ramo.');
    }
  });
    const r = anchorBtn.getBoundingClientRect();
    const pad = 8;
    menu.style.left = '-9999px';
    menu.style.top  = '-9999px';
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    let left = r.left;
    let top  = r.bottom + pad;
    left = Math.min(left, window.innerWidth  - mw - pad);
    left = Math.max(left, pad);
    if (top + mh > window.innerHeight - pad) {
      top = r.top - mh - pad;
    }
    top = Math.max(top, pad);
    menu.style.left = `${left}px`;
    menu.style.top  = `${top}px`;
    setTimeout(() => {
      document.addEventListener('pointerdown', onDocDown, { capture:true });
    }, 0);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
  }
  function vRangeFromPos(pos){
    const p = pos || 'full';
    if (p === 'top') return { a: 0.00, b: 0.3334 };
    if (p === 'bottom') return { a: 0.6666, b: 1.00 };
    return { a: 0.00, b: 1.00 }; 
  }

  function overlapsV(r1, r2){
    return r1.a < r2.b && r2.a < r1.b;
  }
  function packLanesByVertical(blocks){
    const arr = blocks.map(b => ({ ...b, _vr: vRangeFromPos(b.pos) }));
    const orderPos = { top:0, full:1, bottom:2 };
    arr.sort((x,y)=>{
      const ax = orderPos[x.pos||'full'] ?? 1;
      const ay = orderPos[y.pos||'full'] ?? 1;
      if (ax !== ay) return ax - ay;
      return String(x.id||'').localeCompare(String(y.id||''));
    });
    const lanes = []; 
    for (const b of arr){
      let placed = false;
      for (let li=0; li<lanes.length; li++){
        const laneBlocks = lanes[li];
        const collide = laneBlocks.some(o => overlapsV(b._vr, o._vr));
        if (!collide){
          b._lane = li;
          laneBlocks.push(b);
          placed = true;
          break;
        }
      }
      if (!placed){
        b._lane = lanes.length;
        lanes.push([b]);
      }
    }
    return { blocks: arr, laneCount: Math.max(1, lanes.length) };
  }
  export function initSchedule(){
    if (schedBooted) return; 
    schedBooted = true;
    renderShell();
  bindDnD();
  bindBlockClick();
  renderPartyShell();
  populatePartyMembersBar();
  autoSelectPartyMemberSemester();
  document.addEventListener('party:ready', () => {if ($('subtabCombinado')?.classList.contains('active')) renderPartyBusyInCombined();});
  document.addEventListener('party:changed', () => {if ($('subtabCombinado')?.classList.contains('active')) renderPartyBusyInCombined();});
  document.addEventListener('semester:changed', () => {if ($('subtabCombinado')?.classList.contains('active')) renderPartyBusyInCombined();});
  document.addEventListener('profile:changed', async () => {
  const me = state.currentUser?.uid;
    if (!me) return;
    partyMemberProfileCache[me] = partyMemberProfileCache[me] || {};
    if (state.profileData?.name) partyMemberProfileCache[me].name = state.profileData.name;
    if (state.profileData?.favoriteColor) partyMemberProfileCache[me].color = state.profileData.favoriteColor;
    if ($('subtabCompartido')?.classList.contains('active')) {
      await loadPartyMemberProfile(me, { force: true }); 
      await populatePartyMembersBar();
    }
    if ($('subtabCombinado')?.classList.contains('active')) {
      renderBusyLegend('busyLegendCombined');
      scheduleBusyRender();
    }
  });
    const tabProp = $('subtabPropio');
  const tabComp = $('subtabCompartido');
  const tabCombi = $('subtabCombinado');
  mountSimButtonInSubtabsRow();
  const pageProp = $('horarioPropio');
  const pageComp = $('horarioCompartido');
  const pageCombi = $('horarioCombinado');
  function showPropio(){
    tabProp.classList.add('active');
    tabComp.classList.remove('active');
    tabCombi.classList.remove('active');
    pageProp.classList.remove('hidden');
    pageComp.classList.add('hidden');
    pageCombi.classList.add('hidden');
  }
  async function showCompartido() {
    tabComp.classList.add('active');
    tabProp.classList.remove('active');
    tabCombi.classList.remove('active');
    pageComp.classList.remove('hidden');
    pageProp.classList.add('hidden');
    pageCombi.classList.add('hidden');
    await populatePartyMembersBar();
    if (state.partyView?.uid) {
      await populatePartySemesters(state.partyView.uid);
    }
    await autoSelectPartyMemberSemester();

    if (state.partyView?.uid && state.partyView?.semId) {
      subscribePartyMember(state.partyView.uid, state.partyView.semId);
    } else {
      buildPartyGrid();
    }
  }
  async function renderPartyBusyInCombined(){
    const host = $('horarioCombinado');
    if (!host) return;
    host.innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <h3 style="margin:0">Horario compartido</h3>

        <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">
          <div>
            <label style="font-size:12px;opacity:.8;">Semestre</label><br/>
            <select id="busy-semSelCombined"></select>
          </div>
        </div>
      </div>

      <div id="busyLegendCombined" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:12px;"></div>
    </div>

    <div id="schedPartyBusyCombined" class="card" style="padding:12px;"></div>
  `;
  const sel = document.getElementById('busy-semSelCombined');
  if (sel && state.currentUser){
    const ref = collection(db,'users',state.currentUser.uid,'semesters');
    const snap = await getDocs(query(ref));
    const list = snap.docs.map(d => ({
      id: d.id,
      label: String(d.data()?.label || d.id).trim()
    })).sort((a,b)=> b.label.localeCompare(a.label));

    if (!list.length){
      sel.innerHTML = `<option value="" disabled selected>— sin semestres —</option>`;
      return;
    }
    const nextSemesterLabel = (label) => {
      const m = /^(\d{4})-(1|2)$/.exec(String(label || '').trim());
      if (!m) return null;
      const y = parseInt(m[1],10);
      const t = parseInt(m[2],10);
      return (t === 1) ? `${y}-2` : `${y+1}-1`;
    };
    sel.innerHTML = '';
    for (const it of list){
      const opt = document.createElement('option');
      opt.value = it.label;    
      opt.textContent = it.label;
      sel.appendChild(opt);
    }
    const activeLabel = state.activeSemesterData?.label || null;
    const prefer = nextSemesterLabel(activeLabel) || activeLabel;
    const labels = list.map(x => x.label);
    const defaultLabel =
      (prefer && labels.includes(prefer)) ? prefer
      : (activeLabel && labels.includes(activeLabel)) ? activeLabel
      : list[0].label;
    sel.value = defaultLabel;
    await subscribePartyBusyAll(defaultLabel);
    renderBusyLegend('busyLegendCombined');
    renderPartyBusyTimeline('schedPartyBusyCombined');
    sel.addEventListener('change', async () => {
      const chosenLabel = sel.value; 
      await subscribePartyBusyAll(chosenLabel);
      renderBusyLegend('busyLegendCombined');
      renderPartyBusyTimeline('schedPartyBusyCombined');
    });
  }}
  async function showCombinado(){
    tabCombi.classList.add('active');
    tabProp.classList.remove('active');
    tabComp.classList.remove('active');
    pageCombi.classList.remove('hidden');
    pageProp.classList.add('hidden');
    pageComp.classList.add('hidden');

    await renderPartyBusyInCombined(); 
  }
  tabProp.addEventListener('click', showPropio);
  tabComp.addEventListener('click', () => { showCompartido(); });
  tabCombi.addEventListener('click', showCombinado);
  showPropio();
  document.addEventListener('courses:changed', () => {
    if (IN_SIM_MODAL){
      renderSimPalette();     
      return;
    }
    renderPalette();
    renderGrid();
  });
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.block-del-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id || !state.currentUser || !state.activeSemesterId) return;
    if (!confirm('¿Eliminar este bloque del horario?')) return;
    try {
      await deleteDoc(doc(
        db,
        'users', state.currentUser.uid,
        'semesters', state.activeSemesterId,
        'schedule', id
      ));
    } catch(err) {
      console.error(err);
      alert('No se pudo eliminar el bloque.');
    }
  });
  function mountSimButtonInSubtabsRow(){
    const tabProp = $('subtabPropio');
    if (!tabProp) return;
    const row = tabProp.parentElement;
    if (!row) return;
    if (document.getElementById('btnSimSchedule')) return;
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    row.style.flexWrap = 'wrap';
    const spacer = document.createElement('div');
    spacer.style.flex = '1 1 auto';
    row.appendChild(spacer);
    const btn = document.createElement('button');
    btn.id = 'btnSimSchedule';
    btn.className = 'btn violet'; 
    btn.textContent = 'Simulador de horario';
    btn.style.marginLeft = 'auto';
    row.appendChild(btn);
  }

  function bindSimButton(){
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('#btnSimSchedule');
      if (!btn) return;

      await openSimSchedule();
    });
  }
    bindExportButtons();
  bindSimButton();
  }
  export function onActiveSemesterChanged(){
    if (unsubscribeSchedule){ unsubscribeSchedule(); unsubscribeSchedule=null; }
    if (unsubMyCourses){ unsubMyCourses(); unsubMyCourses = null; }

    if (!state.currentUser || !state.activeSemesterId) {
      renderNoActiveSemester();
      return;
    }
    items = [];
    renderGrid();
    const coursesRef = collection(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'courses');
    unsubMyCourses = onSnapshot(query(coursesRef, orderBy('createdAt')), (snap)=>{
      state.courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      document.dispatchEvent(new Event('courses:changed'));
    });
    const ref = collection(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'schedule');
    unsubscribeSchedule = onSnapshot(query(ref), (snap)=>{
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderGrid();
    });
  }
  function renderNoActiveSemester() {
    document.querySelectorAll('.schedule-controls').forEach(el => el.remove());

    const host = $('schedUSM');
    if (host) {
      host.innerHTML = `
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `;
    }
    const pal = $('coursePalette');
    if (pal) pal.innerHTML = `<div class="muted">Selecciona o crea un semestre para ver ramos.</div>`;
    items = [];
    CURRENT_SLOTS = [];
  }
  function renderShell(){
    const host = $('horarioPropio');
    host.innerHTML = `
    <div class="card" style="margin-bottom:12px">

      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <h3 style="margin:0">Paleta de ramos</h3>
      </div>
      <div id="coursePalette" class="palette" style="margin-top:10px;"></div>
      <div class="muted" style="margin-top:6px">
        <ul style="margin:4px 0 0 20px; padding:0; list-style:disc;">
          <li>Arrastra un ramo a un módulo.</li>
          <li>Puedes arrastrar ramos del mismo horario.</li>
          <li>La pre-vista indica <b>arriba</b>, <b>completo</b>, <b>abajo</b>, <b>izquierda</b> o <b>derecha</b>.</li>
          <li>Para eliminar un bloque, haz <b>click</b> en la X.</li>
          <li>Para ver la información del ramo, haz <b>click</b> sobre él.</li>
          <li>En horario personalizado, haz <b>click</b> sobre los horarios de los módulos para modificarlos.</li>
        </ul>
      </div>
    </div>
    <div id="schedUSM" class="sched-usm card"></div>
  `;
    renderPalette();
    renderGrid();
  }
  export function refreshCourseOptions(){ renderPalette(); renderGrid(); }
  function renderPalette(){
    const pal = $('coursePalette');
    if (!pal) return;
    pal.innerHTML = '';
  const list = Array.isArray(state.courses) ? state.courses : [];
    if (ALLOW_ADD_COURSE_UI){
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'palette-chip';
      add.id = 'paletteAddCourseChip';
      add.textContent = '+';
      add.style.cursor = 'pointer';
      add.style.fontWeight = '900';
      add.style.fontSize = '18px';
      add.style.display = 'inline-flex';
      add.style.alignItems = 'center';
      add.style.justifyContent = 'center';
      add.style.minWidth = '44px';
      add.style.borderStyle = 'dashed';
      add.style.opacity = '0.95';

      add.addEventListener('click', async () => {
        const semId = document.getElementById('sim-semSel')?.value || state.activeSemesterId;
        await openCourseQuickModal(semId);
      });

      pal.appendChild(add); 
    }
    if (!list.length){
      const msg = document.createElement('div');
      msg.className = 'muted';
      msg.style.marginLeft = '10px';
      msg.textContent = ALLOW_ADD_COURSE_UI
        ? 'Aún no tienes ramos. Presiona + para agregar el primero.'
        : 'Aún no tienes ramos. Agrega ramos desde el simulador.';
      pal.appendChild(msg);
      return;
    }
    list.forEach(c => {
      const chip = document.createElement('div');
      chip.className = 'palette-chip';
      chip.setAttribute('draggable','true');
      chip.dataset.courseId = c.id;
      chip.textContent = c.name;

      const col = isValidHex(c.color) ? c.color : '#3B82F6';
      chip.style.borderColor = col;
      chip.style.boxShadow = 'inset 0 0 0 2px rgba(0,0,0,.15)';
      pal.appendChild(chip);
    });
  }
  function renderNoScheduleCard(host){
    document.querySelectorAll('.schedule-controls').forEach(el => el.remove());

    host.innerHTML = `
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `;
    $('btnCreateNewSched')?.addEventListener('click', () => createCustomScheduleFlow(false));
  }

  async function deleteSemesterScheduleOnly(uid, semId){
    if (!uid || !semId) return;

    const schedCol = collection(db, 'users', uid, 'semesters', semId, 'schedule');
    await deleteAllDocsInCollection(schedCol);
  }

  async function renderGrid() {
    const host = $('schedUSM');
    if (!host) return;
    if (!state.currentUser || !state.activeSemesterId) {
      renderNoActiveSemester();
      return;
    }

    let SLOTS = await getMySlots();
    CURRENT_SLOTS = SLOTS;

  const uni = getActiveUniCode();         
  const hasDefault = (uni === 'USM' || uni === 'UMAYOR');
  const key = `custom_slots_${uni}_${state.currentUser?.uid}`;

  const hasCustom = Array.isArray(CUSTOM_SLOTS_MAP[uni]) && CUSTOM_SLOTS_MAP[uni].length > 0;

    document.querySelectorAll('.schedule-controls').forEach(el => el.remove());

    if (!SLOTS) {
    renderNoScheduleCard(host);
    return;
  }
    const controls = document.createElement('div');
    controls.className = 'card schedule-controls';
    controls.style = 'padding:12px;text-align:center;margin-bottom:10px;';

    if (!hasDefault) {
      controls.innerHTML = `
    <button id="btnCreateCustomSched" class="btn violet" ${hasCustom ? 'disabled' : ''}>
      Crear horario personalizado
    </button>
    ${hasCustom ? `
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    ` : ''}

    <!-- ✅ NUEVO BOTÓN -->
    <button id="btnEditBlocksMode" class="btn ${EDIT_BLOCKS_MODE ? 'violet' : 'violet-outline'}">
      ${EDIT_BLOCKS_MODE ? '✅ Modo edición: ON' : 'Editar ramos y salas'}
    </button>
  `;
    } else {
      controls.innerHTML = `
    <button id="btnUseDefaultSched" class="btn blue" ${hasCustom ? '' : 'disabled'}>
      Usar horario por defecto
    </button>
    <button id="btnCreateCustomSched" class="btn violet" ${hasCustom ? 'disabled' : ''}>
      Crear horario personalizado
    </button>
    ${hasCustom ? `
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    ` : ''}
    <button id="btnEditBlocksMode" class="btn ${EDIT_BLOCKS_MODE ? 'violet' : 'violet-outline'}">
      ${EDIT_BLOCKS_MODE ? '✅ Modo edición: ON' : 'Editar ramos y salas'}
    </button>
  `;
    }
    host.before(controls);
    $('btnEditBlocksMode')?.addEventListener('click', () => {
    EDIT_BLOCKS_MODE = !EDIT_BLOCKS_MODE;
    renderGrid(); 
  });

    $('btnCreateCustomSched')?.addEventListener('click', () => {
      createCustomScheduleFlow(false);
    });

    $('btnUseDefaultSched')?.addEventListener('click', async () => {
      localStorage.removeItem(key);
      await deleteCustomScheduleFromFirestore(uni);
      alert('Se restauró el horario por defecto.');
      CURRENT_SLOTS = (uni === 'USM') ? USM_SLOTS : MAYOR_SLOTS;
      renderGrid();
    });

    $('btnEditCustomSched')?.addEventListener('click', async () => {
      const local = localStorage.getItem(key);
      let existing = null;
      if (local) {
        try { existing = JSON.parse(local); } catch (_) {}
      }
      if (!existing || existing.length === 0) {
        alert('No hay horario personalizado guardado para editar.');
        return;
      }
      if (!confirm('¿Deseas volver a generar este horario con diferentes bloques o tiempos?')) return;
      alert('Ahora puedes modificar el horario. Se reemplazará el anterior.');
      await createCustomScheduleFlow(true);
    });

  $('btnDeleteCustomSched')?.addEventListener('click', async () => {
    if (!await askYesNo({
      title: 'Borrar horario',
      text: '¿Seguro que deseas borrar tu horario personalizado?',
      yesText: 'Sí, borrar horario',
      noText: 'Cancelar'
    })) return;

    try{
      const uid = state.currentUser?.uid;
      const semId = state.activeSemesterId;

      if (!uid || !semId) {
        alert('No hay semestre activo.');
        return;
      }
      localStorage.removeItem(key);
      await deleteCustomScheduleFromFirestore(uni);
      delete CUSTOM_SLOTS_MAP[uni];
      CURRENT_SLOTS = [];
      await deleteSemesterScheduleOnly(uid, semId);
      items = [];
      SIM_ITEMS = [];
      partyScheduleCache.delete(cacheKey(uid, semId));
      document.dispatchEvent(new Event('courses:changed'));
      alert('Horario personalizado eliminado. Tus ramos siguen guardados.');
      await renderGrid();
    } catch (err){
      console.error(err);
      alert('No se pudo borrar el horario personalizado.');
    }
  });

    const isUSM = (uni === 'USM');
    const headerTitle = isUSM ? 'Bloque' : 'Módulo';

    host.innerHTML = `
      <div class="usm-grid2">
        <div class="cell header">${headerTitle}</div>
        ${DAYS.map(d=>`<div class="cell header">${d}</div>`).join('')}
        ${SLOTS.map((s,slotIndex)=>`
          <div class="cell mod ${s.lunch?'lunch':''}" data-slot="${slotIndex}">
            ${renderModuleCell(s, slotIndex, uni)}

          </div>
          ${DAYS.map((_,dayIndex)=>`
            <div class="cell slot ${s.lunch?'is-lunch':''}"
                data-day="${dayIndex}" data-slot="${slotIndex}"
                ${s.lunch?'aria-disabled="true"':''}>
              ${renderCellContent(dayIndex, slotIndex)}

            </div>
          `).join('')}
        `).join('')}
      </div>
    `;

    bindCellDropZones();
    host.querySelectorAll('.placed').forEach(el => {
      if (!el.querySelector('.block-del-btn')) {
        const btn = document.createElement('button');
        btn.className = 'block-del-btn';
        btn.textContent = '×';
        btn.dataset.id = el.dataset.id;
        el.appendChild(btn);
      }
    });
  }
  function ensureCourseQuickModal(){
    if (document.getElementById('cqModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'cqModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10060; padding:16px;
    `;

    wrap.innerHTML = `
      <div style="
        width:min(560px, 96vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
          <div>
            <div style="font-size:16px;font-weight:900;line-height:1.2;">Agregar ramo</div>
            <div style="font-size:13px;opacity:.8;margin-top:4px;">Completa los detalles (incluye asistencia).</div>
          </div>
          <button id="cqX" class="btn violet-outline" type="button" style="padding:8px 10px;border-radius:12px;">✕</button>
        </div>

        <div id="cqErr" style="
          display:none; margin:10px 0 12px;
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.30);
          padding:10px 12px; border-radius:12px; font-size:13px;
        "></div>

        <div style="display:grid; gap:12px;">
          <div>
            <label style="font-size:13px;opacity:.9;">Nombre</label>
            <input id="cqName" type="text" autocomplete="off"
              placeholder="Ej: Inglés 4"
              style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                    border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:13px;opacity:.9;">Código</label>
              <input id="cqCode" type="text" autocomplete="off"
                placeholder="Ej: IWI-123"
                style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
            </div>
            <div>
              <label style="font-size:13px;opacity:.9;">Color</label>
              <input id="cqColor" type="color"
                style="width:100%; height:42px; margin-top:6px; padding:6px 10px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <input id="cqAsis" type="checkbox" />
            <div style="font-size:13px; opacity:.9;">Este ramo usa asistencia</div>
          </div>

          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button id="cqCancel" class="btn violet-outline" type="button">Cancelar</button>
            <button id="cqSave" class="btn violet" type="button">Guardar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const close = () => { wrap.style.display = 'none'; };

    document.getElementById('cqX')?.addEventListener('click', close);
    document.getElementById('cqCancel')?.addEventListener('click', close);
    wrap.addEventListener('click', (e)=>{ if (e.target === wrap) close(); });
    document.addEventListener('keydown', (e)=>{ if (wrap.style.display==='flex' && e.key==='Escape') close(); });
  }


  async function openCourseQuickModal(semIdOverride = null, { forceFirestore = false } = {}){


    ensureCourseQuickModal();

  const targetSemId = semIdOverride || state.activeSemesterId;

  if (!state.currentUser || !targetSemId){
    alert('Necesitas seleccionar un semestre para agregar ramos.');
    return null;
  }


    const modal = document.getElementById('cqModal');
    const err   = document.getElementById('cqErr');

    const nameI = document.getElementById('cqName');
    const codeI = document.getElementById('cqCode');
    const colI  = document.getElementById('cqColor');
    const asI   = document.getElementById('cqAsis');

    const btnS  = document.getElementById('cqSave');
    const btnC  = document.getElementById('cqCancel');
    const btnX  = document.getElementById('cqX');

    err.style.display = 'none';
    err.textContent = '';
    nameI.value = '';
    codeI.value = '';
    colI.value  = '#3B82F6';
    asI.checked = false;

    modal.style.display = 'flex';
    setTimeout(()=> nameI.focus(), 0);

    const showError = (msg) => {
      err.textContent = msg;
      err.style.display = 'block';
    };

    return new Promise(resolve => {
      const cleanup = () => {
        btnS.removeEventListener('click', onSave);
        btnC.removeEventListener('click', onCancel);
        btnX.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
        modal.style.display = 'none';
      };

      const onCancel = () => { cleanup(); resolve(null); };

      const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
        if (e.key === 'Enter')  { e.preventDefault(); onSave(); }
      };

      const onSave = async () => {
    const name = (nameI.value || '').trim();
    if (!name) return showError('Ingresa el nombre del ramo.');

    const code = (codeI.value || '').trim();
    if (!code) return showError('Ingresa el código del ramo.'); 

    const data = {
      name,
      code,
      professor: '',
      section: '',
      color: (colI.value || '#3B82F6'),
      asistencia: !!asI.checked,
      createdAt: Date.now()
    };
      try {
  if (IN_SIM_MODAL && !forceFirestore) {
    const localId = `SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    SIM_COURSES = Array.isArray(SIM_COURSES) ? SIM_COURSES : [];
    SIM_COURSES.push({ id: localId, ...data });
    saveSimCourses(SIM_COURSES);     // ✅ persistir el pool del simulador
  markSimDirty();  
    SIM_DIRTY = true;
    renderSimPalette();
    await renderSimGrid();

    cleanup();
    resolve({ id: localId, ...data });
    return;
  }
  const docRef = await addDoc(
    collection(db,'users',state.currentUser.uid,'semesters',targetSemId,'courses'),
    data
  );
  const ref = collection(db,'users',state.currentUser.uid,'semesters',targetSemId,'courses');
  const snap = await getDocs(query(ref, orderBy('createdAt')));
  state.courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.dispatchEvent(new Event('courses:changed'));

  cleanup();
  resolve({ id: docRef.id, ...data });
    } catch (err) {
      console.error(err);
      showError('No se pudo guardar el ramo. Revisa consola.');
    }

  };
      btnS.addEventListener('click', onSave);
      btnC.addEventListener('click', onCancel);
      btnX.addEventListener('click', onCancel);
      document.addEventListener('keydown', onKey);
    });
  }
  function ensureYesNoModal(){
    if (document.getElementById('ynModal')) return;
    const wrap = document.createElement('div');
    wrap.id = 'ynModal';
    wrap.style.cssText = `
    position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.55); z-index:10150; padding:16px;
  `;

    wrap.innerHTML = `
      <div style="
        width:min(420px, 92vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div id="ynTitle" style="font-size:15px; font-weight:700; margin-bottom:10px;">Pregunta</div>
        <div id="ynText" style="font-size:14px; opacity:.9; margin-bottom:14px;"></div>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button id="ynNo"  class="btn violet-outline" type="button">No</button>
          <button id="ynYes" class="btn violet" type="button">Sí</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);
  }

  function ensureSimExitModal(){
    if (document.getElementById('simExitModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'simExitModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.55); z-index:10160; padding:16px;
    `;

    wrap.innerHTML = `
      <div style="
        width:min(460px, 92vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="font-size:15px; font-weight:900; margin-bottom:10px;">Guardar simulación</div>
        <div style="font-size:14px; opacity:.9; margin-bottom:14px;">
          ¿Quieres guardar esta simulación en tu horario real?
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
          <button id="simExitCancel" class="btn violet-outline" type="button">Cancelar</button>
          <button id="simExitNoSave" class="btn violet-outline" type="button">Salir sin guardar</button>
          <button id="simExitSave" class="btn violet" type="button">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);
  }

  function askSaveSimExit(){
    ensureSimExitModal();
    const modal = document.getElementById('simExitModal');
    const bSave = document.getElementById('simExitSave');
    const bNo   = document.getElementById('simExitNoSave');
    const bCan  = document.getElementById('simExitCancel');

    modal.style.display = 'flex';

    return new Promise(resolve => {
      const cleanup = () => {
        bSave.removeEventListener('click', onSave);
        bNo.removeEventListener('click', onNo);
        bCan.removeEventListener('click', onCancel);
        modal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKey);
        modal.style.display = 'none';
      };

      const onSave = () => { cleanup(); resolve('save'); };
      const onNo   = () => { cleanup(); resolve('discard'); };
      const onCancel = () => { cleanup(); resolve('cancel'); };

      const onBackdrop = (e) => {
        if (e.target === modal) onCancel();
      };

      const onKey = (e) => {
        if (e.key === 'Escape') onCancel();
        if (e.key === 'Enter') onSave();
      };

      bSave.addEventListener('click', onSave);
      bNo.addEventListener('click', onNo);
      bCan.addEventListener('click', onCancel);
      modal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
    });
  }


  function ensureBlockModal(){
    if (document.getElementById('blockModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'blockModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10002; padding:16px;
    `;

    wrap.innerHTML = `
      <div style="
        width:min(460px, 94vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px;">
          <div>
            <div id="bmTitle" style="font-size:16px; font-weight:900; line-height:1.2;">Detalles del ramo</div>
            <div id="bmSub" style="font-size:12.5px; opacity:.80; margin-top:4px;"></div>
          </div>
          <button id="bmX" class="btn violet-outline" type="button" style="padding:8px 10px; border-radius:12px;">✕</button>
        </div>

        <!-- Header chip -->
        <div style="
          display:flex; align-items:center; gap:10px;
          padding:10px 12px; border-radius:14px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.10);
          margin-bottom:12px;
        ">
          <div id="bmDot" style="width:14px;height:14px;border-radius:4px;background:#64748b;"></div>
          <div style="min-width:0;">
            <div id="bmCourse" style="font-weight:900; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            <div id="bmTime" style="font-size:12px; opacity:.75; margin-top:2px;"></div>
          </div>
        </div>

        <!-- ✅ VISTA DETALLES -->
        <div id="bmDetails" style="display:grid; gap:10px;">
          <div style="display:grid; gap:8px;">

            ${detailRowHtml('Nombre', 'bmNameOnly')}
            ${detailRowHtml('Código', 'bmCode')}
            ${detailRowHtml('Profesor', 'bmTeacher')}
            ${detailRowHtml('Paralelo / Sección', 'bmSection')}
            ${detailRowHtml('Sala', 'bmRoomView')}

          </div>
        </div>

        <!-- ✅ VISTA EDICIÓN -->
        <div id="bmEdit" style="display:none; gap:10px;">
          <div>
            <label style="font-size:13px; opacity:.9;">Nombre mostrado</label>
            <input id="bmName" type="text" autocomplete="off"
              placeholder="Ej: Inglés 4"
              style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
            <div class="muted" style="font-size:12px; opacity:.7; margin-top:4px;">
              Deja vacío para usar el nombre real del ramo.
            </div>
          </div>

          <div>
            <label style="font-size:13px; opacity:.9;">Sala</label>
            <input id="bmRoom" type="text" autocomplete="off"
              placeholder="Ej: A-203 / Lab 1 / Online"
              style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff; outline:none;" />
            <div class="muted" style="font-size:12px; opacity:.7; margin-top:4px;">
              Deja vacío para borrar la sala.
            </div>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px;">
          <button id="bmCancel" class="btn violet-outline" type="button">Cerrar</button>
          <button id="bmSave" class="btn violet" type="button">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    function detailRowHtml(label, id){
      return `
        <div style="
          display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
          padding:10px 12px; border-radius:14px;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.08);
        ">
          <div style="font-size:12.5px; opacity:.75;">${label}</div>
          <div id="${id}" style="font-size:13px; font-weight:800; text-align:right; max-width:62%; word-break:break-word;"></div>
        </div>
      `;
    }
  }


  function openBlockModal({
    mode='view',
    courseName,
    color,
    timeText,
    realName='',
    shownName='',
    code='',
    teacher='',
    section='',
    room=''
  }){
    ensureBlockModal();

    const modal = document.getElementById('blockModal');

    const title = document.getElementById('bmTitle');
    const sub   = document.getElementById('bmSub');
    const dot   = document.getElementById('bmDot');
    const course= document.getElementById('bmCourse');
    const time  = document.getElementById('bmTime');

    // details fields
    const dName   = document.getElementById('bmNameOnly');
    const dCode   = document.getElementById('bmCode');
    const dTeach  = document.getElementById('bmTeacher');
    const dSec    = document.getElementById('bmSection');
    const dRoom   = document.getElementById('bmRoomView');

    const detailsWrap = document.getElementById('bmDetails');
    const editWrap    = document.getElementById('bmEdit');

    // edit inputs
    const inName= document.getElementById('bmName');
    const inRoom= document.getElementById('bmRoom');

    const btnX  = document.getElementById('bmX');
    const btnC  = document.getElementById('bmCancel');
    const btnS  = document.getElementById('bmSave');

    const editable = (mode === 'edit');

    title.textContent = editable ? 'Editar ramo' : 'Detalles del ramo';
    sub.textContent   = editable
      ? 'Modifica nombre mostrado y/o sala'
      : 'Información del ramo (sin editar)';

    dot.style.background = isValidHex(color) ? color : '#64748b';
    course.textContent = courseName || 'Ramo';
    time.textContent   = timeText || '';

    // pintar detalles (siempre)
    const safe = (v) => (String(v || '').trim() || '—');
    dName.textContent = safe(realName);
    dCode.textContent  = safe(code);
    dTeach.textContent = safe(teacher);
    dSec.textContent   = safe(section);
    dRoom.textContent  = safe(room);

    // alternar vistas
    detailsWrap.style.display = editable ? 'none' : 'grid';
    editWrap.style.display    = editable ? 'grid' : 'none';

    // set inputs solo si edit
    inName.value = String(shownName || '').trim() && (shownName !== realName) ? String(shownName).trim() : '';
    inRoom.value = String(room || '').trim();

    btnS.style.display = editable ? 'inline-flex' : 'none';

    modal.style.display = 'flex';
    if (editable) setTimeout(()=>{ inName.focus(); inName.select(); }, 0);

    return new Promise(resolve => {
      const cleanup = () => {
        btnX.removeEventListener('click', onCancel);
        btnC.removeEventListener('click', onCancel);
        btnS.removeEventListener('click', onSave);
        modal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKey);
        modal.style.display = 'none';
      };

      const onCancel = () => { cleanup(); resolve(null); };
      const onBackdrop = (e) => { if (e.target === modal) onCancel(); };

      const onSave = () => {
        const nameVal = String(inName.value || '').trim();
        const roomVal = String(inRoom.value || '').trim();
        cleanup();
        resolve({ nameVal, roomVal });
      };

      const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
        if (editable && e.key === 'Enter') { e.preventDefault(); onSave(); }
      };

      btnX.addEventListener('click', onCancel);
      btnC.addEventListener('click', onCancel);
      btnS.addEventListener('click', onSave);
      modal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
    });
  }


  function bindBlockClick(){
    document.addEventListener('click', async (e) => {
      const placed = e.target.closest('.placed');
      if (!placed) return;
      const insideMySched = placed.closest('#schedUSM');
      if (!insideMySched) return;
      if (e.target.closest('.block-del-btn')) return;

      const id  = placed.dataset.id;
      const rec = items.find(x => x.id === id);
      if (!rec) return;

      const course = (state.courses || []).find(c => c.id === rec.courseId) || {};
  const realName = (course.name || 'Ramo').trim();

  const shownName =
    (rec.displayName && String(rec.displayName).trim())
      ? String(rec.displayName).trim()
      : realName;

  const room  = (rec.room && String(rec.room).trim()) ? String(rec.room).trim() : '';
  const color = getCourseColorById(state.courses, rec.courseId, myColor);
  const timeText = (rec.start && rec.end) ? `${rec.start}–${rec.end}` : '';

  // ✅ toma campos “extra” si existen en tu schema de course
  const code    = course.code || course.codigo || '';
  const teacher = course.teacher || course.professor || course.docente || '';
  const section = course.section || course.seccion || course.paralelo || '';

      // ✅ modo normal: solo ver
      if (!EDIT_BLOCKS_MODE){
    await openBlockModal({
      mode: 'view',
      courseName: shownName,
      color,
      timeText,
      realName,
      shownName,
      code,
      teacher,
      section,
      room
    });
    return;
  }
      const result = await openBlockModal({
    mode: 'edit',
    courseName: realName,
    color,
    timeText,
    realName,
    shownName,
    code,
    teacher,
    section,
    room
  });

      if (!result) return;

      if (!state.currentUser || !state.activeSemesterId) return;

      const { nameVal, roomVal } = result;

      try{
        const sRef = doc(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'schedule', rec.id);

        await updateDoc(sRef, {
          displayName: nameVal ? nameVal : null,
          room: roomVal ? roomVal : null,
          updatedAt: Date.now()
        });

        const idx = items.findIndex(x => x.id === rec.id);
        if (idx >= 0){
          items[idx].displayName = nameVal || null;
          items[idx].room = roomVal || null;
        }
        renderGrid();
      }catch(err){
        console.error(err);
        alert('No se pudo actualizar. Intenta nuevamente.');
      }
    });
  }
  function ensureRoomModal(){
    if (document.getElementById('roomModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'roomModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10001; padding:16px;
    `;

    wrap.innerHTML = `
      <div style="
        width:min(420px, 92vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px;">
          <div>
            <div id="rmTitle" style="font-size:16px; font-weight:900; line-height:1.2;">Editar sala</div>
            <div id="rmSub" style="font-size:12.5px; opacity:.80; margin-top:4px;"></div>
          </div>
          <button id="rmX" class="btn violet-outline" type="button"
            style="padding:8px 10px; border-radius:12px;">✕</button>
        </div>

        <div style="
          display:flex; align-items:center; gap:10px;
          padding:10px 12px; border-radius:14px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.10);
          margin-bottom:12px;
        ">
          <div id="rmDot" style="width:14px;height:14px;border-radius:4px;background:#64748b;"></div>
          <div style="min-width:0;">
            <div id="rmCourse" style="font-weight:900; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            <div id="rmHint" class="muted" style="font-size:12px; opacity:.75; margin-top:2px;">
              Deja vacío para borrar la sala.
            </div>
          </div>
        </div>

        <label style="font-size:13px; opacity:.9;">Sala</label>
        <input id="rmInput" type="text" autocomplete="off"
          placeholder="Ej: A-203 / Lab 1 / Online"
          style="
            width:100%;
            margin-top:6px;
            padding:10px 12px;
            border-radius:12px;
            border:1px solid rgba(255,255,255,.12);
            background:#0e1122;
            color:#fff;
            outline:none;
          " />

        <div id="rmErr" style="
          display:none; margin:10px 0 0;
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.30);
          padding:10px 12px; border-radius:12px; font-size:12.5px;
        "></div>

        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px;">
          <button id="rmCancel" class="btn violet-outline" type="button">Cancelar</button>
          <button id="rmSave" class="btn violet" type="button">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    document.addEventListener('keydown', (e)=>{
      const modal = document.getElementById('roomModal');
      if (modal?.style.display === 'flex' && e.key === 'Escape') {
        modal.style.display = 'none';
      }
    });
  }

  function ensureCustomScheduleModal(){
    if (document.getElementById('csModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'csModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10000; padding:16px;
    `;

    wrap.innerHTML = `
      <div style="
        width:min(560px, 96vw);
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
          <div>
            <div id="csTitle" style="font-size:16px;font-weight:800;line-height:1.2;">Crear horario personalizado</div>
            <div id="csSub" style="font-size:13px;opacity:.8;margin-top:4px;">
              Define cuántos bloques tienes y los tiempos base. Luego lo podrás ajustar bloque por bloque.
            </div>
          </div>
          <button id="csX" class="btn violet-outline" type="button" style="padding:8px 10px;border-radius:12px;">✕</button>
        </div>

        <div id="csErr" style="
          display:none; margin:10px 0 12px;
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.30);
          padding:10px 12px; border-radius:12px; font-size:13px;
        "></div>

        <div style="display:grid; gap:12px;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:13px;opacity:.9;">Bloques por día</label>
              <input id="csBlocks" type="number" min="1" step="1"
                style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
            </div>

            <div style="display:flex; flex-direction:column; justify-content:flex-end;">
              <label style="font-size:13px;opacity:.9;">¿Tienes almuerzo?</label>
              <div style="margin-top:6px; display:flex; gap:10px; align-items:center;">
                <input id="csHasLunch" type="checkbox" />
                <div style="font-size:13px;opacity:.85;">Activar bloque de almuerzo</div>
              </div>
            </div>
          </div>

          <div id="csLunchRow" style="display:none; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:13px;opacity:.9;">Inicio almuerzo</label>
              <input id="csLunchStart" type="time"
                style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
            </div>
            <div>
              <label style="font-size:13px;opacity:.9;">Fin almuerzo</label>
              <input id="csLunchEnd" type="time"
                style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
            </div>
          </div>

          <div style="padding:12px; border-radius:14px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.04);">
            <div style="font-size:13px; font-weight:700; margin-bottom:10px;">Bloques base</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div>
                <label style="font-size:13px;opacity:.9;">Bloque 1: inicio</label>
                <input id="csS1" type="time" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
              </div>
              <div>
                <label style="font-size:13px;opacity:.9;">Bloque 1: fin</label>
                <input id="csE1" type="time" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
              </div>
              <div>
                <label style="font-size:13px;opacity:.9;">Bloque 2: inicio</label>
                <input id="csS2" type="time" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
              </div>
              <div>
                <label style="font-size:13px;opacity:.9;">Bloque 2: fin</label>
                <input id="csE2" type="time" style="width:100%; margin-top:6px; padding:10px 12px; border-radius:12px;
                      border:1px solid rgba(255,255,255,.12); background:#0e1122; color:#fff;" />
              </div>
            </div>

            <div style="margin-top:10px; font-size:12.5px; opacity:.75;">
              Con estos 2 bloques calculamos duración y “pausa” automática para completar el día.
            </div>
          </div>

          <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:2px;">
            <button id="csCancel" class="btn violet-outline" type="button">Cancelar</button>
            <button id="csOk" class="btn violet" type="button">Crear</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);
    const modal = wrap;
    const hasLunch = document.getElementById('csHasLunch');
    const lunchRow = document.getElementById('csLunchRow');

    hasLunch.addEventListener('change', () => {
      lunchRow.style.display = hasLunch.checked ? 'grid' : 'none';
    });

  }

  function openCustomScheduleModal({ editMode=false, titleOverride=null, okTextOverride=null, subOverride=null } = {}){
    ensureCustomScheduleModal();
    const modal = document.getElementById('csModal');
    const title = document.getElementById('csTitle');
    const sub   = document.getElementById('csSub');
    const err   = document.getElementById('csErr');
    const blocks = document.getElementById('csBlocks');
    const hasLunch = document.getElementById('csHasLunch');
    const lunchRow = document.getElementById('csLunchRow');
    const lunchStart = document.getElementById('csLunchStart');
    const lunchEnd   = document.getElementById('csLunchEnd');
    const s1 = document.getElementById('csS1');
    const e1 = document.getElementById('csE1');
    const s2 = document.getElementById('csS2');
    const e2 = document.getElementById('csE2');
    const btnOk = document.getElementById('csOk');
    const btnCancel = document.getElementById('csCancel');
    const btnX = document.getElementById('csX'); 
    title.textContent = titleOverride ?? (editMode ? 'Editar horario personalizado' : 'Crear horario personalizado');
    sub.textContent = subOverride ?? (editMode
      ? 'Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.'
      : 'Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click.'
    );
    err.style.display = 'none';
    err.textContent = '';
    blocks.value = '';
    hasLunch.checked = false;
    lunchRow.style.display = 'none';
    lunchStart.value = '13:40';
    lunchEnd.value   = '14:40';
    s1.value = '08:15';
    e1.value = '09:25';
    s2.value = '09:40';
    e2.value = '10:50';
    btnOk.textContent = okTextOverride ?? (editMode ? 'Guardar' : 'Crear');
    modal.style.display = 'flex';
    const showError = (msg) => {
      err.textContent = msg;
      err.style.display = 'block';
    };
    return new Promise(resolve => {
      const onBackdrop = (e) => { if (e.target === modal) onCancel(); };
      const onKey = (e) => { if (e.key === 'Enter') onOk(); if (e.key === 'Escape') onCancel(); };
      const cleanup = () => {
        btnOk.removeEventListener('click', onOk);
        btnCancel.removeEventListener('click', onCancel);
        btnX?.removeEventListener('click', onCancel);
        modal.removeEventListener('click', onBackdrop);
        modal.removeEventListener('keydown', onKey);
      };
      const onCancel = () => {
        cleanup();
        modal.style.display = 'none';
        resolve(null);
      };
      const onOk = () => {
        const n = parseInt(blocks.value, 10);
        if (!n || n <= 0) return showError('Ingresa un número válido de bloques por día.');
        const start1 = s1.value, end1 = e1.value, start2 = s2.value, end2 = e2.value;
        if (!start1 || !end1 || !start2 || !end2) return showError('Completa los horarios de los bloques base.');
        const hasL = !!hasLunch.checked;
        const lS = lunchStart.value;
        const lE = lunchEnd.value;
        if (hasL && (!lS || !lE)) return showError('Completa inicio y fin de almuerzo.');
        cleanup();
        modal.style.display = 'none';
        resolve({
          n,
          hasLunch: hasL,
          lunchStart: hasL ? lS : null,
          lunchEnd:   hasL ? lE : null,
          start1, end1, start2, end2
        });
      };
      btnOk.addEventListener('click', onOk);
      btnCancel.addEventListener('click', onCancel);
      btnX?.addEventListener('click', onCancel);     
      modal.addEventListener('click', onBackdrop);
      modal.addEventListener('keydown', onKey);    
    });
  }
  function getSimStorageKey(){
    return `dp_sim_items_${partyUni || 'UNI'}_${SIM_TERM || 'TERM'}`;
  }
  function simSnapshot(items){
    try{
      const norm = (items || []).map(it => ({
        courseId: it.courseId,
        pid: it.pid,
        day: it.day,
        slot: it.slot,
        pos: it.pos || 'full'
      })).sort((a,b)=>
        (a.courseId||'').localeCompare(b.courseId||'') ||
        (a.pid||'').localeCompare(b.pid||'') ||
        (a.day-b.day) ||
        (a.slot-b.slot) ||
        (a.pos||'').localeCompare(b.pos||'')
      );
      return JSON.stringify(norm);
    } catch { return ''; }
  }
  function markSimDirty(){
    SIM_DIRTY = isSimDirty(); 
  }

  function syncSimSaved(){
    SIM_SAVED_FULL = takeSimSnapshot();
    SIM_DIRTY = false;
  }
  function saveSimItems(){
    try{ localStorage.setItem(getSimStorageKey(), JSON.stringify(SIM_ITEMS || [])); } catch {}
    SIM_SAVED_SNAPSHOT = simSnapshot(SIM_ITEMS);
    SIM_DIRTY = false;
  }
  function loadSimItems(){
    try{
      const raw = localStorage.getItem(getSimStorageKey());
      const arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    }catch{
      return [];
    }
  }
  function simSlotsKey(){
    return `dp_sim_slots_${state.currentUser?.uid || 'anon'}_${state.activeSemesterId || 'noSem'}`;
  }
  function simDefsKey(){
    return `dp_sim_parallel_defs_${state.currentUser?.uid || 'anon'}_${state.activeSemesterId || 'noSem'}`;
  }
  function simSelectedKey(){
    return `dp_sim_selected_parallel_${state.currentUser?.uid || 'anon'}_${state.activeSemesterId || 'noSem'}`;
  }
  function loadSimSlots(){
    try{
      const raw = localStorage.getItem(simSlotsKey());
      const arr = JSON.parse(raw || 'null');
      return Array.isArray(arr) ? arr : null;
    }catch{ return null; }
  }
  function saveSimSlots(slots){
    try{ localStorage.setItem(simSlotsKey(), JSON.stringify(slots || null)); }catch{}
  }
  function loadSimParallelDefs(){
    try{
      const raw = localStorage.getItem(simDefsKey());
      const obj = JSON.parse(raw || '{}');
      const m = new Map();
      for (const cid of Object.keys(obj || {})){
        m.set(cid, Array.isArray(obj[cid]) ? obj[cid] : []);
      }
      return m;
    }catch{ return new Map(); }
  }
  function saveSimParallelDefs(){
    try{
      const obj = {};
      for (const [cid, defs] of (SIM_PARALLEL_DEFS || new Map()).entries()){
        obj[cid] = defs || [];
      }
      localStorage.setItem(simDefsKey(), JSON.stringify(obj));
    }catch{}
  }
  function loadSimSelectedParallels(){
    try{
      const raw = localStorage.getItem(simSelectedKey());
      const obj = JSON.parse(raw || '{}');
      const m = new Map();
      for (const cid of Object.keys(obj || {})){
        if (obj[cid]) m.set(cid, obj[cid]);
      }
      return m;
    }catch{ return new Map(); }
  }
  function saveSimSelectedParallels(){
    try{
      const obj = {};
      for (const [cid, pid] of (SELECTED_PARALLEL || new Map()).entries()){
        obj[cid] = pid;
      }
      localStorage.setItem(simSelectedKey(), JSON.stringify(obj));
    }catch{}
  }
  function restoreSimFromSnapshot(snapshotStr, { persist=false } = {}){
    if (!snapshotStr) return;
    try{
      const s = JSON.parse(snapshotStr);
      SIM_SLOTS   = s.slots || null;
      SIM_ITEMS   = Array.isArray(s.items) ? s.items : [];
      SIM_COURSES = Array.isArray(s.courses) ? s.courses : [];
      SIM_PARALLEL_DEFS.clear?.();
      for (const cid of Object.keys(s.defs || {})){
        SIM_PARALLEL_DEFS.set(cid, Array.isArray(s.defs[cid]) ? s.defs[cid] : []);
      }
      SELECTED_PARALLEL.clear?.();
      for (const cid of Object.keys(s.selected || {})){
        if (s.selected[cid]) SELECTED_PARALLEL.set(cid, s.selected[cid]);
      }
      SIM_SAVED_SNAPSHOT = simSnapshot(SIM_ITEMS);
      SIM_DIRTY = false;
      if (persist){
        saveSimSlots(SIM_SLOTS);
        markSimDirty();
        saveSimCourses(SIM_COURSES);
        saveSimItems();              // usa SIM_ITEMS
        saveSimParallelDefs();
        saveSimSelectedParallels();
      }
    }catch(e){
      console.warn('restoreSimFromSnapshot failed', e);
    }
  }
  async function persistSimAll(){
    SIM_OPEN_SNAPSHOT = takeSimSnapshot();
    syncSimSaved();
  }
  function askSaveDiscardCancel({
    title='Salir del simulador',
    message='¿Quieres guardar antes de salir?',
    saveText='Guardar y salir',
    discardText='Salir sin guardar',
    cancelText='Cancelar',
  } = {}){
    return new Promise((resolve)=>{
      const old = document.getElementById('triConfirm');
      if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'triConfirm';
      overlay.style.cssText = `
        position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.55); padding:16px;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      `;
      overlay.innerHTML = `
        <div style="
          width:min(520px, 96vw);
          background:#121527;
          border:1px solid rgba(255,255,255,.10);
          border-radius:18px;
          padding:16px;
          box-shadow:0 18px 60px rgba(0,0,0,.45);
          color:#fff;
        ">
          <div style="font-weight:900; font-size:16px;">${escapeHtml(title)}</div>
          <div style="opacity:.8; margin-top:8px; font-size:13.5px;">${escapeHtml(message)}</div>

          <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:16px; flex-wrap:wrap;">
            <button id="triCancel" class="btn violet-outline" type="button">${escapeHtml(cancelText)}</button>
            <button id="triDiscard" class="btn violet-outline" type="button">${escapeHtml(discardText)}</button>
            <button id="triSave" class="btn violet" type="button">${escapeHtml(saveText)}</button>
          </div>
        </div>
      `;
      const done = (val)=>{
        overlay.remove();
        resolve(val); // 'save' | 'discard' | 'cancel'
      };
      overlay.addEventListener('click', (e)=>{ if (e.target === overlay) done('cancel'); });
      overlay.querySelector('#triCancel').addEventListener('click', ()=>done('cancel'));
      overlay.querySelector('#triDiscard').addEventListener('click', ()=>done('discard'));
      overlay.querySelector('#triSave').addEventListener('click', ()=>done('save'));

      document.body.appendChild(overlay);
    });
  }
  function askYesNo({ title='Confirmar', text='', yesText='Sí', noText='No' } = {}){
    ensureYesNoModal();
    const modal = document.getElementById('ynModal');
    const t = document.getElementById('ynTitle');
    const p = document.getElementById('ynText');
    const bYes = document.getElementById('ynYes');
    const bNo  = document.getElementById('ynNo');
    t.textContent = title;
    p.textContent = text;
    bYes.textContent = yesText;
    bNo.textContent = noText;
    modal.style.display = 'flex';
    return new Promise(resolve => {
      const cleanup = () => {
        bYes.removeEventListener('click', onYes);
        bNo.removeEventListener('click', onNo);
        modal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKey);
        modal.style.display = 'none';
      };

      const onYes = () => { cleanup(); resolve(true); };
      const onNo  = () => { cleanup(); resolve(false); };

      const onBackdrop = (e) => {
        if (e.target === modal) { cleanup(); resolve(false); }
      };

      const onKey = (e) => {
        if (e.key === 'Escape') { cleanup(); resolve(false); }
        if (e.key === 'Enter')  { cleanup(); resolve(true); }
      };

      bYes.addEventListener('click', onYes);
      bNo.addEventListener('click', onNo);
      modal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
    });
  }
  async function createCustomScheduleFlow(editMode = false) {
    const uni = getActiveUniCode() || 'UNI_desconocida';

    const data = await openCustomScheduleModal({ editMode });
    if (!data) return; // cancelado
    const { n, hasLunch, lunchStart, lunchEnd, start1, end1, start2, end2 } = data;
    let lunchS = null, lunchE = null;
    if (hasLunch) {
      lunchS = toMinutes(lunchStart);
      lunchE = toMinutes(lunchEnd);
      if (isNaN(lunchS) || isNaN(lunchE) || lunchE <= lunchS) {
        return alert('Horas de almuerzo inválidas.');
      }
    }
    const t1 = toMinutes(start1);
    const blockDuration = toMinutes(end1) - toMinutes(start1);
    const gapDuration   = toMinutes(start2) - toMinutes(end1);
    if (isNaN(t1) || blockDuration <= 0) return alert('Horas inválidas en bloques.');
    if (gapDuration < 0) return alert('La pausa entre bloque 1 y 2 no puede ser negativa.');
    const blocks = [];
    let currentStart = t1;
    let lunchInserted = false;
    let placed = 0;

    while (placed < n) {
      if (hasLunch && !lunchInserted && currentStart >= lunchS && currentStart < lunchE) {
        blocks.push({ label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true });
        lunchInserted = true;
        currentStart = lunchE;
        continue;
      }

      const startMin = currentStart;
      const endMin = startMin + blockDuration;

      if (hasLunch && !lunchInserted && startMin < lunchS && endMin > lunchS) {
        blocks.push({ label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true });
        lunchInserted = true;
        currentStart = lunchE;
        continue;
      }

      const labelNum = placed + 1;
      const startHHMM = toHHMM(startMin);
      const endHHMM = toHHMM(endMin);

      blocks.push({
        label: String(labelNum),
        start: startHHMM,
        end: endHHMM,
        lines: [{ n: String(labelNum), start: startHHMM, end: endHHMM }]
      });

      placed++;
      currentStart = endMin + gapDuration;
    }

    if (hasLunch && !lunchInserted) {
      const lunchObj = { label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true };

      let idx = blocks.findIndex(b => !b.lunch && toMinutes(b.start) >= lunchS);
      if (idx === -1) idx = blocks.length;
      blocks.splice(idx, 0, lunchObj);

      for (let i = idx + 1; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.lunch) continue;
        const bs = toMinutes(b.start);
        const be = toMinutes(b.end);
        if (bs < lunchE) {
          const shift = (lunchE - bs);
          const newS = bs + shift;
          const newE = be + shift;
          b.start = toHHMM(newS);
          b.end = toHHMM(newE);
          b.lines = [{ n: b.label, start: b.start, end: b.end }];
        }
      }
    }

    CUSTOM_SLOTS_MAP[uni] = blocks;
    localStorage.setItem(`custom_slots_${uni}_${state.currentUser.uid}`, JSON.stringify(blocks));
    await saveCustomScheduleToFirestore(uni, blocks);

    alert(editMode ? 'Horario personalizado actualizado.' : 'Horario personalizado creado exitosamente.');
    renderGrid();
  }
  async function createSimSlotsFlow(){
    const data = await openCustomScheduleModal({
      editMode: true, // solo para que el botón diga "Guardar" si quieres
      titleOverride: 'Editar horario personalizado',
      okTextOverride: 'Guardar',
      subOverride: 'Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click.'
    });
    if (!data) return null;
    const { n, hasLunch, lunchStart, lunchEnd, start1, end1, start2, end2 } = data;
    let lunchS = null, lunchE = null;
    if (hasLunch) {
      lunchS = toMinutes(lunchStart);
      lunchE = toMinutes(lunchEnd);
      if (isNaN(lunchS) || isNaN(lunchE) || lunchE <= lunchS) {
        alert('Horas de almuerzo inválidas.');
        return null;
      }
    }
    const t1 = toMinutes(start1);
    const blockDuration = toMinutes(end1) - toMinutes(start1);
    const gapDuration   = toMinutes(start2) - toMinutes(end1);
    if (isNaN(t1) || blockDuration <= 0) { alert('Horas inválidas en bloques.'); return null; }
    if (gapDuration < 0) { alert('La pausa entre bloque 1 y 2 no puede ser negativa.'); return null; }
    const blocks = [];
    let currentStart = t1;
    let lunchInserted = false;
    let placed = 0;
    while (placed < n) {
      if (hasLunch && !lunchInserted && currentStart >= lunchS && currentStart < lunchE) {
        blocks.push({ label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true });
        lunchInserted = true;
        currentStart = lunchE;
        continue;
      }
      const startMin = currentStart;
      const endMin = startMin + blockDuration;
      if (hasLunch && !lunchInserted && startMin < lunchS && endMin > lunchS) {
        blocks.push({ label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true });
        lunchInserted = true;
        currentStart = lunchE;
        continue;
      }
      const labelNum = placed + 1;
      const startHHMM = toHHMM(startMin);
      const endHHMM = toHHMM(endMin);

      blocks.push({
        label: String(labelNum),
        start: startHHMM,
        end: endHHMM,
        lines: [{ n: String(labelNum), start: startHHMM, end: endHHMM }]
      });

      placed++;
      currentStart = endMin + gapDuration;
    }
    if (hasLunch && !lunchInserted) {
      const lunchObj = { label:'ALMUERZO', start:lunchStart, end:lunchEnd, lunch:true };

      let idx = blocks.findIndex(b => !b.lunch && toMinutes(b.start) >= lunchS);
      if (idx === -1) idx = blocks.length;
      blocks.splice(idx, 0, lunchObj);
      for (let i = idx + 1; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.lunch) continue;
        const bs = toMinutes(b.start);
        const be = toMinutes(b.end);
        if (bs < lunchE) {
          const shift = (lunchE - bs);
          const newS = bs + shift;
          const newE = be + shift;
          b.start = toHHMM(newS);
          b.end = toHHMM(newE);
          b.lines = [{ n: b.label, start: b.start, end: b.end }];
        }
      }
    }

    return blocks;
  }
  function toHHMM(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  function cacheKey(uid, semId){ return `${uid}:${semId}`; }
  function applyPartyCache(uid, semId){
    const key = cacheKey(uid, semId);
    const c = partyScheduleCache.get(key);
    if (!c) return false;
    partyItems = c.items || [];
    partyCourses = c.courses || [];
    partySlots = c.slots || USM_SLOTS;
    partyUni = c.uni || 'USM';
    buildPartyGrid();
    return true;
  }


  function renderModuleCell(s, slotIndex, uni) {
    if (s.lunch) {
      return `
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${s.start}–${s.end}</div>
      `;
    }
    const slots = (SHARED_CURRENT_SLOTS.length ? SHARED_CURRENT_SLOTS : CURRENT_SLOTS);
    if ((uni !== 'USM' && uni !== 'UMAYOR') || !s.label.includes('/')) {

      return `
        <div class="mod-lines">
          <div class="line-num">${s.label}</div>
          <div class="line-time">${s.start}–${s.end}</div>
        </div>
      `;
    }

    if (uni === 'USM') {
  const realIndex = slots
    .slice(0, slotIndex + 1)
    .filter(x => !x.lunch).length - 1;

  const n1 = realIndex * 2 + 1;
  const n2 = n1 + 1;

  return `
    <div class="mod-lines">
      <div class="line-num">${n1}</div>
      <div class="line-time">${s.lines[0].start}–${s.lines[0].end}</div>
      <div class="line-num">${n2}</div>
      <div class="line-time">${s.lines[1].start}–${s.lines[1].end}</div>
    </div>
  `;
}
    const realIndex = slots
  .slice(0, slotIndex + 1)
  .filter(x => !x.lunch).length;

return `
  <div class="mod-lines">
    <div class="line-num">${realIndex}</div>
    <div class="line-time">${s.start}–${s.end}</div>
  </div>
`;
  }
  document.addEventListener('click', (e) => {
    const mod = e.target.closest('.mod-lines');
    if (!mod) return;

    const uni = getActiveUniCode();
    if (!CUSTOM_SLOTS_MAP[uni]) return;

    const mods = Array.from(mod.parentNode.parentNode.querySelectorAll('.mod'));
    const index = mods.indexOf(mod.parentNode);
    if (index < 0) return;
    const blocks = CUSTOM_SLOTS_MAP[uni];
    const b = blocks[index];
    const prevEnd   = toMinutes(b.end);
    const newStart = prompt(`Inicio de ${b.label}`, b.start);
    const newEnd   = prompt(`Fin de ${b.label}`, b.end);
    if (!newStart || !newEnd) return;
    const sMin = toMinutes(newStart);
    const eMin = toMinutes(newEnd);
    if (isNaN(sMin) || isNaN(eMin) || eMin <= sMin) {
      alert('Horas inválidas.');
      return;
    }
    b.start = toHHMM(sMin);
    b.end = toHHMM(eMin);
    b.lines = [
      { n: b.label.split('/')[0], start: toHHMM(sMin), end: toHHMM(eMin) }
    ];
    const dur = eMin - sMin;
    if (index < blocks.length - 1) {
      const oldGap = toMinutes(blocks[index + 1].start) - prevEnd;

      let nextStart = eMin + oldGap;
      for (let i = index + 1; i < blocks.length; i++) {
        const curr = blocks[i];
        const labelNum = i + 1;
        curr.start = toHHMM(nextStart);
        curr.end = toHHMM(nextStart + dur);
        curr.lines = [
          { n: String(labelNum), start: curr.start, end: toHHMM(nextStart + dur / 2) },
          { n: String(labelNum + 1), start: toHHMM(nextStart + dur / 2), end: curr.end }
        ];
        nextStart = toMinutes(curr.end) + oldGap; 
      }
    }
    localStorage.setItem(`custom_slots_${uni}_${state.currentUser.uid}`, JSON.stringify(blocks));
    CUSTOM_SLOTS_MAP[uni] = blocks;
    renderGrid();
  });
  function renderCellContent(day, slot){
    const here = items.filter(it => it.day===day && it.slot===slot);
    if (!here.length) return '';
    return renderCellContentFromArray(here, false);
  }
  function renderCellContentFromArray(here, isSim){
    const packed = packLanesByVertical(here);
    return packed.blocks.map(b => {
      return blockHtmlPacked(b, packed.laneCount, isSim);
    }).join('');
  }
  function blockHtmlPacked(it, laneCount, isSim){
  const courseArr = isSim
    ? (Array.isArray(SIM_COURSES) ? SIM_COURSES : [])
    : (state.courses || []);

  const course = courseArr.find(c => c.id === it.courseId);
  const courseName = course?.name || 'Ramo';

  const shown = (typeof it.displayName === 'string' && it.displayName.trim())
    ? it.displayName.trim()
    : courseName;

  const room = (typeof it.room === 'string' && it.room.trim())
    ? it.room.trim()
    : '';

  const color = getCourseColorById(courseArr, it.courseId, myColor);
  const text  = bestText(color);

  const h = it.hpos || 'single';

  let left = 0;
  let width = 100;

  if (h === 'left') {
    left = 0;
    width = 50;
  } else if (h === 'right') {
    left = 50;
    width = 50;
  }

  const v = it.pos || 'full';

  let top = 0;
  let height = 100;

  if (v === 'top') {
    top = 0;
    height = 50;
  } else if (v === 'bottom') {
    top = 50;
    height = 50;
  }

  const title = `${shown}${room ? ` · Sala: ${room}` : ''}`;

  const dragAttrs = isSim
    ? `draggable="true"
       data-sim-course="${escapeHtml(it.courseId || '')}"
       data-sim-pid="${escapeHtml(it.pid || it.parallelPid || '')}"
       data-sim-day="${Number(it.day)}"
       data-sim-slot="${Number(it.slot)}"
       data-sim-pos="${escapeHtml(it.pos || 'full')}"
       data-sim-hpos="${escapeHtml(it.hpos || 'single')}"`
    : `data-id="${escapeHtml(it.id || '')}" draggable="true"`;

  return `
    <div class="placed pos-${it.pos || 'full'} h-${h}"
        ${dragAttrs}
        title="${escapeHtml(title)}"
        style="
          background:${color};
          border:1px solid rgba(0,0,0,0.25);
          left:${left}%;
          width:${width}%;
          top:${top}%;
          height:${height}%;
        ">
        <div class="placed-title" style="color:${text}; font-weight:700; line-height:1.05;">
          ${escapeHtml(shown)}
        </div>
        ${room ? `
          <div class="placed-room" style="color:${text}; opacity:.9; font-weight:700; font-size:11px; margin-top:2px; line-height:1.05;">
            ${escapeHtml(room)}
          </div>
        ` : ``}
      </div>
  `;
}

  function bindDnD(){
    window.addEventListener('dragover', handleGlobalDragOver, { passive: true });
    document.addEventListener('drop', stopGlobalAutoScroll);
    document.addEventListener('dragend', stopGlobalAutoScroll);

    document.addEventListener('dragstart', (e) => {
      const rect = e.target.closest?.('.palette-rect');
      if (rect){
        const payload = rect.dataset.payload;
        if (payload){
          e.dataTransfer.setData('text/plain', payload);
          e.dataTransfer.effectAllowed = 'copy';
          isDraggingChip = true;
          return;
        }
      }

      const chip = e.target.closest?.('.palette-chip');
      if (chip){
        e.dataTransfer.setData('text/plain', chip.dataset.courseId);
        e.dataTransfer.effectAllowed = 'copy';
        isDraggingChip = true;
      }
    });

    document.addEventListener('dragstart', (e) => {
      const blk = e.target.closest?.('.placed');
      if (!blk) return;

      if (blk.closest('#simModal')) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
          type: 'move-sim-block',
          courseId: blk.dataset.simCourse || '',
          pid: blk.dataset.simPid || null,
          from: {
            day: Number(blk.dataset.simDay),
            slot: Number(blk.dataset.simSlot),
            pos: blk.dataset.simPos || 'full',
            hpos: blk.dataset.simHpos || 'single'
          }
        }));
        e.dataTransfer.effectAllowed = 'move';
        isDraggingChip = true;
        return;
      }

      e.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'move-block',
        id: blk.dataset.id
      }));
      e.dataTransfer.effectAllowed = 'move';
      isDraggingChip = false;
    });

    bindCellDropZones();
  }
  function simCoursesKey(){
    return `sim_courses_${state.currentUser?.uid || 'anon'}_${state.activeSemesterId || 'noSem'}`;
  }
  function loadSimCourses(){
    try {
      const raw = localStorage.getItem(simCoursesKey());
      const arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function saveSimCourses(list){
    try { localStorage.setItem(simCoursesKey(), JSON.stringify(list || [])); } catch {}
  }
  function bindCellDropZones() {
    document.querySelectorAll('.cell.slot').forEach(cell => {
      if (cell.classList.contains('is-lunch')) return;
      const isSimCell = !!IN_SIM_MODAL;
      cell.addEventListener('dragover', ev => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect =
          ev.dataTransfer.effectAllowed === 'move' ? 'move' : 'copy';
        const rect = cell.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const mid = rect.height / 2;
        let vpos = 'full';
        if (y < mid - 10) vpos = 'top';
        else if (y > mid + 10) vpos = 'bottom';
        let hpos = 'single';
        const ratioX = x / rect.width;
        if (ratioX < 0.4) hpos = 'left';
        else if (ratioX > 0.6) hpos = 'right';

        cell.dataset.droppos = vpos;
        cell.dataset.droph = hpos;
        cell.classList.add('over');
        cell.classList.remove(
          'hint-top',
          'hint-full',
          'hint-bottom',
          'hint-left',
          'hint-center',
          'hint-right'
        );
        if (vpos === 'top') cell.classList.add('hint-top');
        if (vpos === 'full') cell.classList.add('hint-full');
        if (vpos === 'bottom') cell.classList.add('hint-bottom');

        if (hpos === 'left') cell.classList.add('hint-left');
        if (hpos === 'single') cell.classList.add('hint-center');
        if (hpos === 'right') cell.classList.add('hint-right');
      });
      cell.addEventListener('dragleave', () => clearHints(cell));
      
      cell.addEventListener('drop', async ev => {
  ev.preventDefault();

  const isSimCell = !!cell.closest('#simModal');
  const raw = ev.dataTransfer.getData('text/plain');
  if (!raw) {
    clearHints(cell);
    return;
  }

  const day = parseInt(cell.dataset.day, 10);
  const slot = parseInt(cell.dataset.slot, 10);
  const pos = cell.dataset.droppos || 'full';
  const hpos = cell.dataset.droph || 'single';

  let moveData = null;
  try { moveData = JSON.parse(raw); } catch (_) {}

  const sameBand = (arr) => arr.filter(x =>
    x.day === day &&
    x.slot === slot &&
    (x.pos || 'full') === pos
  );

  const sameExact = (arr) => arr.filter(x =>
    x.day === day &&
    x.slot === slot &&
    (x.pos || 'full') === pos &&
    (x.hpos || 'single') === hpos
  );

  // =========================
  // 1) DRAG DE PARALELO
  // =========================
  if (moveData && moveData.type === 'course-parallel'){
    const courseId = moveData.courseId;
    const pid = moveData.pid || null;

    if (isSimCell) {
      const defSlot = (SIM_SLOTS || CURRENT_SLOTS || [])[slot];
      if (!defSlot) {
        clearHints(cell);
        return;
      }

      const others = (SIM_ITEMS || []).filter(x => x.courseId !== courseId);
      const band = sameBand(others);
      const exact = sameExact(others);

      if (exact.length) {
        alert('Ese espacio exacto ya está ocupado.');
        clearHints(cell);
        return;
      }

      if (band.length >= 2) {
        alert('Esa franja ya tiene izquierda y derecha ocupadas.');
        clearHints(cell);
        return;
      }

      SIM_ITEMS = (SIM_ITEMS || []).filter(x => x.courseId !== courseId);

      const course =
        (SIM_COURSES || []).find(x => x.id === courseId) ||
        (state.courses || []).find(x => x.id === courseId) || {};

      const baseName = (course.name || 'Ramo').trim();
      const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
      const def = pid ? defs.find(d => d.pid === pid) : null;
      const shownSec = def?.section || def?.pid || null;
      const displayName = shownSec ? `${baseName} · ${shownSec}` : baseName;

      SIM_ITEMS.push({
        courseId,
        day,
        slot,
        start: defSlot.start,
        end: defSlot.end,
        pos,
        hpos,
        pid,
        displayName
      });

      markSimDirty();
      await renderSimGrid();
      clearHints(cell);
      return;
    }

    if (!state.currentUser || !state.activeSemesterId) {
      alert('Selecciona un semestre.');
      clearHints(cell);
      return;
    }

    const defSlot = (CURRENT_SLOTS || [])[slot];
    if (!defSlot) {
      clearHints(cell);
      return;
    }

    const band = sameBand(items || []);
    const exact = sameExact(items || []);

    if (exact.length) {
      alert('Ese espacio exacto ya está ocupado.');
      clearHints(cell);
      return;
    }

    if (band.length >= 2) {
      alert('Esa franja ya tiene izquierda y derecha ocupadas.');
      clearHints(cell);
      return;
    }

    const course = (state.courses || []).find(x => x.id === courseId) || {};
    const baseName = (course.name || 'Ramo').trim();
    const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
    const def = pid ? defs.find(d => d.pid === pid) : null;
    const shownSec = def?.section || def?.pid || null;
    const displayName = shownSec ? `${baseName} · ${shownSec}` : null;

    await addDoc(
      collection(db,'users',state.currentUser.uid,'semesters',state.activeSemesterId,'schedule'),
      {
        courseId,
        day,
        slot,
        start: defSlot.start,
        end: defSlot.end,
        pos,
        hpos,
        parallelPid: pid || null,
        displayName,
        createdAt: Date.now()
      }
    );

    if (pid) SELECTED_PARALLEL.set(courseId, pid);

    clearHints(cell);
    return;
  }

  // =========================
  // 2) MOVER BLOQUE DEL SIMULADOR
  // =========================
  if (moveData && moveData.type === 'move-sim-block' && isSimCell){
    const from = moveData.from || {};

    const movingIndex = (SIM_ITEMS || []).findIndex(x =>
      x.courseId === moveData.courseId &&
      Number(x.day) === Number(from.day) &&
      Number(x.slot) === Number(from.slot) &&
      (x.pos || 'full') === (from.pos || 'full') &&
      (x.hpos || 'single') === (from.hpos || 'single')
    );

    if (movingIndex < 0) {
      clearHints(cell);
      return;
    }

    const defSlot = (SIM_SLOTS || CURRENT_SLOTS || [])[slot];
    if (!defSlot || defSlot.lunch) {
      clearHints(cell);
      return;
    }

    const others = (SIM_ITEMS || []).filter((_, idx) => idx !== movingIndex);
    const exact = sameExact(others);
    const band = sameBand(others);

    if (exact.length) {
      alert('Ese espacio exacto ya está ocupado.');
      clearHints(cell);
      return;
    }

    if (band.length >= 2) {
      alert('Esa franja ya tiene izquierda y derecha ocupadas.');
      clearHints(cell);
      return;
    }

    Object.assign(SIM_ITEMS[movingIndex], {
      day,
      slot,
      pos,
      hpos,
      start: defSlot.start,
      end: defSlot.end
    });

    markSimDirty();
    await renderSimGrid();
    clearHints(cell);
    return;
  }

  // =========================
  // 3) MOVER BLOQUE EXISTENTE
  // =========================
  if (moveData && moveData.type === 'move-block'){
    const blkId = moveData.id;
    if (!blkId) {
      clearHints(cell);
      return;
    }

    if (!state.currentUser || !state.activeSemesterId) {
      alert('Selecciona un semestre.');
      clearHints(cell);
      return;
    }

    try {
      const moving = items.find(x => x.id === blkId);
      if (!moving) {
        clearHints(cell);
        return;
      }

      const def = (CURRENT_SLOTS || [])[slot];
      if (!def) {
        clearHints(cell);
        return;
      }

      if (
        moving.day === day &&
        moving.slot === slot &&
        (moving.pos || 'full') === pos &&
        (moving.hpos || 'single') === hpos
      ) {
        clearHints(cell);
        return;
      }

      const others = items.filter(x => x.id !== blkId);
      const band = sameBand(others);
      const exact = sameExact(others);

      if (exact.length) {
        alert('Ese espacio exacto ya está ocupado.');
        clearHints(cell);
        return;
      }

      if (band.length >= 2) {
        alert('Esa franja ya tiene izquierda y derecha ocupadas.');
        clearHints(cell);
        return;
      }

      const ref = doc(
        db,
        'users',
        state.currentUser.uid,
        'semesters',
        state.activeSemesterId,
        'schedule',
        blkId
      );

      await updateDoc(ref, {
        day,
        slot,
        pos,
        hpos,
        start: def.start,
        end: def.end,
        updatedAt: Date.now()
      });

      const idx = items.findIndex(x => x.id === blkId);
      if (idx >= 0) {
        Object.assign(items[idx], {
          day,
          slot,
          pos,
          hpos,
          start: def.start,
          end: def.end
        });
      }

      renderGrid();
      clearHints(cell);
      return;
    } catch (err) {
      console.error('move error', err);
      alert('No se pudo mover el bloque (Firestore): ' + (err?.message || err));
      clearHints(cell);
      return;
    }
  }

  // =========================
  // 4) AGREGAR RAMO NUEVO DESDE PALETA
  // =========================
  const courseId = raw;

  if (!state.currentUser || !state.activeSemesterId) {
    alert('Selecciona un semestre.');
    clearHints(cell);
    return;
  }

  const band = sameBand(items || []);
  const exact = sameExact(items || []);

  if (exact.length) {
    alert('Ese espacio exacto ya está ocupado.');
    clearHints(cell);
    return;
  }

  if (band.length >= 2) {
    alert('Esa franja ya tiene izquierda y derecha ocupadas.');
    clearHints(cell);
    return;
  }

  if (band.length === 1) {
    const existing = band[0];
    const eH = existing.hpos || 'single';

    if (eH === 'single' && hpos !== 'single') {
      const oldSide = hpos === 'left' ? 'right' : 'left';
      try {
        await updateDoc(
          doc(
            db,
            'users',
            state.currentUser.uid,
            'semesters',
            state.activeSemesterId,
            'schedule',
            existing.id
          ),
          { hpos: oldSide }
        );
      } catch (_) {}
    } else if (eH === hpos) {
      alert('Ese lado ya está ocupado. Prueba el otro lado.');
      clearHints(cell);
      return;
    }
  }

  const def = (CURRENT_SLOTS || [])[slot];
  if (!def) {
    clearHints(cell);
    return;
  }

  await addDoc(
    collection(
      db,
      'users',
      state.currentUser.uid,
      'semesters',
      state.activeSemesterId,
      'schedule'
    ),
    {
      courseId,
      day,
      slot,
      start: def.start,
      end: def.end,
      pos,
      hpos,
      createdAt: Date.now()
    }
  );

  clearHints(cell);
});

    });
  }

  function clearHints(cell) {
    cell.classList.remove(
      'over',
      'hint-top',
      'hint-full',
      'hint-bottom',
      'hint-left',
      'hint-center',
      'hint-right'
    );
    delete cell.dataset.droppos;
    delete cell.dataset.droph;
  }
  let unsubShared = null;
  let sharedItems = [];
  let unsubSharedCourses = null;
  let sharedCourses = [];
  let sharedSlots = null;
  let sharedUni = 'USM';


  function renderPartyShell(){
    const host = $('horarioCompartido');
    if (!host) return;

    host.innerHTML = `
      <div class="card" style="margin-bottom:12px">
        <h3 style="margin:0 0 10px">Horarios de mi Party</h3>

        <div class="muted" style="margin-bottom:10px">
          Selecciona a una persona para ver su horario en vivo.
        </div>

        <div id="partyBar" style="display:flex; flex-wrap:wrap; gap:10px;"></div>

        <div style="margin-top:10px; display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
          <div>
            <label>Semestre</label><br/>
            <select id="party-semSel"></select>
          </div>
        </div>
      </div>

      <div id="schedPartyUSM" class="sched-usm card"></div>
    `;

    $('party-semSel')?.addEventListener('change', (e)=>{
      state.partyView = state.partyView || {};
      state.partyView.semId = e.target.value || null;
      if (state.partyView.uid && state.partyView.semId){
        subscribePartyMember(state.partyView.uid, state.partyView.semId);
      } else {
        buildPartyGrid();
      }
    });

    buildPartyGrid();
  }





  function buildSharedGrid(){
    const host = $('schedSharedUSM'); if (!host) return;

    const SLOTS = sharedSlots || USM_SLOTS;
    SHARED_CURRENT_SLOTS = SLOTS;

    const headerTitle = (sharedUni==='USM') ? 'Bloque' : 'Módulo';

    host.innerHTML = `
      <div class="usm-grid2">
        <div class="cell header">${headerTitle}</div>
        ${DAYS.map(d=>`<div class="cell header">${d}</div>`).join('')}
        ${SLOTS.map((s,slotIndex)=>`
          <div class="cell mod ${s.lunch?'lunch':''}" data-slot="${slotIndex}">
            ${renderModuleCell(s, slotIndex, sharedUni)}
          </div>
          ${DAYS.map((_,dayIndex)=>`
            <div class="cell slot ${s.lunch?'is-lunch':''}"
                data-day="${dayIndex}" data-slot="${slotIndex}">
              ${renderSharedCell(dayIndex, slotIndex)}
            </div>
          `).join('')}
        `).join('')}
      </div>
    `;
  }

  function renderSharedCell(day, slot){
    const theirsHere = sharedItems.filter(it => it.day===day && it.slot===slot);

    const renderGroup = (pos) => {
      const group = theirsHere.filter(h => (h.pos||'full') === pos);
      if (!group.length) return '';
      const sorted = group.sort((a,b)=>{
        const order = { left:0, single:1, right:2 };
        return (order[(a.hpos||'single')] ?? 1) - (order[(b.hpos||'single')] ?? 1);
      });
      return sorted.map(g => blockHtmlColored(g, pos, partnerColor, false)).join('');
    };

    return `
      ${renderGroup('top')}
      ${renderGroup('full')}
      ${renderGroup('bottom')}
    `;
  }

  function blockHtmlColored(it, pos, _colorFallback, isMine){
    const courseArr  = isMine ? (state.courses || []) : (partyCourses || []);

    const course     = courseArr.find(c=>c.id===it.courseId);
    const courseName = course?.name || 'Ramo';
    const shown      = (typeof it.displayName === 'string' && it.displayName.trim()) ? it.displayName.trim() : courseName;

    const color = getCourseColorById(courseArr, it.courseId, _colorFallback);

    const text  = bestText(color);
    const room  = (typeof it.room === 'string' && it.room.trim()) ? it.room.trim() : null;

    const h = it.hpos || 'single';
    const title = `${shown}${room ? ` · Sala: ${room}` : ''}`;

  return `
    <div class="placed pos-${pos} h-${h}"
        title="${escapeHtml(title)}"
        style="background:${color}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${text}; font-weight:600;">${escapeHtml(shown)}</div>
    </div>
  `;
  }

  async function getSlotsForUser(uid, readableUni) {
    const uni = uniCodeFromReadable(readableUni);
    const hasBase = (uni === 'USM' || uni === 'UMAYOR');
    if (uid) {
      try {
        const ref = doc(db, 'users', uid, 'custom_schedules', uni);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data()?.slots || [];
          if (Array.isArray(data) && data.length > 0) {
            return { uni, slots: data };
          }
        }
      } catch (err) {
        console.warn('[shared] error leyendo custom_schedules del dúo', err);
      }
    }
    if (hasBase) {
      return {
        uni,
        slots: (uni === 'UMAYOR') ? MAYOR_SLOTS : USM_SLOTS,
      };
    }
    return { uni, slots: null };
  }


  async function subscribeShared(semId){
    if (unsubShared){ unsubShared(); unsubShared=null; }
    if (unsubSharedCourses){ unsubSharedCourses(); unsubSharedCourses=null; }
    if (unsubPartnerProfile){ unsubPartnerProfile(); unsubPartnerProfile=null; }
    sharedItems = []; sharedCourses = [];
    sharedSlots = USM_SLOTS; sharedUni = 'USM';
    buildSharedGrid();

    myColor = state.profileData?.favoriteColor || myColor;

    const otherUid = state.pairOtherUid;
    if (!otherUid || !semId) return;

    const canSee = await canViewPartyZone(otherUid, 'horario');

if (!canSee) {
  sharedItems = [];
  sharedCourses = [];

  const host = $('schedSharedUSM') || $('schedPartyUSM');
  if (host) host.innerHTML = privacyBlockedMessage('su horario');

  return;
}

    const semRef = doc(db,'users',otherUid,'semesters',semId);
    const semSnap = await getDoc(semRef);
    const uniReadable = semSnap.exists()
      ? (semSnap.data().universityAtThatTime || '')
      : '';
    const { uni, slots } = await getSlotsForUser(otherUid, uniReadable);

    sharedUni = uni;
    sharedSlots = slots || ((uni === 'UMAYOR') ? MAYOR_SLOTS : USM_SLOTS);
    buildSharedGrid();

    unsubPartnerProfile = onSnapshot(doc(db,'users', otherUid), (snap)=>{
      const d = snap.data() || {};
      partnerColor = d.favoriteColor || partnerColor;
      buildSharedGrid();
    });

    const coursesRef = collection(db,'users',otherUid,'semesters',semId,'courses');
    unsubSharedCourses = onSnapshot(query(coursesRef, orderBy('name')), (snap)=>{
      sharedCourses = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      buildSharedGrid();
    });

    const schedRef = collection(db,'users',otherUid,'semesters',semId,'schedule');
    unsubShared = onSnapshot(query(schedRef), (snap)=>{
      sharedItems = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      buildSharedGrid();
    });
  }

  let _lastPopulateToken = 0;

  async function populateSharedSemesters(){
    const sel = $('sh-semSel');
    if (!sel) return;

    const myToken = ++_lastPopulateToken;
    const norm = s => String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/\s+/g,' ')
      .trim();

    const canon = s => {
      const t = norm(s);
      const m = t.replace(/[^\d\-\/ ]+/g,'').match(/(\d{4})\D*([12])$/);
      return m ? `${m[1]}-${m[2]}` : t.toLowerCase();
    };
    const parseYT = label => {
      const m = /^(\d{4})-(1|2)$/.exec(canon(label));
      return m ? { y: parseInt(m[1],10), t: parseInt(m[2],10) } : { y: -Infinity, t: -Infinity };
    };
    sel.innerHTML = '';
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '— seleccionar —';
    sel.appendChild(opt0);
    if (!state.pairOtherUid) return;

    const byKey = new Map();
    const ref = collection(db, 'users', state.pairOtherUid, 'semesters');
    const snap = await getDocs(query(ref));
    if (myToken !== _lastPopulateToken) return;
    snap.forEach(d => {
      const data = d.data() || {};
      const shown = norm(data.label || d.id);
      const key   = canon(shown);
      if (!byKey.has(key)) {
        const { y, t } = parseYT(shown);
        byKey.set(key, { id: d.id, labelToShow: shown, y, t });
      }
    });
    const options = Array.from(byKey.values()).sort((a,b)=>{
      if (a.y !== b.y) return b.y - a.y;
      return b.t - a.t;
    });
    const frag = document.createDocumentFragment();
    for (const { id, labelToShow } of options) {
      const opt = document.createElement('option');
      opt.value = id; 
      opt.textContent = labelToShow;
      frag.appendChild(opt);
    }
    sel.appendChild(frag);
    const prev = state.shared?.horario?.semId || '';
    if (prev && Array.from(sel.options).some(o => o.value === prev)) {
      sel.value = prev;
    } else {
      const firstValid = Array.from(sel.options).find(o => o.value);
      sel.value = firstValid ? firstValid.value : '';
      state.shared.horario.semId = sel.value || null;
    }
  }
  export async function setRoom({ course, day, slot, room }) {
    if (!state.currentUser || !state.activeSemesterId) throw new Error('No logueado');
    const semId = state.activeSemesterId;
    const uid = state.currentUser.uid;
    const match = (state.courses || []).find(c =>
      (c.name || '').toLowerCase().includes(String(course).toLowerCase())
    );
    if (!match) throw new Error('Curso no encontrado');
    const schedRef = collection(db, 'users', uid, 'semesters', semId, 'schedule');
    const snap = await getDocs(schedRef);
    const blk = snap.docs.find(d => {
      const data = d.data();
      return data.courseId === match.id && data.day === day && data.slot === slot;
    });

    if (!blk) throw new Error('No encontré el bloque en el horario');
    await updateDoc(blk.ref, { room: room || null, updatedAt: Date.now() });
    return { ok: true, room };
  }
  export async function getMySchedule(semId = null) {
    if (!state.currentUser) throw new Error('No logueado');
    const sid = semId || state.activeSemesterId;
    if (!sid) throw new Error('No hay semestre activo');

    const ref = collection(db, 'users', state.currentUser.uid, 'semesters', sid, 'schedule');
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  export async function overlapWithPair(semId = null) {
    if (!state.currentUser) throw new Error('No logueado');
    const sid = semId || state.activeSemesterId;
    if (!sid) throw new Error('No hay semestre activo');
    if (!state.pairOtherUid) return { items: [] };
    const myRef = collection(db, 'users', state.currentUser.uid, 'semesters', sid, 'schedule');
    const mySnap = await getDocs(myRef);
    const mine = mySnap.docs.map(d => ({ ...d.data() }));
    const pairRef = collection(db, 'users', state.pairOtherUid, 'semesters', sid, 'schedule');
    const pairSnap = await getDocs(pairRef);
    const theirs = pairSnap.docs.map(d => ({ ...d.data() }));
    const items = [];
    for (const m of mine) {
      for (const t of theirs) {
        if (m.day === t.day && m.slot === t.slot) {
          items.push(`${['Lun','Mar','Mié','Jue','Vie'][m.day]} bloque ${m.slot} (${m.courseName} / ${t.courseName})`);
        }
      }
    }
    return { items };
  }
  export async function removeBlock(blockId, semId = null) {
    if (!state.currentUser) throw new Error('No logueado');
    const sid = semId || state.activeSemesterId;
    await deleteDoc(doc(db, 'users', state.currentUser.uid, 'semesters', sid, 'schedule', blockId));
    return { ok: true };
  }

  document.addEventListener('dragstart', e => {
    const blk = e.target.closest('.placed');
    if (blk) blk.classList.add('dragging');
  });
  document.addEventListener('dragend', e => {
    const blk = e.target.closest('.placed');
    if (blk) blk.classList.remove('dragging');
  });

  const DAY_START = 8 * 60;  // 08:00
  const DAY_END = 22 * 60;   // 22:00

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }
  function percentFromMinute(min) {
    return ((min - DAY_START) / (DAY_END - DAY_START)) * 100;
  }
  document.addEventListener('auth:ready', () => {
    setTimeout(() => {
      initSchedule();
      onActiveSemesterChanged();
    }, 1000);
  });

  document.addEventListener('semester:changed', () => {
    onActiveSemesterChanged();
  });

  async function saveCustomScheduleToFirestore(uni, blocks) {
    if (!state.currentUser) return;
    const ref = doc(db, 'users', state.currentUser.uid, 'custom_schedules', uni);
    await setDoc(ref, { slots: blocks, updatedAt: Date.now() });
  }

  async function deleteCustomScheduleFromFirestore(uni) {
    if (!state.currentUser) return false;
    try {
      const ref = doc(db, 'users', state.currentUser.uid, 'custom_schedules', uni);
      await deleteDoc(ref);
      return true;
    } catch (err) {
      console.error('[Firestore] Error al eliminar horario personalizado:', err);
      return false;
    }
  }

  async function populatePartyMembersBar(){
    const bar = $('partyBar');
    if (!bar) return;
  const me = state.currentUser?.uid;

  const members = (state.partyMembers || [])
      .filter(Boolean)
      .filter(uid => uid !== me);

    // si no hay party, muestra fallback
    if (!members.length){
      bar.innerHTML = `<div class="muted">No hay miembros en tu party.</div>`;
      return;
    }

    // asegurar state.partyView
    state.partyView = state.partyView || {};

    // si no hay seleccionado, elige el primero que NO sea yo (o yo si no hay otro)
    if (!state.partyView.uid){
      const me = state.currentUser?.uid;
      state.partyView.uid = members.find(u => u !== me) || me || members[0];
    }

    // cargar perfiles (nombre/color) en paralelo (simple)
  await Promise.all(members.map(uid => loadPartyMemberProfile(uid, { force: true })));


    // render chips
    bar.innerHTML = members.map(uid => {
      const p = partyMemberProfileCache[uid] || {};
      const name = p.name || (uid === state.currentUser?.uid ? 'Yo' : 'Usuario');
      const color = isValidHex(p.color) ? p.color : '#64748b';
      const active = (uid === state.partyView.uid);

      return `
    <button class="party-chip btn ${active ? 'violet' : 'violet-outline'} ${active ? 'is-active' : ''}"
      data-uid="${escapeHtml(uid)}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${active ? 'outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);' : ''}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${color};display:inline-block;"></span>
      <span style="font-weight:700">${escapeHtml(name)}</span>
    </button>
  `;

    }).join('');
    bar.querySelectorAll('button[data-uid]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const uid = btn.dataset.uid;
        state.partyView.uid = uid;
        await populatePartyMembersBar();
        await populatePartySemesters(uid);
        await autoSelectPartyMemberSemester();
        if (state.partyView.semId){
          subscribePartyMember(uid, state.partyView.semId);
        } else {
          buildPartyGrid();
        }
      });
    });
  }

  async function loadPartyMemberProfile(uid, { force = false } = {}) {
    if (!uid) return;
    if (!force && partyMemberProfileCache[uid]) return;

    try {
      const rootRef = doc(db, 'users', uid);
      const profRef = doc(db, 'users', uid, 'profile', 'profile');

      const [rootSnap, profSnap] = await Promise.all([getDoc(rootRef), getDoc(profRef)]);

      const root = rootSnap.exists() ? (rootSnap.data() || {}) : {};
      const prof = profSnap.exists() ? (profSnap.data() || {}) : {};
      const name =
        (typeof prof.name === 'string' && prof.name.trim()) ? prof.name.trim()
        : (typeof root.name === 'string' && root.name.trim()) ? root.name.trim()
        : (typeof root.displayName === 'string' && root.displayName.trim()) ? root.displayName.trim()
        : (typeof root.username === 'string' && root.username.trim()) ? root.username.trim()
        : '';
      const color =
        (typeof prof.favoriteColor === 'string' && prof.favoriteColor.trim()) ? prof.favoriteColor.trim()
        : (typeof root.favoriteColor === 'string' && root.favoriteColor.trim()) ? root.favoriteColor.trim()
        : '';
      partyMemberProfileCache[uid] = { name, color };
    } catch (e) {
      console.warn('loadPartyMemberProfile error', e);
      partyMemberProfileCache[uid] = partyMemberProfileCache[uid] || { name:'', color:'' };
    }
  }
  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, (c)=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
  function simOrderKey(){
    return `sim_palette_order_${state.currentUser?.uid || 'anon'}_${state.activeSemesterId || 'noSem'}`;
  }
  function loadSimCourseOrder(){
    try{
      const raw = localStorage.getItem(simOrderKey());
      const arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    }catch{ return []; }
  }
  function saveSimCourseOrder(ids){
    try{
      localStorage.setItem(simOrderKey(), JSON.stringify(ids || []));
    }catch{}
  }
  function sortCoursesBySimOrder(list){
    const order = loadSimCourseOrder();
    if (!order.length) return list;

    const pos = new Map(order.map((id, i)=>[id, i]));
    const max = 999999;

    return [...list].sort((a,b)=>{
      const pa = pos.has(a.id) ? pos.get(a.id) : max;
      const pb = pos.has(b.id) ? pos.get(b.id) : max;
      if (pa !== pb) return pa - pb;
      return String(a.name||'').localeCompare(String(b.name||''), 'es');
    });
  }
  function bindSimPaletteReorderDnD(){
    const host = document.getElementById('simPaletteHost');
    if (!host) return;
    let dragId = null;
    host.querySelectorAll('.sim-course-group[draggable="true"]').forEach(group=>{
      group.addEventListener('dragstart', (e)=>{
    dragId = group.dataset.courseId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId); // ✅ importantísimo
    group.classList.add('dragging');
  });
      group.addEventListener('dragend', ()=>{
        dragId = null;
        group.classList.remove('dragging');
        host.querySelectorAll('.sim-course-group').forEach(g=> g.classList.remove('drag-over'));
      });
      group.addEventListener('dragover', (e)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        group.classList.add('drag-over');
      });
      group.addEventListener('dragleave', ()=>{
        group.classList.remove('drag-over');
      });

      group.addEventListener('drop', (e)=>{
        e.preventDefault();
        group.classList.remove('drag-over');

        const targetId = group.dataset.courseId;
        if (!dragId || !targetId || dragId === targetId) return;

        const order = loadSimCourseOrder();
        if (!order.length){
          const visible = Array.from(host.querySelectorAll('.sim-course-group'))
            .map(el=> el.dataset.courseId)
            .filter(Boolean);
          saveSimCourseOrder(visible);
        }
        const cur = loadSimCourseOrder().filter(Boolean);
        const allCourses = (state.courses || []).map(c=>c.id);
        for (const cid of allCourses){
          if (!cur.includes(cid)) cur.push(cid);
        }
        const next = cur.filter(id => id !== dragId);
        const idx = next.indexOf(targetId);
        next.splice(Math.max(0, idx), 0, dragId);
        saveSimCourseOrder(next);
        renderSimPalette(); // repinta con nuevo orden
      });
    });
  }

  function ensureSimPaletteReorderStyles(){
    if (document.getElementById('simPaletteReorderStyles')) return;
    const st = document.createElement('style');
    st.id = 'simPaletteReorderStyles';
    st.textContent = `
      #simPaletteHost{ display:flex; flex-wrap:wrap; gap:10px; }

      .sim-course-group{
        display:flex;
        align-items:stretch;
        gap:8px;
        padding:0;              
        border:none;             
        background:transparent; 
      }

      .sim-course-group.drag-over{
        outline:2px solid rgba(124,58,237,.55);
        outline-offset:4px;
        border-radius:14px;
      }

      .sim-course-group.dragging{
        opacity:.7;
      }
    `;
    document.head.appendChild(st);
  }

  async function populatePartySemesters(uid){
    const sel = $('party-semSel');
    if (!sel) return;

    sel.innerHTML = `<option value="">— seleccionar —</option>`;

    if (!uid) return;

    const ref = collection(db, 'users', uid, 'semesters');
    const snap = await getDocs(query(ref));

    // orden simple por label (si tu label es "2025-2", esto te queda bien)
    const list = snap.docs.map(d => ({ id:d.id, label:(d.data()?.label || d.id).trim() }));

    list.sort((a,b)=> (b.label).localeCompare(a.label));

    for (const it of list){
      const opt = document.createElement('option');
      opt.value = it.id;
      opt.textContent = it.label;
      sel.appendChild(opt);
    }
  }

  async function autoSelectPartyMemberSemester(){
    const uid = state.partyView?.uid;
    const activeLabel = state.activeSemesterData?.label;
    const sel = $('party-semSel');
    if (!uid || !activeLabel || !sel) return;

    await populatePartySemesters(uid);
    const options = Array.from(sel.options);
    const match = options.find(o => (o.textContent||'').trim() === activeLabel);

    if (match){
      sel.value = match.value;
      state.partyView.semId = match.value;
      await subscribePartyMember(uid, match.value);
    } else {
      // si no existe ese label, elige el primero válido
      const first = options.find(o => o.value);
      sel.value = first ? first.value : '';
      state.partyView.semId = sel.value || null;
      if (state.partyView.semId) await subscribePartyMember(uid, state.partyView.semId);
    }
  }

  function buildPartyGrid(){
    const host = $('schedPartyUSM');
    if (!host) return;

    if (!partyCourses || partyCourses.length === 0) {
      host.innerHTML = `<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>`;
      return;
    }

    const SLOTS = partySlots || USM_SLOTS;
    SHARED_CURRENT_SLOTS = SLOTS; // si quieres mantener tu renderModuleCell

    const headerTitle = (partyUni==='USM') ? 'Bloque' : 'Módulo';

    host.innerHTML = `
      <div class="usm-grid2">
        <div class="cell header">${headerTitle}</div>
        ${DAYS.map(d=>`<div class="cell header">${d}</div>`).join('')}
        ${SLOTS.map((s,slotIndex)=>`
          <div class="cell mod ${s.lunch?'lunch':''}" data-slot="${slotIndex}">
            ${renderModuleCell(s, slotIndex, partyUni)}
          </div>
          ${DAYS.map((_,dayIndex)=>`
            <div class="cell slot ${s.lunch?'is-lunch':''}"
                data-day="${dayIndex}" data-slot="${slotIndex}">
              ${renderPartyCell(dayIndex, slotIndex)}
            </div>
          `).join('')}
        `).join('')}
      </div>
    `;
  }

  function renderPartyCell(day, slot){
    const here = partyItems.filter(it => it.day===day && it.slot===slot);

    const renderGroup = (pos) => {
      const group = here.filter(h => (h.pos||'full') === pos);
      if (!group.length) return '';
      const sorted = group.sort((a,b)=>{
        const order = { left:0, single:1, right:2 };
        return (order[(a.hpos||'single')] ?? 1) - (order[(b.hpos||'single')] ?? 1);
      });
      const uid = state.partyView?.uid;
      const userColor = partyMemberProfileCache[uid]?.color || partnerColor;

      return sorted.map(g => blockHtmlColored(g, pos, userColor, false)).join('');
    };

    return `
      ${renderGroup('top')}
      ${renderGroup('full')}
      ${renderGroup('bottom')}
    `;
  }
  async function subscribePartyMember(uid, semId){

    const canSee = await canViewPartyZone(uid, 'horario');

if (!canSee) {
  const host = $('schedPartyUSM');
  if (host) host.innerHTML = privacyBlockedMessage('su horario');
  return;
}

    if (unsubPartySched){ unsubPartySched(); unsubPartySched=null; }
    if (unsubPartyCourses){ unsubPartyCourses(); unsubPartyCourses=null; }
    if (unsubPartyProfile){ unsubPartyProfile(); unsubPartyProfile=null; }

    if (!uid || !semId) return;
    const hadCache = applyPartyCache(uid, semId);
    if (!hadCache){
      partyItems = [];
      partyCourses = [];
      partySlots = null;
      partyUni = 'USM';
      const host = $('schedPartyUSM');
      if (host) host.innerHTML = `<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>`;
    }
    const uniReadable =
    state.partyView?.semId
      ? (await getDoc(doc(db,'users',uid,'semesters',state.partyView.semId))).data()?.universityAtThatTime
      : '';
    const { uni, slots } = await getSlotsForUser(uid, uniReadable);
    partyUni = uni;
    partySlots = slots || ((uni === 'UMAYOR') ? MAYOR_SLOTS : USM_SLOTS);
    unsubPartyProfile = onSnapshot(doc(db,'users', uid), (snap)=>{
      const d = snap.data() || {};
      partyMemberProfileCache[uid] = partyMemberProfileCache[uid] || {};
      partyMemberProfileCache[uid].color = d.favoriteColor || partyMemberProfileCache[uid].color || '';
      partyMemberProfileCache[uid].name  = d.displayName || d.name || d.username || partyMemberProfileCache[uid].name || '';
      buildPartyGrid();
    });
    const coursesRef = collection(db,'users',uid,'semesters',semId,'courses');
    unsubPartyCourses = onSnapshot(query(coursesRef, orderBy('name')), (snap)=>{
      partyCourses = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      partyScheduleCache.set(cacheKey(uid, semId), {
        uni: partyUni, slots: partySlots, items: partyItems, courses: partyCourses
      });
      buildPartyGrid();
    });
    const schedRef = collection(db,'users',uid,'semesters',semId,'schedule');
    unsubPartySched = onSnapshot(query(schedRef), (snap)=>{
      partyItems = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
      partyScheduleCache.set(cacheKey(uid, semId), {
        uni: partyUni, slots: partySlots, items: partyItems, courses: partyCourses
      });
      buildPartyGrid();
    });
  }
  async function unsubscribeBusyAll(){
    for (const [uid, u] of busyUnsubs.entries()){
      try { u.prof?.(); } catch {}
      try { u.courses?.(); } catch {}
      try { u.sched?.(); } catch {}
    }
    busyUnsubs.clear();
    busyMembers.clear();
  }
  async function getBestSemesterIdForUser(uid, preferredLabel, { allowFallback = true } = {}){
    const ref = collection(db, 'users', uid, 'semesters');
    const snap = await getDocs(query(ref));

    const list = snap.docs.map(d => ({
      id: d.id,
      label: String(d.data()?.label || d.id).trim()
    }));
    if (!list.length) return null;
    const match = preferredLabel ? list.find(x => x.label === preferredLabel) : null;
    if (match) return match.id;
    if (!allowFallback && preferredLabel) return null;
    list.sort((a,b)=> (b.label).localeCompare(a.label));
    return list[0].id;
  }
  async function subscribePartyBusyAll(preferredLabelOverride = null){
    const me = state.currentUser?.uid;
  const members = Array.from(new Set([...(state.partyMembers || []), me])).filter(Boolean);
    if (!members.length){
      const host = $('schedPartyBusy');
      if (host) host.innerHTML = `<div class="muted">No hay miembros en tu party.</div>`;
      return;
    }
    await unsubscribeBusyAll();

    const preferredLabel = preferredLabelOverride ?? (state.activeSemesterData?.label || null);
    const strict = !!preferredLabelOverride;
    await Promise.all(members.map(uid => loadPartyMemberProfile(uid, { force:true })));

    for (const uid of members){
      const semId = await getBestSemesterIdForUser(uid, preferredLabel, {
    allowFallback: !strict
  });
      if (!semId) continue;
      const base = partyMemberProfileCache[uid] || {};
      busyMembers.set(uid, {
        name: base.name || (uid === state.currentUser?.uid ? 'Yo' : 'Usuario'),
        color: base.color || '#64748b',
        uni: 'USM',
        slots: null,
        courses: [],
        items: [],
        semId
      });
      const safeHex = (c, fallback='#64748b') => {
    const s = String(c || '').trim();
    return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : fallback;
  };
  const safeName = (s, fallback='Usuario') => {
    const t = String(s || '').trim();
    return t ? t : fallback;
  };
      const un = {};
      un.prof = onSnapshot(doc(db,'users', uid, 'profile', 'profile'), (snap)=>{
    const d = snap.data() || {};
    const cur = busyMembers.get(uid);
    if (!cur) return;
    cur.color = safeHex(d.favoriteColor, cur.color || '#64748b');
    cur.name  = safeName(d.name, cur.name || (uid === state.currentUser?.uid ? 'Yo' : 'Usuario'));

    scheduleBusyRender();
  });
      const coursesRef = collection(db,'users',uid,'semesters',semId,'courses');
      un.courses = onSnapshot(query(coursesRef, orderBy('name')), (snap)=>{
        const cur = busyMembers.get(uid);
        if (!cur) return;
        cur.courses = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
        scheduleBusyRender();
      });

      const schedRef = collection(db,'users',uid,'semesters',semId,'schedule');
      un.sched = onSnapshot(query(schedRef), (snap)=>{
        const cur = busyMembers.get(uid);
        if (!cur) return;
        cur.items = snap.docs.map(d=> ({ id:d.id, ...d.data(), _uid: uid }));
        scheduleBusyRender();
      });
      busyUnsubs.set(uid, un);
    }
    scheduleBusyRender();
  }
  function packIntoLanes(blocks){
    const sorted = [...blocks].sort((a,b)=> a.startMin - b.startMin || a.endMin - b.endMin);
    const lanes = []; 

    for (const b of sorted){
      let placed = false;
      for (let i=0;i<lanes.length;i++){
        if (lanes[i] <= b.startMin){
          b._lane = i;
          lanes[i] = b.endMin;
          placed = true;
          break;
        }
      }
      if (!placed){
        b._lane = lanes.length;
        lanes.push(b.endMin);
      }
    }
    return { blocks: sorted, laneCount: lanes.length || 1 };
  }
  function ensureTimelineStyles(){
    if (document.getElementById('timelineStyles')) return;
    const st = document.createElement('style');
    st.id = 'timelineStyles';
    st.textContent = `
      :root{
        --tl-gap: 12px;
        --tl-radius: 16px;
        --tl-border: rgba(255,255,255,.10);
        --tl-bg: rgba(255,255,255,.03);
        --tl-bg-strong: rgba(18,21,39,.85);
        --tl-line: rgba(255,255,255,.06);
      }
      .timeline-wrap{
    overflow:auto;
    padding:14px;
    padding-right: 28px; /* ✅ colchón para que el viernes no quede cortado */
    box-sizing:border-box;
    border-radius: 18px;
    background: rgba(255,255,255,.02);
  }
      /* grid general */
      .timeline-head,
      .timeline-body{
        display:grid;
        grid-template-columns: 78px repeat(5, minmax(190px, 1fr));
        gap: var(--tl-gap);
        box-sizing:border-box;
        min-width: 1100px; /* ✅ para que respire y permita scroll horizontal */
      }
      /* header sticky */
      .timeline-head{
        position:sticky;
        top:0;
        z-index:60;
        background: var(--tl-bg-strong);
        backdrop-filter: blur(10px);
        border: 1px solid var(--tl-border);
        border-radius: var(--tl-radius);
        padding: 10px;
      }
      .timeline-dayname{
        text-align:center;
        font-weight:900;
        letter-spacing:.2px;
        font-size:13px;
        opacity:.95;
        padding:8px 6px;
        border-radius: 12px;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
      }
      /* cuerpo */
      .timeline-body{
        padding-top: 12px;
        align-items:start;
      }
      /* col de horas */
      .timeline-timecol{
        position:sticky;
        left:0;
        z-index:40;
        background: rgba(18,21,39,.92);
        border: 1px solid var(--tl-border);
        border-radius: var(--tl-radius);
        overflow:hidden;
      }
      .timeline-timecell{
        height:48px;
        display:flex;
        align-items:center;
        justify-content:flex-end;
        padding: 0 10px;
        font-size:12px;
        font-weight:800;
        opacity:.85;
        border-bottom: 1px solid rgba(255,255,255,.06);
        box-sizing:border-box;
      }
      /* columnas por día */
      .timeline-day{
        position:relative;
        height: calc(15 * 48px);
        border: 1px solid var(--tl-border);
        border-radius: var(--tl-radius);
        background: var(--tl-bg);
        overflow:hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,.18);
      }
      /* líneas horizontales */
      .timeline-line{
        position:absolute;
        left:0; right:0;
        height:1px;
        background: var(--tl-line);
      }
      .timeline-line.half{
        background: rgba(255,255,255,.035);
      }

      /* bloque */
      .timeline-block{
        border-radius: 12px;
        box-sizing:border-box;
        overflow:hidden;
        box-shadow: 0 8px 18px rgba(0,0,0,.22);
        transition: transform .08s ease, filter .08s ease;
      }
      .timeline-block:hover{
        transform: translateY(-1px);
        filter: brightness(1.03);
      }

      .timeline-block .tl-label{
        position:absolute;
        left:8px; right:8px;
        color:#fff;
        font-size:12px;
        font-weight:900;
        line-height:1.15;
        text-align:center;
        text-shadow: 0 1px 2px rgba(0,0,0,.45);
        pointer-events:none;

        display:-webkit-box;
        -webkit-line-clamp: 2;      /* ✅ máximo 2 líneas */
        -webkit-box-orient: vertical;
        overflow:hidden;
      }
    `;
    document.head.appendChild(st);
  }
  function renderPartyBusyTimeline(targetId = 'schedPartyBusy'){
    ensureTimelineStyles();
    const host = document.getElementById(targetId);
    if (!host) return;
    const membersArr = Array.from(busyMembers.entries());
    if (!membersArr.length){
      host.innerHTML = `<div class="muted">Cargando party…</div>`;
      return;
    }
    const all = [];
    for (const [uid, m] of membersArr){
      for (const it of (m.items || [])){
        const startMin = toMinutes(it.start);
        const endMin   = toMinutes(it.end);
        if (isNaN(startMin) || isNaN(endMin) || endMin <= startMin) continue;
        all.push({ ...it, _uid: uid, _name: m.name, _favColor: m.color, startMin, endMin });
      }
    }
    host.innerHTML = `
      <div class="timeline-wrap">
        <div class="timeline-head">
          <div></div>
          ${DAYS.map(d => `<div class="timeline-dayname">${d}</div>`).join('')}
        </div>
        <div class="timeline-body">
          <div class="timeline-timecol">
            ${Array.from({length: 15}, (_,i)=>{
              const h = 8 + i;
              return `<div class="timeline-timecell">${h}:00</div>`;
            }).join('')}
          </div>
          ${DAYS.map((_,dayIndex)=> `
            <div class="timeline-day">
              ${renderHourGridLines()}
              ${(() => {
                const dayBlocks = all.filter(b => b.day === dayIndex)
                  .map(b => ({
                    ...b,
                    topPct: percentFromMinute(b.startMin),
                    heightPct: percentFromMinute(b.endMin) - percentFromMinute(b.startMin)
                  }))
                  .filter(b => b.heightPct > 0);

                const packed = packIntoLanes(dayBlocks);
                return packed.blocks.map(b => renderBusyBlock(b, packed.laneCount)).join('');
              })()}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  function renderHourGridLines(){
    return Array.from({length: 15}, (_,i)=>{
      const topHour = i*(100/15);
      const topHalf = topHour + (100/15)/2;
      return `
        <div class="timeline-line" style="top:${topHour}%"></div>
        <div class="timeline-line half" style="top:${topHalf}%"></div>
      `;
    }).join('');
  }
  function renderBusyBlock(b, laneCount){
    const mem = busyMembers.get(b._uid);
    const favHex = (mem?.color || b._favColor || '#64748b');
    const coursesArr = mem?.courses || [];
    const c = coursesArr.find(x => x.id === b.courseId);
    const courseName = (c?.name || 'Ramo').trim();
  const hasOverlap = laneCount > 1;
  const fillHex = favHex; 
  const bg   = hexToRgba(fillHex, hasOverlap ? 0.35 : 0.90);
  const text = bestText(fillHex);
  const border = hexToRgba(fillHex, 1);
    const labelPos = (() => {
      if (!hasOverlap) return 'center';
      if (b._lane === 0) return 'top';
      if (b._lane === 1) return 'bottom';
      return 'center';
    })();

    const labelStyle = (() => {
      if (labelPos === 'top') return 'top:6px; transform:none;';
      if (labelPos === 'bottom') return 'bottom:6px; transform:none;';
      return 'top:50%; transform:translateY(-50%);';
    })();

    const z = 10 + (b._lane || 0);

    return `
      <div class="timeline-block"
        title="${escapeHtml(courseName)}"
        style="
          position:absolute;
          top:${b.topPct}%;
          height:${b.heightPct}%;
          left:0%;
          width:100%;
          z-index:${z};
          border-radius:10px;
          background:${bg};
          border:2px solid ${border};
          box-sizing:border-box;
          overflow:hidden;
        ">
        <div style="
          position:absolute;
          left:8px; right:8px;
          ${labelStyle}
          color:${text};
          font-size:12px;
          font-weight:900;
          line-height:1.1;
          text-align:center;
          text-shadow: 0 1px 2px rgba(0,0,0,.45);
          pointer-events:none;
        ">
          ${escapeHtml(courseName)}
        </div>
      </div>
    `;
  }
  function hexToRgba(hex, alpha){
    if (!isValidHex(hex)) return `rgba(100,116,139,${alpha})`; // slate fallback
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${r},${g},${b},${a})`;
  }
  function renderBusyLegend(targetId){
    const el = document.getElementById(targetId);
    if (!el) return;

    const arr = Array.from(busyMembers.entries())
      .map(([uid, m]) => ({
        uid,
        name: m?.name || (uid === state.currentUser?.uid ? 'Yo' : 'Usuario'),
        color: m?.color || '#64748b',
      }))
      .sort((a,b)=> a.name.localeCompare(b.name, 'es'));

    if (!arr.length){
      el.innerHTML = `<div class="muted">Cargando integrantes…</div>`;
      return;
    }

    el.innerHTML = arr.map(p => `
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${isValidHex(p.color) ? p.color : '#64748b'};display:inline-block;"></span>
        <span style="font-weight:800">${escapeHtml(p.name)}</span>
      </div>
    `).join('');
  }
  function ensureSimModal(){
    const old = document.getElementById('simModal');
    if (old) old.remove(); 
    const wrap = document.createElement('div');
    wrap.id = 'simModal';
    wrap.style.cssText = `
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.62); z-index:10050; padding:16px;
    `;
    wrap.innerHTML = `
      <div id="simModalPanel" style="
        width:min(980px, 98vw);
        max-height: 92vh;
        overflow:auto;
        overscroll-behavior:contain;
        background:#121527;
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:14px;
        box-shadow:0 18px 60px rgba(0,0,0,.45);
        color:#fff;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div class="card" style="padding:12px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
            <div style="min-width:0;">
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <div style="font-size:16px; font-weight:900; line-height:1.1;">Simulador de horario</div>
                <!-- semestre como CONTEXTO, no input -->
                <div id="simActiveSemLabel" style="
                  font-size:12px;
                  font-weight:900;
                  padding:6px 10px;
                  border-radius:999px;
                  border:1px solid rgba(255,255,255,.12);
                  background:rgba(255,255,255,.04);
                  opacity:.95;
                ">—</div>
              </div>
              <div style="font-size:12.5px; opacity:.72; margin-top:6px;">
                Vista previa: no guarda cambios (solo el cuadro).
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <!-- exportar: acción secundaria, arriba a la derecha -->
              <button id="simExportBtn" class="btn violet" type="button">
    Exportar a mi horario
  </button>
              <button id="simDeleteBtn" class="btn red" type="button">
    Eliminar Simulación
  </button>
              <button id="simX" class="btn violet-outline" type="button"
                style="padding:8px 10px; border-radius:12px;">✕</button>
            </div>
          </div>
          <div style="margin-top:10px;">
            <div id="simPaletteHost" class="palette" style="margin-top:10px;"></div>
            <div class="muted" style="font-size:12.5px; opacity:.75; margin-top:8px;">
              Agrega ramos aquí y luego arrástralos en el horario normal.
            </div>
          </div>
  </div>
        <div id="simGridHost" class="card" style="padding:12px;"></div>
    `;
    document.body.appendChild(wrap);
    const modal = wrap;
    const onEsc = (e) => {
    if (modal.style.display === 'flex' && e.key === 'Escape') {
      e.preventDefault();
      attemptClose();
    }
  };
    const closeDirect = () => {
    modal.style.display = 'none';
    IN_SIM_MODAL = false;
    SIM_OPEN_SNAPSHOT = null;
    SIM_SLOTS = null;
    document.removeEventListener('keydown', onEsc);
    document.documentElement.classList.remove('sim-lock');
    document.body.classList.remove('sim-lock');
    stopGlobalAutoScroll();
    document.dispatchEvent(new Event('courses:changed'));
  };
    document.getElementById('simExportBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!state.currentUser || !state.activeSemesterId){
      alert('Selecciona un semestre activo.');
      return;
    }
    const ok = await askYesNo({
      title: 'Exportar simulación',
      text: '¿Quieres exportar esta simulación a tu semestre?',
      yesText: 'Sí, exportar',
      noText: 'Cancelar'
    });
    if (!ok) return;
    const btn = document.getElementById('simExportBtn');
    if (btn){
      btn.disabled = true;
      btn.textContent = 'Exportando...';
    }
    try{
      await commitSimToRealSchedule();
      clearSimAllLocal();
      SIM_SLOTS = null;
      SIM_COURSES = [];
      SIM_ITEMS = [];
      SIM_PARALLEL_DEFS.clear?.();
      SELECTED_PARALLEL.clear?.();
      SIM_OPEN_SNAPSHOT = null;
      SIM_SAVED_FULL = '';
      SIM_DIRTY = false;
      closeDirect();
      await renderGrid();
      alert('✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.');
    } catch (err){
      console.error(err);
      alert('No se pudo exportar la simulación. Revisa consola.');
    } finally {
      if (btn){
        btn.disabled = false;
        btn.textContent = 'Exportar a mi horario';
      }
    }
  });
    document.getElementById('simDeleteBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await askYesNo({
      title: 'Eliminar simulación',
      text: 'Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?',
      yesText: 'Sí, eliminar',
      noText: 'Cancelar'
    });
    if (!ok) return;
    clearSimAllLocal();
    SIM_SLOTS = null;
    SIM_COURSES = [];
    SIM_ITEMS = [];
    SIM_PARALLEL_DEFS.clear?.();
    SELECTED_PARALLEL.clear?.();
    SIM_OPEN_SNAPSHOT = null;
    SIM_SAVED_FULL = '';
    SIM_DIRTY = false;
    closeDirect();
  });
    const attemptClose = async () => {
      const wantExit = await askYesNo({
        title: 'Salir del simulador',
        text: '¿Quieres salir del simulador?',
        yesText: 'Sí, salir',
        noText: 'Cancelar'
      });
      if (!wantExit) return;
      const dirty = isSimDirty();

  const action = await askSaveDiscardCancel({
    title: 'Salir del simulador',
    message: dirty
      ? 'Tienes cambios sin guardar. ¿Qué quieres hacer?'
      : 'No hiciste cambios. ¿Cómo quieres salir?',
    saveText: dirty ? 'Guardar y salir' : 'Guardar y salir',
    discardText: 'Salir sin guardar',
    cancelText: 'Cancelar',
  });

      if (action === 'cancel') return;
      if (action === 'save') {
    saveSimAllLocal();
    closeDirect();
    return;
  }

    if (action === 'discard') {
    restoreSimFromSnapshot(SIM_OPEN_SNAPSHOT, { persist:true });
    SIM_DIRTY = false;
    renderPalette();
    renderGrid();
    closeDirect();
    return;
  }
    };
    document.getElementById('simX')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      attemptClose();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) attemptClose();
    });

    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex' && e.key === 'Escape') {
        e.preventDefault();
        attemptClose();
      }
    });

  }
  function renderSimCellContent(day, slot){
    const here = SIM_ITEMS.filter(it => it.day===day && it.slot===slot);
    if (!here.length) return '';
    return renderCellContentFromArray(here, /*isSim*/ true);
  }
  async function rebuildSimItemsFromSelections(){
    const SLOTS = SIM_SLOTS || await getMySlots();
    if (!SLOTS) return;

    const courses = Array.isArray(SIM_COURSES) ? SIM_COURSES : [];
    const next = [];

    for (const c of courses){
      const defs = SIM_PARALLEL_DEFS.get(c.id) || [];

      // Solo reconstruir cuando el usuario seleccionó explícitamente un paralelo.
      const pid = SELECTED_PARALLEL.get(c.id) || null;
      if (!pid) continue;

      const def = defs.find(d => d.pid === pid);
      if (!def) continue;

      const baseName = (c.name || 'Ramo').trim();
      const shownSec = def.section || pid;

      for (const b of (def.blocks || [])){
        const slotDef = SLOTS?.[b.slot];
        if (!slotDef || slotDef.lunch) continue;

        next.push({
          courseId: c.id,
          day: b.day,
          slot: b.slot,
          start: slotDef.start,
          end: slotDef.end,
          pos: b.pos || 'full',
          hpos: b.hpos || 'single',
          pid,
          displayName: `${baseName} · ${shownSec}`
        });
      }
    }

    SIM_ITEMS = next;
    markSimDirty();
  }
  async function applyCourseParallelToSim(courseId, pid){
    const defs = SIM_PARALLEL_DEFS.get(courseId) || [];
    const def = defs.find(d => d.pid === pid);
    if (!def) return;

    const SLOTS = SIM_SLOTS || await getMySlots();
    if (!SLOTS) return;

    SIM_ITEMS = SIM_ITEMS.filter(x => x.courseId !== courseId);

    const course =
      (SIM_COURSES || []).find(c => c.id === courseId) ||
      (state.courses || []).find(c => c.id === courseId) ||
      {};

    const baseName = (course.name || 'Ramo').trim();
    const shownSec = def.section || pid;

    for (const b of (def.blocks || [])){
      const slotDef = SLOTS?.[b.slot];
      if (!slotDef || slotDef.lunch) continue;

      SIM_ITEMS.push({
        courseId,
        day: b.day,
        slot: b.slot,
        start: slotDef.start,
        end: slotDef.end,
        pos: b.pos || 'full',
        hpos: b.hpos || 'single',
        pid,
        displayName: `${baseName} · ${shownSec}`
      });
    }

    SELECTED_PARALLEL.set(courseId, pid);
    saveSimSelectedParallels();
    markSimDirty();
    renderSimPalette();
    await renderSimGrid();
  }
  async function renderSimGrid(){
    const host = document.getElementById('simGridHost');
    if (!host) return;

    const SLOTS = SIM_SLOTS || await getMySlots();

    if (!SLOTS){
      host.innerHTML = `
        <div style="text-align:center; padding:18px;">
          <div style="font-weight:900; margin-bottom:6px;">No hay horario base para esta universidad</div>
          <div class="muted" style="opacity:.8;">Crea un horario personalizado en la vista normal.</div>
        </div>
      `;
      return;
    }

    const uni = getActiveUniCode();
    const headerTitle = (uni === 'USM') ? 'Bloque' : 'Módulo';

    host.innerHTML = `
      <div class="usm-grid2">
        <div class="cell header">${headerTitle}</div>
        ${DAYS.map(d=>`<div class="cell header">${d}</div>`).join('')}
        ${SLOTS.map((s,slotIndex)=>`
          <div class="cell mod ${s.lunch?'lunch':''}" data-slot="${slotIndex}">
            ${renderModuleCell(s, slotIndex, uni)}
          </div>
          ${DAYS.map((_,dayIndex)=>`
            <div class="cell slot ${s.lunch?'is-lunch':''}"
                data-day="${dayIndex}" data-slot="${slotIndex}"
                ${s.lunch?'aria-disabled="true"':''}
                style="${s.lunch ? 'pointer-events:none; opacity:.65;' : ''}">
                ${renderSimCellContent(dayIndex, slotIndex)}
            </div>
          `).join('')}
        `).join('')}
      </div>
    `;

    // Las celdas del modal se crean dinámicamente, por eso se enlazan después de renderizar.
    bindCellDropZones();
  }
  export async function openSimSchedule() {
    if (!state.currentUser || !state.activeSemesterId) {
      alert('Selecciona un semestre activo antes de usar el simulador.');
      return;
    }

    const savedSlots = loadSimSlots();

    if (savedSlots && Array.isArray(savedSlots) && savedSlots.length) {
      SIM_SLOTS = savedSlots;
    } else {
      const simBlocks = await createSimSlotsFlow();
      if (!simBlocks) return;
      SIM_SLOTS = simBlocks;
      saveSimSlots(SIM_SLOTS);
    }

    ALLOW_ADD_COURSE_UI = false;
    ensureSimModal();

    const modal = document.getElementById('simModal');
    const panel = document.getElementById('simModalPanel');

    document.documentElement.classList.add('sim-lock');
    document.body.classList.add('sim-lock');

    modal.style.display = 'flex';
    IN_SIM_MODAL = true;

    SIM_COURSES = loadSimCourses();
    SIM_ITEMS = loadSimItems();
    if (!Array.isArray(SIM_ITEMS)) SIM_ITEMS = [];

    const defsLoaded = loadSimParallelDefs();
    SIM_PARALLEL_DEFS.clear?.();
    for (const [cid, defs] of defsLoaded.entries()){
      SIM_PARALLEL_DEFS.set(cid, defs || []);
    }

    const selLoaded = loadSimSelectedParallels();
    SELECTED_PARALLEL.clear?.();
    for (const [cid, pid] of selLoaded.entries()){
      if (pid) SELECTED_PARALLEL.set(cid, pid);
    }

    // Importante: no reconstruir SIM_ITEMS desde paralelos seleccionados.
    // El horario simulado solo muestra lo realmente guardado en SIM_ITEMS.

    document.dispatchEvent(new Event('courses:changed'));

    const labelEl = document.getElementById('simActiveSemLabel');
    if (labelEl) {
      const activeLabel = state.activeSemesterData?.label || state.activeSemesterId || '—';
      labelEl.textContent = activeLabel;
    }

    await renderSimGrid();
    renderSimPalette();

    requestAnimationFrame(() => {
      if (panel) panel.scrollTop = 0;
    });

    SIM_OPEN_SNAPSHOT = takeSimSnapshot();
    SIM_SAVED_FULL = SIM_OPEN_SNAPSHOT;
    SIM_DIRTY = false;
  }
  async function commitSimToRealSchedule(){
    if (!state.currentUser || !state.activeSemesterId){
      alert('Selecciona un semestre activo.');
      return;
    }
    const uid = state.currentUser.uid;
    const semId = state.activeSemesterId;
    const uni = getActiveUniCode() || 'UNI_desconocida';
    const slots = SIM_SLOTS || await getMySlots();
    if (!slots || !Array.isArray(slots) || !slots.length){
      alert('No hay slots para guardar la simulación.');
      return;
    }
    try{
      CUSTOM_SLOTS_MAP[uni] = slots;
      localStorage.setItem(`custom_slots_${uni}_${uid}`, JSON.stringify(slots));
      await saveCustomScheduleToFirestore(uni, slots);
    }catch(e){
      console.warn('No se pudo persistir slots base', e);
    }
    const coursesCol = collection(db,'users',uid,'semesters',semId,'courses');
    const schedCol   = collection(db,'users',uid,'semesters',semId,'schedule');
    const [coursesSnap, schedSnap] = await Promise.all([
      getDocs(query(coursesCol)),
      getDocs(query(schedCol)),
    ]);
    const existingCourses = coursesSnap.docs.map(d => ({ id:d.id, ...d.data() }));const existingSched   = schedSnap.docs.map(d => ({ id:d.id, ...d.data() }));const hasOldCourses = existingCourses.length > 0;
    let replaceAll = true;
    if (hasOldCourses){
      const wantsReplace = await askYesNo({
        title: 'Exportar simulación',
        text: 'Ya tienes ramos guardados en este semestre.\n\n¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?',
        yesText: 'Sí, borrar anteriores',
        noText: 'No, que convivan'
      });
      replaceAll = !!wantsReplace;
    }
    if (replaceAll){
      await deleteAllDocsInCollection(schedCol);
      await deleteAllDocsInCollection(coursesCol);
    }
    const baseCourses = replaceAll ? [] : existingCourses;
    const baseSched   = replaceAll ? [] : existingSched;
    const byCodeIds = new Map(); 
  for (const c of baseCourses){
    const code = normKey(c?.code || c?.codigo || '');
    if (!code) continue;
    if (!byCodeIds.has(code)) byCodeIds.set(code, new Set());
    byCodeIds.get(code).add(c.id);
  }
    const byName = new Map(); 
    for (const c of baseCourses){
      const nm = normKey(c?.name || c?.nombre || '');
      if (nm) byName.set(nm, c.id);
    }
    const idMap = new Map(); 
    const locals = (SIM_COURSES || []).filter(c => String(c.id || '').startsWith('SIM_'));
    for (const c of locals){
      const data = {
        name: (c.name || '').trim() || 'Ramo',
        code: (c.code || '').trim() || '',
        professor: c.professor || '',
        section: c.section || '',
        color: isValidHex(c.color) ? c.color : '#3B82F6',
        asistencia: !!c.asistencia,
        createdAt: Date.now()
      };
      const newCode = normKey(data.code);
      if (!replaceAll && newCode && byCodeIds.has(newCode)){
    const idsToRemove = Array.from(byCodeIds.get(newCode) || []);
    if (idsToRemove.length){
      const snapOldSched = await getDocs(query(schedCol));
      const toDel = snapOldSched.docs.filter(d => idsToRemove.includes(d.data()?.courseId));
      for (const d of toDel) await deleteDoc(d.ref);
      for (const oldId of idsToRemove){
        await deleteDoc(doc(db,'users',uid,'semesters',semId,'courses', oldId));
        for (const [k,v] of byName.entries()){
          if (v === oldId) byName.delete(k);
        }
      }
    }
    byCodeIds.delete(newCode);
  }
      if (!replaceAll && !newCode){
        const nm = normKey(data.name);
        const reuseId = byName.get(nm);
        if (reuseId){
          idMap.set(c.id, reuseId);
          continue;
        }
      }
      const docRef = await addDoc(coursesCol, data);
      if (newCode){
    if (!byCodeIds.has(newCode)) byCodeIds.set(newCode, new Set());
    byCodeIds.get(newCode).add(docRef.id);
  }
      idMap.set(c.id, docRef.id);

      const nm = normKey(data.name);
      if (nm) byName.set(nm, docRef.id);
    }
    const afterCoursesSnap = await getDocs(query(coursesCol, orderBy('createdAt')));
    state.courses = afterCoursesSnap.docs.map(d => ({ id:d.id, ...d.data() }));
    document.dispatchEvent(new Event('courses:changed'));
    const schedKey = (it) => {
      const cid = String(it.courseId || '');
      const day = Number(it.day);
      const slot = Number(it.slot);
      const pos = String(it.pos || 'full');
      const hpos = String(it.hpos || 'single');
      const pid = String(it.pid || it.parallelPid || '');
      const dn = String(it.displayName || '').trim();
      const st = String(it.start || '');
      const en = String(it.end || '');
      return [cid, day, slot, pos, hpos, pid, dn, st, en].join('|');
    };
    const existingSchedKeys = new Set(
      (baseSched || []).map(s => schedKey({
        courseId: s.courseId,
        day: s.day,
        slot: s.slot,
        pos: s.pos,
        hpos: s.hpos,
        pid: s.parallelPid,
        displayName: s.displayName,
        start: s.start,
        end: s.end
      }))
    );
    for (const it of (SIM_ITEMS || [])){
      const realCourseId = idMap.get(it.courseId) || it.courseId;
      if (String(realCourseId).startsWith('SIM_')) continue;
      const defSlot = slots[it.slot];
      if (!defSlot || defSlot.lunch) continue;
      const record = {
        courseId: realCourseId,
        day: it.day,
        slot: it.slot,
        start: defSlot.start,
        end: defSlot.end,
        pos: it.pos || 'full',
        hpos: it.hpos || 'single',
        parallelPid: it.pid || it.parallelPid || null,
        displayName: (typeof it.displayName === 'string' && it.displayName.trim())
          ? it.displayName.trim()
          : null,
        createdAt: Date.now()
      };
      if (!replaceAll){
        const k = schedKey(record);
        if (existingSchedKeys.has(k)) continue;
        existingSchedKeys.add(k);
      }
      await addDoc(schedCol, record);
    }
  }
  function normKey(s){
    return String(s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  async function deleteAllDocsInCollection(colRef){
    const snap = await getDocs(colRef);
    for (const d of snap.docs) await deleteDoc(d.ref);
  }
  function saveSimAllLocal(){
    saveSimSlots(SIM_SLOTS);
    saveSimCourses(SIM_COURSES);
    saveSimItems();
    saveSimParallelDefs();
    saveSimSelectedParallels();
    SIM_OPEN_SNAPSHOT = takeSimSnapshot();
    SIM_SAVED_FULL = SIM_OPEN_SNAPSHOT;
    SIM_DIRTY = false;
  }
  function clearSimAllLocal(){
    try{ localStorage.removeItem(simSlotsKey()); }catch{}
    try{ localStorage.removeItem(simCoursesKey()); }catch{}
    try{ localStorage.removeItem(simDefsKey()); }catch{}
    try{ localStorage.removeItem(simSelectedKey()); }catch{}
    try{ localStorage.removeItem(getSimStorageKey()); }catch{}
    try{ localStorage.removeItem(simOrderKey()); }catch{} 
  }
