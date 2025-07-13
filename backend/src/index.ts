import express from 'express';
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors'; 
import { sequelize } from './models';
import carRoutes from './routes/cars';
import bookingRoutes from './routes/bookings';
import { seedCars } from "./seeders/insertCars";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
export default app;
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

morgan.token('timestamp', () => new Date().toISOString());
app.use(morgan('[:timestamp] :method :url :status - :response-time ms'));

app.use(express.json());
app.use('/cars', carRoutes);
app.use('/bookings', bookingRoutes);

async function startServer() {
  try {
    await sequelize.sync({ force: process.env.NODE_ENV !== "production" });
    console.log("Database synced");

    await seedCars(); // just seed data
    console.log("Car data seeded");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error during app startup:", err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
