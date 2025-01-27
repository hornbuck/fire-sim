// BSPPartition.js
/**
 * Represents a node in the Binary Space Partitioning tree.
 * Each node has coordinates, dimensions, and references to its child nodes.
 */
class BSPNode {
    /**
     * Creates a new BSPNode instance.
     * @param {number} x - The x-coordinate of the node's top-left corner.
     * @param {number} y - The y-coordinate of the node's top-left corner.
     * @param {number} width - The width of the node.
     * @param {number} height - The height of the node.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = null;
        this.right = null;
    }

    /**
     * Checks if the node is a leaf (i.e., has no children).
     * @returns {boolean} - True if the node has no children, false otherwise.
     */
    isLeaf() {
        return this.left === null && this.right === null;
    }
}

/**
 * Implements a Binary Space Partitioning (BSP) algorithm.
 * Used to recursively divide a space into smaller partitions.
 */
class BSPPartition {
    /**
     * Creates a new BSPPartition instance.
     * @param {number} width - The width of the entire space to partition.
     * @param {number} height - The height of the entire space to partition.
     * @param {number} minPartitionSize - The minimum allowable size for a partition.
     */
    constructor(width, height, minPartitionSize) {
        this.root = new BSPNode(0, 0, width, height);
        this.minPartitionSize = minPartitionSize;
    }

    /**
     * Attempts to partition a given node into two child nodes.
     * @param {BSPNode} [node=this.root] - The node to partition.
     * @returns {boolean} - True if the partition was successful, false otherwise.
     */
    partition(node = this.root) {
        if (!node.isLeaf()) {
            return false; // Already partitioned
        }

        if (node.width <= this.minPartitionSize || node.height <= this.minPartitionSize) {
            return false; // Too small to partition
        }

        let splitHorizontally = Math.random() > 0.5;
        if (node.width > node.height && node.width / node.height >= 1.25) {
            splitHorizontally = false;
        } else if (node.height > node.width && node.height / node.width >= 1.25) {
            splitHorizontally = true;
        }

        const max = (splitHorizontally ? node.height : node.width) - this.minPartitionSize;
        if (max <= this.minPartitionSize) {
            return false; // No valid split
        }

        const split = Math.floor(Math.random() * (max - this.minPartitionSize + 1) + this.minPartitionSize);
        const remaining = (splitHorizontally ? node.height : node.width) - split;

        if (split < this.minPartitionSize || remaining < this.minPartitionSize) {
            return false; // Ensure both partitions meet size constraint
        }

        if (splitHorizontally) {
            node.left = new BSPNode(node.x, node.y, node.width, split);
            node.right = new BSPNode(node.x, node.y + split, node.width, node.height - split);
        } else {
            node.left = new BSPNode(node.x, node.y, split, node.height);
            node.right = new BSPNode(node.x + split, node.y, node.width - split, node.height);
        }

        console.log(`Partitioned node at (${node.x}, ${node.y}, ${node.width}, ${node.height})`);
        console.log(`Left: (${node.left.x}, ${node.left.y}, ${node.left.width}, ${node.left.height})`);
        console.log(`Right: (${node.right.x}, ${node.right.y}, ${node.right.width}, ${node.right.height})`);

        return true;
    }

    /**
     * Recursively partitions all nodes in the tree starting from the given node.
     * @param {BSPNode} [node=this.root] - The node to begin partitioning from.
     */
    partitionAll(node = this.root) {
        if (!this.partition(node)) {
            return;
        }

        this.partitionAll(node.left);
        this.partitionAll(node.right);
    }

    /**
     * Retrieves all leaf nodes (partitions) in the tree.
     * @param {BSPNode} [node=this.root] - The node to start retrieving from.
     * @param {BSPNode[]} [partitions=[]] - The array to store the retrieved partitions.
     * @returns {BSPNode[]} - An array of all leaf nodes.
     */
    getPartitions(node = this.root, partitions = []) {
        if (node.isLeaf()) {
            partitions.push(node);
        } else {
            if (node.left) this.getPartitions(node.left, partitions);
            if (node.right) this.getPartitions(node.right, partitions);
        }

        return partitions;
    }

    /**
     * Visualizes the partitions in the tree by logging them to the console.
     */
    visualizePartitions() {
        const partitions = this.getPartitions();
        console.log("Visualizing Partitions:");
        partitions.forEach((partition, index) => {
            console.log(
                `Partition ${index + 1}: (${partition.x}, ${partition.y}, ${partition.width}, ${partition.height})`
            );
        });
    }
}

export default BSPPartition;
