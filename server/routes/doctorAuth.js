const express = require("express");
const router = express.Router();
const Doctor = require("../model/Doctor");
const DoctorProfile = require("../model/DoctorProfile")
const authenticateToken = require("../middleware/authenticateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");
require("dotenv").config();

// Doctor Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ status: false, message: "Doctor already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new doctor user
        const newDoctor = new Doctor({ name, email, password: hashedPassword });
        await newDoctor.save();

        // Create doctor profile linked to the doctor user _id
        const doctorProfile = new DoctorProfile({
            vetId: newDoctor._id,  // Link profile to doctor user
            name,
            email,
            phone: "",
            address: "",
            city: "",
            state: "",
        });
        await doctorProfile.save();

        res.status(200).json({ status: true, message: "Doctor registered successfully" });
    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
});


// Doctor Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
            return res.status(401).json({ status: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({  id: doctor._id, email: doctor.email, role: "doctor" }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        res.status(200).json({ status: true, message: "Login successful", doctor, token });
    } catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
});


router.get('/profile', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: 'Invalid token or missing email' });
        }

        const doctorProfile = await DoctorProfile.findOne({ email: req.user.email });

        if (!doctorProfile) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        res.status(200).json(doctorProfile);
    } catch (err) {
        console.error("Error fetching doctor profile:", err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post("/update", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { name, phone, address, city, state } = req.body;

        // Fetch the doctor's profile using email from the decoded token
        const doctorProfile = await DoctorProfile.findOne({ email: req.user.email });

        if (!doctorProfile) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        // Convert image to base64 if provided
        const image = req.file ? req.file.buffer.toString("base64") : undefined;

        // Update the doctor profile fields
        doctorProfile.name = name || doctorProfile.name;
        doctorProfile.phone = phone || doctorProfile.phone;
        doctorProfile.address = address || doctorProfile.address;
        doctorProfile.city = city || doctorProfile.city;
        doctorProfile.state = state || doctorProfile.state;
        if (image) doctorProfile.image = image;

        await doctorProfile.save();

        res.status(200).json({ message: "Doctor profile updated successfully", profile: doctorProfile });

    } catch (error) {
        res.status(500).json({ message: "Error updating doctor profile", error: error.message });
    }
});


module.exports = router;
