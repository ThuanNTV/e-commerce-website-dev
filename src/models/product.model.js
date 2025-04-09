module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'productId',
    });
  };

  return Product;
};
