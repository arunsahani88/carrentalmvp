import { Car } from "../models/car.model";

export async function seedCars() {
  try {
    const count = await Car.count();
    if (count > 0) {
      console.log("Cars already seeded, skipping...");
      return;
    }

    const cars = [
      {
        brand: "Toyota", model: "Yaris", stock: 3,
        peak_season_price: 98.43, mid_season_price: 76.89, off_season_price: 53.65,
      },
      {
        brand: "Seat", model: "Ibiza", stock: 5,
        peak_season_price: 85.12, mid_season_price: 65.73, off_season_price: 46.85,
      },
      {
        brand: "Nissan", model: "Qashqai", stock: 2,
        peak_season_price: 101.46, mid_season_price: 82.94, off_season_price: 59.87,
      },
      {
        brand: "Jaguar", model: "e-pace", stock: 1,
        peak_season_price: 120.54, mid_season_price: 91.35, off_season_price: 70.27,
      },
      {
        brand: "Mercedes", model: "Vito", stock: 2,
        peak_season_price: 109.16, mid_season_price: 89.64, off_season_price: 64.97,
      },
    ];

    await Car.bulkCreate(cars);
    console.log("Seeded car data successfully");
  } catch (err) {
    console.error("Error seeding car data:", err);
  }
}
