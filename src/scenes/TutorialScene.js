export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        console.log("TutorialScene Constructor Called");
    }

    preload() {
        this.load.image('page 1', 'assets/tutorial icons/page-1.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        const menu = this.add.image(centerX, centerY, 'page 1').setOrigin(0.5);
    }
}