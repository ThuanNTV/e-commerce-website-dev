const { Customer } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    successResponse(res, customers, 200);
  } catch (_error) {
    errorResponse(res, 'Lỗi khi lấy danh sách khách hàng', 500);
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return errorResponse(res, 'Khách hàng không tồn tại', 404);
    }
    successResponse(res, customer, 200);
  } catch (_error) {
    errorResponse(res, 'Lỗi khi lấy thông tin khách hàng', 500);
  }
};

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    successResponse(res, customer, 201);
  } catch (_error) {
    errorResponse(res, 'Lỗi khi tạo khách hàng', 500);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return errorResponse(res, 'Khách hàng không tồn tại', 404);
    }
    await customer.update(req.body);
    successResponse(res, customer, 200);
  } catch (_error) {
    errorResponse(res, 'Lỗi khi cập nhật khách hàng', 500);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return errorResponse(res, 'Khách hàng không tồn tại', 404);
    }
    await customer.destroy();
    successResponse(res, 'Xóa khách hàng thành công', 200);
  } catch (_error) {
    errorResponse(res, 'Lỗi khi xóa khách hàng', 500);
  }
};

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};
