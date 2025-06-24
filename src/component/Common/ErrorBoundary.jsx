import React, { Component } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Typography, 
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails 
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Function component for simpler error display cases
export const ErrorMessage = ({ 
  error, 
  onRetry, 
  message = 'Something went wrong. Please try again.',
  showRetry = true 
}) => {
  return (
    <Box sx={{ py: 2 }}>
      <Alert 
        severity="error" 
        variant="outlined"
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
          <pre style={{ fontSize: '12px', margin: 0, overflowX: 'auto' }}>
            {error.toString()}
          </pre>
        </Alert>
      )}
    </Box>
  );
};

// Class component for React Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // You can also log the error to an error reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // If provided, call the onReset prop function
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetErrorBoundary: this.handleReset
        });
      }
      
      // Default error UI
      return (
        <Paper elevation={3} sx={{ p: 3, m: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorIcon color="error" sx={{ fontSize: 30, mr: 1 }} />
            <Typography variant="h5" color="error">
              {this.props.title || 'Something went wrong'}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {this.props.message || 'The application encountered an unexpected error.'}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={this.handleReset}
          >
            {this.props.resetButtonText || 'Try Again'}
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color="text.secondary">Technical Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" color="error.main" gutterBottom>
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 1, bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
