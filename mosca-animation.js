let timeouts = [];
let minutosLoop = 0;

/* ========================= */
/* LIMPIAR TIMERS            */
/* ========================= */

function clearAllTimers(){
timeouts.forEach(t=>clearTimeout(t));
timeouts = [];
}

/* ========================= */
/* ANIMACIÓN                 */
/* ========================= */

function startMosca(){

clearAllTimers();
activo = true;
calcularCierre();

/* RESET */

texto.style.opacity = 0;
texto.style.filter = "blur(20px)";

logo.style.opacity = 0;
logo.style.filter = "blur(20px)";

logoEE.style.opacity = 0;

const mask = logoEE.querySelector(".circle-mask");
mask.style.clipPath = "circle(0% at 50% 50%)";
mask.style.background = "white";

/* CONTENEDOR */

mosca.style.opacity = 1;
mosca.style.filter = "blur(0)";

/* ========================= */
/* SECUENCIA ORDENADA        */
/* ========================= */

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

/* LOGO + TICKER */

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
mask.style.clipPath = "circle(60% at 50% 50%)";

setTimeout(()=>{
mask.style.background = "transparent";
},400);

}, t+200));

timeouts.push(setTimeout(()=>{
mask.style.background = "white";
mask.style.clipPath = "circle(0% at 50% 50%)";
}, t+10000));

timeouts.push(setTimeout(()=>{
logoEE.style.opacity = 0;
}, t+10500));

t += 10000;

/* ========================= */
/* LOOP CON PAUSA            */
/* ========================= */

timeouts.push(setTimeout(()=>{
if(activo){

let delay = minutosLoop * 60 * 1000;

setTimeout(()=>{
if(activo) startMosca();
}, delay);

}
}, t));

/* CONTADOR */

if(interval) clearInterval(interval);
interval = setInterval(updateTexto,1000);
updateTexto();

}

/* ========================= */
/* WEBSOCKET EXTRA           */
/* ========================= */

channel.subscribe("control",(msg)=>{

const d = msg.data;

if(d.action==="on") startMosca();
if(d.action==="off") stopMosca();

if(d.action==="updateHora"){
horaCierre = d.hora;
calcularCierre();
updateTexto();
}

/* 🔥 NUEVO */
if(d.action==="updateLoop"){
minutosLoop = parseInt(d.minutos || 0);
}

  const loopMin = document.getElementById("loopMin");

function enviarLoop(){
channel.publish("control",{
action:"updateLoop",
minutos: loopMin.value
});
}

loopMin.addEventListener("change", enviarLoop);

window.addEventListener("load", enviarLoop);

});
