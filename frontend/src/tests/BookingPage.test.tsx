import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingPage from '../pages/BookingPage';
import { BrowserRouter } from 'react-router-dom';
import { createBooking, getAvailableCars } from '../api/api';

jest.mock('../api/api');

const mockCars = [
  { id: 1, brand: 'Toyota', model: 'Yaris', stock: 3, price: 300 },
  { id: 2, brand: 'Honda', model: 'City', stock: 2, price: 400 },
];

describe('BookingPage', () => {
  beforeEach(() => {
    (getAvailableCars as jest.Mock).mockResolvedValue({ data: mockCars });
    (createBooking as jest.Mock).mockResolvedValue({});
  });

  it('should submit booking form', async () => {
    render(
      <BrowserRouter>
        <BookingPage />
      </BrowserRouter>
    );

    // Wait for car dropdown to be enabled
    const carSelect = await screen.findByLabelText(/Select Car/i);
    await waitFor(() => expect(carSelect).toBeEnabled());

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: '2025-07-14' },
    });

    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: '2025-07-21' },
    });

    fireEvent.change(screen.getByLabelText(/Select Car/i), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/Driving License Number/i), {
      target: { value: 'MH12AB1234' },
    });

    fireEvent.change(screen.getByLabelText(/Driving License Valid Until/i), {
      target: { value: '2026-12-31' },
    });

    // Wait for validation and form to be enabled
    const submitBtn = screen.getByRole('button', { name: /Book Now/i });
    await waitFor(() => expect(submitBtn).toBeEnabled());

    // Click submit
    fireEvent.click(submitBtn);

    // Verify API call
    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: '2025-07-14',
          end_date: '2025-07-21',
          car_id: 1,
          user: expect.objectContaining({
            name: 'John Doe',
            driving_license_number: 'MH12AB1234',
            driving_license_valid_until: '2026-12-31',
          }),
        })
      );
    });
  });
});
