
const express = require("express");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router()
const FCM = require('fcm-node')

const Traveler = require("../model/traveler");
const User = require("../model/user")
const Message = require("../model/message")


const serverKey = require("../rydr-aff11-firebase-adminsdk-a30ws-a8274d05d9.json");
const message = require("../model/message");
const fcm = new FCM(serverKey);
router.post("/sendnotification",async(req, res)=>{
    console.log(req.body)
    // const {title , msg, user_id,token , price, time, duration, seats, name,distance,notification_type }  = req.body
    const {title , msg, user_id,token , data }  = req.body
    let return_token = ''
    try{
        const user = await User.findOne({user_id});
        console.log("The user",user)



        const traveler = await Traveler.findOne({user_id})
        console.log("The traveler is",traveler)


        return_token = traveler.devToken
        console.log("The return token is",return_token)

    }
    catch(e){
        console.log(e)
    }
    
    console.log(req.body)

    data["return_token"] = return_token
    

    var message = {
        to: token, 
        notification: {
            title: title, 
            body: String(msg),
        },  
        data:data
        
    
    };

    console.log(message)

    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err)
            res.status(400).json(err)
        } else {
            console.log("Successfully sent with response: ", response);
            res.status(200).json(response)
        }
    });

  


})

router.post("/sendmessage", async(req,res)=>{
    console.log(req.body)
    const {ride_id, user_id, message, user_name } = req.body
    const msg = Message.create({
        ride_id: ride_id,
        user_id: user_id,
        message : message,
        user_name: user_name
    },
    function(err, result){
        if(err){
            console.log(err)
            res.status(400).send(err)
        }
        else{


            var msg = {
                
                to: `/topics/${String(ride_id)}`, 
                notification: {
                    title:  user_name, 
                    body: message,
                }
            };
            console.log(msg)
        
            
            fcm.send(msg, function(err, response){
                console.log(msg)
                if (err) {
                    console.log("Something has gone wrong!");
                    console.log(err)
                    // res.status(400).json(err)
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
            console.log(result)
            res.status(200).json(result)

        }
    })
})


router.use("/messages", (req,res)=>{
  const  { ride_id } = req.body

  console.log(req.body)
  const messages = Message.find({ride_id:ride_id},
    function(err, result){
        if(err)
        {
            res.status(400).send("No Messages to show")
        }
        else{
            console.log(result)
            res.status(200).send(result)
        }
    })
})
module.exports = router;
