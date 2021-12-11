import { collection, getDocs, doc, getDoc } from "@firebase/firestore";
import {
    ArrowRightTwoTone,
    AssignmentTurnedInTwoTone,
} from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Collapse,
    Container,
    CssBaseline,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";

function ViewAssignments() {
    const { currentUser } = useAuth();
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [assiData, setAssiData] = useState([]);
    const [userData, setUserData] = useState({});
    const assignmentRef = collection(db, "assignments");
    const userRef = doc(collection(db, "users"), currentUser.uid);

    useEffect(() => {
        let assign = [];
        setBackdropOpen(true);
        getDoc(userRef).then((data) => {
            setUserData(data.data());
        });
        getDocs(assignmentRef)
            .then((data) => {
                data.forEach((doc) => {
                    assign.push(doc.data());
                });
            })
            .then(() => {
                setAssiData([...assign]);
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
                        if (doc.uid === currentUser.uid) {
                            return <AssignmentReview key={index} doc={doc} />;
                        }
                    })
                ) : (
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                gutterBottom
                            >
                                No assignments available
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        </Container>
    );
}

const AssignmentReview = ({ doc }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Grid item xs={12}>
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
                    <Typography variant="body1">{doc.desc}</Typography>
                </CardContent>
                <CardActions
                    sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Button
                        href={doc.assignnmentURL}
                        component="a"
                        size="small"
                        endIcon={<AssignmentTurnedInTwoTone />}
                        sx={{ px: "8px", py: "6px" }}
                    >
                        View document
                    </Button>
                    <Divider />
                    <Button
                        aria-label="share"
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                        endIcon={
                            <ArrowRightTwoTone
                                sx={{
                                    transform: !expanded
                                        ? "rotate(0deg)"
                                        : "rotate(90deg)",
                                }}
                            />
                        }
                    >
                        {`Submissions (${doc.submissionData.length})`}
                    </Button>
                </CardActions>
                <Collapse
                    in={expanded}
                    timeout="auto"
                    sx={{ backgroundColor: blueGrey[50] }}
                >
                    <Masonry
                        columns={{ xs: 1, sm: 2 }}
                        sx={{
                            m: 0,
                            justifyContent: "center",
                        }}
                        spacing={2}
                    >
                        {doc.submissionData.map((data, index) => {
                            return (
                                <Button
                                    variant="contained"
                                    href={data.submissionURL}
                                    component="a"
                                    key={`${index}${data.enNumber}`}
                                >
                                    {`${data.studName} | ${data.enNumber}`}
                                </Button>
                            );
                        })}
                    </Masonry>
                </Collapse>
            </Card>
        </Grid>
    );
};

export default ViewAssignments;
