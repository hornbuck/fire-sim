import { noise } from './perlin.js';

export default class PerlinNoise {
    constructor(width, height, scale = 10, seed = Math.random()) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        // Convert seed to a number if it's not already
        const numericSeed = typeof seed === 'string' ? this.stringToNumber(seed) : seed;

        // Seed the noise generator
        noise.seed(numericSeed);

        // Generate the noise grid
        this.noiseGrid = this.generateNoiseGrid();
    }

    stringToNumber(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 1000; // Scale hash to a usable seed range
    }

    /**
     * Generate a 2D Perlin Noise grid.
     * @returns {number[][]} A 2D array of noise values.
     */
    generateNoiseGrid() {
        const grid = []
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const value = noise.perlin2(x / this.scale, y / this.scale);
                row.push(value);
            }
            grid.push(row);
        }
        return grid;
    }

    /**
     * Update the seed and regenerate the noise grid.
     * @param {number/string} newSeed - The new seed value.
     */
    setSeed(newSeed) {
        const numericSeed = typeof newSeed === 'string' ? this.stringToNumber(newSeed) : newSeed;
        noise.seed(numericSeed);
        this.noisGrid = this.generateNoiseGrid();
    }

    /**
     * Get the noise value for specific coordinates.
     * @param {number} x - The x-coordinate;
     * @param {number} y - The y-coordinate;
     * @returns {number} The noise value.
     */
    getNoise(x, y) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            throw new RangeError('Coordinates out of bounds');
        }
        return this.noiseGrid[y][x];
    }
}

