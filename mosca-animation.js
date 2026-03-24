const mosca = document.getElementById("mosca");
const texto = document.getElementById("texto");
const logo = document.getElementById("logo");
const logoEE = document.getElementById("logoEE");

let activo = false;
let horaCierre = "16:00";
let interval = null;
let cierreTsGlobal = null;

/* ========================= */
/* CALCULAR CIERRE           */
/* ========================= */

function calcularCierre(){

const now = new Date();

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

if(diffMinutes < -1){
diffMinutes += 1440;
}

cierreTsGlobal = nowTs + (diffMinutes * 60 * 1000);

}

/* ========================= */
/* FORMATO TIEMPO            */
/* ========================= */

function formatTime(sec){

sec = Math.max(0, sec);

let h = Math.floor(sec/3600);
let m = Math.floor((sec%3600)/60);
let s = sec%60;

return String(h).padStart(2,"0")+":"+
       String(m).padStart(2,"0")+":"+
       String(s).padStart(2,"0");

}

/* ========================= */
/* UPDATE TEXTO              */
/* ========================= */

function updateTexto(){

if(!cierreTsGlobal) return;

const nowTs = Date.now();
let diff = Math.floor((cierreTsGlobal - nowTs)/1000);

if(diff > 0){

texto.innerHTML = `
CIERRE DE VOTACIONES EN:<br>
${formatTime(diff)}
`;

}

else if(diff <= 0 && diff > -60){

texto.innerHTML = `
VOTACIONES CERRADAS
`;

}

else{

texto.innerHTML = `
ANÁLISIS DE RESULTADOS<br>
ELECTORALES 2026
`;

}

}

/* ========================= */
/* ANIMACIÓN                 */
/* ========================= */

function startMosca(){

activo = true;
calcularCierre();

/* RESET */

texto.style.opacity=0;
logo.style.opacity=0;
logoEE.style.opacity=0;

const mask = logoEE.querySelector(".circle-mask");
mask.style.clipPath="circle(0%)";
mask.style.background="white";

/* CONTENEDOR */

mosca.style.opacity=1;

/* TEXTO */

setTimeout(()=>{
texto.style.opacity=1;
},200);

setTimeout(()=>{
texto.style.opacity=0;
},20000);

/* LOGO */

setTimeout(()=>{
logo.style.opacity=1;
},21500);

setTimeout(()=>{
logo.style.opacity=0;
},37500);

/* LOGO EE */

setTimeout(()=>{
logoEE.style.opacity=1;
mask.style.clipPath="circle(60%)";

setTimeout(()=>{
mask.style.background="transparent";
},400);

},39000);

setTimeout(()=>{
mask.style.background="white";
mask.style.clipPath="circle(0%)";
},55000);

setTimeout(()=>{
logoEE.style.opacity=0;
},56000);

/* LOOP */

setTimeout(()=>{
if(activo) startMosca();
},65000);

/* CONTADOR */

if(interval) clearInterval(interval);
interval = setInterval(updateTexto,1000);
updateTexto();

}

/* STOP */

function stopMosca(){

activo = false;

if(interval) clearInterval(interval);

mosca.style.opacity=0;

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

if(d.action==="on") startMosca();
if(d.action==="off") stopMosca();

if(d.action==="updateHora"){
horaCierre = d.hora;
calcularCierre();
updateTexto();
}

});
