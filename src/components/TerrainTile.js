export default class TerrainTile {
    // Static constants for terrain attributes
    static FLAM_GRASS = 0.8;
    static FUEL_GRASS = 2;
    static FLAM_SHRUB = 2.5;
    static FUEL_SHRUB = 4;
    static FLAM_TREE = 0.3;
    static FUEL_TREE = 6;
    static FLAM_WATER = 0;
    static FUEL_WATER = 0;
    static FLAM_GRASS_HOUSE = 0.7;
    static FUEL_GRASS_HOUSE = 2;
    static FLAM_SAND_HOUSE = 0.3;
    static FUEL_SAND_HOUSE = 4;
    static FLAM_DIRT_HOUSE = 0.5;
    static FUEL_DIRT_HOUSE = 6;

    constructor(x, y, terrain) {
        this.x = x;          // Tile's X coordinate in the grid
        this.y = y;          // Tile's Y coordinate in the grid
        this.terrain = terrain;  // Terrain type (grass, shrub, tree, water, house)
        this.burnStatus = "unburned"; // Burn status: unburned, burning, burnt
        this._crownFired = false; // Track if tree has had crown fire burst

        // Set terrain-specific attributes
        const attributes = this.getTerrainAttributes(terrain);
        this.flammability = attributes.flammability;
        this.fuel = attributes.fuel;
        this.initialFuel = this.fuel; // Store initial fuel for crown fire check
    }

    // Return terrain-specific attributes based on the terrain type
    getTerrainAttributes(terrain) {
        const terrainData = {
            grass: { flammability: TerrainTile.FLAM_GRASS, fuel: TerrainTile.FUEL_GRASS },
            shrub: { flammability: TerrainTile.FLAM_SHRUB, fuel: TerrainTile.FUEL_SHRUB },
            tree:  { flammability: TerrainTile.FLAM_TREE, fuel: TerrainTile.FUEL_TREE },
            water: { flammability: TerrainTile.FLAM_WATER, fuel: TerrainTile.FUEL_WATER },
            'grass-house': { flammability: TerrainTile.FLAM_GRASS_HOUSE, fuel: TerrainTile.FUEL_GRASS_HOUSE},
            'sand-house': { flammability: TerrainTile.FLAM_SAND_HOUSE, fuel: TerrainTile.FUEL_SAND_HOUSE},
            'dirt-house': { flammability: TerrainTile.FLAM_DIRT_HOUSE, fuel: TerrainTile.FUEL_DIRT_HOUSE},
        };
        return terrainData[terrain] || { flammability: 0, fuel: 0 }; // Default to no flammability for unknown terrains
    }

    // Optional: Method to display tile details (for debugging or visualization)
    toString() {
        return `{ x: ${this.x}, y: ${this.y}, terrain: '${this.terrain}', flammability: ${this.flammability}, fuel: ${this.fuel}, burnStatus: '${this.burnStatus}' }`;
    }
}
