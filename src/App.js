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

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    return (
        <div className="App">
            {/* <ThemeProvider theme={theme}> */}
            <Router>
                <Switch>
                    {/* <ProtectedRoute exact path="/" component={} /> */}
                    <ProtectedRoute exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <ProtectedRoute
                        exact
                        path="/profile"
                        render={(props) => {
                            return <Navbar children={<Profile />} {...props} />;
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
                        render={(props) => {
                            return <Navbar children={<Notes />} {...props} />;
                        }}
                    />
                    <ProtectedRoute
                        exact
                        path="/upload-assignment"
                        render={(props) => {
                            return (
                                <Navbar
                                    children={<UploadAssignment />}
                                    {...props}
                                />
                            );
                        }}
                    />
                    <ProtectedRoute
                        exact
                        path="/view-assignment"
                        render={(props) => {
                            return (
                                <Navbar
                                    children={<ViewAssignments />}
                                    {...props}
                                />
                            );
                        }}
                    />
                    <Route exact path="*" component={NotFound} />
                </Switch>
            </Router>
            {/* </ThemeProvider> */}
        </div>
    );
}

export default App;
