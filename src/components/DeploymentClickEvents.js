import AnimatedSprite from '../components/AnimatedSprites.js';
import { all_assets, bank, n_cooldown, out_hoses, out_extinguishers, out_helicopters, out_firetrucks, out_airtankers, out_hotshots, out_smokejumpers } from './ui.js';
import { t_hose, t_extinguisher, t_firetruck, t_helicopter, t_airtanker, t_hotshotcrew, t_smokejumpers_plane, t_smokejumpers_ground } from '../components/AnimatedSprites.js';
import { getHose, setHose, getExtinguisher, setExtinguisher, getHelicopter, setHelicopter, getFiretruck, setFiretruck, getAirtanker, setAirtanker, getHotshotCrew, setHotshotCrew, getSmokejumpers, setSmokejumpers} from "./assetValues.js";
import { paused } from '../scenes/MapScene.js';

// Global vars to track which technique is currently active and whether their cooldown is active
export let technique = "";
export let activated_resource = "none";
export let mode = "cursor";

// stash a pending deployment until direction is picked
let pendingDeployment = null;

// listen for user's choice
export function initDirectionHandler(mapScene) {
    const ui = mapScene.scene.get('UIScene');
    ui.events.on('directionChosen', dir => {
        if (dir === null) {
            pendingDeployment = null;
            console.log("Deployment canceled by user.");
            return;  // Fully cancel deployment
        }

        if (!pendingDeployment) return;
        const { scene, x, y, fireSprite } = pendingDeployment;
        pendingDeployment = null;
        use_resource(scene, x, y, fireSprite, dir);
    });
}

function isValidFireBreakTile(tile) {
    const unmodifiableTerrains = ['water', 'burned-grass', 'burned-shrub', 'burned-tree', 'burned-grass-house', 'burned-sand-house', 'burned-dirt-house'];
    return tile && 
           tile.burnStatus !== 'burning' &&
           tile.burnStatus !== 'burnt' &&
           !unmodifiableTerrains.includes(tile.terrain);
}


// Global cooldown variable
// --> This is an array where each index represents an asset, in the following order:
// -----> 0: firehose
// -----> 1: fire extinguisher
// -----> 2: helicopter
// -----> 3: firetruck
// -----> 4: airtanker
// -----> 5: hotshot crew
// -----> 6: smokejumpers
// ### When each index value is set to 1, that means the cooldown is in effect.
// ### The index value is set back to 0 when the cooldown is done.
export let cooldown = [0, 0, 0, 0, 0, 0, 0];

// These are all of the global limits for all the resources

//* Player Bank Limits
export let coins = 0;

// These are the cooldowns for all the resources (in ms)
let c_hose = 3000;
let c_extinguisher = 500;
let c_helicopter = 7000;
let c_firetruck = 5000;
let c_airtanker = 10000;
let c_hotshotcrew = 3000;
let t_smokejumper = 15000;

export const assetCoinValues = {
    hose: 100,
    extinguisher: 50,
    helicopter: 300,
    firetruck: 200,
    airtanker: 500,
    'hotshot-crew': 300,
    smokejumper: 1000
};

// Get the number of coins (useful for external files)
export function getCoins() {
    return coins;
}

// Set the number of coins (useful for external files)
export function setCoins(value) {
    coins -= value;
    
    if (coins < 0) {
        coins += value;
        return false;
    }

    return true;
}

// Updates text of asset limits
export function set_text(text, x, y, scene) {
    const textObj = scene.add.text(x, y, text, {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: '#FFFFFF',
        align: 'center',
        backgroundColor: '#333333',
        padding: { x: 6, y: 4 }
    }).setOrigin(0.5, 0.5);
    
    // Add background
    const bg = scene.add.rectangle(
        x,
        y,
        textObj.width + 12,
        textObj.height + 8,
        0x333333,
        0.7
    ).setOrigin(0.5).setDepth(textObj.depth - 1);
    
    return textObj;
}

// This function is called by activate_resource (below), in order to deactivate resources that are already active
// This way, only one asset is activated at a time.
export function deactivate(sprites) {
    for (let i = 0; i <= 6; i++) {
        let asset = sprites[i];
        if (`${activated_resource}` === asset.name) {
            asset.setTexture(asset.name);
            technique = "NO-WATER";
            activated_resource = "none";
        }
    }    
}

function reduceFuelAndMaybeExtinguish(tile, fireSprite, scene, amount = 1) {
    const originalFuel = tile.fuel;
    tile.fuel = Math.max(0, tile.fuel - amount);

    if (tile.fuel === 0) {
        const reward = assetCoinValues[activated_resource] || 0;
        coins += reward;
        bank.setText(`${coins}`);
        scene.events.emit('extinguishFire', fireSprite);
    } else if (originalFuel > amount) {
        // 🔥 New notification to clarify partial suppression
        show_notification(scene, "🔥 Not enough power to fully extinguish fire!");
    }
}



function extinguishTile(tile, tileX, tileY, mapScene) {
    if (
        !tile ||
        !tile.sprite ||
        tile.burnStatus === "extinguished" ||
        // tile.burnStatus === "burned"
        tile.burnStatus === "burnt"
    ) return;

    if (tile.burnStatus === "burning") {
        // Award coins for extinguishing a burning tile
        const reward = assetCoinValues[activated_resource] || 0;
        coins += reward;
        bank.setText(`${coins}`);

        mapScene.events.emit("extinguishFire", tile.sprite);
    } 

    if (tile.burnStatus === "not-burnt") {
        tile.terrain = "fire-break";
        mapScene.fireSpread.updateSprite(tileX, tileY);

    } else {

        tile.burnStatus = "extinguished";

        if (tile.terrain.includes('grass') || tile.terrain === 'grass') {
            tile.terrain = 'extinguished-grass';
        } else if (tile.terrain.includes('shrub') || tile.terrain === 'shrub') {
            tile.terrain = 'extinguished-shrub';
        } else if (tile.terrain.includes('tree') || tile.terrain === 'tree') {
            tile.terrain = 'extinguished-tree';
        }

        mapScene.fireSpread.updateSprite(tileX, tileY);
    }
}

// Signals to user that a resource is actively being used
export function activate_resource (index, resource, resourceName, ONcursorURL, OFFcursorURL, techniqueNameON, techniqueNameOFF, scene) {
    
    //--> Activate asset the user chooses
    console.log(`Resource Activated: ${resourceName}`)
    resource.setInteractive();

    // When water hose is clicked (activated), the cursor is replaced with water and fire sprites can be destroyed.
    // When water hose is deactivated, fire sprites can no longer be destroyed.
    resource.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            // Activates a resource on click if none are active
            if (activated_resource === "none" && !paused) {
                resource.setTexture('active-' + resourceName +'');
                scene.input.setDefaultCursor('url('+ ONcursorURL +'), pointer');
                technique = techniqueNameON;
                activated_resource = `${resourceName}`;
                mode = "deployment";
            } else {
                // Deactive clicked asset if it's already active
                if (activated_resource === resourceName && !paused) {
                    deactivate(all_assets);
                    resource.setTexture(resourceName);
                    technique = techniqueNameOFF;
                    scene.input.setDefaultCursor('url('+ OFFcursorURL +'), pointer');
                    activated_resource == "none";
                    mode = "cursor";
                } else { // Deactivate old asset and activate new asset if a different one is clicked
                    if (!paused) {
                        deactivate(all_assets);
                        resource.setTexture('active-' + resourceName +'');
                        scene.input.setDefaultCursor('url('+ ONcursorURL +'), pointer');
                        technique = techniqueNameON;
                        activated_resource = `${resourceName}`;
                        mode = "deployment";
                    }
                }
            }
        },
        this
    );
}

// This is the updated show_tooltip function for src/components/ui.js

// Replace the existing show_tooltip function with this one:
export function show_tooltip(resource, resourceName, x, y, scene) {
    // Define tooltip content based on resource name
    let tooltipContent = getTooltipContent(resourceName);
    
    // Shift tooltip position to the left to avoid covering the icon
    // Original x is 660, move it left by 120 pixels
    const tooltipX = x - 50;
    
    // Create a text object with proper styling
    let tooltip = scene.add.text(tooltipX, y, tooltipContent, {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#FFFFFF',
        backgroundColor: '#2d3436',
        padding: { x: 10, y: 8 },
        align: 'center',
        wordWrap: { width: 180 }
    })
    .setOrigin(0.5, 0.5)
    .setDepth(1000)
    .setScrollFactor(0)
    .setVisible(false);
    
    // Add a border to the tooltip background
    const bounds = tooltip.getBounds();
    const border = scene.add.rectangle(
        tooltipX, 
        y, 
        bounds.width + 5, 
        bounds.height + 5, 
        0xFFFFFF, 
        0.3
    )
    .setDepth(999)
    .setScrollFactor(0)
    .setVisible(false);
    
    // Show/hide tooltip on hover
    resource.on('pointerover', function() {
        tooltip.setVisible(true);
        border.setVisible(true);
    });
    
    resource.on('pointerout', function() {
        tooltip.setVisible(false);
        border.setVisible(false);
    });
}

// Helper function to get tooltip content based on resource name
function getTooltipContent(resourceName) {
    switch(resourceName.replace('-tooltip', '')) {
        case 'hose':
            return "FIRE HOSE\n\nBasic firefighting tool.\nReduces fuel by 3.\nSingle tile coverage.";
        case 'extinguisher':
            return "FIRE EXTINGUISHER\n\nQuick deployment.\nReduces fuel by 2.\nSingle tile coverage.";
        case 'helicopter':
            return "HELICOPTER\n\nAerial water drops.\nFully extinguishes.\nAffects 5 tiles in cross pattern.";
        case 'firetruck':
            return "FIRE TRUCK\n\nStrong water pressure.\nReduces fuel by 4.\nSingle tile coverage.";
        case 'airtanker':
            return "AIR TANKER\n\nLarge retardant drop.\nFully extinguishes.\nAffects 5 tiles in a line.";
        case 'hotshot-crew':
            return "HOTSHOT CREW\n\nCreates firebreaks.\nWorks on UNBURNED tiles only.\nProtects line of 5 tiles.";
        case 'smokejumper':
            return "SMOKEJUMPERS\n\nParachute into remote areas.\nImmediately extinguishes.\nSingle tile coverage.";
        default:
            return "Resource information unavailable";
    }
}

// Notification to player that they are out of specified asset
export function show_notification (scene, target, message = null) {
    // Case 1: target is a text object + message provided
    if (target?.setText && message === null) {
        target.setText(message).setVisible(true);
        scene.time.delayedCall(2000, () => target.setVisible(false));
    }

    // Case 2: target is just a message string (fallback mode)
    else if (typeof target === 'string') {
        if (!scene.fallbackNotificationText) {
            scene.fallbackNotificationText = scene.add.text(
                scene.scale.width / 2,
                scene.scale.height - 160,
                '',
                {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: '#ff5555',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 4 },
                }
            ).setOrigin(0.5).setDepth(999).setScrollFactor(0).setVisible(false);
        }

        scene.fallbackNotificationText.setText(target).setVisible(true);
        scene.time.delayedCall(2000, () => scene.fallbackNotificationText.setVisible(false));
    }

    else {
        target.setVisible(true);
    
        scene.time.delayedCall(1000, () => {
            target.setVisible(false);
        });
    }
}

// This function allows the player to deploy an asset
export function use_resource(scene, x, y, fireSprite, direction = null) {
    // 1) OUT-OF-ASSETS & COOLDOWN for single-tile assets ONLY
    if (activated_resource === "hose") {
        if (getHose() <= 0)     { show_notification(scene, out_hoses);   return; }
        if (cooldown[0] > 0)    { show_notification(scene, n_cooldown);  return; }
    }
    else if (activated_resource === "extinguisher") {
        if (getExtinguisher() <= 0) { show_notification(scene, out_extinguishers); return; }
        if (cooldown[1] > 0)        { show_notification(scene, n_cooldown);         return; }
    }
    else if (activated_resource === "helicopter") {
        if (getHelicopter() <= 0) { show_notification(scene, out_helicopters); return; }
        if (cooldown[2] > 0)      { show_notification(scene, n_cooldown);      return; }
    }
    else if (activated_resource === "firetruck") {
        if (getFiretruck() <= 0) { show_notification(scene, out_firetrucks); return; }
        if (cooldown[3] > 0)     { show_notification(scene, n_cooldown);     return; }
    }

    // 2) DIRECTION PROMPT for multi-tile assets
    const isDirectional =
        activated_resource === "airtanker" ||
        activated_resource === "hotshot-crew";
        if (!direction && isDirectional) {
        pendingDeployment = { scene, x, y, fireSprite };
        scene.scene
            .get('UIScene')
            .directionPromptContainer
            .setVisible(true);
        return;
    }

    // 3) OUT-OF-ASSETS & COOLDOWN for directional assets (after prompt)
    if (activated_resource === "airtanker") {
        if (getAirtanker() <= 0) { show_notification(scene, out_airtankers); return; }
        if (cooldown[4] > 0)     { show_notification(scene, n_cooldown);     return; }
    }
    else if (activated_resource === "hotshot-crew") {
        if (getHotshotCrew() <= 0) { show_notification(scene, out_hotshots); return; }
        if (cooldown[5] > 0)       { show_notification(scene, n_cooldown);   return; }
    }
    else if (activated_resource === "smokejumper") {
        if (getSmokejumpers() <= 0) { show_notification(scene, out_smokejumpers); return; }
        if (cooldown[6] > 0)        { show_notification(scene, n_cooldown);        return; }
    }

    // 4) ACTUAL DEPLOY LOGIC
    let asset = new AnimatedSprite(3);

    if (activated_resource === "hose" && !paused) {
        setHose(-1);
        asset.useHose(scene, x, y, fireSprite);
        asset.startTimer(0, scene, c_hose, scene.game.scale.width - 50, 40);

        scene.time.delayedCall(t_hose, () => {
            const mapScene = scene.scene.get('MapScene');
            const tx = Math.floor(fireSprite.x / mapScene.TILE_SIZE);
            const ty = Math.floor(fireSprite.y / mapScene.TILE_SIZE);
            reduceFuelAndMaybeExtinguish(mapScene.map.grid[ty][tx], fireSprite, mapScene, 3);
            bank.setText(`${coins}`);
        });
    }
    else if (activated_resource === "extinguisher" && !paused) {
        setExtinguisher(-1);
        asset.useFireExtinguisher(scene, x, y, fireSprite);
        asset.startTimer(1, scene, c_extinguisher, scene.game.scale.width - 50, 125);

        scene.time.delayedCall(t_extinguisher, () => {
            const mapScene = scene.scene.get('MapScene');
            const tx = Math.floor(fireSprite.x / mapScene.TILE_SIZE);
            const ty = Math.floor(fireSprite.y / mapScene.TILE_SIZE);
            reduceFuelAndMaybeExtinguish(mapScene.map.grid[ty][tx], fireSprite, mapScene, 2);
            bank.setText(`${coins}`);
        });
    }
    else if (activated_resource === "helicopter" && !paused) {
        setHelicopter(-1);
        asset.useHelicopter(scene, x, y, fireSprite);
        asset.startTimer(2, scene, c_helicopter, scene.game.scale.width - 50, 210);

        scene.time.delayedCall(t_helicopter, () => {
            const mapScene = scene.scene.get('MapScene');
            const size    = mapScene.TILE_SIZE;
            const tx      = Math.floor(fireSprite.x / size);
            const ty      = Math.floor(fireSprite.y / size);
            const deltas  = [[0,0],[0,-1],[0,1],[1,0],[-1,0]];

            deltas.forEach(([dx,dy]) => {
                const nx = tx+dx, ny = ty+dy;
                if (nx>=0 && nx<mapScene.map.width && ny>=0 && ny<mapScene.map.height) {
                    extinguishTile(mapScene.map.grid[ny][nx], nx, ny, mapScene);
                }
            });
            bank.setText(`${coins}`);
        });
    }
    else if (activated_resource === "firetruck" && !paused) {
        setFiretruck(-1);
        asset.useFiretruck(scene, x, y, fireSprite);
        asset.startTimer(3, scene, c_firetruck, scene.game.scale.width - 50, 295);

        scene.time.delayedCall(t_firetruck, () => {
            const mapScene = scene.scene.get('MapScene');
            const tx = Math.floor(fireSprite.x / mapScene.TILE_SIZE);
            const ty = Math.floor(fireSprite.y / mapScene.TILE_SIZE);
            reduceFuelAndMaybeExtinguish(mapScene.map.grid[ty][tx], fireSprite, mapScene, 4);
            bank.setText(`${coins}`);
        });
    }
    else if (activated_resource === "airtanker" && !paused) {
        setAirtanker(-1);
        asset.useAirtanker(scene, x, y, fireSprite);
        asset.startTimer(4, scene, c_airtanker, scene.game.scale.width - 50, 380);

        scene.time.delayedCall(t_airtanker, () => {
            const mapScene = scene.scene.get('MapScene');
            const tx      = Math.floor(x / mapScene.TILE_SIZE);
            const ty      = Math.floor(y / mapScene.TILE_SIZE);
            const dir     = direction || dropDirection;
            const deltas  = dir === "vertical"
                ? [[0,-2],[0,-1],[0,0],[0,1],[0,2]]
                : [[-2,0],[-1,0],[0,0],[1,0],[2,0]];

            deltas.forEach(([dx,dy]) => {
                const nx = tx+dx, ny = ty+dy;
                if (nx>=0 && nx<mapScene.map.width && ny>=0 && ny<mapScene.map.height) {
                    const nbr = mapScene.map.grid[ny][nx];
                    if (nbr.burnStatus !== "burnt") {
                        extinguishTile(nbr, nx, ny, mapScene);
                    }
                }
            });
            bank.setText(`${coins}`);
        });
    }
else if (activated_resource === "hotshot-crew" && !paused) {
    const mapScene = scene.scene.get('MapScene');
    const tx = Math.floor(x / mapScene.TILE_SIZE);
    const ty = Math.floor(y / mapScene.TILE_SIZE);
    const tile = mapScene.map.grid[ty][tx];

    // Prevent deployment on burning or invalid tiles
    if (!isValidFireBreakTile(tile)) {
        show_notification(scene, "Hotshots can only deploy on unburned, modifiable tiles!");
        return;
    }

    const asset2 = new AnimatedSprite(3);
    asset2.useHotshotCrew(scene, x, y);
    setHotshotCrew(-1);
    asset2.startTimer(5, scene, c_hotshotcrew, scene.game.scale.width - 50, 465);

    scene.time.delayedCall(t_hotshotcrew, () => {
        const dir = direction || dropDirection;
        const deltas = dir === "vertical"
            ? [[0, 0], [0, -2], [0, -1], [0, 1], [0, 2]]
            : [[0, 0], [-2, 0], [-1, 0], [1, 0], [2, 0]];

        deltas.forEach(([dx, dy]) => {
            const nx = tx + dx;
            const ny = ty + dy;

            if (nx >= 0 && nx < mapScene.map.width && ny >= 0 && ny < mapScene.map.height) {
                const targetTile = mapScene.map.grid[ny][nx];
                if (isValidFireBreakTile(targetTile)) {
                    targetTile.terrain = "fire-break";
                    mapScene.fireSpread.updateSprite(nx, ny);
                }
            }
        });

        bank.setText(`${coins}`);
    });
}

    else if (activated_resource === "smokejumper" && !paused) {
        setSmokejumpers(-1);
        asset.useSmokejumpers(scene, x, y, fireSprite);
        asset.startTimer(6, scene, scene.game.scale.width - 50, 550);

        scene.time.delayedCall(
            t_smokejumpers_plane + t_smokejumpers_ground,
            () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            }
        );
    }

    scene.previewOverlay.clear();
}

export {
    activate_resource,
    deactivate_current_resource,
    show_tooltip,
    set_text,
};