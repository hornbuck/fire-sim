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
    async create() {

    // grab current user (or “Guest”)
    const user     = auth.currentUser;
    const username = user ? user.displayName : 'Guest';
    
    // 1) Grab the running MapScene instance
    const mapScene = this.scene.get('MapScene');
    // 1a) Guard: ensure MapScene exists and exposes our helper
    if (!mapScene || typeof mapScene.getTopNScores !== 'function') {
        console.warn('MapScene or getTopNScores not available');
        return;  // bail out if we can’t fetch scores
    }

    // 2) Fetch the top 5 scores (returns an array of numbers)
    const topScores = await mapScene.getTopNScores(5);

    // 3) Build the list‑item HTML for each score
    //    e.g. "<li>#1: 1200</li><li>#2: 950</li>…"
    const listItems = topScores
        .map((s, i) => `<li>#${i + 1}: ${s}</li>`)
        .join('');

    // 4) Create an empty DOM <div> as our score panel container
    const panel = this.add.dom(400, 200, 'div', {
        width:           '300px',
        maxHeight:       '200px',                // limit height, enable scroll
        overflowY:       'auto',                 // vertical scroll if needed
        backgroundColor: 'rgba(0, 0, 0, 0.85)',  // dark translucent backdrop
        border:          '3px solid #FFD700',    // gold border
        borderRadius:    '10px',                 // rounded corners
        padding:         '12px',                 // inner spacing
        boxSizing:       'border-box',           // include padding in width
        fontFamily:      '"Press Start 2P", cursive',
        color:           '#FFD700',              // gold text
        textAlign:       'center',               // center align all text
        fontSize:        '16px'                  // readable retro font size
    }, '')
    .setOrigin(0.5);                          // center the panel on (400,300)

    // 5) Inject our HTML content into that panel’s innerHTML based on if user is logged in
    if (user){
        const html = `
            <h2>High Scores</h2>
            <ol class="score-list">
                ${listItems}
            </ol>
        `;
        panel.node.innerHTML = html;
    } else {
        const html = `
        <h2>Please sign up if would like to save your scores</h2>
    `;
        panel.node.innerHTML = html;
    }
    

    // 6) Tag the panel for scoped CSS styling
    panel.node.classList.add('score-panel');

    // 7) Dynamically inject CSS rules for our list formatting
    const style = document.createElement('style');
    style.textContent = `
    .score-panel .score-list {
        list-style-type: none !important;  /* remove default numbering */
        margin: 0;
        padding-left: 0 !important;        /* remove indent */
    }
    .score-panel .score-list li {
        padding: 4px 0;                     /* vertical spacing */
        border-bottom: 1px solid rgba(255,215,0,0.3);  /* subtle separators */
    }
    .score-panel .score-list li:last-child {
        border-bottom: none;                /* no line after last item */
    }
    `;
    document.head.append(style);


    // full‐screen semi‑transparent overlay
    const { width, height } = this.scale;

    // 1) draw a dark overlay behind everything
    this.add.rectangle(0, 0, width, height, 0x000000, 0.93)
        .setOrigin(0)
        .setInteractive();    


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
