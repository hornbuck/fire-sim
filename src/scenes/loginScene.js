/**
 * @file loginScene.js
 * @description login a user
 */

import Phaser from 'phaser';
import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload() {
        // Preload assets if needed.
    }

    create() {
        // Add a title text.
        this.add.text(300, 150, 'Please Log In', { fontSize: '32px', color: '#fff' });

        // Create a DOM element for the email input.
        const emailInput = this.add.dom(400, 250, 'input', {
            width: '200px',
            height: '20px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        emailInput.node.setAttribute('type', 'email');
        emailInput.node.setAttribute('name', 'email');
        emailInput.node.setAttribute('placeholder', 'Email');

        // Create a DOM element for the password input.
        const passwordInput = this.add.dom(400, 300, 'input', {
            width: '200px',
            height: '20px',
            fontSize: '16px',
            padding: '5px',
        }).setOrigin(0.5);
        passwordInput.node.setAttribute('type', 'password');
        passwordInput.node.setAttribute('name', 'password');
        passwordInput.node.setAttribute('placeholder', 'Password');

        // Create a DOM element for the Login button.
        const loginButton = this.add.dom(400, 350, 'button', {
            width: '100px',
            height: '40px',
            fontSize: '16px',
        }, 'Login').setOrigin(0.5);

        // Add a click event listener to the button.
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
                    // Transition to the MainScene on success.
                    this.scene.start('MainScene');
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    alert(`Login failed: ${error.message}`);
                });
        });

        // Optional: Create a button to go back to the Login scene.
        const signupButton = this.add.dom(400, 420, 'button', {
            width: '130px',
            height: '40px',
            fontSize: '16px',
        }, 'Back to Signup').setOrigin(0.5);

        signupButton.addListener('click');
        signupButton.on('click', () => {
            this.scene.start('SignupScene');
        });
    }
}
