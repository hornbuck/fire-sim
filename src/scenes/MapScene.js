import Map from '../components/MapGenerator.js';
import FireSpread from '../components/FireSpread.js';
import Weather from '../components/Weather.js';
import AnimatedSprite from '../components/AnimatedSprites.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
        console.log("MapScene Constructor Called");

        this.gameClock = 0 // Initialize the game clock (in ms)
        this.fireSpreadInterval = 3000; // Fire spreads every 10 seconds
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = false;
    }

    preload() {
        console.log("MapScene Preload Starting");
        
        // Preload terrain assets
        this.load.image('water', 'assets/64x64-Map-Tiles/water.png');
        this.load.image('grass', 'assets/64x64-Map-Tiles/grass.png');
        this.load.image('shrub', 'assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', 'assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png');

        // Preload terrain animation assets
        this.load.spritesheet('water-sheet', 'assets/64x64-Map-Tiles/splash-sheet.png', {
            frameWidth: 64, // Width of each frame
            frameHeight: 64 // Height of each frame
        });

        // Load fire spritesheet
        this.load.spritesheet('fire-blaze', 'assets/64x64-Map-Tiles/animated-flame.png', {
            frameWidth: 64, // Width of each frame
            frameHeight: 64 // Height of each frame
        });


        // Preload burned terrain assets
        this.load.image('burned-grass', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-grass.png');
        this.load.image('burned-shrub', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-shrubs-on-sand.png');
        this.load.image('burned-tree', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-trees-on-light-dirt.png');
    }

    create() {
        console.log("MapScene Create Starting");

        // Generate and render the map
        this.initializeMap();

        // Start UI scene separately
        this.scene.launch('UIScene');

        // Add a delay to ensure UIScene is ready before listening for events
        this.time.delayedCall(100, () => {
            this.scene.get('UIScene').events.on('toggleFire', this.toggleFireSimulation, this);
            this.scene.get('UIScene').events.on('restartGame', this.initializeMap, this);
        });

        // Start updating game clock
        this.elapsedTime = 0;

        // Start a fire at a 'random' tile
        this.startFire();

        // Handle tile interactions
        this.input.on('pointerdown', this.handleTileClick, this);

        console.log("MapScene Create Finished");
    }

    initializeMap() {
        this.mapWidth = 10;
        this.mapHeight = 10;
        this.minSize = 5;
        this.tileSize = 32;

        this.currentSeed = Date.now() * Math.random();
        console.log(`Initial Seed: ${this.currentSeed}`);

        // Initialize the map
        this.map = new Map(
            this.mapWidth, 
            this.mapHeight, 
            this.minSize, 
            this.currentSeed
        );

        // Debugging: Log partition details
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        this.weather = new Weather(68, 30, 15, 'N');
        this.fireSpread = new FireSpread(this.map, this.weather);

        this.mapGroup = this.add.group();
        this.renderMap(this.map, this.tileSize);
    }

    renderMap(map, tileSize) {
        // Destroy the mapGroup if it exists and is not already destroyed
        if (this.mapGroup && !this.mapGroup.destroyed) {
            this.mapGroup.destroy(true);
        }
        // Recreate the map group
        this.mapGroup = this.add.group();

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

                // TO-DO: Water Animation Overlay
                /*if (tile.terrain == "water") {
                    console.log(`Map height: ${map.height}`);
                    console.log(`Tile Sprite X: ${tile.sprite.y}`);
                    console.log("Gotcha!")

                    this.anims.create({
                        key: "water-anim",
                        frames: this.anims.generateFrameNumbers('water-sheet'),
                        frameRate: 10,
                        repeat: -1
                    });
                
                        let watertile = this.add.sprite(tile.sprite.x, tile.sprite.y, 'water-anim');
                        watertile.play('water-anim');
                    
                }
                */

                // Add sprite to the map group
                this.mapGroup.add(sprite);
            });
        });
    }

    handleTileClick(pointer) {
        // Convert click position to tile coordinates
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
                this.scene.get('UIScene').events.emit('tileInfo', clickedTile);
            }
        }
    }

    updateGameClock(delta) {
        this.elapsedTime += delta / 1000; // Convert milliseconds to seconds

        let minutes = Math.floor(this.elapsedTime / 60);
        let seconds = Math.floor(this.elapsedTime % 60);

        // Format time as MM:SS
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.gameClockText.setText(`Time: ${formattedTime}`);
    }

    updateWeatherOverTime() {
        // Random adjustments within a range for dynamic effect
        let tempChange = Phaser.Math.Between(-2, 2); // Temperature change between -2°F to 2°F
        let windChange = Phaser.Math.Between(-1, 1); // Wind speed change between -1 to 1 mph
        let humidityChange = Phaser.Math.Between(-3, 3); // Humidity change between -3% to 3%
    
        // Update the weather object with new values
        let newTemp = this.weather.temperature + tempChange;
        let newWind = Phaser.Math.Clamp(this.weather.windSpeed + windChange, 0, 100); // Keep wind within 0-100 mph
        let newHumidity = Phaser.Math.Clamp(this.weather.humidity + humidityChange, 0, 100); // Keep humidity within 0-100%
    
        // Small chance (1 in 10) for wind direction to change
        let newWindDirection = this.weather.windDirection;
        if (Phaser.Math.Between(1, 10) === 1) {
            const directions = ["N", "E", "S", "W"];
            newWindDirection = Phaser.Utils.Array.GetRandom(directions);
        }
    
        // Update weather
        this.weather.updateWeather(newTemp, newHumidity, newWind, newWindDirection);
    
        // Update the HUD display for weather
        this.weatherText.setText(`Weather: Temp: ${this.weather.temperature}°F | Humidity: ${this.weather.humidity}% | Wind: ${this.weather.windSpeed} mph | Direction: ${this.weather.windDirection}`);
    }

    startFire() {
        let startX, startY, tile

        do{
        // Randomly select a starting tile
        startX = Math.floor(Math.random() * this.map.width);
        startY = Math.floor(Math.random() * this.map.height);
        
        // Set the selected tile's burnStatus to "burning"
        tile = this.map.grid[startY][startX];
        } while (tile.flammability === 0)
        
        tile.burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);

        // Ensure the fire sprite is added to the tile when fire starts
        if (tile.sprite) {
            let blaze = new AnimatedSprite(3);
            blaze.lightFire(this, tile.sprite, this.flameGroup);
            tile.fireS = blaze; // Mark that fire has been visually applied
        }
    }

    updateFireSpread() {
        console.log("Simulating fire step...");
        this.fireSpread.simulateFireStep();

        // Update burning tiles
        this.map.grid.forEach((row) => {
            row.forEach((tile) => {
                if (tile.burnStatus === "burning" && !tile.fireSprite) {
                    let blaze = new AnimatedSprite(3);
                    blaze.lightFire(this, tile.sprite, this.flameGroup);
                    tile.fireS = blaze;
                }
            });
        });
    }

    toggleFireSimulation() {
        this.isFireSimRunning = !this.isFireSimRunning;
        console.warn(`Fire Simulation ${this.isFireSimRunning ? "Started" : "Stopped"}`);

        // Notify UIScene to update UI
        this.scene.get('UIScene').events.emit('fireSimToggled', this.isFireSimRunning);
    }    
}
