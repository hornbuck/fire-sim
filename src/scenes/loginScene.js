/**
 * @file loginScene.js
 * @description login a user
 */

// Imports
import Phaser from 'phaser';
import MainScene from './mainScene.js';
import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';


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

        // Add a fun title text with a retro arcade feel.
        this.add.text(400, 100, 'Please Log In', {
            fontSize: '36px',
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
        emailInput.node.setAttribute('placeholder', 'Enter Email');
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
        passwordInput.node.setAttribute('placeholder', 'Enter Password');
        passwordInput.node.classList.add('input-field');

        // Create a DOM element for the Login button.
        const loginButton = this.add.dom(470, 320, 'button', {
            width: '100px',
            height: '30px',
            font: '16px "Georgia", serif',
            padding: { x: 15, y: 10 },
            fontSize: '20px',
            color: '#fff',
            backgroundColor: '#8B0000',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            cursor: 'pointer',
        }, 'Login').setOrigin(0.5);

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
                    // Transition: stop LoginScene, re-add MainScene, then start MainScene.
                    this.scene.stop('LoginScene');
                    this.scene.add('MainScene', MainScene, false);
                    this.scene.start('MainScene');
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    alert(`Login failed: ${error.message}`);
                });
        });

        // Create a DOM element for the "Back to Signup" button.
        const signupButton = this.add.dom(315, 320, 'button', {
            width: '120px',
            height: '30px',
            font: '16px "Georgia", serif',
            padding: { x: 15, y: 10 },
            fontSize: '20px',
            color: '#fff',
            backgroundColor: '#556B2F',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            cursor: 'pointer',
        }, 'New User?').setOrigin(0.5);

        signupButton.addListener('click');
        signupButton.on('click', () => {
            this.scene.start('SignupScene');
        });
    }
}