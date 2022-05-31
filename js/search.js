"use strict";
console.log("search.js loaded");

const URL = "https://pokeapi.co/api/v2";

// DOM ELEMENTS
const searchButton = document.getElementById("poke-search-button");
const pokeGridContainer = document.getElementById("poke-grid-container");
const inputField = document.getElementById("pokesearch-input");
const selectField = document.getElementById("pokefilter");
const loading = document.getElementById("loading-icon-container");

// CHECK FOR FILTER AND SEARCH FOR POKEMON
// searchButton.onclick = searchForPokemon;  // via handler
searchButton.addEventListener('click', searchForPokemon);

async function searchForPokemon(event){
  console.log("Clicked target ID: " + event.target.id);
  const searchVal = inputField.value.toLowerCase();
  console.log("Serach value: " + searchVal);
  // add loading to dom
  loading.style.opacity = "1";
  pokeGridContainer.innerHTML = "";
  // get search type
  let option = selectField.value;
  // let pokemon = [];
  if (option === "name") {
    // create a promise object
    const pokemonNamePromise = getPokemonByName(`${searchVal}`);
    // when promise is fulfilled, execute callback function
    pokemonNamePromise.then( (pokemon) => {
      loading.style.opacity = '0';
      if (pokemon != null) {
        console.log("Pokemon found: " + pokemon);
        createPokemonCard(pokemon);
      } else {
        createNotFound();
      }
    });
  }

  else if (option === "type") {
    const pokemonPromise = getAllPokemonByType(`${searchVal}`);
    pokemonPromise.then((pokemon) => {
      console.log("All Pokemon for type found: " + pokemon);
      loading.style.opacity = '0';

      if (pokemon == null){
        createNotFound();
      }
    })
  }
}

// GENERATE POKEMON LIST ITEM AND ADD IT TO THE DOM
function createPokemonCard(pokemon) {
  const pokeListItem = document.createElement("div");
  pokeListItem.classList.add("poke-list-item");

  // Fix for capitalizing first letter
  const dexNumber = pokemon.species.url.split("/")[6];
  const pokeName = (pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1));
  const pokeImg = pokemon.sprites.front_default;
  const pokeTypes = pokemon.types.map(el => el.type.name);

  // Build out the html for the item
  const pokeInnerHTML = `
    <div class="info-container">
        <h2>#${dexNumber}</h2>
        <h2>${pokeName}</h2>
        <p>type: ${pokeTypes}</p>
    </div>
  <div class="img-container"><img src="${pokeImg}"></div>
  `;

  // Append card to the grid container
  pokeListItem.innerHTML = pokeInnerHTML;
  pokeGridContainer.appendChild(pokeListItem);
}

function createNotFound(){
  console.log("Sorry, no matches found");
  // add an html element that says no matches found

  const errListItem = document.createElement("div");
  errListItem.classList.add("poke-list-item");

  const pokeInnerHTML = `
    <div class="info-container">
        <h2>MissingNo.</h2>
        <p>No matching results</p>
    </div>
  <div class="img-container"><img src="../images/error.png">
  </div>
  `;

  errListItem.innerHTML = pokeInnerHTML;
  pokeGridContainer.appendChild(errListItem);
}

// API CALLS ----------------

// Fetch a Pokemon by name
async function getPokemonByName(name) {
  try{
    //
    const responsePromise = await fetchWithTimeout((`${URL}/pokemon/${name}`), {timeout: 2000})
        .catch(e => {
          console.log(e);
        });

    if (responsePromise.status != 200){

      // stop loading screen
      loading.style.opacity = '0';
      console.log("status from api call: " + responsePromise.status);
      // show lack of results from completed call in the dom
      return null;

    } else {
      // the .json method parses the json into a JavaScript object
      const pokemon = await responsePromise.json();
      console.log(pokemon);
      return pokemon;
    }

  } catch (error){
    console.log(error);
  }

}

async function getAllPokemonByType(type) {
  try {
    const res = await fetchWithTimeout(`${URL}/type/${type}`, {timeout: 3000})
        .catch(e => {
          console.log(e);
          // createNotFound();
          return null;
        });

    if (res.status != 200){
      console.log("status from api call: " + res.status);
      return null;
    }

    const pokemonType = await res.json();
    const pokemon = [];

    for(let i = 0; i < pokemonType.pokemon.length; i++) {
      const pokePromise = getPokemonByName(pokemonType.pokemon[i].pokemon.name);
      pokePromise.then((pokePromRes) => {
        if (pokePromRes.sprites.front_default) {
          pokemon.push(pokePromRes);
          createPokemonCard(pokePromRes);
          pokemon.sort();
        }
      });
    }
    let dex = pokemon.sort();
    return dex;
  } catch (error) {
    loading.style.opacity = '0';
  }

}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}


