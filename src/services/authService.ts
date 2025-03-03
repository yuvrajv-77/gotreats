import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export const handleEmailAccountCreation = async (
    name: string,
    email: string,
    password: string) => {

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); // creating new account
        const newUser = userCredential.user; // Get the user from the result
        await setDoc(doc(db, "users", newUser.uid), { // setting a new document in the users collection
            displayName: name,
            email: newUser.email,
        });
        console.log("Account created successfully with name email");
    } catch (err) {
        throw err
    }
}

export const handleEmailAccountLogin = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        throw (err instanceof Error ? err : new Error('Failed to sign in with email'));
    }
}

export const handlesignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (err) {
        throw (err instanceof Error ? err : new Error('Failed to sign in with Google'));
    }
}