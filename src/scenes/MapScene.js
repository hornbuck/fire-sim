import Map from '../components/MapGenerator.js';
import FireSpread from '../components/FireSpread.js';
import Weather from '../components/Weather.js';
import AnimatedSprite from '../components/AnimatedSprites.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
        console.log("MapScene Constructor Called");

        // Map configuration constants
        this.MAP_WIDTH = 100;      // Number of tiles horizontally
        this.MAP_HEIGHT = 100;     // Number of tiles vertically
        this.TILE_SIZE = 64;      // Size of each tile in pixels
        this.MIN_PARTITION_SIZE = 5;

        // Camera control configuration
        this.CAMERA_SPEED = 10;   // Base camera panning speed
        this.MIN_ZOOM = 0.25;     // Minimum zoom level (will be updated dynamically)
        this.MAX_ZOOM = 2;        // Maximum zoom level
        this.UI_WIDTH = 100;      // Width of UI area on right side
        
        // Fire simulation settings
        this.MIN_SPREAD = 30000;   // Increased from 9000ms to 30 seconds
        this.MAX_SPREAD = 120000;  // Increased from 36000ms to 2 minutes
        this.FIRE_SPREAD_INTERVAL = this.MIN_SPREAD; // Initialize with minimum value
        
        // Game state variables
        this.elapsedTime = 0;     // Track elapsed game time in seconds
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = false;

        this.selectedTile = null; // Track the currently selected tile
        this.lastTileSnapshot = null; // Track the last tile snapshot for undo functionality
        this.tileInfoUpdateInterval = 500; // Interval for tile info updates in milliseconds
        this.lastTileInfoUpdate = 0; // Track the last tile info update time
        
        // Camera state variables
        this.currentZoom = 1;
        this.isPanning = false;
    }

    _recalcSpreadInterval() {
        const risk = this.weather.getGlobalRisk();
        // Make the interval more sensitive to risk changes
        this.FIRE_SPREAD_INTERVAL = this.MAX_SPREAD - (this.MAX_SPREAD - this.MIN_SPREAD) * (risk * 1.5);
        console.log(`Recalculated fire spread interval: ${this.FIRE_SPREAD_INTERVAL/1000}s (risk: ${risk})`);
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

        // Preload extinguished terrain assets
        this.load.image('extinguished-grass', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/grass.png');
        this.load.image('extinguished-shrub', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/shrub.png');
        this.load.image('extinguished-tree', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/tree.png');
        
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
        
        // Initialize weather overlay graphics
        this.windOverlay = this.add.graphics().setDepth(2).setVisible(false);

        this.events.on('toggleWindOverlay', visible => {
            this.windOverlay.setVisible(visible);
            if (visible) this.updateWindOverlay();
        });

        this.input.mouse.disableContextMenu();

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

        // Add event listener for fire extinguishing
        this.events.on('extinguishFire', this.handleFireExtinguish, this);

        this.selectionMarker = this.add.graphics();
        this.selectionMarker.lineStyle(3, 0x00ffff, 1); // Cyan border
        this.selectionMarker.strokeRect(0, 0, this.TILE_SIZE, this.TILE_SIZE);
        this.selectionMarker.setVisible(false);

        console.log("MapScene Create Finished");
    }

    updateWindOverlay() {
        this.windOverlay.clear();
        const ARROW_LENGTH = 20;
        const ARROW_WIDTH = 4;
        
        // Draw wind vectors every 10 tiles
        for (let y = 5; y < this.map.height; y += 10) {
            for (let x = 5; x < this.map.width; x += 10) {
                const { windSpeed, windDirection } = this.weather.getLocalWeather(x, y);
                const length = (windSpeed / 30) * ARROW_LENGTH;
                
                const centerX = x * this.TILE_SIZE + this.TILE_SIZE/2;
                const centerY = y * this.TILE_SIZE + this.TILE_SIZE/2;
                
                let endX = centerX;
                let endY = centerY;
                
                // Calculate arrow end point based on wind direction
                switch(windDirection) {
                    case 'N': endY -= length; break;
                    case 'S': endY += length; break;
                    case 'E': endX += length; break;
                    case 'W': endX -= length; break;
                }
                
                // Draw arrow
                this.windOverlay.lineStyle(ARROW_WIDTH, 0xffff00, 0.8)
                    .lineBetween(centerX, centerY, endX, endY);
                
                // Draw arrowhead
                const headLength = ARROW_WIDTH * 2;
                const angle = Math.atan2(endY - centerY, endX - centerX);
                this.windOverlay.lineStyle(ARROW_WIDTH, 0xffff00, 0.8)
                    .lineBetween(
                        endX, endY,
                        endX - headLength * Math.cos(angle - Math.PI/6),
                        endY - headLength * Math.sin(angle - Math.PI/6)
                    )
                    .lineBetween(
                        endX, endY,
                        endX - headLength * Math.cos(angle + Math.PI/6),
                        endY - headLength * Math.sin(angle + Math.PI/6)
                    );
            }
        }
    }

    setupEventListeners() {
        // Listen for events from UIScene
        console.log("Setting up MapScene event listeners");
        this.scene.get('UIScene').events.on('toggleFire', this.toggleFireSimulation, this);
        this.scene.get('UIScene').events.on('restartGame', this.initializeMap, this);
    }
    
    setupCameraControls() {
        // Get the available viewport width (excluding UI area)
        const viewportWidth = this.cameras.main.width - this.UI_WIDTH;
        const viewportHeight = this.cameras.main.height;
        
        // Calculate the minimum zoom level needed to fit the entire map on screen
        const mapAspectRatio = this.mapPixelWidth / this.mapPixelHeight;
        const screenAspectRatio = viewportWidth / viewportHeight;
        
        // Determine which dimension (width or height) constrains the view
        if (mapAspectRatio > screenAspectRatio) {
            // Width-constrained (horizontal map)
            this.fitZoomLevel = Math.min(1, viewportWidth / this.mapPixelWidth);
        } else {
            // Height-constrained (vertical map)
            this.fitZoomLevel = Math.min(1, viewportHeight / this.mapPixelHeight);
        }
        
        // Set the minimum zoom to either our calculated fit level or MIN_ZOOM, whichever is larger
        this.MIN_ZOOM = Math.max(this.fitZoomLevel * 0.8, this.MIN_ZOOM);
        
        // Create a camera that doesn't include the UI area
        this.cameras.main.setBounds(0, 0, this.mapPixelWidth, this.mapPixelHeight);
        this.cameras.main.setViewport(0, 0, viewportWidth, viewportHeight);
        
        // Center the camera on the map
        this.cameras.main.centerOn(this.mapPixelWidth / 2, this.mapPixelHeight / 2);
        
        // Set initial zoom
        this.currentZoom = Math.max(this.MIN_ZOOM, 1);
        this.cameras.main.setZoom(this.currentZoom);

        // Set up zoom with mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            // Only zoom if the pointer is over the map area
            if (pointer.x < viewportWidth) {
                // Determine zoom direction
                const zoomChange = (deltaY > 0) ? -0.1 : 0.1;
                
                // Calculate new zoom level with constraints
                this.currentZoom = Phaser.Math.Clamp(
                    this.currentZoom + zoomChange, 
                    this.MIN_ZOOM, 
                    this.MAX_ZOOM
                );
                
                // Apply zoom level to camera
                this.cameras.main.setZoom(this.currentZoom);
                
                // Emit zoom level for UI adjustments
                this.events.emit('zoomChanged', this.currentZoom);
                
                // If zoomed out to where map doesn't fill screen, center it
                this.centerMapIfNeeded();
            }
        });
        
        // Set up panning with middle mouse button or right mouse button
        this.input.on('pointerdown', (pointer) => {
            // Only start panning with middle or right button and if pointer is in map area
            if ((pointer.middleButtonDown() || pointer.rightButtonDown()) && pointer.x < viewportWidth) {
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

    centerMapIfNeeded() {
        // Calculate the visible map area in screen coordinates
        const visibleMapWidth = this.mapPixelWidth * this.currentZoom;
        const visibleMapHeight = this.mapPixelHeight * this.currentZoom;
        
        // Get the camera viewport dimensions
        const viewportWidth = this.cameras.main.width;
        const viewportHeight = this.cameras.main.height;
        
        // Center the map if it's smaller than the viewport
        if (visibleMapWidth < viewportWidth || visibleMapHeight < viewportHeight) {
            // Calculate the center position
            const centerX = this.mapPixelWidth / 2;
            const centerY = this.mapPixelHeight / 2;
            
            // Smoothly pan to the center
            this.cameras.main.pan(centerX, centerY, 300, 'Power2');
        }
    }

    initializeMap() {
        // Preserve current zoom level if restarting with existing map
        const previousZoom = this.currentZoom || 1;
        
        // Calculate total map pixel dimensions
        this.mapPixelWidth = this.MAP_WIDTH * this.TILE_SIZE;
        this.mapPixelHeight = this.MAP_HEIGHT * this.TILE_SIZE;

        // Generate a new seed for map creation
        this.currentSeed = Date.now() * Math.random();
        console.log(`Map Seed: ${this.currentSeed}`);

        // Initialize the map
        this.map = new Map(
            this.MAP_WIDTH, 
            this.MAP_HEIGHT, 
            this.MIN_PARTITION_SIZE, 
            this.currentSeed
        );

        // Debugging
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        // Initialize weather and fire simulation
        this.weather = new Weather(this.MAP_WIDTH, this.MAP_HEIGHT);
        this.fireSpread = new FireSpread(this.map, this.weather);

        // Reset state variables
        this.elapsedTime = 0;
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = true;
        
        // Restore zoom level while respecting the minimum constraint
        this.currentZoom = Math.max(previousZoom, this.MIN_ZOOM);


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
        this.renderMap(this.map, this.TILE_SIZE);

        // Fire initialization with retry mechanism
        this.time.delayedCall(500, () => {
            console.log("Delayed fire start after map initialization");
            if (!this.startFire()) {
                console.warn("Initial fire start failed, retrying...");
                this.time.delayedCall(1000, () => this.startFire());
            }
            
            // Force some initial fire spread for visual effect
            this.time.delayedCall(1000, () => {
                this.simulateInitialSpread(4);
                this.isFireSimRunning = false;
                this.events.emit('fireSimToggled', this.isFireSimRunning);
            });
            
        });

        // Notify UI of initial state
        this.events.emit('weatherUpdated', this.weather);
        this.events.emit('updateGameClock', this.elapsedTime);
        this.events.emit('mapSizeChanged', {
            width: this.MAP_WIDTH,
            height: this.MAP_HEIGHT,
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
        
        // Ignore clicks in the UI area
        const viewportWidth = this.cameras.main.width - this.UI_WIDTH;
        if (pointer.x > viewportWidth) {
            return;
        }
        
        // Convert screen coordinates to world coordinates
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Calculate tile coordinates based on world point
        let tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
        let tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

        // Ensure click is within map bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let clickedTile = this.map.getTile(tileX, tileY);
            
            if (clickedTile) {
                console.log(`Clicked on ${clickedTile.terrain} at (${tileX}, ${tileY})`);
                this.selectedTile = clickedTile;
                this.selectionMarker.setVisible(true);
                this.selectionMarker.setPosition(tileX * this.TILE_SIZE, tileY * this.TILE_SIZE);
                this.lastTileInfoSnapshot = {...clickedTile}; // Store a snapshot of the tile info via shallow copy
                
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
        console.log("Starting fire initialization...");
        
        // Safety check to ensure map is properly initialized
        if (!this.map || !this.map.grid || this.map.grid.length === 0) {
            console.error("Map not properly initialized when starting fire!");
            // Schedule another attempt after a short delay
            this.time.delayedCall(500, () => this.startFire());
            return;
        }
        
        let startX, startY, tile;
        let attempts = 0;
        const maxAttempts = 200; // Increase max attempts
        let foundFlammableTile = false;
        
        console.log("Searching for flammable tile...");
        
        // First approach: Random selection with increasing search intensity
        while (!foundFlammableTile && attempts < maxAttempts) {
            startX = Math.floor(Math.random() * this.map.width);
            startY = Math.floor(Math.random() * this.map.height);
            
            // Validate coordinates before accessing the grid
            if (startY >= 0 && startY < this.map.grid.length && 
                startX >= 0 && startX < this.map.grid[startY].length) {
                
                tile = this.map.grid[startY][startX];
                
                // Verify tile has necessary properties
                if (tile && typeof tile.flammability !== 'undefined') {
                    if (tile.flammability > 0) {
                        foundFlammableTile = true;
                        console.log(`Found flammable tile at (${startX}, ${startY}) after ${attempts} attempts`);
                        break;
                    }
                } else {
                    console.warn("Found invalid tile at", startX, startY);
                }
            }
            
            attempts++;
        }
        
        // Second approach: Systematic search if random fails
        if (!foundFlammableTile) {
            console.log("Random search failed, trying systematic search...");
            for (let y = 0; y < this.map.height; y++) {
                for (let x = 0; x < this.map.width; x++) {
                    if (y < this.map.grid.length && x < this.map.grid[y].length) {
                        const candidateTile = this.map.grid[y][x];
                        if (candidateTile && 
                            candidateTile.terrain && 
                            (candidateTile.terrain === 'tree' || 
                             candidateTile.terrain === 'shrub' || 
                             candidateTile.terrain === 'grass')) {
                            
                            startX = x;
                            startY = y;
                            tile = candidateTile;
                            
                            // Force the tile to be flammable if needed
                            if (tile.flammability === 0) {
                                console.log(`Forcing tile at (${x}, ${y}) to be flammable`);
                                tile.flammability = 1;
                                tile.fuel = 10; // Ensure there's fuel to burn
                            }
                            
                            foundFlammableTile = true;
                            break;
                        }
                    }
                }
                if (foundFlammableTile) break;
            }
        }
        
        // Final check - did we find something to burn?
        if (!foundFlammableTile || !tile) {
            console.error("CRITICAL: Could not find any flammable tile after exhaustive search");
            console.log("Map data:", this.map);
            
            // Last resort: try again after a delay
            this.time.delayedCall(1000, () => {
                console.log("Attempting fire start again after delay");
                this.startFire();
            });
            return;
        }
        
        // We have a valid tile, let's set it on fire
        console.log(`Setting fire at (${startX}, ${startY}) with terrain: ${tile.terrain}`);
        tile.burnStatus = "burning";
        
        // Add visual fire effect
        if (tile.sprite) {
            try {
                let blaze = new AnimatedSprite(3);
                blaze.lightFire(this, tile.sprite, this.flameGroup);
                tile.fireS = blaze;
                console.log("Fire sprite added successfully");
            } catch (error) {
                console.error("Failed to add fire sprite:", error);
            }
        } else {
            console.warn("Tile has no sprite to attach fire effect to");
        }
        
        // Pan camera to fire location
        try {
            this.cameras.main.pan(
                startX * this.TILE_SIZE + this.TILE_SIZE / 2,
                startY * this.TILE_SIZE + this.TILE_SIZE / 2,
                1000,
                'Power2'
            );
            console.log("Camera panned to fire location");
        } catch (error) {
            console.error("Failed to pan camera:", error);
        }
        
        return true; // Indicate successful fire start
    }

    simulateInitialSpread(rounds = 4) {
        let burningCoords = [];
    
        // Collect all current burning tiles
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid[y][x];
                if (tile.burnStatus === "burning") {
                    burningCoords.push({ x, y });
                }
            }
        }
    
        let visited = new Set(burningCoords.map(c => `${c.x},${c.y}`));
    
        for (let i = 0; i < rounds; i++) {
            let newCoords = [];
    
            burningCoords.forEach(({ x, y }) => {
                const neighbors = this.fireSpread.getNeighbors(x, y);
    
                neighbors.forEach(({ x: nx, y: ny }) => {
                    const neighbor = this.map.grid[ny][nx];
                    const key = `${nx},${ny}`;
    
                    if (!visited.has(key) && this.fireSpread.canIgnite(neighbor)) {
                        neighbor.burnStatus = "burning";
    
                        if (!neighbor.fireS && neighbor.sprite) {
                            const blaze = new AnimatedSprite(3);
                            blaze.lightFire(this, neighbor.sprite, this.flameGroup);
                            neighbor.fireS = blaze;
                        }
    
                        newCoords.push({ x: nx, y: ny });
                        visited.add(key);
                    }
                });
            });
    
            burningCoords = newCoords;
        }
    
        console.log("Simulated initial non-burning fire burst.");
    }
    

    updateFireSpread() {
        const spreadCount = this.fireSpread.simulateFireStep();

        // Only update burning tiles that need visual effects
        this.map.grid.forEach((row) => {
            row.forEach((tile) => {
                if (tile.burnStatus === "burning" && !tile.fireS) {
                    let blaze = new AnimatedSprite(3);
                    blaze.lightFire(this, tile.sprite, this.flameGroup);
                    tile.fireS = blaze;
                }
            });
        });

        // Update weather visualizations only if visible
        if (this.windOverlay.visible) {
            this.updateWindOverlay();
        }
    }

    toggleFireSimulation() {
        console.log("Toggle fire simulation called");
        this.isFireSimRunning = !this.isFireSimRunning;
        console.warn(`Fire Simulation ${this.isFireSimRunning ? "Started" : "Stopped"}`);
        
        // Notify UIScene
        this.events.emit('fireSimToggled', this.isFireSimRunning);
    }

    updateWeatherOverTime(delta) {
        this.weather.tick(delta);
        this._recalcSpreadInterval();
        this.events.emit('weatherUpdated', this.weather);
    }

    update(time, delta) {
        if (this.isFireSimRunning) {
            // Update game time
            this.elapsedTime += delta / 1000;
            
            // Notify UI about time update
            this.events.emit('updateGameClock', this.elapsedTime);
            
            // Update weather
            this.weather.tick(delta / 1000);
            
            // Get center weather for UI updates
            const centerWeather = this.weather.getLocalWeather(this.MAP_WIDTH/2, this.MAP_HEIGHT/2);
            
            // Update global risk and notify UI
            const risk = this.weather.getGlobalRisk();
            this.events.emit('updateGlobalRisk', risk);
            
            // Update wind direction in UI
            this.events.emit('updateWindDirection', centerWeather.windDirection, centerWeather.windSpeed);
            
            // Update weather visualizations only if visible
            if (this.windOverlay.visible) {
                this.updateWindOverlay();
            }
            
            // Handle fire spread at interval
            const timeSinceLastStep = this.elapsedTime - this.lastFireSpreadTime;
            const stepDuration = this.FIRE_SPREAD_INTERVAL / 1000;
            const stepProgress = (timeSinceLastStep / stepDuration) * 100;
            this.scene.get('UIScene').updateFireProgress(stepProgress);
        
            if (timeSinceLastStep >= stepDuration) {
                this.lastFireSpreadTime = this.elapsedTime;
                this.updateFireSpread();
            }
        }
        
        // Handle keyboard camera controls
        this.handleCameraControls(delta);
        
        // Scale fire sprites based on camera zoom
        if (this.flameGroup && this.flameGroup.getChildren().length > 0) {
            this.flameGroup.getChildren().forEach(flameSprite => {
                flameSprite.setScale(1 / this.currentZoom);
            });
        }

        // Update selected tile info less frequently
        if (this.selectedTile) {
            this.lastTileInfoUpdate += delta;
            if (this.lastTileInfoUpdate >= this.tileInfoUpdateInterval) {
                this.lastTileInfoUpdate = 0;
        
                const currentSnapshot = {
                    fuel: this.selectedTile.fuel,
                    burnStatus: this.selectedTile.burnStatus,
                    terrain: this.selectedTile.terrain
                };
        
                const hasChanged = JSON.stringify(currentSnapshot) !== JSON.stringify(this.lastTileSnapshot);
                if (hasChanged) {
                    this.events.emit('tileInfo', {
                        ...this.selectedTile,
                        screenX: this.input.activePointer.x,
                        screenY: this.input.activePointer.y
                    });
        
                    this.lastTileSnapshot = { ...currentSnapshot };
                }
            }
        }
    }
    
    handleCameraControls(delta) {
        // Adjust camera speed based on zoom level
        const adjustedSpeed = this.CAMERA_SPEED / this.currentZoom;
        
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
        let zoomChanged = false;
        if (this.zoomKeys.zoomIn.isDown) {
            this.currentZoom = Phaser.Math.Clamp(this.currentZoom + 0.01, this.MIN_ZOOM, this.MAX_ZOOM);
            this.cameras.main.setZoom(this.currentZoom);
            zoomChanged = true;
        } 
        else if (this.zoomKeys.zoomOut.isDown) {
            this.currentZoom = Phaser.Math.Clamp(this.currentZoom - 0.01, this.MIN_ZOOM, this.MAX_ZOOM);
            this.cameras.main.setZoom(this.currentZoom);
            zoomChanged = true;
        }
        
        if (zoomChanged) {
            this.events.emit('zoomChanged', this.currentZoom);
            this.centerMapIfNeeded();
        }
    }

    handleFireExtinguish(fireSprite) {
        // Convert fire sprite position to tile coordinates
        const startX = (this.cameras.main.width - this.mapPixelWidth) / 2;
        const startY = (this.cameras.main.height - this.mapPixelHeight) / 2;

        let tileX = Math.floor((fireSprite.x) / this.TILE_SIZE);
        let tileY = Math.floor((fireSprite.y) / this.TILE_SIZE);

        // Ensure the tile is within bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let tile = this.map.grid[tileY][tileX];
            
            if (tile) {
                // Update burn status
                tile.burnStatus = 'extinguished';
                
                // Update tile terrain in order to show extinguished sprite
                let originalTerrain = tile.terrain;
                if (tile.terrain.includes('grass') || tile.terrain === 'grass') {
                    tile.terrain = 'extinguished-grass';
                } else if (tile.terrain.includes('shrub') || tile.terrain === 'shrub') {
                    tile.terrain = 'extinguished-shrub';
                } else if (tile.terrain.includes('tree') || tile.terrain === 'tree') {
                    tile.terrain = 'extinguished-tree';
                }
        
                // Update the tile's sprite to show it extinguished
                this.fireSpread.updateSprite(tileX, tileY);
                
                // Remove fire sprite if it exists
                if (tile.fireS) {
                    tile.fireS.extinguishFire();
                    tile.fireS = null;
                }
            }
        }
    }
}