const AfricasTalking = require('africastalking');

// TODO: Initialize Africa's Talking
const africasTalking = AfricasTalking({
    apiKey:'26a2f97b624f315d186d3579901f86f8c8b3868089d41c4c65740bd1285d58a2',
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