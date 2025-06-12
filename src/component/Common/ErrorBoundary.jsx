import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorBoundary = ({ 
  error, 
  onRetry, 
  message = 'Something went wrong. Please try again.',
  showRetry = true 
}) => {
  return (
    <Box sx={{ py: 4 }}>
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          showRetry && onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        {message}
      </Alert>
      {error && process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <pre style={{ fontSize: '12px', margin: 0 }}>
            {error.toString()}
          </pre>
        </Alert>
      )}
    </Box>
  );
};

export default ErrorBoundary;
