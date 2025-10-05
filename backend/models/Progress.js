import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  updatedAt: { type: Date, default: Date.now }
});
schema.index({ userId: 1, courseId: 1 }, { unique: true });
export default mongoose.model("Progress", schema);
