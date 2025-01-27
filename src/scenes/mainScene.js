/**
 * @file MainScene.js
 * @description Defines the MainScene class, responsible for rendering and managing the main gameplay scene in the Sim Firefighter game.
 * Includes HUD creation, procedural map generation, and interactive terrain rendering.
 */

import Map from '../components/MapGenerator.js';
import { createHUD, preloadHUD } from '../components/ui.js';
import FireSpread, { lightFire } from '../components/FireSpread.js';
import Weather from '../components/Weather.js';
import { hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

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
        const weather = new Weather(15, 40, 30); // temperature: 15°F, humidity: 40%, windSpeed: 30 mph

        this.fireSpread = new FireSpread(this.map, weather);

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

        // Start a fire at a 'random' tile
        this.startFire();

        // Initialize Fire Spread Logic
        this.startFireSpreadSimulation();

        console.log("MainScene Create Finished");
    }

    /**
     * Renders/updates the resource limits onto the scene.
     * @param hoseText - The text object of the firehose limit.
     * @param hoseLimit - The number of firehose uses.
     */
    update() {
        hoseText.setText(`${hose}/10`);
        extinguisherText.setText(`${extinguisher}/5`);
        helicopterText.setText(`${helicopter}/3`);
        firetruckText.setText(`${firetruck}/3`);
        airtankerText.setText(`${airtanker}/2`);
        hotshotcrewText.setText(`${hotshotcrew}/1`);
        smokejumperText.setText(`${smokejumper}/5`);
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

                // Store sprite reference in the tile object
                tile.sprite = sprite;

                // Make the tile interactive
                sprite.setInteractive();

                // Add click interaction for each tile
                sprite.on('pointerdown', () => {
                    console.log(`Clicked on ${tile.terrain} at (${x}, ${y})`);
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


    /**
     * Starts a fire at a random tile on the map by setting its burnStatus to "burning"
     * and visually representing it with the fire sprite.
     * Assumes `this.map` has `width`, `height`, and a 2D `grid` array with `burnStatus`.
     * Logs the fire's starting location to the console.
     */
    startFire() {
        // Randomly select a starting tile
        const startX = Math.floor(Math.random() * this.map.width);
        const startY = Math.floor(Math.random() * this.map.height);

        // Set the selected tile's burnStatus to "burning"
        const tile = this.map.grid[startY][startX];
        tile.burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);

        // Ensure the fire sprite is added to the tile when fire starts
        if (tile.sprite) {
            lightFire(this, tile.sprite);
            tile.fireSprite = true; // Mark that fire has been visually applied
        }
    }



    /**
     * Starts a fire spread simulation that runs periodically, updating the fire's state on the map.
     *
     * - Runs every 2 seconds (`delay: 2000`) for 10 iterations (`repeat: 10`).
     * - Invokes `this.fireSpread.simulateFireStep()` to compute fire progression.
     * - Iterates through the map's grid to visually update tiles marked as "burning".
     * - Calls `lightFire(this, tile.sprite)` to apply fire visuals and marks the tile as processed.
     *
     * Assumes `this.map.grid` contains tiles with `burnStatus`, `sprite`, and `fireSprite` properties.
     */
    startFireSpreadSimulation() {
        this.time.addEvent({
            delay: 2000,
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
            repeat: 10 // Will run 10 times, then stop
        });
    }
}

export default MainScene;
