import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailFrom: process.env.EMAIL_FROM,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  transcriptApiKey: process.env.TRANSCRIPT_API_KEY || null,
  frontendUrl: "http://localhost:3000"
};
