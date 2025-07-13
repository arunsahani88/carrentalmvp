import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableCars } from "../api/api";
import type { Car } from "../types";

const getDateString = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};

export default function CarsPage() {
  const [startDate, setStartDate] = useState(() => getDateString(0));
  const [endDate, setEndDate] = useState(() => getDateString(7));
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await getAvailableCars(startDate, endDate);
      setAvailableCars(res.data || []);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching cars", err);
    }
  };

  useEffect(() => {
    fetchCars(); // Auto fetch on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRentClick = () => {
    navigate("/book", {
      state: {
        startDate,
        endDate,
      },
    });
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand mb-0 h1">Car Rental</span>
      </nav>

      <div className="d-flex justify-content-center">
        <div className="card shadow p-4 mt-4 w-100" style={{ maxWidth: "1000px" }}>
          <h3 className="text-center mb-4">Check Car Availability</h3>

          <div className="row g-3 mb-4 justify-content-center">
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-primary" onClick={fetchCars}>
                Search
              </button>
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success" onClick={handleRentClick} disabled={availableCars.length === 0}>
                Rent a Car
              </button>
            </div>
          </div>

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
                {availableCars.length === 0 ? (
                  searched ? (
                    <tr>
                      <td colSpan={5}>No cars available for selected dates</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={5}>Searching for available cars...</td>
                    </tr>
                  )
                ) : (
                  availableCars.map((car) => (
                    <tr key={car.id}>
                      <td>{car.brand}</td>
                      <td>{car.model}</td>
                      <td>{car.stock}</td>
                      <td>${car.bookingPrice}</td>
                      <td>${car.averagePrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
