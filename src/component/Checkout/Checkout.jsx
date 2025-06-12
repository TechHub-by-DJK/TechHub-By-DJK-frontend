import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    streetAddress: user?.address?.streetAddress || '',
    city: user?.address?.city || '',
    district: user?.address?.district || '',
    province: user?.address?.province || '',
    postalCode: user?.address?.postalCode || ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const steps = ['Order Review', 'Shipping Information', 'Payment', 'Confirmation'];

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateShippingInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'streetAddress', 'city', 'district', 'province', 'postalCode'];
    return required.every(field => shippingInfo[field]?.trim());
  };

  const validatePaymentInfo = () => {
    if (paymentMethod === 'cash_on_delivery') {
      return true;
    }
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    return required.every(field => paymentInfo[field]?.trim());
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          productType: item.type || 'COMPUTER',
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: {
          streetAddress: shippingInfo.streetAddress,
          city: shippingInfo.city,
          district: shippingInfo.district,
          province: shippingInfo.province,
          postalCode: shippingInfo.postalCode
        },
        contactInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone
        },
        paymentMethod: paymentMethod,
        totalAmount: getTotalPrice()
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        clearCart();
        setSuccess(true);
        setActiveStep(steps.length - 1);
        
        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Summary
            </Typography>
            <List>
              {cartItems.map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.imageUrl} alt={item.name} sx={{ width: 60, height: 60 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="h6">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Total Amount:
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatPrice(getTotalPrice())}
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Shipping Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={shippingInfo.firstName}
                  onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={shippingInfo.lastName}
                  onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={shippingInfo.streetAddress}
                  onChange={(e) => handleInputChange('shipping', 'streetAddress', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingInfo.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={shippingInfo.district}
                  onChange={(e) => handleInputChange('shipping', 'district', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Province"
                  value={shippingInfo.province}
                  onChange={(e) => handleInputChange('shipping', 'province', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={shippingInfo.postalCode}
                  onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Payment Information
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="cash_on_delivery"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label="Credit/Debit Card"
                />
                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label="Bank Transfer"
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'credit_card' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                    placeholder="123"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={paymentInfo.cardName}
                    onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {paymentMethod === 'bank_transfer' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Bank transfer details will be provided after order confirmation.
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {success ? (
              <>
                <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
                  Order Placed Successfully!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Thank you for your order. You will receive a confirmation email shortly.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to your orders...
                </Typography>
              </>
            ) : (
              <CircularProgress />
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return cartItems && cartItems.length > 0;
      case 1:
        return validateShippingInfo();
      case 2:
        return validatePaymentInfo();
      default:
        return false;
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && activeStep !== steps.length - 1 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepComplete(activeStep) || loading}
            >
              {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
