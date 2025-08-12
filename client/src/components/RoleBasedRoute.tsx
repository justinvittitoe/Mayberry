import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert, Container } from 'react-bootstrap';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  console.log(user?.role)
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="mt-3 text-muted">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Alert variant="warning">
            <h4>Access Denied</h4>
            <p>You don't have permission to access this page.</p>
            <p className="mb-0">
              Required role: {allowedRoles.join(' or ')}<br />
              Your role: {user?.role || 'None'}
            </p>
          </Alert>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;