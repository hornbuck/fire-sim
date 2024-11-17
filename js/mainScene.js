import Phaser from 'phaser';
import { createHUD, preloadHUD } from './ui.js'; // Import functions from your ui.js

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene'); // Identifier for this scene
    }

    preload() {
        // Preload HUD assets from ui.js
        preloadHUD(this);

        // Preload other game assets (examples)
        this.load.image('exampleTile', 'Assets/exampleTile.png'); // Example asset
    }

    create() {
        // Add a title or welcome text
        this.add.text(10, 10, 'Sim Firefighter Game', {
            font: '20px Arial',
            fill: '#FFFFFF'
        });

        // Example game object: a simple rectangle
        this.add.rectangle(400, 300, 100, 100, 0x3498db); // Example placeholder game object

        // Create the HUD using the createHUD function from ui.js
        createHUD(this);
    }

    update() {
        // Add logic to update the scene (e.g., animations, game state changes)
    }
}

export default MainScene;
