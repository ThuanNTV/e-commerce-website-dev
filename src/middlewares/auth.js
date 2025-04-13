const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    // 1. Kiểm tra token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', 401);
    }

    // 2. Trích xuất token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Tìm user và kiểm tra trạng thái
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user || user.isDisabled) {
      return errorResponse(res, 'Account not found or disabled', 401);
    }

    // 5. Gắn user vào request
    req.user = user;
    next();
  } catch (error) {
    // 6. Xử lý các loại lỗi cụ thể
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token format';
    }

    // 7. Log lỗi cho developer
    console.error('Authentication Error:', error.message);
    return errorResponse(res, message, 401);
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      // 1. Kiểm tra type của roles
      if (!Array.isArray(roles)) {
        throw new Error('Roles must be an array');
      }

      // 2. Cho phép all roles nếu mảng rỗng
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return errorResponse(
          res,
          `Require one of these roles: ${roles.join(', ')}`,
          403,
        );
      }

      next();
    } catch (error) {
      console.error('Authorization Error:', error);
      return errorResponse(res, 'Authorization failed', 500);
    }
  };
};

module.exports = {
  authenticate,
  authorize,
};
