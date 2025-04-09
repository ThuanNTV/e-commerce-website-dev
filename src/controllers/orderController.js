// controllers/orderController.js
const { Order, OrderItem, Product } = require('../models');

const createOrder = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // Tính tổng tiền
    const total = await calculateTotal(items);

    // Tạo đơn hàng
    const order = await Order.create({ customerId, total });

    // Thêm các sản phẩm vào đơn hàng
    await Promise.all(
      items.map(async (item) => {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }),
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Hàm tính tổng tiền
const calculateTotal = async (items) => {
  const total = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      return product.price * item.quantity;
    }),
  );
  return total.reduce((sum, val) => sum + val, 0);
};

module.exports = { createOrder };
