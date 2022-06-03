const geolib = require('geolib')

const checkCarpoolViability=(points, user)=>{
    let viableCarpooler = false
    if(user.origin[0] && user.origin[1] && user.destination[0] && user.destination[1] )
    {
        points.forEach(element => {
            viableSource = false
            viableDestination = false
        
    
            viableSource = geolib.isPointWithinRadius(
                {latitude : user.origin[0], longitude:  user.origin[1]},
                {latitude : element[0], longitude:  element[1]},
                5000
            )
            viableDestination = geolib.isPointWithinRadius(
                {latitude : user.destination[0], longitude:  user.destination[1]},
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