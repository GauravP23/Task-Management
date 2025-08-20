import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  useTheme,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateTaskModal from './CreateTaskModal';
import { tasksAPI } from '../utils/api';

// Priority colors - theme-aware
const getPriorityColor = (priority, theme) => {
  const colors = {
    urgent: theme.palette.error.main,
    high: '#ff7043', // Orange
    medium: '#ffa726', // Amber
    low: theme.palette.text.disabled,
    default: theme.palette.text.disabled
  };
  return colors[priority] || colors.default;
};

const getPriorityBgColor = (priority, theme) => {
  const colors = {
    urgent: theme.palette.mode === 'light' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.2)',
    high: theme.palette.mode === 'light' ? 'rgba(255, 112, 67, 0.1)' : 'rgba(255, 112, 67, 0.2)',
    medium: theme.palette.mode === 'light' ? 'rgba(255, 167, 38, 0.1)' : 'rgba(255, 167, 38, 0.2)',
    low: theme.palette.mode === 'light' ? 'rgba(158, 158, 158, 0.1)' : 'rgba(158, 158, 158, 0.2)',
    default: theme.palette.mode === 'light' ? 'rgba(158, 158, 158, 0.1)' : 'rgba(158, 158, 158, 0.2)'
  };
  return colors[priority] || colors.default;
};

// Task Card Component
const TaskCard = ({ task, onDelete, onEdit, isDragging = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task?._id || task?.id || 'unknown' });

  // Safety check for undefined task
  if (!task) {
    console.warn('⚠️ TaskCard received undefined task');
    return null;
  }

  const taskId = task._id || task.id;
  console.log('📝 TaskCard rendered:', { taskId, title: task.title, status: task.status });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    console.log('🗑️ Delete task clicked:', task._id || task.id);
    onDelete(task._id || task.id);
    handleMenuClose();
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    console.log('✏️ Edit task clicked:', task);
    onEdit(task);
    handleMenuClose();
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        mb: 2,
        cursor: 'grab',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
        ...(isDragging && {
          opacity: 0.7,
          transform: 'rotate(3deg) scale(1.02)',
          boxShadow: '0 20px 32px -4px hsla(220, 25%, 10%, 0.12), 0 12px 20px -4px hsla(220, 25%, 10%, 0.08)',
        }),
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              bgcolor: getPriorityBgColor(task.priority, theme),
              color: getPriorityColor(task.priority, theme),
              border: `1px solid ${getPriorityColor(task.priority, theme)}20`,
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              '&:hover': {
                bgcolor: getPriorityColor(task.priority, theme),
                color: 'white',
              },
            }}
          />
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {task.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>
          {task.description}
        </Typography>

        {task.progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
            {/* Handle both API data (assignedTo) and mock data (assignees) */}
            {task.assignedTo ? (
              <Avatar
                sx={{ bgcolor: '#6366f1', width: 24, height: 24 }}
              >
                {task.assignedTo.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            ) : task.assignees?.map((assignee) => (
              <Avatar
                key={assignee.id}
                sx={{ bgcolor: assignee.color, width: 24, height: 24 }}
              >
                {assignee.avatar}
              </Avatar>
            ))}
          </AvatarGroup>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Handle comments - can be array or number */}
            {((Array.isArray(task.comments) && task.comments.length > 0) || 
              (typeof task.comments === 'number' && task.comments > 0)) && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CommentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {Array.isArray(task.comments) ? task.comments.length : task.comments}
                </Typography>
              </Box>
            )}
            {/* Handle attachments - can be array or number */}
            {((Array.isArray(task.attachments) && task.attachments.length > 0) || 
              (typeof task.attachments === 'number' && task.attachments > 0)) && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <AttachmentIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {Array.isArray(task.attachments) ? task.attachments.length : task.attachments}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={0.5}>
              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

// Kanban Column Component
const KanbanColumn = ({ columnId, title, tasks, color, bgColor, borderColor, onAddTask, onDeleteTask, onEditTask }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
  });

  const handleAddTask = (taskData) => {
    onAddTask(columnId, taskData);
    setShowCreateModal(false);
  };

  return (
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        p: 2,
        height: 'fit-content',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: borderColor,
          boxShadow: 1,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              boxShadow: `0 2px 4px hsla(${color.match(/hsl\((\d+),/)?.[1] || '215'}, 20%, 30%, 0.3)`,
            }}
          />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              bgcolor: bgColor,
              color: color,
              border: `1px solid ${borderColor}`,
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: borderColor,
              },
            }}
          />
        </Box>
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => setShowCreateModal(true)}
        sx={{
          mb: 2,
          borderStyle: 'dashed',
          color: 'text.secondary',
          borderColor: 'grey.300',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          },
        }}
      >
        Add New Task
      </Button>

      <SortableContext items={tasks.filter(task => task != null).map(task => task._id || task.id)} strategy={verticalListSortingStrategy}>
        <Box
          ref={setNodeRef}
          id={`column-${columnId}`}
          sx={{
            minHeight: 200,
            p: 1,
            borderRadius: 2,
            bgcolor: isOver ? 'action.hover' : 'transparent',
            border: isOver ? 2 : 1,
            borderColor: isOver ? 'primary.main' : 'transparent',
            borderStyle: 'dashed',
            transition: 'all 0.2s ease',
          }}
        >
          {tasks.filter(task => task != null).map((task) => (
            <TaskCard key={task._id || task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
          ))}
          {tasks.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Drop tasks here
            </Box>
          )}
        </Box>
      </SortableContext>

      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleAddTask}
        columnId={columnId}
      />
    </Box>
  );
};

// Main Kanban Board Component
const KanbanBoard = ({ projectId, boardId }) => {
  const theme = useTheme();
  const [activeId, setActiveId] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], 'in-progress': [], review: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editTask, setEditTask] = useState(null);
  const [editColumnId, setEditColumnId] = useState(null);

  // Fetch tasks when component mounts or projectId changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        let tasksData = [];
        
        try {
          // Try to fetch from API first
          const response = await tasksAPI.getByProject(projectId);
          tasksData = response.data || [];
        } catch (apiError) {
          // If API fails, use mock data for development
          console.warn('Tasks API fetch failed, using mock data:', apiError.message);
          tasksData = [
            {
              id: 'task-1',
              _id: 'task-1',
              title: 'Design Homepage Layout',
              description: 'Create wireframes and mockups for the new homepage design',
              priority: 'high',
              status: 'todo',
              dueDate: new Date(2025, 7, 25).toISOString(),
              createdAt: new Date().toISOString(),
              project: projectId,
              assignees: [{ id: 1, name: 'John Doe', avatar: 'JD', color: '#FF6B6B' }],
              comments: 2,
              attachments: 1,
              progress: 25
            },
            {
              id: 'task-2',
              _id: 'task-2',
              title: 'Implement User Authentication',
              description: 'Set up login and registration functionality',
              priority: 'medium',
              status: 'in-progress',
              dueDate: new Date(2025, 7, 23).toISOString(),
              createdAt: new Date().toISOString(),
              project: projectId,
              assignees: [{ id: 2, name: 'Jane Smith', avatar: 'JS', color: '#4ECDC4' }],
              comments: 1,
              attachments: 0,
              progress: 60
            },
            {
              id: 'task-3',
              _id: 'task-3',
              title: 'Code Review',
              description: 'Review pull requests and provide feedback',
              priority: 'medium',
              status: 'review',
              dueDate: new Date(2025, 7, 22).toISOString(),
              createdAt: new Date().toISOString(),
              project: projectId,
              assignees: [{ id: 3, name: 'Bob Johnson', avatar: 'BJ', color: '#45B7D1' }],
              comments: 0,
              attachments: 2,
              progress: 90
            },
            {
              id: 'task-4',
              _id: 'task-4',
              title: 'Deploy to Production',
              description: 'Deploy the latest changes to production server',
              priority: 'urgent',
              status: 'completed',
              dueDate: new Date(2025, 7, 21).toISOString(),
              createdAt: new Date().toISOString(),
              project: projectId,
              assignees: [{ id: 4, name: 'Alice Brown', avatar: 'AB', color: '#96CEB4' }],
              comments: 3,
              attachments: 0,
              progress: 100
            }
          ];
        }
        
        // Group tasks by status
        const groupedTasks = {
          todo: tasksData.filter(task => task.status === 'todo'),
          'in-progress': tasksData.filter(task => task.status === 'in-progress'),
          review: tasksData.filter(task => task.status === 'review'),
          done: tasksData.filter(task => task.status === 'completed' || task.status === 'done'),
        };
        
        console.log('KanbanBoard - Loaded tasks:', groupedTasks);
        setTasks(groupedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load tasks',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getColumnColors = (theme) => ({
    todo: {
      color: theme.palette.text.secondary,
      bgColor: theme.palette.mode === 'light' ? 'rgba(158, 158, 158, 0.1)' : 'rgba(158, 158, 158, 0.2)',
      borderColor: theme.palette.mode === 'light' ? 'rgba(158, 158, 158, 0.3)' : 'rgba(158, 158, 158, 0.4)'
    },
    'in-progress': {
      color: theme.palette.primary.main,
      bgColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.2)',
      borderColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.4)'
    },
    review: {
      color: '#ffa726',
      bgColor: theme.palette.mode === 'light' ? 'rgba(255, 167, 38, 0.1)' : 'rgba(255, 167, 38, 0.2)',
      borderColor: theme.palette.mode === 'light' ? 'rgba(255, 167, 38, 0.3)' : 'rgba(255, 167, 38, 0.4)'
    },
    done: {
      color: theme.palette.success.main,
      bgColor: theme.palette.mode === 'light' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(46, 125, 50, 0.2)',
      borderColor: theme.palette.mode === 'light' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(46, 125, 50, 0.4)'
    }
  });

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      tasks: tasks.todo || [], 
      ...getColumnColors(theme).todo
    },
    { 
      id: 'in-progress', 
      title: 'In Progress', 
      tasks: tasks['in-progress'] || [], 
      ...getColumnColors(theme)['in-progress']
    },
    { 
      id: 'review', 
      title: 'Need Review', 
      tasks: tasks.review || [], 
      ...getColumnColors(theme).review
    },
    { 
      id: 'done', 
      title: 'Done', 
      tasks: tasks.done || [], 
      ...getColumnColors(theme).done
    },
  ];

  const findContainer = (id) => {
    if (tasks.todo?.find(task => task._id === id || task.id === id)) return 'todo';
    if (tasks['in-progress']?.find(task => task._id === id || task.id === id)) return 'in-progress';
    if (tasks.review?.find(task => task._id === id || task.id === id)) return 'review';
    if (tasks.done?.find(task => task._id === id || task.id === id)) return 'done';
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    console.log('🎯 Drag ended:', { active: event.active?.id, over: event.over?.id });
    
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) {
      console.log('❌ No drop target found');
      return;
    }

    const sourceContainer = findContainer(active.id);
    let destinationContainer = over.id;
    
    console.log('🔍 Initial containers:', { sourceContainer, destinationContainer });
    
    // If dropped on a column container
    if (over.id.startsWith('column-')) {
      destinationContainer = over.id.replace('column-', '');
      console.log('📦 Dropped on column, updated destination:', destinationContainer);
    }
    // If dropped on a task, get the container of that task
    else if (!columns.find(col => col.id === over.id)) {
      destinationContainer = findContainer(over.id);
      console.log('🎯 Dropped on task, found container:', destinationContainer);
    }
    
    if (!sourceContainer || !destinationContainer || sourceContainer === destinationContainer) {
      console.log('❌ Invalid move or same container:', { sourceContainer, destinationContainer });
      return;
    }

    const taskIndex = tasks[sourceContainer]?.findIndex(task => (task._id || task.id) === active.id);
    if (taskIndex === -1) {
      console.log('❌ Task not found in source container');
      return;
    }

    const task = tasks[sourceContainer][taskIndex];
    console.log('📋 Moving task:', { task: task.title, from: sourceContainer, to: destinationContainer });
    
    // Map status to API format
    const statusMap = {
      'todo': 'todo',
      'in-progress': 'in-progress',
      'review': 'review',
      'done': 'completed'
    };
    
    const newStatus = statusMap[destinationContainer] || destinationContainer;
    
    // Update UI optimistically
    setTasks(prevTasks => {
      const sourceItems = [...(prevTasks[sourceContainer] || [])];
      const destItems = [...(prevTasks[destinationContainer] || [])];
      
      // Remove from source
      sourceItems.splice(taskIndex, 1);
      
      // Add to destination with updated status
      const updatedTask = { ...task, status: newStatus };
      destItems.push(updatedTask);

      const newTasks = {
        ...prevTasks,
        [sourceContainer]: sourceItems,
        [destinationContainer]: destItems,
      };
      
      console.log('✅ UI updated optimistically:', newTasks);
      return newTasks;
    });

    // Show immediate success feedback
    const targetColumnTitle = columns.find(col => col.id === destinationContainer)?.title || destinationContainer;
    setSnackbar({
      open: true,
      message: `Task moved to ${targetColumnTitle}`,
      severity: 'success',
    });

    try {
      // Try to update status via API in background
      await tasksAPI.updateStatus(active.id, newStatus);
      console.log('✅ Task status updated via API');
    } catch (error) {
      console.warn('⚠️ API update failed, but UI already updated:', error.message);
      // Don't revert or show error since the move was successful locally
      // This allows for offline functionality
    }
  };

  const handleAddTask = async (columnId, taskData) => {
    console.log('🚀 Creating task:', { columnId, taskData });
    
    try {
      // Map column status to API format
      const statusMap = {
        'todo': 'todo',
        'in-progress': 'in-progress',
        'review': 'review',
        'done': 'completed'
      };

      const newTaskData = {
        ...taskData,
        project: projectId,
        status: statusMap[columnId] || columnId,
        id: taskData.id || `task-${Date.now()}`,
        _id: taskData._id || taskData.id || `task-${Date.now()}`,
        // Convert assignees array to single assignedTo for API compatibility
        assignedTo: taskData.assignees && taskData.assignees.length > 0 ? taskData.assignees[0].id : null,
      };

      // Remove assignees from API data since backend uses assignedTo
      delete newTaskData.assignees;

      console.log('📤 Sending task data:', newTaskData);

      let createdTask = newTaskData;

      try {
        // Try to create via API
        const response = await tasksAPI.create(newTaskData);
        createdTask = response.data;
        console.log('✅ Task created via API:', createdTask);
      } catch (apiError) {
        // If API fails, use the local task data
        console.warn('❌ API creation failed, using local data:', apiError.message);
        createdTask = {
          ...newTaskData,
          createdAt: new Date().toISOString(),
          // Convert back assignedTo to assignees for frontend compatibility
          assignees: taskData.assignees || [],
          assignedTo: newTaskData.assignedTo,
          comments: 0,
          attachments: 0,
          progress: 0
        };
      }

      // Add to local state
      setTasks(prevTasks => {
        const newTasks = {
          ...prevTasks,
          [columnId]: [...(prevTasks[columnId] || []), createdTask],
        };
        console.log('📋 Updated local tasks:', newTasks);
        return newTasks;
      });

      setSnackbar({
        open: true,
        message: 'Task created successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('❌ Error creating task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create task',
        severity: 'error',
      });
    }
  };

  const handleEditTask = (task) => {
    const column = findContainer(task._id || task.id);
    setEditTask(task);
    setEditColumnId(column);
  };

  const handleUpdateTask = async (updatedTask) => {
    console.log('🔄 Updating task:', updatedTask);
    
    try {
      // Prepare task data for API
      const apiTask = { ...updatedTask };
      if (apiTask.status === 'done') apiTask.status = 'completed';
      
      // Convert assignees to assignedTo for API compatibility
      if (apiTask.assignees && apiTask.assignees.length > 0) {
        apiTask.assignedTo = apiTask.assignees[0].id;
      }
      delete apiTask.assignees;
      
      // Update local state immediately
      setTasks(prev => {
        const newState = { ...prev };
        // Remove from all columns first
        Object.keys(newState).forEach(col => {
          newState[col] = newState[col].filter(t => 
            (t._id || t.id) !== (updatedTask._id || updatedTask.id)
          );
        });
        
        // Add to appropriate column
        const columnStatusMap = { 
          'todo': 'todo', 
          'in-progress': 'in-progress', 
          'review': 'review', 
          'completed': 'done', 
          'done': 'done' 
        };
        const targetColumn = columnStatusMap[updatedTask.status] || updatedTask.status;
        newState[targetColumn] = [...(newState[targetColumn] || []), { ...updatedTask }];
        
        console.log('📋 Updated tasks after edit:', newState);
        return newState;
      });

      try {
        // Try to update via API
        await tasksAPI.update(updatedTask._id || updatedTask.id, apiTask);
        console.log('✅ Task updated via API');
      } catch (apiError) {
        console.warn('⚠️ API update failed, but local update successful:', apiError.message);
      }

      setSnackbar({ 
        open: true, 
        message: 'Task updated successfully', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('❌ Error updating task:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update task', 
        severity: 'error' 
      });
    } finally {
      setEditTask(null);
      setEditColumnId(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    console.log('🗑️ Deleting task:', taskToDelete);
    
    try {
      const container = findContainer(taskToDelete);
      if (!container) {
        console.error('❌ Task container not found for:', taskToDelete);
        setSnackbar({
          open: true,
          message: 'Task not found',
          severity: 'error',
        });
        return;
      }

      // Remove from local state immediately for better UX
      setTasks(prevTasks => {
        const newTasks = {
          ...prevTasks,
          [container]: prevTasks[container].filter(task => 
            (task._id !== taskToDelete) && (task.id !== taskToDelete)
          ),
        };
        console.log('📋 Updated tasks after deletion:', newTasks);
        return newTasks;
      });

      try {
        // Try to delete via API
        await tasksAPI.delete(taskToDelete);
        console.log('✅ Task deleted via API');
      } catch (apiError) {
        // If API fails, still keep the local deletion
        console.warn('❌ API deletion failed, but keeping local deletion:', apiError.message);
      }

      setSnackbar({
        open: true,
        message: 'Task deleted successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete task',
        severity: 'error',
      });
    } finally {
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 3,
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            overflowX: 'auto',
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks}
              color={column.color}
              bgColor={column.bgColor}
              borderColor={column.borderColor}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={
                Object.values(tasks)
                  .flat()
                  .find((task) => (task._id || task.id) === activeId)
              }
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <CreateTaskModal
        open={Boolean(editTask)}
        onClose={() => { setEditTask(null); setEditColumnId(null); }}
        onSubmit={handleUpdateTask}
        columnId={editColumnId}
        existingTask={editTask}
        isEdit={true}
      />
    </>
  );
};

export default KanbanBoard;
