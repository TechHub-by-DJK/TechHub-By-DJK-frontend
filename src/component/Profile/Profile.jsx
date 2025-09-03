import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import uploadService from '../../services/upload';

const Profile = () => {
  const { user, updateUser } = useAuth();  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: {
      streetAddress: '',
      city: '',
      district: '',
      province: '',
      postalCode: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);  const loadUserProfile = async () => {
    try {
  const userData = await apiService.getUserProfile(); // Backend returns User object directly
      setProfileData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phoneNumber: '', // Backend User model doesn't have phoneNumber field
        address: userData.addresses && userData.addresses[0] ? {
          streetAddress: userData.addresses[0].streetAddress || '',
          city: userData.addresses[0].city || '',
          district: userData.addresses[0].district || '',
          province: userData.addresses[0].province || '',
          postalCode: userData.addresses[0].postalCode || ''
        } : {
          streetAddress: '',
          city: '',
          district: '',
          province: '',
          postalCode: ''
        }
      });
      // set avatarUrl if backend contains an avatar field
      if (userData.avatarUrl || userData.profileImageUrl || userData.imageUrl) {
        setAvatarUrl(userData.avatarUrl || userData.profileImageUrl || userData.imageUrl);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    }
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      setAvatarUploading(true);
      setAvatarProgress(0);
      const token = localStorage.getItem('jwt') || '';
      const url = await uploadService.uploadImage(file, 'profile', token, setAvatarProgress);
      setAvatarUrl(url);
  // Refresh user from backend (PUT not supported on /api/users/profile)
  const fresh = await apiService.getUserProfile();
  updateUser(fresh);
  setSuccess('Profile photo updated');
    } catch (err) {
      setError(err.message || 'Failed to upload profile image');
    } finally {
      setAvatarUploading(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    // Backend does not support updating user profile details yet
    setError(null);
    setSuccess('Profile editing is not supported by the server yet.');
    setIsEditing(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile(); // Reload original data
    setError(null);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <AdminIcon color="error" />;
      case 'shop_owner':
      case 'shopowner':
        return <StoreIcon color="info" />;
      default:
        return <PersonIcon color="primary" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'shop_owner':
      case 'shopowner':
        return 'Shop Owner';
      case 'role_customer':
      case 'customer':
        return 'Customer';
      default:
        // For debugging - show the actual role value
        return role ? `${role}` : 'Customer';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
              src={avatarUrl || undefined}
            >
              {!avatarUrl && (user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U')}
            </Avatar>
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" size="small" component="label" disabled={avatarUploading}>
                {avatarUploading ? `Uploading ${avatarProgress}%` : 'Change Photo'}
                <input type="file" accept="image/png,image/jpeg" hidden onChange={handleAvatarFile} />
              </Button>
            </Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {profileData.fullName || 'User Name'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              {getRoleIcon(user?.role)}
              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                {getRoleLabel(user?.role)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {profileData.email}
            </Typography>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>            <List>
              <ListItem 
                button
                onClick={() => setPasswordDialogOpen(true)}
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notification Settings" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Language Preferences" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Profile Information
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
              </Grid>
                <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Address Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={profileData.address.streetAddress}
                  onChange={(e) => handleInputChange('address.streetAddress', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={profileData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={profileData.address.district}
                  onChange={(e) => handleInputChange('address.district', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Province"
                  value={profileData.address.province}
                  onChange={(e) => handleInputChange('address.province', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={profileData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Notification Preferences */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Notification Preferences
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.orderUpdates}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      orderUpdates: e.target.checked
                    }))}
                  />
                }
                label="Order Updates"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.promotions}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      promotions: e.target.checked
                    }))}
                  />
                }
                label="Promotional Offers"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.newsletter}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      newsletter: e.target.checked
                    }))}
                  />
                }
                label="Newsletter"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              currentPassword: e.target.value
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              newPassword: e.target.value
            }))}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordChange}
            variant="contained"
            disabled={saving}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
