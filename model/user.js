const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name:{ type: String, default: null},
    last_name:{ type: String, default:null },
    email:{ type: String, unique:true},
    password:{ type: String},
    phone:{type:String,unique:true,required:true},
    profile_picture:{type:String, default:null},
    identification_number:{type:String, default:null},
    date_of_birth:{type:String, default:null},
    gender:{type:String, default:null},
    id_verified:{type:String, default:false},
    token: { type: String}, 
});

module.exports  = mongoose.model("user", userSchema);