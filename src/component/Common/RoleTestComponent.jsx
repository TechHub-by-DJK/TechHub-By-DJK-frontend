import React from 'react';
import { Box, Paper, Typography, Button, Alert, Chip, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isShopOwner, isAdmin, isCustomer } from '../../utils/roleUtils';
import StoreIcon from '@mui/icons-material/Store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const RoleTestComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Please login to test role functionality</Alert>
      </Box>
    );
  }

  const userIsShopOwner = isShopOwner(user);
  const userIsAdmin = isAdmin(user);
  const userIsCustomer = isCustomer(user);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Role Testing Component
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Current User Info:</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Name: {user.fullName || user.firstName + ' ' + user.lastName}</Typography>
          <Typography>Role: {user.role}</Typography>
          <Typography>Raw Role Value: {JSON.stringify(user.role)}</Typography>
        </Grid>        <Grid item xs={12}>
          <Typography variant="h6">Role Detection Results:</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Current role: <strong>{user.role}</strong> (Type: {typeof user.role})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip 
              label="Shop Owner" 
              color={userIsShopOwner ? "success" : "default"}
              icon={<StoreIcon />}
            />
            <Chip 
              label="Admin" 
              color={userIsAdmin ? "success" : "default"}
              icon={<AdminPanelSettingsIcon />}
            />
            <Chip 
              label="Customer" 
              color={userIsCustomer ? "success" : "default"}
              icon={<PersonIcon />}
            />
          </Box>
          {user.role === 'ROLE_SHOP_OWNER' && (
            <Typography variant="body2" sx={{ mt: 1, color: 'info.main' }}>
              ✅ Your role 'ROLE_SHOP_OWNER' should now be properly recognized as Shop Owner!
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Available Actions:</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {userIsShopOwner && (
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<StoreIcon />}
                onClick={() => navigate('/dashboard/shop')}
              >
                Go to Shop Dashboard
              </Button>
            )}
            
            {userIsAdmin && (
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admin-dashboard')}
              >
                Go to Admin Dashboard
              </Button>
            )}
            
            <Button 
              variant="outlined"
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>

            <Button 
              variant="outlined"
              onClick={() => navigate('/debug-role')}
            >
              Full Debug Info
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> If you registered as a Shop Owner but see "Customer" role, 
              please logout and login again, or contact support. The Shop Dashboard should be 
              accessible from the user menu (top right) when logged in as a Shop Owner.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoleTestComponent;
