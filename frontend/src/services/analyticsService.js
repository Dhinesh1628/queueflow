import api from './api';

export const analyticsService = {
  async getAnalytics(timeframe = '7d') {
    const res = await api.get('/analytics', { params: { timeframe } });
    return res.data;
  },
};
