import { collection, getDocs } from "@firebase/firestore";
import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";

function ViewAssignments() {
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [assiData, setAssiData] = useState([]);
    const assignmentRef = collection(db, "assignments");

    useEffect(() => {
        let ass = [];
        setBackdropOpen(true);
        getDocs(assignmentRef)
            .then((data) => {
                data.forEach((doc) => {
                    ass.push(doc.data());
                });
            })
            .then(() => {
                setAssiData([...ass]);
                setBackdropOpen(false);
            });
    }, []);

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
                {assiData ? (
                    assiData.map((doc, index) => {
                        return (
                            <Grid key={index} item xs={12}>
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
                                            {`${doc.subject} • ${doc.course} • ${doc.batch}`}
                                        </Typography>
                                        <Typography variant="body1">
                                            {doc.desc}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            href={doc.assignnmentURL}
                                            component="a"
                                            size="small"
                                        >
                                            View document
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <>
                        <Card>assadsda</Card>
                    </>
                )}
            </Grid>
        </Container>
    );
}

export default ViewAssignments;
