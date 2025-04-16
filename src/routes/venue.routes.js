const express = require('express');
const router = express.Router();
const { validateVenue } = require('../validators/venueValidator');
const venueController = require('../controllers/venue.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Rutas CRUD
router.get('/', authMiddleware, venueController.getAll);
router.post('/', authMiddleware, roleMiddleware(['admin']), validateVenue, venueController.create);
router.get('/:id', authMiddleware, venueController.getById);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateVenue,
  venueController.update,
);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), venueController.remove);

module.exports = router;
