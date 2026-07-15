import{_ as e,a as t,c as n,d as r,f as i,i as a,l as o,n as s,r as c,s as l,v as u}from"./index.esm-BR0qfrzH.js";import{c as d,o as f,r as p,u as m}from"./index-Dmmp0C--.js";import{n as h,t as g}from"./privacy-BQV51iKn.js";function _(e){return[...new Set((Array.isArray(e)?e:[]).map(e=>String(e||``).trim()).filter(Boolean))].sort()}function v(e,t=e?.date){if(!e?.isTask)return!1;if(e.repeat?.every){let n=String(t||``).trim();return!!n&&_(e.completedOccurrences).includes(n)}return e.completed===!0}function ee(e,t,n){let r=new Set(_(e)),i=String(t||``).trim();return i&&(n?r.add(i):r.delete(i)),[...r].sort()}function te({existingEvent:e=null,occurrenceDate:t=``,isTask:n=!1,completed:r=!1,repeatEvery:i=``}={}){return n?i?{isTask:!0,completed:!1,completedOccurrences:ee(e?.completedOccurrences,t,r)}:{isTask:!0,completed:r===!0,completedOccurrences:[]}:{isTask:!1,completed:!1,completedOccurrences:[]}}var y=new Date,b=null,x=null,S=[],C=[],w={course:!0,personal:!0},T=!1,ne=null,re=null,ie=null,E=null,D=[],O=`#ff69b4`,k=null,ae=new Map,A=new Map;function oe(e){ne=e}function se(){try{ne?.()}finally{ne=null}try{b?.()}catch{}b=null;try{x?.()}catch{}x=null}function ce(){Ee();let e=f(`page-calendario`);if(e){e.classList.add(`hidden`);let t=e.querySelector(`[data-cal-grid]`)||e.querySelector(`.cal-grid`);t&&(t.innerHTML=``)}}function le(){f(`page-calendario`)?.classList.remove(`hidden`)}function ue(){return M(O)?O:`#ff69b4`}function j(){let e=d.profileData||{},t=d.currentUser||{};return typeof e.favoriteColor==`string`&&M(e.favoriteColor)?e.favoriteColor:typeof t.favoriteColor==`string`&&M(t.favoriteColor)?t.favoriteColor:`#3B82F6`}function M(e){return typeof e==`string`&&/^#[0-9A-Fa-f]{6}$/.test(e)}function de(e,t=`#3B82F6`){if(!e)return t;let n=(d.courses||[]).find(t=>t.id===e);return M(n?.color)?n.color:t}function fe(e,t=j()){if(e?.courseId){let t=(d.courses||[]).find(t=>t.id===e.courseId);if(M(t?.color))return t.color}return M(e?.color)?e.color:t}function N(e){try{let t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?`#111`:`#fff`}catch{return`#0e0e0e`}}function pe(e){if(!e)return[];if(Array.isArray(e))return e.map(e=>typeof e==`string`?e:e?.uid).filter(Boolean);if(e instanceof Set)return[...e].map(e=>typeof e==`string`?e:e?.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e==`object`){let t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return pe(t);let n=Object.keys(e).filter(e=>typeof e==`string`&&e.length>=16);if(n.length)return n;let r=Object.values(e).map(e=>e?.uid).filter(Boolean);if(r.length)return r}return[]}function me(){let e=d.currentUser?.uid,t=[d.partyMembers,d.party,d.partyData,d.activeParty,d.shared?.party,d.shared?.partyData,d.shared?.partyMembers],n=[];for(let e of t)if(n=pe(e),n.length)break;return[...new Set(n.filter(Boolean))].filter(t=>t!==e)}var P=Object.create(null);function F(e={},t={}){return typeof t.displayName==`string`&&t.displayName.trim()?t.displayName.trim():typeof t.name==`string`&&t.name.trim()?t.name.trim():typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():typeof e.name==`string`&&e.name.trim()?e.name.trim():`Usuario`}function I(e={},t={}){return typeof t.favoriteColor==`string`&&M(t.favoriteColor)?t.favoriteColor:typeof e.favoriteColor==`string`&&M(e.favoriteColor)?e.favoriteColor:`#64748b`}async function he(e){if(!e)return{name:`Usuario`,favoriteColor:`#64748b`};if(P[e])return P[e];try{let t=u(m,`users`,e),n=u(m,`users`,e,`profile`,`profile`),[r,i]=await Promise.all([a(t),a(n)]),o=r.exists()&&r.data()||{},s=i.exists()&&i.data()||{},c={name:F(o,s),favoriteColor:I(o,s)};return P[e]=c,c}catch(t){return console.warn(`cal_loadMemberProfile error`,t),P[e]={name:`Usuario`,favoriteColor:`#64748b`},P[e]}}async function ge(){let e=me();if(!e.length)return[];let t=await Promise.all(e.map(e=>he(e)));return e.map((e,n)=>({uid:e,name:t[n]?.name||`Usuario`,favoriteColor:t[n]?.favoriteColor||`#64748b`}))}async function L(){let e=f(`calendarPartyPicker`);if(!e)return;let t=await ge();if(!t.length){e.innerHTML=`<div class="muted">No hay integrantes disponibles en tu party.</div>`;return}e.innerHTML=t.map(e=>{let t=e.uid===k;return`
      <button
        class="calendar-party-chip ${t?`active`:``}"
        data-uid="${p(e.uid)}"
        style="
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:16px;
          border:${t?`2px solid rgba(139,156,251,0.95)`:`1px solid rgba(255,255,255,0.12)`};
          background:${t?`rgba(99,102,241,0.22)`:`rgba(10,14,35,0.9)`};
          color:#fff;
          cursor:pointer;
          min-width:120px;
          box-shadow:${t?`0 0 0 2px rgba(255,255,255,0.08) inset`:`none`};
        "
      >
        <span style="
  width:14px;
  height:14px;
  border-radius:999px;
  background:${e.favoriteColor||`#64748b`};
  flex:0 0 auto;
"></span>
        <span style="font-weight:600;">${p(e.name)}</span>
      </button>
    `}).join(``),e.querySelectorAll(`.calendar-party-chip`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.uid;t&&(k=t,await L(),await B())})})}function _e(){let e=f(`calFilterBtn`),t=f(`calFilterMenu`),n=f(`calFilterChkCourse`),r=f(`calFilterChkPersonal`);if(!e||!t||!n||!r)return;let i=()=>{n.checked=!!w.course,r.checked=!!w.personal};e.addEventListener(`click`,e=>{e.stopPropagation(),t.classList.toggle(`hidden`),i()}),n.addEventListener(`change`,()=>{w.course=!!n.checked,Y()}),r.addEventListener(`change`,()=>{w.personal=!!r.checked,Y()}),document.addEventListener(`click`,n=>{!t.contains(n.target)&&n.target!==e&&t.classList.add(`hidden`)}),i()}function ve(){T||(T=!0,xe(),Se(),_e(),U(),W(),J(),G(),Ce(),Te(),document.addEventListener(`pair:ready`,async()=>{await L(),await B()}),document.addEventListener(`pair:ready`,async()=>{await H(),K()}),document.addEventListener(`profile:changed`,()=>{Y(),q()}),document.addEventListener(`profile:ready`,()=>{Y(),q()}),L(),B(),H(),we())}function R(){T||ve()}function ye(){R(),b&&=(b(),null),Ce(),Te(),W(),G(),K(),k&&B(),H()}function be(){R(),Y(),J(),X(),q()}document.readyState===`loading`?window.addEventListener(`DOMContentLoaded`,R):R(),document.addEventListener(`route:calendario`,R),document.addEventListener(`semester:changed`,()=>{T&&ye()}),document.addEventListener(`courses:changed`,()=>{T&&be()});function xe(){let e=f(`page-calendario`);e&&(e.innerHTML=`
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
  `)}function Se(){f(`calPrev`)?.addEventListener(`click`,()=>{y=He(y,-1),z(),W(),G(),K()}),f(`calNext`)?.addEventListener(`click`,()=>{y=He(y,1),z(),W(),G(),K()}),f(`calToday`)?.addEventListener(`click`,()=>{y=new Date,z(),W(),G(),K()}),f(`calImportGoogle`)?.addEventListener(`click`,Ae),z()}function z(){let e=y.getFullYear(),t=y.getMonth(),n=[`enero`,`febrero`,`marzo`,`abril`,`mayo`,`junio`,`julio`,`agosto`,`septiembre`,`octubre`,`noviembre`,`diciembre`],r=f(`calTitle`);r&&(r.textContent=`Calendario · ${n[t][0].toUpperCase()}${n[t].slice(1)} ${e}`)}function Ce(){let e=f(`calActiveSem`);e&&(e.textContent=d.activeSemesterData?.label||`—`)}function we(){let e=f(`cal-subtab-propio`),t=f(`cal-subtab-compartido`),n=f(`cal-subtab-combinado`),r=f(`cal-propio`),i=f(`cal-compartido`),a=f(`cal-combinado`);function o(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`hidden`),i.classList.add(`hidden`),a.classList.add(`hidden`)}async function s(){if(t.classList.add(`active`),e.classList.remove(`active`),n.classList.remove(`active`),i.classList.remove(`hidden`),r.classList.add(`hidden`),a.classList.add(`hidden`),await L(),G(),!k){f(`calSharedHint`).textContent=`Selecciona un integrante de tu party para ver su calendario.`;return}f(`calSharedHint`).textContent=``,await B()}async function c(){await H(),n.classList.add(`active`),e.classList.remove(`active`),t.classList.remove(`active`),a.classList.remove(`hidden`),r.classList.add(`hidden`),i.classList.add(`hidden`),K(),await Ie()}e?.addEventListener(`click`,o),t?.addEventListener(`click`,s),n?.addEventListener(`click`,c),o()}function Te(){if(b){try{b()}catch{}b=null}if(x){try{x()}catch{}x=null}if(S=[],C=[],Y(),J(),!d.currentUser||!d.activeSemesterId)return;let t=d.currentUser.uid,r=d.activeSemesterId;b=l(o(e(m,`users`,t,`semesters`,r,`calendar`),n(`date`,`asc`)),e=>{d.currentUser?.uid!==t||d.activeSemesterId!==r||(S=e.docs.map(e=>({id:e.id,...e.data()})),Y(),J())}),x=l(o(e(m,`users`,t,`semesters`,r,`courses`),n(`name`,`asc`)),e=>{d.currentUser?.uid!==t||d.activeSemesterId!==r||(C=e.docs.map(e=>({id:e.id,...e.data()})),J())})}async function B(){V(),D=[],O=`#ff69b4`,G();let e=k;if(!e){f(`calSharedHint`).textContent=`Selecciona un integrante de tu party para ver su calendario.`;return}if(!await g(e,`calendario`)){V(),D=[],G();let e=f(`calSharedGrid`);e&&(e.innerHTML=h(`su calendario`)),f(`calSharedHint`).textContent=``;return}if(f(`calSharedHint`).textContent=``,!await De())return;E&&=(E(),null);let t=l(u(m,`users`,e),async t=>{let n=t.exists()&&t.data()||{},r=P[e]||{},i={displayName:n.displayName,name:n.name,favoriteColor:n.favoriteColor},a={displayName:r._profDisplayName,name:r._profName,favoriteColor:r._profFavoriteColor},o={name:F(i,a),favoriteColor:I(i,a),_rootDisplayName:n.displayName||null,_rootName:n.name||null,_rootFavoriteColor:n.favoriteColor||null,_profDisplayName:r._profDisplayName||null,_profName:r._profName||null,_profFavoriteColor:r._profFavoriteColor||null};P[e]=o,M(o.favoriteColor)&&(O=o.favoriteColor),X(),q(),await L()}),n=l(u(m,`users`,e,`profile`,`profile`),async t=>{let n=t.exists()&&t.data()||{},r=P[e]||{},i={displayName:r._rootDisplayName,name:r._rootName,favoriteColor:r._rootFavoriteColor},a={displayName:n.displayName,name:n.name,favoriteColor:n.favoriteColor},o={name:F(i,a),favoriteColor:I(i,a),_rootDisplayName:r._rootDisplayName||null,_rootName:r._rootName||null,_rootFavoriteColor:r._rootFavoriteColor||null,_profDisplayName:n.displayName||null,_profName:n.name||null,_profFavoriteColor:n.favoriteColor||null};P[e]=o,M(o.favoriteColor)&&(O=o.favoriteColor),X(),q(),await L()});E=()=>{try{t?.()}catch{}try{n?.()}catch{}}}function V(){re&&=(re(),null),ie&&=(ie(),null),E&&=(E(),null)}function Ee(){for(let[,e]of ae.entries())try{e?.()}catch{}ae.clear(),A.clear()}async function H(){Ee();let r=me();if(!r.length){q();return}let i=d.activeSemesterData?.label||null;if(!i){q();return}for(let a of r)try{if(!await g(a,`calendario`)){A.set(a,[]);continue}await he(a);let r=l(u(m,`users`,a),async e=>{let t=e.exists()&&e.data()||{},n=P[a]||{},r={displayName:t.displayName,name:t.name,favoriteColor:t.favoriteColor},i={displayName:n._profDisplayName,name:n._profName,favoriteColor:n._profFavoriteColor};P[a]={name:F(r,i),favoriteColor:I(r,i),_rootDisplayName:t.displayName||null,_rootName:t.name||null,_rootFavoriteColor:t.favoriteColor||null,_profDisplayName:n._profDisplayName||null,_profName:n._profName||null,_profFavoriteColor:n._profFavoriteColor||null},q(),await L()}),s=l(u(m,`users`,a,`profile`,`profile`),async e=>{let t=e.exists()&&e.data()||{},n=P[a]||{},r={displayName:n._rootDisplayName,name:n._rootName,favoriteColor:n._rootFavoriteColor},i={displayName:t.displayName,name:t.name,favoriteColor:t.favoriteColor};P[a]={name:F(r,i),favoriteColor:I(r,i),_rootDisplayName:n._rootDisplayName||null,_rootName:n._rootName||null,_rootFavoriteColor:n._rootFavoriteColor||null,_profDisplayName:t.displayName||null,_profName:t.name||null,_profFavoriteColor:t.favoriteColor||null},q(),await L()}),c=await t(e(m,`users`,a,`semesters`)),d=null;c.forEach(e=>{(e.data()?.label||``).trim()===i&&(d=e.id)});let f=null;d?f=l(o(e(m,`users`,a,`semesters`,d,`calendar`),n(`date`,`asc`)),e=>{A.set(a,e.docs.map(e=>({id:e.id,...e.data(),ownerUid:a}))),q()}):(A.set(a,[]),q()),ae.set(a,()=>{try{r?.()}catch{}try{s?.()}catch{}try{f?.()}catch{}})}catch(e){console.warn(`subscribeCombinedPartyMembers error`,a,e),A.set(a,[])}q()}async function De(){let n=k;if(!n)return null;let r=d.activeSemesterData?.label||null;if(!r)return f(`calSharedHint`).textContent=`No tienes semestre activo seleccionado.`,null;try{let i=await t(e(m,`users`,n,`semesters`)),a=null;if(i.forEach(e=>{let t=(e.data()?.label||``).trim();t===r&&(a={id:e.id,label:t})}),d.shared=d.shared||{},d.shared.calendar=d.shared.calendar||{},a)return d.shared.calendar.semId=a.id,f(`calSharedHint`).textContent=``,await Oe(a.id),a.id;d.shared.calendar.semId=null;let o=f(`calSharedGrid`);return o&&(o.innerHTML=`<div class="muted">Esta persona no tiene el semestre <b>${p(r)}</b> creado.</div>`),f(`calSharedHint`).textContent=`Se intenta mostrar el mismo semestre activo que tienes tú.`,null}catch(e){return console.error(`populateSharedSemesters error`,e),f(`calSharedHint`).textContent=`Error al cargar el calendario compartido.`,null}}async function Oe(t){V(),D=[],G();let r=k;!r||!t||(ie=l(o(e(m,`users`,r,`semesters`,t,`courses`),n(`name`)),e=>{e.docs.map(e=>({id:e.id,...e.data()})),X()}),re=l(o(e(m,`users`,r,`semesters`,t,`calendar`),n(`date`,`asc`)),e=>{D=e.docs.map(e=>({id:e.id,...e.data()})),X()}))}function U(){if(f(`calModal`))return;let t=document.createElement(`div`);t.id=`calModal`,t.className=`modal`,t.innerHTML=`
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
  `,document.body.appendChild(t);let n=()=>t.classList.remove(`active`);f(`calModalBackdrop`).addEventListener(`click`,n),f(`calEvtCancel`).addEventListener(`click`,n);let i=f(`calEvtCourse`),a=f(`calEvtIsPersonal`),o=f(`calEvtIsTask`),c=f(`calEvtCompleted`),l=f(`calEvtCompletedWrap`);function p(){!i||!a||(a.checked?(i.value=``,i.disabled=!0,i.style.opacity=`0.6`):(i.disabled=!1,i.style.opacity=`1`))}function h(){let e=!!o?.checked;l?.classList.toggle(`hidden`,!e),!e&&c&&(c.checked=!1)}a?.addEventListener(`change`,p),o?.addEventListener(`change`,h),i?.addEventListener(`change`,()=>{i.value&&a&&(a.checked=!1,p())}),f(`calEvtSave`).addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}let i=(f(`calEvtTitle`).value||``).trim(),a=f(`calEvtDate`).value||``,o=f(`calEvtStart`).value||null,c=f(`calEvtEnd`).value||null,l=!!f(`calEvtIsPersonal`)?.checked,p=!!f(`calEvtIsTask`)?.checked,h=p&&!!f(`calEvtCompleted`)?.checked,g=l?null:f(`calEvtCourse`).value||null,_=f(`calEvtRepeat`).value||``,v=f(`calEvtPersistent`).value===`true`,ee=l?`personal`:`course`,y=g?de(g):j();if(!i)return alert(`Ingresa un título.`);if(!a)return alert(`Selecciona una fecha.`);let b=t.dataset.editingId||null,x=te({existingEvent:t.__editingEvent||null,occurrenceDate:t.dataset.editingOccurrenceDate||a,isTask:p,completed:h,repeatEvery:_}),S=e(m,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`),C={title:i,date:a,start:o,end:c,courseId:g,kind:ee,color:y,repeat:_?{every:_,interval:1}:null,persistent:v,...x};try{b?(await r(u(S,b),{...C,updatedAt:Date.now()}),console.log(`[Calendar] Evento actualizado:`,i)):(await s(S,{...C,createdAt:Date.now()}),console.log(`[Calendar] Evento creado:`,i)),t.dataset.editingId=``,t.dataset.editingOccurrenceDate=``,t.__editingEvent=null,n()}catch(e){console.error(e),alert(`No se pudo guardar el evento. Revisa tu conexión e inténtalo nuevamente.`)}})}function ke(){if(f(`gcalImportModal`))return;let e=document.createElement(`div`);e.id=`gcalImportModal`,e.className=`modal`,e.innerHTML=`
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
  `,document.body.appendChild(e);let t=()=>e.classList.remove(`active`);f(`gcalImportBackdrop`).addEventListener(`click`,t),f(`gcalRangeCancel`).addEventListener(`click`,t),f(`gcalRangeConfirm`).addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres" e inicia sesión.`);return}let e=f(`gcalRangeStart`).value,n=f(`gcalRangeEnd`).value;if(!e||!n){alert(`Selecciona ambas fechas (inicio y término).`);return}let[r,i,a]=e.split(`-`).map(Number),[o,s,c]=n.split(`-`).map(Number),l=new Date(r,i-1,a,0,0,0),u=new Date(o,s-1,c+1,0,0,0);if(u<=l){alert(`La fecha de término debe ser posterior a la de inicio.`);return}try{await ct(l,u),t()}catch(e){console.error(`Error al importar rango desde Google Calendar:`,e),alert(`Ocurrió un error al importar eventos de Google Calendar.`)}})}function Ae(){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres" e inicia sesión.`);return}ke();let e=y.getFullYear(),t=y.getMonth(),n=new Date(e,t+1,0).getDate(),r=f(`gcalRangeStart`),i=f(`gcalRangeEnd`);r&&!r.value&&(r.value=Z(e,t+1,1)),i&&!i.value&&(i.value=Z(e,t+1,n)),f(`gcalImportModal`).classList.add(`active`)}function je(e){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}U();let t=f(`calModal`),n=f(`calModalTitle`),r=f(`calEvtSave`);t&&(t.dataset.editingId=``,t.dataset.editingOccurrenceDate=``,t.__editingEvent=null),n&&(n.textContent=`Nuevo evento`),r&&(r.textContent=`Guardar`);let i=f(`calEvtDate`);i&&(i.value=e);let a=f(`calEvtTitle`);a&&(a.value=``);let o=f(`calEvtStart`);o&&(o.value=``);let s=f(`calEvtEnd`);s&&(s.value=``);let c=f(`calEvtCourse`);c&&(c.innerHTML=`<option value="">(Sin asignar)</option>`,(d.courses||[]).forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,c.appendChild(t)}));let l=f(`calEvtIsPersonal`);l&&(l.checked=!1);let u=f(`calEvtIsTask`),p=f(`calEvtCompleted`),m=f(`calEvtCompletedWrap`);u&&(u.checked=!1),p&&(p.checked=!1),m?.classList.add(`hidden`),c&&(c.disabled=!1,c.style.opacity=`1`),f(`calModal`).classList.add(`active`)}function Me(){let e=new Date;return Z(e.getFullYear(),e.getMonth()+1,e.getDate())}function W(){let e=f(`calGrid`);if(!e)return;let t=(new Date(y.getFullYear(),y.getMonth(),1).getDay()+6)%7,n=new Date(y.getFullYear(),y.getMonth()+1,0).getDate(),r=Me();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(y.getFullYear(),y.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="ce-${i}"></div>
        </div>
      `}).join(``)}
  `,e.querySelectorAll(`.cal-cell.day`).forEach(e=>{e.addEventListener(`click`,()=>je(e.dataset.date))}),Y(),J()}function Ne(e){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}U();let t=f(`calModal`),n=f(`calModalTitle`),r=f(`calEvtSave`);t.dataset.editingId=e.id,t.dataset.editingOccurrenceDate=e.date||``,t.__editingEvent=e,n.textContent=`Editar evento`,r.textContent=`Guardar cambios`,f(`calEvtTitle`).value=e.title||``,f(`calEvtDate`).value=e.date||``,f(`calEvtStart`).value=e.start||``,f(`calEvtEnd`).value=e.end||``,f(`calEvtRepeat`).value=e.repeat?.every||``,f(`calEvtPersistent`).value=e.persistent?`true`:``;let i=f(`calEvtCourse`);i.innerHTML=`<option value="">(Sin asignar)</option>`,(d.courses||[]).forEach(t=>{let n=document.createElement(`option`);n.value=t.id,n.textContent=t.name,t.id===e.courseId&&(n.selected=!0),i.appendChild(n)});let a=f(`calEvtIsPersonal`),o=e.kind||(e.courseId?`course`:`personal`);a&&(a.checked=o===`personal`);let s=f(`calEvtIsTask`),c=f(`calEvtCompleted`),l=f(`calEvtCompletedWrap`),u=e.isTask===!0;s&&(s.checked=u),c&&(c.checked=v(e,e.date)),l?.classList.toggle(`hidden`,!u),i&&(o===`personal`?(i.value=``,i.disabled=!0,i.style.opacity=`0.6`):(i.disabled=!1,i.style.opacity=`1`)),t.classList.add(`active`)}function G(){let e=f(`calSharedGrid`);if(!e)return;let t=(new Date(y.getFullYear(),y.getMonth(),1).getDay()+6)%7,n=new Date(y.getFullYear(),y.getMonth()+1,0).getDate(),r=Me();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(y.getFullYear(),y.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="sce-${i}"></div>
        </div>
      `}).join(``)}
  `,X()}function K(){let e=f(`calCombinedGrid`);if(!e)return;let t=(new Date(y.getFullYear(),y.getMonth(),1).getDay()+6)%7,n=new Date(y.getFullYear(),y.getMonth()+1,0).getDate(),r=Me();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(y.getFullYear(),y.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="bce-${i}"></div>
        </div>
      `}).join(``)}
  `,q()}function Pe(e,{interactive:t=!1}={}){if(!e?.isTask)return null;let n=v(e,e.date),i=document.createElement(t?`button`:`span`);return i.className=`cal-task-check ${n?`is-complete`:``}`,i.textContent=n?`✓`:``,i.title=n?`Marcar tarea como pendiente`:`Marcar tarea como completada`,i.setAttribute(`aria-label`,i.title),t&&(i.type=`button`,i.addEventListener(`click`,async t=>{if(t.preventDefault(),t.stopPropagation(),!d.currentUser||!d.activeSemesterId||!e.id)return;i.disabled=!0;let n=!v(e,e.date),a=te({existingEvent:e,occurrenceDate:e.date,isTask:!0,completed:n,repeatEvery:e.repeat?.every||``});try{await r(u(m,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`,e.id),{...a,updatedAt:Date.now()})}catch(e){console.error(`[Calendar] No se pudo actualizar la tarea:`,e),alert(`No se pudo actualizar el estado de la tarea.`),i.disabled=!1}})),i}function Fe(e,t,n){let r=v(n,n.date);e.classList.toggle(`cal-task-completed`,r),t?.classList.toggle(`cal-task-title-completed`,r)}function q(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`bce-`)&&(e.innerHTML=``)});let e=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,`0`)}`,t=Be(S).filter(t=>String(t.date||``).startsWith(e)).map(e=>({...e,isMine:!0,ownerUid:d.currentUser?.uid||null})),n=[];for(let[t,r]of A.entries())for(let i of r||[])String(i.date||``).startsWith(e)&&n.push({...i,isMine:!1,ownerUid:t});[...t,...n].forEach(e=>{let t=f(`bce-`+e.date);if(!t)return;let n=P[e.ownerUid]||{},r=e.isMine?j():M(n.favoriteColor)?n.favoriteColor:`#64748b`,i=N(r),a=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,o=document.createElement(`div`);o.className=`cal-evt`,o.style.background=r,o.style.color=i,o.style.opacity=e.isMine?1:.75,o.style.border=`1px solid rgba(0,0,0,0.25)`;let s=Pe(e,{interactive:e.isMine});s&&o.appendChild(s);let c=document.createElement(`span`);c.className=`cal-evt-title`,c.textContent=`${a}${e.title||`(sin título)`}`,o.appendChild(c),Fe(o,c,e),t.appendChild(o)})}async function Ie(){let e=f(`calCombinedRemindersList`);if(e){e.innerHTML=`<div class="loading"></div>`;try{let t=await Ue({range:`today`}),n=d.pairOtherUid?await qe({range:`today`}):[],r=[...t.map(e=>({...e,owner:`Tú`})),...n.map(e=>({...e,owner:`Dúo`}))].sort((e,t)=>(e.datetime||0)-(t.datetime||0));e.innerHTML=r.length?r.map(e=>`
          <div class="grade-item">
            <div>
              <strong>${p(e.title||`(sin título)`)}</strong>
              <div class="muted">${p(e.owner)} · ${p(e.datetime?.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})||``)}</div>
            </div>
          </div>
        `).join(``):`<div class="muted">Sin recordatorios para hoy.</div>`}catch(t){console.error(`loadCombinedReminders`,t),e.innerHTML=`<div class="muted">Error al cargar recordatorios.</div>`}}}function Le(e){let[t,n,r]=String(e||``).split(`-`).map(Number);return!t||!n||!r?null:{y:t,m:n,d:r}}function Re(e,t){return new Date(e,t,0).getDate()}function ze(e,t,n){let r=Le(e);if(!r)return null;let i=r.y,a=r.m,o=r.d;if(t===`day`){let e=new Date(i,a-1,o);return e.setDate(e.getDate()+n),Z(e.getFullYear(),e.getMonth()+1,e.getDate())}if(t===`month`){let e=i*12+(a-1)+n;return i=Math.floor(e/12),a=e%12+1,o=Math.min(r.d,Re(i,a)),Z(i,a,o)}return t===`year`?(i=r.y+n,o=Math.min(r.d,Re(i,a)),Z(i,a,o)):null}function Be(e){let t=[];for(let n of e){if(t.push(n),!n.repeat?.every)continue;let e=n.repeat.every,r=Number(n.repeat.interval||1);for(let i=1;i<=24;i++){let a=ze(n.date,e,i*r);a&&t.push({...n,date:a})}}return t}function J(){let e=f(`calLegend`);if(!e)return;let t=(C||[]).filter(e=>e?.name&&M(e?.color)).map(e=>({id:e.id,name:e.name,color:e.color}));if(!t.length){e.innerHTML=``;return}e.innerHTML=`
    <div style="
      width:100%;
      margin-top:2px;
      margin-bottom:4px;
      color:#cbd5e1;
      font-size:13px;
      font-weight:600;
    ">
    </div>

    ${t.map(e=>`
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
          background:${e.color};
          display:inline-block;
          flex:0 0 auto;
          border:1px solid rgba(255,255,255,0.18);
        "></span>
        <span>${p(e.name)}</span>
      </div>
    `).join(``)}
  `}function Ve(e){return new Promise(t=>{document.getElementById(`calDeleteModal`)?.remove();let n=document.createElement(`div`);n.id=`calDeleteModal`,n.style.cssText=`
      position:fixed;
      inset:0;
      z-index:10060;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.65);
      padding:16px;
    `,n.innerHTML=`
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
          ¿Eliminar "<b>${p(e||`evento`)}</b>"?
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button id="calDeleteCancel" class="ghost">Cancelar</button>
          <button id="calDeleteConfirm" class="primary" style="background:#ef4444;border:none;">
            Eliminar
          </button>
        </div>
      </div>
    `,document.body.appendChild(n);let r=e=>{n.remove(),t(e)};n.querySelector(`#calDeleteCancel`)?.addEventListener(`click`,()=>r(!1)),n.querySelector(`#calDeleteConfirm`)?.addEventListener(`click`,()=>r(!0)),n.addEventListener(`click`,e=>{e.target===n&&r(!1)})})}function Y(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`sce-`)||(e.innerHTML=``)});let e=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,`0`)}`,t=Be(S).filter(t=>String(t.date||``).startsWith(e));t=t.filter(e=>{let t=e.kind||(e.courseId?`course`:`personal`);return!(t===`course`&&!w.course||t===`personal`&&!w.personal)}),t.forEach(e=>{let t=f(`ce-`+e.date);if(!t)return;let n=fe(e,j()),r=N(n),i=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,a=document.createElement(`div`);a.className=`cal-evt`,a.style.background=n,a.style.color=r,a.style.border=`1px solid rgba(0,0,0,0.25)`,a.style.position=`relative`,a.style.cursor=`pointer`;let o=Pe(e,{interactive:!0});o&&a.appendChild(o);let s=document.createElement(`span`);s.className=`cal-evt-title`,s.textContent=`${i}${e.title||`(sin título)`}`,a.appendChild(s),Fe(a,s,e);let l=document.createElement(`span`);l.textContent=`✕`,l.className=`cal-del`,l.title=`Eliminar evento`,l.style.position=`absolute`,l.style.top=`2px`,l.style.right=`4px`,l.style.fontWeight=`bold`,l.style.color=`#fff8`,l.style.cursor=`pointer`,l.addEventListener(`click`,async t=>{if(t.stopPropagation(),!(!d.currentUser||!d.activeSemesterId||!e.id)&&await Ve(e.title))try{await c(u(m,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`,e.id))}catch(e){console.error(e)}}),a.appendChild(l),a.addEventListener(`click`,t=>{t.stopPropagation(),Ne(e)}),t.appendChild(a)})}function X(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`sce-`)&&(e.innerHTML=``)});let e=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,`0`)}`;D.filter(t=>String(t.date||``).startsWith(e)).forEach(e=>{let t=f(`sce-`+e.date);if(!t)return;let n=ue(),r=N(n),i=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,a=document.createElement(`div`);a.className=`cal-evt`,a.style.background=n,a.style.color=r,a.style.border=`1px solid rgba(0,0,0,0.25)`;let o=Pe(e,{interactive:!1});o&&a.appendChild(o);let s=document.createElement(`span`);s.className=`cal-evt-title`,s.textContent=`${i}${e.title||`(sin título)`}`,a.appendChild(s),Fe(a,s,e),t.appendChild(a)})}function He(e,t){return new Date(e.getFullYear(),e.getMonth()+t,1)}function Z(e,t,n){return`${e}-${String(t).padStart(2,`0`)}-${String(n).padStart(2,`0`)}`}async function Ue(n={}){if(!d.currentUser)throw Error(`No logueado`);let{range:r=`today`,dates:i,months:a,years:o,ranges:s}=n,c=(await t(e(m,`users`,d.currentUser.uid,`reminders`))).docs.map(e=>{let t=e.data();return{id:e.id,...t,datetime:$(t.datetime)}});if(c=c.filter(e=>!e.suspended),Array.isArray(s)&&s.length>0){let e=s.map(e=>{let t=$(e.start),n=$(e.end);return!t||!n?null:{start:t,end:n}}).filter(Boolean);return c=c.filter(t=>t.datetime&&e.some(e=>t.datetime>=e.start&&t.datetime<e.end)),c}if(Array.isArray(i)&&i.length>0){let e=new Set(i.map(e=>st(e)).filter(Boolean));return c=c.filter(t=>{if(!t.datetime)return!1;let n=st(t.datetime);return e.has(n)}),c}if(Array.isArray(a)&&a.length>0){let e=a.map(e=>{if(typeof e==`string`){let[t,n]=e.split(`-`).map(Number);return!t||!n?null:{year:t,month:n}}else if(e&&typeof e==`object`){let t=Number(e.year??e.y),n=Number(e.month??e.m);return!t||!n?null:{year:t,month:n}}return null}).filter(Boolean);return c=c.filter(t=>{if(!t.datetime)return!1;let n=t.datetime.getFullYear(),r=t.datetime.getMonth()+1;return e.some(e=>e.year===n&&e.month===r)}),c}if(Array.isArray(o)&&o.length>0){let e=new Set(o.map(e=>Number(e)));return c=c.filter(t=>t.datetime&&e.has(t.datetime.getFullYear())),c}let l=new Date;if(r===`today`){let e=new Date(l.getFullYear(),l.getMonth(),l.getDate()),t=new Date(l.getFullYear(),l.getMonth(),l.getDate()+1);return c.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(r===`week`){let e=new Date(l.getFullYear(),l.getMonth(),l.getDate()-l.getDay()),t=new Date(e);return t.setDate(e.getDate()+7),c.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(r===`month`){let e=new Date(l.getFullYear(),l.getMonth(),1),t=new Date(l.getFullYear(),l.getMonth()+1,1);return c.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}return c}async function We(e){if(!d.currentUser)throw Error(`No logueado`);return await r(u(m,`users`,d.currentUser.uid,`reminders`,e),{suspended:!1,updatedAt:Date.now()}),{ok:!0}}async function Ge(){if(!d.currentUser)throw Error(`No logueado`);return(await t(o(e(m,`users`,d.currentUser.uid,`reminders`),i(`suspended`,`==`,!0)))).docs.map(e=>({id:e.id,...e.data()}))}async function Ke({reminderId:e}){if(!d.currentUser)throw Error(`No logueado`);if(!e)throw Error(`Falta ID`);return await r(u(m,`users`,d.currentUser.uid,`reminders`,e),{suspended:!0,updatedAt:Date.now()}),{ok:!0}}async function qe({range:n=`today`}={}){if(!d.pairOtherUid)throw Error(`No tienes dúo`);let r=await t(e(m,`users`,d.pairOtherUid,`reminders`)),i=e=>e?typeof e==`number`?new Date(e):e.toDate?e.toDate():new Date(e):null,a=r.docs.map(e=>{let t=e.data();return{id:e.id,...t,datetime:i(t.datetime)}}),o=new Date;if(n===`today`){let e=new Date(o.getFullYear(),o.getMonth(),o.getDate()),t=new Date(o.getFullYear(),o.getMonth(),o.getDate()+1);return a.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(n===`week`){let e=new Date(o.getFullYear(),o.getMonth(),o.getDate()-o.getDay()),t=new Date(e);return t.setDate(e.getDate()+7),a.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}return a}var Je=`873375198212-seb8ne2elgua1gglus8vkj610ddsntt5.apps.googleusercontent.com`,Ye=`AIzaSyDw7nAwkKuroNgmaE0lzslWhK7S0P4tfa8`,Xe=[`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`],Ze=`https://www.googleapis.com/auth/calendar.readonly`,Qe=!1,$e=!1,Q=null;function et(){return new Promise((e,t)=>{if(window.gapi&&window.gapi.load)return e();let n=document.createElement(`script`);n.src=`https://apis.google.com/js/api.js`,n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(Error(`No se pudo cargar gapi`)),document.head.appendChild(n)})}function tt(){return new Promise((e,t)=>{if(window.google&&window.google.accounts)return e();let n=document.createElement(`script`);n.src=`https://accounts.google.com/gsi/client`,n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(Error(`No se pudo cargar Google Identity Services`)),document.head.appendChild(n)})}async function nt(){Qe||=(await et(),await new Promise(e=>{window.gapi.load(`client`,e)}),await window.gapi.client.init({apiKey:Ye,discoveryDocs:Xe}),!0)}async function rt(){$e&&Q||(await tt(),Q=window.google.accounts.oauth2.initTokenClient({client_id:Je,scope:Ze,callback:()=>{}}),$e=!0)}async function it(){return await rt(),new Promise((e,t)=>{Q.callback=n=>{if(n.error){console.error(`[OAuth error]`,n),t(n);return}e(n.access_token)},Q.requestAccessToken({prompt:``})})}async function at(e,t){await nt();let n=await it();window.gapi.client.setToken({access_token:n});let r=await window.gapi.client.calendar.events.list({calendarId:`primary`,timeMin:e.toISOString(),timeMax:t.toISOString(),showDeleted:!1,singleEvents:!0,orderBy:`startTime`});return console.log(`[Calendar] Respuesta completa de Google:`,r),r.result.items||[]}function ot(e){if(e.start&&e.start.date&&!e.start.dateTime)return{date:e.start.date,startTime:null,endTime:null,allDay:!0};let t=new Date(e.start?.dateTime||e.start?.date),n=new Date(e.end?.dateTime||e.end?.date||t),r=Z(t.getFullYear(),t.getMonth()+1,t.getDate()),i=e=>String(e).padStart(2,`0`);return{date:r,startTime:`${i(t.getHours())}:${i(t.getMinutes())}`,endTime:`${i(n.getHours())}:${i(n.getMinutes())}`,allDay:!1}}function $(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e==`number`)return new Date(e);if(typeof e==`string`){let t=new Date(e);return isNaN(t)?null:t}return e.toDate?e.toDate():null}function st(e){let t=$(e);return t?Z(t.getFullYear(),t.getMonth()+1,t.getDate()):null}async function ct(t,n){if(!d.currentUser||!d.activeSemesterId)throw Error(`Sin usuario o semestre activo`);try{let r=await at(t,n);if(!r.length){alert(`No se encontraron eventos en tu Google Calendar para el rango seleccionado.`);return}let i=new Set((S||[]).filter(e=>e.gcalId).map(e=>e.gcalId)),a=e(m,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`),o=0,c=[];for(let e of r){if(i.has(e.id))continue;let{date:t,startTime:n,endTime:r,allDay:l}=ot(e);if(!t)continue;let u={title:e.summary||`(sin título)`,date:t,start:l?null:n,end:l?null:r,allDay:!!l,courseId:null,color:null,source:`google`,gcalId:e.id,createdAt:Date.now()};c.push(s(a,u)),o++}if(!c.length){alert(`Los eventos de ese rango ya estaban importados.`);return}await Promise.all(c),alert(`Se importaron ${o} evento(s) desde tu Google Calendar para el rango seleccionado.`)}catch(e){console.error(`Error al importar Google Calendar:`,e),alert(`Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.`)}}export{ce as clearCalendarUI,ve as initCalendar,qe as listPairReminders,Ue as listReminders,Ge as listSuspendedReminders,ye as onActiveSemesterChanged,be as onCoursesChanged,oe as registerCalendarUnsub,We as resumeReminder,le as showCalendarUI,se as stopCalendarSub,Ke as suspendReminder};