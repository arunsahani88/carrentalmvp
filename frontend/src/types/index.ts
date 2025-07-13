export interface Car {
  id: number;
  brand: string;
  model: string;
  stock: number;
  bookingPrice: number;
  averagePrice: number
}

export interface Booking {
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
}

export interface User {
  name: string;
  driving_license_number: string,
  driving_license_valid_until: string;
}

export interface BookingFormData {
  user: {
    name: string;
    driving_license_number: string;
    driving_license_valid_until: string;
  };
  car_id: number;
  start_date: string;
  end_date: string;
}



