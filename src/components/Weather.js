import { createNoise3D } from 'simplex-noise'

class Weather {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.noise3D = createNoise3D();
        this.globalTime = 0;     // seconds
        this.frontAngle = 0;     // degrees
        this.frontSpeed = 0.002; // Increased from 0.001 to 0.002 for faster weather changes
        
        // Add caching for weather calculations
        this.weatherCache = new Map();
        this.lastCacheClear = 0;
        this.CACHE_DURATION = 1000; // Clear cache every second
    }

    // caller passes dt in seconds
    tick(dt) {
        this.globalTime += dt;
        this.frontAngle = (this.frontAngle + this.frontSpeed * dt) % (2*Math.PI);
        
        // Clear cache periodically
        if (this.globalTime - this.lastCacheClear > this.CACHE_DURATION) {
            this.weatherCache.clear();
            this.lastCacheClear = this.globalTime;
        }
    }

    // Optimized 3D noise sampler with caching
    sample(fieldScale, tScale, x, y, t = this.globalTime) {
        const cacheKey = `${fieldScale},${tScale},${x},${y},${Math.floor(t/tScale)}`;
        if (this.weatherCache.has(cacheKey)) {
            return this.weatherCache.get(cacheKey);
        }
        const value = (this.noise3D(x/fieldScale, y/fieldScale, t/tScale) + 1)/2;
        this.weatherCache.set(cacheKey, value);
        return value;
    }

    getLocalWeather(x, y) {
        // Check cache first
        const cacheKey = `${x},${y},${Math.floor(this.globalTime/1000)}`;
        if (this.weatherCache.has(cacheKey)) {
            return this.weatherCache.get(cacheKey);
        }

        // tile‑noise
        const nT = this.sample(50, 1000, x, y);
        let temp = 60 + nT * 40;           // 60–100°F
        
        // FORCE HIGH HUMIDITY FOR TESTING
        let humidity = 80;  // Force high humidity
        
        // Wind calculation with more variation
        const nW = this.sample(40, 600, x, y);
        let windSpeed = nW * 40;

        // Wind direction calculation with more variation
        const baseDirNoise = this.sample(50, 1000, x, y);
        const rawDir = baseDirNoise * 2*Math.PI;
        const mixed = rawDir * 0.6 + this.frontAngle * 0.4;
        const dirs = ['N','E','S','W'];
        const windDirection = dirs[Math.floor((mixed % (2*Math.PI)) / (Math.PI/2))];

        const result = { temperature: temp, humidity, windSpeed, windDirection };
        this.weatherCache.set(cacheKey, result);
        return result;
    }

    // Optimized weather influence calculation
    getWeatherInfluence(local) {
        const cacheKey = `influence_${local.humidity}_${local.temperature}_${local.windSpeed}`;
        if (this.weatherCache.has(cacheKey)) {
            return this.weatherCache.get(cacheKey);
        }
        
        const drought = (100 - local.humidity) * (local.temperature/100);
        const windF = Math.pow(local.windSpeed, 1.5);
        const result = (drought * 0.8 + windF * 0.2) * 0.6;  // Increased drought weight and overall influence
        
        this.weatherCache.set(cacheKey, result);
        return result;
    }

    // Optimized global risk calculation
    getGlobalRisk() {
        const cacheKey = `risk_${Math.floor(this.globalTime/1000)}`;
        if (this.weatherCache.has(cacheKey)) {
            return this.weatherCache.get(cacheKey);
        }
        
        const center = this.getLocalWeather(this.width/2, this.height/2);
        const dryness = Math.pow((100 - center.humidity) / 100, 1.5);  // Increased power for more sensitivity
        const heat = Math.pow((center.temperature - 60) / 40, 1.3);    // Increased power for more sensitivity
        const gust = Math.pow(Math.min(1, center.windSpeed / 30), 1.4); // Increased power and wind threshold
        
        const result = Phaser.Math.Clamp(0.6*dryness + 0.25*heat + 0.15*gust, 0, 1);  // Adjusted weights
        this.weatherCache.set(cacheKey, result);
        return result;
    }
}

export default Weather;
