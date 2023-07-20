// function addPokemonCardListeners(searchedPokemon, types, pokemons, favoritePokemon) {
//     let pokedexDiv = document.getElementById("pokedex");
//     let pokemonCards = pokedexDiv.getElementsByClassName("pokemon-card");

//     for (let i = 0; i < pokemonCards.length; i++) {
//         pokemonCards[i].addEventListener("click", () => {
//             let currentPokemon;

//             if (searchedPokemon.length > 0) {
//                 currentPokemon = searchedPokemon[i];
//                 openPokemonDetail(currentPokemon, searchedPokemon);
//             } else if (types.length > 0) {
//                 currentPokemon = types[i];
//                 openPokemonDetail(currentPokemon, types);
//             } else if (favoritePokemon.length > 0) {
//                 currentPokemon = favoritePokemon[i];
//                 openPokemonDetail(currentPokemon, favoritePokemon);
//             } else {
//                 currentPokemon = pokemons[i];
//                 openPokemonDetail(currentPokemon, pokemons);
//             }

//             document.getElementById('background').classList.remove('d-none');
//             document.body.style.overflow = "hidden";
//         });
//     }
// }



// Click-Event für das Favorite Pokemon - wird in der openPokemonDetail aufgerufen
// document.getElementById(`favorite-${pokemon.id}`).addEventListener('click', () => toggleFavorite(pokemon));
// loadPokemonFromStorage(pokemon);


// function toggleFavorite(pokemon) {
//     let favoriteImg = document.getElementById(`favorite-${pokemon.id}`);
//     let currentSrc = favoriteImg.src;
//     let newSrc = "";

//     if (currentSrc.includes("favorite.png")) {
//         newSrc = currentSrc.replace("favorite.png", "heart-white.png");
//         // Pokemon als Favorit markieren und Eintrag im Local Storage erstellen
//         localStorage.setItem(`favoriteImage-${pokemon.id}`, newSrc);
//         // Pokemon zum favoritePokemon-Array hinzufügen
//         favoritePokemon.push(pokemon);
//     } else {
//         newSrc = currentSrc.replace("heart-white.png", "favorite.png");
//         // Pokemon als nicht Favorit markieren und Eintrag im Local Storage entfernen
//         localStorage.removeItem(`favoriteImage-${pokemon.id}`);
//         // Pokemon aus dem favoritePokemon-Array entfernen
//         favoritePokemon = [favoritePokemon.filter(p => p.id !== pokemon.id)];
//     }

//     favoriteImg.src = newSrc;
// }


// // Laden des gespeicherten Bildpfads beim Seitenaufruf
// function loadPokemonFromStorage(pokemon) {
//     let favoriteImg = document.getElementById(`favorite-${pokemon.id}`);
//     let savedImage = localStorage.getItem(`favoriteImage-${pokemon.id}`);

//     if (savedImage) {
//         favoriteImg.src = savedImage;
//     }
// }


// // Laden der Favoriten aus dem Local Storage beim Seitenaufruf
// function loadFavoritePokemons() {
//     for (let i = 0; i < localStorage.length; i++) {
//         let key = localStorage.key(i);
//         if (key.startsWith("favoriteImage-")) {
//             let pokemonId = key.replace("favoriteImage-", "");

//             // Überprüfen, ob das Pokémon bereits im favoritePokemon Array vorhanden ist
//             let isExisting = favoritePokemon.some((pokemon) => pokemon.id === Number(pokemonId));
//             if (isExisting) {
//                 continue; // Überspringe das Hinzufügen, wenn das Pokémon bereits im Array ist
//             }

//             // API-Abfrage, um das Pokémon anhand der ID zu laden
//             fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
//                 .then((response) => response.json())
//                 .then((data) => {
//                     let pokemon = {
//                         id: data.id,
//                         name: data.name,
//                         types: data.types,
//                         sprites: data.sprites || {}, // Setze einen leeren Objekt-Standardwert, falls sprites nicht definiert ist
//                         moves: data.moves,
//                         abilities: data.abilities,
//                     };

//                     favoritePokemon.push(pokemon); // Hinzufügen des neu geladenen Pokémon zum favoritePokemon Array
//                 })
//                 .catch((error) => console.log("Fehler beim Laden des Pokémon:", error));
//         }
//     }

//     renderFavoritePokemon(); // Rendern der favorisierten Pokémon
// }


// function renderFavoritePokemon() {
//     let content = document.getElementById("favorite-pokemon");
//     content.innerHTML = "";

//     for (let i = 0; i < favoritePokemon.length; i++) {
//         let pokemon = favoritePokemon[i];
//         content.innerHTML += generatePokemonCardTemplate(pokemon, i);
//         generatePokemonTypeClass(pokemon, i);
//     }
//     addPokemonCardListeners(searchedPokemon, types, pokemons, favoritePokemon);
//     document.removeEventListener('scroll', handleScroll);
// }


// let favoriteLink = document.getElementById("favoriteLink");
// favoriteLink.addEventListener("click", function () {
//     document.getElementById("pokedex").style.display = "none";
//     console.log("Favorite-Link wurde geklickt.");
//     loadFavoritePokemons();
//     renderFavoritePokemon();
//     toggleMenu();
// });


// Funktion zum ein- und ausblenden des Scrollbalken
// function adjustDropdownHeight() {
//     let dropdownSection = document.querySelector('.dropdown-section');
//     let dropdownContent = document.querySelector('.dropdown-content');

//     let windowHeight = window.innerHeight;
//     let dropdownSectionHeight = dropdownSection.offsetHeight;
//     let availableHeight = windowHeight - dropdownSectionHeight;

//     dropdownContent.style.maxHeight = availableHeight + 'px';
// }

// window.addEventListener('resize', adjustDropdownHeight);


// function showEvolutions(pokemonName) {
//     getPokemonEvolution(pokemonName)
//         .then(data => {
//             let evolutionChain = data.evolutionChain;

//             console.log(evolutionChain); 

//             let evolutionHTML = '';
//             let queue = [evolutionChain];
//             let currentIndex = 0;

//             while (currentIndex < queue.length) {
//                 let evolutionData = queue[currentIndex];
//                 let evolutionName = evolutionData.name;
//                 let evolutionImage = evolutionData.image;
//                 let evolutionLevel = evolutionData.level;

//                 evolutionHTML += `<div class="evolution">
//                     <img src="${evolutionImage}" alt="${evolutionName}" class="evolution-image">
//                     <div class="evolution-info">
//                         <span class="evolution-name">${evolutionName}</span>
//                         <span class="evolution-level">Level ${evolutionLevel}</span>
//                     </div>
//                 </div>`;

//                 if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
//                     evolutionHTML += '<div class="evolution-arrow">→</div>';
//                     for (let i = 0; i < evolutionData.evolves_to.length; i++) {
//                         let evolution = evolutionData.evolves_to[i];
//                         queue.push(evolution);
//                     }
//                 }

//                 currentIndex++;
//             }

//             let statsDiv = document.getElementById('stats');
//             statsDiv.innerHTML = `<div id="evolution-container">${evolutionHTML}</div>`;
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }


// async function getPokemonEvolution(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);
//     let data = await response.json();

//     let evolutionChainUrl = data.evolution_chain.url;
//     let evolutionChainResponse = await fetch(evolutionChainUrl);
//     let evolutionChainData = await evolutionChainResponse.json();

//     let evolutionChain = evolutionChainData.chain;

//     // Extrahiere die Bilder und Level der Pokémon
//     let formattedEvolutionChain = await formatEvolutionChain(evolutionChain);

//     return {
//         evolutionChain: formattedEvolutionChain
//     };
// }

// async function formatEvolutionChain(evolutionChain) {
//     let formattedEvolutionChain = [];

//     let formatEvolutionData = async (evolutionData) => {
//         let pokemonName = evolutionData.species.name;

//         // API-Anfrage, um weitere Informationen über das Pokémon zu erhalten
//         let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
//         let pokemonData = await pokemonResponse.json();

//         // Extrahiere das Bild des Pokémon
//         let imageUrl = pokemonData.sprites.other['official-artwork'].front_default;

//         // Extrahiere das Level der Evolution (falls vorhanden)
//         let evolutionLevel = null;
//         if (evolutionData.evolution_details.length > 0) {
//             evolutionLevel = evolutionData.evolution_details[0].min_level;
//         }

//         // Füge die formatierten Daten zur evolutionChain hinzu
//         formattedEvolutionChain.push({
//             name: pokemonName,
//             image: imageUrl,
//             level: evolutionLevel
//         });

//         // Rekursiv die Daten für die nächste Evolutionsstufe formatieren
//         if (evolutionData.evolves_to.length > 0) {
//             for (let i = 0; i < evolutionData.evolves_to.length; i++) {
//                 await formatEvolutionData(evolutionData.evolves_to[i]);
//             }
//         }
//     };

//     // Starte die Formatierung der Daten für die Evolutionskette
//     await formatEvolutionData(evolutionChain);

//     return formattedEvolutionChain;
// }



// Hilfsfunktionen für Moves und Abilities
// function getMoves(pokemon) {
//     return pokemon.moves.map(move => move.move.name).join(', ');
// }

// function getAbilities(pokemon) {
//     return pokemon.abilities.map(ability => ability.ability.name).join(', ');
// }


// function filterPokemonByType(pokemonList, type) {
//     return pokemonList.filter((pokemon) => {
//         return pokemon.types && pokemon.types[0].type.name === type;
//     });
// }


// async function openPokemonDetail(pokemon, array) {
//     currentPokemon = pokemon; // Aktualisiere das aktuell geöffnete Pokémon
//     currentArray = array; // Aktualisiere das aktuelle Array
//     let content = document.getElementById('pokemon-details');
//     let pokemonClass = pokemon.types[0].type.name;

//     // Entferne die vorherige Klasse, falls vorhanden
//     content.classList.remove(...content.classList);

//     // Füge die neue Klasse hinzu
//     content.classList.add(pokemonClass);

//     content.innerHTML = '';

//     // Rufe die Pokemon-Details ab
//     let pokemonDetails = await getGenus(pokemon.name);

//     // Rufe generateDetailView auf und übergebe die benötigten Informationen
//     let detailView = generateDetailView(pokemon, pokemonDetails.genus);

//     content.innerHTML = detailView;
//     content.style.display = 'flex';
//     let background = document.getElementById('background');
//     let close = document.getElementById('close');

//     if (background && close) {
//         background.style.opacity = 1;
//         background.addEventListener('click', closeCard);
//         close.addEventListener('click', closeCard);
//     }

//     // Click-Event für den Pfeil nach rechts (nächstes Pokémon)
//     document.getElementById('next-arrow').addEventListener('click', showNextPokemon);

//     // Click-Event für den Pfeil nach links (vorheriges Pokémon)
//     document.getElementById('previous-arrow').addEventListener('click', showPreviousPokemon);

//     getAbilities();
// }




// let content = document.getElementById("pokedex");: Diese Zeile ruft das DOM-Element mit der ID "pokedex" ab und weist es der Variablen content zu. 
// Dieses Element wird verwendet, um den gerenderten Inhalt anzuzeigen.

// let renderedPokemonCount = 0;: Diese Zeile initialisiert die Variable renderedPokemonCount mit dem Wert 0. Diese Variable zählt die Anzahl 
// der bereits gerenderten Pokémon und wird verwendet, um das Limit der gerenderten Pokémon zu überprüfen.

// while (renderedPokemonCount < limit && offset < allPokemon.length) {: Dies ist eine Schleife, die solange ausgeführt wird, wie zwei Bedingungen erfüllt sind:
// Die Anzahl der bereits gerenderten Pokémon (renderedPokemonCount) ist kleiner als das Limit (limit), und der aktuelle Offset (offset) ist kleiner als 
// die Gesamtzahl der Pokémon (allPokemon.length).

// let pokemon = allPokemon[offset];: Diese Zeile weist der Variablen pokemon das Pokémon-Objekt aus dem allPokemon-Array zu, basierend auf dem aktuellen Offset.

// let response = await fetch(pokemon.url);: Hier wird eine HTTP-Anfrage an die URL des Pokémon gesendet, um weitere Informationen zu erhalten. 
// Die await-Anweisung sorgt dafür, dass der Code pausiert, bis die Anfrage abgeschlossen ist und die Antwort erhalten wurde.

// let pokemonData = await response.json();: Die Antwort der Anfrage wird in das JSON-Format umgewandelt und der Variablen pokemonData zugewiesen. 
// Sie enthält die vollständigen Daten des Pokémon.

// if (!pokemons.find(p => p.id === pokemonData.id)) { ... }: In dieser Bedingung wird überprüft, ob das Pokémon bereits im pokemons-Array vorhanden ist. 
// Dazu wird die find-Methode verwendet, um nach einem Pokémon mit der gleichen ID im pokemons-Array zu suchen. Wenn das Pokémon nicht gefunden wird, 
// wird der Code im Inneren der Bedingung ausgeführt.

// pokemons.push(pokemonData);: Das Pokémon-Objekt (pokemonData) wird dem pokemons-Array hinzugefügt.

// content.innerHTML += generatePokemonCardTemplate(pokemonData, offset);: Hier wird der generierte HTML-Code für die Pokémon-Karte erstellt und 
// dem Inhalt (content.innerHTML) hinzugefügt. Die Funktion generatePokemonCardTemplate wird mit dem Pokémon-Objekt (pokemonData) und 
// dem aktuellen Offset als Argumente aufgerufen.

// generatePokemonTypeClass(pokemonData, offset);: Diese Funktion generiert und fügt dem gerenderten Pokémon die entsprechende CSS-Klasse basierend 
// auf dem Pokémon-Typ hinzu.

// renderedPokemonCount++;: Die Variable renderedPokemonCount wird um eins erhöht, da ein weiteres Pokémon erfolgreich gerendert wurde.

// offset++;: Der Offset wird um eins erhöht, um zum nächsten Pokémon zu wechseln.

//Rendert Pokémon-Karten aus Pokémon-Daten, solange maximale Anzahl nicht erreicht ist.
// async function renderPokemon() {
//     let content = document.getElementById("pokedex");
//     // content.innerHTML = "";
//     let renderedPokemonCount = 0;


//     while (renderedPokemonCount < limit && offset < allPokemon.length) {
//         let pokemon = allPokemon[offset];
//         let response = await fetch(pokemon.url);
//         let pokemonData = await response.json();

//         if (!pokemons.find(p => p.id === pokemonData.id)) {
//             pokemons.push(pokemonData);
//             content.innerHTML += generatePokemonCardTemplate(pokemonData, offset);
//             generatePokemonTypeClass(pokemonData, offset);
//             renderedPokemonCount++;
//         }
//         offset++;
//     }
//     addPokemonCardListeners(searchedPokemon, types, pokemons);
// }


// In der Funktion loadPokemonByType wird die API von Pokeapi verwendet,
// um die Daten aller Pokémon eines bestimmten Typs zu erhalten.
// typeData enthält die JSON - Daten, die durch das Abfragen der API 
// für den angegebenen Typ erhalten wurden.Das Attribut pokemon von typeData 
// enthält ein Array von Objekten, von denen jedes ein Objekt pokemonObj enthält, 
// das Informationen über ein einzelnes Pokémon des Typs enthält, wie z.B.den 
// Namen des Pokémons und die URL, unter der weitere Informationen zu dem 
// Pokémon abgerufen werden können. pokemonData wird mit map aufgerufen und enthält 
// das Ergebnis von fetch, das auf pokemonObj.pokemon.url angewendet wurde.
// Die fetch-Anfrage wird mit await abgewartet und das Ergebnis res wird 
// in JSON umgewandelt, um Informationen über das Pokémon zu erhalten.Der 
// zurückgegebene Wert von pokemonData ist ein Array von Promises, von denen 
// jeder eine JSON - Struktur enthält, die Informationen über ein einzelnes 
// Pokémon des Typs enthält.Schließlich werden alle diese Promises mit 
// Promise.all aufgelöst, um das Array pokemon zu erstellen.allPokemon 
// enthält dann das Ergebnis der Anwendung von filterPokemonByType auf pokemon.

// Lädt Pokémon des angegebenen Typs aus der API und rendert sie.
// async function loadPokemonByType(type) {
//     let response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
//     let typeData = await response.json();
//     let pokemonData = typeData.pokemon.map(async (pokemonObj) => {
//         let res = await fetch(pokemonObj.pokemon.url);
//         return await res.json();
//     });
//     let pokemon = await Promise.all(pokemonData);
//     types = filterPokemonByType(pokemon, type);
//     renderPokemonByType();
// }


//Generiert Detailansicht für jede Pokemon-Karte
// function generateDetailView(pokemon, genus) {
//     return /*html*/ `<div class="card-container"> <div class="card-top">
//         <img class="card-top__x-mark" id="close" src="img/x-mark-64.png" alt="">
//         <img id="previous-arrow" class="card-top__arrow" src="img/arrow-115-64.png" alt="arrow-left">
//         <!-- <img id="favorite" class="card-top__heart" src="img/favorite.png" alt="heart"> -->
//         <img id="next-arrow" class="card-top__arrow" src="img/arrow-15-64.png" alt="arrow-right">
//     </div>
//     <div class="pokemon-ball"></div>
//     <div class="card-header">
//         <h1 class="card-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
//         <p class="card-id">${formattedPokemonNumber(pokemon.id)}</p>
//     </div>
//     <div class="genera">
//         <div class="pokemon-type" id="pokeType${pokemon.id}">${generatePokemonTypes(pokemon)}</div>
//         <h4>${genus}</h4>
//     </div>
//     <img class="card-image" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
//     </div>
//     <div class="info-container">
//         <div class="info-container__top">
//         <h3 class="info-container__section active" id="about" onclick="highlightActiveSection(this); getAbilities()">About</h3>
//         <h3 class="info-container__section" id="base-stats" onclick="highlightActiveSection(this); getStats()">Base Stats</h3>
//         <h3 class="info-container__section" id="evolution-header" onclick="highlightActiveSection(this); showEvolutions('${pokemon.name}')">Evolution</h3>
//         <h3 class="info-container__section" id="moves" onclick="highlightActiveSection(this); getMoves()">Moves</h3>
//         </div>
//         <div class="stats" id="stats"></div>
//     </div>
// `;
// }


// async function getAbilities() {
//     let abilities = currentPokemon['abilities'];
//     document.getElementById('stats').innerHTML = '<div id="about-container"></div>';

//     let flavorTexts = await getFlavorTexts(currentPokemon.name);
//     let flavorText6 = flavorTexts.flavorText6;
//     let flavorText10 = flavorTexts.flavorText10;

//     let abilityHTML = '';

//     for (let i = 0; i < abilities.length; i++) {
//         let ability = abilities[i]['ability']['name'];
//         abilityHTML += `
//             <div class="ability"> 
//                 ${ability}
//             </div>
//         `;
//     }

//     let abilitiesHTML = '';
//     if (abilityHTML !== '') {
//         abilitiesHTML = `<div class="abilities-title">Abilities:</div>`;
//     }

//     // Umwandlung der Height- und Weight-Werte in Meter und Kilogramm
//     let heightInMeters = (currentPokemon.height / 10).toFixed(1); // Beispiel: 69 -> 6.9
//     let weightInKilograms = (currentPokemon.weight / 10).toFixed(1); // Beispiel: 69 -> 6.9

//     // Überprüfe und aktualisiere den Base Experience-Wert
//     let baseExperience = currentPokemon.base_experience !== null ? currentPokemon.base_experience : '-';

//     // Generiere den HTML-Code für die zusätzlichen Informationen
//     let additionalInfoHTML = `
//         <div class="additional-info">
//             <div class="add-info">
//                 <div class="info gray">Height:</div>
//                 <div class="info">${heightInMeters} m</div>
//             </div>
//             <div class="add-info">
//                 <div class="info gray">Weight:</div>
//                 <div class="info">${weightInKilograms} kg</div>
//             </div>
//             <div class="add-info">
//                 <div class="info gray">Base Experience:</div>
//                 <div class="info">${baseExperience}</div>
//             </div>
//         </div>
//     `;

//     document.getElementById('about-container').innerHTML += `
//         ${additionalInfoHTML}
//         <div class="abilities">
//             ${abilitiesHTML}
//             ${abilityHTML}
//         </div>
//         <div class="flavor">
//             <p>${flavorText6}</p>
//             <p>${flavorText10}</p>
//         </div>
//     `;
// }

// Generiert Basisattribute für die Detailansicht des Pokémon.
// function getStats() {
//     let stats = currentPokemon['stats'];
//     document.getElementById('stats').innerHTML = '<div id="stats-container"></div>';

//     for (let i = 0; i < stats.length; i++) {
//         let statName = stats[i]['stat']['name'];
//         statName = statName.charAt(0).toUpperCase() + statName.slice(1);

//         if (statName === "Special-attack") {
//             statName = "Sp. Atk";
//         } else if (statName === "Special-defense") {
//             statName = "Sp. Def";
//         }

//         let baseStat = stats[i]['base_stat'];
//         let maxStat = 255; // Maximalwert für die Base Stats

//         let orangePercentage = (baseStat / maxStat) * 100;
//         let whitePercentage = 100 - orangePercentage;

//         let statBarHTML = `
//             <div class="stat-bar">
//                 <div class="stat-name">${statName}</div>
//                 <div class="stat-value">${baseStat}</div>
//                 <div class="stat-bar-inner orange-margin" style="background-color: orange; width: ${orangePercentage}%;"></div>
//                 <div class="stat-bar-inner" style="background-color: white; width: ${whitePercentage}%;"></div>
//             </div>
//         `;

//         document.getElementById('stats-container').innerHTML += statBarHTML;
//     }
// }


// Hilfsfunktion zum Generieren der Evolution-Chain in der Detailansicht
// function showEvolutions(pokemonName) {
//     getPokemonEvolution(pokemonName)
//         .then(data => {
//             let evolutionChain = data.evolutionChain.chain;

//             let evolutionHTML = '';
//             let queue = [evolutionChain]; // Queue für die Breitensuche
//             let currentIndex = 0; // Index des aktuellen Elements

//             while (currentIndex < queue.length) {
//                 let evolutionData = queue[currentIndex];
//                 let evolutionName = evolutionData.species.name;
//                 evolutionName = evolutionName.charAt(0).toUpperCase() + evolutionName.slice(1);

//                 evolutionHTML += `<div class="evolution">${evolutionName}</div>`;

//                 if (evolutionData.evolves_to.length > 0) {
//                     evolutionHTML += '<div class="evolution-arrow">→</div>';
//                     for (let i = 0; i < evolutionData.evolves_to.length; i++) {
//                         let evolution = evolutionData.evolves_to[i];
//                         queue.push(evolution);
//                     }
//                 }
//                 currentIndex++;
//             }
//             let statsDiv = document.getElementById('stats');
//             statsDiv.innerHTML = `<div id="evolution-container">${evolutionHTML}</div>`;
//         })
// }




// async function getFlavorTexts(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);
//     let data = await response.json();

//     let flavorTextEntries = data.flavor_text_entries;

//     let flavorText6 = '';
//     let flavorText10 = '';

//     for (let i = 0; i < flavorTextEntries.length; i++) {
//         if (flavorTextEntries[i].language.name === 'en') {
//             if (i === 5) {
//                 flavorText6 = flavorTextEntries[i].flavor_text;
//             } else if (i === 9) {
//                 flavorText10 = flavorTextEntries[i].flavor_text;
//             }
//         }
//     }
//     return {
//         flavorText6: flavorText6,
//         flavorText10: flavorText10
//     };
// }


// // Fetchen der Evolutionskette eines Pokémon aus der API
// async function getPokemonEvolution(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);
//     let data = await response.json();

//     let evolutionChainUrl = data.evolution_chain.url;
//     let evolutionChainResponse = await fetch(evolutionChainUrl);
//     let evolutionChainData = await evolutionChainResponse.json();

//     return {
//         pokemon: data,
//         evolutionChain: evolutionChainData
//     };
// }


// function generateAndDisplayEvolutionHTML(evolutionChain) {
//     if (!evolutionChain) {
//         displayError("Evolutionskette nicht verfügbar");
//         return;
//     }

//     let evolutionHTML = '';
//     let queue = [evolutionChain];
//     let currentIndex = 0;

//     while (currentIndex < queue.length) {
//         let evolutionData = queue[currentIndex];
//         let evolutionName = capitalizeFirstLetter(evolutionData.species.name);
//         evolutionHTML += `<div class="evolution">${evolutionName}</div>`;

//         if (evolutionData.evolves_to.length > 0) {
//             evolutionHTML += '<div class="evolution-arrow">→</div>';
//             for (let i = 0; i < evolutionData.evolves_to.length; i++) {
//                 let evolution = evolutionData.evolves_to[i];
//                 queue.push(evolution);
//             }
//         }
//         currentIndex++;
//     }

//     let statsDiv = document.getElementById('stats');
//     statsDiv.innerHTML = `<div id="evolution-container">${evolutionHTML}</div>`;
// }



// async function getGenus(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);

//     if (response.status === 404) {
//         return { genus: '' }; // Setze einen Standardwert, wenn kein Genus vorhanden ist
//     }

//     let data = await response.json();
//     let genera = data.genera;
//     let genus = '';

//     if (genera && genera.length > 0) {
//         for (let i = 0; i < genera.length; i++) {
//             if (genera[i].language.name === 'en') {
//                 genus = genera[i].genus;
//                 break;
//             }
//         }
//     }

//     return {
//         genus: genus
//     };
// }

// async function getFlavorTexts(pokemonName) {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
//     let response = await fetch(url);

//     if (response.status === 404) {
//         return { flavorText6: '', flavorText10: '' }; // Setze einen Standardwert, wenn das Pokémon nicht gefunden wurde
//     }

//     let data = await response.json();

//     let flavorTextEntries = data.flavor_text_entries;

//     let flavorText6 = '';
//     let flavorText10 = '';

//     for (let i = 0; i < flavorTextEntries.length; i++) {
//         if (flavorTextEntries[i].language.name === 'en') {
//             if (i === 5) {
//                 flavorText6 = flavorTextEntries[i].flavor_text;
//             } else if (i === 9) {
//                 flavorText10 = flavorTextEntries[i].flavor_text;
//             }
//         }
//     }

//     return {
//         flavorText6: flavorText6,
//         flavorText10: flavorText10
//     };
// }


// async function generateAndDisplayEvolutionHTML(evolutionChain) {
//     let evolutionHTML = "";
//     let queue = [evolutionChain];
//     let currentIndex = 0;

//     while (currentIndex < queue.length) {
//         let evolutionData = queue[currentIndex];
//         let evolutionName = capitalizeFirstLetter(evolutionData.species.name);
//         let evolutionImage = "";

//         // Hole die Bilder der Evolutionsstufen
//         let evolutionImages = await getEvolutionImage([evolutionData.species.name]);

//         // Überprüfe, ob Bilder vorhanden sind
//         if (evolutionImages.length > 0) {
//             evolutionImage = `<img src="${evolutionImages[0]}" alt="${evolutionName}">`;
//         }

//         evolutionHTML += `
//         <div class="evolution">
//             <div class="evolution-header">
//                 <div class="evolution-image">${evolutionImage}</div>
//                 <div class="evolution-name">${evolutionName}</div>
//             </div>
//             <div class="evolution-details">
//             ${evolutionData.evolves_to.map(evolution => {
//                 let level = evolution.evolution_details.length > 0 ? `${evolution.evolution_details[0].min_level}` : "";
//                 // let trigger = evolution.evolution_details.length > 0 ? `${evolution.evolution_details[0].trigger.name}` : "";
//             return `
//             <div class="evolution-level">LV ${level}</div>
//             <div class="evolution-arrow">↓</div>
//                 `;
//         }).join('')}
//             </div>
//         </div>
//         `;

//         if (evolutionData.evolves_to.length > 0) {
//             for (let i = 0; i < evolutionData.evolves_to.length; i++) {
//                 let evolution = evolutionData.evolves_to[i];
//                 queue.push(evolution);
//             }
//         }
//         currentIndex++;
//     }

//     let statsDiv = document.getElementById("stats");
//     statsDiv.innerHTML = `<div id="evolution-container">${evolutionHTML}</div>`;
// }

// async function loadPokemonByType(type) {
//     let response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
//     let typeData = await response.json();
//     let pokemonData = typeData.pokemon.map(async (pokemonObj) => {
//         let res = await fetch(pokemonObj.pokemon.url);
//         return await res.json();
//     });
//     let pokemon = await Promise.all(pokemonData);
//     types = filterPokemonByType(pokemon, type);
//     renderPokemonByType();
// }