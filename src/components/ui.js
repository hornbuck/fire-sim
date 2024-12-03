// Global stream to track which technique is currently active
export let technique = "";
export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle
    const sidebarWidth = 100;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    console.log("Sidebar created");

    // Vertical spacing and alignment
    const sidebarCenter = 300; // Sidebar is vertically centered at 300px
    const iconSpacing = 90; // Space between icon groups
    const iconTextOffset = 35; // Distance between icon and text
    const fireTextExtraOffset = 10; // Additional lowering for fire text

    // Group 1: Water
    const waterIcon = scene.add.image(750, sidebarCenter - iconSpacing, 'waterIcon').setScale(0.04).setOrigin(0.5, 0.5);
    const waterText = scene.add.text(750, sidebarCenter - iconSpacing + iconTextOffset, 'Water: 0/5', {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5, 0.5);

    //--> Make water icon clickable
    waterIcon.setInteractive();
    waterIcon.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            scene.input.setDefaultCursor('url(assets/cursors/water.png), pointer');
            scene.input.enableDebug(waterIcon); //replace with an 'activated' graphic later
            technique = "WATER";
        },
        this
    );

    // Group 2: Fire Suppression
    const fireIcon = scene.add.image(750, sidebarCenter, 'fireIcon').setScale(0.04).setOrigin(0.5, 0.5);
    const fireText = scene.add.text(750, sidebarCenter + iconTextOffset + fireTextExtraOffset, 'Fire\nSuppression: 0', {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    // Group 3: Helicopter
    const helicopterIcon = scene.add.image(750, sidebarCenter + iconSpacing + (iconSpacing/5), 'helicopter').setScale(0.8).setOrigin(0.5, 0.5);
    const helicopterText = scene.add.text(750, sidebarCenter + (iconSpacing/5) + (iconTextOffset*3.7), 'Helicopters: 3/3', {
        font: '12px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 80 },
    }).setOrigin(0.5, 0.5);

    console.log("Fire text lowered by extra offset");
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");
    scene.load.image('waterIcon', 'assets/images/water-2.png');
    scene.load.image('fireIcon', 'assets/images/fire_suppression.png');
    scene.load.image('water', 'assets/images/terrain/water.png');
    scene.load.image('fire', 'assets/images/fire.png');
    scene.load.image('hotshot', 'assets/images/hotshot.png');
    scene.load.image('tanker', 'assets/images/tanker.png');
    scene.load.image('helicopter', 'assets/images/helicopter.png');

    // Load fire spritesheet
    scene.load.spritesheet('fire-blaze', 'assets/64x64-Map-Tiles/animated-flame.png', {
        frameWidth: 64, // Width of each frame
        frameHeight: 64 // Height of each frame
    });
}

