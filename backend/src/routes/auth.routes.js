import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
} from "../services/auth.service.js";

const router = Router();

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Check existing user
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await createUser(
      name,
      email,
      hashedPassword,
      role
    );

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
