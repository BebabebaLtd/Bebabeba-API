const mongoose = require("mongoose");

const datetime = String(Date.now())
const walletSchema = new mongoose.Schema({
    user_id:{type:String, default:null},
    subscribed:{type:Boolean, default:false},
    date:{type:String, default:datetime},
    balance:{type:Number, default:0}
});

module.exports  = mongoose.model("wallet", walletSchema);