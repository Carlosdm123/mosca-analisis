let timeouts = [];
let interval = null;
let minutosLoop = 0;

/* ========================= */
/* LIMPIEZA TOTAL            */
/* ========================= */

function resetMosca(){

timeouts.forEach(t=>clearTimeout(t));
timeouts = [];

if(interval){
clearInterval(interval);
interval = null;
}

/* reset visual TOTAL */

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
/* START LIMPIO              */
/* ========================= */

function startMosca(){

resetMosca(); // 🔥 CRÍTICO

activo = true;
calcularCierre();

mosca.style.opacity = 1;
mosca.style.filter = "blur(0)";

let t = 0;

/* ========================= */
/* TEXTO                     */
/* ========================= */

timeouts.push(setTimeout(()=>{
texto.style.opacity = 1;
texto.style.filter = "blur(0)";
}, t+200));

timeouts.push(setTimeout(()=>{
texto.style.opacity = 0;
texto.style.filter = "blur(20px)";
}, t+20000));

t += 20000;

/* ========================= */
/* LOGO + TICKER             */
/* ========================= */

timeouts.push(setTimeout(()=>{
logo.style.opacity = 1;
logo.style.filter = "blur(0)";
}, t+200));

timeouts.push(setTimeout(()=>{
logo.style.opacity = 0;
logo.style.filter = "blur(20px)";
}, t+20000));

t += 20000;

/* ========================= */
/* LOGO EE                   */
/* ========================= */

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

/* ========================= */
/* REINICIO CONTROLADO       */
/* ========================= */

timeouts.push(setTimeout(()=>{

if(!activo) return;

/* pausa en negro */
let delay = minutosLoop * 60 * 1000;

timeouts.push(setTimeout(()=>{
if(activo) startMosca();
}, delay));

}, t));

/* ========================= */
/* CONTADOR                  */
/* ========================= */

interval = setInterval(updateTexto,1000);
updateTexto();

}

/* ========================= */
/* STOP LIMPIO               */
/* ========================= */

function stopMosca(){

activo = false;

resetMosca(); // 🔥 CRÍTICO

}
