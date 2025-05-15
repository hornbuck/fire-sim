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
     * Sets up the scene
     */
    async create() {

    // grab current user (or “Guest”)
    const user     = auth.currentUser;
    const username = user ? user.displayName : 'Guest';

    // Compute the exact center of the game canvas:
    const centerX = this.cameras.main.width  * 0.5;
    const centerY = this.cameras.main.height * 0.5;

    // full‐screen semi‑transparent overlay
    const { width, height } = this.scale;

    // draw a dark overlay behind everything
    this.add.rectangle(0, 0, width, height, 0x000000, 0.70)
        .setOrigin(0)
        .setInteractive();    

    
    // Grab the running MapScene instance
    const mapScene = this.scene.get('MapScene');
    // Guard: ensure MapScene exists and exposes our helper
    if (!mapScene || typeof mapScene.getTopNScores !== 'function') {
        console.warn('MapScene or getTopNScores not available');
        return;  // bail out if we can’t fetch scores
    }

    // Fetch the top 5 scores (returns an array of numbers)
    const topScores = await mapScene.getTopNScores(5);

    // Build the list‑item HTML for each score
    //    e.g. "<li>#1: 1200</li><li>#2: 950</li>…"
    const listItems = topScores
        .map((s, i) => 
            `<li style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,215,0,0.3);
          ">
            <span>#${i + 1}</span>
            <span>${s}</span>
          </li>
        `)
        .join('');

    // Create an empty DOM <div> as our score panel container
    this.scorePanel = this.add.dom(centerX, centerY, 'div', {
        width:           '500px',
        maxHeight:       '500px',                // limit height, enable scroll
        overflowY:       'auto',                 // vertical scroll if needed
        backgroundColor: 'rgba(0, 0, 0, 0.85)',  // dark translucent backdrop
        border:          '3px solid #FFFFFF',    // gold border
        borderRadius:    '10px',                 // rounded corners
        padding:         '12px',                 // inner spacing
        boxSizing:       'border-box',           // include padding in width
        fontFamily:      '"Press Start 2P", cursive',
        color:           '#FFD700',              // gold text
        textAlign:       'center',               // center align all text
        fontSize:        '16px'                  // readable retro font size
    }, '')
    .setOrigin(0.5);                          // center the panel on (400,300)

    // Inject our HTML content into that panel’s innerHTML based on if user is logged in
    if (user){
        const html = `
            <h2 style="text-align:center; margin:0 0 12px;">${username}'s High Scores</h2>

            <!-- header flex row -->
            <div class="leader-header" style="
                display:flex;
                justify-content:space-between;
                font-weight:bold;
                padding:6px 0;
                border-bottom:2px solid #FFD700;
            ">
                <span>Rank</span>
                <span>Score</span>
            </div>

            <ol class="score-list">
                ${listItems}
            </ol>
        `;
        this.scorePanel.node.innerHTML = html;
    } else {
        const html = `
        <h2>Please sign up if would like to save your scores</h2>
    `;
        this.scorePanel.node.innerHTML = html;
    }

    // Tag the panel for scoped CSS styling
    this.scorePanel.node.classList.add('score-panel');

    // Dynamically inject CSS rules for our list formatting
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
        color: #FFFFFF;
    }
    .score-panel .score-list li:last-child {
        border-bottom: none;                /* no line after last item */
    }
    .score-panel h2 {
        color: #FFD700;
        font-size: 20px;
    }
    `;
    document.head.append(style);

    // Measure its rendered height
    const panelHeight = this.scorePanel.node.clientHeight;

    // Compute Y so that the profileBox sits just above it
    const margin = 8;  // gap between profileBox and panel
    const profileY = centerY - panelHeight / 2 - margin;

    // “X” close button in top-right
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

    //OPTIONAL: reposition on window resize
    this.scale.on('resize', (gameSize) => {
        const { width, height } = gameSize;
        this.scorePanel.setPosition(width * 0.5, height * 0.5);
    });

    } 
    
}
