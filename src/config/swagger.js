// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // Đường dẫn đến các file routes
};

const specs = swaggerJsdoc(options);
module.exports = specs;
