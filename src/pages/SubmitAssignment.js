import {
    FilePresentTwoTone,
    PreviewTwoTone,
    FileUploadTwoTone,
    SentimentVeryDissatisfiedTwoTone,
} from "@mui/icons-material";
import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    FormLabel,
    Grid,
    Input,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../utils/firebase";
import { collection, getDocs, setDoc, getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { lightGreen } from "@mui/material/colors";

function SubmitAssignment() {
    const { currentUser } = useAuth();
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [assiData, setAssiData] = useState([]);
    const [uploadedFile, setUploadedFile] = useState();
    const [userData, setUserData] = useState({});
    const userRef = doc(collection(db, "users"), currentUser.uid);
    const assignmentRef = collection(db, "assignments");
    const [allowSubmit, setAllowSubmit] = useState(true);
    const [isUploaded, setIsUploaded] = useState(false);
    useEffect(() => {
        let assign = [];
        setBackdropOpen(true);
        getDoc(userRef).then((data) => {
            setUserData(data.data());
        });
        getDocs(assignmentRef)
            .then((data) => {
                data.forEach((doc) => {
                    if (
                        doc.data().batch === userData.batch &&
                        doc.data().course === userData.course
                    ) {
                        assign.push({ id: doc.id, ...doc.data() });
                    }
                });
            })
            .then(() => {
                setAssiData([...assign]);
                setBackdropOpen(false);
            });
    }, []);

    const assignmentSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setAllowSubmit(false);
        }
    };

    const handleSubmit = (e, docID) => {
        setBackdropOpen(true);
        const fileRef = ref(
            storage,
            `Assignment/${userData.fName}_${userData.enNumber}_${uploadedFile.name}`
        );
        const assignmentUploadRef = doc(db, "assignments", docID);
        uploadBytes(fileRef, uploadedFile).then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((res) => {
                    setDoc(
                        assignmentUploadRef,
                        {
                            submissionData: [
                                {
                                    enNumber: userData.enNumber,
                                    studName: `${userData.fName} ${userData.lName}`,
                                    submissionURL: res,
                                },
                            ],
                        },
                        { merge: true }
                    ).then(() => {
                        setBackdropOpen(false);
                        setAllowSubmit(true);
                        setIsUploaded(true);
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        });
    };
    console.log(assiData);

    return (
        <Container sx={{ width: "90vw" }}>
            <CssBaseline />
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={backdropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2}>
                {assiData.length > 0 ? (
                    assiData.map((doc) => {
                        return (
                            <Grid key={doc.id} item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            {doc.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                            color="text.secondary"
                                        >
                                            {`${doc.teacherName} • ${doc.subject}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            {doc.desc}
                                        </Typography>
                                    </CardContent>
                                    {!doc.submissionData.some(
                                        (e) => e.enNumber === userData.enNumber
                                    ) ? (
                                        <CardActions
                                            sx={{
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                display: isUploaded
                                                    ? "none"
                                                    : "",
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        href={
                                                            doc.assignnmentURL
                                                        }
                                                        component="a"
                                                        size="small"
                                                        endIcon={
                                                            <PreviewTwoTone />
                                                        }
                                                        sx={{
                                                            px: "8px",
                                                            py: "6px",
                                                        }}
                                                    >
                                                        View assignment
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Input
                                                        accept="application/pdf"
                                                        sx={{
                                                            display: "none",
                                                        }}
                                                        id="noteFile"
                                                        type="file"
                                                        onChange={(e) =>
                                                            assignmentSelect(e)
                                                        }
                                                    />
                                                    <FormLabel htmlFor="noteFile">
                                                        <Button
                                                            variant={
                                                                "contained"
                                                            }
                                                            endIcon={
                                                                <FilePresentTwoTone />
                                                            }
                                                            component="span"
                                                            color="info"
                                                        >
                                                            Select
                                                        </Button>
                                                    </FormLabel>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        onClick={(e) => {
                                                            handleSubmit(
                                                                e,
                                                                doc.id
                                                            );
                                                        }}
                                                        variant="contained"
                                                        endIcon={
                                                            <FileUploadTwoTone />
                                                        }
                                                        type="submit"
                                                        disabled={allowSubmit}
                                                    >
                                                        Upload
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardActions>
                                    ) : (
                                        <CardContent
                                            sx={{
                                                bgcolor: lightGreen[100],
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                color="CaptionText"
                                            >
                                                {"Assignment already uploaded"}
                                            </Typography>
                                        </CardContent>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Button
                                        disabled
                                        fullWidth
                                        endIcon={
                                            <SentimentVeryDissatisfiedTwoTone />
                                        }
                                    >
                                        No assignments available
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );
}

export default SubmitAssignment;
