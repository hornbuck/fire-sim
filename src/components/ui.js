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

// Initialize purchase quantity for each asset
export let s_hose;
export let s_extinguisher;
export let s_helicopter;
export let s_firetruck;
export let s_airtanker;
export let s_hotshotcrew;
export let s_smokejumpers;
export let s_total = 0;

// Initialize timer sprites for later rendering
export let timerSprite;

export let coinBackground;
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
    const sidebarWidth = 50;
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

    // Player Coins Block to UI with background
// First create the background rectangle
const coinBg = scene.add.rectangle(
    580, // Centered position for the currency display
    560, // Same Y position as before
    120, // Width for the background
    40,  // Height for the background
    0x333333, // Dark background color
    0.8 // Semi-transparent
).setOrigin(0.5, 0.5).setDepth(1);

// Combined approach with emoji and value in one text object
bank = scene.add.text(580, 560, '💰 0', {
    fontFamily: '"Press Start 2P"',
    fontSize: '16px',
    fontStyle: 'normal',
    color: '#ffffff',
    padding: { x: 8, y: 4 } // Add some padding
})
.setOrigin(0.5, 0.5).setDepth(2);

// Set coins to null since we're incorporating it into the bank text
coins = null;

// Add the background to the scene
scene.add.existing(coinBg);

     // Spawn player shop sprites
    open_shop = scene.add.sprite(660, 560, 'open-shop').setScale(0.23).setDepth(500).setOrigin(0.5, 0.5); // I NEED ADDRESSED
    open_shop.setInteractive()
    .on('pointerover', () => open_shop.setTint(0xaaaaaa))
    .on('pointerout', () => open_shop.clearTint());
    
    open_shop.on('pointerdown', () => {
        scene.shopBackgroundFade.setVisible(true);
        scene.shopContainer.setVisible(true);
    });
      


    let shop = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'shop').setScale(1).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let close = scene.add.sprite(180, 70, 'close').setScale(0.23).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let remove_button = scene.add.sprite(400, 540, 'remove-button').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let purchase = scene.add.sprite(570, 500, 'purchase').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let no_funds = scene.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height / 2, 'no-funds').setScale(1).setDepth(1100).setOrigin(0.5, 0.5).setVisible(false);
    
    let add_hose = scene.add.sprite(360, 210, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_extinguisher = scene.add.sprite(590, 210, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_helicopter = scene.add.sprite(360, 277, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_firetruck = scene.add.sprite(590, 277, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_airtanker = scene.add.sprite(360, 347, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_hotshotcrew = scene.add.sprite(590, 347, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    let add_smokejumpers = scene.add.sprite(500, 413, 'add-to-cart').setScale(0.15).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);

    // Add Price Tag Sprites
    let price_hose = scene.add.sprite(380, 180, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_hose_text = scene.add.text(393, 170, '$150', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        fontStyle: 'normal',
        color: '#000000'
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_extinguisher = scene.add.sprite(620, 180, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_extinguisher_text = scene.add.text(633, 170, '$25', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_helicopter = scene.add.sprite(390, 250, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_helicopter_text = scene.add.text(403, 240, '$300', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_firetruck = scene.add.sprite(620, 250, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_firetruck_text = scene.add.text(633, 240, '$250', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_airtanker = scene.add.sprite(390, 320, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_airtanker_text = scene.add.text(403, 310, '$250', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_hotshotcrew = scene.add.sprite(620, 320, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_hotshotcrew_text = scene.add.text(633, 310, '$700', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);
    let price_smokejumpers = scene.add.sprite(532, 390, 'price-tag').setScale(0.3).setDepth(500).setOrigin(0.5, 0.5).setVisible(false);
    let price_smokejumpers_text = scene.add.text(545, 380, '$250', {
        font: '22px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    // Initialize asset shop amounts
    s_hose = scene.add.text(310, 210, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_extinguisher = scene.add.text(535, 210, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_helicopter = scene.add.text(310, 277, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_firetruck = scene.add.text(535, 277, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_airtanker = scene.add.text(310, 347, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_hotshotcrew = scene.add.text(535, 347, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_smokejumpers = scene.add.text(405, 413, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(600).setVisible(false);

    s_total = scene.add.text(210, 483, '0', {
        font: '32px Arial',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 80 },
    }).setDepth(600).setVisible(false);

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
