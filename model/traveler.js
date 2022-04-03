const mongoose = require("mongoose");

const travelerSchema = new mongoose.Schema({
    first_name:{ type: String, default: null},
    last_name:{ type: String, default:null },
    email:{ type: String, unique:true},
    id:{type:String, unique:true, default:''},
    devToken:{type:String, default:''},
    phone:{type:String,unique:true,required:true, default:''},
    distance:{type:Number, default:0},
    duration:{type:Number, default:0},
    cost:{type:Number, default:0},
    currentRideId:{type:String, default:''},
    location:{type:Object},
    mode:{type:String, default:''},
    departure:{type:Date, default:null},
    directions:{type:String, default:''}
});

module.exports  = mongoose.model("traveler", travelerSchema);