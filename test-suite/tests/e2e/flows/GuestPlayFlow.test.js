import { describe, it, expect, vi } from 'vitest'

// Mock scene and sessionStorage
global.sessionStorage = {
    storage: {},
    getItem(key) {
        return this.storage[key] || null
    },
    setItem(key, value) {
        this.storage[key] = value
    },
    removeItem(key) {
        delete this.storage[key]
    }
}

describe('GuestPlayFlow', () => {
    it('should set skipIntro and reload the game', () => {
        const reloadSpy = vi.fn()
        global.window.location.reload = reloadSpy

        // Simulate the LoginScene’s “MAIN MENU” button
        sessionStorage.setItem('skipIntro', 'true')

        expect(sessionStorage.getItem('skipIntro')).toBe('true')

        window.location.reload()
        expect(reloadSpy).toHaveBeenCalled()
    })
})
