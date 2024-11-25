// MapGenerator.js
import TerrainTile from './TerrainTile.js';
import PerlinNoise from '../utils/PerlinNoise.js'

export default class Map {
    constructor(width, height) {
        this.width = width; // Number of tiles horizontally
        this.height = height; // Number of tiles vertically
        this.perlin = new PerlinNoise(width, height); // Initialize PerlinNoise
        this.grid = this.generateMap(); // 2D array of tiles
    }

    // Generate the map using the noise grid
    generateMap() {
        const grid = [];

        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const noiseValue = this.perlin.getNoise(x, y);
                const terrain = this.getTerrainFromNoise(noiseValue); // Map noise value to terrain
                row.push(new TerrainTile(x, y, terrain)); // Create a tile with the terrain
            }
            grid.push(row);
        }

        return grid;
    }

    // Map noise values to terrain types
    getTerrainFromNoise(value) {
        if (value < 2) return 'water';
        if (value < 5) return 'grass';
        if (value < 8) return 'shrub';
        return 'tree';
    }

    // Debugging: Print terrain for each tile
    printMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.terrain).join(' | ')); // Print terrain for each tile, joined by '|'
        });
    }

    // Debugging: Print burn status for each tile
    printBurnStatusMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.burnStatus).join(' | ')); // Only print burn status for each tile
        });
    }

    // Utility: Retrieve a specific tile
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[x][y];
        }
        return null; // Out of bounds
    }
}
