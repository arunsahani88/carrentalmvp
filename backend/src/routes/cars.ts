import express from "express";
import { getAvailableCars } from "../controllers/carsController";

const router = express.Router();

// GET /cars/availability?startDate=2025-07-01&endDate=2025-07-03
router.get('/availability', getAvailableCars);

export default router;
