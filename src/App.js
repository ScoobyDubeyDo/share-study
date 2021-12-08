import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { createTheme, ThemeProvider } from "@mui/material";
import Navbar from "./components/Navbar";
import Notes from "./components/Notes";

const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        {/* <ProtectedRoute exact path="/" component={} /> */}
                        <ProtectedRoute
                            exact
                            path="/signin"
                            render={(props) => {
                                return (
                                    <Navbar children={<SignIn />} {...props} />
                                );
                            }}
                        />
                        <Route exact path="/signup" component={SignUp} />
                        <ProtectedRoute
                            exact
                            path="/profile"
                            render={(props) => {
                                return (
                                    <Navbar children={<Profile />} {...props} />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/forgot-password"
                            render={(props) => {
                                return (
                                    <Navbar
                                        children={<ForgotPassword />}
                                        {...props}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/reset-password"
                            render={(props) => {
                                return (
                                    <Navbar
                                        children={<PasswordReset />}
                                        {...props}
                                    />
                                );
                            }}
                        />
                        <ProtectedRoute
                            exact
                            path="/notes"
                            render={(props) => {
                                return (
                                    <Navbar children={<Notes />} {...props} />
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
