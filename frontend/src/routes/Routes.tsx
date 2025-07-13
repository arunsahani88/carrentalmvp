import { Routes, Route } from "react-router-dom";
import CarsPage from "../pages/CarsPage";
import BookingPage from "../pages/BookingPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<CarsPage />} />
    <Route path="/book" element={<BookingPage />} />
  </Routes>
);

export default AppRoutes;
