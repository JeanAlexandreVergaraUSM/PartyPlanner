import{a as e,b as t,c as n,d as r,f as i,i as a,n as o,p as s,r as c,s as l,y as u}from"./index.esm-DxDnhweQ.js";import{c as d,d as f,o as p}from"./index-CFfnISX6.js";import{n as m,t as h}from"./privacy-D9i72lKU.js";import{bindExportButtons as g}from"./export-XncWc2Mv.js";var _=!1,v=null,y=null,b=new Map,x=new Map,S=[],C=[],w=new Map,T=!1,E=null,D=!1,O=`#22c55e`,k=`#ff69b4`,ee=!1,te=null,ne=null,re=null,ie=[],A=[],ae=null,j=`USM`,M={},N=new Map,oe=new Map,se=null;function ce(){let e={};for(let[t,n]of(x||new Map).entries())e[t]=n||[];let t={};for(let[e,n]of(w||new Map).entries())t[e]=n;return JSON.stringify({slots:E||null,items:C||[],courses:S||[],defs:e,selected:t})}function le(){if(!y)return!1;try{return ce()!==y}catch{return!0}}function ue(){se||=requestAnimationFrame(()=>{se=null,[`schedPartyBusyCombined`,`schedPartyBusy`].filter(e=>document.getElementById(e)).forEach(e=>an(e)),[`busyLegendCombined`,`busyLegend`].filter(e=>document.getElementById(e)).forEach(e=>ln(e))})}var P=!1,de=null,fe=80,pe=28,F=[],me=[],I=[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`];function he(){return document.getElementById(`parEditModal`)?.style.display===`flex`?document.getElementById(`parEditPanel`):document.getElementById(`simModal`)?.style.display===`flex`?document.getElementById(`simModalPanel`):document.getElementById(`gr-simDrawer`)||null}function ge(e){if(!P)return;let t=e.clientY,n=window.innerHeight,r=0;if(t<fe){let e=(fe-t)/fe;r=-Math.ceil(pe*e)}else if(t>n-fe){let e=(t-(n-fe))/fe;r=Math.ceil(pe*e)}r===0||de!==null||(de=requestAnimationFrame(()=>{let e=he();e?e.scrollBy({top:r,left:0,behavior:`auto`}):window.scrollBy(0,r),de=null}))}function L(){P=!1,de&&=(cancelAnimationFrame(de),null)}var R={},z=[{label:`1/2`,start:`08:15`,end:`09:25`,lines:[{n:`1`,start:`08:15`,end:`08:50`},{n:`2`,start:`08:50`,end:`09:25`}]},{label:`3/4`,start:`09:40`,end:`10:50`,lines:[{n:`3`,start:`09:40`,end:`10:15`},{n:`4`,start:`10:15`,end:`10:50`}]},{label:`5/6`,start:`11:05`,end:`12:15`,lines:[{n:`5`,start:`11:05`,end:`11:40`},{n:`6`,start:`11:40`,end:`12:15`}]},{label:`7/8`,start:`12:30`,end:`13:40`,lines:[{n:`7`,start:`12:30`,end:`13:05`},{n:`8`,start:`13:05`,end:`13:40`}]},{label:`ALMUERZO`,start:`13:40`,end:`14:40`,lunch:!0},{label:`9/10`,start:`14:40`,end:`15:50`,lines:[{n:`9`,start:`14:40`,end:`15:15`},{n:`10`,start:`15:15`,end:`15:50`}]},{label:`11/12`,start:`16:05`,end:`17:15`,lines:[{n:`11`,start:`16:05`,end:`16:40`},{n:`12`,start:`16:40`,end:`17:15`}]},{label:`13/14`,start:`17:30`,end:`18:40`,lines:[{n:`13`,start:`17:30`,end:`18:05`},{n:`14`,start:`18:05`,end:`18:40`}]},{label:`15/16`,start:`18:50`,end:`20:00`,lines:[{n:`15`,start:`18:50`,end:`19:25`},{n:`16`,start:`19:25`,end:`20:00`}]},{label:`17/18`,start:`20:15`,end:`21:25`,lines:[{n:`17`,start:`20:15`,end:`20:50`},{n:`18`,start:`20:50`,end:`21:25`}]},{label:`19/20`,start:`21:40`,end:`22:50`,lines:[{n:`19`,start:`21:40`,end:`22:15`},{n:`20`,start:`22:15`,end:`22:50`}]}],_e=[B(`1/2`,`08:30`,`09:40`,[`08:30-09:05`,`09:05-09:40`]),B(`3/4`,`10:00`,`11:10`,[`10:00-10:35`,`10:35-11:10`]),B(`5/6`,`11:30`,`12:40`,[`11:30-12:05`,`12:05-12:40`]),{label:`ALMUERZO`,start:`12:40`,end:`14:00`,lunch:!0},B(`7/8`,`14:00`,`15:10`,[`14:00-14:35`,`14:35-15:10`]),B(`9/10`,`15:30`,`16:40`,[`15:30-16:05`,`16:05-16:40`]),B(`11/12`,`17:00`,`18:10`,[`17:00-17:35`,`17:35-18:10`]),B(`13/14`,`18:30`,`19:40`,[`18:30-19:05`,`19:05-19:40`]),B(`15/16`,`20:00`,`21:10`,[`20:00-20:35`,`20:35-21:10`]),B(`17/18`,`21:30`,`22:40`,[`21:30-22:05`,`22:05-22:40`])];function B(e,t,n,r){return{label:e,start:t,end:n,lines:r.map(e=>{let[t,n]=e.split(`-`);return{start:t,end:n}})}}function ve(e){return String(e||``).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().trim().replace(/\s+/g,` `)}function ye(e){return ve(e).replace(/[^a-z0-9]+/g,`_`).replace(/^_+|_+$/g,``)}function be(e){let t=ve(e);return t?t===`umayor`||t.includes(`mayor`)?`UMAYOR`:t===`usm`||t.includes(`utfsm`)||t.includes(`u t f s m`)||t.includes(`u.t.f.s.m`)||t.includes(`federico santa maria`)||t.includes(`santa maria`)?`USM`:`UNI_${ye(t)||`desconocida`}`:``}function V(){return be(d.activeSemesterData?.universityAtThatTime||d.profileData?.university||``)}async function xe(){let e=V();if(R[e]&&Array.isArray(R[e])&&R[e].length)return R[e];if(d.currentUser){let n=await a(t(f,`users`,d.currentUser.uid,`custom_schedules`,e));if(n.exists()){let t=n.data()?.slots||[];if(Array.isArray(t)&&t.length)return R[e]=t,t}}let n=`custom_slots_${e}_${d.currentUser?.uid}`,r=localStorage.getItem(n);if(r)try{let t=JSON.parse(r);if(Array.isArray(t)&&t.length)return R[e]=t,t}catch{}return e===`UMAYOR`?_e:e===`USM`?z:null}function H(e){return typeof e==`string`&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Se(e,t,n){let r=(e||[]).find(e=>e.id===t);return H(r?.color)?r.color:n||`#3B82F6`}function Ce(e){try{let t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?`#111`:`#fff`}catch{return`#0e0e0e`}}var we=null,U=[];function W(){let e=document.getElementById(`simPaletteHost`);if(!e)return;Jt(),e.innerHTML=``;let t=_?Array.isArray(S)?S:[]:Array.isArray(d.courses)?d.courses:[];if(!t.length){let t=document.createElement(`button`);t.type=`button`,t.className=`palette-rect`,t.textContent=`+ Agregar ramo`,t.style.cursor=`pointer`,t.style.borderStyle=`dashed`,t.addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`No hay semestre activo para agregar ramos.`);return}await Je(d.activeSemesterId,{forceFirestore:!1})}),e.appendChild(t);return}Kt(t).forEach(t=>{let n=document.createElement(`div`);n.className=`sim-course-group`,n.dataset.courseId=t.id;let r=H(t.color)?t.color:`#3B82F6`,i=x.get(t.id)||[],a=w.get(t.id)||i[0]?.pid||null;a&&i.find(e=>e.pid===a);let o=t.name,s=document.createElement(`div`);s.className=`palette-rect`,s.setAttribute(`draggable`,`true`),s.dataset.payload=JSON.stringify({type:`course-parallel`,courseId:t.id,pid:a}),s.style.borderColor=r,s.style.boxShadow=`inset 0 0 0 2px rgba(0,0,0,.15)`;let c=document.createElement(`div`);c.className=`label`,c.textContent=o,s.appendChild(c);let l=document.createElement(`button`);l.type=`button`,l.className=`add-par`,l.textContent=`▾`,l.setAttribute(`aria-label`,`Paralelos`),l.addEventListener(`click`,e=>{e.stopPropagation(),Fe(t,l)}),s.appendChild(l),n.appendChild(s),e.appendChild(n)});let n=document.createElement(`button`);n.type=`button`,n.className=`palette-rect`,n.textContent=`+ Agregar ramo`,n.style.cursor=`pointer`,n.style.borderStyle=`dashed`,n.style.opacity=`0.95`,n.addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`No hay semestre activo para agregar ramos.`);return}await Je(d.activeSemesterId,{forceFirestore:!1})}),e.appendChild(n),qt()}var Te=null;function Ee(){if(document.getElementById(`simParMenuStyles`))return;let e=document.createElement(`style`);e.id=`simParMenuStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function De(){if(document.getElementById(`parEditDnDStyles`))return;let e=document.createElement(`style`);e.id=`parEditDnDStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function Oe(){Te&&=(Te.remove(),null)}function ke(){if(document.getElementById(`parEditModal`))return;let e=document.createElement(`div`);e.id=`parEditModal`,e.style.cssText=`position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10090; padding:16px;`,e.innerHTML=`
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
    `,document.body.appendChild(e);let t=()=>{e.style.display=`none`,document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`),L()};document.getElementById(`parEditX`).addEventListener(`click`,t),document.getElementById(`parEditCancel`).addEventListener(`click`,t),e.addEventListener(`click`,n=>{n.target===e&&t()})}async function Ae(e,t){ke();let n=document.getElementById(`parEditModal`),r=document.getElementById(`parEditPanel`),i=document.getElementById(`parEditTitle`),a=document.getElementById(`parEditProf`),o=document.getElementById(`parEditSec`),s=document.getElementById(`parEditChip`),c=document.getElementById(`parEditGrid`),l=document.getElementById(`parEditSave`),u=document.getElementById(`parEditCancel`),d=document.getElementById(`parEditX`),f=e.id,p=x.get(f)||[],m=e=>JSON.parse(JSON.stringify(e||{})),h=t?(e=>p.find(t=>t.pid===e)||null)(t):null,g,v=!1;h?g=m(h):(v=!0,g={courseId:f,pid:`P${p.length+1}`,professor:``,section:``,blocks:[]}),a.value=g.professor||``,o.value=g.section||g.pid||``;let y=()=>{let t=(o.value||``).trim()||g.pid;i.textContent=`${e.name} · ${t}`;let n=s.querySelector(`.drag-txt`);n?n.textContent=`${e.name} · ${t}`:s.textContent=`${e.name} · ${t}`};s.dataset.payload=JSON.stringify({type:`parallel-template`,courseId:f,pid:g.pid});let b=H(e.color)?e.color:`#3B82F6`;s.style.borderColor=b,s.style.background=cn(b,.18),s.style.color=Ce(b),s.style.borderRadius=`999px`,s.style.padding=`10px 14px`,s.style.display=`inline-flex`,s.style.alignItems=`center`,s.style.gap=`10px`,s.style.fontWeight=`900`,s.style.borderWidth=`2px`,s.style.boxShadow=`0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)`,s.style.userSelect=`none`,s.querySelector(`.drag-ico`)||(s.innerHTML=`<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`),o.oninput=y,y(),await je(c,g),De(),document.documentElement.classList.add(`sim-lock`),document.body.classList.add(`sim-lock`),n.style.display=`flex`,requestAnimationFrame(()=>{r&&(r.scrollTop=0),a?.focus()});let S=()=>{l.onclick=null,u.onclick=null,d.onclick=null,n.onclick=null,document.removeEventListener(`keydown`,D),L()},C=()=>{S(),n.style.display=`none`,document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`)},T=()=>C(),E=e=>{e.target===n&&T()},D=e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),T())};d.onclick=T,u.onclick=T,n.onclick=E,document.addEventListener(`keydown`,D),l.onclick=async()=>{if(g.professor=(a.value||``).trim(),g.section=(o.value||``).trim(),v){let e=[...p,m(g)];x.set(f,e)}else h.professor=g.professor,h.section=g.section,h.blocks=m(g.blocks),x.set(f,p);dt(),K(),W(),C(),_&&w.get(f)===g.pid&&await fn(f,g.pid)}}async function je(e,t){let n=V(),r=E||await xe();if(!r){e.innerHTML=`<div class="muted">No hay slots definidos.</div>`;return}e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}

        ${r.map((e,r)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${r}">
            ${bt(e,r,n)}
          </div>
          ${I.map((n,i)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${i}" data-slot="${r}"
                ${e.lunch?`aria-disabled="true"`:``}
                style="${e.lunch?`pointer-events:none; opacity:.65;`:``}">
              ${Me(t,i,r)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,e.querySelectorAll(`.par-placed`).forEach(n=>{n.addEventListener(`dragstart`,e=>{let r=parseInt(n.dataset.day,10),i=parseInt(n.dataset.slot,10),a=n.dataset.pos||`full`;e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-par-block`,courseId:t.courseId,pid:t.pid,from:{day:r,slot:i,pos:a}})),e.dataTransfer.effectAllowed=`move`,P=!0}),n.addEventListener(`dragend`,L);let r=n.querySelector(`.par-x`);r&&r.addEventListener(`click`,r=>{r.stopPropagation();let i=parseInt(n.dataset.day,10),a=parseInt(n.dataset.slot,10),o=n.dataset.pos||`full`,s=t.blocks.findIndex(e=>e.day===i&&e.slot===a&&(e.pos||`full`)===o);s>=0&&t.blocks.splice(s,1),je(e,t)})}),e.querySelectorAll(`.cell.slot`).forEach(n=>{n.classList.contains(`is-lunch`)||(n.addEventListener(`dragover`,e=>{e.preventDefault();let t=n.getBoundingClientRect(),r=e.clientY-t.top,i=t.height/2,a=`full`;r<i-10?a=`top`:r>i+10&&(a=`bottom`),n.dataset.droppos=a,n.classList.add(`over`),n.classList.remove(`hint-top`,`hint-full`,`hint-bottom`),n.classList.add(a===`top`?`hint-top`:a===`bottom`?`hint-bottom`:`hint-full`)}),n.addEventListener(`dragleave`,()=>{n.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`),delete n.dataset.droppos}),n.addEventListener(`drop`,i=>{i.preventDefault(),L();let a=n.dataset.droppos||`full`;n.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`),delete n.dataset.droppos;let o=i.dataTransfer.getData(`text/plain`),s=null;try{s=JSON.parse(o)}catch{}let c=parseInt(n.dataset.day,10),l=parseInt(n.dataset.slot,10),u=r?.[l];if(!(!u||u.lunch||!s)){if(s.type===`move-par-block`){let n=s.from||{},r=t.blocks.findIndex(e=>e.day===Number(n.day)&&e.slot===Number(n.slot)&&(e.pos||`full`)===(n.pos||`full`));if(r<0)return;if(t.blocks.some((e,t)=>t!==r&&e.day===c&&e.slot===l&&(e.pos||`full`)===a)){alert(`Ese espacio ya está ocupado por otro bloque del paralelo.`);return}let i=t.blocks[r];i.day=c,i.slot=l,i.pos=a,i.start=u.start,i.end=u.end,i.hpos=i.hpos||`single`,je(e,t);return}s.type===`parallel-template`&&(t.blocks.findIndex(e=>e.day===c&&e.slot===l&&(e.pos||`full`)===a)>=0||(t.blocks.push({day:c,slot:l,pos:a,hpos:`single`,start:u.start,end:u.end}),je(e,t)))}}))})}function Me(e,t,n){let r=(e.blocks||[]).filter(e=>e.day===t&&e.slot===n);if(!r.length)return``;let i=e=>e===`top`?`pos-top`:e===`bottom`?`pos-bottom`:`pos-full`;return r.map(r=>`
      <div class="par-placed ${i(r.pos||`full`)}"
          draggable="true"
          data-course="${e.courseId}"
          data-pid="${e.pid}"
          data-day="${t}"
          data-slot="${n}"
          data-pos="${r.pos||`full`}">
        ✓
        <button class="par-x" type="button" title="Quitar">×</button>
      </div>
    `).join(``)}async function Ne(t,n){if(!d.currentUser||!d.activeSemesterId)return;let r=(x.get(t)||[]).find(e=>e.pid===n);if(!r)return;let i=u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),a=(await e(i)).docs.filter(e=>e.data()?.courseId===t);for(let e of a)await c(e.ref);let s=await xe();for(let e of r.blocks){let a=s?.[e.slot];!a||a.lunch||await o(i,{courseId:t,day:e.day,slot:e.slot,start:a.start,end:a.end,pos:e.pos||`full`,hpos:e.hpos||`single`,parallelPid:n,displayName:`${d.courses.find(e=>e.id===t)?.name||`Ramo`} · ${r.section||n}`,createdAt:Date.now()})}w.set(t,n)}async function Pe(t){if(!d.currentUser||!d.activeSemesterId)return;let n=(await e(u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`))).docs.filter(e=>e.data()?.courseId===t);for(let e of n)await c(e.ref)}function Fe(e,n){Ee(),Oe();let r=document.createElement(`div`);r.className=`sim-par-menu`;let i=e.id,a=x.get(i)||[],o=(U||[]).some(e=>e.courseId===i),s=w.has(i),l=o||s;r.innerHTML=`
    <div class="head">
      <div class="title">Paralelos de ${Z(e.name||`Ramo`)}</div>
      <div style="display:flex; gap:8px;">
        <button id="simClearFromScheduleBtn"
          class="broombtn danger"
          type="button"
          title="Sacar del horario (mantener en pool)"
          aria-label="Sacar del horario"
          ${l?``:`disabled`}
          style="${l?``:`opacity:.35; cursor:not-allowed;`}"
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
  `,document.body.appendChild(r),Te=r;let u=()=>{document.removeEventListener(`pointerdown`,m,{capture:!0}),document.removeEventListener(`keydown`,h),window.removeEventListener(`scroll`,g,!0),window.removeEventListener(`resize`,v)},p=()=>{Te&&=(Te.remove(),null),u()},m=e=>{!r.contains(e.target)&&!n.contains(e.target)&&p()},h=e=>{e.key===`Escape`&&p()},g=()=>p(),v=()=>p(),y=r.querySelector(`.list`);if(a.length)a.forEach(t=>{let n=document.createElement(`div`);n.className=`item`,n.style.cursor=`default`,n.innerHTML=`
    <div class="row">
      <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
        <div class="pickbox ${w.get(i)===t.pid?`on`:``}" title="Seleccionar paralelo" aria-label="Seleccionar paralelo"></div>

        <div style="min-width:0;">
          <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${Z(t.section||t.pid)}
          </div>
          <div style="opacity:.75; font-weight:800; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${Z(t.professor||`—`)}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="iconbtn" type="button" title="Editar">✏️</button>
        <button class="iconbtn danger" type="button" title="Borrar">✕</button>
      </div>
    </div>
  `;let r=n.querySelector(`.iconbtn:not(.danger)`),a=n.querySelector(`.iconbtn.danger`);n.querySelector(`.pickbox`).addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),w.set(i,t.pid),pt(),K(),_?await fn(i,t.pid):(await Ne(i,t.pid),G()),p()}),n.querySelector(`.row > div`)?.addEventListener(`click`,async n=>{if(!n.target.closest(`.pickbox`)&&!n.target.closest(`.actions`)&&!n.target.closest(`button`)){if(p(),_){await fn(e.id,t.pid);return}Ae(e,t.pid)}}),r.addEventListener(`click`,async n=>{n.stopPropagation(),p(),Ae(e,t.pid)}),a.addEventListener(`click`,async n=>{if(n.stopPropagation(),!await q({title:`Borrar paralelo`,text:`¿Quieres borrar el paralelo ${t.section||t.pid}?`,yesText:`Borrar`,noText:`Cancelar`}))return;let r=(x.get(e.id)||[]).filter(e=>e.pid!==t.pid);x.set(e.id,r),C=C.filter(n=>!(n.courseId===e.id&&n.pid===t.pid)),K(),w.get(e.id)===t.pid&&w.delete(e.id),W(),_&&await $(),p()}),y.appendChild(n)});else{let e=document.createElement(`div`);e.className=`hint`,e.textContent=`Aún no hay paralelos.`,y.appendChild(e)}r.querySelector(`.item.add`).addEventListener(`click`,async()=>{p(),await Ae(e,null)}),r.querySelector(`#simClearFromScheduleBtn`)?.addEventListener(`click`,async()=>{l&&(p(),await Pe(e.id),C=C.filter(t=>t.courseId!==e.id),K(),w.delete(e.id),G(),_&&await $())}),r.querySelector(`#simRemoveCourseBtn`)?.addEventListener(`click`,async()=>{if(await q({title:`Eliminar ramo`,text:`¿Eliminar "${e.name}" del simulador? Esto lo quitará de tu lista de ramos.`,yesText:`Eliminar`,noText:`Cancelar`})){if(p(),_){let t=e.id;S=(S||[]).filter(e=>e.id!==t),C=(C||[]).filter(e=>e.courseId!==t),x.delete(t),w.delete(t),Dt(S),W(),await $();return}if(!(!d.currentUser||!d.activeSemesterId))try{await Pe(e.id),await c(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`courses`,e.id)),C=C.filter(t=>t.courseId!==e.id),K(),x.delete(e.id),w.delete(e.id),d.courses=(d.courses||[]).filter(t=>t.id!==e.id),document.dispatchEvent(new Event(`courses:changed`)),_&&await $()}catch(e){console.error(e),alert(`No se pudo eliminar el ramo.`)}}});let b=n.getBoundingClientRect();r.style.left=`-9999px`,r.style.top=`-9999px`;let T=r.offsetWidth,E=r.offsetHeight,D=b.left,O=b.bottom+8;D=Math.min(D,window.innerWidth-T-8),D=Math.max(D,8),O+E>window.innerHeight-8&&(O=b.top-E-8),O=Math.max(O,8),r.style.left=`${D}px`,r.style.top=`${O}px`,setTimeout(()=>{document.addEventListener(`pointerdown`,m,{capture:!0})},0),document.addEventListener(`keydown`,h),window.addEventListener(`scroll`,g,!0),window.addEventListener(`resize`,v)}function Ie(e){let t=e||`full`;return t===`top`?{a:0,b:.3334}:t===`bottom`?{a:.6666,b:1}:{a:0,b:1}}function Le(e,t){return e.a<t.b&&t.a<e.b}function Re(e){let t=e.map(e=>({...e,_vr:Ie(e.pos)})),n={top:0,full:1,bottom:2};t.sort((e,t)=>{let r=n[e.pos||`full`]??1,i=n[t.pos||`full`]??1;return r===i?String(e.id||``).localeCompare(String(t.id||``)):r-i});let r=[];for(let e of t){let t=!1;for(let n=0;n<r.length;n++){let i=r[n];if(!i.some(t=>Le(e._vr,t._vr))){e._lane=n,i.push(e),t=!0;break}}t||(e._lane=r.length,r.push([e]))}return{blocks:t,laneCount:Math.max(1,r.length)}}function ze(){if(ee)return;ee=!0,He(),wt(),Qe(),kt(),Vt(),Xt(),document.addEventListener(`party:ready`,()=>{p(`subtabCombinado`)?.classList.contains(`active`)&&v()}),document.addEventListener(`party:changed`,()=>{p(`subtabCombinado`)?.classList.contains(`active`)&&v()}),document.addEventListener(`semester:changed`,()=>{p(`subtabCombinado`)?.classList.contains(`active`)&&v()}),document.addEventListener(`profile:changed`,async()=>{let e=d.currentUser?.uid;e&&(M[e]=M[e]||{},d.profileData?.name&&(M[e].name=d.profileData.name),d.profileData?.favoriteColor&&(M[e].color=d.profileData.favoriteColor),p(`subtabCompartido`)?.classList.contains(`active`)&&(await Ht(e,{force:!0}),await Vt()),p(`subtabCombinado`)?.classList.contains(`active`)&&(ln(`busyLegendCombined`),ue()))});let n=p(`subtabPropio`),i=p(`subtabCompartido`),a=p(`subtabCombinado`);b();let o=p(`horarioPropio`),s=p(`horarioCompartido`),l=p(`horarioCombinado`);function m(){n.classList.add(`active`),i.classList.remove(`active`),a.classList.remove(`active`),o.classList.remove(`hidden`),s.classList.add(`hidden`),l.classList.add(`hidden`)}async function h(){i.classList.add(`active`),n.classList.remove(`active`),a.classList.remove(`active`),s.classList.remove(`hidden`),o.classList.add(`hidden`),l.classList.add(`hidden`),await Vt(),d.partyView?.uid&&await Yt(d.partyView.uid),await Xt(),d.partyView?.uid&&d.partyView?.semId?Qt(d.partyView.uid,d.partyView.semId):Q()}async function v(){let t=p(`horarioCombinado`);if(!t)return;t.innerHTML=`
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
  `;let n=document.getElementById(`busy-semSelCombined`);if(n&&d.currentUser){let t=(await e(r(u(f,`users`,d.currentUser.uid,`semesters`)))).docs.map(e=>({id:e.id,label:String(e.data()?.label||e.id).trim()})).sort((e,t)=>t.label.localeCompare(e.label));if(!t.length){n.innerHTML=`<option value="" disabled selected>— sin semestres —</option>`;return}let i=e=>{let t=/^(\d{4})-(1|2)$/.exec(String(e||``).trim());if(!t)return null;let n=parseInt(t[1],10);return parseInt(t[2],10)===1?`${n}-2`:`${n+1}-1`};n.innerHTML=``;for(let e of t){let t=document.createElement(`option`);t.value=e.label,t.textContent=e.label,n.appendChild(t)}let a=d.activeSemesterData?.label||null,o=i(a)||a,s=t.map(e=>e.label),c=o&&s.includes(o)?o:a&&s.includes(a)?a:t[0].label;n.value=c,await tn(c),ln(`busyLegendCombined`),an(`schedPartyBusyCombined`),n.addEventListener(`change`,async()=>{let e=n.value;await tn(e),ln(`busyLegendCombined`),an(`schedPartyBusyCombined`)})}}async function y(){a.classList.add(`active`),n.classList.remove(`active`),i.classList.remove(`active`),l.classList.remove(`hidden`),o.classList.add(`hidden`),s.classList.add(`hidden`),await v()}n.addEventListener(`click`,m),i.addEventListener(`click`,()=>{h()}),a.addEventListener(`click`,y),m(),document.addEventListener(`courses:changed`,()=>{if(_){W();return}We(),G()}),document.addEventListener(`click`,async e=>{let n=e.target.closest(`.block-del-btn`);if(!n)return;let r=n.dataset.id;if(!(!r||!d.currentUser||!d.activeSemesterId)&&confirm(`¿Eliminar este bloque del horario?`))try{await c(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,r))}catch(e){console.error(e),alert(`No se pudo eliminar el bloque.`)}});function b(){let e=p(`subtabPropio`);if(!e)return;let t=e.parentElement;if(!t||document.getElementById(`btnSimSchedule`))return;t.style.display=`flex`,t.style.alignItems=`center`,t.style.gap=`10px`,t.style.flexWrap=`wrap`;let n=document.createElement(`div`);n.style.flex=`1 1 auto`,t.appendChild(n);let r=document.createElement(`button`);r.id=`btnSimSchedule`,r.className=`btn violet`,r.textContent=`Simulador de horario`,r.style.marginLeft=`auto`,t.appendChild(r)}function x(){document.addEventListener(`click`,async e=>{e.target.closest(`#btnSimSchedule`)&&await pn()})}g(),x()}function Be(){if(we&&=(we(),null),v&&=(v(),null),!d.currentUser||!d.activeSemesterId){Ve();return}U=[],G(),v=l(r(u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`courses`),n(`createdAt`)),e=>{d.courses=e.docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`))}),we=l(r(u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`)),e=>{U=e.docs.map(e=>({id:e.id,...e.data()})),G()})}function Ve(){document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove());let e=p(`schedUSM`);e&&(e.innerHTML=`
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `);let t=p(`coursePalette`);t&&(t.innerHTML=`<div class="muted">Selecciona o crea un semestre para ver ramos.</div>`),U=[],F=[]}function He(){let e=p(`horarioPropio`);e.innerHTML=`
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
  `,We(),G()}function Ue(){We(),G()}function We(){let e=p(`coursePalette`);if(!e)return;e.innerHTML=``;let t=Array.isArray(d.courses)?d.courses:[];if(D){let t=document.createElement(`button`);t.type=`button`,t.className=`palette-chip`,t.id=`paletteAddCourseChip`,t.textContent=`+`,t.style.cursor=`pointer`,t.style.fontWeight=`900`,t.style.fontSize=`18px`,t.style.display=`inline-flex`,t.style.alignItems=`center`,t.style.justifyContent=`center`,t.style.minWidth=`44px`,t.style.borderStyle=`dashed`,t.style.opacity=`0.95`,t.addEventListener(`click`,async()=>{await Je(document.getElementById(`sim-semSel`)?.value||d.activeSemesterId)}),e.appendChild(t)}if(!t.length){let t=document.createElement(`div`);t.className=`muted`,t.style.marginLeft=`10px`,t.textContent=D?`Aún no tienes ramos. Presiona + para agregar el primero.`:`Aún no tienes ramos. Agrega ramos desde el simulador.`,e.appendChild(t);return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`palette-chip`,n.setAttribute(`draggable`,`true`),n.dataset.courseId=t.id,n.textContent=t.name;let r=H(t.color)?t.color:`#3B82F6`;n.style.borderColor=r,n.style.boxShadow=`inset 0 0 0 2px rgba(0,0,0,.15)`,e.appendChild(n)})}function Ge(e){document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove()),e.innerHTML=`
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `,p(`btnCreateNewSched`)?.addEventListener(`click`,()=>gt(!1))}async function Ke(e,t){!e||!t||await gn(u(f,`users`,e,`semesters`,t,`schedule`))}async function G(){let e=p(`schedUSM`);if(!e)return;if(!d.currentUser||!d.activeSemesterId){Ve();return}let t=await xe();F=t;let n=V(),r=n===`USM`||n===`UMAYOR`,i=`custom_slots_${n}_${d.currentUser?.uid}`,a=Array.isArray(R[n])&&R[n].length>0;if(document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove()),!t){Ge(e);return}let o=document.createElement(`div`);o.className=`card schedule-controls`,o.style=`padding:12px;text-align:center;margin-bottom:10px;`,r?o.innerHTML=`
    <button id="btnUseDefaultSched" class="btn blue" ${a?``:`disabled`}>
      Usar horario por defecto
    </button>
    <button id="btnCreateCustomSched" class="btn violet" ${a?`disabled`:``}>
      Crear horario personalizado
    </button>
    ${a?`
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    `:``}
    <button id="btnEditBlocksMode" class="btn ${T?`violet`:`violet-outline`}">
      ${T?`✅ Modo edición: ON`:`Editar ramos y salas`}
    </button>
  `:o.innerHTML=`
    <button id="btnCreateCustomSched" class="btn violet" ${a?`disabled`:``}>
      Crear horario personalizado
    </button>
    ${a?`
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    `:``}

    <!-- ✅ NUEVO BOTÓN -->
    <button id="btnEditBlocksMode" class="btn ${T?`violet`:`violet-outline`}">
      ${T?`✅ Modo edición: ON`:`Editar ramos y salas`}
    </button>
  `,e.before(o),p(`btnEditBlocksMode`)?.addEventListener(`click`,()=>{T=!T,G()}),p(`btnCreateCustomSched`)?.addEventListener(`click`,()=>{gt(!1)}),p(`btnUseDefaultSched`)?.addEventListener(`click`,async()=>{localStorage.removeItem(i),await Bt(n),alert(`Se restauró el horario por defecto.`),F=n===`USM`?z:_e,G()}),p(`btnEditCustomSched`)?.addEventListener(`click`,async()=>{let e=localStorage.getItem(i),t=null;if(e)try{t=JSON.parse(e)}catch{}if(!t||t.length===0){alert(`No hay horario personalizado guardado para editar.`);return}confirm(`¿Deseas volver a generar este horario con diferentes bloques o tiempos?`)&&(alert(`Ahora puedes modificar el horario. Se reemplazará el anterior.`),await gt(!0))}),p(`btnDeleteCustomSched`)?.addEventListener(`click`,async()=>{if(await q({title:`Borrar horario`,text:`¿Seguro que deseas borrar tu horario personalizado?`,yesText:`Sí, borrar horario`,noText:`Cancelar`}))try{let e=d.currentUser?.uid,t=d.activeSemesterId;if(!e||!t){alert(`No hay semestre activo.`);return}localStorage.removeItem(i),await Bt(n),delete R[n],F=[],await Ke(e,t),U=[],C=[],b.delete(vt(e,t)),document.dispatchEvent(new Event(`courses:changed`)),alert(`Horario personalizado eliminado. Tus ramos siguen guardados.`),await G()}catch(e){console.error(e),alert(`No se pudo borrar el horario personalizado.`)}}),e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}
        ${t.map((e,t)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${t}">
            ${bt(e,t,n)}

          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}"
                ${e.lunch?`aria-disabled="true"`:``}>
              ${xt(r,t)}

            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,Ot(),e.querySelectorAll(`.placed`).forEach(e=>{if(!e.querySelector(`.block-del-btn`)){let t=document.createElement(`button`);t.className=`block-del-btn`,t.textContent=`×`,t.dataset.id=e.dataset.id,e.appendChild(t)}})}function qe(){if(document.getElementById(`cqModal`))return;let e=document.createElement(`div`);e.id=`cqModal`,e.style.cssText=`
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10060; padding:16px;
    `,e.innerHTML=`
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
    `,document.body.appendChild(e);let t=()=>{e.style.display=`none`};document.getElementById(`cqX`)?.addEventListener(`click`,t),document.getElementById(`cqCancel`)?.addEventListener(`click`,t),e.addEventListener(`click`,n=>{n.target===e&&t()}),document.addEventListener(`keydown`,n=>{e.style.display===`flex`&&n.key===`Escape`&&t()})}async function Je(t=null,{forceFirestore:i=!1}={}){qe();let a=t||d.activeSemesterId;if(!d.currentUser||!a)return alert(`Necesitas seleccionar un semestre para agregar ramos.`),null;let s=document.getElementById(`cqModal`),c=document.getElementById(`cqErr`),l=document.getElementById(`cqName`),p=document.getElementById(`cqCode`),m=document.getElementById(`cqColor`),h=document.getElementById(`cqAsis`),g=document.getElementById(`cqSave`),v=document.getElementById(`cqCancel`),y=document.getElementById(`cqX`);c.style.display=`none`,c.textContent=``,l.value=``,p.value=``,m.value=`#3B82F6`,h.checked=!1,s.style.display=`flex`,setTimeout(()=>l.focus(),0);let b=e=>{c.textContent=e,c.style.display=`block`};return new Promise(t=>{let c=()=>{g.removeEventListener(`click`,w),v.removeEventListener(`click`,x),y.removeEventListener(`click`,x),document.removeEventListener(`keydown`,C),s.style.display=`none`},x=()=>{c(),t(null)},C=e=>{e.key===`Escape`&&(e.preventDefault(),x()),e.key===`Enter`&&(e.preventDefault(),w())},w=async()=>{let s=(l.value||``).trim();if(!s)return b(`Ingresa el nombre del ramo.`);let g=(p.value||``).trim();if(!g)return b(`Ingresa el código del ramo.`);let v={name:s,code:g,professor:``,section:``,color:m.value||`#3B82F6`,asistencia:!!h.checked,createdAt:Date.now()};try{if(_&&!i){let e=`SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;S=Array.isArray(S)?S:[],S.push({id:e,...v}),Dt(S),K(),W(),await $(),c(),t({id:e,...v});return}let s=await o(u(f,`users`,d.currentUser.uid,`semesters`,a,`courses`),v);d.courses=(await e(r(u(f,`users`,d.currentUser.uid,`semesters`,a,`courses`),n(`createdAt`)))).docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`)),c(),t({id:s.id,...v})}catch(e){console.error(e),b(`No se pudo guardar el ramo. Revisa consola.`)}};g.addEventListener(`click`,w),v.addEventListener(`click`,x),y.addEventListener(`click`,x),document.addEventListener(`keydown`,C)})}function Ye(){if(document.getElementById(`ynModal`))return;let e=document.createElement(`div`);e.id=`ynModal`,e.style.cssText=`
    position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.55); z-index:10150; padding:16px;
  `,e.innerHTML=`
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
    `,document.body.appendChild(e)}function Xe(){if(document.getElementById(`blockModal`))return;let e=document.createElement(`div`);e.id=`blockModal`,e.style.cssText=`
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10002; padding:16px;
    `,e.innerHTML=`
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

            ${t(`Nombre`,`bmNameOnly`)}
            ${t(`Código`,`bmCode`)}
            ${t(`Profesor`,`bmTeacher`)}
            ${t(`Paralelo / Sección`,`bmSection`)}
            ${t(`Sala`,`bmRoomView`)}

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
    `,document.body.appendChild(e);function t(e,t){return`
        <div style="
          display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
          padding:10px 12px; border-radius:14px;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.08);
        ">
          <div style="font-size:12.5px; opacity:.75;">${e}</div>
          <div id="${t}" style="font-size:13px; font-weight:800; text-align:right; max-width:62%; word-break:break-word;"></div>
        </div>
      `}}function Ze({mode:e=`view`,courseName:t,color:n,timeText:r,realName:i=``,shownName:a=``,code:o=``,teacher:s=``,section:c=``,room:l=``}){Xe();let u=document.getElementById(`blockModal`),d=document.getElementById(`bmTitle`),f=document.getElementById(`bmSub`),p=document.getElementById(`bmDot`),m=document.getElementById(`bmCourse`),h=document.getElementById(`bmTime`),g=document.getElementById(`bmNameOnly`),_=document.getElementById(`bmCode`),v=document.getElementById(`bmTeacher`),y=document.getElementById(`bmSection`),b=document.getElementById(`bmRoomView`),x=document.getElementById(`bmDetails`),S=document.getElementById(`bmEdit`),C=document.getElementById(`bmName`),w=document.getElementById(`bmRoom`),T=document.getElementById(`bmX`),E=document.getElementById(`bmCancel`),D=document.getElementById(`bmSave`),O=e===`edit`;d.textContent=O?`Editar ramo`:`Detalles del ramo`,f.textContent=O?`Modifica nombre mostrado y/o sala`:`Información del ramo (sin editar)`,p.style.background=H(n)?n:`#64748b`,m.textContent=t||`Ramo`,h.textContent=r||``;let k=e=>String(e||``).trim()||`—`;return g.textContent=k(i),_.textContent=k(o),v.textContent=k(s),y.textContent=k(c),b.textContent=k(l),x.style.display=O?`none`:`grid`,S.style.display=O?`grid`:`none`,C.value=String(a||``).trim()&&a!==i?String(a).trim():``,w.value=String(l||``).trim(),D.style.display=O?`inline-flex`:`none`,u.style.display=`flex`,O&&setTimeout(()=>{C.focus(),C.select()},0),new Promise(e=>{let t=()=>{T.removeEventListener(`click`,n),E.removeEventListener(`click`,n),D.removeEventListener(`click`,i),u.removeEventListener(`click`,r),document.removeEventListener(`keydown`,a),u.style.display=`none`},n=()=>{t(),e(null)},r=e=>{e.target===u&&n()},i=()=>{let n=String(C.value||``).trim(),r=String(w.value||``).trim();t(),e({nameVal:n,roomVal:r})},a=e=>{e.key===`Escape`&&(e.preventDefault(),n()),O&&e.key===`Enter`&&(e.preventDefault(),i())};T.addEventListener(`click`,n),E.addEventListener(`click`,n),D.addEventListener(`click`,i),u.addEventListener(`click`,r),document.addEventListener(`keydown`,a)})}function Qe(){document.addEventListener(`click`,async e=>{let n=e.target.closest(`.placed`);if(!n||!n.closest(`#schedUSM`)||e.target.closest(`.block-del-btn`))return;let r=n.dataset.id,i=U.find(e=>e.id===r);if(!i)return;let a=(d.courses||[]).find(e=>e.id===i.courseId)||{},o=(a.name||`Ramo`).trim(),c=i.displayName&&String(i.displayName).trim()?String(i.displayName).trim():o,l=i.room&&String(i.room).trim()?String(i.room).trim():``,u=Se(d.courses,i.courseId,O),p=i.start&&i.end?`${i.start}–${i.end}`:``,m=a.code||a.codigo||``,h=a.teacher||a.professor||a.docente||``,g=a.section||a.seccion||a.paralelo||``;if(!T){await Ze({mode:`view`,courseName:c,color:u,timeText:p,realName:o,shownName:c,code:m,teacher:h,section:g,room:l});return}let _=await Ze({mode:`edit`,courseName:o,color:u,timeText:p,realName:o,shownName:c,code:m,teacher:h,section:g,room:l});if(!_||!d.currentUser||!d.activeSemesterId)return;let{nameVal:v,roomVal:y}=_;try{await s(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,i.id),{displayName:v||null,room:y||null,updatedAt:Date.now()});let e=U.findIndex(e=>e.id===i.id);e>=0&&(U[e].displayName=v||null,U[e].room=y||null),G()}catch(e){console.error(e),alert(`No se pudo actualizar. Intenta nuevamente.`)}})}function $e(){if(document.getElementById(`csModal`))return;let e=document.createElement(`div`);e.id=`csModal`,e.style.cssText=`
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10000; padding:16px;
    `,e.innerHTML=`
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
    `,document.body.appendChild(e);let t=document.getElementById(`csHasLunch`),n=document.getElementById(`csLunchRow`);t.addEventListener(`change`,()=>{n.style.display=t.checked?`grid`:`none`})}function et({editMode:e=!1,titleOverride:t=null,okTextOverride:n=null,subOverride:r=null}={}){$e();let i=document.getElementById(`csModal`),a=document.getElementById(`csTitle`),o=document.getElementById(`csSub`),s=document.getElementById(`csErr`),c=document.getElementById(`csBlocks`),l=document.getElementById(`csHasLunch`),u=document.getElementById(`csLunchRow`),d=document.getElementById(`csLunchStart`),f=document.getElementById(`csLunchEnd`),p=document.getElementById(`csS1`),m=document.getElementById(`csE1`),h=document.getElementById(`csS2`),g=document.getElementById(`csE2`),_=document.getElementById(`csOk`),v=document.getElementById(`csCancel`),y=document.getElementById(`csX`);a.textContent=t??(e?`Editar horario personalizado`:`Crear horario personalizado`),o.textContent=r??(e?`Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.`:`Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click.`),s.style.display=`none`,s.textContent=``,c.value=``,l.checked=!1,u.style.display=`none`,d.value=`13:40`,f.value=`14:40`,p.value=`08:15`,m.value=`09:25`,h.value=`09:40`,g.value=`10:50`,_.textContent=n??(e?`Guardar`:`Crear`),i.style.display=`flex`;let b=e=>{s.textContent=e,s.style.display=`block`};return new Promise(e=>{let t=e=>{e.target===i&&a()},n=e=>{e.key===`Enter`&&o(),e.key===`Escape`&&a()},r=()=>{_.removeEventListener(`click`,o),v.removeEventListener(`click`,a),y?.removeEventListener(`click`,a),i.removeEventListener(`click`,t),i.removeEventListener(`keydown`,n)},a=()=>{r(),i.style.display=`none`,e(null)},o=()=>{let t=parseInt(c.value,10);if(!t||t<=0)return b(`Ingresa un número válido de bloques por día.`);let n=p.value,a=m.value,o=h.value,s=g.value;if(!n||!a||!o||!s)return b(`Completa los horarios de los bloques base.`);let u=!!l.checked,_=d.value,v=f.value;if(u&&(!_||!v))return b(`Completa inicio y fin de almuerzo.`);r(),i.style.display=`none`,e({n:t,hasLunch:u,lunchStart:u?_:null,lunchEnd:u?v:null,start1:n,end1:a,start2:o,end2:s})};_.addEventListener(`click`,o),v.addEventListener(`click`,a),y?.addEventListener(`click`,a),i.addEventListener(`click`,t),i.addEventListener(`keydown`,n)})}function tt(){return`dp_sim_items_${j||`UNI`}_TERM`}function nt(e){try{let t=(e||[]).map(e=>({courseId:e.courseId,pid:e.pid,day:e.day,slot:e.slot,pos:e.pos||`full`})).sort((e,t)=>(e.courseId||``).localeCompare(t.courseId||``)||(e.pid||``).localeCompare(t.pid||``)||e.day-t.day||e.slot-t.slot||(e.pos||``).localeCompare(t.pos||``));return JSON.stringify(t)}catch{return``}}function K(){le()}function rt(){try{localStorage.setItem(tt(),JSON.stringify(C||[]))}catch{}nt(C)}function it(){try{let e=localStorage.getItem(tt()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function at(){return`dp_sim_slots_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function ot(){return`dp_sim_parallel_defs_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function st(){return`dp_sim_selected_parallel_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function ct(){try{let e=localStorage.getItem(at()),t=JSON.parse(e||`null`);return Array.isArray(t)?t:null}catch{return null}}function lt(e){try{localStorage.setItem(at(),JSON.stringify(e||null))}catch{}}function ut(){try{let e=localStorage.getItem(ot()),t=JSON.parse(e||`{}`),n=new Map;for(let e of Object.keys(t||{}))n.set(e,Array.isArray(t[e])?t[e]:[]);return n}catch{return new Map}}function dt(){try{let e={};for(let[t,n]of(x||new Map).entries())e[t]=n||[];localStorage.setItem(ot(),JSON.stringify(e))}catch{}}function ft(){try{let e=localStorage.getItem(st()),t=JSON.parse(e||`{}`),n=new Map;for(let e of Object.keys(t||{}))t[e]&&n.set(e,t[e]);return n}catch{return new Map}}function pt(){try{let e={};for(let[t,n]of(w||new Map).entries())e[t]=n;localStorage.setItem(st(),JSON.stringify(e))}catch{}}function mt(e,{persist:t=!1}={}){if(e)try{let n=JSON.parse(e);E=n.slots||null,C=Array.isArray(n.items)?n.items:[],S=Array.isArray(n.courses)?n.courses:[],x.clear?.();for(let e of Object.keys(n.defs||{}))x.set(e,Array.isArray(n.defs[e])?n.defs[e]:[]);w.clear?.();for(let e of Object.keys(n.selected||{}))n.selected[e]&&w.set(e,n.selected[e]);nt(C),t&&(lt(E),K(),Dt(S),rt(),dt(),pt())}catch(e){console.warn(`restoreSimFromSnapshot failed`,e)}}function ht({title:e=`Salir del simulador`,message:t=`¿Quieres guardar antes de salir?`,saveText:n=`Guardar y salir`,discardText:r=`Salir sin guardar`,cancelText:i=`Cancelar`}={}){return new Promise(a=>{let o=document.getElementById(`triConfirm`);o&&o.remove();let s=document.createElement(`div`);s.id=`triConfirm`,s.style.cssText=`
        position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.55); padding:16px;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      `,s.innerHTML=`
        <div style="
          width:min(520px, 96vw);
          background:#121527;
          border:1px solid rgba(255,255,255,.10);
          border-radius:18px;
          padding:16px;
          box-shadow:0 18px 60px rgba(0,0,0,.45);
          color:#fff;
        ">
          <div style="font-weight:900; font-size:16px;">${Z(e)}</div>
          <div style="opacity:.8; margin-top:8px; font-size:13.5px;">${Z(t)}</div>

          <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:16px; flex-wrap:wrap;">
            <button id="triCancel" class="btn violet-outline" type="button">${Z(i)}</button>
            <button id="triDiscard" class="btn violet-outline" type="button">${Z(r)}</button>
            <button id="triSave" class="btn violet" type="button">${Z(n)}</button>
          </div>
        </div>
      `;let c=e=>{s.remove(),a(e)};s.addEventListener(`click`,e=>{e.target===s&&c(`cancel`)}),s.querySelector(`#triCancel`).addEventListener(`click`,()=>c(`cancel`)),s.querySelector(`#triDiscard`).addEventListener(`click`,()=>c(`discard`)),s.querySelector(`#triSave`).addEventListener(`click`,()=>c(`save`)),document.body.appendChild(s)})}function q({title:e=`Confirmar`,text:t=``,yesText:n=`Sí`,noText:r=`No`}={}){Ye();let i=document.getElementById(`ynModal`),a=document.getElementById(`ynTitle`),o=document.getElementById(`ynText`),s=document.getElementById(`ynYes`),c=document.getElementById(`ynNo`);return a.textContent=e,o.textContent=t,s.textContent=n,c.textContent=r,i.style.display=`flex`,new Promise(e=>{let t=()=>{s.removeEventListener(`click`,n),c.removeEventListener(`click`,r),i.removeEventListener(`click`,a),document.removeEventListener(`keydown`,o),i.style.display=`none`},n=()=>{t(),e(!0)},r=()=>{t(),e(!1)},a=n=>{n.target===i&&(t(),e(!1))},o=n=>{n.key===`Escape`&&(t(),e(!1)),n.key===`Enter`&&(t(),e(!0))};s.addEventListener(`click`,n),c.addEventListener(`click`,r),i.addEventListener(`click`,a),document.addEventListener(`keydown`,o)})}async function gt(e=!1){let t=V()||`UNI_desconocida`,n=await et({editMode:e});if(!n)return;let{n:r,hasLunch:i,lunchStart:a,lunchEnd:o,start1:s,end1:c,start2:l,end2:u}=n,f=null,p=null;if(i&&(f=X(a),p=X(o),isNaN(f)||isNaN(p)||p<=f))return alert(`Horas de almuerzo inválidas.`);let m=X(s),h=X(c)-X(s),g=X(l)-X(c);if(isNaN(m)||h<=0)return alert(`Horas inválidas en bloques.`);if(g<0)return alert(`La pausa entre bloque 1 y 2 no puede ser negativa.`);let _=[],v=m,y=!1,b=0;for(;b<r;){if(i&&!y&&v>=f&&v<p){_.push({label:`ALMUERZO`,start:a,end:o,lunch:!0}),y=!0,v=p;continue}let e=v,t=e+h;if(i&&!y&&e<f&&t>f){_.push({label:`ALMUERZO`,start:a,end:o,lunch:!0}),y=!0,v=p;continue}let n=b+1,r=J(e),s=J(t);_.push({label:String(n),start:r,end:s,lines:[{n:String(n),start:r,end:s}]}),b++,v=t+g}if(i&&!y){let e={label:`ALMUERZO`,start:a,end:o,lunch:!0},t=_.findIndex(e=>!e.lunch&&X(e.start)>=f);t===-1&&(t=_.length),_.splice(t,0,e);for(let e=t+1;e<_.length;e++){let t=_[e];if(t.lunch)continue;let n=X(t.start),r=X(t.end);if(n<p){let e=p-n,i=n+e,a=r+e;t.start=J(i),t.end=J(a),t.lines=[{n:t.label,start:t.start,end:t.end}]}}}R[t]=_,localStorage.setItem(`custom_slots_${t}_${d.currentUser.uid}`,JSON.stringify(_)),await zt(t,_),alert(e?`Horario personalizado actualizado.`:`Horario personalizado creado exitosamente.`),G()}async function _t(){let e=await et({editMode:!0,titleOverride:`Editar horario personalizado`,okTextOverride:`Guardar`,subOverride:`Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click.`});if(!e)return null;let{n:t,hasLunch:n,lunchStart:r,lunchEnd:i,start1:a,end1:o,start2:s,end2:c}=e,l=null,u=null;if(n&&(l=X(r),u=X(i),isNaN(l)||isNaN(u)||u<=l))return alert(`Horas de almuerzo inválidas.`),null;let d=X(a),f=X(o)-X(a),p=X(s)-X(o);if(isNaN(d)||f<=0)return alert(`Horas inválidas en bloques.`),null;if(p<0)return alert(`La pausa entre bloque 1 y 2 no puede ser negativa.`),null;let m=[],h=d,g=!1,_=0;for(;_<t;){if(n&&!g&&h>=l&&h<u){m.push({label:`ALMUERZO`,start:r,end:i,lunch:!0}),g=!0,h=u;continue}let e=h,t=e+f;if(n&&!g&&e<l&&t>l){m.push({label:`ALMUERZO`,start:r,end:i,lunch:!0}),g=!0,h=u;continue}let a=_+1,o=J(e),s=J(t);m.push({label:String(a),start:o,end:s,lines:[{n:String(a),start:o,end:s}]}),_++,h=t+p}if(n&&!g){let e={label:`ALMUERZO`,start:r,end:i,lunch:!0},t=m.findIndex(e=>!e.lunch&&X(e.start)>=l);t===-1&&(t=m.length),m.splice(t,0,e);for(let e=t+1;e<m.length;e++){let t=m[e];if(t.lunch)continue;let n=X(t.start),r=X(t.end);if(n<u){let e=u-n,i=n+e,a=r+e;t.start=J(i),t.end=J(a),t.lines=[{n:t.label,start:t.start,end:t.end}]}}}return m}function J(e){let t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`}function vt(e,t){return`${e}:${t}`}function yt(e,t){let n=vt(e,t),r=b.get(n);return r?(ie=r.items||[],A=r.courses||[],ae=r.slots||z,j=r.uni||`USM`,Q(),!0):!1}function bt(e,t,n){if(e.lunch)return`
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${e.start}–${e.end}</div>
      `;let r=me.length?me:F;if(n!==`USM`&&n!==`UMAYOR`||!e.label.includes(`/`))return`
        <div class="mod-lines">
          <div class="line-num">${e.label}</div>
          <div class="line-time">${e.start}–${e.end}</div>
        </div>
      `;if(n===`USM`){let n=(r.slice(0,t+1).filter(e=>!e.lunch).length-1)*2+1,i=n+1;return`
    <div class="mod-lines">
      <div class="line-num">${n}</div>
      <div class="line-time">${e.lines[0].start}–${e.lines[0].end}</div>
      <div class="line-num">${i}</div>
      <div class="line-time">${e.lines[1].start}–${e.lines[1].end}</div>
    </div>
  `}return`
  <div class="mod-lines">
    <div class="line-num">${r.slice(0,t+1).filter(e=>!e.lunch).length}</div>
    <div class="line-time">${e.start}–${e.end}</div>
  </div>
`}document.addEventListener(`click`,e=>{let t=e.target.closest(`.mod-lines`);if(!t)return;let n=V();if(!R[n])return;let r=Array.from(t.parentNode.parentNode.querySelectorAll(`.mod`)).indexOf(t.parentNode);if(r<0)return;let i=R[n],a=i[r],o=X(a.end),s=prompt(`Inicio de ${a.label}`,a.start),c=prompt(`Fin de ${a.label}`,a.end);if(!s||!c)return;let l=X(s),u=X(c);if(isNaN(l)||isNaN(u)||u<=l){alert(`Horas inválidas.`);return}a.start=J(l),a.end=J(u),a.lines=[{n:a.label.split(`/`)[0],start:J(l),end:J(u)}];let f=u-l;if(r<i.length-1){let e=X(i[r+1].start)-o,t=u+e;for(let n=r+1;n<i.length;n++){let r=i[n],a=n+1;r.start=J(t),r.end=J(t+f),r.lines=[{n:String(a),start:r.start,end:J(t+f/2)},{n:String(a+1),start:J(t+f/2),end:r.end}],t=X(r.end)+e}}localStorage.setItem(`custom_slots_${n}_${d.currentUser.uid}`,JSON.stringify(i)),R[n]=i,G()});function xt(e,t){let n=U.filter(n=>n.day===e&&n.slot===t);return n.length?St(n,!1):``}function St(e,t){let n=Re(e);return n.blocks.map(e=>Ct(e,n.laneCount,t)).join(``)}function Ct(e,t,n){let r=n?Array.isArray(S)?S:[]:d.courses||[],i=r.find(t=>t.id===e.courseId)?.name||`Ramo`,a=typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():i,o=typeof e.room==`string`&&e.room.trim()?e.room.trim():``,s=Se(r,e.courseId,O),c=Ce(s),l=e.hpos||`single`,u=0,f=100;l===`left`?(u=0,f=50):l===`right`&&(u=50,f=50);let p=e.pos||`full`,m=0,h=100;p===`top`?(m=0,h=50):p===`bottom`&&(m=50,h=50);let g=`${a}${o?` · Sala: ${o}`:``}`,_=n?`draggable="true"
       data-sim-course="${Z(e.courseId||``)}"
       data-sim-pid="${Z(e.pid||e.parallelPid||``)}"
       data-sim-day="${Number(e.day)}"
       data-sim-slot="${Number(e.slot)}"
       data-sim-pos="${Z(e.pos||`full`)}"
       data-sim-hpos="${Z(e.hpos||`single`)}"`:`data-id="${Z(e.id||``)}" draggable="true"`;return`
    <div class="placed pos-${e.pos||`full`} h-${l}"
        ${_}
        title="${Z(g)}"
        style="
          background:${s};
          border:1px solid rgba(0,0,0,0.25);
          left:${u}%;
          width:${f}%;
          top:${m}%;
          height:${h}%;
        ">
        <div class="placed-title" style="color:${c}; font-weight:700; line-height:1.05;">
          ${Z(a)}
        </div>
        ${o?`
          <div class="placed-room" style="color:${c}; opacity:.9; font-weight:700; font-size:11px; margin-top:2px; line-height:1.05;">
            ${Z(o)}
          </div>
        `:``}
      </div>
  `}function wt(){window.addEventListener(`dragover`,ge,{passive:!0}),document.addEventListener(`drop`,L),document.addEventListener(`dragend`,L),document.addEventListener(`dragstart`,e=>{let t=e.target.closest?.(`.palette-rect`);if(t){let n=t.dataset.payload;if(n){e.dataTransfer.setData(`text/plain`,n),e.dataTransfer.effectAllowed=`copy`,P=!0;return}}let n=e.target.closest?.(`.palette-chip`);n&&(e.dataTransfer.setData(`text/plain`,n.dataset.courseId),e.dataTransfer.effectAllowed=`copy`,P=!0)}),document.addEventListener(`dragstart`,e=>{let t=e.target.closest?.(`.placed`);if(t){if(t.closest(`#simModal`)){e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-sim-block`,courseId:t.dataset.simCourse||``,pid:t.dataset.simPid||null,from:{day:Number(t.dataset.simDay),slot:Number(t.dataset.simSlot),pos:t.dataset.simPos||`full`,hpos:t.dataset.simHpos||`single`}})),e.dataTransfer.effectAllowed=`move`,P=!0;return}e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-block`,id:t.dataset.id})),e.dataTransfer.effectAllowed=`move`,P=!1}}),Ot()}function Tt(){return`sim_courses_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function Et(){try{let e=localStorage.getItem(Tt()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function Dt(e){try{localStorage.setItem(Tt(),JSON.stringify(e||[]))}catch{}}function Ot(){document.querySelectorAll(`.cell.slot`).forEach(e=>{e.classList.contains(`is-lunch`)||(e.addEventListener(`dragover`,t=>{t.preventDefault(),t.dataTransfer.dropEffect=t.dataTransfer.effectAllowed===`move`?`move`:`copy`;let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top,a=n.height/2,o=`full`;i<a-10?o=`top`:i>a+10&&(o=`bottom`);let s=`single`,c=r/n.width;c<.4?s=`left`:c>.6&&(s=`right`),e.dataset.droppos=o,e.dataset.droph=s,e.classList.add(`over`),e.classList.remove(`hint-top`,`hint-full`,`hint-bottom`,`hint-left`,`hint-center`,`hint-right`),o===`top`&&e.classList.add(`hint-top`),o===`full`&&e.classList.add(`hint-full`),o===`bottom`&&e.classList.add(`hint-bottom`),s===`left`&&e.classList.add(`hint-left`),s===`single`&&e.classList.add(`hint-center`),s===`right`&&e.classList.add(`hint-right`)}),e.addEventListener(`dragleave`,()=>Y(e)),e.addEventListener(`drop`,async n=>{n.preventDefault();let r=!!e.closest(`#simModal`),i=n.dataTransfer.getData(`text/plain`);if(!i){Y(e);return}let a=parseInt(e.dataset.day,10),c=parseInt(e.dataset.slot,10),l=e.dataset.droppos||`full`,p=e.dataset.droph||`single`,m=null;try{m=JSON.parse(i)}catch{}let h=e=>e.filter(e=>e.day===a&&e.slot===c&&(e.pos||`full`)===l),g=e=>e.filter(e=>e.day===a&&e.slot===c&&(e.pos||`full`)===l&&(e.hpos||`single`)===p);if(m&&m.type===`course-parallel`){let t=m.courseId,n=m.pid||null;if(r){let r=(E||F||[])[c];if(!r){Y(e);return}let i=(C||[]).filter(e=>e.courseId!==t),o=h(i);if(g(i).length){alert(`Ese espacio exacto ya está ocupado.`),Y(e);return}if(o.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(e);return}C=(C||[]).filter(e=>e.courseId!==t);let s=(((S||[]).find(e=>e.id===t)||(d.courses||[]).find(e=>e.id===t)||{}).name||`Ramo`).trim(),u=x.get(t)||[],f=n?u.find(e=>e.pid===n):null,m=f?.section||f?.pid||null,_=m?`${s} · ${m}`:s;C.push({courseId:t,day:a,slot:c,start:r.start,end:r.end,pos:l,hpos:p,pid:n,displayName:_}),K(),await $(),Y(e);return}if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(e);return}let i=(F||[])[c];if(!i){Y(e);return}let s=h(U||[]);if(g(U||[]).length){alert(`Ese espacio exacto ya está ocupado.`),Y(e);return}if(s.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(e);return}let _=(((d.courses||[]).find(e=>e.id===t)||{}).name||`Ramo`).trim(),v=x.get(t)||[],y=n?v.find(e=>e.pid===n):null,b=y?.section||y?.pid||null,T=b?`${_} · ${b}`:null;await o(u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),{courseId:t,day:a,slot:c,start:i.start,end:i.end,pos:l,hpos:p,parallelPid:n||null,displayName:T,createdAt:Date.now()}),n&&w.set(t,n),Y(e);return}if(m&&m.type===`move-sim-block`&&r){let t=m.from||{},n=(C||[]).findIndex(e=>e.courseId===m.courseId&&Number(e.day)===Number(t.day)&&Number(e.slot)===Number(t.slot)&&(e.pos||`full`)===(t.pos||`full`)&&(e.hpos||`single`)===(t.hpos||`single`));if(n<0){Y(e);return}let r=(E||F||[])[c];if(!r||r.lunch){Y(e);return}let i=(C||[]).filter((e,t)=>t!==n),o=g(i),s=h(i);if(o.length){alert(`Ese espacio exacto ya está ocupado.`),Y(e);return}if(s.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(e);return}Object.assign(C[n],{day:a,slot:c,pos:l,hpos:p,start:r.start,end:r.end}),K(),await $(),Y(e);return}if(m&&m.type===`move-block`){let n=m.id;if(!n){Y(e);return}if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(e);return}try{let r=U.find(e=>e.id===n);if(!r){Y(e);return}let i=(F||[])[c];if(!i){Y(e);return}if(r.day===a&&r.slot===c&&(r.pos||`full`)===l&&(r.hpos||`single`)===p){Y(e);return}let o=U.filter(e=>e.id!==n),u=h(o);if(g(o).length){alert(`Ese espacio exacto ya está ocupado.`),Y(e);return}if(u.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(e);return}await s(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,n),{day:a,slot:c,pos:l,hpos:p,start:i.start,end:i.end,updatedAt:Date.now()});let m=U.findIndex(e=>e.id===n);m>=0&&Object.assign(U[m],{day:a,slot:c,pos:l,hpos:p,start:i.start,end:i.end}),G(),Y(e);return}catch(t){console.error(`move error`,t),alert(`No se pudo mover el bloque (Firestore): `+(t?.message||t)),Y(e);return}}let _=i;if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(e);return}let v=h(U||[]);if(g(U||[]).length){alert(`Ese espacio exacto ya está ocupado.`),Y(e);return}if(v.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(e);return}if(v.length===1){let n=v[0],r=n.hpos||`single`;if(r===`single`&&p!==`single`){let e=p===`left`?`right`:`left`;try{await s(t(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,n.id),{hpos:e})}catch{}}else if(r===p){alert(`Ese lado ya está ocupado. Prueba el otro lado.`),Y(e);return}}let y=(F||[])[c];if(!y){Y(e);return}await o(u(f,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),{courseId:_,day:a,slot:c,start:y.start,end:y.end,pos:l,hpos:p,createdAt:Date.now()}),Y(e)}))})}function Y(e){e.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`,`hint-left`,`hint-center`,`hint-right`),delete e.dataset.droppos,delete e.dataset.droph}function kt(){let e=p(`horarioCompartido`);e&&(e.innerHTML=`
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
    `,p(`party-semSel`)?.addEventListener(`change`,e=>{d.partyView=d.partyView||{},d.partyView.semId=e.target.value||null,d.partyView.uid&&d.partyView.semId?Qt(d.partyView.uid,d.partyView.semId):Q()}),Q())}function At(e,t,n,r){let i=r?d.courses||[]:A||[],a=i.find(t=>t.id===e.courseId)?.name||`Ramo`,o=typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():a,s=Se(i,e.courseId,n),c=Ce(s),l=typeof e.room==`string`&&e.room.trim()?e.room.trim():null;return`
    <div class="placed pos-${t} h-${e.hpos||`single`}"
        title="${Z(`${o}${l?` · Sala: ${l}`:``}`)}"
        style="background:${s}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${c}; font-weight:600;">${Z(o)}</div>
    </div>
  `}async function jt(e,n){let r=be(n),i=r===`USM`||r===`UMAYOR`;if(e)try{let n=await a(t(f,`users`,e,`custom_schedules`,r));if(n.exists()){let e=n.data()?.slots||[];if(Array.isArray(e)&&e.length>0)return{uni:r,slots:e}}}catch(e){console.warn(`[shared] error leyendo custom_schedules del dúo`,e)}return i?{uni:r,slots:r===`UMAYOR`?_e:z}:{uni:r,slots:null}}async function Mt({course:t,day:n,slot:r,room:i}){if(!d.currentUser||!d.activeSemesterId)throw Error(`No logueado`);let a=d.activeSemesterId,o=d.currentUser.uid,c=(d.courses||[]).find(e=>(e.name||``).toLowerCase().includes(String(t).toLowerCase()));if(!c)throw Error(`Curso no encontrado`);let l=(await e(u(f,`users`,o,`semesters`,a,`schedule`))).docs.find(e=>{let t=e.data();return t.courseId===c.id&&t.day===n&&t.slot===r});if(!l)throw Error(`No encontré el bloque en el horario`);return await s(l.ref,{room:i||null,updatedAt:Date.now()}),{ok:!0,room:i}}async function Nt(t=null){if(!d.currentUser)throw Error(`No logueado`);let n=t||d.activeSemesterId;if(!n)throw Error(`No hay semestre activo`);return(await e(u(f,`users`,d.currentUser.uid,`semesters`,n,`schedule`))).docs.map(e=>({id:e.id,...e.data()}))}async function Pt(t=null){if(!d.currentUser)throw Error(`No logueado`);let n=t||d.activeSemesterId;if(!n)throw Error(`No hay semestre activo`);if(!d.pairOtherUid)return{items:[]};let r=(await e(u(f,`users`,d.currentUser.uid,`semesters`,n,`schedule`))).docs.map(e=>({...e.data()})),i=(await e(u(f,`users`,d.pairOtherUid,`semesters`,n,`schedule`))).docs.map(e=>({...e.data()})),a=[];for(let e of r)for(let t of i)e.day===t.day&&e.slot===t.slot&&a.push(`${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`][e.day]} bloque ${e.slot} (${e.courseName} / ${t.courseName})`);return{items:a}}async function Ft(e,n=null){if(!d.currentUser)throw Error(`No logueado`);let r=n||d.activeSemesterId;return await c(t(f,`users`,d.currentUser.uid,`semesters`,r,`schedule`,e)),{ok:!0}}document.addEventListener(`dragstart`,e=>{let t=e.target.closest(`.placed`);t&&t.classList.add(`dragging`)}),document.addEventListener(`dragend`,e=>{let t=e.target.closest(`.placed`);t&&t.classList.remove(`dragging`)});var It=480,Lt=1320;function X(e){let[t,n]=e.split(`:`).map(Number);return t*60+n}function Rt(e){return(e-It)/(Lt-It)*100}document.addEventListener(`auth:ready`,()=>{setTimeout(()=>{ze(),Be()},1e3)}),document.addEventListener(`semester:changed`,()=>{Be()});async function zt(e,n){d.currentUser&&await i(t(f,`users`,d.currentUser.uid,`custom_schedules`,e),{slots:n,updatedAt:Date.now()})}async function Bt(e){if(!d.currentUser)return!1;try{return await c(t(f,`users`,d.currentUser.uid,`custom_schedules`,e)),!0}catch(e){return console.error(`[Firestore] Error al eliminar horario personalizado:`,e),!1}}async function Vt(){let e=p(`partyBar`);if(!e)return;let t=d.currentUser?.uid,n=(d.partyMembers||[]).filter(Boolean).filter(e=>e!==t);if(!n.length){e.innerHTML=`<div class="muted">No hay miembros en tu party.</div>`;return}if(d.partyView=d.partyView||{},!d.partyView.uid){let e=d.currentUser?.uid;d.partyView.uid=n.find(t=>t!==e)||e||n[0]}await Promise.all(n.map(e=>Ht(e,{force:!0}))),e.innerHTML=n.map(e=>{let t=M[e]||{},n=t.name||(e===d.currentUser?.uid?`Yo`:`Usuario`),r=H(t.color)?t.color:`#64748b`,i=e===d.partyView.uid;return`
    <button class="party-chip btn ${i?`violet`:`violet-outline`} ${i?`is-active`:``}"
      data-uid="${Z(e)}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${i?`outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);`:``}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${r};display:inline-block;"></span>
      <span style="font-weight:700">${Z(n)}</span>
    </button>
  `}).join(``),e.querySelectorAll(`button[data-uid]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.uid;d.partyView.uid=t,await Vt(),await Yt(t),await Xt(),d.partyView.semId?Qt(t,d.partyView.semId):Q()})})}async function Ht(e,{force:n=!1}={}){if(e&&!(!n&&M[e]))try{let n=t(f,`users`,e),r=t(f,`users`,e,`profile`,`profile`),[i,o]=await Promise.all([a(n),a(r)]),s=i.exists()&&i.data()||{},c=o.exists()&&o.data()||{};M[e]={name:typeof c.name==`string`&&c.name.trim()?c.name.trim():typeof s.name==`string`&&s.name.trim()?s.name.trim():typeof s.displayName==`string`&&s.displayName.trim()?s.displayName.trim():typeof s.username==`string`&&s.username.trim()?s.username.trim():``,color:typeof c.favoriteColor==`string`&&c.favoriteColor.trim()?c.favoriteColor.trim():typeof s.favoriteColor==`string`&&s.favoriteColor.trim()?s.favoriteColor.trim():``}}catch(t){console.warn(`loadPartyMemberProfile error`,t),M[e]=M[e]||{name:``,color:``}}}function Z(e){return String(e||``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function Ut(){return`sim_palette_order_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function Wt(){try{let e=localStorage.getItem(Ut()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function Gt(e){try{localStorage.setItem(Ut(),JSON.stringify(e||[]))}catch{}}function Kt(e){let t=Wt();if(!t.length)return e;let n=new Map(t.map((e,t)=>[e,t])),r=999999;return[...e].sort((e,t)=>{let i=n.has(e.id)?n.get(e.id):r,a=n.has(t.id)?n.get(t.id):r;return i===a?String(e.name||``).localeCompare(String(t.name||``),`es`):i-a})}function qt(){let e=document.getElementById(`simPaletteHost`);if(!e)return;let t=null;e.querySelectorAll(`.sim-course-group[draggable="true"]`).forEach(n=>{n.addEventListener(`dragstart`,e=>{t=n.dataset.courseId,e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,t),n.classList.add(`dragging`)}),n.addEventListener(`dragend`,()=>{t=null,n.classList.remove(`dragging`),e.querySelectorAll(`.sim-course-group`).forEach(e=>e.classList.remove(`drag-over`))}),n.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer.dropEffect=`move`,n.classList.add(`drag-over`)}),n.addEventListener(`dragleave`,()=>{n.classList.remove(`drag-over`)}),n.addEventListener(`drop`,r=>{r.preventDefault(),n.classList.remove(`drag-over`);let i=n.dataset.courseId;if(!t||!i||t===i)return;Wt().length||Gt(Array.from(e.querySelectorAll(`.sim-course-group`)).map(e=>e.dataset.courseId).filter(Boolean));let a=Wt().filter(Boolean),o=(d.courses||[]).map(e=>e.id);for(let e of o)a.includes(e)||a.push(e);let s=a.filter(e=>e!==t),c=s.indexOf(i);s.splice(Math.max(0,c),0,t),Gt(s),W()})})}function Jt(){if(document.getElementById(`simPaletteReorderStyles`))return;let e=document.createElement(`style`);e.id=`simPaletteReorderStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}async function Yt(t){let n=p(`party-semSel`);if(!n||(n.innerHTML=`<option value="">— seleccionar —</option>`,!t))return;let i=(await e(r(u(f,`users`,t,`semesters`)))).docs.map(e=>({id:e.id,label:(e.data()?.label||e.id).trim()}));i.sort((e,t)=>t.label.localeCompare(e.label));for(let e of i){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.label,n.appendChild(t)}}async function Xt(){let e=d.partyView?.uid,t=d.activeSemesterData?.label,n=p(`party-semSel`);if(!e||!t||!n)return;await Yt(e);let r=Array.from(n.options),i=r.find(e=>(e.textContent||``).trim()===t);if(i)n.value=i.value,d.partyView.semId=i.value,await Qt(e,i.value);else{let t=r.find(e=>e.value);n.value=t?t.value:``,d.partyView.semId=n.value||null,d.partyView.semId&&await Qt(e,d.partyView.semId)}}function Q(){let e=p(`schedPartyUSM`);if(!e)return;if(!A||A.length===0){e.innerHTML=`<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>`;return}let t=ae||z;me=t,e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${j===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}
        ${t.map((e,t)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${t}">
            ${bt(e,t,j)}
          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}">
              ${Zt(r,t)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `}function Zt(e,t){let n=ie.filter(n=>n.day===e&&n.slot===t),r=e=>{let t=n.filter(t=>(t.pos||`full`)===e);if(!t.length)return``;let r=t.sort((e,t)=>{let n={left:0,single:1,right:2};return(n[e.hpos||`single`]??1)-(n[t.hpos||`single`]??1)}),i=M[d.partyView?.uid]?.color||k;return r.map(t=>At(t,e,i,!1)).join(``)};return`
      ${r(`top`)}
      ${r(`full`)}
      ${r(`bottom`)}
    `}async function Qt(e,i){if(!await h(e,`horario`)){let e=p(`schedPartyUSM`);e&&(e.innerHTML=m(`su horario`));return}if(te&&=(te(),null),ne&&=(ne(),null),re&&=(re(),null),!e||!i)return;if(!yt(e,i)){ie=[],A=[],ae=null,j=`USM`;let e=p(`schedPartyUSM`);e&&(e.innerHTML=`<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>`)}let{uni:o,slots:s}=await jt(e,d.partyView?.semId?(await a(t(f,`users`,e,`semesters`,d.partyView.semId))).data()?.universityAtThatTime:``);j=o,ae=s||(o===`UMAYOR`?_e:z),re=l(t(f,`users`,e),t=>{let n=t.data()||{};M[e]=M[e]||{},M[e].color=n.favoriteColor||M[e].color||``,M[e].name=n.displayName||n.name||n.username||M[e].name||``,Q()}),ne=l(r(u(f,`users`,e,`semesters`,i,`courses`),n(`name`)),t=>{A=t.docs.map(e=>({id:e.id,...e.data()})),b.set(vt(e,i),{uni:j,slots:ae,items:ie,courses:A}),Q()}),te=l(r(u(f,`users`,e,`semesters`,i,`schedule`)),t=>{ie=t.docs.map(e=>({id:e.id,...e.data()})),b.set(vt(e,i),{uni:j,slots:ae,items:ie,courses:A}),Q()})}async function $t(){for(let[e,t]of oe.entries()){try{t.prof?.()}catch{}try{t.courses?.()}catch{}try{t.sched?.()}catch{}}oe.clear(),N.clear()}async function en(t,n,{allowFallback:i=!0}={}){let a=(await e(r(u(f,`users`,t,`semesters`)))).docs.map(e=>({id:e.id,label:String(e.data()?.label||e.id).trim()}));if(!a.length)return null;let o=n?a.find(e=>e.label===n):null;return o?o.id:!i&&n?null:(a.sort((e,t)=>t.label.localeCompare(e.label)),a[0].id)}async function tn(e=null){let i=d.currentUser?.uid,a=Array.from(new Set([...d.partyMembers||[],i])).filter(Boolean);if(!a.length){let e=p(`schedPartyBusy`);e&&(e.innerHTML=`<div class="muted">No hay miembros en tu party.</div>`);return}await $t();let o=e??(d.activeSemesterData?.label||null),s=!!e;await Promise.all(a.map(e=>Ht(e,{force:!0})));for(let e of a){let i=await en(e,o,{allowFallback:!s});if(!i)continue;let a=M[e]||{};N.set(e,{name:a.name||(e===d.currentUser?.uid?`Yo`:`Usuario`),color:a.color||`#64748b`,uni:`USM`,slots:null,courses:[],items:[],semId:i});let c=(e,t=`#64748b`)=>{let n=String(e||``).trim();return/^#[0-9A-Fa-f]{6}$/.test(n)?n:t},p=(e,t=`Usuario`)=>String(e||``).trim()||t,m={};m.prof=l(t(f,`users`,e,`profile`,`profile`),t=>{let n=t.data()||{},r=N.get(e);r&&(r.color=c(n.favoriteColor,r.color||`#64748b`),r.name=p(n.name,r.name||(e===d.currentUser?.uid?`Yo`:`Usuario`)),ue())}),m.courses=l(r(u(f,`users`,e,`semesters`,i,`courses`),n(`name`)),t=>{let n=N.get(e);n&&(n.courses=t.docs.map(e=>({id:e.id,...e.data()})),ue())}),m.sched=l(r(u(f,`users`,e,`semesters`,i,`schedule`)),t=>{let n=N.get(e);n&&(n.items=t.docs.map(t=>({id:t.id,...t.data(),_uid:e})),ue())}),oe.set(e,m)}ue()}function nn(e){let t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),n=[];for(let e of t){let t=!1;for(let r=0;r<n.length;r++)if(n[r]<=e.startMin){e._lane=r,n[r]=e.endMin,t=!0;break}t||(e._lane=n.length,n.push(e.endMin))}return{blocks:t,laneCount:n.length||1}}function rn(){if(document.getElementById(`timelineStyles`))return;let e=document.createElement(`style`);e.id=`timelineStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function an(e=`schedPartyBusy`){rn();let t=document.getElementById(e);if(!t)return;let n=Array.from(N.entries());if(!n.length){t.innerHTML=`<div class="muted">Cargando party…</div>`;return}let r=[];for(let[e,t]of n)for(let n of t.items||[]){let i=X(n.start),a=X(n.end);isNaN(i)||isNaN(a)||a<=i||r.push({...n,_uid:e,_name:t.name,_favColor:t.color,startMin:i,endMin:a})}t.innerHTML=`
      <div class="timeline-wrap">
        <div class="timeline-head">
          <div></div>
          ${I.map(e=>`<div class="timeline-dayname">${e}</div>`).join(``)}
        </div>
        <div class="timeline-body">
          <div class="timeline-timecol">
            ${Array.from({length:15},(e,t)=>`<div class="timeline-timecell">${8+t}:00</div>`).join(``)}
          </div>
          ${I.map((e,t)=>`
            <div class="timeline-day">
              ${on()}
              ${(()=>{let e=nn(r.filter(e=>e.day===t).map(e=>({...e,topPct:Rt(e.startMin),heightPct:Rt(e.endMin)-Rt(e.startMin)})).filter(e=>e.heightPct>0));return e.blocks.map(t=>sn(t,e.laneCount)).join(``)})()}
            </div>
          `).join(``)}
        </div>
      </div>
    `}function on(){return Array.from({length:15},(e,t)=>{let n=100/15*t;return`
        <div class="timeline-line" style="top:${n}%"></div>
        <div class="timeline-line half" style="top:${n+100/15/2}%"></div>
      `}).join(``)}function sn(e,t){let n=N.get(e._uid),r=n?.color||e._favColor||`#64748b`,i=((n?.courses||[]).find(t=>t.id===e.courseId)?.name||`Ramo`).trim(),a=t>1,o=r,s=cn(o,a?.35:.9),c=Ce(o),l=cn(o,1),u=a?e._lane===0?`top`:e._lane===1?`bottom`:`center`:`center`,d=u===`top`?`top:6px; transform:none;`:u===`bottom`?`bottom:6px; transform:none;`:`top:50%; transform:translateY(-50%);`,f=10+(e._lane||0);return`
      <div class="timeline-block"
        title="${Z(i)}"
        style="
          position:absolute;
          top:${e.topPct}%;
          height:${e.heightPct}%;
          left:0%;
          width:100%;
          z-index:${f};
          border-radius:10px;
          background:${s};
          border:2px solid ${l};
          box-sizing:border-box;
          overflow:hidden;
        ">
        <div style="
          position:absolute;
          left:8px; right:8px;
          ${d}
          color:${c};
          font-size:12px;
          font-weight:900;
          line-height:1.1;
          text-align:center;
          text-shadow: 0 1px 2px rgba(0,0,0,.45);
          pointer-events:none;
        ">
          ${Z(i)}
        </div>
      </div>
    `}function cn(e,t){return H(e)?`rgba(${parseInt(e.slice(1,3),16)},${parseInt(e.slice(3,5),16)},${parseInt(e.slice(5,7),16)},${Math.max(0,Math.min(1,t))})`:`rgba(100,116,139,${t})`}function ln(e){let t=document.getElementById(e);if(!t)return;let n=Array.from(N.entries()).map(([e,t])=>({uid:e,name:t?.name||(e===d.currentUser?.uid?`Yo`:`Usuario`),color:t?.color||`#64748b`})).sort((e,t)=>e.name.localeCompare(t.name,`es`));if(!n.length){t.innerHTML=`<div class="muted">Cargando integrantes…</div>`;return}t.innerHTML=n.map(e=>`
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${H(e.color)?e.color:`#64748b`};display:inline-block;"></span>
        <span style="font-weight:800">${Z(e.name)}</span>
      </div>
    `).join(``)}function un(){let e=document.getElementById(`simModal`);e&&e.remove();let t=document.createElement(`div`);t.id=`simModal`,t.style.cssText=`
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.62); z-index:10050; padding:16px;
    `,t.innerHTML=`
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
    `,document.body.appendChild(t);let n=t,r=e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),a())},i=()=>{n.style.display=`none`,_=!1,y=null,E=null,document.removeEventListener(`keydown`,r),document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`),L(),document.dispatchEvent(new Event(`courses:changed`))};document.getElementById(`simExportBtn`)?.addEventListener(`click`,async e=>{if(e.preventDefault(),e.stopPropagation(),!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo.`);return}if(!await q({title:`Exportar simulación`,text:`¿Quieres exportar esta simulación a tu semestre?`,yesText:`Sí, exportar`,noText:`Cancelar`}))return;let t=document.getElementById(`simExportBtn`);t&&(t.disabled=!0,t.textContent=`Exportando...`);try{await mn(),vn(),E=null,S=[],C=[],x.clear?.(),w.clear?.(),y=null,i(),await G(),alert(`✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.`)}catch(e){console.error(e),alert(`No se pudo exportar la simulación. Revisa consola.`)}finally{t&&(t.disabled=!1,t.textContent=`Exportar a mi horario`)}}),document.getElementById(`simDeleteBtn`)?.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),await q({title:`Eliminar simulación`,text:`Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?`,yesText:`Sí, eliminar`,noText:`Cancelar`})&&(vn(),E=null,S=[],C=[],x.clear?.(),w.clear?.(),y=null,i())});let a=async()=>{if(!await q({title:`Salir del simulador`,text:`¿Quieres salir del simulador?`,yesText:`Sí, salir`,noText:`Cancelar`}))return;let e=await ht({title:`Salir del simulador`,message:le()?`Tienes cambios sin guardar. ¿Qué quieres hacer?`:`No hiciste cambios. ¿Cómo quieres salir?`,saveText:`Guardar y salir`,discardText:`Salir sin guardar`,cancelText:`Cancelar`});if(e!==`cancel`){if(e===`save`){_n(),i();return}if(e===`discard`){mt(y,{persist:!0}),We(),G(),i();return}}};document.getElementById(`simX`)?.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),a()}),n.addEventListener(`click`,e=>{e.target===n&&a()}),document.addEventListener(`keydown`,e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),a())})}function dn(e,t){let n=C.filter(n=>n.day===e&&n.slot===t);return n.length?St(n,!0):``}async function fn(e,t){let n=(x.get(e)||[]).find(e=>e.pid===t);if(!n)return;let r=E||await xe();if(!r)return;C=C.filter(t=>t.courseId!==e);let i=(((S||[]).find(t=>t.id===e)||(d.courses||[]).find(t=>t.id===e)||{}).name||`Ramo`).trim(),a=n.section||t;for(let o of n.blocks||[]){let n=r?.[o.slot];!n||n.lunch||C.push({courseId:e,day:o.day,slot:o.slot,start:n.start,end:n.end,pos:o.pos||`full`,hpos:o.hpos||`single`,pid:t,displayName:`${i} · ${a}`})}w.set(e,t),pt(),K(),W(),await $()}async function $(){let e=document.getElementById(`simGridHost`);if(!e)return;let t=E||await xe();if(!t){e.innerHTML=`
        <div style="text-align:center; padding:18px;">
          <div style="font-weight:900; margin-bottom:6px;">No hay horario base para esta universidad</div>
          <div class="muted" style="opacity:.8;">Crea un horario personalizado en la vista normal.</div>
        </div>
      `;return}let n=V();e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}
        ${t.map((e,t)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${t}">
            ${bt(e,t,n)}
          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}"
                ${e.lunch?`aria-disabled="true"`:``}
                style="${e.lunch?`pointer-events:none; opacity:.65;`:``}">
                ${dn(r,t)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,Ot()}async function pn(){if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo antes de usar el simulador.`);return}let e=ct();if(e&&Array.isArray(e)&&e.length)E=e;else{let e=await _t();if(!e)return;E=e,lt(E)}D=!1,un();let t=document.getElementById(`simModal`),n=document.getElementById(`simModalPanel`);document.documentElement.classList.add(`sim-lock`),document.body.classList.add(`sim-lock`),t.style.display=`flex`,_=!0,S=Et(),C=it(),Array.isArray(C)||(C=[]);let r=ut();x.clear?.();for(let[e,t]of r.entries())x.set(e,t||[]);let i=ft();w.clear?.();for(let[e,t]of i.entries())t&&w.set(e,t);document.dispatchEvent(new Event(`courses:changed`));let a=document.getElementById(`simActiveSemLabel`);a&&(a.textContent=d.activeSemesterData?.label||d.activeSemesterId||`—`),await $(),W(),requestAnimationFrame(()=>{n&&(n.scrollTop=0)}),y=ce()}async function mn(){if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo.`);return}let i=d.currentUser.uid,a=d.activeSemesterId,s=V()||`UNI_desconocida`,l=E||await xe();if(!l||!Array.isArray(l)||!l.length){alert(`No hay slots para guardar la simulación.`);return}try{R[s]=l,localStorage.setItem(`custom_slots_${s}_${i}`,JSON.stringify(l)),await zt(s,l)}catch(e){console.warn(`No se pudo persistir slots base`,e)}let p=u(f,`users`,i,`semesters`,a,`courses`),m=u(f,`users`,i,`semesters`,a,`schedule`),[h,g]=await Promise.all([e(r(p)),e(r(m))]),_=h.docs.map(e=>({id:e.id,...e.data()})),v=g.docs.map(e=>({id:e.id,...e.data()})),y=_.length>0,b=!0;y&&(b=!!await q({title:`Exportar simulación`,text:`Ya tienes ramos guardados en este semestre.

¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?`,yesText:`Sí, borrar anteriores`,noText:`No, que convivan`})),b&&(await gn(m),await gn(p));let x=b?[]:_,w=b?[]:v,T=new Map;for(let e of x){let t=hn(e?.code||e?.codigo||``);t&&(T.has(t)||T.set(t,new Set),T.get(t).add(e.id))}let D=new Map;for(let e of x){let t=hn(e?.name||e?.nombre||``);t&&D.set(t,e.id)}let O=new Map,k=(S||[]).filter(e=>String(e.id||``).startsWith(`SIM_`));for(let n of k){let s={name:(n.name||``).trim()||`Ramo`,code:(n.code||``).trim()||``,professor:n.professor||``,section:n.section||``,color:H(n.color)?n.color:`#3B82F6`,asistencia:!!n.asistencia,createdAt:Date.now()},l=hn(s.code);if(!b&&l&&T.has(l)){let n=Array.from(T.get(l)||[]);if(n.length){let o=(await e(r(m))).docs.filter(e=>n.includes(e.data()?.courseId));for(let e of o)await c(e.ref);for(let e of n){await c(t(f,`users`,i,`semesters`,a,`courses`,e));for(let[t,n]of D.entries())n===e&&D.delete(t)}}T.delete(l)}if(!b&&!l){let e=hn(s.name),t=D.get(e);if(t){O.set(n.id,t);continue}}let u=await o(p,s);l&&(T.has(l)||T.set(l,new Set),T.get(l).add(u.id)),O.set(n.id,u.id);let d=hn(s.name);d&&D.set(d,u.id)}d.courses=(await e(r(p,n(`createdAt`)))).docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`));let ee=e=>[String(e.courseId||``),Number(e.day),Number(e.slot),String(e.pos||`full`),String(e.hpos||`single`),String(e.pid||e.parallelPid||``),String(e.displayName||``).trim(),String(e.start||``),String(e.end||``)].join(`|`),te=new Set((w||[]).map(e=>ee({courseId:e.courseId,day:e.day,slot:e.slot,pos:e.pos,hpos:e.hpos,pid:e.parallelPid,displayName:e.displayName,start:e.start,end:e.end})));for(let e of C||[]){let t=O.get(e.courseId)||e.courseId;if(String(t).startsWith(`SIM_`))continue;let n=l[e.slot];if(!n||n.lunch)continue;let r={courseId:t,day:e.day,slot:e.slot,start:n.start,end:n.end,pos:e.pos||`full`,hpos:e.hpos||`single`,parallelPid:e.pid||e.parallelPid||null,displayName:typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():null,createdAt:Date.now()};if(!b){let e=ee(r);if(te.has(e))continue;te.add(e)}await o(m,r)}}function hn(e){return String(e||``).trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}async function gn(t){let n=await e(t);for(let e of n.docs)await c(e.ref)}function _n(){lt(E),Dt(S),rt(),dt(),pt(),y=ce()}function vn(){try{localStorage.removeItem(at())}catch{}try{localStorage.removeItem(Tt())}catch{}try{localStorage.removeItem(ot())}catch{}try{localStorage.removeItem(st())}catch{}try{localStorage.removeItem(tt())}catch{}try{localStorage.removeItem(Ut())}catch{}}export{_e as MAYOR_SLOTS,z as USM_SLOTS,Nt as getMySchedule,ze as initSchedule,Be as onActiveSemesterChanged,pn as openSimSchedule,Pt as overlapWithPair,Ue as refreshCourseOptions,Ft as removeBlock,Mt as setRoom};