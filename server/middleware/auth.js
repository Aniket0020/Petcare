const express = require("express");
const router = express.Router();
const User = require("../model/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require('dotenv').config();

// 🔹 Send reset link
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 mins
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        // Configure mail (example with Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {

                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,

            },
        });

        await transporter.sendMail({
            from: `"PetCare Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "PetCare Password Reset Request",
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hello ${user.name},</h2>
      <p>We received a request to reset your password for your <strong>PetCare</strong> account.</p>
      <p>Click the button below to reset your password. This link will expire in <strong>15 minutes</strong>.</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br/>The PetCare Team 🐾</p>
    </div>
  `,
        });

        res.json({ message: "Password reset link sent to your email." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Reset password
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can log in now." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
