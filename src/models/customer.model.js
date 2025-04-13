const { DataTypes } = require('sequelize'); // Thêm dòng này

module.exports = (sequelize) => {
  const Customer = sequelize.define(
    'Customer',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      address: DataTypes.TEXT,
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      timestamps: true,
    },
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Order, {
      foreignKey: 'customerId',
      as: 'orders',
    });
  };

  return Customer;
};
