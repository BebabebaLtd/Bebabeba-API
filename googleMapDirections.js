const axios = require('axios')

const googleMapDirections = async(srcLat, srcLng, destLat, destLng)=> {
    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+srcLat+','+srcLng+'&destination='+destLat+','+destLng+ '&mode=driving&key=AIzaSyB0VZQy9-x8UEsjC6sTrQbRe5UohJn8fH0',
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