export default class CameraControls {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // Set initial zoom level
        this.camera.setZoom(1);

        // Enable panning with pointer drag
        this.enablePanning();

        // Enable zooming with scroll wheel
        this.enableZoom();
    }

    enablePanning() {
        let dragStart = { x: 0, y: 0 };

        this.scene.input.on('pointerdown', (pointer) => {
            dragStart.x = pointer.x;
            dragStart.y = pointer.y;
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.camera.scrollX += (dragStart.x - pointer.x);
                this.camera.scrollY += (dragStart.y - pointer.y);
                dragStart.x = pointer.x;
                dragStart.y = pointer.y;
            }
        });

    }

    enableZoom() {
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            let zoomFactor = 0.05; // Adjust zoom sensitivity
            let newZoom = Phaser.Math.Clamp(this.camera.zoom - deltaY * zoomFactor * 0.001, 0.5, 2);
            this.camera.setZoom(newZoom);
        });
    }
}