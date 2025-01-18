import { technique } from './ui.js'

// Lights a blaze on a terrain tile and makes fire clickable
export function lightFire(scene, sprite) {
    scene.anims.create({
        key: "fireAnimConfig",
        frames: scene.anims.generateFrameNumbers('fire-blaze'),
        frameRate: 10,
        repeat: -1
    });
    let fireSprite = scene.add.sprite(sprite.x + 16, sprite.y, 'fire-blaze').setDepth(1).setScale(0.75,0.75);
    fireSprite.play('fireAnimConfig');

    // Make fire clickable to extinguish later
    fireSprite.setInteractive();
    fireSprite.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (technique === 'WATER') {
                fireSprite.destroy();
            }
        },
        this
    );
}

class FireSpread {
    constructor(map, weather) {
        this.map = map; // The map object
        this.weather = weather; // Weather object
        console.log("Weather object received:", this.weather);
    }

    // Simulate one step of fire spread
    simulateFireStep() {
        const newGrid = JSON.parse(JSON.stringify(this.map.grid)); // Copy the grid
        let spreadCount = 0; // Count how many new tiles ignite

        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                const tile = this.map.grid[y][x];
                if (tile.burnStatus === "burning") {
                    console.log(`Tile (${x}, ${y}) is burning.`);
                    // Spread fire to neighbors
                    spreadCount += this.spreadFire(tile, newGrid);

                    // Update burn status to burnt if fuel is exhausted
                    newGrid[y][x].fuel -= 1;
                    if (newGrid[y][x].fuel <= 0) {
                        newGrid[y][x].burnStatus = "burnt";
                        console.log(`Tile (${x}, ${y}) is now burnt.`);
                    }
                }
            }
        }

        console.log(`${spreadCount} tiles ignited this step.`);
        this.map.grid = newGrid; // Update the map's grid with new fire states
    }

    spreadFire(tile, grid) {
        const neighbors = this.getNeighbors(tile.x, tile.y);
        let spreadCount = 0;

        for (const neighbor of neighbors) {
            const neighborTile = grid[neighbor.y][neighbor.x];

            // Ensure neighbor tile is unburned and flammable
            if (neighborTile.burnStatus === "unburned" && neighborTile.flammability > 0) {
                console.log(`Checking ignition for neighbor (${neighbor.x}, ${neighbor.y})`);

                // Get the ignition chance considering weather influence
                const ignitionChance = this.calculateIgnitionChance(neighborTile);  // Use calculated chance here
                console.log(`Ignition chance for neighbor (${neighbor.x}, ${neighbor.y}): ${ignitionChance}`);

                if (ignitionChance > 75) { // Lowered threshold for testing
                    neighborTile.burnStatus = "burning";
                    console.log(`Neighbor (${neighbor.x}, ${neighbor.y}) ignited!`);
                    spreadCount++;
                }
            }
        }

        console.log(`${spreadCount} tiles ignited this step.`);
        return spreadCount;
    }

    // Get neighboring tiles' coordinates
    getNeighbors(x, y) {
        const directions = [
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
        ];

        return directions
            .map(dir => ({ x: x + dir.x, y: y + dir.y }))
            .filter(
                neighbor =>
                    neighbor.x >= 0 &&
                    neighbor.x < this.map.width &&
                    neighbor.y >= 0 &&
                    neighbor.y < this.map.height
            );
    }

    calculateIgnitionChance(tile) {
        const baseChance = tile.flammability * 100; // Base chance from terrain
        const weatherInfluence = this.calculateWeatherInfluence();

        console.log(`Base Chance: ${baseChance}, Weather Influence: ${weatherInfluence}`);

        const totalChance = baseChance + weatherInfluence;
        console.log(`Total Ignition Chance: ${totalChance}`);

        return totalChance;
    }

    // Calculate weather influence on fire spread
    calculateWeatherInfluence() {
        const { windSpeed, humidity, temperature } = this.weather;
        let influence = 0;

        // Simplified weather effects
        influence += windSpeed * 10; // Higher wind speeds increase fire spread
        influence -= humidity * 5;  // Higher humidity reduces fire spread
        influence += (temperature - 20) * 2; // Hotter temperatures increase fire spread

        return Math.max(0, influence); // Ensure no negative influence
    }
}

export default FireSpread;

