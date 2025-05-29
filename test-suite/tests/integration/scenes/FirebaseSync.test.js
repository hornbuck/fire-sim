// test-suite/tests/integration/scenes/FirebaseSync.test.js

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks for Firestore functions
const mockSetDoc = vi.fn()
const mockAddDoc = vi.fn()
const mockGetDocs = vi.fn(() => Promise.resolve({
    forEach: (callback) => {
        callback({ data: () => ({ name: 'Cat', score: 420 }) })
        callback({ data: () => ({ name: 'Aidan', score: 300 }) })
    }
    }))
    const mockCollection = vi.fn(() => ({}))
    const mockDoc = vi.fn(() => ({}))

    // Mock the Firestore module
    vi.mock('firebase/firestore', async () => {
    const mod = await vi.importActual('firebase/firestore')
    return {
        ...mod,
        collection: mockCollection,
        addDoc: mockAddDoc,
        getDocs: mockGetDocs,
        setDoc: mockSetDoc,
        doc: mockDoc
    }
})

describe('FirebaseSync', () => {
    beforeEach(() => {
        mockSetDoc.mockClear()
        mockAddDoc.mockClear()
        mockGetDocs.mockClear()
    })

    it('submits a score to Firestore', async () => {
        const mockScore = { name: 'Cat', score: 500 }

        const submitScore = async (score) => {
        const scoresRef = mockCollection('scores')
        await mockAddDoc(scoresRef, score)
        }

        await submitScore(mockScore)
        expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), mockScore)
    })

    it('retrieves leaderboard scores from Firestore', async () => {
        const leaderboard = []

        const getLeaderboard = async () => {
        const scoresRef = mockCollection('scores')
        const snapshot = await mockGetDocs(scoresRef)
        snapshot.forEach(doc => {
            leaderboard.push(doc.data())
        })
        }

        await getLeaderboard()

        expect(leaderboard.length).toBeGreaterThan(0)
        expect(leaderboard[0]).toHaveProperty('name')
        expect(leaderboard[0]).toHaveProperty('score')
    })
})
