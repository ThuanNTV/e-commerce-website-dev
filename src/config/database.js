const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Bật logging để debug
    define: {
      timestamps: true, // Đảm bảo createdAt/updatedAt được tạo
      freezeTableName: false, // Cho phép Sequelize tự động đặt tên bảng số nhiều
    },
  },
);

module.exports = sequelize;
