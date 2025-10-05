import mongoose from "mongoose";

const schema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  order: { type: Number, required: true },
  transcript: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});


schema.index({ courseId: 1, order: 1 }, { unique: true });

export default mongoose.model("Lesson", schema);
