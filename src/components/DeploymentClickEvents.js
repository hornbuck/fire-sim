import AnimatedSprite from '../components/AnimatedSprites.js';

// Global stream to track which technique is currently active
export let technique = "";
export let activated_resource = "none";

// These are all of the global limits for all the resources
//* Number Limits
export let hose = 10;
export let extinguisher = 5;
export let helicopter = 3;
export let firetruck = 3;
export let airtanker = 2;
export let hotshotcrew = 1;
export let smokejumper = 5;

export function set_text(value, x, y, scene) {
    return scene.add.text(x, y, value, {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5, 0.5);
}

// Signals to user that a resource is actively being used
export function activate_resource (resource, resourceName, ONcursorURL, OFFcursorURL, techniqueNameON, techniqueNameOFF, scene) {
    //--> Make fire hose clickable
    resource.setInteractive();
    let active = true;

    // When water hose is clicked (activated), the cursor is replaced with water and fire sprites can be destroyed.
    // When water hose is deactivated, fire sprites can no longer be destroyed.
    resource.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (active === true) {
                resource.setTexture('active-' + resourceName +'');
                scene.input.setDefaultCursor('url('+ ONcursorURL +'), pointer');
                technique = techniqueNameON;
                activated_resource = `${resourceName}`;
                active = false;
            } else {
                resource.setTexture(resourceName);
                scene.input.setDefaultCursor('url('+ OFFcursorURL +'), pointer');
                scene.input.removeDebug(resource);
                technique = techniqueNameOFF;
                activated_resource = "none";
                active = true;
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
            clickedTile.burnStatus = 'burnt';
            console.log(`Tile at (${tileX}, ${tileY}) burn status updated to: ${clickedTile.burnStatus}`);
        }
    }
}


// This function adjusts the countdown
// TO-DO: Add deployment graphics/animations
export function use_resource (scene, x, y, fireSprite) {
    
    // Create an object that controls deployment graphics
    let asset = new AnimatedSprite(3);

    // Deploy animations
    if (activated_resource === "hose") {
        if (hose > 0) {
            console.log("Hose was applied!");
            hose -= 1;
            asset.useHose(scene, x, y, fireSprite);
            
            // Start timer
            asset.startTimer(scene, 750, 50);

            scene.time.delayedCall(3000, () => {
                handleFireExtinguish.call(scene, fireSprite)
            })
        } else {
            console.log("Sorry! You ran out!");
            
            // Notification to player that they are out of firehoses
            const hose_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-hoses').setScale(0.8).setOrigin(0.5, 0.5);
            hose_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                hose_notification.destroy();
            });
        }
    }
    if (activated_resource === "extinguisher") {
        if (extinguisher > 0) {
            extinguisher -= 1;
            asset.useFireExtinguisher(scene, x, y, fireSprite);

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of fire extinguishers
            const extinguisher_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-fire-extinguishers').setScale(0.8).setOrigin(0.5, 0.5);
            extinguisher_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                extinguisher_notification.destroy();
            });
        }
    }
    if (activated_resource === "helicopter") {
        if (helicopter > 0) {
            helicopter -= 1;
            asset.useHelicopter(scene, x, y, fireSprite);
            
        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of helicopters
            const helicopter_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-helicopters').setScale(0.8).setOrigin(0.5, 0.5);
            helicopter_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                helicopter_notification.destroy();
            });
        }
    }
    if (activated_resource === "firetruck") {
        if (firetruck > 0) {
            firetruck -= 1;
            asset.useFiretruck(scene, x, y, fireSprite);

        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of firetrucks
            const firetruck_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-firetrucks').setScale(0.8).setOrigin(0.5, 0.5);
            firetruck_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                firetruck_notification.destroy();
            });
        }
    }
    if (activated_resource === "airtanker") {
        if (airtanker > 0) {
            airtanker -= 1;
            asset.useAirtanker(scene, x, y, fireSprite);
        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of airtankers
            const airtanker_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-airtankers').setScale(0.8).setOrigin(0.5, 0.5);
            airtanker_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                airtanker_notification.destroy();
            });
        }
    }
    if (activated_resource === "hotshot-crew") {
        if (hotshotcrew > 0) {
            hotshotcrew -= 1;
            asset.useHotshotCrew(scene, x, y, fireSprite);
        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of hotshot crews
            const hotshot_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-hotshots').setScale(0.8).setOrigin(0.5, 0.5);
            hotshot_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                hotshot_notification.destroy();
            });
        }
    }
    if (activated_resource === "smokejumper") {
        if (smokejumper > 0) {
            smokejumper -= 1;
            asset.useSmokejumpers(scene, x, y, fireSprite);
        } else {
            console.log("Sorry! You ran out!");

            // Notification to player that they are out of hotshot crews
            const smokejumpers_notification = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-smokejumpers').setScale(0.8).setOrigin(0.5, 0.5);
            smokejumpers_notification.setDepth(1);  // sends to top layer of scene
            scene.time.delayedCall(1000, () => {
                smokejumpers_notification.destroy();
            });
        }
    }
}
