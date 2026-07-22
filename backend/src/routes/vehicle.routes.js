import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeAdmin from "../middleware/admin.middleware.js";

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

function hasRequiredVehicleFields({
  make,
  model,
  category,
  price,
  quantity,
}) {
  return (
    make &&
    model &&
    category &&
    price !== undefined &&
    quantity !== undefined
  );
}

function isValidQuantity(quantity) {
  return Number.isInteger(quantity) && quantity >= 0;
}

function isValidPrice(price) {
  return (
    typeof price === "number" &&
    !Number.isNaN(price) &&
    price > 0
  );
}

function isValidId(id) {
  return /^[1-9]\d*$/.test(id);
}

/* ===========================
   CREATE VEHICLE
=========================== */

router.post("/", authenticate, async (req, res) => {
  try {
    if (!hasRequiredVehicleFields(req.body)) {
      return res.status(400).json({
        message:
          "Make, model, category, price and quantity are required",
      });
    }

    if (!isValidPrice(req.body.price)) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    if (!isValidQuantity(req.body.quantity)) {
      return res.status(400).json({
        message:
          "Quantity must be a non-negative integer",
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

/* ===========================
   GET ALL VEHICLES
=========================== */

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

/* ===========================
   SEARCH
=========================== */

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

/* ===========================
   UPDATE
=========================== */

router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    if (!hasRequiredVehicleFields(req.body)) {
      return res.status(400).json({
        message:
          "Make, model, category, price and quantity are required",
      });
    }

    if (!isValidPrice(req.body.price)) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }

    if (!isValidQuantity(req.body.quantity)) {
      return res.status(400).json({
        message:
          "Quantity must be a non-negative integer",
      });
    }

    const vehicle = await updateVehicle(id, req.body);

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

/* ===========================
   DELETE (ADMIN ONLY)
=========================== */

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Invalid vehicle ID",
        });
      }

      const vehicle = await deleteVehicle(id);

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
  }
);

/* ===========================
   PURCHASE
=========================== */

router.post(
  "/:id/purchase",
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Invalid vehicle ID",
        });
      }

      const vehicle = await purchaseVehicle(id);

      if (vehicle) {
        return res.json(vehicle);
      }

      const existingVehicle =
        await findVehicleById(id);

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
  }
);

/* ===========================
   RESTOCK (ADMIN ONLY)
=========================== */

router.post(
  "/:id/restock",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Invalid vehicle ID",
        });
      }

      const { quantity } = req.body;

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a positive integer",
        });
      }

      const vehicle = await restockVehicle(
        id,
        quantity
      );

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
  }
);

export default router;
