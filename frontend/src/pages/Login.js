import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isRegister) {
      result = await register({
        name,
        email: formData.email,
        password: formData.password,
      });
    } else {
      result = await login(formData);
    }

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
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
            backgroundColor: 'hsla(0, 0%, 100%, 0.95)',
            borderRadius: 3,
            border: '1px solid hsla(0, 0%, 100%, 0.2)',
            boxShadow: '0 32px 64px hsla(243, 82%, 67%, 0.12)',
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
                  background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
                  mb: 2,
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.3)',
                }}
              >
                <TaskAlt sx={{ fontSize: 32, color: 'hsl(0, 0%, 100%)' }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                TaskFlow
              </Typography>
              <Typography variant="body1" sx={{ color: 'hsl(243, 82%, 35%)' }}>
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
                        <AccountCircle sx={{ color: 'hsl(243, 82%, 67%)' }} />
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
                      <Email sx={{ color: 'hsl(243, 82%, 67%)' }} />
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
                      <Lock sx={{ color: 'hsl(243, 82%, 67%)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'hsl(243, 82%, 67%)' }}
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
                disabled={loading}
                className="button-primary-modern"
                sx={{
                  py: 1.5,
                  mb: 3,
                  background: 'linear-gradient(135deg, hsl(243, 82%, 67%) 0%, hsl(252, 82%, 67%) 100%)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 32px hsla(243, 82%, 67%, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, hsl(243, 82%, 57%) 0%, hsl(252, 82%, 57%) 100%)',
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

              <Divider sx={{ my: 3, borderColor: 'hsl(243, 100%, 94%)' }}>
                <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="text"
                onClick={() => setIsRegister(!isRegister)}
                sx={{
                  py: 1.5,
                  color: 'hsl(243, 82%, 67%)',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'hsl(243, 100%, 97%)',
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

        {/* Features */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'hsla(0, 0%, 100%, 0.8)', mb: 2 }}>
            Trusted by teams worldwide
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {['Project Management', 'Team Collaboration', 'Task Tracking'].map((feature) => (
              <Typography
                key={feature}
                variant="body2"
                sx={{ color: 'hsla(0, 0%, 100%, 0.7)' }}
              >
                {feature}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
