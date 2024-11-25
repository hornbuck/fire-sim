import SimplexNoise from "simplex-noise";


export default class PerlinNoise {
    constructor(seed = Math.random()) {
        // Initialize the SimplexNoise generator with an optional seed
        this.simplex = new SimplexNoise(seed);
    }

    /**
     * Generate a 2D Perlin Noise value for the given coordinates.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} scale - Scaling factor for the noise (default: 10).
     * @returns {number} A noise value between -1 and 1.
     */
    getNoise(x, y, scale = 10) {
        return this.simplex.noise2D(x / scale, y / scale);
    }

    /**
     * Generate a grid of Perlin Noise values
     * @param {number} width - Width of the grid.
     * @param {number} height - Height of the grid.
     * @param {number} scale - Scaling factor for the noise (default: 10).
     * @returns {number[][]} A 2D array of noise values.
     */
    generateNoiseGrid(width, height, scale = 10) {
        const grid = [];
        for (let y = 0; y < height; y++) {
            const row = []
            for (let x = 0; x < width; x++) {
                row.push(this.getNoise(x, y, scale));
            }
            grid.push(row);
        }
        return grid;
    }
}