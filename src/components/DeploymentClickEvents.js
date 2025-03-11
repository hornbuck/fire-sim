import AnimatedSprite from '../components/AnimatedSprites.js';
import { all_assets, bank, n_cooldown, out_hoses, out_extinguishers, out_helicopters, out_firetrucks, out_airtankers, out_hotshots, out_smokejumpers } from './ui.js';
import { t_hose, t_extinguisher, t_firetruck, t_helicopter, t_airtanker, t_hotshotcrew, t_smokejumpers_plane, t_smokejumpers_ground } from '../components/AnimatedSprites.js';

// Global vars to track which technique is currently active and whether their cooldown is active
export let technique = "";
export let activated_resource = "none";

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
export let coins = 100;

//* Number Limits
export let hose = 10;
export let extinguisher = 5;
export let helicopter = 3;
export let firetruck = 3;
export let airtanker = 2;
export let hotshotcrew = 1;
export let smokejumper = 5;

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

// Get the number of hose assets (useful for external files)
export function getHose() {
    return hose;
}

// Set the number of hose assets (useful for external files)
export function setHose(value) {
    hose += value;
}

// Updates text of asset limits
export function set_text(value, x, y, scene) {
    return scene.add.text(x, y, value, {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5, 0.5);
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

    let active = true;

    // When water hose is clicked (activated), the cursor is replaced with water and fire sprites can be destroyed.
    // When water hose is deactivated, fire sprites can no longer be destroyed.
    resource.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (active === true) {
                // Check for already-activated resources
                deactivate(all_assets);

                resource.setTexture('active-' + resourceName +'');
                scene.input.setDefaultCursor('url('+ ONcursorURL +'), pointer');
                technique = techniqueNameON;
                activated_resource = `${resourceName}`;
                
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
export function show_notification (scene, notification) {
     
    notification.setVisible(true);
    
    scene.time.delayedCall(1000, () => {
         notification.setVisible(false);
     });
}

// Assuming you already have this method for handling tile clicks
function handleFireExtinguish(fireSprite) {
    // Convert fire sprite position to tile coordinates using the same method as handleTileClick
    const startX = (this.cameras.main.width - this.map.width * this.tileSize) / 2;
    const startY = (this.cameras.main.height - this.map.height * this.tileSize) / 2;

    let tileX = Math.floor((fireSprite.x - startX) / this.tileSize);
    let tileY = Math.floor((fireSprite.y - startY) / this.tileSize);

    console.warn(`Fire at tile coordinates: (${tileX}, ${tileY})`);

    // Ensure the tile is within bounds
    if (tileX >= 0 && tileX < this.map.width && tileY >= 0 && tileY < this.map.height) {
        let clickedTile = this.map.getTile(tileX, tileY);
        console.log(clickedTile ? `Tile found: ${clickedTile.toString()}` : "No tile found at this position!");

        // If tile exists, update its burn status
        if (clickedTile) {
            clickedTile.burnStatus = 'extinguished';
            console.log(`Tile at (${tileX}, ${tileY}) burn status updated to: ${clickedTile.burnStatus}`);
        }
    }
}


// This function allows the player to deploy an asset
export function use_resource (scene, x, y, fireSprite) {

    // Create an object that controls deployment graphics
    let asset = new AnimatedSprite(3);

    // Deploy animations
    if (activated_resource === "hose") {
        if (hose > 0) {
            // Start timer
            if (cooldown[0] == 0) {
                hose -= 1;
                asset.useHose(scene, x, y, fireSprite);
                asset.startTimer(0, scene, c_hose, 750, 50);
                coins += 100;
                
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_hose, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })
        } else {
            console.log("Sorry! You ran out!");
            
            // Notification to player that they are out of firehoses
            show_notification(scene, out_hoses);
        }
    }
    if (activated_resource === "extinguisher") {
        if (extinguisher > 0) {
            // Start timer
            if (cooldown[1] == 0) {
                extinguisher -= 1;
                asset.useFireExtinguisher(scene, x, y, fireSprite);
                asset.startTimer(1, scene, c_extinguisher, 750, 130);
                coins += 50;
                bank.setText(`${coins}`);
            } else {
                show_notification(scene, n_cooldown);
            }

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of fire extinguishers
            show_notification(scene, out_extinguishers);
        }
    }
    if (activated_resource === "helicopter") {
        if (helicopter > 0) {
            // Start timer
            if (cooldown[2] == 0) {
                helicopter -= 1;
                asset.useHelicopter(scene, x, y, fireSprite);
                asset.startTimer(2, scene, c_helicopter, 750, 210);
                coins += 300;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_helicopter, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })
            
        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of helicopters
            show_notification(scene, out_helicopters);
        }
    }
    if (activated_resource === "firetruck") {
        if (firetruck > 0) {
            // Start timer
            if (cooldown[3] == 0) {
                firetruck -= 1;
                asset.useFiretruck(scene, x, y, fireSprite);
                asset.startTimer(3, scene, c_firetruck, 750, 290);
                coins += 200;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_firetruck, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of firetrucks
            show_notification(scene, out_firetrucks);
        }
    }
    if (activated_resource === "airtanker") {
        if (airtanker > 0) {
            // Start timer
            if (cooldown[4] == 0) {
                airtanker -= 1;
                asset.useAirtanker(scene, x, y, fireSprite);
                asset.startTimer(4, scene, c_airtanker, 750, 370);
                coins += 500;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_airtanker, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of airtankers
            show_notification(scene, out_airtankers);
        }
    }
    if (activated_resource === "hotshot-crew") {
        if (hotshotcrew > 0) {
            // Start timer
            if (cooldown[5] == 0) {
                hotshotcrew -= 1;
                asset.useHotshotCrew(scene, x, y, fireSprite);
                asset.startTimer(5, scene, c_hotshotcrew, 750, 450);
                coins += 300;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_hotshotcrew, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of hotshot crews
            show_notification(scene, out_hotshots);
        }
    }
    if (activated_resource === "smokejumper") {
        if (smokejumper > 0) {
            // Start timer
            if (cooldown[6] == 0) {
                smokejumper -= 1;
                asset.useSmokejumpers(scene, x, y, fireSprite);
                asset.startTimer(6, scene, 750, 530);
                coins += 1000;
            } else {
                show_notification(scene, n_cooldown);
            }

            scene.time.delayedCall(t_smokejumpers_plane + t_smokejumpers_ground, () => {
                handleFireExtinguish.call(scene, fireSprite)
                bank.setText(`${coins}`);
            })

        } else {
            console.log("Sorry! You ran out!");

            show_notification(scene, out_smokejumpers);
        }
    }
}
