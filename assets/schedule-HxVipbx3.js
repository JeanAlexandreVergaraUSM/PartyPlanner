import{_ as e,a as t,c as n,d as r,i,l as a,n as o,r as s,s as c,u as l,v as u}from"./index.esm-BR0qfrzH.js";import{c as d,o as f,u as p}from"./index-Dmmp0C--.js";import{n as m,t as h}from"./privacy-BQV51iKn.js";import{bindExportButtons as g}from"./export-FDxVWyHH.js";function _(e){let t=e||`full`;return t===`top`?{start:0,end:.5}:t===`bottom`?{start:.5,end:1}:{start:0,end:1}}function v(e,t){return e.start<t.end&&t.start<e.end}function y(e=[]){let t={top:0,full:1,bottom:2},n=e.map((e,t)=>({...e,_sourceIndex:t,_verticalRange:_(e.pos)}));n.sort((e,n)=>{let r=t[e.pos||`full`]??1,i=t[n.pos||`full`]??1;return r===i?e._sourceIndex-n._sourceIndex:r-i});let r=[];for(let e of n){let t=r.findIndex(t=>t.every(t=>!v(e._verticalRange,t._verticalRange)));t<0&&(t=r.length,r.push([])),e._lane=t,r[t].push(e)}return{blocks:n,laneCount:Math.max(1,r.length)}}function b(e,t=1){let n=e?.hpos||`single`;if(n===`left`)return{left:0,width:50,effectiveHpos:`left`,automatic:!1};if(n===`right`)return{left:50,width:50,effectiveHpos:`right`,automatic:!1};let r=Math.max(1,Number(t)||1);if(r===1)return{left:0,width:100,effectiveHpos:`single`,automatic:!1};let i=Math.min(Math.max(0,Number(e?._lane)||0),r-1),a=100/r,o=r===2?i===0?`left`:`right`:`lane-${i+1}`;return{left:i*a,width:a,effectiveHpos:o,automatic:!0}}var x=!1,S=null,C=null,w=new Map,T=new Map,E=[],D=[],O=new Map,k=!1,A=null,ee=!1,te=`#22c55e`,ne=`#ff69b4`,re=!1,ie=null,ae=null,oe=null,se=[],j=[],ce=null,M=`USM`,N={},P=new Map,le=new Map,ue=null;function de(){let e={};for(let[t,n]of(T||new Map).entries())e[t]=n||[];let t={};for(let[e,n]of(O||new Map).entries())t[e]=n;return JSON.stringify({slots:A||null,items:D||[],courses:E||[],defs:e,selected:t})}function fe(){if(!C)return!1;try{return de()!==C}catch{return!0}}function pe(){ue||=requestAnimationFrame(()=>{ue=null,[`schedPartyBusyCombined`,`schedPartyBusy`].filter(e=>document.getElementById(e)).forEach(e=>on(e)),[`busyLegendCombined`,`busyLegend`].filter(e=>document.getElementById(e)).forEach(e=>un(e))})}var me=!1,he=null,ge=80,_e=28,F=[],ve=[],I=[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`];function ye(){return document.getElementById(`parEditModal`)?.style.display===`flex`?document.getElementById(`parEditPanel`):document.getElementById(`simModal`)?.style.display===`flex`?document.getElementById(`simModalPanel`):document.getElementById(`gr-simDrawer`)||null}function be(e){if(!me)return;let t=e.clientY,n=window.innerHeight,r=0;if(t<ge){let e=(ge-t)/ge;r=-Math.ceil(_e*e)}else if(t>n-ge){let e=(t-(n-ge))/ge;r=Math.ceil(_e*e)}r===0||he!==null||(he=requestAnimationFrame(()=>{let e=ye();e?e.scrollBy({top:r,left:0,behavior:`auto`}):window.scrollBy(0,r),he=null}))}function L(){me=!1,he&&=(cancelAnimationFrame(he),null)}var R={},z=[{label:`1/2`,start:`08:15`,end:`09:25`,lines:[{n:`1`,start:`08:15`,end:`08:50`},{n:`2`,start:`08:50`,end:`09:25`}]},{label:`3/4`,start:`09:40`,end:`10:50`,lines:[{n:`3`,start:`09:40`,end:`10:15`},{n:`4`,start:`10:15`,end:`10:50`}]},{label:`5/6`,start:`11:05`,end:`12:15`,lines:[{n:`5`,start:`11:05`,end:`11:40`},{n:`6`,start:`11:40`,end:`12:15`}]},{label:`7/8`,start:`12:30`,end:`13:40`,lines:[{n:`7`,start:`12:30`,end:`13:05`},{n:`8`,start:`13:05`,end:`13:40`}]},{label:`ALMUERZO`,start:`13:40`,end:`14:40`,lunch:!0},{label:`9/10`,start:`14:40`,end:`15:50`,lines:[{n:`9`,start:`14:40`,end:`15:15`},{n:`10`,start:`15:15`,end:`15:50`}]},{label:`11/12`,start:`16:05`,end:`17:15`,lines:[{n:`11`,start:`16:05`,end:`16:40`},{n:`12`,start:`16:40`,end:`17:15`}]},{label:`13/14`,start:`17:30`,end:`18:40`,lines:[{n:`13`,start:`17:30`,end:`18:05`},{n:`14`,start:`18:05`,end:`18:40`}]},{label:`15/16`,start:`18:50`,end:`20:00`,lines:[{n:`15`,start:`18:50`,end:`19:25`},{n:`16`,start:`19:25`,end:`20:00`}]},{label:`17/18`,start:`20:15`,end:`21:25`,lines:[{n:`17`,start:`20:15`,end:`20:50`},{n:`18`,start:`20:50`,end:`21:25`}]},{label:`19/20`,start:`21:40`,end:`22:50`,lines:[{n:`19`,start:`21:40`,end:`22:15`},{n:`20`,start:`22:15`,end:`22:50`}]}],xe=[B(`1/2`,`08:30`,`09:40`,[`08:30-09:05`,`09:05-09:40`]),B(`3/4`,`10:00`,`11:10`,[`10:00-10:35`,`10:35-11:10`]),B(`5/6`,`11:30`,`12:40`,[`11:30-12:05`,`12:05-12:40`]),{label:`ALMUERZO`,start:`12:40`,end:`14:00`,lunch:!0},B(`7/8`,`14:00`,`15:10`,[`14:00-14:35`,`14:35-15:10`]),B(`9/10`,`15:30`,`16:40`,[`15:30-16:05`,`16:05-16:40`]),B(`11/12`,`17:00`,`18:10`,[`17:00-17:35`,`17:35-18:10`]),B(`13/14`,`18:30`,`19:40`,[`18:30-19:05`,`19:05-19:40`]),B(`15/16`,`20:00`,`21:10`,[`20:00-20:35`,`20:35-21:10`]),B(`17/18`,`21:30`,`22:40`,[`21:30-22:05`,`22:05-22:40`])];function B(e,t,n,r){return{label:e,start:t,end:n,lines:r.map(e=>{let[t,n]=e.split(`-`);return{start:t,end:n}})}}function Se(e){return String(e||``).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().trim().replace(/\s+/g,` `)}function Ce(e){return Se(e).replace(/[^a-z0-9]+/g,`_`).replace(/^_+|_+$/g,``)}function we(e){let t=Se(e);return t?t===`umayor`||t.includes(`mayor`)?`UMAYOR`:t===`usm`||t.includes(`utfsm`)||t.includes(`u t f s m`)||t.includes(`u.t.f.s.m`)||t.includes(`federico santa maria`)||t.includes(`santa maria`)?`USM`:`UNI_${Ce(t)||`desconocida`}`:``}function V(){return we(d.activeSemesterData?.universityAtThatTime||d.profileData?.university||``)}async function Te(){let e=V();if(R[e]&&Array.isArray(R[e])&&R[e].length)return R[e];if(d.currentUser){let t=await i(u(p,`users`,d.currentUser.uid,`custom_schedules`,e));if(t.exists()){let n=t.data()?.slots||[];if(Array.isArray(n)&&n.length)return R[e]=n,n}}let t=`custom_slots_${e}_${d.currentUser?.uid}`,n=localStorage.getItem(t);if(n)try{let t=JSON.parse(n);if(Array.isArray(t)&&t.length)return R[e]=t,t}catch{}return e===`UMAYOR`?xe:e===`USM`?z:null}function H(e){return typeof e==`string`&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Ee(e,t,n){let r=(e||[]).find(e=>e.id===t);return H(r?.color)?r.color:n||`#3B82F6`}function De(e){try{let t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?`#111`:`#fff`}catch{return`#0e0e0e`}}var Oe=null,U=[];function W(){let e=document.getElementById(`simPaletteHost`);if(!e)return;Yt(),e.innerHTML=``;let t=x?Array.isArray(E)?E:[]:Array.isArray(d.courses)?d.courses:[];if(!t.length){let t=document.createElement(`button`);t.type=`button`,t.className=`palette-rect`,t.textContent=`+ Agregar ramo`,t.style.cursor=`pointer`,t.style.borderStyle=`dashed`,t.addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`No hay semestre activo para agregar ramos.`);return}await Ye(d.activeSemesterId,{forceFirestore:!1})}),e.appendChild(t);return}qt(t).forEach(t=>{let n=document.createElement(`div`);n.className=`sim-course-group`,n.dataset.courseId=t.id;let r=H(t.color)?t.color:`#3B82F6`,i=T.get(t.id)||[],a=O.get(t.id)||i[0]?.pid||null;a&&i.find(e=>e.pid===a);let o=t.name,s=document.createElement(`div`);s.className=`palette-rect`,s.setAttribute(`draggable`,`true`),s.dataset.payload=JSON.stringify({type:`course-parallel`,courseId:t.id,pid:a}),s.style.borderColor=r,s.style.boxShadow=`inset 0 0 0 2px rgba(0,0,0,.15)`;let c=document.createElement(`div`);c.className=`label`,c.textContent=o,s.appendChild(c);let l=document.createElement(`button`);l.type=`button`,l.className=`add-par`,l.textContent=`▾`,l.setAttribute(`aria-label`,`Paralelos`),l.addEventListener(`click`,e=>{e.stopPropagation(),ze(t,l)}),s.appendChild(l),n.appendChild(s),e.appendChild(n)});let n=document.createElement(`button`);n.type=`button`,n.className=`palette-rect`,n.textContent=`+ Agregar ramo`,n.style.cursor=`pointer`,n.style.borderStyle=`dashed`,n.style.opacity=`0.95`,n.addEventListener(`click`,async()=>{if(!d.currentUser||!d.activeSemesterId){alert(`No hay semestre activo para agregar ramos.`);return}await Ye(d.activeSemesterId,{forceFirestore:!1})}),e.appendChild(n),Jt()}var ke=null;function Ae(){if(document.getElementById(`simParMenuStyles`))return;let e=document.createElement(`style`);e.id=`simParMenuStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function je(){if(document.getElementById(`parEditDnDStyles`))return;let e=document.createElement(`style`);e.id=`parEditDnDStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function Me(){ke&&=(ke.remove(),null)}function Ne(){if(document.getElementById(`parEditModal`))return;let e=document.createElement(`div`);e.id=`parEditModal`,e.style.cssText=`position:fixed; inset:0; display:none; align-items:center; justify-content:center;
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
    `,document.body.appendChild(e);let t=()=>{e.style.display=`none`,document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`),L()};document.getElementById(`parEditX`).addEventListener(`click`,t),document.getElementById(`parEditCancel`).addEventListener(`click`,t),e.addEventListener(`click`,n=>{n.target===e&&t()})}async function Pe(e,t){Ne();let n=document.getElementById(`parEditModal`),r=document.getElementById(`parEditPanel`),i=document.getElementById(`parEditTitle`),a=document.getElementById(`parEditProf`),o=document.getElementById(`parEditSec`),s=document.getElementById(`parEditChip`),c=document.getElementById(`parEditGrid`),l=document.getElementById(`parEditSave`),u=document.getElementById(`parEditCancel`),d=document.getElementById(`parEditX`),f=e.id,p=T.get(f)||[],m=e=>JSON.parse(JSON.stringify(e||{})),h=t?(e=>p.find(t=>t.pid===e)||null)(t):null,g,_=!1;h?g=m(h):(_=!0,g={courseId:f,pid:`P${p.length+1}`,professor:``,section:``,blocks:[]}),a.value=g.professor||``,o.value=g.section||g.pid||``;let v=()=>{let t=(o.value||``).trim()||g.pid;i.textContent=`${e.name} · ${t}`;let n=s.querySelector(`.drag-txt`);n?n.textContent=`${e.name} · ${t}`:s.textContent=`${e.name} · ${t}`};s.dataset.payload=JSON.stringify({type:`parallel-template`,courseId:f,pid:g.pid});let y=H(e.color)?e.color:`#3B82F6`;s.style.borderColor=y,s.style.background=ln(y,.18),s.style.color=De(y),s.style.borderRadius=`999px`,s.style.padding=`10px 14px`,s.style.display=`inline-flex`,s.style.alignItems=`center`,s.style.gap=`10px`,s.style.fontWeight=`900`,s.style.borderWidth=`2px`,s.style.boxShadow=`0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)`,s.style.userSelect=`none`,s.querySelector(`.drag-ico`)||(s.innerHTML=`<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`),o.oninput=v,v(),await Fe(c,g),je(),document.documentElement.classList.add(`sim-lock`),document.body.classList.add(`sim-lock`),n.style.display=`flex`,requestAnimationFrame(()=>{r&&(r.scrollTop=0),a?.focus()});let b=()=>{l.onclick=null,u.onclick=null,d.onclick=null,n.onclick=null,document.removeEventListener(`keydown`,E),L()},S=()=>{b(),n.style.display=`none`,document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`)},C=()=>S(),w=e=>{e.target===n&&C()},E=e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),C())};d.onclick=C,u.onclick=C,n.onclick=w,document.addEventListener(`keydown`,E),l.onclick=async()=>{if(g.professor=(a.value||``).trim(),g.section=(o.value||``).trim(),_){let e=[...p,m(g)];T.set(f,e)}else h.professor=g.professor,h.section=g.section,h.blocks=m(g.blocks),T.set(f,p);ft(),K(),W(),S(),x&&O.get(f)===g.pid&&await pn(f,g.pid)}}async function Fe(e,t){let n=V(),r=A||await Te();if(!r){e.innerHTML=`<div class="muted">No hay slots definidos.</div>`;return}e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}

        ${r.map((e,r)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${r}">
            ${xt(e,r,n)}
          </div>
          ${I.map((n,i)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${i}" data-slot="${r}"
                ${e.lunch?`aria-disabled="true"`:``}
                style="${e.lunch?`pointer-events:none; opacity:.65;`:``}">
              ${Ie(t,i,r)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,e.querySelectorAll(`.par-placed`).forEach(n=>{n.addEventListener(`dragstart`,e=>{let r=parseInt(n.dataset.day,10),i=parseInt(n.dataset.slot,10),a=n.dataset.pos||`full`;e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-par-block`,courseId:t.courseId,pid:t.pid,from:{day:r,slot:i,pos:a}})),e.dataTransfer.effectAllowed=`move`,me=!0}),n.addEventListener(`dragend`,L);let r=n.querySelector(`.par-x`);r&&r.addEventListener(`click`,r=>{r.stopPropagation();let i=parseInt(n.dataset.day,10),a=parseInt(n.dataset.slot,10),o=n.dataset.pos||`full`,s=t.blocks.findIndex(e=>e.day===i&&e.slot===a&&(e.pos||`full`)===o);s>=0&&t.blocks.splice(s,1),Fe(e,t)})}),e.querySelectorAll(`.cell.slot`).forEach(n=>{n.classList.contains(`is-lunch`)||(n.addEventListener(`dragover`,e=>{e.preventDefault();let t=n.getBoundingClientRect(),r=e.clientY-t.top,i=t.height/2,a=`full`;r<i-10?a=`top`:r>i+10&&(a=`bottom`),n.dataset.droppos=a,n.classList.add(`over`),n.classList.remove(`hint-top`,`hint-full`,`hint-bottom`),n.classList.add(a===`top`?`hint-top`:a===`bottom`?`hint-bottom`:`hint-full`)}),n.addEventListener(`dragleave`,()=>{n.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`),delete n.dataset.droppos}),n.addEventListener(`drop`,i=>{i.preventDefault(),L();let a=n.dataset.droppos||`full`;n.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`),delete n.dataset.droppos;let o=i.dataTransfer.getData(`text/plain`),s=null;try{s=JSON.parse(o)}catch{}let c=parseInt(n.dataset.day,10),l=parseInt(n.dataset.slot,10),u=r?.[l];if(!(!u||u.lunch||!s)){if(s.type===`move-par-block`){let n=s.from||{},r=t.blocks.findIndex(e=>e.day===Number(n.day)&&e.slot===Number(n.slot)&&(e.pos||`full`)===(n.pos||`full`));if(r<0)return;if(t.blocks.some((e,t)=>t!==r&&e.day===c&&e.slot===l&&(e.pos||`full`)===a)){alert(`Ese espacio ya está ocupado por otro bloque del paralelo.`);return}let i=t.blocks[r];i.day=c,i.slot=l,i.pos=a,i.start=u.start,i.end=u.end,i.hpos=i.hpos||`single`,Fe(e,t);return}s.type===`parallel-template`&&(t.blocks.findIndex(e=>e.day===c&&e.slot===l&&(e.pos||`full`)===a)>=0||(t.blocks.push({day:c,slot:l,pos:a,hpos:`single`,start:u.start,end:u.end}),Fe(e,t)))}}))})}function Ie(e,t,n){let r=(e.blocks||[]).filter(e=>e.day===t&&e.slot===n);if(!r.length)return``;let i=e=>e===`top`?`pos-top`:e===`bottom`?`pos-bottom`:`pos-full`;return r.map(r=>`
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
    `).join(``)}async function Le(n,r){if(!d.currentUser||!d.activeSemesterId)return;let i=(T.get(n)||[]).find(e=>e.pid===r);if(!i)return;let a=e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),c=(await t(a)).docs.filter(e=>e.data()?.courseId===n);for(let e of c)await s(e.ref);let l=await Te();for(let e of i.blocks){let t=l?.[e.slot];!t||t.lunch||await o(a,{courseId:n,day:e.day,slot:e.slot,start:t.start,end:t.end,pos:e.pos||`full`,hpos:e.hpos||`single`,parallelPid:r,displayName:`${d.courses.find(e=>e.id===n)?.name||`Ramo`} · ${i.section||r}`,createdAt:Date.now()})}O.set(n,r)}async function Re(n){if(!d.currentUser||!d.activeSemesterId)return;let r=(await t(e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`))).docs.filter(e=>e.data()?.courseId===n);for(let e of r)await s(e.ref)}function ze(e,t){Ae(),Me();let n=document.createElement(`div`);n.className=`sim-par-menu`;let r=e.id,i=T.get(r)||[],a=(U||[]).some(e=>e.courseId===r),o=O.has(r),c=a||o;n.innerHTML=`
    <div class="head">
      <div class="title">Paralelos de ${Z(e.name||`Ramo`)}</div>
      <div style="display:flex; gap:8px;">
        <button id="simClearFromScheduleBtn"
          class="broombtn danger"
          type="button"
          title="Sacar del horario (mantener en pool)"
          aria-label="Sacar del horario"
          ${c?``:`disabled`}
          style="${c?``:`opacity:.35; cursor:not-allowed;`}"
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
  `,document.body.appendChild(n),ke=n;let l=()=>{document.removeEventListener(`pointerdown`,m,{capture:!0}),document.removeEventListener(`keydown`,h),window.removeEventListener(`scroll`,g,!0),window.removeEventListener(`resize`,_)},f=()=>{ke&&=(ke.remove(),null),l()},m=e=>{!n.contains(e.target)&&!t.contains(e.target)&&f()},h=e=>{e.key===`Escape`&&f()},g=()=>f(),_=()=>f(),v=n.querySelector(`.list`);if(i.length)i.forEach(t=>{let n=document.createElement(`div`);n.className=`item`,n.style.cursor=`default`,n.innerHTML=`
    <div class="row">
      <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
        <div class="pickbox ${O.get(r)===t.pid?`on`:``}" title="Seleccionar paralelo" aria-label="Seleccionar paralelo"></div>

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
  `;let i=n.querySelector(`.iconbtn:not(.danger)`),a=n.querySelector(`.iconbtn.danger`);n.querySelector(`.pickbox`).addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),O.set(r,t.pid),mt(),K(),x?await pn(r,t.pid):(await Le(r,t.pid),G()),f()}),n.querySelector(`.row > div`)?.addEventListener(`click`,async n=>{if(!n.target.closest(`.pickbox`)&&!n.target.closest(`.actions`)&&!n.target.closest(`button`)){if(f(),x){await pn(e.id,t.pid);return}Pe(e,t.pid)}}),i.addEventListener(`click`,async n=>{n.stopPropagation(),f(),Pe(e,t.pid)}),a.addEventListener(`click`,async n=>{if(n.stopPropagation(),!await q({title:`Borrar paralelo`,text:`¿Quieres borrar el paralelo ${t.section||t.pid}?`,yesText:`Borrar`,noText:`Cancelar`}))return;let r=(T.get(e.id)||[]).filter(e=>e.pid!==t.pid);T.set(e.id,r),D=D.filter(n=>!(n.courseId===e.id&&n.pid===t.pid)),K(),O.get(e.id)===t.pid&&O.delete(e.id),W(),x&&await $(),f()}),v.appendChild(n)});else{let e=document.createElement(`div`);e.className=`hint`,e.textContent=`Aún no hay paralelos.`,v.appendChild(e)}n.querySelector(`.item.add`).addEventListener(`click`,async()=>{f(),await Pe(e,null)}),n.querySelector(`#simClearFromScheduleBtn`)?.addEventListener(`click`,async()=>{c&&(f(),await Re(e.id),D=D.filter(t=>t.courseId!==e.id),K(),O.delete(e.id),G(),x&&await $())}),n.querySelector(`#simRemoveCourseBtn`)?.addEventListener(`click`,async()=>{if(await q({title:`Eliminar ramo`,text:`¿Eliminar "${e.name}" del simulador? Esto lo quitará de tu lista de ramos.`,yesText:`Eliminar`,noText:`Cancelar`})){if(f(),x){let t=e.id;E=(E||[]).filter(e=>e.id!==t),D=(D||[]).filter(e=>e.courseId!==t),T.delete(t),O.delete(t),Ot(E),W(),await $();return}if(!(!d.currentUser||!d.activeSemesterId))try{await Re(e.id),await s(u(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`courses`,e.id)),D=D.filter(t=>t.courseId!==e.id),K(),T.delete(e.id),O.delete(e.id),d.courses=(d.courses||[]).filter(t=>t.id!==e.id),document.dispatchEvent(new Event(`courses:changed`)),x&&await $()}catch(e){console.error(e),alert(`No se pudo eliminar el ramo.`)}}});let y=t.getBoundingClientRect();n.style.left=`-9999px`,n.style.top=`-9999px`;let b=n.offsetWidth,S=n.offsetHeight,C=y.left,w=y.bottom+8;C=Math.min(C,window.innerWidth-b-8),C=Math.max(C,8),w+S>window.innerHeight-8&&(w=y.top-S-8),w=Math.max(w,8),n.style.left=`${C}px`,n.style.top=`${w}px`,setTimeout(()=>{document.addEventListener(`pointerdown`,m,{capture:!0})},0),document.addEventListener(`keydown`,h),window.addEventListener(`scroll`,g,!0),window.addEventListener(`resize`,_)}function Be(){if(re)return;re=!0,Ue(),Tt(),$e(),At(),Ht(),Zt(),document.addEventListener(`party:ready`,()=>{f(`subtabCombinado`)?.classList.contains(`active`)&&_()}),document.addEventListener(`party:changed`,()=>{f(`subtabCombinado`)?.classList.contains(`active`)&&_()}),document.addEventListener(`semester:changed`,()=>{f(`subtabCombinado`)?.classList.contains(`active`)&&_()}),document.addEventListener(`profile:changed`,async()=>{let e=d.currentUser?.uid;e&&(N[e]=N[e]||{},d.profileData?.name&&(N[e].name=d.profileData.name),d.profileData?.favoriteColor&&(N[e].color=d.profileData.favoriteColor),f(`subtabCompartido`)?.classList.contains(`active`)&&(await Ut(e,{force:!0}),await Ht()),f(`subtabCombinado`)?.classList.contains(`active`)&&(un(`busyLegendCombined`),pe()))});let n=f(`subtabPropio`),r=f(`subtabCompartido`),i=f(`subtabCombinado`);y();let o=f(`horarioPropio`),c=f(`horarioCompartido`),l=f(`horarioCombinado`);function m(){n.classList.add(`active`),r.classList.remove(`active`),i.classList.remove(`active`),o.classList.remove(`hidden`),c.classList.add(`hidden`),l.classList.add(`hidden`)}async function h(){r.classList.add(`active`),n.classList.remove(`active`),i.classList.remove(`active`),c.classList.remove(`hidden`),o.classList.add(`hidden`),l.classList.add(`hidden`),await Ht(),d.partyView?.uid&&await Xt(d.partyView.uid),await Zt(),d.partyView?.uid&&d.partyView?.semId?$t(d.partyView.uid,d.partyView.semId):Q()}async function _(){let n=f(`horarioCombinado`);if(!n)return;n.innerHTML=`
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
  `;let r=document.getElementById(`busy-semSelCombined`);if(r&&d.currentUser){let n=(await t(a(e(p,`users`,d.currentUser.uid,`semesters`)))).docs.map(e=>({id:e.id,label:String(e.data()?.label||e.id).trim()})).sort((e,t)=>t.label.localeCompare(e.label));if(!n.length){r.innerHTML=`<option value="" disabled selected>— sin semestres —</option>`;return}let i=e=>{let t=/^(\d{4})-(1|2)$/.exec(String(e||``).trim());if(!t)return null;let n=parseInt(t[1],10);return parseInt(t[2],10)===1?`${n}-2`:`${n+1}-1`};r.innerHTML=``;for(let e of n){let t=document.createElement(`option`);t.value=e.label,t.textContent=e.label,r.appendChild(t)}let o=d.activeSemesterData?.label||null,s=i(o)||o,c=n.map(e=>e.label),l=s&&c.includes(s)?s:o&&c.includes(o)?o:n[0].label;r.value=l,await nn(l),un(`busyLegendCombined`),on(`schedPartyBusyCombined`),r.addEventListener(`change`,async()=>{let e=r.value;await nn(e),un(`busyLegendCombined`),on(`schedPartyBusyCombined`)})}}async function v(){i.classList.add(`active`),n.classList.remove(`active`),r.classList.remove(`active`),l.classList.remove(`hidden`),o.classList.add(`hidden`),c.classList.add(`hidden`),await _()}n.addEventListener(`click`,m),r.addEventListener(`click`,()=>{h()}),i.addEventListener(`click`,v),m(),document.addEventListener(`courses:changed`,()=>{if(x){W();return}Ge(),G()}),document.addEventListener(`click`,async e=>{let t=e.target.closest(`.block-del-btn`);if(!t)return;let n=t.dataset.id;if(!(!n||!d.currentUser||!d.activeSemesterId)&&confirm(`¿Eliminar este bloque del horario?`))try{await s(u(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,n))}catch(e){console.error(e),alert(`No se pudo eliminar el bloque.`)}});function y(){let e=f(`subtabPropio`);if(!e)return;let t=e.parentElement;if(!t||document.getElementById(`btnSimSchedule`))return;t.style.display=`flex`,t.style.alignItems=`center`,t.style.gap=`10px`,t.style.flexWrap=`wrap`;let n=document.createElement(`div`);n.style.flex=`1 1 auto`,t.appendChild(n);let r=document.createElement(`button`);r.id=`btnSimSchedule`,r.className=`btn violet`,r.textContent=`Simulador de horario`,r.style.marginLeft=`auto`,t.appendChild(r)}function b(){document.addEventListener(`click`,async e=>{e.target.closest(`#btnSimSchedule`)&&await mn()})}g(),b()}function Ve(){if(Oe&&=(Oe(),null),S&&=(S(),null),!d.currentUser||!d.activeSemesterId){He();return}U=[],G(),S=c(a(e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`courses`),n(`createdAt`)),e=>{d.courses=e.docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`))}),Oe=c(a(e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`)),e=>{U=e.docs.map(e=>({id:e.id,...e.data()})),G()})}function He(){document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove());let e=f(`schedUSM`);e&&(e.innerHTML=`
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `);let t=f(`coursePalette`);t&&(t.innerHTML=`<div class="muted">Selecciona o crea un semestre para ver ramos.</div>`),U=[],F=[]}function Ue(){let e=f(`horarioPropio`);e.innerHTML=`
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
  `,Ge(),G()}function We(){Ge(),G()}function Ge(){let e=f(`coursePalette`);if(!e)return;e.innerHTML=``;let t=Array.isArray(d.courses)?d.courses:[];if(ee){let t=document.createElement(`button`);t.type=`button`,t.className=`palette-chip`,t.id=`paletteAddCourseChip`,t.textContent=`+`,t.style.cursor=`pointer`,t.style.fontWeight=`900`,t.style.fontSize=`18px`,t.style.display=`inline-flex`,t.style.alignItems=`center`,t.style.justifyContent=`center`,t.style.minWidth=`44px`,t.style.borderStyle=`dashed`,t.style.opacity=`0.95`,t.addEventListener(`click`,async()=>{await Ye(document.getElementById(`sim-semSel`)?.value||d.activeSemesterId)}),e.appendChild(t)}if(!t.length){let t=document.createElement(`div`);t.className=`muted`,t.style.marginLeft=`10px`,t.textContent=ee?`Aún no tienes ramos. Presiona + para agregar el primero.`:`Aún no tienes ramos. Agrega ramos desde el simulador.`,e.appendChild(t);return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`palette-chip`,n.setAttribute(`draggable`,`true`),n.dataset.courseId=t.id,n.textContent=t.name;let r=H(t.color)?t.color:`#3B82F6`;n.style.borderColor=r,n.style.boxShadow=`inset 0 0 0 2px rgba(0,0,0,.15)`,e.appendChild(n)})}function Ke(e){document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove()),e.innerHTML=`
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `,f(`btnCreateNewSched`)?.addEventListener(`click`,()=>_t(!1))}async function qe(t,n){!t||!n||await _n(e(p,`users`,t,`semesters`,n,`schedule`))}async function G(){let e=f(`schedUSM`);if(!e)return;if(!d.currentUser||!d.activeSemesterId){He();return}let t=await Te();F=t;let n=V(),r=n===`USM`||n===`UMAYOR`,i=`custom_slots_${n}_${d.currentUser?.uid}`,a=Array.isArray(R[n])&&R[n].length>0;if(document.querySelectorAll(`.schedule-controls`).forEach(e=>e.remove()),!t){Ke(e);return}let o=document.createElement(`div`);o.className=`card schedule-controls`,o.style=`padding:12px;text-align:center;margin-bottom:10px;`,r?o.innerHTML=`
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
    <button id="btnEditBlocksMode" class="btn ${k?`violet`:`violet-outline`}">
      ${k?`✅ Modo edición: ON`:`Editar ramos y salas`}
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
    <button id="btnEditBlocksMode" class="btn ${k?`violet`:`violet-outline`}">
      ${k?`✅ Modo edición: ON`:`Editar ramos y salas`}
    </button>
  `,e.before(o),f(`btnEditBlocksMode`)?.addEventListener(`click`,()=>{k=!k,G()}),f(`btnCreateCustomSched`)?.addEventListener(`click`,()=>{_t(!1)}),f(`btnUseDefaultSched`)?.addEventListener(`click`,async()=>{localStorage.removeItem(i),await Vt(n),alert(`Se restauró el horario por defecto.`),F=n===`USM`?z:xe,G()}),f(`btnEditCustomSched`)?.addEventListener(`click`,async()=>{let e=localStorage.getItem(i),t=null;if(e)try{t=JSON.parse(e)}catch{}if(!t||t.length===0){alert(`No hay horario personalizado guardado para editar.`);return}confirm(`¿Deseas volver a generar este horario con diferentes bloques o tiempos?`)&&(alert(`Ahora puedes modificar el horario. Se reemplazará el anterior.`),await _t(!0))}),f(`btnDeleteCustomSched`)?.addEventListener(`click`,async()=>{if(await q({title:`Borrar horario`,text:`¿Seguro que deseas borrar tu horario personalizado?`,yesText:`Sí, borrar horario`,noText:`Cancelar`}))try{let e=d.currentUser?.uid,t=d.activeSemesterId;if(!e||!t){alert(`No hay semestre activo.`);return}localStorage.removeItem(i),await Vt(n),delete R[n],F=[],await qe(e,t),U=[],D=[],w.delete(yt(e,t)),document.dispatchEvent(new Event(`courses:changed`)),alert(`Horario personalizado eliminado. Tus ramos siguen guardados.`),await G()}catch(e){console.error(e),alert(`No se pudo borrar el horario personalizado.`)}}),e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}
        ${t.map((e,t)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${t}">
            ${xt(e,t,n)}

          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}"
                ${e.lunch?`aria-disabled="true"`:``}>
              ${St(r,t)}

            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,kt(),e.querySelectorAll(`.placed`).forEach(e=>{if(!e.querySelector(`.block-del-btn`)){let t=document.createElement(`button`);t.className=`block-del-btn`,t.textContent=`×`,t.dataset.id=e.dataset.id,e.appendChild(t)}})}function Je(){if(document.getElementById(`cqModal`))return;let e=document.createElement(`div`);e.id=`cqModal`,e.style.cssText=`
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
    `,document.body.appendChild(e);let t=()=>{e.style.display=`none`};document.getElementById(`cqX`)?.addEventListener(`click`,t),document.getElementById(`cqCancel`)?.addEventListener(`click`,t),e.addEventListener(`click`,n=>{n.target===e&&t()}),document.addEventListener(`keydown`,n=>{e.style.display===`flex`&&n.key===`Escape`&&t()})}async function Ye(r=null,{forceFirestore:i=!1}={}){Je();let s=r||d.activeSemesterId;if(!d.currentUser||!s)return alert(`Necesitas seleccionar un semestre para agregar ramos.`),null;let c=document.getElementById(`cqModal`),l=document.getElementById(`cqErr`),u=document.getElementById(`cqName`),f=document.getElementById(`cqCode`),m=document.getElementById(`cqColor`),h=document.getElementById(`cqAsis`),g=document.getElementById(`cqSave`),_=document.getElementById(`cqCancel`),v=document.getElementById(`cqX`);l.style.display=`none`,l.textContent=``,u.value=``,f.value=``,m.value=`#3B82F6`,h.checked=!1,c.style.display=`flex`,setTimeout(()=>u.focus(),0);let y=e=>{l.textContent=e,l.style.display=`block`};return new Promise(r=>{let l=()=>{g.removeEventListener(`click`,C),_.removeEventListener(`click`,b),v.removeEventListener(`click`,b),document.removeEventListener(`keydown`,S),c.style.display=`none`},b=()=>{l(),r(null)},S=e=>{e.key===`Escape`&&(e.preventDefault(),b()),e.key===`Enter`&&(e.preventDefault(),C())},C=async()=>{let c=(u.value||``).trim();if(!c)return y(`Ingresa el nombre del ramo.`);let g=(f.value||``).trim();if(!g)return y(`Ingresa el código del ramo.`);let _={name:c,code:g,professor:``,section:``,color:m.value||`#3B82F6`,asistencia:!!h.checked,createdAt:Date.now()};try{if(x&&!i){let e=`SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;E=Array.isArray(E)?E:[],E.push({id:e,..._}),Ot(E),K(),W(),await $(),l(),r({id:e,..._});return}let c=await o(e(p,`users`,d.currentUser.uid,`semesters`,s,`courses`),_);d.courses=(await t(a(e(p,`users`,d.currentUser.uid,`semesters`,s,`courses`),n(`createdAt`)))).docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`)),l(),r({id:c.id,..._})}catch(e){console.error(e),y(`No se pudo guardar el ramo. Revisa consola.`)}};g.addEventListener(`click`,C),_.addEventListener(`click`,b),v.addEventListener(`click`,b),document.addEventListener(`keydown`,S)})}function Xe(){if(document.getElementById(`ynModal`))return;let e=document.createElement(`div`);e.id=`ynModal`,e.style.cssText=`
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
    `,document.body.appendChild(e)}function Ze(){if(document.getElementById(`blockModal`))return;let e=document.createElement(`div`);e.id=`blockModal`,e.style.cssText=`
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
      `}}function Qe({mode:e=`view`,courseName:t,color:n,timeText:r,realName:i=``,shownName:a=``,code:o=``,teacher:s=``,section:c=``,room:l=``}){Ze();let u=document.getElementById(`blockModal`),d=document.getElementById(`bmTitle`),f=document.getElementById(`bmSub`),p=document.getElementById(`bmDot`),m=document.getElementById(`bmCourse`),h=document.getElementById(`bmTime`),g=document.getElementById(`bmNameOnly`),_=document.getElementById(`bmCode`),v=document.getElementById(`bmTeacher`),y=document.getElementById(`bmSection`),b=document.getElementById(`bmRoomView`),x=document.getElementById(`bmDetails`),S=document.getElementById(`bmEdit`),C=document.getElementById(`bmName`),w=document.getElementById(`bmRoom`),T=document.getElementById(`bmX`),E=document.getElementById(`bmCancel`),D=document.getElementById(`bmSave`),O=e===`edit`;d.textContent=O?`Editar ramo`:`Detalles del ramo`,f.textContent=O?`Modifica nombre mostrado y/o sala`:`Información del ramo (sin editar)`,p.style.background=H(n)?n:`#64748b`,m.textContent=t||`Ramo`,h.textContent=r||``;let k=e=>String(e||``).trim()||`—`;return g.textContent=k(i),_.textContent=k(o),v.textContent=k(s),y.textContent=k(c),b.textContent=k(l),x.style.display=O?`none`:`grid`,S.style.display=O?`grid`:`none`,C.value=String(a||``).trim()&&a!==i?String(a).trim():``,w.value=String(l||``).trim(),D.style.display=O?`inline-flex`:`none`,u.style.display=`flex`,O&&setTimeout(()=>{C.focus(),C.select()},0),new Promise(e=>{let t=()=>{T.removeEventListener(`click`,n),E.removeEventListener(`click`,n),D.removeEventListener(`click`,i),u.removeEventListener(`click`,r),document.removeEventListener(`keydown`,a),u.style.display=`none`},n=()=>{t(),e(null)},r=e=>{e.target===u&&n()},i=()=>{let n=String(C.value||``).trim(),r=String(w.value||``).trim();t(),e({nameVal:n,roomVal:r})},a=e=>{e.key===`Escape`&&(e.preventDefault(),n()),O&&e.key===`Enter`&&(e.preventDefault(),i())};T.addEventListener(`click`,n),E.addEventListener(`click`,n),D.addEventListener(`click`,i),u.addEventListener(`click`,r),document.addEventListener(`keydown`,a)})}function $e(){document.addEventListener(`click`,async e=>{let t=e.target.closest(`.placed`);if(!t||!t.closest(`#schedUSM`)||e.target.closest(`.block-del-btn`))return;let n=t.dataset.id,i=U.find(e=>e.id===n);if(!i)return;let a=(d.courses||[]).find(e=>e.id===i.courseId)||{},o=(a.name||`Ramo`).trim(),s=i.displayName&&String(i.displayName).trim()?String(i.displayName).trim():o,c=i.room&&String(i.room).trim()?String(i.room).trim():``,l=Ee(d.courses,i.courseId,te),f=i.start&&i.end?`${i.start}–${i.end}`:``,m=a.code||a.codigo||``,h=a.teacher||a.professor||a.docente||``,g=a.section||a.seccion||a.paralelo||``;if(!k){await Qe({mode:`view`,courseName:s,color:l,timeText:f,realName:o,shownName:s,code:m,teacher:h,section:g,room:c});return}let _=await Qe({mode:`edit`,courseName:o,color:l,timeText:f,realName:o,shownName:s,code:m,teacher:h,section:g,room:c});if(!_||!d.currentUser||!d.activeSemesterId)return;let{nameVal:v,roomVal:y}=_;try{await r(u(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,i.id),{displayName:v||null,room:y||null,updatedAt:Date.now()});let e=U.findIndex(e=>e.id===i.id);e>=0&&(U[e].displayName=v||null,U[e].room=y||null),G()}catch(e){console.error(e),alert(`No se pudo actualizar. Intenta nuevamente.`)}})}function et(){if(document.getElementById(`csModal`))return;let e=document.createElement(`div`);e.id=`csModal`,e.style.cssText=`
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
    `,document.body.appendChild(e);let t=document.getElementById(`csHasLunch`),n=document.getElementById(`csLunchRow`);t.addEventListener(`change`,()=>{n.style.display=t.checked?`grid`:`none`})}function tt({editMode:e=!1,titleOverride:t=null,okTextOverride:n=null,subOverride:r=null}={}){et();let i=document.getElementById(`csModal`),a=document.getElementById(`csTitle`),o=document.getElementById(`csSub`),s=document.getElementById(`csErr`),c=document.getElementById(`csBlocks`),l=document.getElementById(`csHasLunch`),u=document.getElementById(`csLunchRow`),d=document.getElementById(`csLunchStart`),f=document.getElementById(`csLunchEnd`),p=document.getElementById(`csS1`),m=document.getElementById(`csE1`),h=document.getElementById(`csS2`),g=document.getElementById(`csE2`),_=document.getElementById(`csOk`),v=document.getElementById(`csCancel`),y=document.getElementById(`csX`);a.textContent=t??(e?`Editar horario personalizado`:`Crear horario personalizado`),o.textContent=r??(e?`Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.`:`Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click.`),s.style.display=`none`,s.textContent=``,c.value=``,l.checked=!1,u.style.display=`none`,d.value=`13:40`,f.value=`14:40`,p.value=`08:15`,m.value=`09:25`,h.value=`09:40`,g.value=`10:50`,_.textContent=n??(e?`Guardar`:`Crear`),i.style.display=`flex`;let b=e=>{s.textContent=e,s.style.display=`block`};return new Promise(e=>{let t=e=>{e.target===i&&a()},n=e=>{e.key===`Enter`&&o(),e.key===`Escape`&&a()},r=()=>{_.removeEventListener(`click`,o),v.removeEventListener(`click`,a),y?.removeEventListener(`click`,a),i.removeEventListener(`click`,t),i.removeEventListener(`keydown`,n)},a=()=>{r(),i.style.display=`none`,e(null)},o=()=>{let t=parseInt(c.value,10);if(!t||t<=0)return b(`Ingresa un número válido de bloques por día.`);let n=p.value,a=m.value,o=h.value,s=g.value;if(!n||!a||!o||!s)return b(`Completa los horarios de los bloques base.`);let u=!!l.checked,_=d.value,v=f.value;if(u&&(!_||!v))return b(`Completa inicio y fin de almuerzo.`);r(),i.style.display=`none`,e({n:t,hasLunch:u,lunchStart:u?_:null,lunchEnd:u?v:null,start1:n,end1:a,start2:o,end2:s})};_.addEventListener(`click`,o),v.addEventListener(`click`,a),y?.addEventListener(`click`,a),i.addEventListener(`click`,t),i.addEventListener(`keydown`,n)})}function nt(){return`dp_sim_items_${M||`UNI`}_TERM`}function rt(e){try{let t=(e||[]).map(e=>({courseId:e.courseId,pid:e.pid,day:e.day,slot:e.slot,pos:e.pos||`full`})).sort((e,t)=>(e.courseId||``).localeCompare(t.courseId||``)||(e.pid||``).localeCompare(t.pid||``)||e.day-t.day||e.slot-t.slot||(e.pos||``).localeCompare(t.pos||``));return JSON.stringify(t)}catch{return``}}function K(){fe()}function it(){try{localStorage.setItem(nt(),JSON.stringify(D||[]))}catch{}rt(D)}function at(){try{let e=localStorage.getItem(nt()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function ot(){return`dp_sim_slots_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function st(){return`dp_sim_parallel_defs_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function ct(){return`dp_sim_selected_parallel_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function lt(){try{let e=localStorage.getItem(ot()),t=JSON.parse(e||`null`);return Array.isArray(t)?t:null}catch{return null}}function ut(e){try{localStorage.setItem(ot(),JSON.stringify(e||null))}catch{}}function dt(){try{let e=localStorage.getItem(st()),t=JSON.parse(e||`{}`),n=new Map;for(let e of Object.keys(t||{}))n.set(e,Array.isArray(t[e])?t[e]:[]);return n}catch{return new Map}}function ft(){try{let e={};for(let[t,n]of(T||new Map).entries())e[t]=n||[];localStorage.setItem(st(),JSON.stringify(e))}catch{}}function pt(){try{let e=localStorage.getItem(ct()),t=JSON.parse(e||`{}`),n=new Map;for(let e of Object.keys(t||{}))t[e]&&n.set(e,t[e]);return n}catch{return new Map}}function mt(){try{let e={};for(let[t,n]of(O||new Map).entries())e[t]=n;localStorage.setItem(ct(),JSON.stringify(e))}catch{}}function ht(e,{persist:t=!1}={}){if(e)try{let n=JSON.parse(e);A=n.slots||null,D=Array.isArray(n.items)?n.items:[],E=Array.isArray(n.courses)?n.courses:[],T.clear?.();for(let e of Object.keys(n.defs||{}))T.set(e,Array.isArray(n.defs[e])?n.defs[e]:[]);O.clear?.();for(let e of Object.keys(n.selected||{}))n.selected[e]&&O.set(e,n.selected[e]);rt(D),t&&(ut(A),K(),Ot(E),it(),ft(),mt())}catch(e){console.warn(`restoreSimFromSnapshot failed`,e)}}function gt({title:e=`Salir del simulador`,message:t=`¿Quieres guardar antes de salir?`,saveText:n=`Guardar y salir`,discardText:r=`Salir sin guardar`,cancelText:i=`Cancelar`}={}){return new Promise(a=>{let o=document.getElementById(`triConfirm`);o&&o.remove();let s=document.createElement(`div`);s.id=`triConfirm`,s.style.cssText=`
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
      `;let c=e=>{s.remove(),a(e)};s.addEventListener(`click`,e=>{e.target===s&&c(`cancel`)}),s.querySelector(`#triCancel`).addEventListener(`click`,()=>c(`cancel`)),s.querySelector(`#triDiscard`).addEventListener(`click`,()=>c(`discard`)),s.querySelector(`#triSave`).addEventListener(`click`,()=>c(`save`)),document.body.appendChild(s)})}function q({title:e=`Confirmar`,text:t=``,yesText:n=`Sí`,noText:r=`No`}={}){Xe();let i=document.getElementById(`ynModal`),a=document.getElementById(`ynTitle`),o=document.getElementById(`ynText`),s=document.getElementById(`ynYes`),c=document.getElementById(`ynNo`);return a.textContent=e,o.textContent=t,s.textContent=n,c.textContent=r,i.style.display=`flex`,new Promise(e=>{let t=()=>{s.removeEventListener(`click`,n),c.removeEventListener(`click`,r),i.removeEventListener(`click`,a),document.removeEventListener(`keydown`,o),i.style.display=`none`},n=()=>{t(),e(!0)},r=()=>{t(),e(!1)},a=n=>{n.target===i&&(t(),e(!1))},o=n=>{n.key===`Escape`&&(t(),e(!1)),n.key===`Enter`&&(t(),e(!0))};s.addEventListener(`click`,n),c.addEventListener(`click`,r),i.addEventListener(`click`,a),document.addEventListener(`keydown`,o)})}async function _t(e=!1){let t=V()||`UNI_desconocida`,n=await tt({editMode:e});if(!n)return;let{n:r,hasLunch:i,lunchStart:a,lunchEnd:o,start1:s,end1:c,start2:l}=n,u=null,f=null;if(i&&(u=X(a),f=X(o),isNaN(u)||isNaN(f)||f<=u))return alert(`Horas de almuerzo inválidas.`);let p=X(s),m=X(c)-X(s),h=X(l)-X(c);if(isNaN(p)||m<=0)return alert(`Horas inválidas en bloques.`);if(h<0)return alert(`La pausa entre bloque 1 y 2 no puede ser negativa.`);let g=[],_=p,v=!1,y=0;for(;y<r;){if(i&&!v&&_>=u&&_<f){g.push({label:`ALMUERZO`,start:a,end:o,lunch:!0}),v=!0,_=f;continue}let e=_,t=e+m;if(i&&!v&&e<u&&t>u){g.push({label:`ALMUERZO`,start:a,end:o,lunch:!0}),v=!0,_=f;continue}let n=y+1,r=J(e),s=J(t);g.push({label:String(n),start:r,end:s,lines:[{n:String(n),start:r,end:s}]}),y++,_=t+h}if(i&&!v){let e={label:`ALMUERZO`,start:a,end:o,lunch:!0},t=g.findIndex(e=>!e.lunch&&X(e.start)>=u);t===-1&&(t=g.length),g.splice(t,0,e);for(let e=t+1;e<g.length;e++){let t=g[e];if(t.lunch)continue;let n=X(t.start),r=X(t.end);if(n<f){let e=f-n,i=n+e,a=r+e;t.start=J(i),t.end=J(a),t.lines=[{n:t.label,start:t.start,end:t.end}]}}}R[t]=g,localStorage.setItem(`custom_slots_${t}_${d.currentUser.uid}`,JSON.stringify(g)),await Bt(t,g),alert(e?`Horario personalizado actualizado.`:`Horario personalizado creado exitosamente.`),G()}async function vt(){let e=await tt({editMode:!0,titleOverride:`Editar horario personalizado`,okTextOverride:`Guardar`,subOverride:`Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click.`});if(!e)return null;let{n:t,hasLunch:n,lunchStart:r,lunchEnd:i,start1:a,end1:o,start2:s}=e,c=null,l=null;if(n&&(c=X(r),l=X(i),isNaN(c)||isNaN(l)||l<=c))return alert(`Horas de almuerzo inválidas.`),null;let u=X(a),d=X(o)-X(a),f=X(s)-X(o);if(isNaN(u)||d<=0)return alert(`Horas inválidas en bloques.`),null;if(f<0)return alert(`La pausa entre bloque 1 y 2 no puede ser negativa.`),null;let p=[],m=u,h=!1,g=0;for(;g<t;){if(n&&!h&&m>=c&&m<l){p.push({label:`ALMUERZO`,start:r,end:i,lunch:!0}),h=!0,m=l;continue}let e=m,t=e+d;if(n&&!h&&e<c&&t>c){p.push({label:`ALMUERZO`,start:r,end:i,lunch:!0}),h=!0,m=l;continue}let a=g+1,o=J(e),s=J(t);p.push({label:String(a),start:o,end:s,lines:[{n:String(a),start:o,end:s}]}),g++,m=t+f}if(n&&!h){let e={label:`ALMUERZO`,start:r,end:i,lunch:!0},t=p.findIndex(e=>!e.lunch&&X(e.start)>=c);t===-1&&(t=p.length),p.splice(t,0,e);for(let e=t+1;e<p.length;e++){let t=p[e];if(t.lunch)continue;let n=X(t.start),r=X(t.end);if(n<l){let e=l-n,i=n+e,a=r+e;t.start=J(i),t.end=J(a),t.lines=[{n:t.label,start:t.start,end:t.end}]}}}return p}function J(e){let t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`}function yt(e,t){return`${e}:${t}`}function bt(e,t){let n=yt(e,t),r=w.get(n);return r?(se=r.items||[],j=r.courses||[],ce=r.slots||z,M=r.uni||`USM`,Q(),!0):!1}function xt(e,t,n){if(e.lunch)return`
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${e.start}–${e.end}</div>
      `;let r=ve.length?ve:F;if(n!==`USM`&&n!==`UMAYOR`||!e.label.includes(`/`))return`
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
`}document.addEventListener(`click`,e=>{let t=e.target.closest(`.mod-lines`);if(!t)return;let n=V();if(!R[n])return;let r=Array.from(t.parentNode.parentNode.querySelectorAll(`.mod`)).indexOf(t.parentNode);if(r<0)return;let i=R[n],a=i[r],o=X(a.end),s=prompt(`Inicio de ${a.label}`,a.start),c=prompt(`Fin de ${a.label}`,a.end);if(!s||!c)return;let l=X(s),u=X(c);if(isNaN(l)||isNaN(u)||u<=l){alert(`Horas inválidas.`);return}a.start=J(l),a.end=J(u),a.lines=[{n:a.label.split(`/`)[0],start:J(l),end:J(u)}];let f=u-l;if(r<i.length-1){let e=X(i[r+1].start)-o,t=u+e;for(let n=r+1;n<i.length;n++){let r=i[n],a=n+1;r.start=J(t),r.end=J(t+f),r.lines=[{n:String(a),start:r.start,end:J(t+f/2)},{n:String(a+1),start:J(t+f/2),end:r.end}],t=X(r.end)+e}}localStorage.setItem(`custom_slots_${n}_${d.currentUser.uid}`,JSON.stringify(i)),R[n]=i,G()});function St(e,t){let n=U.filter(n=>n.day===e&&n.slot===t);return n.length?Ct(n,!1):``}function Ct(e,t){let n=y(e);return n.blocks.map(e=>wt(e,n.laneCount,t)).join(``)}function wt(e,t,n){let r=n?Array.isArray(E)?E:[]:d.courses||[],i=r.find(t=>t.id===e.courseId)?.name||`Ramo`,a=typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():i,o=typeof e.room==`string`&&e.room.trim()?e.room.trim():``,s=Ee(r,e.courseId,te),c=De(s),l=b(e,t),u=l.effectiveHpos,f=l.left,p=l.width,m=e.pos||`full`,h=0,g=100;m===`top`?(h=0,g=50):m===`bottom`&&(h=50,g=50);let _=`${a}${o?` · Sala: ${o}`:``}`,v=n?`draggable="true"
       data-sim-course="${Z(e.courseId||``)}"
       data-sim-pid="${Z(e.pid||e.parallelPid||``)}"
       data-sim-day="${Number(e.day)}"
       data-sim-slot="${Number(e.slot)}"
       data-sim-pos="${Z(e.pos||`full`)}"
       data-sim-hpos="${Z(e.hpos||`single`)}"`:`data-id="${Z(e.id||``)}" draggable="true"`;return`
    <div class="placed ${l.automatic?`h-auto-packed`:`h-${u}`}"
        ${v}
        title="${Z(_)}"
        style="
          background:${s};
          border:1px solid rgba(0,0,0,0.25);
          left:calc(${f}% + 2px);
          right:auto;
          width:calc(${p}% - 4px);
          top:calc(${h}% + 2px);
          bottom:auto;
          height:calc(${g}% - 4px);
          box-sizing:border-box;
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
  `}function Tt(){window.addEventListener(`dragover`,be,{passive:!0}),document.addEventListener(`drop`,L),document.addEventListener(`dragend`,L),document.addEventListener(`dragstart`,e=>{let t=e.target.closest?.(`.palette-rect`);if(t){let n=t.dataset.payload;if(n){e.dataTransfer.setData(`text/plain`,n),e.dataTransfer.effectAllowed=`copy`,me=!0;return}}let n=e.target.closest?.(`.palette-chip`);n&&(e.dataTransfer.setData(`text/plain`,n.dataset.courseId),e.dataTransfer.effectAllowed=`copy`,me=!0)}),document.addEventListener(`dragstart`,e=>{let t=e.target.closest?.(`.placed`);if(t){if(t.closest(`#simModal`)){e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-sim-block`,courseId:t.dataset.simCourse||``,pid:t.dataset.simPid||null,from:{day:Number(t.dataset.simDay),slot:Number(t.dataset.simSlot),pos:t.dataset.simPos||`full`,hpos:t.dataset.simHpos||`single`}})),e.dataTransfer.effectAllowed=`move`,me=!0;return}e.dataTransfer.setData(`text/plain`,JSON.stringify({type:`move-block`,id:t.dataset.id})),e.dataTransfer.effectAllowed=`move`,me=!1}}),kt()}function Et(){return`sim_courses_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function Dt(){try{let e=localStorage.getItem(Et()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function Ot(e){try{localStorage.setItem(Et(),JSON.stringify(e||[]))}catch{}}function kt(){document.querySelectorAll(`.cell.slot`).forEach(t=>{t.classList.contains(`is-lunch`)||(t.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer.dropEffect=e.dataTransfer.effectAllowed===`move`?`move`:`copy`;let n=t.getBoundingClientRect(),r=e.clientX-n.left,i=e.clientY-n.top,a=n.height/2,o=`full`;i<a-10?o=`top`:i>a+10&&(o=`bottom`);let s=`single`,c=r/n.width;c<.4?s=`left`:c>.6&&(s=`right`),t.dataset.droppos=o,t.dataset.droph=s,t.classList.add(`over`),t.classList.remove(`hint-top`,`hint-full`,`hint-bottom`,`hint-left`,`hint-center`,`hint-right`),o===`top`&&t.classList.add(`hint-top`),o===`full`&&t.classList.add(`hint-full`),o===`bottom`&&t.classList.add(`hint-bottom`),s===`left`&&t.classList.add(`hint-left`),s===`single`&&t.classList.add(`hint-center`),s===`right`&&t.classList.add(`hint-right`)}),t.addEventListener(`dragleave`,()=>Y(t)),t.addEventListener(`drop`,async n=>{n.preventDefault();let i=!!t.closest(`#simModal`),a=n.dataTransfer.getData(`text/plain`);if(!a){Y(t);return}let s=parseInt(t.dataset.day,10),c=parseInt(t.dataset.slot,10),l=t.dataset.droppos||`full`,f=t.dataset.droph||`single`,m=null;try{m=JSON.parse(a)}catch{}let h=e=>e.filter(e=>e.day===s&&e.slot===c&&(e.pos||`full`)===l),g=e=>e.filter(e=>e.day===s&&e.slot===c&&(e.pos||`full`)===l&&(e.hpos||`single`)===f);if(m&&m.type===`course-parallel`){let n=m.courseId,r=m.pid||null;if(i){let e=(A||F||[])[c];if(!e){Y(t);return}let i=(D||[]).filter(e=>e.courseId!==n),a=h(i);if(g(i).length){alert(`Ese espacio exacto ya está ocupado.`),Y(t);return}if(a.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(t);return}D=(D||[]).filter(e=>e.courseId!==n);let o=(((E||[]).find(e=>e.id===n)||(d.courses||[]).find(e=>e.id===n)||{}).name||`Ramo`).trim(),u=T.get(n)||[],p=r?u.find(e=>e.pid===r):null,m=p?.section||p?.pid||null,_=m?`${o} · ${m}`:o;D.push({courseId:n,day:s,slot:c,start:e.start,end:e.end,pos:l,hpos:f,pid:r,displayName:_}),K(),await $(),Y(t);return}if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(t);return}let a=(F||[])[c];if(!a){Y(t);return}let u=h(U||[]);if(g(U||[]).length){alert(`Ese espacio exacto ya está ocupado.`),Y(t);return}if(u.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(t);return}let _=(((d.courses||[]).find(e=>e.id===n)||{}).name||`Ramo`).trim(),v=T.get(n)||[],y=r?v.find(e=>e.pid===r):null,b=y?.section||y?.pid||null,x=b?`${_} · ${b}`:null;await o(e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),{courseId:n,day:s,slot:c,start:a.start,end:a.end,pos:l,hpos:f,parallelPid:r||null,displayName:x,createdAt:Date.now()}),r&&O.set(n,r),Y(t);return}if(m&&m.type===`move-sim-block`&&i){let e=m.from||{},n=(D||[]).findIndex(t=>t.courseId===m.courseId&&Number(t.day)===Number(e.day)&&Number(t.slot)===Number(e.slot)&&(t.pos||`full`)===(e.pos||`full`)&&(t.hpos||`single`)===(e.hpos||`single`));if(n<0){Y(t);return}let r=(A||F||[])[c];if(!r||r.lunch){Y(t);return}let i=(D||[]).filter((e,t)=>t!==n),a=g(i),o=h(i);if(a.length){alert(`Ese espacio exacto ya está ocupado.`),Y(t);return}if(o.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(t);return}Object.assign(D[n],{day:s,slot:c,pos:l,hpos:f,start:r.start,end:r.end}),K(),await $(),Y(t);return}if(m&&m.type===`move-block`){let e=m.id;if(!e){Y(t);return}if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(t);return}try{let n=U.find(t=>t.id===e);if(!n){Y(t);return}let i=(F||[])[c];if(!i){Y(t);return}if(n.day===s&&n.slot===c&&(n.pos||`full`)===l&&(n.hpos||`single`)===f){Y(t);return}let a=U.filter(t=>t.id!==e),o=h(a);if(g(a).length){alert(`Ese espacio exacto ya está ocupado.`),Y(t);return}if(o.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(t);return}await r(u(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,e),{day:s,slot:c,pos:l,hpos:f,start:i.start,end:i.end,updatedAt:Date.now()});let m=U.findIndex(t=>t.id===e);m>=0&&Object.assign(U[m],{day:s,slot:c,pos:l,hpos:f,start:i.start,end:i.end}),G(),Y(t);return}catch(e){console.error(`move error`,e),alert(`No se pudo mover el bloque (Firestore): `+(e?.message||e)),Y(t);return}}let _=a;if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre.`),Y(t);return}let v=h(U||[]);if(g(U||[]).length){alert(`Ese espacio exacto ya está ocupado.`),Y(t);return}if(v.length>=2){alert(`Esa franja ya tiene izquierda y derecha ocupadas.`),Y(t);return}if(v.length===1){let e=v[0],n=e.hpos||`single`;if(n===`single`&&f!==`single`){let t=f===`left`?`right`:`left`;try{await r(u(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`,e.id),{hpos:t})}catch{}}else if(n===f){alert(`Ese lado ya está ocupado. Prueba el otro lado.`),Y(t);return}}let y=(F||[])[c];if(!y){Y(t);return}await o(e(p,`users`,d.currentUser.uid,`semesters`,d.activeSemesterId,`schedule`),{courseId:_,day:s,slot:c,start:y.start,end:y.end,pos:l,hpos:f,createdAt:Date.now()}),Y(t)}))})}function Y(e){e.classList.remove(`over`,`hint-top`,`hint-full`,`hint-bottom`,`hint-left`,`hint-center`,`hint-right`),delete e.dataset.droppos,delete e.dataset.droph}function At(){let e=f(`horarioCompartido`);e&&(e.innerHTML=`
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
    `,f(`party-semSel`)?.addEventListener(`change`,e=>{d.partyView=d.partyView||{},d.partyView.semId=e.target.value||null,d.partyView.uid&&d.partyView.semId?$t(d.partyView.uid,d.partyView.semId):Q()}),Q())}function jt(e,t,n,r){let i=r?d.courses||[]:j||[],a=i.find(t=>t.id===e.courseId)?.name||`Ramo`,o=typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():a,s=Ee(i,e.courseId,n),c=De(s),l=typeof e.room==`string`&&e.room.trim()?e.room.trim():null;return`
    <div class="placed pos-${t} h-${e.hpos||`single`}"
        title="${Z(`${o}${l?` · Sala: ${l}`:``}`)}"
        style="background:${s}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${c}; font-weight:600;">${Z(o)}</div>
    </div>
  `}async function Mt(e,t){let n=we(t),r=n===`USM`||n===`UMAYOR`;if(e)try{let t=await i(u(p,`users`,e,`custom_schedules`,n));if(t.exists()){let e=t.data()?.slots||[];if(Array.isArray(e)&&e.length>0)return{uni:n,slots:e}}}catch(e){console.warn(`[shared] error leyendo custom_schedules del dúo`,e)}return r?{uni:n,slots:n===`UMAYOR`?xe:z}:{uni:n,slots:null}}async function Nt({course:n,day:i,slot:a,room:o}){if(!d.currentUser||!d.activeSemesterId)throw Error(`No logueado`);let s=d.activeSemesterId,c=d.currentUser.uid,l=(d.courses||[]).find(e=>(e.name||``).toLowerCase().includes(String(n).toLowerCase()));if(!l)throw Error(`Curso no encontrado`);let u=(await t(e(p,`users`,c,`semesters`,s,`schedule`))).docs.find(e=>{let t=e.data();return t.courseId===l.id&&t.day===i&&t.slot===a});if(!u)throw Error(`No encontré el bloque en el horario`);return await r(u.ref,{room:o||null,updatedAt:Date.now()}),{ok:!0,room:o}}async function Pt(n=null){if(!d.currentUser)throw Error(`No logueado`);let r=n||d.activeSemesterId;if(!r)throw Error(`No hay semestre activo`);return(await t(e(p,`users`,d.currentUser.uid,`semesters`,r,`schedule`))).docs.map(e=>({id:e.id,...e.data()}))}async function Ft(n=null){if(!d.currentUser)throw Error(`No logueado`);let r=n||d.activeSemesterId;if(!r)throw Error(`No hay semestre activo`);if(!d.pairOtherUid)return{items:[]};let i=(await t(e(p,`users`,d.currentUser.uid,`semesters`,r,`schedule`))).docs.map(e=>({...e.data()})),a=(await t(e(p,`users`,d.pairOtherUid,`semesters`,r,`schedule`))).docs.map(e=>({...e.data()})),o=[];for(let e of i)for(let t of a)e.day===t.day&&e.slot===t.slot&&o.push(`${[`Lun`,`Mar`,`Mié`,`Jue`,`Vie`][e.day]} bloque ${e.slot} (${e.courseName} / ${t.courseName})`);return{items:o}}async function It(e,t=null){if(!d.currentUser)throw Error(`No logueado`);let n=t||d.activeSemesterId;return await s(u(p,`users`,d.currentUser.uid,`semesters`,n,`schedule`,e)),{ok:!0}}document.addEventListener(`dragstart`,e=>{let t=e.target.closest(`.placed`);t&&t.classList.add(`dragging`)}),document.addEventListener(`dragend`,e=>{let t=e.target.closest(`.placed`);t&&t.classList.remove(`dragging`)});var Lt=480,Rt=1320;function X(e){let[t,n]=e.split(`:`).map(Number);return t*60+n}function zt(e){return(e-Lt)/(Rt-Lt)*100}document.addEventListener(`auth:ready`,()=>{setTimeout(()=>{Be(),Ve()},1e3)}),document.addEventListener(`semester:changed`,()=>{Ve()});async function Bt(e,t){d.currentUser&&await l(u(p,`users`,d.currentUser.uid,`custom_schedules`,e),{slots:t,updatedAt:Date.now()})}async function Vt(e){if(!d.currentUser)return!1;try{return await s(u(p,`users`,d.currentUser.uid,`custom_schedules`,e)),!0}catch(e){return console.error(`[Firestore] Error al eliminar horario personalizado:`,e),!1}}async function Ht(){let e=f(`partyBar`);if(!e)return;let t=d.currentUser?.uid,n=(d.partyMembers||[]).filter(Boolean).filter(e=>e!==t);if(!n.length){e.innerHTML=`<div class="muted">No hay miembros en tu party.</div>`;return}if(d.partyView=d.partyView||{},!d.partyView.uid){let e=d.currentUser?.uid;d.partyView.uid=n.find(t=>t!==e)||e||n[0]}await Promise.all(n.map(e=>Ut(e,{force:!0}))),e.innerHTML=n.map(e=>{let t=N[e]||{},n=t.name||(e===d.currentUser?.uid?`Yo`:`Usuario`),r=H(t.color)?t.color:`#64748b`,i=e===d.partyView.uid;return`
    <button class="party-chip btn ${i?`violet`:`violet-outline`} ${i?`is-active`:``}"
      data-uid="${Z(e)}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${i?`outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);`:``}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${r};display:inline-block;"></span>
      <span style="font-weight:700">${Z(n)}</span>
    </button>
  `}).join(``),e.querySelectorAll(`button[data-uid]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.uid;d.partyView.uid=t,await Ht(),await Xt(t),await Zt(),d.partyView.semId?$t(t,d.partyView.semId):Q()})})}async function Ut(e,{force:t=!1}={}){if(e&&!(!t&&N[e]))try{let t=u(p,`users`,e),n=u(p,`users`,e,`profile`,`profile`),[r,a]=await Promise.all([i(t),i(n)]),o=r.exists()&&r.data()||{},s=a.exists()&&a.data()||{};N[e]={name:typeof s.name==`string`&&s.name.trim()?s.name.trim():typeof o.name==`string`&&o.name.trim()?o.name.trim():typeof o.displayName==`string`&&o.displayName.trim()?o.displayName.trim():typeof o.username==`string`&&o.username.trim()?o.username.trim():``,color:typeof s.favoriteColor==`string`&&s.favoriteColor.trim()?s.favoriteColor.trim():typeof o.favoriteColor==`string`&&o.favoriteColor.trim()?o.favoriteColor.trim():``}}catch(t){console.warn(`loadPartyMemberProfile error`,t),N[e]=N[e]||{name:``,color:``}}}function Z(e){return String(e||``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function Wt(){return`sim_palette_order_${d.currentUser?.uid||`anon`}_${d.activeSemesterId||`noSem`}`}function Gt(){try{let e=localStorage.getItem(Wt()),t=JSON.parse(e||`[]`);return Array.isArray(t)?t:[]}catch{return[]}}function Kt(e){try{localStorage.setItem(Wt(),JSON.stringify(e||[]))}catch{}}function qt(e){let t=Gt();if(!t.length)return e;let n=new Map(t.map((e,t)=>[e,t])),r=999999;return[...e].sort((e,t)=>{let i=n.has(e.id)?n.get(e.id):r,a=n.has(t.id)?n.get(t.id):r;return i===a?String(e.name||``).localeCompare(String(t.name||``),`es`):i-a})}function Jt(){let e=document.getElementById(`simPaletteHost`);if(!e)return;let t=null;e.querySelectorAll(`.sim-course-group[draggable="true"]`).forEach(n=>{n.addEventListener(`dragstart`,e=>{t=n.dataset.courseId,e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,t),n.classList.add(`dragging`)}),n.addEventListener(`dragend`,()=>{t=null,n.classList.remove(`dragging`),e.querySelectorAll(`.sim-course-group`).forEach(e=>e.classList.remove(`drag-over`))}),n.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer.dropEffect=`move`,n.classList.add(`drag-over`)}),n.addEventListener(`dragleave`,()=>{n.classList.remove(`drag-over`)}),n.addEventListener(`drop`,r=>{r.preventDefault(),n.classList.remove(`drag-over`);let i=n.dataset.courseId;if(!t||!i||t===i)return;Gt().length||Kt(Array.from(e.querySelectorAll(`.sim-course-group`)).map(e=>e.dataset.courseId).filter(Boolean));let a=Gt().filter(Boolean),o=(d.courses||[]).map(e=>e.id);for(let e of o)a.includes(e)||a.push(e);let s=a.filter(e=>e!==t),c=s.indexOf(i);s.splice(Math.max(0,c),0,t),Kt(s),W()})})}function Yt(){if(document.getElementById(`simPaletteReorderStyles`))return;let e=document.createElement(`style`);e.id=`simPaletteReorderStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}async function Xt(n){let r=f(`party-semSel`);if(!r||(r.innerHTML=`<option value="">— seleccionar —</option>`,!n))return;let i=(await t(a(e(p,`users`,n,`semesters`)))).docs.map(e=>({id:e.id,label:(e.data()?.label||e.id).trim()}));i.sort((e,t)=>t.label.localeCompare(e.label));for(let e of i){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.label,r.appendChild(t)}}async function Zt(){let e=d.partyView?.uid,t=d.activeSemesterData?.label,n=f(`party-semSel`);if(!e||!t||!n)return;await Xt(e);let r=Array.from(n.options),i=r.find(e=>(e.textContent||``).trim()===t);if(i)n.value=i.value,d.partyView.semId=i.value,await $t(e,i.value);else{let t=r.find(e=>e.value);n.value=t?t.value:``,d.partyView.semId=n.value||null,d.partyView.semId&&await $t(e,d.partyView.semId)}}function Q(){let e=f(`schedPartyUSM`);if(!e)return;if(!j||j.length===0){e.innerHTML=`<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>`;return}let t=ce||z;ve=t,e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${M===`USM`?`Bloque`:`Módulo`}</div>
        ${I.map(e=>`<div class="cell header">${e}</div>`).join(``)}
        ${t.map((e,t)=>`
          <div class="cell mod ${e.lunch?`lunch`:``}" data-slot="${t}">
            ${xt(e,t,M)}
          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}">
              ${Qt(r,t)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `}function Qt(e,t){let n=se.filter(n=>n.day===e&&n.slot===t),r=e=>{let t=n.filter(t=>(t.pos||`full`)===e);if(!t.length)return``;let r=t.sort((e,t)=>{let n={left:0,single:1,right:2};return(n[e.hpos||`single`]??1)-(n[t.hpos||`single`]??1)}),i=N[d.partyView?.uid]?.color||ne;return r.map(t=>jt(t,e,i,!1)).join(``)};return`
      ${r(`top`)}
      ${r(`full`)}
      ${r(`bottom`)}
    `}async function $t(t,r){if(!await h(t,`horario`)){let e=f(`schedPartyUSM`);e&&(e.innerHTML=m(`su horario`));return}if(ie&&=(ie(),null),ae&&=(ae(),null),oe&&=(oe(),null),!t||!r)return;if(!bt(t,r)){se=[],j=[],ce=null,M=`USM`;let e=f(`schedPartyUSM`);e&&(e.innerHTML=`<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>`)}let{uni:o,slots:s}=await Mt(t,d.partyView?.semId?(await i(u(p,`users`,t,`semesters`,d.partyView.semId))).data()?.universityAtThatTime:``);M=o,ce=s||(o===`UMAYOR`?xe:z),oe=c(u(p,`users`,t),e=>{let n=e.data()||{};N[t]=N[t]||{},N[t].color=n.favoriteColor||N[t].color||``,N[t].name=n.displayName||n.name||n.username||N[t].name||``,Q()}),ae=c(a(e(p,`users`,t,`semesters`,r,`courses`),n(`name`)),e=>{j=e.docs.map(e=>({id:e.id,...e.data()})),w.set(yt(t,r),{uni:M,slots:ce,items:se,courses:j}),Q()}),ie=c(a(e(p,`users`,t,`semesters`,r,`schedule`)),e=>{se=e.docs.map(e=>({id:e.id,...e.data()})),w.set(yt(t,r),{uni:M,slots:ce,items:se,courses:j}),Q()})}async function en(){for(let[,e]of le.entries()){try{e.prof?.()}catch{}try{e.courses?.()}catch{}try{e.sched?.()}catch{}}le.clear(),P.clear()}async function tn(n,r,{allowFallback:i=!0}={}){let o=(await t(a(e(p,`users`,n,`semesters`)))).docs.map(e=>({id:e.id,label:String(e.data()?.label||e.id).trim()}));if(!o.length)return null;let s=r?o.find(e=>e.label===r):null;return s?s.id:!i&&r?null:(o.sort((e,t)=>t.label.localeCompare(e.label)),o[0].id)}async function nn(t=null){let r=d.currentUser?.uid,i=Array.from(new Set([...d.partyMembers||[],r])).filter(Boolean);if(!i.length){let e=f(`schedPartyBusy`);e&&(e.innerHTML=`<div class="muted">No hay miembros en tu party.</div>`);return}await en();let o=t??(d.activeSemesterData?.label||null),s=!!t;await Promise.all(i.map(e=>Ut(e,{force:!0})));for(let t of i){let r=await tn(t,o,{allowFallback:!s});if(!r)continue;let i=N[t]||{};P.set(t,{name:i.name||(t===d.currentUser?.uid?`Yo`:`Usuario`),color:i.color||`#64748b`,uni:`USM`,slots:null,courses:[],items:[],semId:r});let l=(e,t=`#64748b`)=>{let n=String(e||``).trim();return/^#[0-9A-Fa-f]{6}$/.test(n)?n:t},f=(e,t=`Usuario`)=>String(e||``).trim()||t,m={};m.prof=c(u(p,`users`,t,`profile`,`profile`),e=>{let n=e.data()||{},r=P.get(t);r&&(r.color=l(n.favoriteColor,r.color||`#64748b`),r.name=f(n.name,r.name||(t===d.currentUser?.uid?`Yo`:`Usuario`)),pe())}),m.courses=c(a(e(p,`users`,t,`semesters`,r,`courses`),n(`name`)),e=>{let n=P.get(t);n&&(n.courses=e.docs.map(e=>({id:e.id,...e.data()})),pe())}),m.sched=c(a(e(p,`users`,t,`semesters`,r,`schedule`)),e=>{let n=P.get(t);n&&(n.items=e.docs.map(e=>({id:e.id,...e.data(),_uid:t})),pe())}),le.set(t,m)}pe()}function rn(e){let t=[...e].sort((e,t)=>e.startMin-t.startMin||e.endMin-t.endMin),n=[];for(let e of t){let t=!1;for(let r=0;r<n.length;r++)if(n[r]<=e.startMin){e._lane=r,n[r]=e.endMin,t=!0;break}t||(e._lane=n.length,n.push(e.endMin))}return{blocks:t,laneCount:n.length||1}}function an(){if(document.getElementById(`timelineStyles`))return;let e=document.createElement(`style`);e.id=`timelineStyles`,e.textContent=`
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
    `,document.head.appendChild(e)}function on(e=`schedPartyBusy`){an();let t=document.getElementById(e);if(!t)return;let n=Array.from(P.entries());if(!n.length){t.innerHTML=`<div class="muted">Cargando party…</div>`;return}let r=[];for(let[e,t]of n)for(let n of t.items||[]){let i=X(n.start),a=X(n.end);isNaN(i)||isNaN(a)||a<=i||r.push({...n,_uid:e,_name:t.name,_favColor:t.color,startMin:i,endMin:a})}t.innerHTML=`
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
              ${sn()}
              ${(()=>{let e=rn(r.filter(e=>e.day===t).map(e=>({...e,topPct:zt(e.startMin),heightPct:zt(e.endMin)-zt(e.startMin)})).filter(e=>e.heightPct>0));return e.blocks.map(t=>cn(t,e.laneCount)).join(``)})()}
            </div>
          `).join(``)}
        </div>
      </div>
    `}function sn(){return Array.from({length:15},(e,t)=>{let n=100/15*t;return`
        <div class="timeline-line" style="top:${n}%"></div>
        <div class="timeline-line half" style="top:${n+100/15/2}%"></div>
      `}).join(``)}function cn(e,t){let n=P.get(e._uid),r=n?.color||e._favColor||`#64748b`,i=((n?.courses||[]).find(t=>t.id===e.courseId)?.name||`Ramo`).trim(),a=t>1,o=r,s=ln(o,a?.35:.9),c=De(o),l=ln(o,1),u=a?e._lane===0?`top`:e._lane===1?`bottom`:`center`:`center`,d=u===`top`?`top:6px; transform:none;`:u===`bottom`?`bottom:6px; transform:none;`:`top:50%; transform:translateY(-50%);`,f=10+(e._lane||0);return`
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
    `}function ln(e,t){return H(e)?`rgba(${parseInt(e.slice(1,3),16)},${parseInt(e.slice(3,5),16)},${parseInt(e.slice(5,7),16)},${Math.max(0,Math.min(1,t))})`:`rgba(100,116,139,${t})`}function un(e){let t=document.getElementById(e);if(!t)return;let n=Array.from(P.entries()).map(([e,t])=>({uid:e,name:t?.name||(e===d.currentUser?.uid?`Yo`:`Usuario`),color:t?.color||`#64748b`})).sort((e,t)=>e.name.localeCompare(t.name,`es`));if(!n.length){t.innerHTML=`<div class="muted">Cargando integrantes…</div>`;return}t.innerHTML=n.map(e=>`
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${H(e.color)?e.color:`#64748b`};display:inline-block;"></span>
        <span style="font-weight:800">${Z(e.name)}</span>
      </div>
    `).join(``)}function dn(){let e=document.getElementById(`simModal`);e&&e.remove();let t=document.createElement(`div`);t.id=`simModal`,t.style.cssText=`
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
    `,document.body.appendChild(t);let n=t,r=e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),a())},i=()=>{n.style.display=`none`,x=!1,C=null,A=null,document.removeEventListener(`keydown`,r),document.documentElement.classList.remove(`sim-lock`),document.body.classList.remove(`sim-lock`),L(),document.dispatchEvent(new Event(`courses:changed`))};document.getElementById(`simExportBtn`)?.addEventListener(`click`,async e=>{if(e.preventDefault(),e.stopPropagation(),!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo.`);return}if(!await q({title:`Exportar simulación`,text:`¿Quieres exportar esta simulación a tu semestre?`,yesText:`Sí, exportar`,noText:`Cancelar`}))return;let t=document.getElementById(`simExportBtn`);t&&(t.disabled=!0,t.textContent=`Exportando...`);try{await hn(),yn(),A=null,E=[],D=[],T.clear?.(),O.clear?.(),C=null,i(),await G(),alert(`✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.`)}catch(e){console.error(e),alert(`No se pudo exportar la simulación. Revisa consola.`)}finally{t&&(t.disabled=!1,t.textContent=`Exportar a mi horario`)}}),document.getElementById(`simDeleteBtn`)?.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),await q({title:`Eliminar simulación`,text:`Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?`,yesText:`Sí, eliminar`,noText:`Cancelar`})&&(yn(),A=null,E=[],D=[],T.clear?.(),O.clear?.(),C=null,i())});let a=async()=>{if(!await q({title:`Salir del simulador`,text:`¿Quieres salir del simulador?`,yesText:`Sí, salir`,noText:`Cancelar`}))return;let e=await gt({title:`Salir del simulador`,message:fe()?`Tienes cambios sin guardar. ¿Qué quieres hacer?`:`No hiciste cambios. ¿Cómo quieres salir?`,saveText:`Guardar y salir`,discardText:`Salir sin guardar`,cancelText:`Cancelar`});if(e!==`cancel`){if(e===`save`){vn(),i();return}if(e===`discard`){ht(C,{persist:!0}),Ge(),G(),i();return}}};document.getElementById(`simX`)?.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),a()}),n.addEventListener(`click`,e=>{e.target===n&&a()}),document.addEventListener(`keydown`,e=>{n.style.display===`flex`&&e.key===`Escape`&&(e.preventDefault(),a())})}function fn(e,t){let n=D.filter(n=>n.day===e&&n.slot===t);return n.length?Ct(n,!0):``}async function pn(e,t){let n=(T.get(e)||[]).find(e=>e.pid===t);if(!n)return;let r=A||await Te();if(!r)return;D=D.filter(t=>t.courseId!==e);let i=(((E||[]).find(t=>t.id===e)||(d.courses||[]).find(t=>t.id===e)||{}).name||`Ramo`).trim(),a=n.section||t;for(let o of n.blocks||[]){let n=r?.[o.slot];!n||n.lunch||D.push({courseId:e,day:o.day,slot:o.slot,start:n.start,end:n.end,pos:o.pos||`full`,hpos:o.hpos||`single`,pid:t,displayName:`${i} · ${a}`})}O.set(e,t),mt(),K(),W(),await $()}async function $(){let e=document.getElementById(`simGridHost`);if(!e)return;let t=A||await Te();if(!t){e.innerHTML=`
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
            ${xt(e,t,n)}
          </div>
          ${I.map((n,r)=>`
            <div class="cell slot ${e.lunch?`is-lunch`:``}"
                data-day="${r}" data-slot="${t}"
                ${e.lunch?`aria-disabled="true"`:``}
                style="${e.lunch?`pointer-events:none; opacity:.65;`:``}">
                ${fn(r,t)}
            </div>
          `).join(``)}
        `).join(``)}
      </div>
    `,kt()}async function mn(){if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo antes de usar el simulador.`);return}let e=lt();if(e&&Array.isArray(e)&&e.length)A=e;else{let e=await vt();if(!e)return;A=e,ut(A)}ee=!1,dn();let t=document.getElementById(`simModal`),n=document.getElementById(`simModalPanel`);document.documentElement.classList.add(`sim-lock`),document.body.classList.add(`sim-lock`),t.style.display=`flex`,x=!0,E=Dt(),D=at(),Array.isArray(D)||(D=[]);let r=dt();T.clear?.();for(let[e,t]of r.entries())T.set(e,t||[]);let i=pt();O.clear?.();for(let[e,t]of i.entries())t&&O.set(e,t);document.dispatchEvent(new Event(`courses:changed`));let a=document.getElementById(`simActiveSemLabel`);a&&(a.textContent=d.activeSemesterData?.label||d.activeSemesterId||`—`),await $(),W(),requestAnimationFrame(()=>{n&&(n.scrollTop=0)}),C=de()}async function hn(){if(!d.currentUser||!d.activeSemesterId){alert(`Selecciona un semestre activo.`);return}let r=d.currentUser.uid,i=d.activeSemesterId,c=V()||`UNI_desconocida`,l=A||await Te();if(!l||!Array.isArray(l)||!l.length){alert(`No hay slots para guardar la simulación.`);return}try{R[c]=l,localStorage.setItem(`custom_slots_${c}_${r}`,JSON.stringify(l)),await Bt(c,l)}catch(e){console.warn(`No se pudo persistir slots base`,e)}let f=e(p,`users`,r,`semesters`,i,`courses`),m=e(p,`users`,r,`semesters`,i,`schedule`),[h,g]=await Promise.all([t(a(f)),t(a(m))]),_=h.docs.map(e=>({id:e.id,...e.data()})),v=g.docs.map(e=>({id:e.id,...e.data()})),y=_.length>0,b=!0;y&&(b=!!await q({title:`Exportar simulación`,text:`Ya tienes ramos guardados en este semestre.

¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?`,yesText:`Sí, borrar anteriores`,noText:`No, que convivan`})),b&&(await _n(m),await _n(f));let x=b?[]:_,S=b?[]:v,C=new Map;for(let e of x){let t=gn(e?.code||e?.codigo||``);t&&(C.has(t)||C.set(t,new Set),C.get(t).add(e.id))}let w=new Map;for(let e of x){let t=gn(e?.name||e?.nombre||``);t&&w.set(t,e.id)}let T=new Map,O=(E||[]).filter(e=>String(e.id||``).startsWith(`SIM_`));for(let e of O){let n={name:(e.name||``).trim()||`Ramo`,code:(e.code||``).trim()||``,professor:e.professor||``,section:e.section||``,color:H(e.color)?e.color:`#3B82F6`,asistencia:!!e.asistencia,createdAt:Date.now()},c=gn(n.code);if(!b&&c&&C.has(c)){let e=Array.from(C.get(c)||[]);if(e.length){let n=(await t(a(m))).docs.filter(t=>e.includes(t.data()?.courseId));for(let e of n)await s(e.ref);for(let t of e){await s(u(p,`users`,r,`semesters`,i,`courses`,t));for(let[e,n]of w.entries())n===t&&w.delete(e)}}C.delete(c)}if(!b&&!c){let t=gn(n.name),r=w.get(t);if(r){T.set(e.id,r);continue}}let l=await o(f,n);c&&(C.has(c)||C.set(c,new Set),C.get(c).add(l.id)),T.set(e.id,l.id);let d=gn(n.name);d&&w.set(d,l.id)}d.courses=(await t(a(f,n(`createdAt`)))).docs.map(e=>({id:e.id,...e.data()})),document.dispatchEvent(new Event(`courses:changed`));let k=e=>[String(e.courseId||``),Number(e.day),Number(e.slot),String(e.pos||`full`),String(e.hpos||`single`),String(e.pid||e.parallelPid||``),String(e.displayName||``).trim(),String(e.start||``),String(e.end||``)].join(`|`),ee=new Set((S||[]).map(e=>k({courseId:e.courseId,day:e.day,slot:e.slot,pos:e.pos,hpos:e.hpos,pid:e.parallelPid,displayName:e.displayName,start:e.start,end:e.end})));for(let e of D||[]){let t=T.get(e.courseId)||e.courseId;if(String(t).startsWith(`SIM_`))continue;let n=l[e.slot];if(!n||n.lunch)continue;let r={courseId:t,day:e.day,slot:e.slot,start:n.start,end:n.end,pos:e.pos||`full`,hpos:e.hpos||`single`,parallelPid:e.pid||e.parallelPid||null,displayName:typeof e.displayName==`string`&&e.displayName.trim()?e.displayName.trim():null,createdAt:Date.now()};if(!b){let e=k(r);if(ee.has(e))continue;ee.add(e)}await o(m,r)}}function gn(e){return String(e||``).trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}async function _n(e){let n=await t(e);for(let e of n.docs)await s(e.ref)}function vn(){ut(A),Ot(E),it(),ft(),mt(),C=de()}function yn(){try{localStorage.removeItem(ot())}catch{}try{localStorage.removeItem(Et())}catch{}try{localStorage.removeItem(st())}catch{}try{localStorage.removeItem(ct())}catch{}try{localStorage.removeItem(nt())}catch{}try{localStorage.removeItem(Wt())}catch{}}export{xe as MAYOR_SLOTS,z as USM_SLOTS,Pt as getMySchedule,Be as initSchedule,Ve as onActiveSemesterChanged,mn as openSimSchedule,Ft as overlapWithPair,We as refreshCourseOptions,It as removeBlock,Nt as setRoom};