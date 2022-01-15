let lang = 0; // 0 is English, 1 is Spanish, 2 is Old English
let randSplash = [];

function openFunc(langSet) {
  lang = langSet;
  daySelect();
  setSlide(1);
  easterEgg();
}
function daySelect() {
  var today = new Date();

  //runs on pablos birthday
  if (today.getMonth() == 0 && today.getDate() == 17) birthday();

  var day = today.getDay();

  if (day == 0) {
    document.getElementById("sun").style.textDecoration = "underline";
  } else if (day == 6) {
    document.getElementById("sat").style.textDecoration = "underline";
  } else {
    document.getElementById("mon-fri").style.textDecoration = "underline";
  }
  untilClose();
}
function untilClose() {
  var d = new Date();
  var day = d.getDay();
  let hr = d.getHours();
  let min = d.getMinutes();

  var isOpen = false;
  if (hr >= 11) {
    if (day == 0 && hr < 17)  {
      isOpen = true;
    } else if (day == 6 && hr < 20) {
      isOpen = true;
    } else if (hr < 20 && !(hr >= 14 && hr < 16)) {
      isOpen = true;
    }
  }
  if (isOpen) {
    const langOpen = ["Open","Abierto","Openede"];
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
  js.src = "bday.js";

  body.appendChild(canvas);
  body.appendChild(js);

  var topItems = document.getElementById("topItems");
  var splashText = document.createElement("div");
  splashText.id = "birthday";
  topItems.appendChild(splashText);
  splashText.innerHTML = "Wish our business owner, Pablo Taura, a happy birthday today!";
  var mainImg = document.getElementById("mainImg");
  mainImg.src = "./images/birthday.jpg";
}






//Thing for slideshow
var slideIdx = 0;

function addSlides(n) {
  setSlide(loopSlide(1+slideIdx+n)+1);
}

function setSlide(n) {
  var slides = document.getElementsByClassName("demo");
  document.getElementById("lSlide").setAttribute("src",slides[loopSlide(n-1)].getAttribute("src"));
  document.getElementById("mSlide").setAttribute("src",slides[loopSlide(n)].getAttribute("src"));
  document.getElementById("rSlide").setAttribute("src",slides[loopSlide(n+1)].getAttribute("src"));
  document.getElementById("caption").innerHTML = slides[loopSlide(n)].alt;
  slides[slideIdx].className = slides[slideIdx].className.replace(" active","");
  slideIdx = loopSlide(n);
  slides[slideIdx].className += " active";
}
function loopSlide(n) {
  var slides = document.getElementsByClassName("column");
  if (n > slides.length) {return 0}
  if (n < 1) {return slides.length-1}
  return n-1;
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

window.onscroll = function() {scrollFunction();}

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
  logo.addEventListener("dblclick",function() {
    if (randSplash.length == 0) randSplash = randomSplash();
    alert(randSplash.pop()); 
    });
}

function randomSplash() {
  let splashText = ["Try pabloshavanacafe.com/ang ! Anglo-Saxon approved","Since December 2018","S t r e s s z i l l a","Be careful not to inhale the restaurant-grade chemispray","Born in Cuba, raised in Jersey","Billions and billions served! Wait no that's not right","https://discord.gg/QtunQKrUFB","Bring a friend!","Vaca Frita sounds so much better in English","Add a description about this category"];
  let retText = [];
  while (splashText.length > 0) {
    var randIdx = Math.floor(Math.random()*splashText.length)
    retText.push(splashText[randIdx]);
    splashText.splice(randIdx,1);
  }
  return retText;
}