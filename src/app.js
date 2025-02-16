import Phaser from "phaser";
import MainScene from './scenes/mainScene.js';
import LoginScene from "./scenes/loginScene.js";
import SignupScene from "./scenes/signupScene.js";

// Log to confirm app.js is running
console.log("Phaser Game Initializing...");

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MainScene, LoginScene, SignupScene],
    backgroundColor: '#282c34',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true,
    }
};

// Create the game instance locally
new Phaser.Game(config);
