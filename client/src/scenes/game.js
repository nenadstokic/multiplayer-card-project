import Card from '../helpers/card';
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game'
    });
  }

  preload() {
    this.load.image('blackCardFront', 'src/assets/BlackCardFront.png');
    this.load.image('blackCardBack', 'src/assets/BlackCardBack.png');
    this.load.image('redCardFront', 'src/assets/RedCardFront.png');
    this.load.image('redCardBack', 'src/assets/RedCardBack.png');
  }

  create() {
    let self = this;

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    this.dealCards = () => {
      for (let i = 0; i < 5; i++) {
        let playerCard = new Card(this);
        playerCard.render(475 + i * 100, 650, 'blackCardFront');
      }
    };

    this.dealText = this.add
      .text(75, 350, ['DEAL CARDS'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00FFFF')
      .setInteractive();

    this.dealText.on('pointerdown', function() {
      self.dealCards();
    });

    this.dealText.on('pointerover', function() {
      self.dealText.setColor('#ff69b4');
    });

    this.dealText.on('pointerout', function() {
      self.dealText.setColor('#00ffff');
    });

    this.input.on('dragstart', function(pointer, gameObject) {
      gameObject.setTint(0xff69b4);
      self.children.bringToTop(gameObject);
    });

    this.input.on('dragend', function(pointer, gameObject, dropped) {
      gameObject.setTint();
      //if its not dropped on dropzone, put it on position before dragging
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('drop', function(pointer, gameObject, dropZone) {
      dropZone.data.values.cards++;
      gameObject.x = dropZone.x - 350 + dropZone.data.values.cards * 50;
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
    });
  }

  update() {}
}
