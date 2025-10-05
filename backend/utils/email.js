import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send verification email using JWT
export const sendVerificationEmail = async (email, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

  const html = `
    <p>Hi,</p>
    <p>Click the link below to verify your account:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>If you did not register, ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your account",
    html,
  });

  console.log("Verification email sent to", email);
};
