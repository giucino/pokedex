let allPokemon = [];
let pokemons = [];
let types = [];
let searchedPokemon = [];
// let favoritePokemon = [];
let offset = 0;
let currentPokemon = null; // Variable zur Aufbewahrung des aktuell geöffneten Pokémon
let currentArray = pokemons; // Aktuelles Array, standardmäßig auf das "pokemons" Array gesetzt
const limit = 50;
const pokemonTypes = ["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"];

/*===============================HAUPTFUNKTIONEN ZUM ABRUFEN UND RENDERN===============================*/
// Initialisierung
async function initializeApp() {
    await loadPokemon();
    await renderPokemon();
    renderTypeButton();
    addSearchEventListener();
}


// Pokemon API-Abfrage
async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=999';
    let response = await fetch(url);
    let data = await response.json();
    allPokemon = data.results;
}


// Rendert Pokémon basierend auf Limit und Offset, fügt Event Listener hinzu
async function renderPokemon() {
    let content = document.getElementById("pokedex");
    // content.innerHTML = "";
    let renderedPokemonCount = 0;


    while (renderedPokemonCount < limit && offset < allPokemon.length) {
        let pokemon = allPokemon[offset];
        let response = await fetch(pokemon.url);
        let pokemonData = await response.json();

        if (!pokemons.find(p => p.id === pokemonData.id)) {
            pokemons.push(pokemonData);
            content.innerHTML += generatePokemonCardTemplate(pokemonData, offset);
            generatePokemonTypeClass(pokemonData, offset);
            renderedPokemonCount++;
        }
        offset++;
    }
    addPokemonCardListeners(searchedPokemon, types, pokemons);
}


//Pokemon-ID im gewünschten Format darstellen
function formattedPokemonNumber(number) {
    let formattedNumber = `#${number.toString().padStart(3, '0')}`;
    return formattedNumber;
}


/*===============================FUNKTIONEN ZUR TYP-FILTERUNG===============================*/
// Lädt Pokémon des angegebenen Typs aus der API und rendert sie.
async function loadPokemonByType(type) {
    let response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    let typeData = await response.json();
    let pokemonData = typeData.pokemon.map(async (pokemonObj) => {
        let res = await fetch(pokemonObj.pokemon.url);
        return await res.json();
    });
    let pokemon = await Promise.all(pokemonData);
    let filteredPokemon = filterPokemonByType(pokemon, type);
    let filteredPokemonBelow999 = filteredPokemon.filter(pokemon => pokemon.id <= 999);
    types = filteredPokemonBelow999;
    renderPokemonByType();
}


// Filtert eine Liste von Pokémon nach dem ausgewählten Typ.
function filterPokemonByType(pokemonList, type) {
    // Verwenden der filter-Methode, um nur Pokemon-Objekte zurückzugeben, die den angegebenen Typ haben
    return pokemonList.filter((pokemon) => {
        // Überprüfen, ob das Pokemon einen Typ hat
        if (pokemon.types) {
            // Überprüfen, ob der erste Typ des Pokemon-Objekts mit dem angegebenen Typ übereinstimmt
            return pokemon.types[0].type.name === type;
        }
        // Wenn das Pokemon keinen Typ hat, wird es ausgelassen
        return false;
    });
}


// Funktion zum Rendern der verschiedenen Pokémon-Typen
function renderPokemonByType() {
    let content = document.getElementById("pokedex");
    content.innerHTML = "";

    types.forEach((pokemon, index) => {
        content.innerHTML += generatePokemonCardTemplate(pokemon, index);
        generatePokemonTypeClass(pokemon, index);
    });
    addPokemonCardListeners(searchedPokemon, types, pokemons);
    document.removeEventListener('scroll', handleScroll);
    document.body.style.overflow = "";
}


// Setzt das Pokedex zurück
async function loadAllPokemon() {
    offset = 0;
    pokemons = [];
    types = []; // Leeres Array, um die gefilterten Pokémon zu entfernen
    document.getElementById("pokedex").innerHTML = "";
    renderPokemon();
}


// Generiert und fügt die Typ-Buttons dem Pokedex hinzu.
function renderTypeButton() {
    let content = document.getElementById('select');
    let allTypesCard = generateAllTypesButton();
    let typeCards = generateTypeButton();

    content.innerHTML = allTypesCard + typeCards;
    addClickForTypeCards();
}


// Filtert die Pokemon nach Typ und lädt entsprechende Pokemon-Daten.
async function handleFilter(event) {
    let type = event.currentTarget.getAttribute('data-type');

    // Überprüfen, ob das Dropdown-Menü geschlossen ist und die Bildschirmbreite unter 501px liegt
    if (window.innerWidth < 501 && !isDropdownExpanded()) {
        // Dropdown-Menü ausklappen
        let dropdown = document.getElementById('select');
        dropdown.style.display = 'grid';

        // Event Listener hinzufügen, um das Dropdown-Menü beim Klicken außerhalb zu schließen
        window.addEventListener('click', closeDropdownOutsideClick);
    }

    if (type === "all") {
        loadAllPokemon();
        document.addEventListener('scroll', handleScroll);
    } else {
        await loadPokemonByType(type);
        document.removeEventListener('scroll', handleScroll);
    }

    // Schließe das Dropdown-Menü bei einer Bildschirmbreite von unter 501px, außer wenn der Dropdown-Button erneut geklickt wird
    if (window.innerWidth < 501 && !event.target.classList.contains('dropdown-btn')) {
        closeDropdown();
    }
}


/*===============================SUCHFUNKTION===============================*/
// Hilfsfunktion zum Abrufen der vollständigen Pokémon-Daten für die Suchfunktion
async function getPokemonDetails(url) {
    let response = await fetch(url);
    let pokemonData = await response.json();
    return pokemonData;
}


// Sucht nach übereinstimmenden Pokémon anhand des Suchwerts.
async function searchPokemons(searchValue) {
    let matchingPokemon = [];

    for (let i = 0; i < allPokemon.length; i++) {
        let pokemon = allPokemon[i];
        let pokemonData = await getPokemonDetails(pokemon.url);

        if (isPokemonMatchingSearch(pokemonData, searchValue)) {
            matchingPokemon.push(pokemonData);
        }
    }
    return matchingPokemon;
}


// Hilfsfunktion zur Überprüfung, ob ein Pokémon den Suchkriterien entspricht
function isPokemonMatchingSearch(pokemon, searchValue) {
    let pokemonId = pokemon.id.toString();
    let pokemonName = pokemon.name.toLowerCase();

    if (searchValue.length === 1) {
        let firstCharacter = searchValue.toLowerCase();

        // Überprüfe, ob der Anfangsbuchstabe übereinstimmt
        return (
            pokemonName.startsWith(firstCharacter) ||
            pokemonId.startsWith(firstCharacter)
        );
    } else {
        // Überprüfe, ob die Suche an einer bestimmten Position im Namen oder in der ID vorkommt
        return (
            pokemonId.indexOf(searchValue) === 0 || // Überprüfe die ID am Anfang
            pokemonName.indexOf(searchValue) === 0  // Überprüfe den Namen am Anfang
        );
    }
}


// Fügt dem Suchfeld und dem Zurücksetzen-Button Eventlistener hinzu.
function addSearchEventListener() {
    let searchInput = document.getElementById("search-input");
    let resetButton = document.getElementById("reset-search");

    searchInput.addEventListener("input", async () => {
        let searchValue = searchInput.value.trim().toLowerCase();
        if (searchValue !== "") {
            resetButton.style.display = "block";
            searchedPokemon = await searchPokemons(searchValue);
            renderSearchedPokemon();
        } else {
            resetButton.style.display = "none";
            searchedPokemon = [];
            renderSearchedPokemon();
        }
    });
}


// Setzt Suchergebnisse zurück und rendert das Pokedex neu
function handleResetButtonClick() {
    searchedPokemon = [];
    pokemons = [];
    offset = 0;
    document.getElementById("pokedex").innerHTML = "";
    renderPokemon();
    document.getElementById("search-input").value = "";
    resetButton.style.display = "none";
    document.addEventListener('scroll', handleScroll);
}

let resetButton = document.getElementById("reset-search");
resetButton.addEventListener("click", handleResetButtonClick);


// Funktion zum Rendern der gesuchten Pokémon
function renderSearchedPokemon() {
    let content = document.getElementById("pokedex");
    content.innerHTML = "";

    for (let i = 0; i < searchedPokemon.length; i++) {
        let pokemon = searchedPokemon[i];
        content.innerHTML += generatePokemonCardTemplate(pokemon, i);
        generatePokemonTypeClass(pokemon, i);
    }
    addPokemonCardListeners(searchedPokemon, types, pokemons);
    document.removeEventListener('scroll', handleScroll);
}


/*===============================RESPONSIVE MENU-BUTTON===============================*/
// Funktion zum ein- und ausblenden des Responsive-Menu
function toggleMenu() {
    let menuItems = document.getElementById("menu-items");
    let toggleButton = document.getElementById("toggle-button");
    let overlay = document.getElementById("overlay");

    if (menuItems.style.display === "" || menuItems.style.display === "none") {
        menuItems.style.display = "block";
        toggleButton.innerText = "X";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        document.body.style.overflow = "hidden";
    } else {
        menuItems.style.display = "none";
        toggleButton.innerText = "+";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        document.body.style.overflow = "";
    }
}


/*===============================FUNKTIONEN FÜR DROPDOWN===============================*/
// Überprüfen, ob das Dropdown-Menü ausgeklappt ist
function isDropdownExpanded() {
    let dropdown = document.getElementById('select');
    return dropdown.style.display === 'grid';
}


// Schließe das Dropdown-Menü
function closeDropdown() {
    let dropdown = document.getElementById('select');
    dropdown.style.display = 'none';
}


// Funktion zum Schließen des Dropdown-Menüs beim Klicken außerhalb
function closeDropdownOutsideClick(event) {
    let dropdown = document.getElementById('select');
    if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
        closeDropdown();

        // Event Listener zum Schließen des Dropdown-Menüs beim Klicken außerhalb entfernen
        window.removeEventListener('click', closeDropdownOutsideClick);
        document.body.style.overflow = "";
    }
}


// Funktion zum Behandeln des Klicks auf den Dropdown-Button
function handleDropdownBtnClick(event) {
    // Überprüfen, ob das Dropdown-Menü bereits ausgeklappt ist
    if (isDropdownExpanded()) {
        // Dropdown-Menü schließen
        closeDropdown();
        // Event Listener zum Schließen des Dropdown-Menüs beim Klicken außerhalb entfernen
        window.removeEventListener('click', closeDropdownOutsideClick);
    } else {
        // Dropdown-Menü ausklappen
        let dropdown = document.getElementById('select');
        dropdown.style.display = 'grid';
        // Event Listener hinzufügen, um das Dropdown-Menü beim Klicken außerhalb zu schließen
        window.addEventListener('click', closeDropdownOutsideClick);
    }
    // Verhindern, dass das Klick-Ereignis weitergegeben wird
    event.stopPropagation();
}

// Event Listener für den Klick auf den Dropdown-Button hinzufügen
let dropdownBtn = document.querySelector('.dropdown-btn');
dropdownBtn.addEventListener('click', handleDropdownBtnClick);


// Klick auf Link aktiviert Dropdown-Menü und Overlay-Element.
function handleAllTypesLinkClick(event) {
    let overlay = document.getElementById("overlay");

    handleDropdownBtnClick(event);
    toggleMenu();
    document.body.style.overflow = "hidden";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
}

// Füge den Event Listener zur Funktion hinzu
let allTypesLink = document.getElementById('allTypesLink');
allTypesLink.addEventListener('click', handleAllTypesLinkClick);



// Event Listener für den Klick auf das HTML-Element <span>Search</span> hinzufügen
function handleSearchLinkClick(event) {
    event.preventDefault(); // Verhindert, dass der Link die Seite neu lädt

    // Springe zum Eingabefeld
    let searchInput = document.getElementById('search-input');
    searchInput.focus();
    toggleMenu();
}

// Füge den Event Listener zur Funktion hinzu
let searchLink = document.getElementById('searchLink');
searchLink.addEventListener('click', handleSearchLinkClick);


/*===============================POKEMON CARD DETAILANSICHT===============================*/
// Öffnet die Detailansicht eines Pokémon
async function openPokemonDetail(pokemon, array) {
    currentPokemon = pokemon;
    currentArray = array;
    let content = document.getElementById('pokemon-details');
    let pokemonClass = pokemon.types[0].type.name;

    removePreviousClass(content);
    addNewClass(content, pokemonClass);
    clearContent(content);

    let pokemonDetails = await getGenus(pokemon.name);
    let detailView = generateDetailView(pokemon, pokemonDetails.genus);

    updateContent(content, detailView);
    displayContent(content);
    arrowListeners();
    getAbilities();
    document.body.style.overflow = "hidden";
    content.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}


// Entfernt alle vorherigen Klassen von einem HTML-Element
function removePreviousClass(content) {
    content.classList.remove(...content.classList);
}


// Fügt einer HTML-Elementklasse eine neue Klasse hinzu.
function addNewClass(content, className) {
    content.classList.add(className);
}


// Leert den Inhalt eines HTML-Elements.
function clearContent(content) {
    content.innerHTML = '';
}


// Aktualisiert den Inhalt eines HTML-Elements.
function updateContent(content, newContent) {
    content.innerHTML = newContent;
}


// Stellt den Inhalt eines Elements dar und aktiviert Hintergrund und Schließen-Funktion.
function displayContent(content) {
    content.style.display = 'flex';
    let background = document.getElementById('background');
    let close = document.getElementById('close');

    if (background && close) {
        background.style.opacity = 1;
        background.addEventListener('click', closeCard);
        close.addEventListener('click', closeCard);
    }
}


// Hinzufügen von Event-Listenern für die Vorwärts- und Rückwärts-Pfeile.
function arrowListeners() {
    document.getElementById('next-arrow').addEventListener('click', showNextPokemon);
    document.getElementById('previous-arrow').addEventListener('click', showPreviousPokemon);
}


// Anzeigen des nächsten Pokémon in der Detailansicht.
function showNextPokemon() {
    let currentIndex = currentArray.findIndex(pokemon => pokemon.id === currentPokemon.id);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= currentArray.length) {
        nextIndex = 0; // Springe zum Anfang des Arrays, wenn das letzte Pokémon erreicht ist
    }

    let nextPokemon = currentArray[nextIndex];
    openPokemonDetail(nextPokemon, currentArray);
}


// Anzeigen des vorherigen Pokémon in der Detailansicht.
function showPreviousPokemon() {
    let currentIndex = currentArray.findIndex(pokemon => pokemon.id === currentPokemon.id);
    let previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
        previousIndex = currentArray.length - 1; // Springe zum Ende des Arrays, wenn das erste Pokémon erreicht ist
    }

    let previousPokemon = currentArray[previousIndex];
    openPokemonDetail(previousPokemon, currentArray);
}


// Schließen der Detailansicht durch Klicken außerhalb des Kartenbereichs.
function closeCard(event) {
    if (event.target.id === "background" || event.target.id === "close") {
        document.getElementById('background').classList.add('d-none');
        document.getElementById('pokemon-details').classList.add('d-none');
        document.body.style.overflow = "";
    }
    document.getElementById('close').removeEventListener('click', closeCard);
    document.getElementById('background').removeEventListener('click', closeCard);
}


/*===============================ZUSÄTZLICHE API ABRUFE FÜR DETAILANSICHT==============================*/
// Fetcht den Genus des Pokémon aus der API
async function getGenus(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
    let response = await fetch(url);

    if (response.status === 404) {
        return { genus: '' };
    }

    let data = await response.json();
    let genus = findGenus(data.genera);

    return {
        genus: genus
    };
}


// Findet den Genus in den Genera-Daten
function findGenus(genera) {
    let genus = '';

    if (genera && genera.length > 0) {
        for (let i = 0; i < genera.length; i++) {
            if (genera[i].language.name === 'en') {
                genus = genera[i].genus;
                break;
            }
        }
    }
    return genus;
}


// Fetcht die Beschreibungstexte des Pokémon aus der API
async function getFlavorTexts(pokemonName) {
    let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
    let speciesResponse = await fetch(speciesUrl);

    if (speciesResponse.status === 404) {
        return { flavorText6: '', flavorText10: '' };
    }

    let speciesData = await speciesResponse.json();
    let flavorTextEntries = speciesData.flavor_text_entries;
    let flavorText6 = findFlavorTextByIndex(flavorTextEntries, 5);
    let flavorText10 = findFlavorTextByIndex(flavorTextEntries, 9);

    return {
        flavorText6: flavorText6,
        flavorText10: flavorText10
    };
}


// Findet den Flavour-Text basierend auf dem Index in den Flavour-Text-Einträgen
function findFlavorTextByIndex(flavorTextEntries, index) {
    let flavorText = '';

    for (let i = 0; i < flavorTextEntries.length; i++) {
        let flavorTextEntry = flavorTextEntries[i];
        if (flavorTextEntry.language.name === 'en' && i === index) {
            return flavorTextEntry.flavor_text;
        }
    }
    return flavorText;
}


// Fetcht die Evolutionskette eines Pokémon aus der API
// async function getPokemonEvolution(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);

//     if (response.status === 404) {
//         return { pokemon: null, evolutionChain: null }; // Setze einen Standardwert, wenn das Pokémon nicht gefunden wurde
//     }

//     let data = await response.json();
//     let evolutionChainUrl = data.evolution_chain.url;
//     let evolutionChainResponse = await fetch(evolutionChainUrl);

//     if (evolutionChainResponse.status === 404) {
//         return { pokemon: data, evolutionChain: null }; // Setze einen Standardwert, wenn die Evolutionskette nicht gefunden wurde
//     }

//     let evolutionChainData = await evolutionChainResponse.json();

//     return {
//         pokemon: data,
//         evolutionChain: evolutionChainData
//     };
// }

async function getPokemonEvolution(pokemonName) {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
        let response = await fetch(url);
        let data = await response.json();

        let evolutionChainUrl = data.evolution_chain.url;
        let evolutionChainResponse = await fetch(evolutionChainUrl);
        let evolutionChainData = await evolutionChainResponse.json();

        return {
            pokemon: data,
            evolutionChain: evolutionChainData
        };
    } catch (error) {
        // Fehler abfangen, z.B. wenn die Pokémon-Daten oder Evolutionskette nicht gefunden werden können
        return { pokemon: null, evolutionChain: null };
    }
}


// Ruft die Bilder für die Evolutionsstufen von der PokeAPI 
async function getEvolutionImage(evolution) {
    let images = [];
    for (let i = 0; i < evolution.length; i++) {
        let actualEvolution = evolution[i];
        let url = `https://pokeapi.co/api/v2/pokemon/${actualEvolution}`;
        let response = await fetch(url);
        let data = await response.json();
        images.push(data.sprites.other["official-artwork"].front_default);
    }
    return images;
}


// Hilfsfunktion zum Generieren der Evolution-Chain in der Detailansicht
function showEvolutions(pokemonName) {
    getPokemonEvolution(pokemonName)
        .then(data => {
            if (data.evolutionChain === null) {
                return;
            }
            let evolutionChain = data.evolutionChain.chain;
            generateAndDisplayEvolutionHTML(evolutionChain);
        });
}