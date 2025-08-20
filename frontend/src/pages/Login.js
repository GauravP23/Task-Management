import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  TaskAlt,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect away if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double submit

    const email = formData.email.trim();
    const password = formData.password.trim();
    if (!email || !password || (isRegister && !name.trim())) return;

    let result;
    if (isRegister) {
      result = await register({
        name: name.trim(),
        email,
        password,
      });
    } else {
      result = await login({ email, password });
    }

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          className="card-glassmorphism"
          sx={{
            backdropFilter: 'blur(20px)',
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mb: 2,
                  boxShadow: 2,
                }}
              >
                <TaskAlt sx={{ fontSize: 32, color: 'primary.contrastText' }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                TaskFlow
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {isRegister
                  ? 'Create your account to get started'
                  : 'Welcome back! Sign in to your account'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {isRegister && (
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  className="text-field-modern"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-field-modern"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="text-field-modern"
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'primary.main' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !formData.email || !formData.password || (isRegister && !name)}
                className="button-primary-modern"
                sx={{
                  py: 1.5,
                  mb: 3,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.3)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 12px 40px hsla(243, 82%, 67%, 0.4)',
                  },
                }}
              >
                {loading
                  ? 'Processing...'
                  : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3, borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="text"
                onClick={() => setIsRegister(!isRegister)}
                sx={{
                  py: 1.5,
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </Box>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
};

export default Login;
