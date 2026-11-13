const validateTokenInput = (req, res, next) => {
  const { customerName } = req.body;
  const errors = [];

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    errors.push('Customer name is required');
  } else if (customerName.trim().length > 100) {
    errors.push('Customer name cannot exceed 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors,
    });
  }

  next();
};

const validateMoveInput = (req, res, next) => {
  const { direction } = req.body;
  if (!direction || !['up', 'down'].includes(direction)) {
    return res.status(400).json({
      success: false,
      message: "Direction must be either 'up' or 'down'",
    });
  }
  next();
};

module.exports = {
  validateTokenInput,
  validateMoveInput,
};
