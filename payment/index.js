

let unirest = require('unirest');
// const got = require("got")
const axios  = require("axios")

const Mpesa = require("mpesa-api").Mpesa;

const serverKey = require("../rydr-aff11-firebase-adminsdk-a30ws-a8274d05d9.json");

const Payment = require('../model/payment')
const Traveler = require('../model/traveler')
const Wallet = require('../model/wallet')

const credentials = {
    clientKey: 't9pqmMLDI8AZA5kGN9iDUEopHZi9AJPq',
    clientSecret: '7u3FOrtU9CuR1HDE',
    initiatorPassword: 'MTc0Mzc5N3UzRk9ydFU5Q3VSMUhERTIwMjMwMTE0MDcyNDU5',
};
const environment = "sandbox";

const mpesa = new Mpesa(credentials, environment);

//or
// const environment = "production";
 

// const fcm = new FCM(serverKey);



const generateToken=async()=>{
    const config = {
        method: 'get',
        url: "https://sandbox.safaricom.co.ke/oauth/v1/generate",
        headers: {
          'Accept': 'application/json',
          "Authorization": "Basic QXpzMktlalUxQVJ2SUw1SmRKc0FSYlYyZ0RyV21wT0I6aGlwR3ZGSmJPeHJpMzMwYw==",
          "Username": "Azs2KejU1ARvIL5JdJsARbV2gDrWmpOB",
          "Password": "hipGvFJbOxri330c"
          // "Content-Type": "application/x-www-form-urlencoded"
        },
        params: {
            grant_type: "client_credentials"
        },
    }

    const res = await axios(config)
    console.log(res)
    return(res.data)
}

const stkPush=async(amount,phone, token, user_id, driver_id, payment_type)=>{
    const config={
        method: 'post',
        url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {    
            "BusinessShortCode":"174379",    
            "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",    
            "Timestamp":"20160216165627",    
            "TransactionType": "CustomerPayBillOnline",    
            "Amount":amount,    
            "PartyA":phone,    
            "PartyB":"174379",    
            "PhoneNumber":phone,    
            "CallBackURL":`https://rydr.eu-gb.cf.appdomain.cloud/handler?user_id=${user_id}&amount=${amount}&type=${payment_type}&recepient_id=${driver_id}`,    
            "AccountReference":"Test",    
            "TransactionDesc":"Test"
         }
    }

    const res = await axios(config)
    console.log("c2b")
    // console.log(token)

    return res.data
}

const transactionStatus=async(CheckoutRequestID, token)=>{
    const config = {
        method: 'post',
        url: "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data:{
            "BusinessShortCode":"174379",    
            "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",    
            "Timestamp":"20160216165627",    
            "CheckoutRequestID": CheckoutRequestID
        }
    }

    const res = await axios(config)
    return(res.data)
}

const b2c=()=>{
    mpesa
  .b2c({
    Initiator: "Initiator Name",
    Amount: 1000 /* 1000 is an example amount */,
    PartyA: "Party A",
    PartyB: "Party B",
    QueueTimeOutURL: "Queue Timeout URL",
    ResultURL: "Result URL",
    CommandID: "Command ID" /* OPTIONAL */,
    Occasion: "Occasion" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });
}

const c2b=(amount, phone)=>{
    console.log("c2b")
    let req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate')
    .headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer GUA0iurpHPulOcwueYbQyJqMYvj3'
    })
    .send(JSON.stringify({
        "ShortCode": 600987,
        "CommandID": "CustomerBuyGoodsOnline",
        "amount": "100",
        "MSISDN": phone,
        "BillRefNumber": "12345678",
    }))
    .end(res => {
        console.log("This is the error",res.raw_body)
        if (res.error) throw new Error(res.error);
        console.log(res.raw_body);
    });
    return req
}
const createOrUpdateWallet=async(amount, user_id, subscribed)=>{
    console.log(amount, user_id, subscribed)
    let updated

    const wallet = await Wallet.findOne({user_id:user_id})
    if(wallet){
        console.log(wallet)
        let amt =  wallet.balance + parseInt(amount)
        console.log(amt)
        updated = await Wallet.findOneAndUpdate({user_id:user_id},{ subscribed: subscribed})    
    }
    else{
        await Wallet.create({user_id:user_id,subscribed: subscribed}) 
    }

    return updated
}

const createPayment=async(amount, user_id, recepient_id)=>{
    const wallet = await Wallet.findOne({user_id:recepient_id})
    await Payment.create({user_id:user_id, amount:amount, recepient_id:recepient_id})
    if(wallet){
        let amt =  wallet.balance + parseInt(amount)
        console.log(amt)
        const res = await Wallet.findOneAndUpdate({user_id: recepient_id},{ balance: amt})
        console.log("object",res)
    }
    else{
        const res = await Wallet.create({user_id: recepient_id, balance: parseInt(amount)})
        console.log("object2",res)
    }
    return wallet
}


module.exports = {stkPush, b2c, c2b, generateToken, createOrUpdateWallet, createPayment, transactionStatus}