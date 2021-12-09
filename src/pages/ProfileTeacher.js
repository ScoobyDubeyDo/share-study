import {
    Button,
    Container,
    CssBaseline,
    Box,
    Grid,
    TextField,
    CircularProgress,
    Backdrop,
    Alert,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { useTheme, useMediaQuery } from "@mui/material";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

function ProfileTeacher() {
    const profileBase = { email: "", fName: "", lName: "", moNumber: "" };
    const { currentUser, updateEmailId, reAuthenticate } = useAuth();
    const [userData, setUserData] = useState({
        ...profileBase,
        emID: "",
    });
    const [errors, setErrors] = useState({});
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [formDisable, setFormDisable] = useState(true);
    const [switchButtons, setSwitchButtons] = useState(true);
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const [asdf, setAsdf] = useState(false);
    const FnameRef = useRef();
    const LnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const emIDRef = useRef();
    const moNumberRef = useRef();
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const userRef = doc(collection(db, "users"), currentUser.uid);

    useEffect(() => {
        setBackdropOpen(true);
        getDoc(userRef).then((data) => {
            setUserData(data.data());
            setBackdropOpen(false);
        });
    }, []);

    const handleAlert = (severity, message) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

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

        temp.moNumber = moNumberRef.current.value
            ? moNumberRef.current.value.length === 10
                ? ""
                : "Mobile number should be 10 digits long"
            : "Provide a mobile number";

        temp.emID = emIDRef.current.value
            ? emIDRef.current.value.length === 10
                ? ""
                : "employee ID should be 10 digits long"
            : "Provide an employee ID";

        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x === "");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            setBackdropOpen(true);
            reAuthenticate(passwordRef.current.value)
                .then(() => {
                    if (emailRef.current.value !== currentUser.email) {
                        updateEmailId(emailRef.current.value)
                            .then(() => {
                                handleAlert(
                                    "info",
                                    "Check your inbox for email verification"
                                );
                            })
                            .catch((err) => {
                                handleAlert("error", err.message);
                            });
                    }
                    setDoc(
                        userRef,
                        {
                            email: emailRef.current.value,
                            emID: Number(emIDRef.current.value),
                            fName: FnameRef.current.value,
                            lName: LnameRef.current.value,
                            moNumber: Number(moNumberRef.current.value),
                        },
                        { merge: true }
                    )
                        .then(() => {
                            handleAlert(
                                "success",
                                "Profile updated successfully"
                            );
                        })
                        .catch((err) => handleAlert("error", err.message))
                        .finally(setBackdropOpen(false));
                })
                .catch((err) => {
                    handleAlert("error", err.message);
                })
                .finally(setBackdropOpen(false));
        }
    };
    return (
        <>
            {userData.role && (
                <Container>
                    <CssBaseline />
                    <Backdrop
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={backdropOpen}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Box maxWidth="md" sx={{ m: "auto" }}>
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
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        inputRef={FnameRef}
                                        defaultValue={userData.fName}
                                        disabled={formDisable}
                                        {...(errors.Fname && {
                                            error: true,
                                            helperText: errors.Fname,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        inputRef={LnameRef}
                                        defaultValue={userData.lName}
                                        disabled={formDisable}
                                        {...(errors.Lname && {
                                            error: true,
                                            helperText: errors.Lname,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        inputRef={emailRef}
                                        defaultValue={userData.email}
                                        disabled={formDisable}
                                        {...(errors.email && {
                                            error: true,
                                            helperText: errors.email,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        name="employeeID"
                                        required
                                        fullWidth
                                        id="employeeID"
                                        label="employee ID"
                                        inputRef={emIDRef}
                                        defaultValue={userData.emID}
                                        disabled={formDisable}
                                        {...(errors.emID && {
                                            error: true,
                                            helperText: errors.emID,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        name="mobileNumber"
                                        required
                                        fullWidth
                                        id="mobileNumber"
                                        label="Mobile Number"
                                        inputRef={moNumberRef}
                                        defaultValue={userData.moNumber}
                                        disabled={formDisable}
                                        {...(errors.moNumber && {
                                            error: true,
                                            helperText: errors.moNumber,
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
                                        disabled={formDisable}
                                        inputRef={passwordRef}
                                        {...(errors.password && {
                                            error: true,
                                            helperText: errors.password,
                                        })}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{ textAlign: { sm: "end" } }}
                                >
                                    {switchButtons ? (
                                        <Button
                                            variant="contained"
                                            fullWidth={
                                                breakpoint ? true : false
                                            }
                                            type="submit"
                                            onClick={() => {
                                                setFormDisable(false);
                                                setSwitchButtons(
                                                    !switchButtons
                                                );
                                            }}
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            fullWidth={
                                                breakpoint ? true : false
                                            }
                                            onClick={() => {
                                                if (validate()) {
                                                    setFormDisable(true);
                                                    setSwitchButtons(
                                                        !switchButtons
                                                    );
                                                }
                                            }}
                                        >
                                            Save Profile
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            )}
        </>
    );
}

export default ProfileTeacher;
