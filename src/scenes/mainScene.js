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
export class MainScene extends Phaser.Scene {
    /**
     * Constructs the MainScene class.
     */
    constructor() {
        super('MainScene'); // Identifier for this scene
        console.log("MainScene Constructor Called");

        this.gameClock = 0 // Initialize the game clock (in ms)
        this.fireSpreadInterval = 5000; // Fire spreads every 5 seconds
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = false;
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

    initializeMap() {
        this.mapWidth = 10;
        this.mapHeight = 10;
        this.minSize = 5;
        this.tileSize = 32;

        this.currentSeed = Date.now();
        console.log(`Initial Seed: ${this.currentSeed}`);

        // Initialize the map
        this.map = new Map(this.mapWidth, this.mapHeight, this.minSize, this.currentSeed);

        // Debugging: Log partition details
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        const weather = new Weather(15, 40, 30);
        this.fireSpread = new FireSpread(this.map, weather);

        this.mapGroup = this.add.group();
        this.renderMap(this.map, this.tileSize);
    }


    /**
     * Sets up the scene, including HUD creation and procedural map generation.
     */
    create() {
        console.log("MainScene Create Starting");

        this.input.on('pointerdown', this.handleTileClick, this);

        // Create UI elements
        this.createUIElements();

        // Create the HUD (calling the existing function)
        createHUD(this);

        // Generate and render map
        this.initializeMap();

        // Start updating game clock
        this.elapsedTime = 0;

        // Start a fire at a 'random' tile
        this.startFire();

        console.log("MainScene Create Finished");
    }



    /**
     * Create UI elements - game title, restart game, start/stop fire, weather stats, tile info overlay
     */
    createUIElements() {
        // Tile info text (for when a tile is clicked)
        this.tileInfoText = this.add.text(10, 400, "", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setScrollFactor(0); // Keeps it fixed on screen

        // Title - Game name
        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px "Georgia", serif',  // More rustic font
            color: '#8B4513'  // Brown color for a rustic feel
        });

        // Restart Game button
        const restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#A0522D', // Rustic wood-like color
            padding: { x: 15, y: 10 }
        })
            .setInteractive()
            .on('pointerover', () => {  // Hover effect
                restartButton.setStyle({ backgroundColor: '#8B4513' });
            })
            .on('pointerout', () => {  // Reset when not hovering
                restartButton.setStyle({ backgroundColor: '#A0522D' });
            })
            .on('pointerdown', () => {
                this.restartGame();
            });

        // Start/Stop fire simulation button
        this.fireButton = this.add.text(10, 70, 'Start Fire', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#8B0000', // Dark red, gives a fiery feel
            padding: { x: 15, y: 10 }
        })
            .setInteractive()
            .on('pointerover', () => {
                this.fireButton.setStyle({ backgroundColor: '#A52A2A' });
            })
            .on('pointerout', () => {
                this.fireButton.setStyle({ backgroundColor: '#8B0000' });
            })
            .on('pointerdown', () => {
                this.toggleFireSimulation();
            });

        // Weather stats HUD
        this.weatherText = this.add.text(10, 100, 'Weather: Loading...', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',  // Olive green for a rustic feel
            padding: { x: 15, y: 10 }
        });

        // Initialize weather display
        // TODO: Add dynamic weather
        this.updateWeatherHUD(15,40,30);

        // Game Clock Component of HUD
        this.gameClockText = this.add.text(200, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0); // Keep HUD static when moving around
    }




    handleTileClick(pointer) {
        // Convert click positiion to tile coordinates
        const startX = (this.cameras.main.width - this.map.width * this.tileSize) / 2;
        const startY = (this.cameras.main.height - this.map.height * this.tileSize) / 2;

        let tileX = Math.floor((pointer.x - startX) / this.tileSize);
        let tileY = Math.floor((pointer.y - startY) / this.tileSize);

        console.warn(`Clicked tile coordinates: (${tileX}, ${tileY})`);

        // Ensure the click is within the map bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let clickedTile = this.map.getTile(tileX, tileY);
            console.log(clickedTile ? `Tile found: ${clickedTile.toString()}` : "No tile found at this position!");

            if (clickedTile) {
                this.updateTileInfoDisplay(clickedTile);
            }
        }
    }

    updateTileInfoDisplay(tile) {
        this.tileInfoText.setText(
            `Terrain: ${tile.terrain}
        \nFlammability: ${tile.flammability}
        \nFuel: ${tile.fuel}
        \nBurn Status: ${tile.burnStatus}`
        );
    }


    updateGameClock(delta) {
        this.elapsedTime += delta / 1000; // Convert milliseconds to seconds

        let minutes = Math.floor(this.elapsedTime / 60);
        let seconds = Math.floor(this.elapsedTime % 60);

        // Format time as MM:SS
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.gameClockText.setText(`Time: ${formattedTime}`);
    }


    // Function to update weather HUD
    updateWeatherHUD(temp, wind, humidity) {
        this.weatherText.setText(`Temp: ${temp}°F | Wind: ${wind} mph | Humidity: ${humidity}%`);
    }

    // Function to toggle fire simulation state
    toggleFireSimulation() {
        if (this.isFireSimRunning) {
            console.warn("Fire Simulation Stopped");
            this.isFireSimRunning = false;
            this.fireButton.setText('Start Fire');
        } else {
            console.warn("Fire Simulation Started");
            this.isFireSimRunning = true;
            this.fireButton.setText('Stop Fire');
        }
    }

    /**
     * Renders/updates the resource limits onto the scene.
     * @param hoseText - The text object of the firehose limit.
     * @param hoseLimit - The number of firehose uses.
     */
    update(time, delta) {
        this.updateGameClock(delta); // Increment game clock by delta time (ms)

        // Handle fire spread every 5 seconds
        if (this.isFireSimRunning && this.elapsedTime - this.lastFireSpreadTime >= this.fireSpreadInterval / 1000) {
            this.lastFireSpreadTime = this.elapsedTime;
            this.updateFireSpread();
        }


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

        // Reset the game clock
        this.elapsedTime = 0;
        this.updateGameClock(0);

        // Start the fire
        this.startFire();
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
            lightFire(this, tile.sprite, this.flameGroup);
            tile.fireSprite = true; // Mark that fire has been visually applied
        }
    }

    updateFireSpread() {
        console.log("Simulating fire step...");
        this.fireSpread.simulateFireStep();

        // Update burning tiles
        this.map.grid.forEach((row) => {
            row.forEach((tile) => {
                if (tile.burnStatus === "burning" && !tile.fireSprite) {
                    lightFire(this, tile.sprite, this.flameGroup);
                    tile.fireSprite = true;
                }
            });
        });
    }
}

export default MainScene;
