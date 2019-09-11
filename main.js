$(document).ready(initializeApp)
var pokemonData = {}

function initializeApp() {

}

function fetchPokemonFromServer() {
  pokemonData = {
    'url': //https://pokeapi.co/api/v2/pokemon/?limit=151
  }
}

function pokemonRecievedSuccessfully(data) {
  console.log(data);
}
