export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        console.log("MenuScene Constructor Called");
    }

    preload() {
        this.load.image('game menu', 'assets/game-menu.png');
        this.load.image('start tutorial', 'assets/tutorial icons/tutorial-button.png');
        this.load.image('play game', 'assets/tutorial icons/play-button.png');
    }

    create() {

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Display game menu and scale it to fit the screen
        const menu = this.add.image(centerX, centerY, 'game menu').setOrigin(0.5);
        
        // Scale the image to fit the width, maintaining aspect ratio
        const scaleX = gameWidth / menu.width;
        const scaleY = gameHeight / menu.height;
        const scale = Math.max(scaleX, scaleY); // Choose max to cover the entire space

        menu.setScale(scale);

        // Add tutorial and play buttons
        const tutorial_b = this.add.image(centerX, centerY - 50, 'start tutorial').setOrigin(0.5).setScale(0.7);
        const play_b = this.add.image(centerX, centerY + 70, 'play game').setOrigin(0.5).setScale(0.7);

        play_b.setInteractive();
        play_b.on('pointerdown', () => {
            console.log("play!");
            this.scene.start('MapScene');
            this.scene.launch('UIScene');
        });

        tutorial_b.setInteractive();
        tutorial_b.on('pointerdown', () => {
            console.log("tutorial!");
            this.scene.start('TutorialScene');
        });

        // Add subtle pop animation for text
        this.tweens.add({
            targets: tutorial_b,
            scale: 0.8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}