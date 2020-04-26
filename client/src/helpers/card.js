export default class Card {
  constructor(scene) {
    this.render = (x, y, sprite) => {
      let card = scene.add
        .image(x, y, sprite)
        .setDisplaySize(150, 220)
        .setInteractive();
      scene.input.setDraggable(card);
      return card;
    };
  }
}
