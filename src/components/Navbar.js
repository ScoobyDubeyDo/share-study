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
    QuizTwoTone,
    AccountBoxTwoTone,
    AssignmentTurnedInTwoTone,
    UploadFileTwoTone,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../images/banner.png";
import { useLocation, useHistory } from "react-router-dom";
import useRole from "../hooks/useRole";

const drawerWidth = 240;

function ResponsiveDrawer({ children }) {
    const role = useRole();
    const history = useHistory();
    const location = useLocation();
    const { signout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

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
                        history.push("/profile");
                    }}
                >
                    <ListItemIcon>
                        <AccountBoxTwoTone />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <QuizTwoTone />
                    </ListItemIcon>
                    <ListItemText primary={"Tests"} />
                </ListItemButton>
                <ListItemButton
                    onClick={() => {
                        setMobileOpen(false);
                        history.push("/notes");
                    }}
                >
                    <ListItemIcon>
                        <MenuBookTwoTone />
                    </ListItemIcon>
                    <ListItemText primary={"Notes"} />
                </ListItemButton>
                <>
                    {role === "student" && (
                        <ListItemButton
                            onClick={() => {
                                setMobileOpen(false);
                                history.push("/submit-assignment");
                            }}
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
                                }}
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
                                }}
                            >
                                <ListItemIcon>
                                    <AssignmentTurnedInTwoTone />
                                </ListItemIcon>
                                <ListItemText primary={"View Assignments"} />
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
    if (
        location.pathname === "/signin" ||
        location.pathname === "/signup" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password"
    ) {
        return <>{children}</>;
    } else {
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
                            Responsive drawer
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
}

export default ResponsiveDrawer;
