import { describe, it, expect } from 'vitest';
import Map from '../src/components/MapGenerator.js';


describe('MapGenerator', () => {
    it('should create a grid with the correct dimensions', () => {
        const width = 5;
        const height = 5;
        const map = new Map(width, height);

        expect(map.grid.length).toBe(height); // Check number of rows
        expect(map.grid[0].length).toBe(width); // Check number of columns
    });

    it('should populate the grid with TerrainTile objects', () => {
        const map = new Map(5, 5);

        map.grid.forEach(row => {
            row.forEach(tile => {
                expect(tile).toHaveProperty('x');
                expect(tile).toHaveProperty('y');
                expect(tile).toHaveProperty('terrain');
                expect(tile).toHaveProperty('flammability');
                expect(tile).toHaveProperty('fuel');
            });
        });
    });

    it('should assign valid terrain types to tiles', () => {
        const map = new Map(5, 5);
        const validTerrains = ['grass', 'shrub', 'tree', 'water'];

        map.grid.forEach(row => {
            row.forEach(tile => {
                expect(validTerrains).toContain(tile.terrain); // Check if terrain type is valid
            });
        });
    });
});