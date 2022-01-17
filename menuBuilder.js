var sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBhYTRQo8EsOF-TW7qw0IkLkg8hYozHsHujcs8TXx7CaUGCKZUtkhGLrAk8is_1INaKAQfHwJffZuy/pub?gid=0&single=true&output=csv';
var menuCt = 0;
function init() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: showInfo
  })
}

window.addEventListener('DOMContentLoaded', init);

function showInfo(results) {
  let price = name = nameDesc = cat = catDesc = "";
  var data = results.data
  console.log(data);
  let row = 1;
  while (row < data.length) {
    price = data[row].price;
    if (lang == 0) {
      name = data[row].name_en;
      nameDesc = data[row].nameDesc_en;
      cat = data[row].cat_en;
      catDesc = data[row].catDesc_en;
    } else if (lang == 1) {
      name = data[row].name_es;
      nameDesc = data[row].nameDesc_es;
      cat = data[row].cat_es;
      catDesc = data[row].catDesc_es;
    } else if (lang == 2) {
      name = data[row].name_ang;
      nameDesc = data[row].nameDesc_ang;
      cat = data[row].cat_ang;
      catDesc = data[row].catDesc_ang;
    } else if (lang == 3) {
      name = data[row].name_tlh;
      nameDesc = data[row].nameDesc_tlh;
      cat = data[row].cat_tlh;
      catDesc = data[row].catDesc_tlh;
    }
    if (data[row].hidden == "yes" || (name == "" && cat == "")) {
      row++;
      continue;
    }
    if (price == "menu") {
      menuCreate(name);
    }
    if (cat != "") {
      catCreate(cat,catDesc);
    }
    if (price != "") {
      if (price == "note") {
        addNote(name,nameDesc);
        row++;
        continue;
      } else if (price == "image") {
        addImg(name,nameDesc);
        row++;
        continue;
      } else  if (price != "menu") {itemCreate(name,nameDesc,price);}
    } else if (name != "") {
      let priceName = "";
      while(row < data.length-1 && data[row+1].name_en.charAt(0) == ':') {
        row++;
        if (lang == 0) priceName = data[row].name_en;
        else if (lang == 1) priceName = data[row].name_es;
        else if (lang == 2) priceName = data[row].name_ang;
        else if (lang == 3) priceName = data[row].name_tlh;
        price += " " + priceName.substr(1) + " " + data[row].price;
      }
      price = price.substr(1);
      itemCreate(name,nameDesc,price);
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
  button.setAttribute("class","menuName");
  if (lang == 3) button.setAttribute("class","menuName kli");
  button.innerHTML = name;

  document.getElementById("menuButtons").appendChild(li);
  li.appendChild(button);
  document.getElementById("margin").appendChild(div);
}
function catCreate(name,desc) { // add category name with description to latest menu
  var titleHolder = document.createElement("div");
  titleHolder.setAttribute("class","titleHolder");
  var menuTitle = document.createElement("div");
  menuTitle.setAttribute("class","menuTitle");
  if (lang == 3) menuTitle.setAttribute("class","menuTitle kli");
  menuTitle.innerHTML = name;
  var menuDesc = document.createElement("div");
  menuDesc.setAttribute("class","menuDesc");
  if (lang == 3) menuDesc.setAttribute("class","menuDesc kli");
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
  noteTitle.setAttribute("class","noteTitle");
  if (lang == 3) noteTitle.setAttribute("class","noteTitle kli");
  noteTitle.innerHTML = name;
  var noteDesc = document.createElement("div");
  noteDesc.setAttribute("class","noteDesc");
  if (lang == 3) noteDesc.setAttribute("class","noteDesc kli");
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
  menuItem.setAttribute("class","menuItem");
  menuItem.innerHTML = name;
  var itemDesc = document.createElement("div");
  itemDesc.setAttribute("class","itemDesc");
  itemDesc.innerHTML = desc;
  var priceDiv = document.createElement("div");
  priceDiv.setAttribute("class","price");
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
  var imgDesc = document.createElement("p");
  imgDesc.innerHTML = desc;

  var catDivs = document.getElementsByClassName("menuItems");
  var catDiv = catDivs[catDivs.length-1];
  
  catDiv.appendChild(itemHolder);
  itemHolder.appendChild(img);
  itemHolder.appendChild(imgDesc);
}