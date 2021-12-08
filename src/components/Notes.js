import NotesTeacher from "../pages/NotesTeacher";
import NotesStudent from "../pages/NotesStudent";
import useRole from "../hooks/useRole";
function Notes() {
    const role = useRole();

    if (role === "teacher") {
        return <NotesTeacher />;
    } else if (role === "student") {
        return <NotesStudent />;
    } else {
        return <p>loading</p>;
    }
}
export default Notes;
