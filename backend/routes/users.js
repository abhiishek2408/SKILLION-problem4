import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError } from "../utils/errors.js";

const router = express.Router();



router.post("/", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name) throw ApiError("FIELD_REQUIRED", "Name is required", "name", 400);
    if (!email) throw ApiError("FIELD_REQUIRED", "Email is required", "email", 400);
    if (!password) throw ApiError("FIELD_REQUIRED", "Password is required", "password", 400);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw ApiError("USER_EXISTS", "User with this email already exists", "email", 400);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      emailVerified: false,
    });

    res.status(201).json({ message: "User created successfully", user: { ...user.toObject(), passwordHash: undefined } });
  } catch (err) {
    next(err);
  }
});



router.get("/", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    next(err);
  }
});



router.get("/:id", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) throw ApiError("USER_NOT_FOUND", "User not found", "id", 404);
    res.json(user);
  } catch (err) {
    next(err);
  }
});



router.put("/:id", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const { name, email, password, role, emailVerified } = req.body;
    const updateData = { name, role, emailVerified };

    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-passwordHash");
    if (!user) throw ApiError("USER_NOT_FOUND", "User not found", "id", 404);

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    next(err);
  }
});



router.delete("/:id", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw ApiError("USER_NOT_FOUND", "User not found", "id", 404);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
