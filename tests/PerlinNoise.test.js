import { describe, it, expect } from 'vitest';
import PerlinNoise from '../src/utils/PerlinNoise.js';


describe('PerlinNoise', () => {
    it('should generate a grid with correct dimensions', () => {
        const width = 5;
        const height = 5;
        const perlin = new PerlinNoise(width, height);

        expect(perlin.noiseGrid.length).toBe(height);
        expect(perlin.noiseGrid[0].length).toBe(width);
    });

    it('should return consistent values for the same grid', () => {
        const perlin = new PerlinNoise(5, 5);
        const value = perlin.getNoise(2, 2);

        expect(value).toBeDefined();
        expect(perlin.getNoise(2, 2)).toBe(value); // Values should remain consistent
    });
});