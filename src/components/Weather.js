class Weather {
    constructor(temperature = 68, humidity = 50, windSpeed = 6.2) {
        // Initial weather conditions, with defaults (Fahrenheit for temperature, mph for wind speed)
        this.temperature = temperature;    // Fahrenheit
        this.humidity = humidity;          // Percentage
        this.windSpeed = windSpeed;        // mph
    }

    // Method to update weather conditions, possibly based on a game clock or events
    updateWeather(temperature, humidity, windSpeed) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }

    // Get the fire influence based on weather (simplified calculation for now)
    getFireInfluence() {
        let influence = 0;

        // Temperature influences fire spread (higher temperature = higher fire chance)
        influence += (this.temperature - 32) * 0.05;  // Convert temperature to Celsius for the calculation

        // Humidity dampens fire spread (higher humidity = less fire spread)
        influence -= this.humidity * 0.05;  // Simple humidity dampening

        // Wind speed increases fire spread (higher wind speed = faster fire spread)
        influence += this.windSpeed * 0.2;  // Wind spreads fire

        return influence;
    }
}

export default Weather;
