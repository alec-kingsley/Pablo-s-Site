function clear() {
  document.getElementById("cocktails").style.display = "none";
  document.getElementById("food").style.display = "none";
  document.getElementById("whiskey").style.display = "none";
  document.getElementById("wine").style.display = "none";
  document.getElementById("beer").style.display = "none";

  document.getElementById("cocktailsButt").style.color = "#656b72";
  document.getElementById("foodButt").style.color = "#656b72";
  document.getElementById("whiskeyButt").style.color = "#656b72";
  document.getElementById("wineButt").style.color = "#656b72";
  document.getElementById("beerButt").style.color = "#656b72";

}

function cocktails() {
  clear();
  document.getElementById("cocktails").style.display = "block";
  document.getElementById("cocktailsButt").style.color = "#bdc0c3";

}
function food() {
  clear();
  document.getElementById("food").style.display = "block";
  document.getElementById("foodButt").style.color = "#bdc0c3";

}
function whiskey() {
  clear();
  document.getElementById("whiskey").style.display = "block";
  document.getElementById("whiskeyButt").style.color = "#bdc0c3";

}
function wine() {
  clear();
  document.getElementById("wine").style.display = "block";
  document.getElementById("wineButt").style.color = "#bdc0c3";

}
function beer() {
  clear();
  document.getElementById("beer").style.display = "block";
  document.getElementById("beerButt").style.color = "#bdc0c3";

}