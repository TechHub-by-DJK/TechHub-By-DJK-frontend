import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { darkTheme } from './Theme/DarkTheme';
import { Navbar } from './component/Navbar/Navbar';
import Home from './component/Home/Home';
import Login from './component/Auth/Login';
import Cart from './component/Cart/Cart';
import { ShopDetails } from './component/Shop/ShopDetails';
import ComputerDetail from './component/Computer/ComputerDetail';
import SearchResults from './component/Search/SearchResults';
import Orders from './component/Orders/Orders';
import Profile from './component/Profile/Profile';
import TechGadgets from './component/TechGadgets/TechGadgets';
import TechGadgetDetail from './component/TechGadgets/TechGadgetDetail';
import ShopDashboard from './component/Dashboard/ShopDashboard';
import AdminDashboard from './component/Dashboard/AdminDashboard';
import ShopAdmin from './component/Shop/ShopAdmin';
import Checkout from './component/Checkout/Checkout';
import ProtectedRoute from './component/Auth/ProtectedRoute';
import RoleRedirector from './component/Auth/RoleRedirector';
import Footer from './component/Layout/Footer';
import NotFound from './component/Common/NotFound';
import UserRoleDebugger from './component/Common/UserRoleDebugger';
import './App.css';

function App() {
  return (    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>            <Router>
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <RoleRedirector />
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>                
                  {/* Public Routes */}
                <Route path="/" element={
                  <Home />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/shop/:shopId" element={<ShopDetails />} />                
                <Route path="/computer/:computerId" element={<ComputerDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/gadgets" element={<TechGadgets />} />                
                <Route path="/gadget/:gadgetId" element={<TechGadgetDetail />} />
                <Route path="/debug-role" element={<ProtectedRoute><UserRoleDebugger /></ProtectedRoute>} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />                {/* Role-based Protected Routes */}
                <Route path="/shop-admin" element={
                  <ProtectedRoute requiredRole="SHOP_OWNER">
                    <ShopAdmin />
                  </ProtectedRoute>
                } />                
                {/* Redirect from old path to new path */}
                <Route path="/shop-dashboard" element={
                  <ProtectedRoute requiredRole="SHOP_OWNER">
                    <ShopDashboard />
                  </ProtectedRoute>
                } />
                {/* Main shop dashboard route */}
                <Route path="/dashboard/shop" element={
                  <ProtectedRoute requiredRole="SHOP_OWNER">
                    <ShopDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </main>
              <Footer />
            </div>          
            </Router>
        </CartProvider>
      </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;