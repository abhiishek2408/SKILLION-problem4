import express from "express";
import { requireAuth } from "../middleware/auth.js";
import idempotency from "../middleware/idempotency.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/:courseId/enroll", requireAuth, idempotency(), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || !course.published) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not available" }});
    const en = await Enrollment.findOne({ userId: req.user._id, courseId: course._id });
    if (en) return res.json({ message: "Already enrolled" });
    await Enrollment.create({ userId: req.user._id, courseId: course._id });
    res.json({ message: "Enrolled" });
  } catch (e) { next(e); }
});



router.get("/:courseId/status", requireAuth, async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: req.params.courseId });
    res.json({ enrolled: !!enrollment });
  } catch (e) {
    next(e);
  }
});


router.get("/check/:courseId", requireAuth, async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    res.json({ enrolled: !!enrollment });
  } catch (err) {
    next(err);
  }
});


export default router;
