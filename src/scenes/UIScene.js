import { sidebar, createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText, coins, bank, open_shop,
    hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper, hoseTextBg, extinguisherTextBg, helicopterTextBg, firetruckTextBg, airtankerTextBg,
    hotshotcrewTextBg, smokejumperTextBg, timerSprite
 } from '../components/ui.js';
import { getHose, getExtinguisher, getHelicopter, getFiretruck, getAirtanker, getHotshotCrew, getSmokejumpers} from "../components/assetValues.js";
import { createDrawnButton } from '../components/ButtonManager.js';
import HamburgerMenu from '../components/HamburgerMenu.js';
import AccessibilityPanel from '../components/AccessibilityPanel.js';
import WebFontFile from '../utils/WebFontFile.js';
import fieldManualContent from '../utils/FieldManual.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        
        // UI Layout constants
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT =  window.innerHeight;
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
        this.TILE_INFO_X = 100;
        this.TILE_INFO_Y = 80;
        this.ZOOM_PERCENT_TEXT_X = 176;
        this.ZOOM_PERCENT_TEXT_Y = 550;

        // Wind intensity indicator
        this.WIND_GAUGE_X = 90;
        this.WIND_GAUGE_Y = 30;
        this.WIND_GAUGE_WIDTH = 140;   // full width represents 50 mph
        this.WIND_GAUGE_HEIGHT = 16;
        
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
        this.load.image('wind-arrow', 'assets/UI/up.png')
        this.load.image('up', 'assets/UI/up.png')
        this.load.image('right', 'assets/UI/right.png')
        this.load.image('down', 'assets/UI/down.png')
        this.load.image('left', 'assets/UI/left.png')
        this.load.image('weather_panel', 'assets/UI/weather_panel.png')
        this.load.image('Title', 'assets/UI/Title.png')
        this.load.image('toggle_ui_off', 'assets/UI/toggle_ui_off.png')
        this.load.image('toggle_ui_on', 'assets/UI/toggle_ui_on.png')
    }

    generateFuelText(current, max) {
        return `${current.toFixed(1)}/${max.toFixed(1)}`;
    }

    create() {
        console.log("UIScene Created");  

        // Create container to hold ALL UI elements
        this.uiContainer = this.add.container(0, 0);
        this.topBarContainer = this.add.container(0, 0);
        this.bottomBarContainer = this.add.container(0, this.scale.height - 60);
        this.uiToggleButtonContainer = this.add.container(0, 0).setScrollFactor(0);
        
        

        // Create UI elements
        this.createUIElements(); // (this still sets up logo, buttons, etc.)

        // Pop-up notifies user that game is paused
        this.pauseText = this.add.text(
            this.scale.width / 2,
            this.cameras.main.height / 2,
            "Game Paused",
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '24px',
                color: '#FFFFFF',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: { x: 20, y: 10 },
                align: 'center'
            }
        ).setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1000)
        .setVisible(false);
        this.uiContainer.add(this.pauseText);

    
        // Top bar background
        const topBarHeight = 60;
        let topBar = this.add.rectangle(
            this.scale.width / 2,
            topBarHeight / 2,
            this.cameras.main.width,
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
        this.fireButton = createDrawnButton(this, {
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
        this.topBarContainer.add([this.fireButton.button, this.fireButton.buttonText]);

    
        // Timer Text
        this.gameClockText.setPosition(400, 15, 'Time: 00:00');
        this.gameClockText.setOrigin(0.5, 0);
        this.gameClockText.setStyle({
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fontStyle: 'normal',
            color: '#FFFFFF',
            align: 'center',
            padding: { x: 5, y: 2 },
        });
        
        this.topBarContainer.add(this.gameClockText);
    
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
        this.createNavigationCompass();

        // HUD elements
        createHUD(this); 

        // Add UI elements to bottom bar (higher depth)
        this.bottomBarContainer.add([coins, bank, open_shop]);

        // Position currency elements
        // Update the positions of coins, bank, and open_shop
        coins.setPosition(this.scale.width - 450, 0).setDepth(10);
        bank.setPosition(this.scale.width - 435, 0).setDepth(10);
        open_shop.setPosition(this.scale.width - 360, 0).setDepth(10);

        // Ensure proper depth for visibility
        coins.setDepth(1);
        bank.setDepth(1);
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
        // this.scene.get('MapScene').events.on('weatherUpdated', this.updateWeatherDisplay, this);
        this.scene.get('MapScene').events.on('tileInfo', this.updateTileInfo, this);
        this.scene.get('MapScene').events.on('fireSimToggled', this.updateFireButton, this);
        this.scene.get('MapScene').events.on('zoomChanged', this.handleZoomChange, this);
        this.scene.get('MapScene').events.on('mapSizeChanged', this.updateMapInfo, this);
        this.scene.get('MapScene').events.on('scoreUpdated', this.updateScore, this);
        this.scene.get('MapScene').events.on('gameWon', () => {
            this.winText.setVisible(true);
        });
    }   

    // update function
    update() {

        // Dynamically Move UI Elements when Screen Size Changes
        sidebar.x = this.scale.width - 110 / 2;
        hose.x = this.scale.width - 50;
        hoseText.x = this.scale.width - 50;
        hoseTextBg.x = this.scale.width - 50;
        extinguisher.x = this.scale.width - 50;
        extinguisherText.x = this.scale.width - 50;
        extinguisherTextBg.x = this.scale.width - 50;
        helicopter.x = this.scale.width - 50;
        helicopterText.x = this.scale.width - 50;
        helicopterTextBg.x = this.scale.width - 50;
        firetruck.x = this.scale.width - 50;
        firetruckText.x = this.scale.width - 50;
        firetruckTextBg.x = this.scale.width - 50;
        airtanker.x = this.scale.width - 50;
        airtankerText.x = this.scale.width - 50;
        airtankerTextBg.x = this.scale.width - 50;
        hotshotcrew.x = this.scale.width - 50;
        hotshotcrewText.x = this.scale.width - 50;
        hotshotcrewTextBg.x = this.scale.width - 50;
        smokejumper.x = this.scale.width - 50;
        smokejumperText.x = this.scale.width - 50;
        smokejumperTextBg.x = this.scale.width - 50;

        this.pauseText.x = this.scale.width / 2;
        //this.uiContainer.scaleX = this.scale.width; --> BUG: makes assets disappear

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
        // Update weather panel
        this.updateInfoPanel();
    }

    toggleUI(show = true) {
        this.uiContainer.setVisible(show);
        this.uiToggleButtonContainer.setVisible(true);  // Always keep toggle button visible
    
        // Update toggle icon texture
        const newTexture = show ? 'toggle_ui_on' : 'toggle_ui_off';
        if (this.uiToggleButton) {
            this.uiToggleButton.setTexture(newTexture);
        }
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
        // Risk text
        this.riskText = this.add.text(-500, -500, 
            'Risk: Low', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fontStyle: 'normal',
            fill: '#00ff00', // start green
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 4, y: 2 }
        })
        .setScrollFactor(0);

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

        // Add this after creating gameClockText
        const progressBarBg = this.add.rectangle(
            400, 
            40,
            150,
            8,
            0x333333
        ).setOrigin(0.5, 0).setScrollFactor(0);

        this.fireStepBar = this.add.rectangle(
            325,
            45,
            0,
            8,
            0xff4500
        ).setOrigin(0, 0).setScrollFactor(0);

        this.topBarContainer.add([progressBarBg, this.fireStepBar]);
        
        
        // Tile Info
        this.tileInfoText = this.add.text(-500, -500, 
            "Select tile", {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                fontStyle: 'bold',
                fill: "#ffff00", // Bright yellow for visibility
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                padding: { x: 16, y: 12 },
                align: "left",
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000000",
                    blur: 4,
                    stroke: true,
                    fill: true
                }
            })

            .setDepth(-1)
            .setScrollFactor(0)

        // --- Score Text ---
        this.scoreText = this.add.text(550, 15, "Score: 0", {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0);
        this.topBarContainer.add(this.scoreText);

        // --- Win Text (Initially Hidden) ---
        this.winText = this.add.text(this.scale.width / 2, this.scale.height / 2, "YOU WIN!", {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#00FF00',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 20, y: 10 },
            align: "center"
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1000)
        .setVisible(false);
        this.uiContainer.add(this.winText);

        // --- Direction-choice prompt (hidden by default) ---
        this.directionPromptContainer = this.add.container(
            this.SCREEN_WIDTH/2, this.SCREEN_HEIGHT/2
        )
        .setScrollFactor(0)
        .setDepth(1001)
        .setVisible(false)

        // background
        const bg = this.add.rectangle(0, 0, 350, 200, 0x000000, 0.8).setOrigin(0.5);
        // prompt text
        const label = this.add
            .text(0, -82, "Choose Drop Direction", {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#FFFFFF'
            })
            .setOrigin(0.5)

            // buttons
            const btnStyle = { fontFamily:'"Press Start 2P"', fontSize:'14px', color:'#ffffff', backgroundColor:'#444', padding:{x:14,y:8} };
            const vertical = this.add
                .text(0, -40, "Vertical", btnStyle)
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                this.directionPromptContainer.setVisible(false);
                this.events.emit('directionChosen', 'vertical');
                });

            const horizontal = this.add
                .text(0, 0, "Horizontal", btnStyle)
                .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.directionPromptContainer.setVisible(false);
                this.events.emit('directionChosen', 'horizontal');
                });

            const cancel = this.add
                .text(0, 40, "Cancel", btnStyle)
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.directionPromptContainer.setVisible(false);
                    this.events.emit('directionChosen', null);
                    return;
            });

            this.directionPromptContainer.add([bg, label, vertical, horizontal, cancel]);
            this.uiContainer.add(this.directionPromptContainer);

        // Create Field Manual container
        this.fieldManualContainer = this.add.container(0, 0).setDepth(100).setVisible(false);

        // Background box
        const background = this.add.rectangle(400, 300, 600, 500, 0x000000, 0.9);
        background.setStrokeStyle(2, 0xffffff);

        // Create an invisible mask for the scrollable content
        const maskGraphics = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRect(120, 70, 560, 460);
        
        // Make the mask graphics invisible but keep the masking effect
        maskGraphics.setVisible(false);
        
        // Manual text content
        const manualText = this.add.text(120, 70, fieldManualContent, {
            fontSize: '16px',
            wordWrap: { width: 560 },
            color: '#FFFFFF',
            lineSpacing: 5
        }).setMask(new Phaser.Display.Masks.GeometryMask(this, maskGraphics));

        // Add scroll indicators
        const scrollUpIndicator = this.add.text(400, 75, '▲', {
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5, 0).setAlpha(0.7).setVisible(false);

        const scrollDownIndicator = this.add.text(400, 525, '▼', {
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5, 1).setAlpha(0.7).setVisible(false);

        // Track scroll position and limits
        const scrollConfig = {
            startY: 70,
            minY: 70,
            maxY: -Math.max(0, manualText.height - 440), // 460 (mask height) - 20 (padding)
            currentY: 70,
            scrollSpeed: 15
        };

        // Update scroll indicators based on position
        const updateScrollIndicators = () => {
            scrollUpIndicator.setVisible(manualText.y < scrollConfig.startY);
            scrollDownIndicator.setVisible(manualText.y > scrollConfig.maxY);
        };

        // Mouse wheel scrolling - prevent map zoom when manual is open
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.fieldManualContainer.visible) {
                // Make sure zoom is enabled when manual is closed
                this.scene.get('MapScene').disableZoom = false;
                return;
            }
            
            // Stop the event from propagating to the map scene
            pointer.event.stopPropagation();
            pointer.event.preventDefault();
            
            const newY = Phaser.Math.Clamp(
                manualText.y - Math.sign(deltaY) * scrollConfig.scrollSpeed,
                scrollConfig.maxY,
                scrollConfig.startY
            );
            manualText.y = newY;
            updateScrollIndicators();
        });

        // Enable touch drag scrolling for mobile devices
        let isDragging = false;
        let dragStartY = 0;
        let contentStartY = 0;

        // Enable input on manualText for dragging
        manualText.setInteractive({ draggable: false });

        manualText.on('pointerdown', (pointer) => {
            isDragging = true;
            dragStartY = pointer.y;
            contentStartY = manualText.y;
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (!isDragging || !this.fieldManualContainer.visible) return;

            const deltaY = pointer.y - dragStartY;
            const newY = Phaser.Math.Clamp(
                contentStartY + deltaY,
                scrollConfig.maxY,
                scrollConfig.startY
            );
            manualText.y = newY;
            updateScrollIndicators();
        });


        // When manual visibility changes, update MapScene zoom state
        this.fieldManualContainer.on('setVisible', (visible) => {
            const mapScene = this.scene.get('MapScene');
            if (visible) {
                manualText.y = scrollConfig.startY;
                updateScrollIndicators();
                mapScene.disableZoom = true;
            } else {
                mapScene.disableZoom = false;
            }
        });

        // Update scroll instructions text
        const scrollInstructions = this.add.text(400, 510, 
            'Use mouse wheel to scroll', { 
            fontSize: '12px',
            color: '#888888',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Add maskGraphics to the container to ensure it's cleaned up properly
        this.fieldManualContainer.add([
            background,
            maskGraphics,  // Add the mask graphics to the container
            manualText,
            scrollUpIndicator,
            scrollDownIndicator,
            scrollInstructions
        ]);

        // == Close Button for Field Manual ==
        const closeBtnContainer = this.add.container(670, 65).setScrollFactor(0);

        // Text "X"
        const closeText = this.add.text(4, 4, '❌', {
            fontSize: '24px',
            color: '#ffffff',
            padding: { top: 6, bottom: 0 }  // Add top padding
        })
        .setOrigin(0.5)
        .setInteractive();


        // Hover effect: slight scale bounce
        closeText.on('pointerover', () => {
            this.tweens.add({
                targets: closeText,
                scale: 1.2,
                duration: 100,
                ease: 'Power1'
            });
        });
        closeText.on('pointerout', () => {
            this.tweens.add({
                targets: closeText,
                scale: 1,
                duration: 100,
                ease: 'Power1'
            });
        });

        // Click to close
        closeText.on('pointerdown', () => {
            this.fieldManualContainer.setVisible(false);
            this.scene.get('MapScene').disableZoom = false;
        });

        // Add to container
        closeBtnContainer.add(closeText);
        this.fieldManualContainer.add(closeBtnContainer);
        // == End of Field Manual Close Button ==



        // Toggle with F key
        this.input.keyboard.on('keydown-F', () => {
            const inactiveScenes = ['LoginScene', 'SignupScene', 'ProfileScene', 'LeaderboardScene'];
            const isAnyActive = inactiveScenes.some(scene => this.scene.isActive(scene));
            
            if (!isAnyActive) {
                const visible = this.fieldManualContainer.visible;
                this.fieldManualContainer.setVisible(!visible);
                this.scene.get('MapScene').disableZoom = !visible;
            }
        });

        // Handle manual button click
        const manualButton = this.add.text(492, -16, "📖", {
            fontSize: '36px'
        })
        .setInteractive()
        .on('pointerdown', () => {
            const visible = this.fieldManualContainer.visible;
            this.fieldManualContainer.setVisible(!visible);
            // Explicitly set zoom state when toggling with button
            this.scene.get('MapScene').disableZoom = !visible;
        })
        .setScrollFactor(0);

        // Add tooltip
        this._createTooltip(manualButton, "Field Manual (F)");
        this.bottomBarContainer.add(manualButton);

        // Create weather info panel in top left
        this.weatherPanel = this.add.container(20, 70);
        
        // Weather panel background 
        const weatherBg = this.add.rectangle(0, 0, 250, 60, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0xffffff);
        
        // Risk level and wind info combined on same line
        this.riskText = this.add.text(10, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0, 0);

        this.windText = this.add.text(10, 30, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0, 0);

        this.windLabel = this.add.text(
        this.WIND_GAUGE_X - 8,
        this.WIND_GAUGE_Y + this.WIND_GAUGE_HEIGHT / 2,
        'Wind:',
        {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#FFFFFF'
        }
        )
        .setOrigin(1, 0.5)
        .setScrollFactor(0);

        // —– GRAPHICAL WIND GAUGE —–
        // background track
        this.windGaugeBg = this.add
        .rectangle(
            this.WIND_GAUGE_X,
            this.WIND_GAUGE_Y,
            this.WIND_GAUGE_WIDTH,
            this.WIND_GAUGE_HEIGHT,
            0x888888,  // dark grey
            0.7
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);

        // fill bar (start at zero width)
        this.windGaugeFill = this.add
        .rectangle(
            this.WIND_GAUGE_X,
            this.WIND_GAUGE_Y,
            0,
            this.WIND_GAUGE_HEIGHT,
            0x00ff00,
            1
        )
        .setOrigin(0, 0)
        .setScrollFactor(0);

        // directional arrow (asset: 'wind-arrow' pointing up by default)
        this.windArrow = this.add
        .image(
            this.WIND_GAUGE_X + this.WIND_GAUGE_WIDTH + 10,
            this.WIND_GAUGE_Y + this.WIND_GAUGE_HEIGHT/2,
            'wind-arrow'
        )
        .setDisplaySize(this.WIND_GAUGE_HEIGHT, this.WIND_GAUGE_HEIGHT)
        .setOrigin(0.5)
        .setScrollFactor(0);

  
        this.weatherPanel.add([weatherBg, this.riskText, this.windText, this.windGaugeBg, this.windGaugeFill, this.windArrow, this.windLabel]);
        this.topBarContainer.add(this.weatherPanel);


        // Initialize the panel immediately
        this.updateInfoPanel();

        // Create tile info panel that stays visible
        this.tileInfoPanel = this.add.container(20, 140);
        
        const tileInfoBg = this.add.rectangle(0, 0, 250, 40, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0xffffff);
        
        this.tileInfoText = this.add.text(10, 10, 'Click a tile for info', { // Default text
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#888888', // Dimmed color for default state
            wordWrap: { width: 230 }
        }).setOrigin(0, 0);

        this.tileInfoPanel.add([tileInfoBg, this.tileInfoText]);
        this.topBarContainer.add(this.tileInfoPanel);

        // Add fire step progress container
        this.fireStepContainer = this.add.container(0, 0).setDepth(11);

        // Add countdown text
        this.fireStepText = this.add.text(400, 40, 'Next Fire Spread: 15s', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5, 0);

        // Warning text with background
        this.fireWarningText = this.add.text(400, 60, 'FIRE SPREADING!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FF0000',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0).setVisible(false);

        // Add everything to the container
        this.fireStepContainer.add([
            this.fireStepText,
            this.fireWarningText
        ]);
        this.topBarContainer.add(this.fireStepContainer);
    }
    
    createZoomControls() {
        const BUTTON_SIZE = 40;
        const BUTTON_SPACING = 20;
        const baseX = 200; // Start at 40px from left inside bottom bar
        const baseY = 0; 

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


        // Create toggle icon (default to 'on' since UI starts visible)
        this.uiToggleButton = this.add.image(-60, 420,'toggle_ui_on')
        .setInteractive()
        .setScrollFactor(0)
        .setDisplaySize(32, 32)
        .on('pointerover', () => this.uiToggleButton.setTint(0xBBBBBB))  // Darken on hover
        .on('pointerout', () => this.uiToggleButton.clearTint())         // Clear tint on exit
        .on('pointerdown', () => {
            const newState = !this.uiContainer.visible;
            this.toggleUI(newState);
            const newTexture = newState ? 'toggle_ui_on' : 'toggle_ui_off';
            this.uiToggleButton.setTexture(newTexture);
        });
        
        // Add to its own container
        this.uiToggleButtonContainer = this.add.container(650, this.scale.height - 60, [this.uiToggleButton]).setScrollFactor(0);

        // Create a rounded rectangle background for the toggle button
        const toggleBg = this.add.graphics();
        toggleBg.fillStyle(0x555555, 1);
        toggleBg.fillRoundedRect(-25, -25, 50, 50, 8); // x, y, width, height, radius
        toggleBg.setInteractive(new Phaser.Geom.Rectangle(-25, -25, 50, 50), Phaser.Geom.Rectangle.Contains);

        // Add hover effects
        toggleBg.on('pointerover', () => {
            toggleBg.clear();
            toggleBg.fillStyle(0x777777, 1);
            toggleBg.fillRoundedRect(-25, -25, 50, 50, 8);
        });

        toggleBg.on('pointerout', () => {
            toggleBg.clear();
            toggleBg.fillStyle(0x555555, 1);
            toggleBg.fillRoundedRect(-25, -25, 50, 50, 8);
        });

        // Clear your existing container and add the new elements
        // After creating the background
        this.uiToggleButtonContainer.removeAll();

        // Reset the button's position to (0,0) so it's centered with the background
        this.uiToggleButton.setPosition(0, 0);

        // Now add both to the container
        this.uiToggleButtonContainer.add([toggleBg, this.uiToggleButton]);
        
        this.zoomText = this.add.text(
            baseX - 30,
            40,
            'Zoom: 100%',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px',
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
    
        // Create an info (i) button with rounded background
        const infoBg = this.add.graphics();
        infoBg.fillStyle(0x555555, 1);
        infoBg.fillRoundedRect(-25, -25, 50, 50, 8);
        infoBg.setInteractive(new Phaser.Geom.Rectangle(-25, -25, 50, 50), Phaser.Geom.Rectangle.Contains);

        // Add hover effects to info button
        infoBg.on('pointerover', () => {
            infoBg.clear();
            infoBg.fillStyle(0x777777, 1);
            infoBg.fillRoundedRect(-25, -25, 50, 50, 8);
        });

        infoBg.on('pointerout', () => {
            infoBg.clear();
            infoBg.fillStyle(0x555555, 1);
            infoBg.fillRoundedRect(-25, -25, 50, 50, 8);
        });

        // Create the info text/icon
        const infoButton = this.add.text(0, 0, 'i', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Create a container for the info button
        this.infoButtonContainer = this.add.container(575, this.scale.height - 60, [infoBg, infoButton])
            .setScrollFactor(0);
        this.infoButtonContainer.setDepth(100); // Ensure it's above other elements

        // Create info panel (initially hidden)
        this.infoPanel = this.add.container(175, 175)
            .setScrollFactor(0)
            .setVisible(false);

        // Add background for info panel
        const infoPanelBg = this.add.rectangle(0, 0, 300, 200, 0x333333, 0.9)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xFFFFFF);

        // Add close button for info panel
        const closeButton = this.add.text(130, -85, 'X', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.infoPanel.setVisible(false);
        });

        // Create text elements for the info panel
        this.infoPanelTitle = this.add.text(0, -85, 'Game Info', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.infoPanelTile = this.add.text(-130, -60, 'Tile: N/A', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0, 0);

        this.infoPanelWind = this.add.text(-130, 0, 'Wind: N/A', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0, 0);

        this.infoPanelRisk = this.add.text(-130, 60, 'Risk: N/A', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0, 0);

        // Add all elements to the info panel
        this.infoPanel.add([
            infoPanelBg,
            this.infoPanelTitle,
            closeButton,
            this.infoPanelTile,
            this.infoPanelWind,
            this.infoPanelRisk
        ]);

        // Add the info panel to the UI container
        this.uiContainer.add(this.infoPanel);

        // Add click handler to info button
        infoBg.on('pointerdown', () => {
        const visible = !this.weatherPanel.visible;
        this.weatherPanel.setVisible(visible);
        this.tileInfoPanel.setVisible(visible);
        
        });

 
    }
    
    createNavigationCompass() {
        const navX = 90; // Center position
        const navY = 0;  // Within bottom bar
        const buttonSize = 30;
        const buttonSpacing = 35;
        
        // Compass directions
        const directions = [
            { key: 'up', x: 0, y: -1, posX: navX, posY: navY - buttonSpacing },
            { key: 'right', x: 1, y: 0, posX: navX + buttonSpacing, posY: navY },
            { key: 'down', x: 0, y: 1, posX: navX, posY: navY + buttonSpacing },
            { key: 'left', x: -1, y: 0, posX: navX - buttonSpacing, posY: navY }
        ];
        
        // Center point
        const compassCenter = this.add.circle(navX, navY, 10, 0x555555)
            .setScrollFactor(0);
        this.bottomBarContainer.add(compassCenter);
        
        // Create buttons
        directions.forEach(dir => {
            const button = this.add.image(dir.posX, dir.posY, dir.key)
                .setDisplaySize(buttonSize, buttonSize)
                .setScrollFactor(0)
                .setInteractive()
                .on('pointerdown', () => this.events.emit('panStart', { x: dir.x, y: dir.y }))
                .on('pointerup', () => this.events.emit('panStop'))
                .on('pointerout', () => this.events.emit('panStop'));
            this.bottomBarContainer.add(button);
        });
    }

    // Handler to update fire spread progress indicator
    updateFireProgress(percent) {
        if (!this.fireStepText) return;

        // Calculate seconds remaining
        const secondsLeft = Math.ceil(15 * (1 - percent / 100));
        
        // Update color based on urgency
        let textColor = '#FFFFFF';
        
        if (percent > 85) {
            textColor = '#FF0000';
            // Show warning when close to spreading
            this.fireWarningText.setVisible(true);
        } else if (percent > 60) {
            textColor = '#FF8C00';
            this.fireWarningText.setVisible(false);
        } else {
            this.fireWarningText.setVisible(false);
        }

        // Update text
        this.fireStepText
            .setText(`Next Fire Spread: ${secondsLeft}s`)
            .setColor(textColor);
    }

        updateScore(score) {
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${score}`);
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

    // Handler for tile information updates
    updateTileInfo(tile) {
    if (!this.tileInfoText) return;

    // Always show the terrain name
    let text = `📍 ${this.getTerrainName(tile.terrain)}`;

    // If this tile had any fuel at spawn, show current/max
    const hasFuel = typeof tile.initialFuel === 'number' && tile.initialFuel > 0;
    if (hasFuel) {
        const fuelLine = this.generateFuelText(tile.fuel, tile.initialFuel);
        text += `\n⛽ Fuel: ${fuelLine}`;
    }

    this.tileInfoText
        .setText(text)
        .setColor('#FFFFFF');

    // Remove any hide timer if one exists
    if (this.tileInfoHideTimer) {
        this.tileInfoHideTimer.remove();
        this.tileInfoHideTimer = null;
    }
    }
    // }

    // Handler for fire simulation toggle updates
    updateFireButton(isRunning) {
        if (this.fireButton && this.fireButton.buttonText) {
            this.fireButton.buttonText.setText(isRunning ? "Stop" : "Start");
        }

        // Show or hide the pause message
        if (this.pauseText) {
            this.pauseText.setVisible(!isRunning);
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

    updateInfoPanel() {
    const mapScene = this.scene.get('MapScene');
    const weather  = mapScene.weather;
    if (!weather) return;

    const riskLevel = weather.getRiskCategory().toUpperCase();
    const riskColor = { LOW:'#00ff00', MEDIUM:'#ffff00', HIGH:'#ff0000' }[riskLevel];
    this.riskText
        .setText(`Fire Risk: ${riskLevel}`)
        .setColor(riskColor);

    //—— GRAPHICAL WIND UPDATE ——//
    const pct = Phaser.Math.Clamp(weather.windSpeed / 50, 0, 1);
    // 1) fill width
    this.windGaugeFill.width = this.WIND_GAUGE_WIDTH * pct;
    // 2) tint by intensity
    if (pct < 0.33)       this.windGaugeFill.fillColor = 0x00ff00;
    else if (pct < 0.66)  this.windGaugeFill.fillColor = 0xffff00;
    else                   this.windGaugeFill.fillColor = 0xff0000;
    // 3) rotate arrow
    const dirToAngle = { N:-90, E:0, S:90, W:180 };
    const angleDeg = dirToAngle[weather.windDirection] ?? 0;
    this.windArrow.setRotation(Phaser.Math.DegToRad(angleDeg));
    }
    // Helper to get friendly terrain names
    getTerrainName(terrain) {
        // Handle burned variants first
        if (terrain.startsWith('burned-')) {
            const base = terrain.slice(7); // strip 'burned-' prefix
            const burnedMap = {
                'tree': '🔥 Burned Forest',
                'shrub': '🔥 Burned Shrubland',
                'grass': '🔥 Burned Grassland',
                'dirt-house': '🔥 Burned Structure',
                'grass-house': '🔥 Burned Structure',
                'sand-house': '🔥 Burned Structure',
                'house': '🔥 Burned Structure' // fallback for generic
            };
            return burnedMap[base] || '🔥 Burned Area';
        }

        // Regular terrain names
        const terrainMap = {
            'tree': '🌳 Forest',
            'shrub': '🌿 Shrubland',
            'grass': '🌱 Grassland',
            'dirt-house': '🏠 Structure',
            'grass-house': '🏠 Structure',
            'sand-house': '🏠 Structure',
            'water': '💧 Water',
            'fire-break': '🚧 Firebreak'
        };

        return terrainMap[terrain] || terrain;
    }
}

