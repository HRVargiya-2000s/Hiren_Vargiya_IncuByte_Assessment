import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  createVehicle,
  deleteVehicle,
  findVehicleById,
  getAllVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from "../services/vehicle.service.js";

const router = Router();

function hasRequiredVehicleFields({ make, model, category, price, quantity }) {
  return make && model && category && price !== undefined && quantity !== undefined;
}

function isValidQuantity(quantity) {
  return Number.isInteger(quantity) && quantity >= 0;
}

router.post("/", authenticate, async (req, res) => {
  try {
    if (!hasRequiredVehicleFields(req.body)) {
      return res.status(400).json({
        message: "Make, model, category, price, and quantity are required",
      });
    }

    if (!isValidQuantity(req.body.quantity)) {
      return res.status(400).json({
        message: "Quantity must be a non-negative integer",
      });
    }

    const vehicle = await createVehicle(req.body);

    return res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const vehicles = await getAllVehicles();

    return res.json(vehicles);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/search", authenticate, async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const vehicles = await searchVehicles(searchTerm);

    return res.json(vehicles);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (!hasRequiredVehicleFields(req.body)) {
      return res.status(400).json({
        message: "Make, model, category, price, and quantity are required",
      });
    }

    if (!isValidQuantity(req.body.quantity)) {
      return res.status(400).json({
        message: "Quantity must be a non-negative integer",
      });
    }

    const vehicle = await updateVehicle(req.params.id, req.body);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.json(vehicle);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const vehicle = await deleteVehicle(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/:id/purchase", authenticate, async (req, res) => {
  try {
    const vehicle = await purchaseVehicle(req.params.id);

    if (vehicle) {
      return res.json(vehicle);
    }

    const existingVehicle = await findVehicleById(req.params.id);

    if (!existingVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(400).json({
      message: "Vehicle quantity is 0",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/:id/restock", authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const vehicle = await restockVehicle(req.params.id, quantity);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.json(vehicle);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
