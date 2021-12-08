import { useRef, useState, useEffect } from "react";
import { storage, db } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

// useEffect(() => {
//     setBackdropOpen(true);
//     getDoc(userRef)
//         .then((data) => {
//             setUserData(data.data());
//         })
//         .then(() => setBackdropOpen(false));
// }, []);

function NotesStudent() {
    return <div>awfewfsejkghrjkgharegb</div>;
}

export default NotesStudent;
