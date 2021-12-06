import { useRef, useState } from "react";
import {
    Avatar,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert,
    useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import logo from "../images/banner.png";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMounted from "../hooks/useMounted";

export default function ForgotPassword() {
    const { passwordReset } = useAuth();
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();
    const emailRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const mounted = useMounted();

    const validate = () => {
        let temp = {};

        temp.email = emailRef.current.value
            ? /^.+@.+.\.+/.test(emailRef.current.value)
                ? ""
                : "Email is not valid"
            : "Provide a Email id";

        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x === "");
    };

    const handleAlert = (severity, message) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            passwordReset(emailRef.current.value)
                .then(() => {
                    handleAlert("success", "Email sent, Check your inbox!");
                })
                .catch((err) => handleAlert("error", err.message))
                .finally(() => mounted.current && setIsSubmitting(false));
        }
    };

    return (
        <div
            style={{
                display: "flex",
                height: "95vh",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar src={logo} sx={{ m: 1 }} />
                    <Typography component="h1" variant="h5">
                        Password Reset
                    </Typography>
                    {alertMessage && (
                        <Alert
                            variant="filled"
                            sx={{ m: 1 }}
                            severity={alertSeverity}
                            children={alertMessage}
                        />
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            mt: 3,
                            width: "100%",
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    size={breakpoint ? "small" : "medium"}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    inputRef={emailRef}
                                    {...(errors.email && {
                                        error: true,
                                        helperText: errors.email,
                                    })}
                                />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            loading={isSubmitting}
                        >
                            Reset Password
                        </LoadingButton>
                        <Grid container>
                            <Grid item xs>
                                <Link
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                    variant="body2"
                                    onClick={() => {
                                        history.push("/signin");
                                    }}
                                >
                                    Signin
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                    variant="body2"
                                    onClick={() => {
                                        history.push("/signup");
                                    }}
                                >
                                    {"Need an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
