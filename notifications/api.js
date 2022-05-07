
const express = require("express");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router()
const FCM = require('fcm-node')


router.post("/sendnotification",async(req, res)=>{
    const {title , msg, user_id,token  }  = req.body

    console.log(req.body)
    const serverKey = require("../rydr-aff11-firebase-adminsdk-a30ws-a8274d05d9.json")
    const fcm = new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        notification: {
            title: title, 
            body: String(msg)
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            user_id: user_id
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

  

    // console.log(title, text)

    
    // const tokens = ["dW1k5yKIS8G5E7h_cgcQ2J:APA91bEXsfWjB0qTnp_KrGK7ib9QAu7YjTlWi1-YB50o9dr1Lm7bfaI7_g-YRe1xT3_eVbUgzNZ09V79Pm0vzIxXsPfcd04nsZp313J-LKY6Ynaz1Qar9jEEppCN8-IZWgX_IGfM4lpZ"]
    // var notification_body = {
    //     notification:notification,
    //     registration_ids:tokens
    // }

    // console.log(notification_body)
    // const response = await fetch("https://fcm.googleapis.com/fcm/send",{
    //     "method":"POST",
    //     "headers":
    //     {
    //         "Authorization":"key=AAAAn3pNfKE:APA91bH4Zo52V1omevWd6trmBo_VHEX4eagwcfVHy8YhB1jvAs66KRQ-ObNa_rZ4xWAGUn1Ci_5dS2kLnPuHGiYRcMP5aNfXECqgL69lLD-bZfCeGESpvBqA3UPfo4zUTor734BITvuC",
    //         "Content-Type":"application/json"
    //     },
    //     "body":JSON.stringify(notification_body)
    // })
    // console.log(response.status )



})

module.exports = router;
