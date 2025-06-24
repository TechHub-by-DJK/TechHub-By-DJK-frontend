import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole) {
    // Map numeric role values to string roles for comparison
    const userRole = user.role;
    let hasRequiredRole = userRole === requiredRole;
    
    // Special handling for numeric role values
    if (!hasRequiredRole && typeof userRole === 'number') {
      if (requiredRole === 'SHOP_OWNER' && userRole === 1) hasRequiredRole = true;
      else if (requiredRole === 'ROLE_CUSTOMER' && userRole === 0) hasRequiredRole = true;
      else if (requiredRole === 'ADMIN' && userRole === 2) hasRequiredRole = true;
    }
    
    if (!hasRequiredRole) {
      console.log(`Access denied: User has role ${userRole}, but ${requiredRole} is required`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
