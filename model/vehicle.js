const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    user_id:{type:String, default:""},
    front_image:{type:String, default:""},
    back_image:{type:String, default:""},
    left_image:{type:String, default:""},
    right_image:{type:String, default:""},
    plate_image:{type:String, default:""},
    dashboard_image:{type:String, default:""},
    seats_image:{type:String, default:""},
});

module.exports  = mongoose.model("vehicle", vehicleSchema);