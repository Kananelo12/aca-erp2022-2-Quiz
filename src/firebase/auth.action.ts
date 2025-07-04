// TODO: LOCAL DEVELOPMENT WORKING ON SIGNIN AND SIGNUP AT TIMESTAMP: 2025-07-04: 04:50AM
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/client";

export async function apiSignUp({ name, email, password }: SignUpParams) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("\nBACKEND URL: ", process.env.REACT_APP_BACKEND_URL);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: cred.user.uid, name, email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (err: any) {
    console.error("apiSignUp error", err);
    return { success: false, message: err.message };
  }
}

export async function apiSignIn(email: string, password: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCred.user.getIdToken();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, idToken }),
    });
    if (!res.ok) throw new Error(await res.text());

    // Fetch user details after login success
    const user = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`, {
      credentials: "include",
    }).then((r) => r.json());

    return { success: true, user };
  } catch (err: any) {
    console.error("apiSignIn error", err);
    return { success: false, message: err.message };
  }
}
