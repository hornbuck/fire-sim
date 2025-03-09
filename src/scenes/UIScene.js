import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    preload() {
        preloadHUD(this);
        
        // Load zoom control assets
        this.load.image('zoom-in', 'assets/zoom-in.png');
        this.load.image('zoom-out', 'assets/zoom-out.png');
    }

    create() {
        console.log("UIScene Created");
        
        // Create UI Elements
        this.createUIElements();

        // Create zoom controls
        this.createZoomControls();

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
        }).setScrollFactor(0);

        // Restart Game button
        this.restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('restartGame');
            })
            .setScrollFactor(0);

        // Fire toggle button (Start/Stop Fire)
        this.fireButton = this.add.text(700, 570, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire');
            })
            .setScrollFactor(0)
            .setOrigin(1, 1);  // Align to bottom right

        // Game clock - positioned at top center
        this.gameClockText = this.add.text(400, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5, 0).setScrollFactor(0);

        // Zoom level display
        this.zoomText = this.add.text(400, 40, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5, 0).setScrollFactor(0);

        // Controls info at top left
        this.controlsText = this.add.text(10, 80, "Controls:\nWASD/Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);

        // Weather text at bottom of screen
        this.weatherText = this.add.text(10, 570, 'Loading weather...', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#556B2F',
            padding: { x: 15, y: 10 }
        }).setScrollFactor(0);

        // Tile info display
        this.tileInfoText = this.add.text(10, 400, "", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setScrollFactor(0).setVisible(false);
    }
    
    createZoomControls() {
        // Add zoom buttons on the left side
        const buttonSize = 40;
        const buttonX = 10;
        const zoomInY = 200;
        const zoomOutY = 250;
        
        // Zoom in button
        this.zoomInButton = this.add.rectangle(buttonX, zoomInY, buttonSize, buttonSize, 0x666666)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff)
            .setScrollFactor(0);
            
        this.add.text(buttonX + buttonSize/2, zoomInY + buttonSize/2, "+", {
            fontSize: "24px",
            fill: "#fff"
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Zoom out button
        this.zoomOutButton = this.add.rectangle(buttonX, zoomOutY, buttonSize, buttonSize, 0x666666)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff)
            .setScrollFactor(0);
            
        this.add.text(buttonX + buttonSize/2, zoomOutY + buttonSize/2, "-", {
            fontSize: "24px",
            fill: "#fff"
        }).setOrigin(0.5).setScrollFactor(0);
        
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
    }
}