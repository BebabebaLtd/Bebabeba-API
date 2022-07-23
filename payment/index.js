
const express = require("express");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router()
const FCM = require('fcm-node')
let unirest = require('unirest');

const serverKey = require("../rydr-aff11-firebase-adminsdk-a30ws-a8274d05d9.json");

const Payment = require('../model/payment')
const Traveler = require('../model/traveler')

// const fcm = new FCM(serverKey);

router.post("/subcribe", async(req, res)=>{
    const {amount , user_id} = req.params
    console.log(req)


    try
    {
        Payment.create({
            amount:amount,
            user_id:user_id
        }, function(err, response){
            if(err)
            {
                console.log("Something went wrong")
            }
            if(response)
            {
                const traveler = Traveler.findOne({user_id}, function(err, response){
                    if(response)
                    {
                        token = response.devToken
                        var message = {
                            to: token, 
                            notification: {
                                title: title, 
                                body: "Your payment was successful",
                            }
                        };

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

                    }
                })
            }
        })
    }
    catch(e)
    {

    }
})


router.post("/stk", async(req, response)=>{
    const { user_id, amount } = req.body
    let request = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer B7YedyqBdSUnbkFG6GXMDAbZC1FV'
    })
    .send(JSON.stringify({
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIwNzIzMDk1NDEz",
        "Timestamp": "20220723095413",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": 254726539744,
        "PartyB": 174379,
        "PhoneNumber": 254726539744,
        "CallBackURL": `https://rydr.eu-gb.cf.appdomain.cloud/pay/subscribe?user_id=${user_id}&amount=${amount}`,
        "AccountReference": "Rydr",
        "TransactionDesc": "Payment of Driver Fees" 
      }))
    .end(res => {
        if(res.error) 
        {
            console.log(res.error)
            response.status(400).send(res.error)
        }
        else{
            
            console.log(res.body)
            response.status(200).send(res.body)
        }
        
    });
})

module.exports = router