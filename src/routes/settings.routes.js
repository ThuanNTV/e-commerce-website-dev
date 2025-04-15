// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const {
  getGlobalSettings,
  updateGlobalSetting,
} = require('../controllers/settingsController');

// Chỉ Admin được phép truy cập
router.use(authenticate, authorize(['admin']));

// GET /api/settings - Lấy tất cả cài đặt hệ thống
router.get('/', getGlobalSettings);

// PUT /api/settings - Cập nhật cài đặt
router.put('/', updateGlobalSetting);

module.exports = router;
