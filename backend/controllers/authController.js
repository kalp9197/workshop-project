import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Create a signed JWT for the given user id.
 *
 * The token payload is intentionally small so it fits cleanly in headers
 * and is easy to inspect in workshop demos.
 *
 * @param {string} userId - MongoDB ObjectId of the user.
 * @returns {string} A signed JWT string.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

/**
 * Register a new user.
 *
 * Validates the incoming email/password, ensures the email is unique,
 * then creates a new User document and returns a JWT for immediate login.
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Authenticate an existing user and return a JWT.
 *
 * Verifies the email exists and that the provided password matches the
 * stored hash using the User model's comparePassword helper.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
