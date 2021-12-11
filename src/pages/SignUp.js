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
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import logo from "../images/banner.png";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMounted from "../hooks/useMounted";
import { db } from "../utils/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function SignUp() {
    const { signup } = useAuth();
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();
    const FnameRef = useRef();
    const LnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState("student");
    const [currBatch, setCurrBatch] = useState("");
    const [currCourse, setCurrCourse] = useState("");
    const [isStudent, setIsStudent] = useState(true);
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const mounted = useMounted();

    const validate = () => {
        let temp = {};
        temp.Fname = FnameRef.current.value ? "" : "Provide First Name";

        temp.Lname = LnameRef.current.value ? "" : "Provide Last Name";

        temp.email = emailRef.current.value
            ? /^.+@.+.\.+/.test(emailRef.current.value)
                ? ""
                : "Email is not valid"
            : "Provide a Email id";

        temp.password = passwordRef.current.value
            ? /.{8,}$/.test(passwordRef.current.value)
                ? ""
                : "Password must has atleast 8 characters"
            : "Provide a password";

        temp.batch = isStudent
            ? currBatch === ""
                ? "Select your Batch"
                : ""
            : "";

        temp.course = isStudent
            ? currCourse === ""
                ? "Select your Course"
                : ""
            : "";

        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x === "");
    };

    const handleAlert = (severity, message) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    const handleRole = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
        }
        if (newRole === "teacher") {
            setIsStudent(false);
        } else if (newRole === "student") {
            setIsStudent(true);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            signup(emailRef.current.value, passwordRef.current.value)
                .then((res) => {
                    const userRef = doc(collection(db, "users"), res.user.uid);
                    if (role === "student") {
                        setDoc(userRef, {
                            email: emailRef.current.value,
                            fName: FnameRef.current.value,
                            lName: LnameRef.current.value,
                            role: role,
                            batch: currBatch,
                            course: currCourse,
                        }).then(history.push("/"));
                    }
                    if (role === "teacher") {
                        setDoc(userRef, {
                            email: emailRef.current.value,
                            fName: FnameRef.current.value,
                            lName: LnameRef.current.value,
                            role: role,
                        }).then(history.push("/"));
                    }
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
                        Sign up
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
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    size={breakpoint ? "small" : "medium"}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    inputRef={FnameRef}
                                    {...(errors.Fname && {
                                        error: true,
                                        helperText: errors.Fname,
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    size={breakpoint ? "small" : "medium"}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    inputRef={LnameRef}
                                    {...(errors.Lname && {
                                        error: true,
                                        helperText: errors.Lname,
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ToggleButtonGroup
                                    size={breakpoint ? "small" : "medium"}
                                    value={role}
                                    fullWidth
                                    exclusive
                                    color="primary"
                                    onChange={handleRole}
                                    aria-label="text alignment"
                                >
                                    <ToggleButton value="teacher">
                                        Teacher
                                    </ToggleButton>
                                    <ToggleButton value="student">
                                        Student
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            {isStudent && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            fullWidth
                                            size={
                                                breakpoint ? "small" : "medium"
                                            }
                                            error={errors.batch ? true : false}
                                        >
                                            <InputLabel>Batch</InputLabel>
                                            <Select
                                                value={currBatch}
                                                label="Batch"
                                                onChange={(event) => {
                                                    setCurrBatch(
                                                        event.target.value
                                                    );
                                                }}
                                                size={
                                                    breakpoint
                                                        ? "small"
                                                        : "medium"
                                                }
                                                disabled={!isStudent}
                                            >
                                                <MenuItem value={"2019-2022"}>
                                                    2019-2022
                                                </MenuItem>
                                                <MenuItem value={"2020-2023"}>
                                                    2020-2023
                                                </MenuItem>
                                                <MenuItem value={"2021-2024"}>
                                                    2021-2024
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText
                                                error={
                                                    errors.batch ? true : false
                                                }
                                            >
                                                {errors.batch}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            fullWidth
                                            size={
                                                breakpoint ? "small" : "medium"
                                            }
                                            error={errors.course ? true : false}
                                        >
                                            <InputLabel>Course</InputLabel>
                                            <Select
                                                value={currCourse}
                                                label="Course"
                                                onChange={(event) => {
                                                    setCurrCourse(
                                                        event.target.value
                                                    );
                                                }}
                                                size={
                                                    breakpoint
                                                        ? "small"
                                                        : "medium"
                                                }
                                                disabled={!isStudent}
                                            >
                                                <MenuItem value={"B.C.A."}>
                                                    B.C.A.
                                                </MenuItem>
                                                <MenuItem value={"B.Sc.IT"}>
                                                    B.Sc.IT
                                                </MenuItem>
                                                <MenuItem
                                                    value={" B.Sc.IT(IMS)"}
                                                >
                                                    B.Sc.IT(IMS)
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText
                                                error={
                                                    errors.course ? true : false
                                                }
                                            >
                                                {errors.course}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
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
                            <Grid item xs={12}>
                                <TextField
                                    size={breakpoint ? "small" : "medium"}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
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
                            Sign Up
                        </LoadingButton>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                    variant="body2"
                                    onClick={() => {
                                        history.push("/signin");
                                    }}
                                >
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
