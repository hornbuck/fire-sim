// src/scenes/signupScene.js
import Phaser from 'phaser';
import MapScene from './MapScene.js';
import UIScene from './UIScene.js';
import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


/**
 * Represents the Signup scene for new user's.
 */
export default class SignupScene extends Phaser.Scene {
    /**
     * Constructs the SignupScene class.
     */
    constructor() {
        super({ key: 'SignupScene' });
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

        // Add a title text.
        this.add.text(300, 100, 'Sign Up', { fontSize: '32px', color: '#fff' });

        // Create the Name input field.
        const nameInput = this.add.dom(400, 170, 'input', {
            width: '200px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        nameInput.node.setAttribute('type', 'text');
        nameInput.node.setAttribute('name', 'name');
        nameInput.node.setAttribute('placeholder', 'Name');
        nameInput.node.classList.add('input-field');

        // Create the Email input field.
        const emailInput = this.add.dom(400, 220, 'input', {
            width: '200px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        emailInput.node.setAttribute('type', 'email');
        emailInput.node.setAttribute('name', 'email');
        emailInput.node.setAttribute('placeholder', 'Email');
        emailInput.node.classList.add('input-field');

        // Create the Password input field.
        const passwordInput = this.add.dom(400, 270, 'input', {
            width: '200px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        passwordInput.node.setAttribute('type', 'password');
        passwordInput.node.setAttribute('name', 'password');
        passwordInput.node.setAttribute('placeholder', 'Password');
        passwordInput.node.classList.add('input-field');

        // Create the Repeat Password input field.
        const repeatPasswordInput = this.add.dom(400, 320, 'input', {
            width: '200px',
            height: '30px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        repeatPasswordInput.node.setAttribute('type', 'password');
        repeatPasswordInput.node.setAttribute('name', 'repeatPassword');
        repeatPasswordInput.node.setAttribute('placeholder', 'Repeat Password');
        repeatPasswordInput.node.classList.add('input-field');

        // Create the SignUp button.
        // Create a DOM element for the Login button.
        const signupButton = this.add.dom(460, 380, 'button', {
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
        }, 'Sign Up').setOrigin(0.5);

        signupButton.addListener('click');
        signupButton.on('click', () => {
            const name = nameInput.node.value.trim();
            const email = emailInput.node.value.trim();
            const password = passwordInput.node.value;
            const repeatPassword = repeatPasswordInput.node.value;

            // Validate input fields.
            if (!name || !email || !password || !repeatPassword) {
                alert('Please fill in all fields.');
                return;
            }

            if (password !== repeatPassword) {
                alert('Passwords do not match.');
                return;
            }

            // Use Firebase Authentication to create the user.
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // User successfully created.
                    const user = userCredential.user;
                    // Update the user's profile with the display name.
                    updateProfile(user, { displayName: name })
                        .then(() => {
                            console.log('Login successful:', userCredential);

                            // Stop SignupScene
                            this.scene.stop('SignupScene');

                            // Start MapScene and UIScene
                            this.scene.start('MapScene');
                            this.scene.launch('UIScene');

                        })
                        .catch((error) => {
                            console.error('Profile update error:', error);
                            alert('Failed to update profile: ' + error.message);
                        });
                })
                .catch((error) => {
                    console.error('Sign up error:', error);
                    alert('Sign up failed: ' + error.message);
                });
        });

        // Optional: Create a button to go back to the Login scene.
        // Create a DOM element for the "Back to Signup" button.
        const loginButton = this.add.dom(315, 380, 'button', {
            width: '100px',
            height: '30px',
            font: '16px "Georgia", serif',
            padding: { x: 15, y: 10 },
            fontSize: '20px',
            color: '#fff',
            backgroundColor: '#556B2F',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            cursor: 'pointer',
        }, 'Login').setOrigin(0.5);

        loginButton.addListener('click');
        loginButton.on('click', () => {
            this.scene.start('LoginScene');
        });

        // Optional: Create a button to go back to the Login scene.
        const toGame = this.add.dom(700, 20, 'button', {
            width: '130px',
            height: '40px',
            fontSize: '16px',
        }, 'PLAY').setOrigin(0.5);

        toGame.addListener('click');
        toGame.on('click', () => {
            // Stop SignupScene
            this.scene.stop('SignupScene');

            // Start MapScene and UIScene
            this.scene.start('MapScene');
            this.scene.launch('UIScene');
        });
    }
}
