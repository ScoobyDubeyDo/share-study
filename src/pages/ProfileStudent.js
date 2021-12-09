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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { useTheme, useMediaQuery } from "@mui/material";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

function ProfileStudent() {
    const profileBase = { email: "", fName: "", lName: "", moNumber: "" };
    const { currentUser, updateEmailId, reAuthenticate } = useAuth();
    const [userData, setUserData] = useState({
        ...profileBase,
        batch: "",
        course: "",
        enNumber: "",
    });
    const [errors, setErrors] = useState({});
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [formDisable, setFormDisable] = useState(true);
    const [switchButtons, setSwitchButtons] = useState(true);
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const [currBatch, setCurrBatch] = useState("");
    const [currCourse, setCurrCourse] = useState("");
    const [asdf, setAsdf] = useState(false);
    const FnameRef = useRef();
    const LnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const enNumberRef = useRef();
    const moNumberRef = useRef();
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const userRef = doc(collection(db, "users"), currentUser.uid);

    useEffect(() => {
        setBackdropOpen(true);
        getDoc(userRef)
            .then((data) => {
                setUserData(data.data());
                setBackdropOpen(false);
            })
            .then(() => {
                setAsdf(true);
                setCurrBatch(userData.batch);
                setCurrCourse(userData.course);
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

        temp.enNumber = enNumberRef.current.value
            ? enNumberRef.current.value.length === 11
                ? ""
                : "enrollment number should be 11 digits long"
            : "Provide an enrollment number";

        temp.batch = currBatch === "" ? "Select your Batch" : "";
        temp.course = currCourse === "" ? "Select your Course" : "";

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
                            enNumber: Number(enNumberRef.current.value),
                            fName: FnameRef.current.value,
                            lName: LnameRef.current.value,
                            moNumber: Number(moNumberRef.current.value),
                            batch: currBatch,
                            course: currCourse,
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
                                        name="enrollmentNumber"
                                        required
                                        fullWidth
                                        id="enrollmentNumber"
                                        label="enrollment Number"
                                        inputRef={enNumberRef}
                                        defaultValue={userData.enNumber}
                                        disabled={formDisable}
                                        {...(errors.enNumber && {
                                            error: true,
                                            helperText: errors.enNumber,
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
                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        disabled={formDisable}
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
                                                breakpoint ? "small" : "medium"
                                            }
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
                                            error={errors.batch ? true : false}
                                        >
                                            {errors.batch}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        size={breakpoint ? "small" : "medium"}
                                        disabled={formDisable}
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
                                                breakpoint ? "small" : "medium"
                                            }
                                        >
                                            <MenuItem value={"B.C.A."}>
                                                B.C.A.
                                            </MenuItem>
                                            <MenuItem value={"B.Sc.IT"}>
                                                B.Sc.IT
                                            </MenuItem>
                                            <MenuItem value={" B.Sc.IT(IMS)"}>
                                                B.Sc.IT(IMS)
                                            </MenuItem>
                                        </Select>
                                        <FormHelperText
                                            error={errors.course ? true : false}
                                        >
                                            {errors.course}
                                        </FormHelperText>
                                    </FormControl>
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

export default ProfileStudent;
