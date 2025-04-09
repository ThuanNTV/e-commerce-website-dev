// controllers/cartController.js
const { Cart, Product } = require('../models');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Kiểm tra tồn kho
    const product = await Product.findByPk(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Thêm vào giỏ hàng
    const cartItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart };
