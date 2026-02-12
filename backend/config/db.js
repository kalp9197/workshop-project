import mongoose from "mongoose";

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
