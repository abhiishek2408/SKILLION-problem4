import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  issuedAt: { type: Date, default: Date.now },
  serial: { type: String, required: true, unique: true }
});
export default mongoose.model("Certificate", schema);
