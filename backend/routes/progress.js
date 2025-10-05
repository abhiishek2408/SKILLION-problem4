import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import crypto from "crypto";

const router = express.Router();


router.post("/:courseId/lessons/:lessonId/complete", requireAuth, async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Lesson not found" }});
    if (!lesson.courseId.equals(courseId)) return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Lesson doesn't belong to course" }});
  
    const ProgressModel = Progress;
    let progress = await ProgressModel.findOne({ userId: req.user._id, courseId });
    if (!progress) {
      progress = await ProgressModel.create({ userId: req.user._id, courseId, completedLessonIds: [] });
    }
    if (!progress.completedLessonIds.find(id => id.equals(lesson._id))) {
      progress.completedLessonIds.push(lesson._id);
      progress.updatedAt = new Date();
      await progress.save();
    }

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completed = progress.completedLessonIds.length;
    const percent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
    let certificate = null;
    if (percent === 100) {
  
      certificate = await Certificate.findOne({ userId: req.user._id, courseId });
      if (!certificate) {
        const serial = crypto.createHash("sha256").update(String(req.user._id) + String(courseId) + Date.now()).digest("hex");
        certificate = await Certificate.create({ userId: req.user._id, courseId, serial });
      }
    }
    res.json({ percent, certificate });
  } catch (e) { next(e); }
});


router.get("/:courseId", requireAuth, async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ userId: req.user._id, courseId: req.params.courseId });
    const totalLessons = await Lesson.countDocuments({ courseId: req.params.courseId });
    const completed = progress ? progress.completedLessonIds.length : 0;
    const percent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
    res.json({ percent, completed, totalLessons });
  } catch (e) { next(e); }
});






router.get("/:courseId", requireAuth, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = await Progress.create({ userId, courseId, completedLessonIds: [] });
    }

    res.json(progress);
  } catch (err) {
    console.error("Failed to get progress:", err);
    next(err);
  }
});


router.post("/:courseId/toggle", requireAuth, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;
    const userId = req.user._id;

    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

  
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });


    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = await Progress.create({ userId, courseId, completedLessonIds: [] });
    }


    const completedSet = new Set(progress.completedLessonIds.map(id => id.toString()));
    if (completedSet.has(lessonId)) completedSet.delete(lessonId);
    else completedSet.add(lessonId);

    progress.completedLessonIds = Array.from(completedSet);
    progress.updatedAt = new Date();
    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error("Failed to toggle lesson progress:", err);
    next(err);
  }
});


export default router;
