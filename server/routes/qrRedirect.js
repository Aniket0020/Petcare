const express = require("express");
const router = express.Router();
const QR = require("../model/qr");

// GET /qr/:code → redirect to the target URL
router.get("/:code", async (req, res) => {
    try {
        const qr = await QR.findOne({ code: req.params.code });
        if (!qr) return res.status(404).send("Invalid QR code");

        res.redirect(qr.redirectUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// POST /qr/activate → activate QR with pet profile
router.post("/activate", async (req, res) => {
    const { code, petId } = req.body;

    try {
        const qr = await QR.findOne({ code });
        if (!qr) return res.status(404).json({ message: "Invalid QR code" });
        if (qr.isActivated) return res.status(400).json({ message: "QR already activated" });

        // Link QR to pet and update redirect URL
        qr.petId = petId;
        qr.redirectUrl = `${process.env.FRONTEND_URL}/pet/public/${petId}`; // <-- fixed
        qr.isActivated = true;

        await qr.save();

        res.json({ message: "QR activated successfully", redirectUrl: qr.redirectUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
