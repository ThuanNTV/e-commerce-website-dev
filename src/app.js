const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Database sync
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('Database sync error:', err));
