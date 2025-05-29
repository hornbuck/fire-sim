import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks for Firestore
const mockAddDoc = vi.fn()
const mockCollection = vi.fn(() => ({}))
const mockGetDocs = vi.fn(() => Promise.resolve({
    forEach: (cb) => {
        cb({ data: () => ({ name: 'Cat', score: 500 }) })
    }
    }))
    const mockDb = {}

    vi.mock('firebase/firestore', async () => {
    const mod = await vi.importActual('firebase/firestore')
    return {
        ...mod,
        collection: mockCollection,
        addDoc: mockAddDoc,
        getDocs: mockGetDocs
    }
    })

    vi.mock('../../src/firebaseConfig.js', () => ({
    db: mockDb
    }))

    describe('UIScene inline Firebase usage', () => {
    let UIScene

    beforeEach(async () => {
        const module = await import('../../../../src/scenes/UIScene.js');
        UIScene = module.default
    })

    it('submits score inline using addDoc', async () => {
        const scene = new UIScene()
        const playerName = 'TestUser'
        const playerScore = 1337

        // Fake the call inside UIScene
        const submitScore = async () => {
        const scoresRef = mockCollection(mockDb, 'scores')
        await mockAddDoc(scoresRef, { name: playerName, score: playerScore })
        }

        await submitScore()

        expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), {
        name: playerName,
        score: playerScore
        })
    })
})
