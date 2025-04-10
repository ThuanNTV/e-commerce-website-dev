const { Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

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

    successResponse(res, {
      products,
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    successResponse(res, product);
  } catch (error) {
    errorResponse(res, error.message, 500);
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
      return errorResponse(res, 'Name and price are required', 400);
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

    successResponse(res, product, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
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
      return errorResponse(res, 'Product not found', 404);
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

    successResponse(res, product);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    await product.destroy();

    res.status(204).send();
    successResponse(res, 'Delete success!', 204);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;

    if (!query) {
      return errorResponse(res, 'Search query is required', 400);
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
    successResponse(res, {
      products,
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

const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment } = req.body;

    if (adjustment === undefined) {
      return errorResponse(res, 'Stock adjustment value is required', 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Tính toán giá trị stock mới
    const newStock = product.stock + parseInt(adjustment);

    if (newStock < 0) {
      return errorResponse(res, 'Insufficient stock available', 400);
    }

    await product.update({ stock: newStock });

    successResponse(res, {
      productId: product.id,
      previousStock: product.stock - parseInt(adjustment),
      currentStock: product.stock,
      adjustment: parseInt(adjustment),
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
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
