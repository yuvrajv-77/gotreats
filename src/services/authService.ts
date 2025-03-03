import { doc, getDoc, setDoc } from "firebase/firestore";
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
            uid: newUser.uid,
            phoneNumber: null,
            photoURL: newUser.photoURL,
        });
        console.log("Account created successfully with  email");
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
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await getUserFromDb(user.uid);

        if (!userDoc) {
            // First time sign in - create user document
            await setDoc(doc(db, "users", user.uid), {
                displayName: user.displayName,
                email: user.email,
                phoneNumber: null,
                photoURL: user.photoURL,
                uid: user.uid
            });
            return {
                displayName: user.displayName,
                email: user.email,
            };
        }

        // Returning user - return existing document
        return userDoc;

    } catch (err) {
        throw err;
    }
}


async function getUserFromDb(uid: string) {
    try {
        const docSnap = await getDoc(doc(db, "users", uid));
        console.log("docSnap", docSnap.data());

        return (docSnap.data());
    } catch (e) {
        console.log(e);
    }
}