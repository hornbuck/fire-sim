import Phaser from 'phaser';
import MainScene from './mainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene],
    backgroundColor: '#282c34',
};

// Create the game instance locally
new Phaser.Game(config);
