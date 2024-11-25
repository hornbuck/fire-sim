import { generatePerlinNoise } from 'perlin-noise';


export default class PerlinNoise {
    constructor(width, height, scale = 10) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.noiseGrid = this.generateNoiseGrid();
    }

    /**
     * Generate a 2D Perlin Noise grid.
     * @returns {number[][]} A 2D array of noise values.
     */
    generateNoiseGrid() {
        const flatNoise = generatePerlinNoise(this.width * this.height, { octaveCount: 4, persistence: 0.5 });
        const grid = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const index = y * this.width + x;
                row.push(flatNoise[index] * this.scale);
            }
            grid.push(row);
        }
        return grid;
    }


    /**
     * Get the noise value for specific coordinates.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {number} The noise value.
     */
    getNoise(x, y) {
        return this.noiseGrid[x][y];
    }
}