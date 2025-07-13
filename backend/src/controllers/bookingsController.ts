import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { User } from "../models/user.model";
import { Car } from "../models/car.model";
import { Op } from "sequelize";
import { getSeasonForDate } from "../utils/seasons";

export const createBooking = async (req: Request, res: Response) => {
  const { user, car_id, start_date, end_date } = req.body;

  if (!user?.name || !user?.driving_license_number) {
    return res.status(400).json({
      error: "User name and driving license number are required",
    });
  }

  const today = new Date().toISOString().split("T")[0];
  if (start_date < today || end_date < today) {
    return res.status(400).json({
      error: "Booking cannot be made for past dates",
    });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({
      error: "Start date cannot be after end date",
    });
  }

  const car = await Car.findByPk(car_id);
  if (!car) return res.status(404).json({ error: "Car not found" });

  let dbUser = await User.findOne({
    where: {
      name: user.name,
      driving_license_number: user.driving_license_number,
    },
  });

  if (!dbUser) {
    dbUser = await User.create(user);
  }

  if (new Date(dbUser.driving_license_valid_until) < new Date(end_date)) {
    return res.status(400).json({
      error: "Driving license not valid through booking period",
    });
  }

  const overlapping = await Booking.findOne({
    where: {
      user_id: dbUser.id,
      [Op.or]: [
        { start_date: { [Op.between]: [start_date, end_date] } },
        { end_date: { [Op.between]: [start_date, end_date] } },
        {
          start_date: { [Op.lte]: start_date },
          end_date: { [Op.gte]: end_date },
        },
      ],
    },
  });

  if (overlapping) {
    return res.status(400).json({ error: "User already has a booking during this period" });
  }

  const count = await Booking.count({
    where: {
      car_id,
      [Op.or]: [
        { start_date: { [Op.between]: [start_date, end_date] } },
        { end_date: { [Op.between]: [start_date, end_date] } },
        {
          start_date: { [Op.lte]: start_date },
          end_date: { [Op.gte]: end_date },
        },
      ],
    },
  });

  if (count >= car.stock) {
    return res.status(400).json({ error: "Car not available" });
  }

  const current = new Date(start_date);
  const season = getSeasonForDate(current.toISOString().split("T")[0]);
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

  const booking = await Booking.create({
    car_id,
    user_id: dbUser.id,
    start_date,
    end_date,
    total_price: price,
  });

  await car.update({ stock: car.stock - 1 });

  res.status(201).json(booking);
};