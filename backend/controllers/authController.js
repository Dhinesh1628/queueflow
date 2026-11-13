const Manager = require('../models/Manager');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const generateToken = require('../utils/generateToken');

// @desc    Register a new queue manager
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingManager = await Manager.findOne({ email: email.toLowerCase() });
    if (existingManager) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const manager = await Manager.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(manager._id);

    res.status(201).json({
      success: true,
      message: 'Manager account registered successfully',
      token,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        createdAt: manager.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate manager & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const manager = await Manager.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!manager) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(manager._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        createdAt: manager.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current manager profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const manager = await Manager.findById(req.user._id);
    res.status(200).json({
      success: true,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        createdAt: manager.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update manager profile / password
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const manager = await Manager.findById(req.user._id).select('+password');

    if (name) {
      manager.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password',
        });
      }
      const isMatch = await manager.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match',
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }
      manager.password = newPassword;
    }

    await manager.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        createdAt: manager.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    GDPR Right to Erasure: Permanently delete account and all associated queues & tokens
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const managerId = req.user._id;

    const [deletedTokens, deletedQueues] = await Promise.all([
      Token.deleteMany({ managerId }),
      Queue.deleteMany({ managerId }),
      Manager.deleteOne({ _id: managerId }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Account and all associated tenant data were permanently deleted per GDPR Right to Erasure.',
      details: {
        queuesDeleted: deletedQueues.deletedCount,
        tokensDeleted: deletedTokens.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
};
