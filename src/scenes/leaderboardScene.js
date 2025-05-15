// Imports
import Phaser from 'phaser';
import { auth } from '../firebaseConfig.js';
 /**
 * Represents the Profile scene for a user.
 */
export default class LeaderboardScene extends Phaser.Scene {
    /**
     * Constructs the LeaderboardScene class.
     */
    constructor() {
        super({ key: 'LeaderboardScene' });
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

        // grab current user
        const user     = auth.currentUser;
        
        // full‐screen semi‑transparent overlay
        const { width, height } = this.scale;

        // 1) draw a dark overlay behind everything
        this.add.rectangle(0, 0, width, height, 0x000000, 0.70)
            .setOrigin(0)
            .setInteractive(); 

        // 1) Grab the running MapScene instance
        const mapScene = this.scene.get('MapScene');
        // 1a) Guard: ensure MapScene exists and exposes our helper
        if (!mapScene || typeof mapScene.getGlobalTopNScores !== 'function') {
            console.warn('MapScene or getGlobalTopNScores not available');
            return;  // bail out if we can’t fetch scores
        }

        // 2) Fetch the top 5 scores (returns an array of numbers)
        const topScores = await mapScene.getGlobalTopNScores(5);

        // Build each <li> so it’s a flex container with
        // the name on the left and score on the right:
        const listItems = topScores
        .map(({ displayName, score }, i) => `
          <li style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,215,0,0.3);
          ">
            <span>#${i + 1}</span>
            <span>${displayName}</span>
            <span>${score}</span>
          </li>
        `)
        .join('');

    // 4) Create an empty DOM <div> container at screen center
    const panel = this.add.dom(380, 200, 'div', {
      width:           '600px',
      maxHeight:       '400px',
      overflowY:       'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      border:          '3px solid #FFFFFF',
      borderRadius:    '10px',
      padding:         '16px',
      boxSizing:       'border-box',
      fontFamily:      '"Press Start 2P", cursive',
      color:           '#FFD700',
      textAlign:       'left',
      fontSize:        '16px',
      lineHeight:      '1.4'
    }, '')
    .setOrigin(0.5);

    // 5) Inject your HTML into that panel
    const html = `
      <h2 style="text-align:center; margin:0 0 12px;">Global Leaderboard</h2>

      <!-- header flex row -->
      <div class="leader-header" style="
        display:flex;
        justify-content:space-between;
        font-weight:bold;
        padding:6px 0;
        border-bottom:2px solid #FFD700;
      ">
        <span>Rank</span>
        <span>&nbsp;Name</span>
        <span>Score</span>
      </div>

      <ol class="leader-list">
        ${listItems}
      </ol>
    `;
    panel.node.innerHTML = html;

    // 6) Tag it for scoped CSS
    panel.node.classList.add('leader-panel');

    // 7) Inject CSS to remove native markers & style separators
    const style = document.createElement('style');
    style.textContent = `
      .leader-panel .leader-list {
        list-style-type: none;
        margin: 0;
        padding-left: 0;
      }
      .leader-panel .leader-list li {
        padding: 6px 0;
        border-bottom: 1px solid rgba(255,215,0,0.3);
        color: #FFFFFF;
      }
      .leader-panel .leader-list li:last-child {
        border-bottom: none;
      }
      .leader-panel h2 {
        color: #FFD700;
        font-size: 20px;
      }
      .leader-panel li strong {
        color: #FFD700;
      }
    `;
    document.head.appendChild(style);

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
    }   

}