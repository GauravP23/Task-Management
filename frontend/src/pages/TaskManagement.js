import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import TaskManagement from '../components/TaskManagement';
import { projectsAPI } from '../utils/api';

const TaskManagementPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        const projects = response.data || [];
        // Select the first project if available
        if (projects.length > 0) {
          setSelectedProject(projects[0]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedProject) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Task Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No projects found. Please create a project first.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Management - {selectedProject.name}
      </Typography>
      <TaskManagement selectedProject={selectedProject} />
    </Container>
  );
};

export default TaskManagementPage;
