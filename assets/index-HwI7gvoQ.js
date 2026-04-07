import{getApps as Bs,getApp as Rs,initializeApp as Os}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";import{getAuth as Hs,setPersistence as Fs,browserLocalPersistence as zs,GoogleAuthProvider as Zr,signInWithPopup as Xr,signOut as Qr,onAuthStateChanged as qs}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";import{initializeFirestore as js,persistentLocalCache as Ys,updateDoc as ae,doc as N,query as X,collection as P,getDocs as q,setDoc as ye,arrayRemove as wr,getDoc as te,deleteDoc as fe,onSnapshot as Y,arrayUnion as Gs,orderBy as be,addDoc as Ee,where as Ta,serverTimestamp as Ua,Timestamp as Vs}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";import Ws from"https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm";import{jsPDF as Js}from"https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const Ks="modulepreload",Zs=function(e,t){return new URL(e,t).href},ea={},de=function(t,n,r){let a=Promise.resolve();if(n&&n.length>0){const l=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),c=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=Promise.allSettled(n.map(d=>{if(d=Zs(d,r),d in ea)return;ea[d]=!0;const p=d.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(!!r)for(let x=l.length-1;x>=0;x--){const y=l[x];if(y.href===d&&(!p||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":Ks,p||(v.as="script"),v.crossOrigin="",v.href=d,c&&v.setAttribute("nonce",c),document.head.appendChild(v),p)return new Promise((x,y)=>{v.addEventListener("load",x),v.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(l){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l}return a.then(l=>{for(const i of l||[])i.status==="rejected"&&s(i.reason);return t().catch(s)})},Xs={apiKey:"AIzaSyB45g_2KRGlXH0iAPyBGuCnrFkhxCHadKs",authDomain:"nacholo.firebaseapp.com",projectId:"nacholo",storageBucket:"nacholo.appspot.com",messagingSenderId:"924503328068",appId:"1:924503328068:web:1f753ced7f47ec36750311"},Pa=Bs().length?Rs():Os(Xs),C=js(Pa,{localCache:Ys()}),ht=Hs(Pa);Fs(ht,zs).catch(()=>{});const o={currentUser:null,currentPartyId:null,partyMembers:[],partyProfiles:{},profileData:null,activeSemesterId:null,activeSemesterData:null,unsubscribeCourses:null,editingCourseId:null,shared:{horario:{semId:null},notas:{semId:null},malla:{enabled:!1},calendar:{semId:null}},DEBUG:(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(new URLSearchParams(location.search).has("debug")||((window==null?void 0:window.PartyPlannerDebug)??!1))},u=e=>typeof e=="string"?document.getElementById(e):null;function Le(){var t;if(!o.DEBUG)return;const e=u("state");e&&(e.textContent=JSON.stringify({uid:((t=o.currentUser)==null?void 0:t.uid)||null,partyId:o.currentPartyId,members:o.partyMembers,profileData:o.profileData,activeSemesterId:o.activeSemesterId,editingCourseId:o.editingCourseId},null,2))}function nn(e,t){e&&(t?e.classList.add("hidden"):e.classList.remove("hidden"))}window.__state=o;let nt=null,Ge={};function Dn(){const e={members:o.partyMembers};document.dispatchEvent(new CustomEvent("party:ready",{detail:e})),document.dispatchEvent(new CustomEvent("party:changed",{detail:e})),Sr()}function Qs(e){return e.university?e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university==="OTRA"?e.customUniversity||"Otra":e.university:"—"}function eo(e){return e.career?e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career==="OTRA"?e.customCareer||"Otra":e.career:"—"}function to(e){if(!e)return"—";const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?`${t[3]}/${t[2]}/${t[1]}`:e}function no(e,t){const n=e.name||e.fullName||"Usuario",r=Qs(e),a=eo(e),s=to(e.birthday),l=e.uniEmail||"—",i=e.phone||"—",c=e.favoriteColor||"#6366f1",d=e.avatarData?`<div class="party-member-icon" 
         style="background-image:url('${e.avatarData}');
                background-size:cover;background-position:center">
       </div>`:`<div class="party-member-icon" style="background:${c}">
         ${n.charAt(0).toUpperCase()}
       </div>`,p=o.partyMembers[0],m=o.currentUser.uid===p,f=t===p,v=m&&!f?`<button class="kick-btn" data-kick="${t}">Quitar</button>`:"",x=m&&!f?`<button class="transfer-btn" data-transfer="${t}">👑 Transferir host</button>`:"",y=e.lastOnline||0,E=Date.now()-y<3e3;return`
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
        <div class="muted"><b>Email:</b> ${l}</div>
        <div class="muted"><b>Tel:</b> ${i}</div>

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
  `}async function Sr(){const e=u("partyMembersList");if(!e)return;if(!o.currentPartyId){e.innerHTML='<p class="muted">No estás en ninguna party.</p>';return}if(!o.partyMembers.length){e.innerHTML='<p class="muted">Aún no hay miembros en esta party.</p>';return}let t="";for(const n of o.partyMembers){const r=o.partyProfiles[n]||{};t+=no(r,n)}e.innerHTML=t,o.currentUser.uid,o.partyMembers[0],document.querySelectorAll(".kick-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.kick;if(!confirm("¿Quieres quitar a este miembro de la party?"))return;const a=N(C,"pairs",o.currentPartyId);await ae(a,{members:wr(r)}),showToast("Miembro eliminado","success")})}),document.querySelectorAll(".transfer-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.transfer;if(!confirm("¿Quieres transferir el host a este miembro?"))return;const a=N(C,"pairs",o.currentPartyId),l=[...o.partyMembers].filter(c=>c!==r),i=[r,...l];await ae(a,{members:i}),showToast("Host transferido","success")})})}function ro(){var i,c,d,p,m,f;(i=u("createPairBtn"))==null||i.addEventListener("click",so),(c=u("copyInviteBtn"))==null||c.addEventListener("click",lo);const e=async()=>{var y;const v=(((y=u("joinCode"))==null?void 0:y.value)||"").trim(),x=co(v);x?await oo(x):alert("Pega un ID válido de party."),u("joinCode").value=""};(d=u("joinByCodeBtn"))==null||d.addEventListener("click",e),(p=u("joinCode"))==null||p.addEventListener("keydown",v=>{v.key==="Enter"&&e()});const t=u("leavePartyModal"),n=u("leavePartyConfirm"),r=u("leavePartyCancel");(m=u("deletePairBtn"))==null||m.addEventListener("click",()=>{if(!o.currentPartyId){alert("No estás en ninguna party.");return}t==null||t.classList.add("active")}),r==null||r.addEventListener("click",()=>{t==null||t.classList.remove("active")}),n==null||n.addEventListener("click",async()=>{t==null||t.classList.remove("active"),await io()});const a=u("closePartyModal"),s=u("closePartyConfirm"),l=u("closePartyCancel");(f=u("closePartyBtn"))==null||f.addEventListener("click",()=>{const v=o.partyMembers[0];if(o.currentUser.uid!==v){showToast("Solo el host puede cerrar la party","error");return}a.classList.add("active")}),l==null||l.addEventListener("click",()=>{a.classList.remove("active")}),s==null||s.addEventListener("click",async()=>{a.classList.remove("active"),await mo()})}async function ao(){if(!o.currentUser)return;const e=X(P(C,"pairs")),t=await q(e),n=[];t.forEach(a=>{const s=a.data()||{};Array.isArray(s.members)&&s.members.includes(o.currentUser.uid)&&n.push({id:a.id,...s})}),n.sort((a,s)=>Number(s.createdAt)-Number(a.createdAt));const r=n[0]||null;o.currentPartyId=(r==null?void 0:r.id)||null,o.partyMembers=(r==null?void 0:r.members)||[],_n(),Zt(),u("pairId").textContent=o.currentPartyId||"—",u("copyInviteBtn").disabled=!o.currentPartyId,Le(),Dn(),Er(o.currentPartyId)}async function so(){if(!o.currentUser)return;const e=N(P(C,"pairs"));await ye(e,{members:[o.currentUser.uid],createdAt:Date.now()}),await Da(e.id),o.currentPartyId=e.id,o.partyMembers=[o.currentUser.uid],_n(),Zt(),u("pairId").textContent=e.id,u("copyInviteBtn").disabled=!1,Le(),Dn(),Er(e.id)}async function oo(e){if(!o.currentUser)return;const t=N(C,"pairs",e),n=await te(t);if(!n.exists())return alert("La party no existe.");const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(o.currentUser.uid)&&a.length>=5){alert("Esta party ya tiene 5 miembros.");return}a.includes(o.currentUser.uid)||await ae(t,{members:Gs(o.currentUser.uid)}),await Da(e);const l=(await te(t)).data()||{};o.currentPartyId=e,o.partyMembers=l.members||[],_n(),Zt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,Le(),Dn(),Er(e)}function Er(e){if(nt&&(nt(),nt=null),!e)return;const t=N(C,"pairs",e);nt=Y(t,n=>{if(!n.exists()){Cn();return}const r=n.data()||{},a=Array.isArray(r.members)?r.members:[];if(!a.includes(o.currentUser.uid)){Cn(),showToast("Has sido eliminado de la party","error");return}po(a),a.forEach(s=>uo(s)),o.currentPartyId=e,o.partyMembers=a,_n(),Zt(),u("pairId").textContent=e,u("copyInviteBtn").disabled=!1,Le(),Sr()})}async function io(){if(!o.currentUser||!o.currentPartyId)return;const e=o.currentPartyId,t=N(C,"pairs",e);await ae(t,{members:wr(o.currentUser.uid)});const n=await te(t);if((n.exists()?n.data().members||[]:[]).length===0)try{await fe(t)}catch{}Cn()}function Cn(){nt&&(nt(),nt=null);for(const t in Ge){try{Ge[t]()}catch{}delete Ge[t]}o.currentPartyId=null,o.partyMembers=[],o.partyProfiles={},u("pairId").textContent="—",u("copyInviteBtn").disabled=!0,u("closePartyBtn").style.display="none";const e=u("partyMembersList");e&&(e.innerHTML='<p class="muted">Aún no estás en ninguna party.</p>'),Zt(),Le(),Dn()}async function Da(e){const t=X(P(C,"pairs")),n=await q(t),r=o.currentUser.uid,a=[];n.forEach(s=>{const l=s.data()||{};s.id!==e&&Array.isArray(l.members)&&l.members.includes(r)&&a.push(ae(N(C,"pairs",s.id),{members:wr(r)}))}),await Promise.all(a)}async function lo(){if(o.currentPartyId)try{await navigator.clipboard.writeText(o.currentPartyId);const e=u("copyInviteBtn");e.textContent="¡Copiado!",setTimeout(()=>e.textContent="📋 Copiar ID",1200)}catch{alert("No se pudo copiar el ID.")}}function co(e){if(!e)return"";const t=String(e).trim();try{const a=new URL(t).searchParams.get("pair");if(a)return a.trim()}catch{}const n=t.match(/[?&]pair=([A-Za-z0-9_-]+)/);return n?n[1]:t.replace(/[^A-Za-z0-9_-]/g,"")}function uo(e){if(Ge[e])return;const t=N(C,"users",e),n=N(C,"users",e,"profile","profile");let r={},a={};const s=()=>{const i={...r,...a};"isOnline"in r&&(i.isOnline=r.isOnline),"lastOnline"in r&&(i.lastOnline=r.lastOnline),o.partyProfiles[e]=i,Sr()},l=[];l.push(Y(t,i=>{r=i.exists()?i.data()||{}:{},s()})),l.push(Y(n,i=>{a=i.exists()?i.data()||{}:{},s()})),Ge[e]=()=>l.forEach(i=>i())}function po(e){for(const t in Ge)e.includes(t)||(Ge[t](),delete Ge[t])}async function mo(){if(!o.currentUser||!o.currentPartyId)return;const e=o.currentPartyId,t=o.partyMembers[0];if(o.currentUser.uid!==t){showToast("Solo el host puede cerrar la party","error");return}try{await fe(N(C,"pairs",e)),showToast("Party cerrada","success")}catch{showToast("Error al cerrar la party","error")}u("closePartyBtn").style.display="none",Cn()}function _n(){const e=u("closePartyBtn");if(!e)return;if(!o.currentPartyId||o.partyMembers.length===0){e.style.display="none";return}const t=o.currentUser.uid===o.partyMembers[0];e.style.display=t?"inline-flex":"none"}function Zt(){const e=u("partyCount");if(e){if(!o.currentPartyId){e.textContent="0/5";return}e.textContent=`${o.partyMembers.length}/5`}}async function jn(e){if(o.currentUser)try{await ae(N(C,"users",o.currentUser.uid),{isOnline:e,lastOnline:Date.now()})}catch(t){console.warn("No se pudo actualizar estado online:",t)}}function rn(e,t,n,r){if(!e)return;const a=`bound_${r||t}`;e.dataset[a]!=="1"&&(e.addEventListener(t,n),e.dataset[a]="1")}function _a(e){return(e||"").replace(/[^\w\s.-]+/g,"").replace(/\s+/g,"_")||"export"}function ta(){var e;return((e=o.activeSemesterData)==null?void 0:e.label)||"semestre"}async function Ba(e,t=2){const n=e.style.backgroundColor;n||(e.style.backgroundColor=getComputedStyle(document.body).backgroundColor||"#111");const r=await Ws(e,{scale:t,backgroundColor:null,useCORS:!0,allowTaint:!0,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight});return n||(e.style.backgroundColor=""),r}async function na(e,t){try{const n=await Ba(e,2),r=document.createElement("a");r.href=n.toDataURL("image/png"),r.download=`${_a(t)}.png`,r.click()}catch(n){console.error("[exportNodeAsPNG]",n)}}async function ra(e,t){try{const n=await Ba(e,2),r=n.toDataURL("image/png"),a=n.width,s=n.height,l=a>=s?"l":"p",i=new Js({unit:"pt",format:"a4",orientation:l}),c=i.internal.pageSize.getWidth(),d=i.internal.pageSize.getHeight(),p=Math.min(c/a,d/s),m=a*p,f=s*p;i.addImage(r,"PNG",(c-m)/2,(d-f)/2,m,f),i.save(`${_a(t)}.pdf`)}catch(n){console.error("[exportNodeAsPDF]",n)}}function fo(){const e=u("btn-export-malla-png"),t=u("btn-export-malla-pdf");if(e||t){const a=document.querySelector("#page-malla .malla-wrapper")||u("page-malla"),s=`malla_${ta()}`;rn(e,"click",()=>na(a,s),"malla_png"),rn(t,"click",()=>ra(a,s),"malla_pdf")}const n=u("btn-export-horario-png"),r=u("btn-export-horario-pdf");if(n||r){const a=document.querySelector("#horarioCombinado:not(.hidden)")||document.querySelector("#schedUSM")||u("horarioPropio")||u("page-horario"),s=`horario_${ta()}`;rn(n,"click",()=>na(a,s),"horario_png"),rn(r,"click",()=>ra(a,s),"horario_pdf")}}let Ce=!1,Ln="",Ra="",Be=!1,an=null,Ie=null;const kn=new Map,J=new Map;let re=[],K=[];const V=new Map;let Qe=!1,pe=null,er=!1,Oa="#22c55e",yo="#ff69b4",aa=!1,sn=null,on=null,ln=null,wt=[],Fe=[],St=null,ze="USM",le={};const qe=new Map,tr=new Map;let Yn=null;function Cr(){const e={};for(const[n,r]of(J||new Map).entries())e[n]=r||[];const t={};for(const[n,r]of(V||new Map).entries())t[n]=r;return JSON.stringify({slots:pe||null,items:K||[],courses:re||[],defs:e,selected:t})}function Ha(){if(!Ie)return!1;try{return Cr()!==Ie}catch{return!0}}function Bt(){Yn||(Yn=requestAnimationFrame(()=>{Yn=null,["schedPartyBusyCombined","schedPartyBusy"].filter(n=>document.getElementById(n)).forEach(n=>lr(n)),["busyLegendCombined","busyLegend"].filter(n=>document.getElementById(n)).forEach(n=>bn(n))}))}let Ht=!1,Lt=null;const bt=80,sa=28;let De=[],nr=[];const $e=["Lun","Mar","Mié","Jue","Vie"];function go(e){if(!Ht)return;const t=e.clientY,n=window.innerHeight;let r=0;if(t<bt){const a=(bt-t)/bt;r=-Math.ceil(sa*a)}else if(t>n-bt){const a=(t-(n-bt))/bt;r=Math.ceil(sa*a)}r!==0&&Lt===null&&(Lt=requestAnimationFrame(()=>{window.scrollBy(0,r),Lt=null}))}function oa(){Ht=!1,Lt&&(cancelAnimationFrame(Lt),Lt=null)}let ge={};const mt=[{label:"1/2",start:"08:15",end:"09:25",lines:[{n:"1",start:"08:15",end:"08:50"},{n:"2",start:"08:50",end:"09:25"}]},{label:"3/4",start:"09:40",end:"10:50",lines:[{n:"3",start:"09:40",end:"10:15"},{n:"4",start:"10:15",end:"10:50"}]},{label:"5/6",start:"11:05",end:"12:15",lines:[{n:"5",start:"11:05",end:"11:40"},{n:"6",start:"11:40",end:"12:15"}]},{label:"7/8",start:"12:30",end:"13:40",lines:[{n:"7",start:"12:30",end:"13:05"},{n:"8",start:"13:05",end:"13:40"}]},{label:"ALMUERZO",start:"13:40",end:"14:40",lunch:!0},{label:"9/10",start:"14:40",end:"15:50",lines:[{n:"9",start:"14:40",end:"15:15"},{n:"10",start:"15:15",end:"15:50"}]},{label:"11/12",start:"16:05",end:"17:15",lines:[{n:"11",start:"16:05",end:"16:40"},{n:"12",start:"16:40",end:"17:15"}]},{label:"13/14",start:"17:30",end:"18:40",lines:[{n:"13",start:"17:30",end:"18:05"},{n:"14",start:"18:05",end:"18:40"}]},{label:"15/16",start:"18:55",end:"20:05",lines:[{n:"15",start:"18:55",end:"19:30"},{n:"16",start:"19:30",end:"20:05"}]},{label:"17/18",start:"20:20",end:"21:30",lines:[{n:"17",start:"20:20",end:"20:55"},{n:"18",start:"20:55",end:"21:30"}]},{label:"19/20",start:"21:45",end:"22:55",lines:[{n:"19",start:"21:45",end:"22:20"},{n:"20",start:"22:20",end:"22:55"}]}],Xt=[Ue("1/2","08:30","09:40",["08:30-09:05","09:05-09:40"]),Ue("3/4","10:00","11:10",["10:00-10:35","10:35-11:10"]),Ue("5/6","11:30","12:40",["11:30-12:05","12:05-12:40"]),{label:"ALMUERZO",start:"12:40",end:"14:00",lunch:!0},Ue("7/8","14:00","15:10",["14:00-14:35","14:35-15:10"]),Ue("9/10","15:30","16:40",["15:30-16:05","16:05-16:40"]),Ue("11/12","17:00","18:10",["17:00-17:35","17:35-18:10"]),Ue("13/14","18:30","19:40",["18:30-19:05","19:05-19:40"]),Ue("15/16","20:00","21:10",["20:00-20:35","20:35-21:10"]),Ue("17/18","21:30","22:40",["21:30-22:05","22:05-22:40"])];function Ue(e,t,n,r){return{label:e,start:t,end:n,lines:r.map(a=>{const[s,l]=a.split("-");return{start:s,end:l}})}}function Fa(e){return String(e||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g," ")}function vo(e){return Fa(e).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function za(e){const t=Fa(e);return t?t==="umayor"||t.includes("mayor")?"UMAYOR":t==="usm"||t.includes("utfsm")||t.includes("u t f s m")||t.includes("u.t.f.s.m")||t.includes("federico santa maria")||t.includes("santa maria")?"USM":`UNI_${vo(t)||"desconocida"}`:""}function ft(){var t,n;const e=((t=o.activeSemesterData)==null?void 0:t.universityAtThatTime)||((n=o.profileData)==null?void 0:n.university)||"";return za(e)}async function yt(){var r,a;const e=ft();if(ge[e]&&Array.isArray(ge[e])&&ge[e].length)return ge[e];if(o.currentUser){const s=N(C,"users",o.currentUser.uid,"custom_schedules",e),l=await te(s);if(l.exists()){const i=((r=l.data())==null?void 0:r.slots)||[];if(Array.isArray(i)&&i.length)return ge[e]=i,i}}const t=`custom_slots_${e}_${(a=o.currentUser)==null?void 0:a.uid}`,n=localStorage.getItem(t);if(n)try{const s=JSON.parse(n);if(Array.isArray(s)&&s.length)return ge[e]=s,s}catch{}return e==="UMAYOR"?Xt:e==="USM"?mt:null}function Nt(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Lr(e,t,n){const r=(e||[]).find(a=>a.id===t);return Nt(r==null?void 0:r.color)?r.color:n||"#3B82F6"}function kr(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}let cn=null,ie=[];function dt(){const e=document.getElementById("simPaletteHost");if(!e)return;si(),e.innerHTML="";const t=Ce?Array.isArray(re)?re:[]:Array.isArray(o.courses)?o.courses:[];if(!t.length){const a=document.createElement("button");a.type="button",a.className="palette-rect",a.textContent="+ Agregar ramo",a.style.cursor="pointer",a.style.borderStyle="dashed",a.addEventListener("click",async()=>{if(!o.currentUser||!o.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await ar(o.activeSemesterId,{forceFirestore:!1})}),e.appendChild(a);return}ri(t).forEach(a=>{var v;const s=document.createElement("div");s.className="sim-course-group",s.dataset.courseId=a.id;const l=Nt(a.color)?a.color:"#3B82F6",i=J.get(a.id)||[],c=V.get(a.id)||((v=i[0])==null?void 0:v.pid)||null;c&&i.find(x=>x.pid===c);const d=a.name,p=document.createElement("div");p.className="palette-rect",p.setAttribute("draggable","true"),p.dataset.payload=JSON.stringify({type:"course-parallel",courseId:a.id,pid:c}),p.style.borderColor=l,p.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)";const m=document.createElement("div");m.className="label",m.textContent=d,p.appendChild(m);const f=document.createElement("button");f.type="button",f.className="add-par",f.textContent="▾",f.setAttribute("aria-label","Paralelos"),f.addEventListener("click",x=>{x.stopPropagation(),Co(a,f)}),p.appendChild(f),s.appendChild(p),e.appendChild(s)});const r=document.createElement("button");r.type="button",r.className="palette-rect",r.textContent="+ Agregar ramo",r.style.cursor="pointer",r.style.borderStyle="dashed",r.style.opacity="0.95",r.addEventListener("click",async()=>{if(!o.currentUser||!o.activeSemesterId){alert("No hay semestre activo para agregar ramos.");return}await ar(o.activeSemesterId,{forceFirestore:!1})}),e.appendChild(r),ai()}let rt=null;function bo(){if(document.getElementById("simParMenuStyles"))return;const e=document.createElement("style");e.id="simParMenuStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function ho(){if(document.getElementById("parEditDnDStyles"))return;const e=document.createElement("style");e.id="parEditDnDStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function xo(){rt&&(rt.remove(),rt=null)}function wo(){if(document.getElementById("parEditModal"))return;const e=document.createElement("div");e.id="parEditModal",e.style.cssText=`position:fixed; inset:0; display:none; align-items:center; justify-content:center;
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
    `,document.body.appendChild(e);const t=()=>e.style.display="none";document.getElementById("parEditX").addEventListener("click",t),document.getElementById("parEditCancel").addEventListener("click",t),e.addEventListener("click",n=>{n.target===e&&t()})}async function Gn(e,t){wo();const n=document.getElementById("parEditModal"),r=document.getElementById("parEditTitle"),a=document.getElementById("parEditProf"),s=document.getElementById("parEditSec"),l=document.getElementById("parEditChip"),i=document.getElementById("parEditGrid"),c=document.getElementById("parEditSave"),d=document.getElementById("parEditCancel"),p=document.getElementById("parEditX"),m=e.id,f=J.get(m)||[],v=b=>JSON.parse(JSON.stringify(b||{})),y=t?(b=>f.find(w=>w.pid===b)||null)(t):null;let h,E=!1;if(y)h=v(y);else{E=!0;const b=f.length+1;h={courseId:m,pid:`P${b}`,professor:"",section:"",blocks:[]}}a.value=h.professor||"",s.value=h.section||h.pid||"";const k=()=>{const b=(s.value||"").trim()||h.pid;r.textContent=`${e.name} · ${b}`;const w=l.querySelector(".drag-txt");w?w.textContent=`${e.name} · ${b}`:l.textContent=`${e.name} · ${b}`};l.dataset.payload=JSON.stringify({type:"parallel-template",courseId:m,pid:h.pid}),l.style.borderRadius="999px",l.style.padding="10px 14px",l.style.display="inline-flex",l.style.alignItems="center",l.style.gap="10px",l.style.fontWeight="900",l.style.borderWidth="2px",l.style.boxShadow="0 12px 26px rgba(0,0,0,.28), inset 0 0 0 2px rgba(255,255,255,.06)",l.style.userSelect="none",l.querySelector(".drag-ico")||(l.innerHTML=`<span class="drag-ico" style="
          width:28px;height:28px;border-radius:999px;
          display:inline-flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.16);
          font-size:14px;
        ">⠿</span>
        <span class="drag-txt" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:520px;"></span>`),s.oninput=k,k(),await rr(i,h),ho(),n.style.display="flex";const $=()=>{c.onclick=null,d.onclick=null,p.onclick=null,n.onclick=null,document.removeEventListener("keydown",S)},A=()=>{$(),n.style.display="none"},g=()=>{A()},M=b=>{b.target===n&&g()},S=b=>{n.style.display==="flex"&&b.key==="Escape"&&(b.preventDefault(),g())};p.onclick=g,d.onclick=g,n.onclick=M,document.addEventListener("keydown",S),c.onclick=async()=>{if(h.professor=(a.value||"").trim(),h.section=(s.value||"").trim(),E){const b=[...f,h];J.set(m,b)}else y.professor=h.professor,y.section=h.section,y.blocks=v(h.blocks),J.set(m,f);Tr(),Me(),dt(),A(),Ce&&V.get(m)===h.pid&&await cr(m,h.pid)}}async function rr(e,t){const n=ft(),r=pe||await yt();if(!r){e.innerHTML='<div class="muted">No hay slots definidos.</div>';return}const a=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${a}</div>
        ${$e.map(s=>`<div class="cell header">${s}</div>`).join("")}

        ${r.map((s,l)=>`
          <div class="cell mod ${s.lunch?"lunch":""}" data-slot="${l}">
            ${Rn(s,l,n)}
          </div>
          ${$e.map((i,c)=>`
            <div class="cell slot ${s.lunch?"is-lunch":""}"
                data-day="${c}" data-slot="${l}"
                ${s.lunch?'aria-disabled="true"':""}
                style="${s.lunch?"pointer-events:none; opacity:.65;":""}">
              ${So(t,c,l)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `,e.querySelectorAll(".par-placed").forEach(s=>{s.addEventListener("dragstart",i=>{const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10);i.dataTransfer.setData("text/plain",JSON.stringify({type:"move-par-block",courseId:t.courseId,pid:t.pid,from:{day:c,slot:d}})),i.dataTransfer.effectAllowed="move"});const l=s.querySelector(".par-x");l&&l.addEventListener("click",i=>{i.stopPropagation();const c=parseInt(s.dataset.day,10),d=parseInt(s.dataset.slot,10),p=t.blocks.findIndex(m=>m.day===c&&m.slot===d);p>=0&&t.blocks.splice(p,1),rr(e,t)})}),e.querySelectorAll(".cell.slot").forEach(s=>{s.classList.contains("is-lunch")||(s.addEventListener("dragover",l=>{l.preventDefault();const i=s.getBoundingClientRect(),c=l.clientY-i.top,d=i.height/2;let p="full";c<d-10?p="top":c>d+10&&(p="bottom"),s.dataset.droppos=p,s.classList.add("over"),s.classList.remove("hint-top","hint-full","hint-bottom"),s.classList.add(p==="top"?"hint-top":p==="bottom"?"hint-bottom":"hint-full")}),s.addEventListener("dragleave",()=>{s.classList.remove("over","hint-top","hint-full","hint-bottom"),delete s.dataset.droppos}),s.addEventListener("drop",l=>{l.preventDefault(),s.classList.remove("over","hint-top","hint-full","hint-bottom");const i=l.dataTransfer.getData("text/plain");let c=null;try{c=JSON.parse(i)}catch{}const d=parseInt(s.dataset.day,10),p=parseInt(s.dataset.slot,10),m=s.dataset.droppos||"full";if(!c||c.type!=="parallel-template")return;const f=r==null?void 0:r[p];if(!f||f.lunch)return;const v=t.blocks.findIndex(x=>x.day===d&&x.slot===p);v>=0?t.blocks.splice(v,1):t.blocks.push({day:d,slot:p,pos:m,hpos:"single",start:f.start,end:f.end}),rr(e,t)}))})}function So(e,t,n){const r=(e.blocks||[]).filter(s=>s.day===t&&s.slot===n);if(!r.length)return"";const a=s=>s==="top"?"pos-top":s==="bottom"?"pos-bottom":"pos-full";return r.map(s=>`
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
    `).join("")}async function Eo(e,t){var c;if(!o.currentUser||!o.activeSemesterId)return;const r=(J.get(e)||[]).find(d=>d.pid===t);if(!r)return;const a=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule"),l=(await q(a)).docs.filter(d=>{var p;return((p=d.data())==null?void 0:p.courseId)===e});for(const d of l)await fe(d.ref);const i=await yt();for(const d of r.blocks){const p=i==null?void 0:i[d.slot];!p||p.lunch||await Ee(a,{courseId:e,day:d.day,slot:d.slot,start:p.start,end:p.end,pos:d.pos||"full",hpos:d.hpos||"single",parallelPid:t,displayName:`${((c=o.courses.find(m=>m.id===e))==null?void 0:c.name)||"Ramo"} · ${r.section||t}`,createdAt:Date.now()})}V.set(e,t)}async function ia(e){if(!o.currentUser||!o.activeSemesterId)return;const t=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule"),r=(await q(t)).docs.filter(a=>{var s;return((s=a.data())==null?void 0:s.courseId)===e});for(const a of r)await fe(a.ref)}function Co(e,t){var g,M;bo(),xo();const n=document.createElement("div");n.className="sim-par-menu";const r=e.id,a=J.get(r)||[],s=(ie||[]).some(S=>S.courseId===r),l=V.has(r),i=s||l;n.innerHTML=`
    <div class="head">
      <div class="title">Paralelos de ${Ae(e.name||"Ramo")}</div>
      <div style="display:flex; gap:8px;">
        <button id="simClearFromScheduleBtn"
          class="broombtn danger"
          type="button"
          title="Sacar del horario (mantener en pool)"
          aria-label="Sacar del horario"
          ${i?"":"disabled"}
          style="${i?"":"opacity:.35; cursor:not-allowed;"}"
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
  `,document.body.appendChild(n),rt=n;const c=()=>{document.removeEventListener("pointerdown",p,{capture:!0}),document.removeEventListener("keydown",m),window.removeEventListener("scroll",f,!0),window.removeEventListener("resize",v)},d=()=>{rt&&(rt.remove(),rt=null),c()},p=S=>{!n.contains(S.target)&&!t.contains(S.target)&&d()},m=S=>{S.key==="Escape"&&d()},f=()=>d(),v=()=>d(),x=n.querySelector(".list");if(a.length)a.forEach(S=>{var B;const b=document.createElement("div");b.className="item",b.style.cursor="default";const w=V.get(r)===S.pid;b.innerHTML=`
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
  `;const L=b.querySelector(".iconbtn:not(.danger)"),I=b.querySelector(".iconbtn.danger");b.querySelector(".pickbox").addEventListener("click",async T=>{T.preventDefault(),T.stopPropagation(),T.stopImmediatePropagation(),V.set(r,S.pid),Ur(),Me(),Ce?await cr(r,S.pid):(await Eo(r,S.pid),me()),d()}),(B=b.querySelector(".row > div"))==null||B.addEventListener("click",async T=>{if(!T.target.closest(".pickbox")&&!T.target.closest(".actions")&&!T.target.closest("button")){if(d(),Ce){await cr(e.id,S.pid);return}Gn(e,S.pid)}}),L.addEventListener("click",async T=>{T.stopPropagation(),d(),Gn(e,S.pid)}),I.addEventListener("click",async T=>{if(T.stopPropagation(),!await lt({title:"Borrar paralelo",text:`¿Quieres borrar el paralelo ${S.section||S.pid}?`,yesText:"Borrar",noText:"Cancelar"}))return;const H=(J.get(e.id)||[]).filter(D=>D.pid!==S.pid);J.set(e.id,H),K=K.filter(D=>!(D.courseId===e.id&&D.pid===S.pid)),Me(),V.get(e.id)===S.pid&&V.delete(e.id),dt(),Ce&&await je(),d()}),x.appendChild(b)});else{const S=document.createElement("div");S.className="hint",S.textContent="Aún no hay paralelos.",x.appendChild(S)}n.querySelector(".item.add").addEventListener("click",async()=>{d(),await Gn(e,null)}),(g=n.querySelector("#simClearFromScheduleBtn"))==null||g.addEventListener("click",async()=>{i&&(d(),await ia(e.id),K=K.filter(S=>S.courseId!==e.id),Me(),V.delete(e.id),me(),Ce&&await je())}),(M=n.querySelector("#simRemoveCourseBtn"))==null||M.addEventListener("click",async()=>{if(await lt({title:"Eliminar ramo",text:`¿Eliminar "${e.name}" del simulador? Esto lo quitará de tu lista de ramos.`,yesText:"Eliminar",noText:"Cancelar"})){if(d(),Ce){const b=e.id;re=(re||[]).filter(w=>w.id!==b),K=(K||[]).filter(w=>w.courseId!==b),J.delete(b),V.delete(b),On(re),dt(),await je();return}if(!(!o.currentUser||!o.activeSemesterId))try{await ia(e.id),await fe(N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e.id)),K=K.filter(b=>b.courseId!==e.id),Me(),J.delete(e.id),V.delete(e.id),o.courses=(o.courses||[]).filter(b=>b.id!==e.id),document.dispatchEvent(new Event("courses:changed")),Ce&&await je()}catch(b){console.error(b),alert("No se pudo eliminar el ramo.")}}});const y=t.getBoundingClientRect(),h=8;n.style.left="-9999px",n.style.top="-9999px";const E=n.offsetWidth,k=n.offsetHeight;let $=y.left,A=y.bottom+h;$=Math.min($,window.innerWidth-E-h),$=Math.max($,h),A+k>window.innerHeight-h&&(A=y.top-k-h),A=Math.max(A,h),n.style.left=`${$}px`,n.style.top=`${A}px`,setTimeout(()=>{document.addEventListener("pointerdown",p,{capture:!0})},0),document.addEventListener("keydown",m),window.addEventListener("scroll",f,!0),window.addEventListener("resize",v)}function Lo(e){const t=e||"full";return t==="top"?{a:0,b:.3334}:t==="bottom"?{a:.6666,b:1}:{a:0,b:1}}function ko(e,t){return e.a<t.b&&t.a<e.b}function Io(e){const t=e.map(a=>({...a,_vr:Lo(a.pos)})),n={top:0,full:1,bottom:2};t.sort((a,s)=>{const l=n[a.pos||"full"]??1,i=n[s.pos||"full"]??1;return l!==i?l-i:String(a.id||"").localeCompare(String(s.id||""))});const r=[];for(const a of t){let s=!1;for(let l=0;l<r.length;l++){const i=r[l];if(!i.some(d=>ko(a._vr,d._vr))){a._lane=l,i.push(a),s=!0;break}}s||(a._lane=r.length,r.push([a]))}return{blocks:t,laneCount:Math.max(1,r.length)}}function qa(){if(aa)return;aa=!0,Mo(),Vo(),Do(),Jo(),vn(),ir(),document.addEventListener("party:ready",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("party:changed",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("semester:changed",()=>{var f;(f=u("subtabCombinado"))!=null&&f.classList.contains("active")&&c()}),document.addEventListener("profile:changed",async()=>{var v,x,y,h,E;const f=(v=o.currentUser)==null?void 0:v.uid;f&&(le[f]=le[f]||{},(x=o.profileData)!=null&&x.name&&(le[f].name=o.profileData.name),(y=o.profileData)!=null&&y.favoriteColor&&(le[f].color=o.profileData.favoriteColor),(h=u("subtabCompartido"))!=null&&h.classList.contains("active")&&(await Dr(f,{force:!0}),await vn()),(E=u("subtabCombinado"))!=null&&E.classList.contains("active")&&(bn("busyLegendCombined"),Bt()))});const e=u("subtabPropio"),t=u("subtabCompartido"),n=u("subtabCombinado");p();const r=u("horarioPropio"),a=u("horarioCompartido"),s=u("horarioCombinado");function l(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function i(){var f,v,x;t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await vn(),(f=o.partyView)!=null&&f.uid&&await Br(o.partyView.uid),await ir(),(v=o.partyView)!=null&&v.uid&&((x=o.partyView)!=null&&x.semId)?Yt(o.partyView.uid,o.partyView.semId):Ve()}async function c(){var x;const f=u("horarioCombinado");if(!f)return;f.innerHTML=`
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
  `;const v=document.getElementById("busy-semSelCombined");if(v&&o.currentUser){const y=P(C,"users",o.currentUser.uid,"semesters"),E=(await q(X(y))).docs.map(S=>{var b;return{id:S.id,label:String(((b=S.data())==null?void 0:b.label)||S.id).trim()}}).sort((S,b)=>b.label.localeCompare(S.label));if(!E.length){v.innerHTML='<option value="" disabled selected>— sin semestres —</option>';return}const k=S=>{const b=/^(\d{4})-(1|2)$/.exec(String(S||"").trim());if(!b)return null;const w=parseInt(b[1],10);return parseInt(b[2],10)===1?`${w}-2`:`${w+1}-1`};v.innerHTML="";for(const S of E){const b=document.createElement("option");b.value=S.label,b.textContent=S.label,v.appendChild(b)}const $=((x=o.activeSemesterData)==null?void 0:x.label)||null,A=k($)||$,g=E.map(S=>S.label),M=A&&g.includes(A)?A:$&&g.includes($)?$:E[0].label;v.value=M,await pa(M),bn("busyLegendCombined"),lr("schedPartyBusyCombined"),v.addEventListener("change",async()=>{const S=v.value;await pa(S),bn("busyLegendCombined"),lr("schedPartyBusyCombined")})}}async function d(){n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),await c()}e.addEventListener("click",l),t.addEventListener("click",()=>{i()}),n.addEventListener("click",d),l(),document.addEventListener("courses:changed",()=>{if(Ce){dt();return}Bn(),me()}),document.addEventListener("click",async f=>{const v=f.target.closest(".block-del-btn");if(!v)return;const x=v.dataset.id;if(!(!x||!o.currentUser||!o.activeSemesterId)&&confirm("¿Eliminar este bloque del horario?"))try{await fe(N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule",x))}catch(y){console.error(y),alert("No se pudo eliminar el bloque.")}});function p(){const f=u("subtabPropio");if(!f)return;const v=f.parentElement;if(!v||document.getElementById("btnSimSchedule"))return;v.style.display="flex",v.style.alignItems="center",v.style.gap="10px",v.style.flexWrap="wrap";const x=document.createElement("div");x.style.flex="1 1 auto",v.appendChild(x);const y=document.createElement("button");y.id="btnSimSchedule",y.className="btn violet",y.textContent="Simulador de horario",y.style.marginLeft="auto",v.appendChild(y)}function m(){document.addEventListener("click",async f=>{f.target.closest("#btnSimSchedule")&&await Za()})}fo(),m()}function Tt(){if(cn&&(cn(),cn=null),an&&(an(),an=null),!o.currentUser||!o.activeSemesterId){ja();return}ie=[],me();const e=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses");an=Y(X(e,be("createdAt")),n=>{o.courses=n.docs.map(r=>({id:r.id,...r.data()})),document.dispatchEvent(new Event("courses:changed"))});const t=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule");cn=Y(X(t),n=>{ie=n.docs.map(r=>({id:r.id,...r.data()})),me()})}function ja(){document.querySelectorAll(".schedule-controls").forEach(n=>n.remove());const e=u("schedUSM");e&&(e.innerHTML=`
        <div class="card" style="padding:20px;text-align:center;">
          <p style="margin:0;font-size:1.05em">No hay semestre activo</p>
        </div>
      `);const t=u("coursePalette");t&&(t.innerHTML='<div class="muted">Selecciona o crea un semestre para ver ramos.</div>'),ie=[],De=[]}function Mo(){const e=u("horarioPropio");e.innerHTML=`
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
  `,Bn(),me()}function Ao(){Bn(),me()}function Bn(){const e=u("coursePalette");if(!e)return;e.innerHTML="";const t=Array.isArray(o.courses)?o.courses:[];if(er){const n=document.createElement("button");n.type="button",n.className="palette-chip",n.id="paletteAddCourseChip",n.textContent="+",n.style.cursor="pointer",n.style.fontWeight="900",n.style.fontSize="18px",n.style.display="inline-flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.minWidth="44px",n.style.borderStyle="dashed",n.style.opacity="0.95",n.addEventListener("click",async()=>{var a;const r=((a=document.getElementById("sim-semSel"))==null?void 0:a.value)||o.activeSemesterId;await ar(r)}),e.appendChild(n)}if(!t.length){const n=document.createElement("div");n.className="muted",n.style.marginLeft="10px",n.textContent=er?"Aún no tienes ramos. Presiona + para agregar el primero.":"Aún no tienes ramos. Agrega ramos desde el simulador.",e.appendChild(n);return}t.forEach(n=>{const r=document.createElement("div");r.className="palette-chip",r.setAttribute("draggable","true"),r.dataset.courseId=n.id,r.textContent=n.name;const a=Nt(n.color)?n.color:"#3B82F6";r.style.borderColor=a,r.style.boxShadow="inset 0 0 0 2px rgba(0,0,0,.15)",e.appendChild(r)})}function $o(e){var t;document.querySelectorAll(".schedule-controls").forEach(n=>n.remove()),e.innerHTML=`
      <div class="card" style="padding:20px;text-align:center;">
        <p style="margin-bottom:15px;font-size:1.1em">
          No hay un horario definido para esta universidad.
        </p>
        <button id="btnCreateNewSched" class="btn violet">Crear nuevo horario</button>
      </div>
    `,(t=u("btnCreateNewSched"))==null||t.addEventListener("click",()=>sr(!1))}async function No(e,t){if(!e||!t)return;const n=P(C,"users",e,"semesters",t,"schedule");await dr(n)}async function me(){var d,p,m,f,v,x;const e=u("schedUSM");if(!e)return;if(!o.currentUser||!o.activeSemesterId){ja();return}let t=await yt();De=t;const n=ft(),r=n==="USM"||n==="UMAYOR",a=`custom_slots_${n}_${(d=o.currentUser)==null?void 0:d.uid}`,s=Array.isArray(ge[n])&&ge[n].length>0;if(document.querySelectorAll(".schedule-controls").forEach(y=>y.remove()),!t){$o(e);return}const l=document.createElement("div");l.className="card schedule-controls",l.style="padding:12px;text-align:center;margin-bottom:10px;",r?l.innerHTML=`
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
    <button id="btnEditBlocksMode" class="btn ${Qe?"violet":"violet-outline"}">
      ${Qe?"✅ Modo edición: ON":"Editar ramos y salas"}
    </button>
  `:l.innerHTML=`
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
    <button id="btnEditBlocksMode" class="btn ${Qe?"violet":"violet-outline"}">
      ${Qe?"✅ Modo edición: ON":"Editar ramos y salas"}
    </button>
  `,e.before(l),(p=u("btnEditBlocksMode"))==null||p.addEventListener("click",()=>{Qe=!Qe,me()}),(m=u("btnCreateCustomSched"))==null||m.addEventListener("click",()=>{sr(!1)}),(f=u("btnUseDefaultSched"))==null||f.addEventListener("click",async()=>{localStorage.removeItem(a),await da(n),alert("Se restauró el horario por defecto."),De=n==="USM"?mt:Xt,me()}),(v=u("btnEditCustomSched"))==null||v.addEventListener("click",async()=>{const y=localStorage.getItem(a);let h=null;if(y)try{h=JSON.parse(y)}catch{}if(!h||h.length===0){alert("No hay horario personalizado guardado para editar.");return}confirm("¿Deseas volver a generar este horario con diferentes bloques o tiempos?")&&(alert("Ahora puedes modificar el horario. Se reemplazará el anterior."),await sr(!0))}),(x=u("btnDeleteCustomSched"))==null||x.addEventListener("click",async()=>{var y;if(await lt({title:"Borrar horario",text:"¿Seguro que deseas borrar tu horario personalizado?",yesText:"Sí, borrar horario",noText:"Cancelar"}))try{const h=(y=o.currentUser)==null?void 0:y.uid,E=o.activeSemesterId;if(!h||!E){alert("No hay semestre activo.");return}localStorage.removeItem(a),await da(n),delete ge[n],De=[],await No(h,E),ie=[],K=[],kn.delete(In(h,E)),document.dispatchEvent(new Event("courses:changed")),alert("Horario personalizado eliminado. Tus ramos siguen guardados."),await me()}catch(h){console.error(h),alert("No se pudo borrar el horario personalizado.")}});const c=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${c}</div>
        ${$e.map(y=>`<div class="cell header">${y}</div>`).join("")}
        ${t.map((y,h)=>`
          <div class="cell mod ${y.lunch?"lunch":""}" data-slot="${h}">
            ${Rn(y,h,n)}

          </div>
          ${$e.map((E,k)=>`
            <div class="cell slot ${y.lunch?"is-lunch":""}"
                data-day="${k}" data-slot="${h}"
                ${y.lunch?'aria-disabled="true"':""}>
              ${Yo(k,h)}

            </div>
          `).join("")}
        `).join("")}
      </div>
    `,Ja(),e.querySelectorAll(".placed").forEach(y=>{if(!y.querySelector(".block-del-btn")){const h=document.createElement("button");h.className="block-del-btn",h.textContent="×",h.dataset.id=y.dataset.id,y.appendChild(h)}})}function To(){var n,r;if(document.getElementById("cqModal"))return;const e=document.createElement("div");e.id="cqModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=()=>{e.style.display="none"};(n=document.getElementById("cqX"))==null||n.addEventListener("click",t),(r=document.getElementById("cqCancel"))==null||r.addEventListener("click",t),e.addEventListener("click",a=>{a.target===e&&t()}),document.addEventListener("keydown",a=>{e.style.display==="flex"&&a.key==="Escape"&&t()})}async function ar(e=null,{forceFirestore:t=!1}={}){To();const n=e||o.activeSemesterId;if(!o.currentUser||!n)return alert("Necesitas seleccionar un semestre para agregar ramos."),null;const r=document.getElementById("cqModal"),a=document.getElementById("cqErr"),s=document.getElementById("cqName"),l=document.getElementById("cqCode"),i=document.getElementById("cqColor"),c=document.getElementById("cqAsis"),d=document.getElementById("cqSave"),p=document.getElementById("cqCancel"),m=document.getElementById("cqX");a.style.display="none",a.textContent="",s.value="",l.value="",i.value="#3B82F6",c.checked=!1,r.style.display="flex",setTimeout(()=>s.focus(),0);const f=v=>{a.textContent=v,a.style.display="block"};return new Promise(v=>{const x=()=>{d.removeEventListener("click",E),p.removeEventListener("click",y),m.removeEventListener("click",y),document.removeEventListener("keydown",h),r.style.display="none"},y=()=>{x(),v(null)},h=k=>{k.key==="Escape"&&(k.preventDefault(),y()),k.key==="Enter"&&(k.preventDefault(),E())},E=async()=>{const k=(s.value||"").trim();if(!k)return f("Ingresa el nombre del ramo.");const $=(l.value||"").trim();if(!$)return f("Ingresa el código del ramo.");const A={name:k,code:$,professor:"",section:"",color:i.value||"#3B82F6",asistencia:!!c.checked,createdAt:Date.now()};try{if(Ce&&!t){const b=`SIM_${Date.now()}_${Math.random().toString(16).slice(2)}`;re=Array.isArray(re)?re:[],re.push({id:b,...A}),On(re),Me(),Be=!0,dt(),await je(),x(),v({id:b,...A});return}const g=await Ee(P(C,"users",o.currentUser.uid,"semesters",n,"courses"),A),M=P(C,"users",o.currentUser.uid,"semesters",n,"courses"),S=await q(X(M,be("createdAt")));o.courses=S.docs.map(b=>({id:b.id,...b.data()})),document.dispatchEvent(new Event("courses:changed")),x(),v({id:g.id,...A})}catch(g){console.error(g),f("No se pudo guardar el ramo. Revisa consola.")}};d.addEventListener("click",E),p.addEventListener("click",y),m.addEventListener("click",y),document.addEventListener("keydown",h)})}function Uo(){if(document.getElementById("ynModal"))return;const e=document.createElement("div");e.id="ynModal",e.style.cssText=`
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
    `,document.body.appendChild(e)}function Po(){if(document.getElementById("blockModal"))return;const e=document.createElement("div");e.id="blockModal",e.style.cssText=`
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
      `}}function la({mode:e="view",courseName:t,color:n,timeText:r,realName:a="",shownName:s="",code:l="",teacher:i="",section:c="",room:d=""}){Po();const p=document.getElementById("blockModal"),m=document.getElementById("bmTitle"),f=document.getElementById("bmSub"),v=document.getElementById("bmDot"),x=document.getElementById("bmCourse"),y=document.getElementById("bmTime"),h=document.getElementById("bmNameOnly"),E=document.getElementById("bmCode"),k=document.getElementById("bmTeacher"),$=document.getElementById("bmSection"),A=document.getElementById("bmRoomView"),g=document.getElementById("bmDetails"),M=document.getElementById("bmEdit"),S=document.getElementById("bmName"),b=document.getElementById("bmRoom"),w=document.getElementById("bmX"),L=document.getElementById("bmCancel"),I=document.getElementById("bmSave"),U=e==="edit";m.textContent=U?"Editar ramo":"Detalles del ramo",f.textContent=U?"Modifica nombre mostrado y/o sala":"Información del ramo (sin editar)",v.style.background=Nt(n)?n:"#64748b",x.textContent=t||"Ramo",y.textContent=r||"";const B=T=>String(T||"").trim()||"—";return h.textContent=B(a),E.textContent=B(l),k.textContent=B(i),$.textContent=B(c),A.textContent=B(d),g.style.display=U?"none":"grid",M.style.display=U?"grid":"none",S.value=String(s||"").trim()&&s!==a?String(s).trim():"",b.value=String(d||"").trim(),I.style.display=U?"inline-flex":"none",p.style.display="flex",U&&setTimeout(()=>{S.focus(),S.select()},0),new Promise(T=>{const O=()=>{w.removeEventListener("click",z),L.removeEventListener("click",z),I.removeEventListener("click",D),p.removeEventListener("click",H),document.removeEventListener("keydown",G),p.style.display="none"},z=()=>{O(),T(null)},H=F=>{F.target===p&&z()},D=()=>{const F=String(S.value||"").trim(),ce=String(b.value||"").trim();O(),T({nameVal:F,roomVal:ce})},G=F=>{F.key==="Escape"&&(F.preventDefault(),z()),U&&F.key==="Enter"&&(F.preventDefault(),D())};w.addEventListener("click",z),L.addEventListener("click",z),I.addEventListener("click",D),p.addEventListener("click",H),document.addEventListener("keydown",G)})}function Do(){document.addEventListener("click",async e=>{const t=e.target.closest(".placed");if(!t||!t.closest("#schedUSM")||e.target.closest(".block-del-btn"))return;const r=t.dataset.id,a=ie.find(E=>E.id===r);if(!a)return;const s=(o.courses||[]).find(E=>E.id===a.courseId)||{},l=(s.name||"Ramo").trim(),i=a.displayName&&String(a.displayName).trim()?String(a.displayName).trim():l,c=a.room&&String(a.room).trim()?String(a.room).trim():"",d=Lr(o.courses,a.courseId,Oa),p=a.start&&a.end?`${a.start}–${a.end}`:"",m=s.code||s.codigo||"",f=s.teacher||s.professor||s.docente||"",v=s.section||s.seccion||s.paralelo||"";if(!Qe){await la({mode:"view",courseName:i,color:d,timeText:p,realName:l,shownName:i,code:m,teacher:f,section:v,room:c});return}const x=await la({mode:"edit",courseName:l,color:d,timeText:p,realName:l,shownName:i,code:m,teacher:f,section:v,room:c});if(!x||!o.currentUser||!o.activeSemesterId)return;const{nameVal:y,roomVal:h}=x;try{const E=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule",a.id);await ae(E,{displayName:y||null,room:h||null,updatedAt:Date.now()});const k=ie.findIndex($=>$.id===a.id);k>=0&&(ie[k].displayName=y||null,ie[k].room=h||null),me()}catch(E){console.error(E),alert("No se pudo actualizar. Intenta nuevamente.")}})}function _o(){if(document.getElementById("csModal"))return;const e=document.createElement("div");e.id="csModal",e.style.cssText=`
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
    `,document.body.appendChild(e);const t=document.getElementById("csHasLunch"),n=document.getElementById("csLunchRow");t.addEventListener("change",()=>{n.style.display=t.checked?"grid":"none"})}function Ya({editMode:e=!1,titleOverride:t=null,okTextOverride:n=null,subOverride:r=null}={}){_o();const a=document.getElementById("csModal"),s=document.getElementById("csTitle"),l=document.getElementById("csSub"),i=document.getElementById("csErr"),c=document.getElementById("csBlocks"),d=document.getElementById("csHasLunch"),p=document.getElementById("csLunchRow"),m=document.getElementById("csLunchStart"),f=document.getElementById("csLunchEnd"),v=document.getElementById("csS1"),x=document.getElementById("csE1"),y=document.getElementById("csS2"),h=document.getElementById("csE2"),E=document.getElementById("csOk"),k=document.getElementById("csCancel"),$=document.getElementById("csX");s.textContent=t??(e?"Editar horario personalizado":"Crear horario personalizado"),l.textContent=r??(e?"Cambia los parámetros y regeneramos los bloques. Después puedes ajustar cada bloque con click.":"Define cuántos bloques tienes y los tiempos base. Después puedes ajustar cada bloque con click."),i.style.display="none",i.textContent="",c.value="",d.checked=!1,p.style.display="none",m.value="13:40",f.value="14:40",v.value="08:15",x.value="09:25",y.value="09:40",h.value="10:50",E.textContent=n??(e?"Guardar":"Crear"),a.style.display="flex";const A=g=>{i.textContent=g,i.style.display="block"};return new Promise(g=>{const M=I=>{I.target===a&&w()},S=I=>{I.key==="Enter"&&L(),I.key==="Escape"&&w()},b=()=>{E.removeEventListener("click",L),k.removeEventListener("click",w),$==null||$.removeEventListener("click",w),a.removeEventListener("click",M),a.removeEventListener("keydown",S)},w=()=>{b(),a.style.display="none",g(null)},L=()=>{const I=parseInt(c.value,10);if(!I||I<=0)return A("Ingresa un número válido de bloques por día.");const U=v.value,B=x.value,T=y.value,O=h.value;if(!U||!B||!T||!O)return A("Completa los horarios de los bloques base.");const z=!!d.checked,H=m.value,D=f.value;if(z&&(!H||!D))return A("Completa inicio y fin de almuerzo.");b(),a.style.display="none",g({n:I,hasLunch:z,lunchStart:z?H:null,lunchEnd:z?D:null,start1:U,end1:B,start2:T,end2:O})};E.addEventListener("click",L),k.addEventListener("click",w),$==null||$.addEventListener("click",w),a.addEventListener("click",M),a.addEventListener("keydown",S)})}function Ir(){return`dp_sim_items_${ze||"UNI"}_TERM`}function Ga(e){try{const t=(e||[]).map(n=>({courseId:n.courseId,pid:n.pid,day:n.day,slot:n.slot,pos:n.pos||"full"})).sort((n,r)=>(n.courseId||"").localeCompare(r.courseId||"")||(n.pid||"").localeCompare(r.pid||"")||n.day-r.day||n.slot-r.slot||(n.pos||"").localeCompare(r.pos||""));return JSON.stringify(t)}catch{return""}}function Me(){Be=Ha()}function Va(){try{localStorage.setItem(Ir(),JSON.stringify(K||[]))}catch{}Ra=Ga(K),Be=!1}function Bo(){try{const e=localStorage.getItem(Ir()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Mr(){var e;return`dp_sim_slots_${((e=o.currentUser)==null?void 0:e.uid)||"anon"}_${o.activeSemesterId||"noSem"}`}function Ar(){var e;return`dp_sim_parallel_defs_${((e=o.currentUser)==null?void 0:e.uid)||"anon"}_${o.activeSemesterId||"noSem"}`}function $r(){var e;return`dp_sim_selected_parallel_${((e=o.currentUser)==null?void 0:e.uid)||"anon"}_${o.activeSemesterId||"noSem"}`}function Ro(){try{const e=localStorage.getItem(Mr()),t=JSON.parse(e||"null");return Array.isArray(t)?t:null}catch{return null}}function Nr(e){try{localStorage.setItem(Mr(),JSON.stringify(e||null))}catch{}}function Oo(){try{const e=localStorage.getItem(Ar()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))n.set(r,Array.isArray(t[r])?t[r]:[]);return n}catch{return new Map}}function Tr(){try{const e={};for(const[t,n]of(J||new Map).entries())e[t]=n||[];localStorage.setItem(Ar(),JSON.stringify(e))}catch{}}function Ho(){try{const e=localStorage.getItem($r()),t=JSON.parse(e||"{}"),n=new Map;for(const r of Object.keys(t||{}))t[r]&&n.set(r,t[r]);return n}catch{return new Map}}function Ur(){try{const e={};for(const[t,n]of(V||new Map).entries())e[t]=n;localStorage.setItem($r(),JSON.stringify(e))}catch{}}function Fo(e,{persist:t=!1}={}){var n,r;if(e)try{const a=JSON.parse(e);pe=a.slots||null,K=Array.isArray(a.items)?a.items:[],re=Array.isArray(a.courses)?a.courses:[],(n=J.clear)==null||n.call(J);for(const s of Object.keys(a.defs||{}))J.set(s,Array.isArray(a.defs[s])?a.defs[s]:[]);(r=V.clear)==null||r.call(V);for(const s of Object.keys(a.selected||{}))a.selected[s]&&V.set(s,a.selected[s]);Ra=Ga(K),Be=!1,t&&(Nr(pe),Me(),On(re),Va(),Tr(),Ur())}catch(a){console.warn("restoreSimFromSnapshot failed",a)}}function zo({title:e="Salir del simulador",message:t="¿Quieres guardar antes de salir?",saveText:n="Guardar y salir",discardText:r="Salir sin guardar",cancelText:a="Cancelar"}={}){return new Promise(s=>{const l=document.getElementById("triConfirm");l&&l.remove();const i=document.createElement("div");i.id="triConfirm",i.style.cssText=`
        position:fixed; inset:0; z-index:20000; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,.55); padding:16px;
        font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;
      `,i.innerHTML=`
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
      `;const c=d=>{i.remove(),s(d)};i.addEventListener("click",d=>{d.target===i&&c("cancel")}),i.querySelector("#triCancel").addEventListener("click",()=>c("cancel")),i.querySelector("#triDiscard").addEventListener("click",()=>c("discard")),i.querySelector("#triSave").addEventListener("click",()=>c("save")),document.body.appendChild(i)})}function lt({title:e="Confirmar",text:t="",yesText:n="Sí",noText:r="No"}={}){Uo();const a=document.getElementById("ynModal"),s=document.getElementById("ynTitle"),l=document.getElementById("ynText"),i=document.getElementById("ynYes"),c=document.getElementById("ynNo");return s.textContent=e,l.textContent=t,i.textContent=n,c.textContent=r,a.style.display="flex",new Promise(d=>{const p=()=>{i.removeEventListener("click",m),c.removeEventListener("click",f),a.removeEventListener("click",v),document.removeEventListener("keydown",x),a.style.display="none"},m=()=>{p(),d(!0)},f=()=>{p(),d(!1)},v=y=>{y.target===a&&(p(),d(!1))},x=y=>{y.key==="Escape"&&(p(),d(!1)),y.key==="Enter"&&(p(),d(!0))};i.addEventListener("click",m),c.addEventListener("click",f),a.addEventListener("click",v),document.addEventListener("keydown",x)})}async function sr(e=!1){const t=ft()||"UNI_desconocida",n=await Ya({editMode:e});if(!n)return;const{n:r,hasLunch:a,lunchStart:s,lunchEnd:l,start1:i,end1:c,start2:d,end2:p}=n;let m=null,f=null;if(a&&(m=Z(s),f=Z(l),isNaN(m)||isNaN(f)||f<=m))return alert("Horas de almuerzo inválidas.");const v=Z(i),x=Z(c)-Z(i),y=Z(d)-Z(c);if(isNaN(v)||x<=0)return alert("Horas inválidas en bloques.");if(y<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa.");const h=[];let E=v,k=!1,$=0;for(;$<r;){if(a&&!k&&E>=m&&E<f){h.push({label:"ALMUERZO",start:s,end:l,lunch:!0}),k=!0,E=f;continue}const A=E,g=A+x;if(a&&!k&&A<m&&g>m){h.push({label:"ALMUERZO",start:s,end:l,lunch:!0}),k=!0,E=f;continue}const M=$+1,S=ue(A),b=ue(g);h.push({label:String(M),start:S,end:b,lines:[{n:String(M),start:S,end:b}]}),$++,E=g+y}if(a&&!k){const A={label:"ALMUERZO",start:s,end:l,lunch:!0};let g=h.findIndex(M=>!M.lunch&&Z(M.start)>=m);g===-1&&(g=h.length),h.splice(g,0,A);for(let M=g+1;M<h.length;M++){const S=h[M];if(S.lunch)continue;const b=Z(S.start),w=Z(S.end);if(b<f){const L=f-b,I=b+L,U=w+L;S.start=ue(I),S.end=ue(U),S.lines=[{n:S.label,start:S.start,end:S.end}]}}}ge[t]=h,localStorage.setItem(`custom_slots_${t}_${o.currentUser.uid}`,JSON.stringify(h)),await Ka(t,h),alert(e?"Horario personalizado actualizado.":"Horario personalizado creado exitosamente."),me()}async function qo(){const e=await Ya({editMode:!0,titleOverride:"Editar horario personalizado",okTextOverride:"Guardar",subOverride:"Cambia los parámetros y regeneraremos los bloques. Después puedes ajustar cada bloque con click."});if(!e)return null;const{n:t,hasLunch:n,lunchStart:r,lunchEnd:a,start1:s,end1:l,start2:i,end2:c}=e;let d=null,p=null;if(n&&(d=Z(r),p=Z(a),isNaN(d)||isNaN(p)||p<=d))return alert("Horas de almuerzo inválidas."),null;const m=Z(s),f=Z(l)-Z(s),v=Z(i)-Z(l);if(isNaN(m)||f<=0)return alert("Horas inválidas en bloques."),null;if(v<0)return alert("La pausa entre bloque 1 y 2 no puede ser negativa."),null;const x=[];let y=m,h=!1,E=0;for(;E<t;){if(n&&!h&&y>=d&&y<p){x.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const k=y,$=k+f;if(n&&!h&&k<d&&$>d){x.push({label:"ALMUERZO",start:r,end:a,lunch:!0}),h=!0,y=p;continue}const A=E+1,g=ue(k),M=ue($);x.push({label:String(A),start:g,end:M,lines:[{n:String(A),start:g,end:M}]}),E++,y=$+v}if(n&&!h){const k={label:"ALMUERZO",start:r,end:a,lunch:!0};let $=x.findIndex(A=>!A.lunch&&Z(A.start)>=d);$===-1&&($=x.length),x.splice($,0,k);for(let A=$+1;A<x.length;A++){const g=x[A];if(g.lunch)continue;const M=Z(g.start),S=Z(g.end);if(M<p){const b=p-M,w=M+b,L=S+b;g.start=ue(w),g.end=ue(L),g.lines=[{n:g.label,start:g.start,end:g.end}]}}}return x}function ue(e){const t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function In(e,t){return`${e}:${t}`}function jo(e,t){const n=In(e,t),r=kn.get(n);return r?(wt=r.items||[],Fe=r.courses||[],St=r.slots||mt,ze=r.uni||"USM",Ve(),!0):!1}function Rn(e,t,n){if(e.lunch)return`
        <div class="mod-label">ALMUERZO</div>
        <div class="mod-time">${e.start}–${e.end}</div>
      `;const r=nr.length?nr:De;if(n!=="USM"&&n!=="UMAYOR"||!e.label.includes("/"))return`
        <div class="mod-lines">
          <div class="line-num">${e.label}</div>
          <div class="line-time">${e.start}–${e.end}</div>
        </div>
      `;if(n==="USM"){const l=(r.slice(0,t+1).filter(c=>!c.lunch).length-1)*2+1,i=l+1;return`
    <div class="mod-lines">
      <div class="line-num">${l}</div>
      <div class="line-time">${e.lines[0].start}–${e.lines[0].end}</div>
      <div class="line-num">${i}</div>
      <div class="line-time">${e.lines[1].start}–${e.lines[1].end}</div>
    </div>
  `}return`
  <div class="mod-lines">
    <div class="line-num">${r.slice(0,t+1).filter(s=>!s.lunch).length}</div>
    <div class="line-time">${e.start}–${e.end}</div>
  </div>
`}document.addEventListener("click",e=>{const t=e.target.closest(".mod-lines");if(!t)return;const n=ft();if(!ge[n])return;const a=Array.from(t.parentNode.parentNode.querySelectorAll(".mod")).indexOf(t.parentNode);if(a<0)return;const s=ge[n],l=s[a],i=Z(l.end),c=prompt(`Inicio de ${l.label}`,l.start),d=prompt(`Fin de ${l.label}`,l.end);if(!c||!d)return;const p=Z(c),m=Z(d);if(isNaN(p)||isNaN(m)||m<=p){alert("Horas inválidas.");return}l.start=ue(p),l.end=ue(m),l.lines=[{n:l.label.split("/")[0],start:ue(p),end:ue(m)}];const f=m-p;if(a<s.length-1){const v=Z(s[a+1].start)-i;let x=m+v;for(let y=a+1;y<s.length;y++){const h=s[y],E=y+1;h.start=ue(x),h.end=ue(x+f),h.lines=[{n:String(E),start:h.start,end:ue(x+f/2)},{n:String(E+1),start:ue(x+f/2),end:h.end}],x=Z(h.end)+v}}localStorage.setItem(`custom_slots_${n}_${o.currentUser.uid}`,JSON.stringify(s)),ge[n]=s,me()});function Yo(e,t){const n=ie.filter(r=>r.day===e&&r.slot===t);return n.length?Wa(n,!1):""}function Wa(e,t){const n=Io(e);return n.blocks.map(r=>Go(r,n.laneCount,t)).join("")}function Go(e,t,n){const r=o.courses||[],a=r.find(E=>E.id===e.courseId),s=(a==null?void 0:a.name)||"Ramo",l=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():s,i=typeof e.room=="string"&&e.room.trim()?e.room.trim():"",c=Lr(r,e.courseId,Oa),d=kr(c),p=e.hpos||"single";let m=0,f=100;p==="left"?(m=0,f=50):p==="right"?(m=50,f=50):(m=0,f=100);const v=e.pos||"full";let x=0,y=100;v==="top"?(x=0,y=50):v==="bottom"?(x=50,y=50):(x=0,y=100);const h=`${l}${i?` · Sala: ${i}`:""}`;return`
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
        ${Ae(l)}
      </div>
      ${i?`
        <div class="placed-room" style="color:${d}; opacity:.9; font-weight:700; font-size:11px; margin-top:2px; line-height:1.05;">
          ${Ae(i)}
        </div>
      `:""}
    </div>
  `}function Vo(){window.addEventListener("dragover",go,{passive:!0}),document.addEventListener("drop",oa),document.addEventListener("dragend",oa),document.addEventListener("dragstart",e=>{var r,a,s,l;const t=(a=(r=e.target).closest)==null?void 0:a.call(r,".palette-rect");if(t){const i=t.dataset.payload;if(i){e.dataTransfer.setData("text/plain",i),e.dataTransfer.effectAllowed="copy",Ht=!0;return}}const n=(l=(s=e.target).closest)==null?void 0:l.call(s,".palette-chip");if(n){e.dataTransfer.setData("text/plain",n.dataset.courseId),e.dataTransfer.effectAllowed="copy",Ht=!0;return}}),document.addEventListener("dragstart",e=>{const t=e.target.closest(".placed");t&&(e.dataTransfer.setData("text/plain",JSON.stringify({type:"move-block",id:t.dataset.id})),e.dataTransfer.effectAllowed="move",Ht=!1)}),Ja()}function Pr(){var e;return`sim_courses_${((e=o.currentUser)==null?void 0:e.uid)||"anon"}_${o.activeSemesterId||"noSem"}`}function Wo(){try{const e=localStorage.getItem(Pr()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function On(e){try{localStorage.setItem(Pr(),JSON.stringify(e||[]))}catch{}}function Ja(){document.querySelectorAll(".cell.slot").forEach(e=>{e.classList.contains("is-lunch")||(e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect=t.dataTransfer.effectAllowed==="move"?"move":"copy";const n=e.getBoundingClientRect(),r=t.clientX-n.left,a=t.clientY-n.top,s=n.height/2;let l="full";a<s-10?l="top":a>s+10&&(l="bottom");let i="single";const c=r/n.width;c<.4?i="left":c>.6&&(i="right"),e.dataset.droppos=l,e.dataset.droph=i,e.classList.add("over"),e.classList.remove("hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),l==="top"&&e.classList.add("hint-top"),l==="full"&&e.classList.add("hint-full"),l==="bottom"&&e.classList.add("hint-bottom"),i==="left"&&e.classList.add("hint-left"),i==="single"&&e.classList.add("hint-center"),i==="right"&&e.classList.add("hint-right")}),e.addEventListener("dragleave",()=>Q(e)),e.addEventListener("drop",async t=>{t.preventDefault();const n=!!e.closest("#simModal"),r=t.dataTransfer.getData("text/plain");if(!r){Q(e);return}const a=parseInt(e.dataset.day,10),s=parseInt(e.dataset.slot,10),l=e.dataset.droppos||"full",i=e.dataset.droph||"single";let c=null;try{c=JSON.parse(r)}catch{}const d=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===l),p=y=>y.filter(h=>h.day===a&&h.slot===s&&(h.pos||"full")===l&&(h.hpos||"single")===i);if(c&&c.type==="course-parallel"){const y=c.courseId,h=c.pid||null;if(n){const L=(pe||De||[])[s];if(!L){Q(e);return}const I=(K||[]).filter(F=>F.courseId!==y),U=d(I);if(p(I).length){alert("Ese espacio exacto ya está ocupado."),Q(e);return}if(U.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),Q(e);return}K=(K||[]).filter(F=>F.courseId!==y);const O=(((re||[]).find(F=>F.id===y)||(o.courses||[]).find(F=>F.id===y)||{}).name||"Ramo").trim(),z=J.get(y)||[],H=h?z.find(F=>F.pid===h):null,D=(H==null?void 0:H.section)||(H==null?void 0:H.pid)||null,G=D?`${O} · ${D}`:O;K.push({courseId:y,day:a,slot:s,start:L.start,end:L.end,pos:l,hpos:i,pid:h,displayName:G}),Me(),await je(),Q(e);return}if(!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre."),Q(e);return}const E=(De||[])[s];if(!E){Q(e);return}const k=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),Q(e);return}if(k.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),Q(e);return}const g=(((o.courses||[]).find(L=>L.id===y)||{}).name||"Ramo").trim(),M=J.get(y)||[],S=h?M.find(L=>L.pid===h):null,b=(S==null?void 0:S.section)||(S==null?void 0:S.pid)||null,w=b?`${g} · ${b}`:null;await Ee(P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule"),{courseId:y,day:a,slot:s,start:E.start,end:E.end,pos:l,hpos:i,parallelPid:h||null,displayName:w,createdAt:Date.now()}),h&&V.set(y,h),Q(e);return}if(c&&c.type==="move-block"){const y=c.id;if(!y){Q(e);return}if(!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre."),Q(e);return}try{const h=ie.find(S=>S.id===y);if(!h){Q(e);return}const E=(De||[])[s];if(!E){Q(e);return}if(h.day===a&&h.slot===s&&(h.pos||"full")===l&&(h.hpos||"single")===i){Q(e);return}const k=ie.filter(S=>S.id!==y),$=d(k);if(p(k).length){alert("Ese espacio exacto ya está ocupado."),Q(e);return}if($.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),Q(e);return}const g=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule",y);await ae(g,{day:a,slot:s,pos:l,hpos:i,start:E.start,end:E.end,updatedAt:Date.now()});const M=ie.findIndex(S=>S.id===y);M>=0&&Object.assign(ie[M],{day:a,slot:s,pos:l,hpos:i,start:E.start,end:E.end}),me(),Q(e);return}catch(h){console.error("move error",h),alert("No se pudo mover el bloque (Firestore): "+((h==null?void 0:h.message)||h)),Q(e);return}}const m=r;if(!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre."),Q(e);return}const f=d(ie||[]);if(p(ie||[]).length){alert("Ese espacio exacto ya está ocupado."),Q(e);return}if(f.length>=2){alert("Esa franja ya tiene izquierda y derecha ocupadas."),Q(e);return}if(f.length===1){const y=f[0],h=y.hpos||"single";if(h==="single"&&i!=="single"){const E=i==="left"?"right":"left";try{await ae(N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule",y.id),{hpos:E})}catch{}}else if(h===i){alert("Ese lado ya está ocupado. Prueba el otro lado."),Q(e);return}}const x=(De||[])[s];if(!x){Q(e);return}await Ee(P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"schedule"),{courseId:m,day:a,slot:s,start:x.start,end:x.end,pos:l,hpos:i,createdAt:Date.now()}),Q(e)}))})}function Q(e){e.classList.remove("over","hint-top","hint-full","hint-bottom","hint-left","hint-center","hint-right"),delete e.dataset.droppos,delete e.dataset.droph}function Jo(){var t;const e=u("horarioCompartido");e&&(e.innerHTML=`
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
    `,(t=u("party-semSel"))==null||t.addEventListener("change",n=>{o.partyView=o.partyView||{},o.partyView.semId=n.target.value||null,o.partyView.uid&&o.partyView.semId?Yt(o.partyView.uid,o.partyView.semId):Ve()}),Ve())}function Ko(e,t,n,r){const a=Fe||[],s=a.find(f=>f.id===e.courseId),l=(s==null?void 0:s.name)||"Ramo",i=typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():l,c=Lr(a,e.courseId,n),d=kr(c),p=typeof e.room=="string"&&e.room.trim()?e.room.trim():null,m=e.hpos||"single";return`
    <div class="placed pos-${t} h-${m}"
        title="${i}${p?` · Sala: ${p}`:""}"
        style="background:${c}; border:1px solid rgba(0,0,0,0.25); margin:2px 0;">
      <div class="placed-title" style="color:${d}; font-weight:600;">${i}</div>
    </div>
  `}async function Zo(e,t){var a;const n=za(t),r=n==="USM"||n==="UMAYOR";if(e)try{const s=N(C,"users",e,"custom_schedules",n),l=await te(s);if(l.exists()){const i=((a=l.data())==null?void 0:a.slots)||[];if(Array.isArray(i)&&i.length>0)return{uni:n,slots:i}}}catch(s){console.warn("[shared] error leyendo custom_schedules del dúo",s)}return r?{uni:n,slots:n==="UMAYOR"?Xt:mt}:{uni:n,slots:null}}async function Xo({course:e,day:t,slot:n,room:r}){if(!o.currentUser||!o.activeSemesterId)throw new Error("No logueado");const a=o.activeSemesterId,s=o.currentUser.uid,l=(o.courses||[]).find(p=>(p.name||"").toLowerCase().includes(String(e).toLowerCase()));if(!l)throw new Error("Curso no encontrado");const i=P(C,"users",s,"semesters",a,"schedule"),d=(await q(i)).docs.find(p=>{const m=p.data();return m.courseId===l.id&&m.day===t&&m.slot===n});if(!d)throw new Error("No encontré el bloque en el horario");return await ae(d.ref,{room:r||null,updatedAt:Date.now()}),{ok:!0,room:r}}async function Qo(e=null){if(!o.currentUser)throw new Error("No logueado");const t=e||o.activeSemesterId;if(!t)throw new Error("No hay semestre activo");const n=P(C,"users",o.currentUser.uid,"semesters",t,"schedule");return(await q(n)).docs.map(a=>({id:a.id,...a.data()}))}async function ei(e=null){if(!o.currentUser)throw new Error("No logueado");const t=e||o.activeSemesterId;if(!t)throw new Error("No hay semestre activo");if(!o.pairOtherUid)return{items:[]};const n=P(C,"users",o.currentUser.uid,"semesters",t,"schedule"),a=(await q(n)).docs.map(d=>({...d.data()})),s=P(C,"users",o.pairOtherUid,"semesters",t,"schedule"),i=(await q(s)).docs.map(d=>({...d.data()})),c=[];for(const d of a)for(const p of i)d.day===p.day&&d.slot===p.slot&&c.push(`${["Lun","Mar","Mié","Jue","Vie"][d.day]} bloque ${d.slot} (${d.courseName} / ${p.courseName})`);return{items:c}}async function ti(e,t=null){if(!o.currentUser)throw new Error("No logueado");const n=t||o.activeSemesterId;return await fe(N(C,"users",o.currentUser.uid,"semesters",n,"schedule",e)),{ok:!0}}document.addEventListener("dragstart",e=>{const t=e.target.closest(".placed");t&&t.classList.add("dragging")});document.addEventListener("dragend",e=>{const t=e.target.closest(".placed");t&&t.classList.remove("dragging")});const ca=8*60,ni=22*60;function Z(e){const[t,n]=e.split(":").map(Number);return t*60+n}function Vn(e){return(e-ca)/(ni-ca)*100}document.addEventListener("auth:ready",()=>{setTimeout(()=>{qa(),Tt()},1e3)});document.addEventListener("semester:changed",()=>{Tt()});async function Ka(e,t){if(!o.currentUser)return;const n=N(C,"users",o.currentUser.uid,"custom_schedules",e);await ye(n,{slots:t,updatedAt:Date.now()})}async function da(e){if(!o.currentUser)return!1;try{const t=N(C,"users",o.currentUser.uid,"custom_schedules",e);return await fe(t),!0}catch(t){return console.error("[Firestore] Error al eliminar horario personalizado:",t),!1}}async function vn(){var r,a;const e=u("partyBar");if(!e)return;const t=(r=o.currentUser)==null?void 0:r.uid,n=(o.partyMembers||[]).filter(Boolean).filter(s=>s!==t);if(!n.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}if(o.partyView=o.partyView||{},!o.partyView.uid){const s=(a=o.currentUser)==null?void 0:a.uid;o.partyView.uid=n.find(l=>l!==s)||s||n[0]}await Promise.all(n.map(s=>Dr(s,{force:!0}))),e.innerHTML=n.map(s=>{var p;const l=le[s]||{},i=l.name||(s===((p=o.currentUser)==null?void 0:p.uid)?"Yo":"Usuario"),c=l.color||"#64748b",d=s===o.partyView.uid;return`
    <button class="party-chip btn ${d?"violet":"violet-outline"} ${d?"is-active":""}"
      data-uid="${s}"
      style="
        display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
        ${d?"outline:2px solid rgba(255,255,255,.65); outline-offset:2px; box-shadow:0 0 0 3px rgba(124,58,237,.25);":""}
      ">
      <span style="width:14px;height:14px;border-radius:4px;background:${c};display:inline-block;"></span>
      <span style="font-weight:700">${Ae(i)}</span>
    </button>
  `}).join(""),e.querySelectorAll("button[data-uid]").forEach(s=>{s.addEventListener("click",async()=>{const l=s.dataset.uid;o.partyView.uid=l,await vn(),await Br(l),await ir(),o.partyView.semId?Yt(l,o.partyView.semId):Ve()})})}async function Dr(e,{force:t=!1}={}){if(e&&!(!t&&le[e]))try{const n=N(C,"users",e),r=N(C,"users",e,"profile","profile"),[a,s]=await Promise.all([te(n),te(r)]),l=a.exists()?a.data()||{}:{},i=s.exists()?s.data()||{}:{},c=typeof i.name=="string"&&i.name.trim()?i.name.trim():typeof l.name=="string"&&l.name.trim()?l.name.trim():typeof l.displayName=="string"&&l.displayName.trim()?l.displayName.trim():typeof l.username=="string"&&l.username.trim()?l.username.trim():"",d=typeof i.favoriteColor=="string"&&i.favoriteColor.trim()?i.favoriteColor.trim():typeof l.favoriteColor=="string"&&l.favoriteColor.trim()?l.favoriteColor.trim():"";le[e]={name:c,color:d}}catch(n){console.warn("loadPartyMemberProfile error",n),le[e]=le[e]||{name:"",color:""}}}function Ae(e){return String(e||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function _r(){var e;return`sim_palette_order_${((e=o.currentUser)==null?void 0:e.uid)||"anon"}_${o.activeSemesterId||"noSem"}`}function or(){try{const e=localStorage.getItem(_r()),t=JSON.parse(e||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function ua(e){try{localStorage.setItem(_r(),JSON.stringify(e||[]))}catch{}}function ri(e){const t=or();if(!t.length)return e;const n=new Map(t.map((a,s)=>[a,s])),r=999999;return[...e].sort((a,s)=>{const l=n.has(a.id)?n.get(a.id):r,i=n.has(s.id)?n.get(s.id):r;return l!==i?l-i:String(a.name||"").localeCompare(String(s.name||""),"es")})}function ai(){const e=document.getElementById("simPaletteHost");if(!e)return;let t=null;e.querySelectorAll('.sim-course-group[draggable="true"]').forEach(n=>{n.addEventListener("dragstart",r=>{t=n.dataset.courseId,r.dataTransfer.effectAllowed="move",r.dataTransfer.setData("text/plain",t),n.classList.add("dragging")}),n.addEventListener("dragend",()=>{t=null,n.classList.remove("dragging"),e.querySelectorAll(".sim-course-group").forEach(r=>r.classList.remove("drag-over"))}),n.addEventListener("dragover",r=>{r.preventDefault(),r.dataTransfer.dropEffect="move",n.classList.add("drag-over")}),n.addEventListener("dragleave",()=>{n.classList.remove("drag-over")}),n.addEventListener("drop",r=>{r.preventDefault(),n.classList.remove("drag-over");const a=n.dataset.courseId;if(!t||!a||t===a)return;if(!or().length){const p=Array.from(e.querySelectorAll(".sim-course-group")).map(m=>m.dataset.courseId).filter(Boolean);ua(p)}const l=or().filter(Boolean),i=(o.courses||[]).map(p=>p.id);for(const p of i)l.includes(p)||l.push(p);const c=l.filter(p=>p!==t),d=c.indexOf(a);c.splice(Math.max(0,d),0,t),ua(c),dt()})})}function si(){if(document.getElementById("simPaletteReorderStyles"))return;const e=document.createElement("style");e.id="simPaletteReorderStyles",e.textContent=`
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
    `,document.head.appendChild(e)}async function Br(e){const t=u("party-semSel");if(!t||(t.innerHTML='<option value="">— seleccionar —</option>',!e))return;const n=P(C,"users",e,"semesters"),a=(await q(X(n))).docs.map(s=>{var l;return{id:s.id,label:(((l=s.data())==null?void 0:l.label)||s.id).trim()}});a.sort((s,l)=>l.label.localeCompare(s.label));for(const s of a){const l=document.createElement("option");l.value=s.id,l.textContent=s.label,t.appendChild(l)}}async function ir(){var s,l;const e=(s=o.partyView)==null?void 0:s.uid,t=(l=o.activeSemesterData)==null?void 0:l.label,n=u("party-semSel");if(!e||!t||!n)return;await Br(e);const r=Array.from(n.options),a=r.find(i=>(i.textContent||"").trim()===t);if(a)n.value=a.value,o.partyView.semId=a.value,await Yt(e,a.value);else{const i=r.find(c=>c.value);n.value=i?i.value:"",o.partyView.semId=n.value||null,o.partyView.semId&&await Yt(e,o.partyView.semId)}}function Ve(){const e=u("schedPartyUSM");if(!e)return;if(!Fe||Fe.length===0){e.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando ramos…</div>';return}const t=St||mt;nr=t;const n=ze==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${n}</div>
        ${$e.map(r=>`<div class="cell header">${r}</div>`).join("")}
        ${t.map((r,a)=>`
          <div class="cell mod ${r.lunch?"lunch":""}" data-slot="${a}">
            ${Rn(r,a,ze)}
          </div>
          ${$e.map((s,l)=>`
            <div class="cell slot ${r.lunch?"is-lunch":""}"
                data-day="${l}" data-slot="${a}">
              ${oi(l,a)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `}function oi(e,t){const n=wt.filter(a=>a.day===e&&a.slot===t),r=a=>{var d,p;const s=n.filter(m=>(m.pos||"full")===a);if(!s.length)return"";const l=s.sort((m,f)=>{const v={left:0,single:1,right:2};return(v[m.hpos||"single"]??1)-(v[f.hpos||"single"]??1)}),i=(d=o.partyView)==null?void 0:d.uid,c=((p=le[i])==null?void 0:p.color)||yo;return l.map(m=>Ko(m,a,c)).join("")};return`
      ${r("top")}
      ${r("full")}
      ${r("bottom")}
    `}async function Yt(e,t){var c,d;if(sn&&(sn(),sn=null),on&&(on(),on=null),ln&&(ln(),ln=null),!e||!t)return;if(!jo(e,t)){wt=[],Fe=[],St=null,ze="USM";const p=u("schedPartyUSM");p&&(p.innerHTML='<div class="card" style="padding:16px;text-align:center;">Cargando horario…</div>')}const r=(c=o.partyView)!=null&&c.semId?(d=(await te(N(C,"users",e,"semesters",o.partyView.semId))).data())==null?void 0:d.universityAtThatTime:"",{uni:a,slots:s}=await Zo(e,r);ze=a,St=s||(a==="UMAYOR"?Xt:mt),ln=Y(N(C,"users",e),p=>{const m=p.data()||{};le[e]=le[e]||{},le[e].color=m.favoriteColor||le[e].color||"",le[e].name=m.displayName||m.name||m.username||le[e].name||"",Ve()});const l=P(C,"users",e,"semesters",t,"courses");on=Y(X(l,be("name")),p=>{Fe=p.docs.map(m=>({id:m.id,...m.data()})),kn.set(In(e,t),{uni:ze,slots:St,items:wt,courses:Fe}),Ve()});const i=P(C,"users",e,"semesters",t,"schedule");sn=Y(X(i),p=>{wt=p.docs.map(m=>({id:m.id,...m.data()})),kn.set(In(e,t),{uni:ze,slots:St,items:wt,courses:Fe}),Ve()})}async function ii(){var e,t,n;for(const[r,a]of tr.entries()){try{(e=a.prof)==null||e.call(a)}catch{}try{(t=a.courses)==null||t.call(a)}catch{}try{(n=a.sched)==null||n.call(a)}catch{}}tr.clear(),qe.clear()}async function li(e,t,{allowFallback:n=!0}={}){const r=P(C,"users",e,"semesters"),s=(await q(X(r))).docs.map(i=>{var c;return{id:i.id,label:String(((c=i.data())==null?void 0:c.label)||i.id).trim()}});if(!s.length)return null;const l=t?s.find(i=>i.label===t):null;return l?l.id:!n&&t?null:(s.sort((i,c)=>c.label.localeCompare(i.label)),s[0].id)}async function pa(e=null){var s,l,i;const t=(s=o.currentUser)==null?void 0:s.uid,n=Array.from(new Set([...o.partyMembers||[],t])).filter(Boolean);if(!n.length){const c=u("schedPartyBusy");c&&(c.innerHTML='<div class="muted">No hay miembros en tu party.</div>');return}await ii();const r=e??(((l=o.activeSemesterData)==null?void 0:l.label)||null),a=!!e;await Promise.all(n.map(c=>Dr(c,{force:!0})));for(const c of n){const d=await li(c,r,{allowFallback:!a});if(!d)continue;const p=le[c]||{};qe.set(c,{name:p.name||(c===((i=o.currentUser)==null?void 0:i.uid)?"Yo":"Usuario"),color:p.color||"#64748b",uni:"USM",slots:null,courses:[],items:[],semId:d});const m=(h,E="#64748b")=>{const k=String(h||"").trim();return/^#[0-9A-Fa-f]{6}$/.test(k)?k:E},f=(h,E="Usuario")=>{const k=String(h||"").trim();return k||E},v={};v.prof=Y(N(C,"users",c,"profile","profile"),h=>{var $;const E=h.data()||{},k=qe.get(c);k&&(k.color=m(E.favoriteColor,k.color||"#64748b"),k.name=f(E.name,k.name||(c===(($=o.currentUser)==null?void 0:$.uid)?"Yo":"Usuario")),Bt())});const x=P(C,"users",c,"semesters",d,"courses");v.courses=Y(X(x,be("name")),h=>{const E=qe.get(c);E&&(E.courses=h.docs.map(k=>({id:k.id,...k.data()})),Bt())});const y=P(C,"users",c,"semesters",d,"schedule");v.sched=Y(X(y),h=>{const E=qe.get(c);E&&(E.items=h.docs.map(k=>({id:k.id,...k.data(),_uid:c})),Bt())}),tr.set(c,v)}Bt()}function ci(e){const t=[...e].sort((r,a)=>r.startMin-a.startMin||r.endMin-a.endMin),n=[];for(const r of t){let a=!1;for(let s=0;s<n.length;s++)if(n[s]<=r.startMin){r._lane=s,n[s]=r.endMin,a=!0;break}a||(r._lane=n.length,n.push(r.endMin))}return{blocks:t,laneCount:n.length||1}}function di(){if(document.getElementById("timelineStyles"))return;const e=document.createElement("style");e.id="timelineStyles",e.textContent=`
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
    `,document.head.appendChild(e)}function lr(e="schedPartyBusy"){di();const t=document.getElementById(e);if(!t)return;const n=Array.from(qe.entries());if(!n.length){t.innerHTML='<div class="muted">Cargando party…</div>';return}const r=[];for(const[a,s]of n)for(const l of s.items||[]){const i=Z(l.start),c=Z(l.end);isNaN(i)||isNaN(c)||c<=i||r.push({...l,_uid:a,_name:s.name,_favColor:s.color,startMin:i,endMin:c})}t.innerHTML=`
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
              ${ui()}
              ${(()=>{const l=r.filter(c=>c.day===s).map(c=>({...c,topPct:Vn(c.startMin),heightPct:Vn(c.endMin)-Vn(c.startMin)})).filter(c=>c.heightPct>0),i=ci(l);return i.blocks.map(c=>pi(c,i.laneCount)).join("")})()}
            </div>
          `).join("")}
        </div>
      </div>
    `}function ui(){return Array.from({length:15},(e,t)=>{const n=t*6.666666666666667,r=n+100/15/2;return`
        <div class="timeline-line" style="top:${n}%"></div>
        <div class="timeline-line half" style="top:${r}%"></div>
      `}).join("")}function pi(e,t){const n=qe.get(e._uid),r=(n==null?void 0:n.color)||e._favColor||"#64748b",s=((n==null?void 0:n.courses)||[]).find(y=>y.id===e.courseId),l=((s==null?void 0:s.name)||"Ramo").trim(),i=t>1,c=r,d=ma(c,i?.35:.9),p=kr(c),m=ma(c,1),f=i?e._lane===0?"top":e._lane===1?"bottom":"center":"center",v=f==="top"?"top:6px; transform:none;":f==="bottom"?"bottom:6px; transform:none;":"top:50%; transform:translateY(-50%);",x=10+(e._lane||0);return`
      <div class="timeline-block"
        title="${Ae(l)}"
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
          ${Ae(l)}
        </div>
      </div>
    `}function ma(e,t){if(!Nt(e))return`rgba(100,116,139,${t})`;const n=parseInt(e.slice(1,3),16),r=parseInt(e.slice(3,5),16),a=parseInt(e.slice(5,7),16),s=Math.max(0,Math.min(1,t));return`rgba(${n},${r},${a},${s})`}function bn(e){const t=document.getElementById(e);if(!t)return;const n=Array.from(qe.entries()).map(([r,a])=>{var s;return{uid:r,name:(a==null?void 0:a.name)||(r===((s=o.currentUser)==null?void 0:s.uid)?"Yo":"Usuario"),color:(a==null?void 0:a.color)||"#64748b"}}).sort((r,a)=>r.name.localeCompare(a.name,"es"));if(!n.length){t.innerHTML='<div class="muted">Cargando integrantes…</div>';return}t.innerHTML=n.map(r=>`
      <div style="
        display:flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.10);
      ">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color};display:inline-block;"></span>
        <span style="font-weight:800">${Ae(r.name)}</span>
      </div>
    `).join("")}function mi(){var l,i,c;const e=document.getElementById("simModal");e&&e.remove();const t=document.createElement("div");t.id="simModal",t.style.cssText=`
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
    `,document.body.appendChild(t);const n=t,r=d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())},a=()=>{n.style.display="none",Ce=!1,Ie=null,pe=null,document.removeEventListener("keydown",r),document.dispatchEvent(new Event("courses:changed"))};(l=document.getElementById("simExportBtn"))==null||l.addEventListener("click",async d=>{var f,v;if(d.preventDefault(),d.stopPropagation(),!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre activo.");return}if(!await lt({title:"Exportar simulación",text:"¿Quieres exportar esta simulación a tu semestre?",yesText:"Sí, exportar",noText:"Cancelar"}))return;const m=document.getElementById("simExportBtn");m&&(m.disabled=!0,m.textContent="Exportando...");try{await gi(),fa(),pe=null,re=[],K=[],(f=J.clear)==null||f.call(J),(v=V.clear)==null||v.call(V),Ie=null,Ln="",Be=!1,a(),await me(),alert("✅ Simulación exportada. Tu horario oficial fue actualizado y el simulador se reinició.")}catch(x){console.error(x),alert("No se pudo exportar la simulación. Revisa consola.")}finally{m&&(m.disabled=!1,m.textContent="Exportar a mi horario")}}),(i=document.getElementById("simDeleteBtn"))==null||i.addEventListener("click",async d=>{var m,f;d.preventDefault(),d.stopPropagation(),await lt({title:"Eliminar simulación",text:"Esto borrará la simulación guardada y comenzarás desde 0. ¿Continuar?",yesText:"Sí, eliminar",noText:"Cancelar"})&&(fa(),pe=null,re=[],K=[],(m=J.clear)==null||m.call(J),(f=V.clear)==null||f.call(V),Ie=null,Ln="",Be=!1,a())});const s=async()=>{if(!await lt({title:"Salir del simulador",text:"¿Quieres salir del simulador?",yesText:"Sí, salir",noText:"Cancelar"}))return;const p=Ha(),m=await zo({title:"Salir del simulador",message:p?"Tienes cambios sin guardar. ¿Qué quieres hacer?":"No hiciste cambios. ¿Cómo quieres salir?",saveText:"Guardar y salir",discardText:"Salir sin guardar",cancelText:"Cancelar"});if(m!=="cancel"){if(m==="save"){vi(),a();return}if(m==="discard"){Fo(Ie,{persist:!0}),Be=!1,Bn(),me(),a();return}}};(c=document.getElementById("simX"))==null||c.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),s()}),n.addEventListener("click",d=>{d.target===n&&s()}),document.addEventListener("keydown",d=>{n.style.display==="flex"&&d.key==="Escape"&&(d.preventDefault(),s())})}function fi(e,t){const n=K.filter(r=>r.day===e&&r.slot===t);return n.length?Wa(n,!0):""}async function yi(){var r;const e=pe||await yt();if(!e)return;const t=Array.isArray(re)?re:o.courses||[],n=[];for(const a of t){const s=J.get(a.id)||[];if(!s.length)continue;const l=V.get(a.id)||((r=s[0])==null?void 0:r.pid)||null;if(!l)continue;const i=s.find(p=>p.pid===l);if(!i)continue;const c=(a.name||"Ramo").trim(),d=i.section||l;for(const p of i.blocks||[]){const m=e==null?void 0:e[p.slot];!m||m.lunch||n.push({courseId:a.id,day:p.day,slot:p.slot,start:m.start,end:m.end,pos:p.pos||"full",pid:l,displayName:`${c} · ${d}`})}}K=n,Me()}async function cr(e,t){const r=(J.get(e)||[]).find(c=>c.pid===t);if(!r)return;const a=pe||await yt();if(!a)return;K=K.filter(c=>c.courseId!==e),Me();const l=(((o.courses||[]).find(c=>c.id===e)||{}).name||"Ramo").trim(),i=r.section||t;for(const c of r.blocks||[]){const d=a==null?void 0:a[c.slot];!d||d.lunch||K.push({courseId:e,day:c.day,slot:c.slot,start:d.start,end:d.end,pos:c.pos||"full",pid:t,displayName:`${l} · ${i}`})}V.set(e,t),dt(),await je()}async function je(){const e=document.getElementById("simGridHost");if(!e)return;const t=pe||await yt();if(!t){e.innerHTML=`
        <div style="text-align:center; padding:18px;">
          <div style="font-weight:900; margin-bottom:6px;">No hay horario base para esta universidad</div>
          <div class="muted" style="opacity:.8;">Crea un horario personalizado en la vista normal.</div>
        </div>
      `;return}const n=ft(),r=n==="USM"?"Bloque":"Módulo";e.innerHTML=`
      <div class="usm-grid2">
        <div class="cell header">${r}</div>
        ${$e.map(a=>`<div class="cell header">${a}</div>`).join("")}
        ${t.map((a,s)=>`
          <div class="cell mod ${a.lunch?"lunch":""}" data-slot="${s}">
            ${Rn(a,s,n)}
          </div>
          ${$e.map((l,i)=>`
            <div class="cell slot ${a.lunch?"is-lunch":""}"
                data-day="${i}" data-slot="${s}"
                ${a.lunch?'aria-disabled="true"':""}
                style="${a.lunch?"pointer-events:none; opacity:.65;":""}">
                ${fi(i,s)}
            </div>
          `).join("")}
        `).join("")}
      </div>
    `}async function Za(){var s,l,i;if(!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre activo antes de usar el simulador.");return}const e=Ro();if(e&&Array.isArray(e)&&e.length)pe=e;else{const c=await qo();if(!c)return;pe=c,Nr(pe)}er=!1,mi();const t=document.getElementById("simModal");t.style.display="flex",Ce=!0,re=Wo(),K=Bo();const n=Oo();(s=J.clear)==null||s.call(J);for(const[c,d]of n.entries())J.set(c,d||[]);const r=Ho();(l=V.clear)==null||l.call(V);for(const[c,d]of r.entries())d&&V.set(c,d);(!K||!K.length)&&await yi(),document.dispatchEvent(new Event("courses:changed"));const a=document.getElementById("simActiveSemLabel");if(a){const c=((i=o.activeSemesterData)==null?void 0:i.label)||o.activeSemesterId||"—";a.textContent=c}await je(),Ie=Cr(),Ln=Ie,Be=!1}async function gi(){if(!o.currentUser||!o.activeSemesterId){alert("Selecciona un semestre activo.");return}const e=o.currentUser.uid,t=o.activeSemesterId,n=ft()||"UNI_desconocida",r=pe||await yt();if(!r||!Array.isArray(r)||!r.length){alert("No hay slots para guardar la simulación.");return}try{ge[n]=r,localStorage.setItem(`custom_slots_${n}_${e}`,JSON.stringify(r)),await Ka(n,r)}catch(g){console.warn("No se pudo persistir slots base",g)}const a=P(C,"users",e,"semesters",t,"courses"),s=P(C,"users",e,"semesters",t,"schedule"),[l,i]=await Promise.all([q(X(a)),q(X(s))]),c=l.docs.map(g=>({id:g.id,...g.data()})),d=i.docs.map(g=>({id:g.id,...g.data()})),p=c.length>0;let m=!0;p&&(m=!!await lt({title:"Exportar simulación",text:`Ya tienes ramos guardados en este semestre.

¿Quieres BORRAR tus ramos anteriores y dejar SOLO los ramos de la simulación?`,yesText:"Sí, borrar anteriores",noText:"No, que convivan"})),m&&(await dr(s),await dr(a));const f=m?[]:c,v=m?[]:d,x=new Map;for(const g of f){const M=Dt((g==null?void 0:g.code)||(g==null?void 0:g.codigo)||"");M&&(x.has(M)||x.set(M,new Set),x.get(M).add(g.id))}const y=new Map;for(const g of f){const M=Dt((g==null?void 0:g.name)||(g==null?void 0:g.nombre)||"");M&&y.set(M,g.id)}const h=new Map,E=(re||[]).filter(g=>String(g.id||"").startsWith("SIM_"));for(const g of E){const M={name:(g.name||"").trim()||"Ramo",code:(g.code||"").trim()||"",professor:g.professor||"",section:g.section||"",color:Nt(g.color)?g.color:"#3B82F6",asistencia:!!g.asistencia,createdAt:Date.now()},S=Dt(M.code);if(!m&&S&&x.has(S)){const L=Array.from(x.get(S)||[]);if(L.length){const U=(await q(X(s))).docs.filter(B=>{var T;return L.includes((T=B.data())==null?void 0:T.courseId)});for(const B of U)await fe(B.ref);for(const B of L){await fe(N(C,"users",e,"semesters",t,"courses",B));for(const[T,O]of y.entries())O===B&&y.delete(T)}}x.delete(S)}if(!m&&!S){const L=Dt(M.name),I=y.get(L);if(I){h.set(g.id,I);continue}}const b=await Ee(a,M);S&&(x.has(S)||x.set(S,new Set),x.get(S).add(b.id)),h.set(g.id,b.id);const w=Dt(M.name);w&&y.set(w,b.id)}const k=await q(X(a,be("createdAt")));o.courses=k.docs.map(g=>({id:g.id,...g.data()})),document.dispatchEvent(new Event("courses:changed"));const $=g=>{const M=String(g.courseId||""),S=Number(g.day),b=Number(g.slot),w=String(g.pos||"full"),L=String(g.hpos||"single"),I=String(g.pid||g.parallelPid||""),U=String(g.displayName||"").trim(),B=String(g.start||""),T=String(g.end||"");return[M,S,b,w,L,I,U,B,T].join("|")},A=new Set((v||[]).map(g=>$({courseId:g.courseId,day:g.day,slot:g.slot,pos:g.pos,hpos:g.hpos,pid:g.parallelPid,displayName:g.displayName,start:g.start,end:g.end})));for(const g of K||[]){const M=h.get(g.courseId)||g.courseId;if(String(M).startsWith("SIM_"))continue;const S=r[g.slot];if(!S||S.lunch)continue;const b={courseId:M,day:g.day,slot:g.slot,start:S.start,end:S.end,pos:g.pos||"full",hpos:g.hpos||"single",parallelPid:g.pid||g.parallelPid||null,displayName:typeof g.displayName=="string"&&g.displayName.trim()?g.displayName.trim():null,createdAt:Date.now()};if(!m){const w=$(b);if(A.has(w))continue;A.add(w)}await Ee(s,b)}}function Dt(e){return String(e||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}async function dr(e){const t=await q(e);for(const n of t.docs)await fe(n.ref)}function vi(){Nr(pe),On(re),Va(),Tr(),Ur(),Ie=Cr(),Ln=Ie,Be=!1}function fa(){try{localStorage.removeItem(Mr())}catch{}try{localStorage.removeItem(Pr())}catch{}try{localStorage.removeItem(Ar())}catch{}try{localStorage.removeItem($r())}catch{}try{localStorage.removeItem(Ir())}catch{}try{localStorage.removeItem(_r())}catch{}}const ya=Object.freeze(Object.defineProperty({__proto__:null,MAYOR_SLOTS:Xt,USM_SLOTS:mt,getMySchedule:Qo,initSchedule:qa,onActiveSemesterChanged:Tt,openSimSchedule:Za,overlapWithPair:ei,refreshCourseOptions:Ao,removeBlock:ti,setRoom:Xo},Symbol.toStringTag,{value:"Module"}));let j=new Date,at=null,Gt=[],ur=[],Et={course:!0,personal:!0},pr=!1,Rt=null,hn=null,xn=null,st=null,Mn=[],Ft="#ff69b4",ut=null;const mr=new Map,zt=new Map;function bi(e){Rt=e}function hi(){try{Rt==null||Rt()}finally{Rt=null}}function xi(){ss();const e=u("page-calendario");if(e){e.classList.add("hidden");const t=e.querySelector("[data-cal-grid]")||e.querySelector(".cal-grid");t&&(t.innerHTML="")}}function wi(){var e;(e=u("page-calendario"))==null||e.classList.remove("hidden")}function Si(){return ke(Ft)?Ft:"#ff69b4"}function Hn(){const e=o.profileData||{},t=o.currentUser||{};return typeof e.favoriteColor=="string"&&ke(e.favoriteColor)?e.favoriteColor:typeof t.favoriteColor=="string"&&ke(t.favoriteColor)?t.favoriteColor:"#3B82F6"}function ke(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Ei(e,t="#3B82F6"){if(!e)return t;const n=(o.courses||[]).find(r=>r.id===e);return ke(n==null?void 0:n.color)?n.color:t}function Ci(e,t=Hn()){if(e!=null&&e.courseId){const n=(o.courses||[]).find(r=>r.id===e.courseId);if(ke(n==null?void 0:n.color))return n.color}return ke(e==null?void 0:e.color)?e.color:t}function Rr(e){try{const t=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),r=parseInt(e.slice(5,7),16);return(t*299+n*587+r*114)/1e3>=160?"#111":"#fff"}catch{return"#0e0e0e"}}function Xa(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return Xa(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function Qa(){var r,a,s,l;const e=(r=o.currentUser)==null?void 0:r.uid,t=[o.partyMembers,o.party,o.partyData,o.activeParty,(a=o.shared)==null?void 0:a.party,(s=o.shared)==null?void 0:s.partyData,(l=o.shared)==null?void 0:l.partyMembers];let n=[];for(const i of t)if(n=Xa(i),n.length)break;return[...new Set(n.filter(Boolean))].filter(i=>i!==e)}const ve=Object.create(null);function Vt(e={},t={}){return typeof t.displayName=="string"&&t.displayName.trim()?t.displayName.trim():typeof t.name=="string"&&t.name.trim()?t.name.trim():typeof e.displayName=="string"&&e.displayName.trim()?e.displayName.trim():typeof e.name=="string"&&e.name.trim()?e.name.trim():"Usuario"}function Wt(e={},t={}){return typeof t.favoriteColor=="string"&&ke(t.favoriteColor)?t.favoriteColor:typeof e.favoriteColor=="string"&&ke(e.favoriteColor)?e.favoriteColor:"#64748b"}async function es(e){if(!e)return{name:"Usuario",favoriteColor:"#64748b"};if(ve[e])return ve[e];try{const t=N(C,"users",e),n=N(C,"users",e,"profile","profile"),[r,a]=await Promise.all([te(t),te(n)]),s=r.exists()?r.data()||{}:{},l=a.exists()?a.data()||{}:{},i={name:Vt(s,l),favoriteColor:Wt(s,l)};return ve[e]=i,i}catch(t){return console.warn("cal_loadMemberProfile error",t),ve[e]={name:"Usuario",favoriteColor:"#64748b"},ve[e]}}async function Li(){const e=Qa();if(!e.length)return[];const t=await Promise.all(e.map(n=>es(n)));return e.map((n,r)=>{var a,s;return{uid:n,name:((a=t[r])==null?void 0:a.name)||"Usuario",favoriteColor:((s=t[r])==null?void 0:s.favoriteColor)||"#64748b"}})}async function Je(){const e=u("calendarPartyPicker");if(!e)return;const t=await Li();if(!t.length){e.innerHTML='<div class="muted">No hay integrantes disponibles en tu party.</div>';return}e.innerHTML=t.map(n=>{const r=n.uid===ut;return`
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
    `}).join(""),e.querySelectorAll(".calendar-party-chip").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.uid;r&&(ut=r,await Je(),await Kt())})})}function ki(){const e=u("calFilterBtn"),t=u("calFilterMenu"),n=u("calFilterChkCourse"),r=u("calFilterChkPersonal");if(!e||!t||!n||!r)return;const a=()=>{n.checked=!!Et.course,r.checked=!!Et.personal};e.addEventListener("click",s=>{s.stopPropagation(),t.classList.toggle("hidden"),a()}),n.addEventListener("change",()=>{Et.course=!!n.checked,Ke()}),r.addEventListener("change",()=>{Et.personal=!!r.checked,Ke()}),document.addEventListener("click",s=>{!t.contains(s.target)&&s.target!==e&&t.classList.add("hidden")}),a()}function ts(){pr||(pr=!0,Mi(),Ai(),ki(),Or(),qt(),It(),We(),ns(),rs(),document.addEventListener("pair:ready",async()=>{await Je(),await Kt()}),document.addEventListener("pair:ready",async()=>{await An(),kt()}),document.addEventListener("profile:changed",()=>{Ke(),xe()}),document.addEventListener("profile:ready",()=>{Ke(),xe()}),Je(),Kt(),An(),$i())}function Jt(){pr||ts()}function ct(){Jt(),at&&(at(),at=null),ns(),rs(),qt(),We(),kt(),ut&&Kt(),An()}function Ii(){Jt(),Ke(),It(),Mt(),xe()}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",Jt):Jt();document.addEventListener("route:calendario",Jt);function Mi(){const e=u("page-calendario");e&&(e.innerHTML=`
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
  `)}function Ai(){var e,t,n,r;(e=u("calPrev"))==null||e.addEventListener("click",()=>{j=ga(j,-1),dn(),qt(),We(),kt()}),(t=u("calNext"))==null||t.addEventListener("click",()=>{j=ga(j,1),dn(),qt(),We(),kt()}),(n=u("calToday"))==null||n.addEventListener("click",()=>{j=new Date,dn(),qt(),We(),kt()}),(r=u("calImportGoogle"))==null||r.addEventListener("click",Pi),dn()}function dn(){const e=j.getFullYear(),t=j.getMonth(),n=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],r=u("calTitle");r&&(r.textContent=`Calendario · ${n[t][0].toUpperCase()}${n[t].slice(1)} ${e}`)}function ns(){var t;const e=u("calActiveSem");e&&(e.textContent=((t=o.activeSemesterData)==null?void 0:t.label)||"—")}function $i(){const e=u("cal-subtab-propio"),t=u("cal-subtab-compartido"),n=u("cal-subtab-combinado"),r=u("cal-propio"),a=u("cal-compartido"),s=u("cal-combinado");function l(){e.classList.add("active"),t.classList.remove("active"),n.classList.remove("active"),r.classList.remove("hidden"),a.classList.add("hidden"),s.classList.add("hidden")}async function i(){if(t.classList.add("active"),e.classList.remove("active"),n.classList.remove("active"),a.classList.remove("hidden"),r.classList.add("hidden"),s.classList.add("hidden"),await Je(),We(),!ut){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}u("calSharedHint").textContent="",await Kt()}async function c(){await An(),n.classList.add("active"),e.classList.remove("active"),t.classList.remove("active"),s.classList.remove("hidden"),r.classList.add("hidden"),a.classList.add("hidden"),kt(),await Bi()}e==null||e.addEventListener("click",l),t==null||t.addEventListener("click",i),n==null||n.addEventListener("click",c),l()}function rs(){if(at&&(at(),at=null),Gt=[],ur=[],Ke(),It(),!o.currentUser||!o.activeSemesterId)return;const e=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"calendar");at=Y(X(e,be("date","asc")),n=>{Gt=n.docs.map(r=>({id:r.id,...r.data()})),Ke(),It()});const t=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses");Y(X(t,be("name","asc")),n=>{ur=n.docs.map(r=>({id:r.id,...r.data()})),It()})}async function Kt(){as(),Mn=[],Ft="#ff69b4",We();const e=ut;if(!e){u("calSharedHint").textContent="Selecciona un integrante de tu party para ver su calendario.";return}if(u("calSharedHint").textContent="",!await Ni())return;st&&(st(),st=null);const n=Y(N(C,"users",e),async a=>{const s=a.exists()?a.data()||{}:{},l=ve[e]||{},i={displayName:s.displayName,name:s.name,favoriteColor:s.favoriteColor},c={displayName:l._profDisplayName,name:l._profName,favoriteColor:l._profFavoriteColor},d={name:Vt(i,c),favoriteColor:Wt(i,c),_rootDisplayName:s.displayName||null,_rootName:s.name||null,_rootFavoriteColor:s.favoriteColor||null,_profDisplayName:l._profDisplayName||null,_profName:l._profName||null,_profFavoriteColor:l._profFavoriteColor||null};ve[e]=d,ke(d.favoriteColor)&&(Ft=d.favoriteColor),Mt(),xe(),await Je()}),r=Y(N(C,"users",e,"profile","profile"),async a=>{const s=a.exists()?a.data()||{}:{},l=ve[e]||{},i={displayName:l._rootDisplayName,name:l._rootName,favoriteColor:l._rootFavoriteColor},c={displayName:s.displayName,name:s.name,favoriteColor:s.favoriteColor},d={name:Vt(i,c),favoriteColor:Wt(i,c),_rootDisplayName:l._rootDisplayName||null,_rootName:l._rootName||null,_rootFavoriteColor:l._rootFavoriteColor||null,_profDisplayName:s.displayName||null,_profName:s.name||null,_profFavoriteColor:s.favoriteColor||null};ve[e]=d,ke(d.favoriteColor)&&(Ft=d.favoriteColor),Mt(),xe(),await Je()});st=()=>{try{n==null||n()}catch{}try{r==null||r()}catch{}}}function as(){hn&&(hn(),hn=null),xn&&(xn(),xn=null),st&&(st(),st=null)}function ss(){for(const[,e]of mr.entries())try{e==null||e()}catch{}mr.clear(),zt.clear()}async function An(){var n;ss();const e=Qa();if(!e.length){xe();return}const t=((n=o.activeSemesterData)==null?void 0:n.label)||null;if(!t){xe();return}for(const r of e)try{await es(r);const a=Y(N(C,"users",r),async p=>{const m=p.exists()?p.data()||{}:{},f=ve[r]||{},v={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor},x={displayName:f._profDisplayName,name:f._profName,favoriteColor:f._profFavoriteColor};ve[r]={name:Vt(v,x),favoriteColor:Wt(v,x),_rootDisplayName:m.displayName||null,_rootName:m.name||null,_rootFavoriteColor:m.favoriteColor||null,_profDisplayName:f._profDisplayName||null,_profName:f._profName||null,_profFavoriteColor:f._profFavoriteColor||null},xe(),await Je()}),s=Y(N(C,"users",r,"profile","profile"),async p=>{const m=p.exists()?p.data()||{}:{},f=ve[r]||{},v={displayName:f._rootDisplayName,name:f._rootName,favoriteColor:f._rootFavoriteColor},x={displayName:m.displayName,name:m.name,favoriteColor:m.favoriteColor};ve[r]={name:Vt(v,x),favoriteColor:Wt(v,x),_rootDisplayName:f._rootDisplayName||null,_rootName:f._rootName||null,_rootFavoriteColor:f._rootFavoriteColor||null,_profDisplayName:m.displayName||null,_profName:m.name||null,_profFavoriteColor:m.favoriteColor||null},xe(),await Je()}),l=P(C,"users",r,"semesters"),i=await q(l);let c=null;i.forEach(p=>{var f;(((f=p.data())==null?void 0:f.label)||"").trim()===t&&(c=p.id)});let d=null;if(c){const p=P(C,"users",r,"semesters",c,"calendar");d=Y(X(p,be("date","asc")),m=>{zt.set(r,m.docs.map(f=>({id:f.id,...f.data(),ownerUid:r}))),xe()})}else zt.set(r,[]),xe();mr.set(r,()=>{try{a==null||a()}catch{}try{s==null||s()}catch{}try{d==null||d()}catch{}})}catch(a){console.warn("subscribeCombinedPartyMembers error",r,a),zt.set(r,[])}xe()}async function Ni(){var n;const e=ut;if(!e)return null;const t=((n=o.activeSemesterData)==null?void 0:n.label)||null;if(!t)return u("calSharedHint").textContent="No tienes semestre activo seleccionado.",null;try{const r=P(C,"users",e,"semesters"),a=await q(r);let s=null;if(a.forEach(i=>{var d;const c=(((d=i.data())==null?void 0:d.label)||"").trim();c===t&&(s={id:i.id,label:c})}),o.shared=o.shared||{},o.shared.calendar=o.shared.calendar||{},s)return o.shared.calendar.semId=s.id,u("calSharedHint").textContent="",await Ti(s.id),s.id;o.shared.calendar.semId=null;const l=u("calSharedGrid");return l&&(l.innerHTML=`<div class="muted">Esta persona no tiene el semestre <b>${t}</b> creado.</div>`),u("calSharedHint").textContent="Se intenta mostrar el mismo semestre activo que tienes tú.",null}catch(r){return console.error("populateSharedSemesters error",r),u("calSharedHint").textContent="Error al cargar el calendario compartido.",null}}async function Ti(e){as(),Mn=[],We();const t=ut;if(!t||!e)return;const n=P(C,"users",t,"semesters",e,"courses");xn=Y(X(n,be("name")),a=>{a.docs.map(s=>({id:s.id,...s.data()})),Mt()});const r=P(C,"users",t,"semesters",e,"calendar");hn=Y(X(r,be("date","asc")),a=>{Mn=a.docs.map(s=>({id:s.id,...s.data()})),Mt()})}function Or(){if(u("calModal"))return;const e=document.createElement("div");e.id="calModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("calModalBackdrop").addEventListener("click",t),u("calEvtCancel").addEventListener("click",t);const n=u("calEvtCourse"),r=u("calEvtIsPersonal");function a(){!n||!r||(r.checked?(n.value="",n.disabled=!0,n.style.opacity="0.6"):(n.disabled=!1,n.style.opacity="1"))}r==null||r.addEventListener("change",a),n==null||n.addEventListener("change",()=>{n.value&&(r.checked=!1,a())}),u("calEvtSave").addEventListener("click",async()=>{var E;if(!o.currentUser||!o.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}const s=(u("calEvtTitle").value||"").trim(),l=u("calEvtDate").value||"",i=u("calEvtStart").value||null,c=u("calEvtEnd").value||null,d=!!((E=u("calEvtIsPersonal"))!=null&&E.checked),p=d?null:u("calEvtCourse").value||null,m=u("calEvtRepeat").value||"",f=u("calEvtPersistent").value==="true",v=d?"personal":"course",x=p?Ei(p):Hn();if(!s)return alert("Ingresa un título.");if(!l)return alert("Selecciona una fecha.");const y=e.dataset.editingId||null,h=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"calendar");try{y?(await ae(N(h,y),{title:s,date:l,start:i,end:c,courseId:p,kind:v,color:x,repeat:m?{every:m,interval:1}:null,persistent:f,updatedAt:Date.now()}),console.log("[Calendar] Evento actualizado:",s)):(await Ee(h,{title:s,date:l,start:i,end:c,courseId:p,kind:v,color:x,repeat:m?{every:m,interval:1}:null,persistent:f,createdAt:Date.now()}),console.log("[Calendar] Evento creado:",s)),t()}catch(k){console.error(k),alert("No se pudo guardar el evento.")}finally{e.dataset.editingId=""}})}function Ui(){if(u("gcalImportModal"))return;const e=document.createElement("div");e.id="gcalImportModal",e.className="modal",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>e.classList.remove("active");u("gcalImportBackdrop").addEventListener("click",t),u("gcalRangeCancel").addEventListener("click",t),u("gcalRangeConfirm").addEventListener("click",async()=>{if(!o.currentUser||!o.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}const n=u("gcalRangeStart").value,r=u("gcalRangeEnd").value;if(!n||!r){alert("Selecciona ambas fechas (inicio y término).");return}const[a,s,l]=n.split("-").map(Number),[i,c,d]=r.split("-").map(Number),p=new Date(a,s-1,l,0,0,0),m=new Date(i,c-1,d+1,0,0,0);if(m<=p){alert("La fecha de término debe ser posterior a la de inicio.");return}try{await Qi(p,m),t()}catch(f){console.error("Error al importar rango desde Google Calendar:",f),alert("Ocurrió un error al importar eventos de Google Calendar.")}})}function Pi(){if(!o.currentUser||!o.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres" e inicia sesión.');return}Ui();const e=j.getFullYear(),t=j.getMonth(),n=new Date(e,t+1,0).getDate(),r=u("gcalRangeStart"),a=u("gcalRangeEnd");r&&!r.value&&(r.value=Ze(e,t+1,1)),a&&!a.value&&(a.value=Ze(e,t+1,n)),u("gcalImportModal").classList.add("active")}function Di(e){if(!o.currentUser||!o.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}Or();const t=u("calModal"),n=u("calModalTitle"),r=u("calEvtSave");t&&(t.dataset.editingId=""),n&&(n.textContent="Nuevo evento"),r&&(r.textContent="Guardar");const a=u("calEvtDate");a&&(a.value=e);const s=u("calEvtTitle");s&&(s.value="");const l=u("calEvtStart");l&&(l.value="");const i=u("calEvtEnd");i&&(i.value="");const c=u("calEvtCourse");c&&(c.innerHTML='<option value="">(Sin asignar)</option>',(o.courses||[]).forEach(p=>{const m=document.createElement("option");m.value=p.id,m.textContent=p.name,c.appendChild(m)}));const d=u("calEvtIsPersonal");d&&(d.checked=!1),c&&(c.disabled=!1,c.style.opacity="1"),u("calModal").classList.add("active")}function qt(){const e=u("calGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,l)=>{const i=l+1,c=Ze(j.getFullYear(),j.getMonth()+1,i);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${i}</div>
          <div class="cal-events" id="ce-${c}"></div>
        </div>
      `}).join("")}
  `,e.querySelectorAll(".cal-cell.day").forEach(s=>{s.addEventListener("click",()=>Di(s.dataset.date))}),Ke(),It()}function _i(e){var i;if(!o.currentUser||!o.activeSemesterId){alert('Primero activa un semestre en la pestaña "Semestres".');return}Or();const t=u("calModal"),n=u("calModalTitle"),r=u("calEvtSave");t.dataset.editingId=e.id,n.textContent="Editar evento",r.textContent="Guardar cambios",u("calEvtTitle").value=e.title||"",u("calEvtDate").value=e.date||"",u("calEvtStart").value=e.start||"",u("calEvtEnd").value=e.end||"",u("calEvtRepeat").value=((i=e.repeat)==null?void 0:i.every)||"",u("calEvtPersistent").value=e.persistent?"true":"";const a=u("calEvtCourse");a.innerHTML='<option value="">(Sin asignar)</option>',(o.courses||[]).forEach(c=>{const d=document.createElement("option");d.value=c.id,d.textContent=c.name,c.id===e.courseId&&(d.selected=!0),a.appendChild(d)});const s=u("calEvtIsPersonal"),l=e.kind||(e.courseId?"course":"personal");s&&(s.checked=l==="personal"),a&&(l==="personal"?(a.value="",a.disabled=!0,a.style.opacity="0.6"):(a.disabled=!1,a.style.opacity="1")),t.classList.add("active")}function We(){const e=u("calSharedGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,l)=>{const i=l+1,c=Ze(j.getFullYear(),j.getMonth()+1,i);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${i}</div>
          <div class="cal-events" id="sce-${c}"></div>
        </div>
      `}).join("")}
  `,Mt()}function kt(){const e=u("calCombinedGrid");if(!e)return;const n=(new Date(j.getFullYear(),j.getMonth(),1).getDay()+6)%7,r=new Date(j.getFullYear(),j.getMonth()+1,0).getDate(),a=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];e.innerHTML=`
    ${a.map(s=>`<div class="cal-cell head">${s}</div>`).join("")}
    ${Array.from({length:n}).map(()=>'<div class="cal-cell empty"></div>').join("")}
    ${Array.from({length:r}).map((s,l)=>{const i=l+1,c=Ze(j.getFullYear(),j.getMonth()+1,i);return`
        <div class="cal-cell day" data-date="${c}">
          <div class="cal-daynum">${i}</div>
          <div class="cal-events" id="bce-${c}"></div>
        </div>
      `}).join("")}
  `,xe()}function xe(){document.querySelectorAll(".cal-events").forEach(a=>{var s;(s=a.id)!=null&&s.startsWith("bce-")&&(a.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`,t=Gt.filter(a=>String(a.date||"").startsWith(e)).map(a=>{var s;return{...a,isMine:!0,ownerUid:((s=o.currentUser)==null?void 0:s.uid)||null}}),n=[];for(const[a,s]of zt.entries())for(const l of s||[])String(l.date||"").startsWith(e)&&n.push({...l,isMine:!1,ownerUid:a});[...t,...n].forEach(a=>{const s=u("bce-"+a.date);if(!s)return;let l="#64748b";if(a.isMine)l=Hn();else{const p=ve[a.ownerUid]||{};l=ke(p.favoriteColor)?p.favoriteColor:"#64748b"}const i=Rr(l),c=a.start&&a.end?`${a.start}–${a.end} · `:a.start?`${a.start} · `:"",d=document.createElement("div");d.className="cal-evt",d.textContent=`${c}${a.title||"(sin título)"}`,d.style.background=l,d.style.color=i,d.style.opacity=a.isMine?1:.75,d.style.border="1px solid rgba(0,0,0,0.25)",s.appendChild(d)})}async function Bi(){const e=u("calCombinedRemindersList");if(e){e.innerHTML='<div class="loading"></div>';try{const t=await os({range:"today"}),n=o.pairOtherUid?await is({range:"today"}):[],r=[...t.map(a=>({...a,owner:"Tú"})),...n.map(a=>({...a,owner:"Dúo"}))].sort((a,s)=>(a.datetime||0)-(s.datetime||0));e.innerHTML=r.length?r.map(a=>{var s;return`
          <div class="grade-item">
            <div>
              <strong>${a.title||"(sin título)"}</strong>
              <div class="muted">${a.owner} · ${((s=a.datetime)==null?void 0:s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))||""}</div>
            </div>
          </div>
        `}).join(""):'<div class="muted">Sin recordatorios para hoy.</div>'}catch(t){console.error("loadCombinedReminders",t),e.innerHTML='<div class="muted">Error al cargar recordatorios.</div>'}}}function Ri(e){var r;const t=[];for(const a of e)if(t.push(a),(r=a.repeat)!=null&&r.every){const s=new Date(a.date);for(let l=1;l<=24;l++){const i=new Date(s);a.repeat.every==="day"?i.setDate(s.getDate()+l*(a.repeat.interval||1)):a.repeat.every==="month"?i.setMonth(s.getMonth()+l*(a.repeat.interval||1)):a.repeat.every==="year"&&i.setFullYear(s.getFullYear()+l*(a.repeat.interval||1));const c=Ze(i.getFullYear(),i.getMonth()+1,i.getDate());if(Math.abs(i-s)/(1e3*60*60*24)>365)break;t.push({...a,date:c})}}return t}function It(){const e=u("calLegend");if(!e)return;const t=(ur||[]).filter(n=>(n==null?void 0:n.name)&&ke(n==null?void 0:n.color)).map(n=>({id:n.id,name:n.name,color:n.color}));if(!t.length){e.innerHTML="";return}e.innerHTML=`
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
  `}function Ke(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")||(n.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;let t=Ri(Gt).filter(n=>String(n.date||"").startsWith(e));t=t.filter(n=>{const r=n.kind||(n.courseId?"course":"personal");return!(r==="course"&&!Et.course||r==="personal"&&!Et.personal)}),t.forEach(n=>{const r=u("ce-"+n.date);if(!r)return;const a=Ci(n,Hn()),s=Rr(a),l=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",i=document.createElement("div");i.className="cal-evt",i.style.background=a,i.style.color=s,i.style.border="1px solid rgba(0,0,0,0.25)",i.style.position="relative",i.style.cursor="pointer";const c=document.createElement("span");c.textContent=`${l}${n.title||"(sin título)"}`,i.appendChild(c);const d=document.createElement("span");d.textContent="✕",d.className="cal-del",d.title="Eliminar evento",d.style.position="absolute",d.style.top="2px",d.style.right="4px",d.style.fontWeight="bold",d.style.color="#fff8",d.style.cursor="pointer",d.addEventListener("click",async p=>{if(p.stopPropagation(),!(!o.currentUser||!o.activeSemesterId||!n.id)&&confirm(`¿Eliminar evento "${n.title}"?`))try{await fe(N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"calendar",n.id))}catch(m){console.error(m)}}),i.appendChild(d),i.addEventListener("click",p=>{p.stopPropagation(),_i(n)}),r.appendChild(i)})}function Mt(){document.querySelectorAll(".cal-events").forEach(n=>{var r;(r=n.id)!=null&&r.startsWith("sce-")&&(n.innerHTML="")});const e=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;Mn.filter(n=>String(n.date||"").startsWith(e)).forEach(n=>{const r=u("sce-"+n.date);if(!r)return;const a=Si(),s=Rr(a),l=n.start&&n.end?`${n.start}–${n.end} · `:n.start?`${n.start} · `:"",i=document.createElement("div");i.className="cal-evt",i.textContent=`${l}${n.title||"(sin título)"}`,i.style.background=a,i.style.color=s,i.style.border="1px solid rgba(0,0,0,0.25)",r.appendChild(i)})}function ga(e,t){const n=new Date(e.getTime());return n.setMonth(n.getMonth()+t),n}function Ze(e,t,n){return`${e}-${String(t).padStart(2,"0")}-${String(n).padStart(2,"0")}`}async function os(e={}){if(!o.currentUser)throw new Error("No logueado");const{range:t="today",dates:n,months:r,years:a,ranges:s}=e,l=P(C,"users",o.currentUser.uid,"reminders");let c=(await q(l)).docs.map(p=>{const m=p.data();return{id:p.id,...m,datetime:wn(m.datetime)}});if(c=c.filter(p=>!p.suspended),Array.isArray(s)&&s.length>0){const p=s.map(m=>{const f=wn(m.start),v=wn(m.end);return!f||!v?null:{start:f,end:v}}).filter(Boolean);return c=c.filter(m=>m.datetime&&p.some(f=>m.datetime>=f.start&&m.datetime<f.end)),c}if(Array.isArray(n)&&n.length>0){const p=new Set(n.map(m=>ha(m)).filter(Boolean));return c=c.filter(m=>{if(!m.datetime)return!1;const f=ha(m.datetime);return p.has(f)}),c}if(Array.isArray(r)&&r.length>0){const p=r.map(m=>{if(typeof m=="string"){const[f,v]=m.split("-").map(Number);return!f||!v?null:{year:f,month:v}}else if(m&&typeof m=="object"){const f=Number(m.year??m.y),v=Number(m.month??m.m);return!f||!v?null:{year:f,month:v}}return null}).filter(Boolean);return c=c.filter(m=>{if(!m.datetime)return!1;const f=m.datetime.getFullYear(),v=m.datetime.getMonth()+1;return p.some(x=>x.year===f&&x.month===v)}),c}if(Array.isArray(a)&&a.length>0){const p=new Set(a.map(m=>Number(m)));return c=c.filter(m=>m.datetime&&p.has(m.datetime.getFullYear())),c}const d=new Date;if(t==="today"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()),m=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);return c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}if(t==="week"){const p=new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay()),m=new Date(p);return m.setDate(p.getDate()+7),c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}if(t==="month"){const p=new Date(d.getFullYear(),d.getMonth(),1),m=new Date(d.getFullYear(),d.getMonth()+1,1);return c.filter(f=>f.datetime&&f.datetime>=p&&f.datetime<m)}return c}async function Oi(e){if(!o.currentUser)throw new Error("No logueado");const t=N(C,"users",o.currentUser.uid,"reminders",e);return await ae(t,{suspended:!1,updatedAt:Date.now()}),{ok:!0}}async function Hi(){if(!o.currentUser)throw new Error("No logueado");const e=P(C,"users",o.currentUser.uid,"reminders"),t=X(e,Ta("suspended","==",!0));return(await q(t)).docs.map(r=>({id:r.id,...r.data()}))}async function Fi({reminderId:e}){if(!o.currentUser)throw new Error("No logueado");if(!e)throw new Error("Falta ID");const t=N(C,"users",o.currentUser.uid,"reminders",e);return await ae(t,{suspended:!0,updatedAt:Date.now()}),{ok:!0}}async function is({range:e="today"}={}){if(!o.pairOtherUid)throw new Error("No tienes dúo");const t=P(C,"users",o.pairOtherUid,"reminders"),n=await q(t),r=l=>l?typeof l=="number"?new Date(l):l.toDate?l.toDate():new Date(l):null,a=n.docs.map(l=>{const i=l.data();return{id:l.id,...i,datetime:r(i.datetime)}}),s=new Date;if(e==="today"){const l=new Date(s.getFullYear(),s.getMonth(),s.getDate()),i=new Date(s.getFullYear(),s.getMonth(),s.getDate()+1);return a.filter(c=>c.datetime&&c.datetime>=l&&c.datetime<i)}if(e==="week"){const l=new Date(s.getFullYear(),s.getMonth(),s.getDate()-s.getDay()),i=new Date(l);return i.setDate(l.getDate()+7),a.filter(c=>c.datetime&&c.datetime>=l&&c.datetime<i)}return a}const zi="489697428786-m2hkvn9ohor0unrhk6g5i3g7vqla86c4.apps.googleusercontent.com",qi="AIzaSyA6M73T0k3yPyseAZnkPxBO5GYXPeL8dlQ",ji=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],Yi="https://www.googleapis.com/auth/calendar.readonly";let va=!1,ba=!1,$n=null;function Gi(){return new Promise((e,t)=>{if(window.gapi&&window.gapi.load)return e();const n=document.createElement("script");n.src="https://apis.google.com/js/api.js",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar gapi")),document.head.appendChild(n)})}function Vi(){return new Promise((e,t)=>{if(window.google&&window.google.accounts)return e();const n=document.createElement("script");n.src="https://accounts.google.com/gsi/client",n.async=!0,n.defer=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("No se pudo cargar Google Identity Services")),document.head.appendChild(n)})}async function Wi(){va||(await Gi(),await new Promise(e=>{window.gapi.load("client",e)}),await window.gapi.client.init({apiKey:qi,discoveryDocs:ji}),va=!0)}async function Ji(){ba&&$n||(await Vi(),$n=window.google.accounts.oauth2.initTokenClient({client_id:zi,scope:Yi,callback:()=>{}}),ba=!0)}async function Ki(){return await Ji(),new Promise((e,t)=>{$n.callback=n=>{if(n.error){console.error("[OAuth error]",n),t(n);return}e(n.access_token)},$n.requestAccessToken({prompt:""})})}async function Zi(e,t){await Wi();const n=await Ki();window.gapi.client.setToken({access_token:n});const r=await window.gapi.client.calendar.events.list({calendarId:"primary",timeMin:e.toISOString(),timeMax:t.toISOString(),showDeleted:!1,singleEvents:!0,orderBy:"startTime"});return console.log("[Calendar] Respuesta completa de Google:",r),r.result.items||[]}function Xi(e){var i,c,d,p;if(e.start&&e.start.date&&!e.start.dateTime)return{date:e.start.date,startTime:null,endTime:null,allDay:!0};const t=new Date(((i=e.start)==null?void 0:i.dateTime)||((c=e.start)==null?void 0:c.date)),n=new Date(((d=e.end)==null?void 0:d.dateTime)||((p=e.end)==null?void 0:p.date)||t),r=Ze(t.getFullYear(),t.getMonth()+1,t.getDate()),a=m=>String(m).padStart(2,"0"),s=`${a(t.getHours())}:${a(t.getMinutes())}`,l=`${a(n.getHours())}:${a(n.getMinutes())}`;return{date:r,startTime:s,endTime:l,allDay:!1}}function wn(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="number")return new Date(e);if(typeof e=="string"){const t=new Date(e);return isNaN(t)?null:t}return e.toDate?e.toDate():null}function ha(e){const t=wn(e);return t?Ze(t.getFullYear(),t.getMonth()+1,t.getDate()):null}async function Qi(e,t){if(!o.currentUser||!o.activeSemesterId)throw new Error("Sin usuario o semestre activo");try{const n=await Zi(e,t);if(!n.length){alert("No se encontraron eventos en tu Google Calendar para el rango seleccionado.");return}const r=new Set((Gt||[]).filter(i=>i.gcalId).map(i=>i.gcalId)),a=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"calendar");let s=0;const l=[];for(const i of n){if(r.has(i.id))continue;const{date:c,startTime:d,endTime:p,allDay:m}=Xi(i);if(!c)continue;const f={title:i.summary||"(sin título)",date:c,start:m?null:d,end:m?null:p,allDay:!!m,courseId:null,color:null,source:"google",gcalId:i.id,createdAt:Date.now()};l.push(Ee(a,f)),s++}if(!l.length){alert("Los eventos de ese rango ya estaban importados.");return}await Promise.all(l),alert(`Se importaron ${s} evento(s) desde tu Google Calendar para el rango seleccionado.`)}catch(n){console.error("Error al importar Google Calendar:",n),alert("Ocurrió un error al importar eventos de Google Calendar. Revisa la consola para más detalles.")}}const xa=Object.freeze(Object.defineProperty({__proto__:null,clearCalendarUI:xi,initCalendar:ts,listPairReminders:is,listReminders:os,listSuspendedReminders:Hi,onActiveSemesterChanged:ct,onCoursesChanged:Ii,registerCalendarUnsub:bi,resumeReminder:Oi,showCalendarUI:wi,stopCalendarSub:hi,suspendReminder:Fi},Symbol.toStringTag,{value:"Module"}));let un=null;function Hr(){if(!o.currentUser||!o.activeSemesterId)return;const e=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses");Y(e,t=>{const n=t.docs.filter(a=>a.data().asistencia),r=u("attCourseSel");r&&(r.innerHTML='<option value="" disabled selected>Elige un ramo…</option>',n.forEach(a=>{r.innerHTML+=`<option value="${a.id}">${a.data().name}</option>`})),r==null||r.addEventListener("change",()=>{const a=r.value,s=n.find(l=>l.id===a);el(s?[s]:[])})})}function el(e){const t=u("asistenciaList");t&&(t.innerHTML="",e.forEach(n=>{const r=n.data(),a=document.createElement("div");a.className="card",a.innerHTML=`
      <h4>${r.name}</h4>
      <div class="att-days" data-id="${n.id}"></div>
      <div class="muted">Asistencia actual: <span class="att-percent" data-id="${n.id}">0%</span></div>
      <button class="btn btn-secondary add-att-btn" data-id="${n.id}" style="margin-top:8px;">+ Agregar asistencia</button>
    `,t.appendChild(a),tl(n.id)}),t.querySelectorAll(".add-att-btn").forEach(n=>{n.addEventListener("click",()=>rl(n.dataset.id))}))}async function tl(e){const t=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e,"attendance");Y(t,n=>{const r=n.docs.map(a=>({id:a.id,...a.data()}));nl(e,r)})}async function nl(e,t){const n=document.querySelector(`.att-days[data-id="${e}"]`);if(!n)return;n.innerHTML=t.map(i=>`
    <div class="att-record">
      <span>${new Date(i.date+"T00:00:00").toLocaleDateString("es-CL",{timeZone:"America/Santiago"})} :

        ${i.present?"✔ Presente":i.absent?"✘ Ausente":i.justified?"🟡 Justificado":"— Sin clase"}

      </span>
      <button class="btn btn-secondary btn-del-att" data-cid="${e}" data-id="${i.id}">❌</button>
    </div>
  `).join(""),n.querySelectorAll(".btn-del-att").forEach(i=>{i.addEventListener("click",()=>al(i.dataset.cid,i.dataset.id))});const r=t.filter(i=>!i.noClass),a=r.filter(i=>i.present||i.justified).length,s=r.length?Math.round(a/r.length*100):0,l=document.querySelector(`.att-percent[data-id="${e}"]`);l&&(l.textContent=s+"%"),window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=s}let Nn=null;function rl(e){Nn=e;const t=new Date,n=new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().split("T")[0];u("attDate").value=n,u("attModal").classList.add("active")}function ls(){u("attModal").classList.remove("active"),Nn=null}document.addEventListener("DOMContentLoaded",()=>{var e,t,n,r,a;(e=u("attCancel"))==null||e.addEventListener("click",ls),(t=u("attPresente"))==null||t.addEventListener("click",()=>pn("present")),(n=u("attAusente"))==null||n.addEventListener("click",()=>pn("absent")),(r=u("attJustificado"))==null||r.addEventListener("click",()=>pn("justified")),(a=u("attNoClass"))==null||a.addEventListener("click",()=>pn("noClass"))});async function pn(e){if(!Nn)return;const t=u("attDate").value;if(!t){alert("Selecciona una fecha");return}const[n,r,a]=t.split("-").map(Number),l=new Date(n,r-1,a).toISOString().split("T")[0],i=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",Nn,"attendance",l);await ye(i,{date:l,present:e==="present",absent:e==="absent",justified:e==="justified",noClass:e==="noClass"}),ls()}async function al(e,t){const n=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e,"attendance",t);await fe(n)}async function cs(){if(!o.currentUser||!o.activeSemesterId)return;if(un){try{un()}catch{}un=null}window.courseAttendance||(window.courseAttendance={});const e=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses");try{const t=await q(e);for(const n of t.docs){if(!(n.data()||{}).asistencia)continue;const a=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",n.id,"attendance"),i=(await q(a)).docs.map(p=>p.data()).filter(p=>!p.noClass),c=i.filter(p=>p.present||p.justified).length,d=i.length?Math.round(c/i.length*100):0;window.courseAttendance[n.id]=d}console.log("⚡ Precarga inicial de asistencia:",window.courseAttendance),document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{preload:!0}}))}catch(t){console.error("Error en precarga rápida de asistencia:",t)}return un=Y(e,t=>{t.docs.filter(r=>{var a;return(a=r.data())==null?void 0:a.asistencia}).forEach(r=>{const a=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",r.id,"attendance");Y(a,s=>{const i=s.docs.map(p=>p.data()).filter(p=>!p.noClass),c=i.filter(p=>p.present||p.justified).length,d=i.length?Math.round(c/i.length*100):0;window.courseAttendance[r.id]=d,document.dispatchEvent(new CustomEvent("attendance:ready",{detail:{courseId:r.id,percent:d}}))})})}),!0}document.addEventListener("auth:ready",()=>{setTimeout(()=>Hr(),1e3)});document.addEventListener("semester:changed",()=>{Hr()});const wa=Object.freeze(Object.defineProperty({__proto__:null,initAttendance:Hr,preloadAttendanceData:cs},Symbol.toStringTag,{value:"Module"})),fr=new Map,Xe=new Map;let mn=0,_=null,ot=null,se=[],R={scale:"USM",finalExpr:"",rulesText:""},_e={byName:{},byCode:{},byId:{}},Pe=null,Se=null;function Qt(){return N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",_,"groups","meta")}async function Fr(){if(Se=null,!!gt())try{const e=await te(Qt());Se=e.exists()?e.data()||{}:{}}catch(e){console.error("Error cargando nombres de grupos:",e),Se={}}}async function sl(e,t){if(gt())try{await ye(Qt(),{[e]:t},{merge:!0}),Se={...Se||{},[e]:t}}catch(n){throw console.error("Error guardando nombre de grupo:",n),n}}function Sa(){const e=Se||{};return Array.isArray(e.__custom)?e.__custom:[]}function ol(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||"g"}async function il(){if(!gt())return;const e=prompt('Nombre de la carpeta (ej.: "Quices", "Trabajos", "Controles cortos"):');if(!e)return;const t=e.trim();if(!t)return;const n=prompt(`Palabra clave que deben contener las evaluaciones para ir a esta carpeta.
Ej.: "quiz" agrupa todo lo que tenga "quiz" en el nombre.`);if(!n)return;const r=n.trim();if(!r)return;const a=Se||{},s=Array.isArray(a.__custom)?[...a.__custom]:[],l=ol(t),i=new Set(["certamenes","controles","tareas","proyecto","evaluaciones","experiencias","preinformes","informes","laboratorios","otros",...s.map(m=>m.key)]);let c=l,d=2;for(;i.has(c);)c=`${l}${d++}`;s.push({key:c,label:t,keyword:r});const p={...a,[c]:t,__custom:s};await ye(Qt(),p,{merge:!0}),Se=p}async function ll(e){if(!gt())return;const t=Se||{},n=Array.isArray(t.__custom)?t.__custom.filter(a=>a.key!==e):[],r={...t};delete r[e],r.__custom=n,await ye(Qt(),r,{merge:!0}),Se=r}function cl(e){Pe=e,o.unsubscribeGrades=()=>{try{Pe==null||Pe()}finally{Pe=null,o.unsubscribeGrades=null}}}function dl(){try{Pe==null||Pe()}finally{Pe=null}o.unsubscribeGrades=null}function ds(e){return ee(e)}function ul(){const e=u("gr-courseSel");e&&(e.innerHTML='<option value="" disabled selected>Selecciona un ramo…</option>');const t=u("gr-evalsList");t&&(t.innerHTML="");const n=u("gr-finalExpr");n&&(n.value="");const r=u("gr-rulesError");r&&(r.textContent="");const a=u("gr-currentAvg");a&&(a.textContent="—");const s=u("gr-neededToPass");s&&(s.textContent="—");const l=u("gr-status");l&&(l.textContent="—");const i=u("gr-partnerView");i&&i.classList.add("hidden");const c=u("gr-sh-semSel");c&&(c.innerHTML="");const d=u("gr-sh-list");d&&(d.innerHTML="")}function pl(e=_){const t=e?Xe.get(e):null,n=e?fr.get(e):null;t?R={...R,...t}:R={scale:R.scale||"USM",finalExpr:"",rulesText:""};const r=u("gr-finalExpr");r&&(r.value=R.finalExpr||"");const a=u("gr-rulesText");if(a&&(a.value=R.rulesText||""),n&&n.length)se=n.map(s=>({...s})),we(se),oe();else{se=[];const s=u("gr-evalsList");s&&(s.innerHTML='<div class="muted" style="opacity:.5">Cargando evaluaciones…</div>'),Fn(null)}}function ml(){gl()}document.addEventListener("attendance:ready",e=>{console.log("🔁 Asistencia actualizada para:",e.detail),oe()});document.addEventListener("route:notas",()=>{setTimeout(()=>{const e=u("gr-courseSel"),t=u("gr-evalsCard"),n=u("gr-calcCard"),r=u("gr-summaryCard"),a=u("gr-rulesCard");(!e||!e.value)&&(t&&t.classList.add("hidden"),n&&n.classList.add("hidden"),r&&r.classList.add("hidden"),a&&a.classList.add("hidden"))},50)});async function Sn(){await us()}function fl(){var n,r;const e=u("gr-activeSemLabel");e&&(e.textContent=((n=o.activeSemesterData)==null?void 0:n.label)||"—"),us();const t=document.getElementById("gr-sh-semSel");t&&((r=o.activeSemesterData)!=null&&r.label)&&(t.innerHTML=`<option selected>${o.activeSemesterData.label}</option>`,t.disabled=!0,t.style.pointerEvents="none",t.style.opacity="0.7"),(async()=>{try{await cs(),console.log("✅ Asistencia precargada, ahora sí recalculamos notas"),oe()}catch(a){console.warn("⚠️ Error precargando asistencia:",a),oe()}})()}function yl(){return(se||[]).map(e=>({code:e.key,name:e.name||e.key,grade:typeof e.score=="number"?e.score:null}))}function gl(){var n,r,a,s;vl(),(n=u("gr-saveExpr"))==null||n.addEventListener("click",xt),(r=u("gr-finalExpr"))==null||r.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),xt())}),(a=u("gr-courseSel"))==null||a.addEventListener("change",hl),(s=u("gr-addEvalBtn"))==null||s.addEventListener("click",xl),bl();function e(){var m;const l=u("page-notas");if(!l)return;const i=(m=Array.from(l.querySelectorAll(".card h3")).find(f=>/c[aá]lculo de notas/i.test(f.textContent)))==null?void 0:m.closest(".card");if(!i||(i.id||(i.id="gr-calcCard"),i.querySelector("#gr-openSim")))return;const c=i.querySelector("h3"),d=document.createElement("button");d.id="gr-openSim",d.className="ghost",d.textContent="Simulador de notas";let p=c==null?void 0:c.closest(".row");p?p.classList.add("gr-calcHeader"):(p=document.createElement("div"),p.className="row gr-calcHeader",c&&p.appendChild(c),i.insertBefore(p,i.firstChild)),d.style.marginLeft="auto",p.appendChild(d),d.addEventListener("click",()=>{const f=Il();if(!f){alert("Primero define la Fórmula final.");return}const v=yl();if(!v.length){alert("Agrega al menos una evaluación.");return}Rl({formula:f,evals:v})})}e();const t=u("gr-finalExpr");if(t){const l=Ml(async c=>{c===_&&await xt(c)},600),i=()=>{if(!_)return;const c=pt(t.value||"");R.finalExpr=c;const d=Xe.get(_)||{};Xe.set(_,{...d,...R,finalExpr:c}),oe()};t.addEventListener("input",()=>{const c=_;i(),l(c)}),t.addEventListener("keyup",i),t.addEventListener("change",i),t.addEventListener("blur",async()=>{i(),await xt(_)}),t.addEventListener("keydown",c=>{c.key==="Enter"&&(c.preventDefault(),i(),xt(_))})}}function vl(){var n;const e=u("gr-passThreshold");e&&((n=e.closest("div"))==null||n.classList.add("hidden"));const t=u("gr-saveHeader");t&&t.classList.add("hidden")}function bl(){var r,a;if(u("gr-rulesCard"))return;const e=u("page-notas");if(!e)return;const t=document.createElement("div");t.className="card",t.id="gr-rulesCard",t.style.marginTop="12px",t.innerHTML=`
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
  `;const n=(r=Array.from(e.querySelectorAll(".card h3")).find(s=>/c[aá]lculo de notas/i.test(s.textContent)))==null?void 0:r.closest(".card");n?e.insertBefore(t,n):e.appendChild(t),(a=u("gr-saveRules"))==null||a.addEventListener("click",ys)}async function us(){var r,a,s,l,i,c,d,p,m,f,v,x;const e=u("gr-courseSel");if(!e)return;const t=o.editingCourseId||_||"";if(e.innerHTML='<option value="">Selecciona un ramo…</option>',!o.courses||o.courses.length===0){_=null,o.editingCourseId=null,(r=u("gr-evalsCard"))==null||r.classList.add("hidden"),(a=u("gr-calcCard"))==null||a.classList.add("hidden"),(s=u("gr-summaryCard"))==null||s.classList.add("hidden"),(l=u("gr-rulesCard"))==null||l.classList.add("hidden"),we([]),Fn(null);return}o.courses.forEach(y=>{const h=document.createElement("option");h.value=y.id,h.textContent=y.name,e.appendChild(h)}),t&&o.courses.some(y=>y.id===t)?(_=t,o.editingCourseId=t,e.value=t,(i=u("gr-evalsCard"))==null||i.classList.remove("hidden"),(c=u("gr-calcCard"))==null||c.classList.remove("hidden"),(d=u("gr-summaryCard"))==null||d.classList.remove("hidden"),(p=u("gr-rulesCard"))==null||p.classList.remove("hidden"),await fs(),await Fr(),await gs(),await Ut(),oe(),await ps(_)):(_=null,o.editingCourseId=null,e.value="",(m=u("gr-evalsCard"))==null||m.classList.add("hidden"),(f=u("gr-calcCard"))==null||f.classList.add("hidden"),(v=u("gr-summaryCard"))==null||v.classList.add("hidden"),(x=u("gr-rulesCard"))==null||x.classList.add("hidden"))}async function hl(e){var a,s,l,i,c,d,p,m;const t=e.target.value||null,n=_,r=++mn;if(n&&n!==t&&Promise.all([xt(n),ys(n)]).catch(f=>console.warn("No se pudo guardar antes de cambiar de ramo:",f)),_=t,o.editingCourseId=_,ot){try{ot()}catch{}ot=null}if(!_){(a=u("gr-evalsCard"))==null||a.classList.add("hidden"),(s=u("gr-calcCard"))==null||s.classList.add("hidden"),(l=u("gr-summaryCard"))==null||l.classList.add("hidden"),(i=u("gr-rulesCard"))==null||i.classList.add("hidden"),se=[],we([]),Fn(null);return}(c=u("gr-evalsCard"))==null||c.classList.remove("hidden"),(d=u("gr-calcCard"))==null||d.classList.remove("hidden"),(p=u("gr-summaryCard"))==null||p.classList.remove("hidden"),(m=u("gr-rulesCard"))==null||m.classList.remove("hidden"),pl(t),gs(t),Promise.all([fs(),Fr()]).then(async()=>{r===mn&&(we(se),oe(),ps(t).then(()=>{r===mn&&oe()}).catch(()=>{}),Ut().then(()=>{r===mn&&oe()}).catch(()=>{}))}).catch(f=>console.warn("Error cargando datos del ramo:",f))}async function ps(e){try{const t=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e,"attendance"),a=(await q(t)).docs.map(i=>i.data()).filter(i=>!i.noClass),s=a.filter(i=>i.present||i.justified).length,l=a.length?Math.round(s/a.length*100):0;window.courseAttendance||(window.courseAttendance={}),window.courseAttendance[e]=l,console.log(`✅ Sincronizada asistencia directa de ${e}: ${l}%`),oe()}catch(t){console.warn("⚠️ No se pudo sincronizar asistencia directa:",t)}}function ms(){return N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",_,"grading","meta")}function Ct(){return P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",_,"grading","meta","components")}async function fs(){var k,$,A,g,M,S,b;if(!gt())return;const e=_,t=((k=u("gr-finalExpr"))==null?void 0:k.value)??null,n=(($=u("gr-rulesText"))==null?void 0:$.value)??null,r=ms(),a=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",_),s=await te(a),l=s.exists()&&s.data().scale||null,i=((A=o.activeSemesterData)==null?void 0:A.gradeScale)||null,c=((g=o.activeSemesterData)==null?void 0:g.universityAtThatTime)||"";let d=null;if(i)d=i==="1-7"||i==="2-7"||i==="0-7"?"MAYOR":"USM";else{const w=localStorage.getItem(`scale_${c}`);w?d=w.includes("7")?"MAYOR":"USM":d=/mayor/i.test(c)?"MAYOR":(/usm|utfsm|santa\s*mar/i.test(c),"USM")}const p=await te(r);if(e!==_)return;const m=p.exists()?{finalExpr:"",rulesText:"",...p.data()}:{scale:l||d,finalExpr:"",rulesText:""};if(!p.exists()&&(await ye(r,m),e!==_))return;R.scale=m.scale||l||d;const f=((M=u("gr-finalExpr"))==null?void 0:M.value)??null,v=((S=u("gr-rulesText"))==null?void 0:S.value)??null,x=f!==t,y=v!==n;if(!x){R.finalExpr=m.finalExpr||"";const w=u("gr-finalExpr");w&&(w.value=R.finalExpr)}if(!y){R.rulesText=m.rulesText||"";const w=u("gr-rulesText");w&&(w.value=R.rulesText)}let h=l||d;if(R.scale!==h&&(R.scale=h,await ae(r,{scale:R.scale}),e!==_))return;u("gr-activeSemLabel")&&(u("gr-activeSemLabel").textContent=((b=o.activeSemesterData)==null?void 0:b.label)||"—");const E=u("gr-scaleSel");E&&(E.value=R.scale||"USM"),Xe.set(e,{...R}),e===_&&oe()}async function xt(e=null){const t=e||_;if(!(o.currentUser&&o.activeSemesterId&&t))return;const n=u("gr-finalExpr"),r=((n==null?void 0:n.value)||"").trim(),a=pt(r)||null;t===_&&(R.finalExpr=a||"",Xe.set(t,{...R}));const s=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",t,"grading","meta");await ye(s,{finalExpr:a},{merge:!0}),t===_&&(oe(),Ut().then(()=>{t===_&&oe()}).catch(()=>{}))}async function ys(e=null){var a;const t=e||_;if(!(o.currentUser&&o.activeSemesterId&&t))return;const n=(((a=u("gr-rulesText"))==null?void 0:a.value)||"").trim()||null;t===_&&(R.rulesText=n||"",Xe.set(t,{...R}));const r=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",t,"grading","meta");await ye(r,{rulesText:n},{merge:!0}),t===_&&(oe(),Ut().then(()=>{t===_&&oe()}).catch(()=>{}))}async function gs(e=_){if(ot&&(ot(),ot=null),!(o.currentUser&&o.activeSemesterId&&e)){se=[],we([]);return}const t=fr.get(e);t&&t.length&&(se=t.map(r=>({...r})),we(se),oe());const n=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e,"grading","meta","components");ot=Y(X(n,be("createdAt","asc")),async r=>{if(e!==_)return;let a=r.docs.map(l=>({id:l.id,...l.data()}));const s=a.filter(l=>typeof l.order!="number");s.length&&de(()=>import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),[],import.meta.url).then(async({writeBatch:l})=>{const i=l(C),c=Date.now();s.forEach((d,p)=>{i.update(N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",e,"grading","meta","components",d.id),{order:c+p})});try{await i.commit()}catch{}}),a.sort((l,i)=>{var f,v,x,y;const c=typeof l.order=="number"?l.order:9e15,d=typeof i.order=="number"?i.order:9e15;if(c!==d)return c-d;const p=((v=(f=l.createdAt)==null?void 0:f.toMillis)==null?void 0:v.call(f))??0,m=((y=(x=i.createdAt)==null?void 0:x.toMillis)==null?void 0:y.call(x))??0;return p-m}),se=a,fr.set(e,a.map(l=>({...l}))),await we(a),oe(),Ut().then(()=>{e===_&&oe()})},r=>{console.error("watchComponents error:",r),e===_&&we([])})}async function xl(){if(!gt()){alert("Selecciona un semestre y un ramo.");return}const e=u("gr-evalName"),t=u("gr-evalCode"),n=u("gr-evalScore"),r=((e==null?void 0:e.value)||"").trim();let a=((t==null?void 0:t.value)||"").trim();const s=(n==null?void 0:n.value)??"";if(!r){alert("Escribe un nombre.");return}if(!a){alert("Escribe un código (ej: C1, T1...).");return}if(a=a.replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16),!a){alert("Código inválido.");return}a=wl(a,se);const l=R.scale==="MAYOR",i=l?1:0,c=l?7:100,d=parseFloat(String(s).replace(",",".")),p=isNaN(d)?null:zn(d,i,c);await Ee(Ct(),{key:a,name:r,score:p,createdAt:Ua(),order:Date.now()}),e&&(e.value=""),t&&(t.value=""),n&&(n.value="")}function vs(e){return(e||"").replace(/\s+/g,"").replace(/[^A-Za-z0-9_]/g,"").slice(0,16)}function wl(e,t){const n=new Set((t||[]).map(s=>(s.key||"").toLowerCase()));let r=vs(e)||"X";if(!n.has(r.toLowerCase()))return r;let a=2;for(;n.has((r+a).toLowerCase());)a++;return r+a}async function we(e=[]){const t=u("gr-evalsList");if(!t)return;const n={};t.querySelectorAll(".grade-item").forEach(g=>{var b,w;const M=(w=(b=g.querySelector("code"))==null?void 0:b.textContent)==null?void 0:w.trim(),S=g.querySelector('[data-f="score"]');M&&S&&S.value&&(n[M]=S.value)});const r=new Set(Array.from(t.querySelectorAll("details.grade-group[open]")).map(g=>g.dataset.key));if(t.innerHTML="",!_){t.innerHTML='<div class="muted">Selecciona un ramo.</div>';return}if(!e.length){t.innerHTML='<div class="muted">Aún no hay evaluaciones. Usa “Agregar evaluación”.</div>';return}const a=R.scale==="MAYOR",s=a?1:0,l=a?7:100,i=a?.1:1,c=document.createElement("div");c.className="row",c.style.justifyContent="space-between",c.style.alignItems="center",c.style.marginBottom="6px";const d=document.createElement("div");d.className="muted",d.textContent="Carpetas de evaluaciones";const p=document.createElement("button");p.id="gr-addGroup",p.className="ghost",p.textContent="Agregar carpeta",p.addEventListener("click",()=>{il().then(()=>we(se))}),c.appendChild(d),c.appendChild(p),t.appendChild(c);const m=Se||{},f=Sa(),v=new Set(f.map(g=>g.key)),x={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};f.forEach(g=>{x[g.key]=g.label||g.key});const y={...x,...m},h={},E=new Set,k=g=>(g.name||"").toString();f.forEach(g=>{const M=(g.keyword||g.pattern||g.label||"").trim();if(!M)return;const S=M.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=new RegExp(S,"i"),w=e.filter(L=>!E.has(L.id)&&b.test(k(L)));w.length&&(h[g.key]=w,w.forEach(L=>E.add(L.id)))});const $={certamenes:g=>/certamen/i.test(k(g)),controles:g=>/control/i.test(k(g)),tareas:g=>/tarea/i.test(k(g)),proyecto:g=>/proy|proyecto/i.test(k(g)),evaluaciones:g=>/evaluaci[oó]n/i.test(k(g)),experiencias:g=>/experien/i.test(k(g)),preinformes:g=>/pre[\s-]?informe/i.test(k(g)),informes:g=>/\binforme/i.test(k(g))&&!/pre[\s-]?informe/i.test(k(g)),laboratorios:g=>/laboratorio|\blab/i.test(k(g))};for(const[g,M]of Object.entries($)){const S=e.filter(b=>!E.has(b.id)&&M(b));S.length&&(h[g]=S,S.forEach(b=>E.add(b.id)))}const A=e.filter(g=>!E.has(g.id));A.length&&(h.otros=A);for(const[g,M]of Object.entries(h)){if(!M.length)continue;const S=document.createElement("details");S.className="grade-group",S.dataset.key=g,r.has(g)&&(S.open=!0);const b=document.createElement("summary");b.style.display="flex",b.style.alignItems="center",b.style.justifyContent="space-between",b.style.width="100%",b.style.cursor="pointer";const w=y[g]||x[g]||g,L=document.createElement("span");L.style.fontWeight="700",L.textContent=`${w} (${M.length})`;const I=document.createElement("div");I.style.display="flex",I.style.alignItems="center",I.style.gap="4px";const U=document.createElement("button");if(U.dataset.rename=g,U.className="ghost",U.textContent="✎",Object.assign(U.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),I.appendChild(U),v.has(g)){const T=document.createElement("button");T.dataset.deleteGroup=g,T.className="ghost",T.textContent="🗑",Object.assign(T.style,{fontSize:"0.9em",opacity:"0.8",flexShrink:"0"}),T.addEventListener("click",async O=>{O.preventDefault(),O.stopPropagation();const z=y[g]||g;if(confirm(`¿Eliminar la carpeta “${z}” y TODAS las evaluaciones que contiene? Esta acción no se puede deshacer.`))try{const{writeBatch:H}=await de(async()=>{const{writeBatch:G}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:G}},[],import.meta.url),D=H(C);M.forEach(G=>{D.delete(N(Ct(),G.id))}),await D.commit(),await ll(g),await Fr(),we(se)}catch(H){console.error("Error borrando carpeta y evaluaciones:",H),alert("No se pudo borrar la carpeta. Inténtalo de nuevo.")}}),I.appendChild(T)}b.appendChild(L),b.appendChild(I),S.appendChild(b);const B=document.createElement("div");M.forEach(T=>{const O=document.createElement("div");O.className="grade-item",O.dataset.id=T.id,O.draggable=!0,O.innerHTML=`
        <div style="flex:1">
          <div class="gr-name" style="font-weight:700">${ee(T.name||T.key)}</div>
          <div class="muted">Código: <code class="gr-code">${ee(T.key)}</code></div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <input data-f="score" type="number" step="${i}" min="${s}" max="${l}"
                 value="${n[T.key]??T.score??""}" style="width:110px"/>
          <button data-act="save" class="btn btn-secondary">Guardar</button>
          <button data-act="edit" class="btn btn-secondary">Editar</button>
          <button data-act="cancelEdit" class="btn btn-secondary" style="display:none">Cancelar</button>
          <button data-act="del"  class="btn btn-secondary">Eliminar</button>
        </div>
      `,O.querySelectorAll("input,button,select,textarea").forEach(z=>{z.setAttribute("draggable","false")}),O.addEventListener("click",async z=>{var D,G;const H=z.target;if(H instanceof HTMLElement){if(H.dataset.act==="edit"){const F=O.querySelector(".gr-name"),ce=O.querySelector(".gr-code"),Ne=((D=F==null?void 0:F.textContent)==null?void 0:D.trim())||T.name||"",he=((G=ce==null?void 0:ce.textContent)==null?void 0:G.trim())||T.key||"";F.innerHTML=`<input data-f="edit-name" type="text" value="${ee(Ne)}"
                               style="width:100%;max-width:320px">`,ce.parentElement.innerHTML=`Código: <input data-f="edit-code" type="text" value="${ee(he)}"
                            style="width:120px">`,O.querySelector('[data-act="edit"]').style.display="none",O.querySelector('[data-act="cancelEdit"]').style.display="";return}if(H.dataset.act==="cancelEdit"){we(se);return}if(H.dataset.act==="save"){const F=O.querySelector('[data-f="edit-name"]'),ce=O.querySelector('[data-f="edit-code"]');if(F||ce){const qn=F?F.value:T.name||T.key,Ds=ce?ce.value:T.key,Jr=(qn||"").trim();let Te=(Ds||"").trim();if(!Jr){alert("Escribe un nombre.");return}if(Te=vs(Te),!Te){alert("Código inválido. Usa A–Z, 0–9 o _.");return}if(new Set(se.filter(vt=>vt.id!==T.id).map(vt=>(vt.key||"").toLowerCase())).has(Te.toLowerCase())){alert(`El código ${Te} ya existe en este ramo.`);return}const _s=N(Ct(),T.id);if(Te!==T.key){const vt=Ea(R.finalExpr||"",T.key,Te),Kr=Ea(R.rulesText||"",T.key,Te);await ae(ms(),{finalExpr:vt||null,rulesText:Kr||null}),R.finalExpr=vt||"",R.rulesText=Kr||""}await ae(_s,{name:Jr,key:Te}),await Ut(),oe(),we(se);return}const Ne=O.querySelector('[data-f="score"]');let he=parseFloat(Ne.value);const Pt=isNaN(he)?null:zn(he,s,l);await ae(N(Ct(),T.id),{score:Pt});const Wr=se.findIndex(qn=>qn.id===T.id);Wr>=0&&(se[Wr].score=Pt),H.textContent="Guardado ✓",oe(),setTimeout(()=>H.textContent="Guardar",1200);return}if(H.dataset.act==="del"){if(!confirm(`Eliminar “${T.name||T.key}”?`))return;await fe(N(Ct(),T.id));return}}}),B.appendChild(O)}),S.appendChild(B),t.appendChild(S),hs(B),U.addEventListener("click",async T=>{T.preventDefault(),T.stopPropagation();const O=y[g]||x[g]||g,z=prompt(`Nuevo nombre para “${O}”:`,O);if(!(!z||z.trim()===O))try{if(await sl(g,z.trim()),v.has(g)){const H=Se||{},D=Sa().map(F=>F.key===g?{...F,label:z.trim()}:F),G={...H,[g]:z.trim(),__custom:D};await ye(Qt(),G,{merge:!0}),Se=G}we(se)}catch{alert("No se pudo guardar el nuevo nombre.")}})}}function Ea(e,t,n){if(!e)return e;const r=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a=new RegExp(`\\b${r(t)}\\b`,"g");return e.replace(a,n)}function oe(){const e=u("gr-finalExpr"),t=u("gr-rulesText");if(e&&(R.finalExpr=pt(e.value||"")),t&&(R.rulesText=t.value||""),_){const y=Xe.get(_)||{};Xe.set(_,{...y,...R})}const n=R.finalExpr||"",r=R.rulesText||"",a={},s=R.scale==="MAYOR"?1:0,l=R.scale==="MAYOR"?7:100;se.forEach(y=>{typeof y.score=="number"&&(a[y.key]=zn(y.score,s,l))}),window.courseAttendance&&_ in window.courseAttendance?a.Asistencia=window.courseAttendance[_]:a.Asistencia=0;let i=null,c="";if(n.trim()!=="")try{i=At(n,a,{avg:en,min:Math.min,max:Math.max,final:y=>Tn(y),finalCode:y=>Un(y),finalId:y=>qr(y)}),typeof i=="number"&&isFinite(i)?i=tn(i,R.scale):i=null}catch(y){c=(y==null?void 0:y.message)||String(y||""),i=null}else i=null;const d=u("gr-rulesStatus");d&&(d.dataset.formulaError=c);const p=R.scale==="MAYOR"?3.95:54.5,m=zr(r),f=bs(m,a);let v=null;i==null?v=f.allOk?"—":"Reprueba":v=i>=p&&f.allOk?"Aprueba":"Reprueba";let x="—";if(i==null)x="Ingresa notas o completa la fórmula.";else if(v==="Aprueba")x="Nada más. Ya alcanzas la nota y cumples las reglas.";else{const y=[];if(i<p){const h=p-i;y.push(R.scale==="MAYOR"?`Subir la nota final en ${h.toFixed(2)} pts.`:`Subir la nota final en ${h.toFixed(1)} pts.`)}if(!f.allOk){const h=f.unmet.map(E=>`Cumplir: ${E.text}.`);y.push(...h)}x=y.join(" ")}Cl(f),Fn({final:i,status:v,needed:x})}async function Ut(){if(_e={byName:{},byCode:{},byId:{}},!o.currentUser||!o.activeSemesterId)return;const e=Array.isArray(o.courses)?o.courses:[];for(const t of e)try{const n=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",t.id,"grading","meta"),r=await te(n),a=r.exists()?r.data():{scale:"USM",finalExpr:""},s=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",t.id,"grading","meta","components"),i=(await q(s)).docs.map(x=>({id:x.id,...x.data()})),c={},d=a.scale==="MAYOR"?1:0,p=a.scale==="MAYOR"?7:100;for(const x of i)if(typeof x.score=="number"&&isFinite(x.score)){const y=Math.max(d,Math.min(p,x.score));c[x.key]=y}let m=null;if((a.finalExpr||"").trim())try{m=At(a.finalExpr,c,{avg:en,min:Math.min,max:Math.max,final:x=>NaN,finalCode:x=>NaN,finalId:x=>NaN}),typeof m=="number"&&isFinite(m)?m=tn(m,a.scale):m=null}catch{m=null}const f=Ye(t.name),v=Ye(t.code);f&&(_e.byName[f]={final:m,scale:a.scale,id:t.id}),v&&(_e.byCode[v]={final:m,scale:a.scale,id:t.id}),_e.byId[t.id]={final:m,scale:a.scale,id:t.id}}catch{}}function zr(e){return(e||"").split(/\r?\n/).map(n=>n.trim()).filter(Boolean)}function bs(e,t,n){const r={allOk:!0,items:[],unmet:[]};for(const a of e){const s=Sl(a);if(!s){r.items.push({text:a,ok:!1,reason:"inválida"}),r.unmet.push({text:a,kind:"invalid"}),r.allOk=!1;continue}const{left:l,op:i,right:c}=s;let d=null,p=null,m=!1;try{const v={...{avg:en,min:Math.min,max:Math.max,final:Tn,finalCode:Un,finalId:qr},...n||{}};window.courseAttendance&&_ in window.courseAttendance?t.Asistencia=window.courseAttendance[_]:"Asistencia"in t||(t.Asistencia=0);const x=l.replace(/%/g,""),y=c.replace(/%/g,"");d=At(x,t,v),p=At(y,t,v),m=El(d,i,p)}catch{m=!1}r.items.push({text:a,ok:m,left:d,op:i,right:p}),m||(r.unmet.push({text:a,kind:"cmp",left:d,op:i,right:p}),r.allOk=!1)}return r}function Sl(e){const t=e.match(/^(.*?)(>=|<=|==|!=|>|<)(.*)$/);return t?{left:pt(t[1].trim()),op:t[2],right:pt(t[3].trim())}:null}function El(e,t,n){if(!(isFinite(e)&&isFinite(n)))return!1;const r=Math.round(Math.round(e*10)/10),a=Math.round(Math.round(n*10)/10);switch(t){case">=":return r>=a;case"<=":return r<=a;case">":return r>a;case"<":return r<a;case"==":return r===a;case"!=":return r!==a;default:return!1}}function en(...e){const t=e.map(r=>typeof r=="number"&&isFinite(r)?r:Number(r)).filter(r=>!isNaN(r));return t.length?t.reduce((r,a)=>r+a,0)/t.length:NaN}function Cl(e){const t=u("gr-rulesStatus");if(!t)return;if(!e||!e.items.length){t.textContent="No hay reglas definidas.";return}const n=e.items.filter(a=>a.ok).length,r=e.items.map(a=>a.ok?`✅ ${a.text}`:`❌ ${a.text}`);t.innerHTML=`<div><b>Reglas:</b> ${n}/${e.items.length} cumplidas</div><div style="margin-top:4px">${r.join("<br/>")}</div>`}function Fn(e){const t=[u("gr-currentFinal"),u("gr-currentAvg")].filter(Boolean),n=[u("gr-status")].filter(Boolean),r=[u("gr-needed"),u("gr-neededToPass")].filter(Boolean);if(!t.length&&!n.length&&!r.length)return;if(!e){t.forEach(c=>c.textContent=""),n.forEach(c=>c.textContent=""),r.forEach(c=>c.textContent="");return}const a=(R==null?void 0:R.scale)||"USM",s=e.final==null?"":tn(e.final,a).toString(),l=e.status??"",i=e.needed??"";t.forEach(c=>c.textContent=s),n.forEach(c=>c.textContent=l),r.forEach(c=>c.textContent=i)}let Wn={id:null,fromIndex:-1};function hs(e){e&&(e.querySelectorAll(".grade-item").forEach(t=>{t.draggable=!0,t.querySelectorAll("input,button,select,textarea").forEach(n=>{n.setAttribute("draggable","false")})}),e.addEventListener("dragstart",t=>{const n=t.target.closest(".grade-item");n&&(t.dataTransfer.setData("text/plain",n.dataset.id||""),t.dataTransfer.effectAllowed="move",n.classList.add("dragging"),Wn.id=n.dataset.id,Wn.fromIndex=[...e.children].indexOf(n))}),e.addEventListener("dragend",()=>{const t=e.querySelector(".grade-item.dragging");t==null||t.classList.remove("dragging"),Wn={id:null,fromIndex:-1}}),e.addEventListener("dragover",t=>{t.preventDefault(),t.dataTransfer.dropEffect="move";const n=e.querySelector(".grade-item.dragging");if(!n)return;const r=Ll(e,t.clientY);r==null?e.appendChild(n):e.insertBefore(n,r)},{capture:!0}),e.addEventListener("drop",async t=>{t.preventDefault();const n=[...e.querySelectorAll(".grade-item")].map(r=>r.dataset.id);await kl(n)}))}function Ll(e,t){return[...e.querySelectorAll(".grade-item:not(.dragging)")].reduce((r,a)=>{const s=a.getBoundingClientRect(),l=t-(s.top+s.height/2);return l<0&&l>r.offset?{offset:l,element:a}:r},{offset:Number.NEGATIVE_INFINITY,element:null}).element}async function kl(e){if(!gt()||!Array.isArray(e)||!e.length)return;const{writeBatch:t}=await de(async()=>{const{writeBatch:s}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");return{writeBatch:s}},[],import.meta.url),n=t(C);let r=Date.now();const a=1e3;e.forEach((s,l)=>{const i=N(Ct(),s);n.update(i,{order:r+l*a})});try{await n.commit()}catch(s){console.warn("Error al guardar orden:",s)}}function Il(){var e;return(((e=document.getElementById("gr-finalExpr"))==null?void 0:e.value)||"").trim()}function Ml(e,t){let n=null;return(...r)=>{n&&clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function gt(){return!!(o.currentUser&&o.activeSemesterId&&_)}function ee(e){return(e??"").toString().replace(/[<>&"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[t])}function zn(e,t,n){return Math.max(t,Math.min(n,e))}function pt(e){if(!e)return"";let t=String(e).trim();return t=t.replace(/[“”]/g,'"').replace(/[‘’]/g,"'"),t=t.replace(/\s+/g," "),t}function xs(e){return e.replace(/\b(final|finalCode|finalId)\(\s*([^)]+?)\s*\)/g,(t,n,r)=>{const a=String(r).trim();if(/^["'].*["']$/.test(a))return`${n}(${a})`;if(/[(),]/.test(a))return`${n}(${a})`;const s=a.replace(/"/g,'\\"');return`${n}("${s}")`})}function Al(e){return e?e.replace(/(\d+(?:\.\d+)?)\s*%/g,(t,n)=>`(${n}/100)`):""}function At(e,t,n={}){const r=pt(e),a=xs(r),s=a.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0");if(!/^[\w\s\.\+\-\*\/\(\),%<>!=]+$/.test(s))throw new Error("La fórmula contiene caracteres no permitidos.");const l=Al(a),i=s.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],c=new Set(["avg","min","max","final","finalCode","finalId"]),d=new Set(["NaN","Infinity","Math","true","false"]),p=Object.keys(t),m=p.map(y=>t[y]??0),f=new Set([...p,...Object.keys(n)]);for(const y of i)c.has(y)||d.has(y)||f.has(y)||(p.push(y),m.push(0),f.add(y));const v=Object.keys(n),x=Object.values(n);return Function(...v,...p,`"use strict"; return (${l});`)(...x,...m)}function $l(e){const t=pt(e||""),n=xs(t),a=n.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,"0").match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)||[],s=new Set(["avg","min","max","final","finalCode","finalId","NaN","Infinity","Math","true","false"]),l=new Set((n.match(/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/g)||[]).map(c=>c.replace("(","").trim())),i=a.filter(c=>!s.has(c)&&!l.has(c));return[...new Set(i)]}function tn(e,t){return e==null||isNaN(e)?null:t==="MAYOR"?Math.trunc(e*100)/100:Math.trunc(e*10)/10}function Ye(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase()}function Tn(e){const t=Ye(e);if(!t)return NaN;const n=(o.courses||[]).find(i=>i.id===_);if(t===Ye(n==null?void 0:n.name))return NaN;const r=_e.byName[t];if(r&&typeof r.final=="number")return r.final;const a=Array.isArray(o.courses)?o.courses:[],s=a.filter(i=>Ye(i.name).startsWith(t)&&i.id!==_);if(s.length===1){const i=_e.byId[s[0].id];if(i&&typeof i.final=="number")return i.final}const l=a.filter(i=>Ye(i.name).includes(t)&&i.id!==_);if(l.length===1){const i=_e.byId[l[0].id];if(i&&typeof i.final=="number")return i.final}return NaN}function Un(e){const t=Ye(e),n=(o.courses||[]).find(a=>a.id===_);if(t&&t===Ye(n==null?void 0:n.code))return NaN;const r=_e.byCode[t];return r&&typeof r.final=="number"?r.final:NaN}function qr(e){if(!e||e===_)return NaN;const t=_e.byId[e];return t&&typeof t.final=="number"?t.final:NaN}let W={uid:null,semId:null,courses:[],unsubCourses:null};const et={};function Nl(e,t="Usuario"){const n=String(e||"").trim();return n||t}function Tl(e,t="#64748b"){const n=String(e).trim();return/^#[0-9A-Fa-f]{6}$/.test(n)?n:t}async function ws(e){var t;if(!e)return{name:"",color:"#64748b"};if(et[e])return et[e];try{const n=await te(N(C,"users",e,"profile","profile")),r=await te(N(C,"users",e)),a=n.exists()?n.data()||{}:{},s=r.exists()?r.data()||{}:{},l=Nl(a.name||s.name||s.displayName||s.username,e===((t=o.currentUser)==null?void 0:t.uid)?"Yo":"Usuario"),i=Tl(a.favoriteColor||s.favoriteColor||"#64748b");return et[e]={name:l,color:i},et[e]}catch{return et[e]={name:"Usuario",color:"#64748b"},et[e]}}function Ul(){var e;try{(e=W.unsubCourses)==null||e.call(W)}catch{}W.unsubCourses=null,W.courses=[]}function Ss(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Set)return[...e].map(t=>typeof t=="string"?t:t==null?void 0:t.uid).filter(Boolean);if(e instanceof Map)return[...e.keys()].filter(Boolean);if(typeof e=="object"){const t=e.partyMembers||e.memberUids||e.members||e.uids||e.participants||e.people||null;if(t)return Ss(t);const r=Object.keys(e).filter(s=>typeof s=="string"&&s.length>=16);if(r.length)return r;const a=Object.values(e).map(s=>s==null?void 0:s.uid).filter(Boolean);if(a.length)return a}return[]}function Pl(){var a,s,l,i;const e=(a=o.currentUser)==null?void 0:a.uid,t=[o.partyMembers,o.party,o.partyData,o.activeParty,(s=o.shared)==null?void 0:s.party,(l=o.shared)==null?void 0:l.partyData,(i=o.shared)==null?void 0:i.partyMembers];let n=[];for(const c of t)if(n=Ss(c),n.length)break;return[...new Set(n.filter(Boolean))].filter(c=>c!==e)}function Es(){const e=u("gr-partnerView");if(!e||e.querySelector("#gr-partyBar"))return;const t=document.createElement("div");t.id="gr-partyBar",t.style.cssText="display:flex; flex-wrap:wrap; gap:10px; margin:10px 0 12px 0;";const n=e.querySelector("h3, h2");n&&/duo/i.test(n.textContent||"")&&(n.textContent="Notas de mi party");const r=e.querySelector("#gr-sh-semSel");r!=null&&r.parentElement?r.parentElement.insertBefore(t,r):e.insertBefore(t,e.firstChild)}async function yr(){Es();const e=document.getElementById("gr-partyBar");if(!e)return;const t=Pl();if(!t.length){e.innerHTML='<div class="muted">No hay miembros en tu party.</div>';return}(!W.uid||!t.includes(W.uid))&&(W.uid=t[0]),await Promise.all(t.map(n=>ws(n))),e.innerHTML=t.map(n=>{const r=et[n]||{};return`
      <button class="btn ${n===W.uid?"violet":"violet-outline"}"
        data-gr-uid="${n}"
        style="display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;">
        <span style="width:14px;height:14px;border-radius:4px;background:${r.color||"#64748b"};display:inline-block;"></span>
        <span style="font-weight:800">${ds(r.name||"Usuario")}</span>
      </button>
    `}).join(""),e.querySelectorAll("button[data-gr-uid]").forEach(n=>{n.addEventListener("click",async()=>{W.uid=n.dataset.grUid,await yr(),await gr(),await vr()})})}async function gr(){var l;const e=u("gr-sh-semSel");if(!e)return;const t=((l=o.activeSemesterData)==null?void 0:l.label)||null;if(!t){e.innerHTML="<option selected>No disponible</option>",e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",W.semId=null;return}if(e.innerHTML=`<option selected>${t}</option>`,e.disabled=!0,e.style.pointerEvents="none",e.style.opacity="0.7",!W.uid){W.semId=null;return}const n=P(C,"users",W.uid,"semesters"),r=await q(n);let a=null;r.forEach(i=>{var d;String(((d=i.data())==null?void 0:d.label)||"").trim()===t&&(a=i.id)}),W.semId=a;const s=u("gr-sh-list");s&&!a&&(s.innerHTML=`<div class="muted">Este miembro no tiene creado el semestre ${ds(t)}.</div>`)}async function vr(){const e=u("gr-sh-list");if(e&&(e.innerHTML=""),Ul(),!W.uid||!W.semId)return;const t=P(C,"users",W.uid,"semesters",W.semId,"courses");W.unsubCourses=Y(X(t,be("name")),n=>{W.courses=n.docs.map(r=>({id:r.id,...r.data()||{}})),Dl()})}function Dl(){const e=u("gr-sh-list");if(!e)return;e.innerHTML="";const t=W.courses||[];if(!t.length){e.innerHTML='<div class="muted">No hay ramos en ese semestre.</div>';return}t.forEach(n=>{const r=document.createElement("div");r.className="grade-item",r.style.cursor="pointer",r.innerHTML=`
      <div style="flex:1">
        <div style="font-weight:800">${ee(n.name||"Ramo")}</div>
        <div class="muted">Código: <b>${ee(n.code||"—")}</b></div>
      </div>
      <div class="muted" style="font-weight:800">Ver</div>
    `,r.addEventListener("click",()=>Bl(n.id)),e.appendChild(r)})}function _l(){var n;if(document.getElementById("grPartyCourseModal"))return;const e=document.createElement("div");e.id="grPartyCourseModal",e.style.cssText=`
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
  `,document.body.appendChild(e);const t=()=>e.style.display="none";(n=document.getElementById("grPcX"))==null||n.addEventListener("click",t),e.addEventListener("click",r=>{r.target===e&&t()}),document.addEventListener("keydown",r=>{e.style.display==="flex"&&r.key==="Escape"&&t()})}async function Bl(e){var S;if(!W.uid||!W.semId||!e)return;_l();const t=document.getElementById("grPartyCourseModal"),n=document.getElementById("grPcTitle"),r=document.getElementById("grPcSub"),a=document.getElementById("grPcFormula"),s=document.getElementById("grPcFinal"),l=document.getElementById("grPcEvals");t.style.display="flex",l.innerHTML="Cargando…",s.textContent="—",a.textContent="—";const i=(W.courses||[]).find(b=>b.id===e)||{},c=await ws(W.uid);n.textContent=i.name||"Ramo",r.textContent=`${c.name||"Usuario"} · ${((S=o.activeSemesterData)==null?void 0:S.label)||""}`;const d=N(C,"users",W.uid,"semesters",W.semId,"courses",e,"grading","meta"),p=P(C,"users",W.uid,"semesters",W.semId,"courses",e,"grading","meta","components"),[m,f]=await Promise.all([te(d),q(X(p,be("order")))]),v=m.exists()?m.data()||{}:{scale:"USM",finalExpr:""},x=f.docs.map(b=>({id:b.id,...b.data()||{}})),y=v.scale||"USM",h=y==="MAYOR"?1:0,E=y==="MAYOR"?7:100,k={};x.forEach(b=>{typeof b.score=="number"&&isFinite(b.score)&&b.key&&(k[b.key]=zn(b.score,h,E))});const $=(v.finalExpr||"").trim();a.textContent=$||"—";let A=null;try{$&&(A=At($,k,{avg:en,min:Math.min,max:Math.max,final:()=>NaN,finalCode:()=>NaN,finalId:()=>NaN}),typeof A=="number"&&isFinite(A)?A=tn(A,y):A=null)}catch{A=null}if(s.textContent=A==null?"—":String(A),!x.length){l.innerHTML='<div class="muted">Este ramo no tiene evaluaciones.</div>';return}const g=(b="")=>{const w=String(b||"");return/certamen/i.test(w)?"Certámenes":/control/i.test(w)?"Controles":/tarea/i.test(w)?"Tareas":/proy|proyecto/i.test(w)?"Proyecto":/laboratorio|\blab/i.test(w)?"Laboratorios":/pre[\s-]?informe/i.test(w)?"Pre-informes":/\binforme/i.test(w)&&!/pre[\s-]?informe/i.test(w)?"Informes":"Otros"},M={};x.forEach(b=>{const w=g(b.name||b.key);(M[w]=M[w]||[]).push(b)}),l.innerHTML=Object.entries(M).map(([b,w])=>{const L=w.map(I=>{const U=typeof I.score=="number"&&isFinite(I.score)?I.score:null;return`
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
    `}).join("")}(function(){const t=u("gr-togglePartner");if(!t)return;const n=document.querySelector("#page-notas h2, #page-notas h1, .page-title");function r(){var l,i,c,d,p;return[(l=u("gr-courseSel"))==null?void 0:l.closest(".card"),u("gr-evalsCard")||((i=u("gr-evalsList"))==null?void 0:i.closest(".card")),u("gr-calcCard")||((c=u("gr-finalExpr"))==null?void 0:c.closest(".card")),u("gr-summaryCard")||((d=u("gr-currentFinal"))==null?void 0:d.closest(".card"))||((p=u("gr-currentAvg"))==null?void 0:p.closest(".card")),u("gr-rulesCard")].filter(Boolean)}const a=u("gr-partnerView");function s(l){t.setAttribute("aria-pressed",l?"true":"false"),t.textContent=l?"Volver a mis notas":"Notas de mi party",n&&(n.textContent=l?"🎉 Notas de mi party":"📊 Mis Notas"),r().forEach(i=>nn(i,l)),nn(a,!l),l&&(Es(),yr().then(()=>gr()).then(()=>vr()).catch(i=>console.warn("Error cargando party:",i)))}t.addEventListener("click",()=>{const l=t.getAttribute("aria-pressed")==="true";s(!l)}),document.addEventListener("party:ready",()=>{t.getAttribute("aria-pressed")==="true"&&yr().then(()=>gr()).then(()=>vr()).catch(()=>{})}),document.addEventListener("route:notas",()=>{t.getAttribute("aria-pressed")==="true"||(nn(a,!0),r().forEach(i=>nn(i,!1)))})})();function Rl({formula:e,evals:t}){var g,M,S,b;(g=document.getElementById("gr-simDrawer"))==null||g.remove(),(M=document.getElementById("gr-simBackdrop"))==null||M.remove();const n=document.createElement("div");n.id="gr-simBackdrop",Object.assign(n.style,{position:"fixed",inset:"0",zIndex:9998,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(1px)"}),document.body.classList.add("sim-lock");const r=document.createElement("div");r.id="gr-simDrawer",Object.assign(r.style,{position:"fixed",top:"0",right:"0",height:"100vh",width:"420px",background:"rgba(18,18,30,.98)",backdropFilter:"blur(6px)",borderLeft:"1px solid rgba(255,255,255,.08)",boxShadow:"0 0 24px rgba(0,0,0,.45)",zIndex:9999,padding:"16px 16px 90px 16px",overflowY:"auto"}),r.addEventListener("click",w=>w.stopPropagation()),r.innerHTML=`
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

  `,document.body.appendChild(n),document.body.appendChild(r);const a=async()=>{const w=A();let L=null;try{L=await La()}catch{L=null}const I=(O={})=>{const z={};for(const[H,D]of Object.entries(O||{}))D==null||D===""||typeof D=="string"&&D.trim()===""?z[H.toUpperCase()]=null:isNaN(D)?z[H.toUpperCase()]=D:z[H.toUpperCase()]=Math.round(Number(D)*100)/100;return z},B=((O,z)=>{const H=I(O),D=I(z),G=new Set([...Object.keys(H),...Object.keys(D)]);for(const F of G)if((H[F]??null)!==(D[F]??null))return!1;return!0})(w.gradesMap,L);let T=!1;if(B||(T=confirm("¿Guardar esta simulación antes de salir?")),T)try{await Ca(w.gradesMap,e)}catch{}n.remove(),r.remove(),document.body.classList.remove("sim-lock")};n.addEventListener("click",a),r.addEventListener("keydown",w=>{w.key==="Escape"&&a()}),(S=r.querySelector("#gr-simClose"))==null||S.addEventListener("click",a),Ol(r);const s=r.querySelector("#gr-simForm"),l=new Map((t||[]).map(w=>[w.code,w.grade])),i=$l(e),c=new Set((t||[]).map(w=>w.code)),d=[...new Set([...c,...i])],p={certamenes:[],controles:[],tareas:[],proyecto:[],evaluaciones:[],experiencias:[],preinformes:[],informes:[],laboratorios:[],otros:[]},m={certamenes:"Certámenes",controles:"Controles",tareas:"Tareas",proyecto:"Proyecto",evaluaciones:"Evaluaciones",experiencias:"Experiencias",preinformes:"Pre-informes",informes:"Informes",laboratorios:"Laboratorios",otros:"Otros"};function f(w,L){const I=(L||"").toString();return/certamen/i.test(I)?"certamenes":/control/i.test(I)?"controles":/tarea/i.test(I)?"tareas":/proy|proyecto/i.test(I)?"proyecto":/evaluaci[oó]n/i.test(I)?"evaluaciones":/experien/i.test(I)?"experiencias":/pre[\s-]?informe/i.test(I)?"preinformes":/\binforme/i.test(I)&&!/pre[\s-]?informe/i.test(I)?"informes":/laboratorio|\blab/i.test(I)?"laboratorios":"otros"}for(const w of d){const L=(t||[]).find(B=>B.code===w)||{name:w},I=l.get(w),U=f(w,L.name||w);p[U].push({code:w,name:L.name||w,value:I})}const v=[],x=R.scale==="MAYOR",y=x?1:0,h=x?7:100,E=x?.1:1;for(const[w,L]of Object.entries(p)){if(!L.length)continue;const I=m[w]||w;v.push(`
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
  `)}s.innerHTML=v.join("");const k=[...e.matchAll(/finalCode\(["'](.+?)["']\)/g)];for(const w of k){const L=w[1],I=Un(L);isFinite(I)?v.push(`
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
    `)}s.innerHTML=v.join("");const $=[...e.matchAll(/final\(["'](.+?)["']\)/g)];for(const w of $){const L=w[1],I=Tn(L);isFinite(I)&&s.insertAdjacentHTML("beforeend",`
      <div class="row" style="align-items:center;gap:8px;margin:6px 0;opacity:.85" data-sim-ref="${ee(L)}">
        <div style="min-width:76px"><b>NF</b></div>
        <div style="flex:1">Nota final de ${ee(L)}</div>
        <input type="number" readonly value="${I}" style="width:110px;opacity:.7;background:#222;border:none;color:#ccc">
      </div>
    `)}const A=()=>{const w={};s.querySelectorAll("[data-sim-code]").forEach(D=>{var Ne,he;const G=D.getAttribute("data-sim-code"),F=(he=(Ne=D.querySelector("input"))==null?void 0:Ne.value)==null?void 0:he.trim(),ce=F?Number(String(F).replace(",",".")):null;w[G]=Number.isFinite(ce)?ce:0});let L=null,I=null;try{L=At(e,{...w},{avg:en,min:Math.min,max:Math.max,final:D=>Tn(D),finalCode:D=>Un(D),finalId:D=>qr(D)}),typeof L=="number"&&isFinite(L)?L=tn(L,R.scale):L=null}catch(D){I=(D==null?void 0:D.message)||String(D||""),L=null}const U=zr(R.rulesText||""),B=bs(U,w),T=R.scale==="MAYOR"?3.95:54.5;let O="";if(I)O="";else if(L==null)O="Ingresa valores para simular.";else{const D=[];if(L<T){const G=T-L;D.push(R.scale==="MAYOR"?`Subir la nota final en ${G.toFixed(2)} pts.`:`Subir la nota final en ${G.toFixed(1)} pts.`)}if(!B.allOk){const G=B.unmet.map(F=>F.text);G.length&&D.push(`Cumplir reglas pendientes: ${G.map(ee).join("; ")}.`)}O=D.length?D.join(" "):"Nada más. Ya apruebas."}const z=r.querySelector("#gr-simSummary");z.innerHTML=I?`<div style="color:#f87171">Error en fórmula: ${ee(I)}</div>`:`
    <div>Promedio simulado: <b>${L??"—"}</b></div>
    <div class="muted" style="margin-top:6px">(Usa tu fórmula final actual)</div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:10px 0">
    <div><b>Necesitas para aprobar</b></div>
    <div style="margin-top:4px">${O}</div>
  `;const H=r.querySelector("#gr-simRules");if(!U.length)H.textContent="No hay reglas definidas.";else{const D=B.items.filter(G=>G.ok).length;H.innerHTML=`
        <div style="margin-bottom:6px">Cumplidas: <b>${D}/${U.length}</b></div>
        <ul style="margin:0 0 0 18px;padding:0;list-style:disc;">
          ${B.items.map(G=>`<li style="color:${G.ok?"#22c55e":"#ef4444"}">${ee(G.text)}</li>`).join("")}
        </ul>
      `}return{gradesMap:w,result:L}};s.addEventListener("input",A),A(),(b=r.querySelector("#gr-simSave"))==null||b.addEventListener("click",async()=>{const w=A();try{const L=await Ca(w.gradesMap,e);alert((L==null?void 0:L.where)==="cloud"?"Simulación guardada en la nube.":"Simulación guardada")}catch(L){console.error(L),alert("No se pudo guardar la simulación.")}}),La().then(w=>{w&&(s.querySelectorAll("[data-sim-code]").forEach(L=>{const I=L.getAttribute("data-sim-code")||"",U=L.querySelector("input");if(!U)return;const B=w[I]??w[I.toUpperCase()]??w[I.toLowerCase()];B!=null&&(U.value=String(B))}),A())}).catch(()=>{})}function Ol(e){const t=()=>Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(a=>!a.hasAttribute("disabled")&&a.tabIndex!==-1),n=()=>t()[0],r=()=>t().slice(-1)[0];setTimeout(()=>{var a;return(a=n())==null?void 0:a.focus()},0),e.addEventListener("keydown",a=>{var i,c;if(a.key!=="Tab")return;const s=t();if(!s.length)return;const l=document.activeElement;a.shiftKey?l===s[0]&&(a.preventDefault(),(i=r())==null||i.focus()):l===s[s.length-1]&&(a.preventDefault(),(c=n())==null||c.focus())})}async function Ca(e,t){const n={};Object.keys(e||{}).forEach(s=>{n[String(s).toUpperCase()]=e[s]});const r={formula:t,grades:n,rules:zr(R.rulesText||""),semId:o.activeSemesterId||null,courseId:o.editingCourseId||null,createdAt:Ua()};if(o.currentUser&&o.activeSemesterId&&o.editingCourseId)try{const s=["users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",o.editingCourseId,"simulations"];return await Ee(P(C,...s),r),await ye(N(C,...s,"__last__"),r),{ok:!0,where:"cloud"}}catch(s){console.warn("Fallo Firestore, usando localStorage:",s)}const a=`sim:last:${o.activeSemesterId||"SEM"}:${o.editingCourseId||"COURSE"}`;return localStorage.setItem(a,JSON.stringify(r)),{ok:!0,where:"local"}}async function La(){var t;const e=`sim:last:${o.activeSemesterId||"SEM"}:${o.editingCourseId||"COURSE"}`;if(o.currentUser&&o.activeSemesterId&&o.editingCourseId)try{const n=N(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses",o.editingCourseId,"simulations","__last__"),r=await te(n);if(r.exists()){const a=((t=r.data())==null?void 0:t.grades)||null;return a&&typeof a=="object"?a:null}}catch{}try{const n=localStorage.getItem(e);if(!n)return null;const r=JSON.parse(n),a=(r==null?void 0:r.grades)||null;return a&&typeof a=="object"?a:null}catch{return null}}function Hl(e){if(!e||!o.courses)return null;const t=r=>String(r||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),n=t(e);return o.courses.find(r=>t(r.name).includes(n)||t(r.code||"").includes(n))||null}async function Cs(e){const t=P(e.ref,"rules"),n=await q(t);let r=0,a=0;for(const s of n.docs){const l=s.data(),i=Number(l.peso)||0,c=P(s.ref,"grades"),p=(await q(c)).docs.map(m=>Number(m.data().valor)).filter(m=>!isNaN(m));if(p.length>0){const m=p.reduce((f,v)=>f+v,0)/p.length;r+=m*(i/100),a+=i}}return a>0?+r.toFixed(2):null}async function Fl(e){if(!o.currentUser)return null;const t=P(C,"users",o.currentUser.uid,"semesters",e,"courses"),n=await q(t);let r=0,a=0;for(const s of n.docs){const l=await Cs(s);l!=null&&(r+=l,a++)}return a>0?+(r/a).toFixed(2):null}function zl(e){var l;const n=(e.scale||"USM")==="MAYOR"?4:55;let r=0,a=0;for(const i of e.rules||[]){const c=Number(i.peso)||0;if(i.tipo.toLowerCase().includes("examen")){a=c;continue}if((l=i.notas)!=null&&l.length){const d=i.notas.reduce((p,m)=>p+m,0)/i.notas.length;r+=d*(c/100)}}return a===0?null:+((n-r)/(a/100)).toFixed(2)}function ql(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return e.promedio>=n}function jl(e){const n=(e.scale||"USM")==="MAYOR"?4:55;return+Math.max(0,n-(e.promedio||0)).toFixed(2)}async function Yl(e){if(!o.currentUser)return{best:null,worst:null};const t=P(C,"users",o.currentUser.uid,"semesters",e,"courses"),n=await q(t),r=[];for(const a of n.docs){const s=await Cs(a);r.push({id:a.id,name:a.data().name,promedio:s})}return r.length?(r.sort((a,s)=>(s.promedio||0)-(a.promedio||0)),{best:r[0],worst:r[r.length-1]}):{best:null,worst:null}}const ka=Object.freeze(Object.defineProperty({__proto__:null,bestWorst:Yl,calcBrecha:jl,calcNotaMinima:zl,calcPromedioSemestre:Fl,clearGradesUI:ul,enableDnDForGrades:hs,findCourse:Hl,initGrades:ml,isPassing:ql,onActiveSemesterChanged:fl,onCoursesChanged:Sn,registerGradesUnsub:cl,stopGradesSub:dl},Symbol.toStringTag,{value:"Module"}));let Jn="USM";function jr(){Vl()}function Re(){Jl()}function Yr(e){var s;Jn=e==="UMAYOR"?"MAYOR":"USM";const t=u("sectParLabel");t&&(t.textContent=e==="USM"?"Paralelo":"Sección/Paralelo");const n=u("courseScale"),r=(s=n==null?void 0:n.closest)==null?void 0:s.call(n,".form-field");r&&r.classList.add("hidden"),n&&(n.value=Jn,n.disabled=!0);const a=u("scaleHint");a&&(a.textContent=Jn==="MAYOR"?"Escala: UMayor (1–7) · tomada desde tu Perfil":"Escala: USM (0–100) · tomada desde tu Perfil")}let fn=null;function Gl(e,t){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function Vl(){if(fn&&(fn(),fn=null),!o.currentUser||!o.activeSemesterId){o.courses=[],document.dispatchEvent(new Event("courses:changed"));return}const e=P(C,"users",o.currentUser.uid,"semesters",o.activeSemesterId,"courses");fn=Y(e,Gl(t=>{const n=t.docs.map(r=>{const a=r.data()||{},s=a.createdAt instanceof Vs?a.createdAt.toMillis():typeof a.createdAt=="number"?a.createdAt:0;return{id:r.id,...a,createdAtMs:s}});n.sort((r,a)=>a.createdAtMs-r.createdAtMs),o.courses=n,Wl(n),Sn==null||Sn(),document.dispatchEvent(new Event("courses:changed"))},300))}function Wl(e){const t=u("coursesList");t&&(t.innerHTML="",(e||[]).forEach(n=>{const r=document.createElement("div");r.className="course-item",r.innerHTML=`
  <div>
    <div>
      <b>${_t(n.name||"Sin nombre")}</b>
      <span class="course-meta">· ${_t(n.code||"")}</span>
    </div>

    <div class="course-meta">${_t(n.professor||"")}</div>

    <div class="course-meta" style="display:flex;align-items:center;gap:8px;margin-top:6px;">
      <span
        style="
          display:inline-block;
          width:12px;
          height:12px;
          border-radius:999px;
          background:${_t(n.color||"#3B82F6")};
          border:1px solid rgba(255,255,255,.25);
        "
      ></span>
      <span>Color: ${_t((n.color||"#3B82F6").toUpperCase())}</span>
    </div>
  </div>

  <div class="inline">
    <button class="ghost course-edit" data-id="${n.id}">Editar</button>
    <button class="danger course-del"  data-id="${n.id}">Eliminar</button>
  </div>
`,t.appendChild(r)}))}function Jl(){var i;o.editingCourseId=null;const e=u("courseName");e&&(e.value="");const t=u("courseCode");t&&(t.value="");const n=u("courseProfessor");n&&(n.value="");const r=u("courseSectPar");r&&(r.value="");const a=u("courseColor");a&&(a.value="#3B82F6");const s=u("courseColorCode");s&&(s.textContent="#3B82F6");const l=u("saveCourseBtn");l&&(l.textContent="Agregar ramo"),(i=u("cancelEditBtn"))==null||i.classList.add("hidden")}function _t(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let it=null,Ia=!1;function Kl(){Ia||(Ia=!0,Zl())}function Kn(){it&&(it(),it=null);const e=u("semestersList");e&&(e.innerHTML=""),$t()}function Zl(){const e=u("createSemesterBtn");e&&e.addEventListener("click",async()=>{var c;if(!o.currentUser){alert("Debes iniciar sesión.");return}const t=Ql();if(!t){alert("Completa tu universidad en Perfil.");return}const n=(((c=u("semesterLabel"))==null?void 0:c.value)||"").trim();if(!Xl(n)){alert("Formato de semestre inválido. Usa AAAA-1 o AAAA-2 (ej. 2025-2).");return}const r=P(C,"users",o.currentUser.uid,"semesters");if(!(await q(X(r,Ta("label","==",n)))).empty){alert("Ya existe un semestre con ese nombre.");return}let s=localStorage.getItem(`scale_${t}`);if(!s){const d=await new Promise(p=>{const m=document.getElementById("scaleModal"),f=document.getElementById("scaleSelect"),v=document.getElementById("scaleSave"),x=document.getElementById("scaleCancel");m.classList.add("active"),f.value="";const y=k=>{m.classList.remove("active"),v.removeEventListener("click",h),x.removeEventListener("click",E),p(k)},h=()=>{const k=f.value;if(!k)return alert("Selecciona una escala antes de continuar.");localStorage.setItem(`scale_${t}`,k),y(k)},E=()=>{y(null)};v.addEventListener("click",h),x.addEventListener("click",E)});if(!d){console.log("❌ Creación de semestre cancelada por el usuario.");return}s=d}const l=await Ee(r,{label:n,universityAtThatTime:t,gradeScale:s||"0-100",createdAt:Date.now()});u("semesterLabel")&&(u("semesterLabel").value="");const i=o.activeSemesterId||null;if(i&&await ks(i,l.id),await br(l.id),await new Promise(d=>setTimeout(d,400)),o.activeSemesterId){console.log(`✅ Semestre ${n} activado (${o.activeSemesterId}), preparando interfaz de ramos...`);const d=Gr(t);Yr(d),Re(),jr();const p=u("coursesSection");p&&p.classList.remove("hidden")}else console.warn("⚠️ No se estableció correctamente el semestre activo tras la creación.");jt(),Is()}),document.addEventListener("click",async t=>{const n=t.target;if(n instanceof HTMLElement){if(n.matches(".sem-activate")){if(!o.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;await br(r)}if(n.matches(".sem-delete")){if(!o.currentUser){alert("Debes iniciar sesión.");return}const r=n.dataset.id;if(!confirm("¿Eliminar este semestre?"))return;await fe(N(C,"users",o.currentUser.uid,"semesters",r)),o.activeSemesterId===r&&$t()}}})}async function Ls(){var f,v,x,y,h,E;if(it&&(it(),it=null),!o.currentUser)return;const e=o.profileData||{},t=((f=e.university)==null?void 0:f.trim())||"",n=((v=e.career)==null?void 0:v.trim())||"",r=((x=e.customUniversity)==null?void 0:x.trim())||"",a=((y=e.customCareer)==null?void 0:y.trim())||"",s=t&&t!=="OTRA"||r&&r!=="",l=n&&n!=="OTRA"||a&&a!=="",i=u("semestersList");if(!s||!l){i&&(i.innerHTML=`
        <div class="card" style="padding:20px; text-align:center;">
          <h3>⚠️ Antes de agregar semestres necesitas configurar tu perfil</h3>
          <p>Completa tu <b>universidad</b> y <b>carrera</b> para poder crear y visualizar semestres.</p>
          <button id="goToProfileBtn" class="btn-primary" style="margin-top:10px;">
            Ir a Perfil ahora →
          </button>
        </div>
      `,(h=u("goToProfileBtn"))==null||h.addEventListener("click",()=>{const k=u("subtabPerfil")||document.querySelector('[data-tab="perfil"]'),$=u("perfilContainer")||document.getElementById("perfilContainer");k&&$&&(document.querySelectorAll(".subtab").forEach(A=>A.classList.remove("active")),document.querySelectorAll(".page").forEach(A=>A.classList.add("hidden")),k.classList.add("active"),$.classList.remove("hidden"))}));return}const c=o.currentUser.uid,d=await te(N(C,"users",c)),p=d.exists()&&((E=d.data())==null?void 0:E.activeSemester)||null;if(p){o.activeSemesterId=p;const k=await te(N(C,"users",c,"semesters",p));o.activeSemesterData=k.exists()?k.data():null}if(o.activeSemesterId&&o.activeSemesterData){console.log("[Semesters] Restaurando semestre activo tras recarga:",o.activeSemesterData.label);const k=u("coursesSection");k&&k.classList.remove("hidden");const $=Gr(o.activeSemesterData.universityAtThatTime);Yr($),Re(),jr(),jt(),Is();const A=u("activeSemesterLabel");A&&(A.textContent=o.activeSemesterData.label||"—");const g=u("activeSemesterUni");g&&(g.textContent=o.activeSemesterData.universityAtThatTime||"—");const M=u("gr-activeSemLabel");M&&(M.textContent=o.activeSemesterData.label||"—");const S=u("gr-scaleSel"),b=u("gr-passThreshold");S&&(S.value=$==="UMAYOR"?"MAYOR":"USM",S.disabled=!0),b&&(b.value=$==="UMAYOR"?4:55),Tt(),ct==null||ct(),Le(),document.dispatchEvent(new Event("semester:changed"))}const m=P(C,"users",c,"semesters");it=Y(X(m,be("createdAt","desc")),k=>{const $=u("semestersList");if(!$)return;if($.innerHTML="",k.empty){$t();return}if(k.forEach(g=>{const M=g.data(),S=document.createElement("div");S.className="course-item";const b=o.activeSemesterId===g.id;S.innerHTML=`
        <div>
          <div><b>${M.label}</b> <span class="course-meta">· ${M.universityAtThatTime}</span></div>
        </div>
        <div class="inline">
          ${b?'<span class="course-meta">Activo</span>':`<button class="ghost sem-activate" data-id="${g.id}">Activar</button>`}
          <button class="danger sem-delete" data-id="${g.id}">Eliminar</button>
        </div>
      `,$.appendChild(S)}),k.docs.some(g=>g.id===o.activeSemesterId)||$t(),!o.activeSemesterId&&!k.empty){const g=k.docs[0].id;console.log("[Semesters] No había activo guardado, usando el más reciente:",g),br(g)}})}async function ks(e,t){var r;const n=(r=o.currentUser)==null?void 0:r.uid;if(!(!n||!e||!t))try{const a=P(C,"users",n,"semesters",e,"calendar"),s=P(C,"users",n,"semesters",t,"calendar"),l=await q(a);let i=0;for(const c of l.docs){const d=c.data();d.persistent&&(await Ee(s,{...d,createdAt:Date.now()}),i++)}console.log(`🔁 [Semesters] ${i} eventos persistentes copiados de ${e} a ${t}`)}catch(a){console.error("❌ Error copiando eventos persistentes:",a)}}async function br(e){var d,p,m,f;if(!o.currentUser||!e)return;o.activeSemesterId=e;const t=await te(N(C,"users",o.currentUser.uid,"semesters",e));o.activeSemesterData=t.exists()?t.data():null,await ye(N(C,"users",o.currentUser.uid),{activeSemester:e},{merge:!0}),o.lastActiveSemesterId&&o.lastActiveSemesterId!==e&&await ks(o.lastActiveSemesterId,e),o.lastActiveSemesterId=e;const n=u("activeSemesterLabel");n&&(n.textContent=((d=o.activeSemesterData)==null?void 0:d.label)||"—");const r=u("activeSemesterUni");r&&(r.textContent=((p=o.activeSemesterData)==null?void 0:p.universityAtThatTime)||"—");const a=u("gr-activeSemLabel");a&&(a.textContent=((m=o.activeSemesterData)==null?void 0:m.label)||"—");const s=Gr((f=o.activeSemesterData)==null?void 0:f.universityAtThatTime),l=u("gr-scaleSel"),i=u("gr-passThreshold");l&&(l.value=s==="UMAYOR"?"MAYOR":"USM",l.disabled=!0),i&&(i.value=s==="UMAYOR"?4:55);const c=u("coursesSection");c&&c.classList.remove("hidden"),Yr(s),Re(),jr(),Tt(),ct==null||ct(),Le(),Ls(),document.dispatchEvent(new Event("semester:changed"))}function $t(){o.activeSemesterId=null,o.activeSemesterData=null;const e=u("activeSemesterLabel");e&&(e.textContent="—");const t=u("activeSemesterUni");t&&(t.textContent="—");const n=u("coursesSection");n&&n.classList.add("hidden");const r=u("gr-activeSemLabel");r&&(r.textContent="—");const a=u("gr-scaleSel");a&&(a.value="USM",a.disabled=!0);const s=u("gr-passThreshold");s&&(s.value=""),Tt(),Le()}function Xl(e){return/^\d{4}-(1|2)$/.test(e||"")}function Ql(){const e=o.profileData;return!e||!e.university?null:e.university==="OTRA"?(e.customUniversity||"").trim()||null:e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function Gr(e){if(!e)return"";const t=e.toLowerCase();return t.includes("mayor")?"UMAYOR":t.includes("utfsm")||t.includes("santa maría")||t.includes("santa maria")?"USM":"OTRA"}async function ec(){if(!o.currentUser)return;const e=o.currentUser.uid,t=P(C,"users",e,"semesters"),n=await q(t);if(o.semesters=n.docs.map(r=>({id:r.id,...r.data()})),o.activeSemesterId){const r=P(C,"users",e,"semesters",o.activeSemesterId,"courses"),a=await q(r);o.courses=a.docs.map(s=>({id:s.id,...s.data()}))}console.log("📚 preloadCourses:",o.semesters,o.courses)}function jt(){const e=u("saveCourseBtn");e&&e.dataset.bound!=="1"&&(e.dataset.bound="1",e.addEventListener("click",async()=>{var t,n,r,a,s,l;try{if(!o.currentUser)return alert("Debes iniciar sesión.");const i=o.activeSemesterId;if(!i)return alert("No hay semestre activo.");const c=(t=u("courseName"))==null?void 0:t.value.trim();if(!c)return alert("Ingresa el nombre del ramo.");const d={name:c,code:((n=u("courseCode"))==null?void 0:n.value.trim())||"",professor:((r=u("courseProfessor"))==null?void 0:r.value.trim())||"",section:((a=u("courseSectPar"))==null?void 0:a.value.trim())||"",color:((s=u("courseColor"))==null?void 0:s.value)||"#3B82F6",asistencia:!!((l=document.getElementById("courseAsistencia"))!=null&&l.checked),createdAt:Date.now()};await Ee(P(C,"users",o.currentUser.uid,"semesters",i,"courses"),d),Re==null||Re(),console.log("[Courses] ✅ Ramo agregado en",i,d)}catch(i){console.error("❌ Error agregando ramo:",i),alert("No se pudo agregar el ramo. Revisa la consola.")}}))}function Is(){const e=document.getElementById("coursesList");e&&(e.dataset.bound=Date.now(),e.addEventListener("click",async t=>{const n=t.target;if(!(n instanceof HTMLElement))return;const r=o.activeSemesterId;if(!(!o.currentUser||!r)){if(n.matches(".course-del")){const a=n.dataset.id;if(!a||!confirm("¿Seguro que quieres eliminar este ramo?"))return;try{await fe(N(C,"users",o.currentUser.uid,"semesters",r,"courses",a)),console.log(`[Courses] Ramo eliminado: ${a}`)}catch(s){console.error("❌ Error eliminando ramo:",s),alert("No se pudo eliminar el ramo.")}}if(n.matches(".course-edit")){const a=n.dataset.id;if(!a)return;try{const s=N(C,"users",o.currentUser.uid,"semesters",r,"courses",a),l=await te(s);if(l.exists()){const i=l.data();u("courseName").value=i.name||"",u("courseCode").value=i.code||"",u("courseProfessor").value=i.professor||"",u("courseSectPar").value=i.section||"",u("courseColor").value=i.color||"#3B82F6",u("courseColorCode").textContent=(i.color||"#3B82F6").toUpperCase(),u("courseAsistencia").checked=!!i.asistencia;const c=u("saveCourseBtn"),d=u("cancelEditBtn");d.classList.remove("hidden"),c.textContent="Guardar cambios";const p=u("saveCourseBtn").cloneNode(!1);p.textContent="Guardar cambios",c.replaceWith(p);const m=async()=>{try{const f={name:u("courseName").value.trim(),code:u("courseCode").value.trim(),professor:u("courseProfessor").value.trim(),section:u("courseSectPar").value.trim(),color:u("courseColor").value,asistencia:!!u("courseAsistencia").checked};await ae(s,f),console.log(`[Courses] ✅ Ramo actualizado: ${a}`),Re(),d.classList.add("hidden"),p.textContent="Agregar ramo",jt()}catch(f){console.error("❌ Error actualizando ramo:",f),alert("No se pudo guardar el ramo editado.")}};p.addEventListener("click",m),d.onclick=()=>{Re(),d.classList.add("hidden"),p.textContent="Agregar ramo",jt()},d.onclick=()=>{Re(),d.classList.add("hidden"),newSaveBtn.textContent="Agregar ramo",jt()}}}catch(s){console.error("❌ Error al editar ramo:",s),alert("No se pudo cargar el ramo para editar.")}}}}))}let He=null;function tc(){He&&(He(),He=null),o.unsubscribeProfile=null}function nc(e){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const t=/^(\d{2})-(\d{2})$/.exec(e);if(t){const n=t[1];return`2000-${t[2]}-${n}`}return""}async function Ma(e){const t=await new Promise((r,a)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=a,s.readAsDataURL(e)});return await new Promise((r,a)=>{const s=new Image;s.onload=()=>r(s),s.onerror=a,s.src=t})}function Aa(e,t=256,n=.82){const r=document.createElement("canvas"),a=Math.min(e.width,e.height),s=(e.width-a)/2,l=(e.height-a)/2;return r.width=t,r.height=t,r.getContext("2d").drawImage(e,s,l,a,a,0,0,t,t),r.toDataURL("image/jpeg",n)}function Ot(e){const t=document.getElementById("pfAvatarCircle");t&&(e&&!e.startsWith("emoji:")?(t.textContent="",t.style.backgroundImage=`url("${e}")`):(t.style.backgroundImage="none",t.textContent="👨‍🎓"))}function rc(e,t){if(e&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;const n=/^(\d{2})-(\d{2})$/.exec(t||"");if(n){const r=n[1];return`2000-${n[2]}-${r}`}return null}let yn=null;const Ms={UMAYOR:[{value:"MEDVET",label:"Medicina Veterinaria"}],USM:[{value:"ICTEL",label:"Ing. Civil Telemática"}]};function Zn(e,t,n){if(!e)return;const r=e.querySelector('option[value="OTRA"]');r&&(r.textContent=n&&n.trim()?`${t}: ${n.trim()}`:t)}function As(){var c;He&&(He(),He=null);const e=(c=o.currentUser)==null?void 0:c.uid;if(!e)return;const t=N(C,"users",e),n=N(C,"users",e,"profile","profile"),r=(d,p)=>{const m=(d==null?void 0:d.data())||{},f=(p==null?void 0:p.data())||{};o.profileData={...m,...f,name:(f&&"name"in f?f.name:m==null?void 0:m.name)||(m==null?void 0:m.fullName)||(f==null?void 0:f.fullName)||""},delete o.profileData.fullName,m!=null&&m.name&&!o.profileData.name&&(o.profileData.name=m.name),m!=null&&m.fullName&&!o.profileData.name&&(o.profileData.name=m.fullName),f!=null&&f.name&&(o.profileData.name=f.name),f!=null&&f.fullName&&(o.profileData.name=f.fullName),Vr(o.profileData),Pn(),Le(),document.dispatchEvent(new Event("profile:changed"))};let a=null,s=null;const l=Y(t,d=>{a=d,r(a,s)}),i=Y(n,d=>{s=d,r(a,s)});He=()=>{l(),i()},o.unsubscribeProfile=He}function $s(){var l;const e=(i,c="")=>{const d=u(i);d&&(d.value=c)};e("pfName"),e("pfGoogleEmail"),e("pfBirthday"),e("pfFavoriteColor","#22c55e");const t=u("pfColorPreview");t&&(t.style.background="#22c55e");const n=u("pfColorCode");n&&(n.textContent="#22C55E");const r=u("pfUniversity")||u("uniSel");r&&(r.value="");const a=u("pfCareer")||u("careerSel");a&&(a.value="",a.disabled=!0),e("pfEmailUni"),e("pfPhone"),Ot(null);const s=u("pfBirthday");s&&((l=s.dataset)==null||delete l.dirty)}function Vr(e){var S;const t=u("pfName");t&&!t.dataset.bound&&(t.addEventListener("input",()=>{t.dataset.dirty="1"}),t.dataset.bound="1");const n=u("pfBirthday"),r=u("pfUniversity")||u("uniSel"),a=u("pfCustomUniWrap"),s=u("pfCustomUniversity");s&&!s.dataset.bound&&(s.addEventListener("input",()=>{s.dataset.dirty="1"}),s.dataset.bound="1");const l=u("pfCareer")||u("careerSel"),i=u("pfFavoriteColor"),c=u("pfColorPreview"),d=u("pfColorCode"),p=u("pfEmailUni")||u("pfEmail");p&&!p.dataset.bound&&(p.addEventListener("input",()=>{p.dataset.dirty="1"}),p.dataset.bound="1");const m=u("pfPhone")||u("pfTelefono");m&&!m.dataset.bound&&(m.addEventListener("input",()=>{m.dataset.dirty="1"}),m.dataset.bound="1");const f=u("pfGoogleEmail"),v=u("pfCancelBtn"),x=(b,w)=>{if(!l)return;l.innerHTML='<option value="">Selecciona tu carrera…</option>';const L=Ms[b]||[];for(const{value:U,label:B}of L){const T=document.createElement("option");T.value=U,T.textContent=B,l.appendChild(T)}const I=document.createElement("option");I.value="OTRA",I.textContent="Otra",l.appendChild(I),l.disabled=!1,w&&l.querySelector(`option[value="${w}"]`)?l.value=w:l.value="",Zn(l,"Otra",e==null?void 0:e.customCareer)};if(v&&!v.dataset.bound&&(v.onclick=()=>{var I,U;const b=o.profileData||null,w=u("pfUniversity")||u("uniSel"),L=u("pfCareer")||u("careerSel");if([u("pfName"),u("pfBirthday"),u("pfFavoriteColor"),u("pfEmailUni")||u("pfEmail"),u("pfPhone")||u("pfTelefono"),u("pfCustomUniversity"),u("pfCustomCareer"),w,L].forEach(B=>{B&&delete B.dataset.dirty}),w){const B=(b==null?void 0:b.university)||"";B==="Universidad Mayor"?w.value="UMAYOR":B==="UTFSM"||B==="USM"?w.value="USM":w.value=B||"",B==="OTRA"&&(w.value="OTRA")}L&&(x((w==null?void 0:w.value)||"",(b==null?void 0:b.career)||null),(b==null?void 0:b.career)==="OTRA"&&(L.value="OTRA")),(I=u("pfCustomUniWrap"))==null||I.classList.toggle("hidden",(w==null?void 0:w.value)!=="OTRA"),(w==null?void 0:w.value)==="OTRA"&&u("pfCustomUniversity")&&(u("pfCustomUniversity").value=(b==null?void 0:b.customUniversity)||""),(U=u("pfCustomCareerWrap"))==null||U.classList.toggle("hidden",(L==null?void 0:L.value)!=="OTRA"),(L==null?void 0:L.value)==="OTRA"&&u("pfCustomCareer")&&(u("pfCustomCareer").value=(b==null?void 0:b.customCareer)||""),Vr(b)},v.dataset.bound="1"),f&&((S=o.currentUser)!=null&&S.email)&&(f.value=o.currentUser.email),p){const b=document.activeElement===p,w=p.dataset.dirty==="1";!b&&!w&&(p.value=(e==null?void 0:e.uniEmail)||"")}if(m){const b=document.activeElement===m,w=m.dataset.dirty==="1";!b&&!w&&(m.value=(e==null?void 0:e.phone)||"")}if(t){const b=document.activeElement===t,w=t.dataset.dirty==="1";!b&&!w&&(t.value=(e==null?void 0:e.fullName)||(e==null?void 0:e.name)||"")}if(n){const b=nc((e==null?void 0:e.birthday)||""),w=document.activeElement===n,L=n.dataset.dirty==="1";!w&&!L&&(n.value=b||"",b?n.setAttribute("value",b):n.removeAttribute("value")),n.dataset.bound||(n.addEventListener("change",I=>{const U=I.target.value||"";n.dataset.dirty="1",n.value=U,U?n.setAttribute("value",U):n.removeAttribute("value"),o.profileData={...o.profileData||{},birthday:U}}),n.addEventListener("paste",I=>I.preventDefault()),n.addEventListener("drop",I=>I.preventDefault()),n.dataset.bound="1")}if(r){const b=document.activeElement===r,w=r.dataset.dirty==="1";if(!b&&!w){const L=(e==null?void 0:e.university)||"";L==="Universidad Mayor"?r.value="UMAYOR":L==="UTFSM"||L==="USM"?r.value="USM":r.value=L,Zn(r,"Otra",e==null?void 0:e.customUniversity)}if(r&&l){const L=document.activeElement===l,I=l.dataset.dirty==="1";!L&&!I&&(x(r.value,(e==null?void 0:e.career)||null),Zn(l,"Otra",e==null?void 0:e.customCareer))}}r&&!r.dataset.bound&&(r.addEventListener("change",()=>{r.dataset.dirty="1"}),r.dataset.bound="1"),a&&a.classList.add("hidden"),s&&(s.value="");const y=(r==null?void 0:r.value)==="OTRA";if(a&&a.classList.toggle("hidden",!y),y&&s&&s){const b=document.activeElement===s,w=s.dataset.dirty==="1";!b&&!w&&(s.value=(e==null?void 0:e.customUniversity)||"")}const h=u("pfCustomCareerWrap"),E=u("pfCustomCareer");E&&!E.dataset.bound&&(E.addEventListener("input",()=>{E.dataset.dirty="1"}),E.dataset.bound="1"),h&&h.classList.add("hidden"),E&&(E.value="");const k=(l==null?void 0:l.value)==="OTRA";if(h&&h.classList.toggle("hidden",!k),k&&E&&E){const b=document.activeElement===E,w=E.dataset.dirty==="1";!b&&!w&&(E.value=(e==null?void 0:e.customCareer)||"")}if(l&&!l.dataset.bound&&(l.addEventListener("change",()=>{l.dataset.dirty="1";const b=l.value==="OTRA";h&&h.classList.toggle("hidden",!b),!b&&E&&(E.value="")}),l.dataset.bound="1"),i){const b=document.activeElement===i,w=i.dataset.dirty==="1";if(!b&&!w){const L=En(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";i.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}if(r&&(r.onchange=()=>{const b=r.value==="OTRA";a&&a.classList.toggle("hidden",!b),!b&&s&&(s.value=""),x(r.value,null)}),l&&(e==null?void 0:e.career)==="OTRA"&&(e!=null&&e.customCareer)){const b=document.activeElement===l,w=l.dataset.dirty==="1";!b&&!w&&(l.value="OTRA")}if(i){const b=document.activeElement===i,w=i.dataset.dirty==="1";if(!b&&!w){const L=En(e==null?void 0:e.favoriteColor)?e.favoriteColor:"#22c55e";i.value=L,c&&(c.style.background=L),d&&(d.textContent=L.toUpperCase())}}i&&!i.dataset.bound&&(i.addEventListener("input",b=>{const w=b.target.value;i.dataset.dirty="1",En(w)&&(c&&(c.style.background=w),d&&(d.textContent=w.toUpperCase()))}),i.dataset.bound="1");const $=u("pfAvatarBtn"),A=u("pfAvatarFile");Ot((e==null?void 0:e.avatarData)||"emoji:👨‍🎓");let g=document.getElementById("pfDeleteAvatarBtn");g||(g=document.createElement("button"),g.id="pfDeleteAvatarBtn",g.className="btn btn-secondary",g.textContent="Eliminar foto de perfil",$.insertAdjacentElement("afterend",g)),A&&!A.dataset.bound&&(A.addEventListener("change",async b=>{var L;const w=(L=b.target.files)==null?void 0:L[0];if(w){if(!/^image\//.test(w.type)){alert("Elige una imagen válida.");return}try{const I=await Ma(w),U=Aa(I,256,.82);if(Ot(U),!o.currentUser)return;await ae(N(C,"users",o.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),$.textContent="Avatar actualizado ✓",setTimeout(()=>$.textContent="Cambiar avatar",1500)}catch(I){console.error(I),alert("No se pudo procesar la imagen.")}finally{b.target.value=""}}}),A.dataset.bound="1"),g.dataset.bound||(g.addEventListener("click",async()=>{if(o.currentUser&&confirm("¿Seguro que deseas eliminar tu foto de perfil?"))try{await ae(N(C,"users",o.currentUser.uid),{avatarData:null,avatarUrl:null,avatarUpdatedAt:Date.now()}),Ot("emoji:👨‍🎓"),alert("Avatar eliminado. Se restauró el emoji predeterminado 👨‍🎓.")}catch(b){console.error(b),alert("No se pudo eliminar el avatar.")}}),g.dataset.bound="1"),A&&!A.dataset.bound&&(A.addEventListener("change",async b=>{var L;const w=(L=b.target.files)==null?void 0:L[0];if(w){if(!/^image\//.test(w.type)){alert("Elige una imagen.");return}try{const I=await Ma(w),U=Aa(I,256,.82);if(Ot(U),!o.currentUser)return;await ae(N(C,"users",o.currentUser.uid),{avatarData:U,avatarUpdatedAt:Date.now()}),$&&($.textContent="Avatar actualizado ✓",setTimeout(()=>$.textContent="Cambiar avatar",1500))}catch(I){console.error(I),alert("No se pudo procesar la imagen.")}finally{b.target.value=""}}}),A.dataset.bound="1");const M=u("pfSaveBtn");M&&!M.dataset.bound&&(M.onclick=()=>Ns(),M.dataset.bound="1")}async function Ns(){var T,O,z,H,D,G,F,ce,Ne;if(!o.currentUser)return;const e=u("pfUniversity")||u("uniSel"),t=u("pfCareer")||u("careerSel"),n=((e==null?void 0:e.value)||"").trim()||null,r=n&&["UMAYOR","USM","OTRA"].includes(n),a=u("pfCustomUniversity")||u("uniCustom")||null,s=((a==null?void 0:a.value)||"").trim()||null,l=n?r?n:"OTRA":null;let i=null;n?r?n==="OTRA"&&(i=s||((T=o.profileData)==null?void 0:T.customUniversity)||null):i=n:i=null;const c=((t==null?void 0:t.value)||"").trim()||null,d=c&&["MEDVET","ICTEL","OTRA"].includes(c),p=u("pfCustomCareer")||u("careerCustom")||null,m=((p==null?void 0:p.value)||"").trim()||null,f=c?d?c:"OTRA":null;let v=null;c?d?c==="OTRA"&&(v=m||((O=o.profileData)==null?void 0:O.customCareer)||null):v=c:v=null;const x=((z=u("pfFavoriteColor"))==null?void 0:z.value)||null,y=(((H=u("pfEmailUni")||u("pfEmail"))==null?void 0:H.value)||"").trim(),h=(((D=u("pfPhone")||u("pfTelefono"))==null?void 0:D.value)||"").trim(),E=o.currentUser.uid,k=(e==null?void 0:e.value)||null;if(!(!y||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(y))){alert("Email universitario no es válido.");return}if(!(!h||/^[+()\s0-9-]{6,}$/.test(h))){alert("Teléfono no es válido.");return}t&&((G=Ms[k])!=null&&G.some(he=>he.value===t.value))&&t.value;const g=((F=u("pfBirthday"))==null?void 0:F.value)||null,M=((ce=o.profileData)==null?void 0:ce.birthday)||null,S=rc(g,M),w={name:((Ne=u("pfName"))==null?void 0:Ne.value.trim())||null,birthday:S??null,university:l,customUniversity:i,career:f,customCareer:v,favoriteColor:En(x)?x:null,uniEmail:y||null,phone:h||null,updatedAt:Date.now()},L=N(C,"users",E,"profile","profile");await ye(L,w,{merge:!0}),o.profileData={...o.profileData||{},...w};const I=document.getElementById("pfSaveBtn");if(I){const he=I.textContent;I.textContent="Guardado ✓",I.disabled=!0,setTimeout(()=>{I.textContent=he,I.disabled=!1},1800)}const U=document.getElementById("pfBirthday");U&&delete U.dataset.dirty;const B=u("pfName");B&&delete B.dataset.dirty,["pfEmailUni","pfPhone","pfCustomUniversity","pfCustomCareer"].forEach(he=>{const Pt=u(he);Pt&&delete Pt.dataset.dirty})}function Pn(){var t,n;const e=!!(o.profileData&&o.profileData.university&&(o.profileData.university!=="OTRA"||o.profileData.university==="OTRA"&&((t=o.profileData.customUniversity)!=null&&t.trim())));(n=u("semNoticeNoUni"))==null||n.classList.toggle("hidden",e),u("createSemesterBtn")&&(u("createSemesterBtn").disabled=!e||!o.currentUser),u("semesterLabel")&&(u("semesterLabel").disabled=!e),u("semesterUniFromProfile")&&(u("semesterUniFromProfile").value=e?ac(o.profileData):""),u("createPairBtn")&&(u("createPairBtn").disabled=!o.currentUser)}function ac(e){return!e||!e.university?"":e.university==="OTRA"?e.customUniversity||"Otra":e.university==="UMAYOR"?"Universidad Mayor":e.university==="USM"?"UTFSM":e.university}function sc(e){return!e||!e.career?"":e.career==="OTRA"?e.customCareer||"Otra":e.career==="ICTEL"?"Ing. Civil Telemática":e.career==="MEDVET"?"Medicina Veterinaria":e.career}function En(e){return typeof e=="string"&&/^#[0-9A-Fa-f]{6}$/.test(e)}function Ts(){const e=u("page-perfil");if(!e)return;let t=u("partnerProfileCard");t||(t=document.createElement("div"),t.className="card",t.id="partnerProfileCard",t.innerHTML=`
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
    `,t.classList.add("hidden"),e.appendChild(t));const n=()=>{u("pp-name").innerHTML="<b>Nombre:</b> —",u("pp-uni").innerHTML="<b>Universidad:</b> —",u("pp-career").innerHTML="<b>Carrera:</b> —",u("pp-bday").innerHTML="<b>Fecha de nacimiento:</b> —",u("pp-email").innerHTML="<b>Email universitario:</b> —",u("pp-phone").innerHTML="<b>Teléfono:</b> —",u("pp-color-code").textContent="—";const f=u("pp-color-swatch");f&&(f.style.background="transparent",f.style.border="1px solid rgba(255,255,255,.25)")};if(yn&&(yn(),yn=null),!o.pairOtherUid){n(),t&&t.classList.add("hidden");return}const r=N(C,"users",o.pairOtherUid),a=N(C,"users",o.pairOtherUid,"profile","profile");t.classList.remove("hidden");let s=null,l=null;const i=()=>{const f={...(s==null?void 0:s.data())||{},...(l==null?void 0:l.data())||{}},v=u("pp-avatar");v&&(f.avatarData?(v.style.backgroundImage=`url("${f.avatarData}")`,v.textContent=""):(v.style.backgroundImage="none",v.textContent="👨‍🎓",v.style.display="flex",v.style.alignItems="center",v.style.justifyContent="center",v.style.fontSize="2rem")),u("pp-name").innerHTML=`<b>Nombre:</b> ${f.name||"—"}`,u("pp-uni").innerHTML=`<b>Universidad:</b> ${d(f)}`,u("pp-career").innerHTML=`<b>Carrera:</b> ${sc(f)||"—"}`,u("pp-bday").innerHTML=`<b>Fecha de nacimiento:</b> ${c(f.birthday)}`,u("pp-email").innerHTML=`<b>Email universitario:</b> ${f.uniEmail||"—"}`,u("pp-phone").innerHTML=`<b>Teléfono:</b> ${f.phone||"—"}`;const x=typeof f.favoriteColor=="string"&&/^#[0-9A-Fa-f]{6}$/.test(f.favoriteColor)?f.favoriteColor:"#ff69b4",y=u("pp-color-swatch");y&&(y.style.background=x);const h=u("pp-color-code");h&&(h.textContent=x.toUpperCase())},c=f=>{if(!f)return"—";const v=/^(\d{4})-(\d{2})-(\d{2})$/.exec(f);return v?`${v[3]}/${v[2]}/${v[1]}`:f},d=f=>f!=null&&f.university?f.university==="UMAYOR"?"Universidad Mayor":f.university==="USM"?"UTFSM":f.university==="OTRA"?f.customUniversity||"Otra":f.university:"—",p=Y(r,f=>{s=f,i()}),m=Y(a,f=>{l=f,i()});yn=()=>{p(),m()}}document.addEventListener("pair:ready",()=>{Ts()});document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("uniSel"),t=document.getElementById("careerSel");function n(y,h,E){if(document.getElementById(y))return document.getElementById(y);const k=document.createElement("div");return k.id=y,k.className="modal",k.innerHTML=`
      <div class="modal-content" style="max-width:400px;text-align:center;">
        <h3>${h}</h3>
        <input id="${y}Input" type="text" placeholder="${E}" 
          style="width:100%;margin-top:1rem;padding:.8rem;border-radius:8px;
          border:none;background:rgba(255,255,255,0.1);color:white;">
        <div style="margin-top:1rem;display:flex;justify-content:center;gap:1rem;">
          <button id="${y}Save" class="btn">Guardar</button>
          <button id="${y}Cancel" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>`,document.body.appendChild(k),k}const r=n("uniModal","Agregar nueva universidad","Escribe el nombre..."),a=n("careerModal","Agregar nueva carrera","Escribe el nombre...");function s(y){y.classList.add("active");const h=y.querySelector("input");h.value="",h.focus()}function l(y){y.classList.remove("active")}e&&e.addEventListener("change",()=>{e.value==="OTRA"?s(r):t&&(t.disabled=!1)});const i=r.querySelector("#uniModalSave"),c=r.querySelector("#uniModalCancel"),d=r.querySelector("#uniModalInput");i.addEventListener("click",p),c.addEventListener("click",()=>l(r)),r.addEventListener("click",y=>{y.target===r&&l(r)}),d.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),p())});function p(){const y=d.value.trim();if(!y)return;if(!Array.from(e.options).find(E=>E.value===y)){const E=document.createElement("option");E.value=y,E.textContent=y,e.appendChild(E)}e.value=y,t&&(t.disabled=!1),l(r)}t&&t.addEventListener("change",()=>{t.value==="OTRA"&&s(a)});const m=a.querySelector("#careerModalSave"),f=a.querySelector("#careerModalCancel"),v=a.querySelector("#careerModalInput");m.addEventListener("click",x),f.addEventListener("click",()=>l(a)),a.addEventListener("click",y=>{y.target===a&&l(a)}),v.addEventListener("keydown",y=>{y.key==="Enter"&&(y.preventDefault(),x())});function x(){const y=v.value.trim();if(!y)return;if(!Array.from(t.options).find(E=>E.value===y)){const E=document.createElement("option");E.value=y,E.textContent=y,t.appendChild(E)}t.value=y,l(a)}});const oc=Object.freeze(Object.defineProperty({__proto__:null,clearProfileUI:$s,fillProfileForm:Vr,listenProfile:As,mountPartnerProfileCard:Ts,reflectProfileInSemestersUI:Pn,saveProfile:Ns,stopProfileListener:tc},Symbol.toStringTag,{value:"Module"}));function $a(e){document.querySelectorAll(".nav-tab[data-route]").forEach(t=>{t.dataset.route!=="#/perfil"&&(t.toggleAttribute("disabled",e),t.setAttribute("aria-disabled",String(e)))})}function ic(){if(window.__PartyPlannerAuthInit)return;window.__PartyPlannerAuthInit=!0;const e=u("signInBtn"),t=u("signOutBtn"),n=u("switchAccountBtn"),r=u("userBadge"),a=u("userName"),s=c=>{e&&(e.disabled=c),t&&(t.disabled=c),n&&(n.disabled=c)},l=c=>{r&&(r.classList.remove("hidden"),r.style.display="inline-flex"),e&&(e.classList.add("hidden"),e.style.display="none"),a&&(a.textContent=c||"—");const d=u("createPairBtn"),p=u("copyInviteBtn");d&&(d.disabled=!1),p&&(p.disabled=!1),$a(!1)},i=()=>{r&&(r.classList.add("hidden"),r.style.display="none"),e&&(e.classList.remove("hidden"),e.style.display="inline-block");const c=u("pairId"),d=u("copyInviteBtn"),p=u("createPairBtn");c&&(c.textContent="—"),d&&(d.disabled=!0),p&&(p.disabled=!0),o.profileData=null,Pn(),$t();const m=u("semestersList");m&&(m.innerHTML=""),$a(!0),location.hash="#/perfil"};e&&e.addEventListener("click",async()=>{s(!0);const c=new Zr;c.setCustomParameters({prompt:"select_account"});try{await Xr(ht,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Login cancelado por el usuario."):alert(`No se pudo iniciar sesión: ${p||d.message||d}`))}finally{s(!1)}}),n&&n.addEventListener("click",async()=>{s(!0);const c=new Zr;c.setCustomParameters({prompt:"select_account"});try{await Qr(ht),await Xr(ht,c)}catch(d){const p=(d==null?void 0:d.code)||"";p==="auth/popup-blocked"||(p==="auth/popup-closed-by-user"||p==="auth/cancelled-popup-request"||p==="auth/user-cancelled"?console.log("Cambio de cuenta cancelado por el usuario."):alert(`No se pudo cambiar de cuenta: ${p||d.message||d}`))}finally{s(!1)}}),t&&t.addEventListener("click",async()=>{var c;s(!0);try{await Qr(ht),o.currentUser=null,o.profileData=null,(c=o.unsubscribeProfile)==null||c.call(o),o.unsubscribeProfile=null,Kn==null||Kn(),$t(),$s(),i(),Le()}catch(d){console.error(d),alert(`No se pudo cerrar sesión: ${d.code||d.message||d}`)}finally{s(!1)}}),qs(ht,async c=>{if(s(!1),c){window.__heartbeat||(window.__heartbeat=setInterval(()=>{jn(!0)},2e3)),o.currentUser=c,await jn(!0),l(c.displayName||c.email||c.uid);try{await lc(c)}catch(d){console.error("ensureUserDoc failed:",d)}try{await ec(),console.log("✅ Semestres y cursos precargados")}catch(d){console.warn("⚠️ Error precargando cursos:",d)}try{As(),Pn()}catch(d){console.error("profile listen failed:",d)}setTimeout(()=>{ao().catch(d=>console.error("loadMyPair failed:",d))},800),setTimeout(()=>{Ls().catch(d=>console.error("refreshSemestersSub failed:",d))},1500),setTimeout(()=>{de(()=>Promise.resolve().then(()=>oc),void 0,import.meta.url).then(d=>{var p;return(p=d.mountPartnerProfileCard)==null?void 0:p.call(d)}).catch(()=>{})},2500),Le()}else window.__heartbeat&&(clearInterval(window.__heartbeat),window.__heartbeat=null),o.currentUser&&await jn(!1),o.currentUser=null,i(),Le()})}async function lc(e){var r,a,s,l;const t=N(C,"users",e.uid);(await te(t)).exists()?await ye(t,{email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((l=(s=e.providerData)==null?void 0:s[0])==null?void 0:l.providerId)||"google",lastLoginAt:Date.now()},{merge:!0}):await ye(t,{createdAt:Date.now(),email:e.email||null,displayName:e.displayName||null,photoURL:e.photoURL||null,providerId:((a=(r=e.providerData)==null?void 0:r[0])==null?void 0:a.providerId)||"google",preferences:{showNamesInShared:!0,theme:"dark"},lastLoginAt:Date.now()},{merge:!0})}let ne={},hr=[];function Us(e){const t=(e||"#/perfil").trim();return new Set(["#/perfil","#/semestres","#/horario","#/notas","#/malla","#/calendario","#/progreso","#/asistencia","#/party","#/ayuda"]).has(t)?t:"#/perfil"}function cc(e){const t=Us(e);location.hash!==t&&(location.hash=t),xr(t)}function xr(e){const t=Us(e),n=document.getElementById("pfActions");n&&n.classList.toggle("hidden",t!=="#/perfil"),hr.forEach(r=>r.classList.toggle("active",r.dataset.route===t)),Object.values(ne).forEach(r=>r&&r.classList.add("hidden")),t==="#/perfil"&&ne.perfil&&ne.perfil.classList.remove("hidden"),t==="#/semestres"&&ne.semestres&&ne.semestres.classList.remove("hidden"),t==="#/horario"&&ne.horario&&ne.horario.classList.remove("hidden"),t==="#/notas"&&ne.notas&&(ne.notas.classList.remove("hidden"),document.dispatchEvent(new Event("route:notas"))),t==="#/malla"&&ne.malla&&ne.malla.classList.remove("hidden"),t==="#/progreso"&&ne.progreso&&ne.progreso.classList.remove("hidden"),t==="#/calendario"&&ne.calendario&&(ne.calendario.classList.remove("hidden"),document.dispatchEvent(new Event("route:calendario"))),t==="#/asistencia"&&ne.asistencia&&ne.asistencia.classList.remove("hidden"),t==="#/party"&&ne.party&&ne.party.classList.remove("hidden"),t==="#/ayuda"&&ne.ayuda&&ne.ayuda.classList.remove("hidden"),document.dispatchEvent(new CustomEvent("route:change",{detail:{route:t}}))}function dc(){ne={perfil:u("page-perfil"),semestres:u("page-semestres"),horario:u("page-horario"),notas:u("page-notas"),malla:u("page-malla"),calendario:u("page-calendario"),progreso:u("page-progreso"),asistencia:u("page-asistencia"),party:u("page-party"),ayuda:u("page-ayuda")},hr=Array.from(document.querySelectorAll(".tab[data-route]"))||[],hr.forEach(e=>e.addEventListener("click",()=>cc(e.dataset.route))),window.addEventListener("hashchange",()=>xr(location.hash)),xr(location.hash||"#/perfil")}async function uc(){const e=await fetch("data/medvet_malla.csv").then(n=>n.text()).catch(()=>""),t=await fetch("data/ictel_malla.csv").then(n=>n.text()).catch(()=>"");return{MEDVET:e?pc(e):[],ICTEL:t?mc(t):[]}}function Ps(e){const t=e.trim().split(/\r?\n/).filter(Boolean);if(!t.length)return[];const n=t[0],r=n.split(";").length>=n.split(",").length?";":",",a=n.split(r).map(s=>s.trim().replace(/^['\"]|['\"]$/g,""));return t.slice(1).map(s=>{const l=s.split(r).map(c=>c.trim().replace(/^['\"]|['\"]$/g,"")),i={};return a.forEach((c,d)=>i[c]=l[d]??""),i})}function pc(e){return Ps(e).map(n=>{let r=n["Código Asignatura"]||n["Codigo Asignatura"]||"";return r.includes(".")&&(r=r.split(".")[0]),{codigo:r,nivel:(n.Nivel||"").trim()}})}function mc(e){return Ps(e).map(n=>{const r={};for(const[l,i]of Object.entries(n)){const c=l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();r[c]=(i||"").trim()}const a=(...l)=>{for(const i of l){const c=i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();if(c in r&&r[c])return r[c]}return""};let s=a("Sigla","Código","Codigo","Código Asignatura","Codigo Asignatura");return s||(s=a("Código Asignatura","Codigo Asignatura","Código","Codigo")),{codigo:s||"",nivel:(a("Nivel","Semestre")||"").toUpperCase()}})}function fc(){var n,r;const e=((n=o.profileData)==null?void 0:n.university)||"GEN",t=((r=o.profileData)==null?void 0:r.career)||"GEN";try{return JSON.parse(localStorage.getItem(`mallaAprobados:${e}:${t}`)||"[]")}catch{return[]}}function Xn(e,t){return t?e/t*100:0}function Qn(e){return`${(Math.round(e*10)/10).toFixed(1)}%`}let Oe=null,gn=null;async function yc(){Oe=await uc(),document.addEventListener("profile:changed",tt),document.addEventListener("malla:updated",tt),document.addEventListener("courses:changed",tt),document.addEventListener("pair:ready",tt),document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/progreso"&&tt()})}async function tt(){var i;const e=u("prog-combinado");if(!e)return;e.classList.remove("hidden"),e.innerHTML='<h3 style="margin:0 0 8px">Progreso combinado</h3><div class="muted">Conectando…</div>';const t=((i=o.profileData)==null?void 0:i.career)||null;if(!t||!Oe){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Completa tu perfil antes de ver el progreso. 🌱</div>`;return}const n=Oe&&Oe[t]?Oe[t].length:0,r=fc(),a=n?Xn(r.length,n):0;gn&&(gn(),gn=null);const s=o.pairOtherUid||null;if(!s){e.innerHTML=`<h3 style="margin:0 0 8px">Progreso combinado</h3>
    <div class="muted">Aún no estás conectado a un dúo. Crea o únete a una party. 👥</div>`;return}const l=N(C,"users",s,"malla","state");gn=Y(l,async c=>{const d=c.data()||{};let p=d.career||null;if((p==="UMAYOR"||p==="USM")&&(p=null),!p)try{const x=await te(N(C,"users",s));if(x.exists()){const y=x.data()||{};y.career&&(p=y.career)}}catch{}const m=Array.isArray(d.approved)?d.approved.length:0,f=p&&Oe&&Oe[p]?Oe[p].length:0,v=n+f?Xn(r.length+m,n+f):0;e.innerHTML=`
      <h3 style="margin:0 0 8px">🏁 Progreso combinado</h3>
      <div style="font-weight:600; margin-bottom:4px">Juntos llevan ${Qn(v)}</div>
      <div class="progress-outer small"><div class="progress-inner" style="width:${v}%;"></div></div>
      <div class="muted" style="margin-top:6px">Tú: ${Qn(a)} · Duo: ${Qn(Xn(m,f))}</div>
    `},c=>{e.innerHTML='<div class="muted">Error al conectar con el progreso del dúo.</div>'})}(function(){const t="prog-inline-styles";if(document.getElementById(t))return;const n=document.createElement("style");n.id=t,n.textContent=`
    .progress-outer{background:rgba(255,255,255,.08); border:1px solid rgba(0,0,0,.25);
      border-radius:10px; height:14px; margin-top:8px; overflow:hidden}
    .progress-outer.small{height:10px}
    .progress-inner{height:100%; background:linear-gradient(90deg, var(--primary), var(--accent));}
  `,document.head.appendChild(n)})();document.addEventListener("route:change",e=>{var t;((t=e.detail)==null?void 0:t.route)==="#/party"&&tt()});const Na=Object.freeze(Object.defineProperty({__proto__:null,initProgreso:yc,refreshProgreso:tt},Symbol.toStringTag,{value:"Module"}));window.addEventListener("DOMContentLoaded",async()=>{await Promise.all([ic(),dc(),ro(),Kl()]);const e=location.hash;e.startsWith("#/malla")?de(()=>import("./malla-CjZFBgsf.js"),[],import.meta.url).then(t=>{var n;return(n=t.initMallaOnRoute)==null?void 0:n.call(t)}):e.startsWith("#/notas")?de(()=>Promise.resolve().then(()=>ka),void 0,import.meta.url).then(t=>{var n;return(n=t.initGrades)==null?void 0:n.call(t)}):e.startsWith("#/asistencia")?de(()=>Promise.resolve().then(()=>wa),void 0,import.meta.url).then(t=>{var n;return(n=t.initAttendance)==null?void 0:n.call(t)}):e.startsWith("#/horario")?de(()=>Promise.resolve().then(()=>ya),void 0,import.meta.url).then(t=>{var n;return(n=t.initSchedule)==null?void 0:n.call(t)}):e.startsWith("#/calendario")?de(()=>Promise.resolve().then(()=>xa),void 0,import.meta.url).then(t=>{var n;return(n=t.initCalendar)==null?void 0:n.call(t)}):e.startsWith("#/progreso")&&de(()=>Promise.resolve().then(()=>Na),void 0,import.meta.url).then(t=>{var n;return(n=t.initProgreso)==null?void 0:n.call(t)}),document.addEventListener("route:change",async t=>{var r,a,s,l,i,c;const n=t.detail.route;if(n.startsWith("#/notas")){const d=await de(()=>Promise.resolve().then(()=>ka),void 0,import.meta.url);(r=d.initGrades)==null||r.call(d)}else if(n.startsWith("#/malla")){const d=await de(()=>import("./malla-CjZFBgsf.js"),[],import.meta.url);(a=d.initMallaOnRoute)==null||a.call(d)}else if(n.startsWith("#/asistencia")){const d=await de(()=>Promise.resolve().then(()=>wa),void 0,import.meta.url);(s=d.initAttendance)==null||s.call(d)}else if(n.startsWith("#/horario")){const d=await de(()=>Promise.resolve().then(()=>ya),void 0,import.meta.url);(l=d.initSchedule)==null||l.call(d)}else if(n.startsWith("#/calendario")){const d=await de(()=>Promise.resolve().then(()=>xa),void 0,import.meta.url);(i=d.initCalendar)==null||i.call(d)}else if(n.startsWith("#/progreso")){const d=await de(()=>Promise.resolve().then(()=>Na),void 0,import.meta.url);(c=d.initProgreso)==null||c.call(d)}})});export{u as $,C as d,o as s};
