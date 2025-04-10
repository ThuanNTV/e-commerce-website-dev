const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/database');
const specs = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customer', customerRoutes);

// Database sync và khởi động server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ alter: true });
    // Thay đổi thành trong production
    // await sequelize.sync(); // Chỉ tạo bảng nếu chưa tồn tại
    console.log('Database synced');

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
