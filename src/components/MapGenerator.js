/**
 * @file MapGenerator.js
 * @description Generates a 2D map using Perlin Noise and Binary Space Partitioning (BSP).
 */

import BSPPartition from "../utils/BSPPartition.js";
import TerrainTile from './TerrainTile.js';
import PerlinNoise from '../utils/PerlinNoise.js'

export default class Map {
    /**
     * Initializes the Map class with dimensions, partitioning size, and noise generation.
     * @param {number} width - The width of the map grid in tiles.
     * @param {number} height - The height of the map grid in tiles.
     * @param {number} minSize - The minimum size for BSP partitioning.
     * @param {number|string} seed - The seed for the map.
     */
    constructor(width, height, minSize, seed = Date.now()) {
        this.width = width;
        this.height = height;
        this.minSize = minSize;
        this.perlin = new PerlinNoise(width, height);
        this.bsp = new BSPPartition(width, height, minSize);

        // Debug: Visualize the BSP partitions
        this.bsp.visualizePartitions();

        this.grid = this.generateMap(); // 2D array of tiles
    }

    /**
     * Regenerate the map with a new seed.
     * @param {number|string} newSeed - The new seed for map generation.
     */
    regenerateMap(newSeed) {
        this.perlin.setSeed(newSeed);
        this.grid = this.generateMap();
    }

    /**
     * Generates the map by applying Perlin Noise within BSP-partitioned regions.
     * @returns {Array<Array<TerrainTile>>} A 2D grid of TerrainTile objects.
     */
    generateMap() {
        const grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
        const partitions = this.bsp.getPartitions(); // Retrieve partitions

        if (partitions.length === 0) {
            console.error('BSPPartition failed to create any partitions. Falling back to single-partition grid.');
            partitions.push({ x: 0, y: 0, width: this.width, height: this.height });
        }

        partitions.forEach(partition => {
            for (let y = partition.y; y < partition.y + partition.height; y++) {
                for (let x = partition.x; x < partition.x + partition.width; x++) {
                    const noiseValue = this.perlin.getNoise(x, y);
                    const terrain = this.getTerrainFromNoise(noiseValue);
                    grid[y][x] = new TerrainTile(x, y, terrain);
                }
            }
        });

        return grid;
    }    

    /**
     * Maps Perlin Noise values to terrain types.
     * @param {number} value - The noise value from Perlin Noise.
     * @returns {string} The corresponding terrain type.
     */
    getTerrainFromNoise(value) {
        if (value < -0.5) return 'water';
        if (value < 0) return 'tree';
        if (value < 0.5) return 'grass';
        return 'shrub';
    }

    /**
     * Prints the terrain type of each tile in the map grid to the console.
     * Each row of the grid is printed as a string of terrain types separated by pipes (|).
     * Useful for debugging the generated map.
     */
    printMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.terrain).join(' | ')); // Print terrain for each tile, joined by '|'
        });
    }

    /**
     * Prints the burn status of each tile in the map grid to the console.
     * Each row of the grid is printed as a string of burn statuses separated by pipes (|).
     * Useful for visualizing fire spread during gameplay.
     */
    printBurnStatusMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.burnStatus).join(' | ')); // Only print burn status for each tile
        });
    }

    /**
     * Retrieves a specific tile from the map grid based on its coordinates.
     * @param {number} x - The x-coordinate of the tile.
     * @param {number} y -The y-coordinate of the tiles.
     * @returns {TerrainTile|null} The tile at the specified coordinates or null if out of bounds.
     */
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[y][x]; // Adjusted to access the correct row first
        }
        return null;
    }
}