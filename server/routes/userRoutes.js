const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Profile = require("../model/profile");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authenticateToken = require("../middleware/authenticateToken");
const { getAllProfiles } = require("../controller/profileController");

// ✅ REGISTER
router.post("/register", async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                status: false,
                message: "Name, email, password and role are required",
            });
        }

        role = role.toLowerCase();

        // Check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "User is already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        // Create profile only for users (ignore doctors)
        const profile = new Profile({
            userId: newUser._id,
            name,
            email,
            phone: "",
            address: "",
            city: "",
            state: "",
        });
        await profile.save();
        console.log("User profile created");

        return res.status(200).json({
            status: true,
            message: "Registration successful",
            role,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});
  




// ✅ LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                status: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        // Remove password before sending response
        const { password: pwd, ...userData } = user._doc;

        return res.status(200).json({
            status: true,
            message: "Login successful",
            user: userData,
            token,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

// ✅ GET PROFILE (from token)
router.post("/profile", async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token)
            return res.status(400).json({
                status: false,
                message: "Access denied. No token provided.",
            });

        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid or expired token",
                });
            }

            const user = await User.findById(decode?.id);
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User not found",
                });
            }

            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            return res.status(200).json({
                status: true,
                message: "Profile data fetched successfully",
                data: userData,
            });
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

// ✅ GET ALL PROFILES
router.get("/all", authenticateToken, getAllProfiles);

module.exports = router;
