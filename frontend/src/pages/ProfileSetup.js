import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeMode();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    timezone: '',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    darkModePreference: darkMode,
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: user.language || 'en',
        emailNotifications: user.emailNotifications ?? true,
        pushNotifications: user.pushNotifications ?? true,
        darkModePreference: darkMode,
      });
    }
  }, [user, darkMode]);

  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    const value = event.target.checked;
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'darkModePreference' && value !== darkMode) {
      toggleDarkMode();
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setAlert({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: user.language || 'en',
        emailNotifications: user.emailNotifications ?? true,
        pushNotifications: user.pushNotifications ?? true,
        darkModePreference: darkMode,
      });
    }
    setIsEditing(false);
  };

  const roles = [
    'Project Manager',
    'Developer',
    'Designer',
    'QA Engineer',
    'Product Owner',
    'Scrum Master',
    'Business Analyst',
    'Other'
  ];

  const departments = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {alert.open && (
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Personal Information
                </Typography>
                <Box>
                  {!isEditing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      variant="outlined"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={handleInputChange('name')}
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
                    onChange={handleInputChange('email')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={profileData.role}
                      onChange={handleInputChange('role')}
                      startAdornment={<WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={profileData.department}
                      onChange={handleInputChange('department')}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={handleInputChange('phone')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profileData.location}
                    onChange={handleInputChange('location')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    value={profileData.bio}
                    onChange={handleInputChange('bio')}
                    disabled={!isEditing}
                    multiline
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Preferences
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={profileData.language}
                      onChange={handleInputChange('language')}
                      startAdornment={<LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timezone"
                    value={profileData.timezone}
                    onChange={handleInputChange('timezone')}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.emailNotifications}
                          onChange={handleSwitchChange('emailNotifications')}
                          disabled={!isEditing}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.pushNotifications}
                          onChange={handleSwitchChange('pushNotifications')}
                          disabled={!isEditing}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.darkModePreference}
                          onChange={handleSwitchChange('darkModePreference')}
                        />
                      }
                      label="Dark Mode"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Photo and Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    margin: '0 auto',
                  }}
                  src={profileData.avatar}
                >
                  {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {profileData.name || 'Your Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileData.role || 'Role'} • {profileData.department || 'Department'}
              </Typography>
              
              {profileData.bio && (
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  "{profileData.bio}"
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                {profileData.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{profileData.email}</Typography>
                  </Box>
                )}
                {profileData.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{profileData.phone}</Typography>
                  </Box>
                )}
                {profileData.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{profileData.location}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Projects</Typography>
                  <Chip label="5" size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Tasks Completed</Typography>
                  <Chip label="23" size="small" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">In Progress</Typography>
                  <Chip label="8" size="small" color="warning" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileSetup;
