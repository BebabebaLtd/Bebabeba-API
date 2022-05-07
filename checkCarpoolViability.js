const geolib = require('geolib')

const checkCarpoolViability=(points, user)=>{
    let viableCarpooler = false
    if(user.origin.latitude && user.origin.longitude && user.destination.latitude && user.destination.longitude)
    {
        points.forEach(element => {
            viableSource = false
            viableDestination = false
        
    
        
            viableSource = geolib.isPointWithinRadius(
                {latitude : user.origin.latitude, longitude:  user.origin.longitude},
                {latitude : element[0], longitude:  element[1]},
                5000
            )
            viableDestination = geolib.isPointWithinRadius(
                {latitude : user.destination.latitude, longitude:  user.destination.longitude},
                {latitude : element[0], longitude:  element[1]},
                5000
            )
        
            
        
            if(viableDestination==true && viableDestination == true){
                viableCarpooler = true
            }
            
            
            
        });
    }
  
    return viableCarpooler

}

module.exports = checkCarpoolViability