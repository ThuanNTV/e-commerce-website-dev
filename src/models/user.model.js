const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email address already in use',
        },
        validate: {
          isEmail: {
            msg: 'Invalid email address format',
          },
          notEmpty: {
            msg: 'Email is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100],
            msg: 'Password must be between 8 and 100 characters',
          },
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'staff', 'customer'),
        defaultValue: 'customer',
        validate: {
          isIn: {
            args: [['admin', 'staff', 'customer']],
            msg: 'Invalid user role',
          },
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['role'],
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          try {
            user.password = await bcrypt.hash(user.password, 12);
          } catch (error) {
            throw new Error('Password hashing failed');
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            try {
              user.password = await bcrypt.hash(user.password, 12);
            } catch (error) {
              throw new Error('Password hashing failed');
            }
          }
        },
      },
    },
  );

  // Instance method for password comparison
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};
