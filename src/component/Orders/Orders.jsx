import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  CheckCircle as CompletedIcon,
  AccessTime as PendingIcon,
  LocalShipping as ShippingIcon,
  Cancel as CancelledIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CompletedIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'shipped':
      case 'out_for_delivery':
        return <ShippingIcon color="info" />;
      case 'cancelled':
        return <CancelledIcon color="error" />;
      default:
        return <OrderIcon color="primary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'shipped':
      case 'out_for_delivery':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchOrders}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <OrderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start shopping to see your orders here
          </Typography>
          <Button variant="contained" href="/">
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(order.status)}
                      <Chip 
                        label={order.status || 'Pending'} 
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Items ({order.orderItems?.length || 0})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={item.computer?.imageUrl}
                            alt={item.computer?.name}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography variant="body2">
                            {item.computer?.name} x{item.quantity}
                          </Typography>
                        </Box>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <Typography variant="body2" color="text.secondary">
                          +{order.orderItems.length - 3} more items
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color="primary">
                        Total: {formatPrice(order.totalAmount)}
                      </Typography>
                      {order.deliveryAddress && (
                        <Typography variant="body2" color="text.secondary">
                          Delivery to: {order.deliveryAddress.city}, {order.deliveryAddress.district}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Order #{selectedOrder?.id} Details
            </Typography>
            <Chip 
              label={selectedOrder?.status || 'Pending'} 
              color={getStatusColor(selectedOrder?.status)}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Order Date: {formatDate(selectedOrder.orderDate)}
              </Typography>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Items
              </Typography>
              <List>
                {selectedOrder.orderItems?.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <Avatar
                      src={item.computer?.imageUrl}
                      alt={item.computer?.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <ListItemText
                      primary={item.computer?.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            Price: {formatPrice(item.price)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Total Amount:
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedOrder.totalAmount)}
                </Typography>
              </Box>

              {selectedOrder.deliveryAddress && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Delivery Address
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.deliveryAddress.streetAddress}<br />
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.district}<br />
                    {selectedOrder.deliveryAddress.province}<br />
                    Postal Code: {selectedOrder.deliveryAddress.postalCode}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
