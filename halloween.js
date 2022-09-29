// Page Name
let path = window.location.pathname;
let page = path.split('/').pop();
console.log(page);

/*
Home page elements ex:

red : [
document.getElementById('navtitle'),
document.getElementById('order-button'),
document.getElementsByClassName('submit')[0]
]

*/

// Get object with all elements needing color change based on page
function pickPage(page) {
	switch(page) {
		case '':
			return {
				red : [
					document.getElementById('navtitle'),
					document.getElementById('left').querySelector('a') // Why?
				],
				backgroundRed : [
					document.getElementById('orderButton'),
					document.getElementsByClassName('submit')[0],
					document.getElementById('redDiv')
				],
				blue : [
					document.getElementsByClassName('icon')[0],
					document.getElementById('hours').querySelector('h2'),
					document.getElementById('isOpen'),
					document.getElementById('mon-fri'),
					document.getElementById('sat'),
					document.getElementById('sun'),
					document.getElementById('form').querySelector('div'),
					document.getElementById('left').getElementsByTagName('a')[1],
					document.getElementById('right').getElementsByTagName('a')[0]
					],
				backgroundBlue : [
				],
				borderBlue : [
					document.getElementById('left'),
					document.getElementById('right')
				],
				darkblue : [
					
				],
				backgroundDarkblue : [
					document.getElementById('slideshow')
				],
				backgroundWhite : [
					document.getElementById('navbar'),
					document.getElementById('caption'),
					document.getElementsByClassName('caption-container')[0],
					document.getElementById('name'),
					document.getElementById('email'),
					document.getElementById('subject'),
					document.getElementsByClassName('question')[0],
					document.getElementById('mobileBar')
				]
			}
		case 'menu':
			return {
				red : [
					//document.getElementById('navtitle')
				],
				backgroundRed : [
					//document.getElementById('orderButton')
				],
				blue : [
					//document.getElementsByClassName('icon')[0],
					//document.getElementById('left').getElementsByTagName('a')[1],
					//document.getElementById('right').getElementsByTagName('a')[0]
					],
				backgroundBlue : [
				
				],
				darkblue : [

				],
				backgroundDarkblue : [
					
				],
				backgroundWhite : [
					
				]
			}
		case 'about-us':
			return {
				red : [

				],
				backgroundRed : [

				],
				blue : [

					],
				backgroundBlue : [
				
				],
				darkblue : [

				],
				backgroundDarkblue : [
					
				],
				backgroundWhite : [
				
				]
			}
	}
			
}


// Constants
let orange = '#fc4605';
let grey = "#808080";
let black = 'black';


// Update array of elements to new colors
function changeColor(page) {
	let pageElements = pickPage(page);

	document.getElementById('home').style.background = 'grey';
	
	pageElements.red.forEach((element) => 
						 element.style.color = orange);
	pageElements.backgroundRed.forEach((element) => 
						 element.style.background = orange);
	pageElements.blue.forEach((element) => 
						 element.style.color = black);
	pageElements.backgroundBlue.forEach((element) => 
						 element.style.background = black);
	pageElements.borderBlue.forEach((element) => 
						 element.style.borderBottom = "2px solid black");
	pageElements.darkblue.forEach((element) => 
						 element.style.color = black);
	pageElements.backgroundDarkblue.forEach((element) => 
						 element.style.background = black);
	pageElements.backgroundWhite.forEach((element) => 
						 element.style.background = grey);
}

// Update background pictures to new pictures
//function changeBackground(page) {
//	switch(page) {
//		case '':
//			document.getElementById('home-background').style.backgroundImage = 'url("./images/HalloweenBackground.png")';
//			break;
//		default:
//			break;
//	}
//}





changeColor(page);
changeBackground(page);