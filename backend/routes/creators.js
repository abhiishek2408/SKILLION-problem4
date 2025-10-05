// routes/creatorsRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import CreatorApplication from "../models/CreatorApplication.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();


router.post("/apply", requireAuth, async (req, res, next) => {
  try {
    const { bio } = req.body;
    const existing = await CreatorApplication.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Application already submitted", application: existing });
    }

    const application = await CreatorApplication.create({ userId: req.user._id, bio });
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    next(err);
  }
});


router.get("/my-application", requireAuth, async (req, res, next) => {
  try {
    const application = await CreatorApplication.findOne({ userId: req.user._id });
    if (!application) return res.status(404).json({ message: "No application found" });
    res.json({ application });
  } catch (err) {
    next(err);
  }
});


router.get("/dashboard", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const courses = await Course.find({ creatorId: req.user._id });
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});


router.get("/applications", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const applications = await CreatorApplication.find()
      .populate("userId", "name email")
      .sort({ submittedAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (err) {
    next(err);
  }
});


router.get("/applications/pending", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const applications = await CreatorApplication.find({ status: "PENDING" })
      .populate("userId", "name email")
      .sort({ submittedAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (err) {
    next(err);
  }
});


router.put("/applications/:id/approve", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const app = await CreatorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status !== "PENDING") return res.status(400).json({ message: "Application already reviewed" });

    app.status = "APPROVED";
    app.reviewedAt = new Date();
    app.reviewerId = req.user._id;
    await app.save();


    await User.findByIdAndUpdate(app.userId, { role: "Creator" });

    res.json({ message: "Application approved", application: app });
  } catch (err) {
    next(err);
  }
});


router.put("/applications/:id/reject", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const app = await CreatorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status !== "PENDING") return res.status(400).json({ message: "Application already reviewed" });

    app.status = "REJECTED";
    app.reviewedAt = new Date();
    app.reviewerId = req.user._id;
    await app.save();

    res.json({ message: "Application rejected", application: app });
  } catch (err) {
    next(err);
  }
});


router.get("/creators", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const approved = await User.find({ role: "Creator" }).select("name email");
    res.json({ count: approved.length, creators: approved });
  } catch (err) {
    next(err);
  }
});

export default router;
