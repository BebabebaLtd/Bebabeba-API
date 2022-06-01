const axios = require('axios')

const googleMapDirections = async(srcLat, srcLng, destLat, destLng)=> {
    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+srcLat+','+srcLng+'&destination='+destLat+','+destLng+ '&mode=driving&key=AIzaSyAu19oy2n9MFMcXx_zug-IMJX5oUXqhnyg',
      headers: { }
    };
    console.log(config.url)
    let result = await axios(config)
    .then(function (response) { 

        return response.data
    }
    )
    .catch(function (error) {
      console.log(error);
    });

    return result

    
}


module.exports = googleMapDirections