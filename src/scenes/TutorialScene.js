import { createDrawnButton } from '../components/ButtonManager.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/assetValues.js';

export let firefighter = { x: null, y: null };
export let dialog = { x: null, y: null };
export let dialogText = { x: null, y: null };
export let background = { x: null, y: null };
export var buttonR = { x: null, y: null };
let d_count = 0;

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        console.log("TutorialScene Constructor Called");
    }

    preload() {
        this.load.image('page 1', 'assets/tutorial icons/page-1.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.image('dialog', 'assets/tutorial/dialog.png');
        this.load.image('firefighter', 'assets/tutorial/firefighter.png');

        this.load.text('text', 'assets/myTextFile.txt');
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
                    this.scene.launch('MapScene')
                    this.time.delayedCall(2000, () => this.createTutorialContent());
                }
            });
        } else {
            // If WebFont isn't available, still create the content
            this.scene.launch('MapScene')
            this.time.delayedCall(2000, () => this.createTutorialContent());
        }
    }

    createTutorialContent(scene) {

        this.scene.bringToTop('TutorialScene');
        
        // Scale and Position Parameters
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Add background
        background = this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x2d3436).setAlpha(0.9).setScale(4);
        
        // Add back button
        const backButton = createDrawnButton(this, {
            x: 0 + 35,
            y: 0 + 35,
            width: 40,
            height: 40,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: '<-',
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            onClick: () => {
                this.scene.stop('TutorialScene');
                this.scene.stop('MapScene');
                this.scene.stop('UIScene');
                window.location.reload();
            }
        });

        // Narrator Properties
        firefighter = this.add.sprite(centerX, centerY, 'firefighter')
        .setOrigin(0.5)
        .setScale(4)
        .setX(this.cameras.main.width / 1.6)
        .setY(this.cameras.main.height / 1.4);

        dialog = this.add.sprite(centerX, centerY, 'dialog')
        .setOrigin(0.5)
        .setScale(4)
        .setX(centerX + 70)
        .setY(centerY + 110);    
        
        dialog.setInteractive({ pixelPerfect: true });
  
        // Load dialog text for display
        fetch('tutorialDialog.txt')
        .then(response => response.text())
        .then(text => {

            dialogText = this.add.text(centerX, centerY, text.split("\n")[0], {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                color: '#000000',
                wordWrap: { width: 300, useAdvancedWrap: true },
                align: 'center'
                
            }).setOrigin(0.5).setX(centerX + 70).setY(centerY + 110);

            d_count = 1;
            let toggle = false;
            
            // Roll through all dialog to aid the player in how to play the game
            dialog.on('pointerdown', function() {
                dialogText.setText(text.split("\n")[d_count]);
                if (toggle === false) d_count += 1;

                // Reset location of talking firefighter when the game begins
                if (d_count >= 20) {

                    background.setAlpha(0);
                    
                }

                if (d_count > 62) {
                    firefighter.setAlpha(0);
                    dialog.setAlpha(0);
                    dialogText.setAlpha(0);
                }
            });
        })
    }
    
    // Dynamically updates positions of UI elements
    update() {

        background.x = this.cameras.main.width;
        background.y = this.cameras.main.height;

        // Return to the main menu to start a real game
        if (d_count > 62) {
            this.scene.stop('TutorialScene');
            this.scene.stop('MapScene');
            this.scene.stop('UIScene');
            window.location.reload();
        }

    }
}
