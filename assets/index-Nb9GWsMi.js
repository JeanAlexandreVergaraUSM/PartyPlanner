import{getApps as Ps,getApp as Ds,initializeApp as _s}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";import{getAuth as Bs,setPersistence as Rs,browserLocalPersistence as Os,GoogleAuthProvider as Wr,signInWithPopup as Jr,signOut as Kr,onAuthStateChanged as Hs}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";import{initializeFirestore as qs,persistentLocalCache as zs,updateDoc as ae,doc as N,query as Q,collection as P,getDocs as F,setDoc as ye,arrayRemove as br,getDoc as te,deleteDoc as fe,onSnapshot as G,arrayUnion as Fs,orderBy as Se,addDoc as Ee,where as Aa,serverTimestamp as $a,Timestamp as js}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";import Ys from"https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm";import{jsPDF as Gs}from"https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const Vs="modulepreload",Ws=function(e,t){return new URL(e,t).href},Zr={},de=function(t,n,r){let a=Promise.resolve();if(n&&n.length>0){const i=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));a=Promise.allSettled(n.map(d=>{if(d=Ws(d,r),d in Zr)return;Zr[d]=!0;const p=d.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(!!r)for(let x=i.length-1;x>=0;x--){const y=i[x];if(y.href===d&&(!p||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":Vs,p||(v.as="script"),v.crossOrigin="",v.href=d,c&&v.setAttribute("nonce",c),document.head.appendChild(v),p)return new Promise((x,y)=>{v.addEventListener("load",x),v.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return a.then(i=>{for(const o of i||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})},Js={apiKey:"AIzaSyB45g_2KRGlXH0iAPyBGuCnrFkhxCHadKs",authDomain:"nacholo.firebaseapp.com",projectId:"nacholo",storageBucket:"nacholo.appspot.com",messagingSenderId:"924503328068",appId:"1:924503328068:web:1f753ced7f47ec36750311"},Na=Ps().length?Ds():_s(Js),C=qs(Na,{localCache:zs()}),bt=Bs(Na);Rs(bt,Os).catch(()=>{});const l={currentUser:null,currentPartyId:null,partyMembers:[],partyProfiles:{},profileData:null,activeSemesterId:null,activeSemesterData:null,unsubscribeCourses:null,editingCourseId:null,shared:{horario:{semId:null},notas:{semId:null},malla:{enabled:!1},calendar:{semId:null}},DEBUG:(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(new URLSearchParams(location.search).has("debug")||((window==null?void 0:window.PartyPlannerDebug)??!1))},u=e=>typeof e=="string"?document.getElementById(e):null;function Le(){var t;if(!l.DEBUG)return;const e=u("state");e&&(e.textContent=JSON.stringify({uid:((t=l.currentUser)==null?void 0:t.uid)||null,partyId:l.currentPartyId,members:l.partyMembers,profileData:l.profileData,activeSemesterId:l.activeSemesterId,editingCourseId:l.editingCourseId},null,2))}function en(e,t){e&&(t?e.classList.add("hidden"):e.classList.remove("hidden"))}window.__state=l;let tt=null,Ge={};function Un(){const e={members:l.partyMembers};document.dispatchEvent(new CustomEvent("party:ready",{detail:e})),document.dispatchEvent(new CustomEvent("party:changed",{detail:e})),hr()}function Ks(e){return e.university?e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university==="OTRA"?e.customUniversity||"Otra":e.university:"—"}function Zs(e){return e.career?e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career==="OTRA"?e.customCareer||"Otra":e.career:"—"}function Xs(e){if(!e)return"—";const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}/${t[2]}/${t[1]}`:e}function Qs(e,t){const n=e.name||e.fullName||"Usuario",r=Ks(e),a=Zs(e),s=Xs(e.birthday),i=e.uniEmail||"—",o=e.phone||"—",c=e.favoriteColor||"#6366f1",d=e.avatarData?`<div class="party-member-icon" 
         style="background-image:url('${e.avatarData}');
                background-size:cover;background-position:center">
       </div>`:`<div class="party-member-icon" style="background:${c}">
         ${n.charAt(0).toUpperCase()}
       </div>`,p=l.partyMembers[0],m=l.currentUser.uid===p,f=t===p,v=m&&!f?`<button class="kick-btn" data-kick="${t}">Quitar</button>`:"",x=m&&!f?`<button class="transfer-btn" data-transfer="${t}">👑 Transferir host</button>`:"",y=e.lastOnline||0,E=Date.now()-y<3e3;return`
    <div class="party-member-card">
      ${d}
      <div class="party-member-info">
        <div class="name-row">
          <b>${n}</b>
          ${f?'<span class="host-badge">👑 HOST</span>':""}
          ${v}
          ${x}
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
      <span class="conn-dot ${E?"on":"off"}"></span>
      <span>${E?"Conectado":"Desconectado"}</span>
  </div>
`}

      </div>
    </div>
  `}async function hr(){const e=u("partyMembersList");if(!e)return;if(!l.currentPartyId){e.innerHTML='<p class="muted">No estás en ninguna party.</p>';return}if(!l.partyMembers.length){e.innerHTML='<p class="muted">Aún no hay miembros en esta party.</p>';return}let t="";for(const n of l.partyMembers){const r=l.partyProfiles[n]||{};t+=Qs(r,n)}e.innerHTML=t,l.currentUser.uid,l.partyMembers[0],document.querySelectorAll(".kick-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.kick;if(!confirm("¿Quieres quitar a este miembro de la party?"))return;const a=N(C,"pairs",l.currentPartyId);await ae(a,{members:br(r)}),showToast("Miembro eliminado","success")})}),document.querySelectorAll(".transfer-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.transfer;if(!confirm("¿Quieres transferir el host a este miembro?"))return;const a=N(C,"pairs",l.currentPartyId),i=[...l.partyMembers].filter(c=>c!==r),o=[r,...i];await ae(a,{members:o}),showToast("Host transferido","success")})})}function eo(){var o,c,d,p,m,f;(o=u("createPairBtn"))==null||o.addEventListener("click",no),(c=u("copyInviteBtn"))==null||c.addEventListener("click",so);const e=async()=>{var y;const v=(((y=u("joinCode"))==null?void 0:y.value)||"").trim(),x=oo(v);x?await ro(x):alert("Pega un ID válido de party."),u("joinCode").value=""};(d=u("joinByCodeBtn"))==null||d.addEventListener("click",e),(p=u("joinCode"))==null||p.addEventListener("keydown",v=>{v.key==="Enter"&&e()});const t=u("leavePartyModal"),n=u("leavePartyConfirm"),r=u("leavePartyCancel");(m=u("deletePairBtn"))==null||m.addEventListener("click",()=>{if(!l.currentPartyId){alert("No estás en ninguna party.");return}t==null||t.classList.add("active")}),r==null||r.addEventListener("click",()=>{t==null||t.classList.remove("active")}),n==null||n.addEventListener("click",async()=>{t==null||t.classList.remove("active"),await ao()});const a=u("closePartyModal"),s=u("closePartyConfirm"),i=u("closePartyCancel");(f=u("closePartyBtn"))==null||f.addEventListener("click",()=>{const v=l.partyMembers[0];if(l.currentUser.uid!==v){showToast("Solo el host puede cerrar la party","error");return}a.classList.add("active")}),i==null||i.addEventListener("click",()=>{a.classList.remove("active")}),s==null||s.addEventListener("click",async()=>{a.classList.remove("active"),await co()})}async function to(){if(!l.currentUser)return;const e=Q(P(C,"pairs")),t=await F(e),n=[];t.forEach(a=>{const s=a.data()||{};Array.isArray(s.members)&&s.members.includes(l.currentUser.uid)&&n.push({id:a.id,...s})}),n.sort((a,s)=>Number(s.createdAt)-Number(a.createdAt));const r=n[0]||null;l.currentPartyId=(r==null?void 0:r.id)||null,l.partyMembers=(r==null?void 0:r.members)||[],Pn(),Jt(),u("pairId").textContent=l.currentPartyId||"—",u("copyInviteBtn").disabled=!l.currentPartyId,Le(),Un(),xr(l.currentPartyId)}async function no(){if(!l.currentUser)return;const e=N(P(C,"pairs"));await ye(e,{members:[l.currentUser.uid],createdAt:Date.now()}),await Ta(e.id),l.currentPartyId=e.id,l.partyMembers=[l.currentUser.uid],Pn(),Jt(),u("pairId").textContent=e.id,u("copyInviteBtn").disabled=!1,Le(),Un(),xr(e.id)}async function ro(e){if(!l.currentUser)return;const t=N(C,"pairs",e),n=await te(t);if(!n.exists())return alert("La party no existe.");const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(l.currentUser.uid)&&a.length>=5){alert("Esta party ya tiene 5 miembros.");return}a.includes(l.currentUser.uid)||await ae(t,{members:Fs(l.currentUser.uid)}),await Ta(e);const i=(await te(t)).data()||{};l.currentPartyId=e,l.partyMembers=i.members||[],Pn(),Jt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,Le(),Un(),xr(e)}function xr(e){if(tt&&(tt(),tt=null),!e)return;const t=N(C,"pairs",e);tt=G(t,n=>{if(!n.exists()){Sn();return}const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(l.currentUser.uid)){Sn(),showToast("Has sido eliminado de la party","error");return}lo(a),a.forEach(s=>io(s)),l.currentPartyId=e,l.partyMembers=a,Pn(),Jt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,Le(),hr()})}async function ao(){if(!l.currentUser||!l.currentPartyId)return;const e=l.currentPartyId,t=N(C,"pairs",e);await ae(t,{members:br(l.currentUser.uid)});const n=await te(t);if((n.exists()?n.data().members||[]:[]).length===0)try{await fe(t)}catch{}Sn()}function Sn(){tt&&(tt(),tt=null);for(const t in Ge){try{Ge[t]()}catch{}delete Ge[t]}l.currentPartyId=null,l.partyMembers=[],l.partyProfiles={},u("pairId").textContent="—",u("copyInviteBtn").disabled=!0,u("closePartyBtn").style.display="none";const e=u("partyMembersList");e&&(e.innerHTML='<p class="muted">Aún no estás en ninguna party.</p>'),Jt(),Le(),Un()}async function Ta(e){const t=Q(P(C,"pairs")),n=await F(t),r=l.currentUser.uid,a=[];n.forEach(s=>{const i=s.data()||{};s.id!==e&&Array.isArray(i.members)&&i.members.includes(r)&&a.push(ae(N(C,"pairs",s.id),{members:br(r)}))}),await Promise.all(a)}async function so(){if(l.currentPartyId)try{await navigator.clipboard.writeText(l.currentPartyId);const e=u("copyInviteBtn");e.textContent="¡Copiado!",setTimeout(()=>e.textContent="📋 Copiar ID",1200)}catch{alert("No se pudo copiar el ID.")}}function oo(e){if(!e)return"";const t=String(e).trim();try{const a=new URL(t).searchParams.get("pair");if(a)return a.trim()}catch{}const n=t.match(/[?&]pair=([A-Za-z0-9_-]+)/);return n?n[1]:t.replace(/[^A-Za-z0-9_-]/g,"")}function io(e){if(Ge[e])return;const t=N(C,"users",e),n=N(C,"users",e,"profile","profile");let r={},a={};const s=()=>{const o={...r,...a};"isOnline"in r&&(o.isOnline=r.isOnline),"lastOnline"in r&&(o.lastOnline=r.lastOnline),l.partyProfiles[e]=o,hr()},i=[];i.push(G(t,o=>{r=o.exists()?o.data()||{}:{},s()})),i.push(G(n,o=>{a=o.exists()?o.data()||{}:{},s()})),Ge[e]=()=>i.forEach(o=>o())}function lo(e){for(const t in Ge)e.includes(t)||(Ge[t](),delete Ge[t])}async function co(){if(!l.currentUser||!l.currentPartyId)return;const e=l.currentPartyId,t=l.partyMembers[0];if(l.currentUser.uid!==t){showToast("Solo el host puede cerrar la party","error");return}try{await fe(N(C,"pairs",e)),showToast("Party cerrada","success")}catch{showToast("Error al cerrar la party","error")}u("closePartyBtn").style.display="none",Sn()}function Pn(){const e=u("closePartyBtn");if(!e)return;if(!l.currentPartyId||l.partyMembers.length===0){e.style.display="none";return}const t=l.currentUser.uid===l.partyMembers[0];e.style.display=t?"inline-flex":"none"}function Jt(){const e=u("partyCount");if(e){if(!l.currentPartyId){e.textContent="0/5";return}e.textContent=`${l.partyMembers.length}/5`}}async function zn(e){if(l.currentUser)try{await ae(N(C,"users",l.currentUser.uid),{isOnline:e,lastOnline:Date.now()})}catch(t){console.warn("No se pudo actualizar estado online:",t)}}function tn(e,t,n,r){if(!e)return;const a=`bound_${r||t}`;e.dataset[a]!=="1"&&(e.addEventListener(t,n),e.dataset[a]="1")}function Ua(e){return(e||"").replace(/[^\w\s.-]+/g,"").replace(/\s+/g,"_")||"export"}function Xr(){var e;return((e=l.activeSemesterData)==null?void 0:e.label)||"semestre"}async function Pa(e,t=2){const n=e.style.backgroundColor;n||(e.style.backgroundColor=getComputedStyle(document.body).backgroundColor||"#111");const r=await Ys(e,{scale:t,backgroundColor:null,useCORS:!0,allowTaint:!0,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight});return n||(e.style.backgroundColor=""),r}async function Qr(e,t){try{const n=await Pa(e,2),r=document.createElement("a");r.href=n.toDataURL("image/png"),r.download=`${Ua(t)}.png`,r.click()}catch(n){console.error("[exportNodeAsPNG]",n)}}async function ea(e,t){try{const n=await Pa(e,2),r=n.toDataURL("image/png"),a=n.width,s=n.height,i=a>=s?"l":"p",o=new Gs({unit:"pt",format:"a4",orientation:i}),c=o.internal.pageSize.getWidth(),d=o.internal.pageSize.getHeight(),p=Math.min(c/a,d/s),m=a*p,f=s*p;o.addImage(r,"PNG",(c-m)/2,(d-f)/2,m,f),o.save(`${Ua(t)}.pdf`)}catch(n){console.error("[exportNodeAsPDF]",n)}}function uo(){const e=u("btn-export-malla-png"),t=u("btn-export-malla-pdf");if(e||t){const a=document.querySelector("#page-malla .malla-wrapper")||u("page-malla"),s=`malla_${Xr()}`;tn(e,"click",()=>Qr(a,s),"malla_png"),tn(t,"click",()=>ea(a,s),"malla_pdf")}const n=u("btn-export-horario-png"),r=u("btn-export-horario-pdf");if(n||r){const a=document.querySelector("#horarioCombinado:not(.hidden)")||document.querySelector("#schedUSM")||u("horarioPropio")||u("page-horario"),s=`horario_${Xr()}`;tn(n,"click",()=>Qr(a,s),"horario_png"),tn(r,"click",()=>ea(a,s),"horario_pdf")}}let Ce=!1,En="",Da="",Be=!1,nn=null,Ie=null;const Cn=new Map,J=new Map;let re=[],K=[];const V=new Map;let Xe=!1,pe=null,Xn=!1,_a="#22c55e",po="#ff69b4",ta=!1,rn=null,an=null,sn=null,xt=[],qe=[],wt=null,ze="USM",le={};const Fe=new Map,Qn=new Map;let Fn=null;function wr(){const e={};for(const[n,r]of(J||new Map).entries())e[n]=r||[];const t={};for(const[n,r]of(V||new Map).entries())t[n]=r;return JSON.stringify({slots:pe||null,items:K||[],courses:re||[],defs:e,selected:t})}function Ba(){if(!Ie)return!1;try{return wr()!==Ie}catch{return!0}}function Dt(){Fn||(Fn=requestAnimationFrame(()=>{Fn=null,["schedPartyBusyCombined","schedPartyBusy"].filter(n=>document.getElementById(n)).forEach(n=>or(n)),["busyLegendCombined","busyLegend"].filter(n=>document.getElementById(n)).forEach(n=>gn(n))}))}let Rt=!1,Et=null;const vt=80,na=28;let De=[],er=[];const $e=["Lun","Mar","Mié","Jue","Vie"];function mo(e){if(!Rt)return;const t=e.clientY,n=window.innerHeight;let r=0;if(t<vt){const a=(vt-t)/vt;r=-Math.ceil(na*a)}else if(t>n-vt){const a=(t-(n-vt))/vt;r=Math.ceil(na*a)}r!==0&&Et===null&&(Et=requestAnimationFrame(()=>{window.scrollBy(0,r),Et=null}))}function ra(){Rt=!1,Et&&(cancelAnimationFrame(Et),Et=null)}let ge={};const pt=[{label:"1/2",start:"08:15",end:"09:25",lines:[{n:"1",start:"08:15",end:"08:50"},{n:"2",start:"08:50",end:"09:25"}]},{label:"3/4",start:"09:40",end:"10:50",lines:[{n:"3",start:"09:40",end:"10:15"},{n:"4",start:"10:15",end:"10:50"}]},{label:"5/6",start:"11:05",end:"12:15",lines:[{n:"5",start:"11:05",end:"11:40"},{n:"6",start:"11:40",end:"12:15"}]},{label:"7/8",start:"12:30",end:"13:40",lines:[{n:"7",start:"12:30",end:"13:05"},{n:"8",start:"13:05",end:"13:40"}]},{label:"ALMUERZO",start:"13:40",end:"14:40",lunch:!0},{label:"9/10",start:"14:40",end:"15:50",lines:[{n:"9",start:"14:40",end:"15:15"},{n:"10",start:"15:15",end:"15:50"}]},{label:"11/12",start:"16:05",end:"17:15",lines:[{n:"11",start:"16:05",end:"16:40"},{n:"12",start:"16:40",end:"17:15"}]},{label:"13/14",start:"17:30",end:"18:40",lines:[{n:"13",start:"17:30",end:"18:05"},{n:"14",start:"18:05",end:"18:40"}]},{label:"15/16",start:"18:55",end:"20:05",lines:[{n:"15",start:"18:55",end:"19:30"},{n:"16",start:"19:30",end:"20:05"}]},{label:"17/18",start:"20:20",end:"21:30",lines:[{n:"17",start:"20:20",end:"20:55"},{n:"18",start:"20:55",end:"21:30"}]},{label:"19/20",start:"21:45",end:"22:55",lines:[{n:"19",start:"21:45",end:"22:20"},{n:"20",start:"22:20",end:"22:55"}]}],Kt=[Ue("1/2","08:30","09:40",["08:30-09:05","09:05-09:40"]),Ue("3/4","10:00","11:10",["10:00-10:35","10:35-11:10"]),Ue("5/6","11:30","12:40",["11:30-12:05","12:05-12:40"]),{label:"ALMUERZO",start:"12:40",end:"14:00",lunch:!0},Ue("7/8","14:00","15:10",["14:00-14:35","14:35-15:10"]),Ue("9/10","15:30","16:40",["15:30-16:05","16:05-16:40"]),Ue("11/12","17:00","18:10",["17:00-17:35","17:35-18:10"]),Ue("13/14","18:30","19:40",["18:30-19:05","19:05-19:40"]),Ue("15/16","20:00","21:10",["20:00-20:35","20:35-21:10"]),Ue("17/18","21:30","22:40",["21:30-22:05","22:05-22:40"])];function Ue(e,t,n,r){return{label:e,start:t,end:n,lines:r.map(a=>{const[s,i]=a.split("-");return{start:s,end:i}})}}function Ra(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g," ")}function fo(e){return Ra(e).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function Oa(e){const t=Ra(e);return t?t==="umayor"||t.includes("mayor")?"UMAYOR":t==="usm"||t.includes("utfsm")||t.includes("u t f s m")||t.includes("u.t.f.s.m")||t.includes("federico santa maria")||t.includes("santa maria")?"USM":`UNI_${fo(t)||"desconocida"}`:""}function mt(){var t,n;const e=((t=l.activeSemesterData)==null?void 0:t.universityAtThatTime)||((n=l.profileData)==null?void 0:n.university)||"";return Oa(e)}async function ft(){var r,a;const e=mt();if(ge[e]&&Array.isArray(ge[e])&&ge[e].length)return ge[e];if(l.currentUser){const s=N(C,"users",l.currentUser.uid,"custom_schedules",e),i=await te(s);if(i.exists()){const o=((r=i.data())==null?void 0:r.slots)||[];if(Array.isArray(o)&&o.length)return ge[e]=o,o}}const t=`custom_slots_${e}_${(a=l.currentUser)==null?void 0:a.uid}`,n=localStorage.getItem(t);if(n)try{const s=JSON.parse(n);if(Array.isArray(s)&&s.length)return ge[e]=s,s}catch{}return e==="UMAYOR"?Kt:e==="USM"?pt:null}function At(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Sr(e,t,n){const r=(e||[]).find(a=>a.id===t);return At(r==null?void 0:r.color)?r.color:n||"#3B82F6"}function Er(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}let on=null,ie=[];function ct(){const e=document.getElementById("simPaletteHost");if(!e)return;ni(),e.innerHTML="";const t=Ce?Array.isArray(re)?re:[]:Array.isArray(l.courses)?l.courses:[];if(!t.length){const a=document.createElement("button");a.type="button",a.className="palette-rect",a.textContent="+ Agregar ramo",a.style.cursor="pointer",a.style.borderStyle="dashed",a.addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await nr(l.activeSemesterId,{forceFirestore:!1})}),e.appendChild(a);return}ei(t).forEach(a=>{var v;const s=document.createElement("div");s.className="sim-course-group",s.dataset.courseId=a.id;const i=At(a.color)?a.color:"#3B82F6",o=J.get(a.id)||[],c=V.get(a.id)||((v=o[0])==null?void 0:v.pid)||null;c&&o.find(x=>x.pid===c);const d=a.name,p=document.createElement("div");p.className="palette-rect",p.setAttribute("draggable","true"),p.dataset.payload=JSON.stringify({type:"course-parallel",courseId:a.id,pid:c}),p.style.borderColor=i,p.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)";const m=document.createElement("div");m.className="label",m.textContent=d,p.appendChild(m);const f=document.createElement("button");f.type="button",f.className="add-par",f.textContent="▾",f.setAttribute("aria-label","Paralelos"),f.addEventListener("click",x=>{x.stopPropagation(),wo(a,f)}),p.appendChild(f),s.appendChild(p),e.appendChild(s)});const r=document.createElement("button");r.type="button",r.className="palette-rect",r.textContent="+ Agregar ramo",r.style.cursor="pointer",r.style.borderStyle="dashed",r.style.opacity="0.95",r.addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await nr(l.activeSemesterId,{forceFirestore:!1})}),e.appendChild(r),ti()}let nt=null;function yo(){if(document.getElementById("simParMenuStyles"))return;const e=document.createElement("style");e.id="simParMenuStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function go(){if(document.getElementById("parEditDnDStyles"))return;const e=document.createElement("style");e.id="parEditDnDStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function vo(){nt&&(nt.remove(),nt=null)}function bo(){if(document.getElementById("parEditModal"))return;const e=document.createElement("div");e.id="parEditModal",e.style.cssText=`position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.60); z-index:10090; padding:16px;`,e.innerHTML=`
      <div style="width:min(980px, 98vw); max-height:92vh; overflow:auto; background:#121527;
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
    `,document.body.appendChild(e);const t=()=>e.style.display="none";document.getElementById("parEditX").addEventListener("click",t),document.getElementById("parEditCancel").addEventListener("click",t),e.addEventListener("click",n=>{n.target===e&&t()})}async function jn(e,t){bo();const n=document.getElementById("parEditModal"),r=document.getElementById("parEditTitle"),a=document.getElementById("parEditProf"),s=document.getElementById("parEditSec"),i=document.getElementById("parEditChip"),o=document.getElementById("parEditGrid"),c=document.getElementById("parEditSave"),d=document.getElementById("parEditCancel"),p=document.getElementById("parEditX"),m=e.id,f=J.get(m)||[],v=b=>JSON.parse(JSON.stringify(b||{})),y=t?(b=>f.find(w=>w.pid===b)||null)(t):null;let h,E=!1;if(y)h=v(y);else{E=!0;const b=f.length+1;h={courseId:m,pid:`P${b}`,professor:"",section:"",blocks:[]}}a.value=h.professor||"",s.value=h.section||h.pid||"";const M=()=>{const b=(s.value||"").trim()||h.pid;r.textContent=`${e.name} · ${b}`;const w=i.querySelector(".drag-txt");w?w.textContent=`${e.name} · ${b}`:i.textContent=`${e.name} · ${b}`};i.dataset.payload=JSON.stringify({type:"parallel-template",courseId:m,pid:h.pid}),i.style.borderRadius="999px",i.style.padding="10px 14px",i.style.display="inline-flex",i.style.alignItems="center",i.style.gap="10px",i.style.fontWeight="900",i.style.borderWidth="2px",i.style.boxShadow="0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)",i.style.userSelect="none",i.querySelector(".drag-ico")||(i.innerHTML=`<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`),s.oninput=M,M(),await tr(o,h),go(),n.style.display="flex";const $=()=>{c.onclick=null,d.onclick=null,p.onclick=null,n.onclick=null,document.removeEventListener("keydown",S)},A=()=>{$(),n.style.display="none"},g=()=>{A()},k=b=>{b.target===n&&g()},S=b=>{n.style.display==="flex"&&b.key==="Escape"&&(b.preventDefault(),g())};p.onclick=g,d.onclick=g,n.onclick=k,document.addEventListener("keydown",S),c.onclick=async()=>{if(h.professor=(a.value||"").trim(),h.section=(s.value||"").trim(),E){const b=[...f,h];J.set(m,b)}else y.professor=h.professor,y.section=h.section,y.blocks=v(h.blocks),J.set(m,f);Ar(),ke(),ct(),A(),Ce&&V.get(m)===h.pid&&await ir(m,h.pid)}}async function tr(e,t){const n=mt(),r=pe||await ft();if(!r){e.innerHTML='<div class="muted">No hay slots definidos.</div>';return}const a=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${a}</div>
        ${$e.map(s=>`<div class="cell header">${s}</div>`).join("")}

        ${r.map((s,i)=>`
          <div class="cell mod ${s.lunch?"lunch":""}" data-slot="${i}">
            ${_n(s,i,n)}
          </div>
          ${$e.map((o,c)=>`
            <div class="cell slot ${s.lunch?"is-lunch":""}"
                data-day="${c}" data-slot="${i}"
                ${s.lunch?'aria-disabled="true"':""}
                style="${s.lunch?"pointer-events:none; opacity:.65;":""}">
              ${ho(t,c,i)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `,e.querySelectorAll(".par-placed").forEach(s=>{s.addEventListener("dragstart",o=>{const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10);o.dataTransfer.setData("text/plain",JSON.stringify({type:"move-par-block",courseId:t.courseId,pid:t.pid,from:{day:c,slot:d}})),o.dataTransfer.effectAllowed="move"});const i=s.querySelector(".par-x");i&&i.addEventListener("click",o=>{o.stopPropagation();const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10),p=t.blocks.findIndex(m=>m.day===c&&m.slot===d);p>=0&&t.blocks.splice(p,1),tr(e,t)})}),e.querySelectorAll(".cell.slot").forEach(s=>{s.classList.contains("is-lunch")||(s.addEventListener("dragover",i=>{i.preventDefault();const o=s.getBoundingClientRect(),c=i.clientY-o.top,d=o.height/2;let p="full";c<d-10?p="top":c>d+10&&(p="bottom"),s.dataset.droppos=p,s.classList.add("over"),s.classList.remove("hint-top","hint-full","hint-bottom"),s.classList.add(p==="top"?"hint-top":p==="bottom"?"hint-bottom":"hint-full")}),s.addEventListener("dragleave",()=>{s.classList.remove("over","hint-top","hint-full","hint-bottom"),delete s.dataset.droppos}),s.addEventListener("drop",i=>{i.preventDefault(),s.classList.remove("over","hint-top","hint-full","hint-bottom");const o=i.dataTransfer.getData("text/plain");let c=null;try{c=JSON.parse(o)}catch{}const d=parseInt(s.dataset.day,10),p=parseInt(s.dataset.slot,10),m=s.dataset.droppos||"full";if(!c||c.type!=="parallel-template")return;const f=r==null?void 0:r[p];if(!f||f.lunch)return;const v=t.blocks.findIndex(x=>x.day===d&&x.slot===p);v>=0?t.blocks.splice(v,1):t.blocks.push({day:d,slot:p,pos:m,hpos:"single",start:f.start,end:f.end}),tr(e,t)}))})}function ho(e,t,n){const r=(e.blocks||[]).filter(s=>s.day===t&&s.slot===n);if(!r.length)return"";const a=s=>s==="top"?"pos-top":s==="bottom"?"pos-bottom":"pos-full";return r.map(s=>`
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
    `).join("")}async function xo(e,t){var c;if(!l.currentUser||!l.activeSemesterId)return;const r=(J.get(e)||[]).find(d=>d.pid===t);if(!r)return;const a=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),i=(await F(a)).docs.filter(d=>{var p;return((p=d.data())==null?void 0:p.courseId)===e});for(const d of i)await fe(d.ref);const o=await ft();for(const d of r.blocks){const p=o==null?void 0:o[d.slot];!p||p.lunch||await Ee(a,{courseId:e,day:d.day,slot:d.slot,start:p.start,end:p.end,pos:d.pos||"full",hpos:d.hpos||"single",parallelPid:t,displayName:`${((c=l.courses.find(m=>m.id===e))==null?void 0:c.name)||"Ramo"} · ${r.section||t}`,createdAt:Date.now()})}V.set(e,t)}async function aa(e){if(!l.currentUser||!l.activeSemesterId)return;const t=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),r=(await F(t)).docs.filter(a=>{var s;return((s=a.data())==null?void 0:s.courseId)===e});for(const a of r)await fe(a.ref)}function wo(e,t){var g,k;yo(),vo();const n=document.createElement("div");n.className="sim-par-menu";const r=e.id,a=J.get(r)||[],s=(ie||[]).some(S=>S.courseId===r),i=V.has(r),o=s||i;n.innerHTML=`
    <div class="head">
      <div class="title">Paralelos de ${Ae(e.name||"Ramo")}</div>
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
  `,document.body.appendChild(n),nt=n;const c=()=>{document.removeEventListener("pointerdown",p,{capture:!0}),document.removeEventListener("keydown",m),window.removeEventListener("scroll",f,!0),window.removeEventListener("resize",v)},d=()=>{nt&&(nt.remove(),nt=null),c()},p=S=>{!n.contains(S.target)&&!t.contains(S.target)&&d()},m=S=>{S.key==="Escape"&&d()},f=()=>d(),v=()=>d(),x=n.querySelector(".list");if(a.length)a.forEach(S=>{var B;const b=document.createElement("div");b.className="item",b.style.cursor="default";const w=V.get(r)===S.pid;b.innerHTML=`
    <div class="row">
      <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
        <div class="pickbox ${w?"on":""}" title="Seleccionar paralelo" aria-label="Seleccionar paralelo"></div>

        <div style="min-width:0;">
          <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${Ae(S.section||S.pid)}
          </div>
          <div style="opacity:.75; font-weight:800; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${Ae(S.professor||"—")}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="iconbtn" type="button" title="Editar">✏️</button>
        <button class="iconbtn danger" type="button" title="Borrar">✕</button>
      </div>
    </div>
  `;const L=b.querySelector(".iconbtn:not(.danger)"),I=b.querySelector(".iconbtn.danger");b.querySelector(".pickbox").addEventListener("click",async T=>{T.preventDefault(),T.stopPropagation(),T.stopImmediatePropagation(),V.set(r,S.pid),$r(),ke(),Ce?await ir(r,S.pid):(await xo(r,S.pid),me()),d()}),(B=b.querySelector(".row > div"))==null||B.addEventListener("click",async T=>{if(!T.target.closest(".pickbox")&&!T.target.closest(".actions")&&!T.target.closest("button")){if(d(),Ce){await ir(e.id,S.pid);return}jn(e,S.pid)}}),L.addEventListener("click",async T=>{T.stopPropagation(),d(),jn(e,S.pid)}),I.addEventListener("click",async T=>{if(T.stopPropagation(),!await it({title:"Borrar paralelo",text:`¿Quieres borrar el paralelo ${S.section||S.pid}?`,yesText:"Borrar",noText:"Cancelar"}))return;const H=(J.get(e.id)||[]).filter(D=>D.pid!==S.pid);J.set(e.id,H),K=K.filter(D=>!(D.courseId===e.id&&D.pid===S.pid)),ke(),V.get(e.id)===S.pid&&V.delete(e.id),ct(),Ce&&await je(),d()}),x.appendChild(b)});else{const S=document.createElement("div");S.className="hint",S.textContent="Aún no hay paralelos.",x.appendChild(S)}n.querySelector(".item.add").addEventListener("click",async()=>{d(),await jn(e,null)}),(g=n.querySelector("#simClearFromScheduleBtn"))==null||g.addEventListener("click",async()=>{o&&(d(),await aa(e.id),K=K.filter(S=>S.courseId!==e.id),ke(),V.delete(e.id),me(),Ce&&await je())}),(k=n.querySelector("#simRemoveCourseBtn"))==null||k.addEventListener("click",async()=>{if(await it({title:"Eliminar ramo",text:`¿Eliminar "${e.name}" del simulador? Esto lo quitará de tu lista de ramos.`,yesText:"Eliminar",noText:"Cancelar"})){if(d(),Ce){const b=e.id;re=(re||[]).filter(w=>w.id!==b),K=(K||[]).filter(w=>w.courseId!==b),J.delete(b),V.delete(b),Bn(re),ct(),await je();return}if(!(!l.currentUser||!l.activeSemesterId))try{await aa(e.id),await fe(N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e.id)),K=K.filter(b=>b.courseId!==e.id),ke(),J.delete(e.id),V.delete(e.id),l.courses=(l.courses||[]).filter(b=>b.id!==e.id),document.dispatchEvent(new Event("courses:changed")),Ce&&await je()}catch(b){console.error(b),alert("No se pudo eliminar el ramo.")}}});const y=t.getBoundingClientRect(),h=8;n.style.left="-9999px",n.style.top="-9999px";const E=n.offsetWidth,M=n.offsetHeight;let $=y.left,A=y.bottom+h;$=Math.min($,window.innerWidth-E-h),$=Math.max($,h),A+M>window.innerHeight-h&&(A=y.top-M-h),A=Math.max(A,h),n.style.left=`${$}px`,n.style.top=`${A}px`,setTimeout(()=>{document.addEventListener("pointerdown",p,{capture:!0})},0),document.addEventListener("keydown",m),window.addEventListener("scroll",f,!0),window.addEventListener("resize",v)}function So(e){const t=e||"full";return t==="top"?{a:0,b:.3334}:t==="bottom"?{a:.6666,b:1}:{a:0,b:1}}function Eo(e,t){return e.a<t.b&&t.a<e.b}function Co(e){const t=e.map(a=>({...a,_vr:So(a.pos)})),n={top:0,full:1,bottom:2};t.sort((a,s)=>{const i=n[a.pos||"full"]??1,o=n[s.pos||"full"]??1;return i!==o?i-o:String(a.id||"").localeCompare(String(s.id||""))});const r=[];for(const a of t){let s=!1;for(let i=0;i<r.length;i++){const o=r[i];if(!o.some(d=>Eo(a._vr,d._vr))){a._lane=i,o.push(a),s=!0;break}}s||(a._lane=r.length,r.push([a]))}return{blocks:t,laneCount:Math.max(1,r.length)}}function Ha(){if(ta)return;ta=!0,Lo(),jo(),To(),Go(),yn(),sr(),document.addEventListener("party:ready",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("party:changed",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("semester:changed",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("profile:changed",async()=>{var v,x,y,h,E;const f=(v=l.currentUser)==null?void 0:v.uid;f&&(le[f]=le[f]||{},(x=l.profileData)!=null&&x.name&&(le[f].name=l.profileData.name),(y=l.profileData)!=null&&y.favoriteColor&&(le[f].color=l.profileData.favoriteColor),(h=u("subtabCompartido"))!=null&&h.classList.contains("active")&&(await Tr(f,{force:!0}),await yn()),(E=u("subtabCombinado"))!=null&&E.classList.contains("active")&&(gn("busyLegendCombined"),Dt()))});const e=u("subtabPropio"),t=u("subtabCompartido"),n=u("subtabCombinado");p();const r=u("horarioPropio"),a=u("horarioCompartido"),s=u("horarioCombinado");function i(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function o(){var f,v,x;t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await yn(),(f=l.partyView)!=null&&f.uid&&await Pr(l.partyView.uid),await sr(),(v=l.partyView)!=null&&v.uid&&((x=l.partyView)!=null&&x.semId)?Ft(l.partyView.uid,l.partyView.semId):Ve()}async function c(){var x;const f=u("horarioCombinado");if(!f)return;f.innerHTML=`
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
  `;const v=document.getElementById("busy-semSelCombined");if(v&&l.currentUser){const y=P(C,"users",l.currentUser.uid,"semesters"),E=(await F(Q(y))).docs.map(S=>{var b;return{id:S.id,label:String(((b=S.data())==null?void 0:b.label)||S.id).trim()}}).sort((S,b)=>b.label.localeCompare(S.label));if(!E.length){v.innerHTML='<option value="" disabled selected>— sin semestres —</option>';return}const M=S=>{const b=/^(\d{4})-(1|2)$/.exec(String(S||"").trim());if(!b)return null;const w=parseInt(b[1],10);return parseInt(b[2],10)===1?`${w}-2`:`${w+1}-1`};v.innerHTML="";for(const S of E){const b=document.createElement("option");b.value=S.label,b.textContent=S.label,v.appendChild(b)}const $=((x=l.activeSemesterData)==null?void 0:x.label)||null,A=M($)||$,g=E.map(S=>S.label),k=A&&g.includes(A)?A:$&&g.includes($)?$:E[0].label;v.value=k,await ca(k),gn("busyLegendCombined"),or("schedPartyBusyCombined"),v.addEventListener("change",async()=>{const S=v.value;await ca(S),gn("busyLegendCombined"),or("schedPartyBusyCombined")})}}async function d(){n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),await c()}e.addEventListener("click",i),t.addEventListener("click",()=>{o()}),n.addEventListener("click",d),i(),document.addEventListener("courses:changed",()=>{if(Ce){ct();return}Dn(),me()}),document.addEventListener("click",async f=>{const v=f.target.closest(".block-del-btn");if(!v)return;const x=v.dataset.id;if(!(!x||!l.currentUser||!l.activeSemesterId)&&confirm("¿Eliminar este bloque del horario?"))try{await fe(N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",x))}catch(y){console.error(y),alert("No se pudo eliminar el bloque.")}});function p(){const f=u("subtabPropio");if(!f)return;const v=f.parentElement;if(!v||document.getElementById("btnSimSchedule"))return;v.style.display="flex",v.style.alignItems="center",v.style.gap="10px",v.style.flexWrap="wrap";const x=document.createElement("div");x.style.flex="1 1 auto",v.appendChild(x);const y=document.createElement("button");y.id="btnSimSchedule",y.className="btn violet",y.textContent="Simulador de horario",y.style.marginLeft="auto",v.appendChild(y)}function m(){document.addEventListener("click",async f=>{f.target.closest("#btnSimSchedule")&&await Wa()})}uo(),m()}function $t(){if(on&&(on(),on=null),nn&&(nn(),nn=null),!l.currentUser||!l.activeSemesterId){qa();return}ie=[],me();const e=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");nn=G(Q(e,Se("createdAt")),n=>{l.courses=n.docs.map(r=>({id:r.id,...r.data()})),document.dispatchEvent(new Event("courses:changed"))});const t=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule");on=G(Q(t),n=>{ie=n.docs.map(r=>({id:r.id,...r.data()})),me()})}function qa(){document.querySelectorAll(".schedule-controls").forEach(n=>n.remove());const e=u("schedUSM");e&&(e.innerHTML=`
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `);const t=u("coursePalette");t&&(t.innerHTML='<div class="muted">Selecciona o crea un semestre para ver ramos.</div>'),ie=[],De=[]}function Lo(){const e=u("horarioPropio");e.innerHTML=`
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
  `,Dn(),me()}function Mo(){Dn(),me()}function Dn(){const e=u("coursePalette");if(!e)return;e.innerHTML="";const t=Array.isArray(l.courses)?l.courses:[];if(Xn){const n=document.createElement("button");n.type="button",n.className="palette-chip",n.id="paletteAddCourseChip",n.textContent="+",n.style.cursor="pointer",n.style.fontWeight="900",n.style.fontSize="18px",n.style.display="inline-flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.minWidth="44px",n.style.borderStyle="dashed",n.style.opacity="0.95",n.addEventListener("click",async()=>{var a;const r=((a=document.getElementById("sim-semSel"))==null?void 0:a.value)||l.activeSemesterId;await nr(r)}),e.appendChild(n)}if(!t.length){const n=document.createElement("div");n.className="muted",n.style.marginLeft="10px",n.textContent=Xn?"Aún no tienes ramos. Presiona + para agregar el primero.":"Aún no tienes ramos. Agrega ramos desde el simulador.",e.appendChild(n);return}t.forEach(n=>{const r=document.createElement("div");r.className="palette-chip",r.setAttribute("draggable","true"),r.dataset.courseId=n.id,r.textContent=n.name;const a=At(n.color)?n.color:"#3B82F6";r.style.borderColor=a,r.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)",e.appendChild(r)})}function Io(e){var t;document.querySelectorAll(".schedule-controls").forEach(n=>n.remove()),e.innerHTML=`
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `,(t=u("btnCreateNewSched"))==null||t.addEventListener("click",()=>rr(!1))}async function ko(e,t){if(!e||!t)return;const n=P(C,"users",e,"semesters",t,"schedule");await lr(n)}async function me(){var d,p,m,f,v,x;const e=u("schedUSM");if(!e)return;if(!l.currentUser||!l.activeSemesterId){qa();return}let t=await ft();De=t;const n=mt(),r=n==="USM"||n==="UMAYOR",a=`custom_slots_${n}_${(d=l.currentUser)==null?void 0:d.uid}`,s=Array.isArray(ge[n])&&ge[n].length>0;if(document.querySelectorAll(".schedule-controls").forEach(y=>y.remove()),!t){Io(e);return}const i=document.createElement("div");i.className="card schedule-controls",i.style="padding:12px;text-align:center;margin-bottom:10px;",r?i.innerHTML=`
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
    <button id="btnEditBlocksMode" class="btn ${Xe?"violet":"violet-outline"}">
      ${Xe?"✅ Modo edición: ON":"Editar ramos y salas"}
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
    <button id="btnEditBlocksMode" class="btn ${Xe?"violet":"violet-outline"}">
      ${Xe?"✅ Modo edición: ON":"Editar ramos y salas"}
    </button>
  `,e.before(i),(p=u("btnEditBlocksMode"))==null||p.addEventListener("click",()=>{Xe=!Xe,me()}),(m=u("btnCreateCustomSched"))==null||m.addEventListener("click",()=>{rr(!1)}),(f=u("btnUseDefaultSched"))==null||f.addEventListener("click",async()=>{localStorage.removeItem(a),await ia(n),alert("Se restauró el horario por defecto."),De=n==="USM"?pt:Kt,me()}),(v=u("btnEditCustomSched"))==null||v.addEventListener("click",async()=>{const y=localStorage.getItem(a);let h=null;if(y)try{h=JSON.parse(y)}catch{}if(!h||h.length===0){alert("No hay horario personalizado guardado para editar.");return}confirm("¿Deseas volver a generar este horario con diferentes bloques o tiempos?")&&(alert("Ahora puedes modificar el horario. Se reemplazará el anterior."),await rr(!0))}),(x=u("btnDeleteCustomSched"))==null||x.addEventListener("click",async()=>{var y;if(await it({title:"Borrar horario",text:"¿Seguro que deseas borrar tu horario personalizado?",yesText:"Sí, borrar horario",noText:"Cancelar"}))try{const h=(y=l.currentUser)==null?void 0:y.uid,E=l.activeSemesterId;if(!h||!E){alert("No hay semestre activo.");return}localStorage.removeItem(a),await ia(n),delete ge[n],De=[],await ko(h,E),ie=[],K=[],Cn.delete(Ln(h,E)),document.dispatchEvent(new Event("courses:changed")),alert("Horario personalizado eliminado. Tus ramos siguen guardados."),await me()}catch(h){console.error(h),alert("No se pudo borrar el horario personalizado.")}});const c=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${c}</div>
        ${$e.map(y=>`<div class="cell header">${y}</div>`).join("")}
        ${t.map((y,h)=>`
          <div class="cell mod ${y.lunch?"lunch":""}" data-slot="${h}">
            ${_n(y,h,n)}

          </div>
          ${$e.map((E,M)=>`
            <div class="cell slot ${y.lunch?"is-lunch":""}"
                data-day="${M}" data-slot="${h}"
                ${y.lunch?'aria-disabled="true"':""}>
              ${zo(M,h)}

            </div>
          `).join("")}
        `).join("")}
      </div>
    `,Ga(),e.querySelectorAll(".placed").forEach(y=>{if(!y.querySelector(".block-del-btn")){const h=document.createElement("button");h.className="block-del-btn",h.textContent="×",h.dataset.id=y.dataset.id,y.appendChild(h)}})}function Ao(){var n,r;if(document.getElementById("cqModal"))return;const e=document.createElement("div");e.id="cqModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=()=>{e.style.display="none"};(n=document.getElementById("cqX"))==null||n.addEventListener("click",t),(r=document.getElementById("cqCancel"))==null||r.addEventListener("click",t),e.addEventListener("click",a=>{a.target===e&&t()}),document.addEventListener("keydown",a=>{e.style.display==="flex"&&a.key==="Escape"&&t()})}async function nr(e=null,{forceFirestore:t=!1}={}){Ao();const n=e||l.activeSemesterId;if(!l.currentUser||!n)return alert("Necesitas seleccionar un semestre para agregar ramos."),null;const r=document.getElementById("cqModal"),a=document.getElementById("cqErr"),s=document.getElementById("cqName"),i=document.getElementById("cqCode"),o=document.getElementById("cqColor"),c=document.getElementById("cqAsis"),d=document.getElementById("cqSave"),p=document.getElementById("cqCancel"),m=document.getElementById("cqX");a.style.display="none",a.textContent="",s.value="",i.value="",o.value="#3B82F6",c.checked=!1,r.style.display="flex",setTimeout(()=>s.focus(),0);const f=v=>{a.textContent=v,a.style.display="block"};return new Promise(v=>{const x=()=>{d.removeEventListener("click",E),p.removeEventListener("click",y),m.removeEventListener("click",y),document.removeEventListener("keydown",h),r.style.display="none"},y=()=>{x(),v(null)},h=M=>{M.key==="Escape"&&(M.preventDefault(),y()),M.key==="Enter"&&(M.preventDefault(),E())},E=async()=>{const M=(s.value||"").trim();if(!M)return f("Ingresa el nombre del ramo.");const $=(i.value||"").trim();if(!$)return f("Ingresa el código del ramo.");const A={name:M,code:$,professor:"",section:"",color:o.value||"#3B82F6",asistencia:!!c.checked,createdAt:Date.now()};try{if(Ce&&!t){const b=`SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;re=Array.isArray(re)?re:[],re.push({id:b,...A}),Bn(re),ke(),Be=!0,ct(),await je(),x(),v({id:b,...A});return}const g=await Ee(P(C,"users",l.currentUser.uid,"semesters",n,"courses"),A),k=P(C,"users",l.currentUser.uid,"semesters",n,"courses"),S=await F(Q(k,Se("createdAt")));l.courses=S.docs.map(b=>({id:b.id,...b.data()})),document.dispatchEvent(new Event("courses:changed")),x(),v({id:g.id,...A})}catch(g){console.error(g),f("No se pudo guardar el ramo. Revisa consola.")}};d.addEventListener("click",E),p.addEventListener("click",y),m.addEventListener("click",y),document.addEventListener("keydown",h)})}function $o(){if(document.getElementById("ynModal"))return;const e=document.createElement("div");e.id="ynModal",e.style.cssText=`
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
    `,document.body.appendChild(e)}function No(){if(document.getElementById("blockModal"))return;const e=document.createElement("div");e.id="blockModal",e.style.cssText=`
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
      `}}function sa({mode:e="view",courseName:t,color:n,timeText:r,realName:a="",shownName:s="",code:i="",teacher:o="",section:c="",room:d=""}){No();const p=document.getElementById("blockModal"),m=document.getElementById("bmTitle"),f=document.getElementById("bmSub"),v=document.getElementById("bmDot"),x=document.getElementById("bmCourse"),y=document.getElementById("bmTime"),h=document.getElementById("bmNameOnly"),E=document.getElementById("bmCode"),M=document.getElementById("bmTeacher"),$=document.getElementById("bmSection"),A=document.getElementById("bmRoomView"),g=document.getElementById("bmDetails"),k=document.getElementById("bmEdit"),S=document.getElementById("bmName"),b=document.getElementById("bmRoom"),w=document.getElementById("bmX"),L=document.getElementById("bmCancel"),I=document.getElementById("bmSave"),U=e==="edit";m.textContent=U?"Editar ramo":"Detalles del ramo",f.textContent=U?"Modifica nombre mostrado y/o sala":"Información del ramo (sin editar)",v.style.background=At(n)?n:"#64748b",x.textContent=t||"Ramo",y.textContent=r||"";const B=T=>String(T||"").trim()||"—";return h.textContent=B(a),E.textContent=B(i),M.textContent=B(o),$.textContent=B(c),A.textContent=B(d),g.style.display=U?"none":"grid",k.style.display=U?"grid":"none",S.value=String(s||"").trim()&&s!==a?String(s).trim():"",b.value=String(d||"").trim(),I.style.display=U?"inline-flex":"none",p.style.display="flex",U&&setTimeout(()=>{S.focus(),S.select()},0),new Promise(T=>{const O=()=>{w.removeEventListener("click",z),L.removeEventListener("click",z),I.removeEventListener("click",D),p.removeEventListener("click",H),document.removeEventListener("keydown",Y),p.style.display="none"},z=()=>{O(),T(null)},H=q=>{q.target===p&&z()},D=()=>{const q=String(S.value||"").trim(),ce=String(b.value||"").trim();O(),T({nameVal:q,roomVal:ce})},Y=q=>{q.key==="Escape"&&(q.preventDefault(),z()),U&&q.key==="Enter"&&(q.preventDefault(),D())};w.addEventListener("click",z),L.addEventListener("click",z),I.addEventListener("click",D),p.addEventListener("click",H),document.addEventListener("keydown",Y)})}function To(){document.addEventListener("click",async e=>{const t=e.target.closest(".placed");if(!t||!t.closest("#schedUSM")||e.target.closest(".block-del-btn"))return;const r=t.dataset.id,a=ie.find(E=>E.id===r);if(!a)return;const s=(l.courses||[]).find(E=>E.id===a.courseId)||{},i=(s.name||"Ramo").trim(),o=a.displayName&&String(a.displayName).trim()?String(a.displayName).trim():i,c=a.room&&String(a.room).trim()?String(a.room).trim():"",d=Sr(l.courses,a.courseId,_a),p=a.start&&a.end?`${a.start}–${a.end}`:"",m=s.code||s.codigo||"",f=s.teacher||s.professor||s.docente||"",v=s.section||s.seccion||s.paralelo||"";if(!Xe){await sa({mode:"view",courseName:o,color:d,timeText:p,realName:i,shownName:o,code:m,teacher:f,section:v,room:c});return}const x=await sa({mode:"edit",courseName:i,color:d,timeText:p,realName:i,shownName:o,code:m,teacher:f,section:v,room:c});if(!x||!l.currentUser||!l.activeSemesterId)return;const{nameVal:y,roomVal:h}=x;try{const E=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",a.id);await ae(E,{displayName:y||null,room:h||null,updatedAt:Date.now()});const M=ie.findIndex($=>$.id===a.id);M>=0&&(ie[M].displayName=y||null,ie[M].room=h||null),me()}catch(E){console.error(E),alert("No se pudo actualizar. Intenta nuevamente.")}})}function Uo(){if(document.getElementById("csModal"))return;const e=document.createElement("div");e.id="csModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=document.getElementById("csHasLunch"),n=document.getElementById("csLunchRow");t.addEventListener("change",()=>{n.style.display=t.checked?"grid":"none"})}function za({editMode:e=!1,titleOverride:t=null,okTextOverride:n=null,subOverride:r=null}={}){Uo();const a=document.getElementById("csModal"),s=document.getElementById("csTitle"),i=document.getElementById("csSub"),o=document.getElementById("csErr"),c=document.getElementById("csBlocks"),d=document.getElementById("csHasLunch"),p=document.getElementById("csLunchRow"),m=document.getElementById("csLunchStart"),f=document.getElementById("csLunchEnd"),v=document.getElementById("csS1"),x=document.getElementById("csE1"),y=document.getElementById("csS2"),h=document.getElementById("csE2"),E=document.getElementById("csOk"),M=document.getElementById("csCancel"),$=document.getElementById("csX");s.textContent=t??(e?"Editar horario personalizado":"Crear horario personalizado"),i.textContent=r??(e?"Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.":"Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click."),o.style.display="none",o.textContent="",c.value="",d.checked=!1,p.style.display="none",m.value="13:40",f.value="14:40",v.value="08:15",x.value="09:25",y.value="09:40",h.value="10:50",E.textContent=n??(e?"Guardar":"Crear"),a.style.display="flex";const A=g=>{o.textContent=g,o.style.display="block"};return new Promise(g=>{const k=I=>{I.target===a&&w()},S=I=>{I.key==="Enter"&&L(),I.key==="Escape"&&w()},b=()=>{E.removeEventListener("click",L),M.removeEventListener("click",w),$==null||$.removeEventListener("click",w),a.removeEventListener("click",k),a.removeEventListener("keydown",S)},w=()=>{b(),a.style.display="none",g(null)},L=()=>{const I=parseInt(c.value,10);if(!I||I<=0)return A("Ingresa un número válido de bloques por día.");const U=v.value,B=x.value,T=y.value,O=h.value;if(!U||!B||!T||!O)return A("Completa los horarios de los bloques base.");const z=!!d.checked,H=m.value,D=f.value;if(z&&(!H||!D))return A("Completa inicio y fin de almuerzo.");b(),a.style.display="none",g({n:I,hasLunch:z,lunchStart:z?H:null,lunchEnd:z?D:null,start1:U,end1:B,start2:T,end2:O})};E.addEventListener("click",L),M.addEventListener("click",w),$==null||$.addEventListener("click",w),a.addEventListener("click",k),a.addEventListener("keydown",S)})}function Cr(){return`dp_sim_items_${ze||"UNI"}_TERM`}function Fa(e){try{const t=(e||[]).map(n=>({courseId:n.courseId,pid:n.pid,day:n.day,slot:n.slot,pos:n.pos||"full"})).sort((n,r)=>(n.courseId||"").localeCompare(r.courseId||"")||(n.pid||"").localeCompare(r.pid||"")||n.day-r.day||n.slot-r.slot||(n.pos||"").localeCompare(r.pos||""));return JSON.stringify(t)}catch{return""}}function ke(){Be=Ba()}function ja(){try{localStorage.setItem(Cr(),JSON.stringify(K||[]))}catch{}Da=Fa(K),Be=!1}function Po(){try{const e=localStorage.getItem(Cr()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Lr(){var e;return`dp_sim_slots_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Mr(){var e;return`dp_sim_parallel_defs_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Ir(){var e;return`dp_sim_selected_parallel_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Do(){try{const e=localStorage.getItem(Lr()),t=JSON.parse(e||"null");return Array.isArray(t)?t:null}catch{return null}}function kr(e){try{localStorage.setItem(Lr(),JSON.stringify(e||null))}catch{}}function _o(){try{const e=localStorage.getItem(Mr()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))n.set(r,Array.isArray(t[r])?t[r]:[]);return n}catch{return new Map}}function Ar(){try{const e={};for(const[t,n]of(J||new Map).entries())e[t]=n||[];localStorage.setItem(Mr(),JSON.stringify(e))}catch{}}function Bo(){try{const e=localStorage.getItem(Ir()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))t[r]&&n.set(r,t[r]);return n}catch{return new Map}}function $r(){try{const e={};for(const[t,n]of(V||new Map).entries())e[t]=n;localStorage.setItem(Ir(),JSON.stringify(e))}catch{}}function Ro(e,{persist:t=!1}={}){var n,r;if(e)try{const a=JSON.parse(e);pe=a.slots||null,K=Array.isArray(a.items)?a.items:[],re=Array.isArray(a.courses)?a.courses:[],(n=J.clear)==null||n.call(J);for(const s of Object.keys(a.defs||{}))J.set(s,Array.isArray(a.defs[s])?a.defs[s]:[]);(r=V.clear)==null||r.call(V);for(const s of Object.keys(a.selected||{}))a.selected[s]&&V.set(s,a.selected[s]);Da=Fa(K),Be=!1,t&&(kr(pe),ke(),Bn(re),ja(),Ar(),$r())}catch(a){console.warn("restoreSimFromSnapshot failed",a)}}function Oo({title:e="Salir del simulador",message:t="¿Quieres guardar antes de salir?",saveText:n="Guardar y salir",discardText:r="Salir sin guardar",cancelText:a="Cancelar"}={}){return new Promise(s=>{const i=document.getElementById("triConfirm");i&&i.remove();const o=document.createElement("div");o.id="triConfirm",o.style.cssText=`
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
      `;const c=d=>{o.remove(),s(d)};o.addEventListener("click",d=>{d.target===o&&c("cancel")}),o.querySelector("#triCancel").addEventListener("click",()=>c("cancel")),o.querySelector("#triDiscard").addEventListener("click",()=>c("discard")),o.querySelector("#triSave").addEventListener("click",()=>c("save")),document.body.appendChild(o)})}function it({title:e="Confirmar",text:t="",yesText:n="Sí",noText:r="No"}={}){$o();const a=document.getElementById("ynModal"),s=document.getElementById("ynTitle"),i=document.getElementById("ynText"),o=document.getElementById("ynYes"),c=document.getElementById("ynNo");return s.textContent=e,i.textContent=t,o.textContent=n,c.textContent=r,a.style.display="flex",new Promise(d=>{const p=()=>{o.removeEventListener("click",m),c.removeEventListener("click",f),a.removeEventListener("click",v),document.removeEventListener("keydown",x),a.style.display="none"},m=()=>{p(),d(!0)},f=()=>{p(),d(!1)},v=y=>{y.target===a&&(p(),d(!1))},x=y=>{y.key==="Escape"&&(p(),d(!1)),y.key==="Enter"&&(p(),d(!0))};o.addEventListener("click",m),c.addEventListener("click",f),a.addEventListener("click",v),document.addEventListener("keydown",x)})}async function rr(e=!1){const t=mt()||"UNI_desconocida",n=await za({editMode:e});if(!n)return;const{n:r,hasLunch:a,lunchStart:s,lunchEnd:i,start1:o,end1:c,start2:d,end2:p}=n;let m=null,f=null;if(a&&(m=Z(s),f=Z(i),isNaN(m)||isNaN(f)||f<=m))return alert("Horas de almuerzo inválidas.");const v=Z(o),x=Z(c)-Z(o),y=Z(d)-Z(c);if(isNaN(v)||x<=0)return alert("Horas inválidas en bloques.");if(y<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa.");const h=[];let E=v,M=!1,$=0;for(;$<r;){if(a&&!M&&E>=m&&E<f){h.push({label:"ALMUERZO",start:s,end:i,lunch:!0}),M=!0,E=f;continue}const A=E,g=A+x;if(a&&!M&&A<m&&g>m){h.push({label:"ALMUERZO",start:s,end:i,lunch:!0}),M=!0,E=f;continue}const k=$+1,S=ue(A),b=ue(g);h.push({label:String(k),start:S,end:b,lines:[{n:String(k),start:S,end:b}]}),$++,E=g+y}if(a&&!M){const A={label:"ALMUERZO",start:s,end:i,lunch:!0};let g=h.findIndex(k=>!k.lunch&&Z(k.start)>=m);g===-1&&(g=h.length),h.splice(g,0,A);for(let k=g+1;k<h.length;k++){const S=h[k];if(S.lunch)continue;const b=Z(S.start),w=Z(S.end);if(b<f){const L=f-b,I=b+L,U=w+L;S.start=ue(I),S.end=ue(U),S.lines=[{n:S.label,start:S.start,end:S.end}]}}}ge[t]=h,localStorage.setItem(`custom_slots_${t}_${l.currentUser.uid}`,JSON.stringify(h)),await Va(t,h),alert(e?"Horario personalizado actualizado.":"Horario personalizado creado exitosamente."),me()}async function Ho(){const e=await za({editMode:!0,titleOverride:"Editar horario personalizado",okTextOverride:"Guardar",subOverride:"Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click."});if(!e)return null;const{n:t,hasLunch:n,lunchStart:r,lunchEnd:a,start1:s,end1:i,start2:o,end2:c}=e;let d=null,p=null;if(n&&(d=Z(r),p=Z(a),isNaN(d)||isNaN(p)||p<=d))return alert("Horas de almuerzo inválidas."),null;const m=Z(s),f=Z(i)-Z(s),v=Z(o)-Z(i);if(isNaN(m)||f<=0)return alert("Horas inválidas en bloques."),null;if(v<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa."),null;const x=[];let y=m,h=!1,E=0;for(;E<t;){if(n&&!h&&y>=d&&y<p){x.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const M=y,$=M+f;if(n&&!h&&M<d&&$>d){x.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const A=E+1,g=ue(M),k=ue($);x.push({label:String(A),start:g,end:k,lines:[{n:String(A),start:g,end:k}]}),E++,y=$+v}if(n&&!h){const M={label:"ALMUERZO",start:r,end:a,lunch:!0};let $=x.findIndex(A=>!A.lunch&&Z(A.start)>=d);$===-1&&($=x.length),x.splice($,0,M);for(let A=$+1;A<x.length;A++){const g=x[A];if(g.lunch)continue;const k=Z(g.start),S=Z(g.end);if(k<p){const b=p-k,w=k+b,L=S+b;g.start=ue(w),g.end=ue(L),g.lines=[{n:g.label,start:g.start,end:g.end}]}}}return x}function ue(e){const t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function Ln(e,t){return`${e}:${t}`}function qo(e,t){const n=Ln(e,t),r=Cn.get(n);return r?(xt=r.items||[],qe=r.courses||[],wt=r.slots||pt,ze=r.uni||"USM",Ve(),!0):!1}function _n(e,t,n){if(e.lunch)return`
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${e.start}–${e.end}</div>
      `;const r=er.length?er:De;if(n!=="USM"&&n!=="UMAYOR"||!e.label.includes("/"))return`
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
`}document.addEventListener("click",e=>{const t=e.target.closest(".mod-lines");if(!t)return;const n=mt();if(!ge[n])return;const a=Array.from(t.parentNode.parentNode.querySelectorAll(".mod")).indexOf(t.parentNode);if(a<0)return;const s=ge[n],i=s[a],o=Z(i.end),c=prompt(`Inicio de ${i.label}`,i.start),d=prompt(`Fin de ${i.label}`,i.end);if(!c||!d)return;const p=Z(c),m=Z(d);if(isNaN(p)||isNaN(m)||m<=p){alert("Horas inválidas.");return}i.start=ue(p),i.end=ue(m),i.lines=[{n:i.label.split("/")[0],start:ue(p),end:ue(m)}];const f=m-p;if(a<s.length-1){const v=Z(s[a+1].start)-o;let x=m+v;for(let y=a+1;y<s.length;y++){const h=s[y],E=y+1;h.start=ue(x),h.end=ue(x+f),h.lines=[{n:String(E),start:h.start,end:ue(x+f/2)},{n:String(E+1),start:ue(x+f/2),end:h.end}],x=Z(h.end)+v}}localStorage.setItem(`custom_slots_${n}_${l.currentUser.uid}`,JSON.stringify(s)),ge[n]=s,me()});function zo(e,t){const n=ie.filter(r=>r.day===e&&r.slot===t);return n.length?Ya(n,!1):""}function Ya(e,t){const n=Co(e);return n.blocks.map(r=>Fo(r,n.laneCount,t)).join("")}function Fo(e,t,n){const r=l.courses||[],a=r.find(E=>E.id===e.courseId),s=(a==null?void 0:a.name)||"Ramo",i=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():s,o=typeof e.room=="string"&&e.room.trim()?e.room.trim():"",c=Sr(r,e.courseId,_a),d=Er(c),p=e.hpos||"single";let m=0,f=100;p==="left"?(m=0,f=50):p==="right"?(m=50,f=50):(m=0,f=100);const v=e.pos||"full";let x=0,y=100;v==="top"?(x=0,y=50):v==="bottom"?(x=50,y=50):(x=0,y=100);const h=`${i}${o?` · Sala: ${o}`:""}`;return`
  <div class="placed pos-${e.pos||"full"} h-${p}"
      ${n?"":`data-id="${e.id}" draggable="true"`}
      title="${Ae(h)}"
      style="
        background:${c};
        border:1px solid rgba(0,0,0,0.25);
        left:${m}%;
        width:${f}%;
        top:${x}%;
        height:${y}%;
      ">
      <div class="placed-title" style="color:${d}; font-weight:700; line-height:1.05;">
        ${Ae(i)}
      </div>
      ${o?`
        <div class="placed-room" style="color:${d}; opacity:.9; font-weight:700; font-size:11px; margin-top:2px; line-height:1.05;">
          ${Ae(o)}
        </div>
      `:""}
    </div>
  `}function jo(){window.addEventListener("dragover",mo,{passive:!0}),document.addEventListener("drop",ra),document.addEventListener("dragend",ra),document.addEventListener("dragstart",e=>{var r,a,s,i;const t=(a=(r=e.target).closest)==null?void 0:a.call(r,".palette-rect");if(t){const o=t.dataset.payload;if(o){e.dataTransfer.setData("text/plain",o),e.dataTransfer.effectAllowed="copy",Rt=!0;return}}const n=(i=(s=e.target).closest)==null?void 0:i.call(s,".palette-chip");if(n){e.dataTransfer.setData("text/plain",n.dataset.courseId),e.dataTransfer.effectAllowed="copy",Rt=!0;return}}),document.addEventListener("dragstart",e=>{const t=e.target.closest(".placed");t&&(e.dataTransfer.setData("text/plain",JSON.stringify({type:"move-block",id:t.dataset.id})),e.dataTransfer.effectAllowed="move",Rt=!1)}),Ga()}function Nr(){var e;return`sim_courses_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function Yo(){try{const e=localStorage.getItem(Nr()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Bn(e){try{localStorage.setItem(Nr(),JSON.stringify(e||[]))}catch{}}function Ga(){document.querySelectorAll(".cell.slot").forEach(e=>{e.classList.contains("is-lunch")||(e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect=t.dataTransfer.effectAllowed==="move"?"move":"copy";const n=e.getBoundingClientRect(),r=t.clientX-n.left,a=t.clientY-n.top,s=n.height/2;let i="full";a<s-10?i="top":a>s+10&&(i="bottom");let o="single";const c=r/n.width;c<.4?o="left":c>.6&&(o="right"),e.dataset.droppos=i,e.dataset.droph=o,e.classList.add("over"),e.classList.remove("hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),i==="top"&&e.classList.add("hint-top"),i==="full"&&e.classList.add("hint-full"),i==="bottom"&&e.classList.add("hint-bottom"),o==="left"&&e.classList.add("hint-left"),o==="single"&&e.classList.add("hint-center"),o==="right"&&e.classList.add("hint-right")}),e.addEventListener("dragleave",()=>X(e)),e.addEventListener("drop",async t=>{t.preventDefault();const n=!!e.closest("#simModal"),r=t.dataTransfer.getData("text/plain");if(!r){X(e);return}const a=parseInt(e.dataset.day,10),s=parseInt(e.dataset.slot,10),i=e.dataset.droppos||"full",o=e.dataset.droph||"single";let c=null;try{c=JSON.parse(r)}catch{}const d=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===i),p=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===i&&(h.hpos||"single")===o);if(c&&c.type==="course-parallel"){const y=c.courseId,h=c.pid||null;if(n){const L=(pe||De||[])[s];if(!L){X(e);return}const I=(K||[]).filter(q=>q.courseId!==y),U=d(I);if(p(I).length){alert("Ese espacio exacto ya está ocupado."),X(e);return}if(U.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),X(e);return}K=(K||[]).filter(q=>q.courseId!==y);const O=(((re||[]).find(q=>q.id===y)||(l.courses||[]).find(q=>q.id===y)||{}).name||"Ramo").trim(),z=J.get(y)||[],H=h?z.find(q=>q.pid===h):null,D=(H==null?void 0:H.section)||(H==null?void 0:H.pid)||null,Y=D?`${O} · ${D}`:O;K.push({courseId:y,day:a,slot:s,start:L.start,end:L.end,pos:i,hpos:o,pid:h,displayName:Y}),ke(),await je(),X(e);return}if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),X(e);return}const E=(De||[])[s];if(!E){X(e);return}const M=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),X(e);return}if(M.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),X(e);return}const g=(((l.courses||[]).find(L=>L.id===y)||{}).name||"Ramo").trim(),k=J.get(y)||[],S=h?k.find(L=>L.pid===h):null,b=(S==null?void 0:S.section)||(S==null?void 0:S.pid)||null,w=b?`${g} · ${b}`:null;await Ee(P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),{courseId:y,day:a,slot:s,start:E.start,end:E.end,pos:i,hpos:o,parallelPid:h||null,displayName:w,createdAt:Date.now()}),h&&V.set(y,h),X(e);return}if(c&&c.type==="move-block"){const y=c.id;if(!y){X(e);return}if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),X(e);return}try{const h=ie.find(S=>S.id===y);if(!h){X(e);return}const E=(De||[])[s];if(!E){X(e);return}if(h.day===a&&h.slot===s&&(h.pos||"full")===i&&(h.hpos||"single")===o){X(e);return}const M=ie.filter(S=>S.id!==y),$=d(M);if(p(M).length){alert("Ese espacio exacto ya está ocupado."),X(e);return}if($.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),X(e);return}const g=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",y);await ae(g,{day:a,slot:s,pos:i,hpos:o,start:E.start,end:E.end,updatedAt:Date.now()});const k=ie.findIndex(S=>S.id===y);k>=0&&Object.assign(ie[k],{day:a,slot:s,pos:i,hpos:o,start:E.start,end:E.end}),me(),X(e);return}catch(h){console.error("move error",h),alert("No se pudo mover el bloque (Firestore): "+((h==null?void 0:h.message)||h)),X(e);return}}const m=r;if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre."),X(e);return}const f=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),X(e);return}if(f.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),X(e);return}if(f.length===1){const y=f[0],h=y.hpos||"single";if(h==="single"&&o!=="single"){const E=o==="left"?"right":"left";try{await ae(N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule",y.id),{hpos:E})}catch{}}else if(h===o){alert("Ese lado ya está ocupado. Prueba el otro lado."),X(e);return}}const x=(De||[])[s];if(!x){X(e);return}await Ee(P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"schedule"),{courseId:m,day:a,slot:s,start:x.start,end:x.end,pos:i,hpos:o,createdAt:Date.now()}),X(e)}))})}function X(e){e.classList.remove("over","hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),delete e.dataset.droppos,delete e.dataset.droph}function Go(){var t;const e=u("horarioCompartido");e&&(e.innerHTML=`
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
    `,(t=u("party-semSel"))==null||t.addEventListener("change",n=>{l.partyView=l.partyView||{},l.partyView.semId=n.target.value||null,l.partyView.uid&&l.partyView.semId?Ft(l.partyView.uid,l.partyView.semId):Ve()}),Ve())}function Vo(e,t,n,r){const a=qe||[],s=a.find(f=>f.id===e.courseId),i=(s==null?void 0:s.name)||"Ramo",o=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():i,c=Sr(a,e.courseId,n),d=Er(c),p=typeof e.room=="string"&&e.room.trim()?e.room.trim():null,m=e.hpos||"single";return`
    <div class="placed pos-${t} h-${m}"
        title="${o}${p?` · Sala: ${p}`:""}"
        style="background:${c}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${d}; font-weight:600;">${o}</div>
    </div>
  `}async function Wo(e,t){var a;const n=Oa(t),r=n==="USM"||n==="UMAYOR";if(e)try{const s=N(C,"users",e,"custom_schedules",n),i=await te(s);if(i.exists()){const o=((a=i.data())==null?void 0:a.slots)||[];if(Array.isArray(o)&&o.length>0)return{uni:n,slots:o}}}catch(s){console.warn("[shared] error leyendo custom_schedules del dúo",s)}return r?{uni:n,slots:n==="UMAYOR"?Kt:pt}:{uni:n,slots:null}}async function Jo({course:e,day:t,slot:n,room:r}){if(!l.currentUser||!l.activeSemesterId)throw new Error("No logueado");const a=l.activeSemesterId,s=l.currentUser.uid,i=(l.courses||[]).find(p=>(p.name||"").toLowerCase().includes(String(e).toLowerCase()));if(!i)throw new Error("Curso no encontrado");const o=P(C,"users",s,"semesters",a,"schedule"),d=(await F(o)).docs.find(p=>{const m=p.data();return m.courseId===i.id&&m.day===t&&m.slot===n});if(!d)throw new Error("No encontré el bloque en el horario");return await ae(d.ref,{room:r||null,updatedAt:Date.now()}),{ok:!0,room:r}}async function Ko(e=null){if(!l.currentUser)throw new Error("No logueado");const t=e||l.activeSemesterId;if(!t)throw new Error("No hay semestre activo");const n=P(C,"users",l.currentUser.uid,"semesters",t,"schedule");return(await F(n)).docs.map(a=>({id:a.id,...a.data()}))}async function Zo(e=null){if(!l.currentUser)throw new Error("No logueado");const t=e||l.activeSemesterId;if(!t)throw new Error("No hay semestre activo");if(!l.pairOtherUid)return{items:[]};const n=P(C,"users",l.currentUser.uid,"semesters",t,"schedule"),a=(await F(n)).docs.map(d=>({...d.data()})),s=P(C,"users",l.pairOtherUid,"semesters",t,"schedule"),o=(await F(s)).docs.map(d=>({...d.data()})),c=[];for(const d of a)for(const p of o)d.day===p.day&&d.slot===p.slot&&c.push(`${["Lun","Mar","Mié","Jue","Vie"][d.day]} bloque ${d.slot} (${d.courseName} / ${p.courseName})`);return{items:c}}async function Xo(e,t=null){if(!l.currentUser)throw new Error("No logueado");const n=t||l.activeSemesterId;return await fe(N(C,"users",l.currentUser.uid,"semesters",n,"schedule",e)),{ok:!0}}document.addEventListener("dragstart",e=>{const t=e.target.closest(".placed");t&&t.classList.add("dragging")});document.addEventListener("dragend",e=>{const t=e.target.closest(".placed");t&&t.classList.remove("dragging")});const oa=8*60,Qo=22*60;function Z(e){const[t,n]=e.split(":").map(Number);return t*60+n}function Yn(e){return(e-oa)/(Qo-oa)*100}document.addEventListener("auth:ready",()=>{setTimeout(()=>{Ha(),$t()},1e3)});document.addEventListener("semester:changed",()=>{$t()});async function Va(e,t){if(!l.currentUser)return;const n=N(C,"users",l.currentUser.uid,"custom_schedules",e);await ye(n,{slots:t,updatedAt:Date.now()})}async function ia(e){if(!l.currentUser)return!1;try{const t=N(C,"users",l.currentUser.uid,"custom_schedules",e);return await fe(t),!0}catch(t){return console.error("[Firestore] Error al eliminar horario personalizado:",t),!1}}async function yn(){var r,a;const e=u("partyBar");if(!e)return;const t=(r=l.currentUser)==null?void 0:r.uid,n=(l.partyMembers||[]).filter(Boolean).filter(s=>s!==t);if(!n.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}if(l.partyView=l.partyView||{},!l.partyView.uid){const s=(a=l.currentUser)==null?void 0:a.uid;l.partyView.uid=n.find(i=>i!==s)||s||n[0]}await Promise.all(n.map(s=>Tr(s,{force:!0}))),e.innerHTML=n.map(s=>{var p;const i=le[s]||{},o=i.name||(s===((p=l.currentUser)==null?void 0:p.uid)?"Yo":"Usuario"),c=i.color||"#64748b",d=s===l.partyView.uid;return`
    <button class="party-chip btn ${d?"violet":"violet-outline"} ${d?"is-active":""}"
      data-uid="${s}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${d?"outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);":""}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${c};display:inline-block;"></span>
      <span style="font-weight:700">${Ae(o)}</span>
    </button>
  `}).join(""),e.querySelectorAll("button[data-uid]").forEach(s=>{s.addEventListener("click",async()=>{const i=s.dataset.uid;l.partyView.uid=i,await yn(),await Pr(i),await sr(),l.partyView.semId?Ft(i,l.partyView.semId):Ve()})})}async function Tr(e,{force:t=!1}={}){if(e&&!(!t&&le[e]))try{const n=N(C,"users",e),r=N(C,"users",e,"profile","profile"),[a,s]=await Promise.all([te(n),te(r)]),i=a.exists()?a.data()||{}:{},o=s.exists()?s.data()||{}:{},c=typeof o.name=="string"&&o.name.trim()?o.name.trim():typeof i.name=="string"&&i.name.trim()?i.name.trim():typeof i.displayName=="string"&&i.displayName.trim()?i.displayName.trim():typeof i.username=="string"&&i.username.trim()?i.username.trim():"",d=typeof o.favoriteColor=="string"&&o.favoriteColor.trim()?o.favoriteColor.trim():typeof i.favoriteColor=="string"&&i.favoriteColor.trim()?i.favoriteColor.trim():"";le[e]={name:c,color:d}}catch(n){console.warn("loadPartyMemberProfile error",n),le[e]=le[e]||{name:"",color:""}}}function Ae(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Ur(){var e;return`sim_palette_order_${((e=l.currentUser)==null?void 0:e.uid)||"anon"}_${l.activeSemesterId||"noSem"}`}function ar(){try{const e=localStorage.getItem(Ur()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function la(e){try{localStorage.setItem(Ur(),JSON.stringify(e||[]))}catch{}}function ei(e){const t=ar();if(!t.length)return e;const n=new Map(t.map((a,s)=>[a,s])),r=999999;return[...e].sort((a,s)=>{const i=n.has(a.id)?n.get(a.id):r,o=n.has(s.id)?n.get(s.id):r;return i!==o?i-o:String(a.name||"").localeCompare(String(s.name||""),"es")})}function ti(){const e=document.getElementById("simPaletteHost");if(!e)return;let t=null;e.querySelectorAll('.sim-course-group[draggable="true"]').forEach(n=>{n.addEventListener("dragstart",r=>{t=n.dataset.courseId,r.dataTransfer.effectAllowed="move",r.dataTransfer.setData("text/plain",t),n.classList.add("dragging")}),n.addEventListener("dragend",()=>{t=null,n.classList.remove("dragging"),e.querySelectorAll(".sim-course-group").forEach(r=>r.classList.remove("drag-over"))}),n.addEventListener("dragover",r=>{r.preventDefault(),r.dataTransfer.dropEffect="move",n.classList.add("drag-over")}),n.addEventListener("dragleave",()=>{n.classList.remove("drag-over")}),n.addEventListener("drop",r=>{r.preventDefault(),n.classList.remove("drag-over");const a=n.dataset.courseId;if(!t||!a||t===a)return;if(!ar().length){const p=Array.from(e.querySelectorAll(".sim-course-group")).map(m=>m.dataset.courseId).filter(Boolean);la(p)}const i=ar().filter(Boolean),o=(l.courses||[]).map(p=>p.id);for(const p of o)i.includes(p)||i.push(p);const c=i.filter(p=>p!==t),d=c.indexOf(a);c.splice(Math.max(0,d),0,t),la(c),ct()})})}function ni(){if(document.getElementById("simPaletteReorderStyles"))return;const e=document.createElement("style");e.id="simPaletteReorderStyles",e.textContent=`
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
    `,document.head.appendChild(e)}async function Pr(e){const t=u("party-semSel");if(!t||(t.innerHTML='<option value="">— seleccionar —</option>',!e))return;const n=P(C,"users",e,"semesters"),a=(await F(Q(n))).docs.map(s=>{var i;return{id:s.id,label:(((i=s.data())==null?void 0:i.label)||s.id).trim()}});a.sort((s,i)=>i.label.localeCompare(s.label));for(const s of a){const i=document.createElement("option");i.value=s.id,i.textContent=s.label,t.appendChild(i)}}async function sr(){var s,i;const e=(s=l.partyView)==null?void 0:s.uid,t=(i=l.activeSemesterData)==null?void 0:i.label,n=u("party-semSel");if(!e||!t||!n)return;await Pr(e);const r=Array.from(n.options),a=r.find(o=>(o.textContent||"").trim()===t);if(a)n.value=a.value,l.partyView.semId=a.value,await Ft(e,a.value);else{const o=r.find(c=>c.value);n.value=o?o.value:"",l.partyView.semId=n.value||null,l.partyView.semId&&await Ft(e,l.partyView.semId)}}function Ve(){const e=u("schedPartyUSM");if(!e)return;if(!qe||qe.length===0){e.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>';return}const t=wt||pt;er=t;const n=ze==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n}</div>
        ${$e.map(r=>`<div class="cell header">${r}</div>`).join("")}
        ${t.map((r,a)=>`
          <div class="cell mod ${r.lunch?"lunch":""}" data-slot="${a}">
            ${_n(r,a,ze)}
          </div>
          ${$e.map((s,i)=>`
            <div class="cell slot ${r.lunch?"is-lunch":""}"
                data-day="${i}" data-slot="${a}">
              ${ri(i,a)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `}function ri(e,t){const n=xt.filter(a=>a.day===e&&a.slot===t),r=a=>{var d,p;const s=n.filter(m=>(m.pos||"full")===a);if(!s.length)return"";const i=s.sort((m,f)=>{const v={left:0,single:1,right:2};return(v[m.hpos||"single"]??1)-(v[f.hpos||"single"]??1)}),o=(d=l.partyView)==null?void 0:d.uid,c=((p=le[o])==null?void 0:p.color)||po;return i.map(m=>Vo(m,a,c)).join("")};return`
      ${r("top")}
      ${r("full")}
      ${r("bottom")}
    `}async function Ft(e,t){var c,d;if(rn&&(rn(),rn=null),an&&(an(),an=null),sn&&(sn(),sn=null),!e||!t)return;if(!qo(e,t)){xt=[],qe=[],wt=null,ze="USM";const p=u("schedPartyUSM");p&&(p.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>')}const r=(c=l.partyView)!=null&&c.semId?(d=(await te(N(C,"users",e,"semesters",l.partyView.semId))).data())==null?void 0:d.universityAtThatTime:"",{uni:a,slots:s}=await Wo(e,r);ze=a,wt=s||(a==="UMAYOR"?Kt:pt),sn=G(N(C,"users",e),p=>{const m=p.data()||{};le[e]=le[e]||{},le[e].color=m.favoriteColor||le[e].color||"",le[e].name=m.displayName||m.name||m.username||le[e].name||"",Ve()});const i=P(C,"users",e,"semesters",t,"courses");an=G(Q(i,Se("name")),p=>{qe=p.docs.map(m=>({id:m.id,...m.data()})),Cn.set(Ln(e,t),{uni:ze,slots:wt,items:xt,courses:qe}),Ve()});const o=P(C,"users",e,"semesters",t,"schedule");rn=G(Q(o),p=>{xt=p.docs.map(m=>({id:m.id,...m.data()})),Cn.set(Ln(e,t),{uni:ze,slots:wt,items:xt,courses:qe}),Ve()})}async function ai(){var e,t,n;for(const[r,a]of Qn.entries()){try{(e=a.prof)==null||e.call(a)}catch{}try{(t=a.courses)==null||t.call(a)}catch{}try{(n=a.sched)==null||n.call(a)}catch{}}Qn.clear(),Fe.clear()}async function si(e,t,{allowFallback:n=!0}={}){const r=P(C,"users",e,"semesters"),s=(await F(Q(r))).docs.map(o=>{var c;return{id:o.id,label:String(((c=o.data())==null?void 0:c.label)||o.id).trim()}});if(!s.length)return null;const i=t?s.find(o=>o.label===t):null;return i?i.id:!n&&t?null:(s.sort((o,c)=>c.label.localeCompare(o.label)),s[0].id)}async function ca(e=null){var s,i,o;const t=(s=l.currentUser)==null?void 0:s.uid,n=Array.from(new Set([...l.partyMembers||[],t])).filter(Boolean);if(!n.length){const c=u("schedPartyBusy");c&&(c.innerHTML='<div class="muted">No hay miembros en tu party.</div>');return}await ai();const r=e??(((i=l.activeSemesterData)==null?void 0:i.label)||null),a=!!e;await Promise.all(n.map(c=>Tr(c,{force:!0})));for(const c of n){const d=await si(c,r,{allowFallback:!a});if(!d)continue;const p=le[c]||{};Fe.set(c,{name:p.name||(c===((o=l.currentUser)==null?void 0:o.uid)?"Yo":"Usuario"),color:p.color||"#64748b",uni:"USM",slots:null,courses:[],items:[],semId:d});const m=(h,E="#64748b")=>{const M=String(h||"").trim();return/^#[0-9A-Fa-f]{6}$/.test(M)?M:E},f=(h,E="Usuario")=>{const M=String(h||"").trim();return M||E},v={};v.prof=G(N(C,"users",c,"profile","profile"),h=>{var $;const E=h.data()||{},M=Fe.get(c);M&&(M.color=m(E.favoriteColor,M.color||"#64748b"),M.name=f(E.name,M.name||(c===(($=l.currentUser)==null?void 0:$.uid)?"Yo":"Usuario")),Dt())});const x=P(C,"users",c,"semesters",d,"courses");v.courses=G(Q(x,Se("name")),h=>{const E=Fe.get(c);E&&(E.courses=h.docs.map(M=>({id:M.id,...M.data()})),Dt())});const y=P(C,"users",c,"semesters",d,"schedule");v.sched=G(Q(y),h=>{const E=Fe.get(c);E&&(E.items=h.docs.map(M=>({id:M.id,...M.data(),_uid:c})),Dt())}),Qn.set(c,v)}Dt()}function oi(e){const t=[...e].sort((r,a)=>r.startMin-a.startMin||r.endMin-a.endMin),n=[];for(const r of t){let a=!1;for(let s=0;s<n.length;s++)if(n[s]<=r.startMin){r._lane=s,n[s]=r.endMin,a=!0;break}a||(r._lane=n.length,n.push(r.endMin))}return{blocks:t,laneCount:n.length||1}}function ii(){if(document.getElementById("timelineStyles"))return;const e=document.createElement("style");e.id="timelineStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function or(e="schedPartyBusy"){ii();const t=document.getElementById(e);if(!t)return;const n=Array.from(Fe.entries());if(!n.length){t.innerHTML='<div class="muted">Cargando party…</div>';return}const r=[];for(const[a,s]of n)for(const i of s.items||[]){const o=Z(i.start),c=Z(i.end);isNaN(o)||isNaN(c)||c<=o||r.push({...i,_uid:a,_name:s.name,_favColor:s.color,startMin:o,endMin:c})}t.innerHTML=`
      <div class="timeline-wrap">
        <div class="timeline-head">
          <div></div>
          ${$e.map(a=>`<div class="timeline-dayname">${a}</div>`).join("")}
        </div>
        <div class="timeline-body">
          <div class="timeline-timecol">
            ${Array.from({length:15},(a,s)=>`<div class="timeline-timecell">${8+s}:00</div>`).join("")}
          </div>
          ${$e.map((a,s)=>`
            <div class="timeline-day">
              ${li()}
              ${(()=>{const i=r.filter(c=>c.day===s).map(c=>({...c,topPct:Yn(c.startMin),heightPct:Yn(c.endMin)-Yn(c.startMin)})).filter(c=>c.heightPct>0),o=oi(i);return o.blocks.map(c=>ci(c,o.laneCount)).join("")})()}
            </div>
          `).join("")}
        </div>
      </div>
    `}function li(){return Array.from({length:15},(e,t)=>{const n=t*6.666666666666667,r=n+100/15/2;return`
        <div class="timeline-line" style="top:${n}%"></div>
        <div class="timeline-line half" style="top:${r}%"></div>
      `}).join("")}function ci(e,t){const n=Fe.get(e._uid),r=(n==null?void 0:n.color)||e._favColor||"#64748b",s=((n==null?void 0:n.courses)||[]).find(y=>y.id===e.courseId),i=((s==null?void 0:s.name)||"Ramo").trim(),o=t>1,c=r,d=da(c,o?.35:.9),p=Er(c),m=da(c,1),f=o?e._lane===0?"top":e._lane===1?"bottom":"center":"center",v=f==="top"?"top:6px; transform:none;":f==="bottom"?"bottom:6px; transform:none;":"top:50%; transform:translateY(-50%);",x=10+(e._lane||0);return`
      <div class="timeline-block"
        title="${Ae(i)}"
        style="
          position:absolute;
          top:${e.topPct}%;
          height:${e.heightPct}%;
          left:0%;
          width:100%;
          z-index:${x};
          border-radius:10px;
          background:${d};
          border:2px solid ${m};
          box-sizing:border-box;
          overflow:hidden;
        ">
        <div style="
          position:absolute;
          left:8px; right:8px;
          ${v}
          color:${p};
          font-size:12px;
          font-weight:900;
          line-height:1.1;
          text-align:center;
          text-shadow: 0 1px 2px rgba(0,0,0,.45);
          pointer-events:none;
        ">
          ${Ae(i)}
        </div>
      </div>
    `}function da(e,t){if(!At(e))return`rgba(100,116,139,${t})`;const n=parseInt(e.slice(1,3),16),r=parseInt(e.slice(3,5),16),a=parseInt(e.slice(5,7),16),s=Math.max(0,Math.min(1,t));return`rgba(${n},${r},${a},${s})`}function gn(e){const t=document.getElementById(e);if(!t)return;const n=Array.from(Fe.entries()).map(([r,a])=>{var s;return{uid:r,name:(a==null?void 0:a.name)||(r===((s=l.currentUser)==null?void 0:s.uid)?"Yo":"Usuario"),color:(a==null?void 0:a.color)||"#64748b"}}).sort((r,a)=>r.name.localeCompare(a.name,"es"));if(!n.length){t.innerHTML='<div class="muted">Cargando integrantes…</div>';return}t.innerHTML=n.map(r=>`
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color};display:inline-block;"></span>
        <span style="font-weight:800">${Ae(r.name)}</span>
      </div>
    `).join("")}function di(){var i,o,c;const e=document.getElementById("simModal");e&&e.remove();const t=document.createElement("div");t.id="simModal",t.style.cssText=`
      position:fixed; inset:0; display:none; align-items:center; justify-content:center;
      background:rgba(0,0,0,.62); z-index:10050; padding:16px;
    `,t.innerHTML=`
      <div style="
        width:min(980px, 98vw);
        max-height: 92vh;
        overflow:auto;
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
    `,document.body.appendChild(t);const n=t,r=d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())},a=()=>{n.style.display="none",Ce=!1,Ie=null,pe=null,document.removeEventListener("keydown",r),document.dispatchEvent(new Event("courses:changed"))};(i=document.getElementById("simExportBtn"))==null||i.addEventListener("click",async d=>{var f,v;if(d.preventDefault(),d.stopPropagation(),!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo.");return}if(!await it({title:"Exportar simulación",text:"¿Quieres exportar esta simulación a tu semestre?",yesText:"Sí, exportar",noText:"Cancelar"}))return;const m=document.getElementById("simExportBtn");m&&(m.disabled=!0,m.textContent="Exportando...");try{await mi(),ua(),pe=null,re=[],K=[],(f=J.clear)==null||f.call(J),(v=V.clear)==null||v.call(V),Ie=null,En="",Be=!1,a(),await me(),alert("✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.")}catch(x){console.error(x),alert("No se pudo exportar la simulación. Revisa consola.")}finally{m&&(m.disabled=!1,m.textContent="Exportar a mi horario")}}),(o=document.getElementById("simDeleteBtn"))==null||o.addEventListener("click",async d=>{var m,f;d.preventDefault(),d.stopPropagation(),await it({title:"Eliminar simulación",text:"Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?",yesText:"Sí, eliminar",noText:"Cancelar"})&&(ua(),pe=null,re=[],K=[],(m=J.clear)==null||m.call(J),(f=V.clear)==null||f.call(V),Ie=null,En="",Be=!1,a())});const s=async()=>{if(!await it({title:"Salir del simulador",text:"¿Quieres salir del simulador?",yesText:"Sí, salir",noText:"Cancelar"}))return;const p=Ba(),m=await Oo({title:"Salir del simulador",message:p?"Tienes cambios sin guardar. ¿Qué quieres hacer?":"No hiciste cambios. ¿Cómo quieres salir?",saveText:"Guardar y salir",discardText:"Salir sin guardar",cancelText:"Cancelar"});if(m!=="cancel"){if(m==="save"){fi(),a();return}if(m==="discard"){Ro(Ie,{persist:!0}),Be=!1,Dn(),me(),a();return}}};(c=document.getElementById("simX"))==null||c.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),s()}),n.addEventListener("click",d=>{d.target===n&&s()}),document.addEventListener("keydown",d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())})}function ui(e,t){const n=K.filter(r=>r.day===e&&r.slot===t);return n.length?Ya(n,!0):""}async function pi(){var r;const e=pe||await ft();if(!e)return;const t=Array.isArray(re)?re:l.courses||[],n=[];for(const a of t){const s=J.get(a.id)||[];if(!s.length)continue;const i=V.get(a.id)||((r=s[0])==null?void 0:r.pid)||null;if(!i)continue;const o=s.find(p=>p.pid===i);if(!o)continue;const c=(a.name||"Ramo").trim(),d=o.section||i;for(const p of o.blocks||[]){const m=e==null?void 0:e[p.slot];!m||m.lunch||n.push({courseId:a.id,day:p.day,slot:p.slot,start:m.start,end:m.end,pos:p.pos||"full",pid:i,displayName:`${c} · ${d}`})}}K=n,ke()}async function ir(e,t){const r=(J.get(e)||[]).find(c=>c.pid===t);if(!r)return;const a=pe||await ft();if(!a)return;K=K.filter(c=>c.courseId!==e),ke();const i=(((l.courses||[]).find(c=>c.id===e)||{}).name||"Ramo").trim(),o=r.section||t;for(const c of r.blocks||[]){const d=a==null?void 0:a[c.slot];!d||d.lunch||K.push({courseId:e,day:c.day,slot:c.slot,start:d.start,end:d.end,pos:c.pos||"full",pid:t,displayName:`${i} · ${o}`})}V.set(e,t),ct(),await je()}async function je(){const e=document.getElementById("simGridHost");if(!e)return;const t=pe||await ft();if(!t){e.innerHTML=`
        <div style="text-align:center; padding:18px;">
          <div style="font-weight:900; margin-bottom:6px;">No hay horario base para esta universidad</div>
          <div class="muted" style="opacity:.8;">Crea un horario personalizado en la vista normal.</div>
        </div>
      `;return}const n=mt(),r=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${r}</div>
        ${$e.map(a=>`<div class="cell header">${a}</div>`).join("")}
        ${t.map((a,s)=>`
          <div class="cell mod ${a.lunch?"lunch":""}" data-slot="${s}">
            ${_n(a,s,n)}
          </div>
          ${$e.map((i,o)=>`
            <div class="cell slot ${a.lunch?"is-lunch":""}"
                data-day="${o}" data-slot="${s}"
                ${a.lunch?'aria-disabled="true"':""}
                style="${a.lunch?"pointer-events:none; opacity:.65;":""}">
                ${ui(o,s)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `}async function Wa(){var s,i,o;if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo antes de usar el simulador.");return}const e=Do();if(e&&Array.isArray(e)&&e.length)pe=e;else{const c=await Ho();if(!c)return;pe=c,kr(pe)}Xn=!1,di();const t=document.getElementById("simModal");t.style.display="flex",Ce=!0,re=Yo(),K=Po();const n=_o();(s=J.clear)==null||s.call(J);for(const[c,d]of n.entries())J.set(c,d||[]);const r=Bo();(i=V.clear)==null||i.call(V);for(const[c,d]of r.entries())d&&V.set(c,d);(!K||!K.length)&&await pi(),document.dispatchEvent(new Event("courses:changed"));const a=document.getElementById("simActiveSemLabel");if(a){const c=((o=l.activeSemesterData)==null?void 0:o.label)||l.activeSemesterId||"—";a.textContent=c}await je(),Ie=wr(),En=Ie,Be=!1}async function mi(){if(!l.currentUser||!l.activeSemesterId){alert("Selecciona un semestre activo.");return}const e=l.currentUser.uid,t=l.activeSemesterId,n=mt()||"UNI_desconocida",r=pe||await ft();if(!r||!Array.isArray(r)||!r.length){alert("No hay slots para guardar la simulación.");return}try{ge[n]=r,localStorage.setItem(`custom_slots_${n}_${e}`,JSON.stringify(r)),await Va(n,r)}catch(g){console.warn("No se pudo persistir slots base",g)}const a=P(C,"users",e,"semesters",t,"courses"),s=P(C,"users",e,"semesters",t,"schedule"),[i,o]=await Promise.all([F(Q(a)),F(Q(s))]),c=i.docs.map(g=>({id:g.id,...g.data()})),d=o.docs.map(g=>({id:g.id,...g.data()})),p=c.length>0;let m=!0;p&&(m=!!await it({title:"Exportar simulación",text:`Ya tienes ramos guardados en este semestre.

¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?`,yesText:"Sí, borrar anteriores",noText:"No, que convivan"})),m&&(await lr(s),await lr(a));const f=m?[]:c,v=m?[]:d,x=new Map;for(const g of f){const k=Ut((g==null?void 0:g.code)||(g==null?void 0:g.codigo)||"");k&&(x.has(k)||x.set(k,new Set),x.get(k).add(g.id))}const y=new Map;for(const g of f){const k=Ut((g==null?void 0:g.name)||(g==null?void 0:g.nombre)||"");k&&y.set(k,g.id)}const h=new Map,E=(re||[]).filter(g=>String(g.id||"").startsWith("SIM_"));for(const g of E){const k={name:(g.name||"").trim()||"Ramo",code:(g.code||"").trim()||"",professor:g.professor||"",section:g.section||"",color:At(g.color)?g.color:"#3B82F6",asistencia:!!g.asistencia,createdAt:Date.now()},S=Ut(k.code);if(!m&&S&&x.has(S)){const L=Array.from(x.get(S)||[]);if(L.length){const U=(await F(Q(s))).docs.filter(B=>{var T;return L.includes((T=B.data())==null?void 0:T.courseId)});for(const B of U)await fe(B.ref);for(const B of L){await fe(N(C,"users",e,"semesters",t,"courses",B));for(const[T,O]of y.entries())O===B&&y.delete(T)}}x.delete(S)}if(!m&&!S){const L=Ut(k.name),I=y.get(L);if(I){h.set(g.id,I);continue}}const b=await Ee(a,k);S&&(x.has(S)||x.set(S,new Set),x.get(S).add(b.id)),h.set(g.id,b.id);const w=Ut(k.name);w&&y.set(w,b.id)}const M=await F(Q(a,Se("createdAt")));l.courses=M.docs.map(g=>({id:g.id,...g.data()})),document.dispatchEvent(new Event("courses:changed"));const $=g=>{const k=String(g.courseId||""),S=Number(g.day),b=Number(g.slot),w=String(g.pos||"full"),L=String(g.hpos||"single"),I=String(g.pid||g.parallelPid||""),U=String(g.displayName||"").trim(),B=String(g.start||""),T=String(g.end||"");return[k,S,b,w,L,I,U,B,T].join("|")},A=new Set((v||[]).map(g=>$({courseId:g.courseId,day:g.day,slot:g.slot,pos:g.pos,hpos:g.hpos,pid:g.parallelPid,displayName:g.displayName,start:g.start,end:g.end})));for(const g of K||[]){const k=h.get(g.courseId)||g.courseId;if(String(k).startsWith("SIM_"))continue;const S=r[g.slot];if(!S||S.lunch)continue;const b={courseId:k,day:g.day,slot:g.slot,start:S.start,end:S.end,pos:g.pos||"full",hpos:g.hpos||"single",parallelPid:g.pid||g.parallelPid||null,displayName:typeof g.displayName=="string"&&g.displayName.trim()?g.displayName.trim():null,createdAt:Date.now()};if(!m){const w=$(b);if(A.has(w))continue;A.add(w)}await Ee(s,b)}}function Ut(e){return String(e||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}async function lr(e){const t=await F(e);for(const n of t.docs)await fe(n.ref)}function fi(){kr(pe),Bn(re),ja(),Ar(),$r(),Ie=wr(),En=Ie,Be=!1}function ua(){try{localStorage.removeItem(Lr())}catch{}try{localStorage.removeItem(Nr())}catch{}try{localStorage.removeItem(Mr())}catch{}try{localStorage.removeItem(Ir())}catch{}try{localStorage.removeItem(Cr())}catch{}try{localStorage.removeItem(Ur())}catch{}}const pa=Object.freeze(Object.defineProperty({__proto__:null,MAYOR_SLOTS:Kt,USM_SLOTS:pt,getMySchedule:Ko,initSchedule:Ha,onActiveSemesterChanged:$t,openSimSchedule:Wa,overlapWithPair:Zo,refreshCourseOptions:Mo,removeBlock:Xo,setRoom:Jo},Symbol.toStringTag,{value:"Module"}));let j=new Date,rt=null,jt=[],cr=!1,_t=null,vn=null,bn=null,at=null,Mn=[],Ot="#ff69b4",dt=null;const dr=new Map,Ht=new Map;function yi(e){_t=e}function gi(){try{_t==null||_t()}finally{_t=null}}function vi(){ns();const e=u("page-calendario");if(e){e.classList.add("hidden");const t=e.querySelector("[data-cal-grid]")||e.querySelector(".cal-grid");t&&(t.innerHTML="")}}function bi(){var e;(e=u("page-calendario"))==null||e.classList.remove("hidden")}function hi(){return Me(Ot)?Ot:"#ff69b4"}function Rn(){const e=l.profileData||{},t=l.currentUser||{};return typeof e.favoriteColor=="string"&&Me(e.favoriteColor)?e.favoriteColor:typeof t.favoriteColor=="string"&&Me(t.favoriteColor)?t.favoriteColor:"#3B82F6"}function Me(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function xi(e,t="#3B82F6"){if(!e)return t;const n=(l.courses||[]).find(r=>r.id===e);return Me(n==null?void 0:n.color)?n.color:t}function wi(e,t=Rn()){if(e!=null&&e.courseId){const n=(l.courses||[]).find(r=>r.id===e.courseId);if(Me(n==null?void 0:n.color))return n.color}return Me(e==null?void 0:e.color)?e.color:t}function Dr(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}function Ja(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return Ja(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function Ka(){var r,a,s,i;const e=(r=l.currentUser)==null?void 0:r.uid,t=[l.partyMembers,l.party,l.partyData,l.activeParty,(a=l.shared)==null?void 0:a.party,(s=l.shared)==null?void 0:s.partyData,(i=l.shared)==null?void 0:i.partyMembers];let n=[];for(const o of t)if(n=Ja(o),n.length)break;return[...new Set(n.filter(Boolean))].filter(o=>o!==e)}const ve=Object.create(null);function Yt(e={},t={}){return typeof t.displayName=="string"&&t.displayName.trim()?t.displayName.trim():typeof t.name=="string"&&t.name.trim()?t.name.trim():typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():typeof e.name=="string"&&e.name.trim()?e.name.trim():"Usuario"}function Gt(e={},t={}){return typeof t.favoriteColor=="string"&&Me(t.favoriteColor)?t.favoriteColor:typeof e.favoriteColor=="string"&&Me(e.favoriteColor)?e.favoriteColor:"#64748b"}async function Za(e){if(!e)return{name:"Usuario",favoriteColor:"#64748b"};if(ve[e])return ve[e];try{const t=N(C,"users",e),n=N(C,"users",e,"profile","profile"),[r,a]=await Promise.all([te(t),te(n)]),s=r.exists()?r.data()||{}:{},i=a.exists()?a.data()||{}:{},o={name:Yt(s,i),favoriteColor:Gt(s,i)};return ve[e]=o,o}catch(t){return console.warn("cal_loadMemberProfile error",t),ve[e]={name:"Usuario",favoriteColor:"#64748b"},ve[e]}}async function Si(){const e=Ka();if(!e.length)return[];const t=await Promise.all(e.map(n=>Za(n)));return e.map((n,r)=>{var a,s;return{uid:n,name:((a=t[r])==null?void 0:a.name)||"Usuario",favoriteColor:((s=t[r])==null?void 0:s.favoriteColor)||"#64748b"}})}async function Je(){const e=u("calendarPartyPicker");if(!e)return;const t=await Si();if(!t.length){e.innerHTML='<div class="muted">No hay integrantes disponibles en tu party.</div>';return}e.innerHTML=t.map(n=>{const r=n.uid===dt;return`
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
    `}).join(""),e.querySelectorAll(".calendar-party-chip").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.uid;r&&(dt=r,await Je(),await Wt())})})}function Xa(){cr||(cr=!0,Ci(),Li(),_r(),qt(),We(),Qa(),es(),document.addEventListener("pair:ready",async()=>{await Je(),await Wt()}),document.addEventListener("pair:ready",async()=>{await In(),Ct()}),document.addEventListener("profile:changed",()=>{Lt(),he()}),document.addEventListener("profile:ready",()=>{Lt(),he()}),Je(),Wt(),In(),Mi())}function Vt(){cr||Xa()}function lt(){Vt(),rt&&(rt(),rt=null),Qa(),es(),qt(),We(),Ct(),dt&&Wt(),In()}function Ei(){Vt(),Lt(),Mt(),he()}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",Vt):Vt();document.addEventListener("route:calendario",Vt);function Ci(){const e=u("page-calendario");e&&(e.innerHTML=`
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

      <div id="cal-propio">
        <div class="cal-grid" id="calGrid" aria-live="polite"></div>
        <div class="muted" style="margin-top:8px">
          Haz clic en un día para agregar un evento.  
          Usa el botón "Importar Google Calendar" para traer eventos de tu mes actual.
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
  `)}function Li(){var e,t,n,r;(e=u("calPrev"))==null||e.addEventListener("click",()=>{j=ma(j,-1),ln(),qt(),We(),Ct()}),(t=u("calNext"))==null||t.addEventListener("click",()=>{j=ma(j,1),ln(),qt(),We(),Ct()}),(n=u("calToday"))==null||n.addEventListener("click",()=>{j=new Date,ln(),qt(),We(),Ct()}),(r=u("calImportGoogle"))==null||r.addEventListener("click",$i),ln()}function ln(){const e=j.getFullYear(),t=j.getMonth(),n=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],r=u("calTitle");r&&(r.textContent=`Calendario · ${n[t][0].toUpperCase()}${n[t].slice(1)} ${e}`)}function Qa(){var t;const e=u("calActiveSem");e&&(e.textContent=((t=l.activeSemesterData)==null?void 0:t.label)||"—")}function Mi(){const e=u("cal-subtab-propio"),t=u("cal-subtab-compartido"),n=u("cal-subtab-combinado"),r=u("cal-propio"),a=u("cal-compartido"),s=u("cal-combinado");function i(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function o(){if(t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await Je(),We(),!dt){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}u("calSharedHint").textContent="",await Wt()}async function c(){await In(),n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),Ct(),await Ui()}e==null||e.addEventListener("click",i),t==null||t.addEventListener("click",o),n==null||n.addEventListener("click",c),i()}function es(){if(rt&&(rt(),rt=null),jt=[],Lt(),!l.currentUser||!l.activeSemesterId)return;const e=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");rt=G(Q(e,Se("date","asc")),t=>{jt=t.docs.map(n=>({id:n.id,...n.data()})),Lt()})}async function Wt(){ts(),Mn=[],Ot="#ff69b4",We();const e=dt;if(!e){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}if(u("calSharedHint").textContent="",!await Ii())return;at&&(at(),at=null);const n=G(N(C,"users",e),async a=>{const s=a.exists()?a.data()||{}:{},i=ve[e]||{},o={displayName:s.displayName,name:s.name,favoriteColor:s.favoriteColor},c={displayName:i._profDisplayName,name:i._profName,favoriteColor:i._profFavoriteColor},d={name:Yt(o,c),favoriteColor:Gt(o,c),_rootDisplayName:s.displayName||null,_rootName:s.name||null,_rootFavoriteColor:s.favoriteColor||null,_profDisplayName:i._profDisplayName||null,_profName:i._profName||null,_profFavoriteColor:i._profFavoriteColor||null};ve[e]=d,Me(d.favoriteColor)&&(Ot=d.favoriteColor),Mt(),he(),await Je()}),r=G(N(C,"users",e,"profile","profile"),async a=>{const s=a.exists()?a.data()||{}:{},i=ve[e]||{},o={displayName:i._rootDisplayName,name:i._rootName,favoriteColor:i._rootFavoriteColor},c={displayName:s.displayName,name:s.name,favoriteColor:s.favoriteColor},d={name:Yt(o,c),favoriteColor:Gt(o,c),_rootDisplayName:i._rootDisplayName||null,_rootName:i._rootName||null,_rootFavoriteColor:i._rootFavoriteColor||null,_profDisplayName:s.displayName||null,_profName:s.name||null,_profFavoriteColor:s.favoriteColor||null};ve[e]=d,Me(d.favoriteColor)&&(Ot=d.favoriteColor),Mt(),he(),await Je()});at=()=>{try{n==null||n()}catch{}try{r==null||r()}catch{}}}function ts(){vn&&(vn(),vn=null),bn&&(bn(),bn=null),at&&(at(),at=null)}function ns(){for(const[,e]of dr.entries())try{e==null||e()}catch{}dr.clear(),Ht.clear()}async function In(){var n;ns();const e=Ka();if(!e.length){he();return}const t=((n=l.activeSemesterData)==null?void 0:n.label)||null;if(!t){he();return}for(const r of e)try{await Za(r);const a=G(N(C,"users",r),async p=>{const m=p.exists()?p.data()||{}:{},f=ve[r]||{},v={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor},x={displayName:f._profDisplayName,name:f._profName,favoriteColor:f._profFavoriteColor};ve[r]={name:Yt(v,x),favoriteColor:Gt(v,x),_rootDisplayName:m.displayName||null,_rootName:m.name||null,_rootFavoriteColor:m.favoriteColor||null,_profDisplayName:f._profDisplayName||null,_profName:f._profName||null,_profFavoriteColor:f._profFavoriteColor||null},he(),await Je()}),s=G(N(C,"users",r,"profile","profile"),async p=>{const m=p.exists()?p.data()||{}:{},f=ve[r]||{},v={displayName:f._rootDisplayName,name:f._rootName,favoriteColor:f._rootFavoriteColor},x={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor};ve[r]={name:Yt(v,x),favoriteColor:Gt(v,x),_rootDisplayName:f._rootDisplayName||null,_rootName:f._rootName||null,_rootFavoriteColor:f._rootFavoriteColor||null,_profDisplayName:m.displayName||null,_profName:m.name||null,_profFavoriteColor:m.favoriteColor||null},he(),await Je()}),i=P(C,"users",r,"semesters"),o=await F(i);let c=null;o.forEach(p=>{var f;(((f=p.data())==null?void 0:f.label)||"").trim()===t&&(c=p.id)});let d=null;if(c){const p=P(C,"users",r,"semesters",c,"calendar");d=G(Q(p,Se("date","asc")),m=>{Ht.set(r,m.docs.map(f=>({id:f.id,...f.data(),ownerUid:r}))),he()})}else Ht.set(r,[]),he();dr.set(r,()=>{try{a==null||a()}catch{}try{s==null||s()}catch{}try{d==null||d()}catch{}})}catch(a){console.warn("subscribeCombinedPartyMembers error",r,a),Ht.set(r,[])}he()}async function Ii(){var n;const e=dt;if(!e)return null;const t=((n=l.activeSemesterData)==null?void 0:n.label)||null;if(!t)return u("calSharedHint").textContent="No tienes semestre activo seleccionado.",null;try{const r=P(C,"users",e,"semesters"),a=await F(r);let s=null;if(a.forEach(o=>{var d;const c=(((d=o.data())==null?void 0:d.label)||"").trim();c===t&&(s={id:o.id,label:c})}),l.shared=l.shared||{},l.shared.calendar=l.shared.calendar||{},s)return l.shared.calendar.semId=s.id,u("calSharedHint").textContent="",await ki(s.id),s.id;l.shared.calendar.semId=null;const i=u("calSharedGrid");return i&&(i.innerHTML=`<div class="muted">Esta persona no tiene el semestre <b>${t}</b> creado.</div>`),u("calSharedHint").textContent="Se intenta mostrar el mismo semestre activo que tienes tú.",null}catch(r){return console.error("populateSharedSemesters error",r),u("calSharedHint").textContent="Error al cargar el calendario compartido.",null}}async function ki(e){ts(),Mn=[],We();const t=dt;if(!t||!e)return;const n=P(C,"users",t,"semesters",e,"courses");bn=G(Q(n,Se("name")),a=>{a.docs.map(s=>({id:s.id,...s.data()})),Mt()});const r=P(C,"users",t,"semesters",e,"calendar");vn=G(Q(r,Se("date","asc")),a=>{Mn=a.docs.map(s=>({id:s.id,...s.data()})),Mt()})}function _r(){if(u("calModal"))return;const e=document.createElement("div");e.id="calModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("calModalBackdrop").addEventListener("click",t),u("calEvtCancel").addEventListener("click",t),u("calEvtSave").addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}const n=(u("calEvtTitle").value||"").trim(),r=u("calEvtDate").value||"",a=u("calEvtStart").value||null,s=u("calEvtEnd").value||null,i=u("calEvtCourse").value||null,o=u("calEvtRepeat").value||"",c=u("calEvtPersistent").value==="true",d=i?xi(i):Rn();if(!n)return alert("Ingresa un título.");if(!r)return alert("Selecciona una fecha.");const p=e.dataset.editingId||null,m=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");try{p?(await ae(N(m,p),{title:n,date:r,start:a,end:s,courseId:i,color:d,repeat:o?{every:o,interval:1}:null,persistent:c,updatedAt:Date.now()}),console.log("[Calendar] Evento actualizado:",n)):(await Ee(m,{title:n,date:r,start:a,end:s,courseId:i,color:d,repeat:o?{every:o,interval:1}:null,persistent:c,createdAt:Date.now()}),console.log("[Calendar] Evento creado:",n)),t()}catch(f){console.error(f),alert("No se pudo guardar el evento.")}finally{e.dataset.editingId=""}})}function Ai(){if(u("gcalImportModal"))return;const e=document.createElement("div");e.id="gcalImportModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("gcalImportBackdrop").addEventListener("click",t),u("gcalRangeCancel").addEventListener("click",t),u("gcalRangeConfirm").addEventListener("click",async()=>{if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}const n=u("gcalRangeStart").value,r=u("gcalRangeEnd").value;if(!n||!r){alert("Selecciona ambas fechas (inicio y término).");return}const[a,s,i]=n.split("-").map(Number),[o,c,d]=r.split("-").map(Number),p=new Date(a,s-1,i,0,0,0),m=new Date(o,c-1,d+1,0,0,0);if(m<=p){alert("La fecha de término debe ser posterior a la de inicio.");return}try{await Ji(p,m),t()}catch(f){console.error("Error al importar rango desde Google Calendar:",f),alert("Ocurrió un error al importar eventos de Google Calendar.")}})}function $i(){if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}Ai();const e=j.getFullYear(),t=j.getMonth(),n=new Date(e,t+1,0).getDate(),r=u("gcalRangeStart"),a=u("gcalRangeEnd");r&&!r.value&&(r.value=Ke(e,t+1,1)),a&&!a.value&&(a.value=Ke(e,t+1,n)),u("gcalImportModal").classList.add("active")}function Ni(e){if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}_r();const t=u("calEvtDate");t&&(t.value=e);const n=u("calEvtTitle");n&&(n.value="");const r=u("calEvtStart");r&&(r.value="");const a=u("calEvtEnd");a&&(a.value="");const s=u("calEvtCourse");s&&(s.innerHTML='<option value="">(Sin asignar)</option>',(l.courses||[]).forEach(i=>{const o=document.createElement("option");o.value=i.id,o.textContent=i.name,s.appendChild(o)})),u("calModal").classList.add("active")}function qt(){const e=u("calGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,i)=>{const o=i+1,c=Ke(j.getFullYear(),j.getMonth()+1,o);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${o}</div>
          <div class="cal-events" id="ce-${c}"></div>
        </div>
      `}).join("")}
  `,e.querySelectorAll(".cal-cell.day").forEach(s=>{s.addEventListener("click",()=>Ni(s.dataset.date))}),Lt()}function Ti(e){var s;if(!l.currentUser||!l.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}_r();const t=u("calModal"),n=u("calModalTitle"),r=u("calEvtSave");t.dataset.editingId=e.id,n.textContent="Editar evento",r.textContent="Guardar cambios",u("calEvtTitle").value=e.title||"",u("calEvtDate").value=e.date||"",u("calEvtStart").value=e.start||"",u("calEvtEnd").value=e.end||"",u("calEvtRepeat").value=((s=e.repeat)==null?void 0:s.every)||"",u("calEvtPersistent").value=e.persistent?"true":"";const a=u("calEvtCourse");a.innerHTML='<option value="">(Sin asignar)</option>',(l.courses||[]).forEach(i=>{const o=document.createElement("option");o.value=i.id,o.textContent=i.name,i.id===e.courseId&&(o.selected=!0),a.appendChild(o)}),t.classList.add("active")}function We(){const e=u("calSharedGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,i)=>{const o=i+1,c=Ke(j.getFullYear(),j.getMonth()+1,o);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${o}</div>
          <div class="cal-events" id="sce-${c}"></div>
        </div>
      `}).join("")}
  `,Mt()}function Ct(){const e=u("calCombinedGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,i)=>{const o=i+1,c=Ke(j.getFullYear(),j.getMonth()+1,o);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${o}</div>
          <div class="cal-events" id="bce-${c}"></div>
        </div>
      `}).join("")}
  `,he()}function he(){document.querySelectorAll(".cal-events").forEach(a=>{var s;(s=a.id)!=null&&s.startsWith("bce-")&&(a.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`,t=jt.filter(a=>String(a.date||"").startsWith(e)).map(a=>{var s;return{...a,isMine:!0,ownerUid:((s=l.currentUser)==null?void 0:s.uid)||null}}),n=[];for(const[a,s]of Ht.entries())for(const i of s||[])String(i.date||"").startsWith(e)&&n.push({...i,isMine:!1,ownerUid:a});[...t,...n].forEach(a=>{const s=u("bce-"+a.date);if(!s)return;let i="#64748b";if(a.isMine)i=Rn();else{const p=ve[a.ownerUid]||{};i=Me(p.favoriteColor)?p.favoriteColor:"#64748b"}const o=Dr(i),c=a.start&&a.end?`${a.start}–${a.end} · `:a.start?`${a.start} · `:"",d=document.createElement("div");d.className="cal-evt",d.textContent=`${c}${a.title||"(sin título)"}`,d.style.background=i,d.style.color=o,d.style.opacity=a.isMine?1:.75,d.style.border="1px solid rgba(0,0,0,0.25)",s.appendChild(d)})}async function Ui(){const e=u("calCombinedRemindersList");if(e){e.innerHTML='<div class="loading"></div>';try{const t=await rs({range:"today"}),n=l.pairOtherUid?await as({range:"today"}):[],r=[...t.map(a=>({...a,owner:"Tú"})),...n.map(a=>({...a,owner:"Dúo"}))].sort((a,s)=>(a.datetime||0)-(s.datetime||0));e.innerHTML=r.length?r.map(a=>{var s;return`
          <div class="grade-item">
            <div>
              <strong>${a.title||"(sin título)"}</strong>
              <div class="muted">${a.owner} · ${((s=a.datetime)==null?void 0:s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))||""}</div>
            </div>
          </div>
        `}).join(""):'<div class="muted">Sin recordatorios para hoy.</div>'}catch(t){console.error("loadCombinedReminders",t),e.innerHTML='<div class="muted">Error al cargar recordatorios.</div>'}}}function Pi(e){var r;const t=[];for(const a of e)if(t.push(a),(r=a.repeat)!=null&&r.every){const s=new Date(a.date);for(let i=1;i<=24;i++){const o=new Date(s);a.repeat.every==="day"?o.setDate(s.getDate()+i*(a.repeat.interval||1)):a.repeat.every==="month"?o.setMonth(s.getMonth()+i*(a.repeat.interval||1)):a.repeat.every==="year"&&o.setFullYear(s.getFullYear()+i*(a.repeat.interval||1));const c=Ke(o.getFullYear(),o.getMonth()+1,o.getDate());if(Math.abs(o-s)/(1e3*60*60*24)>365)break;t.push({...a,date:c})}}return t}function Lt(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")||(n.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;Pi(jt).filter(n=>String(n.date||"").startsWith(e)).forEach(n=>{const r=u("ce-"+n.date);if(!r)return;const a=wi(n,Rn()),s=Dr(a),i=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",o=document.createElement("div");o.className="cal-evt",o.style.background=a,o.style.color=s,o.style.border="1px solid rgba(0,0,0,0.25)",o.style.position="relative",o.style.cursor="pointer";const c=document.createElement("span");c.textContent=`${i}${n.title||"(sin título)"}`,o.appendChild(c);const d=document.createElement("span");d.textContent="✕",d.className="cal-del",d.title="Eliminar evento",d.style.position="absolute",d.style.top="2px",d.style.right="4px",d.style.fontWeight="bold",d.style.color="#fff8",d.style.cursor="pointer",d.addEventListener("click",async p=>{if(p.stopPropagation(),!(!l.currentUser||!l.activeSemesterId||!n.id)&&confirm(`¿Eliminar evento "${n.title}"?`))try{await fe(N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar",n.id))}catch(m){console.error(m)}}),o.appendChild(d),o.addEventListener("click",p=>{p.stopPropagation(),Ti(n)}),r.appendChild(o)})}function Mt(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")&&(n.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;Mn.filter(n=>String(n.date||"").startsWith(e)).forEach(n=>{const r=u("sce-"+n.date);if(!r)return;const a=hi(),s=Dr(a),i=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",o=document.createElement("div");o.className="cal-evt",o.textContent=`${i}${n.title||"(sin título)"}`,o.style.background=a,o.style.color=s,o.style.border="1px solid rgba(0,0,0,0.25)",r.appendChild(o)})}function ma(e,t){const n=new Date(e.getTime());return n.setMonth(n.getMonth()+t),n}function Ke(e,t,n){return`${e}-${String(t).padStart(2,"0")}-${String(n).padStart(2,"0")}`}async function rs(e={}){if(!l.currentUser)throw new Error("No logueado");const{range:t="today",dates:n,months:r,years:a,ranges:s}=e,i=P(C,"users",l.currentUser.uid,"reminders");let c=(await F(i)).docs.map(p=>{const m=p.data();return{id:p.id,...m,datetime:hn(m.datetime)}});if(c=c.filter(p=>!p.suspended),Array.isArray(s)&&s.length>0){const p=s.map(m=>{const f=hn(m.start),v=hn(m.end);return!f||!v?null:{start:f,end:v}}).filter(Boolean);return c=c.filter(m=>m.datetime&&p.some(f=>m.datetime>=f.start&&m.datetime<f.end)),c}if(Array.isArray(n)&&n.length>0){const p=new Set(n.map(m=>ga(m)).filter(Boolean));return c=c.filter(m=>{if(!m.datetime)return!1;const f=ga(m.datetime);return p.has(f)}),c}if(Array.isArray(r)&&r.length>0){const p=r.map(m=>{if(typeof m=="string"){const[f,v]=m.split("-").map(Number);return!f||!v?null:{year:f,month:v}}else if(m&&typeof m=="object"){const f=Number(m.year??m.y),v=Number(m.month??m.m);return!f||!v?null:{year:f,month:v}}return null}).filter(Boolean);return c=c.filter(m=>{if(!m.datetime)return!1;const f=m.datetime.getFullYear(),v=m.datetime.getMonth()+1;return p.some(x=>x.year===f&&x.month===v)}),c}if(Array.isArray(a)&&a.length>0){const p=new Set(a.map(m=>Number(m)));return c=c.filter(m=>m.datetime&&p.has(m.datetime.getFullYear())),c}const d=new Date;if(t==="today"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()),m=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);return c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}if(t==="week"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay()),m=new Date(p);return m.setDate(p.getDate()+7),c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}if(t==="month"){const p=new Date(d.getFullYear(),d.getMonth(),1),m=new Date(d.getFullYear(),d.getMonth()+1,1);return c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}return c}async function Di(e){if(!l.currentUser)throw new Error("No logueado");const t=N(C,"users",l.currentUser.uid,"reminders",e);return await ae(t,{suspended:!1,updatedAt:Date.now()}),{ok:!0}}async function _i(){if(!l.currentUser)throw new Error("No logueado");const e=P(C,"users",l.currentUser.uid,"reminders"),t=Q(e,Aa("suspended","==",!0));return(await F(t)).docs.map(r=>({id:r.id,...r.data()}))}async function Bi({reminderId:e}){if(!l.currentUser)throw new Error("No logueado");if(!e)throw new Error("Falta ID");const t=N(C,"users",l.currentUser.uid,"reminders",e);return await ae(t,{suspended:!0,updatedAt:Date.now()}),{ok:!0}}async function as({range:e="today"}={}){if(!l.pairOtherUid)throw new Error("No tienes dúo");const t=P(C,"users",l.pairOtherUid,"reminders"),n=await F(t),r=i=>i?typeof i=="number"?new Date(i):i.toDate?i.toDate():new Date(i):null,a=n.docs.map(i=>{const o=i.data();return{id:i.id,...o,datetime:r(o.datetime)}}),s=new Date;if(e==="today"){const i=new Date(s.getFullYear(),s.getMonth(),s.getDate()),o=new Date(s.getFullYear(),s.getMonth(),s.getDate()+1);return a.filter(c=>c.datetime&&c.datetime>=i&&c.datetime<o)}if(e==="week"){const i=new Date(s.getFullYear(),s.getMonth(),s.getDate()-s.getDay()),o=new Date(i);return o.setDate(i.getDate()+7),a.filter(c=>c.datetime&&c.datetime>=i&&c.datetime<o)}return a}const Ri="489697428786-m2hkvn9ohor0unrhk6g5i3g7vqla86c4.apps.googleusercontent.com",Oi="AIzaSyA6M73T0k3yPyseAZnkPxBO5GYXPeL8dlQ",Hi=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],qi="https://www.googleapis.com/auth/calendar.readonly";let fa=!1,ya=!1,kn=null;function zi(){return new Promise((e,t)=>{if(window.gapi&&window.gapi.load)return e();const n=document.createElement("script");n.src="https://apis.google.com/js/api.js",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar gapi")),document.head.appendChild(n)})}function Fi(){return new Promise((e,t)=>{if(window.google&&window.google.accounts)return e();const n=document.createElement("script");n.src="https://accounts.google.com/gsi/client",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar Google Identity Services")),document.head.appendChild(n)})}async function ji(){fa||(await zi(),await new Promise(e=>{window.gapi.load("client",e)}),await window.gapi.client.init({apiKey:Oi,discoveryDocs:Hi}),fa=!0)}async function Yi(){ya&&kn||(await Fi(),kn=window.google.accounts.oauth2.initTokenClient({client_id:Ri,scope:qi,callback:()=>{}}),ya=!0)}async function Gi(){return await Yi(),new Promise((e,t)=>{kn.callback=n=>{if(n.error){console.error("[OAuth error]",n),t(n);return}e(n.access_token)},kn.requestAccessToken({prompt:""})})}async function Vi(e,t){await ji();const n=await Gi();window.gapi.client.setToken({access_token:n});const r=await window.gapi.client.calendar.events.list({calendarId:"primary",timeMin:e.toISOString(),timeMax:t.toISOString(),showDeleted:!1,singleEvents:!0,orderBy:"startTime"});return console.log("[Calendar] Respuesta completa de Google:",r),r.result.items||[]}function Wi(e){var o,c,d,p;if(e.start&&e.start.date&&!e.start.dateTime)return{date:e.start.date,startTime:null,endTime:null,allDay:!0};const t=new Date(((o=e.start)==null?void 0:o.dateTime)||((c=e.start)==null?void 0:c.date)),n=new Date(((d=e.end)==null?void 0:d.dateTime)||((p=e.end)==null?void 0:p.date)||t),r=Ke(t.getFullYear(),t.getMonth()+1,t.getDate()),a=m=>String(m).padStart(2,"0"),s=`${a(t.getHours())}:${a(t.getMinutes())}`,i=`${a(n.getHours())}:${a(n.getMinutes())}`;return{date:r,startTime:s,endTime:i,allDay:!1}}function hn(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="number")return new Date(e);if(typeof e=="string"){const t=new Date(e);return isNaN(t)?null:t}return e.toDate?e.toDate():null}function ga(e){const t=hn(e);return t?Ke(t.getFullYear(),t.getMonth()+1,t.getDate()):null}async function Ji(e,t){if(!l.currentUser||!l.activeSemesterId)throw new Error("Sin usuario o semestre activo");try{const n=await Vi(e,t);if(!n.length){alert("No se encontraron eventos en tu Google Calendar para el rango seleccionado.");return}const r=new Set((jt||[]).filter(o=>o.gcalId).map(o=>o.gcalId)),a=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"calendar");let s=0;const i=[];for(const o of n){if(r.has(o.id))continue;const{date:c,startTime:d,endTime:p,allDay:m}=Wi(o);if(!c)continue;const f={title:o.summary||"(sin título)",date:c,start:m?null:d,end:m?null:p,allDay:!!m,courseId:null,color:null,source:"google",gcalId:o.id,createdAt:Date.now()};i.push(Ee(a,f)),s++}if(!i.length){alert("Los eventos de ese rango ya estaban importados.");return}await Promise.all(i),alert(`Se importaron ${s} evento(s) desde tu Google Calendar para el rango seleccionado.`)}catch(n){console.error("Error al importar Google Calendar:",n),alert("Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.")}}const va=Object.freeze(Object.defineProperty({__proto__:null,clearCalendarUI:vi,initCalendar:Xa,listPairReminders:as,listReminders:rs,listSuspendedReminders:_i,onActiveSemesterChanged:lt,onCoursesChanged:Ei,registerCalendarUnsub:yi,resumeReminder:Di,showCalendarUI:bi,stopCalendarSub:gi,suspendReminder:Bi},Symbol.toStringTag,{value:"Module"}));let cn=null;function Br(){if(!l.currentUser||!l.activeSemesterId)return;const e=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");G(e,t=>{const n=t.docs.filter(a=>a.data().asistencia),r=u("attCourseSel");r&&(r.innerHTML='<option value="" disabled selected>Elige un ramo…</option>',n.forEach(a=>{r.innerHTML+=`<option value="${a.id}">${a.data().name}</option>`})),r==null||r.addEventListener("change",()=>{const a=r.value,s=n.find(i=>i.id===a);Ki(s?[s]:[])})})}function Ki(e){const t=u("asistenciaList");t&&(t.innerHTML="",e.forEach(n=>{const r=n.data(),a=document.createElement("div");a.className="card",a.innerHTML=`
      <h4>${r.name}</h4>
      <div class="att-days" data-id="${n.id}"></div>
      <div class="muted">Asistencia actual: <span class="att-percent" data-id="${n.id}">0%</span></div>
      <button class="btn btn-secondary add-att-btn" data-id="${n.id}" style="margin-top:8px;">+ Agregar asistencia</button>
    `,t.appendChild(a),Zi(n.id)}),t.querySelectorAll(".add-att-btn").forEach(n=>{n.addEventListener("click",()=>Qi(n.dataset.id))}))}async function Zi(e){const t=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance");G(t,n=>{const r=n.docs.map(a=>({id:a.id,...a.data()}));Xi(e,r)})}async function Xi(e,t){const n=document.querySelector(`.att-days[data-id="${e}"]`);if(!n)return;n.innerHTML=t.map(o=>`
    <div class="att-record">
      <span>${new Date(o.date+"T00:00:00").toLocaleDateString("es-CL",{timeZone:"America/Santiago"})} :

        ${o.present?"✔ Presente":o.absent?"✘ Ausente":o.justified?"🟡 Justificado":"— Sin clase"}

      </span>
      <button class="btn btn-secondary btn-del-att" data-cid="${e}" data-id="${o.id}">❌</button>
    </div>
  `).join(""),n.querySelectorAll(".btn-del-att").forEach(o=>{o.addEventListener("click",()=>el(o.dataset.cid,o.dataset.id))});const r=t.filter(o=>!o.noClass),a=r.filter(o=>o.present||o.justified).length,s=r.length?Math.round(a/r.length*100):0,i=document.querySelector(`.att-percent[data-id="${e}"]`);i&&(i.textContent=s+"%"),window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=s}let An=null;function Qi(e){An=e;const t=new Date,n=new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().split("T")[0];u("attDate").value=n,u("attModal").classList.add("active")}function ss(){u("attModal").classList.remove("active"),An=null}document.addEventListener("DOMContentLoaded",()=>{var e,t,n,r,a;(e=u("attCancel"))==null||e.addEventListener("click",ss),(t=u("attPresente"))==null||t.addEventListener("click",()=>dn("present")),(n=u("attAusente"))==null||n.addEventListener("click",()=>dn("absent")),(r=u("attJustificado"))==null||r.addEventListener("click",()=>dn("justified")),(a=u("attNoClass"))==null||a.addEventListener("click",()=>dn("noClass"))});async function dn(e){if(!An)return;const t=u("attDate").value;if(!t){alert("Selecciona una fecha");return}const[n,r,a]=t.split("-").map(Number),i=new Date(n,r-1,a).toISOString().split("T")[0],o=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",An,"attendance",i);await ye(o,{date:i,present:e==="present",absent:e==="absent",justified:e==="justified",noClass:e==="noClass"}),ss()}async function el(e,t){const n=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance",t);await fe(n)}async function os(){if(!l.currentUser||!l.activeSemesterId)return;if(cn){try{cn()}catch{}cn=null}window.courseAttendance||(window.courseAttendance={});const e=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");try{const t=await F(e);for(const n of t.docs){if(!(n.data()||{}).asistencia)continue;const a=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",n.id,"attendance"),o=(await F(a)).docs.map(p=>p.data()).filter(p=>!p.noClass),c=o.filter(p=>p.present||p.justified).length,d=o.length?Math.round(c/o.length*100):0;window.courseAttendance[n.id]=d}console.log("⚡ Precarga inicial de asistencia:",window.courseAttendance),document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{preload:!0}}))}catch(t){console.error("Error en precarga rápida de asistencia:",t)}return cn=G(e,t=>{t.docs.filter(r=>{var a;return(a=r.data())==null?void 0:a.asistencia}).forEach(r=>{const a=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",r.id,"attendance");G(a,s=>{const o=s.docs.map(p=>p.data()).filter(p=>!p.noClass),c=o.filter(p=>p.present||p.justified).length,d=o.length?Math.round(c/o.length*100):0;window.courseAttendance[r.id]=d,document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{courseId:r.id,percent:d}}))})})}),!0}document.addEventListener("auth:ready",()=>{setTimeout(()=>Br(),1e3)});document.addEventListener("semester:changed",()=>{Br()});const ba=Object.freeze(Object.defineProperty({__proto__:null,initAttendance:Br,preloadAttendanceData:os},Symbol.toStringTag,{value:"Module"})),ur=new Map,Ze=new Map;let un=0,_=null,st=null,se=[],R={scale:"USM",finalExpr:"",rulesText:""},_e={byName:{},byCode:{},byId:{}},Pe=null,we=null;function Zt(){return N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",_,"groups","meta")}async function Rr(){if(we=null,!!yt())try{const e=await te(Zt());we=e.exists()?e.data()||{}:{}}catch(e){console.error("Error cargando nombres de grupos:",e),we={}}}async function tl(e,t){if(yt())try{await ye(Zt(),{[e]:t},{merge:!0}),we={...we||{},[e]:t}}catch(n){throw console.error("Error guardando nombre de grupo:",n),n}}function ha(){const e=we||{};return Array.isArray(e.__custom)?e.__custom:[]}function nl(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||"g"}async function rl(){if(!yt())return;const e=prompt('Nombre de la carpeta (ej.: "Quices", "Trabajos", "Controles cortos"):');if(!e)return;const t=e.trim();if(!t)return;const n=prompt(`Palabra clave que deben contener las evaluaciones para ir a esta carpeta.
Ej.: "quiz" agrupa todo lo que tenga "quiz" en el nombre.`);if(!n)return;const r=n.trim();if(!r)return;const a=we||{},s=Array.isArray(a.__custom)?[...a.__custom]:[],i=nl(t),o=new Set(["certamenes","controles","tareas","proyecto","evaluaciones","experiencias","preinformes","informes","laboratorios","otros",...s.map(m=>m.key)]);let c=i,d=2;for(;o.has(c);)c=`${i}${d++}`;s.push({key:c,label:t,keyword:r});const p={...a,[c]:t,__custom:s};await ye(Zt(),p,{merge:!0}),we=p}async function al(e){if(!yt())return;const t=we||{},n=Array.isArray(t.__custom)?t.__custom.filter(a=>a.key!==e):[],r={...t};delete r[e],r.__custom=n,await ye(Zt(),r,{merge:!0}),we=r}function sl(e){Pe=e,l.unsubscribeGrades=()=>{try{Pe==null||Pe()}finally{Pe=null,l.unsubscribeGrades=null}}}function ol(){try{Pe==null||Pe()}finally{Pe=null}l.unsubscribeGrades=null}function is(e){return ee(e)}function il(){const e=u("gr-courseSel");e&&(e.innerHTML='<option value="" disabled selected>Selecciona un ramo…</option>');const t=u("gr-evalsList");t&&(t.innerHTML="");const n=u("gr-finalExpr");n&&(n.value="");const r=u("gr-rulesError");r&&(r.textContent="");const a=u("gr-currentAvg");a&&(a.textContent="—");const s=u("gr-neededToPass");s&&(s.textContent="—");const i=u("gr-status");i&&(i.textContent="—");const o=u("gr-partnerView");o&&o.classList.add("hidden");const c=u("gr-sh-semSel");c&&(c.innerHTML="");const d=u("gr-sh-list");d&&(d.innerHTML="")}function ll(e=_){const t=e?Ze.get(e):null,n=e?ur.get(e):null;t?R={...R,...t}:R={scale:R.scale||"USM",finalExpr:"",rulesText:""};const r=u("gr-finalExpr");r&&(r.value=R.finalExpr||"");const a=u("gr-rulesText");if(a&&(a.value=R.rulesText||""),n&&n.length)se=n.map(s=>({...s})),xe(se),oe();else{se=[];const s=u("gr-evalsList");s&&(s.innerHTML='<div class="muted" style="opacity:.5">Cargando evaluaciones…</div>'),On(null)}}function cl(){pl()}document.addEventListener("attendance:ready",e=>{console.log("🔁 Asistencia actualizada para:",e.detail),oe()});document.addEventListener("route:notas",()=>{setTimeout(()=>{const e=u("gr-courseSel"),t=u("gr-evalsCard"),n=u("gr-calcCard"),r=u("gr-summaryCard"),a=u("gr-rulesCard");(!e||!e.value)&&(t&&t.classList.add("hidden"),n&&n.classList.add("hidden"),r&&r.classList.add("hidden"),a&&a.classList.add("hidden"))},50)});async function xn(){await ls()}function dl(){var n,r;const e=u("gr-activeSemLabel");e&&(e.textContent=((n=l.activeSemesterData)==null?void 0:n.label)||"—"),ls();const t=document.getElementById("gr-sh-semSel");t&&((r=l.activeSemesterData)!=null&&r.label)&&(t.innerHTML=`<option selected>${l.activeSemesterData.label}</option>`,t.disabled=!0,t.style.pointerEvents="none",t.style.opacity="0.7"),(async()=>{try{await os(),console.log("✅ Asistencia precargada, ahora sí recalculamos notas"),oe()}catch(a){console.warn("⚠️ Error precargando asistencia:",a),oe()}})()}function ul(){return(se||[]).map(e=>({code:e.key,name:e.name||e.key,grade:typeof e.score=="number"?e.score:null}))}function pl(){var n,r,a,s;ml(),(n=u("gr-saveExpr"))==null||n.addEventListener("click",ht),(r=u("gr-finalExpr"))==null||r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),ht())}),(a=u("gr-courseSel"))==null||a.addEventListener("change",yl),(s=u("gr-addEvalBtn"))==null||s.addEventListener("click",gl),fl();function e(){var m;const i=u("page-notas");if(!i)return;const o=(m=Array.from(i.querySelectorAll(".card h3")).find(f=>/c[aá]lculo de notas/i.test(f.textContent)))==null?void 0:m.closest(".card");if(!o||(o.id||(o.id="gr-calcCard"),o.querySelector("#gr-openSim")))return;const c=o.querySelector("h3"),d=document.createElement("button");d.id="gr-openSim",d.className="ghost",d.textContent="Simulador de notas";let p=c==null?void 0:c.closest(".row");p?p.classList.add("gr-calcHeader"):(p=document.createElement("div"),p.className="row gr-calcHeader",c&&p.appendChild(c),o.insertBefore(p,o.firstChild)),d.style.marginLeft="auto",p.appendChild(d),d.addEventListener("click",()=>{const f=El();if(!f){alert("Primero define la Fórmula final.");return}const v=ul();if(!v.length){alert("Agrega al menos una evaluación.");return}Pl({formula:f,evals:v})})}e();const t=u("gr-finalExpr");if(t){const i=Cl(async c=>{c===_&&await ht(c)},600),o=()=>{if(!_)return;const c=ut(t.value||"");R.finalExpr=c;const d=Ze.get(_)||{};Ze.set(_,{...d,...R,finalExpr:c}),oe()};t.addEventListener("input",()=>{const c=_;o(),i(c)}),t.addEventListener("keyup",o),t.addEventListener("change",o),t.addEventListener("blur",async()=>{o(),await ht(_)}),t.addEventListener("keydown",c=>{c.key==="Enter"&&(c.preventDefault(),o(),ht(_))})}}function ml(){var n;const e=u("gr-passThreshold");e&&((n=e.closest("div"))==null||n.classList.add("hidden"));const t=u("gr-saveHeader");t&&t.classList.add("hidden")}function fl(){var r,a;if(u("gr-rulesCard"))return;const e=u("page-notas");if(!e)return;const t=document.createElement("div");t.className="card",t.id="gr-rulesCard",t.style.marginTop="12px",t.innerHTML=`
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
  `;const n=(r=Array.from(e.querySelectorAll(".card h3")).find(s=>/c[aá]lculo de notas/i.test(s.textContent)))==null?void 0:r.closest(".card");n?e.insertBefore(t,n):e.appendChild(t),(a=u("gr-saveRules"))==null||a.addEventListener("click",ps)}async function ls(){var r,a,s,i,o,c,d,p,m,f,v,x;const e=u("gr-courseSel");if(!e)return;const t=l.editingCourseId||_||"";if(e.innerHTML='<option value="">Selecciona un ramo…</option>',!l.courses||l.courses.length===0){_=null,l.editingCourseId=null,(r=u("gr-evalsCard"))==null||r.classList.add("hidden"),(a=u("gr-calcCard"))==null||a.classList.add("hidden"),(s=u("gr-summaryCard"))==null||s.classList.add("hidden"),(i=u("gr-rulesCard"))==null||i.classList.add("hidden"),xe([]),On(null);return}l.courses.forEach(y=>{const h=document.createElement("option");h.value=y.id,h.textContent=y.name,e.appendChild(h)}),t&&l.courses.some(y=>y.id===t)?(_=t,l.editingCourseId=t,e.value=t,(o=u("gr-evalsCard"))==null||o.classList.remove("hidden"),(c=u("gr-calcCard"))==null||c.classList.remove("hidden"),(d=u("gr-summaryCard"))==null||d.classList.remove("hidden"),(p=u("gr-rulesCard"))==null||p.classList.remove("hidden"),await us(),await Rr(),await ms(),await Nt(),oe(),await cs(_)):(_=null,l.editingCourseId=null,e.value="",(m=u("gr-evalsCard"))==null||m.classList.add("hidden"),(f=u("gr-calcCard"))==null||f.classList.add("hidden"),(v=u("gr-summaryCard"))==null||v.classList.add("hidden"),(x=u("gr-rulesCard"))==null||x.classList.add("hidden"))}async function yl(e){var a,s,i,o,c,d,p,m;const t=e.target.value||null,n=_,r=++un;if(n&&n!==t&&Promise.all([ht(n),ps(n)]).catch(f=>console.warn("No se pudo guardar antes de cambiar de ramo:",f)),_=t,l.editingCourseId=_,st){try{st()}catch{}st=null}if(!_){(a=u("gr-evalsCard"))==null||a.classList.add("hidden"),(s=u("gr-calcCard"))==null||s.classList.add("hidden"),(i=u("gr-summaryCard"))==null||i.classList.add("hidden"),(o=u("gr-rulesCard"))==null||o.classList.add("hidden"),se=[],xe([]),On(null);return}(c=u("gr-evalsCard"))==null||c.classList.remove("hidden"),(d=u("gr-calcCard"))==null||d.classList.remove("hidden"),(p=u("gr-summaryCard"))==null||p.classList.remove("hidden"),(m=u("gr-rulesCard"))==null||m.classList.remove("hidden"),ll(t),ms(t),Promise.all([us(),Rr()]).then(async()=>{r===un&&(xe(se),oe(),cs(t).then(()=>{r===un&&oe()}).catch(()=>{}),Nt().then(()=>{r===un&&oe()}).catch(()=>{}))}).catch(f=>console.warn("Error cargando datos del ramo:",f))}async function cs(e){try{const t=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"attendance"),a=(await F(t)).docs.map(o=>o.data()).filter(o=>!o.noClass),s=a.filter(o=>o.present||o.justified).length,i=a.length?Math.round(s/a.length*100):0;window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=i,console.log(`✅ Sincronizada asistencia directa de ${e}: ${i}%`),oe()}catch(t){console.warn("⚠️ No se pudo sincronizar asistencia directa:",t)}}function ds(){return N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",_,"grading","meta")}function St(){return P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",_,"grading","meta","components")}async function us(){var M,$,A,g,k,S,b;if(!yt())return;const e=_,t=((M=u("gr-finalExpr"))==null?void 0:M.value)??null,n=(($=u("gr-rulesText"))==null?void 0:$.value)??null,r=ds(),a=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",_),s=await te(a),i=s.exists()&&s.data().scale||null,o=((A=l.activeSemesterData)==null?void 0:A.gradeScale)||null,c=((g=l.activeSemesterData)==null?void 0:g.universityAtThatTime)||"";let d=null;if(o)d=o==="1-7"||o==="2-7"||o==="0-7"?"MAYOR":"USM";else{const w=localStorage.getItem(`scale_${c}`);w?d=w.includes("7")?"MAYOR":"USM":d=/mayor/i.test(c)?"MAYOR":(/usm|utfsm|santa\s*mar/i.test(c),"USM")}const p=await te(r);if(e!==_)return;const m=p.exists()?{finalExpr:"",rulesText:"",...p.data()}:{scale:i||d,finalExpr:"",rulesText:""};if(!p.exists()&&(await ye(r,m),e!==_))return;R.scale=m.scale||i||d;const f=((k=u("gr-finalExpr"))==null?void 0:k.value)??null,v=((S=u("gr-rulesText"))==null?void 0:S.value)??null,x=f!==t,y=v!==n;if(!x){R.finalExpr=m.finalExpr||"";const w=u("gr-finalExpr");w&&(w.value=R.finalExpr)}if(!y){R.rulesText=m.rulesText||"";const w=u("gr-rulesText");w&&(w.value=R.rulesText)}let h=i||d;if(R.scale!==h&&(R.scale=h,await ae(r,{scale:R.scale}),e!==_))return;u("gr-activeSemLabel")&&(u("gr-activeSemLabel").textContent=((b=l.activeSemesterData)==null?void 0:b.label)||"—");const E=u("gr-scaleSel");E&&(E.value=R.scale||"USM"),Ze.set(e,{...R}),e===_&&oe()}async function ht(e=null){const t=e||_;if(!(l.currentUser&&l.activeSemesterId&&t))return;const n=u("gr-finalExpr"),r=((n==null?void 0:n.value)||"").trim(),a=ut(r)||null;t===_&&(R.finalExpr=a||"",Ze.set(t,{...R}));const s=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t,"grading","meta");await ye(s,{finalExpr:a},{merge:!0}),t===_&&(oe(),Nt().then(()=>{t===_&&oe()}).catch(()=>{}))}async function ps(e=null){var a;const t=e||_;if(!(l.currentUser&&l.activeSemesterId&&t))return;const n=(((a=u("gr-rulesText"))==null?void 0:a.value)||"").trim()||null;t===_&&(R.rulesText=n||"",Ze.set(t,{...R}));const r=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t,"grading","meta");await ye(r,{rulesText:n},{merge:!0}),t===_&&(oe(),Nt().then(()=>{t===_&&oe()}).catch(()=>{}))}async function ms(e=_){if(st&&(st(),st=null),!(l.currentUser&&l.activeSemesterId&&e)){se=[],xe([]);return}const t=ur.get(e);t&&t.length&&(se=t.map(r=>({...r})),xe(se),oe());const n=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"grading","meta","components");st=G(Q(n,Se("createdAt","asc")),async r=>{if(e!==_)return;let a=r.docs.map(i=>({id:i.id,...i.data()}));const s=a.filter(i=>typeof i.order!="number");s.length&&de(()=>import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),[],import.meta.url).then(async({writeBatch:i})=>{const o=i(C),c=Date.now();s.forEach((d,p)=>{o.update(N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",e,"grading","meta","components",d.id),{order:c+p})});try{await o.commit()}catch{}}),a.sort((i,o)=>{var f,v,x,y;const c=typeof i.order=="number"?i.order:9e15,d=typeof o.order=="number"?o.order:9e15;if(c!==d)return c-d;const p=((v=(f=i.createdAt)==null?void 0:f.toMillis)==null?void 0:v.call(f))??0,m=((y=(x=o.createdAt)==null?void 0:x.toMillis)==null?void 0:y.call(x))??0;return p-m}),se=a,ur.set(e,a.map(i=>({...i}))),await xe(a),oe(),Nt().then(()=>{e===_&&oe()})},r=>{console.error("watchComponents error:",r),e===_&&xe([])})}async function gl(){if(!yt()){alert("Selecciona un semestre y un ramo.");return}const e=u("gr-evalName"),t=u("gr-evalCode"),n=u("gr-evalScore"),r=((e==null?void 0:e.value)||"").trim();let a=((t==null?void 0:t.value)||"").trim();const s=(n==null?void 0:n.value)??"";if(!r){alert("Escribe un nombre.");return}if(!a){alert("Escribe un código (ej: C1, T1...).");return}if(a=a.replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16),!a){alert("Código inválido.");return}a=vl(a,se);const i=R.scale==="MAYOR",o=i?1:0,c=i?7:100,d=parseFloat(String(s).replace(",",".")),p=isNaN(d)?null:Hn(d,o,c);await Ee(St(),{key:a,name:r,score:p,createdAt:$a(),order:Date.now()}),e&&(e.value=""),t&&(t.value=""),n&&(n.value="")}function fs(e){return(e||"").replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16)}function vl(e,t){const n=new Set((t||[]).map(s=>(s.key||"").toLowerCase()));let r=fs(e)||"X";if(!n.has(r.toLowerCase()))return r;let a=2;for(;n.has((r+a).toLowerCase());)a++;return r+a}async function xe(e=[]){const t=u("gr-evalsList");if(!t)return;const n={};t.querySelectorAll(".grade-item").forEach(g=>{var b,w;const k=(w=(b=g.querySelector("code"))==null?void 0:b.textContent)==null?void 0:w.trim(),S=g.querySelector('[data-f="score"]');k&&S&&S.value&&(n[k]=S.value)});const r=new Set(Array.from(t.querySelectorAll("details.grade-group[open]")).map(g=>g.dataset.key));if(t.innerHTML="",!_){t.innerHTML='<div class="muted">Selecciona un ramo.</div>';return}if(!e.length){t.innerHTML='<div class="muted">Aún no hay evaluaciones. Usa “Agregar evaluación”.</div>';return}const a=R.scale==="MAYOR",s=a?1:0,i=a?7:100,o=a?.1:1,c=document.createElement("div");c.className="row",c.style.justifyContent="space-between",c.style.alignItems="center",c.style.marginBottom="6px";const d=document.createElement("div");d.className="muted",d.textContent="Carpetas de evaluaciones";const p=document.createElement("button");p.id="gr-addGroup",p.className="ghost",p.textContent="Agregar carpeta",p.addEventListener("click",()=>{rl().then(()=>xe(se))}),c.appendChild(d),c.appendChild(p),t.appendChild(c);const m=we||{},f=ha(),v=new Set(f.map(g=>g.key)),x={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};f.forEach(g=>{x[g.key]=g.label||g.key});const y={...x,...m},h={},E=new Set,M=g=>(g.name||"").toString();f.forEach(g=>{const k=(g.keyword||g.pattern||g.label||"").trim();if(!k)return;const S=k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=new RegExp(S,"i"),w=e.filter(L=>!E.has(L.id)&&b.test(M(L)));w.length&&(h[g.key]=w,w.forEach(L=>E.add(L.id)))});const $={certamenes:g=>/certamen/i.test(M(g)),controles:g=>/control/i.test(M(g)),tareas:g=>/tarea/i.test(M(g)),proyecto:g=>/proy|proyecto/i.test(M(g)),evaluaciones:g=>/evaluaci[oó]n/i.test(M(g)),experiencias:g=>/experien/i.test(M(g)),preinformes:g=>/pre[\s-]?informe/i.test(M(g)),informes:g=>/\binforme/i.test(M(g))&&!/pre[\s-]?informe/i.test(M(g)),laboratorios:g=>/laboratorio|\blab/i.test(M(g))};for(const[g,k]of Object.entries($)){const S=e.filter(b=>!E.has(b.id)&&k(b));S.length&&(h[g]=S,S.forEach(b=>E.add(b.id)))}const A=e.filter(g=>!E.has(g.id));A.length&&(h.otros=A);for(const[g,k]of Object.entries(h)){if(!k.length)continue;const S=document.createElement("details");S.className="grade-group",S.dataset.key=g,r.has(g)&&(S.open=!0);const b=document.createElement("summary");b.style.display="flex",b.style.alignItems="center",b.style.justifyContent="space-between",b.style.width="100%",b.style.cursor="pointer";const w=y[g]||x[g]||g,L=document.createElement("span");L.style.fontWeight="700",L.textContent=`${w} (${k.length})`;const I=document.createElement("div");I.style.display="flex",I.style.alignItems="center",I.style.gap="4px";const U=document.createElement("button");if(U.dataset.rename=g,U.className="ghost",U.textContent="✎",Object.assign(U.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),I.appendChild(U),v.has(g)){const T=document.createElement("button");T.dataset.deleteGroup=g,T.className="ghost",T.textContent="🗑",Object.assign(T.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),T.addEventListener("click",async O=>{O.preventDefault(),O.stopPropagation();const z=y[g]||g;if(confirm(`¿Eliminar la carpeta “${z}” y TODAS las evaluaciones que contiene? Esta acción no se puede deshacer.`))try{const{writeBatch:H}=await de(async()=>{const{writeBatch:Y}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:Y}},[],import.meta.url),D=H(C);k.forEach(Y=>{D.delete(N(St(),Y.id))}),await D.commit(),await al(g),await Rr(),xe(se)}catch(H){console.error("Error borrando carpeta y evaluaciones:",H),alert("No se pudo borrar la carpeta. Inténtalo de nuevo.")}}),I.appendChild(T)}b.appendChild(L),b.appendChild(I),S.appendChild(b);const B=document.createElement("div");k.forEach(T=>{const O=document.createElement("div");O.className="grade-item",O.dataset.id=T.id,O.draggable=!0,O.innerHTML=`
        <div style="flex:1">
          <div class="gr-name" style="font-weight:700">${ee(T.name||T.key)}</div>
          <div class="muted">Código: <code class="gr-code">${ee(T.key)}</code></div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <input data-f="score" type="number" step="${o}" min="${s}" max="${i}"
                 value="${n[T.key]??T.score??""}" style="width:110px"/>
          <button data-act="save" class="btn btn-secondary">Guardar</button>
          <button data-act="edit" class="btn btn-secondary">Editar</button>
          <button data-act="cancelEdit" class="btn btn-secondary" style="display:none">Cancelar</button>
          <button data-act="del"  class="btn btn-secondary">Eliminar</button>
        </div>
      `,O.querySelectorAll("input,button,select,textarea").forEach(z=>{z.setAttribute("draggable","false")}),O.addEventListener("click",async z=>{var D,Y;const H=z.target;if(H instanceof HTMLElement){if(H.dataset.act==="edit"){const q=O.querySelector(".gr-name"),ce=O.querySelector(".gr-code"),Ne=((D=q==null?void 0:q.textContent)==null?void 0:D.trim())||T.name||"",be=((Y=ce==null?void 0:ce.textContent)==null?void 0:Y.trim())||T.key||"";q.innerHTML=`<input data-f="edit-name" type="text" value="${ee(Ne)}"
                               style="width:100%;max-width:320px">`,ce.parentElement.innerHTML=`Código: <input data-f="edit-code" type="text" value="${ee(be)}"
                            style="width:120px">`,O.querySelector('[data-act="edit"]').style.display="none",O.querySelector('[data-act="cancelEdit"]').style.display="";return}if(H.dataset.act==="cancelEdit"){xe(se);return}if(H.dataset.act==="save"){const q=O.querySelector('[data-f="edit-name"]'),ce=O.querySelector('[data-f="edit-code"]');if(q||ce){const qn=q?q.value:T.name||T.key,Ts=ce?ce.value:T.key,Gr=(qn||"").trim();let Te=(Ts||"").trim();if(!Gr){alert("Escribe un nombre.");return}if(Te=fs(Te),!Te){alert("Código inválido. Usa A–Z, 0–9 o _.");return}if(new Set(se.filter(gt=>gt.id!==T.id).map(gt=>(gt.key||"").toLowerCase())).has(Te.toLowerCase())){alert(`El código ${Te} ya existe en este ramo.`);return}const Us=N(St(),T.id);if(Te!==T.key){const gt=xa(R.finalExpr||"",T.key,Te),Vr=xa(R.rulesText||"",T.key,Te);await ae(ds(),{finalExpr:gt||null,rulesText:Vr||null}),R.finalExpr=gt||"",R.rulesText=Vr||""}await ae(Us,{name:Gr,key:Te}),await Nt(),oe(),xe(se);return}const Ne=O.querySelector('[data-f="score"]');let be=parseFloat(Ne.value);const Tt=isNaN(be)?null:Hn(be,s,i);await ae(N(St(),T.id),{score:Tt});const Yr=se.findIndex(qn=>qn.id===T.id);Yr>=0&&(se[Yr].score=Tt),H.textContent="Guardado ✓",oe(),setTimeout(()=>H.textContent="Guardar",1200);return}if(H.dataset.act==="del"){if(!confirm(`Eliminar “${T.name||T.key}”?`))return;await fe(N(St(),T.id));return}}}),B.appendChild(O)}),S.appendChild(B),t.appendChild(S),gs(B),U.addEventListener("click",async T=>{T.preventDefault(),T.stopPropagation();const O=y[g]||x[g]||g,z=prompt(`Nuevo nombre para “${O}”:`,O);if(!(!z||z.trim()===O))try{if(await tl(g,z.trim()),v.has(g)){const H=we||{},D=ha().map(q=>q.key===g?{...q,label:z.trim()}:q),Y={...H,[g]:z.trim(),__custom:D};await ye(Zt(),Y,{merge:!0}),we=Y}xe(se)}catch{alert("No se pudo guardar el nuevo nombre.")}})}}function xa(e,t,n){if(!e)return e;const r=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a=new RegExp(`\\b${r(t)}\\b`,"g");return e.replace(a,n)}function oe(){const e=u("gr-finalExpr"),t=u("gr-rulesText");if(e&&(R.finalExpr=ut(e.value||"")),t&&(R.rulesText=t.value||""),_){const y=Ze.get(_)||{};Ze.set(_,{...y,...R})}const n=R.finalExpr||"",r=R.rulesText||"",a={},s=R.scale==="MAYOR"?1:0,i=R.scale==="MAYOR"?7:100;se.forEach(y=>{typeof y.score=="number"&&(a[y.key]=Hn(y.score,s,i))}),window.courseAttendance&&_ in window.courseAttendance?a.Asistencia=window.courseAttendance[_]:a.Asistencia=0;let o=null,c="";if(n.trim()!=="")try{o=It(n,a,{avg:Xt,min:Math.min,max:Math.max,final:y=>$n(y),finalCode:y=>Nn(y),finalId:y=>Hr(y)}),typeof o=="number"&&isFinite(o)?o=Qt(o,R.scale):o=null}catch(y){c=(y==null?void 0:y.message)||String(y||""),o=null}else o=null;const d=u("gr-rulesStatus");d&&(d.dataset.formulaError=c);const p=R.scale==="MAYOR"?3.95:54.5,m=Or(r),f=ys(m,a);let v=null;o==null?v=f.allOk?"—":"Reprueba":v=o>=p&&f.allOk?"Aprueba":"Reprueba";let x="—";if(o==null)x="Ingresa notas o completa la fórmula.";else if(v==="Aprueba")x="Nada más. Ya alcanzas la nota y cumples las reglas.";else{const y=[];if(o<p){const h=p-o;y.push(R.scale==="MAYOR"?`Subir la nota final en ${h.toFixed(2)} pts.`:`Subir la nota final en ${h.toFixed(1)} pts.`)}if(!f.allOk){const h=f.unmet.map(E=>`Cumplir: ${E.text}.`);y.push(...h)}x=y.join(" ")}xl(f),On({final:o,status:v,needed:x})}async function Nt(){if(_e={byName:{},byCode:{},byId:{}},!l.currentUser||!l.activeSemesterId)return;const e=Array.isArray(l.courses)?l.courses:[];for(const t of e)try{const n=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t.id,"grading","meta"),r=await te(n),a=r.exists()?r.data():{scale:"USM",finalExpr:""},s=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",t.id,"grading","meta","components"),o=(await F(s)).docs.map(x=>({id:x.id,...x.data()})),c={},d=a.scale==="MAYOR"?1:0,p=a.scale==="MAYOR"?7:100;for(const x of o)if(typeof x.score=="number"&&isFinite(x.score)){const y=Math.max(d,Math.min(p,x.score));c[x.key]=y}let m=null;if((a.finalExpr||"").trim())try{m=It(a.finalExpr,c,{avg:Xt,min:Math.min,max:Math.max,final:x=>NaN,finalCode:x=>NaN,finalId:x=>NaN}),typeof m=="number"&&isFinite(m)?m=Qt(m,a.scale):m=null}catch{m=null}const f=Ye(t.name),v=Ye(t.code);f&&(_e.byName[f]={final:m,scale:a.scale,id:t.id}),v&&(_e.byCode[v]={final:m,scale:a.scale,id:t.id}),_e.byId[t.id]={final:m,scale:a.scale,id:t.id}}catch{}}function Or(e){return(e||"").split(/\r?\n/).map(n=>n.trim()).filter(Boolean)}function ys(e,t,n){const r={allOk:!0,items:[],unmet:[]};for(const a of e){const s=bl(a);if(!s){r.items.push({text:a,ok:!1,reason:"inválida"}),r.unmet.push({text:a,kind:"invalid"}),r.allOk=!1;continue}const{left:i,op:o,right:c}=s;let d=null,p=null,m=!1;try{const v={...{avg:Xt,min:Math.min,max:Math.max,final:$n,finalCode:Nn,finalId:Hr},...n||{}};window.courseAttendance&&_ in window.courseAttendance?t.Asistencia=window.courseAttendance[_]:"Asistencia"in t||(t.Asistencia=0);const x=i.replace(/%/g,""),y=c.replace(/%/g,"");d=It(x,t,v),p=It(y,t,v),m=hl(d,o,p)}catch{m=!1}r.items.push({text:a,ok:m,left:d,op:o,right:p}),m||(r.unmet.push({text:a,kind:"cmp",left:d,op:o,right:p}),r.allOk=!1)}return r}function bl(e){const t=e.match(/^(.*?)(>=|<=|==|!=|>|<)(.*)$/);return t?{left:ut(t[1].trim()),op:t[2],right:ut(t[3].trim())}:null}function hl(e,t,n){if(!(isFinite(e)&&isFinite(n)))return!1;const r=Math.round(Math.round(e*10)/10),a=Math.round(Math.round(n*10)/10);switch(t){case">=":return r>=a;case"<=":return r<=a;case">":return r>a;case"<":return r<a;case"==":return r===a;case"!=":return r!==a;default:return!1}}function Xt(...e){const t=e.map(r=>typeof r=="number"&&isFinite(r)?r:Number(r)).filter(r=>!isNaN(r));return t.length?t.reduce((r,a)=>r+a,0)/t.length:NaN}function xl(e){const t=u("gr-rulesStatus");if(!t)return;if(!e||!e.items.length){t.textContent="No hay reglas definidas.";return}const n=e.items.filter(a=>a.ok).length,r=e.items.map(a=>a.ok?`✅ ${a.text}`:`❌ ${a.text}`);t.innerHTML=`<div><b>Reglas:</b> ${n}/${e.items.length} cumplidas</div><div style="margin-top:4px">${r.join("<br/>")}</div>`}function On(e){const t=[u("gr-currentFinal"),u("gr-currentAvg")].filter(Boolean),n=[u("gr-status")].filter(Boolean),r=[u("gr-needed"),u("gr-neededToPass")].filter(Boolean);if(!t.length&&!n.length&&!r.length)return;if(!e){t.forEach(c=>c.textContent=""),n.forEach(c=>c.textContent=""),r.forEach(c=>c.textContent="");return}const a=(R==null?void 0:R.scale)||"USM",s=e.final==null?"":Qt(e.final,a).toString(),i=e.status??"",o=e.needed??"";t.forEach(c=>c.textContent=s),n.forEach(c=>c.textContent=i),r.forEach(c=>c.textContent=o)}let Gn={id:null,fromIndex:-1};function gs(e){e&&(e.querySelectorAll(".grade-item").forEach(t=>{t.draggable=!0,t.querySelectorAll("input,button,select,textarea").forEach(n=>{n.setAttribute("draggable","false")})}),e.addEventListener("dragstart",t=>{const n=t.target.closest(".grade-item");n&&(t.dataTransfer.setData("text/plain",n.dataset.id||""),t.dataTransfer.effectAllowed="move",n.classList.add("dragging"),Gn.id=n.dataset.id,Gn.fromIndex=[...e.children].indexOf(n))}),e.addEventListener("dragend",()=>{const t=e.querySelector(".grade-item.dragging");t==null||t.classList.remove("dragging"),Gn={id:null,fromIndex:-1}}),e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect="move";const n=e.querySelector(".grade-item.dragging");if(!n)return;const r=wl(e,t.clientY);r==null?e.appendChild(n):e.insertBefore(n,r)},{capture:!0}),e.addEventListener("drop",async t=>{t.preventDefault();const n=[...e.querySelectorAll(".grade-item")].map(r=>r.dataset.id);await Sl(n)}))}function wl(e,t){return[...e.querySelectorAll(".grade-item:not(.dragging)")].reduce((r,a)=>{const s=a.getBoundingClientRect(),i=t-(s.top+s.height/2);return i<0&&i>r.offset?{offset:i,element:a}:r},{offset:Number.NEGATIVE_INFINITY,element:null}).element}async function Sl(e){if(!yt()||!Array.isArray(e)||!e.length)return;const{writeBatch:t}=await de(async()=>{const{writeBatch:s}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:s}},[],import.meta.url),n=t(C);let r=Date.now();const a=1e3;e.forEach((s,i)=>{const o=N(St(),s);n.update(o,{order:r+i*a})});try{await n.commit()}catch(s){console.warn("Error al guardar orden:",s)}}function El(){var e;return(((e=document.getElementById("gr-finalExpr"))==null?void 0:e.value)||"").trim()}function Cl(e,t){let n=null;return(...r)=>{n&&clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function yt(){return!!(l.currentUser&&l.activeSemesterId&&_)}function ee(e){return(e??"").toString().replace(/[<>&"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[t])}function Hn(e,t,n){return Math.max(t,Math.min(n,e))}function ut(e){if(!e)return"";let t=String(e).trim();return t=t.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"),t=t.replace(/\s+/g," "),t}function vs(e){return e.replace(/\b(final|finalCode|finalId)\(\s*([^)]+?)\s*\)/g,(t,n,r)=>{const a=String(r).trim();if(/^["'].*["']$/.test(a))return`${n}(${a})`;if(/[(),]/.test(a))return`${n}(${a})`;const s=a.replace(/"/g,'\\"');return`${n}("${s}")`})}function Ll(e){return e?e.replace(/(\d+(?:\.\d+)?)\s*%/g,(t,n)=>`(${n}/100)`):""}function It(e,t,n={}){const r=ut(e),a=vs(r),s=a.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0");if(!/^[\w\s\.\+\-\*\/\(\),%<>!=]+$/.test(s))throw new Error("La fórmula contiene caracteres no permitidos.");const i=Ll(a),o=s.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],c=new Set(["avg","min","max","final","finalCode","finalId"]),d=new Set(["NaN","Infinity","Math","true","false"]),p=Object.keys(t),m=p.map(y=>t[y]??0),f=new Set([...p,...Object.keys(n)]);for(const y of o)c.has(y)||d.has(y)||f.has(y)||(p.push(y),m.push(0),f.add(y));const v=Object.keys(n),x=Object.values(n);return Function(...v,...p,`"use strict"; return (${i});`)(...x,...m)}function Ml(e){const t=ut(e||""),n=vs(t),a=n.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0").match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],s=new Set(["avg","min","max","final","finalCode","finalId","NaN","Infinity","Math","true","false"]),i=new Set((n.match(/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/g)||[]).map(c=>c.replace("(","").trim())),o=a.filter(c=>!s.has(c)&&!i.has(c));return[...new Set(o)]}function Qt(e,t){return e==null||isNaN(e)?null:t==="MAYOR"?Math.trunc(e*100)/100:Math.trunc(e*10)/10}function Ye(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase()}function $n(e){const t=Ye(e);if(!t)return NaN;const n=(l.courses||[]).find(o=>o.id===_);if(t===Ye(n==null?void 0:n.name))return NaN;const r=_e.byName[t];if(r&&typeof r.final=="number")return r.final;const a=Array.isArray(l.courses)?l.courses:[],s=a.filter(o=>Ye(o.name).startsWith(t)&&o.id!==_);if(s.length===1){const o=_e.byId[s[0].id];if(o&&typeof o.final=="number")return o.final}const i=a.filter(o=>Ye(o.name).includes(t)&&o.id!==_);if(i.length===1){const o=_e.byId[i[0].id];if(o&&typeof o.final=="number")return o.final}return NaN}function Nn(e){const t=Ye(e),n=(l.courses||[]).find(a=>a.id===_);if(t&&t===Ye(n==null?void 0:n.code))return NaN;const r=_e.byCode[t];return r&&typeof r.final=="number"?r.final:NaN}function Hr(e){if(!e||e===_)return NaN;const t=_e.byId[e];return t&&typeof t.final=="number"?t.final:NaN}let W={uid:null,semId:null,courses:[],unsubCourses:null};const Qe={};function Il(e,t="Usuario"){const n=String(e||"").trim();return n||t}function kl(e,t="#64748b"){const n=String(e).trim();return/^#[0-9A-Fa-f]{6}$/.test(n)?n:t}async function bs(e){var t;if(!e)return{name:"",color:"#64748b"};if(Qe[e])return Qe[e];try{const n=await te(N(C,"users",e,"profile","profile")),r=await te(N(C,"users",e)),a=n.exists()?n.data()||{}:{},s=r.exists()?r.data()||{}:{},i=Il(a.name||s.name||s.displayName||s.username,e===((t=l.currentUser)==null?void 0:t.uid)?"Yo":"Usuario"),o=kl(a.favoriteColor||s.favoriteColor||"#64748b");return Qe[e]={name:i,color:o},Qe[e]}catch{return Qe[e]={name:"Usuario",color:"#64748b"},Qe[e]}}function Al(){var e;try{(e=W.unsubCourses)==null||e.call(W)}catch{}W.unsubCourses=null,W.courses=[]}function hs(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return hs(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function $l(){var a,s,i,o;const e=(a=l.currentUser)==null?void 0:a.uid,t=[l.partyMembers,l.party,l.partyData,l.activeParty,(s=l.shared)==null?void 0:s.party,(i=l.shared)==null?void 0:i.partyData,(o=l.shared)==null?void 0:o.partyMembers];let n=[];for(const c of t)if(n=hs(c),n.length)break;return[...new Set(n.filter(Boolean))].filter(c=>c!==e)}function xs(){const e=u("gr-partnerView");if(!e||e.querySelector("#gr-partyBar"))return;const t=document.createElement("div");t.id="gr-partyBar",t.style.cssText="display:flex; flex-wrap:wrap; gap:10px; margin:10px 0 12px 0;";const n=e.querySelector("h3, h2");n&&/duo/i.test(n.textContent||"")&&(n.textContent="Notas de mi party");const r=e.querySelector("#gr-sh-semSel");r!=null&&r.parentElement?r.parentElement.insertBefore(t,r):e.insertBefore(t,e.firstChild)}async function pr(){xs();const e=document.getElementById("gr-partyBar");if(!e)return;const t=$l();if(!t.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}(!W.uid||!t.includes(W.uid))&&(W.uid=t[0]),await Promise.all(t.map(n=>bs(n))),e.innerHTML=t.map(n=>{const r=Qe[n]||{};return`
      <button class="btn ${n===W.uid?"violet":"violet-outline"}"
        data-gr-uid="${n}"
        style="display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color||"#64748b"};display:inline-block;"></span>
        <span style="font-weight:800">${is(r.name||"Usuario")}</span>
      </button>
    `}).join(""),e.querySelectorAll("button[data-gr-uid]").forEach(n=>{n.addEventListener("click",async()=>{W.uid=n.dataset.grUid,await pr(),await mr(),await fr()})})}async function mr(){var i;const e=u("gr-sh-semSel");if(!e)return;const t=((i=l.activeSemesterData)==null?void 0:i.label)||null;if(!t){e.innerHTML="<option selected>No disponible</option>",e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",W.semId=null;return}if(e.innerHTML=`<option selected>${t}</option>`,e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",!W.uid){W.semId=null;return}const n=P(C,"users",W.uid,"semesters"),r=await F(n);let a=null;r.forEach(o=>{var d;String(((d=o.data())==null?void 0:d.label)||"").trim()===t&&(a=o.id)}),W.semId=a;const s=u("gr-sh-list");s&&!a&&(s.innerHTML=`<div class="muted">Este miembro no tiene creado el semestre ${is(t)}.</div>`)}async function fr(){const e=u("gr-sh-list");if(e&&(e.innerHTML=""),Al(),!W.uid||!W.semId)return;const t=P(C,"users",W.uid,"semesters",W.semId,"courses");W.unsubCourses=G(Q(t,Se("name")),n=>{W.courses=n.docs.map(r=>({id:r.id,...r.data()||{}})),Nl()})}function Nl(){const e=u("gr-sh-list");if(!e)return;e.innerHTML="";const t=W.courses||[];if(!t.length){e.innerHTML='<div class="muted">No hay ramos en ese semestre.</div>';return}t.forEach(n=>{const r=document.createElement("div");r.className="grade-item",r.style.cursor="pointer",r.innerHTML=`
      <div style="flex:1">
        <div style="font-weight:800">${ee(n.name||"Ramo")}</div>
        <div class="muted">Código: <b>${ee(n.code||"—")}</b></div>
      </div>
      <div class="muted" style="font-weight:800">Ver</div>
    `,r.addEventListener("click",()=>Ul(n.id)),e.appendChild(r)})}function Tl(){var n;if(document.getElementById("grPartyCourseModal"))return;const e=document.createElement("div");e.id="grPartyCourseModal",e.style.cssText=`
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
  `,document.body.appendChild(e);const t=()=>e.style.display="none";(n=document.getElementById("grPcX"))==null||n.addEventListener("click",t),e.addEventListener("click",r=>{r.target===e&&t()}),document.addEventListener("keydown",r=>{e.style.display==="flex"&&r.key==="Escape"&&t()})}async function Ul(e){var S;if(!W.uid||!W.semId||!e)return;Tl();const t=document.getElementById("grPartyCourseModal"),n=document.getElementById("grPcTitle"),r=document.getElementById("grPcSub"),a=document.getElementById("grPcFormula"),s=document.getElementById("grPcFinal"),i=document.getElementById("grPcEvals");t.style.display="flex",i.innerHTML="Cargando…",s.textContent="—",a.textContent="—";const o=(W.courses||[]).find(b=>b.id===e)||{},c=await bs(W.uid);n.textContent=o.name||"Ramo",r.textContent=`${c.name||"Usuario"} · ${((S=l.activeSemesterData)==null?void 0:S.label)||""}`;const d=N(C,"users",W.uid,"semesters",W.semId,"courses",e,"grading","meta"),p=P(C,"users",W.uid,"semesters",W.semId,"courses",e,"grading","meta","components"),[m,f]=await Promise.all([te(d),F(Q(p,Se("order")))]),v=m.exists()?m.data()||{}:{scale:"USM",finalExpr:""},x=f.docs.map(b=>({id:b.id,...b.data()||{}})),y=v.scale||"USM",h=y==="MAYOR"?1:0,E=y==="MAYOR"?7:100,M={};x.forEach(b=>{typeof b.score=="number"&&isFinite(b.score)&&b.key&&(M[b.key]=Hn(b.score,h,E))});const $=(v.finalExpr||"").trim();a.textContent=$||"—";let A=null;try{$&&(A=It($,M,{avg:Xt,min:Math.min,max:Math.max,final:()=>NaN,finalCode:()=>NaN,finalId:()=>NaN}),typeof A=="number"&&isFinite(A)?A=Qt(A,y):A=null)}catch{A=null}if(s.textContent=A==null?"—":String(A),!x.length){i.innerHTML='<div class="muted">Este ramo no tiene evaluaciones.</div>';return}const g=(b="")=>{const w=String(b||"");return/certamen/i.test(w)?"Certámenes":/control/i.test(w)?"Controles":/tarea/i.test(w)?"Tareas":/proy|proyecto/i.test(w)?"Proyecto":/laboratorio|\blab/i.test(w)?"Laboratorios":/pre[\s-]?informe/i.test(w)?"Pre-informes":/\binforme/i.test(w)&&!/pre[\s-]?informe/i.test(w)?"Informes":"Otros"},k={};x.forEach(b=>{const w=g(b.name||b.key);(k[w]=k[w]||[]).push(b)}),i.innerHTML=Object.entries(k).map(([b,w])=>{const L=w.map(I=>{const U=typeof I.score=="number"&&isFinite(I.score)?I.score:null;return`
        <div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:12px;
          border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); margin-top:8px;">
          <div style="min-width:0;">
            <div style="font-weight:900; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${ee(I.name||I.key)}
            </div>
            <div class="muted" style="font-size:12px;opacity:.75;margin-top:2px;">Código: <b>${ee(I.key||"—")}</b></div>
          </div>
          <div style="font-weight:900; font-size:14px;">
            ${U==null?"—":ee(U)}
          </div>
        </div>
      `}).join("");return`
      <details open style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:900;opacity:.9">${ee(b)} (${w.length})</summary>
        ${L}
      </details>
    `}).join("")}(function(){const t=u("gr-togglePartner");if(!t)return;const n=document.querySelector("#page-notas h2, #page-notas h1, .page-title");function r(){var i,o,c,d,p;return[(i=u("gr-courseSel"))==null?void 0:i.closest(".card"),u("gr-evalsCard")||((o=u("gr-evalsList"))==null?void 0:o.closest(".card")),u("gr-calcCard")||((c=u("gr-finalExpr"))==null?void 0:c.closest(".card")),u("gr-summaryCard")||((d=u("gr-currentFinal"))==null?void 0:d.closest(".card"))||((p=u("gr-currentAvg"))==null?void 0:p.closest(".card")),u("gr-rulesCard")].filter(Boolean)}const a=u("gr-partnerView");function s(i){t.setAttribute("aria-pressed",i?"true":"false"),t.textContent=i?"Volver a mis notas":"Notas de mi party",n&&(n.textContent=i?"🎉 Notas de mi party":"📊 Mis Notas"),r().forEach(o=>en(o,i)),en(a,!i),i&&(xs(),pr().then(()=>mr()).then(()=>fr()).catch(o=>console.warn("Error cargando party:",o)))}t.addEventListener("click",()=>{const i=t.getAttribute("aria-pressed")==="true";s(!i)}),document.addEventListener("party:ready",()=>{t.getAttribute("aria-pressed")==="true"&&pr().then(()=>mr()).then(()=>fr()).catch(()=>{})}),document.addEventListener("route:notas",()=>{t.getAttribute("aria-pressed")==="true"||(en(a,!0),r().forEach(o=>en(o,!1)))})})();function Pl({formula:e,evals:t}){var g,k,S,b;(g=document.getElementById("gr-simDrawer"))==null||g.remove(),(k=document.getElementById("gr-simBackdrop"))==null||k.remove();const n=document.createElement("div");n.id="gr-simBackdrop",Object.assign(n.style,{position:"fixed",inset:"0",zIndex:9998,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(1px)"}),document.body.classList.add("sim-lock");const r=document.createElement("div");r.id="gr-simDrawer",Object.assign(r.style,{position:"fixed",top:"0",right:"0",height:"100vh",width:"420px",background:"rgba(18,18,30,.98)",backdropFilter:"blur(6px)",borderLeft:"1px solid rgba(255,255,255,.08)",boxShadow:"0 0 24px rgba(0,0,0,.45)",zIndex:9999,padding:"16px 16px 90px 16px",overflowY:"auto"}),r.addEventListener("click",w=>w.stopPropagation()),r.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <h3 style="margin:0">Simulador de notas</h3>
      <span class="muted" style="font-size:12px;opacity:.8">(${ee(e)})</span>
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

  `,document.body.appendChild(n),document.body.appendChild(r);const a=async()=>{const w=A();let L=null;try{L=await Sa()}catch{L=null}const I=(O={})=>{const z={};for(const[H,D]of Object.entries(O||{}))D==null||D===""||typeof D=="string"&&D.trim()===""?z[H.toUpperCase()]=null:isNaN(D)?z[H.toUpperCase()]=D:z[H.toUpperCase()]=Math.round(Number(D)*100)/100;return z},B=((O,z)=>{const H=I(O),D=I(z),Y=new Set([...Object.keys(H),...Object.keys(D)]);for(const q of Y)if((H[q]??null)!==(D[q]??null))return!1;return!0})(w.gradesMap,L);let T=!1;if(B||(T=confirm("¿Guardar esta simulación antes de salir?")),T)try{await wa(w.gradesMap,e)}catch{}n.remove(),r.remove(),document.body.classList.remove("sim-lock")};n.addEventListener("click",a),r.addEventListener("keydown",w=>{w.key==="Escape"&&a()}),(S=r.querySelector("#gr-simClose"))==null||S.addEventListener("click",a),Dl(r);const s=r.querySelector("#gr-simForm"),i=new Map((t||[]).map(w=>[w.code,w.grade])),o=Ml(e),c=new Set((t||[]).map(w=>w.code)),d=[...new Set([...c,...o])],p={certamenes:[],controles:[],tareas:[],proyecto:[],evaluaciones:[],experiencias:[],preinformes:[],informes:[],laboratorios:[],otros:[]},m={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};function f(w,L){const I=(L||"").toString();return/certamen/i.test(I)?"certamenes":/control/i.test(I)?"controles":/tarea/i.test(I)?"tareas":/proy|proyecto/i.test(I)?"proyecto":/evaluaci[oó]n/i.test(I)?"evaluaciones":/experien/i.test(I)?"experiencias":/pre[\s-]?informe/i.test(I)?"preinformes":/\binforme/i.test(I)&&!/pre[\s-]?informe/i.test(I)?"informes":/laboratorio|\blab/i.test(I)?"laboratorios":"otros"}for(const w of d){const L=(t||[]).find(B=>B.code===w)||{name:w},I=i.get(w),U=f(w,L.name||w);p[U].push({code:w,name:L.name||w,value:I})}const v=[],x=R.scale==="MAYOR",y=x?1:0,h=x?7:100,E=x?.1:1;for(const[w,L]of Object.entries(p)){if(!L.length)continue;const I=m[w]||w;v.push(`
    <details open class="sim-group" data-key="${w}"
      style="margin-top:10px;border:1px solid rgba(255,255,255,.08);
             border-radius:8px;padding:6px 8px;background:rgba(0,0,0,0.15)">
      <summary style="cursor:pointer;font-weight:700;font-size:14px;
                      margin-bottom:6px">${I} (${L.length})</summary>
      <div class="sim-group-body">
        ${L.map(U=>`
          <div class="row" style="align-items:center;gap:8px;margin:4px 0"
               data-sim-code="${ee(U.code)}">
            <div style="min-width:76px"><b>${ee(U.code)}</b></div>
            <div style="flex:1">${ee(U.name)}</div>
            <input type="number" step="${E}" min="${y}" max="${h}"
                   style="width:110px" placeholder="—"
                   value="${U.value??""}">
          </div>
        `).join("")}
      </div>
    </details>
  `)}s.innerHTML=v.join("");const M=[...e.matchAll(/finalCode\(["'](.+?)["']\)/g)];for(const w of M){const L=w[1],I=Nn(L);isFinite(I)?v.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${ee(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${ee(L)}</div>
        <input type="number" readonly value="${I}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `):v.push(`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.75" data-sim-ref="${ee(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1;color:#aaa">Nota final de ${ee(L)}</div>
        <div style="width:110px;text-align:center;color:#f87171">—</div>
      </div>
    `)}s.innerHTML=v.join("");const $=[...e.matchAll(/final\(["'](.+?)["']\)/g)];for(const w of $){const L=w[1],I=$n(L);isFinite(I)&&s.insertAdjacentHTML("beforeend",`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${ee(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${ee(L)}</div>
        <input type="number" readonly value="${I}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `)}const A=()=>{const w={};s.querySelectorAll("[data-sim-code]").forEach(D=>{var Ne,be;const Y=D.getAttribute("data-sim-code"),q=(be=(Ne=D.querySelector("input"))==null?void 0:Ne.value)==null?void 0:be.trim(),ce=q?Number(String(q).replace(",",".")):null;w[Y]=Number.isFinite(ce)?ce:0});let L=null,I=null;try{L=It(e,{...w},{avg:Xt,min:Math.min,max:Math.max,final:D=>$n(D),finalCode:D=>Nn(D),finalId:D=>Hr(D)}),typeof L=="number"&&isFinite(L)?L=Qt(L,R.scale):L=null}catch(D){I=(D==null?void 0:D.message)||String(D||""),L=null}const U=Or(R.rulesText||""),B=ys(U,w),T=R.scale==="MAYOR"?3.95:54.5;let O="";if(I)O="";else if(L==null)O="Ingresa valores para simular.";else{const D=[];if(L<T){const Y=T-L;D.push(R.scale==="MAYOR"?`Subir la nota final en ${Y.toFixed(2)} pts.`:`Subir la nota final en ${Y.toFixed(1)} pts.`)}if(!B.allOk){const Y=B.unmet.map(q=>q.text);Y.length&&D.push(`Cumplir reglas pendientes: ${Y.map(ee).join("; ")}.`)}O=D.length?D.join(" "):"Nada más. Ya apruebas."}const z=r.querySelector("#gr-simSummary");z.innerHTML=I?`<div style="color:#f87171">Error en fórmula: ${ee(I)}</div>`:`
    <div>Promedio simulado: <b>${L??"—"}</b></div>
    <div class="muted" style="margin-top:6px">(Usa tu fórmula final actual)</div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:10px 0">
    <div><b>Necesitas para aprobar</b></div>
    <div style="margin-top:4px">${O}</div>
  `;const H=r.querySelector("#gr-simRules");if(!U.length)H.textContent="No hay reglas definidas.";else{const D=B.items.filter(Y=>Y.ok).length;H.innerHTML=`
        <div style="margin-bottom:6px">Cumplidas: <b>${D}/${U.length}</b></div>
        <ul style="margin:0 0 0 18px;padding:0;list-style:disc;">
          ${B.items.map(Y=>`<li style="color:${Y.ok?"#22c55e":"#ef4444"}">${ee(Y.text)}</li>`).join("")}
        </ul>
      `}return{gradesMap:w,result:L}};s.addEventListener("input",A),A(),(b=r.querySelector("#gr-simSave"))==null||b.addEventListener("click",async()=>{const w=A();try{const L=await wa(w.gradesMap,e);alert((L==null?void 0:L.where)==="cloud"?"Simulación guardada en la nube.":"Simulación guardada")}catch(L){console.error(L),alert("No se pudo guardar la simulación.")}}),Sa().then(w=>{w&&(s.querySelectorAll("[data-sim-code]").forEach(L=>{const I=L.getAttribute("data-sim-code")||"",U=L.querySelector("input");if(!U)return;const B=w[I]??w[I.toUpperCase()]??w[I.toLowerCase()];B!=null&&(U.value=String(B))}),A())}).catch(()=>{})}function Dl(e){const t=()=>Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(a=>!a.hasAttribute("disabled")&&a.tabIndex!==-1),n=()=>t()[0],r=()=>t().slice(-1)[0];setTimeout(()=>{var a;return(a=n())==null?void 0:a.focus()},0),e.addEventListener("keydown",a=>{var o,c;if(a.key!=="Tab")return;const s=t();if(!s.length)return;const i=document.activeElement;a.shiftKey?i===s[0]&&(a.preventDefault(),(o=r())==null||o.focus()):i===s[s.length-1]&&(a.preventDefault(),(c=n())==null||c.focus())})}async function wa(e,t){const n={};Object.keys(e||{}).forEach(s=>{n[String(s).toUpperCase()]=e[s]});const r={formula:t,grades:n,rules:Or(R.rulesText||""),semId:l.activeSemesterId||null,courseId:l.editingCourseId||null,createdAt:$a()};if(l.currentUser&&l.activeSemesterId&&l.editingCourseId)try{const s=["users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",l.editingCourseId,"simulations"];return await Ee(P(C,...s),r),await ye(N(C,...s,"__last__"),r),{ok:!0,where:"cloud"}}catch(s){console.warn("Fallo Firestore, usando localStorage:",s)}const a=`sim:last:${l.activeSemesterId||"SEM"}:${l.editingCourseId||"COURSE"}`;return localStorage.setItem(a,JSON.stringify(r)),{ok:!0,where:"local"}}async function Sa(){var t;const e=`sim:last:${l.activeSemesterId||"SEM"}:${l.editingCourseId||"COURSE"}`;if(l.currentUser&&l.activeSemesterId&&l.editingCourseId)try{const n=N(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses",l.editingCourseId,"simulations","__last__"),r=await te(n);if(r.exists()){const a=((t=r.data())==null?void 0:t.grades)||null;return a&&typeof a=="object"?a:null}}catch{}try{const n=localStorage.getItem(e);if(!n)return null;const r=JSON.parse(n),a=(r==null?void 0:r.grades)||null;return a&&typeof a=="object"?a:null}catch{return null}}function _l(e){if(!e||!l.courses)return null;const t=r=>String(r||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),n=t(e);return l.courses.find(r=>t(r.name).includes(n)||t(r.code||"").includes(n))||null}async function ws(e){const t=P(e.ref,"rules"),n=await F(t);let r=0,a=0;for(const s of n.docs){const i=s.data(),o=Number(i.peso)||0,c=P(s.ref,"grades"),p=(await F(c)).docs.map(m=>Number(m.data().valor)).filter(m=>!isNaN(m));if(p.length>0){const m=p.reduce((f,v)=>f+v,0)/p.length;r+=m*(o/100),a+=o}}return a>0?+r.toFixed(2):null}async function Bl(e){if(!l.currentUser)return null;const t=P(C,"users",l.currentUser.uid,"semesters",e,"courses"),n=await F(t);let r=0,a=0;for(const s of n.docs){const i=await ws(s);i!=null&&(r+=i,a++)}return a>0?+(r/a).toFixed(2):null}function Rl(e){var i;const n=(e.scale||"USM")==="MAYOR"?4:55;let r=0,a=0;for(const o of e.rules||[]){const c=Number(o.peso)||0;if(o.tipo.toLowerCase().includes("examen")){a=c;continue}if((i=o.notas)!=null&&i.length){const d=o.notas.reduce((p,m)=>p+m,0)/o.notas.length;r+=d*(c/100)}}return a===0?null:+((n-r)/(a/100)).toFixed(2)}function Ol(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return e.promedio>=n}function Hl(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return+Math.max(0,n-(e.promedio||0)).toFixed(2)}async function ql(e){if(!l.currentUser)return{best:null,worst:null};const t=P(C,"users",l.currentUser.uid,"semesters",e,"courses"),n=await F(t),r=[];for(const a of n.docs){const s=await ws(a);r.push({id:a.id,name:a.data().name,promedio:s})}return r.length?(r.sort((a,s)=>(s.promedio||0)-(a.promedio||0)),{best:r[0],worst:r[r.length-1]}):{best:null,worst:null}}const Ea=Object.freeze(Object.defineProperty({__proto__:null,bestWorst:ql,calcBrecha:Hl,calcNotaMinima:Rl,calcPromedioSemestre:Bl,clearGradesUI:il,enableDnDForGrades:gs,findCourse:_l,initGrades:cl,isPassing:Ol,onActiveSemesterChanged:dl,onCoursesChanged:xn,registerGradesUnsub:sl,stopGradesSub:ol},Symbol.toStringTag,{value:"Module"}));let Vn="USM";function qr(){Fl()}function Re(){Yl()}function zr(e){var s;Vn=e==="UMAYOR"?"MAYOR":"USM";const t=u("sectParLabel");t&&(t.textContent=e==="USM"?"Paralelo":"Sección/Paralelo");const n=u("courseScale"),r=(s=n==null?void 0:n.closest)==null?void 0:s.call(n,".form-field");r&&r.classList.add("hidden"),n&&(n.value=Vn,n.disabled=!0);const a=u("scaleHint");a&&(a.textContent=Vn==="MAYOR"?"Escala: UMayor (1–7) · tomada desde tu Perfil":"Escala: USM (0–100) · tomada desde tu Perfil")}let pn=null;function zl(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function Fl(){if(pn&&(pn(),pn=null),!l.currentUser||!l.activeSemesterId){l.courses=[],document.dispatchEvent(new Event("courses:changed"));return}const e=P(C,"users",l.currentUser.uid,"semesters",l.activeSemesterId,"courses");pn=G(e,zl(t=>{const n=t.docs.map(r=>{const a=r.data()||{},s=a.createdAt instanceof js?a.createdAt.toMillis():typeof a.createdAt=="number"?a.createdAt:0;return{id:r.id,...a,createdAtMs:s}});n.sort((r,a)=>a.createdAtMs-r.createdAtMs),l.courses=n,jl(n),xn==null||xn(),document.dispatchEvent(new Event("courses:changed"))},300))}function jl(e){const t=u("coursesList");t&&(t.innerHTML="",(e||[]).forEach(n=>{const r=document.createElement("div");r.className="course-item",r.innerHTML=`
  <div>
    <div>
      <b>${Pt(n.name||"Sin nombre")}</b>
      <span class="course-meta">· ${Pt(n.code||"")}</span>
    </div>

    <div class="course-meta">${Pt(n.professor||"")}</div>

    <div class="course-meta" style="display:flex;align-items:center;gap:8px;margin-top:6px;">
      <span
        style="
          display:inline-block;
          width:12px;
          height:12px;
          border-radius:999px;
          background:${Pt(n.color||"#3B82F6")};
          border:1px solid rgba(255,255,255,.25);
        "
      ></span>
      <span>Color: ${Pt((n.color||"#3B82F6").toUpperCase())}</span>
    </div>
  </div>

  <div class="inline">
    <button class="ghost course-edit" data-id="${n.id}">Editar</button>
    <button class="danger course-del"  data-id="${n.id}">Eliminar</button>
  </div>
`,t.appendChild(r)}))}function Yl(){var o;l.editingCourseId=null;const e=u("courseName");e&&(e.value="");const t=u("courseCode");t&&(t.value="");const n=u("courseProfessor");n&&(n.value="");const r=u("courseSectPar");r&&(r.value="");const a=u("courseColor");a&&(a.value="#3B82F6");const s=u("courseColorCode");s&&(s.textContent="#3B82F6");const i=u("saveCourseBtn");i&&(i.textContent="Agregar ramo"),(o=u("cancelEditBtn"))==null||o.classList.add("hidden")}function Pt(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let ot=null,Ca=!1;function Gl(){Ca||(Ca=!0,Vl())}function Wn(){ot&&(ot(),ot=null);const e=u("semestersList");e&&(e.innerHTML=""),kt()}function Vl(){const e=u("createSemesterBtn");e&&e.addEventListener("click",async()=>{var c;if(!l.currentUser){alert("Debes iniciar sesión.");return}const t=Jl();if(!t){alert("Completa tu universidad en Perfil.");return}const n=(((c=u("semesterLabel"))==null?void 0:c.value)||"").trim();if(!Wl(n)){alert("Formato de semestre inválido. Usa AAAA-1 o AAAA-2 (ej. 2025-2).");return}const r=P(C,"users",l.currentUser.uid,"semesters");if(!(await F(Q(r,Aa("label","==",n)))).empty){alert("Ya existe un semestre con ese nombre.");return}let s=localStorage.getItem(`scale_${t}`);if(!s){const d=await new Promise(p=>{const m=document.getElementById("scaleModal"),f=document.getElementById("scaleSelect"),v=document.getElementById("scaleSave"),x=document.getElementById("scaleCancel");m.classList.add("active"),f.value="";const y=M=>{m.classList.remove("active"),v.removeEventListener("click",h),x.removeEventListener("click",E),p(M)},h=()=>{const M=f.value;if(!M)return alert("Selecciona una escala antes de continuar.");localStorage.setItem(`scale_${t}`,M),y(M)},E=()=>{y(null)};v.addEventListener("click",h),x.addEventListener("click",E)});if(!d){console.log("❌ Creación de semestre cancelada por el usuario.");return}s=d}const i=await Ee(r,{label:n,universityAtThatTime:t,gradeScale:s||"0-100",createdAt:Date.now()});u("semesterLabel")&&(u("semesterLabel").value="");const o=l.activeSemesterId||null;if(o&&await Es(o,i.id),await yr(i.id),await new Promise(d=>setTimeout(d,400)),l.activeSemesterId){console.log(`✅ Semestre ${n} activado (${l.activeSemesterId}), preparando interfaz de ramos...`);const d=Fr(t);zr(d),Re(),qr();const p=u("coursesSection");p&&p.classList.remove("hidden")}else console.warn("⚠️ No se estableció correctamente el semestre activo tras la creación.");zt(),Cs()}),document.addEventListener("click",async t=>{const n=t.target;if(n instanceof HTMLElement){if(n.matches(".sem-activate")){if(!l.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;await yr(r)}if(n.matches(".sem-delete")){if(!l.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;if(!confirm("¿Eliminar este semestre?"))return;await fe(N(C,"users",l.currentUser.uid,"semesters",r)),l.activeSemesterId===r&&kt()}}})}async function Ss(){var f,v,x,y,h,E;if(ot&&(ot(),ot=null),!l.currentUser)return;const e=l.profileData||{},t=((f=e.university)==null?void 0:f.trim())||"",n=((v=e.career)==null?void 0:v.trim())||"",r=((x=e.customUniversity)==null?void 0:x.trim())||"",a=((y=e.customCareer)==null?void 0:y.trim())||"",s=t&&t!=="OTRA"||r&&r!=="",i=n&&n!=="OTRA"||a&&a!=="",o=u("semestersList");if(!s||!i){o&&(o.innerHTML=`
        <div class="card" style="padding:20px; text-align:center;">
          <h3>⚠️ Antes de agregar semestres necesitas configurar tu perfil</h3>
          <p>Completa tu <b>universidad</b> y <b>carrera</b> para poder crear y visualizar semestres.</p>
          <button id="goToProfileBtn" class="btn-primary" style="margin-top:10px;">
            Ir a Perfil ahora →
          </button>
        </div>
      `,(h=u("goToProfileBtn"))==null||h.addEventListener("click",()=>{const M=u("subtabPerfil")||document.querySelector('[data-tab="perfil"]'),$=u("perfilContainer")||document.getElementById("perfilContainer");M&&$&&(document.querySelectorAll(".subtab").forEach(A=>A.classList.remove("active")),document.querySelectorAll(".page").forEach(A=>A.classList.add("hidden")),M.classList.add("active"),$.classList.remove("hidden"))}));return}const c=l.currentUser.uid,d=await te(N(C,"users",c)),p=d.exists()&&((E=d.data())==null?void 0:E.activeSemester)||null;if(p){l.activeSemesterId=p;const M=await te(N(C,"users",c,"semesters",p));l.activeSemesterData=M.exists()?M.data():null}if(l.activeSemesterId&&l.activeSemesterData){console.log("[Semesters] Restaurando semestre activo tras recarga:",l.activeSemesterData.label);const M=u("coursesSection");M&&M.classList.remove("hidden");const $=Fr(l.activeSemesterData.universityAtThatTime);zr($),Re(),qr(),zt(),Cs();const A=u("activeSemesterLabel");A&&(A.textContent=l.activeSemesterData.label||"—");const g=u("activeSemesterUni");g&&(g.textContent=l.activeSemesterData.universityAtThatTime||"—");const k=u("gr-activeSemLabel");k&&(k.textContent=l.activeSemesterData.label||"—");const S=u("gr-scaleSel"),b=u("gr-passThreshold");S&&(S.value=$==="UMAYOR"?"MAYOR":"USM",S.disabled=!0),b&&(b.value=$==="UMAYOR"?4:55),$t(),lt==null||lt(),Le(),document.dispatchEvent(new Event("semester:changed"))}const m=P(C,"users",c,"semesters");ot=G(Q(m,Se("createdAt","desc")),M=>{const $=u("semestersList");if(!$)return;if($.innerHTML="",M.empty){kt();return}if(M.forEach(g=>{const k=g.data(),S=document.createElement("div");S.className="course-item";const b=l.activeSemesterId===g.id;S.innerHTML=`
        <div>
          <div><b>${k.label}</b> <span class="course-meta">· ${k.universityAtThatTime}</span></div>
        </div>
        <div class="inline">
          ${b?'<span class="course-meta">Activo</span>':`<button class="ghost sem-activate" data-id="${g.id}">Activar</button>`}
          <button class="danger sem-delete" data-id="${g.id}">Eliminar</button>
        </div>
      `,$.appendChild(S)}),M.docs.some(g=>g.id===l.activeSemesterId)||kt(),!l.activeSemesterId&&!M.empty){const g=M.docs[0].id;console.log("[Semesters] No había activo guardado, usando el más reciente:",g),yr(g)}})}async function Es(e,t){var r;const n=(r=l.currentUser)==null?void 0:r.uid;if(!(!n||!e||!t))try{const a=P(C,"users",n,"semesters",e,"calendar"),s=P(C,"users",n,"semesters",t,"calendar"),i=await F(a);let o=0;for(const c of i.docs){const d=c.data();d.persistent&&(await Ee(s,{...d,createdAt:Date.now()}),o++)}console.log(`🔁 [Semesters] ${o} eventos persistentes copiados de ${e} a ${t}`)}catch(a){console.error("❌ Error copiando eventos persistentes:",a)}}async function yr(e){var d,p,m,f;if(!l.currentUser||!e)return;l.activeSemesterId=e;const t=await te(N(C,"users",l.currentUser.uid,"semesters",e));l.activeSemesterData=t.exists()?t.data():null,await ye(N(C,"users",l.currentUser.uid),{activeSemester:e},{merge:!0}),l.lastActiveSemesterId&&l.lastActiveSemesterId!==e&&await Es(l.lastActiveSemesterId,e),l.lastActiveSemesterId=e;const n=u("activeSemesterLabel");n&&(n.textContent=((d=l.activeSemesterData)==null?void 0:d.label)||"—");const r=u("activeSemesterUni");r&&(r.textContent=((p=l.activeSemesterData)==null?void 0:p.universityAtThatTime)||"—");const a=u("gr-activeSemLabel");a&&(a.textContent=((m=l.activeSemesterData)==null?void 0:m.label)||"—");const s=Fr((f=l.activeSemesterData)==null?void 0:f.universityAtThatTime),i=u("gr-scaleSel"),o=u("gr-passThreshold");i&&(i.value=s==="UMAYOR"?"MAYOR":"USM",i.disabled=!0),o&&(o.value=s==="UMAYOR"?4:55);const c=u("coursesSection");c&&c.classList.remove("hidden"),zr(s),Re(),qr(),$t(),lt==null||lt(),Le(),Ss(),document.dispatchEvent(new Event("semester:changed"))}function kt(){l.activeSemesterId=null,l.activeSemesterData=null;const e=u("activeSemesterLabel");e&&(e.textContent="—");const t=u("activeSemesterUni");t&&(t.textContent="—");const n=u("coursesSection");n&&n.classList.add("hidden");const r=u("gr-activeSemLabel");r&&(r.textContent="—");const a=u("gr-scaleSel");a&&(a.value="USM",a.disabled=!0);const s=u("gr-passThreshold");s&&(s.value=""),$t(),Le()}function Wl(e){return/^\d{4}-(1|2)$/.test(e||"")}function Jl(){const e=l.profileData;return!e||!e.university?null:e.university==="OTRA"?(e.customUniversity||"").trim()||null:e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function Fr(e){if(!e)return"";const t=e.toLowerCase();return t.includes("mayor")?"UMAYOR":t.includes("utfsm")||t.includes("santa maría")||t.includes("santa maria")?"USM":"OTRA"}async function Kl(){if(!l.currentUser)return;const e=l.currentUser.uid,t=P(C,"users",e,"semesters"),n=await F(t);if(l.semesters=n.docs.map(r=>({id:r.id,...r.data()})),l.activeSemesterId){const r=P(C,"users",e,"semesters",l.activeSemesterId,"courses"),a=await F(r);l.courses=a.docs.map(s=>({id:s.id,...s.data()}))}console.log("📚 preloadCourses:",l.semesters,l.courses)}function zt(){const e=u("saveCourseBtn");e&&e.dataset.bound!=="1"&&(e.dataset.bound="1",e.addEventListener("click",async()=>{var t,n,r,a,s,i;try{if(!l.currentUser)return alert("Debes iniciar sesión.");const o=l.activeSemesterId;if(!o)return alert("No hay semestre activo.");const c=(t=u("courseName"))==null?void 0:t.value.trim();if(!c)return alert("Ingresa el nombre del ramo.");const d={name:c,code:((n=u("courseCode"))==null?void 0:n.value.trim())||"",professor:((r=u("courseProfessor"))==null?void 0:r.value.trim())||"",section:((a=u("courseSectPar"))==null?void 0:a.value.trim())||"",color:((s=u("courseColor"))==null?void 0:s.value)||"#3B82F6",asistencia:!!((i=document.getElementById("courseAsistencia"))!=null&&i.checked),createdAt:Date.now()};await Ee(P(C,"users",l.currentUser.uid,"semesters",o,"courses"),d),Re==null||Re(),console.log("[Courses] ✅ Ramo agregado en",o,d)}catch(o){console.error("❌ Error agregando ramo:",o),alert("No se pudo agregar el ramo. Revisa la consola.")}}))}function Cs(){const e=document.getElementById("coursesList");e&&(e.dataset.bound=Date.now(),e.addEventListener("click",async t=>{const n=t.target;if(!(n instanceof HTMLElement))return;const r=l.activeSemesterId;if(!(!l.currentUser||!r)){if(n.matches(".course-del")){const a=n.dataset.id;if(!a||!confirm("¿Seguro que quieres eliminar este ramo?"))return;try{await fe(N(C,"users",l.currentUser.uid,"semesters",r,"courses",a)),console.log(`[Courses] Ramo eliminado: ${a}`)}catch(s){console.error("❌ Error eliminando ramo:",s),alert("No se pudo eliminar el ramo.")}}if(n.matches(".course-edit")){const a=n.dataset.id;if(!a)return;try{const s=N(C,"users",l.currentUser.uid,"semesters",r,"courses",a),i=await te(s);if(i.exists()){const o=i.data();u("courseName").value=o.name||"",u("courseCode").value=o.code||"",u("courseProfessor").value=o.professor||"",u("courseSectPar").value=o.section||"",u("courseColor").value=o.color||"#3B82F6",u("courseColorCode").textContent=(o.color||"#3B82F6").toUpperCase(),u("courseAsistencia").checked=!!o.asistencia;const c=u("saveCourseBtn"),d=u("cancelEditBtn");d.classList.remove("hidden"),c.textContent="Guardar cambios";const p=u("saveCourseBtn").cloneNode(!1);p.textContent="Guardar cambios",c.replaceWith(p);const m=async()=>{try{const f={name:u("courseName").value.trim(),code:u("courseCode").value.trim(),professor:u("courseProfessor").value.trim(),section:u("courseSectPar").value.trim(),color:u("courseColor").value,asistencia:!!u("courseAsistencia").checked};await ae(s,f),console.log(`[Courses] ✅ Ramo actualizado: ${a}`),Re(),d.classList.add("hidden"),p.textContent="Agregar ramo",zt()}catch(f){console.error("❌ Error actualizando ramo:",f),alert("No se pudo guardar el ramo editado.")}};p.addEventListener("click",m),d.onclick=()=>{Re(),d.classList.add("hidden"),p.textContent="Agregar ramo",zt()},d.onclick=()=>{Re(),d.classList.add("hidden"),newSaveBtn.textContent="Agregar ramo",zt()}}}catch(s){console.error("❌ Error al editar ramo:",s),alert("No se pudo cargar el ramo para editar.")}}}}))}let He=null;function Zl(){He&&(He(),He=null),l.unsubscribeProfile=null}function Xl(e){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const t=/^(\d{2})-(\d{2})$/.exec(e);if(t){const n=t[1];return`2000-${t[2]}-${n}`}return""}async function La(e){const t=await new Promise((r,a)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=a,s.readAsDataURL(e)});return await new Promise((r,a)=>{const s=new Image;s.onload=()=>r(s),s.onerror=a,s.src=t})}function Ma(e,t=256,n=.82){const r=document.createElement("canvas"),a=Math.min(e.width,e.height),s=(e.width-a)/2,i=(e.height-a)/2;return r.width=t,r.height=t,r.getContext("2d").drawImage(e,s,i,a,a,0,0,t,t),r.toDataURL("image/jpeg",n)}function Bt(e){const t=document.getElementById("pfAvatarCircle");t&&(e&&!e.startsWith("emoji:")?(t.textContent="",t.style.backgroundImage=`url("${e}")`):(t.style.backgroundImage="none",t.textContent="👨‍🎓"))}function Ql(e,t){if(e&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const n=/^(\d{2})-(\d{2})$/.exec(t||"");if(n){const r=n[1];return`2000-${n[2]}-${r}`}return null}let mn=null;const Ls={UMAYOR:[{value:"MEDVET",label:"Medicina Veterinaria"}],USM:[{value:"ICTEL",label:"Ing. Civil Telemática"}]};function Jn(e,t,n){if(!e)return;const r=e.querySelector('option[value="OTRA"]');r&&(r.textContent=n&&n.trim()?`${t}: ${n.trim()}`:t)}function Ms(){var c;He&&(He(),He=null);const e=(c=l.currentUser)==null?void 0:c.uid;if(!e)return;const t=N(C,"users",e),n=N(C,"users",e,"profile","profile"),r=(d,p)=>{const m=(d==null?void 0:d.data())||{},f=(p==null?void 0:p.data())||{};l.profileData={...m,...f,name:(f&&"name"in f?f.name:m==null?void 0:m.name)||(m==null?void 0:m.fullName)||(f==null?void 0:f.fullName)||""},delete l.profileData.fullName,m!=null&&m.name&&!l.profileData.name&&(l.profileData.name=m.name),m!=null&&m.fullName&&!l.profileData.name&&(l.profileData.name=m.fullName),f!=null&&f.name&&(l.profileData.name=f.name),f!=null&&f.fullName&&(l.profileData.name=f.fullName),jr(l.profileData),Tn(),Le(),document.dispatchEvent(new Event("profile:changed"))};let a=null,s=null;const i=G(t,d=>{a=d,r(a,s)}),o=G(n,d=>{s=d,r(a,s)});He=()=>{i(),o()},l.unsubscribeProfile=He}function Is(){var i;const e=(o,c="")=>{const d=u(o);d&&(d.value=c)};e("pfName"),e("pfGoogleEmail"),e("pfBirthday"),e("pfFavoriteColor","#22c55e");const t=u("pfColorPreview");t&&(t.style.background="#22c55e");const n=u("pfColorCode");n&&(n.textContent="#22C55E");const r=u("pfUniversity")||u("uniSel");r&&(r.value="");const a=u("pfCareer")||u("careerSel");a&&(a.value="",a.disabled=!0),e("pfEmailUni"),e("pfPhone"),Bt(null);const s=u("pfBirthday");s&&((i=s.dataset)==null||delete i.dirty)}function jr(e){var S;const t=u("pfName");t&&!t.dataset.bound&&(t.addEventListener("input",()=>{t.dataset.dirty="1"}),t.dataset.bound="1");const n=u("pfBirthday"),r=u("pfUniversity")||u("uniSel"),a=u("pfCustomUniWrap"),s=u("pfCustomUniversity");s&&!s.dataset.bound&&(s.addEventListener("input",()=>{s.dataset.dirty="1"}),s.dataset.bound="1");const i=u("pfCareer")||u("careerSel"),o=u("pfFavoriteColor"),c=u("pfColorPreview"),d=u("pfColorCode"),p=u("pfEmailUni")||u("pfEmail");p&&!p.dataset.bound&&(p.addEventListener("input",()=>{p.dataset.dirty="1"}),p.dataset.bound="1");const m=u("pfPhone")||u("pfTelefono");m&&!m.dataset.bound&&(m.addEventListener("input",()=>{m.dataset.dirty="1"}),m.dataset.bound="1");const f=u("pfGoogleEmail"),v=u("pfCancelBtn"),x=(b,w)=>{if(!i)return;i.innerHTML='<option value="">Selecciona tu carrera…</option>';const L=Ls[b]||[];for(const{value:U,label:B}of L){const T=document.createElement("option");T.value=U,T.textContent=B,i.appendChild(T)}const I=document.createElement("option");I.value="OTRA",I.textContent="Otra",i.appendChild(I),i.disabled=!1,w&&i.querySelector(`option[value="${w}"]`)?i.value=w:i.value="",Jn(i,"Otra",e==null?void 0:e.customCareer)};if(v&&!v.dataset.bound&&(v.onclick=()=>{var I,U;const b=l.profileData||null,w=u("pfUniversity")||u("uniSel"),L=u("pfCareer")||u("careerSel");if([u("pfName"),u("pfBirthday"),u("pfFavoriteColor"),u("pfEmailUni")||u("pfEmail"),u("pfPhone")||u("pfTelefono"),u("pfCustomUniversity"),u("pfCustomCareer"),w,L].forEach(B=>{B&&delete B.dataset.dirty}),w){const B=(b==null?void 0:b.university)||"";B==="Universidad Mayor"?w.value="UMAYOR":B==="UTFSM"||B==="USM"?w.value="USM":w.value=B||"",B==="OTRA"&&(w.value="OTRA")}L&&(x((w==null?void 0:w.value)||"",(b==null?void 0:b.career)||null),(b==null?void 0:b.career)==="OTRA"&&(L.value="OTRA")),(I=u("pfCustomUniWrap"))==null||I.classList.toggle("hidden",(w==null?void 0:w.value)!=="OTRA"),(w==null?void 0:w.value)==="OTRA"&&u("pfCustomUniversity")&&(u("pfCustomUniversity").value=(b==null?void 0:b.customUniversity)||""),(U=u("pfCustomCareerWrap"))==null||U.classList.toggle("hidden",(L==null?void 0:L.value)!=="OTRA"),(L==null?void 0:L.value)==="OTRA"&&u("pfCustomCareer")&&(u("pfCustomCareer").value=(b==null?void 0:b.customCareer)||""),jr(b)},v.dataset.bound="1"),f&&((S=l.currentUser)!=null&&S.email)&&(f.value=l.currentUser.email),p){const b=document.activeElement===p,w=p.dataset.dirty==="1";!b&&!w&&(p.value=(e==null?void 0:e.uniEmail)||"")}if(m){const b=document.activeElement===m,w=m.dataset.dirty==="1";!b&&!w&&(m.value=(e==null?void 0:e.phone)||"")}if(t){const b=document.activeElement===t,w=t.dataset.dirty==="1";!b&&!w&&(t.value=(e==null?void 0:e.fullName)||(e==null?void 0:e.name)||"")}if(n){const b=Xl((e==null?void 0:e.birthday)||""),w=document.activeElement===n,L=n.dataset.dirty==="1";!w&&!L&&(n.value=b||"",b?n.setAttribute("value",b):n.removeAttribute("value")),n.dataset.bound||(n.addEventListener("change",I=>{const U=I.target.value||"";n.dataset.dirty="1",n.value=U,U?n.setAttribute("value",U):n.removeAttribute("value"),l.profileData={...l.profileData||{},birthday:U}}),n.addEventListener("paste",I=>I.preventDefault()),n.addEventListener("drop",I=>I.preventDefault()),n.dataset.bound="1")}if(r){const b=document.activeElement===r,w=r.dataset.dirty==="1";if(!b&&!w){const L=(e==null?void 0:e.university)||"";L==="Universidad Mayor"?r.value="UMAYOR":L==="UTFSM"||L==="USM"?r.value="USM":r.value=L,Jn(r,"Otra",e==null?void 0:e.customUniversity)}if(r&&i){const L=document.activeElement===i,I=i.dataset.dirty==="1";!L&&!I&&(x(r.value,(e==null?void 0:e.career)||null),Jn(i,"Otra",e==null?void 0:e.customCareer))}}r&&!r.dataset.bound&&(r.addEventListener("change",()=>{r.dataset.dirty="1"}),r.dataset.bound="1"),a&&a.classList.add("hidden"),s&&(s.value="");const y=(r==null?void 0:r.value)==="OTRA";if(a&&a.classList.toggle("hidden",!y),y&&s&&s){const b=document.activeElement===s,w=s.dataset.dirty==="1";!b&&!w&&(s.value=(e==null?void 0:e.customUniversity)||"")}const h=u("pfCustomCareerWrap"),E=u("pfCustomCareer");E&&!E.dataset.bound&&(E.addEventListener("input",()=>{E.dataset.dirty="1"}),E.dataset.bound="1"),h&&h.classList.add("hidden"),E&&(E.value="");const M=(i==null?void 0:i.value)==="OTRA";if(h&&h.classList.toggle("hidden",!M),M&&E&&E){const b=document.activeElement===E,w=E.dataset.dirty==="1";!b&&!w&&(E.value=(e==null?void 0:e.customCareer)||"")}if(i&&!i.dataset.bound&&(i.addEventListener("change",()=>{i.dataset.dirty="1";const b=i.value==="OTRA";h&&h.classList.toggle("hidden",!b),!b&&E&&(E.value="")}),i.dataset.bound="1"),o){const b=document.activeElement===o,w=o.dataset.dirty==="1";if(!b&&!w){const L=wn(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";o.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}if(r&&(r.onchange=()=>{const b=r.value==="OTRA";a&&a.classList.toggle("hidden",!b),!b&&s&&(s.value=""),x(r.value,null)}),i&&(e==null?void 0:e.career)==="OTRA"&&(e!=null&&e.customCareer)){const b=document.activeElement===i,w=i.dataset.dirty==="1";!b&&!w&&(i.value="OTRA")}if(o){const b=document.activeElement===o,w=o.dataset.dirty==="1";if(!b&&!w){const L=wn(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";o.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}o&&!o.dataset.bound&&(o.addEventListener("input",b=>{const w=b.target.value;o.dataset.dirty="1",wn(w)&&(c&&(c.style.background=w),d&&(d.textContent=w.toUpperCase()))}),o.dataset.bound="1");const $=u("pfAvatarBtn"),A=u("pfAvatarFile");Bt((e==null?void 0:e.avatarData)||"emoji:👨‍🎓");let g=document.getElementById("pfDeleteAvatarBtn");g||(g=document.createElement("button"),g.id="pfDeleteAvatarBtn",g.className="btn btn-secondary",g.textContent="Eliminar foto de perfil",$.insertAdjacentElement("afterend",g)),A&&!A.dataset.bound&&(A.addEventListener("change",async b=>{var L;const w=(L=b.target.files)==null?void 0:L[0];if(w){if(!/^image\//.test(w.type)){alert("Elige una imagen válida.");return}try{const I=await La(w),U=Ma(I,256,.82);if(Bt(U),!l.currentUser)return;await ae(N(C,"users",l.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),$.textContent="Avatar actualizado ✓",setTimeout(()=>$.textContent="Cambiar avatar",1500)}catch(I){console.error(I),alert("No se pudo procesar la imagen.")}finally{b.target.value=""}}}),A.dataset.bound="1"),g.dataset.bound||(g.addEventListener("click",async()=>{if(l.currentUser&&confirm("¿Seguro que deseas eliminar tu foto de perfil?"))try{await ae(N(C,"users",l.currentUser.uid),{avatarData:null,avatarUrl:null,avatarUpdatedAt:Date.now()}),Bt("emoji:👨‍🎓"),alert("Avatar eliminado. Se restauró el emoji predeterminado 👨‍🎓.")}catch(b){console.error(b),alert("No se pudo eliminar el avatar.")}}),g.dataset.bound="1"),A&&!A.dataset.bound&&(A.addEventListener("change",async b=>{var L;const w=(L=b.target.files)==null?void 0:L[0];if(w){if(!/^image\//.test(w.type)){alert("Elige una imagen.");return}try{const I=await La(w),U=Ma(I,256,.82);if(Bt(U),!l.currentUser)return;await ae(N(C,"users",l.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),$&&($.textContent="Avatar actualizado ✓",setTimeout(()=>$.textContent="Cambiar avatar",1500))}catch(I){console.error(I),alert("No se pudo procesar la imagen.")}finally{b.target.value=""}}}),A.dataset.bound="1");const k=u("pfSaveBtn");k&&!k.dataset.bound&&(k.onclick=()=>ks(),k.dataset.bound="1")}async function ks(){var T,O,z,H,D,Y,q,ce,Ne;if(!l.currentUser)return;const e=u("pfUniversity")||u("uniSel"),t=u("pfCareer")||u("careerSel"),n=((e==null?void 0:e.value)||"").trim()||null,r=n&&["UMAYOR","USM","OTRA"].includes(n),a=u("pfCustomUniversity")||u("uniCustom")||null,s=((a==null?void 0:a.value)||"").trim()||null,i=n?r?n:"OTRA":null;let o=null;n?r?n==="OTRA"&&(o=s||((T=l.profileData)==null?void 0:T.customUniversity)||null):o=n:o=null;const c=((t==null?void 0:t.value)||"").trim()||null,d=c&&["MEDVET","ICTEL","OTRA"].includes(c),p=u("pfCustomCareer")||u("careerCustom")||null,m=((p==null?void 0:p.value)||"").trim()||null,f=c?d?c:"OTRA":null;let v=null;c?d?c==="OTRA"&&(v=m||((O=l.profileData)==null?void 0:O.customCareer)||null):v=c:v=null;const x=((z=u("pfFavoriteColor"))==null?void 0:z.value)||null,y=(((H=u("pfEmailUni")||u("pfEmail"))==null?void 0:H.value)||"").trim(),h=(((D=u("pfPhone")||u("pfTelefono"))==null?void 0:D.value)||"").trim(),E=l.currentUser.uid,M=(e==null?void 0:e.value)||null;if(!(!y||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(y))){alert("Email universitario no es válido.");return}if(!(!h||/^[+()\s0-9-]{6,}$/.test(h))){alert("Teléfono no es válido.");return}t&&((Y=Ls[M])!=null&&Y.some(be=>be.value===t.value))&&t.value;const g=((q=u("pfBirthday"))==null?void 0:q.value)||null,k=((ce=l.profileData)==null?void 0:ce.birthday)||null,S=Ql(g,k),w={name:((Ne=u("pfName"))==null?void 0:Ne.value.trim())||null,birthday:S??null,university:i,customUniversity:o,career:f,customCareer:v,favoriteColor:wn(x)?x:null,uniEmail:y||null,phone:h||null,updatedAt:Date.now()},L=N(C,"users",E,"profile","profile");await ye(L,w,{merge:!0}),l.profileData={...l.profileData||{},...w};const I=document.getElementById("pfSaveBtn");if(I){const be=I.textContent;I.textContent="Guardado ✓",I.disabled=!0,setTimeout(()=>{I.textContent=be,I.disabled=!1},1800)}const U=document.getElementById("pfBirthday");U&&delete U.dataset.dirty;const B=u("pfName");B&&delete B.dataset.dirty,["pfEmailUni","pfPhone","pfCustomUniversity","pfCustomCareer"].forEach(be=>{const Tt=u(be);Tt&&delete Tt.dataset.dirty})}function Tn(){var t,n;const e=!!(l.profileData&&l.profileData.university&&(l.profileData.university!=="OTRA"||l.profileData.university==="OTRA"&&((t=l.profileData.customUniversity)!=null&&t.trim())));(n=u("semNoticeNoUni"))==null||n.classList.toggle("hidden",e),u("createSemesterBtn")&&(u("createSemesterBtn").disabled=!e||!l.currentUser),u("semesterLabel")&&(u("semesterLabel").disabled=!e),u("semesterUniFromProfile")&&(u("semesterUniFromProfile").value=e?ec(l.profileData):""),u("createPairBtn")&&(u("createPairBtn").disabled=!l.currentUser)}function ec(e){return!e||!e.university?"":e.university==="OTRA"?e.customUniversity||"Otra":e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function tc(e){return!e||!e.career?"":e.career==="OTRA"?e.customCareer||"Otra":e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career}function wn(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function As(){const e=u("page-perfil");if(!e)return;let t=u("partnerProfileCard");t||(t=document.createElement("div"),t.className="card",t.id="partnerProfileCard",t.innerHTML=`
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
    `,t.classList.add("hidden"),e.appendChild(t));const n=()=>{u("pp-name").innerHTML="<b>Nombre:</b> —",u("pp-uni").innerHTML="<b>Universidad:</b> —",u("pp-career").innerHTML="<b>Carrera:</b> —",u("pp-bday").innerHTML="<b>Fecha de nacimiento:</b> —",u("pp-email").innerHTML="<b>Email universitario:</b> —",u("pp-phone").innerHTML="<b>Teléfono:</b> —",u("pp-color-code").textContent="—";const f=u("pp-color-swatch");f&&(f.style.background="transparent",f.style.border="1px solid rgba(255,255,255,.25)")};if(mn&&(mn(),mn=null),!l.pairOtherUid){n(),t&&t.classList.add("hidden");return}const r=N(C,"users",l.pairOtherUid),a=N(C,"users",l.pairOtherUid,"profile","profile");t.classList.remove("hidden");let s=null,i=null;const o=()=>{const f={...(s==null?void 0:s.data())||{},...(i==null?void 0:i.data())||{}},v=u("pp-avatar");v&&(f.avatarData?(v.style.backgroundImage=`url("${f.avatarData}")`,v.textContent=""):(v.style.backgroundImage="none",v.textContent="👨‍🎓",v.style.display="flex",v.style.alignItems="center",v.style.justifyContent="center",v.style.fontSize="2rem")),u("pp-name").innerHTML=`<b>Nombre:</b> ${f.name||"—"}`,u("pp-uni").innerHTML=`<b>Universidad:</b> ${d(f)}`,u("pp-career").innerHTML=`<b>Carrera:</b> ${tc(f)||"—"}`,u("pp-bday").innerHTML=`<b>Fecha de nacimiento:</b> ${c(f.birthday)}`,u("pp-email").innerHTML=`<b>Email universitario:</b> ${f.uniEmail||"—"}`,u("pp-phone").innerHTML=`<b>Teléfono:</b> ${f.phone||"—"}`;const x=typeof f.favoriteColor=="string"&&/^#[0-9A-Fa-f]{6}$/.test(f.favoriteColor)?f.favoriteColor:"#ff69b4",y=u("pp-color-swatch");y&&(y.style.background=x);const h=u("pp-color-code");h&&(h.textContent=x.toUpperCase())},c=f=>{if(!f)return"—";const v=/^(\d{4})-(\d{2})-(\d{2})$/.exec(f);return v?`${v[3]}/${v[2]}/${v[1]}`:f},d=f=>f!=null&&f.university?f.university==="UMAYOR"?"Universidad Mayor":f.university==="USM"?"UTFSM":f.university==="OTRA"?f.customUniversity||"Otra":f.university:"—",p=G(r,f=>{s=f,o()}),m=G(a,f=>{i=f,o()});mn=()=>{p(),m()}}document.addEventListener("pair:ready",()=>{As()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("uniSel"),t=document.getElementById("careerSel");function n(y,h,E){if(document.getElementById(y))return document.getElementById(y);const M=document.createElement("div");return M.id=y,M.className="modal",M.innerHTML=`
      <div class="modal-content" style="max-width:400px;text-align:center;">
        <h3>${h}</h3>
        <input id="${y}Input" type="text" placeholder="${E}" 
          style="width:100%;margin-top:1rem;padding:.8rem;border-radius:8px;
          border:none;background:rgba(255,255,255,0.1);color:white;">
        <div style="margin-top:1rem;display:flex;justify-content:center;gap:1rem;">
          <button id="${y}Save" class="btn">Guardar</button>
          <button id="${y}Cancel" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>`,document.body.appendChild(M),M}const r=n("uniModal","Agregar nueva universidad","Escribe el nombre..."),a=n("careerModal","Agregar nueva carrera","Escribe el nombre...");function s(y){y.classList.add("active");const h=y.querySelector("input");h.value="",h.focus()}function i(y){y.classList.remove("active")}e&&e.addEventListener("change",()=>{e.value==="OTRA"?s(r):t&&(t.disabled=!1)});const o=r.querySelector("#uniModalSave"),c=r.querySelector("#uniModalCancel"),d=r.querySelector("#uniModalInput");o.addEventListener("click",p),c.addEventListener("click",()=>i(r)),r.addEventListener("click",y=>{y.target===r&&i(r)}),d.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),p())});function p(){const y=d.value.trim();if(!y)return;if(!Array.from(e.options).find(E=>E.value===y)){const E=document.createElement("option");E.value=y,E.textContent=y,e.appendChild(E)}e.value=y,t&&(t.disabled=!1),i(r)}t&&t.addEventListener("change",()=>{t.value==="OTRA"&&s(a)});const m=a.querySelector("#careerModalSave"),f=a.querySelector("#careerModalCancel"),v=a.querySelector("#careerModalInput");m.addEventListener("click",x),f.addEventListener("click",()=>i(a)),a.addEventListener("click",y=>{y.target===a&&i(a)}),v.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),x())});function x(){const y=v.value.trim();if(!y)return;if(!Array.from(t.options).find(E=>E.value===y)){const E=document.createElement("option");E.value=y,E.textContent=y,t.appendChild(E)}t.value=y,i(a)}});const nc=Object.freeze(Object.defineProperty({__proto__:null,clearProfileUI:Is,fillProfileForm:jr,listenProfile:Ms,mountPartnerProfileCard:As,reflectProfileInSemestersUI:Tn,saveProfile:ks,stopProfileListener:Zl},Symbol.toStringTag,{value:"Module"}));function Ia(e){document.querySelectorAll(".nav-tab[data-route]").forEach(t=>{t.dataset.route!=="#/perfil"&&(t.toggleAttribute("disabled",e),t.setAttribute("aria-disabled",String(e)))})}function rc(){if(window.__PartyPlannerAuthInit)return;window.__PartyPlannerAuthInit=!0;const e=u("signInBtn"),t=u("signOutBtn"),n=u("switchAccountBtn"),r=u("userBadge"),a=u("userName"),s=c=>{e&&(e.disabled=c),t&&(t.disabled=c),n&&(n.disabled=c)},i=c=>{r&&(r.classList.remove("hidden"),r.style.display="inline-flex"),e&&(e.classList.add("hidden"),e.style.display="none"),a&&(a.textContent=c||"—");const d=u("createPairBtn"),p=u("copyInviteBtn");d&&(d.disabled=!1),p&&(p.disabled=!1),Ia(!1)},o=()=>{r&&(r.classList.add("hidden"),r.style.display="none"),e&&(e.classList.remove("hidden"),e.style.display="inline-block");const c=u("pairId"),d=u("copyInviteBtn"),p=u("createPairBtn");c&&(c.textContent="—"),d&&(d.disabled=!0),p&&(p.disabled=!0),l.profileData=null,Tn(),kt();const m=u("semestersList");m&&(m.innerHTML=""),Ia(!0),location.hash="#/perfil"};e&&e.addEventListener("click",async()=>{s(!0);const c=new Wr;c.setCustomParameters({prompt:"select_account"});try{await Jr(bt,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Login cancelado por el usuario."):alert(`No se pudo iniciar sesión: ${p||d.message||d}`))}finally{s(!1)}}),n&&n.addEventListener("click",async()=>{s(!0);const c=new Wr;c.setCustomParameters({prompt:"select_account"});try{await Kr(bt),await Jr(bt,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Cambio de cuenta cancelado por el usuario."):alert(`No se pudo cambiar de cuenta: ${p||d.message||d}`))}finally{s(!1)}}),t&&t.addEventListener("click",async()=>{var c;s(!0);try{await Kr(bt),l.currentUser=null,l.profileData=null,(c=l.unsubscribeProfile)==null||c.call(l),l.unsubscribeProfile=null,Wn==null||Wn(),kt(),Is(),o(),Le()}catch(d){console.error(d),alert(`No se pudo cerrar sesión: ${d.code||d.message||d}`)}finally{s(!1)}}),Hs(bt,async c=>{if(s(!1),c){window.__heartbeat||(window.__heartbeat=setInterval(()=>{zn(!0)},2e3)),l.currentUser=c,await zn(!0),i(c.displayName||c.email||c.uid);try{await ac(c)}catch(d){console.error("ensureUserDoc failed:",d)}try{await Kl(),console.log("✅ Semestres y cursos precargados")}catch(d){console.warn("⚠️ Error precargando cursos:",d)}try{Ms(),Tn()}catch(d){console.error("profile listen failed:",d)}setTimeout(()=>{to().catch(d=>console.error("loadMyPair failed:",d))},800),setTimeout(()=>{Ss().catch(d=>console.error("refreshSemestersSub failed:",d))},1500),setTimeout(()=>{de(()=>Promise.resolve().then(()=>nc),void 0,import.meta.url).then(d=>{var p;return(p=d.mountPartnerProfileCard)==null?void 0:p.call(d)}).catch(()=>{})},2500),Le()}else window.__heartbeat&&(clearInterval(window.__heartbeat),window.__heartbeat=null),l.currentUser&&await zn(!1),l.currentUser=null,o(),Le()})}async function ac(e){var r,a,s,i;const t=N(C,"users",e.uid);(await te(t)).exists()?await ye(t,{email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((i=(s=e.providerData)==null?void 0:s[0])==null?void 0:i.providerId)||"google",lastLoginAt:Date.now()},{merge:!0}):await ye(t,{createdAt:Date.now(),email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((a=(r=e.providerData)==null?void 0:r[0])==null?void 0:a.providerId)||"google",preferences:{showNamesInShared:!0,theme:"dark"},lastLoginAt:Date.now()},{merge:!0})}let ne={},gr=[];function $s(e){const t=(e||"#/perfil").trim();return new Set(["#/perfil","#/semestres","#/horario","#/notas","#/malla","#/calendario","#/progreso","#/asistencia","#/party","#/ayuda"]).has(t)?t:"#/perfil"}function sc(e){const t=$s(e);location.hash!==t&&(location.hash=t),vr(t)}function vr(e){const t=$s(e),n=document.getElementById("pfActions");n&&n.classList.toggle("hidden",t!=="#/perfil"),gr.forEach(r=>r.classList.toggle("active",r.dataset.route===t)),Object.values(ne).forEach(r=>r&&r.classList.add("hidden")),t==="#/perfil"&&ne.perfil&&ne.perfil.classList.remove("hidden"),t==="#/semestres"&&ne.semestres&&ne.semestres.classList.remove("hidden"),t==="#/horario"&&ne.horario&&ne.horario.classList.remove("hidden"),t==="#/notas"&&ne.notas&&(ne.notas.classList.remove("hidden"),document.dispatchEvent(new Event("route:notas"))),t==="#/malla"&&ne.malla&&ne.malla.classList.remove("hidden"),t==="#/progreso"&&ne.progreso&&ne.progreso.classList.remove("hidden"),t==="#/calendario"&&ne.calendario&&(ne.calendario.classList.remove("hidden"),document.dispatchEvent(new Event("route:calendario"))),t==="#/asistencia"&&ne.asistencia&&ne.asistencia.classList.remove("hidden"),t==="#/party"&&ne.party&&ne.party.classList.remove("hidden"),t==="#/ayuda"&&ne.ayuda&&ne.ayuda.classList.remove("hidden"),document.dispatchEvent(new CustomEvent("route:change",{detail:{route:t}}))}function oc(){ne={perfil:u("page-perfil"),semestres:u("page-semestres"),horario:u("page-horario"),notas:u("page-notas"),malla:u("page-malla"),calendario:u("page-calendario"),progreso:u("page-progreso"),asistencia:u("page-asistencia"),party:u("page-party"),ayuda:u("page-ayuda")},gr=Array.from(document.querySelectorAll(".tab[data-route]"))||[],gr.forEach(e=>e.addEventListener("click",()=>sc(e.dataset.route))),window.addEventListener("hashchange",()=>vr(location.hash)),vr(location.hash||"#/perfil")}async function ic(){const e=await fetch("data/medvet_malla.csv").then(n=>n.text()).catch(()=>""),t=await fetch("data/ictel_malla.csv").then(n=>n.text()).catch(()=>"");return{MEDVET:e?lc(e):[],ICTEL:t?cc(t):[]}}function Ns(e){const t=e.trim().split(/\r?\n/).filter(Boolean);if(!t.length)return[];const n=t[0],r=n.split(";").length>=n.split(",").length?";":",",a=n.split(r).map(s=>s.trim().replace(/^['\"]|['\"]$/g,""));return t.slice(1).map(s=>{const i=s.split(r).map(c=>c.trim().replace(/^['\"]|['\"]$/g,"")),o={};return a.forEach((c,d)=>o[c]=i[d]??""),o})}function lc(e){return Ns(e).map(n=>{let r=n["Código Asignatura"]||n["Codigo Asignatura"]||"";return r.includes(".")&&(r=r.split(".")[0]),{codigo:r,nivel:(n.Nivel||"").trim()}})}function cc(e){return Ns(e).map(n=>{const r={};for(const[i,o]of Object.entries(n)){const c=i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();r[c]=(o||"").trim()}const a=(...i)=>{for(const o of i){const c=o.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();if(c in r&&r[c])return r[c]}return""};let s=a("Sigla","Código","Codigo","Código Asignatura","Codigo Asignatura");return s||(s=a("Código Asignatura","Codigo Asignatura","Código","Codigo")),{codigo:s||"",nivel:(a("Nivel","Semestre")||"").toUpperCase()}})}function dc(){var n,r;const e=((n=l.profileData)==null?void 0:n.university)||"GEN",t=((r=l.profileData)==null?void 0:r.career)||"GEN";try{return JSON.parse(localStorage.getItem(`mallaAprobados:${e}:${t}`)||"[]")}catch{return[]}}function Kn(e,t){return t?e/t*100:0}function Zn(e){return`${(Math.round(e*10)/10).toFixed(1)}%`}let Oe=null,fn=null;async function uc(){Oe=await ic(),document.addEventListener("profile:changed",et),document.addEventListener("malla:updated",et),document.addEventListener("courses:changed",et),document.addEventListener("pair:ready",et),document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/progreso"&&et()})}async function et(){var o;const e=u("prog-combinado");if(!e)return;e.classList.remove("hidden"),e.innerHTML='<h3 style="margin:0 0 8px">Progreso combinado</h3><div class="muted">Conectando…</div>';const t=((o=l.profileData)==null?void 0:o.career)||null;if(!t||!Oe){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Completa tu perfil antes de ver el progreso. 🌱</div>`;return}const n=Oe&&Oe[t]?Oe[t].length:0,r=dc(),a=n?Kn(r.length,n):0;fn&&(fn(),fn=null);const s=l.pairOtherUid||null;if(!s){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Aún no estás conectado a un dúo. Crea o únete a una party. 👥</div>`;return}const i=N(C,"users",s,"malla","state");fn=G(i,async c=>{const d=c.data()||{};let p=d.career||null;if((p==="UMAYOR"||p==="USM")&&(p=null),!p)try{const x=await te(N(C,"users",s));if(x.exists()){const y=x.data()||{};y.career&&(p=y.career)}}catch{}const m=Array.isArray(d.approved)?d.approved.length:0,f=p&&Oe&&Oe[p]?Oe[p].length:0,v=n+f?Kn(r.length+m,n+f):0;e.innerHTML=`
      <h3 style="margin:0 0 8px">🏁 Progreso combinado</h3>
      <div style="font-weight:600; margin-bottom:4px">Juntos llevan ${Zn(v)}</div>
      <div class="progress-outer small"><div class="progress-inner" style="width:${v}%;"></div></div>
      <div class="muted" style="margin-top:6px">Tú: ${Zn(a)} · Duo: ${Zn(Kn(m,f))}</div>
    `},c=>{e.innerHTML='<div class="muted">Error al conectar con el progreso del dúo.</div>'})}(function(){const t="prog-inline-styles";if(document.getElementById(t))return;const n=document.createElement("style");n.id=t,n.textContent=`
    .progress-outer{background:rgba(255,255,255,.08); border:1px solid rgba(0,0,0,.25);
      border-radius:10px; height:14px; margin-top:8px; overflow:hidden}
    .progress-outer.small{height:10px}
    .progress-inner{height:100%; background:linear-gradient(90deg, var(--primary), var(--accent));}
  `,document.head.appendChild(n)})();document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/party"&&et()});const ka=Object.freeze(Object.defineProperty({__proto__:null,initProgreso:uc,refreshProgreso:et},Symbol.toStringTag,{value:"Module"}));window.addEventListener("DOMContentLoaded",async()=>{await Promise.all([rc(),oc(),eo(),Gl()]);const e=location.hash;e.startsWith("#/malla")?de(()=>import("./malla-D0663ehA.js"),[],import.meta.url).then(t=>{var n;return(n=t.initMallaOnRoute)==null?void 0:n.call(t)}):e.startsWith("#/notas")?de(()=>Promise.resolve().then(()=>Ea),void 0,import.meta.url).then(t=>{var n;return(n=t.initGrades)==null?void 0:n.call(t)}):e.startsWith("#/asistencia")?de(()=>Promise.resolve().then(()=>ba),void 0,import.meta.url).then(t=>{var n;return(n=t.initAttendance)==null?void 0:n.call(t)}):e.startsWith("#/horario")?de(()=>Promise.resolve().then(()=>pa),void 0,import.meta.url).then(t=>{var n;return(n=t.initSchedule)==null?void 0:n.call(t)}):e.startsWith("#/calendario")?de(()=>Promise.resolve().then(()=>va),void 0,import.meta.url).then(t=>{var n;return(n=t.initCalendar)==null?void 0:n.call(t)}):e.startsWith("#/progreso")&&de(()=>Promise.resolve().then(()=>ka),void 0,import.meta.url).then(t=>{var n;return(n=t.initProgreso)==null?void 0:n.call(t)}),document.addEventListener("route:change",async t=>{var r,a,s,i,o,c;const n=t.detail.route;if(n.startsWith("#/notas")){const d=await de(()=>Promise.resolve().then(()=>Ea),void 0,import.meta.url);(r=d.initGrades)==null||r.call(d)}else if(n.startsWith("#/malla")){const d=await de(()=>import("./malla-D0663ehA.js"),[],import.meta.url);(a=d.initMallaOnRoute)==null||a.call(d)}else if(n.startsWith("#/asistencia")){const d=await de(()=>Promise.resolve().then(()=>ba),void 0,import.meta.url);(s=d.initAttendance)==null||s.call(d)}else if(n.startsWith("#/horario")){const d=await de(()=>Promise.resolve().then(()=>pa),void 0,import.meta.url);(i=d.initSchedule)==null||i.call(d)}else if(n.startsWith("#/calendario")){const d=await de(()=>Promise.resolve().then(()=>va),void 0,import.meta.url);(o=d.initCalendar)==null||o.call(d)}else if(n.startsWith("#/progreso")){const d=await de(()=>Promise.resolve().then(()=>ka),void 0,import.meta.url);(c=d.initProgreso)==null||c.call(d)}})});export{u as $,C as d,l as s};
