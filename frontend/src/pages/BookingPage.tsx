import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createBooking, getAvailableCars } from "../api/api";
import type { BookingFormData, Car } from "../types";
import { useNavigate, useLocation } from "react-router-dom";

// Utility to get today's and 7-days-later dates
const getDateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

const today = getDateString(0);
const oneWeekLater = getDateString(7);

// Validation schema
const schema = yup.object().shape({
  start_date: yup.string().required("Start date is required"),
  end_date: yup
    .string()
    .required("End date is required")
    .test(
      "end-after-start",
      "End date must be at least 7 days after start date",
      function (value) {
        const start = new Date(this.parent.start_date);
        const end = new Date(value || "");
        return end > start && (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) >= 7;
      }
    ),
  car_id: yup
    .number()
    .typeError("Car must be selected")
    .required("Car is required")
    .min(1, "Please select a valid car"),
  user: yup.object({
    name: yup.string().required("Name is required"),
    driving_license_valid_until: yup.string().required("Driving license validity date is required"),
    driving_license_number: yup
      .string()
      .required("Driving license number is required")
      .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, "Invalid format. Example: MH12AB1234"),
  }),
});

export default function BookingPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCarId = location.state?.carId ?? "";

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<BookingFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      start_date: today,
      end_date: oneWeekLater,
      car_id: preselectedCarId,
      user: {
        name: "",
        driving_license_number: "",
        driving_license_valid_until: "",
      },
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  useEffect(() => {
    const fetchCars = async () => {
      if (startDate && endDate) {
        setLoadingCars(true);
        try {
          const res = await getAvailableCars(startDate, endDate);
          setCars(res.data || []);
        } catch (err) {
          console.error("Failed to fetch available cars", err);
        } finally {
          setLoadingCars(false);
        }
      }
    };
    fetchCars();
  }, [startDate, endDate]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBooking(data);
      reset();
      navigate("/", { state: { name: data.user.name } });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error err is possibly AxiosError
        alert("Error: " + (err.response?.data?.message || "Unknown error"));
      } else {
        alert("Unexpected error");
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Car Rental</a>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h3 className="text-center mb-4">Book a Car</h3>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label htmlFor="start_date" className="form-label">Start Date</label>
              <input id="start_date" type="date" {...register("start_date")} className="form-control" />
              <div className="form-text text-danger">{errors.start_date?.message}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="end_date" className="form-label">End Date</label>
              <input id="end_date" type="date" {...register("end_date")} className="form-control" />
              <div className="form-text text-danger">{errors.end_date?.message}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="car_id" className="form-label">Select Car</label>
              <Controller
                name="car_id"
                control={control}
                render={({ field }) => (
                  <select
                    id="car_id"
                    {...field}
                    className="form-select"
                    disabled={loadingCars || cars.length === 0}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  >
                    <option value="">-- Select --</option>
                    {cars.map((car) => (
                      <option key={`car-${car.id}`} value={car.id}>
                        {car.brand} {car.model} ({car.stock} left)
                      </option>
                    ))}
                  </select>
                )}
              />
              <div className="form-text text-danger">{errors.car_id?.message}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">Your Name</label>
              <input id="user_name" {...register("user.name")} className="form-control" />
              <div className="form-text text-danger">{errors.user?.name?.message}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="license_number" className="form-label">Driving License Number</label>
              <input
                id="license_number"
                {...register("user.driving_license_number")}
                className="form-control"
                placeholder="E.g. MH12AB1234"
              />
              <div className="form-text text-danger">
                {errors.user?.driving_license_number?.message}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="license_valid_until" className="form-label">Driving License Valid Until</label>
              <input
                id="license_valid_until"
                type="date"
                {...register("user.driving_license_valid_until")}
                className="form-control"
              />
              <div className="form-text text-danger">
                {errors.user?.driving_license_valid_until?.message}
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isValid || loadingCars || cars.length === 0}
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
