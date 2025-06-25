import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Tab,
  Tabs,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Link as LinkIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { imageUploadService } from '../../services/imageUpload';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imageHostingSuggestions = [
    {
      name: 'ImgBB',
      url: 'https://imgbb.com/',
      description: 'Free image hosting with direct links, no registration required',
      steps: ['Go to imgbb.com', 'Click "Start uploading"', 'Upload your image', 'Copy the "Direct link" URL']
    },
    {
      name: 'Imgur',
      url: 'https://imgur.com/',
      description: 'Popular free image hosting platform',
      steps: ['Go to imgur.com', 'Click "New post"', 'Upload your image', 'Right-click image and copy link']
    },
    {
      name: 'Postimages',
      url: 'https://postimages.org/',      description: 'Free image hosting without registration',
      steps: ['Go to postimages.org', 'Click "Choose Images"', 'Upload and get direct link']
    }
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check max images limit first
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      
      // Use the image upload service to upload to cloud
      const imageUrl = await imageUploadService.uploadImage(file);
      
      // Add the URL to the images array
      onImagesChange([...images, imageUrl]);
      
      // Show success message
      console.log('Image uploaded successfully:', imageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (!imageUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // Check max images limit
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    onImagesChange([...images, imageUrl]);
    setImageUrl('');
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          Product Images ({images.length}/{maxImages})
        </Typography>
        <Tooltip title="Get help with free image hosting">
          <IconButton size="small" onClick={() => setShowHelp(true)}>
            <HelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Image Upload Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<CloudUploadIcon />} label="Upload File" />
          <Tab icon={<LinkIcon />} label="Add URL" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload-button"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading || images.length >= maxImages}
              />
              <label htmlFor="image-upload-button">                <Button
                  variant="outlined"
                  component="span"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={uploading || images.length >= maxImages}
                  sx={{ mb: 1 }}
                >
                  {uploading ? 'Uploading to Cloud...' : 'Upload Image File'}
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary">
                Max 5MB, JPG/PNG/GIF supported. Auto-uploads to free cloud hosting.
              </Typography>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                    disabled={images.length >= maxImages}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleUrlAdd}
                    disabled={!imageUrl.trim() || images.length >= maxImages}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Alert severity="info" sx={{ mt: 1 }}>
                Use free hosting services like ImgBB or Imgur for image URLs
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Image Preview */}
      {images.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Added Images:
          </Typography>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper
                  sx={{
                    position: 'relative',
                    paddingBottom: '75%', // 4:3 aspect ratio
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.200',
                      flexDirection: 'column'
                    }}
                  >
                    <ImageIcon color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      Failed to load
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Help Dialog */}      <Dialog open={showHelp} onClose={() => setShowHelp(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Image Upload Help
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              Automatic Upload Available!
            </Typography>
            <Typography variant="body2">
              Use the "Upload Image File" tab to automatically upload your images to free cloud hosting. 
              No manual steps required!
            </Typography>
          </Alert>
          
          <Typography variant="body1" paragraph>
            If automatic upload doesn't work, you can manually upload to these free services:
          </Typography>
          
          <List>
            {imageHostingSuggestions.map((service, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <ImageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{service.name}</Typography>
                      <Button
                        size="small"
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Site
                      </Button>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" paragraph>
                        {service.description}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Steps:
                      </Typography>
                      <ol>
                        {service.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>
                            <Typography variant="body2">{step}</Typography>
                          </li>
                        ))}
                      </ol>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Pro Tip:</strong> Always copy the "Direct Link" or "Image URL" (not the page URL) 
              to ensure images display properly in your shop.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUpload;
