const Token = require('../models/Token');
const Queue = require('../models/Queue');
const tokenService = require('../services/tokenService');

// @desc    Add a person to a queue (create new token)
// @route   POST /api/tokens
// @access  Private
const createToken = async (req, res, next) => {
  try {
    const { queueId, customerName, phoneNumber, notes } = req.body;

    if (!queueId) {
      return res.status(400).json({
        success: false,
        message: 'Queue ID is required to generate a token',
      });
    }

    const token = await tokenService.createToken({
      queueId,
      managerId: req.user._id,
      customerName,
      phoneNumber,
      notes,
    });

    res.status(201).json({
      success: true,
      message: `Token ${token.tokenNumber} created successfully`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tokens with filtering and search
// @route   GET /api/tokens
// @access  Private
const getTokens = async (req, res, next) => {
  try {
    const { queueId, status, search, page = 1, limit = 50 } = req.query;

    const filter = { managerId: req.user._id };

    if (queueId) {
      filter.queueId = queueId;
    }

    if (status && ['WAITING', 'SERVING', 'COMPLETED', 'CANCELLED'].includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { customerName: searchRegex },
        { tokenNumber: searchRegex },
        { phoneNumber: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting: WAITING tokens by position asc, others by updatedAt desc
    let sortObj = { createdAt: -1 };
    if (status === 'WAITING') {
      sortObj = { position: 1, createdAt: 1 };
    }

    const [tokens, total] = await Promise.all([
      Token.find(filter)
        .populate('queueId', 'name prefix')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Token.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: tokens.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single token by ID
// @route   GET /api/tokens/:id
// @access  Private
const getTokenById = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      _id: req.params.id,
      managerId: req.user._id,
    }).populate('queueId', 'name prefix');

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found',
      });
    }

    res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Call next waiting token in a queue
// @route   POST /api/tokens/call-next
// @access  Private
const callNext = async (req, res, next) => {
  try {
    const { queueId } = req.body;

    if (!queueId) {
      return res.status(400).json({
        success: false,
        message: 'queueId is required to call next customer',
      });
    }

    const token = await tokenService.callNextToken(queueId, req.user._id);

    res.status(200).json({
      success: true,
      message: `Now serving ${token.customerName} (${token.tokenNumber})`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete service for the currently serving token
// @route   POST /api/tokens/complete-service
// @access  Private
const completeService = async (req, res, next) => {
  try {
    const { queueId, tokenId } = req.body;

    if (!queueId) {
      return res.status(400).json({
        success: false,
        message: 'queueId is required',
      });
    }

    const token = await tokenService.completeService(
      queueId,
      req.user._id,
      tokenId
    );

    res.status(200).json({
      success: true,
      message: `Service completed for ${token.customerName} (${token.tokenNumber})`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a token (with confirmation)
// @route   PATCH /api/tokens/:id/cancel
// @access  Private
const cancelToken = async (req, res, next) => {
  try {
    const token = await tokenService.cancelToken(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: `Token ${token.tokenNumber} cancelled successfully`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move a WAITING token up or down
// @route   PATCH /api/tokens/:id/move
// @access  Private
const moveTokenPosition = async (req, res, next) => {
  try {
    const { direction } = req.body;

    const waitingTokens = await tokenService.moveTokenPosition(
      req.params.id,
      direction,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: `Token position adjusted ${direction}`,
      data: waitingTokens,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createToken,
  getTokens,
  getTokenById,
  callNext,
  completeService,
  cancelToken,
  moveTokenPosition,
};
