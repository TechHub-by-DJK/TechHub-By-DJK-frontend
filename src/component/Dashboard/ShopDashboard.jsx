import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Store as StoreIcon,
  Computer as ComputerIcon,
  ShoppingCart as OrderIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const ShopDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [shop, setShop] = useState(null);
  const [computers, setComputers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [computerDialogOpen, setComputerDialogOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [computerFormData, setComputerFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    processor: '',
    ram: '',
    storage: '',
    graphics: '',
    imageUrl: ''
  });
  // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const loadShopData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [shopResponse, computersResponse, ordersResponse] = await Promise.allSettled([
        apiService.getShopByOwner(),
        apiService.getShopComputers(user.shopId),
        apiService.getShopOrders(user.shopId)
      ]);

      if (shopResponse.status === 'fulfilled') {
        setShop(shopResponse.value.data);
      }

      if (computersResponse.status === 'fulfilled') {
        setComputers(computersResponse.value.data || []);
      }

      if (ordersResponse.status === 'fulfilled') {
        setOrders(ordersResponse.value.data || []);
        calculateAnalytics(ordersResponse.value.data || []);
      }    } catch (error) {
      console.error('Error loading shop data:', error);
      setError('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'SHOP_OWNER') {
      loadShopData();
    }
  }, [user, loadShopData]);

  const calculateAnalytics = (ordersData) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const recentOrders = ordersData.filter(order => new Date(order.orderDate) >= lastMonth);
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const monthlyRevenue = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    setAnalytics({
      totalOrders: ordersData.length,
      monthlyOrders: recentOrders.length,
      totalRevenue,
      monthlyRevenue,
      averageOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0
    });
  };

  const handleAddComputer = () => {
    setSelectedComputer(null);
    setComputerFormData({
      name: '',
      brand: '',
      price: '',
      description: '',
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      imageUrl: ''
    });
    setComputerDialogOpen(true);
  };

  const handleEditComputer = (computer) => {
    setSelectedComputer(computer);
    setComputerFormData({
      name: computer.name || '',
      brand: computer.brand || '',
      price: computer.price || '',
      description: computer.description || '',
      processor: computer.processor || '',
      ram: computer.ram || '',
      storage: computer.storage || '',
      graphics: computer.graphics || '',
      imageUrl: computer.imageUrl || ''
    });
    setComputerDialogOpen(true);
  };

  const handleSaveComputer = async () => {
    try {
      const computerData = {
        ...computerFormData,
        price: parseFloat(computerFormData.price),
        ram: parseInt(computerFormData.ram),
        shopId: shop.id
      };

      if (selectedComputer) {
        await apiService.updateComputer(selectedComputer.id, computerData);
      } else {
        await apiService.createComputer(computerData);
      }

      setComputerDialogOpen(false);
      loadShopData(); // Reload data
    } catch (error) {
      console.error('Error saving computer:', error);
      setError('Failed to save computer');
    }
  };

  const handleDeleteComputer = async (computerId) => {
    if (window.confirm('Are you sure you want to delete this computer?')) {
      try {
        await apiService.deleteComputer(computerId);
        loadShopData(); // Reload data
      } catch (error) {
        console.error('Error deleting computer:', error);
        setError('Failed to delete computer');
      }
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'primary';
    }
  };

  const handleMenuClick = (event, itemId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItemId(null);
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

  if (user?.role !== 'SHOP_OWNER') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be a shop owner to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Shop Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {shop?.name || 'My Shop'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    {formatPrice(analytics.totalRevenue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OrderIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h5">
                    {analytics.totalOrders || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h5">
                    {formatPrice(analytics.monthlyRevenue || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ComputerIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Products
                  </Typography>
                  <Typography variant="h5">
                    {computers.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<ComputerIcon />} label="Products" />
          <Tab icon={<OrderIcon />} label="Orders" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<StoreIcon />} label="Shop Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Products Tab */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Products ({computers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddComputer}
              >
                Add Product
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Specs</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {computers.map((computer) => (
                    <TableRow key={computer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={computer.imageUrl}
                            alt={computer.name}
                            sx={{ mr: 2, width: 48, height: 48 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {computer.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {computer.description?.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{computer.brand}</TableCell>
                      <TableCell>{formatPrice(computer.price)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {computer.processor}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {computer.ram}GB RAM • {computer.storage}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, computer.id)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Orders Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Orders ({orders.length})
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        {order.user?.firstName} {order.user?.lastName}
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{order.orderItems?.length || 0}</TableCell>
                      <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || 'Pending'}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Analytics Tab */}
        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Analytics & Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced analytics features coming soon...
            </Typography>
          </Paper>
        )}

        {/* Shop Settings Tab */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Shop Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Shop configuration features coming soon...
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Computer Dialog */}
      <Dialog
        open={computerDialogOpen}
        onClose={() => setComputerDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedComputer ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={computerFormData.name}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={computerFormData.brand}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  brand: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={computerFormData.price}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  price: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RAM (GB)"
                type="number"
                value={computerFormData.ram}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  ram: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Processor"
                value={computerFormData.processor}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  processor: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Storage"
                value={computerFormData.storage}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  storage: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Graphics"
                value={computerFormData.graphics}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  graphics: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={computerFormData.description}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={computerFormData.imageUrl}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  imageUrl: e.target.value
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComputerDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveComputer} variant="contained">
            {selectedComputer ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent
          onClick={() => {
            const computer = computers.find(c => c.id === selectedItemId);
            if (computer) handleEditComputer(computer);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            if (selectedItemId) handleDeleteComputer(selectedItemId);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItemComponent>
      </Menu>
    </Container>
  );
};

export default ShopDashboard;
