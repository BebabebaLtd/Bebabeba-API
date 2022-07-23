const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount:{type:Number,  default:0},
    user_id:{type:String, default:null},
});

module.exports  = mongoose.model("payment", paymentSchema);