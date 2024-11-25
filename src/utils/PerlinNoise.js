import { Noise } from 'noisejs';


export default class PerlinNoise {
    constructor(width, height, scale = 10) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.noise = new Noise(Math.random()); // Seeded noise generator
        this.noiseGrid = this.generateNoiseGrid();
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
                const value = this.noise.perlin2( x / this.scale, y / this.scale);
                row.push(value);
            }
            grid.push(row);
        }
        return grid;
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

