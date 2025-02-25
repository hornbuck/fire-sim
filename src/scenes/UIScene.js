import { createHUD, preloadHUD } from '../components/ui.js';
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
        createHUD(this);

        // Fire Simulation Button
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

        // Weather Info
        this.weatherText = this.add.text(10, 100, 'Loading weather...');
        this.tileInfoText = this.add.text(10, 400, '');

        // Event Listeners
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
        hoseText.setText(`${hose}/10`);
        extinguisherText.setText(`${extinguisher}/5`);
        helicopterText.setText(`${helicopter}/3`);
        firetruckText.setText(`${firetruck}/3`);
        airtankerText.setText(`${airtanker}/2`);
        hotshotcrewText.setText(`${hotshotcrew}/1`);
        smokejumperText.setText(`${smokejumper}/5`);
    }
}
