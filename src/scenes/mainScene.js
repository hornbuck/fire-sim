//import Phaser from 'phaser';
import { createHUD, preloadHUD } from '../components/ui.js'; // Import functions from your ui.js

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene'); // Identifier for this scene
        console.log("MainScene Constructor Called");
    }

    preload() {
        // Preload HUD assets from ui.js
        console.log("MainScene Preload Starting");
        preloadHUD(this);
        // Preload game map
        this.load.image('map-level-1', 'assets/images/SampleMap.png');
        console.log("MainScene Preload Finished");
    }

    create() {
        // Add a title or welcome text
        this.add.text(10, 10, 'Sim Firefighter Game', {
            font: '20px Arial',
            fill: '#FFFFFF'
        });

        // Example game object: a simple rectangle
        //this.add.rectangle(400, 300, 100, 100, 0x3498db); // Example placeholder game object

        // Example game map: AI image
        this.add.image(350, 300,  'map-level-1').setScale(0.7);

        // Create the HUD using the createHUD function from ui.js
        createHUD(this);
        console.log("MainScene Create Finished");
    }
}

export default MainScene;
