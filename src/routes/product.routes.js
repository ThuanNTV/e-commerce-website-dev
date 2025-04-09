const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', productController.getAllProducts);
router.post(
  '/',
  authenticate,
  authorize(['admin', 'staff']),
  productController.createProduct,
);
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'staff']),
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  productController.deleteProduct,
);

module.exports = router;
