import {activate_resource, show_tooltip, set_text} from "./DeploymentClickEvents.js";


// Initialize blank text objects for later resource rendering
export let hoseText;
export let extinguisherText;
export let helicopterText;
export let firetruckText;
export let airtankerText;
export let hotshotcrewText;
export let smokejumperText;

// Render scene
export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle
    const sidebarWidth = 100;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    console.log("Sidebar created");

    // Spawn default cursor (firefighter glove)
    scene.input.setDefaultCursor('url(assets/cursors/glove.png), pointer');

    // Vertical spacing and alignment
    const sidebarCenter = 300; // Sidebar is vertically centered at 300px
    const iconSize = 0.8; // Scale of each icon

    // Group 1: Fire Hose
    let hose = scene.add.sprite(750, 50, 'hose').setScale(iconSize).setOrigin(0.5, 0.5);
    hoseText = set_text(`10/10`, 750, 90, scene);

    activate_resource(hose, "hose",'assets/cursors/water.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);

    // Create a tooltip for the fire hose
    show_tooltip(hose, 'hose-tooltip', 660, 55, scene);

    // Group 2: Fire Extinguisher
    const extinguisher = scene.add.image(750, 130, 'extinguisher').setScale(iconSize).setOrigin(0.5, 0.5);
    extinguisherText = scene.add.text(750, 170, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(extinguisher, "extinguisher",'assets/cursors/fire-extinguisher.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(extinguisher, 'extinguisher-tooltip', 660, 135, scene);

    // Group 3: Helicopter
    const helicopter = scene.add.image(750, 210, 'helicopter').setScale(iconSize).setOrigin(0.5, 0.5);
    helicopterText = scene.add.text(750, 250, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(helicopter, "helicopter",'assets/cursors/helicopter.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(helicopter, 'helicopter-tooltip', 660, 215, scene);

    // Group 4: Firetruck
    const firetruck = scene.add.image(750, 290, 'firetruck').setScale(iconSize).setOrigin(0.5, 0.5);
    firetruckText = scene.add.text(750, 330, '3/3', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(firetruck, "firetruck",'assets/cursors/firetruck.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(firetruck, 'firetruck-tooltip', 660, 295, scene);

    // Group 5: Airtanker
    const airtanker = scene.add.image(750, 370, 'airtanker').setScale(iconSize).setOrigin(0.5, 0.5);
    airtankerText = scene.add.text(750, 410, '2/2', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(airtanker, "airtanker",'assets/cursors/airtanker.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(airtanker, 'airtanker-tooltip', 660, 375, scene);

    // Group 6: Hotshot Crew
    const hotshotcrew = scene.add.image(750, 450, 'hotshot-crew').setScale(iconSize).setOrigin(0.5, 0.5);
    hotshotcrewText = scene.add.text(750, 490, '1/1', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(hotshotcrew, "hotshot-crew",'assets/cursors/hotshot-crew.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(hotshotcrew, 'hotshot-crew-tooltip', 660, 455, scene);

    // Group 7: Smokejumper
    const smokejumper = scene.add.image(750, 530, 'smokejumper').setScale(iconSize).setOrigin(0.5, 0.5);
    smokejumperText = scene.add.text(750, 570, '5/5', {
        font: '14px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    activate_resource(smokejumper, "smokejumper",'assets/cursors/launch.png', 'assets/cursors/glove.png', "WATER", "NO-WATER", scene);
    show_tooltip(smokejumper, 'smokejumper-tooltip', 660, 535, scene);
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");
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

    // Load fire spritesheet
    scene.load.spritesheet('fire-blaze', 'assets/64x64-Map-Tiles/animated-flame.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });
}



