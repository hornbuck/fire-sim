import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';
import Weather from '../components/Weather.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        
        // UI Layout constants
        this.SCREEN_WIDTH = 800;
        this.SCREEN_HEIGHT = 600;
        this.UI_SIDEBAR_WIDTH = 100;
        this.GAME_AREA_WIDTH = this.SCREEN_WIDTH - this.UI_SIDEBAR_WIDTH;
        
        // UI Element positions
        this.TITLE_X = 40;
        this.TITLE_Y = 40;
        this.LOGIN_BUTTON_X = 600;
        this.LOGIN_BUTTON_Y = 10;
        this.RESTART_BUTTON_X = 140;
        this.RESTART_BUTTON_Y = 50;
        this.GAME_CLOCK_X = 300;
        this.GAME_CLOCK_Y = 10;
        this.WEATHER_X = 10;
        this.WEATHER_Y = 550;
        this.FIRE_BUTTON_X = 600;
        this.FIRE_BUTTON_Y = 550;
        this.TILE_INFO_X = 10;
        this.TILE_INFO_Y = 200;
        
        // Style constants
        this.BUTTON_COLORS = {
            DEFAULT: '#A0522D',
            HOVER: '#8B4513',
            FIRE_BUTTON: '#8B0000'
        };
        
        // Tooltip timing
        this.TILE_INFO_DISPLAY_TIME = 3000; // milliseconds
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
        this.add.image(this.TITLE_X, this.TITLE_Y, 'Title').setScrollFactor(0);

        // Login Button via MainScene
        const loginMenuButton = this.add.text(this.LOGIN_BUTTON_X, this.LOGIN_BUTTON_Y, 'Login', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: this.BUTTON_COLORS.DEFAULT,
            padding: { x: 15, y: 10 }
        })
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerover', () => {
                loginMenuButton.setStyle({ backgroundColor: this.BUTTON_COLORS.HOVER });
            })
            .on('pointerout', () => {
                loginMenuButton.setStyle({ backgroundColor: this.BUTTON_COLORS.DEFAULT });
            })
            .on('pointerdown', () => {
                this.events.removeAllListeners();
                this.scene.remove('MainScene');
                this.scene.start('LoginScene');
            });

        // Restart Game button
        const restartButton = this.add.image(this.RESTART_BUTTON_X, this.RESTART_BUTTON_Y, 'Restart Button')
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
                this.events.emit('restartGame');
            });

        // Fire toggle button
        this.fireButton = this.add.text(this.FIRE_BUTTON_X, this.FIRE_BUTTON_Y, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: this.BUTTON_COLORS.FIRE_BUTTON,
            padding: { x: 15, y: 10 }
        })
            .setScrollFactor(0)
            .setInteractive()
            .on('pointerdown', () => {
                console.log("Fire button clicked!");
                this.events.emit('toggleFire');
            });

        // Weather Stats
        this.weatherText = this.add.text(this.WEATHER_X, this.WEATHER_Y, `Loading weather...`, {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',
            padding: { x: 15, y: 10 }
        }).setScrollFactor(0);

        // Game Clock
        this.gameClockText = this.add.text(this.GAME_CLOCK_X, this.GAME_CLOCK_Y, "Time: 00:00", {
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
        
        // Zoom level display - new addition for pan/zoom feature
        this.zoomText = this.add.text(this.GAME_CLOCK_X, this.GAME_CLOCK_Y + 30, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);
        
        // Controls info - new addition for pan/zoom feature
        this.controlsText = this.add.text(10, 120, "Controls:\nWASD/Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);

        // Tile Info
        this.tileInfoText = this.add.text(this.TILE_INFO_X, this.TILE_INFO_Y, 
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
        const BUTTON_SIZE = 40;
        const BUTTON_X = 10;
        const ZOOM_IN_Y = 320;
        const ZOOM_OUT_Y = 370;
        
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
            this.zoomInButton = this.add.image(BUTTON_X, ZOOM_IN_Y, 'zoom-in')
                .setOrigin(0)
                .setDisplaySize(BUTTON_SIZE, BUTTON_SIZE)
                .setScrollFactor(0);
                
            // Zoom out button
            this.zoomOutButton = this.add.image(BUTTON_X, ZOOM_OUT_Y, 'zoom-out')
                .setOrigin(0)
                .setDisplaySize(BUTTON_SIZE, BUTTON_SIZE)
                .setScrollFactor(0);
        } else {
            // Fallback to rectangle buttons with text if images not available
            // Zoom in button
            this.zoomInButton = this.add.rectangle(BUTTON_X, ZOOM_IN_Y, BUTTON_SIZE, BUTTON_SIZE, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);
                
            this.add.text(BUTTON_X + BUTTON_SIZE/2, ZOOM_IN_Y + BUTTON_SIZE/2, "+", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0);
            
            // Zoom out button
            this.zoomOutButton = this.add.rectangle(BUTTON_X, ZOOM_OUT_Y, BUTTON_SIZE, BUTTON_SIZE, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);
                
            this.add.text(BUTTON_X + BUTTON_SIZE/2, ZOOM_OUT_Y + BUTTON_SIZE/2, "-", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0);
        }
        
        // Make buttons interactive
        this.zoomInButton.setInteractive().on('pointerdown', () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom + 0.1, 
                mapScene.MIN_ZOOM, 
                mapScene.MAX_ZOOM
            );
            mapScene.cameras.main.setZoom(mapScene.currentZoom);
            this.handleZoomChange(mapScene.currentZoom);
        });
        
        this.zoomOutButton.setInteractive().on('pointerdown', () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom - 0.1, 
                mapScene.MIN_ZOOM, 
                mapScene.MAX_ZOOM
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
            this.tileInfoText.setVisible(true);
            this.tileInfoText.setDepth(100);
            
            // If using temporary display, set up a timer to hide
            if (this.tileInfoHideTimer) {
                this.tileInfoHideTimer.remove();
            }
            
            this.tileInfoHideTimer = this.time.delayedCall(this.TILE_INFO_DISPLAY_TIME, () => {
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