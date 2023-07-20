//Generiert jede Pokemon-Karte
function generatePokemonCardTemplate(pokemon, i) {
    let pokemonImage = '';
    if (pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other["official-artwork"] && pokemon.sprites.other["official-artwork"].front_default) {
        pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
    }
    let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    let pokemonId = formattedPokemonNumber(pokemon.id);

    return /*html*/ `<div class="pokemon-card ${pokemon.types[0].type.name}">
            <div class="poke-ball"></div>
            <div class="poke-id"><p>${pokemonId}</p></div>
        <div class="pokemon-card_secondary">
            <div class="pokemon-card_details"> 
                <h6 class="poke-name">${pokemonName}</h6>
                <div class="poke-type" id="pokeType${i}"></div>
            </div>
            <div class="poke-image"><img src="${pokemonImage}" alt=""></div> 
        </div> 
    </div>`;
}


//Generiert jede Pokemon 'type'-class
function generatePokemonTypeClass(pokemon, i) {
    let pokeTypeContent = document.getElementById(`pokeType${i}`);
    pokeTypeContent.innerHTML = "";

    for (let j = 0; j < pokemon["types"].length; j++) {
        let type = pokemon["types"][j]["type"]["name"];
        pokeTypeContent.innerHTML += /*html*/`<div class="${type}-type pokemonn-type">
        ${type}</div>
        `;
    }
}


//Generiert den 'all types'-button
function generateAllTypesButton() {
    return /*html*/ `<div class="select_type all_select" data-type="all" tabindex="0">All
        </div>`;
}


//Generiert alle restlichen Pokemon 'type'-buttons
function generateTypeButton() {
    let typeCards = '';
    for (let i = 0; i < pokemonTypes.length; i++) {
        let pokeType = pokemonTypes[i];
        typeCards += /*html*/ `<div class="select_type ${pokeType.toLowerCase()}_select" data-type="${pokeType.toLowerCase()}" tabindex="0">
                <img src="img/icons/${pokeType}.svg" alt="${pokeType}">
                ${pokeType}
            </div>`;
    }
    return typeCards;
}


/*===============================POKEMON CARD DETAILANSICHT===============================*/
//Generiert Detailansicht für jede Pokemon-Karte
function generateDetailView(pokemon, genus) {
    let cardTopSection = generateCardTopSection();
    let cardHeaderSection = generateCardHeaderSection(pokemon);
    let generaSection = generateGeneraSection(pokemon, genus);
    let cardImageSection = generateCardImageSection(pokemon);
    let infoContainerSection = generateInfoContainerSection(pokemon);

    return /*html*/ `
        <div class="card-container">
            ${cardTopSection}
            <div class="pokemon-ball"></div>
            ${cardHeaderSection}
            ${generaSection}
            ${cardImageSection}
        </div>
            ${infoContainerSection}
    `;
}


// Generiert den oberen Abschnitt für die Detailansicht des Pokémon
function generateCardTopSection() {
    return /*html*/ `
        <div class="card-top">
            <img class="card-top__x-mark" id="close" src="img/arrow-121-64.png" alt="">
            <!-- <img id="favorite" class="card-top__heart" src="img/favorite.png" alt="heart"> -->
        </div>
    `;
}


// Generiert Name und ID für die Detailansicht des Pokémon
function generateCardHeaderSection(pokemon) {
    let capitalizedPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    return /*html*/ `
        <div class="card-header">
            <h1 class="card-name">${capitalizedPokemonName}</h1>
            <p class="card-id">${formattedPokemonNumber(pokemon.id)}</p>
        </div>
    `;
}


// Generiert Typen und Genus für die Detailansicht des Pokémon
function generateGeneraSection(pokemon, genus) {
    let pokemonTypes = pokemon.types.map(type => `<div class="${type.type.name}-type pokemonn-type">${type.type.name}</div>`).join('');

    return /*html*/ `
        <div class="genera">
            <div class="pokemon-type" id="pokeType${pokemon.id}">${pokemonTypes}</div>
            <h4>${genus}</h4>
        </div>
    `;
}


// Generiert den Bildabschnitt einer Karte mit Pfeilen
function generateCardImageSection(pokemon) {
    return /*html*/ `
        <div class="card-image-container">
            <img class="card-image" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <div class="card-arrows">
                <img id="previous-arrow" class="card-arrow" src="img/arrow-115-64.png" alt="arrow-left">
                <img id="next-arrow" class="card-arrow" src="img/arrow-15-64.png" alt="arrow-right">
            </div>
        </div>
    `;
}


// Generiert den Informationscontainer für die Detailansicht des Pokémon
function generateInfoContainerSection(pokemon) {
    return /*html*/ `
        <div class="info-container">
            <div class="info-container__top">
            <h3 class="info-container__section active" id="about" onclick="highlightActiveSection(this); getAbilities()">About</h3>
            <h3 class="info-container__section" id="base-stats" onclick="highlightActiveSection(this); getStats()">Base Stats</h3>
            <h3 class="info-container__section" id="evolution-header" onclick="highlightActiveSection(this); showEvolutions('${pokemon.name}')">Evolution</h3>
            <h3 class="info-container__section" id="moves" onclick="highlightActiveSection(this); getMoves()">Moves</h3>
            </div>
            <div class="stats" id="stats"></div>
        </div>
    `;
}


// Generiert Abilities und Flavor-Texte für die Detailansicht des Pokémon
async function getAbilities() {
    let abilities = currentPokemon['abilities'];
    document.getElementById('stats').innerHTML = '<div id="about-container"></div>';

    let flavorTexts = await getFlavorTexts(currentPokemon.name);
    let flavorText6 = flavorTexts.flavorText6;
    let flavorText10 = flavorTexts.flavorText10;

    let abilityHTML = generateAbilityHTML(abilities);
    let abilitiesHTML = '';
    if (abilityHTML !== '') {
        abilitiesHTML = `<div class="abilities-title">Abilities</div>`;
    }
    let additionalInfoHTML = generateAdditionalInfoHTML(currentPokemon);

    updateAboutContainer(additionalInfoHTML, abilitiesHTML, abilityHTML, flavorText6, flavorText10);
}


// Aktualisiert den "About"-Container mit Abilities und Flavor-Texten
function updateAboutContainer(additionalInfoHTML, abilitiesHTML, abilityHTML, flavorText6, flavorText10) {
    let aboutContainer = document.getElementById('about-container');
    aboutContainer.innerHTML = '';

    aboutContainer.innerHTML += additionalInfoHTML;
    aboutContainer.innerHTML += `
        <div class="abilities">
            ${abilitiesHTML}
            ${abilityHTML}
        </div>
        <div class="flavor">
            <p>${flavorText6}</p>
            <p>${flavorText10}</p>
        </div>
    `;
}


//Generieren des HTML-Codes der Abilities
function generateAbilityHTML(abilities) {
    let abilityHTML = '';
    for (let i = 0; i < abilities.length; i++) {

        let ability = abilities[i]['ability']['name'];
        ability = ability.charAt(0).toUpperCase() + ability.slice(1);

        abilityHTML += `
            <div class="ability"> 
                ${ability}
            </div>
        `;
        // Überprüfen, ob es ein weiteres Ability-Eintrag gibt
        if (i < abilities.length - 1) {
            abilityHTML += ' - &nbsp;';
        }
    }
    return abilityHTML;
}


// Generiere den HTML-Code für die zusätzlichen Informationen
function generateAdditionalInfoHTML(currentPokemon) {
    // Umwandlung der Height- und Weight-Werte in Meter und Kilogramm
    let heightInMeters = (currentPokemon.height / 10).toFixed(1);
    let weightInKilograms = (currentPokemon.weight / 10).toFixed(1);
    let baseExperience = currentPokemon.base_experience !== null ? currentPokemon.base_experience : '-';

    let additionalInfoHTML = `
        <div class="additional-info">
            <div class="add-info">
                <div class="info gray">Height</div>
                <div class="info">${heightInMeters} m</div>
            </div>
            <div class="add-info">
                <div class="info gray">Weight</div>
                <div class="info">${weightInKilograms} kg</div>
            </div>
            <div class="add-info">
                <div class="info gray">Base Exp.</div>
                <div class="info">${baseExperience}</div>
            </div>
        </div>
    `;

    return additionalInfoHTML;
}


// Generiert Basisattribute für die Detailansicht des Pokémon.
function getStats() {
    let stats = currentPokemon['stats'];
    document.getElementById('stats').innerHTML = '<div id="stats-container"></div>';

    for (let i = 0; i < stats.length; i++) {
        let statName = stats[i]['stat']['name'];
        statName = capitalizeStatName(statName);

        let baseStat = stats[i]['base_stat'];
        let orangePercentage = calculateOrangePercentage(baseStat);
        let whitePercentage = 100 - orangePercentage;

        let statBarHTML = generateStatBarHTML(statName, baseStat, orangePercentage, whitePercentage);
        let status = document.getElementById('stats-container');
        status.innerHTML += statBarHTML;
    }
}


// Verändert den Namen des Stats in Großbuchstaben, verkürzt spezielle Stat-Namen
function capitalizeStatName(statName) {
    statName = statName.charAt(0).toUpperCase() + statName.slice(1);

    if (statName === "Special-attack") {
        statName = "Sp. Atk";
    } else if (statName === "Special-defense") {
        statName = "Sp. Def";
    }
    return statName;
}


// Berechnet das prozentuale Verhältnis für die orangefarbene Anzeige
function calculateOrangePercentage(baseStat) {
    let maxStat = 255; // Maximalwert für die Base Stats
    return (baseStat / maxStat) * 100;
}


// Generiert HTML-Code für die Anzeige einer Statistikleiste
function generateStatBarHTML(statName, baseStat, orangePercentage, whitePercentage) {
    return `
        <div class="stat-bar">
            <div class="stat-name">${statName}</div>
            <div class="stat-value">${baseStat}</div>
            <div class="stat-bar-inner orange-margin" style="background-color: orange; width: ${orangePercentage}%;"></div>
            <div class="stat-bar-inner" style="background-color: white; opacity: 0.2; width: ${whitePercentage}%;"></div>
        </div>
    `;
}


// Generiert Moves für die Detailansicht des Pokémon
function getMoves() {
    let moves = currentPokemon['moves'];
    document.getElementById('stats').innerHTML = '<div id="moves-container" class="moves-container"></div>';
    let movesContainer = document.getElementById('moves-container');

    for (let i = 0; i < moves.length; i++) {
        let move = moves[i]['move']['name'];
        movesContainer.innerHTML += `
            <div class="moves">
                ${move}
            </div>
        `;
    }
}


/*===============================FUNKTIONEN FÜR DIE EVOLUTIONSKETTE IN DER DETAILANSICHT==============================*/
//Generiert und zeigt die Evolutions-HTML basierend auf der Evolutionskette an
async function generateAndDisplayEvolutionHTML(evolutionChain) {
    const evolutionHTML = await generateEvolutionHTML(evolutionChain);
    displayEvolutionHTML(evolutionHTML);
}


// Generiert Evolutions-HTML aus Evolutionskette und gibt es zurück
async function generateEvolutionHTML(evolutionChain) {
    let evolutionHTML = "";
    let queue = [evolutionChain];

    while (queue.length > 0) {
        let evolutionData = queue.shift();
        let evolutionName = capitalizeFirstLetter(evolutionData.species.name);
        let evolutionImages = await getEvolutionImage([evolutionData.species.name]);
        let evolutionImage = evolutionImages[0]; // Wir verwenden das erste Bild im Array

        let evolutionDetailsHTML = generateEvolutionDetailsHTML(evolutionData.evolves_to);

        evolutionHTML += `
        <div class="evolution">
            <div class="evolution-header">
                <div class="evolution-image"><img src="${evolutionImage}" alt="${evolutionName}"></div>
                <div class="evolution-name">${evolutionName}</div>
            </div>
            <div class="evolution-details">
                ${evolutionDetailsHTML}
            </div>
        </div>
    `;

        if (evolutionData.evolves_to.length > 0) {
            queue.push(...evolutionData.evolves_to);
        }
    }

    return evolutionHTML;
}


// Erzeugt Details-HTML für jede Evolution in der Kette
function generateEvolutionDetailsHTML(evolvesTo) {
    return evolvesTo.map(evolution => {
        let level = evolution.evolution_details.length > 0 ? evolution.evolution_details[0].min_level : "";
        return `
        <div class="evolution-level">Level ${level}</div>
        <div class="evolution-arrow">↓</div>
        `;
    }).join('');
}


// Zeigt das erzeugte Evolution-HTML im angegebenen Element an
function displayEvolutionHTML(evolutionHTML) {
    let statsDiv = document.getElementById("stats");
    statsDiv.innerHTML = `<div id="evolution-container">${evolutionHTML}</div>`;
}


// Gibt den String zurück, wobei der erste Buchstabe großgeschrieben wird
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}