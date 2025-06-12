import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Rating,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as BackIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Security as WarrantyIcon,
  CheckCircle as AvailableIcon
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { apiService } from '../../services/api';

const TechGadgetDetail = () => {
  const { gadgetId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [gadget, setGadget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const fetchGadgetDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTechGadgetById(gadgetId);
      setGadget(response.data);
    } catch (error) {
      console.error('Error fetching gadget details:', error);
      setError('Failed to load gadget details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [gadgetId]);

  useEffect(() => {
    if (gadgetId) {
      fetchGadgetDetails();
    }
  }, [gadgetId, fetchGadgetDetails]);

  const handleAddToCart = async () => {
    try {
      await addToCart(gadget.id, quantity, 'TECH_GADGET');
      // Show success message or notification
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (gadget.stockQuantity || 10)) {
      setQuantity(value);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gadget.name,
        text: gadget.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !gadget) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Gadget not found'}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/gadgets')}>
          Back to Tech Gadgets
        </Button>
      </Container>
    );
  }

  const images = gadget.images || [gadget.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/gadgets')}
          variant="outlined"
        >
          Back to Gadgets
        </Button>
        <Typography variant="body2" color="text.secondary">
          Home / Tech Gadgets / {gadget.category?.name} / {gadget.name}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Images Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={images[selectedImage]}
              alt={gadget.name}
              sx={{ objectFit: 'contain', p: 2 }}
            />
          </Card>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    border: selectedImage === index ? 2 : 1,
                    borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${gadget.name} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Product Title and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flex: 1 }}>
                {gadget.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setIsFavorite(!isFavorite)}>
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Brand and Category */}
            <Box sx={{ mb: 2 }}>
              <Chip label={gadget.brand} variant="outlined" sx={{ mr: 1 }} />
              <Chip label={gadget.category?.name} variant="outlined" />
            </Box>

            {/* Rating */}
            {gadget.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={gadget.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({gadget.reviewCount || 0} reviews)
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              {formatPrice(gadget.price)}
            </Typography>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {gadget.description}
            </Typography>

            {/* Key Features */}
            {gadget.features && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Key Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {gadget.features.map((feature, index) => (
                    <Chip key={index} label={feature} variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Availability */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AvailableIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="body1" color="success.main">
                In Stock ({gadget.stockQuantity || 'Available'})
              </Typography>
            </Box>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1">Quantity:</Typography>
              <TextField
                type="number"
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: gadget.stockQuantity || 10 }}
                sx={{ width: 80 }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                Buy Now
              </Button>
            </Box>

            {/* Additional Info */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {gadget.warranty && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarrantyIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{gadget.warranty} Warranty</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShippingIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">Free Shipping</Typography>
              </Box>
              {gadget.shop && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StoreIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    onClick={() => navigate(`/shop/${gadget.shop.id}`)}
                  >
                    {gadget.shop.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Specifications Table */}
      {gadget.specifications && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Specifications
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {Object.entries(gadget.specifications).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default TechGadgetDetail;
