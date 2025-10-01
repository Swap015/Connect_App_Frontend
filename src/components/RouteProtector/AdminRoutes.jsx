import { Navigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../Context/UserContext.jsx";

const AdminRoutes = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;
    if (user.role !== "admin") return <Navigate to="/login" />;

    return children;
};

export default AdminRoutes;