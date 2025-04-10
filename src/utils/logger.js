const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;
const fs = require('fs');
const path = require('path');

// Tạo thư mục logs nếu chưa tồn tại
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Ghi lại stack trace
    process.env.NODE_ENV === 'development'
      ? colorize()
      : winston.format.simple(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test', // Tắt log khi test
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
});

// Không ghi file log khi test
if (process.env.NODE_ENV === 'test') {
  logger.clear();
  logger.add(new winston.transports.Console());
}

module.exports = logger;
