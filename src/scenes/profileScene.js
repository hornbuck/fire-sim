// Imports
import Phaser from 'phaser';
import { auth } from '../firebaseConfig.js';
 /**
 * Represents the Profile scene for a user.
 */
export default class ProfileScene extends Phaser.Scene {
    /**
     * Constructs the ProfileScene class.
     */
    constructor() {
        super({ key: 'ProfileScene' });
    }

    /**
     * Preloads assets required for the scene, if needed.
     */
    preload() {
        // Preload assets if needed.
    }

    /**
     * Sets up the scene, including buttons and user input fields
     */
    create() {
    
    // Stop MapScene
    

    // full‐screen semi‑transparent overlay
    const { width, height } = this.scale;

    // 1) draw a dark overlay behind everything
    this.add.rectangle(0, 0, width, height, 0x000000, 0.93)
        .setOrigin(0)
        .setInteractive();    

    // grab current user (or “Guest”)
    const user     = auth.currentUser;
    const username = user ? user.displayName : 'Guest';

    // draw a simple DOM <div> showing “Username: …”
    this.profileBox = this.add.dom(150, 70, 'div', {
      width: '200px',
      height: '40px',
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#228B22',
      fontFamily: '"Press Start 2P", cursive',
      border: '2px solid #fff',
      padding: '5px',
      textAlign: 'left',
      cursor: 'pointer'
    }, `Username: ${username}`)
      .setOrigin(0.5);

    // 3) “X” close button in top-right
    const closeBtn = this.add.text(30, 10, '✕', {
        fontSize: '24px',
        color: '#fff',
        backgroundColor: 'transparent',
        fontFamily: '"Press Start 2P", cursive',
    })
    .setOrigin(1, 0)                // align top-right corner
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => 
        this.scene.stop(),
    );

    // optional hover effect
    closeBtn.on('pointerover',  () => closeBtn.setStyle({ color: '#f00' }));
    closeBtn.on('pointerout',   () => closeBtn.setStyle({ color: '#fff' }));
    }   
}
