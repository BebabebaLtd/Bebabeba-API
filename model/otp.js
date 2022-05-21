const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phone:{type:String,  default:''},
    otp:{type:String, default:''},
});

module.exports  = mongoose.model("otp", otpSchema);