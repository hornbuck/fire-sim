/**
 * @file HamburgerMenu.js
 * @description Implements a hamburger menu component for the Wildfire Command game.
 * The menu provides access to user settings, accessibility options, and game information.
 */

import { createDrawnButton } from './ButtonManager.js';
import AccessibilityPanel from './AccessibilityPanel.js';

export default class HamburgerMenu {
    /**
     * Creates a new hamburger menu instance.
     * @param {Phaser.Scene} scene - The Phaser scene to add the menu to.
     * @param {Object} options - Configuration options for the menu.
     */
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            x: options.x || 40,              // Default to left side position
            y: options.y || 30,              // Default Y position
            width: options.width || 250,
            backgroundColor: options.backgroundColor || 0x2d3436,
            buttonColor: options.buttonColor || 0x555555,
            buttonHoverColor: options.buttonHoverColor || 0x777777,
            iconColor: options.iconColor || 0xffffff,
            depth: options.depth || 1000,
            openDirection: options.openDirection || 'left', // Default to left opening
            menuItems: options.menuItems || [
                { text: 'Profile', key: 'profile' },
                { text: 'Leaderboard', key: 'leaderboard'},
                { text: 'Login/Logout', key: 'login' },
                // Uncomment once accessibility is implemented
                //{ text: 'Accessibility', key: 'accessibility' },
                //{ text: 'Settings', key: 'settings' },
                //{ text: 'Help', key: 'help' },
                //{ text: 'About', key: 'about' }
            ]
        };

        this.isOpen = false;
        this.container = null;
        this.button = null;
        this.menuPanel = null;
        this.menuItems = [];
        this.accessibilityPanel = null;

        this.init();
    }

    /**
     * Initialize the hamburger menu components.
     */
    init() {
        // Create container to hold all menu elements
        this.container = this.scene.add.container(0, 0).setDepth(this.options.depth);

        // Create hamburger button
        this.createMenuButton();

        // Create menu panel (initially hidden)
        this.createMenuPanel();

        // Create accessibility panel (as a separate component)
        this.createAccessibilityPanel();
    }

    /**
     * Creates the hamburger menu button.
     */
    createMenuButton() {
        // Create background for the button
        const buttonBg = this.scene.add.rectangle(
            this.options.x,
            this.options.y,
            40,
            40,
            this.options.buttonColor,
            0.7
        ).setInteractive()
        .setScrollFactor(0)
        .on('pointerover', () => { buttonBg.setFillStyle(this.options.buttonHoverColor, 0.8); })
        .on('pointerout', () => { buttonBg.setFillStyle(this.options.buttonColor, 0.7); })
        .on('pointerdown', () => { this.toggleMenu(); });

        // Create hamburger icon lines
        const iconX = this.options.x - 10;
        const iconY = this.options.y - 8;
        const lineWidth = 20;
        const lineHeight = 3;
        const lineSpacing = 6;

        // Create three lines for the hamburger icon
        this.iconLines = [
            this.scene.add.rectangle(iconX, iconY, lineWidth, lineHeight, this.options.iconColor).setScrollFactor(0),
            this.scene.add.rectangle(iconX, iconY + lineSpacing, lineWidth, lineHeight, this.options.iconColor).setScrollFactor(0),
            this.scene.add.rectangle(iconX, iconY + lineSpacing * 2, lineWidth, lineHeight, this.options.iconColor).setScrollFactor(0)
        ];

        // Add to container
        this.container.add([buttonBg, ...this.iconLines]);
        this.button = buttonBg;
    }

    /**
     * Creates the menu panel that slides out when the hamburger button is clicked.
     */
    createMenuPanel() {
        // Create panel background - position off screen to the left
        this.menuPanel = this.scene.add.rectangle(
            -this.options.width / 2, // Start off-screen to the left
            this.scene.cameras.main.height / 2,
            this.options.width,
            this.scene.cameras.main.height,
            this.options.backgroundColor,
            0.9
        ).setScrollFactor(0)
        .setVisible(false);

        // Add panel to container
        this.container.add(this.menuPanel);

        // Create menu items
        this.createMenuItems();
    }

    /**
     * Creates the menu items within the menu panel.
     */
    createMenuItems() {
        const startY = 100;
        const spacing = 50;

        this.options.menuItems.forEach((item, index) => {
            const y = startY + (index * spacing);
            
            // Create button for menu item - centered in left panel
            const menuItem = createDrawnButton(this.scene, {
                x: this.options.width / 2, // Center in panel
                y: y,
                width: this.options.width - 40,
                height: 40,
                backgroundColor: this.options.buttonColor,
                hoverColor: this.options.buttonHoverColor,
                text: item.text,
                fontSize: '16px',
                onClick: () => this.handleMenuItemClick(item.key)
            });

            // Make items invisible initially
            menuItem.button.setVisible(false);
            menuItem.buttonText.setVisible(false);
            
            // Store reference to menu items
            this.menuItems.push(menuItem);
            
            // Add to container
            this.container.add([menuItem.button, menuItem.buttonText]);
        });
    }

    /**
     * Creates the accessibility panel as a separate component.
     */
    createAccessibilityPanel() {
        // Create the accessibility panel instance
        this.accessibilityPanel = new AccessibilityPanel(this.scene, {
            depth: this.options.depth + 1,
            onSettingsApplied: (settings) => {
                console.log('Accessibility settings applied:', settings);
                // Additional actions after settings are applied can go here
            }
        });
    }

    /**
     * Handle menu item clicks.
     * @param {string} key - The key of the clicked menu item.
     */
    handleMenuItemClick(key) {
        console.log(`Menu item clicked: ${key}`);
        
        switch(key) {
            case 'accessibility':
                this.showAccessibilityPanel();
                break;
            case 'profile':
                // Handle profile action
                if (this.scene.scene) {
                    this.scene.scene.launch('ProfileScene');
                }
                this.toggleMenu();
                break;
            case 'leaderboard':
                // Handle profile action
                if (this.scene.scene) {
                    this.scene.scene.launch('LeaderboardScene');
                }
                this.toggleMenu();
                break;
            case 'login':
                // Check if user is logged in
                const auth = window.firebase?.auth?.();
                const isLoggedIn = auth && auth.currentUser;
                
                if (isLoggedIn) {
                    // If logged in, show logout confirmation
                    this.showLogoutConfirmation();
                } else {
                    // If not logged in, navigate to login scene
                    if (this.scene.scene) {
                        this.scene.scene.start('LoginScene');
                    }
                }
                this.toggleMenu();
                break;
            // Uncomment and implement these cases as needed
            /*case 'settings':
                // Handle settings action
                if (this.scene.events) {
                    this.scene.events.emit('openSettings');
                }
                this.toggleMenu();
                break;
                */
            /*case 'help':
                // Handle help action
                if (this.scene.events) {
                    this.scene.events.emit('openHelp');
                }
                this.toggleMenu();
                break;
                */
            /*case 'about':
                // Handle about action
                if (this.scene.events) {
                    this.scene.events.emit('openAbout');
                }
                this.toggleMenu();
                break;
                */
            default:
                this.toggleMenu();
                break;
        }
    }

    /**
     * Show the accessibility options panel.
     */
    showAccessibilityPanel() {
        this.accessibilityPanel.show();
        this.toggleMenu(); // Close the menu
    }

    /**
     * Hide the accessibility options panel.
     */
    hideAccessibilityPanel() {
        this.accessibilityPanel.hide();
    }

    /**
     * Show logout confirmation dialog.
     */
    showLogoutConfirmation() {
        // Create a confirmation dialog
        const dialogContainer = this.scene.add.container(0, 0)
            .setDepth(this.options.depth + 10);
        
        // Add background overlay
        const overlay = this.scene.add.rectangle(
            0, 
            0, 
            this.scene.cameras.main.width, 
            this.scene.cameras.main.height, 
            0x000000, 
            0.7
        ).setOrigin(0, 0);
        
        // Add dialog panel
        const panel = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            400,
            250,
            0x2d3436,
            0.95
        ).setStrokeStyle(3, 0x555555);
        
        // Add dialog title
        const title = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 80,
            'Confirm Logout',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Add message
        const message = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 30,
            'Are you sure you want to logout?',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 350 }
            }
        ).setOrigin(0.5);
        
        // Add buttons
        const logoutButton = createDrawnButton(this.scene, {
            x: this.scene.cameras.main.width / 2 - 100,
            y: this.scene.cameras.main.height / 2 + 50,
            width: 140,
            height: 40,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: 'Logout',
            fontSize: '14px',
            onClick: () => {
                // Perform logout
                const auth = window.firebase?.auth?.();
                if (auth) {
                    auth.signOut()
                        .then(() => {
                            console.log('User signed out');
                            // Redirect to login scene
                            this.scene.scene.start('LoginScene');
                        })
                        .catch(error => {
                            console.error('Error signing out:', error);
                        });
                }
                dialogContainer.destroy();
            }
        });
        
        const cancelButton = createDrawnButton(this.scene, {
            x: this.scene.cameras.main.width / 2 + 100,
            y: this.scene.cameras.main.height / 2 + 50,
            width: 140,
            height: 40,
            backgroundColor: 0x555555,
            hoverColor: 0x777777,
            text: 'Cancel',
            fontSize: '14px',
            onClick: () => {
                dialogContainer.destroy();
            }
        });
        
        // Add all elements to the container
        dialogContainer.add([
            overlay,
            panel,
            title,
            message,
            logoutButton.button,
            logoutButton.buttonText,
            cancelButton.button,
            cancelButton.buttonText
        ]);
        
        // Close when clicking overlay
        overlay.setInteractive()
            .on('pointerdown', () => {
                dialogContainer.destroy();
            });
    }

    /**
     * Toggle the menu open/closed state.
     */
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Toggle menu panel visibility
        this.menuPanel.setVisible(this.isOpen);
        
        // Toggle menu items visibility
        this.menuItems.forEach(item => {
            item.button.setVisible(this.isOpen);
            item.buttonText.setVisible(this.isOpen);
        });
        
        // Animate hamburger icon to X or back
        this.animateIcon();
        
        // Animate menu panel sliding in/out
        this.animateMenuPanel();
    }

    /**
     * Animate the hamburger icon to an X or back to hamburger.
     */
    animateIcon() {
        if (this.isOpen) {
            // Animate to X
            this.scene.tweens.add({
                targets: this.iconLines[0],
                y: this.options.y,
                rotation: Math.PI / 4,
                duration: 300,
                ease: 'Power2'
            });
            
            this.scene.tweens.add({
                targets: this.iconLines[1],
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
            
            this.scene.tweens.add({
                targets: this.iconLines[2],
                y: this.options.y,
                rotation: -Math.PI / 4,
                duration: 300,
                ease: 'Power2'
            });
        } else {
            // Animate back to hamburger
            this.scene.tweens.add({
                targets: this.iconLines[0],
                y: this.options.y - 8,
                rotation: 0,
                duration: 300,
                ease: 'Power2'
            });
            
            this.scene.tweens.add({
                targets: this.iconLines[1],
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
            
            this.scene.tweens.add({
                targets: this.iconLines[2],
                y: this.options.y + 4,
                rotation: 0,
                duration: 300,
                ease: 'Power2'
            });
        }
    }

    /**
     * Animate the menu panel sliding in/out.
     */
    animateMenuPanel() {
        if (this.isOpen) {
            // Slide in from left
            this.scene.tweens.add({
                targets: this.menuPanel,
                x: this.options.width / 2, // Final position
                duration: 300,
                ease: 'Power2'
            });
        } else {
            // Slide out to left
            this.scene.tweens.add({
                targets: this.menuPanel,
                x: -this.options.width / 2, // Off screen to the left
                duration: 300,
                ease: 'Power2'
            });
        }
    }
}