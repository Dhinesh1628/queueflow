import api from './api';

export const queueService = {
  async getQueues() {
    const res = await api.get('/queues');
    return res.data;
  },

  async getQueueById(id) {
    const res = await api.get(`/queues/${id}`);
    return res.data;
  },

  async createQueue(queueData) {
    const res = await api.post('/queues', queueData);
    return res.data;
  },

  async updateQueue(id, queueData) {
    const res = await api.put(`/queues/${id}`, queueData);
    return res.data;
  },

  async deleteQueue(id) {
    const res = await api.delete(`/queues/${id}`);
    return res.data;
  },

  async getQueueStats(id) {
    const res = await api.get(`/queues/${id}/stats`);
    return res.data;
  },
};
