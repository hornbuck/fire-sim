import {activate_resource, deactivate, show_tooltip, set_text} from "./DeploymentClickEvents.js";
import { createNewShop } from "./PlayerShop.js";


// Initialize player coins text object
export let bank;

// Initialize gameplay notifications
export let n_cooldown;
export let out_hoses;
export let out_extinguishers;
export let out_helicopters;
export let out_firetrucks;
export let out_airtankers;
export let out_hotshots;
export let out_smokejumpers;

// Initialize all asset sprite objects
export let hose;
export let extinguisher;
export let helicopter;
export let firetruck;
export let airtanker;
export let hotshotcrew;
export let smokejumper;
export let all_assets = [];

// Initialize asset limits
export let hoseText;
export let extinguisherText;
export let helicopterText;
export let firetruckText;
export let airtankerText;
export let hotshotcrewText;
export let smokejumperText;

// Initialize timer sprites for later rendering
export let timerSprite;

export let coins;
export let open_shop;

// Helper function to style resource counters
function styleResourceCounter(text, scene) {
    text.setStyle({
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#FFFFFF',
        backgroundColor: '#333333',
        padding: { x: 6, y: 4 }
    });
    
    // Add a background for better visibility
    const bg = scene.add.rectangle(
        text.x,
        text.y,
        text.width + 12,
        text.height + 8,
        0x333333,
        0.7
    ).setOrigin(0.5).setDepth(text.depth - 1);
    
    return bg;
}

export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle
    const sidebarWidth = 110;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    sidebar.setDepth(-1);
    console.log("Sidebar created");

    // Spawn Notifications
    n_cooldown = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'cooldown').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_hoses = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-hoses').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_extinguishers = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-fire-extinguishers').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_helicopters = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-helicopters').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_firetrucks = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-firetrucks').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_airtankers = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-airtankers').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_hotshots = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-hotshots').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    out_smokejumpers = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'out-of-smokejumpers').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);

    // Spawn default cursor (firefighter glove)
    scene.input.setDefaultCursor('url(assets/cursors/glove.png), pointer');

    // Vertical spacing and alignment
    const sidebarCenter = 300; // Sidebar is vertically centered at 300px
    const iconSize = 0.8; // Scale of each icon

    // Create currency elements
    coins = scene.add.sprite(550, 560, 'coins')
    .setOrigin(0.5, 0.5)
    .setDepth(50)
    .setScale(0.23);

    bank = scene.add.text(610, 560, '0', {
        fontFamily: '"Press Start 2P"',
        fontSize: '16px',
        fontStyle: 'normal',
        color: '#FFFFFF'
    })
    .setOrigin(0.5, 0.5)
    .setDepth(50);

    // Create shop button
    open_shop = scene.add.sprite(660, 560, 'open-shop')
    .setOrigin(0.5, 0.5)
    .setDepth(50)
    .setScale(0.23);

    // Add interactivity to shop button
    open_shop.setInteractive({ useHandCursor: true })
    .on('pointerover', () => {
        open_shop.setAlpha(0.8);
        open_shop.fillColor = 0x444444; // Lighter on hover
    })
    .on('pointerout', () => {
        open_shop.setAlpha(1.0);
        open_shop.fillColor = 0x333333; // Back to normal
    })

    // Load player shop
    createNewShop(scene);

    // Group 1: Fire Hose
    let hose = scene.add.sprite(750, 50, 'hose').setScale(iconSize).setDepth(1).setOrigin(0.5, 0.5);
    hose.name = "hose";
    all_assets[0] = hose;
    hoseText = set_text(`10 left`, 750, 90, scene);
    timerSprite = scene.add.sprite(750, 50, 'set-timer').setDepth(10).setScale(1.0, 1.0).setVisible(false);
    activate_resource(0, hose, "hose",'assets/cursors/water.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    const hoseTextBg = styleResourceCounter(hoseText, scene);

    // Create a tooltip for the fire hose
    show_tooltip(hose, 'hose-tooltip', 660, 55, scene);

    // Group 2: Fire Extinguisher
    let extinguisher = scene.add.image(750, 130, 'extinguisher').setScale(iconSize).setOrigin(0.5, 0.5);
    extinguisher.name = "extinguisher";
    all_assets[1] = extinguisher;
    extinguisherText = scene.add.text(750, 170, '5 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(1, extinguisher, "extinguisher",'assets/cursors/fire-extinguisher.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    
    const extinguisherTextBg = styleResourceCounter(extinguisherText, scene);
    
    show_tooltip(extinguisher, 'extinguisher-tooltip', 660, 135, scene);

    // Group 3: Helicopter
    let helicopter = scene.add.image(750, 210, 'helicopter').setScale(iconSize).setOrigin(0.5, 0.5);
    helicopter.name = "helicopter";
    all_assets[2] = helicopter;
    helicopterText = scene.add.text(750, 250, '3 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(2, helicopter, "helicopter",'assets/cursors/helicopter.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    const helicopterTextBg = styleResourceCounter(helicopterText, scene);
    
    show_tooltip(helicopter, 'helicopter-tooltip', 660, 215, scene);

    // Group 4: Firetruck
    let firetruck = scene.add.image(750, 290, 'firetruck').setScale(iconSize).setOrigin(0.5, 0.5);
    firetruck.name = "firetruck";
    all_assets[3] = firetruck;
    firetruckText = scene.add.text(750, 330, '3 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(3, firetruck, "firetruck",'assets/cursors/firetruck.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    
    const firetruckTextBg = styleResourceCounter(firetruckText, scene);

    show_tooltip(firetruck, 'firetruck-tooltip', 660, 295, scene);

    // Group 5: Airtanker
    let airtanker = scene.add.image(750, 370, 'airtanker').setScale(iconSize).setOrigin(0.5, 0.5);
    airtanker.name = "airtanker";
    all_assets[4] = airtanker;
    airtankerText = scene.add.text(750, 410, '2 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(4, airtanker, "airtanker",'assets/cursors/airtanker.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    
    const airtankerTextBg = styleResourceCounter(airtankerText, scene);

    show_tooltip(airtanker, 'airtanker-tooltip', 660, 375, scene);

    // Group 6: Hotshot Crew
    let hotshotcrew = scene.add.image(750, 450, 'hotshot-crew').setScale(iconSize).setOrigin(0.5, 0.5);
    hotshotcrew.name = "hotshot-crew";
    all_assets[5] = hotshotcrew;
    hotshotcrewText = scene.add.text(750, 490, '1 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(5, hotshotcrew, "hotshot-crew",'assets/cursors/hotshot-crew.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    
    const hotshotcrewTextBg = styleResourceCounter(hotshotcrewText, scene);

    show_tooltip(hotshotcrew, 'hotshot-crew-tooltip', 660, 455, scene);

    // Group 7: Smokejumper
    let smokejumper = scene.add.image(750, 530, 'smokejumper').setScale(iconSize).setOrigin(0.5, 0.5);
    smokejumper.name = "smokejumper";
    all_assets[6] = smokejumper;
    smokejumperText = scene.add.text(750, 570, '5 left', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(6, smokejumper, "smokejumper",'assets/cursors/launch.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    
    const smokejumperTextBg = styleResourceCounter(smokejumperText, scene);

    show_tooltip(smokejumper, 'smokejumper-tooltip', 660, 535, scene);
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");

    // Load Player Assets
    scene.load.image('coins', 'assets/coins.png');
    scene.load.image('open-shop', 'assets/UI/open-shop.png');
    scene.load.image('shop', 'assets/UI/shop.png');
    scene.load.image('add-to-cart', 'assets/UI/add-to-cart.png');
    scene.load.image('remove-from-cart', 'assets/UI/remove-from-cart.png');
    scene.load.image('toggle-add-to-cart', 'assets/UI/toggle-add-to-cart.png');
    scene.load.image('remove-button', 'assets/UI/remove-button.png');
    scene.load.image('purchase', 'assets/UI/purchase.png');
    scene.load.image('close', 'assets/UI/close.png');
    scene.load.image('no-funds', 'assets/UI/no-funds.png');
    scene.load.image('price-tag', 'assets/UI/price-tag.png');

    // Load Resource Tooltips
    scene.load.image('hose-tooltip', 'assets/resources/tooltips/fire-hose.png');
    scene.load.image('extinguisher-tooltip', 'assets/resources/tooltips/fire-extinguisher.png');
    scene.load.image('helicopter-tooltip', 'assets/resources/tooltips/helicopter.png');
    scene.load.image('firetruck-tooltip', 'assets/resources/tooltips/firetruck.png');
    scene.load.image('airtanker-tooltip', 'assets/resources/tooltips/airtanker.png');
    scene.load.image('hotshot-crew-tooltip', 'assets/resources/tooltips/hotshot-crew.png');
    scene.load.image('smokejumper-tooltip', 'assets/resources/tooltips/smokejumpers.png');

    // Load Deactivated Resource Textures
    scene.load.image('hose', 'assets/resources/fire-hose.png');
    scene.load.image('extinguisher', 'assets/resources/fire-extinguisher.png');
    scene.load.image('helicopter', 'assets/resources/helicopter.png');
    scene.load.image('firetruck', 'assets/resources/firetruck.png');
    scene.load.image('airtanker', 'assets/resources/airtanker.png');
    scene.load.image('hotshot-crew', 'assets/resources/hotshot-crew.png');
    scene.load.image('smokejumper', 'assets/resources/smokejumpers.png');

    // Load Activated Resource Textures
    scene.load.image('active-hose', 'assets/resources/activated/fire-hose.png');
    scene.load.image('active-extinguisher', 'assets/resources/activated/fire-extinguisher.png');
    scene.load.image('active-helicopter', 'assets/resources/activated/helicopter.png');
    scene.load.image('active-firetruck', 'assets/resources/activated/firetruck.png');
    scene.load.image('active-airtanker', 'assets/resources/activated/airtanker.png');
    scene.load.image('active-hotshot-crew', 'assets/resources/activated/hotshot-crew.png');
    scene.load.image('active-smokejumper', 'assets/resources/activated/smokejumpers.png');

    // Load "Out" Notifications for Assets
    scene.load.image('out-of-hoses', 'assets/resources/notifications/fire-hose.png');
    scene.load.image('out-of-fire-extinguishers', 'assets/resources/notifications/fire-extinguisher.png');
    scene.load.image('out-of-helicopters', 'assets/resources/notifications/helicopter.png');
    scene.load.image('out-of-firetrucks', 'assets/resources/notifications/firetruck.png');
    scene.load.image('out-of-airtankers', 'assets/resources/notifications/airtankers.png');
    scene.load.image('out-of-hotshots', 'assets/resources/notifications/hotshot-crews.png');
    scene.load.image('out-of-smokejumpers', 'assets/resources/notifications/smokejumpers.png');
    scene.load.image('cooldown', 'assets/resources/notifications/cooldown.png');

    // Load "Timer" Spritesheet for Assets
    scene.load.spritesheet('set-timer', 'assets/timer.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64, // Height of each frame
    });

    // Load fire-hose (team of firefighters) spritesheet
    scene.load.spritesheet('set-hose', 'assets/64x64-Map-Tiles/Deployable%20Resources/fire-hose.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load extinguisher spritesheet
    scene.load.spritesheet('set-extinguisher', 'assets/64x64-Map-Tiles/Deployable%20Resources/extinguisher.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load firetruck spritesheet
    scene.load.spritesheet('set-firetruck', 'assets//64x64-Map-Tiles/Deployable%20Resources/firetruck.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load helicopter spritesheet
    scene.load.spritesheet('set-helicopter', 'assets//64x64-Map-Tiles/Deployable%20Resources/helicopter.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load airtanker spritesheet
    scene.load.spritesheet('set-airtanker', 'assets//64x64-Map-Tiles/Deployable%20Resources/airtanker.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load hotshot crew spritesheet
    scene.load.spritesheet('set-hotshot', 'assets//64x64-Map-Tiles/Deployable%20Resources/hotshot-crew.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load smokejumpers spritesheet (Part 1 of 2)
    scene.load.spritesheet('set-smokejumpers', 'assets//64x64-Map-Tiles/Deployable%20Resources/smokejumpers.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    // Load smokejumpers spritesheet (Part 2 of 2)
    scene.load.spritesheet('set-smokejumpers-dig', 'assets//64x64-Map-Tiles/Deployable%20Resources/trench-digger.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });

    
}
