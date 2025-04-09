const { Customer } = require('../models');

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (_error) {
    res.status(500).json({ error: 'Lỗi khi tạo khách hàng' });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (_error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng' });
  }
};

module.exports = { createCustomer, getAllCustomers };
