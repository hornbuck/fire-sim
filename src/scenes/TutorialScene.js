import { createDrawnButton } from '../components/ButtonManager.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/assetValues.js';

export let firefighter = { x: null, y: null };
export let dialog = { x: null, y: null };
export let dialogText = { x: null, y: null };
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
        const background = this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x2d3436).setAlpha(0.9);

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
        .setY(this.cameras.main.height / 1.6);

        dialog = this.add.sprite(centerX, centerY, 'dialog')
        .setOrigin(0.5)
        .setScale(5)
        .setX(centerX)
        .setY(centerY + 50);
  
        // Load dialog text for display
        fetch('tutorialDialog.txt')
        .then(response => response.text())
        .then(text => {

            let marker = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, '0x9ff86f', 0)
                    .setX(centerX)
                    .setY(centerY)
                    .setStrokeStyle(5, 0xffffff, 0)
                    .setOrigin(0.5)
                    .setAlpha(0.5);

            dialogText = this.add.text(centerX, centerY, text.split("\n")[0], {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#000000',
                wordWrap: { width: 300, useAdvancedWrap: true },
                align: 'center'
                
            }).setOrigin(0.5).setX(centerX).setY(centerY + 50);

            d_count = 1;
            let toggle = false;
            marker.alwaysEnabled = false
            
            // Roll through all dialog to aid the player in how to play the game
            this.input.on('pointerdown', (pointer) => {
                if (marker.getBounds().contains(pointer.x, pointer.y)) {   // only the game area is clickable
                    console.log(`D_COUNT: ${d_count}`);
                    dialogText.setText(text.split("\n")[d_count]);
                    if (toggle === false) d_count += 1;

                    // Reset location of talking firefighter when the game begins
                    if (d_count >= 17) {

                        background.setAlpha(0);
                        firefighter.x = centerX - 230;
                        firefighter.y = centerY + 120;
                        firefighter.flipX = true;
                        firefighter.setScale(2);

                        dialog.x = centerX - 180;
                        dialog.y = centerY + 50;
                        dialog.flipX = true;
                        dialog.setScale(3);

                        dialogText.setFontSize('14px');

                        dialogText.setStyle({
                            wordWrap: { width: 200, useAdvancedWrap: true }
                        });
            
                        dialogText.x = centerX - 170;
                        dialogText.y = centerY + 55;
                    
                    }

                    // Pause the game when the player runs out of an asset
                    if (d_count < 27) {
                        if (hose === 0 || extinguisher === 0 || helicopter === 0 || firetruck === 0 || airtanker === 0 || hotshotcrew === 0 || smokejumper === 0) {
                            this.scene.pause('MapScene');
                            dialog.setVisible(true);
                            dialogText.setVisible(true);
                            if (toggle === true) d_count += 1;
                            toggle = false;
                        }
                    }
                }
            });
        })
    }
    
    // Dynamically updates positions of UI elements
    update() {
        if (d_count < 17) {
            firefighter.x = this.scale.width / 1.6;
            firefighter.y = this.scale.height - 225;
        }
    }
}
