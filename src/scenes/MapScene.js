import Map from '../components/MapGenerator.js';
import FireSpread from '../components/FireSpread.js';
import Weather from '../components/Weather.js';
import AnimatedSprite from '../components/AnimatedSprites.js';
import { bank } from "../components/ui.js";
import { setCoins, getCoins, initDirectionHandler, activated_resource, use_resource, mode } from "../components/DeploymentClickEvents.js";
import { auth, db } from '../firebaseConfig.js';
import { collection, collectionGroup, doc, getDocs,getDoc, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { resetAssetValues } from "../components/assetValues.js"



export let paused = true;

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
        this.FIRE_SPREAD_INTERVAL = 20000; // Fire step interval (ms)
        
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
        this.panVector = { x:0, y:0 };

        // Player's score
        this.score = 0;

        // Disable Map Panning if field manual is open
        this.disableZoom = false;
    }

    preload() {
        console.log("MapScene Preload Starting");
        
        // Preload terrain assets
        this.load.image('water', 'assets/64x64-Map-Tiles/water.png');
        this.load.image('grass', 'assets/64x64-Map-Tiles/grass.png');
        this.load.image('shrub', 'assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', 'assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png');
        this.load.image('dirt-house', 'assets/64x64-Map-Tiles/dirt-house.png');
        this.load.image('sand-house', 'assets/64x64-Map-Tiles/sand-house.png');
        this.load.image('grass-house', 'assets/64x64-Map-Tiles/grass-house.png');
        
        // Preload burned terrain assets
        this.load.image('burned-grass', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-grass.png');
        this.load.image('burned-shrub', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-shrubs-on-sand.png');
        this.load.image('burned-tree', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-trees-on-light-dirt.png');
        this.load.image('burned-dirt-house', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-dirt-house.png');
        this.load.image('burned-sand-house', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-sand-house.png');
        this.load.image('burned-grass-house', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-grass-house.png');

        // Preload extinguished terrain assets
        this.load.image('extinguished-grass', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/grass.png');
        this.load.image('extinguished-shrub', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/shrub.png');
        this.load.image('extinguished-tree', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/tree.png');
        this.load.image('extinguished-dirt-house', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/dirt-house.png');
        this.load.image('extinguished-sand-house', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/sand-house.png');
        this.load.image('extinguished-grass-house', 'assets/64x64-Map-Tiles/Extinguished%20Tiles/grass-house.png');

        // Preload firebreak
        this.load.image('fire-break', 'assets/64x64-Map-Tiles/fire-break.png');
        
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

        this.input.mouse.disableContextMenu();

        // Generate and render the map
        this.initializeMap();
        
        // Set up camera controls for panning and zooming
        this.setupCameraControls();

        // Start UI scene if it's not already running
        if (!this.scene.isActive('UIScene')) {
            this.scene.launch('UIScene');
        }

        // Init handler for deployment direction prompt
        initDirectionHandler(this);

        // Set up input events
        this.input.on('pointerdown', this.handleTileClick, this);

        // Set up event listeners for UI scene communication
        this.setupEventListeners();

        // Add event listener for fire extinguishing
        this.events.on('extinguishFire', this.handleFireExtinguish, this);

        this.input.on('pointermove', this.updateDeploymentPreview, this);

        // Tile stats highlight
        this.selectionMarker = this.add.graphics();
        this.selectionMarker.lineStyle(3, 0x00ffff, 1); // Cyan border
        this.selectionMarker.strokeRect(0, 0, this.TILE_SIZE, this.TILE_SIZE);
        this.selectionMarker.setVisible(false);
        this.selectionMarker.setDepth(100);

        this.previewOverlay = this.add.graphics();
        this.previewOverlay.setDepth(99); // Below selectionMarker, above terrain


        console.log("MapScene Create Finished");
    }

    setupEventListeners() {
        // Listen for events from UIScene
        console.log("Setting up MapScene event listeners");
        this.scene.get('UIScene').events.on('toggleFire', this.toggleFireSimulation, this);
        this.scene.get('UIScene').events.on('restartGame', this.initializeMap, this);

        const ui = this.scene.get('UIScene');
        ui.events.on('panStart', this.onPanStart, this);
        ui.events.on('panStop',  this.onPanStop,  this);
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
        this.cameras.main.setViewport(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Center the camera on the map
        this.cameras.main.centerOn(this.mapPixelWidth / 2, this.mapPixelHeight / 2);
        
        // Set initial zoom
        this.currentZoom = Math.max(this.MIN_ZOOM, 1);
        this.cameras.main.setZoom(this.currentZoom);

        // Set up zoom with mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            // Skip if zoom is disabled (field manual is open)
            if (this.disableZoom) return; 
            
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

        // Hide win text on restart if visible
        const ui = this.scene.get('UIScene');
        if (ui?.winText?.visible) {
            ui.winText.setVisible(false);
        }

        resetAssetValues();
        
        // Set player coins in bank to 0
        if (this.scene.isActive('UIScene')) {  
            setCoins(getCoins());
            bank.setText(`${getCoins()}`);
        }
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
    if (this.isPanning) return;

    const viewportWidth = this.cameras.main.width - this.UI_WIDTH;
    if (pointer.x > viewportWidth) return;

    // Calculate tile coordinates
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const tileX = Math.floor(worldPoint.x / this.TILE_SIZE);
    const tileY = Math.floor(worldPoint.y / this.TILE_SIZE);

    // Ensure click is within map bounds
    if (tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) return;

    const clickedTile = this.map.getTile(tileX, tileY);
    if (!clickedTile) return;

    // —— DEPLOYMENT MODE GUARD ——  
    if (mode === "deployment") {
if (activated_resource === "hotshot-crew"   ||
    activated_resource === "hotshotcrew") {
            // Hotshots can drop on any tile:
            const xPx = tileX * this.TILE_SIZE;
            const yPx = tileY * this.TILE_SIZE;
            use_resource(this, xPx, yPx, null);
        } else {
            // All other tools must target an existing fire sprite
            const fireSprite = clickedTile.fireSprite;
            if (!fireSprite) {
                // (Optional) show a “No fire here” notification
                return;
            }
            use_resource(this, fireSprite.x, fireSprite.y, fireSprite);
        }
        return;  // skip the normal tile-info UI after deploying
    }

    // —— NORMAL TILE SELECTION UI ——  
    this.selectedTile = clickedTile;
    this.selectionMarker
        .setVisible(true)
        .setPosition(tileX * this.TILE_SIZE, tileY * this.TILE_SIZE);
    this.lastTileInfoSnapshot = { ...clickedTile };

    this.events.emit("tileInfo", {
        ...clickedTile,
        screenX: pointer.x,
        screenY: pointer.y
    });
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
                             candidateTile.terrain === 'grass' ||
                             candidateTile.terrain === 'dirt_house' ||
                             candidateTile.terrain === 'sand_house' ||
                             candidateTile.terrain === 'grass_house')) {
                            
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
        
        this.fireSpread.simulateFireStep();

        // if still fires, just make sure any newly burning tiles get their flame sprite:
        this.map.grid.forEach(row =>
            row.forEach(tile => {
                if (tile.burnStatus === "burning" && !tile.fireS) {
                    const blaze = new AnimatedSprite(3);
                    blaze.lightFire(this, tile.sprite, this.flameGroup);
                    tile.fireS = blaze;
                }
            })
        );
    }

updateDeploymentPreview(pointer) {
    // Only draw if we're in deployment mode with an active resource
    if (mode !== "deployment" || !activated_resource) {
        this.previewOverlay.clear();
        return;
    }

    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const tx = Math.floor(worldPoint.x / this.TILE_SIZE);
    const ty = Math.floor(worldPoint.y / this.TILE_SIZE);

    // Clear any previous overlay
    this.previewOverlay.clear();

    const dir = this.dropDirection || "horizontal";  // Default to horizontal if not set

    // 🔥 Hotshot Crew - Firebreak Line Preview
    if (activated_resource === "hotshot-crew") {
        this.previewOverlay.lineStyle(2, 0xffd700, 1); // Yellow border

        for (let offset = -2; offset <= 2; offset++) {
            const nx = dir === "vertical" ? tx + offset : tx;
            const ny = dir === "horizontal" ? ty + offset : ty;

            if (nx >= 0 && nx < this.map.width && ny >= 0 && ny < this.map.height) {
                this.previewOverlay.strokeRect(
                    nx * this.TILE_SIZE,
                    ny * this.TILE_SIZE,
                    this.TILE_SIZE,
                    this.TILE_SIZE
                );
            }
        }
    }

    // 💨 Airtanker - Circular Drop Zone Preview
    if (activated_resource === "airtanker") {
        this.previewOverlay.lineStyle(2, 0x00ffff, 1); // Cyan border
        this.previewOverlay.strokeCircle(
            tx * this.TILE_SIZE + this.TILE_SIZE / 2,
            ty * this.TILE_SIZE + this.TILE_SIZE / 2,
            this.TILE_SIZE * 2.5 // Radius preview
        );
    }
}

    toggleFireSimulation() {
        console.log("Toggle fire simulation called");
        this.isFireSimRunning = !this.isFireSimRunning;
        console.warn(`Fire Simulation ${this.isFireSimRunning ? "Started" : "Stopped"}`);
        paused = !this.isFireSimRunning; // stops the player from using assets when the game is paused
        
        // Notify UIScene
        this.events.emit('fireSimToggled', this.isFireSimRunning);
    }

    update(time, delta) {
        
        if (this.isFireSimRunning) {
          // 1) Advance game clock
          this.elapsedTime += delta / 1000;
          this.events.emit('updateGameClock', this.elapsedTime);
      
          // 2) Compute progress toward next fire step
          const timeSinceLastStep = this.elapsedTime - this.lastFireSpreadTime;
          const stepDuration   = this.FIRE_SPREAD_INTERVAL / 1000;
          const stepProgress   = (timeSinceLastStep / stepDuration) * 100;
          this.scene.get('UIScene').updateFireProgress(stepProgress);
      
          // 3) When it’s time for the next spread:
          if (timeSinceLastStep >= stepDuration) {
            // a) “Catch up” weather by the same elapsed milliseconds
            this.weather.updateOverTime(stepDuration * 1000);
            this.events.emit('weatherUpdated', this.weather);
      
            // b) Reset timer and actually spread fire
            this.lastFireSpreadTime = this.elapsedTime;
            this.updateFireSpread();
          }
          
        }
        

        // Handle keyboard camera controls
        if (!this.scene.isActive('LoginScene') 
            && !this.scene.isActive('SignupScene')) 
        {
        this.handleCameraControls(delta);
        }     
        
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

    onPanStart(dir) {
        this.panVector = dir;
      }
    
      onPanStop() {
        this.panVector = { x: 0, y: 0 };
    }
    
    handleCameraControls(delta) {
        // Adjust camera speed based on zoom level
        const adjustedSpeed = this.CAMERA_SPEED / this.currentZoom;
        
        // Calculate camera movement based on keyboard input
        let moveX = ((this.cursors.left.isDown || this.wasd.left.isDown) ? -adjustedSpeed : 0) +
                      ((this.cursors.right.isDown || this.wasd.right.isDown) ? adjustedSpeed : 0);
        
        let moveY = ((this.cursors.up.isDown || this.wasd.up.isDown) ? -adjustedSpeed : 0) +
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

        moveX += this.panVector.x * adjustedSpeed;
        moveY += this.panVector.y * adjustedSpeed;

        // apply it:
        if (moveX || moveY) {
        this.cameras.main.scrollX += moveX;
        this.cameras.main.scrollY += moveY;
        }
        
        if (zoomChanged) {
            this.events.emit('zoomChanged', this.currentZoom);
            this.centerMapIfNeeded();
        }
    }

    handleFireExtinguish(fireSprite) {
        let tileX = Math.floor((fireSprite.x) / this.TILE_SIZE);
        let tileY = Math.floor((fireSprite.y) / this.TILE_SIZE);

        // Ensure the tile is within bounds
        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let tile = this.map.grid[tileY][tileX];
            
            if (tile) {
                // Update burn status
                tile.burnStatus = 'extinguished';
                this.score += 1;
                this.events.emit('scoreUpdated', this.score);
                console.log("Score: ", this.score);
                
                // Update tile terrain in order to show extinguished sprite
                if (tile.terrain === 'grass') {
                    tile.terrain = 'extinguished-grass';
                } else if (tile.terrain.includes('shrub') || tile.terrain === 'shrub') {
                    tile.terrain = 'extinguished-shrub';
                } else if (tile.terrain.includes('tree') || tile.terrain === 'tree') {
                    tile.terrain = 'extinguished-tree';
                } else if (tile.terrain.includes('dirt-house') || tile.terrain === 'dirt-house') {
                    tile.terrain = 'extinguished-dirt-house';
                } else if (tile.terrain.includes('sand-house') || tile.terrain === 'sand-house') {
                    tile.terrain = 'extinguished-sand-house';
                } else if (tile.terrain.includes('grass-house') || tile.terrain === 'grass-house') {
                    tile.terrain = 'extinguished-grass-house';
                }
        
                // Update the tile's sprite to show it extinguished
                this.fireSpread.updateSprite(tileX, tileY);
                
                // Remove fire sprite if it exists
                if (tile.fireS) {
                    tile.fireS.extinguishFire();
                    tile.fireS = null;
                }

                const stillBurning = this.map.grid.some(row =>
                    row.some(t => t.burnStatus === 'burning')
                );

                if (!stillBurning) {
                    this.isFireSimRunning = false;
                    this.events.emit('gameWon');
                    this.events.emit('fireSimToggled', false);
                    this.sendScoreToDB();
                }
            }
        }
    }

    //-----------------------Firestore------------------------------//

    /**
     * Orchestrates the full flow of saving the current score
     * and then fetching the highest score back.
     */
    sendScoreToDB() {
        // Grab the final score from wherever you’ve stored it
        const finalScore = this.score;

        // Save it into the user’s subcollection
        this.saveUserScore(finalScore);

        // Then immediately retrieve the highest score (for display, etc.)
        // this.getHighestScore();
    }

    /**
     * Saves a single score document under
     * users/{uid}/scores in Firestore.
     * @param {number} scoreParameter – The score to save
     */
    async saveUserScore(scoreParameter) {
        // Get the currently signed‑in user
        const user = auth.currentUser;

        if (user) {
            // Create a new doc reference in users/{uid}/scores
            const scoreDocRef = doc(
                collection(db, "users", user.uid, "scores")
            );

            try {
                // Write the score to Firestore
                await setDoc(scoreDocRef, { score: scoreParameter });
                console.log("Score saved successfully");
            } catch (error) {
                // Log any errors during the write
                console.error("Error saving score", error);
            }
        } else {
            // No user signed in, so we can’t save
            console.log("User not signed in");
        }
    }

    /**
     * Fetches the single highest score in the
     * users/{uid}/scores subcollection.
     * @returns {Promise<number|null>} – Highest score or null
     */
    async getHighestScore() {
        const user = auth.currentUser;

        if (user) {
            // Reference to the scores collection for this user
            const scoreRef = collection(db, "users", user.uid, "scores");

            // Query: order by score descending, limit to 1
            const q = query(scoreRef, orderBy("score", "desc"), limit(1));

            try {
                // Execute the query
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Print and return the top score
                    const topScore = querySnapshot.docs[0].data().score;
                    console.log(topScore);
                    return topScore;
                } else {
                    // No scores found for this user
                    console.log("No scores found");
                    return null;
                }
            } catch (error) {
                // Handle any errors fetching documents
                console.error("Error fetching scores", error);
                return null;
            }
        } else {
            // No user signed in, so we can’t read
            console.log("User not signed in");
            return null;
        }
    }

    async getTopNScores(n) {
        // 1) Ensure there’s a signed‑in user
        const user = auth.currentUser;
        if (!user) {
            console.log("User not signed in");
            return [];
        }

        // 2) Reference the user’s "scores" subcollection
        const scoreRef = collection(db, "users", user.uid, "scores");

        // 3) Build a query ordered by "score" descending, limited to n entries
        const q = query(
        scoreRef,
        orderBy("score", "desc"),
        limit(n)
        );

        try {
            // 4) Execute and collect the scores
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No scores found");
                return [];
            }

            // Map each document to its numeric score
            const topScores = querySnapshot.docs.map(doc =>
            doc.data().score
            );

            console.log(`Top ${n} scores:`, topScores);
            return topScores;

        } catch (error) {
            // 5) Error handling
            console.error("Error fetching top scores", error);
            return [];
        }
    }

    /**
   * Helper: fetch top N scores across all users
   */
  async getGlobalTopNScores(n) {
  // 1) Set up a collection‑group query on every "scores" subcollection
  const scoresGroup = collectionGroup(db, "scores");

  // 2) Order by "score" descending and limit to the top N
  const q = query(
    scoresGroup,
    orderBy("score", "desc"),
    limit(n)
  );

  try {
    // 3) Execute the scores query
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("No global scores found");
      return [];
    }

    // 4) For each score doc, fetch the corresponding user profile
    const detailed = await Promise.all(
      snapshot.docs.map(async scoreDoc => {
        // Extract the UID from the path: "users/{uid}/scores/{docId}"
        const [, uid] = scoreDoc.ref.path.split('/');

        // Fetch the user's profile document
        const userSnap = await getDoc(doc(db, "users", uid));
        // Use displayName if available, otherwise fallback to UID
        const displayName = userSnap.exists()
          ? userSnap.data().displayName
          : uid;

        // Return a combined object with score and displayName
        return {
          userId: uid,
          displayName,
          score: scoreDoc.data().score
        };
      })
    );

    return detailed;  // [ { userId, displayName, score }, … ]
  } catch (err) {
    console.error("Error fetching global top scores:", err);
    return [];
  }
}
}
