import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
} from '@mui/material';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectHeader from '../components/ProjectHeader';
import KanbanBoard from '../components/KanbanBoard';

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    name: 'Piper Enterprise',
    progress: 75,
    status: 'active',
    color: '#2196F3',
  });
  const [currentView, setCurrentView] = useState('board');

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'board':
        return <KanbanBoard />;
      case 'table':
        return (
          <Box sx={{ p: 3 }}>
            <div>Table view coming soon...</div>
          </Box>
        );
      case 'list':
        return (
          <Box sx={{ p: 3 }}>
            <div>List view coming soon...</div>
          </Box>
        );
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <ProjectSidebar 
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
      />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc' }}>
        <ProjectHeader 
          project={selectedProject}
          onViewChange={handleViewChange}
          currentView={currentView}
        />
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
