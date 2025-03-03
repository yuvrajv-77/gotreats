'use client'
import {
    User,
    GoogleAuthProvider,
    GithubAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,

} from "firebase/auth";
import { useEffect, useState, createContext } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";


interface AuthContextType {

    user: User | null;
    userDetail: DocumentData | undefined;
    loading: boolean;
    error: Error | null;
    name: string;
    email: string;
    password: string;
    isSending: boolean;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleLogout: () => Promise<void>;
    forgotPassword: () => Promise<void>;
    handleEmailAccountLogin: () => Promise<void>;
    handlesignInWithGithub: () => Promise<void>;
    handlesignInWithGoogle: () => Promise<void>;
    handleEmailAccountCreation: () => Promise<void>;
    resetPassword: (oobcode: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userDetail, setUserDetail] = useState<DocumentData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);



    const handleEmailAccountCreation = async () => {
        // this func creates a new account with email and password 
        // and after creating a new account it will immediately create 
        // a new document in the users collection with the id of the newly created user
        if (loading) return;
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // creating new account
            const newUser = userCredential.user; // Get the user from the result
            await setDoc(doc(db, "users", newUser.uid), { // setting a new document in the users collection
                displayName: name,
                email: newUser.email,
            });
            console.log("Account created successfully with name email");
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create account'));
        } finally {
            setLoading(false);
        }
    }
    const handleEmailAccountLogin = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to login'));
        } finally {
            setLoading(false);
        }
    }

    const handlesignInWithGoogle = async () => {

        if (loading) return;
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to sign in with Google'));
        } finally {
            setLoading(false);
        }
    }


    const handlesignInWithGithub = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to sign in with Github'));
        } finally {
            setLoading(false);
        }

    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to logout'));
        }
    }

    const forgotPassword = async () => {

        try {
            await sendPasswordResetEmail(auth, email);
            setIsSending(true);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to send reset email'));
            console.log("Error: ", err);
        }
        setIsSending(false);
    }

    const resetPassword = async (oobcode: string, newPassword: string) => {
        try {
            await confirmPasswordReset(auth, oobcode, newPassword);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to reset password'));
        }
    }

    // check if user is logged in
    useEffect(() => {
        setLoading(true);
        //  async () => {
        //     try {
        //         const result = await getRedirectResult(auth);
        //         if (result) {
        //             const user = result.user;
        //             console.log('Redirect result user:', user);
    
        //             const additionalInfo = getAdditionalUserInfo(result);
        //             console.log('Additional user info:', additionalInfo);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching redirect result:', error);
        //     }
        // };
    // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setError(null);
            setLoading(false);
        });
   
        return () => unsubscribe();
    }, []);

    // get userDetail from users collection from db usng logged in user's uid
    async function getUserFromDb(uid: string) {
        try {
            const docSnap = await getDoc(doc(db, "users", uid));
            setUserDetail(docSnap.data());
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (user) {
            getUserFromDb(user.uid);
        }
    }, [user])

    // console.log("User: ", user);
    // console.log("UserDetail: ", userDetail);

    const value = {
        user,
        userDetail,
        loading,
        error,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        isSending,
        handleLogout,
        forgotPassword,
        handleEmailAccountLogin,
        handlesignInWithGithub,
        handlesignInWithGoogle,
        handleEmailAccountCreation,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;