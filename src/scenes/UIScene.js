import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    preload() {
        preloadHUD(this);
        
        // Load zoom control assets
        // If these assets don't exist, we'll use fallback shapes instead
        this.load.image('zoom-in', 'assets/zoom-in.png');
        this.load.image('zoom-out', 'assets/zoom-out.png');
    }

    create() {
        console.log("UIScene Created");

        // Create a separate camera for UI elements that won't move
        this.UICamera = this.cameras.add(0, 0, 800, 600).setName('UICamera');
        this.UICamera.setScroll(0, 0); // Ensure UI camera stays fixed
        
        // Create UI Elements (basic game info)
        this.createUIElements();

        // Create zoom controls
        this.createZoomControls();

        // Tile info display (fixed position like in original)
        this.createTileInfoDisplay();

        // Ensure HUD is created with all resource buttons
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
        // Game title (top left)
        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px "Georgia", serif',
            color: '#8B4513'
        }).setScrollFactor(0).setDepth(100);

        // Restart Game button
        this.restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('restartGame'); // Emit event to MapScene
            })
            .setScrollFactor(0)
            .setDepth(100);

        // Fire toggle button - positioned at bottom like in original
        this.fireButton = this.add.text(720, 920, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // Emit event to MapScene
            })
            .setScrollFactor(0)
            .setDepth(100);

        // Game clock - keep in top center
        this.gameClockText = this.add.text(400, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5, 0)
          .setScrollFactor(0)
          .setDepth(100);

        // Zoom level display
        this.zoomText = this.add.text(300, 40, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0)
          .setDepth(100);
        
        // Weather display - position at bottom like in original
        this.weatherText = this.add.text(200, 570, 'Loading weather...', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#556B2F',
            padding: { x: 15, y: 10 }
        }).setScrollFactor(0)
          .setDepth(100);
        
        // Map controls help text
        this.controlsText = this.add.text(10, 100, "Controls:\nWASD/Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0)
          .setDepth(100);
    }
    
    createTileInfoDisplay() {
        // Create fixed black box for tile info like in original
        this.tileInfoBackground = this.add.rectangle(100, 550, 200, 150, 0x000000)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(99)
            .setVisible(false);
        
        // Create tile info text display
        this.tileInfoText = this.add.text(110, 560, 
            "Select tile\nCoordinates: n/a\nTerrain: n/a\nFlammability: n/a\nFuel: n/a\nBurn Status: n/a", {
            fontSize: "16px",
            fill: "#fff",
            align: "left"
        }).setScrollFactor(0)
          .setDepth(100)
          .setVisible(false);
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
                .setDisplaySize(buttonSize, buttonSize)
                .setScrollFactor(0)
                .setDepth(100);
                
            // Zoom out button
            this.zoomOutButton = this.add.image(buttonX, zoomOutY, 'zoom-out')
                .setOrigin(0)
                .setDisplaySize(buttonSize, buttonSize)
                .setScrollFactor(0)
                .setDepth(100);
        } else {
            // Fallback to rectangle buttons with text if images not available
            // Zoom in button
            this.zoomInButton = this.add.rectangle(buttonX, zoomInY, buttonSize, buttonSize, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0)
                .setDepth(100);
                
            this.add.text(buttonX + buttonSize/2, zoomInY + buttonSize/2, "+", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(101);
            
            // Zoom out button
            this.zoomOutButton = this.add.rectangle(buttonX, zoomOutY, buttonSize, buttonSize, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0)
                .setDepth(100);
                
            this.add.text(buttonX + buttonSize/2, zoomOutY + buttonSize/2, "-", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(101);
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

    // Handler for tile information updates - using fixed display box
    updateTileInfo(tile) {
        console.log(`Updating tile info: ${tile.terrain}, ${tile.flammability}, ${tile.fuel}, ${tile.burnStatus}`);
        
        if (this.tileInfoText) {
            // Update tile info with proper formatting like original game
            this.tileInfoText.setText(
                `Select tile\nCoordinates: (${tile.x}, ${tile.y})\nTerrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`
            );
            
            // Show the info box
            this.tileInfoBackground.setVisible(true);
            this.tileInfoText.setVisible(true);
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
    }
}