import { createDrawnButton } from '../components/ButtonManager.js';

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        console.log("TutorialScene Constructor Called");
    }

    preload() {
        this.load.image('page 1', 'assets/tutorial icons/page-1.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.image('basic-game', 'assets/tutorial/basic-game.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Load WebFont before creating text
        if (typeof WebFont !== 'undefined') {
            WebFont.load({
                google: {
                    families: ['Press Start 2P']
                },
                active: () => {
                    this.createTutorialContent();
                }
            });
        } else {
            // If WebFont isn't available, still create the content
            this.createTutorialContent();
        }
    }

    createTutorialContent() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Add background
        const background = this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x2d3436).setAlpha(0.9);
        
        // Add title
        const title = this.add.text(centerX, centerY - 200, 'Tutorial', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        
        
        // Tutorial content - use the original image for content if needed
        const tutorialContent = this.add.image(centerX, centerY, 'page 1').setOrigin(0.5).setDepth(1);
        const basicGame = this.add.image(centerX, centerY, 'basic-game').setOrigin(0.5).setDepth(2);
        const scaleX = gameWidth / basicGame.width;
        const scaleY = gameHeight / basicGame.height;
        const scale = Math.max(scaleX, scaleY); // Choose max to cover the entire space
        basicGame.setScale(scale).setAlpha(0.5);

        // Add back button
        const backButton = createDrawnButton(this, {
            x: centerX,
            y: centerY + 200,
            width: 250,
            height: 50,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: 'Back to Menu',
            fontSize: '16px',
            onClick: () => {
                this.scene.start('MenuScene');
            }
        });
    }
}