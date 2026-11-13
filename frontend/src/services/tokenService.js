import api from './api';

export const tokenService = {
  async createToken({ queueId, customerName, phoneNumber, notes }) {
    const res = await api.post('/tokens', { queueId, customerName, phoneNumber, notes });
    return res.data;
  },

  async getTokens(params = {}) {
    const res = await api.get('/tokens', { params });
    return res.data;
  },

  async callNext(queueId) {
    const res = await api.post('/tokens/call-next', { queueId });
    return res.data;
  },

  async completeService(queueId, tokenId) {
    const res = await api.post('/tokens/complete-service', { queueId, tokenId });
    return res.data;
  },

  async cancelToken(tokenId) {
    const res = await api.patch(`/tokens/${tokenId}/cancel`);
    return res.data;
  },

  async moveTokenPosition(tokenId, direction) {
    const res = await api.patch(`/tokens/${tokenId}/move`, { direction });
    return res.data;
  },
};
