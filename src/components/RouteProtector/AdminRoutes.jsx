import { Navigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../Context/UserContext.jsx";

const AdminRoutes = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user) return <Navigate to="/login" />;
    if (user.role !== "admin") return <Navigate to="/login" />;

    return children;
};

export default AdminRoutes;