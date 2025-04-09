const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (_err) {
    res.status(401).send({ error: 'Vui lòng xác thực' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Không có quyền truy cập',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
