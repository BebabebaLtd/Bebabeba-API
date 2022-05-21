const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user_id:{type:String,  default:''},
    user_name:{type:String, default:''},
    message:{type:String, default:''},
    time:{type:Date, default:Date.now()},
    ride_id:{type:String, default:''}
});

module.exports  = mongoose.model("message", messageSchema);