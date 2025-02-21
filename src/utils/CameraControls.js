export default class CameraControls {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // Set zoom and bounds
        this.camera.setZoom(1);
        this.camera.setBounds(0, 0, scene.mapWidth * scene.tileSize, scene.mapHeight * scene.tileSize);

        // Enable panning and zooming
        this.enablePanning();
        this.enableZoom();
    }

    enablePanning() {
        let dragStart = { x: 0, y: 0 };

        this.scene.input.on('pointerdown', (pointer) => {
            if (!pointer.rightButtonDown()) { // Ignore right-clicks
                dragStart.x = pointer.x;
                dragStart.y = pointer.y;
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.camera.scrollX -= (pointer.x - dragStart.x) / this.camera.zoom;
                this.camera.scrollY -= (pointer.y - dragStart.y) / this.camera.zoom;
                dragStart.x = pointer.x;
                dragStart.y = pointer.y;
            }
        });
    }

    enableZoom() {
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            // Prevent zooming when interacting with UI elements
            if (gameObjects.length > 0) return;

            let zoomFactor = Phaser.Math.Clamp(this.camera.zoom - deltaY * 0.001, 0.5, 2);
            this.camera.setZoom(zoomFactor);
        });
    }
}
