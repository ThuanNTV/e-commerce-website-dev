// controllers/settingsController.js
const { Settings } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// Lấy tất cả cài đặt hệ thống (toàn cục)
const getGlobalSettings = async (req, res) => {
  try {
    const settings = await Settings.findAll({
      where: { isGlobal: true },
      attributes: ['key', 'value'],
    });
    successResponse(res, settings);
  } catch (error) {
    console.error('Lỗi khi lấy cài đặt:', error);
    errorResponse(res, 'Không thể lấy cài đặt hệ thống', 500);
  }
};

// Cập nhật cài đặt hệ thống (Admin-only)
const updateGlobalSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    // Validate key hợp lệ
    const validKeys = [
      'website_name',
      'contact_email',
      'seo_description',
      'maintenance_mode',
    ];
    if (!validKeys.includes(key)) {
      return errorResponse(res, 'Key cài đặt không hợp lệ', 400);
    }

    // Cập nhật hoặc tạo mới nếu chưa tồn tại
    const [setting] = await Settings.upsert(
      { key, value, isGlobal: true },
      { where: { key, isGlobal: true } },
    );

    successResponse(res, setting);
  } catch (error) {
    console.error('Lỗi khi cập nhật cài đặt:', error);
    errorResponse(res, 'Cập nhật thất bại', 500);
  }
};

module.exports = {
  getGlobalSettings,
  updateGlobalSetting,
};
