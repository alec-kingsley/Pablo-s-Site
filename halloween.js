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
					document.getElementsByClassName('submit')[0]
				],
				blue : [
					document.getElementsByClassName('icon')[0],
					document.getElementById('hours').querySelector('h2'),
					document.getElementById('isOpen'),
					document.getElementById('mon-fri'),
					document.getElementById('sat'),
					document.getElementById('sun'),
					document.getElementById('form').querySelector('div')
					],
				backgroundBlue : [
				],
				darkblue : [
					
				],
				backgroundDarkblue : [
					document.getElementById('slideshow')
				]
			}
			break;
		case 'menu':
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
					
				]
			}
			break;
		case 'home':
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

	document.getElementById('home').style.background = 'rgba(255, 255, 255, 0)';
	
	pageElements.red.forEach((element) => 
						 element.style.color = orange);
	pageElements.backgroundRed.forEach((element) => 
						 element.style.background = orange);
	pageElements.blue.forEach((element) => 
						 element.style.color = black);
	pageElements.backgroundBlue.forEach((element) => 
						 element.style.background = black);
	pageElements.darkblue.forEach((element) => 
						 element.style.color = black);
	pageElements.backgroundDarkblue.forEach((element) => 
						 element.style.background = black);
}

// Update background pictures to new pictures






changeColor(page);