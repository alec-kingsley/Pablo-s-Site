// pathFix stays a global (birthday/halloween call it); the path-rewrite logic now lives once in
// core.js as PHC.pathFix. core.js MUST be loaded before script.js on every page.
function pathFix(link) {
  return PHC.pathFix(link, window.location.pathname);
}


let lang = 0; // 0 is English, 1 is Spanish, 2 is Old English, 3 is Klingon
let randSplash = [];

easterEgg();
// should probably fix
function openFunc(langSet) {
  lang = langSet;
  setSlide(1);
  daySelect();
}
function daySelect() {
  var today = new Date();

  //runs on pablos birthday
  // might be broken
  if (today.getMonth() == 0 && today.getDate() == 17) birthday();

  //runs on halloween
  if (today.getMonth() == 9) halloween();

  var day = today.getDay();

  if (day >= 0 && day <= 3) {
    document.getElementById("sun-wed").style.textDecoration = "underline";
  } else {
    document.getElementById("thur-sat").style.textDecoration = "underline";
  }
  untilClose();
}
function untilClose() {
  var d = new Date();
  var day = d.getDay();
  let hr = d.getHours();

  var isOpen = false;

  if (day >= 0 && day <= 3) {
  isOpen = hr >= 11 && hr <= 20;
  } else {
    isOpen = hr >= 11 && hr <= 21;
  }

  if (isOpen) {
    const langOpen = ["Open", "Abierto", "Openede", "poSmoHta'"];
    document.getElementById("isOpen").innerHTML = langOpen[lang];
  }
}


//Pablos Birthday
function birthday() {
  var body = document.getElementsByTagName("body")[0];
  var canvas = document.createElement("canvas");
  var js = document.createElement("script");

  canvas.id = "canvas";
  js.type = "text/javascript";
  js.src = pathFix("/bday.js");

  body.appendChild(canvas);
  body.appendChild(js);

  var topItems = document.getElementById("topItems");
  var splashText = document.createElement("div");
  splashText.id = "birthday";
  if (lang == 3) splashText.className = "kli";
  topItems.appendChild(splashText);
  if (lang == 0) splashText.innerHTML = "Wish our boss, Pablo Taura, a happy birthday today!";
  else if (lang == 1) splashText.innerHTML = "Deséale a nuestro jefe, Pablo Taura, un felíz cumpleaños!";
  // OE birthday splash — drafted by Claude, flag for owner/translator (Alec) review (triage I1)
  // Gloss: Wýsc(imp.) | úrum hláforde (our boss, dat.) | glædne gebyrddæg (a happy birthday, acc.) | tódæg (today)
  else if (lang == 2) splashText.innerHTML = "Wýsc úrum hláforde, Pablo Taura, glædne gebyrddæg tódæg!";
  else if (lang == 3) splashText.innerHTML = "pinma'daq qoslij dativjaj yijaz!"
  var mainImg = document.getElementById("mainImg");
  mainImg.src = pathFix("/images/birthday.webp");
}



//Halloween
function halloween() {
  // Swap both nav logos to the pumpkin logo — the only live Halloween effect.
  // (The old halloween.js theming was entirely dead code: it only console.logged and defined
  //  never-called functions. It has been removed; the appendChild + unused path/page/body vars too.)
  document.getElementById("navIcon").setAttribute("src", pathFix('/images/HalloweenLogo.png'));
  document.getElementById("navIconMobile").setAttribute("src", pathFix('/images/HalloweenLogo.png'));
}



//Thing for slideshow
var slideIdx = 0;

function addSlides(n) {
  setSlide(loopSlide(1 + slideIdx + n) + 1);
}

function setSlide(n) {
  var slides = document.getElementsByClassName("demo");
  document.getElementById("lSlide").setAttribute("src", slides[loopSlide(n - 1)].getAttribute("src"));
  document.getElementById("mSlide").setAttribute("src", slides[loopSlide(n)].getAttribute("src"));
  document.getElementById("rSlide").setAttribute("src", slides[loopSlide(n + 1)].getAttribute("src"));
  document.getElementById("caption").innerHTML = slides[loopSlide(n)].alt;
  slides[slideIdx].className = slides[slideIdx].className.replace(" active", "");
  slideIdx = loopSlide(n);
  slides[slideIdx].className += " active";
}
function loopSlide(n) {
  var slides = document.getElementsByClassName("column");
  if (n > slides.length) { return 0 }
  if (n < 1) { return slides.length - 1 }
  return n - 1;
}


function setMenu(menu) {
  var menuButtons = document.getElementsByClassName("menuName");
  var menus = document.getElementsByClassName("category");
  for (let i = 0; i < menus.length; i++) {
    if (i == menu) {
      menus[i].style.display = "block";
      menuButtons[i].style.color = "#d92332";
    } else {
      menus[i].style.display = "none";
      menuButtons[i].style.color = "#2a438c";
    }
  }
}



// all this does is switch navbar from display to not display or vice versa
function switchDisp() {
  var x = document.getElementById("mobileNav");
  if (x.style.display == "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
function buttonPopupGen() {
  var x = document.getElementById("buttonPopup");
  var y = document.getElementById('orderButton');
  if (x.style.display == "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }

  if (y.style.borderRadius == "0px") {
    y.style.borderRadius = "16px";
  } else {
    y.style.borderRadius = "0";
  }
}

window.onscroll = function() { scrollFunction(); }

function scrollFunction() {
  const logo = document.getElementById("navIcon");
  const nav = document.getElementById("navbar");
  const left = document.getElementById("left");
  const right = document.getElementById("right");
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    nav.style.padding = "10px 0 0";
    logo.style.height = logo.style.width = "90px";
    left.style.borderBottomWidth = right.style.borderBottomWidth = "0";
  } else {
    nav.style.padding = "22px 0 8px";
    logo.style.height = logo.style.width = "100px";
    left.style.borderBottom = right.style.borderBottom = "3px solid #2a438c";
  }
}

function easterEgg() {
  const logo = document.getElementById("navIcon");
  logo.addEventListener("dblclick", function() {
    if (randSplash.length == 0) randSplash = randomSplash();
    alert(randSplash.pop());
  });
}

function randomSplash() {
  var today = new Date();

  let splashText = ["Visit us February 18th at 6:00 PM!", "Cure your boredom with pabloshavanacafe.com/clicker !", "Try pabloshavanacafe.com/ang ! Anglo-Saxon approved", "Try pabloshavanacafe.com/tlh ! Klingon approved", "Since December 2018", "Be careful not to inhale the restaurant-grade chemispray", "Born in Cuba, raised in Jersey", "Billions and billions served! Wait no that's not right", "Bring a friend!", "Vaca Frita sounds so much better in English", "Add a description about this category", "Trouble with windmills? Try pabloshavanacafe.com/csv-analyzer !"];

  let halloween = ["We may never be rid of the ghost of Domino's", "There is perhaps nothing spookier than the prospect of Pablo finding this", "If you're looking for a real scare this month, check out the code!", "Come to our restaurant for a special haunted house event! This month only!"];
  if (today.getMonth() == 9) // October — align Halloween splash texts with the October decorations (was 8 = September)
    splashText = splashText.concat(halloween);

  let retText = [];
  while (splashText.length > 0) {
    var randIdx = Math.floor(Math.random() * splashText.length)
    retText.push(splashText[randIdx]);
    splashText.splice(randIdx, 1);
  }
  return retText;
}
/**
  * @output NO
  * @param title - the title of popup
  */
function popUpGen(title, desc) {
  if (document.getElementById('popUp')) popUp.remove();

  body = document.getElementsByTagName("body")[0];
  popUp = document.createElement("div");
  popUp.id = "popUp";

  popUpTitle = document.createElement("div");
  popUpTitle.innerHTML = title;
  popUpTitle.id = "popUpTitle";

  popUpDesc = document.createElement("div");
  popUpDesc.innerHTML = desc;
  popUpDesc.id = "popUpDesc";

  close = document.createElement("button");
  close.setAttribute("onClick", "popUp.remove()");
  close.innerHTML = "Close";

  popUp.appendChild(popUpTitle);
  popUp.appendChild(popUpDesc);
  popUp.appendChild(close);

  body.appendChild(popUp);
}
