const express = require('express');
const router = express.Router();
const PetProfile = require("../model/pet");
const Code = require("../model/code");

router.post('/activate', async (req, res) => {
    const { code, petId } = req.body;

    try {
        const qr = await Code.findOne({ code });
        if (!qr) return res.status(404).json({ message: "Invalid activation code" });

        // Check if pet profile exists
        const pet = await PetProfile.findById(petId);
        if (!pet) return res.status(404).json({ message: "Pet profile not found" });

        // Generate the final public pet URL
        const publicUrl = `http://localhost:5173/public/pet/${pet._id}`;

        // Update the QR URL in DB
        qr.url = publicUrl;
        qr.isActivated = "true";
        await qr.save();

        res.status(200).json({
            message: "QR code activated!",
            petProfileUrl: publicUrl
        });
    } catch (err) {
        console.error("Activation failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
