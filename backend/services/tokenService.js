const Queue = require('../models/Queue');
const Token = require('../models/Token');
const { formatTokenCode } = require('../utils/formatters');

/**
 * Re-index all WAITING tokens for a given queue sequentially (1, 2, 3...)
 */
const reindexWaitingTokens = async (queueId) => {
  const waitingTokens = await Token.find({ queueId, status: 'WAITING' }).sort({
    position: 1,
    createdAt: 1,
  });

  const updates = waitingTokens.map((token, index) => {
    token.position = index + 1;
    return token.save();
  });

  await Promise.all(updates);
  return waitingTokens;
};

/**
 * Atomically create a new token for a queue
 */
const createToken = async ({ queueId, managerId, customerName, phoneNumber, notes }) => {
  const queue = await Queue.findOneAndUpdate(
    { _id: queueId, managerId, isActive: true },
    { $inc: { tokenCounter: 1 } },
    { returnDocument: 'after' }
  );

  if (!queue) {
    const error = new Error('Queue not found or inactive');
    error.statusCode = 404;
    throw error;
  }

  const waitingCount = await Token.countDocuments({
    queueId,
    status: 'WAITING',
  });

  const sequence = queue.tokenCounter;
  const tokenNumber = formatTokenCode(queue.prefix, sequence);

  const token = await Token.create({
    tokenNumber,
    sequence,
    customerName: customerName.trim(),
    phoneNumber: phoneNumber ? phoneNumber.trim() : '',
    queueId,
    managerId,
    status: 'WAITING',
    position: waitingCount + 1,
    notes: notes ? notes.trim() : '',
  });

  return token;
};

/**
 * Call the next waiting token in the queue for service
 */
const callNextToken = async (queueId, managerId) => {
  // Check if a customer is already being served
  const currentServing = await Token.findOne({
    queueId,
    managerId,
    status: 'SERVING',
  });

  if (currentServing) {
    const error = new Error(
      `Token ${currentServing.tokenNumber} is currently being served. Complete or cancel service before calling the next person.`
    );
    error.statusCode = 400;
    throw error;
  }

  // Find next waiting token
  const nextToken = await Token.findOne({
    queueId,
    managerId,
    status: 'WAITING',
  }).sort({ position: 1, createdAt: 1 });

  if (!nextToken) {
    const error = new Error('No customers waiting in this queue');
    error.statusCode = 400;
    throw error;
  }

  // Promote to SERVING
  nextToken.status = 'SERVING';
  nextToken.serviceStartedAt = new Date();
  nextToken.position = 0;
  await nextToken.save();

  // Re-index remaining waiting tokens
  await reindexWaitingTokens(queueId);

  return nextToken;
};

/**
 * Complete service for the currently serving token
 */
const completeService = async (queueId, managerId, tokenId = null) => {
  const query = { queueId, managerId, status: 'SERVING' };
  if (tokenId) {
    query._id = tokenId;
  }

  const servingToken = await Token.findOne(query);

  if (!servingToken) {
    const error = new Error('No active customer is currently being served in this queue');
    error.statusCode = 400;
    throw error;
  }

  servingToken.status = 'COMPLETED';
  servingToken.serviceCompletedAt = new Date();
  servingToken.position = 0;
  await servingToken.save();

  return servingToken;
};

/**
 * Cancel a token (waiting or serving) and re-index remaining waiting tokens
 */
const cancelToken = async (tokenId, managerId) => {
  const token = await Token.findOne({ _id: tokenId, managerId });

  if (!token) {
    const error = new Error('Token not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  if (['COMPLETED', 'CANCELLED'].includes(token.status)) {
    const error = new Error(`Cannot cancel a token that is already ${token.status.toLowerCase()}`);
    error.statusCode = 400;
    throw error;
  }

  const queueId = token.queueId;
  token.status = 'CANCELLED';
  token.position = 0;
  await token.save();

  // Re-index waiting tokens so numbering is seamless
  await reindexWaitingTokens(queueId);

  return token;
};

/**
 * Move a WAITING token up or down in the queue
 */
const moveTokenPosition = async (tokenId, direction, managerId) => {
  const token = await Token.findOne({ _id: tokenId, managerId });

  if (!token) {
    const error = new Error('Token not found');
    error.statusCode = 404;
    throw error;
  }

  if (token.status !== 'WAITING') {
    const error = new Error('Only WAITING tokens can be rearranged');
    error.statusCode = 400;
    throw error;
  }

  const waitingTokens = await Token.find({
    queueId: token.queueId,
    status: 'WAITING',
  }).sort({ position: 1, createdAt: 1 });

  const currentIndex = waitingTokens.findIndex(
    (t) => t._id.toString() === token._id.toString()
  );

  if (currentIndex === -1) {
    const error = new Error('Token is not in the active waiting list');
    error.statusCode = 400;
    throw error;
  }

  if (direction === 'up') {
    if (currentIndex === 0) {
      const error = new Error('Token is already at the front of the waiting queue');
      error.statusCode = 400;
      throw error;
    }
    const prev = waitingTokens[currentIndex - 1];
    const tempPos = prev.position;
    prev.position = token.position;
    token.position = tempPos;

    await Promise.all([token.save(), prev.save()]);
  } else if (direction === 'down') {
    if (currentIndex === waitingTokens.length - 1) {
      const error = new Error('Token is already at the end of the waiting queue');
      error.statusCode = 400;
      throw error;
    }
    const next = waitingTokens[currentIndex + 1];
    const tempPos = next.position;
    next.position = token.position;
    token.position = tempPos;

    await Promise.all([token.save(), next.save()]);
  }

  // Re-fetch sorted waiting tokens to ensure clean 1..N order
  return reindexWaitingTokens(token.queueId);
};

/**
 * Get comprehensive queue statistics
 */
const getQueueStats = async (queueId, managerId) => {
  const [
    totalTokens,
    waitingCount,
    servingCount,
    completedCount,
    cancelledCount,
    currentlyServingToken,
    tokensWithTimes,
  ] = await Promise.all([
    Token.countDocuments({ queueId, managerId }),
    Token.countDocuments({ queueId, managerId, status: 'WAITING' }),
    Token.countDocuments({ queueId, managerId, status: 'SERVING' }),
    Token.countDocuments({ queueId, managerId, status: 'COMPLETED' }),
    Token.countDocuments({ queueId, managerId, status: 'CANCELLED' }),
    Token.findOne({ queueId, managerId, status: 'SERVING' }),
    Token.find({
      queueId,
      managerId,
      serviceStartedAt: { $ne: null },
    }).select('createdAt serviceStartedAt serviceCompletedAt status'),
  ]);

  // Calculate actual average waiting time
  let totalWaitMs = 0;
  let waitCount = 0;
  let totalServiceMs = 0;
  let serviceCount = 0;

  tokensWithTimes.forEach((t) => {
    if (t.serviceStartedAt && t.createdAt) {
      totalWaitMs += new Date(t.serviceStartedAt) - new Date(t.createdAt);
      waitCount++;
    }
    if (t.serviceCompletedAt && t.serviceStartedAt) {
      totalServiceMs += new Date(t.serviceCompletedAt) - new Date(t.serviceStartedAt);
      serviceCount++;
    }
  });

  const avgWaitMinutes = waitCount > 0 ? Math.round((totalWaitMs / (waitCount * 60000)) * 10) / 10 : 0;
  const avgServiceMinutes = serviceCount > 0 ? Math.round((totalServiceMs / (serviceCount * 60000)) * 10) / 10 : 0;

  return {
    totalTokens,
    waitingCount,
    servingCount,
    completedCount,
    cancelledCount,
    currentlyServingToken,
    avgWaitMinutes,
    avgServiceMinutes,
  };
};

module.exports = {
  createToken,
  callNextToken,
  completeService,
  cancelToken,
  moveTokenPosition,
  getQueueStats,
  reindexWaitingTokens,
};
