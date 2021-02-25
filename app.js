//jshint esversion:6
//require .env file to keep secrets
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");

//this library is used for salting the data
const bcrypt = require("bcrypt");
// this specify how much round you want to salting.
const saltRounds = 10;



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

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser = new User({
            email: req.body.username,
            password: hash
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
                bcrypt.compare(password,founduser.password,function(error,result){
                    if(result === true)
                    res.render("secrets");
                });
            }
        }

    });
});

app.listen(3000,function()
{
    console.log("server is running on 3000 port");
})
