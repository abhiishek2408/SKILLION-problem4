import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import { generateTranscript } from "../utils/transcript.js";
import idempotency from "../middleware/idempotency.js";

const router = express.Router();


router.post("/:courseId/lessons", requireAuth, requireRole("Creator"), idempotency(), async (req, res, next) => {
  try {
    const { title, description, videoUrl, order } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not found" }});
    if (!req.user._id.equals(course.creatorId) && req.user.role !== "Admin")
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" }});

    const lesson = await Lesson.create({ courseId: course._id, title, description, videoUrl, order });

    const transcript = await generateTranscript(lesson);
    lesson.transcript = transcript;
    await lesson.save();

    course.lessonsCount = await Lesson.countDocuments({ courseId: course._id });
    await course.save();

    res.json({ lesson });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: { code: "ORDER_TAKEN", field: "order", message: "Lesson order must be unique for the course" }});
    next(e);
  }
});


router.get("/get-all-lesson/:courseId", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Course not found" }});

    const limit = Math.min(200, parseInt(req.query.limit || 100));
    const offset = parseInt(req.query.offset || 0);

    const items = await Lesson.find({ courseId: course._id })
      .sort({ order: 1 })
      .skip(offset)
      .limit(limit);

    const next_offset = items.length === limit ? offset + limit : null;
    res.json({ items, next_offset });
  } catch (e) {
    next(e);
  }
});




router.get("/get-all-lessons", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const limit = Math.min(200, parseInt(req.query.limit || 100));
    const offset = parseInt(req.query.offset || 0);

    const items = await Lesson.find({})
      .sort({ order: 1 })
      .skip(offset)
      .limit(limit)
      .populate("courseId", "title");

    const next_offset = items.length === limit ? offset + limit : null;
    res.json({ items, next_offset });
  } catch (e) {
    next(e);
  }
});


router.put("/update-lesson/:id", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found" }});

    const course = await Course.findById(lesson.courseId);
    if (!req.user._id.equals(course.creatorId) && req.user.role !== "Admin")
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" }});

    lesson.title = req.body.title ?? lesson.title;
    lesson.description = req.body.description ?? lesson.description;
    lesson.videoUrl = req.body.videoUrl ?? lesson.videoUrl;
    lesson.order = req.body.order ?? lesson.order;

    await lesson.save();
    res.json({ message: "Lesson updated successfully", lesson });
  } catch (e) {
    if (e.code === 11000)
      return res.status(400).json({ error: { code: "ORDER_TAKEN", field: "order", message: "Lesson order must be unique for the course" }});
    next(e);
  }
});



router.put("/update-lesson/:id", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found" }});

    const course = await Course.findById(lesson.courseId);
    if (!req.user._id.equals(course.creatorId) && req.user.role !== "Admin")
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" }});

    lesson.title = req.body.title ?? lesson.title;
    lesson.description = req.body.description ?? lesson.description;
    lesson.videoUrl = req.body.videoUrl ?? lesson.videoUrl;
    lesson.order = req.body.order ?? lesson.order;

    await lesson.save();
    res.json({ message: "Lesson updated successfully", lesson });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: { code: "ORDER_TAKEN", field: "order", message: "Lesson order must be unique for the course" }});
    next(e);
  }
});


router.delete("/delete-lesson/:id", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found" }});

    const course = await Course.findById(lesson.courseId);
    if (!req.user._id.equals(course.creatorId) && req.user.role !== "Admin")
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" }});

    await lesson.deleteOne();
    course.lessonsCount = await Lesson.countDocuments({ courseId: course._id });
    await course.save();

    res.json({ message: "Lesson deleted successfully" });
  } catch (e) {
    next(e);
  }
});

export default router;
