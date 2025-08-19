import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { projectsAPI } from '../utils/api';

const CreateProjectDialog = ({ open, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    priority: 'medium',
    color: 'hsl(243, 82%, 67%)',
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'general',
    'development',
    'design',
    'marketing',
    'research',
    'documentation',
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'hsl(142, 68%, 55%)' },
    { value: 'medium', label: 'Medium', color: 'hsl(35, 100%, 65%)' },
    { value: 'high', label: 'High', color: 'hsl(0, 68%, 65%)' },
  ];

  const colors = [
    'hsl(243, 82%, 67%)', // Indigo
    'hsl(142, 68%, 55%)', // Green
    'hsl(0, 68%, 65%)',   // Red
    'hsl(35, 100%, 65%)', // Orange
    'hsl(200, 68%, 60%)', // Blue
    'hsl(280, 68%, 65%)', // Purple
    'hsl(178, 68%, 70%)', // Teal
    'hsl(50, 68%, 70%)',  // Yellow
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await projectsAPI.create(formData);
      onProjectCreated(response.data);
      onClose();
      setFormData({
        name: '',
        description: '',
        category: 'general',
        priority: 'medium',
        color: 'hsl(243, 82%, 67%)',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'hsl(243, 82%, 67%)', width: 32, height: 32 }}>
            <AddIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            Create New Project
          </Typography>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              required
              placeholder="Enter project name..."
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your project..."
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {category}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: priority.color,
                          }}
                        />
                        {priority.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: 'hsl(243, 82%, 35%)' }}>
                Project Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => handleChange('color', color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid white' : '1px solid hsl(243, 100%, 94%)',
                      boxShadow: formData.color === color ? `0 0 0 2px ${color}` : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            {/* Preview */}
            <Box sx={{ p: 2, bgcolor: 'hsl(243, 100%, 99%)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'hsl(243, 82%, 35%)' }}>
                Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: formData.color,
                  }}
                />
                <Typography variant="body1" fontWeight={500}>
                  {formData.name || 'Project Name'}
                </Typography>
                <Chip
                  label={formData.category}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    bgcolor: 'hsl(243, 100%, 97%)',
                    color: 'hsl(243, 82%, 67%)',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name.trim()}
            className="button-primary-modern"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectDialog;
