import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  AvatarGroup,
  Typography,
  IconButton,
  Autocomplete,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const priorityOptions = [
  { value: 'low', label: 'Low', color: '#4ECDC4' },
  { value: 'medium', label: 'Medium', color: '#FFE66D' },
  { value: 'high', label: 'High', color: '#FF6B6B' },
  { value: 'urgent', label: 'Urgent', color: '#FF4757' },
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const stageOptions = [
  'UX Design',
  'Development',
  'Testing',
  'Design',
  'Branding',
  'Marketing',
  'Research',
];

const teamMembers = [
  { id: 1, name: 'Karen Smith', avatar: 'KS', color: '#FF6B6B' },
  { id: 2, name: 'Steve McConnell', avatar: 'SM', color: '#4ECDC4' },
  { id: 3, name: 'Sarah Green', avatar: 'SG', color: '#45B7D1' },
  { id: 4, name: 'Brad Smith', avatar: 'BS', color: '#96CEB4' },
  { id: 5, name: 'Alice Cornell', avatar: 'AC', color: '#FECA57' },
  { id: 6, name: 'Mike Johnson', avatar: 'MJ', color: '#FF9FF3' },
];

const CreateTaskModal = ({ open, onClose, onSubmit, columnId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: columnId || 'todo',
    stage: '',
    assignees: [],
    dueDate: '',
    tags: [],
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSubmit({
        ...formData,
        id: Date.now().toString(), // Generate temporary ID
        progress: 0,
        comments: 0,
        attachments: 0,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: columnId || 'todo',
      stage: '',
      assignees: [],
      dueDate: '',
      tags: [],
    });
    setNewTag('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Create New Task
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            label="Task Title"
            fullWidth
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter task title..."
            autoFocus
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the task..."
          />

          {/* Priority and Status Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon sx={{ color: option.color, fontSize: 16 }} />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Stage */}
          <Autocomplete
            options={stageOptions}
            value={formData.stage}
            onChange={(event, newValue) => handleInputChange('stage', newValue || '')}
            renderInput={(params) => (
              <TextField {...params} label="Stage" placeholder="Select or type stage..." />
            )}
            freeSolo
          />

          {/* Assignees */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Assign to
            </Typography>
            <Autocomplete
              multiple
              options={teamMembers}
              getOptionLabel={(option) => option.name}
              value={formData.assignees}
              onChange={(event, newValue) => handleInputChange('assignees', newValue)}
              renderTags={(value, getTagProps) => (
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                  {value.map((option, index) => (
                    <Avatar
                      key={option.id}
                      sx={{ bgcolor: option.color }}
                      title={option.name}
                      {...getTagProps({ index })}
                    >
                      {option.avatar}
                    </Avatar>
                  ))}
                </AvatarGroup>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select team members..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: option.color, width: 24, height: 24, fontSize: '0.7rem' }}>
                    {option.avatar}
                  </Avatar>
                  {option.name}
                </Box>
              )}
            />
          </Box>

          {/* Due Date */}
          <TextField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <CalendarIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />

          {/* Tags */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.title.trim()}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskModal;
