/**
 * @file MapLogic.js
 * @description Encapsulates the map generation, rendering, and fire simulation logic.
 */

import Map from '../components/MapGenerator.js';
import FireSpread, { lightFire } from '../components/FireSpread.js';
import Weather from '../components/Weather.js';

export class MapHandler {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.mapWidth = config.mapWidth || 10;
        this.mapHeight = config.mapHeight || 10;
        this.minSize = config.minSize || 5;
        this.tileSize = config.tileSize || 32;
        this.currentSeed = config.currentSeed || Date.now()

        // Create groups for tiles and flames
        this.mapGroup = this.scene.add.group();
        this.flameGroup = this.scene.add.group();

        this.initializeMap();
    }

    initializeMap() {
        console.log(`Initial Seed: ${this.currentSeed}`);
        this.map = new Map(this.mapWidth, this.mapHeight, this.minSize, this.currentSeed);

        // Debug: Log BSP partitions
        console.log("Map Partitions:");
        this.map.bsp.getPartitions().forEach((partition, index) => {
            console.log(`Partition ${index}: x=${partition.x}, y=${partition.y}, width=${partition.width}, height=${partition.height}`);
        });

        const weather = new Weather(15, 40, 30);
        this.fireSpread = new FireSpread(this.map, weather);
    }

    renderMap() {
        // Clear previous map and flame groups
        this.mapGroup.clear(true, true);
        if (this.flameGroup) {
            this.flameGroup.clear(true, true);
        } else {
            this.flameGroup = this.scene.add.group();
        }

        // Calculate starting coordinates to center the map
        const startX = (this.scene.cameras.main.width - this.map.width * this.tileSize) / 2;
        const startY = (this.scene.cameras.main.height - this.map.height * this.tileSize) / 2;

        // Loop through the grid and add each tile as a sprite
        this.map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // Check if the texture exists; fallback if necessary
                const terrainKey = this.scene.textures.exists(tile.terrain) ? tile.terrain : 'defaultTerrain';
                const sprite = this.scene.add.sprite(
                    startX + x * this.tileSize,
                    startY + y * this.tileSize,
                    terrainKey
                ).setOrigin(0).setScale(0.5, 0.5);

                tile.sprite = sprite;
                sprite.setInteractive();
                sprite.on('pointerdown', () => {
                    console.log(`Clicked on ${tile.terrain} at (${x}, ${y})`);
                });

                this.mapGroup.add(sprite);
            });
        });
    }

    restartMap(newSeed) {
        this.currentSeed = newSeed;
        console.log(`Restarting map with seed: ${this.currentSeed}`);
        this.map.regenerateMap(this.currentSeed);
        console.log("Map Partitions:");
        this.renderMap();
    }

    startFire() {
        let tile;
        let startX, startY;

        // Keep selecting random tiles until a flammable one is found
        do {
            startX = Math.floor(Math.random() * this.map.width);
            startY = Math.floor(Math.random() * this.map.height);
            tile = this.map.grid[startY][startX];
        } while (tile.flammability === 0); // Ensure we start on a flammable tile

        tile.burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);
        if (tile.sprite) {
            lightFire(this.scene, tile.sprite, this.flameGroup);
            tile.fireSprite = true;
        }
    }

    updateFireSpread() {
        console.log("Simulating fire step...");
        this.fireSpread.simulateFireStep();

        // Light up any new burning tiles
        this.map.grid.forEach((row) => {
            row.forEach((tile) => {
                if (tile.burnStatus === "burning" && !tile.fireSprite) {
                    lightFire(this.scene, tile.sprite, this.flameGroup);
                    tile.fireSprite = true;
                }
            });
        });
    }
}