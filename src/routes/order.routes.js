// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', orderController.getAllOrders);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize(['customer']),
  orderController.createOrder,
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin', 'staff']),
  orderController.updateOrderStatus,
);

module.exports = router;
