const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const manager = await Manager.findById(decoded.id).select('-password');
      if (!manager) {
        return res.status(401).json({
          success: false,
          message: 'Manager account not found or has been revoked.',
        });
      }

      req.user = manager;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No Bearer token provided.',
    });
  }
};

module.exports = { protect };
