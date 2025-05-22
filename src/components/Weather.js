class Weather {
    constructor(temperature = 68, humidity = 70, windSpeed = 10, windDirection = 'N') {
      // Initialize weather conditions with defaults
      // (Fahrenheit for temperature, mph for wind speed)
      this.temperature    = temperature;
      this.humidity       = humidity;
      this.windSpeed      = windSpeed;
      this.windDirection  = windDirection;
      this.ageHours       = 0;
    }
  
  updateOverTime(deltaSeconds) {
    this.temperature = parseFloat((50 + 20 * Math.sin(2 * Math.PI * (this.ageHours / 24))).toFixed(1));
    this.humidity    = parseFloat((80 - (this.temperature - 32) * 0.5).toFixed(1));
    this.windSpeed   = parseFloat(Phaser.Math.Clamp(
      this.windSpeed + Phaser.Math.FloatBetween(-2, 2),
      0, 30
    ).toFixed(1));

    if (Math.random() < 0.01) {
      this.windDirection = ['N','S','E','W'][Phaser.Math.Between(0,3)];
    }

    this.ageHours += deltaSeconds / 3600;
    this.ageHours = parseFloat(this.ageHours.toFixed(2));
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
  