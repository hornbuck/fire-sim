export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('logo', 'assets/title-logo.jpeg');
    }

    create() {
        // Check if we should skip the intro and go directly to the game
        if (sessionStorage.getItem('skipIntro') === 'true') {
            // Clear the flag so it doesn't affect future game starts
            sessionStorage.removeItem('skipIntro');
            
            // Start the game immediately
            console.log("Skipping intro and starting game directly");
            this.scene.start('MapScene');
            this.scene.launch('UIScene');
            return;
        }

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Display logo and scale it to fit the screen
        const logo = this.add.image(centerX, centerY, 'logo').setOrigin(0.5);
        
        // Scale the image to fit the width, maintaining aspect ratio
        const scaleX = gameWidth / logo.width;
        const scaleY = gameHeight / logo.height;
        const scale = Math.max(scaleX, scaleY); // Choose max to cover the entire space

        logo.setScale(scale);

        // Create the text with proper styling
        const startText = this.add.text(centerX, gameHeight * 0.8, 'Click to Start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            fixedWidth: 500,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        // Create the flashing animation
        const flashingTween = this.tweens.add({
            targets: startText,
            alpha: 0.6,         // Flash to 60% opacity
            duration: 700,      
            yoyo: true,         // Return to 100% opacity
            repeat: -1,         // Repeat indefinitely
            ease: 'Sine.easeInOut'
        });

        // Add hover effect that pauses the flashing
        startText.on('pointerover', () => {
            // Pause the flashing animation
            flashingTween.pause();
            
            // Reset alpha to full in case we paused during fade
            startText.setAlpha(1);
            
            // Apply hover effect
            startText.setBackgroundColor('#333333');
            this.tweens.add({
                targets: startText,
                scale: 1.05,
                duration: 100
            });
        });

        // Resume flashing when pointer leaves
        startText.on('pointerout', () => {
            // Resume the flashing animation
            flashingTween.resume();
            
            // Return to normal state
            startText.setBackgroundColor('#000000');
            this.tweens.add({
                targets: startText,
                scale: 1,
                duration: 100
            });
        });

        // Start the game on click
        startText.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}