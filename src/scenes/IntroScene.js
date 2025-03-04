export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({key: 'IntroScene'});
    }

    preload() {
        // Load logo image
        this.load.image('logo', 'assets/temp-logo.png');
    }

    create() {
        // Centered logo
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Display logo
        this.add.image(centerX, centerY, 'logo').setOrigin(0.5);

        // Add start text
        const startText = this.add.text(centerX, centerY + 100, 'Click to Start', { 
            fontFamily: 'Courier, monospace',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        // Add interaction
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