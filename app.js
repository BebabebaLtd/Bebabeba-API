require("dotenv").config();
require("./config/database").connect();
// const google = require("googleapis")
const { GOOGLE_CLIENT_ID } = process.env
const { GOOGLE_CLIENT_SECRET } = process.env
const express = require("express");
const auth = require("./middleware/auth");
const jwt = require('jsonwebtoken')
const app = express();
const passport = require('passport')
const bodyParser = require("body-parser");
const axios = require('axios')
const FCM = require('fcm-node')
// const AccessToken = require('twilio').jwt.AccessToken;
// const VoiceGrant = AccessToken.VoiceGrant;
const googleMapDirections = require('./googleMapDirections')



app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/welcome", (req,res)=>{
    res.status(200).send("Welcome");
});

// app.use("/get-twilio-token", async (req,res)=>{
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const client = require('twilio')(accountSid, authToken);

//     console.log(accountSid)
//     console.log(authToken)
//     client.calls

//         .create({
//             url: 'http://demo.twilio.com/docs/voice.xml',
//             to: '+254726539744',
//             from: '+15005550006'
//         })
//       .then(call =>
//         {
//             res.status(200).send(call)

//         })
//     .catch((err)=>{
//         res.status(400).send(err)

//     })
//     // const ChatGrant = AccessToken.ChatGrant;
//     // const { TWILIO_ACCOUNT_SID } = process.env
//     // const { TWILIO_AUTH_TOKEN } = process.env
//     // const { TWILIO_SECRET } = process.env
//     // const { TWILIO_APP_SID } = process.env

//     // const voiceGrant = new VoiceGrant({
//     //     outgoingApplicationSid : TWILIO_APP_SID,
//     //     incoming: "allow"
//     // })
//     // const token = new AccessToken(
//     //     TWILIO_ACCOUNT_SID,
//     //     TWILIO_AUTH_TOKEN,
//     //     TWILIO_SECRET,
        
//     //     {identity:"RydrKey"}
//     // )

//     // token.addGrant(voiceGrant)


// })



//import user context
const User = require("./model/user");
const Traveler = require("./model/traveler");
const Message = require("./model/message")
const user = require("./model/user");
const Ride = require("./model/ride");
const Vehicle = require("./model/vehicle")
const Otp = require("./model/otp")
const decode = require("./decode");
const checkCarpoolViability = require("./checkCarpoolViability");
const { findOneAndUpdate } = require("./model/traveler");
// //Register
// app.use("/register", async (req, res) =>{
//     ///registration logic comes here
//     console.log("first")
//     try{
//         const{first_name, last_name, email,phone,password} = req.body;


//         console.log(req.body)
//         //validate user input
//         if(!(email&&password&&first_name&&last_name&&phone)){
//             return res.status(400).send("All input is required");
//         }

//         // Check if user is preset
//         const usedEmail = await User.findOne({email});

//         const usedPhone = await User.findOne({phone});

//         if(usedEmail||usedPhone){
//             return res.status(409).send("User Already Exists. Please Login")
//         }

//         let encryptedPassword
//         if(password)
//         {
//             encryptedPassword = await bcrypt.hash(password, 10);
//             console.log(encryptedPassword);
//         }
        



//         const user =  User.create({
//             first_name,
//             last_name,
//             email:email.toLowerCase(),
//             phone,
//             password:encryptedPassword
//         },
//         function(err, result){
//             console.log(result)
//             const traveler = Traveler.create({
//                 user_id:result._id,
//                 first_name,
//                 last_name,
//                 email:email.toLowerCase(),
//                 phone,  
//             })



//             // const token = jwt.sign(
//             //     {user_id : result._id, email,first_name,last_name,phone},
//             //     process.env.TOKEN_KEY,
//             //     {
//             //         expiresIn:"2h",
//             //     }
//             // );

//             // user.token = token;

//             //return new user
//             res.status(201).json(result);
//         }
//         );

        

     
//     }catch(err){
//         console.log(err)
//     }
// });





//Login
// app.use("/login", async(req, res)=>{
//     ///login logic
//     try{
//         const { emailorphone, password } = req.body;
//         if(!(emailorphone&&password)){
//             res.status(400).send("All input is required");
//         }
//         console.log(req.body)
//         const userEmail = await User.findOne({emailorphone});
//         const userPhone = await User.findOne({emailorphone})

//         if((userEmail && (await bcrypt.compare(password, userEmail.password)))|| userPhone && (await bcrypt.compare(password, userPhone.password))){
//             const token = jwt.sign(
//                 {user_id : userEmail._id, first_name: userEmail.first_name, last_name: userEmail.last_name, email: userEmail.email, phone: userEmail.phone  },
//                 process.env.TOKEN_KEY,
//                 {
//                     expiresIn:"2h",
//                 }
//             );
//             userEmail.token = token;

//             res.status(200).json(userEmail.token)

//         }
//         res.status(400).send("Invalid Credentials")

//     }
//     catch(err){
//         console.log(err)

//     }
// })


app.use("/phone-login", async(req,res)=>{
    const { phone:phone, code:code} = req.body


    console.log(req.body)
    try{
        Otp.findOneAndDelete({phone:phone,otp:code},
            function async(err,result){
                if(result){

                    Traveler.findOne({phone:phone}, function(err,result){
                        if(result){
                            console.log( process.env.TOKEN_KEY)
                            const token = jwt.sign(result.toJSON(), process.env.TOKEN_KEY , {expiresIn:604800});
                            res.status(200).send(token)
                            
                        }
                        else{
                            res.status(201).send("No user found")
 
                        }
                    })
                   
                }
                else{
                    console.log("Error")
                    res.status(400).send("Error")
                }
            })
    }
    catch(e){
     console.log(e)
    }
})

app.use("/create-otp", async(req,res)=>{
    const { phone } = req.body


    console.log(req.body)

    const code = Math.floor(1000 + Math.random() * 9000)
    try{

        const usr = await User.findOne({phone:phone})
        console.log(usr)

        if(usr){
            await Otp.findOneAndDelete({phone:phone})

            const otp = await Otp.create({
                phone:phone,
                otp: code
            }
            )
    
            res.status(200).send(otp)
        }
        else{
            await Otp.findOneAndDelete({phone:phone})

            const otp = await Otp.create({
                phone:phone,
                otp: code
            }
            )
            res.status(400).send("No user found") 
        }
        


    }
    catch(e){
        await Otp.findOneAndDelete({phone:phone})

        const otp = await Otp.create({
            phone:phone,
            otp: code
        }
        )
        res.status(400).send(e)
    }
})

app.use("/createuser", async(req,res)=>{
    const {phone, first_name, last_name, id_number} = req.body


    console.log(req.body)
    try{
        User.create({
            phone:phone,
            first_name:first_name,
            last_name:last_name,
            id_number:id_number
        }, function(err, result){
            if(result){
                console.log(result)
               
                Traveler.create({
                    user_id:result._id,
                    first_name:result.first_name,
                    last_name:result.last_name,
                    phone: result.phone,  
                },
                function(err,result){
                    if(result){
                        console.log( process.env.TOKEN_KEY)
                        const token = jwt.sign(result.toJSON(), process.env.TOKEN_KEY);
                        res.status(200).send(token)
                        
                    }
                    else{
                        res.status(201).send("No user found")

                    }
                })


            }
            else{
                console.log(err)
                res.status(400).send(err)
            }
        })
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

app.use("/getuserdetails", async(req,res)=>{
    const { user_id } = req.body
    console.log(req.body)

    let user
    let traveler
    let vehicle
    try{
       user = await User.findOne({_id:user_id})
       traveler = await Traveler.findOne({user_id:user_id})
       vehicle = await Vehicle.findOne({user_id:user_id})
    }
    catch(e){
        res.status(203).json(e)

    }

    
    

    const return_data = {
        user:user,
        traveler:traveler,
        vehicle:vehicle
    }
    console.log(return_data)

    res.status(200).json(return_data)
})


app.use("/updateuser", async(req,res)=>{
    const {user_id, gender, date_of_birth} = req.body

    try{
        await User.findByIdAndUpdate(user_id,{gender:gender, date_of_birth:date_of_birth, id_verified:true}
        ,
        function(err,result){
            if(result){
                const token = jwt.sign(result.toJSON(), process.env.TOKEN_KEY , {expiresIn:604800});
                res.status(200).send(token)
            }
        })
    }
    catch(e){
        res.status(400).send("Failed")
    }
})




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
    const { user_id, mode } = req.body

    console.log(req.body)
    if(mode=="Passenger")
    {
        try{
        const update = await Traveler.findOneAndUpdate({user_id:user_id}, {mode:mode})

                            const token = jwt.sign(update.toJSON(), process.env.TOKEN_KEY , {expiresIn:604800});
                            res.status(200).send(token)
             
            res.status(200).json(token)
    
        }
        catch(err){
            console.log(err)
        }
    }
    else{
        try{
            const vehicle = await Vehicle.findOne({user_id:user_id})

            if(vehicle)
            {

                try{
                    const update = await Traveler.findOneAndUpdate({user_id:user_id}, {mode:mode})
                    const token = jwt.sign(update.toJSON(), process.env.TOKEN_KEY , {expiresIn:604800});
                    res.status(200).send(token)
             
                }
                catch(e){
                    res.status(400).send("Failed")
                }

            }
            else{
                res.status(400).send("Failed")
            }
         
             
            
    
        }
        catch(err){
            console.log(err)
        }

    }
    

    
})

app.use("/messages", async(req,res)=>{

    const  { ride_id } = req.body
    console.log(req.body)

    try{
        const messages = await Message.find({ride_id:ride_id})
        res.status(200).send(messages)
    }
    catch(e){
        res.status(400).send("No Messages to show")
        console.log(e)

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
        const { user_id, latitude, longitude, origin_name } = req.body
        const lat = await Traveler.findOneAndUpdate({user_id:user_id}, {$push:{origin:latitude}})
        const lng =await Traveler.findOneAndUpdate({user_id:user_id}, {$push:{origin:longitude}})
        await Traveler.findOneAndUpdate({user_id:user_id}, {origin_name:origin_name})


        res.status(200).json(lng)

    }
    catch(err){
        console.log(err)
    }
    
})

app.use("/destination", async(req, res)=>{
    try{
        const { user_id, latitude, longitude, destination_name } = req.body
        const lat = await Traveler.findOneAndUpdate({user_id:user_id}, {$push:{destination:latitude}})
        const lng =await Traveler.findOneAndUpdate({user_id:user_id}, {$push:{destination:longitude}})
        await Traveler.findOneAndUpdate({user_id:user_id}, {destination_name:destination_name})

        res.status(200).json(lng)

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
    const {driver_id} = req.body

    console.log(req.body)
    try{

        await Ride.findAndModify({driver_id:driver_id}, {status:"Done"})
        const ride = Ride.create({
            driver_id:driver_id,
            status:"booked"
        }, function(err, result){
            if(err)
            {
                res.status(400).json(err)
            }
            else{
                console.log(result._id );
                Ride.findOneAndUpdate({_id:result._id}, {$push: {carpoolers: driver_id}},
                    function(err, result)
                    {
                        if(err){
                            res.status(400).json(err)
                        }
                        if(result){
                            res.status(200).json(result)
                        }
                    })
                   


            }

        })
        

    }
    catch(err){
        res.status(400).json(err)
    }

    
})

app.use("/get-ride", async(req,res)=>{
    const {ride_id}= req.body


    console.log(req.body)
    try{
        let ride = await Ride.findOne({_id:ride_id})

        console.log(ride)
        ride = { ride }

        
        
        console.log(ride)

        let dets = []

        
        let carpoolers_data = []


        let count = 0
            ride.ride.carpoolers.forEach(async (user_id)=>{
            let user
            let traveler
            let vehicle
            try{
                user = await User.findOne({_id:user_id})
                traveler = await Traveler.findOne({user_id:user_id})
                vehicle = await Vehicle.findOne({user_id:user_id})
                const return_data = {
                    user:user,
                    traveler:traveler,
                    vehicle:vehicle
                }

                count = count+1
                carpoolers_data.push(return_data)

                if(ride.ride.carpoolers.length == count)
                {
                    ride["carpoolers_details"] = carpoolers_data
                    res.status(200).send(ride)

                }
                
                console.log(carpoolers_data)
            }
            catch(e){
                console.log(e)
            }
            
            
        })
        
        


        console.log(ride.carpoolers_details)
        // res.status(200).send(ride)
       
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send("No ride found")
    }
})

app.use("/updateride", async(req,res)=>{
    const { id,status ,member_id } = req.body
    try{
        if(status )
        {
            const ride = await Ride.findOneAndUpdate({_id:id},{status:status})
            res.status(200).json(ride)
        }
        
    }
    catch(e){
        res.status(400).json(err)
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
    const { _id, carpooler } = req.body

    console.log(req.body)

    try{
        const update = await Ride.findByIdAndUpdate(_id, {$push: {carpoolers: carpooler}})
        console.log("This is the updated one", update)
        res.status(200).json(update)

    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }

})



app.use("/getdirections", async(req, res)=>{

    const { user_id, source_latitude, source_longitude, destination_latitude, destination_longitude } = req.body


    console.log("This is the request body for the get directions endpoint",req.body)


    console.log(user_id,source_latitude,source_longitude,destination_latitude,destination_longitude)

    try{
        const directions = await googleMapDirections(source_latitude, source_longitude, destination_latitude, destination_longitude)
        console.log(directions)
        const update = await Traveler.findOneAndUpdate({user_id:user_id}, {directions: directions.routes[0].overview_polyline.points})
        const duration = await Traveler.findOneAndUpdate({user_id:user_id}, {duration: directions.routes[0].legs[0].duration.value})
        const distance = await Traveler.findOneAndUpdate({user_id:user_id}, {distance: directions.routes[0].legs[0].distance.value})

    
        console.log("Tjis is the updated user>>>>>>>>>",update)
        console.log("These are the directions", directions.routes[0])
        res.status(200).json(directions.routes[0].overview_polyline.points)
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)

    }


  
    
})

app.use("/setorigin", async(req,res)=>{
    const {user_id ,source_latitude, source_longitude } = req.body

    try{
        await findOneAndUpdate({user_id:user_id},)
    }
    catch(e){

    }
})

app.use("/getdrivers", async(req, res)=>{


    console.log(req.body)
    const { source_latitude, source_longitude, destination_latitude, destination_longitude } = req.body

    let user = {
                    origin:[source_latitude,source_longitude],
                    destination:[destination_latitude,destination_longitude]
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
                        console.log(e)
                        throw(e)

                    }
                })

            res.status(200).json(viableDrivers)
        }
    }) 
    });

app.use("/getviablerides", async(req,res)=>{
    const { source_latitude, source_longitude, destination_latitude, destination_longitude } = req.body

        let user = {
                    origin:[source_latitude,source_longitude],
                    destination:[destination_latitude,destination_longitude]
                }
        const drivers = Traveler.find({mode: "Driver"}, function(err, result){
        if(err)
        {
            console.log(err)
        }
        else{
            let viableRides = []

            result.forEach((driver)=>{

                let coords = decode(driver.directions)


                try{
                    let viability = checkCarpoolViability(coords, user)


                    if(viability == true)
                    {
                        const ride = Ride.find({status:"booked"},
                        function(err, result){
                            if(result){
                                let count = 0
                                result.forEach((ride)=>{

                                    viableRides.push({ride,driver})
                                    count+=1

                                    if(count == result.length){
                                        res.status(200).json(viableRides)
                                    }
                                })
                                
                                
                                console.log({result,driver})
                            }
                        })
                    }

                }
                catch(e){
                    console.log(e)
                    throw(e)

                }
            })

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


module.exports = app;