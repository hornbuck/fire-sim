// MapGenerator.js
import TerrainTile from './TerrainTile.js';

export default class Map {
    constructor(width, height) {
        this.width = width; // Number of tiles horizontally
        this.height = height; // Number of tiles vertically
        this.grid = this.generateMap(); // 2D array of tiles
    }

    // Generate the grid with tiles
    generateMap() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const terrain = this.getRandomTerrain(); // Random terrain type
                row.push(new TerrainTile(x, y, terrain)); // Create new tile with x, y, and terrain
            }
            grid.push(row);
        }
        return grid;
    }

    // Assign random terrain type
    // To be updated - useful for fire spread development
    getRandomTerrain() {
        const terrains = ["grass", "shrub", "tree", "water"];
        return terrains[Math.floor(Math.random() * terrains.length)];
    }

    // Print the terrain of each tile in a grid format
    printMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.terrain).join(' | ')); // Print terrain for each tile, joined by '|'
        });
    }

    // Print only the burn status of each tile in the map
    printBurnStatusMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => tile.burnStatus).join(' | ')); // Only print burn status for each tile
        });
    }
}
