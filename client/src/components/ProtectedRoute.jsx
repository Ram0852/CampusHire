
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ disallowAdmin = false }) {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (disallowAdmin && isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
