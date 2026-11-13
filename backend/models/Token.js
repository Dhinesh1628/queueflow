const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: String,
      required: [true, 'Token number is required'],
      trim: true,
      index: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: [true, 'Queue reference is required'],
      index: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
      required: [true, 'Manager reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['WAITING', 'SERVING', 'COMPLETED', 'CANCELLED'],
      default: 'WAITING',
      index: true,
    },
    position: {
      type: Number,
      default: 0,
      index: true,
    },
    serviceStartedAt: {
      type: Date,
      default: null,
    },
    serviceCompletedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal queue ordering and querying
tokenSchema.index({ queueId: 1, status: 1, position: 1 });
tokenSchema.index({ managerId: 1, createdAt: -1 });

module.exports = mongoose.model('Token', tokenSchema);
