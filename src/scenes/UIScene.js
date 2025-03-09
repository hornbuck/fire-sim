import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';
import Weather from '../components/Weather.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    preload() {
        preloadHUD(this);

        // Preload UI Elements
        this.load.image('Title', 'assets/UI/Title.png');
        this.load.image('Restart Button', 'assets/UI/restartButton.png');
        
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
        this.add.image(40, 40, 'Title').setScrollFactor(0);

        // Login Button via MainScene
        const loginMenuButton = this.add.text(600, 10, 'Login', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#A0522D', // Rustic wood-like color
            padding: { x: 15, y: 10 }
        })
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerover', () => {  // Hover effect
                loginMenuButton.setStyle({ backgroundColor: '#8B4513' });
            })
            .on('pointerout', () => {  // Reset when not hovering
                loginMenuButton.setStyle({ backgroundColor: '#A0522D' });
            })
            .on('pointerdown', () => {
                this.events.removeAllListeners();
                this.scene.remove('MainScene'); // Removes the scene entirely.
                this.scene.start('LoginScene');
            });

        // Restart Game button
        const restartButton = this.add.image(140, 50, 'Restart Button')
            .setScrollFactor(0)
            .setInteractive()
            .setScale(1)
            .on('pointerover', () => {  
                restartButton.setTint(0x8B4513);
            })
            .on('pointerout', () => {  
                restartButton.clearTint();
            })
            .on('pointerdown', () => {
                this.events.emit('restartGame'); // Emit event to MapScene
            });

        // Fire toggle button
        this.fireButton = this.add.text(600, 550, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        })
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("Fire button clicked!");
                this.events.emit('toggleFire'); // Emit event to MapScene
            });

        // Weather Stats
        this.weatherText = this.add.text(10, 550, `Loading weather...`, {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',  // Olive green for a rustic feel
            padding: { x: 15, y: 10 }
        }).setScrollFactor(0);

        // Game Clock
        this.gameClockText = this.add.text(300, 10, "Time: 00:00", {
            fontSize: "20px",
            fill: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: { x: 10, y: 6 },
            align: "center",
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: "rgba(0, 0, 0, 0.7)",
                blur: 4,
                stroke: true,
                fill: true
            }
        })
        .setScrollFactor(0)
        .setDepth(10);
        
        // Zoom level display
        this.zoomText = this.add.text(300, 40, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);
        
        // Controls info
        this.controlsText = this.add.text(10, 120, "Controls:\nWASD/Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);

        // Tile Info
        this.tileInfoText = this.add.text(10, 200, 
            "Select tile\nCoordinates: n/a\nTerrain: n/a\nFlammability: n/a\nFuel: n/a\nBurn Status: n/a", {
                fill: "#ffffff",
                backgroundColor: "linear-gradient(180deg, rgba(20,20,20,0.9), rgba(0,0,0,0.7))",
                padding: { x: 14, y: 10 },
                align: "left",
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: "rgba(255, 255, 255, 0.3)",
                    blur: 6,
                    stroke: true,
                    fill: true
                }
            })
            .setDepth(10)
            .setScrollFactor(0)
            .setOrigin(0)
            .setStyle({ borderRadius: "8px" });
    }
    
    createZoomControls() {
        // Add zoom buttons on the left side
        const buttonSize = 40;
        const buttonX = 10;
        const zoomInY = 320;
        const zoomOutY = 370;
        
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
                .setScrollFactor(0);
                
            // Zoom out button
            this.zoomOutButton = this.add.image(buttonX, zoomOutY, 'zoom-out')
                .setOrigin(0)
                .setDisplaySize(buttonSize, buttonSize)
                .setScrollFactor(0);
        } else {
            // Fallback to rectangle buttons with text if images not available
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

    // Handler for tile information updates
    updateTileInfo(tile) {
        console.log(`Updating tile info: ${tile.terrain}, ${tile.flammability}, ${tile.fuel}, ${tile.burnStatus}`);
        
        if (this.tileInfoText) {
            this.tileInfoText.setText(
                `Select tile\nCoordinates: (${tile.x}, ${tile.y})\nTerrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`
            );
            this.tileInfoText.setVisible(true);
            this.tileInfoText.setDepth(100);
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