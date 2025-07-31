import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../utils/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();

    // if (loading) {
    //     return (
    //         <div className="loading-spinner">
    //             <div className="spinner"></div>
    //         </div>
    //     );
    // }

    if (!AuthService.loggedIn) {
        // Redirect to login page with the current location as the return path
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 