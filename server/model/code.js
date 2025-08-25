const mongoose = require("mongoose")

const codeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    url: { type: String, required: true },
    isActivated: {type:String, require: true}
})


module.exports = mongoose.model("Code", codeSchema);