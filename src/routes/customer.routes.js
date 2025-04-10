const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} = require('../controllers/customerController');

router.use(authenticate);

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
module.exports = router;
