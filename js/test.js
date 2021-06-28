
/* Variables */
const typesColors = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};


const types = [
	"grass",
	"ground",
	"dragon",
	"fire",
	"electric",
	"fairy",
	"poison",
	"bug",
	"water",
	"normal",
	"psychic",
	"flying",
	"fighting",
	"rock",
	"ghost",
	"ice"
]
let container = ""
let title = ""
let indexCards = 0
let pokemonBase = []
let pokemonFilter = []
// Nombre de Pokemon à comparer
let nbComparison = 4
let nbPokemon = 151

const closeModale = document.querySelector(".modale__close")
const modale = document.querySelector(".modale")

const urlPokemon = "https://pokeapi.co/api/v2/pokemon/"
const urlType = "https://pokeapi.co/api/v2/type/"


function fetchPokemonBase(){
	for (i = 1; i < nbPokemon+1 ; i++) {
		addInfoPokemon(i)
	}
}

fetchPokemonBase()

function addInfoPokemon(i) {
	let buffer = {}
    
	url = `https://pokeapi.co/api/v2/pokemon/${i}/`
	fetch(url)
	.then(reponse => reponse.json())
	.then(data => {
			buffer.id= data.id
			buffer.name= data.name
			buffer.xp= data.base_experience
			buffer.height= data.height
			buffer.weight= data.weight
			buffer.type= data.types[0].type.name
			buffer.imgFront= data.sprites.front_default
			buffer.imgBack= data.sprites.back_default
			pokemonBase.push(buffer)

			if(pokemonBase.length === nbPokemon) {
				sortArrayById(pokemonBase)
				createContainerCards()
				createCards(pokemonBase, 50)
				eventPokeCard()
			}
		}
	)
	.catch(function(error){
		console.log("Probleme " + error.message)
	})
}

// Fonction pour trier les pokémon selon leur id (ascendant)
function sortArrayById (array) {
	pokemonBase = array.sort((a,b) => {
		return a.id - b.id;
	});
}

function createContainerCards() {
	container = document.createElement("div")
	container.classList.add("container__cards")
	title = document.querySelector(".title")
	title.after(container)
}

// Création de la carte du pokemon
function createCards (pokemonBase, nb) {

	if(!document.querySelector(".container__cards")) {
		createContainerCards()
	} 

	for (let i = 0; i < nb; i++) {
		// On stocke la couleur correspondante au type
		const colorType = typesColors[pokemonBase[indexCards].type]

		// Création de la div poke__card englobante
		let pokeCard = document.createElement("div")
		pokeCard.classList.add("poke__card")
		pokeCard.setAttribute("id", pokemonBase[indexCards].id)
		pokeCard.style.backgroundColor = colorType
		
		// Création du titre avec le nom du pokémon
		let pokeName = document.createElement("h3")
		pokeName.innerText = pokemonBase[indexCards].name

		// Création de l'image avec l'image du pokémon
		let pokeImg = document.createElement("img")
		pokeImg.src = pokemonBase[indexCards].imgFront
		
		/// Création du p contenant le type du pokémon
		let pokeType = document.createElement("p")
		pokeType.innerText = pokemonBase[indexCards].type
		pokeType.style.backgroundColor = colorType
		pokeType.classList.add("type")
		
		/// Création du p contenant l'ID du pokémon
		let pokeId = document.createElement("p")
		pokeId.classList.add("id")
		pokeId.innerText = pokemonBase[indexCards].id
		pokeId.style.backgroundColor = colorType

		// On attache tous les éléments à la poke__card et puis au container
		pokeCard.append(pokeName, pokeImg, pokeType, pokeId)

		container.append(pokeCard)
		indexCards++
	}
}


// Fonction pour ajouter les eventListener sur chaque card pour afficher l'arrière du Pokemon quand on passe dessus
function eventPokeCard() {
	const pokeCard = Array.from(document.querySelectorAll(".poke__card"))
	pokeCard.forEach(card => {
		card.addEventListener("mouseover", (e) => {
			changeImgCard(e, "imgBack")
		})

		card.addEventListener("mouseleave", (e) => {
			changeImgCard(e, "imgFront")
		})

        card.addEventListener("click", (e) => {
            selectCardComparison(e)            
		})  
	});	

}


// Fonction pour changer l'image du Pokémon (avant/arrière) 
// e = la carte ciblée provenant du eventListener
// imgSide = imgBack || imgFront : permettant d'accéder à l'image dans l'objet
function changeImgCard (e, imgSide) {
	let targetCard = e.target
	const idCard = targetCard.getAttribute("id")
	const imgPoke = pokemonBase[idCard-1][imgSide]
	// console.log(pokemonBase[idCard-1])
	targetCard.children[1].src = imgPoke
}


// COMPARAISON
let comparisonList = []

// (Dé-)sélection d'un pokemon à comparer
function selectCardComparison(e) {

	let targetCard = e.target
	const idCard = targetCard.getAttribute("id")

	if(!targetCard.classList.contains("selected") && comparisonList.length <= nbComparison) {
		comparisonList.push(idCard)
		targetCard.classList.add("selected")
	} else {
		arrayRemove(idCard)
		targetCard.classList.remove("selected")
	}      
}

// Enlever l'id du pokemon sélectionné du tableau des comparaison
function arrayRemove(pokeId) {
    var filtered = comparisonList.filter(elem => elem != pokeId)
    comparisonList = filtered
}

// Ajouter un eventlistener sur le bouton pour comparer
const buttonCompare = document.querySelector(".btn_comparison")
buttonCompare.addEventListener("click", (e) => {
    if (comparisonList.length > 1) {
        createComparisonTable()
    } else {
        modale.classList.add("is-active")
		disableScroll()
		setPointerEvents("none")
    }
})


// Fermeture modale
closeModale.addEventListener("click", (e) => {
	modale.classList.remove("is-active")
	enableScroll()
	setPointerEvents("unset")
})


function setPointerEvents(set) {
	console.log("setPointerEvents")
	container.style.pointerEvents = set
	title.style.pointerEvents = set
}

// Créer le tableau de comparaison
async function createComparisonTable() {
	const comparisonTable = await createElements()
	await closeComparisonEvent(comparisonTable)
	setPointerEvents("none")
	positionModale(comparisonTable)
	disableScroll()
}

//  Supprime le tableau de comparaison
async function closeComparisonEvent(comparisonTable){
	const body = document.body
	const closeComparison = document.querySelector(".comparison__close")
	closeComparison.addEventListener("click", (e) => {
		body.removeChild(comparisonTable)
		setPointerEvents("unset")
		enableScroll()
	})
}


function positionModale(modale) {
	let {scrollTop} = document.documentElement;
	
	scrollTop += 50

	modale.style.top = `${scrollTop}px`
}


// Fonction qui créée tout le tableau de comparaison
async function createElements() {
	
	const comparisonDiv = document.createElement("div")
	comparisonDiv.classList.add("comparison")

	const closeImage = document.createElement("img")
	closeImage.src = "./images/close-outline.svg"
	closeImage.classList.add("comparison__close")

	let comparisonTable = document.createElement("table")
	comparisonTable.classList.add("comparison_table")

	let comparisonTitle = document.createElement("tr")
	let comparisonHead = document.createElement("th")
	comparisonHead.setAttribute("colspan", comparisonList.length+1)
	comparisonHead.innerText = "Comparatif"
	comparisonTitle.append(comparisonHead)
	comparisonTable.append(comparisonTitle)


	comparisonTable = createRowComparisonTable(comparisonTable, "", "comparaison_pokemon", "name")
	comparisonTable = createRowImageComparisonTable(comparisonTable, "", "comparaison_image", "imgFront")
	comparisonTable = createRowComparisonTable(comparisonTable, "Type", "comparaison_title", "type")
	comparisonTable = createRowComparisonTable(comparisonTable, "XP", "comparaison_title", "xp")
	comparisonTable = createRowComparisonTable(comparisonTable, "Weight", "comparaison_title", "weight")
	comparisonTable = createRowComparisonTable(comparisonTable, "Height", "comparaison_title", "height")
	comparisonTable = createRowImageComparisonTable(comparisonTable, "", "comparaison_image", "imgBack")
	
	comparisonDiv.append(closeImage, comparisonTable)

	const body = document.body
	body.prepend(comparisonDiv)
	return comparisonDiv
}


// Création de chaque ligne avec les caractéristiques
function createRowComparisonTable(comparisonTable, titleRow, classRow, objet) {
	
	const rowTable = document.createElement("tr")
	rowTable.classList.add(classRow)
	let rowData = document.createElement("td")
	rowData.innerText = titleRow
	rowTable.append(rowData)

	for (let i = 0; i < comparisonList.length; i++) {
		rowData = document.createElement("td")
		rowData.innerText = pokemonBase[comparisonList[i]-1][objet]		
		rowTable.append(rowData)
	}
	
	comparisonTable.appendChild(rowTable)
	return comparisonTable
}


// Création de la ligne avec l'image
function createRowImageComparisonTable(comparisonTable, titleRow, classRow, objet) {
	
	const rowTable = document.createElement("tr")
	rowTable.classList.add(classRow)
	let rowData = document.createElement("td")
	rowData.innerText = titleRow
	rowTable.append(rowData)

	for (let i = 0; i < comparisonList.length; i++) {
		let rowData = document.createElement("td")
		let rowImg = document.createElement("img")
		rowImg.src = pokemonBase[comparisonList[i]-1][objet]		
		rowData.append(rowImg)
		rowTable.append(rowData)
	}

	comparisonTable.appendChild(rowTable)
	return comparisonTable
}



// FILTRE
// Fonction pour créer le champ avec le filtre des types
function createFilter() {
	createFilterElement()
	createEventFilter()
}

// Fonction qui va créer tous les éléments qui constitue le filre
function createFilterElement() {
	
	const filterDiv = document.createElement("div")
	filterDiv.classList.add("comparison__choice")

	const filterLabel = document.createElement("label")
	filterLabel.innerText = "Sélectionnez le type de Pokémon à filtrer"

	const filterSelect = document.createElement("select")
	filterSelect.setAttribute("name","type")
	filterSelect.setAttribute("id","type")
	
	const filterOption = document.createElement("option")
		filterOption.setAttribute("value", "")
		filterOption.innerText = "--Choisissez un type--"

	filterSelect.append(filterOption)

	types.forEach(type => {
		const filterOption = document.createElement("option")
		filterOption.setAttribute("value", type)
		filterOption.innerText = type
		filterSelect.append(filterOption)
	});

	filterDiv.append(filterLabel, filterSelect)
	const formFilter = document.querySelector(".comparison__form")
	formFilter.append(filterDiv)
}

// Fonction qui va créer l'événement
function createEventFilter() {	
	const typeSelection = document.querySelector("#type")
	
	typeSelection.addEventListener("change", (e) => {
		filterCards(e.target.value)
	})
}

createFilter()


// Fonction qui créée les cartes filtrées
function filterCards (pokemonType) {
	const type = pokemonType;
	let filtered = []

	if(pokemonType == "") {
		filtered = pokemonBase
	} else {
		filtered = pokemonBase.filter(pokemon => pokemon.type == type)
	}

	const body = document.body
	const closeComparison = document.querySelector(".container__cards")
	body.removeChild(closeComparison)
	console.log("filter")
	indexCards = 0
	createCards(filtered, filtered.length)
	eventPokeCard()
}


// SCROLL INFINI
// Lorsque la fenêtre s'ouvre, on va exécuter les différentes fonctions dans loadElements
// window.onload = loadElements();


window.addEventListener("scroll", () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if (clientHeight + scrollTop >= scrollHeight - 50 && indexCards < nbPokemon) {
        createCards(pokemonBase, 15)
		eventPokeCard()
    }
})



// ACTIVE/DESACTIVE LE SCROLL QUAND LA MODALE EST OUVERTE
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
let keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


// RESET