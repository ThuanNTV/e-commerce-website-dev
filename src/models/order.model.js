module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    customerId: {
      // Thêm trường liên kết với Customer
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  };

  return Order;
};
