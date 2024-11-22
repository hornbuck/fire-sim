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
    scene.load.image('waterIcon', 'Assets/water-2.png');
    scene.load.image('fireIcon', 'Assets/fire_suppression.png');
    scene.load.image('water', 'Assets/water.png');
    scene.load.image('fire', 'Assets/fire.png');
    scene.load.image('hotshot', 'Assets/hotshot.png');
    scene.load.image('tanker', 'Assets/tanker.png');
    scene.load.image('helicopter', 'Assets/helicopter.png');
}

