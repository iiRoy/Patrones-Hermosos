const express = require('express');
const router = express.Router();
const { validateCollaborator } = require('../validators/collaboratorValidator');
const collaboratorController = require('../controllers/collaborator.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), collaboratorController.getAll);
router.post('/', validateCollaborator, collaboratorController.create);
router.get('/:id', authMiddleware, collaboratorController.getById);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateCollaborator,
  collaboratorController.update,
);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), collaboratorController.remove);

module.exports = router;
