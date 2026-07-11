// js/profile.js
import { db, persistentCacheEnabled, updateTrustedDevicePreference, clearLocalFirestoreCache } from './firebase.js';
import { doc, onSnapshot, updateDoc,setDoc } from 'firebase/firestore';
import { $, state, updateDebug } from './state.js';
import { safeImageDataUrl, setLabeledText } from './security/html.js';

let unsubProfile = null; // 👈 NUEVO

export function stopProfileListener(){
  if (unsubProfile) { unsubProfile(); unsubProfile = null; }
  state.unsubscribeProfile = null;
}



// 🔁 NUEVOS helpers de fecha
function parseStoredBirthdayToPickerValue(stored){
  if (!stored) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(stored)) return stored;
  const m = /^(\d{2})-(\d{2})$/.exec(stored);
  if (m) { const dd = m[1], mm = m[2]; return `2000-${mm}-${dd}`; }
  return '';
}

// ── Avatar helpers ─────────────────────────────
async function readFileAsImage(file){
  const dataUrl = await new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = ()=> res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
  const img = await new Promise((res, rej)=>{
    const im = new Image();
    im.onload = ()=> res(im);
    im.onerror = rej;
    im.src = dataUrl;
  });
  return img;
}
function drawCompressed(img, target=256, quality=0.82){
  const canvas = document.createElement('canvas');
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size)/2;
  const sy = (img.height - size)/2;
  canvas.width = target; canvas.height = target;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, size, size, 0, 0, target, target);
  return canvas.toDataURL('image/jpeg', quality);
}
function renderAvatarInCircle(dataUrl){
  const circle = document.getElementById('pfAvatarCircle');
  if (!circle) return;

  if (dataUrl && !dataUrl.startsWith("emoji:")) {
    circle.textContent = '';
    circle.style.backgroundImage = `url("${dataUrl}")`;
  } else {
    circle.style.backgroundImage = 'none';
    // si es emoji o vacío → muestra el 👨‍🎓
    circle.textContent = '👨‍🎓';
  }
}


function normalizePickerToIso(valueFromPicker, prevStored){
  if (valueFromPicker && /^\d{4}-\d{2}-\d{2}$/.test(valueFromPicker)) {
    return valueFromPicker;
  }
  const m = /^(\d{2})-(\d{2})$/.exec(prevStored || '');
  if (m) { const dd = m[1], mm = m[2]; return `2000-${mm}-${dd}`; }
  return null;
}

/* ================= Opciones de Carrera por Universidad ================= */
let unsubPartner = null;

const CAREERS_BY_UNI = {
  UMAYOR: [{ value: 'MEDVET', label: 'Medicina Veterinaria' }],
  USM:    [{ value: 'ICTEL',  label: 'Ing. Civil Telemática' }],
};

function setOtherOptionLabel(selectEl, baseLabel, customText) {
  if (!selectEl) return;
  const opt = selectEl.querySelector('option[value="OTRA"]');
  if (!opt) return;
  opt.textContent = (customText && customText.trim())
    ? `${baseLabel}: ${customText.trim()}`
    : baseLabel;
}

/* ================= Listeners ================= */
export function listenProfile(){
  if (unsubProfile) { unsubProfile(); unsubProfile = null; }

  const uid = state.currentUser?.uid;
  if (!uid) return;

  const refRoot = doc(db,'users', uid);
  const refProf = doc(db,'users', uid, 'profile', 'profile');

  // escucha root y subdoc a la vez
  const mergeAndFill = (rootSnap, profSnap) => {
    const root = rootSnap?.data() || {};
    const prof = profSnap?.data() || {};
    // el subdoc (prof) tiene prioridad sobre el root
state.profileData = {
  ...root,
  ...prof,
  name:
    (prof && "name" in prof ? prof.name : root?.name) ||
    root?.fullName ||
    prof?.fullName ||
    ""
};
delete state.profileData.fullName; // 🔹 fuerza a ignorar el campo viejo


// si ambos tienen nombre, elige el más nuevo o el no vacío
if (root?.name && !state.profileData.name) state.profileData.name = root.name;
if (root?.fullName && !state.profileData.name) state.profileData.name = root.fullName;
if (prof?.name) state.profileData.name = prof.name;
if (prof?.fullName) state.profileData.name = prof.fullName;


    fillProfileForm(state.profileData);
    reflectProfileInSemestersUI();
    updateDebug();
    document.dispatchEvent(new Event('profile:changed'));
  };

  let latestRoot = null, latestProf = null;

  const unsubRoot = onSnapshot(refRoot, (snap)=>{
    latestRoot = snap;
    mergeAndFill(latestRoot, latestProf);
  });
  const unsubProf = onSnapshot(refProf, (snap)=>{
    latestProf = snap;
    mergeAndFill(latestRoot, latestProf);
  });

  unsubProfile = ()=>{ unsubRoot(); unsubProf(); };
  state.unsubscribeProfile = unsubProfile;
}



export function clearProfileUI(){
  const set = (id, val='') => { const el = $(id); if (el) el.value = val; };

  set('pfName');
  set('pfGoogleEmail');    // 👈 borra el correo visible
  set('pfBirthday');
  set('pfFavoriteColor', '#22c55e');
  const prev = $('pfColorPreview'); if (prev) prev.style.background = '#22c55e';
  const code = $('pfColorCode');    if (code) code.textContent = '#22C55E';

  const uni = $('pfUniversity') || $('uniSel'); if (uni) uni.value = '';
  const car = $('pfCareer') || $('careerSel');  if (car) { car.value = ''; car.disabled = true; }

  set('pfEmailUni');
  set('pfPhone');

  // resetea avatar
  renderAvatarInCircle(null);

  // quita “dirty” del date para que vuelva a obedecer al servidor
  const bInp = $('pfBirthday'); if (bInp) delete bInp.dataset?.dirty;
}


/* ================= UI ================= */
export function fillProfileForm(d){
  const pfName = $('pfName');
  // 🔒 Marca como "dirty" cuando el usuario escribe
if (pfName && !pfName.dataset.bound) {
  pfName.addEventListener('input', () => {
    pfName.dataset.dirty = '1';
  });
  pfName.dataset.bound = '1';
}

  const pfBirthday = $('pfBirthday');
  if (pfBirthday && !pfBirthday.dataset.inputGuardBound) {
    pfBirthday.addEventListener('keydown', e => e.preventDefault());
    pfBirthday.addEventListener('paste', e => e.preventDefault());
    pfBirthday.dataset.inputGuardBound = '1';
  }
  const pfUniversity = $('pfUniversity') || $('uniSel');   // soporta tu HTML
  const pfCustomUniWrap = $('pfCustomUniWrap');            // puede no existir (OK)
  const pfCustomUniversity = $('pfCustomUniversity');      // puede no existir (OK)
  if (pfCustomUniversity && !pfCustomUniversity.dataset.bound) {
  pfCustomUniversity.addEventListener('input', () => {
    pfCustomUniversity.dataset.dirty = '1';
  });
  pfCustomUniversity.dataset.bound = '1';
}

  const pfCareer = $('pfCareer') || $('careerSel');        // soporta tu HTML
  
  const pfFavoriteColor = $('pfFavoriteColor');
  const colorPrev = $('pfColorPreview');
  const colorCode = $('pfColorCode');
  const pfEmailUni = $('pfEmailUni') || $('pfEmail');
  if (pfEmailUni && !pfEmailUni.dataset.bound) {
  pfEmailUni.addEventListener('input', () => {
    pfEmailUni.dataset.dirty = '1';
  });
  pfEmailUni.dataset.bound = '1';
}

  const pfPhone    = $('pfPhone')    || $('pfTelefono');
  if (pfPhone && !pfPhone.dataset.bound) {
  pfPhone.addEventListener('input', () => {
    pfPhone.dataset.dirty = '1';
  });
  pfPhone.dataset.bound = '1';
}

  const pfGoogleEmail = $('pfGoogleEmail');
  const cancelBtn = $('pfCancelBtn');
  const populateCareers = (uni, selected) => {
  if (!pfCareer) return;

  // 🔥 LIMPIEZA TOTAL
  pfCareer.innerHTML = '<option value="">Selecciona tu carrera…</option>';

  const list = CAREERS_BY_UNI[uni] || [];

  for (const { value, label } of list) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    pfCareer.appendChild(opt);
  }

  // siempre agrega "Otra"
  const optOther = document.createElement('option');
  optOther.value = 'OTRA';
  optOther.textContent = 'Otra';
  pfCareer.appendChild(optOther);

  pfCareer.disabled = false;

  if (selected && pfCareer.querySelector(`option[value="${selected}"]`)) {
    pfCareer.value = selected;
  } else {
    pfCareer.value = '';
  }
  setOtherOptionLabel(pfCareer, 'Otra', d?.customCareer);
};


if (cancelBtn && !cancelBtn.dataset.bound) {
  cancelBtn.onclick = () => {
    const snap = state.profileData || null;

    // agarra los selects reales (sean pfUniversity/pfCareer o uniSel/careerSel)
    const uniEl = $('pfUniversity') || $('uniSel');
    const carEl = $('pfCareer') || $('careerSel');

    // 1) limpiar dirty (directo a los elementos reales)
    [
      $('pfName'),
      $('pfBirthday'),
      $('pfFavoriteColor'),
      ($('pfEmailUni') || $('pfEmail')),
      ($('pfPhone') || $('pfTelefono')),
      $('pfCustomUniversity'),
      $('pfCustomCareer'),
      uniEl,
      carEl
    ].forEach(el => { if (el) delete el.dataset.dirty; });

    // 2) FORZAR repintado de Universidad + Carrera (sin depender de dirty)
    if (uniEl) {
      const u = snap?.university || '';
      // compat con valores viejos guardados como texto
      if (u === 'Universidad Mayor') uniEl.value = 'UMAYOR';
      else if (u === 'UTFSM' || u === 'USM') uniEl.value = 'USM';
      else uniEl.value = u || '';

      // si lo guardado era OTRA, mantenlo en OTRA (y el texto va en el input)
      if (u === 'OTRA') uniEl.value = 'OTRA';
    }

    if (carEl) {
      // reconstruye opciones según la universidad ya seteada
      populateCareers(uniEl?.value || '', snap?.career || null);

      // si era OTRA, selecciona OTRA
      if (snap?.career === 'OTRA') carEl.value = 'OTRA';
    }

    // 3) cerrar inputs "OTRA" (y rellenarlos con lo guardado)
    $('pfCustomUniWrap')?.classList.toggle('hidden', uniEl?.value !== 'OTRA');
    if (uniEl?.value === 'OTRA' && $('pfCustomUniversity')) {
      $('pfCustomUniversity').value = snap?.customUniversity || '';
    }

    $('pfCustomCareerWrap')?.classList.toggle('hidden', carEl?.value !== 'OTRA');
    if (carEl?.value === 'OTRA' && $('pfCustomCareer')) {
      $('pfCustomCareer').value = snap?.customCareer || '';
    }

    // 4) ahora sí, repinta el resto normal
    fillProfileForm(snap);
  };

  cancelBtn.dataset.bound = '1';
}



  if (pfGoogleEmail && state.currentUser?.email) {
    pfGoogleEmail.value = state.currentUser.email;
  }

  if (pfEmailUni) {
  const isEditing = document.activeElement === pfEmailUni;
  const isDirty = pfEmailUni.dataset.dirty === '1';
  if (!isEditing && !isDirty) {
    pfEmailUni.value = d?.uniEmail || '';
  }
}

 if (pfPhone) {
  const isEditing = document.activeElement === pfPhone;
  const isDirty = pfPhone.dataset.dirty === '1';
  if (!isEditing && !isDirty) {
    pfPhone.value = d?.phone || '';
  }
}


  if (pfName) {
  const isEditing = document.activeElement === pfName;
  const isDirty = pfName.dataset.dirty === '1';

  if (!isEditing && !isDirty) {
    pfName.value = d?.fullName || d?.name || '';
  }
}



if (pfBirthday) {
  const serverVal = parseStoredBirthdayToPickerValue(d?.birthday || '');

  const isEditing = (document.activeElement === pfBirthday);
  const isDirty   = pfBirthday.dataset.dirty === '1';

  if (!isEditing && !isDirty) {
    pfBirthday.value = serverVal || '';
    if (serverVal) pfBirthday.setAttribute('value', serverVal);
    else pfBirthday.removeAttribute('value');
  }

  if (!pfBirthday.dataset.bound) {
    pfBirthday.addEventListener('change', (e) => {
      const v = e.target.value || '';
      pfBirthday.dataset.dirty = '1';
      pfBirthday.value = v;                    // propiedad
      if (v) pfBirthday.setAttribute('value', v); else pfBirthday.removeAttribute('value'); // atributo
      // espejo local para que un repintado inmediato no lo borre
      state.profileData = { ...(state.profileData || {}), birthday: v };

    });

    // opcionales
    pfBirthday.addEventListener('paste',  (e) => e.preventDefault());
    pfBirthday.addEventListener('drop',   (e) => e.preventDefault());

    pfBirthday.dataset.bound = '1';
  }
}


  // CAMBIO: null-safe
  if (pfUniversity) {
  const isEditing = document.activeElement === pfUniversity;
  const isDirty = pfUniversity.dataset.dirty === '1';

  if (!isEditing && !isDirty) {
    const uni = d?.university || '';
    if (uni === 'Universidad Mayor') pfUniversity.value = 'UMAYOR';
    else if (uni === 'UTFSM' || uni === 'USM') pfUniversity.value = 'USM';
    else pfUniversity.value = uni;
    setOtherOptionLabel(pfUniversity, 'Otra', d?.customUniversity);
  }
  // ✅ Asegura que el select de carrera corresponda a la universidad actual
if (pfUniversity && pfCareer) {
  const isEditingCar = document.activeElement === pfCareer;
  const isDirtyCar   = pfCareer.dataset.dirty === '1';
  if (!isEditingCar && !isDirtyCar) {
    populateCareers(pfUniversity.value, d?.career || null);
    setOtherOptionLabel(pfCareer, 'Otra', d?.customCareer);
  }
}

}
if (pfUniversity && !pfUniversity.dataset.bound) {
  pfUniversity.addEventListener('change', () => {
    pfUniversity.dataset.dirty = '1';
  });
  pfUniversity.dataset.bound = '1';
}




  // ⚙️ Inicia oculto y solo muestra si la uni es "OTRA"
  if (pfCustomUniWrap) pfCustomUniWrap.classList.add('hidden');
  if (pfCustomUniversity) pfCustomUniversity.value = '';

  const showCustom = (pfUniversity?.value === 'OTRA');
  if (pfCustomUniWrap) pfCustomUniWrap.classList.toggle('hidden', !showCustom);
  if (showCustom && pfCustomUniversity) {
    if (pfCustomUniversity) {
  const isEditing = document.activeElement === pfCustomUniversity;
  const isDirty = pfCustomUniversity.dataset.dirty === '1';
  if (!isEditing && !isDirty) {
    pfCustomUniversity.value = d?.customUniversity || '';
  }
}

  }

    // ⚙️ Ocultar/mostrar campo personalizado de carrera
  const pfCustomCareerWrap = $('pfCustomCareerWrap');    // div contenedor (opcional)
  const pfCustomCareer = $('pfCustomCareer');            // input de texto
  if (pfCustomCareer && !pfCustomCareer.dataset.bound) {
  pfCustomCareer.addEventListener('input', () => {
    pfCustomCareer.dataset.dirty = '1';
  });
  pfCustomCareer.dataset.bound = '1';
}


  if (pfCustomCareerWrap) pfCustomCareerWrap.classList.add('hidden');
  if (pfCustomCareer) pfCustomCareer.value = '';

  const showCareerCustom = (pfCareer?.value === 'OTRA');
  if (pfCustomCareerWrap) pfCustomCareerWrap.classList.toggle('hidden', !showCareerCustom);
  if (showCareerCustom && pfCustomCareer) {
    if (pfCustomCareer) {
  const isEditing = document.activeElement === pfCustomCareer;
  const isDirty = pfCustomCareer.dataset.dirty === '1';
  if (!isEditing && !isDirty) {
    pfCustomCareer.value = d?.customCareer || '';
  }
}

  }

  // Listener: si cambia a "OTRA", mostrar input
  if (pfCareer && !pfCareer.dataset.bound) {
  pfCareer.addEventListener('change', () => {
    pfCareer.dataset.dirty = '1'; // ✅ marca dirty

    const show = (pfCareer.value === 'OTRA');
    if (pfCustomCareerWrap) pfCustomCareerWrap.classList.toggle('hidden', !show);
    if (!show && pfCustomCareer) pfCustomCareer.value = '';
  });
  pfCareer.dataset.bound = '1';
}



  // Color favorito (con fallback + preview)
  if (pfFavoriteColor) {
  const isEditing = document.activeElement === pfFavoriteColor;
  const isDirty = pfFavoriteColor.dataset.dirty === '1';

  if (!isEditing && !isDirty) {
    const startColor = isValidHex(d?.favoriteColor)
      ? d.favoriteColor
      : '#22c55e';

    pfFavoriteColor.value = startColor;
    if (colorPrev) colorPrev.style.background = startColor;
    if (colorCode) colorCode.textContent = startColor.toUpperCase();
  }
}


  // CAMBIO: usar .onchange (no addEventListener) y null-safe
  if (pfUniversity) {
    pfUniversity.onchange = ()=>{
      const show = (pfUniversity.value === 'OTRA');
      if (pfCustomUniWrap) pfCustomUniWrap.classList.toggle('hidden', !show);
      if (!show && pfCustomUniversity) pfCustomUniversity.value = '';
      populateCareers(pfUniversity.value, null);
    };
  }

// ✅ Solo usar customCareer si la carrera guardada es OTRA
if (pfCareer && d?.career === 'OTRA' && d?.customCareer) {
  const isEditing = document.activeElement === pfCareer;
  const isDirty   = pfCareer.dataset.dirty === '1';
  if (!isEditing && !isDirty) {
    pfCareer.value = 'OTRA';
  }
}



 if (pfFavoriteColor) {
  const isEditing = document.activeElement === pfFavoriteColor;
  const isDirty = pfFavoriteColor.dataset.dirty === '1';

  if (!isEditing && !isDirty) {
    const startColor = isValidHex(d?.favoriteColor)
      ? d.favoriteColor
      : '#22c55e';

    pfFavoriteColor.value = startColor;
    if (colorPrev) colorPrev.style.background = startColor;
    if (colorCode) colorCode.textContent = startColor.toUpperCase();
  }
}

if (pfFavoriteColor && !pfFavoriteColor.dataset.bound) {
  pfFavoriteColor.addEventListener('input', (e) => {
    const val = e.target.value;
    pfFavoriteColor.dataset.dirty = '1';

    if (isValidHex(val)) {
      if (colorPrev) colorPrev.style.background = val;
      if (colorCode) colorCode.textContent = val.toUpperCase();
    }
  });

  pfFavoriteColor.dataset.bound = '1';
}

const btnAvatar  = $('pfAvatarBtn');
const fileAvatar = $('pfAvatarFile');

// Renderizar avatar inicial (foto o emoji 👨‍🎓)
renderAvatarInCircle(d?.avatarData || "emoji:👨‍🎓");

// Crear o buscar botón de eliminar
let btnDelete = document.getElementById("pfDeleteAvatarBtn");
if (!btnDelete) {
  btnDelete = document.createElement("button");
  btnDelete.id = "pfDeleteAvatarBtn";
  btnDelete.className = "btn btn-secondary";
  btnDelete.textContent = "Eliminar foto de perfil";
  btnAvatar.insertAdjacentElement("afterend", btnDelete);
}

// Acciones
if (fileAvatar && !fileAvatar.dataset.bound) {
  fileAvatar.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      alert("Elige una imagen válida.");
      return;
    }

    try {
      const img = await readFileAsImage(f);
      const dataUrl = drawCompressed(img, 256, 0.82);
      renderAvatarInCircle(dataUrl);

      if (!state.currentUser) return;
      await updateDoc(doc(db, "users", state.currentUser.uid), {
        avatarData: dataUrl,
        avatarUpdatedAt: Date.now()
      });

      btnAvatar.textContent = "Avatar actualizado ✓";
      setTimeout(() => (btnAvatar.textContent = "Cambiar avatar"), 1500);
    } catch (err) {
      console.error(err);
      alert("No se pudo procesar la imagen.");
    } finally {
      e.target.value = "";
    }
  });
  fileAvatar.dataset.bound = "1";
}

// Acción para eliminar avatar y volver al emoji 👨‍🎓
if (!btnDelete.dataset.bound) {
  btnDelete.addEventListener("click", async () => {
    if (!state.currentUser) return;
    if (!confirm("¿Seguro que deseas eliminar tu foto de perfil?")) return;

    try {
      await updateDoc(doc(db, "users", state.currentUser.uid), {
        avatarData: null,
        avatarUrl: null,
        avatarUpdatedAt: Date.now()
      });

      renderAvatarInCircle("emoji:👨‍🎓");
      alert("Avatar eliminado. Se restauró el emoji predeterminado 👨‍🎓.");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el avatar.");
    }
  });
  btnDelete.dataset.bound = "1";
}





  if (fileAvatar && !fileAvatar.dataset.bound){
    fileAvatar.addEventListener('change', async (e)=>{
      const f = e.target.files?.[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) { alert('Elige una imagen.'); return; }

      try {
        const img = await readFileAsImage(f);
        const dataUrl = drawCompressed(img, 256, 0.82);
        renderAvatarInCircle(dataUrl);

        if (!state.currentUser) return;
        await updateDoc(doc(db,'users',state.currentUser.uid), {
          avatarData: dataUrl,
          avatarUpdatedAt: Date.now()
        });

        if (btnAvatar){
          btnAvatar.textContent = 'Avatar actualizado ✓';
          setTimeout(()=> btnAvatar.textContent = 'Cambiar avatar', 1500);
        }
      } catch (err){
        console.error(err);
        alert('No se pudo procesar la imagen.');
      } finally {
        e.target.value = '';
      }
    });
    fileAvatar.dataset.bound = '1';
  }

  // CAMBIO: evita re-asignar onClick del botón Guardar en cada snapshot
  const saveBtn = $('pfSaveBtn');
  if (saveBtn && !saveBtn.dataset.bound){
    saveBtn.onclick = ()=> saveProfile();
    saveBtn.dataset.bound = '1';
  }
}

function calcAge(iso){
  if (!iso) return null;
  const b = new Date(iso); if (isNaN(b)) return null;
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

/* ================= Persistencia ================= */
export async function saveProfile(){
  if (!state.currentUser) return;

  const uniEl = $('pfUniversity') || $('uniSel');
  const careerSel = $('pfCareer') || $('careerSel');
  const uniRaw = (uniEl?.value || '').trim() || null;
const isKnownUni = uniRaw && ['UMAYOR','USM','OTRA'].includes(uniRaw);

// inputs opcionales (según tu HTML)
const customUniInput = ($('pfCustomUniversity') || $('uniCustom') || null);
const customUniTyped = (customUniInput?.value || '').trim() || null;

// ✅ Guardado correcto:
// - si select trae un texto (uni custom agregada como option) => OTRA + customUniversity=texto
// - si select es OTRA => mantener customUniversity desde input o desde lo ya guardado
const uniStored = (!uniRaw) ? null : (isKnownUni ? uniRaw : 'OTRA');

let customUniStored = null;
if (!uniRaw) {
  customUniStored = null;
} else if (!isKnownUni) {
  customUniStored = uniRaw; // option custom agregada al select
} else if (uniRaw === 'OTRA') {
  customUniStored = customUniTyped || state.profileData?.customUniversity || null;
}


  const carRaw = (careerSel?.value || '').trim() || null;
const isKnownCar = carRaw && ['MEDVET','ICTEL','OTRA'].includes(carRaw);

const customCarInput = ($('pfCustomCareer') || $('careerCustom') || null);
const customCarTyped = (customCarInput?.value || '').trim() || null;

const carStored = (!carRaw) ? null : (isKnownCar ? carRaw : 'OTRA');

let customCarStored = null;
if (!carRaw) {
  customCarStored = null;
} else if (!isKnownCar) {
  customCarStored = carRaw; // option custom agregada al select
} else if (carRaw === 'OTRA') {
  customCarStored = customCarTyped || state.profileData?.customCareer || null;
}

  const favCol = $('pfFavoriteColor')?.value || null;
  const rawEmailUni = ( ($('pfEmailUni') || $('pfEmail'))?.value || '' ).trim();
  const rawPhone    = ( ($('pfPhone')    || $('pfTelefono'))?.value || '' ).trim();
  const uid = state.currentUser.uid;
  const uni = uniEl?.value || null;

  const emailOk = !rawEmailUni || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmailUni);
  if (!emailOk) { alert('Email universitario no es válido.'); return; }

  const phoneOk = !rawPhone || /^[+()\s0-9-]{6,}$/.test(rawPhone);
  if (!phoneOk) { alert('Teléfono no es válido.'); return; }

  const careerVal = (careerSel && CAREERS_BY_UNI[uni]?.some(x => x.value === careerSel.value))
    ? careerSel.value
    : null;

  const rawBdayIso = $('pfBirthday')?.value || null;
  const prevStored = state.profileData?.birthday || null;
  const safeBdayIso = normalizePickerToIso(rawBdayIso, prevStored);
  const typedName = $('pfName')?.value.trim() || null;

  const payload = {
    name: typedName,
    birthday: safeBdayIso ?? null,

    university: uniStored,
    customUniversity: customUniStored,

    career: carStored,
    customCareer: customCarStored,

    favoriteColor: isValidHex(favCol) ? favCol : null,
    uniEmail: rawEmailUni || null,
    phone: rawPhone || null,
    updatedAt: Date.now()
  };





  // Guarda también en subdoc profile/profile
  const profRef = doc(db,'users',uid,'profile','profile');
  await setDoc(profRef, payload, { merge:true });

  // 🔹 Reflejo inmediato en el frontend
  state.profileData = { ...(state.profileData || {}), ...payload };

  const btn = document.getElementById('pfSaveBtn');
  if (btn) {
    const old = btn.textContent;
    btn.textContent = 'Guardado ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = old;
      btn.disabled = false;
    }, 1800);
  }

  // Limpia "dirty" del date
  const bInp = document.getElementById('pfBirthday');
  if (bInp) delete bInp.dataset.dirty;


const nameInp = $('pfName');
if (nameInp) delete nameInp.dataset.dirty;
// 🔹 Limpia dirty del resto de campos al guardar
['pfEmailUni','pfPhone','pfCustomUniversity','pfCustomCareer']
  .forEach(id => {
    const el = $(id);
    if (el) delete el.dataset.dirty;
  });


}


export function reflectProfileInSemestersUI(){
  const hasUni = !!(state.profileData && state.profileData.university &&
    (state.profileData.university !== 'OTRA' ||
     (state.profileData.university === 'OTRA' && state.profileData.customUniversity?.trim())));

  $('semNoticeNoUni')?.classList.toggle('hidden', hasUni);
  if ($('createSemesterBtn')) $('createSemesterBtn').disabled = !hasUni || !state.currentUser;
  if ($('semesterLabel')) $('semesterLabel').disabled = !hasUni;
  if ($('semesterUniFromProfile')) $('semesterUniFromProfile').value = hasUni ? readableUni(state.profileData) : '';
  if ($('createPairBtn')) $('createPairBtn').disabled = !state.currentUser;
}


/* ================= Helpers ================= */
function readableUni(d){
  if (!d || !d.university) return '';
  if (d.university === 'OTRA') return d.customUniversity || 'Otra';
  if (d.university === 'UMAYOR') return 'Universidad Mayor';
  if (d.university === 'USM') return 'UTFSM';
  return d.university;
}

function readableCareer(d){
  if (!d || !d.career) return '';
  if (d.career === 'OTRA') return d.customCareer || 'Otra';
  if (d.career === 'ICTEL') return 'Ing. Civil Telemática';
  if (d.career === 'MEDVET') return 'Medicina Veterinaria';
  return d.career;
}


function isValidHex(s){ return typeof s === 'string' && /^#[0-9A-Fa-f]{6}$/.test(s); }
function formatDateDMY(iso){
  if (!iso) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

// ================= Partner card =================
export function mountPartnerProfileCard() {
  const hostPage = $('page-perfil');
  if (!hostPage) return;

  let card = $('partnerProfileCard');
  if (!card) {
    card = document.createElement('div');
    card.className = 'card';
    card.id = 'partnerProfileCard';
    card.innerHTML = `
      <h3 style="margin-top:0">Perfil de la otra persona</h3>
      <div id="pp-avatar" style="width:64px;height:64px;border-radius:50%;
        background:#444;background-size:cover;background-position:center;margin-bottom:8px;"></div>
      <div id="pp-name"><b>Nombre:</b> —</div>
      <div id="pp-uni"><b>Universidad:</b> —</div>
      <div id="pp-career"><b>Carrera:</b> —</div>
      <div id="pp-bday" class="muted"><b>Nacimiento:</b> —</div>
      <div id="pp-color"><b>Color favorito:</b>
        <span id="pp-color-swatch"
          style="display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:middle;margin:0 6px;background:#ff69b4;border:1px solid rgba(255,255,255,.25)">
        </span>
        <span id="pp-color-code">—</span>
      </div>
      <div id="pp-email"><b>Email universitario:</b> —</div>
      <div id="pp-phone"><b>Teléfono:</b> —</div>
    `;
    card.classList.add('hidden');
    hostPage.appendChild(card);
  }

  const clearUI = () => {
    $('pp-name').innerHTML = `<b>Nombre:</b> —`;
    $('pp-uni').innerHTML = `<b>Universidad:</b> —`;
    $('pp-career').innerHTML = `<b>Carrera:</b> —`;
    $('pp-bday').innerHTML = `<b>Fecha de nacimiento:</b> —`;
    $('pp-email').innerHTML = `<b>Email universitario:</b> —`;
    $('pp-phone').innerHTML = `<b>Teléfono:</b> —`;
    $('pp-color-code').textContent = '—';
    const sw = $('pp-color-swatch');
    if (sw) {
      sw.style.background = 'transparent';
      sw.style.border = '1px solid rgba(255,255,255,.25)';
    }
  };

  if (unsubPartner) { unsubPartner(); unsubPartner = null; }

  if (!state.pairOtherUid) {
    clearUI();
    if (card) card.classList.add('hidden');
    return;
  }

  const refRoot = doc(db, 'users', state.pairOtherUid);
  const refProf = doc(db, 'users', state.pairOtherUid, 'profile', 'profile');
  card.classList.remove('hidden');

  let latestRoot = null, latestProf = null;

  const mergeAndRender = () => {
    const d = { ...(latestRoot?.data() || {}), ...(latestProf?.data() || {}) };
    const pav = $('pp-avatar');
    if (pav) {
      const safeAvatarData = safeImageDataUrl(d.avatarData);
      if (safeAvatarData) {
        pav.style.backgroundImage = `url("${safeAvatarData}")`;
        pav.textContent = '';
      } else {
        pav.style.backgroundImage = 'none';
        pav.textContent = '👨‍🎓';
        pav.style.display = 'flex';
        pav.style.alignItems = 'center';
        pav.style.justifyContent = 'center';
        pav.style.fontSize = '2rem';
      }
    }

    setLabeledText($('pp-name'), 'Nombre', d.name || '—');
    setLabeledText($('pp-uni'), 'Universidad', readUni(d));
    setLabeledText($('pp-career'), 'Carrera', readableCareer(d) || '—');
    setLabeledText($('pp-bday'), 'Fecha de nacimiento', prettyDMY(d.birthday));
    setLabeledText($('pp-email'), 'Email universitario', d.uniEmail || '—');
    setLabeledText($('pp-phone'), 'Teléfono', d.phone || '—');

    const col =
      typeof d.favoriteColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(d.favoriteColor)
        ? d.favoriteColor
        : '#ff69b4';
    const sw = $('pp-color-swatch');
    if (sw) sw.style.background = col;
    const cc = $('pp-color-code');
    if (cc) cc.textContent = col.toUpperCase();
  };

  const prettyDMY = (iso) => {
    if (!iso) return '—';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
  };

  const readUni = (d) => {
    if (!d?.university) return '—';
    if (d.university === 'UMAYOR') return 'Universidad Mayor';
    if (d.university === 'USM') return 'UTFSM';
    if (d.university === 'OTRA') return d.customUniversity || 'Otra';
    return d.university;
  };

  const unsubRoot = onSnapshot(refRoot, (snap) => {
    latestRoot = snap;
    mergeAndRender();
  });
  const unsubProf = onSnapshot(refProf, (snap) => {
    latestProf = snap;
    mergeAndRender();
  });

  unsubPartner = () => { unsubRoot(); unsubProf(); };
}


document.addEventListener('pair:ready', () => {
  mountPartnerProfileCard();
});



// ========== Modales para "Otra universidad" y "Otra carrera" ==========
let profileCustomSelectorsBound = false;

function bindProfileCustomSelectors(){
  if (profileCustomSelectorsBound) return;
  profileCustomSelectorsBound = true;

  // ----- Referencias -----
  const uniSel = document.getElementById('uniSel');
  const careerSel = document.getElementById('careerSel');

  // crea modales si no existen
  function createModal(id, title, placeholder) {
    if (document.getElementById(id)) return document.getElementById(id);
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:400px;text-align:center;">
        <h3>${title}</h3>
        <input id="${id}Input" type="text" placeholder="${placeholder}" 
          style="width:100%;margin-top:1rem;padding:.8rem;border-radius:8px;
          border:none;background:rgba(255,255,255,0.1);color:white;">
        <div style="margin-top:1rem;display:flex;justify-content:center;gap:1rem;">
          <button id="${id}Save" class="btn">Guardar</button>
          <button id="${id}Cancel" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  const uniModal = createModal('uniModal', 'Agregar nueva universidad', 'Escribe el nombre...');
  const careerModal = createModal('careerModal', 'Agregar nueva carrera', 'Escribe el nombre...');

  // helpers para mostrar y cerrar
  function showModal(modal) {
    modal.classList.add('active');
    const input = modal.querySelector('input');
    input.value = '';
    input.focus();
  }
  function closeModal(modal) {
    modal.classList.remove('active');
  }

  // ---- Lógica para Universidad ----
  if (uniSel) {
    uniSel.addEventListener('change', () => {
      if (uniSel.value === 'OTRA') {
        showModal(uniModal);
      } else {
        // habilita el selector de carrera y agrega "Otra"
        if (careerSel) {
          careerSel.disabled = false;
        }
      }
    });
  }

  const uniSave = uniModal.querySelector('#uniModalSave');
  const uniCancel = uniModal.querySelector('#uniModalCancel');
  const uniInput = uniModal.querySelector('#uniModalInput');

  uniSave.addEventListener('click', saveCustomUni);
  uniCancel.addEventListener('click', () => closeModal(uniModal));
  uniModal.addEventListener('click', e => {
    if (e.target === uniModal) closeModal(uniModal);
  });
  uniInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); saveCustomUni(); }
  });

  function saveCustomUni() {
    const newUni = uniInput.value.trim();
    if (!newUni) return;

    // agrega la nueva universidad si no existe
    let existing = Array.from(uniSel.options).find(opt => opt.value === newUni);
    if (!existing) {
      const opt = document.createElement('option');
      opt.value = newUni;
      opt.textContent = newUni;
      uniSel.appendChild(opt);
    }

    uniSel.value = newUni;
    if (careerSel) {
      careerSel.disabled = false;
    }

    closeModal(uniModal);
  }

  // ---- Lógica para Carrera ----
  if (careerSel) {
    careerSel.addEventListener('change', () => {
      if (careerSel.value === 'OTRA') {
        showModal(careerModal);
      }
    });
  }

  const carSave = careerModal.querySelector('#careerModalSave');
  const carCancel = careerModal.querySelector('#careerModalCancel');
  const carInput = careerModal.querySelector('#careerModalInput');

  carSave.addEventListener('click', saveCustomCareer);
  carCancel.addEventListener('click', () => closeModal(careerModal));
  careerModal.addEventListener('click', e => {
    if (e.target === careerModal) closeModal(careerModal);
  });
  carInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); saveCustomCareer(); }
  });

  function saveCustomCareer() {
    const newCar = carInput.value.trim();
    if (!newCar) return;

    // agrega la nueva carrera si no existe
    let existing = Array.from(careerSel.options).find(opt => opt.value === newCar);
    if (!existing) {
      const opt = document.createElement('option');
      opt.value = newCar;
      opt.textContent = newCar;
      careerSel.appendChild(opt);
    }

    careerSel.value = newCar;
    closeModal(careerModal);
  }



}


function bindDeviceSecurityPreferences(){
  const trustedChk = $('pfTrustedDevice');
  const status = $('pfTrustedDeviceStatus');
  const clearBtn = $('pfClearLocalCache');

  if (!trustedChk || trustedChk.dataset.bound === '1') return;

  const renderStatus = () => {
    trustedChk.checked = !!persistentCacheEnabled;
    if (status) {
      status.textContent = persistentCacheEnabled
        ? 'Modo confiable activo: Firestore usa caché persistente en este navegador.'
        : 'Modo privado activo: Firestore usa caché en memoria y no conserva datos offline entre sesiones.';
    }
  };

  trustedChk.addEventListener('change', () => {
    const next = !!trustedChk.checked;
    updateTrustedDevicePreference(next);

    const msg = next
      ? 'La caché persistente se activará al recargar PartyPlanner.'
      : 'La caché persistente se desactivará al recargar. Puedes usar “Borrar caché local” para eliminar también los datos ya almacenados.';

    if (status) status.textContent = msg;

    setTimeout(() => {
      location.reload();
    }, 700);
  });

  clearBtn?.addEventListener('click', async () => {
    const ok = confirm('¿Borrar la caché local de Firestore de este navegador? Los datos confirmados en la nube no se eliminan.');
    if (!ok) return;

    clearBtn.disabled = true;
    if (status) status.textContent = 'Borrando caché local…';

    try {
      updateTrustedDevicePreference(false);
      await clearLocalFirestoreCache();
    } catch (err) {
      console.error('clearLocalFirestoreCache', err);
      clearBtn.disabled = false;
      if (status) status.textContent = 'No se pudo borrar la caché local. Cierra otras pestañas de PartyPlanner e inténtalo nuevamente.';
    }
  });

  trustedChk.dataset.bound = '1';
  renderStatus();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bindProfileCustomSelectors();
    bindDeviceSecurityPreferences();
  }, { once:true });
} else {
  bindProfileCustomSelectors();
  bindDeviceSecurityPreferences();
}

