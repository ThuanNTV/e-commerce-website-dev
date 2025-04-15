// settings.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Settings = sequelize.define(
    'Settings',
    {
      key: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Key không được để trống' },
          isIn: {
            args: [
              [
                'website_name',
                'contact_email',
                'seo_description',
                'maintenance_mode',
              ],
            ],
            msg: 'Key cài đặt không hợp lệ',
          },
        },
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isGlobal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'true: Cài đặt toàn hệ thống, false: Theo người dùng',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      paranoid: true,
      timestamps: true,
      indexes: [
        // Đảm bảo key toàn cục là duy nhất
        {
          unique: true,
          fields: ['key'],
          where: { isGlobal: true },
        },
        // Đảm bảo key + userId là duy nhất cho cài đặt người dùng
        {
          unique: true,
          fields: ['key', 'userId'],
          where: { isGlobal: false },
        },
      ],
    },
  );

  // Quan hệ với User (chỉ cho cài đặt người dùng)
  Settings.associate = (models) => {
    Settings.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Settings;
};
