import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../utils/firebase";
import NotesTeacher from "../pages/NotesTeacher";
import NotesStudent from "../pages/NotesStudent";
import useMounted from "../hooks/useMounted";

function Notes() {
    const mounted = useMounted();
    const { currentUser } = useAuth();
    const userRef = doc(collection(db, "users"), currentUser.uid);
    // const [userData, setUserData] = useState({});

    // getDoc(userRef).then((data) => {
    //     setUserData(data.data());
    // });

    return (
        // <>{userData.role === "teacher" ? <NotesTeacher /> : <NotesStudent />}</>
        <NotesTeacher />
    );
}
export default Notes;
