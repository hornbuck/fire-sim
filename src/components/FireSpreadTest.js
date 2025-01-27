import Map from "./MapGenerator.js";
import Weather from "./Weather.js";
import FireSpread from "./FireSpread.js";

console.log("=== Fire Spread Simulation Test ===");

// Create a map and weather object
const map = new Map(10, 10); // A 10x10 grid map
const weather = new Weather(15, 40, 30); // temperature: 15°F, humidity: 40%, windSpeed: 30 mph

// Log initial map state
console.log("Initial Map:");
map.printMap();

// Initialize fire spread simulation
const fireSpread = new FireSpread(map, weather);

// Ignite a starting tile
const startX = Math.floor(Math.random() * map.width);
const startY = Math.floor(Math.random() * map.height);
map.grid[startY][startX].burnStatus = "burning";
console.log(`\nStarting fire at (${startX}, ${startY})\n`);

// Run fire spread simulation for a fixed number of steps
const steps = 100;
for (let step = 1; step <= steps; step++) {
    console.log(`--- Step ${step} ---`);
    fireSpread.simulateFireStep();
    map.printBurnStatusMap();
}

console.log("=== Simulation Complete ===");
