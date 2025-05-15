import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import TutorialScene from './scenes/TutorialScene.js';
import SignupScene from "./scenes/signupScene.js";
import LoginScene from "./scenes/loginScene.js";
import MapScene from './scenes/MapScene.js';
import UIScene from './scenes/UIScene.js';
import ProfileScene from './scenes/profileScene.js';

// Log to confirm app.js is running
console.log("Phaser Game Initializing...");

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MenuScene, TutorialScene, SignupScene, LoginScene, MapScene, UIScene, ProfileScene],
    backgroundColor: '#282c34',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true,
    },
};

// Create the game instance locally
new Phaser.Game(config);
