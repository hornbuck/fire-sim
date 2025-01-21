# **Sim Firefighter**

Sim Firefighter is a browser-based 2D simulation game designed to educate users on wildfire management strategies. Built with **Phaser 3**, the game provides an interactive experience modeling fire spread dynamics, environmental influences, and resource management. Players will engage with the challenges of wildfire suppression in a realistic, cell-based environment.

---

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Design](#technical-design)
4. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
5. [Usage](#usage)
6. [Roadmap](#roadmap)
7. [License](#license)

---

## **Overview**

### **Purpose**

Sim Firefighter aims to bridge the gap between traditional wildfire training methods and experiential learning. The game emphasizes:

- Interactive simulation of wildfire behavior.
- Strategic resource allocation and management.
- Real-time decision-making under dynamic environmental conditions.

Designed as an educational tool, Sim Firefighter highlights the complexities of wildfire suppression and offers a hands-on approach to learning.

---

## **Features**

### **Current (v0.0.2)**

- **Basic Map Layout**:
    - A grid-based map generated procedurally using Perlin noise, featuring placeholder tiles representing different terrains (e.g., dry grass, forest, and open land).
- **Static Resource Icons**:
    - Placeholder icons for firefighting resources, statically displayed on map tiles.
- **Basic UI (HUD/Sidebar)**:
    - Sidebar displays placeholder resource information (e.g., "Water: 0/5").
    - Clicking of each resource icon has been implementated
    - New tooltips and cursor images when resources are activated
- **Detailed Sprites**
    - Dynamic fire sprite with special effects
    - Sprites for different tile types
- **GitHub Pages**
    - Launched on GitHub pages
  


### **Planned (Future Updates)**

- **Interactive Resource Deployment**:
    - Players will allocate resources such as helicopters and fire trucks to suppress fires dynamically.
- **Fire Spread Mechanics**:
    - Fire propagation influenced by terrain, weather, and resource management.
- **Weather Systems**:
    - Dynamic environmental factors like wind, temperature, and humidity affecting fire behavior.
- **Leaderboards and Achievements**:
    - Track player performance with achievements and real-time leaderboards.

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

---

## **Usage**

- Use the sidebar to monitor placeholder resource information.
- Explore the grid map with various terrain types.
- Future updates will include interactivity, fire-spread mechanics, and weather simulations.

---

## **Roadmap**

### **v0.1 Goals**

- Implement interactive resource deployment mechanics.
- Add fire-spreading mechanics influenced by terrain type.

### **v0.2 Goals**

- Add dynamic weather systems that affect fire behavior.
- Enhance the HUD to display real-time updates.

### **v1.0 Vision**

- Complete fire management simulation with advanced resource mechanics.
- Deploy a polished, educational game ready for public use.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
