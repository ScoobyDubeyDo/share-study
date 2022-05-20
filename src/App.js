import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
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
import { useTheme } from "./hooks/useTheme";

function App() {
    const { theme, changeTheme, myTheme } = useTheme();
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Router>
                    <Navbar handleMode={changeTheme} mode={myTheme}>
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
                                component={Profile}
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
                                component={Notes}
                            />

                            <ProtectedRoute
                                exact
                                path="/upload-assignment"
                                component={UploadAssignment}
                            />

                            <ProtectedRoute
                                exact
                                path="/view-assignment"
                                component={ViewAssignments}
                            />

                            <ProtectedRoute
                                exact
                                path="/submit-assignment"
                                component={SubmitAssignment}
                            />

                            <ProtectedRoute
                                exact
                                path="/teacher-data"
                                component={TeacherData}
                            />

                            <ProtectedRoute
                                exact
                                path="/student-data"
                                component={StudentData}
                            />
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </Navbar>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
