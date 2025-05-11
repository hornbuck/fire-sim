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
     * Preloads assets required for the scene.
     */
    preload() {
        // Load WebFont for consistent styling
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        
        // Load background image if needed
        this.load.image('login-bg', 'assets/ui/login-background.png');
    }

    /**
     * Sets up the scene, including buttons and user input fields
     */
    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create dark overlay background
        this.add.rectangle(centerX, centerY, width, height, 0x2d3436, 0.9);
        
        // Create styled container for login form
        const container = this.add.rectangle(centerX, centerY, 500, 400, 0x3c3c3c)
            .setStrokeStyle(3, 0x555555);

        // Add a fun title text with a retro arcade feel
        const title = this.add.text(centerX, centerY - 150, 'LOGIN', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '36px',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Create a DOM element for the email input with styled container
        const emailContainer = this.add.rectangle(centerX, centerY - 60, 400, 50, 0x555555)
            .setStrokeStyle(2, 0x777777);
            
        const emailInput = this.add.dom(centerX, centerY - 60, 'input', {
            width: '380px',
            height: '42px',
            fontSize: '16px',
            padding: '5px',
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: 'none'
        }).setOrigin(0.5);
        emailInput.node.setAttribute('type', 'email');
        emailInput.node.setAttribute('name', 'email');
        emailInput.node.setAttribute('placeholder', 'Enter Email');
        emailInput.node.classList.add('input-field');
        
        // Email label
        this.add.text(centerX - 190, centerY - 85, 'EMAIL', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0);

        // Create a DOM element for the password input with styled container
        const passwordContainer = this.add.rectangle(centerX, centerY, 400, 50, 0x555555)
            .setStrokeStyle(2, 0x777777);
            
        const passwordInput = this.add.dom(centerX, centerY, 'input', {
            width: '380px',
            height: '42px',
            fontSize: '16px',
            padding: '5px',
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: 'none'
        }).setOrigin(0.5);
        passwordInput.node.setAttribute('type', 'password');
        passwordInput.node.setAttribute('name', 'password');
        passwordInput.node.setAttribute('placeholder', 'Enter Password');
        passwordInput.node.classList.add('input-field');
        
        // Password label
        this.add.text(centerX - 190, centerY - 25, 'PASSWORD', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0);

        // Error message text (initially hidden)
        const errorText = this.add.text(centerX, centerY + 40, '', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '12px',
            color: '#ff5555',
            align: 'center'
        }).setOrigin(0.5);

        // Create styled buttons instead of DOM buttons
        const loginBtn = createDrawnButton(this, {
            x: centerX,
            y: centerY + 80,
            width: 200,
            height: 50,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: 'LOGIN',
            fontSize: '18px',
            onClick: () => this.handleLogin(emailInput, passwordInput, errorText)
        });

        // Create sign up button
        const signupBtn = createDrawnButton(this, {
            x: centerX,
            y: centerY + 150,
            width: 240,
            height: 40,
            backgroundColor: 0x228B22,
            hoverColor: 0x2E8B57,
            text: 'NEW USER?',
            fontSize: '14px',
            onClick: () => {
                this.scene.start('SignupScene');
            }
        });

        // PLAY button to bypass login
        const playBtn = createDrawnButton(this, {
            x: width - 100,
            y: 50,
            width: 130,
            height: 40,
            backgroundColor: 0x4169E1,
            hoverColor: 0x5A7EE5,
            text: 'PLAY',
            fontSize: '16px',
            onClick: () => {
                console.log("PLAY button clicked - starting game");
                this.startGame();
            }
        });

        // Apply styling consistently to DOM elements
        this.styleInputs();
        
        // Load WebFont
        if (typeof WebFont !== 'undefined') {
            WebFont.load({
                google: {
                    families: ['Press Start 2P']
                },
                active: () => {
                    // Refresh text rendering after font loads
                    title.setText(title.text);
                    errorText.setText(errorText.text);
                }
            });
        }
    }

    /**
     * Apply consistent styling to input fields
     */
    styleInputs() {
        // Find all input elements and apply styles
        const inputs = document.querySelectorAll('.input-field');
        inputs.forEach(input => {
            input.style.fontFamily = '"Press Start 2P", cursive';
            input.style.fontSize = '14px';
            input.style.color = '#ffffff';
            input.style.backgroundColor = 'transparent';
            input.style.border = 'none';
            input.style.outline = 'none';
            
            // Focus styling
            input.addEventListener('focus', () => {
                input.parentElement.style.border = '2px solid #FFD700';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.border = 'none';
            });
        });
    }

    /**
     * Handle login form submission
     */
    handleLogin(emailInput, passwordInput, errorText) {
        const email = emailInput.node.value;
        const password = passwordInput.node.value;

        if (!email || !password) {
            errorText.setText('Please enter both email and password.');
            return;
        }

        // Show loading state
        errorText.setText('Logging in...').setColor('#ffffff');

        // Use Firebase to sign in the user
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential);
                // Transition to game after successful login
                this.startGame();
            })
            .catch((error) => {
                console.error('Login error:', error);
                errorText.setText(`Login failed: ${error.message}`).setColor('#ff5555');
                
                // Shake effect on error
                this.tweens.add({
                    targets: errorText,
                    x: centerX - 5,
                    duration: 50,
                    yoyo: true,
                    repeat: 5
                });
            });
    }

    /**
     * Start the game from the beginning by reloading the page
     * This ensures a clean state for all scenes
     */
    startGame() {
        console.log("Starting game...");
        
        // Store a flag in sessionStorage to indicate we want to skip intro
        // and go directly to the game after reload
        sessionStorage.setItem('skipIntro', 'true');
        
        // Start MapScene and UIScene
        this.scene.start('MapScene');
        this.scene.launch('UIScene');
    }
}