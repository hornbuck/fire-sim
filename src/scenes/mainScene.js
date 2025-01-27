/**
 * @file MainScene.js
 * @description Defines the MainScene class, responsible for rendering and managing the main gameplay scene in the Sim Firefighter game.
 * Includes HUD creation, procedural map generation, and interactive terrain rendering.
 */

// Import necessary modules and functions
import Map from '../components/MapGenerator.js';
import { createHUD, preloadHUD } from '../components/ui.js'; // Import functions from your ui.js
import { lightFire } from "../components/FireSpread.js";

/**
 * Represents the main gameplay scene in the Sim Firefighter game.
 */
class MainScene extends Phaser.Scene {
    /**
     * Constructs the MainScene class.
     */
    constructor() {
        super('MainScene'); // Identifier for this scene
        console.log("MainScene Constructor Called");
    }

    /**
     * Preloads assets required for the scene, including HUD and terrain assets.
     */
    preload() {
        console.log("MainScene Preload Starting");

        // Preload HUD assets
        preloadHUD(this);

        // Preload terrain assets
        this.load.image('water', 'assets/64x64-Map-Tiles/water.png');
        this.load.image('grass', 'assets/64x64-Map-Tiles/flowers.png');
        this.load.image('shrub', 'assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', 'assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png');
    }

    /**
     * Sets up the scene, including HUD creation and procedural map generation.
     */
    create() {
        console.log("MainScene Create Starting");

        // Add a title or welcome text
        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px Arial',
            color: '#FFFFFF'
        });

        // Create the HUD
        createHUD(this);

        // Set map properties
        this.mapWidth = 10;
        this.mapHeight = 10;
        this.minSize = 5;
        this.tileSize = 32;
        this.currentSeed = Date.now();
        console.log(`Initial Seed: ${this.currentSeed}`);

        // Initialize the Map
        this.map = new Map(this.mapWidth, this.mapHeight, this.minSize, this.currentSeed);

        // Create a group for map tiles
        this.mapGroup = this.add.group();

        // Debugging: Log partition details
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        // Render the Map
        this.renderMap(this.map, this.tileSize);

        // Add a button to restart the game with a new map
        this.add.text(10, 40, 'Restart Game', {
            font: '16px Arial',
            color: '#FFFFFF',
            backgroundColor: '#0000FF',
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerdown', () => {
                this.restartGame();
            });

        console.log("MainScene Create Finished");
    }

    /**
     * Renders the map tiles onto the scene.
     * @param {Map} map - The procedural map instance to render.
     * @param {number} tileSize - The size of each tile in pixels.
     */
    renderMap(map, tileSize) {
        // Clear the map group before rendering a new map
        this.mapGroup.clear(true, true);

        // Clear flame icons before rendering a new map
        if (this.flameGroup) {
            this.flameGroup.clear(true, true);
        } else {
            this.flameGroup = this.add.group(); // Create flame group if it doesn't exist
        }

        // Calculate starting x and y to center the map
        const startX = (this.cameras.main.width - map.width * tileSize) / 2;
        const startY = (this.cameras.main.height - map.height * tileSize) / 2;

        // Loop through the map grid and render each tile
        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Determine terrain asset key
                const terrainKey = this.textures.exists(tile.terrain) ? tile.terrain : 'defaultTerrain';

                // Add sprite for each terrain type
                const sprite = this.add.sprite(
                    startX + x * tileSize,
                    startY + y * tileSize,
                    terrainKey
                ).setOrigin(0).setScale(0.5, 0.5);

                // Make the tile interactive
                sprite.setInteractive();

                // Add click interaction for each tile
                sprite.on('pointerdown', () => {
                    if (tile.terrain === "shrub") {
                        console.log(`Lighting shrub on fire at (${x}, ${y})`);
                    } else {
                        console.log(`Clicked on ${tile.terrain} at (${x}, ${y}) - no action taken.`);
                    }
                });

                // Add sprite to the map group
                this.mapGroup.add(sprite);
            });
        });
    }

    restartGame() {
        console.log("Restarting game...");

        // Generate a new unique seed
        this.currentSeed = Date.now();
        console.log(`Current Seed: ${this.currentSeed}`);

        // Regenerate the map
        this.map.regenerateMap(this.currentSeed);

        // Redraw the map
        this.renderMap(this.map, this.tileSize);
        console.log("Game restarted with a new map.")
    }
}

export default MainScene;
