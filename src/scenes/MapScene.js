import Map from '../components/MapGenerator.js';
import FireSpread from '../components/FireSpread.js';
import Weather from '../components/Weather.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
        this.tileSize = 32;
        this.elapsedTime = 0;
        this.isFireSimRunning = false;
    }

    preload() {
        this.load.image('water', 'assets/64x64-Map-Tiles/water.png');
        this.load.image('grass', 'assets/64x64-Map-Tiles/grass.png');
        this.load.image('shrub', 'assets/64x64-Map-Tiles/Shrubs/shrubs-on-sand.png');
        this.load.image('tree', 'assets/64x64-Map-Tiles/Trees/trees-on-light-dirt.png');
    }

    create() {
        console.log("MapScene Created");
        this.initializeMap();

        // Start UI scene separately
        this.scene.launch('UIScene');

        // Handle tile interactions
        this.input.on('pointerdown', this.handleTileClick, this);
    }

    initializeMap() {
        this.map = new Map(10, 10, 5);
        this.weather = new Weather(68, 30, 15, 'N');
        this.fireSpread = new FireSpread(this.map, this.weather);
        this.renderMap();
        this.startFire();
    }

    renderMap() {
        this.mapGroup = this.add.group();
        this.map.grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                let sprite = this.add.sprite(x * this.tileSize, y * this.tileSize, tile.terrain)
                    .setOrigin(0);
                tile.sprite = sprite;
                sprite.setInteractive();
                sprite.on('pointerdown', () => {
                    console.log(`Clicked on ${tile.terrain} at (${x}, ${y})`);
                });
                this.mapGroup.add(sprite);
            });
        });
    }

    handleTileClick(pointer) {
        let tileX = Math.floor(pointer.x / this.tileSize);
        let tileY = Math.floor(pointer.y / this.tileSize);

        if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
            let clickedTile = this.map.getTile(tileX, tileY);
            console.log(clickedTile ? `Tile found: ${clickedTile.terrain}` : "No tile found at this position!");

            if (clickedTile) {
                this.scene.get('UIScene').events.emit('tileInfo', clickedTile);
            }
        }
    }

    update(time, delta) {
        this.elapsedTime += delta / 1000;

        if (this.isFireSimRunning && this.elapsedTime - this.lastFireSpreadTime >= 3) {
            this.lastFireSpreadTime = this.elapsedTime;
            this.fireSpread.simulateFireStep();
            this.updateWeatherOverTime();

            this.scene.get('UIScene').events.emit('weatherUpdated', this.weather);
        }
    }

    updateWeatherOverTime() {
        let tempChange = Phaser.Math.Between(-2, 2);
        let windChange = Phaser.Math.Between(-1, 1);
        let humidityChange = Phaser.Math.Between(-3, 3);

        this.weather.updateWeather(
            this.weather.temperature + tempChange,
            Phaser.Math.Clamp(this.weather.humidity + humidityChange, 0, 100),
            Phaser.Math.Clamp(this.weather.windSpeed + windChange, 0, 100),
            this.weather.windDirection
        );

        this.scene.get('UIScene').events.emit('weatherUpdated', this.weather);
    }

    startFire() {
        let startX, startY, tile;

        do {
            startX = Math.floor(Math.random() * this.map.width);
            startY = Math.floor(Math.random() * this.map.height);
            tile = this.map.grid[startY][startX];
        } while (tile.flammability === 0);

        tile.burnStatus = "burning";
        console.log(`Starting fire at (${startX}, ${startY})`);
    }

    toggleFireSimulation() {
        this.isFireSimRunning = !this.isFireSimRunning;
        this.scene.get('UIScene').events.emit('fireSimToggled', this.isFireSimRunning);
    }
}
