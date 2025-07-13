import axios from "axios";
import type { BookingFormData } from "../types";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const getAvailableCars = (startDate: string, endDate: string) =>
  API.get(`/cars/availability?startDate=${startDate}&endDate=${endDate}`);

export const createBooking = (data: BookingFormData) =>
  API.post("/bookings", data);
