module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    customerId: DataTypes.INTEGER,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
    Order.belongsToMany(models.Product, {
      through: models.OrderItem,
      foreignKey: 'orderId',
    });
  };

  return Order;
};
