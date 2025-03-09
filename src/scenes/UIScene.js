import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    preload() {
        preloadHUD(this);
        
        // Load new minimap and zoom control assets
        // If these assets don't exist, we'll use fallback shapes instead
        this.load.image('minimap-frame', 'assets/minimap-frame.png');
        this.load.image('zoom-in', 'assets/zoom-in.png');
        this.load.image('zoom-out', 'assets/zoom-out.png');
    }

    create() {
        console.log("UIScene Created");

        // Add a separate camera for UI that doesn't move
        this.cameras.add(0, 0, 800, 600).setName('UICamera');
        
        // Create UI Elements
        this.createUIElements();

        // Create map navigation controls
        this.createMapNavigationControls();

        // Ensure HUD is created
        createHUD(this);

        // Initialize resource text references
        this.hoseText = hoseText;
        this.extinguisherText = extinguisherText;
        this.helicopterText = helicopterText;
        this.firetruckText = firetruckText;
        this.airtankerText = airtankerText;
        this.hotshotcrewText = hotshotcrewText;
        this.smokejumperText = smokejumperText;

        // Listen for events from MapScene
        this.scene.get('MapScene').events.on('updateGameClock', this.updateGameClock, this);
        this.scene.get('MapScene').events.on('weatherUpdated', this.updateWeatherDisplay, this);
        this.scene.get('MapScene').events.on('tileInfo', this.updateTileInfo, this);
        this.scene.get('MapScene').events.on('fireSimToggled', this.updateFireButton, this);
        this.scene.get('MapScene').events.on('zoomChanged', this.handleZoomChange, this);
        this.scene.get('MapScene').events.on('mapSizeChanged', this.updateMapInfo, this);
    }

    createUIElements() {
        // Game title
        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px "Georgia", serif',
            color: '#8B4513'
        });

        // Restart Game button
        this.restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('restartGame'); // Emit event to MapScene
            });

        // Fire toggle button
        this.fireButton = this.add.text(10, 80, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // Emit event to MapScene
            });

        // Weather text display
        this.weatherText = this.add.text(10, 120, 'Loading weather...', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#556B2F',
            padding: { x: 15, y: 10 }
        });

        // Game clock
        this.gameClockText = this.add.text(200, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        });

        // Tile info display
        this.tileInfoText = this.add.text(10, 550, "", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setVisible(false);
        
        // Zoom level display
        this.zoomText = this.add.text(200, 40, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        });
        
        // Map controls help text
        this.controlsText = this.add.text(10, 160, "Controls:\nWASD/Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        });
    }
    
    createMapNavigationControls() {
        // Add minimap in the bottom-left corner
        const miniMapSize = 150;
        const miniMapPadding = 10;
        const miniMapX = 10;
        const miniMapY = 600 - miniMapSize - miniMapPadding;
        
        // Create minimap background
        this.createMinimap(miniMapX, miniMapY, miniMapSize);
        
        // Add zoom controls buttons
        this.createZoomControls();
    }
    
    createMinimap(x, y, size) {
        // Create minimap background
        this.minimapBg = this.add.rectangle(x, y, size, size, 0x000000, 0.6)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff);
            
        // Add title to minimap
        this.add.text(x + size/2, y + 10, "Map Overview", {
            fontSize: "12px",
            fill: "#fff"
        }).setOrigin(0.5, 0);
        
        // Create the actual minimap content
        this.minimapContent = this.add.rectangle(x + 5, y + 20, size - 10, size - 25, 0x333333)
            .setOrigin(0);
            
        // Make minimap interactive for navigation
        this.minimapContent.setInteractive().on('pointerdown', (pointer) => {
            // Get map dimensions from MapScene
            const mapScene = this.scene.get('MapScene');
            
            // Calculate relative position within minimap
            const relX = (pointer.x - (x + 5)) / (size - 10);
            const relY = (pointer.y - (y + 20)) / (size - 25);
            
            // Calculate target world position
            const targetX = relX * mapScene.mapPixelWidth;
            const targetY = relY * mapScene.mapPixelHeight;
            
            // Pan camera to this position
            mapScene.cameras.main.pan(targetX, targetY, 500, 'Sine.easeOut');
        });
        
        // Create viewport indicator (shows current view in minimap)
        this.viewportIndicator = this.add.rectangle(0, 0, 0, 0, 0xffffff, 0.3)
            .setStrokeStyle(1, 0xffffff)
            .setOrigin(0);
            
        // Store minimap properties for later use
        this.minimap = {
            x: x + 5,
            y: y + 20,
            width: size - 10,
            height: size - 25
        };
    }
    
    createZoomControls() {
        // Add zoom buttons on the left side
        const buttonSize = 40;
        const buttonX = 10;
        const zoomInY = 250;
        const zoomOutY = 300;
        
        // Try to create zoom buttons with images if available
        let useImageAssets = false;
        try {
            if (this.textures.exists('zoom-in') && this.textures.exists('zoom-out')) {
                useImageAssets = true;
            }
        } catch (e) {
            useImageAssets = false;
        }
        
        if (useImageAssets) {
            // Zoom in button
            this.zoomInButton = this.add.image(buttonX, zoomInY, 'zoom-in')
                .setOrigin(0)
                .setDisplaySize(buttonSize, buttonSize);
                
            // Zoom out button
            this.zoomOutButton = this.add.image(buttonX, zoomOutY, 'zoom-out')
                .setOrigin(0)
                .setDisplaySize(buttonSize, buttonSize);
        } else {
            // Fallback to rectangle buttons with text if images not available
            // Zoom in button
            this.zoomInButton = this.add.rectangle(buttonX, zoomInY, buttonSize, buttonSize, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff);
                
            this.add.text(buttonX + buttonSize/2, zoomInY + buttonSize/2, "+", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5);
            
            // Zoom out button
            this.zoomOutButton = this.add.rectangle(buttonX, zoomOutY, buttonSize, buttonSize, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff);
                
            this.add.text(buttonX + buttonSize/2, zoomOutY + buttonSize/2, "-", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5);
        }
        
        // Make buttons interactive
        this.zoomInButton.setInteractive().on('pointerdown', () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom + 0.1, 
                mapScene.minZoom, 
                mapScene.maxZoom
            );
            mapScene.cameras.main.setZoom(mapScene.currentZoom);
            this.handleZoomChange(mapScene.currentZoom);
        });
        
        this.zoomOutButton.setInteractive().on('pointerdown', () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom - 0.1, 
                mapScene.minZoom, 
                mapScene.maxZoom
            );
            mapScene.cameras.main.setZoom(mapScene.currentZoom);
            this.handleZoomChange(mapScene.currentZoom);
        });
    }

    update() {
        // Update resource counts
        if (this.hoseText) {
            this.hoseText.setText(`${hose}/10`);
            this.extinguisherText.setText(`${extinguisher}/5`);
            this.helicopterText.setText(`${helicopter}/3`);
            this.firetruckText.setText(`${firetruck}/3`);
            this.airtankerText.setText(`${airtanker}/2`);
            this.hotshotcrewText.setText(`${hotshotcrew}/1`);
            this.smokejumperText.setText(`${smokejumper}/5`);
        }
        
        // Update minimap viewport indicator
        this.updateMinimapViewport();
    }
    
    updateMinimapViewport() {
        // Update the viewport indicator on the minimap
        const mapScene = this.scene.get('MapScene');
        
        if (mapScene.cameras && mapScene.cameras.main && this.minimap && this.viewportIndicator) {
            // Get current camera view information
            const camera = mapScene.cameras.main;
            const mapWidth = mapScene.mapPixelWidth;
            const mapHeight = mapScene.mapPixelHeight;
            
            // Calculate the viewport position and size within minimap
            const viewX = (camera.scrollX / mapWidth) * this.minimap.width;
            const viewY = (camera.scrollY / mapHeight) * this.minimap.height;
            
            // Calculate the viewport width and height
            // Take zoom into account
            const viewWidth = (camera.width / mapWidth / camera.zoom) * this.minimap.width;
            const viewHeight = (camera.height / mapHeight / camera.zoom) * this.minimap.height;
            
            // Update the viewport indicator
            this.viewportIndicator.setPosition(this.minimap.x + viewX, this.minimap.y + viewY);
            this.viewportIndicator.width = viewWidth;
            this.viewportIndicator.height = viewHeight;
        }
    }

    // Handler for game clock updates
    updateGameClock(elapsedTime) {
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = Math.floor(elapsedTime % 60);
        
        // Format time as MM:SS
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.gameClockText.setText(`Time: ${formattedTime}`);
    }

    // Handler for weather updates
    updateWeatherDisplay(weather) {
        this.weatherText.setText(`Temp: ${weather.temperature}°F | Humidity: ${weather.humidity}% | Wind: ${weather.windSpeed} mph | Direction: ${weather.windDirection}`);
    }

    // Handler for tile information updates
    updateTileInfo(tile) {
        console.log(`Updating tile info: ${tile.terrain}, ${tile.flammability}, ${tile.fuel}, ${tile.burnStatus}`);
        
        if (this.tileInfoText) {
            this.tileInfoText.setText(`Terrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`);
            
            // Position the info near the clicked position if available
            if (tile.screenX && tile.screenY) {
                // Ensure text stays on screen
                const padding = 10;
                let x = tile.screenX + padding;
                let y = tile.screenY + padding;
                
                // Adjust if would go off screen
                if (x + this.tileInfoText.width > this.cameras.main.width) {
                    x = tile.screenX - this.tileInfoText.width - padding;
                }
                
                if (y + this.tileInfoText.height > this.cameras.main.height) {
                    y = tile.screenY - this.tileInfoText.height - padding;
                }
                
                this.tileInfoText.setPosition(x, y);
            }
            
            this.tileInfoText.setVisible(true);
            this.tileInfoText.setDepth(100);
            
            // Hide after a few seconds
            if (this.tileInfoHideTimer) {
                this.tileInfoHideTimer.remove();
            }
            
            this.tileInfoHideTimer = this.time.delayedCall(3000, () => {
                this.tileInfoText.setVisible(false);
            });
        } else {
            console.warn("tileInfoText is not defined in UIScene!");
        }
    }

    // Handler for fire simulation toggle updates
    updateFireButton(isRunning) {
        this.fireButton.setText(isRunning ? 'Stop Fire' : 'Start Fire');
    }
    
    // Handler for zoom changes
    handleZoomChange(zoomLevel) {
        const percentage = Math.round(zoomLevel * 100);
        this.zoomText.setText(`Zoom: ${percentage}%`);
    }
    
    // Handler for map size changes
    updateMapInfo(mapInfo) {
        console.log(`Map size changed: ${mapInfo.width}x${mapInfo.height} tiles, ${mapInfo.pixelWidth}x${mapInfo.pixelHeight} pixels`);
        
        // Update minimap terrain representation if needed
        this.updateMinimapTerrain(mapInfo);
    }
    
    updateMinimapTerrain(mapInfo) {
        // This method would update the minimap with a simplified representation of the terrain
        // For now, we'll just ensure the minimap dimensions are correct
        if (this.minimap && this.minimapContent) {
            // The minimap content is already set up in createMinimap
            // For a more advanced implementation, you could render a simplified version of the map here
            
            // Example: You could get the terrain data from MapScene and render colored dots for different terrain types
            const mapScene = this.scene.get('MapScene');
            
            // This is optional and could be implemented later for a more visual minimap
            if (mapScene.map && mapScene.map.grid) {
                // For now, we'll leave this as a placeholder for future enhancement
            }
        }
    }
}