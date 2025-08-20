import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import CreateProject from './pages/CreateProject';
import TaskManagement from './pages/TaskManagement';
import './styles/modern.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/create" 
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <TaskManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
