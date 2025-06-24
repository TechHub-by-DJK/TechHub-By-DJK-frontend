import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Paper, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import ApiService from '../../services/api';

/**
 * Backend Connection Test Component
 * 
 * Tests and displays the status of the backend connection.
 * Performs various tests to check backend connectivity and functionality.
 */
const BackendConnectionTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // 'online', 'offline', 'unknown'
  const [stats, setStats] = useState({
    success: 0,
    failed: 0,
    total: 0
  });

  const addResult = useCallback((test, status, message, details = null) => {
    setTestResults(prev => [
      ...prev, 
      { 
        test, 
        status, // 'success', 'error', 'info'
        message, 
        details,
        timestamp: new Date() 
      }
    ]);
    
    setStats(prev => ({
      ...prev,
      [status === 'success' ? 'success' : 'failed']: prev[status === 'success' ? 'success' : 'failed'] + 1,
      total: prev.total + 1
    }));
  }, []);

  const runConnectivityTests = useCallback(async () => {
    setTesting(true);
    setTestResults([]);
    setStats({ success: 0, failed: 0, total: 0 });
    setConnectionStatus('unknown');

    // Test 1: Basic connectivity
    addResult('Connection Test', 'info', 'Testing backend connectivity...');
    
    try {
      // Try a simple endpoint that should exist
      const response = await fetch('http://localhost:5454/api/health', {
        method: 'GET'
      });
      
      if (response.ok) {
        addResult('Backend Health', 'success', 'Backend is responding successfully');
        setConnectionStatus('online');
      } else {
        addResult('Backend Health', 'error', `Backend returned status: ${response.status}`);
        setConnectionStatus('offline');
      }
    } catch (error) {
      addResult('Backend Health', 'error', `Connection failed: ${error.message}`);
      setConnectionStatus('offline');
    }

    // Test 2: Auth endpoints
    try {
      const response = await fetch('http://localhost:5454/auth/signin', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      if (response.ok) {
        addResult('Auth API', 'success', 'Authentication endpoints are accessible');
      } else {
        addResult('Auth API', 'error', `Authentication endpoints returned status: ${response.status}`);
      }
    } catch (error) {
      addResult('Auth API', 'error', `Authentication endpoint check failed: ${error.message}`);
    }

    // Test 3: API Service test
    addResult('API Service Test', 'info', 'Testing API service functionality...');
    try {
      // Use the ApiService to make a basic call
      await ApiService.getAllShops();
      addResult('API Service', 'success', 'API Service works correctly');
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        addResult('API Service', 'error', 'Backend connection issue detected');
      } else if (error.message.includes('400')) {
        addResult('API Service', 'success', 'Backend is accessible (validation error expected for test data)');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        addResult('API Service', 'success', 'Backend is accessible (authentication required)');
      } else {
        addResult('API Service', 'warning', `API accessible but returned: ${error.message}`);
      }
    }

    // Test 4: User Profile endpoint
    if (localStorage.getItem('jwt')) {
      addResult('User Profile', 'info', 'Testing authenticated user profile endpoint...');
      try {
        await ApiService.getUserProfile();
        addResult('User Profile', 'success', 'User profile endpoint is working');
      } catch (error) {
        addResult('User Profile', 'error', `User profile endpoint failed: ${error.message}`);
      }
    }

    setTesting(false);
  }, [addResult]);

  useEffect(() => {
    // Auto-run test when component mounts
    runConnectivityTests();
  }, [runConnectivityTests]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Backend Connectivity Test
        </Typography>
        <Box>
          <Tooltip title="Rerun tests">
            <IconButton 
              onClick={runConnectivityTests}
              disabled={testing}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Chip 
            label={connectionStatus === 'online' ? 'Online' : connectionStatus === 'offline' ? 'Offline' : 'Unknown'}
            color={connectionStatus === 'online' ? 'success' : connectionStatus === 'offline' ? 'error' : 'default'}
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>
      
      {testing && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography>Running connectivity tests...</Typography>
        </Box>
      )}

      {stats.total > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Chip 
            icon={<SuccessIcon fontSize="small" />} 
            label={`${stats.success} Passed`} 
            color="success"
            variant="outlined" 
          />
          <Chip 
            icon={<ErrorIcon fontSize="small" />} 
            label={`${stats.failed} Failed`} 
            color="error"
            variant="outlined" 
          />
        </Box>
      )}

      {connectionStatus === 'offline' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Cannot connect to backend server
          </Typography>
          <Typography variant="body2">
            Make sure the backend server is running on http://localhost:5454
          </Typography>
        </Alert>
      )}

      <List>
        {testResults.map((result, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                {result.status === 'success' && <SuccessIcon color="success" />}
                {result.status === 'error' && <ErrorIcon color="error" />}
                {result.status === 'info' && <InfoIcon color="info" />}
              </ListItemIcon>
              <ListItemText 
                primary={result.test} 
                secondary={result.message} 
              />
            </ListItem>
            {index < testResults.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {testResults.length === 0 && !testing && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No test results available. Click the refresh button to run tests.
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Note: These tests check connectivity to the backend server at http://localhost:5454.
        </Typography>
      </Box>
    </Paper>
  );
};

export default BackendConnectionTest;
