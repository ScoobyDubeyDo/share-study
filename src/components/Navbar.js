import {
    Avatar,
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemText,
    ListItemButton,
    ListItemIcon,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    MenuBookTwoTone,
    AssignmentTwoTone,
    MenuTwoTone,
    LogoutTwoTone,
    AccountBoxTwoTone,
    AssignmentTurnedInTwoTone,
    UploadFileTwoTone,
    BusinessCenterTwoTone,
    BackpackTwoTone,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../images/banner.png";
import { useHistory } from "react-router-dom";
import useRole from "../hooks/useRole";

const drawerWidth = 240;

function Navbar({ children }) {
    const role = useRole();
    const history = useHistory();
    const { signout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("Profile");
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar>
                <Avatar variant="TwoTone" src={logo} />
                <Typography sx={{ ml: 2 }} variant="h6" noWrap align="right">
                    studyShare
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                <ListItemButton
                    onClick={() => {
                        setMobileOpen(false);
                        history.push("/");
                        setHeaderTitle("Profile");
                    }}
                    selected={headerTitle === "Profile" ? true : false}
                >
                    <ListItemIcon>
                        <AccountBoxTwoTone />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                </ListItemButton>

                <>
                    {(role === "student" || role === "teacher") && (
                        <ListItemButton
                            onClick={() => {
                                setMobileOpen(false);
                                history.push("/notes");
                                setHeaderTitle("Notes");
                            }}
                            selected={headerTitle === "Notes" ? true : false}
                        >
                            <ListItemIcon>
                                <MenuBookTwoTone />
                            </ListItemIcon>
                            <ListItemText primary={"Notes"} />
                        </ListItemButton>
                    )}
                </>
                <>
                    {role === "student" && (
                        <ListItemButton
                            onClick={() => {
                                setMobileOpen(false);
                                history.push("/submit-assignment");
                                setHeaderTitle("Assignments");
                            }}
                            selected={
                                headerTitle === "Assignments" ? true : false
                            }
                        >
                            <ListItemIcon>
                                <AssignmentTwoTone />
                            </ListItemIcon>
                            <ListItemText primary={"Assignments"} />
                        </ListItemButton>
                    )}
                </>
                <>
                    {role === "teacher" && (
                        <>
                            <ListItemButton
                                onClick={() => {
                                    setMobileOpen(false);
                                    history.push("/upload-assignment");
                                    setHeaderTitle("Upload Assignment");
                                }}
                                selected={
                                    headerTitle === "Upload Assignment"
                                        ? true
                                        : false
                                }
                            >
                                <ListItemIcon>
                                    <UploadFileTwoTone />
                                </ListItemIcon>
                                <ListItemText primary={"Upload Assignment"} />
                            </ListItemButton>
                            <ListItemButton
                                onClick={() => {
                                    setMobileOpen(false);
                                    history.push("/view-assignment");
                                    setHeaderTitle("View Assignments");
                                }}
                                selected={
                                    headerTitle === "View Assignments"
                                        ? true
                                        : false
                                }
                            >
                                <ListItemIcon>
                                    <AssignmentTurnedInTwoTone />
                                </ListItemIcon>
                                <ListItemText primary={"View Assignments"} />
                            </ListItemButton>
                        </>
                    )}
                </>
                <>
                    {role === "admin" && (
                        <>
                            {" "}
                            <ListItemButton
                                onClick={() => {
                                    setMobileOpen(false);
                                    history.push("/teacher-data");
                                    setHeaderTitle("Teacher Data");
                                }}
                                selected={
                                    headerTitle === "Teacher Data"
                                        ? true
                                        : false
                                }
                            >
                                <ListItemIcon>
                                    <BusinessCenterTwoTone />
                                </ListItemIcon>
                                <ListItemText primary={"Teacher Data"} />
                            </ListItemButton>
                            <ListItemButton
                                onClick={() => {
                                    setMobileOpen(false);
                                    history.push("/student-data");
                                    setHeaderTitle("Student Data");
                                }}
                                selected={
                                    headerTitle === "Student Data"
                                        ? true
                                        : false
                                }
                            >
                                <ListItemIcon>
                                    <BackpackTwoTone />
                                </ListItemIcon>
                                <ListItemText primary={"Student Data"} />
                            </ListItemButton>
                        </>
                    )}
                </>
                <ListItemButton onClick={async () => signout()}>
                    <ListItemIcon>
                        <LogoutTwoTone />
                    </ListItemIcon>
                    <ListItemText primary={"Log out"} />
                </ListItemButton>
            </List>
        </div>
    );
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                    >
                        <MenuTwoTone />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {headerTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    p: 3,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default Navbar;
