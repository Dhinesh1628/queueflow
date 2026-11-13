const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Queue name is required'],
      trim: true,
      maxlength: [80, 'Queue name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    prefix: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'QF',
      maxlength: [6, 'Prefix cannot exceed 6 characters'],
    },
    tokenCounter: {
      type: Number,
      default: 0,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: [true, 'Manager ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure queue names are unique per manager
queueSchema.index({ managerId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Queue', queueSchema);
