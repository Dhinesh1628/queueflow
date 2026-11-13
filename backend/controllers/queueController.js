const Queue = require('../models/Queue');
const Token = require('../models/Token');
const { getQueueStats } = require('../services/tokenService');

// @desc    Get all queues for logged-in manager with live stats
// @route   GET /api/queues
// @access  Private
const getQueues = async (req, res, next) => {
  try {
    const queues = await Queue.find({ managerId: req.user._id }).sort({ createdAt: -1 });

    // Attach real-time statistics to each queue
    const queuesWithStats = await Promise.all(
      queues.map(async (queue) => {
        const stats = await getQueueStats(queue._id, req.user._id);
        return {
          ...queue.toObject(),
          stats,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: queuesWithStats.length,
      data: queuesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single queue by ID with detailed stats
// @route   GET /api/queues/:id
// @access  Private
const getQueueById = async (req, res, next) => {
  try {
    const queue = await Queue.findOne({
      _id: req.params.id,
      managerId: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    const stats = await getQueueStats(queue._id, req.user._id);

    res.status(200).json({
      success: true,
      data: {
        ...queue.toObject(),
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new queue
// @route   POST /api/queues
// @access  Private
const createQueue = async (req, res, next) => {
  try {
    const { name, description, prefix } = req.body;

    const existingQueue = await Queue.findOne({
      managerId: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingQueue) {
      return res.status(409).json({
        success: false,
        message: `A queue with name "${name.trim()}" already exists. Please choose a different name.`,
      });
    }

    const cleanPrefix = (prefix || 'QF').trim().toUpperCase().slice(0, 5);

    const queue = await Queue.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      prefix: cleanPrefix || 'QF',
      managerId: req.user._id,
    });

    const stats = await getQueueStats(queue._id, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Queue created successfully',
      data: {
        ...queue.toObject(),
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update queue details
// @route   PUT /api/queues/:id
// @access  Private
const updateQueue = async (req, res, next) => {
  try {
    const { name, description, prefix } = req.body;

    const queue = await Queue.findOne({
      _id: req.params.id,
      managerId: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    if (name && name.trim() !== queue.name) {
      const existingQueue = await Queue.findOne({
        managerId: req.user._id,
        _id: { $ne: queue._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (existingQueue) {
        return res.status(409).json({
          success: false,
          message: `Another queue with name "${name.trim()}" already exists.`,
        });
      }
      queue.name = name.trim();
    }

    if (description !== undefined) {
      queue.description = description.trim();
    }

    if (prefix) {
      queue.prefix = prefix.trim().toUpperCase().slice(0, 5);
    }

    await queue.save();
    const stats = await getQueueStats(queue._id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Queue updated successfully',
      data: {
        ...queue.toObject(),
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete queue with cascade cleanup of tokens
// @route   DELETE /api/queues/:id
// @access  Private
const deleteQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findOne({
      _id: req.params.id,
      managerId: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found or unauthorized',
      });
    }

    // Cascade delete tokens associated with this queue
    const deletedTokens = await Token.deleteMany({ queueId: queue._id });
    await Queue.deleteOne({ _id: queue._id });

    res.status(200).json({
      success: true,
      message: `Queue "${queue.name}" and its ${deletedTokens.deletedCount} associated tokens were deleted successfully.`,
      deletedQueueId: queue._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get queue statistics
// @route   GET /api/queues/:id/stats
// @access  Private
const getQueueStatsController = async (req, res, next) => {
  try {
    const queue = await Queue.findOne({
      _id: req.params.id,
      managerId: req.user._id,
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found',
      });
    }

    const stats = await getQueueStats(queue._id, req.user._id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQueues,
  getQueueById,
  createQueue,
  updateQueue,
  deleteQueue,
  getQueueStatsController,
};
