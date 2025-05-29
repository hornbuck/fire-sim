// setupTests.js

import { vi } from 'vitest';

// Mock sessionStorage
global.sessionStorage = {
    storage: {},
    setItem(key, value) {
        this.storage[key] = value;
    },
    getItem(key) {
        return this.storage[key] || null;
    },
    clear() {
        this.storage = {};
    }
};

// Mock window.location.reload
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
    value: {
        reload: vi.fn(),
    },
    writable: true,
});

// Expanded Phaser mock
global.Phaser = {
    Scene: class {
        constructor() {
        this.add = {
            image: vi.fn(() => ({ setInteractive: vi.fn(), setDepth: vi.fn(), on: vi.fn() })),
            text: vi.fn(() => ({
            setText: vi.fn(),
            setVisible: vi.fn(),
            setScrollFactor: vi.fn(),
            })),
            existing: vi.fn(),
        };
        this.input = {
            on: vi.fn(),
            keyboard: {
            on: vi.fn(),
            createCursorKeys: vi.fn(() => ({
                left: {},
                right: {},
                up: {},
                down: {},
                space: {},
            })),
            },
        };
        this.sound = {
            play: vi.fn(),
            add: vi.fn(() => ({
            play: vi.fn(),
            stop: vi.fn(),
            })),
        };
        this.time = {
            delayedCall: vi.fn((delay, callback) => {
            callback();
            }),
        };
        this.cameras = {
            main: {
            startFollow: vi.fn(),
            setZoom: vi.fn(),
            setBounds: vi.fn(),
            },
        };
        this.physics = {
            add: {
            sprite: vi.fn(() => ({
                setInteractive: vi.fn(),
                on: vi.fn(),
                setData: vi.fn(),
            })),
            overlap: vi.fn(),
            },
        };
        this.events = {
            on: vi.fn(),
            emit: vi.fn(),
        };
        }
    },
    Math: {
        Clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
    },
    Input: {
        Keyboard: {
        KeyCodes: {},
        },
    },
    GameObjects: {
        Text: class {
        setText() {}
        setVisible() {}
        },
        Image: class {
        setTexture() {}
        setVisible() {}
        },
    },
};
