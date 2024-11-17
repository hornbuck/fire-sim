export function createHUD(scene) {
    console.log("createHUD called");

    // Sidebar rectangle (smaller width)
    const sidebarWidth = 100;
    const sidebar = scene.add.rectangle(800 - sidebarWidth / 2, 300, sidebarWidth, 600, 0x2d3436);
    console.log("Sidebar created at (700, 300)");

    // Adjust text alignment
    scene.add.text(750, 50, 'Water: 0/5', { font: '12px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);
    scene.add.text(750, 100, 'Fire Suppression: 0', { font: '12px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);

    // Adjust icons (smaller and centered)
    const waterIcon = scene.add.image(750, 150, 'waterIcon').setScale(0.05).setOrigin(0.5, 0.5);
    const fireIcon = scene.add.image(750, 200, 'fireIcon').setScale(0.05).setOrigin(0.5, 0.5);

    console.log("HUD elements updated with smaller sizes and better alignment");
}

export function preloadHUD(scene) {
    console.log("preloadHUD called");
    scene.load.image('waterIcon', 'Assets/water.png');
    scene.load.image('fireIcon', 'Assets/fire_suppression.png');
}

