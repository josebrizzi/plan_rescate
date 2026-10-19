/* ============ ZONA DE CONFIGURACIÓN — APP GRUPAL ============ */
const CODIGO_INVITACION = "RESCATE2025";
const CODIGO_PAIS = "54";
const MENSAJE_WHATSAPP = "Hola {nombre} 👋 Dios te bendice. ¿Cómo has estado? Te saludo con mucho cariño 🙏";
const MENSAJE_CUMPLE = "¡Feliz cumpleaños {nombre}! 🎂🎉 Que Dios te bendiga hoy y siempre, y que este nuevo año venga lleno de salud, alegría y bendiciones 🙏 Te abraza con cariño, la familia de Fe de Jesús 🤗";
const NOMBRE_ORG = "Fe de Jesús";
const CARACTERES = ['Amigable','Alegre','Enojón','Serio','Consagrado','Tímido','Disperso','Servicial','Sensible','Líder','Honrado','Trabajador','Genial','Reservado','Apático','Heredado','Nuevo converso','Anciano','Joven','Adulto'];
/* ====================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, writeBatch, onSnapshot, serverTimestamp, getDocs, query, where, increment, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { MOTIVOS } from "./motivos.js";
window.MOTIVOS = MOTIVOS;

const firebaseConfig = {
  apiKey: "AIzaSyB60b9ierInk3Xhf1ueyx-Tg7sJOPI4lQw",
  authDomain: "acompa-f19c9.firebaseapp.com",
  projectId: "acompa-f19c9",
  storageBucket: "acompa-f19c9.firebasestorage.app",
  messagingSenderId: "1089924717195",
  appId: "1:1089924717195:web:698ecb4818389058b2928e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);
const esc = s => (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- VERSÍCULO DEL DÍA ---------- */
const VERSICULOS = [
  {t:'"Sobrellevad los unos las cargas de los otros"', r:'Gá 6:2'},
  {t:'"Id por todo el mundo y predicad el evangelio a toda criatura"', r:'Mc 16:15'},
  {t:'"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar"', r:'Mt 11:28'},
  {t:'"La religión pura y sin mancha es visitar a los huérfanos y a las viudas"', r:'Stg 1:27'},
  {t:'"¿Qué hombre de vosotros, teniendo cien ovejas, si pierde una, no va tras la que se perdió?"', r:'Lc 15:4'},
  {t:'"Por tanto, id y haced discípulos"', r:'Mt 28:19'},
  {t:'"El amor de Dios ha sido derramado en nuestros corazones"', r:'Ro 5:5'},
  {t:'"Y considerémonos unos a otros para estimularnos al amor y a las buenas obras"', r:'He 10:24'},
  {t:'"Como cada uno recibió un don, ministrándolo unos a otros"', r:'1 P 4:10'},
  {t:'"Yo he venido para que tengan vida, y para que la tengan en abundancia"', r:'Jn 10:10'},
  {t:'"No nos cansemos de hacer el bien, porque a su tiempo segaremos"', r:'Gá 6:9'},
  {t:'"El Señor es mi pastor; nada me faltará"', r:'Sal 23:1'},
  {t:'"Estad siempre preparados para presentar defensa de la esperanza que hay en vosotros"', r:'1 P 3:15'},
  {t:'"El que haga volver a un pecador de su camino, salvará un alma"', r:'Stg 5:20'},
  {t:'"Amarás a tu prójimo como a ti mismo"', r:'Mt 22:39'},
  {t:'"Nada hagáis por rivalidad o vanagloria; con humildad estimad a los demás"', r:'Fil 2:3'},
  {t:'"La oración del justo puede mucho"', r:'Stg 5:16'},
  {t:'"He aquí cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía"', r:'Sal 133:1'},
  {t:'"Fortaleced las manos cansadas y afirmad las rodillas endebles"', r:'Is 35:3'},
  {t:'"Id por todo el mundo; predicad el evangelio a toda criatura"', r:'Mc 16:15'}
];
(function(){
  const dia = Math.floor(Date.now()/86400000) % VERSICULOS.length;
  const v = VERSICULOS[dia];
  const el = $('verso-hoy');
  if(el) el.innerHTML = `<b>📖</b> ${esc(v.t)} <b>— ${v.r}</b>`;
})();

/* ---------- TEMA ---------- */
function setTema(t){
  const claro = t==='claro';
  document.body.classList.toggle('claro', claro);
  $('btn-tema').textContent = claro ? '🌙' : '☀️';
  $('meta-tema').setAttribute('content', claro ? '#0f1f3a' : '#0f1f3a');
  try{ localStorage.setItem('tema', t); }catch(e){}
}
setTema((()=>{ try{ return localStorage.getItem('tema')||'oscuro'; }catch(e){ return 'oscuro'; } })());
$('btn-tema').onclick = ()=> setTema(document.body.classList.contains('claro') ? 'oscuro' : 'claro');

const ERRORES = {
  'auth/invalid-credential':'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials':'Correo o contraseña incorrectos.',
  'auth/user-not-found':'Correo o contraseña incorrectos.',
  'auth/wrong-password':'Correo o contraseña incorrectos.',
  'auth/email-already-in-use':'Ese correo ya tiene cuenta. Inicia sesión.',
  'auth/weak-password':'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email':'Escribe un correo válido.',
  'auth/too-many-requests':'Demasiados intentos. Espera un momento.',
  'auth/unauthorized-domain':'Dominio no autorizado: agrégalo en Firebase → Authentication → Settings → Authorized domains.',
  'auth/network-request-failed':'Sin conexión. Revisa tu internet.',
  'auth/operation-not-allowed':'El acceso con correo no está habilitado en Firebase.'
};

const TIPOS_VISITA = {
  oracion:{txt:'Oración',icono:'🙏',frase:'orar contigo'},
  uncion:{txt:'Unción',icono:'🕊️',frase:'orar y ungirte con aceite'},
  pastoral:{txt:'Visita pastoral',icono:'⛪',frase:'una visita pastoral'},
  estudio:{txt:'Estudio bíblico',icono:'📖',frase:'compartir un estudio bíblico'},
  acompanamiento:{txt:'Acompañamiento',icono:'☕',frase:'acompañarte y conversar'},
  reconciliacion:{txt:'Reconciliación',icono:'🤝',frase:'ayudarte en una reconciliación'}
};
const ESTADOS_VISITA = {
  programada:{txt:'Programada',color:'#008069'},
  confirmada:{txt:'Confirmada',color:'#00a884'},
  camino:{txt:'En camino',color:'#b45309'},
  realizada:{txt:'Realizada',color:'#54656f'},
  cancelada:{txt:'Cancelada',color:'#b03a3a'}
};
const MIEMBRO_TXT = {
  activo:'Activo · miembro activo ✅',
  frecuente:'Frecuente · viene regularmente ✅',
  visitante:'Visitante · aún no es miembro 🔵',
  alejado:'Alejado · hace tiempo que no viene ⚠️',
  apartado:'Apartado · en disciplina 🔴',
  censura:'⚖️ Bajo censura · período de prueba',
  desaparecido:'🔇 Desaparecido · paradero desconocido'
};
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

/* ============ ESTUDIOS BÍBLICOS ============ */
const ESTUDIOS = [
  {id:'02', img:'estudios/estudio-02-corazon-restaurado.png', titulo:'Un Corazón Restaurado', sub:'Perdón, arrepentimiento y nueva vida', ref:'Salmo 51:10-12', desc:'Para quien necesita saber que Dios perdona y restaura el corazón herido.'},
  {id:'03', img:'estudios/estudio-03-sabado.png', titulo:'Volver a Caminar con Dios: El Sábado', sub:'El descanso que Dios regala', ref:'Génesis 2:1-3', desc:'Para reavivar la comunión con Dios a través del día de reposo.'},
  {id:'04', img:'estudios/estudio-04-juicio-fidelidad.png', titulo:'Vida de Preparación: Juicio y Fidelidad', sub:'Diezmo, mayordomía y esperanza', ref:'Apocalipsis 14:6-7', desc:'Sobre mayordomía, fidelidad y la esperanza del regreso de Jesús.'},
  {id:'05', img:'estudios/estudio-05-gozo-retorno.png', titulo:'El Gozo del Retorno y la Esperanza', sub:'Jesús viene otra vez', ref:'Juan 14:1-3', desc:'La esperanza del segundo advento y el gozo de la comunión restaurada.'},
  {id:'06', img:'estudios/estudio-06-salvacion-regalo.png', titulo:'La Salvación es un Regalo', sub:'Vivir por la gracia de Jesús', ref:'Efesios 2:8-10', desc:'La gracia salvadora de Jesús como regalo inmerecido.'},
  {id:'07', img:'estudios/estudio-07-bautismo.png', titulo:'El Bautismo: Una Decisión para Toda la Vida', sub:'Reafirmar en Jesús para servir', ref:'Mateo 28:19-20', desc:'Reafirmación bautismal y renovación del compromiso.'},
  {id:'vc', img:'estudios/estudio-volver-casa.png', titulo:'Volver a Casa', sub:'El camino de regreso al Padre', ref:'Lucas 15:20', desc:'La parábola del hijo pródigo para quien necesita volver al Padre.'}
];

/* ============ ETAPAS DE RESCATE ============ */
const ETAPAS = {
  sin_contacto: { txt: 'Sin contacto', color:'#ef4444', icono:'🆕', siguiente:'primer_contacto' },
  primer_contacto: { txt: 'Primer contacto', color:'#f59e0b', icono:'💬', siguiente:'visita' },
  visita: { txt: 'Visita realizada', color:'#3b82f6', icono:'🏠', siguiente:'dialogo' },
  dialogo: { txt: 'Diálogo espiritual', color:'#a855f7', icono:'🙏', siguiente:'volviendo' },
  volviendo: { txt: 'Volviendo', color:'#22c55e', icono:'🌱', siguiente:'reintegrado' },
  reintegrado: { txt: 'Reintegrado', color:'#16a34a', icono:'✅', siguiente:null },
  no_desea: { txt: 'No desea contacto', color:'#6b7280', icono:'🚫', siguiente:null }
};

let user = null, personas = [], cuidadores = [], visitas = [];
let filtro = 'todos', busqueda = '';
let personaActual = null, editandoId = null, tipoContacto = 'llamada';
let vista = 'personas';
let calY, calM, calDia = null;
let visitaActual = null, editandoVisitaId = null, tipoVisitaSel = 'oracion';
let listasCargadas = false;
let unsubHist = null, historialActual = [];
let unsubVida = null, vidaActual = [];
let repCache = {key:'', contactos:[]};
let fCarSel = [];
let casosDisc = [];

function condMiembro(p){
  if(!p) return '';
  if(p.estadoMiembro) return p.estadoMiembro;
  return '';
}

/* ---------- AYUDA ---------- */
$('btn-ayuda').onclick = ()=> $('modal-ayuda').classList.remove('oculto');
$('ayuda-cerrar').onclick = ()=> $('modal-ayuda').classList.add('oculto');

/* ---------- OLVIDÉ MI CONTRASEÑA ---------- */
$('btn-forgot').onclick = async ()=>{
  const email = $('login-email').value.trim();
  if(!email){ alert('Primero escribí tu correo en el campo de arriba, después tocá "¿Olvidaste tu contraseña?".'); return; }
  try{
    await sendPasswordResetEmail(auth, email);
    alert('📬 Te enviamos un correo a '+email+'.\nAbrilo y seguí el enlace para crear una contraseña nueva.\n(Chequeá también la carpeta de spam)');
  }catch(e){
    alert(e.code==='auth/user-not-found'
      ? 'No existe una cuenta con ese correo. Verificá cómo lo escribiste o creá una cuenta nueva.'
      : 'No se pudo enviar el correo. Revisá la dirección e intentá de nuevo.');
  }
};

/* ---------- AUTENTICACIÓN ---------- */
$('go-reg').onclick = ()=>{ $('login-form').classList.add('oculto'); $('reg-form').classList.remove('oculto'); $('auth-msg').textContent=''; };
$('go-login').onclick = ()=>{ $('reg-form').classList.add('oculto'); $('login-form').classList.remove('oculto'); $('auth-msg').textContent=''; };

$('btn-login').onclick = async ()=>{
  $('auth-msg').textContent = 'Entrando…';
  try{ await signInWithEmailAndPassword(auth, $('login-email').value.trim(), $('login-pass').value); }
  catch(e){ $('auth-msg').textContent = ERRORES[e.code] || ('Error: '+e.message); }
};

$('btn-reg').onclick = async ()=>{
  const nombre=$('reg-nombre').value.trim(), email=$('reg-email').value.trim();
  const pass=$('reg-pass').value, cod=$('reg-codigo').value.trim();
  $('auth-msg').textContent='';
  if(!nombre){ $('auth-msg').textContent='Escribe tu nombre.'; return; }
  if(cod !== CODIGO_INVITACION){ $('auth-msg').textContent='Código de invitación incorrecto.'; return; }
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, {displayName: nombre});
    await setDoc(doc(db,'cuidadores',cred.user.uid), {nombre, email, creado: serverTimestamp()});
  }catch(e){ $('auth-msg').textContent = ERRORES[e.code] || ('Error: '+e.message); }
};

$('btn-salir').onclick = ()=> signOut(auth);

onAuthStateChanged(auth, u=>{
  user = u;
  if(u){
    $('view-login').classList.add('oculto');
    $('view-app').classList.remove('oculto');
    $('user-name').textContent = 'Dios te bendiga, ' + (u.displayName || u.email);
    if(!listasCargadas){ suscribir(); listasCargadas = true; }
  }else{
    $('view-app').classList.add('oculto');
    $('view-login').classList.remove('oculto');
  }
});

/* ---------- DATOS EN TIEMPO REAL ---------- */
function suscribir(){
  onSnapshot(collection(db,'personas'), snap=>{
    personas = snap.docs.map(d=>({id:d.id, ...d.data()}));
    personas.sort((a,b)=>(a.nombre||'').localeCompare(b.nombre||''));
    render(); renderCumples(); llenarSelectPersonas();
  }, e=>console.error(e));
  onSnapshot(collection(db,'cuidadores'), snap=>{
    cuidadores = snap.docs.map(d=>({uid:d.id, ...d.data()}));
    llenarSelectCuidadores();
    renderAgenda();
  });
  onSnapshot(collection(db,'visitas'), snap=>{
    visitas = snap.docs.map(d=>({id:d.id, ...d.data()}));
    visitas.sort((a,b)=>(a.fecha||'').localeCompare(b.fecha||'') || (a.hora||'').localeCompare(b.hora||''));
    renderAgenda(); renderCalendario();
  }, e=>console.error(e));
  onSnapshot(collection(db,'disciplina'), snap=>{
    casosDisc = snap.docs.map(d=>({id:d.id, ...d.data()}));
    if(!$('modal-disc').classList.contains('oculto')) renderDisc();
  }, e=>console.error(e));
}

/* ---------- SEMÁFORO ---------- */
function estado(p){
  const ms = p.ultimoContacto?.toMillis ? p.ultimoContacto.toMillis() : 0;
  if(!ms) return {color:'rojo', txt:'Nunca contactado', dias:99999};
  const d = Math.floor((Date.now()-ms)/86400000);
  return {color: d<=7?'verde': d<=14?'amarillo':'rojo',
          txt: d===0?'Contactado hoy':`Hace ${d} ${d===1?'día':'días'}`, dias:d};
}

/* ---------- PESTAÑAS ---------- */
function setVista(v){
  vista = v;
  $('tab-personas').classList.toggle('active', v==='personas');
  $('tab-agenda').classList.toggle('active', v==='agenda');
  $('pane-personas').classList.toggle('oculto', v!=='personas');
  $('pane-agenda').classList.toggle('oculto', v!=='agenda');
  $('btn-agregar').textContent = v==='agenda' ? '🏠' : '＋';
}
$('tab-personas').onclick = ()=> setVista('personas');
$('tab-agenda').onclick = ()=> setVista('agenda');

function esMesCumple(p){
  return !!(p.cumple && p.cumple.slice(5,7) === String(new Date().getMonth()+1).padStart(2,'0'));
}

function visibleParaMi(p){
  if(!user) return false;
  return !p.cuidadorUid || p.cuidadorUid===user.uid;
}

function renderCumples(){
  const hoy = new Date();
  const lista = personas.filter(p=>p.cumple && p.cumple.slice(5,7)===String(hoy.getMonth()+1).padStart(2,'0'))
    .filter(visibleParaMi)
    .map(p=>({p, dia:+p.cumple.slice(8)}))
    .sort((a,b)=>a.dia-b.dia);
  if(!lista.length){ $('cumples').innerHTML=''; return; }
  $('cumples').innerHTML = `<div class="cump-box">
    <div class="cump-titulo">🎂 Cumpleaños de ${MESES[hoy.getMonth()]} · ${lista.length} hermano${lista.length>1?'s':''}</div>
    <div class="cump-lista">${lista.map(x=>{
      const diff = x.dia - hoy.getDate();
      const cls = diff===0?'hoy':diff<0?'pasado':'';
      const eti = diff===0?'¡HOY! 🎉':diff<0?`fue hace ${-diff}d`:diff===1?'mañana':`en ${diff} días`;
      return `<span class="cump ${cls}" data-id="${x.p.id}">🎂 ${esc(x.p.nombre)} · ${x.dia} · ${eti}</span>`;
    }).join('')}</div></div>`;
  $('cumples').querySelectorAll('.cump').forEach(el=> el.onclick = ()=> abrirDetalle(el.dataset.id));
}

/* ---------- CONTADOR DE TAREAS ---------- */
function renderMetaTarea(){
  if(!user) return;
  const mias = personas.filter(p=>!p.cuidadorUid || p.cuidadorUid===user.uid);
  const rojas = mias.filter(p=>estado(p).color==='rojo').length;
  const amarillas = mias.filter(p=>estado(p).color==='amarillo').length;
  const reintegrados = mias.filter(p=>p.etapa==='reintegrado').length;
  $('meta-tarea').innerHTML = personas.length
    ? `🎯 Tu trabajo: <b>${mias.length}</b> persona${mias.length!==1?'s':''} · <b>${rojas}</b> urgente${rojas!==1?'s':''} 🔴${amarillas?' · '+amarillas+' 🟡':''} · <b>${reintegrados}</b> reintegrado${reintegrados!==1?'s':''} ✅`
    : '';
}

function gch(p){
  const c = condMiembro(p);
  if(c==='apartado') return '<span class="gch ausente">apartado</span>';
  if(c==='censura') return '<span class="gch silencioso">censura</span>';
  if(c==='alejado') return '<span class="gch silencioso">alejado</span>';
  return '';
}

function mch(p){
  const m = MOTIVOS[p.motivoAlejamiento];
  return m ? `<span class="mch">${esc(m.corto)}</span>` : '';
}

function etapaChip(p){
  const e = ETAPAS[p.etapa || 'sin_contacto'];
  return e ? `<span class="etapa-chip" data-etapa="${p.etapa || 'sin_contacto'}">${e.icono} ${e.txt}</span>` : '';
}

function render(){
  if(!user) return;
  renderMetaTarea();
  const nA = personas.filter(p=>['alejado','apartado','censura'].includes(condMiembro(p))).length;
  $('chip-atencion').textContent = nA ? `⚠️ ${nA}` : '⚠️ Atención';

  const q = busqueda.toLowerCase();
  let lista = personas.filter(p=> !q || p.nombre.toLowerCase().includes(q));
  if(filtro==='mias') lista = lista.filter(p=>p.cuidadorUid === user.uid);
  if(filtro==='atencion') lista = lista.filter(p=>['alejado','apartado','censura'].includes(condMiembro(p)));
  if(filtro==='urgentes') lista = lista.filter(p=>estado(p).color==='rojo' && p.etapa!=='reintegrado' && p.etapa!=='no_desea');
  if(filtro==='volviendo') lista = lista.filter(p=>['dialogo','volviendo'].includes(p.etapa));
  lista = lista.filter(visibleParaMi);

  const ocultas = personas.filter(p=> p.cuidadorUid && p.cuidadorUid!==user.uid).length;
  const np = $('nota-priv');
  if(ocultas>0){
    np.classList.remove('oculto');
    np.innerHTML = `🔒 ${ocultas} hermano${ocultas>1?'s':''} al cuidado de otros compañeros.`;
  }else np.classList.add('oculto');

  const orden = {rojo:0, amarillo:1, verde:2};
  const gOrden = {apartado:0, censura:1, alejado:2, visitante:3, frecuente:3, activo:3, '':3};
  const etapaOrden = {sin_contacto:0, primer_contacto:1, visita:2, dialogo:3, volviendo:4, no_desea:5, reintegrado:6};
  lista.sort((a,b)=>{
    const ea=estado(a), eb=estado(b);
    return orden[ea.color]-orden[eb.color]
      || (gOrden[condMiembro(a)]-gOrden[condMiembro(b)])
      || (etapaOrden[a.etapa||'sin_contacto']-etapaOrden[b.etapa||'sin_contacto'])
      || eb.dias-ea.dias || a.nombre.localeCompare(b.nombre);
  });

  $('lista').innerHTML = lista.map(p=>{
    const e = estado(p);
    const ini = (p.nombre||'?').trim().charAt(0).toUpperCase();
    return `<li class="persona" data-id="${p.id}">
      <div class="avw ${e.color}"><div class="av">${esc(ini)}</div></div>
      <div class="info"><div class="nombre">${esc(p.nombre)}${gch(p)}${mch(p)}${etapaChip(p)}</div>
      <div class="meta">${e.txt}${p.cuidadorNombre?' · 👤 '+esc(p.cuidadorNombre):''}</div></div>
      <div style="color:var(--txt2)">›</div></li>`;
  }).join('') || `<p style="text-align:center;color:var(--txt2);margin-top:30px">${filtro==='atencion'?'Nadie en situación de atención. 🎉':filtro==='urgentes'?'Nadie en situación urgente. 🎉':filtro==='volviendo'?'Nadie volviendo todavía.':'No hay personas en tu vista todavía.<br>Toca ＋ para agregar la primera.'}</p>`;

  $('lista').querySelectorAll('li.persona').forEach(li=> li.onclick = ()=> abrirDetalle(li.dataset.id));
}

$('buscar').oninput = e=>{ busqueda = e.target.value; render(); };
document.querySelectorAll('.chip[data-filtro]').forEach(ch=> ch.onclick = ()=>{
  document.querySelectorAll('.chip[data-filtro]').forEach(c=>c.classList.remove('active'));
  ch.classList.add('active'); filtro = ch.dataset.filtro; render();
});

/* ---------- FECHAS ---------- */
function hoyStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function fechaLarga(s){
  if(!s) return '';
  const [a,m,d]=s.split('-').map(Number);
  return new Date(a,m-1,d).toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'});
}
function etiquetaDia(s){
  const hoy = hoyStr();
  if(s===hoy) return 'Hoy · '+fechaLarga(s);
  const man = new Date(); man.setDate(man.getDate()+1);
  const mStr = man.getFullYear()+'-'+String(man.getMonth()+1).padStart(2,'0')+'-'+String(man.getDate()).padStart(2,'0');
  if(s===mStr) return 'Mañana · '+fechaLarga(s);
  return fechaLarga(s).charAt(0).toUpperCase()+fechaLarga(s).slice(1);
}

/* ---------- WHATSAPP ---------- */
function waNum(p){
  let d = (p.telefono||'').replace(/\D/g,'');
  if(!d) return null;
  if(CODIGO_PAIS && d.length<=10 && !d.startsWith(CODIGO_PAIS)) d = CODIGO_PAIS + d;
  if(CODIGO_PAIS==='54' && d.startsWith('54') && !d.startsWith('549') && d.length===12) d = '549' + d.slice(2);
  return d;
}
function waLink(p){
  const d = waNum(p);
  if(!d) return null;
  let plantilla = MENSAJE_WHATSAPP;
  if(esMesCumple(p)) plantilla = MENSAJE_CUMPLE;
  else if(['alejado','apartado'].includes(condMiembro(p))){
    const m = MOTIVOS[p.motivoAlejamiento];
    if(m) plantilla = m.mensaje;
    else plantilla = "Hola {nombre} 👋 Hace tiempo que no te vemos por la iglesia 🙏 ¿Cómo estás? ¿Todo bien por tu casa? Te extrañamos, un abrazo grande 🤗";
  }
  return 'https://wa.me/'+d+'?text='+encodeURIComponent(plantilla.replaceAll('{nombre}', p.nombre||''));
}
function waLinkMsg(p, texto){
  const d = waNum(p);
  if(!d) return null;
  return 'https://wa.me/'+d+'?text='+encodeURIComponent(texto);
}
function msgAvisoVisita(v){
  const t = TIPOS_VISITA[v.tipo]||{frase:'visitarte'};
  return `Hola ${v.personaNombre} 👋 Dios te bendiga 🙏 Te escribo para avisarte que el ${fechaLarga(v.fecha)} a las ${v.hora||''} hs te visitaré para ${t.frase}. ¿Te queda bien ese horario? 🏠`;
}
function msgPedirHorario(v){
  const t = TIPOS_VISITA[v.tipo]||{frase:'visitarte'};
  return `Hola ${v.personaNombre} 👋 Quiero coordinar una visita a tu casa para ${t.frase}. ¿En qué día y horario te encontrarías mejor? 🏠🙏`;
}
function msgCamino(v){
  return `Hola ${v.personaNombre} 👋 Ya estoy en camino a tu casa 🚗 Nos vemos en un rato 🙏`;
}

/* ---------- DETALLE PERSONA ---------- */
function fmtFecha(s){
  const [a,m,d] = s.split('-');
  return `${d} ${MESES[+m-1]}`;
}
function mapsLink(dir){
  return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(dir);
}

function abrirDetalle(id){
  const p = personas.find(x=>x.id===id); if(!p) return;
  if(!visibleParaMi(p)){ toast('🔒 Esta persona está al cuidado de otro compañero'); return; }
  personaActual = p;
  const e = estado(p);
  const avisoViejo = document.getElementById('aviso-ficha');
  if(avisoViejo) avisoViejo.remove();
  if(e.dias>=7 && e.dias!==99999 && p.etapa!=='reintegrado'){
    const div = document.createElement('div');
    div.className='aviso-ficha'; div.id='aviso-ficha';
    div.innerHTML = `⏰ Hace ${e.dias} día${e.dias!==1?'s':''} que no se la contacta. Cuando termines de hablar, tocá <b>✅ Guardar contacto</b>.`;
    const accionesEl = document.querySelector('#modal-detalle .acciones');
    if(accionesEl) accionesEl.after(div);
  }
  $('det-av').textContent = (p.nombre||'?').trim().charAt(0).toUpperCase();
  $('det-avw').className = 'avw grande '+e.color;
  $('det-nombre').innerHTML = esc(p.nombre) + gch(p) + mch(p);
  const chip = $('det-estado'); chip.textContent = e.txt; chip.className = 'estado-chip '+e.color;
  const ep = ETAPAS[p.etapa||'sin_contacto'];
  $('det-etapa').outerHTML = `<span id="det-etapa" class="etapa-chip" data-etapa="${p.etapa||'sin_contacto'}">${ep?ep.icono+' '+ep.txt:''}</span>`;
  const link = waLink(p), wa = $('det-wa');
  if(esMesCumple(p)) wa.textContent = '💬 Felicitar 🎂';
  else if(['alejado','apartado'].includes(condMiembro(p))) wa.textContent = '💬 ¿Todo bien?';
  else wa.textContent = '💬 WhatsApp';
  if(link){ wa.classList.remove('oculto'); wa.href = link; } else wa.classList.add('oculto');
  const ll = $('det-llamar');
  if(p.telefono){ ll.classList.remove('oculto'); ll.href = 'tel:'+p.telefono.replace(/\s/g,''); $('det-tel-txt').textContent = p.telefono; }
  else ll.classList.add('oculto');
  const bt = $('btn-tomar');
  if(!p.cuidadorUid && user) bt.classList.remove('oculto');
  else bt.classList.add('oculto');
  const m = MOTIVOS[p.motivoAlejamiento];
  $('det-motivo').textContent = m ? m.txt : (condMiembro(p)==='alejado' ? 'Alejado (sin motivo específico)' : '—');
  $('det-miembro').textContent = MIEMBRO_TXT[condMiembro(p)] || 'Sin dato de condición';
  $('det-bautismo').textContent = p.bautismo ? 'Bautizado/a el '+fmtFecha(p.bautismo) : 'Sin fecha de bautismo';
  $('det-caracter').innerHTML = (p.caracter && p.caracter.length)
    ? p.caracter.map(c=>`<span class="cch">${esc(c)}</span>`).join('') : 'Sin etiquetas de carácter';
  $('det-familia').textContent = p.familia || '—';
  const filaDir = $('det-direccion').parentElement;
  if(p.direccion){
    filaDir.classList.remove('oculto');
    $('det-direccion').innerHTML = `${esc(p.direccion)} <a href="${mapsLink(p.direccion)}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">🗺 Maps</a>`;
  } else filaDir.classList.add('oculto');
  $('det-cumple').textContent = p.cumple ? fmtFecha(p.cumple) : '—';
  $('det-desde').textContent = p.desde ? 'Alejado desde '+fmtFecha(p.desde) : '—';
  $('det-cuidador').textContent = p.cuidadorNombre || 'Sin asignar';

  if(m){
    $('det-recursos').innerHTML = `<div class="recurso-sug">
      <b>📚 Recursos para esta situación (${m.corto})</b><br>
      <span style="font-size:.82rem;color:var(--txt2)">${m.versiculos.length} versículos · consejo pastoral · mensaje modelo</span><br>
      <a id="ver-recursos-motivo">Ver recursos para ${m.corto} →</a>
    </div>`;
    const vrm = document.getElementById('ver-recursos-motivo');
    if(vrm) vrm.onclick = ()=>{
      $('modal-detalle').classList.add('oculto');
      renderRecursos('');
      $('modal-recursos').classList.remove('oculto');
      setTimeout(()=>{
        const head = document.querySelector(`.rec-cat-head[data-cat="${p.motivoAlejamiento||'otro'}"]`);
        if(head){ head.scrollIntoView({behavior:'smooth',block:'center'}); head.click(); }
      }, 100);
    };
  } else {
    $('det-recursos').innerHTML = '';
  }

  $('det-nota').value = '';
  $('vida-form').classList.add('oculto');
  setTipo('llamada');
  cargarHistorial(p.id);
  cargarHistoria(p.id);
  $('modal-detalle').classList.remove('oculto');
}

function cargarHistorial(pid){
  if(unsubHist) unsubHist();
  historialActual = [];
  $('det-historial-titulo').textContent = 'Historial de contactos…';
  $('det-historial').innerHTML = '';
  unsubHist = onSnapshot(query(collection(db,'contactos'), where('personaId','==',pid)), snap=>{
    historialActual = snap.docs.map(d=>({id:d.id, ...d.data()}));
    historialActual.sort((a,b)=>(b.fecha?.toMillis||0)-(a.fecha?.toMillis||0));
    renderHistorial();
  }, e=>console.error(e));
}

function renderHistorial(){
  if(!personaActual) return;
  $('det-historial-titulo').textContent = `Historial de contactos (${historialActual.length})`;
  $('det-historial').innerHTML = historialActual.map(c=>{
    const f = c.fecha?.toDate ? c.fecha.toDate() : null;
    const icono = {llamada:'📞', mensaje:'💬', visita:'🏠', visita_iglesia:'⛪'}[c.tipo] || '📌';
    const titulo = c.nota || {llamada:'Llamada', mensaje:'Mensaje', visita:'Visita', visita_iglesia:'Volvió a iglesia'}[c.tipo] || c.tipo;
    return `<li><div>${icono} ${esc(titulo)}</div>
      <div class="fecha">${f ? f.toLocaleDateString('es',{day:'2-digit',month:'short',year:'numeric'})+' · ':''}por ${esc(c.por||'—')}</div></li>`;
  }).join('') || '<li style="text-align:center;color:var(--txt2);background:none">Aún sin contactos registrados</li>';
}

function cargarHistoria(pid){
  if(unsubVida) unsubVida();
  vidaActual = [];
  $('det-vida').innerHTML = '<li style="text-align:center;color:var(--txt2);background:none">Cargando…</li>';
  unsubVida = onSnapshot(query(collection(db,'historia'), where('personaId','==',pid)), snap=>{
    vidaActual = snap.docs.map(d=>({id:d.id, ...d.data()}));
    vidaActual.sort((a,b)=>(b.fecha?.toMillis||0)-(a.fecha?.toMillis||0));
    renderHistoria();
  }, e=>console.error(e));
}

function renderHistoria(){
  if(!personaActual) return;
  $('det-vida').innerHTML = vidaActual.map(v=>{
    const f = v.fecha?.toDate ? v.fecha.toDate() : null;
    return `<li><div>📖 ${esc(v.texto)}</div>
      <div class="fecha">${f ? f.toLocaleDateString('es',{day:'2-digit',month:'short',year:'numeric'}) : ''}${v.por?' · registrado por '+esc(v.por):''}</div></li>`;
  }).join('') || '<li style="text-align:center;color:var(--txt2);background:none">Sin notas de historia todavía.</li>';
}

$('btn-agregar-vida').onclick = ()=>{
  $('vida-form').classList.toggle('oculto');
  $('vida-fecha').value = hoyStr();
  $('vida-texto').value = '';
};

$('btn-guardar-vida').onclick = async ()=>{
  if(!personaActual) return;
  const texto = $('vida-texto').value.trim();
  if(!texto){ toast('Escribí qué sucedió'); return; }
  const f = $('vida-fecha').value;
  try{
    await addDoc(collection(db,'historia'), {
      personaId: personaActual.id,
      nombrePersona: personaActual.nombre || '',
      texto,
      fecha: f ? Timestamp.fromMillis(new Date(f+'T12:00:00').getTime()) : serverTimestamp(),
      por: user.displayName || user.email,
      creado: serverTimestamp()
    });
    $('vida-texto').value = '';
    $('vida-form').classList.add('oculto');
    toast('📖 Nota de historia guardada');
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

$('det-cerrar').onclick = ()=>{
  $('modal-detalle').classList.add('oculto');
  personaActual = null;
  if(unsubHist){ unsubHist(); unsubHist = null; }
  historialActual = [];
  if(unsubVida){ unsubVida(); unsubVida = null; }
  vidaActual = [];
};

function setTipo(t){
  tipoContacto = t;
  document.querySelectorAll('.tipo[data-tipo]').forEach(b=>b.classList.toggle('active', b.dataset.tipo===t));
}
document.querySelectorAll('.tipo[data-tipo]').forEach(b=> b.onclick = ()=> setTipo(b.dataset.tipo));

$('btn-tomar').onclick = async ()=>{
  if(!personaActual || personaActual.cuidadorUid || !user) return;
  if(!confirm(`¿Hacerte cargo del seguimiento de ${personaActual.nombre}?\n\nPasará a "Mis asignadas" a tu nombre.`)) return;
  try{
    await updateDoc(doc(db,'personas',personaActual.id), {
      cuidadorUid: user.uid,
      cuidadorNombre: user.displayName || user.email,
      actualizado: serverTimestamp()
    });
    toast('🙋 Esta persona ahora está a tu cargo');
    abrirDetalle(personaActual.id);
  }catch(e){ toast('Error'); console.error(e); }
};

$('btn-cambiar-etapa').onclick = ()=>{
  if(!personaActual) return;
  const actual = ETAPAS[personaActual.etapa||'sin_contacto'];
  const sig = actual.siguiente ? ETAPAS[actual.siguiente] : null;
  let msg = `Etapa actual: ${actual.icono} ${actual.txt}\n\nOpciones:\n${Object.entries(ETAPAS).map(([k,v])=>`${v.icono} ${v.txt}`).join('\n')}`;
  if(sig){
    msg += `\n\nSugerencia: pasar a "${sig.icono} ${sig.txt}". ¿Querés avanzar a esa etapa? (Cancelar para elegir otra)`;
    if(confirm(msg)){ cambiarEtapa(actual.siguiente); }
    else {
      const nueva = prompt('Escribí el nombre de la etapa exacta:\n'+Object.keys(ETAPAS).join(' · '));
      if(nueva && ETAPAS[nueva]) cambiarEtapa(nueva);
    }
  } else {
    const nueva = prompt(`Etapa actual: ${actual.icono} ${actual.txt}\n\nEscribí el nombre de la etapa exacta:\n`+Object.keys(ETAPAS).join(' · '));
    if(nueva && ETAPAS[nueva]) cambiarEtapa(nueva);
  }
};

async function cambiarEtapa(nuevaEtapa){
  if(!personaActual) return;
  const e = ETAPAS[nuevaEtapa];
  try{
    await updateDoc(doc(db,'personas',personaActual.id), { etapa: nuevaEtapa, actualizado: serverTimestamp() });
    await addDoc(collection(db,'historia'), {
      personaId: personaActual.id,
      nombrePersona: personaActual.nombre || '',
      texto: `Cambio de etapa: ${e.icono} ${e.txt}`,
      fecha: serverTimestamp(),
      por: user.displayName || user.email,
      creado: serverTimestamp()
    });
    toast(`${e.icono} Etapa actualizada`);
    abrirDetalle(personaActual.id);
  }catch(err){ toast('Error'); console.error(err); }
}

$('btn-guardar-contacto').onclick = async ()=>{
  if(!personaActual) return;
  try{
    await addDoc(collection(db,'contactos'), {
      personaId: personaActual.id,
      nombrePersona: personaActual.nombre || '',
      tipo: tipoContacto,
      nota: $('det-nota').value.trim(),
      por: user.displayName || user.email,
      fecha: serverTimestamp()
    });
    await updateDoc(doc(db,'personas',personaActual.id), {
      ultimoContacto: serverTimestamp(),
      nContactos: increment(1)
    });
    if((personaActual.etapa==='sin_contacto' || !personaActual.etapa) && ['llamada','mensaje','visita','visita_iglesia'].includes(tipoContacto)){
      await updateDoc(doc(db,'personas',personaActual.id), { etapa: 'primer_contacto' });
      await addDoc(collection(db,'historia'), {
        personaId: personaActual.id, nombrePersona: personaActual.nombre || '',
        texto: `Primer contacto registrado 💬`,
        fecha: serverTimestamp(), por: user.displayName || user.email, creado: serverTimestamp()
      });
    }
    if(tipoContacto==='visita_iglesia' && personaActual.etapa!=='reintegrado'){
      await updateDoc(doc(db,'personas',personaActual.id), { etapa: 'volviendo' });
      await addDoc(collection(db,'historia'), {
        personaId: personaActual.id, nombrePersona: personaActual.nombre || '',
        texto: `🌱 Volvió a la iglesia`,
        fecha: serverTimestamp(), por: user.displayName || user.email, creado: serverTimestamp()
      });
    }
    $('det-nota').value = '';
    toast('✅ Contacto de '+(personaActual.nombre||'la persona')+' registrado — gracias 🙏');
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

$('btn-agregar').onclick = ()=>{ if(vista==='agenda'){ abrirVisitaForm(null); return; } abrirForm(null); };
$('btn-editar-ficha').onclick = ()=>{ if(personaActual) abrirForm(personaActual); };

function llenarCaracter(seleccionadas){
  fCarSel = [...(seleccionadas||[])];
  $('f-caracter').innerHTML = CARACTERES.map(c=>
    `<button type="button" class="tipo ${fCarSel.includes(c)?'active':''}" data-car="${esc(c)}">${esc(c)}</button>`).join('');
  $('f-caracter').querySelectorAll('.tipo').forEach(b=> b.onclick = ()=>{
    const c = b.dataset.car;
    if(fCarSel.includes(c)){ fCarSel = fCarSel.filter(x=>x!==c); b.classList.remove('active'); }
    else { fCarSel.push(c); b.classList.add('active'); }
  });
}

function llenarSelectCuidadores(seleccionado){
  const sel = $('f-cuidador');
  const actual = seleccionado !== undefined ? seleccionado : sel.value;
  sel.innerHTML = '<option value="">👤 — Sin asignar —</option>' +
    cuidadores.map(c=>`<option value="${c.uid}">${esc(c.nombre)}</option>`).join('');
  sel.value = actual || '';
  if(sel.value !== (actual||'')) sel.value = '';
}

function abrirForm(p){
  editandoId = p ? p.id : null;
  $('form-titulo').textContent = p ? 'Editar persona' : 'Agregar persona';
  $('f-nombre').value = p?.nombre || '';
  $('f-telefono').value = p?.telefono || '';
  $('f-direccion').value = p?.direccion || '';
  llenarSelectCuidadores(p?.cuidadorUid || '');
  $('f-miembro').value = condMiembro(p);
  $('f-motivo-alejamiento').innerHTML = Object.entries(MOTIVOS).map(([k,m])=>`<option value="${k}">${esc(m.txt)}</option>`).join('');
  $('f-motivo-alejamiento').value = p?.motivoAlejamiento || 'apatico';
  $('f-etapa').innerHTML = Object.entries(ETAPAS).map(([k,v])=>`<option value="${k}">${v.icono} ${v.txt}</option>`).join('');
  $('f-etapa').value = p?.etapa || 'sin_contacto';
  $('f-desde').value = p?.desde || '';
  $('f-bautismo').value = p?.bautismo || '';
  llenarCaracter(p?.caracter || []);
  $('f-familia').value = p?.familia || '';
  $('f-cumple').value = p?.cumple || '';
  $('f-notas').value = p?.notas || '';
  $('btn-eliminar-persona').classList.toggle('oculto', !p);
  $('modal-detalle').classList.add('oculto');
  $('modal-form').classList.remove('oculto');
}

function cerrarForm(volverADetalle){
  $('modal-form').classList.add('oculto');
  editandoId = null;
  if(volverADetalle && personaActual) abrirDetalle(personaActual.id);
  else personaActual = null;
}

$('f-cerrar').onclick = ()=> cerrarForm(false);

$('btn-guardar-persona').onclick = async ()=>{
  const nombre = $('f-nombre').value.trim();
  if(!nombre){ toast('Falta el nombre'); return; }
  const uidSel = $('f-cuidador').value;
  const cuen = cuidadores.find(c=>c.uid===uidSel);
  const datos = {
    nombre, telefono: $('f-telefono').value.trim(),
    direccion: $('f-direccion').value.trim(),
    cuidadorUid: uidSel || '',
    cuidadorNombre: cuen ? cuen.nombre : '',
    estadoMiembro: $('f-miembro').value || '',
    motivoAlejamiento: $('f-motivo-alejamiento').value,
    etapa: $('f-etapa').value,
    desde: $('f-desde').value || '',
    bautismo: $('f-bautismo').value || '',
    caracter: fCarSel,
    familia: $('f-familia').value.trim(),
    cumple: $('f-cumple').value || '',
    notas: $('f-notas').value.trim(),
    actualizado: serverTimestamp()
  };
  try{
    if(editandoId){
      await updateDoc(doc(db,'personas',editandoId), datos);
      toast('✅ Cambios guardados'); cerrarForm(true);
    }else{
      datos.creado = serverTimestamp();
      await addDoc(collection(db,'personas'), datos);
      toast('✅ Persona agregada'); cerrarForm(false);
    }
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

$('btn-eliminar-persona').onclick = async ()=>{
  if(!editandoId) return;
  if(!confirm('¿Eliminar esta persona y todo su historial? No se puede deshacer.')) return;
  try{
    const cs = await getDocs(query(collection(db,'contactos'), where('personaId','==',editandoId)));
    const vs = await getDocs(query(collection(db,'historia'), where('personaId','==',editandoId)));
    const ds = await getDocs(query(collection(db,'disciplina'), where('personaId','==',editandoId)));
    const batch = writeBatch(db);
    cs.forEach(d=> batch.delete(d.ref));
    vs.forEach(d=> batch.delete(d.ref));
    ds.forEach(d=> batch.delete(d.ref));
    visitas.filter(v=>v.personaId===editandoId).forEach(v=> batch.delete(doc(db,'visitas',v.id)));
    batch.delete(doc(db,'personas',editandoId));
    await batch.commit();
    toast('Eliminada'); cerrarForm(false);
  }catch(e){ toast('Error al eliminar'); console.error(e); }
};

/* ---------- CALENDARIO ---------- */
function renderCalendario(){
  $('cal-titulo').textContent = MESES[calM]+' '+calY;
  const hoy = hoyStr();
  const pendMap = new Map();
  for(const v of visitas){
    if(!['programada','confirmada','camino'].includes(v.estado)) continue;
    if(!pendMap.has(v.fecha)) pendMap.set(v.fecha,[]);
    pendMap.get(v.fecha).push(v);
  }
  const primerDia = new Date(calY, calM, 1);
  const offset = (primerDia.getDay()+6)%7;
  const cantDias = new Date(calY, calM+1, 0).getDate();
  let html = ['L','M','X','J','V','S','D'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<offset;i++) html += '<div class="cal-d vacio"></div>';
  for(let d=1;d<=cantDias;d++){
    const fs = calY+'-'+String(calM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const cls = (fs===hoy?'hoy ':'') + (calDia===fs?'sel':'');
    const del = pendMap.get(fs)||[];
    let pills = '';
    del.slice(0,2).forEach(v=>{
      const e = ESTADOS_VISITA[v.estado]||ESTADOS_VISITA.programada;
      const nombre = (v.personaNombre||'').split(' ')[0];
      pills += `<span class="cal-pill" data-vid="${v.id}" style="background:${e.color}" title="${esc(v.personaNombre)}">${esc(nombre)}</span>`;
    });
    if(del.length>2) pills += `<span class="cal-mas">+${del.length-2}</span>`;
    html += `<div class="cal-d ${cls}" data-fecha="${fs}"><span class="num">${d}</span>${pills}</div>`;
  }
  $('cal-grid').innerHTML = html;
  $('cal-grid').querySelectorAll('.cal-d[data-fecha]').forEach(el=> el.onclick = ()=>{
    calDia = calDia===el.dataset.fecha ? null : el.dataset.fecha;
    renderCalendario(); renderAgenda();
  });
  $('cal-grid').querySelectorAll('.cal-pill').forEach(p=> p.onclick = ev=>{
    ev.stopPropagation();
    abrirVisita(p.dataset.vid);
  });
}
$('cal-prev').onclick = ()=>{ calM--; if(calM<0){calM=11;calY--;} calDia=null; renderCalendario(); renderAgenda(); };
$('cal-next').onclick = ()=>{ calM++; if(calM>11){calM=0;calY++;} calDia=null; renderCalendario(); renderAgenda(); };
$('btn-ver-todas').onclick = ()=>{ calDia=null; renderCalendario(); renderAgenda(); };

function itemVisita(v){
  const t = TIPOS_VISITA[v.tipo]||{icono:'🏠',txt:v.tipo};
  const e = ESTADOS_VISITA[v.estado]||ESTADOS_VISITA.programada;
  return `<li class="persona" data-id="${v.id}">
    <div class="avw icn"><div class="av">${t.icono}</div></div>
    <div class="info"><div class="nombre">${v.hora||''} · ${esc(v.personaNombre)}</div>
    <div class="meta">${t.txt}${v.responsableNombre?' · 👤 '+esc(v.responsableNombre):''}</div></div>
    <span class="vch" style="background:${e.color}">${e.txt}</span></li>`;
}

function renderAgenda(){
  if(!user) return;
  const hoy = hoyStr();
  const activos = visitas.filter(v=>['programada','confirmada','camino'].includes(v.estado));
  const deHoy = activos.filter(v=>v.fecha===hoy);
  $('resumen-txt').innerHTML = calDia
    ? `📅 <b>${etiquetaDia(calDia)}</b>`
    : `Hoy hay <b>${deHoy.length}</b> ${deHoy.length===1?'visita':'visitas'} programadas`;

  if(calDia){
    const lista = visitas.filter(v=>v.fecha===calDia)
      .sort((a,b)=>(a.estado==='realizada'||a.estado==='cancelada')-(b.estado==='realizada'||b.estado==='cancelada') || (a.hora||'').localeCompare(b.hora||''));
    $('lista-visitas').innerHTML = lista.map(itemVisita).join('') || `<p style="text-align:center;color:var(--txt2);margin-top:30px">Sin visitas ese día.</p>`;
  }else{
    const atrasadas = activos.filter(v=>v.fecha<hoy);
    const proximas = activos.filter(v=>v.fecha>=hoy);
    let html = '';
    if(atrasadas.length){
      html += `<li class="fgrupo atras">⚠️ Atrasadas</li>` + atrasadas.map(itemVisita).join('');
    }
    if(proximas.length){
      let grupo = '';
      proximas.forEach(v=>{
        const et = etiquetaDia(v.fecha);
        if(et!==grupo){ html += `<li class="fgrupo">${et}</li>`; grupo = et; }
        html += itemVisita(v);
      });
    }
    $('lista-visitas').innerHTML = html || `<p style="text-align:center;color:var(--txt2);margin-top:30px">No hay visitas agendadas.<br>Toca 🏠 para agendar la primera.</p>`;
  }
  $('lista-visitas').querySelectorAll('li.persona').forEach(li=> li.onclick = ()=> abrirVisita(li.dataset.id));
}

function llenarSelectPersonas(){
  const sel = $('vf-persona');
  const actual = sel.value;
  sel.innerHTML = personas.filter(visibleParaMi).map(p=>`<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  if(actual) sel.value = actual;
  $('vf-tipos').innerHTML = Object.entries(TIPOS_VISITA).map(([k,t])=>
    `<button type="button" class="tipo ${k===tipoVisitaSel?'active':''}" data-vtipo="${k}">${t.icono} ${t.txt}</button>`).join('');
  $('vf-tipos').querySelectorAll('.tipo').forEach(b=> b.onclick = ()=>{
    tipoVisitaSel = b.dataset.vtipo;
    $('vf-tipos').querySelectorAll('.tipo').forEach(x=>x.classList.toggle('active', x.dataset.vtipo===tipoVisitaSel));
  });
}

function llenarSelectResponsables(selUid){
  const sel = $('vf-responsable');
  sel.innerHTML = cuidadores.map(c=>`<option value="${c.uid}">${esc(c.nombre)}</option>`).join('') +
    (user && !cuidadores.find(c=>c.uid===user.uid) ? `<option value="${user.uid}">${esc(user.displayName||user.email)}</option>` : '');
  if(selUid) sel.value = selUid;
  else if(user && cuidadores.find(c=>c.uid===user.uid)) sel.value = user.uid;
}

function abrirVisitaForm(v){
  editandoVisitaId = v ? v.id : null;
  $('vf-titulo').textContent = v ? 'Editar visita' : 'Agendar visita';
  llenarSelectPersonas();
  if(v){
    $('vf-persona').value = v.personaId;
    tipoVisitaSel = v.tipo;
  }else if(personaActual){
    $('vf-persona').value = personaActual.id;
  }
  $('vf-tipos').querySelectorAll('.tipo').forEach(x=>x.classList.toggle('active', x.dataset.vtipo===tipoVisitaSel));
  $('vf-fecha').value = v?.fecha || hoyStr();
  $('vf-hora').value = v?.hora || '19:00';
  llenarSelectResponsables(v?.responsableUid);
  $('vf-nota').value = v?.nota || '';
  if(personaActual){ $('modal-detalle').classList.add('oculto'); }
  $('modal-visita-form').classList.remove('oculto');
}
$('vf-cerrar').onclick = ()=>{
  $('modal-visita-form').classList.add('oculto');
  editandoVisitaId = null;
  if(personaActual) abrirDetalle(personaActual.id);
};

$('btn-agendar-visita').onclick = ()=>{ if(personaActual) abrirVisitaForm(null); };

$('btn-guardar-visita').onclick = async ()=>{
  const pid = $('vf-persona').value;
  const p = personas.find(x=>x.id===pid);
  if(!p){ toast('Elegí una persona'); return; }
  const fecha = $('vf-fecha').value, hora = $('vf-hora').value;
  if(!fecha){ toast('Elegí la fecha'); return; }
  const rUid = $('vf-responsable').value;
  const r = cuidadores.find(c=>c.uid===rUid);
  const datos = {
    personaId: pid, personaNombre: p.nombre,
    tipo: tipoVisitaSel, fecha, hora,
    direccion: p.direccion || '',
    responsableUid: rUid || '', responsableNombre: r ? r.nombre : (user?.displayName||''),
    nota: $('vf-nota').value.trim(),
    actualizado: serverTimestamp()
  };
  try{
    if(editandoVisitaId){
      await updateDoc(doc(db,'visitas',editandoVisitaId), datos);
      toast('✅ Visita actualizada');
    }else{
      datos.estado = 'programada';
      datos.creado = serverTimestamp();
      await addDoc(collection(db,'visitas'), datos);
      toast('✅ Visita agendada');
    }
    $('modal-visita-form').classList.add('oculto');
    editandoVisitaId = null;
    if(personaActual) abrirDetalle(personaActual.id);
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

function abrirVisita(id){
  const v = visitas.find(x=>x.id===id); if(!v) return;
  visitaActual = v;
  const t = TIPOS_VISITA[v.tipo]||{icono:'🏠',txt:v.tipo,frase:v.tipo};
  const e = ESTADOS_VISITA[v.estado]||ESTADOS_VISITA.programada;
  $('v-titulo').textContent = v.personaNombre;
  const chip = $('v-estado'); chip.className = 'estado-chip';
  chip.style.background = e.color; chip.textContent = e.txt;
  $('v-tipo').textContent = `${t.icono} ${t.txt}`;
  $('v-cuando').textContent = `${etiquetaDia(v.fecha)} · ${v.hora||''} hs`;
  const p = personas.find(x=>x.id===v.personaId);
  const dir = v.direccion || p?.direccion || '';
  const filaDir = $('v-dir').parentElement;
  if(dir){
    filaDir.classList.remove('oculto');
    $('v-dir').innerHTML = `${esc(dir)} <a href="${mapsLink(dir)}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">🗺 Maps</a>`;
  } else filaDir.classList.add('oculto');
  $('v-resp').textContent = v.responsableNombre || '—';
  $('v-nota').textContent = v.nota || '—';
  const ir = $('v-informe-row');
  if(v.informe){ ir.classList.remove('oculto'); $('v-informe-txt').textContent = v.informe; }
  else ir.classList.add('oculto');
  $('v-informe-box').classList.add('oculto');
  $('v-informe').value = v.informe || '';

  const pendiente = ['programada','confirmada','camino'].includes(v.estado);
  function waBtn(label, msg, cls){
    const link = p ? waLinkMsg(p, msg) : null;
    return link ? `<a class="btn-${cls}" href="${link}" target="_blank" rel="noopener">${label}</a>` : '';
  }
  let html = '';
  if(v.estado==='programada'){
    html += waBtn('💬 Avisar visita', msgAvisoVisita(v), 'wa');
    html += waBtn('💬 Pedir horario', msgPedirHorario(v), 'acc azul');
    html += `<button class="btn-acc verde" data-acc="confirmada">✅ Ya confirmó</button>`;
  }
  if(v.estado==='confirmada'){
    html += waBtn('🚗 Avisar que voy en camino', msgCamino(v), 'wa');
    html += `<button class="btn-acc naranja" data-acc="camino">🚗 Estoy en camino</button>`;
  }
  if(v.estado==='camino'){
    html += waBtn('🚗 Reenviar aviso', msgCamino(v), 'wa');
  }
  if(pendiente){
    html += `<button class="btn-acc verde" data-acc="realizar">✔️ Marcar realizada</button>`;
    html += `<button class="btn-acc azul" data-acc="editar">✏️ Editar</button>`;
    html += `<button class="btn-acc rojo" data-acc="cancelar">❌ Cancelar</button>`;
  }
  $('v-acciones').innerHTML = html;
  $('btn-eliminar-visita').classList.toggle('oculto', !(v.estado==='realizada'||v.estado==='cancelada'));

  $('v-acciones').querySelectorAll('[data-acc]').forEach(b=> b.onclick = async ()=>{
    const acc = b.dataset.acc;
    if(acc==='editar'){ abrirVisitaForm(visitaActual); return; }
    if(acc==='realizar'){ $('v-informe-box').classList.remove('oculto'); $('v-informe').focus(); return; }
    if(acc==='cancelar'){
      if(!confirm('¿Cancelar esta visita?')) return;
      await updateDoc(doc(db,'visitas',visitaActual.id), {estado:'cancelada'});
      toast('Visita cancelada'); $('modal-visita').classList.add('oculto'); visitaActual = null;
      return;
    }
    await updateDoc(doc(db,'visitas',visitaActual.id), {estado:acc});
    toast(acc==='confirmada'?'✅ Marcada como confirmada':'🚗 En camino');
    $('modal-visita').classList.add('oculto'); visitaActual = null;
  });

  $('v-acciones').querySelectorAll('a[href]').forEach(a=> a.addEventListener('click', ()=>{
    if(a.textContent.includes('camino') && visitaActual && visitaActual.estado==='confirmada'){
      updateDoc(doc(db,'visitas',visitaActual.id), {estado:'camino'});
    }
  }));

  $('modal-visita').classList.remove('oculto');
}
$('v-cerrar').onclick = ()=>{ $('modal-visita').classList.add('oculto'); visitaActual = null; };

$('btn-finalizar-visita').onclick = async ()=>{
  if(!visitaActual) return;
  const informe = $('v-informe').value.trim();
  try{
    await updateDoc(doc(db,'visitas',visitaActual.id), {estado:'realizada', informe});
    await addDoc(collection(db,'contactos'), {
      personaId: visitaActual.personaId,
      nombrePersona: visitaActual.personaNombre || '',
      tipo:'visita',
      nota: `Visita (${TIPOS_VISITA[visitaActual.tipo]?.txt||visitaActual.tipo})${informe?' — '+informe:''}`,
      por: visitaActual.responsableNombre || (user?.displayName||user?.email),
      fecha: serverTimestamp()
    });
    try{
      await updateDoc(doc(db,'personas',visitaActual.personaId), {
        ultimoContacto: serverTimestamp(),
        nContactos: increment(1)
      });
    }catch(e2){ console.error(e2); }
    const p = personas.find(x=>x.id===visitaActual.personaId);
    if(p && p.etapa==='primer_contacto'){
      await updateDoc(doc(db,'personas',visitaActual.personaId), {etapa:'visita'});
      await addDoc(collection(db,'historia'), {
        personaId: visitaActual.personaId, nombrePersona: visitaActual.personaNombre || '',
        texto: `🏠 Primera visita realizada`,
        fecha: serverTimestamp(), por: user?.displayName||user?.email, creado: serverTimestamp()
      });
    }
    toast('✅ Visita completada');
    $('modal-visita').classList.add('oculto');
    visitaActual = null;
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

$('btn-eliminar-visita').onclick = async ()=>{
  if(!visitaActual) return;
  if(!confirm('¿Eliminar esta visita definitivamente?')) return;
  try{
    await deleteDoc(doc(db,'visitas',visitaActual.id));
    toast('Eliminada'); $('modal-visita').classList.add('oculto'); visitaActual = null;
  }catch(e){ toast('Error'); console.error(e); }
};

/* ---------- REPORTE MENSUAL PDF ---------- */
$('btn-reporte').onclick = ()=>{
  const ahora = new Date();
  $('rep-mes').value = String(ahora.getMonth()+1);
  $('rep-anio').innerHTML = '';
  const anioActual = ahora.getFullYear();
  for(let a=anioActual; a>=anioActual-2; a--){
    $('rep-anio').innerHTML += `<option value="${a}">${a}</option>`;
  }
  calcResumenRep();
  $('modal-reporte').classList.remove('oculto');
};
$('rep-cerrar').onclick = ()=> $('modal-reporte').classList.add('oculto');
$('rep-mes').onchange = calcResumenRep;
$('rep-anio').onchange = calcResumenRep;

async function contactosDeMes(mes, anio){
  const key = anio+'-'+mes;
  if(repCache.key===key) return repCache.contactos;
  const inicio = new Date(anio, mes-1, 1);
  const fin = new Date(anio, mes, 1);
  const snap = await getDocs(query(collection(db,'contactos'), where('fecha','>=',inicio), where('fecha','<',fin)));
  const lista = snap.docs.map(d=>({id:d.id, ...d.data()}))
    .sort((a,b)=>(b.fecha?.toMillis||0)-(a.fecha?.toMillis||0));
  repCache = {key, contactos: lista};
  return lista;
}

function datosMesBase(contactosMes){
  const mes = +$('rep-mes').value, anio = +$('rep-anio').value;
  const visitasMes = visitas.filter(v=>(v.fecha||'').startsWith(anio+'-'+String(mes).padStart(2,'0')));
  const contactadas = new Set(contactosMes.map(c=>c.personaId));
  const visitasRealizadas = visitasMes.filter(v=>v.estado==='realizada');
  const nunca = personas.filter(p=>estado(p).dias===99999);
  const atencion = personas.filter(p=>['alejado','apartado','censura'].includes(condMiembro(p)));
  const cumples = personas.filter(p=>p.cumple && +p.cumple.slice(5,7)===mes)
    .sort((a,b)=>+a.cumple.slice(8)-+b.cumple.slice(8));
  const reintegrados = personas.filter(p=>p.etapa==='reintegrado');
  const volviendo = personas.filter(p=>['dialogo','volviendo'].includes(p.etapa));
  return {mes, anio, contactosMes, visitasMes, contactadas, visitasRealizadas, nunca, atencion, cumples, reintegrados, volviendo};
}

async function calcResumenRep(){
  if(!$('rep-anio').value) return;
  $('rep-resumen').innerHTML = '<div><span>⏳ Calculando…</span><b></b></div>';
  try{
    const mes = +$('rep-mes').value, anio = +$('rep-anio').value;
    const contactosMes = await contactosDeMes(mes, anio);
    const d = datosMesBase(contactosMes);
    $('rep-resumen').innerHTML = `
      <div><span>Personas en seguimiento</span><b>${personas.length}</b></div>
      <div><span>Contactos registrados en el mes</span><b>${d.contactosMes.length}</b></div>
      <div><span>Personas contactadas</span><b>${d.contactadas.size}</b></div>
      <div><span>Visitas realizadas</span><b>${d.visitasRealizadas.length}</b></div>
      <div><span>🌱 Volviendo</span><b>${d.volviendo.length}</b></div>
      <div><span>✅ Reintegrados</span><b style="color:#22c55e">${d.reintegrados.length}</b></div>
      <div><span>Nunca contactadas</span><b style="color:#ef4444">${d.nunca.length}</b></div>
      <div><span>Bajo disciplina / atención</span><b style="color:#ef4444">${d.atencion.length}</b></div>
      <div><span>Cumpleaños del mes</span><b>${d.cumples.length}</b></div>`;
  }catch(e){
    console.error(e);
    $('rep-resumen').innerHTML = '<div><span>Error al calcular</span><b></b></div>';
  }
}

$('btn-generar-pdf').onclick = async ()=>{
  try{
    toast('⏳ Preparando informe…');
    const mes = +$('rep-mes').value, anio = +$('rep-anio').value;
    const contactosMes = await contactosDeMes(mes, anio);
    const d = datosMesBase(contactosMes);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const mesTxt = MESES[d.mes-1].charAt(0).toUpperCase()+MESES[d.mes-1].slice(1);

    doc.setFillColor(0,128,105);
    doc.rect(0,0,210,26,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(15);
    doc.text('Reporte mensual de Acompanamiento', 14, 11);
    doc.setFontSize(10);
    doc.text(mesTxt+' '+d.anio+' - '+NOMBRE_ORG, 14, 19);

    doc.setTextColor(110,110,110);
    doc.setFontSize(8);
    doc.text('Generado el '+new Date().toLocaleDateString('es',{day:'2-digit',month:'2-digit',year:'numeric'})+' por '+(user?.displayName||user?.email||''), 14, 32);

    doc.autoTable({
      startY: 37,
      head:[['Personas','Contactos del mes','Contactadas','Visitas realizadas','Reintegrados','Disciplina']],
      body:[[
        personas.length, d.contactosMes.length, d.contactadas.size,
        d.visitasRealizadas.length, d.reintegrados.length, d.atencion.length
      ]],
      theme:'grid', headStyles:{fillColor:[0,128,105],fontSize:8}, styles:{fontSize:10,halign:'center'}
    });

    let y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11); doc.setTextColor(40,40,40);
    doc.text('Contactos del mes', 14, y);
    doc.autoTable({
      startY: y+3,
      head:[['Fecha','Persona','Tipo','Realizado por','Nota']],
      body: d.contactosMes.length ? d.contactosMes.map(c=>{
        const f = c.fecha?.toDate ? c.fecha.toDate() : null;
        const tipo = {llamada:'Llamada', mensaje:'Mensaje', visita:'Visita', visita_iglesia:'Volvió a iglesia'}[c.tipo]||c.tipo;
        return [f?f.toLocaleDateString('es',{day:'2-digit',month:'2-digit'}):'—', c.nombrePersona||'', tipo, c.por||'', c.nota||''];
      }) : [['—','Sin registros este mes','','','']],
      theme:'striped', headStyles:{fillColor:[0,128,105],fontSize:8}, styles:{fontSize:8},
      columnStyles:{4:{cellWidth:55}}
    });

    y = doc.lastAutoTable.finalY + 10;
    if(y > 250){ doc.addPage(); y = 15; }
    doc.setFontSize(11); doc.setTextColor(40,40,40);
    doc.text('Visitas del mes', 14, y);
    doc.autoTable({
      startY: y+3,
      head:[['Fecha','Persona','Motivo','Responsable','Estado','Informe']],
      body: d.visitasMes.length ? d.visitasMes.map(v=>{
        const [a,m,dd] = (v.fecha||'').split('-');
        const motivo = TIPOS_VISITA[v.tipo]?.txt||v.tipo;
        const est = ESTADOS_VISITA[v.estado]?.txt||v.estado;
        return [`${dd}/${m}`, v.personaNombre||'', motivo, v.responsableNombre||'', est, v.informe||v.nota||''];
      }) : [['—','Sin visitas este mes','','','','']],
      theme:'striped', headStyles:{fillColor:[0,128,105],fontSize:8}, styles:{fontSize:8},
      columnStyles:{5:{cellWidth:45}}
    });

    y = doc.lastAutoTable.finalY + 10;
    if(y > 250){ doc.addPage(); y = 15; }
    doc.setFontSize(11); doc.setTextColor(40,40,40);
    doc.text('Situación actual del seguimiento', 14, y);
    const ordenC = {rojo:0, amarillo:1, verde:2};
    const etapaOrden = {sin_contacto:0, primer_contacto:1, visita:2, dialogo:3, volviendo:4, no_desea:5, reintegrado:6};
    const situacion = [...personas].sort((a,b)=>ordenC[estado(a).color]-ordenC[estado(b).color] || (etapaOrden[a.etapa||'sin_contacto']-etapaOrden[b.etapa||'sin_contacto']));
    doc.autoTable({
      startY: y+3,
      head:[['Nombre','Último contacto','Semáforo','Etapa','Cuidador','Condición']],
      body: situacion.length ? situacion.map(p=>{
        const e = estado(p);
        const ult = e.dias===99999 ? 'Nunca' : e.txt.replace('Contactado ','');
        const ep = ETAPAS[p.etapa||'sin_contacto'];
        return [p.nombre||'', ult, {verde:'Verde (al día)',amarillo:'Amarillo (+7 días)',rojo:'Rojo (+15 días)'}[e.color],
                ep?ep.txt:'—',
                p.cuidadorNombre||'—',
                {activo:'Activo',frecuente:'Frecuente',visitante:'Visitante',alejado:'Alejado',apartado:'Apartado',censura:'Censura',desaparecido:'Desaparecido','':'—'}[condMiembro(p)]];
      }) : [['—','Sin personas cargadas','','','','']],
      theme:'striped', headStyles:{fillColor:[0,128,105],fontSize:8}, styles:{fontSize:8}
    });

    if(d.cumples.length){
      y = doc.lastAutoTable.finalY + 10;
      if(y > 250){ doc.addPage(); y = 15; }
      doc.setFontSize(11); doc.setTextColor(40,40,40);
      doc.text('Cumpleaños de '+mesTxt, 14, y);
      doc.autoTable({
        startY: y+3,
        head:[['Día','Nombre']],
        body: d.cumples.map(p=>[+p.cumple.slice(8), p.nombre||'']),
        theme:'striped', headStyles:{fillColor:[0,128,105],fontSize:8}, styles:{fontSize:8},
        columnStyles:{0:{cellWidth:20}}
      });
    }

    if(d.reintegrados.length){
      y = doc.lastAutoTable.finalY + 10;
      if(y > 250){ doc.addPage(); y = 15; }
      doc.setFontSize(11); doc.setTextColor(40,40,40);
      doc.text('🎉 Reintegrados este período', 14, y);
      doc.autoTable({
        startY: y+3,
        head:[['Nombre','Responsable']],
        body: d.reintegrados.map(p=>[p.nombre||'', p.cuidadorNombre||'—']),
        theme:'striped', headStyles:{fillColor:[34,197,94],fontSize:8}, styles:{fontSize:8}
      });
    }

    const pages = doc.internal.getNumberOfPages();
    for(let i=1;i<=pages;i++){
      doc.setPage(i);
      doc.setFontSize(7); doc.setTextColor(150);
      doc.text('"Nadie solo, todos cuidados" - '+NOMBRE_ORG+' - Pagina '+i+' de '+pages, 105, 290, {align:'center'});
    }

    doc.save('reporte-acompanamiento-'+MESES[d.mes-1]+'-'+d.anio+'.pdf');
    toast('✅ PDF descargado');
  }catch(e){
    toast('Error al generar el PDF');
    console.error(e);
  }
};

/* ---------- RECALCULAR SEMÁFOROS (una sola vez) ---------- */
$('btn-recalcular').onclick = async ()=>{
  if(!confirm('Esto lee el historial completo UNA sola vez y guarda en cada ficha su último contacto y cantidad de contactos.\n\nDespués se actualiza solo. ¿Continuar?')) return;
  try{
    toast('⏳ Leyendo historial (puede tardar)…');
    const snap = await getDocs(collection(db,'contactos'));
    const mapa = new Map();
    snap.forEach(d=>{
      const c = d.data();
      const ms = c.fecha?.toMillis ? c.fecha.toMillis() : 0;
      if(!ms || !c.personaId) return;
      const e = mapa.get(c.personaId) || {ms:0, n:0};
      if(ms>e.ms) e.ms=ms;
      e.n++;
      mapa.set(c.personaId, e);
    });
    toast('⏳ Actualizando fichas…');
    let batch = writeBatch(db), count = 0;
    for(const p of personas){
      const e = mapa.get(p.id);
      batch.update(doc(db,'personas',p.id), {
        ultimoContacto: e ? Timestamp.fromMillis(e.ms) : null,
        nContactos: e ? e.n : 0
      });
      count++;
      if(count===400){ await batch.commit(); batch = writeBatch(db); count = 0; }
    }
    if(count>0) await batch.commit();
    toast('✅ Semáforos recalculados');
  }catch(e){
    toast('Error al recalcular');
    console.error(e);
  }
};

/* ---------- BIBLIOTECA DE RESCATE ---------- */
$('btn-recursos').onclick = ()=>{ renderRecursos(''); $('modal-recursos').classList.remove('oculto'); };
$('rec-cerrar').onclick = ()=> $('modal-recursos').classList.add('oculto');
$('rec-buscar').oninput = e=> renderRecursos(e.target.value);

function renderRecursos(q){
  q = (q||'').toLowerCase().trim();
  let html = '';
  for(const [k,m] of Object.entries(MOTIVOS)){
    if(q){
      const hit = m.txt.toLowerCase().includes(q) || m.consejo.toLowerCase().includes(q) ||
        m.mensaje.toLowerCase().includes(q) || m.enfoque.toLowerCase().includes(q) ||
        m.versiculos.some(v=>v.t.toLowerCase().includes(q) || v.r.toLowerCase().includes(q));
      if(!hit) continue;
    }
    html += `<div class="rec-cat">
      <div class="rec-cat-head" data-cat="${k}">
        <span><span class="ico">${m.txt.split(' ')[0]}</span> <b>${esc(m.txt)}</b></span>
        <span>▾</span>
      </div>
      <div class="rec-cat-body" id="cat-${k}">
        ${m.versiculos.map(v=>`<div class="rec-verso"><b>${esc(v.r)}</b>${esc(v.t)}</div>`).join('')}
        <div class="rec-consejo"><b>💡 Consejo pastoral:</b> ${esc(m.consejo)}</div>
        <div class="rec-consejo"><b>🎯 Enfoque:</b> ${esc(m.enfoque)}</div>
        <div class="rec-msg">${esc(m.mensaje.replaceAll('{nombre}','[nombre]'))}</div>
      </div>
    </div>`;
  }
  $('rec-lista').innerHTML = html || '<p style="text-align:center;color:var(--txt2);margin-top:20px">Sin resultados.</p>';
  $('rec-lista').querySelectorAll('.rec-cat-head').forEach(h=> h.onclick = ()=>{
    const b = $('cat-'+h.dataset.cat); b.classList.toggle('open');
  });
}

/* ---------- ESTUDIOS BÍBLICOS ---------- */
$('btn-estudios').onclick = ()=>{ renderEstudiosGrid(); $('modal-estudios').classList.remove('oculto'); };
$('est-cerrar').onclick = ()=> $('modal-estudios').classList.add('oculto');

function renderEstudiosGrid(){
  $('est-viewer').classList.remove('show');
  $('est-viewer').innerHTML = '';
  $('est-grid').innerHTML = ESTUDIOS.map(e=>`
    <div class="est-card" data-id="${e.id}">
      <img src="${e.img}" alt="${esc(e.titulo)}" loading="lazy">
      <div class="est-card-body">
        <div class="est-card-tag">Estudio ${e.id}</div>
        <div class="est-card-title">${esc(e.titulo)}</div>
      </div>
    </div>`).join('');
  $('est-grid').querySelectorAll('.est-card').forEach(c=> c.onclick = ()=> abrirEstudio(c.dataset.id));
}

function abrirEstudio(id){
  const e = ESTUDIOS.find(x=>x.id===id); if(!e) return;
  $('est-grid').style.display = 'none';
  const v = $('est-viewer');
  v.classList.add('show');
  v.innerHTML = `
    <img src="${e.img}" alt="${esc(e.titulo)}">
    <div class="est-info">
      <b>${esc(e.titulo)}</b>
      <p>${esc(e.sub)} — ${esc(e.ref)}</p>
      <p style="margin-top:6px;color:var(--txt2);font-style:normal;font-size:.82rem">${esc(e.desc)}</p>
    </div>
    <button class="btn btn-secondary" id="est-volver" style="margin-top:10px">← Volver a la lista</button>
  `;
  document.getElementById('est-volver').onclick = ()=>{
    v.classList.remove('show');
    v.innerHTML = '';
    $('est-grid').style.display = 'grid';
  };
}

/* ---------- MÓDULO DISCIPLINA ---------- */
const MOTIVOS_DISC = [
  'Negación de la fe o enseñanza de doctrinas contrarias',
  'Violación de la ley de Dios: idolatría, homicidio, robo, profanidad, juegos de azar, sábado, falsedad habitual',
  'Violación de «No cometerás adulterio» / abuso sexual',
  'Fornicación: promiscuidad, incesto u otras prácticas',
  'Material pornográfico: producción, uso o distribución',
  'Nuevo casamiento sin derecho bíblico',
  'Violencia física, incluida la violencia familiar',
  'Fraude o mentir conscientemente en los negocios',
  'Conducta desordenada que traiga oprobio a la causa',
  'Adhesión a movimiento divisionista o desleal',
  'Negativa persistente a las autoridades de la iglesia',
  'Uso, fabricación o venta de bebidas alcohólicas',
  'Uso, manufactura o venta de tabaco',
  'Uso o elaboración de drogas ilícitas',
  'Otro (especificar en las notas)'
];
const PASOS_PREVIOS = [
  'Conversación privada con la persona (Mt 18:15)',
  'Con uno o dos testigos (Mt 18:16)',
  'Presentado a la iglesia (Mt 18:17)',
  'Junta directiva revisó el caso y solo RECOMENDÓ (p. 82)',
  'Notificación escrita al miembro, al menos 2 semanas antes (p. 83)',
  'Oportunidad de ser oído, con pruebas y testigos (p. 83)',
  'Consulta con el pastor / la asociación (p. 81)'
];

$('btn-disc').onclick = ()=>{
  $('disc-form').classList.add('oculto');
  $('disc-guia').classList.add('oculto');
  $('modal-disc').classList.remove('oculto');
  renderDisc();
};
$('disc-cerrar').onclick = ()=> $('modal-disc').classList.add('oculto');
$('btn-ver-guia').onclick = ()=> $('disc-guia').classList.toggle('oculto');

$('btn-nuevo-caso').onclick = ()=>{
  $('dc-persona').innerHTML = personas.map(p=>`<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  $('dc-motivo').innerHTML = MOTIVOS_DISC.map(m=>`<option>${esc(m)}</option>`).join('');
  $('dc-pasos').innerHTML = PASOS_PREVIOS.map((p,i)=>`<label class="paso-chk"><input type="checkbox" data-i="${i}"> ${esc(p)}</label>`).join('');
  $('dc-fecha').value = hoyStr();
  $('dc-dur').value = 6;
  $('dc-nota').value = '';
  $('dc-tipo').value = 'censura';
  $('dc-dur-box').style.display = 'block';
  $('disc-guia').classList.add('oculto');
  $('disc-form').classList.remove('oculto');
};

$('dc-tipo').onchange = ()=>{
  $('dc-dur-box').style.display = $('dc-tipo').value==='censura' ? 'block' : 'none';
};

$('dc-guardar').onclick = async ()=>{
  const pid = $('dc-persona').value;
  const p = personas.find(x=>x.id===pid);
  if(!p){ toast('Elegí una persona'); return; }
  const tipo = $('dc-tipo').value;
  const fecha = $('dc-fecha').value || hoyStr();
  const dur = tipo==='censura' ? Math.min(12, Math.max(1, +$('dc-dur').value || 6)) : null;
  const pasos = {};
  $('dc-pasos').querySelectorAll('input[type="checkbox"]').forEach(cb=> pasos['p'+cb.dataset.i] = cb.checked);
  let fechaFin = null;
  if(tipo==='censura'){
    const f = new Date(fecha+'T12:00:00'); f.setMonth(f.getMonth()+dur);
    fechaFin = Timestamp.fromMillis(f.getTime());
  }
  try{
    await addDoc(collection(db,'disciplina'), {
      personaId: pid, personaNombre: p.nombre,
      tipo, motivo: $('dc-motivo').value,
      fecha: Timestamp.fromMillis(new Date(fecha+'T12:00:00').getTime()),
      duracion: dur, fechaFin,
      pasos, nota: $('dc-nota').value.trim(),
      estado: 'activa',
      por: user.displayName || user.email,
      creado: serverTimestamp()
    });
    const nuevoEstado = tipo==='censura' ? 'censura' : tipo==='remocion' ? 'apartado' : 'desaparecido';
    await updateDoc(doc(db,'personas',pid), {estadoMiembro: nuevoEstado, actualizado: serverTimestamp()});
    await addDoc(collection(db,'historia'), {
      personaId: pid, nombrePersona: p.nombre,
      texto: tipo==='censura'
        ? `Colocado bajo censura por ${dur} ${dur===1?'mes':'meses'} por voto de la iglesia. Razón: ${$('dc-motivo').value}`
        : tipo==='remocion'
        ? `Removido de la feligresía por voto de la iglesia. Razón: ${$('dc-motivo').value}`
        : `Designado «desaparecido» (paradero desconocido) por voto de la iglesia`,
      fecha: Timestamp.fromMillis(new Date(fecha+'T12:00:00').getTime()),
      por: user.displayName || user.email,
      creado: serverTimestamp()
    });
    $('disc-form').classList.add('oculto');
    renderDisc();
    toast('⚖️ Caso registrado (también en Historia de vida)');
  }catch(e){ toast('Error al guardar'); console.error(e); }
};

function renderDisc(){
  const activos = casosDisc.filter(c=>c.estado!=='resuelta')
    .sort((a,b)=>({censura:0,remocion:1,desaparicion:2}[a.tipo]??9)-({censura:0,remocion:1,desaparicion:2}[b.tipo]??9)
      || (b.fecha?.toMillis||0)-(a.fecha?.toMillis||0));
  if(!activos.length){
    $('disc-lista').innerHTML = '<p style="text-align:center;color:var(--txt2);margin:14px 0">No hay casos activos. 🙏</p>';
    return;
  }
  $('disc-lista').innerHTML = activos.map(c=>{
    const t = {censura:'⚖️ Censura', remocion:'🔴 Remoción', desaparicion:'🔇 Desaparición'}[c.tipo] || c.tipo;
    const p = personas.find(x=>x.id===c.personaId);
    let vence = '';
    if(c.tipo==='censura' && c.fechaFin?.toDate){
      const f = c.fechaFin.toDate();
      const dias = Math.ceil((f - new Date())/86400000);
      vence = `<div class="cs-vence ${dias<=30?'atras':''}">⏰ Revisión el ${f.toLocaleDateString('es',{day:'2-digit',month:'short',year:'numeric'})} · ${dias<=0?'revisión pendiente':'faltan '+dias+' días'}</div>`;
    }
    let waBtn = '';
    if(p){
      const nombre = p.nombre||'';
      const msg = c.tipo==='censura'
        ? `Querido ${nombre} 🙏 Con pesar, la iglesia decidió colocarlo bajo censura. Queremos asegurarle nuestro permanente interés espiritual y nuestra preocupación por su persona. La iglesia espera su restauración plena 🙏`
        : c.tipo==='remocion'
        ? `Querido ${nombre} 🙏 Le escribimos con pesar por la decisión tomada. Queremos asegurarle que la iglesia siempre esperará su regreso, y que un día estemos juntos en la eterna feligresía del reino de Dios. ¿Podemos visitarlo? 🙏`
        : `Querido ${nombre} 🙏 Hace tiempo que no tenemos noticias suyas. ¿Cómo está? Nos gustaría saber de usted y ayudarlo en lo que necesitemos 🙏`;
      const link = waLinkMsg(p, msg);
      if(link) waBtn = `<a class="cs-wa" href="${link}" target="_blank" rel="noopener">💬 Mensaje pastoral</a>`;
    }
    return `<div class="caso">
      <div class="cs-nombre">${t} · ${esc(c.personaNombre||'')}</div>
      <div class="cs-meta">${esc(c.motivo||'')}</div>
      <div class="cs-meta">${c.fecha?.toDate?c.fecha.toDate().toLocaleDateString('es',{day:'2-digit',month:'short',year:'numeric'}):''} · registrado por ${esc(c.por||'—')}</div>
      ${vence}
      <div class="cs-btns">${waBtn}<button class="cs-nota" data-hist="${c.personaId}">📖 Ficha</button><button class="cs-nota" data-restaurar="${c.id}">✔️ Restaurar</button></div>
    </div>`;
  }).join('');

  $('disc-lista').querySelectorAll('[data-hist]').forEach(b=> b.onclick = ()=>{
    $('modal-disc').classList.add('oculto');
    abrirDetalle(b.dataset.hist);
  });
  $('disc-lista').querySelectorAll('[data-restaurar]').forEach(b=> b.onclick = async ()=>{
    const c = casosDisc.find(x=>x.id===b.dataset.restaurar);
    if(!c) return;
    const esCensura = c.tipo==='censura';
    if(!confirm(esCensura
      ? `¿Marcar finalizada la censura de ${c.personaNombre}?\n\nManual p. 81: si la conducta fue satisfactoria, se lo considera en plena comunión sin nuevo voto, y se le notifica que la censura finalizó.`
      : `¿Registrar la readmisión de ${c.personaNombre}?\n\nManual p. 85-86: normalmente precedida por el rebautismo, con pruebas de arrepentimiento, y consultando a la asociación.`)) return;
    try{
      await updateDoc(doc(db,'disciplina',c.id), {estado:'resuelta'});
      await updateDoc(doc(db,'personas',c.personaId), {estadoMiembro:'activo', etapa:'reintegrado', actualizado: serverTimestamp()});
      await addDoc(collection(db,'historia'), {
        personaId: c.personaId, nombrePersona: c.personaNombre,
        texto: esCensura ? 'Finalizada la censura; restaurado a plena comunión (Manual, p. 81)' : 'Readmitido en la membresía, normalmente tras rebautismo (Manual, p. 85-86)',
        fecha: serverTimestamp(), por: user.displayName || user.email, creado: serverTimestamp()
      });
      toast('✅ Restaurado a plena comunión');
      renderDisc();
    }catch(e){ toast('Error'); console.error(e); }
  });
};

const hoy0 = new Date(); calY = hoy0.getFullYear(); calM = hoy0.getMonth();

let toastTimer;
function toast(m){
  const t = $('toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

if('serviceWorker' in navigator){
  try{ navigator.serviceWorker.register('./sw.js'); }catch(e){}
}
