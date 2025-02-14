/**
 * @file MainScene.js
 * @description Defines the MainScene class, responsible for rendering and managing the main gameplay scene.
 */

import { MapHandler } from '../components/MapLogic.js';
import { createHUD, preloadHUD } from '../components/ui.js';
import { hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText } from '../components/ui.js';
import { hose, extinguisher, helicopter, firetruck, airtanker, hotshotcrew, smokejumper } from '../components/DeploymentClickEvents.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        console.log("MainScene Constructor Called");

        this.gameClock = 0;
        this.fireSpreadInterval = 5000; // Fire spreads every 5 seconds
        this.lastFireSpreadTime = 0;
        this.isFireSimRunning = false;
    }

    preload() {
        console.log("MainScene Preload Starting");
        preloadHUD(this);

        // Preload terrain assets
        this.load.image('water', 'assets/64x64-Map-Tiles/water.png');
        this.load.image('grass', 'assets/64x64-Map-Tiles/grass.png');
        this.load.image('shrub', 'assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', 'assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png');

        // Preload terrain animation assets
        this.load.spritesheet('water-sheet', 'assets/64x64-Map-Tiles/splash-sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Preload burned terrain assets
        this.load.image('burned-grass', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-grass.png');
        this.load.image('burned-shrub', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-shrubs-on-sand.png');
        this.load.image('burned-tree', 'assets/64x64-Map-Tiles/Burned%20Tiles/burned-trees-on-light-dirt.png');
    }

    create() {


        console.log("MainScene Create Starting");
        this.input.on('pointerdown', this.handleTileClick, this);
        this.createUIElements();
        createHUD(this);

        // Initialize the map using MapHandler
        this.mapHandler = new MapHandler(this, {
            mapWidth: 10,
            mapHeight: 10,
            minSize: 5,
            tileSize: 32,
            currentSeed: Date.now(),
        });
        this.mapHandler.renderMap();

        this.elapsedTime = 0;
        this.mapHandler.startFire();

        console.log("MainScene Create Finished");
    }

    createUIElements() {
        // UI elements (HUD, buttons, etc.) remain unchanged...
        this.tileInfoText = this.add.text(10, 400, "", {
            fontSize: "16px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0)",
            padding: { x: 10, y: 5 },
            align: "left"
        }).setDepth(10).setScrollFactor(0);

        this.add.text(10, 10, 'Wildfire Command', {
            font: '20px "Georgia", serif',
            color: '#8B4513'
        }).setDepth(10).setScrollFactor(0);;

        const restartButton = this.add.text(10, 40, 'Restart Game', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#A0522D',
            padding: { x: 15, y: 10 }
        })
            .setInteractive()
            .on('pointerover', () => restartButton.setStyle({ backgroundColor: '#8B4513' }))
            .on('pointerout', () => restartButton.setStyle({ backgroundColor: '#A0522D' }))
            .on('pointerdown', () => this.restartGame())
            .setDepth(10).setScrollFactor(0);

        this.fireButton = this.add.text(10, 70, 'Start Fire', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#8B0000',
            padding: { x: 15, y: 10 }
        })
            .setInteractive()
            .on('pointerover', () => this.fireButton.setStyle({ backgroundColor: '#A52A2A' }))
            .on('pointerout', () => this.fireButton.setStyle({ backgroundColor: '#8B0000' }))
            .on('pointerdown', () => this.toggleFireSimulation())
            .setDepth(10).setScrollFactor(0);

        this.weatherText = this.add.text(10, 100, 'Weather: Loading...', {
            font: '16px "Georgia", serif',
            color: '#FFF',
            backgroundColor: '#556B2F',
            padding: { x: 15, y: 10 }
        }).setDepth(10).setScrollFactor(0);;
        this.updateWeatherHUD(15, 40, 30);

        this.gameClockText = this.add.text(200, 10, "Time: 00:00", {
            fontSize: "18px",
            fill: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 5, y: 5 }
        }).setDepth(10).setScrollFactor(0);
    }

    handleTileClick(pointer) {
        // Use the MapHandler's tile dimensions to calculate click coordinates
        const startX = (this.cameras.main.width - this.mapHandler.map.width * this.mapHandler.tileSize) / 2;
        const startY = (this.cameras.main.height - this.mapHandler.map.height * this.mapHandler.tileSize) / 2;

        let tileX = Math.floor((pointer.x - startX) / this.mapHandler.tileSize);
        let tileY = Math.floor((pointer.y - startY) / this.mapHandler.tileSize);

        // console.warn(`Clicked tile coordinates: (${tileX}, ${tileY})`);

        if (tileX >= 0 && tileX < this.mapHandler.map.width && tileY >= 0 && tileY < this.mapHandler.map.height) {
            let clickedTile = this.mapHandler.map.getTile(tileX, tileY);
            console.log(clickedTile ? `Tile found: ${clickedTile.toString()}` : "No tile found at this position!");
            if (clickedTile) {
                this.updateTileInfoDisplay(clickedTile);
            }
        }
    }

    updateTileInfoDisplay(tile) {
        this.tileInfoText.setText(
            `Terrain: ${tile.terrain}
Flammability: ${tile.flammability}
Fuel: ${tile.fuel}
Burn Status: ${tile.burnStatus}`
        );
    }

    updateGameClock(delta) {
        this.elapsedTime += delta / 1000;
        let minutes = Math.floor(this.elapsedTime / 60);
        let seconds = Math.floor(this.elapsedTime % 60);
        let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.gameClockText.setText(`Time: ${formattedTime}`);
    }

    updateWeatherHUD(temp, wind, humidity) {
        this.weatherText.setText(`Temp: ${temp}°F | Wind: ${wind} mph | Humidity: ${humidity}%`);
    }

    toggleFireSimulation() {
        if (this.isFireSimRunning) {
            console.warn("Fire Simulation Stopped");
            this.isFireSimRunning = false;
            this.fireButton.setText('Start Fire');
        } else {
            console.warn("Fire Simulation Started");
            this.isFireSimRunning = true;
            this.fireButton.setText('Stop Fire');
        }
    }

    update(time, delta) {
        this.updateGameClock(delta);

        if (this.isFireSimRunning && this.elapsedTime - this.lastFireSpreadTime >= this.fireSpreadInterval / 1000) {
            this.lastFireSpreadTime = this.elapsedTime;
            this.mapHandler.updateFireSpread();
        }

        // Update UI texts for deployments
        hoseText.setText(`${hose}/10`);
        extinguisherText.setText(`${extinguisher}/5`);
        helicopterText.setText(`${helicopter}/3`);
        firetruckText.setText(`${firetruck}/3`);
        airtankerText.setText(`${airtanker}/2`);
        hotshotcrewText.setText(`${hotshotcrew}/1`);
        smokejumperText.setText(`${smokejumper}/5`);
    }

    restartGame() {
        console.log("Restarting game...");
        this.mapHandler.restartMap(Date.now());
        console.log("Game restarted with a new map.");
        this.elapsedTime = 0;
        this.updateGameClock(0);
        this.mapHandler.startFire();
    }
}

export default MainScene;
