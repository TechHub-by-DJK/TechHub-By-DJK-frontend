import React from 'react';
import { Button, Box, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isShopOwner } from '../../utils/roleUtils';
import StoreIcon from '@mui/icons-material/Store';
import DashboardIcon from '@mui/icons-material/Dashboard';

const ShopDashboardAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Alert severity="info">
        Please log in to access shop management features.
      </Alert>
    );
  }

  if (!isShopOwner(user)) {
    return (
      <Alert severity="warning">
        You need to be a shop owner to access the shop dashboard.
        Current role: {user.role}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', maxWidth: 400, mx: 'auto' }}>
      <StoreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Shop Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Access your shop dashboard to manage products, orders, and analytics.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          onClick={() => navigate('/dashboard/shop')}
          fullWidth
        >
          Go to Shop Dashboard
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/test-role')}
        >
          Test Role Detection
        </Button>
      </Box>
    </Paper>
  );
};

export default ShopDashboardAccess;
