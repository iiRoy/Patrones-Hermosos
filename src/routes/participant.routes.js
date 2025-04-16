const express = require('express');
const router = express.Router();
const { validateParticipant } = require('../validators/participantsValidator');
const participantsController = require('../controllers/participants.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, participantsController.getAll);
router.post('/', authMiddleware, validateParticipant, participantsController.create);
router.get('/:id', authMiddleware, participantsController.getById);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateParticipant,
  participantsController.update,
);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), participantsController.remove);

module.exports = router;
