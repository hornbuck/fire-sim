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
                    burningTiles.push({ tile, x, y });
                }
            }
        }
    
        let spreadCount = 0;
    
        // Process only tiles that were burning at the start of this step
        burningTiles.forEach(({ tile, x, y }) => {
            const localWeather = this.weather.getLocalWeather(x, y);
            const newSpreads = this.processBurningTile(tile, this.map.grid, x, y, localWeather);
            spreadCount += newSpreads;
        });
    
        return spreadCount;
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
     * Updates the sprite of a tile to reflect its current status (burnt or extinguished).
     * 
     * @param {number} x - The x-coordinate of the tile to update.
     * @param {number} y - The y-coordinate of the tile to update.
     * @returns {void} This method does not return any value. It updates the sprite of the specified tile.
     */
    updateSprite(tileOrX, y) {
        let tile;
        
        // Support both calling patterns:
        // updateSprite(tile) or updateSprite(x, y)
        if (typeof tileOrX === 'object') {
            // Called with a tile object
            tile = tileOrX;
        } else {
            // Called with x, y coordinates
            if (this.map && this.map.grid && y >= 0 && y < this.map.grid.length && 
                tileOrX >= 0 && tileOrX < this.map.grid[y].length) {
                tile = this.map.grid[y][tileOrX];
            } else {
                // Invalid coordinates
                console.warn("FireSpread: Invalid coordinates for updateSprite");
                return;
            }
        }
        
        // Check if the tile, its sprite, and the sprite's scene are all valid
        if (tile && tile.sprite && tile.sprite.scene && tile.sprite.scene.sys) {
            try {
                // Set the texture based on the current terrain type
                tile.sprite.setTexture(tile.terrain);
            } catch (error) {
                console.warn("FireSpread: Error updating tile sprite texture", error);
            }
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
    processBurningTile(tile, grid, x, y, localWeather) {
        let spreadCount = this.spreadFire(tile, x, y, grid, localWeather);
    
        // Decrease fuel and check for burnt status
        tile.fuel = Math.max(0, tile.fuel - 1);
        console.log(`Tile at (${x}, ${y}) fuel reduced to ${tile.fuel}`);
    
        // If fuel is depleted, mark the tile as burnt
        if (tile.fuel === 0) {
            console.log(`Tile at (${x}, ${y}) fuel depleted, marking as burnt`);
            tile.burnStatus = "burnt";
    
            if (tile.fireS) {
                tile.fireS.extinguishFire(); 
                
                if (tile.terrain === 'grass') {
                    tile.terrain = 'burned-grass';
                } else if (tile.terrain === 'shrub') {
                    tile.terrain = 'burned-shrub';
                } else if (tile.terrain === 'tree') {
                    tile.terrain = 'burned-tree';
                }
        
                this.updateSprite(x, y);
            }
        }

        // Check for crown fire in trees
        if (tile.terrain === 'tree' && 
            tile.fuel <= (tile.initialFuel/2) && 
            !tile._crownFired) {
            console.log(`Crown fire triggered at (${x}, ${y})`);
            tile._crownFired = true;
            // 2-tile radius burst
            spreadCount += this.spreadFire(tile, x, y, grid, localWeather, 2, 50);
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
    spreadFire(tile, x, y, grid, localWeather, radius = 1, sourceBonus = 0) {
        const neighbors = this.getNeighbors(x, y, radius);
        console.log(`Found ${neighbors.length} neighbors within radius ${radius} of (${x}, ${y})`);
        let spreadCount = 0;
        
        for (const neighbor of neighbors) {
            const neighborTile = grid[neighbor.y][neighbor.x];
        
            if (neighborTile.burnStatus !== "unburned") {
                console.log(`Skipping already burning/burnt tile at (${neighbor.x}, ${neighbor.y})`);
                continue;
            }
        
            if (this.canIgnite(neighborTile)) {
                const isDownwind = this.isTileDownwind({ x, y }, neighbor, localWeather.windDirection);
                console.log(`Attempting to ignite tile at (${neighbor.x}, ${neighbor.y}), downwind: ${isDownwind}`);
                const ignited = this.attemptIgnite(neighborTile, isDownwind, sourceBonus, localWeather);
                if (ignited) {
                    console.log(`Successfully ignited tile at (${neighbor.x}, ${neighbor.y})`);
                    spreadCount++;
                }
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
    isTileDownwind(src, nbr, windDirection) {
        if (windDirection === 'N' && nbr.y < src.y) return true;
        if (windDirection === 'S' && nbr.y > src.y) return true;
        if (windDirection === 'E' && nbr.x > src.x) return true;
        if (windDirection === 'W' && nbr.x < src.x) return true;
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
    attemptIgnite(neighborTile, isDownwind, sourceBonus, localWeather) {
        let base = this.calculateIgnitionChance(neighborTile, localWeather);
        
        // Apply downwind bonus (reduced from 0.2 to 0.1)
        if (isDownwind) {
            base += localWeather.windSpeed * 0.1;
        }
        
        // Apply source bonus (reduced from 20 to 10 for crown fires)
        base += sourceBonus * 0.5;
        
        // Tree penalty (increased from 40 to 50)
        if (neighborTile.terrain === 'tree') {
            base = Math.max(0, base - 50);
        }
        
        // Add random variation to make spread less predictable
        base *= (0.8 + Math.random() * 0.4);
        
        const roll = Math.random() * 100;
        if (roll < base) {
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
    getNeighbors(x, y, radius = 1) {
        const neighbors = [];
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx === 0 && dy === 0) continue; // Skip center tile
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < this.map.width && ny >= 0 && ny < this.map.height) {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }
        return neighbors;
    }
    

    /**
     * Calculates the chance that a neighboring tile will ignite based on its
     * flammability and the current weather conditions.
     *
     * @param {Object} tile - The tile to calculate ignition chance for.
     *
     * @returns {number} - The total ignition chance as a percentage.
     */
    calculateIgnitionChance(tile, localWeather) {
        let total = tile.flammability * 30; // Reduced from 50 to 30
        total += this.weather.getWeatherInfluence(localWeather) * 0.3; // Reduced from 0.5 to 0.3
        return total;
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