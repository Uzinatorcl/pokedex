class Pokemon {
  constructor(name, image, types, pokedexNumber, species, abilities) {
    this.pokemonName = name;//string
    this.pokemonImageAddress = image;//string url
    this.pokemonTypes = types;//array of types
    this.pokedexNumber = pokedexNumber;//number
    this.species = species;//api url first, then information
    this.abilities = abilities; //array of obj first then array
    this.summaryInfo = null;//null first, then string
    this.domElements = {
      displayText : $('.displayText'),
      displayImage: $('.displayImage'),
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
    console.log(this.abilities);
    //LEFT OFF HERE ON ABILITIES
    this.getPokemonSpeciesInfo();
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
    this.species = data.genera[2].genus

    //got abilities list
    this.abilities = this.abilities.map(function (ability) {
      return ability.ability.name
    })
    console.log(this.abilities);
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
  }

}
