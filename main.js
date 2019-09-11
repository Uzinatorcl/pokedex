$(document).ready(initializeApp)

var pokemonDataSent = {};
var pokemonDataRecieved = {};

function initializeApp() {
fetchPokemonFromServer();
addEventListeners();
}

function addEventListeners() {
  $('body').on('click', '.pokemon', displayPokemon);
}

function fetchPokemonFromServer() {
  pokemonDataSent = {
    'url': "https://pokeapi.co/api/v2/pokemon/?limit=151",
    success: pokemonRecievedSuccessfully
  }
  $.ajax(pokemonDataSent)
}

function pokemonRecievedSuccessfully(data) {
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
  console.log(pokemonDataRecieved.results[pokemonToRequestIndex].url);
}
