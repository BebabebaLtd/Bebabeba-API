const http = require("http");
const app = require("./app");
const server = http.createServer(app)

const { API_PORT } = process.env;
const { MONGO_URI } = process.env
const port = process.env.PORT || API_PORT

server.listen(port, () =>{
    console.log(`Server running on port ${port}`)
    console.log(`Server running on port ${API_PORT}`)
    console.log(`Server running on port ${MONGO_URI}`)
})