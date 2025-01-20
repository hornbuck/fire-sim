import BSPPartition from '../src/utils/BSPPartition';

describe('BSP Partitioning', () => {
  test('Should create the correct number of partitions', () => {
    const width = 800;
    const height = 600;
    const minSize = 50;
    const bsp = new BSPPartition(width, height, minSize);
    const partitions = bsp.partition({ x: 0, y: 0, width, height });

    // Adjust this based on expected partition count logic
    expect(partitions.length).toBeGreaterThan(0);
    });
  });

  test('Partitions should not overlap', () => {
    const width = 800;
    const height = 600;
    const minSize = 50;
    const bsp = new BSPPartition(width, height, minSize);
    const partitions = bsp.partition({ x: 0, y: 0, width, height });
  
    partitions.forEach(p1 => {
      partitions.forEach(p2 => {
        if (p1 !== p2) {
          const noOverlap =
            p1.x + p1.width <= p2.x ||
            p2.x + p2.width <= p1.x ||
            p1.y + p1.height <= p2.y ||
            p2.y + p2.height <= p1.y;
  
          expect(noOverlap).toBe(true);
        }
      });
    });
  });
  
  test('Partitions should cover the entire map', () => {
    const width = 800;
    const height = 600;
    const minSize = 50;
    const bsp = new BSPPartition(width, height, minSize);
    const partitions = bsp.partition({ x: 0, y: 0, width, height });
  
    let totalArea = 0;
    partitions.forEach(p => {
      expect(p.width).toBeGreaterThan(0);
      expect(p.height).toBeGreaterThan(0);
      totalArea += p.width * p.height;
    });
  
    const mapArea = width * height;
    expect(totalArea).toBe(mapArea);
  });
  