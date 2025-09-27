// models/qr.js
const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    redirectUrl: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    qrImage: { type: String },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
}, { timestamps: true });

module.exports = mongoose.model("QR", qrSchema);
