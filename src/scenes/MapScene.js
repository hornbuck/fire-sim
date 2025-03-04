import Map from '../components/MapGenerator.js';
import FireSpread from '../components/FireSpread.js';
import Weather from '../components/Weather.js';
import AnimatedSprite from '../components/AnimatedSprites.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
        console.log("MapScene Constructor Called");

        this.elapsedTime = 0; // Track elapsed game time in seconds
        this.fireSpreadInterval = 8000; // Fire spread frequency in milliseconds
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
        
        // Preload burned terrain assets
        this.load.image('burned-grass', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-grass.png');
        this.load.image('burned-shrub', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-shrubs-on-sand.png');
        this.load.image('burned-tree', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-trees-on-light-dirt.png');
        
        // Preload animation assets
        this.load.spritesheet('water-sheet', 'assets/64x64-Map-Tiles/splash-sheet.png', {
            frameWidth: 64, frameHeight: 64
        });
        
        this.load.spritesheet('fire-blaze', 'assets/64x64-Map-Tiles/animated-flame.png', {
            frameWidth: 64, frameHeight: 64
        });
    }

    create() {
        console.log("MapScene Create Starting");

        // Generate and render the map
        this.initializeMap();

        // Start UI scene if it's not already running
        if (!this.scene.isActive('UIScene')) {
            this.scene.launch('UIScene');
        }

        // Set up input events
        this.input.on('pointerdown', this.handleTileClick, this);

        // Set up event listeners for UI scene communication
        this.setupEventListeners();

        console.log("MapScene Create Finished");

    }

    setupEventListeners() {
        // Listen for events from UIScene
        this.scene.get('UIScene').events.on('toggleFire', this.toggleFireSimulation, this);
        this.scene.get('UIScene').events.on('restartGame', this.initializeMap, this);
    }

    initializeMap() {
        this.mapWidth = 10;
        this.mapHeight = 10;
        this.minSize = 5;
        this.tileSize = 32;

        // Generate a new seed for map creation
        this.currentSeed = Date.now() * Math.random();
        console.log(`Map Seed: ${this.currentSeed}`);

        // Initialize the map
        this.map = new Map(
            this.mapWidth, 
            this.mapHeight, 
            this.minSize, 
            this.currentSeed
        );

        // Debugging
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        // Initialize weather and fire simulation
        this.weather = new Weather(68, 30, 15, 'N');
        this.fireSpread = new FireSpread(this.map, this.weather);

        // Reset state variables
        this.elapsedTime = 0;
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = false;

        // Initialize sprite groups
        if (this.mapGroup && !this.mapGroup.destroyed) {
            this.mapGroup.destroy(true);
        }
        this.mapGroup = this.add.group();

        if (this.flameGroup) {
            this.flameGroup.clear(true, true);
        } else {
            this.flameGroup = this.add.group();
        }

        // Render the map
        this.renderMap(this.map, this.tileSize);

        // Start a fire
        this.startFire();

        // Notify UI of initial state
        this.events.emit('weatherUpdated', this.weather);
        this.events.emit('fireSimToggled', this.isFireSimRunning);
        this.events.emit('updateGameClock', this.elapsedTime);
    }

    renderMap(map, tileSize) {
        // Calculate starting position to center the map
        const startX = (this.cameras.main.width - map.width * tileSize) / 2;
        const startY = (this.cameras.main.height - map.height * tileSize) / 2;

        // Loop through and render each tile
        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Determine terrain asset key
                const terrainKey = this.textures.exists(tile.terrain) ? tile.terrain : 'defaultTerrain';

                // Create sprite
                const sprite = this.add.sprite(
                    startX + x * tileSize,
                    startY + y * tileSize,
                    terrainKey
                ).setOrigin(0).setScale(0.5, 0.5);

                // Store sprite reference
                tile.sprite = sprite;

                // Make interactive
                sprite.setInteractive();
                
                // Add to map group
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

        // Ensure click is within map bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let clickedTile = this.map.getTile(tileX, tileY);
            
            if (clickedTile) {
                console.log(`Clicked on ${clickedTile.terrain} at (${tileX}, ${tileY})`);
                // Send tile info to UIScene
                this.events.emit('tileInfo', clickedTile);
            }
        }
    }

    startFire() {
        let startX, startY, tile;

        // Find a flammable tile
        do {
            startX = Math.floor(Math.random() * this.map.width);
            startY = Math.floor(Math.random() * this.map.height);
            tile = this.map.grid[startY][startX];
        } while (tile.flammability === 0);
        
        // Set it on fire
        tile.burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);

        // Add visual fire effect
        if (tile.sprite) {
            let blaze = new AnimatedSprite(3);
            blaze.lightFire(this, tile.sprite, this.flameGroup);
            tile.fireS = blaze;
        }
    }

    updateFireSpread() {
        console.log("Simulating fire step...");
        this.fireSpread.simulateFireStep();

        // Update burning tiles with visual effects
        this.map.grid.forEach((row) => {
            row.forEach((tile) => {
                if (tile.burnStatus === "burning" && !tile.fireS) {
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
        
        // Notify UIScene
        this.events.emit('fireSimToggled', this.isFireSimRunning);
    }

    updateWeatherOverTime() {
        // Random adjustments for dynamic weather
        let tempChange = Phaser.Math.Between(-2, 2);
        let windChange = Phaser.Math.Between(-1, 1);
        let humidityChange = Phaser.Math.Between(-3, 3);
    
        // Apply changes within limits
        let newTemp = this.weather.temperature + tempChange;
        let newWind = Phaser.Math.Clamp(this.weather.windSpeed + windChange, 0, 100);
        let newHumidity = Phaser.Math.Clamp(this.weather.humidity + humidityChange, 0, 100);
    
        // Occasional wind direction change
        let newWindDirection = this.weather.windDirection;
        if (Phaser.Math.Between(1, 10) === 1) {
            const directions = ["N", "E", "S", "W"];
            newWindDirection = Phaser.Utils.Array.GetRandom(directions);
        }
    
        // Update weather object
        this.weather.updateWeather(newTemp, newHumidity, newWind, newWindDirection);
    
        // Notify UI about weather change
        this.events.emit('weatherUpdated', this.weather);
    }

    update(time, delta) {
        // Update game time
        this.elapsedTime += delta / 1000;
        
        // Notify UI about time update
        this.events.emit('updateGameClock', this.elapsedTime);
        
        // Handle fire spread at interval
        if (this.isFireSimRunning && 
            this.elapsedTime - this.lastFireSpreadTime >= this.fireSpreadInterval / 1000) {
            this.lastFireSpreadTime = this.elapsedTime;
            this.updateFireSpread();
            this.updateWeatherOverTime();
        }
    }
}