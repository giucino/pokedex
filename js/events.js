//Blendet den arrow-button ein und aus
function myScrollFunc() {
    let arrow = document.getElementById("arrow");
    let y = window.scrollY;
    if (y >= 500) {
        arrow.className = "href show"
    } else {
        arrow.className = "href hide"
    }
};
window.addEventListener("scroll", myScrollFunc);


//scrollTop gibt an, wie weit der Benutzer bereits nach unten gescrollt hat 
//scrollHeight gibt die Höhe der gesamten Seite an (auch wenn sie nicht vollständig sichtbar ist)
//clientHeight gibt die Höhe des sichtbaren Bereichs des Dokuments an.
function handleScroll() {
    let { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) { // Überprüfe, ob Benutzer am Ende der Seite ist
        renderPokemon();
    }
}
// Fügt einen Event-Listener hinzu, um die Scrollfunktion aufzurufen
document.addEventListener('scroll', handleScroll);


// Fügt einen Event Listener zu jeder Karte hinzu, um die Filterfunktion aufzurufen
function addClickForTypeCards() {
    let typeCards = document.querySelectorAll('.select_type');

    for (let i = 0; i < typeCards.length; i++) {
        let card = typeCards[i];
        card.addEventListener('click', handleFilter);
    }
}


// Funktion zum Schliessen des Responsive-Menu beim Klicken außerhalb
function closeMenuOnClickOutside(event) {
    let menuItems = document.getElementById("menu-items");
    let toggleButton = document.getElementById("toggle-button");
    let overlay = document.getElementById("overlay");

    if (!menuItems.contains(event.target) && event.target !== toggleButton) {
        menuItems.style.display = "none";
        toggleButton.innerText = "+";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        document.body.style.overflow = "";
    }
};

document.addEventListener("click", closeMenuOnClickOutside);


// Hilfsfunktion um zu bestimmen aus welchem Array die Pokemon-Karten angezeigt werden
function addPokemonCardListeners(searchedPokemon, types, pokemons) {
    let pokedexDiv = document.getElementById("pokedex");
    let pokemonCards = pokedexDiv.getElementsByClassName("pokemon-card");

    for (let i = 0; i < pokemonCards.length; i++) {
        pokemonCards[i].addEventListener("click", () => {
            let currentPokemon;

            if (searchedPokemon.length > 0) {
                currentPokemon = searchedPokemon[i];
                openPokemonDetail(currentPokemon, searchedPokemon);
            } else if (types.length > 0) {
                currentPokemon = types[i];
                openPokemonDetail(currentPokemon, types);
            } else {
                currentPokemon = pokemons[i];
                openPokemonDetail(currentPokemon, pokemons);
            }

            document.getElementById('background').classList.remove('d-none');
            let arrow = document.getElementById("arrow");
            arrow.className = "href hide";
        });
    }
}


// Markiert aktives Element in Liste durch CSS-Klassenänderung.
function highlightActiveSection(element) {
    let sectionElements = document.getElementsByClassName('info-container__section');
    let activeClass = 'active';

    for (let i = 0; i < sectionElements.length; i++) {
        let sectionElement = sectionElements[i];

        if (sectionElement === element) {
            sectionElement.classList.add(activeClass);
        } else {
            sectionElement.classList.remove(activeClass);
        }
    }
}