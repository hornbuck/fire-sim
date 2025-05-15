// src/scenes/signupScene.js
import Phaser from 'phaser';
import MapScene from './MapScene.js';
import UIScene from './UIScene.js';
import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";


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
        // Title
        this.add.text(400, 120, 'Sign Up', {
            fontSize: '25px',
            fill: '#FFD700',
            fontFamily: '"Press Start 2P", cursive',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
    
        // Input fields
        const fields = [
            { placeholder: 'Username', y: 180, type: 'text' },
            { placeholder: 'Email', y: 230, type: 'email' },
            { placeholder: 'Password', y: 280, type: 'password' },
            { placeholder: 'Repeat Password', y: 330, type: 'password' },
        ];
    
        const inputRefs = {};
    
        fields.forEach(field => {
            const input = this.add.dom(400, field.y, 'input', {
                width: '250px',
                height: '30px',
                fontSize: '16px',
                padding: '5px',
            }).setOrigin(0.5);
            input.node.setAttribute('type', field.type);
            input.node.setAttribute('placeholder', field.placeholder);
            input.node.classList.add('input-field');
            inputRefs[field.placeholder] = input;
        });
    
        // SIGN UP button
        const signupButton = this.add.dom(470, 390, 'button', {
            width: '140px',
            height: '30px',
            fontSize: '12px',
            color: '#FFFFFF',
            backgroundColor: '#228B22',
            fontFamily: '"Press Start 2P", cursive',
            border: '2px solid #FFFFFF',
            cursor: 'pointer'
        }, 'SIGN UP').setOrigin(0.5);
    
        signupButton.addListener('click');
        signupButton.on('click', () => {
            const name = inputRefs['Username'].node.value.trim();
            const email = inputRefs['Email'].node.value.trim();
            const password = inputRefs['Password'].node.value;
            const repeatPassword = inputRefs['Repeat Password'].node.value;
    
            if (!name || !email || !password || !repeatPassword) {
                alert('Please fill in all fields.');
                return;
            }
            if (password !== repeatPassword) {
                alert('Passwords do not match.');
                return;
            }
    
            createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
        const user = userCredential.user;

        // 1) Update the Auth profile
        await updateProfile(user, { displayName: name });

        // 2) Also write to Firestore under /users/{uid}
        await setDoc(doc(db, "users", user.uid), {
          displayName: name,
          email:       user.email,
          createdAt:   new Date()
        });

        // 3) Now you can safely launch your game scenes
        this.scene.start('MapScene');
        this.scene.launch('UIScene');
        this.startGame();
      })
      .catch(err => alert('Sign up failed: ' + err.message));
  });
    
        // LOGIN button
        const loginButton = this.add.dom(315, 390, 'button', {
            width: '140px',
            height: '30px',
            fontSize: '12px',
            color: '#FFFFFF',
            backgroundColor: '#555555',
            fontFamily: '"Press Start 2P", cursive',
            border: '2px solid #FFFFFF',
            cursor: 'pointer'
        }, 'LOGIN').setOrigin(0.5);
    
        loginButton.addListener('click');
        loginButton.on('click', () => {
            this.scene.start('LoginScene');
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
