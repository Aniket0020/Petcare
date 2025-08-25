const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
    vetId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    image: {
        type: String, // Base64 image
        required: [false, "Pet image is required"],
    },
});

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);
