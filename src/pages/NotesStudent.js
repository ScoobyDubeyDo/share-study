import { useRef, useState, useEffect } from "react";
import { storage, db } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { collection, doc, getDocs } from "firebase/firestore";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    Box,
    Container,
    CssBaseline,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { Masonry } from "@mui/lab";
function NotesStudent() {
    const [backdropOpen, setBackdropOpen] = useState(false);
    const noteRef = collection(db, "notes");
    const [notesData, setNotesData] = useState([]);

    useEffect(() => {
        let assr = [];
        setBackdropOpen(true);
        getDocs(noteRef)
            .then((data) => {
                data.forEach((doc) => {
                    assr.push(doc.data());
                });
            })
            .then(() => {
                setNotesData([...assr]);
                setBackdropOpen(false);
            });
    }, []);

    return (
        <Container sx={{ width: "90vw" }} disableGutters>
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
                <Masonry columns={{ xs: 1, md: 4, sm: 2 }}>
                    {notesData.map((doc) => {
                        return (
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {doc.noteTitle}
                                    </Typography>
                                    <Typography
                                        // sx={{ display: "inline-block" }}
                                        variant="body2"
                                        gutterBottom
                                        color="text.secondary"
                                    >
                                        {`${doc.teacherName} • ${doc.subject}`}
                                    </Typography>
                                    <Typography variant="body1">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Quos culpa at eius
                                        delectus neque perspiciatis illum ad
                                        ipsraesentium voluptate nulla, sit
                                        delectus fugit aut, tempore illo!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        component="a"
                                        size="small"
                                        href={doc.noteURL}
                                    >
                                        Open note
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })}
                </Masonry>
            </Box>
            {/* <Masonry>
                {notesData.map((doc) => {
                    return (
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 20, fontWeight: 600 }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {doc.noteTitle}
                                </Typography>

                                <Typography
                                    sx={{ display: "inline-block" }}
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    {doc.teacherName}
                                </Typography>
                                <Typography
                                    sx={{ display: "inline-block", mx: 2 }}
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    •
                                </Typography>
                                <Typography
                                    sx={{ display: "inline-block" }}
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    {doc.subject}
                                </Typography>
                                <Typography variant="body2">
                                    notes desp..
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <a size="small" href={doc.noteURL}>
                                    Open note
                                </a>
                            </CardActions>
                        </Card>
                    );
                })}
            </Masonry> */}
        </Container>
    );
}

export default NotesStudent;
