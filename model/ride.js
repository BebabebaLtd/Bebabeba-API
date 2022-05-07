const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    
    carpoolers:{type:Array, default:[]},
    navigations:{type:Array, default:[]}
});

module.exports  = mongoose.model("ride", rideSchema);