const mongoose = require("mongoose");

const datetime = Date.now()
const paymentSchema = new mongoose.Schema({
    amount:{type:Number,  default:0},
    user_id:{type:String, default:null},
    recepient_id:{type:String, default:null},
    date:{type:String, default:datetime},
});

module.exports  = mongoose.model("payment", paymentSchema);