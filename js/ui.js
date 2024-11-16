// Export a function to create the HUD/Sidebar
export function createHUD(scene) {
    //Sidebar rectangle (vertical)
    const sidebar = scene.add.rectangle(750, 300, 100, 600, 0x2d3436)

    // Placeholder text for resources
    const waterText = scene.add.text(710, 50, 'Water: 0/5', {
        font: '16px Arial',
        fill: '#ffffff'
    });

    const fireText = scene.add.text(710, 80, 'Fire Suppression: 0', {
        font: '16px Arial',
        fill: '#ffffff'
    });

    // Add placeholder icons
    scene.load.image('waterIcon', 'Assets/water.png');
    scene.load.image('fireIcon', 'Assets/fire_suppression.png');

    // Create icons
    const waterIcon = scene.add.image(710, 120, 'waterIcon');
    const fireIcon = scene.add.image(710, 150, 'fireIcon');

    // Add other resources here
}

// Preload assets used by the HUD
export function preloadHUD(scene) {
    scene.load.image('waterIcon', 'Assets/water.png');
    scene.load.image('fireIcon', 'Assets/fire_suppression.png');
}