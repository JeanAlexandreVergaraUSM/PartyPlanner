// js/export.js
import { $, state } from './state.js';
import { db } from './firebase.js';
import {
  collection, doc, getDoc, getDocs, query, orderBy
} from 'firebase/firestore';
import { evaluateSafeExpression } from './security/safeExpression.js';

let exportDepsPromise = null;

async function loadExportDeps(){
  if (!exportDepsPromise) {
    exportDepsPromise = Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]).then(([html2canvasModule, jspdfModule]) => ({
      html2canvas: html2canvasModule.default || html2canvasModule,
      jsPDF: jspdfModule.jsPDF || jspdfModule.default
    }));
  }
  return exportDepsPromise;
}


// Helper: adjunta un listener solo una vez por botón/clave
function attachOnce(el, evt, fn, key) {
  if (!el) return;
  const flag = `bound_${key || evt}`;
  if (el.dataset[flag] === '1') return;
  el.addEventListener(evt, fn);
  el.dataset[flag] = '1';
}

function safeFilename(s) {
  return (s || '').replace(/[^\w\s.-]+/g, '').replace(/\s+/g, '_') || 'export';
}
function getSemLabel() { return state.activeSemesterData?.label || 'semestre'; }

async function nodeToCanvas(node, scale = 2) {
  const { html2canvas } = await loadExportDeps();
  const prev = node.style.backgroundColor;
  if (!prev) node.style.backgroundColor = getComputedStyle(document.body).backgroundColor || '#111';
  const canvas = await html2canvas(node, {
    scale, backgroundColor: null, useCORS: true, allowTaint: true,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  });
  if (!prev) node.style.backgroundColor = '';
  return canvas;
}

// 🔹 Exportar nodo a PNG
export async function exportNodeAsPNG(node, filenameBase) {
  try {
    const canvas = await nodeToCanvas(node, 2);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${safeFilename(filenameBase)}.png`;
    a.click();
  } catch (e) {
    console.error('[exportNodeAsPNG]', e);
  }
}

// 🔹 Exportar nodo a PDF
export async function exportNodeAsPDF(node, filenameBase) {
  try {
    const canvas = await nodeToCanvas(node, 2);
    const img = canvas.toDataURL('image/png');
    const pxW = canvas.width, pxH = canvas.height;
    const orientation = (pxW >= pxH) ? 'l' : 'p';
    const { jsPDF } = await loadExportDeps();
    const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageW / pxW, pageH / pxH);
    const imgW = pxW * ratio, imgH = pxH * ratio;
    pdf.addImage(img, 'PNG', (pageW - imgW) / 2, (pageH - imgH) / 2, imgW, imgH);
    pdf.save(`${safeFilename(filenameBase)}.pdf`);
  } catch (e) {
    console.error('[exportNodeAsPDF]', e);
  }
}

// === Vincula los botones de exportación ===
export function bindExportButtons() {
  // MALLA
  const mallaPNG = $('btn-export-malla-png');
  const mallaPDF = $('btn-export-malla-pdf');
  if (mallaPNG || mallaPDF) {
    const node = document.querySelector('#page-malla .malla-wrapper') || $('page-malla');
    const base = `malla_${getSemLabel()}`;
    attachOnce(mallaPNG, 'click', () => exportNodeAsPNG(node, base), 'malla_png');
    attachOnce(mallaPDF, 'click', () => exportNodeAsPDF(node, base), 'malla_pdf');
  }

  // HORARIO
  const horPNG = $('btn-export-horario-png');
  const horPDF = $('btn-export-horario-pdf');
  if (horPNG || horPDF) {
    const node =
      document.querySelector('#horarioCombinado:not(.hidden)') ||
      document.querySelector('#schedUSM') ||
      $('horarioPropio') ||
      $('page-horario');
    const base = `horario_${getSemLabel()}`;
    attachOnce(horPNG, 'click', () => exportNodeAsPNG(node, base), 'horario_png');
    attachOnce(horPDF, 'click', () => exportNodeAsPDF(node, base), 'horario_pdf');
  }
}

// --- helpers reutilizables ---
async function captureElement(el) {
  if (!el) throw new Error('No se encontró el elemento a exportar');
  const { html2canvas } = await loadExportDeps();
  return await html2canvas(el, { scale: 2 });
}

export async function exportGrades({ format = 'pdf' }) {
  const el = document.getElementById('coursesList');
  if (!el) throw new Error('No encontré el contenedor de notas');
  const canvas = await captureElement(el);
  if (format === 'png') downloadImage(canvas, 'notas.png');
  else await downloadPDF(canvas, 'notas.pdf');
  return { ok: true };
}

export async function exportSchedule({ format = 'pdf' }) {
  const el = document.getElementById('schedUSM');
  if (!el) throw new Error('No encontré el horario');
  const canvas = await captureElement(el);
  if (format === 'png') downloadImage(canvas, 'horario.png');
  else await downloadPDF(canvas, 'horario.pdf');
  return { ok: true };
}

export async function exportMalla({ format = 'pdf' }) {
  const el = document.querySelector('#page-malla .malla-wrapper');
  if (!el) throw new Error('No encontré la malla');
  const canvas = await captureElement(el);
  if (format === 'png') downloadImage(canvas, 'malla.png');
  else await downloadPDF(canvas, 'malla.pdf');
  return { ok: true };
}

function downloadImage(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function downloadPDF(canvas, filename) {
  const { jsPDF } = await loadExportDeps();
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

/* ============================================================
   EXPORTAR NOTAS MULTI-SEMESTRE A PDF
   ============================================================ */

function grxNormUni(raw=''){
  const s = String(raw || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim();

  if (!s) return '';
  if (s.includes('mayor') || s === 'umayor') return 'UMAYOR';
  if (s.includes('usm') || s.includes('utfsm') || s.includes('santa maria')) return 'USM';
  return s.toUpperCase();
}

function grxPrettyUni(code=''){
  if (code === 'UMAYOR') return 'Universidad Mayor';
  if (code === 'USM') return 'UTFSM';
  return code || 'Universidad';
}

function grxEsc(s=''){
  return String(s ?? '').replace(/[<>&"]/g, m => ({
    '<':'&lt;',
    '>':'&gt;',
    '&':'&amp;',
    '"':'&quot;'
  }[m]));
}

function grxNormalizeExpr(expr){
  return String(expr || '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

function grxAvg(...nums){
  const vals = nums.flat().map(Number).filter(v => Number.isFinite(v));
  if (!vals.length) return NaN;
  return vals.reduce((a,b)=>a+b,0) / vals.length;
}

function grxClamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

function grxTruncate(v, scale){
  if (!Number.isFinite(v)) return null;
  return scale === 'MAYOR'
    ? Math.trunc(v * 100) / 100
    : Math.trunc(v * 10) / 10;
}

function grxSafeEvalExpr(expr, vars = {}, fns = {}){
  const normalized = grxNormalizeExpr(expr);
  return evaluateSafeExpression(normalized, {
    variables: vars,
    functions: fns,
    unknownIdentifierValue: 0
  });
}


function grxNormStr(s=''){
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim();
}

async function grxLoadSemesters(){
  const uid = state.currentUser?.uid;
  if (!uid) return [];

  const ref = collection(db, 'users', uid, 'semesters');
  const snap = await getDocs(ref);

  const out = snap.docs.map(d => {
    const data = d.data() || {};
    const uniRaw = data.universityAtThatTime || data.university || '';
    return {
      id: d.id,
      label: String(data.label || d.id).trim(),
      uni: grxNormUni(uniRaw),
      uniRaw
    };
  });

  out.sort(compareSemesterObjectsAsc);
  return out;
}

async function grxLoadAttendancePercent(uid, semId, courseId){
  try{
    const ref = collection(db, 'users', uid, 'semesters', semId, 'courses', courseId, 'attendance');
    const snap = await getDocs(ref);
    const rows = snap.docs.map(d => d.data() || {});
    const valid = rows.filter(x => !x.noClass);
    const ok = valid.filter(x => x.present || x.justified).length;
    return valid.length ? Math.round((ok / valid.length) * 100) : 0;
  }catch{
    return 0;
  }
}

async function grxLoadSemesterCourses(uid, semId){
  const ref = collection(db, 'users', uid, 'semesters', semId, 'courses');
  const snap = await getDocs(query(ref, orderBy('createdAt')));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
}

async function grxComputeSemesterReport(uid, sem){
  const courses = await grxLoadSemesterCourses(uid, sem.id);

  const rowsBase = await Promise.all(courses.map(async (c) => {
    const metaRef = doc(db, 'users', uid, 'semesters', sem.id, 'courses', c.id, 'grading', 'meta');
    const compsRef = collection(db, 'users', uid, 'semesters', sem.id, 'courses', c.id, 'grading', 'meta', 'components');

    const [metaSnap, compsSnap, attendancePercent] = await Promise.all([
      getDoc(metaRef),
      getDocs(compsRef),
      grxLoadAttendancePercent(uid, sem.id, c.id)
    ]);

    const meta = metaSnap.exists()
      ? (metaSnap.data() || {})
      : { scale:'USM', finalExpr:'', rulesText:'' };

    const comps = compsSnap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));

    const values = {};
    const min = meta.scale === 'MAYOR' ? 1 : 0;
    const max = meta.scale === 'MAYOR' ? 7 : 100;

    for (const k of comps){
      if (typeof k.score === 'number' && isFinite(k.score) && k.key){
        values[k.key] = grxClamp(k.score, min, max);
      }
    }

    values.Asistencia = attendancePercent;

    return {
      course: c,
      meta,
      comps,
      values,
      final: null
    };
  }));

  // primer pase
  for (const row of rowsBase){
    const formula = String(row.meta.finalExpr || '').trim();
    if (!formula) {
      row.final = null;
      continue;
    }

    try{
      const v = grxSafeEvalExpr(formula, row.values, {
        avg: grxAvg,
        min: Math.min,
        max: Math.max,
        final: () => NaN,
        finalCode: () => NaN,
        finalId: () => NaN
      });
      row.final = Number.isFinite(v) ? grxTruncate(v, row.meta.scale || 'USM') : null;
    }catch{
      row.final = null;
    }
  }

  const byName = {};
  const byCode = {};
  const byId = {};

  for (const row of rowsBase){
    const nameKey = grxNormStr(row.course.name);
    const codeKey = grxNormStr(row.course.code);
    if (nameKey) byName[nameKey] = row.final;
    if (codeKey) byCode[codeKey] = row.final;
    byId[row.course.id] = row.final;
  }

  // segundo pase
  for (const row of rowsBase){
    const formula = String(row.meta.finalExpr || '').trim();
    if (!formula) {
      row.final = null;
      continue;
    }

    try{
      const v = grxSafeEvalExpr(formula, row.values, {
        avg: grxAvg,
        min: Math.min,
        max: Math.max,
        final: (name) => byName[grxNormStr(name)] ?? NaN,
        finalCode: (code) => byCode[grxNormStr(code)] ?? NaN,
        finalId: (id) => byId[id] ?? NaN
      });
      row.final = Number.isFinite(v) ? grxTruncate(v, row.meta.scale || 'USM') : null;
    }catch{
      row.final = null;
    }
  }

  return {
    semester: sem,
    courses: rowsBase.map(row => ({
      id: row.course.id,
      name: row.course.name || 'Ramo',
      code: row.course.code || '—',
      professor: row.course.professor || '—',
      section: row.course.section || '—',
      final: row.final,
      finalText: row.final == null ? 'Pendiente' : String(row.final)
    }))
  };
}

function grxEnsurePdfModal(){
  if (document.getElementById('grxPdfModal')) return;

  const wrap = document.createElement('div');
  wrap.id = 'grxPdfModal';
  wrap.className = 'modal';
  wrap.innerHTML = `
    <div class="modal-backdrop" id="grxPdfBackdrop"></div>
    <div class="pdf-export-modal">
      <div class="pdf-export-header">
        <div>
          <h3 class="pdf-export-title">Exportar notas por PDF</h3>
          <p class="pdf-export-subtitle">
            Selecciona la universidad y los semestres que quieres incluir en tu respaldo.
          </p>
        </div>
      </div>

      <div class="pdf-export-body">
        <div class="pdf-export-field">
          <label class="pdf-export-label" for="grxUniSel">Universidad</label>
          <select id="grxUniSel" class="pdf-export-select"></select>
        </div>

        <div class="pdf-export-field">
          <div class="pdf-export-row">
            <label class="pdf-export-label" style="margin:0;">Semestres</label>
            <button type="button" class="pdf-export-secondary" id="grxToggleAll">
              Seleccionar todos
            </button>
          </div>

          <div id="grxSemList" class="pdf-export-semesters"></div>
        </div>
      </div>

      <div class="pdf-export-footer">
        <button class="pdf-export-cancel" id="grxPdfCancel" type="button">Cancelar</button>
        <button class="pdf-export-confirm" id="grxPdfExport" type="button">Exportar PDF</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrap);

  const close = () => wrap.classList.remove('active');
  document.getElementById('grxPdfBackdrop')?.addEventListener('click', close);
  document.getElementById('grxPdfCancel')?.addEventListener('click', close);
}

function grxRenderSemesterChecks(items){
  const host = document.getElementById('grxSemList');
  if (!host) return;

  if (!items.length){
    host.innerHTML = `<div class="muted">No hay semestres para esa universidad.</div>`;
    return;
  }

  const sorted = [...items].sort(compareSemesterObjectsAsc);

  host.innerHTML = sorted.map(s => `
    <label class="pdf-sem-item">
      <input type="checkbox" class="grx-sem-check" value="${grxEsc(s.id)}" />
      <span>${grxEsc(s.label)}</span>
    </label>
  `).join('');
}

function grxBuildFilename(uni, semesters){
  const semPart = semesters.map(s => s.label).join('_').replace(/[^\w\-]+/g,'_');
  return `notas_${uni}_${semPart || 'semestres'}.pdf`;
}

function grxNeedNewPage(pdf, y, needed, pageHeight){
  if (y + needed <= pageHeight - 44) return y;
  pdf.addPage();
  return 44;
}

function grxDrawSemesterBlock(pdf, report, startY){
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - 88;
  let y = startY;

  y = grxNeedNewPage(pdf, y, 42, pageHeight);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.text(`Semestre ${report.semester.label}`, 44, y);
  y += 12;

  pdf.setDrawColor(190, 190, 210);
  pdf.line(44, y, pageWidth - 44, y);
  y += 18;

  if (!report.courses.length){
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text('Sin ramos registrados.', 44, y);
    return y + 22;
  }

  for (const c of report.courses){
    const lines = [
      `Ramo: ${c.name}`,
      `Código: ${c.code}`,
      `Paralelo: ${c.section}`,
      `Profesor: ${c.professor}`,
      `Promedio final: ${c.finalText}`
    ];

    const wrapped = lines.flatMap(line => pdf.splitTextToSize(line, contentWidth));
    const blockHeight = Math.max(52, wrapped.length * 14 + 18);

    y = grxNeedNewPage(pdf, y, blockHeight, pageHeight);

    pdf.setFillColor(245, 247, 255);
    pdf.roundedRect(44, y - 12, contentWidth, blockHeight, 8, 8, 'F');

    pdf.setTextColor(20, 20, 35);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    let ly = y + 4;
    wrapped.forEach(line => {
      pdf.text(line, 56, ly);
      ly += 14;
    });

    y += blockHeight + 10;
  }

  return y + 6;
}

async function grxGeneratePdf(universityCode, semesterReports){
  const { jsPDF } = await loadExportDeps();
  const pdf = new jsPDF({ unit:'pt', format:'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(19);
  pdf.text('Reporte de notas', 44, 52);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`Universidad: ${grxPrettyUni(universityCode)}`, 44, 74);
  pdf.text(`Generado: ${new Date().toLocaleString()}`, 44, 90);

  let y = 122;

  for (const report of semesterReports){
    y = grxDrawSemesterBlock(pdf, report, y);
  }

  const fileName = grxBuildFilename(universityCode, semesterReports.map(r => r.semester));
  pdf.save(fileName);
}

function parseSemesterLabel(label = '') {
  const txt = String(label || '').trim();

  // Espera formato tipo 2025-1, 2025-2
  const m = txt.match(/^(\d{4})\s*-\s*(\d+)$/);
  if (!m) {
    return { year: 0, term: 0, raw: txt };
  }

  return {
    year: Number(m[1]) || 0,
    term: Number(m[2]) || 0,
    raw: txt
  };
}

function compareSemesterLabelsAsc(a, b) {
  const sa = parseSemesterLabel(a);
  const sb = parseSemesterLabel(b);

  if (sa.year !== sb.year) return sa.year - sb.year;
  if (sa.term !== sb.term) return sa.term - sb.term;

  return String(sa.raw).localeCompare(String(sb.raw), 'es');
}

function compareSemesterObjectsAsc(a, b) {
  return compareSemesterLabelsAsc(a?.label || '', b?.label || '');
}




export async function openGradesPdfExportModal(){
  if (!state.currentUser) {
    alert('Primero inicia sesión.');
    return;
  }

  grxEnsurePdfModal();

  const wrap = document.getElementById('grxPdfModal');
  const uniSel = document.getElementById('grxUniSel');
  const toggleAllBtn = document.getElementById('grxToggleAll');
  const exportBtn = document.getElementById('grxPdfExport');

  const semesters = await grxLoadSemesters();
  const uniList = [...new Set(semesters.map(s => s.uni).filter(Boolean))];

  if (!uniList.length){
    alert('No tienes semestres disponibles para exportar.');
    return;
  }

  uniSel.innerHTML = uniList.map(u => `
    <option value="${grxEsc(u)}">${grxPrettyUni(u)}</option>
  `).join('');

  const renderForSelectedUni = () => {
    const selectedUni = uniSel.value;
    const filtered = semesters.filter(s => s.uni === selectedUni);
    grxRenderSemesterChecks(filtered);
  };

  renderForSelectedUni();

  uniSel.onchange = renderForSelectedUni;

  toggleAllBtn.onclick = () => {
    const checks = Array.from(document.querySelectorAll('.grx-sem-check'));
    const allChecked = checks.length && checks.every(x => x.checked);
    checks.forEach(x => { x.checked = !allChecked; });
  };

  exportBtn.onclick = async () => {
    const selectedUni = uniSel.value;
    const ids = Array.from(document.querySelectorAll('.grx-sem-check:checked')).map(x => x.value);

    if (!ids.length){
      alert('Selecciona al menos un semestre.');
      return;
    }

    const selectedSemesters = semesters
  .filter(s => ids.includes(s.id))
  .sort(compareSemesterObjectsAsc);

    exportBtn.disabled = true;
    exportBtn.textContent = 'Exportando...';

    try {
      const reports = [];
      for (const sem of selectedSemesters){
        reports.push(await grxComputeSemesterReport(state.currentUser.uid, sem));
      }

      await grxGeneratePdf(selectedUni, reports);
      wrap.classList.remove('active');
    } catch (err) {
      console.error(err);
      alert('No se pudo generar el PDF de notas.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Exportar PDF';
    }
  };

  wrap.classList.add('active');
}
