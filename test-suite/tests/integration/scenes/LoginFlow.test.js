// tests/LoginFlow.test.js
vi.mock('firebase/auth', async () => await import('../mocks/firebase-auth.js'))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '../../../test-suite/mocks/firebaseMock.js'


global.sessionStorage = {
    storage: {},
    setItem(key, value) { this.storage[key] = value },
    getItem(key) { return this.storage[key] || null },
    clear() { this.storage = {} }
    }

describe('LoginFlow', () => {
    let mockReload

    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
        mockReload = vi.fn()
        global.window.location.reload = mockReload
    })

    it('logs in a user and reloads the page on success', async () => {
        const email = 'test@example.com'
        const password = 'securepass123'

        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const result = await signInWithEmailAndPassword(auth, email, password)
        sessionStorage.setItem('skipIntro', 'true')
        window.location.reload()

        expect(result.user.uid).toBe('abc123')
        expect(sessionStorage.getItem('skipIntro')).toBe('true')
        expect(mockReload).toHaveBeenCalled()
    })
})
