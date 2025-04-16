const { body, validationResult } = require('express-validator');

const validateVenue = [
  body('name').notEmpty().withMessage('El nombre del venue es obligatorio'),

  body('participation_file').notEmpty().withMessage('El archivo de participación es obligatorio'),

  body('status')
    .optional()
    .isIn(['Pendiente', 'Aprobado', 'Rechazado'])
    .withMessage('Estado no válido'),

  // Middleware final para capturar errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Error de validación',
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = { validateVenue };
