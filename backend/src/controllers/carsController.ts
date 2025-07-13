import { Request, Response } from "express";
import { Car } from "../models/car.model";
import { Booking } from "../models/booking.model";
import { Op } from "sequelize";
import { getSeasonForDate } from "../utils/seasons";

export const getAvailableCars = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Missing startDate or endDate" });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  const daysCount =
    Math.ceil((+end - +start) / (1000 * 60 * 60 * 24)) + 1;

  const today = new Date().toISOString().split("T")[0];

  const expiredBookings = await Booking.findAll({
    where: {
      end_date: { [Op.lt]: today },
    },
  });

  for (const booking of expiredBookings) {
    const car = await Car.findByPk(booking.car_id);
    if (car) {
      await car.update({ stock: car.stock + 1 });
    }
    await booking.destroy();
  }

  const cars = await Car.findAll();

  const availableCars = await Promise.all(
    cars.map(async (car) => {
      const overlappingBookings = await Booking.count({
        where: {
          car_id: car.id,
          [Op.or]: [
            { start_date: { [Op.between]: [start, end] } },
            { end_date: { [Op.between]: [start, end] } },
            {
              start_date: { [Op.lte]: start },
              end_date: { [Op.gte]: end },
            },
          ],
        },
      });

      const availableStock = car.stock - overlappingBookings;
      if (availableStock <= 0) return null;

      const season = getSeasonForDate(start.toISOString().split("T")[0]);
      let price = 0;

      switch (season) {
        case "peak":
          price = car.peak_season_price;
          break;
        case "mid":
          price = car.mid_season_price;
          break;
        case "off":
          price = car.off_season_price;
          break;
      }
      return {
        id: car.id,
        brand: car.brand,
        model: car.model,
        stock: availableStock,
        bookingPrice: price.toFixed(2),
        averagePrice: price.toFixed(2),
      };
    })
  );

  res.json(availableCars.filter(Boolean));
};
