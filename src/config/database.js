const { Sequelize } = require('sequelize');

// Khởi tạo sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Tắt log SQL trong môi trường production
  },
);

module.exports = sequelize;
