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
// This function adjusts the countdown
// TO-DO: Add deployment graphics/animations week of Jan 27
export function use_resource (scene) {
    if (activated_resource === "hose") {
        if (hose > 0) {
            console.log("Hose was applied!");
            hose -= 1;
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "extinguisher") {
        if (extinguisher > 0) {
            extinguisher -= 1;

            let m_x = 0;
            let m_y = 0;
            
            // Register extinguish animation
            scene.anims.create({
                key: "extinguisherAnimConfig",
                frames: scene.anims.generateFrameNumbers('set-extinguisher'),
                frameRate: 10,
                repeat: -1
            });

            // Get mouse position and play animation upon click
            scene.input.on('pointerdown', function (pointer) {
                m_x = pointer.x;
                m_y = pointer.y;
                let cloudSprite = scene.add.sprite(m_x,m_y, 'set-extinguisher').setDepth(1).setScale(0.75, 0.75);
                cloudSprite.play('extinguisherAnimConfig');
                scene.time.delayedCall(3000, () => {
                    cloudSprite.destroy();
                });
                console.log(`Mouse coordinates: x=${m_x}, y=${m_y}`);
            });

            
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "helicopter") {
        if (helicopter > 0) {
            helicopter -= 1;
            
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "firetruck") {
        if (firetruck > 0) {
            firetruck -= 1;
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "airtanker") {
        if (airtanker > 0) {
            airtanker -= 1;
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "hotshot-crew") {
        if (hotshotcrew > 0) {
            hotshotcrew -= 1;
        } else {
            console.log("Sorry! You ran out!");
        }
    }
    if (activated_resource === "smokejumper") {
        if (smokejumper > 0) {
            smokejumper -= 1;
        } else {
            console.log("Sorry! You ran out!");
        }
    }
}
