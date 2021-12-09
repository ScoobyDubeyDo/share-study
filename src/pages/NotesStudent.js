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
import { SentimentVeryDissatisfiedTwoTone } from "@mui/icons-material";
function NotesStudent() {
    const [backdropOpen, setBackdropOpen] = useState(false);
    const noteRef = collection(db, "notes");
    const [notesData, setNotesData] = useState([]);
    const [noteIDs, setNoteIDs] = useState([]);

    useEffect(() => {
        let assr = [];
        let noteKey = [];
        setBackdropOpen(true);
        getDocs(noteRef)
            .then((data) => {
                data.forEach((doc) => {
                    assr.push(doc.data());
                    noteKey.push(doc.id);
                });
            })
            .then(() => {
                setNotesData([...assr]);
                setNoteIDs([...noteKey]);
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
            <Box maxWidth="md" sx={{ mx: "auto", my: 2 }}>
                {notesData ? (
                    <Masonry columns={{ xs: 1, md: 4, sm: 2 }} sx={{ m: 0 }}>
                        {notesData.map((doc, index) => {
                            return (
                                <Card key={noteIDs[index]}>
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
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Quos
                                            culpa at eius delectus neque
                                            perspiciatis illum ad ipsraesentium
                                            voluptate nulla, sit delectus fugit
                                            aut, tempore illo!
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
                ) : (
                    <Card>
                        <CardContent>
                            <Button
                                disabled
                                fullWidth
                                endIcon={<SentimentVeryDissatisfiedTwoTone />}
                            >
                                No notes
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Container>
    );
}

export default NotesStudent;
