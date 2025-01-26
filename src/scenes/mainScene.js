/**
 * @file MainScene.js
 * @description Defines the MainScene class, responsible for rendering and managing the main gameplay scene in the Sim Firefighter game.
 * Includes HUD creation, procedural map generation, and interactive terrain rendering.
 */

import Map from '../components/MapGenerator.js';
import { createHUD, preloadHUD } from '../components/ui.js';
import FireSpread, { lightFire } from "../components/FireSpread.js";
import Weather from "../components/Weather.js";

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
        this.add.text(10, 10, 'Sim Firefighter Game', {
            font: '20px Arial',
            color: '#FFFFFF'
        });

        // Create the HUD
        createHUD(this);

        // Generate and render the procedural map
        const mapWidth = 10; // Updated size
        const mapHeight = 10; // Updated size
        const minSize = 5; // Minimum partition size for BSP
        const tileSize = 32; // Size of each tile

        // Initialize the Map
        this.map = new Map(mapWidth, mapHeight, minSize);

        // Debugging: Log partition details
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });
        const weather = new Weather(15, 40, 30); // temperature: 15°F, humidity: 40%, windSpeed: 30 mph

        this.fireSpread = new FireSpread(this.map, weather);

        // Render the Map
        this.renderMap(this.map, tileSize);

        // Start a fire at a 'random' tile
        this.startFire();

        // Initialize Fire Spread Logic
        this.startFireSpreadSimulation();

        console.log("MainScene Create Finished");
    }

    /**
     * Renders the map tiles onto the scene.
     * @param {Map} map - The procedural map instance to render.
     * @param {number} tileSize - The size of each tile in pixels.
     */
    renderMap(map, tileSize) {
        // Calculate starting x and y to center the map
        const startX = (this.cameras.main.width - map.width * tileSize) / 2;
        const startY = (this.cameras.main.height - map.height * tileSize) / 2;

        // Loop through the map grid and render each tile
        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Determine terrain asset key
                const terrainKey = this.textures.exists(tile.terrain) ? tile.terrain : 'defaultTerrain';

                console.log(`Rendering tile at (${x}, ${y}) with terrain ${tile.terrain}, using sprite key: ${terrainKey}`);

                // Add sprite for each terrain type
                const sprite = this.add.sprite(
                    startX + x * tileSize,
                    startY + y * tileSize,
                    terrainKey
                ).setOrigin(0).setScale(0.5, 0.5);

                // Store sprite reference in the tile object
                tile.sprite = sprite;

                // Debugging: Log the sprite after it's created
                console.log(`Created sprite for tile at (${x}, ${y}) with sprite reference:`, sprite);

                // Make the tile interactive
                sprite.setInteractive();

                // Add click interaction for each tile
                sprite.on('pointerdown', () => {
                    console.log(`Clicked on ${tile.terrain} at (${x}, ${y})`);
                });
            });
        });
    }

    // Function to randomly start a fire on the map
    startFire() {
        // Randomly select a starting tile
        const startX = Math.floor(Math.random() * this.map.width);
        const startY = Math.floor(Math.random() * this.map.height);

        // Set the selected tile's burnStatus to "burning"
        this.map.grid[startY][startX].burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);

    }

    startFireSpreadSimulation() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                console.log("Simulating fire step...");
                this.fireSpread.simulateFireStep();

                // Iterate over the tiles after each simulation step and light the fire
                for (let y = 0; y < this.map.height; y++) {
                    for (let x = 0; x < this.map.width; x++) {
                        const tile = this.map.grid[y][x];
                        if (tile.burnStatus === "burning" && !tile.fireSprite) {
                            const tileSprite = tile.sprite; // Get the sprite for the tile
                            lightFire(this, tileSprite); // Call lightFire
                            tile.fireSprite = true; // Mark that fire has been lit for this tile
                        }
                    }
                }
            },
            repeat: 16  // Will run 10 times, then stop
        });
    }


}

export default MainScene;
