// models/orderItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'RESTRICT', // Changed from SET NULL
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'OrderItems',
      indexes: [
        {
          fields: ['orderId'],
        },
        {
          fields: ['productId'],
        },
        {
          unique: true,
          fields: ['orderId', 'productId'], // Keep this as a unique constraint
        },
      ],
    },
  );

  return OrderItem;
};
