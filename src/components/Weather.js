class Weather {
    constructor(temperature = 20, humidity = 50, windSpeed = 10, windDirection = 0) {
        // Initial weather conditions, with defaults
        this.temperature = temperature;    // Celsius
        this.humidity = humidity;          // Percentage
        this.windSpeed = windSpeed;        // km/h
        this.windDirection = windDirection; // Degrees, 0 = north, 90 = east, etc.
    }

    // Method to update weather conditions, possibly based on a game clock or events
    updateWeather(temperature, humidity, windSpeed, windDirection) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.windDirection = windDirection;
    }

    // Get the fire influence based on weather (simplified calculation for now)
    getFireInfluence() {
        let influence = 0;

        // Temperature influences fire spread (higher temperature = higher fire chance)
        influence += this.temperature * 0.1;  // Simple temperature multiplier

        // Humidity dampens fire spread (higher humidity = less fire spread)
        influence -= this.humidity * 0.05;  // Simple humidity dampening

        // Wind speed increases fire spread (higher wind speed = faster fire spread)
        influence += this.windSpeed * 0.2;  // Wind spreads fire

        // Wind direction could affect fire spread later, but let's keep it simple for now
        // We'll add it as a directional modifier if needed for fire directionality

        return influence;
    }

    // Optional: You could add methods to simulate weather changes over time, if needed
}

export default Weather;