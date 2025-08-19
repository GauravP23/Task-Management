const express = require('express');
const {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  updateTaskPosition,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/project/:projectId', auth, getTasksByProject);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, getTaskById);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', auth, updateTaskStatus);

// @route   PATCH /api/tasks/:id/position
// @desc    Update task position (for drag and drop)
// @access  Private
router.patch('/:id/position', auth, updateTaskPosition);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, deleteTask);

module.exports = router;
