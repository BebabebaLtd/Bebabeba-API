var polyline = require('google-polyline')
const geolib = require('geolib')


const decode=(encodedPoints)=>{
    let decoded = polyline.decode(encodedPoints)
    console.log(decoded)
    return decoded
}





module.exports = decode

