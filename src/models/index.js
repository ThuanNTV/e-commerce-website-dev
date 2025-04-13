// models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize'); // Import DataTypes
const sequelize = require('../config/database');

const models = {};
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.model.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // Truyền cả DataTypes
    models[model.name] = model;
  });

// Thiết lập associations
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = { ...models, sequelize };
