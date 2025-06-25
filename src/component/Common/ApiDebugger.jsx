import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { apiService } from '../../services/api';

const ApiDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const runApiTest = async (testName, apiCall) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      console.log(`Running API test: ${testName}`);
      const result = await apiCall();
      const endTime = Date.now();
      
      setResults(prev => [
        ...prev,
        {
          id: Date.now(),
          name: testName,
          status: 'success',
          data: result,
          duration: endTime - startTime,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (error) {
      const endTime = Date.now();
      console.error(`API test failed: ${testName}`, error);
      
      setResults(prev => [
        ...prev,
        {
          id: Date.now(),
          name: testName,
          status: 'error',
          error: error.message,
          duration: endTime - startTime,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const testCases = [
    {
      name: 'Get Shop by Owner',
      test: () => apiService.getShopByOwner()
    },
    {
      name: 'Get User Profile',
      test: () => apiService.getUserProfile()
    },
    {
      name: 'Get Categories',
      test: () => apiService.getShopCategories()
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        API Debugger
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This tool helps debug API connectivity issues. Check the console for detailed logs.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current API Configuration:
        </Typography>
        <Typography variant="body2">
          Base URL: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}
        </Typography>
        <Typography variant="body2">
          JWT Token: {localStorage.getItem('jwt') ? 'Present' : 'Missing'}
        </Typography>
        <Typography variant="body2">
          User Role: {localStorage.getItem('role') || 'Not set'}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {testCases.map((testCase, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => runApiTest(testCase.name, testCase.test)}
            disabled={loading}
          >
            Test {testCase.name}
          </Button>
        ))}
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearResults}
          disabled={results.length === 0}
        >
          Clear Results
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography>Running API test...</Typography>
        </Box>
      )}

      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Test Results ({results.length}):
          </Typography>
          
          {results.map((result) => (
            <Accordion key={result.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Chip
                    label={result.status}
                    color={result.status === 'success' ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="subtitle1">
                    {result.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    {result.timestamp} • {result.duration}ms
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {result.status === 'success' ? (
                  <Box>
                    <Typography variant="body2" color="success.main" gutterBottom>
                      ✓ API call successful
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </Paper>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" color="error.main" gutterBottom>
                      ✗ API call failed
                    </Typography>
                    <Alert severity="error">
                      {result.error}
                    </Alert>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ApiDebugger;
