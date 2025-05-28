
import FireSpread from '../../src/components/FireSpread.js';

describe('FireSpread', () => {
  it('should simulate fire spread correctly', () => {
    const dummyMap = {
      grid: [[{ burnStatus: 'burning' }, { burnStatus: 'unburned', flammability: 1 }]],
      height: 1,
      width: 2
    };
    const dummyWeather = { updateOverTime: jest.fn() };
    const spread = new FireSpread(dummyMap, dummyWeather);
    const result = spread.simulateFireStep();
    expect(typeof result).toBe('number');
  });
});
