class Pokemon {
  constructor(name, image, types, pokedexNumber, species, abilities) {
    this.pokemonName = name;//string
    this.pokemonImageAddress = image;//string url
    this.pokemonTypes = types;//array of types
    this.pokedexNumber = pokedexNumber;//number
    this.species = species;//api url first, then information
    this.abilities = abilities; //array of obj first then array
    this.region = null; //null first then url string then just string
    this.summaryInfo = null;//null first, then string
    this.domElements = {
      displayText : $('.displayText'),
      displayImage: $('.displayImage'),
      basicInformation: $('.basicInformation'),
      basicInformationTitle: $('.basicInformationTitle'),
      basicInformationDisplay: $('.basicInformationDisplay'),
      baseStatsTitle: $('.baseStatsTitle'),
      baseStatsDisplay: $('.baseStatsDisplay'),
      summaryTitle: $('.summaryTitle'),
      summaryDisplay: $('.summaryDisplay')
    }
    this.gotPokemonSpeciesInfo = this.gotPokemonSpeciesInfo.bind(this);
  }
  render() {
    //render the pokemon
    //render first page
    this.domElements.displayText.text(this.pokemonName);
    this.domElements.displayImage.css('background-image', 'url(' + this.pokemonImageAddress + ')');
    //render second page
    this.getPokemonSpeciesInfo();
  }

  renderSecondPage() {
    this.domElements.basicInformationTitle.text(this.region);
    var nationalDexNumber = $('<div>').addClass('nationalDexNumber').text('National Dex: ').append('<span>' + this.pokedexNumber + '</span>');
    var typeArea = $('<div>').addClass('typeArea');
      for(var typeIndex = 0; typeIndex < this.pokemonTypes.length; typeIndex++) {
        var newTypeSpan = $('<span>').addClass('type ' + this.pokemonTypes[typeIndex]).text(this.pokemonTypes[typeIndex]);
        typeArea.append(newTypeSpan);
      }
    var species = $('<div>').addClass('species').text(this.species);
    var abilitiesTitle = $('<div>').addClass('abilitiesTitle').text('Abilities');
    var abilityList = $('<div>').addClass('abilities');
    for (var abilityIndex = 0; abilityIndex < this.abilities.length; abilityIndex++) {
      var newAbilitySpan = $('<span>').text(this.abilities[abilityIndex] + ' ');
      abilityList.append(newAbilitySpan);
    }
    this.domElements.basicInformationDisplay.append(nationalDexNumber, typeArea, species, abilitiesTitle, abilityList);
    this.domElements.basicInformationDisplay.css('background-image', '');
    // this.domElements.basicInformationDisplay
  }
  getPokemonSpeciesInfo() {
    var speciesRequest = {
      'url' : this.species,
      success: this.gotPokemonSpeciesInfo
    }
    $.ajax(speciesRequest);
  }
  gotPokemonSpeciesInfo(data) {
    var englishCheck = /^[A-Za-z0-9\s.!,?’é]*$/
    //got species list
    this.species = data.genera[2].genus;
    console.log(data);
    //got abilities list
    this.abilities = this.abilities.map(function (ability) {
      return ability.ability.name
    })
    console.log(this.abilities);
    //got types
    this.pokemonTypes = this.pokemonTypes.map(function (types) {
      return types.type.name;
    })
    //got region name
    this.region = data.generation.name;
    console.log(this.region);
    var regionConversion = {
      'generation-i': 'Kanto Region',
      'generation-ii': 'Johto Region',
      'generation-iii': 'Hoenn Region',
      'generation-iv': 'Sinnoh Region',
      'generation-v': 'Unova Region',
      'generation-vi': 'Kalos Region',
      'generation-vii' : 'Alola Region',
      'generation-viii' : 'Galar Region'
    }
    if (regionConversion.hasOwnProperty(this.region)) {
      this.region = regionConversion[this.region];
    }
    console.log(this.region);

    //got summary
    if (englishCheck.test(data.flavor_text_entries[1].flavor_text)) {
      this.summaryInfo = data.flavor_text_entries[1].flavor_text
      console.log(this.summaryInfo);
    } else {
      for (var summaryIndex = 0; summaryIndex < data.flavor_text_entries.length; summaryIndex++) {
        if(englishCheck.test(data.flavor_text_entries[summaryIndex].flavor_text)) {
          this.summaryInfo = data.flavor_text_entries[summaryIndex].flavor_text;
          break;
        }
      }
      console.log(this.summaryInfo);
    }
    this.renderSecondPage();
  }

}
