require("dotenv").config();
require("./config/database").connect();
// const google = require("googleapis")
const { GOOGLE_CLIENT_ID } = process.env
const { GOOGLE_CLIENT_SECRET } = process.env
const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("./middleware/auth");
const jwt = require('jsonwebtoken')
const app = express();
const passport = require('passport')
const bodyParser = require("body-parser");
const axios = require('axios')

const googleMapDirections = require('./googleMapDirections')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/welcome", (req,res)=>{
    res.status(200).send("Welcome");
});



//import user context
const User = require("./model/user");
const Traveler = require("./model/traveler");
const Message = require("./model/message")
const user = require("./model/user");
const Ride = require("./model/ride");
const Vehicle = require("./model/vehicle")
const decode = require("./decode");
const checkCarpoolViability = require("./checkCarpoolViability")
//Register
app.use("/register", async (req, res) =>{
    ///registration logic comes here
    console.log("first")
    try{
        const{first_name, last_name, email,phone,password} = req.body;


        console.log(req.body)
        //validate user input
        if(!(email&&password&&first_name&&last_name&&phone)){
            return res.status(400).send("All input is required");
        }

        // Check if user is preset
        const usedEmail = await User.findOne({email});

        const usedPhone = await User.findOne({phone});

        if(usedEmail||usedPhone){
            return res.status(409).send("User Already Exist. Please Login")
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        console.log(encryptedPassword);



        const user =  User.create({
            first_name,
            last_name,
            email:email.toLowerCase(),
            phone,
            password:encryptedPassword
        },
        function(err, result){
            console.log(result)
            const traveler = Traveler.create({
                user_id:result._id,
                first_name,
                last_name,
                email:email.toLowerCase(),
                phone,  
            })



            // const token = jwt.sign(
            //     {user_id : result._id, email,first_name,last_name,phone},
            //     process.env.TOKEN_KEY,
            //     {
            //         expiresIn:"2h",
            //     }
            // );

            // user.token = token;

            //return new user
            res.status(201).json(result);
        }
        );

        

     
    }catch(err){
        console.log(err)
    }
});


//Login
app.use("/login", async(req, res)=>{
    ///login logic
    try{
        const { emailorphone, password } = req.body;
        if(!(emailorphone&&password)){
            res.status(400).send("All input is required");
        }
        const userEmail = await User.findOne({emailorphone});
        const userPhone = await User.findOne({emailorphone})

        if((userEmail && (await bcrypt.compare(password, userEmail.password)))|| userPhone && (await bcrypt.compare(password, userPhone.password))){
            const token = jwt.sign(
                {user_id : emailorphone },
                process.env.TOKEN_KEY,
                {
                    expiresIn:"2h",
                }
            );
            userEmail.token = token;

            res.status(200).json(userEmail.token)

        }
        res.status(400).send("Invalid Credentials")

    }
    catch(err){
        console.log(err)

    }
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/distance", async(req, res)=>{
    try{
        const {user_id, distance } = req.body
        console.log(req.body)
        const traveler = await Traveler.findOne({_id});
        console.log(traveler)
        const update = await Traveler.findOneAndUpdate({_id:_id}, {distance:distance})
        // console.log(req.body)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/duration", async(req, res)=>{
    try{
        const {user_id, duration } = req.body
       
        const update = await Traveler.findOneAndUpdate({_id:_id}, {duration:duration})
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/cost", async(req, res)=>{
    try{
        const { user_id, cost } = req.body
        console.log(req.body)
        const traveler = await Traveler.findOne({_id});
        console.log(traveler)
        const update = await Traveler.findOneAndUpdate({_id:_id}, {cost:cost})
        // console.log(req.body)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/mode", async(req, res)=>{
    try{
        const { user_id, mode } = req.body


        const update = await Traveler.findOneAndUpdate({user_id:user_id}, {mode:mode})
         
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})


app.use("/setdirections", async(req, res)=>{
    try{
        const { user_id, mode } = req.body


        const update = await Traveler.findOneAndUpdate({_id:_id}, {directions:directions})
         
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/origin", async(req, res)=>{
    try{
        const { user_id, latitude, longitude } = req.body
        const update = await Traveler.findOneAndUpdate({_id:_id}, {$push:{origin:[latitude, longitude]}})

        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/destination", async(req, res)=>{
    try{
        const { user_id, latitude, longitude } = req.body
        const update = await Traveler.findOneAndUpdate({_id:_id}, {$push:{destination:[latitude, longitude]}})

        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }
    
})

app.use("/departure", async(req, res)=>{
    try{
        const { user_id, departure } = req.body
        const traveler = await Traveler.findOne({_id});
        const update = await Traveler.findOneAndUpdate({_id:_id}, {departure:departure})
        console.log(update)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})


app.use("/devicetoken", async(req, res)=>{
    try{
        const { user_id, devToken } = req.body
        const update = await Traveler.findOneAndUpdate({user_id:user_id}, {devToken:devToken})
        console.log(update)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/setrideid", async(req, res)=>{
    try{
        const { user_id, currentRideId } = req.body
        const traveler = await Traveler.findOne({_id});
        const update = await Traveler.findOneAndUpdate({_id:_id}, {currentRideId:currentRideId})
        console.log(update)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/sendmessage", async(req, res)=>{
    try{
        const { user_id, messagetext, rideid } = req.body

        const message = Message.create({
            senderid:_id,
            messagetext,
            rideid
        })
        console.log(message)
        res.status(200).json(message)

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/createride", async(req, res)=>{
    try{

        const ride = Ride.create({

        })
        console.log(ride)
        res.status(200).json(ride)

    }
    catch(err){
        console.log(err)
    }

    
})


app.use("/register-vehicle", async(req, res)=>{
    try{
        const { user_id, front_image, back_image, left_image, right_image, plate_image, dashboard_image, seats_image} = req.body
        const vehicle = Vehicle.create(req.body,
            function(err, result){
                res.status(200).json(result)

            }
            )
       

    }
    catch(err){
        console.log(err)
    }

    
})

app.use("/addcarpooler", async(req, res)=>{
    try{
        const { _id, carpooler } = req.body
        const ride = await Ride.findOne({_id});
        const update = await Ride.findOneAndUpdate({id:_id}, {$push: {carpoolers: carpooler}})
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }

})

app.use("/getdirections", async(req, res)=>{

    try{
        const { user_id,source_latitude, source_longitude, destination_latitude, destination_longitude } = req.body
        const directions = await googleMapDirections(source_latitude, source_longitude, destination_latitude, destination_longitude)
        const update = await Traveler.findOneAndUpdate({user_id:user_id}, {directions: directions.routes[0].overview_polyline.points})
        const duration = await Traveler.findOneAndUpdate({user_id:user_id}, {duration: directions.routes[0].legs[0].duration.value})
        const distance = await Traveler.findOneAndUpdate({user_id:user_id}, {distance: directions.routes[0].legs[0].distance.value})

    
        
        res.status(200).json(directions)
    }
    catch(err){
        console.log(err)
    }


  
    
})


app.use("/getdrivers", async(req, res)=>{

    const { source_latitude, source_longitude, destination_latitude, destination_longitude } = req.body

    let user = {
                    origin:{
                        latitude:source_latitude,
                        longitude:source_longitude,
                    },
                    destination:{
                        latitude:destination_latitude,
                        longitude:destination_longitude
                    }
                }
    const drivers = Traveler.find({mode: "Driver"}, function(err, result){
        if(err)
        {
            console.log(err)
        }
        else{
            let viableDrivers = []

                result.forEach((driver)=>{

                    let coords = decode(driver.directions)


                    try{

                        let viability = checkCarpoolViability(coords, user)
                        if(viability == true)
                        {
                            viableDrivers.push(driver)
                        }
    
                    }
                    catch(e){
                        throw(e)

                    }
                })

            res.status(200).json(viableDrivers)
        }
    }) 
    });





app.use("/send", require('./notifications/api') )

///For google login
// const googleConfig={
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     redirect: 'http://localhost:4000/auth/google/'
// };

// function createConnection(){
//     return new google.auth.OAuth2(
//         googleConfig.clientId,
//         googleConfig.clientSecret,
//         googleConfig.redirect
//     );
// }
app.use(express.json());

module.exports = app;