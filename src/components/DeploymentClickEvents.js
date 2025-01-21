// Global stream to track which technique is currently active
export let technique = "";

export function activate_resource (resource, resourceName, ONcursorURL, OFFcursorURL, techniqueNameON, techniqueNameOFF, scene) {
    //--> Make fire hose clickable
    resource.setInteractive();
    let active = true;

    // When water hose is clicked (activated), the cursor is replaced with water and fire sprites can be destroyed.
    // When water hose is deactivated, fire sprites can no longer be destroyed.
    resource.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (active === true) {
                resource.setTexture('active-' + resourceName +'');
                scene.input.setDefaultCursor('url('+ ONcursorURL +'), pointer');
                technique = techniqueNameON;
                active = false;
            } else {
                resource.setTexture(resourceName);
                scene.input.setDefaultCursor('url('+ OFFcursorURL +'), pointer');
                scene.input.removeDebug(resource);
                technique = techniqueNameOFF;
                active = true;
            }
        },
        this
    );
}