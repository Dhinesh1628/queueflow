const express = require('express');
const router = express.Router();
const {
  getQueues,
  getQueueById,
  createQueue,
  updateQueue,
  deleteQueue,
  getQueueStatsController,
} = require('../controllers/queueController');
const { protect } = require('../middleware/authMiddleware');
const { validateQueueInput } = require('../validators/queueValidator');

router.use(protect);

router.route('/')
  .get(getQueues)
  .post(validateQueueInput, createQueue);

router.route('/:id')
  .get(getQueueById)
  .put(validateQueueInput, updateQueue)
  .delete(deleteQueue);

router.get('/:id/stats', getQueueStatsController);

module.exports = router;
