const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    petId: { type: String },          // store activated pet profile
    isActivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Code", codeSchema);
