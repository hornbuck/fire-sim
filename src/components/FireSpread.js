export default class FireSpread {
    constructor(map, weather) {
        this.map = map; // The map object
        this.weather = weather; // Weather object
    }

    // Simulate one step of fire spread
    simulateFireStep() {
        const newGrid = JSON.parse(JSON.stringify(this.map.grid)); // Copy the grid

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid[y][x];
                if (tile.burnStatus === "burning") {
                    // Spread fire to neighbors
                    this.spreadFire(tile, newGrid);
                    // Update burn status to burnt if fuel is exhausted
                    newGrid[y][x].fuel -= 1;
                    if (newGrid[y][x].fuel <= 0) {
                        newGrid[y][x].burnStatus = "burnt";
                    }
                }
            }
        }

        // Update the map's grid with new fire states
        this.map.grid = newGrid;
    }

    // Spread fire to neighboring tiles
    spreadFire(tile, grid) {
        const neighbors = this.getNeighbors(tile.x, tile.y);
        for (const neighbor of neighbors) {
            const neighborTile = grid[neighbor.y][neighbor.x];
            if (neighborTile.burnStatus === "unburned") {
                const ignitionChance = this.calculateIgnitionChance(neighborTile);
                if (ignitionChance > 85) { // Ignite if chance is high enough
                    neighborTile.burnStatus = "burning";
                }
            }
        }
    }

    // Get neighboring tiles' coordinates
    getNeighbors(x, y) {
        const directions = [
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
        ];

        return directions
            .map(dir => ({ x: x + dir.x, y: y + dir.y }))
            .filter(
                neighbor =>
                    neighbor.x >= 0 &&
                    neighbor.x < this.map.width &&
                    neighbor.y >= 0 &&
                    neighbor.y < this.map.height
            );
    }

    // Calculate ignition chance for a tile
    calculateIgnitionChance(tile) {
        const baseChance = tile.flammability * 100; // Base chance from terrain
        const weatherInfluence = this.calculateWeatherInfluence();
        return baseChance + weatherInfluence;
    }

    // Calculate weather influence on fire spread
    calculateWeatherInfluence() {
        const { windSpeed, windDirection, humidity, temperature } = this.weather;
        let influence = 0;

        // Simplified weather effects
        influence += windSpeed * 10; // Higher wind speeds increase fire spread
        influence -= humidity * 5;  // Higher humidity reduces fire spread
        influence += (temperature - 20) * 2; // Hotter temperatures increase fire spread

        return Math.max(0, influence); // Ensure no negative influence
    }
}