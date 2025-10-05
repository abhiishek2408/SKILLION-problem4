import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  bio: String,
  status: { type: String, enum: ["PENDING","APPROVED","REJECTED"], default: "PENDING" },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
export default mongoose.model("CreatorApplication", schema);
