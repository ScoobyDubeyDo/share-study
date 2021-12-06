import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { currentUser, signout } = useAuth();
    return (
        <div>
            <b>{`User email = ${currentUser}`}</b>
            <br />
            <Button onClick={async () => signout()}>logout</Button>
        </div>
    );
}

export default Dashboard;
