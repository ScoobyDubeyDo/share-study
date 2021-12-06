import { useRef, useState } from "react";
import {
    Avatar,
    CssBaseline,
    TextField,
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
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMounted from "../hooks/useMounted";

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

export default function PasswordReset() {
    const { changePassword } = useAuth();
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();
    const query = useQuery();
    const passwordRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const mounted = useMounted();

    const validate = () => {
        let temp = {};

        temp.password = passwordRef.current.value
            ? /.{8,}$/.test(passwordRef.current.value)
                ? ""
                : "Password must has atleast 8 characters"
            : "Provide a password";

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
            changePassword(query.get("oobCode"), passwordRef.current.value)
                .then(() => {
                    handleAlert("success", "Password changed Successfully!");
                    history.push("/signin");
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
                        Reset your password
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
                                    name="new-password"
                                    label="New Password"
                                    type="password"
                                    id="new-password"
                                    autoComplete="new-password"
                                    inputRef={passwordRef}
                                    {...(errors.password && {
                                        error: true,
                                        helperText: errors.password,
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
                            Save
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
