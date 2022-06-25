const mongoose = require("mongoose");
const Pusher = require('pusher');
const Traveler = require("../model/traveler");
const Ride = require("../model/ride");

const { MONGO_URI } = process.env;

const pusher = new Pusher({
    appId      : '1421745',
    key        : '5d04aa1d0893f7e00bb2',
    secret     : '7e159705067585400435',
    cluster    : 'eu',
    encrypted  : true,
});

exports.connect = ()=>{
    mongoose
    .connect(MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('Successfully connected to database')
    })
    .catch((error) => {
        console.log("Database connection failed. exiting now...");
        console.error(error);
        process.exit(1)
    })

}

const db = mongoose.connection
db.once("open", ()=>{
    const coords = db.collection('travelers')
    const ridedets = db.collection("rides")
    const changeStream  = coords.watch()

    // const changeRide = ridedets.watch()
    // changeRide.on('change', async(change)=>{
    //     console.log("These are the changed document id",change.documentKey._id)
    //     pusher.trigger(String(change.documentKey._id), 'updated',change)
    // })

    changeStream.on('change', async(change)=>{
        const task = change.documentKey;
        console.log("This is the driver id",task._id)
        const dr = String(task._id)
        console.log(dr)
        const ride = await Ride.findOne({driver_id:dr, status:"booked"})
        console.log(ride)
        if(ride){
            const driver = await Traveler.findById(ride.driver_id[0])
            trigger(String(ride._id), driver)
        }
        
    })
})

const trigger=(channel, user)=>{
    pusher.trigger(
        channel,
        'updated', 
        user
    );
}