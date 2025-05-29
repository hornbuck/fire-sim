import { describe, it, expect, beforeEach } from 'vitest'
import MapGenerator from '../../src/components/MapGenerator.js'

describe('MapGenerator', () => {
    let generator
    const width = 20
    const height = 20

    beforeEach(() => {
        generator = new MapGenerator({ width, height })
    })

    it('should generate a grid with correct dimensions', () => {
        const grid = generator.generate()
        expect(grid.length).toBe(height)
        expect(grid[0].length).toBe(width)
    })

    it('should assign each tile a terrain type', () => {
        const grid = generator.generate()
        const allTilesHaveType = grid.flat().every(tile => typeof tile.type === 'string' && tile.type.length > 0)
        expect(allTilesHaveType).toBe(true)
    })

    it('should assign flammability and spreadRate to each tile', () => {
        const grid = generator.generate()
        for (const row of grid) {
        for (const tile of row) {
            expect(typeof tile.flammability).toBe('number')
            expect(typeof tile.spreadRate).toBe('number')
        }
        }
    })

    it('should generate different terrain values with Perlin Noise', () => {
        const grid1 = generator.generate()
        const generator2 = new MapGenerator({ width, height })
        const grid2 = generator2.generate()

        // Compare a few random samples from both
        const sameTileCount = grid1.flat().filter((tile, i) => tile.type === grid2.flat()[i].type).length
        const total = width * height
        const ratio = sameTileCount / total

        // If more than 80% are the same, it's probably broken
        expect(ratio).toBeLessThan(0.8)
    })
})
