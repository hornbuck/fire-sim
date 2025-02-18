// IMPORTS
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'


//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1dJCegF2BZ5c01e4URiJrBPboHMqIhnI",
    authDomain: "wildfire-command.firebaseapp.com",
    projectId: "wildfire-command",
    storageBucket: "wildfire-command.firebasestorage.app",
    messagingSenderId: "824434588817",
    appId: "1:824434588817:web:c3276917d57b972c8a1330"
};

// Initialize Firebase ✅
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth ✅
const auth = getAuth(app);

export { auth };