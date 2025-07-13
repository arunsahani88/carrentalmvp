import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CarsPage from "../pages/CarsPage";
import { BrowserRouter } from "react-router-dom";

jest.mock("../api/api", () => ({
  getAvailableCars: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          brand: "Toyota",
          model: "Yaris",
          stock: 2,
          price: 300,
        },
        {
          id: 2,
          brand: "Honda",
          model: "City",
          stock: 3,
          price: 350,
        },
      ],
    })
  ),
}));


describe("CarsPage", () => {
  it("should render available cars after search", async () => {
    render(
      <BrowserRouter>
        <CarsPage />
      </BrowserRouter>
    );

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Toyota")).toBeInTheDocument();
      expect(screen.getByText("Yaris")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
   
    });
  });
});
