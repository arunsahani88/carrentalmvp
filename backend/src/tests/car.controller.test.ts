import request from 'supertest';
import app from '../index';
import { sequelize } from '../models';
import { seedCars } from '../seeders/insertCars';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
  await seedCars();
});

describe('GET /cars/availability', () => {
  it('should return all available cars with correct pricing', async () => {
    const res = await request(app).get('/cars/availability')
      .query({ startDate: '2025-07-15', endDate: '2025-07-17' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('brand');
    expect(res.body[0]).toHaveProperty('stock');
    expect(res.body[0]).toHaveProperty('bookingPrice');
  });

  it('should fail if dates are missing', async () => {
    const res = await request(app).get('/cars/availability');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing/);
  });
});
