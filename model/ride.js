const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    driver_id:{type:String, default:""},
    carpoolers:{type:Array, default:[]},
    navigations:{type:Array, default:[]},
    status:{type:String, default:""}
});

module.exports  = mongoose.model("ride", rideSchema);