// controllers/orderController.js
const { Order, OrderItem, sequelize } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');
const { successResponse, errorResponse } = require('../utils/response');

// Schema validation
const orderSchema = Joi.object({
  customerId: Joi.number().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().positive().required(),
      }),
    )
    .min(1)
    .required(),
});

const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const options = {
      where: {},
      include: [{ model: OrderItem }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    };

    // Filter
    if (status) options.where.status = status;
    if (startDate && endDate) {
      options.where.createdAt = { [Op.between]: [startDate, endDate] };
    }

    // Sort
    if (sort) {
      const [field, order] = sort.split(':');
      const allowedFields = ['total', 'createdAt'];
      if (allowedFields.includes(field)) {
        options.order = [[field, order.toUpperCase()]];
      }
    }

    const { count, rows: orders } = await Order.findAndCountAll(options);

    successResponse(res, {
      orders,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const createOrder = async (req, res) => {
  try {
    // Validation
    const { error } = orderSchema.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message, 400);

    const { customerId, items } = req.body;

    // Tính tổng tiền
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Transaction để đảm bảo tính toàn vẹn dữ liệu
    const order = await sequelize.transaction(async (t) => {
      const newOrder = await Order.create(
        {
          customerId,
          total,
          status: 'pending',
        },
        { transaction: t },
      );

      await OrderItem.bulkCreate(
        items.map((item) => ({
          ...item,
          orderId: newOrder.id,
        })),
        { transaction: t },
      );

      return newOrder;
    });

    successResponse(res, order, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByPk(id);
    if (!order) return errorResponse(res, 'Order not found', 404);

    await order.update({ status });
    successResponse(res, order);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
};
