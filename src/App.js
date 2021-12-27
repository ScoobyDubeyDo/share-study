import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";
import UploadAssignment from "./pages/UploadAssignment";
import ViewAssignments from "./pages/ViewAssignments";
import SubmitAssignment from "./pages/SubmitAssignment";
import TeacherData from "./pages/TeacherData";
import StudentData from "./pages/StudentData";
import { useEffect, useState } from "react";

function App() {
    const [dark, setDark] = useState(
        localStorage.getItem("dark-mode") === "true"
    );

    useEffect(() => {
        localStorage.setItem("dark-mode", dark);
    }, [dark]);

    const handleMode = () => {
        setDark(!dark);
    };

    const theme = createTheme({
        palette: {
            mode: dark ? "dark" : "light",
        },
    });

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <ProtectedRoute
                            exact
                            path="/signin"
                            component={SignIn}
                        />
                        <ProtectedRoute
                            exact
                            path="/signup"
                            component={SignUp}
                        />
                        <ProtectedRoute
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<Profile />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/forgot-password"
                            component={ForgotPassword}
                        />
                        <ProtectedRoute
                            exact
                            path="/reset-password"
                            component={PasswordReset}
                        />
                        <ProtectedRoute
                            exact
                            path="/notes"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<Notes />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/upload-assignment"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<UploadAssignment />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/view-assignment"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<ViewAssignments />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/submit-assignment"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<SubmitAssignment />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/teacher-data"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<TeacherData />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/student-data"
                            render={() => {
                                return (
                                    <Navbar
                                        children={<StudentData />}
                                        handleMode={handleMode}
                                        mode={dark}
                                    />
                                );
                            }}
                        />
                        <Route exact path="*" component={NotFound} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
