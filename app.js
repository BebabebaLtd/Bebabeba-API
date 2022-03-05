require("dotenv").config();
require("./config/database").connect();

// const google = require("googleapis")
const { GOOGLE_CLIENT_ID } = process.env
const { GOOGLE_CLIENT_SECRET } = process.env
const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("./middleware/auth");
const jwt = require('jsonwebtoken')
const app = express();
const passport = require('passport')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/welcome", (req,res)=>{
    res.status(200).send("Welcome");
});



//import user context
const User = require("./model/user");

//Register
app.use("/register", async (req, res) =>{
    ///registration logic comes here
   console.log("Hi")
    try{
        console.log(req.body)
        const{first_name, last_name, email,phone,password} = req.body;

        //validate user input
        if(!(email&&password&&first_name&&last_name&&phone)){
            return res.status(400).send("All input is required");
        }

        console.log(User)
        // Check if user is required
        const usedEmail = await User.findOne({email});

        const usedPhone = await User.findOne({phone});

        if(usedEmail||usedPhone){
            return res.status(409).send("User Already Exist. Please Login")
        }

        encryptedPassword = await bcrypt.hash(password, 10);
        console.log(encryptedPassword);



        const user =  User.create({
            first_name,
            last_name,
            email:email.toLowerCase(),
            phone,
            password:encryptedPassword
        });

        const token = jwt.sign(
            {user_id : user.id, email,first_name,last_name,phone},
            process.env.TOKEN_KEY,
            {
                expiresIn:"2h",
            }
        );

        user.token = token;

        //return new user
        res.status(201).json(user);
    }catch(err){
        console.log(err)
    }
});


//Login
app.use("/login", async(req, res)=>{
    ///login logic
    try{
        const { emailorphone, password } = req.body;
        
        if(!(emailorphone&&password)){
            res.status(400).send("All input is required");
        }
        const userEmail = await User.findOne({emailorphone});
        const userPhone = await User.findOne({emailorphone})

        if((userEmail && (await bcrypt.compare(password, userEmail.password)))|| userPhone && (await bcrypt.compare(password, userPhone.password))){
            const token = jwt.sign(
                {
                    emailorphone:emailorphone,
                    isVerified:false
                }

            )
            userEmail.token = token;

            res.status(200).json(userEmail.token)

        }
        res.status(400).send("Invalid Credentials")

    }
    catch(err){
        console.log(err)

    }
})

///For google login
// const googleConfig={
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     redirect: 'http://localhost:4000/auth/google/'
// };

// function createConnection(){
//     return new google.auth.OAuth2(
//         googleConfig.clientId,
//         googleConfig.clientSecret,
//         googleConfig.redirect
//     );
// }
app.use(express.json());

module.exports = app;