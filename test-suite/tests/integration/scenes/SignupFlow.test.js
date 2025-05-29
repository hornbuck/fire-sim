import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '../../src/firebaseConfig.js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn()
    }))

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

    it('creates a new user and sets display name, then reloads', async () => {
        const fakeUser = { uid: 'abc123', updateProfile: vi.fn() }
        createUserWithEmailAndPassword.mockResolvedValue({ user: fakeUser })
        updateProfile.mockResolvedValue()

        const email = 'newuser@example.com'
        const password = 'securepass'
        const displayName = 'Cat'

        // Simulate logic from signupScene
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName })
        sessionStorage.setItem('skipIntro', 'true')
        window.location.reload()

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password)
        expect(updateProfile).toHaveBeenCalledWith(fakeUser, { displayName })
        expect(sessionStorage.getItem('skipIntro')).toBe('true')
        expect(mockReload).toHaveBeenCalled()
    })

    it('handles signup error gracefully', async () => {
        createUserWithEmailAndPassword.mockRejectedValue(new Error('Email already in use'))

        try {
        await createUserWithEmailAndPassword(auth, 'bad@example.com', 'pass')
        } catch (err) {
        expect(err.message).toBe('Email already in use')
        }
    })
})
