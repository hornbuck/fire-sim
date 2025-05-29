import { describe, it, expect } from 'vitest'
import { noise } from 'noisejs'
import TerrainTile from '../../../components/TerrainTile.js'

describe('TerrainTile logic', () => {
    it('returns valid terrain type for Perlin values', () => {
        for (let v = -1; v <= 1; v += 0.1) {
        const type = TerrainTile.getTerrainType(v)
        expect(typeof type).toBe('string')
        expect(type.length).toBeGreaterThan(0)
        }
    })

    it('produces varied terrain types with Perlin Noise', () => {
        const width = 20, height = 20
        const terrainTypes = new Set()

        for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = noise.perlin2(x / 10, y / 10)
            terrainTypes.add(TerrainTile.getTerrainType(value))
        }
        }

        expect(terrainTypes.size).toBeGreaterThan(2)
    })
})
