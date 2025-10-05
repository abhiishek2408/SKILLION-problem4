import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Learner","Creator","Admin"], default: "Learner" },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

schema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", schema);
