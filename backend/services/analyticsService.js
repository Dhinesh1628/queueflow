const Queue = require('../models/Queue');
const Token = require('../models/Token');

// In-memory cache for fast analytics responses (10 seconds TTL)
const analyticsCache = new Map();
const CACHE_TTL_MS = 10000;

/**
 * Clear analytics cache for a manager when queues or tokens change
 */
const invalidateAnalyticsCache = (managerId) => {
  if (managerId) {
    analyticsCache.delete(managerId.toString() + '_today');
    analyticsCache.delete(managerId.toString() + '_7d');
    analyticsCache.delete(managerId.toString() + '_30d');
  } else {
    analyticsCache.clear();
  }
};

/**
 * Helper to get date boundaries based on timeframe
 */
const getDateRange = (timeframe = '7d') => {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  if (timeframe === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (timeframe === '7d') {
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  } else if (timeframe === '30d') {
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
  } else {
    // Default to 7d
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
};

/**
 * Get comprehensive analytics for a manager
 */
const getManagerAnalytics = async (managerId, timeframe = '7d') => {
  const cacheKey = `${managerId}_${timeframe}`;
  const cached = analyticsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const { start, end } = getDateRange(timeframe);

  // Today boundaries for Today KPIs
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. KPI Aggregations
  const [
    totalQueues,
    totalTokensAllTime,
    tokensInPeriod,
    currentlyWaiting,
    currentlyServing,
    completedToday,
    cancelledToday,
    allQueues,
  ] = await Promise.all([
    Queue.countDocuments({ managerId }),
    Token.countDocuments({ managerId }),
    Token.countDocuments({
      managerId,
      createdAt: { $gte: start, $lte: end },
    }),
    Token.countDocuments({ managerId, status: 'WAITING' }),
    Token.countDocuments({ managerId, status: 'SERVING' }),
    Token.countDocuments({
      managerId,
      status: 'COMPLETED',
      serviceCompletedAt: { $gte: todayStart },
    }),
    Token.countDocuments({
      managerId,
      status: 'CANCELLED',
      updatedAt: { $gte: todayStart },
    }),
    Queue.find({ managerId }).select('_id name prefix'),
  ]);

  // 2. Status Distribution (overall or in timeframe)
  const statusCountsRaw = await Token.aggregate([
    {
      $match: {
        managerId,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusDistribution = [
    { name: 'Waiting', value: 0, key: 'WAITING', color: '#6366F1' },
    { name: 'Serving', value: 0, key: 'SERVING', color: '#38BDF8' },
    { name: 'Completed', value: 0, key: 'COMPLETED', color: '#10B981' },
    { name: 'Cancelled', value: 0, key: 'CANCELLED', color: '#F43F5E' },
  ];

  statusCountsRaw.forEach((item) => {
    const target = statusDistribution.find((s) => s.key === item._id);
    if (target) {
      target.value = item.count;
    }
  });

  // 3. Daily Activity & Trend
  const tokensForTrend = await Token.find({
    managerId,
    createdAt: { $gte: start, $lte: end },
  }).select('createdAt serviceStartedAt serviceCompletedAt status queueId');

  // Group tokens by day
  const dailyMap = {};
  const dayCount = timeframe === 'today' ? 1 : timeframe === '7d' ? 7 : 30;

  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    dailyMap[key] = {
      date: key,
      label,
      created: 0,
      completed: 0,
      cancelled: 0,
      waitingTotal: 0,
      totalWaitMinutes: 0,
      waitCount: 0,
    };
  }

  tokensForTrend.forEach((t) => {
    const dayKey = new Date(t.createdAt).toISOString().split('T')[0];
    if (dailyMap[dayKey]) {
      dailyMap[dayKey].created += 1;
      if (t.status === 'WAITING') {
        dailyMap[dayKey].waitingTotal += 1;
      }
    }

    if (t.serviceCompletedAt) {
      const compKey = new Date(t.serviceCompletedAt).toISOString().split('T')[0];
      if (dailyMap[compKey]) {
        dailyMap[compKey].completed += 1;
      }
    }

    if (t.status === 'CANCELLED') {
      const cancelKey = new Date(t.updatedAt || t.createdAt).toISOString().split('T')[0];
      if (dailyMap[cancelKey]) {
        dailyMap[cancelKey].cancelled += 1;
      }
    }

    // Wait time calculation
    if (t.serviceStartedAt && t.createdAt) {
      const waitMs = new Date(t.serviceStartedAt) - new Date(t.createdAt);
      if (waitMs > 0 && dailyMap[dayKey]) {
        dailyMap[dayKey].totalWaitMinutes += waitMs / 60000;
        dailyMap[dayKey].waitCount += 1;
      }
    }
  });

  const dailyActivity = Object.values(dailyMap).map((d) => ({
    date: d.date,
    label: d.label,
    created: d.created,
    completed: d.completed,
    cancelled: d.cancelled,
  }));

  const queueLengthTrend = Object.values(dailyMap).map((d) => ({
    date: d.date,
    label: d.label,
    tokensReceived: d.created,
    tokensCompleted: d.completed,
  }));

  const waitTimeTrend = Object.values(dailyMap).map((d) => ({
    date: d.date,
    label: d.label,
    avgWaitMinutes:
      d.waitCount > 0 ? Math.round((d.totalWaitMinutes / d.waitCount) * 10) / 10 : 0,
  }));

  // Overall average wait time across timeframe
  const totalWaitMs = tokensForTrend.reduce((acc, t) => {
    if (t.serviceStartedAt && t.createdAt) {
      const diff = new Date(t.serviceStartedAt) - new Date(t.createdAt);
      return diff > 0 ? acc + diff : acc;
    }
    return acc;
  }, 0);

  const servedCount = tokensForTrend.filter(
    (t) => t.serviceStartedAt && t.createdAt
  ).length;

  const averageWaitMinutes =
    servedCount > 0 ? Math.round((totalWaitMs / (servedCount * 60000)) * 10) / 10 : 0;

  // 4. Queue Performance Comparison
  const queueStatsPromises = allQueues.map(async (q) => {
    const [total, waiting, serving, completed, cancelled] = await Promise.all([
      Token.countDocuments({ queueId: q._id, managerId }),
      Token.countDocuments({ queueId: q._id, managerId, status: 'WAITING' }),
      Token.countDocuments({ queueId: q._id, managerId, status: 'SERVING' }),
      Token.countDocuments({ queueId: q._id, managerId, status: 'COMPLETED' }),
      Token.countDocuments({ queueId: q._id, managerId, status: 'CANCELLED' }),
    ]);

    return {
      queueId: q._id,
      name: q.name,
      prefix: q.prefix,
      total,
      waiting,
      serving,
      completed,
      cancelled,
    };
  });

  const queuePerformance = await Promise.all(queueStatsPromises);

  const result = {
    kpis: {
      totalQueues,
      totalTokens: totalTokensAllTime,
      periodTokens: tokensInPeriod,
      currentlyWaiting,
      currentlyServing,
      completedToday,
      cancelledToday,
      averageWaitMinutes,
    },
    charts: {
      queueLengthTrend,
      waitTimeTrend,
      statusDistribution,
      queuePerformance,
      dailyActivity,
    },
    timeframe,
  };

  analyticsCache.set(cacheKey, {
    timestamp: Date.now(),
    data: result,
  });

  return result;
};

module.exports = {
  getManagerAnalytics,
  invalidateAnalyticsCache,
};
