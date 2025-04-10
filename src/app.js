const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const logger = require('./utils/logger'); // Import logger

const app = express();

// Cấu hình Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation with Swagger',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Tích hợp Morgan với Winston
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  logger.error(`Global error: ${err.stack}`);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

// Database sync và khởi động server
const startServer = async () => {
  try {
    logger.info('⌛ Attempting database connection...');

    await sequelize.authenticate();
    logger.info('✅ Database connected successfully');

    logger.info('⌛ Syncing database models...');
    await sequelize.sync({ alter: true });
    logger.info('✅ Database synced successfully');

    app.listen(process.env.PORT, () => {
      logger.info(`🚀 Server running on port ${process.env.PORT}`);
      logger.info(
        `📚 API docs available at http://localhost:${process.env.PORT}/api-docs`,
      );
    });
  } catch (error) {
    logger.error(`🔥 Critical startup failure: ${error.stack}`);
    process.exit(1);
  }
};

// Xử lý shutdown
process.on('SIGINT', async () => {
  logger.info('\n🔻 Shutting down gracefully...');
  await sequelize.close();
  logger.info('✅ Database connection closed');
  process.exit(0);
});

// Bắt các promise rejection chưa được xử lý
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

startServer();
