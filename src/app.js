//import Phaser from 'phaser';
import MainScene from './scenes/mainScene.js';

// Log to confirm app.js is running
console.log("Phaser Game Initializing...");

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene],
    backgroundColor: '#282c34',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

// Create the game instance locally
new Phaser.Game(config);
