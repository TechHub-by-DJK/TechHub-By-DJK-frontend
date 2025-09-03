import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isShopOwner } from '../../utils/roleUtils';
import { validateImagesForBackend, getImageValidationMessage } from '../../utils/imageUtils';
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
  ListItemText,  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Checkbox,
  FormControlLabel
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
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import ImageUpload from '../Common/ImageUpload';
import ApiDebugger from '../Common/ApiDebugger';

const ShopDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(
    location.state?.shopCreated || false
  );
  const [shop, setShop] = useState(null);
  const [computers, setComputers] = useState([]);
  const [techGadgets, setTechGadgets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNoShop, setHasNoShop] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Orders details dialog
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dialog states for Shop Management
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [shopFormData, setShopFormData] = useState({
    name: '',
    description: '',
    buildingtype: 'ELECTRONICS',
  address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Sri Lanka'
    },
  // Flattened fields to match backend update schema
  email: '',
  mobile: '',
  facebook: '',
  instagram: '',
  twitter: '',
  openingHours: '',
  images: []
  });

  // Dialog states for Product Management
  const [computerDialogOpen, setComputerDialogOpen] = useState(false);
  const [gadgetDialogOpen, setGadgetDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [selectedGadget, setSelectedGadget] = useState(null);
    // Enhanced form data for computers based on backend structure
  const [computerFormData, setComputerFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    cpu: '',
    ram: '',
    storage: '',
    gpu: '',
    operatingSystem: '',
    rating: 0,
    stockQuantity: 0,
    computerType: 'PC', // LAPTOP or PC
    images: [],
    isHomeUser: false,
    isBusinessUser: false,
    isGamer: false,
    isDesigner: false,
    isDeveloper: false,
    isSeasonal: false,
    computerCategoryId: null, // Properly named for backend
    shopId: null,
    available: true // Add available field
  });

  // Enhanced form data for tech gadgets based on backend structure
  const [gadgetFormData, setGadgetFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    specs: '',
    images: [],
    available: true,
    categoryId: null,
    shopId: null,
    compatibilityType: 'BOTH' // LAPTOP, PC, BOTH
  });

  // Category form data
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });

  const [productTab, setProductTab] = useState(0); // 0: Computers, 1: Tech Gadgets
    // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [menuType, setMenuType] = useState('');
  // Shop images are handled via ImageUpload component now
  const loadShopData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if the shop exists
      try {
        console.log('Attempting to load shop data for user:', user);
        const shopData = await apiService.getShopByOwner();
        console.log('Shop data loaded successfully:', shopData);
        setShop(shopData);
        
        // Load all shop-related data in parallel for better performance
        const [computersResponse, ordersResponse, gadgetsResponse, categoriesResponse] = await Promise.allSettled([
          apiService.getShopComputers(shopData.id),
          apiService.getShopOrders(shopData.id),
          apiService.getTechGadgetsByShop(shopData.id),
          apiService.getShopCategories()
        ]);
  
        // Handle computers data
        if (computersResponse.status === 'fulfilled') {
          const computersData = computersResponse.value?.data || computersResponse.value || [];
          setComputers(Array.isArray(computersData) ? computersData : []);
        } else {
          console.warn('Failed to load computers:', computersResponse.reason);
          setComputers([]);
        }
  
        // Handle orders data and calculate analytics
        if (ordersResponse.status === 'fulfilled') {
          const ordersData = ordersResponse.value?.data || ordersResponse.value || [];
          setOrders(Array.isArray(ordersData) ? ordersData : []);
          calculateAnalytics(Array.isArray(ordersData) ? ordersData : []);
        } else {
          console.warn('Failed to load orders:', ordersResponse.reason);
          setOrders([]);
          calculateAnalytics([]);
        }
  
        // Handle tech gadgets data
        if (gadgetsResponse.status === 'fulfilled') {
          const gadgetsData = gadgetsResponse.value?.data || gadgetsResponse.value || [];
          setTechGadgets(Array.isArray(gadgetsData) ? gadgetsData : []);
        } else {
          console.warn('Failed to load tech gadgets:', gadgetsResponse.reason);
          setTechGadgets([]);
        }

        // Handle categories data
        if (categoriesResponse.status === 'fulfilled') {
          const categoriesData = categoriesResponse.value?.data || categoriesResponse.value || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } else {
          console.warn('Failed to load categories:', categoriesResponse.reason);
          setCategories([]);
        }      } catch (shopError) {
        console.log('Shop loading error details:', shopError);
        
        // Handle different types of errors
        if (shopError.message && (shopError.message.includes('404') || shopError.message.includes('No shop found'))) {
          console.log('Shop not found for this user, showing shop creation interface');
          setError('You do not have a shop yet. Please create one to access your shop dashboard.');
          setHasNoShop(true);
          setLoading(false);
          return;
        } else if (shopError.message && shopError.message.includes('400')) {
          console.log('Bad request - possible authentication or data issue');
          setError('There was an issue loading your shop data. This might be due to authentication or server configuration. Please try logging out and back in.');
          setHasNoShop(true);
          setLoading(false);
          return;
        } else if (shopError.message && shopError.message.includes('500') && shopError.message.includes('Shop not found')) {
          console.log('Backend indicates no shop exists for this user (500 error is expected behavior)');
          setError('You do not have a shop yet. Please create one to access your shop dashboard.');
          setHasNoShop(true);
          setLoading(false);
          return;
        } else {
          // Other error
          throw shopError;
        }
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
      setError(`Failed to load shop data: ${error.message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isShopOwner(user)) {
      loadShopData();
    }
  }, [user, loadShopData]);

  const calculateAnalytics = (ordersData) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const recentOrders = ordersData.filter(order => new Date(order.createdAt || order.orderDate) >= lastMonth);
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const monthlyRevenue = recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    setAnalytics({
      totalOrders: ordersData.length,
      monthlyOrders: recentOrders.length,
      totalRevenue,
      monthlyRevenue,
      averageOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0
    });
  };
  // Enhanced Computer Management Functions
  const handleAddComputer = () => {
    if (!shop || !shop.id) {
      setSnackbar({ open: true, message: 'Shop information is missing. Please refresh the page and try again.', severity: 'error' });
      return;
    }    setSelectedComputer(null);
    setComputerFormData({
      name: '',
      description: '',
      price: '',
      brand: '',
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
      operatingSystem: '',
      rating: 0,
      stockQuantity: 0,
      computerType: 'PC',
      images: [],
      isHomeUser: false,
      isBusinessUser: false,
      isGamer: false,
      isDesigner: false,
      isDeveloper: false,
      isSeasonal: false,
      computerCategoryId: categories.length > 0 ? categories[0].id : null, // Use ID
      shopId: shop?.id,
      available: true
    });
    setComputerDialogOpen(true);
  };

  const handleEditComputer = (computer) => {
    setSelectedComputer(computer);
    setComputerFormData({      name: computer.name || '',
      description: computer.description || '',
      price: computer.price || '',
      brand: computer.brand || '',
      cpu: computer.cpu || '',
      ram: computer.ram || '',
      storage: computer.storage || '',
      gpu: computer.gpu || '',
      operatingSystem: computer.operatingSystem || '',
      rating: computer.rating || 0,
      stockQuantity: computer.stockQuantity || 0,
      computerType: computer.computerType || 'PC',
      images: computer.images || [],
      isHomeUser: computer.isHomeUser || false,
      isBusinessUser: computer.isBusinessUser || false,
      isGamer: computer.isGamer || false,
      isDesigner: computer.isDesigner || false,
      isDeveloper: computer.isDeveloper || false,
      isSeasonal: computer.isSeasonal || false,
      computerCategoryId: computer.computerCategoryId || computer.computerCategory?.id || null,
      shopId: shop?.id,
      available: computer.available !== undefined ? computer.available : true
    });
    setComputerDialogOpen(true);
  };
  const handleSaveComputer = async () => {
    try {
      setLoading(true);

      // Check if shop exists
      if (!shop || !shop.id) {
        setSnackbar({ open: true, message: 'Shop information is missing. Please refresh the page and try again.', severity: 'error' });
        return;
      }      // Validate required fields
      if (!computerFormData.name || !computerFormData.brand || !computerFormData.price) {
        setSnackbar({ open: true, message: 'Please fill in all required fields (Name, Brand, Price).', severity: 'error' });
        return;
      }

      // Additional validation
      if (parseFloat(computerFormData.price) <= 0) {
        setSnackbar({ open: true, message: 'Price must be greater than 0.', severity: 'error' });
        return;
      }

      if (!computerFormData.computerCategoryId) {
        setSnackbar({ open: true, message: 'Please select a category for the computer.', severity: 'warning' });
      }
        // Validate and filter images for database safety
      const imageValidation = validateImagesForBackend(computerFormData.images || []);
      if (imageValidation.hasIssues) {
        const message = getImageValidationMessage(imageValidation);
        setSnackbar({ open: true, message, severity: 'warning' });
      }
        // Prepare computer data according to backend CreateComputerRequest structure
      const computerData = {
        name: computerFormData.name.trim(),
        description: computerFormData.description.trim(),
        price: parseFloat(computerFormData.price) || 0,
        brand: computerFormData.brand.trim(),
        cpu: computerFormData.cpu.trim(),
        ram: computerFormData.ram.trim(),
        storage: computerFormData.storage.trim(),
        gpu: computerFormData.gpu.trim(),
        operatingSystem: computerFormData.operatingSystem.trim(),
        rating: parseFloat(computerFormData.rating) || 0,
        stockQuantity: parseInt(computerFormData.stockQuantity) || 0,
        computerType: computerFormData.computerType,
        images: imageValidation.validImages, // Use validated images
        isHomeUser: computerFormData.isHomeUser,
        isBusinessUser: computerFormData.isBusinessUser,
        isGamer: computerFormData.isGamer,
        isDesigner: computerFormData.isDesigner,
        isDeveloper: computerFormData.isDeveloper,
        isSeasonal: computerFormData.isSeasonal,
        // Backend expects a Category object in CreateComputerRequest
        category: computerFormData.computerCategoryId ? { id: computerFormData.computerCategoryId } : null,
        shopId: shop.id,
        available: computerFormData.available,
        includedComponents: [] // Empty for now
      };

      // Debug logging
      console.log('Creating computer with data:', computerData);
      console.log('Shop ID:', shop.id);
      console.log('Category ID:', computerFormData.computerCategoryId);

      if (selectedComputer) {
        // Editing full computer details is not supported by backend; only availability toggle exists
        setSnackbar({ open: true, message: 'Editing existing computer details is not supported by the backend. You can delete and recreate the product.', severity: 'warning' });
      } else {
        await apiService.createComputer(computerData);
        setSnackbar({ open: true, message: 'Computer created successfully!', severity: 'success' });
      }

      setComputerDialogOpen(false);
      loadShopData(); // Reload data
    } catch (error) {
      console.error('Error saving computer:', error);
      setSnackbar({ open: true, message: 'Failed to save computer. Please try again.', severity: 'error' });
      setLoading(false);
    }
  };

  const handleDeleteComputer = async (computerId) => {
    if (window.confirm('Are you sure you want to delete this computer? This action cannot be undone.')) {
      try {
        setLoading(true);
        await apiService.deleteComputer(computerId);
        setSnackbar({ open: true, message: 'Computer deleted successfully!', severity: 'success' });
        loadShopData(); // Reload data
      } catch (error) {
        console.error('Error deleting computer:', error);
        setSnackbar({ open: true, message: 'Failed to delete computer. Please try again.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };
  // Enhanced Tech Gadget Management Functions
  const handleAddGadget = () => {
    if (!shop || !shop.id) {
      setSnackbar({ open: true, message: 'Shop information is missing. Please refresh the page and try again.', severity: 'error' });
      return;
    }
    setSelectedGadget(null);
    setGadgetFormData({
      name: '',
      description: '',
      price: '',
      brand: '',
      specs: '',
      images: [],
      available: true,
      categoryId: categories.length > 0 ? categories[0].id : null,
      shopId: shop?.id,
      compatibilityType: 'BOTH'
    });
    setGadgetDialogOpen(true);
  };

  const handleEditGadget = (gadget) => {
    setSelectedGadget(gadget);
    setGadgetFormData({
      name: gadget.name || '',
      description: gadget.description || '',
      price: gadget.price || '',
      brand: gadget.brand || '',
      specs: gadget.specs || '',
      images: gadget.images || [],
      available: gadget.available !== undefined ? gadget.available : true,
      categoryId: gadget.category?.id || null,
      shopId: shop?.id,
      compatibilityType: gadget.compatibilityType || 'BOTH'
    });
    setGadgetDialogOpen(true);
  };
  const handleSaveGadget = async () => {
    try {
      setLoading(true);

      // Check if shop exists
      if (!shop || !shop.id) {
        setSnackbar({ open: true, message: 'Shop information is missing. Please refresh the page and try again.', severity: 'error' });
        return;
      }

      // Validate required fields
      if (!gadgetFormData.name || !gadgetFormData.brand || !gadgetFormData.price) {
        setSnackbar({ open: true, message: 'Please fill in all required fields (Name, Brand, Price).', severity: 'error' });
        return;
      }
        // Validate and filter images for database safety
      const imageValidation = validateImagesForBackend(gadgetFormData.images || []);
      if (imageValidation.hasIssues) {
        const message = getImageValidationMessage(imageValidation);
        setSnackbar({ open: true, message, severity: 'warning' });
      }
      
      // Prepare gadget data according to backend CreateTechGadgetRequest structure
      const gadgetData = {
        name: gadgetFormData.name,
        description: gadgetFormData.description,
        price: parseFloat(gadgetFormData.price),
        brand: gadgetFormData.brand,
        specs: gadgetFormData.specs,
        images: imageValidation.validImages, // Use validated images
        available: gadgetFormData.available,
        categoryId: gadgetFormData.categoryId,
        shopId: shop.id,
        compatibilityType: gadgetFormData.compatibilityType
      };

      if (selectedGadget) {
        await apiService.updateTechGadget(selectedGadget.id, gadgetData);
        setSnackbar({ open: true, message: 'Tech gadget updated successfully!', severity: 'success' });
      } else {
        await apiService.createTechGadget(gadgetData);
        setSnackbar({ open: true, message: 'Tech gadget created successfully!', severity: 'success' });
      }

      setGadgetDialogOpen(false);
      loadShopData(); // Reload data
    } catch (error) {
      console.error('Error saving tech gadget:', error);
      setSnackbar({ open: true, message: 'Failed to save tech gadget. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGadget = async (gadgetId) => {
    if (window.confirm('Are you sure you want to delete this tech gadget? This action cannot be undone.')) {
      try {
        setLoading(true);
        await apiService.deleteTechGadget(gadgetId);
        setSnackbar({ open: true, message: 'Tech gadget deleted successfully!', severity: 'success' });
        loadShopData(); // Reload data
      } catch (error) {
        console.error('Error deleting tech gadget:', error);
        setSnackbar({ open: true, message: 'Failed to delete tech gadget. Please try again.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Category Management Functions
  const handleCreateCategory = async () => {
    try {
      setLoading(true);
      
      const categoryData = {
        name: categoryFormData.name
      };

      await apiService.createCategory(categoryData);
      setSnackbar({ open: true, message: 'Category created successfully!', severity: 'success' });
      setCategoryDialogOpen(false);
      setCategoryFormData({ name: '' });
      
      // Reload categories
      const categoriesResponse = await apiService.getShopCategories();
      setCategories(categoriesResponse?.data || categoriesResponse || []);
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbar({ open: true, message: 'Failed to create category. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Note: Delete/Update category not supported by backend; UI only lists categories

  const handleSaveShop = async () => {
    try {
      setLoading(true);
      let response;

      // Validate and filter images for DB safety
      const imageValidation = validateImagesForBackend(shopFormData.images || []);
      if (imageValidation.hasIssues) {
        const message = getImageValidationMessage(imageValidation);
        setSnackbar({ open: true, message, severity: 'warning' });
      }

      // Determine address_id strategy: backend expects address_id, not nested object
      let addressId = shop?.address?.id || null;
      const addr = shopFormData.address || {};
      const currentAddr = shop?.address || {};
      const addressChanged = (
        (addr.streetAddress || '') !== (currentAddr.streetAddress || '') ||
        (addr.city || '') !== (currentAddr.city || '') ||
        (addr.state || '') !== (currentAddr.state || '') ||
        (addr.zipCode || '') !== (currentAddr.zipCode || '') ||
        (addr.country || 'Sri Lanka') !== (currentAddr.country || 'Sri Lanka')
      );

      if (addressChanged) {
        try {
          const createdAddr = await apiService.createAddress({
            streetAddress: addr.streetAddress || '',
            city: addr.city || '',
            state: addr.state || '',
            zipCode: addr.zipCode || '',
            country: addr.country || 'Sri Lanka'
          });
          addressId = createdAddr?.id || addressId;
        } catch (addrErr) {
          console.error('Failed to create address for shop update:', addrErr);
          // Continue without changing address if creation fails
        }
      }

      // Build payload matching backend schema
      const payload = {
        name: shopFormData.name,
        description: shopFormData.description,
        buildingtype: shopFormData.buildingtype,
        openingHours: shopFormData.openingHours,
        images: imageValidation.validImages,
        // Contact fields
        email: shopFormData.email || null,
        mobile: shopFormData.mobile || null,
        facebook: shopFormData.facebook || null,
        instagram: shopFormData.instagram || null,
        twitter: shopFormData.twitter || null,
        // Address linkage
        ...(addressId ? { address_id: addressId } : {})
      };

      if (shop) {
        // Update existing shop
        response = await apiService.updateShop(shop.id, payload);
        setShop(response.data || response);
        setSnackbar({ open: true, message: 'Shop updated successfully', severity: 'success' });
      } else {
        // Create new shop
        response = await apiService.createShop({ ...payload, address_id: addressId });
        setShop(response.data || response);
        setSnackbar({ open: true, message: 'Shop created successfully', severity: 'success' });
      }
      setShopDialogOpen(false);
      
      // Reload shop data to get latest information
      await loadShopData();
    } catch (error) {
      console.error('Error saving shop:', error);
      setSnackbar({ open: true, message: 'Failed to save shop details', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  // Utility Functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
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

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return 'Not set';
    const parts = [addr.streetAddress, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Not set';
  };

  // Kept for potential future use if we show chips again
  // const getStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case 'completed': return 'success';
  //     case 'pending': return 'warning';
  //     case 'cancelled': return 'error';
  //     default: return 'primary';
  //   }
  // };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleMenuClick = (event, itemId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItemId(itemId);
    // Store the product type from the button's data attribute
    const productType = event.currentTarget.getAttribute('data-product-type');
    setMenuType(productType);
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
  if (hasNoShop) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Welcome to TechHub Shop Owner Portal
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            You don't have a shop set up yet. Create your shop to start selling computers and tech products.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              As a Shop Owner, you can:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComputerIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography>Manage your tech products</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <OrderIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography>Process customer orders</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnalyticsIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography>View business analytics</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography>Track your revenue</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<StoreIcon />}
            onClick={() => {
              console.log('Navigating to shop creation page');
              navigate('/shop-admin');
            }}
            sx={{ mt: 4 }}
          >
            Create My Shop
          </Button>
        </Paper>
      </Container>
    );
  }
  if (!isShopOwner(user)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be a shop owner to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {showSuccessAlert && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setShowSuccessAlert(false)}
          >
            Shop created successfully! Welcome to your shop dashboard.
          </Alert>
        )}
        
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Shop Owner Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Managing: {shop?.name || 'My Shop'}
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
      <Paper sx={{ mb: 3 }}>        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<ComputerIcon />} label="Products" />
          <Tab icon={<OrderIcon />} label="Orders" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<StoreIcon />} label="Shop Settings" />
          <Tab icon={<SettingsIcon />} label="API Debug" />
        </Tabs>
      </Paper>      {/* Tab Content */}
      <Box>
        {/* Products Tab */}        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            {!shop || !shop.id ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Shop information is not available. Please refresh the page or create your shop first.
              </Alert>
            ) : null}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Products ({computers.length + techGadgets.length})
              </Typography>
              <Box>
                <Tabs
                  value={productTab}
                  onChange={(e, newValue) => setProductTab(newValue)}
                  aria-label="product type tabs"
                  sx={{ mb: 2 }}
                >
                  <Tab label="Computers" />
                  <Tab label="Tech Gadgets" />
                </Tabs>
              </Box>              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={productTab === 0 ? handleAddComputer : handleAddGadget}
                disabled={!shop || !shop.id}
              >
                Add {productTab === 0 ? 'Computer' : 'Tech Gadget'}
              </Button>
            </Box>

            {productTab === 0 ? (
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
                    {computers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                            No computers found. Add your first computer product!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (                      computers.map((computer) => (
                        <TableRow key={computer.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={(computer.images && computer.images[0]) || computer.imageUrl || ''}
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
                                {computer.cpu || computer.processor || '—'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {computer.ram || '—'} RAM • {computer.storage || '—'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleMenuClick(e, computer.id)}
                              aria-label="computer actions"
                              data-product-type="computer"
                            >
                              <MoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {techGadgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                            No tech gadgets found. Add your first tech gadget!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      techGadgets.map((gadget) => (
                        <TableRow key={gadget.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={(gadget.images && gadget.images[0]) || gadget.imageUrl || ''}
                                alt={gadget.name}
                                sx={{ mr: 2, width: 48, height: 48 }}
                              />
                              <Box>
                                <Typography variant="subtitle2">
                                  {gadget.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {gadget.description?.substring(0, 50)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{gadget.brand}</TableCell>
                          <TableCell>{formatPrice(gadget.price)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={gadget.category?.name || (typeof gadget.category === 'string' ? gadget.category : '—')} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>                            <IconButton
                              onClick={(e) => handleMenuClick(e, gadget.id)}
                              aria-label="gadget actions"
                              data-product-type="gadget"
                            >
                              <MoreIcon />                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                        {order.customer?.fullName || order.customer?.email || 'Customer'}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt || order.orderDate)}</TableCell>
                      <TableCell>{order.items?.length ?? order.totalItem ?? order.orderItems?.length ?? 0}</TableCell>
                      <TableCell>{formatPrice(order.totalAmount || order.totalPrice || 0)}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <Select
                            value={(order.orderStatus || order.status || 'PENDING').toUpperCase()}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                await apiService.updateOrderStatus(order.id, newStatus);
                                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, orderStatus: newStatus } : o));
                                const updated = orders.map(o => o.id === order.id ? { ...o, orderStatus: newStatus } : o);
                                calculateAnalytics(updated);
                                setSnackbar({ open: true, message: 'Order status updated', severity: 'success' });
                              } catch (err) {
                                console.error('Failed to update order status', err);
                                setSnackbar({ open: true, message: 'Failed to update order status', severity: 'error' });
                              }
                            }}
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => { setSelectedOrder(order); setOrderDetailsOpen(true); }}>
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}        {/* Analytics Tab */}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Shop Settings
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  onClick={() => setCategoryDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Manage Categories
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  onClick={() => {
                    // Prefill form with existing shop data
                    setShopFormData({
                      name: shop?.name || '',
                      description: shop?.description || '',
                      buildingtype: shopFormData.buildingtype || 'ELECTRONICS',
                      address: {
                        streetAddress: shop?.address?.streetAddress || '',
                        city: shop?.address?.city || '',
                        state: shop?.address?.state || '',
                        zipCode: shop?.address?.zipCode || '',
                        country: shop?.address?.country || 'Sri Lanka'
                      },
                      email: shop?.email || '',
                      mobile: shop?.mobile || shop?.phoneNumber || '',
                      facebook: shop?.facebook || '',
                      instagram: shop?.instagram || '',
                      twitter: shop?.twitter || '',
                      openingHours: shop?.openingHours || shopFormData.openingHours || '',
                      images: Array.isArray(shop?.images) ? shop.images : (shop?.imageUrl ? [shop.imageUrl] : []),
                      phoneNumber: shop?.phoneNumber || ''
                    });
                    setShopDialogOpen(true);
                  }}
                >
                  Edit Shop Details
                </Button>
              </Box>
            </Box>

            {/* Shop Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BusinessIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Shop Information</Typography>
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {shop?.name || 'Not set'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Description:</strong> {shop?.description || 'No description'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Address:</strong> {formatAddress(shop?.address)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Phone:</strong> {shop?.phoneNumber || 'Not set'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CategoryIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Categories</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Chip
                            key={category.id}
                            label={category.name}
                            variant="outlined"
                            size="small"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No categories created yet
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>            </Grid>
          </Paper>
        )}

        {/* API Debug Tab */}
        {activeTab === 4 && (
          <Paper sx={{ p: 3 }}>
            <ApiDebugger />
          </Paper>
        )}
      </Box>{/* Context Menu for Products */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: { minWidth: 180 }
        }}
      >        <MenuItemComponent
          onClick={() => {
            if (menuType === 'gadget') {
              const gadget = techGadgets.find(g => g.id === selectedItemId);
              handleEditGadget(gadget);
            } else {
              const computer = computers.find(c => c.id === selectedItemId);
              handleEditComputer(computer);
            }
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
            if (menuType === 'gadget') {
              handleDeleteGadget(selectedItemId);
            } else {
              handleDeleteComputer(selectedItemId);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItemComponent>
        
        <MenuItemComponent
          onClick={() => {
            if (menuType === 'gadget') {
              window.open(`/gadget/${selectedItemId}`, '_blank');
            } else {
              window.open(`/computer/${selectedItemId}`, '_blank');
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Add/Edit Computer Dialog */}
      <Dialog
        open={computerDialogOpen}
        onClose={() => setComputerDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedComputer ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
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
                required
                fullWidth
                label="Price (LKR)"
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
                label="Stock Quantity"
                type="number"
                value={computerFormData.stockQuantity}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  stockQuantity: parseInt(e.target.value) || 0
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Computer Type</InputLabel>
                <Select
                  value={computerFormData.computerType}
                  label="Computer Type"
                  onChange={(e) => setComputerFormData(prev => ({
                    ...prev,
                    computerType: e.target.value
                  }))}
                >
                  <MenuItem value="PC">Desktop PC</MenuItem>
                  <MenuItem value="LAPTOP">Laptop</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={computerFormData.computerCategoryId || ''}
                  label="Category"
                  onChange={(e) => setComputerFormData(prev => ({
                    ...prev,
                    computerCategoryId: e.target.value
                  }))}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RAM"
                value={computerFormData.ram}
                placeholder="e.g., 16GB DDR4"
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  ram: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPU/Processor"
                value={computerFormData.cpu}
                placeholder="e.g., Intel Core i7-12700K"
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  cpu: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Storage"
                value={computerFormData.storage}
                placeholder="e.g., 1TB SSD"
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  storage: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GPU/Graphics"
                value={computerFormData.gpu}
                placeholder="e.g., NVIDIA RTX 4070"
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  gpu: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operating System"
                value={computerFormData.operatingSystem}
                placeholder="e.g., Windows 11 Pro"
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  operatingSystem: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rating (0-5)"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={computerFormData.rating}
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  rating: parseFloat(e.target.value) || 0
                }))}
              />
            </Grid>
            
            {/* Target User Types */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Target Users (Check all that apply):
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isHomeUser}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isHomeUser: e.target.checked
                        }))}
                      />
                    }
                    label="Home Users"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isBusinessUser}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isBusinessUser: e.target.checked
                        }))}
                      />
                    }
                    label="Business Users"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isGamer}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isGamer: e.target.checked
                        }))}
                      />
                    }
                    label="Gamers"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isDesigner}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isDesigner: e.target.checked
                        }))}
                      />
                    }
                    label="Designers"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isDeveloper}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isDeveloper: e.target.checked
                        }))}
                      />
                    }
                    label="Developers"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={computerFormData.isSeasonal}
                        onChange={(e) => setComputerFormData(prev => ({
                          ...prev,
                          isSeasonal: e.target.checked
                        }))}
                      />
                    }
                    label="Seasonal/Special"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={computerFormData.description}
                placeholder="Describe this computer's features, specifications, and benefits..."
                onChange={(e) => setComputerFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <ImageUpload 
                images={computerFormData.images || []}
                onImagesChange={(newImages) => setComputerFormData(prev => ({
                  ...prev,
                  images: newImages
                }))}
                maxImages={5}
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
      </Dialog>      {/* Add/Edit Gadget Dialog */}
      <Dialog
        open={gadgetDialogOpen}
        onClose={() => setGadgetDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedGadget ? 'Edit Tech Gadget' : 'Add New Tech Gadget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gadget Name"
                value={gadgetFormData.name}
                onChange={(e) => setGadgetFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={gadgetFormData.brand}
                onChange={(e) => setGadgetFormData(prev => ({
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
                value={gadgetFormData.price}
                onChange={(e) => setGadgetFormData(prev => ({
                  ...prev,
                  price: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={gadgetFormData.categoryId || ''}
                    label="Category"
                    onChange={(e) => setGadgetFormData(prev => ({
                      ...prev,
                      categoryId: e.target.value
                    }))}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Compatibility</InputLabel>
                <Select
                  value={gadgetFormData.compatibilityType}
                  label="Compatibility"
                  onChange={(e) => setGadgetFormData(prev => ({
                    ...prev,
                    compatibilityType: e.target.value
                  }))}
                >
                  <MenuItem value="PC">PC</MenuItem>
                  <MenuItem value="LAPTOP">Laptop</MenuItem>
                  <MenuItem value="BOTH">Both</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specs / Features"
                value={gadgetFormData.specs}
                onChange={(e) => setGadgetFormData(prev => ({
                  ...prev,
                  specs: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={gadgetFormData.description}
                onChange={(e) => setGadgetFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>            <Grid item xs={12}>
              <ImageUpload 
                images={gadgetFormData.images || []}
                onImagesChange={(newImages) => setGadgetFormData(prev => ({
                  ...prev,
                  images: newImages
                }))}
                maxImages={5}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGadgetDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGadget} variant="contained">
            {selectedGadget ? 'Update' : 'Add'} Tech Gadget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shop Details Dialog */}
      <Dialog
        open={shopDialogOpen}
        onClose={() => setShopDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {shop ? 'Edit Shop Details' : 'Create Shop'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shop Name"
                value={shopFormData.name}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={shopFormData.description}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Address</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={shopFormData.address?.streetAddress || ''}
                    onChange={(e) => setShopFormData(prev => ({
                      ...prev,
                      address: { ...(prev.address || {}), streetAddress: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={shopFormData.address?.city || ''}
                    onChange={(e) => setShopFormData(prev => ({
                      ...prev,
                      address: { ...(prev.address || {}), city: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={shopFormData.address?.state || ''}
                    onChange={(e) => setShopFormData(prev => ({
                      ...prev,
                      address: { ...(prev.address || {}), state: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={shopFormData.address?.zipCode || ''}
                    onChange={(e) => setShopFormData(prev => ({
                      ...prev,
                      address: { ...(prev.address || {}), zipCode: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={shopFormData.address?.country || ''}
                    onChange={(e) => setShopFormData(prev => ({
                      ...prev,
                      address: { ...(prev.address || {}), country: e.target.value }
                    }))}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={shopFormData.mobile || shopFormData.phoneNumber || ''}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  mobile: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={shopFormData.email || ''}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Facebook"
                value={shopFormData.facebook || ''}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  facebook: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Instagram"
                value={shopFormData.instagram || ''}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  instagram: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Twitter"
                value={shopFormData.twitter || ''}
                onChange={(e) => setShopFormData(prev => ({
                  ...prev,
                  twitter: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload
                images={shopFormData.images || []}
                onImagesChange={(newImages) => setShopFormData(prev => ({
                  ...prev,
                  images: newImages
                }))}
                maxImages={6}
                uploadType="shop"
                label="Shop Images"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShopDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveShop} variant="contained">
            {shop ? 'Update' : 'Create'} Shop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="New Category Name"
              value={categoryFormData.name}
              onChange={(e) => setCategoryFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCategory();
                }
              }}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateCategory}
              disabled={!categoryFormData.name.trim()}
            >
              Add Category
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Existing Categories
          </Typography>
          
    {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No categories created yet
            </Typography>
          ) : (
            <Box>
              {categories.map((category) => (
                <Box
                  key={category.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body1">{category.name}</Typography>
      {/* Delete not supported by backend */}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Date:</strong> {formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</Typography>
                  <Typography variant="body1"><strong>Status:</strong> {(selectedOrder.orderStatus || selectedOrder.status)}</Typography>
                  <Typography variant="body1"><strong>Total:</strong> {formatPrice(selectedOrder.totalAmount || selectedOrder.totalPrice || 0)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Customer:</strong> {selectedOrder.customer?.fullName || selectedOrder.customer?.email}</Typography>
                  {selectedOrder.deliveryAddress && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {selectedOrder.deliveryAddress.streetAddress || ''} {selectedOrder.deliveryAddress.city || ''}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedOrder.items || selectedOrder.orderItems || []).map((it) => (
                      <TableRow key={it.id}>
                        <TableCell>{it.computer?.name || 'Computer'}</TableCell>
                        <TableCell>{it.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(it.totalPrice || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShopDashboard;
