export default class CameraControls {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // Debugging: Check if map dimensions are received
        console.log("CameraControls Initialized with Scene:");
        console.log("mapWidth:", scene.mapWidth);
        console.log("mapHeight:", scene.mapHeight);
        console.log("tileSize:", scene.tileSize);

        // Set zoom and bounds (with fallback values if undefined)
        const mapWidth = scene.mapWidth ? scene.mapWidth * scene.tileSize : 800;
        const mapHeight = scene.mapHeight ? scene.mapHeight * scene.tileSize : 600;

        console.log("Final Bounds:", mapWidth, mapHeight);
        this.camera.setBounds(0, 0, mapWidth, mapHeight);
        this.camera.setZoom(1);

        // Enable interactions
        this.enablePanning();
        this.enableZoom();
    }

    enablePanning() {
        let dragStart = { x: 0, y: 0 };

        this.scene.input.on('pointerdown', (pointer) => {
            console.log("Pointer Down Detected");
            dragStart.x = pointer.x;
            dragStart.y = pointer.y;
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                console.log("Panning...");
                this.camera.scrollX -= (pointer.x - dragStart.x) / this.camera.zoom;
                this.camera.scrollY -= (pointer.y - dragStart.y) / this.camera.zoom;
                dragStart.x = pointer.x;
                dragStart.y = pointer.y;
            }
        });
    }

    enableZoom() {
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            console.log("Zooming...");
            if (gameObjects.length > 0) return;

            let zoomFactor = Phaser.Math.Clamp(this.camera.zoom - deltaY * 0.001, 0.5, 2);
            this.camera.setZoom(zoomFactor);
        });
    }
}
