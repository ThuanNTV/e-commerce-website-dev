const Sequelize = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config.database[env];

const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: console.log,
  }
);

const models = {
  User: require('./user.model')(sequelize, Sequelize),
  Product: require('./product.model')(sequelize, Sequelize),
  Customer: require('./customer.model')(sequelize, Sequelize),
  Order: require('./order.model')(sequelize, Sequelize),
  OrderItem: require('./orderitem.model')(sequelize, Sequelize),
};

// Thiết lập quan hệ
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = {
  ...models,
  sequelize,
};
