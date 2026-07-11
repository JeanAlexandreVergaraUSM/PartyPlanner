// ai/ui.js
// UI del asistente + orquestación básica (intención → herramienta → respuesta).
// Requiere: ai/router.js y ai/tools.js

import { detectIntent, extractSlots, chipsForRoute } from './router.js';
import { tools } from './tools.js';
import { humanize } from './humanize.js';
import { secureApiFetch } from '../security/secureApiFetch.js';
import { $ } from '../state.js';
import { state } from '../state.js';

const PANEL_ID = 'dp-ai-panel';

/* ---------------- Panel y Botón ---------------- */
function ensurePanel() {
  
  if (document.getElementById(PANEL_ID)) return;

  // Botón flotante 🤖
  const btn = document.createElement('button');
  btn.id = 'dp-ai-button';
  Object.assign(btn.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#22c55e',
    color: '#fff',
    fontSize: '22px',
    border: 'none',
    boxShadow: '0 6px 18px rgba(0,0,0,.25)',
    cursor: 'pointer',
    zIndex: '1000'
  });
  btn.textContent = '🤖';
  document.body.appendChild(btn);

  // Panel
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.className = 'dp-ai';
  Object.assign(panel.style, {
    position: 'fixed',
    right: '16px',
    bottom: '84px',
    width: '380px',
    maxHeight: '72vh',
    background: '#17181a',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: '14px',
    boxShadow: '0 12px 24px rgba(0,0,0,.4)',
    display: 'none',
    flexDirection: 'column',
    zIndex: '1000'
  });

  panel.innerHTML = `
    <div style="padding:10px 12px; font-weight:700; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.08)">
      Asistente PartyPlanner 
      <span id="dp-ai-close" style="cursor:pointer; opacity:.8">✕</span>
    </div>
    <div id="dp-ai-body" style="padding:12px; overflow:auto; display:flex; flex-direction:column; gap:8px"></div>
    <div id="dp-ai-chips" style="display:flex; flex-wrap:wrap; gap:6px; padding:0 12px 10px"></div>
    <div style="display:flex; gap:8px; padding:10px; border-top:1px solid rgba(255,255,255,.08)">
      <input id="dp-ai-inp" type="text" placeholder="Pregúntame sobre tu semestre, horario, malla…" 
        style="flex:1; background:#0f1113; color:#fff; border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:10px"/>
      <button id="dp-ai-send" style="background:#22c55e; color:#fff; border:none; border-radius:10px; padding:10px 12px; cursor:pointer">Enviar</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Eventos
  btn.onclick = () => {
    panel.style.display = (panel.style.display === 'none' ? 'flex' : 'none');
    refreshChips();
  };
  panel.querySelector('#dp-ai-close').onclick = () => (panel.style.display = 'none');
  panel.querySelector('#dp-ai-send').onclick = onSend;
  panel.querySelector('#dp-ai-inp').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSend();
  });

  window.addEventListener('hashchange', refreshChips);
}

/* ---------------- API ---------------- */
const API_URL = String(import.meta.env.VITE_AI_API_URL || '').trim();
const AI_MAX_QUESTION_CHARS = 2000;
const AI_MIN_REQUEST_INTERVAL_MS = 2500;
let aiRequestInFlight = false;
let lastAiRequestAt = 0;

async function askAI(question) {
  if (!API_URL) {
    throw new Error('VITE_AI_API_URL no está configurada.');
  }

  const cleanQuestion = String(question || '').trim();
  if (!cleanQuestion) throw new Error('Pregunta vacía.');
  if (cleanQuestion.length > AI_MAX_QUESTION_CHARS) {
    throw new Error(`La pregunta supera ${AI_MAX_QUESTION_CHARS} caracteres.`);
  }

  const now = Date.now();
  if (aiRequestInFlight) throw new Error('Ya hay una consulta en curso.');
  if (now - lastAiRequestAt < AI_MIN_REQUEST_INTERVAL_MS) {
    throw new Error('Espera un momento antes de enviar otra consulta.');
  }

  aiRequestInFlight = true;
  lastAiRequestAt = now;

  try {
    const res = await secureApiFetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: cleanQuestion,
        semesterId: state.activeSemesterId || null,
      }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload?.error || `Error HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return res.json();
  } finally {
    aiRequestInFlight = false;
  }
}

function getUid() {
  return state.currentUser?.uid || null;
}

function getActiveSemesterId() {
  return state.activeSemesterId || null;
}

/* ---------------- Render mensajes ---------------- */
function msgEl(role, text) {
  const div = document.createElement('div');
  div.className = `ai-${role}`;
  Object.assign(div.style, {
    background: role === 'user' ? '#1e2a3a' : '#1f2023',
    border: '1px solid rgba(255,255,255,.06)',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '14px',
    lineHeight: '1.35'
  });
  div.textContent = text;
  return div;
}

function pushMsg(role, text) {
  const body = document.getElementById('dp-ai-body');
  body.appendChild(msgEl(role, text));
  body.scrollTop = body.scrollHeight;
}

/* ---------------- Chips dinámicos ---------------- */
function refreshChips() {
  const host = document.getElementById('dp-ai-chips');
  if (!host) return;
  host.innerHTML = '';
  const list = chipsForRoute(location.hash || '#/perfil');

  list.forEach((t) => {
    const c = document.createElement('button');
    c.textContent = t;
    Object.assign(c.style, {
      background: '#1f2023',
      border: '1px solid rgba(255,255,255,.08)',
      color: '#ddd',
      padding: '6px 10px',
      borderRadius: '16px',
      cursor: 'pointer'
    });
    c.onclick = () => {
      const inp = document.getElementById('dp-ai-inp');
      inp.value = t;
      onSend();
    };
    host.appendChild(c);
  });
}

/* ---------------- Enviar pregunta ---------------- */
async function onSend() {
  const inp = document.getElementById('dp-ai-inp');
  const q = (inp.value || '').trim();
  if (!q) return;

  pushMsg('user', q);
  inp.value = '';

  const route = location.hash || '#/perfil';
  const intent = detectIntent(q, route);
  const slots = extractSlots(q, intent);

  let reply = null, data = null;
  try {
    data = await askAI(q);
    reply = data.answer || 'Sin respuesta.';
  } catch (err) {
    console.error('[AI] backend error', err);
    reply = 'Ups, algo falló al consultar la IA. Intenta de nuevo.';
  }

  pushMsg('assistant', reply);
  addFeedbackBar({ intent: data?.intent || intent, slots: data?.slots || slots });

  // Acciones sugeridas por el backend
  if (data?.raw?.directive === 'auth_switch') {
    import('../auth.js').then(m => m.aiSwitchAccount?.()).catch(() => {});
  }
  if (data?.raw?.directive === 'auth_logout') {
    import('../auth.js').then(m => m.aiLogout?.()).catch(() => {});
  }
  if (data?.directive) {
    import('./ui.js').then(m => m.handleDirective?.(data.directive, data.field));
  }
  // 🔹 NUEVO: limpiar perfil si el backend confirmó el borrado
  if (data?.intent === 'profile_clear_all' && data?.raw?.ok) {
  // Limpia el estado local
  state.profileData = {};

  // Limpia inputs visibles en el formulario Perfil
  try {
    $("pfName").value = "";
    $("pfBirthday").value = "";
    $("pfFavoriteColor").value = "";
    $("pfUniversity").value = "";
    $("pfCareer").value = "";
    $("pfEmailUni").value = "";
    $("pfPhone").value = "";
  } catch(_) {}

  // Dispara evento global para que malla, progreso, etc. se reinicialicen
  document.dispatchEvent(new Event("profile:changed"));
}

}

/* ---------------- Feedback ---------------- */
function addFeedbackBar(meta) {
  const body = document.getElementById('dp-ai-body');
  const bar = document.createElement('div');
  bar.style.display = 'flex';
  bar.style.gap = '8px';
  bar.style.alignItems = 'center';
  bar.style.fontSize = '12px';
  bar.style.opacity = '.85';
  bar.style.marginTop = '-4px';
  bar.innerHTML = `
    <span>¿Te sirvió?</span>
    <button class="ai-like">👍</button>
    <button class="ai-dislike">👎</button>
  `;
  body.appendChild(bar);

  const rate = (score) => {
    if (typeof tools.__feedback === 'function') tools.__feedback({ ...meta, score });
    bar.remove();
  };
  bar.querySelector('.ai-like').onclick = () => rate(+1);
  bar.querySelector('.ai-dislike').onclick = () => rate(-1);

  body.scrollTop = body.scrollHeight;
}

/* ---------------- Inicialización ---------------- */
export function initAI() {
  ensurePanel();
  refreshChips();
}

document.addEventListener('DOMContentLoaded', initAI);

/* ---------------- Directivas ---------------- */
export function handleDirective(directive, field) {
  if (directive === "open_profile") {
    location.hash = "#/perfil";

    if (field === "avatar") {
      const inp = $("pfAvatarFile");
      if (inp) setTimeout(() => inp.click(), 500);
    }
    if (field === "name") $("pfName")?.focus();
    if (field === "birthdate") $("pfBirthday")?.focus();
    if (field === "favoriteColor") $("pfFavoriteColor")?.focus();
    if (field === "university") $("pfUniversity")?.focus();
    if (field === "career") $("pfCareer")?.focus();
    if (field === "uniEmail") $("pfEmailUni")?.focus();
    if (field === "phone") $("pfPhone")?.focus();
  }
}
