# **Wildfire Command (Sim Firefighter)**

Wildfire Command is a browser-based 2D simulation game designed to educate users on wildfire management strategies. Built with **Phaser 3**, the game provides an interactive experience modeling fire spread dynamics, environmental influences, and resource management. Players will engage with the challenges of wildfire suppression in a realistic, cell-based environment.

---

## **Table of Contents**

- [**Wildfire Command (Sim Firefighter)**](#wildfire-command-sim-firefighter)
  - [**Table of Contents**](#table-of-contents)
  - [**Overview**](#overview)
    - [**Purpose**](#purpose)
  - [**Features**](#features)
    - [**Current (v0.0.4)**](#current-v004)
    - [**Planned (Future Updates)**](#planned-future-updates)
  - [**Technical Design**](#technical-design)
    - [**Core Elements**](#core-elements)
    - [**Development Tools**](#development-tools)
  - [**Getting Started**](#getting-started)
    - [**Prerequisites**](#prerequisites)
    - [**Installation**](#installation)
  - [**Usage**](#usage)
  - [**v1.0 Vision**](#v10-vision)
  - [**License**](#license)

---

## **Overview**

### **Purpose**

Wildfire Command aims to bridge the gap between traditional wildfire training methods and experiential learning. The game emphasizes:

- Interactive simulation of wildfire behavior.
- Strategic resource allocation and management.
- Real-time decision-making under dynamic environmental conditions.

Designed as an educational tool, Sim Firefighter highlights the complexities of wildfire suppression and offers a hands-on approach to learning.

---

## **Features**

### **Current (v0.0.4)**

- **Interactive Resource Deployment:** Players can deploy firefighting assets such as helicopters and fire trucks, dynamically impacting fire spread.
- **Procedural Map Generation:** Utilizes Perlin Noise, BSP Partitioning, and Cellular Automata to generate diverse terrain types including water, trees, grass, and shrubs.
- **Dynamic Fire Spread:** Fires propagate realistically, influenced by terrain type and other factors.
- **Player Interaction:** Clickable resources allow users to take strategic actions on the map.

### **Planned (Future Updates)**

- **Advanced Fire Spreading:** Refine algorithms for terrain-specific fire behavior.
- **Advanced Terrain Features:** Refined terrain types with Cellular Automata.
- **Dynamic Weather Systems:** Incorporate environmental factors like wind, temperature, and humidity with visual cues.
- **Enhanced Leaderboards and Achievements:** Add detailed achievement tracking and real-time leaderboard updates.

---

## **Technical Design**

### **Core Elements**

1. **Map Generation**:
    - Uses procedural techniques (Perlin Noise, Binary Space Partitioning, and Cellular Automata) to generate diverse terrains.
    - Terrain types influence fire behavior, such as higher spread rates on dry grass.
2. **Fire Spread Simulation**:
    - Implements algorithms to model realistic fire propagation, accounting for environmental conditions and terrain attributes.
3. **Resource Management**:
    - Players deploy firefighting assets like helicopters and hotshot crews to suppress fires within defined ranges and cooldowns.
4. **Weather Systems**:
    - Variables such as wind direction and speed dynamically influence fire spread probability.

### **Development Tools**

- **Framework**: Phaser 3
- **Database**: Firebase Firestore for player data and leaderboards
- **IDE**: WebStorm
- **Hosting**: GitHub Pages or Firebase Hosting (if scalability is required)

---

## **Getting Started**

### **Prerequisites**

To run the project locally, ensure you have:

- [Node.js](https://nodejs.org) (v14 or later)
- A modern web browser (e.g., Chrome, Firefox, Edge)
- An IDE such as [WebStorm](https://www.jetbrains.com/webstorm/)

---

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/hornbuck/fire-sim.git
   cd fire-sim
   ```

2. Install dependencies (if applicable):

   ```bash
   npm install
   ```

3. Start a local server:
    - Using [live-server](https://www.npmjs.com/package/live-server):

      ```bash
      npx live-server
      ```

    - Alternatively, use your IDE's built-in server.

4. Open the game in your browser:
    - Navigate to `http://127.0.0.1:8080` or the URL provided by your server.
  
5. Run tests (if applicable):

   ```bash
   npm test
   ```

---

## **Usage**

- Use the sidebar to monitor placeholder resource information.
- Explore the grid map with various terrain types.
- Future updates will include interactivity, fire-spread mechanics, and weather simulations.

---

## **v1.0 Vision**

- Complete fire management simulation with advanced resource mechanics.
- Deploy a polished, educational game ready for public use.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

