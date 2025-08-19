const express = require('express');
const {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/comments/task/:taskId
// @desc    Get all comments for a task
// @access  Private
router.get('/task/:taskId', auth, getCommentsByTask);

// @route   POST /api/comments
// @desc    Create new comment
// @access  Private
router.post('/', auth, createComment);

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put('/:id', auth, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', auth, deleteComment);

module.exports = router;
