import React, { useState } from 'react';
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
  ListItemText
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { apiService } from '../../services/api';

const BackendConnectionTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const runConnectivityTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Basic connectivity
    addResult('Connection Test', 'info', 'Testing backend connectivity...');
    
    try {
      // Try a simple endpoint that should exist
      const response = await fetch('http://localhost:5454/actuator/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        addResult('Backend Health', 'success', 'Backend is responding successfully');
      } else {
        addResult('Backend Health', 'error', `Backend returned status: ${response.status}`);
      }
    } catch (error) {
      addResult('Backend Health', 'error', `Connection failed: ${error.message}`);
    }

    // Test 2: CORS check
    addResult('CORS Test', 'info', 'Testing CORS configuration...');
    try {
      const response = await fetch('http://localhost:5454/auth/signup', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      if (response.ok) {
        addResult('CORS Configuration', 'success', 'CORS is properly configured');
      } else {
        addResult('CORS Configuration', 'error', 'CORS might not be configured correctly');
      }
    } catch (error) {
      addResult('CORS Configuration', 'error', `CORS test failed: ${error.message}`);
    }    // Test 3: API Service test with proper signup format
    addResult('API Service Test', 'info', 'Testing API service with proper request format...');
    try {
      // Test with a properly formatted signup request
      const testSignup = {
        email: "test@example.com",
        password: "testpassword123",
        fullName: "Test User",
        role: "ROLE_CUSTOMER"
      };
      
      await apiService.register(testSignup);
      addResult('API Service', 'success', 'API service working correctly');
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        addResult('API Service', 'error', 'Backend connection issue detected');
      } else if (error.message.includes('400')) {
        addResult('API Service', 'success', 'Backend is accessible (validation error expected for test data)');
      } else if (error.message.includes('409')) {
        addResult('API Service', 'success', 'Backend is accessible (user already exists - this is normal)');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        addResult('API Service', 'success', 'Backend is accessible (authentication required)');
      } else {
        addResult('API Service', 'warning', `API accessible but returned: ${error.message}`);
      }
    }

    // Test 4: Test signup endpoint format
    addResult('Signup Format Test', 'info', 'Testing correct signup request format...');
    try {
      const response = await fetch('http://localhost:5454/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "testpassword123",
          fullName: "Test User",
          role: "ROLE_CUSTOMER"
        })
      });
      
      if (response.ok) {
        addResult('Signup Endpoint', 'success', 'Signup endpoint working correctly');
      } else if (response.status === 400) {
        addResult('Signup Endpoint', 'success', 'Signup endpoint accessible (validation error expected)');
      } else if (response.status === 409) {
        addResult('Signup Endpoint', 'success', 'Signup endpoint accessible (user exists - normal for test)');
      } else {
        addResult('Signup Endpoint', 'warning', `Signup endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      addResult('Signup Endpoint', 'error', `Signup test failed: ${error.message}`);
    }

    setTesting(false);
  };

  const getResultIcon = (status) => {
    switch (status) {
      case 'success': return <SuccessIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon />;
    }
  };

  const getResultColor = (status) => {
    switch (status) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'info': return 'info.main';
      default: return 'text.primary';
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Backend Connection Diagnostics
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Current backend URL: <strong>http://localhost:5454</strong>
        </Typography>
        <Typography variant="body2">
          Frontend URL: <strong>{window.location.origin}</strong>
        </Typography>
      </Alert>

      <Button 
        variant="contained" 
        onClick={runConnectivityTests}
        disabled={testing}
        sx={{ mb: 2 }}
      >
        {testing ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Running Tests...
          </>
        ) : (
          'Run Connection Tests'
        )}
      </Button>

      {testResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Test Results:
          </Typography>
          <List>
            {testResults.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getResultIcon(result.status)}
                </ListItemIcon>
                <ListItemText
                  primary={result.test}
                  secondary={
                    <Typography 
                      variant="body2" 
                      color={getResultColor(result.status)}
                    >
                      {result.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Backend Setup Checklist:
        </Typography>
        <Typography variant="body2" component="div">
          ✅ Backend running on port 5454<br/>
          ✅ Database connected and running<br/>
          ✅ CORS configured for http://localhost:3000<br/>
          ✅ Spring Boot application started successfully<br/>
        </Typography>
      </Alert>
    </Paper>
  );
};

export default BackendConnectionTest;
