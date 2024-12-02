import PerlinNoise3D from 'perlin-noise-3d'


export default class PerlinNoise {
    constructor(width, height, scale = 10, seed = Math.random()) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.perlin = new PerlinNoise3D(); // Initialize the Perlin noise generator
        this.perlin.noiseSeed(seed); // Apply the seed for deterministic noise
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
                const value = this.perlin.get( x / this.scale, y / this.scale, 0); // Generate 2D noise
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

