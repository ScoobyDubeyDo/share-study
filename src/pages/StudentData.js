import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { PersonRemoveTwoTone } from "@mui/icons-material";

function StudentData() {
    const { currentUser } = useAuth();
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [teachersData, setTeachersData] = useState([]);

    useEffect(() => {
        const teacherDataRef = collection(db, "users");
        const userRef = doc(collection(db, "users"), currentUser.uid);
        let teachers = [];
        setBackdropOpen(true);
        getDoc(userRef).then((data) => {
            setUserData(data.data());
        });
        getDocs(teacherDataRef)
            .then((data) => {
                data.forEach((doc) => {
                    if (doc.data().role === "student") {
                        teachers.push({ id: doc.id, ...doc.data() });
                    }
                });
            })
            .then(() => {
                setTeachersData([...teachers]);
                setBackdropOpen(false);
            });
    }, [currentUser.uid]);

    return (
        <Container>
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={backdropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Sr. NO.</TableCell>
                            <TableCell>Teacher Name</TableCell>
                            <TableCell align="left">Email Id</TableCell>
                            <TableCell align="left">Mobile Number</TableCell>
                            <TableCell align="left">
                                Enrollment Number
                            </TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachersData.map((teacherData, index) => (
                            <TableRow
                                key={teacherData.email}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {`${teacherData.fName} ${teacherData.lName}`}
                                </TableCell>
                                <TableCell align="left">
                                    {teacherData.email}
                                </TableCell>
                                <TableCell align="left">
                                    {teacherData.moNumber}
                                </TableCell>
                                <TableCell align="left">
                                    {teacherData.enNumber}
                                </TableCell>
                                <TableCell align="left">
                                    {
                                        <Button
                                            endIcon={<PersonRemoveTwoTone />}
                                            color="warning"
                                            onClick={() => {
                                                console.log(teacherData.id);
                                            }}
                                        >
                                            Delete User
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default StudentData;
