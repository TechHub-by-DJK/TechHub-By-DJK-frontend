import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Divider, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { isShopOwner, isAdmin, isCustomer } from '../../utils/roleUtils';
import StoreIcon from '@mui/icons-material/Store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import BuildIcon from '@mui/icons-material/Build';

const UserRoleDebugger = () => {
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Test role detection with ROLE_SHOP_OWNER
  const testRoleShopOwnerDetection = () => {
    const testUser = { role: 'ROLE_SHOP_OWNER' };
    const detected = isShopOwner(testUser);
    
    if (detected) {
      setSuccessMessage('✓ ROLE_SHOP_OWNER successfully detected as shop owner!');
    } else {
      setErrorMessage('✗ ROLE_SHOP_OWNER not detected as shop owner - role detection needs fixing');
    }
    
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const testAllRoleVariants = () => {
    const testCases = [
      { user: { role: 'SHOP_OWNER' }, expected: true, description: 'SHOP_OWNER string' },
      { user: { role: 'ROLE_SHOP_OWNER' }, expected: true, description: 'ROLE_SHOP_OWNER string' },
      { user: { role: 1 }, expected: true, description: 'Numeric 1' },
      { user: { role: 'ROLE_CUSTOMER' }, expected: false, description: 'ROLE_CUSTOMER string' },
      { user: { role: 0 }, expected: false, description: 'Numeric 0' }
    ];
    
    const results = testCases.map(test => ({
      ...test,
      actual: isShopOwner(test.user)
    }));
    
    const allPassed = results.every(r => r.actual === r.expected);
    
    if (allPassed) {
      setSuccessMessage('✓ All role detection tests passed! Both SHOP_OWNER and ROLE_SHOP_OWNER are recognized.');
    } else {
      const failed = results.filter(r => r.actual !== r.expected);
      setErrorMessage(`✗ ${failed.length} role detection tests failed: ${failed.map(f => f.description).join(', ')}`);
    }
    
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };
  
  const handleRefreshUserData = () => {
    // Force a page refresh to re-fetch user data
    window.location.reload();
  };
  
  const refreshAuthWithoutReload = async () => {
    try {
      await checkAuthStatus();
      setSuccessMessage('Auth status refreshed without page reload.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to refresh auth status: ' + error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  const goToShopDashboard = () => {
    window.location.href = '/dashboard/shop';
  };
  
  const goToAdminDashboard = () => {
    window.location.href = '/admin-dashboard';
  };
  
  const goToHome = () => {
    window.location.href = '/';
  };
  
  const fixShopOwnerRole = () => {
    localStorage.setItem('userRole', 'SHOP_OWNER');
    setSuccessMessage('Role updated to SHOP_OWNER. Reloading page...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  const fixUserRole = (role) => {
    let roleValue = role;
    
    // Convert numeric role to string if needed for consistency
    if (role === 1) roleValue = 'SHOP_OWNER';
    else if (role === 0) roleValue = 'ROLE_CUSTOMER';
    else if (role === 2) roleValue = 'ADMIN';
    
    localStorage.setItem('userRole', roleValue);
    setSuccessMessage(`Role updated to ${roleValue}. Reloading page...`);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Test function to simulate API login response for a shop owner 
  const testShopOwnerLogin = async () => {
    try {
      // First, clear any existing data
      localStorage.removeItem('userRole');
      
      // Simulate a shop owner login response from the backend (with numeric role)
      const mockLoginResponse = { 
        jwt: localStorage.getItem('jwt') || 'mock-jwt-token', 
        role: 1  // Numeric shop owner role
      };
      
      // Map numeric role to string role like in AuthContext.login()
      const stringRole = typeof mockLoginResponse.role === 'number'
        ? (mockLoginResponse.role === 1 ? 'SHOP_OWNER' : mockLoginResponse.role === 0 ? 'ROLE_CUSTOMER' : mockLoginResponse.role)
        : mockLoginResponse.role;
      
      // Save role to localStorage
      localStorage.setItem('userRole', stringRole);
      
      setSuccessMessage(`Simulated Shop Owner login. Role: ${mockLoginResponse.role} → ${stringRole}. Reloading...`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setErrorMessage('Test failed: ' + error.message);
    }
  };
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>User Role Debugger</Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>Authentication Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Typography>
      </Box>
        <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>User Role Information:</strong></Typography>        <Box sx={{ 
          bgcolor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1,
          mb: 1
        }}>
          <Typography><strong>Current Role:</strong> {user?.role || 'No role found'}</Typography>
          <Typography><strong>Role in localStorage:</strong> {localStorage.getItem('userRole') || 'Not stored'}</Typography>
          <Typography><strong>Expected Format:</strong> 'SHOP_OWNER' (string) for shop owner, 'ROLE_CUSTOMER' for customer, 'ADMIN' for admin</Typography>
          <Typography><strong>Role Type:</strong> {user ? typeof user.role : 'N/A'}</Typography>
          <Typography><strong>Is Shop Owner (isShopOwner):</strong> {user && isShopOwner(user) ? '✓ Yes' : '✗ No'}</Typography>
          <Typography><strong>Is Admin (isAdmin):</strong> {user && isAdmin(user) ? '✓ Yes' : '✗ No'}</Typography>
          <Typography><strong>Is Customer (isCustomer):</strong> {user && isCustomer(user) ? '✓ Yes' : '✗ No'}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Note: Backend returns numeric roles (0=customer, 1=shop owner, 2=admin) but frontend expects string roles
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>User Data:</strong></Typography>
        <Box component="pre" sx={{ 
          bgcolor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1, 
          maxHeight: '200px', 
          overflow: 'auto',
          fontSize: '0.8rem'
        }}>
          {JSON.stringify(user, null, 2)}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1"><strong>localStorage Content:</strong></Typography>
        <Box component="pre" sx={{ 
          bgcolor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1, 
          maxHeight: '100px', 
          overflow: 'auto',
          fontSize: '0.8rem'
        }}>
          JWT: {localStorage.getItem('jwt') ? '✓ Exists' : '✗ Missing'}{'\n'}
          userRole: {localStorage.getItem('userRole') || 'Not set'}
        </Box>
      </Box>
        <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom><strong>Role Detection Tests:</strong></Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button 
            variant="contained" 
            color="info"
            onClick={testRoleShopOwnerDetection}
          >
            Test ROLE_SHOP_OWNER Detection
          </Button>
          
          <Button 
            variant="contained" 
            color="info"
            onClick={testAllRoleVariants}
          >
            Test All Role Variants
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom><strong>Fix Role:</strong></Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => fixUserRole('ROLE_CUSTOMER')}
            startIcon={<PersonIcon />}
          >
            Set as Customer
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={fixShopOwnerRole}
            startIcon={<StoreIcon />}
          >
            Set as Shop Owner
          </Button>
          
          <Button 
            variant="contained" 
            color="error"
            onClick={() => fixUserRole('ADMIN')}
            startIcon={<AdminPanelSettingsIcon />}
          >
            Set as Admin
          </Button>
        </Box>
      </Box>
        <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom><strong>Role Testing:</strong></Typography>
        <Button
          variant="contained"
          color="warning"
          onClick={testShopOwnerLogin}
          sx={{ mr: 2 }}
        >
          Test Shop Owner Login (Numeric → String)
        </Button>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body1" gutterBottom><strong>Navigation:</strong></Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined"
              onClick={goToHome}
            >
              Home Page
            </Button>
            
            <Button 
              variant="outlined"
              onClick={goToShopDashboard}
              startIcon={<StoreIcon />}
            >
              Shop Dashboard
            </Button>
            
            <Button 
              variant="outlined"
              onClick={goToAdminDashboard}
              startIcon={<AdminPanelSettingsIcon />}
            >
              Admin Dashboard
            </Button>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body1" gutterBottom><strong>Refresh:</strong></Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="info" 
              onClick={refreshAuthWithoutReload}
              startIcon={<RefreshIcon />}
            >
              Refresh Auth
            </Button>
            
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleRefreshUserData}
              startIcon={<BuildIcon />}
            >
              Refresh Page
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserRoleDebugger;
