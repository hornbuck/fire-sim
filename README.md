# **Wildfire Command - Alpha v0.1.2**

---

## **Table of Contents**

- [**Wildfire Command - Alpha v0.1.2**](#wildfire-command---alpha-v012)
  - [**Table of Contents**](#table-of-contents)
  - [**Overview**](#overview)
    - [**Purpose**](#purpose)
  - [**Features**](#features)
    - [**Current (Alpha v0.1.2)**](#current-alpha-v012)
    - [**Planned (Future Updates)**](#planned-future-updates)
  - [**Technical Design**](#technical-design)
    - [**Core Elements**](#core-elements)
    - [**Development Tools**](#development-tools)
  - [**Getting Started**](#getting-started)
    - [**Prerequisites**](#prerequisites)
    - [**Installation**](#installation)
  - [**Usage**](#usage)
  - [**Game Mechanics**](#game-mechanics)
    - [**Terrain Types**](#terrain-types)
    - [**Fire Spread**](#fire-spread)
    - [**Firefighting Resources**](#firefighting-resources)
    - [**Weather System**](#weather-system)
  - [**License**](#license)

---

## **Overview**

### **Purpose**

Wildfire Command is a 2D browser-based simulation game designed to educate users on wildfire management strategies. Built with Phaser 3, it provides an interactive experience modeling fire spread dynamics, environmental influences, and resource management. Players will engage with the challenges of wildfire suppression in a realistic, cell-based environment.

This alpha release (v0.1.2) introduces foundational game mechanics, including procedural terrain generation with houses, dynamic fire behavior influenced by weather conditions, and strategic resource deployment options.

---

## **Features**

### **Current (Alpha v0.1.2)**

- **Interactive Resource Deployment:** Deploy firefighting assets such as helicopters, fire trucks, hotshot crews, and more to combat fires.
- **Enhanced Procedural Map Generation:** Using Perlin Noise, BSP Partitioning, and Cellular Automata to generate diverse terrain types including water, trees, grass, shrubs, and houses.
- **Dynamic Fire Spread:** Fires propagate realistically, influenced by terrain type, weather conditions, and natural barriers.
- **Weather System:** Changing wind direction and speed affect fire spread patterns. The simulation also models temperature variations and humidity levels that influence overall fire risk.
- **Resource Shop:** Purchase additional firefighting resources using points earned from extinguishing fires.
- **Deployed Version Available** Hosted via [GitHub Pages](https://hornbuck.github.io/fire-sim/)

### **Planned (Future Updates)**

- **Enhanced Leaderboards and Achievements:** Detailed achievement tracking and real-time leaderboard updates.
- **Educational Content:** More tooltips and information about real-world wildfire management strategies.
- **Mobile Support:** Enhanced mobile experience with touch controls.
- **Accessibility Features:** Additional options for color blindness, text-to-speech, and other accessibility needs.

---

## **Technical Design**

### **Core Elements**

1. **Map Generation**:
    - Uses procedural techniques (Perlin Noise, Binary Space Partitioning, and Cellular Automata) to generate diverse terrains.
    - Terrain types influence fire behavior, such as higher spread rates on dry grass.
    - Houses are strategically placed throughout the map for players to protect.
2. **Fire Spread Simulation**:
    - Implements algorithms to model realistic fire propagation, accounting for environmental conditions and terrain attributes.
    - Incorporates wind direction and speed to create natural spreading patterns.
    - Suppression mechanics allow strategic firefighting responses.
3. **Resource Management**:
    - Players deploy firefighting assets like helicopters and hotshot crews to suppress fires within defined ranges.
    - Each resource has unique capabilities, costs, and cooldowns.
    - Earn coins by successfully extinguising fires to purchase more resources.
4. **Weather Systems**:
    - Variables such as wind direction and speed dynamically influence fire spread probability.
    - Risk levels change based on weather conditions, requiring adaptive strategies.

### **Development Tools**

- **Framework**: Phaser 3
- **Backend:** Firebase (Authentication & Firestore)
- **Bundling:** Webpack
- **Testing:** Vitest
- **Hosting:** GitHub Pages

---

## **Getting Started**

### **Prerequisites**

To run the project locally, ensure you have:

- [Node.js](https://nodejs.org) (v14 or later)
- A modern web browser (e.g., Chrome, Firefox, Edge)
- An IDE such as [WebStorm](https://www.jetbrains.com/webstorm/) or [VS Code](https://code.visualstudio.com/)

---

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/hornbuck/fire-sim.git
   cd fire-sim
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start a local development server:

      ```bash
      npm run start
      ```

4. Open the game in your browser:
    - Navigate to `http://127.0.0.1:8080` or the URL provided by your server.
  
5. Run tests:

   ```bash
   npm test
   ```

6. Build for production:

   ```bash
   npm run build
   ```

---

## **Usage**

- **Starting Out:** Click on the "Play" button to start the game immediately or use the "Tutorial" button to learn the basics.
- **Resource Management:** Use the sidebar to select and deploy firefighting resources.
- **Fire Control:** Click on burning tiles to deploy your selected resource and extinguish fires.
- **Shop:** Purchase additional resources with coins earned by extinguishing fires.
- **Map Navigation:** Use the arrow buttons at the bottom of the screen to navigate the map and the zoom buttons to adjust your view.

---

## **Game Mechanics**

### **Terrain Types**

- **Grass:** Highly flammable, burns quickly.
- **Shrub:** Moderately flammable, burns longer than grass.
- **Tree:** Less flammable than grass or shrubs but has more fuel for longer burns.
- **Water:** Not flammable, acts as a natural barrier.
- **Houses:** High value targets to protect, can be destroyed by fire.

### **Fire Spread**

- Fires spread based on terrain type, wind direction, wind speed, and other environmental factors.
- Higher wind speeds increase the rate and distance of fire spread.
- Wind direction affects which neighboring tiles are more likely to catch fire.

### **Firefighting Resources**

- **Fire Hose:** Basic resource for extinguishing single fires.
- **Fire Extinguisher:** Quick deployment for small fires.
- **Helicopter:** Aerial drops affecting a cross pattern of 5 tiles.
- **Air Tanker:** Drops fire retardant in a horizontal line affecting 5 tiles.
- **Hotshot Crew:** Elite firefighters who can create firebreaks and battle flames directly.
- **Smokejumpers:** Parachutes into remote areas to fight fires where other resources can't reach.

### **Weather System**

- **Wind Direction:** Determines the primary direction of fire spread (N, S, E, W). Fires spread more aggressively in the downwind direction.
- **Wind Speed:** Directly affects the probability and distance of fire spreading. Higher wind speeds significantly increase fire propagation rates.
- **Risk Level:** Combines weather factors to indicate overall fire danger level (Low, Medium, High), which scales the base spread probability.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
