
const express = require("express");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router()
const FCM = require('fcm-node')

const Traveler = require("../model/traveler");
const User = require("../model/user")


router.post("/sendnotification",async(req, res)=>{
    console.log(req.body)
    const {title , msg, user_id,token , price, time, duration, seats, name,distance,notification_type }  = req.body
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
    const serverKey = require("../rydr-aff11-firebase-adminsdk-a30ws-a8274d05d9.json")
    const fcm = new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        notification: {
            title: title, 
            body: String(msg),
            tag:String(notification_type),
        },  
        data: { 
            my_key: 'my value',
            user_id: String(user_id),
            price: String(price),
            duration: String(duration),
            time: String(time),
            notification_type:String(notification_type),
            seats:String(seats),
            name:String(name),
            distance:String(distance),
            return_token:String(return_token)
        }
    
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err)
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

  


})

module.exports = router;
