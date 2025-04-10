const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getprofile,
  logout,
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getprofile);
router.get('/logout', authenticate, logout);

module.exports = router;
