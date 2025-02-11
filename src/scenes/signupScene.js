// src/scenes/signupScene.js
import Phaser from 'phaser';
import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default class SignupScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SignupScene' });
    }

    preload() {
        // Preload assets if needed.
    }

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

        // Create the SignUp button.
        const signupButton = this.add.dom(400, 370, 'button', {
            width: '100px',
            height: '40px',
            fontSize: '16px',
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
                            console.log('User profile updated.');
                            // Transition to MainScene (or any scene you desire).
                            this.scene.start('MainScene');
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
        const loginButton = this.add.dom(400, 420, 'button', {
            width: '130px',
            height: '40px',
            fontSize: '16px',
        }, 'Back to Login').setOrigin(0.5);

        loginButton.addListener('click');
        loginButton.on('click', () => {
            this.scene.start('LoginScene');
        });

        const toGame = this.add.dom(700, 20, 'button', {
            width: '130px',
            height: '40px',
            fontSize: '16px',
        }, 'ENTER GAME').setOrigin(0.5);

        toGame.addListener('click');
        toGame.on('click', () => {
            this.scene.start('MainScene');
        });
    }
}
