import { createTheme } from "@mui/material";
import { useEffect, useState } from "react";

export const useTheme = () => {
    const [myTheme, setTheme] = useState("dark");
    useEffect(() => setTheme(localStorage.getItem("theme") ?? "dark"), []);
    const changeTheme = () => {
        localStorage.setItem("theme", myTheme === "dark" ? "light" : "dark");
        setTheme(localStorage.getItem("theme"));
    };
    const theme = createTheme({
        palette: {
            mode: myTheme,
        },
    });
    return { changeTheme, theme, myTheme };
};

// const [dark, setDark] = useState(
//     localStorage.getItem("dark-mode") === "true"
// );

// useEffect(() => {
//     localStorage.setItem("dark-mode", dark);
// }, [dark]);

// const handleMode = () => {
//     setDark(!dark);
// };
