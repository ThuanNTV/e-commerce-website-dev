const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  createCustomer,
  getAllCustomers,
} = require('../controllers/customerController');

router.use(authenticate);

router.post('/', createCustomer);
router.get('/', getAllCustomers);

module.exports = router;
