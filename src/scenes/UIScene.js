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
                this.scene.get('MapScene').toggleFireSimulation();
            });

        // Restart Button
            this.restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px Georgia',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        }).setInteractive()
            .on('pointerdown', () => {
                this.scene.get('MapScene').initializeMap();
            });

        // Weather Text
            this.weatherText = this.add.text(10, 100, 'Loading weather...');
        this.tileInfoText = this.add.text(10, 400, '');

        // Event listeners
        this.scene.get('MapScene').events.on('weatherUpdated', weather => {
            this.weatherText.setText(`Temp: ${weather.temperature}°F | Humidity: ${weather.humidity}% | Wind: ${weather.windSpeed} mph | Direction: ${weather.windDirection}`);
        });

        this.scene.get('MapScene').events.on('tileInfo', tile => {
            this.tileInfoText.setText(`Terrain: ${tile.terrain}\nFlammability: ${tile.flammability}\nFuel: ${tile.fuel}\nBurn Status: ${tile.burnStatus}`);
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
}
