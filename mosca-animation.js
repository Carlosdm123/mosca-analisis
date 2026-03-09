const container = document.getElementById("container");
const textBox = document.getElementById("textBox");
const logoBox = document.getElementById("logoBox");

let repeatTimer=null;
let running=false;

function startMosca(){

running=true;

runBlock();

}

function stopMosca(){

running=false;

clearTimeout(repeatTimer);

container.style.opacity=0;

}

function runBlock(){

if(!running) return;

container.style.opacity=1;

/* TEXTO ENTRA */

textBox.style.opacity=1;
textBox.style.transform="translateX(0)";
textBox.style.filter="blur(0px)";

/* TEXTO SALE A LOS 15s */

setTimeout(()=>{

textBox.style.transition="all 1s";

textBox.style.opacity=0;
textBox.style.filter="blur(8px)";

},15000);

/* LOGO ENTRA */

setTimeout(()=>{

logoBox.style.opacity=1;
logoBox.style.filter="blur(0px)";

},17000);

/* LOGO SALE */

setTimeout(()=>{

logoBox.style.transition="all 1s";

logoBox.style.opacity=0;
logoBox.style.filter="blur(8px)";
logoBox.style.transform="translateX(100px)";

},33000);

/* ESPERA 4 MINUTOS */

repeatTimer=setTimeout(()=>{

runBlock();

},240000);

}