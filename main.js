$(document).ready(initializeApp)

var pokemonDataRecieved = {};
var pokemonToDisplay = {};
var pokemonCurrentlyDisplayed = null;
var scrollPosition = 0;
var displayScrollPositon = 0;
var audio = new Audio;

function initializeApp() {
  audio.volume = 0;
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
  $('body').on('click', '.soundButton', adjustVolume);
  $(document).on('keydown', buttonPressed);
}

function fetchPokemonFromServer() {
  var pokemonDataSent = {
    'url': "https://pokeapi.co/api/v2/pokemon/?limit=802",
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
    var pokemonName = $('<div>').addClass('pokemonName').text(pokemonDataRecieved.results[pokeIndex].name);
    pokemonContainer.append(pokemonID, pokemonName);
    $('.interact').append(pokemonContainer);
  }

}

function displayPokemon(event) {
  loadingScreen();
  var pokemonToRequestIndex = parseInt(event.currentTarget.firstChild.textContent) - 1
  var pokemonToRequestURL = pokemonDataRecieved.results[pokemonToRequestIndex].url
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
  var pokemonToRequest = {
    'url': pokemonToRequestURL,
    success: createPokemon,
    error: serverError
  };
  $.ajax(pokemonToRequest);
}
function createPokemon(data) {
  lightUpResponsive();
  pokemonToDisplay = data;
  var pokemonDisplayImageAddress = pokemonToDisplay.sprites.front_default;
  var pokemonDisplayName = pokemonToDisplay.name;
  var pokemonTypes = pokemonToDisplay.types;
  var pokemonDexNumber = pokemonToDisplay.id;
  var pokemonSpeciesUrl = pokemonToDisplay.species.url
  var pokemonAbilityList = pokemonToDisplay.abilities
  var pokemonStats = pokemonToDisplay.stats;
  pokemonCurrentlyDisplayed = new Pokemon(pokemonDisplayName, pokemonDisplayImageAddress, pokemonTypes, pokemonDexNumber, pokemonSpeciesUrl, pokemonAbilityList, pokemonStats);
  pokemonCurrentlyDisplayed.render();
}

function loadingScreen() {
  $('.displayImage, .basicInformationDisplay, .baseStatsDisplay, .summaryDisplay')
  .css('background-image', "url('images/loading2.gif')").empty();
  $('.displayText, .basicInformationTitle, .baseStatsTitle, .summaryTitle ').text('Loading...');
}
function serverError() {
  $('.displayImage, .basicInformationDisplay, .baseStatsDisplay, .summaryDisplay').css('background-image', "url('images/server-error.png')");
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
    sounds('cantMove');
    return;
  }
  responsiveButton('upButton');
  $('.currentSelection').removeClass('currentSelection');
  previousSelection.addClass('currentSelection');
  scrollToNextPokemon(-12.8);
}
function downButtonPressed() {
  var nextSelection = $('.currentSelection').next()
  if(nextSelection[0] === undefined) {
    sounds('cantMove');
    return;
  }
  responsiveButton('downButton');
  $('.currentSelection').removeClass('currentSelection');
  nextSelection.addClass('currentSelection');
  scrollToNextPokemon(12.8);
}
function leftButtonPressed() {
  if (displayScrollPositon === 0) {
    sounds('cantMove');
    return;
  }
  sounds('swipe');
  responsiveButton('leftButton');
  scrollToNextDisplay(-250)
}
function rightButtonPressed() {
  if(displayScrollPositon === 750) {
    sounds('cantMove');
    return;
  }
  sounds('swipe');
  responsiveButton('rightButton');
  scrollToNextDisplay(250);
}
function submitButtonPressed() {
  sounds('selected');
  responsiveButton('submit');
  displayPokemonViaSubmit();
}

function responsiveButton(target) {
  $('.' + target).css('opacity', .4);
  setTimeout(function () {
    $('.' + target).css('opacity', .0);
  }, 150);
}

function lightUpResponsive() {
  $('.lightUp').toggleClass('hidden');
  setTimeout(function () {
    $('.lightUp').toggleClass('hidden');
  }, 500);
}


function scrollToNextPokemon(scrollDirection) {
  scrollPosition += scrollDirection;
  $('.interact').animate({
    scrollTop: scrollPosition + 'px'
  }, 150)
}

function scrollToNextDisplay(scrollDirection) {
  displayScrollPositon += scrollDirection;
  $('.overallDisplay').animate({
    scrollLeft: displayScrollPositon + 'px'
  }, 150)
}
function sounds(fileName) {
  audio.src = 'audio/' + fileName + '.mp3';
  audio.play();
}
function adjustVolume(event) {
  var newAudioValue = event.target.value/100
  audio.volume = newAudioValue;
}
