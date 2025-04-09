const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', productController.getAllProducts);
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  productController.createProduct,
);

module.exports = router;
