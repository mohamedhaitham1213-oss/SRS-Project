const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Require valid JWT so logout is only callable for authenticated clients
router.post('/logout', authenticate, logout);

module.exports = router;
