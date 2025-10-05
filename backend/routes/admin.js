import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import CreatorApplication from "../models/CreatorApplication.js";
import Course from "../models/Course.js";

const router = express.Router();


router.get("/review/creators", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit || 20));
    const offset = parseInt(req.query.offset || 0);
    const items = await CreatorApplication.find({ status: "PENDING" }).skip(offset).limit(limit);
    const next_offset = items.length === limit ? offset + limit : null;
    res.json({ items, next_offset });
  } catch (e) { next(e); }
});


router.post("/review/creators/:id", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const { action } = req.body; // APPROVE | REJECT
    const app = await CreatorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Application not found" }});
    app.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    app.reviewedAt = new Date();
    app.reviewerId = req.user._id;
    await app.save();
    if (app.status === "APPROVED") {
      const user = await (await import("../models/User.js")).default.findById(app.userId);
      if (user) user.role = "Creator", await user.save();
    }
    res.json({ application: app });
  } catch (e) { next(e); }
});


router.post("/publish/course/:id", requireAuth, requireRole("Admin"), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not found" }});
    course.published = true;
    course.publishedAt = new Date();
    await course.save();
    res.json({ course });
  } catch (e) { next(e); }
});

export default router;
