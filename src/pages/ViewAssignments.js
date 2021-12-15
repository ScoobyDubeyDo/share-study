import {
    collection,
    getDocs,
    doc as fsDoc,
    deleteDoc,
} from "@firebase/firestore";
import {
    ArrowRightTwoTone,
    AssignmentTurnedInTwoTone,
    DeleteForeverTwoTone,
} from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Collapse,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
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

    const onDelete = (id) => {
        setAssiData(assiData.filter((doc) => doc.id !== id));
    };

    useEffect(() => {
        const assignmentRef = collection(db, "assignments");
        let assign = [];
        setBackdropOpen(true);
        getDocs(assignmentRef)
            .then((data) => {
                data.forEach((doc) => {
                    if (doc.data().uid === currentUser.uid) {
                        assign.push({ id: doc.id, ...doc.data() });
                    }
                });
            })
            .then(() => {
                setAssiData([...assign]);
                setBackdropOpen(false);
            });
    }, [currentUser]);
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
                    assiData.map((doc, index) => {
                        return (
                            <AssignmentReview
                                key={index}
                                doc={doc}
                                onDelete={onDelete}
                            />
                        );
                    })
                ) : (
                    <Grid item xs={12}>
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
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

const AssignmentReview = ({ doc, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    action={
                        <IconButton
                            onClick={() => {
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <DeleteForeverTwoTone />
                        </IconButton>
                    }
                    title={doc.title}
                    subheader={`${doc.subject} • ${doc.course} • ${doc.batch}`}
                />
                <Dialog open={deleteDialogOpen}>
                    <DialogTitle id="alert-dialog-title">
                        {"Delete the Assignment?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            The file and all submission data related to it will
                            be permanently deleted from our database.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDeleteDialogOpen(false);
                            }}
                            autoFocus
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                deleteDoc(
                                    fsDoc(db, "assignments", doc.id)
                                ).then(() => {
                                    onDelete(doc.id);
                                });
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <CardContent>
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
