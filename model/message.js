const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderid:{type:String, unique:true, default:''},
    messagetext:{type:String, default:''},
    messagetime:{type:Date, default:Date.now()},
    rideid:{type:String, default:''}
});

module.exports  = mongoose.model("message", messageSchema);