import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText, coins, bank, open_shop } from '../components/ui.js';
import { getHose, getExtinguisher, getHelicopter, getFiretruck, getAirtanker, getHotshotCrew, getSmokejumpers} from "../components/assetValues.js";

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
        this.LOGIN_BUTTON_X = 40;
        this.LOGIN_BUTTON_Y = 560;
        this.RESTART_BUTTON_X = 90;
        this.RESTART_BUTTON_Y = 50;
        this.GAME_CLOCK_X = 300;
        this.GAME_CLOCK_Y = 10;
        this.WEATHER_X = 540;
        this.WEATHER_Y = 40;
        this.WEATHER_PANEL_X = 360;
        this.WEATHER_PANEL_Y = 200;
        this.FIRE_BUTTON_X = 140;
        this.FIRE_BUTTON_Y = 50;
        this.TILE_INFO_X = 10;
        this.TILE_INFO_Y = 80;
        
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

        // Load zoom control assets
        this.load.image('zoom-in', 'assets/zoom-in.png');
        this.load.image('zoom-out', 'assets/zoom-out.png');

        this.load.image('Title', 'assets/UI/Title.png')
        this.load.image('Restart Button', 'assets/UI/restartButton.png')
        this.load.image('login', 'assets/UI/login.png')
        this.load.image('start_sim', 'assets/UI/start_sim.png');
        this.load.image('stop_sim', 'assets/UI/stop_sim.png');


        // Preload Weather UI elements
        this.load.image('weather_title_closed', 'assets/UI/weather_title_closed.png')
        this.load.image('weather_title_opened', 'assets/UI/weather_title_opened.png')
        this.load.image('humidity_full', 'assets/UI/humidity_full.png')
        this.load.image('humidity_half', 'assets/UI/humidity_half.png')
        this.load.image('humidity_low', 'assets/UI/humidity_low.png')
        this.load.image('wind_1arrow', 'assets/UI/wind_1arrow.png')
        this.load.image('wind_2arrow', 'assets/UI/wind_2arrow.png')
        this.load.image('wind_3arrow', 'assets/UI/wind_3arrow.png')
        this.load.image('north', 'assets/UI/north.png')
        this.load.image('east', 'assets/UI/east.png')
        this.load.image('south', 'assets/UI/south.png')
        this.load.image('west', 'assets/UI/west.png')
        this.load.image('weather_panel', 'assets/UI/weather_panel.png')
    }
      
    create() {
        console.log("UIScene Created");

        // Create container to hold ALL UI elements, enabling toggling of UI visibility
        this.uiContainer = this.add.container(0,0);

        // Create UI Elements
        this.createUIElements();
        
        // Create zoom controls
        this.createZoomControls();

        // Ensure HUD is created
        createHUD(this);

        this.uiContainer.add([ coins, bank, open_shop ]);

        this.input.keyboard.on('keydown-U', () => {
            this.toggleUI(!this.uiContainer.visible);
        });

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
        this.scene.get('MapScene').events.on('updateGlobalRisk', this.updateGlobalRisk, this);
        this.scene.get('MapScene').events.on('updateWindDirection', this.updateWindDirection, this);
    }

    // update function
    update() {
        // Update resource counts
        if (this.hoseText) {
            this.hoseText.setText(`${getHose()} left`);
            this.extinguisherText.setText(`${getExtinguisher()} left`);
            this.helicopterText.setText(`${getHelicopter()} left`);
            this.firetruckText.setText(`${getFiretruck()} left`);
            this.airtankerText.setText(`${getAirtanker()} left`);
            this.hotshotcrewText.setText(`${getHotshotCrew()} left`);
            this.smokejumperText.setText(`${getSmokejumpers()} left`);
        }
    }

    toggleUI(show=true) {
        this.uiContainer.setVisible(show);
    }

    _createTooltip(target, text, offsetY = -20) {
        const tt = this.add.text(0, 0, text, {
        font: '14px Arial',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 6, y: 4 },
        })
        .setOrigin(0.5, 1)
        .setDepth(1000)
        .setScrollFactor(0)
        .setVisible(false);
    
        target
        .on('pointerover', () => {
            tt.setPosition(target.x, target.y + offsetY).setVisible(true);
        })
        .on('pointerout', () => tt.setVisible(false));
    
        return tt;
    }
  
    createUIElements() {
    // near the top of your HUD
    this.riskBadge = this.add.text(550, 10, 'Risk: LOW', {
        fontSize: '18px',
        backgroundColor: '#000',
        padding: { x: 6, y: 4 },
    }).setScrollFactor(0);
  
        // Game title
        this.logo = this.add.image(40, 40, 'Title');
        this.uiContainer.add(this.logo);

        // Login Button via MainScene
        this.loginMenuButton = this.add.image(this.LOGIN_BUTTON_X, this.LOGIN_BUTTON_Y, 'login')
            .setInteractive()
            .on('pointerover', () => {  // Hover effect
                this.loginMenuButton.setTint(0x8B4513); // Apply tint on hover
            })
            .on('pointerout', () => {  // Reset when not hovering
                this.loginMenuButton.clearTint(); // Clear the tint
            })
            .on('pointerdown', () => {
                this.events.removeAllListeners();
                this.scene.remove('MainScene');
                this.scene.start('LoginScene');
            });
        this.uiContainer.add(this.loginMenuButton);

        // Restart Game button
        this.restartButton = this.add.image(this.RESTART_BUTTON_X, this.RESTART_BUTTON_Y, 'Restart Button')
            .setInteractive()
            .setScale(0.20)
            .on('pointerover', () => {  
                this.restartButton.setTint(0x8B4513); // Apply tint on hover
            })
            .on('pointerout', () => {  
                this.restartButton.clearTint(); // Clear the tint
            })
            .on('pointerdown', () => {
                console.log("Restart button clicked");
                
                // First ensure fire simulation is stopped
                const mapScene = this.scene.get('MapScene');
                if (mapScene) {
                    if (mapScene.isFireSimRunning) {
                        mapScene.isFireSimRunning = false;
                        this.events.emit('fireSimToggled', false);
                    }
                    
                    // Clear any existing delayed calls that might interfere
                    if (mapScene.time && mapScene.time.removeAllEvents) {
                        mapScene.time.removeAllEvents();
                    }
                }
                
                // Add a short delay before actually restarting
                this.time.delayedCall(100, () => {
                    console.log("Emitting restartGame event");
                    this.events.emit('restartGame'); // Emit event to MapScene
                });
            });
        this._createTooltip(this.restartButton, 'Restart Game');
        this.uiContainer.add(this.restartButton);


        // Fire toggle button
        this.fireButton = this.add.image(this.FIRE_BUTTON_X, this.FIRE_BUTTON_Y, 'start_sim')
            .setInteractive()
            .setScale(0.20)
            .on('pointerdown', () => {
                console.log("Fire image button clicked!");
                this.events.emit('toggleFire');
            });
        this._createTooltip(this.fireButton, 'Start or Stop Fire Simulation')
        this.uiContainer.add(this.fireButton);

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
        this.uiContainer.add(this.gameClockText);

        // Fire progress bar foreground (starts at 0 width)
        this.fireStepBar = this.add.rectangle(
            this.GAME_CLOCK_X,
            this.GAME_CLOCK_Y + 28,
            0,
            8,
            0xff4500
        ).setOrigin(0, 0).setScrollFactor(0);
        this.uiContainer.add(this.fireStepBar);
        
        // Zoom level display
        this.zoomText = this.add.text(this.GAME_CLOCK_X, this.GAME_CLOCK_Y + 30, "Zoom: 100%", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);
        this.uiContainer.add(this.zoomText);

        this.controlsButton = this.add.text(80, 550, 'Controls', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 5, y: 5 },
        })
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setInteractive();
        this.uiContainer.add(this.controlsButton);

        this.controlsPanel = this.add.container(80, 466)
            .setScrollFactor(0)
            .setVisible(false);
      
        // optional background for readability
        this.controlpanelBg = this.add
            .rectangle(0, 0, 200, 80, 0x000000, 0.7)
            .setOrigin(0);
        this.controlpanelText = this.add.text(10, 10,
            'WASD / Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan',
            { fontSize: '14px', fill: '#fff', wordWrap: { width: 180 } }
        );
        this.controlsPanel.add([ this.controlpanelBg, this.controlpanelText ]);
        this.uiContainer.add(this.controlsPanel);

        // Hook up show/hide on click
        this.controlsButton.on('pointerdown', () => {
            this.controlsPanel.setVisible(!this.controlsPanel.visible);
        });

        // Tile Info
        this.tileInfoText = this.add.text(this.TILE_INFO_X, this.TILE_INFO_Y, 
            "Select tile", {
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
        this.uiContainer.add(this.tileInfoText);

        // Global Risk Badge
        this.riskBadge = this.add.text(550, 10, 'Risk: LOW', {
            fontSize: '18px',
            backgroundColor: '#000',
            padding: { x: 6, y: 4 },
        }).setScrollFactor(0);
        this.uiContainer.add(this.riskBadge);

        // Wind Direction Indicator
        this.windDirectionText = this.add.text(550, 100, 'Wind: --', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0);
        this.uiContainer.add(this.windDirectionText);

        // Wind Arrow (initially hidden)
        this.windArrow = this.add.graphics();
        this.windArrow.setScrollFactor(0);
        this.uiContainer.add(this.windArrow);
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
            this.uiContainer.add(this.zoomInButton);    
                
            const zoom_in_text = this.add.text(BUTTON_X + BUTTON_SIZE/2, ZOOM_IN_Y + BUTTON_SIZE/2, "+", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0);
            this.uiContainer.add(zoom_in_text); 
            
            // Zoom out button
            this.zoomOutButton = this.add.rectangle(BUTTON_X, ZOOM_OUT_Y, BUTTON_SIZE, BUTTON_SIZE, 0x666666)
                .setOrigin(0)
                .setStrokeStyle(2, 0xffffff)
                .setScrollFactor(0);
            this.uiContainer.add(this.zoomOutButton);
                
            const zoom_out_text = this.add.text(BUTTON_X + BUTTON_SIZE/2, ZOOM_OUT_Y + BUTTON_SIZE/2, "-", {
                fontSize: "24px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0);
            this.uiContainer.add(zoom_out_text);
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

    // Handler to update fire spread progress indicator
    updateFireProgress(percent) {
        if (!this.fireStepBar) return;
    
        const maxWidth = 150;
        const width = Phaser.Math.Clamp((percent / 100) * maxWidth, 0, maxWidth);
        this.fireStepBar.width = width;
    
        // Optional color logic if you want it
        let color = 0x00ff00;
        if (percent > 66) color = 0xff0000;
        else if (percent > 33) color = 0xffff00;
        this.fireStepBar.fillColor = color;
    }
       
    // Handler for game clock updates
    updateGameClock(elapsedTime) {
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = Math.floor(elapsedTime % 60);
        
        // Format time as MM:SS
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.gameClockText.setText(`Time: ${formattedTime}`);
    }

    // Handler for weather display updates
    updateWeatherDisplay(weather) {
        const centerWeather = weather.getLocalWeather(this.scene.get('MapScene').MAP_WIDTH/2, this.scene.get('MapScene').MAP_HEIGHT/2);
        this.weatherText.setText(
            `Temperature: ${Math.round(centerWeather.temperature)}°F\n` +
            `Wind Speed: ${Math.round(centerWeather.windSpeed)} mph\n` +
            `Wind Direction: ${Math.round(centerWeather.windDirection)}°`
        );
        
        // Update risk badge
        const risk = weather.getGlobalRisk();
        const pct = Math.round(risk * 100);
        
        let label, color;
        if (pct > 66) { label = 'HIGH'; color = '#f00'; }
        else if (pct > 33) { label = 'MED'; color = '#ff0'; }
        else { label = 'LOW'; color = '#0f0'; }
        
        this.riskBadge
            .setText(`Risk: ${label}`)
            .setStyle({ color });
    }
      
    // Handler for tile information updates
    updateTileInfo(tile) {
        console.log(`Updating tile info: ${tile.terrain}, ${tile.flammability}, ${tile.fuel}, ${tile.burnStatus}`);
        
        if (this.tileInfoText) {
            this.tileInfoText.setText(
                `Terrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`
            );
            this.tileInfoText.setVisible(true);
            this.tileInfoText.setDepth(100);

            // Remove any hide timer if one exists (so info stays visible while selected)
            if (this.tileInfoHideTimer) {
                this.tileInfoHideTimer.remove();
                this.tileInfoHideTimer = null;
            }
        } else {
            console.warn("tileInfoText is not defined in UIScene!");
        }
    }

    // Handler for fire simulation toggle updates
    updateFireButton(isRunning) {
        if (this.fireButton) {
            this.fireButton.setTexture(isRunning ? 'stop_sim' : 'start_sim');
        }
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

    updateGlobalRisk(risk) {
        let label, color;
        if (risk > 0.66) { label = 'HIGH'; color = '#f00'; }
        else if (risk > 0.33) { label = 'MED'; color = '#ff0'; }
        else { label = 'LOW'; color = '#0f0'; }
      
        this.riskBadge
            .setText(`Risk: ${label}`)
            .setStyle({ color });
    }

    updateWindDirection(windDirection, windSpeed) {
        if (!this.windDirectionText || !this.windArrow) return;

        // Update wind direction text with formatted values
        this.windDirectionText.setText(`Wind: ${windDirection} ${Math.round(windSpeed)}mph`);

        // Clear previous arrow
        this.windArrow.clear();

        // Draw new arrow
        const arrowX = 550;
        const arrowY = 130;
        const arrowLength = 30;
        const arrowWidth = 3;

        // Set arrow color based on wind speed
        const color = windSpeed > 15 ? 0xff0000 : (windSpeed > 8 ? 0xffff00 : 0x00ff00);

        // Draw arrow based on wind direction
        this.windArrow.lineStyle(arrowWidth, color);
        
        switch(windDirection) {
            case 'N':
                this.windArrow.lineBetween(arrowX, arrowY + arrowLength, arrowX, arrowY);
                this.windArrow.lineBetween(arrowX - 5, arrowY + 5, arrowX, arrowY);
                this.windArrow.lineBetween(arrowX + 5, arrowY + 5, arrowX, arrowY);
                break;
            case 'S':
                this.windArrow.lineBetween(arrowX, arrowY, arrowX, arrowY + arrowLength);
                this.windArrow.lineBetween(arrowX - 5, arrowY + arrowLength - 5, arrowX, arrowY + arrowLength);
                this.windArrow.lineBetween(arrowX + 5, arrowY + arrowLength - 5, arrowX, arrowY + arrowLength);
                break;
            case 'E':
                this.windArrow.lineBetween(arrowX, arrowY, arrowX + arrowLength, arrowY);
                this.windArrow.lineBetween(arrowX + arrowLength - 5, arrowY - 5, arrowX + arrowLength, arrowY);
                this.windArrow.lineBetween(arrowX + arrowLength - 5, arrowY + 5, arrowX + arrowLength, arrowY);
                break;
            case 'W':
                this.windArrow.lineBetween(arrowX + arrowLength, arrowY, arrowX, arrowY);
                this.windArrow.lineBetween(arrowX + 5, arrowY - 5, arrowX, arrowY);
                this.windArrow.lineBetween(arrowX + 5, arrowY + 5, arrowX, arrowY);
                break;
        }
    }
}