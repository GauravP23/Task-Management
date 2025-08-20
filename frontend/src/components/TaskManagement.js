import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as PriorityIcon,
  CalendarToday as DueDateIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TaskManagement = ({ selectedProject }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [filter, setFilter] = useState('all'); // 'all', 'assigned', 'created'
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });
  
  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await tasksAPI.getByProject(selectedProject._id || selectedProject.id);
      let filteredTasks = (response.data || []).filter(task => task != null);
      
      // Apply user-specific filters
      if (filter === 'assigned') {
        filteredTasks = filteredTasks.filter(task => 
          task.assignedTo?.some(assignee => assignee._id === user._id || assignee.id === user._id)
        );
      } else if (filter === 'created') {
        filteredTasks = filteredTasks.filter(task => 
          task.createdBy?._id === user._id || task.createdBy?.id === user._id
        );
      }
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, filter, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleMenuClick = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    setDialogMode('create');
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
    });
    setOpenDialog(true);
  };

  const handleEditTask = () => {
    setDialogMode('edit');
    setTaskForm({
      title: selectedTask.title || '',
      description: selectedTask.description || '',
      status: selectedTask.status || 'todo',
      priority: selectedTask.priority || 'medium',
      dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '',
      assignedTo: selectedTask.assignedTo?.[0]?._id || '',
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteTask = async () => {
    try {
      await tasksAPI.delete(selectedTask._id || selectedTask.id);
      fetchTasks();
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskSubmit = async () => {
    try {
      const taskData = {
        ...taskForm,
        projectId: selectedProject._id || selectedProject.id,
        assignedTo: taskForm.assignedTo ? [taskForm.assignedTo] : [],
      };

      if (dialogMode === 'create') {
        await tasksAPI.create(taskData);
      } else {
        await tasksAPI.update(selectedTask._id || selectedTask.id, taskData);
      }
      
      fetchTasks();
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await tasksAPI.updateStatus(task._id || task.id, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'hsl(142, 68%, 55%)',
      medium: 'hsl(35, 100%, 65%)',
      high: 'hsl(0, 68%, 65%)',
      urgent: 'hsl(0, 100%, 50%)',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'hsl(0, 68%, 65%)',
      'in-progress': 'hsl(200, 68%, 60%)',
      review: 'hsl(35, 100%, 65%)',
      done: 'hsl(142, 68%, 55%)',
    };
    return colors[status] || colors.todo;
  };

  const TaskCard = ({ task }) => {
    // Safety check for undefined task
    if (!task) {
      return null;
    }

    return (
      <Card className="card-modern" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'hsl(243, 82%, 25%)', mb: 1 }}>
                {task.title || 'Untitled Task'}
              </Typography>
              {task.description && (
                <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 55%)', mb: 2 }}>
                  {task.description}
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={(e) => handleMenuClick(e, task)}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={(task.status || 'todo').replace('-', ' ')}
              size="small"
              sx={{
                bgcolor: `${getStatusColor(task.status || 'todo')}20`,
                color: getStatusColor(task.status || 'todo'),
                textTransform: 'capitalize',
            }}
          />
          <Chip
            label={task.priority || 'medium'}
            size="small"
            icon={<PriorityIcon sx={{ fontSize: 14 }} />}
            sx={{
              bgcolor: `${getPriorityColor(task.priority || 'medium')}20`,
              color: getPriorityColor(task.priority || 'medium'),
              textTransform: 'capitalize',
            }}
          />
          {task.dueDate && (
            <Chip
              label={new Date(task.dueDate).toLocaleDateString()}
              size="small"
              icon={<DueDateIcon sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: 'hsl(243, 100%, 97%)',
                color: 'hsl(243, 82%, 67%)',
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {task.assignedTo && task.assignedTo.length > 0 && (
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: 'hsl(243, 82%, 67%)',
                  fontSize: '0.7rem',
                }}
              >
                {(task.assignedTo[0].name || task.assignedTo[0].email)?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={task.status === 'done'}
                onChange={(e) => handleStatusChange(task, e.target.checked ? 'done' : 'todo')}
                sx={{
                  color: 'hsl(243, 82%, 67%)',
                  '&.Mui-checked': {
                    color: 'hsl(142, 68%, 55%)',
                  },
                }}
              />
            }
            label=""
          />
        </Box>
      </CardContent>
    </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'hsl(243, 82%, 25%)' }}>
          My Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTask}
          className="button-primary-modern"
        >
          New Task
        </Button>
      </Box>

      {/* Filter Options */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="assigned">Assigned to Me</MenuItem>
            <MenuItem value="created">Created by Me</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task List */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {loading ? (
            <Typography>Loading tasks...</Typography>
          ) : tasks.length > 0 ? (
            tasks.filter(task => task != null).map((task) => (
              <TaskCard key={task._id || task.id} task={task} />
            ))
          ) : (
            <Card className="card-modern">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: 'hsl(243, 82%, 55%)' }}>
                  No tasks found
                </Typography>
                <Typography variant="body2" sx={{ color: 'hsl(243, 82%, 65%)', mt: 1 }}>
                  Create your first task to get started
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Task Summary */}
        <Grid item xs={12} md={4}>
          <Card className="card-modern">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'hsl(243, 82%, 25%)' }}>
                Task Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Total Tasks"
                    secondary={tasks.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Completed"
                    secondary={tasks.filter(t => t.status === 'done').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="In Progress"
                    secondary={tasks.filter(t => t.status === 'in-progress').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Overdue"
                    secondary={tasks.filter(t => 
                      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
                    ).length}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditTask}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={handleDeleteTask} sx={{ color: 'hsl(0, 68%, 65%)' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskForm.status}
                label="Status"
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                label="Priority"
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleTaskSubmit} variant="contained" className="button-primary-modern">
            {dialogMode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;
