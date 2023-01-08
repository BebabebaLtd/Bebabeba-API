const { pusher } = require("./config/database");

const exec=()=>{
    pusher.trigger(
        "629f769355c35c5f288bb98c",
        'updated', 
        {
            user: "Hello"
        }
    );
}

exec()