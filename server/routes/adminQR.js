const express = require("express");
const router = express.Router();
const QR = require("../model/qr");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const authenticateAdmin = require("../middleware/authenticateToken"); // JWT middleware

require("dotenv").config();

// GET /adminqr/list → fetch all QR codes
router.get("/list", authenticateAdmin, async (req, res) => {
    try {
        const qrList = await QR.find().populate("petId");
        res.json(qrList.map(qr => ({
            _id: qr._id,
            code: qr.code,
            shortUrl: qr.redirectUrl,
            qrImage: qr.qrImage || null, // include qrImage if stored (optional)
            isActivated: qr.isActivated,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch QR codes" });
    }
});

// POST /adminqr/generate/:count → generate QR bundle
router.post("/generate/:count", authenticateAdmin, async (req, res) => {
    try {
        const count = parseInt(req.params.count);
        const qrList = [];
        const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

        for (let i = 0; i < count; i++) {
            const code = uuidv4().slice(0, 8); // short unique code
            const redirectUrl = `${frontendUrl}/register/${code}`;

            // Save QR in DB first
            const qrDoc = await QR.create({ code, redirectUrl });

            // Generate QR image in base64
            const qrImage = await QRCode.toDataURL(`${backendUrl}/qr/${code}`);

            // SAVE the QR image in the database
            qrDoc.qrImage = qrImage;
            await qrDoc.save();

            // Add to response
            qrList.push({
                _id: qrDoc._id,
                code,
                shortUrl: `${backendUrl}/qr/${code}`,
                qrImage,          // now frontend can use this
                isActivated: qrDoc.isActivated,
            });
        }


        res.json({ message: "QR bundle generated", qrList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate QR codes" });
    }
});

module.exports = router;
