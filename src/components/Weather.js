class Weather {
    constructor(temperature = 68, humidity = 70, windSpeed = 0) {
        // Initialize weather conditions with defaults
        // (Fahrenheit for temperature, mph for wind speed)
        this.temperature = temperature;  // Fahrenheit
        this.humidity = humidity;        // Percentage
        this.windSpeed = windSpeed;      // mph
    }

    // Update weather conditions
    updateWeather(temperature, humidity, windSpeed) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }

    // Calculate the influence of weather on fire spread
    getWeatherInfluence() {
        let influence = 0;

        // Temperature increases fire spread (higher temperature = higher fire chance)
        influence += (this.temperature - 32) * 0.05;  // Convert temperature to Celsius for calculation

        // Higher humidity dampens fire spread (higher humidity = less fire spread)
        influence -= this.humidity * 0.05;

        // Wind speed increases fire spread (higher wind speed = faster fire spread)
        influence += this.windSpeed * 0.2;

        return influence;
    }
}

export default Weather;
