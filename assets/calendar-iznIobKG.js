import{a as e,b as t,c as n,d as r,i,m as a,n as o,p as s,r as c,s as l,y as u}from"./index.esm-DxDnhweQ.js";import{c as d,d as f,o as p,r as m}from"./index-CFfnISX6.js";import{n as h,t as g}from"./privacy-D9i72lKU.js";var _=new Date,v=null,y=null,b=[],x=[],S={course:!0,personal:!0},C=!1,ee=null,te=null,ne=null,w=null,T=[],E=`#ff69b4`,D=null,O=new Map,k=new Map;function re(e){ee=e}function ie(){try{ee?.()}finally{ee=null}try{v?.()}catch{}v=null;try{y?.()}catch{}y=null}function ae(){Ce();let e=p(`page-calendario`);if(e){e.classList.add(`hidden`);let t=e.querySelector(`[data-cal-grid]`)||e.querySelector(`.cal-grid`);t&&(t.innerHTML=``)}}function oe(){p(`page-calendario`)?.classList.remove(`hidden`)}function se(){return j(E)?E:`#ff69b4`}function A(){let e=d.profileData||{},t=d.currentUser||{};return typeof e.favoriteColor==`string`&&j(e.favoriteColor)?e.favoriteColor:typeof t.favoriteColor==`string`&&j(t.favoriteColor)?t.favoriteColor:`#3B82F6`}function j(e){return typeof e==`string`&&/^#[0-9A-Fa-f]{6}$/.test(e)}function ce(e,t=`#3B82F6`){if(!e)return t;let n=(d.courses||[]).find(t=>t.id===e);return j(n?.color)?n.color:t}function le(e,t=A()){if(e?.courseId){let t=(d.courses||[]).find(t=>t.id===e.courseId);if(j(t?.color))return t.color}return j(e?.color)?e.color:t}function M(e){try{let t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?`#111`:`#fff`}catch{return`#0e0e0e`}}function ue(e){if(!e)return[];if(Array.isArray(e))return e.map(e=>typeof e==`string`?e:e?.uid).filter(Boolean);if(e instanceof Set)return[...e].map(e=>typeof e==`string`?e:e?.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e==`object`){let t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return ue(t);let n=Object.keys(e).filter(e=>typeof e==`string`&&e.length>=16);if(n.length)return n;let r=Object.values(e).map(e=>e?.uid).filter(Boolean);if(r.length)return r}return[]}function de(){let e=d.currentUser?.uid,t=[d.partyMembers,d.party,d.partyData,d.activeParty,d.shared?.party,d.shared?.partyData,d.shared?.partyMembers],n=[];for(let e of t)if(n=ue(e),n.length)break;return[...new Set(n.filter(Boolean))].filter(t=>t!==e)}var N=Object.create(null);function P(e={},t={}){return typeof t.displayName==`string`&&t.displayName.trim()?t.displayName.trim():typeof t.name==`string`&&t.name.trim()?t.name.trim():typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():typeof e.name==`string`&&e.name.trim()?e.name.trim():`Usuario`}function F(e={},t={}){return typeof t.favoriteColor==`string`&&j(t.favoriteColor)?t.favoriteColor:typeof e.favoriteColor==`string`&&j(e.favoriteColor)?e.favoriteColor:`#64748b`}async function fe(e){if(!e)return{name:`Usuario`,favoriteColor:`#64748b`};if(N[e])return N[e];try{let n=t(f,`users`,e),r=t(f,`users`,e,`profile`,`profile`),[a,o]=await Promise.all([i(n),i(r)]),s=a.exists()&&a.data()||{},c=o.exists()&&o.data()||{},l={name:P(s,c),favoriteColor:F(s,c)};return N[e]=l,l}catch(t){return console.warn(`cal_loadMemberProfile error`,t),N[e]={name:`Usuario`,favoriteColor:`#64748b`},N[e]}}async function pe(){let e=de();if(!e.length)return[];let t=await Promise.all(e.map(e=>fe(e)));return e.map((e,n)=>({uid:e,name:t[n]?.name||`Usuario`,favoriteColor:t[n]?.favoriteColor||`#64748b`}))}async function I(){let e=p(`calendarPartyPicker`);if(!e)return;let t=await pe();if(!t.length){e.innerHTML=`<div class="muted">No hay integrantes disponibles en tu party.</div>`;return}e.innerHTML=t.map(e=>{let t=e.uid===D;return`
      <button
        class="calendar-party-chip ${t?`active`:``}"
        data-uid="${m(e.uid)}"
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
        <span style="font-weight:600;">${m(e.name)}</span>
      </button>
    `}).join(``),e.querySelectorAll(`.calendar-party-chip`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.uid;t&&(D=t,await I(),await z())})})}function me(){let e=p(`calFilterBtn`),t=p(`calFilterMenu`),n=p(`calFilterChkCourse`),r=p(`calFilterChkPersonal`);if(!e||!t||!n||!r)return;let i=()=>{n.checked=!!S.course,r.checked=!!S.personal};e.addEventListener(`click`,e=>{e.stopPropagation(),t.classList.toggle(`hidden`),i()}),n.addEventListener(`change`,()=>{S.course=!!n.checked,Y()}),r.addEventListener(`change`,()=>{S.personal=!!r.checked,Y()}),document.addEventListener(`click`,n=>{!t.contains(n.target)&&n.target!==e&&t.classList.add(`hidden`)}),i()}function he(){C||(C=!0,ve(),ye(),me(),H(),W(),J(),G(),be(),Se(),document.addEventListener(`pair:ready`,async()=>{await I(),await z()}),document.addEventListener(`pair:ready`,async()=>{await V(),K()}),document.addEventListener(`profile:changed`,()=>{Y(),q()}),document.addEventListener(`profile:ready`,()=>{Y(),q()}),I(),z(),V(),xe())}function L(){C||he()}function ge(){L(),v&&=(v(),null),be(),Se(),W(),G(),K(),D&&z(),V()}function _e(){L(),Y(),J(),X(),q()}document.readyState===`loading`?window.addEventListener(`DOMContentLoaded`,L):L(),document.addEventListener(`route:calendario`,L),document.addEventListener(`semester:changed`,()=>{C&&ge()}),document.addEventListener(`courses:changed`,()=>{C&&_e()});function ve(){let e=p(`page-calendario`);e&&(e.innerHTML=`
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
  `)}function ye(){p(`calPrev`)?.addEventListener(`click`,()=>{_=Ie(_,-1),R(),W(),G(),K()}),p(`calNext`)?.addEventListener(`click`,()=>{_=Ie(_,1),R(),W(),G(),K()}),p(`calToday`)?.addEventListener(`click`,()=>{_=new Date,R(),W(),G(),K()}),p(`calImportGoogle`)?.addEventListener(`click`,De),R()}function R(){let e=_.getFullYear(),t=_.getMonth(),n=[`enero`,`febrero`,`marzo`,`abril`,`mayo`,`junio`,`julio`,`agosto`,`septiembre`,`octubre`,`noviembre`,`diciembre`],r=p(`calTitle`);r&&(r.textContent=`Calendario · ${n[t][0].toUpperCase()}${n[t].slice(1)} ${e}`)}function be(){let e=p(`calActiveSem`);e&&(e.textContent=d.activeSemesterData?.label||`—`)}function xe(){let e=p(`cal-subtab-propio`),t=p(`cal-subtab-compartido`),n=p(`cal-subtab-combinado`),r=p(`cal-propio`),i=p(`cal-compartido`),a=p(`cal-combinado`);function o(){e.classList.add(`active`),t.classList.remove(`active`),n.classList.remove(`active`),r.classList.remove(`hidden`),i.classList.add(`hidden`),a.classList.add(`hidden`)}async function s(){if(t.classList.add(`active`),e.classList.remove(`active`),n.classList.remove(`active`),i.classList.remove(`hidden`),r.classList.add(`hidden`),a.classList.add(`hidden`),await I(),G(),!D){p(`calSharedHint`).textContent=`Selecciona un integrante de tu party para ver su calendario.`;return}p(`calSharedHint`).textContent=``,await z()}async function c(){await V(),n.classList.add(`active`),e.classList.remove(`active`),t.classList.remove(`active`),a.classList.remove(`hidden`),r.classList.add(`hidden`),i.classList.add(`hidden`),K(),await Ae()}e?.addEventListener(`click`,o),t?.addEventListener(`click`,s),n?.addEventListener(`click`,c),o()}function Se(){if(v){try{v()}catch{}v=null}if(y){try{y()}catch{}y=null}if(b=[],x=[],Y(),J(),!d.currentUser||!d.activeSemesterId)return;let e=d.currentUser.uid,t=d.activeSemesterId;v=l(r(u(f,`users`,e,`semesters`,t,`calendar`),n(`date`,`asc`)),n=>{d.currentUser?.uid!==e||d.activeSemesterId!==t||(b=n.docs.map(e=>({id:e.id,...e.data()})),Y(),J())}),y=l(r(u(f,`users`,e,`semesters`,t,`courses`),n(`name`,`asc`)),n=>{d.currentUser?.uid!==e||d.activeSemesterId!==t||(x=n.docs.map(e=>({id:e.id,...e.data()})),J())})}async function z(){B(),T=[],E=`#ff69b4`,G();let e=D;if(!e){p(`calSharedHint`).textContent=`Selecciona un integrante de tu party para ver su calendario.`;return}if(!await g(e,`calendario`)){B(),T=[],G();let e=p(`calSharedGrid`);e&&(e.innerHTML=h(`su calendario`)),p(`calSharedHint`).textContent=``;return}if(p(`calSharedHint`).textContent=``,!await we())return;w&&=(w(),null);let n=l(t(f,`users`,e),async t=>{let n=t.exists()&&t.data()||{},r=N[e]||{},i={displayName:n.displayName,name:n.name,favoriteColor:n.favoriteColor},a={displayName:r._profDisplayName,name:r._profName,favoriteColor:r._profFavoriteColor},o={name:P(i,a),favoriteColor:F(i,a),_rootDisplayName:n.displayName||null,_rootName:n.name||null,_rootFavoriteColor:n.favoriteColor||null,_profDisplayName:r._profDisplayName||null,_profName:r._profName||null,_profFavoriteColor:r._profFavoriteColor||null};N[e]=o,j(o.favoriteColor)&&(E=o.favoriteColor),X(),q(),await I()}),r=l(t(f,`users`,e,`profile`,`profile`),async t=>{let n=t.exists()&&t.data()||{},r=N[e]||{},i={displayName:r._rootDisplayName,name:r._rootName,favoriteColor:r._rootFavoriteColor},a={displayName:n.displayName,name:n.name,favoriteColor:n.favoriteColor},o={name:P(i,a),favoriteColor:F(i,a),_rootDisplayName:r._rootDisplayName||null,_rootName:r._rootName||null,_rootFavoriteColor:r._rootFavoriteColor||null,_profDisplayName:n.displayName||null,_profName:n.name||null,_profFavoriteColor:n.favoriteColor||null};N[e]=o,j(o.favoriteColor)&&(E=o.favoriteColor),X(),q(),await I()});w=()=>{try{n?.()}catch{}try{r?.()}catch{}}}function B(){te&&=(te(),null),ne&&=(ne(),null),w&&=(w(),null)}function Ce(){for(let[,e]of O.entries())try{e?.()}catch{}O.clear(),k.clear()}async function V(){Ce();let i=de();if(!i.length){q();return}let a=d.activeSemesterData?.label||null;if(!a){q();return}for(let o of i)try{if(!await g(o,`calendario`)){k.set(o,[]);continue}await fe(o);let i=l(t(f,`users`,o),async e=>{let t=e.exists()&&e.data()||{},n=N[o]||{},r={displayName:t.displayName,name:t.name,favoriteColor:t.favoriteColor},i={displayName:n._profDisplayName,name:n._profName,favoriteColor:n._profFavoriteColor};N[o]={name:P(r,i),favoriteColor:F(r,i),_rootDisplayName:t.displayName||null,_rootName:t.name||null,_rootFavoriteColor:t.favoriteColor||null,_profDisplayName:n._profDisplayName||null,_profName:n._profName||null,_profFavoriteColor:n._profFavoriteColor||null},q(),await I()}),s=l(t(f,`users`,o,`profile`,`profile`),async e=>{let t=e.exists()&&e.data()||{},n=N[o]||{},r={displayName:n._rootDisplayName,name:n._rootName,favoriteColor:n._rootFavoriteColor},i={displayName:t.displayName,name:t.name,favoriteColor:t.favoriteColor};N[o]={name:P(r,i),favoriteColor:F(r,i),_rootDisplayName:n._rootDisplayName||null,_rootName:n._rootName||null,_rootFavoriteColor:n._rootFavoriteColor||null,_profDisplayName:t.displayName||null,_profName:t.name||null,_profFavoriteColor:t.favoriteColor||null},q(),await I()}),c=await e(u(f,`users`,o,`semesters`)),d=null;c.forEach(e=>{(e.data()?.label||``).trim()===a&&(d=e.id)});let p=null;d?p=l(r(u(f,`users`,o,`semesters`,d,`calendar`),n(`date`,`asc`)),e=>{k.set(o,e.docs.map(e=>({id:e.id,...e.data(),ownerUid:o}))),q()}):(k.set(o,[]),q()),O.set(o,()=>{try{i?.()}catch{}try{s?.()}catch{}try{p?.()}catch{}})}catch(e){console.warn(`subscribeCombinedPartyMembers error`,o,e),k.set(o,[])}q()}async function we(){let t=D;if(!t)return null;let n=d.activeSemesterData?.label||null;if(!n)return p(`calSharedHint`).textContent=`No tienes semestre activo seleccionado.`,null;try{let r=await e(u(f,`users`,t,`semesters`)),i=null;if(r.forEach(e=>{let t=(e.data()?.label||``).trim();t===n&&(i={id:e.id,label:t})}),d.shared=d.shared||{},d.shared.calendar=d.shared.calendar||{},i)return d.shared.calendar.semId=i.id,p(`calSharedHint`).textContent=``,await Te(i.id),i.id;d.shared.calendar.semId=null;let a=p(`calSharedGrid`);return a&&(a.innerHTML=`<div class="muted">Esta persona no tiene el semestre <b>${m(n)}</b> creado.</div>`),p(`calSharedHint`).textContent=`Se intenta mostrar el mismo semestre activo que tienes tú.`,null}catch(e){return console.error(`populateSharedSemesters error`,e),p(`calSharedHint`).textContent=`Error al cargar el calendario compartido.`,null}}async function Te(e){B(),T=[],G();let t=D;!t||!e||(ne=l(r(u(f,`users`,t,`semesters`,e,`courses`),n(`name`)),e=>{e.docs.map(e=>({id:e.id,...e.data()})),X()}),te=l(r(u(f,`users`,t,`semesters`,e,`calendar`),n(`date`,`asc`)),e=>{T=e.docs.map(e=>({id:e.id,...e.data()})),X()}))}function H(){if(p(`calModal`))return;let e=document.createElement(`div`);e.id=`calModal`,e.className=`modal`,e.innerHTML=`
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

      <div class="row" style="gap:10px; margin-top:8px">
  <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
    <input type="checkbox" id="calEvtIsPersonal" />
    <span>Es evento personal</span>
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
  `,document.body.appendChild(e);let n=()=>e.classList.remove(`active`);p(`calModalBackdrop`).addEventListener(`click`,n),p(`calEvtCancel`).addEventListener(`click`,n);let r=p(`calEvtCourse`),i=p(`calEvtIsPersonal`);function a(){!r||!i||(i.checked?(r.value=``,r.disabled=!0,r.style.opacity=`0.6`):(r.disabled=!1,r.style.opacity=`1`))}i?.addEventListener(`change`,a),r?.addEventListener(`change`,()=>{r.value&&(i.checked=!1,a())}),p(`calEvtSave`).addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}let r=(p(`calEvtTitle`).value||``).trim(),i=p(`calEvtDate`).value||``,a=p(`calEvtStart`).value||null,c=p(`calEvtEnd`).value||null,l=!!p(`calEvtIsPersonal`)?.checked,m=l?null:p(`calEvtCourse`).value||null,h=p(`calEvtRepeat`).value||``,g=p(`calEvtPersistent`).value===`true`,_=l?`personal`:`course`,v=m?ce(m):A();if(!r)return alert(`Ingresa un título.`);if(!i)return alert(`Selecciona una fecha.`);let y=e.dataset.editingId||null,b=u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`);try{y?(await s(t(b,y),{title:r,date:i,start:a,end:c,courseId:m,kind:_,color:v,repeat:h?{every:h,interval:1}:null,persistent:g,updatedAt:Date.now()}),console.log(`[Calendar] Evento actualizado:`,r)):(await o(b,{title:r,date:i,start:a,end:c,courseId:m,kind:_,color:v,repeat:h?{every:h,interval:1}:null,persistent:g,createdAt:Date.now()}),console.log(`[Calendar] Evento creado:`,r)),n()}catch(e){console.error(e),alert(`No se pudo guardar el evento.`)}finally{e.dataset.editingId=``}})}function Ee(){if(p(`gcalImportModal`))return;let e=document.createElement(`div`);e.id=`gcalImportModal`,e.className=`modal`,e.innerHTML=`
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
  `,document.body.appendChild(e);let t=()=>e.classList.remove(`active`);p(`gcalImportBackdrop`).addEventListener(`click`,t),p(`gcalRangeCancel`).addEventListener(`click`,t),p(`gcalRangeConfirm`).addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres" e inicia sesión.`);return}let e=p(`gcalRangeStart`).value,n=p(`gcalRangeEnd`).value;if(!e||!n){alert(`Selecciona ambas fechas (inicio y término).`);return}let[r,i,a]=e.split(`-`).map(Number),[o,s,c]=n.split(`-`).map(Number),l=new Date(r,i-1,a,0,0,0),u=new Date(o,s-1,c+1,0,0,0);if(u<=l){alert(`La fecha de término debe ser posterior a la de inicio.`);return}try{await nt(l,u),t()}catch(e){console.error(`Error al importar rango desde Google Calendar:`,e),alert(`Ocurrió un error al importar eventos de Google Calendar.`)}})}function De(){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres" e inicia sesión.`);return}Ee();let e=_.getFullYear(),t=_.getMonth(),n=new Date(e,t+1,0).getDate(),r=p(`gcalRangeStart`),i=p(`gcalRangeEnd`);r&&!r.value&&(r.value=Z(e,t+1,1)),i&&!i.value&&(i.value=Z(e,t+1,n)),p(`gcalImportModal`).classList.add(`active`)}function Oe(e){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}H();let t=p(`calModal`),n=p(`calModalTitle`),r=p(`calEvtSave`);t&&(t.dataset.editingId=``),n&&(n.textContent=`Nuevo evento`),r&&(r.textContent=`Guardar`);let i=p(`calEvtDate`);i&&(i.value=e);let a=p(`calEvtTitle`);a&&(a.value=``);let o=p(`calEvtStart`);o&&(o.value=``);let s=p(`calEvtEnd`);s&&(s.value=``);let c=p(`calEvtCourse`);c&&(c.innerHTML=`<option value="">(Sin asignar)</option>`,(d.courses||[]).forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,c.appendChild(t)}));let l=p(`calEvtIsPersonal`);l&&(l.checked=!1),c&&(c.disabled=!1,c.style.opacity=`1`),p(`calModal`).classList.add(`active`)}function U(){let e=new Date;return Z(e.getFullYear(),e.getMonth()+1,e.getDate())}function W(){let e=p(`calGrid`);if(!e)return;let t=(new Date(_.getFullYear(),_.getMonth(),1).getDay()+6)%7,n=new Date(_.getFullYear(),_.getMonth()+1,0).getDate(),r=U();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(_.getFullYear(),_.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="ce-${i}"></div>
        </div>
      `}).join(``)}
  `,e.querySelectorAll(`.cal-cell.day`).forEach(e=>{e.addEventListener(`click`,()=>Oe(e.dataset.date))}),Y(),J()}function ke(e){if(!d.currentUser||!d.activeSemesterId){alert(`Primero activa un semestre en la pestaña "Semestres".`);return}H();let t=p(`calModal`),n=p(`calModalTitle`),r=p(`calEvtSave`);t.dataset.editingId=e.id,n.textContent=`Editar evento`,r.textContent=`Guardar cambios`,p(`calEvtTitle`).value=e.title||``,p(`calEvtDate`).value=e.date||``,p(`calEvtStart`).value=e.start||``,p(`calEvtEnd`).value=e.end||``,p(`calEvtRepeat`).value=e.repeat?.every||``,p(`calEvtPersistent`).value=e.persistent?`true`:``;let i=p(`calEvtCourse`);i.innerHTML=`<option value="">(Sin asignar)</option>`,(d.courses||[]).forEach(t=>{let n=document.createElement(`option`);n.value=t.id,n.textContent=t.name,t.id===e.courseId&&(n.selected=!0),i.appendChild(n)});let a=p(`calEvtIsPersonal`),o=e.kind||(e.courseId?`course`:`personal`);a&&(a.checked=o===`personal`),i&&(o===`personal`?(i.value=``,i.disabled=!0,i.style.opacity=`0.6`):(i.disabled=!1,i.style.opacity=`1`)),t.classList.add(`active`)}function G(){let e=p(`calSharedGrid`);if(!e)return;let t=(new Date(_.getFullYear(),_.getMonth(),1).getDay()+6)%7,n=new Date(_.getFullYear(),_.getMonth()+1,0).getDate(),r=U();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(_.getFullYear(),_.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="sce-${i}"></div>
        </div>
      `}).join(``)}
  `,X()}function K(){let e=p(`calCombinedGrid`);if(!e)return;let t=(new Date(_.getFullYear(),_.getMonth(),1).getDay()+6)%7,n=new Date(_.getFullYear(),_.getMonth()+1,0).getDate(),r=U();e.innerHTML=`
    ${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`,`Dom`].map(e=>`<div class="cal-cell head">${e}</div>`).join(``)}

    ${Array.from({length:t}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join(``)}

    ${Array.from({length:n}).map((e,t)=>{let n=t+1,i=Z(_.getFullYear(),_.getMonth()+1,n),a=i===r;return`
        <div class="cal-cell day ${a?`cal-today`:``}" data-date="${i}">
          <div class="cal-daytop">
            <div class="cal-daynum">${n}</div>
            ${a?`<span class="cal-today-badge">Hoy</span>`:``}
          </div>
          <div class="cal-events" id="bce-${i}"></div>
        </div>
      `}).join(``)}
  `,q()}function q(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`bce-`)&&(e.innerHTML=``)});let e=`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,`0`)}`,t=b.filter(t=>String(t.date||``).startsWith(e)).map(e=>({...e,isMine:!0,ownerUid:d.currentUser?.uid||null})),n=[];for(let[t,r]of k.entries())for(let i of r||[])String(i.date||``).startsWith(e)&&n.push({...i,isMine:!1,ownerUid:t});[...t,...n].forEach(e=>{let t=p(`bce-`+e.date);if(!t)return;let n=`#64748b`;if(e.isMine)n=A();else{let t=N[e.ownerUid]||{};n=j(t.favoriteColor)?t.favoriteColor:`#64748b`}let r=M(n),i=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,a=document.createElement(`div`);a.className=`cal-evt`,a.textContent=`${i}${e.title||`(sin título)`}`,a.style.background=n,a.style.color=r,a.style.opacity=e.isMine?1:.75,a.style.border=`1px solid rgba(0,0,0,0.25)`,t.appendChild(a)})}async function Ae(){let e=p(`calCombinedRemindersList`);if(e){e.innerHTML=`<div class="loading"></div>`;try{let t=await Le({range:`today`}),n=d.pairOtherUid?await Ve({range:`today`}):[],r=[...t.map(e=>({...e,owner:`Tú`})),...n.map(e=>({...e,owner:`Dúo`}))].sort((e,t)=>(e.datetime||0)-(t.datetime||0));e.innerHTML=r.length?r.map(e=>`
          <div class="grade-item">
            <div>
              <strong>${m(e.title||`(sin título)`)}</strong>
              <div class="muted">${m(e.owner)} · ${m(e.datetime?.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})||``)}</div>
            </div>
          </div>
        `).join(``):`<div class="muted">Sin recordatorios para hoy.</div>`}catch(t){console.error(`loadCombinedReminders`,t),e.innerHTML=`<div class="muted">Error al cargar recordatorios.</div>`}}}function je(e){let[t,n,r]=String(e||``).split(`-`).map(Number);return!t||!n||!r?null:{y:t,m:n,d:r}}function Me(e,t){return new Date(e,t,0).getDate()}function Ne(e,t,n){let r=je(e);if(!r)return null;let i=r.y,a=r.m,o=r.d;if(t===`day`){let e=new Date(i,a-1,o);return e.setDate(e.getDate()+n),Z(e.getFullYear(),e.getMonth()+1,e.getDate())}if(t===`month`){let e=i*12+(a-1)+n;return i=Math.floor(e/12),a=e%12+1,o=Math.min(r.d,Me(i,a)),Z(i,a,o)}return t===`year`?(i=r.y+n,o=Math.min(r.d,Me(i,a)),Z(i,a,o)):null}function Pe(e){let t=[];for(let n of e){if(t.push(n),!n.repeat?.every)continue;let e=n.repeat.every,r=Number(n.repeat.interval||1);for(let i=1;i<=24;i++){let a=Ne(n.date,e,i*r);a&&t.push({...n,date:a})}}return t}function J(){let e=p(`calLegend`);if(!e)return;let t=(x||[]).filter(e=>e?.name&&j(e?.color)).map(e=>({id:e.id,name:e.name,color:e.color}));if(!t.length){e.innerHTML=``;return}e.innerHTML=`
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
        <span>${m(e.name)}</span>
      </div>
    `).join(``)}
  `}function Fe(e){return new Promise(t=>{document.getElementById(`calDeleteModal`)?.remove();let n=document.createElement(`div`);n.id=`calDeleteModal`,n.style.cssText=`
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
          ¿Eliminar "<b>${m(e||`evento`)}</b>"?
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button id="calDeleteCancel" class="ghost">Cancelar</button>
          <button id="calDeleteConfirm" class="primary" style="background:#ef4444;border:none;">
            Eliminar
          </button>
        </div>
      </div>
    `,document.body.appendChild(n);let r=e=>{n.remove(),t(e)};n.querySelector(`#calDeleteCancel`)?.addEventListener(`click`,()=>r(!1)),n.querySelector(`#calDeleteConfirm`)?.addEventListener(`click`,()=>r(!0)),n.addEventListener(`click`,e=>{e.target===n&&r(!1)})})}function Y(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`sce-`)||(e.innerHTML=``)});let e=`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,`0`)}`,n=Pe(b).filter(t=>String(t.date||``).startsWith(e));n=n.filter(e=>{let t=e.kind||(e.courseId?`course`:`personal`);return!(t===`course`&&!S.course||t===`personal`&&!S.personal)}),n.forEach(e=>{let n=p(`ce-`+e.date);if(!n)return;let r=le(e,A()),i=M(r),a=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,o=document.createElement(`div`);o.className=`cal-evt`,o.style.background=r,o.style.color=i,o.style.border=`1px solid rgba(0,0,0,0.25)`,o.style.position=`relative`,o.style.cursor=`pointer`;let s=document.createElement(`span`);s.textContent=`${a}${e.title||`(sin título)`}`,o.appendChild(s);let l=document.createElement(`span`);l.textContent=`✕`,l.className=`cal-del`,l.title=`Eliminar evento`,l.style.position=`absolute`,l.style.top=`2px`,l.style.right=`4px`,l.style.fontWeight=`bold`,l.style.color=`#fff8`,l.style.cursor=`pointer`,l.addEventListener(`click`,async n=>{if(n.stopPropagation(),!(!d.currentUser||!d.activeSemesterId||!e.id)&&await Fe(e.title))try{await c(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`,e.id))}catch(e){console.error(e)}}),o.appendChild(l),o.addEventListener(`click`,t=>{t.stopPropagation(),ke(e)}),n.appendChild(o)})}function X(){document.querySelectorAll(`.cal-events`).forEach(e=>{e.id?.startsWith(`sce-`)&&(e.innerHTML=``)});let e=`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,`0`)}`;T.filter(t=>String(t.date||``).startsWith(e)).forEach(e=>{let t=p(`sce-`+e.date);if(!t)return;let n=se(),r=M(n),i=e.start&&e.end?`${e.start}–${e.end} · `:e.start?`${e.start} · `:``,a=document.createElement(`div`);a.className=`cal-evt`,a.textContent=`${i}${e.title||`(sin título)`}`,a.style.background=n,a.style.color=r,a.style.border=`1px solid rgba(0,0,0,0.25)`,t.appendChild(a)})}function Ie(e,t){return new Date(e.getFullYear(),e.getMonth()+t,1)}function Z(e,t,n){return`${e}-${String(t).padStart(2,`0`)}-${String(n).padStart(2,`0`)}`}async function Le(t={}){if(!d.currentUser)throw Error(`No logueado`);let{range:n=`today`,dates:r,months:i,years:a,ranges:o}=t,s=(await e(u(f,`users`,d.currentUser.uid,`reminders`))).docs.map(e=>{let t=e.data();return{id:e.id,...t,datetime:$(t.datetime)}});if(s=s.filter(e=>!e.suspended),Array.isArray(o)&&o.length>0){let e=o.map(e=>{let t=$(e.start),n=$(e.end);return!t||!n?null:{start:t,end:n}}).filter(Boolean);return s=s.filter(t=>t.datetime&&e.some(e=>t.datetime>=e.start&&t.datetime<e.end)),s}if(Array.isArray(r)&&r.length>0){let e=new Set(r.map(e=>tt(e)).filter(Boolean));return s=s.filter(t=>{if(!t.datetime)return!1;let n=tt(t.datetime);return e.has(n)}),s}if(Array.isArray(i)&&i.length>0){let e=i.map(e=>{if(typeof e==`string`){let[t,n]=e.split(`-`).map(Number);return!t||!n?null:{year:t,month:n}}else if(e&&typeof e==`object`){let t=Number(e.year??e.y),n=Number(e.month??e.m);return!t||!n?null:{year:t,month:n}}return null}).filter(Boolean);return s=s.filter(t=>{if(!t.datetime)return!1;let n=t.datetime.getFullYear(),r=t.datetime.getMonth()+1;return e.some(e=>e.year===n&&e.month===r)}),s}if(Array.isArray(a)&&a.length>0){let e=new Set(a.map(e=>Number(e)));return s=s.filter(t=>t.datetime&&e.has(t.datetime.getFullYear())),s}let c=new Date;if(n===`today`){let e=new Date(c.getFullYear(),c.getMonth(),c.getDate()),t=new Date(c.getFullYear(),c.getMonth(),c.getDate()+1);return s.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(n===`week`){let e=new Date(c.getFullYear(),c.getMonth(),c.getDate()-c.getDay()),t=new Date(e);return t.setDate(e.getDate()+7),s.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(n===`month`){let e=new Date(c.getFullYear(),c.getMonth(),1),t=new Date(c.getFullYear(),c.getMonth()+1,1);return s.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}return s}async function Re(e){if(!d.currentUser)throw Error(`No logueado`);return await s(t(f,`users`,d.currentUser.uid,`reminders`,e),{suspended:!1,updatedAt:Date.now()}),{ok:!0}}async function ze(){if(!d.currentUser)throw Error(`No logueado`);return(await e(r(u(f,`users`,d.currentUser.uid,`reminders`),a(`suspended`,`==`,!0)))).docs.map(e=>({id:e.id,...e.data()}))}async function Be({reminderId:e}){if(!d.currentUser)throw Error(`No logueado`);if(!e)throw Error(`Falta ID`);return await s(t(f,`users`,d.currentUser.uid,`reminders`,e),{suspended:!0,updatedAt:Date.now()}),{ok:!0}}async function Ve({range:t=`today`}={}){if(!d.pairOtherUid)throw Error(`No tienes dúo`);let n=await e(u(f,`users`,d.pairOtherUid,`reminders`)),r=e=>e?typeof e==`number`?new Date(e):e.toDate?e.toDate():new Date(e):null,i=n.docs.map(e=>{let t=e.data();return{id:e.id,...t,datetime:r(t.datetime)}}),a=new Date;if(t===`today`){let e=new Date(a.getFullYear(),a.getMonth(),a.getDate()),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()+1);return i.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}if(t===`week`){let e=new Date(a.getFullYear(),a.getMonth(),a.getDate()-a.getDay()),t=new Date(e);return t.setDate(e.getDate()+7),i.filter(n=>n.datetime&&n.datetime>=e&&n.datetime<t)}return i}var He=`873375198212-seb8ne2elgua1gglus8vkj610ddsntt5.apps.googleusercontent.com`,Ue=`AIzaSyDw7nAwkKuroNgmaE0lzslWhK7S0P4tfa8`,We=[`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`],Ge=`https://www.googleapis.com/auth/calendar.readonly`,Ke=!1,qe=!1,Q=null;function Je(){return new Promise((e,t)=>{if(window.gapi&&window.gapi.load)return e();let n=document.createElement(`script`);n.src=`https://apis.google.com/js/api.js`,n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(Error(`No se pudo cargar gapi`)),document.head.appendChild(n)})}function Ye(){return new Promise((e,t)=>{if(window.google&&window.google.accounts)return e();let n=document.createElement(`script`);n.src=`https://accounts.google.com/gsi/client`,n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(Error(`No se pudo cargar Google Identity Services`)),document.head.appendChild(n)})}async function Xe(){Ke||=(await Je(),await new Promise(e=>{window.gapi.load(`client`,e)}),await window.gapi.client.init({apiKey:Ue,discoveryDocs:We}),!0)}async function Ze(){qe&&Q||(await Ye(),Q=window.google.accounts.oauth2.initTokenClient({client_id:He,scope:Ge,callback:()=>{}}),qe=!0)}async function Qe(){return await Ze(),new Promise((e,t)=>{Q.callback=n=>{if(n.error){console.error(`[OAuth error]`,n),t(n);return}e(n.access_token)},Q.requestAccessToken({prompt:``})})}async function $e(e,t){await Xe();let n=await Qe();window.gapi.client.setToken({access_token:n});let r=await window.gapi.client.calendar.events.list({calendarId:`primary`,timeMin:e.toISOString(),timeMax:t.toISOString(),showDeleted:!1,singleEvents:!0,orderBy:`startTime`});return console.log(`[Calendar] Respuesta completa de Google:`,r),r.result.items||[]}function et(e){if(e.start&&e.start.date&&!e.start.dateTime)return{date:e.start.date,startTime:null,endTime:null,allDay:!0};let t=new Date(e.start?.dateTime||e.start?.date),n=new Date(e.end?.dateTime||e.end?.date||t),r=Z(t.getFullYear(),t.getMonth()+1,t.getDate()),i=e=>String(e).padStart(2,`0`);return{date:r,startTime:`${i(t.getHours())}:${i(t.getMinutes())}`,endTime:`${i(n.getHours())}:${i(n.getMinutes())}`,allDay:!1}}function $(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e==`number`)return new Date(e);if(typeof e==`string`){let t=new Date(e);return isNaN(t)?null:t}return e.toDate?e.toDate():null}function tt(e){let t=$(e);return t?Z(t.getFullYear(),t.getMonth()+1,t.getDate()):null}async function nt(e,t){if(!d.currentUser||!d.activeSemesterId)throw Error(`Sin usuario o semestre activo`);try{let n=await $e(e,t);if(!n.length){alert(`No se encontraron eventos en tu Google Calendar para el rango seleccionado.`);return}let r=new Set((b||[]).filter(e=>e.gcalId).map(e=>e.gcalId)),i=u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`calendar`),a=0,s=[];for(let e of n){if(r.has(e.id))continue;let{date:t,startTime:n,endTime:c,allDay:l}=et(e);if(!t)continue;let u={title:e.summary||`(sin título)`,date:t,start:l?null:n,end:l?null:c,allDay:!!l,courseId:null,color:null,source:`google`,gcalId:e.id,createdAt:Date.now()};s.push(o(i,u)),a++}if(!s.length){alert(`Los eventos de ese rango ya estaban importados.`);return}await Promise.all(s),alert(`Se importaron ${a} evento(s) desde tu Google Calendar para el rango seleccionado.`)}catch(e){console.error(`Error al importar Google Calendar:`,e),alert(`Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.`)}}export{ae as clearCalendarUI,he as initCalendar,Ve as listPairReminders,Le as listReminders,ze as listSuspendedReminders,ge as onActiveSemesterChanged,_e as onCoursesChanged,re as registerCalendarUnsub,Re as resumeReminder,oe as showCalendarUI,ie as stopCalendarSub,Be as suspendReminder};