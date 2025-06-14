/**
 * @file loginScene.js
 * @description login a user
 */

// Imports
import Phaser from 'phaser';
import MapScene from './MapScene.js';
import UIScene from './UIScene.js';
import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createDrawnButton } from '../components/ButtonManager.js';


/**
 * Represents the login scene for user authentication.
 */
export default class LoginScene extends Phaser.Scene {
    /**
     * Constructs the LoginScene class.
     */
    constructor() {
        super({key: 'LoginScene'});
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
        // remove any captures so W/A/S/D go to the browser again
        this.input.keyboard.removeCapture([
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,
        ]);
        
        // Brings elements of scene to the top
        this.scene.bringToTop();

        // full‐screen semi‑transparent overlay
        const { width, height } = this.scale;

        // draw a dark overlay behind everything
        this.add.rectangle(0, 0, width, height, 0x000000, .90)
        .setOrigin(0)
        .setInteractive();

        // remove any captures so W/A/S/D go to the browser again
        this.input.keyboard.removeCapture([
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,
        ]);

        // Add a fun title text with a retro arcade feel.
        this.add.text(400, 150, 'Log In', {
            fontSize: '25px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", cursive',
            stroke: '#000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setDepth(1000);

        // Create a DOM element for the email input.
        const emailInput = this.add.dom(400, 200, 'input', {
            width: '500px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        emailInput.node.setAttribute('type', 'email');
        emailInput.node.setAttribute('name', 'email');
        emailInput.node.setAttribute('placeholder', 'Email');
        emailInput.node.classList.add('input-field');

        // Create a DOM element for the password input.
        const passwordInput = this.add.dom(400, 260, 'input', {
            width: '500px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        passwordInput.node.setAttribute('type', 'password');
        passwordInput.node.setAttribute('name', 'password');
        passwordInput.node.setAttribute('placeholder', 'Password');
        passwordInput.node.classList.add('input-field');

        // Create a DOM element for the Login button.
        const loginButton = this.add.dom(470, 320, 'button', {
            width: '140px',
            height: '30px',
            fontSize: '12px',
            color: '#FFFFFF',
            backgroundColor: '#228B22',
            fontFamily: '"Press Start 2P", cursive',
            border: '2px solid #FFFFFF',
            cursor: 'pointer'
        }, 'LOGIN').setOrigin(0.5);

        // Add a click event listener to the login button.
        loginButton.addListener('click');
        loginButton.on('click', () => {
            const email = emailInput.node.value;
            const password = passwordInput.node.value;

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            // Use Firebase to sign in the user.
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('Login successful:', userCredential);
                    // Transition to game after successful login
                    // Reenable the MapScene and UIScene input
                    this.scene.start('MapScene');
                    this.scene.launch('UIScene');

                                
                    this.startGame();
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    alert(`Login failed: ${error.message}`);
                });



        });

        // Create a DOM element for the "Back to Signup" button.
        const signupButton = this.add.dom(315, 320, 'button', {
            width: '140px',
            height: '30px',
            fontSize: '12px',
            color: '#FFFFFF',
            backgroundColor: '#555555',
            fontFamily: '"Press Start 2P", cursive',
            border: '2px solid #FFFFFF',
            cursor: 'pointer'
        }, 'NEW USER?').setOrigin(0.5);

        signupButton.addListener('click');
        signupButton.on('click', () => {
            this.scene.start('SignupScene');
        });
        
        // Listen to Firebase auth changes
        auth.onAuthStateChanged(user => {
            // If there’s a user, show the logout button
            if (user) {
                // Create the Logout button in the top-left
                this.logoutButton = this.add.dom(50, 20, 'button', {
                    width: '100px',
                    height: '30px',
                    fontSize: '12px',
                    color: '#FFFFFF',
                    backgroundColor: '#8B0000',
                    fontFamily: '"Press Start 2P", cursive',
                    border: '2px solid #FFFFFF',
                    cursor: 'pointer'
                }, 'LOGOUT')
                    .setOrigin(0, 0);

                this.logoutButton.addListener('click');
                this.logoutButton.on('click', () => {
                    signOut(auth)
                    .then(() => {
                        console.log('User logged out');
                        this.startGame()
                    })
                    .catch(err => console.error('Logout failed:', err));
                });
             } else if (this.logoutButton) {
            // No user: remove the button if it exists
            this.logoutButton.destroy();
            this.logoutButton = null;
            }
        });

        // “X” close button in top-right
        const closeBtn = this.add.text(30, 10, '✕', {
            fontSize: '24px',
            color: '#fff',
            backgroundColor: 'transparent',
            fontFamily: '"Press Start 2P", cursive',
        })
        .setOrigin(1, 0)                // align top-right corner
        .setInteractive({ useHandCursor: true })
        .setDepth(1000)
        .on('pointerdown', () => 
            this.scene.stop(),
        );

        // optional hover effect
        closeBtn.on('pointerover',  () => closeBtn.setStyle({ color: '#f00' }));
        closeBtn.on('pointerout',   () => closeBtn.setStyle({ color: '#fff' }));
    }

    /**
     * Start the game from the beginning by reloading the page
     * This ensures a clean state for all scenes
     */
    startGame() {
        console.log("Restarting game...");
        
        // Store a flag in sessionStorage to indicate we want to skip intro
        // and go directly to the game after reload
        sessionStorage.setItem('skipIntro', 'true');
        
        // Force a complete reload of the page
        window.location.reload();
    }
}