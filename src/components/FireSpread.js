import TerrainTile from "./TerrainTile.js";

class FireSpread {
    /**
     * Creates an instance of the FireSpread class.
     * @param {Object} map - The map object that contains the grid of terrain tiles.
     * @param {Object} weather - The weather object that influences the fire spread.
     */
    constructor(map, weather) {
        this.map = map;       // The map object
        this.weather = weather; // Weather object
        console.log("Map object received: ", this.map)
        console.log("Weather object received:", this.weather);
    }


    /**
     * Simulates one step of fire spread on the map.
     * 
     * This method iterates through the grid to identify tiles that are burning at the start of the step, 
     * and then processes those tiles to spread the fire to neighboring tiles. The number of new tiles ignited 
     * during this step is logged to the console.
     * 
     * @returns {void} This method does not return any value. It updates the grid by spreading fire to adjacent tiles.
     */
    simulateFireStep() {
        const burningTiles = []; // Store tiles that were burning at start
    
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid[y][x];
    
                if (tile.burnStatus === "burning") {
                    burningTiles.push({ tile, x, y }); // Collect tiles that were burning
                }
            }
        }
    
        let spreadCount = 0;
    
        // Process only tiles that were burning at the start of this step
        burningTiles.forEach(({ tile, x, y }) => {
            spreadCount += this.processBurningTile(tile, this.map.grid, x, y);
        });
    
    }
    

    /**
     * Creates a deep copy of the current map's grid.
     * 
     * This method iterates through each row and tile in the map's grid, creating a new instance 
     * of the TerrainTile class for each tile to ensure that modifications to the copied grid 
     * do not affect the original grid.
     * 
     * @returns {Array<Array<TerrainTile>>} A 2D array representing the copied grid, where each element
     *          is a new instance of TerrainTile with the same properties (x, y, terrain) as the original tiles.
     */
    copyGrid() {
        return this.map.grid.map(row => 
            row.map(tile => new TerrainTile(tile.x, tile.y, tile.terrain))
        );
    }


    /**
     * Updates the sprite of a tile to reflect its burnt status.
     * 
     * This method checks if the specified tile has a sprite and, if so, replaces the sprite's texture 
     * with the corresponding texture for the burnt version of the tile's terrain.
     * 
     * @param {number} x - The x-coordinate of the tile to update.
     * @param {number} y - The y-coordinate of the tile to update.
     * @returns {void} This method does not return any value. It updates the sprite of the specified tile.
     */
    updateBurntTileSprite(x, y) {
        const tile = this.map.grid[y][x];
    
        if (tile && tile.sprite) {
            // Replace the sprite texture with the burned version
            tile.sprite.setTexture(tile.terrain); 
        }
    }
    

    /**
     * Processes a single burning tile by spreading fire to neighboring tiles,
     * updating the tile's burn status, and managing the fuel depletion and sprite updates.
     * If the tile's fuel is depleted, it will be marked as burnt, and its sprite will be updated.
     * A fire sprite, if present, will be extinguished after a brief delay, and the terrain type will change to reflect the burn.
     *
     * @param {Object} tile - The tile that is currently burning, containing its fuel, burn status, and fire sprite.
     * @param {Array} newGrid - The grid that will be updated with the new fire spread and burn status.
     * @param {number} x - The x-coordinate of the tile in the grid.
     * @param {number} y - The y-coordinate of the tile in the grid.
     *
     * @returns {number} - The number of neighboring tiles ignited as a result of the fire spreading from this tile.
     */
    processBurningTile(tile, newGrid, x, y) {
        let spreadCount = this.spreadFire(tile, x, y, newGrid);
    
        let curTile = newGrid[y][x];
    
        // Decrease fuel and check for burnt status
        tile.fuel = Math.max(0, curTile.fuel - 1); // Prevent negative fuel
    
    
        // If fuel is depleted, mark the tile as burnt
        if (tile.fuel === 0) {
            tile.burnStatus = "burnt";
    
            // Check if the tile has a fire sprite and extinguish it
            if (tile.fireS) {
                // Remove fire sprite
                setTimeout(() => { 
                    tile.fireS.extinguishFire(); 
                    
                    // Update tile terrain in order to show burnt sprite
                    if (tile.terrain === 'grass') {
                        tile.terrain = 'burned-grass';
                    } else if (tile.terrain === 'shrub') {
                        tile.terrain = 'burned-shrub';
                    } else if (tile.terrain === 'tree') {
                        tile.terrain = 'burned-tree';
                    }
            
                    // Update the tile's sprite to show it burned
                    this.updateBurntTileSprite(x, y);
            
                }, 2000); // 2 second delay
            }
            
    
            // Call function to update tile sprite
            this.updateBurntTileSprite(x, y);
        }
        return spreadCount;
    }
    
    
    /**
     * Attempts to spread fire from a given burning tile to its neighboring tiles
     * based on each neighbor's flammability and burn status.
     *
     * @param {number} x - The x coordinate of a tile that is burning and spreading fire.
     * @param {number} y - The y coordinate of a tile that is burning and spreading fire.
     * @param {Array} grid - The current grid of tiles.
     *
     * @returns {number} - The number of neighboring tiles that caught fire.
     */
    spreadFire(tile, x, y, grid) {
        const neighbors = this.getNeighbors(x, y);
        let spreadCount = 0;
    
        for (const neighbor of neighbors) {
            const neighborTile = grid[neighbor.y][neighbor.x];
    
            if (neighborTile.burnStatus !== "unburned") continue; // Skip already burning/burnt tiles
    
            if (this.canIgnite(neighborTile)) {
                const isDownwind = this.isTileDownwind({ x, y }, neighbor);
                spreadCount += this.attemptIgnite(neighborTile, isDownwind);
            }
        }
    
        return spreadCount;
    }
    
    /**
     * Determines if a neighboring tile is downwind of the given tile based on the current wind direction.
     * 
     * This method checks the relative position of the neighboring tile to the given tile and compares it with 
     * the wind direction. If the neighboring tile is in the direction the wind is blowing, it returns `true`, 
     * indicating that the fire will spread faster to that tile. If not, it returns `false`.
     * 
     * @param {TerrainTile} tile - The tile currently being processed for fire spread.
     * @param {TerrainTile} neighbor - The neighboring tile being checked for downwind status.
     * @returns {boolean} `true` if the neighboring tile is downwind and fire spreads faster toward it, 
     *          `false` otherwise.
     */
    isTileDownwind(tile, neighbor) {
        const { windDirection } = this.weather;
    
        if (windDirection === 'N' && neighbor.y < tile.y) return true; // Fire spreads faster southward
        if (windDirection === 'S' && neighbor.y > tile.y) return true; // Fire spreads faster northward
        if (windDirection === 'E' && neighbor.x > tile.x) return true; // Fire spreads faster westward
        if (windDirection === 'W' && neighbor.x < tile.x) return true; // Fire spreads faster eastward
    
        return false;
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
     * @param {boolean} isDownwind - Boolean check if tile is downwind of enabling tile
     *
     * @returns {number} - Returns 1 if the tile ignited, otherwise 0.
     */
    attemptIgnite(neighborTile, isDownwind) {
        if (neighborTile.burnStatus !== "unburned") return 0; // Prevent re-ignition
    
        let ignitionChance = this.calculateIgnitionChance(neighborTile);
    
        if (isDownwind) {
            ignitionChance += this.weather.windSpeed * 0.2;
        }
    
        if (ignitionChance > 75) {
            neighborTile.burnStatus = "burning";
            return 1;
        }
        return 0;
    }
    
    
    /**
     * Gets the coordinates of neighboring tiles around a given tile.
     * @param {number} x - The X coordinate of the tile.
     * @param {number} y - The Y coordinate of the tile.
     * @returns {Array} - An array of neighbor coordinates (objects with x and y properties).
     */
    getNeighbors(x, y) {
        const directions = [
            { x: -1, y: 0 }, // Left (West)
            { x: 1, y: 0 },  // Right (East)
            { x: 0, y: -1 }, // Up (North)
            { x: 0, y: 1 },  // Down (South)
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
        const weatherInfluence = this.getWeatherInfluenceFromWeather();

        const totalChance = baseChance + weatherInfluence;

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