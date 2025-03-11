export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('logo', 'assets/title-logo.jpeg');
    }

    create() {
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

        // Add start text
        const startText = this.add.text(centerX, gameHeight * 0.8, 'Click to Start', {
            fontFamily: 'Courier, monospace',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        startText.on('pointerdown', () => {
            this.scene.start('MapScene');
            this.scene.launch('UIScene');
        });

        // Add subtle fade animation for text
        this.tweens.add({
            targets: startText,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}
