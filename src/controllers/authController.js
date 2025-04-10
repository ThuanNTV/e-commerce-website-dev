const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Không hash ở đây, để cho hook beforeCreate làm
    const user = await User.create({ email, password, role });
    successResponse(res, { id: user.id, email: user.email }, 201);
  } catch (_error) {
    errorResponse(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Tạo token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (_error) {
    errorResponse(res, 'Internal server error', 500);
  }
};

module.exports = { register, login };
