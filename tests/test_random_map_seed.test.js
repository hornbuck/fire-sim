import { describe, it, expect } from 'vitest';
import PerlinNoise from '../src/utils/PerlinNoise.js';

describe('PerlinNoise Seed Randomness', () => {
    it('should generate different noise grids on consecutive instances', () => {
        const width = 10;
        const height = 10;

        const noiseInstance1 = new PerlinNoise(width, height);
        const noiseGrid1 = noiseInstance1.noiseGrid;

        const noiseInstance2 = new PerlinNoise(width, height);
        const noiseGrid2 = noiseInstance2.noiseGrid;

        let differences = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (noiseGrid1[y][x] !== noiseGrid2[y][x]) {
                    differences++;
                }
            }
        }

        expect(differences).toBeGreaterThan(0);
    });
});
