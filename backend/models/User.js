import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User schema
 *
 * Stores minimal credentials (email + hashed password) for authenticating
 * into the ScaleMetrics demo. Additional profile fields can be added later
 * without changing how auth works.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Hash password before saving so plain text never reaches the database.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare a candidate password with the stored password hash.
 *
 * @param {string} candidatePassword - Plain text password from the login form.
 * @returns {Promise<boolean>} Resolves true when the password matches.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
