/**
 * @file CellularAutomata.js
 * @description Applies cellular automata rules to refine terrain generation by smoothing transitions
 *              between terrain types. This module processes a procedurally generated grid and adjusts
 *              terrain based on neighboring tiles to create more natural, organic landscapes.
 */

export default class CellularAutomata {
    /**
     * Applies cellular automata rules to refine terrain transitions.
     * @param {Array<Array<TerrainTile>>} grid - The 2D map grid.
     * @returns {Array<Array<TerrainTile>>} - The modified grid with smoothed terrain.
     */
    static apply(grid) {
        const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid

        for (let y = 1; y < grid.length - 1; y++) {
            for (let x = 1; x < grid[0].length - 1; x++) {
                let neighbors = this.getNeighborCounts(grid, x, y);
                
                if (neighbors.tree > 4){
                    newGrid[y][x].terrain = 'tree'; // Dense forest
                } else if (neighbors.grass > 5) {
                    newGrid[y][x].terrain = 'grass'; // Open area
                } else if (neighbors.water > 5) {
                    newGrid[y][x].terrain = 'water'; // Water
                }
            }
        }

        return newGrid;
    }

    /**
     * Counts terrain types in the neighboring tiles.
     * @param {Array<Array<TerrainTile>>} grid - The 2D map grid.
     * @param {number} x - The x-coordinate of the tile.
     * @param {number} y - The y-coordinate of the tile.
     * @returns {Object} - The count of each terrain type.
     */
    static getNeighborCounts(grid, x, y) {
        let counts ={
            tree: 0,
            grass: 0,
            shrub: 0,
            water: 0
        }
        const neighbors = [
            grid[y - 1][x - 1], grid[y - 1][x], grid[y - 1][x + 1],
            grid[y][x - 1], grid[y][x + 1],
            grid[y + 1][x - 1], grid[y + 1][x], grid[y + 1][x + 1]
        ];

        neighbors.forEach(tile => {
            if (tile) counts[tile.terrain]++;
        });

        return counts;
    }
}