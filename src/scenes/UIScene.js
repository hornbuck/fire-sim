import { createHUD, preloadHUD, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    preload() {
        preloadHUD(this);
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
        this.fireButton = this.add.text(10, 70, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // Emit event to MapScene
            });

        // Weather text display
        this.weatherText = this.add.text(10, 100, 'Loading weather...', {
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
        }).setScrollFactor(0);

        // Tile info display
        this.tileInfoText = this.add.text(10, 400, "", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setScrollFactor(0);
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