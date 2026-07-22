import express from "express";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Car Dealership Inventory API is running 🚗",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

export default app;