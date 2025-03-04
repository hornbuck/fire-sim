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
        this.load.image('Title', 'assets/UI/Title.png')
        this.load.image('Restart Button', 'assets/UI/restartButton.png')
    }

    create() {
        console.log("UIScene Created");

        // Create UI Elements
        this.createUIElements();

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
    }

    createUIElements() {
        // Game titlea
        this.add.image(40, 40, 'Title', {});

        // Restart Game button
        const restartButton = this.add.image(140, 50, 'Restart Button')
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
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // Emit event to MapScene
            });

        // Weather Stats
        this.weatherText = this.add.text(10, 550, `Loading weather...`, {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',  // Olive green for a rustic feel
            padding: { x: 15, y: 10 }
        });

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
        } else {
            console.warn("tileInfoText is not defined in UIScene!");
        }
    }

    // Handler for fire simulation toggle updates
    updateFireButton(isRunning) {
        this.fireButton.setText(isRunning ? 'Stop Fire' : 'Start Fire');
    }
}