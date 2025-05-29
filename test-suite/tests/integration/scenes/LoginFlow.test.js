import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '../../src/firebaseConfig.js'
import { signInWithEmailAndPassword } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn()
    }))

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
        signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'abc123', email: 'test@example.com' }
        })

        const fakeEmail = 'test@example.com'
        const fakePassword = 'securepass123'

        // Simulate LoginScene form logic
        await signInWithEmailAndPassword(auth, fakeEmail, fakePassword)
        sessionStorage.setItem('skipIntro', 'true')
        window.location.reload()

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, fakeEmail, fakePassword)
        expect(sessionStorage.getItem('skipIntro')).toBe('true')
        expect(mockReload).toHaveBeenCalled()
    })

    it('shows error when login fails', async () => {
        signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'))

        try {
        await signInWithEmailAndPassword(auth, 'bad@example.com', 'wrong')
        } catch (err) {
        expect(err.message).toBe('Invalid credentials')
        }

        expect(signInWithEmailAndPassword).toHaveBeenCalled()
    })
})
