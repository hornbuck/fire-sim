import AnimatedSprite from '../components/AnimatedSprites.js';
import { all_assets, bank, n_cooldown, out_hoses, out_extinguishers, out_helicopters, out_firetrucks, out_airtankers, out_hotshots, out_smokejumpers } from './ui.js';
import { t_hose, t_extinguisher, t_firetruck, t_helicopter, t_airtanker, t_hotshotcrew, t_smokejumpers_plane, t_smokejumpers_ground } from '../components/AnimatedSprites.js';
import { getHose, setHose, getExtinguisher, setExtinguisher, getHelicopter, setHelicopter, getFiretruck, setFiretruck, getAirtanker, setAirtanker, getHotshotCrew, setHotshotCrew, getSmokejumpers, setSmokejumpers} from "./assetValues.js";
import { paused } from '../scenes/MapScene.js';

// Global vars to track which technique is currently active and whether their cooldown is active
export let technique = "";
export let activated_resource = "none";
export let mode = "cursor";

export let dropDirection = 'horizontal'; // default

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
function deactivate(sprites) {
    for (let i = 0; i <= 6; i++) {
        let asset = sprites[i];
        if (`${activated_resource}` === asset.name) {
            asset.setTexture(asset.name);
            technique = "NO-WATER";
            activated_resource = "none";
        }
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

export function show_tooltip (resource, resourceName, x, y, scene) {
    let tooltip = scene.add.sprite(x, y, resourceName);
    tooltip.setVisible(false);
    resource.on('pointerover', function() {
        tooltip.setVisible(true);
    });
    resource.on('pointerout', function() {
        tooltip.setVisible(false);
    });
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
                scene.scale.height - 30,
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
}

// This function allows the player to deploy an asset
export function use_resource (scene, x, y, fireSprite) {
    // Create an object that controls deployment graphics
    let asset = new AnimatedSprite(3);

    // Deploy animations
    if (activated_resource === "hose" && !paused) {
        console.log(paused);
        if (getHose() > 0) {
            if (cooldown[0] == 0) {
                setHose(-1);
                asset.useHose(scene, x, y, fireSprite);
                asset.startTimer(0, scene, c_hose, 750, 50);
                coins += 100;
                
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_hose, () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            })
        } else {
            console.log("Sorry! You ran out!");
            
            // Notification to player that they are out of firehoses
            show_notification(scene, out_hoses);
        }
    }
    if (activated_resource === "extinguisher" && !paused) {
        if (getExtinguisher() > 0) {
            if (cooldown[1] == 0) {
                setExtinguisher(-1);
                asset.useFireExtinguisher(scene, x, y, fireSprite);
                asset.startTimer(1, scene, c_extinguisher, 750, 130);
                coins += 50;
                bank.setText(`${coins}`);
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_extinguisher, () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of fire extinguishers
            show_notification(scene, out_extinguishers);
        }
    }
    if (activated_resource === "helicopter" && !paused) {
        if (getHelicopter() > 0) {
          if (cooldown[2] === 0) {
            setHelicopter(-1);
            asset.useHelicopter(scene, x, y, fireSprite);
            asset.startTimer(2, scene, c_helicopter, 750, 210);
            coins += 300;
          } else {
            show_notification(scene, n_cooldown);
          }
      
          // ==== CROSS‑SHAPED DROP: center + N, S, E, W ====
          scene.time.delayedCall(t_helicopter, () => {
            const mapScene = scene.scene.get('MapScene');
            const size    = mapScene.TILE_SIZE;
            const tileX   = Math.floor(fireSprite.x / size);
            const tileY   = Math.floor(fireSprite.y / size);
      
            // offsets: center, north, south, east, west
            const deltas = [
              [ 0,  0],  // center
              [ 0, -1],  // north
              [ 0,  1],  // south
              [ 1,  0],  // east
              [-1,  0],  // west
            ];

            deltas.forEach(([dx, dy]) => {
                const nx = tileX + dx;
                const ny = tileY + dy;
                if (
                    nx >= 0 && nx < mapScene.map.width &&
                    ny >= 0 && ny < mapScene.map.height
                ) {
                const neighbor = mapScene.map.grid[ny][nx];
                if (neighbor && neighbor.sprite) {
                    mapScene.events.emit('extinguishFire', neighbor.sprite);
                }
            }
            });

            bank.setText(`${coins}`);
        });
          // =============================================

        } else {
            console.log("Sorry! You ran out!");
            show_notification(scene, out_helicopters);
        }
      }
      
    if (activated_resource === "firetruck" && !paused) {
        if (getFiretruck() > 0) {
            if (cooldown[3] == 0) {
                setFiretruck(-1);
                asset.useFiretruck(scene, x, y, fireSprite);
                asset.startTimer(3, scene, c_firetruck, 750, 290);
                coins += 200;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_firetruck, () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of firetrucks
            show_notification(scene, out_firetrucks);
        }
    }

    if (activated_resource === "airtanker" && !paused) {
        if (getAirtanker() > 0) {
        if (cooldown[4] == 0) {
            setAirtanker(-1);
            asset.useAirtanker(scene, x, y, fireSprite);
            asset.startTimer(4, scene, c_airtanker, 750, 370);
            coins += 500;
        } else {
            show_notification(scene, n_cooldown);
        }
    
        // === REPLACED SINGLE‑TILE EXTINCTION WITH A 5‑TILE LOOP ===
        scene.time.delayedCall(t_airtanker, () => {
            // grab the MapScene so we can index into its grid
            const mapScene = scene.scene.get('MapScene');
            const size    = mapScene.TILE_SIZE;
            const tileX   = Math.floor(fireSprite.x / size);
            const tileY   = Math.floor(fireSprite.y / size);
    
            // extinguish from tileX‑2 up to tileX+2
            for (let dx = -2; dx <= 2; dx++) {
            const nx = tileX + dx;
            if (nx >= 0 && nx < mapScene.map.width) {
                const neighbor = mapScene.map.grid[tileY][nx];
                if (neighbor && neighbor.sprite) {
                mapScene.events.emit('extinguishFire', neighbor.sprite);
                }
            }
            }
    
            // update your coin display
            bank.setText(`${coins}`);
        });
        // =========================================================
    
        } else {
        console.log("Sorry! You ran out!");
        show_notification(scene, out_airtankers);
        }
    }
    if (activated_resource === "hotshot-crew" && !paused) {
        if (getHotshotCrew() > 0) {
            if (cooldown[5] == 0) {
                setHotshotCrew(-1);
                asset.useHotshotCrew(scene, x, y, fireSprite);
                asset.startTimer(5, scene, c_hotshotcrew, 750, 450);
                coins += 300;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_hotshotcrew, () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of hotshot crews
            show_notification(scene, out_hotshots);
        }
    }
    if (activated_resource === "smokejumper" && !paused) {
        if (getSmokejumpers() > 0) {
            if (cooldown[6] == 0) {
                setSmokejumpers(-1);
                asset.useSmokejumpers(scene, x, y, fireSprite);
                asset.startTimer(6, scene, 750, 530);
                coins += 1000;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_smokejumpers_plane + t_smokejumpers_ground, () => {
                scene.events.emit('extinguishFire', fireSprite);
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            show_notification(scene, out_smokejumpers);
        }
    }
}