import ProfileTeacher from "../pages/ProfileTeacher";
import ProfileStudent from "../pages/ProfileStudent";
import useRole from "../hooks/useRole";
import { Backdrop, CircularProgress } from "@mui/material";
import ProfileAdmin from "../pages/ProfileAdmin";
function Notes() {
    const role = useRole();

    if (role === "teacher") {
        return <ProfileTeacher />;
    } else if (role === "student") {
        return <ProfileStudent />;
    } else if (role === "admin") {
        return <ProfileAdmin />;
    } else {
        return (
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
}
export default Notes;
