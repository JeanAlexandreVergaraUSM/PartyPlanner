import{getApps as Xs,getApp as eo,initializeApp as to}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";import{getAuth as no,setPersistence as ro,browserLocalPersistence as ao,GoogleAuthProvider as la,signInWithPopup as ca,signOut as da,onAuthStateChanged as so}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";import{initializeFirestore as oo,persistentLocalCache as io,updateDoc as ae,doc as $,query as Q,collection as T,getDocs as F,setDoc as fe,arrayRemove as Nr,getDoc as ee,deleteDoc as ye,onSnapshot as G,arrayUnion as lo,orderBy as ve,addDoc as Ce,where as Va,serverTimestamp as Wa,Timestamp as co}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";import uo from"https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm";import{jsPDF as Ja}from"https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const po="modulepreload",mo=function(e,t){return new URL(e,t).href},ua={},de=function(t,n,r){let a=Promise.resolve();if(n&&n.length>0){const i=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));a=Promise.allSettled(n.map(d=>{if(d=mo(d,r),d in ua)return;ua[d]=!0;const p=d.endsWith(".css"),f=p?'[rel="stylesheet"]':"";if(!!r)for(let b=i.length-1;b>=0;b--){const y=i[b];if(y.href===d&&(!p||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const g=document.createElement("link");if(g.rel=p?"stylesheet":po,p||(g.as="script"),g.crossOrigin="",g.href=d,c&&g.setAttribute("nonce",c),document.head.appendChild(g),p)return new Promise((b,y)=>{g.addEventListener("load",b),g.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return a.then(i=>{for(const o of i||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},fo={apiKey:"AIzaSyB45g_2KRGlXH0iAPyBGuCnrFkhxCHadKs",authDomain:"nacholo.firebaseapp.com",projectId:"nacholo",storageBucket:"nacholo.appspot.com",messagingSenderId:"924503328068",appId:"1:924503328068:web:1f753ced7f47ec36750311"},Ka=Xs().length?eo():to(fo),k=oo(Ka,{localCache:io()}),wt=no(Ka);ro(wt,ao).catch(()=>{});const l={currentUser:null,currentPartyId:null,partyMembers:[],partyProfiles:{},partyPrivacy:{},profileData:null,activeSemesterId:null,activeSemesterData:null,unsubscribeCourses:null,editingCourseId:null,shared:{horario:{semId:null},notas:{semId:null},malla:{enabled:!1},calendar:{semId:null}},DEBUG:(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(new URLSearchParams(location.search).has("debug")||((window==null?void 0:window.PartyPlannerDebug)??!1))},u=e=>typeof e=="string"?document.getElementById(e):null;function ke(){var t;if(!l.DEBUG)return;const e=u("state");e&&(e.textContent=JSON.stringify({uid:((t=l.currentUser)==null?void 0:t.uid)||null,partyId:l.currentPartyId,members:l.partyMembers,profileData:l.profileData,activeSemesterId:l.activeSemesterId,editingCourseId:l.editingCourseId},null,2))}function an(e,t){e&&(t?e.classList.add("hidden"):e.classList.remove("hidden"))}window.__state=l;let rt=null,We={};function Rn(){const e={members:l.partyMembers};document.dispatchEvent(new CustomEvent("party:ready",{detail:e})),document.dispatchEvent(new CustomEvent("party:changed",{detail:e})),$r()}function yo(e){return e.university?e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university==="OTRA"?e.customUniversity||"Otra":e.university:"—"}function go(e){return e.career?e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career==="OTRA"?e.customCareer||"Otra":e.career:"—"}function vo(e){if(!e)return"—";const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}/${t[2]}/${t[1]}`:e}function bo(e,t){const n=e.name||e.fullName||"Usuario",r=yo(e),a=go(e),s=vo(e.birthday),i=e.uniEmail||"—",o=e.phone||"—",c=e.favoriteColor||"#6366f1",d=e.avatarData?`<div class="party-member-icon" 
         style="background-image:url('${e.avatarData}');
                background-size:cover;background-position:center">
       </div>`:`<div class="party-member-icon" style="background:${c}">
         ${n.charAt(0).toUpperCase()}
       </div>`,p=l.partyMembers[0],f=l.currentUser.uid===p,m=t===p,g=f&&!m?`<button class="kick-btn" data-kick="${t}">Quitar</button>`:"",b=f&&!m?`<button class="transfer-btn" data-transfer="${t}">👑 Transferir host</button>`:"",h=t===l.currentUser.uid?"":`<button class="privacy-btn" data-privacy="${t}">🔒 Privacidad</button>`,w=e.lastOnline||0,A=Date.now()-w<3e3;return`
    <div class="party-member-card">
      ${d}
      <div class="party-member-info">
        <div class="name-row">
  <b>${n}</b>
  ${m?'<span class="host-badge">👑 HOST</span>':""}
  ${g}
  ${b}
  ${h}
</div>

        <div class="muted">${r} — ${a}</div>
        <div class="muted"><b>Nac:</b> ${s}</div>
        <div class="muted"><b>Email:</b> ${i}</div>
        <div class="muted"><b>Tel:</b> ${o}</div>

        <div class="muted">
          <b>Color:</b>
          <span style="display:inline-block;width:14px;height:14px;background:${c};
                       border-radius:4px;margin-left:6px;vertical-align:middle;"></span>
        </div>

        <code style="opacity:.4;font-size:.7rem">${t}</code>
        ${`
  <div class="muted">
      <b>Estado:</b>
      <span class="conn-dot ${A?"on":"off"}"></span>
      <span>${A?"Conectado":"Desconectado"}</span>
  </div>
`}

      </div>
    </div>
  `}async function $r(){const e=u("partyMembersList");if(!e)return;if(!l.currentPartyId){e.innerHTML='<p class="muted">No estás en ninguna party.</p>';return}if(!l.partyMembers.length){e.innerHTML='<p class="muted">Aún no hay miembros en esta party.</p>';return}let t="";for(const n of l.partyMembers){const r=l.partyProfiles[n]||{};t+=bo(r,n)}e.innerHTML=t,l.currentUser.uid,l.partyMembers[0],document.querySelectorAll(".kick-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.kick;if(!confirm("¿Quieres quitar a este miembro de la party?"))return;const a=$(k,"pairs",l.currentPartyId);await ae(a,{members:Nr(r)}),showToast("Miembro eliminado","success")})}),document.querySelectorAll(".transfer-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.transfer;if(!confirm("¿Quieres transferir el host a este miembro?"))return;const a=$(k,"pairs",l.currentPartyId),i=[...l.partyMembers].filter(c=>c!==r),o=[r,...i];await ae(a,{members:o}),showToast("Host transferido","success")})}),document.querySelectorAll(".privacy-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.privacy;r&&$o(r)})})}function ho(){var o,c,d,p,f,m;(o=u("createPairBtn"))==null||o.addEventListener("click",wo),(c=u("copyInviteBtn"))==null||c.addEventListener("click",Co);const e=async()=>{var y;const g=(((y=u("joinCode"))==null?void 0:y.value)||"").trim(),b=Lo(g);b?await So(b):alert("Pega un ID válido de party."),u("joinCode").value=""};(d=u("joinByCodeBtn"))==null||d.addEventListener("click",e),(p=u("joinCode"))==null||p.addEventListener("keydown",g=>{g.key==="Enter"&&e()});const t=u("leavePartyModal"),n=u("leavePartyConfirm"),r=u("leavePartyCancel");(f=u("deletePairBtn"))==null||f.addEventListener("click",()=>{if(!l.currentPartyId){alert("No estás en ninguna party.");return}t==null||t.classList.add("active")}),r==null||r.addEventListener("click",()=>{t==null||t.classList.remove("active")}),n==null||n.addEventListener("click",async()=>{t==null||t.classList.remove("active"),await Eo()});const a=u("closePartyModal"),s=u("closePartyConfirm"),i=u("closePartyCancel");(m=u("closePartyBtn"))==null||m.addEventListener("click",()=>{const g=l.partyMembers[0];if(l.currentUser.uid!==g){showToast("Solo el host puede cerrar la party","error");return}a.classList.add("active")}),i==null||i.addEventListener("click",()=>{a.classList.remove("active")}),s==null||s.addEventListener("click",async()=>{a.classList.remove("active"),await Io()})}async function xo(){if(!l.currentUser)return;await Ao();const e=Q(T(k,"pairs")),t=await F(e),n=[];t.forEach(a=>{const s=a.data()||{};Array.isArray(s.members)&&s.members.includes(l.currentUser.uid)&&n.push({id:a.id,...s})}),n.sort((a,s)=>Number(s.createdAt)-Number(a.createdAt));const r=n[0]||null;l.currentPartyId=(r==null?void 0:r.id)||null,l.partyMembers=(r==null?void 0:r.members)||[],On(),Xt(),u("pairId").textContent=l.currentPartyId||"—",u("copyInviteBtn").disabled=!l.currentPartyId,ke(),Rn(),Pr(l.currentPartyId)}async function wo(){if(!l.currentUser)return;const e=$(T(k,"pairs"));await fe(e,{members:[l.currentUser.uid],createdAt:Date.now()}),await Za(e.id),l.currentPartyId=e.id,l.partyMembers=[l.currentUser.uid],On(),Xt(),u("pairId").textContent=e.id,u("copyInviteBtn").disabled=!1,ke(),Rn(),Pr(e.id)}async function So(e){if(!l.currentUser)return;const t=$(k,"pairs",e),n=await ee(t);if(!n.exists())return alert("La party no existe.");const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(l.currentUser.uid)&&a.length>=5){alert("Esta party ya tiene 5 miembros.");return}a.includes(l.currentUser.uid)||await ae(t,{members:lo(l.currentUser.uid)}),await Za(e);const i=(await ee(t)).data()||{};l.currentPartyId=e,l.partyMembers=i.members||[],On(),Xt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,ke(),Rn(),Pr(e)}function Pr(e){if(rt&&(rt(),rt=null),!e)return;const t=$(k,"pairs",e);rt=G(t,n=>{if(!n.exists()){In();return}const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(l.currentUser.uid)){In(),showToast("Has sido eliminado de la party","error");return}Mo(a),a.forEach(s=>ko(s)),l.currentPartyId=e,l.partyMembers=a,On(),Xt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,ke(),$r()})}async function Eo(){if(!l.currentUser||!l.currentPartyId)return;const e=l.currentPartyId,t=$(k,"pairs",e);await ae(t,{members:Nr(l.currentUser.uid)});const n=await ee(t);if((n.exists()?n.data().members||[]:[]).length===0)try{await ye(t)}catch{}In()}function In(){rt&&(rt(),rt=null);for(const t in We){try{We[t]()}catch{}delete We[t]}l.currentPartyId=null,l.partyMembers=[],l.partyProfiles={},u("pairId").textContent="—",u("copyInviteBtn").disabled=!0,u("closePartyBtn").style.display="none";const e=u("partyMembersList");e&&(e.innerHTML='<p class="muted">Aún no estás en ninguna party.</p>'),Xt(),ke(),Rn()}async function Za(e){const t=Q(T(k,"pairs")),n=await F(t),r=l.currentUser.uid,a=[];n.forEach(s=>{const i=s.data()||{};s.id!==e&&Array.isArray(i.members)&&i.members.includes(r)&&a.push(ae($(k,"pairs",s.id),{members:Nr(r)}))}),await Promise.all(a)}async function Co(){if(l.currentPartyId)try{await navigator.clipboard.writeText(l.currentPartyId);const e=u("copyInviteBtn");e.textContent="¡Copiado!",setTimeout(()=>e.textContent="📋 Copiar ID",1200)}catch{alert("No se pudo copiar el ID.")}}function Lo(e){if(!e)return"";const t=String(e).trim();try{const a=new URL(t).searchParams.get("pair");if(a)return a.trim()}catch{}const n=t.match(/[?&]pair=([A-Za-z0-9_-]+)/);return n?n[1]:t.replace(/[^A-Za-z0-9_-]/g,"")}function ko(e){if(We[e])return;const t=$(k,"users",e),n=$(k,"users",e,"profile","profile");let r={},a={};const s=()=>{const o={...r,...a};"isOnline"in r&&(o.isOnline=r.isOnline),"lastOnline"in r&&(o.lastOnline=r.lastOnline),l.partyProfiles[e]=o,$r()},i=[];i.push(G(t,o=>{r=o.exists()?o.data()||{}:{},s()})),i.push(G(n,o=>{a=o.exists()?o.data()||{}:{},s()})),We[e]=()=>i.forEach(o=>o())}function Mo(e){for(const t in We)e.includes(t)||(We[t](),delete We[t])}async function Io(){if(!l.currentUser||!l.currentPartyId)return;const e=l.currentPartyId,t=l.partyMembers[0];if(l.currentUser.uid!==t){showToast("Solo el host puede cerrar la party","error");return}try{await ye($(k,"pairs",e)),showToast("Party cerrada","success")}catch{showToast("Error al cerrar la party","error")}u("closePartyBtn").style.display="none",In()}function On(){const e=u("closePartyBtn");if(!e)return;if(!l.currentPartyId||l.partyMembers.length===0){e.style.display="none";return}const t=l.currentUser.uid===l.partyMembers[0];e.style.display=t?"inline-flex":"none"}function Xt(){const e=u("partyCount");if(e){if(!l.currentPartyId){e.textContent="0/5";return}e.textContent=`${l.partyMembers.length}/5`}}async function Kn(e){if(l.currentUser)try{await ae($(k,"users",l.currentUser.uid),{isOnline:e,lastOnline:Date.now()})}catch(t){console.warn("No se pudo actualizar estado online:",t)}}function Qa(){return $(k,"users",l.currentUser.uid,"privacy","partyAccess")}async function Ao(){var e;if(l.currentUser)try{const t=await ee(Qa());l.partyPrivacy=t.exists()?((e=t.data())==null?void 0:e.blocked)||{}:{}}catch(t){console.warn("No se pudo cargar privacidad:",t),l.partyPrivacy={}}}async function No(e,t){if(!l.currentUser||!e)return;const n={...l.partyPrivacy||{},[e]:t};l.partyPrivacy=n,await fe(Qa(),{blocked:n,updatedAt:Date.now()},{merge:!0}),typeof showToast=="function"?showToast("Privacidad actualizada","success"):console.log("Privacidad actualizada")}function $o(e){var i,o,c,d;if(!e)return;(i=document.getElementById("partyPrivacyModal"))==null||i.remove();const t=l.partyProfiles[e]||{},n=t.name||t.fullName||"Usuario",r=((o=l.partyPrivacy)==null?void 0:o[e])||{},a=document.createElement("div");a.id="partyPrivacyModal",a.style.cssText=`
    position:fixed;
    inset:0;
    z-index:10080;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.65);
    padding:16px;
  `,a.innerHTML=`
    <div style="
      width:min(460px, 92vw);
      background:#121527;
      color:#fff;
      border-radius:20px;
      padding:18px;
      border:1px solid rgba(255,255,255,.12);
      box-shadow:0 20px 70px rgba(0,0,0,.55);
    ">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="
          width:42px;height:42px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(99,102,241,.18);
          border:1px solid rgba(99,102,241,.35);
          font-size:20px;
        ">🔒</div>

        <div>
          <div style="font-size:17px;font-weight:900;">Privacidad con ${n}</div>
          <div style="font-size:13px;opacity:.75;margin-top:2px;">
            Marca qué quieres ocultarle a esta persona.
          </div>
        </div>
      </div>

      <div style="
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:14px;
        padding:12px;
        border-radius:14px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.08);
      ">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privNotas" ${r.notas?"checked":""}>
          <span>Ocultar mis notas</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privHorario" ${r.horario?"checked":""}>
          <span>Ocultar mi horario</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privCalendario" ${r.calendario?"checked":""}>
          <span>Ocultar mi calendario</span>
        </label>

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <input type="checkbox" id="privMalla" ${r.malla?"checked":""}>
          <span>Ocultar mi malla</span>
        </label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
        <button id="privacyCancel" class="ghost">Cancelar</button>
        <button id="privacySave" class="primary">Guardar</button>
      </div>
    </div>
  `,document.body.appendChild(a);const s=()=>a.remove();(c=a.querySelector("#privacyCancel"))==null||c.addEventListener("click",s),a.addEventListener("click",p=>{p.target===a&&s()}),(d=a.querySelector("#privacySave"))==null||d.addEventListener("click",async()=>{var m,g,b,y;const p=a.querySelector("#privacySave");p.disabled=!0,p.textContent="Guardando...";const f={notas:!!((m=a.querySelector("#privNotas"))!=null&&m.checked),horario:!!((g=a.querySelector("#privHorario"))!=null&&g.checked),calendario:!!((b=a.querySelector("#privCalendario"))!=null&&b.checked),malla:!!((y=a.querySelector("#privMalla"))!=null&&y.checked)};try{await No(e,f),s()}catch(h){console.error("Error guardando privacidad:",h),alert("No se pudo guardar la privacidad. Revisa la consola."),p.disabled=!1,p.textContent="Guardar"}})}const Zn=new Map;async function Hn(e,t){var a,s;const n=(a=l.currentUser)==null?void 0:a.uid;if(!e||!n)return!1;if(e===n)return!0;const r=`${e}:${n}:${t}`;if(Zn.has(r))return Zn.get(r);try{const i=await ee($(k,"users",e,"privacy","partyAccess")),c=(i.exists()?i.data()||{}:{}).blocked||{},p=!!!((s=c==null?void 0:c[n])!=null&&s[t]);return Zn.set(r,p),p}catch(i){return console.warn("[privacy] No se pudo revisar permiso:",i),!0}}function Tr(e="esta sección"){return`
    <div class="card" style="
      padding:22px;
      text-align:center;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(15,23,42,.72);
    ">
      <div style="font-size:34px;margin-bottom:8px;">🔒</div>
      <h3 style="margin:0 0 8px;">Contenido privado</h3>
      <div class="muted">
        Este usuario decidió ocultar ${e} para ti.
      </div>
    </div>
  `}function sn(e,t,n,r){if(!e)return;const a=`bound_${r||t}`;e.dataset[a]!=="1"&&(e.addEventListener(t,n),e.dataset[a]="1")}function Xa(e){return(e||"").replace(/[^\w\s.-]+/g,"").replace(/\s+/g,"_")||"export"}function pa(){var e;return((e=l.activeSemesterData)==null?void 0:e.label)||"semestre"}async function es(e,t=2){const n=e.style.backgroundColor;n||(e.style.backgroundColor=getComputedStyle(document.body).backgroundColor||"#111");const r=await uo(e,{scale:t,backgroundColor:null,useCORS:!0,allowTaint:!0,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight});return n||(e.style.backgroundColor=""),r}async function ma(e,t){try{const n=await es(e,2),r=document.createElement("a");r.href=n.toDataURL("image/png"),r.download=`${Xa(t)}.png`,r.click()}catch(n){console.error("[exportNodeAsPNG]",n)}}async function fa(e,t){try{const n=await es(e,2),r=n.toDataURL("image/png"),a=n.width,s=n.height,i=a>=s?"l":"p",o=new Ja({unit:"pt",format:"a4",orientation:i}),c=o.internal.pageSize.getWidth(),d=o.internal.pageSize.getHeight(),p=Math.min(c/a,d/s),f=a*p,m=s*p;o.addImage(r,"PNG",(c-f)/2,(d-m)/2,f,m),o.save(`${Xa(t)}.pdf`)}catch(n){console.error("[exportNodeAsPDF]",n)}}function Po(){const e=u("btn-export-malla-png"),t=u("btn-export-malla-pdf");if(e||t){const a=document.querySelector("#page-malla .malla-wrapper")||u("page-malla"),s=`malla_${pa()}`;sn(e,"click",()=>ma(a,s),"malla_png"),sn(t,"click",()=>fa(a,s),"malla_pdf")}const n=u("btn-export-horario-png"),r=u("btn-export-horario-pdf");if(n||r){const a=document.querySelector("#horarioCombinado:not(.hidden)")||document.querySelector("#schedUSM")||u("horarioPropio")||u("page-horario"),s=`horario_${pa()}`;sn(n,"click",()=>ma(a,s),"horario_png"),sn(r,"click",()=>fa(a,s),"horario_pdf")}}function To(e=""){const t=String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();return t?t.includes("mayor")||t==="umayor"?"UMAYOR":t.includes("usm")||t.includes("utfsm")||t.includes("santa maria")?"USM":t.toUpperCase():""}function ts(e=""){return e==="UMAYOR"?"Universidad Mayor":e==="USM"?"UTFSM":e||"Universidad"}function ir(e=""){return String(e??"").replace(/[<>&"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[t])}function Uo(e){return String(e||"").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").trim()}function ya(...e){const t=e.flat().map(Number).filter(n=>Number.isFinite(n));return t.length?t.reduce((n,r)=>n+r,0)/t.length:NaN}function Do(e,t,n){return Math.max(t,Math.min(n,e))}function ga(e,t){return Number.isFinite(e)?t==="MAYOR"?Math.trunc(e*100)/100:Math.trunc(e*10)/10:null}function va(e,t={},n={}){const r=Uo(e),a=r.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0");if(!/^[\w\s\.\+\-\*\/\(\),%<>!=]+$/.test(a))throw new Error("La fórmula contiene caracteres no permitidos.");const s=r.replace(/(\d+(?:\.\d+)?)\s*%/g,(b,y)=>`(${y}/100)`),i=a.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],o=new Set(["avg","min","max","final","finalCode","finalId"]),c=new Set(["NaN","Infinity","Math","true","false"]),d=Object.keys(t),p=d.map(b=>t[b]??0),f=new Set([...d,...Object.keys(n)]);for(const b of i)o.has(b)||c.has(b)||f.has(b)||(d.push(b),p.push(0),f.add(b));const m=Object.keys(n),g=Object.values(n);return Function(...m,...d,`"use strict"; return (${s});`)(...g,...p)}function on(e=""){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}async function Bo(){var a;const e=(a=l.currentUser)==null?void 0:a.uid;if(!e)return[];const t=T(k,"users",e,"semesters"),r=(await F(t)).docs.map(s=>{const i=s.data()||{},o=i.universityAtThatTime||i.university||"";return{id:s.id,label:String(i.label||s.id).trim(),uni:To(o),uniRaw:o}});return r.sort(Ur),r}async function _o(e,t,n){try{const r=T(k,"users",e,"semesters",t,"courses",n,"attendance"),i=(await F(r)).docs.map(c=>c.data()||{}).filter(c=>!c.noClass),o=i.filter(c=>c.present||c.justified).length;return i.length?Math.round(o/i.length*100):0}catch{return 0}}async function Ro(e,t){const n=T(k,"users",e,"semesters",t,"courses");return(await F(Q(n,ve("createdAt")))).docs.map(a=>({id:a.id,...a.data()||{}}))}async function Oo(e,t){const n=await Ro(e,t.id),r=await Promise.all(n.map(async o=>{const c=$(k,"users",e,"semesters",t.id,"courses",o.id,"grading","meta"),d=T(k,"users",e,"semesters",t.id,"courses",o.id,"grading","meta","components"),[p,f,m]=await Promise.all([ee(c),F(d),_o(e,t.id,o.id)]),g=p.exists()?p.data()||{}:{scale:"USM",finalExpr:"",rulesText:""},b=f.docs.map(C=>({id:C.id,...C.data()||{}})),y={},h=g.scale==="MAYOR"?1:0,w=g.scale==="MAYOR"?7:100;for(const C of b)typeof C.score=="number"&&isFinite(C.score)&&C.key&&(y[C.key]=Do(C.score,h,w));return y.Asistencia=m,{course:o,meta:g,comps:b,values:y,final:null}}));for(const o of r){const c=String(o.meta.finalExpr||"").trim();if(!c){o.final=null;continue}try{const d=va(c,o.values,{avg:ya,min:Math.min,max:Math.max,final:()=>NaN,finalCode:()=>NaN,finalId:()=>NaN});o.final=Number.isFinite(d)?ga(d,o.meta.scale||"USM"):null}catch{o.final=null}}const a={},s={},i={};for(const o of r){const c=on(o.course.name),d=on(o.course.code);c&&(a[c]=o.final),d&&(s[d]=o.final),i[o.course.id]=o.final}for(const o of r){const c=String(o.meta.finalExpr||"").trim();if(!c){o.final=null;continue}try{const d=va(c,o.values,{avg:ya,min:Math.min,max:Math.max,final:p=>a[on(p)]??NaN,finalCode:p=>s[on(p)]??NaN,finalId:p=>i[p]??NaN});o.final=Number.isFinite(d)?ga(d,o.meta.scale||"USM"):null}catch{o.final=null}}return{semester:t,courses:r.map(o=>({id:o.course.id,name:o.course.name||"Ramo",code:o.course.code||"—",professor:o.course.professor||"—",section:o.course.section||"—",final:o.final,finalText:o.final==null?"Pendiente":String(o.final)}))}}function Ho(){var n,r;if(document.getElementById("grxPdfModal"))return;const e=document.createElement("div");e.id="grxPdfModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");(n=document.getElementById("grxPdfBackdrop"))==null||n.addEventListener("click",t),(r=document.getElementById("grxPdfCancel"))==null||r.addEventListener("click",t)}function Fo(e){const t=document.getElementById("grxSemList");if(!t)return;if(!e.length){t.innerHTML='<div class="muted">No hay semestres para esa universidad.</div>';return}const n=[...e].sort(Ur);t.innerHTML=n.map(r=>`
    <label class="pdf-sem-item">
      <input type="checkbox" class="grx-sem-check" value="${ir(r.id)}" />
      <span>${ir(r.label)}</span>
    </label>
  `).join("")}function zo(e,t){const n=t.map(r=>r.label).join("_").replace(/[^\w\-]+/g,"_");return`notas_${e}_${n||"semestres"}.pdf`}function ba(e,t,n,r){return t+n<=r-44?t:(e.addPage(),44)}function qo(e,t,n){const r=e.internal.pageSize.getWidth(),a=e.internal.pageSize.getHeight(),s=r-88;let i=n;if(i=ba(e,i,42,a),e.setFont("helvetica","bold"),e.setFontSize(15),e.text(`Semestre ${t.semester.label}`,44,i),i+=12,e.setDrawColor(190,190,210),e.line(44,i,r-44,i),i+=18,!t.courses.length)return e.setFont("helvetica","normal"),e.setFontSize(11),e.text("Sin ramos registrados.",44,i),i+22;for(const o of t.courses){const d=[`Ramo: ${o.name}`,`Código: ${o.code}`,`Paralelo: ${o.section}`,`Profesor: ${o.professor}`,`Promedio final: ${o.finalText}`].flatMap(m=>e.splitTextToSize(m,s)),p=Math.max(52,d.length*14+18);i=ba(e,i,p,a),e.setFillColor(245,247,255),e.roundedRect(44,i-12,s,p,8,8,"F"),e.setTextColor(20,20,35),e.setFont("helvetica","normal"),e.setFontSize(11);let f=i+4;d.forEach(m=>{e.text(m,56,f),f+=14}),i+=p+10}return i+6}async function jo(e,t){const n=new Ja({unit:"pt",format:"a4"});n.internal.pageSize.getWidth(),n.setFont("helvetica","bold"),n.setFontSize(19),n.text("Reporte de notas",44,52),n.setFont("helvetica","normal"),n.setFontSize(11),n.text(`Universidad: ${ts(e)}`,44,74),n.text(`Generado: ${new Date().toLocaleString()}`,44,90);let r=122;for(const s of t)r=qo(n,s,r);const a=zo(e,t.map(s=>s.semester));n.save(a)}function ha(e=""){const t=String(e||"").trim(),n=t.match(/^(\d{4})\s*-\s*(\d+)$/);return n?{year:Number(n[1])||0,term:Number(n[2])||0,raw:t}:{year:0,term:0,raw:t}}function Yo(e,t){const n=ha(e),r=ha(t);return n.year!==r.year?n.year-r.year:n.term!==r.term?n.term-r.term:String(n.raw).localeCompare(String(r.raw),"es")}function Ur(e,t){return Yo((e==null?void 0:e.label)||"",(t==null?void 0:t.label)||"")}async function Go(){if(!l.currentUser){alert("Primero inicia sesión.");return}Ho();const e=document.getElementById("grxPdfModal"),t=document.getElementById("grxUniSel"),n=document.getElementById("grxToggleAll"),r=document.getElementById("grxPdfExport"),a=await Bo(),s=[...new Set(a.map(o=>o.uni).filter(Boolean))];if(!s.length){alert("No tienes semestres disponibles para exportar.");return}t.innerHTML=s.map(o=>`
    <option value="${ir(o)}">${ts(o)}</option>
  `).join("");const i=()=>{const o=t.value,c=a.filter(d=>d.uni===o);Fo(c)};i(),t.onchange=i,n.onclick=()=>{const o=Array.from(document.querySelectorAll(".grx-sem-check")),c=o.length&&o.every(d=>d.checked);o.forEach(d=>{d.checked=!c})},r.onclick=async()=>{const o=t.value,c=Array.from(document.querySelectorAll(".grx-sem-check:checked")).map(p=>p.value);if(!c.length){alert("Selecciona al menos un semestre.");return}const d=a.filter(p=>c.includes(p.id)).sort(Ur);r.disabled=!0,r.textContent="Exportando...";try{const p=[];for(const f of d)p.push(await Oo(l.currentUser.uid,f));await jo(o,p),e.classList.remove("active")}catch(p){console.error(p),alert("No se pudo generar el PDF de notas.")}finally{r.disabled=!1,r.textContent="Exportar PDF"}},e.classList.add("active")}let Le=!1,An="",ns="",Oe=!1,ln=null,Ne=null;const Nn=new Map,Z=new Map;let re=[],W=[];const K=new Map;let et=!1,pe=null,lr=!1,rs="#22c55e",Vo="#ff69b4",xa=!1,cn=null,dn=null,un=null,Et=[],je=[],Ct=null,Ye="USM",le={};const Ge=new Map,cr=new Map;let Qn=null;function Dr(){const e={};for(const[n,r]of(Z||new Map).entries())e[n]=r||[];const t={};for(const[n,r]of(K||new Map).entries())t[n]=r;return JSON.stringify({slots:pe||null,items:W||[],courses:re||[],defs:e,selected:t})}function as(){if(!Ne)return!1;try{return Dr()!==Ne}catch{return!0}}function Ht(){Qn||(Qn=requestAnimationFrame(()=>{Qn=null,["schedPartyBusyCombined","schedPartyBusy"].filter(n=>document.getElementById(n)).forEach(n=>yr(n)),["busyLegendCombined","busyLegend"].filter(n=>document.getElementById(n)).forEach(n=>Sn(n))}))}let at=!1,It=null;const xt=80,wa=28;let Ae=[],dr=[];const Pe=["Lun","Mar","Mié","Jue","Vie"];function Wo(){const e=document.getElementById("parEditModal");if((e==null?void 0:e.style.display)==="flex")return document.getElementById("parEditPanel");const t=document.getElementById("simModal");if((t==null?void 0:t.style.display)==="flex")return document.getElementById("simModalPanel");const n=document.getElementById("gr-simDrawer");return n||null}function Jo(e){if(!at)return;const t=e.clientY,n=window.innerHeight;let r=0;if(t<xt){const a=(xt-t)/xt;r=-Math.ceil(wa*a)}else if(t>n-xt){const a=(t-(n-xt))/xt;r=Math.ceil(wa*a)}r===0||It!==null||(It=requestAnimationFrame(()=>{const a=Wo();a?a.scrollBy({top:r,left:0,behavior:"auto"}):window.scrollBy(0,r),It=null}))}function pt(){at=!1,It&&(cancelAnimationFrame(It),It=null)}let be={};const yt=[{label:"1/2",start:"08:15",end:"09:25",lines:[{n:"1",start:"08:15",end:"08:50"},{n:"2",start:"08:50",end:"09:25"}]},{label:"3/4",start:"09:40",end:"10:50",lines:[{n:"3",start:"09:40",end:"10:15"},{n:"4",start:"10:15",end:"10:50"}]},{label:"5/6",start:"11:05",end:"12:15",lines:[{n:"5",start:"11:05",end:"11:40"},{n:"6",start:"11:40",end:"12:15"}]},{label:"7/8",start:"12:30",end:"13:40",lines:[{n:"7",start:"12:30",end:"13:05"},{n:"8",start:"13:05",end:"13:40"}]},{label:"ALMUERZO",start:"13:40",end:"14:40",lunch:!0},{label:"9/10",start:"14:40",end:"15:50",lines:[{n:"9",start:"14:40",end:"15:15"},{n:"10",start:"15:15",end:"15:50"}]},{label:"11/12",start:"16:05",end:"17:15",lines:[{n:"11",start:"16:05",end:"16:40"},{n:"12",start:"16:40",end:"17:15"}]},{label:"13/14",start:"17:30",end:"18:40",lines:[{n:"13",start:"17:30",end:"18:05"},{n:"14",start:"18:05",end:"18:40"}]},{label:"15/16",start:"18:50",end:"20:00",lines:[{n:"15",start:"18:50",end:"19:25"},{n:"16",start:"19:25",end:"20:00"}]},{label:"17/18",start:"20:15",end:"21:25",lines:[{n:"17",start:"20:15",end:"20:50"},{n:"18",start:"20:50",end:"21:25"}]},{label:"19/20",start:"21:40",end:"22:50",lines:[{n:"19",start:"21:40",end:"22:15"},{n:"20",start:"22:15",end:"22:50"}]}],en=[De("1/2","08:30","09:40",["08:30-09:05","09:05-09:40"]),De("3/4","10:00","11:10",["10:00-10:35","10:35-11:10"]),De("5/6","11:30","12:40",["11:30-12:05","12:05-12:40"]),{label:"ALMUERZO",start:"12:40",end:"14:00",lunch:!0},De("7/8","14:00","15:10",["14:00-14:35","14:35-15:10"]),De("9/10","15:30","16:40",["15:30-16:05","16:05-16:40"]),De("11/12","17:00","18:10",["17:00-17:35","17:35-18:10"]),De("13/14","18:30","19:40",["18:30-19:05","19:05-19:40"]),De("15/16","20:00","21:10",["20:00-20:35","20:35-21:10"]),De("17/18","21:30","22:40",["21:30-22:05","22:05-22:40"])];function De(e,t,n,r){return{label:e,start:t,end:n,lines:r.map(a=>{const[s,i]=a.split("-");return{start:s,end:i}})}}function ss(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g," ")}function Ko(e){return ss(e).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function os(e){const t=ss(e);return t?t==="umayor"||t.includes("mayor")?"UMAYOR":t==="usm"||t.includes("utfsm")||t.includes("u t f s m")||t.includes("u.t.f.s.m")||t.includes("federico santa maria")||t.includes("santa maria")?"USM":`UNI_${Ko(t)||"desconocida"}`:""}function gt(){var t,n;const e=((t=l.activeSemesterData)==null?void 0:t.universityAtThatTime)||((n=l.profileData)==null?void 0:n.university)||"";return os(e)}async function Ut(){var r,a;const e=gt();if(be[e]&&Array.isArray(be[e])&&be[e].length)return be[e];if(l.currentUser){const s=$(k,"users",l.currentUser.uid,"custom_schedules",e),i=await ee(s);if(i.exists()){const o=((r=i.data())==null?void 0:r.slots)||[];if(Array.isArray(o)&&o.length)return be[e]=o,o}}const t=`custom_slots_${e}_${(a=l.currentUser)==null?void 0:a.uid}`,n=localStorage.getItem(t);if(n)try{const s=JSON.parse(n);if(Array.isArray(s)&&s.length)return be[e]=s,s}catch{}return e==="UMAYOR"?en:e==="USM"?yt:null}function vt(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Br(e,t,n){const r=(e||[]).find(a=>a.id===t);return vt(r==null?void 0:r.color)?r.color:n||"#3B82F6"}function Fn(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}let pn=null,ie=[];function Ke(){const e=document.getElementById("simPaletteHost");if(!e)return;Ri(),e.innerHTML="";const t=Le?Array.isArray(re)?re:[]:Array.isArray(l.courses)?l.courses:[];if(!t.length){const a=document.createElement("button");a.type="button",a.className="palette-rect",a.textContent="+ Agregar ramo",a.style.cursor="pointer",a.style.borderStyle="dashed",a.addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await ur(l.activeSemesterId,{forceFirestore:!1})}),e.appendChild(a);return}Bi(t).forEach(a=>{var g;const s=document.createElement("div");s.className="sim-course-group",s.dataset.courseId=a.id;const i=vt(a.color)?a.color:"#3B82F6",o=Z.get(a.id)||[],c=K.get(a.id)||((g=o[0])==null?void 0:g.pid)||null;c&&o.find(b=>b.pid===c);const d=a.name,p=document.createElement("div");p.className="palette-rect",p.setAttribute("draggable","true"),p.dataset.payload=JSON.stringify({type:"course-parallel",courseId:a.id,pid:c}),p.style.borderColor=i,p.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)";const f=document.createElement("div");f.className="label",f.textContent=d,p.appendChild(f);const m=document.createElement("button");m.type="button",m.className="add-par",m.textContent="▾",m.setAttribute("aria-label","Paralelos"),m.addEventListener("click",b=>{b.stopPropagation(),ri(a,m)}),p.appendChild(m),s.appendChild(p),e.appendChild(s)});const r=document.createElement("button");r.type="button",r.className="palette-rect",r.textContent="+ Agregar ramo",r.style.cursor="pointer",r.style.borderStyle="dashed",r.style.opacity="0.95",r.addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await ur(l.activeSemesterId,{forceFirestore:!1})}),e.appendChild(r),_i()}let st=null;function Zo(){if(document.getElementById("simParMenuStyles"))return;const e=document.createElement("style");e.id="simParMenuStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function Qo(){if(document.getElementById("parEditDnDStyles"))return;const e=document.createElement("style");e.id="parEditDnDStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function Xo(){st&&(st.remove(),st=null)}function ei(){if(document.getElementById("parEditModal"))return;const e=document.createElement("div");e.id="parEditModal",e.style.cssText=`position:fixed; inset:0; display:none; align-items:center; justify-content:center;
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
    `,document.body.appendChild(e);const t=()=>{e.style.display="none",document.documentElement.classList.remove("sim-lock"),document.body.classList.remove("sim-lock"),pt()};document.getElementById("parEditX").addEventListener("click",t),document.getElementById("parEditCancel").addEventListener("click",t),e.addEventListener("click",n=>{n.target===e&&t()})}async function Xn(e,t){ei();const n=document.getElementById("parEditModal"),r=document.getElementById("parEditPanel"),a=document.getElementById("parEditTitle"),s=document.getElementById("parEditProf"),i=document.getElementById("parEditSec"),o=document.getElementById("parEditChip"),c=document.getElementById("parEditGrid"),d=document.getElementById("parEditSave"),p=document.getElementById("parEditCancel"),f=document.getElementById("parEditX"),m=e.id,g=Z.get(m)||[],b=L=>JSON.parse(JSON.stringify(L||{})),h=t?(L=>g.find(M=>M.pid===L)||null)(t):null;let w,C=!1;if(h)w=b(h);else{C=!0;const L=g.length+1;w={courseId:m,pid:`P${L}`,professor:"",section:"",blocks:[]}}s.value=w.professor||"",i.value=w.section||w.pid||"";const A=()=>{const L=(i.value||"").trim()||w.pid;a.textContent=`${e.name} · ${L}`;const M=o.querySelector(".drag-txt");M?M.textContent=`${e.name} · ${L}`:o.textContent=`${e.name} · ${L}`};o.dataset.payload=JSON.stringify({type:"parallel-template",courseId:m,pid:w.pid});const N=vt(e.color)?e.color:"#3B82F6";o.style.borderColor=N,o.style.background=gr(N,.18),o.style.color=Fn(N),o.style.borderRadius="999px",o.style.padding="10px 14px",o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="10px",o.style.fontWeight="900",o.style.borderWidth="2px",o.style.boxShadow="0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)",o.style.userSelect="none",o.querySelector(".drag-ico")||(o.innerHTML=`<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`),i.oninput=A,A(),await xn(c,w),Qo(),document.documentElement.classList.add("sim-lock"),document.body.classList.add("sim-lock"),n.style.display="flex",requestAnimationFrame(()=>{r&&(r.scrollTop=0),s==null||s.focus()});const v=()=>{d.onclick=null,p.onclick=null,f.onclick=null,n.onclick=null,document.removeEventListener("keydown",S),pt()},I=()=>{v(),n.style.display="none",document.documentElement.classList.remove("sim-lock"),document.body.classList.remove("sim-lock")},E=()=>I(),x=L=>{L.target===n&&E()},S=L=>{n.style.display==="flex"&&L.key==="Escape"&&(L.preventDefault(),E())};f.onclick=E,p.onclick=E,n.onclick=x,document.addEventListener("keydown",S),d.onclick=async()=>{if(w.professor=(s.value||"").trim(),w.section=(i.value||"").trim(),C){const L=[...g,b(w)];Z.set(m,L)}else h.professor=w.professor,h.section=w.section,h.blocks=b(w.blocks),Z.set(m,g);zr(),$e(),Ke(),I(),Le&&K.get(m)===w.pid&&await vr(m,w.pid)}}async function xn(e,t){const n=gt(),r=pe||await Ut();if(!r){e.innerHTML='<div class="muted">No hay slots definidos.</div>';return}const a=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${a}</div>
        ${Pe.map(s=>`<div class="cell header">${s}</div>`).join("")}

        ${r.map((s,i)=>`
          <div class="cell mod ${s.lunch?"lunch":""}" data-slot="${i}">
            ${jn(s,i,n)}
          </div>
          ${Pe.map((o,c)=>`
            <div class="cell slot ${s.lunch?"is-lunch":""}"
                data-day="${c}" data-slot="${i}"
                ${s.lunch?'aria-disabled="true"':""}
                style="${s.lunch?"pointer-events:none; opacity:.65;":""}">
              ${ti(t,c,i)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `,e.querySelectorAll(".par-placed").forEach(s=>{s.addEventListener("dragstart",o=>{const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10),p=s.dataset.pos||"full";o.dataTransfer.setData("text/plain",JSON.stringify({type:"move-par-block",courseId:t.courseId,pid:t.pid,from:{day:c,slot:d,pos:p}})),o.dataTransfer.effectAllowed="move",at=!0}),s.addEventListener("dragend",pt);const i=s.querySelector(".par-x");i&&i.addEventListener("click",o=>{o.stopPropagation();const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10),p=s.dataset.pos||"full",f=t.blocks.findIndex(m=>m.day===c&&m.slot===d&&(m.pos||"full")===p);f>=0&&t.blocks.splice(f,1),xn(e,t)})}),e.querySelectorAll(".cell.slot").forEach(s=>{s.classList.contains("is-lunch")||(s.addEventListener("dragover",i=>{i.preventDefault();const o=s.getBoundingClientRect(),c=i.clientY-o.top,d=o.height/2;let p="full";c<d-10?p="top":c>d+10&&(p="bottom"),s.dataset.droppos=p,s.classList.add("over"),s.classList.remove("hint-top","hint-full","hint-bottom"),s.classList.add(p==="top"?"hint-top":p==="bottom"?"hint-bottom":"hint-full")}),s.addEventListener("dragleave",()=>{s.classList.remove("over","hint-top","hint-full","hint-bottom"),delete s.dataset.droppos}),s.addEventListener("drop",i=>{i.preventDefault(),pt();const o=s.dataset.droppos||"full";s.classList.remove("over","hint-top","hint-full","hint-bottom"),delete s.dataset.droppos;const c=i.dataTransfer.getData("text/plain");let d=null;try{d=JSON.parse(c)}catch{}const p=parseInt(s.dataset.day,10),f=parseInt(s.dataset.slot,10),m=r==null?void 0:r[f];if(!m||m.lunch||!d)return;if(d.type==="move-par-block"){const b=d.from||{},y=t.blocks.findIndex(C=>C.day===Number(b.day)&&C.slot===Number(b.slot)&&(C.pos||"full")===(b.pos||"full"));if(y<0)return;if(t.blocks.some((C,A)=>A!==y&&C.day===p&&C.slot===f&&(C.pos||"full")===o)){alert("Ese espacio ya está ocupado por otro bloque del paralelo.");return}const w=t.blocks[y];w.day=p,w.slot=f,w.pos=o,w.start=m.start,w.end=m.end,w.hpos=w.hpos||"single",xn(e,t);return}d.type!=="parallel-template"||t.blocks.findIndex(b=>b.day===p&&b.slot===f&&(b.pos||"full")===o)>=0||(t.blocks.push({day:p,slot:f,pos:o,hpos:"single",start:m.start,end:m.end}),xn(e,t))}))})}function ti(e,t,n){const r=(e.blocks||[]).filter(s=>s.day===t&&s.slot===n);if(!r.length)return"";const a=s=>s==="top"?"pos-top":s==="bottom"?"pos-bottom":"pos-full";return r.map(s=>`
      <div class="par-placed ${a(s.pos||"full")}"
          draggable="true"
          data-course="${e.courseId}"
          data-pid="${e.pid}"
          data-day="${t}"
          data-slot="${n}"
          data-pos="${s.pos||"full"}">
        ✓
        <button class="par-x" type="button" title="Quitar">×</button>
      </div>
    `).join("")}async function ni(e,t){var c;if(!l.currentUser||!l.activeSemesterId)return;const r=(Z.get(e)||[]).find(d=>d.pid===t);if(!r)return;const a=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),i=(await F(a)).docs.filter(d=>{var p;return((p=d.data())==null?void 0:p.courseId)===e});for(const d of i)await ye(d.ref);const o=await Ut();for(const d of r.blocks){const p=o==null?void 0:o[d.slot];!p||p.lunch||await Ce(a,{courseId:e,day:d.day,slot:d.slot,start:p.start,end:p.end,pos:d.pos||"full",hpos:d.hpos||"single",parallelPid:t,displayName:`${((c=l.courses.find(f=>f.id===e))==null?void 0:c.name)||"Ramo"} · ${r.section||t}`,createdAt:Date.now()})}K.set(e,t)}async function Sa(e){if(!l.currentUser||!l.activeSemesterId)return;const t=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),r=(await F(t)).docs.filter(a=>{var s;return((s=a.data())==null?void 0:s.courseId)===e});for(const a of r)await ye(a.ref)}function ri(e,t){var v,I;Zo(),Xo();const n=document.createElement("div");n.className="sim-par-menu";const r=e.id,a=Z.get(r)||[],s=(ie||[]).some(E=>E.courseId===r),i=K.has(r),o=s||i;n.innerHTML=`
    <div class="head">
      <div class="title">Paralelos de ${ge(e.name||"Ramo")}</div>
      <div style="display:flex; gap:8px;">
        <button id="simClearFromScheduleBtn"
          class="broombtn danger"
          type="button"
          title="Sacar del horario (mantener en pool)"
          aria-label="Sacar del horario"
          ${o?"":"disabled"}
          style="${o?"":"opacity:.35; cursor:not-allowed;"}"
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
  `,document.body.appendChild(n),st=n;const c=()=>{document.removeEventListener("pointerdown",p,{capture:!0}),document.removeEventListener("keydown",f),window.removeEventListener("scroll",m,!0),window.removeEventListener("resize",g)},d=()=>{st&&(st.remove(),st=null),c()},p=E=>{!n.contains(E.target)&&!t.contains(E.target)&&d()},f=E=>{E.key==="Escape"&&d()},m=()=>d(),g=()=>d(),b=n.querySelector(".list");if(a.length)a.forEach(E=>{var B;const x=document.createElement("div");x.className="item",x.style.cursor="default";const S=K.get(r)===E.pid;x.innerHTML=`
    <div class="row">
      <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
        <div class="pickbox ${S?"on":""}" title="Seleccionar paralelo" aria-label="Seleccionar paralelo"></div>

        <div style="min-width:0;">
          <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${ge(E.section||E.pid)}
          </div>
          <div style="opacity:.75; font-weight:800; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${ge(E.professor||"—")}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="iconbtn" type="button" title="Editar">✏️</button>
        <button class="iconbtn danger" type="button" title="Borrar">✕</button>
      </div>
    </div>
  `;const L=x.querySelector(".iconbtn:not(.danger)"),M=x.querySelector(".iconbtn.danger");x.querySelector(".pickbox").addEventListener("click",async P=>{P.preventDefault(),P.stopPropagation(),P.stopImmediatePropagation(),K.set(r,E.pid),qn(),$e(),Le?await vr(r,E.pid):(await ni(r,E.pid),me()),d()}),(B=x.querySelector(".row > div"))==null||B.addEventListener("click",async P=>{if(!P.target.closest(".pickbox")&&!P.target.closest(".actions")&&!P.target.closest("button")){if(d(),Le){await vr(e.id,E.pid);return}Xn(e,E.pid)}}),L.addEventListener("click",async P=>{P.stopPropagation(),d(),Xn(e,E.pid)}),M.addEventListener("click",async P=>{if(P.stopPropagation(),!await dt({title:"Borrar paralelo",text:`¿Quieres borrar el paralelo ${E.section||E.pid}?`,yesText:"Borrar",noText:"Cancelar"}))return;const H=(Z.get(e.id)||[]).filter(R=>R.pid!==E.pid);Z.set(e.id,H),W=W.filter(R=>!(R.courseId===e.id&&R.pid===E.pid)),$e(),K.get(e.id)===E.pid&&K.delete(e.id),Ke(),Le&&await _e(),d()}),b.appendChild(x)});else{const E=document.createElement("div");E.className="hint",E.textContent="Aún no hay paralelos.",b.appendChild(E)}n.querySelector(".item.add").addEventListener("click",async()=>{d(),await Xn(e,null)}),(v=n.querySelector("#simClearFromScheduleBtn"))==null||v.addEventListener("click",async()=>{o&&(d(),await Sa(e.id),W=W.filter(E=>E.courseId!==e.id),$e(),K.delete(e.id),me(),Le&&await _e())}),(I=n.querySelector("#simRemoveCourseBtn"))==null||I.addEventListener("click",async()=>{if(await dt({title:"Eliminar ramo",text:`¿Eliminar "${e.name}" del simulador? Esto lo quitará de tu lista de ramos.`,yesText:"Eliminar",noText:"Cancelar"})){if(d(),Le){const x=e.id;re=(re||[]).filter(S=>S.id!==x),W=(W||[]).filter(S=>S.courseId!==x),Z.delete(x),K.delete(x),Yn(re),Ke(),await _e();return}if(!(!l.currentUser||!l.activeSemesterId))try{await Sa(e.id),await ye($(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e.id)),W=W.filter(x=>x.courseId!==e.id),$e(),Z.delete(e.id),K.delete(e.id),l.courses=(l.courses||[]).filter(x=>x.id!==e.id),document.dispatchEvent(new Event("courses:changed")),Le&&await _e()}catch(x){console.error(x),alert("No se pudo eliminar el ramo.")}}});const y=t.getBoundingClientRect(),h=8;n.style.left="-9999px",n.style.top="-9999px";const w=n.offsetWidth,C=n.offsetHeight;let A=y.left,N=y.bottom+h;A=Math.min(A,window.innerWidth-w-h),A=Math.max(A,h),N+C>window.innerHeight-h&&(N=y.top-C-h),N=Math.max(N,h),n.style.left=`${A}px`,n.style.top=`${N}px`,setTimeout(()=>{document.addEventListener("pointerdown",p,{capture:!0})},0),document.addEventListener("keydown",f),window.addEventListener("scroll",m,!0),window.addEventListener("resize",g)}function ai(e){const t=e||"full";return t==="top"?{a:0,b:.3334}:t==="bottom"?{a:.6666,b:1}:{a:0,b:1}}function si(e,t){return e.a<t.b&&t.a<e.b}function oi(e){const t=e.map(a=>({...a,_vr:ai(a.pos)})),n={top:0,full:1,bottom:2};t.sort((a,s)=>{const i=n[a.pos||"full"]??1,o=n[s.pos||"full"]??1;return i!==o?i-o:String(a.id||"").localeCompare(String(s.id||""))});const r=[];for(const a of t){let s=!1;for(let i=0;i<r.length;i++){const o=r[i];if(!o.some(d=>si(a._vr,d._vr))){a._lane=i,o.push(a),s=!0;break}}s||(a._lane=r.length,r.push([a]))}return{blocks:t,laneCount:Math.max(1,r.length)}}function is(){if(xa)return;xa=!0,ii(),ki(),fi(),Ii(),wn(),fr(),document.addEventListener("party:ready",()=>{var m;(m=u("subtabCombinado"))!=null&&m.classList.contains("active")&&c()}),document.addEventListener("party:changed",()=>{var m;(m=u("subtabCombinado"))!=null&&m.classList.contains("active")&&c()}),document.addEventListener("semester:changed",()=>{var m;(m=u("subtabCombinado"))!=null&&m.classList.contains("active")&&c()}),document.addEventListener("profile:changed",async()=>{var g,b,y,h,w;const m=(g=l.currentUser)==null?void 0:g.uid;m&&(le[m]=le[m]||{},(b=l.profileData)!=null&&b.name&&(le[m].name=l.profileData.name),(y=l.profileData)!=null&&y.favoriteColor&&(le[m].color=l.profileData.favoriteColor),(h=u("subtabCompartido"))!=null&&h.classList.contains("active")&&(await Yr(m,{force:!0}),await wn()),(w=u("subtabCombinado"))!=null&&w.classList.contains("active")&&(Sn("busyLegendCombined"),Ht()))});const e=u("subtabPropio"),t=u("subtabCompartido"),n=u("subtabCombinado");p();const r=u("horarioPropio"),a=u("horarioCompartido"),s=u("horarioCombinado");function i(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function o(){var m,g,b;t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await wn(),(m=l.partyView)!=null&&m.uid&&await Vr(l.partyView.uid),await fr(),(g=l.partyView)!=null&&g.uid&&((b=l.partyView)!=null&&b.semId)?Gt(l.partyView.uid,l.partyView.semId):Je()}async function c(){var b;const m=u("horarioCombinado");if(!m)return;m.innerHTML=`
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
  `;const g=document.getElementById("busy-semSelCombined");if(g&&l.currentUser){const y=T(k,"users",l.currentUser.uid,"semesters"),w=(await F(Q(y))).docs.map(E=>{var x;return{id:E.id,label:String(((x=E.data())==null?void 0:x.label)||E.id).trim()}}).sort((E,x)=>x.label.localeCompare(E.label));if(!w.length){g.innerHTML='<option value="" disabled selected>— sin semestres —</option>';return}const C=E=>{const x=/^(\d{4})-(1|2)$/.exec(String(E||"").trim());if(!x)return null;const S=parseInt(x[1],10);return parseInt(x[2],10)===1?`${S}-2`:`${S+1}-1`};g.innerHTML="";for(const E of w){const x=document.createElement("option");x.value=E.label,x.textContent=E.label,g.appendChild(x)}const A=((b=l.activeSemesterData)==null?void 0:b.label)||null,N=C(A)||A,v=w.map(E=>E.label),I=N&&v.includes(N)?N:A&&v.includes(A)?A:w[0].label;g.value=I,await Ma(I),Sn("busyLegendCombined"),yr("schedPartyBusyCombined"),g.addEventListener("change",async()=>{const E=g.value;await Ma(E),Sn("busyLegendCombined"),yr("schedPartyBusyCombined")})}}async function d(){n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),await c()}e.addEventListener("click",i),t.addEventListener("click",()=>{o()}),n.addEventListener("click",d),i(),document.addEventListener("courses:changed",()=>{if(Le){Ke();return}zn(),me()}),document.addEventListener("click",async m=>{const g=m.target.closest(".block-del-btn");if(!g)return;const b=g.dataset.id;if(!(!b||!l.currentUser||!l.activeSemesterId)&&confirm("¿Eliminar este bloque del horario?"))try{await ye($(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",b))}catch(y){console.error(y),alert("No se pudo eliminar el bloque.")}});function p(){const m=u("subtabPropio");if(!m)return;const g=m.parentElement;if(!g||document.getElementById("btnSimSchedule"))return;g.style.display="flex",g.style.alignItems="center",g.style.gap="10px",g.style.flexWrap="wrap";const b=document.createElement("div");b.style.flex="1 1 auto",g.appendChild(b);const y=document.createElement("button");y.id="btnSimSchedule",y.className="btn violet",y.textContent="Simulador de horario",y.style.marginLeft="auto",g.appendChild(y)}function f(){document.addEventListener("click",async m=>{m.target.closest("#btnSimSchedule")&&await fs()})}Po(),f()}function Dt(){if(pn&&(pn(),pn=null),ln&&(ln(),ln=null),!l.currentUser||!l.activeSemesterId){ls();return}ie=[],me();const e=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");ln=G(Q(e,ve("createdAt")),n=>{l.courses=n.docs.map(r=>({id:r.id,...r.data()})),document.dispatchEvent(new Event("courses:changed"))});const t=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule");pn=G(Q(t),n=>{ie=n.docs.map(r=>({id:r.id,...r.data()})),me()})}function ls(){document.querySelectorAll(".schedule-controls").forEach(n=>n.remove());const e=u("schedUSM");e&&(e.innerHTML=`
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `);const t=u("coursePalette");t&&(t.innerHTML='<div class="muted">Selecciona o crea un semestre para ver ramos.</div>'),ie=[],Ae=[]}function ii(){const e=u("horarioPropio");e.innerHTML=`
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
  `,zn(),me()}function li(){zn(),me()}function zn(){const e=u("coursePalette");if(!e)return;e.innerHTML="";const t=Array.isArray(l.courses)?l.courses:[];if(lr){const n=document.createElement("button");n.type="button",n.className="palette-chip",n.id="paletteAddCourseChip",n.textContent="+",n.style.cursor="pointer",n.style.fontWeight="900",n.style.fontSize="18px",n.style.display="inline-flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.minWidth="44px",n.style.borderStyle="dashed",n.style.opacity="0.95",n.addEventListener("click",async()=>{var a;const r=((a=document.getElementById("sim-semSel"))==null?void 0:a.value)||l.activeSemesterId;await ur(r)}),e.appendChild(n)}if(!t.length){const n=document.createElement("div");n.className="muted",n.style.marginLeft="10px",n.textContent=lr?"Aún no tienes ramos. Presiona + para agregar el primero.":"Aún no tienes ramos. Agrega ramos desde el simulador.",e.appendChild(n);return}t.forEach(n=>{const r=document.createElement("div");r.className="palette-chip",r.setAttribute("draggable","true"),r.dataset.courseId=n.id,r.textContent=n.name;const a=vt(n.color)?n.color:"#3B82F6";r.style.borderColor=a,r.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)",e.appendChild(r)})}function ci(e){var t;document.querySelectorAll(".schedule-controls").forEach(n=>n.remove()),e.innerHTML=`
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `,(t=u("btnCreateNewSched"))==null||t.addEventListener("click",()=>pr(!1))}async function di(e,t){if(!e||!t)return;const n=T(k,"users",e,"semesters",t,"schedule");await br(n)}async function me(){var d,p,f,m,g,b;const e=u("schedUSM");if(!e)return;if(!l.currentUser||!l.activeSemesterId){ls();return}let t=await Ut();Ae=t;const n=gt(),r=n==="USM"||n==="UMAYOR",a=`custom_slots_${n}_${(d=l.currentUser)==null?void 0:d.uid}`,s=Array.isArray(be[n])&&be[n].length>0;if(document.querySelectorAll(".schedule-controls").forEach(y=>y.remove()),!t){ci(e);return}const i=document.createElement("div");i.className="card schedule-controls",i.style="padding:12px;text-align:center;margin-bottom:10px;",r?i.innerHTML=`
    <button id="btnUseDefaultSched" class="btn blue" ${s?"":"disabled"}>
      Usar horario por defecto
    </button>
    <button id="btnCreateCustomSched" class="btn violet" ${s?"disabled":""}>
      Crear horario personalizado
    </button>
    ${s?`
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    `:""}
    <button id="btnEditBlocksMode" class="btn ${et?"violet":"violet-outline"}">
      ${et?"✅ Modo edición: ON":"Editar ramos y salas"}
    </button>
  `:i.innerHTML=`
    <button id="btnCreateCustomSched" class="btn violet" ${s?"disabled":""}>
      Crear horario personalizado
    </button>
    ${s?`
      <button id="btnEditCustomSched" class="btn violet-outline">
        Editar horario personalizado
      </button>
      <button id="btnDeleteCustomSched" class="btn red">
        Borrar horario personalizado
      </button>
    `:""}

    <!-- ✅ NUEVO BOTÓN -->
    <button id="btnEditBlocksMode" class="btn ${et?"violet":"violet-outline"}">
      ${et?"✅ Modo edición: ON":"Editar ramos y salas"}
    </button>
  `,e.before(i),(p=u("btnEditBlocksMode"))==null||p.addEventListener("click",()=>{et=!et,me()}),(f=u("btnCreateCustomSched"))==null||f.addEventListener("click",()=>{pr(!1)}),(m=u("btnUseDefaultSched"))==null||m.addEventListener("click",async()=>{localStorage.removeItem(a),await La(n),alert("Se restauró el horario por defecto."),Ae=n==="USM"?yt:en,me()}),(g=u("btnEditCustomSched"))==null||g.addEventListener("click",async()=>{const y=localStorage.getItem(a);let h=null;if(y)try{h=JSON.parse(y)}catch{}if(!h||h.length===0){alert("No hay horario personalizado guardado para editar.");return}confirm("¿Deseas volver a generar este horario con diferentes bloques o tiempos?")&&(alert("Ahora puedes modificar el horario. Se reemplazará el anterior."),await pr(!0))}),(b=u("btnDeleteCustomSched"))==null||b.addEventListener("click",async()=>{var y;if(await dt({title:"Borrar horario",text:"¿Seguro que deseas borrar tu horario personalizado?",yesText:"Sí, borrar horario",noText:"Cancelar"}))try{const h=(y=l.currentUser)==null?void 0:y.uid,w=l.activeSemesterId;if(!h||!w){alert("No hay semestre activo.");return}localStorage.removeItem(a),await La(n),delete be[n],Ae=[],await di(h,w),ie=[],W=[],Nn.delete($n(h,w)),document.dispatchEvent(new Event("courses:changed")),alert("Horario personalizado eliminado. Tus ramos siguen guardados."),await me()}catch(h){console.error(h),alert("No se pudo borrar el horario personalizado.")}});const c=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${c}</div>
        ${Pe.map(y=>`<div class="cell header">${y}</div>`).join("")}
        ${t.map((y,h)=>`
          <div class="cell mod ${y.lunch?"lunch":""}" data-slot="${h}">
            ${jn(y,h,n)}

          </div>
          ${Pe.map((w,C)=>`
            <div class="cell slot ${y.lunch?"is-lunch":""}"
                data-day="${C}" data-slot="${h}"
                ${y.lunch?'aria-disabled="true"':""}>
              ${Ci(C,h)}

            </div>
          `).join("")}
        `).join("")}
      </div>
    `,jr(),e.querySelectorAll(".placed").forEach(y=>{if(!y.querySelector(".block-del-btn")){const h=document.createElement("button");h.className="block-del-btn",h.textContent="×",h.dataset.id=y.dataset.id,y.appendChild(h)}})}function ui(){var n,r;if(document.getElementById("cqModal"))return;const e=document.createElement("div");e.id="cqModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=()=>{e.style.display="none"};(n=document.getElementById("cqX"))==null||n.addEventListener("click",t),(r=document.getElementById("cqCancel"))==null||r.addEventListener("click",t),e.addEventListener("click",a=>{a.target===e&&t()}),document.addEventListener("keydown",a=>{e.style.display==="flex"&&a.key==="Escape"&&t()})}async function ur(e=null,{forceFirestore:t=!1}={}){ui();const n=e||l.activeSemesterId;if(!l.currentUser||!n)return alert("Necesitas seleccionar un semestre para agregar ramos."),null;const r=document.getElementById("cqModal"),a=document.getElementById("cqErr"),s=document.getElementById("cqName"),i=document.getElementById("cqCode"),o=document.getElementById("cqColor"),c=document.getElementById("cqAsis"),d=document.getElementById("cqSave"),p=document.getElementById("cqCancel"),f=document.getElementById("cqX");a.style.display="none",a.textContent="",s.value="",i.value="",o.value="#3B82F6",c.checked=!1,r.style.display="flex",setTimeout(()=>s.focus(),0);const m=g=>{a.textContent=g,a.style.display="block"};return new Promise(g=>{const b=()=>{d.removeEventListener("click",w),p.removeEventListener("click",y),f.removeEventListener("click",y),document.removeEventListener("keydown",h),r.style.display="none"},y=()=>{b(),g(null)},h=C=>{C.key==="Escape"&&(C.preventDefault(),y()),C.key==="Enter"&&(C.preventDefault(),w())},w=async()=>{const C=(s.value||"").trim();if(!C)return m("Ingresa el nombre del ramo.");const A=(i.value||"").trim();if(!A)return m("Ingresa el código del ramo.");const N={name:C,code:A,professor:"",section:"",color:o.value||"#3B82F6",asistencia:!!c.checked,createdAt:Date.now()};try{if(Le&&!t){const x=`SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;re=Array.isArray(re)?re:[],re.push({id:x,...N}),Yn(re),$e(),Oe=!0,Ke(),await _e(),b(),g({id:x,...N});return}const v=await Ce(T(k,"users",l.currentUser.uid,"semesters",n,"courses"),N),I=T(k,"users",l.currentUser.uid,"semesters",n,"courses"),E=await F(Q(I,ve("createdAt")));l.courses=E.docs.map(x=>({id:x.id,...x.data()})),document.dispatchEvent(new Event("courses:changed")),b(),g({id:v.id,...N})}catch(v){console.error(v),m("No se pudo guardar el ramo. Revisa consola.")}};d.addEventListener("click",w),p.addEventListener("click",y),f.addEventListener("click",y),document.addEventListener("keydown",h)})}function pi(){if(document.getElementById("ynModal"))return;const e=document.createElement("div");e.id="ynModal",e.style.cssText=`
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
    `,document.body.appendChild(e)}function mi(){if(document.getElementById("blockModal"))return;const e=document.createElement("div");e.id="blockModal",e.style.cssText=`
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

            ${t("Nombre","bmNameOnly")}
            ${t("Código","bmCode")}
            ${t("Profesor","bmTeacher")}
            ${t("Paralelo / Sección","bmSection")}
            ${t("Sala","bmRoomView")}

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
    `,document.body.appendChild(e);function t(n,r){return`
        <div style="
          display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
          padding:10px 12px; border-radius:14px;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.08);
        ">
          <div style="font-size:12.5px; opacity:.75;">${n}</div>
          <div id="${r}" style="font-size:13px; font-weight:800; text-align:right; max-width:62%; word-break:break-word;"></div>
        </div>
      `}}function Ea({mode:e="view",courseName:t,color:n,timeText:r,realName:a="",shownName:s="",code:i="",teacher:o="",section:c="",room:d=""}){mi();const p=document.getElementById("blockModal"),f=document.getElementById("bmTitle"),m=document.getElementById("bmSub"),g=document.getElementById("bmDot"),b=document.getElementById("bmCourse"),y=document.getElementById("bmTime"),h=document.getElementById("bmNameOnly"),w=document.getElementById("bmCode"),C=document.getElementById("bmTeacher"),A=document.getElementById("bmSection"),N=document.getElementById("bmRoomView"),v=document.getElementById("bmDetails"),I=document.getElementById("bmEdit"),E=document.getElementById("bmName"),x=document.getElementById("bmRoom"),S=document.getElementById("bmX"),L=document.getElementById("bmCancel"),M=document.getElementById("bmSave"),U=e==="edit";f.textContent=U?"Editar ramo":"Detalles del ramo",m.textContent=U?"Modifica nombre mostrado y/o sala":"Información del ramo (sin editar)",g.style.background=vt(n)?n:"#64748b",b.textContent=t||"Ramo",y.textContent=r||"";const B=P=>String(P||"").trim()||"—";return h.textContent=B(a),w.textContent=B(i),C.textContent=B(o),A.textContent=B(c),N.textContent=B(d),v.style.display=U?"none":"grid",I.style.display=U?"grid":"none",E.value=String(s||"").trim()&&s!==a?String(s).trim():"",x.value=String(d||"").trim(),M.style.display=U?"inline-flex":"none",p.style.display="flex",U&&setTimeout(()=>{E.focus(),E.select()},0),new Promise(P=>{const _=()=>{S.removeEventListener("click",z),L.removeEventListener("click",z),M.removeEventListener("click",R),p.removeEventListener("click",H),document.removeEventListener("keydown",j),p.style.display="none"},z=()=>{_(),P(null)},H=q=>{q.target===p&&z()},R=()=>{const q=String(E.value||"").trim(),ce=String(x.value||"").trim();_(),P({nameVal:q,roomVal:ce})},j=q=>{q.key==="Escape"&&(q.preventDefault(),z()),U&&q.key==="Enter"&&(q.preventDefault(),R())};S.addEventListener("click",z),L.addEventListener("click",z),M.addEventListener("click",R),p.addEventListener("click",H),document.addEventListener("keydown",j)})}function fi(){document.addEventListener("click",async e=>{const t=e.target.closest(".placed");if(!t||!t.closest("#schedUSM")||e.target.closest(".block-del-btn"))return;const r=t.dataset.id,a=ie.find(w=>w.id===r);if(!a)return;const s=(l.courses||[]).find(w=>w.id===a.courseId)||{},i=(s.name||"Ramo").trim(),o=a.displayName&&String(a.displayName).trim()?String(a.displayName).trim():i,c=a.room&&String(a.room).trim()?String(a.room).trim():"",d=Br(l.courses,a.courseId,rs),p=a.start&&a.end?`${a.start}–${a.end}`:"",f=s.code||s.codigo||"",m=s.teacher||s.professor||s.docente||"",g=s.section||s.seccion||s.paralelo||"";if(!et){await Ea({mode:"view",courseName:o,color:d,timeText:p,realName:i,shownName:o,code:f,teacher:m,section:g,room:c});return}const b=await Ea({mode:"edit",courseName:i,color:d,timeText:p,realName:i,shownName:o,code:f,teacher:m,section:g,room:c});if(!b||!l.currentUser||!l.activeSemesterId)return;const{nameVal:y,roomVal:h}=b;try{const w=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",a.id);await ae(w,{displayName:y||null,room:h||null,updatedAt:Date.now()});const C=ie.findIndex(A=>A.id===a.id);C>=0&&(ie[C].displayName=y||null,ie[C].room=h||null),me()}catch(w){console.error(w),alert("No se pudo actualizar. Intenta nuevamente.")}})}function yi(){if(document.getElementById("csModal"))return;const e=document.createElement("div");e.id="csModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=document.getElementById("csHasLunch"),n=document.getElementById("csLunchRow");t.addEventListener("change",()=>{n.style.display=t.checked?"grid":"none"})}function cs({editMode:e=!1,titleOverride:t=null,okTextOverride:n=null,subOverride:r=null}={}){yi();const a=document.getElementById("csModal"),s=document.getElementById("csTitle"),i=document.getElementById("csSub"),o=document.getElementById("csErr"),c=document.getElementById("csBlocks"),d=document.getElementById("csHasLunch"),p=document.getElementById("csLunchRow"),f=document.getElementById("csLunchStart"),m=document.getElementById("csLunchEnd"),g=document.getElementById("csS1"),b=document.getElementById("csE1"),y=document.getElementById("csS2"),h=document.getElementById("csE2"),w=document.getElementById("csOk"),C=document.getElementById("csCancel"),A=document.getElementById("csX");s.textContent=t??(e?"Editar horario personalizado":"Crear horario personalizado"),i.textContent=r??(e?"Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.":"Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click."),o.style.display="none",o.textContent="",c.value="",d.checked=!1,p.style.display="none",f.value="13:40",m.value="14:40",g.value="08:15",b.value="09:25",y.value="09:40",h.value="10:50",w.textContent=n??(e?"Guardar":"Crear"),a.style.display="flex";const N=v=>{o.textContent=v,o.style.display="block"};return new Promise(v=>{const I=M=>{M.target===a&&S()},E=M=>{M.key==="Enter"&&L(),M.key==="Escape"&&S()},x=()=>{w.removeEventListener("click",L),C.removeEventListener("click",S),A==null||A.removeEventListener("click",S),a.removeEventListener("click",I),a.removeEventListener("keydown",E)},S=()=>{x(),a.style.display="none",v(null)},L=()=>{const M=parseInt(c.value,10);if(!M||M<=0)return N("Ingresa un número válido de bloques por día.");const U=g.value,B=b.value,P=y.value,_=h.value;if(!U||!B||!P||!_)return N("Completa los horarios de los bloques base.");const z=!!d.checked,H=f.value,R=m.value;if(z&&(!H||!R))return N("Completa inicio y fin de almuerzo.");x(),a.style.display="none",v({n:M,hasLunch:z,lunchStart:z?H:null,lunchEnd:z?R:null,start1:U,end1:B,start2:P,end2:_})};w.addEventListener("click",L),C.addEventListener("click",S),A==null||A.addEventListener("click",S),a.addEventListener("click",I),a.addEventListener("keydown",E)})}function _r(){return`dp_sim_items_${Ye||"UNI"}_TERM`}function ds(e){try{const t=(e||[]).map(n=>({courseId:n.courseId,pid:n.pid,day:n.day,slot:n.slot,pos:n.pos||"full"})).sort((n,r)=>(n.courseId||"").localeCompare(r.courseId||"")||(n.pid||"").localeCompare(r.pid||"")||n.day-r.day||n.slot-r.slot||(n.pos||"").localeCompare(r.pos||""));return JSON.stringify(t)}catch{return""}}function $e(){Oe=as()}function us(){try{localStorage.setItem(_r(),JSON.stringify(W||[]))}catch{}ns=ds(W),Oe=!1}function gi(){try{const e=localStorage.getItem(_r()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Rr(){var e;return`dp_sim_slots_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Or(){var e;return`dp_sim_parallel_defs_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Hr(){var e;return`dp_sim_selected_parallel_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function vi(){try{const e=localStorage.getItem(Rr()),t=JSON.parse(e||"null");return Array.isArray(t)?t:null}catch{return null}}function Fr(e){try{localStorage.setItem(Rr(),JSON.stringify(e||null))}catch{}}function bi(){try{const e=localStorage.getItem(Or()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))n.set(r,Array.isArray(t[r])?t[r]:[]);return n}catch{return new Map}}function zr(){try{const e={};for(const[t,n]of(Z||new Map).entries())e[t]=n||[];localStorage.setItem(Or(),JSON.stringify(e))}catch{}}function hi(){try{const e=localStorage.getItem(Hr()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))t[r]&&n.set(r,t[r]);return n}catch{return new Map}}function qn(){try{const e={};for(const[t,n]of(K||new Map).entries())e[t]=n;localStorage.setItem(Hr(),JSON.stringify(e))}catch{}}function xi(e,{persist:t=!1}={}){var n,r;if(e)try{const a=JSON.parse(e);pe=a.slots||null,W=Array.isArray(a.items)?a.items:[],re=Array.isArray(a.courses)?a.courses:[],(n=Z.clear)==null||n.call(Z);for(const s of Object.keys(a.defs||{}))Z.set(s,Array.isArray(a.defs[s])?a.defs[s]:[]);(r=K.clear)==null||r.call(K);for(const s of Object.keys(a.selected||{}))a.selected[s]&&K.set(s,a.selected[s]);ns=ds(W),Oe=!1,t&&(Fr(pe),$e(),Yn(re),us(),zr(),qn())}catch(a){console.warn("restoreSimFromSnapshot failed",a)}}function wi({title:e="Salir del simulador",message:t="¿Quieres guardar antes de salir?",saveText:n="Guardar y salir",discardText:r="Salir sin guardar",cancelText:a="Cancelar"}={}){return new Promise(s=>{const i=document.getElementById("triConfirm");i&&i.remove();const o=document.createElement("div");o.id="triConfirm",o.style.cssText=`
        position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.55); padding:16px;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      `,o.innerHTML=`
        <div style="
          width:min(520px, 96vw);
          background:#121527;
          border:1px solid rgba(255,255,255,.10);
          border-radius:18px;
          padding:16px;
          box-shadow:0 18px 60px rgba(0,0,0,.45);
          color:#fff;
        ">
          <div style="font-weight:900; font-size:16px;">${e}</div>
          <div style="opacity:.8; margin-top:8px; font-size:13.5px;">${t}</div>

          <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:16px; flex-wrap:wrap;">
            <button id="triCancel" class="btn violet-outline" type="button">${a}</button>
            <button id="triDiscard" class="btn violet-outline" type="button">${r}</button>
            <button id="triSave" class="btn violet" type="button">${n}</button>
          </div>
        </div>
      `;const c=d=>{o.remove(),s(d)};o.addEventListener("click",d=>{d.target===o&&c("cancel")}),o.querySelector("#triCancel").addEventListener("click",()=>c("cancel")),o.querySelector("#triDiscard").addEventListener("click",()=>c("discard")),o.querySelector("#triSave").addEventListener("click",()=>c("save")),document.body.appendChild(o)})}function dt({title:e="Confirmar",text:t="",yesText:n="Sí",noText:r="No"}={}){pi();const a=document.getElementById("ynModal"),s=document.getElementById("ynTitle"),i=document.getElementById("ynText"),o=document.getElementById("ynYes"),c=document.getElementById("ynNo");return s.textContent=e,i.textContent=t,o.textContent=n,c.textContent=r,a.style.display="flex",new Promise(d=>{const p=()=>{o.removeEventListener("click",f),c.removeEventListener("click",m),a.removeEventListener("click",g),document.removeEventListener("keydown",b),a.style.display="none"},f=()=>{p(),d(!0)},m=()=>{p(),d(!1)},g=y=>{y.target===a&&(p(),d(!1))},b=y=>{y.key==="Escape"&&(p(),d(!1)),y.key==="Enter"&&(p(),d(!0))};o.addEventListener("click",f),c.addEventListener("click",m),a.addEventListener("click",g),document.addEventListener("keydown",b)})}async function pr(e=!1){const t=gt()||"UNI_desconocida",n=await cs({editMode:e});if(!n)return;const{n:r,hasLunch:a,lunchStart:s,lunchEnd:i,start1:o,end1:c,start2:d,end2:p}=n;let f=null,m=null;if(a&&(f=X(s),m=X(i),isNaN(f)||isNaN(m)||m<=f))return alert("Horas de almuerzo inválidas.");const g=X(o),b=X(c)-X(o),y=X(d)-X(c);if(isNaN(g)||b<=0)return alert("Horas inválidas en bloques.");if(y<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa.");const h=[];let w=g,C=!1,A=0;for(;A<r;){if(a&&!C&&w>=f&&w<m){h.push({label:"ALMUERZO",start:s,end:i,lunch:!0}),C=!0,w=m;continue}const N=w,v=N+b;if(a&&!C&&N<f&&v>f){h.push({label:"ALMUERZO",start:s,end:i,lunch:!0}),C=!0,w=m;continue}const I=A+1,E=ue(N),x=ue(v);h.push({label:String(I),start:E,end:x,lines:[{n:String(I),start:E,end:x}]}),A++,w=v+y}if(a&&!C){const N={label:"ALMUERZO",start:s,end:i,lunch:!0};let v=h.findIndex(I=>!I.lunch&&X(I.start)>=f);v===-1&&(v=h.length),h.splice(v,0,N);for(let I=v+1;I<h.length;I++){const E=h[I];if(E.lunch)continue;const x=X(E.start),S=X(E.end);if(x<m){const L=m-x,M=x+L,U=S+L;E.start=ue(M),E.end=ue(U),E.lines=[{n:E.label,start:E.start,end:E.end}]}}}be[t]=h,localStorage.setItem(`custom_slots_${t}_${l.currentUser.uid}`,JSON.stringify(h)),await ms(t,h),alert(e?"Horario personalizado actualizado.":"Horario personalizado creado exitosamente."),me()}async function Si(){const e=await cs({editMode:!0,titleOverride:"Editar horario personalizado",okTextOverride:"Guardar",subOverride:"Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click."});if(!e)return null;const{n:t,hasLunch:n,lunchStart:r,lunchEnd:a,start1:s,end1:i,start2:o,end2:c}=e;let d=null,p=null;if(n&&(d=X(r),p=X(a),isNaN(d)||isNaN(p)||p<=d))return alert("Horas de almuerzo inválidas."),null;const f=X(s),m=X(i)-X(s),g=X(o)-X(i);if(isNaN(f)||m<=0)return alert("Horas inválidas en bloques."),null;if(g<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa."),null;const b=[];let y=f,h=!1,w=0;for(;w<t;){if(n&&!h&&y>=d&&y<p){b.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const C=y,A=C+m;if(n&&!h&&C<d&&A>d){b.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const N=w+1,v=ue(C),I=ue(A);b.push({label:String(N),start:v,end:I,lines:[{n:String(N),start:v,end:I}]}),w++,y=A+g}if(n&&!h){const C={label:"ALMUERZO",start:r,end:a,lunch:!0};let A=b.findIndex(N=>!N.lunch&&X(N.start)>=d);A===-1&&(A=b.length),b.splice(A,0,C);for(let N=A+1;N<b.length;N++){const v=b[N];if(v.lunch)continue;const I=X(v.start),E=X(v.end);if(I<p){const x=p-I,S=I+x,L=E+x;v.start=ue(S),v.end=ue(L),v.lines=[{n:v.label,start:v.start,end:v.end}]}}}return b}function ue(e){const t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function $n(e,t){return`${e}:${t}`}function Ei(e,t){const n=$n(e,t),r=Nn.get(n);return r?(Et=r.items||[],je=r.courses||[],Ct=r.slots||yt,Ye=r.uni||"USM",Je(),!0):!1}function jn(e,t,n){if(e.lunch)return`
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${e.start}–${e.end}</div>
      `;const r=dr.length?dr:Ae;if(n!=="USM"&&n!=="UMAYOR"||!e.label.includes("/"))return`
        <div class="mod-lines">
          <div class="line-num">${e.label}</div>
          <div class="line-time">${e.start}–${e.end}</div>
        </div>
      `;if(n==="USM"){const i=(r.slice(0,t+1).filter(c=>!c.lunch).length-1)*2+1,o=i+1;return`
    <div class="mod-lines">
      <div class="line-num">${i}</div>
      <div class="line-time">${e.lines[0].start}–${e.lines[0].end}</div>
      <div class="line-num">${o}</div>
      <div class="line-time">${e.lines[1].start}–${e.lines[1].end}</div>
    </div>
  `}return`
  <div class="mod-lines">
    <div class="line-num">${r.slice(0,t+1).filter(s=>!s.lunch).length}</div>
    <div class="line-time">${e.start}–${e.end}</div>
  </div>
`}document.addEventListener("click",e=>{const t=e.target.closest(".mod-lines");if(!t)return;const n=gt();if(!be[n])return;const a=Array.from(t.parentNode.parentNode.querySelectorAll(".mod")).indexOf(t.parentNode);if(a<0)return;const s=be[n],i=s[a],o=X(i.end),c=prompt(`Inicio de ${i.label}`,i.start),d=prompt(`Fin de ${i.label}`,i.end);if(!c||!d)return;const p=X(c),f=X(d);if(isNaN(p)||isNaN(f)||f<=p){alert("Horas inválidas.");return}i.start=ue(p),i.end=ue(f),i.lines=[{n:i.label.split("/")[0],start:ue(p),end:ue(f)}];const m=f-p;if(a<s.length-1){const g=X(s[a+1].start)-o;let b=f+g;for(let y=a+1;y<s.length;y++){const h=s[y],w=y+1;h.start=ue(b),h.end=ue(b+m),h.lines=[{n:String(w),start:h.start,end:ue(b+m/2)},{n:String(w+1),start:ue(b+m/2),end:h.end}],b=X(h.end)+g}}localStorage.setItem(`custom_slots_${n}_${l.currentUser.uid}`,JSON.stringify(s)),be[n]=s,me()});function Ci(e,t){const n=ie.filter(r=>r.day===e&&r.slot===t);return n.length?ps(n,!1):""}function ps(e,t){const n=oi(e);return n.blocks.map(r=>Li(r,n.laneCount,t)).join("")}function Li(e,t,n){const r=n?Array.isArray(re)?re:[]:l.courses||[],a=r.find(C=>C.id===e.courseId),s=(a==null?void 0:a.name)||"Ramo",i=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():s,o=typeof e.room=="string"&&e.room.trim()?e.room.trim():"",c=Br(r,e.courseId,rs),d=Fn(c),p=e.hpos||"single";let f=0,m=100;p==="left"?(f=0,m=50):p==="right"&&(f=50,m=50);const g=e.pos||"full";let b=0,y=100;g==="top"?(b=0,y=50):g==="bottom"&&(b=50,y=50);const h=`${i}${o?` · Sala: ${o}`:""}`,w=n?`draggable="true"
       data-sim-course="${ge(e.courseId||"")}"
       data-sim-pid="${ge(e.pid||e.parallelPid||"")}"
       data-sim-day="${Number(e.day)}"
       data-sim-slot="${Number(e.slot)}"
       data-sim-pos="${ge(e.pos||"full")}"
       data-sim-hpos="${ge(e.hpos||"single")}"`:`data-id="${ge(e.id||"")}" draggable="true"`;return`
    <div class="placed pos-${e.pos||"full"} h-${p}"
        ${w}
        title="${ge(h)}"
        style="
          background:${c};
          border:1px solid rgba(0,0,0,0.25);
          left:${f}%;
          width:${m}%;
          top:${b}%;
          height:${y}%;
        ">
        <div class="placed-title" style="color:${d}; font-weight:700; line-height:1.05;">
          ${ge(i)}
        </div>
        ${o?`
          <div class="placed-room" style="color:${d}; opacity:.9; font-weight:700; font-size:11px; margin-top:2px; line-height:1.05;">
            ${ge(o)}
          </div>
        `:""}
      </div>
  `}function ki(){window.addEventListener("dragover",Jo,{passive:!0}),document.addEventListener("drop",pt),document.addEventListener("dragend",pt),document.addEventListener("dragstart",e=>{var r,a,s,i;const t=(a=(r=e.target).closest)==null?void 0:a.call(r,".palette-rect");if(t){const o=t.dataset.payload;if(o){e.dataTransfer.setData("text/plain",o),e.dataTransfer.effectAllowed="copy",at=!0;return}}const n=(i=(s=e.target).closest)==null?void 0:i.call(s,".palette-chip");n&&(e.dataTransfer.setData("text/plain",n.dataset.courseId),e.dataTransfer.effectAllowed="copy",at=!0)}),document.addEventListener("dragstart",e=>{var n,r;const t=(r=(n=e.target).closest)==null?void 0:r.call(n,".placed");if(t){if(t.closest("#simModal")){e.dataTransfer.setData("text/plain",JSON.stringify({type:"move-sim-block",courseId:t.dataset.simCourse||"",pid:t.dataset.simPid||null,from:{day:Number(t.dataset.simDay),slot:Number(t.dataset.simSlot),pos:t.dataset.simPos||"full",hpos:t.dataset.simHpos||"single"}})),e.dataTransfer.effectAllowed="move",at=!0;return}e.dataTransfer.setData("text/plain",JSON.stringify({type:"move-block",id:t.dataset.id})),e.dataTransfer.effectAllowed="move",at=!1}}),jr()}function qr(){var e;return`sim_courses_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Mi(){try{const e=localStorage.getItem(qr()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Yn(e){try{localStorage.setItem(qr(),JSON.stringify(e||[]))}catch{}}function jr(){document.querySelectorAll(".cell.slot").forEach(e=>{e.classList.contains("is-lunch")||(e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect=t.dataTransfer.effectAllowed==="move"?"move":"copy";const n=e.getBoundingClientRect(),r=t.clientX-n.left,a=t.clientY-n.top,s=n.height/2;let i="full";a<s-10?i="top":a>s+10&&(i="bottom");let o="single";const c=r/n.width;c<.4?o="left":c>.6&&(o="right"),e.dataset.droppos=i,e.dataset.droph=o,e.classList.add("over"),e.classList.remove("hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),i==="top"&&e.classList.add("hint-top"),i==="full"&&e.classList.add("hint-full"),i==="bottom"&&e.classList.add("hint-bottom"),o==="left"&&e.classList.add("hint-left"),o==="single"&&e.classList.add("hint-center"),o==="right"&&e.classList.add("hint-right")}),e.addEventListener("dragleave",()=>V(e)),e.addEventListener("drop",async t=>{t.preventDefault();const n=!!e.closest("#simModal"),r=t.dataTransfer.getData("text/plain");if(!r){V(e);return}const a=parseInt(e.dataset.day,10),s=parseInt(e.dataset.slot,10),i=e.dataset.droppos||"full",o=e.dataset.droph||"single";let c=null;try{c=JSON.parse(r)}catch{}const d=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===i),p=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===i&&(h.hpos||"single")===o);if(c&&c.type==="course-parallel"){const y=c.courseId,h=c.pid||null;if(n){const L=(pe||Ae||[])[s];if(!L){V(e);return}const M=(W||[]).filter(q=>q.courseId!==y),U=d(M);if(p(M).length){alert("Ese espacio exacto ya está ocupado."),V(e);return}if(U.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),V(e);return}W=(W||[]).filter(q=>q.courseId!==y);const _=(((re||[]).find(q=>q.id===y)||(l.courses||[]).find(q=>q.id===y)||{}).name||"Ramo").trim(),z=Z.get(y)||[],H=h?z.find(q=>q.pid===h):null,R=(H==null?void 0:H.section)||(H==null?void 0:H.pid)||null,j=R?`${_} · ${R}`:_;W.push({courseId:y,day:a,slot:s,start:L.start,end:L.end,pos:i,hpos:o,pid:h,displayName:j}),$e(),await _e(),V(e);return}if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),V(e);return}const w=(Ae||[])[s];if(!w){V(e);return}const C=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),V(e);return}if(C.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),V(e);return}const v=(((l.courses||[]).find(L=>L.id===y)||{}).name||"Ramo").trim(),I=Z.get(y)||[],E=h?I.find(L=>L.pid===h):null,x=(E==null?void 0:E.section)||(E==null?void 0:E.pid)||null,S=x?`${v} · ${x}`:null;await Ce(T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),{courseId:y,day:a,slot:s,start:w.start,end:w.end,pos:i,hpos:o,parallelPid:h||null,displayName:S,createdAt:Date.now()}),h&&K.set(y,h),V(e);return}if(c&&c.type==="move-sim-block"&&n){const y=c.from||{},h=(W||[]).findIndex(v=>v.courseId===c.courseId&&Number(v.day)===Number(y.day)&&Number(v.slot)===Number(y.slot)&&(v.pos||"full")===(y.pos||"full")&&(v.hpos||"single")===(y.hpos||"single"));if(h<0){V(e);return}const w=(pe||Ae||[])[s];if(!w||w.lunch){V(e);return}const C=(W||[]).filter((v,I)=>I!==h),A=p(C),N=d(C);if(A.length){alert("Ese espacio exacto ya está ocupado."),V(e);return}if(N.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),V(e);return}Object.assign(W[h],{day:a,slot:s,pos:i,hpos:o,start:w.start,end:w.end}),$e(),await _e(),V(e);return}if(c&&c.type==="move-block"){const y=c.id;if(!y){V(e);return}if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),V(e);return}try{const h=ie.find(E=>E.id===y);if(!h){V(e);return}const w=(Ae||[])[s];if(!w){V(e);return}if(h.day===a&&h.slot===s&&(h.pos||"full")===i&&(h.hpos||"single")===o){V(e);return}const C=ie.filter(E=>E.id!==y),A=d(C);if(p(C).length){alert("Ese espacio exacto ya está ocupado."),V(e);return}if(A.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),V(e);return}const v=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",y);await ae(v,{day:a,slot:s,pos:i,hpos:o,start:w.start,end:w.end,updatedAt:Date.now()});const I=ie.findIndex(E=>E.id===y);I>=0&&Object.assign(ie[I],{day:a,slot:s,pos:i,hpos:o,start:w.start,end:w.end}),me(),V(e);return}catch(h){console.error("move error",h),alert("No se pudo mover el bloque (Firestore): "+((h==null?void 0:h.message)||h)),V(e);return}}const f=r;if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),V(e);return}const m=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),V(e);return}if(m.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),V(e);return}if(m.length===1){const y=m[0],h=y.hpos||"single";if(h==="single"&&o!=="single"){const w=o==="left"?"right":"left";try{await ae($(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",y.id),{hpos:w})}catch{}}else if(h===o){alert("Ese lado ya está ocupado. Prueba el otro lado."),V(e);return}}const b=(Ae||[])[s];if(!b){V(e);return}await Ce(T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),{courseId:f,day:a,slot:s,start:b.start,end:b.end,pos:i,hpos:o,createdAt:Date.now()}),V(e)}))})}function V(e){e.classList.remove("over","hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),delete e.dataset.droppos,delete e.dataset.droph}function Ii(){var t;const e=u("horarioCompartido");e&&(e.innerHTML=`
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
    `,(t=u("party-semSel"))==null||t.addEventListener("change",n=>{l.partyView=l.partyView||{},l.partyView.semId=n.target.value||null,l.partyView.uid&&l.partyView.semId?Gt(l.partyView.uid,l.partyView.semId):Je()}),Je())}function Ai(e,t,n,r){const a=je||[],s=a.find(m=>m.id===e.courseId),i=(s==null?void 0:s.name)||"Ramo",o=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():i,c=Br(a,e.courseId,n),d=Fn(c),p=typeof e.room=="string"&&e.room.trim()?e.room.trim():null,f=e.hpos||"single";return`
    <div class="placed pos-${t} h-${f}"
        title="${o}${p?` · Sala: ${p}`:""}"
        style="background:${c}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${d}; font-weight:600;">${o}</div>
    </div>
  `}async function Ni(e,t){var a;const n=os(t),r=n==="USM"||n==="UMAYOR";if(e)try{const s=$(k,"users",e,"custom_schedules",n),i=await ee(s);if(i.exists()){const o=((a=i.data())==null?void 0:a.slots)||[];if(Array.isArray(o)&&o.length>0)return{uni:n,slots:o}}}catch(s){console.warn("[shared] error leyendo custom_schedules del dúo",s)}return r?{uni:n,slots:n==="UMAYOR"?en:yt}:{uni:n,slots:null}}async function $i({course:e,day:t,slot:n,room:r}){if(!l.currentUser||!l.activeSemesterId)throw new Error("No logueado");const a=l.activeSemesterId,s=l.currentUser.uid,i=(l.courses||[]).find(p=>(p.name||"").toLowerCase().includes(String(e).toLowerCase()));if(!i)throw new Error("Curso no encontrado");const o=T(k,"users",s,"semesters",a,"schedule"),d=(await F(o)).docs.find(p=>{const f=p.data();return f.courseId===i.id&&f.day===t&&f.slot===n});if(!d)throw new Error("No encontré el bloque en el horario");return await ae(d.ref,{room:r||null,updatedAt:Date.now()}),{ok:!0,room:r}}async function Pi(e=null){if(!l.currentUser)throw new Error("No logueado");const t=e||l.activeSemesterId;if(!t)throw new Error("No hay semestre activo");const n=T(k,"users",l.currentUser.uid,"semesters",t,"schedule");return(await F(n)).docs.map(a=>({id:a.id,...a.data()}))}async function Ti(e=null){if(!l.currentUser)throw new Error("No logueado");const t=e||l.activeSemesterId;if(!t)throw new Error("No hay semestre activo");if(!l.pairOtherUid)return{items:[]};const n=T(k,"users",l.currentUser.uid,"semesters",t,"schedule"),a=(await F(n)).docs.map(d=>({...d.data()})),s=T(k,"users",l.pairOtherUid,"semesters",t,"schedule"),o=(await F(s)).docs.map(d=>({...d.data()})),c=[];for(const d of a)for(const p of o)d.day===p.day&&d.slot===p.slot&&c.push(`${["Lun","Mar","Mié","Jue","Vie"][d.day]} bloque ${d.slot} (${d.courseName} / ${p.courseName})`);return{items:c}}async function Ui(e,t=null){if(!l.currentUser)throw new Error("No logueado");const n=t||l.activeSemesterId;return await ye($(k,"users",l.currentUser.uid,"semesters",n,"schedule",e)),{ok:!0}}document.addEventListener("dragstart",e=>{const t=e.target.closest(".placed");t&&t.classList.add("dragging")});document.addEventListener("dragend",e=>{const t=e.target.closest(".placed");t&&t.classList.remove("dragging")});const Ca=8*60,Di=22*60;function X(e){const[t,n]=e.split(":").map(Number);return t*60+n}function er(e){return(e-Ca)/(Di-Ca)*100}document.addEventListener("auth:ready",()=>{setTimeout(()=>{is(),Dt()},1e3)});document.addEventListener("semester:changed",()=>{Dt()});async function ms(e,t){if(!l.currentUser)return;const n=$(k,"users",l.currentUser.uid,"custom_schedules",e);await fe(n,{slots:t,updatedAt:Date.now()})}async function La(e){if(!l.currentUser)return!1;try{const t=$(k,"users",l.currentUser.uid,"custom_schedules",e);return await ye(t),!0}catch(t){return console.error("[Firestore] Error al eliminar horario personalizado:",t),!1}}async function wn(){var r,a;const e=u("partyBar");if(!e)return;const t=(r=l.currentUser)==null?void 0:r.uid,n=(l.partyMembers||[]).filter(Boolean).filter(s=>s!==t);if(!n.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}if(l.partyView=l.partyView||{},!l.partyView.uid){const s=(a=l.currentUser)==null?void 0:a.uid;l.partyView.uid=n.find(i=>i!==s)||s||n[0]}await Promise.all(n.map(s=>Yr(s,{force:!0}))),e.innerHTML=n.map(s=>{var p;const i=le[s]||{},o=i.name||(s===((p=l.currentUser)==null?void 0:p.uid)?"Yo":"Usuario"),c=i.color||"#64748b",d=s===l.partyView.uid;return`
    <button class="party-chip btn ${d?"violet":"violet-outline"} ${d?"is-active":""}"
      data-uid="${s}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${d?"outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);":""}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${c};display:inline-block;"></span>
      <span style="font-weight:700">${ge(o)}</span>
    </button>
  `}).join(""),e.querySelectorAll("button[data-uid]").forEach(s=>{s.addEventListener("click",async()=>{const i=s.dataset.uid;l.partyView.uid=i,await wn(),await Vr(i),await fr(),l.partyView.semId?Gt(i,l.partyView.semId):Je()})})}async function Yr(e,{force:t=!1}={}){if(e&&!(!t&&le[e]))try{const n=$(k,"users",e),r=$(k,"users",e,"profile","profile"),[a,s]=await Promise.all([ee(n),ee(r)]),i=a.exists()?a.data()||{}:{},o=s.exists()?s.data()||{}:{},c=typeof o.name=="string"&&o.name.trim()?o.name.trim():typeof i.name=="string"&&i.name.trim()?i.name.trim():typeof i.displayName=="string"&&i.displayName.trim()?i.displayName.trim():typeof i.username=="string"&&i.username.trim()?i.username.trim():"",d=typeof o.favoriteColor=="string"&&o.favoriteColor.trim()?o.favoriteColor.trim():typeof i.favoriteColor=="string"&&i.favoriteColor.trim()?i.favoriteColor.trim():"";le[e]={name:c,color:d}}catch(n){console.warn("loadPartyMemberProfile error",n),le[e]=le[e]||{name:"",color:""}}}function ge(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Gr(){var e;return`sim_palette_order_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function mr(){try{const e=localStorage.getItem(Gr()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function ka(e){try{localStorage.setItem(Gr(),JSON.stringify(e||[]))}catch{}}function Bi(e){const t=mr();if(!t.length)return e;const n=new Map(t.map((a,s)=>[a,s])),r=999999;return[...e].sort((a,s)=>{const i=n.has(a.id)?n.get(a.id):r,o=n.has(s.id)?n.get(s.id):r;return i!==o?i-o:String(a.name||"").localeCompare(String(s.name||""),"es")})}function _i(){const e=document.getElementById("simPaletteHost");if(!e)return;let t=null;e.querySelectorAll('.sim-course-group[draggable="true"]').forEach(n=>{n.addEventListener("dragstart",r=>{t=n.dataset.courseId,r.dataTransfer.effectAllowed="move",r.dataTransfer.setData("text/plain",t),n.classList.add("dragging")}),n.addEventListener("dragend",()=>{t=null,n.classList.remove("dragging"),e.querySelectorAll(".sim-course-group").forEach(r=>r.classList.remove("drag-over"))}),n.addEventListener("dragover",r=>{r.preventDefault(),r.dataTransfer.dropEffect="move",n.classList.add("drag-over")}),n.addEventListener("dragleave",()=>{n.classList.remove("drag-over")}),n.addEventListener("drop",r=>{r.preventDefault(),n.classList.remove("drag-over");const a=n.dataset.courseId;if(!t||!a||t===a)return;if(!mr().length){const p=Array.from(e.querySelectorAll(".sim-course-group")).map(f=>f.dataset.courseId).filter(Boolean);ka(p)}const i=mr().filter(Boolean),o=(l.courses||[]).map(p=>p.id);for(const p of o)i.includes(p)||i.push(p);const c=i.filter(p=>p!==t),d=c.indexOf(a);c.splice(Math.max(0,d),0,t),ka(c),Ke()})})}function Ri(){if(document.getElementById("simPaletteReorderStyles"))return;const e=document.createElement("style");e.id="simPaletteReorderStyles",e.textContent=`
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
    `,document.head.appendChild(e)}async function Vr(e){const t=u("party-semSel");if(!t||(t.innerHTML='<option value="">— seleccionar —</option>',!e))return;const n=T(k,"users",e,"semesters"),a=(await F(Q(n))).docs.map(s=>{var i;return{id:s.id,label:(((i=s.data())==null?void 0:i.label)||s.id).trim()}});a.sort((s,i)=>i.label.localeCompare(s.label));for(const s of a){const i=document.createElement("option");i.value=s.id,i.textContent=s.label,t.appendChild(i)}}async function fr(){var s,i;const e=(s=l.partyView)==null?void 0:s.uid,t=(i=l.activeSemesterData)==null?void 0:i.label,n=u("party-semSel");if(!e||!t||!n)return;await Vr(e);const r=Array.from(n.options),a=r.find(o=>(o.textContent||"").trim()===t);if(a)n.value=a.value,l.partyView.semId=a.value,await Gt(e,a.value);else{const o=r.find(c=>c.value);n.value=o?o.value:"",l.partyView.semId=n.value||null,l.partyView.semId&&await Gt(e,l.partyView.semId)}}function Je(){const e=u("schedPartyUSM");if(!e)return;if(!je||je.length===0){e.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>';return}const t=Ct||yt;dr=t;const n=Ye==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n}</div>
        ${Pe.map(r=>`<div class="cell header">${r}</div>`).join("")}
        ${t.map((r,a)=>`
          <div class="cell mod ${r.lunch?"lunch":""}" data-slot="${a}">
            ${jn(r,a,Ye)}
          </div>
          ${Pe.map((s,i)=>`
            <div class="cell slot ${r.lunch?"is-lunch":""}"
                data-day="${i}" data-slot="${a}">
              ${Oi(i,a)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `}function Oi(e,t){const n=Et.filter(a=>a.day===e&&a.slot===t),r=a=>{var d,p;const s=n.filter(f=>(f.pos||"full")===a);if(!s.length)return"";const i=s.sort((f,m)=>{const g={left:0,single:1,right:2};return(g[f.hpos||"single"]??1)-(g[m.hpos||"single"]??1)}),o=(d=l.partyView)==null?void 0:d.uid,c=((p=le[o])==null?void 0:p.color)||Vo;return i.map(f=>Ai(f,a,c)).join("")};return`
      ${r("top")}
      ${r("full")}
      ${r("bottom")}
    `}async function Gt(e,t){var d,p;if(!await Hn(e,"horario")){const f=u("schedPartyUSM");f&&(f.innerHTML=Tr("su horario"));return}if(cn&&(cn(),cn=null),dn&&(dn(),dn=null),un&&(un(),un=null),!e||!t)return;if(!Ei(e,t)){Et=[],je=[],Ct=null,Ye="USM";const f=u("schedPartyUSM");f&&(f.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>')}const a=(d=l.partyView)!=null&&d.semId?(p=(await ee($(k,"users",e,"semesters",l.partyView.semId))).data())==null?void 0:p.universityAtThatTime:"",{uni:s,slots:i}=await Ni(e,a);Ye=s,Ct=i||(s==="UMAYOR"?en:yt),un=G($(k,"users",e),f=>{const m=f.data()||{};le[e]=le[e]||{},le[e].color=m.favoriteColor||le[e].color||"",le[e].name=m.displayName||m.name||m.username||le[e].name||"",Je()});const o=T(k,"users",e,"semesters",t,"courses");dn=G(Q(o,ve("name")),f=>{je=f.docs.map(m=>({id:m.id,...m.data()})),Nn.set($n(e,t),{uni:Ye,slots:Ct,items:Et,courses:je}),Je()});const c=T(k,"users",e,"semesters",t,"schedule");cn=G(Q(c),f=>{Et=f.docs.map(m=>({id:m.id,...m.data()})),Nn.set($n(e,t),{uni:Ye,slots:Ct,items:Et,courses:je}),Je()})}async function Hi(){var e,t,n;for(const[r,a]of cr.entries()){try{(e=a.prof)==null||e.call(a)}catch{}try{(t=a.courses)==null||t.call(a)}catch{}try{(n=a.sched)==null||n.call(a)}catch{}}cr.clear(),Ge.clear()}async function Fi(e,t,{allowFallback:n=!0}={}){const r=T(k,"users",e,"semesters"),s=(await F(Q(r))).docs.map(o=>{var c;return{id:o.id,label:String(((c=o.data())==null?void 0:c.label)||o.id).trim()}});if(!s.length)return null;const i=t?s.find(o=>o.label===t):null;return i?i.id:!n&&t?null:(s.sort((o,c)=>c.label.localeCompare(o.label)),s[0].id)}async function Ma(e=null){var s,i,o;const t=(s=l.currentUser)==null?void 0:s.uid,n=Array.from(new Set([...l.partyMembers||[],t])).filter(Boolean);if(!n.length){const c=u("schedPartyBusy");c&&(c.innerHTML='<div class="muted">No hay miembros en tu party.</div>');return}await Hi();const r=e??(((i=l.activeSemesterData)==null?void 0:i.label)||null),a=!!e;await Promise.all(n.map(c=>Yr(c,{force:!0})));for(const c of n){const d=await Fi(c,r,{allowFallback:!a});if(!d)continue;const p=le[c]||{};Ge.set(c,{name:p.name||(c===((o=l.currentUser)==null?void 0:o.uid)?"Yo":"Usuario"),color:p.color||"#64748b",uni:"USM",slots:null,courses:[],items:[],semId:d});const f=(h,w="#64748b")=>{const C=String(h||"").trim();return/^#[0-9A-Fa-f]{6}$/.test(C)?C:w},m=(h,w="Usuario")=>{const C=String(h||"").trim();return C||w},g={};g.prof=G($(k,"users",c,"profile","profile"),h=>{var A;const w=h.data()||{},C=Ge.get(c);C&&(C.color=f(w.favoriteColor,C.color||"#64748b"),C.name=m(w.name,C.name||(c===((A=l.currentUser)==null?void 0:A.uid)?"Yo":"Usuario")),Ht())});const b=T(k,"users",c,"semesters",d,"courses");g.courses=G(Q(b,ve("name")),h=>{const w=Ge.get(c);w&&(w.courses=h.docs.map(C=>({id:C.id,...C.data()})),Ht())});const y=T(k,"users",c,"semesters",d,"schedule");g.sched=G(Q(y),h=>{const w=Ge.get(c);w&&(w.items=h.docs.map(C=>({id:C.id,...C.data(),_uid:c})),Ht())}),cr.set(c,g)}Ht()}function zi(e){const t=[...e].sort((r,a)=>r.startMin-a.startMin||r.endMin-a.endMin),n=[];for(const r of t){let a=!1;for(let s=0;s<n.length;s++)if(n[s]<=r.startMin){r._lane=s,n[s]=r.endMin,a=!0;break}a||(r._lane=n.length,n.push(r.endMin))}return{blocks:t,laneCount:n.length||1}}function qi(){if(document.getElementById("timelineStyles"))return;const e=document.createElement("style");e.id="timelineStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function yr(e="schedPartyBusy"){qi();const t=document.getElementById(e);if(!t)return;const n=Array.from(Ge.entries());if(!n.length){t.innerHTML='<div class="muted">Cargando party…</div>';return}const r=[];for(const[a,s]of n)for(const i of s.items||[]){const o=X(i.start),c=X(i.end);isNaN(o)||isNaN(c)||c<=o||r.push({...i,_uid:a,_name:s.name,_favColor:s.color,startMin:o,endMin:c})}t.innerHTML=`
      <div class="timeline-wrap">
        <div class="timeline-head">
          <div></div>
          ${Pe.map(a=>`<div class="timeline-dayname">${a}</div>`).join("")}
        </div>
        <div class="timeline-body">
          <div class="timeline-timecol">
            ${Array.from({length:15},(a,s)=>`<div class="timeline-timecell">${8+s}:00</div>`).join("")}
          </div>
          ${Pe.map((a,s)=>`
            <div class="timeline-day">
              ${ji()}
              ${(()=>{const i=r.filter(c=>c.day===s).map(c=>({...c,topPct:er(c.startMin),heightPct:er(c.endMin)-er(c.startMin)})).filter(c=>c.heightPct>0),o=zi(i);return o.blocks.map(c=>Yi(c,o.laneCount)).join("")})()}
            </div>
          `).join("")}
        </div>
      </div>
    `}function ji(){return Array.from({length:15},(e,t)=>{const n=t*6.666666666666667,r=n+100/15/2;return`
        <div class="timeline-line" style="top:${n}%"></div>
        <div class="timeline-line half" style="top:${r}%"></div>
      `}).join("")}function Yi(e,t){const n=Ge.get(e._uid),r=(n==null?void 0:n.color)||e._favColor||"#64748b",s=((n==null?void 0:n.courses)||[]).find(y=>y.id===e.courseId),i=((s==null?void 0:s.name)||"Ramo").trim(),o=t>1,c=r,d=gr(c,o?.35:.9),p=Fn(c),f=gr(c,1),m=o?e._lane===0?"top":e._lane===1?"bottom":"center":"center",g=m==="top"?"top:6px; transform:none;":m==="bottom"?"bottom:6px; transform:none;":"top:50%; transform:translateY(-50%);",b=10+(e._lane||0);return`
      <div class="timeline-block"
        title="${ge(i)}"
        style="
          position:absolute;
          top:${e.topPct}%;
          height:${e.heightPct}%;
          left:0%;
          width:100%;
          z-index:${b};
          border-radius:10px;
          background:${d};
          border:2px solid ${f};
          box-sizing:border-box;
          overflow:hidden;
        ">
        <div style="
          position:absolute;
          left:8px; right:8px;
          ${g}
          color:${p};
          font-size:12px;
          font-weight:900;
          line-height:1.1;
          text-align:center;
          text-shadow: 0 1px 2px rgba(0,0,0,.45);
          pointer-events:none;
        ">
          ${ge(i)}
        </div>
      </div>
    `}function gr(e,t){if(!vt(e))return`rgba(100,116,139,${t})`;const n=parseInt(e.slice(1,3),16),r=parseInt(e.slice(3,5),16),a=parseInt(e.slice(5,7),16),s=Math.max(0,Math.min(1,t));return`rgba(${n},${r},${a},${s})`}function Sn(e){const t=document.getElementById(e);if(!t)return;const n=Array.from(Ge.entries()).map(([r,a])=>{var s;return{uid:r,name:(a==null?void 0:a.name)||(r===((s=l.currentUser)==null?void 0:s.uid)?"Yo":"Usuario"),color:(a==null?void 0:a.color)||"#64748b"}}).sort((r,a)=>r.name.localeCompare(a.name,"es"));if(!n.length){t.innerHTML='<div class="muted">Cargando integrantes…</div>';return}t.innerHTML=n.map(r=>`
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color};display:inline-block;"></span>
        <span style="font-weight:800">${ge(r.name)}</span>
      </div>
    `).join("")}function Gi(){var i,o,c;const e=document.getElementById("simModal");e&&e.remove();const t=document.createElement("div");t.id="simModal",t.style.cssText=`
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
    `,document.body.appendChild(t);const n=t,r=d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())},a=()=>{n.style.display="none",Le=!1,Ne=null,pe=null,document.removeEventListener("keydown",r),document.documentElement.classList.remove("sim-lock"),document.body.classList.remove("sim-lock"),pt(),document.dispatchEvent(new Event("courses:changed"))};(i=document.getElementById("simExportBtn"))==null||i.addEventListener("click",async d=>{var m,g;if(d.preventDefault(),d.stopPropagation(),!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo.");return}if(!await dt({title:"Exportar simulación",text:"¿Quieres exportar esta simulación a tu semestre?",yesText:"Sí, exportar",noText:"Cancelar"}))return;const f=document.getElementById("simExportBtn");f&&(f.disabled=!0,f.textContent="Exportando...");try{await Wi(),Ia(),pe=null,re=[],W=[],(m=Z.clear)==null||m.call(Z),(g=K.clear)==null||g.call(K),Ne=null,An="",Oe=!1,a(),await me(),alert("✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.")}catch(b){console.error(b),alert("No se pudo exportar la simulación. Revisa consola.")}finally{f&&(f.disabled=!1,f.textContent="Exportar a mi horario")}}),(o=document.getElementById("simDeleteBtn"))==null||o.addEventListener("click",async d=>{var f,m;d.preventDefault(),d.stopPropagation(),await dt({title:"Eliminar simulación",text:"Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?",yesText:"Sí, eliminar",noText:"Cancelar"})&&(Ia(),pe=null,re=[],W=[],(f=Z.clear)==null||f.call(Z),(m=K.clear)==null||m.call(K),Ne=null,An="",Oe=!1,a())});const s=async()=>{if(!await dt({title:"Salir del simulador",text:"¿Quieres salir del simulador?",yesText:"Sí, salir",noText:"Cancelar"}))return;const p=as(),f=await wi({title:"Salir del simulador",message:p?"Tienes cambios sin guardar. ¿Qué quieres hacer?":"No hiciste cambios. ¿Cómo quieres salir?",saveText:"Guardar y salir",discardText:"Salir sin guardar",cancelText:"Cancelar"});if(f!=="cancel"){if(f==="save"){Ji(),a();return}if(f==="discard"){xi(Ne,{persist:!0}),Oe=!1,zn(),me(),a();return}}};(c=document.getElementById("simX"))==null||c.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),s()}),n.addEventListener("click",d=>{d.target===n&&s()}),document.addEventListener("keydown",d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())})}function Vi(e,t){const n=W.filter(r=>r.day===e&&r.slot===t);return n.length?ps(n,!0):""}async function vr(e,t){const r=(Z.get(e)||[]).find(c=>c.pid===t);if(!r)return;const a=pe||await Ut();if(!a)return;W=W.filter(c=>c.courseId!==e);const i=(((re||[]).find(c=>c.id===e)||(l.courses||[]).find(c=>c.id===e)||{}).name||"Ramo").trim(),o=r.section||t;for(const c of r.blocks||[]){const d=a==null?void 0:a[c.slot];!d||d.lunch||W.push({courseId:e,day:c.day,slot:c.slot,start:d.start,end:d.end,pos:c.pos||"full",hpos:c.hpos||"single",pid:t,displayName:`${i} · ${o}`})}K.set(e,t),qn(),$e(),Ke(),await _e()}async function _e(){const e=document.getElementById("simGridHost");if(!e)return;const t=pe||await Ut();if(!t){e.innerHTML=`
        <div style="text-align:center; padding:18px;">
          <div style="font-weight:900; margin-bottom:6px;">No hay horario base para esta universidad</div>
          <div class="muted" style="opacity:.8;">Crea un horario personalizado en la vista normal.</div>
        </div>
      `;return}const n=gt(),r=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${r}</div>
        ${Pe.map(a=>`<div class="cell header">${a}</div>`).join("")}
        ${t.map((a,s)=>`
          <div class="cell mod ${a.lunch?"lunch":""}" data-slot="${s}">
            ${jn(a,s,n)}
          </div>
          ${Pe.map((i,o)=>`
            <div class="cell slot ${a.lunch?"is-lunch":""}"
                data-day="${o}" data-slot="${s}"
                ${a.lunch?'aria-disabled="true"':""}
                style="${a.lunch?"pointer-events:none; opacity:.65;":""}">
                ${Vi(o,s)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `,jr()}async function fs(){var i,o,c;if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo antes de usar el simulador.");return}const e=vi();if(e&&Array.isArray(e)&&e.length)pe=e;else{const d=await Si();if(!d)return;pe=d,Fr(pe)}lr=!1,Gi();const t=document.getElementById("simModal"),n=document.getElementById("simModalPanel");document.documentElement.classList.add("sim-lock"),document.body.classList.add("sim-lock"),t.style.display="flex",Le=!0,re=Mi(),W=gi(),Array.isArray(W)||(W=[]);const r=bi();(i=Z.clear)==null||i.call(Z);for(const[d,p]of r.entries())Z.set(d,p||[]);const a=hi();(o=K.clear)==null||o.call(K);for(const[d,p]of a.entries())p&&K.set(d,p);document.dispatchEvent(new Event("courses:changed"));const s=document.getElementById("simActiveSemLabel");if(s){const d=((c=l.activeSemesterData)==null?void 0:c.label)||l.activeSemesterId||"—";s.textContent=d}await _e(),Ke(),requestAnimationFrame(()=>{n&&(n.scrollTop=0)}),Ne=Dr(),An=Ne,Oe=!1}async function Wi(){if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo.");return}const e=l.currentUser.uid,t=l.activeSemesterId,n=gt()||"UNI_desconocida",r=pe||await Ut();if(!r||!Array.isArray(r)||!r.length){alert("No hay slots para guardar la simulación.");return}try{be[n]=r,localStorage.setItem(`custom_slots_${n}_${e}`,JSON.stringify(r)),await ms(n,r)}catch(v){console.warn("No se pudo persistir slots base",v)}const a=T(k,"users",e,"semesters",t,"courses"),s=T(k,"users",e,"semesters",t,"schedule"),[i,o]=await Promise.all([F(Q(a)),F(Q(s))]),c=i.docs.map(v=>({id:v.id,...v.data()})),d=o.docs.map(v=>({id:v.id,...v.data()})),p=c.length>0;let f=!0;p&&(f=!!await dt({title:"Exportar simulación",text:`Ya tienes ramos guardados en este semestre.

¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?`,yesText:"Sí, borrar anteriores",noText:"No, que convivan"})),f&&(await br(s),await br(a));const m=f?[]:c,g=f?[]:d,b=new Map;for(const v of m){const I=Rt((v==null?void 0:v.code)||(v==null?void 0:v.codigo)||"");I&&(b.has(I)||b.set(I,new Set),b.get(I).add(v.id))}const y=new Map;for(const v of m){const I=Rt((v==null?void 0:v.name)||(v==null?void 0:v.nombre)||"");I&&y.set(I,v.id)}const h=new Map,w=(re||[]).filter(v=>String(v.id||"").startsWith("SIM_"));for(const v of w){const I={name:(v.name||"").trim()||"Ramo",code:(v.code||"").trim()||"",professor:v.professor||"",section:v.section||"",color:vt(v.color)?v.color:"#3B82F6",asistencia:!!v.asistencia,createdAt:Date.now()},E=Rt(I.code);if(!f&&E&&b.has(E)){const L=Array.from(b.get(E)||[]);if(L.length){const U=(await F(Q(s))).docs.filter(B=>{var P;return L.includes((P=B.data())==null?void 0:P.courseId)});for(const B of U)await ye(B.ref);for(const B of L){await ye($(k,"users",e,"semesters",t,"courses",B));for(const[P,_]of y.entries())_===B&&y.delete(P)}}b.delete(E)}if(!f&&!E){const L=Rt(I.name),M=y.get(L);if(M){h.set(v.id,M);continue}}const x=await Ce(a,I);E&&(b.has(E)||b.set(E,new Set),b.get(E).add(x.id)),h.set(v.id,x.id);const S=Rt(I.name);S&&y.set(S,x.id)}const C=await F(Q(a,ve("createdAt")));l.courses=C.docs.map(v=>({id:v.id,...v.data()})),document.dispatchEvent(new Event("courses:changed"));const A=v=>{const I=String(v.courseId||""),E=Number(v.day),x=Number(v.slot),S=String(v.pos||"full"),L=String(v.hpos||"single"),M=String(v.pid||v.parallelPid||""),U=String(v.displayName||"").trim(),B=String(v.start||""),P=String(v.end||"");return[I,E,x,S,L,M,U,B,P].join("|")},N=new Set((g||[]).map(v=>A({courseId:v.courseId,day:v.day,slot:v.slot,pos:v.pos,hpos:v.hpos,pid:v.parallelPid,displayName:v.displayName,start:v.start,end:v.end})));for(const v of W||[]){const I=h.get(v.courseId)||v.courseId;if(String(I).startsWith("SIM_"))continue;const E=r[v.slot];if(!E||E.lunch)continue;const x={courseId:I,day:v.day,slot:v.slot,start:E.start,end:E.end,pos:v.pos||"full",hpos:v.hpos||"single",parallelPid:v.pid||v.parallelPid||null,displayName:typeof v.displayName=="string"&&v.displayName.trim()?v.displayName.trim():null,createdAt:Date.now()};if(!f){const S=A(x);if(N.has(S))continue;N.add(S)}await Ce(s,x)}}function Rt(e){return String(e||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}async function br(e){const t=await F(e);for(const n of t.docs)await ye(n.ref)}function Ji(){Fr(pe),Yn(re),us(),zr(),qn(),Ne=Dr(),An=Ne,Oe=!1}function Ia(){try{localStorage.removeItem(Rr())}catch{}try{localStorage.removeItem(qr())}catch{}try{localStorage.removeItem(Or())}catch{}try{localStorage.removeItem(Hr())}catch{}try{localStorage.removeItem(_r())}catch{}try{localStorage.removeItem(Gr())}catch{}}const Aa=Object.freeze(Object.defineProperty({__proto__:null,MAYOR_SLOTS:en,USM_SLOTS:yt,getMySchedule:Pi,initSchedule:is,onActiveSemesterChanged:Dt,openSimSchedule:fs,overlapWithPair:Ti,refreshCourseOptions:li,removeBlock:Ui,setRoom:$i},Symbol.toStringTag,{value:"Module"}));let Y=new Date,ot=null,Vt=[],hr=[],Lt={course:!0,personal:!0},xr=!1,Ft=null,En=null,Cn=null,it=null,Wt=[],qt="#ff69b4",mt=null;const wr=new Map,kt=new Map;function Ki(e){Ft=e}function Zi(){try{Ft==null||Ft()}finally{Ft=null}}function Qi(){ws();const e=u("page-calendario");if(e){e.classList.add("hidden");const t=e.querySelector("[data-cal-grid]")||e.querySelector(".cal-grid");t&&(t.innerHTML="")}}function Xi(){var e;(e=u("page-calendario"))==null||e.classList.remove("hidden")}function el(){return Me(qt)?qt:"#ff69b4"}function Gn(){const e=l.profileData||{},t=l.currentUser||{};return typeof e.favoriteColor=="string"&&Me(e.favoriteColor)?e.favoriteColor:typeof t.favoriteColor=="string"&&Me(t.favoriteColor)?t.favoriteColor:"#3B82F6"}function Me(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function tl(e,t="#3B82F6"){if(!e)return t;const n=(l.courses||[]).find(r=>r.id===e);return Me(n==null?void 0:n.color)?n.color:t}function nl(e,t=Gn()){if(e!=null&&e.courseId){const n=(l.courses||[]).find(r=>r.id===e.courseId);if(Me(n==null?void 0:n.color))return n.color}return Me(e==null?void 0:e.color)?e.color:t}function Wr(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}function ys(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return ys(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function gs(){var r,a,s,i;const e=(r=l.currentUser)==null?void 0:r.uid,t=[l.partyMembers,l.party,l.partyData,l.activeParty,(a=l.shared)==null?void 0:a.party,(s=l.shared)==null?void 0:s.partyData,(i=l.shared)==null?void 0:i.partyMembers];let n=[];for(const o of t)if(n=ys(o),n.length)break;return[...new Set(n.filter(Boolean))].filter(o=>o!==e)}const he=Object.create(null);function Jt(e={},t={}){return typeof t.displayName=="string"&&t.displayName.trim()?t.displayName.trim():typeof t.name=="string"&&t.name.trim()?t.name.trim():typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():typeof e.name=="string"&&e.name.trim()?e.name.trim():"Usuario"}function Kt(e={},t={}){return typeof t.favoriteColor=="string"&&Me(t.favoriteColor)?t.favoriteColor:typeof e.favoriteColor=="string"&&Me(e.favoriteColor)?e.favoriteColor:"#64748b"}async function vs(e){if(!e)return{name:"Usuario",favoriteColor:"#64748b"};if(he[e])return he[e];try{const t=$(k,"users",e),n=$(k,"users",e,"profile","profile"),[r,a]=await Promise.all([ee(t),ee(n)]),s=r.exists()?r.data()||{}:{},i=a.exists()?a.data()||{}:{},o={name:Jt(s,i),favoriteColor:Kt(s,i)};return he[e]=o,o}catch(t){return console.warn("cal_loadMemberProfile error",t),he[e]={name:"Usuario",favoriteColor:"#64748b"},he[e]}}async function rl(){const e=gs();if(!e.length)return[];const t=await Promise.all(e.map(n=>vs(n)));return e.map((n,r)=>{var a,s;return{uid:n,name:((a=t[r])==null?void 0:a.name)||"Usuario",favoriteColor:((s=t[r])==null?void 0:s.favoriteColor)||"#64748b"}})}async function Ze(){const e=u("calendarPartyPicker");if(!e)return;const t=await rl();if(!t.length){e.innerHTML='<div class="muted">No hay integrantes disponibles en tu party.</div>';return}e.innerHTML=t.map(n=>{const r=n.uid===mt;return`
      <button
        class="calendar-party-chip ${r?"active":""}"
        data-uid="${n.uid}"
        style="
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:16px;
          border:${r?"2px solid rgba(139,156,251,0.95)":"1px solid rgba(255,255,255,0.12)"};
          background:${r?"rgba(99,102,241,0.22)":"rgba(10,14,35,0.9)"};
          color:#fff;
          cursor:pointer;
          min-width:120px;
          box-shadow:${r?"0 0 0 2px rgba(255,255,255,0.08) inset":"none"};
        "
      >
        <span style="
  width:14px;
  height:14px;
  border-radius:999px;
  background:${n.favoriteColor||"#64748b"};
  flex:0 0 auto;
"></span>
        <span style="font-weight:600;">${n.name}</span>
      </button>
    `}).join(""),e.querySelectorAll(".calendar-party-chip").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.uid;r&&(mt=r,await Ze(),await Qt())})})}function al(){const e=u("calFilterBtn"),t=u("calFilterMenu"),n=u("calFilterChkCourse"),r=u("calFilterChkPersonal");if(!e||!t||!n||!r)return;const a=()=>{n.checked=!!Lt.course,r.checked=!!Lt.personal};e.addEventListener("click",s=>{s.stopPropagation(),t.classList.toggle("hidden"),a()}),n.addEventListener("change",()=>{Lt.course=!!n.checked,Qe()}),r.addEventListener("change",()=>{Lt.personal=!!r.checked,Qe()}),document.addEventListener("click",s=>{!t.contains(s.target)&&s.target!==e&&t.classList.add("hidden")}),a()}function bs(){xr||(xr=!0,ol(),il(),al(),Jr(),jt(),Nt(),He(),hs(),xs(),document.addEventListener("pair:ready",async()=>{await Ze(),await Qt()}),document.addEventListener("pair:ready",async()=>{await Pn(),At()}),document.addEventListener("profile:changed",()=>{Qe(),we()}),document.addEventListener("profile:ready",()=>{Qe(),we()}),Ze(),Qt(),Pn(),ll())}function Zt(){xr||bs()}function ut(){Zt(),ot&&(ot(),ot=null),hs(),xs(),jt(),He(),At(),mt&&Qt(),Pn()}function sl(){Zt(),Qe(),Nt(),$t(),we()}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",Zt):Zt();document.addEventListener("route:calendario",Zt);function ol(){const e=u("page-calendario");e&&(e.innerHTML=`
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
  `)}function il(){var e,t,n,r;(e=u("calPrev"))==null||e.addEventListener("click",()=>{Y=$a(Y,-1),mn(),jt(),He(),At()}),(t=u("calNext"))==null||t.addEventListener("click",()=>{Y=$a(Y,1),mn(),jt(),He(),At()}),(n=u("calToday"))==null||n.addEventListener("click",()=>{Y=new Date,mn(),jt(),He(),At()}),(r=u("calImportGoogle"))==null||r.addEventListener("click",pl),mn()}function mn(){const e=Y.getFullYear(),t=Y.getMonth(),n=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],r=u("calTitle");r&&(r.textContent=`Calendario · ${n[t][0].toUpperCase()}${n[t].slice(1)} ${e}`)}function hs(){var t;const e=u("calActiveSem");e&&(e.textContent=((t=l.activeSemesterData)==null?void 0:t.label)||"—")}function ll(){const e=u("cal-subtab-propio"),t=u("cal-subtab-compartido"),n=u("cal-subtab-combinado"),r=u("cal-propio"),a=u("cal-compartido"),s=u("cal-combinado");function i(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function o(){if(t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await Ze(),He(),!mt){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}u("calSharedHint").textContent="",await Qt()}async function c(){await Pn(),n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),At(),await yl()}e==null||e.addEventListener("click",i),t==null||t.addEventListener("click",o),n==null||n.addEventListener("click",c),i()}function xs(){if(ot&&(ot(),ot=null),Vt=[],hr=[],Qe(),Nt(),!l.currentUser||!l.activeSemesterId)return;const e=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");ot=G(Q(e,ve("date","asc")),n=>{Vt=n.docs.map(r=>({id:r.id,...r.data()})),Qe(),Nt()});const t=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");G(Q(t,ve("name","asc")),n=>{hr=n.docs.map(r=>({id:r.id,...r.data()})),Nt()})}async function Qt(){Sr(),Wt=[],qt="#ff69b4",He();const e=mt;if(!e){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}if(!await Hn(e,"calendario")){Sr(),Wt=[],He();const s=u("calSharedGrid");s&&(s.innerHTML=Tr("su calendario")),u("calSharedHint").textContent="";return}if(u("calSharedHint").textContent="",!await cl())return;it&&(it(),it=null);const r=G($(k,"users",e),async s=>{const i=s.exists()?s.data()||{}:{},o=he[e]||{},c={displayName:i.displayName,name:i.name,favoriteColor:i.favoriteColor},d={displayName:o._profDisplayName,name:o._profName,favoriteColor:o._profFavoriteColor},p={name:Jt(c,d),favoriteColor:Kt(c,d),_rootDisplayName:i.displayName||null,_rootName:i.name||null,_rootFavoriteColor:i.favoriteColor||null,_profDisplayName:o._profDisplayName||null,_profName:o._profName||null,_profFavoriteColor:o._profFavoriteColor||null};he[e]=p,Me(p.favoriteColor)&&(qt=p.favoriteColor),$t(),we(),await Ze()}),a=G($(k,"users",e,"profile","profile"),async s=>{const i=s.exists()?s.data()||{}:{},o=he[e]||{},c={displayName:o._rootDisplayName,name:o._rootName,favoriteColor:o._rootFavoriteColor},d={displayName:i.displayName,name:i.name,favoriteColor:i.favoriteColor},p={name:Jt(c,d),favoriteColor:Kt(c,d),_rootDisplayName:o._rootDisplayName||null,_rootName:o._rootName||null,_rootFavoriteColor:o._rootFavoriteColor||null,_profDisplayName:i.displayName||null,_profName:i.name||null,_profFavoriteColor:i.favoriteColor||null};he[e]=p,Me(p.favoriteColor)&&(qt=p.favoriteColor),$t(),we(),await Ze()});it=()=>{try{r==null||r()}catch{}try{a==null||a()}catch{}}}function Sr(){En&&(En(),En=null),Cn&&(Cn(),Cn=null),it&&(it(),it=null)}function ws(){for(const[,e]of wr.entries())try{e==null||e()}catch{}wr.clear(),kt.clear()}async function Pn(){var n;ws();const e=gs();if(!e.length){we();return}const t=((n=l.activeSemesterData)==null?void 0:n.label)||null;if(!t){we();return}for(const r of e)try{if(!await Hn(r,"calendario")){kt.set(r,[]);continue}await vs(r);const s=G($(k,"users",r),async f=>{const m=f.exists()?f.data()||{}:{},g=he[r]||{},b={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor},y={displayName:g._profDisplayName,name:g._profName,favoriteColor:g._profFavoriteColor};he[r]={name:Jt(b,y),favoriteColor:Kt(b,y),_rootDisplayName:m.displayName||null,_rootName:m.name||null,_rootFavoriteColor:m.favoriteColor||null,_profDisplayName:g._profDisplayName||null,_profName:g._profName||null,_profFavoriteColor:g._profFavoriteColor||null},we(),await Ze()}),i=G($(k,"users",r,"profile","profile"),async f=>{const m=f.exists()?f.data()||{}:{},g=he[r]||{},b={displayName:g._rootDisplayName,name:g._rootName,favoriteColor:g._rootFavoriteColor},y={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor};he[r]={name:Jt(b,y),favoriteColor:Kt(b,y),_rootDisplayName:g._rootDisplayName||null,_rootName:g._rootName||null,_rootFavoriteColor:g._rootFavoriteColor||null,_profDisplayName:m.displayName||null,_profName:m.name||null,_profFavoriteColor:m.favoriteColor||null},we(),await Ze()}),o=T(k,"users",r,"semesters"),c=await F(o);let d=null;c.forEach(f=>{var g;(((g=f.data())==null?void 0:g.label)||"").trim()===t&&(d=f.id)});let p=null;if(d){const f=T(k,"users",r,"semesters",d,"calendar");p=G(Q(f,ve("date","asc")),m=>{kt.set(r,m.docs.map(g=>({id:g.id,...g.data(),ownerUid:r}))),we()})}else kt.set(r,[]),we();wr.set(r,()=>{try{s==null||s()}catch{}try{i==null||i()}catch{}try{p==null||p()}catch{}})}catch(a){console.warn("subscribeCombinedPartyMembers error",r,a),kt.set(r,[])}we()}async function cl(){var n;const e=mt;if(!e)return null;const t=((n=l.activeSemesterData)==null?void 0:n.label)||null;if(!t)return u("calSharedHint").textContent="No tienes semestre activo seleccionado.",null;try{const r=T(k,"users",e,"semesters"),a=await F(r);let s=null;if(a.forEach(o=>{var d;const c=(((d=o.data())==null?void 0:d.label)||"").trim();c===t&&(s={id:o.id,label:c})}),l.shared=l.shared||{},l.shared.calendar=l.shared.calendar||{},s)return l.shared.calendar.semId=s.id,u("calSharedHint").textContent="",await dl(s.id),s.id;l.shared.calendar.semId=null;const i=u("calSharedGrid");return i&&(i.innerHTML=`<div class="muted">Esta persona no tiene el semestre <b>${t}</b> creado.</div>`),u("calSharedHint").textContent="Se intenta mostrar el mismo semestre activo que tienes tú.",null}catch(r){return console.error("populateSharedSemesters error",r),u("calSharedHint").textContent="Error al cargar el calendario compartido.",null}}async function dl(e){Sr(),Wt=[],He();const t=mt;if(!t||!e)return;const n=T(k,"users",t,"semesters",e,"courses");Cn=G(Q(n,ve("name")),a=>{a.docs.map(s=>({id:s.id,...s.data()})),$t()});const r=T(k,"users",t,"semesters",e,"calendar");En=G(Q(r,ve("date","asc")),a=>{Wt=a.docs.map(s=>({id:s.id,...s.data()})),$t()})}function Jr(){if(u("calModal"))return;const e=document.createElement("div");e.id="calModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("calModalBackdrop").addEventListener("click",t),u("calEvtCancel").addEventListener("click",t);const n=u("calEvtCourse"),r=u("calEvtIsPersonal");function a(){!n||!r||(r.checked?(n.value="",n.disabled=!0,n.style.opacity="0.6"):(n.disabled=!1,n.style.opacity="1"))}r==null||r.addEventListener("change",a),n==null||n.addEventListener("change",()=>{n.value&&(r.checked=!1,a())}),u("calEvtSave").addEventListener("click",async()=>{var w;if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}const s=(u("calEvtTitle").value||"").trim(),i=u("calEvtDate").value||"",o=u("calEvtStart").value||null,c=u("calEvtEnd").value||null,d=!!((w=u("calEvtIsPersonal"))!=null&&w.checked),p=d?null:u("calEvtCourse").value||null,f=u("calEvtRepeat").value||"",m=u("calEvtPersistent").value==="true",g=d?"personal":"course",b=p?tl(p):Gn();if(!s)return alert("Ingresa un título.");if(!i)return alert("Selecciona una fecha.");const y=e.dataset.editingId||null,h=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");try{y?(await ae($(h,y),{title:s,date:i,start:o,end:c,courseId:p,kind:g,color:b,repeat:f?{every:f,interval:1}:null,persistent:m,updatedAt:Date.now()}),console.log("[Calendar] Evento actualizado:",s)):(await Ce(h,{title:s,date:i,start:o,end:c,courseId:p,kind:g,color:b,repeat:f?{every:f,interval:1}:null,persistent:m,createdAt:Date.now()}),console.log("[Calendar] Evento creado:",s)),t()}catch(C){console.error(C),alert("No se pudo guardar el evento.")}finally{e.dataset.editingId=""}})}function ul(){if(u("gcalImportModal"))return;const e=document.createElement("div");e.id="gcalImportModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("gcalImportBackdrop").addEventListener("click",t),u("gcalRangeCancel").addEventListener("click",t),u("gcalRangeConfirm").addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}const n=u("gcalRangeStart").value,r=u("gcalRangeEnd").value;if(!n||!r){alert("Selecciona ambas fechas (inicio y término).");return}const[a,s,i]=n.split("-").map(Number),[o,c,d]=r.split("-").map(Number),p=new Date(a,s-1,i,0,0,0),f=new Date(o,c-1,d+1,0,0,0);if(f<=p){alert("La fecha de término debe ser posterior a la de inicio.");return}try{await Ul(p,f),t()}catch(m){console.error("Error al importar rango desde Google Calendar:",m),alert("Ocurrió un error al importar eventos de Google Calendar.")}})}function pl(){if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}ul();const e=Y.getFullYear(),t=Y.getMonth(),n=new Date(e,t+1,0).getDate(),r=u("gcalRangeStart"),a=u("gcalRangeEnd");r&&!r.value&&(r.value=Ie(e,t+1,1)),a&&!a.value&&(a.value=Ie(e,t+1,n)),u("gcalImportModal").classList.add("active")}function ml(e){if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}Jr();const t=u("calModal"),n=u("calModalTitle"),r=u("calEvtSave");t&&(t.dataset.editingId=""),n&&(n.textContent="Nuevo evento"),r&&(r.textContent="Guardar");const a=u("calEvtDate");a&&(a.value=e);const s=u("calEvtTitle");s&&(s.value="");const i=u("calEvtStart");i&&(i.value="");const o=u("calEvtEnd");o&&(o.value="");const c=u("calEvtCourse");c&&(c.innerHTML='<option value="">(Sin asignar)</option>',(l.courses||[]).forEach(p=>{const f=document.createElement("option");f.value=p.id,f.textContent=p.name,c.appendChild(f)}));const d=u("calEvtIsPersonal");d&&(d.checked=!1),c&&(c.disabled=!1,c.style.opacity="1"),u("calModal").classList.add("active")}function Kr(){const e=new Date;return Ie(e.getFullYear(),e.getMonth()+1,e.getDate())}function jt(){const e=u("calGrid");if(!e)return;const n=(new Date(Y.getFullYear(),Y.getMonth(),1).getDay()+6)%7,r=new Date(Y.getFullYear(),Y.getMonth()+1,0).getDate(),a=Kr(),s=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${s.map(i=>`<div class="cal-cell head">${i}</div>`).join("")}

    ${Array.from({length:n}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join("")}

    ${Array.from({length:r}).map((i,o)=>{const c=o+1,d=Ie(Y.getFullYear(),Y.getMonth()+1,c),p=d===a;return`
        <div class="cal-cell day ${p?"cal-today":""}" data-date="${d}">
          <div class="cal-daytop">
            <div class="cal-daynum">${c}</div>
            ${p?'<span class="cal-today-badge">Hoy</span>':""}
          </div>
          <div class="cal-events" id="ce-${d}"></div>
        </div>
      `}).join("")}
  `,e.querySelectorAll(".cal-cell.day").forEach(i=>{i.addEventListener("click",()=>ml(i.dataset.date))}),Qe(),Nt()}function fl(e){var o;if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}Jr();const t=u("calModal"),n=u("calModalTitle"),r=u("calEvtSave");t.dataset.editingId=e.id,n.textContent="Editar evento",r.textContent="Guardar cambios",u("calEvtTitle").value=e.title||"",u("calEvtDate").value=e.date||"",u("calEvtStart").value=e.start||"",u("calEvtEnd").value=e.end||"",u("calEvtRepeat").value=((o=e.repeat)==null?void 0:o.every)||"",u("calEvtPersistent").value=e.persistent?"true":"";const a=u("calEvtCourse");a.innerHTML='<option value="">(Sin asignar)</option>',(l.courses||[]).forEach(c=>{const d=document.createElement("option");d.value=c.id,d.textContent=c.name,c.id===e.courseId&&(d.selected=!0),a.appendChild(d)});const s=u("calEvtIsPersonal"),i=e.kind||(e.courseId?"course":"personal");s&&(s.checked=i==="personal"),a&&(i==="personal"?(a.value="",a.disabled=!0,a.style.opacity="0.6"):(a.disabled=!1,a.style.opacity="1")),t.classList.add("active")}function He(){const e=u("calSharedGrid");if(!e)return;const n=(new Date(Y.getFullYear(),Y.getMonth(),1).getDay()+6)%7,r=new Date(Y.getFullYear(),Y.getMonth()+1,0).getDate(),a=Kr(),s=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${s.map(i=>`<div class="cal-cell head">${i}</div>`).join("")}

    ${Array.from({length:n}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join("")}

    ${Array.from({length:r}).map((i,o)=>{const c=o+1,d=Ie(Y.getFullYear(),Y.getMonth()+1,c),p=d===a;return`
        <div class="cal-cell day ${p?"cal-today":""}" data-date="${d}">
          <div class="cal-daytop">
            <div class="cal-daynum">${c}</div>
            ${p?'<span class="cal-today-badge">Hoy</span>':""}
          </div>
          <div class="cal-events" id="sce-${d}"></div>
        </div>
      `}).join("")}
  `,$t()}function At(){const e=u("calCombinedGrid");if(!e)return;const n=(new Date(Y.getFullYear(),Y.getMonth(),1).getDay()+6)%7,r=new Date(Y.getFullYear(),Y.getMonth()+1,0).getDate(),a=Kr(),s=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${s.map(i=>`<div class="cal-cell head">${i}</div>`).join("")}

    ${Array.from({length:n}).map(()=>`
      <div class="cal-cell empty"></div>
    `).join("")}

    ${Array.from({length:r}).map((i,o)=>{const c=o+1,d=Ie(Y.getFullYear(),Y.getMonth()+1,c),p=d===a;return`
        <div class="cal-cell day ${p?"cal-today":""}" data-date="${d}">
          <div class="cal-daytop">
            <div class="cal-daynum">${c}</div>
            ${p?'<span class="cal-today-badge">Hoy</span>':""}
          </div>
          <div class="cal-events" id="bce-${d}"></div>
        </div>
      `}).join("")}
  `,we()}function we(){document.querySelectorAll(".cal-events").forEach(a=>{var s;(s=a.id)!=null&&s.startsWith("bce-")&&(a.innerHTML="")});const e=`${Y.getFullYear()}-${String(Y.getMonth()+1).padStart(2,"0")}`,t=Vt.filter(a=>String(a.date||"").startsWith(e)).map(a=>{var s;return{...a,isMine:!0,ownerUid:((s=l.currentUser)==null?void 0:s.uid)||null}}),n=[];for(const[a,s]of kt.entries())for(const i of s||[])String(i.date||"").startsWith(e)&&n.push({...i,isMine:!1,ownerUid:a});[...t,...n].forEach(a=>{const s=u("bce-"+a.date);if(!s)return;let i="#64748b";if(a.isMine)i=Gn();else{const p=he[a.ownerUid]||{};i=Me(p.favoriteColor)?p.favoriteColor:"#64748b"}const o=Wr(i),c=a.start&&a.end?`${a.start}–${a.end} · `:a.start?`${a.start} · `:"",d=document.createElement("div");d.className="cal-evt",d.textContent=`${c}${a.title||"(sin título)"}`,d.style.background=i,d.style.color=o,d.style.opacity=a.isMine?1:.75,d.style.border="1px solid rgba(0,0,0,0.25)",s.appendChild(d)})}async function yl(){const e=u("calCombinedRemindersList");if(e){e.innerHTML='<div class="loading"></div>';try{const t=await Ss({range:"today"}),n=l.pairOtherUid?await Es({range:"today"}):[],r=[...t.map(a=>({...a,owner:"Tú"})),...n.map(a=>({...a,owner:"Dúo"}))].sort((a,s)=>(a.datetime||0)-(s.datetime||0));e.innerHTML=r.length?r.map(a=>{var s;return`
          <div class="grade-item">
            <div>
              <strong>${a.title||"(sin título)"}</strong>
              <div class="muted">${a.owner} · ${((s=a.datetime)==null?void 0:s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))||""}</div>
            </div>
          </div>
        `}).join(""):'<div class="muted">Sin recordatorios para hoy.</div>'}catch(t){console.error("loadCombinedReminders",t),e.innerHTML='<div class="muted">Error al cargar recordatorios.</div>'}}}function gl(e){const[t,n,r]=String(e||"").split("-").map(Number);return!t||!n||!r?null:{y:t,m:n,d:r}}function Na(e,t){return new Date(e,t,0).getDate()}function vl(e,t,n){const r=gl(e);if(!r)return null;let a=r.y,s=r.m,i=r.d;if(t==="day"){const o=new Date(a,s-1,i);return o.setDate(o.getDate()+n),Ie(o.getFullYear(),o.getMonth()+1,o.getDate())}if(t==="month"){const o=a*12+(s-1)+n;return a=Math.floor(o/12),s=o%12+1,i=Math.min(r.d,Na(a,s)),Ie(a,s,i)}return t==="year"?(a=r.y+n,i=Math.min(r.d,Na(a,s)),Ie(a,s,i)):null}function bl(e){var n;const t=[];for(const r of e){if(t.push(r),!((n=r.repeat)!=null&&n.every))continue;const a=r.repeat.every,s=Number(r.repeat.interval||1);for(let i=1;i<=24;i++){const o=vl(r.date,a,i*s);o&&t.push({...r,date:o})}}return t}function Nt(){const e=u("calLegend");if(!e)return;const t=(hr||[]).filter(n=>(n==null?void 0:n.name)&&Me(n==null?void 0:n.color)).map(n=>({id:n.id,name:n.name,color:n.color}));if(!t.length){e.innerHTML="";return}e.innerHTML=`
    <div style="
      width:100%;
      margin-top:2px;
      margin-bottom:4px;
      color:#cbd5e1;
      font-size:13px;
      font-weight:600;
    ">
    </div>

    ${t.map(n=>`
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
          background:${n.color};
          display:inline-block;
          flex:0 0 auto;
          border:1px solid rgba(255,255,255,0.18);
        "></span>
        <span>${n.name}</span>
      </div>
    `).join("")}
  `}function hl(e){return new Promise(t=>{var a,s,i;(a=document.getElementById("calDeleteModal"))==null||a.remove();const n=document.createElement("div");n.id="calDeleteModal",n.style.cssText=`
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
          ¿Eliminar "<b>${e||"evento"}</b>"?
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
          <button id="calDeleteCancel" class="ghost">Cancelar</button>
          <button id="calDeleteConfirm" class="primary" style="background:#ef4444;border:none;">
            Eliminar
          </button>
        </div>
      </div>
    `,document.body.appendChild(n);const r=o=>{n.remove(),t(o)};(s=n.querySelector("#calDeleteCancel"))==null||s.addEventListener("click",()=>r(!1)),(i=n.querySelector("#calDeleteConfirm"))==null||i.addEventListener("click",()=>r(!0)),n.addEventListener("click",o=>{o.target===n&&r(!1)})})}function Qe(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")||(n.innerHTML="")});const e=`${Y.getFullYear()}-${String(Y.getMonth()+1).padStart(2,"0")}`;let t=bl(Vt).filter(n=>String(n.date||"").startsWith(e));t=t.filter(n=>{const r=n.kind||(n.courseId?"course":"personal");return!(r==="course"&&!Lt.course||r==="personal"&&!Lt.personal)}),t.forEach(n=>{const r=u("ce-"+n.date);if(!r)return;const a=nl(n,Gn()),s=Wr(a),i=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",o=document.createElement("div");o.className="cal-evt",o.style.background=a,o.style.color=s,o.style.border="1px solid rgba(0,0,0,0.25)",o.style.position="relative",o.style.cursor="pointer";const c=document.createElement("span");c.textContent=`${i}${n.title||"(sin título)"}`,o.appendChild(c);const d=document.createElement("span");d.textContent="✕",d.className="cal-del",d.title="Eliminar evento",d.style.position="absolute",d.style.top="2px",d.style.right="4px",d.style.fontWeight="bold",d.style.color="#fff8",d.style.cursor="pointer",d.addEventListener("click",async p=>{if(p.stopPropagation(),!(!l.currentUser||!l.activeSemesterId||!n.id||!await hl(n.title)))try{await ye($(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar",n.id))}catch(m){console.error(m)}}),o.appendChild(d),o.addEventListener("click",p=>{p.stopPropagation(),fl(n)}),r.appendChild(o)})}function $t(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")&&(n.innerHTML="")});const e=`${Y.getFullYear()}-${String(Y.getMonth()+1).padStart(2,"0")}`;Wt.filter(n=>String(n.date||"").startsWith(e)).forEach(n=>{const r=u("sce-"+n.date);if(!r)return;const a=el(),s=Wr(a),i=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",o=document.createElement("div");o.className="cal-evt",o.textContent=`${i}${n.title||"(sin título)"}`,o.style.background=a,o.style.color=s,o.style.border="1px solid rgba(0,0,0,0.25)",r.appendChild(o)})}function $a(e,t){return new Date(e.getFullYear(),e.getMonth()+t,1)}function Ie(e,t,n){return`${e}-${String(t).padStart(2,"0")}-${String(n).padStart(2,"0")}`}async function Ss(e={}){if(!l.currentUser)throw new Error("No logueado");const{range:t="today",dates:n,months:r,years:a,ranges:s}=e,i=T(k,"users",l.currentUser.uid,"reminders");let c=(await F(i)).docs.map(p=>{const f=p.data();return{id:p.id,...f,datetime:Ln(f.datetime)}});if(c=c.filter(p=>!p.suspended),Array.isArray(s)&&s.length>0){const p=s.map(f=>{const m=Ln(f.start),g=Ln(f.end);return!m||!g?null:{start:m,end:g}}).filter(Boolean);return c=c.filter(f=>f.datetime&&p.some(m=>f.datetime>=m.start&&f.datetime<m.end)),c}if(Array.isArray(n)&&n.length>0){const p=new Set(n.map(f=>Ua(f)).filter(Boolean));return c=c.filter(f=>{if(!f.datetime)return!1;const m=Ua(f.datetime);return p.has(m)}),c}if(Array.isArray(r)&&r.length>0){const p=r.map(f=>{if(typeof f=="string"){const[m,g]=f.split("-").map(Number);return!m||!g?null:{year:m,month:g}}else if(f&&typeof f=="object"){const m=Number(f.year??f.y),g=Number(f.month??f.m);return!m||!g?null:{year:m,month:g}}return null}).filter(Boolean);return c=c.filter(f=>{if(!f.datetime)return!1;const m=f.datetime.getFullYear(),g=f.datetime.getMonth()+1;return p.some(b=>b.year===m&&b.month===g)}),c}if(Array.isArray(a)&&a.length>0){const p=new Set(a.map(f=>Number(f)));return c=c.filter(f=>f.datetime&&p.has(f.datetime.getFullYear())),c}const d=new Date;if(t==="today"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()),f=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);return c.filter(m=>m.datetime&&m.datetime>=p&&m.datetime<f)}if(t==="week"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay()),f=new Date(p);return f.setDate(p.getDate()+7),c.filter(m=>m.datetime&&m.datetime>=p&&m.datetime<f)}if(t==="month"){const p=new Date(d.getFullYear(),d.getMonth(),1),f=new Date(d.getFullYear(),d.getMonth()+1,1);return c.filter(m=>m.datetime&&m.datetime>=p&&m.datetime<f)}return c}async function xl(e){if(!l.currentUser)throw new Error("No logueado");const t=$(k,"users",l.currentUser.uid,"reminders",e);return await ae(t,{suspended:!1,updatedAt:Date.now()}),{ok:!0}}async function wl(){if(!l.currentUser)throw new Error("No logueado");const e=T(k,"users",l.currentUser.uid,"reminders"),t=Q(e,Va("suspended","==",!0));return(await F(t)).docs.map(r=>({id:r.id,...r.data()}))}async function Sl({reminderId:e}){if(!l.currentUser)throw new Error("No logueado");if(!e)throw new Error("Falta ID");const t=$(k,"users",l.currentUser.uid,"reminders",e);return await ae(t,{suspended:!0,updatedAt:Date.now()}),{ok:!0}}async function Es({range:e="today"}={}){if(!l.pairOtherUid)throw new Error("No tienes dúo");const t=T(k,"users",l.pairOtherUid,"reminders"),n=await F(t),r=i=>i?typeof i=="number"?new Date(i):i.toDate?i.toDate():new Date(i):null,a=n.docs.map(i=>{const o=i.data();return{id:i.id,...o,datetime:r(o.datetime)}}),s=new Date;if(e==="today"){const i=new Date(s.getFullYear(),s.getMonth(),s.getDate()),o=new Date(s.getFullYear(),s.getMonth(),s.getDate()+1);return a.filter(c=>c.datetime&&c.datetime>=i&&c.datetime<o)}if(e==="week"){const i=new Date(s.getFullYear(),s.getMonth(),s.getDate()-s.getDay()),o=new Date(i);return o.setDate(i.getDate()+7),a.filter(c=>c.datetime&&c.datetime>=i&&c.datetime<o)}return a}const El="489697428786-m2hkvn9ohor0unrhk6g5i3g7vqla86c4.apps.googleusercontent.com",Cl="AIzaSyA6M73T0k3yPyseAZnkPxBO5GYXPeL8dlQ",Ll=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],kl="https://www.googleapis.com/auth/calendar.readonly";let Pa=!1,Ta=!1,Tn=null;function Ml(){return new Promise((e,t)=>{if(window.gapi&&window.gapi.load)return e();const n=document.createElement("script");n.src="https://apis.google.com/js/api.js",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar gapi")),document.head.appendChild(n)})}function Il(){return new Promise((e,t)=>{if(window.google&&window.google.accounts)return e();const n=document.createElement("script");n.src="https://accounts.google.com/gsi/client",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar Google Identity Services")),document.head.appendChild(n)})}async function Al(){Pa||(await Ml(),await new Promise(e=>{window.gapi.load("client",e)}),await window.gapi.client.init({apiKey:Cl,discoveryDocs:Ll}),Pa=!0)}async function Nl(){Ta&&Tn||(await Il(),Tn=window.google.accounts.oauth2.initTokenClient({client_id:El,scope:kl,callback:()=>{}}),Ta=!0)}async function $l(){return await Nl(),new Promise((e,t)=>{Tn.callback=n=>{if(n.error){console.error("[OAuth error]",n),t(n);return}e(n.access_token)},Tn.requestAccessToken({prompt:""})})}async function Pl(e,t){await Al();const n=await $l();window.gapi.client.setToken({access_token:n});const r=await window.gapi.client.calendar.events.list({calendarId:"primary",timeMin:e.toISOString(),timeMax:t.toISOString(),showDeleted:!1,singleEvents:!0,orderBy:"startTime"});return console.log("[Calendar] Respuesta completa de Google:",r),r.result.items||[]}function Tl(e){var o,c,d,p;if(e.start&&e.start.date&&!e.start.dateTime)return{date:e.start.date,startTime:null,endTime:null,allDay:!0};const t=new Date(((o=e.start)==null?void 0:o.dateTime)||((c=e.start)==null?void 0:c.date)),n=new Date(((d=e.end)==null?void 0:d.dateTime)||((p=e.end)==null?void 0:p.date)||t),r=Ie(t.getFullYear(),t.getMonth()+1,t.getDate()),a=f=>String(f).padStart(2,"0"),s=`${a(t.getHours())}:${a(t.getMinutes())}`,i=`${a(n.getHours())}:${a(n.getMinutes())}`;return{date:r,startTime:s,endTime:i,allDay:!1}}function Ln(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="number")return new Date(e);if(typeof e=="string"){const t=new Date(e);return isNaN(t)?null:t}return e.toDate?e.toDate():null}function Ua(e){const t=Ln(e);return t?Ie(t.getFullYear(),t.getMonth()+1,t.getDate()):null}async function Ul(e,t){if(!l.currentUser||!l.activeSemesterId)throw new Error("Sin usuario o semestre activo");try{const n=await Pl(e,t);if(!n.length){alert("No se encontraron eventos en tu Google Calendar para el rango seleccionado.");return}const r=new Set((Vt||[]).filter(o=>o.gcalId).map(o=>o.gcalId)),a=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");let s=0;const i=[];for(const o of n){if(r.has(o.id))continue;const{date:c,startTime:d,endTime:p,allDay:f}=Tl(o);if(!c)continue;const m={title:o.summary||"(sin título)",date:c,start:f?null:d,end:f?null:p,allDay:!!f,courseId:null,color:null,source:"google",gcalId:o.id,createdAt:Date.now()};i.push(Ce(a,m)),s++}if(!i.length){alert("Los eventos de ese rango ya estaban importados.");return}await Promise.all(i),alert(`Se importaron ${s} evento(s) desde tu Google Calendar para el rango seleccionado.`)}catch(n){console.error("Error al importar Google Calendar:",n),alert("Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.")}}const Da=Object.freeze(Object.defineProperty({__proto__:null,clearCalendarUI:Qi,initCalendar:bs,listPairReminders:Es,listReminders:Ss,listSuspendedReminders:wl,onActiveSemesterChanged:ut,onCoursesChanged:sl,registerCalendarUnsub:Ki,resumeReminder:xl,showCalendarUI:Xi,stopCalendarSub:Zi,suspendReminder:Sl},Symbol.toStringTag,{value:"Module"}));let fn=null;function Zr(){if(!l.currentUser||!l.activeSemesterId)return;const e=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");G(e,t=>{const n=t.docs.filter(a=>a.data().asistencia),r=u("attCourseSel");r&&(r.innerHTML='<option value="" disabled selected>Elige un ramo…</option>',n.forEach(a=>{r.innerHTML+=`<option value="${a.id}">${a.data().name}</option>`})),r==null||r.addEventListener("change",()=>{const a=r.value,s=n.find(i=>i.id===a);Dl(s?[s]:[])})})}function Dl(e){const t=u("asistenciaList");t&&(t.innerHTML="",e.forEach(n=>{const r=n.data(),a=document.createElement("div");a.className="card",a.innerHTML=`
      <h4>${r.name}</h4>
      <div class="att-days" data-id="${n.id}"></div>
      <div class="muted">Asistencia actual: <span class="att-percent" data-id="${n.id}">0%</span></div>
      <button class="btn btn-secondary add-att-btn" data-id="${n.id}" style="margin-top:8px;">+ Agregar asistencia</button>
    `,t.appendChild(a),Bl(n.id)}),t.querySelectorAll(".add-att-btn").forEach(n=>{n.addEventListener("click",()=>Rl(n.dataset.id))}))}async function Bl(e){const t=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance");G(t,n=>{const r=n.docs.map(a=>({id:a.id,...a.data()}));_l(e,r)})}async function _l(e,t){const n=document.querySelector(`.att-days[data-id="${e}"]`);if(!n)return;n.innerHTML=t.map(o=>`
    <div class="att-record">
      <span>${new Date(o.date+"T00:00:00").toLocaleDateString("es-CL",{timeZone:"America/Santiago"})} :

        ${o.present?"✔ Presente":o.absent?"✘ Ausente":o.justified?"🟡 Justificado":"— Sin clase"}

      </span>
      <button class="btn btn-secondary btn-del-att" data-cid="${e}" data-id="${o.id}">❌</button>
    </div>
  `).join(""),n.querySelectorAll(".btn-del-att").forEach(o=>{o.addEventListener("click",()=>Ol(o.dataset.cid,o.dataset.id))});const r=t.filter(o=>!o.noClass),a=r.filter(o=>o.present||o.justified).length,s=r.length?Math.round(a/r.length*100):0,i=document.querySelector(`.att-percent[data-id="${e}"]`);i&&(i.textContent=s+"%"),window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=s}let Un=null;function Rl(e){Un=e;const t=new Date,n=new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().split("T")[0];u("attDate").value=n,u("attModal").classList.add("active")}function Cs(){u("attModal").classList.remove("active"),Un=null}document.addEventListener("DOMContentLoaded",()=>{var e,t,n,r,a;(e=u("attCancel"))==null||e.addEventListener("click",Cs),(t=u("attPresente"))==null||t.addEventListener("click",()=>yn("present")),(n=u("attAusente"))==null||n.addEventListener("click",()=>yn("absent")),(r=u("attJustificado"))==null||r.addEventListener("click",()=>yn("justified")),(a=u("attNoClass"))==null||a.addEventListener("click",()=>yn("noClass"))});async function yn(e){if(!Un)return;const t=u("attDate").value;if(!t){alert("Selecciona una fecha");return}const[n,r,a]=t.split("-").map(Number),i=new Date(n,r-1,a).toISOString().split("T")[0],o=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",Un,"attendance",i);await fe(o,{date:i,present:e==="present",absent:e==="absent",justified:e==="justified",noClass:e==="noClass"}),Cs()}async function Ol(e,t){const n=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance",t);await ye(n)}async function Ls(){if(!l.currentUser||!l.activeSemesterId)return;if(fn){try{fn()}catch{}fn=null}window.courseAttendance||(window.courseAttendance={});const e=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");try{const t=await F(e);for(const n of t.docs){if(!(n.data()||{}).asistencia)continue;const a=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",n.id,"attendance"),o=(await F(a)).docs.map(p=>p.data()).filter(p=>!p.noClass),c=o.filter(p=>p.present||p.justified).length,d=o.length?Math.round(c/o.length*100):0;window.courseAttendance[n.id]=d}console.log("⚡ Precarga inicial de asistencia:",window.courseAttendance),document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{preload:!0}}))}catch(t){console.error("Error en precarga rápida de asistencia:",t)}return fn=G(e,t=>{t.docs.filter(r=>{var a;return(a=r.data())==null?void 0:a.asistencia}).forEach(r=>{const a=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",r.id,"attendance");G(a,s=>{const o=s.docs.map(p=>p.data()).filter(p=>!p.noClass),c=o.filter(p=>p.present||p.justified).length,d=o.length?Math.round(c/o.length*100):0;window.courseAttendance[r.id]=d,document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{courseId:r.id,percent:d}}))})})}),!0}document.addEventListener("auth:ready",()=>{setTimeout(()=>Zr(),1e3)});document.addEventListener("semester:changed",()=>{Zr()});const Ba=Object.freeze(Object.defineProperty({__proto__:null,initAttendance:Zr,preloadAttendanceData:Ls},Symbol.toStringTag,{value:"Module"})),Er=new Map,Xe=new Map;let gn=0,D=null,lt=null,se=[],O={scale:"USM",finalExpr:"",rulesText:""},Re={byName:{},byCode:{},byId:{}},Be=null,Ee=null;function tn(){return $(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",D,"groups","meta")}async function Qr(){if(Ee=null,!!bt())try{const e=await ee(tn());Ee=e.exists()?e.data()||{}:{}}catch(e){console.error("Error cargando nombres de grupos:",e),Ee={}}}async function Hl(e,t){if(bt())try{await fe(tn(),{[e]:t},{merge:!0}),Ee={...Ee||{},[e]:t}}catch(n){throw console.error("Error guardando nombre de grupo:",n),n}}function _a(){const e=Ee||{};return Array.isArray(e.__custom)?e.__custom:[]}function Fl(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||"g"}async function zl(){if(!bt())return;const e=prompt('Nombre de la carpeta (ej.: "Quices", "Trabajos", "Controles cortos"):');if(!e)return;const t=e.trim();if(!t)return;const n=prompt(`Palabra clave que deben contener las evaluaciones para ir a esta carpeta.
Ej.: "quiz" agrupa todo lo que tenga "quiz" en el nombre.`);if(!n)return;const r=n.trim();if(!r)return;const a=Ee||{},s=Array.isArray(a.__custom)?[...a.__custom]:[],i=Fl(t),o=new Set(["certamenes","controles","tareas","proyecto","evaluaciones","experiencias","preinformes","informes","laboratorios","otros",...s.map(f=>f.key)]);let c=i,d=2;for(;o.has(c);)c=`${i}${d++}`;s.push({key:c,label:t,keyword:r});const p={...a,[c]:t,__custom:s};await fe(tn(),p,{merge:!0}),Ee=p}async function ql(e){if(!bt())return;const t=Ee||{},n=Array.isArray(t.__custom)?t.__custom.filter(a=>a.key!==e):[],r={...t};delete r[e],r.__custom=n,await fe(tn(),r,{merge:!0}),Ee=r}function jl(e){Be=e,l.unsubscribeGrades=()=>{try{Be==null||Be()}finally{Be=null,l.unsubscribeGrades=null}}}function Yl(){try{Be==null||Be()}finally{Be=null}l.unsubscribeGrades=null}function ks(e){return te(e)}function Gl(){const e=u("gr-courseSel");e&&(e.innerHTML='<option value="" disabled selected>Selecciona un ramo…</option>');const t=u("gr-evalsList");t&&(t.innerHTML="");const n=u("gr-finalExpr");n&&(n.value="");const r=u("gr-rulesError");r&&(r.textContent="");const a=u("gr-currentAvg");a&&(a.textContent="—");const s=u("gr-neededToPass");s&&(s.textContent="—");const i=u("gr-status");i&&(i.textContent="—");const o=u("gr-partnerView");o&&o.classList.add("hidden");const c=u("gr-sh-semSel");c&&(c.innerHTML="");const d=u("gr-sh-list");d&&(d.innerHTML="")}function Vl(e=D){const t=e?Xe.get(e):null,n=e?Er.get(e):null;t?O={...O,...t}:O={scale:O.scale||"USM",finalExpr:"",rulesText:""};const r=u("gr-finalExpr");r&&(r.value=O.finalExpr||"");const a=u("gr-rulesText");if(a&&(a.value=O.rulesText||""),n&&n.length)se=n.map(s=>({...s})),Se(se),oe();else{se=[];const s=u("gr-evalsList");s&&(s.innerHTML='<div class="muted" style="opacity:.5">Cargando evaluaciones…</div>'),Vn(null)}}function Wl(){Zl()}document.addEventListener("attendance:ready",e=>{console.log("🔁 Asistencia actualizada para:",e.detail),oe()});document.addEventListener("route:notas",()=>{setTimeout(()=>{const e=u("gr-courseSel"),t=u("gr-evalsCard"),n=u("gr-calcCard"),r=u("gr-summaryCard"),a=u("gr-rulesCard");(!e||!e.value)&&(t&&t.classList.add("hidden"),n&&n.classList.add("hidden"),r&&r.classList.add("hidden"),a&&a.classList.add("hidden"))},50)});async function kn(){await Ms()}function Jl(){var n,r;const e=u("gr-activeSemLabel");e&&(e.textContent=((n=l.activeSemesterData)==null?void 0:n.label)||"—"),Ms();const t=document.getElementById("gr-sh-semSel");t&&((r=l.activeSemesterData)!=null&&r.label)&&(t.innerHTML=`<option selected>${l.activeSemesterData.label}</option>`,t.disabled=!0,t.style.pointerEvents="none",t.style.opacity="0.7"),(async()=>{try{await Ls(),console.log("✅ Asistencia precargada, ahora sí recalculamos notas"),oe()}catch(a){console.warn("⚠️ Error precargando asistencia:",a),oe()}})()}function Kl(){return(se||[]).map(e=>({code:e.key,name:e.name||e.key,grade:typeof e.score=="number"?e.score:null}))}function Zl(){var r,a,s,i;Ql(),(r=u("gr-saveExpr"))==null||r.addEventListener("click",St),(a=u("gr-finalExpr"))==null||a.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),St())}),(s=u("gr-courseSel"))==null||s.addEventListener("change",ec),(i=u("gr-addEvalBtn"))==null||i.addEventListener("click",tc),Xl();function e(){var f;const o=u("page-notas");if(!o)return;const c=(f=Array.from(o.querySelectorAll(".card h3")).find(m=>/c[aá]lculo de notas/i.test(m.textContent)))==null?void 0:f.closest(".card");if(!c)return;c.id||(c.id="gr-calcCard");const d=c.querySelector("h3");let p=d==null?void 0:d.closest(".row");if(p?p.classList.add("gr-calcHeader"):(p=document.createElement("div"),p.className="row gr-calcHeader",d&&p.appendChild(d),c.insertBefore(p,c.firstChild)),!c.querySelector("#gr-openSim")){const m=document.createElement("button");m.id="gr-openSim",m.className="ghost",m.textContent="Simulador de notas",m.style.marginLeft="auto",p.appendChild(m),m.addEventListener("click",()=>{const g=lc();if(!g){alert("Primero define la Fórmula final.");return}const b=Kl();if(!b.length){alert("Agrega al menos una evaluación.");return}xc({formula:g,evals:b})})}}function t(){const o=u("gr-togglePartner");if(!o||!o.parentElement)return;let c=u("gr-exportMyNotes");c?(c.className=o.className,c.style.cssText=o.style.cssText||"",c.textContent="Exportar mis notas"):(c=document.createElement("button"),c.id="gr-exportMyNotes",c.type="button",c.className=o.className,c.style.cssText=o.style.cssText||"",c.textContent="Exportar mis notas",o.insertAdjacentElement("afterend",c)),c.dataset.boundExportNotes!=="1"&&(c.dataset.boundExportNotes="1",c.addEventListener("click",async()=>{try{await Go()}catch(d){console.error(d),alert("No se pudo abrir el exportador de notas.")}}))}e(),t();const n=u("gr-finalExpr");if(n){const o=cc(async d=>{d===D&&await St(d)},600),c=()=>{if(!D)return;const d=ft(n.value||"");O.finalExpr=d;const p=Xe.get(D)||{};Xe.set(D,{...p,...O,finalExpr:d}),oe()};n.addEventListener("input",()=>{const d=D;c(),o(d)}),n.addEventListener("keyup",c),n.addEventListener("change",c),n.addEventListener("blur",async()=>{c(),await St(D)}),n.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),c(),St(D))})}}function Ql(){var n;const e=u("gr-passThreshold");e&&((n=e.closest("div"))==null||n.classList.add("hidden"));const t=u("gr-saveHeader");t&&t.classList.add("hidden")}function Xl(){var r,a;if(u("gr-rulesCard"))return;const e=u("page-notas");if(!e)return;const t=document.createElement("div");t.className="card",t.id="gr-rulesCard",t.style.marginTop="12px",t.innerHTML=`
    <div class="row" style="justify-content:space-between;align-items:center">
      <h3 style="margin:0">Reglas</h3>
      <div class="muted" id="gr-rulesHint">Una por línea. Ej.: <code>C1>=50</code>, <code>avg(Q1,Q2,Q3)>=60</code>,</code> finalCode("Codigo del ramo") >= 50</code>,</code>Asistencia >= 55%</code></div>
    </div>
    <div class="row" style="align-items:flex-start;margin-top:8px">
      <textarea id="gr-rulesText" rows="4" style="flex:1 1 520px;min-height:86px;background:#0e1120;border:1px solid var(--line);color:var(--ink);padding:8px 10px;border-radius:10px"></textarea>
      <div id="gr-formulaError" class="muted" style="margin-top:6px;color:#fca5a5"></div>
      <button id="gr-saveRules" class="primary">Guardar reglas</button>
    </div>
    <div id="gr-rulesStatus" class="muted" style="margin-top:6px"></div>
  `;const n=(r=Array.from(e.querySelectorAll(".card h3")).find(s=>/c[aá]lculo de notas/i.test(s.textContent)))==null?void 0:r.closest(".card");n?e.insertBefore(t,n):e.appendChild(t),(a=u("gr-saveRules"))==null||a.addEventListener("click",$s)}async function Ms(){var r,a,s,i,o,c,d,p,f,m,g,b;const e=u("gr-courseSel");if(!e)return;const t=l.editingCourseId||D||"";if(e.innerHTML='<option value="">Selecciona un ramo…</option>',!l.courses||l.courses.length===0){D=null,l.editingCourseId=null,(r=u("gr-evalsCard"))==null||r.classList.add("hidden"),(a=u("gr-calcCard"))==null||a.classList.add("hidden"),(s=u("gr-summaryCard"))==null||s.classList.add("hidden"),(i=u("gr-rulesCard"))==null||i.classList.add("hidden"),Se([]),Vn(null);return}l.courses.forEach(y=>{const h=document.createElement("option");h.value=y.id,h.textContent=y.name,e.appendChild(h)}),t&&l.courses.some(y=>y.id===t)?(D=t,l.editingCourseId=t,e.value=t,(o=u("gr-evalsCard"))==null||o.classList.remove("hidden"),(c=u("gr-calcCard"))==null||c.classList.remove("hidden"),(d=u("gr-summaryCard"))==null||d.classList.remove("hidden"),(p=u("gr-rulesCard"))==null||p.classList.remove("hidden"),await Ns(),await Qr(),await Ps(),await Bt(),oe(),await Is(D)):(D=null,l.editingCourseId=null,e.value="",(f=u("gr-evalsCard"))==null||f.classList.add("hidden"),(m=u("gr-calcCard"))==null||m.classList.add("hidden"),(g=u("gr-summaryCard"))==null||g.classList.add("hidden"),(b=u("gr-rulesCard"))==null||b.classList.add("hidden"))}async function ec(e){var a,s,i,o,c,d,p,f;const t=e.target.value||null,n=D,r=++gn;if(n&&n!==t&&Promise.all([St(n),$s(n)]).catch(m=>console.warn("No se pudo guardar antes de cambiar de ramo:",m)),D=t,l.editingCourseId=D,lt){try{lt()}catch{}lt=null}if(!D){(a=u("gr-evalsCard"))==null||a.classList.add("hidden"),(s=u("gr-calcCard"))==null||s.classList.add("hidden"),(i=u("gr-summaryCard"))==null||i.classList.add("hidden"),(o=u("gr-rulesCard"))==null||o.classList.add("hidden"),se=[],Se([]),Vn(null);return}(c=u("gr-evalsCard"))==null||c.classList.remove("hidden"),(d=u("gr-calcCard"))==null||d.classList.remove("hidden"),(p=u("gr-summaryCard"))==null||p.classList.remove("hidden"),(f=u("gr-rulesCard"))==null||f.classList.remove("hidden"),Vl(t),Ps(t),Promise.all([Ns(),Qr()]).then(async()=>{r===gn&&(Se(se),oe(),Is(t).then(()=>{r===gn&&oe()}).catch(()=>{}),Bt().then(()=>{r===gn&&oe()}).catch(()=>{}))}).catch(m=>console.warn("Error cargando datos del ramo:",m))}async function Is(e){try{const t=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance"),a=(await F(t)).docs.map(o=>o.data()).filter(o=>!o.noClass),s=a.filter(o=>o.present||o.justified).length,i=a.length?Math.round(s/a.length*100):0;window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=i,console.log(`✅ Sincronizada asistencia directa de ${e}: ${i}%`),oe()}catch(t){console.warn("⚠️ No se pudo sincronizar asistencia directa:",t)}}function As(){return $(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",D,"grading","meta")}function Mt(){return T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",D,"grading","meta","components")}async function Ns(){var C,A,N,v,I,E,x;if(!bt())return;const e=D,t=((C=u("gr-finalExpr"))==null?void 0:C.value)??null,n=((A=u("gr-rulesText"))==null?void 0:A.value)??null,r=As(),a=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",D),s=await ee(a),i=s.exists()&&s.data().scale||null,o=((N=l.activeSemesterData)==null?void 0:N.gradeScale)||null,c=((v=l.activeSemesterData)==null?void 0:v.universityAtThatTime)||"";let d=null;if(o)d=o==="1-7"||o==="2-7"||o==="0-7"?"MAYOR":"USM";else{const S=localStorage.getItem(`scale_${c}`);S?d=S.includes("7")?"MAYOR":"USM":d=/mayor/i.test(c)?"MAYOR":(/usm|utfsm|santa\s*mar/i.test(c),"USM")}const p=await ee(r);if(e!==D)return;const f=p.exists()?{finalExpr:"",rulesText:"",...p.data()}:{scale:i||d,finalExpr:"",rulesText:""};if(!p.exists()&&(await fe(r,f),e!==D))return;O.scale=f.scale||i||d;const m=((I=u("gr-finalExpr"))==null?void 0:I.value)??null,g=((E=u("gr-rulesText"))==null?void 0:E.value)??null,b=m!==t,y=g!==n;if(!b){O.finalExpr=f.finalExpr||"";const S=u("gr-finalExpr");S&&(S.value=O.finalExpr)}if(!y){O.rulesText=f.rulesText||"";const S=u("gr-rulesText");S&&(S.value=O.rulesText)}let h=i||d;if(O.scale!==h&&(O.scale=h,await ae(r,{scale:O.scale}),e!==D))return;u("gr-activeSemLabel")&&(u("gr-activeSemLabel").textContent=((x=l.activeSemesterData)==null?void 0:x.label)||"—");const w=u("gr-scaleSel");w&&(w.value=O.scale||"USM"),Xe.set(e,{...O}),e===D&&oe()}async function St(e=null){const t=e||D;if(!(l.currentUser&&l.activeSemesterId&&t))return;const n=u("gr-finalExpr"),r=((n==null?void 0:n.value)||"").trim(),a=ft(r)||null;t===D&&(O.finalExpr=a||"",Xe.set(t,{...O}));const s=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t,"grading","meta");await fe(s,{finalExpr:a},{merge:!0}),t===D&&(oe(),Bt().then(()=>{t===D&&oe()}).catch(()=>{}))}async function $s(e=null){var a;const t=e||D;if(!(l.currentUser&&l.activeSemesterId&&t))return;const n=(((a=u("gr-rulesText"))==null?void 0:a.value)||"").trim()||null;t===D&&(O.rulesText=n||"",Xe.set(t,{...O}));const r=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t,"grading","meta");await fe(r,{rulesText:n},{merge:!0}),t===D&&(oe(),Bt().then(()=>{t===D&&oe()}).catch(()=>{}))}async function Ps(e=D){if(lt&&(lt(),lt=null),!(l.currentUser&&l.activeSemesterId&&e)){se=[],Se([]);return}const t=Er.get(e);t&&t.length&&(se=t.map(r=>({...r})),Se(se),oe());const n=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"grading","meta","components");lt=G(Q(n,ve("createdAt","asc")),async r=>{if(e!==D)return;let a=r.docs.map(i=>({id:i.id,...i.data()}));const s=a.filter(i=>typeof i.order!="number");s.length&&de(()=>import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),[],import.meta.url).then(async({writeBatch:i})=>{const o=i(k),c=Date.now();s.forEach((d,p)=>{o.update($(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"grading","meta","components",d.id),{order:c+p})});try{await o.commit()}catch{}}),a.sort((i,o)=>{var m,g,b,y;const c=typeof i.order=="number"?i.order:9e15,d=typeof o.order=="number"?o.order:9e15;if(c!==d)return c-d;const p=((g=(m=i.createdAt)==null?void 0:m.toMillis)==null?void 0:g.call(m))??0,f=((y=(b=o.createdAt)==null?void 0:b.toMillis)==null?void 0:y.call(b))??0;return p-f}),se=a,Er.set(e,a.map(i=>({...i}))),await Se(a),oe(),Bt().then(()=>{e===D&&oe()})},r=>{console.error("watchComponents error:",r),e===D&&Se([])})}async function tc(){if(!bt()){alert("Selecciona un semestre y un ramo.");return}const e=u("gr-evalName"),t=u("gr-evalCode"),n=u("gr-evalScore"),r=((e==null?void 0:e.value)||"").trim();let a=((t==null?void 0:t.value)||"").trim();const s=(n==null?void 0:n.value)??"";if(!r){alert("Escribe un nombre.");return}if(!a){alert("Escribe un código (ej: C1, T1...).");return}if(a=a.replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16),!a){alert("Código inválido.");return}a=nc(a,se);const i=O.scale==="MAYOR",o=i?1:0,c=i?7:100,d=parseFloat(String(s).replace(",",".")),p=isNaN(d)?null:Wn(d,o,c);await Ce(Mt(),{key:a,name:r,score:p,createdAt:Wa(),order:Date.now()}),e&&(e.value=""),t&&(t.value=""),n&&(n.value="")}function Ts(e){return(e||"").replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16)}function nc(e,t){const n=new Set((t||[]).map(s=>(s.key||"").toLowerCase()));let r=Ts(e)||"X";if(!n.has(r.toLowerCase()))return r;let a=2;for(;n.has((r+a).toLowerCase());)a++;return r+a}async function Se(e=[]){const t=u("gr-evalsList");if(!t)return;const n={};t.querySelectorAll(".grade-item").forEach(v=>{var x,S;const I=(S=(x=v.querySelector("code"))==null?void 0:x.textContent)==null?void 0:S.trim(),E=v.querySelector('[data-f="score"]');I&&E&&E.value&&(n[I]=E.value)});const r=new Set(Array.from(t.querySelectorAll("details.grade-group[open]")).map(v=>v.dataset.key));if(t.innerHTML="",!D){t.innerHTML='<div class="muted">Selecciona un ramo.</div>';return}if(!e.length){t.innerHTML='<div class="muted">Aún no hay evaluaciones. Usa “Agregar evaluación”.</div>';return}const a=O.scale==="MAYOR",s=a?1:0,i=a?7:100,o=a?.1:1,c=document.createElement("div");c.className="row",c.style.justifyContent="space-between",c.style.alignItems="center",c.style.marginBottom="6px";const d=document.createElement("div");d.className="muted",d.textContent="Carpetas de evaluaciones";const p=document.createElement("button");p.id="gr-addGroup",p.className="ghost",p.textContent="Agregar carpeta",p.addEventListener("click",()=>{zl().then(()=>Se(se))}),c.appendChild(d),c.appendChild(p),t.appendChild(c);const f=Ee||{},m=_a(),g=new Set(m.map(v=>v.key)),b={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};m.forEach(v=>{b[v.key]=v.label||v.key});const y={...b,...f},h={},w=new Set,C=v=>(v.name||"").toString();m.forEach(v=>{const I=(v.keyword||v.pattern||v.label||"").trim();if(!I)return;const E=I.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),x=new RegExp(E,"i"),S=e.filter(L=>!w.has(L.id)&&x.test(C(L)));S.length&&(h[v.key]=S,S.forEach(L=>w.add(L.id)))});const A={certamenes:v=>/certamen/i.test(C(v)),controles:v=>/control/i.test(C(v)),tareas:v=>/tarea/i.test(C(v)),proyecto:v=>/proy|proyecto/i.test(C(v)),evaluaciones:v=>/evaluaci[oó]n/i.test(C(v)),experiencias:v=>/experien/i.test(C(v)),preinformes:v=>/pre[\s-]?informe/i.test(C(v)),informes:v=>/\binforme/i.test(C(v))&&!/pre[\s-]?informe/i.test(C(v)),laboratorios:v=>/laboratorio|\blab/i.test(C(v))};for(const[v,I]of Object.entries(A)){const E=e.filter(x=>!w.has(x.id)&&I(x));E.length&&(h[v]=E,E.forEach(x=>w.add(x.id)))}const N=e.filter(v=>!w.has(v.id));N.length&&(h.otros=N);for(const[v,I]of Object.entries(h)){if(!I.length)continue;const E=document.createElement("details");E.className="grade-group",E.dataset.key=v,r.has(v)&&(E.open=!0);const x=document.createElement("summary");x.style.display="flex",x.style.alignItems="center",x.style.justifyContent="space-between",x.style.width="100%",x.style.cursor="pointer";const S=y[v]||b[v]||v,L=document.createElement("span");L.style.fontWeight="700",L.textContent=`${S} (${I.length})`;const M=document.createElement("div");M.style.display="flex",M.style.alignItems="center",M.style.gap="4px";const U=document.createElement("button");if(U.dataset.rename=v,U.className="ghost",U.textContent="✎",Object.assign(U.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),M.appendChild(U),g.has(v)){const P=document.createElement("button");P.dataset.deleteGroup=v,P.className="ghost",P.textContent="🗑",Object.assign(P.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),P.addEventListener("click",async _=>{_.preventDefault(),_.stopPropagation();const z=y[v]||v;if(confirm(`¿Eliminar la carpeta “${z}” y TODAS las evaluaciones que contiene? Esta acción no se puede deshacer.`))try{const{writeBatch:H}=await de(async()=>{const{writeBatch:j}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:j}},[],import.meta.url),R=H(k);I.forEach(j=>{R.delete($(Mt(),j.id))}),await R.commit(),await ql(v),await Qr(),Se(se)}catch(H){console.error("Error borrando carpeta y evaluaciones:",H),alert("No se pudo borrar la carpeta. Inténtalo de nuevo.")}}),M.appendChild(P)}x.appendChild(L),x.appendChild(M),E.appendChild(x);const B=document.createElement("div");I.forEach(P=>{const _=document.createElement("div");_.className="grade-item",_.dataset.id=P.id,_.draggable=!0,_.innerHTML=`
        <div style="flex:1">
          <div class="gr-name" style="font-weight:700">${te(P.name||P.key)}</div>
          <div class="muted">Código: <code class="gr-code">${te(P.key)}</code></div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <input data-f="score" type="number" step="${o}" min="${s}" max="${i}"
                 value="${n[P.key]??P.score??""}" style="width:110px"/>
          <button data-act="save" class="btn btn-secondary">Guardar</button>
          <button data-act="edit" class="btn btn-secondary">Editar</button>
          <button data-act="cancelEdit" class="btn btn-secondary" style="display:none">Cancelar</button>
          <button data-act="del"  class="btn btn-secondary">Eliminar</button>
        </div>
      `,_.querySelectorAll("input,button,select,textarea").forEach(z=>{z.setAttribute("draggable","false")}),_.addEventListener("click",async z=>{var R,j;const H=z.target;if(H instanceof HTMLElement){if(H.dataset.act==="edit"){const q=_.querySelector(".gr-name"),ce=_.querySelector(".gr-code"),Te=((R=q==null?void 0:q.textContent)==null?void 0:R.trim())||P.name||"",xe=((j=ce==null?void 0:ce.textContent)==null?void 0:j.trim())||P.key||"";q.innerHTML=`<input data-f="edit-name" type="text" value="${te(Te)}"
                               style="width:100%;max-width:320px">`,ce.parentElement.innerHTML=`Código: <input data-f="edit-code" type="text" value="${te(xe)}"
                            style="width:120px">`,_.querySelector('[data-act="edit"]').style.display="none",_.querySelector('[data-act="cancelEdit"]').style.display="";return}if(H.dataset.act==="cancelEdit"){Se(se);return}if(H.dataset.act==="save"){const q=_.querySelector('[data-f="edit-name"]'),ce=_.querySelector('[data-f="edit-code"]');if(q||ce){const Jn=q?q.value:P.name||P.key,Zs=ce?ce.value:P.key,oa=(Jn||"").trim();let Ue=(Zs||"").trim();if(!oa){alert("Escribe un nombre.");return}if(Ue=Ts(Ue),!Ue){alert("Código inválido. Usa A–Z, 0–9 o _.");return}if(new Set(se.filter(ht=>ht.id!==P.id).map(ht=>(ht.key||"").toLowerCase())).has(Ue.toLowerCase())){alert(`El código ${Ue} ya existe en este ramo.`);return}const Qs=$(Mt(),P.id);if(Ue!==P.key){const ht=Ra(O.finalExpr||"",P.key,Ue),ia=Ra(O.rulesText||"",P.key,Ue);await ae(As(),{finalExpr:ht||null,rulesText:ia||null}),O.finalExpr=ht||"",O.rulesText=ia||""}await ae(Qs,{name:oa,key:Ue}),await Bt(),oe(),Se(se);return}const Te=_.querySelector('[data-f="score"]');let xe=parseFloat(Te.value);const _t=isNaN(xe)?null:Wn(xe,s,i);await ae($(Mt(),P.id),{score:_t});const sa=se.findIndex(Jn=>Jn.id===P.id);sa>=0&&(se[sa].score=_t),H.textContent="Guardado ✓",oe(),setTimeout(()=>H.textContent="Guardar",1200);return}if(H.dataset.act==="del"){if(!confirm(`Eliminar “${P.name||P.key}”?`))return;await ye($(Mt(),P.id));return}}}),B.appendChild(_)}),E.appendChild(B),t.appendChild(E),Ds(B),U.addEventListener("click",async P=>{P.preventDefault(),P.stopPropagation();const _=y[v]||b[v]||v,z=prompt(`Nuevo nombre para “${_}”:`,_);if(!(!z||z.trim()===_))try{if(await Hl(v,z.trim()),g.has(v)){const H=Ee||{},R=_a().map(q=>q.key===v?{...q,label:z.trim()}:q),j={...H,[v]:z.trim(),__custom:R};await fe(tn(),j,{merge:!0}),Ee=j}Se(se)}catch{alert("No se pudo guardar el nuevo nombre.")}})}}function Ra(e,t,n){if(!e)return e;const r=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a=new RegExp(`\\b${r(t)}\\b`,"g");return e.replace(a,n)}function oe(){const e=u("gr-finalExpr"),t=u("gr-rulesText");if(e&&(O.finalExpr=ft(e.value||"")),t&&(O.rulesText=t.value||""),D){const y=Xe.get(D)||{};Xe.set(D,{...y,...O})}const n=O.finalExpr||"",r=O.rulesText||"",a={},s=O.scale==="MAYOR"?1:0,i=O.scale==="MAYOR"?7:100;se.forEach(y=>{typeof y.score=="number"&&(a[y.key]=Wn(y.score,s,i))}),window.courseAttendance&&D in window.courseAttendance?a.Asistencia=window.courseAttendance[D]:a.Asistencia=0;let o=null,c="";if(n.trim()!=="")try{o=Pt(n,a,{avg:nn,min:Math.min,max:Math.max,final:y=>Dn(y),finalCode:y=>Bn(y),finalId:y=>ea(y)}),typeof o=="number"&&isFinite(o)?o=rn(o,O.scale):o=null}catch(y){c=(y==null?void 0:y.message)||String(y||""),o=null}else o=null;const d=u("gr-rulesStatus");d&&(d.dataset.formulaError=c);const p=O.scale==="MAYOR"?3.95:54.5,f=Xr(r),m=Us(f,a);let g=null;o==null?g=m.allOk?"—":"Reprueba":g=o>=p&&m.allOk?"Aprueba":"Reprueba";let b="—";if(o==null)b="Ingresa notas o completa la fórmula.";else if(g==="Aprueba")b="Nada más. Ya alcanzas la nota y cumples las reglas.";else{const y=[];if(o<p){const h=p-o;y.push(O.scale==="MAYOR"?`Subir la nota final en ${h.toFixed(2)} pts.`:`Subir la nota final en ${h.toFixed(1)} pts.`)}if(!m.allOk){const h=m.unmet.map(w=>`Cumplir: ${w.text}.`);y.push(...h)}b=y.join(" ")}sc(m),Vn({final:o,status:g,needed:b})}async function Bt(){if(Re={byName:{},byCode:{},byId:{}},!l.currentUser||!l.activeSemesterId)return;const e=Array.isArray(l.courses)?l.courses:[];for(const t of e)try{const n=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t.id,"grading","meta"),r=await ee(n),a=r.exists()?r.data():{scale:"USM",finalExpr:""},s=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t.id,"grading","meta","components"),o=(await F(s)).docs.map(b=>({id:b.id,...b.data()})),c={},d=a.scale==="MAYOR"?1:0,p=a.scale==="MAYOR"?7:100;for(const b of o)if(typeof b.score=="number"&&isFinite(b.score)){const y=Math.max(d,Math.min(p,b.score));c[b.key]=y}let f=null;if((a.finalExpr||"").trim())try{f=Pt(a.finalExpr,c,{avg:nn,min:Math.min,max:Math.max,final:b=>NaN,finalCode:b=>NaN,finalId:b=>NaN}),typeof f=="number"&&isFinite(f)?f=rn(f,a.scale):f=null}catch{f=null}const m=Ve(t.name),g=Ve(t.code);m&&(Re.byName[m]={final:f,scale:a.scale,id:t.id}),g&&(Re.byCode[g]={final:f,scale:a.scale,id:t.id}),Re.byId[t.id]={final:f,scale:a.scale,id:t.id}}catch{}}function Xr(e){return(e||"").split(/\r?\n/).map(n=>n.trim()).filter(Boolean)}function Us(e,t,n){const r={allOk:!0,items:[],unmet:[]};for(const a of e){const s=rc(a);if(!s){r.items.push({text:a,ok:!1,reason:"inválida"}),r.unmet.push({text:a,kind:"invalid"}),r.allOk=!1;continue}const{left:i,op:o,right:c}=s;let d=null,p=null,f=!1;try{const g={...{avg:nn,min:Math.min,max:Math.max,final:Dn,finalCode:Bn,finalId:ea},...n||{}};window.courseAttendance&&D in window.courseAttendance?t.Asistencia=window.courseAttendance[D]:"Asistencia"in t||(t.Asistencia=0);const b=i.replace(/%/g,""),y=c.replace(/%/g,"");d=Pt(b,t,g),p=Pt(y,t,g),f=ac(d,o,p)}catch{f=!1}r.items.push({text:a,ok:f,left:d,op:o,right:p}),f||(r.unmet.push({text:a,kind:"cmp",left:d,op:o,right:p}),r.allOk=!1)}return r}function rc(e){const t=e.match(/^(.*?)(>=|<=|==|!=|>|<)(.*)$/);return t?{left:ft(t[1].trim()),op:t[2],right:ft(t[3].trim())}:null}function ac(e,t,n){if(!(isFinite(e)&&isFinite(n)))return!1;const r=Math.round(Math.round(e*10)/10),a=Math.round(Math.round(n*10)/10);switch(t){case">=":return r>=a;case"<=":return r<=a;case">":return r>a;case"<":return r<a;case"==":return r===a;case"!=":return r!==a;default:return!1}}function nn(...e){const t=e.map(r=>typeof r=="number"&&isFinite(r)?r:Number(r)).filter(r=>!isNaN(r));return t.length?t.reduce((r,a)=>r+a,0)/t.length:NaN}function sc(e){const t=u("gr-rulesStatus");if(!t)return;if(!e||!e.items.length){t.textContent="No hay reglas definidas.";return}const n=e.items.filter(a=>a.ok).length,r=e.items.map(a=>a.ok?`✅ ${a.text}`:`❌ ${a.text}`);t.innerHTML=`<div><b>Reglas:</b> ${n}/${e.items.length} cumplidas</div><div style="margin-top:4px">${r.join("<br/>")}</div>`}function Vn(e){const t=[u("gr-currentFinal"),u("gr-currentAvg")].filter(Boolean),n=[u("gr-status")].filter(Boolean),r=[u("gr-needed"),u("gr-neededToPass")].filter(Boolean);if(!t.length&&!n.length&&!r.length)return;if(!e){t.forEach(c=>c.textContent=""),n.forEach(c=>c.textContent=""),r.forEach(c=>c.textContent="");return}const a=(O==null?void 0:O.scale)||"USM",s=e.final==null?"":rn(e.final,a).toString(),i=e.status??"",o=e.needed??"";t.forEach(c=>c.textContent=s),n.forEach(c=>c.textContent=i),r.forEach(c=>c.textContent=o)}let tr={id:null,fromIndex:-1};function Ds(e){e&&(e.querySelectorAll(".grade-item").forEach(t=>{t.draggable=!0,t.querySelectorAll("input,button,select,textarea").forEach(n=>{n.setAttribute("draggable","false")})}),e.addEventListener("dragstart",t=>{const n=t.target.closest(".grade-item");n&&(t.dataTransfer.setData("text/plain",n.dataset.id||""),t.dataTransfer.effectAllowed="move",n.classList.add("dragging"),tr.id=n.dataset.id,tr.fromIndex=[...e.children].indexOf(n))}),e.addEventListener("dragend",()=>{const t=e.querySelector(".grade-item.dragging");t==null||t.classList.remove("dragging"),tr={id:null,fromIndex:-1}}),e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect="move";const n=e.querySelector(".grade-item.dragging");if(!n)return;const r=oc(e,t.clientY);r==null?e.appendChild(n):e.insertBefore(n,r)},{capture:!0}),e.addEventListener("drop",async t=>{t.preventDefault();const n=[...e.querySelectorAll(".grade-item")].map(r=>r.dataset.id);await ic(n)}))}function oc(e,t){return[...e.querySelectorAll(".grade-item:not(.dragging)")].reduce((r,a)=>{const s=a.getBoundingClientRect(),i=t-(s.top+s.height/2);return i<0&&i>r.offset?{offset:i,element:a}:r},{offset:Number.NEGATIVE_INFINITY,element:null}).element}async function ic(e){if(!bt()||!Array.isArray(e)||!e.length)return;const{writeBatch:t}=await de(async()=>{const{writeBatch:s}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:s}},[],import.meta.url),n=t(k);let r=Date.now();const a=1e3;e.forEach((s,i)=>{const o=$(Mt(),s);n.update(o,{order:r+i*a})});try{await n.commit()}catch(s){console.warn("Error al guardar orden:",s)}}function lc(){var e;return(((e=document.getElementById("gr-finalExpr"))==null?void 0:e.value)||"").trim()}function cc(e,t){let n=null;return(...r)=>{n&&clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function bt(){return!!(l.currentUser&&l.activeSemesterId&&D)}function te(e){return(e??"").toString().replace(/[<>&"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[t])}function Wn(e,t,n){return Math.max(t,Math.min(n,e))}function ft(e){if(!e)return"";let t=String(e).trim();return t=t.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"),t=t.replace(/\s+/g," "),t}function Bs(e){return e.replace(/\b(final|finalCode|finalId)\(\s*([^)]+?)\s*\)/g,(t,n,r)=>{const a=String(r).trim();if(/^["'].*["']$/.test(a))return`${n}(${a})`;if(/[(),]/.test(a))return`${n}(${a})`;const s=a.replace(/"/g,'\\"');return`${n}("${s}")`})}function dc(e){return e?e.replace(/(\d+(?:\.\d+)?)\s*%/g,(t,n)=>`(${n}/100)`):""}function Pt(e,t,n={}){const r=ft(e),a=Bs(r),s=a.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0");if(!/^[\w\s\.\+\-\*\/\(\),%<>!=]+$/.test(s))throw new Error("La fórmula contiene caracteres no permitidos.");const i=dc(a),o=s.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],c=new Set(["avg","min","max","final","finalCode","finalId"]),d=new Set(["NaN","Infinity","Math","true","false"]),p=Object.keys(t),f=p.map(y=>t[y]??0),m=new Set([...p,...Object.keys(n)]);for(const y of o)c.has(y)||d.has(y)||m.has(y)||(p.push(y),f.push(0),m.add(y));const g=Object.keys(n),b=Object.values(n);return Function(...g,...p,`"use strict"; return (${i});`)(...b,...f)}function uc(e){const t=ft(e||""),n=Bs(t),a=n.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0").match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],s=new Set(["avg","min","max","final","finalCode","finalId","NaN","Infinity","Math","true","false"]),i=new Set((n.match(/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/g)||[]).map(c=>c.replace("(","").trim())),o=a.filter(c=>!s.has(c)&&!i.has(c));return[...new Set(o)]}function rn(e,t){return e==null||isNaN(e)?null:t==="MAYOR"?Math.trunc(e*100)/100:Math.trunc(e*10)/10}function Ve(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase()}function Dn(e){const t=Ve(e);if(!t)return NaN;const n=(l.courses||[]).find(o=>o.id===D);if(t===Ve(n==null?void 0:n.name))return NaN;const r=Re.byName[t];if(r&&typeof r.final=="number")return r.final;const a=Array.isArray(l.courses)?l.courses:[],s=a.filter(o=>Ve(o.name).startsWith(t)&&o.id!==D);if(s.length===1){const o=Re.byId[s[0].id];if(o&&typeof o.final=="number")return o.final}const i=a.filter(o=>Ve(o.name).includes(t)&&o.id!==D);if(i.length===1){const o=Re.byId[i[0].id];if(o&&typeof o.final=="number")return o.final}return NaN}function Bn(e){const t=Ve(e),n=(l.courses||[]).find(a=>a.id===D);if(t&&t===Ve(n==null?void 0:n.code))return NaN;const r=Re.byCode[t];return r&&typeof r.final=="number"?r.final:NaN}function ea(e){if(!e||e===D)return NaN;const t=Re.byId[e];return t&&typeof t.final=="number"?t.final:NaN}let J={uid:null,semId:null,courses:[],unsubCourses:null};const tt={};function pc(e,t="Usuario"){const n=String(e||"").trim();return n||t}function mc(e,t="#64748b"){const n=String(e).trim();return/^#[0-9A-Fa-f]{6}$/.test(n)?n:t}async function _s(e){var t;if(!e)return{name:"",color:"#64748b"};if(tt[e])return tt[e];try{const n=await ee($(k,"users",e,"profile","profile")),r=await ee($(k,"users",e)),a=n.exists()?n.data()||{}:{},s=r.exists()?r.data()||{}:{},i=pc(a.name||s.name||s.displayName||s.username,e===((t=l.currentUser)==null?void 0:t.uid)?"Yo":"Usuario"),o=mc(a.favoriteColor||s.favoriteColor||"#64748b");return tt[e]={name:i,color:o},tt[e]}catch{return tt[e]={name:"Usuario",color:"#64748b"},tt[e]}}function fc(){var e;try{(e=J.unsubCourses)==null||e.call(J)}catch{}J.unsubCourses=null,J.courses=[]}function Rs(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return Rs(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function yc(){var a,s,i,o;const e=(a=l.currentUser)==null?void 0:a.uid,t=[l.partyMembers,l.party,l.partyData,l.activeParty,(s=l.shared)==null?void 0:s.party,(i=l.shared)==null?void 0:i.partyData,(o=l.shared)==null?void 0:o.partyMembers];let n=[];for(const c of t)if(n=Rs(c),n.length)break;return[...new Set(n.filter(Boolean))].filter(c=>c!==e)}function Os(){const e=u("gr-partnerView");if(!e||e.querySelector("#gr-partyBar"))return;const t=document.createElement("div");t.id="gr-partyBar",t.style.cssText="display:flex; flex-wrap:wrap; gap:10px; margin:10px 0 12px 0;";const n=e.querySelector("h3, h2");n&&/duo/i.test(n.textContent||"")&&(n.textContent="Notas de mi party");const r=e.querySelector("#gr-sh-semSel");r!=null&&r.parentElement?r.parentElement.insertBefore(t,r):e.insertBefore(t,e.firstChild)}async function Cr(){Os();const e=document.getElementById("gr-partyBar");if(!e)return;const t=yc();if(!t.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}(!J.uid||!t.includes(J.uid))&&(J.uid=t[0]),await Promise.all(t.map(n=>_s(n))),e.innerHTML=t.map(n=>{const r=tt[n]||{};return`
      <button class="btn ${n===J.uid?"violet":"violet-outline"}"
        data-gr-uid="${n}"
        style="display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color||"#64748b"};display:inline-block;"></span>
        <span style="font-weight:800">${ks(r.name||"Usuario")}</span>
      </button>
    `}).join(""),e.querySelectorAll("button[data-gr-uid]").forEach(n=>{n.addEventListener("click",async()=>{J.uid=n.dataset.grUid,await Cr(),await Lr(),await kr()})})}async function Lr(){var i;const e=u("gr-sh-semSel");if(!e)return;const t=((i=l.activeSemesterData)==null?void 0:i.label)||null;if(!t){e.innerHTML="<option selected>No disponible</option>",e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",J.semId=null;return}if(e.innerHTML=`<option selected>${t}</option>`,e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",!J.uid){J.semId=null;return}const n=T(k,"users",J.uid,"semesters"),r=await F(n);let a=null;r.forEach(o=>{var d;String(((d=o.data())==null?void 0:d.label)||"").trim()===t&&(a=o.id)}),J.semId=a;const s=u("gr-sh-list");s&&!a&&(s.innerHTML=`<div class="muted">Este miembro no tiene creado el semestre ${ks(t)}.</div>`)}async function kr(){const e=u("gr-sh-list");if(e&&(e.innerHTML=""),fc(),!J.uid||!J.semId)return;if(!await Hn(J.uid,"notas")){e&&(e.innerHTML=Tr("sus notas"));return}const n=T(k,"users",J.uid,"semesters",J.semId,"courses");J.unsubCourses=G(Q(n,ve("name")),r=>{J.courses=r.docs.map(a=>({id:a.id,...a.data()||{}})),gc()})}function gc(){const e=u("gr-sh-list");if(!e)return;e.innerHTML="";const t=J.courses||[];if(!t.length){e.innerHTML='<div class="muted">No hay ramos en ese semestre.</div>';return}t.forEach(n=>{const r=document.createElement("div");r.className="grade-item",r.style.cursor="pointer",r.innerHTML=`
      <div style="flex:1">
        <div style="font-weight:800">${te(n.name||"Ramo")}</div>
        <div class="muted">Código: <b>${te(n.code||"—")}</b></div>
      </div>
      <div class="muted" style="font-weight:800">Ver</div>
    `,r.addEventListener("click",()=>bc(n.id)),e.appendChild(r)})}function vc(){var n;if(document.getElementById("grPartyCourseModal"))return;const e=document.createElement("div");e.id="grPartyCourseModal",e.style.cssText=`
    position:fixed; inset:0; display:none; align-items:center; justify-content:center;
    background:rgba(0,0,0,.60); z-index:12000; padding:16px;
  `,e.innerHTML=`
    <div style="
      width:min(820px, 96vw);
      max-height:92vh;
      overflow:auto;
      background:#121527;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:14px;
      box-shadow:0 18px 60px rgba(0,0,0,.45);
      color:#fff;
      font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
    ">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="min-width:0;">
          <div id="grPcTitle" style="font-size:16px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Ramo</div>
          <div id="grPcSub" class="muted" style="font-size:12.5px;opacity:.75;margin-top:4px;"></div>
        </div>
        <button id="grPcX" class="btn violet-outline" type="button">✕</button>
      </div>

      <div class="card" style="padding:12px; margin-top:12px;">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
          <div>
            <div class="muted" style="font-size:12px;opacity:.75;">Fórmula final</div>
            <div id="grPcFormula" style="font-weight:900; font-size:13px; margin-top:2px;">—</div>
          </div>
          <div style="text-align:right;">
            <div class="muted" style="font-size:12px;opacity:.75;">Nota final</div>
            <div id="grPcFinal" style="font-weight:900; font-size:18px;">—</div>
          </div>
        </div>
      </div>

      <div class="card" style="padding:12px; margin-top:12px;">
        <div style="font-weight:900; margin-bottom:8px;">Evaluaciones</div>
        <div id="grPcEvals" class="muted">Cargando…</div>
      </div>
    </div>
  `,document.body.appendChild(e);const t=()=>e.style.display="none";(n=document.getElementById("grPcX"))==null||n.addEventListener("click",t),e.addEventListener("click",r=>{r.target===e&&t()}),document.addEventListener("keydown",r=>{e.style.display==="flex"&&r.key==="Escape"&&t()})}async function bc(e){var E;if(!J.uid||!J.semId||!e)return;vc();const t=document.getElementById("grPartyCourseModal"),n=document.getElementById("grPcTitle"),r=document.getElementById("grPcSub"),a=document.getElementById("grPcFormula"),s=document.getElementById("grPcFinal"),i=document.getElementById("grPcEvals");t.style.display="flex",i.innerHTML="Cargando…",s.textContent="—",a.textContent="—";const o=(J.courses||[]).find(x=>x.id===e)||{},c=await _s(J.uid);n.textContent=o.name||"Ramo",r.textContent=`${c.name||"Usuario"} · ${((E=l.activeSemesterData)==null?void 0:E.label)||""}`;const d=$(k,"users",J.uid,"semesters",J.semId,"courses",e,"grading","meta"),p=T(k,"users",J.uid,"semesters",J.semId,"courses",e,"grading","meta","components"),[f,m]=await Promise.all([ee(d),F(Q(p,ve("order")))]),g=f.exists()?f.data()||{}:{scale:"USM",finalExpr:""},b=m.docs.map(x=>({id:x.id,...x.data()||{}})),y=g.scale||"USM",h=y==="MAYOR"?1:0,w=y==="MAYOR"?7:100,C={};b.forEach(x=>{typeof x.score=="number"&&isFinite(x.score)&&x.key&&(C[x.key]=Wn(x.score,h,w))});const A=(g.finalExpr||"").trim();a.textContent=A||"—";let N=null;try{A&&(N=Pt(A,C,{avg:nn,min:Math.min,max:Math.max,final:()=>NaN,finalCode:()=>NaN,finalId:()=>NaN}),typeof N=="number"&&isFinite(N)?N=rn(N,y):N=null)}catch{N=null}if(s.textContent=N==null?"—":String(N),!b.length){i.innerHTML='<div class="muted">Este ramo no tiene evaluaciones.</div>';return}const v=(x="")=>{const S=String(x||"");return/certamen/i.test(S)?"Certámenes":/control/i.test(S)?"Controles":/tarea/i.test(S)?"Tareas":/proy|proyecto/i.test(S)?"Proyecto":/laboratorio|\blab/i.test(S)?"Laboratorios":/pre[\s-]?informe/i.test(S)?"Pre-informes":/\binforme/i.test(S)&&!/pre[\s-]?informe/i.test(S)?"Informes":"Otros"},I={};b.forEach(x=>{const S=v(x.name||x.key);(I[S]=I[S]||[]).push(x)}),i.innerHTML=Object.entries(I).map(([x,S])=>{const L=S.map(M=>{const U=typeof M.score=="number"&&isFinite(M.score)?M.score:null;return`
        <div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:12px;
          border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); margin-top:8px;">
          <div style="min-width:0;">
            <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${te(M.name||M.key)}
            </div>
            <div class="muted" style="font-size:12px;opacity:.75;margin-top:2px;">Código: <b>${te(M.key||"—")}</b></div>
          </div>
          <div style="font-weight:900; font-size:14px;">
            ${U==null?"—":te(U)}
          </div>
        </div>
      `}).join("");return`
      <details open style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:900;opacity:.9">${te(x)} (${S.length})</summary>
        ${L}
      </details>
    `}).join("")}(function(){const t=u("gr-togglePartner");if(!t)return;const n=document.querySelector("#page-notas h2, #page-notas h1, .page-title");function r(){var i,o,c,d,p;return[(i=u("gr-courseSel"))==null?void 0:i.closest(".card"),u("gr-evalsCard")||((o=u("gr-evalsList"))==null?void 0:o.closest(".card")),u("gr-calcCard")||((c=u("gr-finalExpr"))==null?void 0:c.closest(".card")),u("gr-summaryCard")||((d=u("gr-currentFinal"))==null?void 0:d.closest(".card"))||((p=u("gr-currentAvg"))==null?void 0:p.closest(".card")),u("gr-rulesCard")].filter(Boolean)}const a=u("gr-partnerView");function s(i){t.setAttribute("aria-pressed",i?"true":"false"),t.textContent=i?"Volver a mis notas":"Notas de mi party",n&&(n.textContent=i?"🎉 Notas de mi party":"📊 Mis Notas"),r().forEach(o=>an(o,i)),an(a,!i),i&&(Os(),Cr().then(()=>Lr()).then(()=>kr()).catch(o=>console.warn("Error cargando party:",o)))}t.addEventListener("click",()=>{const i=t.getAttribute("aria-pressed")==="true";s(!i)}),document.addEventListener("party:ready",()=>{t.getAttribute("aria-pressed")==="true"&&Cr().then(()=>Lr()).then(()=>kr()).catch(()=>{})}),document.addEventListener("route:notas",()=>{t.getAttribute("aria-pressed")==="true"||(an(a,!0),r().forEach(o=>an(o,!1)))})})();function hc(){return new Promise(e=>{var r,a,s,i;(r=document.getElementById("grSimConfirmModal"))==null||r.remove();const t=document.createElement("div");t.id="grSimConfirmModal",t.style.cssText=`
      position:fixed;
      inset:0;
      z-index:10050;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.65);
      backdrop-filter:blur(4px);
      padding:16px;
    `,t.innerHTML=`
      <div style="
        width:min(460px, 92vw);
        background:linear-gradient(180deg, rgba(18,21,39,.98), rgba(12,14,30,.98));
        color:#fff;
        border:1px solid rgba(255,255,255,.12);
        border-radius:22px;
        padding:20px;
        box-shadow:0 24px 80px rgba(0,0,0,.55);
        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="
            width:46px;
            height:46px;
            border-radius:16px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(99,102,241,.18);
            border:1px solid rgba(129,140,248,.38);
            font-size:22px;
            flex:0 0 auto;
          ">💾</div>

          <div style="min-width:0;">
            <div style="font-size:18px;font-weight:900;line-height:1.2;">
              Guardar simulación
            </div>
            <div style="font-size:13px;opacity:.72;margin-top:4px;">
              Tienes cambios sin guardar en esta simulación.
            </div>
          </div>
        </div>

        <div style="
          margin-top:12px;
          padding:14px;
          border-radius:16px;
          background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.09);
          font-size:14px;
          line-height:1.45;
          color:rgba(255,255,255,.88);
        ">
          ¿Quieres guardar esta simulación antes de salir?
        </div>

        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
          margin-top:18px;
          flex-wrap:wrap;
        ">
          <button id="grSimConfirmCancel" class="ghost" type="button">
            Cancelar
          </button>

          <button id="grSimConfirmNo" class="ghost" type="button">
            Salir sin guardar
          </button>

          <button id="grSimConfirmYes" class="primary" type="button">
            Guardar y salir
          </button>
        </div>
      </div>
    `,document.body.appendChild(t);const n=o=>{t.remove(),e(o)};(a=t.querySelector("#grSimConfirmYes"))==null||a.addEventListener("click",()=>n("save")),(s=t.querySelector("#grSimConfirmNo"))==null||s.addEventListener("click",()=>n("discard")),(i=t.querySelector("#grSimConfirmCancel"))==null||i.addEventListener("click",()=>n("cancel")),t.addEventListener("click",o=>{o.target===t&&n("cancel")}),document.addEventListener("keydown",function o(c){c.key==="Escape"&&(document.removeEventListener("keydown",o),n("cancel"))})})}function xc({formula:e,evals:t}){var v,I,E,x;(v=document.getElementById("gr-simDrawer"))==null||v.remove(),(I=document.getElementById("gr-simBackdrop"))==null||I.remove();const n=document.createElement("div");n.id="gr-simBackdrop",Object.assign(n.style,{position:"fixed",inset:"0",zIndex:9998,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(1px)"}),document.documentElement.classList.add("sim-lock"),document.body.classList.add("sim-lock");const r=document.createElement("div");r.id="gr-simDrawer",Object.assign(r.style,{position:"fixed",top:"0",right:"0",height:"100vh",width:"420px",background:"rgba(18,18,30,.98)",backdropFilter:"blur(6px)",borderLeft:"1px solid rgba(255,255,255,.08)",boxShadow:"0 0 24px rgba(0,0,0,.45)",zIndex:9999,padding:"16px 16px 90px 16px",overflowY:"auto",overscrollBehavior:"contain"}),r.addEventListener("click",S=>S.stopPropagation()),r.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <h3 style="margin:0">Simulador de notas</h3>
      <span class="muted" style="font-size:12px;opacity:.8">(${te(e)})</span>
    </div>

    <div class="card" style="margin-top:4px">
      <h4 style="margin:0 0 6px">Evaluaciones</h4>
      <div id="gr-simForm"></div>
    </div>

    <div class="card" style="margin-top:12px">
      <h4 style="margin:0 0 6px">Resumen de la simulación</h4>
      <div id="gr-simSummary" class="muted">—</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h4 style="margin:0 0 6px">Reglas del ramo (simulación)</h4>
      <div id="gr-simRules" class="muted">—</div>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,.1)">
  <button id="gr-simSave" class="primary">Guardar simulación</button>
  <button id="gr-simClose" class="ghost">Salir</button>
</div>

  `,document.body.appendChild(n),document.body.appendChild(r);const a=async()=>{const S=N();let L=null;try{L=await Ha()}catch{L=null}const M=(P={})=>{const _={};for(const[z,H]of Object.entries(P||{}))H==null||H===""||typeof H=="string"&&H.trim()===""?_[z.toUpperCase()]=null:isNaN(H)?_[z.toUpperCase()]=H:_[z.toUpperCase()]=Math.round(Number(H)*100)/100;return _};if(!((P,_)=>{const z=M(P),H=M(_),R=new Set([...Object.keys(z),...Object.keys(H)]);for(const j of R)if((z[j]??null)!==(H[j]??null))return!1;return!0})(S.gradesMap,L)){const P=await hc();if(P==="cancel")return;if(P==="save")try{await Oa(S.gradesMap,e)}catch{}}n.remove(),r.remove(),document.documentElement.classList.remove("sim-lock"),document.body.classList.remove("sim-lock")};n.addEventListener("click",a),r.addEventListener("keydown",S=>{S.key==="Escape"&&a()}),(E=r.querySelector("#gr-simClose"))==null||E.addEventListener("click",a),wc(r);const s=r.querySelector("#gr-simForm"),i=new Map((t||[]).map(S=>[S.code,S.grade])),o=uc(e),c=new Set((t||[]).map(S=>S.code)),d=[...new Set([...c,...o])],p={certamenes:[],controles:[],tareas:[],proyecto:[],evaluaciones:[],experiencias:[],preinformes:[],informes:[],laboratorios:[],otros:[]},f={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};function m(S,L){const M=(L||"").toString();return/certamen/i.test(M)?"certamenes":/control/i.test(M)?"controles":/tarea/i.test(M)?"tareas":/proy|proyecto/i.test(M)?"proyecto":/evaluaci[oó]n/i.test(M)?"evaluaciones":/experien/i.test(M)?"experiencias":/pre[\s-]?informe/i.test(M)?"preinformes":/\binforme/i.test(M)&&!/pre[\s-]?informe/i.test(M)?"informes":/laboratorio|\blab/i.test(M)?"laboratorios":"otros"}for(const S of d){const L=(t||[]).find(B=>B.code===S)||{name:S},M=i.get(S),U=m(S,L.name||S);p[U].push({code:S,name:L.name||S,value:M})}const g=[],b=O.scale==="MAYOR",y=b?1:0,h=b?7:100,w=b?.1:1;for(const[S,L]of Object.entries(p)){if(!L.length)continue;const M=f[S]||S;g.push(`
    <details open class="sim-group" data-key="${S}"
      style="margin-top:10px;border:1px solid rgba(255,255,255,.08);
             border-radius:8px;padding:6px 8px;background:rgba(0,0,0,0.15)">
      <summary style="cursor:pointer;font-weight:700;font-size:14px;
                      margin-bottom:6px">${M} (${L.length})</summary>
      <div class="sim-group-body">
        ${L.map(U=>`
          <div class="row" style="align-items:center;gap:8px;margin:4px 0"
               data-sim-code="${te(U.code)}">
            <div style="min-width:76px"><b>${te(U.code)}</b></div>
            <div style="flex:1">${te(U.name)}</div>
            <input type="number" step="${w}" min="${y}" max="${h}"
                   style="width:110px" placeholder="—"
                   value="${U.value??""}">
          </div>
        `).join("")}
      </div>
    </details>
  `)}s.innerHTML=g.join("");const C=[...e.matchAll(/finalCode\(["'](.+?)["']\)/g)];for(const S of C){const L=S[1],M=Bn(L);isFinite(M)?g.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${te(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${te(L)}</div>
        <input type="number" readonly value="${M}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `):g.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.75" data-sim-ref="${te(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1;color:#aaa">Nota final de ${te(L)}</div>
        <div style="width:110px;text-align:center;color:#f87171">—</div>
      </div>
    `)}s.innerHTML=g.join("");const A=[...e.matchAll(/final\(["'](.+?)["']\)/g)];for(const S of A){const L=S[1],M=Dn(L);isFinite(M)&&s.insertAdjacentHTML("beforeend",`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${te(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${te(L)}</div>
        <input type="number" readonly value="${M}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `)}const N=()=>{const S={};s.querySelectorAll("[data-sim-code]").forEach(R=>{var Te,xe;const j=R.getAttribute("data-sim-code"),q=(xe=(Te=R.querySelector("input"))==null?void 0:Te.value)==null?void 0:xe.trim(),ce=q?Number(String(q).replace(",",".")):null;S[j]=Number.isFinite(ce)?ce:0});let L=null,M=null;try{L=Pt(e,{...S},{avg:nn,min:Math.min,max:Math.max,final:R=>Dn(R),finalCode:R=>Bn(R),finalId:R=>ea(R)}),typeof L=="number"&&isFinite(L)?L=rn(L,O.scale):L=null}catch(R){M=(R==null?void 0:R.message)||String(R||""),L=null}const U=Xr(O.rulesText||""),B=Us(U,S),P=O.scale==="MAYOR"?3.95:54.5;let _="";if(M)_="";else if(L==null)_="Ingresa valores para simular.";else{const R=[];if(L<P){const j=P-L;R.push(O.scale==="MAYOR"?`Subir la nota final en ${j.toFixed(2)} pts.`:`Subir la nota final en ${j.toFixed(1)} pts.`)}if(!B.allOk){const j=B.unmet.map(q=>q.text);j.length&&R.push(`Cumplir reglas pendientes: ${j.map(te).join("; ")}.`)}_=R.length?R.join(" "):"Nada más. Ya apruebas."}const z=r.querySelector("#gr-simSummary");z.innerHTML=M?`<div style="color:#f87171">Error en fórmula: ${te(M)}</div>`:`
    <div>Promedio simulado: <b>${L??"—"}</b></div>
    <div class="muted" style="margin-top:6px">(Usa tu fórmula final actual)</div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:10px 0">
    <div><b>Necesitas para aprobar</b></div>
    <div style="margin-top:4px">${_}</div>
  `;const H=r.querySelector("#gr-simRules");if(!U.length)H.textContent="No hay reglas definidas.";else{const R=B.items.filter(j=>j.ok).length;H.innerHTML=`
        <div style="margin-bottom:6px">Cumplidas: <b>${R}/${U.length}</b></div>
        <ul style="margin:0 0 0 18px;padding:0;list-style:disc;">
          ${B.items.map(j=>`<li style="color:${j.ok?"#22c55e":"#ef4444"}">${te(j.text)}</li>`).join("")}
        </ul>
      `}return{gradesMap:S,result:L}};s.addEventListener("input",N),N(),(x=r.querySelector("#gr-simSave"))==null||x.addEventListener("click",async()=>{const S=N();try{const L=await Oa(S.gradesMap,e);alert((L==null?void 0:L.where)==="cloud"?"Simulación guardada en la nube.":"Simulación guardada")}catch(L){console.error(L),alert("No se pudo guardar la simulación.")}}),Ha().then(S=>{S&&(s.querySelectorAll("[data-sim-code]").forEach(L=>{const M=L.getAttribute("data-sim-code")||"",U=L.querySelector("input");if(!U)return;const B=S[M]??S[M.toUpperCase()]??S[M.toLowerCase()];B!=null&&(U.value=String(B))}),N())}).catch(()=>{})}function wc(e){const t=()=>Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(a=>!a.hasAttribute("disabled")&&a.tabIndex!==-1),n=()=>t()[0],r=()=>t().slice(-1)[0];setTimeout(()=>{var a;return(a=n())==null?void 0:a.focus()},0),e.addEventListener("keydown",a=>{var o,c;if(a.key!=="Tab")return;const s=t();if(!s.length)return;const i=document.activeElement;a.shiftKey?i===s[0]&&(a.preventDefault(),(o=r())==null||o.focus()):i===s[s.length-1]&&(a.preventDefault(),(c=n())==null||c.focus())})}async function Oa(e,t){const n={};Object.keys(e||{}).forEach(s=>{n[String(s).toUpperCase()]=e[s]});const r={formula:t,grades:n,rules:Xr(O.rulesText||""),semId:l.activeSemesterId||null,courseId:l.editingCourseId||null,createdAt:Wa()};if(l.currentUser&&l.activeSemesterId&&l.editingCourseId)try{const s=["users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",l.editingCourseId,"simulations"];return await Ce(T(k,...s),r),await fe($(k,...s,"__last__"),r),{ok:!0,where:"cloud"}}catch(s){console.warn("Fallo Firestore, usando localStorage:",s)}const a=`sim:last:${l.activeSemesterId||"SEM"}:${l.editingCourseId||"COURSE"}`;return localStorage.setItem(a,JSON.stringify(r)),{ok:!0,where:"local"}}async function Ha(){var t;const e=`sim:last:${l.activeSemesterId||"SEM"}:${l.editingCourseId||"COURSE"}`;if(l.currentUser&&l.activeSemesterId&&l.editingCourseId)try{const n=$(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",l.editingCourseId,"simulations","__last__"),r=await ee(n);if(r.exists()){const a=((t=r.data())==null?void 0:t.grades)||null;return a&&typeof a=="object"?a:null}}catch{}try{const n=localStorage.getItem(e);if(!n)return null;const r=JSON.parse(n),a=(r==null?void 0:r.grades)||null;return a&&typeof a=="object"?a:null}catch{return null}}function Sc(e){if(!e||!l.courses)return null;const t=r=>String(r||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),n=t(e);return l.courses.find(r=>t(r.name).includes(n)||t(r.code||"").includes(n))||null}async function Hs(e){const t=T(e.ref,"rules"),n=await F(t);let r=0,a=0;for(const s of n.docs){const i=s.data(),o=Number(i.peso)||0,c=T(s.ref,"grades"),p=(await F(c)).docs.map(f=>Number(f.data().valor)).filter(f=>!isNaN(f));if(p.length>0){const f=p.reduce((m,g)=>m+g,0)/p.length;r+=f*(o/100),a+=o}}return a>0?+r.toFixed(2):null}async function Ec(e){if(!l.currentUser)return null;const t=T(k,"users",l.currentUser.uid,"semesters",e,"courses"),n=await F(t);let r=0,a=0;for(const s of n.docs){const i=await Hs(s);i!=null&&(r+=i,a++)}return a>0?+(r/a).toFixed(2):null}function Cc(e){var i;const n=(e.scale||"USM")==="MAYOR"?4:55;let r=0,a=0;for(const o of e.rules||[]){const c=Number(o.peso)||0;if(o.tipo.toLowerCase().includes("examen")){a=c;continue}if((i=o.notas)!=null&&i.length){const d=o.notas.reduce((p,f)=>p+f,0)/o.notas.length;r+=d*(c/100)}}return a===0?null:+((n-r)/(a/100)).toFixed(2)}function Lc(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return e.promedio>=n}function kc(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return+Math.max(0,n-(e.promedio||0)).toFixed(2)}async function Mc(e){if(!l.currentUser)return{best:null,worst:null};const t=T(k,"users",l.currentUser.uid,"semesters",e,"courses"),n=await F(t),r=[];for(const a of n.docs){const s=await Hs(a);r.push({id:a.id,name:a.data().name,promedio:s})}return r.length?(r.sort((a,s)=>(s.promedio||0)-(a.promedio||0)),{best:r[0],worst:r[r.length-1]}):{best:null,worst:null}}const Fa=Object.freeze(Object.defineProperty({__proto__:null,bestWorst:Mc,calcBrecha:kc,calcNotaMinima:Cc,calcPromedioSemestre:Ec,clearGradesUI:Gl,enableDnDForGrades:Ds,findCourse:Sc,initGrades:Wl,isPassing:Lc,onActiveSemesterChanged:Jl,onCoursesChanged:kn,registerGradesUnsub:jl,stopGradesSub:Yl},Symbol.toStringTag,{value:"Module"}));let nr="USM";function ta(){Ac()}function Fe(){$c()}function na(e){var s;nr=e==="UMAYOR"?"MAYOR":"USM";const t=u("sectParLabel");t&&(t.textContent=e==="USM"?"Paralelo":"Sección/Paralelo");const n=u("courseScale"),r=(s=n==null?void 0:n.closest)==null?void 0:s.call(n,".form-field");r&&r.classList.add("hidden"),n&&(n.value=nr,n.disabled=!0);const a=u("scaleHint");a&&(a.textContent=nr==="MAYOR"?"Escala: UMayor (1–7) · tomada desde tu Perfil":"Escala: USM (0–100) · tomada desde tu Perfil")}let vn=null;function Ic(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function Ac(){if(vn&&(vn(),vn=null),!l.currentUser||!l.activeSemesterId){l.courses=[],document.dispatchEvent(new Event("courses:changed"));return}const e=T(k,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");vn=G(e,Ic(t=>{const n=t.docs.map(r=>{const a=r.data()||{},s=a.createdAt instanceof co?a.createdAt.toMillis():typeof a.createdAt=="number"?a.createdAt:0;return{id:r.id,...a,createdAtMs:s}});n.sort((r,a)=>a.createdAtMs-r.createdAtMs),l.courses=n,Nc(n),kn==null||kn(),document.dispatchEvent(new Event("courses:changed"))},300))}function Nc(e){const t=u("coursesList");t&&(t.innerHTML="",(e||[]).forEach(n=>{const r=document.createElement("div");r.className="course-item",r.innerHTML=`
  <div>
    <div>
      <b>${Ot(n.name||"Sin nombre")}</b>
      <span class="course-meta">· ${Ot(n.code||"")}</span>
    </div>

    <div class="course-meta">${Ot(n.professor||"")}</div>

    <div class="course-meta" style="display:flex;align-items:center;gap:8px;margin-top:6px;">
      <span
        style="
          display:inline-block;
          width:12px;
          height:12px;
          border-radius:999px;
          background:${Ot(n.color||"#3B82F6")};
          border:1px solid rgba(255,255,255,.25);
        "
      ></span>
      <span>Color: ${Ot((n.color||"#3B82F6").toUpperCase())}</span>
    </div>
  </div>

  <div class="inline">
    <button class="ghost course-edit" data-id="${n.id}">Editar</button>
    <button class="danger course-del"  data-id="${n.id}">Eliminar</button>
  </div>
`,t.appendChild(r)}))}function $c(){var o;l.editingCourseId=null;const e=u("courseName");e&&(e.value="");const t=u("courseCode");t&&(t.value="");const n=u("courseProfessor");n&&(n.value="");const r=u("courseSectPar");r&&(r.value="");const a=u("courseColor");a&&(a.value="#3B82F6");const s=u("courseColorCode");s&&(s.textContent="#3B82F6");const i=u("saveCourseBtn");i&&(i.textContent="Agregar ramo"),(o=u("cancelEditBtn"))==null||o.classList.add("hidden")}function Ot(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ct=null,za=!1;function Pc(){za||(za=!0,Tc())}function rr(){ct&&(ct(),ct=null);const e=u("semestersList");e&&(e.innerHTML=""),Tt()}function Tc(){const e=u("createSemesterBtn");e&&e.addEventListener("click",async()=>{var c;if(!l.currentUser){alert("Debes iniciar sesión.");return}const t=Dc();if(!t){alert("Completa tu universidad en Perfil.");return}const n=(((c=u("semesterLabel"))==null?void 0:c.value)||"").trim();if(!Uc(n)){alert("Formato de semestre inválido. Usa AAAA-1 o AAAA-2 (ej. 2025-2).");return}const r=T(k,"users",l.currentUser.uid,"semesters");if(!(await F(Q(r,Va("label","==",n)))).empty){alert("Ya existe un semestre con ese nombre.");return}let s=localStorage.getItem(`scale_${t}`);if(!s){const d=await new Promise(p=>{const f=document.getElementById("scaleModal"),m=document.getElementById("scaleSelect"),g=document.getElementById("scaleSave"),b=document.getElementById("scaleCancel");f.classList.add("active"),m.value="";const y=C=>{f.classList.remove("active"),g.removeEventListener("click",h),b.removeEventListener("click",w),p(C)},h=()=>{const C=m.value;if(!C)return alert("Selecciona una escala antes de continuar.");localStorage.setItem(`scale_${t}`,C),y(C)},w=()=>{y(null)};g.addEventListener("click",h),b.addEventListener("click",w)});if(!d){console.log("❌ Creación de semestre cancelada por el usuario.");return}s=d}const i=await Ce(r,{label:n,universityAtThatTime:t,gradeScale:s||"0-100",createdAt:Date.now()});u("semesterLabel")&&(u("semesterLabel").value="");const o=l.activeSemesterId||null;if(o&&await zs(o,i.id),await Mr(i.id),await new Promise(d=>setTimeout(d,400)),l.activeSemesterId){console.log(`✅ Semestre ${n} activado (${l.activeSemesterId}), preparando interfaz de ramos...`);const d=ra(t);na(d),Fe(),ta();const p=u("coursesSection");p&&p.classList.remove("hidden")}else console.warn("⚠️ No se estableció correctamente el semestre activo tras la creación.");Yt(),qs()}),document.addEventListener("click",async t=>{const n=t.target;if(n instanceof HTMLElement){if(n.matches(".sem-activate")){if(!l.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;await Mr(r)}if(n.matches(".sem-delete")){if(!l.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;if(!confirm("¿Eliminar este semestre?"))return;await ye($(k,"users",l.currentUser.uid,"semesters",r)),l.activeSemesterId===r&&Tt()}}})}async function Fs(){var m,g,b,y,h,w;if(ct&&(ct(),ct=null),!l.currentUser)return;const e=l.profileData||{},t=((m=e.university)==null?void 0:m.trim())||"",n=((g=e.career)==null?void 0:g.trim())||"",r=((b=e.customUniversity)==null?void 0:b.trim())||"",a=((y=e.customCareer)==null?void 0:y.trim())||"",s=t&&t!=="OTRA"||r&&r!=="",i=n&&n!=="OTRA"||a&&a!=="",o=u("semestersList");if(!s||!i){o&&(o.innerHTML=`
        <div class="card" style="padding:20px; text-align:center;">
          <h3>⚠️ Antes de agregar semestres necesitas configurar tu perfil</h3>
          <p>Completa tu <b>universidad</b> y <b>carrera</b> para poder crear y visualizar semestres.</p>
          <button id="goToProfileBtn" class="btn-primary" style="margin-top:10px;">
            Ir a Perfil ahora →
          </button>
        </div>
      `,(h=u("goToProfileBtn"))==null||h.addEventListener("click",()=>{const C=u("subtabPerfil")||document.querySelector('[data-tab="perfil"]'),A=u("perfilContainer")||document.getElementById("perfilContainer");C&&A&&(document.querySelectorAll(".subtab").forEach(N=>N.classList.remove("active")),document.querySelectorAll(".page").forEach(N=>N.classList.add("hidden")),C.classList.add("active"),A.classList.remove("hidden"))}));return}const c=l.currentUser.uid,d=await ee($(k,"users",c)),p=d.exists()&&((w=d.data())==null?void 0:w.activeSemester)||null;if(p){l.activeSemesterId=p;const C=await ee($(k,"users",c,"semesters",p));l.activeSemesterData=C.exists()?C.data():null}if(l.activeSemesterId&&l.activeSemesterData){console.log("[Semesters] Restaurando semestre activo tras recarga:",l.activeSemesterData.label);const C=u("coursesSection");C&&C.classList.remove("hidden");const A=ra(l.activeSemesterData.universityAtThatTime);na(A),Fe(),ta(),Yt(),qs();const N=u("activeSemesterLabel");N&&(N.textContent=l.activeSemesterData.label||"—");const v=u("activeSemesterUni");v&&(v.textContent=l.activeSemesterData.universityAtThatTime||"—");const I=u("gr-activeSemLabel");I&&(I.textContent=l.activeSemesterData.label||"—");const E=u("gr-scaleSel"),x=u("gr-passThreshold");E&&(E.value=A==="UMAYOR"?"MAYOR":"USM",E.disabled=!0),x&&(x.value=A==="UMAYOR"?4:55),Dt(),ut==null||ut(),ke(),document.dispatchEvent(new Event("semester:changed"))}const f=T(k,"users",c,"semesters");ct=G(Q(f,ve("createdAt","desc")),C=>{const A=u("semestersList");if(!A)return;if(A.innerHTML="",C.empty){Tt();return}if(C.forEach(v=>{const I=v.data(),E=document.createElement("div");E.className="course-item";const x=l.activeSemesterId===v.id;E.innerHTML=`
        <div>
          <div><b>${I.label}</b> <span class="course-meta">· ${I.universityAtThatTime}</span></div>
        </div>
        <div class="inline">
          ${x?'<span class="course-meta">Activo</span>':`<button class="ghost sem-activate" data-id="${v.id}">Activar</button>`}
          <button class="danger sem-delete" data-id="${v.id}">Eliminar</button>
        </div>
      `,A.appendChild(E)}),C.docs.some(v=>v.id===l.activeSemesterId)||Tt(),!l.activeSemesterId&&!C.empty){const v=C.docs[0].id;console.log("[Semesters] No había activo guardado, usando el más reciente:",v),Mr(v)}})}async function zs(e,t){var r;const n=(r=l.currentUser)==null?void 0:r.uid;if(!(!n||!e||!t))try{const a=T(k,"users",n,"semesters",e,"calendar"),s=T(k,"users",n,"semesters",t,"calendar"),i=await F(a);let o=0;for(const c of i.docs){const d=c.data();d.persistent&&(await Ce(s,{...d,createdAt:Date.now()}),o++)}console.log(`🔁 [Semesters] ${o} eventos persistentes copiados de ${e} a ${t}`)}catch(a){console.error("❌ Error copiando eventos persistentes:",a)}}async function Mr(e){var d,p,f,m;if(!l.currentUser||!e)return;l.activeSemesterId=e;const t=await ee($(k,"users",l.currentUser.uid,"semesters",e));l.activeSemesterData=t.exists()?t.data():null,await fe($(k,"users",l.currentUser.uid),{activeSemester:e},{merge:!0}),l.lastActiveSemesterId&&l.lastActiveSemesterId!==e&&await zs(l.lastActiveSemesterId,e),l.lastActiveSemesterId=e;const n=u("activeSemesterLabel");n&&(n.textContent=((d=l.activeSemesterData)==null?void 0:d.label)||"—");const r=u("activeSemesterUni");r&&(r.textContent=((p=l.activeSemesterData)==null?void 0:p.universityAtThatTime)||"—");const a=u("gr-activeSemLabel");a&&(a.textContent=((f=l.activeSemesterData)==null?void 0:f.label)||"—");const s=ra((m=l.activeSemesterData)==null?void 0:m.universityAtThatTime),i=u("gr-scaleSel"),o=u("gr-passThreshold");i&&(i.value=s==="UMAYOR"?"MAYOR":"USM",i.disabled=!0),o&&(o.value=s==="UMAYOR"?4:55);const c=u("coursesSection");c&&c.classList.remove("hidden"),na(s),Fe(),ta(),Dt(),ut==null||ut(),ke(),Fs(),document.dispatchEvent(new Event("semester:changed"))}function Tt(){l.activeSemesterId=null,l.activeSemesterData=null;const e=u("activeSemesterLabel");e&&(e.textContent="—");const t=u("activeSemesterUni");t&&(t.textContent="—");const n=u("coursesSection");n&&n.classList.add("hidden");const r=u("gr-activeSemLabel");r&&(r.textContent="—");const a=u("gr-scaleSel");a&&(a.value="USM",a.disabled=!0);const s=u("gr-passThreshold");s&&(s.value=""),Dt(),ke()}function Uc(e){return/^\d{4}-(1|2)$/.test(e||"")}function Dc(){const e=l.profileData;return!e||!e.university?null:e.university==="OTRA"?(e.customUniversity||"").trim()||null:e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function ra(e){if(!e)return"";const t=e.toLowerCase();return t.includes("mayor")?"UMAYOR":t.includes("utfsm")||t.includes("santa maría")||t.includes("santa maria")?"USM":"OTRA"}async function Bc(){if(!l.currentUser)return;const e=l.currentUser.uid,t=T(k,"users",e,"semesters"),n=await F(t);if(l.semesters=n.docs.map(r=>({id:r.id,...r.data()})),l.activeSemesterId){const r=T(k,"users",e,"semesters",l.activeSemesterId,"courses"),a=await F(r);l.courses=a.docs.map(s=>({id:s.id,...s.data()}))}console.log("📚 preloadCourses:",l.semesters,l.courses)}function Yt(){const e=u("saveCourseBtn");e&&e.dataset.bound!=="1"&&(e.dataset.bound="1",e.addEventListener("click",async()=>{var t,n,r,a,s,i;try{if(!l.currentUser)return alert("Debes iniciar sesión.");const o=l.activeSemesterId;if(!o)return alert("No hay semestre activo.");const c=(t=u("courseName"))==null?void 0:t.value.trim();if(!c)return alert("Ingresa el nombre del ramo.");const d={name:c,code:((n=u("courseCode"))==null?void 0:n.value.trim())||"",professor:((r=u("courseProfessor"))==null?void 0:r.value.trim())||"",section:((a=u("courseSectPar"))==null?void 0:a.value.trim())||"",color:((s=u("courseColor"))==null?void 0:s.value)||"#3B82F6",asistencia:!!((i=document.getElementById("courseAsistencia"))!=null&&i.checked),createdAt:Date.now()};await Ce(T(k,"users",l.currentUser.uid,"semesters",o,"courses"),d),Fe==null||Fe(),console.log("[Courses] ✅ Ramo agregado en",o,d)}catch(o){console.error("❌ Error agregando ramo:",o),alert("No se pudo agregar el ramo. Revisa la consola.")}}))}function qs(){const e=document.getElementById("coursesList");e&&(e.dataset.bound=Date.now(),e.addEventListener("click",async t=>{const n=t.target;if(!(n instanceof HTMLElement))return;const r=l.activeSemesterId;if(!(!l.currentUser||!r)){if(n.matches(".course-del")){const a=n.dataset.id;if(!a||!confirm("¿Seguro que quieres eliminar este ramo?"))return;try{await ye($(k,"users",l.currentUser.uid,"semesters",r,"courses",a)),console.log(`[Courses] Ramo eliminado: ${a}`)}catch(s){console.error("❌ Error eliminando ramo:",s),alert("No se pudo eliminar el ramo.")}}if(n.matches(".course-edit")){const a=n.dataset.id;if(!a)return;try{const s=$(k,"users",l.currentUser.uid,"semesters",r,"courses",a),i=await ee(s);if(i.exists()){const o=i.data();u("courseName").value=o.name||"",u("courseCode").value=o.code||"",u("courseProfessor").value=o.professor||"",u("courseSectPar").value=o.section||"",u("courseColor").value=o.color||"#3B82F6",u("courseColorCode").textContent=(o.color||"#3B82F6").toUpperCase(),u("courseAsistencia").checked=!!o.asistencia;const c=u("saveCourseBtn"),d=u("cancelEditBtn");d.classList.remove("hidden"),c.textContent="Guardar cambios";const p=u("saveCourseBtn").cloneNode(!1);p.textContent="Guardar cambios",c.replaceWith(p);const f=async()=>{try{const m={name:u("courseName").value.trim(),code:u("courseCode").value.trim(),professor:u("courseProfessor").value.trim(),section:u("courseSectPar").value.trim(),color:u("courseColor").value,asistencia:!!u("courseAsistencia").checked};await ae(s,m),console.log(`[Courses] ✅ Ramo actualizado: ${a}`),Fe(),d.classList.add("hidden"),p.textContent="Agregar ramo",Yt()}catch(m){console.error("❌ Error actualizando ramo:",m),alert("No se pudo guardar el ramo editado.")}};p.addEventListener("click",f),d.onclick=()=>{Fe(),d.classList.add("hidden"),p.textContent="Agregar ramo",Yt()},d.onclick=()=>{Fe(),d.classList.add("hidden"),newSaveBtn.textContent="Agregar ramo",Yt()}}}catch(s){console.error("❌ Error al editar ramo:",s),alert("No se pudo cargar el ramo para editar.")}}}}))}let qe=null;function _c(){qe&&(qe(),qe=null),l.unsubscribeProfile=null}function Rc(e){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const t=/^(\d{2})-(\d{2})$/.exec(e);if(t){const n=t[1];return`2000-${t[2]}-${n}`}return""}async function qa(e){const t=await new Promise((r,a)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=a,s.readAsDataURL(e)});return await new Promise((r,a)=>{const s=new Image;s.onload=()=>r(s),s.onerror=a,s.src=t})}function ja(e,t=256,n=.82){const r=document.createElement("canvas"),a=Math.min(e.width,e.height),s=(e.width-a)/2,i=(e.height-a)/2;return r.width=t,r.height=t,r.getContext("2d").drawImage(e,s,i,a,a,0,0,t,t),r.toDataURL("image/jpeg",n)}function zt(e){const t=document.getElementById("pfAvatarCircle");t&&(e&&!e.startsWith("emoji:")?(t.textContent="",t.style.backgroundImage=`url("${e}")`):(t.style.backgroundImage="none",t.textContent="👨‍🎓"))}function Oc(e,t){if(e&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const n=/^(\d{2})-(\d{2})$/.exec(t||"");if(n){const r=n[1];return`2000-${n[2]}-${r}`}return null}let bn=null;const js={UMAYOR:[{value:"MEDVET",label:"Medicina Veterinaria"}],USM:[{value:"ICTEL",label:"Ing. Civil Telemática"}]};function ar(e,t,n){if(!e)return;const r=e.querySelector('option[value="OTRA"]');r&&(r.textContent=n&&n.trim()?`${t}: ${n.trim()}`:t)}function Ys(){var c;qe&&(qe(),qe=null);const e=(c=l.currentUser)==null?void 0:c.uid;if(!e)return;const t=$(k,"users",e),n=$(k,"users",e,"profile","profile"),r=(d,p)=>{const f=(d==null?void 0:d.data())||{},m=(p==null?void 0:p.data())||{};l.profileData={...f,...m,name:(m&&"name"in m?m.name:f==null?void 0:f.name)||(f==null?void 0:f.fullName)||(m==null?void 0:m.fullName)||""},delete l.profileData.fullName,f!=null&&f.name&&!l.profileData.name&&(l.profileData.name=f.name),f!=null&&f.fullName&&!l.profileData.name&&(l.profileData.name=f.fullName),m!=null&&m.name&&(l.profileData.name=m.name),m!=null&&m.fullName&&(l.profileData.name=m.fullName),aa(l.profileData),_n(),ke(),document.dispatchEvent(new Event("profile:changed"))};let a=null,s=null;const i=G(t,d=>{a=d,r(a,s)}),o=G(n,d=>{s=d,r(a,s)});qe=()=>{i(),o()},l.unsubscribeProfile=qe}function Gs(){var i;const e=(o,c="")=>{const d=u(o);d&&(d.value=c)};e("pfName"),e("pfGoogleEmail"),e("pfBirthday"),e("pfFavoriteColor","#22c55e");const t=u("pfColorPreview");t&&(t.style.background="#22c55e");const n=u("pfColorCode");n&&(n.textContent="#22C55E");const r=u("pfUniversity")||u("uniSel");r&&(r.value="");const a=u("pfCareer")||u("careerSel");a&&(a.value="",a.disabled=!0),e("pfEmailUni"),e("pfPhone"),zt(null);const s=u("pfBirthday");s&&((i=s.dataset)==null||delete i.dirty)}function aa(e){var E;const t=u("pfName");t&&!t.dataset.bound&&(t.addEventListener("input",()=>{t.dataset.dirty="1"}),t.dataset.bound="1");const n=u("pfBirthday"),r=u("pfUniversity")||u("uniSel"),a=u("pfCustomUniWrap"),s=u("pfCustomUniversity");s&&!s.dataset.bound&&(s.addEventListener("input",()=>{s.dataset.dirty="1"}),s.dataset.bound="1");const i=u("pfCareer")||u("careerSel"),o=u("pfFavoriteColor"),c=u("pfColorPreview"),d=u("pfColorCode"),p=u("pfEmailUni")||u("pfEmail");p&&!p.dataset.bound&&(p.addEventListener("input",()=>{p.dataset.dirty="1"}),p.dataset.bound="1");const f=u("pfPhone")||u("pfTelefono");f&&!f.dataset.bound&&(f.addEventListener("input",()=>{f.dataset.dirty="1"}),f.dataset.bound="1");const m=u("pfGoogleEmail"),g=u("pfCancelBtn"),b=(x,S)=>{if(!i)return;i.innerHTML='<option value="">Selecciona tu carrera…</option>';const L=js[x]||[];for(const{value:U,label:B}of L){const P=document.createElement("option");P.value=U,P.textContent=B,i.appendChild(P)}const M=document.createElement("option");M.value="OTRA",M.textContent="Otra",i.appendChild(M),i.disabled=!1,S&&i.querySelector(`option[value="${S}"]`)?i.value=S:i.value="",ar(i,"Otra",e==null?void 0:e.customCareer)};if(g&&!g.dataset.bound&&(g.onclick=()=>{var M,U;const x=l.profileData||null,S=u("pfUniversity")||u("uniSel"),L=u("pfCareer")||u("careerSel");if([u("pfName"),u("pfBirthday"),u("pfFavoriteColor"),u("pfEmailUni")||u("pfEmail"),u("pfPhone")||u("pfTelefono"),u("pfCustomUniversity"),u("pfCustomCareer"),S,L].forEach(B=>{B&&delete B.dataset.dirty}),S){const B=(x==null?void 0:x.university)||"";B==="Universidad Mayor"?S.value="UMAYOR":B==="UTFSM"||B==="USM"?S.value="USM":S.value=B||"",B==="OTRA"&&(S.value="OTRA")}L&&(b((S==null?void 0:S.value)||"",(x==null?void 0:x.career)||null),(x==null?void 0:x.career)==="OTRA"&&(L.value="OTRA")),(M=u("pfCustomUniWrap"))==null||M.classList.toggle("hidden",(S==null?void 0:S.value)!=="OTRA"),(S==null?void 0:S.value)==="OTRA"&&u("pfCustomUniversity")&&(u("pfCustomUniversity").value=(x==null?void 0:x.customUniversity)||""),(U=u("pfCustomCareerWrap"))==null||U.classList.toggle("hidden",(L==null?void 0:L.value)!=="OTRA"),(L==null?void 0:L.value)==="OTRA"&&u("pfCustomCareer")&&(u("pfCustomCareer").value=(x==null?void 0:x.customCareer)||""),aa(x)},g.dataset.bound="1"),m&&((E=l.currentUser)!=null&&E.email)&&(m.value=l.currentUser.email),p){const x=document.activeElement===p,S=p.dataset.dirty==="1";!x&&!S&&(p.value=(e==null?void 0:e.uniEmail)||"")}if(f){const x=document.activeElement===f,S=f.dataset.dirty==="1";!x&&!S&&(f.value=(e==null?void 0:e.phone)||"")}if(t){const x=document.activeElement===t,S=t.dataset.dirty==="1";!x&&!S&&(t.value=(e==null?void 0:e.fullName)||(e==null?void 0:e.name)||"")}if(n){const x=Rc((e==null?void 0:e.birthday)||""),S=document.activeElement===n,L=n.dataset.dirty==="1";!S&&!L&&(n.value=x||"",x?n.setAttribute("value",x):n.removeAttribute("value")),n.dataset.bound||(n.addEventListener("change",M=>{const U=M.target.value||"";n.dataset.dirty="1",n.value=U,U?n.setAttribute("value",U):n.removeAttribute("value"),l.profileData={...l.profileData||{},birthday:U}}),n.addEventListener("paste",M=>M.preventDefault()),n.addEventListener("drop",M=>M.preventDefault()),n.dataset.bound="1")}if(r){const x=document.activeElement===r,S=r.dataset.dirty==="1";if(!x&&!S){const L=(e==null?void 0:e.university)||"";L==="Universidad Mayor"?r.value="UMAYOR":L==="UTFSM"||L==="USM"?r.value="USM":r.value=L,ar(r,"Otra",e==null?void 0:e.customUniversity)}if(r&&i){const L=document.activeElement===i,M=i.dataset.dirty==="1";!L&&!M&&(b(r.value,(e==null?void 0:e.career)||null),ar(i,"Otra",e==null?void 0:e.customCareer))}}r&&!r.dataset.bound&&(r.addEventListener("change",()=>{r.dataset.dirty="1"}),r.dataset.bound="1"),a&&a.classList.add("hidden"),s&&(s.value="");const y=(r==null?void 0:r.value)==="OTRA";if(a&&a.classList.toggle("hidden",!y),y&&s&&s){const x=document.activeElement===s,S=s.dataset.dirty==="1";!x&&!S&&(s.value=(e==null?void 0:e.customUniversity)||"")}const h=u("pfCustomCareerWrap"),w=u("pfCustomCareer");w&&!w.dataset.bound&&(w.addEventListener("input",()=>{w.dataset.dirty="1"}),w.dataset.bound="1"),h&&h.classList.add("hidden"),w&&(w.value="");const C=(i==null?void 0:i.value)==="OTRA";if(h&&h.classList.toggle("hidden",!C),C&&w&&w){const x=document.activeElement===w,S=w.dataset.dirty==="1";!x&&!S&&(w.value=(e==null?void 0:e.customCareer)||"")}if(i&&!i.dataset.bound&&(i.addEventListener("change",()=>{i.dataset.dirty="1";const x=i.value==="OTRA";h&&h.classList.toggle("hidden",!x),!x&&w&&(w.value="")}),i.dataset.bound="1"),o){const x=document.activeElement===o,S=o.dataset.dirty==="1";if(!x&&!S){const L=Mn(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";o.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}if(r&&(r.onchange=()=>{const x=r.value==="OTRA";a&&a.classList.toggle("hidden",!x),!x&&s&&(s.value=""),b(r.value,null)}),i&&(e==null?void 0:e.career)==="OTRA"&&(e!=null&&e.customCareer)){const x=document.activeElement===i,S=i.dataset.dirty==="1";!x&&!S&&(i.value="OTRA")}if(o){const x=document.activeElement===o,S=o.dataset.dirty==="1";if(!x&&!S){const L=Mn(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";o.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}o&&!o.dataset.bound&&(o.addEventListener("input",x=>{const S=x.target.value;o.dataset.dirty="1",Mn(S)&&(c&&(c.style.background=S),d&&(d.textContent=S.toUpperCase()))}),o.dataset.bound="1");const A=u("pfAvatarBtn"),N=u("pfAvatarFile");zt((e==null?void 0:e.avatarData)||"emoji:👨‍🎓");let v=document.getElementById("pfDeleteAvatarBtn");v||(v=document.createElement("button"),v.id="pfDeleteAvatarBtn",v.className="btn btn-secondary",v.textContent="Eliminar foto de perfil",A.insertAdjacentElement("afterend",v)),N&&!N.dataset.bound&&(N.addEventListener("change",async x=>{var L;const S=(L=x.target.files)==null?void 0:L[0];if(S){if(!/^image\//.test(S.type)){alert("Elige una imagen válida.");return}try{const M=await qa(S),U=ja(M,256,.82);if(zt(U),!l.currentUser)return;await ae($(k,"users",l.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),A.textContent="Avatar actualizado ✓",setTimeout(()=>A.textContent="Cambiar avatar",1500)}catch(M){console.error(M),alert("No se pudo procesar la imagen.")}finally{x.target.value=""}}}),N.dataset.bound="1"),v.dataset.bound||(v.addEventListener("click",async()=>{if(l.currentUser&&confirm("¿Seguro que deseas eliminar tu foto de perfil?"))try{await ae($(k,"users",l.currentUser.uid),{avatarData:null,avatarUrl:null,avatarUpdatedAt:Date.now()}),zt("emoji:👨‍🎓"),alert("Avatar eliminado. Se restauró el emoji predeterminado 👨‍🎓.")}catch(x){console.error(x),alert("No se pudo eliminar el avatar.")}}),v.dataset.bound="1"),N&&!N.dataset.bound&&(N.addEventListener("change",async x=>{var L;const S=(L=x.target.files)==null?void 0:L[0];if(S){if(!/^image\//.test(S.type)){alert("Elige una imagen.");return}try{const M=await qa(S),U=ja(M,256,.82);if(zt(U),!l.currentUser)return;await ae($(k,"users",l.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),A&&(A.textContent="Avatar actualizado ✓",setTimeout(()=>A.textContent="Cambiar avatar",1500))}catch(M){console.error(M),alert("No se pudo procesar la imagen.")}finally{x.target.value=""}}}),N.dataset.bound="1");const I=u("pfSaveBtn");I&&!I.dataset.bound&&(I.onclick=()=>Vs(),I.dataset.bound="1")}async function Vs(){var P,_,z,H,R,j,q,ce,Te;if(!l.currentUser)return;const e=u("pfUniversity")||u("uniSel"),t=u("pfCareer")||u("careerSel"),n=((e==null?void 0:e.value)||"").trim()||null,r=n&&["UMAYOR","USM","OTRA"].includes(n),a=u("pfCustomUniversity")||u("uniCustom")||null,s=((a==null?void 0:a.value)||"").trim()||null,i=n?r?n:"OTRA":null;let o=null;n?r?n==="OTRA"&&(o=s||((P=l.profileData)==null?void 0:P.customUniversity)||null):o=n:o=null;const c=((t==null?void 0:t.value)||"").trim()||null,d=c&&["MEDVET","ICTEL","OTRA"].includes(c),p=u("pfCustomCareer")||u("careerCustom")||null,f=((p==null?void 0:p.value)||"").trim()||null,m=c?d?c:"OTRA":null;let g=null;c?d?c==="OTRA"&&(g=f||((_=l.profileData)==null?void 0:_.customCareer)||null):g=c:g=null;const b=((z=u("pfFavoriteColor"))==null?void 0:z.value)||null,y=(((H=u("pfEmailUni")||u("pfEmail"))==null?void 0:H.value)||"").trim(),h=(((R=u("pfPhone")||u("pfTelefono"))==null?void 0:R.value)||"").trim(),w=l.currentUser.uid,C=(e==null?void 0:e.value)||null;if(!(!y||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(y))){alert("Email universitario no es válido.");return}if(!(!h||/^[+()\s0-9-]{6,}$/.test(h))){alert("Teléfono no es válido.");return}t&&((j=js[C])!=null&&j.some(xe=>xe.value===t.value))&&t.value;const v=((q=u("pfBirthday"))==null?void 0:q.value)||null,I=((ce=l.profileData)==null?void 0:ce.birthday)||null,E=Oc(v,I),S={name:((Te=u("pfName"))==null?void 0:Te.value.trim())||null,birthday:E??null,university:i,customUniversity:o,career:m,customCareer:g,favoriteColor:Mn(b)?b:null,uniEmail:y||null,phone:h||null,updatedAt:Date.now()},L=$(k,"users",w,"profile","profile");await fe(L,S,{merge:!0}),l.profileData={...l.profileData||{},...S};const M=document.getElementById("pfSaveBtn");if(M){const xe=M.textContent;M.textContent="Guardado ✓",M.disabled=!0,setTimeout(()=>{M.textContent=xe,M.disabled=!1},1800)}const U=document.getElementById("pfBirthday");U&&delete U.dataset.dirty;const B=u("pfName");B&&delete B.dataset.dirty,["pfEmailUni","pfPhone","pfCustomUniversity","pfCustomCareer"].forEach(xe=>{const _t=u(xe);_t&&delete _t.dataset.dirty})}function _n(){var t,n;const e=!!(l.profileData&&l.profileData.university&&(l.profileData.university!=="OTRA"||l.profileData.university==="OTRA"&&((t=l.profileData.customUniversity)!=null&&t.trim())));(n=u("semNoticeNoUni"))==null||n.classList.toggle("hidden",e),u("createSemesterBtn")&&(u("createSemesterBtn").disabled=!e||!l.currentUser),u("semesterLabel")&&(u("semesterLabel").disabled=!e),u("semesterUniFromProfile")&&(u("semesterUniFromProfile").value=e?Hc(l.profileData):""),u("createPairBtn")&&(u("createPairBtn").disabled=!l.currentUser)}function Hc(e){return!e||!e.university?"":e.university==="OTRA"?e.customUniversity||"Otra":e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function Fc(e){return!e||!e.career?"":e.career==="OTRA"?e.customCareer||"Otra":e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career}function Mn(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Ws(){const e=u("page-perfil");if(!e)return;let t=u("partnerProfileCard");t||(t=document.createElement("div"),t.className="card",t.id="partnerProfileCard",t.innerHTML=`
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
    `,t.classList.add("hidden"),e.appendChild(t));const n=()=>{u("pp-name").innerHTML="<b>Nombre:</b> —",u("pp-uni").innerHTML="<b>Universidad:</b> —",u("pp-career").innerHTML="<b>Carrera:</b> —",u("pp-bday").innerHTML="<b>Fecha de nacimiento:</b> —",u("pp-email").innerHTML="<b>Email universitario:</b> —",u("pp-phone").innerHTML="<b>Teléfono:</b> —",u("pp-color-code").textContent="—";const m=u("pp-color-swatch");m&&(m.style.background="transparent",m.style.border="1px solid rgba(255,255,255,.25)")};if(bn&&(bn(),bn=null),!l.pairOtherUid){n(),t&&t.classList.add("hidden");return}const r=$(k,"users",l.pairOtherUid),a=$(k,"users",l.pairOtherUid,"profile","profile");t.classList.remove("hidden");let s=null,i=null;const o=()=>{const m={...(s==null?void 0:s.data())||{},...(i==null?void 0:i.data())||{}},g=u("pp-avatar");g&&(m.avatarData?(g.style.backgroundImage=`url("${m.avatarData}")`,g.textContent=""):(g.style.backgroundImage="none",g.textContent="👨‍🎓",g.style.display="flex",g.style.alignItems="center",g.style.justifyContent="center",g.style.fontSize="2rem")),u("pp-name").innerHTML=`<b>Nombre:</b> ${m.name||"—"}`,u("pp-uni").innerHTML=`<b>Universidad:</b> ${d(m)}`,u("pp-career").innerHTML=`<b>Carrera:</b> ${Fc(m)||"—"}`,u("pp-bday").innerHTML=`<b>Fecha de nacimiento:</b> ${c(m.birthday)}`,u("pp-email").innerHTML=`<b>Email universitario:</b> ${m.uniEmail||"—"}`,u("pp-phone").innerHTML=`<b>Teléfono:</b> ${m.phone||"—"}`;const b=typeof m.favoriteColor=="string"&&/^#[0-9A-Fa-f]{6}$/.test(m.favoriteColor)?m.favoriteColor:"#ff69b4",y=u("pp-color-swatch");y&&(y.style.background=b);const h=u("pp-color-code");h&&(h.textContent=b.toUpperCase())},c=m=>{if(!m)return"—";const g=/^(\d{4})-(\d{2})-(\d{2})$/.exec(m);return g?`${g[3]}/${g[2]}/${g[1]}`:m},d=m=>m!=null&&m.university?m.university==="UMAYOR"?"Universidad Mayor":m.university==="USM"?"UTFSM":m.university==="OTRA"?m.customUniversity||"Otra":m.university:"—",p=G(r,m=>{s=m,o()}),f=G(a,m=>{i=m,o()});bn=()=>{p(),f()}}document.addEventListener("pair:ready",()=>{Ws()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("uniSel"),t=document.getElementById("careerSel");function n(y,h,w){if(document.getElementById(y))return document.getElementById(y);const C=document.createElement("div");return C.id=y,C.className="modal",C.innerHTML=`
      <div class="modal-content" style="max-width:400px;text-align:center;">
        <h3>${h}</h3>
        <input id="${y}Input" type="text" placeholder="${w}" 
          style="width:100%;margin-top:1rem;padding:.8rem;border-radius:8px;
          border:none;background:rgba(255,255,255,0.1);color:white;">
        <div style="margin-top:1rem;display:flex;justify-content:center;gap:1rem;">
          <button id="${y}Save" class="btn">Guardar</button>
          <button id="${y}Cancel" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>`,document.body.appendChild(C),C}const r=n("uniModal","Agregar nueva universidad","Escribe el nombre..."),a=n("careerModal","Agregar nueva carrera","Escribe el nombre...");function s(y){y.classList.add("active");const h=y.querySelector("input");h.value="",h.focus()}function i(y){y.classList.remove("active")}e&&e.addEventListener("change",()=>{e.value==="OTRA"?s(r):t&&(t.disabled=!1)});const o=r.querySelector("#uniModalSave"),c=r.querySelector("#uniModalCancel"),d=r.querySelector("#uniModalInput");o.addEventListener("click",p),c.addEventListener("click",()=>i(r)),r.addEventListener("click",y=>{y.target===r&&i(r)}),d.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),p())});function p(){const y=d.value.trim();if(!y)return;if(!Array.from(e.options).find(w=>w.value===y)){const w=document.createElement("option");w.value=y,w.textContent=y,e.appendChild(w)}e.value=y,t&&(t.disabled=!1),i(r)}t&&t.addEventListener("change",()=>{t.value==="OTRA"&&s(a)});const f=a.querySelector("#careerModalSave"),m=a.querySelector("#careerModalCancel"),g=a.querySelector("#careerModalInput");f.addEventListener("click",b),m.addEventListener("click",()=>i(a)),a.addEventListener("click",y=>{y.target===a&&i(a)}),g.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),b())});function b(){const y=g.value.trim();if(!y)return;if(!Array.from(t.options).find(w=>w.value===y)){const w=document.createElement("option");w.value=y,w.textContent=y,t.appendChild(w)}t.value=y,i(a)}});const zc=Object.freeze(Object.defineProperty({__proto__:null,clearProfileUI:Gs,fillProfileForm:aa,listenProfile:Ys,mountPartnerProfileCard:Ws,reflectProfileInSemestersUI:_n,saveProfile:Vs,stopProfileListener:_c},Symbol.toStringTag,{value:"Module"}));function Ya(e){document.querySelectorAll(".nav-tab[data-route]").forEach(t=>{t.dataset.route!=="#/perfil"&&(t.toggleAttribute("disabled",e),t.setAttribute("aria-disabled",String(e)))})}function qc(){if(window.__PartyPlannerAuthInit)return;window.__PartyPlannerAuthInit=!0;const e=u("signInBtn"),t=u("signOutBtn"),n=u("switchAccountBtn"),r=u("userBadge"),a=u("userName"),s=c=>{e&&(e.disabled=c),t&&(t.disabled=c),n&&(n.disabled=c)},i=c=>{r&&(r.classList.remove("hidden"),r.style.display="inline-flex"),e&&(e.classList.add("hidden"),e.style.display="none"),a&&(a.textContent=c||"—");const d=u("createPairBtn"),p=u("copyInviteBtn");d&&(d.disabled=!1),p&&(p.disabled=!1),Ya(!1)},o=()=>{r&&(r.classList.add("hidden"),r.style.display="none"),e&&(e.classList.remove("hidden"),e.style.display="inline-block");const c=u("pairId"),d=u("copyInviteBtn"),p=u("createPairBtn");c&&(c.textContent="—"),d&&(d.disabled=!0),p&&(p.disabled=!0),l.profileData=null,_n(),Tt();const f=u("semestersList");f&&(f.innerHTML=""),Ya(!0),location.hash="#/perfil"};e&&e.addEventListener("click",async()=>{s(!0);const c=new la;c.setCustomParameters({prompt:"select_account"});try{await ca(wt,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Login cancelado por el usuario."):alert(`No se pudo iniciar sesión: ${p||d.message||d}`))}finally{s(!1)}}),n&&n.addEventListener("click",async()=>{s(!0);const c=new la;c.setCustomParameters({prompt:"select_account"});try{await da(wt),await ca(wt,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Cambio de cuenta cancelado por el usuario."):alert(`No se pudo cambiar de cuenta: ${p||d.message||d}`))}finally{s(!1)}}),t&&t.addEventListener("click",async()=>{var c;s(!0);try{await da(wt),l.currentUser=null,l.profileData=null,(c=l.unsubscribeProfile)==null||c.call(l),l.unsubscribeProfile=null,rr==null||rr(),Tt(),Gs(),o(),ke()}catch(d){console.error(d),alert(`No se pudo cerrar sesión: ${d.code||d.message||d}`)}finally{s(!1)}}),so(wt,async c=>{if(s(!1),c){window.__heartbeat||(window.__heartbeat=setInterval(()=>{Kn(!0)},2e3)),l.currentUser=c,await Kn(!0),i(c.displayName||c.email||c.uid);try{await jc(c)}catch(d){console.error("ensureUserDoc failed:",d)}try{await Bc(),console.log("✅ Semestres y cursos precargados")}catch(d){console.warn("⚠️ Error precargando cursos:",d)}try{Ys(),_n()}catch(d){console.error("profile listen failed:",d)}setTimeout(()=>{xo().catch(d=>console.error("loadMyPair failed:",d))},800),setTimeout(()=>{Fs().catch(d=>console.error("refreshSemestersSub failed:",d))},1500),setTimeout(()=>{de(()=>Promise.resolve().then(()=>zc),void 0,import.meta.url).then(d=>{var p;return(p=d.mountPartnerProfileCard)==null?void 0:p.call(d)}).catch(()=>{})},2500),ke()}else window.__heartbeat&&(clearInterval(window.__heartbeat),window.__heartbeat=null),l.currentUser&&await Kn(!1),l.currentUser=null,o(),ke()})}async function jc(e){var r,a,s,i;const t=$(k,"users",e.uid);(await ee(t)).exists()?await fe(t,{email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((i=(s=e.providerData)==null?void 0:s[0])==null?void 0:i.providerId)||"google",lastLoginAt:Date.now()},{merge:!0}):await fe(t,{createdAt:Date.now(),email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((a=(r=e.providerData)==null?void 0:r[0])==null?void 0:a.providerId)||"google",preferences:{showNamesInShared:!0,theme:"dark"},lastLoginAt:Date.now()},{merge:!0})}let ne={},Ir=[];function Js(e){const t=(e||"#/perfil").trim();return new Set(["#/perfil","#/semestres","#/horario","#/notas","#/malla","#/calendario","#/progreso","#/asistencia","#/party","#/ayuda"]).has(t)?t:"#/perfil"}function Yc(e){const t=Js(e);location.hash!==t&&(location.hash=t),Ar(t)}function Ar(e){const t=Js(e),n=document.getElementById("pfActions");n&&n.classList.toggle("hidden",t!=="#/perfil"),Ir.forEach(r=>r.classList.toggle("active",r.dataset.route===t)),Object.values(ne).forEach(r=>r&&r.classList.add("hidden")),t==="#/perfil"&&ne.perfil&&ne.perfil.classList.remove("hidden"),t==="#/semestres"&&ne.semestres&&ne.semestres.classList.remove("hidden"),t==="#/horario"&&ne.horario&&ne.horario.classList.remove("hidden"),t==="#/notas"&&ne.notas&&(ne.notas.classList.remove("hidden"),document.dispatchEvent(new Event("route:notas"))),t==="#/malla"&&ne.malla&&ne.malla.classList.remove("hidden"),t==="#/progreso"&&ne.progreso&&ne.progreso.classList.remove("hidden"),t==="#/calendario"&&ne.calendario&&(ne.calendario.classList.remove("hidden"),document.dispatchEvent(new Event("route:calendario"))),t==="#/asistencia"&&ne.asistencia&&ne.asistencia.classList.remove("hidden"),t==="#/party"&&ne.party&&ne.party.classList.remove("hidden"),t==="#/ayuda"&&ne.ayuda&&ne.ayuda.classList.remove("hidden"),document.dispatchEvent(new CustomEvent("route:change",{detail:{route:t}}))}function Gc(){ne={perfil:u("page-perfil"),semestres:u("page-semestres"),horario:u("page-horario"),notas:u("page-notas"),malla:u("page-malla"),calendario:u("page-calendario"),progreso:u("page-progreso"),asistencia:u("page-asistencia"),party:u("page-party"),ayuda:u("page-ayuda")},Ir=Array.from(document.querySelectorAll(".tab[data-route]"))||[],Ir.forEach(e=>e.addEventListener("click",()=>Yc(e.dataset.route))),window.addEventListener("hashchange",()=>Ar(location.hash)),Ar(location.hash||"#/perfil")}async function Vc(){const e=await fetch("data/medvet_malla.csv").then(n=>n.text()).catch(()=>""),t=await fetch("data/ictel_malla.csv").then(n=>n.text()).catch(()=>"");return{MEDVET:e?Wc(e):[],ICTEL:t?Jc(t):[]}}function Ks(e){const t=e.trim().split(/\r?\n/).filter(Boolean);if(!t.length)return[];const n=t[0],r=n.split(";").length>=n.split(",").length?";":",",a=n.split(r).map(s=>s.trim().replace(/^['\"]|['\"]$/g,""));return t.slice(1).map(s=>{const i=s.split(r).map(c=>c.trim().replace(/^['\"]|['\"]$/g,"")),o={};return a.forEach((c,d)=>o[c]=i[d]??""),o})}function Wc(e){return Ks(e).map(n=>{let r=n["Código Asignatura"]||n["Codigo Asignatura"]||"";return r.includes(".")&&(r=r.split(".")[0]),{codigo:r,nivel:(n.Nivel||"").trim()}})}function Jc(e){return Ks(e).map(n=>{const r={};for(const[i,o]of Object.entries(n)){const c=i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();r[c]=(o||"").trim()}const a=(...i)=>{for(const o of i){const c=o.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();if(c in r&&r[c])return r[c]}return""};let s=a("Sigla","Código","Codigo","Código Asignatura","Codigo Asignatura");return s||(s=a("Código Asignatura","Codigo Asignatura","Código","Codigo")),{codigo:s||"",nivel:(a("Nivel","Semestre")||"").toUpperCase()}})}function Kc(){var n,r;const e=((n=l.profileData)==null?void 0:n.university)||"GEN",t=((r=l.profileData)==null?void 0:r.career)||"GEN";try{return JSON.parse(localStorage.getItem(`mallaAprobados:${e}:${t}`)||"[]")}catch{return[]}}function sr(e,t){return t?e/t*100:0}function or(e){return`${(Math.round(e*10)/10).toFixed(1)}%`}let ze=null,hn=null;async function Zc(){ze=await Vc(),document.addEventListener("profile:changed",nt),document.addEventListener("malla:updated",nt),document.addEventListener("courses:changed",nt),document.addEventListener("pair:ready",nt),document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/progreso"&&nt()})}async function nt(){var o;const e=u("prog-combinado");if(!e)return;e.classList.remove("hidden"),e.innerHTML='<h3 style="margin:0 0 8px">Progreso combinado</h3><div class="muted">Conectando…</div>';const t=((o=l.profileData)==null?void 0:o.career)||null;if(!t||!ze){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Completa tu perfil antes de ver el progreso. 🌱</div>`;return}const n=ze&&ze[t]?ze[t].length:0,r=Kc(),a=n?sr(r.length,n):0;hn&&(hn(),hn=null);const s=l.pairOtherUid||null;if(!s){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Aún no estás conectado a un dúo. Crea o únete a una party. 👥</div>`;return}const i=$(k,"users",s,"malla","state");hn=G(i,async c=>{const d=c.data()||{};let p=d.career||null;if((p==="UMAYOR"||p==="USM")&&(p=null),!p)try{const b=await ee($(k,"users",s));if(b.exists()){const y=b.data()||{};y.career&&(p=y.career)}}catch{}const f=Array.isArray(d.approved)?d.approved.length:0,m=p&&ze&&ze[p]?ze[p].length:0,g=n+m?sr(r.length+f,n+m):0;e.innerHTML=`
      <h3 style="margin:0 0 8px">🏁 Progreso combinado</h3>
      <div style="font-weight:600; margin-bottom:4px">Juntos llevan ${or(g)}</div>
      <div class="progress-outer small"><div class="progress-inner" style="width:${g}%;"></div></div>
      <div class="muted" style="margin-top:6px">Tú: ${or(a)} · Duo: ${or(sr(f,m))}</div>
    `},c=>{e.innerHTML='<div class="muted">Error al conectar con el progreso del dúo.</div>'})}(function(){const t="prog-inline-styles";if(document.getElementById(t))return;const n=document.createElement("style");n.id=t,n.textContent=`
    .progress-outer{background:rgba(255,255,255,.08); border:1px solid rgba(0,0,0,.25);
      border-radius:10px; height:14px; margin-top:8px; overflow:hidden}
    .progress-outer.small{height:10px}
    .progress-inner{height:100%; background:linear-gradient(90deg, var(--primary), var(--accent));}
  `,document.head.appendChild(n)})();document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/party"&&nt()});const Ga=Object.freeze(Object.defineProperty({__proto__:null,initProgreso:Zc,refreshProgreso:nt},Symbol.toStringTag,{value:"Module"}));window.addEventListener("DOMContentLoaded",async()=>{await Promise.all([qc(),Gc(),ho(),Pc()]);const e=location.hash;e.startsWith("#/malla")?de(()=>import("./malla-fef5tfbU.js"),[],import.meta.url).then(t=>{var n;return(n=t.initMallaOnRoute)==null?void 0:n.call(t)}):e.startsWith("#/notas")?de(()=>Promise.resolve().then(()=>Fa),void 0,import.meta.url).then(t=>{var n;return(n=t.initGrades)==null?void 0:n.call(t)}):e.startsWith("#/asistencia")?de(()=>Promise.resolve().then(()=>Ba),void 0,import.meta.url).then(t=>{var n;return(n=t.initAttendance)==null?void 0:n.call(t)}):e.startsWith("#/horario")?de(()=>Promise.resolve().then(()=>Aa),void 0,import.meta.url).then(t=>{var n;return(n=t.initSchedule)==null?void 0:n.call(t)}):e.startsWith("#/calendario")?de(()=>Promise.resolve().then(()=>Da),void 0,import.meta.url).then(t=>{var n;return(n=t.initCalendar)==null?void 0:n.call(t)}):e.startsWith("#/progreso")&&de(()=>Promise.resolve().then(()=>Ga),void 0,import.meta.url).then(t=>{var n;return(n=t.initProgreso)==null?void 0:n.call(t)}),document.addEventListener("route:change",async t=>{var r,a,s,i,o,c;const n=t.detail.route;if(n.startsWith("#/notas")){const d=await de(()=>Promise.resolve().then(()=>Fa),void 0,import.meta.url);(r=d.initGrades)==null||r.call(d)}else if(n.startsWith("#/malla")){const d=await de(()=>import("./malla-fef5tfbU.js"),[],import.meta.url);(a=d.initMallaOnRoute)==null||a.call(d)}else if(n.startsWith("#/asistencia")){const d=await de(()=>Promise.resolve().then(()=>Ba),void 0,import.meta.url);(s=d.initAttendance)==null||s.call(d)}else if(n.startsWith("#/horario")){const d=await de(()=>Promise.resolve().then(()=>Aa),void 0,import.meta.url);(i=d.initSchedule)==null||i.call(d)}else if(n.startsWith("#/calendario")){const d=await de(()=>Promise.resolve().then(()=>Da),void 0,import.meta.url);(o=d.initCalendar)==null||o.call(d)}else if(n.startsWith("#/progreso")){const d=await de(()=>Promise.resolve().then(()=>Ga),void 0,import.meta.url);(c=d.initProgreso)==null||c.call(d)}})});export{u as $,Hn as c,k as d,Tr as p,l as s};
