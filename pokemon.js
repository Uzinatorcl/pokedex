class Pokemon {
  constructor(name, image) {
    this.pokemonName = name;
    this.pokemonImageAddress = image;
    this.domElements = {
      displayText : $('.displayText'),
      displayImage: $('.displayImage')
    }
  }
  render() {
    //render the pokemon
    console.log(this.pokemonName, this.pokemonImageAddress);
    this.domElements.displayText.text(this.pokemonName);
    this.domElements.displayImage.css('background-image', 'url(' + this.pokemonImageAddress + ')');
  }

}
