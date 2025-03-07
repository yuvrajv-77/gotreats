import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuthStore } from "../store/authStore";
import { signOut } from "firebase/auth";


export const handleEmailAccountCreation = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: string
    ) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential?.user;
        await setDoc(doc(db, "users", newUser.uid), {
            displayName: name,
            email: newUser.email,
            uid: newUser.uid,
            phoneNumber: phoneNumber,
            photoURL: newUser.photoURL,
            address: address
        });
        const userDetails = await getUserFromDb(newUser.uid);
        useAuthStore.getState().setUserDetails(userDetails);
        console.log("Account created successfully with email");
    } catch (err) {
        throw err
    }
}


export const handleEmailAccountLogin = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userDetails = await getUserFromDb(result.user.uid);
        useAuthStore.getState().setUserDetails(userDetails);
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


export async function getUserFromDb(uid: string) {
    try {
        const docSnap = await getDoc(doc(db, "users", uid));
        // console.log("docSnap", docSnap.data());
        return (docSnap.data());
    } catch (e) {
        console.log(e);
    }
}


export const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        throw err;
    }
}
