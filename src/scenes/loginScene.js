/**
 * @file loginScene.js
 * @description login a user
 */

// Imports
import Phaser from 'phaser';
import MapScene from './MapScene.js';
import UIScene from './UIScene.js';
import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
        // Stop MapScene
        if (this.scene.isActive('MapScene')) {
            this.scene.stop('MapScene');
        }

        // Add a fun title text with a retro arcade feel.
        this.add.text(400, 150, 'Log In', {
            fontSize: '25px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", cursive',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create a DOM element for the email input.
        const emailInput = this.add.dom(400, 200, 'input', {
            width: '200px',
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
            width: '200px',
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

        // Create a PLAY button to bypass login and go directly to the game
        const toGame = this.add.dom(395, 370, 'button', {
            width: '200px',
            height: '35px',
            fontSize: '14px',
            color: '#FFFFFF',
            backgroundColor: '#8B0000',
            fontFamily: '"Press Start 2P", cursive',
            border: '2px solid #FFFFFF',
            cursor: 'pointer'
        }, 'MAIN MENU').setOrigin(0.5);

        toGame.addListener('click');
        toGame.on('click', () => {
            console.log("PLAY button clicked - starting game");
            this.startGame();
        });
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