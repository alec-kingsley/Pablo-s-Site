const shopItems = [
	{name : "Employee", basePrice : 10, baseSpeed : .1, img : "Employee.png"},
	{name : "Manager", basePrice : 100, baseSpeed : 1, img : "Manager.png"},
	{name : "Jess", basePrice : 1000, baseSpeed : 10, img : "Jess.jpg"},
	{name : "Food Truck", basePrice : 15000, baseSpeed : 50, img : "FoodTruck.jpg"},
	{name : "Budd Dairy", basePrice : 150000, baseSpeed : 300, img : "BuddDairy.jpg"},
	{name : "Restaurant", basePrice : 1500000, baseSpeed : 1500, img : "Restaurant.jpg"},
	{name : "Advertisement", basePrice : 20000000, baseSpeed : 8000, img : "Advertisement.png"},
	{name : "Factory", basePrice : 300000000, baseSpeed : 50000, img : "Factory.png"},
	{name : "Shipping Container", basePrice : 5000000000, baseSpeed : 250000, img : "ShippingContainer.png"},
	{name : "Wegenerist", basePrice : 75000000000, baseSpeed : 1500000, img : "Wegenerist.png"},
	{name : "Portal", basePrice : 1000000000000, baseSpeed : 10000000, img : "Portal.png"},
	{name : "Time Machine", basePrice : 15000000000000, baseSpeed : 50000000, img : "TimeMachine.png"},
	{name : "Cloning Machine", basePrice : 200000000000000, baseSpeed : 450000000, img : "CloningMachine.png"},
	{name : "Wegener's Love", basePrice : 2000000000000000, baseSpeed : 3000000000, img : "WegenerLove.png"},]
let itemsOwned = new Array(shopItems.length).fill(0);
let cubanoCt = 0;
let cubanoSpeed = 0;
let data = [
	{name : "Pablo", password: "Pablo10$$", cubanoCt : 100000, Employee : 100, Manager : 100,
		Jess : 100, FoodTruck : 100, BuddDairy : 100, Restaurant : 100, Advertisement : 100, 
		Factory : 100, ShippingContainer : 100, Wegenerist : 100, Portal: 100, TimeMachine : 100,
		CloningMachine : 100, WegenerLove : 100},
	{name : "Kyle", password: "H0rk3r", cubanoCt : 30000000, Employee : 60, Manager : 4,
		Jess : 4, FoodTruck : 5, BuddDairy : 3, Restaurant : 6, Advertisement : 0, 
		Factory : 0, ShippingContainer : 0, Wegenerist : 0, Portal : 0, TimeMachine : 0,
		CloningMachine : 0, WegenerLove : 0}

];
let accName = "User";
let accPassword = "123";
var accCreationDate;
function itemGen(item) {
	const shopItems = document.getElementById("shopItems");
	const shopItemCt = shopItems.getElementsByClassName("shopItem").length;
	const shopItem = document.createElement("div");
	shopItem.classList.add("shopItem");
	shopItem.setAttribute("onclick","buyItem("+shopItemCt+")");
	const itemInfo = document.createElement("div");
	itemInfo.classList.add("itemInfo");
	const itemName = document.createElement("div");
	itemName.classList.add("itemName");
	itemName.innerHTML = item.name;
	const itemCt = document.createElement("div");
	itemCt.classList.add("itemCt");
	itemCt.innerHTML = "Owned: 0";
	const itemPrice = document.createElement("div");
	itemPrice.classList.add("itemPrice");
	itemPrice.innerHTML = numberName(item.basePrice) + " Cubanos";
	const itemSpeed = document.createElement("div");
	itemSpeed.classList.add("itemSpeed");
	itemSpeed.innerHTML = numberName(item.baseSpeed) + " Cubanos/sec";
	const itemPic = document.createElement("div");
	itemPic.classList.add("itemPic");
	const itemPicImg = document.createElement("img");
	itemPicImg.setAttribute("src",item.img);
	shopItem.appendChild(itemInfo);
	itemInfo.appendChild(itemName);
	itemInfo.appendChild(itemCt);
	itemInfo.appendChild(itemPrice);
	itemInfo.appendChild(itemSpeed);
	shopItem.appendChild(itemPic);
	itemPic.appendChild(itemPicImg);
	shopItems.appendChild(shopItem);
	
}
function loadItems() {
	shopItems.forEach(item => {
		itemGen(item);
	});
}
loadItems();

let lastRenderTime = 0;
const updateIntervalMain = 1/5; //seconds between updates
function main(currentTime) {
	window.requestAnimationFrame(main);
	if ((currentTime - lastRenderTime)/1000 < updateIntervalMain) return;
	lastRenderTime = currentTime;
	cubanoCt += updateIntervalMain*cubanoSpeed;
	updateCubanos();
	updateCubanoSpeed();
}
window.requestAnimationFrame(main);

let lastSaveTime = 0;
const updateIntervalSave = 60*5; //seconds between updates
function saveLoop(currentTime) {
	window.requestAnimationFrame(saveLoop);
	if (accName == "User" || (currentTime - lastSaveTime)/1000 < updateIntervalSave) return;
	lastSaveTime = currentTime;
	saveAcc(accName,accPassword);
}
window.requestAnimationFrame(saveLoop);

function updateCubanos() {
	const cubanoCtDiv = document.getElementById("cubanoCt");
	cubanoCtDiv.innerHTML = "Cubanos: " + numberName(cubanoCt);
}
function updateCubanoSpeed() {
	const cubanoSpeedDiv = document.getElementById("cubanoSpeed");
	cubanoSpeedDiv.innerHTML = numberName(cubanoSpeed) + " Cubanos/second";
}

async function cubanoClick() {
	cubanoCt += 1 + .25*cubanoSpeed;
	updateCubanos();
	const clicker = document.getElementById("clicker");
	const cubano = clicker.getElementsByTagName("img")[0];
	let h = cubano.offsetHeight;
	cubano.style.width = "355px";
	//makes it pop to middle
	cubano.style.marginTop = ((h - cubano.offsetHeight)/2)+"px";
	await delay (50);
	cubano.style.width = "360px";
	cubano.style.marginTop = "0";
}

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function buyItem(itemIdx) {
	if (cubanoCt >= shopItems[itemIdx].basePrice*Math.pow(1.1,itemsOwned[itemIdx])) {
		cubanoCt -= shopItems[itemIdx].basePrice*Math.pow(1.1,itemsOwned[itemIdx]);
		const shopItem = document.getElementsByClassName("shopItem")[itemIdx];
		const itemCt = shopItem.getElementsByClassName("itemCt")[0];
		const itemPrice = shopItem.getElementsByClassName("itemPrice")[0];
		itemCt.innerHTML = "Owned: " + ++itemsOwned[itemIdx];
		itemPrice.innerHTML = numberName(shopItems[itemIdx].basePrice*Math.pow(1.1,itemsOwned[itemIdx])) + " Cubanos";
		cubanoSpeed += shopItems[itemIdx].baseSpeed;
		updateCubanos();
		updateCubanoSpeed();
	}
}

function numberName(n) {
	if (n < 1000000) return Math.round(10*n)/10;
	n/=1000000;
	let numNames = ["m","b","tr","quadr","quint","sext","sept","oct","non","dec",
	"undec","duodec","tredec","quattuordec","quindec","sexdec","septdec","octodec","novemdec",
	"vigint","unvigint","duovigint","trevigint","quattuorvigint","quinvigint","sexvigint","septenvigint","octovigint","novemvigint",
	"trigint","untrigint","duotrigint","tretrigent","quattuortrigint","quintrigint","sextrigint","septentrigint","octotrigint","novemtrigint"];
	for (i = 0; i < numNames.length; i++) numNames[i] += "illion";
	while (n >= 1000 && numNames.length > 1) {
			n/=1000;
			numNames.shift();
	} 
	if (n < Infinity) return Math.round(10*n)/10 + " " + numNames[0];
	return "Infinite";
}
function setCubanoSpeed() {
	cubanoSpeed = 0;
	for (i = 0; i < shopItems.length; i++)
		cubanoSpeed += itemsOwned[i]*shopItems[i].baseSpeed;
	updateCubanoSpeed();
}
function setOwned(idx,value) {
	itemsOwned[idx] = value;
	const shopItem = document.getElementsByClassName("shopItem")[idx];
	const itemCt = shopItem.getElementsByClassName("itemCt")[0];
	const itemPrice = shopItem.getElementsByClassName("itemPrice")[0];
	itemCt.innerHTML = "Owned: " + value;
	itemPrice.innerHTML = numberName(shopItems[idx].basePrice*Math.pow(1.1,value)) + " Cubanos";
	
}
function loadAcc(accIdx) {
	let canLoad = true;
	accPassword = data[accIdx].password;
	data.forEach(account => {
		if (account.password == undefined) canLoad = false;
		else delete account.password;
	});
	if (canLoad) {
		setOwned(0,parseInt(data[accIdx].Employee));
		setOwned(1,parseInt(data[accIdx].Manager));
		setOwned(2,parseInt(data[accIdx].Jess));
		setOwned(3,parseInt(data[accIdx].FoodTruck));
		setOwned(4,parseInt(data[accIdx].BuddDairy));
		setOwned(5,parseInt(data[accIdx].Restaurant));
		setOwned(6,parseInt(data[accIdx].Advertisement));
		setOwned(7,parseInt(data[accIdx].Factory));
		setOwned(8,parseInt(data[accIdx].ShippingContainer));
		setOwned(9,parseInt(data[accIdx].Wegenerist));
		setOwned(10,parseInt(data[accIdx].Portal));
		setOwned(11,parseInt(data[accIdx].TimeMachine));
		setOwned(12,parseInt(data[accIdx].CloningMachine));
		setOwned(13,parseInt(data[accIdx].WegenerLove));
		setCubanoSpeed();
    accCreationDate = data[accIdx].creationDate;
		cubanoCt = Number(data[accIdx].cubanoCt);
		const companyName = document.getElementById("companyName");
		accName = data[accIdx].name;
		companyName.innerHTML = accName + "'s Havana Café";
		const settingsDropdown = document.getElementById("settingsDropdown");
		const save = settingsDropdown.getElementsByTagName("li")[0];
		save.innerHTML = "Save";
		save.setAttribute("onclick","saveAcc(accName,accPassword)");
	} else console.log("Unsuccessful account load: Already logged in");
	
}
function login(name,password) {
	for (i = 0; i < data.length; i++) {
		if (data[i].name == name && data[i].password == password) {
			loadAcc(i);
			return true;
		}	
	}
	return false;
}
function loginAttempt() {
	const loginFormInput = document.getElementById("loginForm").getElementsByTagName("input");
	const loginErr = document.getElementById("loginErr");
	if (loginFormInput[0].value == "")
		loginErr.innerHTML = "Error: No username input";
	else if (loginFormInput[1].value == "")
		loginErr.innerHTML = "Error: No password input";
	else if (!login(loginFormInput[0].value,loginFormInput[1].value))
		loginErr.innerHTML = "Error: Invalid username and/or password";
	else {
		loginErr.innerHTML = "";
		popupDisplay(0);
	}
	
}
function saveAcc(name,password) {
	let buildingNames = ["Employee","Manager","Jess","FoodTruck","BuddDairy","Restaurant","Advertisement",
		"Factory","ShippingContainer","Wegenerist","Portal","TimeMachine","CloningMachine","WegenerLove"];
	const sendData = document.getElementById("sendData");
	let sendDataInput = sendData.getElementsByTagName("input");
  while (sendDataInput.length > 0)
      sendDataInput[0].remove();
	let allInputs = [];
	allInputs.push(document.createElement("input"));
	allInputs[0].setAttribute("name","name");
	allInputs[0].setAttribute("value",name);
	allInputs.push(document.createElement("input"));
	allInputs[1].setAttribute("name","password");
	allInputs[1].setAttribute("value",password);
	allInputs.push(document.createElement("input"));
	allInputs[2].setAttribute("name","cubanoCt");
	allInputs[2].setAttribute("value",cubanoCt);
  allInputs.push(document.createElement("input"));
	allInputs[3].setAttribute("name","creationDate");
	allInputs[3].setAttribute("value",accCreationDate);  
	buildingNames.forEach(buildingName => {
		allInputs.push(document.createElement("input"));
		allInputs[allInputs.length - 1].setAttribute("name",buildingName);
		allInputs[allInputs.length - 1].setAttribute("value",itemsOwned[allInputs.length - 5]);
	});
	allInputs.forEach( sendInput => {
		sendData.appendChild(sendInput);
	});
	
	const docUrl = "https://script.google.com/macros/s/AKfycby2zoWnm5Jmd9EL7LbFnkIQVdJnLDZVI-ifNiomH6rj_OkhKy2JqF52D8T0TkUF5qdROQ/exec";
	
    $.ajax({
		url: docUrl,
		method: "POST",
		dataType: "json",
		data: $("#sendData").serialize(),
		success: function(response) {
			if(response.result == "success") {
				return true;
			}
			else {
				console.log(response.error);
			}
		},
		error: function() {
			console.log("Error");
		}
	})
}
function createAccAttempt() {
	const loginFormInput = document.getElementById("loginForm").getElementsByTagName("input");
	const loginErr = document.getElementById("loginErr");
	if (loginFormInput[0].value == "")
		loginErr.innerHTML = "Error: No username input";
	else if (loginFormInput[1].value == "")
		loginErr.innerHTML = "Error: No password input";
	else {
		let availableName = loginFormInput[0] != "User";
		data.forEach(player => {
			if (player.name == loginFormInput[0].value) availableName = false;
		});
		
		if (!availableName) loginErr.innerHTML = "Error: Username unavailable";
		else {
			accName = loginFormInput[0].value;
      accPassword = loginFormInput[1].value;
      accCreationDate = new Date();
			saveAcc(accName,accPassword);
			data.push({name : accName, cubanoCt : cubanoCt});
			const companyName = document.getElementById("companyName");
			companyName.innerHTML = accName + "'s Havana Café";
			const settingsDropdown = document.getElementById("settingsDropdown");
			const save = settingsDropdown.getElementsByTagName("li")[0];
			save.innerHTML = "Save";
			save.setAttribute("onclick","saveAcc(accName,accPassword)");
			loginErr.innerHTML = "";
			popupDisplay(0);
		}
	}
}
function sortPlayers() {
	for (i = 0; i < data.length - 1; i++) {
		let max = 0;
		let maxIdx = 0;
		for (j = i; j < data.length; j++) {
			if (parseInt(data[j].cubanoCt) > max) {
				max = parseInt(data[j].cubanoCt);
				maxIdx = j;
			}
		}
		let store = data[i];
		data[i] = data[maxIdx];
		data[maxIdx] = store;
	}
	
}
function leaderboardGen() {
	sortPlayers();
	let players = document.getElementsByClassName("player");
	while (players.length > 0)
		players[0].remove();
	const playerList = document.getElementById("playerList");
	let rankCt = 1;
	data.forEach(player => {
		const playerDiv = document.createElement("div");
		playerDiv.classList.add("player");
		const rank = document.createElement("div");
		rank.classList.add("rank");
		rank.innerHTML = rankCt++;
		const userInfo = document.createElement("div");
		userInfo.classList.add("userInfo");
		const username = document.createElement("div");
		username.classList.add("username");
		username.innerHTML = player.name;
		const usersCubanos = document.createElement("div");
		usersCubanos.classList.add("usersCubanos");
		usersCubanos.innerHTML = numberName(player.cubanoCt) + " Cubanos";
		userInfo.appendChild(username);
		userInfo.appendChild(usersCubanos);
		playerDiv.appendChild(rank);
		playerDiv.appendChild(userInfo);
		playerList.appendChild(playerDiv);
		
	});
}
function popupDisplay(idx) {
	//popup indeces {0 : leaderboard, 1 : login/create acc}
	const hideScreen = document.getElementById("hideScreen");
	const popup = document.getElementById("popup");
	const popupTitle = document.getElementById("popupTitle");
	const playerList = document.getElementById("playerList");
	const loginForm = document.getElementById("loginForm");
	if (hideScreen.style.display == "block") {
		hideScreen.style.display = "none";
		popup.style.display = "none";
		playerList.style.display = "none";
		loginForm.style.display = "none";
	} else {
		hideScreen.style.display = "block";
		popup.style.display = "block";
		if (idx == 0) {
			leaderboardGen();
			playerList.style.display = "block";
			popupTitle.innerHTML = "Top Players Leaderboard";
		} else if (idx == 1) {
			loginForm.style.display = "block";
			popupTitle.innerHTML = "Login/Create Account";
		}
	}
}
var sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHbZmxhvbIP30qkIuO4O5KeQaVFtDMul1DRLMuT4fi_0Jlkxlh6jAoLATtIrXMrzJg4x4lq_8kIGZu/pub?output=csv";
Papa.parse(sheetUrl, {
  download: true,
  header: true,
  complete: function(results) {data = results.data;}

});
