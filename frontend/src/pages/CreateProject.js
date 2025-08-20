import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Alert,
  LinearProgress,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Flag as FlagIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../utils/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    startDate: new Date(),
    endDate: null,
    budget: '',
    status: 'planning',
    tags: [],
    members: [],
    goals: [''],
    requirements: [''],
    avatar: '',
  });

  const categories = [
    'Web Development',
    'Mobile App',
    'Desktop Software',
    'Data Analysis',
    'Machine Learning',
    'Marketing Campaign',
    'Research & Development',
    'Infrastructure',
    'Design',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'urgent', label: 'Urgent', color: 'error' }
  ];

  const projectStatuses = [
    'planning',
    'active',
    'on-hold',
    'completed',
    'cancelled'
  ];

  const availableMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Project Manager' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'QA Engineer' },
  ];

  const steps = [
    {
      label: 'Basic Information',
      description: 'Project name, description, and category',
    },
    {
      label: 'Timeline & Priority',
      description: 'Set dates, priority, and budget',
    },
    {
      label: 'Team & Goals',
      description: 'Add team members and project goals',
    },
    {
      label: 'Review & Create',
      description: 'Review all details and create project',
    },
  ];

  const handleInputChange = (field) => (event) => {
    setProjectData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (field) => (date) => {
    setProjectData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleArrayInputChange = (field, index) => (event) => {
    const newArray = [...projectData[field]];
    newArray[index] = event.target.value;
    setProjectData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setProjectData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setProjectData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await projectsAPI.create(projectData);
      setAlert({
        open: true,
        message: 'Project created successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to create project. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter a descriptive project name"
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={projectData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                placeholder="Describe what this project aims to achieve..."
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={projectData.category}
                  onChange={handleInputChange('category')}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                placeholder="frontend, react, ui/ux"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setProjectData(prev => ({ ...prev, tags }));
                }}
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {projectData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    onDelete={() => {
                      setProjectData(prev => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index)
                      }));
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={projectData.startDate}
                  onChange={handleDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={projectData.endDate}
                  onChange={handleDateChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={projectData.startDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={projectData.priority}
                    onChange={handleInputChange('priority')}
                    startAdornment={<FlagIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={priority.label} 
                            color={priority.color} 
                            size="small" 
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget (Optional)"
                  value={projectData.budget}
                  onChange={handleInputChange('budget')}
                  placeholder="$10,000"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Initial Status</InputLabel>
                  <Select
                    value={projectData.status}
                    onChange={handleInputChange('status')}
                  >
                    {projectStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Team Members
              </Typography>
              <Autocomplete
                multiple
                options={availableMembers}
                getOptionLabel={(option) => `${option.name} (${option.role})`}
                value={projectData.members}
                onChange={(event, newValue) => {
                  setProjectData(prev => ({ ...prev, members: newValue }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                      avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{option.name.charAt(0)}</Avatar>}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select team members"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Project Goals
              </Typography>
              {projectData.goals.map((goal, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Goal ${index + 1}`}
                    value={goal}
                    onChange={handleArrayInputChange('goals', index)}
                    placeholder="Define a specific project goal"
                  />
                  <IconButton
                    onClick={() => removeArrayItem('goals', index)}
                    disabled={projectData.goals.length === 1}
                    color="error"
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('goals')}
                variant="outlined"
                size="small"
              >
                Add Goal
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              {projectData.requirements.map((requirement, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Requirement ${index + 1}`}
                    value={requirement}
                    onChange={handleArrayInputChange('requirements', index)}
                    placeholder="Specify project requirements"
                  />
                  <IconButton
                    onClick={() => removeArrayItem('requirements', index)}
                    disabled={projectData.requirements.length === 1}
                    color="error"
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addArrayItem('requirements')}
                variant="outlined"
                size="small"
              >
                Add Requirement
              </Button>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Project Summary
              </Typography>
              <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Project Name</Typography>
                    <Typography variant="body1" fontWeight={500}>{projectData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{projectData.category}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{projectData.description}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                    <Chip 
                      label={projectData.priority} 
                      color={priorities.find(p => p.value === projectData.priority)?.color} 
                      size="small" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Timeline</Typography>
                    <Typography variant="body1">
                      {projectData.startDate?.toLocaleDateString()} - {projectData.endDate?.toLocaleDateString() || 'Ongoing'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Team Members</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {projectData.members.map((member) => (
                        <Chip
                          key={member.id}
                          label={member.name}
                          avatar={<Avatar>{member.name.charAt(0)}</Avatar>}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return projectData.name.trim() !== '';
      case 1:
        return projectData.startDate !== null;
      case 2:
        return projectData.goals.some(goal => goal.trim() !== '');
      case 3:
        return true;
      default:
        return false;
    }
  };

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
          Create New Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Follow the steps below to set up your new project
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {steps[activeStep].label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {steps[activeStep].description}
              </Typography>

              {renderStepContent(activeStep)}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={!isStepValid(activeStep) || loading}
                      startIcon={<CheckIcon />}
                    >
                      Create Project
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!isStepValid(activeStep)}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateProject;
