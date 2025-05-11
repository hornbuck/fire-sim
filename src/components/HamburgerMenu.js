/**
 * @file HamburgerMenu.js
 * @description Implements a hamburger menu component for the Wildfire Command game.
 * The menu provides access to user settings, accessibility options, and game information.
 */

import { createDrawnButton } from './ButtonManager.js';

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
                { text: 'Login/Logout', key: 'login' },
                { text: 'Accessibility', key: 'accessibility' },
                { text: 'Settings', key: 'settings' },
                { text: 'Help', key: 'help' },
                { text: 'About', key: 'about' }
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

        // Create accessibility panel (initially hidden)
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
     * Creates the accessibility options panel.
     */
    createAccessibilityPanel() {
        // Create panel container
        this.accessibilityPanel = this.scene.add.container(0, 0)
            .setDepth(this.options.depth + 1)
            .setVisible(false);
        
        // Create panel background
        const panelBg = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            400,
            500,
            0x2d3436,
            0.95
        ).setScrollFactor(0);
        
        // Create panel title
        const title = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 220,
            'Accessibility Options',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Create close button
        const closeButton = createDrawnButton(this.scene, {
            x: this.scene.cameras.main.width / 2 + 170,
            y: this.scene.cameras.main.height / 2 - 220,
            width: 30,
            height: 30,
            backgroundColor: 0x8B0000,
            hoverColor: 0xA52A2A,
            text: 'X',
            fontSize: '16px',
            onClick: () => this.hideAccessibilityPanel()
        });
        
        // Create accessibility toggle options
        const options = [
            { text: 'High Contrast Mode', key: 'highContrast' },
            { text: 'Larger Text', key: 'largerText' },
            { text: 'Reduced Motion', key: 'reducedMotion' },
            { text: 'Screen Reader Support', key: 'screenReader' },
            { text: 'Colorblind Mode', key: 'colorblind', isSelector: true }
        ];
        
        // Add all elements to the accessibility panel
        this.accessibilityPanel.add([panelBg, title, closeButton.button, closeButton.buttonText]);
        
        // Create toggle buttons for each option
        const startY = this.scene.cameras.main.height / 2 - 150;
        const spacing = 60;
        
        this.accessibilityToggles = [];
        
        options.forEach((option, index) => {
            const y = startY + (index * spacing);
            
            // Create option label
            const label = this.scene.add.text(
                this.scene.cameras.main.width / 2 - 150,
                y,
                option.text,
                {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '14px',
                    color: '#ffffff'
                }
            ).setScrollFactor(0);
            
            this.accessibilityPanel.add(label);
            
            if (option.isSelector) {
                // Create dropdown selector for colorblind modes
                const selector = createDrawnButton(this.scene, {
                    x: this.scene.cameras.main.width / 2 + 100,
                    y: y,
                    width: 150,
                    height: 30,
                    backgroundColor: 0x555555,
                    hoverColor: 0x777777,
                    text: 'Deuteranopia',
                    fontSize: '10px',
                    onClick: () => this.cycleColorblindMode(selector)
                });
                
                this.accessibilityPanel.add([selector.button, selector.buttonText]);
                this.accessibilityToggles.push({ key: option.key, element: selector, value: 'deuteranopia' });
            } else {
                // Create toggle button
                const toggleBg = this.scene.add.rectangle(
                    this.scene.cameras.main.width / 2 + 100,
                    y,
                    50,
                    26,
                    0x555555
                ).setScrollFactor(0);
                
                const toggleCircle = this.scene.add.circle(
                    this.scene.cameras.main.width / 2 + 80,
                    y,
                    10,
                    0xffffff
                ).setScrollFactor(0);
                
                // Make toggle interactive
                toggleBg.setInteractive()
                .on('pointerdown', () => {
                    const isActive = toggleBg.fillColor === 0x228B22;
                    
                    // Toggle state
                    toggleBg.setFillStyle(isActive ? 0x555555 : 0x228B22);
                    toggleCircle.x = isActive ? 
                        this.scene.cameras.main.width / 2 + 80 : 
                        this.scene.cameras.main.width / 2 + 120;
                    
                    // Store toggle state
                    this.accessibilityToggles.find(t => t.key === option.key).value = !isActive;
                    
                    // Apply accessibility setting
                    this.applyAccessibilitySetting(option.key, !isActive);
                });
                
                this.accessibilityPanel.add([toggleBg, toggleCircle]);
                this.accessibilityToggles.push({ key: option.key, element: { bg: toggleBg, circle: toggleCircle }, value: false });
            }
        });
        
        // Create apply button
        const applyButton = createDrawnButton(this.scene, {
            x: this.scene.cameras.main.width / 2,
            y: this.scene.cameras.main.height / 2 + 200,
            width: 150,
            height: 40,
            backgroundColor: 0x228B22,
            hoverColor: 0x2E8B57,
            text: 'Apply',
            fontSize: '16px',
            onClick: () => this.applyAllAccessibilitySettings()
        });
        
        this.accessibilityPanel.add([applyButton.button, applyButton.buttonText]);
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
                if (this.scene.events) {
                    this.scene.events.emit('openProfile');
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
            case 'settings':
                // Handle settings action
                if (this.scene.events) {
                    this.scene.events.emit('openSettings');
                }
                this.toggleMenu();
                break;
            case 'help':
                // Handle help action
                if (this.scene.events) {
                    this.scene.events.emit('openHelp');
                }
                this.toggleMenu();
                break;
            case 'about':
                // Handle about action
                if (this.scene.events) {
                    this.scene.events.emit('openAbout');
                }
                this.toggleMenu();
                break;
            default:
                this.toggleMenu();
                break;
        }
    }

    /**
     * Show the accessibility options panel.
     */
    showAccessibilityPanel() {
        this.accessibilityPanel.setVisible(true);
        this.toggleMenu(); // Close the menu
    }

    /**
     * Hide the accessibility options panel.
     */
    hideAccessibilityPanel() {
        this.accessibilityPanel.setVisible(false);
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
     * Cycle through colorblind modes.
     * @param {Object} selector - The selector button to update.
     */
    cycleColorblindMode(selector) {
        const modes = ['Deuteranopia', 'Protanopia', 'Tritanopia', 'None'];
        const toggle = this.accessibilityToggles.find(t => t.key === 'colorblind');
        const currentIndex = modes.findIndex(m => m.toLowerCase() === toggle.value);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex].toLowerCase();
        
        // Update button text
        selector.buttonText.setText(modes[nextIndex]);
        
        // Update toggle value
        toggle.value = nextMode;
    }

    /**
     * Apply a specific accessibility setting.
     * @param {string} key - The key of the setting to apply.
     * @param {boolean|string} value - The value to apply.
     */
    applyAccessibilitySetting(key, value) {
        console.log(`Applying accessibility setting: ${key} = ${value}`);
        
        // Store the setting in local storage
        try {
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            settings[key] = value;
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving accessibility settings:', e);
        }
        
        // Apply the setting to the game
        switch(key) {
            case 'highContrast':
                // Apply high contrast mode
                this.applyHighContrast(value);
                break;
            case 'largerText':
                // Apply larger text mode
                this.applyLargerText(value);
                break;
            case 'reducedMotion':
                // Apply reduced motion mode
                this.applyReducedMotion(value);
                break;
            case 'screenReader':
                // Apply screen reader mode
                this.applyScreenReader(value);
                break;
            case 'colorblind':
                // Apply colorblind mode
                this.applyColorblindMode(value);
                break;
        }
    }

    /**
     * Apply all accessibility settings at once.
     */
    applyAllAccessibilitySettings() {
        this.accessibilityToggles.forEach(toggle => {
            this.applyAccessibilitySetting(toggle.key, toggle.value);
        });
        
        // Show a confirmation message
        const message = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 + 150,
            'Settings Applied!',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#00ff00',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Add message to accessibility panel
        this.accessibilityPanel.add(message);
        
        // Remove message after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            message.destroy();
        });
    }

    /**
     * Apply high contrast mode.
     * @param {boolean} enabled - Whether high contrast is enabled.
     */
    applyHighContrast(enabled) {
        if (this.scene.events) {
            this.scene.events.emit('setHighContrast', enabled);
        }
    }

    /**
     * Apply larger text mode.
     * @param {boolean} enabled - Whether larger text is enabled.
     */
    applyLargerText(enabled) {
        if (this.scene.events) {
            this.scene.events.emit('setLargerText', enabled);
        }
    }

    /**
     * Apply reduced motion mode.
     * @param {boolean} enabled - Whether reduced motion is enabled.
     */
    applyReducedMotion(enabled) {
        if (this.scene.events) {
            this.scene.events.emit('setReducedMotion', enabled);
        }
    }

    /**
     * Apply screen reader mode.
     * @param {boolean} enabled - Whether screen reader support is enabled.
     */
    applyScreenReader(enabled) {
        if (this.scene.events) {
            this.scene.events.emit('setScreenReader', enabled);
        }
    }

    /**
     * Apply colorblind mode.
     * @param {string} mode - The colorblind mode to apply.
     */
    applyColorblindMode(mode) {
        if (this.scene.events) {
            this.scene.events.emit('setColorblindMode', mode);
        }
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

    /**
     * Load saved accessibility settings from local storage.
     */
    loadSavedSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            
            // Apply saved settings
            Object.entries(settings).forEach(([key, value]) => {
                const toggle = this.accessibilityToggles.find(t => t.key === key);
                
                if (toggle) {
                    if (key === 'colorblind') {
                        // Update colorblind selector
                        const modes = ['Deuteranopia', 'Protanopia', 'Tritanopia', 'None'];
                        const mode = modes.find(m => m.toLowerCase() === value) || 'None';
                        toggle.element.buttonText.setText(mode);
                        toggle.value = value;
                    } else {
                        // Update toggle switch
                        toggle.element.bg.setFillStyle(value ? 0x228B22 : 0x555555);
                        toggle.element.circle.x = value ? 
                            this.scene.cameras.main.width / 2 + 120 : 
                            this.scene.cameras.main.width / 2 + 80;
                        toggle.value = value;
                    }
                    
                    // Apply the setting
                    this.applyAccessibilitySetting(key, value);
                }
            });
        } catch (e) {
            console.error('Error loading accessibility settings:', e);
        }
    }
}