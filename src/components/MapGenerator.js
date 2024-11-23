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
                const terrain = this.getRandomTerrain();
                row.push(this.createTile(x, y, terrain));
            }
            grid.push(row);
        }
        return grid;
    }

    // Create a tile with its attributes
    createTile(x, y, terrain) {
        const attributes = this.getTerrainAttributes(terrain);
        return {
            x, // Tile's X coordinate in the grid
            y, // Tile's Y coordinate in the grid
            terrain, // Terrain type
            ...attributes, // Terrain-specific attributes
            burnStatus: "unburned", // Burn status: unburned, burning, burnt
        };
    }

    // Assign random terrain type
    getRandomTerrain() {
        const terrains = ["grass", "shrub", "tree", "water"];
        return terrains[Math.floor(Math.random() * terrains.length)];
    }

    // Define terrain-specific attributes
    getTerrainAttributes(terrain) {
        const terrainData = {
            grass: { flammability: 0.9, fuel: 1 },
            shrub: { flammability: 0.7, fuel: 2 },
            tree: { flammability: 0.4, fuel: 3 },
            water: { flammability: 0, fuel: 0 },
        };
        return terrainData[terrain];
    }

// Print the map to the console for debugging in a grid format
    printMap() {
        this.grid.forEach(row => {
            console.log(row.map(tile => {
                // Displaying tile properties in a readable format
                return `{ x: ${tile.x}, y: ${tile.y}, terrain: '${tile.terrain}', flammability: ${tile.flammability}, fuel: ${tile.fuel}, burnStatus: '${tile.burnStatus}' }`;
            }).join(' | ')); // Join the tiles in a row with '|' separator for clarity
        });
    }


}

// Example usage:
const map = new Map(10, 10); // Create a 10x10 map
map.printMap(); // Print terrain types
console.log(map.grid); // Log the detailed grid with attributes