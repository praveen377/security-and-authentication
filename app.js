//jshint esversion:6
//require .env file to keep secrets
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
//for encryption this package is required
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true , useNewUrlParser: true })

//make a schema named as userschema
const userschema =new mongoose.Schema({
    email:String,
    password:String
});

//this is the key
// this is the secret key any one can see this
//and use to decrpt our secrets 
//this is not good
// to overcome this ambiguity we use .env file to keep secrets secure
// const secret = "thisissecret";

secret = process.env.SECRET;

//make a secret plugins before making collections
userschema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

//make a collection named as User(in data base it is plural form(users))
const User = new mongoose.model("User",userschema);



app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});


app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });

})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,founduser){

        if(err)
        {
            console.log(err);
        }
        else
        {
            if(founduser){
                if(founduser.password===password)
                {
                    res.render("secrets");
                }
            }
        }

    });
});

app.listen(3000,function()
{
    console.log("server is running on 3000 port");
})
