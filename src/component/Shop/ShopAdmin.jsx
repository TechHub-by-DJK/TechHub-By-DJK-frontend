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
import { apiService } from '../../services/api';

const ShopAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [error, setError] = useState(null);  const [shopFormData, setShopFormData] = useState({
    name: '',
    description: '',
    buildingtype: 'ELECTRONICS',
    // Flattened contact fields to match backend schema
    email: '',
    mobile: '',
    facebook: '',
    instagram: '',
    twitter: '',
    openingHours: '9:00 AM - 6:00 PM',
    // Address will be created separately and only address_id will be sent
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Sri Lanka'
    },
    images: ['https://via.placeholder.com/800x400', 'https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300']
  });
  const [formErrors, setFormErrors] = useState({});
  // Load shop data - check if the user already has a shop
  useEffect(() => {    const checkShopExists = async () => {
      try {
        setLoading(true);
        const shop = await apiService.getShopByOwner();
        
        if (shop && shop.id) {
          setHasShop(true);
          // Redirect to shop dashboard if shop exists
          navigate('/dashboard/shop');
        } else {
          setHasShop(false);
        }
      } catch (err) {
        console.error('Error checking shop status:', err);
        // Handle different error scenarios
        if (err.message.includes('404')) {
          // Standard "not found" response
          setHasShop(false);
          setError(null); // Clear error since 404 is expected when no shop exists
        } else if (err.message.includes('500') && err.message.includes('Shop not found')) {
          // Backend throws 500 error instead of 404 when shop doesn't exist
          console.log('Backend indicates no shop exists for this user (500 error is expected)');
          setHasShop(false);
          setError(null); // Clear error since this is expected behavior
        } else {
          // Other unexpected errors
          setError('Failed to check if you have a shop already. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkShopExists();
  }, [navigate]);  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setShopFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    }
    // Handle regular fields (including flattened contact fields)
    else {
      setShopFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
      // Clear error for this field if user is fixing it
    const fieldName = name.includes('.') ? name.split('.')[1] : name;
    setFormErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
      return prev;
    });
  };
  // Validate form
  const validateForm = () => {
    const errors = {};
      if (!shopFormData.name || shopFormData.name.trim() === '') {
      errors.name = 'Shop name is required';
    }
    
    if (!shopFormData.address.city || shopFormData.address.city.trim() === '') {
      errors.city = 'City is required';
    }
    
    if (!shopFormData.address.streetAddress || shopFormData.address.streetAddress.trim() === '') {
      errors.streetAddress = 'Street address is required';
    }
    
    if (!shopFormData.description || shopFormData.description.trim() === '') {
      errors.description = 'Description is required';
    }
    
    if (!shopFormData.email || shopFormData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shopFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!shopFormData.mobile || shopFormData.mobile.trim() === '') {
      errors.mobile = 'Mobile number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };// Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Step 1: Create address first
      console.log('Creating address with data:', shopFormData.address);
      const addressResponse = await apiService.createAddress(shopFormData.address);
      console.log('Address created:', addressResponse);
      
      // Step 2: Prepare shop data with address_id and flattened contact fields
      const shopData = {
        name: shopFormData.name,
        description: shopFormData.description,
        buildingtype: shopFormData.buildingtype,
        address_id: addressResponse.id, // Use the created address ID
        email: shopFormData.email,
        mobile: shopFormData.mobile,
        facebook: shopFormData.facebook || null,
        instagram: shopFormData.instagram || null,
        twitter: shopFormData.twitter || null,
        openingHours: shopFormData.openingHours,
        images: shopFormData.images
      };
      
      // Log the shop data to verify structure
      console.log('Creating shop with data:', shopData);
      
      await apiService.createShop(shopData);
      
      // Redirect directly to shop dashboard without alert
      navigate('/dashboard/shop', { state: { shopCreated: true } });
    } catch (err) {
      console.error('Error creating shop:', err);
      if (err.message.includes('address')) {
        setError('Failed to create shop address. Please check your address information.');
      } else {
        setError('Failed to create shop. Please try again.');
      }
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Shop Name"
                name="name"
                value={shopFormData.name}
                onChange={handleInputChange}                error={!!formErrors.name}
                helperText={formErrors.name || ''}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="address.city"
                value={shopFormData.address.city}
                onChange={handleInputChange}                error={!!formErrors.city}
                helperText={formErrors.city || ''}
                placeholder="e.g., Colombo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                name="address.streetAddress"
                value={shopFormData.address.streetAddress}
                onChange={handleInputChange}                error={!!formErrors.streetAddress}
                helperText={formErrors.streetAddress || ''}
                placeholder="Full street address"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="address.state"
                value={shopFormData.address.state}
                onChange={handleInputChange}
                placeholder="e.g., Western Province"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="address.zipCode"
                value={shopFormData.address.zipCode}
                onChange={handleInputChange}
                placeholder="e.g., 10100"
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
                onChange={handleInputChange}                error={!!formErrors.description}
                helperText={formErrors.description || ''}
                placeholder="Tell potential customers about your shop"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Hours"
                name="openingHours"
                value={shopFormData.openingHours}
                onChange={handleInputChange}
                placeholder="e.g., 9:00 AM - 6:00 PM"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  name="buildingtype"
                  value={shopFormData.buildingtype}
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
                required
                fullWidth
                label="Contact Email"
                name="email"
                type="email"
                value={shopFormData.email}
                onChange={handleInputChange}                error={!!formErrors.email}
                helperText={formErrors.email || ''}
                placeholder="your@email.com"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={shopFormData.mobile}
                onChange={handleInputChange}                error={!!formErrors.mobile}
                helperText={formErrors.mobile || ''}
                placeholder="+94 77 123 4567"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Facebook (Optional)"
                name="facebook"
                value={shopFormData.facebook}
                onChange={handleInputChange}
                placeholder="facebook.com/yourshop"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Instagram (Optional)"
                name="instagram"
                value={shopFormData.instagram}
                onChange={handleInputChange}
                placeholder="instagram.com/yourshop"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Twitter (Optional)"
                name="twitter"
                value={shopFormData.twitter}
                onChange={handleInputChange}
                placeholder="twitter.com/yourshop"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Shop Images (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add images to showcase your shop. Images will be automatically uploaded to free cloud hosting.
              </Typography>
              {/* Image upload component could go here if needed */}
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
