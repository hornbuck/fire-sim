
export const auth = {
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { updateProfile: jest.fn() } })),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
};
