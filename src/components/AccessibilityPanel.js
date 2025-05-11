/**
 * @file AccessibilityPanel.js
 * @description A panel for accessibility settings in the Wildfire Command game.
 */

import { createDrawnButton } from './ButtonManager.js';

export default class AccessibilityPanel {
    /**
     * Creates a new accessibility panel instance.
     * @param {Phaser.Scene} scene - The Phaser scene to add the panel to.
     * @param {Object} options - Configuration options for the panel.
     */
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            width: options.width || 400,
            height: options.height || 500,
            backgroundColor: options.backgroundColor || 0x2d3436,
            buttonColor: options.buttonColor || 0x555555,
            buttonHoverColor: options.buttonHoverColor || 0x777777,
            activeColor: options.activeColor || 0x228B22,
            depth: options.depth || 1000,
            onSettingsApplied: options.onSettingsApplied || null
        };

        this.container = null;
        this.accessibilityToggles = [];
        this.isVisible = false;

        this.init();
    }

    /**
     * Initialize the accessibility panel components.
     */
    init() {
        // Create panel container
        this.container = this.scene.add.container(0, 0)
            .setDepth(this.options.depth)
            .setVisible(false);
        
        // Create panel background
        const panelBg = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.options.width,
            this.options.height,
            this.options.backgroundColor,
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
            onClick: () => this.hide()
        });
        
        // Create accessibility toggle options
        const options = [
            { text: 'High Contrast Mode', key: 'highContrast' },
            { text: 'Larger Text', key: 'largerText' },
            { text: 'Reduced Motion', key: 'reducedMotion' },
            { text: 'Screen Reader Support', key: 'screenReader' },
            { text: 'Colorblind Mode', key: 'colorblind', isSelector: true }
        ];
        
        // Add background, title and close button to container
        this.container.add([panelBg, title, closeButton.button, closeButton.buttonText]);
        
        // Create toggle buttons for each option
        const startY = this.scene.cameras.main.height / 2 - 150;
        const spacing = 60;
        
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
            
            this.container.add(label);
            
            if (option.isSelector) {
                // Create dropdown selector for colorblind modes
                const selector = createDrawnButton(this.scene, {
                    x: this.scene.cameras.main.width / 2 + 100,
                    y: y,
                    width: 150,
                    height: 30,
                    backgroundColor: this.options.buttonColor,
                    hoverColor: this.options.buttonHoverColor,
                    text: 'Deuteranopia',
                    fontSize: '10px',
                    onClick: () => this.cycleColorblindMode(selector)
                });
                
                this.container.add([selector.button, selector.buttonText]);
                this.accessibilityToggles.push({ key: option.key, element: selector, value: 'deuteranopia' });
            } else {
                // Create toggle button
                const toggleBg = this.scene.add.rectangle(
                    this.scene.cameras.main.width / 2 + 100,
                    y,
                    50,
                    26,
                    this.options.buttonColor
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
                    const isActive = toggleBg.fillColor === this.options.activeColor;
                    
                    // Toggle state
                    toggleBg.setFillStyle(isActive ? this.options.buttonColor : this.options.activeColor);
                    toggleCircle.x = isActive ? 
                        this.scene.cameras.main.width / 2 + 80 : 
                        this.scene.cameras.main.width / 2 + 120;
                    
                    // Store toggle state
                    this.accessibilityToggles.find(t => t.key === option.key).value = !isActive;
                });
                
                this.container.add([toggleBg, toggleCircle]);
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
            onClick: () => this.applySettings()
        });
        
        this.container.add([applyButton.button, applyButton.buttonText]);
        
        // Load saved settings
        this.loadSavedSettings();
    }

    /**
     * Load saved accessibility settings from local storage.
     */
    loadSavedSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            
            // Apply saved settings to toggles
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
                        toggle.element.bg.setFillStyle(value ? this.options.activeColor : this.options.buttonColor);
                        toggle.element.circle.x = value ? 
                            this.scene.cameras.main.width / 2 + 120 : 
                            this.scene.cameras.main.width / 2 + 80;
                        toggle.value = value;
                    }
                }
            });
        } catch (e) {
            console.error('Error loading accessibility settings:', e);
        }
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
     * Apply all accessibility settings at once.
     */
    applySettings() {
        // Save settings to local storage
        try {
            const settings = {};
            this.accessibilityToggles.forEach(toggle => {
                settings[toggle.key] = toggle.value;
            });
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving accessibility settings:', e);
        }
        
        // Emit events for each setting
        this.accessibilityToggles.forEach(toggle => {
            if (this.scene.events) {
                this.scene.events.emit(`set${toggle.key.charAt(0).toUpperCase() + toggle.key.slice(1)}`, toggle.value);
            }
        });
        
        // Call callback if provided
        if (this.options.onSettingsApplied) {
            this.options.onSettingsApplied(this.accessibilityToggles.reduce((acc, toggle) => {
                acc[toggle.key] = toggle.value;
                return acc;
            }, {}));
        }
        
        // Show confirmation message
        this.showConfirmation();
    }

    /**
     * Show a confirmation message when settings are applied.
     */
    showConfirmation() {
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
        
        this.container.add(message);
        
        this.scene.time.delayedCall(2000, () => {
            message.destroy();
        });
    }

    /**
     * Show the accessibility panel.
     */
    show() {
        this.container.setVisible(true);
        this.isVisible = true;
    }

    /**
     * Hide the accessibility panel.
     */
    hide() {
        this.container.setVisible(false);
        this.isVisible = false;
    }

    /**
     * Toggle the visibility of the accessibility panel.
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Get the current settings from the panel.
     * @returns {Object} - The current accessibility settings.
     */
    getSettings() {
        return this.accessibilityToggles.reduce((acc, toggle) => {
            acc[toggle.key] = toggle.value;
            return acc;
        }, {});
    }
}