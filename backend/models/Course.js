import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  lessonsCount: { type: Number, default: 0 }
});

export default mongoose.model("Course", schema);
