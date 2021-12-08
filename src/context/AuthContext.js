import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyBeforeUpdateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

const AuthContext = createContext({
    currentUser: null,
    signup: () => Promise,
    signin: () => Promise,
    signout: () => Promise,
    passwordReset: () => Promise,
    changePassword: () => Promise,
    updateEmailId: () => Promise,
    reAuthenticate: () => Promise,
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthContextProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signin(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signout() {
        return signOut(auth);
    }

    function passwordReset(email) {
        return sendPasswordResetEmail(auth, email, {
            url: "http://localhost:3000/signin",
        });
    }

    function changePassword(oobCode, newPassword) {
        return confirmPasswordReset(auth, oobCode, newPassword);
    }

    function reAuthenticate(password) {
        return reauthenticateWithCredential(
            currentUser,
            EmailAuthProvider.credential(currentUser.email, password)
        );
    }
    function updateEmailId(newEmail) {
        return verifyBeforeUpdateEmail(currentUser, newEmail, {
            url: "http://localhost:3000/profile",
        });
    }

    const value = {
        currentUser,
        signup,
        signin,
        signout,
        passwordReset,
        changePassword,
        updateEmailId,
        reAuthenticate,
    };
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
