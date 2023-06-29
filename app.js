//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require ("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine" , "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User" , userSchema);

app.get("/",(req,res)=>{
    res.render('home');
});

app.get("/login",(req,res)=>{
    res.render('login');
});

app.get("/register",(req,res)=>{
    res.render('register');
});

app.get("/logout",(req,res)=>{
    res.redirect("/");
})

app.post("/register",(req,res) => {
    const newUser = new User({
        email : req.body.userName,
        password : req.body.password
    });
    newUser.save().then(()=>res.render("secrets"));
});

app.post("/login",(req,res)=>{
    User.findOne({email : req.body.userName})
        .then((foundUser)=>{
            if(foundUser){
                if (foundUser.password === req.body.password){
                    res.render("secrets");
               }else(res.send("password is wrong"));
            }else(res.send("no username"));
        });
});



app.listen(3000 , function(){
    console.log("Server is Running");
})