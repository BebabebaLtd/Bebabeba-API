const AfricasTalking = require('africastalking');

// TODO: Initialize Africa's Talking
const africasTalking = AfricasTalking({
    apiKey:'b5d18c8c0a469e2a70e7e3357a82f8aeb2066dd47346c234707b468c722297af',
    username:'TomiTsuma'
})


module.exports = async function sendSMS(phone,message) {
    
    // TODO: Send message
    try{
        const result = await africasTalking.SMS.send({
            to:"+"+phone,
            message: message
        })
        console.log(result)
    }catch(exception){
        console.log(exception)
    }

};