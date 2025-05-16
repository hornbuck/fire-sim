class Weather {
    constructor(temperature = 68, humidity = 70, windSpeed = 0, windDirection = 'N') {
      // Initialize weather conditions with defaults
      // (Fahrenheit for temperature, mph for wind speed)
      this.temperature    = temperature;
      this.humidity       = humidity;
      this.windSpeed      = windSpeed;
      this.windDirection  = windDirection;
      this.ageHours       = 0;
    }
  
    updateOverTime(deltaSeconds) {
      // 1. Smooth diurnal swing for temperature:
      this.temperature = 50 + 20 * Math.sin(2 * Math.PI * (this.ageHours / 24));
      // 2. Inverse-humidity trend:
      this.humidity    = 80 - (this.temperature - 32) * 0.5;
      // 3. Wind as a random walk:
      this.windSpeed   = Phaser.Math.Clamp(
        this.windSpeed + Phaser.Math.FloatBetween(-2, 2),
        0, 50
      );
      // 4. Occasionally shift direction:
      if (Math.random() < 0.01) {
        this.windDirection = ['N','S','E','W'][Phaser.Math.Between(0,3)];
      }
      this.ageHours += deltaSeconds / 3600;
    }
  
    getRiskCategory() {
      const score = this.getWeatherInfluence();
      if (score < 3)   return 'low';
      if (score < 7)   return 'medium';
      return 'high';
    }
  
    // Calculate the influence of weather on fire spread
    getWeatherInfluence(direction = null) {
      let influence = 0;
  
      // stronger temp effect
      influence += (this.temperature - 32) * 0.10;
      // gentler humidity dampening
      influence -= this.humidity * 0.02;
      // wind is now a major driver
      influence += this.windSpeed * 0.5;
      // baseline bump so medium is default
      influence += 1.5;
  
      // extra boost if neighbor is downwind
      if (direction && direction === this.windDirection) {
        influence += this.windSpeed * 0.7;
      }
  
      return parseFloat(influence.toFixed(2));
    }
  }
  
  export default Weather;
  