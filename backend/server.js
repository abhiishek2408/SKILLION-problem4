import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import config from "./config.js";

import authRoutes from "./routes/auth.js";
import coursesRoutes from "./routes/courses.js";
import lessonsRoutes from "./routes/lessons.js";
import enrollRoutes from "./routes/enroll.js";
import certificateRoutes from "./routes/certificate.js";

import creatorsRoutes from "./routes/creators.js";
import adminRoutes from "./routes/admin.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/users.js";

import rateLimit from "express-rate-limit";

const app = express();

export const createRateLimiter = (options = {}) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => req.ip,
    ...options,
  });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessions", lessonsRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificate", certificateRoutes);

app.use("/api/creators", creatorsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  if (err && err.body) {
    return res.status(err.status || 400).json(err.body);
  }
  console.error(err);
  res.status(err.status || 500).json({
    error: { code: "INTERNAL_ERROR", message: err.message || "Server error" },
  });
});

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

const startServer = async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  });
};

startServer();
