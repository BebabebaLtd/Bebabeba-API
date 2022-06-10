const http = require("http");
const app = require("./app");
const server = http.createServer(app)
const Pusher = require('pusher');


const { PORT } = process.env;
const { MONGO_URI } = process.env
const port = process.env.PORT || PORT

server.listen(port, () =>{
    console.log(`Server running on port ${port}`)
    console.log(`Server running on port ${MONGO_URI}`)
})
const pusher = new Pusher({
    appId      : '1421745',
    key        : '5d04aa1d0893f7e00bb2',
    secret     : '7e159705067585400435',
    cluster    : 'eu',
    encrypted  : true,
  });
const channel = 'coordinates';