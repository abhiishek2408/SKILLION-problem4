import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Certificate from "../models/Certificate.js";

const router = express.Router();


router.get("/course/:courseId", requireAuth, async (req, res, next) => {
  const { courseId } = req.params;
  if (!courseId) return res.status(400).json({ error: "courseId is required" });

  try {
    const certificate = await Certificate.findOne({
      userId: req.user._id,
      courseId
    }).populate("userId courseId", "name title");

    if (!certificate) return res.status(404).json({ error: "Certificate not found" });

    res.json({ certificate });
  } catch (err) {
    next(err);
  }
});

export default router;
