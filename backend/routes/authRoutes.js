import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

// Router responsible for user authentication (register + login) endpoints.
const router = express.Router();

// POST /api/auth/register -> create a new user account.
router.post("/register", registerUser);

// POST /api/auth/login -> authenticate and return a JWT.
router.post("/login", loginUser);

export default router;
