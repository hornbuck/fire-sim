import weather from "./Weather.js";
import { technique } from './DeploymentClickEvents.js'

/**
 * Lights a blaze on a terrain tile and makes fire clickable to extinguish later.
 * @param {Object} scene - The Phaser scene where the fire animation will play.
 * @param {Object} sprite - The sprite representing the terrain tile where the fire is ignited.
 */
export function lightFire(scene, sprite) {
    scene.anims.create({
        key: "fireAnimConfig",
        frames: scene.anims.generateFrameNumbers('fire-blaze'),
        frameRate: 10,
        repeat: -1
    });
    let fireSprite = scene.add.sprite(sprite.x + 16, sprite.y, 'fire-blaze').setDepth(1).setScale(0.75, 0.75);
    fireSprite.play('fireAnimConfig');

    // Make fire clickable to extinguish later
    fireSprite.setInteractive();
    fireSprite.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (technique === 'WATER') {
                fireSprite.destroy();
            }
        },
        this
    );
}

class FireSpread {
    /**
     * Creates an instance of the FireSpread class.
     * @param {Object} map - The map object that contains the grid of terrain tiles.
     * @param {Object} weather - The weather object that influences the fire spread.
     */
    constructor(map, weather) {
        this.map = map;       // The map object
        this.weather = weather; // Weather object
        console.log("Weather object received:", this.weather);
    }


    /**
     * Simulates one step of fire spread by processing each tile in the grid.
     * It copies the grid, checks for burning tiles, spreads fire to neighbors,
     * and updates the burn status of tiles based on fuel consumption.
     *
     * @returns {void} - This method does not return anything; it updates the map's grid directly.
     */

    simulateFireStep() {
        const newGrid = this.copyGrid();  // Extracted copying logic
        let spreadCount = 0;

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid[y][x];
                if (tile.burnStatus === "burning") {
                    console.log(`Processing burning tile at (${x}, ${y})`);
                    spreadCount += this.processBurningTile(tile, newGrid, x, y);
                }
            }
        }

        console.log(`${spreadCount} tiles ignited this step.`);
        this.map.grid = newGrid; // Update the map's grid with new fire states
    }


    /**
     * Creates a deep copy of the current grid to prevent mutating the original grid
     * while simulating fire spread.
     *
     * @returns {Array} - A deep copy of the map's grid.
     */
    copyGrid() {
        return JSON.parse(JSON.stringify(this.map.grid));
    }


    /**
     * Processes a single burning tile by spreading fire to neighboring tiles
     * and updating its burn status if its fuel is depleted.
     *
     * @param {Object} tile - The tile that is currently burning.
     * @param {Array} newGrid - The grid that will be updated with the new fire spread and burn status.
     * @param {number} x - The x-coordinate of the tile.
     * @param {number} y - The y-coordinate of the tile.
     *
     * @returns {number} - The number of tiles ignited as a result of this burning tile.
     */
    processBurningTile(tile, newGrid, x, y) {
        let spreadCount = 0;
        spreadCount += this.spreadFire(tile, newGrid);
        newGrid[y][x].fuel -= 1;
        if (newGrid[y][x].fuel <= 0) {
            newGrid[y][x].burnStatus = "burnt";
            console.log(`Tile (${x}, ${y}) is now burnt.`);
        }
        return spreadCount;
    }


    /**
     * Attempts to spread fire from a given burning tile to its neighboring tiles
     * based on each neighbor's flammability and burn status.
     *
     * @param {Object} tile - The tile that is burning and spreading fire.
     * @param {Array} grid - The current grid of tiles.
     *
     * @returns {number} - The number of neighboring tiles that caught fire.
     */
    spreadFire(tile, grid) {
        const neighbors = this.getNeighbors(tile.x, tile.y);
        let spreadCount = 0;

        for (const neighbor of neighbors) {
            const neighborTile = grid[neighbor.y][neighbor.x];

            // Extracted logic for checking neighbor's ability to ignite
            if (this.canIgnite(neighborTile)) {
                spreadCount += this.attemptIgnite(neighborTile);
            }
        }

        return spreadCount;
    }


    /**
     * Checks whether a neighboring tile can be ignited based on its burn status
     * and flammability.
     *
     * @param {Object} neighborTile - The neighboring tile to check.
     *
     * @returns {boolean} - Returns true if the tile can ignite, otherwise false.
     */
    canIgnite(neighborTile) {
        return neighborTile.burnStatus === "unburned" && neighborTile.flammability > 0;
    }


    /**
     * Attempts to ignite a neighboring tile based on a calculated ignition chance.
     * If the ignition chance is above the threshold, the tile's burn status is updated
     * to 'burning'.
     *
     * @param {Object} neighborTile - The neighboring tile to attempt to ignite.
     *
     * @returns {number} - Returns 1 if the tile ignited, otherwise 0.
     */
    attemptIgnite(neighborTile) {
        const ignitionChance = this.calculateIgnitionChance(neighborTile);
        console.log(`Ignition chance: ${ignitionChance}`);

        if (ignitionChance > 75) { // Threshold for testing
            neighborTile.burnStatus = "burning";
            return 1; // Indicates ignition
        }
        return 0; // No ignition
    }

    /**
     * Gets the coordinates of neighboring tiles around a given tile.
     * @param {number} x - The X coordinate of the tile.
     * @param {number} y - The Y coordinate of the tile.
     * @returns {Array} - An array of neighbor coordinates (objects with x and y properties).
     */
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


    /**
     * Calculates the chance that a neighboring tile will ignite based on its
     * flammability and the current weather conditions.
     *
     * @param {Object} tile - The tile to calculate ignition chance for.
     *
     * @returns {number} - The total ignition chance as a percentage.
     */
    calculateIgnitionChance(tile) {
        const baseChance = tile.flammability * 100; // Base chance from terrain
        const weatherInfluence = this.getWeatherInfluenceFromWeather(); // Refactored method

        console.log(`Base Chance: ${baseChance}, Weather Influence: ${weatherInfluence}`);

        const totalChance = baseChance + weatherInfluence;
        console.log(`Total Ignition Chance: ${totalChance}`);

        return totalChance;
    }


    /**
     * Retrieves the current weather's influence on fire spread by using the weather
     * object to calculate its impact on ignition chances.
     *
     * @returns {number} - The weather's influence on fire spread.
     */

    getWeatherInfluenceFromWeather() {
        return this.weather.getWeatherInfluence();
    }

}

export default FireSpread;
