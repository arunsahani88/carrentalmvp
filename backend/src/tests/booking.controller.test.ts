import request from 'supertest';
import app from '../index';
import { sequelize } from '../models';
import { seedCars } from '../seeders/insertCars';

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await seedCars();
});

describe('POST /bookings', () => {
  const bookingPayload = {
    user: {
      name: "Test User",
      driving_license_valid_until: "2026-01-01",
      driving_license_number: "MH12AB1234"
    },
    car_id: 1,
    start_date: "2025-07-20",
    end_date: "2025-07-22"
  };

  it('should create a booking if all is valid', async () => {
    const res = await request(app).post('/bookings').send(bookingPayload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.total_price).toBeDefined();
  });

  it('should reject if car is unavailable', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app).post('/bookings').send({
        ...bookingPayload,
        user: {
          name: `User ${i + 1}`,
          driving_license_valid_until: "2026-01-01",
          driving_license_number: `DL-0000-${i + 1}`
        }
      });
    }

    const res = await request(app).post('/bookings').send({
      ...bookingPayload,
      user: {
        name: "User OverLimit",
        driving_license_valid_until: "2026-01-01",
        driving_license_number: "DL-9999-9999"
      }
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Car not available/);
  });

  it('should reject if user has overlapping booking', async () => {
    const res = await request(app).post('/bookings').send(bookingPayload);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already has a booking/);
  });

  it('should reject if license is invalid for booking period', async () => {
    const res = await request(app).post('/bookings').send({
      ...bookingPayload,
      user: {
        name: "Bad License",
        driving_license_valid_until: "2024-01-01",
        driving_license_number: "DL-0000-0000"
      }
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/license not valid/);
  });

  it('should reject booking in the past', async () => {
    const res = await request(app).post('/bookings').send({
      ...bookingPayload,
      start_date: "2020-01-01",
      end_date: "2020-01-03",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/past dates/);
  });
});
