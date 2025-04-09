require('dotenv').config({ path: '../.env' }); // Đường dẫn đến file .env

const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const plainPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    await User.create({
      email: 'admin@example.com',
      password: hash,
      role: 'admin',
    });

    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
