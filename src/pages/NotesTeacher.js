import { FilePresentTwoTone, FileUploadTwoTone } from "@mui/icons-material";
import {
    Container,
    CssBaseline,
    Grid,
    Box,
    TextField,
    useMediaQuery,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Input,
    FormLabel,
    Button,
    Typography,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import { storage, db } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { useRef, useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

function NotesTeacher() {
    const theme = useTheme();
    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));
    const { currentUser } = useAuth();
    const [currBatch, setCurrBatch] = useState("");
    const [currCourse, setCurrCourse] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadedFile, setUploadedFile] = useState();
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({});
    const [uploadError, setUploadError] = useState({ color: "", variant: "" });
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [fileURL, setFileURL] = useState("");
    const userRef = doc(collection(db, "users"), currentUser.uid);
    const noteRef = doc(collection(db, "notes"), currentUser.uid);
    const titleRef = useRef();
    const subjectRef = useRef();

    useEffect(() => {
        setBackdropOpen(true);
        getDoc(userRef)
            .then((data) => {
                setUserData(data.data());
            })
            .then(() => setBackdropOpen(false));
    }, []);

    const noteSubmit = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setFileName(file.name);
        }
    };

    const validate = () => {
        let temp = {};
        temp.nTitle = titleRef.current.value ? "" : "Provide a title";

        temp.subject = subjectRef.current.value ? "" : "Provide a subject name";

        temp.batch = currBatch === "" ? "Select your Batch" : "";

        temp.course = currCourse === "" ? "Select your Course" : "";

        temp.file = uploadedFile ? "" : "Upload a file";

        if (!uploadedFile) {
            setFileName("Upload a file");
            setUploadError({
                color: "error",
                variant: "outlined",
            });
        }
        if (uploadedFile) {
            setUploadError({
                color: "",
                variant: "",
            });
        }
        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x === "");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setBackdropOpen(true);
        if (validate()) {
            const fileRef = ref(
                storage,
                `Notes/${userData.fName}_${titleRef.current.value}_${uploadedFile.name}`
            );
            uploadBytes(fileRef, uploadedFile)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((res) => setFileURL(res));
                })
                .then(() => {
                    setDoc(
                        noteRef,
                        {
                            teacherName: `${userData.fName} ${userData.lName}`,
                            batch: currBatch,
                            course: currCourse,
                            noteTitle: titleRef.current.value,
                            subject: subjectRef.current.value,
                            noteURL: fileURL,
                        },
                        { merge: true }
                    ).then(() => setBackdropOpen(false));
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    return (
        <Container maxWidth="sm">
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={backdropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
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
                            required
                            fullWidth
                            id="noteTitle"
                            label="Note Title"
                            name="noteTitle"
                            inputRef={titleRef}
                            {...(errors.nTitle && {
                                error: true,
                                helperText: errors.nTitle,
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size={breakpoint ? "small" : "medium"}
                            required
                            fullWidth
                            id="subject"
                            label="Subject"
                            name="subject"
                            inputRef={subjectRef}
                            {...(errors.subject && {
                                error: true,
                                helperText: errors.subject,
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl
                            fullWidth
                            size={breakpoint ? "small" : "medium"}
                            error={errors.batch ? true : false}
                        >
                            <InputLabel>Batch</InputLabel>
                            <Select
                                value={currBatch}
                                label="Batch"
                                onChange={(event) => {
                                    setCurrBatch(event.target.value);
                                }}
                                size={breakpoint ? "small" : "medium"}
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
                            <FormHelperText error={errors.batch ? true : false}>
                                {errors.batch}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl
                            fullWidth
                            size={breakpoint ? "small" : "medium"}
                            error={errors.course ? true : false}
                        >
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={currCourse}
                                label="Course"
                                onChange={(event) => {
                                    setCurrCourse(event.target.value);
                                }}
                                size={breakpoint ? "small" : "medium"}
                            >
                                <MenuItem value={"B.C.A."}>B.C.A.</MenuItem>
                                <MenuItem value={"B.Sc.IT"}>B.Sc.IT</MenuItem>
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
                    <Grid item xs={12} sm={6}>
                        <Typography
                            color={uploadError.color ? uploadError.color : ""}
                        >
                            {fileName && `You selected:- ${fileName}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Input
                                    accept="application/pdf"
                                    sx={{ display: "none" }}
                                    id="noteFile"
                                    type="file"
                                    onChange={(e) => noteSubmit(e)}
                                />
                                <FormLabel htmlFor="noteFile">
                                    <Button
                                        variant={
                                            uploadError.variant
                                                ? uploadError.variant
                                                : "contained"
                                        }
                                        endIcon={<FilePresentTwoTone />}
                                        component="span"
                                        color={
                                            uploadError.color
                                                ? uploadError.color
                                                : "info"
                                        }
                                    >
                                        Select
                                    </Button>
                                </FormLabel>
                            </Grid>
                            <Grid item sm={6}>
                                <Button
                                    variant="contained"
                                    endIcon={<FileUploadTwoTone />}
                                    type="submit"
                                >
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default NotesTeacher;
