import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isShopOwner, isAdmin, getDashboardUrl } from '../../utils/roleUtils';

/**
 * Component that enforces role-based redirections
 * This component should be rendered at the App level to ensure proper routing
 * based on user role, regardless of which page the user tries to access
 */
const RoleRedirector = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
    useEffect(() => {
    // Don't redirect while authentication is still loading
    if (loading) return;
    
    // Don't redirect for these paths - they should be accessible even for shop owners/admins
    const bypassPaths = [
      '/dashboard/shop',
      '/admin-dashboard',
      '/debug-role',
      '/profile',
      '/login',
      '/logout',
      '/shop-admin', // Add shop admin (for creating a new shop)
    ];
    
    // Check if current path should bypass the role redirect
    const shouldBypass = bypassPaths.some(path => 
      location.pathname.startsWith(path) || 
      location.pathname === path
    );
    
    if (shouldBypass) return;
    
    // If authenticated and user role exists, check for needed redirects
    if (isAuthenticated && user) {
      console.log('RoleRedirector: Checking role-based redirects for', user.role, 'at path', location.pathname);
      
      // Shop owners shouldn't see customer-facing pages
      if (isShopOwner(user)) {
        console.log('RoleRedirector: Shop owner detected, redirecting to dashboard');
        navigate('/dashboard/shop', { replace: true });
        return;
      }
      
      // Admins shouldn't see customer-facing pages
      if (isAdmin(user)) {
        console.log('RoleRedirector: Admin detected, redirecting to admin dashboard');
        navigate('/admin-dashboard', { replace: true });
        return;
      }
    }
  }, [user, isAuthenticated, loading, navigate, location.pathname]);
  
  // This component doesn't render anything
  return null;
};

export default RoleRedirector;
