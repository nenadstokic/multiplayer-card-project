import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';
import io from 'socket.io-client';

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

    this.isPlayerA = false;
    this.opponentCards = [];

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);
    this.dealer = new Dealer(this);

    this.socket = io('http://localhost:3000');
    this.socket.on('connect', function() {
      console.log('Connected!');
    });

    this.socket.on('isPlayerA', function() {
      self.isPlayerA = true;
    });

    this.socket.on('dealCards', function() {
      self.dealer.dealCards();
      self.dealText.disableInteractive();
    });

    this.socket.on('cardPlayed', function(gameObject, isPlayerA) {
      if (isPlayerA !== self.isPlayerA) {
        let sprite = gameObject.textureKey;
        self.opponentCards.shift().destroy();
        self.dropZone.data.values.cards++;
        let card = new Card(self);
        card
          .render(
            self.dropZone.x - 350 + self.dropZone.data.values.cards * 50,
            self.dropZone.y,
            sprite
          )
          .disableInteractive();
      }
    });
    this.dealText = this.add
      .text(75, 350, ['DEAL CARDS'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00FFFF')
      .setInteractive();

    this.dealText.on('pointerdown', function() {
      self.socket.emit('dealCards');
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
      self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
    });
  }

  update() {}
}
