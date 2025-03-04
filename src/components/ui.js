import {activate_resource, deactivate, show_tooltip, set_text} from "./DeploymentClickEvents.js";

// Initialize player coins tracker
export let playerCoins = 0;

// Initialize all asset sprite objects
export let hose;
export let extinguisher;
export let helicopter;
export let firetruck;
export let airtanker;
export let hotshotcrew;
export let smokejumper;
export let all_assets = [];

// Initialize blank text objects for later resource rendering
export let hoseText;
export let extinguisherText;
export let helicopterText;
export let firetruckText;
export let airtankerText;
export let hotshotcrewText;
export let smokejumperText;

// Initialize timer sprites for later rendering
export let timerSprite;

export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle
    const sidebarWidth = 100;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    sidebar.setDepth(-1);
    console.log("Sidebar created");

    // Spawn default cursor (firefighter glove)
    scene.input.setDefaultCursor('url(assets/cursors/glove.png), pointer');

    // Vertical spacing and alignment
    const sidebarCenter = 300; // Sidebar is vertically centered at 300px
    const iconSize = 0.8; // Scale of each icon

    // Player Coins Block to UI
    let coins = scene.add.sprite(80, 100, 'coins').setScale(0.3).setDepth(1).setOrigin(0.5, 0.5);
    playerCoins = scene.add.text(65, 100, '0', {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5).setDepth(2);

    // Group 1: Fire Hose
    let hose = scene.add.sprite(750, 50, 'hose').setScale(iconSize).setDepth(1).setOrigin(0.5, 0.5);
    hose.name = "hose";
    all_assets[0] = hose;
    hoseText = set_text(`10/10`, 750, 90, scene);
    timerSprite = scene.add.sprite(750, 50, 'set-timer').setDepth(10).setScale(1.0, 1.0).setVisible(false);
    activate_resource(0, hose, "hose",'assets/cursors/water.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Create a tooltip for the fire hose
    show_tooltip(hose, 'hose-tooltip', 660, 55, scene);

    // Group 2: Fire Extinguisher
    let extinguisher = scene.add.image(750, 130, 'extinguisher').setScale(iconSize).setOrigin(0.5, 0.5);
    extinguisher.name = "extinguisher";
    all_assets[1] = extinguisher;
    extinguisherText = scene.add.text(750, 170, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(1, extinguisher, "extinguisher",'assets/cursors/fire-extinguisher.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(extinguisher, 'extinguisher-tooltip', 660, 135, scene);

    // Group 3: Helicopter
    let helicopter = scene.add.image(750, 210, 'helicopter').setScale(iconSize).setOrigin(0.5, 0.5);
    helicopter.name = "helicopter";
    all_assets[2] = helicopter;
    helicopterText = scene.add.text(750, 250, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(2, helicopter, "helicopter",'assets/cursors/helicopter.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(helicopter, 'helicopter-tooltip', 660, 215, scene);

    // Group 4: Firetruck
    let firetruck = scene.add.image(750, 290, 'firetruck').setScale(iconSize).setOrigin(0.5, 0.5);
    firetruck.name = "firetruck";
    all_assets[3] = firetruck;
    firetruckText = scene.add.text(750, 330, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(3, firetruck, "firetruck",'assets/cursors/firetruck.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(firetruck, 'firetruck-tooltip', 660, 295, scene);

    // Group 5: Airtanker
    let airtanker = scene.add.image(750, 370, 'airtanker').setScale(iconSize).setOrigin(0.5, 0.5);
    airtanker.name = "airtanker";
    all_assets[4] = airtanker;
    airtankerText = scene.add.text(750, 410, '2/2', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(4, airtanker, "airtanker",'assets/cursors/airtanker.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(airtanker, 'airtanker-tooltip', 660, 375, scene);

    // Group 6: Hotshot Crew
    let hotshotcrew = scene.add.image(750, 450, 'hotshot-crew').setScale(iconSize).setOrigin(0.5, 0.5);
    hotshotcrew.name = "hotshot-crew";
    all_assets[5] = hotshotcrew;
    hotshotcrewText = scene.add.text(750, 490, '1/1', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(5, hotshotcrew, "hotshot-crew",'assets/cursors/hotshot-crew.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(hotshotcrew, 'hotshot-crew-tooltip', 660, 455, scene);

    // Group 7: Smokejumper
    let smokejumper = scene.add.image(750, 530, 'smokejumper').setScale(iconSize).setOrigin(0.5, 0.5);
    smokejumper.name = "smokejumper";
    all_assets[6] = smokejumper;
    smokejumperText = scene.add.text(750, 570, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(6, smokejumper, "smokejumper",'assets/cursors/launch.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(smokejumper, 'smokejumper-tooltip', 660, 535, scene);
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");

    // Load Player Coins
    scene.load.image('coins', 'assets/coins.png');

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
