console.log('setupTests.js is running');

import { vi } from 'vitest';

// -------------------
// GLOBAL MOCKS
// -------------------

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
    },
    };

    global.window = {
    location: {
        reload: vi.fn(),
    },
};

// -------------------
// DOM MOCK
// -------------------

if (typeof global.document === 'undefined') {
    global.document = {
        createElement: vi.fn(() => ({
        getContext: vi.fn(),
        style: {},
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        })),
        body: {
        appendChild: vi.fn(),
        },
    };
}

// -------------------
// PHASER MOCK
// -------------------

const mockRectangle = {
    setOrigin: vi.fn().mockReturnThis(),
    setInteractive: vi.fn().mockReturnThis(),
    setScrollFactor: vi.fn().mockReturnThis(),
    setDepth: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
};

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
            rectangle: vi.fn(() => mockRectangle),
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
