import { technique, use_resource } from './DeploymentClickEvents.js'

//--------------------------------------------------------------------
// BELOW ARE THE FUNCTIONS THAT CONTROL ALL OF THE ANIMATED SPRITES
//--------------------------------------------------------------------
export default class AnimatedSprite {

    // Saves difficulty/power level
    constructor (energy) {
        this.energy = energy;
        this.sprite;
    }

    ////// FIRE SPRITE /////
    /**
     * Lights a blaze on a terrain tile and makes fire clickable to extinguish later.
     * @param {Object} scene - The Phaser scene where the fire animation will play.
     * @param {Object} sprite - The sprite representing the terrain tile where the fire is ignited.
     * @param flameGroup
     */
    // Makes fire sprite lightable / extinguishable (upon click)
    lightFire(scene, sprite, flameGroup) {
        if (!scene.anims.exists('fireAnimConfig')) {
            scene.anims.create({
                key: "fireAnimConfig",
                frames: scene.anims.generateFrameNumbers('fire-blaze'),
                frameRate: 10,
                repeat: -1
            });
        }

        let fireSprite = scene.add.sprite(sprite.x + 16, sprite.y, 'fire-blaze')
            .setDepth(1)
            .setScale(0.75)
            .play('fireAnimConfig');

        flameGroup.add(fireSprite);

        // Store reference to the terrain tile in the fire sprite
        fireSprite.tile = sprite;  

        fireSprite.setInteractive();
        fireSprite.on(
            "pointerdown",
            function (pointer, localX, localY, event) {
                if (technique === 'WATER') {
                    use_resource(scene, fireSprite.x, fireSprite.y, fireSprite);
                }
            },
            this.sprite = fireSprite //saves the sprite obj so that it can be manipulated later (eg. destroyed)
        );
    }

    // Extinguishes fire sprite (no user input required)
    extinguishFire() {
        this.sprite.destroy();
    }

    //----------------------------------
    ////// ASSET TIMER /////
    startTimer(scene, x, y) {
        console.log("Timer activated!");

        // Register truck animation
        scene.anims.create({
            key: "timerAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-timer'),
            frameRate: 30,
            repeat: -1
        });

        // Play animation
        let timerSprite = scene.add.sprite(x, y, 'set-hotshot').setDepth(2).setScale(1.0, 1.0);
        timerSprite.play('timerAnimConfig');
        scene.time.delayedCall(3000, () => {
            timerSprite.destroy();
        });
    }

    //--------------------------------------------
    ////// FIREFIGHTERS WITH FIRE HOSE ASSET /////
    useHose(scene, x, y, fireSprite) {
        console.log("Team of firefighters activated!");
            
        // Register hose animation
        scene.anims.create({
            key: "hoseAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-hose'),
            frameRate: 40,
            repeat: -1
        });

        // Play animation
        let hoseSprite = scene.add.sprite(x + 30, y + 10, 'set-hose').setDepth(1).setScale(1.0, 1.0);
        hoseSprite.play('hoseAnimConfig');
        scene.time.delayedCall(4000, () => {
            hoseSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(4000, () => {
            fireSprite.destroy();
        });
    }

    //----------------------------------
    ////// FIRE EXTINGUISHER ASSET /////
    // Applies fire extinguisher
    useFireExtinguisher(scene, x, y, fireSprite) {
        console.log("Fire extinguisher activated!");
            
        // Register extinguish animation
        scene.anims.create({
            key: "extinguisherAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-extinguisher'),
            frameRate: 10,
            repeat: -1
        });

        // Play animation
        let cloudSprite = scene.add.sprite(x, y, 'set-extinguisher').setDepth(1).setScale(0.75, 0.75);
        cloudSprite.play('extinguisherAnimConfig');
        scene.time.delayedCall(3000, () => {
            cloudSprite.destroy();
        });

        // Destory fire
        fireSprite.destroy();
    }

    //----------------------------------
    ////// FIRETRUCK ASSET /////
    useFiretruck(scene, x, y, fireSprite) {
        console.log("Fire truck activated!");
            
        // Register truck animation
        scene.anims.create({
            key: "firetruckAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-firetruck'),
            frameRate: 10,
            repeat: -1
        });

        // Play animation
        let truckSprite = scene.add.sprite(x + 40, y, 'set-firetruck').setDepth(1).setScale(1.3, 1.3);
        truckSprite.play('firetruckAnimConfig');
        scene.time.delayedCall(3000, () => {
            truckSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(3000, () => {
            fireSprite.destroy();
        });
    }

    //----------------------------------
    ////// HELICOPTER ASSET /////
    useHelicopter(scene, x, y, fireSprite) {
        console.log("Helicopter activated!");
            
        // Register truck animation
        scene.anims.create({
            key: "helicopterAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-helicopter'),
            frameRate: 30,
            repeat: -1
        });

        // Play animation
        let helicopterSprite = scene.add.sprite(x, y - 40, 'set-helicopter').setDepth(1).setScale(1.5, 1.5);
        helicopterSprite.play('helicopterAnimConfig');
        scene.time.delayedCall(3500, () => {
            helicopterSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(3500, () => {
            fireSprite.destroy();
        });
    }

    //----------------------------------
    ////// AIRTANKER ASSET /////
    useAirtanker(scene, x, y, fireSprite) {
        console.log("Airtanker activated!");

        // Register truck animation
        scene.anims.create({
            key: "airtankerAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-airtanker'),
            frameRate: 30,
            repeat: -1
        });

        // Play animation
        let airtankerSprite = scene.add.sprite(x, y - 40, 'set-airtanker').setDepth(1).setScale(2.5, 2.5);
        airtankerSprite.play('airtankerAnimConfig');
        scene.time.delayedCall(1700, () => {
            airtankerSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(2000, () => {
            fireSprite.destroy();
        });
    }

    //----------------------------------
    ////// HOTSHOT CREW ASSET /////
    useHotshotCrew(scene, x, y, fireSprite) {
        console.log("Hotshot Crew activated!");

        // Register truck animation
        scene.anims.create({
            key: "hotshotAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-hotshot'),
            frameRate: 30,
            repeat: -1
        });

        // Play animation
        let airtankerSprite = scene.add.sprite(x + 40, y, 'set-hotshot').setDepth(1).setScale(1.0, 1.0);
        airtankerSprite.play('hotshotAnimConfig');
        scene.time.delayedCall(3000, () => {
            airtankerSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(3000, () => {
            fireSprite.destroy();
        });
    }

    //----------------------------------
    ////// SMOKEJUMPERS ASSET /////
    useSmokejumpers(scene, x, y, fireSprite) {
        console.log("Smokejumpers activated!");

        // Register truck animation
        scene.anims.create({
            key: "smokejumpersAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-smokejumpers'),
            frameRate: 30,
            repeat: -1
        });

        scene.anims.create({
            key: "smokejumpersGroundAnimConfig",
            frames: scene.anims.generateFrameNumbers('set-smokejumpers-dig'),
            frameRate: 30,
            repeat: -1
        });

        // Play animation
        let smokejumpersSprite = scene.add.sprite(x, y - 40, 'set-smokejumpers').setDepth(1).setScale(1.0, 1.0);
        

        smokejumpersSprite.play('smokejumpersAnimConfig');
        scene.time.delayedCall(2000, () => {
            smokejumpersSprite.destroy();
            let smokejumpersGroundSprite = scene.add.sprite(x, y, 'set-smokejumpers-dig').setDepth(1).setScale(0.5, 0.5);
            smokejumpersGroundSprite.play('smokejumpersGroundAnimConfig');
            scene.time.delayedCall(3000, () => {
                smokejumpersGroundSprite.destroy();
            }) 
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(4000, () => {
            fireSprite.destroy();
        });
    }
}
