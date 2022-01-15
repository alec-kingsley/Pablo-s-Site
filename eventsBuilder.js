function testItems() {
  eventCreate("Food Truck","When: Wednesday, June 23<br>Where: 2047 Bridge Place Blvd.","../images/FoodTruck2.jpg");
  eventCreate("Wine Tasting","When: Tuesday, June 29<br>Where: Pablo's Havana Café","../images/WinesCrop.jpeg");
  eventCreate("Hispanic Restaurant Week","When: July 5 through July 12<br>Where: Pablo's Havana Café","../images/HispanicRestaurantWeek.png");
}

function insert(arr,val,idx) { //insert val into arr at index index
  let arr1 = [];
  while (arr.length > idx) {
    arr1 = [arr.pop()].concat(arr1);
  }
  arr.push(val);
  return arr.concat(arr1);

}
var sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBhYTRQo8EsOF-TW7qw0IkLkg8hYozHsHujcs8TXx7CaUGCKZUtkhGLrAk8is_1INaKAQfHwJffZuy/pub?gid=1687982001&single=true&output=csv';
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
  var data = results.data
  console.log(data);

  const today = new Date();

  let allDates = []; //this will store all dates so that they can be sorted before they're put on page
  let allNames = [];
  let allDescs = []; //this stores the dates in text forms follewed by a <br> followed by all locations with a <br> before the description
  let allSrcs = [];
  let allEnds = []; //to store end dates or start dates if there isn't an end date. To delete items that are too far away/have already passed

  const days_en = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const days_es = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
  const days_ang = ["Sun","Món","Tiw","Wod","Ðun","Fri","Sæt"];
  const months_en = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const months_es = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"];
  const months_ang = ["Æfterra Geola","Solmónaþ","Hréþmónaþ","Eastermónaþ","Þrimilcemónaþ","Ærra Líþa","Æftera Líþa","Weodmónaþ","Háligmónaþ","Winterfylleþ","Blótmónaþ","Ærra Geola"];

  let startDate = startDay = startMonth = endDate = endDay = endMonth = loc = img = name = desc = "";
  let row = 0;
  while (row < data.length) {
    if (lang == 0) {
      name = data[row].name_en;
      desc = data[row].desc_en;
    } else if (lang == 1) {
      name = data[row].name_es;
      desc = data[row].desc_es;
    } else {
      name = data[row].name_ang;
      desc = data[row].desc_ang;
    }
    if (name == "") {
      row++;
      continue;
    }
    startDay = data[row].startDay;
    startMonth = data[row].startMonth;
    if (startDay != "" && startMonth != "")
      startDate = new Date(startMonth + " " + startDay);
    else
      startDay = startDate.getDate();
    endDay = data[row].endDay;
    endMonth = data[row].endMonth;
    endDate = new Date(endMonth + " " + endDay);
    loc = data[row].location;
    img = data[row].img;
    if (startDate == "Invalid Date") {
      row++;
      continue;
    }
    startDate.setYear(today.getFullYear());
    if (endDate != "Invalid Date") {
      endDate.setYear(today.getFullYear());
      if (endDate - startDate < 0) endDate.setYear(today.getFullYear() + 1);
    }

    if (lang == 0) {
      if (desc != "") desc = "What: " + desc + "<br>";
      desc = desc + "When: " + days_en[startDate.getDay()] + ", " + months_en[startDate.getMonth()] + " " + startDay;
      if (endDate != "Invalid Date") desc = desc + " through " + days_en[endDate.getDay()] + ", " + months_en[endDate.getMonth()] + " " + endDay;
      if (loc != "") desc = desc + "<br>Where: " + loc;
    } else if (lang == 1) {
      if (desc != "") desc = "Qué: " + desc + "<br>";
      desc = desc + "Cuándo: " + days_es[startDate.getDay()] + ", " + startDay + " de " + months_es[startDate.getMonth()];
      if (endDate != "Invalid Date") desc = desc + " por " + days_es[endDate.getDay()] + ", " + endDay + " de " + months_es[endDate.getMonth()];
      if (loc != "") desc = desc + "<br>Dónde: " + loc;
    } else {
      if (desc != "") desc = "Hwæt: " + desc + "<br>";
      desc = desc + "Hwóne: " + days_ang[startDate.getDay()] + ", " + months_ang[startDate.getMonth()] + " " + startDay;
      if (endDate != "Invalid Date") desc = desc + " þurh " + days_ang[endDate.getDay()] + ", " + months_ang[endDate.getMonth()] + " " + endDay;
      if (loc != "") desc = desc + "<br>Hwær: " + loc;
    }

    let idx = 0;
    for (let i = 0; i < allDates.length; i++) {
      if (startDate > allDates[i]) idx++;
    }
    allDates = insert(allDates,startDate,idx);
    if (endDate == "Invalid Date") allEnds = insert(allEnds,startDate,idx);
    else allEnds = insert(allEnds,endDate,idx);
    allNames = insert(allNames,name,idx);
    allDescs = insert(allDescs,desc,idx);
    allSrcs = insert(allSrcs,img,idx);

    row++;
  }
  for (let i = 0; i < allDates.length; i++) {
    console.log(allEnds[i]);
    if (today - allEnds[i] < 0 && today - allDates[i] < 30)
      eventCreate(allNames[i],allDescs[i],allSrcs[i]);
    // only add the event if it hasn't already passed and will start within the next 30 days.
  }
  
}

function eventCreate(name,desc,src) {
  var eventItem = document.createElement("div");
  eventItem.setAttribute("class","eventItem");
  var eventText = document.createElement("div");
  eventText.setAttribute("class","eventText");
  var eventName = document.createElement("div");
  eventName.setAttribute("class","eventName");
  var eventDesc = document.createElement("div");
  eventDesc.setAttribute("class","eventDesc");
  var img = document.createElement("img");

  eventName.innerHTML = name;
  eventDesc.innerHTML = desc;
  img.setAttribute("src",src);

  document.getElementById("eventList").appendChild(eventItem);
  eventItem.appendChild(eventText);
  eventItem.appendChild(img);
  eventText.appendChild(eventName);
  eventText.appendChild(eventDesc);

}