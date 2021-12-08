import React from "react";
import { useLocation } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute(props) {
    const { currentUser } = useAuth();
    const { path } = props;
    const location = useLocation();

    if (
        path === "/signin" ||
        path === "/signup" ||
        path === "/forgot-password" ||
        path === "/reset-password"
    ) {
        return currentUser ? (
            <Redirect to={location.state?.from ?? "/profile"} />
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
