import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText, coins, bank, open_shop } from '../components/ui.js';
import { getHose, getExtinguisher, getHelicopter, getFiretruck, getAirtanker, getHotshotCrew, getSmokejumpers} from "../components/assetValues.js";
import { createDrawnButton } from '../components/ButtonManager.js';
import HamburgerMenu from '../components/HamburgerMenu.js';
import AccessibilityPanel from '../components/AccessibilityPanel.js';
import WebFontFile from '../utils/WebFontFile.js';
import {auth} from '../firebaseConfig.js'

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
        this.ZOOM_PERCENT_TEXT_X = 176;
        this.ZOOM_PERCENT_TEXT_Y = 550;

        // Wind intensity indicator
        this.WIND_GAUGE_X = 540;
        this.WIND_GAUGE_Y = 60;
        this.WIND_GAUGE_WIDTH = 100;   // full width represents 50 mph
        this.WIND_GAUGE_HEIGHT = 12;
        
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

        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'));

        // Preload UI Elements

        // Preload Weather UI elements
        this.load.image('weather_title_closed', 'assets/UI/weather_title_closed.png')
        this.load.image('weather_title_opened', 'assets/UI/weather_title_opened.png')
        this.load.image('humidity_full', 'assets/UI/humidity_full.png')
        this.load.image('humidity_half', 'assets/UI/humidity_half.png')
        this.load.image('humidity_low', 'assets/UI/humidity_low.png')
        this.load.image('wind_1arrow', 'assets/UI/wind_1arrow.png')
        this.load.image('wind_2arrow', 'assets/UI/wind_2arrow.png')
        this.load.image('wind_3arrow', 'assets/UI/wind_3arrow.png')
        this.load.image('wind-arrow', 'assets/UI/north.png')
        this.load.image('north', 'assets/UI/north.png')
        this.load.image('east', 'assets/UI/east.png')
        this.load.image('south', 'assets/UI/south.png')
        this.load.image('west', 'assets/UI/west.png')
        this.load.image('weather_panel', 'assets/UI/weather_panel.png')
    }

    create() {
        console.log("UIScene Created");  

        // Create container to hold ALL UI elements
        this.uiContainer = this.add.container(0, 0);

        this.topBarContainer = this.add.container(0, 0);

        this.bottomBarContainer = this.add.container(0, this.scale.height - 60);
    
        // Create UI elements
        this.createUIElements(); // (this still sets up logo, buttons, etc.)
    
        // Top bar background
        const topBarHeight = 60;
        const topBar = this.add.rectangle(
            this.SCREEN_WIDTH / 2,
            topBarHeight / 2,
            this.SCREEN_WIDTH,
            topBarHeight,
            0x2d3436 // Dark gray
        );
        topBar.setScrollFactor(0);
        topBar.setDepth(5);
        this.uiContainer.add(topBar);
    
        // Top bar container
        this.topBarContainer.setDepth(10);
        this.uiContainer.add(this.topBarContainer);
    
        // Add and position UI elements in the top bar container
    
        this.hamburgerMenu = new HamburgerMenu(this, {
            x: 40,
            y: 30,
            depth: 1000,
            openDirection: 'left'
        });

        this.accessibilityPanel = new AccessibilityPanel(this, {
            depth: 1001,
            onSettingsApplied: (settings) => {
                console.log('Accessibility settings applied:', settings);
            }
        });
    
        // Create Restart Button
        const restart = createDrawnButton(this, {
            x: 120,
            y: 30,
            width: 80,
            height: 30,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: 'Restart',
            fontSize: '10px',
            onClick: () => {
                console.log("Restart clicked");
                this.events.emit('restartGame');
            }
        });
        this.topBarContainer.add([restart.button, restart.buttonText]);

        // Create fire sart/stop button
        const fireButton = createDrawnButton(this, {
            x: 200,
            y: 30,
            width: 80,
            height: 30,
            backgroundColor: 0x228B22,
            hoverColor: 0x2E8B57,
            text: 'Start',
            fontSize: '10px',
            onClick: () => {
            console.log("Start Fire clicked");
            this.events.emit('toggleFire');
            }
        });
        this.topBarContainer.add([fireButton.button, fireButton.buttonText]);

    
        // Timer Text
        this.gameClockText.setPosition(300, 15, 'Time: 00:00');
        this.gameClockText.setStyle({
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fontStyle: 'normal',
            color: '#FFFFFF',
            align: 'center',
            padding: { x: 5, y: 2 },
        });
        
        this.topBarContainer.add(this.gameClockText);
    
        // Wind Gauge and Risk Text
        this.windGaugeBg.setPosition(600, 30);
        this.windGaugeFill.setPosition(600, 30);
        this.windArrow.setPosition(700, 30);
        this.riskText.setPosition(500, 15);
    
        this.topBarContainer.add([
            this.windGaugeBg,
            this.windGaugeFill,
            this.windArrow,
            this.riskText
        ]);
    
        // Bottom bar background
        const bottomBarBg = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height - 30,
            this.scale.width,
            60,
            0x2d3436
        ).setScrollFactor(0);
        this.bottomBarContainer.add(bottomBarBg);

        this.createZoomControls();

        // Controls panel
        const controlsButtonX = this.zoomText.x + this.zoomText.width + 80; // 40px padding after zoom text

        this.controlsButton = createDrawnButton(this, {
            x: controlsButtonX,
            y: 20, // Same Y as zoom buttons
            width: 140,
            height: 40,
            backgroundColor: 0x555555,
            hoverColor: 0x777777,
            text: 'Controls',
            fontSize: '14px',
            onClick: () => console.log('Show controls')
        });
        this.bottomBarContainer.add([this.controlsButton.button, this.controlsButton.buttonText]);

        this.controlsButton.button.setInteractive().on('pointerdown', () => {
            this.controlsPanel.setVisible(!this.controlsPanel.visible);
        });

        // HUD elements
        createHUD(this); // Assumes you have createHUD() ready
        // Create background for currency display
        const coinBg = this.add.rectangle(
            this.controlsButton.button.x + this.controlsButton.button.width + 40,
            20, // Y position in bottom bar
            70, // Width for currency display
            40,  // Height for currency display
            0x333333,
            0.8
        ).setOrigin(0.5).setScrollFactor(0).setDepth(5);

        

        // Add UI elements to bottom bar (higher depth)
        this.bottomBarContainer.add([coins, bank, open_shop]);

        // Position currency elements
        coins.setPosition(this.controlsButton.button.x + this.controlsButton.button.width + 30, 20);
        bank.setPosition(coins.x + 20, 20);  // Position close to $ symbol

        // Position shop button with proper spacing
        open_shop.setPosition(coinBg.x + coinBg.width/2 + 40, 20); // 40px spacing after coin background

        // Ensure proper depth for visibility
        coins.setDepth(coinBg.depth + 1);
        bank.setDepth(coinBg.depth + 1);
        open_shop.setDepth(open_shop.depth + 1);

        // Main UI Container
        this.uiContainer.add([this.topBarContainer, this.bottomBarContainer]);

        // Key to toggle HUD
        this.input.keyboard.on('keydown-U', () => {
            this.toggleUI(!this.uiContainer.visible);
        });
    
        // Resource text elements
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
        // Gauge background (gray outline)
        this.windGaugeBg = this.add.rectangle(
            this.WIND_GAUGE_X,
            this.WIND_GAUGE_Y,
            this.WIND_GAUGE_WIDTH,
            this.WIND_GAUGE_HEIGHT,
            0x333333
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);
        this.uiContainer.add(this.windGaugeBg);
        
        // Fill bar (starts at 0 width)
        this.windGaugeFill = this.add.rectangle(
            this.WIND_GAUGE_X,
            this.WIND_GAUGE_Y,
            0,
            this.WIND_GAUGE_HEIGHT,
            0x00aaff
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);
        this.uiContainer.add(this.windGaugeFill);
        
        // Arrow for direction
        this.windArrow = this.add.image(
            this.WIND_GAUGE_X + this.WIND_GAUGE_WIDTH + 16,
            this.WIND_GAUGE_Y + this.WIND_GAUGE_HEIGHT / 2,
            'wind-arrow'
        )
        .setDisplaySize(16, 16)
        .setOrigin(0.5)
        .setScrollFactor(0);
        this.uiContainer.add(this.windArrow);
        this._createTooltip(this.windGaugeBg, 'Wind Speed & Direction');

        // Risk text
        this.riskText = this.add.text(this.WIND_GAUGE_X, this.WIND_GAUGE_Y + this.WIND_GAUGE_HEIGHT - 40, 
            'Risk: Low', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fontStyle: 'normal',
            fill: '#00ff00', // start green
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 4, y: 2 }
        })
        .setScrollFactor(0);
        this.uiContainer.add(this.riskText);

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

        this.controlsPanel = this.add.container(315, 455)
            .setScrollFactor(0)
            .setVisible(false);

        // optional background for readability
        this.controlpanelBg = this.add
            .rectangle(0, 0, 200, 80, 0x000000, 0.7)
            .setOrigin(0);
            this.controlpanelText = this.add.text(10, 10,
                'WASD / Arrows: Pan\nMouse Wheel: Zoom\nRight/Middle Mouse: Pan\nU: Toggle UI',
                { 
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fill: '#fff',
                    wordWrap: { width: 180 }
                }
            );
        this.controlsPanel.add([ this.controlpanelBg, this.controlpanelText ]);
        this.uiContainer.add(this.controlsPanel);

        // Tile Info
        this.tileInfoText = this.add.text(this.TILE_INFO_X, this.TILE_INFO_Y, 
            "Select tile", {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                fontStyle: 'normal',
                fill: "#ffffff",
                backgroundColor: "#2d3436",
                padding: { x: 14, y: 10 },
                align: "left",
            })
            .setDepth(10)
            .setScrollFactor(0)

        this.uiContainer.add(this.tileInfoText);
    }
    
    createZoomControls() {
        const BUTTON_SIZE = 40;
        const BUTTON_SPACING = 20;
        const baseX = 40; // Start at 40px from left inside bottom bar
        const baseY = 20; 

        // Zoom In Button
        const zoomIn = createDrawnButton(this, {
            x: baseX,
            y: baseY,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            backgroundColor: 0x666666,
            hoverColor: 0x888888,
            text: '+',
            fontSize: '20px',
            onClick: () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom + 0.1,
                mapScene.MIN_ZOOM,
                mapScene.MAX_ZOOM
            );
            mapScene.cameras.main.setZoom(mapScene.currentZoom);
            this.handleZoomChange(mapScene.currentZoom);
            }
        });

        // Zoom Out Button
        const zoomOut = createDrawnButton(this, {
            x: baseX + BUTTON_SIZE + BUTTON_SPACING,
            y: baseY,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            backgroundColor: 0x666666,
            hoverColor: 0x888888,
            text: '-',
            fontSize: '20px',
            onClick: () => {
            const mapScene = this.scene.get('MapScene');
            mapScene.currentZoom = Phaser.Math.Clamp(
                mapScene.currentZoom - 0.1,
                mapScene.MIN_ZOOM,
                mapScene.MAX_ZOOM
            );
            mapScene.cameras.main.setZoom(mapScene.currentZoom);
            this.handleZoomChange(mapScene.currentZoom);
            }
        });
        // UIScene.js → inside createUIElements(), after zoom controls :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
        const PAD_X = 50, PAD_Y = this.SCREEN_HEIGHT - 100;
        const SIZE = 32;

        const arrows = {
        up:    this.add.image(PAD_X + SIZE, PAD_Y - SIZE,  'north'),
        down:  this.add.image(PAD_X + SIZE, PAD_Y + SIZE,  'south'),
        left:  this.add.image(PAD_X,        PAD_Y,        'west'),
        right: this.add.image(PAD_X + SIZE*2, PAD_Y,      'east')
        };
        for (let dir in arrows) {
        arrows[dir]
            .setDisplaySize(SIZE, SIZE)
            .setScrollFactor(0)
            .setInteractive()
            // when pressed, tell MapScene to start panning that direction:
            .on('pointerdown', () => this.events.emit('panStart', { x: dir==='left'? -1 : dir==='right'? 1 : 0,
                                                                    y: dir==='up'? -1 : dir==='down'? 1 : 0 }))
            // when released (or pointerout), stop panning:
            .on('pointerup',   () => this.events.emit('panStop'))
            .on('pointerout',  () => this.events.emit('panStop'));
        }


        this.zoomText = this.add.text(
            baseX + (BUTTON_SIZE + BUTTON_SPACING) * 1.75,
            20, // same Y as zoom buttons
            'Zoom: 100%',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fontStyle: 'normal',
                color: '#FFFFFF'
            })
            .setOrigin(0, 0.5)
            .setScrollFactor(0);

        // Store the button references if you need later
        this.zoomInButton = zoomIn.button;
        this.zoomOutButton = zoomOut.button;
        this.bottomBarContainer.add(this.zoomText);


        // Add drawn buttons to bottomBarContainer
        this.bottomBarContainer.add([zoomIn.button, zoomIn.buttonText, zoomOut.button, zoomOut.buttonText]);
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

    updateWindDisplay(weather) {
        // 1) Fill proportionally: max 50 mph = full width
        const pct = Phaser.Math.Clamp(weather.windSpeed / 50, 0, 1);
        this.windGaugeFill.width = this.WIND_GAUGE_WIDTH * pct;
        
        // 2) Rotate arrow: map N/E/S/W to angles
        const dirToAngle = { N: -90, E: 0, S: 90, W: 180 };
        this.windArrow.setRotation(Phaser.Math.DegToRad(dirToAngle[weather.windDirection] || 0));
        
        // 3) Tint fill based on intensity
        if (pct < 0.33) this.windGaugeFill.fillColor = 0x00ff00;
        else if (pct < 0.66) this.windGaugeFill.fillColor = 0xffff00;
        else this.windGaugeFill.fillColor = 0xff0000;
    }

    updateWeatherDisplay(weather) {
        this.updateWindDisplay(weather);
        this.updateRiskDisplay(weather.getRiskCategory());
    }

    // Handler for fire simulation toggle updates
    updateFireButton(isRunning) {
        if (this.fireButton) {
            this.fireButton.setTexture(isRunning ? 'stop_sim' : 'start_sim');
        }
    }

    updateRiskDisplay(risk) {
        const colorMap = { low:   '#00ff00',
                        medium:'#ffff00',
                        high:  '#ff0000' };
        this.riskText
        .setText(`Risk: ${risk.charAt(0).toUpperCase()+risk.slice(1)}`)
        .setStyle({ fill: colorMap[risk] });
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