import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";

function ProtectedRoute(props) {
    const { currentUser } = useAuth();
    const { path } = props;
    const location = useLocation();

    const [isVerified, setUserVerification] = useState(false);

    useEffect(() => {
        if(currentUser){
            const userRef = doc(collection(db, "users"), currentUser.uid);
            getDoc(userRef).then((data) => {
                const uData = data.data();
                setUserVerification(Boolean(uData.moNumber))
            });
        }
    }, [currentUser]);

    if (
        path === "/signin" ||
        path === "/signup" ||
        path === "/forgot-password" ||
        path === "/reset-password"
    ) {
        return currentUser && !isVerified ? (
            <Redirect to={location.state?.from ?? "/"} />
        ) : (
            <Route {...props} />
        );
    }
    return currentUser ? (
        <Route {...props} />
    ) : (
        <Redirect
            to={{
                pathname: "/signin",
                state: { from: path },
            }}
        />
    );
}

export default ProtectedRoute;
