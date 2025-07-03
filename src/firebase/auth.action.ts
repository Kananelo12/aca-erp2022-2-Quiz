import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/client';

export async function apiSignUp(name: string, email: string, password: string) {
  // first create user with Firebase client SDK
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // then call your backend
  return fetch('https://aca-quiz-server-gps7rz4ek-kananelo-joels-projects.vercel.app/api/signup', {
    method: 'POST',
    credentials: 'include', // important for cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: cred.user.uid, name, email }),
  }).then(r => r.json());
}

export async function apiSignIn(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCred.user.getIdToken();
  return fetch('https://aca-quiz-server-gps7rz4ek-kananelo-joels-projects.vercel.app/api/signin', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, idToken }),
  }).then(r => r.json());
}