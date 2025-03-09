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
        
        // Camera control settings
        this.cameraSpeed = 10;
        this.minZoom = 0.25;
        this.maxZoom = 2;
        this.currentZoom = 1;
        this.isPanning = false;
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
        
        // Set up camera controls for panning and zooming
        this.setupCameraControls();

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
        console.log("Setting up MapScene event listeners");
        this.scene.get('UIScene').events.on('toggleFire', this.toggleFireSimulation, this);
        this.scene.get('UIScene').events.on('restartGame', this.initializeMap, this);
    }
    
    setupCameraControls() {
        // Create a camera that doesn't include the UI area
        // This main camera will be responsible for the map area (0, 0, 700, 600)
        this.cameras.main.setBounds(0, 0, this.mapPixelWidth, this.mapPixelHeight);
        
        // Center the camera on the map
        this.cameras.main.centerOn(this.mapPixelWidth / 2, this.mapPixelHeight / 2);
        
        // Set initial zoom
        this.cameras.main.setZoom(this.currentZoom);

        // Set up zoom with mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            // Determine zoom direction
            const zoomChange = (deltaY > 0) ? -0.1 : 0.1;
            
            // Calculate new zoom level with constraints
            this.currentZoom = Phaser.Math.Clamp(
                this.currentZoom + zoomChange, 
                this.minZoom, 
                this.maxZoom
            );
            
            // Apply zoom level to camera
            this.cameras.main.setZoom(this.currentZoom);
            
            // Emit zoom level for UI adjustments
            this.events.emit('zoomChanged', this.currentZoom);
        });
        
        // Set up panning with middle mouse button or right mouse button
        this.input.on('pointerdown', (pointer) => {
            // Only start panning with middle or right button
            if (pointer.middleButtonDown() || pointer.rightButtonDown()) {
                this.isPanning = true;
                this.lastPanPosition = { x: pointer.x, y: pointer.y };
                
                // Change cursor to grabbing
                this.input.setDefaultCursor('grabbing');
            }
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.isPanning) {
                // Calculate the difference since last position
                const deltaX = pointer.x - this.lastPanPosition.x;
                const deltaY = pointer.y - this.lastPanPosition.y;
                
                // Move the camera
                this.cameras.main.scrollX -= deltaX / this.currentZoom;
                this.cameras.main.scrollY -= deltaY / this.currentZoom;
                
                // Update last position
                this.lastPanPosition = { x: pointer.x, y: pointer.y };
            }
        });
        
        this.input.on('pointerup', () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.input.setDefaultCursor('url(assets/cursors/glove.png), pointer');
            }
        });
        
        // Keyboard controls for panning (WASD or arrow keys)
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add WASD keys
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        // Add zoom keys
        this.zoomKeys = {
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS)
        };
    }

    initializeMap() {
        // Keep existing map size from original code for compatibility
        this.mapWidth = 20;  // Increased from 10 for better pan/zoom experience
        this.mapHeight = 20; // Increased from 10 for better pan/zoom experience
        this.minSize = 5;
        this.tileSize = 64;  // Original used half-scaled 32px tiles; we use 64px now
        
        // Calculate total map pixel dimensions
        this.mapPixelWidth = this.mapWidth * this.tileSize;
        this.mapPixelHeight = this.mapHeight * this.tileSize;

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
        
        // Preserve zoom level when restarting
        const previousZoom = this.currentZoom || 1;
        this.currentZoom = previousZoom;

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
        
        // Update camera settings if we're restarting
        if (this.cameras && this.cameras.main) {
            this.cameras.main.setBounds(0, 0, this.mapPixelWidth, this.mapPixelHeight);
            this.cameras.main.centerOn(this.mapPixelWidth / 2, this.mapPixelHeight / 2);
            this.cameras.main.setZoom(this.currentZoom);
        }

        // Render the map
        this.renderMap(this.map, this.tileSize);

        // Start a fire
        this.startFire();

        // Notify UI of initial state
        this.events.emit('weatherUpdated', this.weather);
        this.events.emit('fireSimToggled', this.isFireSimRunning);
        this.events.emit('updateGameClock', this.elapsedTime);
        this.events.emit('mapSizeChanged', {
            width: this.mapWidth,
            height: this.mapHeight,
            pixelWidth: this.mapPixelWidth,
            pixelHeight: this.mapPixelHeight
        });
    }

    renderMap(map, tileSize) {
        // Loop through and render each tile at world coordinates
        map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Determine terrain asset key
                const terrainKey = this.textures.exists(tile.terrain) ? tile.terrain : 'defaultTerrain';

                // Create sprite at world position
                const sprite = this.add.sprite(
                    x * tileSize,
                    y * tileSize,
                    terrainKey
                ).setOrigin(0);

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
        // Ignore clicks if in panning mode
        if (this.isPanning) {
            return;
        }
        
        // Convert screen coordinates to world coordinates
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Calculate tile coordinates based on world point
        let tileX = Math.floor(worldPoint.x / this.tileSize);
        let tileY = Math.floor(worldPoint.y / this.tileSize);

        // Ensure click is within map bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let clickedTile = this.map.getTile(tileX, tileY);
            
            if (clickedTile) {
                console.log(`Clicked on ${clickedTile.terrain} at (${tileX}, ${tileY})`);
                
                // Send tile info to UIScene
                this.events.emit('tileInfo', {
                    ...clickedTile,
                    screenX: pointer.x,
                    screenY: pointer.y
                });
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
        
        // Pan camera to fire location
        this.cameras.main.pan(
            startX * this.tileSize + this.tileSize / 2,
            startY * this.tileSize + this.tileSize / 2,
            1000,
            'Power2'
        );
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
        console.log("Toggle fire simulation called");
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
        
        // Handle keyboard camera controls
        this.handleCameraControls(delta);
        
        // Scale fire sprites based on camera zoom
        if (this.flameGroup && this.flameGroup.getChildren().length > 0) {
            this.flameGroup.getChildren().forEach(flameSprite => {
                // Apply inverse zoom scale to maintain visual size
                flameSprite.setScale(1 / this.currentZoom);
            });
        }
    }
    
    handleCameraControls(delta) {
        // Adjust camera speed based on zoom level
        const adjustedSpeed = this.cameraSpeed / this.currentZoom;
        
        // Calculate camera movement based on keyboard input
        const moveX = ((this.cursors.left.isDown || this.wasd.left.isDown) ? -adjustedSpeed : 0) +
                      ((this.cursors.right.isDown || this.wasd.right.isDown) ? adjustedSpeed : 0);
        
        const moveY = ((this.cursors.up.isDown || this.wasd.up.isDown) ? -adjustedSpeed : 0) +
                      ((this.cursors.down.isDown || this.wasd.down.isDown) ? adjustedSpeed : 0);
        
        // Move camera
        if (moveX !== 0 || moveY !== 0) {
            this.cameras.main.scrollX += moveX;
            this.cameras.main.scrollY += moveY;
        }
        
        // Handle keyboard zoom
        if (this.zoomKeys.zoomIn.isDown) {
            this.currentZoom = Phaser.Math.Clamp(this.currentZoom + 0.01, this.minZoom, this.maxZoom);
            this.cameras.main.setZoom(this.currentZoom);
            this.events.emit('zoomChanged', this.currentZoom);
        } 
        else if (this.zoomKeys.zoomOut.isDown) {
            this.currentZoom = Phaser.Math.Clamp(this.currentZoom - 0.01, this.minZoom, this.maxZoom);
            this.cameras.main.setZoom(this.currentZoom);
            this.events.emit('zoomChanged', this.currentZoom);
        }
    }
}