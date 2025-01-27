import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Login successful!');
            console.log(userCredential.user);
        })
        .catch((error) => {
            alert(error.message);
        });
});