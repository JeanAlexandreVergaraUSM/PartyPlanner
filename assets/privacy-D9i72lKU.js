import{b as e,i as t}from"./index.esm-DxDnhweQ.js";import{c as n,d as r,r as i}from"./index-CFfnISX6.js";var a=new Set([`notas`,`horario`,`malla`,`calendario`]);function o(t,n){return e(r,`users`,t,`privacy`,`partyAccess`,`viewers`,n)}async function s(e,r){let i=n.currentUser?.uid;if(!e||!i||!a.has(r))return!1;if(e===i)return!0;try{let n=await t(o(e,i));return!(n.exists()&&n.data()||{})?.[r]}catch(e){return console.warn(`[privacy] No se pudo revisar permiso; acceso denegado:`,e),!1}}function c(e=`esta sección`){return`
    <div class="card" style="
      padding:22px;
      text-align:center;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(15,23,42,.72);
    ">
      <div style="font-size:34px;margin-bottom:8px;">🔒</div>
      <h3 style="margin:0 0 8px;">Contenido privado</h3>
      <div class="muted">
        Este usuario decidió ocultar ${i(e)} para ti.
      </div>
    </div>
  `}export{c as n,s as t};