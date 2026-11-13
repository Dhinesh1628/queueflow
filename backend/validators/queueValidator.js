const validateQueueInput = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Queue name is required');
  } else if (name.trim().length > 80) {
    errors.push('Queue name cannot exceed 80 characters');
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

module.exports = {
  validateQueueInput,
};
