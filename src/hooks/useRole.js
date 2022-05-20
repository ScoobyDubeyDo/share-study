import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";

function useRole() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!!currentUser?.uid) {
            const userRef = doc(collection(db, "users"), currentUser.uid);
            getDoc(userRef).then(data => {
                setUserData(data.data());
            });
        }
    }, [currentUser?.uid]);

    return userData?.role;
}

export default useRole;
