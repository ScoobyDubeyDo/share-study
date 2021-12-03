import { BrowserRouter as Router, Switch } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    {/* <Route exact path="/" component={Homepage} /> */}
                    <ProtectedRoute exact path="/signin" component={SignIn} />
                    <ProtectedRoute exact path="/signup" component={SignUp} />
                    <ProtectedRoute
                        exact
                        path="/dashboard"
                        component={Dashboard}
                    />
                    {/* <Route
                        exact
                        path="/protected-page"
                        component={ProtectedPage}
                    />
                    <Route
                        exact
                        path="/forgot-password"
                        component={ForgotPasswordPage}
                    />
                    <Route
                        exact
                        path="/reset-password"
                        component={ResetPasswordPage}
                    />
                    <Route exact path="*" component={NotfoundPage} /> */}
                </Switch>
            </Router>
        </div>
    );
}

// function ProtectedRoute(props) {}

export default App;
