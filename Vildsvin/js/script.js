// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png","car_right.png","car_down.png","car_left.png"];
						// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i uppgiften === */
var pigCount = 0           //Antal visade vildsvin
var hitCount = 0           //Antal påkörda vildsvin
var pigTimerRef = null;    //Referens till timern för skapandet av vildsvin 
const pigTimerStep = 2000; //tid mellan visning av vildsvin
var pigElem;               //Referens till img-elementet för vildsvinen
var pigCaught = true       //boolean för om grisen är fångad
var pigNrElem;             //element för att visa hur många vildsvin som visats
var hitCounterElem;        //element för att visa hur många vildsvin som fångats

// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
		boardElem = document.getElementById("board");
		carElem = document.getElementById("car");
		startBtn = document.getElementById("startBtn");
		stopBtn = document.getElementById("stopBtn");
	// Lägg på händelsehanterare
		document.addEventListener("keydown",checkKey);
			// Känna av om användaren trycker på tangenter för att styra bilen
		startBtn.addEventListener("click",startGame);
		stopBtn.addEventListener("click",stopGame);
	// Aktivera/inaktivera knappar
		startBtn.disabled = false;
		stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
        pigElem = document.getElementById("pig");
        pigNrElem = document.getElementById("pigNr");
        hitCounterElem = document.getElementById("hitCounter");

} // End init
window.addEventListener("load",init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) {
	let k = e.keyCode;
	switch (k) {
		case 37: // Pil vänster
		case 90: // Z
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case 39:  // Pil höger
		case 189: // - 
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir];
	moveCar();
	/* === Tillägg i uppgiften === */
	pigElem.style.visibility = "hidden"
    
    pigCount = 0;
    pigNrElem.inner = pigCount
    
    hitCount = 0;
    hitCounterElem.innerHTML = hitCount;
   
    pigCaught = true;
    pigTimerRef = setTimeout(showPig, pigTimerStep);
} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
    if (pigTimerRef != null){
        clearTimeout(pigTimerRef);
    }
} // End stopGame
// ------------------------------


// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar,timerStep);
	/* === Tillägg i uppgiften === */
    checkCollision();
} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i uppgiften === */

// visa vildsvin på slumpvald plats på bräde om 9 eller färre redan visats
function showPig() {
	pigCaught = false;

    //checking if function is run for first time, if so

    if(pigCount < 10){  
        pigElem.src = "img/pig.png"
        pigElem.style.visibility = "visible";
        
        let xLimit = boardElem.offsetWidth;
        let yLimit = boardElem.offsetHeight;
        
        let x = Math.max(Math.random() * xLimit - pigElem.offsetWidth, 0);
        let y = Math.max(Math.random() * yLimit - pigElem.offsetHeight, 0);
        
        pigElem.style.left = x + "px";
        pigElem.style.top =  y + "px";
        pigCount++;
        pigNrElem.innerHTML = pigCount;
        pigTimerRef = setTimeout(showPig, pigTimerStep);
    }
    else{
        stopGame();
    }
} // End showPig
// ------------------------------

// kolla om bilen överlappar med ett vildsvin
function checkCollision() {
    
    if(pigCaught){
        return;
    }
    let pigX = parseInt(pigElem.style.left); //pig's left edge and x position
    let pigY = parseInt(pigElem.style.top);  //pig's top edge and y position
    let pigR = pigX + pigElem.offsetWidth;   //pig's right edge
    let pigB = pigY + pigElem.offsetHeight;  //pig's bottom edge
    
    let carX = parseInt(carElem.style.left); //car's left edge and x position
    let carY = parseInt(carElem.style.top);  //car's top edge and y position
    let carR = carX + carElem.offsetWidth;   //car's right edge
    let carB = carY + carElem.offsetHeight;  //car's bottom edge

    if(carX < pigR && 
       carR > pigX &&
       carY < pigB && 
       carB > pigY){
        pigCaught = true;
        pigElem.src = "img/smack.png"
        hitCount++;
        hitCounterElem.innerHTML = hitCount;
    } 
    
} // End checkCollision
// ------------------------------