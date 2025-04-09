// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Tạo user test
    await User.create({
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'user',
    });
  });

  it('should return a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
