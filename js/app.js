
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
let comparisonTable = []
let filtered = []
// Nombre de Pokemon à comparer
let nbComparison = 4
let nbPokemonBase = 60
let nbPokemon = 151

const closeModale = document.querySelector(".modale__close")
const modale = document.querySelector(".modale")
const comparisonList = document.querySelector(".comparison__list")

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
				createCards(pokemonBase, nbPokemonBase)
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
			displayComparisonList()            
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
	targetCard.children[1].src = imgPoke
}


// COMPARAISON

// (Dé-)sélection d'un pokemon à comparer
function selectCardComparison(e) {

	let targetCard = e.target
	const idCard = targetCard.getAttribute("id")

	if(!targetCard.classList.contains("selected") && comparisonTable.length <= nbComparison) {
		comparisonTable.push(idCard)
		createCardComparisonList(idCard-1)
		targetCard.classList.add("selected")
	} else {
		arrayRemove(idCard)
		removeCardComparisonList(idCard-1)
		targetCard.classList.remove("selected")
	}      
}

// Enlever l'id du pokemon sélectionné du tableau des comparaison
function arrayRemove(pokeId) {
    filtered = comparisonTable.filter(elem => elem != pokeId)
    comparisonTable = filtered
}

// Ajouter un eventlistener sur le bouton pour comparer
const buttonCompare = document.querySelector(".btn_comparison")
buttonCompare.addEventListener("click", (e) => {
    if (comparisonTable.length > 1) {
        createComparisonTable()
    } else {
        modale.classList.add("is-active")
		positionModale(modale)
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

	let comparisonElementTable = document.createElement("table")
	comparisonElementTable.classList.add("comparison_table")

	let comparisonTitle = document.createElement("tr")
	let comparisonHead = document.createElement("th")
	comparisonHead.setAttribute("colspan", comparisonTable.length+1)
	comparisonHead.innerText = "Comparatif"
	comparisonTitle.append(comparisonHead)
	comparisonElementTable.append(comparisonTitle)


	comparisonElementTable = createRowComparisonTable(comparisonElementTable, "", "comparaison_pokemon", "name")
	comparisonElementTable = createRowImageComparisonTable(comparisonElementTable, "", "comparaison_image", "imgFront")
	comparisonElementTable = createRowComparisonTable(comparisonElementTable, "Type", "comparaison_title", "type")
	comparisonElementTable = createRowComparisonTable(comparisonElementTable, "XP", "comparaison_title", "xp")
	comparisonElementTable = createRowComparisonTable(comparisonElementTable, "Weight", "comparaison_title", "weight")
	comparisonElementTable = createRowComparisonTable(comparisonElementTable, "Height", "comparaison_title", "height")
	comparisonElementTable = createRowImageComparisonTable(comparisonElementTable, "", "comparaison_image", "imgBack")
	
	comparisonDiv.append(closeImage, comparisonElementTable)

	const body = document.body
	body.prepend(comparisonDiv)
	return comparisonDiv
}


// Création de chaque ligne avec les caractéristiques
function createRowComparisonTable(comparisonElementTable, titleRow, classRow, objet) {
	
	const rowTable = document.createElement("tr")
	rowTable.classList.add(classRow)
	let rowData = document.createElement("td")
	rowData.innerText = titleRow
	rowTable.append(rowData)
	for (let i = 0; i < comparisonTable.length; i++) {
		rowData = document.createElement("td")
		rowData.innerText = pokemonBase[comparisonTable[i]-1][objet]
		rowTable.append(rowData)
	}
	comparisonElementTable.appendChild(rowTable)
	return comparisonElementTable
}


// Création de la ligne avec l'image
function createRowImageComparisonTable(comparisonElementTable, titleRow, classRow, objet) {
	
	const rowTable = document.createElement("tr")
	rowTable.classList.add(classRow)
	let rowData = document.createElement("td")
	rowData.innerText = titleRow
	rowTable.append(rowData)

	for (let i = 0; i < comparisonTable.length; i++) {
		let rowData = document.createElement("td")
		let rowImg = document.createElement("img")
		rowImg.classList.add("comparison-img")
		rowImg.src = pokemonBase[comparisonTable[i]-1][objet]		
		rowData.append(rowImg)
		rowTable.append(rowData)
	}

	comparisonElementTable.appendChild(rowTable)
	return comparisonElementTable
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
    }
	eventPokeCard()
})



// ACTIVE/DESACTIVE LE SCROLL QUAND LA MODALE EST OUVERTE
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
let keys = {37: 1, 38: 1, 39: 1, 40: 1, 34: 1, 33: 1, 32: 1, 36: 1};

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


// RESET COMPARATIF
const resetBtn = document.querySelector(".reset")
resetBtn.addEventListener("click", (e) => {
	comparisonTable = []
	const pokeCards = document.querySelectorAll(".poke__card")
	pokeCards.forEach(card => {
		if(card.classList.contains("selected")) {
			card.classList.remove("selected")
		}
	})
	deleteCardComparisonList()
	displayComparisonList()
})




// COMPARISON LIST
function createCardComparisonList(pokeId) {
	
	const listCard = document.createElement("div")
	listCard.classList.add("list__card")
	listCard.setAttribute("id", pokeId)

	const pokeName = document.createElement("p")
	pokeName.innerText = pokemonBase[pokeId].name

	const pokeImg = document.createElement("img")
	pokeImg.src = pokemonBase[pokeId].imgFront


	listCard.append(pokeName, pokeImg)
	
	comparisonList.append(listCard)	
}

function removeCardComparisonList(pokeId) {
	const listCards = Array.from(document.querySelectorAll(".list__card"))
	listCards.forEach(card => {
		if(card.id == pokeId) {
			comparisonList.removeChild(card)	
		}		
	});
}

function deleteCardComparisonList() {
	const listCards = Array.from(document.querySelectorAll(".list__card"))

	listCards.forEach(card => {
			comparisonList.removeChild(card)	
	})
}


function displayComparisonList() {
	comparisonTable.length === 0 ? comparisonList.style.display = "none" : comparisonList.style.display = "flex"
}
