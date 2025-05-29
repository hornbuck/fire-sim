// tests/SignupFlow.test.js
vi.mock('firebase/auth', async () => await import('../mocks/firebase-auth.js'))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '../../src/firebaseConfig.js'

global.sessionStorage = {
    storage: {},
    setItem(key, value) { this.storage[key] = value },
    getItem(key) { return this.storage[key] || null },
    clear() { this.storage = {} }
}

describe('SignupFlow', () => {
    let mockReload

    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
        mockReload = vi.fn()
        global.window.location.reload = mockReload
    })

    it('creates a user and sets display name', async () => {
        const email = 'new@example.com'
        const password = 'secure123'
        const displayName = 'Cat'

        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName })
        sessionStorage.setItem('skipIntro', 'true')
        window.location.reload()

        expect(sessionStorage.getItem('skipIntro')).toBe('true')
        expect(mockReload).toHaveBeenCalled()
    })
})
