const express = require("express");
const route = express.Router();  //umesto app ovde koristimo route
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require("../models/User");

route.post("/login", async (req, res)=>{
    try{
    //pronadjemo
    let users = await User.find({
        _id: req.body._id,
        pass: req.body.pass
    });
    //ako ima saljemo klijentu json odgovor
    //ako nema saljemo 400
    if(users){
        /*const usr={
            _id:req.body._id,
            pass:req.body.pass
        }*/
        const token = jwt.sign(req.body._id,process.env.ACCESS_TOKEN_SECRET);
        res.json({token: token});
    }
    else {
        res.status(400).json({msg: "Ne postoji user sa unetim id i passwordom."});
    }
    } catch(err){
    res.status(500).json(err);
    }
});

route.post("/register", async(req, res)=>{
    try{
    //primer json zahteva koji saljemo - kopiraj ovo u body requesta u thunder client
    /*
{
    "_id": "@m_axelaa_",
    "pass":"dzumijezut",
    "name": "Aleksa",
    "surname": "Maricic",
    "birthYear": 2005,
    "telnum": "+381655062789",
    "city": "Smederevska Palanka",
    "picture": "/app/public/logo.png"
}
    */
    //json koji smo poslali u body ce biti isparsovan kroz body-parser i u body imamo spreman objekat
    
    //sada hocemo da napravimo novi User model (objekat) i napunimo ga podacima iz req.body, pa da sacuvamo to

    let newUser = new User();
    newUser._id = req.body._id;
    newUser.pass=req.body.pass;
    newUser.name = req.body.name;
    newUser.surname = req.body.surname;
    newUser.birthYear = req.body.birthYear;
    newUser.telnum=req.body.telnum;
    newUser.city = req.body.city;
    newUser.picture =req.body.picture;
    newUser.plansid= req.body.plansid;

    console.log(newUser);


    //res.send(newUser); //kao odgovor vratimo json tog modela koji je kreiran, ovde treba da imamo i ID

    const token = jwt.sign(newUser._id,process.env.ACCESS_TOKEN_SECRET);
    res.json({token: token});

    await newUser.save();  //ovo salje poruku na mongo 
    }catch(err){
    res.status(500).json(err);
    }
});

//ucinimo definisane rute dostupnim u app.js
module.exports= route;