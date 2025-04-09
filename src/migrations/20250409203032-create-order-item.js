'use strict';
/** @type {import('_Sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: _Sequelize.INTEGER,
      },
      orderId: {
        type: _Sequelize.INTEGER,
      },
      productId: {
        type: _Sequelize.INTEGER,
      },
      quantity: {
        type: _Sequelize.INTEGER,
      },
      price: {
        type: _Sequelize.DECIMAL,
      },
      createdAt: {
        allowNull: false,
        type: _Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: _Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('OrderItems');
  },
};
