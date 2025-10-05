import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/email.js";
import { ApiError } from "../utils/errors.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email) throw ApiError("FIELD_REQUIRED", "Email is required", "email", 400);
    if (!password) throw ApiError("FIELD_REQUIRED", "Password is required", "password", 400);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw ApiError("USER_EXISTS", "User with email exists", "email", 400);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      emailVerified: false
    });

  
    await sendVerificationEmail(user.email, user._id);

    res.json({ id: user._id, email: user.email, message: "Registered. Check your email to verify." });
  } catch (err) {
    next(err);
  }
});


router.post("/resend-verification", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw ApiError("FIELD_REQUIRED", "Email required", "email", 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw ApiError("USER_NOT_FOUND", "No user with this email", "email", 404);
    if (user.emailVerified) return res.json({ message: "Email already verified" });

    await sendVerificationEmail(user.email, user._id);

    res.json({ message: "Verification email resent" });
  } catch (err) {
    next(err);
  }
});


router.get("/verify/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token is required" });


    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });


    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }


    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(400).json({ error: "Invalid or expired verification token" });
  }
});



router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw ApiError("FIELD_REQUIRED", "Email/password required", null, 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw ApiError("INVALID_CREDENTIALS", "Invalid credentials", null, 401);

    const ok = await user.comparePassword(password);
    if (!ok) throw ApiError("INVALID_CREDENTIALS", "Invalid credentials", null, 401);

    if (!user.emailVerified)
      return res.status(403).json({ message: "Please verify your email before logging in." });

    const token = jwt.sign({ sub: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
