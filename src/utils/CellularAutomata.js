/**
 * @file CellularAutomata.js
 * @description Applies cellular automata rules to refine terrain generation by smoothing transitions
 *              between terrain types and creating natural-looking neighborhoods with houses.
 */

export default class CellularAutomata {
    /**
     * Applies cellular automata rules to refine terrain transitions.
     * @param {Array<Array<TerrainTile>>} grid - The 2D map grid.
     * @returns {Array<Array<TerrainTile>>} - The modified grid with smoothed terrain.
     */
    static apply(grid) {
        const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid

        // First pass: Basic terrain smoothing
        for (let y = 1; y < grid.length - 1; y++) {
            for (let x = 1; x < grid[0].length - 1; x++) {
                const neighbors = this.getNeighborCounts(grid, x, y);
                if (grid[y][x].terrain.includes('house')) continue;

                if (neighbors.tree > 4) {
                    newGrid[y][x].terrain = 'tree';
                } else if (neighbors.grass > 5) {
                    newGrid[y][x].terrain = 'grass';
                } else if (neighbors.water > 5) {
                    newGrid[y][x].terrain = 'water';
                }
            }
        }

        // Improved: Dense, structured neighborhood generation
        this.seedAndGrowNeighborhoods(newGrid);

        // Add paths & landscaping around house clusters
        this.createNeighborhoods(newGrid);

        return newGrid;
    }

    /**
     * Creates tight house clusters for each seeded neighborhood.
     */
    static seedAndGrowNeighborhoods(grid) {
        const numNeighborhoods = 5;
        const minSize = 6;
        const maxSize = 10;
        let attempts = 0;

        for (let i = 0; i < numNeighborhoods && attempts < 50; i++) {
            let found = false;
            while (!found && attempts < 50) {
                const x = Math.floor(Math.random() * grid[0].length);
                const y = Math.floor(Math.random() * grid.length);
                const tile = grid[y][x];
                const neighbors = this.getNeighborCounts(grid, x, y);

                if (tile.terrain === 'grass' && neighbors.water === 0) {
                    const size = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
                    this.growNeighborhood(grid, x, y, size);
                    found = true;
                }
                attempts++;
            }
        }
    }

    /**
     * Grows a house cluster with cross-shaped bias.
     */
    static growNeighborhood(grid, startX, startY, size) {
        const queue = [{ x: startX, y: startY }];
        const visited = new Set();
        let count = 0;

        const key = (x, y) => `${x},${y}`;

        while (queue.length > 0 && count < size) {
            const { x, y } = queue.shift();
            if (
                x >= 0 && y >= 0 &&
                y < grid.length && x < grid[0].length &&
                grid[y][x].terrain === 'grass' &&
                !visited.has(key(x, y))
            ) {
                grid[y][x].terrain = 'grass-house';
                visited.add(key(x, y));
                count++;

                // Cross-directional bias
                const directions = this.shuffle([
                    { dx: 0, dy: -1 }, // Up
                    { dx: 0, dy: 1 },  // Down
                    { dx: -1, dy: 0 }, // Left
                    { dx: 1, dy: 0 },  // Right
                ]);

                for (const { dx, dy } of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (!visited.has(key(nx, ny))) {
                        queue.push({ x: nx, y: ny });
                    }
                }
            }
        }
    }

    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static createNeighborhoods(grid) {
        const houseTiles = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x].terrain.includes('house')) {
                    houseTiles.push({ x, y, tile: grid[y][x] });
                }
            }
        }

        const neighborhoods = this.clusterHouses(houseTiles);
        neighborhoods.forEach(neighborhood => {
            this.enhanceNeighborhood(grid, neighborhood);
        });
    }

    static clusterHouses(houseTiles) {
        if (houseTiles.length === 0) return [];

        const neighborhoods = [];
        const assigned = new Set();
        const proximityThreshold = 5;

        houseTiles.forEach((house, idx) => {
            if (assigned.has(idx)) return;

            const neighborhood = [house];
            assigned.add(idx);

            houseTiles.forEach((otherHouse, otherIdx) => {
                if (idx === otherIdx || assigned.has(otherIdx)) return;

                const distance = Math.sqrt(
                    Math.pow(house.x - otherHouse.x, 2) +
                    Math.pow(house.y - otherHouse.y, 2)
                );

                if (distance <= proximityThreshold) {
                    neighborhood.push(otherHouse);
                    assigned.add(otherIdx);
                }
            });

            neighborhoods.push(neighborhood);
        });

        return neighborhoods;
    }

    static enhanceNeighborhood(grid, neighborhood) {
        if (neighborhood.length <= 1) return;

        for (let i = 0; i < neighborhood.length - 1; i++) {
            this.createPath(grid, neighborhood[i], neighborhood[i + 1]);
        }

        neighborhood.forEach(house => {
            this.addLandscaping(grid, house);
        });
    }

    static createPath(grid, house1, house2) {
        let [x0, y0] = [house1.x, house1.y];
        let [x1, y1] = [house2.x, house2.y];

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            if ((x0 !== house1.x || y0 !== house1.y) && (x0 !== house2.x || y0 !== house2.y)) {
                if (y0 >= 0 && y0 < grid.length && x0 >= 0 && x0 < grid[y0].length) {
                    const tile = grid[y0][x0];
                    if (tile && tile.terrain !== 'water' && !tile.terrain.includes('house')) {
                        if (Math.random() < 0.7) {
                            tile.terrain = 'grass';
                        }
                    }
                }
            }

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    static addLandscaping(grid, house) {
        const radius = 2;
        for (let y = house.y - radius; y <= house.y + radius; y++) {
            for (let x = house.x - radius; x <= house.x + radius; x++) {
                if (x === house.x && y === house.y) continue;
                if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length) {
                    const tile = grid[y][x];
                    if (tile && tile.terrain !== 'water' && !tile.terrain.includes('house')) {
                        if (Math.random() < 0.6) {
                            tile.terrain = 'grass';
                        }
                    }
                }
            }
        }
    }

    static getNeighborCounts(grid, x, y) {
        const counts = {
            tree: 0,
            grass: 0,
            shrub: 0,
            water: 0,
            'dirt-house': 0,
            'grass-house': 0,
            'sand-house': 0
        };

        const neighbors = [
            grid[y - 1]?.[x - 1], grid[y - 1]?.[x], grid[y - 1]?.[x + 1],
            grid[y]?.[x - 1],                     grid[y]?.[x + 1],
            grid[y + 1]?.[x - 1], grid[y + 1]?.[x], grid[y + 1]?.[x + 1]
        ];

        neighbors.forEach(tile => {
            if (tile) {
                if (counts[tile.terrain] !== undefined) {
                    counts[tile.terrain]++;
                } else {
                    counts[tile.terrain] = 1;
                }
            }
        });

        return counts;
    }
}
