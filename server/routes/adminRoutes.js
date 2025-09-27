const express = require("express");
const router = express.Router();

const Admin = require("../model/admin");



const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();





router.post("/register", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Validation
        if (!name || !password) {
            return res.status(400).json({
                status: false,
                message: "Name and password are required",
            });
        }

        // Check if admin already exists
        const existing = await Admin.findOne({ name });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Admin already exists",
            });
        }

        // Create admin (password gets hashed automatically in schema)
        const newAdmin = new Admin({ name, password });
        await newAdmin.save();

        return res.status(201).json({
            status: true,
            message: "Admin registered successfully",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
            },
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



router.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        //validation
        if (!name || !password) {
            return res.status(400).json({ status: false, message: "name and password are required" })
        }

        // find admin by name
        const admin = await Admin.findOne({ name });
        if (!admin) {
            return res.status(400).json({
                status: false,
                message: "Invalid name or password"
            })
        }

        //check pass
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Invalid name or password"
            })
        }


        // JWT
        const token = jwt.sign(
            { id: admin._id, nmae: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        return res.status(200).json({
            status: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.log("error during login", error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        })
    }
});





module.exports = router;