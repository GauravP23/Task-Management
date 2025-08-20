import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as TaskIcon,
  Person as PersonIcon,
  TrendingUp as AnalyticsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      title: 'Create New Project',
      description: 'Start a new project with team collaboration',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
      path: '/projects/create',
      stats: 'Quick Setup',
    },
    {
      title: 'Manage Tasks',
      description: 'Organize and track your tasks efficiently',
      icon: <TaskIcon sx={{ fontSize: 40 }} />,
      color: 'secondary',
      path: '/tasks',
      stats: 'Kanban & Lists',
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile and preferences',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      path: '/profile',
      stats: 'Personalize',
    },
    {
      title: 'Analytics View',
      description: 'View project insights and performance',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      color: 'success',
      path: '/dashboard',
      stats: 'Data Driven',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        {quickActionItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                border: 1,
                borderColor: 'divider',
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: `${item.color}.light`,
                    color: `${item.color}.main`,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: 40 }}
                >
                  {item.description}
                </Typography>
                
                <Chip
                  label={item.stats}
                  size="small"
                  color={item.color}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="outlined"
                  color={item.color}
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                  fullWidth
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;
