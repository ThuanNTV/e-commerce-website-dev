module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Product name cannot be empty',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: {
            args: [0],
            msg: 'Price must be greater than or equal to 0',
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'Stock must be an integer',
          },
          min: {
            args: [0],
            msg: 'Stock cannot be negative',
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Weight in kilograms',
      },
      dimensions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Product dimensions (length, width, height) in cm',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Discount percentage cannot be negative',
          },
          max: {
            args: [100],
            msg: 'Discount percentage cannot exceed 100%',
          },
        },
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      indexes: [
        {
          name: 'idx_product_category',
          fields: ['category'],
        },
        {
          name: 'idx_product_name',
          fields: ['name'],
        },
      ],
    },
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'productId',
    });

    // Thêm các mối quan hệ khác nếu cần
    // if (models.Category) {
    //   Product.belongsTo(models.Category, {
    //     foreignKey: 'categoryId',
    //     as: 'productCategory',
    //   });
    // }

    // if (models.Review) {
    //   Product.hasMany(models.Review, {
    //     foreignKey: 'productId',
    //     as: 'reviews',
    //   });
    // }
  };

  return Product;
};
