import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";
import { createTheme, ThemeProvider } from "@mui/material";

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
                        {/* <Route exact path="/" component={Homepage} /> */}
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
                            path="/dashboard"
                            component={Dashboard}
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
                        <Route exact path="*" component={NotFound} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
