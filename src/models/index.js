const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  },
);

const models = {
  User: require('./user.model')(sequelize, DataTypes),
  Product: require('./product.model')(sequelize, DataTypes),
  Customer: require('./customer.model')(sequelize, DataTypes),
  Order: require('./order.model')(sequelize, DataTypes),
  OrderItem: require('./orderitem.model')(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = {
  ...models,
  sequelize,
  Sequelize,
};
