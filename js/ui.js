export function createHUD(scene) {
    // Sidebar rectangle (vertical)
    const sidebar = scene.add.rectangle(750, 300, 100, 600, 0x2d3436);

    // Placeholder text for resources
    scene.add.text(710, 50, 'Water: 0/5', { font: '16px Arial', fill: '#ffffff' });
    scene.add.text(710, 80, 'Fire Suppression: 0', { font: '16px Arial', fill: '#ffffff' });

    // Create icons (using preloaded assets)
    scene.add.image(710, 120, 'waterIcon').setScale(0.5);
    scene.add.image(710, 150, 'fireIcon').setScale(0.5);
}

export function preloadHUD(scene) {
    scene.load.image('waterIcon', 'Assets/water.png');
    scene.load.image('fireIcon', 'Assets/fire_suppression.png');
}
