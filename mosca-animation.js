const mosca = document.getElementById("mosca");
const texto = document.getElementById("texto");
const logo = document.getElementById("logo");
const logoEE = document.getElementById("logoEE");

let activo = false;
let running = false; // 🔥 LOCK
let horaCierre = "16:00";
let interval = null;
let cierreTsGlobal = null;

let timeouts = [];
let minutosLoop = 0;

/* ========================= */
/* RESET TOTAL               */
/* ========================= */

function resetMosca(){

running = false;

timeouts.forEach(t=>clearTimeout(t));
timeouts = [];

if(interval){
clearInterval(interval);
interval = null;
}

texto.style.opacity = 0;
texto.style.filter = "blur(20px)";

logo.style.opacity = 0;
logo.style.filter = "blur(20px)";

logoEE.style.opacity = 0;

const mask = logoEE.querySelector(".circle-mask");
mask.style.clipPath = "circle(0% at 50% 50%)";
mask.style.background = "white";

mosca.style.opacity = 0;
mosca.style.filter = "blur(20px)";

}

/* ========================= */
/* CIERRE                    */
/* ========================= */

function calcularCierre(){

const now = new Date();

/* hora actual en Colombia */
const colombia = new Intl.DateTimeFormat('en-US', {
timeZone: 'America/Bogota',
hour: '2-digit',
minute: '2-digit',
hour12: false
}).format(now);

const [currentH, currentM] = colombia.split(":").map(Number);
const [h, m] = horaCierre.split(":").map(Number);

const nowTs = Date.now();

const currentMinutes = currentH * 60 + currentM;
const cierreMinutes = h * 60 + m;

let diffMinutes = cierreMinutes - currentMinutes;

/* 🔥 CLAVE: SI YA PASÓ, NO LO MANDES A MAÑANA */
if(diffMinutes < 0){
cierreTsGlobal = nowTs - 1000; // fuerza estado "cerrado"
return;
}

/* cálculo normal */
cierreTsGlobal = nowTs + (diffMinutes * 60 * 1000);

}

function formatTime(sec){

sec = Math.max(0, sec);

let h = Math.floor(sec/3600);
let m = Math.floor((sec%3600)/60);
let s = sec%60;

return String(h).padStart(2,"0")+":"+
       String(m).padStart(2,"0")+":"+
       String(s).padStart(2,"0");

}

function updateTexto(){

if(!cierreTsGlobal) return;

const nowTs = Date.now();
let diff = Math.floor((cierreTsGlobal - nowTs)/1000);

if(diff > 0){
texto.innerHTML = `CIERRE DE VOTACIONES EN:<br>${formatTime(diff)}`;
}
else if(diff <= 0 && diff > -60){
texto.innerHTML = `VOTACIONES CERRADAS`;
}
else{
texto.innerHTML = `ANÁLISIS DE RESULTADOS<br>ELECTORALES 2026`;
}

}

/* ========================= */
/* ANIMACIÓN ÚNICA           */
/* ========================= */

function startMosca(){

if(running) return; // 🔥 evita duplicados

resetMosca();

activo = true;
running = true;

calcularCierre();

mosca.style.opacity = 1;
mosca.style.filter = "blur(0)";

let t = 0;

/* TEXTO */

timeouts.push(setTimeout(()=>{
texto.style.opacity = 1;
texto.style.filter = "blur(0)";
}, t+200));

timeouts.push(setTimeout(()=>{
texto.style.opacity = 0;
texto.style.filter = "blur(20px)";
}, t+20000));

t += 20000;

/* LOGO */

timeouts.push(setTimeout(()=>{
logo.style.opacity = 1;
logo.style.filter = "blur(0)";
}, t+200));

timeouts.push(setTimeout(()=>{
logo.style.opacity = 0;
logo.style.filter = "blur(20px)";
}, t+20000));

t += 20000;

/* LOGO EE */

timeouts.push(setTimeout(()=>{
logoEE.style.opacity = 1;

const mask = logoEE.querySelector(".circle-mask");
mask.style.clipPath = "circle(60% at 50% 50%)";

setTimeout(()=>{
mask.style.background = "transparent";
},400);

}, t+200));

timeouts.push(setTimeout(()=>{
const mask = logoEE.querySelector(".circle-mask");
mask.style.background = "white";
mask.style.clipPath = "circle(0% at 50% 50%)";
}, t+10000));

timeouts.push(setTimeout(()=>{
logoEE.style.opacity = 0;
}, t+10500));

t += 10000;

/* FIN CICLO */

timeouts.push(setTimeout(()=>{

running = false;

if(!activo) return;

let delay = minutosLoop * 60 * 1000;

timeouts.push(setTimeout(()=>{
if(activo) startMosca();
}, delay));

}, t));

/* CONTADOR */

interval = setInterval(updateTexto,1000);
updateTexto();

}

function stopMosca(){
activo = false;
resetMosca();
}

/* ========================= */
/* ABLY                      */
/* ========================= */

const ably = new Ably.Realtime({
key:"bOKecA.F01Gsw:f6ccqlfGnZrnTbs9ZqERdlbn7AK9PwwCtsplaep_DL4"
});

const channel = ably.channels.get("vmix-mosca");

channel.subscribe("control",(msg)=>{

const d = msg.data;

if(d.action==="on"){
stopMosca();
setTimeout(()=>startMosca(),80);
}

if(d.action==="off"){
stopMosca();
}

if(d.action==="updateHora"){
horaCierre = d.hora;
calcularCierre();
updateTexto();
}

if(d.action==="updateLoop"){
minutosLoop = parseInt(d.minutos || 0);
}

});
