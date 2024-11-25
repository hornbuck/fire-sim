import { describe, it, expect } from 'vitest';
import TerrainTile from '../src/components/TerrainTile';


describe('TerrainTile', () => {
    it('should initialize with correct coordinates and terrain', () => {
        const tile = new TerrainTile(2, 3, 'grass');

        expect(tile.x).toBe(2);
        expect(tile.y).toBe(3);
        expect(tile.terrain).toBe('grass');
        expect(tile.burnStatus).toBe('unburned');
    });

    it('should assign correct attributes for grass', () => {
        const tile = new TerrainTile(2, 3, 'grass');

        expect(tile.flammability).toBe(0.9);
        expect(tile.fuel).toBe(1);
    });

    it('should assign correct attributes for shrub', () => {
        const tile = new TerrainTile(2, 3, 'shrub');

        expect(tile.flammability).toBe(0.7);
        expect(tile.fuel).toBe(2);
    });

    it('should assign correct attributes for tree', () => {
        const tile = new TerrainTile(2, 3, 'tree');

        expect(tile.flammability).toBe(0.4);
        expect(tile.fuel).toBe(3);
    });

    it('should assign correct attributes for water', () => {
        const tile = new TerrainTile(2, 3, 'water');

        expect(tile.flammability).toBe(0);
        expect(tile.fuel).toBe(0);
    });

    it('should handle invalid terrain types gracefully', () => {
        const tile = new TerrainTile(2, 3, 'lava'); // Invalid terrain type

        expect(tile.flammability).toBe(0);
        expect(tile.fuel).toBe(0);
    });
});