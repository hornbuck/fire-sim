import { generateBSPPartitions } from '../src/components/MapGenerator';

describe('BSP Partitioning', () => {
  test('Should create the correct number of partitions', () => {
    const mapSize = { width: 800, height: 600 };
    const partitions = generateBSPPartitions(mapSize, 4);
    expect(partitions.length).toBe(4);
  });

  test('Partitions should not overlap', () => {
    const mapSize = { width: 800, height: 600 };
    const partitions = generateBSPPartitions(mapSize, 4);

    // Check for overlap
    for (let i = 0; i < partitions.length; i++) {
      for (let j = i + 1; j < partitions.length; j++) {
        const p1 = partitions[i];
        const p2 = partitions[j];
        const noOverlap = (
          p1.x + p1.width <= p2.x ||
          p2.x + p2.width <= p1.x ||
          p1.y + p1.height <= p2.y ||
          p2.y + p2.height <= p1.y
        );
        expect(noOverlap).toBe(true);
      }
    }
  });

  test('Partitions should cover the entire map', () => {
    const mapSize = { width: 800, height: 600 };
    const partitions = generateBSPPartitions(mapSize, 4);

    let totalArea = 0;
    partitions.forEach(part => {
      totalArea += part.width * part.height;
    });

    const mapArea = mapSize.width * mapSize.height;
    expect(totalArea).toBe(mapArea);
  });
});
