const express = require("express");
const router = express.Router();
const Profile = require("../model/profile");
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

const upload = require("../middleware/upload");



// Read profile (email is taken from the decoded token, handled by authenticateToken middleware)
router.get("/get", authenticateToken, async (req, res) => {
    try {
        // Debugging: Check if the token is decoded correctly
        // console.log("Decoded token email:", req.user.email);  // Log the decoded email

        // Check if email is present in the token
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "Invalid token or missing email in token" });
        }

        // Fetch the profile using the email from the token
        const profile = await Profile.findOne({ email: req.user.email });

        // If profile doesn't exist
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }


        res.json(profile);
    } catch (error) {

        res.status(500).json({ message: "Server error", error });
    }
}); 

// Update profile (email is taken from the decoded token, handled by authenticateToken middleware)
router.post("/update", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { name, phone, address, city, state } = req.body;

        // Fetch the profile using email from the decoded token (req.user.email)
        const profile = await Profile.findOne({ email: req.user.email });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        //convert the img to base64 string if provided
        const image = req.file ? req.file.buffer.toString("base64") : undefined;

        // Update the profile fields
        profile.name = name || profile.name;  // If new value is provided, update; otherwise, keep existing
        profile.phone = phone || profile.phone;
        profile.address = address || profile.address;
        profile.city = city || profile.city;
        profile.state = state || profile.state;
        if (image) profile.image = image;


        await profile.save();
        res.status(200).json({ message: "Profile updated successfully", profile });


    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
});

router.get("/all", authenticateToken, async (req, res) => {
    try {
        // Log the decoded user data from the token
        console.log("Decoded user in getAllProfiles:", req.user);

        // If you want to limit access to only users with specific roles, you can check the role here
        // Example: Only "doctor" can fetch all profiles (you can modify this as per your requirement)
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Fetch all profiles from the Profile collection
        const profiles = await Profile.findAll();

        // If no profiles exist
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" });
        }

        // Send the profiles in the response
        res.status(200).json(profiles);
    } catch (error) {
        // Error handling
        res.status(500).json({ message: "Failed to fetch profiles", error: error.message });
    }
});


module.exports = router;
