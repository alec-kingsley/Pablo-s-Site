var sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBhYTRQo8EsOF-TW7qw0IkLkg8hYozHsHujcs8TXx7CaUGCKZUtkhGLrAk8is_1INaKAQfHwJffZuy/pub?gid=0&single=true&output=csv';
var menuCt = 0;
let loading = document.getElementById('loading')
function init() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: showInfo
  })
}

window.addEventListener('DOMContentLoaded', init);

// Language column suffix for the active language: 0=en, 1=es, 2=ang, 3=tlh.
const LANG_SUFFIX = ['_en', '_es', '_ang', '_tlh'];

// Returns base, or "base kli" when the active language is Klingon (lang 3).
function kli(base) {
  return lang == 3 ? base + " kli" : base;
}

function showInfo(results) {
  let price = "";
  let Name = "", nameDesc = "", cat = "", catDesc = "";
  var data = results.data
  const suffix = LANG_SUFFIX[lang];
  let row = 1;
  while (row < data.length) {
    price = data[row].price;
    Name = data[row]['name' + suffix];
    nameDesc = data[row]['nameDesc' + suffix];
    cat = data[row]['cat' + suffix];
    catDesc = data[row]['catDesc' + suffix];
    if (data[row].hidden == "yes" || (Name == "" && cat == "")) {
      row++;
      continue;
    }
    if (price == "menu") {
      menuCreate(Name);
    }
    if (cat != "") {
      catCreate(cat,catDesc);
    }
    if (price != "") {
      if (price == "note") {
        addNote(Name,nameDesc);
        row++;
        continue;
      } else if (price == "image") {
        addImg(Name,nameDesc);
        row++;
        continue;
      } else  if (price != "menu") {itemCreate(Name,nameDesc,price);}
    } else if (Name != "") {
      let priceName = "";
      while(row < data.length-1 && data[row+1].name_en.charAt(0) == ':') {
        row++;
        priceName = data[row]['name' + suffix];
        price += " " + priceName.substr(1) + " " + data[row].price;
      }
      price = price.substr(1);
      itemCreate(Name,nameDesc,price);
    }
    row++;
  }
  if (menuCt > 0) setMenu(0);
}

function menuCreate(name) { // food, drink, dessert
  var div = document.createElement("div");
  div.setAttribute("class","category");
  var li = document.createElement("li");
  var button = document.createElement("button");
  button.setAttribute("type","button");
  button.setAttribute("onclick","setMenu("+menuCt+")");
  menuCt++;
  button.setAttribute("class", kli("menuName"));
  button.innerHTML = name;

  document.getElementById("menuButtons").appendChild(li);
  li.appendChild(button);
  document.getElementById("loadMenu").appendChild(div);
	
	loading.remove();
}
function catCreate(name,desc) { // add category name with description to latest menu
  var titleHolder = document.createElement("div");
  titleHolder.setAttribute("class","titleHolder");
  var menuTitle = document.createElement("div");
  menuTitle.setAttribute("class", kli("menuTitle"));
  menuTitle.innerHTML = name;
  var menuDesc = document.createElement("div");
  menuDesc.setAttribute("class", kli("menuDesc"));
  menuDesc.innerHTML = desc;
  var menuItems = document.createElement("div");
  menuItems.setAttribute("class","menuItems");

  var menuDivs = document.getElementsByClassName("category");
  var menuDiv = menuDivs[menuDivs.length-1];
  menuDiv.appendChild(titleHolder);
  titleHolder.appendChild(menuTitle);
  titleHolder.appendChild(menuDesc);
  menuDiv.appendChild(menuItems);
  
}
function addNote(name,desc) { // add a note between categories
  var noteTitle = document.createElement("div");
  noteTitle.setAttribute("class", kli("noteTitle"));
  noteTitle.innerHTML = name;
  var noteDesc = document.createElement("div");
  noteDesc.setAttribute("class", kli("noteDesc"));
  noteDesc.innerHTML = desc;

  var menuDivs = document.getElementsByClassName("category");
  var menuDiv = menuDivs[menuDivs.length-1];
  menuDiv.appendChild(noteTitle);
  menuDiv.appendChild(noteDesc);
}
function itemCreate(name,desc,price) { // add item name with description and price to latest menu
  var itemHolder = document.createElement("div");
  itemHolder.setAttribute("class","itemHolder");
  var menuItem = document.createElement("div");
  menuItem.setAttribute("class", kli("menuItem"));
  menuItem.innerHTML = name;
  var itemDesc = document.createElement("div");
  itemDesc.setAttribute("class", kli("itemDesc"));
  itemDesc.innerHTML = desc;
  var priceDiv = document.createElement("div");
  priceDiv.setAttribute("class", kli("price"));
  priceDiv.innerHTML = price;

  var catDivs = document.getElementsByClassName("menuItems");
  var catDiv = catDivs[catDivs.length-1];
  
  catDiv.appendChild(itemHolder);
  itemHolder.appendChild(menuItem);
  itemHolder.appendChild(itemDesc);
  itemHolder.appendChild(priceDiv);
}
function addImg(link,desc) {
  if (link.charAt(0) == "/") {
    const homeDist = window.location.pathname.split("/").length;
    for (let i = 1; i < homeDist; i++) link = "/.." + link;
  }

  var itemHolder = document.createElement("div");
  itemHolder.setAttribute("class","itemHolder photo");
  var img = document.createElement("img");
  img.setAttribute("src",link);
  img.setAttribute("alt",desc);
  var imgDesc = document.createElement("p");
  if (lang == 3) imgDesc.setAttribute("class","kli");
  imgDesc.innerHTML = desc;

  var catDivs = document.getElementsByClassName("menuItems");
  var catDiv = catDivs[catDivs.length-1];
  
  catDiv.appendChild(itemHolder);
  itemHolder.appendChild(img);
  itemHolder.appendChild(imgDesc);
}