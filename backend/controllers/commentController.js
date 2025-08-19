const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all comments for a task
const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if task exists and user has access
    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, task } = req.body;

    if (!content || !task) {
      return res.status(400).json({ message: 'Content and task are required' });
    }

    // Check if task exists and user has access
    const taskDoc = await Task.findById(task).populate('project');
    if (!taskDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(taskDoc.project._id);
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => member.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = await Comment.create({
      content,
      task,
      author: req.user._id,
    });

    // Add comment to task
    await Task.findByIdAndUpdate(task, {
      $push: { comments: comment._id }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id).populate({
      path: 'task',
      populate: { path: 'project' }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only author can update comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only comment author can update comment' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content, edited: true },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'task',
      populate: { path: 'project' }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const project = await Project.findById(comment.task.project._id);
    
    // Only comment author, task creator, or project admin can delete
    const canDelete = comment.author.toString() === req.user._id.toString() ||
                     comment.task.createdBy.toString() === req.user._id.toString() ||
                     project.owner.toString() === req.user._id.toString() ||
                     project.members.some(member => 
                       member.user.toString() === req.user._id.toString() && member.role === 'admin'
                     );

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from task
    await Task.findByIdAndUpdate(comment.task._id, {
      $pull: { comments: comment._id }
    });

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
};
