// setupTests.js

import { vi } from 'vitest'

// Mock sessionStorage for all tests
global.sessionStorage = {
    storage: {},
    setItem(key, value) {
        this.storage[key] = value
    },
    getItem(key) {
        return this.storage[key] || null
    },
    clear() {
        this.storage = {}
    }
}

// Mock window.location.reload to track reloads in tests
global.window = Object.create(window)
Object.defineProperty(window, 'location', {
    value: {
        reload: vi.fn()
    },
    writable: true
})

// Basic Phaser mock to prevent runtime errors
global.Phaser = {
    Scene: class {},
    Math: {
        Clamp: (val, min, max) => Math.max(min, Math.min(max, val))
    },
    Input: {
        Keyboard: {
        KeyCodes: {}
        }
    },
    GameObjects: {
            Text: class {
            setText() {}
            setVisible() {}
            },
            Image: class {
            setTexture() {}
            setVisible() {}
            }
        }
}
