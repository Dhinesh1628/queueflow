const express = require('express');
const router = express.Router();
const {
  createToken,
  getTokens,
  getTokenById,
  callNext,
  completeService,
  cancelToken,
  moveTokenPosition,
} = require('../controllers/tokenController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateTokenInput,
  validateMoveInput,
} = require('../validators/tokenValidator');

router.use(protect);

router.route('/')
  .get(getTokens)
  .post(validateTokenInput, createToken);

router.post('/call-next', callNext);
router.post('/complete-service', completeService);

router.route('/:id')
  .get(getTokenById);

router.patch('/:id/cancel', cancelToken);
router.patch('/:id/move', validateMoveInput, moveTokenPosition);

module.exports = router;
