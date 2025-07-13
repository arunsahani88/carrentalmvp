import express from "express";
import { createBooking } from "../controllers/bookingsController";

const router = express.Router();

// POST /bookings
router.post('/', createBooking);

export default router;
