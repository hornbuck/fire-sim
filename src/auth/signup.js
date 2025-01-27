import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Signup successful!');
            console.log(userCredential.user);
        })
        .catch((error) => {
            alert(error.message);
        });
});