import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { isShopOwner, isAdmin, isCustomer } from '../../utils/roleUtils';

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
  }  if (requiredRole) {
    let hasRequiredRole = false;
    
    // Use our utility functions to check roles
    if (requiredRole === 'SHOP_OWNER' && isShopOwner(user)) {
      hasRequiredRole = true;
      console.log('ProtectedRoute: User is verified as shop owner');
    } else if (requiredRole === 'ADMIN' && isAdmin(user)) {
      hasRequiredRole = true;
      console.log('ProtectedRoute: User is verified as admin');
    } else if (requiredRole === 'ROLE_CUSTOMER' && isCustomer(user)) {
      hasRequiredRole = true;
      console.log('ProtectedRoute: User is verified as customer');
    } else if (user.role === requiredRole) {
      // Fallback for any other role string that matches exactly
      hasRequiredRole = true;
      console.log(`ProtectedRoute: User role ${user.role} matches required role ${requiredRole}`);
    }
    
    if (!hasRequiredRole) {
      console.log(`Access denied: User has role ${user.role}, but ${requiredRole} is required`);
      // Redirect shop owners to their dashboard instead of home
      if (isShopOwner(user)) {
        return <Navigate to="/dashboard/shop" replace />;
      } else if (isAdmin(user)) {
        return <Navigate to="/admin-dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
