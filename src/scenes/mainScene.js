//import necessary modules and functions
import Map from '../components/MapGenerator.js';
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

        // Preload terrain assets
        this.load.image('water', '../../assets/images/terrain/water.png');
        this.load.image('grass', '../../assets/64x64 Map Tiles/flowers.png');
        this.load.image('shrub', '../../assets/64x64 Map Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', '../../assets/64x64 Map Tiles/Trees/trees-on-light-dirt.png');
    }

    create() {
        console.log("MainScene Create Starting");

        // Add a title or welcome text
        this.add.text(10, 10, 'Sim Firefighter Game', {
            font: '20px Arial',
            color: '#FFFFFF'
        });

        // Create the HUD using the createHUD function from ui.js
        createHUD(this);

        // Generate and render the procedural map
        const mapWidth = 10; // Placeholder size
        const mapHeight = 10; // Placeholder size
        const tileSize = 32; // Size of each tile

        // Initialize the Map
        this.map = new Map(mapWidth, mapHeight);

        // Debugging: Print the terrain values in the console
        console.log("Generated Map Terrain:");
        this.map.printMap();

        // Render the Map
        this.renderMap(this.map, tileSize);

        console.log("MainScene Create Finished");
    }


    // Render the map tiles
    renderMap(map, tileSize) {
        // Calculate starting x and y to center the map
        const startX = (this.cameras.main.width - map.width * tileSize) / 2;
        const startY = (this.cameras.main.height - map.height * tileSize) / 2;

        // Loop through the map grid and render each tile
        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Add sprite for each terrain type
                const sprite = this.add.sprite(
                    startX + x * tileSize,
                    startY + y * tileSize,
                    tile.terrain
                ).setOrigin(0).setScale(0.5,0.5);

                // Make the tile interactive
                sprite.setInteractive();

                // Add click interaction for each tile
                sprite.on('pointerdown', () => {
                    console.log(`Clicked on ${tile.terrain} at (${x}, ${y})`);

                    // Add additional logic for clicking a tile here
                });
            });
        });
    };
}

export default MainScene;
