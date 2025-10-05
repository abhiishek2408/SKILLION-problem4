import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import idempotency from "../middleware/idempotency.js";
import Course from "../models/Course.js";

const router = express.Router();
const limiter = createRateLimiter();
router.use(limiter);


router.post(
  "/add-course",
  requireAuth,
  requireRole("Creator"),
  idempotency(),
  async (req, res, next) => {
    try {
      const { title, description } = req.body;
      if (!title)
        return res.status(400).json({
          error: {
            code: "FIELD_REQUIRED",
            field: "title",
            message: "Title required",
          },
        });

      const course = await Course.create({
        title,
        description,
        creatorId: req.user._id,
      });

      res.status(201).json({ message: "Course created successfully", course });
    } catch (e) {
      next(e);
    }
  }
);


router.get("/my-courses", requireAuth, requireRole("Creator"), async (req, res, next) => {
  try {
    const courses = await Course.find({ creatorId: req.user._id });
    res.json({ count: courses.length, courses });
  } catch (e) {
    next(e);
  }
});


router.put("/update-course/:id", requireAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Course not found" },
      });

    if (
      !req.user._id.equals(course.creatorId) &&
      req.user.role.toLowerCase() !== "admin"
    )
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Not allowed" },
      });

    course.title = req.body.title ?? course.title;
    course.description = req.body.description ?? course.description;

    await course.save();
    res.json({ message: "Course updated successfully", course });
  } catch (e) {
    next(e);
  }
});


router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Course not found" },
      });

    if (
      !req.user._id.equals(course.creatorId) &&
      req.user.role.toLowerCase() !== "admin"
    )
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Not allowed" },
      });

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (e) {
    next(e);
  }
});


router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit || 20));
    const offset = parseInt(req.query.offset || 0);

    const items = await Course.find({ published: true })
      .skip(offset)
      .limit(limit)
      .sort({ publishedAt: -1 });

    const next_offset = items.length === limit ? offset + limit : null;
    res.json({ count: items.length, items, next_offset });
  } catch (e) {
    next(e);
  }
});


router.get("/course-detail/:id", requireAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Course not found" },
      });


    if (
      !course.published &&
      !req.user._id.equals(course.creatorId) &&
      req.user.role.toLowerCase() !== "admin"
    )
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Not allowed" },
      });

    res.json({ course });
  } catch (e) {
    next(e);
  }
});




router.get(
  "/unpublished",
  requireAuth,
  requireRole("Admin"),
  async (req, res, next) => {
    try {
      const courses = await Course.find({ published: false }).sort({
        createdAt: -1,
      });
      res.json({ count: courses.length, courses });
    } catch (e) {
      next(e);
    }
  }
);


router.put(
  "/publish/:id",
  requireAuth,
  requireRole("Admin"),
  async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course)
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Course not found" },
        });

      course.published = true;
      course.publishedAt = new Date();
      await course.save();

      res.json({ message: "Course published successfully", course });
    } catch (e) {
      next(e);
    }
  }
);


export default router;
