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

        // Add text to HUD
        this.hoseText = hoseText;
        this.extinguisherText = extinguisherText;
        this.helicopterText = helicopterText;
        this.firetruckText = firetruckText;
        this.airtankerText = airtankerText;
        this.hotshotcrewText = hotshotcrewText;
        this.smokejumperText = smokejumperText;

        this.fireButton = this.add.text(10, 70, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // ✅ Emits event instead
            });
        

        // Restart Button
        this.restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('restartGame'); // Emit event instead of calling MapScene directly
            });

        // Weather Text
            this.weatherText = this.add.text(10, 100, 'Loading weather...');

        // Event listeners
        this.scene.get('MapScene').events.on('weatherUpdated', weather => {
            this.weatherText.setText(`Temp: ${weather.temperature}°F | Humidity: ${weather.humidity}% | Wind: ${weather.windSpeed} mph | Direction: ${weather.windDirection}`);
        });

        this.scene.get('MapScene').events.on('tileInfo', (tile) => {
            console.log(`Updating tile info: ${tile.terrain}, ${tile.flammability}, ${tile.fuel}, ${tile.burnStatus}`); // Debugging
        
            if (this.tileInfoText) {
                this.tileInfoText.setText(`Terrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`);
                this.tileInfoText.setVisible(true); // Ensure it's visible
                this.tileInfoText.setDepth(100); // Bring it to the front
            } else {
                console.warn("tileInfoText is not defined in UIScene!");
            }
        });        

        this.scene.get('MapScene').events.on('fireSimToggled', isRunning => {
            this.fireButton.setText(isRunning ? 'Stop Fire' : 'Start Fire');
        });              
    }

    update() {
        if (!this.hoseText) return; // Ensure hoseText exists before updating

        this.hoseText.setText(`${hose}/10`);
        this.extinguisherText.setText(`${extinguisher}/5`);
        this.helicopterText.setText(`${helicopter}/3`);
        this.firetruckText.setText(`${firetruck}/3`);
        this.airtankerText.setText(`${airtanker}/2`);
        this.hotshotcrewText.setText(`${hotshotcrew}/1`);
        this.smokejumperText.setText(`${smokejumper}/5`);
    }

    createUIElements() {
        // Tile info text (for when a tile is clicked)
        this.tileInfoText = this.add.text(10, 400, "Tile Info", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0.7)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setScrollFactor(0); // Keeps it fixed on screen
    
        // Title - Game name
        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px "Georgia", serif',
            color: '#8B4513'
        });
    
        // Restart Game button
        const restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#A0522D', // Rustic wood-like color
            padding: { x: 15, y: 10 }
        })
        .setInteractive()
        .on('pointerover', () => {
            restartButton.setStyle({ backgroundColor: '#8B4513' });
        })
        .on('pointerout', () => {
            restartButton.setStyle({ backgroundColor: '#A0522D' });
        })
        .on('pointerdown', () => {
            this.scene.get('MapScene').initializeMap();
        });
    
        // Start/Stop fire simulation button
        this.fireButton = this.add.text(10, 70, 'Start Fire', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.events.emit('toggleFire'); // Emit event instead of calling MapScene directly
            });
    
        // Weather stats HUD
        this.weatherText = this.add.text(10, 100, `Weather: Temp: 68°F | Humidity: 30% | Wind: 15 mph | Direction: N`, {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',  // Olive green for a rustic feel
            padding: { x: 15, y: 10 }
        });
    
        // Game Clock Component of HUD
        this.gameClockText = this.add.text(200, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setScrollFactor(0); // Keep HUD static when moving around
    }    
}

