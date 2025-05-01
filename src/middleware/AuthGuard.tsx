import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

// Custom hook to get token and check roles
const useAuth = () => {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    return {
        isAdmin: !!token,  // If token exists, user is considered admin
        isUser: !token,    // If no token, user is considered a normal user
    };
};

// Public Routes: Only accessible to non-admin users
export const PublicRoutes = () => {
    // const { isAdmin } = useAuth();
    // if (isAdmin) return <Navigate to="/admin/dashboard" />;
    return <Outlet />;
};

// Private Admin Routes: Only accessible by admin
export const AdminRoutes = () => {
    const { isAdmin } = useAuth();
    if (!isAdmin) return <Navigate to="/login/admin" />;
    return <Outlet />;
};

// Private App Routes: Only accessible by users
export const AppRoutes = () => {
    const { isAdmin } = useAuth();
    if (isAdmin) return <Navigate to="/admin/dashboard" />;
    return <Outlet />;
};

// Redirect Admin if they try to access login after logging in
export const AdminLoginGuard = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAdmin) {
            // Check if we came from another route (not direct URL access)
            if (location.key !== 'default') {
                navigate(-1); // Go back to previous route
            } else {
                navigate('/admin/dashboard'); // Fallback to dashboard if no history
            }
        }
    }, [isAdmin, navigate, location.key]);

    return isAdmin ? null : <Outlet />;
};
