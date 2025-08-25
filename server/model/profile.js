const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },  // Optional fields
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    image: { type: String }, // Base64 string
});

module.exports = mongoose.model("Profile", profileSchema);
