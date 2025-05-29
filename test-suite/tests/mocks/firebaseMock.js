// test/mocks/firebase-auth.js
export const signInWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({ user: { uid: 'abc123' } })
)

export const createUserWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({ user: { updateProfile: vi.fn() } })
)

export const updateProfile = vi.fn()

// If needed: export mock auth object
export const auth = {}
