import { useEffect, useState } from "react";
import { getAvailableCars } from "../api/api";
import type { Car } from "../types";
import { useNavigate } from "react-router-dom";

// Utility: Get date string with offset days
const getDateString = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [dates, setDates] = useState({ start: getDateString(0), end: getDateString(7) });
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const fetchCars = async (start: string, end: string) => {
    try {
      const res = await getAvailableCars(start, end);
      setCars(res.data || []);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching cars", err);
    }
  };

  // Auto fetch on initial load
  useEffect(() => {
    fetchCars(dates.start, dates.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!dates.start || !dates.end) return;
    fetchCars(dates.start, dates.end);
  };

  const handleRentClick = () => {
    navigate("/book", {
      state: {
        startDate: dates.start,
        endDate: dates.end,
      },
    });
  };

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand mb-0 h1">Car Rental</span>
      </nav>

      {/* Main Section */}
      <div className="d-flex justify-content-center">
        <div className="card shadow p-4 mt-4 w-100" style={{ maxWidth: "1000px" }}>
          <h3 className="text-center mb-4">Check Car Availability</h3>

          {/* Date Filters and Search */}
          <div className="row g-3 mb-4 justify-content-center">
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={dates.start}
                onChange={(e) => setDates({ ...dates, start: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={dates.end}
                onChange={(e) => setDates({ ...dates, end: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success" onClick={handleRentClick} disabled={cars.length === 0}>
                Rent a Car
              </button>
            </div>
          </div>

          {/* Car Table or No Results */}
          {cars.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Stock</th>
                    <th>Booking Price</th>
                    <th>Avg. Day/Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td>{car.brand}</td>
                      <td>{car.model}</td>
                      <td>{car.stock}</td>
                      <td>${car.bookingPrice}</td>
                      <td>${car.averagePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : searched ? (
            <p className="text-center text-muted">No cars available for selected dates.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
