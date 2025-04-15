const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
// const { sendPasswordResetEmail } = require('../services/email.service');
const { generateResetToken } = require('../utils/auth');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check existing user with transaction
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Create user with default role
    const user = await User.create({
      email,
      password,
    });

    // Omit sensitive fields
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    successResponse(res, userData, 201);
  } catch (error) {
    console.error('Registration Error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'role'],
    });

    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    successResponse(res, {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'],
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user);
  } catch (error) {
    console.error('Profile Error:', error);
    errorResponse(res, 'Failed to fetch profile', 500);
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  successResponse(res, 'Successfully logged out');
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const resetToken = generateResetToken();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return success to prevent email enumeration
    successResponse(res, 'If the email exists, a reset link will be sent');
  } catch (error) {
    console.error('Forgot Password Error:', error);
    errorResponse(res, 'Password reset failed', 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return errorResponse(res, 'Invalid or expired token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    successResponse(res, 'Password has been reset');
  } catch (error) {
    console.error('Reset Password Error:', error);
    errorResponse(res, 'Password reset failed', 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
};
