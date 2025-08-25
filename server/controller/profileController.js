const Profile = require("../model/profile");

const getAllProfiles = async (req, res) => {
    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const profiles = await Profile.find();
        res.status(200).json(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: "Failed to fetch profiles", error: error.message });
    }
};

module.exports = { getAllProfiles };
