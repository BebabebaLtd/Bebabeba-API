const mongoose = require("mongoose");

const travelerSchema = new mongoose.Schema({
    user_id:{type:String, default:null},
    first_name:{ type: String, default: null},
    last_name:{ type: String, default:null },
    email:{ type: String, unique:true},
    devToken:{type:String, default:''},
    phone:{type:String,unique:true,default:''},
    distance:{type:String, default:0},
    duration:{type:Number, default:0},
    cost:{type:Number, default:0},
    currentRideId:{type:String, default:''},
    origin:{type:Array},
    destination:{type:Array},
    mode:{type:String, default:'Passenger'},
    departure:{type:Date, default:null},
    directions:{type:String, default:''}
});

module.exports  = mongoose.model("traveler", travelerSchema);