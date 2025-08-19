const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock tasks data
let tasks = [
  {
    id: '1',
    title: 'Wireframing',
    description: 'Create wireframes for the new product feature',
    project: '1',
    assignedTo: 'user1',
    createdBy: 'mock-user-id',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2025-08-25'),
    tags: ['UX', 'Design'],
    stage: 'UX design',
    progress: 0,
    position: 0,
    comments: [],
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Customer Journey Mapping',
    description: 'Map the customer journey and develop strategies',
    project: '1',
    assignedTo: 'user2',
    createdBy: 'mock-user-id',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2025-08-20'),
    tags: ['UX', 'Research'],
    stage: 'UX design',
    progress: 45,
    position: 0,
    comments: [],
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/project/:projectId', auth, (req, res) => {
  try {
    const projectTasks = tasks.filter(task => task.project === req.params.projectId);
    res.json(projectTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
      tags,
      stage
    } = req.body;

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [],
      stage: stage || '',
      progress: 0,
      position: tasks.filter(t => t.project === project && t.status === (status || 'todo')).length,
      comments: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate,
      tags,
      stage,
      progress
    } = req.body;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description || tasks[taskIndex].description,
      assignedTo: assignedTo !== undefined ? assignedTo : tasks[taskIndex].assignedTo,
      status: status || tasks[taskIndex].status,
      priority: priority || tasks[taskIndex].priority,
      dueDate: dueDate ? new Date(dueDate) : tasks[taskIndex].dueDate,
      tags: tags || tasks[taskIndex].tags,
      stage: stage || tasks[taskIndex].stage,
      progress: progress !== undefined ? progress : tasks[taskIndex].progress,
      updatedAt: new Date(),
    };

    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', auth, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { status } = req.body;
    tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date();

    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
