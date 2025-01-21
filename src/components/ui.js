import {activate_resource} from "./DeploymentClickEvents.js";

export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle
    const sidebarWidth = 100;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    console.log("Sidebar created");

    // Spawn default cursor (firefighter glove)
    scene.input.setDefaultCursor('url(Assets/cursors/glove.png), pointer');

    // Vertical spacing and alignment
    const sidebarCenter = 300; // Sidebar is vertically centered at 300px
    const iconSize = 0.8; // Scale of each icon

    // Group 1: Fire Hose
    let hose = scene.add.sprite(750, 50, 'hose').setScale(iconSize).setOrigin(0.5, 0.5);
    const hoseText = scene.add.text(750, 90, "10/10", {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5, 0.5);

    activate_resource(hose, "hose",'Assets/cursors/water.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Create a tooltip for the fire hose
    let hose_tooltip = scene.add.sprite(660, 55, 'hose-tooltip');
    hose_tooltip.setVisible(false);
    hose.on('pointerover', function() {
        hose_tooltip.setVisible(true);
    });
    hose.on('pointerout', function() {
        hose_tooltip.setVisible(false);
    });

    // Group 2: Fire Extinguisher
    const extinguisher = scene.add.image(750, 130, 'extinguisher').setScale(iconSize).setOrigin(0.5, 0.5);
    const extinguisherText = scene.add.text(750, 170, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(extinguisher, "extinguisher",'Assets/cursors/fire-extinguisher.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Group 3: Helicopter
    const helicopter = scene.add.image(750, 210, 'helicopter').setScale(iconSize).setOrigin(0.5, 0.5);
    const helicopterText = scene.add.text(750, 250, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(helicopter, "helicopter",'Assets/cursors/helicopter.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Group 4: Firetruck
    const firetruck = scene.add.image(750, 290, 'firetruck').setScale(iconSize).setOrigin(0.5, 0.5);
    const firetruckText = scene.add.text(750, 330, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(firetruck, "firetruck",'Assets/cursors/firetruck.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Group 5: Airtanker
    const airtanker = scene.add.image(750, 370, 'airtanker').setScale(iconSize).setOrigin(0.5, 0.5);
    const airtankerText = scene.add.text(750, 410, '2/2', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(airtanker, "airtanker",'Assets/cursors/airtanker.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Group 6: Hotshot Crew
    const hotshotcrew = scene.add.image(750, 450, 'hotshot-crew').setScale(iconSize).setOrigin(0.5, 0.5);
    const hotshotcrewText = scene.add.text(750, 490, '1/1', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(hotshotcrew, "hotshot-crew",'Assets/cursors/hotshot-crew.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Group 7: Smokejumper
    const smokejumper = scene.add.image(750, 530, 'smokejumper').setScale(iconSize).setOrigin(0.5, 0.5);
    const smokejumperText = scene.add.text(750, 570, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(smokejumper, "smokejumper",'Assets/cursors/launch.png', 'Assets/cursors/glove.png', "WATER", "NO-WATER", scene);
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");
    // Load Resource Tooltips
    scene.load.image('hose-tooltip', 'assets/resources/tooltips/fire-hose.png');

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

    // Load fire spritesheet
    scene.load.spritesheet('fire-blaze', 'assets/64x64-Map-Tiles/animated-flame.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });
}

