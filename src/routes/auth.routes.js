const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/auth');

//TODO:
// const { validate } = require('../middlewares/validate.middleware');
// const {
//   registerSchema,
//   loginSchema,
// } = require('../validations/auth.validation');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);
router.get('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
