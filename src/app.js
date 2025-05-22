import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import TutorialScene from './scenes/TutorialScene.js';
import SignupScene from "./scenes/signupScene.js";
import LoginScene from "./scenes/loginScene.js";
import MapScene from './scenes/MapScene.js';
import UIScene from './scenes/UIScene.js';
import ProfileScene from './scenes/profileScene.js';
import LeaderboardScene from './scenes/leaderboardScene.js';

// Log to confirm app.js is running
console.log("Phaser Game Initializing...");

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [MenuScene, TutorialScene, SignupScene, LoginScene, MapScene, UIScene, ProfileScene, LeaderboardScene],
    callbacks: {
        postBoot: function (game) {
          // In v3.15, you have to override Phaser's default styles
          game.canvas.style.width = '100%';
          game.canvas.style.height = '100%';
        }
    },
    backgroundColor: '#282c34',
    scale: {
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true,
    },
};

// Create the game instance locally
new Phaser.Game(config);
