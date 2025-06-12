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
  People as UsersIcon,
  ShoppingCart as OrderIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  MoreVert as MoreIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
    // Dialog states
  
  // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [menuType, setMenuType] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [
        usersResponse,
        shopsResponse,
        ordersResponse,
        categoriesResponse
      ] = await Promise.allSettled([
        apiService.getAllUsers(),
        apiService.getAllShops(),
        apiService.getAllOrders(),
        apiService.getAllCategories()
      ]);

      if (usersResponse.status === 'fulfilled') {
        setUsers(usersResponse.value.data || []);
      }

      if (shopsResponse.status === 'fulfilled') {
        setShops(shopsResponse.value.data || []);
      }

      if (ordersResponse.status === 'fulfilled') {
        setOrders(ordersResponse.value.data || []);
      }

      if (categoriesResponse.status === 'fulfilled') {
        setCategories(categoriesResponse.value.data || []);
      }

      // Calculate stats
      const totalRevenue = (ordersResponse.value?.data || [])
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      const activeShops = (shopsResponse.value?.data || [])
        .filter(shop => shop.open).length;
      
      const recentOrders = (ordersResponse.value?.data || [])
        .filter(order => {
          const orderDate = new Date(order.orderDate);
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return orderDate >= lastWeek;
        }).length;

      setStats({
        totalUsers: usersResponse.value?.data?.length || 0,
        totalShops: shopsResponse.value?.data?.length || 0,
        activeShops,
        totalOrders: ordersResponse.value?.data?.length || 0,
        recentOrders,
        totalRevenue,
        totalCategories: categoriesResponse.value?.data?.length || 0
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, itemId, type) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItemId(itemId);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItemId(null);
    setMenuType('');
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await apiService.blockUser(userId);
        loadAdminData();
      } catch (error) {
        console.error('Error blocking user:', error);
        setError('Failed to block user');
      }
    }
  };

  const handleApproveShop = async (shopId) => {
    try {
      await apiService.approveShop(shopId);
      loadAdminData();
    } catch (error) {
      console.error('Error approving shop:', error);
      setError('Failed to approve shop');
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'shop_owner': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'primary';
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

  if (user?.role !== 'ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be an administrator to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AdminIcon sx={{ mr: 2, color: 'error.main' }} />
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Platform management and oversight
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UsersIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalUsers || 0}
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
                <StoreIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Shops
                  </Typography>
                  <Typography variant="h5">
                    {stats.activeShops || 0} / {stats.totalShops || 0}
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
                <MoneyIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    {formatPrice(stats.totalRevenue || 0)}
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
                <OrderIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Recent Orders
                  </Typography>
                  <Typography variant="h5">
                    {stats.recentOrders || 0}
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
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<UsersIcon />} label="Users" />
          <Tab icon={<StoreIcon />} label="Shops" />
          <Tab icon={<OrderIcon />} label="Orders" />
          <Tab icon={<CategoryIcon />} label="Categories" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Users Tab */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Users Management ({users.length})
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>
                            {user.firstName?.charAt(0) || user.email?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.blocked ? 'Blocked' : 'Active'}
                          color={user.blocked ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, user.id, 'user')}
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

        {/* Shops Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Shops Management ({shops.length})
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Shop</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={shop.imageUrl}
                            sx={{ mr: 2, width: 48, height: 48 }}
                          >
                            {shop.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {shop.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {shop.description?.substring(0, 30)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {shop.owner?.firstName} {shop.owner?.lastName}
                      </TableCell>
                      <TableCell>
                        {shop.address?.city}, {shop.address?.district}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={shop.open ? 'Open' : 'Closed'}
                            color={shop.open ? 'success' : 'default'}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                          <br />
                          <Chip
                            label={shop.approved ? 'Approved' : 'Pending'}
                            color={shop.approved ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(shop.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, shop.id, 'shop')}
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
        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Orders Overview ({orders.length})
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Shop</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 50).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        {order.user?.firstName} {order.user?.lastName}
                      </TableCell>
                      <TableCell>{order.shop?.name}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status || 'Pending'}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, order.id, 'order')}
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

        {/* Categories Tab */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Categories Management ({categories.length})
              </Typography>              <Button
                variant="contained"
                onClick={() => console.log('Add Category - feature coming soon')}
              >
                Add Category
              </Button>
            </Box>

            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button size="small" startIcon={<EditIcon />}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />}>
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Analytics Tab */}
        {activeTab === 4 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Platform Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced analytics dashboard coming soon...
            </Typography>
          </Paper>
        )}

        {/* Settings Tab */}
        {activeTab === 5 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Platform Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              System configuration options coming soon...
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {menuType === 'user' && (
          <>
            <MenuItemComponent onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit User</ListItemText>
            </MenuItemComponent>
            <MenuItemComponent
              onClick={() => {
                if (selectedItemId) handleBlockUser(selectedItemId);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Block User</ListItemText>
            </MenuItemComponent>
          </>
        )}
        
        {menuType === 'shop' && (
          <>
            <MenuItemComponent
              onClick={() => {
                if (selectedItemId) handleApproveShop(selectedItemId);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <ApproveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Approve Shop</ListItemText>
            </MenuItemComponent>
            <MenuItemComponent onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Shop</ListItemText>
            </MenuItemComponent>
          </>
        )}
        
        {menuType === 'order' && (
          <MenuItemComponent onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItemComponent>
        )}
      </Menu>
    </Container>
  );
};

export default AdminDashboard;
