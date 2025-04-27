import { technique, use_resource, cooldown } from './DeploymentClickEvents.js'
import { timerSprite } from './ui.js'

// ANIMATION LENGTH FOR EACH ASSET (in ms)
export let t_hose = 4000;
export let t_extinguisher = 3000;
export let t_firetruck = 3000;
export let t_helicopter = 3500;
export let t_airtanker = 1700;
export let t_hotshotcrew = 3000;
export let t_smokejumpers_plane = 2000;
export let t_smokejumpers_ground = 3000;

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
        console.log("Attempting to light fire...");
    
        if (!scene.anims.exists('fireAnimConfig')) {
            console.log("Creating fire animation...");
            scene.anims.create({
                key: "fireAnimConfig",
                frames: scene.anims.generateFrameNumbers('fire-blaze', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        } else {
            console.log("Fire animation already exists.");
        }
    
        let fireSprite = scene.add.sprite(sprite.x + 32, sprite.y, 'fire-blaze')
            .setDepth(900)
            .setScale(0.75);
    
        console.log("Fire sprite created:", fireSprite);
    
        if (scene.anims.exists('fireAnimConfig')) {
            console.log("Playing fire animation...");
            fireSprite.play('fireAnimConfig');
        } else {
            console.error("ERROR: Animation 'fireAnimConfig' does not exist!");
        }
    
        flameGroup.add(fireSprite);
    
        fireSprite.tile = sprite;
        fireSprite.setInteractive();
    
        fireSprite.on("pointerdown", function () {
            if (technique === 'WATER') {
                use_resource(scene, fireSprite.x, fireSprite.y, fireSprite);
            }
        });
    
        this.sprite = fireSprite;
    }
    
    // Extinguishes fire sprite (no user input required)
    extinguishFire() {
        this.sprite.destroy();
    }

    //----------------------------------
    ////// ASSET TIMER /////
    startTimer(index, scene, time, x, y) {
        console.log("Timer activated!");
        cooldown[index] = 1;                // cooldown is activated

        // Map Animations
        //--> Register timer animation
        if (!scene.anims.exists('set-timer')) {
            scene.anims.create({
                key: "timerAnimConfig",
                frames: scene.anims.generateFrameNumbers('set-timer'),
                frameRate: 30,
                repeat: -1
            });
        }

        // Play animation
        timerSprite.x = x;
        timerSprite.y = y;
        timerSprite.setVisible(true);
        timerSprite.play('timerAnimConfig');
        scene.time.delayedCall(time, () => {            
            timerSprite.setVisible(false);
            scene.anims.remove("timerAnimConfig");
            cooldown[index] = 0;                            // turns off cooldown
        });

        console.log(`Cooldown in StartTimer: ${cooldown[index]}`);
        
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
        let hoseSprite = scene.add.sprite(x + 40, y + 32, 'set-hose').setDepth(1000).setScale(1.5, 1.5);
        hoseSprite.play('hoseAnimConfig');
        scene.time.delayedCall(t_hose, () => {
            hoseSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_hose, () => {
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
        let cloudSprite = scene.add.sprite(x, y + 32, 'set-extinguisher').setDepth(1000).setScale(0.75, 0.75);
        cloudSprite.play('extinguisherAnimConfig');
        scene.time.delayedCall(t_extinguisher, () => {
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
        let truckSprite = scene.add.sprite(x + 40, y + 32, 'set-firetruck').setDepth(1000).setScale(1.3, 1.3);
        truckSprite.play('firetruckAnimConfig');
        scene.time.delayedCall(t_firetruck, () => {
            truckSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_firetruck, () => {
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
        let helicopterSprite = scene.add.sprite(x, y - 40, 'set-helicopter').setDepth(1000).setScale(1.5, 1.5);
        helicopterSprite.play('helicopterAnimConfig');
        scene.time.delayedCall(t_helicopter, () => {
            helicopterSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_helicopter, () => {
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
        let airtankerSprite = scene.add.sprite(x, y - 40, 'set-airtanker').setDepth(1000).setScale(4.5, 4.5);
        airtankerSprite.play('airtankerAnimConfig');
        scene.time.delayedCall(t_airtanker, () => {
            airtankerSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_airtanker, () => {
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
        let airtankerSprite = scene.add.sprite(x + 40, y + 28, 'set-hotshot').setDepth(1000).setScale(1.1, 1.1);
        airtankerSprite.play('hotshotAnimConfig');
        scene.time.delayedCall(t_hotshotcrew, () => {
            airtankerSprite.destroy();
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_hotshotcrew, () => {
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
        let smokejumpersSprite = scene.add.sprite(x, y - 40, 'set-smokejumpers').setDepth(1000).setScale(2.0, 2.0);

        smokejumpersSprite.play('smokejumpersAnimConfig');
        scene.time.delayedCall(t_smokejumpers_plane, () => {
            smokejumpersSprite.destroy();
            let smokejumpersGroundSprite = scene.add.sprite(x, y, 'set-smokejumpers-dig').setDepth(2).setScale(1.0, 1.0);
            smokejumpersGroundSprite.play('smokejumpersGroundAnimConfig');
            scene.time.delayedCall(t_smokejumpers_ground, () => {
                smokejumpersGroundSprite.destroy();
            }) 
        });

        // Destroy fire at end of animation
        scene.time.delayedCall(t_smokejumpers_ground, () => {
            fireSprite.destroy();
        });
        
    }
}
