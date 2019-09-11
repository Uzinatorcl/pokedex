$(document).ready(initializeApp)

var pokemonDataRecieved = {};
var pokemonToDisplay = {};
var pokemonCurrentlyDisplayed = null;

function initializeApp() {
fetchPokemonFromServer();
addEventListeners();
}

function addEventListeners() {
  $('body').on('click', '.pokemon', displayPokemon);
}

function fetchPokemonFromServer() {
  var pokemonDataSent = {
    'url': "https://pokeapi.co/api/v2/pokemon/?limit=151",
    success: pokemonDataRecievedSuccessfully
  }
  $.ajax(pokemonDataSent)
}

function pokemonDataRecievedSuccessfully(data) {
  pokemonDataRecieved = data;

  for(var pokeIndex = 0; pokeIndex < pokemonDataRecieved.results.length; pokeIndex++) {
    var pokeID = "" + (pokeIndex + 1);
    var pokemonContainer = $('<div>').addClass('pokemon ' + pokemonDataRecieved.results[pokeIndex].name);
    var pokemonID = $('<div>').addClass('pokemonID').text(pokeID);
   //debugger;
    var pokemonName = $('<div>').addClass('pokemonName').text(pokemonDataRecieved.results[pokeIndex].name);
    pokemonContainer.append(pokemonID, pokemonName);
    $('.interact').append(pokemonContainer);
  }

}

function displayPokemon(event) {
  var pokemonToRequestIndex = parseInt(event.currentTarget.firstChild.textContent) - 1
  var pokemonToRequestURL = pokemonDataRecieved.results[pokemonToRequestIndex].url
  console.log(pokemonToRequestURL);
  var pokemonToRequest = {
    'url' : pokemonToRequestURL,
    success : createPokemon
  };
  $.ajax(pokemonToRequest);
}

function createPokemon(data) {
  pokemonToDisplay = data;
  var pokemonDisplayImageAddress = pokemonToDisplay.sprites.front_default
  var pokemonDisplayName = pokemonToDisplay.name
  console.log(pokemonDisplayName);
  pokemonCurrentlyDisplayed = new Pokemon(pokemonDisplayName, pokemonDisplayImageAddress);
  console.log(pokemonCurrentlyDisplayed);
  pokemonCurrentlyDisplayed.render();
}
