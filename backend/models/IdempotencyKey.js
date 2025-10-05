import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId },
  responseBody: { type: Object }, 
  statusCode: { type: Number },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("IdempotencyKey", schema);
