import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Store as StoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const ShopAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [error, setError] = useState(null);
  const [shopFormData, setShopFormData] = useState({
    name: '',
    location: '',
    description: '',
    address: '',
    hours: '9:00 AM - 6:00 PM',
    logo: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/800x400', 'https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
    category: 'ELECTRONICS'
  });
  const [formErrors, setFormErrors] = useState({});

  // Load shop data - check if the user already has a shop
  useEffect(() => {
    const checkShopExists = async () => {
      try {
        setLoading(true);
        const data = await apiService.getShopAdminData();
        
        if (data.exists && data.shop) {
          setHasShop(true);
          // Redirect to shop dashboard if shop exists
          navigate('/dashboard/shop');
        } else {
          setHasShop(false);
        }
      } catch (err) {
        console.error('Error checking shop status:', err);
        setError('Failed to check if you have a shop already. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkShopExists();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopFormData({
      ...shopFormData,
      [name]: value
    });
    
    // Clear error for this field if user is fixing it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!shopFormData.name || shopFormData.name.trim() === '') {
      errors.name = 'Shop name is required';
    }
    
    if (!shopFormData.location || shopFormData.location.trim() === '') {
      errors.location = 'Location is required';
    }
    
    if (!shopFormData.description || shopFormData.description.trim() === '') {
      errors.description = 'Description is required';
    }
    
    if (!shopFormData.address || shopFormData.address.trim() === '') {
      errors.address = 'Address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.createShopByOwner(shopFormData);
      
      // Redirect directly to shop dashboard without alert
      navigate('/dashboard/shop', { state: { shopCreated: true } });
    } catch (err) {
      console.error('Error creating shop:', err);
      setError('Failed to create shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user already has a shop, they shouldn't see this page
  // We redirect in the useEffect, but this is a fallback
  if (hasShop) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <StoreIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h1">
            Create Your Shop
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" color="textSecondary" paragraph>
          Set up your shop to start selling computers and tech gadgets on TechHub.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Shop Name"
                name="name"
                value={shopFormData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={shopFormData.location}
                onChange={handleInputChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                placeholder="City, Country"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={shopFormData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                placeholder="Full street address"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={shopFormData.description}
                onChange={handleInputChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                placeholder="Tell potential customers about your shop"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Hours"
                name="hours"
                value={shopFormData.hours}
                onChange={handleInputChange}
                placeholder="e.g., 9:00 AM - 6:00 PM"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  name="category"
                  value={shopFormData.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                  <MenuItem value="COMPUTERS">Computers</MenuItem>
                  <MenuItem value="PERIPHERALS">Peripherals</MenuItem>
                  <MenuItem value="COMPONENTS">Components</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
                <FormHelperText>Select the main category for your shop</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logo"
                value={shopFormData.logo}
                onChange={handleInputChange}
                placeholder="URL to your logo image"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Featured Image URL"
                name="featuredImage"
                value={shopFormData.images[0]}
                onChange={(e) => {
                  const newImages = [...shopFormData.images];
                  newImages[0] = e.target.value;
                  setShopFormData({
                    ...shopFormData,
                    images: newImages
                  });
                }}
                placeholder="URL to your shop's main image"
              />
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 3, mb: 2 }}>
            After creating your shop, you can add products and manage orders from your shop dashboard.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              {loading ? 'Creating...' : 'Create Shop'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShopAdmin;
