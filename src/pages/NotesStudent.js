import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
import { useAuth } from "../context/AuthContext";

function NotesStudent() {
    const { currentUser } = useAuth();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [notesData, setNotesData] = useState([]);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const noteRef = collection(db, "notes");
        const userRef = doc(collection(db, "users"), currentUser.uid);
        let assr = [];
        setBackdropOpen(true);
        getDoc(userRef).then((data) => {
            setUserData(data.data());
        });
        getDocs(noteRef)
            .then((data) => {
                data.forEach((doc) => {
                    // assr.push(doc.data());
                    if (
                        doc.data().batch === userData.batch &&
                        doc.data().course === userData.course
                    ) {
                        assr.push(doc.data());
                    }
                });
            })
            .then(() => {
                setNotesData([...assr]);
                setBackdropOpen(false);
            });
    }, [currentUser.uid]);

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
                {notesData.length > 0 ? (
                    <Masonry columns={{ xs: 1, md: 4, sm: 2 }} sx={{ m: 0 }}>
                        {notesData.map((doc, index) => {
                            return (
                                <Card key={index}>
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            color="text.secondary"
                                            gutterBottom
                                        >
                                            {doc.noteTitle}
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
            {console.log(notesData.length)}
        </Container>
    );
}

export default NotesStudent;
