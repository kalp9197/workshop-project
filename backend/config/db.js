import mongoose from "mongoose";

/**
 * Connect to MongoDB using the URI defined in environment variables.
 *
 * This is called once during server startup. If the initial connection
 * cannot be established, the process exits with a non‑zero status so
 * the failure is loud and visible in workshop demos.
 */
export const connectDB = async () => {
  try {
    // Keep DB connection details in env variables so secrets stay out of code.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
