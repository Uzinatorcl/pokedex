$(document).ready(initializeApp)

var pokemonDataRecieved = {};
var pokemonToDisplay = {};
var pokemonCurrentlyDisplayed = null;
var currentlySelectedPokemon = $('.currentSelection');
var scrollPosition = 0

function initializeApp() {
fetchPokemonFromServer();
addEventListeners();
}

function addEventListeners() {
  $('body').on('click', '.pokemon', displayPokemon);
  $('body').on('click', '.upButton', upButtonPressed);
  $('body').on('click', '.downButton', downButtonPressed);
  $('body').on('click', '.leftButton', leftButtonPressed);
  $('body').on('click', '.rightButton', rightButtonPressed);
  $('body').on('click', '.submit', submitButtonPressed);
  $(document).on('keydown', buttonPressed);
}

function fetchPokemonFromServer() {
  var pokemonDataSent = {
    'url': "https://pokeapi.co/api/v2/pokemon/?limit=151",
    success: pokemonDataRecievedSuccessfully,
    error: serverError
  }
  $.ajax(pokemonDataSent)
}

function pokemonDataRecievedSuccessfully(data) {
  pokemonDataRecieved = data;

  for(var pokeIndex = 0; pokeIndex < pokemonDataRecieved.results.length; pokeIndex++) {
    var pokeID = "" + (pokeIndex + 1);
    var pokemonContainer = $('<div>').addClass('pokemon ' + pokemonDataRecieved.results[pokeIndex].name);
    if (pokeIndex === 0) {
      pokemonContainer.addClass('currentSelection');
    }
    var pokemonID = $('<div>').addClass('pokemonID').text(pokeID);
   //debugger;
    var pokemonName = $('<div>').addClass('pokemonName').text(pokemonDataRecieved.results[pokeIndex].name);
    pokemonContainer.append(pokemonID, pokemonName);
    $('.interact').append(pokemonContainer);
  }

}

function displayPokemon(event) {
  loadingScreen();
  var pokemonToRequestIndex = parseInt(event.currentTarget.firstChild.textContent) - 1
  var pokemonToRequestURL = pokemonDataRecieved.results[pokemonToRequestIndex].url
  console.log(pokemonToRequestURL);
  var pokemonToRequest = {
    'url' : pokemonToRequestURL,
    success : createPokemon,
    error: serverError
  };
  $.ajax(pokemonToRequest);
}
function displayPokemonViaSubmit() {
  loadingScreen();
  var pokemonToRequestIndex = parseInt($('.currentSelection')[0].firstChild.textContent)-1;
  var pokemonToRequestURL = pokemonDataRecieved.results[pokemonToRequestIndex].url
  console.log(pokemonToRequestURL);
  var pokemonToRequest = {
    'url': pokemonToRequestURL,
    success: createPokemon,
    error: serverError
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

function loadingScreen() {
  $('.displayImage').css('background-image', "url('images/loading2.gif')");
  $('.displayText').text('Loading...')
}
function serverError() {
  $('.displayImage').css('background-image', "url('images/server-error.png')");
}

function buttonPressed(event) {
  var controls = {
    40 : downButtonPressed,
    38 : upButtonPressed,
    37 : leftButtonPressed,
    39 : rightButtonPressed,
    13 : submitButtonPressed
  }
  if(controls.hasOwnProperty(event.keyCode)) {
    var control = controls[event.keyCode]
    control();
  }

}

function upButtonPressed() {
  var previousSelection = $('.currentSelection').prev()
  if (previousSelection[0] === undefined) {
    return;
  }
  console.log(previousSelection[0]);
  $('.currentSelection').removeClass('currentSelection');
  previousSelection.addClass('currentSelection');
  //previousSelection[0].scrollIntoView();
  scrollToNextPokemon(-12.8);
}
function downButtonPressed() {
  var nextSelection = $('.currentSelection').next()
  if(nextSelection[0] === undefined) {
    return;
  }
  console.log(nextSelection[0]);
  $('.currentSelection').removeClass('currentSelection');
  nextSelection.addClass('currentSelection');
  //nextSelection[0].scrollIntoView();
  scrollToNextPokemon(12.8);
}
function leftButtonPressed() {
  console.log('left button pressed');
}
function rightButtonPressed() {
  console.log('right button pressed');
}
function submitButtonPressed() {
  console.log('submit button pressed');
  displayPokemonViaSubmit();
}

function scrollToNextPokemon(scrollDirection) {
  scrollPosition += scrollDirection;
  console.log(scrollPosition);
  $('.interact').animate({
    scrollTop: scrollPosition + 'px'
  }, 200)
}
