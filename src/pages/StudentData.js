import { collection, getDocs } from "firebase/firestore";
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
    const [studentsData, setStudentsData] = useState([]);

    useEffect(() => {
        const studentDataRef = collection(db, "users");
        let students = [];
        setBackdropOpen(true);
        getDocs(studentDataRef)
            .then((data) => {
                data.forEach((doc) => {
                    if (doc.data().role === "student") {
                        students.push({ id: doc.id, ...doc.data() });
                    }
                });
            })
            .then(() => {
                setStudentsData([...students]);
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
                            <TableCell>Student Name</TableCell>
                            <TableCell align="left">Course</TableCell>
                            <TableCell align="left">Batch</TableCell>
                            <TableCell align="left">Email Id</TableCell>
                            <TableCell align="left">Mobile Number</TableCell>
                            <TableCell align="left">
                                Enrollment Number
                            </TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentsData.map((studentData, index) => (
                            <TableRow
                                key={studentData.email}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {`${studentData.fName} ${studentData.lName}`}
                                </TableCell>
                                <TableCell align="left">
                                    {studentData.course}
                                </TableCell>
                                <TableCell align="left">
                                    {studentData.batch}
                                </TableCell>
                                <TableCell align="left">
                                    {studentData.email}
                                </TableCell>
                                <TableCell align="left">
                                    {studentData.moNumber}
                                </TableCell>
                                <TableCell align="left">
                                    {studentData.enNumber}
                                </TableCell>
                                <TableCell align="left">
                                    {
                                        <Button
                                            endIcon={<PersonRemoveTwoTone />}
                                            color="warning"
                                            onClick={() => {
                                                console.log(studentData.id);
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
