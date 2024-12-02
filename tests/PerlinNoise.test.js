import { describe, it, expect } from 'vitest';
import PerlinNoise from '../src/utils/PerlinNoise.js';

describe('PerlinNoise Tests', () => {
    it('should generate a grid with correct dimensions', () => {
        const width = 10;
        const height = 10;
        const scale = 5;
        const perlin = new PerlinNoise(width, height, scale);

        expect(perlin.noiseGrid.length).toBe(height);
        expect(perlin.noiseGrid[0].length).toBe(width);
    });

    it('should return consistent values for the same coordinates', () => {
        const perlin = new PerlinNoise(10, 10, 5, 'seed123');
        const value1 = perlin.getNoise(2, 2);

        // Check if the same coordinates always return the same value
        const value2 = perlin.getNoise(2, 2);
        expect(value1).toBe(value2);
    });

    it('should throw an error for out-of-bounds coordinates', () => {
        const perlin = new PerlinNoise(5, 5);

        expect(() => perlin.getNoise(-1, 0)).toThrow(RangeError);
        expect(() => perlin.getNoise(0, -1)).toThrow(RangeError);
        expect(() => perlin.getNoise(5, 0)).toThrow(RangeError);
        expect(() => perlin.getNoise(0, 5)).toThrow(RangeError);
    });

    it('should produce values between -1 and 1', () => {
        const perlin = new PerlinNoise(10, 10, 5);

        perlin.noiseGrid.forEach(row => {
            row.forEach(value => {
                expect(value).toBeGreaterThanOrEqual(-1);
                expect(value).toBeLessThanOrEqual(1);
            });
        });
    });

});
