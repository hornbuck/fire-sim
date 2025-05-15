import { createDrawnButton } from '../components/ButtonManager.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/assetValues.js';

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
            x: centerX - 360,
            y: centerY - 270,
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
                this.scene.start('MenuScene');
            }
        });

        // Narrator Properties
        let firefighter = this.add.sprite(centerX, centerY, 'firefighter')
        .setOrigin(0.5)
        .setScale(4)
        .setX(centerX + 100)
        .setY(centerY + 100);

        let dialog = this.add.sprite(centerX, centerY, 'dialog')
        .setOrigin(0.5)
        .setScale(5)
        .setX(centerX)
        .setY(centerY);

        let t_storage = [
            `According to the Incident Command System,\n there is a Type 1 wildfire in Oregon.`, 
            `The fire is HUGE.\n\n Apparently, it was caused by a lightning strike.`, 
            `I'm sending you with the highest level of coordination and resources we have.`, 
            `But first, I need to show you how everything works.`,
            `The vertical bar on the right lists the available assets.`,
            `It looks like you have 10 firefighters, 5 fire extinguishers ...`,
            `...3 helicopters, 3 firetrucks, 2 airtankers, 1 hotshot crew...`,
            `...and 5 smokejumpers. Let's start fighting this fire!`,
            `Click the green Start button at the top of the screen.`,
            `The fire is spreading!`,
            `Click on the firefighter square, then deploy it by selecting a burning tile.`,
            `Fantastic! Click the firefighter square again to deactivate it.`,
            `Notice the flammability and fuel levels in the box in the top left corner.`,
            `Fuel is what feeds the fire and keeps it burning.`,
            `When the fuel runs out, the terrain becomes burnt.`,
            `Flammability is how fast the terrain is likely to catch fire.`,
            `Your job is to save as many houses and terrain tiles as possible.`,
            `Let's deploy some more assets. This fire is growing fast.`,
            `Try to deploy 3 helicopters.`,
            `Oh! Looks like there is a cooldown. Use fire extinguishers while you wait.`,
            `Alternate between different resources to fight as many flames as you can.`,
            `Uh oh! You ran out! Click the shop icon in the bottom right corner.`,
            `Here, you can purchase more assets! Click any of the green plus signs.`,
            `This controls the number of assets you want to buy.`,
            `Believe it or not, you actually earned some coins already!`,
            `Every time you put out a fire, you earn coins.`,
            `When you're ready, click Purchase.`,
            `Let's go fight more fires!`
        ]

        let marker = this.add.rectangle(centerX, centerY, gameWidth - 120, gameHeight - 70, '0x9ff86f', 0)
                .setX(centerX - 50)
                .setY(centerY - 30)
                .setStrokeStyle(5, 0xffffff, 0)
                .setOrigin(0.5)
                .setAlpha(0.5);

        let text = this.add.text(centerX, centerY - 200, `Welcome to the crew, Rookie! We need your help.`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#000000',
            wordWrap: { width: 300, useAdvancedWrap: true },
            align: 'center'
            
        }).setOrigin(0.5).setX(centerX).setY(centerY);

        let d_count = 0;
        let toggle = false;
        marker.alwaysEnabled = false
        
        // Roll through all dialog to aid the player in how to play the game
        this.input.on('pointerdown', (pointer) => {
            if (marker.getBounds().contains(pointer.x, pointer.y)) {   // only the game area is clickable
                console.log(`D_COUNT: ${d_count}`);
                text.setText(t_storage[d_count]);
                if (toggle === false) d_count += 1;

                // Pause the game when explaining fuel and flammability
                if (d_count >= 13 && d_count <= 18) {
                    this.scene.pause('MapScene');
                } else {
                    this.scene.resume('MapScene');
                }

                // Give the player some time to play with the assets until they run out OR buying assets from the shop
                if (d_count === 22 || d_count == 28) {
                    dialog.setVisible(false);
                    text.setVisible(false);
                    d_count -= 1;
                    toggle = true;
                }

                // Reset location of talking firefighter when the game begins
                if (d_count >= 5) {

                    background.setAlpha(0);
                    firefighter.x = centerX - 230;
                    firefighter.y = centerY + 120;
                    firefighter.flipX = true;
                    firefighter.setScale(2);

                    dialog.x = centerX - 180;
                    dialog.y = centerY + 50;
                    dialog.flipX = true;
                    dialog.setScale(3);

                    text.setFontSize('14px');

                    text.setStyle({
                        wordWrap: { width: 200, useAdvancedWrap: true }
                    });
        
                    text.x = centerX - 170;
                    text.y = centerY + 55;
                
                }

                // Pause the game when the player runs out of an asset
                if (d_count < 27) {
                    if (hose === 0 || extinguisher === 0 || helicopter === 0 || firetruck === 0 || airtanker === 0 || hotshotcrew === 0 || smokejumper === 0) {
                        this.scene.pause('MapScene');
                        dialog.setVisible(true);
                        text.setVisible(true);
                        if (toggle === true) d_count += 1;
                        toggle = false;
                    }
                }
            }
        });
    }
}