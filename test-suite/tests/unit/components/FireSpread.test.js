import FireSpread from '../../src/components/FireSpread.js'

describe('FireSpread', () => {
  let map, weather, spread

  beforeEach(() => {
      map = {
        width: 3,
        height: 1,
        grid: [
          [
            { burnStatus: 'burning', flammability: 1 },   // fire source
            { burnStatus: 'unburned', flammability: 1 },  // should catch
            { burnStatus: 'unburned', flammability: 0 }   // should not catch
          ]
        ]
      }

      weather = {
        getSpreadModifier: () => 1,
        updateOverTime: vi.fn()
      }

      spread = new FireSpread(map, weather)
    })

    it('returns number of new tiles set to burning', () => {
      const count = spread.simulateFireStep()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('sets adjacent flammable unburned tiles to burning', () => {
      spread.simulateFireStep()
      expect(map.grid[0][1].burnStatus).toBe('burning')
    })

    it('does not burn tiles with 0 flammability', () => {
      spread.simulateFireStep()
      expect(map.grid[0][2].burnStatus).toBe('unburned')
    })

    it('calls weather update function', () => {
      spread.simulateFireStep()
      expect(weather.updateOverTime).toHaveBeenCalled()
    })
})
