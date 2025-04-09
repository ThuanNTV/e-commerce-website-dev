const { Product } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      isActive,
      sort,
      limit = 10,
      page = 1,
    } = req.query;

    // Xây dựng các tùy chọn truy vấn
    const options = {
      where: {},
      order: [['createdAt', 'DESC']], // Mặc định sắp xếp theo thời gian tạo mới nhất
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    // Thêm các bộ lọc nếu có
    if (category) options.where.category = category;
    if (featured === 'true') options.where.featured = true;
    if (isActive === 'true' || isActive === undefined)
      options.where.isActive = true;
    if (isActive === 'false') options.where.isActive = false;

    // Sắp xếp tùy chỉnh
    if (sort) {
      const [field, order] = sort.split(':');
      if (field && (order === 'asc' || order === 'desc')) {
        options.order = [[field, order.toUpperCase()]];
      }
    }

    // Thực hiện truy vấn với phân trang
    const { count, rows: products } = await Product.findAndCountAll(options);

    res.json({
      products,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      sku,
      weight,
      dimensions,
      isActive,
      discountPercentage,
      featured,
    } = req.body;

    // Kiểm tra trường bắt buộc
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      sku,
      weight,
      dimensions,
      isActive,
      discountPercentage,
      featured,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      sku,
      weight,
      dimensions,
      isActive,
      discountPercentage,
      featured,
    } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      sku,
      weight,
      dimensions,
      isActive,
      discountPercentage,
      featured,
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { Op } = require('sequelize');

    const options = {
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { sku: { [Op.like]: `%${query}%` } },
        ],
        isActive: true, // Chỉ tìm sản phẩm đang hoạt động
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const { count, rows: products } = await Product.findAndCountAll(options);

    res.json({
      products,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment } = req.body;

    if (adjustment === undefined) {
      return res
        .status(400)
        .json({ error: 'Stock adjustment value is required' });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Tính toán giá trị stock mới
    const newStock = product.stock + parseInt(adjustment);

    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    await product.update({ stock: newStock });

    res.json({
      productId: product.id,
      previousStock: product.stock - parseInt(adjustment),
      currentStock: product.stock,
      adjustment: parseInt(adjustment),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  updateProductStock,
};
