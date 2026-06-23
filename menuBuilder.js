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

// LANG_SUFFIX and kli() now live once in core.js as PHC.LANG_SUFFIX / PHC.kli(base, lang).
// core.js MUST be loaded before menuBuilder.js on every menu page.

function showInfo(results) {
  let price = "";
  let Name = "", nameDesc = "", cat = "", catDesc = "";
  var data = results.data
  const suffix = PHC.LANG_SUFFIX[lang];
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
  button.setAttribute("class", PHC.kli("menuName", lang));
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
  menuTitle.setAttribute("class", PHC.kli("menuTitle", lang));
  menuTitle.innerHTML = name;
  var menuDesc = document.createElement("div");
  menuDesc.setAttribute("class", PHC.kli("menuDesc", lang));
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
  noteTitle.setAttribute("class", PHC.kli("noteTitle", lang));
  noteTitle.innerHTML = name;
  var noteDesc = document.createElement("div");
  noteDesc.setAttribute("class", PHC.kli("noteDesc", lang));
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
  menuItem.setAttribute("class", PHC.kli("menuItem", lang));
  menuItem.innerHTML = name;
  var itemDesc = document.createElement("div");
  itemDesc.setAttribute("class", PHC.kli("itemDesc", lang));
  itemDesc.innerHTML = desc;
  var priceDiv = document.createElement("div");
  priceDiv.setAttribute("class", PHC.kli("price", lang));
  priceDiv.innerHTML = price;

  var catDivs = document.getElementsByClassName("menuItems");
  var catDiv = catDivs[catDivs.length-1];
  
  catDiv.appendChild(itemHolder);
  itemHolder.appendChild(menuItem);
  itemHolder.appendChild(itemDesc);
  itemHolder.appendChild(priceDiv);
}
function addImg(link,desc) {
  link = PHC.pathFix(link, window.location.pathname);

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