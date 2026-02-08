import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
   sendEmailVerification,
} from "firebase/auth";

export async function registerUser(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

   await sendEmailVerification(cred.user);
    await signOut(auth);
  return cred.user;
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
}
