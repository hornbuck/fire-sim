const fieldManualContent = `
🔥 WILDFIRE CONTROL FIELD MANUAL 🔥

TERRAIN TYPES & BEHAVIOR
-----------------------
🌳 Trees
- Low flammability
- High fuel content (6)
- Burns slowly but intensely
- Includes: Dirt House 🏠 (fuel 6)
- Best controlled with: Smokejumpers, Hotshot Crews, Airtankers

🌿 Shrubs
- High flammability
- Medium fuel content (4)
- Moderate burn rate
- Includes: Sand House 🏠 (fuel 4)
- Best controlled with: Firetrucks

🌱 Grass
- Medium flammability
- Low fuel content (2)
- Burns quickly
- Includes: Grass House 🏠 (fuel 2)
- Best controlled with: Water Hoses, Fire Extinguishers

💧 Water
- No flammability or fuel
- Natural firebreak

FIREFIGHTING RESOURCES
---------------------
💧 Water Hose
- Reduces 3 fuel per use
- Single tile range
- Fast deployment, short cooldown
- May require multiple uses on high-fuel terrain

🧯 Fire Extinguisher
- Reduces 2 fuel per use
- Single tile range
- Extremely fast, lowest cost
- Best for light fuels like grass

🚒 Firetruck
- Reduces 4 fuel per use
- Single tile range
- Strong vs shrubs and most structures

🚁 Helicopter
- Instantly extinguishes 5 tiles in a cross pattern
- Ignores fuel amount — guaranteed to put out fire
- Best for clustered fires

✈️ Airtanker
- Instantly extinguishes a 5-tile line (horizontal or vertical)
- Bypasses fuel — great for fire lines or dense terrain

👥 Hotshot Crew
- Converts 5-tile line into firebreaks
- Must be deployed on unburned, flammable terrain
- Prevents future spread, does not extinguish

🪂 Smokejumpers
- Instantly extinguish a single burning tile
- Always successful regardless of fuel
- Ideal for remote or high-priority targets


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
