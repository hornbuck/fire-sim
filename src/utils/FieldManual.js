const fieldManualContent = `
🔥 WILDFIRE CONTROL FIELD MANUAL 🔥

TERRAIN TYPES & BEHAVIOR
-----------------------
🌳 Trees
- Low flammability (0.3)
- High fuel content (6)
- Burns slowly but intensely
- Includes: Dirt House 🏠 (flammability 5, fuel 4)
- Best controlled with: Smokejumpers, Hotshot Crews, Airtankers

🌿 Shrubs
- High flammability (2.5)
- Medium fuel content (4)
- Moderate burn rate
- Includes: Sand House 🏠 (flammability 3, fuel 6)
- Best controlled with: Firetrucks

🌱 Grass
- Medium flammability (0.8)
- Low fuel content (2)
- Burns quickly
- Includes: Grass House 🏠 (flammability 7, fuel 4)
- Best controlled with: Water Hoses (2 fuel), Fire Extinguishers (1 fuel)

💧 Water
- No flammability or fuel
- Natural firebreak

FIREFIGHTING RESOURCES
---------------------
💧 Water Hose
- Reduces 2 fuel per use
- Single tile range
- Quick deployment, short cooldown

🧯 Fire Extinguisher
- Reduces 1 fuel per use
- Single tile range
- Extremely fast, lowest cost

🚒 Firetruck
- Reduces 3 fuel per use
- Single tile range
- Strong vs shrubs and shrub-structures

🚁 Helicopter
- Extinguishes fire across 5 tiles (cross pattern)
- Does not reduce fuel, just extinguishes

✈️ Airtanker
- Extinguishes 5-tile line (horizontal or vertical)
- Great for clearing dense fire paths

👥 Hotshot Crew
- Converts 5-tile line into firebreaks
- Must be placed on unburned terrain

🪂 Smokejumpers
- Parachute in to extinguish a burning tile
- Rapid response to hot zones

STRATEGIC TIPS
-------------
1. Create firebreaks AHEAD of the fire
2. Use terrain and water to slow spread
3. Prioritize saving structures
4. Watch wind direction closely
5. Coordinate multiple assets for best results

Press 'F' to close manual
`;

export default fieldManualContent;
