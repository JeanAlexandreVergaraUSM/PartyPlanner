import{i as e,v as t}from"./index.esm-BR0qfrzH.js";import{c as n,r,u as i}from"./index-Dmmp0C--.js";var a=new Set([`notas`,`horario`,`malla`,`calendario`]);function o(e,n){return t(i,`users`,e,`privacy`,`partyAccess`,`viewers`,n)}async function s(t,r){let i=n.currentUser?.uid;if(!t||!i||!a.has(r))return!1;if(t===i)return!0;try{let n=await e(o(t,i));return!(n.exists()&&n.data()||{})?.[r]}catch(e){return console.warn(`[privacy] No se pudo revisar permiso; acceso denegado:`,e),!1}}function c(e=`esta sección`){return`
    <div class="card" style="
      padding:22px;
      text-align:center;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(15,23,42,.72);
    ">
      <div style="font-size:34px;margin-bottom:8px;">🔒</div>
      <h3 style="margin:0 0 8px;">Contenido privado</h3>
      <div class="muted">
        Este usuario decidió ocultar ${r(e)} para ti.
      </div>
    </div>
  `}export{c as n,s as t};