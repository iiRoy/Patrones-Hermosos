const express = require('express');
const router = express.Router();
const { validateLogin } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

router.post('/login', validateLogin, authController.login);

module.exports = router;
