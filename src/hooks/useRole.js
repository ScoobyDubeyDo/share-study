import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";

function useRole() {
    const { currentUser } = useAuth();
    const userRef = doc(collection(db, "users"), currentUser.uid);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getDoc(userRef).then((data) => {
            setUserData(data.data());
        });

        return () => {
            console.log("clean");
        };
    }, []);

    return userData.role;
}

export default useRole;
