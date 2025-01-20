/**
 * @file BSPPartition.js
 * @description Implements the Binary Space Partitioning (BSP) algorithm
 * to divide a 2D map grid into small regions, which can be used for
 * procedural map generation.
 */

export default class BSPPartition {
    /**
     * Creates an instance of BSPPartition.
     * @param {number} width - The width of the map grid.
     * @param {number} height - The height of the map grid.
     * @param {number} minSize - The minimum size of any partitioned region.
     */
    constructor(width, height, minSize) {
        this.width = width;
        this.height = height;
        this.minSize = minSize;
    }

    /**
     * Recursively partitions a rectangle into smaller regions using the BSP algorithm.
     * @param {Object} rect - The rectangle to partition.
     * @param {number} rect.x - The x-coordinate of the rectangle's starting point.
     * @param {number} rect.y - The y-coordinate of the rectangle's starting point.
     * @param {number} rect.width - The width of the rectangle.
     * @param {number} rect.height - The height of the rectangle.
     * @returns {Array<Object>} An array of partitioned rectangles.
     */
    partition(rect) {
        // Log the current rectangle being partitioned
        console.log(`Partitioning rect: x=${rect.x}, y=${rect.y}, width=${rect.width}, height=${rect.height}`);

        const partitions = [];

        // Base case: Stop partitioning if the rectangle's width or height is smaller than minSize
        if (rect.width <= this.minSize || rect.height <= this.minSize) {
            partitions.push(rect);
            return partitions;
        }

        // Randomly decide whether to split vertically or horizontally
        const splitVertical = Math.random() > 0.5;

        // Calculate the split point within the rectangle
        const maxSplit = splitVertical ? rect.width : rect.height;
        if (maxSplit <= this.minSize * 2) { // Ensure room for two valid partitions
            partitions.push(rect);
            return partitions;
        }

        const splitPoint = Math.floor(Math.random() * (maxSplit - this.minSize)) + this.minSize;

        // Create two new rectangles from the split
        const rect1 = splitVertical
        ? {x: rect.x, y: rect.y, width: splitPoint, height: rect.height}
        : {x: rect.x, y: rect.y, width: rect.width, height: splitPoint};

        const rect2 = splitPoint
        ? { x: rect.x + splitPoint, y: rect.y, width: rect.width - splitPoint, height: rect.height }
        : { x: rect.x, y: rect.y + splitPoint, width: rect.width, height: rect.height - splitPoint };

        // Validate rectangles before recursion
        if (rect1.width > this.minSize && rect1.height > this.minSize) {
            partitions.push(...this.partition(rect1));
        }
        if (rect2.width > this.minSize && rect2.height > this.minSize) {
            partitions.push(...this.partition(rect2));
        }

        return partitions;
    }

    /**
     * Visualizes the partitions by logging the rectangle boundaries to the console.
     */
    visualizePartitions() {
        const partitions = this.partition({x: 0, y: 0, width: this.width, height: this.height});
        console.log("Partitions:");
        partitions.forEach((partition, index) => {
            console.log(`Partition ${index + 1}: x=${partition.x}, y=${partition.y}, width: ${partition.width}, height: ${partition.height}`
            );
        });
    }
}