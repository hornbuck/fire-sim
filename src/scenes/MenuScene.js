export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        console.log("MenuScene Constructor Called");
    }

    preload() {
        this.load.image('game menu', 'assets/game-menu.png');
        this.load.image('start tutorial', 'assets/tutorial icons/tutorial-button.png');
        this.load.image('play game', 'assets/tutorial icons/play-button.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Load WebFont before creating text
        WebFont.load({
            google: {
                families: ['Press Start 2P']
            },
            active: () => {
                this.createMenuElements();
            }
        });

        // Create styled background
        const bgOverlay = this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0x2d3436, 0.7);

        // Use the original menu image as a background but slightly faded
        const menuBackground = this.add.image(centerX, centerY, 'game menu').setOrigin(0.5);
        const scaleX = gameWidth / menuBackground.width;
        const scaleY = gameHeight / menuBackground.height;
        const scale = Math.max(scaleX, scaleY); // Choose max to cover the entire space
        menuBackground.setScale(scale).setAlpha(0.5);

        // Create title text
        const titleText = this.add.text(centerX, centerY - 150, 'WILDFIRE COMMAND', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#ff6600',
            strokeThickness: 6,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Create buttons using Phaser's native graphics capabilities (matching style guide)
        this.createStyledButtons();
    }

    createMenuElements() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Create subtitle (if needed)
        this.add.text(centerX, centerY - 90, 'Firefighting Simulation', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    }

    createStyledButtons() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Tutorial button
        const tutorialButton = this.createButton(
            centerX, 
            centerY - 20, 
            250, 
            60, 
            'Tutorial', 
            0x228B22, // Green color from style guide
            () => {
                console.log("tutorial!");
                this.scene.start('TutorialScene');
            }
        );
        
        // Play button
        const playButton = this.createButton(
            centerX, 
            centerY + 70, 
            250, 
            60, 
            'Play Game', 
            0x8B0000, // Red color from style guide
            () => {
                console.log("play!");
                this.scene.start('MapScene');
                this.scene.launch('UIScene');
            }
        );

        // Add subtle animations for visual interest
        this.tweens.add({
            targets: tutorialButton,
            y: tutorialButton.y - 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: playButton,
            y: playButton.y + 5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 200 // Offset animation from tutorial button
        });
    }

    // Helper function to create consistent styled buttons
    createButton(x, y, width, height, text, color, callback) {
        const buttonContainer = this.add.container(x, y);
        
        // Button background
        const background = this.add.rectangle(0, 0, width, height, color, 1)
            .setStrokeStyle(3, 0xffffff, 0.8)
            .setOrigin(0.5);
        
        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add to container
        buttonContainer.add([background, buttonText]);
        
        // Make interactive
        background.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                // Determine the correct hover color based on the original color
                const hoverColor = color === 0x228B22 ? 0x2E8B57 : 0xA52A2A;
                
                // Hover effect - use the appropriate hover color and scale up slightly
                background.setFillStyle(hoverColor);
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                // Reset to normal state
                background.setFillStyle(color);
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            })
            .on('pointerdown', () => {
                // Press effect
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 50,
                    yoyo: true,
                    onComplete: callback
                });
            });
        
        return buttonContainer;
    }
}